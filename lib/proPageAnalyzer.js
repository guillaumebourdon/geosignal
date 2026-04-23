/**
 * Detekia Pro — Single page analyzer.
 * Replicates the analysis logic from analyze.js for use in the Pro multi-page worker.
 * Isolated module: does NOT import analyze.js.
 */

const Anthropic = require('@anthropic-ai/sdk').default;
const { Redis } = require('@upstash/redis');
const axios = require('axios');
const cheerio = require('cheerio');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const PRO_CACHE_PREFIX = 'detekia:pro:v1:page';
const PRO_CACHE_TTL = 7 * 24 * 60 * 60; // 7 days

// ── Markdown helpers ────────────────────────────────────────────────────────

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
  let m;
  while ((m = regex.exec(raw)) !== null) {
    if (!hostname || !m[2].includes(hostname)) links.push(m[2]);
  }
  return links;
}

function mdAllLinks(raw) {
  const regex = /\[([^\]]*)\]\(((?:https?:\/\/|\/)[^)\s]+)\)/g;
  const links = [];
  let m;
  while ((m = regex.exec(raw)) !== null) links.push(m[2].toLowerCase());
  return links;
}

function jinaTitle(raw) { return raw.match(/^Title:\s*(.+)/m)?.[1]?.trim() || ''; }
function jinaDescription(raw) { return raw.match(/^Description:\s*(.+)/m)?.[1]?.trim() || ''; }

// ── Scoring functions (identical to analyze.js) ─────────────────────────────

