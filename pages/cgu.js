import Link from 'next/link';
import Head from 'next/head';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';

const Logo = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
    {['#10A37F', '#D97757', '#4285F4', '#1C7DC4'].map((c, i) => (
      <div key={i} style={{ background: c, borderRadius: '50%' }} />
    ))}
  </div>
);

const pStyle = { fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75, marginBottom: 12 };

export default function CGU() {
  const { t } = useTranslation();
  const sections = t('terms.sections');
  const disclaimer = t('terms.disclaimer');

  return (
    <>
      <SEO title={t('terms.seo.title')} description={t('terms.seo.description')} />
      <Head><meta name="robots" content="noindex, follow" /></Head>

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        <Header />

        {/* CONTENT */}
        <div className="legal-content" style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 100px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, letterSpacing: -1, color: '#1A1916', marginBottom: 12, lineHeight: 1.1 }}>{t('terms.title')}</h1>
          <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#B0ABA5', marginBottom: 48 }}>{t('terms.lastUpdate')}</p>

          {disclaimer && (
            <div style={{ background: 'rgba(66,133,244,0.08)', border: '1px solid rgba(66,133,244,0.25)', borderRadius: 12, padding: '16px 20px', marginBottom: 48 }}>
              <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#3A3835', lineHeight: 1.65, margin: 0 }} dangerouslySetInnerHTML={{ __html: disclaimer }} />
            </div>
          )}

          {sections.map((sec, i) => (
            <section key={i} style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 16, lineHeight: 1.2 }}>{sec.title}</h2>
              {sec.paragraphs.map((p, j) => (
                <p key={j} style={pStyle} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </section>
          ))}
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #E5E2DC', padding: '36px 48px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 5 }}>
                <Logo />{t('common.siteName')}
              </div>
              <div style={{ fontSize: 11, color: '#C2BDB8', fontFamily: 'system-ui' }}>{t('terms.footer.copyright')}</div>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              {t('terms.footer.links').map((link) => (
                <Link key={link.href} href={link.href} style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{link.label}</Link>
              ))}
            </div>
          </div>
        </footer>

        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      </div>
    </>
  );
}
