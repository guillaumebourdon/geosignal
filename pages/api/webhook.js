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

    if (email && amount >= 900) {
      // Stocker le paiement dans Redis — valide 30 jours
      const key = `paid:${email.toLowerCase()}`;
      await redis.set(key, { 
        email, 
        amount, 
        date: new Date().toISOString(),
        plan: amount >= 2900 ? 'pro' : 'rapport'
      }, { ex: 30 * 24 * 60 * 60 });
      
      const { maskEmail } = require('../../lib/maskEmail');
      console.log(`✅ Paiement validé pour ${maskEmail(email)} — plan: ${amount >= 2900 ? 'pro' : 'rapport'}`);
    }
  }

  res.status(200).json({ received: true });
}