import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import axios from 'axios';
import * as cheerio from 'cheerio';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = { maxDuration: 60 };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CACHE_DURATION = 24 * 60 * 60;

// ── Markdown helpers (Jina returns markdown when HTML parsing fails) ──────────

function mdHeadings(raw) {
  const result = [];
  for (const line of raw.split('\n')) {
    const h3 = line.match(/^###\s+(.+)/); if (h3) { result.push({ level: 'h3', text: h3[1].trim() }); continue; }
    const h2 = line.match(/^##\s+(.+)/);  if (h2) { result.push({ level: 'h2', text: h2[1].trim() }); continue; }
    const h1 = line.match(/^#\s+(.+)/);   if (h1) { result.push({ level: 'h1', text: h1[1].trim() }); }
  }
  return result;
}

function mdExternalLinks(raw, hostname) {
  const regex = /\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  const links = [];
  let match;
  while ((match = regex.exec(raw)) !== null) {
    const href = match[2];
    if (!hostname || !href.includes(hostname)) links.push(href);
  }
  return links;
}

function mdAllLinks(raw) {
  const regex = /\[([^\]]*)\]\(((?:https?:\/\/|\/)[^)\s]+)\)/g;
  const links = [];
  let match;
  while ((match = regex.exec(raw)) !== null) links.push(match[2].toLowerCase());
  return links;
}

function jinaTitle(raw) {
  return raw.match(/^Title:\s*(.+)/m)?.[1]?.trim() || '';
}

function jinaDescription(raw) {
  return raw.match(/^Description:\s*(.+)/m)?.[1]?.trim() || '';
}

// ─────────────────────────────────────────────────────────────────────────────

function scoreExtractibility($, text, raw) {
  let score = 0;
  const details = [];
  // Base : site a du contenu lisible (garanti par le check 200 chars en amont)
  score += 3; details.push('Contenu présent ✓');
  // Intro quality
  const intro = text.slice(0, 300);
  const introWords = intro.split(/\s+/).filter(w => w.length > 1).length;
  if (introWords > 30) { score += 5; details.push('Intro substantielle ✓'); }
  else if (introWords > 15) { score += 3; details.push('Intro correcte'); }
  else if (introWords > 5) { score += 1; details.push('Intro courte'); }
  else details.push('Intro trop courte ✗');
  // Lists — HTML or markdown fallback
  const htmlListCount = $('ul li, ol li').length;
  const mdListCount = (raw.match(/^[\-\*\+]\s+\S/gm) || []).length + (raw.match(/^\d+\.\s+\S/gm) || []).length;
  const listCount = Math.max(htmlListCount, mdListCount);
  if (listCount >= 10) { score += 5; details.push(`${listCount} éléments de liste ✓`); }
  else if (listCount >= 4) { score += 3; details.push(`${listCount} éléments de liste`); }
  else if (listCount >= 1) { score += 1; details.push(`${listCount} élément de liste`); }
  else details.push('Peu de listes ✗');
  // Tables — HTML or markdown fallback
  const htmlTableCount = $('table').length;
  const mdTableLines = (raw.match(/^\|.+\|/gm) || []).length;
  const tableCount = htmlTableCount > 0 ? htmlTableCount : (mdTableLines >= 3 ? 1 : 0);
  if (tableCount >= 2) { score += 4; details.push(`${tableCount} tableaux ✓`); }
  else if (tableCount === 1) { score += 2; details.push('1 tableau'); }
  // H2 structure — HTML or markdown fallback
  const htmlH2Count = $('h2').length;
  const mdH2Count = (raw.match(/^##\s+/gm) || []).length;
  const h2Count = Math.max(htmlH2Count, mdH2Count);
  if (h2Count >= 4) { score += 5; details.push('Structure H2 riche ✓'); }
  else if (h2Count >= 2) { score += 3; details.push('Structure H2 correcte'); }
  else if (h2Count >= 1) { score += 1; details.push('1 H2 présent'); }
  else details.push('Aucun H2 ✗');
  // Short paragraphs — HTML or markdown fallback
  const htmlShortParas = Array.from($('p')).filter(p => {
    const txt = $(p).text().trim();
    return txt.length > 50 && txt.length < 300;
  }).length;
  const mdShortParas = raw.split('\n').filter(l => {
    const t = l.trim();
    return t.length > 50 && t.length < 300 && !/^[#|\-\*\d]/.test(t);
  }).length;
  const shortParas = htmlShortParas > 0 ? htmlShortParas : Math.min(mdShortParas, 10);
  if (shortParas >= 5) { score += 5; details.push(`${shortParas} paragraphes calibrés ✓`); }
  else if (shortParas >= 2) { score += 3; details.push(`${shortParas} paragraphes corrects`); }
  else if (shortParas >= 1) { score += 1; details.push(`${shortParas} paragraphe`); }
  else details.push('Paragraphes longs ou absents ✗');
  return { score: Math.min(score, 25), max: 25, detail: details.slice(0, 3).join(' · ') };
}

function scoreVerifiability($, text, html) {
  let score = 0;
  const details = [];
  // Base : contenu vérifiable minimum
  score += 2; details.push('Contenu vérifiable');
  // Chiffres et données
  const numbers = text.match(/\d+[.,]?\d*\s*(%|€|\$|k|M|pts?|points?|fois|ans?|mois|jours?)/gi) || [];
  if (numbers.length >= 5) { score += 5; details.push(`${numbers.length} données chiffrées ✓`); }
  else if (numbers.length >= 2) { score += 3; details.push(`${numbers.length} données chiffrées`); }
  else if (numbers.length >= 1) { score += 1; details.push(`${numbers.length} donnée chiffrée`); }
  else details.push('Peu de données chiffrées ✗');
  // Liens externes — HTML or markdown fallback
  const htmlExtLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http')) htmlExtLinks.push(href);
  });
  const externalLinks = htmlExtLinks.length > 0 ? htmlExtLinks : mdExternalLinks(html, null);
  if (externalLinks.length >= 5) { score += 5; details.push(`${externalLinks.length} liens externes ✓`); }
  else if (externalLinks.length >= 2) { score += 3; details.push(`${externalLinks.length} liens externes`); }
  else if (externalLinks.length >= 1) { score += 1; details.push(`${externalLinks.length} lien externe`); }
  else details.push('Aucun lien externe identifié dans le contenu analysé ✗');
  // Dates
  const hasDate = html.includes('datePublished') || html.includes('dateModified') ||
    /\b(20\d{2})\b/.test(text.slice(0, 500)) || $('time[datetime]').length > 0;
  if (hasDate) { score += 4; details.push('Dates présentes ✓'); }
  else details.push('Aucune date visible ✗');
  // Tableaux et citations — HTML or markdown fallback
  const hasTable = $('table').length > 0 || (html.match(/^\|.+\|/gm) || []).length >= 3;
  if (hasTable) { score += 3; details.push('Tableaux de données ✓'); }
  if ($('blockquote').length > 0) { score += 1; details.push('Citations ✓'); }
  return { score: Math.min(score, 20), max: 20, detail: details.slice(0, 3).join(' · ') };
}

function scoreAuthority($, html) {
  let score = 0;
  const details = [];
  // Links — HTML or markdown fallback
  const htmlLinks = [];
  $('a[href]').each((_, el) => htmlLinks.push(($(el).attr('href') || '').toLowerCase()));
  const links = htmlLinks.length > 0 ? htmlLinks : mdAllLinks(html);
  // Base : site avec navigation
  score += 2; details.push('Site structuré ✓');
  // Contact
  const hasContact = links.some(l => l.includes('contact'));
  if (hasContact) { score += 3; details.push('Page Contact ✓'); }
  // Légal
  const hasLegal = links.some(l => l.includes('legal') || l.includes('mention') || l.includes('cgu') || l.includes('privacy') || l.includes('confidential'));
  if (hasLegal) { score += 2; details.push('Mentions légales ✓'); }
  // À propos
  const hasAbout = links.some(l => l.includes('about') || l.includes('propos'));
  if (hasAbout) { score += 2; details.push('Page À propos ✓'); }
  // Auteur (page, schema ou texte)
  const hasAuthorPage = links.some(l => l.includes('author') || l.includes('auteur') || l.includes('equipe') || l.includes('team'));
  const hasAuthorSchema = html.includes('"author"') || html.includes('rel="author"');
  const hasAuthorText = /par\s+[A-Z][a-z]+|by\s+[A-Z][a-z]+|rédigé par|written by/i.test(html);
  if (hasAuthorPage || hasAuthorSchema || hasAuthorText) { score += 3; details.push('Auteur identifié ✓'); }
  // Schema Organization/Person
  const hasOrgSchema = html.includes('"Organization"') || html.includes('"Person"');
  if (hasOrgSchema) { score += 3; details.push('Schema Organization/Person ✓'); }
  return { score: Math.min(score, 15), max: 15, detail: details.slice(0, 3).join(' · ') };
}

function scoreCrawlability($, html) {
  let score = 0;
  const details = [];
  // Base : site accessible
  score += 1;
  // Content length — HTML or raw fallback (markdown mode)
  const htmlTextLength = $('body').text().replace(/\s+/g, ' ').trim().length;
  const textLength = htmlTextLength > 100 ? htmlTextLength : html.replace(/\s+/g, ' ').trim().length;
  if (textLength > 3000) { score += 4; details.push(`${textLength} chars ✓`); }
  else if (textLength > 1000) { score += 3; details.push(`${textLength} chars`); }
  else if (textLength > 500) { score += 1; details.push(`${textLength} chars`); }
  else details.push('Contenu trop court ✗');
  if ($('html[lang]').length > 0) { score += 2; details.push('Lang défini ✓'); }
  if ($('link[rel="canonical"]').length > 0) { score += 2; details.push('Canonical ✓'); }
  const metaRobots = $('meta[name="robots"]').attr('content') || '';
  if (!metaRobots.includes('noindex')) { score += 3; details.push('Indexable ✓'); }
  else details.push('NOINDEX détecté ✗');
  if (html.includes('sitemap')) { score += 2; details.push('Sitemap ✓'); }
  if (html.includes('GPTBot') || html.includes('OAI-SearchBot') || html.includes('ClaudeBot')) {
    score += 1; details.push('Bots IA mentionnés ✓');
  }
  return { score: Math.min(score, 15), max: 15, detail: details.slice(0, 3).join(' · ') };
}

function scoreStructuredData($, html) {
  let score = 0;
  const details = [];
  // Base : HTML sémantique même sans JSON-LD
  const semanticCount = $('nav, main, article, section, header, footer').length;
  if (semanticCount >= 3) { score += 2; details.push('HTML sémantique ✓'); }
  else if (semanticCount >= 1) { score += 1; details.push('HTML partiellement sémantique'); }
  // JSON-LD schemas
  const schemaTypes = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      if (data['@type']) schemaTypes.push(data['@type']);
      if (Array.isArray(data['@graph'])) {
        data['@graph'].forEach(item => { if (item['@type']) schemaTypes.push(item['@type']); });
      }
    } catch {}
  });
  const highValueTypes = ['FAQPage', 'QAPage', 'HowTo', 'Article', 'BlogPosting'];
  const medValueTypes = ['Organization', 'Person', 'Product', 'Service', 'WebSite'];
  const hasHighValue = schemaTypes.some(t => highValueTypes.includes(t));
  const hasMedValue = schemaTypes.some(t => medValueTypes.includes(t));
  if (hasHighValue) { score += 5; details.push(`Schema prioritaire : ${schemaTypes.filter(t => highValueTypes.includes(t)).join(', ')} ✓`); }
  if (hasMedValue) { score += 3; details.push(`Schema entité : ${schemaTypes.filter(t => medValueTypes.includes(t)).join(', ')} ✓`); }
  if (schemaTypes.length > 0 && !hasHighValue && !hasMedValue) { score += 1; details.push(`Schema : ${schemaTypes[0]}`); }
  if (schemaTypes.length === 0) details.push('Aucun schema JSON-LD identifié ✗');
  return { score: Math.min(score, 10), max: 10, detail: details.slice(0, 2).join(' · ') || 'Aucun schema JSON-LD identifié dans le contenu analysé' };
}

