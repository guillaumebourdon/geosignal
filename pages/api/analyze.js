import axios from 'axios';
import * as cheerio from 'cheerio';
import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CACHE_DURATION = 24 * 60 * 60; // 24h en secondes

function scoreStructuredData(html, $) {
  const schemaTypes = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      if (data['@type']) schemaTypes.push(data['@type']);
    } catch {}
  });
  const count = schemaTypes.length;
  const score = count === 0 ? 0 : count === 1 ? 8 : count === 2 ? 14 : 20;
  return {
    score,
    max: 20,
    detail: count > 0 ? `Schema détecté : ${schemaTypes.join(', ')}` : 'Aucun schema.org détecté',
  };
}

function scoreIdentity($) {
  const hasTitle    = $('title').length > 0 && $('title').text().trim().length > 5;
  const hasMetaDesc = $('meta[name="description"]').length > 0;
  const hasH1       = $('h1').length > 0;
  const hasOgTitle  = $('meta[property="og:title"]').length > 0;
  const hasOgDesc   = $('meta[property="og:description"]').length > 0;
  const count       = [hasTitle, hasMetaDesc, hasH1, hasOgTitle, hasOgDesc].filter(Boolean).length;
  return {
    score: Math.round((count / 5) * 20),
    max: 20,
    detail: `Title: ${hasTitle?'✓':'✗'} · Meta desc: ${hasMetaDesc?'✓':'✗'} · H1: ${hasH1?'✓':'✗'} · OG Title: ${hasOgTitle?'✓':'✗'} · OG Desc: ${hasOgDesc?'✓':'✗'}`,
  };
}

function scoreCitability($) {
  const text       = $('body').text().replace(/\s+/g, ' ').trim();
  const words      = text.split(' ').length;
  const hasNumbers = /\d+/.test(text);
  const paragraphs = $('p').length;
  const hasLists   = $('ul, ol').length > 0;
  const hasQuotes  = $('blockquote').length > 0;

  let score = 0;
  if (words > 300)    score += 5;
  if (words > 800)    score += 3;
  if (words > 1500)   score += 2;
  if (hasNumbers)     score += 4;
  if (paragraphs > 3) score += 3;
  if (hasLists)       score += 2;
  if (hasQuotes)      score += 1;

  return {
    score: Math.min(score, 20),
    max: 20,
    detail: `${words} mots · ${paragraphs} paragraphes · Données chiffrées: ${hasNumbers?'✓':'✗'} · Listes: ${hasLists?'✓':'✗'}`,
  };
}

function scoreArchitecture($) {
  const links = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) links.push(href.toLowerCase());
  });
  const hasAbout   = links.some(l => l.includes('about') || l.includes('propos'));
  const hasContact = links.some(l => l.includes('contact'));
  const hasBlog    = links.some(l => l.includes('blog') || l.includes('article') || l.includes('news'));
  const hasFaq     = links.some(l => l.includes('faq'));
  const count      = [hasAbout, hasContact, hasBlog, hasFaq].filter(Boolean).length;
  return {
    score: Math.round((count / 4) * 20),
    max: 20,
    detail: `Pages : ${[hasAbout&&'À propos', hasContact&&'Contact', hasBlog&&'Blog', hasFaq&&'FAQ'].filter(Boolean).join(', ') || 'aucune détectée'}`,
  };
}

function scoreCrawlability($) {
  const text       = $('body').text().replace(/\s+/g, ' ').trim();
  const textLength = text.length;
  const hasMetaDesc = $('meta[name="description"]').length > 0;
  const hasH1       = $('h1').length > 0;
  const hasCanon    = $('link[rel="canonical"]').length > 0;
  const hasLang     = $('html[lang]').length > 0;

  let score = 0;
  if (textLength > 500)  score += 5;
  if (textLength > 2000) score += 3;
  if (hasMetaDesc) score += 4;
  if (hasH1)       score += 4;
  if (hasCanon)    score += 2;
  if (hasLang)     score += 2;

  return {
    score: Math.min(score, 20),
    max: 20,
    detail: `${textLength} caractères · Meta desc: ${hasMetaDesc?'✓':'✗'} · H1: ${hasH1?'✓':'✗'} · Canonical: ${hasCanon?'✓':'✗'} · Lang: ${hasLang?'✓':'✗'}`,
  };
}

