import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { plan, url, score, locale: reqLocale } = req.body;
  const locale = reqLocale === 'en' ? 'en' : 'fr';

  const prices = {
    rapport: {
      name: locale === 'en' ? 'Detekia — Full AI Visibility Report' : 'Detekia — Rapport GEO complet',
      amount: 2900, // 29€ en centimes
      mode: 'payment',
    },
  };

  const selected = prices[plan];
  if (!selected) return res.status(400).json({ error: 'Plan invalide' });

  const origin = req.headers.origin
    || (req.headers.host ? `https://${req.headers.host}` : null)
    || 'https://www.detekia.fr';
  const returnUrl = `${origin}${locale === 'en' ? '/en' : ''}/success?session_id={CHECKOUT_SESSION_ID}`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      locale,
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
        locale,
      },
      return_url: returnUrl,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}