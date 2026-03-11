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

        <p style={{ fontSize: 16, color: '#8A8680', maxWidth: 480, margin: '0 auto 16px', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif' }}>
          GeoSignal analyse votre présence sur les 4 grands moteurs d'IA et vous donne un score GEO avec les actions concrètes pour progresser.
        </p>
        <p style={{ fontSize: 13, color: '#10A37F', fontFamily: 'monospace', marginBottom: 36 }}>
          + de 500 sites analysés · Score GEO sur 120 · Recommandations IA
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
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', marginTop: 10, marginBottom: 80 }}>
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

          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Recommandations prioritaires</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.recommendations.map((r, i) => {
              const isLocked = i >= 2;
              return (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', filter: isLocked ? 'blur(4px)' : 'none', userSelect: isLocked ? 'none' : 'auto', pointerEvents: isLocked ? 'none' : 'auto' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', flexShrink: 0, padding: '3px 8px', borderRadius: 5, marginTop: 2, fontWeight: 500, background: tagColors[r.priority].bg, color: tagColors[r.priority].color }}>
                      {tagLabels[r.priority]}
                    </span>
                    <span style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif' }}>{r.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, background: '#1A1916', borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F7F5F2', marginBottom: 6 }}>🔒 3 recommandations critiques masquées</div>
              <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.55)', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
                Débloquez le rapport complet pour accéder à toutes vos recommandations prioritaires.
              </div>
            </div>
            <a href="/pricing" style={{ background: '#D97757', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif', flexShrink: 0 }}>
              Débloquer — 9€ →
            </a>
          </div>
        </div>
      )}

      {/* COMMENT CA MARCHE */}
      {!result && !loading && (
        <>
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Comment ça marche</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
              Un audit GEO complet en <em style={{ color: '#D97757' }}>20 secondes</em>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {[
                ['01', '#10A37F', 'Entrez votre URL', 'Collez l\'adresse de votre site dans la barre d\'analyse. Pas d\'inscription, pas de configuration.'],
                ['02', '#D97757', 'On analyse tout', 'GeoSignal scrape votre site, vérifie vos données structurées, et soumet votre contenu à notre IA spécialisée GEO.'],
                ['03', '#4285F4', 'Recevez votre score', 'Un score sur 120, une analyse par critère, et des recommandations concrètes priorisées par impact.'],
              ].map(([num, color, title, desc]) => (
                <div key={num} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24 }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color, marginBottom: 16, letterSpacing: -1 }}>{num}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui, sans-serif' }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div style={{ background: '#1A1916', padding: '60px 24px', marginBottom: 80 }}>
            <div style={{ maxWidth: 780, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, textAlign: 'center' }}>
              {[
                ['94%', 'des sites analysés ont un score GEO inférieur à 60/120'],
                ['6', 'critères analysés en profondeur par notre IA'],
                ['20s', 'en moyenne pour obtenir un rapport complet'],
                ['4', 'moteurs IA couverts : ChatGPT, Claude, Gemini, Perplexity'],
              ].map(([stat, desc]) => (
                <div key={stat}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#D97757', letterSpacing: -1, marginBottom: 8 }}>{stat}</div>
                  <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TÉMOIGNAGES */}
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Ils ont testé GeoSignal</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
              Ce qu'ils en <em style={{ color: '#D97757' }}>pensent</em>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {[
                ['Sophie M.', 'Responsable marketing', '#10A37F', "J'avais optimisé mon site pour Google mais jamais pour les IA. GeoSignal m'a révélé des angles morts que je n'aurais jamais vus seule."],
                ['Thomas L.', 'Consultant SEO', '#D97757', "Un outil indispensable à ajouter à ma boîte à outils. Mes clients commencent tous à me demander leur score GEO."],
                ['Marie D.', 'Fondatrice e-commerce', '#4285F4', "En 20 minutes j'avais implémenté les 3 premières recommandations. Mon site est déjà cité par Perplexity une semaine après."],
              ].map(([name, role, color, quote]) => (
                <div key={name} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24 }}>
                  <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif', marginBottom: 20, fontStyle: 'italic' }}>"{quote}"</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: 'system-ui, sans-serif' }}>
                      {name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui, sans-serif' }}>{name}</div>
                      <div style={{ fontSize: 11, color: '#8A8680', fontFamily: 'system-ui, sans-serif' }}>{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 24px 80px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
              Questions <em style={{ color: '#D97757' }}>fréquentes</em>
            </h2>
            {[
              ["C'est quoi le GEO exactement ?", "Le GEO (Generative Engine Optimization) est l'art d'optimiser votre site pour apparaître dans les réponses des IA. Quand quelqu'un demande à ChatGPT ou Perplexity une recommandation dans votre domaine, est-ce que votre site est cité ? C'est ce que mesure GeoSignal."],
              ["En quoi c'est différent du SEO ?", "Le SEO optimise pour les moteurs de recherche traditionnels (Google, Bing). Le GEO optimise pour les IA génératives. Les critères sont différents : les IA valorisent la clarté, la citabilité, et les données structurées plutôt que les backlinks et la vitesse de chargement."],
              ["Mon score peut-il vraiment s'améliorer ?", "Oui, et rapidement. La plupart des recommandations GeoSignal peuvent être implémentées en quelques heures. Des clients ont vu leur score progresser de 20+ points en une semaine après avoir suivi notre plan d'action."],
              ["Combien coûte une analyse complète ?", "L'analyse de base est gratuite et inclut votre score et 2 recommandations. Le rapport complet avec les 5 recommandations et le plan d'action est disponible à 9€. L'abonnement Pro à 29€/mois offre des analyses illimitées."],
            ].map(([q, a], i) => (
              <div key={i} style={{ borderBottom: '1px solid #E5E2DC', padding: '20px 0' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui, sans-serif' }}>{q}</div>
                <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif' }}>{a}</div>
              </div>
            ))}
          </div>

          {/* CTA FINAL */}
          <div style={{ background: '#1A1916', padding: '80px 24px', textAlign: 'center', marginBottom: 0 }}>
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#F7F5F2', letterSpacing: -1, marginBottom: 16, lineHeight: 1.1 }}>
                Prêt à découvrir votre<br /><em style={{ color: '#D97757' }}>score GEO ?</em>
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(247,245,242,0.55)', fontFamily: 'system-ui, sans-serif', marginBottom: 32, lineHeight: 1.6 }}>
                Analyse gratuite en 20 secondes. Aucune inscription requise.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(247,245,242,0.08)', border: '1px solid rgba(247,245,242,0.15)', borderRadius: 14, padding: '6px 6px 6px 20px', maxWidth: 480, margin: '0 auto', gap: 10 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(247,245,242,0.4)', whiteSpace: 'nowrap' }}>https://</span>
                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && analyze()}
                  placeholder="votresite.fr"
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#F7F5F2', padding: '9px 0', fontFamily: 'system-ui, sans-serif' }}
                />
                <button onClick={analyze} style={{ background: '#D97757', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', whiteSpace: 'nowrap' }}>
                  Analyser →
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #E5E2DC', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
            {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
              <div key={i} style={{ background: c, borderRadius: '50%' }} />
            ))}
          </div>
          GeoSignal
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/pricing" style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui, sans-serif' }}>Tarifs</a>
          <a href="/contact" style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui, sans-serif' }}>Contact</a>
          <a href="/legal" style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui, sans-serif' }}>Mentions légales</a>
          <a href="/legal" style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui, sans-serif' }}>Confidentialité</a>
          <a href="/legal" style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui, sans-serif' }}>CGU</a>
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}