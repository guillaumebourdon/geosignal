import Link from 'next/link';
import SEO from '../components/SEO';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from '../lib/useTranslation';

const Logo = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
    {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => <div key={i} style={{ background: c, borderRadius: '50%' }} />)}
  </div>
);

export default function Custom404() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('notFound.seo.title')} description="" />
      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        <nav className="detekia-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 58, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 58px)', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 160, fontWeight: 700, fontFamily: 'Georgia, serif', color: '#D97757', lineHeight: 1, letterSpacing: -6, marginBottom: 16 }}>
            {t('notFound.code')}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, fontFamily: 'Georgia, serif', color: '#1A1916', margin: '0 0 12px' }}>
            {t('notFound.title')}
          </h1>
          <p style={{ fontSize: 15, fontFamily: 'system-ui', color: '#8A8680', margin: '0 0 40px', lineHeight: 1.6 }}>
            {t('notFound.subtitle')}
          </p>
          <Link href="/" style={{ display: 'inline-block', background: '#D97757', color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: 'system-ui', padding: '14px 36px', borderRadius: 10, textDecoration: 'none', marginBottom: 16 }}>
            {t('notFound.cta')}
          </Link>
          <Link href="/" style={{ fontSize: 13, fontFamily: 'system-ui', color: '#8A8680', textDecoration: 'none' }}>
            {t('notFound.ctaSub')}
          </Link>
        </div>
      </div>
    </>
  );
}
