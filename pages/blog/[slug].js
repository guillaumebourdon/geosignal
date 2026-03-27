import Head from 'next/head';
import { articles, getArticleBySlug, getRelatedArticles, formatDate } from '../../lib/articles';

// Map of slug → content component. Add an entry here each time an article is written.
const CONTENT_MAP = {
  'geo-guide-complet-2026': require('../../content/articles/geo-guide-complet-2026').default,
  'pourquoi-chatgpt-ne-cite-pas-votre-site': require('../../content/articles/pourquoi-chatgpt-ne-cite-pas-votre-site').default,
  'seo-vs-geo-differences-2026': require('../../content/articles/seo-vs-geo-differences-2026').default,
  'score-geo-mesurer-visibilite-ia': require('../../content/articles/score-geo-mesurer-visibilite-ia').default,
};

const CATEGORY_COLORS = {
  'GUIDE': '#10A37F',
  'TECHNIQUE': '#4285F4',
  'STRATÉGIE': '#D97757',
};

function Logo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
      {['#10A37F', '#D97757', '#4285F4', '#1C7DC4'].map((c, i) => (
        <div key={i} style={{ background: c, borderRadius: '50%' }} />
      ))}
    </div>
  );
}

function ArticleContent({ slug }) {
  const Content = CONTENT_MAP[slug];
  if (Content) return <Content />;
  return (
    <div style={{ color: '#8A8680', fontFamily: 'system-ui', fontSize: 15, lineHeight: 1.75, padding: '48px 0', textAlign: 'center', border: '1px dashed #E5E2DC', borderRadius: 10 }}>
      Contenu de l'article à venir — <code style={{ fontFamily: 'monospace', fontSize: 13, background: 'rgba(229,226,220,0.5)', padding: '2px 6px', borderRadius: 4 }}>content/articles/{slug}.js</code>
    </div>
  );
}

