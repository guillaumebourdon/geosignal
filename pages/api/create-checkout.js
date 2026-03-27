import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { plan, url, score } = req.body;

  const prices = {
    rapport: {
      name: 'Detekia — Rapport GEO complet',
      amount: 2900, // 29€ en centimes
      mode: 'payment',
    },
  };

  const selected = prices[plan];
  if (!selected) return res.status(400).json({ error: 'Plan invalide' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: selected.mode,
      ui_mode: 'embedded',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: selected.name },
          unit_amount: selected.amount,
        },
        quantity: 1,
      }],
      metadata: {
        url: url || '',
        score: score != null ? String(score) : '',
      },
      return_url: `https://www.detekia.fr/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}