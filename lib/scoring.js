/**
 * Shared scoring functions — single source of truth for all audit types.
 * Used by both analyze.js (free/29€) and proPageAnalyzer.js (Pro 99€).
 */

const { mdExternalLinks, mdAllLinks } = require('./markdownHelpers');

// ── Evidence detail strings by locale ────────────────────────────────────────

const EV = {
  fr: {
    contentPresent: 'Contenu present', introSubstantial: 'Intro substantielle', introCorrect: 'Intro correcte', introShort: 'Intro courte', introTooShort: 'Intro trop courte',
    listItems: 'elements de liste', listItem: 'element de liste', fewLists: 'Peu de listes',
    tables: 'tableaux', table: 'tableau',
    h1Present: 'H1 present', noH1: 'Aucun H1 detecte', noH2: 'Aucun H2',
    shortParas: 'paragraphes calibres', correctParas: 'paragraphes corrects', para: 'paragraphe', longParas: 'Paragraphes longs ou absents',
    verifiable: 'Contenu verifiable', dataPoints: 'donnees chiffrees', dataPoint: 'donnee chiffree', fewData: 'Peu de donnees chiffrees',
    extLinks: 'liens externes', extLink: 'lien externe', noExtLinks: 'Aucun lien externe identifie dans le contenu analyse',
    datesPresent: 'Dates presentes', noDateVisible: 'Aucune date visible', dataTables: 'Tableaux de donnees', citations: 'Citations',
    structured: 'Site structure', contactPage: 'Page Contact', legalNotices: 'Mentions legales', aboutPage: 'Page A propos', authorId: 'Auteur identifie', schemaOrgPerson: 'Schema Organization/Person',
    contentTooShort: 'Contenu trop court', langDefined: 'Lang defini', indexable: 'Indexable', noindexDetected: 'NOINDEX detecte',
    sitemapFound: 'Sitemap', aiBotsFound: 'Bots IA mentionnes',
    semanticHtml: 'HTML semantique', partialSemantic: 'HTML partiellement semantique',
    schemaPrio: 'Schema prioritaire :', schemaEntity: 'Schema entite :', noSchema: 'Aucun schema JSON-LD identifie dans le contenu analyse',
    extLinksPresent: 'Liens externes presents', pressMentions: 'Mentions presse', socialMedia: 'Reseaux sociaux', testimonials: 'Temoignages', lowExtPresence: 'Peu de presence externe identifiee dans le contenu analyse',
    yearPresent: 'Annee presente', recentContent: 'Contenu recent', possiblyOutdated: 'Contenu possiblement date', dateModified: 'Date de mise a jour', copyrightCurrent: 'Copyright a jour',
  },
  en: {
    contentPresent: 'Content present', introSubstantial: 'Substantial intro', introCorrect: 'Correct intro', introShort: 'Short intro', introTooShort: 'Intro too short',
    listItems: 'list items', listItem: 'list item', fewLists: 'Few lists',
    tables: 'tables', table: 'table',
    h1Present: 'H1 present', noH1: 'No H1 detected', noH2: 'No H2',
    shortParas: 'calibrated paragraphs', correctParas: 'correct paragraphs', para: 'paragraph', longParas: 'Long or missing paragraphs',
    verifiable: 'Verifiable content', dataPoints: 'data points', dataPoint: 'data point', fewData: 'Few data points',
    extLinks: 'external links', extLink: 'external link', noExtLinks: 'No external link identified in analyzed content',
    datesPresent: 'Dates present', noDateVisible: 'No visible date', dataTables: 'Data tables', citations: 'Citations',
    structured: 'Structured site', contactPage: 'Contact page', legalNotices: 'Legal notices', aboutPage: 'About page', authorId: 'Author identified', schemaOrgPerson: 'Schema Organization/Person',
    contentTooShort: 'Content too short', langDefined: 'Lang defined', indexable: 'Indexable', noindexDetected: 'NOINDEX detected',
    sitemapFound: 'Sitemap', aiBotsFound: 'AI bots mentioned',
    semanticHtml: 'Semantic HTML', partialSemantic: 'Partially semantic HTML',
    schemaPrio: 'Priority schema:', schemaEntity: 'Entity schema:', noSchema: 'No JSON-LD schema identified in analyzed content',
    extLinksPresent: 'External links present', pressMentions: 'Press mentions', socialMedia: 'Social media', testimonials: 'Testimonials', lowExtPresence: 'Low external presence identified in analyzed content',
    yearPresent: 'Year present', recentContent: 'Recent content', possiblyOutdated: 'Possibly outdated content', dateModified: 'Update date', copyrightCurrent: 'Copyright up to date',
  },
};

