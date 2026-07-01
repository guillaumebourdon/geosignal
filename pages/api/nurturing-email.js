import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { Receiver } from '@upstash/qstash';

const resend = new Resend(process.env.RESEND_API_KEY);
const redis = Redis.fromEnv();

export const maxDuration = 30;

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
});

// Shared email wrapper
function emailShell(content) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F5F2;font-family:system-ui,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-flex;align-items:center;gap:10px;">
      <table cellpadding="0" cellspacing="0" style="display:inline-table;">
        <tr><td style="width:8px;height:8px;background:#10A37F;border-radius:50%;padding:0;"></td><td style="width:2px;"></td><td style="width:8px;height:8px;background:#D97757;border-radius:50%;padding:0;"></td></tr>
        <tr><td colspan="3" style="height:2px;"></td></tr>
        <tr><td style="width:8px;height:8px;background:#4285F4;border-radius:50%;padding:0;"></td><td style="width:2px;"></td><td style="width:8px;height:8px;background:#1C7DC4;border-radius:50%;padding:0;"></td></tr>
      </table>
      <span style="font-family:Georgia,serif;font-size:22px;color:#1A1916;font-weight:400;margin-left:8px;">Detekia</span>
    </div>
  </div>
  ${content}
  <div style="text-align:center;font-family:monospace;font-size:10px;color:#C2BDB8;letter-spacing:1px;line-height:1.8;margin-top:32px;">
    Detekia — par Beeleven SASU · Paris<br>
    <a href="https://www.detekia.fr" style="color:#C2BDB8;text-decoration:none;">detekia.fr</a>
    · <a href="mailto:hello@detekia.fr?subject=Désabonnement" style="color:#C2BDB8;text-decoration:underline;">Se désabonner</a>
  </div>
