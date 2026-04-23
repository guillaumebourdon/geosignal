const { getTopPrioritizedUrls } = require('../lib/sitemapPrioritizer');

const SITES = [
  'https://culinair.fr',
  'https://detekia.fr',
  'https://vercel.com',
  'https://www.stripe.com',
];

function pad(str, len) { return String(str).padEnd(len); }
function padN(n, len) { return String(n).padStart(len); }

async function testSite(rootUrl) {
  console.log('\n' + '═'.repeat(80));
  console.log(`  ${rootUrl}`);
  console.log('═'.repeat(80));

  try {
    const results = await getTopPrioritizedUrls(rootUrl, { maxUrls: 20, timeoutMs: 10000 });

    if (results.length === 1 && results[0].reasons.fallback) {
      console.log(`  ⚠  Fallback: ${results[0].reasons.fallback}`);
      console.log(`  →  ${results[0].url} (score: ${results[0].score})`);
      return;
    }

    console.log(`  URLs in sitemap (after filter): scored up to 500`);
    console.log(`  Selected: ${results.length}\n`);

    console.log(
      `  ${pad('#', 3)} ${pad('Score', 6)} ${pad('Fresh', 6)} ${pad('Depth', 6)} ${pad('Seman', 6)} ${pad('Prior', 6)} ${pad('Strat', 6)} URL`
    );
    console.log('  ' + '-'.repeat(90));

    results.forEach((r, i) => {
      const rs = r.reasons;
      console.log(
        `  ${pad(i + 1, 3)} ${padN(r.score, 5)}  ${padN(rs.freshness ?? '-', 5)}  ${padN(rs.depth ?? '-', 5)}  ${padN(rs.semantic ?? '-', 5)}  ${padN(rs.priority ?? '-', 5)}  ${padN(rs.strategicBonus ?? '-', 5)}  ${r.url}${rs.forced ? ' ★' : ''}`
      );
    });
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
  }
}

async function main() {
  console.log('Detekia Pro — Sitemap Prioritizer Test');
  console.log(`Date: ${new Date().toISOString()}`);

  for (const site of SITES) {
    await testSite(site);
  }

  console.log('\n' + '═'.repeat(80));
  console.log('  Done.');
  console.log('═'.repeat(80) + '\n');
}

main();
