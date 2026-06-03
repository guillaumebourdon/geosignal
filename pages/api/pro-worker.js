import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import { Client } from '@upstash/qstash';
import { verifyQstashSignature, triggerConsolidation, getBackupUrl } from '../../lib/proQueue';
import { analyzePage } from '../../lib/proPageAnalyzer';

const qstashClient = new Client({ token: process.env.QSTASH_TOKEN });

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  maxDuration: 300,
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

    // If still failing after retry, alert and return 500 for QStash retry
    if (result.error) {
      const retryStr = String(result.error);
      const isRetryable = retryStr.includes('429') || retryStr.includes('rate_limit') || retryStr.includes('timeout') || retryStr.includes('ETIMEDOUT');

      // Send alert email
      try {
        await resend.emails.send({
          from: 'Detekia <hello@detekia.fr>',
          to: 'guillaume@beeleven.fr',
          subject: `⚠️ Pro audit — page en échec : ${url}`,
          html: `<div style="font-family:system-ui;padding:24px;">
            <h2 style="color:#D97757;">Page en échec après retry</h2>
            <p><strong>Site job :</strong> ${siteJobId}</p>
            <p><strong>Page :</strong> ${url}</p>
            <p><strong>Erreur :</strong> ${retryStr.substring(0, 300)}</p>
            <p><strong>Retryable :</strong> ${isRetryable ? 'Oui (QStash va retenter)' : 'Non (erreur définitive)'}</p>
            <p><strong>Index :</strong> ${index}/${total}</p>
            <p style="color:#6B6762;font-size:13px;margin-top:20px;">Ce message est envoyé automatiquement quand une page échoue dans un audit Pro payé.</p>
          </div>`,
        });
      } catch (emailErr) {
        console.error('[pro-worker] Alert email failed:', emailErr.message);
      }

      if (isRetryable) {
        console.warn(`[pro-worker] Still failing after retry for ${url}: ${retryStr.substring(0, 100)}. Returning 500 for QStash retry.`);
        return res.status(500).json({ error: 'retryable', url, detail: retryStr.substring(0, 200) });
      }

      // Non-retryable failure — try backup substitution (auto-detection only)
      try {
        const metaRaw = await redis.get(`${JOB_PREFIX}:${siteJobId}:meta`);
        const meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
        const source = meta?.source || 'auto_detection';

        if (source !== 'customer_selection') {
          const backup = await getBackupUrl(siteJobId);
          if (backup) {
            const proto = req.headers['x-forwarded-proto'] || 'https';
            const host = req.headers['host'] || 'localhost:3000';
            const workerEndpoint = `${proto}://${host}/api/pro-worker`;

            await qstashClient.publishJSON({
              url: workerEndpoint,
              body: { siteJobId, rootUrl, url: backup.url, index, total, locale, isBackup: true },
              retries: 2,
              delay: 10,
            });

            console.log(`[pro-worker] Substituted failed ${url} with backup ${backup.url} at index ${index}`);
            // Do NOT store error result, do NOT increment counter — the replacement worker will handle both
            return res.status(200).json({ success: true, substituted: true, original: url, backup: backup.url });
          }
        }
      } catch (subErr) {
        console.error(`[pro-worker] Backup substitution error for ${url}:`, subErr.message);
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
  let shouldTrigger = newCount >= total;

  // Safety net: if we're one of the last workers (within 2 of total),
  // double-check stored page count in case counter drifted
  if (!shouldTrigger && newCount >= total - 2) {
    const pageChecks = await Promise.all(
      Array.from({ length: total }, (_, i) => redis.exists(`${JOB_PREFIX}:${siteJobId}:page:${i}`))
    );
    const storedCount = pageChecks.filter(Boolean).length;
    if (storedCount >= total) {
      console.log(`[pro-worker] Safety net: counter=${newCount} but ${storedCount}/${total} pages stored. Forcing consolidation.`);
      shouldTrigger = true;
    }
  }

  if (shouldTrigger) {
    // Atomic guard: SET NX to prevent double consolidation from QStash retries
    const lockKey = `${JOB_PREFIX}:${siteJobId}:consolidation_triggered`;
    const acquired = await redis.set(lockKey, '1', { nx: true, ex: JOB_TTL });
    if (acquired) {
      console.log(`[pro-worker] All pages done for ${siteJobId}, triggering consolidation`);
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers['host'] || 'localhost:3000';
      try {
        await triggerConsolidation(siteJobId, { baseUrl: `${proto}://${host}` });
      } catch (err) {
        // If QStash trigger fails, release the lock so another worker can retry
        console.error(`[pro-worker] Consolidation trigger FAILED for ${siteJobId}: ${err.message}. Releasing lock.`);
        await redis.del(lockKey).catch(() => {});
      }
    } else {
      console.log(`[pro-worker] All pages done for ${siteJobId}, but consolidation already triggered`);
    }
  }

  return res.status(200).json({ success: true, siteJobId, url, progress: `${newCount}/${total}` });
}
