export default function Legal() {
  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.95)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 18, height: 18 }}>
            {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
              <div key={i} style={{ background: c, borderRadius: '50%' }} />
            ))}
          </div>
          Detekia
        </a>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="/pricing" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none' }}>Tarifs</a>
          <a href="/contact" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none' }}>Contact</a>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '8px 18px', borderRadius: 8, textDecoration: 'none' }}>Analyser mon site</a>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '72px 24px 100px' }}>

        {/* MENTIONS LÉGALES */}
        <h1 style={{ fontSize: 36, letterSpacing: -1, color: '#1A1916', marginBottom: 8 }}>Mentions légales</h1>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, marginBottom: 48 }}>Dernière mise à jour : mars 2026</p>

        {[
          ['Éditeur du site', `Detekia\nReprésentant : Guillaume Bourdon\nEmail : hello@detekia.fr`],
          ['Hébergement', `Vercel Inc.\n340 Pine Street, Suite 701\nSan Francisco, CA 94104, États-Unis\nhttps://vercel.com`],
          ['Propriété intellectuelle', `L'ensemble du contenu de ce site (textes, images, logotypes, interface) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite de Detekia.`],
          ['Limitation de responsabilité', `Detekia fournit des analyses à titre indicatif. Les scores et recommandations ne constituent pas des conseils professionnels certifiés. Detekia ne saurait être tenu responsable des décisions prises sur la base des analyses fournies.`],
        ].map(([title, content]) => (
          <div key={title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1A1916', marginBottom: 12, fontFamily: 'system-ui, sans-serif' }}>{title}</h2>
            <p style={{ fontSize: 14, color: '#8A8680', lineHeight: 1.75, fontFamily: 'system-ui, sans-serif', whiteSpace: 'pre-line' }}>{content}</p>
          </div>
        ))}

        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 48, marginTop: 48 }}>
          <h1 style={{ fontSize: 36, letterSpacing: -1, color: '#1A1916', marginBottom: 8 }}>Politique de confidentialité</h1>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, marginBottom: 48 }}>Conforme au RGPD</p>

          {[
            ['Données collectées', `Detekia collecte uniquement les données nécessaires au fonctionnement du service :\n• Les URLs soumises pour analyse (non conservées après analyse)\n• Les données du formulaire de contact (nom, email, message)\n• Les données de navigation anonymes (via Vercel Analytics)`],
            ['Utilisation des données', `Les données sont utilisées exclusivement pour :\n• Réaliser l'analyse GEO demandée\n• Répondre aux messages de contact\n• Améliorer le service de façon anonyme`],
            ['Conservation des données', `Les URLs analysées ne sont pas conservées sur nos serveurs. Les données de contact sont conservées 3 ans maximum. Vous pouvez demander leur suppression à tout moment.`],
            ['Vos droits (RGPD)', `Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits : hello@detekia.fr`],
            ['Cookies', `Detekia n'utilise pas de cookies publicitaires ou de tracking tiers. Seuls des cookies techniques indispensables au fonctionnement du site peuvent être déposés.`],
          ].map(([title, content]) => (
            <div key={title} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1A1916', marginBottom: 12, fontFamily: 'system-ui, sans-serif' }}>{title}</h2>
              <p style={{ fontSize: 14, color: '#8A8680', lineHeight: 1.75, fontFamily: 'system-ui, sans-serif', whiteSpace: 'pre-line' }}>{content}</p>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 48, marginTop: 48 }}>
          <h1 style={{ fontSize: 36, letterSpacing: -1, color: '#1A1916', marginBottom: 8 }}>Conditions générales d'utilisation</h1>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, marginBottom: 48 }}>En vigueur au 1er mars 2026</p>

          {[
            ['Objet', `Les présentes CGU définissent les conditions d'utilisation du service Detekia, outil d'analyse GEO (Generative Engine Optimization) accessible à l'adresse detekia.vercel.app.`],
            ['Accès au service', `L'accès à l'analyse de base est gratuit et sans inscription. L'accès aux rapports complets est soumis à un paiement selon les tarifs en vigueur sur la page Tarifs.`],
            ['Utilisation acceptable', `L'utilisateur s'engage à ne pas utiliser Detekia pour analyser des sites à des fins malveillantes, ne pas soumettre des URLs en masse de façon automatisée, et ne pas tenter de contourner les limitations du service.`],
            ['Disponibilité', `Detekia s'efforce d'assurer une disponibilité maximale du service mais ne garantit pas une disponibilité ininterrompue. Des interruptions pour maintenance peuvent survenir.`],
            ['Droit applicable', `Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront compétents.`],
          ].map(([title, content]) => (
            <div key={title} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1A1916', marginBottom: 12, fontFamily: 'system-ui, sans-serif' }}>{title}</h2>
              <p style={{ fontSize: 14, color: '#8A8680', lineHeight: 1.75, fontFamily: 'system-ui, sans-serif', whiteSpace: 'pre-line' }}>{content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #E5E2DC', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 'bold', color: '#1A1916' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
            {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
              <div key={i} style={{ background: c, borderRadius: '50%' }} />
            ))}
          </div>
          Detekia
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/legal" style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none' }}>Mentions légales</a>
          <a href="/legal" style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none' }}>Confidentialité</a>
          <a href="/legal" style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none' }}>CGU</a>
          <a href="/contact" style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}