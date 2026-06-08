import { Redis } from '@upstash/redis';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { verifyQstashSignature, triggerFinalizeReport, triggerConsolidationStep } from '../../lib/proQueue';
const { runRealCitationTest } = require('../../lib/citationTest');

export const config = {
  maxDuration: 300, // Each step does 1 API call — 300s is plenty
  api: { bodyParser: false },
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 180000 });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 180000 });

// ── Multi-provider call with fallback ────────────────────────────────────────

async function callSonnetWithFallback(prompt, { maxTokens = 6000 } = {}) {
  // Try Sonnet first (better for qualitative analysis in French)
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-4-sonnet-20250514', max_tokens: maxTokens, temperature: 0.2,
      messages: [{ role: 'user', content: prompt }],
    });
    return { text: msg.content[0].text, provider: 'sonnet' };
  } catch (e) {
    console.warn(`[pro-consolidate] Sonnet failed (${e.status || e.message?.substring(0, 50)}), falling back to GPT-4o`);
  }
  // Fallback to GPT-4o (reliable on Vercel)
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o', max_tokens: maxTokens, temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  });
  return { text: completion.choices[0].message.content, provider: 'gpt-4o' };
}

async function callGPT4o(prompt, { maxTokens = 6000 } = {}) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o', max_tokens: maxTokens, temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  });
  return { text: completion.choices[0].message.content, provider: 'gpt-4o' };
}

async function callGPT4oMini(prompt, { maxTokens = 2000 } = {}) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', max_tokens: maxTokens, temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  });
  return { text: completion.choices[0].message.content, provider: 'gpt-4o-mini' };
}

const JOB_PREFIX = 'detekia:pro:v1:job';
const CONSOLIDATED_TTL = 7 * 24 * 60 * 60;
const CRITERIA_NAMES = [
  'Citabilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T',
  'Accessibilite IA', 'Neutralite editoriale',
  'Presence externe', 'Fraicheur & signaux temporels',
];

const { callWithRetry } = require('../../lib/anthropicRetry');
function callSonnet(params, maxRetries = 3) { return callWithRetry(anthropic, params, maxRetries); }

