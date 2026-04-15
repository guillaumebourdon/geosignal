import Head from 'next/head';

const Logo = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
    {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => <div key={i} style={{ background: c, borderRadius: '50%' }} />)}
  </div>
);

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 — Page introuvable | Detekia</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        {/* ── NAV ─────────────────────────────────────────────── */}
        <nav className="detekia-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 58, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
            <Logo />Detekia
          </a>
          <div className="nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <a href="/blog" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Blog</a>
            <a href="/pricing" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Tarifs</a>
            <a href="/methodologie" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Méthodologie</a>
            <a href="/a-propos" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>À propos</a>
            <a href="/contact" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Contact</a>
            <a href="/" className="nav-cta" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontFamily: 'system-ui' }}>Analyser gratuitement</a>
          </div>
        </nav>

        {/* ── CONTENU 404 ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 58px)', padding: '48px 24px', textAlign: 'center' }}>

          <div style={{ fontSize: 160, fontWeight: 700, fontFamily: 'Georgia, serif', color: '#D97757', lineHeight: 1, letterSpacing: -6, marginBottom: 16 }}>
            404
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 600, fontFamily: 'Georgia, serif', color: '#1A1916', margin: '0 0 12px' }}>
            Cette page n&apos;existe pas
          </h1>

          <p style={{ fontSize: 15, fontFamily: 'system-ui', color: '#8A8680', margin: '0 0 40px', lineHeight: 1.6 }}>
            Vous cherchez quelque chose ? Cette page a dû se perdre en chemin.
          </p>

          <a href="/" style={{ display: 'inline-block', background: '#D97757', color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: 'system-ui', padding: '14px 36px', borderRadius: 10, textDecoration: 'none', marginBottom: 16 }}>
            Retour à l&apos;accueil →
          </a>

          <a href="/" style={{ fontSize: 13, fontFamily: 'system-ui', color: '#8A8680', textDecoration: 'none' }}>
            Ou analysez votre site →
          </a>
        </div>
      </div>
    </>
  );
}