function scoreExternalPresence($, html) {
  const externalLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http')) externalLinks.push(href.toLowerCase());
  });
  const hasTestimonials = /témoignage|avis|review|testimonial|client/i.test(html);
  const hasPress        = /presse|média|press|featured|vu dans|as seen/i.test(html);
  const hasSocial       = externalLinks.some(l => l.includes('linkedin') || l.includes('twitter') || l.includes('facebook') || l.includes('instagram'));
  const hasPartners     = /partenaire|partner|certifi|label/i.test(html);
  const extCount        = externalLinks.length;

  let score = 0;
  if (extCount > 0)    score += 3;
  if (extCount > 5)    score += 2;
  if (hasTestimonials) score += 5;
  if (hasPress)        score += 5;
  if (hasSocial)       score += 3;
  if (hasPartners)     score += 2;

  return {
    score: Math.min(score, 20),
    max: 20,
    detail: `${extCount} liens externes · Témoignages: ${hasTestimonials?'✓':'✗'} · Presse: ${hasPress?'✓':'✗'} · Réseaux sociaux: ${hasSocial?'✓':'✗'}`,
  };
}

async function runClaudeAnalysis(url, textContent, scores) {
  const prompt = `Tu es un expert en GEO (Generative Engine Optimization).

Voici les scores obtenus pour le site ${url} :
- Données structurées : ${scores.structuredData.score}/20
- Clarté de l'identité : ${scores.identity.score}/20
- Citabilité : ${scores.citability.score}/20
- Architecture : ${scores.architecture.score}/20
- Accessibilité crawlers : ${scores.crawlability.score}/20
- Présence externe : ${scores.externalPresence.score}/20

Extrait du contenu :
${textContent.slice(0, 2000)}

Réponds UNIQUEMENT en JSON valide :
{
  "recommendations": [
    { "priority": "high",   "text": "<action concrète à faire en priorité>" },
    { "priority": "high",   "text": "<action concrète à faire en priorité>" },
    { "priority": "medium", "text": "<action concrète importante>" },
    { "priority": "medium", "text": "<action concrète importante>" },
    { "priority": "low",    "text": "<amélioration bonus>" }
  ],
  "verdict": "<2 phrases de synthèse sur la présence GEO du site>"
}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw     = message.content[0].text;
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL manquante' });

  const cacheKey = `detekia:${url.toLowerCase().trim()}`;

  // Vérifier le cache Upstash
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Cache hit : ${cacheKey}`);
      return res.status(200).json(cached);
    }
  } catch (e) {
    console.error('Cache read error:', e);
  }

  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const { data: rawContent } = await axios.get(jinaUrl, {
      headers: { Accept: 'text/html' },
      timeout: 15000,
    });

    const $           = cheerio.load(rawContent);
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();

    if (textContent.length < 200) {
      return res.status(422).json({
        error: "Impossible d'analyser ce site. Le contenu est trop court ou inaccessible.",
      });
    }

    const scores = {
      structuredData:   scoreStructuredData(rawContent, $),
      identity:         scoreIdentity($),
      citability:       scoreCitability($),
      architecture:     scoreArchitecture($),
      crawlability:     scoreCrawlability($),
      externalPresence: scoreExternalPresence($, rawContent),
    };

    const claude = await runClaudeAnalysis(url, textContent, scores);
    const totalScore = Object.values(scores).reduce((sum, s) => sum + s.score, 0);

    const responseData = {
      score: totalScore,
      verdict: claude.verdict,
      criteria: [
        { name: 'Données structurées',    ...scores.structuredData },
        { name: "Clarté de l'identité",   ...scores.identity },
        { name: 'Citabilité du contenu',  ...scores.citability },
        { name: 'Architecture & pages',   ...scores.architecture },
        { name: 'Accessibilité crawlers', ...scores.crawlability },
        { name: 'Présence externe',       ...scores.externalPresence },
      ],
      recommendations: claude.recommendations,
    };

    // Sauvegarder dans Upstash avec expiration 24h
    try {
      await redis.set(cacheKey, responseData, { ex: CACHE_DURATION });
      console.log(`Cache set : ${cacheKey}`);
    } catch (e) {
      console.error('Cache write error:', e);
    }

    return res.status(200).json(responseData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'analyse", detail: err.message });
  }
}