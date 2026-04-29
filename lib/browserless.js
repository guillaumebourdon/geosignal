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
 * Uses /content endpoint (returns full HTML) + cheerio parsing.
 * Returns array of { url, lastmod: null, priority: null } entries.
 */
async function extractLinksWithBrowser(url, hostname, { maxLinks = 50, timeout = 15000 } = {}) {
  if (!BROWSERLESS_TOKEN) return [];

  try {
    const html = await fetchRenderedHtml(url, { timeout });
    if (!html) return [];

    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    const links = [];
    const seen = new Set();
    const normHost = hostname.replace(/^www\./, '');

    $('a[href]').each((_, el) => {
      if (links.length >= maxLinks) return false;
      const href = ($(el).attr('href') || '').trim();
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

      try {
        const resolved = new URL(href, url);
        if (resolved.hostname.replace(/^www\./, '') !== normHost) return;
        const norm = `${resolved.protocol}//${resolved.hostname}${resolved.pathname.replace(/\/+$/, '') || '/'}`;
        if (seen.has(norm)) return;
        seen.add(norm);
        links.push({ url: norm, lastmod: null, priority: null });
      } catch {}
    });

    if (links.length > 0) console.log(`[browserless] Found ${links.length} internal links on ${url}`);
    return links;
  } catch (e) {
    console.log(`[browserless] Link extraction failed for ${url}: ${e.message.slice(0, 40)}`);
    return [];
  }
}

module.exports = { fetchRenderedHtml, extractLinksWithBrowser };
