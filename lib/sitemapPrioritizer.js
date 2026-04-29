/**
 * Sitemap parser + URL prioritizer for Detekia Pro (multi-page audit).
 * Fetches sitemap(s), scores URLs, returns top N most valuable pages.
 * Fallback chain: sitemap → robots.txt → HTML crawler → Jina → Browserless
 */
const { extractLinksWithBrowser } = require('./browserless');

const EXCLUDE_PATTERNS = [
  /\/wp-admin/i, /\/wp-content/i, /\/wp-includes/i,
  /\/feed\b/i, /\/rss\b/i, /\/atom\b/i,
  /\/tag\//i, /\/author\//i, /\/page\//i, /[?&]page=/i, /[?&]p=/i,
  /\/cart\b/i, /\/checkout\b/i, /\/account\b/i, /\/login\b/i, /\/register\b/i, /\/wp-login/i,
  /\/search\b/i, /[?&]s=/i,
  /\/legal\b/i, /\/mentions-legales/i, /\/cgv\b/i, /\/cgu\b/i, /\/privacy\b/i, /\/politique-confidentialite/i, /\/cookies\b/i,
  /\.(pdf|jpg|jpeg|png|gif|zip|mp4|svg|webp|xml|json|txt)$/i,
  // Transactional pages (FR/ES/DE/IT/PT)
  /\/panier(?:\/|$)/i, /\/mon-compte(?:\/|$)/i, /\/commander(?:\/|$)/i, /\/commande(?:\/|$)/i,
  /\/paiement(?:\/|$)/i, /\/inscription(?:\/|$)/i, /\/connexion(?:\/|$)/i, /\/deconnexion(?:\/|$)/i,
  /\/mot-de-passe(?:\/|$)/i, /\/mi-cuenta(?:\/|$)/i, /\/carrito(?:\/|$)/i, /\/pago(?:\/|$)/i,
  /\/anmeldung(?:\/|$)/i, /\/warenkorb(?:\/|$)/i, /\/carrello(?:\/|$)/i, /\/carrinho(?:\/|$)/i,
  // Legal / CGV (FR)
  /\/conditions-generales(?:\/|$)/i, /\/conditions-utilisation(?:\/|$)/i, /\/politique(?:-|\/)/i,
  /\/confidentialite(?:\/|$)/i, /\/donnees-personnelles(?:\/|$)/i, /\/rgpd(?:\/|$)/i,
  /\/plan-du-site(?:\/|$)/i, /\/sitemap(?:\/|$)/i, /\/nous-contacter-formulaire(?:\/|$)/i,
  // WooCommerce
  /\/my-account(?:\/|$)/i, /\/order-received(?:\/|$)/i, /\/lost-password(?:\/|$)/i, /\/wc-auth(?:\/|$)/i,
  // User dashboard / authenticated pages
  /\/dashboard(?:\/|$)/i, /\/profile(?:\/|$)/i, /\/settings(?:\/|$)/i, /\/orders(?:\/|$)/i,
  /\/favorites(?:\/|$)/i, /\/wishlist(?:\/|$)/i, /\/notifications(?:\/|$)/i,
];

const LOCALE_PATTERNS = [
  /^\/en(?:\/|$)/i, /^\/fr(?:\/|$)/i, /^\/es(?:\/|$)/i, /^\/de(?:\/|$)/i,
  /^\/it(?:\/|$)/i, /^\/pt(?:\/|$)/i, /^\/nl(?:\/|$)/i, /^\/ja(?:\/|$)/i,
  /^\/zh(?:\/|$)/i, /^\/ru(?:\/|$)/i, /^\/ar(?:\/|$)/i, /^\/ko(?:\/|$)/i,
];

const SEMANTIC_KEYWORDS = [
  'guide', 'comparatif', 'comparison', 'avis', 'review', 'best', 'meilleur', 'top',
  'pricing', 'tarif', 'prix', 'about', 'propos', 'contact',
  'categorie', 'category', 'produit', 'product',
  '2026', '2025', 'service', 'solution', 'faq',
];