function scoreExternalPresence($, html) {
  let score = 0;
  const details = [];
  // External links — HTML or markdown fallback
  const htmlExtLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http')) htmlExtLinks.push(href.toLowerCase());
  });
  const externalLinks = htmlExtLinks.length > 0 ? htmlExtLinks : mdExternalLinks(html, null).map(l => l.toLowerCase());
  // Base : a des liens externes
  if (externalLinks.length > 0) { score += 1; details.push('Liens externes présents ✓'); }
  const hasPress = /presse|média|press|featured|vu dans|as seen/i.test(html);
  const hasSocial = externalLinks.some(l => l.includes('linkedin') || l.includes('twitter') || l.includes('x.com') || l.includes('facebook') || l.includes('instagram') || l.includes('youtube'));
  const hasTestimonials = /témoignage|avis client|review|testimonial/i.test(html);
  if (hasPress) { score += 2; details.push('Mentions presse ✓'); }
  if (hasSocial) { score += 2; details.push('Réseaux sociaux ✓'); }
  if (hasTestimonials) { score += 1; details.push('Témoignages ✓'); }
  if (details.length === 0) details.push('Peu de présence externe identifiée dans le contenu analysé');
  return { score: Math.min(score, 5), max: 5, detail: details.join(' · ') };
}

