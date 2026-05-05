/**
 * Full pipeline stress test — 100 sites, 30s between each, 0 AI cost.
 * Tests: sitemap, Jina scraping, direct HTML, schema detection, scoring.
 *
 * Run: node tests/stress-test-100.js
 */

const { getTopPrioritizedUrls } = require('../lib/sitemapPrioritizer');
const { scoreExtractibility, scoreVerifiability, scoreAuthority, scoreCrawlability, scoreStructuredData, scoreExternalPresence, scoreFreshness } = require('../lib/scoring');
const axios = require('axios');
const cheerio = require('cheerio');

const SITES = [
  // ── SaaS FR (15) ──
  'https://www.pennylane.com', 'https://crisp.chat', 'https://www.alan.com',
  'https://www.shine.fr', 'https://www.swile.co', 'https://www.payfit.com',
  'https://www.spendesk.com', 'https://www.aircall.io', 'https://www.livestorm.co',
  'https://www.contentsquare.com', 'https://www.datadog.com', 'https://www.mirakl.com',
  'https://www.didomi.io', 'https://www.ab-tasty.com', 'https://www.sendinblue.com',
  // ── SaaS EN (15) ──
  'https://www.typeform.com', 'https://www.notion.com', 'https://plausible.io',
  'https://cal.com', 'https://linear.app', 'https://pitch.com',
  'https://www.loom.com', 'https://www.webflow.com', 'https://www.airtable.com',
  'https://www.zapier.com', 'https://www.intercom.com', 'https://www.segment.com',
  'https://www.hotjar.com', 'https://www.mixpanel.com', 'https://www.amplitude.com',
  // ── E-commerce (10) ──
  'https://www.backmarket.fr', 'https://www.vinted.fr', 'https://www.vestiairecollective.com',
  'https://www.sezane.com', 'https://www.asphalte.com', 'https://www.leslipfrancais.fr',
  'https://www.cabaiaeurope.com', 'https://www.aigle.com', 'https://www.faguo-store.com',
  'https://www.balzac-paris.fr',
  // ── Media / Blog (10) ──
  'https://www.frenchweb.fr', 'https://www.01net.com', 'https://techcrunch.com',
  'https://www.maddyness.com', 'https://siecledigital.fr', 'https://www.blogdumoderateur.com',
  'https://www.usine-digitale.fr', 'https://www.numerama.com', 'https://korben.info',
  'https://www.zdnet.fr',
  // ── FinTech (8) ──
  'https://www.qonto.com', 'https://www.wise.com', 'https://www.revolut.com',
  'https://www.lydia-app.com', 'https://www.sumup.com', 'https://www.stripe.com',
  'https://www.adyen.com', 'https://www.mollie.com',
  // ── HealthTech / EdTech (6) ──
  'https://www.doctolib.fr', 'https://www.qare.fr', 'https://www.maiia.com',
  'https://www.openclassrooms.com', 'https://www.360learning.com', 'https://www.jedha.co',
  // ── AI companies (8) ──
  'https://www.mistral.ai', 'https://www.huggingface.co', 'https://openai.com',
  'https://anthropic.com', 'https://www.cohere.com', 'https://stability.ai',
  'https://www.jasper.ai', 'https://writesonic.com',
  // ── Institutional / Agencies (8) ──
  'https://www.thefamily.co', 'https://www.numa.co', 'https://www.theodo.fr',
  'https://www.octo.com', 'https://www.ekino.com', 'https://www.arolla.fr',
  'https://www.xebia.fr', 'https://www.ippon.fr',
  // ── Marketplaces (6) ──
  'https://www.malt.fr', 'https://www.welcometothejungle.com', 'https://www.talent.io',
  'https://www.comet.co', 'https://www.brigad.co', 'https://www.side.co',
  // ── Divers FR (8) ──
  'https://www.ovhcloud.com', 'https://www.deezer.com', 'https://www.blablacar.fr',
  'https://www.leboncoin.fr', 'https://www.veepee.fr', 'https://www.manomano.fr',
  'https://www.meilleuragents.com', 'https://www.seloger.com',
  // ── Small / niche (6) ──
  'https://www.lemlist.com', 'https://www.phantombuster.com', 'https://www.waalaxy.com',
  'https://www.modjo.ai', 'https://www.folk.app', 'https://www.surfe.com',
];

