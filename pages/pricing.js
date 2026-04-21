import { useState } from 'react';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from '../lib/useTranslation';

const Logo = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
    {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
      <div key={i} style={{ background: c, borderRadius: '50%' }} />
    ))}
  </div>
);

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'rapport', locale: router.locale }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      alert(t('pricing.errorAlert'));
    } finally {
      setLoading(false);
    }
  }

  const freeFeatures = t('pricing.free.features');
  const reportFeatures = t('pricing.report.features');
  const faqItems = t('pricing.faq.items');

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO
        title={t('pricing.seo.title')}
        description={t('pricing.seo.description')}
      />

      {/* NAV */}
      <nav className="detekia-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <Logo />{t('common.siteName')}
        </a>
        <div className="nav-links" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="/blog" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.blog')}</a>
          <a href="/pricing" className="nav-link-secondary" style={{ fontSize: 13, color: '#1A1916', fontWeight: 600, textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.pricing')}</a>
          <a href="/methodologie" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.methodology')}</a>
          <a href="/a-propos" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.about')}</a>
          <a href="/contact" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.contact')}</a>
          <LanguageSwitcher />
          <a href="/" className="nav-cta" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.ctaAnalyze')}</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(30px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 14, color: '#1A1916' }}>
          {t('pricing.hero.title')}
        </h1>
        <p style={{ fontSize: 15, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 52 }}>
          {t('pricing.hero.subtitle')}
        </p>
      </div>

      {/* PLANS — 2 colonnes */}
      <div className="pricing-cards" style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 80 }}>

        {/* FREE */}
        <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '28px 24px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{t('pricing.free.label')}</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#1A1916', letterSpacing: -1, marginBottom: 4 }}>{t('pricing.free.price')}</div>
          <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', marginBottom: 24, lineHeight: 1.4 }}>{t('pricing.free.subtitle')}</div>
          <a href="/" style={{ display: 'block', textAlign: 'center', background: '#F0EDE8', color: '#1A1916', padding: '11px 0', borderRadius: 9, fontWeight: 600, fontSize: 13, textDecoration: 'none', fontFamily: 'system-ui', marginBottom: 24 }}>
            {t('pricing.free.cta')}
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {freeFeatures.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: feat.included ? '#10A37F' : '#D0CBC5', flexShrink: 0 }}>{feat.included ? '✓' : '✗'}</span>
                <span style={{ fontSize: 12, color: feat.included ? '#3A3835' : '#C2BDB8', fontFamily: 'system-ui' }}>{feat.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RAPPORT — featured */}
        <div style={{ background: '#1A1916', borderRadius: 16, padding: '28px 24px', position: 'relative', boxShadow: '0 16px 48px rgba(26,25,22,0.2)' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.45)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{t('pricing.report.label')}</div>

          <div style={{ marginBottom: 4 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#F7F5F2', letterSpacing: -1 }}>{t('pricing.report.price')}</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', marginBottom: 20 }}>
            {t('pricing.report.paymentInfo')}
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{ display: 'block', width: '100%', textAlign: 'center', background: '#D97757', color: '#fff', padding: '13px 0', borderRadius: 9, fontWeight: 700, fontSize: 14, border: 'none', cursor: loading ? 'wait' : 'pointer', fontFamily: 'system-ui', marginBottom: 24, opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
            {loading ? t('pricing.report.ctaLoading') : t('pricing.report.cta')}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {reportFeatures.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#10A37F', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 12, color: 'rgba(247,245,242,0.75)', fontFamily: 'system-ui' }}>{feat.text}</span>
              </div>
            ))}
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

      {/* FAQ */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>{t('pricing.faq.label')}</div>
        {faqItems.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid #E5E2DC', padding: '20px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui' }}>{faq.q}</div>
            <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui' }}>{faq.a}</div>
          </div>
        ))}
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 600px) {
          .pricing-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
