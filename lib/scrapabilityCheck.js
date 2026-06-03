/**
 * Shared scrapability check module.
 * Reusable functions to test whether a page is scrapable before audit.
 * Extracted from pre-check.js for use in validate-pages, suggest-pages, etc.
 */

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const ANTIBOT_PATTERNS = [
  /captcha-delivery\.com/i,          // DataDome
  /datadome/i,                        // DataDome
  /perimeterx/i,                      // PerimeterX
  /px-captcha/i,                      // PerimeterX
  /challenge-platform/i,              // Cloudflare Turnstile
  /cf-challenge/i,                    // Cloudflare challenge
  /akamai.*bot.*manager/i,            // Akamai
  /Please enable JS and disable any ad blocker/i, // DataDome generic
];

async function fetchCheck(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xml,application/xhtml+xml,*/*' },
      redirect: 'follow',
    });
    clearTimeout(timer);
    const status = res.status;
    const body = await res.text();
    return { status, body, ok: res.ok };
  } catch (e) {
    clearTimeout(timer);
    return { status: 0, body: '', ok: false, error: e.name === 'AbortError' ? 'timeout' : e.message };
  }
}

function detectAntiBot(html) {
  for (const pattern of ANTIBOT_PATTERNS) {
    if (pattern.test(html)) return true;
  }
  return false;
}

function hasSubstantialContent(html) {
  const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return textOnly.length > 200;
}

/**
 * Check if a single page is scrapable.
 * @param {string} url
 * @param {number} [timeoutMs=8000]
 * @returns {{ url: string, scrapable: boolean, reason: string }}
 */
async function checkPageScrapability(url, timeoutMs = 8000) {
  try {
    const result = await fetchCheck(url, timeoutMs);

    if (result.error === 'timeout' || result.status === 0) {
      return { url, scrapable: false, reason: 'timeout' };
    }

    if (result.status === 403 || result.status === 429 || detectAntiBot(result.body || '')) {
      return { url, scrapable: false, reason: 'antibot' };
    }

    if (!result.ok) {
      return { url, scrapable: false, reason: 'error' };
    }

    if (!hasSubstantialContent(result.body || '')) {
      return { url, scrapable: false, reason: 'no_content' };
    }

    return { url, scrapable: true, reason: 'ok' };
  } catch (e) {
    return { url, scrapable: false, reason: 'error' };
  }
}

module.exports = { fetchCheck, ANTIBOT_PATTERNS, detectAntiBot, hasSubstantialContent, checkPageScrapability };
