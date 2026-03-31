import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const rawUrl = req.query.url;
  if (!rawUrl) return res.status(400).json({ error: 'URL manquante' });
  const url = rawUrl.startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`;

  const cacheKey  = `detekia:v11:${url.toLowerCase()}`;
  const statusKey = `detekia:status:${url.toLowerCase()}`;

  try {
    const status = await redis.get(statusKey);

    if (!status)              return res.status(200).json({ status: 'not_found' });
    if (status === 'processing') return res.status(200).json({ status: 'processing' });
    if (status === 'error')   return res.status(200).json({ status: 'error' });

    if (status === 'done') {
      const data = await redis.get(cacheKey);
      if (!data) return res.status(200).json({ status: 'error' });
      return res.status(200).json({ status: 'done', data });
    }

    return res.status(200).json({ status: 'not_found' });
  } catch (e) {
    console.error('analyze-status error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
