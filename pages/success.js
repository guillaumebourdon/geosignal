import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const SECTION_META = [
  { key: 'diagnostic',      icon: '🔍', label: 'Diagnostic' },
  { key: 'whyCritical',     icon: '⚠️', label: 'Pourquoi c\'est critique' },
  { key: 'whatToDo',        icon: '✅', label: 'Ce qu\'il faut faire' },
  { key: 'howToDoIt',       icon: '🛠️', label: 'Comment le faire' },
  { key: 'concreteExample', icon: '💡', label: 'Exemple concret' },
  { key: 'expectedImpact',  icon: '📈', label: 'Impact attendu' },
  { key: 'expertTip',       icon: '🎯', label: 'Tip d\'expert' },
];

const TAG = {
  high:   { bg: 'rgba(217,119,87,0.12)',  color: '#D97757', label: 'Critique' },
  medium: { bg: 'rgba(201,134,26,0.12)',  color: '#C9861A', label: 'Important' },
  low:    { bg: 'rgba(16,163,127,0.12)',  color: '#10A37F', label: 'Bonus' },
};

function getGrade(score) {
  if (score >= 70) return { label: 'BON',    color: '#10A37F' };
  if (score >= 45) return { label: 'MOYEN',  color: '#C9861A' };
  return                  { label: 'FAIBLE', color: '#D97757' };
}

