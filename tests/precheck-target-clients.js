/**
 * Pre-check Pro — 210 target client sites (agencies, e-commerce, media, PME, coaches).
 * 15s between each to respect rate limit.
 *
 * Run: node tests/precheck-target-clients.js
 */

const http = require('http');

const SITES = [
  // ── 1. PETITES AGENCES SEO (50) ──
  'https://www.korleonbiz.com', 'https://www.wedig.fr', 'https://www.optimum-concept.com',
  'https://www.brioude-internet.fr', 'https://www.netoffensive.fr', 'https://www.seomix.fr',
  'https://www.web4-group.com', 'https://www.empirik.fr', 'https://www.tpm-conseil.fr',
  'https://www.search-foresight.com', 'https://www.resoneo.com', 'https://www.optimize360.fr',
  'https://www.webloom.fr', 'https://www.open-linking.com', 'https://www.lemon-interactive.fr',
  'https://www.adimeo.com', 'https://www.adveris.fr', 'https://www.digitaweb.com',
  'https://www.disko.fr', 'https://www.yumens.fr', 'https://www.insign.fr',
  'https://www.netbooster.com', 'https://www.jvweb.fr', 'https://www.esokia.com',
  'https://www.woptimo.com', 'https://www.sigmaweb.fr', 'https://www.ads-up.fr',
  'https://www.synodiance.com', 'https://www.jalis.fr', 'https://korben.info',
  'https://www.arobasenet.com', 'https://www.eskimoz.fr', 'https://www.seocamp.org',
  'https://www.primelis.com', 'https://www.keyweo.com', 'https://www.seoh.fr',
  'https://www.rocket4.fr', 'https://www.pumpup.fr', 'https://www.reflet-digital.com',
  'https://www.linkeo.com', 'https://www.twaino.com', 'https://www.smartkeyword.io',
  'https://www.junto.fr', 'https://www.pure-illusion.com', 'https://www.agence-wam.fr',
  'https://www.soledis.com', 'https://www.bee4.fr', 'https://www.kampn.com',
  'https://www.tactee.fr', 'https://www.agence-ska.com',
  // ── 2. E-COMMERCANTS (50) ──
  'https://www.sezane.com', 'https://www.leslipfrancais.fr', 'https://www.aigle.com',
  'https://www.polene-paris.com', 'https://www.maisonstandards.com', 'https://www.typology.com',
  'https://www.respire.co', 'https://www.bfrenchbody.com', 'https://www.tediber.com',
  'https://www.quitoque.fr', 'https://www.cuisinella.com', 'https://www.asphalte.com',
  'https://www.lfrm.com', 'https://www.hopaal.com', 'https://www.1083.fr',
  'https://www.lepetitlunetier.com', 'https://www.jimmyfairly.com', 'https://www.faguo-store.com',
  'https://www.bobbies.com', 'https://www.vfranceveja.com', 'https://www.natandnin.com',
  'https://www.maisonkitsune.com', 'https://www.sandro-paris.com', 'https://www.maje.com',
  'https://www.ba-sh.com', 'https://www.claudiepierlot.com', 'https://www.petit-bateau.fr',
  'https://www.caudalie.com', 'https://www.nuxe.com', 'https://www.embryolisse.com',
  'https://www.garancia-beauty.com', 'https://www.lashile-beauty.com', 'https://www.larosee-cosmetiques.com',
  'https://www.aroma-zone.com', 'https://www.ohmycream.com', 'https://www.nocibe.fr',
  'https://www.smallable.com', 'https://www.cyrillus.fr', 'https://www.bfrenchbonton.com',
  'https://www.jacadi.fr', 'https://www.dpam.com', 'https://www.natureetdecouvertes.com',
  'https://www.botanic.com', 'https://www.cdiscount.com', 'https://www.laredoute.fr',
  'https://www.bfrenchbonsoirs.com', 'https://www.tikamoon.com', 'https://www.madeindesign.com',
  'https://www.respire.co', 'https://www.enviedefraise.com',
  // ── 3. BLOGS / MEDIAS (30) ──
  'https://korben.info', 'https://www.presse-citron.net', 'https://www.numerama.com',
  'https://www.frandroid.com', 'https://www.lesnumeriques.com', 'https://www.01net.com',
  'https://www.tomsguide.fr', 'https://www.generation-nt.com', 'https://www.jeuxvideo.com',
  'https://www.madmoizelle.com', 'https://www.topito.com', 'https://www.konbini.com',
  'https://www.maddyness.com', 'https://www.frenchweb.fr', 'https://www.journaldunet.com',
  'https://www.blogdumoderateur.com', 'https://www.abondance.com', 'https://www.webrankinfo.com',
  'https://www.marmiton.org', 'https://www.750g.com', 'https://www.cuisineaz.com',
  'https://www.doctissimo.fr', 'https://www.aufeminin.com', 'https://www.marieclaire.fr',
  'https://www.cafeduweb.com', 'https://www.journaldelamaison.com',
  'https://www.monjardinetmamaison.fr', 'https://www.lafourche.fr',
  'https://www.loopsider.com', 'https://www.brut.media',
  // ── 4. PME (50) ──
  'https://www.manutan.fr', 'https://www.bonduelle.fr', 'https://www.yves-rocher.fr',
  'https://www.petit-bateau.fr', 'https://www.natureetdecouvertes.com', 'https://www.bricoman.fr',
  'https://www.kiloutou.fr', 'https://www.loxam.fr', 'https://www.norauto.fr',
  'https://www.speedy.fr', 'https://www.optical-center.fr', 'https://www.krys.com',
  'https://www.atol.fr', 'https://www.lahalle.com', 'https://www.etam.com',
  'https://www.gemo.fr', 'https://www.kiabi.com', 'https://www.jules.com',
  'https://www.bfrenchbrice.com', 'https://www.kookai.fr', 'https://www.pauleka.com',
  'https://www.comptoirdescotonniers.com', 'https://www.ikks.com', 'https://www.cotelac.fr',
  'https://www.sfrenchuncoo.com', 'https://www.americanvintage-store.com',
  'https://www.vanessabruno.com', 'https://www.thekooples.com',
  'https://www.zafrenchdig-et-voltaire.com', 'https://www.repetto.com',
  'https://www.jonak.fr', 'https://www.minelli.fr', 'https://www.edenpark.com',
  'https://www.faconnable.com', 'https://www.saint-james.com', 'https://www.armorlux.com',
  'https://www.maison-berger.com', 'https://www.diptyqueparis.com',
  'https://www.annickgoutal.com', 'https://www.frfrenchagonard.com',
  'https://www.guerlain.com', 'https://www.lancome.fr',
  'https://www.yslbeauty.fr', 'https://www.edenparkfr.com',
  'https://www.saintjames.com', 'https://www.armorlux.fr',
  'https://www.maison-berger-paris.com', 'https://www.diptyqueparis.fr',
  'https://www.frfrenchagonard-parfumeur.com', 'https://www.caron-paris.com',
  // ── 5. COACHS / CONSULTANTS / FORMATEURS (30) ──
  'https://www.livementor.com', 'https://www.openclassrooms.com', 'https://www.lewagon.com',
  'https://www.thehackingproject.org', 'https://www.ironhack.com', 'https://www.simplon.co',
  'https://www.coachacademie.com', 'https://www.linkup-coaching.com',
  'https://www.academie-du-coaching.com', 'https://www.international-mozaik.com',
  'https://www.coaching-ways.com', 'https://www.coachs-associes.com',
  'https://www.olivier-roland.com', 'https://www.yourtopia.fr',
  'https://www.visionary-marketing.com', 'https://www.marketingmania.fr',
  'https://www.systeme.io', 'https://www.blogueur-pro.net',
  'https://www.webmarketing-conseil.fr', 'https://www.conseilsmarketing.com',
  'https://www.daniloduchesnes.com', 'https://www.selfrenchastien-night.com',
  'https://www.formation-creation-entreprise.com', 'https://www.yourcharlie.com',
  'https://www.livementor.com', 'https://www.lecoindesentrepreneurs.fr',
  'https://www.petite-entreprise.net', 'https://www.creer-mon-business-plan.fr',
  'https://www.macreationdentreprise.fr', 'https://www.bfrenchusinessbro.fr',
];

