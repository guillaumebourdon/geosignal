import axios from 'axios';
import * as cheerio from 'cheerio';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Règles fixes ──────────────────────────────────────────────
function runFixedRules(html, $) {
  const results = {};

  // 1. Données structurées
  const hasSchema = html.includes('application/ld+json');
  const schemaTypes = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      if (data['@type']) schemaTypes.push(data['@type']);
    } catch {}
  });
  results.structuredData = {
    score: hasSchema ? (schemaTypes.length >= 2 ? 18 : 12) : 2,
    max: 20,
    detail: hasSchema ? `Schema détecté : ${schemaTypes.join(', ')}` : 'Aucun schema.org détecté',
  };

  // 2. Architecture & pages clés
  const links = [];
  $('a[href]').each((_, el) => links.push($(el).attr('href').toLowerCase()));
  const hasAbout   = links.some(l => l.includes('about') || l.includes('propos'));
  const hasContact = links.some(l => l.includes('contact'));
  const hasBlog    = links.some(l => l.includes('blog') || l.includes('article') || l.includes('news'));
  const hasFaq     = links.some(l => l.includes('faq'));
  const pageScore  = [hasAbout, hasContact, hasBlog, hasFaq].filter(Boolean).length;
  results.architecture = {
    score: Math.round((pageScore / 4) * 20),
    max: 20,
    detail: `Pages trouvées : ${[hasAbout && 'À propos', hasContact && 'Contact', hasBlog && 'Blog', hasFaq && 'FAQ'].filter(Boolean).join(', ') || 'aucune'}`,
  };

  // 3. Accessibilité crawlers
  const textLength  = $('body').text().replace(/\s+/g, ' ').trim().length;
  const hasMetaDesc = $('meta[name="description"]').length > 0;
  const hasH1       = $('h1').length > 0;
  const crawlScore  = (textLength > 500 ? 8 : 3) + (hasMetaDesc ? 6 : 0) + (hasH1 ? 4 : 0) + 2;
  results.crawlability = {
    score: Math.min(crawlScore, 20),
    max: 20,
    detail: `Texte : ${textLength} caractères · Meta description : ${hasMetaDesc ? '✓' : '✗'} · H1 : ${hasH1 ? '✓' : '✗'}`,
  };

  return results;
}

// ── Analyse Claude ────────────────────────────────────────────
async function runClaudeAnalysis(url, textContent) {
  const prompt = `Tu es un expert en GEO (Generative Engine Optimization) — l'art d'optimiser un site pour être bien cité et référencé par les IA comme ChatGPT, Claude, Gemini et Perplexity.

Analyse ce contenu extrait du site ${url} et évalue 3 critères sur 20 chacun.

CONTENU DU SITE :
${textContent.slice(0, 3000)}

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, avec exactement cette structure :
{
  "identity": {
    "score": <nombre entre 0 et 20>,
    "max": 20,
    "detail": "<explication courte en français>"
  },
  "citability": {
    "score": <nombre entre 0 et 20>,
    "max": 20,
    "detail": "<explication courte en français>"
  },
  "externalPresence": {
    "score": <nombre entre 0 et 20>,
    "max": 20,
    "detail": "<explication courte en français>"
  },
  "recommendations": [
    { "priority": "high",   "text": "<recommandation concrète>" },
    { "priority": "high",   "text": "<recommandation concrète>" },
    { "priority": "medium", "text": "<recommandation concrète>" },
    { "priority": "medium", "text": "<recommandation concrète>" },
    { "priority": "low",    "text": "<recommandation concrète>" }
  ],
  "verdict": "<2 phrases de synthèse sur la présence GEO du site>"
}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text;
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

// ── Handler principal ─────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL manquante' });

  try {
    // 1. Scraping via Jina AI
    const jinaUrl = `https://r.jina.ai/${url}`;
    const { data: rawContent } = await axios.get(jinaUrl, {
      headers: { Accept: 'text/html' },
      timeout: 15000,
    });

    // 2. Parse HTML avec cheerio
    const $ = cheerio.load(rawContent);
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();

    // 3. Règles fixes
    const fixed = runFixedRules(rawContent, $);

    // 4. Analyse Claude
    const claude = await runClaudeAnalysis(url, textContent);

    // 5. Score global
    const totalScore =
      fixed.structuredData.score +
      fixed.architecture.score +
      fixed.crawlability.score +
      claude.identity.score +
      claude.citability.score +
      claude.externalPresence.score;

    // 6. Réponse
    res.status(200).json({
      score: totalScore,
      verdict: claude.verdict,
      criteria: [
        { name: 'Données structurées',   ...fixed.structuredData },
        { name: "Clarté de l'identité",  ...claude.identity },
        { name: 'Citabilité du contenu', ...claude.citability },
        { name: 'Architecture & pages',  ...fixed.architecture },
        { name: 'Accessibilité crawlers',...fixed.crawlability },
        { name: 'Présence externe',      ...claude.externalPresence },
      ],
      recommendations: claude.recommendations,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'analyse", detail: err.message });
  }
}