/**
 * Detekia Pro — Single page analyzer.
 * Replicates the analysis logic from analyze.js for use in the Pro multi-page worker.
 * Isolated module: does NOT import analyze.js.
 */

const Anthropic = require('@anthropic-ai/sdk').default;
const { Redis } = require('@upstash/redis');
const axios = require('axios');
const cheerio = require('cheerio');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 60000 });
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const PRO_CACHE_PREFIX = 'detekia:pro:v6:page'; // v6: inject detected signals in prompt to prevent false absence claims
const PRO_CACHE_TTL = 7 * 24 * 60 * 60; // 7 days

// ── Markdown helpers ────────────────────────────────────────────────────────

const { mdHeadings, mdExternalLinks, mdAllLinks, jinaTitle, jinaDescription } = require('./markdownHelpers');

// ── Scoring functions (shared module — single source of truth) ──────────────

const { scoreExtractibility, scoreVerifiability, scoreAuthority, scoreCrawlability, scoreStructuredData, scoreExternalPresence, scoreFreshness } = require('./scoring');

// ── Jina fetch with retry ───────────────────────────────────────────────────

async function fetchJina(url) {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const attempts = [{ timeout: 15000, wait: 0 }, { timeout: 20000, wait: 2000 }];
  let lastErr;
  for (const a of attempts) {
    if (a.wait > 0) await new Promise(r => setTimeout(r, a.wait));
    try {
      const jinaHeaders = { Accept: 'text/html' };
      if (process.env.JINA_API_KEY) jinaHeaders.Authorization = `Bearer ${process.env.JINA_API_KEY}`;
      const { data } = await axios.get(jinaUrl, { headers: jinaHeaders, timeout: a.timeout });
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
const { callWithRetry } = require('./anthropicRetry');
function callHaikuWithRetry(params, maxRetries = 3) { return callWithRetry(anthropic, params, maxRetries); }

async function runClaudeAnalysis(url, textContent, scores, locale, detectedSignals = '') {
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

  const today = new Date().toISOString().split('T')[0];
  const langInstruction = locale === 'en'
    ? `OUTPUT LANGUAGE: English (US). ALL text values MUST be in American English.\nCRITICAL: The "criterion" field MUST always use the FRENCH criterion name from this exact list: 'Extractibilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T', 'Crawlabilite IA', 'Donnees structurees', 'Neutralite editoriale', 'Presence externe', 'Fraicheur & maintenance'.`
    : `LANGUE DE SORTIE : Francais.`;

  const PATTERN_IDS = `IMPORTANT — Each recommendation MUST include a "patternId" field from this list:
- Extractibilite: intro-quality, heading-structure, list-structure, paragraph-calibration, content-depth
- Verifiabilite: add-external-sources, add-legal-proofs, add-social-proofs, document-methodology, add-case-studies
- Autorite: author-expertise, about-page, schema-organization, certifications, trust-signals
- Crawlabilite: semantic-html, robots-llms-txt, core-web-vitals, meta-descriptions, sitemap-canonical
- Donnees structurees: schema-organization, schema-article, schema-faq, schema-product, schema-breadcrumb
- Neutralite: reduce-promotional-tone, add-limitations, balanced-comparison, factual-rewriting
- Presence: backlinks-strategy, social-presence, press-mentions, community-engagement
- Fraicheur: add-dates-schema, update-content, publication-calendar, revision-timestamps
Choose the closest patternId. Use "other" ONLY if nothing fits.`;

  const prompt = `${langInstruction}

TODAY'S DATE: ${today}. The year 2026 is the CURRENT year. Dates in 2026 are RECENT, NOT future.

VOCABULARY CALIBRATION (mandatory):
<30% = catastrophique | 30-50% = faible | 50-70% = moyen | 70-85% = bon | >85% = excellent
FORBIDDEN above 50%: catastrophique, grave, lacune critique, défaillant, alarmant.
Above 50%, acceptable words: moyen, à améliorer, perfectible, insuffisant, modéré.

You are a senior GEO consultant. Audit ${url}.

URL: ${url}
SCORE: ${total}/100
CRITERIA BELOW THRESHOLD:
${criteriaList}

CONTENT (first 300 chars):
${textContent.slice(0, 300)}

ALREADY DETECTED ON THIS PAGE (do NOT recommend adding elements that are already present):
${detectedSignals}

${PATTERN_IDS}

RULES:
1. Generate EXACTLY 8 recommendations.
2. "problem": 3-5 sentences describing what is wrong and its impact.
3. "solution": 3-5 sentences describing the fix concretely.
4. "technicalImplementation": array of 2-4 concrete steps.
5. "codeExample": actual code snippet when relevant, null otherwise.
6. Be specific to this site.
7. Adapt schema recs to site type.
8. The "criterion" field MUST use the FRENCH criterion name from the exact list above.

JSON only, no markdown fences:
{"neutralityScore":<0-10>,"neutralityDetail":"<1 sentence>","recommendations":[{"priority":"high|medium|low","criterion":"<French criterion name>","patternId":"<from list above>","title":"<5 words max>","problem":"<3-5 sentences>","solution":"<3-5 sentences>","technicalImplementation":["step 1","step 2","step 3"],"codeExample":"<code or null>","impact":"high|medium|low","effort":"low|medium|high","timeframe":"<e.g. 1-2 semaines>"}],"verdict":"<1 sentence>","strengths":["<1 sentence>","<1 sentence>"],"topPriority":"<1 sentence>"}`;

  const msg = await callHaikuWithRetry({
    model: 'claude-4-sonnet-20250514',
    max_tokens: 8192,
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
    model: 'claude-4-sonnet-20250514',
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
    // Fetch content via Jina (for readable text) AND direct HTML (for technical signals)
    const [rawContent, directHtml] = await Promise.all([
      fetchJina(url),
      axios.get(url, { timeout: 10000, maxRedirects: 5, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DetekiaBot/1.0; +https://detekia.fr)' } })
        .then(r => r.data)
        .catch(() => null),
    ]);

    const $ = cheerio.load(rawContent);
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();

    if (textContent.length < 100) {
      return { url, error: 'Content too short or inaccessible', analyzedAt: new Date().toISOString() };
    }

    // Use direct HTML for structured data, meta tags, and authority signals (Jina strips <script> tags)
    const $html = directHtml ? cheerio.load(directHtml) : $;

    const metaTitle = $html('title').text().trim() || $('meta[property="og:title"]').attr('content') || jinaTitle(rawContent) || '';
    const metaDescription = $html('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || jinaDescription(rawContent) || '';
    let siteHostname = null;
    try { siteHostname = new URL(url).hostname; } catch {}

    // Extract social links from direct HTML for scoring
    const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com'];
    const socialExclude = ['analytics.twitter', 'platform.twitter', 'adsct', 'connect.facebook', 'staticxx.facebook'];
    const directSocialLinks = [];
    if (directHtml) {
      const $d = cheerio.load(directHtml);
      $d('a[href]').each((_, el) => {
        const href = ($d(el).attr('href') || '').trim();
        if (href.startsWith('http') && socialDomains.some(d => href.includes(d)) && !socialExclude.some(e => href.includes(e)) && !directSocialLinks.includes(href))
          directSocialLinks.push(href);
      });
    }

    const locale_ = locale || 'fr';
    const scores = {
      extractibility: scoreExtractibility($, textContent, rawContent, locale_),
      verifiability: scoreVerifiability($, textContent, rawContent, siteHostname, locale_),
      authority: scoreAuthority($html, directHtml || rawContent, locale_, directHtml || ''),
      crawlability: scoreCrawlability($html, directHtml || rawContent, locale_, directHtml || ''),
      structuredData: scoreStructuredData($html, directHtml || rawContent, locale_),
      externalPresence: scoreExternalPresence($, rawContent, locale_, { socialLinks: directSocialLinks }),
      freshness: scoreFreshness($html, directHtml || rawContent, locale_),
    };

    // Build detected signals summary so Sonnet doesn't recommend adding things already present
    const signalParts = [];
    if (metaTitle) signalParts.push(`Meta title: "${metaTitle}"`);
    if (metaDescription) signalParts.push(`Meta description: "${metaDescription.substring(0, 80)}..."`);
    // Check schemas from direct HTML
    const detectedSchemas = [];
    $html('script[type="application/ld+json"]').each((_, el) => {
      try {
        const d = JSON.parse($html(el).html());
        if (d['@type']) detectedSchemas.push(d['@type']);
        if (Array.isArray(d['@graph'])) d['@graph'].forEach(item => { if (item['@type']) detectedSchemas.push(item['@type']); });
      } catch {}
    });
    if (detectedSchemas.length) signalParts.push(`JSON-LD schemas: ${detectedSchemas.join(', ')}`);
    else signalParts.push('JSON-LD schemas: NONE');
    // Check dates
    if (directHtml && directHtml.includes('datePublished')) signalParts.push('datePublished: present in JSON-LD');
    if (directHtml && directHtml.includes('dateModified')) signalParts.push('dateModified: present in JSON-LD');
    // Check author
    const authorMatch = directHtml && directHtml.match(/"author"[^}]*"name"\s*:\s*"([^"]+)"/);
    if (authorMatch) signalParts.push(`Author in JSON-LD: "${authorMatch[1]}"`);
    const detectedSignals = signalParts.join('\n') || 'No technical signals detected';

    const [claude, citationTest] = await Promise.all([
      runClaudeAnalysis(url, textContent, scores, locale, detectedSignals),
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
