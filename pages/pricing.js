import { useState } from 'react';

export default function Pricing() {
  const [loading, setLoading] = useState(null);

  async function handleCheckout(plan) {
    setLoading(plan);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      alert('Erreur de paiement, réessayez.');
    } finally {
      setLoading(null);
    }
  }

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
          GeoSignal
        </a>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="/pricing" style={{ fontSize: 13, color: '#1A1916', fontWeight: 600, textDecoration: 'none' }}>Tarifs</a>
          <a href="/contact" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none' }}>Contact</a>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '8px 18px', borderRadius: 8, textDecoration: 'none' }}>Analyser mon site</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '72px 24px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.3)', padding: '5px 14px', borderRadius: 20, marginBottom: 24, background: 'rgba(217,119,87,0.06)' }}>
          Tarifs simples et transparents
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 16, color: '#1A1916' }}>
          Choisissez votre plan
        </h1>
        <p style={{ fontSize: 15, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif', marginBottom: 60 }}>
          Commencez gratuitement. Passez au plan payant quand vous êtes prêt.
        </p>
      </div>

      {/* PLANS */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 80 }}>

        {/* FREE */}
        <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: 28 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Gratuit</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 42, color: '#1A1916', letterSpacing: -1, marginBottom: 4 }}>0€</div>
          <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui, sans-serif', marginBottom: 24 }}>Pour découvrir GeoSignal</div>
          <a href="/" style={{ display: 'block', textAlign: 'center', background: '#F0EDE8', color: '#1A1916', padding: '12px 0', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', fontFamily: 'system-ui, sans-serif', marginBottom: 28 }}>
            Commencer gratuitement
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['✓ Score GEO sur 120','✓ Analyse des 6 critères','✓ 2 recommandations offertes','✗ Recommandations complètes','✗ Plan d\'action détaillé','✗ Analyses illimitées'].map((f,i) => (
              <div key={i} style={{ fontSize: 13, color: f.startsWith('✗') ? '#C2BDB8' : '#3A3835', fontFamily: 'system-ui, sans-serif' }}>{f}</div>
            ))}
          </div>
        </div>

        {/* RAPPORT */}
        <div style={{ background: '#1A1916', borderRadius: 16, padding: 28, position: 'relative', transform: 'scale(1.03)', boxShadow: '0 12px 40px rgba(26,25,22,0.15)' }}>
          <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#D97757', color: '#fff', fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, padding: '4px 14px', borderRadius: 20, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Le plus populaire
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Rapport complet</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 42, color: '#F7F5F2', letterSpacing: -1, marginBottom: 4 }}>9€</div>
          <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui, sans-serif', marginBottom: 24 }}>Par analyse · Paiement unique</div>
          <button
            onClick={() => handleCheckout('rapport')}
            disabled={loading === 'rapport'}
            style={{ display: 'block', width: '100%', textAlign: 'center', background: '#D97757', color: '#fff', padding: '12px 0', borderRadius: 10, fontWeight: 600, fontSize: 14, border: 'none', cursor: loading === 'rapport' ? 'wait' : 'pointer', fontFamily: 'system-ui, sans-serif', marginBottom: 28, opacity: loading === 'rapport' ? 0.7 : 1 }}>
            {loading === 'rapport' ? 'Chargement...' : 'Débloquer ce rapport →'}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['✓ Score GEO sur 120','✓ Analyse des 6 critères','✓ 5 recommandations complètes','✓ Plan d\'action priorisé','✓ Rapport PDF téléchargeable','✗ Analyses illimitées'].map((f,i) => (
              <div key={i} style={{ fontSize: 13, color: f.startsWith('✗') ? 'rgba(247,245,242,0.25)' : 'rgba(247,245,242,0.85)', fontFamily: 'system-ui, sans-serif' }}>{f}</div>
            ))}
          </div>
        </div>

        {/* PRO */}
        <div style={{ background: '#fff', border: '2px solid #1A1916', borderRadius: 16, padding: 28 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Pro</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 42, color: '#1A1916', letterSpacing: -1 }}>29€</div>
            <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui, sans-serif' }}>/mois</div>
          </div>
          <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui, sans-serif', marginBottom: 24 }}>Pour agences et freelances</div>
          <button
            onClick={() => handleCheckout('pro')}
            disabled={loading === 'pro'}
            style={{ display: 'block', width: '100%', textAlign: 'center', background: '#1A1916', color: '#F7F5F2', padding: '12px 0', borderRadius: 10, fontWeight: 600, fontSize: 14, border: 'none', cursor: loading === 'pro' ? 'wait' : 'pointer', fontFamily: 'system-ui, sans-serif', marginBottom: 28, opacity: loading === 'pro' ? 0.7 : 1 }}>
            {loading === 'pro' ? 'Chargement...' : 'Démarrer l\'essai gratuit →'}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['✓ Analyses illimitées','✓ Score GEO sur 120','✓ 5 recommandations complètes','✓ Plan d\'action priorisé','✓ Rapport PDF téléchargeable','✓ Suivi de progression'].map((f,i) => (
              <div key={i} style={{ fontSize: 13, color: '#3A3835', fontFamily: 'system-ui, sans-serif' }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 32 }}>Questions fréquentes</div>
        {[
          ['Comment fonctionne l\'analyse gratuite ?', 'Entrez l\'URL de votre site, GeoSignal l\'analyse en ~20 secondes et vous donne un score GEO sur 120 avec 2 recommandations prioritaires offertes.'],
          ['Qu\'est-ce que le GEO ?', 'Le GEO (Generative Engine Optimization) est l\'optimisation de votre site pour apparaître dans les réponses de ChatGPT, Claude, Gemini et Perplexity.'],
          ['Le paiement à 9€ est-il par site ou par analyse ?', 'Par analyse. Chaque rapport débloqué correspond à une analyse d\'un site à un instant donné.'],
          ['Puis-je annuler mon abonnement Pro ?', 'Oui, à tout moment et sans engagement depuis votre espace Stripe.'],
          ['Les données de mon site sont-elles conservées ?', 'Non. GeoSignal analyse votre site en temps réel et ne conserve aucune donnée sur nos serveurs.'],
        ].map(([q,a],i) => (
          <div key={i} style={{ borderBottom: '1px solid #E5E2DC', padding: '20px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui, sans-serif' }}>{q}</div>
            <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif' }}>{a}</div>
          </div>
        ))}
      </div>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}