/**
 * Sitemap parser + URL prioritizer for Detekia Pro (multi-page audit).
 * Fetches sitemap(s), scores URLs, returns top N most valuable pages.
 * Fallback chain: sitemap → robots.txt → HTML crawler → Browserless
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
  // Additional transactional/non-content pages
  /\/myaccount(?:\/|$)/i, /\/my-account(?:\/|$)/i, /\/preview(?:\/|$)/i, /\/booking(?:\/|$)/i,
  /\/reservation(?:\/|$)/i, /\/signup(?:\/|$)/i, /\/signin(?:\/|$)/i, /\/logout(?:\/|$)/i,
  /\/unsubscribe(?:\/|$)/i, /\/callback(?:\/|$)/i, /\/oauth(?:\/|$)/i, /\/sso(?:\/|$)/i,
  /\/reset-password(?:\/|$)/i, /\/verify(?:\/|$)/i, /\/confirm(?:\/|$)/i,
  /\/app(?:\/|$)/i, /\/admin(?:\/|$)/i, /\/backoffice(?:\/|$)/i,
];

const LOCALE_PATTERNS = [
  // Compound locales first (fr-fr, en-us, be-wl, pt-pt, etc.)
  /^\/([a-z]{2}-[a-z]{2})(?:\/|$)/i,
  // Simple locales (fr, en, es, etc.)
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

function hostnameMatches(urlHostname, rootHostname, { allowSubdomains = false } = {}) {
  const norm = urlHostname.replace(/^www\./, '');
  // Exact match (most common)
  if (norm === rootHostname) return true;
  if (!allowSubdomains) return false;
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
  const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
  try {
    // Use axios for .gz files (reliable arraybuffer handling across runtimes)
    if (url.endsWith('.gz')) {
      const { gunzipSync } = require('zlib');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xml,application/xhtml+xml,*/*' },
      });
      clearTimeout(timer);
      if (!res.ok) {
        console.log(`[sitemapPrioritizer] .gz fetch ${res.status} for ${url}`);
        // Fallback 1: try without .gz extension (some servers serve uncompressed too)
        const nonGzUrl = url.replace(/\.gz$/, '');
        try {
          const nonGzRes = await fetch(nonGzUrl, { signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': UA, 'Accept': '*/*' } });
          if (nonGzRes.ok) {
            const text = await nonGzRes.text();
            if (text.includes('<urlset') || text.includes('<sitemapindex')) {
              console.log(`[sitemapPrioritizer] .gz fallback: non-.gz version worked for ${nonGzUrl.split('/').pop()}`);
              return text;
            }
          }
        } catch {}
        return null;
      }
      let buf = Buffer.from(await res.arrayBuffer());
      console.log(`[sitemapPrioritizer] .gz fetched ${url.split('/').pop()}: ${buf.length}b, hex=${buf.slice(0,2).toString('hex')}`);
      // Decompress iteratively (some servers double-gzip: transport encoding + file compression)
      for (let i = 0; i < 3; i++) {
        const text = buf.toString('utf-8');
        if (text.includes('<urlset') || text.includes('<sitemapindex') || text.includes('<?xml')) {
          console.log(`[sitemapPrioritizer] .gz decoded after ${i} decompressions, ${text.length} chars`);
          return text;
        }
        if (buf[0] === 0x1f && buf[1] === 0x8b) {
          try { buf = gunzipSync(buf); } catch (e) { console.log(`[sitemapPrioritizer] gunzip error: ${e.message}`); break; }
        } else break;
      }
      const finalText = buf.toString('utf-8');
      if (finalText.includes('<urlset') || finalText.includes('<sitemapindex')) return finalText;
      console.log(`[sitemapPrioritizer] .gz no XML found in ${url.split('/').pop()}, first 100 chars: ${finalText.slice(0,100)}`);
      return null;
    }
    // Standard text fetch for non-.gz URLs
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xml,application/xhtml+xml,*/*' },
    });
    clearTimeout(timer);
    if (res.ok) return await res.text();
    return null;
  } catch (err) {
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

// ── Page type classification ────────────────────────────────────────────────

const STRATEGIC_PATTERNS = [
  /^\/about(?:\/|$)/i, /^\/a-propos(?:\/|$)/i, /^\/qui-sommes-nous(?:\/|$)/i,
  /^\/who-we-are(?:\/|$)/i, /^\/notre-histoire(?:\/|$)/i, /^\/our-story(?:\/|$)/i,
  /^\/pricing(?:\/|$)/i, /^\/tarif(?:s)?(?:\/|$)/i, /^\/prix(?:\/|$)/i,
  /^\/faq(?:\/|$)/i, /^\/contact(?:\/|$)/i,
  /^\/team(?:\/|$)/i, /^\/equipe(?:\/|$)/i, /^\/l-equipe(?:\/|$)/i,
  /^\/methodology(?:\/|$)/i, /^\/methodologie(?:\/|$)/i,
  /^\/careers(?:\/|$)/i, /^\/carrieres(?:\/|$)/i, /^\/jobs(?:\/|$)/i,
  /^\/partners(?:\/|$)/i, /^\/partenaires(?:\/|$)/i,
  /^\/features(?:\/|$)/i, /^\/fonctionnalites(?:\/|$)/i,
  /^\/enterprise(?:\/|$)/i, /^\/entreprise(?:\/|$)/i,
  /^\/demo(?:\/|$)/i, /^\/get-started(?:\/|$)/i,
  /^\/how-it-works(?:\/|$)/i, /^\/comment-ca-marche(?:\/|$)/i,
  /^\/why(?:\/|$)/i, /^\/pourquoi(?:\/|$)/i,
  /^\/security(?:\/|$)/i, /^\/securite(?:\/|$)/i,
  /^\/trust(?:\/|$)/i, /^\/integrations(?:\/|$)/i,
];

const CONTENT_PATTERNS = [
  /\/blog(?:\/|$)/i, /\/articles?(?:\/|$)/i, /\/news(?:\/|$)/i,
  /\/resources?(?:\/|$)/i, /\/guides?(?:\/|$)/i, /\/learn(?:\/|$)/i,
  /\/academy(?:\/|$)/i, /\/insights?(?:\/|$)/i, /\/actualit[eé]s?(?:\/|$)/i,
  /\/magazine(?:\/|$)/i, /\/post(?:s)?(?:\/|$)/i, /\/stories(?:\/|$)/i,
  /\/case-stud(?:y|ies)(?:\/|$)/i, /\/etudes?-de-cas(?:\/|$)/i,
  /\/webinars?(?:\/|$)/i, /\/tutorials?(?:\/|$)/i, /\/tutoriels?(?:\/|$)/i,
];

const CATEGORY_PATTERNS = [
  /^\/categor(?:y|ies|ie|ias?)(?:\/|$)/i,
  /^\/collections?(?:\/|$)/i,
  /^\/products(?:\/|$)/i, /^\/produits(?:\/|$)/i,
  /^\/services(?:\/|$)/i,
  /^\/solutions(?:\/|$)/i,
  /^\/all-/i, /^\/nos-/i, /^\/our-/i,
  /^\/shop(?:\/|$)/i, /^\/boutique(?:\/|$)/i,
  /^\/catalog(?:ue)?(?:\/|$)/i,
];

function classifyPageType(url, homepageUrl) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    const norm = normalizeUrl(url);

    // Homepage
    if (norm === normalizeUrl(homepageUrl) || path === '/' || path === '') return 'homepage';

    // Strip locale prefix for matching (e.g., /fr/about -> /about)
    let matchPath = path;
    for (const lp of LOCALE_PATTERNS) {
      const m = path.match(lp);
      if (m) { matchPath = path.slice(m[0].replace(/\/$/, '').length) || '/'; break; }
    }

    // Strategic pages
    if (STRATEGIC_PATTERNS.some(p => p.test(matchPath))) return 'strategic';

    // Content pages (blog, articles, etc.)
    if (CONTENT_PATTERNS.some(p => p.test(matchPath))) return 'content';

    // Category/listing pages
    if (CATEGORY_PATTERNS.some(p => p.test(matchPath))) return 'category';

    // Product pages: depth 2+ single-item pages not caught above
    const segments = matchPath.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
    if (segments.length >= 2 && !isProductPage(url)) return 'product';
    if (isProductPage(url)) return 'product';

    // Depth-1 pages that didn't match strategic/content/category are "other"
    return 'other';
  } catch {
    return 'other';
  }
}

