import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CACHE_DURATION = 24 * 60 * 60;

function scoreExtractibility($, text) {
  let score = 0;
  const details = [];
  const intro = text.slice(0, 300);
  const hasDirectAnswer = intro.split(' ').length > 30;
  if (hasDirectAnswer) { score += 5; details.push('Intro substantielle ✓'); }
  else details.push('Intro trop courte ✗');
  const listCount = $('ul li, ol li').length;
  if (listCount >= 10) { score += 5; details.push(`${listCount} éléments de liste ✓`); }
  else if (listCount >= 4) { score += 3; details.push(`${listCount} éléments de liste`); }
  else details.push('Peu de listes ✗');
  const tableCount = $('table').length;
  if (tableCount >= 2) { score += 5; details.push(`${tableCount} tableaux ✓`); }
  else if (tableCount === 1) { score += 3; details.push('1 tableau'); }
  else details.push('Aucun tableau ✗');
  const h2Count = $('h2').length;
  if (h2Count >= 4) { score += 5; details.push('Structure H2/H3 riche ✓'); }
  else if (h2Count >= 2) { score += 3; details.push('Structure H2/H3 correcte'); }
  else details.push('Structure de titres faible ✗');
  const paragraphs = $('p');
  const shortParas = Array.from(paragraphs).filter(p => {
    const txt = $(p).text().trim();
    return txt.length > 50 && txt.length < 300;
  }).length;
  if (shortParas >= 5) { score += 5; details.push(`${shortParas} paragraphes bien calibrés ✓`); }
  else if (shortParas >= 3) { score += 3; details.push(`${shortParas} paragraphes corrects`); }
  else details.push('Paragraphes trop longs ou absents ✗');
  return { score: Math.min(score, 25), max: 25, detail: details.slice(0, 3).join(' · ') };
}

function scoreVerifiability($, text, html) {
  let score = 0;
  const details = [];
  const numbers = text.match(/\d+[.,]?\d*\s*(%|€|\$|k|M|pts?|points?|fois|ans?|mois|jours?)/gi) || [];
  if (numbers.length >= 5) { score += 5; details.push(`${numbers.length} données chiffrées ✓`); }
  else if (numbers.length >= 2) { score += 3; details.push(`${numbers.length} données chiffrées`); }
  else details.push('Peu de données chiffrées ✗');
  const externalLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http')) externalLinks.push(href);
  });
  if (externalLinks.length >= 5) { score += 5; details.push(`${externalLinks.length} liens vers sources ✓`); }
  else if (externalLinks.length >= 2) { score += 3; details.push(`${externalLinks.length} liens externes`); }
  else details.push('Peu de sources citées ✗');
  const hasDate = html.includes('datePublished') || html.includes('dateModified') ||
    /\b(20\d{2})\b/.test(text.slice(0, 500)) || $('time[datetime]').length > 0;
  if (hasDate) { score += 4; details.push('Dates présentes ✓'); }
  else details.push('Aucune date visible ✗');
  if ($('table').length > 0) { score += 4; details.push('Tableaux de données ✓'); }
  if ($('blockquote').length > 0) { score += 2; details.push('Citations présentes ✓'); }
  return { score: Math.min(score, 20), max: 20, detail: details.slice(0, 3).join(' · ') };
}

function scoreAuthority($, html) {
  let score = 0;
  const details = [];
  const links = [];
  $('a[href]').each((_, el) => links.push(($(el).attr('href') || '').toLowerCase()));
  const hasAuthorPage = links.some(l => l.includes('author') || l.includes('auteur') || l.includes('equipe') || l.includes('team'));
  if (hasAuthorPage) { score += 3; details.push('Page auteur ✓'); }
  else details.push('Pas de page auteur ✗');
  const hasAuthorSchema = html.includes('"author"') || html.includes('rel="author"');
  const hasAuthorText = /par\s+[A-Z][a-z]+|by\s+[A-Z][a-z]+|rédigé par|written by/i.test(html);
  if (hasAuthorSchema || hasAuthorText) { score += 3; details.push('Auteur identifié ✓'); }
  else details.push('Auteur non identifié ✗');
  const hasAbout = links.some(l => l.includes('about') || l.includes('propos'));
  if (hasAbout) { score += 2; details.push('Page À propos ✓'); }
  const hasContact = links.some(l => l.includes('contact'));
  const hasLegal = links.some(l => l.includes('legal') || l.includes('mention') || l.includes('cgu') || l.includes('privacy'));
  if (hasContact) score += 2;
  if (hasLegal) score += 2;
  if (hasContact && hasLegal) details.push('Contact + Légal ✓');
  else if (hasContact || hasLegal) details.push('Contact ou Légal ✓');
  const hasOrgSchema = html.includes('"Organization"') || html.includes('"Person"');
  if (hasOrgSchema) { score += 3; details.push('Schema Organization/Person ✓'); }
  return { score: Math.min(score, 15), max: 15, detail: details.slice(0, 3).join(' · ') };
}

