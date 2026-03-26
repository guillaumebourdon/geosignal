import Stripe from 'stripe';
import { Redis } from '@upstash/redis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'session_id manquant' });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const email   = session.customer_details?.email;
    const url     = session.metadata?.url;

    if (email) {
      // Stocker le paiement dans Redis
      await redis.set(`paid:${email.toLowerCase()}`, {
        email,
        amount: session.amount_total,
        date: new Date().toISOString(),
        plan: session.amount_total >= 2900 ? 'pro' : 'rapport',
      }, { ex: 30 * 24 * 60 * 60 });

      // Récupérer le rapport depuis le cache Redis
      if (url) {
        const cacheKey = `detekia:${url.toLowerCase().trim()}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
          // Envoyer l'email avec le rapport
          await fetch(`${req.headers.origin}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              url,
              score: cached.score,
              criteria: cached.criteria,
              recommendations: cached.recommendations,
              verdict: cached.verdict,
            }),
          });
        }
      }

      return res.status(200).json({ email, success: true });
    }

    return res.status(400).json({ error: 'Email non trouvé' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}