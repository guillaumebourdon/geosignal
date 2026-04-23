import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { verifyQstashSignature } from '../../lib/proQueue';
import { generateProReportHTML, PRO_STRINGS } from '../../lib/proReportTemplate';

export const config = {
  maxDuration: 120,
  api: { bodyParser: false },
};

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

  try {
    // Read consolidated report + meta
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

    // Read full page results for per-page detail
    const total = consolidated.pages?.length || 0;
    const pageKeys = Array.from({ length: total }, (_, i) => `${JOB_PREFIX}:${siteJobId}:page:${i}`);
    const pageResults = await Promise.all(pageKeys.map(k => redis.get(k).catch(() => null)));
    const fullPages = pageResults.map((raw, i) => {
      if (!raw) return consolidated.pages?.[i] || { url: `page-${i}`, error: 'Not found' };
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    });

    // Inject full page data into consolidated report for template
    const reportForTemplate = { ...consolidated, pages: fullPages };

    // Generate HTML
    const html = generateProReportHTML(reportForTemplate, locale);

    // Generate PDF via PDFShift
    console.log(`[pro-generate-pdf] Calling PDFShift for ${siteJobId}`);
    const pdfResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('api:' + process.env.PDFSHIFT_API_KEY).toString('base64'),
      },
      body: JSON.stringify({ source: html, landscape: false, use_print: true, format: 'A4', margin: { top: '0', right: '0', bottom: '0', left: '0' } }),
    });

    if (!pdfResponse.ok) {
      const errText = await pdfResponse.text();
      throw new Error(`PDFShift error: ${pdfResponse.status} ${errText}`);
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
    console.log(`[pro-generate-pdf] PDF generated, size: ${pdfBuffer.length} bytes`);

    // Send email to customer
    const safeName = rootUrl.replace(/[^a-z0-9]/gi, '-');
    const { error: emailError } = await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: customerEmail,
      subject: `${t.email.subject} — ${rootUrl}`,
      html: `
        <div style="background:#F7F5F2;padding:40px 20px;font-family:system-ui">
          <div style="max-width:560px;margin:0 auto">
            <div style="text-align:center;margin-bottom:32px">
              <div style="font-family:Georgia,serif;font-size:22px;color:#1A1916;margin-bottom:8px">Detekia</div>
              <div style="font-family:monospace;font-size:10px;color:#8A8680;letter-spacing:2px">${t.email.headerLabel}</div>
            </div>
            <div style="background:#1A1916;border-radius:16px;padding:32px;text-align:center;margin-bottom:28px">
              <div style="font-family:Georgia,serif;font-size:64px;color:#F7F5F2;line-height:1;letter-spacing:-2px">${consolidated.scoreAverage}</div>
              <div style="font-family:monospace;font-size:12px;color:rgba(247,245,242,0.4);margin-top:4px">/100 — ${consolidated.pagesValid} pages &middot; ${rootUrl}</div>
            </div>
            <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #E5E2DC;margin-bottom:20px">
              <p style="font-size:15px;color:#1A1916;line-height:1.7;margin:0 0 16px">Votre rapport GEO complet multi-pages est en pi\u00e8ce jointe.</p>
              <p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0 0 16px">Il contient l'analyse de ${consolidated.pagesValid} pages, ${(consolidated.patterns || []).length} patterns transverses identifi\u00e9s, et ${(consolidated.actionPlan || []).length} actions prioritaires pour am\u00e9liorer la visibilit\u00e9 IA de votre site.</p>
              <p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0">Besoin d'aide pour la mise en \u0153uvre ? R\u00e9pondez directement \u00e0 cet email.</p>
            </div>
            <div style="text-align:center;font-size:12px;color:#8A8680;font-family:system-ui;line-height:1.6;padding-top:8px">
              Beeleven SASU &middot; hello@detekia.fr &middot; detekia.fr
            </div>
          </div>
        </div>
      `,
      attachments: [{
        filename: `${t.email.filename}-${safeName}.pdf`,
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
            <div style="margin-bottom:6px;"><strong>Pages :</strong> ${consolidated.pagesValid} valid\u00e9es</div>
            <div style="margin-bottom:6px;"><strong>Email client :</strong> ${customerEmail}</div>
            <div style="margin-bottom:6px;"><strong>Job ID :</strong> ${siteJobId}</div>
            <div><strong>Date :</strong> ${now}</div>
          </div>
        </div>`,
      });
    } catch (notifErr) {
      console.error('[pro-generate-pdf] Notification failed:', notifErr.message);
    }

    // Update status
    await redis.set(`${JOB_PREFIX}:${siteJobId}:status`, 'delivered', { ex: DELIVERED_TTL });
    await redis.set(`${JOB_PREFIX}:${siteJobId}:deliveredAt`, new Date().toISOString(), { ex: DELIVERED_TTL });

    console.log(`[pro-generate-pdf] \u2705 Delivered ${siteJobId} to ${customerEmail}`);
    return res.status(200).json({ success: true, siteJobId, emailSent: true });
  } catch (err) {
    console.error(`[pro-generate-pdf] Error for ${siteJobId}:`, err.message);
    return res.status(500).json({ error: err.message });
  }
}
