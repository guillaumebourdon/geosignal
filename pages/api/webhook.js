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
