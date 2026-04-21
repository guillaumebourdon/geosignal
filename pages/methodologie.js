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

const stepColors = ['#10A37F', '#D97757', '#4285F4'];

export default function Methodologie() {
  const { t, locale } = useTranslation();
  const criteria = t('methodology.criteria.items');

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO
        title={t('methodology.seo.title')}
        description={t('methodology.seo.description')}
      />

      {/* NAV */}
      <nav className="detekia-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <Logo />{t('common.siteName')}
        </a>
        <div className="nav-links" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="/blog" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.blog')}</a>
          <a href="/pricing" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.pricing')}</a>
          <a href="/methodologie" className="nav-link-secondary" style={{ fontSize: 13, color: '#1A1916', fontWeight: 600, textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.methodology')}</a>
          <a href="/a-propos" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.about')}</a>
          <a href="/contact" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.contact')}</a>
          <LanguageSwitcher />
          <a href="/" className="nav-cta" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.ctaAnalyze')}</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.3)', padding: '5px 14px', borderRadius: 20, marginBottom: 24, background: 'rgba(217,119,87,0.06)' }}>
          {t('methodology.hero.badge')}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 16, color: '#1A1916' }}>
          {t('methodology.hero.titleLine1')}<br /><em style={{ color: '#D97757' }}>{t('methodology.hero.titleEm')}</em>
        </h1>
        <p style={{ fontSize: 15, color: '#8A8680', lineHeight: 1.7, fontFamily: 'system-ui', marginBottom: 64, maxWidth: 560, margin: '0 auto 64px' }}>
          {t('methodology.hero.subtitle')}
        </p>
        <p style={{ textAlign: 'center', marginTop: 24, marginBottom: 0, fontFamily: 'system-ui', fontSize: 14 }}>
          <a href="/" style={{ color: '#D97757', textDecoration: 'none' }}>{t('methodology.hero.ctaLink')}</a>
        </p>
      </div>

      {/* COMMENT ÇA MARCHE */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>{t('methodology.process.label')}</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
          {t('methodology.process.title')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {t('methodology.process.steps').map((step, idx) => (
            <div key={step.num} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: stepColors[idx], marginBottom: 16, letterSpacing: -1 }}>{step.num}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui' }}>{step.title}</div>
              <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui' }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SCORE */}
      <div style={{ background: '#1A1916', padding: '60px 24px', marginBottom: 80 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{t('methodology.score.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#F7F5F2', letterSpacing: -1, marginBottom: 16 }}>
            {t('methodology.score.title')}
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 40, maxWidth: 540, margin: '0 auto 40px' }}>
            {t('methodology.score.subtitle')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, textAlign: 'center' }}>
            {t('methodology.score.items').map((item) => (
              <div key={item.name} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 8px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#D97757', letterSpacing: -1 }}>{item.pts}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.35)', marginBottom: 2 }}>{t('methodology.score.ptsLabel')}</div>
                <div style={{ fontSize: 11, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.4 }}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8 CRITÈRES DÉTAILLÉS */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>{t('methodology.criteria.label')}</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
          {t('methodology.criteria.titleStart')}<em style={{ color: '#D97757' }}>{t('methodology.criteria.titleEm')}</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {criteria.map((c, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui' }}>{c.name}</div>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: c.color, background: c.color + '14', border: `1px solid ${c.color}30`, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>
                  {c.weight}
                </div>
              </div>
              <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{t('methodology.criteria.whatLabel')}</div>
                  <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.65, fontFamily: 'system-ui' }}>{c.what}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{t('methodology.criteria.goodLabel')}</div>
                  <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.65, fontFamily: 'system-ui' }}>{c.good}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{t('methodology.criteria.badLabel')}</div>
                  <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.65, fontFamily: 'system-ui' }}>{c.bad}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIMITES */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 16, padding: '32px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{t('methodology.limits.label')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {t('methodology.limits.items').map((item) => (
              <div key={item.title}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SOURCES */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>{t('methodology.sources.label')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {t('methodology.sources.items').map((source, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', marginTop: 2, flexShrink: 0 }}>→</span>
              <span style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.6 }}>{source}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#1A1916', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#F7F5F2', letterSpacing: -1, marginBottom: 12, lineHeight: 1.1 }}>
            {t('methodology.cta.titleLine1')}<br /><em style={{ color: '#D97757' }}>{t('methodology.cta.titleEm')}</em>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', marginBottom: 28, lineHeight: 1.6 }}>
            {t('methodology.cta.subtitle')}
          </p>
          <a href="/" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: 'system-ui' }}>
            {t('methodology.cta.button')}
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #E5E2DC', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <Logo />{t('common.siteName')}
          <span style={{ fontSize: 11, fontWeight: 400, color: '#C2BDB8', fontFamily: 'system-ui', marginLeft: 8 }}>{t('methodology.footer.byLine')}</span>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {t('methodology.footer.links').map((link) => (
            <a key={link.href} href={link.href} style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{link.label}</a>
          ))}
        </div>
      </footer>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}
