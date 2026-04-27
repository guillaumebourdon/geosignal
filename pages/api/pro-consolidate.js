import { Redis } from '@upstash/redis';
import Anthropic from '@anthropic-ai/sdk';
import { verifyQstashSignature, triggerFinalizeReport } from '../../lib/proQueue';
const { runRealCitationTest } = require('../../lib/citationTest');

export const config = {
  maxDuration: 300,
  api: { bodyParser: false },
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 120000 });

const JOB_PREFIX = 'detekia:pro:v1:job';
const CONSOLIDATED_TTL = 7 * 24 * 60 * 60;
const CRITERIA_NAMES = [
  'Extractibilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T',
  'Crawlabilite IA', 'Donnees structurees', 'Neutralite editoriale',
  'Presence externe', 'Fraicheur & maintenance',
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
  const validPages = pages.filter(p => !p.error && typeof p.score === 'number');
  const errorPages = pages.filter(p => p.error);
  const scores = validPages.map(p => p.score);
  const scoreAverage = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
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
  const pagesForPrompt = validPages.map(p => ({
    url: p.url, score: p.score,
    topRecos: (p.recommendations || []).slice(0, 3).map(r => `${r.criterion}: ${r.title || r.diagnostic || ''}`).join('; '),
  }));

  return `${ctx.langInstruction}

You are a senior GEO consultant analyzing a FULL WEBSITE audit.

${ctx.statsBlock}

Site: ${rootUrl}
Average GEO score: ${scoreAverage}/100

Pages analyzed:
${pagesForPrompt.map(p => `- ${p.url} (score: ${p.score}) — ${p.topRecos}`).join('\n')}

Criteria averages:
${Object.entries(criteriaAverages).map(([k, v]) => `- ${k}: ${v.avgScore}/${v.max}`).join('\n')}

Generate a comprehensive site-level analysis. JSON only:
{"executiveSummary":"2-3 paragraphs qualitative analysis of the site's overall GEO health","topStrengths":["strength 1","strength 2","strength 3"],"topWeaknesses":["weakness 1","weakness 2","weakness 3"],"patterns":[{"pattern":"description","pagesAffected":["url1","url2"],"criterion":"criterion name","severity":"critique|important|mineur"}],"actionPlan":[{"priority":1,"action":"description","criterion":"criterion name","impact":"eleve|moyen|faible","effort":"faible|moyen|eleve","pagesAffected":["url1","url2"]}]}

Rules:
- executiveSummary: 2-3 substantial paragraphs, specific to this site. Use the FIXED STATS numbers above verbatim.
- patterns: 5 to 8 cross-page patterns detected
- actionPlan: 10 to 15 site-level actions, sorted by priority (impact/effort ratio)
- Be specific: reference actual URLs from the audit
- NEVER write "${ctx.totalValid} pages sur ${ctx.totalValid}" — that's trivially obvious. Write "${ctx.totalValid} pages" or "toutes les ${ctx.totalValid} pages".`;
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

JSON only:
{"queries":[{"query":"","type":"generic|niche|long_tail","cited":false,"competitorsCited":["competitor1"],"difficulty_to_rank":"easy|medium|hard","recommendation":"1 sentence","ai_response_excerpt":"first 100 chars of simulated AI answer"}],"citationRate":"X/30","bestOpportunity":"best query opportunity","mainBlocker":"main reason for low citations"}`;
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
[{"criterion":"exact criterion name","synthesis":"2-3 sentences describing the state of this criterion across all pages","consolidatedRecommendation":{"diagnostic":"1 sentence","whyCritical":"1 sentence","whatToDo":"2 sentences","howToDoIt":"2-3 sentences","concreteExample":"1 sentence","expectedImpact":"1 sentence","expertTip":"1 sentence","pagesAffected":["url1","url2"]}}]

Rules:
- synthesis must use the FIXED STATS numbers above
- consolidatedRecommendation must be site-level, not page-specific
- pagesAffected: list up to 5 most impacted URLs
- Be specific to ${rootUrl}

JSON array only, no markdown:`;
}

// ── Step 5: Run 3 Sonnet calls in parallel ──────────────────────────────────

