import { Redis } from '@upstash/redis';

export const config = { maxDuration: 300 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const { generateReportHTML } = require('../../lib/oneReportTemplate');
const { generateProReportHTML } = require('../../lib/proReportTemplate');

export default async function handler(req, res) {
  const { checkRateLimit } = require('../../lib/rateLimit');
  if (!(await checkRateLimit('reportPdf', req, res))) return;
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const raw = await redis.get(`detekia:report:${id}`);
    if (!raw) return res.status(404).json({ error: 'Report not found' });

    const record = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const isPro = record.reportType === 'pro';
    const locale = record.locale || 'fr';
    let html;

    if (isPro) {
      const report = record.consolidatedReport;
      if (!report) return res.status(404).json({ error: 'Pro report data missing' });
      html = generateProReportHTML(report, locale);
    } else {
      const { reportData, url } = record;
      if (!reportData) return res.status(404).json({ error: 'Report data missing' });
      html = generateReportHTML({ url, ...reportData }, locale);
    }

    // Call PDFShift
    const pdfResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('api:' + process.env.PDFSHIFT_API_KEY).toString('base64'),
      },
      body: JSON.stringify({ source: html, landscape: false, use_print: true, format: 'A4' }),
      signal: AbortSignal.timeout(240000),
    });

    if (!pdfResponse.ok) {
      const errText = await pdfResponse.text();
      console.error(`[report-pdf] PDFShift error ${pdfResponse.status}:`, errText.substring(0, 500));
      return res.status(500).json({ error: 'PDF generation failed' });
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
    const safeName = (record.url || 'report').replace(/[^a-z0-9]/gi, '-');
    const filename = isPro ? `rapport-geo-complet-${safeName}.pdf` : `rapport-geo-${safeName}.pdf`;

    // Track download
    try {
      await redis.lpush(`detekia:analytics:${id}`, JSON.stringify({
        event: 'download-pdf',
        ts: new Date().toISOString(),
        ua: (req.headers['user-agent'] || '').substring(0, 200),
      }));
    } catch (_) {}

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.send(pdfBuffer);

  } catch (e) {
    console.error('[report-pdf] Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