const UA = 'Mozilla/5.0 (compatible; DetekiaBot/1.0; +https://detekia.fr)';
const DELAY = 30000; // 30s between each site

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
    // Schemas
    const schemas = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try { const d = JSON.parse($(el).html()); const e = o => { if (o?.['@type']) schemas.push(o['@type']); if (Array.isArray(o?.['@graph'])) o['@graph'].forEach(e); }; e(d); } catch {}
    });
    result.schemas = [...new Set(schemas)].length;
    result.metaDesc = !!($('meta[name="description"]').attr('content'));
    result.lang = !!$('html').attr('lang');
    result.canonical = $('link[rel="canonical"]').length > 0;

    // Scoring (if jina worked)
    if (typeof jina === 'string') {
      try {
        const $j = cheerio.load(jina);
        $('script[type="application/ld+json"]').each((_, el) => { const c = $(el).html(); if (c) $j('body').append(`<script type="application/ld+json">${c}</script>`); });
        const text = $j('body').text().replace(/\s+/g, ' ').trim();
        const hostname = new URL(url).hostname;
        const scores = {
          ext: scoreExtractibility($j, text, jina).score,
          ver: scoreVerifiability($j, text, jina, hostname).score,
          auth: scoreAuthority($j, jina, 'fr', html).score,
          crawl: scoreCrawlability($j, jina, 'fr', html).score,
          struct: scoreStructuredData($j, jina).score,
          pres: scoreExternalPresence($j, jina, 'fr', {}).score,
          fresh: scoreFreshness($j, jina).score,
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
  console.log(`STRESS TEST — ${SITES.length} sites — 30s between each — estimated ${Math.round(SITES.length * 30 / 60)} min`);
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
        `[${(i+1+'').padStart(3)}] ${name}` +
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
      console.log(`[${(i+1+'').padStart(3)}] ${name}💥 CRASH: ${e.message.slice(0, 50)}`);
      failed++;
      failures.push({ url, issues: ['CRASH:' + e.message.slice(0, 40)] });
    }
  }

  console.log('─'.repeat(110));
  console.log(`\nRESULTS: ${passed} ✅  ${warned} ⚠️  ${failed} ❌  (total ${SITES.length})`);

  // Categorize failures
  const categories = { sitemap: [], jina: [], score: [], content: [] };
  failures.forEach(f => {
    const host = new URL(f.url).hostname.replace('www.', '');
    f.issues.forEach(issue => {
      if (issue.startsWith('SITEMAP') || issue.startsWith('PRODUCTS')) categories.sitemap.push(host + ': ' + issue);
      else if (issue.startsWith('JINA')) categories.jina.push(host + ': ' + issue);
      else if (issue.startsWith('SCORE')) categories.score.push(host + ': ' + issue);
      else categories.content.push(host + ': ' + issue);
    });
  });

  console.log('\n── FAILURES BY CATEGORY ──');
  if (categories.sitemap.length) { console.log(`\nSITEMAP (${categories.sitemap.length}):`); categories.sitemap.forEach(s => console.log('  ' + s)); }
  if (categories.jina.length) { console.log(`\nJINA SCRAPING (${categories.jina.length}):`); categories.jina.forEach(s => console.log('  ' + s)); }
  if (categories.score.length) { console.log(`\nSCORING (${categories.score.length}):`); categories.score.forEach(s => console.log('  ' + s)); }
  if (categories.content.length) { console.log(`\nOTHER (${categories.content.length}):`); categories.content.forEach(s => console.log('  ' + s)); }

  console.log('\n── ACTIONABLE FIXES ──');
  const sitemapOnly = failures.filter(f => f.issues.every(i => i.startsWith('SITEMAP')));
  const jinaOnly = failures.filter(f => f.issues.every(i => i.startsWith('JINA')));
  const antiBot = failures.filter(f => f.issues.some(i => i.includes('SHORT') || i.includes('403') || i.includes('FAIL')));
  console.log(`Sites with ONLY sitemap issues (fixable): ${sitemapOnly.length}`);
  console.log(`Sites with ONLY Jina issues (rate limit in test): ${jinaOnly.length}`);
  console.log(`Sites with anti-bot (not fixable, should be blocked by pre-check): ${antiBot.length}`);

  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
