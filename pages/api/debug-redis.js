import { Redis } from '@upstash/redis';
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const keys = await redis.keys('detekia:v11:*alan*');
  const allKeys = await redis.keys('detekia:v11:*');
  res.status(200).json({
    alan_keys: keys,
    total_v11_keys: allKeys.length,
    first_10_keys: allKeys.slice(0, 10)
  });
}
