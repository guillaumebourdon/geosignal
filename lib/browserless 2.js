/**
 * Browserless.io fallback — headless Chrome for JS-heavy sites.
 * Used as last resort when Jina + direct HTML fail.
 *
 * Setup: add BROWSERLESS_TOKEN to env vars (free tier: 1000 sessions/month)
 * Sign up: https://www.browserless.io/
 */

const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN;
const BROWSERLESS_URL = 'https://chrome.browserless.io';

/**
 * Fetch fully rendered HTML via headless Chrome.
 * Returns null if Browserless is not configured or fails.
 */
async function fetchRenderedHtml(url, { timeout = 15000 } = {}) {
  if (!BROWSERLESS_TOKEN) return null;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout + 5000);

    const res = await fetch(`${BROWSERLESS_URL}/content?token=${BROWSERLESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        gotoOptions: { waitUntil: 'networkidle2', timeout },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.text();
  } catch (e) {
    console.log(`[browserless] Failed for ${url}: ${e.message.slice(0, 40)}`);
    return null;
  }
}

/**
 * Extract internal links from a rendered page via headless Chrome.
 * Returns array of { url, lastmod: null, priority: null } entries.
 */
async function extractLinksWithBrowser(url, hostname, { maxLinks = 50, timeout = 15000 } = {}) {
  if (!BROWSERLESS_TOKEN) return [];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout + 5000);

    const res = await fetch(`${BROWSERLESS_URL}/scrape?token=${BROWSERLESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        elements: [{ selector: 'a[href]' }],
        gotoOptions: { waitUntil: 'networkidle2', timeout },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);
    if (!res.ok) return [];

    const data = await res.json();
    const links = [];
    const seen = new Set();

    const results = data?.data?.[0]?.results || [];
    for (const r of results) {
      if (links.length >= maxLinks) break;
      const href = r?.attributes?.href;
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;

      try {
        const resolved = new URL(href, url);
        const normHost = resolved.hostname.replace(/^www\./, '');
        if (normHost !== hostname.replace(/^www\./, '')) continue;

        const norm = `${resolved.protocol}//${resolved.hostname}${resolved.pathname.replace(/\/+$/, '') || '/'}`;
        if (seen.has(norm)) continue;
        seen.add(norm);
        links.push({ url: norm, lastmod: null, priority: null });
      } catch {}
    }

    if (links.length > 0) console.log(`[browserless] Found ${links.length} internal links on ${url}`);
    return links;
  } catch (e) {
    console.log(`[browserless] Link extraction failed for ${url}: ${e.message.slice(0, 40)}`);
    return [];
  }
}

module.exports = { fetchRenderedHtml, extractLinksWithBrowser };
