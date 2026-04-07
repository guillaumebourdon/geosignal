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

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#1A1916', marginBottom: 18, lineHeight: 1.2, letterSpacing: -0.5 }}>{title}</h2>
      {children}
    </section>
  );
}

function P({ children }) {
  return <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#3A3835', lineHeight: 1.75, marginBottom: 14 }}>{children}</p>;
}

export default function APropos() {
  return (
    <>
      <Head>
        <title>À propos de Detekia — GEO, Beeleven SASU</title>
        <meta name="description" content="Detekia est un outil d'audit GEO développé par Beeleven SASU. Mesurez et améliorez la visibilité de votre site dans les réponses IA (ChatGPT, Gemini, Claude, Perplexity)." />
        <meta property="og:title" content="À propos de Detekia" />
        <meta property="og:description" content="Outil d'audit GEO développé par Beeleven SASU — fondé par Guillaume Bourdon." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://detekia.fr/a-propos" />
        <link rel="canonical" href="https://detekia.fr/a-propos" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'À propos de Detekia',
            url: 'https://detekia.fr/a-propos',
            description: "Detekia est un outil d'audit GEO développé par Beeleven SASU, fondée par Guillaume Bourdon.",
            publisher: {
              '@type': 'Organization',
              name: 'Beeleven SASU',
              founder: { '@type': 'Person', name: 'Guillaume Bourdon' },
              email: 'hello@detekia.fr',
            },
          })}}
        />
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
            <a href="/a-propos" style={{ fontSize: 13, color: '#1A1916', fontWeight: 600, textDecoration: 'none', fontFamily: 'system-ui' }}>À propos</a>
            <a href="/contact" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Contact</a>
            <a href="/" className="nav-cta" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontFamily: 'system-ui' }}>Analyser gratuitement</a>
          </div>
        </nav>

        {/* CONTENT */}
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 100px' }}>

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" style={{ fontFamily: 'system-ui', fontSize: 12, color: '#B0ABA5', marginBottom: 40, display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="/" style={{ color: '#B0ABA5', textDecoration: 'none' }}>Accueil</a>
            <span>›</span>
            <span style={{ color: '#8A8680' }}>À propos</span>
          </nav>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: -1, color: '#1A1916', marginBottom: 56, lineHeight: 1.1 }}>À propos de Detekia</h1>

          <Section title="Pourquoi Detekia existe">
            <P>Les moteurs de recherche IA (ChatGPT, Gemini, Claude, Perplexity) changent la façon dont les gens trouvent des entreprises. Le trafic référé par les IA a augmenté de 527% en 2025. Pourtant, la plupart des sites web ne sont pas optimisés pour être cités par ces moteurs.</P>
            <P>Detekia est né de ce constat : les entreprises ont besoin d'un outil simple pour mesurer et améliorer leur visibilité dans les réponses IA. Pas un outil de plus pour le SEO classique — un outil spécifiquement conçu pour le GEO (Generative Engine Optimization).</P>
          </Section>

          <Section title="Comment ça marche">
            <P>Detekia analyse votre site sur 8 critères de citabilité IA validés par la recherche académique (étude Princeton/Georgia Tech, KDD 2024). En 30 secondes, vous obtenez un score sur 100 et des recommandations personnalisées.</P>
            <P>Notre analyse est transparente : 7 critères sont évalués par analyse technique du HTML, 1 critère (neutralité éditoriale) est évalué par intelligence artificielle. Chaque recommandation est sourcée et accompagnée d'un cas réel documenté.</P>
          </Section>

          <Section title="Qui est derrière Detekia">
            <P>Detekia est un produit de Beeleven SASU, fondée par Guillaume Bourdon.</P>
            <P>Après plus de 10 ans dans le marketing digital, l'acquisition et la stratégie de croissance, Guillaume a accompagné des dizaines d'entreprises — de la startup early-stage à la PME établie — sur leurs enjeux de visibilité en ligne.</P>
            <P>En 2025, face à l'explosion du trafic référé par les IA (+527% en quelques mois), il crée Detekia pour répondre à un besoin que personne ne couvrait encore en France : donner aux entreprises un outil simple, transparent et actionnable pour mesurer et améliorer leur visibilité dans les réponses de ChatGPT, Claude, Gemini et Perplexity.</P>
            <P>La méthodologie de Detekia repose sur la recherche académique (Princeton / Georgia Tech, KDD 2024) et sur une veille constante des évolutions des moteurs IA.</P>
            <P>Contact : <a href="mailto:guillaume@beeleven.fr" style={{ color: '#D97757', textDecoration: 'none' }}>guillaume@beeleven.fr</a></P>
          </Section>

          <Section title="Méthodologie">
            <P>Notre scoring repose sur 8 critères pondérés selon leur impact démontré sur la visibilité IA :</P>
            <ul style={{ fontFamily: 'system-ui', fontSize: 15, color: '#3A3835', lineHeight: 1.8, paddingLeft: 20, marginBottom: 20 }}>
              {[
                'Extractibilité & réponse directe (25 pts)',
                'Vérifiabilité & preuves (20 pts)',
                'Autorité & E-E-A-T (15 pts)',
                'Crawlabilité IA (15 pts)',
                'Données structurées (10 pts)',
                'Neutralité éditoriale (10 pts)',
                'Présence externe (5 pts)',
                'Fraîcheur & maintenance (5 pts)',
              ].map(item => (
                <li key={item} style={{ marginBottom: 4 }}>{item}</li>
              ))}
            </ul>
            <P style={{ fontSize: 13, color: '#8A8680', fontStyle: 'italic' }}>Source : Aggarwal et al., "Generative Engine Optimization", Princeton / Georgia Tech, KDD 2024.</P>
          </Section>

          {/* CTA */}
          <div style={{ background: '#1A1916', borderRadius: 14, padding: '36px 32px', textAlign: 'center', marginTop: 16 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F7F5F2', marginBottom: 10, lineHeight: 1.2 }}>Testez votre score GEO gratuitement</h2>
            <p style={{ fontFamily: 'system-ui', fontSize: 14, color: 'rgba(247,245,242,0.6)', marginBottom: 24, lineHeight: 1.6 }}>Analyse complète en 30 secondes, sans inscription</p>
            <a href="/" style={{ display: 'inline-block', background: '#D97757', color: '#FFFFFF', borderRadius: 8, padding: '14px 32px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Analyser mon site →
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #E5E2DC', padding: '36px 48px', background: '#fff' }}>
          <div className="footer-inner" style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#1A1916' }}>Detekia</span>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[['Blog', '/blog'], ['Tarifs', '/pricing'], ['Méthodologie', '/methodologie'], ['À propos', '/a-propos'], ['Contact', '/contact'], ['Mentions légales', '/mentions-legales'], ['Confidentialité', '/confidentialite'], ['CGU', '/cgu']].map(([label, href]) => (
                <a key={label} href={href} style={{ fontFamily: 'system-ui', fontSize: 12, color: '#8A8680', textDecoration: 'none' }}>{label}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </>
  );
}
