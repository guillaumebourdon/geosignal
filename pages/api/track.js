import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ANALYTICS_TTL = 10 * 365 * 24 * 60 * 60; // 10 years

export default async function handler(req, res) {
  // Accept both GET (for beacon/img) and POST
  const params = req.method === 'POST' ? req.body : req.query;
  const { id, event } = params;

  if (!id || !event) return res.status(400).json({ error: 'Missing id or event' });

  try {
    const entry = JSON.stringify({
      event,
      ts: new Date().toISOString(),
      ua: (req.headers['user-agent'] || '').substring(0, 200),
      ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '',
    });

    const key = `detekia:analytics:${id}`;
    await redis.lpush(key, entry);
    await redis.ltrim(key, 0, 999); // Cap at 1000 events per report
    // Set TTL only if not already set (first event)
    const ttl = await redis.ttl(key);
    if (ttl < 0) await redis.expire(key, ANALYTICS_TTL);

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[track] Error:', e.message);
    return res.status(200).json({ ok: true }); // Never fail tracking
  }
}
