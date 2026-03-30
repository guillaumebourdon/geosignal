import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const config = { maxDuration: 30 };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CACHE_DURATION = 24 * 60 * 60;

function scoreExtractibility($, text) {
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
  // Lists
  const listCount = $('ul li, ol li').length;
  if (listCount >= 10) { score += 5; details.push(`${listCount} éléments de liste ✓`); }
  else if (listCount >= 4) { score += 3; details.push(`${listCount} éléments de liste`); }
  else if (listCount >= 1) { score += 1; details.push(`${listCount} élément de liste`); }
  else details.push('Peu de listes ✗');
  // Tables
  const tableCount = $('table').length;
  if (tableCount >= 2) { score += 4; details.push(`${tableCount} tableaux ✓`); }
  else if (tableCount === 1) { score += 2; details.push('1 tableau'); }
  // H2 structure
  const h2Count = $('h2').length;
  if (h2Count >= 4) { score += 5; details.push('Structure H2 riche ✓'); }
  else if (h2Count >= 2) { score += 3; details.push('Structure H2 correcte'); }
  else if (h2Count >= 1) { score += 1; details.push('1 H2 présent'); }
  else details.push('Aucun H2 ✗');
  // Short paragraphs
  const paragraphs = $('p');
  const shortParas = Array.from(paragraphs).filter(p => {
    const txt = $(p).text().trim();
    return txt.length > 50 && txt.length < 300;
  }).length;
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
  // Liens externes
  const externalLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http')) externalLinks.push(href);
  });
  if (externalLinks.length >= 5) { score += 5; details.push(`${externalLinks.length} liens externes ✓`); }
  else if (externalLinks.length >= 2) { score += 3; details.push(`${externalLinks.length} liens externes`); }
  else if (externalLinks.length >= 1) { score += 1; details.push(`${externalLinks.length} lien externe`); }
  else details.push('Aucun lien externe ✗');
  // Dates
  const hasDate = html.includes('datePublished') || html.includes('dateModified') ||
    /\b(20\d{2})\b/.test(text.slice(0, 500)) || $('time[datetime]').length > 0;
  if (hasDate) { score += 4; details.push('Dates présentes ✓'); }
  else details.push('Aucune date visible ✗');
  // Tableaux et citations
  if ($('table').length > 0) { score += 3; details.push('Tableaux de données ✓'); }
  if ($('blockquote').length > 0) { score += 1; details.push('Citations ✓'); }
  return { score: Math.min(score, 20), max: 20, detail: details.slice(0, 3).join(' · ') };
}

function scoreAuthority($, html) {
  let score = 0;
  const details = [];
  const links = [];
  $('a[href]').each((_, el) => links.push(($(el).attr('href') || '').toLowerCase()));
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
  const textLength = $('body').text().replace(/\s+/g, ' ').trim().length;
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
  if (schemaTypes.length === 0) details.push('Aucun schema.org JSON-LD ✗');
  return { score: Math.min(score, 10), max: 10, detail: details.slice(0, 2).join(' · ') || 'Aucun schema.org détecté' };
}

function scoreExternalPresence($, html) {
  let score = 0;
  const details = [];
  const externalLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http')) externalLinks.push(href.toLowerCase());
  });
  // Base : a des liens externes
  if (externalLinks.length > 0) { score += 1; details.push('Liens externes présents ✓'); }
  const hasPress = /presse|média|press|featured|vu dans|as seen/i.test(html);
  const hasSocial = externalLinks.some(l => l.includes('linkedin') || l.includes('twitter') || l.includes('x.com') || l.includes('facebook') || l.includes('instagram') || l.includes('youtube'));
  const hasTestimonials = /témoignage|avis client|review|testimonial/i.test(html);
  if (hasPress) { score += 2; details.push('Mentions presse ✓'); }
  if (hasSocial) { score += 2; details.push('Réseaux sociaux ✓'); }
  if (hasTestimonials) { score += 1; details.push('Témoignages ✓'); }
  if (details.length === 0) details.push('Peu de présence externe détectée');
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

  // 2. headings
  const headings = [];
  $('h1, h2, h3').each((_, el) => {
    const level = el.tagName.toLowerCase();
    const text = $(el).text().trim();
    if (text) headings.push({ level, text });
  });

  // 3. metaTitle & metaDescription
  const metaTitle = $('title').first().text().trim() || '';
  const metaDescription = $('meta[name="description"]').attr('content') || '';

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

  // 6. socialLinks
  const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com'];
  const socialLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http') && socialDomains.some(d => href.includes(d)) && !socialLinks.includes(href)) {
      socialLinks.push(href);
    }
  });

  // 7. images
  const totalImages = $('img').length;
  const imagesWithAlt = $('img[alt]').filter((_, el) => ($(el).attr('alt') || '').trim().length > 0).length;
  const images = { withAlt: imagesWithAlt, total: totalImages };

  // 8. externalLinks count
  let externalLinksCount = 0;
  try {
    const hostname = new URL(normalizedUrl).hostname;
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.startsWith('http') && !href.includes(hostname)) externalLinksCount++;
    });
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

