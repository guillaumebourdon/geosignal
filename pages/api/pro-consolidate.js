import { Redis } from '@upstash/redis';
import Anthropic from '@anthropic-ai/sdk';
import { verifyQstashSignature, triggerFinalizeReport } from '../../lib/proQueue';

export const config = {
  maxDuration: 300,
  api: { bodyParser: false },
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 120000 });

const JOB_PREFIX = 'detekia:pro:v1:job';
const CONSOLIDATED_TTL = 7 * 24 * 60 * 60;

const { callWithRetry, parseJson: parseHaikuJsonShared } = require('../../lib/anthropicRetry');
function callHaikuWithRetry(params, maxRetries = 3) { return callWithRetry(anthropic, params, maxRetries); }

function parseHaikuJson(raw) {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in Claude response');
  return JSON.parse(match[0]);
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const signature = req.headers['upstash-signature'];
  const rawBody = await readRawBody(req);

  if (!signature || !(await verifyQstashSignature(signature, rawBody))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { siteJobId } = JSON.parse(rawBody);
  if (!siteJobId) return res.status(400).json({ error: 'Missing siteJobId' });

  const startMs = Date.now();
  console.log(`[pro-consolidate] Starting consolidation for ${siteJobId}`);

  try {
    // 1. Read job data from Redis
    const [totalRaw, metaRaw] = await Promise.all([
      redis.get(`${JOB_PREFIX}:${siteJobId}:total`),
      redis.get(`${JOB_PREFIX}:${siteJobId}:meta`),
    ]);

    const total = Number(totalRaw) || 0;
    const meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
    if (!total || !meta) return res.status(404).json({ error: 'Job not found' });

    const locale = meta.locale || 'fr';
    const rootUrl = meta.rootUrl;

    // Read all page results
    const pageKeys = Array.from({ length: total }, (_, i) => `${JOB_PREFIX}:${siteJobId}:page:${i}`);
    const pageResults = await Promise.all(pageKeys.map(k => redis.get(k).catch(() => null)));
    const pages = pageResults.map((raw, i) => {
      if (!raw) return { index: i, url: `page-${i}`, error: 'Result not found' };
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    });

    // 2. Separate valid vs error pages
    const validPages = pages.filter(p => !p.error && typeof p.score === 'number');
    const errorPages = pages.filter(p => p.error);

    // 3. Compute aggregates
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

    // 4. Claude call 1: Executive summary + patterns + action plan
    const pagesForPrompt = validPages.map(p => ({
      url: p.url,
      score: p.score,
      topRecos: (p.recommendations || []).slice(0, 3).map(r => `${r.criterion}: ${r.title || r.diagnostic || ''}`).join('; '),
    }));

    const today = new Date().toISOString().split('T')[0];
    const langInstruction = locale === 'en'
      ? 'OUTPUT LANGUAGE: English (US). ALL text values MUST be in American English.'
      : 'LANGUE DE SORTIE : Francais. Toutes les valeurs texte en francais professionnel.';

    // Precompute stats so Haiku doesn't invent numbers
    const totalAnalyzed = total;
    const totalValid = validPages.length;
    const totalErrors = errorPages.length;
    const blogPages = validPages.filter(p => /blog/i.test(p.url));
    const belowByCriterion = {};
    for (const name of criteriaNames) {
      belowByCriterion[name] = validPages.filter(p => {
        const c = (p.criteria || []).find(cr => cr.name === name);
        return c && (c.score / c.max) < 0.75;
      }).length;
    }

    // Precompute per-criterion percentage labels
    const criteriaLabels = Object.entries(criteriaAverages).map(([k, v]) => {
      const pct = Math.round((v.avgScore / v.max) * 100);
      const adj = pct < 30 ? 'catastrophique' : pct < 50 ? 'faible' : pct < 70 ? 'moyen' : pct < 85 ? 'bon' : 'excellent';
      return `  ${k}: ${v.avgScore}/${v.max} (${pct}%) → qualificatif: ${adj}`;
    }).join('\n');

    const statsBlock = `FIXED STATS (use these exact numbers, do NOT count yourself):
- Today's date: ${today} (2026 is the CURRENT year, dates in 2026 are RECENT not future)
- Total pages queued: ${totalAnalyzed}
- Pages successfully analyzed: ${totalValid}
- Pages with errors: ${totalErrors}
- Blog/article pages: ${blogPages.length}
- Score distribution: ${distribution.faible} low (<45), ${distribution.moyen} average (45-69), ${distribution.bon} good (70+)
- Pages below 75% threshold per criterion:
${Object.entries(belowByCriterion).map(([k, v]) => `  ${k}: ${v}/${totalValid}`).join('\n')}

VOCABULARY CALIBRATION (mandatory — use the qualifier that matches the score %):
<30% = catastrophique | 30-50% = faible | 50-70% = moyen | 70-85% = bon | >85% = excellent
FORBIDDEN above 50%: catastrophique, grave, lacune critique, défaillant, alarmant.
Above 50%, acceptable words: moyen, à améliorer, perfectible, insuffisant, modéré.
EXAMPLE: Vérifiabilité at 53% → "la vérifiabilité reste perfectible" NOT "la vérifiabilité est gravement déficiente".
Per-criterion qualifiers (use these exact words):
${criteriaLabels}
NEVER use "catastrophique" for a score above 30%. NEVER use "faible" for a score above 50%.`;

    const synthesisPrompt = `${langInstruction}

You are a senior GEO consultant analyzing a FULL WEBSITE audit.

${statsBlock}

Site: ${rootUrl}
Average GEO score: ${scoreAverage}/100

Pages analyzed:
${pagesForPrompt.map(p => `- ${p.url} (score: ${p.score}) — ${p.topRecos}`).join('\n')}

Criteria averages:
${Object.entries(criteriaAverages).map(([k, v]) => `- ${k}: ${v.avgScore}/${v.max}`).join('\n')}

Generate a comprehensive site-level analysis. JSON only:
{"executiveSummary":"2-3 paragraphs qualitative analysis of the site's overall GEO health","topStrengths":["strength 1","strength 2","strength 3"],"topWeaknesses":["weakness 1","weakness 2","weakness 3"],"patterns":[{"pattern":"description","pagesAffected":["url1","url2"],"criterion":"criterion name","severity":"critique|important|mineur"}],"actionPlan":[{"priority":1,"action":"description","criterion":"criterion name","impact":"eleve|moyen|faible","effort":"faible|moyen|eleve","pagesAffected":["url1","url2"]}]}

Rules:
- executiveSummary: 2-3 substantial paragraphs, specific to this site. Use the FIXED STATS numbers above verbatim.
- patterns: 5 to 8 cross-page patterns detected
- actionPlan: 10 to 15 site-level actions, sorted by priority (impact/effort ratio)
- Be specific: reference actual URLs from the audit
- NEVER write "${totalValid} pages sur ${totalValid}" — that's trivially obvious. Write "${totalValid} pages" or "toutes les ${totalValid} pages".`;

    // 5-6. Prepare all 3 Claude prompts (independent — safe to parallelize)
    const pageTitles = validPages.map(p => {
      const title = p.evidence?.metaTitle || p.url;
      return `${title} (${p.url})`;
    }).slice(0, 10).join(', ');

    const citationPrompt = `${langInstruction}

You are an AI visibility expert. Full site audit for ${rootUrl}.
Pages: ${pageTitles}

Step 1: Generate 30 queries users would ask ChatGPT/Perplexity about this site's domain:
- 10 generic (high competition broad queries)
- 10 niche (specific to this site)
- 10 long_tail (ultra-targeted)

Step 2: For each query, simulate whether ${new URL(rootUrl).hostname} would be cited. Consider the site's actual content quality (average score: ${scoreAverage}/100).

JSON only:
{"queries":[{"query":"","type":"generic|niche|long_tail","cited":false,"competitorsCited":["competitor1"],"difficulty_to_rank":"easy|medium|hard","recommendation":"1 sentence","ai_response_excerpt":"first 100 chars of simulated AI answer"}],"citationRate":"X/30","bestOpportunity":"best query opportunity","mainBlocker":"main reason for low citations"}`;

    const criteriaForPrompt = Object.entries(criteriaAverages).map(([name, data]) => {
      const pagesBelow = validPages.filter(p => {
        const c = (p.criteria || []).find(cr => cr.name === name);
        return c && (c.score / c.max) < 0.75;
      });
      const examples = pagesBelow.slice(0, 3).map(p => {
        const c = (p.criteria || []).find(cr => cr.name === name);
        return `${p.url} (${c?.score}/${c?.max})`;
      });
      return `- ${name}: avg ${data.avgScore}/${data.max}, ${pagesBelow.length}/${validPages.length} pages below 75%. Examples: ${examples.join(', ') || 'none'}`;
    }).join('\n');

    const criteriaPrompt = `${langInstruction}

${statsBlock}

You are a senior GEO consultant. For a site audit of ${rootUrl} (${totalValid} pages analyzed, avg score ${scoreAverage}/100), generate a per-criterion consolidated analysis.

Criteria data:
${criteriaForPrompt}

For each of the 8 GEO criteria, generate a JSON array of 8 objects:
[{"criterion":"exact criterion name","synthesis":"2-3 sentences describing the state of this criterion across all pages","consolidatedRecommendation":{"diagnostic":"1 sentence","whyCritical":"1 sentence","whatToDo":"2 sentences","howToDoIt":"2-3 sentences","concreteExample":"1 sentence","expectedImpact":"1 sentence","expertTip":"1 sentence","pagesAffected":["url1","url2"]}}]

Rules:
- synthesis must use the FIXED STATS numbers above (e.g. "${belowByCriterion[criteriaNames[0]]}/${totalValid} pages" not your own count)
- consolidatedRecommendation must be site-level, not page-specific
- pagesAffected: list up to 5 most impacted URLs
- Be specific to ${rootUrl}

JSON array only, no markdown:`;

    // Run all 3 Sonnet calls in parallel (independent inputs, no cross-dependencies)
    console.log('[pro-consolidate] Starting 3 Sonnet calls in parallel...');
    const parallelStart = Date.now();
    const [synthesisResult, citationResult, criteriaResult] = await Promise.allSettled([
      callHaikuWithRetry({ model: 'claude-4-sonnet-20250514', max_tokens: 10000, temperature: 0.2, messages: [{ role: 'user', content: synthesisPrompt }] }),
      callHaikuWithRetry({ model: 'claude-4-sonnet-20250514', max_tokens: 8000, temperature: 0.3, messages: [{ role: 'user', content: citationPrompt }] }),
      callHaikuWithRetry({ model: 'claude-4-sonnet-20250514', max_tokens: 8000, temperature: 0.2, messages: [{ role: 'user', content: criteriaPrompt }] }),
    ]);
    console.log(`[pro-consolidate] 3 Sonnet calls completed in ${Date.now() - parallelStart}ms`);

    // Parse results (each can fail independently)
    let synthesis = { executiveSummary: '', topStrengths: [], topWeaknesses: [], patterns: [], actionPlan: [] };
    if (synthesisResult.status === 'fulfilled') {
      try {
        synthesis = parseHaikuJson(synthesisResult.value.content[0].text);
        console.log(`[pro-consolidate] Synthesis OK: exec=${(synthesis.executiveSummary || '').length}c, patterns=${(synthesis.patterns || []).length}, actions=${(synthesis.actionPlan || []).length}`);
      } catch (e) { console.error('[pro-consolidate] Synthesis parse error:', e.message); }
    } else {
      console.error('[pro-consolidate] Synthesis call FAILED:', synthesisResult.reason?.message);
    }

    let citationTest = { queries: [], citationRate: '0/30', bestOpportunity: '', mainBlocker: '' };
    if (citationResult.status === 'fulfilled') {
      try { citationTest = parseHaikuJson(citationResult.value.content[0].text); } catch (e) { console.error('[pro-consolidate] Citation parse error:', e.message); }
    } else {
      console.error('[pro-consolidate] Citation call FAILED:', citationResult.reason?.message);
    }

    let criteriaConsolidated = [];
    if (criteriaResult.status === 'fulfilled') {
      try {
        const rawCriteria = criteriaResult.value.content[0].text;
        const arrMatch = rawCriteria.match(/\[[\s\S]*\]/);
        if (arrMatch) criteriaConsolidated = JSON.parse(arrMatch[0]);
      } catch (e) { console.error('[pro-consolidate] Criteria parse error:', e.message); }
    } else {
      console.error('[pro-consolidate] Criteria call FAILED:', criteriaResult.reason?.message);
    }

    // Enrich each criteriaConsolidated entry with avgScore data
    criteriaConsolidated = criteriaConsolidated.map(cc => {
      const avg = criteriaAverages[cc.criterion];
      return {
        ...cc,
        avgScore: avg?.avgScore || 0,
        max: avg?.max || 0,
        concreteExamples: validPages
          .map(p => {
            const c = (p.criteria || []).find(cr => cr.name === cc.criterion);
            return c ? { url: p.url, score: c.score, max: c.max } : null;
          })
          .filter(Boolean)
          .sort((a, b) => (a.score / a.max) - (b.score / b.max))
          .slice(0, 3),
      };
    });

    // 7. Build consolidated report — Sonnet dedup moved to pro-finalize-report.js
    const fullPages = pages.map(p => ({
      url: p.url,
      score: p.score,
      error: p.error || null,
      topPriority: p.topPriority || null,
      verdict: p.verdict || null,
      strengths: p.strengths || [],
      criteria: p.criteria || [],
      recommendations: p.recommendations || [],
    }));

    const consolidatedReport = {
      siteJobId,
      rootUrl,
      locale,
      queuedAt: meta.queuedAt,
      consolidatedAt: new Date().toISOString(),
      scoreAverage,
      scoreMedian,
      distribution,
      pagesValid: validPages.length,
      pagesWithError: errorPages.length,
      criteriaAverages,
      criteriaConsolidated,
      executiveSummary: synthesis.executiveSummary,
      topStrengths: synthesis.topStrengths || [],
      topWeaknesses: synthesis.topWeaknesses || [],
      patterns: synthesis.patterns || [],
      actionPlan: (synthesis.actionPlan || []).sort((a, b) => {
        const imp = { eleve: 0, high: 0, moyen: 1, medium: 1, faible: 2, low: 2 };
        const ai = imp[String(a.impact || '').toLowerCase()] ?? 1;
        const bi = imp[String(b.impact || '').toLowerCase()] ?? 1;
        if (ai !== bi) return ai - bi;
        const eff = { faible: 0, low: 0, moyen: 1, medium: 1, eleve: 2, high: 2 };
        return (eff[String(a.effort || '').toLowerCase()] ?? 1) - (eff[String(b.effort || '').toLowerCase()] ?? 1);
      }),
      citationTestConsolidated: citationTest,
      pages: fullPages,
    };

    // 8-9. Store in Redis
    await redis.set(`${JOB_PREFIX}:${siteJobId}:consolidated`, consolidatedReport, { ex: CONSOLIDATED_TTL });
    await redis.set(`${JOB_PREFIX}:${siteJobId}:status`, 'consolidated', { ex: CONSOLIDATED_TTL });

    const duration = Date.now() - startMs;
    console.log(`[pro-consolidate] Consolidated ${siteJobId} in ${duration}ms. Site score avg: ${scoreAverage}/100. Patterns: ${(synthesis.patterns || []).length}. Actions: ${(synthesis.actionPlan || []).length}.`);

    // Trigger report finalization (atomic guard)
    const pdfLock = `${JOB_PREFIX}:${siteJobId}:pdf_triggered`;
    const pdfAcquired = await redis.set(pdfLock, '1', { nx: true, ex: CONSOLIDATED_TTL });
    if (pdfAcquired) {
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers['host'] || 'localhost:3000';
      await triggerFinalizeReport(siteJobId, { baseUrl: `${proto}://${host}` });
      console.log(`[pro-consolidate] Report finalization triggered for ${siteJobId}`);
    }

    return res.status(200).json({ success: true, siteJobId, status: 'consolidated' });
  } catch (err) {
    console.error(`[pro-consolidate] Error for ${siteJobId}:`, err.message);
    return res.status(500).json({ error: err.message });
  }
}
