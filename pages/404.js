import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';


export default function Custom404() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('notFound.seo.title')} description="" />
      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        <Header />

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
