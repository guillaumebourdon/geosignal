import Stripe from 'stripe';
import { Redis } from '@upstash/redis';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const config = {
  api: { bodyParser: false },
  maxDuration: 60, // Correction 3: explicit maxDuration to avoid Vercel timeout → Stripe retry loops
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const rawEmail = session.customer_details?.email;
    const amount  = session.amount_total;

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (rawEmail && !emailRegex.test(rawEmail)) {
      console.warn(`[webhook] Invalid email format: ${rawEmail} — session ${session.id}. Continuing without email.`);
    }
    const email = rawEmail && emailRegex.test(rawEmail) ? rawEmail : null;

    // Correction 1: Idempotence — skip if this session was already processed
    const idempotencyKey = `webhook:processed:${session.id}`;
    try {
      const alreadyProcessed = await redis.set(idempotencyKey, '1', { nx: true, ex: 24 * 60 * 60 });
      if (!alreadyProcessed) {
        console.log(`[webhook] Idempotent skip — session ${session.id} already processed`);
        return res.status(200).json({ received: true, skipped: true });
      }
    } catch (e) {
      // Redis error → continue processing (fail-open to not block payments)
      console.error('[webhook] Idempotency check failed:', e.message);
    }

    // Correction 2: Identify plan from metadata (not amount)
    let plan = session.metadata?.plan;
    if (!plan) {
      // Fallback: infer from amount (legacy sessions without metadata)
      plan = amount >= 9900 ? 'pro' : 'rapport';
      console.warn(`[webhook] Plan missing from metadata, inferred from amount: ${plan} (amount=${amount})`);
    }

    if (email && (amount >= 0 || plan)) {
      const key = `paid:${email.toLowerCase()}`;
      await redis.set(key, {
        email, amount, plan,
        sessionId: session.id,
        date: new Date().toISOString(),
      }, { ex: 30 * 24 * 60 * 60 });

      // Store customer info for SAV — indexed by session ID for later retrieval by finalize endpoints
      const CUSTOMER_TTL = 3 * 365 * 24 * 60 * 60; // 3 years
      try {
        await redis.set(`detekia:customer:${session.id}`, {
          customerEmail: email,
          customerName: session.customer_details?.name || null,
          customerCountry: session.customer_details?.address?.country || null,
          customerStripeId: session.customer || null,
          paymentIntentId: session.payment_intent || null,
          purchaseDate: new Date().toISOString(),
          plan,
          amount,
          couponUsed: session.metadata?.coupon || null,
          locale: session.metadata?.locale || 'fr',
          url: session.metadata?.url || null,
        }, { ex: CUSTOMER_TTL });
      } catch (e) {
        console.error('[webhook] Customer info store failed:', e.message);
        try {
          const { Resend } = require('resend');
          const alertResend = new Resend(process.env.RESEND_API_KEY);
          await alertResend.emails.send({
            from: 'Detekia <hello@detekia.fr>',
            to: 'guillaume@beeleven.fr',
            subject: `⚠️ Customer info store failed — session ${session.id}`,
            html: `<div style="font-family:system-ui;max-width:480px;padding:24px;">
              <h2 style="color:#D97757;">Customer info Redis write failed</h2>
              <p><strong>Session :</strong> ${session.id}</p>
              <p><strong>Email :</strong> ${email || 'N/A'}</p>
              <p><strong>Erreur :</strong> ${e.message}</p>
              <p style="color:#D97757;font-weight:bold;">Action : vérifier Redis et les données client.</p>
            </div>`,
          }).catch(alertErr => console.error('[webhook] Alert email also failed:', alertErr.message));
        } catch (_) {}
      }

      const { maskEmail } = require('../../lib/maskEmail');
      console.log(`✅ Paiement validé pour ${maskEmail(email)} — plan: ${plan}, amount: ${amount}, session: ${session.id}`);

      // Auto-trigger Pro audit if plan is pro
      if (plan === 'pro' && session.metadata?.url) {
        try {
          const proto = req.headers['x-forwarded-proto'] || 'https';
          const host = req.headers['host'] || 'detekia.fr';
          const baseUrl = `${proto}://${host}`;
          const { createSiteAuditJob } = require('../../lib/proQueue');

          // Retrieve customer-selected pages from Redis (stored by create-checkout, Stripe metadata limited to 500 chars)
          let customerPages;
          if (session.metadata?.pagesKey) {
            try {
              const pagesData = await redis.get(session.metadata.pagesKey);
              if (pagesData) customerPages = typeof pagesData === 'string' ? JSON.parse(pagesData) : pagesData;
            } catch { customerPages = undefined; }
          }

          const result = await createSiteAuditJob(session.metadata.url, { baseUrl, locale: session.metadata.locale || 'fr', pages: customerPages });
          // Store job metadata
          const JOB_TTL = 24 * 60 * 60;
          await redis.set(`detekia:pro:v1:job:${result.siteJobId}:total`, result.queuedCount, { ex: JOB_TTL });
          await redis.set(`detekia:pro:v1:job:${result.siteJobId}:meta`, {
            rootUrl: session.metadata.url, locale: session.metadata.locale || 'fr',
            customerEmail: email, source: result.source, queuedAt: new Date().toISOString(), urls: result.urls,
            stripeSessionId: session.id, // Corrélation ID pour traçabilité
          }, { ex: JOB_TTL });
          console.log(`🚀 Pro audit triggered for ${session.metadata.url} — job ${result.siteJobId}, pages: ${result.queuedCount}`);

          // Send confirmation email to customer
          if (email) {
            try {
              const { Resend } = require('resend');
              const confirmResend = new Resend(process.env.RESEND_API_KEY);
              const siteUrl = session.metadata.url;
              const loc = session.metadata.locale || 'fr';
              const isFr = loc !== 'en';

              await confirmResend.emails.send({
                from: 'Detekia <hello@detekia.fr>',
                to: email,
                bcc: 'guillaume@beeleven.fr',
                subject: isFr
                  ? `Detekia — Votre audit GEO est en cours`
                  : `Detekia — Your GEO audit is in progress`,
                html: isFr ? `
<div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:0;">
  <!-- Header -->
  <div style="background:#1A1916;border-radius:16px 16px 0 0;padding:36px 32px 28px;text-align:center;">
    <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:20px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;width:16px;height:16px;">
        <div style="background:#10A37F;border-radius:50%;"></div>
        <div style="background:#D97757;border-radius:50%;"></div>
        <div style="background:#4285F4;border-radius:50%;"></div>
        <div style="background:#1C7DC4;border-radius:50%;"></div>
      </div>
      <span style="font-family:Georgia,serif;font-size:16px;color:#F7F5F2;font-weight:bold;">Detekia</span>
    </div>
    <div style="width:56px;height:56px;border-radius:50%;background:rgba(16,163,127,0.12);border:2px solid rgba(16,163,127,0.25);display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
      <span style="font-size:24px;">&#10003;</span>
    </div>
    <h1 style="font-family:Georgia,serif;font-size:24px;color:#F7F5F2;margin:0 0 6px;line-height:1.2;">Paiement confirme !</h1>
    <p style="font-size:14px;color:#C4B5A3;margin:0;">Votre audit complet est lance.</p>
  </div>

  <!-- Body -->
  <div style="background:#fff;border:1px solid #E5E2DC;border-top:none;border-radius:0 0 16px 16px;padding:32px;">
    <p style="font-size:15px;color:#1A1916;line-height:1.7;margin:0 0 20px;">
      Bonjour,
    </p>
    <p style="font-size:15px;color:#1A1916;line-height:1.7;margin:0 0 20px;">
      Merci pour votre confiance ! Notre IA est en train d'analyser <strong>${siteUrl}</strong> en profondeur.
    </p>

    <!-- What's happening -->
    <div style="background:#F7F5F2;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-family:monospace;font-size:10px;color:#D97757;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px;">Ce qui se passe en ce moment</div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="color:#10A37F;font-size:14px;">&#10003;</span>
        <span style="font-size:13px;color:#1A1916;">Paiement recu et valide</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="color:#D97757;font-size:14px;">&#9679;</span>
        <span style="font-size:13px;color:#1A1916;">Analyse de vos ${result.queuedCount} pages en cours</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="color:#B0ABA5;font-size:14px;">&#9675;</span>
        <span style="font-size:13px;color:#8A8680;">Generation du rapport</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="color:#B0ABA5;font-size:14px;">&#9675;</span>
        <span style="font-size:13px;color:#8A8680;">Envoi par email</span>
      </div>
    </div>

    <!-- Timing -->
    <div style="background:rgba(217,119,87,0.06);border-left:3px solid #D97757;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="font-size:14px;color:#1A1916;line-height:1.6;margin:0;">
        <strong>Temps estime :</strong> 15 a 20 minutes. Vous recevrez votre rapport complet a <strong>${email}</strong> des qu'il sera pret.
      </p>
    </div>

    <p style="font-size:14px;color:#6B6762;line-height:1.6;margin:0 0 24px;">
      Vous pouvez fermer cette page en toute tranquillite — l'analyse continue en arriere-plan. Aucune action de votre part n'est necessaire.
    </p>

    <!-- Spam notice -->
    <div style="background:#F7F5F2;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
      <p style="font-size:12px;color:#6B6762;line-height:1.5;margin:0;">
        <strong style="color:#1A1916;">Pensez a verifier vos spams.</strong> Notre email peut atterrir dans les indesirables. Expediteur : <code style="background:rgba(217,119,87,0.08);padding:2px 6px;border-radius:4px;font-size:11px;color:#D97757;">hello@detekia.fr</code>
      </p>
    </div>

    <!-- Footer -->
    <p style="font-size:12px;color:#B0ABA5;text-align:center;margin:0;">
      Une question ? Repondez a cet email ou ecrivez-nous a <a href="mailto:hello@detekia.fr" style="color:#D97757;text-decoration:none;">hello@detekia.fr</a>
    </p>
  </div>
</div>
` : `
<div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:0;">
  <div style="background:#1A1916;border-radius:16px 16px 0 0;padding:36px 32px 28px;text-align:center;">
    <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:20px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;width:16px;height:16px;">
        <div style="background:#10A37F;border-radius:50%;"></div>
        <div style="background:#D97757;border-radius:50%;"></div>
        <div style="background:#4285F4;border-radius:50%;"></div>
        <div style="background:#1C7DC4;border-radius:50%;"></div>
      </div>
      <span style="font-family:Georgia,serif;font-size:16px;color:#F7F5F2;font-weight:bold;">Detekia</span>
    </div>
    <div style="width:56px;height:56px;border-radius:50%;background:rgba(16,163,127,0.12);border:2px solid rgba(16,163,127,0.25);display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
      <span style="font-size:24px;">&#10003;</span>
    </div>
    <h1 style="font-family:Georgia,serif;font-size:24px;color:#F7F5F2;margin:0 0 6px;line-height:1.2;">Payment confirmed!</h1>
    <p style="font-size:14px;color:#C4B5A3;margin:0;">Your full audit has been launched.</p>
  </div>
  <div style="background:#fff;border:1px solid #E5E2DC;border-top:none;border-radius:0 0 16px 16px;padding:32px;">
    <p style="font-size:15px;color:#1A1916;line-height:1.7;margin:0 0 20px;">Hi there,</p>
    <p style="font-size:15px;color:#1A1916;line-height:1.7;margin:0 0 20px;">Thank you for your trust! Our AI is currently analyzing <strong>${siteUrl}</strong> in depth.</p>
    <div style="background:#F7F5F2;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-family:monospace;font-size:10px;color:#D97757;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px;">What's happening now</div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="color:#10A37F;font-size:14px;">&#10003;</span><span style="font-size:13px;color:#1A1916;">Payment received and validated</span></div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="color:#D97757;font-size:14px;">&#9679;</span><span style="font-size:13px;color:#1A1916;">Analyzing your ${result.queuedCount} pages</span></div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="color:#B0ABA5;font-size:14px;">&#9675;</span><span style="font-size:13px;color:#8A8680;">Report generation</span></div>
      <div style="display:flex;align-items:center;gap:10px;"><span style="color:#B0ABA5;font-size:14px;">&#9675;</span><span style="font-size:13px;color:#8A8680;">Email delivery</span></div>
    </div>
    <div style="background:rgba(217,119,87,0.06);border-left:3px solid #D97757;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="font-size:14px;color:#1A1916;line-height:1.6;margin:0;"><strong>Estimated time:</strong> 15-20 minutes. Your full report will be sent to <strong>${email}</strong> as soon as it's ready.</p>
    </div>
    <p style="font-size:14px;color:#6B6762;line-height:1.6;margin:0 0 24px;">You can safely close this page — the analysis continues in the background.</p>
    <div style="background:#F7F5F2;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
      <p style="font-size:12px;color:#6B6762;line-height:1.5;margin:0;"><strong style="color:#1A1916;">Check your spam folder.</strong> Our email might land in junk. Sender: <code style="background:rgba(217,119,87,0.08);padding:2px 6px;border-radius:4px;font-size:11px;color:#D97757;">hello@detekia.fr</code></p>
    </div>
    <p style="font-size:12px;color:#B0ABA5;text-align:center;margin:0;">Questions? Reply to this email or write to <a href="mailto:hello@detekia.fr" style="color:#D97757;text-decoration:none;">hello@detekia.fr</a></p>
  </div>
</div>
`,
              });
              console.log(`[webhook] Confirmation email sent to ${maskEmail(email)} for Pro audit`);
            } catch (emailErr) {
              console.error('[webhook] Confirmation email failed:', emailErr.message);
            }
          }

          // SAFEGUARD: alert if page count is critically low
          if (result.queuedCount < 5) {
            const { Resend } = require('resend');
            const alertResend = new Resend(process.env.RESEND_API_KEY);
            await alertResend.emails.send({
              from: 'Detekia <hello@detekia.fr>',
              to: 'guillaume@beeleven.fr',
              subject: `⚠️ ALERTE Pro audit dégradé — ${result.queuedCount} pages seulement — ${session.metadata.url}`,
              html: `<div style="font-family:system-ui;max-width:480px;padding:24px;">
                <h2 style="color:#D97757;">Audit Pro dégradé détecté</h2>
                <p><strong>Site :</strong> ${session.metadata.url}</p>
                <p><strong>Pages trouvées :</strong> ${result.queuedCount} (attendu : ~10)</p>
                <p><strong>Email client :</strong> ${email}</p>
                <p><strong>Job ID :</strong> ${result.siteJobId}</p>
                <p><strong>Session Stripe :</strong> ${session.id}</p>
                <p><strong>Cause probable :</strong> Sitemap inaccessible (anti-bot) + crawler fallback bloqué</p>
                <p style="color:#D97757;font-weight:bold;">Action requise : vérifier le rapport et potentiellement re-lancer manuellement.</p>
              </div>`,
            }).catch(e => console.error('Alert email failed:', e.message));
          }
        } catch (e) {
          console.error('Pro auto-trigger failed:', e.message);
        }
      }
    }
  }

  res.status(200).json({ received: true });
}

// Future improvements:
// - Add full ID correlation chain (session.id → siteJobId → report uuid)
// - Move DELETE_REPORT_SECRET and PRO_ADMIN_SECRET to Authorization headers