function scoreFreshness($, html) {
  let score = 0;
  const details = [];
  const currentYear = new Date().getFullYear();
  // Base : une année quelconque est mentionnée
  if (/\b20\d{2}\b/.test(html)) { score += 1; details.push('Année présente'); }
  // Année récente
  const recentYearRegex = new RegExp(`\\b(${currentYear}|${currentYear - 1})\\b`);
  if (recentYearRegex.test(html)) { score += 1; details.push(`Contenu récent (${currentYear}) ✓`); }
  else details.push('Contenu possiblement daté ✗');
  // Date de mise à jour schema
  if (html.includes('dateModified')) { score += 2; details.push('Date de mise à jour ✓'); }
  // Copyright à jour
  if (new RegExp(`©\\s*${currentYear}`).test(html)) { score += 1; details.push('Copyright à jour ✓'); }
  return { score: Math.min(score, 5), max: 5, detail: details.join(' · ') || 'Fraîcheur non détectable' };
}

async function collectEvidence($, textContent, rawContent, url) {
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

  // 3. metaTitle & metaDescription — HTML or Jina header fallback
  const metaTitle = $('title').first().text().trim() || jinaTitle(rawContent) || '';
  const metaDescription = $('meta[name="description"]').attr('content') || jinaDescription(rawContent) || '';

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

  // 6. socialLinks — HTML or markdown fallback
  const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com'];
  const socialLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http') && socialDomains.some(d => href.includes(d)) && !socialLinks.includes(href)) {
      socialLinks.push(href);
    }
  });
  if (socialLinks.length === 0) {
    mdExternalLinks(rawContent, null).forEach(href => {
      if (socialDomains.some(d => href.includes(d)) && !socialLinks.includes(href)) socialLinks.push(href);
    });
  }

  // 7. images
  const totalImages = $('img').length;
  const imagesWithAlt = $('img[alt]').filter((_, el) => ($(el).attr('alt') || '').trim().length > 0).length;
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
  const copyrightMatch = rawContent.match(/©\s*(20\d{2})/);
  if (copyrightMatch) dates.copyright = copyrightMatch[1];
  const yearMatch = textContent.match(/\b(20\d{2})\b/);
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
  };
}

