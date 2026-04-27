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
    const email   = session.customer_details?.email;
    const amount  = session.amount_total;

    const plan = session.metadata?.plan || (amount >= 9900 ? 'pro' : 'rapport');
    if (email && (amount >= 900 || plan === 'pro')) {
      const key = `paid:${email.toLowerCase()}`;
      await redis.set(key, {
        email, amount, plan,
        date: new Date().toISOString(),
      }, { ex: 30 * 24 * 60 * 60 });

      const { maskEmail } = require('../../lib/maskEmail');
      console.log(`✅ Paiement validé pour ${maskEmail(email)} — plan: ${plan}`);

      // Auto-trigger Pro audit if plan is pro
      if (plan === 'pro' && session.metadata?.url) {
        try {
          const proto = req.headers['x-forwarded-proto'] || 'https';
          const host = req.headers['host'] || 'detekia.fr';
          const baseUrl = `${proto}://${host}`;
          const { createSiteAuditJob } = require('../../lib/proQueue');
          const result = await createSiteAuditJob(session.metadata.url, { baseUrl, locale: session.metadata.locale || 'fr' });
          // Store job metadata
          const JOB_TTL = 24 * 60 * 60;
          await redis.set(`detekia:pro:v1:job:${result.siteJobId}:total`, result.queuedCount, { ex: JOB_TTL });
          await redis.set(`detekia:pro:v1:job:${result.siteJobId}:meta`, {
            rootUrl: session.metadata.url, locale: session.metadata.locale || 'fr',
            customerEmail: email, queuedAt: new Date().toISOString(), urls: result.urls,
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
                <p><strong>Pages trouvées :</strong> ${result.queuedCount} (attendu : ~20)</p>
                <p><strong>Email client :</strong> ${email}</p>
                <p><strong>Job ID :</strong> ${result.siteJobId}</p>
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