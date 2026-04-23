/**
 * Detekia Pro — Multi-page PDF report HTML template.
 * Reuses design system from generate-pdf.js (same palette, typo, cards, spacing).
 */

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function gradeFromScore(score) {
  if (score >= 70) return { label: 'BON', color: '#10A37F', bg: 'rgba(16,163,127,0.12)' };
  if (score >= 45) return { label: 'MOYEN', color: '#C9861A', bg: 'rgba(201,134,26,0.12)' };
  return { label: 'FAIBLE', color: '#D97757', bg: 'rgba(217,119,87,0.12)' };
}

function criterionGrade(score, max) {
  const pct = max > 0 ? score / max : 0;
  if (pct >= 0.75) return { label: 'BON', color: '#10A37F', bg: 'rgba(16,163,127,0.10)' };
  if (pct >= 0.45) return { label: 'IMPORTANT', color: '#C9861A', bg: 'rgba(201,134,26,0.10)' };
  return { label: 'CRITIQUE', color: '#D97757', bg: 'rgba(217,119,87,0.10)' };
}

function priorityColor(p) {
  const s = String(p || '').toLowerCase();
  if (s === 'high' || s.includes('critique') || s.includes('critical')) return { color: '#D97757', bg: 'rgba(217,119,87,0.08)', label: 'CRITIQUE' };
  if (s === 'medium' || s.includes('important')) return { color: '#C9861A', bg: 'rgba(201,134,26,0.08)', label: 'IMPORTANT' };
  return { color: '#10A37F', bg: 'rgba(16,163,127,0.08)', label: 'BONUS' };
}

function severityBadge(sev) {
  const s = String(sev || '').toLowerCase();
  if (s.includes('critique') || s.includes('critical')) return `<span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;background:rgba(217,119,87,0.12);color:#D97757;">CRITIQUE</span>`;
  if (s.includes('important')) return `<span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;background:rgba(201,134,26,0.12);color:#C9861A;">IMPORTANT</span>`;
  return `<span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;background:rgba(16,163,127,0.12);color:#10A37F;">MINEUR</span>`;
}

function truncUrls(urls, max = 5) {
  if (!Array.isArray(urls) || urls.length === 0) return '';
  const shown = urls.slice(0, max).map(u => esc(u));
  const extra = urls.length > max ? ` +${urls.length - max} autres` : '';
  return shown.map(u => `<div style="font-family:monospace;font-size:10px;color:#D97757;margin-bottom:2px;">${u}</div>`).join('') + (extra ? `<div style="font-family:monospace;font-size:10px;color:#8A8680;">${extra}</div>` : '');
}

// ── Shared constants ────────────────────────────────────────────────────────
const P = 'page-break-before:always;padding:52px 56px 64px;background:#fff;box-sizing:border-box;';
const LS = 'font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;';
const sLabel = (txt, color = '#D97757') => `<div style="font-family:monospace;font-size:10px;color:${color};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">${txt}</div>`;
const H1 = (txt) => `<h1 style="font-family:Georgia,serif;font-size:34px;color:#1A1916;letter-spacing:-1px;margin-bottom:28px;line-height:1.1;">${txt}</h1>`;
const H2 = (txt) => `<h2 style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-bottom:14px;">${txt}</h2>`;

// ── Context & Methodology strings (reused from one-page) ───────────────────
const CONTEXT = {
  fr: {
    label: 'Contexte 2026', h1: 'Pourquoi la visibilite IA est critique en 2026',
    intro: 'Les moteurs de recherche IA changent radicalement la facon dont les internautes trouvent l\'information. Voici les donnees cles.',
    cards: [
      { label: 'Croissance du trafic IA', value: '+527%', text: 'Le trafic refere par les IA a augmente de 527% entre janvier et mai 2025.', source: 'Previsible, 2025' },
      { label: 'Usage ChatGPT', value: '2,5 Mds', text: 'Requetes traitees par jour. 810 millions de personnes l\'utilisent.', source: 'Search Engine Land, 2026' },
      { label: 'Taux de conversion IA', value: '4,4x', text: 'Les visiteurs referes par les IA convertissent 4,4x mieux.', source: 'Semrush, 2025' },
      { label: 'SEO vs GEO', value: '80%', text: 'Des URLs citees par ChatGPT ne sont PAS dans le top 100 Google.', source: 'Ahrefs, 2025' },
      { label: 'Position du texte', value: '44,2%', text: 'Des citations IA proviennent des 30 premiers % du texte.', source: 'Growth Memo, 2026' },
      { label: 'Marche GEO', value: '33,7 Mds$', text: 'Valeur projetee du marche GEO en 2034.', source: 'eMarketer' },
    ],
    crossPlatform: 'Seulement 11% des domaines sont cites a la fois par ChatGPT ET Perplexity.',
    academic: '"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024. Certaines optimisations augmentent la visibilite IA jusqu\'a 40%.',
  },
  en: {
    label: '2026 Context', h1: 'Why AI Visibility Is Critical in 2026',
    intro: 'AI search engines are radically changing how people find information. Here are the key data points.',
    cards: [
      { label: 'AI Traffic Growth', value: '+527%', text: 'AI-referred traffic surged 527% between Jan-May 2025.', source: 'Previsible, 2025' },
      { label: 'ChatGPT Usage', value: '2.5B', text: 'Queries per day. 810 million daily users.', source: 'Search Engine Land, 2026' },
      { label: 'AI Conversion', value: '4.4x', text: 'AI-referred visitors convert 4.4x better than organic.', source: 'Semrush, 2025' },
      { label: 'SEO vs GEO', value: '80%', text: 'Of URLs cited by ChatGPT are NOT in Google top 100.', source: 'Ahrefs, 2025' },
      { label: 'Text Position', value: '44.2%', text: 'Of AI citations come from the first 30% of text.', source: 'Growth Memo, 2026' },
      { label: 'GEO Market', value: '$33.7B', text: 'Projected GEO market value by 2034.', source: 'eMarketer' },
    ],
    crossPlatform: 'Only 11% of domains are cited by both ChatGPT AND Perplexity.',
    academic: '"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024. Certain optimizations increase AI visibility by up to 40%.',
  },
};

