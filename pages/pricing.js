import { useState } from 'react';

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'rapport' }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      alert('Erreur de paiement, réessayez.');
    } finally {
      setLoading(false);
    }
  }

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
          <a href="/pricing" style={{ fontSize: 13, color: '#1A1916', fontWeight: 600, textDecoration: 'none', fontFamily: 'system-ui' }}>Tarifs</a>
          <a href="/methodologie" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Méthodologie</a>
          <a href="/contact" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Contact</a>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontFamily: 'system-ui' }}>Analyser mon site</a>
        </div>
      </nav>

      {/* BANNIÈRE PROMO */}
      <div style={{ background: '#1A1916', padding: '12px 24px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'system-ui', fontSize: 13, color: '#F7F5F2' }}>
          🎉 <strong>Offre de lancement</strong> — Prix réduit jusqu'au{' '}
          <span style={{ color: '#D97757', fontWeight: 600 }}>15 avril 2026</span>
          {' '}· Plus que quelques jours
        </span>
      </div>

      {/* HERO */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.3)', padding: '5px 14px', borderRadius: 20, marginBottom: 24, background: 'rgba(217,119,87,0.06)' }}>
          <span>🎉</span> Offre de lancement limitée
        </div>
        <h1 style={{ fontSize: 'clamp(30px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 14, color: '#1A1916' }}>
          Débloquez votre rapport GEO complet
        </h1>
        <p style={{ fontSize: 15, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 52 }}>
          Toutes les recommandations expertes pour booster votre citabilité dans ChatGPT, Claude et Perplexity.
        </p>
      </div>

      {/* PLANS — 2 colonnes */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 80 }}>

        {/* FREE */}
        <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '28px 24px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Gratuit</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#1A1916', letterSpacing: -1, marginBottom: 4 }}>0€</div>
          <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', marginBottom: 24, lineHeight: 1.4 }}>Pour découvrir Detekia</div>
          <a href="/" style={{ display: 'block', textAlign: 'center', background: '#F0EDE8', color: '#1A1916', padding: '11px 0', borderRadius: 9, fontWeight: 600, fontSize: 13, textDecoration: 'none', fontFamily: 'system-ui', marginBottom: 24 }}>
            Commencer gratuitement
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              ['✓', 'Score GEO /100'],
              ['✓', 'Analyse des 8 critères'],
              ['✓', '1 recommandation aperçu'],
              ['✗', 'Recommandations complètes'],
              ['✗', 'Méthodes & exemples concrets'],
              ['✗', 'Rapport envoyé par email'],
            ].map(([check, text], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: check === '✓' ? '#10A37F' : '#D0CBC5', flexShrink: 0 }}>{check}</span>
                <span style={{ fontSize: 12, color: check === '✓' ? '#3A3835' : '#C2BDB8', fontFamily: 'system-ui' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RAPPORT — featured */}
        <div style={{ background: '#1A1916', borderRadius: 16, padding: '28px 24px', position: 'relative', boxShadow: '0 16px 48px rgba(26,25,22,0.2)' }}>
          {/* Badge populaire */}
          <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#D97757', color: '#fff', fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, padding: '4px 14px', borderRadius: 20, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Offre de lancement
          </div>

          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.45)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Rapport complet</div>

          {/* Prix avec barré */}
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontFamily: 'system-ui', fontSize: 13, color: 'rgba(247,245,242,0.35)', textDecoration: 'line-through', marginRight: 8 }}>59,99€</span>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#F7F5F2', letterSpacing: -1 }}>19,99€</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', marginBottom: 6 }}>
            Paiement unique · Par analyse
          </div>

          {/* Urgence */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(217,119,87,0.15)', border: '1px solid rgba(217,119,87,0.3)', borderRadius: 8, padding: '5px 10px', marginBottom: 20 }}>
            <span style={{ fontSize: 10 }}>⏳</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 1 }}>Prix normal reprend le 15 avril</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{ display: 'block', width: '100%', textAlign: 'center', background: '#D97757', color: '#fff', padding: '13px 0', borderRadius: 9, fontWeight: 700, fontSize: 14, border: 'none', cursor: loading ? 'wait' : 'pointer', fontFamily: 'system-ui', marginBottom: 24, opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
            {loading ? 'Chargement…' : 'Débloquer mon rapport — 19,99€ →'}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              ['✓', 'Score GEO /100 + analyse des 8 critères'],
              ['✓', 'Toutes les recommandations (5 à 8 selon le site)'],
              ['✓', 'Diagnostic, méthode, exemple concret par reco'],
              ['✓', 'Impact attendu et tip d\'expert pour chaque action'],
              ['✓', 'Rapport HTML complet envoyé par email'],
              ['✓', 'Accès immédiat en ligne, à vie'],
            ].map(([check, text], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#10A37F', flexShrink: 0 }}>{check}</span>
                <span style={{ fontSize: 12, color: 'rgba(247,245,242,0.75)', fontFamily: 'system-ui' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GARANTIE */}
      <div style={{ maxWidth: 560, margin: '0 auto 64px', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '20px 28px', display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 24 }}>🔒</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 3 }}>Paiement sécurisé via Stripe</div>
            <div style={{ fontSize: 12, color: '#8A8680', fontFamily: 'system-ui' }}>Aucune donnée de carte stockée · Remboursement sous 24h si problème</div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>Questions fréquentes</div>
        {[
          ['Qu\'est-ce que le GEO ?', 'Le GEO (Generative Engine Optimization) est l\'optimisation de votre site pour apparaître dans les réponses de ChatGPT, Claude, Gemini et Perplexity.'],
          ['Combien de recommandations vais-je recevoir ?', 'Toutes les recommandations générées pour les critères sous 80% de leur score max — en général entre 5 et 8 recommandations détaillées avec méthode, exemple et impact attendu.'],
          ['Le paiement est-il par site ou par analyse ?', 'Par analyse. Chaque rapport débloqué correspond à l\'analyse d\'un site à un instant donné.'],
          ['Comment est délivré le rapport ?', 'Immédiatement en ligne sur la page de confirmation, et envoyé par email en HTML pour être consulté hors ligne.'],
          ['Les données de mon site sont-elles conservées ?', 'Non. Detekia analyse votre site en temps réel. Seul le rapport est mis en cache 24h pour vous éviter d\'attendre si vous revenez sur la même URL.'],
        ].map(([q, a], i) => (
          <div key={i} style={{ borderBottom: '1px solid #E5E2DC', padding: '20px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui' }}>{q}</div>
            <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui' }}>{a}</div>
          </div>
        ))}
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 600px) {
          nav { padding: 0 20px !important; }
          div[style*="gridTemplateColumns: '1fr 1fr'"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
