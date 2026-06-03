const { Client, Receiver } = require('@upstash/qstash');
const { getTopPrioritizedUrls } = require('./sitemapPrioritizer');

const qstashClient = new Client({ token: process.env.QSTASH_TOKEN });

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
});

function generateJobId() {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  return `pro_${ts}_${rand}`;
}

async function createSiteAuditJob(rootUrl, { baseUrl, maxUrls = 10, locale = 'fr', pages } = {}) {
  const siteJobId = generateJobId();

  // If customer-selected pages are provided, use them directly; otherwise auto-detect
  let urls;
  if (pages && Array.isArray(pages) && pages.length >= 1) {
    urls = pages.map(p => ({
      url: p.url,
      score: 0,
      reasons: { slotType: p.type || 'custom', source: 'customer_selection' },
    }));
  } else {
    urls = await getTopPrioritizedUrls(rootUrl, { maxUrls });
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

  return {
    siteJobId,
    queuedCount,
    urls: urls.map(u => ({ url: u.url, score: u.score })),
  };
}

async function triggerConsolidation(siteJobId, { baseUrl }) {
  await qstashClient.publishJSON({
    url: `${baseUrl}/api/pro-consolidate`,
    body: { siteJobId },
    retries: 3,
    delay: 30, // Wait 30s for Anthropic RPM budget to recover after page analyses
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

module.exports = { createSiteAuditJob, verifyQstashSignature, triggerConsolidation, triggerPdfGeneration, triggerFinalizeReport };
