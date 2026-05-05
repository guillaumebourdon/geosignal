/**
 * Pre-check One-page — 50 fresh sites never tested before.
 * 20s between each.
 *
 * Run: node tests/precheck-50-onepage.js
 */

const http = require('http');

const SITES = [
  // ── Agences / Services FR (10) ──
  'https://www.niji.fr', 'https://www.altima.fr', 'https://www.uptilab.com',
  'https://www.webedia.fr', 'https://www.teads.com', 'https://www.criteo.com',
  'https://www.akeneo.com', 'https://www.qualifio.com', 'https://www.sendinblue.com',
  'https://www.talend.com',
  // ── E-commerce FR (10) ──
  'https://www.boulanger.com', 'https://www.darty.com', 'https://www.cultura.com',
  'https://www.devialet.com', 'https://www.sonos.com', 'https://www.cowboy.com',
  'https://www.material.com', 'https://www.morphe.com', 'https://www.wethenew.com',
  'https://www.courir.com',
  // ── SaaS / Tech (10) ──
  'https://www.docusign.com', 'https://www.notion.so', 'https://www.1password.com',
  'https://www.linear.app', 'https://www.retool.com', 'https://www.sanity.io',
  'https://www.contentful.com', 'https://www.algolia.com', 'https://www.twilio.com',
  'https://www.auth0.com',
  // ── PME / Divers (10) ──
  'https://www.maif.fr', 'https://www.macif.fr', 'https://www.matmut.fr',
  'https://www.harmonie-mutuelle.fr', 'https://www.groupama.fr', 'https://www.ag2rlamondiale.fr',
  'https://www.generali.fr', 'https://www.axa.fr', 'https://www.allianz.fr',
  'https://www.swisslife.fr',
  // ── Blogs / Médias (10) ──
  'https://www.leparisien.fr', 'https://www.20minutes.fr', 'https://www.ouest-france.fr',
  'https://www.sudouest.fr', 'https://www.lavoixdunord.fr', 'https://www.ladepeche.fr',
  'https://www.midilibre.fr', 'https://www.leprogres.fr', 'https://www.estrepublicain.fr',
  'https://www.dna.fr',
];

const DELAY = 20000;

function preCheck(url) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ url, plan: 'rapport' });
    const req = http.request({
      hostname: 'localhost', port: 3099, path: '/api/pre-check', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 40000,
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString())); } catch { resolve({ error: 'parse' }); } });
    });
    req.on('error', () => resolve({ error: 'network' }));
    req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout' }); });
    req.write(body);
    req.end();
  });
}

async function run() {
  console.log(`\nPre-check ONE-PAGE — ${SITES.length} new sites\n`);
  console.log('Site'.padEnd(32) + 'OK?'.padEnd(6) + 'Reason'.padEnd(22) + 'Pages');
  console.log('─'.repeat(72));

  let ok = 0, blocked = 0;
  const blockedList = [];

  for (let i = 0; i < SITES.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, DELAY));
    const url = SITES[i];
    let host;
    try { host = new URL(url).hostname.replace('www.', ''); } catch { host = url; }

    try {
      const r = await preCheck(url);
      const pass = r.onePageAuditable === true;
      const reason = r.reason || 'unknown';
      const pages = r.pagesFound != null ? r.pagesFound : '?';

      if (pass) { ok++; } else { blocked++; blockedList.push({ host, reason, pages }); }
      console.log(`[${(i+1+'').padStart(2)}] ${host.padEnd(30)}${(pass ? '✅' : '❌').padEnd(6)}${reason.padEnd(22)}${pages}`);
    } catch (e) {
      blocked++;
      blockedList.push({ host, reason: 'crash' });
      console.log(`[${(i+1+'').padStart(2)}] ${host.padEnd(30)}💥    ${e.message.slice(0, 30)}`);
    }
  }

  console.log('─'.repeat(72));
  console.log(`\nRESULTATS ONE-PAGE: ${ok}/${SITES.length} OK (${Math.round(ok/SITES.length*100)}%)  —  ${blocked} bloqués\n`);

  const reasons = {};
  blockedList.forEach(b => { reasons[b.reason] = (reasons[b.reason] || 0) + 1; });
  console.log('Raisons:');
  Object.entries(reasons).sort((a, b) => b[1] - a[1]).forEach(([r, c]) => console.log(`  ${r.padEnd(22)} ${c}`));

  if (blockedList.length) {
    console.log('\nBloqués:');
    blockedList.forEach(s => console.log(`  ${s.host.padEnd(30)} ${s.reason}`));
  }

  process.exit(0);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
