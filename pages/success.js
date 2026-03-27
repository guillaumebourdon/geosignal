import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { session_id, url } = router.query;
  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState('');
  const [reportData, setReportData] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!session_id) return;

    fetch(`/api/verify-payment?session_id=${session_id}`)
      .then(r => r.json())
      .then(async data => {
        if (!data.email) { setStatus('error'); return; }
        setEmail(data.email);

        // url depuis query params ou depuis les metadata Stripe (fallback)
        const reportUrl = url || data.url;

        if (reportUrl) {
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: reportUrl }),
          });
          const report = await res.json();
          if (!report.error) {
            setReportData(report);
            await fetch('/api/generate-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: data.email, url: reportUrl, reportData: report }),
            });
            setEmailSent(true);
          }
        }
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [session_id, url]);

  function getGrade(score) {
    if (score >= 70) return { label: 'BON', color: '#10A37F' };
    if (score >= 45) return { label: 'MOYEN', color: '#C9861A' };
    return { label: 'FAIBLE', color: '#D97757' };
  }

  const tagColors = {
    high:   { bg: 'rgba(217,119,87,0.12)', color: '#D97757' },
    medium: { bg: 'rgba(201,134,26,0.12)', color: '#C9861A' },
    low:    { bg: 'rgba(16,163,127,0.12)', color: '#10A37F' },
  };
  const tagLabels = { high: 'Critique', medium: 'Important', low: 'Bonus' };

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
            {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
              <div key={i} style={{ background: c, borderRadius: '50%' }} />
            ))}
          </div>
          Detekia
        </a>
      </nav>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 100px' }}>

        {/* LOADING */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E5E2DC', borderTopColor: '#D97757', animation: 'spin 0.9s linear infinite', margin: '0 auto 24px' }} />
            <p style={{ color: '#8A8680', fontFamily: 'system-ui', fontSize: 14 }}>Vérification du paiement et génération du rapport...</p>
          </div>
        )}

        {/* ERROR */}
        {status === 'error' && (
          <div style={{ maxWidth: 480, margin: '0 auto', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 16, padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1916', marginBottom: 8 }}>Une erreur est survenue</div>
            <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 24 }}>
              Votre paiement a peut-être bien été effectué. Contactez-nous à <a href="mailto:hello@detekia.fr" style={{ color: '#D97757' }}>hello@detekia.fr</a>
            </div>
            <a href="/" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', textDecoration: 'none' }}>Retour à l'accueil</a>
          </div>
        )}

        {/* SUCCESS */}
        {status === 'success' && (
          <>
            {/* Header succès */}
            <div style={{ background: '#1A1916', borderRadius: 20, padding: '32px 40px', marginBottom: 24, boxShadow: '0 8px 32px rgba(26,25,22,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,163,127,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>✅</div>
                <div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F7F5F2', marginBottom: 4 }}>Paiement confirmé — Rapport débloqué !</div>
                  <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui' }}>
                    {emailSent ? `Rapport complet envoyé à ${email}` : `Préparation du rapport pour ${email}...`}
                  </div>
                </div>
              </div>

              {reportData && (
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 44, color: '#F7F5F2', letterSpacing: -2, lineHeight: 1 }}>{reportData.score}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.3)' }}>/100</div>
                    <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 8, letterSpacing: 1, padding: '2px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', color: getGrade(reportData.score).color }}>
                      {getGrade(reportData.score).label}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', marginBottom: 4 }}>{url}</div>
                    <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.55)', lineHeight: 1.6, fontFamily: 'system-ui' }}>{reportData.verdict}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Email badge */}
            {emailSent && (
              <div style={{ background: 'rgba(16,163,127,0.08)', border: '1px solid rgba(16,163,127,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>📧</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#10A37F', fontFamily: 'system-ui', marginBottom: 2 }}>Rapport envoyé par email</div>
                  <div style={{ fontSize: 12, color: '#8A8680', fontFamily: 'system-ui' }}>Le rapport HTML complet a été envoyé à <strong>{email}</strong></div>
                </div>
              </div>
            )}

            {/* Priorité absolue */}
            {reportData?.topPriority && (
              <div style={{ background: '#fff', border: '1.5px solid #D97757', borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>🎯 Priorité absolue</div>
                <div style={{ fontSize: 14, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.7 }}>{reportData.topPriority}</div>
              </div>
            )}

            {/* Toutes les recommandations débloquées */}
            {reportData?.recommendations && (
              <>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                  Plan d'action complet — {reportData.recommendations.length} recommandations
                </div>

                {reportData.recommendations.map((r, i) => {
                  const tag = tagColors[r.priority] || tagColors.medium;
                  const sections = [];
                  if (r.diagnostic) sections.push({ icon: '🔍', title: 'Diagnostic', content: r.diagnostic });
                  if (r.whyCritical) sections.push({ icon: '⚠️', title: 'Pourquoi c\'est critique', content: r.whyCritical });
                  if (r.whatToDo) sections.push({ icon: '✅', title: 'Ce qu\'il faut faire', content: r.whatToDo });
                  if (r.howToDoIt) sections.push({ icon: '🛠️', title: 'Comment le faire', content: r.howToDoIt });
                  if (r.concreteExample) sections.push({ icon: '💡', title: 'Exemple concret', content: r.concreteExample });
                  if (r.expectedImpact) sections.push({ icon: '📈', title: 'Impact attendu', content: r.expectedImpact });
                  if (r.expertTip) sections.push({ icon: '🎯', title: 'Tip d\'expert', content: r.expertTip });
                  if (sections.length === 0 && r.text) sections.push({ icon: '✅', title: 'Recommandation', content: r.text });

                  return (
                    <div key={i} style={{ background: '#fff', border: `1px solid ${tag.color}40`, borderRadius: 14, overflow: 'hidden', marginBottom: 16, borderLeft: `4px solid ${tag.color}` }}>
                      {/* Header */}
                      <div style={{ padding: '16px 24px 14px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 6, fontWeight: 500, background: tag.bg, color: tag.color }}>
                          {tagLabels[r.priority]}
                        </span>
                        {r.criterion && <span style={{ fontSize: 11, color: '#8A8680', fontFamily: 'monospace' }}>{r.criterion}</span>}
                        {r.title && <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui' }}>{r.title}</span>}
                        <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8', marginLeft: r.title ? 8 : 'auto' }}>#{String(i + 1).padStart(2, '0')}</span>
                      </div>

                      {/* Sections */}
                      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {sections.map((s, j) => (
                          <div key={j} style={{ background: '#FAFAF9', borderRadius: 8, padding: '14px 16px', border: '1px solid #E5E2DC' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1916', marginBottom: 6, fontFamily: 'system-ui' }}>{s.icon} {s.title}</div>
                            <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.75, fontFamily: 'system-ui', whiteSpace: 'pre-wrap' }}>{s.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* CTA retour */}
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <a href="/" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>
                Analyser un autre site →
              </a>
            </div>
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
