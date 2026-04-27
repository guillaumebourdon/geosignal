/**
 * Pre-audit checkability verification.
 * Checks if a site is auditable before allowing Stripe checkout.
 * Returns { onePageAuditable, proAuditable, reason, pagesFound }
 */
import { Redis } from '@upstash/redis';

export const config = { maxDuration: 20 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CACHE_TTL = 300; // 5 minutes
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

// Anti-bot detection patterns in HTML response body
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
  // Strip tags and check if there's real text content (not just a captcha page)
  const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return textOnly.length > 200;
}

function countSitemapUrls(xml, hostname) {
  const locRegex = /<loc>\s*(.*?)\s*<\/loc>/gi;
  let count = 0;
  let m;
  while ((m = locRegex.exec(xml)) !== null) {
    try {
      const urlHost = new URL(m[1].trim()).hostname.replace(/^www\./, '');
      if (urlHost === hostname) count++;
    } catch { /* skip */ }
  }
  return count;
}

function countInternalLinks(html, hostname) {
  const linkRegex = /<a[^>]+href=["']([^"'#]+)["']/gi;
  const seen = new Set();
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    try {
      const href = m[1].trim();
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
      const resolved = new URL(href, `https://${hostname}`);
      const norm = resolved.hostname.replace(/^www\./, '');
      if (norm === hostname) {
        const path = resolved.pathname.replace(/\/+$/, '') || '/';
        seen.add(`${norm}${path}`);
      }
    } catch { /* skip */ }
  }
  return seen.size;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  // Rate limit: 10 req per 2 minutes per IP
  const { checkRateLimit } = require('../../lib/rateLimit');
  if (!(await checkRateLimit('preCheck', req, res))) return;

  const { url: rawUrl, plan } = req.body;
  if (!rawUrl) return res.status(400).json({ error: 'Missing url' });

  let url;
  try {
    url = rawUrl.startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`;
    new URL(url);
  } catch {
    return res.status(400).json({ onePageAuditable: false, proAuditable: false, reason: 'invalid_url', pagesFound: 0 });
  }

  const hostname = new URL(url).hostname.replace(/^www\./, '');

  // Check cache
  const cacheKey = `detekia:precheck:${hostname}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(cached);
  } catch { /* cache miss, continue */ }

  const origin = new URL(url).origin;

  // Run checks in parallel: homepage + sitemap
  const [pageResult, sitemapResult, sitemapIndexResult] = await Promise.all([
    fetchCheck(url, 8000),
    fetchCheck(`${origin}/sitemap.xml`, 6000),
    fetchCheck(`${origin}/sitemap_index.xml`, 6000),
  ]);

  console.log(`[pre-check] ${hostname} — page status: ${pageResult.status}, ok: ${pageResult.ok}, error: ${pageResult.error || 'none'}, body: ${pageResult.body?.length || 0} chars`);

  // 1. Check if the page is accessible at all
  if (pageResult.error === 'timeout' || pageResult.status === 0) {
    const result = { onePageAuditable: false, proAuditable: false, reason: 'site_unreachable', pagesFound: 0 };
    try { await redis.set(cacheKey, result, { ex: CACHE_TTL }); } catch {}
    logPrecheck(hostname, plan, result);
    return res.status(200).json(result);
  }

  // 2. Check for anti-bot: 403 status OR anti-bot patterns in response body (regardless of status code)
  const isAntiBot = pageResult.status === 403
    || pageResult.status === 429
    || detectAntiBot(pageResult.body || '');
  if (isAntiBot) {
    console.log(`[pre-check] ${hostname} — ANTIBOT DETECTED (status: ${pageResult.status})`);
    const result = { onePageAuditable: false, proAuditable: false, reason: 'antibot_detected', pagesFound: 0 };
    try { await redis.set(cacheKey, result, { ex: CACHE_TTL }); } catch {}
    logPrecheck(hostname, plan, result);
    return res.status(200).json(result);
  }

  // 3. Check page is actually accessible (non-200 without anti-bot = site error)
  if (!pageResult.ok) {
    console.log(`[pre-check] ${hostname} — page not OK (status: ${pageResult.status})`);
    const result = { onePageAuditable: false, proAuditable: false, reason: 'site_unreachable', pagesFound: 0 };
    try { await redis.set(cacheKey, result, { ex: CACHE_TTL }); } catch {}
    logPrecheck(hostname, plan, result);
    return res.status(200).json(result);
  }

  // 4. Check for substantial content
  if (!hasSubstantialContent(pageResult.body)) {
    const result = { onePageAuditable: false, proAuditable: false, reason: 'no_content', pagesFound: 0 };
    try { await redis.set(cacheKey, result, { ex: CACHE_TTL }); } catch {}
    logPrecheck(hostname, plan, result);
    return res.status(200).json(result);
  }

  // Page passed all checks — auditable for one-page
  const onePageAuditable = true;

  // 4. Check Pro auditability: count available pages
  let pagesFound = 1; // at least the homepage
  let sitemapXml = null;

  if (sitemapResult.ok && sitemapResult.body.includes('<loc>')) {
    sitemapXml = sitemapResult.body;
  } else if (sitemapIndexResult.ok && sitemapIndexResult.body.includes('<sitemap>')) {
    // Sitemap index: fetch first 3 sub-sitemaps to estimate page count
    const subLocs = [];
    const subRegex = /<sitemap>[\s\S]*?<loc>\s*(.*?)\s*<\/loc>[\s\S]*?<\/sitemap>/gi;
    let sm;
    while ((sm = subRegex.exec(sitemapIndexResult.body)) !== null) subLocs.push(sm[1].trim());

    const subFetches = await Promise.all(subLocs.slice(0, 3).map(u => fetchCheck(u, 5000)));
    const allXml = subFetches.filter(r => r.ok).map(r => r.body).join('');
    if (allXml) sitemapXml = allXml;
  }

  if (sitemapXml) {
    pagesFound = countSitemapUrls(sitemapXml, hostname);
  } else if (pageResult.ok) {
    // No sitemap: count internal links on homepage as fallback
    pagesFound = countInternalLinks(pageResult.body, hostname);
  }

  // 5. For Pro: verify 2 sample pages are actually scrapable (not just listed in sitemap)
  let proScrapable = true;
  if (plan === 'pro' && pagesFound >= 20 && sitemapXml) {
    const allLocs = [];
    const locRe = /<loc>\s*(.*?)\s*<\/loc>/gi;
    let m;
    while ((m = locRe.exec(sitemapXml)) !== null) allLocs.push(m[1].trim());
    // Pick 2 random pages (not the homepage)
    const sampleUrls = allLocs
      .filter(u => { try { return new URL(u).pathname !== '/'; } catch { return false; } })
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    if (sampleUrls.length > 0) {
      const sampleResults = await Promise.all(sampleUrls.map(u => fetchCheck(u, 5000)));
      const scrapableCount = sampleResults.filter(r => r.ok && !detectAntiBot(r.body || '') && hasSubstantialContent(r.body || '')).length;
      if (scrapableCount < 3) {
        proScrapable = false;
        console.log(`[pre-check] ${hostname} — Pro sample scrape FAILED: ${scrapableCount}/${sampleUrls.length} pages scrapable (need >=3)`);
      }
    }
  }

  const proAuditable = onePageAuditable && pagesFound >= 20 && proScrapable;
  const reason = !onePageAuditable ? 'page_not_accessible'
    : !proScrapable ? 'pages_not_scrapable'
    : !proAuditable ? (pagesFound < 20 ? 'insufficient_pages' : 'sitemap_inaccessible')
    : 'ok';

  const result = { onePageAuditable, proAuditable, reason, pagesFound };
  console.log(`[pre-check] ${hostname} — result: onePage=${onePageAuditable}, pro=${proAuditable}, pages=${pagesFound}, reason=${reason}`);
  try { await redis.set(cacheKey, result, { ex: CACHE_TTL }); } catch {}
  logPrecheck(hostname, plan, result);
  return res.status(200).json(result);
}

async function logPrecheck(hostname, plan, result) {
  try {
    const logKey = `detekia:precheck:log:${Date.now()}`;
    await redis.set(logKey, { hostname, plan, ...result, ts: new Date().toISOString() }, { ex: 30 * 24 * 60 * 60 }); // 30 days
  } catch { /* non-blocking */ }
}
