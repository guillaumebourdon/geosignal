/**
 * Shared checkout flow — URL modal + page selector (Pro) + Stripe embedded checkout.
 * Used by /pro, /one-page.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useTranslation } from '../lib/useTranslation';
import { useFocusTrap } from '../lib/useFocusTrap';
import PageSelector from './PageSelector';

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

export default function CheckoutFlow({ plan, showModal, onClose, initialUrl, onSwitchPlan }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [modalUrl, setModalUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [showFallback, setShowFallback] = useState(false);

  // Verification steps state (Pro flow) — visual progression
  const [verificationStep, setVerificationStep] = useState(0); // 0=none, 1-5=visual steps
  const verificationTimerRef = useRef(null);

  // Page selector state (Pro flow only)
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [suggestedPages, setSuggestedPages] = useState([]);
  const [pageSelectorHostname, setPageSelectorHostname] = useState('');
  const [pageSelectorUrl, setPageSelectorUrl] = useState('');

  const inputRef = useRef(null);
  const modalTrapRef = useFocusTrap(showModal && !showCheckout && !showPageSelector);
  const pageSelectorTrapRef = useFocusTrap(showPageSelector);
  const checkoutTrapRef = useFocusTrap(showCheckout);

  useEffect(() => {
    if (showModal) {
      if (initialUrl) setModalUrl(initialUrl);
      if (inputRef.current) inputRef.current.focus();
    }
  }, [showModal, initialUrl]);

  useEffect(() => {
    if (!showModal) return;
    function onKey(e) { if (e.key === 'Escape') handleClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showModal]);

  function handleClose() {
    setModalUrl(''); setUrlError(''); setModalError('');
    setShowCheckout(false); setClientSecret(null);
    setShowFallback(false); setLoadingText('');
    if (verificationTimerRef.current) clearInterval(verificationTimerRef.current);
    setVerificationStep(0);
    setShowPageSelector(false); setSuggestedPages([]);
    setPageSelectorHostname(''); setPageSelectorUrl('');
    onClose();
  }

  async function proceedToCheckout(url, pages) {
    setModalLoading(true);
    try {
      const body = { plan, url, locale: router.locale };
      if (pages) body.pages = pages;
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setShowPageSelector(false);
        setClientSecret(data.clientSecret);
        setShowCheckout(true);
      } else {
        setModalError(t('pricing.modal.errorGeneric'));
      }
    } catch {
      setModalError(t('pricing.modal.errorGeneric'));
    } finally {
      setModalLoading(false);
      setLoadingText('');
    }
  }

  async function handleSubmit() {
    if (!isValidUrl(modalUrl)) { setUrlError(t('pricing.modal.urlInvalidError')); return; }
    setUrlError(''); setModalError(''); setShowFallback(false); setModalLoading(true);
    const url = normalizeUrl(modalUrl);

    // Start visual step progression for Pro (advances automatically every 3s)
    if (plan === 'pro') {
      setVerificationStep(1);
      let step = 1;
      verificationTimerRef.current = setInterval(() => {
        step++;
        if (step <= 4) setVerificationStep(step);
        else clearInterval(verificationTimerRef.current);
      }, 3000);
    }

    // Step 1: Pre-check auditability
    setLoadingText(t('pricing.modal.checking'));
    try {
      const checkRes = await fetch('/api/pre-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, plan }),
      });
      if (checkRes.status === 429) {
        setModalError(t('pricing.modal.errorCheckFailed'));
        setModalLoading(false);
        setLoadingText('');
        return;
      }
      const check = await checkRes.json();

      // Evaluate result based on selected plan
      const isPro = plan === 'pro';
      const auditable = isPro ? check.proAuditable : check.onePageAuditable;

      if (!auditable) {
        if (verificationTimerRef.current) clearInterval(verificationTimerRef.current);
        setVerificationStep(0);
        // Pro not possible but one-page is -> show fallback
        if (isPro && check.onePageAuditable) {
          setModalError(t('pricing.modal.errorProInsufficient'));
          setShowFallback(true);
          setModalLoading(false);
          return;
        }
        // Nothing possible -> show specific error
        const errKey = check.reason === 'antibot_detected' ? 'errorAntibot'
          : check.reason === 'site_unreachable' ? 'errorUnreachable'
          : check.reason === 'no_content' ? 'errorNoContent'
          : 'errorAntibot';
        setModalError(t(`pricing.modal.${errKey}`));
        setModalLoading(false);
        return;
      }
    } catch {
      // Pre-check failed (network error, timeout) -- let the user proceed anyway
      console.warn('[CheckoutFlow] Pre-check failed, proceeding to checkout');
    }

    // Step 2 (Pro only): Show page selector
    if (plan === 'pro') {
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
            if (verificationTimerRef.current) clearInterval(verificationTimerRef.current);
            setVerificationStep(5); // All done
            await new Promise(r => setTimeout(r, 500));
            setSuggestedPages(suggestData.pages);
            setPageSelectorHostname(suggestData.hostname);
            setPageSelectorUrl(url);
            setShowPageSelector(true);
            setModalLoading(false);
            setLoadingText('');
            setVerificationStep(0);
            return;
          }
        }
        console.warn('[CheckoutFlow] suggest-pages failed, proceeding without page selection');
      } catch {
        console.warn('[CheckoutFlow] suggest-pages error, proceeding without page selection');
      }
    }

    // Step 3: Create Stripe checkout
    setLoadingText('');
    await proceedToCheckout(url);
  }

  async function handlePageSelectorConfirm(pages) {
    // Re-validate all pages before proceeding to Stripe
    setShowPageSelector(false);
    setModalLoading(true);
    setLoadingText(t('pageSelector.revalidating'));

    try {
      const urls = pages.map(p => p.url);
      const res = await fetch('/api/validate-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      if (res.ok) {
        const data = await res.json();
        const failed = (data.results || []).filter(r => !r.scrapable);
        if (failed.length > 0) {
          // Update page statuses and return to selector
          const statusMap = {};
          for (const r of data.results) statusMap[r.url] = { scrapable: r.scrapable, reason: r.reason };
          const updatedPages = pages.map(p => ({
            ...p,
            scrapable: statusMap[p.url]?.scrapable !== false,
            reason: statusMap[p.url]?.reason || 'ok',
          }));
          setSuggestedPages(updatedPages);
          setShowPageSelector(true);
          setModalLoading(false);
          setLoadingText('');
          return;
        }
      }
    } catch {
      // Validation failed — proceed anyway (better than blocking checkout entirely)
      console.warn('[CheckoutFlow] Re-validation failed, proceeding to checkout');
    }

    setLoadingText('');
    await proceedToCheckout(pageSelectorUrl, pages);
  }

  function handlePageSelectorBack() {
    setShowPageSelector(false);
  }

  const isPro = plan === 'pro';
  const modalTitle = isPro ? t('pricing.modalPro.title') : t('pricing.modal.title');
  const modalSubtitle = isPro ? t('pricing.modalPro.subtitle') : t('pricing.modal.subtitle');
  const submitText = isPro ? t('pricing.modalPro.submitButton') : t('pricing.modal.submitButton');
  const label = isPro ? t('pricing.proCard.label') : t('pricing.report.label');
  const price = isPro ? t('pricing.proCard.price') : t('pricing.report.price');
  const paymentInfo = isPro ? t('pricing.proCard.paymentInfo') : t('pricing.report.paymentInfo');

  if (!showModal && !showCheckout && !showPageSelector) return null;

  return (
    <>
      {/* URL Modal */}
      {showModal && !showCheckout && !showPageSelector && (
        <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,0.72)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
          <div ref={modalTrapRef} role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, maxWidth: 460, width: '100%', padding: '32px 28px', position: 'relative', boxShadow: '0 24px 64px rgba(26,25,22,0.28)' }}>
            <button onClick={handleClose} aria-label="Fermer" style={{ position: 'absolute', top: 16, right: 16, background: '#F0EDE8', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#6B6762', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 10, lineHeight: 1.2 }}>{modalTitle}</h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', lineHeight: 1.65, marginBottom: 24 }}>{modalSubtitle}</p>
            <div style={{ marginBottom: 20 }}>
              <input ref={inputRef} type="url" aria-label={isPro ? 'URL du site' : 'URL de la page'} value={modalUrl}
                onChange={e => { setModalUrl(e.target.value); setUrlError(''); setModalError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                placeholder={t('pricing.modal.urlPlaceholder')}
                style={{ width: '100%', background: '#F7F5F2', border: urlError ? '1.5px solid #D97757' : '1px solid #E5E2DC', borderRadius: 10, padding: '14px 16px', fontSize: 15, fontFamily: 'system-ui', color: '#1A1916', outline: 'none' }} />
              {urlError && <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#D97757', marginTop: 8 }}>{urlError}</div>}
              {modalError && <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#D97757', marginTop: 10, background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, padding: '12px 14px', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: modalError.replace(/hello@detekia\.fr/g, '<a href="mailto:hello@detekia.fr" style="color:#D97757;font-weight:600">hello@detekia.fr</a>').replace(/DetekiaBot/g, '<code style="background:rgba(217,119,87,0.1);padding:2px 5px;border-radius:3px;font-size:11px">DetekiaBot</code>') }} />}
            </div>
            <button onClick={handleSubmit} disabled={modalLoading || !modalUrl.trim()}
              style={{ display: 'block', width: '100%', background: '#D97757', color: '#fff', padding: '14px 0', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: modalLoading || !modalUrl.trim() ? 'not-allowed' : 'pointer', fontFamily: 'system-ui', opacity: modalLoading || !modalUrl.trim() ? 0.6 : 1, transition: 'opacity 0.2s', marginBottom: 12 }}>
              {modalLoading ? (loadingText || '...') : submitText}
            </button>
            {showFallback && (
              <button onClick={() => { if (onSwitchPlan) { onSwitchPlan('rapport', normalizeUrl(modalUrl)); handleClose(); } else { window.location.href = '/one-page'; } }}
                style={{ display: 'block', width: '100%', background: '#1A1916', color: '#F7F5F2', padding: '13px 0', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'system-ui', marginBottom: 12 }}>
                {t('pricing.modal.errorProInsufficient_cta')}
              </button>
            )}
            <button onClick={handleClose} style={{ display: 'block', width: '100%', background: 'transparent', color: '#6B6762', padding: '10px 0', border: 'none', cursor: 'pointer', fontFamily: 'system-ui', fontSize: 13 }}>
              {t('pricing.modal.cancelButton')}
            </button>
          </div>
        </div>
      )}

      {/* Verification Modal (Pro only) */}
      {verificationStep > 0 && !showPageSelector && !showCheckout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,0.72)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 380, width: '100%', padding: '32px 28px', boxShadow: '0 24px 64px rgba(26,25,22,0.28)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', background: 'rgba(217,119,87,0.1)', marginBottom: 14 }}>
                <span style={{ display: 'block', width: 20, height: 20, borderRadius: '50%', border: '3px solid #D97757', borderTopColor: 'transparent', animation: 'detekia-vspin 0.8s linear infinite' }} />
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1916', marginBottom: 6 }}>{t('checkout.verification.title')}</h3>
              <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762' }}>
                {t('checkout.verification.subtitle') || (router.locale === 'en' ? 'This only takes a few seconds.' : 'Cela ne prend que quelques secondes.')}
              </p>
            </div>
            {[
              { step: 1, label: t('checkout.verification.step1') },
              { step: 2, label: t('checkout.verification.step2') },
              { step: 3, label: t('checkout.verification.step3') },
              { step: 4, label: t('checkout.verification.step4') },
            ].map(({ step, label }) => {
              const done = verificationStep > step;
              const active = verificationStep === step;
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: step < 4 ? '1px solid #F0EDE8' : 'none', opacity: active || done ? 1 : 0.35, transition: 'opacity 0.3s' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    background: done ? '#10A37F' : active ? '#D97757' : '#E5E2DC', transition: 'background 0.3s',
                  }}>
                    {done ? <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>&#10003;</span>
                      : active ? <span style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'detekia-vspin 0.8s linear infinite' }} />
                      : <span style={{ color: '#B0ABA5', fontSize: 11, fontWeight: 600 }}>{step}</span>}
                  </div>
                  <span style={{ fontFamily: 'system-ui', fontSize: 14, color: done ? '#10A37F' : active ? '#1A1916' : '#B0ABA5', fontWeight: active ? 600 : 400 }}>{label}</span>
                  {done && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#10A37F', fontFamily: 'monospace' }}>OK</span>}
                </div>
              );
            })}
            <style>{`@keyframes detekia-vspin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      )}

      {/* Page Selector Modal (Pro only) */}
      {showPageSelector && (
        <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,0.72)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
          <div ref={pageSelectorTrapRef} role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, maxWidth: 560, width: '100%', padding: '32px 28px', position: 'relative', boxShadow: '0 24px 64px rgba(26,25,22,0.28)', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={handleClose} aria-label="Fermer" style={{ position: 'absolute', top: 16, right: 16, background: '#F0EDE8', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#6B6762', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
            <PageSelector
              pages={suggestedPages}
              hostname={pageSelectorHostname}
              onConfirm={handlePageSelectorConfirm}
              onBack={handlePageSelectorBack}
            />
          </div>
        </div>
      )}

      {/* Stripe Checkout */}
      {showCheckout && clientSecret && (
        <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,0.72)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
          <div ref={checkoutTrapRef} role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 64px rgba(26,25,22,0.28)' }}>
            <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600, color: '#1A1916' }}>{label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', letterSpacing: 1, marginTop: 3 }}>{price} · {paymentInfo}</div>
              </div>
              <button onClick={handleClose} style={{ background: '#F0EDE8', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#6B6762', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>x</button>
            </div>
            <div style={{ padding: '16px 0 0' }}>
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