function scoreExtractibility($, text, raw, locale = 'fr') {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];
  score += 3; details.push(`${e.contentPresent} ✓`);
  const intro = text.slice(0, 300);
  const introWords = intro.split(/\s+/).filter(w => w.length > 1).length;
  if (introWords > 30) { score += 5; details.push(`${e.introSubstantial} ✓`); }
  else if (introWords > 15) { score += 3; details.push(e.introCorrect); }
  else if (introWords > 5) { score += 1; details.push(e.introShort); }
  else details.push(`${e.introTooShort} ✗`);
  const htmlListCount = $('ul li, ol li').filter((_, el) => !$(el).closest('nav, header, footer, [role="navigation"]').length).length;
  const mdListCount = (raw.match(/^[\-\*\+]\s+\S/gm) || []).length + (raw.match(/^\d+\.\s+\S/gm) || []).length;
  const listCount = Math.max(htmlListCount, mdListCount);
  if (listCount >= 10) { score += 5; details.push(`${listCount} ${e.listItems} ✓`); }
  else if (listCount >= 4) { score += 3; details.push(`${listCount} ${e.listItems}`); }
  else if (listCount >= 1) { score += 1; details.push(`${listCount} ${e.listItem}`); }
  else details.push(`${e.fewLists} ✗`);
  const htmlTableCount = $('table').length;
  const mdTableLines = (raw.match(/^\|.+\|/gm) || []).length;
  const tableCount = htmlTableCount > 0 ? htmlTableCount : (mdTableLines >= 3 ? 1 : 0);
  if (tableCount >= 2) { score += 4; details.push(`${tableCount} ${e.tables} ✓`); }
  else if (tableCount === 1) { score += 2; details.push(`1 ${e.table}`); }
  const htmlH1Count = $('h1').length;
  const mdH1Count = (raw.match(/^# .+/gm) || []).length;
  const h1Count = Math.max(htmlH1Count, mdH1Count);
  const htmlH2Count = $('h2').length;
  const mdH2Count = (raw.match(/^## .+/gm) || []).length;
  const h2Count = Math.max(htmlH2Count, mdH2Count);
  const htmlH3Count = $('h3').length;
  const mdH3Count = (raw.match(/^### .+/gm) || []).length;
  const h3Count = Math.max(htmlH3Count, mdH3Count);
  if (h1Count >= 1) details.push(`${e.h1Present} ✓`);
  else details.push(`${e.noH1} ✗`);
  if (h2Count >= 4) { score += 5; details.push(`${h2Count} H2 ✓`); }
  else if (h2Count >= 2) { score += 3; details.push(`${h2Count} H2`); }
  else if (h2Count >= 1) { score += 1; details.push('1 H2'); }
  else details.push(`${e.noH2} ✗`);
  if (h3Count >= 3) { score += 1; details.push(`${h3Count} H3 ✓`); }
  const htmlShortParas = Array.from($('p')).filter(p => { const txt = $(p).text().trim(); return txt.length > 50 && txt.length < 300; }).length;
  const mdShortParas = raw.split('\n').filter(l => { const t = l.trim(); return t.length > 50 && t.length < 300 && !/^[#|\-\*\d]/.test(t); }).length;
  const shortParas = htmlShortParas > 0 ? htmlShortParas : Math.min(mdShortParas, 10);
  if (shortParas >= 5) { score += 5; details.push(`${shortParas} ${e.shortParas} ✓`); }
  else if (shortParas >= 2) { score += 3; details.push(`${shortParas} ${e.correctParas}`); }
  else if (shortParas >= 1) { score += 1; details.push(`${shortParas} ${e.para}`); }
  else details.push(`${e.longParas} ✗`);
  return { score: Math.min(score, 25), max: 25, detail: details.slice(0, 3).join(' · ') };
}

function scoreVerifiability($, text, html, siteHostname, locale = 'fr') {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];
  score += 2; details.push(e.verifiable);
  // Data points: deduplicated, exclude phone-like patterns
  const rawNumbers = text.match(/\d+[.,]?\d*\s*(%|€|\$|k|M|pts?|points?|fois|times|ans?|years?|mois|months?|jours?|days?|m²|km|kg|DA|£|¥)/gi) || [];
  const uniqueNumbers = [...new Set(rawNumbers.map(n => n.trim().toLowerCase()))];
  const numbers = uniqueNumbers.filter(n => !/^\d{6,}/.test(n));
  if (numbers.length >= 5) { score += 5; details.push(`${numbers.length} ${e.dataPoints} ✓`); }
  else if (numbers.length >= 2) { score += 3; details.push(`${numbers.length} ${e.dataPoints}`); }
  else if (numbers.length >= 1) { score += 1; details.push(`${numbers.length} ${e.dataPoint}`); }
  else details.push(`${e.fewData} ✗`);
  // External links: deduplicate by domain, exclude site's own domain
  const htmlExtLinks = [];
  const seenDomains = new Set();
  try {
    const siteHost = new URL(siteHostname.startsWith('http') ? siteHostname : `https://${siteHostname}`).hostname.replace(/^www\./, '');
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href.startsWith('http')) return;
      try {
        const linkHost = new URL(href).hostname.replace(/^www\./, '');
        if (linkHost !== siteHost && !seenDomains.has(linkHost)) {
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
  const hasDate = html.includes('datePublished') || html.includes('dateModified') || /\b(20\d{2})\b/.test(text.slice(0, 500)) || $('time[datetime]').length > 0;
  if (hasDate) { score += 4; details.push(`${e.datesPresent} ✓`); }
  else details.push(`${e.noDateVisible} ✗`);
  const hasTable = $('table').length > 0 || (html.match(/^\|.+\|/gm) || []).length >= 3;
  if (hasTable) { score += 3; details.push(`${e.dataTables} ✓`); }
  if ($('blockquote').length > 0) { score += 1; details.push(`${e.citations} ✓`); }
  return { score: Math.min(score, 20), max: 20, detail: details.slice(0, 3).join(' · ') };
}

function scoreAuthority($, html, locale = 'fr', directHtml = '') {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];
  const htmlLinks = [];
  $('a[href]').each((_, el) => htmlLinks.push(($(el).attr('href') || '').toLowerCase()));
  // Merge links from direct HTML (Jina strips footer where Contact/About/Legal links live)
  if (directHtml) {
    const cheerio = require('cheerio');
    const $d = cheerio.load(directHtml);
    $d('a[href]').each((_, el) => { const h = ($d(el).attr('href') || '').toLowerCase(); if (!htmlLinks.includes(h)) htmlLinks.push(h); });
  }
  const links = htmlLinks.length > 0 ? htmlLinks : mdAllLinks(html);
  score += 2; details.push(`${e.structured} ✓`);
  if (links.some(l => l.includes('contact') || l.includes('mailto:'))) { score += 3; details.push(`${e.contactPage} ✓`); }
  if (links.some(l => l.includes('legal') || l.includes('mention') || l.includes('cgu') || l.includes('terms') || l.includes('privacy') || l.includes('confidential'))) { score += 2; details.push(`${e.legalNotices} ✓`); }
  if (links.some(l => l.includes('about') || l.includes('propos') || l.includes('qui-sommes') || l.includes('a-propos'))) { score += 2; details.push(`${e.aboutPage} ✓`); }
  const hasAuthorPage = links.some(l => l.includes('author') || l.includes('auteur') || l.includes('equipe') || l.includes('team'));
  const hasAuthorSchema = html.includes('"author"') || html.includes('rel="author"') || (directHtml && (directHtml.includes('"author"') || directHtml.includes('rel="author"')));
  const hasAuthorText = /par\s+[A-Z][a-z]{2,}|by\s+[A-Z][a-z]+|r.dig. par|written by/.test(html);
  if (hasAuthorPage || hasAuthorSchema || hasAuthorText) { score += 3; details.push(`${e.authorId} ✓`); }
  if (html.includes('"Organization"') || html.includes('"Person"') || (directHtml && (directHtml.includes('"Organization"') || directHtml.includes('"Person"')))) { score += 3; details.push(`${e.schemaOrgPerson} ✓`); }
  return { score: Math.min(score, 15), max: 15, detail: details.slice(0, 3).join(' · ') };
}

function scoreCrawlability($, html, locale = 'fr', directHtml = '') {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];
  score += 1;
  const htmlTextLength = $('body').text().replace(/\s+/g, ' ').trim().length;
  const textLength = htmlTextLength > 100 ? htmlTextLength : html.replace(/\s+/g, ' ').trim().length;
  if (textLength > 3000) { score += 4; details.push(`${textLength} chars ✓`); }
  else if (textLength > 1000) { score += 3; details.push(`${textLength} chars`); }
  else if (textLength > 500) { score += 1; details.push(`${textLength} chars`); }
  else details.push(`${e.contentTooShort} ✗`);
  const hasLang = $('html[lang]').length > 0 || (directHtml && directHtml.includes('lang='));
  if (hasLang) { score += 2; details.push(`${e.langDefined} ✓`); }
  const hasCanonical = $('link[rel="canonical"]').length > 0 || (directHtml && directHtml.includes('rel="canonical"'));
  if (hasCanonical) { score += 2; details.push('Canonical ✓'); }
  const metaRobots = $('meta[name="robots"]').attr('content') || '';
  if (!metaRobots.includes('noindex')) { score += 3; details.push(`${e.indexable} ✓`); }
  else details.push(`${e.noindexDetected} ✗`);
  if (html.includes('sitemap') || (directHtml && directHtml.includes('sitemap'))) { score += 2; details.push(`${e.sitemapFound} ✓`); }
  if (html.includes('GPTBot') || html.includes('OAI-SearchBot') || html.includes('ClaudeBot')) {
    score += 1; details.push(`${e.aiBotsFound} ✓`);
  }
  return { score: Math.min(score, 15), max: 15, detail: details.slice(0, 3).join(' · ') };
}

function scoreStructuredData($, html, locale = 'fr') {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];
  const semanticCount = $('nav, main, article, section, header, footer').length;
  if (semanticCount >= 3) { score += 2; details.push(`${e.semanticHtml} ✓`); }
  else if (semanticCount >= 1) { score += 1; details.push(e.partialSemantic); }
  const schemaTypes = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      if (data['@type']) { const types = Array.isArray(data['@type']) ? data['@type'] : [data['@type']]; types.forEach(t => { if (t && !schemaTypes.includes(t)) schemaTypes.push(t); }); }
      if (Array.isArray(data['@graph'])) { data['@graph'].forEach(item => { if (item['@type']) { const types = Array.isArray(item['@type']) ? item['@type'] : [item['@type']]; types.forEach(t => { if (t && !schemaTypes.includes(t)) schemaTypes.push(t); }); } }); }
    } catch {}
  });
  if (schemaTypes.length === 0) {
    const rawTypeMatches = html.match(/"@type"\s*:\s*"([^"]+)"/g) || [];
    rawTypeMatches.forEach(m => { const tt = m.match(/"@type"\s*:\s*"([^"]+)"/)?.[1]; if (tt && !schemaTypes.includes(tt)) schemaTypes.push(tt); });
  }
  const highValueTypes = ['FAQPage', 'QAPage', 'HowTo', 'Article', 'BlogPosting', 'SoftwareApplication', 'WebApplication', 'MobileApplication'];
  const medValueTypes = ['Organization', 'Corporation', 'LocalBusiness', 'GovernmentOrganization', 'EducationalOrganization', 'Person', 'Product', 'Service', 'WebSite', 'FinancialProduct', 'Event', 'Course', 'Recipe', 'JobPosting', 'VideoObject', 'Restaurant', 'Dentist', 'Physician', 'Attorney', 'LegalService', 'RealEstateAgent', 'Store', 'AutoRepair', 'MedicalBusiness', 'FinancialService', 'InsuranceAgency', 'TravelAgency', 'FoodEstablishment', 'HealthAndBeautyBusiness', 'SportsActivityLocation'];
  const hasHighValue = schemaTypes.some(st => highValueTypes.includes(st));
  const hasMedValue = schemaTypes.some(st => medValueTypes.includes(st));
  if (hasHighValue) { score += 5; details.push(`${e.schemaPrio} ${schemaTypes.filter(st => highValueTypes.includes(st)).join(', ')} ✓`); }
  if (hasMedValue) { score += 3; details.push(`${e.schemaEntity} ${schemaTypes.filter(st => medValueTypes.includes(st)).join(', ')} ✓`); }
  if (schemaTypes.length > 0 && !hasHighValue && !hasMedValue) { score += 1; details.push(`Schema: ${schemaTypes[0]}`); }
  if (schemaTypes.length === 0) details.push(`${e.noSchema} ✗`);
  return { score: Math.min(score, 10), max: 10, detail: details.slice(0, 2).join(' · ') || `${e.noSchema}` };
}

function scoreExternalPresence($, html, locale = 'fr', directMeta = {}) {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];
  const htmlExtLinks = [];
  $('a[href]').each((_, el) => { const href = $(el).attr('href') || ''; if (href.startsWith('http')) htmlExtLinks.push(href.toLowerCase()); });
  const externalLinks = htmlExtLinks.length > 0 ? htmlExtLinks : mdExternalLinks(html, null).map(l => l.toLowerCase());
  if (externalLinks.length > 0) { score += 1; details.push(`${e.extLinksPresent} ✓`); }
  if (/\bpresse\b|m[eé]dia|vu dans|as seen in/i.test(html)) { score += 2; details.push(`${e.pressMentions} ✓`); }
  const socialTrackingExclude = ['analytics.twitter', 'platform.twitter', 'ads.twitter', 'adsct', 'connect.facebook', 'staticxx.facebook', '/intent/', '/sharer/', '/widgets/', '/share?', '/share.php'];
  const hasSocial = externalLinks.some(l => (l.includes('linkedin') || l.includes('twitter') || l.includes('x.com') || l.includes('facebook') || l.includes('instagram') || l.includes('youtube') || l.includes('tiktok.com') || l.includes('snapchat.com') || l.includes('pinterest.com') || l.includes('threads.net')) && !socialTrackingExclude.some(e => l.includes(e)))
    || (directMeta.socialLinks && directMeta.socialLinks.length > 0);
  if (hasSocial) { score += 2; details.push(`${e.socialMedia} ✓`); }
  if (/t.moignage|avis client|review|testimonial/i.test(html)) { score += 1; details.push(`${e.testimonials} ✓`); }
  if (details.length === 0) details.push(e.lowExtPresence);
  return { score: Math.min(score, 5), max: 5, detail: details.join(' · ') };
}

function scoreFreshness($, html, locale = 'fr') {
  const e = EV[locale] || EV.fr;
  let score = 0;
  const details = [];
  const currentYear = new Date().getFullYear();
  if (/\b20[12]\d\b/.test(html)) { score += 1; details.push(e.yearPresent); }
  const recentYearRegex = new RegExp(`\\b(${currentYear}|${currentYear - 1})\\b`);
  if (recentYearRegex.test(html)) { score += 1; details.push(`${e.recentContent} (${currentYear}) ✓`); }
  else details.push(`${e.possiblyOutdated} ✗`);
  if (html.includes('dateModified')) { score += 2; details.push(`${e.dateModified} ✓`); }
  const copyrightMatch = new RegExp(`(©|Copyright)\\s*${currentYear}`, 'i').test(html);
  if (copyrightMatch) { score += 1; details.push(`${e.copyrightCurrent} ✓`); }
  if (!copyrightMatch) {
    const rangeMatch = new RegExp(`(©|Copyright)\\s*\\d{4}\\s*[-–—]\\s*${currentYear}`, 'i').test(html);
    if (rangeMatch) { score += 1; details.push(`${e.copyrightCurrent} ✓`); }
  }
  return { score: Math.min(score, 5), max: 5, detail: details.join(' · ') || e.possiblyOutdated };
}

module.exports = {
  scoreExtractibility,
  scoreVerifiability,
  scoreAuthority,
  scoreCrawlability,
  scoreStructuredData,
  scoreExternalPresence,
  scoreFreshness,
  EV,
};
