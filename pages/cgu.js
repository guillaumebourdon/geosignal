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
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 16, lineHeight: 1.2 }}>{title}</h2>
      {children}
    </section>
  );
}

function P({ children }) {
  return <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75, marginBottom: 12 }}>{children}</p>;
}

export default function CGU() {
  return (
    <>
      <Head>
        <title>Conditions Générales d'Utilisation et de Vente | Detekia</title>
        <meta name="description" content="CGU/CGV de Detekia — conditions d'utilisation du service et de vente du rapport GEO complet." />
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

        {/* NAV */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
            <Logo />Detekia
          </a>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <a href="/blog" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Blog</a>
            <a href="/pricing" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Tarifs</a>
            <a href="/methodologie" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Méthodologie</a>
            <a href="/contact" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Contact</a>
            <a href="/" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontFamily: 'system-ui' }}>Analyser gratuitement</a>
          </div>
        </nav>

        {/* CONTENT */}
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 100px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, letterSpacing: -1, color: '#1A1916', marginBottom: 12, lineHeight: 1.1 }}>Conditions Générales d'Utilisation et de Vente</h1>
          <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#B0ABA5', marginBottom: 48 }}>Dernière mise à jour : 27 mars 2026</p>

          <Section title="Objet">
            <P>Les présentes Conditions Générales d'Utilisation et de Vente (ci-après "CGU/CGV") régissent l'utilisation du site detekia.fr et les conditions de vente du rapport GEO complet. En utilisant le site ou en achetant un rapport, vous acceptez l'intégralité des présentes conditions.</P>
            <P>Le site detekia.fr est édité par Beeleven SASU (voir <a href="/mentions-legales" style={{ color: '#D97757', textDecoration: 'none' }}>Mentions légales</a> pour les informations complètes).</P>
          </Section>

          <Section title="Service gratuit — Analyse GEO">
            <P>Detekia propose un service d'analyse GEO gratuit accessible sans inscription et sans création de compte. Ce service comprend un score global sur 100, l'évaluation de 8 critères GEO, et un aperçu d'une recommandation.</P>
            <P>L'utilisateur saisit l'URL d'un site web qu'il souhaite analyser. Detekia scrape le contenu accessible publiquement de cette URL et l'évalue selon sa méthodologie propriétaire. L'analyse est effectuée en temps réel. Les résultats sont mis en cache pendant 24 heures.</P>
            <P>Le service gratuit est fourni "en l'état", sans garantie de disponibilité ni d'exactitude des résultats. Detekia se réserve le droit de modifier, suspendre ou interrompre le service gratuit à tout moment.</P>
          </Section>

          <Section title="Service payant — Rapport GEO complet">
            <P>Le rapport GEO complet est vendu au prix de <strong>29 € TTC</strong> (toutes taxes comprises) par analyse. Ce rapport comprend l'ensemble des recommandations détaillées, structurées en sections (diagnostic, actions, exemples concrets, impact estimé), pour chacun des 8 critères GEO.</P>
            <P>Le rapport est accessible immédiatement après le paiement sur la page de résultats et est envoyé par email à l'adresse associée au paiement Stripe.</P>
          </Section>

          <Section title="Paiement">
            <P>Le paiement est effectué en ligne par carte bancaire, Apple Pay ou PayPal via la plateforme sécurisée Stripe. Beeleven SASU ne collecte ni ne stocke aucune donnée bancaire. L'intégralité du traitement des paiements est assurée par Stripe Payments Europe, Ltd.</P>
            <P>Le paiement est exigible immédiatement à la commande. La transaction est considérée comme effective dès la confirmation de paiement par Stripe.</P>
          </Section>

          <Section title="Politique de remboursement — Satisfait ou remboursé">
            <P>Si le rapport GEO complet ne vous apporte aucune piste d'amélioration actionnable, vous pouvez demander un remboursement intégral dans les 7 jours suivant l'achat.</P>
            <P>Pour demander un remboursement, envoyez un email à <a href="mailto:hello@detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>hello@detekia.fr</a> en précisant l'URL analysée et la raison de votre insatisfaction. Le remboursement sera effectué sous 5 jours ouvrés via le même moyen de paiement utilisé lors de l'achat.</P>
          </Section>

          <Section title="Droit de rétractation">
            <P>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture de contenu numérique non fourni sur un support matériel dont l'exécution a commencé avec l'accord du consommateur. En achetant le rapport, vous reconnaissez que la fourniture du contenu numérique commence immédiatement après le paiement et vous renoncez expressément à votre droit de rétractation.</P>
            <P>Toutefois, la politique de remboursement "Satisfait ou remboursé" décrite ci-dessus s'applique et va au-delà des obligations légales.</P>
          </Section>

          <Section title="Propriété intellectuelle">
            <P>Le rapport GEO est fourni pour un usage personnel et professionnel de l'acheteur. Il ne peut être revendu, redistribué ou publié sans l'autorisation écrite de Beeleven SASU. La méthodologie d'analyse et le scoring GEO sont la propriété intellectuelle de Beeleven SASU.</P>
          </Section>

          <Section title="Limitation de responsabilité">
            <P>Les résultats d'analyse et les recommandations fournies par Detekia sont générés automatiquement et sont donnés à titre indicatif. Ils ne constituent pas un conseil professionnel en référencement, marketing ou stratégie digitale.</P>
            <P>Beeleven SASU ne garantit pas que l'application des recommandations entraînera une amélioration de la visibilité du site dans les réponses des IA. La visibilité dans les moteurs IA dépend de nombreux facteurs externes indépendants de la volonté de Beeleven SASU.</P>
            <P>En aucun cas, la responsabilité de Beeleven SASU ne pourra être engagée au-delà du montant du rapport acheté (29 €).</P>
          </Section>

          <Section title="Modification des conditions">
            <P>Beeleven SASU se réserve le droit de modifier les présentes CGU/CGV à tout moment. Les modifications prennent effet dès leur publication sur le site. La date de dernière mise à jour est indiquée en haut de cette page.</P>
          </Section>

          <Section title="Droit applicable et litiges">
            <P>Les présentes conditions sont soumises au droit français. En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux compétents de Paris seront seuls compétents.</P>
          </Section>

          <Section title="Contact">
            <P>Pour toute question relative aux présentes conditions : <a href="mailto:hello@detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>hello@detekia.fr</a></P>
          </Section>
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
