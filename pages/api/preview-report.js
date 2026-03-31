import { Redis } from '@upstash/redis';

export const config = { maxDuration: 30 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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

function matchRecos(recs, criterionName) {
  if (!recs?.length) return [];
  const name = criterionName.toLowerCase();
  const primary = recs.filter(r => r.criterion && name.includes(r.criterion.toLowerCase()));
  if (primary.length) return primary;
  return recs.filter(r => r.criterion && r.criterion.toLowerCase().split(/[\s&]/)[0].trim().length > 3 &&
                          name.includes(r.criterion.toLowerCase().split(/[\s&]/)[0].trim()));
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

  const blockStyle = 'background:#F7F5F2;border-left:3px solid #E5E2DC;padding:14px 18px;border-radius:0 6px 6px 0;margin:10px 0;';
  const labelStyle = 'font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;';
  const codeStyle  = 'background:#1A1916;color:#F7F5F2;border-radius:8px;padding:16px;font-family:monospace;font-size:11px;line-height:1.6;white-space:pre-wrap;word-break:break-all;margin:10px 0;';
  const valStyle   = 'font-family:monospace;font-size:12px;color:#1A1916;line-height:1.6;';

  if (/extractibilité/i.test(name)) {
    const introBlock = evidence.intro
      ? `<div style="${blockStyle}"><div style="${labelStyle}">Extrait analysé — 300 premiers caractères du site</div><div style="${valStyle}">${esc(evidence.intro)}</div></div>`
      : '';
    const headingsRows = (evidence.headings || []).slice(0, 20).map(h =>
      `<tr><td style="padding:5px 10px;font-family:monospace;font-size:10px;color:#D97757;text-transform:uppercase;white-space:nowrap;border-bottom:1px solid #F0EDE8;">${esc(h.level)}</td><td style="padding:5px 10px;font-family:system-ui;font-size:11px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${esc(h.text)}</td></tr>`
    ).join('');
    const headingsBlock = headingsRows
      ? `<div style="${labelStyle};margin-top:14px;">Structure H1/H2/H3 détectée</div><table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:6px;overflow:hidden;"><thead><tr style="background:#F7F5F2;"><th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">Niveau</th><th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">Texte</th></tr></thead><tbody>${headingsRows}</tbody></table>`
      : `<div style="${blockStyle}"><div style="${valStyle}">Aucun titre H1/H2/H3 détecté</div></div>`;
    const wcBlock = evidence.wordCount != null
      ? `<div style="font-family:system-ui;font-size:12px;color:#8A8680;margin-top:10px;">Nombre de mots : <strong style="color:#1A1916;">${evidence.wordCount}</strong></div>`
      : '';
    return introBlock + headingsBlock + wcBlock;
  }

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

  if (/autorité/i.test(name)) {
    const titleBlock = `<div style="${blockStyle}"><div style="${labelStyle}">Balise &lt;title&gt;</div><div style="${valStyle}">${esc(evidence.metaTitle) || '<span style="color:#D97757;">Non définie</span>'}</div></div>`;
    const descBlock  = `<div style="${blockStyle}"><div style="${labelStyle}">Meta description</div><div style="${valStyle}">${esc(evidence.metaDescription) || '<span style="color:#D97757;">Non définie</span>'}</div></div>`;
    const socialRows = (evidence.socialLinks || []).map(l => `<div style="font-size:11px;font-family:monospace;color:#4285F4;margin-bottom:4px;word-break:break-all;">${esc(l)}</div>`).join('');
    const socialBlock = `<div style="${blockStyle}"><div style="${labelStyle}">Réseaux sociaux détectés</div>${socialRows || '<div style="font-family:system-ui;font-size:12px;color:#D97757;">Aucun lien vers réseaux sociaux</div>'}</div>`;
    return titleBlock + descBlock + socialBlock;
  }

  if (/crawlabilité/i.test(name)) {
    const robotsContent = evidence.robotsTxt && evidence.robotsTxt !== 'Non accessible'
      ? `<div style="${codeStyle}">${esc(evidence.robotsTxt)}</div>`
      : `<div style="${blockStyle}"><div style="${valStyle}">Non accessible</div></div>`;
    const robotsBlock = `<div style="${labelStyle}">Contenu de robots.txt</div>${robotsContent}`;
    const llmsColor = evidence.hasLlmsTxt ? '#10A37F' : '#D97757';
    const llmsBlock = `<div style="${blockStyle}"><div style="${labelStyle}">Fichier llms.txt</div><div style="font-family:system-ui;font-size:13px;font-weight:600;color:${llmsColor};">${evidence.hasLlmsTxt ? '✓ Présent' : '✗ Absent'}</div></div>`;
    return robotsBlock + llmsBlock;
  }

  if (/données structurées/i.test(name)) {
    if (!evidence.schemas?.length) {
      return `<div style="${blockStyle}"><div style="${labelStyle}">Schemas JSON-LD détectés</div><div style="font-family:system-ui;font-size:13px;font-weight:600;color:#D97757;">Aucun schema JSON-LD détecté</div></div>`;
    }
    const schemaRows = evidence.schemas.map(s =>
      `<tr><td style="padding:8px 10px;font-family:monospace;font-size:11px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${esc(s.type)}</td><td style="padding:8px 10px;font-family:system-ui;font-size:11px;color:#8A8680;border-bottom:1px solid #F0EDE8;">${(s.properties || []).join(', ')}</td></tr>`
    ).join('');
    return `<div style="${labelStyle}">Schemas JSON-LD détectés</div><table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:6px;overflow:hidden;"><thead><tr style="background:#F7F5F2;"><th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">Type</th><th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">Propriétés</th></tr></thead><tbody>${schemaRows}</tbody></table>`;
  }

  if (/présence/i.test(name)) {
    const socialRows = (evidence.socialLinks || []).map(l => `<div style="font-size:11px;font-family:monospace;color:#4285F4;margin-bottom:4px;word-break:break-all;">${esc(l)}</div>`).join('');
    return `<div style="${blockStyle}"><div style="${labelStyle}">Réseaux sociaux détectés</div>${socialRows || '<div style="font-family:system-ui;font-size:12px;color:#D97757;">Aucun lien vers réseaux sociaux détecté</div>'}</div>`;
  }

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
    .map(s => `<div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:8px;padding:13px 16px;margin-bottom:8px;">
      <div style="font-family:system-ui;font-size:11px;font-weight:600;color:#1A1916;margin-bottom:5px;">${s.icon} ${s.title}</div>
      <div style="font-family:system-ui;font-size:13px;color:#3A3835;line-height:1.65;">${esc(s.content)}</div>
    </div>`)
    .join('');
}

// ─── Main HTML generator ──────────────────────────────────────────────────────

function generateReportHTML(data) {
  const { url, score, verdict, strengths = [], topPriority, criteria = [], recommendations = [], evidence, citationTest } = data;
  const g         = grade(score);
  const date      = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const projected = projectedScore(score, criteria);
  const noEvidence = !evidence;

  const sortedRecos = [...recommendations].sort((a, b) => {
    const p = { high: 0, medium: 1, low: 2 };
    return (p[a.priority] ?? 1) - (p[b.priority] ?? 1);
  });

  const P  = 'page-break-before:always;padding:52px 56px 64px;background:#fff;box-sizing:border-box;';
  const LS = 'font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;';

  const sLabel = (txt, color = '#D97757') =>
    `<div style="font-family:monospace;font-size:10px;color:${color};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">${txt}</div>`;
  const H1 = (txt) =>
    `<h1 style="font-family:Georgia,serif;font-size:34px;color:#1A1916;letter-spacing:-1px;margin-bottom:28px;line-height:1.1;">${txt}</h1>`;

  // ── PAGE 1 : COVER ──────────────────────────────────────────────────────────
  const cover = `
  <div style="background:#1A1916;min-height:100vh;padding:72px 64px;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
    <div style="position:absolute;top:-100px;right:-100px;width:400px;height:400px;border-radius:50%;background:${g.color};opacity:0.05;pointer-events:none;"></div>
    <div style="position:absolute;bottom:-80px;left:-60px;width:280px;height:280px;border-radius:50%;background:${g.color};opacity:0.04;pointer-events:none;"></div>
    <div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;width:20px;height:20px;">
          <div style="background:#10A37F;border-radius:50%;"></div><div style="background:#D97757;border-radius:50%;"></div>
          <div style="background:#4285F4;border-radius:50%;"></div><div style="background:#1C7DC4;border-radius:50%;"></div>
        </div>
        <span style="font-family:Georgia,serif;font-size:22px;color:#F7F5F2;">Detekia</span>
      </div>
      <div style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.3);letter-spacing:3px;text-transform:uppercase;">RAPPORT GEO COMPLET · ${date}</div>
    </div>
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
    <div style="border-top:1px solid rgba(247,245,242,0.08);padding-top:22px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;">
      <div style="font-family:system-ui;font-size:12px;color:rgba(247,245,242,0.28);">Ce rapport est personnel et confidentiel</div>
      <div style="font-family:system-ui;font-size:11px;color:rgba(247,245,242,0.2);">Beeleven SASU · hello@detekia.fr · detekia.fr</div>
    </div>
  </div>`;

  // ── PAGE 2 : EXECUTIVE SUMMARY ──────────────────────────────────────────────
  const criteriaTableRows = criteria.map(c => {
    const pct = Math.round((c.score / c.max) * 100);
    const cg  = criterionGrade(c.score, c.max);
    return `<tr>
      <td style="padding:10px 12px;font-family:system-ui;font-size:12px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${esc(c.name)}</td>
      <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #F0EDE8;"><span style="font-family:monospace;font-size:12px;font-weight:600;color:${cg.color};">${c.score}/${c.max}</span></td>
      <td style="padding:10px 16px;border-bottom:1px solid #F0EDE8;width:120px;">
        <div style="height:6px;background:#E5E2DC;border-radius:3px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${cg.color};border-radius:3px;"></div></div>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #F0EDE8;">
        <span style="display:inline-block;padding:2px 9px;border-radius:12px;font-family:monospace;font-size:9px;letter-spacing:1px;background:${cg.bg};color:${cg.color};">${cg.label}</span>
      </td>
    </tr>`;
  }).join('');

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
  ).join('') || `<div style="font-family:system-ui;font-size:13px;color:#8A8680;">—</div>`;

  const execSummary = `
  <div style="${P}min-height:100vh;">
    ${sLabel('Synthèse exécutive')}
    ${H1("Résultats de l'analyse")}
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
    <h2 style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-bottom:14px;">Les 8 critères GEO</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:10px;overflow:hidden;margin-bottom:36px;">
      <thead><tr style="background:#F7F5F2;">
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Critère</th>
        <th style="padding:9px 12px;text-align:center;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Score</th>
        <th style="padding:9px 12px;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;width:120px;">Progression</th>
        <th style="padding:9px 12px;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Statut</th>
      </tr></thead>
      <tbody>${criteriaTableRows}</tbody>
    </table>
    <h2 style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-bottom:14px;">3 actions prioritaires</h2>
    ${top3HTML}
    <h2 style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-top:28px;margin-bottom:14px;">Points forts identifiés</h2>
    <div style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:20px 24px;">${strengthsHTML}</div>
    ${noEvidence ? `<div style="background:#FFF8ED;border:1px solid rgba(201,134,26,0.25);border-radius:8px;padding:14px 18px;margin-top:28px;font-family:system-ui;font-size:12px;color:#C9861A;line-height:1.5;">⚠️ Données détaillées non disponibles pour ce scan. Relancez l'analyse pour un rapport enrichi.</div>` : ''}
  </div>`;

  // ── PAGE 3 : CONTEXT ────────────────────────────────────────────────────────
  const context = `
  <div style="${P}min-height:100vh;">
    ${sLabel('Contexte 2026')}
    ${H1('Pourquoi la visibilité IA est critique en 2026')}
    <p style="font-family:system-ui;font-size:13px;color:#8A8680;line-height:1.7;margin-bottom:28px;">Les moteurs de recherche IA changent radicalement la façon dont les internautes trouvent l'information. Voici les données clés qui expliquent pourquoi votre visibilité IA est devenue un enjeu business direct.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:28px;">
      <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;">
        <div style="${LS}">Croissance du trafic IA</div>
        <div style="font-family:Georgia,serif;font-size:28px;color:#D97757;line-height:1;margin-bottom:6px;">+527%</div>
        <p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.6;">Le trafic référé par les IA a augmenté de 527% entre janvier et mai 2025. <span style="color:#B0ABA5;">(Previsible, 2025 AI Traffic Report)</span></p>
      </div>
      <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;">
        <div style="${LS}">Usage ChatGPT</div>
        <div style="font-family:Georgia,serif;font-size:28px;color:#D97757;line-height:1;margin-bottom:6px;">2,5 Mds</div>
        <p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.6;">Requêtes traitées par jour. 810 millions de personnes l'utilisent quotidiennement. <span style="color:#B0ABA5;">(Search Engine Land, 2026)</span></p>
      </div>
      <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;">
        <div style="${LS}">Taux de conversion IA</div>
        <div style="font-family:Georgia,serif;font-size:28px;color:#10A37F;line-height:1;margin-bottom:6px;">4,4×</div>
        <p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.6;">Les visiteurs référés par les IA convertissent 4,4× mieux que les visiteurs organiques classiques. <span style="color:#B0ABA5;">(Semrush, 2025)</span></p>
      </div>
      <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;">
        <div style="${LS}">SEO vs GEO</div>
        <div style="font-family:Georgia,serif;font-size:28px;color:#D97757;line-height:1;margin-bottom:6px;">80%</div>
        <p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.6;">Des URLs citées par ChatGPT ne sont PAS dans le top 100 Google. Le SEO seul ne suffit plus. <span style="color:#B0ABA5;">(Ahrefs, 2025)</span></p>
      </div>
      <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;">
        <div style="${LS}">Position du texte</div>
        <div style="font-family:Georgia,serif;font-size:28px;color:#C9861A;line-height:1;margin-bottom:6px;">44,2%</div>
        <p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.6;">Des citations IA proviennent des 30 premiers % du texte. Votre introduction est votre atout n°1. <span style="color:#B0ABA5;">(Growth Memo, 2026)</span></p>
      </div>
      <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;">
        <div style="${LS}">Marché GEO</div>
        <div style="font-family:Georgia,serif;font-size:28px;color:#10A37F;line-height:1;margin-bottom:6px;">33,7 Mds$</div>
        <p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.6;">Valeur projetée du marché GEO en 2034, contre 848M$ en 2025. <span style="color:#B0ABA5;">(eMarketer)</span></p>
      </div>
    </div>
    <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;margin-bottom:20px;">
      <p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.7;"><strong>Seulement 11%</strong> des domaines sont cités à la fois par ChatGPT ET Perplexity. <span style="color:#8A8680;">(Profound, 2025)</span> Chaque plateforme IA a ses propres préférences — une raison supplémentaire de travailler votre citabilité de façon transversale.</p>
    </div>
    <div style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:20px 24px;">
      <div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Source académique de référence</div>
      <p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.7;">"Generative Engine Optimization" — Aggarwal et al., Princeton University / Georgia Tech, KDD 2024. Cette étude démontre que l'ajout de citations sourcées, de statistiques et de structure dans le contenu augmente la visibilité IA jusqu'à <strong>40%</strong>. C'est le fondement méthodologique de ce rapport.</p>
    </div>
  </div>`;

  // ── PAGE 4 : CITATION TEST ──────────────────────────────────────────────────
  const citationTestPage = (() => {
    if (!citationTest || !Array.isArray(citationTest.tests) || !citationTest.tests.length) return '';
    const ct = citationTest;
    const citedCount = ct.summary?.cited_count ?? ct.tests.filter(t => t.cited).length;
    const totalTests  = ct.summary?.total_tests ?? ct.tests.length;
    const bc = citedCount >= 3
      ? { color: '#10A37F', bg: 'rgba(16,163,127,0.12)', border: 'rgba(16,163,127,0.3)' }
      : citedCount >= 1
      ? { color: '#C9861A', bg: 'rgba(201,134,26,0.12)',  border: 'rgba(201,134,26,0.3)' }
      : { color: '#D97757', bg: 'rgba(217,119,87,0.12)',  border: 'rgba(217,119,87,0.3)' };
    const diffColor = {
      'générique':     { color: '#D97757', bg: 'rgba(217,119,87,0.10)' },
      'niche':         { color: '#C9861A', bg: 'rgba(201,134,26,0.10)' },
      'longue_traîne': { color: '#10A37F', bg: 'rgba(16,163,127,0.10)' },
    };
    const cards = ct.tests.map(t => {
      const dc = diffColor[t.difficulty] || { color: '#8A8680', bg: 'rgba(138,134,128,0.10)' };
      const citedColor = t.cited ? '#10A37F' : '#D97757';
      const citedBg    = t.cited ? 'rgba(16,163,127,0.10)' : 'rgba(217,119,87,0.10)';
      const diffLabel  = (t.difficulty || '').toUpperCase().replace(/_/g, ' ');
      const competitorsLine = !t.cited && t.competitors_cited?.length
        ? `<div style="font-family:system-ui;font-size:11px;color:#8A8680;margin-bottom:4px;">Cités à votre place : <strong style="color:#1A1916;">${t.competitors_cited.map(esc).join(', ')}</strong></div>`
        : '';
      const excerptBlock = t.ai_response_excerpt
        ? `<div style="background:#F7F5F2;border-left:3px solid #E5E2DC;padding:8px 12px;font-family:monospace;font-size:11px;color:#8A8680;line-height:1.5;margin-top:8px;">${esc(t.ai_response_excerpt)}</div>`
        : '';
      return `<div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:8px;padding:16px;margin-bottom:12px;">
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
          <div style="flex:1;min-width:200px;font-family:system-ui;font-size:13px;font-weight:600;color:#1A1916;line-height:1.4;">${esc(t.query)}</div>
          <span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;background:${dc.bg};color:${dc.color};white-space:nowrap;">${diffLabel}</span>
          <span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;background:${citedBg};color:${citedColor};white-space:nowrap;">${t.cited ? '✓ Cité' : '✗ Non cité'}</span>
        </div>
        ${competitorsLine}
        <div style="font-family:system-ui;font-size:11px;color:#8A8680;margin-bottom:4px;">Difficulté pour être cité : <strong style="color:#1A1916;">${esc(t.difficulty_to_rank || '')}</strong></div>
        <div style="font-family:system-ui;font-size:11px;color:#1A1916;margin-bottom:4px;line-height:1.5;"><em>Recommandation :</em> ${esc(t.recommendation || '')}</div>
        ${excerptBlock}
      </div>`;
    }).join('');
    const summaryBlock = ct.summary
      ? `<div style="font-family:system-ui;font-size:13px;color:#1A1916;margin-top:12px;line-height:1.8;">
          <span style="color:#8A8680;">Meilleure opportunité :</span> ${esc(ct.summary.best_opportunity || '—')}<br>
          <span style="color:#8A8680;">Blocage principal :</span> ${esc(ct.summary.main_blocker || '—')}
        </div>`
      : '';
    return `
    <div style="${P}min-height:100vh;">
      ${sLabel('Test IA')}
      <h1 style="font-family:Georgia,serif;font-size:34px;color:#1A1916;letter-spacing:-1px;margin-bottom:8px;line-height:1.1;">Test de visibilité IA</h1>
      <p style="font-family:system-ui;font-size:13px;color:#8A8680;margin-bottom:28px;line-height:1.6;">Nous avons simulé 5 requêtes utilisateur pour vérifier si votre site est cité par les moteurs IA.</p>
      <div style="display:inline-flex;align-items:center;gap:16px;background:${bc.bg};border:1px solid ${bc.border};border-radius:12px;padding:18px 28px;margin-bottom:4px;">
        <div style="font-family:Georgia,serif;font-size:44px;color:${bc.color};line-height:1;letter-spacing:-2px;">${citedCount}/${totalTests}</div>
        <div style="font-family:system-ui;font-size:13px;color:${bc.color};font-weight:600;line-height:1.4;">requêtes<br>citent votre site</div>
      </div>
      ${summaryBlock}
      <div style="margin-top:28px;">${cards}</div>
      <div style="margin-top:24px;background:#F7F5F2;border-radius:8px;padding:16px 20px;">
        <p style="font-family:system-ui;font-size:11px;color:#8A8680;line-height:1.65;">Ce test simule des requêtes utilisateur via Claude (Anthropic). Il reflète la visibilité actuelle de votre marque dans les connaissances des IA. Les résultats peuvent varier selon le moteur IA, la formulation de la requête et le moment du test.</p>
      </div>
    </div>`;
  })();

  // ── PAGES 5–12 : CRITERIA ──────────────────────────────────────────────────
  const WHY = {
    extractibilité:        "44,2% des citations IA proviennent des 30 premiers % du texte d'une page (Growth Memo, 2026). L'étude Princeton/KDD 2024 démontre que l'ajout de statistiques et de citations dans le contenu augmente la visibilité IA de 30 à 40%. Votre introduction est votre atout n°1.",
    vérifiabilité:         "Les IA favorisent les contenus factuels et sourcés. Les pages avec des données chiffrées sont citées 2,8× plus souvent que les pages sans données vérifiables. (AirOps, 2026)",
    autorité:              "L'autorité de domaine est le prédicteur n°1 des citations IA avec un score SHAP de 0,63 (SE Ranking, 2025). Les pages avec des auteurs identifiés et des biographies sont significativement plus citées par les LLM.",
    crawlabilité:          "73% des sites ne sont pas crawlables par les bots IA à cause de robots.txt, CDN ou JavaScript (Otterly.AI, 2026). Débloquer les crawlers IA est le quick win n°1 — impact visible en 2 à 4 semaines.",
    "données structurées": "Les pages avec Schema FAQPage, Article et Organization sont plus facilement parsées par les IA. Le contenu structuré en chunks est cité 3 à 5× plus souvent que le contenu brut. (Otterly.AI, 2026)",
    neutralité:            "Les IA déprioritisent le contenu ouvertement promotionnel. L'étude Princeton montre que la 'Fluency Optimization' améliore la visibilité IA, mais le ton doit rester factuel et informatif pour être cité.",
    présence:              "90% des citations IA proviennent de médias earned et owned, pas de placements payants (Edelman, 2026). Reddit est la source n°1 pour Perplexity (6,6% des citations) et n°2 pour ChatGPT.",
    fraîcheur:             "65% des visites de bots IA ciblent du contenu publié dans les 12 derniers mois (Seer Interactive, 2025). Un contenu non mis à jour depuis plus de 6 mois perd progressivement sa citabilité IA.",
  };

  const CASES = {
    extractibilité:        "SEO Vendor a appliqué des tactiques d'extractibilité (sections citables, formatage réponse directe) et a obtenu 549 sessions ChatGPT en 7 mois, contre seulement 3 sessions organiques. (SEO Vendor, 2026)",
    vérifiabilité:         "Ahrefs génère 12,1% de ses inscriptions via le trafic IA (0,5% du trafic total) grâce à des contenus riches en données vérifiables. Les visiteurs IA consultent 50% plus de pages par session. (Ahrefs/Semrush, 2025)",
    autorité:              "Les marques dans le top 25% des mentions web obtiennent 10× plus de visibilité IA. Les 50 premières marques captent 28,9% de toutes les mentions dans les AI Overviews. (Ahrefs, 2025)",
    crawlabilité:          "Triangle IP a créé un fichier llms.txt guidant les IA vers ses pages prioritaires. Résultat : 5× plus de trafic IA et une présence sur ChatGPT, Gemini, Perplexity et Copilot. (Concurate/SE Ranking, 2025)",
    "données structurées": "Un site a augmenté sa visibilité IA de 340% en 6 mois grâce à la restructuration de contenu et l'implémentation de schema. Le trafic IA est passé de 127 à 2 340 sessions mensuelles. (Stackmatix, 2026)",
    neutralité:            "L'étude Princeton montre que la 'Fluency Optimization' (réécriture factuelle du contenu) améliore significativement la visibilité dans les réponses IA. Le contenu éducatif est systématiquement cité devant le contenu promotionnel.",
    présence:              "Reddit est cité dans 46,7% des réponses Perplexity (parmi le top 10 sources) et 1,8% des citations ChatGPT. Une présence active sur Reddit est le levier de présence externe le plus efficace. (Profound, 2025)",
    fraîcheur:             "79% des pages visitées par les bots IA ont été publiées dans les 2 dernières années (Seer Interactive, 2025). Mettre à jour un article avec des données 2026 peut multiplier par 3 ses chances d'être cité.",
  };

  function lookup(map, criterionName) {
    const n = criterionName.toLowerCase();
    for (const [k, v] of Object.entries(map)) { if (n.includes(k)) return v; }
    return '';
  }

  const criteriaPages = criteria.map((c, idx) => {
    const cg    = criterionGrade(c.score, c.max);
    const group = criterionGroup(c.name);
    const pct   = Math.round((c.score / c.max) * 100);
    const recos = matchRecos(recommendations, c.name);
    const ev    = evidenceBlock(c.name, evidence);
    const why   = lookup(WHY, c.name);
    const study = lookup(CASES, c.name);

    const evidenceSection = evidence
      ? (ev ? `<div style="margin-top:16px;">${ev}</div>` : '')
      : `<div style="background:#FFF8ED;border:1px solid rgba(201,134,26,0.2);border-radius:8px;padding:12px 16px;margin-top:12px;font-family:system-ui;font-size:12px;color:#C9861A;">Relancez l'analyse pour voir les données détaillées.</div>`;

    const recosHTML = recos.length > 0
      ? recos.map((reco, ri) => {
          const rc = reco.priority === 'high'   ? { color: '#D97757', bg: 'rgba(217,119,87,0.08)', label: 'CRITIQUE'  }
                   : reco.priority === 'medium' ? { color: '#C9861A', bg: 'rgba(201,134,26,0.08)', label: 'IMPORTANT' }
                   :                              { color: '#10A37F', bg: 'rgba(16,163,127,0.08)', label: 'BONUS'     };
          const header = recos.length > 1
            ? `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;${ri > 0 ? 'margin-top:20px;' : ''}">
                 <span style="font-family:monospace;font-size:9px;letter-spacing:1.5px;color:${rc.color};text-transform:uppercase;">Recommandation ${ri + 1} / ${recos.length}</span>
                 <span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;background:${rc.bg};color:${rc.color};">${rc.label}</span>
                 <span style="font-family:system-ui;font-size:11px;color:#8A8680;">${impactLabel(reco.priority)} · ${delayLabel(reco.priority)}</span>
               </div>`
            : `<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
                 <span style="display:inline-block;padding:4px 12px;border-radius:20px;font-family:monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;background:${cg.bg};color:${cg.color};">${cg.label}</span>
                 <span style="font-family:system-ui;font-size:12px;color:#8A8680;">${impactLabel(reco.priority)} impact · ${delayLabel(reco.priority)}</span>
               </div>`;
          return header
            + (reco.title ? `<div style="font-family:Georgia,serif;font-size:16px;color:${rc.color};margin-bottom:12px;font-weight:bold;">${esc(reco.title)}</div>` : '')
            + recoSections(reco);
        }).join('<div style="height:1px;background:#E5E2DC;margin:16px 0;"></div>')
      : recoSections(null);

    return `
    <div style="${P}">
      <div style="margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;">${esc(group)}</span>
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

      <div style="margin-bottom:24px;">
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Ce que nous avons trouvé</div>
        <div style="background:#F7F5F2;border-left:3px solid ${cg.color};padding:14px 18px;border-radius:0 6px 6px 0;font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.65;">${esc(c.detail)}</div>
        ${evidenceSection}
      </div>

      ${why ? `<div style="margin-bottom:24px;">
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Pourquoi c'est important</div>
        <p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.75;">${esc(why)}</p>
      </div>` : ''}

      <div style="margin-bottom:24px;">
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Recommandation${recos.length > 1 ? 's' : ''}</div>
        ${recosHTML}
      </div>

      ${study ? `<div style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:18px 22px;">
        <div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Cas réel documenté</div>
        <p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.7;">${esc(study)}</p>
      </div>` : ''}
    </div>`;
  }).join('');

  // ── PAGE 13 : ACTION PLAN ───────────────────────────────────────────────────
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
  <div style="${P}min-height:100vh;">
    ${sLabel("Plan d'action")}
    ${H1('Récapitulatif des actions')}
    <p style="font-family:system-ui;font-size:13px;color:#8A8680;margin-bottom:36px;line-height:1.6;">${recommendations.length} recommandations classées par priorité d'impact.</p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:10px;overflow:hidden;margin-bottom:44px;">
      <thead><tr style="background:#F7F5F2;">
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">#</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Priorité</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Action</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Critère</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Impact</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Délai</th>
      </tr></thead>
      <tbody>${actionRows}</tbody>
    </table>
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

  // ── PAGE 14 : METHODOLOGY ───────────────────────────────────────────────────
  const methodoCriteria = [
    { name: 'Extractibilité & réponse directe', weight: '25 pts', measured: 'Longueur intro, structure H2/H3, listes, tableaux, calibrage des paragraphes' },
    { name: 'Vérifiabilité & preuves',          weight: '20 pts', measured: 'Données chiffrées, liens externes sourcés, dates, tableaux, citations' },
    { name: 'Autorité & E-E-A-T',               weight: '15 pts', measured: 'Page auteur, biographie, À propos, contact, mentions légales, schema Organization' },
    { name: 'Crawlabilité IA',                  weight: '15 pts', measured: 'Longueur contenu, lang, canonical, indexabilité, sitemap, bots IA autorisés' },
    { name: 'Données structurées',              weight: '10 pts', measured: 'HTML sémantique, schemas JSON-LD (FAQPage, Article, HowTo, Organization…)' },
    { name: 'Neutralité éditoriale',            weight: '10 pts', measured: 'Évalué par IA (Claude Haiku, Anthropic) — superlatifs, ton promotionnel, honnêteté' },
    { name: 'Présence externe',                 weight: '5 pts',  measured: 'Mentions presse, liens réseaux sociaux, témoignages tiers détectés' },
    { name: 'Fraîcheur & maintenance',          weight: '5 pts',  measured: 'dateModified schema, années récentes dans le contenu, copyright à jour' },
  ];

  const methodoRows = methodoCriteria.map(c => `
    <tr>
      <td style="padding:10px 12px;font-family:system-ui;font-size:12px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${c.name}</td>
      <td style="padding:10px 12px;text-align:center;font-family:monospace;font-size:12px;font-weight:600;color:#D97757;border-bottom:1px solid #F0EDE8;white-space:nowrap;">${c.weight}</td>
      <td style="padding:10px 12px;font-family:system-ui;font-size:11px;color:#8A8680;border-bottom:1px solid #F0EDE8;line-height:1.55;">${c.measured}</td>
    </tr>`).join('');

  const methodology = `
  <div style="${P}min-height:100vh;">
    ${sLabel('Transparence')}
    ${H1('Méthodologie')}
    <div style="background:#F7F5F2;border-radius:10px;padding:22px 26px;margin-bottom:32px;">
      <p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.75;margin-bottom:10px;">Ce rapport est généré par analyse automatisée du DOM de votre page via <strong>Jina AI</strong> (scraping HTML) et évaluation sur <strong>8 critères pondérés</strong>.</p>
      <p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.75;margin-bottom:10px;">Le critère <strong>Neutralité éditoriale</strong> est évalué par intelligence artificielle (Claude Haiku, Anthropic). Les 7 autres critères sont évalués par analyse technique du HTML.</p>
      <p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.75;">Le <strong>test de visibilité IA</strong> est réalisé par simulation de 5 requêtes via Claude (Anthropic). Les résultats varient selon le moteur IA, la requête et le moment du test.</p>
    </div>
    <h2 style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-bottom:14px;">Les 8 critères et leur pondération</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:10px;overflow:hidden;margin-bottom:32px;">
      <thead><tr style="background:#F7F5F2;">
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Critère</th>
        <th style="padding:9px 12px;text-align:center;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Poids</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Ce qui est mesuré</th>
      </tr></thead>
      <tbody>${methodoRows}</tbody>
    </table>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px;">
      <div style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:20px 22px;">
        <div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Source académique</div>
        <p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.65;">"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024. Certaines optimisations augmentent la visibilité IA jusqu'à 40%.</p>
      </div>
      <div style="background:#FBF0EB;border:1px solid rgba(217,119,87,0.2);border-radius:10px;padding:20px 22px;">
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Limites de ce rapport</div>
        <p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.65;">Ce rapport mesure le <strong>potentiel de citation IA</strong>, pas le nombre réel de citations. Les résultats des moteurs IA varient selon la requête et le contexte.</p>
      </div>
    </div>
    <div style="background:#F7F5F2;border-radius:10px;padding:18px 22px;margin-bottom:36px;">
      <div style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">Périmètre de l'analyse</div>
      <p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.65;">Les scores sont calculés sur la page analysée uniquement (<strong style="color:#1A1916;">${esc(url)}</strong>), pas le site entier. Pour une évaluation complète, analysez vos pages principales séparément.</p>
    </div>
    <div style="border-top:1px solid #E5E2DC;padding-top:22px;display:flex;justify-content:space-between;align-items:center;">
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
  @page { margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>
${cover}
${execSummary}
${context}
${citationTestPage}
${criteriaPages}
${actionPlan}
${methodology}
</body>
</html>`;
}

// ─── API Handler ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Paramètre url manquant' });

  const cacheKey = `detekia:v11:${url.toLowerCase()}`;
  const cached = await redis.get(cacheKey);

  if (!cached) {
    return res.status(404).send('Aucune analyse trouvée pour cette URL. Scannez d\'abord le site sur detekia.fr');
  }

  const data = typeof cached === 'string' ? JSON.parse(cached) : cached;
  const html = generateReportHTML({ url, ...data });

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