// ── Homepage link counting ──────────────────────────────────────────────────

function countHomepageLinks(html, baseUrl, hostname) {
  const counts = {};
  if (!html) return counts;
  const regex = /<a[^>]+href=["']([^"'#]+)["']/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const href = m[1].trim();
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    try {
      const resolved = new URL(href, baseUrl);
      if (!hostnameMatches(resolved.hostname, hostname)) continue;
      const norm = normalizeUrl(resolved.href);
      counts[norm] = (counts[norm] || 0) + 1;
    } catch {}
  }
  return counts;
}

// ── Slot-based page selection ───────────────────────────────────────────────

function fillSlots(entries, maxUrls, homepageUrl, homepageLinkCounts) {
  // Classify all entries
  const classified = entries.map(entry => ({
    ...entry,
    pageType: classifyPageType(entry.url, homepageUrl),
    prominence: homepageLinkCounts[entry.url] || 0,
  }));

  // Group by type (excluding homepage)
  const byType = { strategic: [], category: [], product: [], content: [], other: [] };
  for (const entry of classified) {
    if (entry.pageType === 'homepage') continue;
    if (byType[entry.pageType]) byType[entry.pageType].push(entry);
    else byType.other.push(entry);
  }

  // Sort each bucket: prominence desc, then score desc
  for (const type of Object.keys(byType)) {
    byType[type].sort((a, b) => (b.prominence - a.prominence) || (b.score - a.score));
  }
  // Content: prefer recent (lastmod) then prominence
  byType.content.sort((a, b) => {
    const aDate = a.reasons && a.reasons._lastmod ? new Date(a.reasons._lastmod).getTime() : 0;
    const bDate = b.reasons && b.reasons._lastmod ? new Date(b.reasons._lastmod).getTime() : 0;
    if (aDate && bDate && aDate !== bDate) return bDate - aDate;
    return (b.prominence - a.prominence) || (b.score - a.score);
  });

  const selected = new Set();
  const result = [];

  function pick(entry) {
    if (selected.has(entry.url)) return false;
    selected.add(entry.url);
    result.push(entry);
    return true;
  }

  function pickFromBucket(type, min, max) {
    let picked = 0;
    for (const entry of byType[type]) {
      if (picked >= max) break;
      if (selected.has(entry.url)) continue;
      pick(entry);
      picked++;
    }
    return picked;
  }

  // Slot allocation (maxUrls total, 1 reserved for homepage)
  const slotsAvailable = maxUrls - 1;

  // Define slot targets based on total available
  // For 10 pages: strategic 1-2, category 1-2, product 2-3, content 1-2, fill rest
  const slotTargets = [
    { type: 'strategic', min: 1, max: 2 },
    { type: 'category',  min: 1, max: 2 },
    { type: 'product',   min: 2, max: 3 },
    { type: 'content',   min: 1, max: 2 },
  ];

  // First pass: fill minimums
  let filled = 0;
  const slotFilled = {};
  for (const slot of slotTargets) {
    const count = pickFromBucket(slot.type, slot.min, slot.min);
    slotFilled[slot.type] = count;
    filled += count;
  }

  // Second pass: fill up to maximums if space remains
  for (const slot of slotTargets) {
    if (filled >= slotsAvailable) break;
    const remaining = slot.max - slotFilled[slot.type];
    if (remaining <= 0) continue;
    const canFill = Math.min(remaining, slotsAvailable - filled);
    const count = pickFromBucket(slot.type, 0, canFill);
    slotFilled[slot.type] = (slotFilled[slot.type] || 0) + count;
    filled += count;
  }

  // Third pass: fill remaining slots with highest-prominence pages not yet selected
  if (filled < slotsAvailable) {
    const remaining = classified
      .filter(e => e.pageType !== 'homepage' && !selected.has(e.url))
      .sort((a, b) => (b.prominence - a.prominence) || (b.score - a.score));
    for (const entry of remaining) {
      if (filled >= slotsAvailable) break;
      pick(entry);
      filled++;
    }
  }

  // Tag each result with its slot type
  return result.map(entry => ({
    url: entry.url,
    score: entry.score,
    reasons: {
      ...entry.reasons,
      slotType: entry.pageType,
      prominence: entry.prominence,
    },
  }));
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

  // Level 0: fetch homepage (with Browserless fallback)
  let homepageHtml = await fetchWithTimeout(rootUrl, 8000);
  if (!homepageHtml) {
    // Browserless fallback for JS-heavy sites
    try {
      const { fetchRenderedHtml } = require('./browserless');
      const rendered = await fetchRenderedHtml(rootUrl);
      if (rendered) {
        homepageHtml = rendered;
        console.log(`[sitemapPrioritizer] Crawler: homepage fetched via Browserless`);
      }
    } catch {}
  }
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

  // For Browserless fallback: accept any locale when root is 'default'
  // (same logic as sitemap locale detection but we don't have enough entries to detect dominant)
  const acceptAnyLocale = rootLocale === 'default';

  // Level 3: Browserless headless Chrome (last resort for JS-heavy SPAs)
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
  if (!xml) console.log(`[sitemapPrioritizer] sitemap.xml: ${rawXml ? 'fetched but not valid XML (' + rawXml.slice(0, 80) + ')' : 'fetch returned null'}`);

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
      // Try each sitemap URL (including .gz — now supported via gunzip)
      for (const smUrl of sitemapUrls) {
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
    console.log(`[sitemapPrioritizer] Sitemapindex found with ${subSitemapUrls.length} sub-sitemaps (first: ${subSitemapUrls[0] || 'none'})`);
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

  // ── Fetch homepage HTML for link counting (prominence signal) ─────────────
  const homepageNorm = normalizeUrl(rootUrl);
  let homepageHtml = null;
  try {
    homepageHtml = await fetchWithTimeout(rootUrl, 8000);
    if (!homepageHtml) {
      // Browserless fallback for JS-heavy sites
      try {
        const { fetchRenderedHtml } = require('./browserless');
        const rendered = await fetchRenderedHtml(rootUrl);
        if (rendered) {
          homepageHtml = rendered;
          console.log(`[sitemapPrioritizer] Homepage HTML fetched via Browserless for prominence counting`);
        }
      } catch {}
    }
  } catch (e) {
    console.log(`[sitemapPrioritizer] Homepage fetch for prominence failed: ${e.message && e.message.slice(0, 60)}`);
  }

  const homepageLinkCounts = countHomepageLinks(homepageHtml, rootUrl, hostname);
  const prominenceTotal = Object.keys(homepageLinkCounts).length;
  console.log(`[sitemapPrioritizer] Homepage prominence: ${prominenceTotal} unique internal links counted`);

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
      reasons: { freshness, depth, semantic, priority, strategicBonus, source, _lastmod: entry.lastmod || null },
    };
  });

  // ── Slot-based selection ────────────────────────────────────────────────────
  const slotSelection = fillSlots(scored, maxUrls, homepageNorm, homepageLinkCounts);

  // If slots are too product-heavy (not enough strategic/category pages found),
  // supplement with crawler to discover strategic pages
  const strategicCount = slotSelection.filter(e => e.reasons.slotType === 'strategic').length;
  const categoryCount = slotSelection.filter(e => e.reasons.slotType === 'category').length;
  if (strategicCount === 0 && categoryCount === 0 && slotSelection.length >= 5) {
    console.log(`[sitemapPrioritizer] No strategic/category pages found in sitemap. Crawling for missing page types...`);
    try {
      const crawled = await crawlFallback(rootUrl, { maxDepth: 1, maxUrls: 30, timeoutMs: 8000 });
      const existingUrls = new Set(slotSelection.map(e => e.url));
      existingUrls.add(homepageNorm);
      const crawledScored = crawled
        .filter(e => !isExcluded(e.url) && !existingUrls.has(normalizeUrl(e.url)))
        .map(e => {
          const norm = normalizeUrl(e.url);
          return {
            url: norm,
            score: scoreDepth(norm) + scoreSemantic(norm) + scoreStrategicBonus(norm) + 10,
            reasons: { source: 'crawler-supplement', _lastmod: null },
          };
        });
      // Re-run slot filling with combined entries
      const combined = [...scored, ...crawledScored];
      const seen2 = new Set();
      const deduped = combined.filter(e => { if (seen2.has(e.url)) return false; seen2.add(e.url); return true; });
      const refilledSlots = fillSlots(deduped, maxUrls, homepageNorm, homepageLinkCounts);
      if (refilledSlots.filter(e => e.reasons.slotType === 'strategic' || e.reasons.slotType === 'category').length > 0) {
        console.log(`[sitemapPrioritizer] Crawler supplement found strategic/category pages. Re-filled slots.`);
        slotSelection.length = 0;
        slotSelection.push(...refilledSlots);
      }
    } catch (e) { console.error('[sitemapPrioritizer] Crawler supplement failed:', e.message); }
  }

  // Build final list with homepage forced at position 0
  const homepageEntry = scored.find(u => u.url === homepageNorm);
  const homepage = homepageEntry
    ? { ...homepageEntry, score: 100, reasons: { ...homepageEntry.reasons, slotType: 'homepage', prominence: 0, forced: 'homepage' } }
    : { url: homepageNorm, score: 100, reasons: { freshness: 0, depth: 25, semantic: 0, priority: 0, strategicBonus: 0, slotType: 'homepage', prominence: 0, forced: 'homepage', source } };

  // Remove _lastmod from final output (internal-only field)
  const cleanReasons = (r) => { const { _lastmod, ...rest } = r; return rest; };

  const top = [
    { ...homepage, reasons: cleanReasons(homepage.reasons) },
    ...slotSelection.map(e => ({ ...e, reasons: cleanReasons(e.reasons) })),
  ].slice(0, maxUrls);

  // Log slot distribution for debugging
  const slotDist = {};
  top.forEach(e => { slotDist[e.reasons.slotType] = (slotDist[e.reasons.slotType] || 0) + 1; });
  console.log(`[sitemapPrioritizer] Final slot distribution: ${JSON.stringify(slotDist)}`);

  return top;
}

module.exports = { getTopPrioritizedUrls };
