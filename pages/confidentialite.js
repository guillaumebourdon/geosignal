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

export default function Confidentialite() {
  return (
    <>
      <Head>
        <title>Politique de confidentialité | Detekia</title>
        <meta name="description" content="Politique de confidentialité de Detekia — données collectées, sous-traitants, vos droits RGPD." />
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
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, letterSpacing: -1, color: '#1A1916', marginBottom: 12, lineHeight: 1.1 }}>Politique de confidentialité</h1>
          <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#B0ABA5', marginBottom: 48 }}>Dernière mise à jour : 27 mars 2026</p>

          <Section title="Responsable du traitement">
            <P><strong>Beeleven SASU</strong>, société par actions simplifiée unipersonnelle, immatriculée au RCS de Paris sous le numéro 102 307 345.</P>
            <P>Siège social : 7 rue Curial, 75019 Paris, France.</P>
            <P>Email : <a href="mailto:hello@detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>hello@detekia.fr</a></P>
            <P>Directeur de la publication : Guillaume Bourdon.</P>
          </Section>

          <Section title="Données collectées et finalités">
            <P>Detekia collecte un nombre minimal de données, strictement nécessaires au fonctionnement du service.</P>
            <P><strong>URL analysée</strong> — Lorsque vous lancez une analyse GEO, l'URL que vous saisissez est traitée en temps réel pour générer votre score. L'URL et les résultats sont mis en cache dans notre base de données (Upstash Redis) pendant 24 heures afin d'accélérer les analyses ultérieures du même site. Après 24 heures, ces données sont automatiquement supprimées. <em>Base légale : intérêt légitime (fourniture du service demandé).</em></P>
            <P><strong>Adresse email (optionnel)</strong> — Si vous choisissez de recevoir votre rapport par email via le formulaire de capture, votre adresse email est stockée dans notre base de données avec l'URL analysée et le score obtenu. Cette donnée est utilisée pour vous envoyer votre rapport et, si vous y consentez, des alertes sur l'évolution de votre score. <em>Base légale : consentement.</em></P>
            <P><strong>Données de paiement</strong> — Lorsque vous achetez le rapport GEO complet, le paiement est intégralement traité par Stripe Payments Europe, Ltd. Beeleven SASU ne collecte, ne stocke et ne traite aucune donnée bancaire (numéro de carte, date d'expiration, cryptogramme). Seules les informations transmises par Stripe après le paiement sont traitées : email de l'acheteur, identifiant de transaction, montant. <em>Base légale : exécution du contrat.</em></P>
            <P><strong>Données de navigation</strong> — Detekia utilise Vercel Analytics pour mesurer la fréquentation du site (pages vues, durée de visite, provenance géographique). Vercel Analytics ne dépose pas de cookies, n'utilise pas de traceurs tiers et ne collecte pas de données personnelles identifiantes. Les données sont agrégées et anonymes. <em>Base légale : intérêt légitime (amélioration du service).</em></P>
          </Section>

          <Section title="Données que Detekia ne collecte pas">
            <P>Detekia ne crée pas de comptes utilisateurs et ne collecte pas de mots de passe. Detekia ne collecte pas de données bancaires. Detekia ne collecte pas d'adresse IP à des fins d'identification. Detekia n'utilise pas de cookies publicitaires ni de traceurs tiers. Detekia ne revend aucune donnée à des tiers.</P>
          </Section>

          <Section title="Cookies">
            <P>Detekia utilise uniquement des cookies strictement nécessaires au fonctionnement du site (cookies de session, préférences de consentement). Aucun cookie publicitaire ou de tracking tiers n'est déposé.</P>
            <P>Vercel Analytics, utilisé pour la mesure d'audience, fonctionne sans cookies.</P>
            <P>La bannière de consentement aux cookies vous permet d'accepter ou de refuser les cookies non essentiels.</P>
          </Section>

          <Section title="Sous-traitants et destinataires des données">
            <P>Les données collectées par Detekia sont traitées par les sous-traitants suivants, tous conformes au RGPD ou au cadre de protection des données UE-US :</P>
            <ul style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75, paddingLeft: 20, marginBottom: 12 }}>
              <li style={{ marginBottom: 8 }}><strong>Vercel Inc.</strong> (États-Unis) — hébergement du site et analytics. Conforme au Data Privacy Framework UE-US.</li>
              <li style={{ marginBottom: 8 }}><strong>Upstash</strong> (hébergé en UE, région eu-west-1) — stockage temporaire des résultats d'analyse et des leads email. Données hébergées dans l'Union européenne.</li>
              <li style={{ marginBottom: 8 }}><strong>Stripe Payments Europe, Ltd.</strong> (Irlande) — traitement des paiements. Certifié PCI DSS Level 1, conforme au RGPD.</li>
              <li style={{ marginBottom: 8 }}><strong>Resend</strong> (États-Unis) — envoi des emails transactionnels (rapport par email, confirmation). Conforme au Data Privacy Framework UE-US.</li>
              <li style={{ marginBottom: 8 }}><strong>Anthropic</strong> (États-Unis) — analyse de la neutralité éditoriale du contenu scanné via l'API Claude. Aucune donnée personnelle n'est transmise à Anthropic ; seul le contenu textuel de la page analysée est envoyé pour évaluation. Conforme au Data Privacy Framework UE-US.</li>
            </ul>
            <P>Aucune donnée personnelle n'est transmise à d'autres tiers que ceux listés ci-dessus.</P>
          </Section>

          <Section title="Durée de conservation">
            <ul style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75, paddingLeft: 20, marginBottom: 12 }}>
              <li style={{ marginBottom: 8 }}>URL analysée et résultats : 24 heures (cache automatique).</li>
              <li style={{ marginBottom: 8 }}>Adresse email (capture optionnelle) : conservée jusqu'à la demande de suppression par l'utilisateur.</li>
              <li style={{ marginBottom: 8 }}>Données de transaction Stripe : conservées pendant la durée légale de conservation des pièces comptables (10 ans).</li>
              <li style={{ marginBottom: 8 }}>Données Vercel Analytics : agrégées et anonymes, conservées par Vercel selon sa politique de rétention.</li>
            </ul>
          </Section>

          <Section title="Vos droits">
            <P>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants sur vos données personnelles :</P>
            <ul style={{ fontFamily: 'system-ui', fontSize: 15, color: '#1A1916', lineHeight: 1.75, paddingLeft: 20, marginBottom: 12 }}>
              <li style={{ marginBottom: 8 }}><strong>Droit d'accès</strong> — Vous pouvez demander une copie de toutes les données personnelles que nous détenons vous concernant.</li>
              <li style={{ marginBottom: 8 }}><strong>Droit de rectification</strong> — Vous pouvez demander la correction de données inexactes ou incomplètes.</li>
              <li style={{ marginBottom: 8 }}><strong>Droit de suppression</strong> — Vous pouvez demander la suppression de vos données personnelles. Pour les emails collectés via le formulaire de capture, la suppression est immédiate sur demande.</li>
              <li style={{ marginBottom: 8 }}><strong>Droit d'opposition</strong> — Vous pouvez vous opposer au traitement de vos données à tout moment.</li>
              <li style={{ marginBottom: 8 }}><strong>Droit à la portabilité</strong> — Vous pouvez demander à recevoir vos données dans un format structuré et lisible par machine.</li>
              <li style={{ marginBottom: 8 }}><strong>Droit de retirer votre consentement</strong> — Pour les traitements basés sur le consentement (capture email), vous pouvez retirer votre consentement à tout moment.</li>
            </ul>
            <P>Pour exercer l'un de ces droits, envoyez un email à <a href="mailto:hello@detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>hello@detekia.fr</a> en précisant votre demande. Nous répondrons dans un délai maximal de 30 jours.</P>
            <P>Si vous estimez que le traitement de vos données n'est pas conforme à la réglementation, vous pouvez adresser une réclamation à la CNIL : <a href="https://www.cnil.fr" style={{ color: '#D97757', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.</P>
          </Section>

          <Section title="Transferts de données hors UE">
            <P>Certains de nos sous-traitants sont situés aux États-Unis (Vercel, Resend, Anthropic). Ces transferts sont encadrés par le Data Privacy Framework UE-US, reconnu par la Commission européenne comme offrant un niveau de protection adéquat (décision d'adéquation du 10 juillet 2023).</P>
            <P>Les données de paiement sont traitées par Stripe Payments Europe, Ltd., établi en Irlande (UE).</P>
            <P>Les données de cache (URL, résultats d'analyse) sont stockées par Upstash dans la région eu-west-1 (UE).</P>
          </Section>

          <Section title="Sécurité">
            <P>Beeleven SASU met en œuvre les mesures techniques et organisationnelles appropriées pour protéger les données personnelles contre la perte, le vol, l'accès non autorisé, la divulgation ou la destruction. Les communications sont chiffrées via HTTPS/TLS. Les accès aux bases de données sont protégés par authentification.</P>
          </Section>

          <Section title="Modification de cette politique">
            <P>Cette politique de confidentialité peut être mise à jour à tout moment. La date de dernière mise à jour est indiquée en haut de cette page. Nous vous encourageons à consulter cette page régulièrement.</P>
          </Section>

          <Section title="Contact">
            <P>Pour toute question relative à la protection de vos données : <a href="mailto:hello@detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>hello@detekia.fr</a></P>
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
