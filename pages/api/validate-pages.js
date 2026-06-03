/**
 * POST /api/validate-pages
 * Tests an array of URLs for scrapability in parallel.
 * Used by PageSelector to validate pages before Stripe checkout.
 */
import { checkRateLimit } from '../../lib/rateLimit';
import { checkPageScrapability } from '../../lib/scrapabilityCheck';

export const config = { maxDuration: 15 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!(await checkRateLimit('validatePages', req, res))) return;

  const { urls } = req.body;
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'Missing or empty urls array' });
  }

  if (urls.length > 15) {
    return res.status(400).json({ error: 'Maximum 15 URLs per request' });
  }

  const results = await Promise.allSettled(
    urls.map(url => checkPageScrapability(url, 8000))
  );

  const output = results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { url: urls[i], scrapable: false, reason: 'error' }
  );

  return res.status(200).json({ results: output });
}
