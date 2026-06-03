import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import axios from 'axios';
import * as cheerio from 'cheerio';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = { maxDuration: 300 };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 120000 });
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CACHE_DURATION = 24 * 60 * 60;

const { mdHeadings, mdExternalLinks, mdAllLinks, jinaTitle, jinaDescription } = require('../../lib/markdownHelpers');

// Clean title from UI artifacts (SVG titles, loading states, icon names etc.)
function cleanTitle(raw) {
  if (!raw) return '';
  // Cut at common UI noise patterns
  return raw
    .replace(/(Close|Loading|Chevron|Basket|Underline|Icon|Arrow|Menu|Toggle|Spinner|Hamburger)\.\.\./gi, '')
    .replace(/(Close|Loading|Underline){2,}/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    // If still has noise after pipe/dash, truncate there
    .replace(/\|[^|]*(?:Close|Loading|Underline|Icon|Chevron|Basket|Menu).*/i, '')
    .trim();
}
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


const { scoreCitability, scoreVerifiability, scoreAuthority, scoreAccessibility, scoreExternalPresence, scoreFreshness, scoreNeutrality } = require('../../lib/scoring');

async function collectEvidence($, textContent, rawContent, url, directMeta = {}, prefetchedRobotsLlms = null) {
  console.log('collectEvidence URL:', url);
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

  // 1. intro
  const intro = textContent.slice(0, 300);

  // 2. headings — same logic as scoring: direct HTML if has headings, else Markdown
  const headings = [];
  if (directMeta._directHtml) {
    const cheerio = require('cheerio');
    const $fresh = cheerio.load(directMeta._directHtml);
    $fresh('h1, h2, h3').each((_, el) => {
      const level = el.tagName.toLowerCase();
      const text = $fresh(el).text().trim();
      if (text) headings.push({ level, text });
    });
  }
  if (headings.length === 0) {
    mdHeadings(rawContent).forEach(h => headings.push(h));
  }

  // 3. metaTitle & metaDescription — HTML, directMeta, or Jina header fallback
  const metaTitle = cleanTitle($('title').first().text().trim() || directMeta.title || jinaTitle(rawContent) || '');
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
  const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com', 'tiktok.com', 'snapchat.com', 'pinterest.com', 'threads.net'];
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

  // 7. images — HTML tags or direct HTML fetch fallback (exclude tracking pixels and inline SVG icons)
  const isRealImage = (el) => {
    const src = $(el).attr('src') || '';
    const width = parseInt($(el).attr('width') || '0', 10);
    const height = parseInt($(el).attr('height') || '0', 10);
    // Exclude tracking pixels (1x1 or 0x0)
    if ((width === 1 && height === 1) || (width === 0 && height === 0 && $(el).attr('width'))) return false;
    // Exclude inline data URIs that are tiny (tracking pixels)
    if (src.startsWith('data:') && src.length < 200) return false;
    // Exclude SVG files used as icons (typically very small)
    if (src.endsWith('.svg') && width > 0 && width <= 24 && height > 0 && height <= 24) return false;
    return true;
  };
  let totalImages = $('img').filter((_, el) => isRealImage(el)).length;
  let imagesWithAlt = $('img[alt]').filter((_, el) => isRealImage(el) && ($(el).attr('alt') || '').trim().length > 0).length;
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

  // 8. externalLinks count — HTML or markdown fallback, deduplicated by domain
  let externalLinksCount = 0;
  try {
    const hostname = new URL(normalizedUrl).hostname.replace(/^www\./, '');
    const seenExtDomains = new Set();
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href.startsWith('http')) return;
      try {
        const linkHost = new URL(href).hostname.replace(/^www\./, '');
        if (linkHost !== hostname && !seenExtDomains.has(linkHost)) {
          seenExtDomains.add(linkHost);
          externalLinksCount++;
        }
      } catch {}
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
  // Copyright: capture full range (e.g. "© 2016 – 2026" or "Copyright 2024")
  const copyrightRangeMatch = rawContent.match(/(?:©|Copyright)\s*(20[012]\d)\s*[-–—]\s*(20[012]\d)/i);
  const copyrightSingleMatch = rawContent.match(/(?:©|Copyright)\s*(20[012]\d)/i);
  if (copyrightRangeMatch) { dates.copyright = `${copyrightRangeMatch[1]}–${copyrightRangeMatch[2]}`; }
  else if (copyrightSingleMatch) { dates.copyright = copyrightSingleMatch[1]; }
  const yearMatch = textContent.match(/\b(20[12]\d)\b/);
  if (yearMatch) dates.yearFound = yearMatch[1];

  // 10. robots.txt + llms.txt — use prefetched results if available
  let robotsTxt, hasLlmsTxt;
  if (prefetchedRobotsLlms) {
    robotsTxt = prefetchedRobotsLlms.robotsTxt;
    hasLlmsTxt = prefetchedRobotsLlms.hasLlmsTxt;
  } else {
    const robotsLlmsPromise = Promise.race([
      (async () => {
        const origin = new URL(normalizedUrl).origin;
        const [robotsRes, llmsRes] = await Promise.allSettled([
          axios.get(`${origin}/robots.txt`, { timeout: 5000 }),
          axios.get(`${origin}/llms.txt`,   { timeout: 5000 }),
        ]);
        let robotsTxtValue = 'Non accessible';
        if (robotsRes.status === 'fulfilled') {
          const data = String(robotsRes.value.data || '').trim();
          robotsTxtValue = data ? data.slice(0, 500) : 'Fichier vide';
        } else {
          const status = robotsRes.reason?.response?.status;
          robotsTxtValue = status === 404 ? 'Aucun fichier robots.txt (404)' : 'Non accessible';
        }
        return { robotsTxt: robotsTxtValue, hasLlmsTxt: llmsRes.status === 'fulfilled' && llmsRes.value.status === 200 };
      })(),
      new Promise(resolve => setTimeout(() => resolve({ robotsTxt: 'Non accessible (timeout)', hasLlmsTxt: false }), 5000)),
    ]);
    const result = await robotsLlmsPromise;
    robotsTxt = result.robotsTxt;
    hasLlmsTxt = result.hasLlmsTxt;
  }

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

  // 12. Detect embedded content (iframes)
  const iframes = [];
  $('iframe[src]').each((_, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('youtube.com') || src.includes('youtu.be')) iframes.push('YouTube');
    if (src.includes('google.com/maps') || src.includes('maps.google')) iframes.push('Google Maps');
    if (src.includes('facebook.com')) iframes.push('Facebook');
    if (src.includes('tripadvisor')) iframes.push('TripAdvisor');
    if (src.includes('trustpilot')) iframes.push('Trustpilot');
    if (src.includes('instagram.com')) iframes.push('Instagram');
    if (src.includes('tiktok.com')) iframes.push('TikTok');
    if (src.includes('spotify.com')) iframes.push('Spotify');
    if (src.includes('calendly.com')) iframes.push('Calendly');
    if (src.includes('typeform.com')) iframes.push('Typeform');
  });
  // Also scan direct HTML for iframes (Jina strips iframes)
  if (directMeta._$raw) {
    directMeta._$raw('iframe[src]').each((_, el) => {
      const src = (directMeta._$raw(el).attr('src') || '');
      if (src.includes('youtube.com') || src.includes('youtu.be')) iframes.push('YouTube');
      if (src.includes('google.com/maps') || src.includes('maps.google')) iframes.push('Google Maps');
      if (src.includes('facebook.com')) iframes.push('Facebook');
      if (src.includes('tripadvisor')) iframes.push('TripAdvisor');
      if (src.includes('trustpilot')) iframes.push('Trustpilot');
      if (src.includes('instagram.com')) iframes.push('Instagram');
      if (src.includes('tiktok.com')) iframes.push('TikTok');
      if (src.includes('spotify.com')) iframes.push('Spotify');
      if (src.includes('calendly.com')) iframes.push('Calendly');
      if (src.includes('typeform.com')) iframes.push('Typeform');
    });
  }
  const uniqueIframes = [...new Set(iframes)];

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
    embeds: uniqueIframes,
  };
}

