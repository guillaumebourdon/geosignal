/**
 * Manual consolidation + PDF trigger — bypasses QStash signature.
 * Protected by admin secret. Use when QStash callback fails silently.
 *
 * GET /api/pro-trigger-consolidation?siteJobId=xxx&secret=yyy
 * GET /api/pro-trigger-consolidation?siteJobId=xxx&secret=yyy&action=reset-locks
 * GET /api/pro-trigger-consolidation?siteJobId=xxx&secret=yyy&action=run-consolidation  (direct, no QStash)
 * GET /api/pro-trigger-consolidation?siteJobId=xxx&secret=yyy&action=run-pdf            (direct, no QStash)
 */
import { Redis } from '@upstash/redis';
import Anthropic from '@anthropic-ai/sdk';
import { triggerConsolidation, triggerPdfGeneration } from '../../lib/proQueue';
import { generateProReportHTML } from '../../lib/proReportTemplate';

export const config = { maxDuration: 300 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const JOB_PREFIX = 'detekia:pro:v1:job';
const CONSOLIDATED_TTL = 7 * 24 * 60 * 60;
const ADMIN_SECRET = process.env.PRO_ADMIN_SECRET || 'detekia-pro-manual-2026';

async function callHaikuWithRetry(params, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await anthropic.messages.create(params);
    } catch (err) {
      const is429 = err?.status === 429
        || String(err?.message || err || '').includes('429')
        || String(err?.message || err || '').includes('rate_limit');
      if (is429 && attempt < maxRetries) {
        const retryAfter = Math.min(parseInt(err?.headers?.['retry-after'] || '0', 10) || (15 + attempt * 15), 60);
        console.log(`[pro-trigger] 429, waiting ${retryAfter}s (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        continue;
      }
      throw err;
    }
  }
}

function sanitizeJson(str) {
  // Remove control chars that break JSON.parse (literal newlines inside strings, etc.)
  return str.replace(/[\x00-\x1f\x7f]/g, ch => ch === '\n' || ch === '\r' || ch === '\t' ? ' ' : '');
}

function parseHaikuJson(raw) {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in Claude response');
  try { return JSON.parse(match[0]); } catch {
    return JSON.parse(sanitizeJson(match[0]));
  }
}

function parseHaikuArray(raw) {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('No JSON array in Claude response');
  try { return JSON.parse(match[0]); } catch {
    return JSON.parse(sanitizeJson(match[0]));
  }
}

export default async function handler(req, res) {
  const { siteJobId, secret, action } = req.query;

  if (secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Invalid secret' });
  if (!siteJobId) return res.status(400).json({ error: 'Missing siteJobId' });

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['host'] || 'localhost:3000';
  const baseUrl = `${proto}://${host}`;

  // ── Reset locks ────────────────────────────────────────────────────────
  if (action === 'reset-locks') {
    await Promise.all([
      redis.del(`${JOB_PREFIX}:${siteJobId}:consolidation_triggered`),
      redis.del(`${JOB_PREFIX}:${siteJobId}:pdf_triggered`),
      redis.del(`${JOB_PREFIX}:${siteJobId}:status`),
    ]);
    return res.status(200).json({ success: true, action: 'locks_reset', siteJobId });
  }

  // ── Run consolidation directly (no QStash) ─────────────────────────────
  if (action === 'run-consolidation') {
    const startMs = Date.now();
    try {
      const [totalRaw, metaRaw] = await Promise.all([
        redis.get(`${JOB_PREFIX}:${siteJobId}:total`),
        redis.get(`${JOB_PREFIX}:${siteJobId}:meta`),
      ]);
      const total = Number(totalRaw) || 0;
      const meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
      if (!total || !meta) return res.status(404).json({ error: 'Job not found' });

      const locale = meta.locale || 'fr';
      const rootUrl = meta.rootUrl;

      const pageKeys = Array.from({ length: total }, (_, i) => `${JOB_PREFIX}:${siteJobId}:page:${i}`);
      const pageResults = await Promise.all(pageKeys.map(k => redis.get(k).catch(() => null)));
      const pages = pageResults.map((raw, i) => {
        if (!raw) return { index: i, url: `page-${i}`, error: 'Result not found' };
        return typeof raw === 'string' ? JSON.parse(raw) : raw;
      });

      const validPages = pages.filter(p => !p.error && typeof p.score === 'number');
      const errorPages = pages.filter(p => p.error);
      const scores = validPages.map(p => p.score);
      const scoreAverage = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const sorted = [...scores].sort((a, b) => a - b);
      const scoreMedian = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : 0;
      const distribution = { faible: 0, moyen: 0, bon: 0 };
      scores.forEach(s => { if (s >= 70) distribution.bon++; else if (s >= 45) distribution.moyen++; else distribution.faible++; });

      const criteriaNames = [
        'Extractibilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T',
        'Crawlabilite IA', 'Donnees structurees', 'Neutralite editoriale',
        'Presence externe', 'Fraicheur & maintenance',
      ];
      const criteriaAverages = {};
      for (const name of criteriaNames) {
        const vals = validPages.map(p => (p.criteria || []).find(c => c.name === name)).filter(Boolean);
        if (vals.length > 0) {
          criteriaAverages[name] = {
            avgScore: Math.round(vals.reduce((s, c) => s + c.score, 0) / vals.length * 10) / 10,
            max: vals[0].max,
          };
        }
      }

      const langInstruction = locale === 'en'
        ? 'OUTPUT LANGUAGE: English (US). ALL text values MUST be in American English.'
        : 'LANGUE DE SORTIE : Francais. Toutes les valeurs texte en francais professionnel.';

      const pagesForPrompt = validPages.map(p => ({
        url: p.url, score: p.score,
        topRecos: (p.recommendations || []).slice(0, 3).map(r => `${r.criterion}: ${r.title || r.diagnostic || ''}`).join('; '),
      }));

      console.log(`[pro-trigger] Starting 3 Haiku calls for ${siteJobId}...`);

      // Call 1: Synthesis
      let synthesis = { executiveSummary: '', topStrengths: [], topWeaknesses: [], patterns: [], actionPlan: [] };
      try {
        const synthesisMsg = await callHaikuWithRetry({
          model: 'claude-haiku-4-5-20251001', max_tokens: 6000, temperature: 0.2,
          messages: [{ role: 'user', content: `${langInstruction}\n\nYou are a senior GEO consultant analyzing a FULL WEBSITE audit (${validPages.length} pages).\n\nSite: ${rootUrl}\nAverage GEO score: ${scoreAverage}/100\nDistribution: ${distribution.faible} low (<45), ${distribution.moyen} average (45-69), ${distribution.bon} good (70+)\n\nPages analyzed:\n${pagesForPrompt.map(p => `- ${p.url} (score: ${p.score}) — ${p.topRecos}`).join('\n')}\n\nCriteria averages:\n${Object.entries(criteriaAverages).map(([k, v]) => `- ${k}: ${v.avgScore}/${v.max}`).join('\n')}\n\nGenerate a comprehensive site-level analysis. JSON only, no markdown fences:\n{"executiveSummary":"2-3 paragraphs","topStrengths":["s1","s2","s3"],"topWeaknesses":["w1","w2","w3"],"patterns":[{"pattern":"desc","pagesAffected":["url"],"criterion":"name","severity":"critique|important|mineur"}],"actionPlan":[{"priority":1,"action":"desc","criterion":"name","impact":"eleve|moyen|faible","effort":"faible|moyen|eleve","pagesAffected":["url"]}]}\n\nRules:\n- executiveSummary: 2-3 substantial paragraphs\n- patterns: 5 to 8 cross-page patterns\n- actionPlan: 10 to 15 actions sorted by priority\n- Be specific to ${rootUrl}\n- IMPORTANT: output raw JSON only, no markdown, no explanation` }],
        });
        synthesis = parseHaikuJson(synthesisMsg.content[0].text);
        console.log(`[pro-trigger] Synthesis done. Patterns: ${(synthesis.patterns||[]).length}, Actions: ${(synthesis.actionPlan||[]).length}`);
      } catch (e) { console.error('[pro-trigger] Synthesis parse failed:', e.message); }

      // Call 2: Citation test
      let citationTest = { queries: [], citationRate: '0/30', bestOpportunity: '', mainBlocker: '' };
      try {
        const pageTitles = validPages.map(p => `${p.evidence?.metaTitle || p.url} (${p.url})`).slice(0, 10).join(', ');
        const citationMsg = await callHaikuWithRetry({
          model: 'claude-haiku-4-5-20251001', max_tokens: 8000, temperature: 0.3,
          messages: [{ role: 'user', content: `${langInstruction}\n\nYou are an AI visibility expert. Full site audit for ${rootUrl}.\nPages: ${pageTitles}\n\nGenerate 30 queries and simulate citations. JSON only, no markdown fences:\n{"queries":[{"query":"","type":"generic|niche|long_tail","cited":false,"competitorsCited":["c1"],"difficulty_to_rank":"easy|medium|hard","recommendation":"1 sentence"}],"citationRate":"X/30","bestOpportunity":"best query","mainBlocker":"main reason"}\n\nIMPORTANT: output raw JSON only, no markdown, no explanation` }],
        });
        citationTest = parseHaikuJson(citationMsg.content[0].text);
        console.log(`[pro-trigger] Citation test done. Rate: ${citationTest.citationRate}`);
      } catch (e) { console.error('[pro-trigger] Citation parse failed:', e.message); }

      // Call 3: Per-criterion
      let criteriaConsolidated = [];
      try {
        const criteriaForPrompt = Object.entries(criteriaAverages).map(([name, data]) => {
          const pagesBelow = validPages.filter(p => { const c = (p.criteria || []).find(cr => cr.name === name); return c && (c.score / c.max) < 0.75; });
          const examples = pagesBelow.slice(0, 3).map(p => { const c = (p.criteria || []).find(cr => cr.name === name); return `${p.url} (${c?.score}/${c?.max})`; });
          return `- ${name}: avg ${data.avgScore}/${data.max}, ${pagesBelow.length}/${validPages.length} pages below 75%. Examples: ${examples.join(', ') || 'none'}`;
        }).join('\n');

        const criteriaMsg = await callHaikuWithRetry({
          model: 'claude-haiku-4-5-20251001', max_tokens: 8000, temperature: 0.2,
          messages: [{ role: 'user', content: `${langInstruction}\n\nFor a site audit of ${rootUrl} (${validPages.length} pages, avg ${scoreAverage}/100), generate per-criterion analysis.\n\nCriteria data:\n${criteriaForPrompt}\n\nJSON array of 8 objects:\n[{"criterion":"exact name","synthesis":"2-3 sentences"}]\n\nRules: synthesis must reference specific numbers.\nIMPORTANT: output raw JSON array only, no markdown fences, no explanation` }],
        });
        criteriaConsolidated = parseHaikuArray(criteriaMsg.content[0].text);
      } catch (e) { console.error('[pro-trigger] Criteria parse failed:', e.message); }
      console.log(`[pro-trigger] Criteria done. Count: ${criteriaConsolidated.length}`);

      const fullPages = pages.map(p => ({
        url: p.url, score: p.score, error: p.error || null,
        topPriority: p.topPriority || null, verdict: p.verdict || null,
        strengths: p.strengths || [], criteria: p.criteria || [],
        recommendations: (p.recommendations || []).slice(0, 3),
      }));

      const consolidatedReport = {
        siteJobId, rootUrl, locale, queuedAt: meta.queuedAt,
        consolidatedAt: new Date().toISOString(),
        scoreAverage, scoreMedian, distribution,
        pagesValid: validPages.length, pagesWithError: errorPages.length,
        criteriaAverages, criteriaConsolidated,
        executiveSummary: synthesis.executiveSummary,
        topStrengths: synthesis.topStrengths || [], topWeaknesses: synthesis.topWeaknesses || [],
        patterns: synthesis.patterns || [], actionPlan: synthesis.actionPlan || [],
        citationTestConsolidated: citationTest, pages: fullPages,
      };

      await redis.set(`${JOB_PREFIX}:${siteJobId}:consolidated`, consolidatedReport, { ex: CONSOLIDATED_TTL });
      await redis.set(`${JOB_PREFIX}:${siteJobId}:status`, 'consolidated', { ex: CONSOLIDATED_TTL });

      const duration = Date.now() - startMs;
      console.log(`[pro-trigger] Consolidation complete in ${duration}ms. Score: ${scoreAverage}/100`);

      return res.status(200).json({ success: true, action: 'consolidated', siteJobId, scoreAverage, duration: `${duration}ms` });
    } catch (err) {
      console.error(`[pro-trigger] Consolidation error:`, err.message, err.stack);
      return res.status(500).json({ error: err.message });
    }
  }

  // ── Run finalize (HTML report, no PDF) directly ─────────────────────────
  if (action === 'run-finalize') {
    try {
      // Call pro-finalize-report directly (skip QStash)
      const finalizeRes = await fetch(`${baseUrl}/api/pro-finalize-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteJobId }),
      });
      const result = await finalizeRes.json();
      return res.status(finalizeRes.status).json({ ...result, action: 'finalized' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── Run PDF generation directly (no QStash) — legacy ───────────────────
  if (action === 'run-pdf') {
    try {
      const [consolidatedRaw, metaRaw] = await Promise.all([
        redis.get(`${JOB_PREFIX}:${siteJobId}:consolidated`),
        redis.get(`${JOB_PREFIX}:${siteJobId}:meta`),
      ]);
      if (!consolidatedRaw) return res.status(404).json({ error: 'No consolidated data' });

      const report = typeof consolidatedRaw === 'string' ? JSON.parse(consolidatedRaw) : consolidatedRaw;
      const meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
      const locale = report.locale || 'fr';

      const html = generateProReportHTML(report, locale);
      console.log(`[pro-trigger] HTML generated: ${html.length} chars`);

      // Call PDFShift
      const pdfResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`api:${process.env.PDFSHIFT_API_KEY}`).toString('base64')}`,
        },
        body: JSON.stringify({ source: html, landscape: false, use_print: true, format: 'A4' }),
        signal: AbortSignal.timeout(240000),
      });

      if (!pdfResponse.ok) {
        const errText = await pdfResponse.text();
        console.error(`[pro-trigger] PDFShift error ${pdfResponse.status}:`, errText);
        return res.status(500).json({ error: `PDFShift ${pdfResponse.status}`, detail: errText });
      }

      const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
      const pdfSizeKB = Math.round(pdfBuffer.length / 1024);
      console.log(`[pro-trigger] PDF generated: ${pdfSizeKB} KB`);

      // Send email via Resend
      const customerEmail = meta?.customerEmail || 'guillaume@beeleven.fr';
      const rootUrl = report.rootUrl || 'Unknown';

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'Detekia <rapports@detekia.fr>',
          to: [customerEmail],
          subject: `Votre rapport GEO complet — ${rootUrl}`,
          html: `<p>Bonjour,</p><p>Votre audit GEO complet de <strong>${rootUrl}</strong> est prêt.</p><p>Score moyen du site : <strong>${report.scoreAverage}/100</strong></p><p>${report.pagesValid} pages analysées, ${(report.patterns || []).length} patterns détectés, ${(report.actionPlan || []).length} actions recommandées.</p><p>Le rapport PDF est en pièce jointe.</p><p>— L'équipe Detekia</p>`,
          attachments: [{ filename: `rapport-geo-complet-${new URL(rootUrl).hostname}.pdf`, content: pdfBuffer.toString('base64') }],
        }),
      });

      const emailResult = await emailResponse.json();
      console.log(`[pro-trigger] Email sent to ${customerEmail}:`, emailResult);

      // Notification to Guillaume
      if (customerEmail !== 'guillaume@beeleven.fr') {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Detekia <rapports@detekia.fr>',
            to: ['guillaume@beeleven.fr'],
            subject: `[Notification] Rapport Pro envoyé — ${rootUrl}`,
            html: `<p>Rapport Pro envoyé à ${customerEmail} pour ${rootUrl}. Score: ${report.scoreAverage}/100. PDF: ${pdfSizeKB} KB.</p>`,
          }),
        });
      }

      await redis.set(`${JOB_PREFIX}:${siteJobId}:deliveredAt`, new Date().toISOString(), { ex: CONSOLIDATED_TTL });
      await redis.set(`${JOB_PREFIX}:${siteJobId}:status`, 'delivered', { ex: CONSOLIDATED_TTL });

      return res.status(200).json({ success: true, action: 'pdf_sent', siteJobId, pdfSizeKB, emailTo: customerEmail, emailResult });
    } catch (err) {
      console.error(`[pro-trigger] PDF error:`, err.message, err.stack);
      return res.status(500).json({ error: err.message });
    }
  }

  // ── Default: trigger consolidation via QStash ──────────────────────────
  try {
    await redis.del(`${JOB_PREFIX}:${siteJobId}:consolidation_triggered`);
    await triggerConsolidation(siteJobId, { baseUrl });
    return res.status(200).json({ success: true, action: 'consolidation_triggered_via_qstash', siteJobId, baseUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
