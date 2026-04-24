import { Resend } from 'resend';
import Stripe from 'stripe';

export const config = { maxDuration: 60 };

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── Loyalty promo code generation ──────────────────────────────────────────

const LOYALTY_STRINGS = {
  fr: {
    mentionInBody: "Tu veux analyser une autre URL ? J'ai glisse un code -50% plus bas, valable 30 jours.",
    eyebrow: 'Pour votre prochaine analyse',
    title: '50% de reduction',
    body: "Envie d'analyser une autre page de votre site, ou un autre projet ? Utilisez ce code au checkout sur detekia.fr/pricing.",
    footerNote: 'Valable 30 jours · Utilisable une seule fois',
  },
  en: {
    mentionInBody: "Want to analyze another URL? I've tucked a -50% discount code below, valid for 30 days.",
    eyebrow: 'For your next analysis',
    title: '50% off',
    body: 'Want to analyze another page of your site, or a different project? Use this code at checkout on detekia.fr/pricing.',
    footerNote: 'Valid 30 days · Single use',
  },
};

async function generateLoyaltyCode(sessionId, url, email, locale) {
  const COUPON_ID = process.env.STRIPE_LOYALTY_COUPON_ID;
  if (!COUPON_ID) {
    console.error('[loyalty] STRIPE_LOYALTY_COUPON_ID not set, skipping promo code generation');
    return null;
  }

  const expiresAt = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);

  for (let attempt = 0; attempt < 3; attempt++) {
    const promoCode = `DETK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    try {
      await stripe.promotionCodes.create({
        coupon: COUPON_ID,
        code: promoCode,
        max_redemptions: 1,
        expires_at: expiresAt,
        metadata: {
          type: 'post_purchase_loyalty',
          original_session_id: sessionId || 'unknown',
          original_url: url || 'unknown',
          locale: locale || 'fr',
        },
      });
      const { maskEmail } = require('../../lib/maskEmail');
      console.log(`[loyalty] Generated code ${promoCode} for ${maskEmail(email)} (url: ${url}, locale: ${locale})`);
      return promoCode;
    } catch (err) {
      if (err.code === 'resource_already_exists' && attempt < 2) {
        console.log(`[loyalty] Code collision on attempt ${attempt + 1}, retrying...`);
        continue;
      }
      console.error('[loyalty] Failed to create promo code:', err.message);
      return null;
    }
  }
  return null;
}

// ─── Report template (shared with preview-report.js) ────────────────────────
const { generateReportHTML, S } = require('../../lib/oneReportTemplate');

// ─── (legacy i18n strings removed — now in lib/oneReportTemplate.js) ────────
// kept as comment for git blame reference


// ─── API Handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, url, reportData, locale: reqLocale, isFreeViaPromo } = req.body;
  const locale = reqLocale === 'en' ? 'en' : 'fr';
  const t = S[locale] || S.fr;
  if (!email || !reportData) return res.status(400).json({ error: 'Missing data' });

  try {
    const html = generateReportHTML({ url, ...reportData }, locale);

    console.log('Starting PDFShift...');
    const pdfResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('api:' + process.env.PDFSHIFT_API_KEY).toString('base64'),
      },
      body: JSON.stringify({ source: html, landscape: false, use_print: true, format: 'A4', margin: { top: '0', right: '0', bottom: '0', left: '0' } }),
      signal: AbortSignal.timeout(50000),
    });

    if (!pdfResponse.ok) {
      const errText = await pdfResponse.text();
      throw new Error(`PDFShift error: ${pdfResponse.status} ${errText}`);
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
    console.log('PDF generated, size:', pdfBuffer.length);

    // Generate loyalty promo code (non-blocking if it fails)
    const loyaltyCode = await generateLoyaltyCode(null, url, email, locale);
    const ls = LOYALTY_STRINGS[locale] || LOYALTY_STRINGS.fr;

    const EMAIL_BODY = locale === 'en' ? {
      greeting: 'Hi there,',
      thanks: `Thanks so much for your trust — your full GEO report for <strong>${url}</strong> is attached.`,
      insideTitle: "Inside your report:",
      inside: [
        'A detailed score across 8 GEO criteria',
        'A real AI visibility test on 10 simulated queries',
        'Precise recommendations ranked by impact priority',
        'A concrete action plan',
      ],
      whereToStart: "Where to start? Tackle the top priority identified in your report first. It was selected because it offers the best impact-to-effort ratio for your site specifically.",
      stuckLine: "If you get stuck anywhere: reply directly to this email, I'll answer personally.",
      feedbackLine: "Detekia is a young project — your feedback is worth its weight in gold.",
      signoff: 'Happy optimizing!',
      name: 'Guillaume',
      role: 'Founder of Detekia — detekia.fr',
      ps: "P.S. — The GEO landscape moves fast. I write regularly on the blog: detekia.fr/blog",
    } : {
      greeting: 'Salut,',
      thanks: `Merci beaucoup pour ta confiance — ton rapport GEO complet pour <strong>${url}</strong> est en piece jointe.`,
      insideTitle: 'Tu y trouveras :',
      inside: [
        'Un score detaille sur les 8 criteres GEO',
        'Un test reel de visibilite IA sur 10 requetes simulees',
        'Des recommandations precises, classees par priorite d\'impact',
        'Un plan d\'action concret',
      ],
      whereToStart: "Par ou commencer ? Attaque-toi d'abord a la priorite absolue identifiee dans ton rapport. Elle a ete selectionnee parce qu'elle offre le meilleur ratio impact/effort pour ton site specifiquement.",
      stuckLine: "Si tu bloques quelque part : reponds directement a cet email, je te reponds moi-meme.",
      feedbackLine: "Detekia est un jeune projet — ton feedback vaut de l'or.",
      signoff: 'Bonne optimisation !',
      name: 'Guillaume',
      role: 'Fondateur de Detekia — detekia.fr',
      ps: 'P.S. — Le monde du GEO evolue vite. J\'ecris regulierement sur le blog : detekia.fr/blog',
    };

    const promoMention = loyaltyCode ? `<p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0 0 16px">${ls.mentionInBody}</p>` : '';

    const promoBlock = loyaltyCode ? `
      <div style="margin:32px 0;padding:24px;background:#F7F5F2;border-left:4px solid #C9A84C;border-radius:8px">
        <div style="font-family:monospace;font-size:11px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px">${ls.eyebrow}</div>
        <div style="font-family:Georgia,serif;font-size:22px;color:#1A1916;margin-bottom:8px">${ls.title}</div>
        <div style="font-family:system-ui;font-size:14px;color:#3A3835;line-height:1.6;margin-bottom:16px">${ls.body}</div>
        <div style="background:#1A1916;color:#C9A84C;font-family:monospace;font-size:20px;font-weight:bold;padding:16px 24px;border-radius:6px;text-align:center;letter-spacing:3px">${loyaltyCode}</div>
        <div style="font-family:system-ui;font-size:12px;color:#8A8680;margin-top:12px;text-align:center">${ls.footerNote}</div>
      </div>
    ` : '';

    const { data, error } = await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: email,
      subject: `${t.email.subject} — ${url} · Score ${reportData.score}/100`,
      html: `
        <div style="background:#F7F5F2;padding:40px 20px;font-family:system-ui">
          <div style="max-width:560px;margin:0 auto">
            <!-- Header -->
            <div style="text-align:center;margin-bottom:32px">
              <div style="font-family:Georgia,serif;font-size:22px;color:#1A1916;margin-bottom:8px">Detekia</div>
              <div style="font-family:monospace;font-size:10px;color:#8A8680;letter-spacing:2px">${t.email.headerLabel}</div>
            </div>
            <!-- Score card -->
            <div style="background:#1A1916;border-radius:16px;padding:32px;text-align:center;margin-bottom:28px">
              <div style="font-family:Georgia,serif;font-size:64px;color:#F7F5F2;line-height:1;letter-spacing:-2px">${reportData.score}</div>
              <div style="font-family:monospace;font-size:12px;color:rgba(247,245,242,0.4);margin-top:4px">/100 — ${url}</div>
              <div style="font-size:13px;color:rgba(247,245,242,0.55);margin-top:12px;font-family:system-ui;line-height:1.6">${reportData.verdict}</div>
            </div>
            <!-- Body text -->
            <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #E5E2DC;margin-bottom:28px">
              <p style="font-size:15px;color:#1A1916;line-height:1.7;margin:0 0 16px">${EMAIL_BODY.greeting}</p>
              <p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0 0 16px">${EMAIL_BODY.thanks}</p>
              <p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0 0 8px;font-weight:600">${EMAIL_BODY.insideTitle}</p>
              <ul style="font-size:14px;color:#3A3835;line-height:1.8;margin:0 0 16px;padding-left:20px">
                ${EMAIL_BODY.inside.map(item => `<li>${item}</li>`).join('')}
              </ul>
              <p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0 0 16px">${EMAIL_BODY.whereToStart}</p>
              ${promoMention}
              <p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0 0 16px">${EMAIL_BODY.stuckLine}</p>
              <p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0 0 16px">${EMAIL_BODY.feedbackLine}</p>
              <p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0 0 4px">${EMAIL_BODY.signoff}</p>
              <p style="font-size:14px;color:#1A1916;line-height:1.7;margin:0 0 4px;font-weight:600">${EMAIL_BODY.name}</p>
              <p style="font-size:12px;color:#8A8680;line-height:1.5;margin:0">${EMAIL_BODY.role}</p>
            </div>
            <!-- Promo block -->
            ${promoBlock}
            <!-- Top priority reminder -->
            <div style="background:#fff;border-radius:12px;padding:20px 24px;border:1px solid #E5E2DC;margin-bottom:20px">
              <div style="font-size:13px;color:#1A1916;font-weight:600;margin-bottom:8px;font-family:system-ui">\u{1F3AF} ${t.email.topPriority}</div>
              <div style="font-size:13px;color:#8A8680;line-height:1.6;font-family:system-ui">${reportData.topPriority || ''}</div>
            </div>
            <!-- PS -->
            <div style="text-align:center;font-size:12px;color:#8A8680;font-family:system-ui;line-height:1.6;padding-top:8px">
              ${EMAIL_BODY.ps}
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `${t.email.filename}-${url.replace(/[^a-z0-9]/gi, '-')}.pdf`,
          content: Buffer.from(pdfBuffer).toString('base64'),
          content_type: 'application/pdf',
        },
      ],
    });

    if (error) return res.status(400).json({ error });

    // Notification to Guillaume (non-blocking)
    try {
      const now = new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
      const safeUrl = url || 'URL inconnue';
      const safeScore = reportData?.score ?? 'N/A';
      const safeVerdict = reportData?.verdict || '';
      const safeTopPriority = reportData?.topPriority || '';
      const notifSubject = isFreeViaPromo
        ? `\u{1F381} Test code promo 100% \u2014 ${safeUrl} \u2014 Score ${safeScore}/100`
        : `\u2705 Nouvelle vente Detekia \u2014 ${safeUrl} \u2014 Score ${safeScore}/100`;

      await resend.emails.send({
        from: 'Detekia <hello@detekia.fr>',
        to: 'guillaume@beeleven.fr',
        subject: notifSubject,
        html: `<div style="font-family:system-ui;max-width:560px;margin:0 auto;padding:24px;background:#F7F5F2;border-radius:12px;">
          <div style="font-family:Georgia,serif;font-size:20px;color:#1A1916;margin-bottom:16px;">${notifSubject}</div>
          <div style="background:#fff;border:1px solid #E5E2DC;border-radius:8px;padding:20px;margin-bottom:16px;">
            <div style="margin-bottom:8px;"><strong>Site analys\u00e9 :</strong> ${safeUrl}</div>
            <div style="margin-bottom:8px;"><strong>Score :</strong> ${safeScore}/100 \u2014 ${safeVerdict}</div>
            <div style="margin-bottom:8px;"><strong>Email client :</strong> ${email}</div>
            <div style="margin-bottom:8px;"><strong>Locale :</strong> ${locale.toUpperCase()}</div>
            <div style="margin-bottom:8px;"><strong>Heure :</strong> ${now}</div>
            <div style="margin-bottom:8px;"><strong>Code promo :</strong> ${isFreeViaPromo ? 'Oui (100%)' : 'Non'}</div>
          </div>
          <div style="background:#fff;border:1px solid #E5E2DC;border-radius:8px;padding:20px;">
            <div style="font-weight:600;margin-bottom:8px;">\u{1F3AF} Top priorit\u00e9 identifi\u00e9e :</div>
            <div style="color:#3A3835;line-height:1.6;">${safeTopPriority}</div>
          </div>
        </div>`,
      });
    } catch (notifErr) {
      console.error('Notification email to Guillaume failed:', notifErr.message);
    }

    return res.status(200).json({ success: true });

  } catch (e) {
    console.error('generate-pdf error:', e);

    // Error notification to Guillaume (best effort)
    try {
      await resend.emails.send({
        from: 'Detekia <hello@detekia.fr>',
        to: 'guillaume@beeleven.fr',
        subject: `\u26A0\uFE0F Achat re\u00e7u mais rapport en erreur \u2014 ${url || 'URL inconnue'} \u2014 ${email || 'email inconnu'}`,
        html: `<div style="font-family:system-ui;max-width:560px;margin:0 auto;padding:24px;">
          <div style="font-size:18px;color:#D97757;font-weight:600;margin-bottom:16px;">\u26A0\uFE0F Erreur generation PDF</div>
          <div style="background:#fff;border:1px solid #E5E2DC;border-radius:8px;padding:20px;">
            <div style="margin-bottom:8px;"><strong>Email client :</strong> ${email || 'N/A'}</div>
            <div style="margin-bottom:8px;"><strong>URL :</strong> ${url || 'N/A'}</div>
            <div style="margin-bottom:8px;"><strong>Erreur :</strong> ${e.message}</div>
            <pre style="font-size:11px;color:#8A8680;overflow-x:auto;margin-top:12px;">${e.stack || ''}</pre>
          </div>
        </div>`,
      });
    } catch (_) { /* ignore notification failure */ }

    console.error('[generate-pdf] Error:', e.message, e.stack);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
