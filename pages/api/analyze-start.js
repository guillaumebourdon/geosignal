import { Redis } from '@upstash/redis';
import { runAnalysis } from '../../lib/analyzer';

export const config = { maxDuration: 60 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const url = req.body.url;
  if (!url) return res.status(400).json({ error: 'URL manquante' });

  const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const jobKey = `detekia:v11:job:${jobId}`;

  await redis.set(jobKey, { status: 'pending', url, createdAt: Date.now() }, { ex: 600 });

  // Fire-and-forget: launch analysis in background
  runAnalysis(url)
    .then(async (data) => {
      await redis.set(jobKey, { status: 'done', data, completedAt: Date.now() }, { ex: 600 });
    })
    .catch(async (err) => {
      console.error('analyze-start background error:', err.message);
      await redis.set(jobKey, { status: 'error', error: err.message, failedAt: Date.now() }, { ex: 600 });
    });

  // Update to processing immediately after launching
  redis.set(jobKey, { status: 'processing', url, createdAt: Date.now() }, { ex: 600 })
    .catch(e => console.error('Redis processing update failed:', e.message));

  return res.status(200).json({ jobId, status: 'started' });
}
