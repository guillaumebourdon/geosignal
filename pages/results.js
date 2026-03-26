import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Results() {
  const router = useRouter();
  const { url, email } = router.query;
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const steps = [
    { icon: '🔍', text: 'Récupération du site...' },
    { icon: '🧩', text: 'Analyse des données structurées...' },
    { icon: '💬', text: 'Évaluation de la citabilité...' },
    { icon: '🌐', text: 'Vérification de la présence externe...' },
    { icon: '📊', text: 'Calcul du score GEO...' },
  ];

  useEffect(() => {
    if (!url) return;
    let stepInterval = setInterval(() => {
      setStep(s => s < steps.length - 1 ? s + 1 : s);
    }, 800);

    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
      .then(r => r.json())
      .then(data => {
        clearInterval(stepInterval);
        setStep(steps.length);
        if (data.error) setError(data.error);
        else setResult(data);
      })
      .catch(e => {
        clearInterval(stepInterval);
        setError(e.message);
      });

    return () => clearInterval(stepInterval);
  }, [url]);

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

  const isPaid = false; // TODO: vérifier email dans Redis

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
          <a href="/" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '8px 18px', borderRadius: 8, textDecoration: 'none' }}>Nouvelle analyse</a>
        </div>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* LOADING */}
        {!result && !error && (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#D97757', marginBottom: 12 }}>{url}</div>
              <h1 style={{ fontSize: 28, color: '#1A1916', letterSpacing: -1, marginBottom: 8 }}>Analyse GEO en cours</h1>
              <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui' }}>Patience, on scrute chaque recoin de votre site...</p>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(26,25,22,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #E5E2DC', borderTopColor: '#D97757', animation: 'spin 0.9s linear infinite', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase' }}>En cours</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1916', marginTop: 2 }}>{steps[Math.min(step, steps.length-1)].text}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 3, background: '#E5E2DC', borderRadius: 3, marginBottom: 24, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(step / steps.length) * 100}%`, background: '#D97757', borderRadius: 3, transition: 'width 0.5s ease' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ fontSize: 13, fontFamily: 'system-ui', display: 'flex', alignItems: 'center', gap: 10, color: i < step ? '#10A37F' : i === step ? '#1A1916' : '#C2BDB8', transition: 'all 0.3s' }}>
                    <span style={{ fontSize: 16 }}>{i < step ? '✓' : s.icon}</span>
                    {s.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div style={{ maxWidth: 560, margin: '0 auto', background: 'rgba(217,119,87,0.08)', border: '1px solid rgba(217,119,87,0.3)', borderRadius: 12, padding: '20px 24px', color: '#D97757', fontSize: 13, fontFamily: 'system-ui' }}>
            ⚠️ {error}
            <br /><br />
            <a href="/" style={{ color: '#D97757' }}>← Réessayer</a>
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <>
            {/* Score */}
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
                <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui' }}>{result.verdict}</div>
              </div>
            </div>

            {/* Critères */}
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, marginTop: 28 }}>Analyse par critère</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {result.criteria.map((c, i) => {
                const level = getLevel(c.score, c.max);
                return (
                  <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1916', fontFamily: 'system-ui' }}>{c.name}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 500, color: colors[level] }}>{c.score}/{c.max}</span>
                    </div>
                    <div style={{ height: 3, background: '#E5E2DC', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                      <div style={{ height: '100%', width: `${(c.score/c.max)*100}%`, background: colors[level], borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.55, fontFamily: 'system-ui' }}>{c.detail}</div>
                  </div>
                );
              })}
            </div>

            {/* Recommandations */}
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Recommandations prioritaires</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.recommendations.map((r, i) => {
                const isLocked = !isPaid && i >= 2;
                return (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', filter: isLocked ? 'blur(4px)' : 'none', userSelect: isLocked ? 'none' : 'auto', pointerEvents: isLocked ? 'none' : 'auto' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', flexShrink: 0, padding: '3px 8px', borderRadius: 5, marginTop: 2, fontWeight: 500, background: tagColors[r.priority].bg, color: tagColors[r.priority].color }}>
                        {tagLabels[r.priority]}
                      </span>
                      <span style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui' }}>{r.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Unlock banner */}
            {!isPaid && (
              <div style={{ marginTop: 16, background: '#1A1916', borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                <div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F7F5F2', marginBottom: 6 }}>🔒 3 recommandations critiques masquées</div>
                  <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.55)', fontFamily: 'system-ui', lineHeight: 1.6 }}>
                    Débloquez le rapport complet pour accéder à toutes vos recommandations.
                  </div>
                </div>
                <a href="/pricing" style={{ background: '#D97757', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'system-ui', flexShrink: 0 }}>
                  Débloquer — 9€ →
                </a>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}