function detectSiteType(url, textContent, $) {
  const u = url.toLowerCase();
  const t = textContent.toLowerCase();
  const hostname = (() => { try { return new URL(url).hostname.toLowerCase(); } catch { return ''; } })();

  // SaaS signals (check BEFORE e-commerce — SaaS sites often mention "prix", "produit" too)
  if (/pricing|tarif|plan.gratuit|free.plan|start.free|essai.gratuit|free.trial|sign.up|s.inscrire|dashboard|api\b|integrations|saas|logiciel|software|platform/i.test(t.slice(0, 3000)) ||
      /\.app$|\.io$|\.dev$|\.tools$|\.ai$|\.co$/.test(hostname)) return 'saas';

  // E-commerce signals (strong signals only — must have cart/shop patterns, not just "prix")
  if ($('script[type="application/ld+json"]').text().includes('"Product"') ||
      /panier|cart|add.to.cart|acheter|buy.now|ajouter.au.panier|\bshop\b|boutique/i.test(t.slice(0, 2000)) ||
      /shop\.|store\.|boutique/i.test(hostname)) return 'ecommerce';

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
    { key: 'citability', label: 'Citabilité & réponse directe', max: 25 },
    { key: 'verifiability', label: 'Vérifiabilité & preuves', max: 20 },
    { key: 'authority', label: 'Autorité & E-E-A-T', max: 15 },
    { key: 'accessibility', label: 'Accessibilité IA', max: 10 },
    { key: 'externalPresence', label: 'Présence externe', max: 10 },
    { key: 'freshness', label: 'Fraîcheur & signaux temporels', max: 10 },
  ]
    .filter(c => scores[c.key].score / c.max < 0.8)
    .sort((a, b) => (scores[a.key].score / a.max) - (scores[b.key].score / b.max));

  const criteriaList = criteriaBelow.map(c =>
    `- ${c.label} : ${scores[c.key].score}/${c.max} — ${scores[c.key].detail}`
  ).join('\n');

  // Full criteria scores for context (prevents Claude from contradicting scores above threshold)
  const allCriteria = [
    { key: 'citability', label: 'Citabilité & réponse directe', max: 25 },
    { key: 'verifiability', label: 'Vérifiabilité & preuves', max: 20 },
    { key: 'authority', label: 'Autorité & E-E-A-T', max: 15 },
    { key: 'accessibility', label: 'Accessibilité IA', max: 10 },
    { key: 'externalPresence', label: 'Présence externe', max: 10 },
    { key: 'freshness', label: 'Fraîcheur & signaux temporels', max: 10 },
  ];
  const allScoresSummary = allCriteria.map(c =>
    `${c.label}: ${scores[c.key].score}/${c.max} (${Math.round(scores[c.key].score / c.max * 100)}%) — ${scores[c.key].detail}`
  ).join('\n');

  const langInstruction = locale === 'en'
    ? `OUTPUT LANGUAGE: English (US). ALL text values in the JSON (verdict, recommendations, strengths, topPriority, neutralityDetail) MUST be in American English. Use natural, direct, conversational phrasing.
CRITICAL: The "criterion" field MUST always use the FRENCH criterion name from this exact list (used as a matching key in the frontend): 'Citabilité & réponse directe', 'Vérifiabilité & preuves', 'Autorité & E-E-A-T', 'Accessibilité IA', 'Neutralité éditoriale', 'Présence externe', 'Fraîcheur & signaux temporels'.`
    : `LANGUE DE SORTIE : Français. Toutes les valeurs texte du JSON doivent être en français professionnel et direct.
CRITICAL: The "criterion" field MUST always use a name from this exact list: 'Citabilité & réponse directe', 'Vérifiabilité & preuves', 'Autorité & E-E-A-T', 'Accessibilité IA', 'Neutralité éditoriale', 'Présence externe', 'Fraîcheur & signaux temporels'. No other criterion name is allowed.`;

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
OVERALL SCORE: ${total}/100
SITE TYPE DETECTED: ${siteType}

