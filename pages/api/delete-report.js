import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const DELETE_SECRET = process.env.DELETE_REPORT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'DELETE only' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  // Read secret from Authorization header only
  const secret = req.headers.authorization?.replace('Bearer ', '');

  if (!DELETE_SECRET || secret !== DELETE_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const deleted = await redis.del(`detekia:report:${id}`);
    await redis.del(`detekia:analytics:${id}`);
    await redis.del(`detekia:report:customer:${id}`);

    if (!deleted) return res.status(404).json({ error: 'Report not found' });
    return res.status(200).json({ success: true, deleted: id });
  } catch (e) {
    console.error('[delete-report] Error:', e.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