const WHY = {
  fr: {
    extractibilite: "44,2% des citations IA proviennent des 30 premiers % du texte. Votre introduction est votre atout n1.",
    verifiabilite: "Les pages avec des donnees chiffrees sont citees 2,8x plus souvent. (AirOps, 2026)",
    autorite: "L'autorite de domaine est le predicteur n1 des citations IA avec un score SHAP de 0,63. (SE Ranking, 2025)",
    crawlabilite: "73% des sites ne sont pas crawlables par les bots IA. (Otterly.AI, 2026)",
    'donnees structurees': "Le contenu structure en chunks est cite 3 a 5x plus souvent. (Otterly.AI, 2026)",
    neutralite: "Les IA deprioritisent le contenu ouvertement promotionnel. L'etude Princeton montre que le ton doit rester factuel.",
    presence: "90% des citations IA proviennent de medias earned et owned. (Edelman, 2026)",
    fraicheur: "65% des visites de bots IA ciblent du contenu publie dans les 12 derniers mois. (Seer Interactive, 2025)",
  },
  en: {
    extractibilite: "44.2% of AI citations come from the first 30% of a page's text. Your intro is your #1 asset.",
    verifiabilite: "Pages with hard data are cited 2.8x more often. (AirOps, 2026)",
    autorite: "Domain authority is the #1 predictor of AI citations with a SHAP score of 0.63. (SE Ranking, 2025)",
    crawlabilite: "73% of websites are not crawlable by AI bots. (Otterly.AI, 2026)",
    'donnees structurees': "Structured content in chunks is cited 3-5x more often. (Otterly.AI, 2026)",
    neutralite: "AI deprioritizes overtly promotional content. The Princeton study shows tone must remain factual.",
    presence: "90% of AI citations come from earned and owned media. (Edelman, 2026)",
    fraicheur: "65% of AI bot visits target content published in the last 12 months. (Seer Interactive, 2025)",
  },
};

const CASES = {
  fr: {
    extractibilite: "SEO Vendor a obtenu 549 sessions ChatGPT en 7 mois grace a des tactiques d'extractibilite. (SEO Vendor, 2026)",
    verifiabilite: "Ahrefs genere 12,1% de ses inscriptions via le trafic IA grace a des contenus riches en donnees verifiables. (Ahrefs/Semrush, 2025)",
    autorite: "Les marques dans le top 25% des mentions web obtiennent 10x plus de visibilite IA. (Ahrefs, 2025)",
    crawlabilite: "Triangle IP a cree un fichier llms.txt : 5x plus de trafic IA. (Concurate/SE Ranking, 2025)",
    'donnees structurees': "Un site a augmente sa visibilite IA de 340% en 6 mois via schema. (Stackmatix, 2026)",
    neutralite: "La 'Fluency Optimization' ameliore significativement la visibilite IA. Le contenu educatif est cite devant le promotionnel.",
    presence: "Reddit est cite dans 46,7% des reponses Perplexity. (Profound, 2025)",
    fraicheur: "79% des pages visitees par les bots IA ont ete publiees dans les 2 dernieres annees. (Seer Interactive, 2025)",
  },
  en: {
    extractibilite: "SEO Vendor generated 549 ChatGPT sessions in 7 months through extractability tactics. (SEO Vendor, 2026)",
    verifiabilite: "Ahrefs generates 12.1% of signups via AI traffic thanks to data-rich content. (Ahrefs/Semrush, 2025)",
    autorite: "Brands in the top 25% of web mentions get 10x more AI visibility. (Ahrefs, 2025)",
    crawlabilite: "Triangle IP created an llms.txt file: 5x more AI traffic. (Concurate/SE Ranking, 2025)",
    'donnees structurees': "A website increased AI visibility by 340% in 6 months through schema. (Stackmatix, 2026)",
    neutralite: "'Fluency Optimization' significantly improves AI visibility. Educational content is cited over promotional.",
    presence: "Reddit is cited in 46.7% of Perplexity responses. (Profound, 2025)",
    fraicheur: "79% of pages visited by AI bots were published in the last 2 years. (Seer Interactive, 2025)",
  },
};

