/**
 * Pro report finalization — stores consolidated report in Redis + sends email with link.
 * Replaces pro-generate-pdf.js in the new HTML-first flow.
 * Triggered by QStash after consolidation, or manually via pro-trigger-consolidation.
 */
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import Anthropic from '@anthropic-ai/sdk';
import { verifyQstashSignature } from '../../lib/proQueue';
import { randomUUID } from 'crypto';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const maxDuration = 180;
export const config = { api: { bodyParser: false } };

const resend = new Resend(process.env.RESEND_API_KEY);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const JOB_PREFIX = 'detekia:pro:v1:job';
const DELIVERED_TTL = 7 * 24 * 60 * 60;
const REPORT_TTL = 10 * 365 * 24 * 60 * 60; // 10 years

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

function gradeColor(score) {
  if (score >= 70) return '#10A37F';
  if (score >= 45) return '#C9861A';
  return '#D97757';
}
function gradeLabel(score) {
  if (score >= 70) return 'BON';
  if (score >= 45) return 'MOYEN';
  return 'FAIBLE';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  // Support both QStash-signed and direct (manual trigger) calls
  let siteJobId;
  const rawBody = await readRawBody(req);
  const signature = req.headers['upstash-signature'];

  if (signature) {
    if (!(await verifyQstashSignature(signature, rawBody))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const body = JSON.parse(rawBody);
  siteJobId = body.siteJobId;
  if (!siteJobId) return res.status(400).json({ error: 'Missing siteJobId' });

  // Idempotence
  const currentStatus = await redis.get(`${JOB_PREFIX}:${siteJobId}:status`);
  if (currentStatus === 'delivered') {
    console.log(`[pro-finalize] Idempotent skip for ${siteJobId}`);
    return res.status(200).json({ success: true, skipped: true, siteJobId });
  }

  console.log(`[pro-finalize] Starting for ${siteJobId}`);
  const startMs = Date.now();

  try {
    // Read consolidated report + meta + full pages
    const [consolidatedRaw, metaRaw] = await Promise.all([
      redis.get(`${JOB_PREFIX}:${siteJobId}:consolidated`),
      redis.get(`${JOB_PREFIX}:${siteJobId}:meta`),
    ]);

    if (!consolidatedRaw) {
      console.error(`[pro-finalize] No consolidated report for ${siteJobId}`);
      return res.status(500).json({ error: 'Consolidated report not found' });
    }

    const consolidated = typeof consolidatedRaw === 'string' ? JSON.parse(consolidatedRaw) : consolidatedRaw;
    const meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
    const locale = meta?.locale || 'fr';
    const customerEmail = meta?.customerEmail || 'guillaume@beeleven.fr';
    const rootUrl = consolidated.rootUrl || meta?.rootUrl || 'unknown';

    // Read full page results for the template
    const total = consolidated.pages?.length || 0;
    const pageKeys = Array.from({ length: total }, (_, i) => `${JOB_PREFIX}:${siteJobId}:page:${i}`);
    const pageSettled = await Promise.allSettled(pageKeys.map(k => redis.get(k)));
    const fullPages = pageSettled.map((result, i) => {
      if (result.status !== 'fulfilled' || !result.value) {
        return consolidated.pages?.[i] || { url: `page-${i}`, error: 'Not found' };
      }
      const raw = result.value;
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    });

    // Sonnet dedup pass — merge semantic duplicates across page recos
    let mergeMap = {};
    try {
      const recoByCrit = {};
      fullPages.filter(p => !p.error).forEach(p => {
        (p.recommendations || []).forEach(r => {
          const c = r.criterion || 'other';
          const key = `${r.patternId || ''}::${r.title || ''}`;
          if (!recoByCrit[c]) recoByCrit[c] = {};
          if (!recoByCrit[c][key]) recoByCrit[c][key] = { patternId: r.patternId || '', title: r.title || '', count: 0 };
          recoByCrit[c][key].count++;
        });
      });
      const recoList = [];
      for (const [crit, recos] of Object.entries(recoByCrit)) {
        for (const r of Object.values(recos)) recoList.push({ criterion: crit, patternId: r.patternId, title: r.title, pages: r.count });
      }

      if (recoList.length > 5) {
        const sonnetMsg = await anthropic.messages.create({
          model: 'claude-4-sonnet-20250514',
          max_tokens: 4000,
          temperature: 0,
          messages: [{ role: 'user', content: `Deduplicate these website audit recommendations. Many titles describe the SAME action differently.

JSON only, no markdown:
{"merges":[{"canonicalTitle":"best title","titlesToMerge":["title1","title2"]}]}

Rules:
- Merge if titles describe the SAME concrete action
- Different schema types (Organization vs Article vs FAQ) = DIFFERENT, don't merge
- "add external sources" ≈ "source statistics" = merge
- "optimize crawlers" ≈ "optimize HTML structure" = merge
- "meta descriptions" ≈ "titles and descriptions" = merge
- Be aggressive: if in doubt, merge

Recommendations:
${recoList.map(r => `[${r.criterion}] "${r.title}" (${r.pages}x, pid:${r.patternId})`).join('\n')}` }],
        });
        const raw = sonnetMsg.content[0].text;
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          for (const m of (result.merges || [])) {
            for (const t of (m.titlesToMerge || [])) mergeMap[t.toLowerCase()] = m.canonicalTitle;
          }
        }
        console.log(`[pro-finalize] Sonnet dedup: ${Object.keys(mergeMap).length} titles merged`);
      }
    } catch (e) {
      console.error('[pro-finalize] Sonnet dedup failed (non-blocking):', e.message);
    }

    // Apply merge map to page recommendations
    const mergedPages = fullPages.map(p => ({
      ...p,
      recommendations: (p.recommendations || []).map(r => {
        const canonical = mergeMap[(r.title || '').toLowerCase()];
        return canonical ? { ...r, _mergedTitle: canonical } : r;
      }),
    }));

    // Generate UUID and store report
    const uuid = randomUUID();
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'detekia.fr';
    const reportUrl = `${proto}://${host}/r/${uuid}`;

    const reportRecord = {
      reportType: 'pro',
      consolidatedReport: { ...consolidated, pages: mergedPages },
      email: customerEmail,
      url: rootUrl,
      locale,
      createdAt: new Date().toISOString(),
      siteJobId,
    };

    await redis.set(`detekia:report:${uuid}`, reportRecord, { ex: REPORT_TTL });
    console.log(`[pro-finalize] Report stored: ${uuid} for ${rootUrl}`);

    // Increment global audit counter
    try { await redis.incr('detekia:stats:audit-count'); } catch (_) {}

    // Validate report — alert Guillaume if errors detected
    try {
      const { validateReport } = require('../../lib/reportValidator');
      const validation = validateReport(consolidated, 'pro');
      if (!validation.passed || validation.warnings.length > 0) {
        await redis.set(`detekia:validation:${uuid}`, validation, { ex: REPORT_TTL });
        console.log(`[pro-finalize] Validation: ${validation.summary}`);
      }
      if (!validation.passed) {
        const hasCriticalError = validation.errors.some(e =>
          e.rule === 'score-out-of-range' || e.rule === 'score-average-mismatch' || e.rule === 'page-count-mismatch'
        );
        if (hasCriticalError) {
          console.error(`[pro-finalize] CRITICAL validation error — triggering refund`);
          const { triggerAutoRefund } = require('../../lib/autoRefund');
          await triggerAutoRefund({
            paymentIntentId: null,
            customerEmail: meta?.customerEmail,
            url: consolidated.rootUrl,
            plan: 'pro',
            reason: `Validation critique Pro: ${validation.errors.map(e => e.rule).join(', ')}`,
            locale: consolidated.locale || 'fr',
          });
          return res.status(200).json({ success: false, refunded: true, reason: 'validation_critical' });
        }
        // Non-critical: deliver but alert
        await resend.emails.send({
          from: 'Detekia <hello@detekia.fr>',
          to: 'guillaume@beeleven.fr',
          subject: `⚠️ Rapport Pro livré avec warnings — ${consolidated.rootUrl} — ${validation.summary}`,
          html: `<div style="font-family:system-ui;padding:24px;">
            <h2 style="color:#D97757;">Rapport Pro avec erreurs de validation (non critiques)</h2>
            <p><strong>Site :</strong> ${consolidated.rootUrl}</p>
            <p><strong>Email client :</strong> ${meta?.customerEmail || 'N/A'}</p>
            <p><strong>Score moyen :</strong> ${consolidated.scoreAverage}/100</p>
            <p><strong>Pages :</strong> ${consolidated.pagesValid}</p>
            <p><strong>Rapport :</strong> <a href="${reportUrl}">${reportUrl}</a></p>
            <p><strong>Erreurs :</strong></p>
            <ul>${validation.errors.map(e => `<li><strong>${e.rule}</strong>: attendu ${e.expected}, obtenu ${e.actual}</li>`).join('')}</ul>
          </div>`,
        }).catch(() => {});
      }
    } catch (e) { console.error('[pro-finalize] Validation error:', e.message); }

    // Send email with link
    const score = consolidated.scoreAverage;
    const color = gradeColor(score);
    const grade = gradeLabel(score);

    const { error: emailError } = await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: customerEmail,
      subject: `Votre rapport GEO complet est prêt — ${rootUrl}`,
      html: `
        <div style="background:#F7F5F2;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif">
          <div style="max-width:520px;margin:0 auto">
            <div style="text-align:center;margin-bottom:28px">
              <div style="font-family:Georgia,serif;font-size:22px;color:#1A1916;margin-bottom:4px">Detekia</div>
              <div style="font-family:monospace;font-size:10px;color:#6B6762;letter-spacing:2px">RAPPORT GEO COMPLET — AUDIT SITE</div>
            </div>
            <div style="background:#1A1916;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px">
              <div style="font-family:Georgia,serif;font-size:64px;color:#F7F5F2;line-height:1;letter-spacing:-2px">${score}</div>
              <div style="font-family:monospace;font-size:12px;color:rgba(247,245,242,0.4);margin-top:4px">/100 — ${rootUrl}</div>
              <div style="display:inline-block;margin-top:12px;background:${color}22;border:1px solid ${color}44;padding:3px 14px;border-radius:20px;font-family:monospace;font-size:10px;letter-spacing:2px;color:${color}">${grade}</div>
              <div style="font-family:monospace;font-size:11px;color:rgba(247,245,242,0.35);margin-top:8px">${consolidated.pagesValid} pages analysées · ${(consolidated.patterns || []).length} patterns · ${(consolidated.actionPlan || []).length} actions</div>
            </div>
            <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #E5E2DC;margin-bottom:24px;text-align:center">
              <p style="font-size:15px;color:#1A1916;line-height:1.7;margin:0 0 8px">Votre audit GEO complet multi-pages est prêt.</p>
              <p style="font-size:13px;color:#6B6762;line-height:1.6;margin:0 0 24px">${consolidated.pagesValid} pages analysées, ${(consolidated.patterns || []).length} patterns transverses détectés, ${(consolidated.actionPlan || []).length} actions recommandées.</p>
              <a href="${reportUrl}" style="display:inline-block;background:#D97757;color:#fff;padding:14px 40px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;font-family:system-ui">Voir mon rapport complet →</a>
              <p style="font-size:11px;color:#B0ABA5;margin-top:16px;line-height:1.5">Votre rapport reste accessible indéfiniment à cette URL.</p>
            </div>
            <div style="text-align:center;font-size:12px;color:#6B6762;line-height:1.6;padding-top:8px">
              Beeleven SASU · hello@detekia.fr · detekia.fr
            </div>
          </div>
        </div>
      `,
    });

    const { maskEmail } = require('../../lib/maskEmail');
    if (emailError) console.error('[pro-finalize] Email error:', emailError);
    else console.log(`[pro-finalize] Email sent to ${maskEmail(customerEmail)}`);

    // Notify Guillaume
    try {
      const now = new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
      await resend.emails.send({
        from: 'Detekia <hello@detekia.fr>',
        to: 'guillaume@beeleven.fr',
        subject: `🎯 Vente Pro : rapport livré pour ${rootUrl}`,
        html: `<div style="font-family:system-ui;max-width:480px;margin:0 auto;padding:24px;">
          <div style="font-family:Georgia,serif;font-size:18px;color:#1A1916;margin-bottom:16px;">🎯 Rapport Pro livré</div>
          <div style="background:#F7F5F2;border-radius:8px;padding:16px 20px;">
            <div style="margin-bottom:6px;"><strong>Site :</strong> ${rootUrl}</div>
            <div style="margin-bottom:6px;"><strong>Score :</strong> ${score}/100</div>
            <div style="margin-bottom:6px;"><strong>Pages :</strong> ${consolidated.pagesValid}</div>
            <div style="margin-bottom:6px;"><strong>Email :</strong> ${customerEmail}</div>
            <div style="margin-bottom:6px;"><strong>Rapport :</strong> <a href="${reportUrl}">${reportUrl}</a></div>
            <div><strong>Date :</strong> ${now}</div>
          </div>
        </div>`,
      });
    } catch (_) {}

    // Update job status
    await redis.set(`${JOB_PREFIX}:${siteJobId}:status`, 'delivered', { ex: DELIVERED_TTL });
    await redis.set(`${JOB_PREFIX}:${siteJobId}:deliveredAt`, new Date().toISOString(), { ex: DELIVERED_TTL });

    const duration = Date.now() - startMs;
    console.log(`[pro-finalize] ✅ Delivered ${siteJobId} in ${duration}ms — ${reportUrl}`);
    return res.status(200).json({ success: true, siteJobId, uuid, reportUrl });

  } catch (err) {
    console.error(`[pro-finalize] Error for ${siteJobId}:`, err.message);
    return res.status(500).json({ error: err.message });
  }
}
