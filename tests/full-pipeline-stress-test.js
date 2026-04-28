/**
 * Full pipeline stress test — 50 sites, 0 API cost.
 * Tests: sitemap, scraping (Jina + direct HTML), schema detection,
 * meta desc, social links, trust pages, content length, scoring.
 *
 * Run: node tests/full-pipeline-stress-test.js
 */

const { getTopPrioritizedUrls } = require('../lib/sitemapPrioritizer');
const { scoreExtractibility, scoreVerifiability, scoreAuthority, scoreCrawlability, scoreStructuredData, scoreExternalPresence, scoreFreshness } = require('../lib/scoring');
const axios = require('axios');
const cheerio = require('cheerio');

const SITES = [
  // SaaS FR
  'https://www.pennylane.com', 'https://crisp.chat', 'https://www.alan.com',
  'https://www.shine.fr', 'https://www.malt.fr', 'https://www.swile.co',
  'https://www.payfit.com', 'https://www.spendesk.com', 'https://www.front.com',
  'https://www.aircall.io',
  // SaaS EN
  'https://www.typeform.com', 'https://www.notion.com', 'https://plausible.io',
  'https://cal.com', 'https://linear.app', 'https://pitch.com',
  'https://www.loom.com', 'https://www.figma.com', 'https://www.canva.com',
  'https://www.webflow.com',
  // E-commerce
  'https://www.backmarket.fr', 'https://www.vinted.fr', 'https://www.leboncoin.fr',
  'https://www.cdiscount.com', 'https://www.fnac.com',
  // Media / Blog
  'https://www.frenchweb.fr', 'https://www.01net.com', 'https://www.journaldunet.com',
  'https://techcrunch.com', 'https://www.theverge.com',
  // HealthTech
  'https://www.doctolib.fr', 'https://www.qare.fr',
  // FinTech
  'https://www.qonto.com', 'https://www.revolut.com', 'https://www.wise.com',
  // AI
  'https://www.mistral.ai', 'https://www.huggingface.co', 'https://openai.com',
  'https://anthropic.com', 'https://www.cohere.com',
  // Divers FR
  'https://www.ovhcloud.com', 'https://www.blablacar.fr', 'https://www.manomano.fr',
  'https://www.veepee.fr', 'https://www.deezer.com',
  // Sites institutionnels / agences
  'https://www.thefamily.co', 'https://www.station-f.co', 'https://www.numa.co',
  // Edge cases potentiels
  'https://www.algolia.com', 'https://stripe.com', 'https://www.brevo.com',
];

const UA = 'Mozilla/5.0 (compatible; DetekiaBot/1.0; +https://detekia.fr)';
const JINA_KEY = process.env.JINA_API_KEY;

async function fetchJinaLight(url) {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const headers = { Accept: 'text/html' };
  if (JINA_KEY) headers.Authorization = `Bearer ${JINA_KEY}`;
  const { data } = await axios.get(jinaUrl, { headers, timeout: 15000 });
  return data;
}

async function fetchDirect(url) {
  const { data } = await axios.get(url, { timeout: 10000, maxRedirects: 5, headers: { 'User-Agent': UA } });
  return data;
}

