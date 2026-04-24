/**
 * Detekia Pro — Multi-page site-level PDF report.
 * Uses shared components from oneReportTemplate.js (recoSections, esc, S).
 * Keeps Pro-unique logic: per-criterion deduplication, _pages labels, patterns, recap.
 */

const { recoSections, esc, S, criterionGrade: sharedCriterionGrade, stripAccents } = require('./oneReportTemplate');

function gradeFromScore(score) {
  if (score >= 70) return { label: 'BON', color: '#10A37F', bg: 'rgba(16,163,127,0.12)', border: 'rgba(16,163,127,0.3)' };
  if (score >= 45) return { label: 'MOYEN', color: '#C9861A', bg: 'rgba(201,134,26,0.12)', border: 'rgba(201,134,26,0.3)' };
  return { label: 'FAIBLE', color: '#D97757', bg: 'rgba(217,119,87,0.12)', border: 'rgba(217,119,87,0.3)' };
}

function criterionGrade(score, max) {
  const pct = max > 0 ? score / max : 0;
  if (pct >= 0.75) return { label: 'BON', color: '#10A37F', bg: 'rgba(16,163,127,0.10)' };
  if (pct >= 0.45) return { label: 'IMPORTANT', color: '#C9861A', bg: 'rgba(201,134,26,0.10)' };
  return { label: 'CRITIQUE', color: '#D97757', bg: 'rgba(217,119,87,0.10)' };
}

function priorityStyle(p) {
  const s = String(p || '').toLowerCase();
  if (s === 'high') return { color: '#D97757', bg: 'rgba(217,119,87,0.08)', label: 'CRITIQUE' };
  if (s === 'medium') return { color: '#C9861A', bg: 'rgba(201,134,26,0.08)', label: 'IMPORTANT' };
  return { color: '#10A37F', bg: 'rgba(16,163,127,0.08)', label: 'BONUS' };
}

function severityBadge(sev) {
  const s = String(sev || '').toLowerCase();
  const style = 'display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;';
  if (s.includes('critique') || s.includes('critical')) return `<span style="${style}background:rgba(217,119,87,0.12);color:#D97757;">CRITIQUE</span>`;
  if (s.includes('important')) return `<span style="${style}background:rgba(201,134,26,0.12);color:#C9861A;">IMPORTANT</span>`;
  return `<span style="${style}background:rgba(16,163,127,0.12);color:#10A37F;">MINEUR</span>`;
}

// ── Shared layout constants ─────────────────────────────────────────────────
const P = 'page-break-before:always;background:#fff;box-sizing:border-box;';
const sLabel = (txt, color = '#D97757') => `<div style="font-family:monospace;font-size:10px;color:${color};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">${txt}</div>`;
const H1 = (txt) => `<h1 style="font-family:Georgia,serif;font-size:34px;color:#1A1916;letter-spacing:-1px;margin-bottom:28px;line-height:1.1;">${txt}</h1>`;
const H2 = (txt) => `<h2 style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-bottom:14px;">${txt}</h2>`;

// ── WHY / CASES / GUIDES (criterion-level enrichment) ───────────────────────
const WHY = {
  extractibilite: "44,2% des citations IA proviennent des 30 premiers % du texte. Votre introduction est votre atout n1. (Growth Memo, 2026)",
  verifiabilite: "Les pages avec des donnees chiffrees sont citees 2,8x plus souvent. (AirOps, 2026)",
  autorite: "L'autorite de domaine est le predicteur n1 des citations IA avec un score SHAP de 0,63. (SE Ranking, 2025)",
  crawlabilite: "73% des sites ne sont pas crawlables par les bots IA. Debloquer les crawlers est le quick win n1. (Otterly.AI, 2026)",
  'donnees structurees': "Le contenu structure en chunks est cite 3 a 5x plus souvent que le contenu brut. (Otterly.AI, 2026)",
  neutralite: "Les IA deprioritisent le contenu ouvertement promotionnel. Le ton doit rester factuel et informatif.",
  presence: "90% des citations IA proviennent de medias earned et owned, pas de placements payants. (Edelman, 2026)",
  fraicheur: "65% des visites de bots IA ciblent du contenu publie dans les 12 derniers mois. (Seer Interactive, 2025)",
};

const GUIDES = {
  extractibilite: "Restructurez vos pages pour repondre directement a la question principale des les 2 premieres phrases. Utilisez des listes a puces et des sous-titres H2/H3 descriptifs.",
  verifiabilite: "Pour chaque donnee chiffree, ajoutez un lien externe vers la source. Visez 5 a 10 liens externes par page principale.",
  autorite: "Creez une page 'A propos' detaillee. Ajoutez un schema Organization en JSON-LD. Obtenez des mentions presse.",
  crawlabilite: "Verifiez votre robots.txt : GPTBot, ClaudeBot, PerplexityBot doivent etre autorises. Ajoutez un fichier llms.txt.",
  'donnees structurees': "Implementez Organization, FAQPage, Article en JSON-LD. Validez avec le Rich Results Test.",
  neutralite: "Remplacez les superlatifs par des donnees factuelles. Ajoutez une section 'Limites'.",
  presence: "Creez un profil actif sur Reddit. Obtenez des mentions dans des articles de presse et podcasts.",
  fraicheur: "Ajoutez datePublished et dateModified en schema.org. Mettez a jour vos articles existants avec des donnees recentes.",
};

