import { createSiteAuditJob } from '../../lib/proQueue';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  const rawUrl = req.query.url;
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
    const result = await createSiteAuditJob(url, { baseUrl });
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('[pro-enqueue] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
