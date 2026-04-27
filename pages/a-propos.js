import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#1A1916"/>
      <path d="M8 22V10l8 6-8 6z" fill="#D97757"/>
      <path d="M16 22V10l8 6-8 6z" fill="#D97757" opacity="0.5"/>
    </svg>
  );
}

export default function APropos() {
  const { t, locale } = useTranslation();

  return (
    <>
      <SEO
        title={t('about.seo.title')}
        description={t('about.seo.description')}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: t('about.schema.name'),
          url: 'https://detekia.fr/a-propos',
          description: t('about.schema.description'),
          inLanguage: locale,
          publisher: {
            '@type': 'Organization',
            name: 'Detekia',
            legalName: 'Beeleven SASU',
            url: 'https://detekia.fr',
            email: 'hello@detekia.fr',
            founder: {
              '@type': 'Person',
              name: 'Guillaume Bourdon',
              jobTitle: locale === 'en' ? 'Founder' : 'Fondateur',
              sameAs: 'https://www.linkedin.com/in/gbourdon/',
            },
          },
        }}
      />

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
        <Header />
      <main>

        {/* ═══ HERO ═══ */}
        <section style={{ maxWidth: 680, margin: '0 auto', padding: '72px 24px 48px', textAlign: 'center' }}>
          <div className="reveal" style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            {t('about.hero.badge')}
          </div>
          <h1 className="reveal reveal-d1" style={{ fontSize: 'clamp(30px, 5vw, 44px)', lineHeight: 1.1, letterSpacing: -1.5, color: '#1A1916', marginBottom: 14 }}>
            {t('about.hero.title')}
          </h1>
          <p className="reveal reveal-d2" style={{ fontSize: 16, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui', maxWidth: 520, margin: '0 auto' }}>
            {t('about.hero.subtitle')}
          </p>
        </section>

        {/* ═══ POURQUOI DETEKIA ═══ */}
        <section style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px 48px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#1A1916', marginBottom: 18, lineHeight: 1.2, letterSpacing: -0.5 }}>
            {t('about.why.title')}
          </h2>
          <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#3A3835', lineHeight: 1.75, marginBottom: 14 }}>
            {t('about.why.p1')}
          </p>
          <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#3A3835', lineHeight: 1.75 }}>
            {t('about.why.p2')}
          </p>
        </section>

        {/* ═══ BEELEVEN ═══ */}
        <section style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px 56px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#1A1916', marginBottom: 18, lineHeight: 1.2, letterSpacing: -0.5 }}>
            {t('about.beeleven.title')}
          </h2>
          <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#3A3835', lineHeight: 1.75 }}>
            {t('about.beeleven.text')}
          </p>
        </section>

        {/* ═══ NOS PRINCIPES — 5 cards ═══ */}
        <section style={{ padding: '56px 24px 64px', background: '#fff' }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>
              {t('about.principles.label')}
            </div>
            <div className="about-principles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {t('about.principles.items').map((item, i) => (
                <div key={i} className="card-interactive" style={{
                  background: '#F7F5F2', border: '1px solid #E5E2DC', borderRadius: 14, padding: '22px 20px',
                  gridColumn: i >= 3 ? 'span 1' : undefined,
                }}>
                  <div style={{ fontFamily: 'system-ui', fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8 }}>
                    {item.title}
                  </div>
                  <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#8A8680', lineHeight: 1.6 }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ L'ÉQUIPE — discret ═══ */}
        <section style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            {t('about.team.label')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1A1916', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F7F5F2', fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
              GB
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'system-ui', fontSize: 15, fontWeight: 600, color: '#1A1916' }}>{t('about.team.name')}</span>
                <span style={{ fontFamily: 'system-ui', fontSize: 12, color: '#8A8680' }}>·</span>
                <span style={{ fontFamily: 'system-ui', fontSize: 13, color: '#8A8680' }}>{t('about.team.role')}</span>
              </div>
              <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#8A8680', marginTop: 3 }}>{t('about.team.bio')}</div>
            </div>
            <a href={t('about.team.linkedin')} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid #E5E2DC', color: '#8A8680', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0A66C2'; e.currentTarget.style.color = '#0A66C2'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E2DC'; e.currentTarget.style.color = '#8A8680'; }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </section>

        {/* ═══ CTA FINAL ═══ */}
        <section style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ background: '#1A1916', borderRadius: 14, padding: '36px 32px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F7F5F2', marginBottom: 10, lineHeight: 1.2 }}>
              {t('about.cta.title')}
            </h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 14, color: 'rgba(247,245,242,0.6)', marginBottom: 24, lineHeight: 1.6 }}>
              {t('about.cta.subtitle')}
            </p>
            <Link href="/methodologie" className="btn-interactive" style={{ display: 'inline-block', background: '#D97757', color: '#FFFFFF', borderRadius: 8, padding: '14px 32px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              {t('about.cta.button')}
            </Link>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
      </main>
        <footer style={{ borderTop: '1px solid #E5E2DC', padding: '40px 48px 32px', background: '#fff' }}>
          <div className="footer-inner" style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div style={{ minWidth: 160 }}>
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
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 767px) {
          .about-principles-grid { grid-template-columns: 1fr !important; }
          .footer-inner { flex-direction: column !important; gap: 24px !important; }
        }
        @media (min-width: 768px) {
          .about-principles-grid > div:nth-child(4),
          .about-principles-grid > div:nth-child(5) {
            grid-column: span 1;
          }
        }
      `}</style>
    </>
  );
}