const CASES = {
  extractibilite: "SEO Vendor a obtenu 549 sessions ChatGPT en 7 mois grace a des tactiques d'extractibilite. (SEO Vendor, 2026)",
  verifiabilite: "Ahrefs genere 12,1% de ses inscriptions via le trafic IA grace a des contenus riches en donnees. (Ahrefs/Semrush, 2025)",
  autorite: "Les marques dans le top 25% des mentions web obtiennent 10x plus de visibilite IA. (Ahrefs, 2025)",
  crawlabilite: "Triangle IP a cree un fichier llms.txt : 5x plus de trafic IA. (Concurate/SE Ranking, 2025)",
  'donnees structurees': "Un site a augmente sa visibilite IA de 340% en 6 mois via schema. (Stackmatix, 2026)",
  neutralite: "La 'Fluency Optimization' ameliore significativement la visibilite IA. Le contenu educatif est cite devant le promotionnel.",
  presence: "Reddit est cite dans 46,7% des reponses Perplexity. (Profound, 2025)",
  fraicheur: "79% des pages visitees par les bots IA ont ete publiees dans les 2 dernieres annees. (Seer Interactive, 2025)",
};

function lookupMap(map, criterionName) {
  const n = String(criterionName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [k, v] of Object.entries(map)) { if (n.includes(k)) return v; }
  return '';
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════

function generateProReportHTML(report, locale = 'fr') {
  const t = S[locale] || S.fr;
  const { rootUrl, scoreAverage, scoreMedian, distribution, pagesValid, pagesWithError,
    executiveSummary, topStrengths, topWeaknesses, patterns, actionPlan,
    citationTestConsolidated, criteriaConsolidated, criteriaAverages, pages, consolidatedAt } = report;

  const date = new Date(consolidatedAt || Date.now()).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const totalPages = pagesValid + (pagesWithError || 0);
  const g = gradeFromScore(scoreAverage);
  const beelevenUrl = locale === 'en' ? 'https://detekia.fr/en/contact' : 'https://detekia.fr/contact';

  // ── Collect ALL recos from all pages, grouped by criterion ──────────────
  const recosByCriterion = {};
  (pages || []).forEach(p => {
    if (p.error) return;
    (p.recommendations || []).forEach(r => {
      const crit = r.criterion || 'Autre';
      if (!recosByCriterion[crit]) recosByCriterion[crit] = [];
      recosByCriterion[crit].push({ ...r, pageUrl: p.url, pageScore: p.score });
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1: COVER
  // ══════════════════════════════════════════════════════════════════════════
  const cover = `
  <div style="background:#1A1916;min-height:100vh;padding:72px 64px;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
    <div style="position:absolute;top:-100px;right:-100px;width:400px;height:400px;border-radius:50%;background:${g.color};opacity:0.05;pointer-events:none;"></div>
    <div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;"><div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;width:20px;height:20px;"><div style="background:#10A37F;border-radius:50%;"></div><div style="background:#D97757;border-radius:50%;"></div><div style="background:#4285F4;border-radius:50%;"></div><div style="background:#1C7DC4;border-radius:50%;"></div></div><span style="font-family:Georgia,serif;font-size:18px;color:#F7F5F2;font-weight:bold;">Detekia</span></div>
      <div style="font-family:monospace;font-size:9px;color:rgba(247,245,242,0.35);letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">RAPPORT GEO COMPLET</div>
      <div style="font-family:monospace;font-size:11px;color:#D97757;letter-spacing:2px;margin-bottom:48px;">AUDIT SITE &mdash; ${totalPages} PAGES ANALYSEES</div>
      <div style="font-family:Georgia,serif;font-size:96px;color:#F7F5F2;line-height:1;letter-spacing:-4px;">${scoreAverage}</div>
      <div style="font-family:monospace;font-size:11px;color:rgba(247,245,242,0.25);">/100 &mdash; score moyen du site</div>
      <div style="margin-top:18px;display:inline-block;background:${g.bg};border:1px solid ${g.color}44;padding:4px 14px;border-radius:20px;font-family:monospace;font-size:9px;letter-spacing:2px;color:${g.color};">${g.label}</div>
      <div style="margin-top:24px;font-family:monospace;font-size:12px;color:#D97757;">${esc(rootUrl)}</div>
    </div>
    <div><div style="font-family:system-ui;font-size:12px;color:rgba(247,245,242,0.28);">Ce rapport est personnel et confidentiel</div><div style="font-family:system-ui;font-size:11px;color:rgba(247,245,242,0.2);">Beeleven SASU &middot; hello@detekia.fr &middot; detekia.fr</div></div>
  </div>`;

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 2: EXECUTIVE SUMMARY
  // ══════════════════════════════════════════════════════════════════════════
  const criteriaRows = Object.entries(criteriaAverages || {}).map(([name, data]) => {
    const cg = criterionGrade(data.avgScore, data.max);
    const pct = Math.round((data.avgScore / data.max) * 100);
    return `<tr>
      <td style="padding:10px 12px;font-family:system-ui;font-size:12px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${esc(name)}</td>
      <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #F0EDE8;"><span style="font-family:monospace;font-size:12px;font-weight:600;color:${cg.color};">${data.avgScore}/${data.max}</span></td>
      <td style="padding:10px 16px;border-bottom:1px solid #F0EDE8;width:120px;"><div style="height:6px;background:#E5E2DC;border-radius:3px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${cg.color};border-radius:3px;"></div></div></td>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EDE8;"><span style="display:inline-block;padding:2px 9px;border-radius:12px;font-family:monospace;font-size:9px;letter-spacing:1px;background:${cg.bg};color:${cg.color};">${cg.label}</span></td>
    </tr>`;
  }).join('');

  const top3Actions = (actionPlan || []).slice(0, 3).map((a, i) => {
    const pc = priorityStyle(a.impact);
    return `<div style="display:flex;gap:16px;align-items:flex-start;padding:14px 16px;background:${pc.bg};border-radius:8px;margin-bottom:8px;">
      <div style="font-family:Georgia,serif;font-size:22px;color:${pc.color};line-height:1;flex-shrink:0;min-width:24px;">${i + 1}</div>
      <div style="flex:1;"><div style="font-family:system-ui;font-size:12px;font-weight:600;color:#1A1916;margin-bottom:3px;">${esc(a.action)}</div><div style="font-family:system-ui;font-size:11px;color:#8A8680;line-height:1.5;">${esc(a.criterion || '')}</div></div>
      <div style="font-family:monospace;font-size:9px;color:${pc.color};background:${pc.bg};padding:3px 9px;border-radius:12px;white-space:nowrap;flex-shrink:0;border:1px solid ${pc.color}33;">${esc(a.impact || '')}</div>
    </div>`;
  }).join('');

  const strengthsHTML = (topStrengths || []).map(s => `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;"><span style="color:#10A37F;font-size:14px;flex-shrink:0;">&#10003;</span><span style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.5;">${esc(s)}</span></div>`).join('');

  const execSummary = `
  <div style="${P}">
    ${sLabel('Synthese executive')}
    ${H1("Resultats de l'analyse")}
    <div style="background:#1A1916;border-radius:16px;padding:28px 36px;margin-bottom:28px;display:flex;align-items:flex-end;gap:28px;">
      <div style="text-align:center;flex-shrink:0;"><div style="font-family:Georgia,serif;font-size:72px;color:#F7F5F2;line-height:1;letter-spacing:-3px;">${scoreAverage}</div><div style="font-family:monospace;font-size:11px;color:rgba(247,245,242,0.25);">/100</div></div>
      <div style="padding-bottom:8px;flex:1;"><div style="font-family:monospace;font-size:11px;color:#D97757;margin-bottom:6px;">${esc(rootUrl)} &mdash; ${totalPages} pages</div><div style="font-size:13px;color:rgba(247,245,242,0.55);line-height:1.65;font-family:system-ui;">${esc((executiveSummary || '').split('\n')[0] || '').slice(0, 200)}...</div></div>
    </div>
    ${H2('Les 8 criteres GEO')}
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <thead><tr style="background:#F7F5F2;"><th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Critere</th><th style="padding:9px 12px;text-align:center;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Score moy.</th><th style="padding:9px 12px;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Progression</th><th style="padding:9px 12px;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Statut</th></tr></thead>
      <tbody>${criteriaRows}</tbody>
    </table>
    ${H2('3 actions prioritaires')}
    ${top3Actions}
    ${H2('Points forts identifies')}
    <div style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:20px 24px;">${strengthsHTML}</div>
  </div>`;

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 3: BEELEVEN MINI
  // ══════════════════════════════════════════════════════════════════════════
  const beelevenMini = `
  <div style="${P}display:flex;align-items:center;justify-content:center;padding-top:120px;padding-bottom:120px;">
    <div style="max-width:480px;text-align:center;">
      ${sLabel('Aller plus loin')}
      ${H1("Besoin d'aide pour implementer ce plan ?")}
      <p style="font-family:system-ui;font-size:14px;color:#6B6762;line-height:1.7;margin-bottom:32px;">Beeleven, l'agence qui a cree Detekia, peut implementer les recommandations pour vous : audit approfondi, optimisations techniques, suivi mensuel.</p>
      <a href="${beelevenUrl}" style="display:inline-block;background:#D97757;color:#fff;padding:14px 36px;border-radius:10px;font-family:system-ui;font-size:15px;font-weight:700;text-decoration:none;">Discutons-en &rarr;</a>
      <div style="font-family:monospace;font-size:10px;color:#B0ABA5;margin-top:16px;">beeleven.fr &middot; hello@detekia.fr</div>
    </div>
  </div>`;

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 4: CONTEXT 2026
  // ══════════════════════════════════════════════════════════════════════════
  const ctxCards = [
    { label: 'Croissance du trafic IA', value: '+527%', text: 'Le trafic refere par les IA a augmente de 527% entre janvier et mai 2025.', source: 'Previsible, 2025', color: '#D97757' },
    { label: 'Usage ChatGPT', value: '2,5 Mds', text: 'Requetes traitees par jour.', source: 'Search Engine Land, 2026', color: '#D97757' },
    { label: 'Taux de conversion IA', value: '4,4x', text: 'Les visiteurs referes par les IA convertissent 4,4x mieux.', source: 'Semrush, 2025', color: '#10A37F' },
    { label: 'SEO vs GEO', value: '80%', text: 'Des URLs citees par ChatGPT ne sont PAS dans le top 100 Google.', source: 'Ahrefs, 2025', color: '#D97757' },
    { label: 'Position du texte', value: '44,2%', text: 'Des citations IA proviennent des 30 premiers % du texte.', source: 'Growth Memo, 2026', color: '#C9861A' },
    { label: 'Marche GEO', value: '33,7 Mds$', text: 'Valeur projetee du marche GEO en 2034.', source: 'eMarketer', color: '#10A37F' },
  ].map(card => `<div class="context-card" style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;"><div style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">${card.label}</div><div style="font-family:Georgia,serif;font-size:28px;color:${card.color};line-height:1;margin-bottom:6px;">${card.value}</div><p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.6;">${card.text} <span style="color:#B0ABA5;">(${card.source})</span></p></div>`).join('');

  const contextPage = `
  <div style="${P}">
    ${sLabel('Contexte 2026')}
    ${H1('Pourquoi la visibilite IA est critique en 2026')}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px;">${ctxCards}</div>
    <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;margin-bottom:20px;"><p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.7;"><strong>Seulement 11%</strong> des domaines sont cites a la fois par ChatGPT ET Perplexity.</p></div>
    <div style="background:#F7F5F2;border-radius:10px;padding:22px 26px;"><div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Source academique</div><p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.65;">"Generative Engine Optimization" &mdash; Aggarwal et al., Princeton / Georgia Tech, KDD 2024. Certaines optimisations augmentent la visibilite IA jusqu'a 40%.</p></div>
  </div>`;

  // ══════════════════════════════════════════════════════════════════════════
  // PAGES 5-6: CITATION TEST (30 queries)
  // ══════════════════════════════════════════════════════════════════════════
  const ct = citationTestConsolidated || {};
  const queries = ct.queries || [];
  const citedCount = queries.filter(q => q.cited).length;

  const queryCards = queries.map(q => {
    const citedBadge = q.cited ? `<span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;background:rgba(16,163,127,0.12);color:#10A37F;">Cite</span>` : `<span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;background:rgba(217,119,87,0.12);color:#D97757;">Non cite</span>`;
    const typeLabel = q.type === 'generic' ? 'GENERIQUE' : q.type === 'niche' ? 'NICHE' : 'LONGUE TRAINE';
    return `<div class="citation-test-card" style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:8px;padding:14px 16px;margin-bottom:8px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">${citedBadge}<span style="font-family:monospace;font-size:9px;color:#B0ABA5;">${typeLabel}</span>${q.difficulty_to_rank ? `<span style="font-family:monospace;font-size:9px;color:#8A8680;margin-left:auto;">${esc(q.difficulty_to_rank)}</span>` : ''}</div>
      <div style="font-family:system-ui;font-size:13px;color:#1A1916;font-weight:600;margin-bottom:4px;">${esc(q.query)}</div>
      ${q.competitorsCited?.length > 0 ? `<div style="font-family:system-ui;font-size:11px;color:#8A8680;margin-bottom:4px;">Cites a votre place : ${q.competitorsCited.map(c => esc(c)).join(', ')}</div>` : ''}
      ${q.recommendation ? `<div style="font-family:system-ui;font-size:11px;color:#3A3835;line-height:1.5;">${esc(q.recommendation)}</div>` : ''}
    </div>`;
  }).join('');

  const citationPage = `
  <div style="${P}">
    ${sLabel('Test IA')}
    ${H1('Test de visibilite IA consolide')}
    <p style="font-family:system-ui;font-size:13px;color:#8A8680;margin-bottom:28px;">Nous avons simule 30 requetes utilisateur pour verifier si votre site est cite par les moteurs IA.</p>
    <div style="display:flex;gap:20px;margin-bottom:28px;">
      <div style="background:#1A1916;border-radius:14px;padding:24px 32px;text-align:center;flex-shrink:0;"><div style="font-family:Georgia,serif;font-size:42px;color:#F7F5F2;">${citedCount}/${queries.length}</div><div style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.35);white-space:pre-line;">requetes\ncitent votre site</div></div>
      <div style="flex:1;">
        <div style="background:#E8F7F3;border-radius:10px;padding:14px 18px;margin-bottom:8px;"><div style="font-family:monospace;font-size:9px;color:#10A37F;margin-bottom:4px;">Meilleure opportunite :</div><div style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.5;">${esc(ct.bestOpportunity || '')}</div></div>
        <div style="background:rgba(217,119,87,0.06);border-radius:10px;padding:14px 18px;"><div style="font-family:monospace;font-size:9px;color:#D97757;margin-bottom:4px;">Blocage principal :</div><div style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.5;">${esc(ct.mainBlocker || '')}</div></div>
      </div>
    </div>
    ${queryCards}
    <div style="background:rgba(217,119,87,0.06);border-left:3px solid #D97757;border-radius:0 8px 8px 0;padding:14px 18px;margin-top:16px;"><p style="font-family:system-ui;font-size:12px;color:#3A3835;line-height:1.7;">Ce test simule des requetes via l'IA. Les resultats varient selon le moteur, la formulation et le moment.</p></div>
  </div>`;

  // ══════════════════════════════════════════════════════════════════════════
  // PAGES 7-14: 8 CRITERIA — now using recoSections() from oneReportTemplate
  // ══════════════════════════════════════════════════════════════════════════
  const criteriaOrder = [
    'Extractibilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T',
    'Crawlabilite IA', 'Donnees structurees', 'Neutralite editoriale',
    'Presence externe', 'Fraicheur & maintenance',
  ];

  // Compute 3 weakest criteria for case study display
  const criteriaSorted = criteriaOrder.map(name => {
    const d = criteriaAverages[name] || { avgScore: 0, max: 1 };
    return { name, pct: d.max > 0 ? d.avgScore / d.max : 1 };
  }).sort((a, b) => a.pct - b.pct);
  const weakest3Names = new Set(criteriaSorted.slice(0, 3).map(c => c.name));

  const criteriaPages = criteriaOrder.map((criterionName, idx) => {
    const avgData = criteriaAverages[criterionName] || { avgScore: 0, max: 0 };
    const cg = criterionGrade(avgData.avgScore, avgData.max);
    const pct = avgData.max > 0 ? Math.round((avgData.avgScore / avgData.max) * 100) : 0;
    const cc = (criteriaConsolidated || []).find(c => c.criterion === criterionName) || {};
    const why = lookupMap(WHY, criterionName);
    const guide = lookupMap(GUIDES, criterionName);
    const caseStudy = lookupMap(CASES, criterionName);

    // All recos from all pages for THIS criterion
    const matchedRecos = [];
    for (const [crit, recos] of Object.entries(recosByCriterion)) {
      const normCrit = crit.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normTarget = criterionName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normCrit.includes(normTarget) || normTarget.includes(normCrit)) {
        matchedRecos.push(...recos);
      }
    }

    // Deduplicate by title (group pages with same reco)
    const deduped = [];
    const seen = new Set();
    for (const r of matchedRecos) {
      const key = (r.title || r.problem || r.diagnostic || '').slice(0, 50).toLowerCase();
      if (seen.has(key)) {
        const existing = deduped.find(d => (d.title || d.problem || d.diagnostic || '').slice(0, 50).toLowerCase() === key);
        if (existing && !existing._pages.includes(r.pageUrl)) existing._pages.push(r.pageUrl);
        continue;
      }
      seen.add(key);
      deduped.push({ ...r, _pages: [r.pageUrl] });
    }

    // Sort by priority (high first)
    deduped.sort((a, b) => {
      const p = { high: 0, medium: 1, low: 2 };
      return (p[a.priority] ?? 1) - (p[b.priority] ?? 1);
    });

    const recosHTML = deduped.map((r, ri) => {
      const rc = priorityStyle(r.priority);
      const pagesNote = r._pages.length > 1
        ? `<div style="margin-top:8px;font-family:monospace;font-size:10px;color:#8A8680;">${r._pages.length} pages concernees : ${r._pages.slice(0, 4).map(u => esc(u.replace(rootUrl, '/'))).join(', ')}${r._pages.length > 4 ? ' +' + (r._pages.length - 4) : ''}</div>`
        : `<div style="margin-top:8px;font-family:monospace;font-size:10px;color:#8A8680;">Page : ${esc(r._pages[0] || '')}</div>`;

      return `<div class="reco-block" style="border:1px solid ${rc.color}28;border-left:4px solid ${rc.color};border-radius:0 14px 14px 0;overflow:hidden;margin-bottom:12px;">
        <div style="padding:12px 20px 10px;border-bottom:1px solid #F0EDE8;display:flex;align-items:center;gap:10px;">
          <span style="font-family:monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;padding:3px 9px;border-radius:6px;background:${rc.bg};color:${rc.color};">${rc.label}</span>
          ${r.title ? `<span style="font-family:system-ui;font-size:13px;font-weight:600;color:#1A1916;">${esc(r.title)}</span>` : ''}
          <span style="margin-left:auto;font-family:monospace;font-size:10px;color:#C2BDB8;">#${String(ri + 1).padStart(2, '0')}</span>
        </div>
        <div style="padding:12px 20px;">
          ${recoSections(r, t)}
          ${pagesNote}
        </div>
      </div>`;
    }).join('');

    return `
    <div style="${idx === 0 ? P : 'margin-top:40px;background:#fff;'}">
      <div style="margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;">Critere ${idx + 1} / 8</span></div>
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:10px;gap:16px;">
          <h1 style="font-family:Georgia,serif;font-size:26px;color:#1A1916;letter-spacing:-0.5px;line-height:1.2;">${esc(criterionName)}</h1>
          <div style="text-align:right;flex-shrink:0;"><div style="font-family:Georgia,serif;font-size:38px;color:${cg.color};line-height:1;letter-spacing:-1px;">${avgData.avgScore}<span style="font-size:16px;color:#C0BBB5;">/${avgData.max}</span></div><div style="font-family:monospace;font-size:9px;color:#B0ABA5;">${pct}% &mdash; moyenne site</div></div>
        </div>
        <div style="height:8px;background:#E5E2DC;border-radius:4px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${cg.color};border-radius:4px;"></div></div>
      </div>
      ${why ? `<div style="margin-bottom:24px;"><div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Pourquoi c'est important</div><p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.75;">${esc(why)}</p></div>` : ''}
      <div style="margin-bottom:24px;">
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Recommandations (${deduped.length})</div>
        ${recosHTML || '<p style="font-family:system-ui;font-size:13px;color:#10A37F;">Ce critere est bien optimise sur l\'ensemble du site.</p>'}
      </div>
      ${guide ? `<div class="case-study-block" style="background:rgba(217,119,87,0.04);border-left:3px solid #D97757;border-radius:0 10px 10px 0;padding:18px 22px;margin-bottom:16px;"><div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Guide technique</div><p style="font-family:system-ui;font-size:13px;color:#3A3835;line-height:1.8;">${esc(guide)}</p></div>` : ''}
      ${weakest3Names.has(criterionName) && caseStudy ? `<div class="case-study-block" style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:18px 22px;"><div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Cas reel documente</div><p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.7;">${esc(caseStudy)}</p></div>` : ''}
    </div>`;
  }).join('');

  // ══════════════════════════════════════════════════════════════════════════
  // PATTERNS + ACTION PLAN
  // ══════════════════════════════════════════════════════════════════════════
  const patternsCards = (patterns || []).map(p => `<div class="reco-block" style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:16px 20px;margin-bottom:10px;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">${severityBadge(p.severity)}<span style="font-family:monospace;font-size:10px;color:#8A8680;">${esc(p.criterion || '')}</span></div>
    <div style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.6;margin-bottom:6px;">${esc(p.pattern)}</div>
    <div style="font-family:monospace;font-size:10px;color:#8A8680;">${(p.pagesAffected || []).length} pages concernees</div>
  </div>`).join('');

  const actionCards = (actionPlan || []).map((a, i) => {
    const pc = priorityStyle(a.impact);
    return `<div class="reco-block" style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:16px 20px;margin-bottom:8px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="font-family:Georgia,serif;font-size:18px;color:${pc.color};min-width:24px;">${i + 1}</span>
        <span style="font-family:monospace;font-size:9px;color:#8A8680;">${esc(a.criterion || '')}</span>
        <span style="font-family:monospace;font-size:9px;color:${pc.color};margin-left:auto;">${esc(a.impact || '')} &middot; ${esc(a.effort || '')}</span>
      </div>
      <div style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.6;">${esc(a.action)}</div>
    </div>`;
  }).join('');

  const projected = Math.min(100, scoreAverage + Math.round(scoreAverage * 0.35));

  const patternsAndActions = `
  <div style="${P}">
    ${sLabel('Patterns detectes')}
    ${H1('Patterns transverses')}
    ${patternsCards}
  </div>
  <div style="${P}">
    ${sLabel("Plan d'action site")}
    ${H1('Actions prioritaires consolidees')}
    <p style="font-family:system-ui;font-size:13px;color:#8A8680;margin-bottom:28px;">${(actionPlan || []).length} actions classees par priorite.</p>
    ${actionCards}
    <div style="margin-top:32px;background:#1A1916;border-radius:14px;padding:24px 28px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:20px;">
        <div style="text-align:center;"><div style="font-family:Georgia,serif;font-size:48px;color:#10A37F;line-height:1;">${projected}</div><div style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.35);">/100 projete</div></div>
        <div style="flex:1;"><div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:1.5px;margin-bottom:6px;">SCORE PROJETE APRES OPTIMISATION</div><div style="font-family:system-ui;font-size:12px;color:rgba(247,245,242,0.7);line-height:1.6;">En appliquant les recommandations de ce rapport, votre score GEO pourrait passer de ${scoreAverage} a ${projected}/100.</div></div>
      </div>
    </div>
    <div style="background:rgba(217,119,87,0.06);border-left:3px solid #D97757;border-radius:0 8px 8px 0;padding:12px 16px;margin-bottom:24px;">
      <p style="font-family:system-ui;font-size:11px;color:#3A3835;line-height:1.6;margin:0;">Ce score projete est une estimation basee sur l'impact moyen observe des optimisations GEO. Les resultats reels dependent de nombreux facteurs : implementation technique, qualite du contenu, evolution des algorithmes IA, et concurrence sectorielle. Cette projection ne constitue pas une garantie.</p>
    </div>
    <div class="beeleven-cta-block" style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:14px;padding:24px 28px;text-align:center;">
      <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;margin-bottom:8px;">ALLER PLUS LOIN</div>
      <div style="font-family:Georgia,serif;font-size:18px;color:#1A1916;margin-bottom:8px;">Besoin d'aide pour implementer ces recommandations ?</div>
      <p style="font-family:system-ui;font-size:12px;color:#6B6762;line-height:1.6;margin-bottom:14px;">Beeleven, l'agence qui a cree Detekia, peut implementer les recommandations pour vous.</p>
      <a href="${beelevenUrl}" style="display:inline-block;background:#D97757;color:#fff;padding:10px 28px;border-radius:8px;font-family:system-ui;font-size:13px;font-weight:700;text-decoration:none;">Discutons-en \u2192</a>
    </div>
  </div>`;

  // ══════════════════════════════════════════════════════════════════════════
  // RECAP PAR PAGE (compact)
  // ══════════════════════════════════════════════════════════════════════════
  const validPages = (pages || []).filter(p => !p.error);
  const errorPagesArr = (pages || []).filter(p => p.error);

  const pageRows = validPages.map(p => {
    const sc = gradeFromScore(p.score || 0);
    const weakest = [...(p.criteria || [])].sort((a, b) => (a.score / a.max) - (b.score / b.max))[0];
    return `<tr style="border-bottom:1px solid #F0EDE8;">
      <td style="padding:8px 12px;font-family:monospace;font-size:11px;color:#D97757;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc((p.url || '').replace(rootUrl, '/'))}</td>
      <td style="padding:8px 12px;text-align:center;"><span style="font-family:monospace;font-size:12px;font-weight:600;color:${sc.color};">${p.score}</span></td>
      <td style="padding:8px 12px;"><span style="display:inline-block;padding:2px 8px;border-radius:10px;font-family:monospace;font-size:9px;background:${sc.bg};color:${sc.color};">${sc.label}</span></td>
      <td style="padding:8px 12px;font-family:system-ui;font-size:11px;color:#8A8680;">${weakest ? esc(weakest.name) + ' (' + weakest.score + '/' + weakest.max + ')' : ''}</td>
    </tr>`;
  }).join('');

  const recapPage = `
  <div style="${P}">
    ${sLabel('Annexe')}
    ${H1('Bilan par page analysee')}
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:10px;overflow:hidden;">
      <thead><tr style="background:#F7F5F2;">
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Page</th>
        <th style="padding:9px 12px;text-align:center;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Score</th>
        <th style="padding:9px 12px;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Statut</th>
        <th style="padding:9px 12px;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Point faible principal</th>
      </tr></thead>
      <tbody>${pageRows}</tbody>
    </table>
    ${errorPagesArr.length > 0 ? `<div style="margin-top:16px;font-family:system-ui;font-size:12px;color:#D97757;">${errorPagesArr.length} page(s) non analysable(s) : ${errorPagesArr.map(p => esc(p.url)).join(', ')}</div>` : ''}
  </div>`;

  // ══════════════════════════════════════════════════════════════════════════
  // METHODOLOGY
  // ══════════════════════════════════════════════════════════════════════════
  const methodologyPage = `
  <div style="${P}">
    ${sLabel('Transparence')}
    ${H1('Methodologie')}
    <div style="background:rgba(217,119,87,0.06);border-left:3px solid #D97757;border-radius:0 8px 8px 0;padding:12px 16px;margin-bottom:16px;">
      <div style="font-family:system-ui;font-size:11px;font-weight:700;color:#D97757;margin-bottom:4px;">LIMITES DE L'ANALYSE</div>
      <p style="font-family:system-ui;font-size:11px;color:#3A3835;line-height:1.5;margin:0;">Ce rapport fournit une estimation de la citabilite IA basee sur des heuristiques. Il ne constitue pas une garantie de visibilite dans les reponses des moteurs IA.</p>
    </div>
    <p style="font-family:system-ui;font-size:11px;color:#3A3835;line-height:1.5;margin-bottom:14px;">Chaque page est analysee via un service de scraping specialise puis evaluee sur 8 criteres ponderes. Le critere Neutralite editoriale est evalue par intelligence artificielle (modele Claude). Les scores sont calcules par des heuristiques deterministes appliquees au contenu HTML et Markdown extrait.</p>
    <table style="width:100%;border-collapse:collapse;font-size:10px;margin-bottom:14px;">
      <thead><tr style="background:#F7F5F2;"><th style="padding:6px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">CRITERE</th><th style="padding:6px 10px;text-align:center;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">MAX</th><th style="padding:6px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">SOURCE</th></tr></thead>
      <tbody>
        <tr style="border-bottom:1px solid #F0EDE8;"><td style="padding:5px 10px;font-family:system-ui;color:#1A1916;">Extractibilite &amp; reponse directe</td><td style="padding:5px 10px;text-align:center;font-family:monospace;color:#D97757;">25</td><td style="padding:5px 10px;font-family:system-ui;color:#8A8680;">Aggarwal et al. (KDD 2024)</td></tr>
        <tr style="border-bottom:1px solid #F0EDE8;"><td style="padding:5px 10px;font-family:system-ui;color:#1A1916;">Verifiabilite &amp; preuves</td><td style="padding:5px 10px;text-align:center;font-family:monospace;color:#D97757;">20</td><td style="padding:5px 10px;font-family:system-ui;color:#8A8680;">AirOps 2026, Aggarwal et al.</td></tr>
        <tr style="border-bottom:1px solid #F0EDE8;"><td style="padding:5px 10px;font-family:system-ui;color:#1A1916;">Autorite &amp; E-E-A-T</td><td style="padding:5px 10px;text-align:center;font-family:monospace;color:#D97757;">15</td><td style="padding:5px 10px;font-family:system-ui;color:#8A8680;">SE Ranking 2025, Google E-E-A-T</td></tr>
        <tr style="border-bottom:1px solid #F0EDE8;"><td style="padding:5px 10px;font-family:system-ui;color:#1A1916;">Crawlabilite IA</td><td style="padding:5px 10px;text-align:center;font-family:monospace;color:#D97757;">15</td><td style="padding:5px 10px;font-family:system-ui;color:#8A8680;">Otterly.AI 2026</td></tr>
        <tr style="border-bottom:1px solid #F0EDE8;"><td style="padding:5px 10px;font-family:system-ui;color:#1A1916;">Donnees structurees</td><td style="padding:5px 10px;text-align:center;font-family:monospace;color:#D97757;">10</td><td style="padding:5px 10px;font-family:system-ui;color:#8A8680;">Otterly.AI 2026, schema.org</td></tr>
        <tr style="border-bottom:1px solid #F0EDE8;"><td style="padding:5px 10px;font-family:system-ui;color:#1A1916;">Neutralite editoriale</td><td style="padding:5px 10px;text-align:center;font-family:monospace;color:#D97757;">10</td><td style="padding:5px 10px;font-family:system-ui;color:#8A8680;">Evaluation IA (Claude)</td></tr>
        <tr style="border-bottom:1px solid #F0EDE8;"><td style="padding:5px 10px;font-family:system-ui;color:#1A1916;">Presence externe</td><td style="padding:5px 10px;text-align:center;font-family:monospace;color:#D97757;">5</td><td style="padding:5px 10px;font-family:system-ui;color:#8A8680;">Edelman 2026, Profound 2025</td></tr>
        <tr><td style="padding:5px 10px;font-family:system-ui;color:#1A1916;">Fraicheur &amp; maintenance</td><td style="padding:5px 10px;text-align:center;font-family:monospace;color:#D97757;">5</td><td style="padding:5px 10px;font-family:system-ui;color:#8A8680;">Seer Interactive 2025</td></tr>
      </tbody>
    </table>
    <div style="background:#F7F5F2;border-radius:8px;padding:12px 16px;margin-bottom:14px;"><div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1px;margin-bottom:6px;">SOURCE ACADEMIQUE</div><p style="font-family:system-ui;font-size:11px;color:#1A1916;line-height:1.5;margin:0;">"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024.</p></div>
    <div style="background:rgba(217,119,87,0.06);border-left:3px solid #D97757;border-radius:0 8px 8px 0;padding:12px 16px;margin-bottom:14px;">
      <div style="font-family:system-ui;font-size:11px;font-weight:700;color:#D97757;margin-bottom:4px;">LIMITES DU RAPPORT</div>
      <p style="font-family:system-ui;font-size:11px;color:#3A3835;line-height:1.5;margin:0;">Les moteurs IA evoluent rapidement. Les resultats de ce rapport refletent l'etat des algorithmes a la date de generation. Le test de visibilite IA est une simulation et non une interrogation directe des moteurs.</p>
    </div>
    <div style="font-family:system-ui;font-size:10px;color:#B0ABA5;margin-bottom:8px;">Perimetre : ${totalPages} pages analysees sur ${esc(rootUrl)}. Score agrege : moyenne arithmetique des scores individuels.</div>
    <div style="text-align:center;padding-top:10px;"><div style="font-family:monospace;font-size:10px;color:#B0ABA5;">Rapport genere le ${date} · detekia.fr</div></div>
  </div>`;

  // ══════════════════════════════════════════════════════════════════════════
  // BEELEVEN FULL
  // ══════════════════════════════════════════════════════════════════════════
  const beelevenFull = `
  <div style="${P}display:flex;align-items:center;justify-content:center;padding-top:120px;padding-bottom:120px;">
    <div style="max-width:480px;text-align:center;">
      ${sLabel('Aller plus loin')}
      ${H1('Aller plus loin avec Beeleven')}
      <p style="font-family:system-ui;font-size:14px;color:#6B6762;line-height:1.7;margin-bottom:32px;">Vous avez le diagnostic complet de votre site. Beeleven peut implementer les recommandations pour vous : audit approfondi, optimisations techniques, suivi mensuel des resultats.</p>
      <a href="${beelevenUrl}" style="display:inline-block;background:#D97757;color:#fff;padding:14px 36px;border-radius:10px;font-family:system-ui;font-size:15px;font-weight:700;text-decoration:none;">Discutons-en &rarr;</a>
      <div style="font-family:monospace;font-size:10px;color:#B0ABA5;margin-top:16px;">beeleven.fr &middot; hello@detekia.fr</div>
    </div>
  </div>`;

  // ══════════════════════════════════════════════════════════════════════════
  // ASSEMBLE
  // ══════════════════════════════════════════════════════════════════════════
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8">
<title>Rapport GEO Complet &mdash; ${esc(rootUrl)}</title>
<style>
  /* ── 1. PAGE MARGINS — consistent on every page ──────────────── */
  @page { size: A4; margin: 20mm 15mm 25mm 15mm; }
  @page :first { margin: 0; } /* Cover page: full bleed */

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* ── 2. BLOCK INTEGRITY — never cut these blocks ─────────────── */
  .reco-block,
  .citation-test-card,
  .context-card,
  .case-study-block,
  .tech-block,
  .code-block {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Headings: never orphaned at bottom of page */
  h1, h2, h3 { break-after: avoid; page-break-after: avoid; }

  /* Paragraphs: at least 3 lines on each side of a break */
  p { orphans: 3; widows: 3; }

  /* Table rows: never split */
  tr { break-inside: avoid; page-break-inside: avoid; }
</style>
</head>
<body>
${cover}
${execSummary}
${contextPage}
${citationPage}
${criteriaPages}
${patternsAndActions}
${recapPage}
${methodologyPage}
</body>
</html>`;
}

module.exports = { generateProReportHTML, PRO_STRINGS: { fr: {}, en: {} } };