const DELAY = 20000;

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
  const categories = {
    'Agences SEO': { start: 0, end: 50, ok: 0, blocked: 0 },
    'E-commerce': { start: 50, end: 100, ok: 0, blocked: 0 },
    'Blogs/Médias': { start: 100, end: 130, ok: 0, blocked: 0 },
    'PME': { start: 130, end: 180, ok: 0, blocked: 0 },
    'Coachs/Formateurs': { start: 180, end: 210, ok: 0, blocked: 0 },
  };

  console.log(`\nPre-check PRO — ${SITES.length} target client sites\n`);
  console.log('Site'.padEnd(35) + 'Pro?'.padEnd(6) + 'Reason'.padEnd(22) + 'Pages');
  console.log('─'.repeat(75));

  let proOk = 0, proBlocked = 0;
  const blockedByReason = {};
  const blockedList = [];

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

      // Track category
      for (const [cat, info] of Object.entries(categories)) {
        if (i >= info.start && i < info.end) { pro ? info.ok++ : info.blocked++; break; }
      }

      if (pro) {
        proOk++;
        console.log(`[${(i+1+'').padStart(3)}] ${host.padEnd(33)}✅    ${reason.padEnd(22)}${pages}`);
      } else {
        proBlocked++;
        blockedByReason[reason] = (blockedByReason[reason] || 0) + 1;
        blockedList.push({ host, reason, pages });
        console.log(`[${(i+1+'').padStart(3)}] ${host.padEnd(33)}❌    ${reason.padEnd(22)}${pages}`);
      }
    } catch (e) {
      proBlocked++;
      blockedByReason['error'] = (blockedByReason['error'] || 0) + 1;
      console.log(`[${(i+1+'').padStart(3)}] ${host.padEnd(33)}💥    ${e.message.slice(0, 30)}`);
    }
  }

  console.log('─'.repeat(75));
  console.log(`\n${'═'.repeat(75)}`);
  console.log('RESULTATS PRO');
  console.log('═'.repeat(75));
  console.log(`\n  ✅ Pro OK:     ${proOk}/${SITES.length}  (${Math.round(proOk/SITES.length*100)}%)`);
  console.log(`  ❌ Pro bloqué: ${proBlocked}/${SITES.length}  (${Math.round(proBlocked/SITES.length*100)}%)\n`);

  console.log('  Par raison:');
  Object.entries(blockedByReason).sort((a, b) => b[1] - a[1]).forEach(([r, c]) => console.log(`    ${r.padEnd(22)} ${c}`));

  console.log('\n  Par catégorie:');
  for (const [cat, info] of Object.entries(categories)) {
    const total = info.ok + info.blocked;
    console.log(`    ${cat.padEnd(22)} ${info.ok}/${total} OK  (${Math.round(info.ok/total*100)}%)`);
  }

  process.exit(0);
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
