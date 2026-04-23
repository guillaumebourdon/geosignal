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
];

const SEMANTIC_KEYWORDS = [
  'guide', 'comparatif', 'comparison', 'avis', 'review', 'best', 'meilleur', 'top',
  'pricing', 'tarif', 'prix', 'about', 'propos', 'contact',
  'categorie', 'category', 'produit', 'product',
  '2026', '2025', 'service', 'solution', 'faq',
];

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    // Remove trailing slash except for root
    let path = u.pathname.replace(/\/+$/, '') || '/';
    return `${u.protocol}//${u.hostname}${path}`;
  } catch {
    return url;
  }
}

function getRootHostname(rootUrl) {
  try { return new URL(rootUrl).hostname; } catch { return ''; }
}

function isExcluded(url) {
  return EXCLUDE_PATTERNS.some(p => p.test(url));
}

function parseSitemapUrls(xml) {
  const entries = [];
  const locRegex = /<loc>\s*(.*?)\s*<\/loc>/gi;
  const chunks = xml.split(/<url>/i).slice(1);

  if (chunks.length === 0) {
    // Might be a sitemap index — extract <loc> directly
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
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'DetekiaBot/1.0 (+https://detekia.fr)' },
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

  // No sitemap found → return homepage only
  if (!xml) {
    return [{ url: normalizeUrl(rootUrl), score: 100, reasons: { fallback: 'no-sitemap' } }];
  }

  // Handle sitemap index
  if (isSitemapIndex(xml)) {
    const subSitemapUrls = extractSitemapIndexLocs(xml);
    const fetches = subSitemapUrls.slice(0, 10).map(u => fetchWithTimeout(u, timeoutMs));
    const results = await Promise.all(fetches);
    for (const subXml of results) {
      if (subXml) allEntries.push(...parseSitemapUrls(subXml));
    }
  } else {
    allEntries = parseSitemapUrls(xml);
  }

  // C) Normalize + filter
  const seen = new Set();
  const filtered = [];
  for (const entry of allEntries) {
    if (filtered.length >= 500) break;
    const norm = normalizeUrl(entry.url);
    try {
      if (new URL(norm).hostname !== hostname) continue;
    } catch { continue; }
    if (seen.has(norm)) continue;
    if (isExcluded(norm)) continue;
    seen.add(norm);
    filtered.push({ ...entry, url: norm });
  }

  // D) Score each URL
  const scored = filtered.map(entry => {
    const freshness = scoreFreshness(entry.lastmod);
    const depth = scoreDepth(entry.url);
    const semantic = scoreSemantic(entry.url);
    const priority = scorePriority(entry.priority);
    return {
      url: entry.url,
      score: freshness + depth + semantic + priority,
      reasons: { freshness, depth, semantic, priority },
    };
  });

  // E) Sort descending
  scored.sort((a, b) => b.score - a.score);

  // F) Take top N
  const top = scored.slice(0, maxUrls);

  // G) Ensure homepage is in position 0
  const homepageNorm = normalizeUrl(rootUrl);
  const homepageIdx = top.findIndex(u => u.url === homepageNorm);
  if (homepageIdx > 0) {
    const [hp] = top.splice(homepageIdx, 1);
    hp.score = 100;
    hp.reasons = { ...hp.reasons, forced: 'homepage' };
    top.unshift(hp);
  } else if (homepageIdx === -1) {
    top.unshift({ url: homepageNorm, score: 100, reasons: { freshness: 0, depth: 25, semantic: 0, priority: 0, forced: 'homepage' } });
    if (top.length > maxUrls) top.pop();
  } else {
    top[0].score = 100;
    top[0].reasons = { ...top[0].reasons, forced: 'homepage' };
  }

  return top;
}

module.exports = { getTopPrioritizedUrls };
