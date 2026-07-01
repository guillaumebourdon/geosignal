/**
 * Real AI visibility test — sends actual queries to GPT-4o-mini
 * and checks if the site is cited in responses.
 */

const OpenAI = require('openai').default;

let openai = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30000 });
  } else {
    console.warn('[citationTest] OPENAI_API_KEY not set — real citation test disabled, no queries will be executed');
  }
} catch (e) {
  console.error('[citationTest] OpenAI init failed:', e.message);
}

/**
 * Generate queries using Anthropic, then test each on OpenAI GPT-4o-mini.
 * @param {string} url - Site URL
 * @param {string} hostname - Normalized hostname
 * @param {string} brand - Brand/site name
 * @param {string} metaDescription - Site meta description
 * @param {string} intro - First 300 chars of content
 * @param {number} queryCount - Number of queries (2 for free, 10 for 29€, 30 for 99€)
 * @param {string} locale - 'fr' or 'en'
 * @param {object} anthropicClient - Anthropic SDK instance
 * @returns {{ tests: Array, summary: object }}
 */
async function runRealCitationTest(url, hostname, brand, metaDescription, intro, queryCount, locale, anthropicClient) {
  // Step 1: Generate queries using Sonnet
  const queryPrompt = buildQueryGenerationPrompt(url, hostname, brand, metaDescription, intro, queryCount, locale);

  let queries = [];
  try {
    const msg = await anthropicClient.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      temperature: 0.3,
      messages: [{ role: 'user', content: queryPrompt }],
    });
    const raw = msg.content[0].text;
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) queries = JSON.parse(match[0]);
  } catch (e) {
    console.error('[citationTest] Query generation failed:', e.message);
    return null;
  }

  if (!queries.length) return null;

  // Step 2: Execute each query on GPT-4o-mini and check citation
  // All queries in a single parallel batch with per-query timeout
  const tests = [];
  const QUERY_TIMEOUT = 20000; // 20s max per query

  const withTimeout = (promise) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('query timeout')), QUERY_TIMEOUT)),
  ]);

  const results = await Promise.allSettled(
    queries.map(q => withTimeout(executeQuery(q, hostname, brand, locale)))
  );
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) tests.push(r.value);
  }

  // Summary
  const citedCount = tests.filter(t => t.cited).length;
  const bestOpportunity = tests.find(t => !t.cited && t.difficulty === 'niche')?.query
    || tests.find(t => !t.cited)?.query || '';
  const allCompetitors = tests.flatMap(t => t.competitors_cited || []);
  const competitorFreq = {};
  allCompetitors.forEach(c => { competitorFreq[c] = (competitorFreq[c] || 0) + 1; });
  const mainBlocker = Object.entries(competitorFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  return {
    tests,
    summary: {
      cited_count: citedCount,
      total_tests: tests.length,
      best_opportunity: bestOpportunity,
      main_blocker: mainBlocker
        ? (locale === 'en'
          ? `${mainBlocker} is cited ${competitorFreq[mainBlocker]} times`
          : `${mainBlocker} est cité ${competitorFreq[mainBlocker]} fois`)
        : '',
    },
  };
}

function buildQueryGenerationPrompt(url, hostname, brand, metaDescription, intro, queryCount, locale) {
  const distribution = queryCount <= 2
    ? `${queryCount} requêtes de niche liées directement au métier du site`
    : queryCount <= 10
      ? `3 requêtes génériques (forte concurrence), 4 requêtes de niche, 3 requêtes longue traîne`
      : `10 requêtes génériques, 10 de niche, 10 longue traîne`;

  const lang = locale === 'en' ? 'English' : 'French';

  return `Generate ${queryCount} search queries that real users would ask to an AI assistant (ChatGPT, Perplexity) about the topic of this website. The queries must be in ${lang}.

Site: ${url}
Brand: ${brand}
Description: ${metaDescription || 'N/A'}
Content preview: ${intro}

Distribution: ${distribution}

Return a JSON array only, no markdown:
[{"query":"the query in ${lang}","difficulty":"generic|niche|long_tail"}]

Rules:
- Queries must be realistic — things a potential customer would actually ask
- Vary the angles (comparisons, how-to, best options, recommendations)
- Do NOT mention the brand name in the query itself
- Queries must relate to the site's actual business domain`;
}

