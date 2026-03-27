const NAV_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Tarifs', href: '/pricing' },
  { label: 'Méthodologie', href: '/methodologie' },
  { label: 'Contact', href: '/contact' },
];

const FOOTER_LINKS = [
  ['Tarifs', '/pricing'], ['Méthodologie', '/methodologie'],
  ['Mentions légales', '/legal'], ['Confidentialité', '/legal'],
  ['CGU', '/legal'], ['Contact', '/contact'],
];

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1A1916', marginBottom: 12, fontFamily: 'system-ui' }}>{title}</h2>
      <div style={{ fontSize: 14, color: '#8A8680', lineHeight: 1.75, fontFamily: 'system-ui', whiteSpace: 'pre-line' }}>{children}</div>
    </div>
  );
}

export default function Legal() {
  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
            {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
              <div key={i} style={{ background: c, borderRadius: '50%' }} />
            ))}
          </div>
          Detekia
        </a>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{label}</a>
          ))}
          <a href="/" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontFamily: 'system-ui' }}>Analyser mon site</a>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '72px 24px 100px' }}>

        {/* ── MENTIONS LÉGALES ── */}
        <h1 style={{ fontSize: 36, letterSpacing: -1, color: '#1A1916', marginBottom: 8 }}>Mentions légales</h1>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, marginBottom: 48 }}>Dernière mise à jour : mars 2026</p>

        <Section title="Éditeur du site">
          {`Raison sociale : Beeleven SASU
Forme juridique : Société par Actions Simplifiée Unipersonnelle (SASU) au capital de 1 000 €
Siège social : 7 rue Curial, 75019 Paris, France
RCS : Paris 102 307 345
Directeur de la publication : Guillaume Bourdon
Email : hello@detekia.fr
Site web : https://detekia.fr`}
        </Section>

        <Section title="Hébergement">
          {`Vercel Inc.
340 Pine Street, Suite 701
San Francisco, CA 94104, États-Unis
https://vercel.com`}
        </Section>

        <Section title="Propriété intellectuelle">
          {`L'ensemble du contenu de ce site (textes, images, logotypes, interface) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite de Beeleven SASU.`}
        </Section>

        <Section title="Limitation de responsabilité">
          {`Detekia fournit des analyses à titre indicatif. Les scores et recommandations ne constituent pas des conseils professionnels certifiés. Beeleven SASU ne saurait être tenu responsable des décisions prises sur la base des analyses fournies.`}
        </Section>

        <Section title="Conditions de remboursement">
          {`En cas de dysfonctionnement technique avéré empêchant l'accès au rapport commandé, un remboursement intégral peut être demandé dans un délai de 24 heures suivant l'achat en contactant hello@detekia.fr. Les demandes reçues au-delà de ce délai ou sans motif technique valide ne pourront pas être traitées.`}
        </Section>

        {/* ── CONFIDENTIALITÉ ── */}
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 48, marginTop: 48 }}>
          <h1 style={{ fontSize: 36, letterSpacing: -1, color: '#1A1916', marginBottom: 8 }}>Politique de confidentialité</h1>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, marginBottom: 48 }}>Conforme au RGPD</p>

          <Section title="Données collectées">
            {`Detekia collecte uniquement les données nécessaires au fonctionnement du service :\n• Les URLs soumises pour analyse (mises en cache 24h, non conservées au-delà)\n• L'adresse email en cas d'achat d'un rapport (transmise par Stripe)\n• Les données du formulaire de contact (nom, email, message)\n• Les données de navigation anonymes (via Vercel Analytics)`}
          </Section>

          <Section title="Utilisation des données">
            {`Les données sont utilisées exclusivement pour :\n• Réaliser l'analyse GEO demandée\n• Délivrer le rapport commandé par email\n• Répondre aux messages de contact\n• Améliorer le service de façon anonyme`}
          </Section>

          <Section title="Conservation des données">
            {`Les URLs analysées sont mises en cache 24 heures pour accélérer les analyses successives du même site. Les données de contact sont conservées 3 ans maximum. Vous pouvez demander leur suppression à tout moment à hello@detekia.fr.`}
          </Section>

          <Section title="Vos droits (RGPD)">
            {`Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits : hello@detekia.fr`}
          </Section>

          <Section title="Cookies">
            {`Detekia n'utilise pas de cookies publicitaires ou de tracking tiers. Seuls des cookies techniques indispensables au fonctionnement du site peuvent être déposés.`}
          </Section>
        </div>

        {/* ── CGU ── */}
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 48, marginTop: 48 }}>
          <h1 style={{ fontSize: 36, letterSpacing: -1, color: '#1A1916', marginBottom: 8 }}>Conditions générales d'utilisation</h1>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, marginBottom: 48 }}>En vigueur au 1er mars 2026</p>

          <Section title="Objet">
            {`Les présentes CGU définissent les conditions d'utilisation du service Detekia, outil d'analyse GEO (Generative Engine Optimization) accessible à l'adresse detekia.fr, édité par Beeleven SASU.`}
          </Section>

          <Section title="Accès au service">
            {`L'accès à l'analyse de base est gratuit et sans inscription. L'accès aux rapports complets est soumis à un paiement selon les tarifs en vigueur sur la page Tarifs.`}
          </Section>

          <Section title="Utilisation acceptable">
            {`L'utilisateur s'engage à ne pas utiliser Detekia pour analyser des sites à des fins malveillantes, ne pas soumettre des URLs en masse de façon automatisée, et ne pas tenter de contourner les limitations du service.`}
          </Section>

          <Section title="Disponibilité">
            {`Detekia s'efforce d'assurer une disponibilité maximale du service mais ne garantit pas une disponibilité ininterrompue. Des interruptions pour maintenance peuvent survenir.`}
          </Section>

          <Section title="Droit applicable">
            {`Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux de Paris seront compétents.`}
          </Section>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #E5E2DC', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
            {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
              <div key={i} style={{ background: c, borderRadius: '50%' }} />
            ))}
          </div>
          Detekia
          <span style={{ fontSize: 11, fontWeight: 400, color: '#C2BDB8', fontFamily: 'system-ui', marginLeft: 8 }}>par Beeleven SASU</span>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {FOOTER_LINKS.map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{label}</a>
          ))}
        </div>
      </footer>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}
