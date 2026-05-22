import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
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
  const router = useRouter();
  const [url, setUrl] = useState('');
  const criteria = t('methodology.criteria.items');

  function analyze() {
    if (!url) return;
    const cleanUrl = url.replace(/^https?:\/\//, '');
    router.push(`/results?url=${encodeURIComponent(cleanUrl)}`);
  }

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO
        title={t('methodology.seo.title')}
        description={t('methodology.seo.description')}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: t('methodology.seo.title'),
          description: t('methodology.seo.description'),
          author: { '@type': 'Organization', name: 'Detekia', url: 'https://detekia.fr' },
          publisher: { '@type': 'Organization', name: 'Detekia' },
          datePublished: '2026-03-14',
          dateModified: '2026-05-22',
          inLanguage: locale,
        }}
      />

      <Header ctaLabel={t('nav.ctaAnalyze')} />
      <main>

      {/* HERO */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.3)', padding: '5px 14px', borderRadius: 20, marginBottom: 24, background: 'rgba(217,119,87,0.06)' }}>
          {t('methodology.hero.badge')}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 16, color: '#1A1916' }}>
          {t('methodology.hero.titleLine1')}<br /><em style={{ color: '#D97757' }}>{t('methodology.hero.titleEm')}</em>
        </h1>
        <p style={{ fontSize: 15, color: '#6B6762', lineHeight: 1.7, fontFamily: 'system-ui', marginBottom: 64, maxWidth: 560, margin: '0 auto 64px' }}>
          {t('methodology.hero.subtitle')}
        </p>
      </div>

      {/* COMMENT ÇA MARCHE */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>{t('methodology.process.label')}</div>
        <h2 className="methodo-h2" style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
          {t('methodology.process.title')}
        </h2>
        <div className="methodo-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {t('methodology.process.steps').map((step, idx) => (
            <div key={step.num} className="card-interactive" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: stepColors[idx], marginBottom: 16, letterSpacing: -1 }}>{step.num}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui' }}>{step.title}</div>
              <div style={{ fontSize: 13, color: '#6B6762', lineHeight: 1.6, fontFamily: 'system-ui' }}>{step.desc}</div>
            </div>
          ))}
        </div>
        <div className="methodo-input-wrap" style={{ maxWidth: 520, margin: '32px auto 0', display: 'flex', background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
            placeholder={locale === 'en' ? 'https://www.your-site.com' : 'https://www.votre-site.fr'}
            style={{ flex: 1, border: 'none', outline: 'none', padding: '13px 20px', fontSize: 15, fontFamily: 'system-ui', color: '#1A1916', background: 'transparent', minWidth: 0 }}
          />
          <button
            onClick={analyze}
            className="btn-interactive"
            style={{ background: '#D97757', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: '0 10px 10px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {locale === 'en' ? 'Analyze →' : 'Analyser →'}
          </button>
        </div>
      </div>

      {/* COMPARATIF 3 OFFRES */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>{t('methodology.compare.label')}</div>
        <h2 className="methodo-h2" style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#1A1916', textAlign: 'center', letterSpacing: -0.8, marginBottom: 10, lineHeight: 1.15 }}>
          {t('methodology.compare.title')}
        </h2>
        <p style={{ fontSize: 14, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.6, textAlign: 'center', maxWidth: 540, margin: '0 auto 32px' }}>
          {t('methodology.compare.subtitle')}
        </p>
        <div className="methodo-compare-desktop" style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E2DC', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,25,22,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: '#1A1916' }}>
            {t('methodology.compare.headers').map((h, i) => (
              <div key={i} style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 10, color: i === 0 ? 'transparent' : 'rgba(247,245,242,0.6)', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, textAlign: i > 0 ? 'center' : 'left' }}>{h}</div>
            ))}
          </div>
          {t('methodology.compare.rows').map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i < t('methodology.compare.rows').length - 1 ? '1px solid #F0EDE8' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAF9' }}>
              {row.map((cell, j) => (
                <div key={j} style={{ padding: '12px 16px', fontSize: 13, fontFamily: 'system-ui', color: j === 0 ? '#1A1916' : '#3A3835', fontWeight: j === 0 ? 600 : 400, textAlign: j > 0 ? 'center' : 'left', display: 'flex', alignItems: 'center', justifyContent: j > 0 ? 'center' : 'flex-start' }}>
                  {cell === true ? <span style={{ color: '#10A37F', fontSize: 14, fontWeight: 700 }}>✓</span> : cell === false ? <span style={{ color: '#D0CBC5' }}>—</span> : cell}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="methodo-compare-mobile" style={{ display: 'none' }}>
          {[1, 2, 3].map(colIdx => {
            const headers = t('methodology.compare.headers');
            const rows = t('methodology.compare.rows');
            return (
              <div key={colIdx} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '20px 18px', marginBottom: 12 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>{headers[colIdx]}</div>
                {rows.map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < rows.length - 1 ? '1px solid #F0EDE8' : 'none' }}>
                    <span style={{ fontSize: 12, color: '#6B6762', fontFamily: 'system-ui' }}>{row[0]}</span>
                    <span style={{ fontSize: 12, color: '#1A1916', fontFamily: 'system-ui', fontWeight: 500 }}>
                      {row[colIdx] === true ? <span style={{ color: '#10A37F' }}>✓</span> : row[colIdx] === false ? <span style={{ color: '#D0CBC5' }}>—</span> : row[colIdx]}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/pricing" className="btn-interactive" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: 'system-ui' }}>
            {t('methodology.compare.cta')}
          </Link>
        </div>
      </div>

      {/* SCORE */}
      <div style={{ background: '#1A1916', padding: '60px 24px', marginBottom: 80 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{t('methodology.score.label')}</div>
          <h2 className="methodo-h2" style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#F7F5F2', letterSpacing: -1, marginBottom: 16 }}>
            {t('methodology.score.title')}
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 40, maxWidth: 540, margin: '0 auto 40px' }}>
            {t('methodology.score.subtitle')}
          </p>
          <div className="methodo-score-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, textAlign: 'center' }}>
            {t('methodology.score.items').map((item, idx) => (
              <div key={item.name} className="card-interactive" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 14px', minWidth: 120, flex: '1 1 120px', maxWidth: 160 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: idx === 0 ? '#D97757' : 'rgba(247,245,242,0.7)', letterSpacing: -1, lineHeight: 1 }}>{item.pts}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.3)', marginBottom: 4, marginTop: 2 }}>{t('methodology.score.ptsLabel')}</div>
                <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.55)', fontFamily: 'system-ui', lineHeight: 1.35, fontWeight: 500 }}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7 CRITÈRES DÉTAILLÉS */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>{t('methodology.criteria.label')}</div>
        <h2 className="methodo-h2" style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
          {t('methodology.criteria.titleStart')}<em style={{ color: '#D97757' }}>{t('methodology.criteria.titleEm')}</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {criteria.map((c, i) => (
            <div key={i} className="card-interactive" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#D97757', fontFamily: 'system-ui' }}>{c.name}</div>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: c.color, background: c.color + '14', border: `1px solid ${c.color}30`, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>
                  {c.weight}
                </div>
              </div>
              <div className="methodo-criteria-detail" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{t('methodology.criteria.whatLabel')}</div>
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

      {/* NORMALISATION + CAS RÉELS — small white info block */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 20px' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 3 }}>{locale === 'en' ? 'Score normalization' : 'Normalisation du score'}</div>
            <div style={{ fontSize: 12, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.6 }}>{t('methodology.scoring.normalizationNote')}</div>
          </div>
          <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 3 }}>{locale === 'en' ? 'Documented case studies' : 'Cas réels documentés'}</div>
            <div style={{ fontSize: 12, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.6 }}>
              {locale === 'en'
                ? 'Each report includes real-world case studies on the 3 weakest criteria (SEO Vendor, Ahrefs, Stackmatix, etc.) to illustrate concrete impact of optimizations.'
                : 'Chaque rapport inclut des cas réels documentés sur les 3 critères les plus faibles (SEO Vendor, Ahrefs, Stackmatix, etc.) pour illustrer l\'impact concret des optimisations.'}
            </div>
          </div>
        </div>
      </div>

      {/* LIMITES */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 16, padding: '32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase' }}>{t('methodology.limits.label')}</div>
          {t('methodology.limits.items').map((item) => (
            <div key={item.title}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SOURCES — discret, en bas */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontSize: 11, color: '#B0ABA5', fontFamily: 'system-ui', lineHeight: 1.7 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#C2BDB8' }}>{locale === 'en' ? 'Sources' : 'Sources'}</span>
          <span style={{ margin: '0 8px', color: '#E5E2DC' }}>—</span>
          Aggarwal et al., Princeton / Georgia Tech, KDD 2024
          <span style={{ margin: '0 6px', color: '#E5E2DC' }}>·</span>
          ALM Corp, 1.2M ChatGPT citations (2026)
          <span style={{ margin: '0 6px', color: '#E5E2DC' }}>·</span>
          AirOps State of AI Search (2026)
          <span style={{ margin: '0 6px', color: '#E5E2DC' }}>·</span>
          ConvertMate GEO Benchmark (2026)
          <span style={{ margin: '0 6px', color: '#E5E2DC' }}>·</span>
          Ahrefs Brand Radar & Schema Study (2026)
          <span style={{ margin: '0 6px', color: '#E5E2DC' }}>·</span>
          Conductor AEO/GEO Benchmarks (2026)
          <span style={{ margin: '0 6px', color: '#E5E2DC' }}>·</span>
          Yext 17.2M AI Citations (2026)
          <span style={{ margin: '0 6px', color: '#E5E2DC' }}>·</span>
          BrightEdge AI Search (Mai 2026)
          <span style={{ margin: '0 6px', color: '#E5E2DC' }}>·</span>
          Go Fish Digital GEO Case Study (2026)
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
          <Link href="/" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: 'system-ui' }}>
            {t('methodology.cta.button')}
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      </main>
      <footer style={{ borderTop: '1px solid #E5E2DC', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <Logo />{t('common.siteName')}
          <span style={{ fontSize: 11, fontWeight: 400, color: '#C2BDB8', fontFamily: 'system-ui', marginLeft: 8 }}>{t('methodology.footer.byLine')}</span>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {t('methodology.footer.links').map((link) => (
            <Link key={link.href} href={link.href} style={{ fontSize: 12, color: '#6B6762', textDecoration: 'none', fontFamily: 'system-ui' }}>{link.label}</Link>
          ))}
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #6B6762; }
        @media (max-width: 600px) {
          .methodo-input-wrap { flex-direction: column !important; border-radius: 10px !important; }
          .methodo-input-wrap input { border-radius: 10px 10px 0 0 !important; }
          .methodo-input-wrap button { border-radius: 0 0 10px 10px !important; width: 100% !important; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
