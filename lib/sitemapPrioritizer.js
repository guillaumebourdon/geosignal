/**
 * Sitemap parser + URL prioritizer for Detekia Pro (multi-page audit).
 * Fetches sitemap(s), scores URLs, returns top N most valuable pages.
 */

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
  return norm === rootHostname;
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

function selectWithDiversity(sorted, maxUrls, homepageUrl) {
  const MAX_PER_PREFIX = 10;
  const prefixCounts = {};
  const selected = [];
  const overflow = [];

  for (const entry of sorted) {
    if (entry.url === homepageUrl) continue; // homepage handled separately
    const prefix = getUrlPrefix(entry.url);
    const count = prefixCounts[prefix] || 0;
    if (count < MAX_PER_PREFIX) {
      selected.push(entry);
      prefixCounts[prefix] = count + 1;
    } else {
      overflow.push(entry);
    }
    if (selected.length >= maxUrls - 1) break; // -1 for homepage slot
  }

  // If not enough diverse URLs, backfill from overflow
  if (selected.length < maxUrls - 1) {
    for (const entry of overflow) {
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

  const origin = new URL(rootUrl).origin;
  const rootPathname = new URL(rootUrl).pathname;
  const rootLocale = detectLocale(rootPathname);
  let allEntries = [];

  // A) Try /sitemap.xml
  let xml = await fetchWithTimeout(`${origin}/sitemap.xml`, timeoutMs);

  // B) Try /sitemap_index.xml
  if (!xml) xml = await fetchWithTimeout(`${origin}/sitemap_index.xml`, timeoutMs);

  // C) Try robots.txt → Sitemap:
  if (!xml) {
    const robotsTxt = await fetchWithTimeout(`${origin}/robots.txt`, timeoutMs);
    if (robotsTxt) {
      const sitemapMatch = robotsTxt.match(/Sitemap:\s*(\S+)/i);
      if (sitemapMatch) xml = await fetchWithTimeout(sitemapMatch[1].trim(), timeoutMs);
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
  if (xml && isSitemapIndex(xml)) {
    const subSitemapUrls = extractSitemapIndexLocs(xml);
    const fetches = subSitemapUrls.slice(0, 10).map(u => fetchWithTimeout(u, timeoutMs));
    const results = await Promise.all(fetches);
    for (const subXml of results) {
      if (subXml) allEntries.push(...parseSitemapUrls(subXml));
    }
  } else if (xml) {
    allEntries = parseSitemapUrls(xml);
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
  const localeFiltered = filtered.filter(entry => {
    try {
      const entryLocale = detectLocale(new URL(entry.url).pathname);
      return entryLocale === rootLocale;
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
  const diverseSelection = selectWithDiversity(scored, maxUrls, homepageNorm);

  // Build final list with homepage forced at position 0
  const homepageEntry = scored.find(u => u.url === homepageNorm);
  const homepage = homepageEntry
    ? { ...homepageEntry, score: 100, reasons: { ...homepageEntry.reasons, forced: 'homepage' } }
    : { url: homepageNorm, score: 100, reasons: { freshness: 0, depth: 25, semantic: 0, priority: 0, strategicBonus: 0, forced: 'homepage' } };

  const top = [homepage, ...diverseSelection].slice(0, maxUrls);
  return top;
}

module.exports = { getTopPrioritizedUrls };
