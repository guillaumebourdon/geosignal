import Link from 'next/link';
import SEO from '../components/SEO';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from '../lib/useTranslation';

const Logo = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
    {['#10A37F', '#D97757', '#4285F4', '#1C7DC4'].map((c, i) => (
      <div key={i} style={{ background: c, borderRadius: '50%' }} />
    ))}
  </div>
);

const pStyle = { fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75, marginBottom: 12 };

export default function MentionsLegales() {
  const { t } = useTranslation();
  const disclaimer = t('legalNotices.disclaimer');

  return (
    <>
      <SEO title={t('legalNotices.seo.title')} description={t('legalNotices.seo.description')} />

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        {/* NAV */}
        <nav className="detekia-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
            <Logo />{t('common.siteName')}
          </Link>
          <div className="nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <Link href="/blog" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.blog')}</Link>
            <Link href="/pricing" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.pricing')}</Link>
            <Link href="/methodologie" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.methodology')}</Link>
            <Link href="/a-propos" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.about')}</Link>
            <Link href="/contact" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.contact')}</Link>
            <LanguageSwitcher />
            <Link href="/" className="nav-cta" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.cta')}</Link>
          </div>
        </nav>

        {/* CONTENT */}
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 100px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, letterSpacing: -1, color: '#1A1916', marginBottom: 48, lineHeight: 1.1 }}>{t('legalNotices.title')}</h1>

          {disclaimer && (
            <div style={{ background: 'rgba(66,133,244,0.08)', border: '1px solid rgba(66,133,244,0.25)', borderRadius: 12, padding: '16px 20px', marginBottom: 48 }}>
              <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#3A3835', lineHeight: 1.65, margin: 0 }} dangerouslySetInnerHTML={{ __html: disclaimer }} />
            </div>
          )}

          {['editor', 'hosting', 'ip', 'liability', 'credits'].map((key) => {
            const section = t(`legalNotices.${key}`);
            return (
              <section key={key} style={{ marginBottom: 40 }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 16, lineHeight: 1.2 }}>{section.title}</h2>
                {Object.keys(section).filter(k => k.startsWith('p')).map((k) => (
                  <p key={k} style={pStyle} dangerouslySetInnerHTML={{ __html: section[k] }} />
                ))}
              </section>
            );
          })}
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #E5E2DC', padding: '36px 48px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 5 }}>
                <Logo />{t('common.siteName')}
              </div>
              <div style={{ fontSize: 11, color: '#C2BDB8', fontFamily: 'system-ui' }}>{t('legalNotices.footer.copyright')}</div>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              {t('legalNotices.footer.links').map((link) => (
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