async function runParallelCalls(synthesisPrompt, citationPrompt, criteriaPrompt, { rootUrl, metaDescription, intro, locale } = {}) {
  console.log('[pro-consolidate] Starting Sonnet synthesis + criteria + real citation test...');
  const start = Date.now();

  const hostname = new URL(rootUrl).hostname.replace(/^www\./, '');
  const brand = hostname.split('.')[0];

  const [synthR, citR, critR] = await Promise.allSettled([
    callSonnet({ model: 'claude-4-sonnet-20250514', max_tokens: 10000, temperature: 0.2, messages: [{ role: 'user', content: synthesisPrompt }] }),
    runRealCitationTest(rootUrl, hostname, brand, metaDescription || '', intro || '', 30, locale || 'fr', anthropic),
    callSonnet({ model: 'claude-4-sonnet-20250514', max_tokens: 8000, temperature: 0.2, messages: [{ role: 'user', content: criteriaPrompt }] }),
  ]);
  console.log(`[pro-consolidate] Parallel calls completed in ${Date.now() - start}ms`);

  let synthesis = { executiveSummary: '', topStrengths: [], topWeaknesses: [], patterns: [], actionPlan: [] };
  if (synthR.status === 'fulfilled') {
    try { synthesis = parseJson(synthR.value.content[0].text); console.log(`[pro-consolidate] Synthesis OK: exec=${(synthesis.executiveSummary || '').length}c`); }
    catch (e) { console.error('[pro-consolidate] Synthesis parse error:', e.message); }
  } else { console.error('[pro-consolidate] Synthesis FAILED:', synthR.reason?.message); }

  let citationTest = { tests: [], summary: { cited_count: 0, total_tests: 0, best_opportunity: '', main_blocker: '' } };
  if (citR.status === 'fulfilled' && citR.value) {
    citationTest = citR.value;
    console.log(`[pro-consolidate] Citation test OK: ${citationTest.tests?.length || 0} queries tested`);
  } else { console.error('[pro-consolidate] Citation test FAILED:', citR.reason?.message || 'null result'); }

  let criteriaConsolidated = [];
  if (critR.status === 'fulfilled') {
    try {
      const arrMatch = critR.value.content[0].text.match(/\[[\s\S]*\]/);
      if (arrMatch) criteriaConsolidated = JSON.parse(arrMatch[0]);
    } catch (e) { console.error('[pro-consolidate] Criteria parse error:', e.message); }
  } else { console.error('[pro-consolidate] Criteria FAILED:', critR.reason?.message); }

  return { synthesis, citationTest, criteriaConsolidated };
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
    const { synthesis, citationTest, criteriaConsolidated: rawCriteria } = await runParallelCalls(
      buildSynthesisPrompt(ctx, rootUrl, agg.scoreAverage, agg.validPages, agg.criteriaAverages),
      buildCitationPrompt(ctx, rootUrl, agg.scoreAverage, agg.validPages),
      buildCriteriaPrompt(ctx, rootUrl, agg.scoreAverage, agg.validPages, agg.criteriaAverages),
      { rootUrl, metaDescription: homepageEvidence.metaDescription, intro: homepageEvidence.intro, locale },
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

    const fullPages = pages.map(p => ({
      url: p.url, score: p.score, error: p.error || null,
      topPriority: p.topPriority || null, verdict: p.verdict || null,
      strengths: p.strengths || [], criteria: p.criteria || [],
      recommendations: p.recommendations || [],
    }));

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

    await redis.set(`${JOB_PREFIX}:${siteJobId}:consolidated`, consolidatedReport, { ex: CONSOLIDATED_TTL });
    await redis.set(`${JOB_PREFIX}:${siteJobId}:status`, 'consolidated', { ex: CONSOLIDATED_TTL });

    console.log(`[pro-consolidate] Consolidated ${siteJobId} in ${Date.now() - startMs}ms. Score: ${agg.scoreAverage}/100`);

    // Trigger finalize (atomic guard)
    const pdfLock = `${JOB_PREFIX}:${siteJobId}:pdf_triggered`;
    const acquired = await redis.set(pdfLock, '1', { nx: true, ex: CONSOLIDATED_TTL });
    if (acquired) {
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers['host'] || 'localhost:3000';
      await triggerFinalizeReport(siteJobId, { baseUrl: `${proto}://${host}` });
      console.log(`[pro-consolidate] Finalization triggered for ${siteJobId}`);
    }

    return res.status(200).json({ success: true, siteJobId, status: 'consolidated' });
  } catch (err) {
    console.error(`[pro-consolidate] Error for ${siteJobId}:`, err.message);
    return res.status(500).json({ error: err.message });
  }
}
