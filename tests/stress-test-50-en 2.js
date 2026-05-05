/**
 * Full pipeline stress test — 50 English sites, 30s between each, 0 AI cost.
 * Tests: sitemap, Jina scraping, direct HTML, schema detection, scoring.
 *
 * Run: node tests/stress-test-50-en.js
 */

const { getTopPrioritizedUrls } = require('../lib/sitemapPrioritizer');
const { scoreExtractibility, scoreVerifiability, scoreAuthority, scoreCrawlability, scoreStructuredData, scoreExternalPresence, scoreFreshness } = require('../lib/scoring');
const axios = require('axios');
const cheerio = require('cheerio');

const SITES = [
  // ── SaaS (20) ──
  'https://www.hubspot.com', 'https://www.salesforce.com', 'https://slack.com',
  'https://www.asana.com', 'https://monday.com', 'https://www.freshworks.com',
  'https://www.zendesk.com', 'https://www.twilio.com', 'https://www.cloudflare.com',
  'https://www.vercel.com', 'https://supabase.com', 'https://www.prisma.io',
  'https://www.postman.com', 'https://www.docker.com', 'https://www.gitlab.com',
  'https://www.atlassian.com', 'https://www.dropbox.com', 'https://www.grammarly.com',
  'https://www.calendly.com', 'https://www.krisp.ai',
  // ── E-commerce EN (5) ──
  'https://www.shopify.com', 'https://www.bigcommerce.com', 'https://www.etsy.com',
  'https://www.depop.com', 'https://www.goat.com',
  // ── Media / Blog EN (8) ──
  'https://www.wired.com', 'https://arstechnica.com', 'https://www.producthunt.com',
  'https://news.ycombinator.com', 'https://dev.to', 'https://www.smashingmagazine.com',
  'https://css-tricks.com', 'https://stackoverflow.blog',
  // ── AI companies (7) ──
  'https://www.perplexity.ai', 'https://www.midjourney.com', 'https://www.runway.ml',
  'https://replicate.com', 'https://www.together.ai', 'https://deepmind.google',
  'https://www.inflection.ai',
  // ── Dev tools / Infrastructure (5) ──
  'https://www.mongodb.com', 'https://www.redis.io', 'https://www.elastic.co',
  'https://www.hashicorp.com', 'https://www.pulumi.com',
  // ── Small / niche EN (5) ──
  'https://www.beehiiv.com', 'https://www.buttondown.email', 'https://www.ghost.org',
  'https://www.convertkit.com', 'https://www.mailchimp.com',
];

const UA = 'Mozilla/5.0 (compatible; DetekiaBot/1.0; +https://detekia.fr)';
const DELAY = 30000;

async function fetchDirect(url) {
  try {
    const { data } = await axios.get(url, { timeout: 10000, maxRedirects: 5, headers: { 'User-Agent': UA } });
    return data;
  } catch { return null; }
}

async function fetchJina(url) {
  const headers = { Accept: 'text/html' };
  if (process.env.JINA_API_KEY) headers.Authorization = `Bearer ${process.env.JINA_API_KEY}`;
  try {
    const { data } = await axios.get(`https://r.jina.ai/${url}`, { headers, timeout: 20000 });
    return data;
  } catch (e) { return { error: e.message }; }
}

async function testSite(url) {
  const result = { url, issues: [], warnings: [] };

  // 1. SITEMAP
  try {
    const pages = await getTopPrioritizedUrls(url, { maxUrls: 20 });
    result.pages = pages.length;
    result.products = pages.filter(p => {
      try { const path = new URL(p.url).pathname; return /\/p\//.test(path) || /[0-9a-f]{8}-[0-9a-f]{4}/.test(path); } catch { return false; }
    }).length;
    if (pages.length < 5) result.issues.push(`SITEMAP:${pages.length}pages`);
    if (result.products > 5) result.issues.push(`PRODUCTS:${result.products}`);
  } catch (e) { result.issues.push(`SITEMAP_CRASH:${e.message.slice(0, 30)}`); result.pages = 0; }

  // 2. JINA
  const jina = await fetchJina(url);
  if (typeof jina === 'string') {
    const $ = cheerio.load(jina);
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    result.jinaWords = text.split(/\s+/).filter(w => w.length > 0).length;
    if (result.jinaWords < 100) result.issues.push(`JINA_SHORT:${result.jinaWords}w`);
  } else {
    result.jinaWords = 0;
    result.issues.push(`JINA_FAIL:${(jina?.error || '').slice(0, 25)}`);
  }

  // 3. DIRECT HTML
  const html = await fetchDirect(url);
  if (html) {
    const $ = cheerio.load(html);
    const schemas = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try { const d = JSON.parse($(el).html()); const e = o => { if (o?.['@type']) schemas.push(o['@type']); if (Array.isArray(o?.['@graph'])) o['@graph'].forEach(e); }; e(d); } catch {}
    });
    result.schemas = [...new Set(schemas)].length;
    result.metaDesc = !!($('meta[name="description"]').attr('content'));
    result.lang = !!$('html').attr('lang');
    result.canonical = $('link[rel="canonical"]').length > 0;

    if (typeof jina === 'string') {
      try {
        const $j = cheerio.load(jina);
        $('script[type="application/ld+json"]').each((_, el) => { const c = $(el).html(); if (c) $j('body').append(`<script type="application/ld+json">${c}</script>`); });
        const text = $j('body').text().replace(/\s+/g, ' ').trim();
        const hostname = new URL(url).hostname;
        const scores = {
          ext: scoreExtractibility($j, text, jina, 'en').score,
          ver: scoreVerifiability($j, text, jina, hostname, 'en').score,
          auth: scoreAuthority($j, jina, 'en', html).score,
          crawl: scoreCrawlability($j, jina, 'en', html).score,
          struct: scoreStructuredData($j, jina, 'en').score,
          pres: scoreExternalPresence($j, jina, 'en', {}).score,
          fresh: scoreFreshness($j, jina, 'en').score,
        };
        result.score = Object.values(scores).reduce((a, b) => a + b, 0);
        if (result.score < 20) result.issues.push(`SCORE_LOW:${result.score}`);
      } catch (e) { result.issues.push(`SCORE_CRASH:${e.message.slice(0, 25)}`); }
    }
  } else {
    result.warnings.push('NO_DIRECT_HTML');
  }

  return result;
}