async function runClaudeAnalysis(url, textContent, scores) {
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

  const prompt = `Tu es un consultant GEO senior. Audite ${url}.

URL : ${url}
SCORE : ${total}/100
CRITÈRES SOUS LE SEUIL :
${criteriaList}

CONTENU (300 premiers caractères) :
${textContent.slice(0, 300)}

RÈGLES :
1. Génère EXACTEMENT 8 recommandations : 1 par critère sous le seuil + 1 pour la Neutralité éditoriale.
2. Chaque champ doit tenir en 1 phrase max (sauf howToDoIt : 2 phrases max).
3. Sois spécifique à ce site.
4. IMPORTANT : Utilise des formulations nuancées. Ne dis jamais "aucun X détecté" de façon absolue. Préfère "aucun X identifié dans le contenu analysé" ou "non trouvé dans le HTML accessible". Reconnais que le scraping peut être partiel.
5. Adapte tes recommandations de schemas au TYPE de site analysé. Par exemple :
   - Site e-commerce → Product, AggregateOffer, AggregateRating
   - SaaS/service → SoftwareApplication, Service, Organization
   - Blog/média → Article, BlogPosting, NewsArticle
   - Site corporate → Organization, Service, FAQPage
   - Site santé/assurance → MedicalOrganization, Service, FAQPage
   NE recommande PAS LocalBusiness pour un site qui n'est pas un commerce physique local.
6. Sois honnête dans ton verdict. Si le score semble bas à cause de limites de détection du scraping, mentionne-le.

JSON uniquement, sans markdown :
{"neutralityScore":<0-10>,"neutralityDetail":"<1 phrase>","recommendations":[{"priority":"high|medium|low","criterion":"<nom>","title":"<5 mots max>","diagnostic":"<1 phrase>","whyCritical":"<1 phrase>","whatToDo":"<1 phrase>","howToDoIt":"<2 phrases>","concreteExample":"<1 phrase>","expectedImpact":"<1 phrase>","expertTip":"<1 phrase>"}],"verdict":"<1 phrase>","strengths":["<1 phrase>","<1 phrase>"],"topPriority":"<1 phrase>"}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
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

async function runCitationTest(url, textContent, metaTitle, metaDescription) {
  const hostname = new URL(url).hostname.replace(/^www\./, '');
  const brand = metaTitle ? metaTitle.split(/[-|–·]/)[0].trim() : hostname;
  const intro = textContent.slice(0, 300);

  const prompt = `Tu es un expert en visibilité IA. On analyse le site ${url}. Voici son titre : ${brand}. Voici sa description : ${metaDescription || 'Non disponible'}. Voici les 300 premiers caractères de son contenu : ${intro}

Étape 1 — Génère 5 requêtes que des utilisateurs poseraient à ChatGPT ou Perplexity et pour lesquelles ce site DEVRAIT apparaître. Varie les niveaux de difficulté :
- 2 requêtes génériques (forte concurrence)
- 2 requêtes de niche (concurrence moyenne)
- 1 requête longue traîne (faible concurrence)

Étape 2 — Pour CHAQUE requête, simule la réponse que donnerait un moteur IA (ChatGPT/Perplexity). Cite les sources que tu recommanderais naturellement.

Étape 3 — Pour CHAQUE requête, analyse si le site ${hostname} ou la marque "${brand}" apparaît dans ta réponse, quels concurrents sont cités à la place, et la difficulté estimée pour être cité (facile/moyen/difficile).

Réponds UNIQUEMENT en JSON sans markdown :
{"tests":[{"query":"","difficulty":"générique|niche|longue_traîne","cited":false,"competitors_cited":[],"difficulty_to_rank":"facile|moyen|difficile","recommendation":"1 phrase concrète","ai_response_excerpt":"150 premiers caractères de la réponse simulée"}],"summary":{"cited_count":0,"total_tests":5,"best_opportunity":"requête où le site a le plus de chances","main_blocker":"raison principale"}}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  return JSON.parse(jsonMatch[0]);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const rawUrl = req.body.url;
  console.log('URL received:', rawUrl);
  if (!rawUrl) return res.status(400).json({ error: 'URL manquante' });
  const url = rawUrl.startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`;
  console.log('analyze: starting for', url);

  const cacheKey = `detekia:v11:${url.toLowerCase()}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Cache hit : ${cacheKey}`);
      return res.status(200).json(cached);
    }
  } catch (e) {
    console.error('Cache read error:', e.message);
  }

  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const { data: rawContent } = await axios.get(jinaUrl, {
      headers: { Accept: 'text/html' },
      timeout: 10000,
    });

    const $ = cheerio.load(rawContent);
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();

    if (textContent.length < 200) {
      return res.status(422).json({ error: "Impossible d'analyser ce site. Contenu trop court ou inaccessible." });
    }

    const metaTitle = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || jinaTitle(rawContent) || '';
    const metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || jinaDescription(rawContent) || '';

    const scores = {
      extractibility:   scoreExtractibility($, textContent, rawContent),
      verifiability:    scoreVerifiability($, textContent, rawContent),
      authority:        scoreAuthority($, rawContent),
      crawlability:     scoreCrawlability($, rawContent),
      structuredData:   scoreStructuredData($, rawContent),
      externalPresence: scoreExternalPresence($, rawContent),
      freshness:        scoreFreshness($, rawContent),
    };

    const [claude, evidence, citationTest] = await Promise.all([
      runClaudeAnalysis(url, textContent, scores),
      collectEvidence($, textContent, rawContent, url),
      runCitationTest(url, textContent, metaTitle, metaDescription).catch(e => { console.error('citationTest error:', e.message); return null; }),
    ]);
    const baseScore = Object.values(scores).reduce((s, c) => s + c.score, 0);
    const neutralityBonus = Math.round((claude.neutralityScore / 10) * 6) - 3;
    const totalScore = Math.max(0, Math.min(100, baseScore + neutralityBonus));

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
        { name: 'Extractibilité & réponse directe', ...scores.extractibility },
        { name: 'Vérifiabilité & preuves',          ...scores.verifiability },
        { name: 'Autorité & E-E-A-T',               ...scores.authority },
        { name: 'Crawlabilité IA',                  ...scores.crawlability },
        { name: 'Données structurées',              ...scores.structuredData },
        { name: 'Neutralité éditoriale',            score: claude.neutralityScore, max: 10, detail: claude.neutralityDetail },
        { name: 'Présence externe',                 ...scores.externalPresence },
        { name: 'Fraîcheur & maintenance',          ...scores.freshness },
      ],
      recommendations: claude.recommendations,
      evidence,
      citationTest: citationTest || null,
      sanityWarnings: sanityWarnings.length > 0 ? sanityWarnings : undefined,
    };

    // Réponse envoyée au client en premier — cache et email en fire-and-forget
    res.status(200).json(responseData);

    redis.set(cacheKey, responseData, { ex: CACHE_DURATION })
      .catch(e => console.error('Cache write error:', e.message));

    resend.emails.send({
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
          <p style="color: #8A8680; font-size: 12px;">Détails des critères :</p>
          ${responseData.criteria.map(c =>
            `<p style="font-size: 12px; margin: 4px 0;"><strong>${c.name}</strong> : ${c.score}/${c.max}</p>`
          ).join('')}
        </div>
      `,
    }).catch(e => console.log('Admin notification failed:', e.message));

  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ error: "Erreur lors de l'analyse", detail: err.message });
  }
}