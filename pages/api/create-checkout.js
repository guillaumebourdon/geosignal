import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const maxDuration = 30;

// Detect test vs live mode from the secret key
function getPriceId(plan) {
  const isTest = (process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_');
  if (plan === 'pro') {
    return isTest ? process.env.STRIPE_PRICE_PRO_99_TEST : process.env.STRIPE_PRICE_PRO_99_LIVE;
  }
  return isTest ? process.env.STRIPE_PRICE_ONEPAGE_29_TEST : process.env.STRIPE_PRICE_ONEPAGE_29_LIVE;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { plan, url, score, locale: reqLocale } = req.body;
  const locale = reqLocale === 'en' ? 'en' : 'fr';

  if (!['rapport', 'pro'].includes(plan)) return res.status(400).json({ error: 'Plan invalide' });

  const priceId = getPriceId(plan);

  // Fallback to inline price_data if no price_id configured (dev/transition)
  const lineItem = priceId
    ? { price: priceId, quantity: 1 }
    : {
        price_data: {
          currency: 'eur',
          product_data: { name: plan === 'pro' ? 'Detekia — Audit GEO complet (20 pages)' : 'Detekia — Audit GEO 1 page' },
          unit_amount: plan === 'pro' ? 9900 : 2900,
        },
        quantity: 1,
      };

  const origin = req.headers.origin
    || (req.headers.host ? `https://${req.headers.host}` : null)
    || 'https://www.detekia.fr';
  const returnUrl = `${origin}${locale === 'en' ? '/en' : ''}/success?session_id={CHECKOUT_SESSION_ID}`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      locale,
      mode: 'payment',
      ui_mode: 'embedded',
      line_items: [lineItem],
      metadata: {
        url: url || '',
        score: score != null ? String(score) : '',
        locale,
        plan: plan || 'rapport',
      },
      return_url: returnUrl,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (e) {
    console.error('[create-checkout] Error:', e.message);
    res.status(500).json({ error: 'Checkout creation failed' });
  }
}
