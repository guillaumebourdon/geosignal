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
      model: 'claude-4-sonnet-20250514',
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
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: query }],
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '';
    const responseLower = response.toLowerCase();
    const hostLower = hostname.toLowerCase();
    const brandLower = brand.toLowerCase();

    // Check citation
    const cited = responseLower.includes(hostLower)
      || (brandLower.length > 3 && responseLower.includes(brandLower));

    // Extract competitors mentioned (look for brand-like words near recommendation context)
    const competitors = extractCompetitors(response, hostname, brand);

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
    // Retry once
    try {
      await new Promise(r => setTimeout(r, 2000));
      const retry = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: query }],
        max_tokens: 800,
        temperature: 0.7,
      });
      const response = retry.choices[0]?.message?.content || '';
      const responseLower = response.toLowerCase();
      const cited = responseLower.includes(hostname.toLowerCase())
        || (brand.length > 3 && responseLower.includes(brand.toLowerCase()));
      return {
        query, difficulty, cited,
        competitors_cited: cited ? [] : extractCompetitors(response, hostname, brand).slice(0, 5),
        difficulty_to_rank: difficulty === 'generic' ? (locale === 'en' ? 'hard' : 'difficile') : (locale === 'en' ? 'medium' : 'moyen'),
        recommendation: '',
        ai_response_excerpt: response.slice(0, 150),
      };
    } catch {
      return null; // Skip this query
    }
  }
}

function extractCompetitors(response, hostname, brand) {
  // Look for URLs, brand names, and proper nouns that aren't the analyzed site
  const competitors = new Set();
  const hostLower = hostname.toLowerCase();
  const brandLower = brand.toLowerCase();

  // Extract domain names mentioned in the response
  const urlMatches = response.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|fr|io|co|org|net|eu|app|ai|dev))/gi) || [];
  urlMatches.forEach(m => {
    const domain = m.replace(/https?:\/\//i, '').replace(/^www\./, '').split('/')[0].toLowerCase();
    if (!domain.includes(hostLower) && domain.length > 3) competitors.add(domain);
  });

  // Extract multi-word brand names (2+ consecutive capitalized words)
  const brandMatches = response.match(/\b[A-Z][a-zA-Z]{1,}(?:\s+[A-Z][a-zA-Z]{1,}){1,4}\b/g) || [];

  // Extract single-word brand names (capitalized, 4+ chars, not a common word)
  const singleBrands = response.match(/\b[A-Z][a-z]{3,}\b/g) || [];

  // Build brand variants for matching
  const brandWords = brandLower.split(/\s+/).filter(w => w.length > 2);
  const brandVariants = new Set([brandLower]);
  for (let i = 0; i < brandWords.length; i++) {
    brandVariants.add(brandWords.slice(i).join(' '));
  }

  // Words that are NEVER competitors (verbs, common nouns, generic terms)
  const rejectWords = new Set([
    // FR verbs (imperative / infinitive / conjugated)
    'consultez', 'contactez', 'appelez', 'expliquez', 'demandez', 'renseignez',
    'comparez', 'utilisez', 'choisissez', 'optez', 'inscrivez', 'recherchez',
    'assurez', 'analysez', 'configurez', 'installez', 'profitez', 'explorez',
    'conclusion', 'introduction', 'planification', 'recommandation',
    // FR common nouns / adjectives capitalized at start of sentence
    'france', 'recherche', 'certaines', 'certains', 'plusieurs', 'notamment',
    'exemple', 'cependant', 'toutefois', 'ensuite', 'enfin', 'souvent', 'parfois',
    'actuellement', 'effectivement', 'globalement', 'principalement',
    'alternative', 'alternatives', 'marque', 'marques', 'produit', 'produits',
    'national', 'international', 'traditionnel', 'moderne', 'particulier',
    'destinations', 'stations', 'clubs', 'villages', 'services',
    'pension', 'petit', 'habituellement', 'localisation', 'prix',
    'activit', 'randonn', 'flexibilit', 'natation', 'sportif', 'sportive',
    // EN common words
    'however', 'several', 'certain', 'another', 'often', 'always', 'general',
    'specific', 'traditional', 'modern', 'original', 'professional', 'available',
    'popular', 'important', 'consider', 'explore', 'compare', 'review',
  ]);
  // Patterns that reject any competitor containing them
  const rejectContains = ['consultez', 'conclusion', 'contactez', 'appelez', 'renseignez',
    'comparez', 'utilisez', 'choisissez', 'optez', 'inscrivez', 'demandez', 'expliquez'];
  // FR/EN verb endings — single words matching these are rejected
  const verbEndings = /(?:ez|er|ir|ons|ées|ant|ment|tion|ité)$/i;
  // Generic multi-word phrases
  const genericMultiWord = /^(le |la |les |l'|un |une |des |du |de |en |au |aux |the |a |an |for |with |from |this |that |par |sur |dans |pour )/i;

  function isValidCompetitor(name) {
    const lower = name.toLowerCase().trim();
    if (lower.length < 3) return false;
    if (brandVariants.has(lower) || lower.includes(hostLower)) return false;
    if (brandWords.some(bw => bw.length > 3 && lower.includes(bw))) return false;
    if (rejectWords.has(lower)) return false;
    if (rejectContains.some(w => lower.includes(w))) return false;
    return true;
  }

  // Process multi-word matches
  brandMatches.forEach(m => {
    if (!isValidCompetitor(m)) return;
    if (genericMultiWord.test(m)) return;
    if (m.length > 4) competitors.add(m);
  });

  // Process single-word matches (stricter filter)
  singleBrands.forEach(m => {
    if (!isValidCompetitor(m)) return;
    // Reject single words that look like verbs/nouns (FR/EN endings)
    if (verbEndings.test(m)) return;
    // Only keep if it doesn't look like a common dictionary word
    // Real brand names: Edenred, Sodexo, Booking, Shopify, Zapier
    // Fake: Consultez, Conclusion, Destinations, Planification
    competitors.add(m);
  });

  return Array.from(competitors);
}

module.exports = { runRealCitationTest };
