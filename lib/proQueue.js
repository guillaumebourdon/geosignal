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

async function createSiteAuditJob(rootUrl, { baseUrl, maxUrls = 20, locale = 'fr' } = {}) {
  const siteJobId = generateJobId();

  const urls = await getTopPrioritizedUrls(rootUrl, { maxUrls });

  if (!baseUrl) {
    baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
  }

  const workerEndpoint = `${baseUrl}/api/pro-worker`;
  let queuedCount = 0;

  // Stagger workers: groups of 2, 15s apart, to stay under 50 RPM Anthropic limit
  const BATCH_SIZE = 2;
  const BATCH_DELAY_SEC = 15;

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
      retries: 2,
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

module.exports = { createSiteAuditJob, verifyQstashSignature };
