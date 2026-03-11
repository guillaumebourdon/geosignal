import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const steps = [
    '🔍 Récupération du site...',
    '🧩 Analyse des données structurées...',
    '💬 Évaluation de la citabilité...',
    '🌐 Vérification de la présence externe...',
    '📊 Calcul du score GEO...',
  ];

  async function analyze() {
    if (!url) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setStep(0);
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 700));
    }
    try {
      const cleanUrl = url.replace(/^https?:\/\//, '');
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function getLevel(score, max) {
    const pct = score / max;
    if (pct >= 0.75) return 'good';
    if (pct >= 0.45) return 'medium';
    return 'bad';
  }

  function getGrade(score) {
    if (score >= 70) return { label: 'BON', color: '#10A37F' };
    if (score >= 45) return { label: 'MOYEN', color: '#C9861A' };
    return { label: 'FAIBLE', color: '#D97757' };
  }

  const colors = { good: '#10A37F', medium: '#C9861A', bad: '#D97757' };
  const tagColors = {
    high:   { bg: 'rgba(217,119,87,0.12)', color: '#D97757' },
    medium: { bg: 'rgba(201,134,26,0.12)', color: '#C9861A' },
    low:    { bg: 'rgba(16,163,127,0.12)', color: '#10A37F' },
  };
  const tagLabels = { high: 'Critique', medium: 'Important', low: 'Bonus' };

  const features = [
    ['🧩', 'Données structurées', "Schema.org, FAQ, Organization — les balises qui permettent aux IA de comprendre votre business."],
    ['💬', 'Citabilité', "Vos contenus sont-ils assez clairs et factuels pour être repris dans une réponse d'IA ?"],
    ['🎯', "Clarté d'identité", "Les IA comprennent-elles immédiatement qui vous êtes, ce que vous faites, pour qui ?"],
    ['🏗️', 'Architecture', "Pages About, Blog, Contact — la structure qui renforce votre autorité perçue."],
    ['⚡', 'Accessibilité crawlers', "Votre contenu est-il lisible sans JavaScript ? Les IA doivent pouvoir l'indexer facilement."],
    ['🌐', 'Présence externe', "Mentions presse, Wikipédia, annuaires — les signaux d'autorité que les IA valorisent."],
  ];

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
          <a href="/pricing" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none' }}>Tarifs</a>
          <a href="/contact" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none' }}>Contact</a>
          <a href="/pricing" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '8px 18px', borderRadius: 8, textDecoration: 'none' }}>Voir les tarifs</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {[['#10A37F','ChatGPT'],['#D97757','Claude'],['#4285F4','Gemini'],['#1C7DC4','Perplexity']].map(([c,name]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'monospace', padding: '5px 12px', borderRadius: 20, border: '1px solid #E5E2DC', background: '#fff', color: '#8A8680' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
              {name}
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 7vw, 70px)', lineHeight: 1.0, letterSpacing: -1.5, marginBottom: 20, color: '#1A1916' }}>
          Votre site est-il<br />
          <em style={{ color: '#D97757', fontStyle: 'italic' }}>visible</em> par les IA ?
        </h1>

        <p style={{ fontSize: 16, color: '#8A8680', maxWidth: 460, margin: '0 auto 40px', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif' }}>
          GeoSignal analyse votre présence sur les 4 grands moteurs d'IA et vous donne un score GEO avec les actions concrètes pour progresser.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: `1.5px solid ${loading ? '#D97757' : '#E5E2DC'}`, borderRadius: 14, padding: '6px 6px 6px 20px', maxWidth: 560, margin: '0 auto', gap: 10, boxShadow: '0 2px 12px rgba(26,25,22,0.06)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#8A8680', whiteSpace: 'nowrap' }}>https://</span>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
            placeholder="votresite.fr"
            disabled={loading}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#1A1916', padding: '9px 0', fontFamily: 'system-ui, sans-serif' }}
          />
          <button onClick={analyze} disabled={loading} style={{ background: '#1A1916', color: '#F7F5F2', border: 'none', padding: '11px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'system-ui, sans-serif', whiteSpace: 'nowrap' }}>
            {loading ? 'Analyse...' : 'Analyser →'}
          </button>
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', marginTop: 10, marginBottom: 60 }}>
          Analyse gratuite · 2 recommandations offertes · Résultats en ~20 secondes
        </p>
      </div>

      {/* SCANNING */}
      {loading && (
        <div style={{ maxWidth: 560, margin: '0 auto 60px', padding: '0 24px' }}>
          <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(26,25,22,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2.5px solid #E5E2DC', borderTopColor: '#D97757', animation: 'spin 0.9s linear infinite', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, textTransform: 'uppercase' }}>Analyse GEO en cours</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1916', marginTop: 2 }}>{url}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ fontSize: 13, fontFamily: 'system-ui, sans-serif', color: i < step ? '#10A37F' : i === step ? '#1A1916' : '#C2BDB8', opacity: i <= step ? 1 : 0.4, transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{i < step ? '✓' : '·'}</span>{s}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div style={{ maxWidth: 560, margin: '0 auto 40px', padding: '0 24px' }}>
          <div style={{ background: 'rgba(217,119,87,0.08)', border: '1px solid rgba(217,119,87,0.3)', borderRadius: 12, padding: '16px 20px', color: '#D97757', fontSize: 13, fontFamily: 'system-ui, sans-serif' }}>
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {result && (
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 60px' }}>

          {/* Score band */}
          <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, overflow: 'hidden', marginBottom: 20, boxShadow: '0 4px 24px rgba(26,25,22,0.07)' }}>
            <div style={{ background: '#1A1916', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 16px' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 60, lineHeight: 1, color: '#F7F5F2', letterSpacing: -2 }}>{result.score}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.4)', letterSpacing: 1 }}>/ 120</div>
              <div style={{ marginTop: 10, fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.1)', color: getGrade(result.score).color }}>
                {getGrade(result.score).label}
              </div>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#D97757', marginBottom: 8 }}>{url}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1916', marginBottom: 10, lineHeight: 1.2 }}>
                {getGrade(result.score).label === 'BON' ? 'Bonne présence IA' : getGrade(result.score).label === 'MOYEN' ? 'Présence IA à améliorer' : 'Présence IA insuffisante'}
              </div>
              <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif' }}>{result.verdict}</div>
            </div>
          </div>

          {/* Criteria */}
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, marginTop: 28 }}>Analyse par critère</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
            {result.criteria.map((c, i) => {
              const level = getLevel(c.score, c.max);
              return (
                <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1916', fontFamily: 'system-ui, sans-serif' }}>{c.name}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 500, color: colors[level] }}>{c.score}/{c.max}</span>
                  </div>
                  <div style={{ height: 3, background: '#E5E2DC', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ height: '100%', width: `${(c.score/c.max)*100}%`, background: colors[level], borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.55, fontFamily: 'system-ui, sans-serif' }}>{c.detail}</div>
                </div>
              );
            })}
          </div>

          {/* RECOMMENDATIONS — 2 free, 3 blurred */}
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Recommandations prioritaires</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.recommendations.map((r, i) => {
              const isLocked = i >= 2;
              return (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{
                    background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12,
                    padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start',
                    filter: isLocked ? 'blur(4px)' : 'none',
                    userSelect: isLocked ? 'none' : 'auto',
                    pointerEvents: isLocked ? 'none' : 'auto',
                  }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', flexShrink: 0, padding: '3px 8px', borderRadius: 5, marginTop: 2, fontWeight: 500, background: tagColors[r.priority].bg, color: tagColors[r.priority].color }}>
                      {tagLabels[r.priority]}
                    </span>
                    <span style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif' }}>{r.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* UNLOCK BANNER */}
          <div style={{ marginTop: 16, background: '#1A1916', borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F7F5F2', marginBottom: 6 }}>
                🔒 3 recommandations critiques masquées
              </div>
              <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.55)', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
                Débloquez le rapport complet pour accéder à toutes vos recommandations prioritaires et un plan d'action détaillé.
              </div>
            </div>
            <a href="/pricing" style={{ background: '#D97757', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif', flexShrink: 0 }}>
              Débloquer — 9€ →
            </a>
          </div>
        </div>
      )}

      {/* FEATURES */}
      {!result && !loading && (
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 100px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 24 }}>Ce qu'on analyse</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {features.map(([icon, name, desc]) => (
              <div key={name} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: '#F0EDE8' }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui, sans-serif' }}>{name}</div>
                </div>
                <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}