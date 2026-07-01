import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import Head from 'next/head';
import SEO from '../components/SEO';
import Header from '../components/Header';
import PageSelector from '../components/PageSelector';
import BeelevenContactModal from '../components/BeelevenContactModal';
import { useTranslation } from '../lib/useTranslation';
import { useFocusTrap } from '../lib/useFocusTrap';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);


function isValidUrl(input) {
  let url = input.trim();
  if (!url) return false;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  try { new URL(url); return true; } catch { return false; }
}

function normalizeUrl(input) {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  return url;
}

/* ─── Logo (inline SVG, same as homepage) ────────────────── */
function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#1A1916"/>
      <path d="M8 22V10l8 6-8 6z" fill="#D97757"/>
      <path d="M16 22V10l8 6-8 6z" fill="#D97757" opacity="0.5"/>
    </svg>
  );
}

export default function Pricing() {
  const router = useRouter();
  const { t, locale } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('rapport'); // 'rapport' or 'pro'
  const [modalUrl, setModalUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  // Beeleven contact modal
  const [showBeeleven, setShowBeeleven] = useState(false);

  // Page selector state (Pro flow only)
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [suggestedPages, setSuggestedPages] = useState([]);
  const [pageSelectorHostname, setPageSelectorHostname] = useState('');
  const [pageSelectorUrl, setPageSelectorUrl] = useState('');
  const [selectedPages, setSelectedPages] = useState(null);

  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const modalTrapRef = useFocusTrap(showModal && !showPageSelector);
  const pageSelectorTrapRef = useFocusTrap(showPageSelector);
  const checkoutTrapRef = useFocusTrap(showCheckout);

  const freeFeatures = t('pricing.free.features');
  const reportFeatures = t('pricing.report.features');
  const faqItems = t('pricing.faq.items');

  // Focus input when modal opens
  useEffect(() => {
    if (showModal && inputRef.current) inputRef.current.focus();
  }, [showModal]);

  // Escape key closes modal
  useEffect(() => {
    if (!showModal) return;
    function onKey(e) { if (e.key === 'Escape') closeModal(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showModal]);

  function openModal() {
    setShowModal(true);
    setModalUrl('');
    setUrlError('');
    setModalError('');
  }

  function closeModal() {
    setShowModal(false);
    setShowPageSelector(false);
    setSuggestedPages([]);
    setPageSelectorHostname('');
    setPageSelectorUrl('');
    setSelectedPages(null);
    setTermsAccepted(false);
    setModalUrl('');
    setUrlError('');
    setModalError('');
    setShowFallback(false);
    setLoadingText('');
    if (triggerRef.current) triggerRef.current.focus();
  }

  function closeCheckout() {
    setShowCheckout(false);
    setClientSecret(null);
  }

  async function handleModalSubmit() {
    if (!isValidUrl(modalUrl)) {
      setUrlError(t('pricing.modal.urlInvalidError'));
      return;
    }
    setUrlError('');
    setModalError('');
    setShowFallback(false);
    setModalLoading(true);

    const url = normalizeUrl(modalUrl);

    // Pre-check auditability
    setLoadingText(t('pricing.modal.checking'));
    try {
      const checkRes = await fetch('/api/pre-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, plan: selectedPlan }),
      });
      if (checkRes.status === 429) {
        setModalError(t('pricing.modal.errorCheckFailed'));
        setModalLoading(false);
        setLoadingText('');
        return;
      }
      const check = await checkRes.json();
      const isPro = selectedPlan === 'pro';
      const auditable = isPro ? check.proAuditable : check.onePageAuditable;

      if (!auditable) {
        if (isPro && check.onePageAuditable) {
          setModalError(t('pricing.modal.errorProInsufficient'));
          setShowFallback(true);
          setModalLoading(false);
          setLoadingText('');
          return;
        }
        const errKey = check.reason === 'antibot_detected' ? 'errorAntibot'
          : check.reason === 'site_unreachable' ? 'errorUnreachable'
          : check.reason === 'no_content' ? 'errorNoContent'
          : 'errorAntibot';
        setModalError(t(`pricing.modal.${errKey}`));
        setModalLoading(false);
        setLoadingText('');
        return;
      }
    } catch {
      // Pre-check failed — proceed to checkout (fail-open)
    }

    // For Pro plan: show page selector step before checkout
    if (selectedPlan === 'pro') {
      setLoadingText(t('pageSelector.loading'));
      try {
        const suggestRes = await fetch('/api/suggest-pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, locale: router.locale }),
        });
        if (suggestRes.ok) {
          const suggestData = await suggestRes.json();
          if (suggestData.pages && suggestData.pages.length >= 1) {
            setSuggestedPages(suggestData.pages);
            setPageSelectorHostname(suggestData.hostname);
            setPageSelectorUrl(url);
            setShowModal(false);
            setShowPageSelector(true);
            setModalLoading(false);
            setLoadingText('');
            return;
          }
        }
        // If suggest-pages fails, fall through to checkout without page selection
        console.warn('[pricing] suggest-pages failed or returned no pages, proceeding without page selection');
      } catch {
        console.warn('[pricing] suggest-pages error, proceeding without page selection');
      }
    }

    setLoadingText('');
    await proceedToCheckout(url);
  }

  async function proceedToCheckout(url, pages) {
    setModalLoading(true);
    try {
      const body = { plan: selectedPlan, url, locale: router.locale };
      if (pages) body.pages = pages;
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setShowModal(false);
        setShowPageSelector(false);
        setClientSecret(data.clientSecret);
        setShowCheckout(true);
      } else {
        setModalError(t('pricing.modal.errorGeneric'));
        // Reopen modal if page selector was showing
        if (showPageSelector) {
          setShowPageSelector(false);
          setShowModal(true);
        }
      }
    } catch {
      setModalError(t('pricing.modal.errorGeneric'));
      if (showPageSelector) {
        setShowPageSelector(false);
        setShowModal(true);
      }
    } finally {
      setModalLoading(false);
    }
  }

  function handlePageSelectorConfirm(pages) {
    setSelectedPages(pages);
    proceedToCheckout(pageSelectorUrl, pages);
  }

  function handlePageSelectorBack() {
    setShowPageSelector(false);
    setShowModal(true);
  }

  // FAQ items for the new positioning
  const newFaqItems = locale === 'en' ? [
    { q: 'Is the audit really free?', a: 'Yes. You get a GEO score out of 100, 7 weighted criteria, personalized recommendations and a 5-query ChatGPT citation test — completely free, no account required.' },
    { q: 'What is the difference between the free audit and the paid reports?', a: 'The free audit covers 1 page with detailed recommendations. The one-page report (29\u20AC) adds an in-depth PDF with code examples and a 10-query citation test. The full report (99\u20AC) analyzes 10 key pages with a prioritized action plan and a 30-query citation test.' },
    { q: 'What does the Beeleven consulting include?', a: 'Beeleven implements the GEO corrections for you: content restructuring, structured data, authority signals, and monthly tracking. The team works directly on your site based on the audit findings.' },
    { q: 'How long does the free audit take?', a: 'Results are delivered in about 30 seconds. No waiting, no email required.' },
    { q: 'Can I upgrade from the free audit to a paid report later?', a: 'Yes. After your free scan, you can purchase a detailed report at any time. If you do it within 2 hours, the report is generated faster thanks to cached data.' },
  ] : [
    { q: 'L\'audit est vraiment gratuit ?', a: 'Oui. Vous obtenez un score GEO sur 100, 7 crit\u00E8res pond\u00E9r\u00E9s, des recommandations personnalis\u00E9es et un test de citation ChatGPT (5 requ\u00EAtes) \u2014 enti\u00E8rement gratuit, sans cr\u00E9ation de compte.' },
    { q: 'Quelle diff\u00E9rence entre l\'audit gratuit et les rapports payants ?', a: 'L\'audit gratuit couvre 1 page avec des recommandations d\u00E9taill\u00E9es. Le rapport one-page (29\u20AC) ajoute un PDF approfondi avec exemples de code et un test de citation sur 10 requ\u00EAtes. Le rapport complet (99\u20AC) analyse 10 pages cl\u00E9s avec un plan d\'action prioris\u00E9 et un test de citation sur 30 requ\u00EAtes.' },
    { q: 'Que comprend l\'accompagnement Beeleven ?', a: 'Beeleven impl\u00E9mente les corrections GEO pour vous : restructuration de contenu, donn\u00E9es structur\u00E9es, signaux d\'autorit\u00E9 et suivi mensuel. L\'\u00E9quipe intervient directement sur votre site \u00E0 partir des r\u00E9sultats de l\'audit.' },
    { q: 'Combien de temps prend l\'audit gratuit ?', a: 'Les r\u00E9sultats sont livr\u00E9s en environ 30 secondes. Pas d\'attente, pas d\'email requis.' },
    { q: 'Puis-je passer du gratuit au rapport payant plus tard ?', a: 'Oui. Apr\u00E8s votre scan gratuit, vous pouvez acheter un rapport d\u00E9taill\u00E9 \u00E0 tout moment. Si vous le faites dans les 2 heures, le rapport est g\u00E9n\u00E9r\u00E9 plus rapidement gr\u00E2ce aux donn\u00E9es en cache.' },
  ];

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO title={locale === 'en' ? 'Your GEO audit, free | Detekia' : 'Votre audit GEO, gratuit | Detekia'} description={locale === 'en' ? 'Get a free GEO score, 7 criteria and personalized recommendations. Paid reports and expert consulting also available.' : 'Obtenez un score GEO gratuit, 7 crit\u00E8res et des recommandations personnalis\u00E9es. Rapports payants et accompagnement expert disponibles.'} schema={{
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Detekia — Audit de visibilit\u00E9 IA",
        "description": locale === 'en'
          ? "Free GEO audit: score out of 100, 7 weighted criteria, personalized recommendations. Paid reports and expert consulting available."
          : "Audit GEO gratuit : score sur 100, 7 crit\u00E8res pond\u00E9r\u00E9s, recommandations personnalis\u00E9es. Rapports payants et accompagnement expert disponibles.",
        "serviceType": "AI Visibility Audit",
        "provider": { "@type": "Organization", "name": "Detekia", "url": "https://detekia.fr" },
        "areaServed": { "@type": "Country", "name": "France" },
        "image": "https://detekia.fr/og-default.png",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Audits GEO Detekia",
          "itemListElement": [
            { "@type": "Offer", "name": locale === 'en' ? "Free GEO Audit" : "Audit GEO gratuit", "price": "0", "priceCurrency": "EUR", "url": "https://detekia.fr", "availability": "https://schema.org/OnlineOnly", "description": locale === 'en' ? "Free GEO score, 7 criteria, personalized recommendations, 5-query ChatGPT citation test" : "Score GEO gratuit, 7 crit\u00E8res, recommandations personnalis\u00E9es, test de citation ChatGPT 5 requ\u00EAtes" },
            { "@type": "Offer", "name": "Audit GEO 1 page", "price": "29", "priceCurrency": "EUR", "url": "https://detekia.fr/one-page", "availability": "https://schema.org/OnlineOnly", "description": "Audit GEO d\u00E9taill\u00E9 sur 1 page avec recommandations et test IA", "hasMerchantReturnPolicy": { "@type": "MerchantReturnPolicy", "applicableCountry": "FR", "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted" }, "shippingDetails": { "@type": "OfferShippingDetails", "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "EUR" }, "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "FR" }, "deliveryTime": { "@type": "ShippingDeliveryTime", "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "d" }, "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "d" } } } },
            { "@type": "Offer", "name": "Audit GEO complet (10 pages cl\u00E9s)", "price": "99", "priceCurrency": "EUR", "url": "https://detekia.fr/pro", "availability": "https://schema.org/OnlineOnly", "description": "Audit GEO sur 10 pages cl\u00E9s avec plan d'action prioris\u00E9 et test IA 30 requ\u00EAtes", "hasMerchantReturnPolicy": { "@type": "MerchantReturnPolicy", "applicableCountry": "FR", "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted" }, "shippingDetails": { "@type": "OfferShippingDetails", "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "EUR" }, "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "FR" }, "deliveryTime": { "@type": "ShippingDeliveryTime", "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "d" }, "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "d" } } } }
          ]
        }
      }} />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: newFaqItems.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        }) }} />
      </Head>

      <Header ctaLabel={t('nav.ctaAnalyze')} />
      <main>

      {/* HERO */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '64px 24px 0', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 20 }}>
          {locale === 'en' ? 'GEO Audit' : 'Audit GEO'}
        </div>
        <h1 style={{ fontSize: 'clamp(30px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 14, color: '#1A1916' }}>
          {locale === 'en' ? 'Your GEO audit, free' : 'Votre audit GEO, gratuit'}
        </h1>
        <p style={{ fontSize: 15, color: '#6B6762', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 52 }}>
          {locale === 'en'
            ? 'Score out of 100, 7 weighted criteria, personalized recommendations and ChatGPT citation test. No account, no credit card.'
            : 'Score sur 100, 7 crit\u00E8res pond\u00E9r\u00E9s, recommandations personnalis\u00E9es et test de citation ChatGPT. Sans compte, sans carte bancaire.'}
        </p>
      </div>

      {/* SECTION 1 — CE QUI EST GRATUIT */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px 56px' }}>
        <div className="card-interactive" style={{ background: '#fff', border: '2px solid #D97757', borderRadius: 20, padding: '36px 32px', position: 'relative', boxShadow: '0 8px 32px rgba(217,119,87,0.10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ background: '#D97757', color: '#fff', fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', borderRadius: 20, padding: '5px 14px', fontWeight: 700 }}>
              {locale === 'en' ? 'FREE' : 'GRATUIT'}
            </div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', letterSpacing: -1 }}>0 &euro;</span>
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 8, lineHeight: 1.2, letterSpacing: -0.5 }}>
            {locale === 'en' ? 'Everything you need to get started' : 'Tout ce qu\'il faut pour commencer'}
          </div>
          <p style={{ fontSize: 13, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.65, marginBottom: 24 }}>
            {locale === 'en'
              ? 'Analyze any page of your website and get actionable results in 30 seconds.'
              : 'Analysez n\'importe quelle page de votre site et obtenez des r\u00E9sultats actionnables en 30 secondes.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {(locale === 'en' ? [
              'GEO score out of 100',
              '7 weighted criteria with detailed breakdown',
              'Personalized recommendations with code examples',
              'ChatGPT citation test (5 queries)',
              'No account required',
            ] : [
              'Score GEO sur 100',
              '7 crit\u00E8res pond\u00E9r\u00E9s avec d\u00E9tail par crit\u00E8re',
              'Recommandations personnalis\u00E9es avec exemples de code',
              'Test de citation ChatGPT (5 requ\u00EAtes)',
              'Sans cr\u00E9ation de compte',
            ]).map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, color: '#10A37F', flexShrink: 0, fontWeight: 700 }}>&#10003;</span>
                <span style={{ fontSize: 14, color: '#3A3835', fontFamily: 'system-ui' }}>{feat}</span>
              </div>
            ))}
          </div>
          <Link href="/" style={{ display: 'block', textAlign: 'center', background: '#D97757', color: '#fff', padding: '14px 0', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: 'system-ui' }}>
            {locale === 'en' ? 'Audit my site for free \u2192' : 'Auditer mon site gratuitement \u2192'}
          </Link>
        </div>
      </div>

      {/* SECTION 2 — ACCOMPAGNEMENT BEELEVEN */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
            {locale === 'en' ? 'EXPERT CONSULTING' : 'ACCOMPAGNEMENT EXPERT'}
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 3vw, 32px)', color: '#1A1916', letterSpacing: -1, lineHeight: 1.2 }}>
            {locale === 'en' ? 'We implement the corrections for you' : 'On impl\u00E9mente les corrections pour vous'}
          </h2>
        </div>
        <div className="card-interactive" style={{ background: '#1A1916', borderRadius: 20, padding: '36px 32px', boxShadow: '0 16px 48px rgba(26,25,22,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase' }}>BEELEVEN</div>
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F7F5F2', marginBottom: 8, lineHeight: 1.2, letterSpacing: -0.5 }}>
            {locale === 'en' ? 'Our team implements the GEO corrections' : 'Notre \u00E9quipe impl\u00E9mente les corrections GEO'}
          </div>
          <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.65)', fontFamily: 'system-ui', lineHeight: 1.65, marginBottom: 24 }}>
            {locale === 'en'
              ? 'Based on the audit results, our experts restructure your content, add structured data, strengthen authority signals, and track progress monthly.'
              : '\u00C0 partir des r\u00E9sultats de l\'audit, nos experts restructurent votre contenu, ajoutent les donn\u00E9es structur\u00E9es, renforcent les signaux d\'autorit\u00E9 et suivent la progression chaque mois.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {(locale === 'en' ? [
              'Content restructuring for AI citability',
              'Structured data implementation (Schema.org)',
              'Authority & E-E-A-T signals',
              'Monthly tracking & reporting',
            ] : [
              'Restructuration de contenu pour la citabilit\u00E9 IA',
              'Impl\u00E9mentation des donn\u00E9es structur\u00E9es (Schema.org)',
              'Signaux d\'autorit\u00E9 & E-E-A-T',
              'Suivi et reporting mensuel',
            ]).map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, color: '#D97757', flexShrink: 0, fontWeight: 700 }}>&#10003;</span>
                <span style={{ fontSize: 14, color: 'rgba(247,245,242,0.8)', fontFamily: 'system-ui' }}>{feat}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', marginBottom: 20 }}>
            {locale === 'en' ? 'Starting at 1,500 \u20AC' : '\u00C0 partir de 1 500 \u20AC'}
          </div>
          <button
            onClick={() => setShowBeeleven(true)}
            style={{ display: 'block', width: '100%', textAlign: 'center', background: '#D97757', color: '#fff', padding: '14px 0', borderRadius: 10, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'system-ui' }}>
            {locale === 'en' ? 'Book a free call \u2192' : 'R\u00E9server un appel gratuit \u2192'}
          </button>
        </div>
      </div>

      {/* SECTION 3 — RAPPORTS SELF-SERVICE */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
            {locale === 'en' ? 'SELF-SERVICE' : 'EN AUTONOMIE'}
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px, 2.5vw, 28px)', color: '#1A1916', letterSpacing: -0.5, lineHeight: 1.2 }}>
            {locale === 'en' ? 'Detailed reports for the self-starters' : 'Rapports d\u00E9taill\u00E9s pour les autonomes'}
          </h2>
          <p style={{ fontSize: 13, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.65, marginTop: 8 }}>
            {locale === 'en'
              ? 'Go deeper with a comprehensive PDF report, code examples, and extended AI citation tests.'
              : 'Allez plus loin avec un rapport PDF complet, des exemples de code et des tests de citation IA \u00E9tendus.'}
          </p>
        </div>
        <div className="pricing-selfservice" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* RAPPORT ONE-PAGE — 29 EUR */}
          <div className="card-interactive" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '24px 22px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{t('pricing.report.label')}</div>
            <div style={{ marginBottom: 4 }}><span style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', letterSpacing: -1 }}>{t('pricing.report.price')}</span></div>
            <div style={{ fontSize: 11, color: '#B0ABA5', fontFamily: 'system-ui', marginBottom: 4 }}>{t('pricing.report.paymentInfo')}</div>
            {t('pricing.report.subtitle') && <div style={{ fontSize: 12, color: '#6B6762', fontFamily: 'system-ui', marginBottom: 16, lineHeight: 1.5 }}>{t('pricing.report.subtitle')}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20, flex: 1 }}>
              {reportFeatures.map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 11, color: '#10A37F', flexShrink: 0 }}>&#10003;</span>
                  <span style={{ fontSize: 11, color: '#3A3835', fontFamily: 'system-ui' }}>{feat.text}</span>
                </div>
              ))}
            </div>
            <button
              ref={triggerRef}
              onClick={() => { setSelectedPlan('rapport'); openModal(); }}
              style={{ display: 'block', width: '100%', textAlign: 'center', background: '#1A1916', color: '#F7F5F2', padding: '11px 0', borderRadius: 9, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'system-ui', marginBottom: 10 }}>
              {t('pricing.report.cta')}
            </button>
            <div style={{ textAlign: 'center' }}>
              <Link href="/one-page" style={{ fontSize: 11, color: '#D97757', textDecoration: 'none', fontFamily: 'system-ui', borderBottom: '1px solid rgba(217,119,87,0.3)', paddingBottom: 1 }}>{t('pricing.report.learnMore')}</Link>
            </div>
          </div>

          {/* RAPPORT PRO — 99 EUR */}
          <div className="card-interactive" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '24px 22px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{t('pricing.proCard.label')}</div>
            <div style={{ marginBottom: 4 }}><span style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', letterSpacing: -1 }}>{t('pricing.proCard.price')}</span></div>
            <div style={{ fontSize: 11, color: '#B0ABA5', fontFamily: 'system-ui', marginBottom: 4 }}>{t('pricing.proCard.paymentInfo')}</div>
            {t('pricing.proCard.subtitle') && <div style={{ fontSize: 12, color: '#6B6762', fontFamily: 'system-ui', marginBottom: 16, lineHeight: 1.5 }}>{t('pricing.proCard.subtitle')}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20, flex: 1 }}>
              {t('pricing.proCard.features').map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 11, color: '#10A37F', flexShrink: 0 }}>&#10003;</span>
                  <span style={{ fontSize: 11, color: '#3A3835', fontFamily: 'system-ui' }}>{feat.text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setSelectedPlan('pro'); openModal(); }}
              style={{ display: 'block', width: '100%', textAlign: 'center', background: '#1A1916', color: '#F7F5F2', padding: '11px 0', borderRadius: 9, fontWeight: 700, fontSize: 13, fontFamily: 'system-ui', border: 'none', cursor: 'pointer', marginBottom: 10 }}>
              {t('pricing.proCard.cta')}
            </button>
            <div style={{ textAlign: 'center' }}>
              <Link href="/pro" style={{ fontSize: 11, color: '#D97757', textDecoration: 'none', fontFamily: 'system-ui', borderBottom: '1px solid rgba(217,119,87,0.3)', paddingBottom: 1 }}>{t('pricing.proCard.learnMore')}</Link>
            </div>
          </div>
        </div>
      </div>

      {/* GARANTIE */}
      <div style={{ maxWidth: 560, margin: '0 auto 56px', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '20px 28px', display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 24 }}>&#128274;</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 3 }}>{t('pricing.guarantee.title')}</div>
            <div style={{ fontSize: 12, color: '#6B6762', fontFamily: 'system-ui' }}>{t('pricing.guarantee.subtitle')}</div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>
          {locale === 'en' ? 'FAQ' : 'QUESTIONS FR\u00C9QUENTES'}
        </div>
        {newFaqItems.map((faq, i) => (
          <details key={i} className="pricing-faq-item" style={{ borderBottom: '1px solid #E5E2DC' }}>
            <summary style={{ padding: '18px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, listStyle: 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.4 }}>{faq.q}</span>
              <span className="pricing-faq-icon" style={{ fontSize: 18, color: '#B0ABA5', flexShrink: 0, transition: 'transform 0.2s ease', fontWeight: 300 }}>+</span>
            </summary>
            <div style={{ fontSize: 13, color: '#6B6762', lineHeight: 1.65, fontFamily: 'system-ui', paddingBottom: 18 }}>{faq.a}</div>
          </details>
        ))}
      </div>

      {/* FOOTER */}
      </main>
      <footer style={{ borderTop: '1px solid #E5E2DC', padding: '40px 48px 32px', background: '#fff' }}>
        <div className="pricing-footer-inner" style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div style={{ minWidth: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 8 }}>
              <Logo />{t('common.siteName')}
            </div>
            <div style={{ fontSize: 11, color: '#C2BDB8', fontFamily: 'system-ui' }}>{t('homepage.footer.copyright')}</div>
            <div style={{ fontSize: 11, color: '#C2BDB8', fontFamily: 'system-ui', marginTop: 4 }}>
              {locale === 'en' ? 'A product by ' : 'Un produit de l\'agence '}
              <a href="https://beeleven.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#D97757', textDecoration: 'none' }}>Beeleven</a>
            </div>
          </div>
          {['products', 'resources', 'legal'].map((section) => (
            <div key={section}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>{t(`homepage.footer.${section}.label`)}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {t(`homepage.footer.${section}.links`).map((link) => (
                  <Link key={link.href} href={link.href} style={{ fontSize: 12, color: '#6B6762', textDecoration: 'none', fontFamily: 'system-ui' }}>{link.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>

      {/* BEELEVEN CONTACT MODAL */}
      <BeelevenContactModal open={showBeeleven} onClose={() => setShowBeeleven(false)} />

      {/* URL MODAL */}
      {showModal && (
        <div
          onClick={closeModal}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,0.72)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
        >
          <div
            ref={modalTrapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, maxWidth: 460, width: '100%', padding: '32px 28px', position: 'relative', boxShadow: '0 24px 64px rgba(26,25,22,0.28)' }}
          >
            <button onClick={closeModal} aria-label="Fermer" style={{ position: 'absolute', top: 16, right: 16, background: '#F0EDE8', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#6B6762', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
            <h2 id="modal-title" style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 10, lineHeight: 1.2 }}>{selectedPlan === 'pro' ? t('pricing.modalPro.title') : t('pricing.modal.title')}</h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', lineHeight: 1.65, marginBottom: 24 }}>{selectedPlan === 'pro' ? t('pricing.modalPro.subtitle') : t('pricing.modal.subtitle')}</p>

            <div style={{ marginBottom: 20 }}>
              <input
                ref={inputRef}
                type="url"
                aria-label="URL du site à analyser"
                value={modalUrl}
                onChange={e => { setModalUrl(e.target.value); setUrlError(''); setModalError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') handleModalSubmit(); }}
                placeholder={t('pricing.modal.urlPlaceholder')}
                style={{ width: '100%', background: '#F7F5F2', border: urlError ? '1.5px solid #D97757' : '1px solid #E5E2DC', borderRadius: 10, padding: '14px 16px', fontSize: 15, fontFamily: 'system-ui', color: '#1A1916', outline: 'none' }}
              />
              {urlError && <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#D97757', marginTop: 8 }}>{urlError}</div>}
              {modalError && <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#D97757', marginTop: 8 }}>{modalError}</div>}
            </div>

            {/* CGV acceptance */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16, cursor: 'pointer' }}>
              <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} style={{ marginTop: 3, accentColor: '#D97757' }} />
              <span style={{ fontFamily: 'system-ui', fontSize: 11, color: '#6B6762', lineHeight: 1.5 }}>
                {locale === 'en'
                  ? <>I accept the <a href="/cgu" target="_blank" rel="noopener noreferrer" style={{ color: '#D97757', textDecoration: 'none' }}>terms of service</a> and <a href="/confidentialite" target="_blank" rel="noopener noreferrer" style={{ color: '#D97757', textDecoration: 'none' }}>privacy policy</a></>
                  : <>J&apos;accepte les <a href="/cgu" target="_blank" rel="noopener noreferrer" style={{ color: '#D97757', textDecoration: 'none' }}>conditions g&eacute;n&eacute;rales de vente</a> et la <a href="/confidentialite" target="_blank" rel="noopener noreferrer" style={{ color: '#D97757', textDecoration: 'none' }}>politique de confidentialit&eacute;</a></>}
              </span>
            </label>

            <button
              onClick={handleModalSubmit}
              disabled={modalLoading || !modalUrl.trim() || !termsAccepted}
              style={{ display: 'block', width: '100%', background: '#D97757', color: '#fff', padding: '14px 0', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: modalLoading || !modalUrl.trim() || !termsAccepted ? 'not-allowed' : 'pointer', fontFamily: 'system-ui', opacity: modalLoading || !modalUrl.trim() || !termsAccepted ? 0.6 : 1, transition: 'opacity 0.2s', marginBottom: 12 }}>
              {modalLoading ? (loadingText || '...') : (selectedPlan === 'pro' ? t('pricing.modalPro.submitButton') : t('pricing.modal.submitButton'))}
            </button>
            {showFallback && (
              <button onClick={() => { setSelectedPlan('rapport'); setShowFallback(false); setModalError(''); }}
                style={{ display: 'block', width: '100%', background: '#1A1916', color: '#F7F5F2', padding: '13px 0', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'system-ui', marginBottom: 12 }}>
                {t('pricing.modal.errorProInsufficient_cta')}
              </button>
            )}
            <button onClick={closeModal} style={{ display: 'block', width: '100%', background: 'transparent', color: '#6B6762', padding: '10px 0', border: 'none', cursor: 'pointer', fontFamily: 'system-ui', fontSize: 13 }}>
              {t('pricing.modal.cancelButton')}
            </button>
          </div>
        </div>
      )}

      {/* PAGE SELECTOR MODAL (Pro only) */}
      {showPageSelector && (
        <div
          onClick={closeModal}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,0.72)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
        >
          <div
            ref={pageSelectorTrapRef}
            role="dialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, maxWidth: 560, width: '100%', padding: '32px 28px', position: 'relative', boxShadow: '0 24px 64px rgba(26,25,22,0.28)', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <button onClick={closeModal} aria-label="Fermer" style={{ position: 'absolute', top: 16, right: 16, background: '#F0EDE8', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#6B6762', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
            <PageSelector
              pages={suggestedPages}
              hostname={pageSelectorHostname}
              onConfirm={handlePageSelectorConfirm}
              onBack={handlePageSelectorBack}
            />
          </div>
        </div>
      )}

      {/* STRIPE EMBEDDED CHECKOUT MODAL */}
      {showCheckout && clientSecret && (
        <div
          onClick={closeCheckout}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,0.72)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
        >
          <div
            ref={checkoutTrapRef}
            role="dialog" aria-modal="true"
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 14, maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 64px rgba(26,25,22,0.28)' }}
          >
            <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600, color: '#1A1916' }}>{selectedPlan === 'pro' ? t('pricing.proCard.label') : t('pricing.report.label')}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', letterSpacing: 1, marginTop: 3 }}>{selectedPlan === 'pro' ? t('pricing.proCard.price') : t('pricing.report.price')} &middot; {selectedPlan === 'pro' ? t('pricing.proCard.paymentInfo') : t('pricing.report.paymentInfo')}</div>
              </div>
              <button onClick={closeCheckout} aria-label="Fermer" style={{ background: '#F0EDE8', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#6B6762', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>x</button>
            </div>
            <div style={{ padding: '16px 0 0' }}>
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 600px) {
          .pricing-selfservice { grid-template-columns: 1fr !important; }
          .pricing-footer-inner { flex-direction: column !important; gap: 24px !important; }
        }
        /* FAQ accordion — native <details> styling */
        .pricing-faq-item summary::-webkit-details-marker { display: none; }
        .pricing-faq-item summary::marker { display: none; content: ''; }
        .pricing-faq-item[open] .pricing-faq-icon { transform: rotate(45deg); }
        .pricing-faq-item summary:hover { color: #D97757; }
      `}</style>
    </div>
  );
}
