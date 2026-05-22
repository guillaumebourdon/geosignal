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

const PRO_CACHE_PREFIX = 'detekia:pro:v8:page'; // v8: scoring V2 — 7 criteria, 100 pts, GEO research-based
const PRO_CACHE_TTL = 7 * 24 * 60 * 60; // 7 days

// ── Markdown helpers ────────────────────────────────────────────────────────

const { mdHeadings, mdExternalLinks, mdAllLinks, jinaTitle, jinaDescription } = require('./markdownHelpers');

// ── Scoring functions (shared module — single source of truth) ──────────────

const { scoreCitability, scoreVerifiability, scoreAuthority, scoreAccessibility, scoreExternalPresence, scoreFreshness } = require('./scoring');
const { classifyPage, pageImportanceWeight, PAGE_TYPE_BENCHMARKS } = require('./pageClassifier');

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

function detectSiteType(url, textContent, $) {
  const t = textContent.toLowerCase();
  const hostname = (() => { try { return new URL(url).hostname.toLowerCase(); } catch { return ''; } })();
  // SaaS signals (check BEFORE e-commerce — SaaS sites often mention "prix", "produit" too)
  if (/pricing|tarif|plan.gratuit|free.plan|start.free|essai.gratuit|free.trial|sign.up|s.inscrire|dashboard|api\b|integrations|saas|logiciel|software|platform/i.test(t.slice(0, 3000)) ||
      /\.app$|\.io$|\.dev$|\.tools$|\.ai$|\.co$/.test(hostname)) return 'saas';
  // E-commerce signals (strong signals only)
  if ($('script[type="application/ld+json"]').text().includes('"Product"') ||
      /panier|cart|add.to.cart|acheter|buy.now|ajouter.au.panier|\bshop\b|boutique/i.test(t.slice(0, 2000)) ||
      /shop\.|store\.|boutique/i.test(hostname)) return 'ecommerce';
  if (/blog\.|magazine\.|journal\.|news\.|media\./i.test(hostname) ||
      $('article').length >= 2 || (t.match(/publi[eé]|posted|written by|par\s+[A-Z]/g) || []).length >= 3) return 'blog';
  if (/agence|agency|cabinet|conseil|consulting|studio|freelance|prestation|nos.services|our.services|expertise/i.test(t.slice(0, 2000))) return 'agency';
  if (/horaires|opening.hours|rendez-vous|appointment|nous.trouver|find.us/i.test(t.slice(0, 2000)) &&
      /restaurant|salon|clinique|cabinet|garage|boulangerie|coiffeur|dentiste/i.test(t)) return 'local';
  if (/investor|actionnaire|shareholders|rapport.annuel|annual.report|careers|recrutement/i.test(t.slice(0, 3000))) return 'corporate';
  return 'generic';
}

function getRecommendedSchemas(siteType, existingSchemas) {
  const map = {
    ecommerce: ['Product', 'AggregateRating', 'FAQPage', 'BreadcrumbList', 'Offer'],
    saas: ['SoftwareApplication', 'FAQPage', 'HowTo', 'Service', 'Organization'],
    blog: ['Article', 'BlogPosting', 'FAQPage', 'BreadcrumbList', 'Person'],
    agency: ['Service', 'FAQPage', 'Organization', 'Person', 'HowTo'],
    local: ['LocalBusiness', 'FAQPage', 'Review', 'PostalAddress', 'OpeningHoursSpecification'],
    corporate: ['Organization', 'FAQPage', 'Article', 'Person', 'WebSite'],
    generic: ['Organization', 'FAQPage', 'WebSite', 'BreadcrumbList', 'Article'],
  };
  const recommended = map[siteType] || map.generic;
  const existing = existingSchemas.map(s => s.toLowerCase());
  return recommended.filter(s => !existing.some(e => e.toLowerCase() === s.toLowerCase()));
}

