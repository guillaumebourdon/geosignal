import { verifyQstashSignature } from '../../lib/proQueue';

export const config = {
  maxDuration: 120,
  api: { bodyParser: false },
};

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
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { siteJobId, rootUrl, url, index, total } = payload;
  console.log(`[pro-worker] Received: siteJobId=${siteJobId} url=${url} index=${index}/${total}`);

  return res.status(200).json({ success: true, received: url, siteJobId });
}
