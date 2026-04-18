import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { jobId } = req.query;
  if (!jobId) return res.status(400).json({ error: 'jobId required' });

  const jobKey = `detekia:v11:job:${jobId}`;
  const job = await redis.get(jobKey);

  if (!job) return res.status(404).json({ error: 'Job not found or expired' });

  return res.status(200).json(job);
}
