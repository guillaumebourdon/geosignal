import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, url, score, criteria, recommendations, verdict } = req.body;
  if (!email || !score) return res.status(400).json({ error: 'Données manquantes' });

  const tagColors = {
    high:   { bg: '#FBF0EB', color: '#D97757', label: 'Critique' },
    medium: { bg: '#FFF8ED', color: '#C9861A', label: 'Important' },
    low:    { bg: '#E8F7F3', color: '#10A37F', label: 'Bonus' },
  };

  const gradeColor = score >= 70 ? '#10A37F' : score >= 45 ? '#C9861A' : '#D97757';
  const gradeLabel = score >= 70 ? 'BON' : score >= 45 ? 'MOYEN' : 'FAIBLE';

  const criteriaHtml = criteria.map(c => {
    const pct = Math.round((c.score / c.max) * 100);
    const color = pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757';
    return `
      <div style="background:#fff;border:1px solid #E5E2DC;border-radius:10px;padding:16px 20px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:13px;font-weight:500;color:#1A1916;font-family:sans-serif">${c.name}</span>
          <span style="font-family:monospace;font-size:13px;font-weight:500;color:${color}">${c.score}/${c.max}</span>
        </div>
        <div style="height:3px;background:#E5E2DC;border-radius:3px;overflow:hidden;margin-bottom:8px;">
          <div style="height:100%;width:${pct}%;background:${color};border-radius:3px;"></div>
        </div>
        <div style="font-size:12px;color:#8A8680;font-family:sans-serif">${c.detail}</div>
      </div>
    `;
  }).join('');

  const recoHtml = recommendations.map(r => {
    const tag = tagColors[r.priority];
    return `
      <div style="background:#fff;border:1px solid #E5E2DC;border-radius:10px;padding:16px 20px;margin-bottom:8px;display:flex;gap:12px;">
        <span style="background:${tag.bg};color:${tag.color};font-family:monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;padding:3px 8px;border-radius:5px;white-space:nowrap;height:fit-content;flex-shrink:0">${tag.label}</span>
        <span style="font-size:13px;color:#8A8680;line-height:1.6;font-family:sans-serif">${r.text}</span>
      </div>
    `;
  }).join('');

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F7F5F2;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:16px;">
        <span style="font-family:Georgia,serif;font-size:22px;color:#1A1916;font-weight:400">Detekia</span>
      </div>
      <div style="font-family:monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8A8680">Rapport GEO Complet</div>
    </div>

    <!-- Score principal -->
    <div style="background:#1A1916;border-radius:16px;padding:32px;text-align:center;margin-bottom:20px;">
      <div style="font-family:monospace;font-size:11px;color:rgba(247,245,242,0.4);letter-spacing:2px;margin-bottom:8px">${url}</div>
      <div style="font-family:Georgia,serif;font-size:72px;color:#F7F5F2;line-height:1;letter-spacing:-2px">${score}</div>
      <div style="font-family:monospace;font-size:13px;color:rgba(247,245,242,0.4)">/120</div>
      <div style="display:inline-block;margin-top:12px;background:rgba(255,255,255,0.1);color:${gradeColor};font-family:monospace;font-size:10px;letter-spacing:2px;padding:4px 14px;border-radius:20px">${gradeLabel}</div>
      <div style="font-family:Georgia,serif;font-size:16px;color:rgba(247,245,242,0.7);margin-top:16px;line-height:1.5">${verdict}</div>
    </div>

    <!-- Critères -->
    <div style="font-family:monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8A8680;margin-bottom:12px;margin-top:28px">Analyse par critère</div>
    ${criteriaHtml}

    <!-- Recommandations -->
    <div style="font-family:monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8A8680;margin-bottom:12px;margin-top:28px">Recommandations prioritaires</div>
    ${recoHtml}

    <!-- CTA -->
    <div style="background:#1A1916;border-radius:16px;padding:28px;text-align:center;margin-top:28px;">
      <div style="font-family:Georgia,serif;font-size:18px;color:#F7F5F2;margin-bottom:8px">Appliquer ces recommandations ?</div>
      <div style="font-size:13px;color:rgba(247,245,242,0.5);font-family:sans-serif;margin-bottom:20px">Analysez vos concurrents ou un autre site gratuitement.</div>
      <a href="https://detekia.vercel.app" style="display:inline-block;background:#D97757;color:#fff;padding:12px 28px;border-radius:10px;font-weight:600;font-size:14px;text-decoration:none;font-family:sans-serif">Analyser un autre site →</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;font-family:monospace;font-size:10px;color:#C8C0B0;letter-spacing:1px;">
      Detekia · detekia.vercel.app<br>
      <a href="https://detekia.vercel.app/legal" style="color:#C8C0B0">Mentions légales</a> · 
      <a href="https://detekia.vercel.app/legal" style="color:#C8C0B0">Confidentialité</a>
    </div>
  </div>
</body>
</html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Detekia <onboarding@resend.dev>',
      to: email,
      subject: `Votre rapport GEO — ${url} · Score ${score}/120`,
      html,
    });

    if (error) return res.status(400).json({ error });
    return res.status(200).json({ success: true, id: data.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}