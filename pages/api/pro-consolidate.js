import { Redis } from '@upstash/redis';
import Anthropic from '@anthropic-ai/sdk';
import { verifyQstashSignature, triggerFinalizeReport } from '../../lib/proQueue';
const { runRealCitationTest } = require('../../lib/citationTest');

export const config = {
  maxDuration: 600,
  api: { bodyParser: false },
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 500000 });

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
    const adj = pct < 30 ? 'catastrophique' : pct < 50 ? 'faible' : pct < 70 ? 'moyen' : pct < 85 ? 'bon' : 'excellent';
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
<30% = catastrophique | 30-50% = faible | 50-70% = moyen | 70-85% = bon | >85% = excellent
FORBIDDEN above 50%: catastrophique, grave, lacune critique, défaillant, alarmant.
Above 50%, acceptable words: moyen, à améliorer, perfectible, insuffisant, modéré.
Per-criterion qualifiers (use these exact words):
${criteriaLabels}
NEVER use "catastrophique" for a score above 30%. NEVER use "faible" for a score above 50%.`;

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
- actionPlan: 10 to 15 site-level actions, sorted by priority (impact/effort ratio). Each action MUST be UNIQUE — do not repeat the same recommendation with different wording. If multiple pages need the same fix, group them into ONE action with multiple pagesAffected.
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

For each of the 8 GEO criteria, generate a JSON array of 8 objects:
[{"criterion":"exact criterion name","synthesis":"2-3 sentences describing the state of this criterion across all pages","consolidatedRecommendation":{"diagnostic":"1 sentence","whyCritical":"1 sentence","whatToDo":"2 sentences","howToDoIt":"2-3 sentences","concreteExample":"AVANT: [what the weakest page currently does wrong] → APRES: [what it should look like after the fix, with a concrete example]","expectedImpact":"1 sentence","expertTip":"1 sentence","pagesAffected":["url1","url2"]}}]

Rules:
- synthesis must use the FIXED STATS numbers above
- consolidatedRecommendation must be site-level, not page-specific
- concreteExample MUST use the AVANT/APRES format showing current state vs desired state with a real example from the site
- pagesAffected: list up to 5 most impacted URLs
- Be specific to ${rootUrl}

JSON array only, no markdown:`;
}

// ── Step 4b: Build per-page recommendations prompt ──────────────────────────

