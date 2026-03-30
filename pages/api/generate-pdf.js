import { Resend } from 'resend';

export const config = { maxDuration: 30 };

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function grade(score) {
  if (score >= 70) return { label: 'BON',    color: '#10A37F', bg: 'rgba(16,163,127,0.12)',  border: 'rgba(16,163,127,0.3)'  };
  if (score >= 45) return { label: 'MOYEN',  color: '#C9861A', bg: 'rgba(201,134,26,0.12)',  border: 'rgba(201,134,26,0.3)'  };
  return              { label: 'FAIBLE', color: '#D97757', bg: 'rgba(217,119,87,0.12)',  border: 'rgba(217,119,87,0.3)'  };
}

function criterionGrade(score, max) {
  const pct = score / max;
  if (pct >= 0.75) return { label: 'BON',       color: '#10A37F', bg: 'rgba(16,163,127,0.10)' };
  if (pct >= 0.45) return { label: 'IMPORTANT', color: '#C9861A', bg: 'rgba(201,134,26,0.10)' };
  return              { label: 'CRITIQUE',  color: '#D97757', bg: 'rgba(217,119,87,0.10)' };
}

function criterionGroup(name) {
  if (/extractibilité|données structurées|crawlabilité/i.test(name)) return 'Lisibilité IA';
  if (/vérifiabilité|autorité|neutralité/i.test(name))               return 'Crédibilité';
  if (/présence|fraîcheur/i.test(name))                              return 'Fraîcheur';
  return 'Optimisation';
}

function matchReco(recs, criterionName) {
  if (!recs?.length) return null;
  const name = criterionName.toLowerCase();
  return (
    recs.find(r => r.criterion && name.includes(r.criterion.toLowerCase())) ||
    recs.find(r => r.criterion && r.criterion.toLowerCase().split(/[\s&]/)[0].trim().length > 3 &&
                   name.includes(r.criterion.toLowerCase().split(/[\s&]/)[0].trim())) ||
    null
  );
}

function delayLabel(p) {
  return p === 'high' ? '1–2 sem.' : p === 'medium' ? '1 mois' : '2–3 mois';
}

function impactLabel(p) {
  return p === 'high' ? 'Élevé' : p === 'medium' ? 'Moyen' : 'Faible';
}

function projectedScore(currentScore, criteria) {
  let gain = 0;
  criteria.forEach(c => {
    if (c.score / c.max < 0.75) gain += Math.round(c.max * 0.8 - c.score);
  });
  return Math.min(100, currentScore + Math.round(gain * 0.7));
}

// ─── Evidence blocks per criterion ───────────────────────────────────────────

