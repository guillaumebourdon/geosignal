import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const maxDuration = 30;

// Product names & descriptions by locale
const PRODUCT_STRINGS = {
  rapport: {
    fr: { name: 'Detekia — Audit GEO 1 page', description: 'Audit de visibilité IA sur 1 page — score GEO, 8 critères analysés, recommandations détaillées, rapport HTML + PDF' },
    en: { name: 'Detekia — Single-page GEO audit', description: 'AI visibility audit on a single page — GEO score, 8 criteria analyzed, detailed recommendations, HTML + PDF report' },
  },
  pro: {
    fr: { name: 'Detekia — Audit GEO complet (10 pages)', description: 'Audit GEO sur les 10 pages stratégiques de votre site — score global, patterns transverses, plan d\'action priorisé, bilan page par page, rapport HTML + PDF' },
    en: { name: 'Detekia — Full website GEO audit (10 pages)', description: 'GEO audit on 10 strategic pages of your site — global score, cross-page patterns, prioritized action plan, page-by-page review, HTML + PDF report' },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { plan, url, score, locale: reqLocale } = req.body;
  const locale = reqLocale === 'en' ? 'en' : 'fr';

  if (!['rapport', 'pro'].includes(plan)) return res.status(400).json({ error: 'Plan invalide' });

  const strings = PRODUCT_STRINGS[plan][locale];
  const lineItem = {
    price_data: {
      currency: 'eur',
      product_data: { name: strings.name, description: strings.description },
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
