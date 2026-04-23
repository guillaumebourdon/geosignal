import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const JOB_PREFIX = 'detekia:pro:v1:job';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { siteJobId } = req.query;
  if (!siteJobId) return res.status(400).json({ error: 'Missing ?siteJobId= parameter' });

  try {
    const [total, completed, meta] = await Promise.all([
      redis.get(`${JOB_PREFIX}:${siteJobId}:total`),
      redis.get(`${JOB_PREFIX}:${siteJobId}:completed`),
      redis.get(`${JOB_PREFIX}:${siteJobId}:meta`),
    ]);

    if (total === null) {
      return res.status(404).json({ error: 'Job not found', siteJobId });
    }

    const totalNum = Number(total) || 0;
    const completedNum = Number(completed) || 0;
    const metaData = typeof meta === 'string' ? JSON.parse(meta) : meta;

    // Fetch individual page results
    const pageKeys = Array.from({ length: totalNum }, (_, i) => `${JOB_PREFIX}:${siteJobId}:page:${i}`);
    const pageResults = await Promise.all(pageKeys.map(k => redis.get(k).catch(() => null)));

    const pages = pageResults.map((raw, i) => {
      if (!raw) return { index: i, status: 'pending' };
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return {
        index: i,
        url: data.url,
        score: data.score ?? null,
        hasError: !!data.error,
        error: data.error || null,
        analyzedAt: data.analyzedAt || null,
        status: 'done',
      };
    });

    return res.status(200).json({
      siteJobId,
      total: totalNum,
      completed: completedNum,
      rootUrl: metaData?.rootUrl || null,
      locale: metaData?.locale || null,
      queuedAt: metaData?.queuedAt || null,
      pages,
    });
  } catch (err) {
    console.error('[pro-status] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
