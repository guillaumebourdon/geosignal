/**
 * Scoring V2 — 7 critères, 100 points, basé sur la recherche GEO 2024-2026.
 *
 * Sources principales :
 * - Princeton/Georgia Tech GEO paper (KDD 2024) : citations +115%, stats +41%, quotations +28%
 * - ALM Corp (1.2M réponses ChatGPT) : answer capsules 72.4%, front-loading 44%, question headings 2x
 * - ConvertMate (12.5K queries, 8K domains) : 20K+ chars = 4.3x, heading hierarchy 68.7%
 * - AirOps State of AI Search 2026 : 48% citations from community, 85% mentions from third parties
 * - Ahrefs Schema Study (March 2026) : no causal impact on AI citations
 * - Soar.sh : 71% of sites block an AI retrieval bot by mistake
 * - Règle des 13 semaines : citations drop after 13 weeks without update
 *
 * Single source of truth — used by analyze.js (free/29€) and proPageAnalyzer.js (Pro 99€).
 */

const { mdExternalLinks, mdAllLinks } = require('./markdownHelpers');

function getBaseDomain(hostname) {
  const parts = hostname.replace(/^www\./, '').split('.');
  if (parts.length >= 3 && parts[parts.length - 2].length <= 3) return parts.slice(-3).join('.');
  return parts.slice(-2).join('.');
}

// ── Evidence detail strings ──────────────────────────────────────────────────

const EV = {
  fr: {
    // Citability
    contentPresent: 'Contenu present',
    answerCapsules: 'answer capsules', answerCapsule: 'answer capsule', noAnswerCapsule: 'Aucun answer capsule detecte',
    frontLoaded: 'Front-loading efficace', frontLoadedPartial: 'Front-loading partiel', noFrontLoading: 'Infos cles pas en debut de page',
    contentDeep: 'Contenu approfondi', contentCorrect: 'Volume de contenu correct', contentShort: 'Contenu court',
    headingHierarchy: 'Hierarchie de titres claire', questionHeadings: 'titres en question', noQuestionHeading: 'Pas de titre en question',
    modularParas: 'paragraphes modulaires', fewModularParas: 'Peu de paragraphes modulaires',
    listItems: 'elements de liste', listItem: 'element de liste', fewLists: 'Peu de listes',
    // Verifiability
    verifiable: 'Contenu verifiable',
    dataPoints: 'donnees chiffrees', dataPoint: 'donnee chiffree', fewData: 'Peu de donnees chiffrees',
    extLinks: 'sources externes', extLink: 'source externe', noExtLinks: 'Aucune source externe identifiee',
    datesPresent: 'Dates presentes', noDateVisible: 'Aucune date visible',
    dataTables: 'Tableaux de donnees', citations: 'Citations d\'experts',
    // Authority
    structured: 'Site structure', contactPage: 'Page Contact', legalNotices: 'Mentions legales',
    aboutPage: 'Page A propos', authorId: 'Auteur identifie', schemaOrgPerson: 'Schema Organization/Person',
    definitiveLanguage: 'Langage definitif', vagueLanguage: 'Langage vague ou hedging',
    // Accessibility
    contentSufficient: 'Contenu suffisant', contentTooShort: 'Contenu trop court',
    langDefined: 'Lang defini', indexable: 'Indexable', noindexDetected: 'NOINDEX detecte',
    sitemapFound: 'Sitemap',
    aiBotAllowed: 'Bots IA de recherche autorises', aiBotBlocked: 'Bots IA de recherche bloques', aiBotUnknown: 'robots.txt non accessible',
    // Freshness
    yearPresent: 'Annee presente', recentContent: 'Contenu recent', possiblyOutdated: 'Contenu possiblement date',
    dateModified: 'Date de mise a jour', copyrightCurrent: 'Copyright a jour',
    datePublished: 'Date de publication visible',
    // External presence
    extLinksPresent: 'Liens sortants presents', pressMentions: 'Mentions presse',
    socialMedia: 'Reseaux sociaux', testimonials: 'Temoignages',
    lowExtPresence: 'Peu de presence externe identifiee',
    multiSocial: 'plateformes sociales',
  },
  en: {
    contentPresent: 'Content present',
    answerCapsules: 'answer capsules', answerCapsule: 'answer capsule', noAnswerCapsule: 'No answer capsule detected',
    frontLoaded: 'Effective front-loading', frontLoadedPartial: 'Partial front-loading', noFrontLoading: 'Key info not at top of page',
    contentDeep: 'In-depth content', contentCorrect: 'Adequate content volume', contentShort: 'Short content',
    headingHierarchy: 'Clear heading hierarchy', questionHeadings: 'question headings', noQuestionHeading: 'No question heading',
    modularParas: 'modular paragraphs', fewModularParas: 'Few modular paragraphs',
    listItems: 'list items', listItem: 'list item', fewLists: 'Few lists',
    verifiable: 'Verifiable content',
    dataPoints: 'data points', dataPoint: 'data point', fewData: 'Few data points',
    extLinks: 'external sources', extLink: 'external source', noExtLinks: 'No external source identified',
    datesPresent: 'Dates present', noDateVisible: 'No visible date',
    dataTables: 'Data tables', citations: 'Expert quotations',
    structured: 'Structured site', contactPage: 'Contact page', legalNotices: 'Legal notices',
    aboutPage: 'About page', authorId: 'Author identified', schemaOrgPerson: 'Schema Organization/Person',
    definitiveLanguage: 'Definitive language', vagueLanguage: 'Vague or hedging language',
    contentSufficient: 'Sufficient content', contentTooShort: 'Content too short',
    langDefined: 'Lang defined', indexable: 'Indexable', noindexDetected: 'NOINDEX detected',
    sitemapFound: 'Sitemap',
    aiBotAllowed: 'AI search bots allowed', aiBotBlocked: 'AI search bots blocked', aiBotUnknown: 'robots.txt not accessible',
    yearPresent: 'Year present', recentContent: 'Recent content', possiblyOutdated: 'Possibly outdated',
    dateModified: 'Update date', copyrightCurrent: 'Copyright up to date',
    datePublished: 'Publication date visible',
    extLinksPresent: 'Outbound links present', pressMentions: 'Press mentions',
    socialMedia: 'Social media', testimonials: 'Testimonials',
    lowExtPresence: 'Low external presence identified',
    multiSocial: 'social platforms',
  },
};

