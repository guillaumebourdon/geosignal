/**
 * Sitemap stress test — validates that the sitemapPrioritizer finds
 * 10+ pages on a diverse panel of real sites, without any AI API calls.
 *
 * Run: node tests/sitemap-stress-test.js
 * Cost: $0 (only HTTP fetches to sitemaps and homepages)
 */

const { getTopPrioritizedUrls } = require('../lib/sitemapPrioritizer');

const SITES = [
  // Multilingue FR (prefix /fr/)
  { url: 'https://www.pennylane.com', name: 'pennylane', expect: 10, note: 'multilingue /fr/' },
  { url: 'https://crisp.chat', name: 'crisp', expect: 10, note: 'sitemapindex multilingue' },
  { url: 'https://www.alan.com', name: 'alan', expect: 10, note: 'multilingue' },

  // www → non-www redirect
  { url: 'https://www.livestorm.co', name: 'livestorm', expect: 10, note: 'www → non-www' },
  { url: 'https://www.qonto.com', name: 'qonto', expect: 5, note: 'sitemap .gz only' },

  // E-commerce (beaucoup de produits)
  { url: 'https://www.backmarket.fr', name: 'backmarket', expect: 10, note: 'e-commerce, max 3 produits' },

  // SaaS standard
  { url: 'https://www.typeform.com', name: 'typeform', expect: 15, note: 'sitemap standard' },
  { url: 'https://plausible.io', name: 'plausible', expect: 15, note: 'sitemap standard' },
  { url: 'https://cal.com', name: 'calcom', expect: 15, note: 'sitemap standard' },
  { url: 'https://www.brevo.com', name: 'brevo', expect: 15, note: 'sitemap standard' },
  { url: 'https://www.algolia.com', name: 'algolia', expect: 15, note: 'sitemap standard' },
  { url: 'https://www.notion.com', name: 'notion', expect: 10, note: 'multilingue' },
  { url: 'https://www.mistral.ai', name: 'mistral', expect: 10, note: 'AI startup' },
  { url: 'https://pitch.com', name: 'pitch', expect: 10, note: 'SaaS presentations' },
  { url: 'https://linear.app', name: 'linear', expect: 5, note: 'SaaS minimaliste' },

  // Médias / blogs
  { url: 'https://www.frenchweb.fr', name: 'frenchweb', expect: 10, note: 'media tech' },

  // Sites FR divers
  { url: 'https://www.shine.fr', name: 'shine', expect: 10, note: 'neobanque' },
  { url: 'https://www.malt.fr', name: 'malt', expect: 5, note: 'marketplace freelance' },
  { url: 'https://stripe.com', name: 'stripe', expect: 15, note: 'reference tech' },
  { url: 'https://www.doctolib.fr', name: 'doctolib', expect: 10, note: 'healthtech' },
];

async function run() {
  console.log(`\nSitemap Stress Test — ${SITES.length} sites\n`);
  console.log('Site'.padEnd(16) + 'Pages'.padEnd(8) + 'Expect'.padEnd(9) + 'Status'.padEnd(8) + 'Products'.padEnd(10) + 'Source'.padEnd(12) + 'Note');
  console.log('─'.repeat(90));

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const site of SITES) {
    try {
      const results = await getTopPrioritizedUrls(site.url, { maxUrls: 20 });
      const count = results.length;
      const products = results.filter(r => {
        try {
          const path = new URL(r.url).pathname;
          return /\/p\//.test(path) || /[0-9a-f]{8}-[0-9a-f]{4}/.test(path);
        } catch { return false; }
      }).length;
      const source = results[1]?.reasons?.source || results[0]?.reasons?.source || '?';
      const ok = count >= site.expect;

      console.log(
        site.name.padEnd(16) +
        (count + '').padEnd(8) +
        ('>=' + site.expect).padEnd(9) +
        (ok ? '✅' : '❌').padEnd(8) +
        (products + ' prod').padEnd(10) +
        source.padEnd(12) +
        site.note
      );

      if (ok) passed++;
      else { failed++; failures.push({ ...site, found: count, products }); }

    } catch (e) {
      console.log(site.name.padEnd(16) + 'ERR'.padEnd(8) + ('>=' + site.expect).padEnd(9) + '❌'.padEnd(8) + ''.padEnd(10) + ''.padEnd(12) + e.message.slice(0, 40));
      failed++;
      failures.push({ ...site, found: 0, error: e.message });
    }
  }

  console.log('─'.repeat(90));
  console.log(`\nResults: ${passed}/${SITES.length} passed, ${failed} failed\n`);

  if (failures.length > 0) {
    console.log('FAILURES:');
    failures.forEach(f => console.log(`  ❌ ${f.name}: found ${f.found || 0} pages (expected >=${f.expect}) — ${f.note}${f.error ? ' — ' + f.error : ''}`));
    console.log('');
  }

  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
