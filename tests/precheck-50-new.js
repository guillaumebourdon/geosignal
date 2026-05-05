/**
 * Pre-check Pro — 50 fresh sites never tested before.
 * 20s between each.
 *
 * Run: node tests/precheck-50-new.js
 */

const http = require('http');

const SITES = [
  // ── Agences / Services FR (10) ──
  'https://www.fabernovel.com', 'https://www.backelite.com', 'https://www.artefact.com',
  'https://www.converteo.com', 'https://www.fifty-five.com', 'https://www.keyrus.com',
  'https://www.sqli.com', 'https://www.webqam.fr', 'https://www.netdevices.com',
  'https://www.404.agency',
  // ── E-commerce FR (10) ──
  'https://www.moustache-bikes.com', 'https://www.le-tanneur.com', 'https://www.maison-labiche.com',
  'https://www.sessun.com', 'https://www.ami-paris.com', 'https://www.rouje.com',
  'https://www.balibaris.com', 'https://www.maison-aleph.com', 'https://www.odilleetaudrey.com',
  'https://www.my-jewellery.com',
  // ── SaaS / Tech (10) ──
  'https://www.mangopay.com', 'https://www.payplug.com', 'https://www.iadvize.com',
  'https://www.kameleoon.com', 'https://www.batch.com', 'https://www.toucantocodata.com',
  'https://www.platform.sh', 'https://www.scaleway.com', 'https://www.clever-cloud.com',
  'https://www.passbolt.com',
  // ── PME / Industrie (10) ──
  'https://www.mersen.com', 'https://www.legrand.fr', 'https://www.schneider-electric.fr',
  'https://www.leroy-somer.com', 'https://www.somfy.fr', 'https://www.atlantic.fr',
  'https://www.thermor.fr', 'https://www.rexel.fr', 'https://www.cedeo.fr',
  'https://www.pointp.fr',
  // ── Divers (10) ──
  'https://www.blissim.fr', 'https://www.birchbox.fr', 'https://www.cheerz.com',
  'https://www.photobox.fr', 'https://www.vistaprint.fr', 'https://www.moo.com',
  'https://www.canva.com', 'https://www.kapten.com', 'https://www.heetch.com',
  'https://www.getaround.com',
];

const DELAY = 20000;

function preCheck(url) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ url, plan: 'pro' });
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
  console.log(`\nPre-check PRO — ${SITES.length} new sites\n`);
  console.log('Site'.padEnd(32) + 'Pro?'.padEnd(6) + 'Reason'.padEnd(22) + 'Pages');
  console.log('─'.repeat(72));

  let proOk = 0, proBlocked = 0;
  const blocked = [];

  for (let i = 0; i < SITES.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, DELAY));
    const url = SITES[i];
    let host;
    try { host = new URL(url).hostname.replace('www.', ''); } catch { host = url; }

    try {
      const r = await preCheck(url);
      const pro = r.proAuditable === true;
      const reason = r.reason || 'unknown';
      const pages = r.pagesFound != null ? r.pagesFound : '?';

      if (pro) { proOk++; } else { proBlocked++; blocked.push({ host, reason, pages }); }
      console.log(`[${(i+1+'').padStart(2)}] ${host.padEnd(30)}${(pro ? '✅' : '❌').padEnd(6)}${reason.padEnd(22)}${pages}`);
    } catch (e) {
      proBlocked++;
      blocked.push({ host, reason: 'crash' });
      console.log(`[${(i+1+'').padStart(2)}] ${host.padEnd(30)}💥    ${e.message.slice(0, 30)}`);
    }
  }

  console.log('─'.repeat(72));
  console.log(`\nRESULTATS PRO: ${proOk}/${SITES.length} OK (${Math.round(proOk/SITES.length*100)}%)  —  ${proBlocked} bloqués\n`);

  const reasons = {};
  blocked.forEach(b => { reasons[b.reason] = (reasons[b.reason] || 0) + 1; });
  console.log('Raisons:');
  Object.entries(reasons).sort((a, b) => b[1] - a[1]).forEach(([r, c]) => console.log(`  ${r.padEnd(22)} ${c}`));

  if (blocked.length) {
    console.log('\nBloqués:');
    blocked.forEach(s => console.log(`  ${s.host.padEnd(30)} ${s.reason}  pages=${s.pages || '?'}`));
  }

  process.exit(0);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
