import { Redis } from '@upstash/redis';

export const config = { maxDuration: 300 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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

    // Generate PDF from the LIVE web page (same content as what the user sees)
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'detekia.fr';
    const reportUrl = `${proto}://${host}/r/${id}`;

    const pdfResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('api:' + process.env.PDFSHIFT_API_KEY).toString('base64'),
      },
      body: JSON.stringify({
        source: reportUrl,
        landscape: false,
        use_print: true,
        format: 'A4',
        wait_for: 'network_idle',
        css: '@media print { .no-print, button, header[style*="sticky"] { display: none !important; } }',
      }),
      signal: AbortSignal.timeout(240000),
    });

    if (!pdfResponse.ok) {
      const errText = await pdfResponse.text();
      console.error(`[report-pdf] PDFShift error ${pdfResponse.status}:`, errText.substring(0, 500));
      return res.status(500).json({ error: 'PDF generation failed' });
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    if (pdfBuffer.length < 5000) {
      console.error(`[report-pdf] PDF too small (${pdfBuffer.length} bytes) — page may be down`);
      return res.status(500).json({ error: 'PDF generation returned an empty or invalid document' });
    }

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
