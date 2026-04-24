import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { verifyQstashSignature } from '../../lib/proQueue';
import { generateProReportHTML, PRO_STRINGS } from '../../lib/proReportTemplate';

export const maxDuration = 300;
export const config = { api: { bodyParser: false } };

const resend = new Resend(process.env.RESEND_API_KEY);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const JOB_PREFIX = 'detekia:pro:v1:job';
const DELIVERED_TTL = 7 * 24 * 60 * 60;

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

  // Idempotence: skip if already delivered
  const currentStatus = await redis.get(`${JOB_PREFIX}:${siteJobId}:status`);
  if (currentStatus === 'delivered') {
    console.log(`[pro-generate-pdf] Idempotent skip for ${siteJobId} (already delivered)`);
    return res.status(200).json({ success: true, skipped: true, siteJobId });
  }

  console.log(`[pro-generate-pdf] Starting PDF generation for ${siteJobId}`);
  const startMs = Date.now();

  try {
    // Read consolidated report + meta (parallel)
    const [consolidatedRaw, metaRaw] = await Promise.all([
      redis.get(`${JOB_PREFIX}:${siteJobId}:consolidated`),
      redis.get(`${JOB_PREFIX}:${siteJobId}:meta`),
    ]);

    if (!consolidatedRaw) {
      console.error(`[pro-generate-pdf] No consolidated report found for ${siteJobId}`);
      return res.status(500).json({ error: 'Consolidated report not found' });
    }

    const consolidated = typeof consolidatedRaw === 'string' ? JSON.parse(consolidatedRaw) : consolidatedRaw;
    const meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
    const locale = meta?.locale || 'fr';
    const customerEmail = meta?.customerEmail || 'guillaume@beeleven.fr';
    const rootUrl = consolidated.rootUrl || meta?.rootUrl || 'unknown';
    const t = PRO_STRINGS[locale] || PRO_STRINGS.fr;

    // Read full page results (parallel with allSettled for robustness)
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

    console.log(`[pro-generate-pdf] Redis reads done in ${Date.now() - startMs}ms (${total} pages)`);

    // Inject full page data into consolidated report for template
    const reportForTemplate = { ...consolidated, pages: fullPages };

    // Generate HTML
    const html = generateProReportHTML(reportForTemplate, locale);
    console.log(`[pro-generate-pdf] HTML generated: ${html.length} chars (${Math.round(html.length / 1024)} KB)`);

    // Generate PDF via PDFShift with explicit timeout
    const pdfStartTime = Date.now();
    console.log(`[pro-generate-pdf] Calling PDFShift for ${siteJobId}`);

    let pdfResponse;
    try {
      pdfResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from('api:' + process.env.PDFSHIFT_API_KEY).toString('base64'),
        },
        body: JSON.stringify({ source: html, landscape: false, use_print: true, format: 'A4' }),
        signal: AbortSignal.timeout(240000),
      });
    } catch (fetchErr) {
      const pdfDuration = Date.now() - pdfStartTime;
      console.error(`[pro-generate-pdf] PDFShift fetch failed after ${pdfDuration}ms: ${fetchErr.message}`);
      if (fetchErr.name === 'TimeoutError' || fetchErr.name === 'AbortError') {
        return res.status(500).json({ error: 'pdfshift-timeout' });
      }
      return res.status(500).json({ error: 'pdfshift-network', message: fetchErr.message });
    }

    const pdfDuration = Date.now() - pdfStartTime;
    console.log(`[pro-generate-pdf] PDFShift responded in ${pdfDuration}ms with status ${pdfResponse.status}`);

    if (!pdfResponse.ok) {
      const errorBody = await pdfResponse.text();
      console.error(`[pro-generate-pdf] PDFShift error ${pdfResponse.status}: ${errorBody.substring(0, 500)}`);

      const isPermanent = pdfResponse.status === 400 || pdfResponse.status === 401 || pdfResponse.status === 422;
      if (isPermanent) {
        await redis.set(`${JOB_PREFIX}:${siteJobId}:status`, 'error', { ex: DELIVERED_TTL });
        await redis.set(`${JOB_PREFIX}:${siteJobId}:error`, `PDFShift ${pdfResponse.status}: ${errorBody.substring(0, 200)}`, { ex: DELIVERED_TTL });
        try {
          await resend.emails.send({
            from: 'Detekia <hello@detekia.fr>',
            to: 'guillaume@beeleven.fr',
            subject: `\u274C Erreur Pro : PDFShift permanent pour ${rootUrl}`,
            html: `<div style="font-family:system-ui;padding:24px;"><p><strong>Job:</strong> ${siteJobId}</p><p><strong>URL:</strong> ${rootUrl}</p><p><strong>Erreur:</strong> ${pdfResponse.status} — ${errorBody.substring(0, 300)}</p></div>`,
          });
        } catch (_) {}
        return res.status(200).json({ success: false, siteJobId, error: 'pdfshift-permanent' });
      }
      return res.status(500).json({ error: 'pdfshift-temporary', status: pdfResponse.status });
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
    console.log(`[pro-generate-pdf] PDF generated, size: ${pdfBuffer.length} bytes (${Math.round(pdfBuffer.length / 1024)} KB)`);

    // Send email to customer
    const safeName = rootUrl.replace(/[^a-z0-9]/gi, '-');
    const emailSubject = locale === 'en'
      ? `Your complete Detekia GEO report is ready — ${rootUrl}`
      : `Votre rapport GEO complet Detekia est pret — ${rootUrl}`;
    const emailLabel = locale === 'en' ? 'COMPLETE GEO REPORT — SITE AUDIT' : 'RAPPORT GEO COMPLET — AUDIT SITE';
    const emailFilename = locale === 'en' ? 'complete-geo-report' : 'rapport-geo-complet';

    const { error: emailError } = await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: customerEmail,
      subject: emailSubject,
      html: `
        <div style="background:#F7F5F2;padding:40px 20px;font-family:system-ui">
          <div style="max-width:560px;margin:0 auto">
            <div style="text-align:center;margin-bottom:32px">
              <div style="font-family:Georgia,serif;font-size:22px;color:#1A1916;margin-bottom:8px">Detekia</div>
              <div style="font-family:monospace;font-size:10px;color:#8A8680;letter-spacing:2px">${emailLabel}</div>
            </div>
            <div style="background:#1A1916;border-radius:16px;padding:32px;text-align:center;margin-bottom:28px">
              <div style="font-family:Georgia,serif;font-size:64px;color:#F7F5F2;line-height:1;letter-spacing:-2px">${consolidated.scoreAverage}</div>
              <div style="font-family:monospace;font-size:12px;color:rgba(247,245,242,0.4);margin-top:4px">/100 &mdash; ${consolidated.pagesValid} pages &middot; ${rootUrl}</div>
            </div>
            <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #E5E2DC;margin-bottom:20px">
              <p style="font-size:15px;color:#1A1916;line-height:1.7;margin:0 0 16px">Votre rapport GEO complet multi-pages est en pi\u00e8ce jointe.</p>
              <p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0 0 16px">${consolidated.pagesValid} pages analys\u00e9es, ${(consolidated.patterns || []).length} patterns transverses, ${(consolidated.actionPlan || []).length} actions prioritaires.</p>
              <p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0">Besoin d'aide ? R\u00e9pondez directement \u00e0 cet email.</p>
            </div>
            <div style="text-align:center;font-size:12px;color:#8A8680;line-height:1.6;padding-top:8px">Beeleven SASU &middot; hello@detekia.fr &middot; detekia.fr</div>
          </div>
        </div>
      `,
      attachments: [{
        filename: `${emailFilename}-${safeName}.pdf`,
        content: Buffer.from(pdfBuffer).toString('base64'),
        content_type: 'application/pdf',
      }],
    });

    if (emailError) throw new Error(`Resend error: ${JSON.stringify(emailError)}`);
    console.log(`[pro-generate-pdf] Email sent to ${customerEmail}`);

    // Notify Guillaume
    try {
      const now = new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
      await resend.emails.send({
        from: 'Detekia <hello@detekia.fr>',
        to: 'guillaume@beeleven.fr',
        subject: `\u{1F3AF} Vente Pro : rapport livr\u00e9 pour ${rootUrl}`,
        html: `<div style="font-family:system-ui;max-width:480px;margin:0 auto;padding:24px;">
          <div style="font-family:Georgia,serif;font-size:18px;color:#1A1916;margin-bottom:16px;">\u{1F3AF} Rapport Pro livr\u00e9</div>
          <div style="background:#F7F5F2;border-radius:8px;padding:16px 20px;">
            <div style="margin-bottom:6px;"><strong>Site :</strong> ${rootUrl}</div>
            <div style="margin-bottom:6px;"><strong>Score moyen :</strong> ${consolidated.scoreAverage}/100</div>
            <div style="margin-bottom:6px;"><strong>Pages :</strong> ${consolidated.pagesValid}</div>
            <div style="margin-bottom:6px;"><strong>Email client :</strong> ${customerEmail}</div>
            <div style="margin-bottom:6px;"><strong>PDF :</strong> ${Math.round(pdfBuffer.length / 1024)} KB</div>
            <div style="margin-bottom:6px;"><strong>PDFShift :</strong> ${pdfDuration}ms</div>
            <div><strong>Date :</strong> ${now}</div>
          </div>
        </div>`,
      });
    } catch (_) {}

    // Update status
    await redis.set(`${JOB_PREFIX}:${siteJobId}:status`, 'delivered', { ex: DELIVERED_TTL });
    await redis.set(`${JOB_PREFIX}:${siteJobId}:deliveredAt`, new Date().toISOString(), { ex: DELIVERED_TTL });

    const totalDuration = Date.now() - startMs;
    console.log(`[pro-generate-pdf] \u2705 Delivered ${siteJobId} in ${totalDuration}ms (PDFShift: ${pdfDuration}ms, PDF: ${Math.round(pdfBuffer.length / 1024)}KB)`);
    return res.status(200).json({ success: true, siteJobId, emailSent: true });
  } catch (err) {
    console.error(`[pro-generate-pdf] Error for ${siteJobId}:`, err.message);
    return res.status(500).json({ error: err.message });
  }
}
