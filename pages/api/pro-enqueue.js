import { Redis } from '@upstash/redis';
import { createSiteAuditJob } from '../../lib/proQueue';

export const config = { maxDuration: 60 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const JOB_PREFIX = 'detekia:pro:v1:job';
const JOB_TTL = 24 * 60 * 60; // 24h — pages must survive until consolidation + finalize

export default async function handler(req, res) {
  const { checkRateLimit } = require('../../lib/rateLimit');
  if (!(await checkRateLimit('proEnqueue', req, res))) return;
  const rawUrl = req.query.url;
  const locale = req.query.locale === 'en' ? 'en' : 'fr';
  const customerEmail = req.query.email || 'guillaume@beeleven.fr';
  if (!rawUrl) return res.status(400).json({ error: 'Missing ?url= parameter' });

  let url;
  try {
    url = rawUrl.startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`;
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['host'] || 'localhost:3000';
  const baseUrl = `${proto}://${host}`;

  try {
    const result = await createSiteAuditJob(url, { baseUrl, locale });

    // Store job metadata in Redis
    try {
      await redis.set(`${JOB_PREFIX}:${result.siteJobId}:total`, result.queuedCount, { ex: JOB_TTL });
      await redis.set(`${JOB_PREFIX}:${result.siteJobId}:meta`, {
        rootUrl: url,
        locale,
        customerEmail,
        queuedAt: new Date().toISOString(),
        urls: result.urls,
      }, { ex: JOB_TTL });
    } catch (err) {
      console.error('[pro-enqueue] Redis metadata write error:', err.message);
    }

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('[pro-enqueue] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
