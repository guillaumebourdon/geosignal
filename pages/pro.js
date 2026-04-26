import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

/* ─── Animated hero mockup — Pro version (richer) ────────── */
function HeroMockup({ locale }) {
  const score = useAnimatedCounter(58);
  const pagesCount = useAnimatedCounter(20, 800, 1200);
  const [barsVisible, setBarsVisible] = useState(false);
  const [badgesVisible, setBadgesVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setBarsVisible(true), 1000);
    const t2 = setTimeout(() => setBadgesVisible(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const criteria = [
    { label: locale === 'en' ? 'Structured data' : 'Données structurées', pct: 72, color: '#10A37F' },
    { label: locale === 'en' ? 'Authority signals' : 'Signaux d\'autorité', pct: 45, color: '#D97757' },
    { label: locale === 'en' ? 'Content depth' : 'Profondeur contenu', pct: 38, color: '#D97757' },
    { label: locale === 'en' ? 'Technical SEO' : 'SEO technique', pct: 81, color: '#10A37F' },
    { label: locale === 'en' ? 'Freshness' : 'Fraîcheur', pct: 56, color: '#D97757' },
  ];

  const patterns = [
    { text: locale === 'en' ? 'Missing FAQ on 14 pages' : 'FAQ absente sur 14 pages', color: '#D97757' },
    { text: locale === 'en' ? 'No dateModified' : 'Pas de dateModified', color: '#D97757' },
    { text: locale === 'en' ? 'Schema.org detected' : 'Schema.org détecté', color: '#10A37F' },
    { text: locale === 'en' ? '3 critical actions' : '3 actions critiques', color: '#D97757' },
  ];

  return (
    <div className="lp-mockup" style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 32px 80px rgba(26,25,22,0.15)', overflow: 'hidden', maxWidth: 380, width: '100%', border: '1px solid rgba(26,25,22,0.06)' }}>
      {/* Chrome bar */}
      <div style={{ background: '#F0EDE8', borderBottom: '1px solid #E5E2DC', padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#F87171','#FBBF24','#34D399'].map(c => <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#B0ABA5', letterSpacing: 0.5, marginLeft: 4 }}>detekia.fr/r/...</div>
      </div>

      {/* Score block — Pro shows pages count */}
      <div style={{ background: '#1A1916', padding: '24px 22px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: 10, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,163,127,0.10) 0%, transparent 70%)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(247,245,242,0.25)', letterSpacing: 2, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 4 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D97757' }} /> {locale === 'en' ? 'COMPLETE AUDIT' : 'AUDIT COMPLET'}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.35)', letterSpacing: 1 }}>
            {pagesCount} {locale === 'en' ? 'pages' : 'pages'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, position: 'relative' }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 64, color: '#F7F5F2', lineHeight: 1, letterSpacing: -3 }}>{score}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.2)', letterSpacing: 1 }}>/100 {locale === 'en' ? 'avg' : 'moy.'}</div>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <div style={{ display: 'inline-block', background: '#D97757', borderRadius: 16, padding: '3px 10px', fontFamily: 'monospace', fontSize: 7, color: '#fff', letterSpacing: 1.5, fontWeight: 700 }}>{locale === 'en' ? 'NEEDS WORK' : 'À AMÉLIORER'}</div>
          </div>
        </div>
      </div>

      {/* Criterion bars — 5 for pro */}
      <div style={{ padding: '14px 18px 10px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 7, color: '#B0ABA5', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
          {locale === 'en' ? '8 CRITERIA × 20 PAGES' : '8 CRITÈRES × 20 PAGES'}
        </div>
        {criteria.map((c, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: 9, color: '#3A3835', fontFamily: 'system-ui' }}>{c.label}</span>
              <span style={{ fontSize: 8, color: '#8A8680', fontFamily: 'monospace' }}>{barsVisible ? c.pct : 0}%</span>
            </div>
            <div style={{ height: 3, background: '#F0EDE8', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, background: c.color, width: barsVisible ? `${c.pct}%` : '0%', transition: `width 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Cascading pattern badges */}
      <div style={{ padding: '4px 18px 14px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {patterns.map((b, i) => (
          <span key={i} style={{
            fontSize: 8, fontFamily: 'monospace', letterSpacing: 0.3, padding: '3px 8px', borderRadius: 8,
            background: b.color === '#10A37F' ? 'rgba(16,163,127,0.08)' : 'rgba(217,119,87,0.08)',
            color: b.color, fontWeight: 600,
            opacity: badgesVisible ? 1 : 0, transform: badgesVisible ? 'translateY(0)' : 'translateY(6px)',
            transition: `all 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s`
          }}>{b.text}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Audience icons ─────────────────────────────────────── */
const audienceIcons = ['⚡', '◆', '✦', '●', '▲', '◇', '✎'];

export default function Pro() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [ctaUrl, setCtaUrl] = useState('');

  const p = (key) => t(`pro.${key}`);

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO title={p('seo.title')} description={p('seo.description')} schema={{
        "@context": "https://schema.org", "@type": "Product", "name": "Detekia — Audit GEO complet",
        "offers": { "@type": "Offer", "price": "99", "priceCurrency": "EUR", "url": "https://detekia.fr/pro" }
      }} />
      <Header ctaLabel={t('nav.ctaAnalyze')} />

      {/* ═══ HERO — gradient + animated mockup ═══ */}
      <section className="gradient-bg lp-hero-section" style={{ padding: '80px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        {/* Radial glows */}
        <div style={{ position: 'absolute', top: '15%', right: '8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,163,127,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="lp-hero-grid" style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="reveal" style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.25)', padding: '5px 14px', borderRadius: 20, marginBottom: 24, background: 'rgba(217,119,87,0.08)' }}>
              {p('hero.badge')}
            </div>
            <h1 className="reveal reveal-d1" style={{ fontSize: 'clamp(34px, 5vw, 50px)', lineHeight: 1.06, letterSpacing: -1.5, color: '#F7F5F2', marginBottom: 16 }}>{p('hero.title')}</h1>
            <p className="reveal reveal-d2" style={{ fontSize: 16, color: 'rgba(247,245,242,0.6)', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 32, maxWidth: 480 }}>{p('hero.subtitle')}</p>
            <button onClick={() => setShowCheckout(true)} className="reveal reveal-d3 btn-interactive" style={{ background: '#D97757', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui', marginBottom: 10 }}>
              {p('hero.cta')}
            </button>
            <div className="reveal reveal-d4" style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.25)', letterSpacing: 1.5, marginTop: 8 }}>
              {locale === 'en' ? '20 PAGES • 15-20 MIN • NO SUBSCRIPTION' : '20 PAGES • 15-20 MIN • SANS ABONNEMENT'}
            </div>
          </div>
          <div className="lp-hero-mockup reveal reveal-d2" style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroMockup locale={locale} />
          </div>
        </div>
      </section>

      {/* ═══ POUR QUI — visual cards ═══ */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>{p('audience.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#1A1916', marginBottom: 28, letterSpacing: -0.5, textAlign: 'center' }}>{p('audience.title')}</h2>
          <div className="lp-audience-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {p('audience.items').map((item, i) => (
              <div key={i} className="card-interactive" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 8, opacity: 0.5 }}>{audienceIcons[i % audienceIcons.length]}</div>
                <div style={{ fontSize: 13, color: '#1A1916', fontFamily: 'system-ui', fontWeight: 500, lineHeight: 1.3 }}>{item}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', fontStyle: 'italic', textAlign: 'center', marginTop: 16 }}>{p('audience.closing')}</p>
        </div>
      </section>

      {/* ═══ IDÉAL POUR ═══ */}
      <section style={{ padding: '0 24px 64px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{p('sites.label')}</div>
          <div className="lp-sites-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {p('sites.items').map((item, i) => (
              <div key={i} className="card-interactive" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: stepColors[i % 3], flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#1A1916', fontFamily: 'system-ui' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CE QUE VOUS OBTENEZ — dark section ═══ */}
      <section className="gradient-bg" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{p('included.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#F7F5F2', letterSpacing: -0.5, marginBottom: 28, lineHeight: 1.2 }}>{p('included.title')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {p('included.items').map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#10A37F', fontSize: 14, flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 14, color: 'rgba(247,245,242,0.75)', fontFamily: 'system-ui', lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMMENT ÇA MARCHE — HP-aligned step cards ═══ */}
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

      {/* ═══ MÉTHODOLOGIE ═══ */}
      <section style={{ padding: '0 24px 48px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 14, padding: '24px 28px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,163,127,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{p('methodology.label')}</div>
              <div style={{ fontSize: 13, color: '#3A3835', fontFamily: 'system-ui', lineHeight: 1.65 }}>{p('methodology.text')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EXEMPLE RAPPORT ═══ */}
      <section style={{ padding: '0 24px 48px', textAlign: 'center' }}>
        <a href={locale === 'en' ? '/example-report.html' : '/exemple-rapport.html'} target="_blank" rel="noopener noreferrer"
          className="btn-interactive"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#D97757', fontFamily: 'system-ui', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(217,119,87,0.3)', padding: '10px 22px', borderRadius: 10, background: 'rgba(217,119,87,0.04)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          {p('hero.exampleLink')}
        </a>
      </section>

      {/* ═══ FAQ ═══ */}
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

      {/* ═══ CTA FINAL ═══ */}
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
              {locale === 'en' ? 'Audit →' : 'Auditer →'}
            </button>
          </div>
        </div>
      </section>

      <CheckoutFlow plan="pro" showModal={showCheckout} onClose={() => setShowCheckout(false)} />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(247,245,242,0.3); }
        @media (max-width: 767px) {
          .lp-hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; text-align: center; }
          .lp-hero-mockup { justify-content: center !important; }
          .lp-hero-mockup > div { max-width: 310px !important; }
          .lp-hero-grid h1 { font-size: clamp(30px, 8vw, 40px) !important; }
          .lp-hero-grid p { margin: 0 auto 32px !important; }
          .lp-audience-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .lp-sites-grid { grid-template-columns: 1fr !important; }
          .lp-steps-grid { grid-template-columns: 1fr !important; }
          .lp-final-input { flex-direction: column !important; }
          .lp-final-input input { border-radius: 10px 10px 0 0 !important; }
          .lp-final-input button { border-radius: 0 0 10px 10px !important; width: 100% !important; justify-content: center; }
          .lp-hero-section { padding: 60px 16px 48px !important; }
        }
        @media (max-width: 480px) {
          .lp-audience-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