function evidenceBlock(criterionName, evidence) {
  if (!evidence) return '';
  const name = criterionName.toLowerCase();

  const blockStyle  = 'background:#F7F5F2;border-left:3px solid #E5E2DC;padding:14px 18px;border-radius:0 6px 6px 0;margin:10px 0;';
  const labelStyle  = 'font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;';
  const codeStyle   = 'background:#1A1916;color:#F7F5F2;border-radius:8px;padding:16px;font-family:monospace;font-size:11px;line-height:1.6;white-space:pre-wrap;word-break:break-all;margin:10px 0;';
  const valStyle    = 'font-family:monospace;font-size:12px;color:#1A1916;line-height:1.6;';

  // ── Extractibilité
  if (/extractibilité/i.test(name)) {
    const introBlock = evidence.intro
      ? `<div style="${blockStyle}"><div style="${labelStyle}">Extrait analysé — 300 premiers caractères du site</div><div style="${valStyle}">${esc(evidence.intro)}</div></div>`
      : '';

    const headingsRows = (evidence.headings || []).slice(0, 20).map(h =>
      `<tr>
        <td style="padding:5px 10px;font-family:monospace;font-size:10px;color:#D97757;text-transform:uppercase;white-space:nowrap;border-bottom:1px solid #F0EDE8;">${esc(h.level)}</td>
        <td style="padding:5px 10px;font-family:system-ui;font-size:11px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${esc(h.text)}</td>
      </tr>`
    ).join('');

    const headingsBlock = headingsRows
      ? `<div style="${labelStyle};margin-top:14px;">Structure H1/H2/H3 détectée</div>
         <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:6px;overflow:hidden;">
           <thead><tr style="background:#F7F5F2;">
             <th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">Niveau</th>
             <th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">Texte</th>
           </tr></thead>
           <tbody>${headingsRows}</tbody>
         </table>`
      : `<div style="${blockStyle}"><div style="${valStyle}">Aucun titre H1/H2/H3 détecté</div></div>`;

    const wcBlock = evidence.wordCount != null
      ? `<div style="font-family:system-ui;font-size:12px;color:#8A8680;margin-top:10px;">Nombre de mots : <strong style="color:#1A1916;">${evidence.wordCount}</strong></div>`
      : '';

    return introBlock + headingsBlock + wcBlock;
  }

  // ── Vérifiabilité
  if (/vérifiabilité/i.test(name)) {
    const extBlock = evidence.externalLinks != null
      ? `<div style="${blockStyle}"><div style="${labelStyle}">Liens sortants vers sources externes</div><div style="${valStyle}">${evidence.externalLinks} lien(s) externe(s) détecté(s)</div></div>`
      : '';

    const datesEntries = Object.entries(evidence.dates || {})
      .map(([k, v]) => `<div style="font-size:12px;margin-bottom:4px;font-family:system-ui;"><span style="color:#8A8680;">${esc(k)} :</span> <strong style="color:#1A1916;">${esc(v)}</strong></div>`)
      .join('');
    const datesBlock = `<div style="${blockStyle}"><div style="${labelStyle}">Dates détectées dans le contenu</div>${datesEntries || '<div style="font-family:system-ui;font-size:12px;color:#D97757;">Aucune date détectée</div>'}</div>`;

    return extBlock + datesBlock;
  }

  // ── Autorité
  if (/autorité/i.test(name)) {
    const titleBlock = `<div style="${blockStyle}"><div style="${labelStyle}">Balise &lt;title&gt;</div><div style="${valStyle}">${esc(evidence.metaTitle) || '<span style="color:#D97757;">Non définie</span>'}</div></div>`;
    const descBlock  = `<div style="${blockStyle}"><div style="${labelStyle}">Meta description</div><div style="${valStyle}">${esc(evidence.metaDescription) || '<span style="color:#D97757;">Non définie</span>'}</div></div>`;

    const socialRows = (evidence.socialLinks || [])
      .map(l => `<div style="font-size:11px;font-family:monospace;color:#4285F4;margin-bottom:4px;word-break:break-all;">${esc(l)}</div>`)
      .join('');
    const socialBlock = `<div style="${blockStyle}"><div style="${labelStyle}">Réseaux sociaux détectés</div>${socialRows || '<div style="font-family:system-ui;font-size:12px;color:#D97757;">Aucun lien vers réseaux sociaux</div>'}</div>`;

    return titleBlock + descBlock + socialBlock;
  }

  // ── Crawlabilité
  if (/crawlabilité/i.test(name)) {
    const robotsContent = evidence.robotsTxt && evidence.robotsTxt !== 'Non accessible'
      ? `<div style="${codeStyle}">${esc(evidence.robotsTxt)}</div>`
      : `<div style="${blockStyle}"><div style="${valStyle}">Non accessible</div></div>`;
    const robotsBlock = `<div style="${labelStyle}">Contenu de robots.txt</div>${robotsContent}`;

    const llmsColor = evidence.hasLlmsTxt ? '#10A37F' : '#D97757';
    const llmsBlock = `<div style="${blockStyle}"><div style="${labelStyle}">Fichier llms.txt</div>
      <div style="font-family:system-ui;font-size:13px;font-weight:600;color:${llmsColor};">${evidence.hasLlmsTxt ? '✓ Présent' : '✗ Absent'}</div></div>`;

    return robotsBlock + llmsBlock;
  }

  // ── Données structurées
  if (/données structurées/i.test(name)) {
    if (!evidence.schemas?.length) {
      return `<div style="${blockStyle}"><div style="${labelStyle}">Schemas JSON-LD détectés</div>
        <div style="font-family:system-ui;font-size:13px;font-weight:600;color:#D97757;">Aucun schema JSON-LD détecté</div></div>`;
    }
    const schemaRows = evidence.schemas.map(s =>
      `<tr>
        <td style="padding:8px 10px;font-family:monospace;font-size:11px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${esc(s.type)}</td>
        <td style="padding:8px 10px;font-family:system-ui;font-size:11px;color:#8A8680;border-bottom:1px solid #F0EDE8;">${(s.properties || []).join(', ')}</td>
      </tr>`
    ).join('');
    return `<div style="${labelStyle}">Schemas JSON-LD détectés</div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:6px;overflow:hidden;">
        <thead><tr style="background:#F7F5F2;">
          <th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">Type</th>
          <th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">Propriétés</th>
        </tr></thead>
        <tbody>${schemaRows}</tbody>
      </table>`;
  }

  // ── Présence externe
  if (/présence/i.test(name)) {
    const socialRows = (evidence.socialLinks || [])
      .map(l => `<div style="font-size:11px;font-family:monospace;color:#4285F4;margin-bottom:4px;word-break:break-all;">${esc(l)}</div>`)
      .join('');
    return `<div style="${blockStyle}"><div style="${labelStyle}">Réseaux sociaux détectés</div>${socialRows || '<div style="font-family:system-ui;font-size:12px;color:#D97757;">Aucun lien vers réseaux sociaux détecté</div>'}</div>`;
  }

  // ── Fraîcheur
  if (/fraîcheur/i.test(name)) {
    const datesEntries = Object.entries(evidence.dates || {})
      .map(([k, v]) => `<div style="font-size:12px;margin-bottom:4px;font-family:system-ui;"><span style="color:#8A8680;">${esc(k)} :</span> <strong style="color:#1A1916;">${esc(v)}</strong></div>`)
      .join('');
    return `<div style="${blockStyle}"><div style="${labelStyle}">Dates détectées dans le contenu</div>${datesEntries || '<div style="font-family:system-ui;font-size:12px;color:#D97757;">Aucune date détectée</div>'}</div>`;
  }

  return '';
}