function scoreCrawlability($, html) {
  let score = 0;
  const details = [];
  const textLength = $('body').text().replace(/\s+/g, ' ').trim().length;
  if (textLength > 3000) { score += 4; details.push(`${textLength} chars ✓`); }
  else if (textLength > 1000) { score += 2; details.push(`${textLength} chars`); }
  else details.push('Contenu trop court ✗');
  if ($('html[lang]').length > 0) { score += 2; details.push('Lang défini ✓'); }
  if ($('link[rel="canonical"]').length > 0) { score += 2; details.push('Canonical ✓'); }
  const metaRobots = $('meta[name="robots"]').attr('content') || '';
  if (!metaRobots.includes('noindex')) { score += 3; details.push('Indexable ✓'); }
  else details.push('NOINDEX détecté ✗');
  if (html.includes('sitemap')) { score += 2; details.push('Sitemap ✓'); }
  if (html.includes('GPTBot') || html.includes('OAI-SearchBot') || html.includes('ClaudeBot')) {
    score += 2; details.push('Bots IA mentionnés ✓');
  }
  return { score: Math.min(score, 15), max: 15, detail: details.slice(0, 3).join(' · ') };
}

function scoreStructuredData($, html) {
  let score = 0;
  const details = [];
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
  if (schemaTypes.length === 0) details.push('Aucun schema.org ✗');
  if (hasHighValue && $('h2').length > 2) { score += 2; details.push('Schema cohérent ✓'); }
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
  const hasPress = /presse|média|press|featured|vu dans|as seen/i.test(html);
  const hasSocial = externalLinks.some(l => l.includes('linkedin') || l.includes('twitter') || l.includes('facebook') || l.includes('instagram'));
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
  if (html.includes('dateModified')) { score += 2; details.push('Date de mise à jour ✓'); }
  const recentYearRegex = new RegExp(`\\b(${currentYear}|${currentYear - 1})\\b`);
  if (recentYearRegex.test(html)) { score += 2; details.push(`Contenu récent (${currentYear}) ✓`); }
  else details.push('Contenu possiblement daté ✗');
  if (new RegExp(`©\\s*${currentYear}`).test(html)) { score += 1; details.push('Copyright à jour ✓'); }
  return { score: Math.min(score, 5), max: 5, detail: details.join(' · ') || 'Fraîcheur non détectable' };
}

async function runClaudeAnalysis(url, textContent, scores) {
  const total = Object.values(scores).reduce((s, c) => s + c.score, 0);

  const prompt = `Tu es un consultant GEO senior. Audite le site ${url}.

SCORES :
- Extractibilité : ${scores.extractibility.score}/25 — ${scores.extractibility.detail}
- Vérifiabilité : ${scores.verifiability.score}/20 — ${scores.verifiability.detail}
- Autorité E-E-A-T : ${scores.authority.score}/15 — ${scores.authority.detail}
- Crawlabilité IA : ${scores.crawlability.score}/15 — ${scores.crawlability.detail}
- Données structurées : ${scores.structuredData.score}/10 — ${scores.structuredData.detail}
- Présence externe : ${scores.externalPresence.score}/5 — ${scores.externalPresence.detail}
- Fraîcheur : ${scores.freshness.score}/5 — ${scores.freshness.detail}
TOTAL : ${total}/100

CONTENU (extrait) :
${textContent.slice(0, 400)}

Génère des recommandations pour chaque critère sous 80% du max.
IMPORTANT : génère TOUJOURS une recommandation sur la "Neutralité éditoriale" en analysant le ton du contenu extrait ci-dessus (trop promotionnel ? claims non sourcés ? langage biaisé ?).

Structure selon priorité :
- CRITIQUE (high) : diagnostic, whyCritical, whatToDo, howToDoIt, concreteExample, expectedImpact, expertTip
- IMPORTANT (medium) : diagnostic, whyCritical, whatToDo, howToDoIt, expectedImpact
- BONUS (low) : diagnostic, whatToDo, expectedImpact

Chaque champ : 1-2 phrases max.

JSON uniquement :
{
  "neutralityScore": <0-10>,
  "neutralityDetail": "<1 phrase>",
  "recommendations": [
    {
      "priority": "high",
      "criterion": "<nom du critère>",
      "title": "<titre court>",
      "diagnostic": "<1-2 phrases>",
      "whyCritical": "<1-2 phrases>",
      "whatToDo": "<1-2 phrases>",
      "howToDoIt": "<1-2 phrases>",
      "concreteExample": "<1-2 phrases>",
      "expectedImpact": "<1 phrase>",
      "expertTip": "<1 phrase>"
    }
  ],
  "verdict": "<2 phrases>",
  "strengths": ["<point 1>", "<point 2>"],
  "topPriority": "<1 phrase>"
}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 3000,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text;
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL manquante' });

  const cacheKey = `detekia:v8:${url.toLowerCase().trim()}`;

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

    const scores = {
      extractibility:   scoreExtractibility($, textContent),
      verifiability:    scoreVerifiability($, textContent, rawContent),
      authority:        scoreAuthority($, rawContent),
      crawlability:     scoreCrawlability($, rawContent),
      structuredData:   scoreStructuredData($, rawContent),
      externalPresence: scoreExternalPresence($, rawContent),
      freshness:        scoreFreshness($, rawContent),
    };

    const claude = await runClaudeAnalysis(url, textContent, scores);
    const baseScore = Object.values(scores).reduce((s, c) => s + c.score, 0);
    const neutralityBonus = Math.round((claude.neutralityScore / 10) * 10) - 5;
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