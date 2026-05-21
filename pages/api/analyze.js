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


const { scoreExtractibility, scoreVerifiability, scoreAuthority, scoreCrawlability, scoreStructuredData, scoreExternalPresence, scoreFreshness } = require('../../lib/scoring');

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

  // Full criteria scores for context (prevents Claude from contradicting scores above threshold)
  const allCriteria = [
    { key: 'extractibility', label: 'Extractibilité', max: 25 },
    { key: 'verifiability', label: 'Vérifiabilité', max: 20 },
    { key: 'authority', label: 'Autorité E-E-A-T', max: 15 },
    { key: 'crawlability', label: 'Crawlabilité IA', max: 15 },
    { key: 'structuredData', label: 'Données structurées', max: 10 },
    { key: 'externalPresence', label: 'Présence externe', max: 5 },
    { key: 'freshness', label: 'Fraîcheur', max: 5 },
  ];
  const allScoresSummary = allCriteria.map(c =>
    `${c.label}: ${scores[c.key].score}/${c.max} (${Math.round(scores[c.key].score / c.max * 100)}%) — ${scores[c.key].detail}`
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
0. ANTI-CONTRADICTION RULE (CRITICAL): Your text MUST be consistent with the scores above. If a criterion scores ≥80%, do NOT say it is missing, absent, or not evaluated. If a criterion scores <40%, do NOT say it is well-handled. Use the detail strings as factual evidence in your recommendations.
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
  const { checkRateLimit, checkDailyLimit } = require('../../lib/rateLimit');
  if (!(await checkRateLimit('analyze', req, res))) return;

  // Daily limit: 3 free scans per IP per day
  const plan = req.body.plan || 'free';
  if (plan === 'free') {
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

    let $ = cheerio.load(rawContent);
    let textContent = $('body').text().replace(/\s+/g, ' ').trim();

    // If Jina succeeded but content is suspiciously thin, try Browserless as supplement
    if (scrapeSource !== 'browserless' && textContent.length < 1000 && textContent.length > 100) {
      try {
        const { fetchRenderedHtml } = require('../../lib/browserless');
        const rendered = await fetchRenderedHtml(url);
        if (rendered) {
          const $br = cheerio.load(rendered);
          $br('script, style').remove();
          const brText = $br('body').text().replace(/\s+/g, ' ').trim();
          if (brText.length > textContent.length * 1.5) {
            console.log(`[analyze] Browserless found ${brText.length} chars vs Jina's ${textContent.length} — using Browserless`);
            rawContent = rendered;
            $ = cheerio.load(rawContent);
            textContent = brText;
            scrapeSource = 'browserless-supplement';
          }
        }
      } catch (e) { console.log(`[analyze] Browserless supplement failed: ${e.message.slice(0, 50)}`); }
    }

    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
    if (textContent.length < 500 || wordCount < 100) {
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
    // Headings structure
    const h1Count = $('h1').length || (rawContent.match(/^# [^\n]+/gm) || []).length;
    const h2Count = $('h2').length || (rawContent.match(/^## [^\n]+/gm) || []).length;
    signalParts.push(`Headings: ${h1Count} H1, ${h2Count} H2`);
    // robots.txt info not available here (computed in parallel with Claude call)
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

    // Verdict is already generated in runClaudeAnalysis with the pre-normalization score

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