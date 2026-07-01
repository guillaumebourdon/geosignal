import Link from 'next/link';
import SEO from '../../components/SEO';
import Header from '../../components/Header';
import { useTranslation } from '../../lib/useTranslation';
import { getAllArticles, formatDate } from '../../lib/articles';

const CATEGORY_COLORS = {
  'GUIDE': '#10A37F',
  'TECHNIQUE': '#4285F4',
  'STRATÉGIE': '#D97757',
};

export default function BlogIndex() {
  const { t, locale } = useTranslation();
  const localizedArticles = getAllArticles(locale);

  return (
    <>
      <SEO
        title={t('blog.index.seo.title')}
        description={t('blog.index.seo.description')}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: locale === 'en' ? 'Detekia Blog — AI Visibility & GEO' : 'Blog Detekia — Visibilité IA & GEO',
          description: locale === 'en' ? 'Guides, strategies and analysis on AI visibility and Generative Engine Optimization.' : 'Guides, stratégies et analyses sur la visibilité IA et le GEO.',
          url: locale === 'en' ? 'https://detekia.fr/en/blog' : 'https://detekia.fr/blog',
          publisher: { '@type': 'Organization', name: 'Detekia', url: 'https://detekia.fr' },
          blogPost: localizedArticles.slice(0, 10).map(a => ({
            '@type': 'BlogPosting',
            headline: a.title,
            datePublished: a.date,
            url: `https://detekia.fr${locale === 'en' ? '/en' : ''}/blog/${a.slug}`,
          })),
        }}
      />

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        <Header />
      <main>

        {/* HEADER */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 24px 48px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{t('blog.index.sectionLabel')}</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#1A1916', letterSpacing: -1, marginBottom: 14, lineHeight: 1.1 }}>
            {t('blog.index.h1')}
          </h1>
          <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#6B6762', lineHeight: 1.65 }}>
            {t('blog.index.subtitle')}
          </p>
        </div>

        {/* ARTICLE GRID */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 100px' }}>
          <div className="blog-grid">
            {localizedArticles.slice().reverse().map(article => {
              const catColor = CATEGORY_COLORS[article.category] || '#6B6762';
              return (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="blog-card"
                  style={{ background: '#FFFFFF', border: '1px solid #E5E2DC', borderRadius: 14, padding: 28, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 12, transition: 'box-shadow 0.2s, transform 0.2s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: catColor, letterSpacing: 2, textTransform: 'uppercase', background: `${catColor}18`, border: `1px solid ${catColor}30`, borderRadius: 20, padding: '3px 10px' }}>
                      {article.category}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1916', lineHeight: 1.25, margin: 0, letterSpacing: -0.3 }}>
                    {article.title}
                  </h2>
                  <p className="blog-desc" style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6B6762', lineHeight: 1.6, margin: 0 }}>
                    {article.description}
                  </p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #F0EDE8' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#B0ABA5' }}>{formatDate(article.date, locale)}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#B0ABA5' }}>{article.readTime}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
      </main>
        <footer style={{ borderTop: '1px solid #E5E2DC', padding: '36px 48px', background: '#fff' }}>
          <div className="footer-inner" style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#1A1916' }}>{t('common.siteName')}</span>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {t('blog.footer.links').map((link) => (
                <Link key={link.href} href={link.href} style={{ fontFamily: 'system-ui', fontSize: 12, color: '#6B6762', textDecoration: 'none' }}>{link.label}</Link>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .blog-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .blog-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .blog-desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        @media (max-width: 640px) {
          nav { padding: 0 20px !important; }
          .blog-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
