/**
 * POST /api/suggest-pages
 * Returns the 10 auto-detected pages for a given site URL.
 * Used by the page selector step in the Pro checkout flow.
 */
import { checkRateLimit } from '../../lib/rateLimit';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!(await checkRateLimit('suggestPages', req, res))) return;

  const { url: rawUrl, locale } = req.body;
  if (!rawUrl) return res.status(400).json({ error: 'Missing url' });

  let url;
  try {
    url = rawUrl.startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`;
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const hostname = new URL(url).hostname.replace(/^www\./, '');

  try {
    const { getTopPrioritizedUrls } = require('../../lib/sitemapPrioritizer');
    const pages = await getTopPrioritizedUrls(url, { maxUrls: 10 });

    const result = pages.map(p => ({
      url: p.url,
      type: p.reasons?.slotType || 'other',
    }));

    return res.status(200).json({ pages: result, hostname });
  } catch (e) {
    console.error('[suggest-pages] Error:', e.message);
    return res.status(500).json({ error: 'Failed to detect pages' });
  }
}
