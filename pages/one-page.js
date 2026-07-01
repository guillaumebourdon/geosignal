import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import CheckoutFlow from '../components/CheckoutFlow';
import BeelevenContactModal from '../components/BeelevenContactModal';
import { useTranslation } from '../lib/useTranslation';

const stepColors = ['#10A37F', '#D97757', '#4285F4'];

/* ─── Animated score counter ─────────────────────────────── */
function useAnimatedCounter(target, duration = 1400, delay = 600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

/* ─── Scroll reveal hook ─────────────────────────────────── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Animated hero mockup ───────────────────────────────── */
function HeroMockup({ locale }) {
  const score = useAnimatedCounter(72);
  const [barsVisible, setBarsVisible] = useState(false);
  const [badgesVisible, setBadgesVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setBarsVisible(true), 1000);
    const t2 = setTimeout(() => setBadgesVisible(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const criteria = [
    { label: locale === 'en' ? 'AI Accessibility' : 'Accessibilite IA', pct: 85, color: '#10A37F' },
    { label: locale === 'en' ? 'Technical SEO' : 'SEO technique', pct: 68, color: '#D97757' },
    { label: locale === 'en' ? 'Content depth' : 'Profondeur contenu', pct: 42, color: '#D97757' },
    { label: locale === 'en' ? 'Freshness' : 'Fraicheur', pct: 91, color: '#10A37F' },
  ];

  const badges = [
    { text: 'Schema.org ✓', color: '#10A37F' },
    { text: locale === 'en' ? 'Missing FAQ' : 'FAQ manquante', color: '#D97757' },
    { text: 'OpenGraph ✓', color: '#10A37F' },
  ];

  return (
    <div className="lp-mockup" style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 32px 80px rgba(26,25,22,0.15)', overflow: 'hidden', maxWidth: 360, width: '100%', border: '1px solid rgba(26,25,22,0.06)' }}>
      <div style={{ background: '#F0EDE8', borderBottom: '1px solid #E5E2DC', padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#F87171','#FBBF24','#34D399'].map(c => <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#B0ABA5', letterSpacing: 0.5, marginLeft: 4 }}>detekia.fr/r/...</div>
      </div>
      <div style={{ background: '#1A1916', padding: '28px 24px 22px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: 16, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.15) 0%, transparent 70%)' }} />
        <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(247,245,242,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 4 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D97757' }} /> {locale === 'en' ? 'VISIBILITY SCORE' : 'SCORE DE VISIBILITE'}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, position: 'relative' }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 72, color: '#F7F5F2', lineHeight: 1, letterSpacing: -3 }}>{score}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.2)', letterSpacing: 1 }}>/100</div>
          </div>
          <div style={{ paddingBottom: 12 }}>
            <div style={{ display: 'inline-block', background: '#D97757', borderRadius: 16, padding: '3px 10px', fontFamily: 'monospace', fontSize: 8, color: '#fff', letterSpacing: 1.5, fontWeight: 700 }}>{locale === 'en' ? 'AVERAGE' : 'MOYEN'}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '16px 20px 12px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 7, color: '#B0ABA5', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
          {locale === 'en' ? '7 CRITERIA ANALYZED' : '7 CRITERES ANALYSES'}
        </div>
        {criteria.map((c, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: '#3A3835', fontFamily: 'system-ui' }}>{c.label}</span>
              <span style={{ fontSize: 9, color: '#6B6762', fontFamily: 'monospace' }}>{barsVisible ? c.pct : 0}%</span>
            </div>
            <div style={{ height: 4, background: '#F0EDE8', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, background: c.color, width: barsVisible ? `${c.pct}%` : '0%', transition: `width 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s` }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {badges.map((b, i) => (
          <span key={i} style={{
            fontSize: 9, fontFamily: 'monospace', letterSpacing: 0.5, padding: '3px 9px', borderRadius: 10,
            background: b.color === '#10A37F' ? 'rgba(16,163,127,0.08)' : 'rgba(217,119,87,0.08)',
            color: b.color, fontWeight: 600,
            opacity: badgesVisible ? 1 : 0, transform: badgesVisible ? 'translateY(0)' : 'translateY(6px)',
            transition: `all 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.15}s`
          }}>{b.text}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature icons (SVG) ────────────────────────────────── */
const featureIcons = [
  <svg key="0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="1.5" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  <svg key="4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  <svg key="5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  <svg key="6" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  <svg key="7" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="1.5" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 6 3 6 3s6-1 6-3v-5"/></svg>,
];

export default function OnePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showBeeleven, setShowBeeleven] = useState(false);
  const [ctaUrl, setCtaUrl] = useState('');

  const p = (key) => t(`onepage.${key}`);

  const [targetRef, targetVisible] = useScrollReveal(0.1);

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO title={locale === 'en' ? 'Single-page GEO audit — AI visibility score & recommendations' : 'Audit GEO 1 page — score de visibilite IA et recommandations'} description={locale === 'en' ? 'Analyze any web page for AI visibility: GEO score out of 100, 7 criteria, actionable recommendations. Start free, upgrade for the full report.' : 'Analysez n\'importe quelle page pour la visibilite IA : score GEO sur 100, 7 criteres, recommandations actionnables. Commencez gratuitement.'} schema={{
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Detekia — Audit GEO 1 page",
        "description": locale === 'en' ? 'AI visibility audit for a single web page — GEO score, 7 criteria, detailed recommendations, AI citation test.' : 'Audit de visibilite IA sur 1 page web — score GEO, 7 criteres, recommandations detaillees, test de citation IA.',
        "serviceType": "AI Visibility Audit",
        "provider": {
          "@type": "Organization",
          "name": "Detekia",
          "url": "https://detekia.fr"
        },
        "areaServed": { "@type": "Country", "name": "France" },
        "image": "https://detekia.fr/og-default.png",
        "offers": {
          "@type": "Offer",
          "offeredBy": { "@type": "Organization", "name": "Detekia" },
          "price": "29",
          "priceCurrency": "EUR",
          "url": "https://detekia.fr/one-page",
          "availability": "https://schema.org/OnlineOnly",
          "description": "Audit GEO 1 page — score detaille, recommandations, test IA 10 requetes",
          "hasMerchantReturnPolicy": { "@type": "MerchantReturnPolicy", "applicableCountry": "FR", "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted" },
          "shippingDetails": { "@type": "OfferShippingDetails", "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "EUR" }, "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "FR" }, "deliveryTime": { "@type": "ShippingDeliveryTime", "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "d" }, "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "d" } } }
        }
      }} />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: p('faq.items').map(faq => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })),
        }) }} />
      </Head>
      <Header ctaLabel={t('nav.ctaAnalyze')} />
      <main>

      {/* ═══ 1. HERO — informatif ═══ */}
      <section className="gradient-bg lp-hero-section" style={{ padding: '80px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="lp-hero-grid" style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="reveal" style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.25)', padding: '5px 14px', borderRadius: 20, marginBottom: 24, background: 'rgba(217,119,87,0.08)' }}>
              {locale === 'en' ? 'SINGLE-PAGE AUDIT' : 'AUDIT 1 PAGE'}
            </div>
            <h1 className="reveal reveal-d1" style={{ fontSize: 'clamp(34px, 5vw, 50px)', lineHeight: 1.06, letterSpacing: -1.5, color: '#F7F5F2', marginBottom: 16 }}>
              {locale === 'en' ? 'Detailed GEO audit of a single page' : 'Audit GEO detaille d\'une page'}
            </h1>
            <p className="reveal reveal-d2" style={{ fontSize: 16, color: 'rgba(247,245,242,0.6)', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 32, maxWidth: 460 }}>
              {locale === 'en'
                ? 'Measure how visible your page is to AI systems. Score out of 100, 7 criteria analyzed, concrete recommendations to improve your AI presence.'
                : 'Mesurez la visibilite de votre page aupres des IA. Score sur 100, 7 criteres analyses, recommandations concretes pour ameliorer votre presence IA.'}
            </p>
            <Link href="/" className="reveal reveal-d3 btn-interactive" style={{ display: 'inline-block', background: '#D97757', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui', marginBottom: 10, textDecoration: 'none' }}>
              {locale === 'en' ? 'Start with a free score' : 'Commencer par le scoring gratuit'}
            </Link>
            <div className="reveal reveal-d4" style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.25)', letterSpacing: 1.5, marginTop: 8 }}>
              {locale === 'en' ? 'FREE SCORE + RECOMMENDATIONS • NO SIGN-UP' : 'SCORE + RECOMMANDATIONS GRATUITS • SANS INSCRIPTION'}
            </div>
          </div>
          <div className="lp-hero-mockup reveal reveal-d2" style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroMockup locale={locale} />
          </div>
        </div>
      </section>

      {/* ═══ 2. CE QUE L'AUDIT 1 PAGE INCLUT ═══ */}
      <section style={{ padding: '72px 24px 64px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>{p('included.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 30px)', color: '#1A1916', letterSpacing: -0.8, textAlign: 'center', marginBottom: 48, lineHeight: 1.2 }}>{p('included.title')}</h2>
          <div className="lp-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28 }}>
            {p('included.features').map((feature, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {featureIcons[i]}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 6, lineHeight: 1.3 }}>{feature.title}</div>
                  <div style={{ fontSize: 13, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.65 }}>{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. BANDEAU GRATUIT ═══ */}
      <section style={{ padding: '48px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#10A37F', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>
              {locale === 'en' ? 'START FREE' : 'COMMENCEZ GRATUITEMENT'}
            </span>
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 4vw, 28px)', color: '#1A1916', letterSpacing: -0.8, marginBottom: 14, lineHeight: 1.2 }}>
            {locale === 'en'
              ? 'Get your score and recommendations for free'
              : 'Obtenez votre score et vos recommandations gratuitement'}
          </h2>
          <p style={{ fontSize: 14, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.65, marginBottom: 28, maxWidth: 520, margin: '0 auto 28px' }}>
            {locale === 'en'
              ? 'Our free GEO audit gives you a score out of 100, detailed analysis across 7 criteria, and actionable recommendations. No payment, no sign-up required.'
              : 'Notre audit GEO gratuit vous donne un score sur 100, une analyse detaillee sur 7 criteres et des recommandations actionnables. Sans paiement, sans inscription.'}
          </p>
          <Link href="/" className="btn-interactive" style={{ display: 'inline-block', background: '#10A37F', color: '#fff', border: 'none', padding: '14px 36px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui', textDecoration: 'none' }}>
            {locale === 'en' ? 'Analyze a page for free' : 'Analyser une page gratuitement'}
          </Link>
        </div>
      </section>

      {/* ═══ 4. RAPPORT PAYANT — secondaire ═══ */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
            {locale === 'en' ? 'GO FURTHER' : 'ALLER PLUS LOIN'}
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 4vw, 28px)', color: '#1A1916', letterSpacing: -0.8, textAlign: 'center', marginBottom: 14, lineHeight: 1.2 }}>
            {locale === 'en'
              ? 'Need a more in-depth report?'
              : 'Besoin d\'un rapport plus approfondi ?'}
          </h2>
          <p style={{ fontSize: 14, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.65, textAlign: 'center', marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' }}>
            {locale === 'en'
              ? 'The full single-page audit at 29\u20AC adds exclusive features on top of the free analysis:'
              : 'L\'audit complet 1 page a 29\u20AC ajoute des fonctionnalites exclusives en plus de l\'analyse gratuite :'}
          </p>
          <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '28px 32px', maxWidth: 560, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
              {(locale === 'en' ? [
                'Detailed AI-generated recommendations with code examples',
                'AI citation test: 10 real queries to ChatGPT about your topic',
                'Analysis of which competitors get cited instead of you',
                'Exportable HTML + PDF report',
                'Delivered by email in under 2 minutes',
              ] : [
                'Recommandations detaillees generees par IA avec exemples de code',
                'Test de citation IA : 10 requetes reelles a ChatGPT sur votre sujet',
                'Analyse des concurrents cites a votre place',
                'Rapport HTML + PDF exportable',
                'Livre par email en moins de 2 minutes',
              ]).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize: 14, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E5E2DC', paddingTop: 20 }}>
              <div>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#1A1916', fontWeight: 600 }}>29 &euro;</span>
                <span style={{ fontSize: 12, color: '#6B6762', fontFamily: 'system-ui', marginLeft: 8 }}>{locale === 'en' ? 'one-time' : 'unique'}</span>
              </div>
              <button onClick={() => setShowCheckout(true)} className="btn-interactive" style={{ background: '#1A1916', color: '#F7F5F2', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui' }}>
                {locale === 'en' ? 'Get the full report' : 'Obtenir le rapport complet'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. COMMENT CA MARCHE ═══ */}
      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>{p('steps.label')}</div>
          <div className="lp-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {p('steps.items').map((step, i) => (
              <div key={i} className="card-interactive" style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(26,25,22,0.06)' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: stepColors[i], marginBottom: 14, letterSpacing: -1, lineHeight: 1 }}>{step.num}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 6, fontFamily: 'system-ui' }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#6B6762', lineHeight: 1.6, fontFamily: 'system-ui' }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. EXEMPLE RAPPORT ═══ */}
      <section style={{ padding: '48px 24px', textAlign: 'center' }}>
        <a href={locale === 'en' ? '/example-report.html' : '/exemple-rapport.html'} target="_blank" rel="noopener noreferrer"
          className="btn-interactive"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#D97757', fontFamily: 'system-ui', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(217,119,87,0.3)', padding: '10px 22px', borderRadius: 10, background: 'rgba(217,119,87,0.04)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          {p('hero.exampleLink')}
        </a>
      </section>

      {/* ═══ 7. FAQ ═══ */}
      <section style={{ padding: '0 24px 64px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>{p('faq.label')}</div>
          {p('faq.items').map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #E5E2DC', padding: '20px 0' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui' }}>{faq.q}</div>
              <div style={{ fontSize: 13, color: '#6B6762', lineHeight: 1.65, fontFamily: 'system-ui' }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 8. CTA BEELEVEN ═══ */}
      <section className="gradient-bg" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            {locale === 'en' ? 'DONE-FOR-YOU' : 'ON S\'EN OCCUPE'}
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#F7F5F2', letterSpacing: -0.8, marginBottom: 14, lineHeight: 1.15 }}>
            {locale === 'en'
              ? 'Or let us implement the fixes for you'
              : 'Ou laissez-nous implementer les corrections pour vous'}
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', marginBottom: 28, lineHeight: 1.6 }}>
            {locale === 'en'
              ? 'Our GEO experts at Beeleven can audit your site and implement all the optimizations. Free discovery call, no commitment.'
              : 'Nos experts GEO chez Beeleven peuvent auditer votre site et implementer toutes les optimisations. Appel decouverte gratuit, sans engagement.'}
          </p>
          <button onClick={() => setShowBeeleven(true)} className="btn-interactive" style={{ background: '#D97757', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui' }}>
            {locale === 'en' ? 'Talk to a GEO expert' : 'Discuter avec un expert GEO'}
          </button>
        </div>
      </section>

      {/* ═══ 9. CROSS-SELL PRO ═══ */}
      <section style={{ padding: '48px 24px 64px' }}>
        <div className="card-interactive" style={{ maxWidth: 560, margin: '0 auto', background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '32px 28px', display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(217,119,87,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 6, fontWeight: 600 }}>{p('crossSell.title')}</div>
            <p style={{ fontSize: 13, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 12 }}>{p('crossSell.desc')}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Link href="/pro" className="btn-interactive" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#D97757', fontFamily: 'system-ui', fontWeight: 600, textDecoration: 'none', background: 'rgba(217,119,87,0.06)', padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(217,119,87,0.2)' }}>
                {p('crossSell.cta')}
              </Link>
              <Link href="/pricing" style={{ fontSize: 12, color: '#6B6762', fontFamily: 'system-ui', textDecoration: 'none', borderBottom: '1px solid #E5E2DC', paddingBottom: 1 }}>
                {locale === 'en' ? 'Compare all plans' : 'Comparer toutes les offres'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CheckoutFlow plan="rapport" showModal={showCheckout} onClose={() => setShowCheckout(false)} initialUrl={ctaUrl} />
      <BeelevenContactModal open={showBeeleven} onClose={() => setShowBeeleven(false)} />

      </main>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(247,245,242,0.3); }
        @media (max-width: 767px) {
          .lp-hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; text-align: center; }
          .lp-hero-mockup { justify-content: center !important; }
          .lp-hero-mockup > div { max-width: 300px !important; }
          .lp-hero-grid h1 { font-size: clamp(30px, 8vw, 40px) !important; }
          .lp-hero-grid p { margin: 0 auto 32px !important; }
          .lp-features-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .lp-target-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .lp-steps-grid { grid-template-columns: 1fr !important; }
          .lp-final-input { flex-direction: column !important; }
          .lp-final-input input { border-radius: 10px 10px 0 0 !important; }
          .lp-final-input button { border-radius: 0 0 10px 10px !important; width: 100% !important; justify-content: center; }
          .lp-hero-section { padding: 60px 16px 48px !important; }
        }
      `}</style>
    </div>
  );
}