function parseJson(raw) {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in Claude response');
  return JSON.parse(match[0]);
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

// ── Step 1: Read job data from Redis ────────────────────────────────────────

async function readJobData(siteJobId) {
  const [totalRaw, metaRaw] = await Promise.all([
    redis.get(`${JOB_PREFIX}:${siteJobId}:total`),
    redis.get(`${JOB_PREFIX}:${siteJobId}:meta`),
  ]);
  const total = Number(totalRaw) || 0;
  const meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
  if (!total || !meta) return null;
  // Normalize rootUrl — ensure it has a protocol (some entries stored without https://)
  if (meta.rootUrl && !/^https?:\/\//i.test(meta.rootUrl)) meta.rootUrl = `https://${meta.rootUrl}`;

  const pageKeys = Array.from({ length: total }, (_, i) => `${JOB_PREFIX}:${siteJobId}:page:${i}`);
  const pageResults = await Promise.all(pageKeys.map(k => redis.get(k).catch(() => null)));
  const pages = pageResults.map((raw, i) => {
    if (!raw) return { index: i, url: `page-${i}`, error: 'Result not found' };
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  });

  return { total, meta, pages };
}

// ── Step 2: Compute aggregates ──────────────────────────────────────────────

function computeAggregates(pages) {
  const { calculateProScore, classifyPage, pageImportanceWeight } = require('../../lib/pageClassifier');
  const validPages = pages.filter(p => !p.error && typeof p.score === 'number');
  const errorPages = pages.filter(p => p.error);

  // Classify pages and compute importance weights if not already done
  validPages.forEach(p => {
    if (!p.pageType) {
      const headings = p.evidence?.headings || [];
      const wc = p.evidence?.wordCount || 0;
      p.pageType = classifyPage(p.url, '', headings);
      p.importanceWeight = pageImportanceWeight(p.url, wc);
    }
  });

  // Pro weighted score (replaces simple average)
  const scoreAverage = calculateProScore(validPages);
  const scores = validPages.map(p => p.score);
  const sorted = [...scores].sort((a, b) => a - b);
  const scoreMedian = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : 0;
  const distribution = { faible: 0, moyen: 0, bon: 0 };
  scores.forEach(s => { if (s >= 70) distribution.bon++; else if (s >= 45) distribution.moyen++; else distribution.faible++; });

  const criteriaAverages = {};
  for (const name of CRITERIA_NAMES) {
    const vals = validPages.map(p => (p.criteria || []).find(c => c.name === name)).filter(Boolean);
    if (vals.length > 0) {
      criteriaAverages[name] = {
        avgScore: Math.round(vals.reduce((s, c) => s + c.score, 0) / vals.length * 10) / 10,
        max: vals[0].max,
      };
    }
  }

  return { validPages, errorPages, scoreAverage, scoreMedian, distribution, criteriaAverages };
}

// ── Step 3: Build prompt context ────────────────────────────────────────────

function buildPromptContext(locale, rootUrl, agg) {
  const { validPages, errorPages, scoreAverage, distribution, criteriaAverages } = agg;
  const today = new Date().toISOString().split('T')[0];
  const langInstruction = locale === 'en'
    ? 'OUTPUT LANGUAGE: English (US). ALL text values MUST be in American English.'
    : 'LANGUE DE SORTIE : Francais. Toutes les valeurs texte en francais professionnel.';

  const totalValid = validPages.length;
  const blogPages = validPages.filter(p => /blog/i.test(p.url));
  const belowByCriterion = {};
  for (const name of CRITERIA_NAMES) {
    belowByCriterion[name] = validPages.filter(p => {
      const c = (p.criteria || []).find(cr => cr.name === name);
      return c && (c.score / c.max) < 0.75;
    }).length;
  }

  const criteriaLabels = Object.entries(criteriaAverages).map(([k, v]) => {
    const pct = Math.round((v.avgScore / v.max) * 100);
    const adj = pct < 30 ? 'tres faible' : pct < 50 ? 'faible' : pct < 70 ? 'moyen' : pct < 85 ? 'bon' : 'excellent';
    return `  ${k}: ${v.avgScore}/${v.max} (${pct}%) → qualificatif: ${adj}`;
  }).join('\n');

  const statsBlock = `FIXED STATS (use these exact numbers, do NOT count yourself):
- Today's date: ${today} (2026 is the CURRENT year, dates in 2026 are RECENT not future)
- Total pages queued: ${validPages.length + errorPages.length}
- Pages successfully analyzed: ${totalValid}
- Pages with errors: ${errorPages.length}
- Blog/article pages: ${blogPages.length}
- Score distribution: ${distribution.faible} low (<45), ${distribution.moyen} average (45-69), ${distribution.bon} good (70+)
- Pages below 75% threshold per criterion:
${Object.entries(belowByCriterion).map(([k, v]) => `  ${k}: ${v}/${totalValid}`).join('\n')}

VOCABULARY CALIBRATION (mandatory — use the qualifier that matches the score %):
<30% = tres faible | 30-50% = faible | 50-70% = moyen | 70-85% = bon | >85% = excellent
FORBIDDEN: catastrophique, grave, lacune critique, défaillant, alarmant. Use "tres faible" instead.
Above 50%, acceptable words: moyen, à améliorer, perfectible, insuffisant, modéré.
Per-criterion qualifiers (use these exact words):
${criteriaLabels}
NEVER use "catastrophique" — always use "tres faible" instead. NEVER use "faible" for a score above 50%.`;

  return { langInstruction, statsBlock, totalValid, belowByCriterion };
}

// ── Step 4: Build prompts ───────────────────────────────────────────────────

function buildSynthesisPrompt(ctx, rootUrl, scoreAverage, validPages, criteriaAverages) {
  const pagesForPrompt = validPages.map(p => {
    const weakCriteria = (p.criteria || [])
      .filter(c => c.max > 0 && (c.score / c.max) < 0.7)
      .sort((a, b) => (a.score / a.max) - (b.score / b.max))
      .slice(0, 3)
      .map(c => `${c.name}: ${c.score}/${c.max}`)
      .join('; ');
    return { url: p.url, score: p.score, weakCriteria: weakCriteria || 'all criteria above 70%' };
  });

  return `${ctx.langInstruction}

You are a senior GEO consultant analyzing a FULL WEBSITE audit.

${ctx.statsBlock}

Site: ${rootUrl}
Average GEO score: ${scoreAverage}/100

Pages analyzed:
${pagesForPrompt.map(p => `- ${p.url} (score: ${p.score}) — weakest: ${p.weakCriteria}`).join('\n')}

Criteria averages:
${Object.entries(criteriaAverages).map(([k, v]) => `- ${k}: ${v.avgScore}/${v.max}`).join('\n')}

Generate a comprehensive site-level analysis. JSON only:
{"executiveSummary":"2-3 paragraphs qualitative analysis of the site's overall GEO health","topStrengths":["strength 1","strength 2","strength 3"],"topWeaknesses":["weakness 1","weakness 2","weakness 3"],"patterns":[{"pattern":"description","pagesAffected":["url1","url2"],"criterion":"criterion name","severity":"critique|important|mineur"}],"actionPlan":[{"priority":1,"action":"description","criterion":"criterion name","impact":"eleve|moyen|faible","effort":"faible|moyen|eleve","pagesAffected":["url1","url2"]}]}

Rules:
- executiveSummary: 2-3 substantial paragraphs, specific to this site. Use the FIXED STATS numbers above verbatim.
- patterns: 5 to 8 cross-page patterns detected
- actionPlan: ALL relevant site-level actions, sorted by priority (impact/effort ratio). Include EVERY action the audit justifies — no artificial limit. You CAN have multiple actions for the same criterion if they address DIFFERENT problems. Only merge actions that are literally the same fix rephrased. Example of WRONG: "Add publication dates" + "Implement dateModified schema" = these are the same fix. Example of RIGHT: "Add external source links" + "Add statistics and data points" = these are different fixes for the same criterion (Vérifiabilité), keep both.
- Be specific: reference actual URLs from the audit
- NEVER write "${ctx.totalValid} pages sur ${ctx.totalValid}" — that's trivially obvious. Write "${ctx.totalValid} pages" or "toutes les ${ctx.totalValid} pages".
- Each action in the plan should affect 2+ pages. If a recommendation only applies to 1 page, it belongs in the per-page analysis, not in the site-level action plan. Consolidate single-page issues into broader patterns (e.g., instead of "add legal references to the insurance page", write "add external source citations across content pages").
- The executive summary should describe SITE-WIDE patterns, not drill into one specific page's content.`;
}

function buildCitationPrompt(ctx, rootUrl, scoreAverage, validPages) {
  const pageTitles = validPages.map(p => `${p.evidence?.metaTitle || p.url} (${p.url})`).slice(0, 10).join(', ');
  return `${ctx.langInstruction}

You are an AI visibility expert. Full site audit for ${rootUrl}.
Pages: ${pageTitles}

Step 1: Generate 30 queries users would ask ChatGPT/Perplexity about this site's domain:
- 10 generic (high competition broad queries)
- 10 niche (specific to this site)
- 10 long_tail (ultra-targeted)

Step 2: For each query, simulate whether ${new URL(rootUrl).hostname} would be cited. Consider the site's actual content quality (average score: ${scoreAverage}/100).

CRITICAL RULES for competitorsCited:
- ONLY include real company/brand names or domain names (e.g., "Club Med", "Edenred", "booking.com")
- NEVER include generic words, verbs, or common phrases (e.g., "Conclusion", "Consultez", "Ressources Humaines", "Calcul Automatique")
- NEVER include action verbs in imperative form (e.g., "Comparez", "Utilisez", "Renseignez", "Contactez")
- NEVER include the analyzed site (${new URL(rootUrl).hostname}) as a competitor
- If no real competitor is identifiable for a query, use an empty array []
- Maximum 3 competitors per query

JSON only:
{"queries":[{"query":"","type":"generic|niche|long_tail","cited":false,"competitorsCited":["competitor1"],"difficulty_to_rank":"easy|medium|hard","recommendation":"1 sentence","ai_response_excerpt":"first 100 chars of simulated AI answer"}],"citationRate":"X/30","bestOpportunity":"best query opportunity","mainBlocker":"main competitor blocking citations (must be a real brand name)"}`;
}

function buildCriteriaPrompt(ctx, rootUrl, scoreAverage, validPages, criteriaAverages) {
  const criteriaForPrompt = Object.entries(criteriaAverages).map(([name, data]) => {
    const pagesBelow = validPages.filter(p => {
      const c = (p.criteria || []).find(cr => cr.name === name);
      return c && (c.score / c.max) < 0.75;
    });
    const examples = pagesBelow.slice(0, 3).map(p => {
      const c = (p.criteria || []).find(cr => cr.name === name);
      return `${p.url} (${c?.score}/${c?.max})`;
    });
    return `- ${name}: avg ${data.avgScore}/${data.max}, ${pagesBelow.length}/${validPages.length} pages below 75%. Examples: ${examples.join(', ') || 'none'}`;
  }).join('\n');

  return `${ctx.langInstruction}

${ctx.statsBlock}

You are a senior GEO consultant. For a site audit of ${rootUrl} (${ctx.totalValid} pages analyzed, avg score ${scoreAverage}/100), generate a per-criterion consolidated analysis.

Criteria data:
${criteriaForPrompt}

For each of the 7 GEO criteria, generate a JSON array of 7 objects. Each object must have a synthesis AND as many recommendations as needed (not just one):
[{"criterion":"exact criterion name","synthesis":"2-3 sentences describing the state of this criterion across all pages","recommendations":[{"diagnostic":"1 sentence","whyCritical":"1 sentence","whatToDo":"2 sentences","howToDoIt":"2-3 sentences","concreteExample":"AVANT: [current state] → APRES: [desired state with concrete example]","expectedImpact":"1 sentence","expertTip":"1 sentence","pagesAffected":["url1","url2"]}]}]

Rules:
- synthesis must use the FIXED STATS numbers above
- Generate AS MANY recommendations as the criterion needs. If there are 5 different things to fix, generate 5 recommendations. Do NOT limit to 1.
- Each recommendation must address a DIFFERENT specific problem (not the same advice rephrased)
- concreteExample MUST use the AVANT/APRES format
- pagesAffected: list up to 5 most impacted URLs per recommendation
- Be specific to ${rootUrl}

JSON array only, no markdown:`;
}

// ── Step 4b: Build per-page recommendations prompt ──────────────────────────

function buildPageRecommendationsPrompt(locale, rootUrl, metaDescription, validPages) {
  const langInstruction = locale === 'en'
    ? 'OUTPUT LANGUAGE: English (US). ALL text values MUST be in American English.'
    : 'LANGUE DE SORTIE : Francais. Toutes les valeurs texte en francais professionnel.';

  const pagesData = validPages.map(p => {
    const title = p.evidence?.metaTitle || p.url.split('/').pop() || '';
    const desc = p.evidence?.metaDescription || '';
    const weakCriteria = (p.criteria || [])
      .filter(c => c.max > 0 && c.score < c.max)
      .sort((a, b) => (a.score / a.max) - (b.score / b.max))
      .slice(0, 5)
      .map(c => `${c.name}: ${c.score}/${c.max}`)
      .join(', ');
    const context = title ? `"${title.substring(0, 60)}"` : '';
    return `- ${p.url} ${context} (${p.score}/100) — ${weakCriteria}`;
  }).join('\n');

  const isFr = locale !== 'en';
  return `${langInstruction}
${isFr ? 'IMPORTANT: Toutes les valeurs du JSON (title, problem, solution, technicalImplementation) DOIVENT etre en francais. Ne jamais ecrire en anglais.' : ''}

${isFr ? 'Tu es un consultant GEO senior. Genere TOUTES les recommandations pertinentes pour chaque page de cet audit de site web. Pas de limite — si une page a 10 choses a corriger, genere 10 recommandations.' : 'You are a senior GEO consultant. Generate ALL relevant recommendations for each page of a website audit. No limit — if a page has 10 things to fix, generate 10 recommendations.'}

Site: ${rootUrl}
${validPages.length} pages ${isFr ? 'analysees' : 'analyzed'}.

${pagesData}

${isFr ? 'CRITIQUE: Tu DOIS retourner des recommandations pour les ' + validPages.length + ' pages. Ne saute aucune page.' : 'CRITICAL: You MUST return recommendations for ALL ' + validPages.length + ' pages. Do not skip any page.'}

JSON object, one key per URL:
{"url":[{"priority":"high|medium|low","criterion":"${isFr ? 'nom du critere en francais' : 'criterion name'}","title":"5 ${isFr ? 'mots max' : 'words max'}","problem":"2 ${isFr ? 'phrases' : 'sentences'}","solution":"2 ${isFr ? 'phrases' : 'sentences'}","technicalImplementation":["${isFr ? 'etape' : 'step'} 1","${isFr ? 'etape' : 'step'} 2"],"impact":"high|medium|low","effort":"low|medium|high","timeframe":"1-2 sem|1 mois|2-3 mois"}]}

Rules:
- Generate as many recommendations as needed per page. Multiple recos per criterion are OK if there are multiple distinct problems to fix. No artificial limit.
- priority: high <50%, medium 50-70%, low >70%
- "criterion" must be one of: 'Citabilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T', 'Accessibilite IA', 'Neutralite editoriale', 'Presence externe', 'Fraicheur & signaux temporels'
- Keep problem and solution concise (2 sentences each)
- Be SPECIFIC to each page's content and purpose (use the page title for context). Don't give the same generic advice to every page. A contact page needs different recos than a product page.
${isFr ? '- RAPPEL: Toutes les valeurs texte en FRANCAIS. Pas un seul mot en anglais dans les valeurs JSON.' : ''}
- JSON only, no markdown, no code examples`;
}

// ── Step 5: Run 4 Sonnet calls in parallel ──────────────────────────────────

async function runParallelCalls(synthesisPrompt, citationPrompt, criteriaPrompt, { rootUrl, metaDescription, intro, locale, validPages } = {}) {
  console.log('[pro-consolidate] Starting Sonnet synthesis + criteria + real citation test...');
  const start = Date.now();

  const hostname = new URL(rootUrl).hostname.replace(/^www\./, '');
  const brand = hostname.split('.')[0];

  // Build per-page recommendations prompt
  const pageRecoPrompt = buildPageRecommendationsPrompt(locale || 'fr', rootUrl, metaDescription || '', validPages || []);

  // First 3 calls in parallel (synthesis + citation + criteria)
  const [synthR, citR, critR] = await Promise.allSettled([
    callSonnet({ model: 'claude-4-sonnet-20250514', max_tokens: 10000, temperature: 0.2, messages: [{ role: 'user', content: synthesisPrompt }] }),
    runRealCitationTest(rootUrl, hostname, brand, metaDescription || '', intro || '', 30, locale || 'fr', anthropic),
    callSonnet({ model: 'claude-4-sonnet-20250514', max_tokens: 8000, temperature: 0.2, messages: [{ role: 'user', content: criteriaPrompt }] }),
  ]);
  console.log(`[pro-consolidate] First 3 calls completed in ${Date.now() - start}ms`);

  // 4th call AFTER the first 3 + 30s cooldown + retry on failure
  console.log(`[pro-consolidate] Waiting 30s before page recos...`);
  await new Promise(r => setTimeout(r, 30000));
  let pageRecoR = await Promise.allSettled([
    callSonnet({ model: 'claude-4-sonnet-20250514', max_tokens: 10000, temperature: 0.2, messages: [{ role: 'user', content: pageRecoPrompt }] }),
  ]).then(r => r[0]);
  console.log(`[pro-consolidate] Page reco attempt 1: ${pageRecoR.status} (${Date.now() - start}ms)`);
  // Retry once if failed
  if (pageRecoR.status !== 'fulfilled') {
    console.log(`[pro-consolidate] Page reco failed, retrying after 30s...`);
    await new Promise(r => setTimeout(r, 30000));
    pageRecoR = await Promise.allSettled([
      callSonnet({ model: 'claude-4-sonnet-20250514', max_tokens: 10000, temperature: 0.2, messages: [{ role: 'user', content: pageRecoPrompt }] }),
    ]).then(r => r[0]);
    console.log(`[pro-consolidate] Page reco attempt 2: ${pageRecoR.status} (${Date.now() - start}ms)`);
  }

  let synthesis = { executiveSummary: '', topStrengths: [], topWeaknesses: [], patterns: [], actionPlan: [] };
  if (synthR.status === 'fulfilled') {
    try { synthesis = parseJson(synthR.value.content[0].text); console.log(`[pro-consolidate] Synthesis OK: exec=${(synthesis.executiveSummary || '').length}c`); }
    catch (e) { console.error('[pro-consolidate] Synthesis parse error:', e.message); }
  } else { console.error('[pro-consolidate] Synthesis FAILED:', synthR.reason?.message); }
  // Retry synthesis if empty (rate limit, parse error, etc.)
  if (!synthesis.executiveSummary || (synthesis.patterns || []).length === 0) {
    console.warn('[pro-consolidate] Synthesis empty, retrying after 15s...');
    await new Promise(r => setTimeout(r, 15000));
    try {
      const retryMsg = await callSonnet({ model: 'claude-4-sonnet-20250514', max_tokens: 10000, temperature: 0.2, messages: [{ role: 'user', content: synthesisPrompt }] });
      const retrySynthesis = parseJson(retryMsg.content[0].text);
      if (retrySynthesis.executiveSummary) { synthesis = retrySynthesis; console.log('[pro-consolidate] Synthesis retry OK'); }
    } catch (e) { console.error('[pro-consolidate] Synthesis retry failed:', e.message); }
  }

  let citationTest = { tests: [], summary: { cited_count: 0, total_tests: 0, best_opportunity: '', main_blocker: '' } };
  if (citR.status === 'fulfilled' && citR.value) {
    citationTest = citR.value;
    // Clean up fake competitors from AI responses
    const fakeCompetitorPattern = /^(le |la |les |l'|un |une |des |du |de |en |au |the |a |an |for |with )/i;
    const fakeWords = new Set(['conclusion', 'consultez', 'contactez', 'appelez', 'expliquez', 'demandez',
      'renseignez', 'comparez', 'utilisez', 'choisissez', 'optez', 'inscrivez', 'recherche',
      'certaines', 'plusieurs', 'notamment', 'activit', 'randonn', 'flexibilit', 'natation',
      'nouveau prestataire', 'ancien prestataire', 'parties prenantes', 'ressources humaines',
      'calcul automatique', 'titres restaurant', 'appels api', 'petit', 'habituellement',
      'pension', 'demi', 'destinations', 'stations', 'clubs', 'villages', 'cours',
      // Common FR words mistaken for brands (sentence starters)
      'voici', 'cela', 'prendre', 'types', 'selon', 'comme', 'aussi', 'ainsi',
      'cette', 'entre', 'faire', 'avant', 'apres', 'depuis', 'parmi', 'leurs',
      'notre', 'votre', 'moins', 'toute', 'toutes', 'chaque', 'autre', 'autres',
      'grâce', 'grace', 'outre', 'alors', 'reste', 'suite', 'point', 'partie',
      'niveau', 'place', 'forme', 'monde', 'genre', 'type', 'aide', 'guide',
      'notez', 'sachez', 'voyez', 'lisez', 'allez', 'venez', 'faites', 'dites',
      'mieux', 'prise', 'mise', 'bien', 'tout', 'rien', 'plus']);
    const hostname = (() => { try { return new URL(rootUrl).hostname.replace(/^www\./, ''); } catch { return ''; } })();
    const queries = citationTest.queries || citationTest.tests || [];
    for (const q of queries) {
      const field = q.competitorsCited || q.competitors_cited || [];
      const cleaned = field.filter(c => {
        const lower = (c || '').toLowerCase().trim();
        if (!lower || lower.length < 5) return false;
        if (fakeWords.has(lower)) return false;
        if (fakeCompetitorPattern.test(c)) return false;
        if (hostname && lower.includes(hostname)) return false;
        // Reject if contains any blacklisted word
        const rejectContains = ['consultez', 'conclusion', 'contactez', 'appelez', 'renseignez',
          'comparez', 'utilisez', 'choisissez', 'optez', 'inscrivez', 'demandez', 'expliquez'];
        if (rejectContains.some(w => lower.includes(w))) return false;
        // Reject single words that look like common verbs/nouns (end in -ez, -er, -ion, -ent, -ment)
        if (/^[A-Z][a-zéèêë]+$/.test(c) && /(?:ez|er|ir|re|ion|ent|ment|tion|ité|eur|eux|aux|ons|ées|ant)$/i.test(c)) return false;
        return true;
      });
      if (q.competitorsCited) q.competitorsCited = cleaned;
      if (q.competitors_cited) q.competitors_cited = cleaned;
    }
    // Clean mainBlocker
    const blocker = citationTest.mainBlocker || citationTest.summary?.main_blocker || '';
    if (fakeWords.has(blocker.toLowerCase().trim())) {
      if (citationTest.mainBlocker) citationTest.mainBlocker = '';
      if (citationTest.summary?.main_blocker) citationTest.summary.main_blocker = '';
    }
    console.log(`[pro-consolidate] Citation test OK: ${queries.length} queries, competitors cleaned`);
  } else { console.error('[pro-consolidate] Citation test FAILED:', citR.reason?.message || 'null result'); }

  let criteriaConsolidated = [];
  if (critR.status === 'fulfilled') {
    try {
      const arrMatch = critR.value.content[0].text.match(/\[[\s\S]*\]/);
      if (arrMatch) criteriaConsolidated = JSON.parse(arrMatch[0]);
    } catch (e) { console.error('[pro-consolidate] Criteria parse error:', e.message); }
  } else { console.error('[pro-consolidate] Criteria FAILED:', critR.reason?.message); }

  // Parse per-page recommendations
  let pageRecommendations = {};
  if (pageRecoR.status === 'fulfilled') {
    try {
      let raw = pageRecoR.value.content[0].text;
      // Strip markdown fences if present
      raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      // Strip control characters that break JSON.parse
      raw = raw.replace(/[\x00-\x1f\x7f]/g, m => m === '\n' || m === '\r' || m === '\t' ? m : '');
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        pageRecommendations = JSON.parse(jsonMatch[0]);
        const pageCount = Object.keys(pageRecommendations).length;
        console.log(`[pro-consolidate] Page recommendations OK: ${pageCount} pages`);
      } else {
        console.error('[pro-consolidate] Page recommendations: no JSON found in response');
      }
    } catch (e) {
      console.error('[pro-consolidate] Page recommendations parse error:', e.message);
      // Retry with simpler approach: try to extract URL-keyed objects
      try {
        const raw = pageRecoR.value.content[0].text;
        const urlPattern = /"(https?:\/\/[^"]+)"\s*:\s*\[/g;
        let match;
        while ((match = urlPattern.exec(raw)) !== null) {
          const url = match[1];
          // Find the array for this URL
          const start = match.index + match[0].length - 1;
          let depth = 1, end = start + 1;
          while (depth > 0 && end < raw.length) {
            if (raw[end] === '[') depth++;
            if (raw[end] === ']') depth--;
            end++;
          }
          try {
            const arr = JSON.parse(raw.substring(start, end));
            if (Array.isArray(arr)) pageRecommendations[url] = arr;
          } catch {}
        }
        if (Object.keys(pageRecommendations).length > 0) {
          console.log(`[pro-consolidate] Page recommendations recovered: ${Object.keys(pageRecommendations).length} pages`);
        }
      } catch {}
    }
  } else { console.error('[pro-consolidate] Page recommendations FAILED:', pageRecoR.reason?.message); }

  // Call 5: Generate code examples for the top 5 high-priority recos
  const allRecos = [];
  for (const [url, recos] of Object.entries(pageRecommendations)) {
    for (const r of recos) {
      if (r.priority === 'high') allRecos.push({ url, ...r });
    }
  }
  const topRecos = allRecos.slice(0, 5);

  if (topRecos.length > 0) {
    console.log(`[pro-consolidate] Generating code examples for ${topRecos.length} high-priority recos...`);
    await new Promise(r => setTimeout(r, 5000)); // Brief cooldown
    try {
      const codePrompt = `${locale === 'en' ? 'OUTPUT LANGUAGE: English.' : 'LANGUE DE SORTIE : Francais.'}\n\nGenerate code examples (JSON-LD, HTML, or meta tags) for these website audit recommendations.\n\nSite: ${rootUrl}\n\n${topRecos.map((r, i) => `${i + 1}. [${r.url}] ${r.criterion}: ${r.title} — ${r.solution || r.problem}`).join('\n')}\n\nReturn a JSON array of ${topRecos.length} code snippets:\n[{"index":0,"codeExample":"<code here>"},{"index":1,"codeExample":"<code>"}]\n\nRules:\n- Each codeExample must be a real, copy-pasteable code snippet (JSON-LD, HTML meta tag, or HTML structure)\n- CRITICAL: Never invent realistic-looking fake data (fake user counts, fake certifications, fake dates). Use neutral placeholders: [nombre d'utilisateurs], [certification reelle], [date de mise a jour], [nom du client], [resultat mesure], [metrique verifiable]\n- Add <!-- Adaptez avec vos vraies valeurs --> at the top\n- Keep each snippet under 15 lines\n- JSON array only, no markdown`;

      const codeMsg = await callSonnet({ model: 'claude-4-sonnet-20250514', max_tokens: 4000, temperature: 0.2, messages: [{ role: 'user', content: codePrompt }] });
      let codeRaw = codeMsg.content[0].text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      const codeMatch = codeRaw.match(/\[[\s\S]*\]/);
      if (codeMatch) {
        const codeExamples = JSON.parse(codeMatch[0]);
        for (const ce of codeExamples) {
          const idx = ce.index;
          if (idx >= 0 && idx < topRecos.length && ce.codeExample) {
            const rUrl = topRecos[idx].url;
            const rTitle = topRecos[idx].title;
            const pageRecos = pageRecommendations[rUrl];
            if (pageRecos) {
              const match = pageRecos.find(r => r.title === rTitle);
              if (match) match.codeExample = ce.codeExample;
            }
          }
        }
        console.log(`[pro-consolidate] Code examples: ${codeExamples.length} generated`);
      }
    } catch (e) {
      console.error('[pro-consolidate] Code examples failed (non-blocking):', e.message);
    }
  }

  return { synthesis, citationTest, criteriaConsolidated, pageRecommendations };
}

