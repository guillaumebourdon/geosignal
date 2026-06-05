const { Client, Receiver } = require('@upstash/qstash');
const { Redis } = require('@upstash/redis');
const { getTopPrioritizedUrls } = require('./sitemapPrioritizer');

const qstashClient = new Client({ token: process.env.QSTASH_TOKEN });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
});

const JOB_PREFIX = 'detekia:pro:v1:job';
const JOB_TTL = 24 * 60 * 60;

function generateJobId() {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  return `pro_${ts}_${rand}`;
}

async function createSiteAuditJob(rootUrl, { baseUrl, maxUrls = 10, locale = 'fr', pages } = {}) {
  const siteJobId = generateJobId();

  // If customer-selected pages are provided, use them directly; otherwise auto-detect
  let urls;
  let source;
  let backupUrls = [];

  if (pages && Array.isArray(pages) && pages.length >= 1) {
    source = 'customer_selection';
    urls = pages.map(p => ({
      url: p.url,
      score: 0,
      reasons: { slotType: p.type || 'custom', source },
    }));
  } else {
    source = 'auto_detection';
    // Fetch 15 candidates: 10 primary + 5 backups for substitution on failure
    const allCandidates = await getTopPrioritizedUrls(rootUrl, { maxUrls: Math.min(maxUrls + 5, 15) });
    urls = allCandidates.slice(0, maxUrls);
    backupUrls = allCandidates.slice(maxUrls);
  }

  if (!baseUrl) {
    baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
  }

  const workerEndpoint = `${baseUrl}/api/pro-worker`;
  let queuedCount = 0;

  // Stagger workers: 1 at a time, 45s apart, to stay under Anthropic rate limits
  // 45s × 10 = 7.5 min total, avoids 429 pile-up when Claude takes 30-60s per page
  const BATCH_SIZE = 1;
  const BATCH_DELAY_SEC = 45;

  for (let i = 0; i < urls.length; i++) {
    const entry = urls[i];
    const batchIndex = Math.floor(i / BATCH_SIZE);
    const delaySec = batchIndex * BATCH_DELAY_SEC;

    await qstashClient.publishJSON({
      url: workerEndpoint,
      body: {
        siteJobId,
        rootUrl,
        url: entry.url,
        index: i,
        total: urls.length,
        locale,
      },
      retries: 3,
      delay: delaySec,
    });
    queuedCount++;
  }

  // Store backup pages in Redis for substitution on failure (auto-detection only)
  if (backupUrls.length > 0) {
    const backupKey = `${JOB_PREFIX}:${siteJobId}:backups`;
    const backupData = backupUrls.map(u => JSON.stringify({ url: u.url, score: u.score, reasons: u.reasons }));
    await redis.lpush(backupKey, ...backupData);
    await redis.expire(backupKey, JOB_TTL);
    console.log(`[proQueue] Stored ${backupUrls.length} backup pages for ${siteJobId}`);
  }

  return {
    siteJobId,
    queuedCount,
    source,
    urls: urls.map(u => ({ url: u.url, score: u.score })),
  };
}

async function triggerConsolidation(siteJobId, { baseUrl }) {
  await qstashClient.publishJSON({
    url: `${baseUrl}/api/pro-consolidate`,
    body: { siteJobId, step: 1 },
    retries: 3,
    delay: 30, // Wait 30s for Anthropic RPM budget to recover after page analyses
  });
}

async function triggerConsolidationStep(siteJobId, nextStep, { baseUrl }) {
  await qstashClient.publishJSON({
    url: `${baseUrl}/api/pro-consolidate`,
    body: { siteJobId, step: nextStep },
    retries: 3,
    delay: 60, // 60s between each step to avoid rate limits
  });
}

async function triggerPdfGeneration(siteJobId, { baseUrl }) {
  await qstashClient.publishJSON({
    url: `${baseUrl}/api/pro-generate-pdf`,
    body: { siteJobId },
    retries: 3,
    delay: 10,
  });
}

async function triggerFinalizeReport(siteJobId, { baseUrl }) {
  await qstashClient.publishJSON({
    url: `${baseUrl}/api/pro-finalize-report`,
    body: { siteJobId },
    retries: 3,
    delay: 10,
  });
}

/**
 * Atomically pop the next backup URL for a job.
 * Returns parsed { url, score, reasons } or null if no backups remain.
 */
async function getBackupUrl(siteJobId) {
  try {
    const raw = await redis.rpop(`${JOB_PREFIX}:${siteJobId}:backups`);
    if (!raw) return null;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

async function verifyQstashSignature(signature, body) {
  try {
    const isValid = await receiver.verify({
      signature,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
    return isValid;
  } catch {
    return false;
  }
}

module.exports = { createSiteAuditJob, getBackupUrl, verifyQstashSignature, triggerConsolidation, triggerConsolidationStep, triggerPdfGeneration, triggerFinalizeReport };