function buildPageRecommendationsPrompt(locale, rootUrl, metaDescription, validPages) {
  const langInstruction = locale === 'en'
    ? 'OUTPUT LANGUAGE: English (US). ALL text values MUST be in American English.'
    : 'LANGUE DE SORTIE : Francais. Toutes les valeurs texte en francais professionnel.';

  const pagesData = validPages.map(p => {
    const weakCriteria = (p.criteria || [])
      .filter(c => c.max > 0 && c.score < c.max)
      .sort((a, b) => (a.score / a.max) - (b.score / b.max))
      .slice(0, 5)
      .map(c => `${c.name}: ${c.score}/${c.max}`)
      .join(', ');
    return `- ${p.url} (${p.score}/100) — ${weakCriteria}`;
  }).join('\n');

  return `${langInstruction}

You are a senior GEO consultant. Generate 3 recommendations per page for a website audit.

Site: ${rootUrl}
${validPages.length} pages analyzed.

${pagesData}

CRITICAL: You MUST return recommendations for ALL ${validPages.length} pages. Do not skip any page.

JSON object, one key per URL:
{"url":[{"priority":"high|medium|low","criterion":"French criterion name","title":"5 words max","problem":"2 sentences","solution":"2 sentences","technicalImplementation":["step 1","step 2"],"impact":"high|medium|low","effort":"low|medium|high","timeframe":"1-2 sem|1 mois|2-3 mois"}]}

Rules:
- EXACTLY 3 recommendations per page, for criteria NOT at maximum score
- priority: high <50%, medium 50-70%, low >70%
- "criterion" must be one of: 'Citabilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T', 'Accessibilite IA', 'Neutralite editoriale', 'Presence externe', 'Fraicheur & signaux temporels'
- Keep problem and solution concise (2 sentences each)
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

  // 4th call AFTER the first 3 + 20s cooldown to avoid Anthropic rate limit
  console.log(`[pro-consolidate] Waiting 20s before page recos to avoid rate limit...`);
  await new Promise(r => setTimeout(r, 20000));
  const pageRecoR = await Promise.allSettled([
    callSonnet({ model: 'claude-4-sonnet-20250514', max_tokens: 10000, temperature: 0.2, messages: [{ role: 'user', content: pageRecoPrompt }] }),
  ]).then(r => r[0]);
  console.log(`[pro-consolidate] Page reco call completed in ${Date.now() - start}ms (status: ${pageRecoR.status})`);

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
      const codePrompt = `${locale === 'en' ? 'OUTPUT LANGUAGE: English.' : 'LANGUE DE SORTIE : Francais.'}\n\nGenerate code examples (JSON-LD, HTML, or meta tags) for these website audit recommendations.\n\nSite: ${rootUrl}\n\n${topRecos.map((r, i) => `${i + 1}. [${r.url}] ${r.criterion}: ${r.title} — ${r.solution || r.problem}`).join('\n')}\n\nReturn a JSON array of ${topRecos.length} code snippets:\n[{"index":0,"codeExample":"<code here>"},{"index":1,"codeExample":"<code>"}]\n\nRules:\n- Each codeExample must be a real, copy-pasteable code snippet (JSON-LD, HTML meta tag, or HTML structure)\n- Add <!-- Adaptez avec vos vraies valeurs --> at the top if it contains placeholder values\n- Keep each snippet under 15 lines\n- JSON array only, no markdown`;

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

// ── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const signature = req.headers['upstash-signature'];
  const rawBody = await readRawBody(req);

  if (!signature || !(await verifyQstashSignature(signature, rawBody))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { siteJobId } = JSON.parse(rawBody);
  if (!siteJobId) return res.status(400).json({ error: 'Missing siteJobId' });

  const startMs = Date.now();
  console.log(`[pro-consolidate] Starting consolidation for ${siteJobId}`);

  try {
    const jobData = await readJobData(siteJobId);
    if (!jobData) return res.status(404).json({ error: 'Job not found' });

    const { meta, pages } = jobData;
    const locale = meta.locale || 'fr';
    const rootUrl = meta.rootUrl;
    const agg = computeAggregates(pages);
    const ctx = buildPromptContext(locale, rootUrl, agg);

    const homepageEvidence = agg.validPages[0]?.evidence || {};
    const { synthesis, citationTest, criteriaConsolidated: rawCriteria, pageRecommendations } = await runParallelCalls(
      buildSynthesisPrompt(ctx, rootUrl, agg.scoreAverage, agg.validPages, agg.criteriaAverages),
      buildCitationPrompt(ctx, rootUrl, agg.scoreAverage, agg.validPages),
      buildCriteriaPrompt(ctx, rootUrl, agg.scoreAverage, agg.validPages, agg.criteriaAverages),
      { rootUrl, metaDescription: homepageEvidence.metaDescription, intro: homepageEvidence.intro, locale, validPages: agg.validPages },
    );

    // Enrich criteria with score data
    const criteriaConsolidated = rawCriteria.map(cc => {
      const avg = agg.criteriaAverages[cc.criterion];
      return {
        ...cc, avgScore: avg?.avgScore || 0, max: avg?.max || 0,
        concreteExamples: agg.validPages
          .map(p => { const c = (p.criteria || []).find(cr => cr.name === cc.criterion); return c ? { url: p.url, score: c.score, max: c.max } : null; })
          .filter(Boolean).sort((a, b) => (a.score / a.max) - (b.score / b.max)).slice(0, 3),
      };
    });

    // Inject per-page recommendations from consolidation Claude call
    // Workers only do scoring; recos are generated here in a single Claude call
    const fullPages = pages.map(p => {
      const recos = p.recommendations && p.recommendations.length > 0
        ? p.recommendations  // Use existing recos if present (e.g. from cache)
        : (pageRecommendations[p.url] || []);  // Otherwise use consolidation-generated recos
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
        citationRate: citationTest.summary?.cited_count ? `${citationTest.summary.cited_count}/${citationTest.summary.total_tests}` : (citationTest.citationRate || '0/0'),
        bestOpportunity: citationTest.summary?.best_opportunity || citationTest.bestOpportunity || '',
        mainBlocker: citationTest.summary?.main_blocker || citationTest.mainBlocker || '',
      },
      pages: fullPages,
    };

    // QA pass: verify and fix the consolidated report before storing
    try {
      const qaSummary = {
        scoreAverage: consolidatedReport.scoreAverage,
        pagesValid: consolidatedReport.pagesValid,
        criteriaAverages: Object.entries(consolidatedReport.criteriaAverages).map(([k, v]) => `${k}: ${v.avgScore}/${v.max}`),
        actionPlanTitles: (consolidatedReport.actionPlan || []).map(a => a.action?.substring(0, 60)),
        pagesWithRecos: consolidatedReport.pages.filter(p => (p.recommendations || []).length > 0).length,
        pagesWithoutRecos: consolidatedReport.pages.filter(p => !p.error && (p.recommendations || []).length === 0).map(p => p.url),
        criteriaWithoutRecos: Object.entries(consolidatedReport.criteriaAverages)
          .filter(([name, data]) => data.avgScore < data.max)
          .filter(([name]) => {
            const allRecos = consolidatedReport.pages.flatMap(p => (p.recommendations || []).filter(r => r.criterion === name));
            return allRecos.length === 0;
          })
          .map(([name, data]) => `${name}: ${data.avgScore}/${data.max} — 0 recos`),
        executiveSummaryLength: (consolidatedReport.executiveSummary || '').length,
      };

      const qaPrompt = `${locale === 'en' ? 'English.' : 'Francais.'}\n\nYou are a QA reviewer for a GEO audit report. Check this report summary for issues:\n\n${JSON.stringify(qaSummary, null, 2)}\n\nCheck:\n1. Pages without recommendations (should have 3 each unless error page)\n2. Criteria below max score with 0 recos (every non-max criterion needs recos)\n3. Duplicate actions in the plan (same idea repeated with different words)\n4. Executive summary present and substantial (>200 chars)\n\nReturn JSON:\n{"issues":[{"type":"missing_recos_page|missing_recos_criterion|duplicate_action|empty_summary","detail":"description","severity":"critical|warning"}],"duplicateActionIndices":[[0,3],[2,7]]}\n\nIf no issues: {"issues":[]}\nJSON only.`;

      await new Promise(r => setTimeout(r, 3000));
      const qaMsg = await callSonnet({ model: 'claude-4-sonnet-20250514', max_tokens: 2000, temperature: 0, messages: [{ role: 'user', content: qaPrompt }] });
      let qaRaw = qaMsg.content[0].text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      const qaMatch = qaRaw.match(/\{[\s\S]*\}/);
      if (qaMatch) {
        const qa = JSON.parse(qaMatch[0]);
        const issues = qa.issues || [];
        console.log(`[pro-consolidate] QA: ${issues.length} issues found`);

        // Auto-fix: remove duplicate actions
        if (qa.duplicateActionIndices && qa.duplicateActionIndices.length > 0) {
          const toRemove = new Set();
          for (const group of qa.duplicateActionIndices) {
            // Keep first, remove rest
            for (let i = 1; i < group.length; i++) toRemove.add(group[i]);
          }
          if (toRemove.size > 0) {
            consolidatedReport.actionPlan = consolidatedReport.actionPlan.filter((_, i) => !toRemove.has(i));
            console.log(`[pro-consolidate] QA: removed ${toRemove.size} duplicate actions`);
          }
        }

        // Log critical issues for visibility
        for (const issue of issues) {
          if (issue.severity === 'critical') {
            console.warn(`[pro-consolidate] QA CRITICAL: ${issue.type} — ${issue.detail}`);
          }
        }
      }
    } catch (e) {
      console.error('[pro-consolidate] QA pass failed (non-blocking):', e.message);
    }

    await redis.set(`${JOB_PREFIX}:${siteJobId}:consolidated`, consolidatedReport, { ex: CONSOLIDATED_TTL });
    await redis.set(`${JOB_PREFIX}:${siteJobId}:status`, 'consolidated', { ex: CONSOLIDATED_TTL });

    console.log(`[pro-consolidate] Consolidated ${siteJobId} in ${Date.now() - startMs}ms. Score: ${agg.scoreAverage}/100`);

    // Trigger finalize — no lock needed, finalize-report is idempotent
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'localhost:3000';
    await triggerFinalizeReport(siteJobId, { baseUrl: `${proto}://${host}` });
    console.log(`[pro-consolidate] Finalization triggered for ${siteJobId}`);

    return res.status(200).json({ success: true, siteJobId, status: 'consolidated' });
  } catch (err) {
    console.error(`[pro-consolidate] Error for ${siteJobId}:`, err.message);
    // Alert admin — client paid but consolidation failed
    try {
      const { Resend } = require('resend');
      const alertResend = new Resend(process.env.RESEND_API_KEY);
      const meta = await redis.get(`${JOB_PREFIX}:${siteJobId}:meta`).catch(() => null);
      await alertResend.emails.send({
        from: 'Detekia <hello@detekia.fr>',
        to: 'guillaume@beeleven.fr',
        subject: `🚨 Consolidation échouée — ${siteJobId}`,
        html: `<div style="font-family:system-ui;padding:24px;">
          <h2 style="color:#D97757;">Consolidation Pro échouée</h2>
          <p><strong>Job :</strong> ${siteJobId}</p>
          <p><strong>Site :</strong> ${meta?.rootUrl || 'inconnu'}</p>
          <p><strong>Email client :</strong> ${meta?.customerEmail || 'inconnu'}</p>
          <p><strong>Erreur :</strong> ${err.message}</p>
          <p style="color:#D97757;font-weight:bold;">Action requise : relancer manuellement via /api/pro-trigger-consolidation</p>
        </div>`,
      });
    } catch (_) {}
    return res.status(500).json({ error: err.message });
  }
}
