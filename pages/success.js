import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';

function RecoCard({ r, index, t }) {
  const priorities = t('common.priorities');
  const recoSections = t('common.recoSections');
  const ci = t('results.criteriaInfo');
  const tag = {
    high:   { bg: 'rgba(217,119,87,0.12)',  color: '#D97757' },
    medium: { bg: 'rgba(201,134,26,0.12)',  color: '#C9861A' },
    low:    { bg: 'rgba(16,163,127,0.12)',  color: '#10A37F' },
  }[r.priority] || { bg: 'rgba(201,134,26,0.12)', color: '#C9861A' };
  const sections = recoSections.filter(s => r[s.key]);

  return (
    <div style={{ background: '#fff', border: `1px solid ${tag.color}28`, borderLeft: `4px solid ${tag.color}`, borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 5, fontWeight: 600, background: tag.bg, color: tag.color, flexShrink: 0 }}>{priorities[r.priority] || priorities.medium}</span>
        {r.criterion && <span style={{ fontSize: 11, color: '#8A8680', fontFamily: 'monospace' }}>{ci[r.criterion]?.title || r.criterion}</span>}
        {r.title && <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginLeft: 4 }}>{r.title}</span>}
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8', flexShrink: 0 }}>#{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {sections.map(s => (
          <div key={s.key} style={{ background: '#FAFAF9', border: '1px solid #ECEAE6', borderRadius: 9, padding: '11px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#8A8680', fontFamily: 'system-ui', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>{s.icon}</span><span style={{ letterSpacing: 0.2 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.6, fontFamily: 'system-ui' }}>{r[s.key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Success() {
  const router = useRouter();
  const { session_id, url } = router.query;
  const { t } = useTranslation();
  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState('');
  const [reportData, setReportData] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const grades = t('common.grades');
  const priorities = t('common.priorities');
  const criteriaInfo = t('results.criteriaInfo');

  function getGrade(score) {
    if (score >= 70) return { label: grades.good, color: '#10A37F' };
    if (score >= 45) return { label: grades.average, color: '#C9861A' };
    return { label: grades.poor, color: '#D97757' };
  }

  useEffect(() => {
    if (!session_id) return;
    fetch(`/api/verify-payment?session_id=${session_id}`)
      .then(r => r.json())
      .then(async data => {
        if (!data.email) { setStatus('error'); return; }
        setEmail(data.email);
        const reportLocale = data.locale || locale;
        const reportUrl = url || data.url;
        if (reportUrl) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 90000);
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: reportUrl, locale: reportLocale }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          const report = await res.json();
          if (!report.error) {
            setReportData(report);
            await fetch('/api/generate-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: data.email, url: reportUrl, reportData: report, locale: reportLocale }),
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
  const high = recos.filter(r => r.priority === 'high');
  const medium = recos.filter(r => r.priority === 'medium');
  const low = recos.filter(r => r.priority === 'low');

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      <Header variant="minimal" />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 100px' }}>

        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #E5E2DC', borderTopColor: '#D97757', animation: 'spin 0.9s linear infinite', margin: '0 auto 20px' }} />
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1A1916', marginBottom: 8 }}>{t('success.loading.title')}</div>
            <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui' }}>{t('success.loading.subtitle')}</div>
          </div>
        )}

        {status === 'error' && (
          <div style={{ maxWidth: 480, margin: '0 auto', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 20 }}>⚠️</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 10 }}>{t('success.error.title')}</div>
            <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 28 }}>
              {t('success.error.desc')}{' '}
              <a href="mailto:hello@detekia.fr" style={{ color: '#D97757' }}>hello@detekia.fr</a>
            </div>
            <Link href="/" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '10px 28px', borderRadius: 9, fontSize: 13, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>{t('success.error.cta')}</Link>
          </div>
        )}

        {status === 'success' && (
          <>
            <div style={{ background: '#1A1916', borderRadius: 20, padding: '36px 44px', marginBottom: 20, boxShadow: '0 12px 40px rgba(26,25,22,0.18)', position: 'relative', overflow: 'hidden' }}>
              {grade && <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: grade.color, opacity: 0.06, pointerEvents: 'none' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16,163,127,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>✅</div>
                <div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#F7F5F2', marginBottom: 3 }}>{t('success.hero.title')}</div>
                  <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.4)', fontFamily: 'system-ui' }}>
                    {emailSent ? t('success.hero.emailSent').replace('{email}', email) : t('success.hero.emailPreparing').replace('{email}', email)}
                  </div>
                </div>
              </div>
              {reportData && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 72, lineHeight: 1, color: '#F7F5F2', letterSpacing: -3 }}>{reportData.score}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.3)' }}>/100</div>
                    <div style={{ marginTop: 8, display: 'inline-block', background: `${grade.color}22`, border: `1px solid ${grade.color}44`, padding: '3px 12px', borderRadius: 20, fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, color: grade.color }}>{grade.label}</div>
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', marginBottom: 6 }}>{url}</div>
                    <div style={{ fontSize: 14, color: 'rgba(247,245,242,0.6)', lineHeight: 1.65, fontFamily: 'system-ui', maxWidth: 520 }}>{reportData.verdict}</div>
                  </div>
                </div>
              )}
            </div>

            {emailSent && (
              <div style={{ background: '#fff', border: '2px solid #10A37F', borderRadius: 16, padding: '28px 24px', marginBottom: 20, textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,163,127,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22 }}>📧</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#1A1916', marginBottom: 8 }}>{t('success.emailBadge.title')}</div>
                <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', marginBottom: 18 }}>
                  {t('success.emailBadge.desc')} <strong style={{ color: '#1A1916' }}>{email}</strong>
                </div>
                <div style={{ background: '#FFF8F0', border: '1px solid #E8C97A', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left' }}>
                  <span style={{ color: '#C9A84C', fontSize: 18, lineHeight: 1, flexShrink: 0 }}>⚠️</span>
                  <div style={{ fontSize: 12, color: '#8A6D20', fontFamily: 'system-ui', lineHeight: 1.5 }}>
                    <strong>{t('success.emailBadge.spamBold')}</strong> {t('success.emailBadge.spamText')}
                  </div>
                </div>
              </div>
            )}

            {reportData && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                  <div style={{ background: 'rgba(16,163,127,0.07)', border: '1px solid rgba(16,163,127,0.18)', borderRadius: 14, padding: '20px 24px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#10A37F', marginBottom: 12, fontWeight: 600 }}>{t('success.strengths')}</div>
                    {(reportData.strengths || []).map((s, i) => (
                      <div key={i} style={{ fontSize: 13, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid rgba(16,163,127,0.3)' }}>{s}</div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(217,119,87,0.06)', border: '1.5px solid rgba(217,119,87,0.25)', borderRadius: 14, padding: '20px 24px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#D97757', marginBottom: 12, fontWeight: 600 }}>{t('success.topPriority')}</div>
                    <div style={{ fontSize: 13, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.65 }}>{reportData.topPriority}</div>
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '20px 24px', marginBottom: 28 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#8A8680', marginBottom: 16 }}>{t('success.criteriaAnalysis')}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(reportData.criteria || []).map((c, i) => {
                      const pct = Math.round((c.score / c.max) * 100);
                      const col = pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757';
                      const gradeLabel = pct >= 75 ? grades.good : pct >= 45 ? grades.average : grades.poor;
                      return (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: '#1A1916', fontFamily: 'system-ui' }}>{criteriaInfo[c.name]?.title || c.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 7px', borderRadius: 4, background: col + '18', color: col }}>{gradeLabel}</span>
                              <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: col }}>{c.score}/{c.max}</span>
                            </div>
                          </div>
                          <div style={{ height: 4, background: '#F0EDE8', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 3, transition: 'width 0.6s ease' }} />
                          </div>
                          {c.detail && <div style={{ fontSize: 11, color: '#A8A49F', fontFamily: 'system-ui', marginTop: 3 }}>{c.detail}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {recos.length > 0 && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{t('success.recos.label')}</div>
                        <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', letterSpacing: -0.5 }}>{t('success.recos.title').replace('{count}', recos.length)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {high.length > 0 && <span style={{ fontFamily: 'monospace', fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(217,119,87,0.1)', color: '#D97757' }}>{t('success.recos.countCritical').replace('{count}', high.length)}</span>}
                        {medium.length > 0 && <span style={{ fontFamily: 'monospace', fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(201,134,26,0.1)', color: '#C9861A' }}>{t('success.recos.countImportant').replace('{count}', medium.length)}</span>}
                        {low.length > 0 && <span style={{ fontFamily: 'monospace', fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(16,163,127,0.1)', color: '#10A37F' }}>{t('success.recos.countBonus').replace('{count}', low.length)}</span>}
                      </div>
                    </div>
                    {high.length > 0 && (
                      <>
                        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 }}>{t('success.recos.criticalLabel')}</div>
                        {high.map((r, i) => <RecoCard key={i} r={r} index={recos.indexOf(r)} t={t} />)}
                      </>
                    )}
                    {medium.length > 0 && (
                      <>
                        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#C9861A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginTop: high.length > 0 ? 20 : 4 }}>{t('success.recos.importantLabel')}</div>
                        {medium.map((r, i) => <RecoCard key={i} r={r} index={recos.indexOf(r)} t={t} />)}
                      </>
                    )}
                    {low.length > 0 && (
                      <>
                        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginTop: medium.length > 0 ? 20 : 4 }}>{t('success.recos.bonusLabel')}</div>
                        {low.map((r, i) => <RecoCard key={i} r={r} index={recos.indexOf(r)} t={t} />)}
                      </>
                    )}
                  </>
                )}
              </>
            )}

            <div style={{ textAlign: 'center', marginTop: 52 }}>
              <Link href="/" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '14px 36px', borderRadius: 11, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600, boxShadow: '0 4px 16px rgba(26,25,22,0.15)' }}>{t('success.cta')}</Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 600px) {
          nav { padding: 0 20px !important; }
        }
      `}</style>
    </div>
  );
}