SCORES : ${total}/100
${criteriaList}

CONTENU : ${textContent.slice(0, 300)}

Génère 1 recommandation par critère ci-dessus + 1 sur la Neutralité éditoriale.
RÈGLE ABSOLUE : chaque valeur de champ = exactement 1 phrase courte (max 15 mots). Zéro exception.

JSON uniquement, sans markdown :
{"neutralityScore":<0-10>,"neutralityDetail":"<1 phrase>","recommendations":[{"priority":"high|medium|low","criterion":"<nom>","title":"<5 mots max>","diagnostic":"<1 phrase>","whyCritical":"<1 phrase>","whatToDo":"<1 phrase>","howToDoIt":"<1 phrase>","concreteExample":"<1 phrase>","expectedImpact":"<1 phrase>","expertTip":"<1 phrase>"}],"verdict":"<1 phrase>","strengths":["<1 phrase>","<1 phrase>"],"topPriority":"<1 phrase>"}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    temperature: 0,
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

async function runCitationTest(url, textContent, metaTitle) {
  const hostname = new URL(url).hostname.replace(/^www\./, '');
  const brand = metaTitle ? metaTitle.split(/[-|–·]/)[0].trim() : hostname;
  const intro = textContent.slice(0, 400);

  const prompt = `Tu es un moteur de recherche IA. En te basant sur le contenu suivant, génère une question pertinente qu'un utilisateur pourrait poser (type "Quelle agence X recommandes-tu à Paris ?" ou "Quel outil Y choisir pour Z ?"), puis réponds naturellement comme ChatGPT ou Perplexity en citant des sources réelles dans ce domaine.

Site : ${url}
Titre : ${brand}
Extrait : ${intro}

Ensuite, analyse ta propre réponse :
1. Est-ce que le site ${hostname} ou la marque "${brand}" apparaît dans ta réponse ?
2. Si non, quels sites/marques apparaissent à la place ?
3. Pourquoi ce site n'est-il pas cité ? (1 phrase courte)

Réponds UNIQUEMENT en JSON sans markdown :
{"cited":true,"competitors_cited":[],"reason_not_cited":"","test_query":"","ai_response_excerpt":""}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
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

  const cacheKey = `detekia:v10:${url.toLowerCase()}`;

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
      timeout: 20000,
    });

    const $ = cheerio.load(rawContent);
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();

    if (textContent.length < 200) {
      return res.status(422).json({ error: "Impossible d'analyser ce site. Contenu trop court ou inaccessible." });
    }

    const metaTitle = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';

    const scores = {
      extractibility:   scoreExtractibility($, textContent),
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
      runCitationTest(url, textContent, metaTitle).catch(e => { console.error('citationTest error:', e.message); return null; }),
    ]);
    const baseScore = Object.values(scores).reduce((s, c) => s + c.score, 0);
    const neutralityBonus = Math.round((claude.neutralityScore / 10) * 6) - 3;
    const totalScore = Math.max(0, Math.min(100, baseScore + neutralityBonus));

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
    };

    try {
      await redis.set(cacheKey, responseData, { ex: CACHE_DURATION });
    } catch (e) {
      console.error('Cache write error:', e.message);
    }

    return res.status(200).json(responseData);

  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ error: "Erreur lors de l'analyse", detail: err.message });
  }
}