const STRATEGIC_SLUGS = new Set([
  'pricing', 'tarif', 'tarifs', 'prix',
  'features', 'fonctionnalites', 'fonctionnalités',
  'solutions', 'solution',
  'product', 'products', 'produit', 'produits',
  'service', 'services',
  'enterprise', 'entreprise', 'business',
  'docs', 'documentation',
  'templates', 'modeles', 'modèles',
  'api', 'platform', 'plateforme',
  'pro', 'premium',
  'methodology', 'methodologie', 'méthodologie',
  'about', 'a-propos', 'propos',
  'contact',
]);

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    let path = u.pathname.replace(/\/+$/, '') || '/';
    return `${u.protocol}//${u.hostname}${path}`;
  } catch {
    return url;
  }
}

function getRootHostname(rootUrl) {
  try { return new URL(rootUrl).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function hostnameMatches(urlHostname, rootHostname) {
  const norm = urlHostname.replace(/^www\./, '');
  // Exact match (most common)
  if (norm === rootHostname) return true;
  // Subdomain match: fr.saint-james.com matches saint-james.com
  if (norm.endsWith('.' + rootHostname)) return true;
  // Reverse: saint-james.com matches fr.saint-james.com
  if (rootHostname.endsWith('.' + norm)) return true;
  // Same brand, different TLD: armorlux.fr matches armorlux.com
  const normBase = norm.split('.').slice(0, -1).join('.');
  const rootBase = rootHostname.split('.').slice(0, -1).join('.');
  if (normBase && rootBase && normBase === rootBase) return true;
  return false;
}

function isExcluded(url) {
  return EXCLUDE_PATTERNS.some(p => p.test(url));
}

function detectLocale(pathname) {
  for (const p of LOCALE_PATTERNS) {
    if (p.test(pathname)) return pathname.match(p)[0].replace(/\//g, '').toLowerCase();
  }
  return 'default';
}

function getUrlPrefix(url) {
  try {
    const segments = new URL(url).pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
    return segments.length > 0 ? segments[0].toLowerCase() : '__root__';
  } catch {
    return '__unknown__';
  }
}

function parseSitemapUrls(xml) {
  const entries = [];
  const locRegex = /<loc>\s*(.*?)\s*<\/loc>/gi;
  const chunks = xml.split(/<url>/i).slice(1);

  if (chunks.length === 0) {
    let m;
    while ((m = locRegex.exec(xml)) !== null) {
      entries.push({ url: m[1].trim() });
    }
    return entries;
  }

  for (const chunk of chunks) {
    const locMatch = chunk.match(/<loc>\s*(.*?)\s*<\/loc>/i);
    if (!locMatch) continue;
    const url = locMatch[1].trim();
    const lastmodMatch = chunk.match(/<lastmod>\s*(.*?)\s*<\/lastmod>/i);
    const priorityMatch = chunk.match(/<priority>\s*(.*?)\s*<\/priority>/i);
    entries.push({
      url,
      lastmod: lastmodMatch ? lastmodMatch[1].trim() : null,
      priority: priorityMatch ? parseFloat(priorityMatch[1]) : null,
    });
  }
  return entries;
}

function isSitemapIndex(xml) {
  return /<sitemapindex/i.test(xml);
}

function extractSitemapIndexLocs(xml) {
  const locs = [];
  const regex = /<sitemap>[\s\S]*?<loc>\s*(.*?)\s*<\/loc>[\s\S]*?<\/sitemap>/gi;
  let m;
  while ((m = regex.exec(xml)) !== null) locs.push(m[1].trim());
  return locs;
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  // Use browser-like UA to bypass basic bot detection (DataDome, Cloudflare)
  const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xml,application/xhtml+xml,*/*' },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

function scoreFreshness(lastmod) {
  if (!lastmod) return 0;
  const d = new Date(lastmod);
  if (isNaN(d.getTime())) return 0;
  const daysAgo = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  if (daysAgo < 30) return 30;
  if (daysAgo < 90) return 20;
  if (daysAgo < 180) return 10;
  if (daysAgo < 365) return 5;
  return 0;
}

function scoreDepth(url) {
  try {
    const segments = new URL(url).pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
    const n = segments.length;
    if (n === 0) return 25;
    if (n === 1) return 20;
    if (n === 2) return 15;
    if (n === 3) return 10;
    return 5;
  } catch {
    return 5;
  }
}

function scoreSemantic(url) {
  const lower = url.toLowerCase();
  let pts = 0;
  for (const kw of SEMANTIC_KEYWORDS) {
    if (lower.includes(kw)) pts += 5;
  }
  return Math.min(pts, 25);
}

function scorePriority(priority) {
  if (priority === null || priority === undefined || isNaN(priority)) return 10;
  return Math.round(Math.min(1, Math.max(0, priority)) * 20);
}

function scoreStrategicBonus(url) {
  try {
    const segments = new URL(url).pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
    if (segments.length === 1 && STRATEGIC_SLUGS.has(segments[0].toLowerCase())) return 15;
    return 0;
  } catch {
    return 0;
  }
}

function isProductPage(url) {
  try {
    const path = new URL(url).pathname;
    // Detect product pages: /p/ segment, UUID in path, or very deep paths with product-like slugs
    if (/\/p\//.test(path)) return true;
    if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(path)) return true;
    // Very deep product paths (4+ segments with long slugs)
    const segments = path.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
    if (segments.length >= 3 && segments[segments.length - 1].length > 40) return true;
    return false;
  } catch { return false; }
}

function selectWithDiversity(sorted, maxUrls, homepageUrl) {
  const MAX_PER_PREFIX = 5;
  const MAX_PRODUCT_PAGES = 3; // Limit product/item pages to avoid redundancy
  const prefixCounts = {};
  let productCount = 0;
  const selected = [];
  const overflow = [];

  for (const entry of sorted) {
    if (entry.url === homepageUrl) continue; // homepage handled separately
    const prefix = getUrlPrefix(entry.url);
    const isProduct = isProductPage(entry.url);
    const count = prefixCounts[prefix] || 0;

    // Skip if too many from same prefix OR too many product pages
    if (count >= MAX_PER_PREFIX || (isProduct && productCount >= MAX_PRODUCT_PAGES)) {
      overflow.push(entry);
      continue;
    }

    selected.push(entry);
    prefixCounts[prefix] = count + 1;
    if (isProduct) productCount++;
    if (selected.length >= maxUrls - 1) break; // -1 for homepage slot
  }

  // If not enough diverse URLs, backfill from overflow (non-product first)
  if (selected.length < maxUrls - 1) {
    const nonProductOverflow = overflow.filter(e => !isProductPage(e.url));
    const productOverflow = overflow.filter(e => isProductPage(e.url));
    for (const entry of [...nonProductOverflow, ...productOverflow]) {
      selected.push(entry);
      if (selected.length >= maxUrls - 1) break;
    }
  }

  return selected;
}

// ── Fallback crawler (when no sitemap is available) ─────────────────────────

async function crawlFallback(rootUrl, { maxDepth = 2, maxUrls = 50, timeoutMs = 15000 } = {}) {
  const hostname = getRootHostname(rootUrl);
  const rootLocale = detectLocale(new URL(rootUrl).pathname);
  const seen = new Set();
  const allEntries = [];

  function extractLinks(html, baseUrl) {
    const links = [];
    const regex = /<a[^>]+href=["']([^"']+)["']/gi;
    let m;
    while ((m = regex.exec(html)) !== null) {
      const href = m[1].trim();
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
      try {
        const resolved = new URL(href, baseUrl);
        if (!hostnameMatches(resolved.hostname, hostname)) continue;
        const norm = normalizeUrl(resolved.href);
        if (seen.has(norm)) continue;
        if (isExcluded(norm)) continue;
        const entryLocale = detectLocale(resolved.pathname);
        if (entryLocale !== rootLocale) continue;
        seen.add(norm);
        links.push(norm);
      } catch { /* skip invalid URLs */ }
    }
    return links;
  }

  // Level 0: fetch homepage
  const homepageHtml = await fetchWithTimeout(rootUrl, 8000);
  if (!homepageHtml) return [];

  const homepageNorm = normalizeUrl(rootUrl);
  seen.add(homepageNorm);

  // Level 1: extract links from homepage
  const level1Links = extractLinks(homepageHtml, rootUrl);
  console.log(`[sitemapPrioritizer] Crawler fallback: ${level1Links.length} URLs found on homepage`);

  for (const url of level1Links) {
    if (allEntries.length >= maxUrls) break;
    allEntries.push({ url, lastmod: null, priority: null });
  }

  if (maxDepth < 2 || allEntries.length >= maxUrls) return allEntries;

  // Level 2: crawl up to 20 level-1 pages in parallel
  const level2Targets = level1Links.slice(0, 20);
  const level2Results = await Promise.allSettled(
    level2Targets.map(url => fetchWithTimeout(url, 5000))
  );

  let level2Count = 0;
  for (let i = 0; i < level2Results.length; i++) {
    if (allEntries.length >= maxUrls) break;
    const result = level2Results[i];
    if (result.status !== 'fulfilled' || !result.value) continue;
    const newLinks = extractLinks(result.value, level2Targets[i]);
    for (const url of newLinks) {
      if (allEntries.length >= maxUrls) break;
      allEntries.push({ url, lastmod: null, priority: null });
      level2Count++;
    }
  }

  console.log(`[sitemapPrioritizer] Crawler fallback: ${level2Count} additional URLs from level 2`);

  // For Jina/Browserless fallbacks: accept any locale when root is 'default'
  // (same logic as sitemap locale detection but we don't have enough entries to detect dominant)
  const acceptAnyLocale = rootLocale === 'default';

  // Level 3: if HTML crawler found very few links (JS-heavy site), try Jina
  // Jina renders JavaScript and returns markdown with real links
  if (allEntries.length < 5) {
    try {
      const jinaHeaders = { Accept: 'text/html' };
      if (process.env.JINA_API_KEY) jinaHeaders.Authorization = `Bearer ${process.env.JINA_API_KEY}`;
      const jinaRes = await fetch(`https://r.jina.ai/${rootUrl}`, {
        headers: jinaHeaders,
        signal: AbortSignal.timeout(20000),
      });
      if (jinaRes.ok) {
        const jinaContent = await jinaRes.text();
        const urlRegex = /https?:\/\/[^\s\)\]\"'<>]+/g;
        const jinaLinks = (jinaContent.match(urlRegex) || []);
        let jinaCount = 0;
        for (const href of jinaLinks) {
          if (allEntries.length >= maxUrls) break;
          try {
            const resolved = new URL(href);
            if (!hostnameMatches(resolved.hostname, hostname)) continue;
            const norm = normalizeUrl(resolved.href);
            if (seen.has(norm) || isExcluded(norm)) continue;
            // Skip image/asset/CDN URLs (long random paths, base64, extensions)
            const path = resolved.pathname;
            if (/\.(png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ico|mp4|pdf)(\?|$)/i.test(path)) continue;
            if (path.length > 100) continue; // Skip CDN/image hashes
            if (/[A-Za-z0-9_-]{30,}/.test(path.split('/').pop())) continue; // Skip hash-like slugs
            const entryLocale = detectLocale(resolved.pathname);
            if (!acceptAnyLocale && entryLocale !== rootLocale && entryLocale !== 'default') continue;
            seen.add(norm);
            allEntries.push({ url: norm, lastmod: null, priority: null });
            jinaCount++;
          } catch {}
        }
        if (jinaCount > 0) console.log(`[sitemapPrioritizer] Jina link discovery: ${jinaCount} additional URLs from JS-rendered page`);
        else console.log(`[sitemapPrioritizer] Jina link discovery: 0 usable links found (${jinaLinks.length} total URLs)`);
      }
    } catch (e) {
      console.log(`[sitemapPrioritizer] Jina link discovery failed: ${e.message.slice(0, 40)}`);
    }
  }

  // Level 4: Browserless headless Chrome (last resort for JS-heavy SPAs)
  if (allEntries.length < 5) {
    try {
      const browserLinks = await extractLinksWithBrowser(rootUrl, hostname, { maxLinks: 50 });
      if (browserLinks.length > 0) {
        for (const entry of browserLinks) {
          if (allEntries.length >= maxUrls) break;
          const norm = normalizeUrl(entry.url);
          if (seen.has(norm) || isExcluded(norm)) continue;
          const entryLocale = detectLocale(new URL(norm).pathname);
          if (!acceptAnyLocale && entryLocale !== rootLocale && entryLocale !== 'default') continue;
          seen.add(norm);
          allEntries.push(entry);
        }
        console.log(`[sitemapPrioritizer] Browserless fallback: ${allEntries.length} total URLs after headless Chrome`);
      }
    } catch {}
  }

  return allEntries;
}

