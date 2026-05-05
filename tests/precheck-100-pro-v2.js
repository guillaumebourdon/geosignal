/**
 * Pre-check Pro ONLY — 100 NEW sites never tested before.
 * 15s between each to respect rate limit.
 *
 * Run: node tests/precheck-100-pro-v2.js
 */

const http = require('http');

const SITES = [
  // ── SaaS / Tech (25) ──
  'https://www.figma.com', 'https://www.canva.com', 'https://www.monday.com',
  'https://www.freshworks.com', 'https://www.zendesk.com', 'https://www.twilio.com',
  'https://www.cloudflare.com', 'https://www.vercel.com', 'https://www.prisma.io',
  'https://www.docker.com', 'https://www.gitlab.com', 'https://www.atlassian.com',
  'https://www.dropbox.com', 'https://www.sketch.com', 'https://www.abstract.com',
  'https://www.basecamp.com', 'https://www.trello.com', 'https://www.asana.com',
  'https://www.clickup.com', 'https://www.toggl.com', 'https://www.harvest.com',
  'https://www.notion.so', 'https://www.coda.io', 'https://www.miro.com',
  'https://www.lucidchart.com',
  // ── E-commerce / Retail (15) ──
  'https://www.asos.com', 'https://www.zalando.fr', 'https://www.decathlon.fr',
  'https://www.ikea.com', 'https://www.zara.com', 'https://www.hm.com',
  'https://www.uniqlo.com', 'https://www.nike.com', 'https://www.adidas.com',
  'https://www.lacoste.com', 'https://www.levis.com', 'https://www.patagonia.com',
  'https://www.allbirds.com', 'https://www.glossier.com', 'https://www.warbyparker.com',
  // ── Finance / Insurance (10) ──
  'https://www.transferwise.com', 'https://www.n26.com', 'https://www.boursorama.com',
  'https://www.fortuneo.fr', 'https://www.luko.eu', 'https://www.wemind.io',
  'https://www.october.eu', 'https://www.younited-credit.com', 'https://www.pretto.fr',
  'https://www.papernest.com',
  // ── Agencies / Services (10) ──
  'https://www.publicissapient.com', 'https://www.accenture.com', 'https://www.capgemini.com',
  'https://www.mckinsey.com', 'https://www.bcg.com', 'https://www.bain.com',
  'https://www.deloitte.com', 'https://www.pwc.com', 'https://www.ey.com',
  'https://www.kpmg.com',
  // ── Media / Content (10) ──
  'https://www.lemonde.fr', 'https://www.lefigaro.fr', 'https://www.liberation.fr',
  'https://www.lesechos.fr', 'https://www.bfmtv.com', 'https://www.france24.com',
  'https://www.reuters.com', 'https://www.bbc.com', 'https://www.cnn.com',
  'https://www.theguardian.com',
  // ── Health / Wellness (5) ──
  'https://www.withings.com', 'https://www.flo.health', 'https://www.headspace.com',
  'https://www.calm.com', 'https://www.noom.com',
  // ── Education (5) ──
  'https://www.coursera.org', 'https://www.udemy.com', 'https://www.skillshare.com',
  'https://www.duolingo.com', 'https://www.kahoot.com',
  // ── Travel / Mobility (5) ──
  'https://www.booking.com', 'https://www.airbnb.com', 'https://www.skyscanner.com',
  'https://www.trainline.com', 'https://www.uber.com',
  // ── Food / Delivery (5) ──
  'https://www.deliveroo.fr', 'https://www.ubereats.com', 'https://www.justeat.fr',
  'https://www.hellofresh.com', 'https://www.toogoodtogo.com',
  // ── Real Estate / Proptech (5) ──
  'https://www.meilleursagents.com', 'https://www.pap.fr', 'https://www.logic-immo.com',
  'https://www.bienici.com', 'https://www.orpi.com',
  // ── Misc (5) ──
  'https://www.spotify.com', 'https://www.twitch.tv', 'https://www.discord.com',
  'https://www.slack.com', 'https://www.zoom.us',
];

const DELAY = 15000;

function preCheck(url) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ url, plan: 'pro' });
    const req = http.request({
      hostname: 'localhost', port: 3099, path: '/api/pre-check', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 30000,
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
  console.log(`\nPre-check PRO — ${SITES.length} new sites — 15s between each\n`);
  console.log('Site'.padEnd(30) + 'Pro OK?'.padEnd(10) + 'Reason'.padEnd(22) + 'Pages');
  console.log('─'.repeat(72));

  let proOk = 0, proBlocked = 0;
  const blocked = [];

  for (let i = 0; i < SITES.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, DELAY));
    const url = SITES[i];
    const host = new URL(url).hostname.replace('www.', '').padEnd(28);

    try {
      const r = await preCheck(url);
      const pro = r.proAuditable === true;
      const reason = r.reason || 'unknown';
      const pages = r.pagesFound != null ? r.pagesFound : '?';

      if (pro) {
        proOk++;
        console.log(`[${(i+1+'').padStart(3)}] ${host}✅        ${reason.padEnd(22)}${pages}`);
      } else {
        proBlocked++;
        blocked.push({ host: host.trim(), reason, pages });
        console.log(`[${(i+1+'').padStart(3)}] ${host}❌        ${reason.padEnd(22)}${pages}`);
      }
    } catch (e) {
      proBlocked++;
      blocked.push({ host: host.trim(), reason: 'crash' });
      console.log(`[${(i+1+'').padStart(3)}] ${host}💥        ${e.message.slice(0, 30)}`);
    }
  }

  console.log('─'.repeat(72));
  console.log(`\nRESULTATS PRO SUR ${SITES.length} SITES:\n`);
  console.log(`  ✅ Pro OK:     ${proOk}/${SITES.length}  (${Math.round(proOk/SITES.length*100)}%)`);
  console.log(`  ❌ Pro bloqué: ${proBlocked}/${SITES.length}  (${Math.round(proBlocked/SITES.length*100)}%)`);

  // Breakdown by reason
  const reasons = {};
  blocked.forEach(b => { reasons[b.reason] = (reasons[b.reason] || 0) + 1; });
  console.log('\n  Raisons des blocages:');
  Object.entries(reasons).sort((a, b) => b[1] - a[1]).forEach(([r, c]) => console.log(`    ${r}: ${c}`));

  if (blocked.length) {
    console.log('\n── SITES BLOQUES ──');
    blocked.forEach(s => console.log(`  ${s.host.padEnd(28)} ${s.reason}  pages=${s.pages || '?'}`));
  }

  process.exit(0);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
