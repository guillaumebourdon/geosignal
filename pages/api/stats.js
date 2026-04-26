import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const COUNTER_KEY = 'detekia:stats:audit-count';
const INITIAL_COUNT = 500;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  try {
    let count = await redis.get(COUNTER_KEY);
    if (count === null) {
      // Initialize counter on first call
      await redis.set(COUNTER_KEY, INITIAL_COUNT);
      count = INITIAL_COUNT;
    }
    return res.status(200).json({ audits: Number(count) });
  } catch {
    return res.status(200).json({ audits: INITIAL_COUNT }); // Graceful fallback
  }
}
