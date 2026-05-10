import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import axios from 'axios';
import * as cheerio from 'cheerio';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = { maxDuration: 120 };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 120000 });
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CACHE_DURATION = 24 * 60 * 60;

const { mdHeadings, mdExternalLinks, mdAllLinks, jinaTitle, jinaDescription } = require('../../lib/markdownHelpers');
const { runRealCitationTest } = require('../../lib/citationTest');

// ─── Evidence detail strings by locale ────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────

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
  const htmlListCount = $('ul li, ol li').length;
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
  const numbers = text.match(/\d+[.,]?\d*\s*(%|€|\$|k|M|pts?|points?|fois|times|ans?|years?|mois|months?|jours?|days?)/gi) || [];
  if (numbers.length >= 5) { score += 5; details.push(`${numbers.length} ${e.dataPoints} ✓`); }
  else if (numbers.length >= 2) { score += 3; details.push(`${numbers.length} ${e.dataPoints}`); }
  else if (numbers.length >= 1) { score += 1; details.push(`${numbers.length} ${e.dataPoint}`); }
  else details.push(`${e.fewData} ✗`);
  const htmlExtLinks = [];
  $('a[href]').each((_, el) => { const href = $(el).attr('href') || ''; if (href.startsWith('http')) htmlExtLinks.push(href); });
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
  const hasAuthorSchema = html.includes('"author"') || html.includes('rel="author"');
  const hasAuthorText = /par\s+[A-Z][a-z]+|by\s+[A-Z][a-z]+|r.dig. par|written by/i.test(html);
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
  // Check lang, canonical, robots in both Jina and direct HTML
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
      if (data['@type']) schemaTypes.push(data['@type']);
      if (Array.isArray(data['@graph'])) { data['@graph'].forEach(item => { if (item['@type']) schemaTypes.push(item['@type']); }); }
    } catch {}
  });
  if (schemaTypes.length === 0) {
    const rawTypeMatches = html.match(/"@type"\s*:\s*"([^"]+)"/g) || [];
    rawTypeMatches.forEach(m => { const tt = m.match(/"@type"\s*:\s*"([^"]+)"/)?.[1]; if (tt && !schemaTypes.includes(tt)) schemaTypes.push(tt); });
  }
  const highValueTypes = ['FAQPage', 'QAPage', 'HowTo', 'Article', 'BlogPosting', 'SoftwareApplication', 'WebApplication', 'MobileApplication'];
  const medValueTypes = ['Organization', 'Corporation', 'LocalBusiness', 'GovernmentOrganization', 'EducationalOrganization', 'Person', 'Product', 'Service', 'WebSite', 'FinancialProduct', 'Event', 'Course', 'Recipe', 'JobPosting', 'VideoObject'];
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
  if (/presse|m.dia|press|featured|vu dans|as seen/i.test(html)) { score += 2; details.push(`${e.pressMentions} ✓`); }
  // Check social links from Jina content OR direct HTML fetch (exclude tracking pixels)
  const socialTrackingExclude = ['analytics.twitter', 'platform.twitter', 'ads.twitter', 'adsct', 'connect.facebook', 'staticxx.facebook'];
  const hasSocial = externalLinks.some(l => (l.includes('linkedin') || l.includes('twitter') || l.includes('x.com') || l.includes('facebook') || l.includes('instagram') || l.includes('youtube')) && !socialTrackingExclude.some(e => l.includes(e)))
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
  if (new RegExp(`©\\s*${currentYear}`).test(html)) { score += 1; details.push(`${e.copyrightCurrent} ✓`); }
  return { score: Math.min(score, 5), max: 5, detail: details.join(' · ') || e.possiblyOutdated };
}