async function testSite(url) {
  const result = { url, issues: [], warnings: [], ok: true };
  const name = new URL(url).hostname.replace('www.', '');

  // 1. SITEMAP
  try {
    const pages = await getTopPrioritizedUrls(url, { maxUrls: 20 });
    result.sitemapPages = pages.length;
    const products = pages.filter(p => {
      try { const path = new URL(p.url).pathname; return /\/p\//.test(path) || /[0-9a-f]{8}-[0-9a-f]{4}/.test(path); } catch { return false; }
    }).length;
    result.productPages = products;
    if (pages.length < 5) result.issues.push(`SITEMAP: seulement ${pages.length} pages`);
    if (products > 5) result.issues.push(`SITEMAP: ${products} pages produit (devrait etre max 3)`);
  } catch (e) {
    result.issues.push(`SITEMAP CRASH: ${e.message.slice(0, 60)}`);
  }

  // 2. DIRECT HTML FETCH
  let directHtml = null;
  try {
    directHtml = await fetchDirect(url);
    result.directHtmlOk = true;
    result.directHtmlSize = directHtml.length;
  } catch (e) {
    result.directHtmlOk = false;
    result.warnings.push(`DIRECT HTML FAIL: ${e.message.slice(0, 40)}`);
  }

  // 3. JINA FETCH
  let jinaContent = null;
  try {
    jinaContent = await fetchJinaLight(url);
    result.jinaOk = true;
    result.jinaSize = jinaContent.length;
    const $ = cheerio.load(jinaContent);
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    result.jinaWordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    if (result.jinaWordCount < 100) result.issues.push(`JINA: seulement ${result.jinaWordCount} mots (seuil: 100)`);
  } catch (e) {
    result.jinaOk = false;
    result.issues.push(`JINA FAIL: ${e.message.slice(0, 40)}`);
  }

  // 4. SCHEMAS (from direct HTML)
  if (directHtml) {
    const $ = cheerio.load(directHtml);
    const schemas = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const d = JSON.parse($(el).html());
        const extract = o => { if (o?.['@type']) schemas.push(o['@type']); if (Array.isArray(o?.['@graph'])) o['@graph'].forEach(extract); };
        extract(d);
      } catch {}
    });
    result.schemas = [...new Set(schemas)];

    // 5. META DESC
    result.metaDesc = $('meta[name="description"]').attr('content') || '';
    if (!result.metaDesc) result.warnings.push('META DESC: absente dans HTML direct');

    // 6. SOCIAL LINKS
    const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'youtube.com'];
    const socialExclude = ['analytics.twitter', 'platform.twitter', 'adsct', 'connect.facebook'];
    const socialLinks = [];
    $('a[href]').each((_, el) => {
      const h = ($(el).attr('href') || '').trim();
      if (h.startsWith('http') && socialDomains.some(d => h.includes(d)) && !socialExclude.some(e => h.includes(e)) && !socialLinks.includes(h))
        socialLinks.push(h);
    });
    result.socialLinks = socialLinks.length;

    // 7. TRUST PAGES
    const allLinks = [];
    $('a[href]').each((_, el) => allLinks.push(($(el).attr('href') || '').toLowerCase()));
    result.hasContact = allLinks.some(l => l.includes('/contact') || l.includes('mailto:'));
    result.hasAbout = allLinks.some(l => l.includes('/about') || l.includes('/a-propos') || l.includes('/qui-sommes'));
    result.hasLegal = allLinks.some(l => l.includes('/legal') || l.includes('/mention') || l.includes('/cgu') || l.includes('/terms') || l.includes('/privacy'));
    result.hasLang = !!$('html').attr('lang');
    result.hasCanonical = $('link[rel="canonical"]').length > 0;

    // 8. SCORING (on Jina content enriched with direct HTML schemas)
    if (jinaContent) {
      const $jina = cheerio.load(jinaContent);
      // Inject schemas
      $('script[type="application/ld+json"]').each((_, el) => {
        const content = $(el).html();
        if (content) $jina('body').append(`<script type="application/ld+json">${content}</script>`);
      });
      const text = $jina('body').text().replace(/\s+/g, ' ').trim();

      try {
        const scores = {
          extractibility: scoreExtractibility($jina, text, jinaContent),
          verifiability: scoreVerifiability($jina, text, jinaContent, new URL(url).hostname),
          authority: scoreAuthority($jina, jinaContent, 'fr', directHtml),
          crawlability: scoreCrawlability($jina, jinaContent, 'fr', directHtml),
          structuredData: scoreStructuredData($jina, jinaContent),
          externalPresence: scoreExternalPresence($jina, jinaContent, 'fr', { socialLinks }),
          freshness: scoreFreshness($jina, jinaContent),
        };
        const total = Object.values(scores).reduce((s, c) => s + c.score, 0);
        result.score = total;
        result.scoreBreakdown = {};
        for (const [k, v] of Object.entries(scores)) result.scoreBreakdown[k] = v.score + '/' + v.max;

        if (total < 20) result.issues.push(`SCORE ANORMAL: ${total}/95 (trop bas, scraping probablement defaillant)`);
        if (scores.structuredData.score === 0 && result.schemas.length > 0) {
          result.issues.push(`SCHEMA MISMATCH: ${result.schemas.length} schemas dans HTML direct mais score 0/10`);
        }
        if (scores.authority.score <= 2 && (result.hasContact || result.hasAbout || result.hasLegal)) {
          result.issues.push(`AUTORITE MISMATCH: trust pages existent mais score ${scores.authority.score}/15`);
        }
      } catch (e) {
        result.issues.push(`SCORING CRASH: ${e.message.slice(0, 60)}`);
      }
    }
  }

  result.ok = result.issues.length === 0;
  return result;
}