async function run() {
  console.log(`\n${'='.repeat(110)}`);
  console.log(`STRESS TEST EN — ${SITES.length} English sites — 30s between each`);
  console.log(`${'='.repeat(110)}\n`);

  console.log('Site'.padEnd(28) + 'Pages'.padEnd(7) + 'Jina'.padEnd(8) + 'Score'.padEnd(8) + 'Schema'.padEnd(8) + 'Meta'.padEnd(6) + 'Lang'.padEnd(6) + 'Canon'.padEnd(7) + 'Status');
  console.log('─'.repeat(110));

  let passed = 0, warned = 0, failed = 0;
  const failures = [];

  for (let i = 0; i < SITES.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, DELAY));
    const url = SITES[i];
    const name = new URL(url).hostname.replace('www.', '').padEnd(26);

    try {
      const r = await testSite(url);
      const status = r.issues.length > 0 ? '❌' : r.warnings.length > 0 ? '⚠️' : '✅';
      const scoreStr = r.score != null ? (r.score + '').padStart(3) : ' - ';
      console.log(
        `[${(i+1+'').padStart(2)}] ${name}` +
        `${(r.pages || 0) + ''.padEnd(5)}  ` +
        `${(r.jinaWords || 0) + 'w'.padEnd(6)}  ` +
        `${scoreStr}/95  ` +
        `${(r.schemas || 0) + ''.padEnd(5)}   ` +
        `${r.metaDesc ? '✓' : '✗'}     ` +
        `${r.lang ? '✓' : '✗'}     ` +
        `${r.canonical ? '✓' : '✗'}      ` +
        status +
        (r.issues.length > 0 ? ' ' + r.issues.join(' | ') : '')
      );

      if (r.issues.length > 0) { failed++; failures.push({ url, issues: r.issues }); }
      else if (r.warnings.length > 0) warned++;
      else passed++;

    } catch (e) {
      console.log(`[${(i+1+'').padStart(2)}] ${name}💥 CRASH: ${e.message.slice(0, 50)}`);
      failed++;
      failures.push({ url, issues: ['CRASH:' + e.message.slice(0, 40)] });
    }
  }

  console.log('─'.repeat(110));
  console.log(`\nRESULTS: ${passed} ✅  ${warned} ⚠️  ${failed} ❌  (total ${SITES.length})`);

  const categories = { sitemap: [], jina: [], score: [], other: [] };
  failures.forEach(f => {
    const host = new URL(f.url).hostname.replace('www.', '');
    f.issues.forEach(issue => {
      if (issue.startsWith('SITEMAP') || issue.startsWith('PRODUCTS')) categories.sitemap.push(host + ': ' + issue);
      else if (issue.startsWith('JINA')) categories.jina.push(host + ': ' + issue);
      else if (issue.startsWith('SCORE')) categories.score.push(host + ': ' + issue);
      else categories.other.push(host + ': ' + issue);
    });
  });

  console.log('\n── FAILURES BY CATEGORY ──');
  if (categories.sitemap.length) { console.log(`\nSITEMAP (${categories.sitemap.length}):`); categories.sitemap.forEach(s => console.log('  ' + s)); }
  if (categories.jina.length) { console.log(`\nJINA (${categories.jina.length}):`); categories.jina.forEach(s => console.log('  ' + s)); }
  if (categories.score.length) { console.log(`\nSCORING (${categories.score.length}):`); categories.score.forEach(s => console.log('  ' + s)); }
  if (categories.other.length) { console.log(`\nOTHER (${categories.other.length}):`); categories.other.forEach(s => console.log('  ' + s)); }

  const withScores = failures.length === 0 ? [] : undefined; // just for exit code
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
