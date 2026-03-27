import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { plan, url } = req.body;

  const prices = {
    rapport: {
      name: 'Detekia — Rapport complet',
      amount: 900, // 9€ en centimes
      mode: 'payment',
    },
    pro: {
      name: 'Detekia Pro',
      amount: 2900, // 29€ en centimes
      mode: 'subscription',
    },
  };

  const selected = prices[plan];
  if (!selected) return res.status(400).json({ error: 'Plan invalide' });

  const origin = req.headers.origin;
  const encodedUrl = url ? encodeURIComponent(url) : '';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: selected.mode,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: selected.name },
          unit_amount: selected.amount,
          ...(selected.mode === 'subscription' && { recurring: { interval: 'month' } }),
        },
        quantity: 1,
      }],
      metadata: { url: url || '' },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}${encodedUrl ? `&url=${encodedUrl}` : ''}`,
      cancel_url: `${origin}${url ? `/results?url=${encodedUrl}` : '/pricing'}`,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}