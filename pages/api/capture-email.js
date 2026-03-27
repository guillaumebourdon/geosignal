import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

const resend = new Resend(process.env.RESEND_API_KEY);
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, url, score } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email invalide' });

  const capturedAt = new Date().toISOString();

  try {
    // Stockage Redis
    await redis.set(`leads:${email.toLowerCase()}`, JSON.stringify({ email, url, score, capturedAt }));
    await redis.lpush('leads:list', email.toLowerCase());

    // Email de confirmation
    const siteLabel = url || 'votre site';
    const resultsLink = `https://www.detekia.fr/results?url=${encodeURIComponent(url || '')}`;

    await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: email,
      subject: `Votre score GEO : ${score}/100 — ${siteLabel}`,
      html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F5F2;font-family:system-ui,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">

  <!-- Logo -->
  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-flex;align-items:center;gap:10px;">
      <table cellpadding="0" cellspacing="0" style="display:inline-table;">
        <tr>
          <td style="width:8px;height:8px;background:#10A37F;border-radius:50%;padding:0;"></td>
          <td style="width:2px;"></td>
          <td style="width:8px;height:8px;background:#D97757;border-radius:50%;padding:0;"></td>
        </tr>
        <tr><td colspan="3" style="height:2px;"></td></tr>
        <tr>
          <td style="width:8px;height:8px;background:#4285F4;border-radius:50%;padding:0;"></td>
          <td style="width:2px;"></td>
          <td style="width:8px;height:8px;background:#1C7DC4;border-radius:50%;padding:0;"></td>
        </tr>
      </table>
      <span style="font-family:Georgia,serif;font-size:22px;color:#1A1916;font-weight:400;margin-left:8px;">Detekia</span>
    </div>
    <div style="font-family:monospace;font-size:10px;color:#B0ABA5;letter-spacing:2px;text-transform:uppercase;margin-top:6px;">Rapport GEO</div>
  </div>

  <!-- Score card -->
  <div style="background:#1A1916;border-radius:16px;padding:36px;text-align:center;margin-bottom:24px;">
    <div style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.35);letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">${siteLabel}</div>
    <div style="font-family:Georgia,serif;font-size:80px;color:#F7F5F2;line-height:1;letter-spacing:-3px;margin-bottom:4px;">${score}</div>
    <div style="font-family:monospace;font-size:12px;color:rgba(247,245,242,0.3);margin-bottom:16px;">/100</div>
    <div style="display:inline-block;background:${score >= 70 ? 'rgba(16,163,127,0.18)' : score >= 45 ? 'rgba(201,134,26,0.18)' : 'rgba(217,119,87,0.18)'};border:1px solid ${score >= 70 ? 'rgba(16,163,127,0.35)' : score >= 45 ? 'rgba(201,134,26,0.35)' : 'rgba(217,119,87,0.35)'};border-radius:20px;padding:5px 16px;font-family:monospace;font-size:10px;color:${score >= 70 ? '#10A37F' : score >= 45 ? '#C9861A' : '#D97757'};letter-spacing:2px;text-transform:uppercase;">
      ${score >= 70 ? 'BON' : score >= 45 ? 'MOYEN' : 'FAIBLE'}
    </div>
  </div>

  <!-- Message -->
  <div style="background:#fff;border:1px solid #E5E2DC;border-radius:12px;padding:28px;margin-bottom:24px;">
    <div style="font-family:Georgia,serif;font-size:18px;color:#1A1916;margin-bottom:12px;">Votre analyse est prête</div>
    <div style="font-size:13px;color:#8A8680;line-height:1.7;margin-bottom:20px;">
      Votre score GEO de <strong style="color:#1A1916;">${score}/100</strong> pour <strong style="color:#1A1916;">${siteLabel}</strong> indique ${score >= 70 ? 'une bonne visibilité IA — quelques optimisations peuvent encore l\'améliorer.' : score >= 45 ? 'une visibilité IA à améliorer. Des actions ciblées peuvent significativement progresser votre score.' : 'une visibilité IA insuffisante. Les recommandations du rapport complet vous permettront de corriger les points bloquants.'}
    </div>
    <a href="${resultsLink}" style="display:block;text-align:center;background:#1A1916;color:#F7F5F2;padding:14px 24px;border-radius:10px;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;text-decoration:none;">Revoir mon analyse →</a>
  </div>

  <!-- CTA rapport complet -->
  <div style="background:#FBF0EB;border:1px solid rgba(217,119,87,0.2);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
    <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Offre de lancement · jusqu'au 15 avril 2026</div>
    <div style="font-family:Georgia,serif;font-size:16px;color:#1A1916;margin-bottom:6px;">Rapport complet avec toutes les recommandations</div>
    <div style="font-size:12px;color:#8A8680;font-family:system-ui;margin-bottom:16px;">Diagnostic · méthode · exemple concret · impact attendu pour chaque critère</div>
    <a href="${resultsLink}" style="display:inline-block;background:#D97757;color:#fff;padding:13px 28px;border-radius:9px;font-family:system-ui,sans-serif;font-size:14px;font-weight:700;text-decoration:none;">Voir le rapport complet — 19,99€ →</a>
    <div style="font-family:monospace;font-size:9px;color:#C2BDB8;margin-top:10px;letter-spacing:1px;">au lieu de 59,99€ · paiement unique</div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;font-family:monospace;font-size:10px;color:#C2BDB8;letter-spacing:1px;line-height:1.8;">
    Detekia — par Beeleven SASU · Paris<br>
    <a href="https://www.detekia.fr" style="color:#C2BDB8;text-decoration:none;">detekia.fr</a>
    · Vous recevez cet email car vous avez analysé votre site sur Detekia.
  </div>

</div>
</body>
</html>`,
    });

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
