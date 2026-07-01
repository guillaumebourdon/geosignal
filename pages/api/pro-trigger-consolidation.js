/**
 * Manual consolidation + PDF trigger — bypasses QStash signature.
 * Protected by admin secret. Use when QStash callback fails silently.
 *
 * GET /api/pro-trigger-consolidation?siteJobId=xxx&secret=yyy
 * GET /api/pro-trigger-consolidation?siteJobId=xxx&secret=yyy&action=reset-locks
 * GET /api/pro-trigger-consolidation?siteJobId=xxx&secret=yyy&action=run-consolidation  (triggers step 1 via QStash → pro-consolidate.js handles all 6 steps)
 * GET /api/pro-trigger-consolidation?siteJobId=xxx&secret=yyy&action=run-pdf            (direct, no QStash)
 */
import { Redis } from '@upstash/redis';
import { triggerConsolidation, triggerConsolidationStep } from '../../lib/proQueue';
import { generateProReportHTML } from '../../lib/proReportTemplate';

export const config = { maxDuration: 60 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const JOB_PREFIX = 'detekia:pro:v1:job';
const CONSOLIDATED_TTL = 7 * 24 * 60 * 60;
const ADMIN_SECRET = process.env.PRO_ADMIN_SECRET;

export default async function handler(req, res) {
  const { siteJobId, action } = req.query;

  // Read secret from Authorization header (preferred) or query string (deprecated fallback)
  const authHeader = req.headers.authorization?.replace('Bearer ', '');
  const querySecret = req.query.secret;
  const secret = authHeader || querySecret;
  if (querySecret && !authHeader) {
    console.warn('[pro-trigger] Deprecated: secret passed as query string. Use Authorization: Bearer <secret> header.');
  }

  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  if (!siteJobId) return res.status(400).json({ error: 'Missing siteJobId' });

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['host'] || 'localhost:3000';
  const baseUrl = `${proto}://${host}`;

  // ── Reset locks ────────────────────────────────────────────────────────
  if (action === 'reset-locks') {
    await Promise.all([
      redis.del(`${JOB_PREFIX}:${siteJobId}:consolidation_triggered`),
      redis.del(`${JOB_PREFIX}:${siteJobId}:pdf_triggered`),
      redis.del(`${JOB_PREFIX}:${siteJobId}:finalizing`),
      redis.del(`${JOB_PREFIX}:${siteJobId}:status`),
    ]);
    return res.status(200).json({ success: true, action: 'locks_reset', siteJobId });
  }

  // ── Run consolidation via QStash pipeline (same as normal flow) ──────────
  if (action === 'run-consolidation') {
    try {
      // Verify job exists
      const metaRaw = await redis.get(`${JOB_PREFIX}:${siteJobId}:meta`);
      if (!metaRaw) return res.status(404).json({ error: 'Job not found' });

      // Clear previous step results so pro-consolidate.js re-runs everything fresh
      await Promise.all([
        redis.del(`${JOB_PREFIX}:${siteJobId}:step:synthesis`),
        redis.del(`${JOB_PREFIX}:${siteJobId}:step:criteria`),
        redis.del(`${JOB_PREFIX}:${siteJobId}:step:citations`),
        redis.del(`${JOB_PREFIX}:${siteJobId}:step:page-recos`),
        redis.del(`${JOB_PREFIX}:${siteJobId}:consolidated`),
        redis.del(`${JOB_PREFIX}:${siteJobId}:consolidation_triggered`),
        redis.del(`${JOB_PREFIX}:${siteJobId}:retrigger_count`),
        redis.del(`${JOB_PREFIX}:${siteJobId}:status`),
      ]);

      // Trigger step 1 via QStash — pro-consolidate.js handles all 6 steps automatically
      await triggerConsolidationStep(siteJobId, 1, { baseUrl });
      console.log(`[pro-trigger] Consolidation triggered via QStash step 1 for ${siteJobId}`);

      return res.status(200).json({
        success: true,
        action: 'consolidation_triggered_step1',
        siteJobId,
        message: 'Step 1 triggered via QStash. pro-consolidate.js will run all 6 steps automatically.',
      });
    } catch (err) {
      console.error(`[pro-trigger] run-consolidation error:`, err.message);
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
      const { maskEmail } = require('../../lib/maskEmail');
      console.log(`[pro-trigger] Email sent to ${maskEmail(customerEmail)}:`, emailResult);

      // Notification to Guillaume
      if (customerEmail !== 'guillaume@beeleven.fr') {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Detekia <rapports@detekia.fr>',
            to: ['guillaume@beeleven.fr'],
            subject: `[Notification] Rapport Pro envoyé — ${rootUrl}`,
            html: `<p>Rapport Pro envoyé à ${maskEmail(customerEmail)} pour ${rootUrl}. Score: ${report.scoreAverage}/100. PDF: ${pdfSizeKB} KB.</p>`,
          }),
        });
      }

      await redis.set(`${JOB_PREFIX}:${siteJobId}:deliveredAt`, new Date().toISOString(), { ex: CONSOLIDATED_TTL });
      await redis.set(`${JOB_PREFIX}:${siteJobId}:status`, 'delivered', { ex: CONSOLIDATED_TTL });

      return res.status(200).json({ success: true, action: 'pdf_sent', siteJobId, pdfSizeKB, emailTo: maskEmail(customerEmail), emailResult });
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
