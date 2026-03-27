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

      return res.status(200).json({ email, url: url || null, success: true });
    }

    return res.status(400).json({ error: 'Email non trouvé' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}