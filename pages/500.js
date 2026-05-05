import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';

export default function Custom500() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('serverError.seo.title')} description="" />
      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        <Header />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 58px)', padding: '48px 24px', textAlign: 'center' }}>
          <div className="error-code" style={{ fontSize: 160, fontWeight: 700, fontFamily: 'Georgia, serif', color: '#D97757', lineHeight: 1, letterSpacing: -6, marginBottom: 16 }}>
            {t('serverError.code')}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, fontFamily: 'Georgia, serif', color: '#1A1916', margin: '0 0 12px' }}>
            {t('serverError.title')}
          </h1>
          <p style={{ fontSize: 15, fontFamily: 'system-ui', color: '#6B6762', margin: '0 0 40px', lineHeight: 1.6 }}>
            {t('serverError.subtitle')}
          </p>
          <Link href="/" style={{ display: 'inline-block', background: '#D97757', color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: 'system-ui', padding: '14px 36px', borderRadius: 10, textDecoration: 'none', marginBottom: 16 }}>
            {t('serverError.cta')}
          </Link>
        </div>
      </div>
    </>
  );
}