/**
 * Main entry point.
 * @param {string} rootUrl - The website root URL (e.g. "https://example.com")
 * @param {object} options
 * @param {number} options.maxUrls - Max URLs to return (default 20)
 * @param {number} options.timeoutMs - Global timeout per fetch (default 10000)
 * @returns {Promise<Array<{url: string, score: number, reasons: object}>>}
 */
async function getTopPrioritizedUrls(rootUrl, { maxUrls = 20, timeoutMs = 10000 } = {}) {
  const hostname = getRootHostname(rootUrl);
  if (!hostname) return [{ url: rootUrl, score: 100, reasons: { fallback: 'invalid-root-url' } }];

  let origin = new URL(rootUrl).origin;

  // Handle www/non-www: if the origin fails, try the alternate
  const testFetch = await fetchWithTimeout(`${origin}/robots.txt`, 5000);
  if (!testFetch) {
    const parsedUrl = new URL(rootUrl);
    const altHost = parsedUrl.hostname.startsWith('www.') ? parsedUrl.hostname.slice(4) : `www.${parsedUrl.hostname}`;
    const altOrigin = `${parsedUrl.protocol}//${altHost}`;
    const altTest = await fetchWithTimeout(`${altOrigin}/robots.txt`, 5000);
    if (altTest) {
      console.log(`[sitemapPrioritizer] ${origin} unreachable, switching to ${altOrigin}`);
      origin = altOrigin;
      rootUrl = `${altOrigin}${parsedUrl.pathname}`;
    }
  }

  const rootPathname = new URL(rootUrl).pathname;
  const rootLocale = detectLocale(rootPathname);
  let allEntries = [];

  // Validate that a fetch result is actually XML (not an HTML error page)
  function isValidXml(content) {
    return content && (content.trim().startsWith('<?xml') || content.includes('<urlset') || content.includes('<sitemapindex'));
  }

  // A) Try /sitemap.xml
  let rawXml = await fetchWithTimeout(`${origin}/sitemap.xml`, timeoutMs);
  let xml = isValidXml(rawXml) ? rawXml : null;

  // B) Try /sitemap_index.xml
  if (!xml) {
    rawXml = await fetchWithTimeout(`${origin}/sitemap_index.xml`, timeoutMs);
    xml = isValidXml(rawXml) ? rawXml : null;
  }

  // B2) Try /sitemap (no .xml extension — used by wise.com, etc.)
  if (!xml) {
    rawXml = await fetchWithTimeout(`${origin}/sitemap`, timeoutMs);
    xml = isValidXml(rawXml) ? rawXml : null;
  }

  // C) Try robots.txt → all Sitemap: directives
  if (!xml) {
    const robotsTxt = await fetchWithTimeout(`${origin}/robots.txt`, timeoutMs);
    if (robotsTxt) {
      const sitemapUrls = [];
      const sitemapRegex = /Sitemap:\s*(\S+)/gi;
      let rm;
      while ((rm = sitemapRegex.exec(robotsTxt)) !== null) sitemapUrls.push(rm[1].trim());
      // Try each (skip .gz — can't decompress), take the first valid XML
      for (const smUrl of sitemapUrls.filter(u => !u.endsWith('.gz'))) {
        const result = await fetchWithTimeout(smUrl, timeoutMs);
        if (isValidXml(result)) { xml = result; break; }
      }
    }
  }

  // No sitemap found → try crawler fallback
  if (!xml) {
    console.log(`[sitemapPrioritizer] No sitemap found for ${origin}, falling back to crawler`);
    const crawled = await crawlFallback(rootUrl);
    if (crawled.length === 0) {
      return [{ url: normalizeUrl(rootUrl), score: 100, reasons: { fallback: 'crawl-blocked' } }];
    }
    allEntries = crawled;
  }

  // Handle sitemap index (skip if we already have entries from crawler)
  // Supports 2 levels of nesting (index → sub-index → urls)
  if (xml && isSitemapIndex(xml)) {
    const subSitemapUrls = extractSitemapIndexLocs(xml);
    const fetches = subSitemapUrls.slice(0, 10).map(u => fetchWithTimeout(u, timeoutMs));
    const results = await Promise.all(fetches);
    for (const subXml of results) {
      if (!subXml) continue;
      if (isSitemapIndex(subXml)) {
        // Nested index (e.g. wise.com) — go one level deeper
        const nestedUrls = extractSitemapIndexLocs(subXml).slice(0, 3);
        const nestedResults = await Promise.all(nestedUrls.map(u => fetchWithTimeout(u, timeoutMs)));
        for (const nestedXml of nestedResults) {
          if (nestedXml && !isSitemapIndex(nestedXml)) for (const entry of parseSitemapUrls(nestedXml)) allEntries.push(entry);
        }
      } else {
        for (const entry of parseSitemapUrls(subXml)) allEntries.push(entry);
      }
    }
  } else if (xml) {
    allEntries = parseSitemapUrls(xml);
  }

  // If sitemap yielded too few entries, supplement with crawler
  if (allEntries.length < 10) {
    console.log(`[sitemapPrioritizer] Only ${allEntries.length} entries from sitemap, supplementing with crawler`);
    const crawled = await crawlFallback(rootUrl);
    if (crawled.length > 0) {
      // Merge: add crawled entries that aren't already in allEntries
      const existingUrls = new Set(allEntries.map(e => normalizeUrl(e.url)));
      for (const entry of crawled) {
        const norm = normalizeUrl(entry.url);
        if (!existingUrls.has(norm)) { allEntries.push(entry); existingUrls.add(norm); }
      }
    }
  }

  // Normalize + filter (exclude patterns + hostname + dedup)
  const seen = new Set();
  const filtered = [];
  for (const entry of allEntries) {
    if (filtered.length >= 500) break;
    const norm = normalizeUrl(entry.url);
    try {
      if (!hostnameMatches(new URL(norm).hostname, hostname)) continue;
    } catch { continue; }
    if (seen.has(norm)) continue;
    if (isExcluded(norm)) continue;
    seen.add(norm);
    filtered.push({ ...entry, url: norm });
  }

  // Filter by locale (CORRECTION 1)
  // If rootUrl has no locale prefix (e.g. "/" → 'default'), detect the dominant locale
  // in the sitemap and accept both 'default' and the dominant locale
  let targetLocale = rootLocale;
  if (rootLocale === 'default') {
    const localeCounts = {};
    filtered.forEach(entry => {
      try {
        const loc = detectLocale(new URL(entry.url).pathname);
        localeCounts[loc] = (localeCounts[loc] || 0) + 1;
      } catch {}
    });
    // Find most common non-default locale
    const sorted = Object.entries(localeCounts).filter(([k]) => k !== 'default').sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0 && sorted[0][1] > (localeCounts['default'] || 0)) {
      targetLocale = sorted[0][0];
      console.log(`[sitemapPrioritizer] Root has no locale prefix. Dominant locale in sitemap: /${targetLocale}/ (${sorted[0][1]} URLs)`);
    }
  }

  const localeFiltered = filtered.filter(entry => {
    try {
      const entryLocale = detectLocale(new URL(entry.url).pathname);
      return entryLocale === targetLocale || entryLocale === 'default';
    } catch { return false; }
  });

  // Score each URL
  const source = xml ? 'sitemap' : 'crawler';
  const scored = localeFiltered.map(entry => {
    const freshness = scoreFreshness(entry.lastmod);
    const depth = scoreDepth(entry.url);
    const semantic = scoreSemantic(entry.url);
    const priority = scorePriority(entry.priority);
    const strategicBonus = scoreStrategicBonus(entry.url);
    return {
      url: entry.url,
      score: freshness + depth + semantic + priority + strategicBonus,
      reasons: { freshness, depth, semantic, priority, strategicBonus, source },
    };
  });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  // Select with prefix diversity (CORRECTION 3)
  const homepageNorm = normalizeUrl(rootUrl);
  let diverseSelection = selectWithDiversity(scored, maxUrls, homepageNorm);

  // If selection is dominated by product pages (>60%), supplement with crawler
  // to find strategic pages (About, FAQ, categories) not in the sitemap
  const productRatio = diverseSelection.filter(e => isProductPage(e.url)).length / Math.max(diverseSelection.length, 1);
  if (productRatio > 0.6 && diverseSelection.length >= 5) {
    console.log(`[sitemapPrioritizer] ${Math.round(productRatio * 100)}% product pages. Crawling for strategic pages...`);
    try {
      const crawled = await crawlFallback(rootUrl, { maxDepth: 1, maxUrls: 30, timeoutMs: 8000 });
      const crawledStrategic = crawled
        .filter(e => !isProductPage(e.url) && !isExcluded(e.url) && !scored.some(s => s.url === e.url))
        .map(e => ({ url: e.url, score: scoreDepth(e.url) + scoreSemantic(e.url) + scoreStrategicBonus(e.url) + 10, reasons: { source: 'crawler-supplement' } }))
        .sort((a, b) => b.score - a.score);
      if (crawledStrategic.length > 0) {
        const keepProducts = diverseSelection.filter(e => isProductPage(e.url)).slice(0, 3);
        const keepOther = diverseSelection.filter(e => !isProductPage(e.url));
        const slots = maxUrls - 1 - keepOther.length - keepProducts.length;
        diverseSelection = [...keepOther, ...crawledStrategic.slice(0, slots), ...keepProducts].slice(0, maxUrls - 1);
        console.log(`[sitemapPrioritizer] Added ${Math.min(crawledStrategic.length, slots)} strategic pages. Products limited to ${keepProducts.length}.`);
      }
    } catch (e) { console.error('[sitemapPrioritizer] Crawler supplement failed:', e.message); }
  }

  // Build final list with homepage forced at position 0
  const homepageEntry = scored.find(u => u.url === homepageNorm);
  const homepage = homepageEntry
    ? { ...homepageEntry, score: 100, reasons: { ...homepageEntry.reasons, forced: 'homepage' } }
    : { url: homepageNorm, score: 100, reasons: { freshness: 0, depth: 25, semantic: 0, priority: 0, strategicBonus: 0, forced: 'homepage' } };

  const top = [homepage, ...diverseSelection].slice(0, maxUrls);
  return top;
}

module.exports = { getTopPrioritizedUrls };
