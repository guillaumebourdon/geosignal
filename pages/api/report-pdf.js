import { Redis } from '@upstash/redis';

export const config = { maxDuration: 300 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const { generateReportHTML } = require('../../lib/oneReportTemplate');

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    // Load report from Redis
    const raw = await redis.get(`detekia:report:${id}`);
    if (!raw) return res.status(404).json({ error: 'Report not found' });

    const record = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const { reportData, url, locale } = record;
    if (!reportData) return res.status(404).json({ error: 'Report data missing' });

    // Generate HTML using existing PDF template
    const html = generateReportHTML({ url, ...reportData }, locale || 'fr');

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
    const safeName = (url || 'report').replace(/[^a-z0-9]/gi, '-');

    // Track download event
    try {
      await redis.lpush(`detekia:analytics:${id}`, JSON.stringify({
        event: 'download-pdf',
        ts: new Date().toISOString(),
        ua: (req.headers['user-agent'] || '').substring(0, 200),
      }));
    } catch (_) {}

    // Stream PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="rapport-geo-${safeName}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.send(pdfBuffer);

  } catch (e) {
    console.error('[report-pdf] Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