</div>
</body>
</html>`;
}

function buildStep2Email(lead) {
  const { url, score } = lead;
  const site = url || 'votre site';
  const resultsLink = `https://www.detekia.fr/results?url=${encodeURIComponent(url || '')}`;

  return {
    subject: `${site} — vos concurrents sont-ils visibles pour ChatGPT ?`,
    html: emailShell(`
      <div style="background:#fff;border:1px solid #E5E2DC;border-radius:12px;padding:28px;margin-bottom:24px;">
        <div style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-bottom:14px;">Pendant que vous lisez cet email, vos concurrents sont peut-être déjà cités par ChatGPT.</div>
        <div style="font-size:13px;color:#6B6762;line-height:1.8;margin-bottom:16px;">
          Vous avez obtenu <strong style="color:#1A1916;">${score}/100</strong> sur ${site}. Voici ce que ça signifie concrètement :
        </div>
        <div style="font-size:13px;color:#6B6762;line-height:1.8;margin-bottom:20px;">
          <strong style="color:#1A1916;">📊 Le marché bouge vite :</strong><br>
          · 810 millions de personnes utilisent ChatGPT chaque jour<br>
          · Les visiteurs IA convertissent <strong>4,4× mieux</strong> que les visiteurs Google<br>
          · 80% des sites cités par ChatGPT ne sont <strong>pas</strong> dans le top 100 Google<br>
          · 73% des sites bloquent les bots IA sans le savoir
        </div>
        <div style="font-size:13px;color:#6B6762;line-height:1.8;margin-bottom:20px;">
          ${score < 50
            ? `Avec un score de ${score}/100, votre site est quasiment invisible pour les IA. Les bonnes nouvelles : les corrections sont souvent simples (données structurées, restructuration du contenu, signaux d'autorité).`
            : score < 70
            ? `Votre score de ${score}/100 montre des bases, mais vos concurrents optimisés vous devancent. Quelques ajustements ciblés peuvent faire la différence.`
            : `Votre score de ${score}/100 est encourageant, mais il y a encore de la marge. Les sites les mieux optimisés dépassent 80/100.`}
        </div>
        <a href="${resultsLink}" style="display:block;text-align:center;background:#1A1916;color:#F7F5F2;padding:14px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;margin-bottom:8px;">Revoir mon analyse détaillée →</a>
      </div>

      <div style="background:#1A1916;border-radius:12px;padding:28px;text-align:center;">
        <div style="font-family:Georgia,serif;font-size:17px;color:#F7F5F2;margin-bottom:8px;">Vous voulez savoir exactement quoi corriger ?</div>
        <div style="font-size:12px;color:rgba(247,245,242,0.5);line-height:1.6;margin-bottom:16px;">Un appel de 15 minutes suffit pour identifier les 3 actions les plus impactantes pour votre site.</div>
        <a href="https://detekia.fr/contact" style="display:inline-block;background:#D97757;color:#fff;padding:13px 28px;border-radius:9px;font-size:14px;font-weight:700;text-decoration:none;">Réserver un appel gratuit →</a>
        <div style="font-size:11px;color:rgba(247,245,242,0.3);margin-top:10px;">Sans engagement · 15 min · Recommandations concrètes</div>
      </div>
    `),
  };
}

function buildStep3Email(lead) {
  const { url, score } = lead;
  const site = url || 'votre site';

  return {
    subject: `${site} — on peut en discuter ?`,
    html: emailShell(`
      <div style="background:#fff;border:1px solid #E5E2DC;border-radius:12px;padding:28px;margin-bottom:24px;">
        <div style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-bottom:14px;">Guillaume, fondateur de Detekia</div>
        <div style="font-size:13px;color:#6B6762;line-height:1.8;">
          <p>Bonjour,</p>
          <p>Vous avez analysé ${site} sur Detekia il y a quelques jours (score : ${score}/100). Je me permets de revenir vers vous parce que j'ai vu passer votre analyse et je pense qu'on peut améliorer significativement votre visibilité IA.</p>
          <p>Concrètement, voici ce qu'on fait chez Beeleven pour des sites avec votre profil :</p>
          <ul style="padding-left:20px;margin:16px 0;">
            <li style="margin-bottom:8px;"><strong>Restructuration du contenu</strong> — on réécrit vos pages clés pour qu'elles soient extractibles par les IA (capsules de réponse, front-loading)</li>
            <li style="margin-bottom:8px;"><strong>Données structurées</strong> — on ajoute les schémas JSON-LD qui manquent (Organization, Person, FAQ, Article)</li>
            <li style="margin-bottom:8px;"><strong>Signaux d'autorité</strong> — on renforce votre E-E-A-T (pages auteur, mentions légales, preuves sociales)</li>
            <li style="margin-bottom:8px;"><strong>Suivi dans le temps</strong> — on mesure l'évolution de votre score et de vos citations IA chaque mois</li>
          </ul>
          <p>Si ça vous parle, on peut en discuter 15 minutes. C'est gratuit et sans engagement — je vous donne mes recommandations, et vous décidez ensuite si vous voulez qu'on les implémente.</p>
          <p style="margin-bottom:0;">Guillaume Bourdon<br><span style="color:#B0ABA5;">Fondateur Detekia · Beeleven SASU</span></p>
        </div>
      </div>

      <div style="text-align:center;">
        <a href="https://detekia.fr/contact" style="display:inline-block;background:#D97757;color:#fff;padding:15px 36px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">Réserver un appel de 15 min →</a>
        <div style="font-size:12px;color:#B0ABA5;margin-top:12px;">Ou répondez directement à cet email</div>
      </div>
    `),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Verify QStash signature
  try {
    const signature = req.headers['upstash-signature'];
    if (signature) {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const isValid = await receiver.verify({ signature, body, url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://detekia.fr'}/api/nurturing-email` });
      if (!isValid) return res.status(401).json({ error: 'Invalid QStash signature' });
    }
  } catch (e) {
    console.warn('[nurturing] QStash verification failed:', e.message);
  }

  const { email, step } = req.body;
  if (!email || !step) return res.status(400).json({ error: 'Missing email or step' });

  try {
    // Check if lead still exists and hasn't unsubscribed
    const leadData = await redis.get(`leads:${email.toLowerCase()}`);
    if (!leadData) {
      console.log(`[nurturing] Lead ${email} not found in Redis, skipping step ${step}`);
      return res.status(200).json({ skipped: true, reason: 'lead_not_found' });
    }

    const lead = typeof leadData === 'string' ? JSON.parse(leadData) : leadData;

    // Check if already sent (idempotence)
    const sentKey = `nurturing:${email.toLowerCase()}:step${step}`;
    const alreadySent = await redis.get(sentKey);
    if (alreadySent) {
      console.log(`[nurturing] Step ${step} already sent to ${email}, skipping`);
      return res.status(200).json({ skipped: true, reason: 'already_sent' });
    }

    let emailContent;
    if (step === 2) {
      emailContent = buildStep2Email(lead);
    } else if (step === 3) {
      emailContent = buildStep3Email(lead);
    } else {
      return res.status(400).json({ error: `Unknown step: ${step}` });
    }

    await resend.emails.send({
      from: 'Guillaume · Detekia <hello@detekia.fr>',
      to: email,
      replyTo: 'guillaume@beeleven.fr',
      bcc: 'guillaume@beeleven.fr',
      subject: emailContent.subject,
      html: emailContent.html,
    });

    // Mark as sent (TTL 90 days)
    await redis.set(sentKey, new Date().toISOString(), { ex: 90 * 24 * 60 * 60 });

    console.log(`[nurturing] Step ${step} sent to ${email}`);
    return res.status(200).json({ success: true, step, email });
  } catch (e) {
    console.error(`[nurturing] Error step ${step} for ${email}:`, e.message);
    return res.status(500).json({ error: e.message });
  }
}
