import { Resend } from 'resend';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const config = { maxDuration: 60 };

const resend = new Resend(process.env.RESEND_API_KEY);

function getGradeLabel(score) {
  if (score >= 70) return { label: 'BON', color: '#10A37F' };
  if (score >= 45) return { label: 'MOYEN', color: '#C9861A' };
  return { label: 'FAIBLE', color: '#D97757' };
}

function generateReportHTML(data) {
  const { url, score, verdict, criteria, recommendations, strengths, topPriority } = data;
  const grade = getGradeLabel(score);
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const priorityColors = {
    high:   { bg: '#FBF0EB', color: '#D97757', label: 'CRITIQUE' },
    medium: { bg: '#FFF8ED', color: '#C9861A', label: 'IMPORTANT' },
    low:    { bg: '#E8F7F3', color: '#10A37F', label: 'BONUS' },
  };

  const recoHTML = recommendations.map((r, i) => {
    const p = priorityColors[r.priority] || priorityColors.medium;
    const sections = [];

    if (r.diagnostic) sections.push({ icon: '🔍', title: 'Diagnostic', content: r.diagnostic });
    if (r.whyCritical) sections.push({ icon: '⚠️', title: 'Pourquoi c\'est critique', content: r.whyCritical });
    if (r.whatToDo) sections.push({ icon: '✅', title: 'Ce qu\'il faut faire', content: r.whatToDo });
    if (r.howToDoIt) sections.push({ icon: '🛠️', title: 'Comment le faire', content: r.howToDoIt });
    if (r.concreteExample) sections.push({ icon: '💡', title: 'Exemple concret', content: r.concreteExample });
    if (r.expectedImpact) sections.push({ icon: '📈', title: 'Impact attendu', content: r.expectedImpact });
    if (r.expertTip) sections.push({ icon: '🎯', title: 'Tip d\'expert', content: r.expertTip });
    // Fallback si structure ancienne
    if (sections.length === 0 && r.text) sections.push({ icon: '✅', title: 'Recommandation', content: r.text });

    return `
      <div style="margin-bottom:32px;page-break-inside:avoid;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding:12px 16px;background:${p.bg};border-radius:8px;border-left:4px solid ${p.color}">
          <span style="font-family:monospace;font-size:10px;font-weight:600;letter-spacing:2px;color:${p.color};text-transform:uppercase">${p.label}</span>
          <span style="font-size:11px;color:#8A8680;font-family:monospace">${r.criterion || ''}</span>
          <span style="margin-left:auto;font-size:16px;font-weight:700;color:${p.color};font-family:'Georgia',serif">${r.title || ''}</span>
        </div>
        ${sections.map(s => `
          <div style="margin-bottom:14px;padding:14px 16px;background:#FAFAF9;border-radius:8px;border:1px solid #E5E2DC;">
            <div style="font-size:12px;font-weight:600;color:#1A1916;margin-bottom:6px;font-family:system-ui">${s.icon} ${s.title}</div>
            <div style="font-size:12px;color:#3A3835;line-height:1.7;font-family:system-ui;white-space:pre-wrap">${s.content}</div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');

  const criteriaHTML = criteria.map(c => {
    const pct = Math.round((c.score / c.max) * 100);
    const color = pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757';
    return `
      <tr>
        <td style="padding:10px 12px;font-size:12px;font-family:system-ui;color:#1A1916;border-bottom:1px solid #E5E2DC">${c.name}</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #E5E2DC">
          <span style="font-family:monospace;font-size:12px;font-weight:600;color:${color}">${c.score}/${c.max}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #E5E2DC">
          <div style="height:6px;background:#E5E2DC;border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${color};border-radius:3px"></div>
          </div>
        </td>
        <td style="padding:10px 12px;font-size:11px;color:#8A8680;font-family:system-ui;border-bottom:1px solid #E5E2DC">${c.detail}</td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rapport GEO — ${url}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#F7F5F2; font-family:'DM Sans',system-ui,sans-serif; color:#1A1916; }
  .page { max-width:800px; margin:0 auto; background:#fff; }
</style>
</head>
<body>
<div class="page">

  <!-- COUVERTURE -->
  <div style="background:#1A1916;padding:64px 56px;position:relative;overflow:hidden">
    <div style="position:absolute;top:-80px;right:-80px;width:300px;height:300px;border-radius:50%;background:${grade.color};opacity:0.06"></div>
    
    <!-- Logo -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:48px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;width:16px;height:16px">
        <div style="background:#10A37F;border-radius:50%"></div>
        <div style="background:#D97757;border-radius:50%"></div>
        <div style="background:#4285F4;border-radius:50%"></div>
        <div style="background:#1C7DC4;border-radius:50%"></div>
      </div>
      <span style="font-family:Georgia,serif;font-size:18px;color:#F7F5F2;font-weight:400">Detekia</span>
      <span style="margin-left:auto;font-family:monospace;font-size:10px;color:rgba(247,245,242,0.4);letter-spacing:2px">RAPPORT GEO · ${date}</span>
    </div>

    <!-- Score -->
    <div style="display:flex;align-items:flex-end;gap:32px;margin-bottom:32px">
      <div>
        <div style="font-family:Georgia,serif;font-size:96px;line-height:1;color:#F7F5F2;letter-spacing:-4px">${score}</div>
        <div style="font-family:monospace;font-size:13px;color:rgba(247,245,242,0.3)">/100</div>
      </div>
      <div style="padding-bottom:12px">
        <div style="display:inline-block;background:${grade.color}22;border:1px solid ${grade.color}44;padding:4px 14px;border-radius:20px;margin-bottom:12px">
          <span style="font-family:monospace;font-size:10px;letter-spacing:2px;color:${grade.color}">${grade.label}</span>
        </div>
        <div style="font-family:Georgia,serif;font-size:24px;color:#F7F5F2;line-height:1.2">${grade.label === 'BON' ? 'Excellente citabilité IA' : grade.label === 'MOYEN' ? 'Citabilité IA à améliorer' : 'Citabilité IA insuffisante'}</div>
        <div style="font-family:monospace;font-size:12px;color:#D97757;margin-top:8px">${url}</div>
      </div>
    </div>

    <div style="font-size:14px;color:rgba(247,245,242,0.55);line-height:1.7;max-width:580px;font-family:system-ui">${verdict}</div>
  </div>

  <!-- RÉSUMÉ EXÉCUTIF -->
  <div style="padding:48px 56px;border-bottom:2px solid #F0EDE8">
    <div style="font-family:monospace;font-size:10px;color:#D97757;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px">Résumé exécutif</div>
    <h2 style="font-family:Georgia,serif;font-size:28px;color:#1A1916;margin-bottom:32px;letter-spacing:-0.5px">Ce qu'on a trouvé sur votre site</h2>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px">
      <!-- Points forts -->
      <div style="background:#E8F7F3;border-radius:12px;padding:20px 24px;border:1px solid rgba(16,163,127,0.2)">
        <div style="font-size:12px;font-weight:600;color:#10A37F;margin-bottom:12px;font-family:system-ui;letter-spacing:1px;text-transform:uppercase">✓ Points forts</div>
        ${(strengths || []).map(s => `<div style="font-size:12px;color:#1A1916;margin-bottom:6px;font-family:system-ui;line-height:1.5">• ${s}</div>`).join('') || '<div style="font-size:12px;color:#8A8680;font-family:system-ui">Analyse en cours...</div>'}
      </div>
      <!-- Priorité absolue -->
      <div style="background:#FBF0EB;border-radius:12px;padding:20px 24px;border:1px solid rgba(217,119,87,0.2)">
        <div style="font-size:12px;font-weight:600;color:#D97757;margin-bottom:12px;font-family:system-ui;letter-spacing:1px;text-transform:uppercase">🎯 Priorité absolue</div>
        <div style="font-size:12px;color:#1A1916;line-height:1.6;font-family:system-ui">${topPriority || 'Voir recommandations ci-dessous'}</div>
      </div>
    </div>

    <!-- Tableau scores -->
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:12px;overflow:hidden">
      <thead>
        <tr style="background:#1A1916">
          <th style="padding:12px;text-align:left;font-family:monospace;font-size:10px;color:rgba(247,245,242,0.6);letter-spacing:1px;text-transform:uppercase;font-weight:400">Critère</th>
          <th style="padding:12px;text-align:center;font-family:monospace;font-size:10px;color:rgba(247,245,242,0.6);letter-spacing:1px;text-transform:uppercase;font-weight:400">Score</th>
          <th style="padding:12px;font-family:monospace;font-size:10px;color:rgba(247,245,242,0.6);letter-spacing:1px;text-transform:uppercase;font-weight:400;width:160px">Progression</th>
          <th style="padding:12px;font-family:monospace;font-size:10px;color:rgba(247,245,242,0.6);letter-spacing:1px;text-transform:uppercase;font-weight:400">Détail</th>
        </tr>
      </thead>
      <tbody>${criteriaHTML}</tbody>
    </table>
  </div>

  <!-- RECOMMANDATIONS -->
  <div style="padding:48px 56px">
    <div style="font-family:monospace;font-size:10px;color:#D97757;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px">Plan d'action GEO</div>
    <h2 style="font-family:Georgia,serif;font-size:28px;color:#1A1916;margin-bottom:8px;letter-spacing:-0.5px">${recommendations.length} recommandations expertes</h2>
    <p style="font-size:13px;color:#8A8680;margin-bottom:40px;font-family:system-ui;line-height:1.6">Classées par priorité d'impact sur votre citabilité IA.</p>
    ${recoHTML}
  </div>

  <!-- FOOTER -->
  <div style="background:#1A1916;padding:32px 56px;display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-family:Georgia,serif;font-size:14px;color:#F7F5F2">Detekia</span>
      <span style="font-size:11px;color:rgba(247,245,242,0.3);font-family:system-ui">— Rapport GEO généré le ${date}</span>
    </div>
    <span style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.3)">detekia.fr</span>
  </div>

</div>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, url, reportData } = req.body;
  if (!email || !reportData) return res.status(400).json({ error: 'Données manquantes' });

  try {
    const html = generateReportHTML({ url, ...reportData });

    // Génération du PDF via Puppeteer + Chromium
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });
    await browser.close();

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
    return res.status(500).json({ error: e.message });
  }
}