ALL CRITERIA SCORES (these are FACTS — your text MUST be consistent with these scores):
${allScoresSummary}

CRITERIA BELOW 80% THRESHOLD (need recommendations):
${criteriaList}

CONTENT (first 300 characters):
${textContent.slice(0, 300)}

${detectedSignals ? `ALREADY DETECTED ON THIS PAGE (do NOT recommend adding elements already present):\n${detectedSignals}\n` : ''}${missingSchemas.length > 0 ? `MISSING SCHEMAS FOR THIS SITE TYPE (${siteType}): ${missingSchemas.join(', ')}\n` : ''}
RULES:
0. ANTI-CONTRADICTION RULE (CRITICAL): Your text MUST be consistent with the scores AND the detected signals above. If a criterion scores ≥80%, do NOT say it is missing, absent, or not evaluated. If a criterion scores <40%, do NOT say it is well-handled. Use the detail strings as factual evidence in your recommendations. IMPORTANT: When referring to headings (H1, H2, H3), meta title, or social media, use the EXACT counts and values from the "ALREADY DETECTED" section — do NOT invent different numbers or truncate values.
1. Generate EXACTLY 7 recommendations: 1 per criterion below threshold + 1 for Editorial Neutrality.
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
   - "codeExample": Real code snippet (JSON-LD, HTML, meta tag) when relevant. Set to null for editorial-only recommendations. IMPORTANT: When code examples contain placeholder values (opening hours, prices, addresses, names), add an HTML comment "<!-- Adaptez avec vos vraies valeurs -->" (or "<!-- Replace with your real values -->" in English) at the top of the snippet so the client knows these are illustrative, not extracted from their site.
8. IMPACT/EFFORT/TIMEFRAME RULES:
   - impact: based on expected visibility gain (high = major, medium = noticeable, low = incremental)
   - effort: based on technical complexity (low = add a tag, medium = restructure content, high = major overhaul)
   - timeframe: ${locale === 'en' ? '"1-2 weeks" for quick fixes, "1 month" for medium work, "2-3 months" for complex projects' : '"1-2 sem" for quick fixes, "1 mois" for medium work, "2-3 mois" for complex projects'}

NEUTRALITY SCORING RULES:
- 8-10: Factual, sourced, no superlatives, educational tone
- 5-7: Mostly factual with some promotional language
- 3-4: Clearly promotional with unproven claims
- 0-2: Aggressive marketing, clickbait, misleading claims

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
  const parsed = JSON.parse(jsonMatch[0]);

  // ── Post-processor: fix contradictions between Claude text and actual scores ──
  return postProcessRecommendations(parsed, scores);
}

/**
 * Post-processor that checks Claude's output against actual computed scores.
 * Fixes common contradictions:
 * - "not evaluated" / "absent" / "non évalué" when score is high
 * - "well-handled" / "bien géré" when score is low
 * - Recommendation for a criterion that's already well-scored (≥80%)
 */