// ── Shared helpers ───────────────────────────────────────────────────────────

function getStructCheerio($, directHtml) {
  if (directHtml) {
    try { return require('cheerio').load(directHtml); } catch {}
  }
  return $;
}

function getHeadings($struct, $, raw, directHtml) {
  const directH1 = directHtml ? $struct('h1').length : 0;
  const directH2 = directHtml ? $struct('h2').length : 0;
  const directH3 = directHtml ? $struct('h3').length : 0;
  const directTotal = directH1 + directH2 + directH3;
  const mdH1 = (raw.match(/^# (?!#)[^\n]+/gm) || []).length;
  const mdH2 = (raw.match(/^## (?!#)[^\n]+/gm) || []).length;
  const mdH3 = (raw.match(/^### (?!#)[^\n]+/gm) || []).length;
  return {
    h1: directTotal > 0 ? directH1 : mdH1,
    h2: directTotal > 0 ? directH2 : mdH2,
    h3: directTotal > 0 ? directH3 : mdH3,
  };
}

// ── 1. CITABILITÉ & RÉPONSE DIRECTE (25 pts) ────────────────────────────────
// Answer capsules, front-loading, depth, heading hierarchy, modular paragraphs

function scoreCitability($, text, raw, locale = 'fr', directHtml = '') {
  const e = EV[locale] || EV.fr;
  const $struct = getStructCheerio($, directHtml);
  let score = 0;
  const details = [];

  // Answer capsules: 20-50 word blocks immediately after H2s (0-8 pts)
  // Detect paragraphs of 20-60 words right after a heading
  const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
  let capsuleCount = 0;
  const headingRegex = /^#{1,3}\s+/;
  for (let i = 0; i < lines.length - 1; i++) {
    if (headingRegex.test(lines[i]) || /^[A-Z][^.!?]{5,60}$/.test(lines[i])) {
      const next = lines[i + 1];
      const wordCount = next.split(/\s+/).length;
      if (wordCount >= 15 && wordCount <= 70 && !/^[#\-\*\|]/.test(next)) capsuleCount++;
    }
  }
  // Also check HTML: <p> right after <h2>/<h3> with 15-70 words
  $struct('h2, h3').each((_, el) => {
    const nextP = $struct(el).next('p');
    if (nextP.length) {
      const wc = nextP.text().trim().split(/\s+/).length;
      if (wc >= 15 && wc <= 70) capsuleCount++;
    }
  });
  capsuleCount = Math.min(capsuleCount, 20); // cap
  if (capsuleCount >= 5) { score += 8; details.push(`${capsuleCount} ${e.answerCapsules} ✓`); }
  else if (capsuleCount >= 3) { score += 5; details.push(`${capsuleCount} ${e.answerCapsules}`); }
  else if (capsuleCount >= 1) { score += 2; details.push(`${capsuleCount} ${e.answerCapsule}`); }
  else details.push(`${e.noAnswerCapsule} ✗`);

  // Front-loading: key info density in first 30% vs rest (0-5 pts)
  const textLen = text.length;
  const first30 = text.slice(0, Math.floor(textLen * 0.3));
  const first30Words = first30.split(/\s+/).filter(w => w.length > 1).length;
  const totalWords = text.split(/\s+/).filter(w => w.length > 1).length;
  const first30Ratio = totalWords > 0 ? first30Words / totalWords : 0;
  // Check if first 30% has substantial content (not just nav/header)
  const first30DataPoints = (first30.match(/\d+[.,]?\d*\s*(%|€|\$|pts?|points?|fois|ans?\b|mois\b|jours?\b|m²|km\b|kg\b|heures?\b)\b/gi) || []).length;
  if (first30Ratio >= 0.25 && first30Words >= 50) { score += 5; details.push(`${e.frontLoaded} ✓`); }
  else if (first30Words >= 30) { score += 3; details.push(e.frontLoadedPartial); }
  else details.push(`${e.noFrontLoading} ✗`);

  // Content depth (0-4 pts)
  if (totalWords >= 2000) { score += 4; details.push(`${e.contentDeep} (${totalWords} mots) ✓`); }
  else if (totalWords >= 500) { score += 2; details.push(`${e.contentCorrect} (${totalWords} mots)`); }
  else if (totalWords >= 100) { score += 1; details.push(`${e.contentShort} (${totalWords} mots)`); }
  else details.push(`${e.contentShort} ✗`);

  // Heading hierarchy + question headings (0-4 pts)
  const h = getHeadings($struct, $, raw, directHtml);
  const hasHierarchy = h.h2 >= 2;
  const headingTexts = [];
  $struct('h2').each((_, el) => headingTexts.push($struct(el).text().trim()));
  if (headingTexts.length === 0) {
    (raw.match(/^## (?!#)(.+)/gm) || []).forEach(m => headingTexts.push(m.replace(/^##\s+/, '')));
  }
  const questionH2Count = headingTexts.filter(t => /\?$|^(comment|pourquoi|quand|combien|qu['']est|what|how|why|when|which|where|who|can|do|is|are)\s/i.test(t)).length;
  if (hasHierarchy && questionH2Count >= 2) { score += 4; details.push(`${e.headingHierarchy} ✓ · ${questionH2Count} ${e.questionHeadings} ✓`); }
  else if (hasHierarchy) { score += 2; details.push(`${e.headingHierarchy} ✓ · ${e.noQuestionHeading}`); }
  else if (h.h2 >= 1) { score += 1; details.push(`${h.h2} H2`); }
  else details.push(`${e.noQuestionHeading} ✗`);

  // Modular paragraphs: 30-80 word paragraphs (0-4 pts)
  const htmlModularParas = Array.from($struct('p')).filter(p => {
    const wc = $struct(p).text().trim().split(/\s+/).length;
    return wc >= 20 && wc <= 80;
  }).length;
  const mdModularParas = raw.split('\n').filter(l => {
    const t = l.trim();
    if (t.length < 50 || /^[#|\-\*\d\[]/.test(t)) return false;
    const wc = t.split(/\s+/).length;
    return wc >= 20 && wc <= 80;
  }).length;
  const modParas = Math.max(htmlModularParas, Math.min(mdModularParas, 20));
  if (modParas >= 5) { score += 4; details.push(`${modParas} ${e.modularParas} ✓`); }
  else if (modParas >= 2) { score += 2; details.push(`${modParas} ${e.modularParas}`); }
  else details.push(`${e.fewModularParas} ✗`);

  return { score: Math.min(score, 25), max: 25, detail: details.join(' · ') };
}

// ── 2. VÉRIFIABILITÉ & PREUVES (20 pts) ─────────────────────────────────────
// Data points, external sources, dates, expert quotations, tables

function scoreVerifiability($, text, html, siteHostname, locale = 'fr') {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];
  score += 2; details.push(e.verifiable);

  // Data points (0-5 pts) — reuses all existing dedup/filtering fixes
  const rawNumbers = text.match(/\d+[.,]?\d*\s*(%|€|\$|pts?|points?|fois|times|ans?\b|years?\b|mois\b|months?\b|jours?\b|days?\b|m²|km\b|kg\b|heures?\b)\b/gi) || [];
  const bigNumbers = text.match(/\d+[.,]?\d*\s*[kK]\b|\d+[.,]?\d*\s*M\b/g) || [];
  const currencyNumbers = text.match(/\d+[.,]?\d*\s*(?:DA|DH|TND|FCFA|CFA|£|¥)\b/g) || [];
  const hourMatches = text.match(/\b\d{1,2}h\d{0,2}\b/gi) || [];
  const allNumbers = [...rawNumbers, ...bigNumbers, ...currencyNumbers, ...hourMatches];
  const uniqueNumbers = [...new Set(allNumbers.map(n => n.trim().toLowerCase().replace(/\s+/g, '')))];
  const numbers = uniqueNumbers.filter(n => !/^\d{6,}/.test(n));
  if (numbers.length >= 5) { score += 5; details.push(`${numbers.length} ${e.dataPoints} ✓`); }
  else if (numbers.length >= 2) { score += 3; details.push(`${numbers.length} ${e.dataPoints}`); }
  else if (numbers.length >= 1) { score += 1; details.push(`${numbers.length} ${e.dataPoint}`); }
  else details.push(`${e.fewData} ✗`);

  // External links / sources (0-5 pts) — reuses domain dedup + localhost exclusion
  const htmlExtLinks = [];
  const seenDomains = new Set();
  try {
    const siteHost = new URL(siteHostname.startsWith('http') ? siteHostname : `https://${siteHostname}`).hostname.replace(/^www\./, '');
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href.startsWith('http')) return;
      try {
        const linkHost = new URL(href).hostname.replace(/^www\./, '');
        if (getBaseDomain(linkHost) !== getBaseDomain(siteHost) && !seenDomains.has(linkHost)) {
          seenDomains.add(linkHost);
          htmlExtLinks.push(href);
        }
      } catch {}
    });
  } catch {}
  const externalLinks = htmlExtLinks.length > 0 ? htmlExtLinks : mdExternalLinks(html, siteHostname);
  if (externalLinks.length >= 5) { score += 5; details.push(`${externalLinks.length} ${e.extLinks} ✓`); }
  else if (externalLinks.length >= 2) { score += 3; details.push(`${externalLinks.length} ${e.extLinks}`); }
  else if (externalLinks.length >= 1) { score += 1; details.push(`${externalLinks.length} ${e.extLink}`); }
  else details.push(`${e.noExtLinks} ✗`);

  // Dates (0-4 pts)
  let hasDate = html.includes('datePublished') || html.includes('dateModified') || /\b(20\d{2})\b/.test(text.slice(0, 500)) || $('time[datetime]').length > 0 || /(?:©|Copyright)\s*\d{4}/i.test(html);
  if (!hasDate) {
    $('script[type="application/ld+json"]').each((_, el) => {
      try { const c = $(el).html() || ''; if (c.includes('datePublished') || c.includes('dateModified')) hasDate = true; } catch {}
    });
  }
  if (hasDate) { score += 4; details.push(`${e.datesPresent} ✓`); }
  else details.push(`${e.noDateVisible} ✗`);

  // Tables (0-3 pts)
  const realTables = $('table').filter((_, el) => {
    if ($(el).attr('role') === 'presentation') return false;
    if ($(el).find('th').length === 0 && $(el).find('tr').length <= 1) return false;
    return true;
  }).length;
  const hasTable = realTables > 0 || (html.match(/^\|.+\|/gm) || []).length >= 3;
  if (hasTable) { score += 3; details.push(`${e.dataTables} ✓`); }

  // Blockquotes / expert quotations (0-1 pt)
  if ($('blockquote').length > 0) { score += 1; details.push(`${e.citations} ✓`); }

  return { score: Math.min(score, 20), max: 20, detail: details.join(' · ') };
}

// ── 3. AUTORITÉ & E-E-A-T (15 pts) ──────────────────────────────────────────
// Author, trust pages, schema Org/Person, definitive language

function scoreAuthority($, html, locale = 'fr', directHtml = '') {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];
  const htmlLinks = [];
  $('a[href]').each((_, el) => htmlLinks.push(($(el).attr('href') || '').toLowerCase()));
  if (directHtml) {
    const cheerio = require('cheerio');
    const $d = cheerio.load(directHtml);
    $d('a[href]').each((_, el) => { const h = ($d(el).attr('href') || '').toLowerCase(); if (!htmlLinks.includes(h)) htmlLinks.push(h); });
  }
  const links = htmlLinks.length > 0 ? htmlLinks : mdAllLinks(html);

  // Structure signals (0-4 pts)
  if (links.some(l => /\/(contact|nous-contacter|contactez-nous)(\/|$|\?|#)/i.test(l) || l.includes('mailto:'))) { score += 2; details.push(`${e.contactPage} ✓`); }
  if (links.some(l => /\/(mentions?[-_]?l[eé]gales?|legal[-_]?notice|imprint)(\/|$|\?|#)/i.test(l) || l.includes('cgu') || l.includes('terms') || l.includes('privacy') || l.includes('confidential'))) { score += 1; details.push(`${e.legalNotices} ✓`); }
  if (links.some(l => /\/(a-propos|about|about-us|qui-sommes-nous|notre-equipe|team)(\/|$|\?|#)/i.test(l))) { score += 1; details.push(`${e.aboutPage} ✓`); }

  // Author identified (0-3 pts)
  const hasAuthorPage = links.some(l => l.includes('author') || l.includes('auteur') || l.includes('equipe') || l.includes('team'));
  const hasAuthorSchema = html.includes('"author"') || html.includes('rel="author"') || (directHtml && (directHtml.includes('"author"') || directHtml.includes('rel="author"')));
  const hasAuthorText = /par\s+[A-Z][A-Za-z-]{2,}|by\s+[A-Z][a-z]+|r.dig. par|written by/.test(html);
  if (hasAuthorPage || hasAuthorSchema || hasAuthorText) { score += 3; details.push(`${e.authorId} ✓`); }

  // Schema Organization/Person (0-3 pts) — trust signal, not standalone criterion
  if (html.includes('"Organization"') || html.includes('"Person"') || (directHtml && (directHtml.includes('"Organization"') || directHtml.includes('"Person"')))) { score += 3; details.push(`${e.schemaOrgPerson} ✓`); }

  // Definitive language (0-2 pts) — "X est" vs "X pourrait être"
  const text = $('body').text() || html;
  const definitivePatterns = /\b(?:est|sont|permet|offre|garantit|assure|propose|fournit|is|are|provides|ensures|delivers|offers)\b/gi;
  const hedgingPatterns = /\b(?:pourrait|devrait|semblerait|peut-[eê]tre|éventuellement|might|could|perhaps|maybe|possibly|arguably)\b/gi;
  const definitiveCount = (text.match(definitivePatterns) || []).length;
  const hedgingCount = (text.match(hedgingPatterns) || []).length;
  if (definitiveCount > hedgingCount * 3 && definitiveCount >= 5) { score += 2; details.push(`${e.definitiveLanguage} ✓`); }
  else if (hedgingCount > definitiveCount) { details.push(e.vagueLanguage); }

  return { score: Math.min(score, 15), max: 15, detail: details.join(' · ') };
}

// ── 4. ACCESSIBILITÉ IA (10 pts) ─────────────────────────────────────────────
// AI retrieval bots, indexable, lang, canonical, sitemap, content sufficient

function scoreAccessibility($, html, locale = 'fr', directHtml = '', robotsTxt = '') {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];

  // AI retrieval bots check (0-3 pts)
  // Check if search/retrieval bots are allowed (not training bots)
  if (robotsTxt && robotsTxt.length > 10 && !robotsTxt.includes('404') && !robotsTxt.includes('Non accessible')) {
    const rt = robotsTxt.toLowerCase();
    // Check for blanket disallow that would block AI search bots
    const searchBots = ['oai-searchbot', 'chatgpt-user', 'perplexitybot', 'claude-web'];
    const blockedBots = searchBots.filter(bot => {
      const botSection = rt.match(new RegExp(`user-agent:\\s*${bot}[\\s\\S]*?(?=user-agent:|$)`, 'i'));
      return botSection && /disallow:\s*\/\s*$/m.test(botSection[0]);
    });
    // Also check if blanket User-agent: * blocks everything
    const blanketBlock = /user-agent:\s*\*[\s\S]*?disallow:\s*\/\s*$/m.test(rt) && !/allow:\s*\/\s*$/m.test(rt);
    if (blockedBots.length === 0 && !blanketBlock) { score += 3; details.push(`${e.aiBotAllowed} ✓`); }
    else if (blockedBots.length <= 2) { score += 1; details.push(`${blockedBots.length} bot(s) bloques`); }
    else details.push(`${e.aiBotBlocked} ✗`);
  } else if (robotsTxt.includes('404')) {
    // No robots.txt = everything allowed
    score += 2; details.push(`${e.aiBotAllowed} (pas de robots.txt)`);
  } else {
    score += 1; details.push(e.aiBotUnknown);
  }

  // Indexable (0-2 pts)
  const metaRobots = $('meta[name="robots"]').attr('content') || '';
  if (!metaRobots.includes('noindex')) { score += 2; details.push(`${e.indexable} ✓`); }
  else details.push(`${e.noindexDetected} ✗`);

  // Content sufficient (0-2 pts)
  const htmlTextLength = $('body').text().replace(/\s+/g, ' ').trim().length;
  const textLength = htmlTextLength > 100 ? htmlTextLength : html.replace(/\s+/g, ' ').trim().length;
  if (textLength > 3000) { score += 2; details.push(`${e.contentSufficient} (${textLength} chars) ✓`); }
  else if (textLength > 500) { score += 1; details.push(`${textLength} chars`); }
  else details.push(`${e.contentTooShort} ✗`);

  // Lang + canonical (0-1 pt)
  const hasLang = $('html[lang]').length > 0 || (directHtml && directHtml.includes('lang='));
  const hasCanonical = $('link[rel="canonical"]').length > 0 || (directHtml && directHtml.includes('rel="canonical"'));
  if (hasLang && hasCanonical) { score += 1; details.push(`${e.langDefined} ✓ · Canonical ✓`); }
  else if (hasLang) { score += 1; details.push(`${e.langDefined} ✓`); }

  // Sitemap (0-1 pt)
  if (html.includes('sitemap.xml') || html.includes('sitemap_index') || /href=["'][^"']*sitemap/i.test(html) || (directHtml && (directHtml.includes('sitemap.xml') || directHtml.includes('sitemap_index')))) {
    score += 1; details.push(`${e.sitemapFound} ✓`);
  }
  // Also check robots.txt for sitemap
  if (robotsTxt && /sitemap:/i.test(robotsTxt) && !details.some(d => d.includes('Sitemap'))) {
    score += 1; details.push(`${e.sitemapFound} ✓`);
  }

  return { score: Math.min(score, 10), max: 10, detail: details.join(' · ') };
}

// ── 5. NEUTRALITÉ ÉDITORIALE (10 pts) ────────────────────────────────────────
// Scored by Claude — no change in scoring.js, just the max stays at 10

// ── 6. FRAÎCHEUR & SIGNAUX TEMPORELS (10 pts) ───────────────────────────────
// Publication date, dateModified, copyright, recency

function scoreFreshness($, html, locale = 'fr') {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];
  const currentYear = new Date().getFullYear();

  // Year visible in content (0-2 pts)
  if (/\b20[12]\d\b/.test(html)) { score += 1; details.push(e.yearPresent); }
  const recentYearRegex = new RegExp(`\\b(${currentYear}|${currentYear - 1})\\b`);
  if (recentYearRegex.test(html)) { score += 1; details.push(`${e.recentContent} (${currentYear}) ✓`); }
  else details.push(`${e.possiblyOutdated} ✗`);

  // dateModified in schema (0-3 pts) — strongest freshness signal
  let dateModifiedFound = html.includes('dateModified');
  if (!dateModifiedFound) {
    $('script[type="application/ld+json"]').each((_, el) => {
      try { if ($(el).html()?.includes('dateModified')) dateModifiedFound = true; } catch {}
    });
  }
  if (dateModifiedFound) { score += 3; details.push(`${e.dateModified} ✓`); }

  // Publication date visible (0-2 pts)
  let hasDatePublished = html.includes('datePublished');
  if (!hasDatePublished) {
    $('script[type="application/ld+json"]').each((_, el) => {
      try { if ($(el).html()?.includes('datePublished')) hasDatePublished = true; } catch {}
    });
  }
  if (!hasDatePublished) {
    // Check for visible date patterns in content
    hasDatePublished = $('time[datetime]').length > 0 || /publi[eé]\s+le|published\s+on|posted\s+on|mis\s+[aà]\s+jour/i.test(html);
  }
  if (hasDatePublished) { score += 2; details.push(`${e.datePublished} ✓`); }

  // Copyright current (0-2 pts)
  const copyrightCurrent = new RegExp(`(©|Copyright)\\s*${currentYear}`, 'i').test(html) ||
    new RegExp(`(©|Copyright)\\s*\\d{4}\\s*[-–—]\\s*${currentYear}`, 'i').test(html);
  if (copyrightCurrent) { score += 2; details.push(`${e.copyrightCurrent} ✓`); }

  return { score: Math.min(score, 10), max: 10, detail: details.join(' · ') || e.possiblyOutdated };
}

// ── 7. PRÉSENCE & SIGNAUX EXTERNES (10 pts) ──────────────────────────────────
// Social, press, testimonials, outbound links, multi-platform

function scoreExternalPresence($, html, locale = 'fr', directMeta = {}) {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];

  // Outbound links (0-2 pts)
  const htmlExtLinks = [];
  $('a[href]').each((_, el) => { const href = $(el).attr('href') || ''; if (href.startsWith('http')) htmlExtLinks.push(href.toLowerCase()); });
  const externalLinks = htmlExtLinks.length > 0 ? htmlExtLinks : mdExternalLinks(html, null).map(l => l.toLowerCase());
  if (externalLinks.length > 0) { score += 2; details.push(`${e.extLinksPresent} ✓`); }

  // Press mentions (0-2 pts)
  if (/\bpresse\b|m[eé]dia|vu dans|as seen in|featured in|mentioned in/i.test(html)) { score += 2; details.push(`${e.pressMentions} ✓`); }

  // Social media (0-2 pts)
  const socialTrackingExclude = ['analytics.twitter', 'platform.twitter', 'ads.twitter', 'adsct', 'connect.facebook', 'staticxx.facebook', '/intent/', '/sharer/', '/widgets/', '/share?', '/share.php', '/plugins/', '/login', '/oauth', '/sdk', '/embed'];
  const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com', 'tiktok.com', 'snapchat.com', 'pinterest.com', 'threads.net'];
  const socialIframes = [];
  $('iframe[src]').each((_, el) => {
    const src = ($(el).attr('src') || '').toLowerCase();
    if (src.includes('youtube.com') || src.includes('youtu.be')) socialIframes.push('YouTube');
    if (src.includes('instagram.com')) socialIframes.push('Instagram');
    if (src.includes('facebook.com')) socialIframes.push('Facebook');
    if (src.includes('tiktok.com')) socialIframes.push('TikTok');
  });
  const detectedSocials = new Set();
  externalLinks.forEach(l => {
    socialDomains.forEach(d => {
      if (l.includes(d) && !socialTrackingExclude.some(ex => l.includes(ex))) detectedSocials.add(d);
    });
  });
  if (directMeta.socialLinks) directMeta.socialLinks.forEach(l => { socialDomains.forEach(d => { if (l.includes(d)) detectedSocials.add(d); }); });
  socialIframes.forEach(name => detectedSocials.add(name));
  if (detectedSocials.size > 0) { score += 2; details.push(`${e.socialMedia} ✓`); }

  // Testimonials (0-2 pts)
  if (/t[eé]moignage|avis\s+(client|google|v[eé]rifi[eé]|trustpilot)|customer\s+reviews?|testimonials?|note\s+google|\b[45][.,]\d\s*\/\s*5\b|recommandations?\s+client/i.test(html)) {
    score += 2; details.push(`${e.testimonials} ✓`);
  }

  // Multi-platform bonus (0-2 pts) — 3+ social platforms
  if (detectedSocials.size >= 3) { score += 2; details.push(`${detectedSocials.size} ${e.multiSocial} ✓`); }

  if (details.length === 0) details.push(e.lowExtPresence);
  return { score: Math.min(score, 10), max: 10, detail: details.join(' · ') };
}

module.exports = {
  scoreCitability,
  scoreVerifiability,
  scoreAuthority,
  scoreAccessibility,
  scoreExternalPresence,
  scoreFreshness,
  EV,
  getBaseDomain,
  getHeadings,
  getStructCheerio,
};