// ─── Recommendation sections ──────────────────────────────────────────────────

function recoSections(reco) {
  if (!reco) {
    return `<div style="background:rgba(16,163,127,0.06);border:1px solid rgba(16,163,127,0.2);border-radius:8px;padding:16px 20px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;">✓</span>
      <span style="font-family:system-ui;font-size:13px;color:#10A37F;font-weight:500;">Ce critère est bien optimisé. Continuez à maintenir ce niveau.</span>
    </div>`;
  }

  const ALL = [
    { icon: '🔍', title: 'Diagnostic',              content: reco.diagnostic,      key: 'diagnostic'      },
    { icon: '⚠️', title: "Pourquoi c'est critique", content: reco.whyCritical,     key: 'whyCritical'     },
    { icon: '✅', title: "Ce qu'il faut faire",     content: reco.whatToDo,        key: 'whatToDo'        },
    { icon: '🛠️', title: 'Comment le faire',        content: reco.howToDoIt,       key: 'howToDoIt'       },
    { icon: '💡', title: 'Exemple concret',         content: reco.concreteExample, key: 'concreteExample' },
    { icon: '📈', title: 'Impact attendu',          content: reco.expectedImpact,  key: 'expectedImpact'  },
    { icon: '🎯', title: "Tip d'expert",            content: reco.expertTip,       key: 'expertTip'       },
  ];

  const KEYS = {
    high:   ['diagnostic', 'whyCritical', 'whatToDo', 'howToDoIt', 'concreteExample', 'expectedImpact', 'expertTip'],
    medium: ['diagnostic', 'whyCritical', 'whatToDo', 'howToDoIt', 'expectedImpact'],
    low:    ['diagnostic', 'whatToDo', 'expectedImpact'],
  };

  return ALL
    .filter(s => (KEYS[reco.priority] || KEYS.medium).includes(s.key) && s.content)
    .map(s => `
      <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:8px;padding:13px 16px;margin-bottom:8px;">
        <div style="font-family:system-ui;font-size:11px;font-weight:600;color:#1A1916;margin-bottom:5px;">${s.icon} ${s.title}</div>
        <div style="font-family:system-ui;font-size:13px;color:#3A3835;line-height:1.65;">${esc(s.content)}</div>
      </div>`)
    .join('');
}

// ─── Main HTML generator ──────────────────────────────────────────────────────