async function runClaudeAnalysis(url, textContent, scores, locale, detectedSignals = '', siteType = 'generic', missingSchemas = []) {
  const total = Object.values(scores).reduce((s, c) => s + c.score, 0);
  const criteriaBelow = [
    { key: 'citability', label: 'Citabilite & reponse directe', max: 25 },
    { key: 'verifiability', label: 'Verifiabilite & preuves', max: 20 },
    { key: 'authority', label: 'Autorite & E-E-A-T', max: 15 },
    { key: 'accessibility', label: 'Accessibilite IA', max: 10 },
    { key: 'externalPresence', label: 'Presence externe', max: 10 },
    { key: 'freshness', label: 'Fraicheur & signaux temporels', max: 10 },
  ].filter(c => scores[c.key].score / c.max < 0.8)
   .sort((a, b) => (scores[a.key].score / a.max) - (scores[b.key].score / b.max));

  const criteriaList = criteriaBelow.map(c => `- ${c.label} : ${scores[c.key].score}/${c.max} — ${scores[c.key].detail}`).join('\n');

  // Full criteria scores for anti-contradiction
  const allCriteriaDefs = [
    { key: 'citability', label: 'Citabilite & reponse directe', max: 25 },
    { key: 'verifiability', label: 'Verifiabilite & preuves', max: 20 },
    { key: 'authority', label: 'Autorite & E-E-A-T', max: 15 },
    { key: 'accessibility', label: 'Accessibilite IA', max: 10 },
    { key: 'externalPresence', label: 'Presence externe', max: 10 },
    { key: 'freshness', label: 'Fraicheur & signaux temporels', max: 10 },
  ];
  const allScoresSummary = allCriteriaDefs.map(c =>
    `${c.label}: ${scores[c.key].score}/${c.max} (${Math.round(scores[c.key].score / c.max * 100)}%) — ${scores[c.key].detail}`
  ).join('\n');

  const today = new Date().toISOString().split('T')[0];
  const langInstruction = locale === 'en'
    ? `OUTPUT LANGUAGE: English (US). ALL text values MUST be in American English.\nCRITICAL: The "criterion" field MUST always use the FRENCH criterion name from this exact list: 'Citabilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T', 'Accessibilite IA', 'Neutralite editoriale', 'Presence externe', 'Fraicheur & signaux temporels'.`
    : `LANGUE DE SORTIE : Francais.`;

  const PATTERN_IDS = `IMPORTANT — Each recommendation MUST include a "patternId" field from this list:
- Citabilite: answer-capsules, front-loading, heading-questions, content-depth, modular-paragraphs
- Verifiabilite: add-external-sources, add-statistics, add-expert-quotations, add-dates, add-comparison-tables
- Autorite: author-expertise, about-page, schema-organization, trust-signals, definitive-language
- Accessibilite: ai-bots-robots-txt, semantic-html, meta-descriptions, sitemap-canonical, content-rendering
- Neutralite: reduce-promotional-tone, add-limitations, balanced-comparison, factual-rewriting
- Presence: social-presence, press-mentions, community-engagement, testimonials, multi-platform
- Fraicheur: add-dates-schema, update-content, publication-calendar, revision-timestamps, dateModified
Choose the closest patternId. Use "other" ONLY if nothing fits.`;

  const prompt = `${langInstruction}

TODAY'S DATE: ${today}. The year 2026 is the CURRENT year. Dates in 2026 are RECENT, NOT future.

VOCABULARY CALIBRATION (mandatory):
<30% = catastrophique | 30-50% = faible | 50-70% = moyen | 70-85% = bon | >85% = excellent
FORBIDDEN above 50%: catastrophique, grave, lacune critique, défaillant, alarmant.
Above 50%, acceptable words: moyen, à améliorer, perfectible, insuffisant, modéré.

You are a senior GEO consultant. Audit ${url}.

URL: ${url}
OVERALL SCORE: ${total}/100
SITE TYPE DETECTED: ${siteType}

ALL CRITERIA SCORES (FACTS — your text MUST be consistent with these):
${allScoresSummary}

CRITERIA BELOW 80% THRESHOLD (need recommendations):
${criteriaList}

CONTENT (first 300 chars):
${textContent.slice(0, 300)}

ALREADY DETECTED ON THIS PAGE (do NOT recommend adding elements that are already present):
${detectedSignals}
${missingSchemas.length > 0 ? `MISSING SCHEMAS FOR THIS SITE TYPE (${siteType}): ${missingSchemas.join(', ')}` : ''}

${PATTERN_IDS}

RULES:
0. ANTI-CONTRADICTION RULE (CRITICAL): Your text MUST be consistent with the scores AND the detected signals above. If a criterion scores ≥80%, do NOT say it is missing, absent, or not evaluated. If a criterion scores <40%, do NOT say it is well-handled. Use the detail strings as factual evidence. IMPORTANT: When referring to headings (H1, H2, H3), meta title, or social media, use the EXACT counts and values from the "ALREADY DETECTED" section — do NOT invent different numbers or truncate values.
1. Generate EXACTLY 7 recommendations.
2. "problem": 3-5 sentences describing what is wrong and its impact.
3. "solution": 3-5 sentences describing the fix concretely.
4. "technicalImplementation": array of 2-4 concrete steps.
5. "codeExample": actual code snippet when relevant, null otherwise. IMPORTANT: When code examples contain placeholder values (opening hours, prices, addresses, names), add an HTML comment "<!-- Adaptez avec vos vraies valeurs -->" at the top so the client knows these are illustrative, not extracted from their site.
6. Be specific to this site.
7. STRUCTURED DATA RULES — Site type is "${siteType}".
   If score 0/10 (no schemas): recommend the most impactful schema for this site type, name the EXACT type.
   If score 3+/10 (basic schemas present): do NOT recommend "adding more schemas". Instead, recommend ONE of: enrich existing schema properties (add missing fields), improve HTML semantics (<article>, <section>, <nav> instead of <div>), fix heading hierarchy, add BreadcrumbList, or add structured content patterns (definition lists, comparison tables).
   Title must be specific (e.g., "Enrich Organization schema properties", "Semantic HTML for AI parsing"), NEVER generic "add structured data".
8. The "criterion" field MUST use the FRENCH criterion name from the exact list above.

NEUTRALITY SCORING RULES:
- 8-10: Factual, sourced, no superlatives, educational tone
- 5-7: Mostly factual with some promotional language
- 3-4: Clearly promotional with unproven claims
- 0-2: Aggressive marketing, clickbait, misleading claims

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
  const parsed = JSON.parse(jsonMatch[0]);

  // Post-process: fix contradictions between Claude text and actual scores
  return postProcessRecommendations(parsed, scores);
}

function postProcessRecommendations(claude, scores) {
  const criterionToKey = {
    'Citabilite & reponse directe': 'citability',
    'Extractibilité & réponse directe': 'extractibility',
    'Verifiabilite & preuves': 'verifiability',
    'Vérifiabilité & preuves': 'verifiability',
    'Autorite & E-E-A-T': 'authority',
    'Autorité & E-E-A-T': 'authority',
    'Accessibilite IA': 'accessibility',
    'Crawlabilité IA': 'crawlability',
    'Données structurées': 'structuredData',
    'Neutralite editoriale': null,
    'Neutralité éditoriale': null,
    'Presence externe': 'externalPresence',
    'Présence externe': 'externalPresence',
    'Fraicheur & signaux temporels': 'freshness',
    'Fraîcheur & maintenance': 'freshness',
  };

  const absencePatterns = /n[''\u2019](?:est|a) pas [eé]t[eé] (?:d[eé]tect|[eé]valu|identifi|trouv)[eé]|pas d[''\u2019]information|non [eé]valu[eé]|pas identifi[eé]|aucun(?:e)? (?:signal|donn[eé]e|schema|lien)|not evaluated|not assessed|no data|no information|absent|not found|not detected|introuvable|inexistant|manquant|missing|lacking|no evidence|we couldn.t find|we did not detect|n.a pas .t. d.tect/i;
  const positivePatterns = /bien g[eé]r[eé]|bien optimis[eé]|excellent|well.handled|well.optimized|already.good|d[eé]j[aà] bon|solide|strong|tr[eè]s bon|parfaitement optimis[eé]|aucun probl[eè]me|no issues|perfect|flawless/i;

  if (claude.recommendations && Array.isArray(claude.recommendations)) {
    claude.recommendations = claude.recommendations.map(reco => {
      const key = criterionToKey[reco.criterion];
      if (!key || !scores[key]) return reco;
      const pct = scores[key].score / scores[key].max;
      if (pct >= 0.8 && reco.problem && absencePatterns.test(reco.problem)) {
        console.log(`[post-process] FIXED: ${reco.criterion} ${Math.round(pct*100)}% but says absent`);
        reco.problem = reco.problem.replace(absencePatterns, 'peut encore être amélioré');
      }
      if (pct < 0.4 && reco.problem && positivePatterns.test(reco.problem)) {
        console.log(`[post-process] FIXED: ${reco.criterion} ${Math.round(pct*100)}% but says well-handled`);
        reco.problem = reco.problem.replace(positivePatterns, 'nécessite une attention particulière');
      }
      return reco;
    });
  }

  if (typeof claude.neutralityScore === 'number' && !isNaN(claude.neutralityScore)) {
    claude.neutralityScore = Math.max(0, Math.min(10, Math.round(claude.neutralityScore)));
  } else {
    claude.neutralityScore = 5; // safe default if missing or NaN
  }
  // Validate recommendations is an array
  if (!claude.recommendations || !Array.isArray(claude.recommendations)) {
    claude.recommendations = [];
  }
  // Remove recos for criteria already at max score
  claude.recommendations = claude.recommendations.filter(reco => {
    const key = criterionToKey[reco.criterion];
    if (!key || !scores[key]) return true;
    if (scores[key].score === scores[key].max) {
      console.log(`[post-process] REMOVED reco for ${reco.criterion} — already at max`);
      return false;
    }
    return true;
  });

  if (!claude.verdict || claude.verdict.trim().length < 10) {
    claude.verdict = 'Analyse complétée. Consultez les recommandations ci-dessous.';
  }
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
    let rawContent, directHtml;
    try {
      [rawContent, directHtml] = await Promise.all([
        fetchJina(url),
        axios.get(url, { timeout: 10000, maxRedirects: 5, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DetekiaBot/1.0; +https://detekia.fr)' } })
          .then(r => r.data)
          .catch(() => null),
      ]);
    } catch (jinaErr) {
      // Jina failed — try direct HTML as fallback
      directHtml = await axios.get(url, { timeout: 10000, maxRedirects: 5, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DetekiaBot/1.0; +https://detekia.fr)' } }).then(r => r.data).catch(() => null);
      if (directHtml && typeof directHtml === 'string') {
        const $fb = cheerio.load(directHtml);
        $fb('script, style').remove();
        if ($fb('body').text().replace(/\s+/g, ' ').trim().length > 500) {
          console.log(`[proPageAnalyzer] Jina failed for ${url}, using direct HTML fallback`);
          rawContent = directHtml;
        }
      }
      // Last resort: Browserless headless Chrome
      if (!rawContent) {
        const { fetchRenderedHtml } = require('./browserless');
        const rendered = await fetchRenderedHtml(url);
        if (rendered) {
          const $br = cheerio.load(rendered);
          $br('script, style').remove();
          if ($br('body').text().replace(/\s+/g, ' ').trim().length > 500) {
            console.log(`[proPageAnalyzer] Using Browserless fallback for ${url}`);
            rawContent = rendered;
            directHtml = rendered;
          }
        }
      }
      if (!rawContent) return { url, error: 'Scraping failed: ' + jinaErr.message.slice(0, 50), analyzedAt: new Date().toISOString() };
    }

    const $ = cheerio.load(rawContent);
    let textContent = $('body').text().replace(/\s+/g, ' ').trim();

    // If direct HTML has significantly more text than Jina, use it for text analysis
    if (directHtml && typeof directHtml === 'string') {
      const $dh = cheerio.load(directHtml);
      $dh('script, style, noscript').remove();
      const directText = $dh('body').text().replace(/\s+/g, ' ').trim();
      if (directText.length > textContent.length) {
        console.log(`[proPageAnalyzer] Direct HTML text (${directText.length} chars) richer than Jina (${textContent.length}) — using direct HTML`);
        textContent = directText;
      }
    }

    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
    if (textContent.length < 500 || wordCount < 100) {
      const isAntiBot = /cf-browser-verification|cloudflare|challenge-platform|just a moment|captcha|please verify|bot detection|access denied|403 forbidden/i.test(rawContent);
      return { url, error: isAntiBot
        ? 'Site protected by anti-bot system (Cloudflare or similar). Whitelist user-agent "DetekiaBot" or contact hello@detekia.fr.'
        : 'Content too short or inaccessible (anti-bot, JS-only, or empty page). If this is your site, whitelist "DetekiaBot" or contact hello@detekia.fr.',
        analyzedAt: new Date().toISOString() };
    }

    // Use direct HTML for structured data, meta tags, and authority signals (Jina strips <script> tags)
    const $html = directHtml ? cheerio.load(directHtml) : $;

    const htmlTitle = $html('title').text().trim() || '';
    const ogTitle = $html('meta[property="og:title"]').attr('content')?.trim() || '';
    const metaTitle = (ogTitle.length > htmlTitle.length ? ogTitle : htmlTitle) || jinaTitle(rawContent) || '';
    const metaDescription = $html('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || jinaDescription(rawContent) || '';
    let siteHostname = null;
    try { siteHostname = new URL(url).hostname; } catch {}

    // Extract social links from direct HTML for scoring
    const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com', 'tiktok.com', 'snapchat.com', 'pinterest.com', 'threads.net'];
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
    // Fetch robots.txt for accessibility scoring
    let proRobotsTxt = '';
    try {
      const origin = new URL(url).origin;
      const robotsRes = await axios.get(`${origin}/robots.txt`, { timeout: 3000 }).catch(e => e);
      if (robotsRes.status === 200) proRobotsTxt = String(robotsRes.data || '').slice(0, 500);
      else if (robotsRes.response?.status === 404) proRobotsTxt = 'Aucun fichier robots.txt (404)';
      else proRobotsTxt = 'Non accessible';
    } catch { proRobotsTxt = 'Non accessible'; }

    const scores = {
      citability:       scoreCitability($, textContent, rawContent, locale_, directHtml || ''),
      verifiability:    scoreVerifiability($, textContent, rawContent, siteHostname, locale_),
      authority:        scoreAuthority($html, directHtml || rawContent, locale_, directHtml || ''),
      accessibility:    scoreAccessibility($html, directHtml || rawContent, locale_, directHtml || '', proRobotsTxt),
      externalPresence: scoreExternalPresence($, rawContent, locale_, { socialLinks: directSocialLinks }),
      freshness:        scoreFreshness($html, directHtml || rawContent, locale_),
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
    // Detect embedded content (iframes) from both Jina and direct HTML
    const proIframes = [];
    const scanIframes = (cheerioInst) => {
      cheerioInst('iframe[src]').each((_, el) => {
        const src = (cheerioInst(el).attr('src') || '');
        if (src.includes('youtube.com') || src.includes('youtu.be')) proIframes.push('YouTube');
        if (src.includes('google.com/maps') || src.includes('maps.google')) proIframes.push('Google Maps');
        if (src.includes('facebook.com')) proIframes.push('Facebook');
        if (src.includes('tripadvisor')) proIframes.push('TripAdvisor');
        if (src.includes('trustpilot')) proIframes.push('Trustpilot');
        if (src.includes('instagram.com')) proIframes.push('Instagram');
        if (src.includes('tiktok.com')) proIframes.push('TikTok');
        if (src.includes('spotify.com')) proIframes.push('Spotify');
        if (src.includes('calendly.com')) proIframes.push('Calendly');
        if (src.includes('typeform.com')) proIframes.push('Typeform');
      });
    };
    scanIframes($);
    if (directHtml) scanIframes(cheerio.load(directHtml));
    const uniqueProIframes = [...new Set(proIframes)];
    if (uniqueProIframes.length) signalParts.push(`Embedded content (iframes): ${uniqueProIframes.join(', ')}`);
    // Headings structure — same logic as analyze.js: direct HTML if has headings, else Markdown
    let h1Count = 0, h2Count = 0, h3Count = 0;
    if (directHtml) {
      const $d = cheerio.load(directHtml);
      const dh1 = $d('h1').length, dh2 = $d('h2').length, dh3 = $d('h3').length;
      if (dh1 + dh2 + dh3 > 0) { h1Count = dh1; h2Count = dh2; h3Count = dh3; }
    }
    if (h1Count + h2Count + h3Count === 0) {
      h1Count = (rawContent.match(/^# (?!#)[^\n]+/gm) || []).length;
      h2Count = (rawContent.match(/^## (?!#)[^\n]+/gm) || []).length;
      h3Count = (rawContent.match(/^### (?!#)[^\n]+/gm) || []).length;
    }
    signalParts.push(`Headings: ${h1Count} H1, ${h2Count} H2, ${h3Count} H3 (total ${h1Count + h2Count + h3Count} heading elements)`);
    // Social media links for signals
    const detectedSocials = [];
    const proAllLinks = [];
    $('a[href]').each((_, el) => { const h = $(el).attr('href') || ''; if (h.startsWith('http')) proAllLinks.push(h); });
    if (directHtml) { const $d = cheerio.load(directHtml); $d('a[href]').each((_, el) => { const h = ($d(el).attr('href') || ''); if (h.startsWith('http')) proAllLinks.push(h); }); }
    proAllLinks.forEach(h => { socialDomains.forEach(d => { if (h.includes(d) && !detectedSocials.includes(d)) detectedSocials.push(d); }); });
    if (detectedSocials.length) signalParts.push(`Social media detected: ${detectedSocials.join(', ')}`);
    else signalParts.push('Social media: NONE detected');
    // robots.txt quick check
    try {
      const origin = new URL(url).origin;
      const robotsRes = await axios.get(`${origin}/robots.txt`, { timeout: 3000 }).catch(e => e);
      if (robotsRes.status === 200) signalParts.push(`robots.txt: present`);
      else if (robotsRes.response?.status === 404) signalParts.push(`robots.txt: absent (404)`);
      else signalParts.push(`robots.txt: non accessible`);
    } catch { signalParts.push('robots.txt: non accessible'); }
    const detectedSignals = signalParts.join('\n') || 'No technical signals detected';

    const siteType = detectSiteType(url, textContent, $);
    const missingSchemas = getRecommendedSchemas(siteType, detectedSchemas);

    const [claude, citationTest] = await Promise.all([
      runClaudeAnalysis(url, textContent, scores, locale, detectedSignals, siteType, missingSchemas),
      runCitationTest(url, textContent, metaTitle, metaDescription, locale).catch(() => null),
    ]);

    // Score calculation: 7 technical criteria (max 95) + neutrality (max 10) = max 105
    // Normalize to /100 — identical formula to analyze.js (free tier)
    // Score V2: 6 technical criteria (max 90) + neutrality (max 10) = max 100
    const rawTotal = Object.values(scores).reduce((s, c) => s + c.score, 0) + (claude.neutralityScore || 0);
    const totalScore = Math.max(0, Math.min(100, rawTotal));

    // Build evidence (same structure as analyze.js for report template)
    const evHeadings = [];
    if (directHtml) {
      const $ev = cheerio.load(directHtml);
      $ev('h1, h2, h3').each((_, el) => {
        const level = el.tagName.toLowerCase();
        const text = $ev(el).text().trim();
        if (text) evHeadings.push({ level, text });
      });
    }
    if (evHeadings.length === 0) {
      mdHeadings(rawContent).forEach(h => evHeadings.push(h));
    }

    const evidence = {
      metaTitle,
      metaDescription,
      wordCount: textContent.split(/\s+/).filter(w => w.length > 0).length,
      headings: evHeadings,
      schemas: [],
      socialLinks: directSocialLinks,
      externalLinks: 0,
      dates: {},
    };
    // Populate schemas
    $html('script[type="application/ld+json"]').each((_, el) => {
      try {
        const d = JSON.parse($html(el).html());
        const addType = (obj) => { if (obj?.['@type']) evidence.schemas.push({ type: obj['@type'], properties: Object.keys(obj).filter(k => !k.startsWith('@')) }); };
        addType(d);
        if (Array.isArray(d['@graph'])) d['@graph'].forEach(addType);
      } catch {}
    });

    // Classify page type for Pro weighted scoring
    const evHeadingsForClassify = evHeadings.length > 0 ? evHeadings : [];
    const pageType = classifyPage(url, textContent, evHeadingsForClassify);
    const importanceWeight = pageImportanceWeight(url, evidence.wordCount);
    const benchmark = PAGE_TYPE_BENCHMARKS[pageType] || PAGE_TYPE_BENCHMARKS.product;

    const result = {
      url,
      score: totalScore,
      pageType,
      importanceWeight,
      benchmark,
      verdict: claude.verdict,
      topPriority: claude.topPriority || '',
      strengths: claude.strengths || [],
      criteria: [
        { name: 'Citabilite & reponse directe', ...scores.citability },
        { name: 'Verifiabilite & preuves', ...scores.verifiability },
        { name: 'Autorite & E-E-A-T', ...scores.authority },
        { name: 'Accessibilite IA', ...scores.accessibility },
        { name: 'Neutralite editoriale', score: claude.neutralityScore, max: 10, detail: claude.neutralityDetail || '' },
        { name: 'Presence externe', ...scores.externalPresence },
        { name: 'Fraicheur & signaux temporels', ...scores.freshness },
      ],
      recommendations: claude.recommendations,
      evidence,
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