function postProcessRecommendations(claude, scores) {
  const criterionToKey = {
    // V2 criterion names (accented)
    'Citabilité & réponse directe': 'citability',
    'Vérifiabilité & preuves': 'verifiability',
    'Autorité & E-E-A-T': 'authority',
    'Accessibilité IA': 'accessibility',
    'Neutralité éditoriale': null, // scored by Claude, not by us
    'Présence externe': 'externalPresence',
    'Fraîcheur & signaux temporels': 'freshness',
    // Non-accented (Claude sometimes strips accents)
    'Citabilite & reponse directe': 'citability',
    'Verifiabilite & preuves': 'verifiability',
    'Autorite & E-E-A-T': 'authority',
    'Accessibilite IA': 'accessibility',
    'Neutralite editoriale': null,
    'Presence externe': 'externalPresence',
    'Fraicheur & signaux temporels': 'freshness',
    // Legacy names (for backwards compatibility with cached reports)
    'Extractibilité & réponse directe': 'citability',
    'Crawlabilité IA': 'accessibility',
    'Données structurées': null,
    'Fraîcheur & maintenance': 'freshness',
  };

  // Contradiction patterns to detect
  const absencePatterns = /n[''\u2019](?:est|a) pas [eé]t[eé] (?:d[eé]tect|[eé]valu|identifi|trouv)[eé]|pas d[''\u2019]information|non [eé]valu[eé]|pas identifi[eé]|aucun(?:e)? (?:signal|donn[eé]e|schema|lien)|not evaluated|not assessed|no data|no information|absent|not found|not detected|introuvable|inexistant|manquant|missing|lacking|no evidence|we couldn.t find|we did not detect|n.a pas .t. d.tect/i;
  const positivePatterns = /bien g[eé]r[eé]|bien optimis[eé]|excellent|well.handled|well.optimized|already.good|d[eé]j[aà] bon|solide|strong|tr[eè]s bon|parfaitement optimis[eé]|aucun probl[eè]me|no issues|perfect|flawless/i;

  if (claude.recommendations && Array.isArray(claude.recommendations)) {
    claude.recommendations = claude.recommendations.map(reco => {
      const key = criterionToKey[reco.criterion];
      if (!key || !scores[key]) return reco; // neutrality or unknown criterion

      const score = scores[key];
      const pct = score.score / score.max;

      // Check: if score ≥ 80% but text says "absent" or "not evaluated"
      if (pct >= 0.8 && reco.problem && absencePatterns.test(reco.problem)) {
        console.log(`[post-process] FIXED contradiction: ${reco.criterion} scores ${Math.round(pct * 100)}% but problem says absent. Rewriting.`);
        reco.problem = reco.problem
          .replace(absencePatterns, 'peut encore être amélioré')
          .replace(/\.\s*$/, '. Ce critère est déjà bien noté, cette recommandation vise un perfectionnement.');
      }

      // Check: if score < 40% but text says "well-handled"
      if (pct < 0.4 && reco.problem && positivePatterns.test(reco.problem)) {
        console.log(`[post-process] FIXED contradiction: ${reco.criterion} scores ${Math.round(pct * 100)}% but problem says well-handled. Rewriting.`);
        reco.problem = reco.problem
          .replace(positivePatterns, 'nécessite une attention particulière');
      }

      return reco;
    });
  }

  // Validate neutrality score is within range
  if (typeof claude.neutralityScore === 'number' && !isNaN(claude.neutralityScore)) {
    claude.neutralityScore = Math.max(0, Math.min(10, Math.round(claude.neutralityScore)));
  } else {
    claude.neutralityScore = 5; // safe default if missing or NaN
  }

  // Validate recommendations is an array
  if (!claude.recommendations || !Array.isArray(claude.recommendations)) {
    claude.recommendations = [];
  }

  // Remove recos for criteria already strong (≥85%) or at max score
  // Keeps recos focused on real weaknesses instead of marginal "bonus" improvements
  if (claude.recommendations && Array.isArray(claude.recommendations)) {
    const strongRecos = [];
    const weakRecos = [];
    claude.recommendations.forEach(reco => {
      const key = criterionToKey[reco.criterion];
      if (!key || !scores[key]) { weakRecos.push(reco); return; }
      const pct = scores[key].score / scores[key].max;
      if (pct >= 0.85) {
        strongRecos.push(reco);
      } else {
        weakRecos.push(reco);
      }
    });
    // Keep at least 5 recos: fill with strong-criterion recos only if needed
    if (weakRecos.length >= 5) {
      claude.recommendations = weakRecos;
      if (strongRecos.length > 0) {
        console.log(`[post-process] REMOVED ${strongRecos.length} reco(s) on strong criteria (≥85%): ${strongRecos.map(r => r.criterion).join(', ')}`);
      }
    } else {
      claude.recommendations = [...weakRecos, ...strongRecos.slice(0, 5 - weakRecos.length)];
    }
  }

  // Validate verdict exists and isn't empty
  if (!claude.verdict || claude.verdict.trim().length < 10) {
    claude.verdict = 'Analyse complétée. Consultez les recommandations ci-dessous pour améliorer votre visibilité IA.';
  }

  // Validate strengths exist
  if (!claude.strengths || !Array.isArray(claude.strengths) || claude.strengths.length === 0) {
    claude.strengths = ['Le site est en ligne et accessible aux moteurs IA.'];
  }

  // Add disclaimer to code examples with placeholder values
  if (claude.recommendations && Array.isArray(claude.recommendations)) {
    claude.recommendations = claude.recommendations.map(reco => {
      if (reco.codeExample && reco.codeExample.length > 10) {
        const hasDisclaimer = /Adaptez|Replace with your real|exemple.*adapter|adapt.*valeurs/i.test(reco.codeExample);
        if (!hasDisclaimer) {
          reco.codeExample = '<!-- Adaptez les valeurs ci-dessous avec vos vraies données -->\n' + reco.codeExample;
        }
      }
      return reco;
    });
  }

  return claude;
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
  const { checkRateLimit, checkDailyLimit } = require('../../lib/rateLimit');
  const isAdmin = req.body.adminKey === process.env.ADMIN_SECRET;
  if (!isAdmin && !(await checkRateLimit('analyze', req, res))) return;

  // Daily limit: 3 free scans per IP per day
  const plan = req.body.plan || 'free';
  if (plan === 'free' && !isAdmin) {
    const dailyOk = await checkDailyLimit(req);
    if (!dailyOk) {
      const locale = req.body.locale === 'en' ? 'en' : 'fr';
      return res.status(429).json({
        error: locale === 'en'
          ? 'You have reached the daily limit of 3 free analyses. Contact us for more.'
          : 'Vous avez atteint la limite de 3 analyses gratuites par jour. Contactez-nous pour en faire davantage.',
        dailyLimitReached: true,
      });
    }
  }

  const rawUrl = req.body.url;
  const locale = req.body.locale === 'en' ? 'en' : 'fr';
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

  // Paid tier: check if scraping intermediates are cached (from a recent free scan)
  // This avoids re-scraping the same site when upgrading from free to paid (saves 30-60s)
  const scrapeCacheKey = `detekia:scrape:${url.toLowerCase()}:${locale}`;
  let scrapeCache = null;
  if (plan !== 'free') {
    try {
      const cached = await redis.get(scrapeCacheKey);
      if (cached) {
        scrapeCache = typeof cached === 'string' ? JSON.parse(cached) : cached;
        console.log(`[analyze] Scrape cache hit for paid tier: ${url}`);
      } else {
        // Scrape cache missing — trigger a fresh free scan in background to populate it
        // This happens when the free scan came from the response cache (no scraping was done)
        console.log(`[analyze] No scrape cache for ${url}, will do full analysis`);
      }
    } catch {}
  }

  try {
    // Fast path: reuse scraping intermediates from a recent free scan
    if (scrapeCache && plan !== 'free') {
      console.log(`[analyze] Fast path: reusing scrape cache for ${url} (plan=${plan})`);
      const { scores, detectedSignals, siteType, missingSchemas, metaTitle, metaDescription, hostname, brand, intro,
              earlyRobotsTxt, earlyHasLlmsTxt, scrapeSource, textContent, rawContent, directHtml } = scrapeCache;

      const $ = cheerio.load(rawContent);
      $('script, style, noscript').remove();
      const directMeta = { metaTitle, metaDescription, _$raw: directHtml ? cheerio.load(directHtml) : null };

      const queryCount = plan === 'pro' ? 30 : 10;
      const [fullClaude, ev, ct] = await Promise.all([
        runClaudeAnalysis(url, textContent, scores, locale, detectedSignals, siteType, missingSchemas),
        collectEvidence($, textContent, rawContent, url, directMeta, { robotsTxt: earlyRobotsTxt, hasLlmsTxt: earlyHasLlmsTxt }),
        runRealCitationTest(url, hostname, brand, metaDescription, intro, queryCount, locale, client).catch(e => { console.error('citationTest error:', e.message); return null; }),
      ]);

      const rawTotal = Object.values(scores).reduce((s, c) => s + c.score, 0);
      const totalScore = Math.max(0, Math.min(100, rawTotal));

      const responseData = {
        score: totalScore,
        verdict: fullClaude.verdict,
        strengths: fullClaude.strengths || [],
        topPriority: fullClaude.topPriority || '',
        criteria: [
          { name: 'Citabilité & réponse directe',      score: scores.citability.score,     max: 25, detail: scores.citability.detail },
          { name: 'Vérifiabilité & preuves',          score: scores.verifiability.score,  max: 20, detail: scores.verifiability.detail },
          { name: 'Autorité & E-E-A-T',               score: scores.authority.score,      max: 15, detail: scores.authority.detail },
          { name: 'Accessibilité IA',                 score: scores.accessibility.score,  max: 10, detail: scores.accessibility.detail },
          { name: 'Neutralité éditoriale',            score: scores.neutrality.score,      max: 10, detail: scores.neutrality.detail },
          { name: 'Présence externe',                 score: scores.externalPresence.score, max: 10, detail: scores.externalPresence.detail },
          { name: 'Fraîcheur & signaux temporels',    score: scores.freshness.score,       max: 10, detail: scores.freshness.detail },
        ],
        recommendations: fullClaude.recommendations,
        evidence: ev,
        citationTest: ct || null,
        scrapeSource: scrapeSource || 'cache',
      };

      await resend.emails.send({
        from: 'Detekia <hello@detekia.fr>',
        to: 'guillaume@beeleven.fr',
        subject: `🔍 Rapport payé (fast) — ${url} — Score ${totalScore}/100`,
        html: `<div style="font-family:system-ui;max-width:500px;">
          <p><strong>URL :</strong> ${url}</p>
          <p><strong>Score :</strong> ${totalScore}/100</p>
          <p><strong>Plan :</strong> ${plan}</p>
          <p><strong>Recos :</strong> ${(fullClaude.recommendations || []).length}</p>
          <p><strong>Citations :</strong> ${ct?.tests?.length || 0} queries</p>
          <p style="color:#10A37F"><strong>Fast path :</strong> scraping réutilisé du scan gratuit</p>
        </div>`,
      }).catch(() => {});

      return res.status(200).json(responseData);
    }

    const jinaUrl = `https://r.jina.ai/${url}`;

    // Fetch Jina content + raw HTML + robots.txt/llms.txt in parallel
    const origin = new URL(url).origin;
    const robotsLlmsPromise = Promise.race([
      (async () => {
        const [robotsRes, llmsRes] = await Promise.allSettled([
          axios.get(`${origin}/robots.txt`, { timeout: 5000 }),
          axios.get(`${origin}/llms.txt`,   { timeout: 5000 }),
        ]);
        let robotsTxtValue = 'Non accessible';
        if (robotsRes.status === 'fulfilled') {
          const data = String(robotsRes.value.data || '').trim();
          robotsTxtValue = data ? data.slice(0, 500) : 'Fichier vide';
        } else {
          const status = robotsRes.reason?.response?.status;
          robotsTxtValue = status === 404 ? 'Aucun fichier robots.txt (404)' : 'Non accessible';
        }
        return { robotsTxt: robotsTxtValue, hasLlmsTxt: llmsRes.status === 'fulfilled' && llmsRes.value.status === 200 };
      })(),
      new Promise(resolve => setTimeout(() => resolve({ robotsTxt: 'Non accessible (timeout)', hasLlmsTxt: false }), 5000)),
    ]);

    // Await robots.txt result (started in parallel)
    const { robotsTxt: earlyRobotsTxt, hasLlmsTxt: earlyHasLlmsTxt } = await robotsLlmsPromise;

    // ── SCRAPING: Direct HTML (primary) → Browserless (SPA fallback) ──────
    // No Jina — direct HTTP is 100% consistent (same URL = same content = same score)
    let rawContent, scrapeSource;
    let directHtmlData = null;

    // Step 1: Direct HTTP fetch (fast, consistent, works for 80%+ of sites)
    try {
      const { data } = await axios.get(url, { timeout: 15000, maxRedirects: 5, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DetekiaBot/1.0; +https://detekia.fr)' } });
      if (typeof data === 'string' && data.length > 500) {
        directHtmlData = data;
        const $test = cheerio.load(data);
        $test('script, style, noscript').remove();
        const textTest = $test('body').text().replace(/\s+/g, ' ').trim();
        if (textTest.length > 500) {
          rawContent = data;
          scrapeSource = 'direct';
          console.log(`[analyze] Direct HTML: ${textTest.length} chars for ${url}`);
        }
      }
    } catch (e) {
      console.log(`[analyze] Direct fetch failed for ${url}: ${e.message.slice(0, 50)}`);
    }

    // Step 2: Browserless (headless Chrome) for SPAs and thin content
    if (!rawContent || (rawContent && cheerio.load(rawContent)('body').text().replace(/\s+/g, ' ').trim().split(/\s+/).length < 200)) {
      try {
        const { fetchRenderedHtml } = require('../../lib/browserless');
        const rendered = await fetchRenderedHtml(url);
        if (rendered) {
          const $br = cheerio.load(rendered);
          $br('script, style, noscript').remove();
          const brText = $br('body').text().replace(/\s+/g, ' ').trim();
          const currentText = rawContent ? cheerio.load(rawContent)('body').text().replace(/\s+/g, ' ').trim() : '';
          if (brText.length > currentText.length && brText.length > 500) {
            console.log(`[analyze] Browserless: ${brText.length} chars (direct was ${currentText.length}) for ${url}`);
            rawContent = rendered;
            scrapeSource = 'browserless';
          }
        }
      } catch (e) { console.log(`[analyze] Browserless failed: ${e.message.slice(0, 50)}`); }
    }

    if (!rawContent) {
      throw new Error('Unable to fetch content from ' + url);
    }

    let $ = cheerio.load(rawContent);
    $('script, style, noscript').remove();
    let textContent = $('body').text().replace(/\s+/g, ' ').trim();

    const finalWordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
    if (textContent.length < 500 || finalWordCount < 100) {
      // Detect Cloudflare / anti-bot challenge pages
      const isCloudflare = /cf-browser-verification|cloudflare|challenge-platform|just a moment/i.test(rawContent);
      const isAntiBot = isCloudflare || /captcha|please verify|bot detection|access denied|403 forbidden/i.test(rawContent);
      return res.status(422).json({ error: locale === 'en'
        ? isAntiBot
          ? 'This site is protected by an anti-bot system (Cloudflare or similar) that blocks our analysis. To allow Detekia to scan your site, whitelist the user-agent "DetekiaBot" in your firewall rules, or contact us at hello@detekia.fr for assistance.'
          : 'Unable to analyze this site. Content too short or inaccessible (anti-bot protection, JavaScript-only rendering, or empty page). If this is your site, whitelist "DetekiaBot" or contact hello@detekia.fr.'
        : isAntiBot
          ? "Ce site est protégé par un système anti-bot (Cloudflare ou similaire) qui bloque notre analyse. Pour permettre à Detekia de scanner votre site, autorisez le user-agent « DetekiaBot » dans vos règles de pare-feu, ou contactez-nous à hello@detekia.fr."
          : "Impossible d'analyser ce site. Contenu trop court ou inaccessible (protection anti-bot, rendu JavaScript uniquement, ou page vide). Si c'est votre site, autorisez « DetekiaBot » ou contactez hello@detekia.fr."
      });
    }

    // Use direct HTML for structured data enrichment (JSON-LD, meta, social links)
    const directHtml = directHtmlData || (scrapeSource === 'direct' ? rawContent : null);
    let directMeta = { description: '', title: '', socialLinks: [], imageCount: 0, imagesWithAlt: 0, _$raw: null };
    if (directHtml && typeof directHtml === 'string') {
      const $raw = cheerio.load(directHtml);
      directMeta._$raw = $raw;
      directMeta._directHtml = directHtml;
      // 1. Inject JSON-LD scripts
      $raw('script[type="application/ld+json"]').each((_, el) => {
        const content = $raw(el).html();
        if (content) $('body').append(`<script type="application/ld+json">${content}</script>`);
      });
      // 2. Extract meta description (Jina often strips it)
      directMeta.description = $raw('meta[name="description"]').attr('content') || $raw('meta[property="og:description"]').attr('content') || '';
      const htmlTitle = $raw('title').text().trim() || '';
      const ogTitle = $raw('meta[property="og:title"]').attr('content')?.trim() || '';
      // Use the most complete title (og:title often includes brand + location)
      directMeta.title = ogTitle.length > htmlTitle.length ? ogTitle : htmlTitle;
      // 3. Extract social links (Jina strips footer)
      const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com', 'tiktok.com', 'snapchat.com', 'pinterest.com', 'threads.net'];
      const socialExclude = ['analytics.twitter', 'platform.twitter', '/intent/', 'ads.twitter', 'adsct', '/widgets/', 'connect.facebook', 'staticxx.facebook'];
      $raw('a[href]').each((_, el) => {
        const href = ($raw(el).attr('href') || '').trim();
        if (href.startsWith('http') && socialDomains.some(d => href.includes(d)) && !socialExclude.some(e => href.includes(e)) && !directMeta.socialLinks.includes(href)) {
          directMeta.socialLinks.push(href);
        }
      });
      // 4. Extract iframes from direct HTML (Jina strips iframes)
      directMeta.iframes = [];
      $raw('iframe[src]').each((_, el) => {
        const src = ($raw(el).attr('src') || '');
        if (src.includes('youtube.com') || src.includes('youtu.be')) directMeta.iframes.push('YouTube');
        if (src.includes('google.com/maps') || src.includes('maps.google')) directMeta.iframes.push('Google Maps');
        if (src.includes('facebook.com')) directMeta.iframes.push('Facebook');
        if (src.includes('tripadvisor')) directMeta.iframes.push('TripAdvisor');
        if (src.includes('trustpilot')) directMeta.iframes.push('Trustpilot');
        if (src.includes('instagram.com')) directMeta.iframes.push('Instagram');
        if (src.includes('tiktok.com')) directMeta.iframes.push('TikTok');
        if (src.includes('spotify.com')) directMeta.iframes.push('Spotify');
        if (src.includes('calendly.com')) directMeta.iframes.push('Calendly');
        if (src.includes('typeform.com')) directMeta.iframes.push('Typeform');
      });
      directMeta.iframes = [...new Set(directMeta.iframes)];
      // 5. Count images (exclude tracking pixels and tiny SVG icons)
      const isRealImg = (el) => {
        const src = $raw(el).attr('src') || '';
        const w = parseInt($raw(el).attr('width') || '0', 10);
        const h = parseInt($raw(el).attr('height') || '0', 10);
        if ((w === 1 && h === 1) || (w === 0 && h === 0 && $raw(el).attr('width'))) return false;
        if (src.startsWith('data:') && src.length < 200) return false;
        if (src.endsWith('.svg') && w > 0 && w <= 24 && h > 0 && h <= 24) return false;
        return true;
      };
      directMeta.imageCount = $raw('img').filter((_, el) => isRealImg(el)).length;
      directMeta.imagesWithAlt = $raw('img[alt]').filter((_, el) => isRealImg(el) && ($raw(el).attr('alt') || '').trim().length > 0).length;
    }

    const metaTitle = cleanTitle($('title').text().trim() || $('meta[property="og:title"]').attr('content') || directMeta.title || jinaTitle(rawContent) || '');
    const metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || directMeta.description || jinaDescription(rawContent) || '';

    let siteHostname = null;
    try { siteHostname = new URL(url).hostname; } catch {}

    const scores = {
      citability:       scoreCitability($, textContent, rawContent, locale, directHtml || ''),
      verifiability:    scoreVerifiability($, textContent, rawContent, siteHostname, locale),
      authority:        scoreAuthority($, rawContent, locale, directHtml || ''),
      accessibility:    scoreAccessibility($, rawContent, locale, directHtml || '', earlyRobotsTxt || ''),
      neutrality:       scoreNeutrality($, textContent, locale),
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
        const pushType = (t) => { if (Array.isArray(t)) t.forEach(v => { if (typeof v === 'string') detectedSchemas.push(v); }); else if (typeof t === 'string') detectedSchemas.push(t); };
        if (d['@type']) pushType(d['@type']);
        if (Array.isArray(d['@graph'])) d['@graph'].forEach(item => { if (item['@type']) pushType(item['@type']); });
      } catch {}
    });
    if (detectedSchemas.length) signalParts.push(`JSON-LD schemas: ${detectedSchemas.join(', ')}`);
    else signalParts.push('JSON-LD schemas: NONE');
    // Social media links detected
    const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com', 'tiktok.com', 'snapchat.com', 'pinterest.com', 'threads.net'];
    const detectedSocials = [];
    const allLinks = [];
    $('a[href]').each((_, el) => { const h = $(el).attr('href') || ''; if (h.startsWith('http')) allLinks.push(h); });
    if (directMeta.socialLinks) directMeta.socialLinks.forEach(h => { if (!allLinks.includes(h)) allLinks.push(h); });
    allLinks.forEach(h => { socialDomains.forEach(d => { if (h.includes(d) && !detectedSocials.includes(d)) detectedSocials.push(d); }); });
    if (detectedSocials.length) signalParts.push(`Social media detected: ${detectedSocials.join(', ')}`);
    else signalParts.push('Social media: NONE detected');
    // Embedded content (iframes) — from Jina $ and direct HTML
    const allIframes = [];
    $('iframe[src]').each((_, el) => {
      const src = $(el).attr('src') || '';
      if (src.includes('youtube.com') || src.includes('youtu.be')) allIframes.push('YouTube');
      if (src.includes('google.com/maps') || src.includes('maps.google')) allIframes.push('Google Maps');
      if (src.includes('facebook.com')) allIframes.push('Facebook');
      if (src.includes('tripadvisor')) allIframes.push('TripAdvisor');
      if (src.includes('trustpilot')) allIframes.push('Trustpilot');
      if (src.includes('instagram.com')) allIframes.push('Instagram');
      if (src.includes('tiktok.com')) allIframes.push('TikTok');
      if (src.includes('spotify.com')) allIframes.push('Spotify');
      if (src.includes('calendly.com')) allIframes.push('Calendly');
      if (src.includes('typeform.com')) allIframes.push('Typeform');
    });
    if (directMeta.iframes) directMeta.iframes.forEach(i => allIframes.push(i));
    const uniqueDetectedIframes = [...new Set(allIframes)];
    if (uniqueDetectedIframes.length) signalParts.push(`Embedded content (iframes): ${uniqueDetectedIframes.join(', ')}`);
    // Headings structure — same logic as scoring: direct HTML if has headings, else Markdown
    let h1Count = 0, h2Count = 0, h3Count = 0;
    if (directHtml) {
      const $d = directMeta._$raw || cheerio.load(directHtml);
      const dh1 = $d('h1').length, dh2 = $d('h2').length, dh3 = $d('h3').length;
      if (dh1 + dh2 + dh3 > 0) { h1Count = dh1; h2Count = dh2; h3Count = dh3; }
    }
    if (h1Count + h2Count + h3Count === 0) {
      h1Count = (rawContent.match(/^# (?!#)[^\n]+/gm) || []).length;
      h2Count = (rawContent.match(/^## (?!#)[^\n]+/gm) || []).length;
      h3Count = (rawContent.match(/^### (?!#)[^\n]+/gm) || []).length;
    }
    signalParts.push(`Headings: ${h1Count} H1, ${h2Count} H2, ${h3Count} H3 (total ${h1Count + h2Count + h3Count} heading elements)`);
    // Factual counts for Claude (prevents contradictions with scoring data)
    // Extract counts from scoring detail strings to give Claude exact numbers
    const verifDetail = scores.verifiability.detail || '';
    const extLinkMatch = verifDetail.match(/(\d+)\s*(?:liens? externe|external links?)/i);
    const dataPointMatch = verifDetail.match(/(\d+)\s*(?:donn[ée]es? chiffr[ée]|data points?)/i);
    signalParts.push(`External links: ${extLinkMatch ? extLinkMatch[1] : '0'} unique external domains linked`);
    signalParts.push(`Data points (stats/numbers): ${dataPointMatch ? dataPointMatch[1] : '0'} detected`);
    signalParts.push(`Word count: ${textContent.split(/\s+/).filter(w => w.length > 0).length} words`);
    // robots.txt and llms.txt info (fetched in parallel with Jina at start)
    signalParts.push(`robots.txt: ${earlyRobotsTxt.substring(0, 100)}`);
    if (earlyHasLlmsTxt) signalParts.push('llms.txt: present');
    else signalParts.push('llms.txt: absent');
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
    let claude, evidence, citationTest;

    if (plan === 'free') {
      // FREE TIER: no Claude call needed — all 7 criteria are deterministic
      // Just generate a simple verdict from the scores
      const totalForVerdict = Object.values(scores).reduce((s, c) => s + c.score, 0);
      const weakest = Object.entries(scores).sort((a, b) => (a[1].score / a[1].max) - (b[1].score / b[1].max))[0];
      const strongest = Object.entries(scores).sort((a, b) => (b[1].score / b[1].max) - (a[1].score / a[1].max))[0];
      const criteriaLabels = { citability: 'citabilité', verifiability: 'vérifiabilité', authority: 'autorité', accessibility: 'accessibilité IA', neutrality: 'neutralité', externalPresence: 'présence externe', freshness: 'fraîcheur' };
      const verdict = totalForVerdict >= 75
        ? `Ce site présente un bon niveau de citabilité IA avec des forces en ${criteriaLabels[strongest[0]]}.`
        : totalForVerdict >= 50
        ? `Ce site a des bases correctes mais peut améliorer sa ${criteriaLabels[weakest[0]]} pour être mieux cité par les IA.`
        : `Ce site nécessite des optimisations significatives, en priorité sur la ${criteriaLabels[weakest[0]]}.`;

      claude = {
        neutralityScore: scores.neutrality.score,
        neutralityDetail: scores.neutrality.detail,
        verdict,
        strengths: [strongest[1].detail.substring(0, 100)],
        topPriority: `Améliorer la ${criteriaLabels[weakest[0]]} (${weakest[1].score}/${weakest[1].max}).`,
        recommendations: [],
      };

      const [ev, ct] = await Promise.all([
        collectEvidence($, textContent, rawContent, url, directMeta, { robotsTxt: earlyRobotsTxt, hasLlmsTxt: earlyHasLlmsTxt }),
        runRealCitationTest(url, hostname, brand, metaDescription, intro, queryCount, locale, client).catch(e => { console.error('citationTest error:', e.message); return null; }),
      ]);
      evidence = ev;
      citationTest = ct;
    } else {
      // PAID TIER: full Claude analysis with 7 recommendations
      const [fullClaude, ev, ct] = await Promise.all([
        runClaudeAnalysis(url, textContent, scores, locale, detectedSignals, siteType, missingSchemas),
        collectEvidence($, textContent, rawContent, url, directMeta, { robotsTxt: earlyRobotsTxt, hasLlmsTxt: earlyHasLlmsTxt }),
        runRealCitationTest(url, hostname, brand, metaDescription, intro, queryCount, locale, client).catch(e => { console.error('citationTest error:', e.message); return null; }),
      ]);
      claude = fullClaude;
      evidence = ev;
      citationTest = ct;
    }
    // Score V2: 7 criteria (all deterministic) = max 100
    // Direct /100 — no normalization, no Claude dependency
    const rawTotal = Object.values(scores).reduce((s, c) => s + c.score, 0);
    const totalScore = Math.max(0, Math.min(100, rawTotal));

    // Verdict is already generated in runClaudeAnalysis with the pre-normalization score

    // Sanity checks — detect likely scraping gaps
    const finalWC = textContent.split(/\s+/).filter(w => w.length > 0).length;
    const sanityWarnings = [];
    if (finalWC < 400) {
      const degradedMsg = locale === 'en'
        ? `⚠️ Partial analysis: we could only extract ${finalWC} words from this page. The site may use JavaScript rendering or anti-bot protection that limits our access. Scores may be lower than actual performance.`
        : `⚠️ Analyse partielle : nous n'avons pu extraire que ${finalWC} mots de cette page. Le site utilise probablement un rendu JavaScript ou une protection anti-bot qui limite notre accès. Les scores peuvent être inférieurs à la réalité.`;
      sanityWarnings.push(degradedMsg);
    }
    if (finalWC > 1000 && scores.citability.score < 5) {
      sanityWarnings.push(locale === 'en'
        ? "The citability score is very low — content may be JavaScript-rendered and partially inaccessible to our scraper."
        : "Le score de citabilité est très bas — le contenu est peut-être rendu en JavaScript et partiellement inaccessible au scraper.");
    }

    const responseData = {
      score: totalScore,
      verdict: claude.verdict,
      strengths: claude.strengths || [],
      topPriority: claude.topPriority || '',
      criteria: [
        { name: 'Citabilité & réponse directe',      score: scores.citability.score,     max: 25, detail: scores.citability.detail },
        { name: 'Vérifiabilité & preuves',          score: scores.verifiability.score,  max: 20, detail: scores.verifiability.detail },
        { name: 'Autorité & E-E-A-T',               score: scores.authority.score,      max: 15, detail: scores.authority.detail },
        { name: 'Accessibilité IA',                 score: scores.accessibility.score,  max: 10, detail: scores.accessibility.detail },
        { name: 'Neutralité éditoriale',            score: scores.neutrality.score,      max: 10, detail: scores.neutrality.detail },
        { name: 'Présence externe',                 score: scores.externalPresence.score, max: 10, detail: scores.externalPresence.detail },
        { name: 'Fraîcheur & signaux temporels',    score: scores.freshness.score,       max: 10, detail: scores.freshness.detail },
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

    // Cache free tier results for quick repeat scans
    if (plan === 'free') {
      redis.set(cacheKey, responseData, { ex: CACHE_DURATION })
        .catch(e => console.error('Cache write error:', e.message));
    }

    // Cache scraping intermediates (scores, signals, meta) for paid tier upgrade
    // When a client goes from free scan to paid report, skip re-scraping (saves 30-60s)
    const scrapeCacheKey = `detekia:scrape:${url.toLowerCase()}:${locale}`;
    redis.set(scrapeCacheKey, {
      scores, detectedSignals, siteType, missingSchemas,
      metaTitle, metaDescription, hostname, brand, intro: textContent.slice(0, 300),
      earlyRobotsTxt, earlyHasLlmsTxt, scrapeSource,
      textContent: textContent.slice(0, 50000),
      rawContent: rawContent.slice(0, 100000),
      directHtml: (directHtml || '').slice(0, 100000),
    }, { ex: 7200 }) // 2h TTL — survives between free scan and paid report purchase
      .catch(e => console.error('Scrape cache write error:', e.message));

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