function generateReportHTML(data) {
  const { url, score, verdict, strengths = [], topPriority, criteria = [], recommendations = [], evidence } = data;
  const g        = grade(score);
  const date     = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const projected = projectedScore(score, criteria);
  const noEvidence = !evidence;

  // ── COVER PAGE ──────────────────────────────────────────────────────────────
  const cover = `
  <div style="background:#1A1916;min-height:100vh;padding:72px 64px;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
    <div style="position:absolute;top:-100px;right:-100px;width:400px;height:400px;border-radius:50%;background:${g.color};opacity:0.05;pointer-events:none;"></div>
    <div style="position:absolute;bottom:-80px;left:-60px;width:280px;height:280px;border-radius:50%;background:${g.color};opacity:0.04;pointer-events:none;"></div>

    <!-- Logo + meta -->
    <div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;width:20px;height:20px;">
          <div style="background:#10A37F;border-radius:50%;"></div>
          <div style="background:#D97757;border-radius:50%;"></div>
          <div style="background:#4285F4;border-radius:50%;"></div>
          <div style="background:#1C7DC4;border-radius:50%;"></div>
        </div>
        <span style="font-family:Georgia,serif;font-size:22px;color:#F7F5F2;font-weight:400;">Detekia</span>
      </div>
      <div style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.3);letter-spacing:3px;text-transform:uppercase;">Rapport GEO Complet · ${date}</div>
    </div>

    <!-- Score central -->
    <div>
      <div style="font-family:Georgia,serif;font-size:136px;line-height:1;color:#F7F5F2;letter-spacing:-6px;margin-bottom:4px;">${score}</div>
      <div style="font-family:monospace;font-size:16px;color:rgba(247,245,242,0.22);margin-bottom:24px;">/100</div>
      <div style="display:inline-block;background:${g.bg};border:1px solid ${g.border};padding:6px 18px;border-radius:24px;margin-bottom:18px;">
        <span style="font-family:monospace;font-size:11px;letter-spacing:2px;color:${g.color};text-transform:uppercase;">${g.label}</span>
      </div>
      <div style="font-family:Georgia,serif;font-size:34px;color:#F7F5F2;line-height:1.2;max-width:620px;margin-bottom:18px;">
        ${g.label === 'BON' ? 'Excellente citabilité IA' : g.label === 'MOYEN' ? 'Citabilité IA à améliorer' : 'Citabilité IA insuffisante'}
      </div>
      <div style="font-family:monospace;font-size:13px;color:#D97757;">${esc(url)}</div>
    </div>

    <!-- Footer cover -->
    <div style="border-top:1px solid rgba(247,245,242,0.08);padding-top:22px;display:flex;justify-content:space-between;align-items:center;">
      <div style="font-family:system-ui;font-size:12px;color:rgba(247,245,242,0.28);">Ce rapport est personnel et confidentiel</div>
      <div style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.18);">detekia.fr</div>
    </div>
  </div>`;

  // ── EXECUTIVE SUMMARY ───────────────────────────────────────────────────────
  const criteriaTableRows = criteria.map(c => {
    const pct = Math.round((c.score / c.max) * 100);
    const cg  = criterionGrade(c.score, c.max);
    return `<tr>
      <td style="padding:10px 12px;font-family:system-ui;font-size:12px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${esc(c.name)}</td>
      <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #F0EDE8;">
        <span style="font-family:monospace;font-size:12px;font-weight:600;color:${cg.color};">${c.score}/${c.max}</span>
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #F0EDE8;width:120px;">
        <div style="height:6px;background:#E5E2DC;border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:${cg.color};border-radius:3px;"></div>
        </div>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EDE8;">
        <span style="display:inline-block;padding:2px 9px;border-radius:12px;font-family:monospace;font-size:9px;letter-spacing:1px;background:${cg.bg};color:${cg.color};">${cg.label}</span>
      </td>
    </tr>`;
  }).join('');

  const sortedRecos = [...recommendations].sort((a, b) => {
    const p = { high: 0, medium: 1, low: 2 };
    return (p[a.priority] ?? 1) - (p[b.priority] ?? 1);
  });

  const top3HTML = sortedRecos.slice(0, 3).map((r, i) => {
    const rc = r.priority === 'high' ? { color: '#D97757', bg: 'rgba(217,119,87,0.07)' }
             : r.priority === 'medium' ? { color: '#C9861A', bg: 'rgba(201,134,26,0.07)' }
             : { color: '#10A37F', bg: 'rgba(16,163,127,0.07)' };
    return `<div style="display:flex;gap:16px;align-items:flex-start;padding:14px 16px;background:${rc.bg};border-radius:8px;margin-bottom:8px;">
      <div style="font-family:Georgia,serif;font-size:22px;color:${rc.color};line-height:1;flex-shrink:0;min-width:24px;">${i + 1}</div>
      <div style="flex:1;">
        <div style="font-family:system-ui;font-size:12px;font-weight:600;color:#1A1916;margin-bottom:3px;">${esc(r.title || r.criterion || '')}</div>
        <div style="font-family:system-ui;font-size:11px;color:#8A8680;line-height:1.5;">${esc(r.whatToDo || r.diagnostic || '')}</div>
      </div>
      <div style="font-family:monospace;font-size:9px;color:${rc.color};background:${rc.bg};padding:3px 9px;border-radius:12px;white-space:nowrap;flex-shrink:0;border:1px solid ${rc.color}33;">${impactLabel(r.priority)}</div>
    </div>`;
  }).join('');

  const strengthsHTML = (strengths || []).map(s =>
    `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;">
      <span style="color:#10A37F;font-size:14px;flex-shrink:0;margin-top:1px;">✓</span>
      <span style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.5;">${esc(s)}</span>
    </div>`
  ).join('') || '<div style="font-family:system-ui;font-size:13px;color:#8A8680;">—</div>';

  const execSummary = `
  <div style="page-break-before:always;padding:60px 56px 64px;background:#fff;min-height:100vh;box-sizing:border-box;">
    <div style="font-family:monospace;font-size:10px;color:#D97757;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">Synthèse exécutive</div>
    <h1 style="font-family:Georgia,serif;font-size:34px;color:#1A1916;letter-spacing:-1px;margin-bottom:28px;line-height:1.1;">Résultats de l'analyse</h1>

    <!-- Verdict -->
    <div style="background:#1A1916;border-radius:12px;padding:24px 28px;margin-bottom:36px;display:flex;align-items:center;gap:24px;">
      <div style="flex-shrink:0;">
        <div style="font-family:Georgia,serif;font-size:52px;color:#F7F5F2;line-height:1;letter-spacing:-2px;">${score}</div>
        <div style="font-family:monospace;font-size:11px;color:rgba(247,245,242,0.28);">/100</div>
      </div>
      <div style="width:1px;height:60px;background:rgba(247,245,242,0.1);flex-shrink:0;"></div>
      <div>
        <div style="font-family:system-ui;font-size:13px;color:rgba(247,245,242,0.65);line-height:1.7;max-width:460px;">${esc(verdict)}</div>
        <div style="font-family:system-ui;font-size:11px;color:rgba(247,245,242,0.28);margin-top:8px;">La majorité des sites analysés obtient un score inférieur à 50/100.</div>
      </div>
    </div>

    <!-- Criteria table -->
    <h2 style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-bottom:14px;">Les 8 critères GEO</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:10px;overflow:hidden;margin-bottom:36px;">
      <thead>
        <tr style="background:#F7F5F2;">
          <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Critère</th>
          <th style="padding:9px 12px;text-align:center;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Score</th>
          <th style="padding:9px 12px;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;width:120px;">Progression</th>
          <th style="padding:9px 12px;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Statut</th>
        </tr>
      </thead>
      <tbody>${criteriaTableRows}</tbody>
    </table>

    <!-- Top 3 actions -->
    <h2 style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-bottom:14px;">3 actions prioritaires</h2>
    ${top3HTML}

    <!-- Strengths -->
    <h2 style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-top:28px;margin-bottom:14px;">Points forts identifiés</h2>
    <div style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:20px 24px;">
      ${strengthsHTML}
    </div>

    ${noEvidence ? `<div style="background:#FFF8ED;border:1px solid rgba(201,134,26,0.25);border-radius:8px;padding:14px 18px;margin-top:28px;font-family:system-ui;font-size:12px;color:#C9861A;line-height:1.5;">⚠️ Données détaillées non disponibles pour ce scan. Relancez l'analyse pour un rapport enrichi.</div>` : ''}
  </div>`;

  // ── CRITERIA PAGES (8 pages) ─────────────────────────────────────────────────
  const criteriaPages = criteria.map((c, idx) => {
    const cg   = criterionGrade(c.score, c.max);
    const group = criterionGroup(c.name);
    const pct  = Math.round((c.score / c.max) * 100);
    const reco = matchReco(recommendations, c.name);
    const ev   = evidenceBlock(c.name, evidence);

    const recoMeta = reco
      ? `<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
           <span style="display:inline-block;padding:4px 12px;border-radius:20px;font-family:monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;background:${cg.bg};color:${cg.color};">${cg.label}</span>
           <span style="font-family:system-ui;font-size:12px;color:#8A8680;">${impactLabel(reco.priority)} impact · ${delayLabel(reco.priority)}</span>
         </div>`
      : '';

    return `
    <div style="page-break-before:always;padding:52px 56px 64px;background:#fff;box-sizing:border-box;">

      <!-- Criterion header -->
      <div style="margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;">${group}</span>
          <span style="font-family:monospace;font-size:9px;color:#D5D2CE;">·</span>
          <span style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;">Critère ${idx + 1} / 8</span>
        </div>
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:10px;gap:16px;">
          <h1 style="font-family:Georgia,serif;font-size:26px;color:#1A1916;letter-spacing:-0.5px;line-height:1.2;">${esc(c.name)}</h1>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-family:Georgia,serif;font-size:38px;color:${cg.color};line-height:1;letter-spacing:-1px;">${c.score}<span style="font-size:16px;color:#C0BBB5;font-weight:400;">/${c.max}</span></div>
            <div style="font-family:monospace;font-size:9px;color:#B0ABA5;">${pct}%</div>
          </div>
        </div>
        <div style="height:8px;background:#E5E2DC;border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:${cg.color};border-radius:4px;"></div>
        </div>
      </div>

      <!-- Diagnostic -->
      <div style="margin-bottom:24px;">
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Diagnostic</div>
        <div style="background:#F7F5F2;border-left:3px solid ${cg.color};padding:14px 18px;border-radius:0 6px 6px 0;font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.65;">${esc(c.detail)}</div>
        ${ev}
      </div>

      <!-- Recommendation -->
      <div>
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Recommandation</div>
        ${recoMeta}
        ${reco ? `<div style="font-family:Georgia,serif;font-size:16px;color:${cg.color};margin-bottom:14px;font-weight:bold;">${esc(reco.title || '')}</div>` : ''}
        ${recoSections(reco)}
      </div>
    </div>`;
  }).join('');

  // ── ACTION PLAN ──────────────────────────────────────────────────────────────
  const actionRows = sortedRecos.map((r, i) => {
    const rc = r.priority === 'high'   ? { color: '#D97757', bg: 'rgba(217,119,87,0.08)',  label: 'CRITIQUE'  }
             : r.priority === 'medium' ? { color: '#C9861A', bg: 'rgba(201,134,26,0.08)',  label: 'IMPORTANT' }
             :                           { color: '#10A37F', bg: 'rgba(16,163,127,0.08)',  label: 'BONUS'     };
    return `<tr>
      <td style="padding:9px 12px;font-family:monospace;font-size:11px;color:#B0ABA5;border-bottom:1px solid #F0EDE8;white-space:nowrap;">${i + 1}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #F0EDE8;white-space:nowrap;">
        <span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;background:${rc.bg};color:${rc.color};">${rc.label}</span>
      </td>
      <td style="padding:9px 12px;border-bottom:1px solid #F0EDE8;">
        <div style="font-family:system-ui;font-size:12px;font-weight:600;color:#1A1916;margin-bottom:2px;">${esc(r.title || '')}</div>
        <div style="font-family:system-ui;font-size:11px;color:#8A8680;">${esc(r.whatToDo || '')}</div>
      </td>
      <td style="padding:9px 12px;font-family:system-ui;font-size:11px;color:#8A8680;border-bottom:1px solid #F0EDE8;">${esc(r.criterion || '')}</td>
      <td style="padding:9px 12px;font-family:system-ui;font-size:11px;color:${rc.color};font-weight:600;border-bottom:1px solid #F0EDE8;white-space:nowrap;">${impactLabel(r.priority)}</td>
      <td style="padding:9px 12px;font-family:monospace;font-size:11px;color:#8A8680;border-bottom:1px solid #F0EDE8;white-space:nowrap;">${delayLabel(r.priority)}</td>
    </tr>`;
  }).join('');

  const actionPlan = `
  <div style="page-break-before:always;padding:60px 56px 64px;background:#fff;min-height:100vh;box-sizing:border-box;">
    <div style="font-family:monospace;font-size:10px;color:#D97757;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">Plan d'action</div>
    <h1 style="font-family:Georgia,serif;font-size:34px;color:#1A1916;letter-spacing:-1px;margin-bottom:8px;line-height:1.1;">Récapitulatif des actions</h1>
    <p style="font-family:system-ui;font-size:13px;color:#8A8680;margin-bottom:36px;line-height:1.6;">${recommendations.length} recommandations classées par priorité d'impact.</p>

    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:10px;overflow:hidden;margin-bottom:44px;">
      <thead>
        <tr style="background:#F7F5F2;">
          <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">#</th>
          <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Priorité</th>
          <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Action</th>
          <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Critère</th>
          <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Impact</th>
          <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Délai</th>
        </tr>
      </thead>
      <tbody>${actionRows}</tbody>
    </table>

    <!-- Score projection -->
    <div style="background:#1A1916;border-radius:14px;padding:30px 36px;display:flex;align-items:center;gap:32px;">
      <div style="text-align:center;flex-shrink:0;">
        <div style="font-family:monospace;font-size:9px;color:rgba(247,245,242,0.35);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Score actuel</div>
        <div style="font-family:Georgia,serif;font-size:52px;color:#F7F5F2;line-height:1;letter-spacing:-2px;">${score}</div>
        <div style="font-family:monospace;font-size:11px;color:rgba(247,245,242,0.25);">/100</div>
      </div>
      <div style="font-family:Georgia,serif;font-size:28px;color:rgba(247,245,242,0.18);flex-shrink:0;">→</div>
      <div style="text-align:center;flex-shrink:0;">
        <div style="font-family:monospace;font-size:9px;color:rgba(247,245,242,0.35);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Score projeté</div>
        <div style="font-family:Georgia,serif;font-size:52px;color:#10A37F;line-height:1;letter-spacing:-2px;">${projected}</div>
        <div style="font-family:monospace;font-size:11px;color:rgba(247,245,242,0.25);">/100</div>
      </div>
      <div style="flex:1;padding-left:28px;border-left:1px solid rgba(247,245,242,0.1);">
        <div style="font-family:system-ui;font-size:13px;color:rgba(247,245,242,0.55);line-height:1.7;">Si toutes les recommandations sont implémentées, votre score devrait passer de <strong style="color:#F7F5F2;">${score}/100</strong> à environ <strong style="color:#10A37F;">${projected}/100</strong>.</div>
      </div>
    </div>
  </div>`;

  // ── METHODOLOGY ──────────────────────────────────────────────────────────────
  const methodoCriteria = [
    { name: 'Extractibilité & réponse directe', weight: '25 pts', measured: 'Longueur intro, structure H2/H3, listes, tableaux, calibrage des paragraphes' },
    { name: 'Vérifiabilité & preuves',          weight: '20 pts', measured: 'Données chiffrées, liens externes sourcés, dates, tableaux, citations' },
    { name: 'Autorité & E-E-A-T',               weight: '15 pts', measured: 'Page auteur, biographie, À propos, contact, mentions légales, schema Organization' },
    { name: 'Crawlabilité IA',                  weight: '15 pts', measured: 'Longueur contenu, lang, canonical, indexabilité, sitemap, bots IA autorisés' },
    { name: 'Données structurées',              weight: '10 pts', measured: 'Présence et types de schemas JSON-LD (FAQPage, Article, HowTo, Organization…)' },
    { name: 'Neutralité éditoriale',            weight: '10 pts', measured: 'Évalué par IA (Claude) — superlatifs, ton promotionnel, honnêteté sur les limites' },
    { name: 'Présence externe',                 weight: '5 pts',  measured: 'Mentions presse, liens réseaux sociaux, témoignages tiers détectés dans la page' },
    { name: 'Fraîcheur & maintenance',          weight: '5 pts',  measured: 'dateModified schema, années récentes dans le contenu, copyright à jour' },
  ];

  const methodoRows = methodoCriteria.map(c => `
    <tr>
      <td style="padding:10px 12px;font-family:system-ui;font-size:12px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${c.name}</td>
      <td style="padding:10px 12px;text-align:center;font-family:monospace;font-size:12px;font-weight:600;color:#D97757;border-bottom:1px solid #F0EDE8;white-space:nowrap;">${c.weight}</td>
      <td style="padding:10px 12px;font-family:system-ui;font-size:11px;color:#8A8680;border-bottom:1px solid #F0EDE8;line-height:1.55;">${c.measured}</td>
    </tr>`).join('');

  const methodology = `
  <div style="page-break-before:always;padding:60px 56px 64px;background:#fff;min-height:100vh;box-sizing:border-box;">
    <div style="font-family:monospace;font-size:10px;color:#D97757;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">Transparence</div>
    <h1 style="font-family:Georgia,serif;font-size:34px;color:#1A1916;letter-spacing:-1px;margin-bottom:28px;line-height:1.1;">Méthodologie</h1>

    <div style="background:#F7F5F2;border-radius:10px;padding:22px 26px;margin-bottom:32px;">
      <p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.75;margin-bottom:10px;">Ce rapport est généré par analyse automatisée du DOM de votre page via <strong>Jina AI</strong> (scraping HTML) et évaluation sur <strong>8 critères pondérés</strong>.</p>
      <p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.75;margin-bottom:10px;">Le critère <strong>Neutralité éditoriale</strong> est évalué par intelligence artificielle (Claude Haiku, Anthropic). Les 7 autres critères sont évalués par analyse technique du HTML.</p>
      <p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.75;">Les recommandations sont personnalisées — seuls les critères en dessous de 80% de leur score maximum donnent lieu à une recommandation.</p>
    </div>

    <h2 style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-bottom:14px;">Les 8 critères et leur pondération</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:10px;overflow:hidden;margin-bottom:32px;">
      <thead>
        <tr style="background:#F7F5F2;">
          <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Critère</th>
          <th style="padding:9px 12px;text-align:center;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Poids</th>
          <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Ce qui est mesuré</th>
        </tr>
      </thead>
      <tbody>${methodoRows}</tbody>
    </table>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px;">
      <div style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:20px 22px;">
        <div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Source académique</div>
        <p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.65;">"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024. Cette étude démontre que certaines optimisations augmentent la visibilité IA jusqu'à 40%.</p>
      </div>
      <div style="background:#FBF0EB;border:1px solid rgba(217,119,87,0.2);border-radius:10px;padding:20px 22px;">
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Limites de ce rapport</div>
        <p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.65;">Ce rapport mesure le <strong>potentiel de citation IA</strong>, pas le nombre réel de citations. Les résultats des moteurs IA varient selon la requête et le contexte.</p>
      </div>
    </div>

    <div style="background:#F7F5F2;border-radius:10px;padding:18px 22px;">
      <div style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">Périmètre de l'analyse</div>
      <p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.65;">Les scores sont calculés sur la page analysée uniquement (<strong style="color:#1A1916;">${esc(url)}</strong>), pas le site entier. Pour une évaluation complète, analysez vos pages principales séparément.</p>
    </div>

    <div style="margin-top:56px;border-top:1px solid #E5E2DC;padding-top:22px;display:flex;justify-content:space-between;align-items:center;">
      <div style="font-family:Georgia,serif;font-size:15px;color:#1A1916;">Detekia</div>
      <div style="font-family:monospace;font-size:10px;color:#B0ABA5;">Rapport généré le ${date} · detekia.fr</div>
    </div>
  </div>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Rapport GEO — ${esc(url)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
  @page { margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #1A1916; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>
${cover}
${execSummary}
${criteriaPages}
${actionPlan}
${methodology}
</body>
</html>`;
}

// ─── API Handler ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, url, reportData } = req.body;
  if (!email || !reportData) return res.status(400).json({ error: 'Données manquantes' });

  try {
    const html = generateReportHTML({ url, ...reportData });

    // Génération du PDF via PDFShift
    console.log('Starting PDFShift...');
    const pdfResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('api:' + process.env.PDFSHIFT_API_KEY).toString('base64'),
      },
      body: JSON.stringify({
        source: html,
        landscape: false,
        use_print: true,
      }),
    });

    if (!pdfResponse.ok) {
      const errText = await pdfResponse.text();
      throw new Error(`PDFShift error: ${pdfResponse.status} ${errText}`);
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
    console.log('PDF generated, size:', pdfBuffer.length);

    const { data, error } = await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: email,
      subject: `Votre rapport GEO complet — ${url} · Score ${reportData.score}/100`,
      html: `
        <div style="background:#F7F5F2;padding:40px 20px;font-family:system-ui">
          <div style="max-width:560px;margin:0 auto">
            <div style="text-align:center;margin-bottom:32px">
              <div style="font-family:Georgia,serif;font-size:22px;color:#1A1916;margin-bottom:8px">Detekia</div>
              <div style="font-family:monospace;font-size:10px;color:#8A8680;letter-spacing:2px">RAPPORT GEO COMPLET</div>
            </div>
            <div style="background:#1A1916;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px">
              <div style="font-family:Georgia,serif;font-size:64px;color:#F7F5F2;line-height:1;letter-spacing:-2px">${reportData.score}</div>
              <div style="font-family:monospace;font-size:12px;color:rgba(247,245,242,0.4)">/100 — ${url}</div>
              <div style="font-size:13px;color:rgba(247,245,242,0.55);margin-top:12px;font-family:system-ui;line-height:1.6">${reportData.verdict}</div>
            </div>
            <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E5E2DC;margin-bottom:24px">
              <div style="font-size:13px;color:#1A1916;font-weight:600;margin-bottom:8px;font-family:system-ui">🎯 Priorité absolue</div>
              <div style="font-size:13px;color:#8A8680;line-height:1.6;font-family:system-ui">${reportData.topPriority || ''}</div>
            </div>
            <div style="text-align:center;font-size:13px;color:#8A8680;font-family:system-ui;line-height:1.6">
              Votre rapport PDF complet avec toutes les recommandations détaillées est joint à cet email.
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `rapport-geo-${url.replace(/[^a-z0-9]/gi, '-')}.pdf`,
          content: Buffer.from(pdfBuffer).toString('base64'),
          content_type: 'application/pdf',
        },
      ],
    });

    if (error) return res.status(400).json({ error });
    return res.status(200).json({ success: true });

  } catch (e) {
    console.error('generate-pdf error:', e);
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
