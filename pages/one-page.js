import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import CheckoutFlow from '../components/CheckoutFlow';
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
    { label: locale === 'en' ? 'Structured data' : 'Données structurées', pct: 85, color: '#10A37F' },
    { label: locale === 'en' ? 'Technical SEO' : 'SEO technique', pct: 68, color: '#D97757' },
    { label: locale === 'en' ? 'Content depth' : 'Profondeur contenu', pct: 42, color: '#D97757' },
    { label: locale === 'en' ? 'Freshness' : 'Fraîcheur', pct: 91, color: '#10A37F' },
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
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D97757' }} /> {locale === 'en' ? 'VISIBILITY SCORE' : 'SCORE DE VISIBILITÉ'}
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
          {locale === 'en' ? '8 CRITERIA ANALYZED' : '8 CRITÈRES ANALYSÉS'}
        </div>
        {criteria.map((c, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: '#3A3835', fontFamily: 'system-ui' }}>{c.label}</span>
              <span style={{ fontSize: 9, color: '#8A8680', fontFamily: 'monospace' }}>{barsVisible ? c.pct : 0}%</span>
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
  const [ctaUrl, setCtaUrl] = useState('');

  const p = (key) => t(`onepage.${key}`);

  const [targetRef, targetVisible] = useScrollReveal(0.1);

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO title={p('seo.title')} description={p('seo.description')} schema={{
        "@context": "https://schema.org", "@type": "Product", "name": "Detekia — Audit GEO 1 page",
        "offers": { "@type": "Offer", "price": "29", "priceCurrency": "EUR", "url": "https://detekia.fr/one-page" }
      }} />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: p('faq.items').map(faq => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })),
        }) }} />
      </Head>
      <Header ctaLabel={t('nav.ctaAnalyze')} />

      {/* ═══ 1. HERO (inchangé) ═══ */}
      <section className="gradient-bg lp-hero-section" style={{ padding: '80px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="lp-hero-grid" style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="reveal" style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.25)', padding: '5px 14px', borderRadius: 20, marginBottom: 24, background: 'rgba(217,119,87,0.08)' }}>
              {p('hero.badge')}
            </div>
            <h1 className="reveal reveal-d1" style={{ fontSize: 'clamp(34px, 5vw, 50px)', lineHeight: 1.06, letterSpacing: -1.5, color: '#F7F5F2', marginBottom: 16 }}>{p('hero.title')}</h1>
            <p className="reveal reveal-d2" style={{ fontSize: 16, color: 'rgba(247,245,242,0.6)', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 32, maxWidth: 460 }}>{p('hero.subtitle')}</p>
            <button onClick={() => setShowCheckout(true)} className="reveal reveal-d3 btn-interactive" style={{ background: '#D97757', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui', marginBottom: 10 }}>
              {p('hero.cta')}
            </button>
            <div className="reveal reveal-d4" style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.25)', letterSpacing: 1.5, marginTop: 8 }}>
              {locale === 'en' ? 'REPORT IN 1 MINUTE • NO SUBSCRIPTION' : 'RAPPORT EN 1 MINUTE • SANS ABONNEMENT'}
            </div>
          </div>
          <div className="lp-hero-mockup reveal reveal-d2" style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroMockup locale={locale} />
          </div>
        </div>
      </section>

      {/* ═══ 2. CE QUE VOUS OBTENEZ — Feature sections ═══ */}
      <section style={{ padding: '72px 24px 64px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>{p('included.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 30px)', color: '#1A1916', letterSpacing: -0.8, textAlign: 'center', marginBottom: 48, lineHeight: 1.2 }}>{p('included.title')}</h2>
          <div className="lp-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28 }}>
            {p('included.features').map((feature, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {featureIcons[i]}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 6, lineHeight: 1.3 }}>{feature.title}</div>
                  <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.65 }}>{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. POUR QUI + IDÉAL POUR — cards animées ═══ */}
      <section style={{ padding: '56px 24px', background: '#fff' }}>
        <div ref={targetRef} style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 40 }}>
            {locale === 'en' ? 'WHO IS THIS AUDIT FOR' : 'À QUI S\'ADRESSE CET AUDIT'}
          </div>
          <div className="lp-target-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* Left — Profiles */}
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>
                {locale === 'en' ? 'YOUR PROFILE' : 'VOTRE PROFIL'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p('audience.items').map((item, i) => (
                  <div key={i} className="card-interactive" style={{
                    background: '#F7F5F2', border: '1px solid #E5E2DC', borderLeft: '3px solid #D97757',
                    borderRadius: '4px 10px 10px 4px', padding: '12px 16px',
                    fontFamily: 'system-ui', fontSize: 14, color: '#1A1916', fontWeight: 500,
                    opacity: targetVisible ? 1 : 0, transform: targetVisible ? 'translateY(0)' : 'translateY(10px)',
                    transition: `opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s, box-shadow 0.25s, border-color 0.25s`,
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {/* Right — Site types */}
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>
                {locale === 'en' ? 'YOU ANALYZE' : 'VOUS ANALYSEZ'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p('sites.items').map((item, i) => (
                  <div key={i} className="card-interactive" style={{
                    background: '#F7F5F2', border: '1px solid #E5E2DC', borderLeft: '3px solid #10A37F',
                    borderRadius: '4px 10px 10px 4px', padding: '12px 16px',
                    fontFamily: 'system-ui', fontSize: 14, color: '#1A1916', fontWeight: 500,
                    opacity: targetVisible ? 1 : 0, transform: targetVisible ? 'translateY(0)' : 'translateY(10px)',
                    transition: `opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05 + 0.2}s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05 + 0.2}s, box-shadow 0.25s, border-color 0.25s`,
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', fontStyle: 'italic', textAlign: 'center', marginTop: 28, lineHeight: 1.6 }}>{p('audience.closing')}</p>
        </div>
      </section>

      {/* ═══ 4. COMMENT ÇA MARCHE ═══ */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>{p('steps.label')}</div>
          <div className="lp-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {p('steps.items').map((step, i) => (
              <div key={i} className="card-interactive" style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(26,25,22,0.06)' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: stepColors[i], marginBottom: 14, letterSpacing: -1, lineHeight: 1 }}>{step.num}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 6, fontFamily: 'system-ui' }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui' }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. EXEMPLE RAPPORT ═══ */}
      <section style={{ padding: '0 24px 48px', textAlign: 'center' }}>
        <a href={locale === 'en' ? '/example-report.html' : '/exemple-rapport.html'} target="_blank" rel="noopener noreferrer"
          className="btn-interactive"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#D97757', fontFamily: 'system-ui', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(217,119,87,0.3)', padding: '10px 22px', borderRadius: 10, background: 'rgba(217,119,87,0.04)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          {p('hero.exampleLink')}
        </a>
      </section>

      {/* ═══ 6. FAQ ═══ */}
      <section style={{ padding: '0 24px 64px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>{p('faq.label')}</div>
          {p('faq.items').map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #E5E2DC', padding: '20px 0' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui' }}>{faq.q}</div>
              <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui' }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 7. CTA FINAL ═══ */}
      <section className="gradient-bg" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#F7F5F2', letterSpacing: -0.8, marginBottom: 12, lineHeight: 1.15 }}>{p('finalCta.title')}</h2>
          <p style={{ fontSize: 14, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', marginBottom: 28, lineHeight: 1.6 }}>{p('finalCta.subtitle')}</p>
          <div className="lp-final-input" style={{ maxWidth: 480, margin: '0 auto', display: 'flex', background: 'rgba(247,245,242,0.06)', border: '1px solid rgba(247,245,242,0.12)', borderRadius: 10, overflow: 'hidden' }}>
            <input value={ctaUrl} onChange={e => setCtaUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') setShowCheckout(true); }}
              placeholder={locale === 'en' ? 'https://your-site.com' : 'https://votre-site.fr'}
              style={{ flex: 1, border: 'none', outline: 'none', padding: '14px 18px', fontSize: 15, fontFamily: 'system-ui', color: '#F7F5F2', background: 'transparent', minWidth: 0 }} />
            <button onClick={() => setShowCheckout(true)} className="btn-interactive"
              style={{ background: '#D97757', color: '#fff', border: 'none', padding: '14px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {locale === 'en' ? 'Analyze →' : 'Analyser →'}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ 8. CROSS-SELL PRO ═══ */}
      <section style={{ padding: '48px 24px 64px' }}>
        <div className="card-interactive" style={{ maxWidth: 560, margin: '0 auto', background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '32px 28px', display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(217,119,87,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 6, fontWeight: 600 }}>{p('crossSell.title')}</div>
            <p style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 12 }}>{p('crossSell.desc')}</p>
            <Link href="/pro" className="btn-interactive" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#D97757', fontFamily: 'system-ui', fontWeight: 600, textDecoration: 'none', background: 'rgba(217,119,87,0.06)', padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(217,119,87,0.2)' }}>
              {p('crossSell.cta')}
            </Link>
          </div>
        </div>
      </section>

      <CheckoutFlow plan="rapport" showModal={showCheckout} onClose={() => setShowCheckout(false)} initialUrl={ctaUrl} />

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