export default function ArticlePage({ article, related }) {
  if (!article) return null;

  const catColor = CATEGORY_COLORS[article.category] || '#8A8680';
  const canonicalUrl = `https://www.detekia.fr/blog/${article.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Detekia',
      url: 'https://www.detekia.fr',
    },
    datePublished: article.date,
    dateModified: article.date,
    url: canonicalUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  return (
    <>
      <Head>
        <title>{article.title} | Detekia</title>
        <meta name="description" content={article.description} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        {/* NAV */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
            <Logo />Detekia
          </a>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <a href="/blog" style={{ fontSize: 13, color: '#1A1916', fontWeight: 600, textDecoration: 'none', fontFamily: 'system-ui' }}>Blog</a>
            <a href="/pricing" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Tarifs</a>
            <a href="/methodologie" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Méthodologie</a>
            <a href="/contact" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Contact</a>
            <a href="/" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontFamily: 'system-ui' }}>Analyser gratuitement</a>
          </div>
        </nav>

        {/* ARTICLE */}
        <article style={{ maxWidth: 740, margin: '0 auto', padding: '56px 24px 80px' }}>

          {/* BREADCRUMB */}
          <nav aria-label="breadcrumb" style={{ fontFamily: 'system-ui', fontSize: 12, color: '#B0ABA5', marginBottom: 32, display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="/" style={{ color: '#B0ABA5', textDecoration: 'none' }}>Accueil</a>
            <span>›</span>
            <a href="/blog" style={{ color: '#B0ABA5', textDecoration: 'none' }}>Blog</a>
            <span>›</span>
            <span style={{ color: '#8A8680' }}>{article.title}</span>
          </nav>

          {/* ARTICLE HEADER */}
          <header style={{ marginBottom: 40 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: catColor, letterSpacing: 2, textTransform: 'uppercase', background: `${catColor}18`, border: `1px solid ${catColor}30`, borderRadius: 20, padding: '3px 10px', display: 'inline-block', marginBottom: 20 }}>
              {article.category}
            </span>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#1A1916', letterSpacing: -1, lineHeight: 1.15, marginBottom: 20 }}>
              {article.title}
            </h1>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontFamily: 'monospace', fontSize: 11, color: '#B0ABA5', marginBottom: 28 }}>
              <span>{formatDate(article.date)}</span>
              <span>·</span>
              <span>{article.readTime} de lecture</span>
              <span>·</span>
              <span>{article.author}</span>
            </div>
            <div style={{ height: 1, background: '#E5E2DC' }} />
          </header>

          {/* ARTICLE BODY */}
          <div className="article-body">
            <ArticleContent slug={article.slug} />
          </div>

          {/* CTA */}
          <div style={{ background: '#1A1916', borderRadius: 14, padding: '40px 36px', textAlign: 'center', marginTop: 64 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#F7F5F2', marginBottom: 10, lineHeight: 1.2 }}>
              Testez votre score GEO gratuitement
            </h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 14, color: 'rgba(247,245,242,0.6)', marginBottom: 24, lineHeight: 1.6 }}>
              Analyse complète en 30 secondes, sans inscription
            </p>
            <a href="/" style={{ display: 'inline-block', background: '#D97757', color: '#FFFFFF', borderRadius: 8, padding: '14px 32px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Analyser mon site →
            </a>
          </div>

          {/* RELATED ARTICLES */}
          {related && related.length > 0 && (
            <div style={{ marginTop: 64 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Articles recommandés</div>
              <div className="related-grid">
                {related.map(rel => {
                  const rc = CATEGORY_COLORS[rel.category] || '#8A8680';
                  return (
                    <a
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="related-card"
                      style={{ background: '#FFFFFF', border: '1px solid #E5E2DC', borderRadius: 12, padding: '20px 22px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8, transition: 'box-shadow 0.2s' }}
                    >
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: rc, letterSpacing: 2, textTransform: 'uppercase' }}>{rel.category}</span>
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1A1916', lineHeight: 1.3 }}>{rel.title}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#B0ABA5', marginTop: 4 }}>{rel.readTime}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </article>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #E5E2DC', padding: '36px 48px', background: '#fff' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#1A1916' }}>Detekia</span>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[['Blog', '/blog'], ['Tarifs', '/pricing'], ['Méthodologie', '/methodologie'], ['Contact', '/contact'], ['Mentions légales', '/legal']].map(([label, href]) => (
                <a key={label} href={href} style={{ fontFamily: 'system-ui', fontSize: 12, color: '#8A8680', textDecoration: 'none' }}>{label}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .article-body h2 { font-family: Georgia, serif; font-size: 28px; color: #1A1916; margin-top: 48px; margin-bottom: 16px; letter-spacing: -0.5px; line-height: 1.2; }
        .article-body h3 { font-family: Georgia, serif; font-size: 20px; color: #1A1916; margin-top: 32px; margin-bottom: 12px; line-height: 1.3; }
        .article-body p { font-family: system-ui, sans-serif; font-size: 16px; color: #1A1916; line-height: 1.75; margin-bottom: 20px; }
        .article-body ul, .article-body ol { font-family: system-ui, sans-serif; font-size: 15px; line-height: 1.7; color: #1A1916; margin: 0 0 20px 0; padding-left: 20px; }
        .article-body li { margin-bottom: 6px; }
        .article-body ul li::marker { color: #D97757; }
        .article-body code { font-family: monospace; font-size: 14px; background: rgba(229,226,220,0.5); padding: 2px 6px; border-radius: 4px; }
        .article-body pre { font-family: monospace; font-size: 13px; background: #1A1916; color: #F7F5F2; border-radius: 10px; padding: 24px; overflow-x: auto; margin: 24px 0; }
        .article-body pre code { background: none; padding: 0; font-size: 13px; }
        .article-body blockquote { border-left: 3px solid #D97757; padding-left: 20px; margin: 24px 0; font-style: italic; font-family: Georgia, serif; color: #8A8680; }
        .article-body img { border-radius: 10px; border: 1px solid #E5E2DC; max-width: 100%; height: auto; }
        .article-body a { color: #D97757; text-decoration: none; }
        .article-body a:hover { text-decoration: underline; }
        .related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .related-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        @media (max-width: 640px) {
          nav { padding: 0 20px !important; }
          h1 { font-size: 28px !important; }
          .related-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: articles.map(a => ({ params: { slug: a.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return { notFound: true };
  const related = getRelatedArticles(params.slug, 3);
  return { props: { article, related } };
}
