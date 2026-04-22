import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';


function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#1A1916', marginBottom: 18, lineHeight: 1.2, letterSpacing: -0.5 }}>{title}</h2>
      {children}
    </section>
  );
}

const pStyle = { fontFamily: 'system-ui', fontSize: 15, color: '#3A3835', lineHeight: 1.75, marginBottom: 14 };

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
            name: 'Beeleven SASU',
            founder: { '@type': 'Person', name: 'Guillaume Bourdon' },
            email: 'hello@detekia.fr',
          },
        }}
      />

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        <Header />

        {/* CONTENT */}
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 100px' }}>

          <nav aria-label="breadcrumb" style={{ fontFamily: 'system-ui', fontSize: 12, color: '#B0ABA5', marginBottom: 40, display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/" style={{ color: '#B0ABA5', textDecoration: 'none' }}>{t('about.breadcrumbHome')}</Link>
            <span>›</span>
            <span style={{ color: '#8A8680' }}>{t('about.breadcrumbCurrent')}</span>
          </nav>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: -1, color: '#1A1916', marginBottom: 56, lineHeight: 1.1 }}>{t('about.title')}</h1>

          <Section title={t('about.why.title')}>
            <p style={pStyle}>{t('about.why.p1')}</p>
            <p style={pStyle}>{t('about.why.p2')}</p>
          </Section>

          <Section title={t('about.how.title')}>
            <p style={pStyle}>{t('about.how.p1')}</p>
            <p style={pStyle}>{t('about.how.p2')}</p>
          </Section>

          <Section title={t('about.who.title')}>
            <p style={pStyle}>{t('about.who.p1')}</p>
            <p style={pStyle}>{t('about.who.p2')}</p>
            <p style={pStyle}>{t('about.who.p3')}</p>
            <p style={pStyle}>{t('about.who.p4')}</p>
            <p style={pStyle} dangerouslySetInnerHTML={{ __html: t('about.who.p5') }} />
          </Section>

          <Section title={t('about.methodologySection.title')}>
            <p style={pStyle}>{t('about.methodologySection.intro')}</p>
            <ul style={{ fontFamily: 'system-ui', fontSize: 15, color: '#3A3835', lineHeight: 1.8, paddingLeft: 20, marginBottom: 20 }}>
              {t('about.methodologySection.criteria').map(item => (
                <li key={item} style={{ marginBottom: 4 }}>{item}</li>
              ))}
            </ul>
            <p style={{ ...pStyle, fontSize: 13, color: '#8A8680', fontStyle: 'italic' }}>{t('about.methodologySection.source')}</p>
          </Section>

          {/* CTA */}
          <div style={{ background: '#1A1916', borderRadius: 14, padding: '36px 32px', textAlign: 'center', marginTop: 16 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F7F5F2', marginBottom: 10, lineHeight: 1.2 }}>{t('about.cta.title')}</h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 14, color: 'rgba(247,245,242,0.6)', marginBottom: 24, lineHeight: 1.6 }}>{t('about.cta.subtitle')}</p>
            <Link href="/" style={{ display: 'inline-block', background: '#D97757', color: '#FFFFFF', borderRadius: 8, padding: '14px 32px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              {t('about.cta.button')}
            </Link>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #E5E2DC', padding: '36px 48px', background: '#fff' }}>
          <div className="footer-inner" style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#1A1916' }}>{t('common.siteName')}</span>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {t('about.footer.links').map((link) => (
                <Link key={link.href} href={link.href} style={{ fontFamily: 'system-ui', fontSize: 12, color: '#8A8680', textDecoration: 'none' }}>{link.label}</Link>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </>
  );
}