function RecoCard({ r, index }) {
  const tag = TAG[r.priority] || TAG.medium;
  const sections = SECTION_META.filter(s => r[s.key]);

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${tag.color}28`,
      borderLeft: `4px solid ${tag.color}`,
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 14,
    }}>
      {/* Card header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid #F0EDE8',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5,
          textTransform: 'uppercase', padding: '3px 9px', borderRadius: 5,
          fontWeight: 600, background: tag.bg, color: tag.color, flexShrink: 0,
        }}>
          {tag.label}
        </span>
        {r.criterion && (
          <span style={{ fontSize: 11, color: '#8A8680', fontFamily: 'monospace' }}>
            {r.criterion}
          </span>
        )}
        {r.title && (
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginLeft: 4 }}>
            {r.title}
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8', flexShrink: 0 }}>
          #{String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Sections grid */}
      <div style={{
        padding: '16px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 10,
      }}>
        {sections.map(s => (
          <div key={s.key} style={{
            background: '#FAFAF9',
            border: '1px solid #ECEAE6',
            borderRadius: 9,
            padding: '11px 14px',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: '#8A8680',
              fontFamily: 'system-ui', marginBottom: 5,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span>{s.icon}</span>
              <span style={{ letterSpacing: 0.2 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.6, fontFamily: 'system-ui' }}>
              {r[s.key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Success() {
  const router = useRouter();
  const { session_id, url } = router.query;
  const [status, setStatus]       = useState('loading');
  const [email, setEmail]         = useState('');
  const [reportData, setReportData] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!session_id) return;

    fetch(`/api/verify-payment?session_id=${session_id}`)
      .then(r => r.json())
      .then(async data => {
        if (!data.email) { setStatus('error'); return; }
        setEmail(data.email);

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

  const grade = reportData ? getGrade(reportData.score) : null;
  const recos = reportData?.recommendations || [];
  const high   = recos.filter(r => r.priority === 'high');
  const medium = recos.filter(r => r.priority === 'medium');
  const low    = recos.filter(r => r.priority === 'low');

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC',
        background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <a href="/" style={{
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 18,
          fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
            {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c, i) => (
              <div key={i} style={{ background: c, borderRadius: '50%' }} />
            ))}
          </div>
          Detekia
        </a>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 100px' }}>

        {/* ── LOADING ── */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              border: '3px solid #E5E2DC', borderTopColor: '#D97757',
              animation: 'spin 0.9s linear infinite', margin: '0 auto 20px',
            }} />
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1A1916', marginBottom: 8 }}>
              Génération du rapport…
            </div>
            <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui' }}>
              Vérification du paiement et chargement de l'analyse
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {status === 'error' && (
          <div style={{
            maxWidth: 480, margin: '0 auto',
            background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)',
            borderRadius: 16, padding: '40px 32px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 20 }}>⚠️</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 10 }}>
              Une erreur est survenue
            </div>
            <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 28 }}>
              Votre paiement a peut-être bien été effectué.{' '}
              Contactez-nous à{' '}
              <a href="mailto:hello@detekia.fr" style={{ color: '#D97757' }}>hello@detekia.fr</a>
            </div>
            <a href="/" style={{
              display: 'inline-block', background: '#1A1916', color: '#F7F5F2',
              padding: '10px 28px', borderRadius: 9, fontSize: 13,
              fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600,
            }}>
              Retour à l'accueil
            </a>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {status === 'success' && (
          <>

            {/* ── HERO CARD ── */}
            <div style={{
              background: '#1A1916', borderRadius: 20, padding: '36px 44px',
              marginBottom: 20, boxShadow: '0 12px 40px rgba(26,25,22,0.18)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* déco cercle */}
              {grade && (
                <div style={{
                  position: 'absolute', top: -80, right: -80,
                  width: 280, height: 280, borderRadius: '50%',
                  background: grade.color, opacity: 0.06, pointerEvents: 'none',
                }} />
              )}

              {/* Confirmation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(16,163,127,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>✅</div>
                <div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#F7F5F2', marginBottom: 3 }}>
                    Paiement confirmé — Rapport débloqué
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.4)', fontFamily: 'system-ui' }}>
                    {emailSent
                      ? `Rapport complet envoyé à ${email}`
                      : `Préparation du rapport pour ${email}…`}
                  </div>
                </div>
              </div>

              {/* Score + verdict */}
              {reportData && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{
                      fontFamily: 'Georgia, serif', fontSize: 72, lineHeight: 1,
                      color: '#F7F5F2', letterSpacing: -3,
                    }}>
                      {reportData.score}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.3)' }}>/100</div>
                    <div style={{
                      marginTop: 8, display: 'inline-block',
                      background: `${grade.color}22`, border: `1px solid ${grade.color}44`,
                      padding: '3px 12px', borderRadius: 20,
                      fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, color: grade.color,
                    }}>
                      {grade.label}
                    </div>
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', marginBottom: 6 }}>
                      {url}
                    </div>
                    <div style={{ fontSize: 14, color: 'rgba(247,245,242,0.6)', lineHeight: 1.65, fontFamily: 'system-ui', maxWidth: 520 }}>
                      {reportData.verdict}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── EMAIL BADGE ── */}
            {emailSent && (
              <div style={{
                background: '#fff', border: '2px solid #10A37F',
                borderRadius: 16, padding: '28px 24px', marginBottom: 20,
                textAlign: 'center',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(16,163,127,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px', fontSize: 22,
                }}>📧</div>
                <div style={{
                  fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700,
                  color: '#1A1916', marginBottom: 8,
                }}>
                  Votre rapport complet a été envoyé par email
                </div>
                <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', marginBottom: 18 }}>
                  Le rapport PDF détaillé avec toutes vos recommandations a été envoyé à <strong style={{ color: '#1A1916' }}>{email}</strong>
                </div>
                <div style={{
                  background: '#FFF8F0', border: '1px solid #E8C97A',
                  borderRadius: 10, padding: '12px 16px',
                  display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left',
                }}>
                  <span style={{ color: '#C9A84C', fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</span>
                  <div style={{ fontSize: 12, color: '#8A6D20', fontFamily: 'system-ui', lineHeight: 1.5 }}>
                    <strong>Pensez à vérifier vos spams</strong> — l'email peut parfois atterrir dans votre dossier courrier indésirable ou promotions.
                  </div>
                </div>
              </div>
            )}

            {reportData && (
              <>
                {/* ── STRENGTHS + TOP PRIORITY ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                  {/* Points forts */}
                  <div style={{
                    background: 'rgba(16,163,127,0.07)', border: '1px solid rgba(16,163,127,0.18)',
                    borderRadius: 14, padding: '20px 24px',
                  }}>
                    <div style={{
                      fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
                      color: '#10A37F', marginBottom: 12, fontWeight: 600,
                    }}>
                      ✓ Points forts
                    </div>
                    {(reportData.strengths || []).map((s, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: '#1A1916', fontFamily: 'system-ui',
                        lineHeight: 1.6, marginBottom: 6, paddingLeft: 12,
                        borderLeft: '2px solid rgba(16,163,127,0.3)',
                      }}>
                        {s}
                      </div>
                    ))}
                  </div>

                  {/* Priorité absolue */}
                  <div style={{
                    background: 'rgba(217,119,87,0.06)', border: '1.5px solid rgba(217,119,87,0.25)',
                    borderRadius: 14, padding: '20px 24px',
                  }}>
                    <div style={{
                      fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
                      color: '#D97757', marginBottom: 12, fontWeight: 600,
                    }}>
                      🎯 Priorité absolue
                    </div>
                    <div style={{ fontSize: 13, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.65 }}>
                      {reportData.topPriority}
                    </div>
                  </div>
                </div>

                {/* ── SCORE PAR CRITÈRE ── */}
                <div style={{
                  background: '#fff', border: '1px solid #E5E2DC',
                  borderRadius: 14, padding: '20px 24px', marginBottom: 28,
                }}>
                  <div style={{
                    fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
                    color: '#8A8680', marginBottom: 16,
                  }}>
                    Analyse par critère
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(reportData.criteria || []).map((c, i) => {
                      const pct = Math.round((c.score / c.max) * 100);
                      const col = pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757';
                      return (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: '#1A1916', fontFamily: 'system-ui' }}>{c.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{
                                fontFamily: 'monospace', fontSize: 9, padding: '2px 7px',
                                borderRadius: 4, background: col + '18', color: col,
                              }}>
                                {pct >= 75 ? 'BON' : pct >= 45 ? 'MOYEN' : 'FAIBLE'}
                              </span>
                              <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: col }}>
                                {c.score}/{c.max}
                              </span>
                            </div>
                          </div>
                          <div style={{ height: 4, background: '#F0EDE8', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 3, transition: 'width 0.6s ease' }} />
                          </div>
                          {c.detail && (
                            <div style={{ fontSize: 11, color: '#A8A49F', fontFamily: 'system-ui', marginTop: 3 }}>
                              {c.detail}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── RECOMMANDATIONS ── */}
                {recos.length > 0 && (
                  <>
                    <div style={{
                      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                      marginBottom: 16,
                    }}>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                          Plan d'action GEO
                        </div>
                        <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', letterSpacing: -0.5 }}>
                          {recos.length} recommandations expertes
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {high.length > 0   && <span style={{ fontFamily: 'monospace', fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(217,119,87,0.1)', color: '#D97757' }}>{high.length} critiques</span>}
                        {medium.length > 0 && <span style={{ fontFamily: 'monospace', fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(201,134,26,0.1)', color: '#C9861A' }}>{medium.length} importantes</span>}
                        {low.length > 0    && <span style={{ fontFamily: 'monospace', fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(16,163,127,0.1)', color: '#10A37F' }}>{low.length} bonus</span>}
                      </div>
                    </div>

                    {/* Critiques */}
                    {high.length > 0 && (
                      <>
                        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 }}>
                          — Critique
                        </div>
                        {high.map((r, i) => <RecoCard key={i} r={r} index={recos.indexOf(r)} />)}
                      </>
                    )}

                    {/* Importantes */}
                    {medium.length > 0 && (
                      <>
                        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#C9861A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginTop: high.length > 0 ? 20 : 4 }}>
                          — Important
                        </div>
                        {medium.map((r, i) => <RecoCard key={i} r={r} index={recos.indexOf(r)} />)}
                      </>
                    )}

                    {/* Bonus */}
                    {low.length > 0 && (
                      <>
                        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginTop: medium.length > 0 ? 20 : 4 }}>
                          — Bonus
                        </div>
                        {low.map((r, i) => <RecoCard key={i} r={r} index={recos.indexOf(r)} />)}
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {/* ── CTA ── */}
            <div style={{ textAlign: 'center', marginTop: 52 }}>
              <a href="/" style={{
                display: 'inline-block', background: '#1A1916', color: '#F7F5F2',
                padding: '14px 36px', borderRadius: 11, fontSize: 14,
                fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600,
                boxShadow: '0 4px 16px rgba(26,25,22,0.15)',
              }}>
                Analyser un autre site →
              </a>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 600px) {
          nav { padding: 0 20px !important; }
          div[style*="padding: '48px 24px'"] { padding: 24px 16px 80px !important; }
        }
      `}</style>
    </div>
  );
}
