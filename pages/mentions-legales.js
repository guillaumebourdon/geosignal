import Head from 'next/head';

function Logo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
      {['#10A37F', '#D97757', '#4285F4', '#1C7DC4'].map((c, i) => (
        <div key={i} style={{ background: c, borderRadius: '50%' }} />
      ))}
    </div>
  );
}

export default function MentionsLegales() {
  return (
    <>
      <Head>
        <title>Mentions légales | Detekia</title>
        <meta name="description" content="Mentions légales de Detekia — éditeur, hébergeur, propriété intellectuelle." />
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        {/* NAV */}
        <nav className="detekia-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
            <Logo />Detekia
          </a>
          <div className="nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <a href="/blog" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Blog</a>
            <a href="/pricing" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Tarifs</a>
            <a href="/methodologie" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Méthodologie</a>
            <a href="/contact" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Contact</a>
            <a href="/" className="nav-cta" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontFamily: 'system-ui' }}>Analyser gratuitement</a>
          </div>
        </nav>

        {/* CONTENT */}
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 100px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, letterSpacing: -1, color: '#1A1916', marginBottom: 48, lineHeight: 1.1 }}>Mentions légales</h1>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 16, lineHeight: 1.2 }}>Éditeur du site</h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75, marginBottom: 12 }}>
              Le site detekia.fr est édité par <strong>Beeleven SASU</strong>, société par actions simplifiée unipersonnelle au capital de 1 000 €, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro <strong>102 307 345</strong>.
            </p>
            <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75, marginBottom: 12 }}>
              Siège social : 7 rue Curial, 75019 Paris, France.
            </p>
            <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75, marginBottom: 12 }}>
              Directeur de la publication : Guillaume Bourdon.
            </p>
            <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75 }}>
              Email : <a href="mailto:hello@detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>hello@detekia.fr</a>
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 16, lineHeight: 1.2 }}>Hébergeur</h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75, marginBottom: 12 }}>
              Le site detekia.fr est hébergé par <strong>Vercel Inc.</strong>, situé au 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
            </p>
            <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75 }}>
              Site web : <a href="https://vercel.com" style={{ color: '#D97757', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">vercel.com</a>
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 16, lineHeight: 1.2 }}>Propriété intellectuelle</h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75 }}>
              L'ensemble du contenu du site detekia.fr (textes, images, graphismes, logo, icônes, structure) est la propriété exclusive de Beeleven SASU ou fait l'objet d'une autorisation d'utilisation. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de Beeleven SASU.
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 16, lineHeight: 1.2 }}>Responsabilité</h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75, marginBottom: 12 }}>
              Les informations fournies par Detekia, notamment les scores GEO et les recommandations, sont données à titre indicatif et ne constituent en aucun cas un conseil professionnel. Beeleven SASU ne saurait être tenue responsable des décisions prises sur la base des résultats d'analyse fournis par le site.
            </p>
            <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75 }}>
              Detekia s'efforce de fournir des informations aussi précises que possible. Toutefois, Beeleven SASU ne pourra être tenue responsable des omissions, des inexactitudes ou des carences dans la mise à jour des informations.
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 16, lineHeight: 1.2 }}>Crédits</h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75 }}>
              Conception et développement : Beeleven SASU.<br />
              Typographies : Georgia, system-ui, DM Mono (Google Fonts).
            </p>
          </section>
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #E5E2DC', padding: '36px 48px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 5 }}>
                <Logo />Detekia
              </div>
              <div style={{ fontSize: 11, color: '#C2BDB8', fontFamily: 'system-ui' }}>© 2026 Detekia — Beeleven SASU</div>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              {[['Blog','/blog'],['Tarifs','/pricing'],['Méthodologie','/methodologie'],['Contact','/contact'],['Mentions légales','/mentions-legales'],['Confidentialité','/confidentialite'],['CGU','/cgu']].map(([label, href]) => (
                <a key={label} href={href} style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{label}</a>
              ))}
            </div>
          </div>
        </footer>

        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      </div>
    </>
  );
}