async function executeQuery(queryObj, hostname, brand, locale) {
  const { query, difficulty } = queryObj;

  if (!openai) return null; // OpenAI not configured — skip

  try {
    // Ask GPT to answer AND extract brands/companies in structured format
    const structuredPrompt = locale === 'en'
      ? `Answer this question, then list any companies/brands/websites you mentioned.
Format your response EXACTLY like this:
ANSWER: [your answer here]
BRANDS: [comma-separated list of company/brand names mentioned, or "none"]

Question: ${query}`
      : `Réponds à cette question, puis liste les entreprises/marques/sites que tu as mentionnés.
Formate ta réponse EXACTEMENT comme ceci :
REPONSE: [ta réponse ici]
MARQUES: [liste séparée par des virgules des noms d'entreprises/marques mentionnées, ou "aucune"]

Question : ${query}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: structuredPrompt }],
      max_tokens: 800,
      temperature: 0.7,
    });

    const fullResponse = completion.choices[0]?.message?.content || '';

    // Parse structured response
    const answerMatch = fullResponse.match(/(?:ANSWER|REPONSE)\s*:\s*([\s\S]*?)(?=\n(?:BRANDS|MARQUES)\s*:|$)/i);
    const brandsMatch = fullResponse.match(/(?:BRANDS|MARQUES)\s*:\s*(.*)/i);
    const response = answerMatch ? answerMatch[1].trim() : fullResponse;
    const responseLower = response.toLowerCase();
    const hostLower = hostname.toLowerCase();
    const brandLower = brand.toLowerCase();

    // Check citation
    const cited = responseLower.includes(hostLower)
      || (brandLower.length > 2 && responseLower.includes(brandLower));

    // Extract competitors from GPT's own brand list (much more reliable than regex)
    let competitors = [];
    if (brandsMatch && brandsMatch[1]) {
      const brandsList = brandsMatch[1].trim();
      if (!/^(aucune|none|n\/a|-)$/i.test(brandsList)) {
        competitors = brandsList.split(/[,;]/)
          .map(b => b.trim().replace(/^["']|["']$/g, ''))
          .filter(b => {
            if (!b || b.length < 3) return false;
            const lower = b.toLowerCase();
            if (lower.includes(hostLower)) return false;
            // Also check hostname without TLD (swile.co → swile)
            const hostBase = hostLower.split('.')[0];
            if (hostBase.length > 2 && lower.includes(hostBase)) return false;
            if (brandLower.length > 2 && lower.includes(brandLower)) return false;
            return true;
          });
      }
    }

    return {
      query,
      difficulty,
      cited,
      competitors_cited: cited ? [] : competitors.slice(0, 5),
      difficulty_to_rank: difficulty === 'generic' ? (locale === 'en' ? 'hard' : 'difficile') : difficulty === 'niche' ? (locale === 'en' ? 'medium' : 'moyen') : (locale === 'en' ? 'easy' : 'facile'),
      recommendation: cited
        ? (locale === 'en' ? 'Your site appears in this response.' : 'Votre site apparaît dans cette réponse.')
        : (locale === 'en' ? 'Your site is not mentioned. Consider optimizing content for this query.' : 'Votre site n\'est pas mentionné. Optimisez votre contenu pour cette requête.'),
      ai_response_excerpt: response.slice(0, 150),
    };
  } catch (e) {
    console.error(`[citationTest] OpenAI query failed for "${query}":`, e.message);
    // Retry once with simple query (no structured format — just check citation)
    try {
      await new Promise(r => setTimeout(r, 1000));
      const retry = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: query }],
        max_tokens: 500,
        temperature: 0.7,
      });
      const response = retry.choices[0]?.message?.content || '';
      const responseLower = response.toLowerCase();
      const cited = responseLower.includes(hostname.toLowerCase())
        || (brand.length > 3 && responseLower.includes(brand.toLowerCase()));
      return {
        query, difficulty, cited,
        competitors_cited: [],
        difficulty_to_rank: difficulty === 'generic' ? (locale === 'en' ? 'hard' : 'difficile') : (locale === 'en' ? 'medium' : 'moyen'),
        recommendation: '',
        ai_response_excerpt: response.slice(0, 150),
      };
    } catch {
      return null;
    }
  }
}

module.exports = { runRealCitationTest };