// ── Step 6: Build and store consolidated report ─────────────────────────────

function sortActionPlan(actionPlan) {
  return (actionPlan || []).sort((a, b) => {
    const imp = { eleve: 0, high: 0, moyen: 1, medium: 1, faible: 2, low: 2 };
    const ai = imp[String(a.impact || '').toLowerCase()] ?? 1;
    const bi = imp[String(b.impact || '').toLowerCase()] ?? 1;
    if (ai !== bi) return ai - bi;
    const eff = { faible: 0, low: 0, moyen: 1, medium: 1, eleve: 2, high: 2 };
    return (eff[String(a.effort || '').toLowerCase()] ?? 1) - (eff[String(b.effort || '').toLowerCase()] ?? 1);
  });
}

// ── Handler — 4 steps, each with primary provider + fallback ────────────────

const STEP_TTL = 24 * 60 * 60;

async function getBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['host'] || 'localhost:3000';
  return `${proto}://${host}`;
}

function safeParseJson(raw) {
  const cleaned = (raw || '').replace(/```json\s*/g, '').replace(/```\s*/g, '').replace(/[\x00-\x1f\x7f]/g, m => m === '\n' || m === '\r' || m === '\t' ? m : '');
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  const arrMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrMatch) return JSON.parse(arrMatch[0]);
  throw new Error('No JSON found in response');
}

