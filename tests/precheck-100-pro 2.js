/**
 * Pre-check simulation — 100 sites, Pro plan only.
 * Tests ONLY if the pre-check would block or allow the site.
 * No AI calls, no Jina, no report generation. Just pre-check.
 *
 * Run: node tests/precheck-100-pro.js
 */

const http = require('http');

const SITES = [
  // ── SaaS FR (20) ──
  'https://www.pennylane.com', 'https://crisp.chat', 'https://www.alan.com',
  'https://www.shine.fr', 'https://www.swile.co', 'https://www.payfit.com',
  'https://www.spendesk.com', 'https://www.aircall.io', 'https://www.livestorm.co',
  'https://www.contentsquare.com', 'https://www.datadog.com', 'https://www.mirakl.com',
  'https://www.didomi.io', 'https://www.ab-tasty.com', 'https://www.sendinblue.com',
  'https://www.front.com', 'https://www.algolia.com', 'https://www.brevo.com',
  'https://www.modjo.ai', 'https://www.folk.app',
  // ── SaaS EN (20) ──
  'https://www.typeform.com', 'https://www.notion.com', 'https://plausible.io',
  'https://cal.com', 'https://linear.app', 'https://pitch.com',
  'https://www.loom.com', 'https://www.webflow.com', 'https://www.airtable.com',
  'https://www.zapier.com', 'https://www.intercom.com', 'https://www.segment.com',
  'https://www.hotjar.com', 'https://www.mixpanel.com', 'https://www.amplitude.com',
  'https://www.calendly.com', 'https://www.krisp.ai', 'https://www.grammarly.com',
  'https://supabase.com', 'https://www.postman.com',
  // ── E-commerce (10) ──
  'https://www.backmarket.fr', 'https://www.vinted.fr', 'https://www.vestiairecollective.com',
  'https://www.sezane.com', 'https://www.asphalte.com', 'https://www.leslipfrancais.fr',
  'https://www.aigle.com', 'https://www.faguo-store.com', 'https://www.balzac-paris.fr',
  'https://www.cabaiaeurope.com',
  // ── Media (10) ──
  'https://www.frenchweb.fr', 'https://www.01net.com', 'https://techcrunch.com',
  'https://www.maddyness.com', 'https://siecledigital.fr', 'https://www.blogdumoderateur.com',
  'https://www.numerama.com', 'https://korben.info', 'https://www.zdnet.fr',
  'https://www.journaldunet.com',
  // ── FinTech (8) ──
  'https://www.qonto.com', 'https://www.wise.com', 'https://www.revolut.com',
  'https://www.lydia-app.com', 'https://www.sumup.com', 'https://stripe.com',
  'https://www.adyen.com', 'https://www.mollie.com',
  // ── HealthTech / EdTech (6) ──
  'https://www.doctolib.fr', 'https://www.qare.fr', 'https://www.maiia.com',
  'https://www.openclassrooms.com', 'https://www.360learning.com', 'https://www.jedha.co',
  // ── AI (8) ──
  'https://www.mistral.ai', 'https://www.huggingface.co', 'https://openai.com',
  'https://anthropic.com', 'https://www.cohere.com', 'https://stability.ai',
  'https://www.jasper.ai', 'https://writesonic.com',
  // ── Agencies / Institutional (6) ──
  'https://www.thefamily.co', 'https://www.numa.co', 'https://www.theodo.fr',
  'https://www.octo.com', 'https://www.ekino.com', 'https://www.ippon.fr',
  // ── Marketplaces (6) ──
  'https://www.malt.fr', 'https://www.welcometothejungle.com', 'https://www.talent.io',
  'https://www.comet.co', 'https://www.brigad.co', 'https://www.side.co',
  // ── Divers (6) ──
  'https://www.ovhcloud.com', 'https://www.deezer.com', 'https://www.blablacar.fr',
  'https://www.leboncoin.fr', 'https://www.veepee.fr', 'https://www.manomano.fr',
];

const DELAY = 15000; // 15s between each (pre-check rate limit: 10 req / 120s)

function preCheck(url) {
  return new Promise((resolve, reject) => {
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
  console.log(`\nPre-check Pro simulation — ${SITES.length} sites\n`);
  console.log('Site'.padEnd(30) + 'One-page'.padEnd(11) + 'Pro'.padEnd(7) + 'Reason'.padEnd(22) + 'Pages');
  console.log('─'.repeat(80));

  let okBoth = 0, okOnePageOnly = 0, blockedAll = 0, errors = 0;
  const blockedSites = [];
  const onePageOnlySites = [];

  for (let i = 0; i < SITES.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, DELAY));
    const url = SITES[i];
    const host = new URL(url).hostname.replace('www.', '').padEnd(28);

    try {
      const r = await preCheck(url);
      const op = r.onePageAuditable === true;
      const pro = r.proAuditable === true;
      const reason = r.reason || 'unknown';
      const pages = r.pagesFound != null ? r.pagesFound : '?';

      let status;
      if (op && pro) { status = '✅'; okBoth++; }
      else if (op && !pro) { status = '⚠️'; okOnePageOnly++; onePageOnlySites.push({ host: host.trim(), reason, pages }); }
      else { status = '❌'; blockedAll++; blockedSites.push({ host: host.trim(), reason }); }

      console.log(`[${(i+1+'').padStart(3)}] ${host}${(op ? '✅' : '❌').padEnd(11)}${(pro ? '✅' : '❌').padEnd(7)}${reason.padEnd(22)}${pages}`);
    } catch (e) {
      console.log(`[${(i+1+'').padStart(3)}] ${host}💥 ${e.message.slice(0, 40)}`);
      errors++;
    }
  }

  console.log('─'.repeat(80));
  console.log(`\nRESULTATS SUR ${SITES.length} SITES:\n`);
  console.log(`  ✅ One-page + Pro OK:    ${okBoth}  (${Math.round(okBoth/SITES.length*100)}%)`);
  console.log(`  ⚠️ One-page OK, Pro KO:  ${okOnePageOnly}  (${Math.round(okOnePageOnly/SITES.length*100)}%)`);
  console.log(`  ❌ Tout bloqué:          ${blockedAll}  (${Math.round(blockedAll/SITES.length*100)}%)`);
  if (errors) console.log(`  💥 Erreurs:              ${errors}`);

  console.log(`\n  → Taux de passage ONE-PAGE: ${okBoth + okOnePageOnly}/${SITES.length} (${Math.round((okBoth + okOnePageOnly)/SITES.length*100)}%)`);
  console.log(`  → Taux de passage PRO:      ${okBoth}/${SITES.length} (${Math.round(okBoth/SITES.length*100)}%)`);

  if (blockedSites.length) {
    console.log('\n── BLOQUES (one-page + pro) ──');
    blockedSites.forEach(s => console.log(`  ${s.host.padEnd(28)} ${s.reason}`));
  }
  if (onePageOnlySites.length) {
    console.log('\n── ONE-PAGE OK, PRO BLOQUE ──');
    onePageOnlySites.forEach(s => console.log(`  ${s.host.padEnd(28)} ${s.reason}  pages=${s.pages}`));
  }

  process.exit(0);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
