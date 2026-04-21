import Link from 'next/link';
import SEO from '../../components/SEO';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslation } from '../../lib/useTranslation';
import { articles, formatDate } from '../../lib/articles';

const CATEGORY_COLORS = {
  'GUIDE': '#10A37F',
  'TECHNIQUE': '#4285F4',
  'STRATÉGIE': '#D97757',
};

const Logo = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
    {['#10A37F', '#D97757', '#4285F4', '#1C7DC4'].map((c, i) => (
      <div key={i} style={{ background: c, borderRadius: '50%' }} />
    ))}
  </div>
);

export default function BlogIndex() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('blog.index.seo.title')}
        description={t('blog.index.seo.description')}
      />

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        {/* NAV */}
        <nav className="detekia-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
            <Logo />{t('common.siteName')}
          </Link>
          <div className="nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <Link href="/blog" style={{ fontSize: 13, color: '#1A1916', fontWeight: 600, textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.blog')}</Link>
            <Link href="/pricing" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.pricing')}</Link>
            <Link href="/methodologie" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.methodology')}</Link>
            <Link href="/a-propos" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.about')}</Link>
            <Link href="/contact" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.contact')}</Link>
            <LanguageSwitcher />
            <Link href="/" className="nav-cta" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontFamily: 'system-ui' }}>{t('nav.cta')}</Link>
          </div>
        </nav>

        {/* HEADER */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 24px 48px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{t('blog.index.sectionLabel')}</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#1A1916', letterSpacing: -1, marginBottom: 14, lineHeight: 1.1 }}>
            {t('blog.index.h1')}
          </h1>
          <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#8A8680', lineHeight: 1.65 }}>
            {t('blog.index.subtitle')}
          </p>
        </div>

        {/* ARTICLE GRID */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 100px' }}>
          <div className="blog-grid">
            {articles.slice().reverse().map(article => {
              const catColor = CATEGORY_COLORS[article.category] || '#8A8680';
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
                  <p className="blog-desc" style={{ fontFamily: 'system-ui', fontSize: 14, color: '#8A8680', lineHeight: 1.6, margin: 0 }}>
                    {article.description}
                  </p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #F0EDE8' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#B0ABA5' }}>{formatDate(article.date)}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#B0ABA5' }}>{article.readTime}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #E5E2DC', padding: '36px 48px', background: '#fff' }}>
          <div className="footer-inner" style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#1A1916' }}>{t('common.siteName')}</span>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {t('blog.footer.links').map((link) => (
                <Link key={link.href} href={link.href} style={{ fontFamily: 'system-ui', fontSize: 12, color: '#8A8680', textDecoration: 'none' }}>{link.label}</Link>
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
