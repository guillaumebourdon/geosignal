import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import CheckoutFlow from '../components/CheckoutFlow';
import { useTranslation } from '../lib/useTranslation';

const stepColors = ['#10A37F', '#D97757', '#4285F4'];

export default function OnePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [ctaUrl, setCtaUrl] = useState('');

  const p = (key) => t(`onepage.${key}`);

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO title={p('seo.title')} description={p('seo.description')} schema={{
        "@context": "https://schema.org", "@type": "Product", "name": "Detekia — Audit GEO 1 page",
        "offers": { "@type": "Offer", "price": "29", "priceCurrency": "EUR", "url": "https://detekia.fr/one-page" }
      }} />
      <Header ctaLabel={t('nav.ctaAnalyze')} />

      {/* ═══ HERO ═══ */}
      <section style={{ padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.3)', padding: '5px 14px', borderRadius: 20, marginBottom: 24, background: 'rgba(217,119,87,0.06)' }}>
            {p('hero.badge')}
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.08, letterSpacing: -1.5, color: '#1A1916', marginBottom: 16 }}>{p('hero.title')}</h1>
          <p style={{ fontSize: 16, color: '#6B6762', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>{p('hero.subtitle')}</p>
          <button onClick={() => setShowCheckout(true)} className="btn-interactive" style={{ background: '#D97757', color: '#fff', border: 'none', padding: '15px 40px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui', marginBottom: 14 }}>
            {p('hero.cta')}
          </button>
          <div>
            <a href={locale === 'en' ? '/example-report.html' : '/exemple-rapport.html'} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui', borderBottom: '1px solid #E5E2DC', paddingBottom: 2 }}>
              {p('hero.exampleLink')}
            </a>
          </div>
        </div>
      </section>

      {/* ═══ POUR QUI ═══ */}
      <section style={{ padding: '0 24px 64px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{p('audience.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#1A1916', marginBottom: 20, letterSpacing: -0.5 }}>{p('audience.title')}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {p('audience.items').map((item, i) => (
              <span key={i} style={{ display: 'inline-block', padding: '7px 16px', borderRadius: 20, background: '#fff', border: '1px solid #E5E2DC', fontSize: 13, color: '#3A3835', fontFamily: 'system-ui' }}>{item}</span>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', fontStyle: 'italic' }}>{p('audience.closing')}</p>
        </div>
      </section>

      {/* ═══ TYPES DE SITES ═══ */}
      <section style={{ padding: '0 24px 64px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{p('sites.label')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }} className="onepage-sites-grid">
            {p('sites.items').map((item, i) => (
              <div key={i} className="card-interactive" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '16px 20px', fontSize: 14, color: '#1A1916', fontFamily: 'system-ui' }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CE QUE VOUS OBTENEZ ═══ */}
      <section style={{ background: '#1A1916', padding: '64px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{p('included.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#F7F5F2', letterSpacing: -0.5, marginBottom: 28, lineHeight: 1.2 }}>{p('included.title')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {p('included.items').map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#10A37F', fontSize: 13, flexShrink: 0, marginTop: 2 }}>✓</span>
                <span style={{ fontSize: 14, color: 'rgba(247,245,242,0.75)', fontFamily: 'system-ui', lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMMENT ÇA MARCHE ═══ */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>{p('steps.label')}</div>
          <div className="onepage-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 32 }}>
            {p('steps.items').map((step, i) => (
              <div key={i} className="card-interactive" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: stepColors[i], marginBottom: 14, letterSpacing: -1 }}>{step.num}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 6, fontFamily: 'system-ui' }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui' }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
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
      <section style={{ background: '#1A1916', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#F7F5F2', letterSpacing: -0.8, marginBottom: 12, lineHeight: 1.15 }}>{p('finalCta.title')}</h2>
          <p style={{ fontSize: 14, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', marginBottom: 28, lineHeight: 1.6 }}>{p('finalCta.subtitle')}</p>
          <div className="onepage-final-input" style={{ maxWidth: 480, margin: '0 auto', display: 'flex', background: 'rgba(247,245,242,0.06)', border: '1px solid rgba(247,245,242,0.12)', borderRadius: 10, overflow: 'hidden' }}>
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

      {/* ═══ CROSS-SELL PRO ═══ */}
      <section style={{ padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 16, color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 8 }}>{p('crossSell.title')}</div>
          <p style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 16 }}>{p('crossSell.desc')}</p>
          <Link href="/pro" style={{ fontSize: 13, color: '#D97757', fontFamily: 'system-ui', fontWeight: 600, textDecoration: 'none' }}>{p('crossSell.cta')}</Link>
        </div>
      </section>

      <CheckoutFlow plan="rapport" showModal={showCheckout} onClose={() => setShowCheckout(false)} />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(247,245,242,0.3); }
        @media (max-width: 600px) {
          .onepage-sites-grid { grid-template-columns: 1fr !important; }
          .onepage-steps-grid { grid-template-columns: 1fr !important; }
          .onepage-final-input { flex-direction: column !important; }
          .onepage-final-input input { border-radius: 10px 10px 0 0 !important; }
          .onepage-final-input button { border-radius: 0 0 10px 10px !important; width: 100% !important; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