async function collectEvidence($, textContent, rawContent, url, directMeta = {}) {
  console.log('collectEvidence URL:', url);
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

  // 1. intro
  const intro = textContent.slice(0, 300);

  // 2. headings — HTML or markdown fallback
  const headings = [];
  $('h1, h2, h3').each((_, el) => {
    const level = el.tagName.toLowerCase();
    const text = $(el).text().trim();
    if (text) headings.push({ level, text });
  });
  if (headings.length === 0) {
    mdHeadings(rawContent).forEach(h => headings.push(h));
  }

  // 3. metaTitle & metaDescription — HTML, directMeta, or Jina header fallback
  const metaTitle = $('title').first().text().trim() || directMeta.title || jinaTitle(rawContent) || '';
  const metaDescription = $('meta[name="description"]').attr('content') || directMeta.description || jinaDescription(rawContent) || '';

  // 4. wordCount
  const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;

  // 5. schemas with properties
  const schemas = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      const processSchema = (obj) => {
        if (obj && obj['@type']) {
          schemas.push({
            type: obj['@type'],
            properties: Object.keys(obj).filter(k => !k.startsWith('@')),
          });
        }
        if (Array.isArray(obj['@graph'])) obj['@graph'].forEach(processSchema);
      };
      processSchema(data);
    } catch {}
  });

  // 6. socialLinks — HTML or markdown fallback, enriched with directMeta
  const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com'];
  const socialExclude = ['analytics.twitter', 'platform.twitter', '/intent/', 'ads.twitter', 'adsct', '/widgets/', 'connect.facebook', 'staticxx.facebook'];
  const socialLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http') && socialDomains.some(d => href.includes(d)) && !socialExclude.some(e => href.includes(e)) && !socialLinks.includes(href)) {
      socialLinks.push(href);
    }
  });
  if (socialLinks.length === 0) {
    mdExternalLinks(rawContent, null).forEach(href => {
      if (socialDomains.some(d => href.includes(d)) && !socialExclude.some(e => href.includes(e)) && !socialLinks.includes(href)) socialLinks.push(href);
    });
  }
  // Merge social links from direct HTML fetch (Jina often misses footer links)
  if (directMeta.socialLinks) {
    directMeta.socialLinks.forEach(href => {
      if (!socialLinks.includes(href)) socialLinks.push(href);
    });
  }

  // 7. images — HTML tags or direct HTML fetch fallback
  let totalImages = $('img').length;
  let imagesWithAlt = $('img[alt]').filter((_, el) => ($(el).attr('alt') || '').trim().length > 0).length;
  // Markdown image fallback: count ![alt](url) patterns
  if (totalImages === 0) {
    const mdImages = rawContent.match(/!\[([^\]]*)\]\([^)]+\)/g) || [];
    totalImages = mdImages.length;
    imagesWithAlt = mdImages.filter(m => { const alt = m.match(/!\[([^\]]*)\]/)?.[1]; return alt && alt.trim().length > 0; }).length;
  }
  // Direct HTML fallback
  if (totalImages === 0 && directMeta.imageCount > 0) {
    totalImages = directMeta.imageCount;
    imagesWithAlt = directMeta.imagesWithAlt;
  }
  const images = { withAlt: imagesWithAlt, total: totalImages };

  // 8. externalLinks count — HTML or markdown fallback
  let externalLinksCount = 0;
  try {
    const hostname = new URL(normalizedUrl).hostname;
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.startsWith('http') && !href.includes(hostname)) externalLinksCount++;
    });
    if (externalLinksCount === 0) {
      externalLinksCount = mdExternalLinks(rawContent, hostname).length;
    }
  } catch {}

  // 9. dates
  const dates = {};
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      if (data.datePublished) dates.datePublished = data.datePublished;
      if (data.dateModified)  dates.dateModified  = data.dateModified;
    } catch {}
  });
  const copyrightMatch = rawContent.match(/©\s*(20[12]\d)/);
  if (copyrightMatch) dates.copyright = copyrightMatch[1];
  const yearMatch = textContent.match(/\b(20[12]\d)\b/);
  if (yearMatch) dates.yearFound = yearMatch[1];

  // 10. robots.txt + llms.txt — parallel fetches with hard 2s deadline
  const robotsLlmsPromise = Promise.race([
    (async () => {
      const origin = new URL(normalizedUrl).origin;
      const [robotsRes, llmsRes] = await Promise.allSettled([
        axios.get(`${origin}/robots.txt`, { timeout: 2000 }),
        axios.get(`${origin}/llms.txt`,   { timeout: 2000 }),
      ]);
      return {
        robotsTxt: robotsRes.status === 'fulfilled' ? String(robotsRes.value.data || '').slice(0, 500) : 'Non accessible',
        hasLlmsTxt: llmsRes.status === 'fulfilled' && llmsRes.value.status === 200,
      };
    })(),
    new Promise(resolve => setTimeout(() => resolve({ robotsTxt: 'Non accessible (timeout)', hasLlmsTxt: false }), 2000)),
  ]);
  const { robotsTxt: rt, hasLlmsTxt: lt } = await robotsLlmsPromise;
  const robotsTxt = rt;
  const hasLlmsTxt = lt;

  // 11. Internal trust links (E-E-A-T signals on other pages)
  const trustPathPatterns = /\/(equipe|l-equipe|notre-equipe|team|our-team|about|about-us|a-propos|qui-sommes-nous|who-we-are|professeurs|instructeurs|teachers|instructors|coaches|experts|staff|membres|histoire|our-story|notre-histoire|mentions-legales|legal|imprint|contact)(\/|$|\?|#)/i;
  const trustTextPatterns = /notre\s+[eé]quipe|l['\u2019][eé]quipe|nos\s+professeurs|nos\s+instructeurs|nos\s+experts|nos\s+coachs|[aà]\s+propos|qui\s+sommes[- ]nous|notre\s+histoire|about\s+us|our\s+team|meet\s+the\s+team|our\s+story|who\s+we\s+are|\bteam\b|\bcoaches\b|\binstructors\b|\bexperts\b|\bstaff\b/i;
  const internalTrustLinks = [];
  const seenUrls = new Set();
  let siteHostnameForTrust;
  try { siteHostnameForTrust = new URL(normalizedUrl).hostname; } catch { siteHostnameForTrust = ''; }

  // Scan both Jina $ and direct HTML for trust links (Jina often strips footer)
  const scanTrustLinks = (cheerioInstance) => {
    cheerioInstance('a[href]').each((_, el) => {
      if (internalTrustLinks.length >= 8) return false;
      const href = (cheerioInstance(el).attr('href') || '').trim();
      const label = cheerioInstance(el).text().trim().slice(0, 80);
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      let fullUrl;
      try { fullUrl = new URL(href, normalizedUrl); if (fullUrl.hostname !== siteHostnameForTrust) return; } catch { return; }
      if (fullUrl.pathname === new URL(normalizedUrl).pathname) return;
      const urlStr = fullUrl.href;
      if (seenUrls.has(urlStr)) return;
      if (trustPathPatterns.test(fullUrl.pathname) || trustTextPatterns.test(label)) {
        seenUrls.add(urlStr);
        internalTrustLinks.push({ url: urlStr, label: label || fullUrl.pathname });
      }
    });
  };
  scanTrustLinks($);
  // Also scan direct HTML if available (catches footer links Jina strips)
  if (directMeta._$raw) scanTrustLinks(directMeta._$raw);

  return {
    intro,
    headings,
    metaTitle,
    metaDescription,
    wordCount,
    schemas,
    robotsTxt,
    socialLinks,
    hasLlmsTxt,
    images,
    externalLinks: externalLinksCount,
    dates,
    internalTrustLinks,
  };
}

function detectSiteType(url, textContent, $) {
  const u = url.toLowerCase();
  const t = textContent.toLowerCase();
  const hostname = (() => { try { return new URL(url).hostname.toLowerCase(); } catch { return ''; } })();

  // E-commerce signals
  if ($('script[type="application/ld+json"]').text().includes('"Product"') ||
      /panier|cart|add.to.cart|acheter|buy.now|ajouter.au.panier|prix|price|\bshop\b|boutique|produit|product/i.test(t.slice(0, 2000)) ||
      /shop\.|store\.|boutique/i.test(hostname)) return 'ecommerce';

  // SaaS signals
  if (/pricing|tarif|plan.gratuit|free.plan|start.free|essai.gratuit|free.trial|sign.up|s.inscrire|dashboard|api|integrations|saas/i.test(t.slice(0, 3000)) ||
      /\.app$|\.io$|\.dev$|\.tools$|\.ai$|\.co$/.test(hostname)) return 'saas';

  // Blog / media
  if (/blog\.|magazine\.|journal\.|news\.|media\./i.test(hostname) ||
      $('article').length >= 2 || (t.match(/publi[eé]|posted|written by|par\s+[A-Z]/g) || []).length >= 3) return 'blog';

  // Agency / services
  if (/agence|agency|cabinet|conseil|consulting|studio|freelance|prestation|nos.services|our.services|expertise/i.test(t.slice(0, 2000))) return 'agency';

  // Local business
  if (/horaires|opening.hours|ouverture|rendez-vous|appointment|nous.trouver|find.us|adresse|visite/i.test(t.slice(0, 2000)) &&
      /restaurant|salon|clinique|cabinet|garage|boulangerie|coiffeur|dentiste|m[eé]decin/i.test(t)) return 'local';

  // Corporate
  if (/investor|actionnaire|shareholders|rapport.annuel|annual.report|nos.engagements|our.mission|careers|recrutement/i.test(t.slice(0, 3000))) return 'corporate';

  return 'generic';
}

function getRecommendedSchemas(siteType, existingSchemas) {
  const schemaMap = {
    ecommerce: ['Product', 'AggregateRating', 'FAQPage', 'BreadcrumbList', 'Offer'],
    saas: ['SoftwareApplication', 'FAQPage', 'HowTo', 'Service', 'Organization'],
    blog: ['Article', 'BlogPosting', 'FAQPage', 'BreadcrumbList', 'Person'],
    agency: ['Service', 'FAQPage', 'Organization', 'Person', 'HowTo'],
    local: ['LocalBusiness', 'FAQPage', 'Review', 'PostalAddress', 'OpeningHoursSpecification'],
    corporate: ['Organization', 'FAQPage', 'Article', 'Person', 'WebSite'],
    generic: ['Organization', 'FAQPage', 'WebSite', 'BreadcrumbList', 'Article'],
  };
  const recommended = schemaMap[siteType] || schemaMap.generic;
  const existing = existingSchemas.map(s => s.toLowerCase());
  return recommended.filter(s => !existing.some(e => e.toLowerCase() === s.toLowerCase()));
}

async function runClaudeAnalysis(url, textContent, scores, locale = 'fr', detectedSignals = '', siteType = 'generic', missingSchemas = []) {
  const total = Object.values(scores).reduce((s, c) => s + c.score, 0);

  // All criteria below 80% threshold, sorted by worst score first
  const criteriaBelow = [
    { key: 'extractibility', label: 'Extractibilité', max: 25 },
    { key: 'verifiability', label: 'Vérifiabilité', max: 20 },
    { key: 'authority', label: 'Autorité E-E-A-T', max: 15 },
    { key: 'crawlability', label: 'Crawlabilité IA', max: 15 },
    { key: 'structuredData', label: 'Données structurées', max: 10 },
    { key: 'externalPresence', label: 'Présence externe', max: 5 },
    { key: 'freshness', label: 'Fraîcheur', max: 5 },
  ]
    .filter(c => scores[c.key].score / c.max < 0.8)
    .sort((a, b) => (scores[a.key].score / a.max) - (scores[b.key].score / b.max));

  const criteriaList = criteriaBelow.map(c =>
    `- ${c.label} : ${scores[c.key].score}/${c.max} — ${scores[c.key].detail}`
  ).join('\n');

  const langInstruction = locale === 'en'
    ? `OUTPUT LANGUAGE: English (US). ALL text values in the JSON (verdict, recommendations, strengths, topPriority, neutralityDetail) MUST be in American English. Use natural, direct, conversational phrasing.
CRITICAL: The "criterion" field MUST always use the FRENCH criterion name from this exact list (used as a matching key in the frontend): 'Extractibilité & réponse directe', 'Vérifiabilité & preuves', 'Autorité & E-E-A-T', 'Crawlabilité IA', 'Données structurées', 'Neutralité éditoriale', 'Présence externe', 'Fraîcheur & maintenance'.`
    : `LANGUE DE SORTIE : Français. Toutes les valeurs texte du JSON doivent être en français professionnel et direct.
CRITICAL: The "criterion" field MUST always use a name from this exact list: 'Extractibilité & réponse directe', 'Vérifiabilité & preuves', 'Autorité & E-E-A-T', 'Crawlabilité IA', 'Données structurées', 'Neutralité éditoriale', 'Présence externe', 'Fraîcheur & maintenance'. No other criterion name is allowed.`;

  const today = new Date().toISOString().split('T')[0];
  const prompt = `${langInstruction}

TODAY'S DATE: ${today}. The year 2026 is the CURRENT year. Dates in 2026 are RECENT, NOT future.

${locale === 'en'
? `VOCABULARY CALIBRATION (mandatory):
<30% = catastrophic | 30-50% = poor | 50-70% = average | 70-85% = good | >85% = excellent
FORBIDDEN above 50%: catastrophic, severe, critical gap, failing, alarming.
Above 50%, acceptable words: average, needs improvement, room for improvement, insufficient, moderate.`
: `VOCABULARY CALIBRATION (mandatory):
<30% = catastrophique | 30-50% = faible | 50-70% = moyen | 70-85% = bon | >85% = excellent
FORBIDDEN above 50%: catastrophique, grave, lacune critique, défaillant, alarmant.
Above 50%, acceptable words: moyen, à améliorer, perfectible, insuffisant, modéré.`}

You are a senior GEO consultant. Audit ${url}.

URL: ${url}
SCORE: ${total}/100
SITE TYPE DETECTED: ${siteType}
CRITERIA BELOW THRESHOLD:
${criteriaList}

CONTENT (first 300 characters):
${textContent.slice(0, 300)}

${detectedSignals ? `ALREADY DETECTED ON THIS PAGE (do NOT recommend adding elements already present):\n${detectedSignals}\n` : ''}${missingSchemas.length > 0 ? `MISSING SCHEMAS FOR THIS SITE TYPE (${siteType}): ${missingSchemas.join(', ')}\n` : ''}
RULES:
1. Generate EXACTLY 8 recommendations: 1 per criterion below threshold + 1 for Editorial Neutrality.
2. Be SPECIFIC to this site. Reference actual elements found (or missing) in the analyzed content.
3. Use nuanced phrasing. Prefer "not identified in the analyzed content" over absolute statements. Acknowledge scraping may be partial.
4. STRUCTURED DATA RECOMMENDATION RULES (CRITICAL — avoid repetitive schema advice):
   - Site type is "${siteType}".
   - If the site has NO schemas at all (score 0/10): recommend adding the most impactful schema for this site type. Name the EXACT type (e.g., "Add FAQPage schema to your pricing page", not "Add structured data").
   - If the site ALREADY HAS basic schemas (score 3+/10, e.g., Organization or WebSite already present): do NOT recommend "adding more schemas". Instead, focus on one of these ALTERNATIVE structured data improvements:
     * Enrich existing schema properties (add missing fields like foundingDate, founder, sameAs, address to Organization)
     * Improve HTML semantics (replace generic <div> with <article>, <section>, <nav>, <aside> — AI parses semantic HTML better)
     * Add structured headings hierarchy (proper H1 → H2 → H3 nesting for better content parsing)
     * Add microdata or structured content patterns (definition lists for specs, comparison tables, step-by-step with numbered lists)
     * Add BreadcrumbList for navigation context
   - The title MUST reflect the specific advice, not a generic "add schemas" or "improve structured data". Examples: "Enrich Organization schema properties", "Semantic HTML for AI parsing", "Add breadcrumb navigation markup".
5. VERDICT RULES: Start with what makes this site UNIQUE (industry, positioning, specific strength or weakness). Do NOT start with "the site has a solid base but needs schemas" — that's generic. Focus on the most distinctive finding. If the score seems low due to scraping limits, mention it.
6. TOP PRIORITY SELECTION — Pick the ONE action with the best impact × effort × context trade-off. Prefer quick wins (2-4 weeks, low effort) over major overhauls. Do NOT always pick the lowest-scoring criterion.
7. FIELD LENGTH RULES:
   - "problem": 3-5 dense sentences. Describe what was found (or missing), WHY it blocks AI citation (concrete mechanism), and the observable consequence if not fixed.
   - "solution": 3-5 sentences. Clear action description and why it solves the problem.
   - "technicalImplementation": 2-4 numbered steps, actionable enough for a developer or marketing manager to execute without additional research.
   - "codeExample": Real code snippet (JSON-LD, HTML, meta tag) when relevant. Set to null for editorial-only recommendations.
8. IMPACT/EFFORT/TIMEFRAME RULES:
   - impact: based on expected visibility gain (high = major, medium = noticeable, low = incremental)
   - effort: based on technical complexity (low = add a tag, medium = restructure content, high = major overhaul)
   - timeframe: ${locale === 'en' ? '"1-2 weeks" for quick fixes, "1 month" for medium work, "2-3 months" for complex projects' : '"1-2 sem" for quick fixes, "1 mois" for medium work, "2-3 mois" for complex projects'}

JSON only, no markdown:
{"neutralityScore":<0-10>,"neutralityDetail":"<1 sentence>","recommendations":[{"priority":"high|medium|low","impact":"high|medium|low","effort":"low|medium|high","timeframe":"${locale === 'en' ? '1-2 weeks|1 month|2-3 months' : '1-2 sem|1 mois|2-3 mois'}","criterion":"<French criterion name>","title":"<6 words max>","problem":"<3-5 sentences>","solution":"<3-5 sentences>","technicalImplementation":"<2-4 numbered steps>","codeExample":"<code snippet or null>"}],"verdict":"<1 sentence>","strengths":["<1 sentence>","<1 sentence>"],"topPriority":"<1 sentence>"}`;

  const message = await client.messages.create({
    model: 'claude-4-sonnet-20250514',
    max_tokens: 8192,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  });

  if (message.stop_reason !== 'end_turn') {
    throw new Error(`Claude response truncated (stop_reason: ${message.stop_reason})`);
  }

  const raw = message.content[0].text;
  // Extract JSON even if there's surrounding text
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in Claude response');
  return JSON.parse(jsonMatch[0]);
}

async function runCitationTest(url, textContent, metaTitle, metaDescription, locale = 'fr') {
  const hostname = new URL(url).hostname.replace(/^www\./, '');
  const brand = metaTitle ? metaTitle.split(/[-|–·]/)[0].trim() : hostname;
  const intro = textContent.slice(0, 300);

  const userContext = locale === 'en'
    ? 'User context: American users searching in English on ChatGPT/Perplexity. Generate queries naturally in English as a US user would phrase them.'
    : 'Contexte utilisateur : utilisateurs français recherchant en français sur ChatGPT/Perplexity. Génère les requêtes naturellement en français.';

  const langInstruction = locale === 'en'
    ? 'OUTPUT LANGUAGE: English (US). ALL text values (queries, recommendations, excerpts, summary) MUST be in American English.'
    : 'LANGUE DE SORTIE : Français. Toutes les valeurs texte doivent être en français.';

  const difficultyValues = locale === 'en'
    ? { generic: 'generic', niche: 'niche', longTail: 'long_tail', easy: 'easy', medium: 'medium', hard: 'hard' }
    : { generic: 'générique', niche: 'niche', longTail: 'longue_traîne', easy: 'facile', medium: 'moyen', hard: 'difficile' };

  const prompt = `${langInstruction}
${userContext}

You are an AI visibility expert. We are analyzing the site ${url}. Title: ${brand}. Description: ${metaDescription || 'Not available'}. First 300 characters of content: ${intro}

Step 1 — Generate 10 queries that users would ask ChatGPT or Perplexity and for which this site SHOULD appear. Vary difficulty levels:
- 3 ${difficultyValues.generic} queries (high competition)
- 4 ${difficultyValues.niche} queries (medium competition)
- 3 ${difficultyValues.longTail} queries (low competition)

Step 2 — For EACH query, simulate the response an AI engine (ChatGPT/Perplexity) would give. Cite the sources you would naturally recommend.

Step 3 — For EACH query, analyze whether the site ${hostname} or the brand "${brand}" appears in your response, which competitors are cited instead, and the estimated difficulty to get cited (${difficultyValues.easy}/${difficultyValues.medium}/${difficultyValues.hard}).

Reply ONLY in JSON without markdown:
{"tests":[{"query":"","difficulty":"${difficultyValues.generic}|${difficultyValues.niche}|${difficultyValues.longTail}","cited":false,"competitors_cited":[],"difficulty_to_rank":"${difficultyValues.easy}|${difficultyValues.medium}|${difficultyValues.hard}","recommendation":"1 concrete sentence","ai_response_excerpt":"first 150 characters of the simulated response"}],"summary":{"cited_count":0,"total_tests":10,"best_opportunity":"query where the site has the best chance","main_blocker":"main reason"}}`;

  const message = await client.messages.create({
    model: 'claude-4-sonnet-20250514',
    max_tokens: 5000,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  return JSON.parse(jsonMatch[0]);
}

async function fetchJina(jinaUrl) {
  const attempts = [
    { timeout: 20000, waitBefore: 0 },
    { timeout: 20000, waitBefore: 2000 },
    { timeout: 25000, waitBefore: 5000 },
  ];

  let lastError;
  for (const attempt of attempts) {
    if (attempt.waitBefore > 0) await new Promise(r => setTimeout(r, attempt.waitBefore));
    try {
      const jinaHeaders = { Accept: 'text/html' };
      if (process.env.JINA_API_KEY) jinaHeaders.Authorization = `Bearer ${process.env.JINA_API_KEY}`;
      const { data } = await axios.get(jinaUrl, {
        headers: jinaHeaders,
        timeout: attempt.timeout,
      });
      return { data, source: 'jina' };
    } catch (err) {
      lastError = err;
      console.log(`Jina attempt failed (timeout ${attempt.timeout}ms):`, err.message);
    }
  }

  // Fallback: direct HTML fetch
  console.log('Jina totally failed, attempting direct HTML fallback');
  const directUrl = jinaUrl.replace('https://r.jina.ai/', '');
  try {
    const { data } = await axios.get(directUrl, {
      timeout: 15000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DetekiaBot/1.0; +https://detekia.fr)',
      },
    });
    const $fallback = cheerio.load(data);
    $fallback('script, style, nav, footer').remove();
    const title = $fallback('title').text() || $fallback('h1').first().text() || '';
    const description = $fallback('meta[name="description"]').attr('content') || '';
    const bodyText = $fallback('body').text().replace(/\s+/g, ' ').trim();
    const fallbackContent = `Title: ${title}\n\nURL Source: ${directUrl}\n\nDescription: ${description}\n\nMarkdown Content:\n${bodyText}`;
    return { data: fallbackContent, source: 'direct' };
  } catch (directErr) {
    console.log('Direct fetch also failed:', directErr.message);
    throw lastError;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { checkRateLimit } = require('../../lib/rateLimit');
  if (!(await checkRateLimit('analyze', req, res))) return;

  const rawUrl = req.body.url;
  const locale = req.body.locale === 'en' ? 'en' : 'fr';
  const plan = req.body.plan || 'free'; // free=2, onepage=10, pro=30
  if (!rawUrl) return res.status(400).json({ error: 'URL manquante' });
  const urlCandidate = rawUrl.startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`;
  let url;
  try { const parsed = new URL(urlCandidate); if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error(); url = parsed.href; } catch { return res.status(400).json({ error: 'URL invalide' }); }
  console.log('analyze: starting for', url);

  const cacheKey = `detekia:v21:${url.toLowerCase()}:${locale}`;

  // Only use cache for free tier — paid reports always run fresh with full query count
  if (plan === 'free') {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`Cache hit : ${cacheKey}`);
        return res.status(200).json(cached);
      }
    } catch (e) {
      console.error('Cache read error:', e.message);
    }
  }

  try {
    const jinaUrl = `https://r.jina.ai/${url}`;

    // Fetch Jina content + raw HTML in parallel (raw HTML for JSON-LD schema detection)
    const [jinaResult, rawHtmlResult] = await Promise.allSettled([
      fetchJina(jinaUrl),
      axios.get(url, { timeout: 10000, maxRedirects: 5, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DetekiaBot/1.0; +https://detekia.fr)' } }).then(r => r.data).catch(() => null),
    ]);

    let rawContent, scrapeSource;
    if (jinaResult.status === 'fulfilled') {
      rawContent = jinaResult.value.data;
      scrapeSource = jinaResult.value.source;
    } else {
      // Jina failed — try to use direct HTML as fallback content
      const directFallback = rawHtmlResult.status === 'fulfilled' ? rawHtmlResult.value : null;
      if (directFallback && typeof directFallback === 'string') {
        const $fb = cheerio.load(directFallback);
        $fb('script, style').remove();
        const fbText = $fb('body').text().replace(/\s+/g, ' ').trim();
        if (fbText.length > 500) {
          console.log(`[analyze] Jina failed, using direct HTML fallback (${fbText.length} chars)`);
          rawContent = directFallback;
          scrapeSource = 'direct-fallback';
        }
      }
      // Last resort: Browserless headless Chrome
      if (!rawContent) {
        const { fetchRenderedHtml } = require('../../lib/browserless');
        const rendered = await fetchRenderedHtml(url);
        if (rendered) {
          const $br = cheerio.load(rendered);
          $br('script, style').remove();
          if ($br('body').text().replace(/\s+/g, ' ').trim().length > 500) {
            console.log(`[analyze] Using Browserless fallback for ${url}`);
            rawContent = rendered;
            scrapeSource = 'browserless';
          }
        }
      }
      if (!rawContent) throw jinaResult.reason;
    }

    const $ = cheerio.load(rawContent);
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();

    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
    if (textContent.length < 500 || wordCount < 100) {
      return res.status(422).json({ error: locale === 'en'
        ? 'Unable to analyze this site. Content too short or inaccessible (anti-bot protection, JavaScript-only rendering, or empty page).'
        : "Impossible d'analyser ce site. Contenu trop court ou inaccessible (protection anti-bot, rendu JavaScript uniquement, ou page vide)."
      });
    }

    // Enrich cheerio $ with data from direct HTML fetch (Jina strips scripts, meta, footer links)
    const directHtml = rawHtmlResult.status === 'fulfilled' ? rawHtmlResult.value : null;
    let directMeta = { description: '', title: '', socialLinks: [], imageCount: 0, imagesWithAlt: 0, _$raw: null };
    if (directHtml && typeof directHtml === 'string') {
      const $raw = cheerio.load(directHtml);
      directMeta._$raw = $raw;
      // 1. Inject JSON-LD scripts
      $raw('script[type="application/ld+json"]').each((_, el) => {
        const content = $raw(el).html();
        if (content) $('body').append(`<script type="application/ld+json">${content}</script>`);
      });
      // 2. Extract meta description (Jina often strips it)
      directMeta.description = $raw('meta[name="description"]').attr('content') || $raw('meta[property="og:description"]').attr('content') || '';
      directMeta.title = $raw('title').text().trim() || '';
      // 3. Extract social links (Jina strips footer)
      const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com'];
      const socialExclude = ['analytics.twitter', 'platform.twitter', '/intent/', 'ads.twitter', 'adsct', '/widgets/', 'connect.facebook', 'staticxx.facebook'];
      $raw('a[href]').each((_, el) => {
        const href = ($raw(el).attr('href') || '').trim();
        if (href.startsWith('http') && socialDomains.some(d => href.includes(d)) && !socialExclude.some(e => href.includes(e)) && !directMeta.socialLinks.includes(href)) {
          directMeta.socialLinks.push(href);
        }
      });
      // 4. Count images
      directMeta.imageCount = $raw('img').length;
      directMeta.imagesWithAlt = $raw('img[alt]').filter((_, el) => ($raw(el).attr('alt') || '').trim().length > 0).length;
    }

    const metaTitle = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || directMeta.title || jinaTitle(rawContent) || '';
    const metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || directMeta.description || jinaDescription(rawContent) || '';

    let siteHostname = null;
    try { siteHostname = new URL(url).hostname; } catch {}

    const scores = {
      extractibility:   scoreExtractibility($, textContent, rawContent, locale),
      verifiability:    scoreVerifiability($, textContent, rawContent, siteHostname, locale),
      authority:        scoreAuthority($, rawContent, locale, directHtml || ''),
      crawlability:     scoreCrawlability($, rawContent, locale, directHtml || ''),
      structuredData:   scoreStructuredData($, rawContent, locale),
      externalPresence: scoreExternalPresence($, rawContent, locale, directMeta),
      freshness:        scoreFreshness($, rawContent, locale),
    };

    // Build detected signals for prompt (prevent false absence claims)
    const signalParts = [];
    if (metaTitle) signalParts.push(`Meta title: "${metaTitle}"`);
    if (metaDescription) signalParts.push(`Meta description: "${metaDescription.substring(0, 80)}..."`);
    const detectedSchemas = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const d = JSON.parse($(el).html());
        if (d['@type']) detectedSchemas.push(d['@type']);
        if (Array.isArray(d['@graph'])) d['@graph'].forEach(item => { if (item['@type']) detectedSchemas.push(item['@type']); });
      } catch {}
    });
    if (detectedSchemas.length) signalParts.push(`JSON-LD schemas: ${detectedSchemas.join(', ')}`);
    else signalParts.push('JSON-LD schemas: NONE');
    const detectedSignals = signalParts.join('\n');

    // Detect site type and missing schemas for targeted recommendations
    const siteType = detectSiteType(url, textContent, $);
    const missingSchemas = getRecommendedSchemas(siteType, detectedSchemas);
    console.log(`[analyze] Site type: ${siteType}, schemas: [${detectedSchemas.join(', ')}], missing: [${missingSchemas.join(', ')}]`);

    const hostname = new URL(url).hostname.replace(/^www\./, '');
    const brand = metaTitle ? metaTitle.split(/[-|–·]/)[0].trim() : hostname;
    const intro = textContent.slice(0, 300);

    // Run analysis + evidence in parallel. Citation test: 2 free, 10 one-page, 30 pro
    const queryCount = plan === 'pro' ? 30 : plan === 'onepage' ? 10 : 2;
    const [claude, evidence, citationTest] = await Promise.all([
      runClaudeAnalysis(url, textContent, scores, locale, detectedSignals, siteType, missingSchemas),
      collectEvidence($, textContent, rawContent, url, directMeta),
      runRealCitationTest(url, hostname, brand, metaDescription, intro, queryCount, locale, client).catch(e => { console.error('citationTest error:', e.message); return null; }),
    ]);
    // Raw scores: 7 technical criteria (max 95) + neutrality (max 10) = max 105
    // Normalize to /100 for client-facing score
    const RAW_MAX = 105;
    const rawTotal = Object.values(scores).reduce((s, c) => s + c.score, 0) + (claude.neutralityScore || 0);
    const totalScore = Math.max(0, Math.min(100, Math.round((rawTotal / RAW_MAX) * 100)));

    // Regenerate verdict with final score (includes neutrality bonus)
    if (totalScore !== baseScore) {
      const verdictLang = locale === 'en'
        ? `OUTPUT LANGUAGE: English (US). Respond in American English only.`
        : `LANGUE DE SORTIE : Français.`;
      const verdictMsg = await client.messages.create({
        model: 'claude-4-sonnet-20250514',
        max_tokens: 150,
        temperature: 0.2,
        messages: [{ role: 'user', content: `${verdictLang}\nYou are a senior GEO consultant. The site ${url} gets a final score of ${totalScore}/100. Strengths: ${(claude.strengths || []).join(', ')}. Priority: ${claude.topPriority || 'none'}. Generate a verdict in 1 concise sentence. Reply ONLY with the sentence, no quotes, no JSON.` }],
      });
      claude.verdict = verdictMsg.content[0].text.trim();
    }

    // Sanity checks — detect likely scraping gaps
    const hasSubstantialContent = textContent.length > 1000;
    const sanityWarnings = [];
    if (hasSubstantialContent && scores.structuredData.score === 0) {
      sanityWarnings.push("Les données structurées n'ont peut-être pas été détectées si elles sont chargées en JavaScript côté client.");
    }
    if (hasSubstantialContent && scores.extractibility.score < 5) {
      sanityWarnings.push("Le score d'extractibilité est très bas — le contenu est peut-être rendu en JavaScript et partiellement inaccessible au scraper.");
    }

    const responseData = {
      score: totalScore,
      verdict: claude.verdict,
      strengths: claude.strengths || [],
      topPriority: claude.topPriority || '',
      criteria: [
        { name: 'Extractibilité & réponse directe', score: scores.extractibility.score, max: 25, detail: scores.extractibility.detail },
        { name: 'Vérifiabilité & preuves',          score: scores.verifiability.score,  max: 20, detail: scores.verifiability.detail },
        { name: 'Autorité & E-E-A-T',               score: scores.authority.score,      max: 15, detail: scores.authority.detail },
        { name: 'Crawlabilité IA',                  score: scores.crawlability.score,   max: 15, detail: scores.crawlability.detail },
        { name: 'Données structurées',              score: scores.structuredData.score,  max: 10, detail: scores.structuredData.detail },
        { name: 'Neutralité éditoriale',            score: claude.neutralityScore || 0,  max: 10, detail: claude.neutralityDetail },
        { name: 'Présence externe',                 score: scores.externalPresence.score, max: 5, detail: scores.externalPresence.detail },
        { name: 'Fraîcheur & maintenance',          score: scores.freshness.score,       max: 5, detail: scores.freshness.detail },
      ],
      recommendations: claude.recommendations,
      evidence,
      citationTest: citationTest || null,
      sanityWarnings: sanityWarnings.length > 0 ? sanityWarnings : undefined,
      scrapeSource,
    };

    await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: 'guillaume@beeleven.fr',
      subject: `🔍 Nouveau scan — ${url} — Score ${totalScore}/100`,
      html: `
        <div style="font-family: system-ui; max-width: 500px;">
          <h2 style="color: #1A1916;">Nouveau scan Detekia</h2>
          <p><strong>URL :</strong> ${url}</p>
          <p><strong>Score :</strong> ${totalScore}/100</p>
          <p><strong>Verdict :</strong> ${claude.verdict}</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <hr style="border: 1px solid #E5E2DC;" />
          <p style="color: #6B6762; font-size: 12px;">Détails des critères :</p>
          ${responseData.criteria.map(c =>
            `<p style="font-size: 12px; margin: 4px 0;"><strong>${c.name}</strong> : ${c.score}/${c.max}</p>`
          ).join('')}
        </div>
      `,
    }).catch(e => console.log('Admin notification failed:', e.message));

    res.status(200).json(responseData);

    // Only cache free tier results — paid reports have more citation queries
    if (plan === 'free') {
      redis.set(cacheKey, responseData, { ex: CACHE_DURATION })
        .catch(e => console.error('Cache write error:', e.message));
    }

  } catch (err) {
    console.error('Analysis error:', err.message);
    await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: 'guillaume@beeleven.fr',
      subject: `❌ Scan échoué — ${url}`,
      html: `
        <div style="font-family: system-ui; max-width: 500px;">
          <h2 style="color: #D97757;">Scan échoué</h2>
          <p><strong>URL :</strong> ${url}</p>
          <p><strong>Erreur :</strong> ${err.message}</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
    }).catch(e => console.log('Error notification failed:', e.message));
    res.status(500).json({ error: "Erreur lors de l'analyse", detail: err.message });
  }
}