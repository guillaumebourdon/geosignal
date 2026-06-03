/**
 * POST /api/suggest-pages
 * Returns the 10 auto-detected pages for a given site URL.
 * Validates each page for scrapability and replaces failures with backup candidates.
 * Used by the page selector step in the Pro checkout flow.
 */
import { checkRateLimit } from '../../lib/rateLimit';
import { checkPageScrapability } from '../../lib/scrapabilityCheck';

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
    // Fetch 20 candidates: 10 primary + 10 potential replacements
    const allCandidates = await getTopPrioritizedUrls(url, { maxUrls: 20 });

    const primary = allCandidates.slice(0, 10);
    const replacements = allCandidates.slice(10);

    // Validate primary pages in parallel
    const checks = await Promise.allSettled(
      primary.map(p => checkPageScrapability(p.url, 8000))
    );

    const result = [];
    let replacementIndex = 0;

    for (let i = 0; i < primary.length; i++) {
      const check = checks[i];
      const scrapable = check.status === 'fulfilled' && check.value.scrapable;
      const reason = check.status === 'fulfilled' ? check.value.reason : 'error';

      if (scrapable) {
        result.push({
          url: primary[i].url,
          type: primary[i].reasons?.slotType || 'other',
          scrapable: true,
          reason: 'ok',
        });
      } else {
        // Try to find a scrapable replacement
        let replaced = false;
        while (replacementIndex < replacements.length) {
          const candidate = replacements[replacementIndex];
          replacementIndex++;
          const repCheck = await checkPageScrapability(candidate.url, 8000);
          if (repCheck.scrapable) {
            console.log(`[suggest-pages] Replaced unscrapable ${primary[i].url} (${reason}) with ${candidate.url}`);
            result.push({
              url: candidate.url,
              type: candidate.reasons?.slotType || 'other',
              scrapable: true,
              reason: 'ok',
            });
            replaced = true;
            break;
          }
        }
        // No replacement found — include the original with its status
        if (!replaced) {
          console.warn(`[suggest-pages] No replacement for unscrapable ${primary[i].url} (${reason})`);
          result.push({
            url: primary[i].url,
            type: primary[i].reasons?.slotType || 'other',
            scrapable: false,
            reason,
          });
        }
      }
    }

    return res.status(200).json({ pages: result, hostname });
  } catch (e) {
    console.error('[suggest-pages] Error:', e.message);
    return res.status(500).json({ error: 'Failed to detect pages' });
  }
}