function scoreExtractibility($, text, raw) {
  let score = 0;
  score += 3; // content present
  const introWords = text.slice(0, 300).split(/\s+/).filter(w => w.length > 1).length;
  if (introWords > 30) score += 5; else if (introWords > 15) score += 3; else if (introWords > 5) score += 1;
  const listCount = Math.max($('ul li, ol li').length, (raw.match(/^[\-\*\+]\s+\S/gm) || []).length + (raw.match(/^\d+\.\s+\S/gm) || []).length);
  if (listCount >= 10) score += 5; else if (listCount >= 4) score += 3; else if (listCount >= 1) score += 1;
  const tableCount = $('table').length > 0 ? $('table').length : ((raw.match(/^\|.+\|/gm) || []).length >= 3 ? 1 : 0);
  if (tableCount >= 2) score += 4; else if (tableCount === 1) score += 2;
  const h2Count = Math.max($('h2').length, (raw.match(/^## .+/gm) || []).length);
  const h3Count = Math.max($('h3').length, (raw.match(/^### .+/gm) || []).length);
  if (h2Count >= 4) score += 5; else if (h2Count >= 2) score += 3; else if (h2Count >= 1) score += 1;
  if (h3Count >= 3) score += 1;
  const htmlShortParas = Array.from($('p')).filter(p => { const t = $(p).text().trim(); return t.length > 50 && t.length < 300; }).length;
  const mdShortParas = raw.split('\n').filter(l => { const t = l.trim(); return t.length > 50 && t.length < 300 && !/^[#|\-\*\d]/.test(t); }).length;
  const shortParas = htmlShortParas > 0 ? htmlShortParas : Math.min(mdShortParas, 10);
  if (shortParas >= 5) score += 5; else if (shortParas >= 2) score += 3; else if (shortParas >= 1) score += 1;
  return { score: Math.min(score, 25), max: 25 };
}

function scoreVerifiability($, text, html, siteHostname) {
  let score = 2;
  const numbers = text.match(/\d+[.,]?\d*\s*(%|€|\$|k|M|pts?|points?|fois|times|ans?|years?|mois|months?|jours?|days?)/gi) || [];
  if (numbers.length >= 5) score += 5; else if (numbers.length >= 2) score += 3; else if (numbers.length >= 1) score += 1;
  const htmlExtLinks = []; $('a[href]').each((_, el) => { const h = $(el).attr('href') || ''; if (h.startsWith('http')) htmlExtLinks.push(h); });
  const extLinks = htmlExtLinks.length > 0 ? htmlExtLinks : mdExternalLinks(html, siteHostname);
  if (extLinks.length >= 5) score += 5; else if (extLinks.length >= 2) score += 3; else if (extLinks.length >= 1) score += 1;
  const hasDate = html.includes('datePublished') || html.includes('dateModified') || /\b(20\d{2})\b/.test(text.slice(0, 500)) || $('time[datetime]').length > 0;
  if (hasDate) score += 4;
  if ($('table').length > 0 || (html.match(/^\|.+\|/gm) || []).length >= 3) score += 3;
  if ($('blockquote').length > 0) score += 1;
  return { score: Math.min(score, 20), max: 20 };
}

function scoreAuthority($, html) {
  let score = 2;
  const htmlLinks = []; $('a[href]').each((_, el) => htmlLinks.push(($(el).attr('href') || '').toLowerCase()));
  const links = htmlLinks.length > 0 ? htmlLinks : mdAllLinks(html);
  if (links.some(l => l.includes('contact'))) score += 3;
  if (links.some(l => l.includes('legal') || l.includes('mention') || l.includes('cgu') || l.includes('privacy') || l.includes('confidential'))) score += 2;
  if (links.some(l => l.includes('about') || l.includes('propos'))) score += 2;
  const hasAuthor = links.some(l => l.includes('author') || l.includes('auteur') || l.includes('equipe') || l.includes('team'))
    || html.includes('"author"') || html.includes('rel="author"')
    || /par\s+[A-Z][a-z]+|by\s+[A-Z][a-z]+|r.dig. par|written by/i.test(html);
  if (hasAuthor) score += 3;
  if (html.includes('"Organization"') || html.includes('"Person"')) score += 3;
  return { score: Math.min(score, 15), max: 15 };
}

function scoreCrawlability($, html) {
  let score = 1;
  const textLen = $('body').text().replace(/\s+/g, ' ').trim().length || html.replace(/\s+/g, ' ').trim().length;
  if (textLen > 3000) score += 4; else if (textLen > 1000) score += 3; else if (textLen > 500) score += 1;
  if ($('html[lang]').length > 0) score += 2;
  if ($('link[rel="canonical"]').length > 0) score += 2;
  const metaRobots = $('meta[name="robots"]').attr('content') || '';
  if (!metaRobots.includes('noindex')) score += 3;
  if (html.includes('sitemap')) score += 2;
  if (html.includes('GPTBot') || html.includes('OAI-SearchBot') || html.includes('ClaudeBot')) score += 1;
  return { score: Math.min(score, 15), max: 15 };
}

function scoreStructuredData($, html) {
  let score = 0;
  const semanticCount = $('nav, main, article, section, header, footer').length;
  if (semanticCount >= 3) score += 2; else if (semanticCount >= 1) score += 1;
  const schemaTypes = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      if (data['@type']) schemaTypes.push(data['@type']);
      if (Array.isArray(data['@graph'])) data['@graph'].forEach(item => { if (item['@type']) schemaTypes.push(item['@type']); });
    } catch {}
  });
  if (schemaTypes.length === 0) {
    (html.match(/"@type"\s*:\s*"([^"]+)"/g) || []).forEach(m => { const t = m.match(/"@type"\s*:\s*"([^"]+)"/)?.[1]; if (t && !schemaTypes.includes(t)) schemaTypes.push(t); });
  }
  const highValue = ['FAQPage', 'QAPage', 'HowTo', 'Article', 'BlogPosting'];
  const medValue = ['Organization', 'Person', 'Product', 'Service', 'WebSite'];
  if (schemaTypes.some(st => highValue.includes(st))) score += 5;
  if (schemaTypes.some(st => medValue.includes(st))) score += 3;
  if (schemaTypes.length > 0 && !schemaTypes.some(st => highValue.includes(st)) && !schemaTypes.some(st => medValue.includes(st))) score += 1;
  return { score: Math.min(score, 10), max: 10 };
}

function scoreExternalPresence($, html) {
  let score = 0;
  const htmlExtLinks = []; $('a[href]').each((_, el) => { const h = $(el).attr('href') || ''; if (h.startsWith('http')) htmlExtLinks.push(h.toLowerCase()); });
  const extLinks = htmlExtLinks.length > 0 ? htmlExtLinks : mdExternalLinks(html, null).map(l => l.toLowerCase());
  if (extLinks.length > 0) score += 1;
  if (/presse|m.dia|press|featured|vu dans|as seen/i.test(html)) score += 2;
  if (extLinks.some(l => l.includes('linkedin') || l.includes('twitter') || l.includes('x.com') || l.includes('facebook') || l.includes('instagram') || l.includes('youtube'))) score += 2;
  if (/t.moignage|avis client|review|testimonial/i.test(html)) score += 1;
  return { score: Math.min(score, 5), max: 5 };
}

function scoreFreshness($, html) {
  let score = 0;
  const currentYear = new Date().getFullYear();
  if (/\b20\d{2}\b/.test(html)) score += 1;
  if (new RegExp(`\\b(${currentYear}|${currentYear - 1})\\b`).test(html)) score += 1;
  if (html.includes('dateModified')) score += 2;
  if (new RegExp(`©\\s*${currentYear}`).test(html)) score += 1;
  return { score: Math.min(score, 5), max: 5 };
}

// ── Jina fetch with retry ───────────────────────────────────────────────────

async function fetchJina(url) {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const attempts = [{ timeout: 15000, wait: 0 }, { timeout: 20000, wait: 2000 }];
  let lastErr;
  for (const a of attempts) {
    if (a.wait > 0) await new Promise(r => setTimeout(r, a.wait));
    try {
      const { data } = await axios.get(jinaUrl, { headers: { Accept: 'text/html' }, timeout: a.timeout });
      return data;
    } catch (err) { lastErr = err; }
  }
  // Direct fallback
  try {
    const { data } = await axios.get(url, { timeout: 10000, maxRedirects: 5, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DetekiaBot/1.0; +https://detekia.fr)' } });
    const $ = cheerio.load(data);
    $('script, style, nav, footer').remove();
    const title = $('title').text() || $('h1').first().text() || '';
    const desc = $('meta[name="description"]').attr('content') || '';
    const body = $('body').text().replace(/\s+/g, ' ').trim();
    return `Title: ${title}\n\nURL Source: ${url}\n\nDescription: ${desc}\n\nMarkdown Content:\n${body}`;
  } catch {
    throw lastErr || new Error('All fetch attempts failed');
  }
}

// ── Claude calls with 429 retry ──────────────────────────────────────────────

async function callHaikuWithRetry(params, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await anthropic.messages.create(params);
    } catch (err) {
      const status = err?.status || err?.error?.status;
      if (status === 429 && attempt < maxRetries) {
        const retryAfter = Math.min(parseInt(err?.headers?.['retry-after'] || '30', 10), 60);
        console.log(`[proPageAnalyzer] 429 rate limit, waiting ${retryAfter}s (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        continue;
      }
      throw err;
    }
  }
}

async function runClaudeAnalysis(url, textContent, scores, locale) {
  const total = Object.values(scores).reduce((s, c) => s + c.score, 0);
  const criteriaBelow = [
    { key: 'extractibility', label: 'Extractibilite', max: 25 },
    { key: 'verifiability', label: 'Verifiabilite', max: 20 },
    { key: 'authority', label: 'Autorite E-E-A-T', max: 15 },
    { key: 'crawlability', label: 'Crawlabilite IA', max: 15 },
    { key: 'structuredData', label: 'Donnees structurees', max: 10 },
    { key: 'externalPresence', label: 'Presence externe', max: 5 },
    { key: 'freshness', label: 'Fraicheur', max: 5 },
  ].filter(c => scores[c.key].score / c.max < 0.8)
   .sort((a, b) => (scores[a.key].score / a.max) - (scores[b.key].score / b.max));

  const criteriaList = criteriaBelow.map(c => `- ${c.label} : ${scores[c.key].score}/${c.max}`).join('\n');

  const langInstruction = locale === 'en'
    ? `OUTPUT LANGUAGE: English (US). ALL text values MUST be in American English.\nCRITICAL: The "criterion" field MUST always use the FRENCH criterion name from this exact list: 'Extractibilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T', 'Crawlabilite IA', 'Donnees structurees', 'Neutralite editoriale', 'Presence externe', 'Fraicheur & maintenance'.`
    : `LANGUE DE SORTIE : Francais.`;

  const prompt = `${langInstruction}\n\nYou are a senior GEO consultant. Audit ${url}.\n\nURL: ${url}\nSCORE: ${total}/100\nCRITERIA BELOW THRESHOLD:\n${criteriaList}\n\nCONTENT (first 300 chars):\n${textContent.slice(0, 300)}\n\nRULES:\n1. Generate EXACTLY 8 recommendations.\n2. Each field 1 sentence max (howToDoIt: 2 sentences max).\n3. Be specific to this site.\n4. Use nuanced phrasing.\n5. Adapt schema recs to site type.\n\nJSON only:\n{"neutralityScore":<0-10>,"neutralityDetail":"<1 sentence>","recommendations":[{"priority":"high|medium|low","criterion":"<French criterion name>","title":"<5 words max>","diagnostic":"<1 sentence>","whyCritical":"<1 sentence>","whatToDo":"<1 sentence>","howToDoIt":"<2 sentences>","concreteExample":"<1 sentence>","expectedImpact":"<1 sentence>","expertTip":"<1 sentence>"}],"verdict":"<1 sentence>","strengths":["<1 sentence>","<1 sentence>"],"topPriority":"<1 sentence>"}`;

  const msg = await callHaikuWithRetry({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = msg.content[0].text;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in Claude response');
  return JSON.parse(jsonMatch[0]);
}

async function runCitationTest(url, textContent, metaTitle, metaDescription, locale) {
  const hostname = new URL(url).hostname.replace(/^www\./, '');
  const brand = metaTitle ? metaTitle.split(/[-|–·]/)[0].trim() : hostname;
  const langInstruction = locale === 'en'
    ? 'OUTPUT LANGUAGE: English (US). ALL text values MUST be in American English.'
    : 'LANGUE DE SORTIE : Francais.';

  const prompt = `${langInstruction}\n\nYou are an AI visibility expert analyzing ${url}. Title: ${brand}. Description: ${metaDescription || 'N/A'}. Content: ${textContent.slice(0, 300)}\n\nGenerate 10 queries users would ask ChatGPT/Perplexity about this site's domain. For each: simulate AI response, check if ${hostname} appears, list competitors cited, difficulty.\n\nJSON only:\n{"tests":[{"query":"","difficulty":"generic|niche|long_tail","cited":false,"competitors_cited":[],"difficulty_to_rank":"easy|medium|hard","recommendation":"1 sentence","ai_response_excerpt":"150 chars"}],"summary":{"cited_count":0,"total_tests":10,"best_opportunity":"","main_blocker":""}}`;

  const msg = await callHaikuWithRetry({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 5000,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = msg.content[0].text;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  return JSON.parse(jsonMatch[0]);
}

// ── Main analysis function ──────────────────────────────────────────────────

async function analyzePage(url, { locale = 'fr', timeoutMs = 50000 } = {}) {
  const cacheKey = `${PRO_CACHE_PREFIX}:${url.toLowerCase()}:${locale}`;

  // Check Pro cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached;
  } catch {}

  try {
    const rawContent = await fetchJina(url);
    const $ = cheerio.load(rawContent);
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();

    if (textContent.length < 100) {
      return { url, error: 'Content too short or inaccessible', analyzedAt: new Date().toISOString() };
    }

    const metaTitle = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || jinaTitle(rawContent) || '';
    const metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || jinaDescription(rawContent) || '';
    let siteHostname = null;
    try { siteHostname = new URL(url).hostname; } catch {}

    const scores = {
      extractibility: scoreExtractibility($, textContent, rawContent),
      verifiability: scoreVerifiability($, textContent, rawContent, siteHostname),
      authority: scoreAuthority($, rawContent),
      crawlability: scoreCrawlability($, rawContent),
      structuredData: scoreStructuredData($, rawContent),
      externalPresence: scoreExternalPresence($, rawContent),
      freshness: scoreFreshness($, rawContent),
    };

    const [claude, citationTest] = await Promise.all([
      runClaudeAnalysis(url, textContent, scores, locale),
      runCitationTest(url, textContent, metaTitle, metaDescription, locale).catch(() => null),
    ]);

    const baseScore = Object.values(scores).reduce((s, c) => s + c.score, 0);
    const neutralityBonus = Math.round((claude.neutralityScore / 10) * 6) - 3;
    const totalScore = Math.max(0, Math.min(100, baseScore + neutralityBonus));

    const result = {
      url,
      score: totalScore,
      verdict: claude.verdict,
      topPriority: claude.topPriority || '',
      strengths: claude.strengths || [],
      criteria: [
        { name: 'Extractibilite & reponse directe', ...scores.extractibility },
        { name: 'Verifiabilite & preuves', ...scores.verifiability },
        { name: 'Autorite & E-E-A-T', ...scores.authority },
        { name: 'Crawlabilite IA', ...scores.crawlability },
        { name: 'Donnees structurees', ...scores.structuredData },
        { name: 'Neutralite editoriale', score: claude.neutralityScore, max: 10 },
        { name: 'Presence externe', ...scores.externalPresence },
        { name: 'Fraicheur & maintenance', ...scores.freshness },
      ],
      recommendations: claude.recommendations,
      citationTest: citationTest || null,
      analyzedAt: new Date().toISOString(),
    };

    // Store in Pro cache
    try { await redis.set(cacheKey, result, { ex: PRO_CACHE_TTL }); } catch {}

    return result;
  } catch (err) {
    return { url, error: err.message, analyzedAt: new Date().toISOString() };
  }
}

module.exports = { analyzePage };
