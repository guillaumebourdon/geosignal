import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';

export default function Pro() {
  const { t } = useTranslation();

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO title={t('pro.seo.title')} description={t('pro.seo.description')} />
      <Header />

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 24px 100px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Detekia Pro</div>

        <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.1, letterSpacing: -1, color: '#1A1916', marginBottom: 16 }}>
          {t('pro.hero.title')}
        </h1>

        <p style={{ fontSize: 15, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 40 }}>
          {t('pro.hero.subtitle')}
        </p>

        <div style={{ background: '#1A1916', borderRadius: 16, padding: '32px 28px', marginBottom: 32 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 48, color: '#F7F5F2', letterSpacing: -2, marginBottom: 4 }}>{t('pro.pricing.price')}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.4)', marginBottom: 20 }}>{t('pro.pricing.detail')}</div>

          <Link href="/pricing" className="btn-interactive" style={{
            display: 'inline-block', background: '#D97757', color: '#fff',
            padding: '14px 40px', borderRadius: 10, fontSize: 15, fontWeight: 700,
            textDecoration: 'none', fontFamily: 'system-ui',
          }}>
            Voir les offres →
          </Link>
        </div>

        <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.65 }}>
          {t('pro.finalCta.desc')}
        </p>
      </div>
    </div>
  );
}
