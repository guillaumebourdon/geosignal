import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function RotatingStats({ stats, finalizingText, locale }) {
  const [shuffled, setShuffled] = useState([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [showFinalizing, setShowFinalizing] = useState(false);

  const openQuote = locale === 'en' ? '\u201C' : '\u00AB\u00A0';
  const closeQuote = locale === 'en' ? '\u201D' : '\u00A0\u00BB';

  useEffect(() => {
    if (!stats || !stats.length) return;
    const arr = [...stats];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
  }, [stats]);

  useEffect(() => {
    if (!shuffled.length) return;
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => {
          if (showFinalizing) {
            setShowFinalizing(false);
            return 0;
          }
          if (prev >= shuffled.length - 1) {
            setShowFinalizing(true);
            return prev;
          }
          return prev + 1;
        });
        setVisible(true);
      }, 200);
    }, 7500);
    return () => clearInterval(timer);
  }, [shuffled, showFinalizing]);

  if (!shuffled.length) return null;
  const current = shuffled[index];

  return (
    <div style={{ textAlign: 'center', marginTop: 28, minHeight: 80 }}>
      <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 300ms ease', maxWidth: 640, margin: '0 auto' }}>
        {showFinalizing ? (
          <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', fontStyle: 'italic' }}>{finalizingText}</p>
        ) : (
          <>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(18px, 4vw, 22px)', lineHeight: 1.5, color: '#1A1916', letterSpacing: '-0.3px', marginBottom: 12 }}>
              <span style={{ color: '#C9A84C', fontSize: 'clamp(22px, 5vw, 28px)', verticalAlign: '-3px', marginRight: 4 }}>{openQuote}</span>
              {current.text}
              <span style={{ color: '#C9A84C', fontSize: 'clamp(22px, 5vw, 28px)', verticalAlign: '-3px', marginLeft: 4 }}>{closeQuote}</span>
            </p>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#8A8680', fontStyle: 'italic', letterSpacing: '0.5px' }}>
              — {current.source}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Tooltip({ info }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  if (!info) return null;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={e => { const rect = e.currentTarget.getBoundingClientRect(); setPos({ top: rect.bottom + 8, left: rect.left }); setVisible(true); }}
      onMouseLeave={() => setVisible(false)}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', background: 'rgba(138,134,128,0.12)', color: '#8A8680', fontSize: 10, fontFamily: 'system-ui', fontWeight: 600, cursor: 'help', marginLeft: 6, flexShrink: 0, border: '1px solid rgba(138,134,128,0.2)' }}>ⓘ</span>
      {visible && (
        <div style={{ position: 'fixed', top: pos.top, left: Math.min(pos.left, typeof window !== 'undefined' ? window.innerWidth - 320 : 0), width: 300, zIndex: 1000, background: '#1A1916', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px', boxShadow: '0 16px 48px rgba(0,0,0,0.24)', animation: 'tooltipIn 0.15s ease', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>{info.emoji}</span>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#F7F5F2' }}>{info.title}</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(247,245,242,0.6)', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 12 }}>{info.desc}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: info.color }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: info.color, letterSpacing: 1 }}>{info.impact}</span>
          </div>
        </div>
      )}
    </span>
  );
}

function GroupAccordion({ group, getCriteriaForGroup, getLevelColor, isOpen, onMouseEnter, onMouseLeave, t }) {
  const criteria = getCriteriaForGroup(group);
  const grades = t('common.grades');
  const criteriaInfo = t('results.criteriaInfo');

  return (
    <div style={{ marginBottom: 2 }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', background: isOpen ? group.colorLight : '#fff', border: `1.5px solid ${isOpen ? group.color : '#E5E2DC'}`, borderRadius: isOpen && criteria.length > 0 ? '12px 12px 0 0' : 12, cursor: 'default', transition: 'all 0.2s ease' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: group.color, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{group.label}</span>
        <span style={{ fontSize: 12, color: '#8A8680', fontFamily: 'system-ui' }}>— {group.desc}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: group.color, fontFamily: 'system-ui' }}>{isOpen ? t('results.accordion.hide') : t('results.accordion.show')}</span>
      </div>
      {isOpen && (
        <div style={{ border: `1.5px solid ${group.color}`, borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden', animation: 'fadeIn 0.5s ease' }}>
          {criteria.map((c, i) => {
            const levelColor = getLevelColor(c.score, c.max);
            const pct = Math.round((c.score / c.max) * 100);
            const info = criteriaInfo[c.name];
            return (
              <div key={i} style={{ background: '#fff', padding: '16px 20px', borderTop: i > 0 ? '1px solid #E5E2DC' : 'none', borderLeft: `3px solid ${levelColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1916', fontFamily: 'system-ui' }}>{info?.title || c.name}</span>
                    <Tooltip info={info} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 4, background: levelColor + '18', color: levelColor }}>{pct >= 75 ? grades.good : pct >= 45 ? grades.average : grades.poor}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 500, color: levelColor }}>{c.score}/{c.max}</span>
                  </div>
                </div>
                <div style={{ height: 3, background: '#E5E2DC', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: levelColor, borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui' }}>{c.detail}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecoCard({ r, index, isPaid, onCheckout, total, t }) {
  const priorities = t('common.priorities');
  const recoSections = t('common.recoSections');
  const ci = t('results.criteriaInfo');
  const translateCrit = (name) => ci[name]?.title || name;
  const tagColors = {
    high:   { bg: 'rgba(217,119,87,0.12)', color: '#D97757', border: 'rgba(217,119,87,0.3)' },
    medium: { bg: 'rgba(201,134,26,0.12)', color: '#C9861A', border: 'rgba(201,134,26,0.3)' },
    low:    { bg: 'rgba(16,163,127,0.12)', color: '#10A37F', border: 'rgba(16,163,127,0.3)' },
  };
  const tag = tagColors[r.priority] || tagColors.medium;

  if (!isPaid && index >= 1) return null;

  if (!isPaid && index === 0) {
    const preview = (r.text || r.diagnostic || '').slice(0, 350);
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ background: '#fff', border: `1px solid ${tag.border}`, borderRadius: 14, overflow: 'hidden', borderLeft: `4px solid ${tag.color}` }}>
          <div style={{ padding: '16px 24px 14px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 6, fontWeight: 500, background: tag.bg, color: tag.color }}>{priorities[r.priority] || priorities.medium}</span>
            {r.criterion && <span style={{ fontSize: 11, color: '#8A8680', fontFamily: 'monospace' }}>{translateCrit(r.criterion)}</span>}
            <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8' }}>#01</span>
          </div>
          <div style={{ padding: '16px 24px 0', position: 'relative' }}>
            <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.8, fontFamily: 'system-ui' }}>{preview}...</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to bottom, transparent, #ffffff)', pointerEvents: 'none' }} />
          </div>
          <div className="reco-preview-cta" style={{ margin: '12px 24px 0', padding: '14px 18px', background: '#F7F5F2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 3 }}>{t('results.recos.previewLocked')}</div>
              <div style={{ fontSize: 11, color: '#8A8680', fontFamily: 'system-ui' }}>{t('results.recos.previewSubtext')}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
              <button onClick={onCheckout} style={{ background: tag.color, color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 12, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'system-ui' }}>{t('results.recos.previewUnlock')}</button>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757' }}>{t('results.recos.previewPrice')}</div>
            </div>
          </div>
          <div style={{ margin: '0 24px 20px', paddingTop: 12, borderTop: '1px solid #E5E2DC', fontSize: 11, color: '#8A8680', fontStyle: 'italic', fontFamily: 'system-ui' }}>
            {t('results.recos.previewFooter').replace('{count}', total)}
          </div>
        </div>
      </div>
    );
  }

  const sections = [];
  recoSections.forEach(s => {
    if (r[s.key]) sections.push({ icon: s.icon, title: s.label, content: r[s.key] });
  });
  if (sections.length === 0 && r.text) sections.push({ icon: '✅', title: t('common.recoFallbackLabel'), content: r.text });

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ background: '#fff', border: `1px solid ${tag.border}`, borderRadius: 14, overflow: 'hidden', borderLeft: `4px solid ${tag.color}` }}>
        <div style={{ padding: '16px 24px 14px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 6, fontWeight: 500, background: tag.bg, color: tag.color }}>{priorities[r.priority] || priorities.medium}</span>
          {r.criterion && <span style={{ fontSize: 11, color: '#8A8680', fontFamily: 'monospace' }}>{translateCrit(r.criterion)}</span>}
          {r.title && <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui' }}>{r.title}</span>}
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8', marginLeft: r.title ? 8 : 'auto' }}>#{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sections.map((s, j) => (
            <div key={j} style={{ background: '#FAFAF9', borderRadius: 8, padding: '12px 16px', border: '1px solid #E5E2DC' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1916', marginBottom: 6, fontFamily: 'system-ui' }}>{s.icon} {s.title}</div>
              <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.75, fontFamily: 'system-ui' }}>{s.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Results() {
  const router = useRouter();
  const { url } = router.query;
  const { t, locale } = useTranslation();
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingDots, setLoadingDots] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [captureEmail, setCaptureEmail] = useState('');
  const [captureSent, setCaptureSent] = useState(false);
  const [captureLoading, setCaptureLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef(null);

  const grades = t('common.grades');
  const verdicts = t('common.verdicts');
  const loadingSteps = t('results.loading.steps');
  const groups = t('results.groups');
  const criteriaInfoMain = t('results.criteriaInfo');

  async function handleCaptureEmail(e) {
    e.preventDefault();
    if (!captureEmail || !captureEmail.includes('@')) return;
    setCaptureLoading(true);
    try {
      await fetch('/api/capture-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: captureEmail, url, score: result?.score }) });
      setCaptureSent(true);
    } catch (_) { setCaptureSent(true); } finally { setCaptureLoading(false); }
  }

  const fetchClientSecret = useCallback(() =>
    fetch('/api/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: 'rapport', url, score: result?.score, locale: router.locale }) })
    .then(r => r.json()).then(d => d.clientSecret),
  [url, result]);

  async function handleCheckout() {
    setCheckoutLoading(true);
    try { const secret = await fetchClientSecret(); if (secret) { setClientSecret(secret); setShowCheckout(true); } }
    catch (e) { console.error('Checkout error:', e); }
    finally { setCheckoutLoading(false); }
  }

  function closeCheckout() { setShowCheckout(false); setClientSecret(null); }

  useEffect(() => { const i = setInterval(() => setLoadingDots(d => d.length >= 3 ? '' : d + '.'), 400); return () => clearInterval(i); }, []);

  useEffect(() => {
    if (!showShare) return;
    function handleClickOutside(e) { if (shareRef.current && !shareRef.current.contains(e.target)) setShowShare(false); }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShare]);

  useEffect(() => {
    if (!url) return;
    let stepInterval = setInterval(() => setStep(s => s < loadingSteps.length - 1 ? s + 1 : s), 1200);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);
    fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, locale }), signal: controller.signal })
      .then(r => r.json())
      .then(data => { clearTimeout(timeoutId); clearInterval(stepInterval); setStep(loadingSteps.length); if (data.error) setError(data.error); else setResult(data); })
      .catch(e => { clearTimeout(timeoutId); clearInterval(stepInterval); setError(e.name === 'AbortError' ? t('results.error.timeout') : e.message); });
    return () => clearInterval(stepInterval);
  }, [url]);

  function getGrade(score) {
    if (score >= 70) return { label: grades.good, color: '#10A37F', bg: 'rgba(16,163,127,0.12)' };
    if (score >= 45) return { label: grades.average, color: '#C9861A', bg: 'rgba(201,134,26,0.12)' };
    return { label: grades.poor, color: '#D97757', bg: 'rgba(217,119,87,0.12)' };
  }

  function getVerdict(label) {
    if (label === grades.good) return verdicts.good;
    if (label === grades.average) return verdicts.average;
    return verdicts.poor;
  }

  function getCriteriaForGroup(group) { return result ? result.criteria.filter(c => group.criteria.includes(c.name)) : []; }
  function getGroupScore(group) { const items = getCriteriaForGroup(group); return { score: items.reduce((s, c) => s + c.score, 0), max: items.reduce((s, c) => s + c.max, 0) }; }
  function getLevelColor(score, max) { const pct = score / max; return pct >= 0.75 ? '#10A37F' : pct >= 0.45 ? '#C9861A' : '#D97757'; }

  const [openGroup, setOpenGroup] = useState(null);
  const closeTimeoutRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);
  function handleGroupEnter(groupId) { if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current); setOpenGroup(groupId); }
  function handleGroupLeave() { closeTimeoutRef.current = setTimeout(() => setOpenGroup(null), 150); }
  useEffect(() => { function onScroll() { setShowSticky(window.scrollY > 400); } window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);

  const isPaid = false;
  const grade = result ? getGrade(result.score) : null;
  const recommendations = result?.recommendations || [];
  const shareText = t('results.share.text').replace('{score}', result?.score || '');

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      <Header showLanguageSwitcher={false} ctaLabel={t('results.nav.newAnalysis')} />

      {!result && !error && (
        <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <div style={{ width: '100%', maxWidth: 560 }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E5E2DC', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97757', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#8A8680' }}>{url}</span>
              </div>
              <h1 style={{ fontSize: 32, color: '#1A1916', letterSpacing: -1, marginBottom: 8, lineHeight: 1.1 }}>{t('results.loading.title')}{loadingDots}</h1>
              <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui' }}>{t('results.loading.subtitle')}</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 20, padding: '32px 36px', boxShadow: '0 4px 32px rgba(26,25,22,0.06)' }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase' }}>{t('results.loading.progress')}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757' }}>{Math.round((step / loadingSteps.length) * 100)}%</span>
                </div>
                <div style={{ height: 4, background: '#F0EDE8', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(step / loadingSteps.length) * 100}%`, background: 'linear-gradient(90deg, #D97757, #C9861A)', borderRadius: 4, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
                </div>
              </div>
              {loadingSteps.map((s, i) => {
                const isDone = i < step;
                const isActive = i === step;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0', borderBottom: i < loadingSteps.length - 1 ? '1px solid #F7F5F2' : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? '#10A37F' : isActive ? '#1A1916' : '#F0EDE8', transition: 'all 0.4s ease' }}>
                      {isDone ? <span style={{ color: '#fff', fontSize: 14 }}>✓</span> : isActive ? <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(247,245,242,0.3)', borderTopColor: '#F7F5F2', animation: 'spin 0.8s linear infinite' }} /> : <span style={{ fontSize: 16 }}>{s.icon}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isDone ? '#10A37F' : isActive ? '#1A1916' : '#C2BDB8', fontFamily: 'system-ui' }}>{s.text}</div>
                      {isActive && <div style={{ fontSize: 11, color: '#8A8680', fontFamily: 'system-ui', marginTop: 2 }}>{s.sub}</div>}
                    </div>
                    {isDone && <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#10A37F' }}>OK</span>}
                  </div>
                );
              })}
            </div>
            <RotatingStats stats={t('results.loading.stats')} finalizingText={t('results.loading.finalizing')} locale={locale} />
          </div>
        </div>
      )}

      {error && (
        <div style={{ maxWidth: 560, margin: '80px auto', padding: '0 24px' }}>
          <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 16, padding: '28px 32px' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 8 }}>{t('results.error.title')}</div>
            <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 20 }}>{error}</div>
            <Link href="/" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>{t('results.error.retry')}</Link>
          </div>
        </div>
      )}

      {result && grade && (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 100px' }}>

          <div style={{ background: '#1A1916', borderRadius: 24, overflow: 'hidden', marginBottom: 20, boxShadow: '0 12px 48px rgba(26,25,22,0.18)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: grade.color, opacity: 0.06, pointerEvents: 'none' }} />
            <div className="score-header" style={{ display: 'grid', gridTemplateColumns: '160px 1fr' }}>
              <div className="score-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 20px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 68, lineHeight: 1, color: '#F7F5F2', letterSpacing: -3, marginBottom: 4 }}>{result.score}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(247,245,242,0.25)', letterSpacing: 1 }}>/100</div>
                <div style={{ marginTop: 14, fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, padding: '4px 12px', borderRadius: 20, background: grade.bg, color: grade.color }}>{grade.label}</div>
              </div>
              <div className="score-right" style={{ padding: '32px 36px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', marginBottom: 8 }}>{url}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F7F5F2', marginBottom: 12, lineHeight: 1.2 }}>{getVerdict(grade.label)}</div>
                <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.5)', lineHeight: 1.7, fontFamily: 'system-ui' }}>{result.verdict}</div>
                <div className="group-bars" style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  {groups.map(g => {
                    const { score, max } = getGroupScore(g);
                    const pct = Math.round((score / max) * 100);
                    return (
                      <div key={g.id} style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 8, color: g.color, letterSpacing: 1, textTransform: 'uppercase' }}>{g.label}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(247,245,242,0.3)' }}>{score}/{max}</span>
                        </div>
                        <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: g.color, borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {!isPaid && (
            <div className="promo-block" style={{ display: 'flex', alignItems: 'center', gap: 28, background: 'linear-gradient(to right, #fff, rgba(217,119,87,0.06))', border: '1px solid rgba(217,119,87,0.15)', borderRadius: 16, padding: '28px 32px', marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1916', marginBottom: 6 }}>{t('results.promo.title')}</div>
                <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', lineHeight: 1.6, marginBottom: 14 }}>{t('results.promo.desc').replace('{count}', recommendations.length)}</div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'system-ui', fontSize: 11, color: '#10A37F' }}>{t('results.promo.feat1')}</span>
                  <span style={{ fontFamily: 'system-ui', fontSize: 11, color: '#4285F4' }}>{t('results.promo.feat2')}</span>
                  <span style={{ fontFamily: 'system-ui', fontSize: 11, color: '#D97757' }}>{t('results.promo.feat3')}</span>
                </div>
                <a href={locale === 'en' ? '/example-report.html' : '/exemple-rapport.html'} target="_blank" rel="noopener" style={{ fontSize: 11, color: '#D97757', textDecoration: 'underline', fontFamily: 'system-ui', marginTop: 8, display: 'inline-block' }}>{t('results.promo.exampleLink')}</a>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#D97757', fontWeight: 'bold', lineHeight: 1 }}>{t('results.promo.price')}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 1 }}>{t('results.promo.priceNote')}</div>
                <button onClick={handleCheckout} disabled={checkoutLoading} style={{ display: 'block', background: '#D97757', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 13, fontWeight: 600, fontFamily: 'system-ui', cursor: checkoutLoading ? 'wait' : 'pointer', marginTop: 10, whiteSpace: 'nowrap', opacity: checkoutLoading ? 0.7 : 1 }}>
                  {checkoutLoading ? t('results.promo.ctaLoading') : t('results.promo.cta')}
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, position: 'relative' }} ref={shareRef}>
            <button onClick={() => setShowShare(v => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent', border: '1px solid #E5E2DC', borderRadius: 8, padding: '10px 20px', color: '#8A8680', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A1916'; e.currentTarget.style.color = '#1A1916'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E2DC'; e.currentTarget.style.color = '#8A8680'; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              {t('results.share.button')}
            </button>
            {showShare && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: 8, zIndex: 50, minWidth: 220 }}>
                {[
                  { label: 'LinkedIn', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>, action: () => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://www.detekia.fr&summary=${encodeURIComponent(shareText)}`, '_blank'); setShowShare(false); } },
                  { label: 'Twitter / X', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, action: () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank'); setShowShare(false); } },
                  { label: copied ? t('results.share.copied') : t('results.share.copyLink'), icon: copied ? null : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>, action: () => { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => { setCopied(false); setShowShare(false); }, 2000); } },
                ].map(({ label, icon, action }) => (
                  <button key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'system-ui', color: '#3A3835', textAlign: 'left', transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#F7F5F2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {icon && <span style={{ color: '#8A8680', flexShrink: 0 }}>{icon}</span>}{label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{t('results.detailedAnalysis')}</div>
          {groups.map(group => (
            <GroupAccordion key={group.id} group={group} getCriteriaForGroup={getCriteriaForGroup} getLevelColor={getLevelColor} isOpen={openGroup === group.id} onMouseEnter={() => handleGroupEnter(group.id)} onMouseLeave={handleGroupLeave} t={t} />
          ))}

          <div style={{ margin: '24px 0', background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '24px 28px' }}>
            {captureSent ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>✓</span>
                <span style={{ fontFamily: 'system-ui', fontSize: 14, color: '#10A37F', fontWeight: 500 }}>{t('results.capture.sent')}</span>
              </div>
            ) : (
              <>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1A1916', marginBottom: 4 }}>{t('results.capture.title')}</div>
                <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#8A8680', marginBottom: 16 }}>{t('results.capture.subtitle')}</div>
                <form onSubmit={handleCaptureEmail} className="capture-form" style={{ display: 'flex', gap: 8 }}>
                  <input type="email" value={captureEmail} onChange={e => setCaptureEmail(e.target.value)} placeholder={t('results.capture.placeholder')} required style={{ flex: 1, border: '1px solid #E5E2DC', borderRadius: 8, padding: '12px 16px', fontSize: 14, fontFamily: 'system-ui', color: '#1A1916', background: '#fff', outline: 'none' }} />
                  <button type="submit" disabled={captureLoading} style={{ background: '#1A1916', color: '#F7F5F2', border: 'none', borderRadius: 8, padding: '12px 24px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 600, cursor: captureLoading ? 'wait' : 'pointer', whiteSpace: 'nowrap', opacity: captureLoading ? 0.7 : 1 }}>{captureLoading ? '…' : t('results.capture.submit')}</button>
                </form>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 1, marginTop: 10 }}>{t('results.capture.noSpam')}</div>
              </>
            )}
          </div>

          {recommendations.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{t('results.recos.label')}</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', letterSpacing: -0.5 }}>{t('results.recos.title').replace('{count}', recommendations.length)}</div>
                </div>
                {!isPaid && (
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', background: 'rgba(217,119,87,0.08)', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(217,119,87,0.2)' }}>
                    {t('results.recos.lockedCount').replace('{preview}', '1').replace('{locked}', recommendations.length - 1)}
                  </div>
                )}
              </div>

              {recommendations.map((r, i) => (
                <RecoCard key={i} r={r} index={i} isPaid={isPaid} onCheckout={handleCheckout} total={recommendations.length} t={t} />
              ))}

              {!isPaid && recommendations.length > 1 && (
                <div style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 14, padding: '20px 24px', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 8 }}>
                    {(recommendations.length - 1) === 1 ? t('results.recos.lockedReco1') : t('results.recos.lockedRecoN').replace('{count}', recommendations.length - 1)}
                  </div>
                  <div style={{ fontSize: 12, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.7 }}>
                    {recommendations.slice(1).map(r => criteriaInfoMain[r.criterion]?.title || r.criterion || r.title).filter(Boolean).join(' · ')}
                  </div>
                </div>
              )}

              {!isPaid && (
                <div className="unlock-cta" style={{ marginTop: 16, background: '#1A1916', borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, boxShadow: '0 8px 32px rgba(26,25,22,0.12)' }}>
                  <div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F7F5F2', marginBottom: 6 }}>{t('results.unlock.title')}</div>
                    <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', lineHeight: 1.6 }}>{t('results.unlock.desc').replace('{count}', recommendations.length - 1)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <button onClick={handleCheckout} disabled={checkoutLoading} style={{ background: '#D97757', color: '#fff', padding: '16px 36px', borderRadius: 10, fontWeight: 700, fontSize: 15, border: 'none', cursor: checkoutLoading ? 'wait' : 'pointer', whiteSpace: 'nowrap', fontFamily: 'system-ui', opacity: checkoutLoading ? 0.7 : 1, animation: checkoutLoading ? 'none' : 'ctaPulse 2.4s ease-in-out infinite' }}>{checkoutLoading ? t('results.unlock.ctaLoading') : t('results.unlock.cta')}</button>
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.35)' }}>{t('results.unlock.subtext')}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!isPaid && showSticky && result && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: '#1A1916', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, boxShadow: '0 -4px 24px rgba(26,25,22,0.18)' }}>
          <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#F7F5F2', fontWeight: 500 }}>{t('results.sticky.title').replace('{count}', recommendations.length)}</div>
          <button onClick={handleCheckout} disabled={checkoutLoading} style={{ background: '#D97757', color: '#fff', padding: '10px 24px', borderRadius: 10, fontWeight: 600, fontSize: 13, border: 'none', cursor: checkoutLoading ? 'wait' : 'pointer', whiteSpace: 'nowrap', fontFamily: 'system-ui', flexShrink: 0, opacity: checkoutLoading ? 0.7 : 1 }}>
            {checkoutLoading ? '...' : t('results.sticky.cta')}
          </button>
        </div>
      )}

      {showCheckout && clientSecret && (
        <div onClick={closeCheckout} style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,0.72)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 64px rgba(26,25,22,0.28)' }}>
            <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600, color: '#1A1916' }}>{t('results.checkout.title')}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', letterSpacing: 1, marginTop: 3 }}>{t('results.checkout.subtext')}</div>
              </div>
              <button onClick={closeCheckout} style={{ background: '#F0EDE8', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#8A8680', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
            </div>
            <div style={{ padding: '16px 0 0' }}>
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </div>
      )}

      {/* Pro teaser — discret, en bas de page */}
      {result && (
        <div style={{ textAlign: 'center', padding: '60px 24px 32px', maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 6 }}>
            {t('results.proTeaser')}{' '}
            <Link href="/pro" style={{ color: '#1A1916', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              {t('results.proTeaserLink')}
            </Link>
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes tooltipIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ctaPulse { 0%, 100% { box-shadow: 0 8px 24px rgba(217,119,87,0.35); } 50% { box-shadow: 0 8px 36px rgba(217,119,87,0.65); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .unlock-cta > div:last-child { width: 100% !important; align-items: flex-start !important; }
          .unlock-cta > div:last-child button { width: 100% !important; text-align: center !important; }
          .reco-preview-cta { flex-direction: column !important; }
          .reco-preview-cta > div:last-child { align-items: flex-start !important; width: 100% !important; }
          .reco-preview-cta > div:last-child button { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