const GUIDES = {
  fr: {
    extractibilite: "Restructurez votre page pour repondre directement a la question principale des les 2 premieres phrases. Utilisez des listes a puces et des sous-titres H2/H3 descriptifs.",
    verifiabilite: "Pour chaque donnee chiffree, ajoutez un lien externe vers la source originale. Visez 5 a 10 liens externes par page.",
    autorite: "Creez une page 'A propos' detaillee. Ajoutez un schema Organization en JSON-LD. Obtenez des mentions presse.",
    crawlabilite: "Verifiez votre robots.txt : GPTBot, ClaudeBot, PerplexityBot doivent etre autorises. Ajoutez un fichier llms.txt.",
    'donnees structurees': "Implementez Organization, FAQPage, Article en JSON-LD. Validez avec le Rich Results Test.",
    neutralite: "Remplacez les superlatifs par des donnees factuelles. Ajoutez une section 'Limites'.",
    presence: "Creez un profil actif sur Reddit. Obtenez des mentions dans des articles de presse.",
    fraicheur: "Ajoutez datePublished et dateModified en schema.org. Mettez a jour vos articles existants.",
  },
  en: {
    extractibilite: "Restructure your page to directly answer the main question in the first 2 sentences. Use bullet lists and descriptive H2/H3 subheadings.",
    verifiabilite: "For every data point, add an external link to the original source. Aim for 5-10 external links per page.",
    autorite: "Create a detailed About page. Add Organization schema in JSON-LD. Get press mentions.",
    crawlabilite: "Check your robots.txt: GPTBot, ClaudeBot, PerplexityBot must be allowed. Add an llms.txt file.",
    'donnees structurees': "Implement Organization, FAQPage, Article in JSON-LD. Validate with Rich Results Test.",
    neutralite: "Replace superlatives with factual data. Add a Limitations section.",
    presence: "Create an active Reddit profile. Get mentions in press articles.",
    fraicheur: "Add datePublished and dateModified in schema.org. Update existing articles.",
  },
};

const METHODOLOGY = {
  fr: { label: 'Transparence', h1: 'Methodologie', text: 'Ce rapport est genere par analyse automatisee de chaque page via un service de scraping specialise et evaluation sur 8 criteres ponderes. Le critere Neutralite editoriale est evalue par intelligence artificielle. Le test de visibilite IA est realise par simulation de requetes. Les resultats varient selon le moteur IA et le moment du test.', academic: '"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024. Certaines optimisations augmentent la visibilite IA jusqu\'a 40%.', generated: 'Rapport genere le' },
  en: { label: 'Transparency', h1: 'Methodology', text: 'This report is generated by automated analysis of each page via a specialized scraping service and evaluation across 8 weighted criteria. The Editorial Neutrality criterion is evaluated by AI. The AI visibility test is performed by query simulation. Results vary depending on the AI engine and timing.', academic: '"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024. Certain optimizations increase AI visibility by up to 40%.', generated: 'Report generated on' },
};

function lookupWhy(criterion, locale) {
  const map = WHY[locale] || WHY.fr;
  const n = criterion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [k, v] of Object.entries(map)) { if (n.includes(k)) return v; }
  return '';
}
function lookupCases(criterion, locale) {
  const map = CASES[locale] || CASES.fr;
  const n = criterion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [k, v] of Object.entries(map)) { if (n.includes(k)) return v; }
  return '';
}
function lookupGuides(criterion, locale) {
  const map = GUIDES[locale] || GUIDES.fr;
  const n = criterion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [k, v] of Object.entries(map)) { if (n.includes(k)) return v; }
  return '';
}