async function run() {
  console.log(`\nFull Pipeline Stress Test — ${SITES.length} sites\n`);
  console.log('='.repeat(100));

  let passed = 0, failed = 0, warned = 0;
  const failures = [];
  const allResults = [];

  for (let i = 0; i < SITES.length; i++) {
    const url = SITES[i];
    const name = new URL(url).hostname.replace('www.', '').padEnd(22);
    process.stdout.write(`[${(i + 1 + '').padStart(2)}/${SITES.length}] ${name}`);

    try {
      const r = await testSite(url);
      allResults.push(r);
      const status = r.issues.length > 0 ? '❌' : r.warnings.length > 0 ? '⚠️' : '✅';
      const scoreStr = r.score != null ? (r.score + '').padStart(3) + '/95' : '  N/A';
      console.log(` ${status} pages=${(r.sitemapPages || '?') + ''.padEnd(3)} score=${scoreStr} jina=${r.jinaOk ? r.jinaWordCount + 'w' : 'FAIL'} schemas=${(r.schemas || []).length} social=${r.socialLinks || 0}`);

      if (r.issues.length > 0) {
        r.issues.forEach(i => console.log(`     ❌ ${i}`));
        failed++;
        failures.push(r);
      } else if (r.warnings.length > 0) {
        r.warnings.forEach(w => console.log(`     ⚠️ ${w}`));
        warned++;
      } else {
        passed++;
      }
    } catch (e) {
      console.log(` 💥 CRASH: ${e.message.slice(0, 60)}`);
      failed++;
      failures.push({ url, issues: ['CRASH: ' + e.message] });
    }
  }

  console.log('\n' + '='.repeat(100));
  console.log(`\nResults: ${passed} ✅  ${warned} ⚠️  ${failed} ❌  (total ${SITES.length})`);

  if (failures.length > 0) {
    console.log('\n❌ FAILURES:');
    failures.forEach(f => {
      console.log(`  ${new URL(f.url).hostname}:`);
      f.issues.forEach(i => console.log(`    - ${i}`));
    });
  }

  // Summary stats
  const withScores = allResults.filter(r => r.score != null);
  if (withScores.length > 0) {
    const scores = withScores.map(r => r.score);
    console.log(`\nScore distribution (${withScores.length} sites):`);
    console.log(`  Min: ${Math.min(...scores)}, Max: ${Math.max(...scores)}, Avg: ${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}`);
    console.log(`  <30: ${scores.filter(s => s < 30).length}, 30-50: ${scores.filter(s => s >= 30 && s < 50).length}, 50-70: ${scores.filter(s => s >= 50 && s < 70).length}, 70+: ${scores.filter(s => s >= 70).length}`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
