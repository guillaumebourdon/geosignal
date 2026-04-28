import { Redis } from '@upstash/redis';
import { verifyQstashSignature, triggerConsolidation } from '../../lib/proQueue';
import { analyzePage } from '../../lib/proPageAnalyzer';

export const config = {
  maxDuration: 120,
  api: { bodyParser: false },
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const JOB_PREFIX = 'detekia:pro:v1:job';
const JOB_TTL = 24 * 60 * 60; // 24 hours (was 2h — too short, pages expired before consolidation)

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const signature = req.headers['upstash-signature'];
  const rawBody = await readRawBody(req);

  if (!signature || !(await verifyQstashSignature(signature, rawBody))) {
    console.error('[pro-worker] Signature verification failed');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let payload;
  try { payload = JSON.parse(rawBody); } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { siteJobId, rootUrl, url, index, total, locale } = payload;
  const pageKey = `${JOB_PREFIX}:${siteJobId}:page:${index}`;
  const counterKey = `${JOB_PREFIX}:${siteJobId}:completed`;

  // Idempotence: skip if already processed
  try {
    const existing = await redis.get(pageKey);
    if (existing) {
      console.log(`[pro-worker] Idempotent skip for ${url} (job ${siteJobId}, index ${index})`);
      return res.status(200).json({ success: true, skipped: true, siteJobId, url });
    }
  } catch {}

  // Run real analysis — retry once with backoff on 429
  let result = await analyzePage(url, { locale: locale || 'fr' });

  if (result.error) {
    const errStr = String(result.error);
    const is429 = errStr.includes('429') || errStr.includes('rate_limit');

    // On 429: wait 30s and retry once within this worker invocation
    if (is429) {
      console.warn(`[pro-worker] 429 for ${url}, waiting 20s before retry...`);
      await new Promise(r => setTimeout(r, 20000));
      result = await analyzePage(url, { locale: locale || 'fr' });
    }

    // If still failing after retry, return 500 for QStash retry
    if (result.error) {
      const retryStr = String(result.error);
      const isRetryable = retryStr.includes('429') || retryStr.includes('rate_limit') || retryStr.includes('timeout') || retryStr.includes('ETIMEDOUT');
      if (isRetryable) {
        console.warn(`[pro-worker] Still failing after retry for ${url}: ${retryStr.substring(0, 100)}. Returning 500 for QStash retry.`);
        return res.status(500).json({ error: 'retryable', url, detail: retryStr.substring(0, 200) });
      }
    }
  }

  // Store result
  try {
    await redis.set(pageKey, result, { ex: JOB_TTL });
  } catch (err) {
    console.error(`[pro-worker] Redis set error for ${pageKey}:`, err.message);
  }

  // Increment counter
  let newCount = 0;
  try {
    newCount = await redis.incr(counterKey);
    await redis.expire(counterKey, JOB_TTL);
  } catch (err) {
    console.error(`[pro-worker] Redis incr error for ${counterKey}:`, err.message);
  }

  console.log(`[pro-worker] Completed page ${index + 1}/${total} for ${siteJobId} (url=${url}, score=${result.score || 'error'}, progress=${newCount}/${total})`);

  // Check if all pages are done — trigger consolidation
  // Also handles catch-up: if a previous worker timed out after incr but before trigger
  const shouldTrigger = newCount >= total;
  // Safety net: if we're one of the last workers, double-check stored page count
  if (!shouldTrigger && newCount >= total - 2) {
    let storedCount = 0;
    for (let i = 0; i < total; i++) {
      const exists = await redis.exists(`${JOB_PREFIX}:${siteJobId}:page:${i}`);
      if (exists) storedCount++;
    }
    if (storedCount >= total) {
      console.log(`[pro-worker] Safety net: counter=${newCount} but ${storedCount}/${total} pages stored. Triggering consolidation.`);
    }
  }

  if (newCount >= total) {
    // Atomic guard: SET NX to prevent double consolidation from QStash retries
    const lockKey = `${JOB_PREFIX}:${siteJobId}:consolidation_triggered`;
    const acquired = await redis.set(lockKey, '1', { nx: true, ex: JOB_TTL });
    if (acquired) {
      console.log(`[pro-worker] All pages done for ${siteJobId}, triggering consolidation`);
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers['host'] || 'localhost:3000';
      await triggerConsolidation(siteJobId, { baseUrl: `${proto}://${host}` });
    } else {
      console.log(`[pro-worker] All pages done for ${siteJobId}, but consolidation already triggered`);
    }
  }

  return res.status(200).json({ success: true, siteJobId, url, progress: `${newCount}/${total}` });
}
