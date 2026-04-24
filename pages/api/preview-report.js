import { Redis } from '@upstash/redis';

export const config = { maxDuration: 60 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ─── Report template (shared with generate-pdf.js) ──────────────────────────
const { generateReportHTML } = require('../../lib/oneReportTemplate');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const rawUrl = req.query.url;
  const locale = req.query.locale === 'en' ? 'en' : 'fr';
  if (!rawUrl) return res.status(400).json({ error: 'Paramètre url manquant' });

  const url = rawUrl.startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`;
  const cacheKey = `detekia:v14:${url.toLowerCase()}:${locale}`;
  const cached = await redis.get(cacheKey);

  if (!cached) {
    return res.status(404).send(`Aucune analyse trouvée pour cette URL. Scannez d'abord le site sur detekia.fr`);
  }

  const data = typeof cached === 'string' ? JSON.parse(cached) : cached;

  const html = generateReportHTML({ url, ...data }, locale);

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
