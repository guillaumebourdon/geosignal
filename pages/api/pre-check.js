/**
 * Pre-audit checkability verification.
 * Checks if a site is auditable before allowing Stripe checkout.
 * Returns { onePageAuditable, proAuditable, reason, pagesFound }
 */
import { Redis } from '@upstash/redis';

export const config = { maxDuration: 30 };

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

  // 4. Check Pro auditability: find pages + validate quality + test scrapability
  let pagesFound = 1;
  let proAuditable = false;
  let proBlockReason = 'insufficient_pages';
  try {
    const { getTopPrioritizedUrls } = require('../../lib/sitemapPrioritizer');
    const pages = await getTopPrioritizedUrls(url, { maxUrls: 10, timeoutMs: 8000 });

    // Validate: pages must be on the SAME hostname (no subdomain blog pages)
    const sameHostPages = pages.filter(p => {
      try { return new URL(p.url).hostname.replace(/^www\./, '') === hostname; } catch { return false; }
    });

    // Validate: pages must be unique paths (not duplicates with different query strings)
    const uniquePaths = new Set(sameHostPages.map(p => {
      try { return new URL(p.url).pathname.replace(/\/+$/, '') || '/'; } catch { return p.url; }
    }));

    pagesFound = Math.min(sameHostPages.length, uniquePaths.size);
    console.log(`[pre-check] ${hostname} — pages: ${pages.length} total, ${sameHostPages.length} same-host, ${uniquePaths.size} unique paths`);

    if (pagesFound >= 10) {
      // Spot-check: test 2 random internal pages (not homepage) for scrapability
      const internalPages = sameHostPages.filter(p => {
        try { return new URL(p.url).pathname !== '/'; } catch { return false; }
      });
      const samplesToTest = internalPages.sort(() => Math.random() - 0.5).slice(0, 2);

      let scrapableCount = 0;
      for (const sample of samplesToTest) {
        const check = await fetchCheck(sample.url, 6000);
        const isBlocked = !check.ok || check.status === 403 || check.status === 429 || detectAntiBot(check.body || '');
        const hasContent = hasSubstantialContent(check.body || '');
        if (!isBlocked && hasContent) {
          scrapableCount++;
        } else {
          console.log(`[pre-check] ${hostname} — sample page NOT scrapable: ${sample.url} (status: ${check.status}, antibot: ${detectAntiBot(check.body || '')}, content: ${hasContent})`);
        }
      }

      if (samplesToTest.length === 0 || scrapableCount >= 1) {
        proAuditable = true;
        proBlockReason = 'ok';
      } else {
        proBlockReason = 'pages_not_scrapable';
        console.log(`[pre-check] ${hostname} — Pro BLOCKED: ${samplesToTest.length} sample pages tested, ${scrapableCount} scrapable`);
      }
    } else {
      proBlockReason = pagesFound < 5 ? 'insufficient_pages' : 'insufficient_unique_pages';
    }
  } catch (e) {
    console.log(`[pre-check] ${hostname} — sitemapPrioritizer error: ${e.message.slice(0, 80)}`);
    proBlockReason = 'sitemap_error';
  }

  const reason = !onePageAuditable ? 'page_not_accessible' : proBlockReason;

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