// ── Reco sections renderer (same as one-page) ──────────────────────────────
function recoSections(reco) {
  if (!reco) return '';
  const fields = [
    { icon: '\u{1F50D}', title: 'Diagnostic', key: 'diagnostic' },
    { icon: '\u26A0\uFE0F', title: "Pourquoi c'est critique", key: 'whyCritical' },
    { icon: '\u2705', title: "Ce qu'il faut faire", key: 'whatToDo' },
    { icon: '\u{1F6E0}\uFE0F', title: 'Comment le faire', key: 'howToDoIt' },
    { icon: '\u{1F4A1}', title: 'Exemple concret', key: 'concreteExample' },
    { icon: '\u{1F4C8}', title: 'Impact attendu', key: 'expectedImpact' },
    { icon: '\u{1F3AF}', title: "Tip d'expert", key: 'expertTip' },
  ];
  return fields.filter(f => reco[f.key]).map(f =>
    `<div style="background:#FAFAF9;border:1px solid #ECEAE6;border-radius:9px;padding:11px 14px;margin-bottom:6px;">
      <div style="font-size:11px;font-weight:600;color:#8A8680;font-family:system-ui;margin-bottom:5px;">${f.icon} ${f.title}</div>
      <div style="font-size:13px;color:#1A1916;line-height:1.6;font-family:system-ui;">${esc(reco[f.key])}</div>
    </div>`
  ).join('');
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

function generateProReportHTML(report, locale = 'fr') {
  const { rootUrl, scoreAverage, scoreMedian, distribution, pagesValid, pagesWithError,
    executiveSummary, topStrengths, topWeaknesses, patterns, actionPlan,
    citationTestConsolidated, criteriaConsolidated, criteriaAverages, pages, consolidatedAt } = report;

  const date = new Date(consolidatedAt || Date.now()).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const totalPages = pagesValid + (pagesWithError || 0);
  const g = gradeFromScore(scoreAverage);
  const ctx = CONTEXT[locale] || CONTEXT.fr;
  const meth = METHODOLOGY[locale] || METHODOLOGY.fr;
  const beelevenUrl = locale === 'en' ? 'https://detekia.fr/en/contact' : 'https://detekia.fr/contact';

  // ── PAGE 1: COVER
  const cover = `
  <div style="background:#1A1916;min-height:100vh;padding:72px 64px;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
    <div style="position:absolute;top:-100px;right:-100px;width:400px;height:400px;border-radius:50%;background:${g.color};opacity:0.05;pointer-events:none;"></div>
    <div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;width:20px;height:20px;"><div style="background:#10A37F;border-radius:50%;"></div><div style="background:#D97757;border-radius:50%;"></div><div style="background:#4285F4;border-radius:50%;"></div><div style="background:#1C7DC4;border-radius:50%;"></div></div>
        <span style="font-family:Georgia,serif;font-size:18px;color:#F7F5F2;font-weight:bold;">Detekia</span>
      </div>
      <div style="font-family:monospace;font-size:9px;color:rgba(247,245,242,0.35);letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">RAPPORT GEO COMPLET</div>
      <div style="font-family:monospace;font-size:11px;color:#D97757;letter-spacing:2px;margin-bottom:48px;">AUDIT SITE MULTI-PAGES</div>
      <div style="font-family:Georgia,serif;font-size:96px;color:#F7F5F2;line-height:1;letter-spacing:-4px;">${scoreAverage}</div>
      <div style="font-family:monospace;font-size:11px;color:rgba(247,245,242,0.25);letter-spacing:1px;">/100 &mdash; ${totalPages} pages analysees</div>
      <div style="margin-top:18px;display:inline-block;background:${g.bg};border:1px solid ${g.color}44;padding:4px 14px;border-radius:20px;font-family:monospace;font-size:9px;letter-spacing:2px;color:${g.color};">${g.label}</div>
      <div style="margin-top:24px;font-family:monospace;font-size:12px;color:#D97757;">${esc(rootUrl)}</div>
    </div>
    <div>
      <div style="font-family:system-ui;font-size:12px;color:rgba(247,245,242,0.28);">Ce rapport est personnel et confidentiel</div>
      <div style="font-family:system-ui;font-size:11px;color:rgba(247,245,242,0.2);">Beeleven SASU &middot; hello@detekia.fr &middot; detekia.fr</div>
    </div>
  </div>`;

  // ── PAGE 2: EXECUTIVE SUMMARY
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

  const execSummary = `
  <div style="${P}">
    ${sLabel('Synthese executive')}
    ${H1("Resultats de l'analyse")}
    <div style="background:#1A1916;border-radius:16px;padding:28px 36px;margin-bottom:28px;display:flex;align-items:flex-end;gap:28px;">
      <div style="text-align:center;"><div style="font-family:Georgia,serif;font-size:72px;color:#F7F5F2;line-height:1;letter-spacing:-3px;">${scoreAverage}</div><div style="font-family:monospace;font-size:11px;color:rgba(247,245,242,0.25);">/100</div></div>
      <div style="padding-bottom:8px;flex:1;"><div style="font-family:monospace;font-size:11px;color:#D97757;margin-bottom:6px;">${esc(rootUrl)}</div><div style="font-size:14px;color:rgba(247,245,242,0.6);line-height:1.65;font-family:system-ui;">${esc((executiveSummary || '').slice(0, 200))}...</div></div>
    </div>
    ${H2('Les 8 criteres GEO')}
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <thead><tr style="background:#F7F5F2;">
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Critere</th>
        <th style="padding:9px 12px;text-align:center;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Score</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Progression</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Statut</th>
      </tr></thead>
      <tbody>${criteriaRows}</tbody>
    </table>
    <div style="font-family:system-ui;font-size:12px;color:#8A8680;font-style:italic;">La majorite des sites analyses obtient un score inferieur a 50/100.</div>
  </div>`;

  // ── PAGE 3: TOP 3 ACTIONS
  const top3Actions = (actionPlan || []).slice(0, 3).map((a, i) => {
    const pc = priorityColor(a.impact);
    return `<div style="display:flex;gap:16px;align-items:flex-start;padding:14px 16px;background:${pc.bg};border-radius:8px;margin-bottom:8px;">
      <div style="font-family:Georgia,serif;font-size:22px;color:${pc.color};line-height:1;flex-shrink:0;min-width:24px;">${i + 1}</div>
      <div style="flex:1;"><div style="font-family:system-ui;font-size:12px;font-weight:600;color:#1A1916;margin-bottom:3px;">${esc(a.action)}</div><div style="font-family:system-ui;font-size:11px;color:#8A8680;line-height:1.5;">${esc(a.criterion || '')}</div></div>
      <div style="font-family:monospace;font-size:9px;color:${pc.color};background:${pc.bg};padding:3px 9px;border-radius:12px;white-space:nowrap;flex-shrink:0;">${esc(a.impact || '')}</div>
    </div>`;
  }).join('');

  const top3Page = `
  <div style="${P}">
    ${sLabel('Synthese executive')}
    ${H1('3 actions prioritaires')}
    ${top3Actions}
  </div>`;

  // ── PAGE 4: STRENGTHS
  const strengthsHTML = (topStrengths || []).map(s => `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;"><span style="color:#10A37F;font-size:14px;flex-shrink:0;margin-top:1px;">&#10003;</span><span style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.5;">${esc(s)}</span></div>`).join('');
  const strengthsPage = `
  <div style="${P}">
    ${sLabel('Synthese executive')}
    ${H1('Points forts identifies')}
    <div style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:20px 24px;">${strengthsHTML}</div>
    ${topWeaknesses && topWeaknesses.length > 0 ? `
    ${H2('Faiblesses transverses')}
    ${topWeaknesses.map(w => `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;"><span style="color:#D97757;font-size:14px;flex-shrink:0;">&#10007;</span><span style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.5;">${esc(w)}</span></div>`).join('')}` : ''}
    ${H2('Synthese')}
    <div style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.75;white-space:pre-wrap;">${esc(executiveSummary || '')}</div>
  </div>`;

  // ── PAGE 5: BEELEVEN MINI
  const beelevenMini = `
  <div style="${P}display:flex;align-items:center;justify-content:center;padding-top:120px;padding-bottom:120px;">
    <div style="max-width:480px;text-align:center;">
      ${sLabel('Aller plus loin')}
      ${H1('Besoin d\'aide pour implementer ce plan ?')}
      <p style="font-family:system-ui;font-size:14px;color:#6B6762;line-height:1.7;margin-bottom:32px;">Beeleven, l'agence qui a cree Detekia, peut implementer les recommandations pour vous : audit approfondi, optimisations techniques, suivi mensuel.</p>
      <a href="${beelevenUrl}" style="display:inline-block;background:#D97757;color:#fff;padding:14px 36px;border-radius:10px;font-family:system-ui;font-size:15px;font-weight:700;text-decoration:none;">Discutons-en &rarr;</a>
      <div style="font-family:monospace;font-size:10px;color:#B0ABA5;margin-top:16px;">beeleven.fr &middot; hello@detekia.fr</div>
    </div>
  </div>`;

  // ── PAGE 6: CONTEXT 2026
  const contextCards = ctx.cards.map((card, i) => {
    const valueColor = i === 2 ? '#10A37F' : i === 4 ? '#C9861A' : i === 5 ? '#10A37F' : '#D97757';
    return `<div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;">
      <div style="${LS}">${card.label}</div>
      <div style="font-family:Georgia,serif;font-size:28px;color:${valueColor};line-height:1;margin-bottom:6px;">${card.value}</div>
      <p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.6;">${card.text} <span style="color:#B0ABA5;">(${card.source})</span></p>
    </div>`;
  }).join('');

  const contextPage = `
  <div style="${P}">
    ${sLabel(ctx.label)}
    ${H1(ctx.h1)}
    <p style="font-family:system-ui;font-size:13px;color:#8A8680;line-height:1.65;margin-bottom:28px;">${ctx.intro}</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px;">${contextCards}</div>
    <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;margin-bottom:20px;"><p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.7;"><strong>Seulement 11%</strong> ${ctx.crossPlatform}</p></div>
    <div style="background:#F7F5F2;border-radius:10px;padding:22px 26px;">
      <div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Source academique</div>
      <p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.65;">${ctx.academic}</p>
    </div>
  </div>`;

  // ── PAGES 7-9: CITATION TEST (30 queries)
  const ct = citationTestConsolidated || {};
  const queries = ct.queries || [];
  const citedCount = queries.filter(q => q.cited).length;

  function renderQueryCards(qs) {
    return qs.map(q => {
      const citedBadge = q.cited
        ? `<span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;background:rgba(16,163,127,0.12);color:#10A37F;">Cite</span>`
        : `<span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;background:rgba(217,119,87,0.12);color:#D97757;">Non cite</span>`;
      const typeLabel = q.type === 'generic' ? 'GENERIQUE' : q.type === 'niche' ? 'NICHE' : 'LONGUE TRAINE';
      const diffLabel = q.difficulty_to_rank ? `<span style="font-family:monospace;font-size:9px;color:#8A8680;">Difficulte : ${esc(q.difficulty_to_rank)}</span>` : '';
      return `<div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:8px;padding:16px;margin-bottom:12px;page-break-inside:avoid;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">${citedBadge}<span style="font-family:monospace;font-size:9px;color:#B0ABA5;">${typeLabel}</span>${diffLabel}</div>
        <div style="font-family:system-ui;font-size:13px;color:#1A1916;font-weight:600;margin-bottom:6px;">${esc(q.query)}</div>
        ${q.competitorsCited && q.competitorsCited.length > 0 ? `<div style="font-family:system-ui;font-size:11px;color:#8A8680;margin-bottom:4px;">Cites a votre place : ${q.competitorsCited.map(c => esc(c)).join(', ')}</div>` : ''}
        ${q.recommendation ? `<div style="font-family:system-ui;font-size:11px;color:#3A3835;line-height:1.5;margin-bottom:4px;">${esc(q.recommendation)}</div>` : ''}
        ${q.ai_response_excerpt ? `<div style="background:#F0EDE8;border-radius:6px;padding:8px 12px;font-family:monospace;font-size:10px;color:#8A8680;font-style:italic;line-height:1.5;">${esc(q.ai_response_excerpt)}</div>` : ''}
      </div>`;
    }).join('');
  }

  const genericQs = queries.filter(q => q.type === 'generic');
  const nicheQs = queries.filter(q => q.type === 'niche');
  const longTailQs = queries.filter(q => q.type === 'long_tail' || q.type === 'longtail');

  const citationPage = `
  <div style="${P}">
    ${sLabel('Test IA')}
    ${H1('Test de visibilite IA consolide')}
    <p style="font-family:system-ui;font-size:13px;color:#8A8680;margin-bottom:28px;">Nous avons simule 30 requetes utilisateur pour verifier si votre site est cite par les moteurs IA.</p>
    <div style="display:flex;gap:20px;margin-bottom:28px;">
      <div style="background:#1A1916;border-radius:14px;padding:24px 32px;text-align:center;"><div style="font-family:Georgia,serif;font-size:42px;color:#F7F5F2;">${citedCount}/${queries.length}</div><div style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.35);">requetes citent votre site</div></div>
      <div style="flex:1;">
        <div style="background:#E8F7F3;border-radius:10px;padding:14px 18px;margin-bottom:8px;"><div style="font-family:monospace;font-size:9px;color:#10A37F;margin-bottom:4px;">Meilleure opportunite :</div><div style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.5;">${esc(ct.bestOpportunity || '')}</div></div>
        <div style="background:rgba(217,119,87,0.06);border-radius:10px;padding:14px 18px;"><div style="font-family:monospace;font-size:9px;color:#D97757;margin-bottom:4px;">Blocage principal :</div><div style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.5;">${esc(ct.mainBlocker || '')}</div></div>
      </div>
    </div>
    ${genericQs.length > 0 ? `<div style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;margin:20px 0 10px;">Requetes generiques (${genericQs.length})</div>${renderQueryCards(genericQs)}` : ''}
    ${nicheQs.length > 0 ? `<div style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;margin:20px 0 10px;">Requetes niches (${nicheQs.length})</div>${renderQueryCards(nicheQs)}` : ''}
    ${longTailQs.length > 0 ? `<div style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;margin:20px 0 10px;">Requetes longue traine (${longTailQs.length})</div>${renderQueryCards(longTailQs)}` : ''}
    <div style="background:rgba(217,119,87,0.06);border-left:3px solid #D97757;border-radius:0 8px 8px 0;padding:14px 18px;margin-top:20px;"><p style="font-family:system-ui;font-size:12px;color:#3A3835;line-height:1.7;">Ce test simule des requetes utilisateur via l'IA. Il reflete la visibilite actuelle de votre marque. Les resultats peuvent varier selon le moteur IA, la formulation et le moment du test.</p></div>
  </div>`;

  // ── PAGES 10-17: 8 CRITERIA CONSOLIDATED
  const criteriaPages = (criteriaConsolidated || []).map((cc, idx) => {
    const avgData = criteriaAverages[cc.criterion] || { avgScore: 0, max: 0 };
    const cg = criterionGrade(avgData.avgScore, avgData.max);
    const pct = avgData.max > 0 ? Math.round((avgData.avgScore / avgData.max) * 100) : 0;
    const why = lookupWhy(cc.criterion, locale);
    const guide = lookupGuides(cc.criterion, locale);
    const caseStudy = lookupCases(cc.criterion, locale);
    const rec = cc.consolidatedRecommendation || {};

    const examplesHTML = (cc.concreteExamples || []).map(ex => {
      const ec = criterionGrade(ex.score, ex.max);
      return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><span style="font-family:monospace;font-size:11px;font-weight:600;color:${ec.color};">${ex.score}/${ex.max}</span><span style="font-family:monospace;font-size:10px;color:#8A8680;">${esc(ex.url)}</span></div>`;
    }).join('');

    return `
    <div style="${P}">
      <div style="margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;">Critere ${idx + 1} / 8</span>
        </div>
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:10px;gap:16px;">
          <h1 style="font-family:Georgia,serif;font-size:26px;color:#1A1916;letter-spacing:-0.5px;line-height:1.2;">${esc(cc.criterion)}</h1>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-family:Georgia,serif;font-size:38px;color:${cg.color};line-height:1;letter-spacing:-1px;">${avgData.avgScore}<span style="font-size:16px;color:#C0BBB5;">/${avgData.max}</span></div>
            <div style="font-family:monospace;font-size:9px;color:#B0ABA5;">${pct}% &mdash; moyenne site</div>
          </div>
        </div>
        <div style="height:8px;background:#E5E2DC;border-radius:4px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${cg.color};border-radius:4px;"></div></div>
      </div>
      <div style="margin-bottom:24px;">
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Ce que nous avons trouve</div>
        <div style="background:#F7F5F2;border-left:3px solid ${cg.color};padding:14px 18px;border-radius:0 6px 6px 0;font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.65;">${esc(cc.synthesis || '')}</div>
        ${examplesHTML ? `<div style="margin-top:12px;"><div style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">Exemples concrets</div>${examplesHTML}</div>` : ''}
      </div>
      ${why ? `<div style="margin-bottom:24px;"><div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Pourquoi c'est important</div><p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.75;">${esc(why)}</p></div>` : ''}
      <div style="margin-bottom:24px;">
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Recommandation consolidee</div>
        ${recoSections(rec)}
        ${rec.pagesAffected ? `<div style="margin-top:8px;">${truncUrls(rec.pagesAffected)}</div>` : ''}
      </div>
      ${guide ? `<div style="background:rgba(217,119,87,0.04);border-left:3px solid #D97757;border-radius:0 10px 10px 0;padding:18px 22px;margin-bottom:16px;"><div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Guide technique</div><p style="font-family:system-ui;font-size:13px;color:#3A3835;line-height:1.8;">${esc(guide)}</p></div>` : ''}
      ${caseStudy ? `<div style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:18px 22px;"><div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Cas reel documente</div><p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.7;">${esc(caseStudy)}</p></div>` : ''}
    </div>`;
  }).join('');

  // ── PAGES: ACTION PLAN (15 actions)
  const actionCards = (actionPlan || []).map((a, i) => {
    const pc = priorityColor(a.impact);
    return `<div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:16px 20px;margin-bottom:8px;page-break-inside:avoid;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="font-family:Georgia,serif;font-size:18px;color:${pc.color};min-width:24px;">${i + 1}</span>
        <span style="font-family:monospace;font-size:9px;color:#8A8680;">${esc(a.criterion || '')}</span>
        <span style="font-family:monospace;font-size:9px;color:${pc.color};margin-left:auto;">${esc(a.impact || '')} &middot; ${esc(a.effort || '')}</span>
      </div>
      <div style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.6;margin-bottom:6px;">${esc(a.action)}</div>
      ${truncUrls(a.pagesAffected, 3)}
    </div>`;
  }).join('');

  const actionPlanPage = `
  <div style="${P}">
    ${sLabel("Plan d'action site")}
    ${H1('Actions prioritaires consolidees')}
    <p style="font-family:system-ui;font-size:13px;color:#8A8680;margin-bottom:28px;">${(actionPlan || []).length} actions classees par priorite d'impact.</p>
    ${actionCards}
  </div>`;

  // ── PAGES: PATTERNS
  const patternsCards = (patterns || []).map(p => `
    <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:16px 20px;margin-bottom:10px;page-break-inside:avoid;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">${severityBadge(p.severity)}<span style="font-family:monospace;font-size:10px;color:#8A8680;">${esc(p.criterion || '')}</span></div>
      <div style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.6;margin-bottom:8px;">${esc(p.pattern)}</div>
      ${truncUrls(p.pagesAffected, 4)}
    </div>`).join('');

  const patternsPage = `
  <div style="${P}">
    ${sLabel('Patterns detectes')}
    ${H1('Patterns transverses identifies')}
    <p style="font-family:system-ui;font-size:13px;color:#8A8680;margin-bottom:28px;">${(patterns || []).length} patterns recurrents detectes sur l'ensemble du site.</p>
    ${patternsCards}
  </div>`;

  // ── PAGES: PER-PAGE DETAIL (2 pages per URL)
  const perPageHTML = (pages || []).map((p, idx) => {
    if (p.error) {
      return `<div style="${P}">
        ${sLabel(`Detail par page &mdash; ${idx + 1}/${pages.length}`)}
        <div style="font-family:monospace;font-size:12px;color:#D97757;margin-bottom:12px;">${esc(p.url)}</div>
        <div style="background:rgba(217,119,87,0.06);border:1px solid rgba(217,119,87,0.2);border-radius:10px;padding:20px;font-family:system-ui;font-size:13px;color:#D97757;">Cette page n'a pas pu etre analysee : ${esc(p.error)}</div>
      </div>`;
    }

    const sc = gradeFromScore(p.score || 0);
    const pageCriteria = p.criteria || [];
    const sortedCriteria = [...pageCriteria].sort((a, b) => (a.score / a.max) - (b.score / b.max));
    const weakest3 = sortedCriteria.slice(0, 3);
    const strongest3 = sortedCriteria.slice(-3).reverse();

    const criteriaBar = pageCriteria.map(c => {
      const pcg = criterionGrade(c.score, c.max);
      const ppct = c.max > 0 ? Math.round((c.score / c.max) * 100) : 0;
      return `<div style="margin-bottom:6px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span style="font-family:system-ui;font-size:11px;color:#1A1916;">${esc(c.name)}</span><span style="font-family:monospace;font-size:11px;font-weight:600;color:${pcg.color};">${c.score}/${c.max}</span></div>
        <div style="height:4px;background:#E5E2DC;border-radius:3px;overflow:hidden;"><div style="height:100%;width:${ppct}%;background:${pcg.color};border-radius:3px;"></div></div>
      </div>`;
    }).join('');

    const recos = (p.recommendations || []).slice(0, 3);
    const recosHTML = recos.map((r, ri) => {
      const rc = priorityColor(r.priority);
      return `<div style="border:1px solid ${rc.color}28;border-left:4px solid ${rc.color};border-radius:0 14px 14px 0;overflow:hidden;margin-bottom:10px;page-break-inside:avoid;">
        <div style="padding:12px 20px 10px;border-bottom:1px solid #F0EDE8;display:flex;align-items:center;gap:10px;">
          <span style="font-family:monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;padding:3px 9px;border-radius:6px;background:${rc.bg};color:${rc.color};">${rc.label}</span>
          ${r.criterion ? `<span style="font-size:11px;color:#8A8680;font-family:monospace;">${esc(r.criterion)}</span>` : ''}
          <span style="margin-left:auto;font-family:monospace;font-size:10px;color:#C2BDB8;">#${String(ri + 1).padStart(2, '0')}</span>
        </div>
        <div style="padding:12px 20px;">${recoSections(r)}</div>
      </div>`;
    }).join('');

    return `
    <div style="${P}">
      ${sLabel(`Detail par page &mdash; ${idx + 1}/${pages.length}`)}
      <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:16px;gap:16px;">
        <div style="flex:1;"><div style="font-family:monospace;font-size:12px;color:#D97757;margin-bottom:6px;word-break:break-all;">${esc(p.url)}</div>${p.verdict ? `<div style="font-family:system-ui;font-size:13px;color:#8A8680;line-height:1.5;">${esc(p.verdict)}</div>` : ''}</div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-family:Georgia,serif;font-size:42px;color:${sc.color};line-height:1;letter-spacing:-1px;">${p.score ?? '?'}<span style="font-size:14px;color:#C0BBB5;">/100</span></div>
          <div style="display:inline-block;margin-top:6px;padding:3px 12px;border-radius:20px;font-family:monospace;font-size:9px;letter-spacing:2px;background:${sc.bg};color:${sc.color};">${sc.label}</div>
        </div>
      </div>
      ${criteriaBar}
      ${p.topPriority ? `<div style="background:rgba(217,119,87,0.06);border-left:3px solid #D97757;border-radius:0 8px 8px 0;padding:12px 16px;margin:16px 0;font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.5;"><strong>Priorite :</strong> ${esc(p.topPriority)}</div>` : ''}
      ${recos.length > 0 ? `<div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin:20px 0 10px;">Top ${recos.length} recommandations</div>${recosHTML}` : ''}
    </div>`;
  }).join('');

  // ── PAGE: METHODOLOGY
  const methodologyPage = `
  <div style="${P}">
    ${sLabel(meth.label)}
    ${H1(meth.h1)}
    <div style="background:rgba(217,119,87,0.06);border-left:3px solid #D97757;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;"><p style="font-family:system-ui;font-size:12px;color:#3A3835;line-height:1.7;">${meth.text}</p></div>
    <div style="background:#F7F5F2;border-radius:10px;padding:22px 26px;margin-bottom:32px;">
      <div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Source academique</div>
      <p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.65;">${meth.academic}</p>
    </div>
    <div style="text-align:center;padding-top:20px;">
      <div style="font-family:monospace;font-size:10px;color:#B0ABA5;">${meth.generated} ${date} &middot; detekia.fr</div>
    </div>
  </div>`;

  // ── PAGE: BEELEVEN FULL
  const beelevenFull = `
  <div style="${P}display:flex;align-items:center;justify-content:center;padding-top:120px;padding-bottom:120px;">
    <div style="max-width:480px;text-align:center;">
      ${sLabel('Aller plus loin')}
      ${H1('Aller plus loin avec Beeleven')}
      <p style="font-family:system-ui;font-size:14px;color:#6B6762;line-height:1.7;margin-bottom:32px;">Vous avez le diagnostic complet de votre site. Beeleven, l'agence qui a cree Detekia, peut implementer les recommandations pour vous : audit approfondi, optimisations techniques, suivi mensuel des resultats.</p>
      <a href="${beelevenUrl}" style="display:inline-block;background:#D97757;color:#fff;padding:14px 36px;border-radius:10px;font-family:system-ui;font-size:15px;font-weight:700;text-decoration:none;">Discutons-en &rarr;</a>
      <div style="font-family:monospace;font-size:10px;color:#B0ABA5;margin-top:16px;">beeleven.fr &middot; hello@detekia.fr</div>
    </div>
  </div>`;

  // ── ASSEMBLE
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8">
<title>Rapport GEO Complet &mdash; ${esc(rootUrl)}</title>
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  h1, h2, h3 { page-break-after: avoid; break-after: avoid; }
  p { orphans: 3; widows: 3; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  img { page-break-inside: avoid; break-inside: avoid; }
</style>
</head>
<body>
${cover}
${execSummary}
${top3Page}
${strengthsPage}
${beelevenMini}
${contextPage}
${citationPage}
${criteriaPages}
${actionPlanPage}
${patternsPage}
${perPageHTML}
${methodologyPage}
${beelevenFull}
</body>
</html>`;
}

module.exports = { generateProReportHTML, PRO_STRINGS: { fr: {}, en: {} } };
