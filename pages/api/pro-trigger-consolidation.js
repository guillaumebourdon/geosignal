/**
 * Manual consolidation trigger — bypasses QStash signature.
 * Protected by admin secret. Use when QStash callback fails silently.
 *
 * GET /api/pro-trigger-consolidation?siteJobId=xxx&secret=yyy
 */
import { Redis } from '@upstash/redis';
import { triggerConsolidation } from '../../lib/proQueue';

export const config = { maxDuration: 30 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const JOB_PREFIX = 'detekia:pro:v1:job';
const ADMIN_SECRET = process.env.PRO_ADMIN_SECRET || 'detekia-pro-manual-2026';

export default async function handler(req, res) {
  const { siteJobId, secret, action } = req.query;

  if (secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Invalid secret' });
  if (!siteJobId) return res.status(400).json({ error: 'Missing siteJobId' });

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['host'] || 'localhost:3000';
  const baseUrl = `${proto}://${host}`;

  if (action === 'reset-locks') {
    // Clear all locks so consolidation + PDF can be re-triggered
    const lockKey = `${JOB_PREFIX}:${siteJobId}:consolidation_triggered`;
    const pdfLock = `${JOB_PREFIX}:${siteJobId}:pdf_triggered`;
    const statusKey = `${JOB_PREFIX}:${siteJobId}:status`;
    await Promise.all([
      redis.del(lockKey),
      redis.del(pdfLock),
      redis.del(statusKey),
    ]);
    return res.status(200).json({ success: true, action: 'locks_reset', siteJobId });
  }

  // Default: trigger consolidation via QStash
  try {
    // Clear lock first
    const lockKey = `${JOB_PREFIX}:${siteJobId}:consolidation_triggered`;
    await redis.del(lockKey);

    await triggerConsolidation(siteJobId, { baseUrl });
    return res.status(200).json({ success: true, action: 'consolidation_triggered', siteJobId, baseUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