function safeParseArray(raw) {
  const cleaned = (raw || '').replace(/```json\s*/g, '').replace(/```\s*/g, '');
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (match) return JSON.parse(match[0]);
  throw new Error('No JSON array found in response');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const signature = req.headers['upstash-signature'];
  const rawBody = await readRawBody(req);

  if (!signature || !(await verifyQstashSignature(signature, rawBody))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { siteJobId, step = 1 } = JSON.parse(rawBody);
  if (!siteJobId) return res.status(400).json({ error: 'Missing siteJobId' });

  const startMs = Date.now();
  console.log(`[pro-consolidate] Step ${step}/4 for ${siteJobId}`);

  try {
    const jobData = await readJobData(siteJobId);
    if (!jobData) return res.status(404).json({ error: 'Job not found' });

    const { meta, pages } = jobData;
    const locale = meta.locale || 'fr';
    const rootUrl = meta.rootUrl;
    const agg = computeAggregates(pages);
    const ctx = buildPromptContext(locale, rootUrl, agg);
    const baseUrl = await getBaseUrl(req);
    const homepageEvidence = agg.validPages[0]?.evidence || {};

    // ══════════════════════════════════════════════════════════════════════
    // STEP 1: Synthesis + patterns + plan d'action (Sonnet → fallback GPT-4o)
    // ══════════════════════════════════════════════════════════════════════
    if (step === 1) {
      // Skip if already done (retrigger scenario)
      const existing = await redis.get(`${JOB_PREFIX}:${siteJobId}:step:synthesis`);
      const existingParsed = existing ? (typeof existing === 'string' ? JSON.parse(existing) : existing) : null;
      if (existingParsed?.executiveSummary && existingParsed.executiveSummary.length > 50) {
        console.log(`[pro-consolidate] Step 1 already done, skipping`);
        await triggerConsolidationStep(siteJobId, 2, { baseUrl });
        return res.status(200).json({ success: true, step: 1, skipped: true });
      }

      const prompt = buildSynthesisPrompt(ctx, rootUrl, agg.scoreAverage, agg.validPages, agg.criteriaAverages);
      let synthesis = null;
      try {
        const result = await callSonnetWithFallback(prompt, { maxTokens: 8000 });
        synthesis = safeParseJson(result.text);
        console.log(`[pro-consolidate] Step 1 via ${result.provider}`);
      } catch (e) {
        console.error(`[pro-consolidate] Step 1 all providers failed: ${e.message}`);
      }

      // Only store if we got real data
      if (synthesis?.executiveSummary && synthesis.executiveSummary.length > 50) {
        await redis.set(`${JOB_PREFIX}:${siteJobId}:step:synthesis`, synthesis, { ex: STEP_TTL });
        console.log(`[pro-consolidate] Step 1 done. Exec=${synthesis.executiveSummary.length}c, Actions=${(synthesis.actionPlan || []).length}`);
        await triggerConsolidationStep(siteJobId, 2, { baseUrl });
      } else {
        console.error(`[pro-consolidate] Step 1 produced empty synthesis — NOT stored. Jumping to step 6 for retrigger.`);
        await triggerConsolidationStep(siteJobId, 6, { baseUrl });
      }
      return res.status(200).json({ success: true, step: 1 });
    }

    // ── STEP 2: Per-criterion consolidated analysis ─────────────────────
    if (step === 2) {
      // Skip if already done
      const existingCrit = await redis.get(`${JOB_PREFIX}:${siteJobId}:step:criteria`);
      const existingCritParsed = existingCrit ? (typeof existingCrit === 'string' ? JSON.parse(existingCrit) : existingCrit) : null;
      if (Array.isArray(existingCritParsed) && existingCritParsed.length > 0) {
        console.log(`[pro-consolidate] Step 2 already done (${existingCritParsed.length} criteria), skipping`);
        await triggerConsolidationStep(siteJobId, 3, { baseUrl });
        return res.status(200).json({ success: true, step: 2, skipped: true });
      }

      const prompt = buildCriteriaPrompt(ctx, rootUrl, agg.scoreAverage, agg.validPages, agg.criteriaAverages);
      let criteriaConsolidated = [];

      // Try Sonnet → GPT-4o fallback
      try {
        const result = await callSonnetWithFallback(prompt, { maxTokens: 8000 });
        criteriaConsolidated = safeParseArray(result.text);
        console.log(`[pro-consolidate] Step 2 via ${result.provider}`);
      } catch (e) {
        console.warn(`[pro-consolidate] Step 2 first attempt failed: ${e.message}`);
      }

      // Retry with GPT-4o directly if first attempt failed
      if (!Array.isArray(criteriaConsolidated) || criteriaConsolidated.length === 0) {
        console.log(`[pro-consolidate] Step 2 retrying with GPT-4o after 10s...`);
        await new Promise(r => setTimeout(r, 10000));
        try {
          const result = await callGPT4o(prompt, { maxTokens: 8000 });
          criteriaConsolidated = safeParseArray(result.text);
          console.log(`[pro-consolidate] Step 2 retry OK via ${result.provider}`);
        } catch (e) {
          console.error(`[pro-consolidate] Step 2 retry also failed: ${e.message}`);
        }
      }

      if (Array.isArray(criteriaConsolidated) && criteriaConsolidated.length > 0) {
        await redis.set(`${JOB_PREFIX}:${siteJobId}:step:criteria`, criteriaConsolidated, { ex: STEP_TTL });
        console.log(`[pro-consolidate] Step 2 done in ${Date.now() - startMs}ms. Criteria=${criteriaConsolidated.length}`);
        await triggerConsolidationStep(siteJobId, 3, { baseUrl });
      } else {
        console.error(`[pro-consolidate] Step 2 produced empty criteria after 2 attempts — NOT stored. Jumping to step 6 for retrigger.`);
        await triggerConsolidationStep(siteJobId, 6, { baseUrl });
      }
      return res.status(200).json({ success: true, step: 2 });
    }

    // ── STEP 3: Real citation test (30 GPT queries) ─────────────────────
    if (step === 3) {
      const hostname = new URL(rootUrl).hostname.replace(/^www\./, '');
      const brand = hostname.split('.')[0];
      let citationTest = { tests: [], summary: { cited_count: 0, total_tests: 0, best_opportunity: '', main_blocker: '' } };
      try {
        const result = await runRealCitationTest(rootUrl, hostname, brand, homepageEvidence.metaDescription || '', homepageEvidence.intro || '', 30, locale, anthropic);
        if (result) citationTest = result;
      } catch (e) { console.error(`[pro-consolidate] Step 3 Citation test failed: ${e.message}`); }

      // Clean fake competitors (same logic as before)
      const fakeCompetitorPattern = /^(le |la |les |l'|un |une |des |du |de |en |au |the |a |an |for |with )/i;
      const fakeWords = new Set(['conclusion', 'consultez', 'contactez', 'appelez', 'expliquez', 'demandez',
        'renseignez', 'comparez', 'utilisez', 'choisissez', 'optez', 'inscrivez', 'recherche',
        'certaines', 'plusieurs', 'notamment', 'voici', 'cela', 'prendre', 'types', 'selon', 'comme',
        'aussi', 'ainsi', 'cette', 'entre', 'faire', 'avant', 'apres', 'depuis', 'parmi', 'leurs',
        'notre', 'votre', 'moins', 'toute', 'toutes', 'chaque', 'autre', 'autres', 'grâce', 'grace',
        'outre', 'alors', 'reste', 'suite', 'point', 'partie', 'niveau', 'place', 'forme', 'monde',
        'genre', 'type', 'aide', 'guide', 'notez', 'sachez', 'voyez', 'lisez', 'allez', 'venez',
        'faites', 'dites', 'mieux', 'prise', 'mise', 'bien', 'tout', 'rien', 'plus']);
      const queries = citationTest.queries || citationTest.tests || [];
      for (const q of queries) {
        const field = q.competitorsCited || q.competitors_cited || [];
        const cleaned = field.filter(c => {
          const lower = (c || '').toLowerCase().trim();
          if (!lower || lower.length < 5) return false;
          if (fakeWords.has(lower)) return false;
          if (fakeCompetitorPattern.test(c)) return false;
          if (hostname && lower.includes(hostname.replace(/\.[^.]+$/, ''))) return false; // Exclude own site
          return true;
        });
        if (q.competitorsCited) q.competitorsCited = cleaned;
        if (q.competitors_cited) q.competitors_cited = cleaned;
      }

      await redis.set(`${JOB_PREFIX}:${siteJobId}:step:citations`, citationTest, { ex: STEP_TTL });
      console.log(`[pro-consolidate] Step 3 done in ${Date.now() - startMs}ms. Queries=${queries.length}`);
      await triggerConsolidationStep(siteJobId, 4, { baseUrl });
      return res.status(200).json({ success: true, step: 3 });
    }

    // ── STEP 4: Per-page recommendations (split into batches of 5 pages) ─
    if (step === 4) {
      // Skip if already done
      const existingRecos = await redis.get(`${JOB_PREFIX}:${siteJobId}:step:page-recos`);
      const existingRecosParsed = existingRecos ? (typeof existingRecos === 'string' ? JSON.parse(existingRecos) : existingRecos) : null;
      if (existingRecosParsed && typeof existingRecosParsed === 'object' && Object.keys(existingRecosParsed).length >= Math.max(agg.validPages.length - 1, 1)) {
        console.log(`[pro-consolidate] Step 4 already done (${Object.keys(existingRecosParsed).length} pages), skipping`);
        await triggerConsolidationStep(siteJobId, 5, { baseUrl });
        return res.status(200).json({ success: true, step: 4, skipped: true });
      }

      let pageRecommendations = {};

      // Split pages into batches of 5 to avoid output truncation
      const batchSize = 5;
      const batches = [];
      for (let i = 0; i < agg.validPages.length; i += batchSize) {
        batches.push(agg.validPages.slice(i, i + batchSize));
      }

      // Detect if recos are in English when they should be in French
      const EN_WORDS = new Set(['the','this','that','with','from','should','could','would','have','been','does','improve','ensure','consider','implement','adding','create','update','include','provide','users','content','page','website','information']);
      function isEnglishText(text) {
        if (!text || text.length < 20) return false;
        const words = text.toLowerCase().split(/\s+/);
        const enCount = words.filter(w => EN_WORDS.has(w)).length;
        return enCount / words.length > 0.15; // >15% English common words
      }
      function batchIsEnglish(recos) {
        const texts = [];
        for (const arr of Object.values(recos)) {
          for (const r of (arr || [])) {
            if (r.problem) texts.push(r.problem);
            if (r.solution) texts.push(r.solution);
            if (r.title) texts.push(r.title);
          }
        }
        const sample = texts.slice(0, 10).join(' ');
        return isEnglishText(sample);
      }

      for (let bi = 0; bi < batches.length; bi++) {
        const batch = batches[bi];
        const prompt = buildPageRecommendationsPrompt(locale, rootUrl, homepageEvidence.metaDescription || '', batch);
        console.log(`[pro-consolidate] Step 4 batch ${bi + 1}/${batches.length}: ${batch.length} pages, ${prompt.length} chars`);

        let batchRecos = null;
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const messages = attempt === 0
              ? [{ role: 'user', content: prompt }]
              : [{ role: 'user', content: prompt }, { role: 'assistant', content: 'I will write all recommendations in French.' }, { role: 'user', content: 'RAPPEL CRITIQUE: Toutes les valeurs (title, problem, solution, technicalImplementation) DOIVENT etre en francais. Recommence.' }];
            const completion = await openai.chat.completions.create({
              model: 'gpt-4o', max_tokens: 8000, temperature: 0.2, messages,
            });
            let raw = completion.choices[0].message.content;
            console.log(`[pro-consolidate] Step 4 batch ${bi + 1} attempt ${attempt + 1}: ${raw.length} chars, finish=${completion.choices[0].finish_reason}`);
            raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '');
            raw = raw.replace(/[\x00-\x1f\x7f]/g, m => m === '\n' || m === '\r' || m === '\t' ? m : '');
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              batchRecos = JSON.parse(jsonMatch[0]);
              // Check language if locale is FR
              if (locale !== 'en' && batchIsEnglish(batchRecos) && attempt === 0) {
                console.warn(`[pro-consolidate] Step 4 batch ${bi + 1}: recos in English detected, retrying in French...`);
                await new Promise(r => setTimeout(r, 5000));
                continue; // retry with stronger FR instruction
              }
              break; // success
            }
          } catch (e) {
            console.error(`[pro-consolidate] Step 4 batch ${bi + 1} attempt ${attempt + 1} failed: ${e.message?.substring(0, 200)}`);
          }
        }
        if (batchRecos) Object.assign(pageRecommendations, batchRecos);

        // Brief pause between batches
        if (bi < batches.length - 1) await new Promise(r => setTimeout(r, 5000));
      }

      if (Object.keys(pageRecommendations).length > 0) {
        await redis.set(`${JOB_PREFIX}:${siteJobId}:step:page-recos`, pageRecommendations, { ex: STEP_TTL });
        console.log(`[pro-consolidate] Step 4 done in ${Date.now() - startMs}ms. Pages with recos=${Object.keys(pageRecommendations).length}`);
        await triggerConsolidationStep(siteJobId, 5, { baseUrl });
      } else {
        console.error(`[pro-consolidate] Step 4 produced 0 page recos — NOT stored. Jumping to step 6 for retrigger.`);
        await triggerConsolidationStep(siteJobId, 6, { baseUrl });
      }
      return res.status(200).json({ success: true, step: 4 });
    }

    // ── STEP 5: Code examples for high-priority recos ───────────────────
    if (step === 5) {
      const pageRecos = await redis.get(`${JOB_PREFIX}:${siteJobId}:step:page-recos`) || {};
      const parsed = typeof pageRecos === 'string' ? JSON.parse(pageRecos) : pageRecos;
      const allHighRecos = [];
      for (const [url, recos] of Object.entries(parsed)) {
        for (const r of (recos || [])) {
          if (r.priority === 'high') allHighRecos.push({ url, ...r });
        }
      }
      const topRecos = allHighRecos.slice(0, 5);

      if (topRecos.length > 0) {
        try {
          const codePrompt = `${locale === 'en' ? 'OUTPUT LANGUAGE: English.' : 'LANGUE DE SORTIE : Francais.'}\n\nGenerate code examples (JSON-LD, HTML, or meta tags) for these website audit recommendations.\n\nSite: ${rootUrl}\n\n${topRecos.map((r, i) => `${i + 1}. [${r.url}] ${r.criterion}: ${r.title} — ${r.solution || r.problem}`).join('\n')}\n\nReturn a JSON array of ${topRecos.length} code snippets:\n[{"index":0,"codeExample":"<code here>"},{"index":1,"codeExample":"<code>"}]\n\nRules:\n- Each codeExample must be a real, copy-pasteable code snippet (JSON-LD, HTML meta tag, or HTML structure)\n- CRITICAL: Never invent realistic-looking fake data (fake user counts, fake certifications, fake dates). Use neutral placeholders: [nombre d'utilisateurs], [certification reelle], [date de mise a jour], [nom du client], [resultat mesure], [metrique verifiable]\n- Add <!-- Adaptez avec vos vraies valeurs --> at the top\n- Keep each snippet under 15 lines\n- JSON array only, no markdown`;
          const codeCompletion = await openai.chat.completions.create({ model: 'gpt-4o', max_tokens: 4000, temperature: 0.2, messages: [{ role: 'user', content: codePrompt }] });
          let codeRaw = codeCompletion.choices[0].message.content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
          const codeMatch = codeRaw.match(/\[[\s\S]*\]/);
          if (codeMatch) {
            const codeExamples = JSON.parse(codeMatch[0]);
            for (const ce of codeExamples) {
              if (ce.index >= 0 && ce.index < topRecos.length && ce.codeExample) {
                const rUrl = topRecos[ce.index].url;
                const rTitle = topRecos[ce.index].title;
                const recos = parsed[rUrl];
                if (recos) {
                  const match = recos.find(r => r.title === rTitle);
                  if (match) match.codeExample = ce.codeExample;
                }
              }
            }
            // Save updated page recos with code examples
            await redis.set(`${JOB_PREFIX}:${siteJobId}:step:page-recos`, parsed, { ex: STEP_TTL });
            console.log(`[pro-consolidate] Step 5 done. Code examples: ${codeExamples.length}`);
          }
        } catch (e) { console.error(`[pro-consolidate] Step 5 Code examples failed (non-blocking): ${e.message}`); }
      } else {
        console.log(`[pro-consolidate] Step 5 skipped — no high-priority recos`);
      }
      // Use shorter delay for assembly step
      await triggerConsolidationStep(siteJobId, 6, { baseUrl });
      return res.status(200).json({ success: true, step: 5 });
    }

    // ── STEP 6: Assembly + QA + store + trigger finalize ─────────────────
    if (step === 6) {
      // Read all step results from Redis
      const [synthesisRaw, criteriaRaw, citationsRaw, pageRecosRaw] = await Promise.all([
        redis.get(`${JOB_PREFIX}:${siteJobId}:step:synthesis`),
        redis.get(`${JOB_PREFIX}:${siteJobId}:step:criteria`),
        redis.get(`${JOB_PREFIX}:${siteJobId}:step:citations`),
        redis.get(`${JOB_PREFIX}:${siteJobId}:step:page-recos`),
      ]);

      const synthesis = (typeof synthesisRaw === 'string' ? JSON.parse(synthesisRaw) : synthesisRaw) || { executiveSummary: '', topStrengths: [], topWeaknesses: [], patterns: [], actionPlan: [] };
      const rawCriteria = (typeof criteriaRaw === 'string' ? JSON.parse(criteriaRaw) : criteriaRaw) || [];
      const citationTest = (typeof citationsRaw === 'string' ? JSON.parse(citationsRaw) : citationsRaw) || { tests: [], summary: {} };
      const pageRecommendations = (typeof pageRecosRaw === 'string' ? JSON.parse(pageRecosRaw) : pageRecosRaw) || {};

      // Log what we have
      console.log(`[pro-consolidate] Step 6 Assembly — Synthesis: ${(synthesis.executiveSummary || '').length}c, Criteria: ${rawCriteria.length}, Citations: ${(citationTest.tests || citationTest.queries || []).length}q, PageRecos: ${Object.keys(pageRecommendations).length} pages`);

      // Check for critical missing data — retrigger failed steps instead of delivering incomplete report
      const missingSteps = [];
      if (!synthesis.executiveSummary || (synthesis.executiveSummary || '').length < 50) missingSteps.push(1);
      if (!Array.isArray(rawCriteria) || rawCriteria.length === 0) missingSteps.push(2);
      if (Object.keys(pageRecommendations).length === 0) missingSteps.push(4);

      if (missingSteps.length > 0) {
        // Check retrigger counter to prevent infinite loops (max 2 retriggers)
        const retriggerKey = `${JOB_PREFIX}:${siteJobId}:retrigger_count`;
        const retriggerCount = Number(await redis.get(retriggerKey)) || 0;
        if (retriggerCount >= 2) {
          console.error(`[pro-consolidate] Step 6: missing steps ${missingSteps.join(', ')} but max retriggers (2) reached. Delivering partial report.`);
          // Continue with what we have — don't block delivery forever
        } else {
          await redis.set(retriggerKey, retriggerCount + 1, { ex: STEP_TTL });
          console.warn(`[pro-consolidate] Step 6: missing data for steps ${missingSteps.join(', ')}. Retrigger ${retriggerCount + 1}/2 → step ${missingSteps[0]}`);
          await triggerConsolidationStep(siteJobId, missingSteps[0], { baseUrl });
          return res.status(200).json({ success: false, reason: 'missing_data', missingSteps, retriggered: missingSteps[0], retriggerCount: retriggerCount + 1 });
        }
      }

      // Enrich criteria with score data
      const criteriaConsolidated = (Array.isArray(rawCriteria) ? rawCriteria : []).map(cc => {
        const avg = agg.criteriaAverages[cc.criterion];
        return {
          ...cc, avgScore: avg?.avgScore || 0, max: avg?.max || 0,
          concreteExamples: agg.validPages
            .map(p => { const c = (p.criteria || []).find(cr => cr.name === cc.criterion); return c ? { url: p.url, score: c.score, max: c.max } : null; })
            .filter(Boolean).sort((a, b) => (a.score / a.max) - (b.score / b.max)).slice(0, 3),
        };
      });

      // Inject per-page recommendations (fuzzy URL matching to handle trailing slash differences from GPT)
      const normalizeUrl = u => (u || '').replace(/\/+$/, '').toLowerCase();
      const recosByNormalized = {};
      for (const [url, recos] of Object.entries(pageRecommendations)) {
        recosByNormalized[normalizeUrl(url)] = recos;
      }
      const fullPages = pages.map(p => {
        const recos = p.recommendations && p.recommendations.length > 0
          ? p.recommendations
          : (recosByNormalized[normalizeUrl(p.url)] || []);
        return {
          url: p.url, score: p.score, error: p.error || null,
          topPriority: p.topPriority || null, verdict: p.verdict || null,
          strengths: p.strengths || [], criteria: p.criteria || [],
          recommendations: recos,
        };
      });

      const consolidatedReport = {
        siteJobId, rootUrl, locale, queuedAt: meta.queuedAt,
        consolidatedAt: new Date().toISOString(),
        scoreAverage: agg.scoreAverage, scoreMedian: agg.scoreMedian, distribution: agg.distribution,
        pagesValid: agg.validPages.length, pagesWithError: agg.errorPages.length,
        criteriaAverages: agg.criteriaAverages, criteriaConsolidated,
        executiveSummary: synthesis.executiveSummary,
        topStrengths: synthesis.topStrengths || [], topWeaknesses: synthesis.topWeaknesses || [],
        patterns: synthesis.patterns || [],
        actionPlan: sortActionPlan(synthesis.actionPlan),
        citationTestConsolidated: {
          queries: citationTest.tests || citationTest.queries || [],
          citationRate: citationTest.summary?.total_tests
            ? `${citationTest.summary.cited_count || 0}/${citationTest.summary.total_tests}`
            : (citationTest.citationRate || `0/${(citationTest.tests || citationTest.queries || []).length || 0}`),
          bestOpportunity: citationTest.summary?.best_opportunity || citationTest.bestOpportunity || '',
          mainBlocker: citationTest.summary?.main_blocker || citationTest.mainBlocker || '',
        },
        pages: fullPages,
      };

      // QA pass (non-blocking)
      try {
        const qaSummary = {
          scoreAverage: consolidatedReport.scoreAverage,
          actionPlanTitles: (consolidatedReport.actionPlan || []).map(a => a.action?.substring(0, 60)),
          pagesWithRecos: consolidatedReport.pages.filter(p => (p.recommendations || []).length > 0).length,
          pagesWithoutRecos: consolidatedReport.pages.filter(p => !p.error && (p.recommendations || []).length === 0).map(p => p.url),
        };
        const qaPrompt = `${locale === 'en' ? 'English.' : 'Francais.'}\n\nQA check for a GEO audit report:\n${JSON.stringify(qaSummary)}\n\nCheck for duplicate actions. Return JSON:\n{"duplicateActionIndices":[[0,3]]}\nIf no duplicates: {"duplicateActionIndices":[]}\nJSON only.`;
        const qaCompletion = await openai.chat.completions.create({ model: 'gpt-4o-mini', max_tokens: 1000, temperature: 0, messages: [{ role: 'user', content: qaPrompt }] });
        let qaRaw = qaCompletion.choices[0].message.content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        const qaMatch = qaRaw.match(/\{[\s\S]*\}/);
        if (qaMatch) {
          const qa = JSON.parse(qaMatch[0]);
          if (qa.duplicateActionIndices?.length > 0) {
            const toRemove = new Set();
            for (const group of qa.duplicateActionIndices) {
              for (let i = 1; i < group.length; i++) toRemove.add(group[i]);
            }
            if (toRemove.size > 0) {
              consolidatedReport.actionPlan = consolidatedReport.actionPlan.filter((_, i) => !toRemove.has(i));
              console.log(`[pro-consolidate] QA: removed ${toRemove.size} duplicate actions`);
            }
          }
        }
      } catch (e) { console.error(`[pro-consolidate] QA failed (non-blocking): ${e.message}`); }

      // Store consolidated report
      await redis.set(`${JOB_PREFIX}:${siteJobId}:consolidated`, consolidatedReport, { ex: CONSOLIDATED_TTL });
      await redis.set(`${JOB_PREFIX}:${siteJobId}:status`, 'consolidated', { ex: CONSOLIDATED_TTL });

      console.log(`[pro-consolidate] Step 6 done in ${Date.now() - startMs}ms. Score: ${agg.scoreAverage}/100. Recos: ${fullPages.reduce((s, p) => s + (p.recommendations || []).length, 0)}`);

      // Trigger finalize
      await triggerFinalizeReport(siteJobId, { baseUrl });
      console.log(`[pro-consolidate] Finalization triggered for ${siteJobId}`);

      return res.status(200).json({ success: true, step: 6, status: 'consolidated' });
    }

    return res.status(400).json({ error: `Invalid step: ${step}` });
  } catch (err) {
    console.error(`[pro-consolidate] Step ${step} error for ${siteJobId}:`, err.message);
    try {
      const { Resend } = require('resend');
      const alertResend = new Resend(process.env.RESEND_API_KEY);
      const meta = await redis.get(`${JOB_PREFIX}:${siteJobId}:meta`).catch(() => null);
      await alertResend.emails.send({
        from: 'Detekia <hello@detekia.fr>',
        to: 'guillaume@beeleven.fr',
        subject: `🚨 Consolidation step ${step} échouée — ${siteJobId}`,
        html: `<div style="font-family:system-ui;padding:24px;">
          <h2 style="color:#D97757;">Consolidation Pro step ${step}/6 échouée</h2>
          <p><strong>Job :</strong> ${siteJobId}</p>
          <p><strong>Site :</strong> ${meta?.rootUrl || 'inconnu'}</p>
          <p><strong>Step :</strong> ${step}/6</p>
          <p><strong>Erreur :</strong> ${err.message}</p>
        </div>`,
      });
    } catch (_) {}
    return res.status(500).json({ error: err.message });
  }
}
