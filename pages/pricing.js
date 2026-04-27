import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import Head from 'next/head';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';

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

  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const inputRef = useRef(null);
  const triggerRef = useRef(null);

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
    setLoadingText('');

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, url, locale: router.locale }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setShowModal(false);
        setClientSecret(data.clientSecret);
        setShowCheckout(true);
      } else {
        setModalError(t('pricing.modal.errorGeneric'));
      }
    } catch {
      setModalError(t('pricing.modal.errorGeneric'));
    } finally {
      setModalLoading(false);
    }
  }

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO title={t('pricing.seo.title')} description={t('pricing.seo.description')} schema={{
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Detekia GEO Audit",
        "description": "Audit de visibilite IA pour sites web — score GEO sur 100, 8 criteres, recommandations priorisees",
        "brand": { "@type": "Organization", "name": "Detekia" },
        "offers": [
          { "@type": "Offer", "name": "Rapport One-Page", "price": "29", "priceCurrency": "EUR", "url": "https://detekia.fr/pricing" },
          { "@type": "Offer", "name": "Audit Pro Multi-Pages", "price": "99", "priceCurrency": "EUR", "url": "https://detekia.fr/pricing" }
        ]
      }} />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        }) }} />
      </Head>

      <Header ctaLabel={t('nav.ctaAnalyze')} />
      <main>

      {/* HERO */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(30px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 14, color: '#1A1916' }}>{t('pricing.hero.title')}</h1>
        <p style={{ fontSize: 15, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 52 }}>{t('pricing.hero.subtitle')}</p>
      </div>

      {/* PLANS */}
      <div className="pricing-cards" style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }}>
        {/* FREE */}
        <div className="card-interactive" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '28px 24px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{t('pricing.free.label')}</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#1A1916', letterSpacing: -1, marginBottom: 4 }}>{t('pricing.free.price')}</div>
          <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', marginBottom: 20, lineHeight: 1.5 }}>{t('pricing.free.subtitle')}</div>
          <div style={{ fontSize: 11, color: '#B0ABA5', fontFamily: 'system-ui', marginBottom: 20, lineHeight: 1.5 }}>sans inscription</div>
          <Link href="/" style={{ display: 'block', textAlign: 'center', background: '#F0EDE8', color: '#1A1916', padding: '11px 0', borderRadius: 9, fontWeight: 600, fontSize: 13, textDecoration: 'none', fontFamily: 'system-ui', marginBottom: 24 }}>{t('pricing.free.cta')}</Link>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {freeFeatures.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: feat.included ? '#10A37F' : '#D0CBC5', flexShrink: 0 }}>{feat.included ? '✓' : '✗'}</span>
                <span style={{ fontSize: 12, color: feat.included ? '#3A3835' : '#C2BDB8', fontFamily: 'system-ui' }}>{feat.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RAPPORT */}
        <div className="card-interactive" style={{ background: '#1A1916', border: '1px solid rgba(247,245,242,0.08)', borderRadius: 16, padding: '28px 24px', position: 'relative', boxShadow: '0 16px 48px rgba(26,25,22,0.2)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.45)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{t('pricing.report.label')}</div>
          <div style={{ marginBottom: 4 }}><span style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#F7F5F2', letterSpacing: -1 }}>{t('pricing.report.price')}</span></div>
          <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', marginBottom: 6 }}>{t('pricing.report.paymentInfo')}</div>
          {t('pricing.report.subtitle') && <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.65)', fontFamily: 'system-ui', marginBottom: 20, lineHeight: 1.5 }}>{t('pricing.report.subtitle')}</div>}
          <button
            ref={triggerRef}
            onClick={() => { setSelectedPlan('rapport'); openModal(); }}
            style={{ display: 'block', width: '100%', textAlign: 'center', background: '#D97757', color: '#fff', padding: '13px 0', borderRadius: 9, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'system-ui', marginBottom: 24 }}>
            {t('pricing.report.cta')}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
            {reportFeatures.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#10A37F', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 12, color: 'rgba(247,245,242,0.75)', fontFamily: 'system-ui' }}>{feat.text}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(247,245,242,0.06)' }}>
            <Link href="/one-page" style={{ fontSize: 12, color: '#D97757', textDecoration: 'none', fontFamily: 'system-ui', borderBottom: '1px solid rgba(217,119,87,0.3)', paddingBottom: 1 }}>{t('pricing.report.learnMore')}</Link>
          </div>
        </div>

        {/* PRO */}
        <div className="card-interactive" style={{ background: '#1A1916', border: '1px solid rgba(247,245,242,0.08)', borderRadius: 16, padding: '28px 24px', position: 'relative', boxShadow: '0 16px 48px rgba(26,25,22,0.2)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.45)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{t('pricing.proCard.label')}</div>
          <div style={{ marginBottom: 4 }}><span style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#F7F5F2', letterSpacing: -1 }}>{t('pricing.proCard.price')}</span></div>
          <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', marginBottom: 6 }}>{t('pricing.proCard.paymentInfo')}</div>
          {t('pricing.proCard.subtitle') && <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.65)', fontFamily: 'system-ui', marginBottom: 20, lineHeight: 1.5 }}>{t('pricing.proCard.subtitle')}</div>}
          <button
            onClick={() => { setSelectedPlan('pro'); openModal(); }}
            style={{ display: 'block', width: '100%', textAlign: 'center', background: '#D97757', color: '#fff', padding: '13px 0', borderRadius: 9, fontWeight: 700, fontSize: 14, fontFamily: 'system-ui', border: 'none', cursor: 'pointer', marginBottom: 24 }}>
            {t('pricing.proCard.cta')}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
            {t('pricing.proCard.features').map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#10A37F', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 12, color: 'rgba(247,245,242,0.75)', fontFamily: 'system-ui' }}>{feat.text}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(247,245,242,0.06)' }}>
            <Link href="/pro" style={{ fontSize: 12, color: '#D97757', textDecoration: 'none', fontFamily: 'system-ui', borderBottom: '1px solid rgba(217,119,87,0.3)', paddingBottom: 1 }}>{t('pricing.proCard.learnMore')}</Link>
          </div>
        </div>
      </div>

      {/* GARANTIE */}
      <div style={{ maxWidth: 560, margin: '0 auto 64px', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '20px 28px', display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 24 }}>🔒</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 3 }}>{t('pricing.guarantee.title')}</div>
            <div style={{ fontSize: 12, color: '#8A8680', fontFamily: 'system-ui' }}>{t('pricing.guarantee.subtitle')}</div>
          </div>
        </div>
      </div>

      {/* FAQ — Accordion */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>{t('pricing.faq.label')}</div>
        {faqItems.map((faq, i) => (
          <details key={i} className="pricing-faq-item" style={{ borderBottom: '1px solid #E5E2DC' }}>
            <summary style={{ padding: '18px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, listStyle: 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.4 }}>{faq.q}</span>
              <span className="pricing-faq-icon" style={{ fontSize: 18, color: '#B0ABA5', flexShrink: 0, transition: 'transform 0.2s ease', fontWeight: 300 }}>+</span>
            </summary>
            <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui', paddingBottom: 18 }}>{faq.a}</div>
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
          </div>
          {['products', 'resources', 'legal'].map((section) => (
            <div key={section}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>{t(`homepage.footer.${section}.label`)}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {t(`homepage.footer.${section}.links`).map((link) => (
                  <Link key={link.href} href={link.href} style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{link.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>

      {/* URL MODAL */}
      {showModal && (
        <div
          onClick={closeModal}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,0.72)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, maxWidth: 460, width: '100%', padding: '32px 28px', position: 'relative', boxShadow: '0 24px 64px rgba(26,25,22,0.28)' }}
          >
            <button onClick={closeModal} aria-label="Fermer" style={{ position: 'absolute', top: 16, right: 16, background: '#F0EDE8', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#8A8680', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
            <h2 id="modal-title" style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 10, lineHeight: 1.2 }}>{selectedPlan === 'pro' ? t('pricing.modalPro.title') : t('pricing.modal.title')}</h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#8A8680', lineHeight: 1.65, marginBottom: 24 }}>{selectedPlan === 'pro' ? t('pricing.modalPro.subtitle') : t('pricing.modal.subtitle')}</p>

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

            <button
              onClick={handleModalSubmit}
              disabled={modalLoading || !modalUrl.trim()}
              style={{ display: 'block', width: '100%', background: '#D97757', color: '#fff', padding: '14px 0', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: modalLoading || !modalUrl.trim() ? 'not-allowed' : 'pointer', fontFamily: 'system-ui', opacity: modalLoading || !modalUrl.trim() ? 0.6 : 1, transition: 'opacity 0.2s', marginBottom: 12 }}>
              {modalLoading ? (loadingText || '...') : (selectedPlan === 'pro' ? t('pricing.modalPro.submitButton') : t('pricing.modal.submitButton'))}
            </button>
            {showFallback && (
              <button onClick={() => { setSelectedPlan('rapport'); setShowFallback(false); setModalError(''); }}
                style={{ display: 'block', width: '100%', background: '#1A1916', color: '#F7F5F2', padding: '13px 0', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'system-ui', marginBottom: 12 }}>
                {t('pricing.modal.errorProInsufficient_cta')}
              </button>
            )}
            <button onClick={closeModal} style={{ display: 'block', width: '100%', background: 'transparent', color: '#8A8680', padding: '10px 0', border: 'none', cursor: 'pointer', fontFamily: 'system-ui', fontSize: 13 }}>
              {t('pricing.modal.cancelButton')}
            </button>
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
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 14, maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 64px rgba(26,25,22,0.28)' }}
          >
            <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600, color: '#1A1916' }}>{selectedPlan === 'pro' ? t('pricing.proCard.label') : t('pricing.report.label')}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', letterSpacing: 1, marginTop: 3 }}>{selectedPlan === 'pro' ? t('pricing.proCard.price') : t('pricing.report.price')} &middot; {selectedPlan === 'pro' ? t('pricing.proCard.paymentInfo') : t('pricing.report.paymentInfo')}</div>
              </div>
              <button onClick={closeCheckout} aria-label="Fermer" style={{ background: '#F0EDE8', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#8A8680', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>x</button>
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
          .pricing-cards { grid-template-columns: 1fr !important; }
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
