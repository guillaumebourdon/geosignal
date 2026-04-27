import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/Header';
import { getAllArticles } from '../lib/articles';

export default function Success() {
  const router = useRouter();
  const { session_id, url } = router.query;
  const [status, setStatus] = useState('verifying');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('rapport');
  const [siteUrl, setSiteUrl] = useState('');

  const isPro = plan === 'pro';
  const articles = getAllArticles('fr').slice(0, 3);

  useEffect(() => {
    if (!session_id) return;
    fetch(`/api/verify-payment?session_id=${session_id}`)
      .then(r => r.json())
      .then(data => {
        if (!data.success || !data.email) { setStatus('error'); return; }
        setEmail(data.email);
        setPlan(data.plan || 'rapport');
        setSiteUrl(url || data.url || '');
        setStatus('confirmed');

        const reportUrl = url || data.url;
        if (data.plan !== 'pro' && reportUrl) {
          fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: reportUrl, locale: data.locale || 'fr' }),
          }).then(r => r.json()).then(report => {
            if (!report.error) {
              fetch('/api/finalize-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, url: reportUrl, reportData: report, locale: data.locale || 'fr', isFreeViaPromo: data.isFreeViaPromo || false }),
              });
            }
          }).catch(() => {});
        }
      })
      .catch(() => setStatus('error'));
  }, [session_id, url]);

  return (
    <>
      <Head>
        <title>Paiement confirmé | Detekia</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
        <Header variant="minimal" />
      <main>

        {/* ═══ VERIFYING ═══ */}
        {status === 'verifying' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 24 }}>
            <div className="success-spinner" style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #EDE8E0', borderTopColor: '#D97757', marginBottom: 24 }} />
            <div style={{ fontSize: 16, color: '#1A1916', marginBottom: 6 }}>Vérification du paiement</div>
            <div style={{ fontSize: 13, color: '#B0ABA5', fontFamily: 'system-ui' }}>Un instant...</div>
          </div>
        )}

        {/* ═══ ERROR ═══ */}
        {status === 'error' && (
          <div className="reveal" style={{ maxWidth: 440, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(217,119,87,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
            </div>
            <h1 style={{ fontSize: 22, color: '#1A1916', marginBottom: 10 }}>Paiement non vérifié</h1>
            <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 28 }}>
              Si vous avez été débité, contactez-nous à{' '}
              <a href="mailto:hello@detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>hello@detekia.fr</a>
            </p>
            <Link href="/" className="btn-interactive" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Retour à l'accueil</Link>
          </div>
        )}

        {/* ═══ CONFIRMED ═══ */}
        {status === 'confirmed' && (
          <>
            {/* ── HERO DARK ── */}
            <div className="gradient-bg" style={{ padding: '56px 24px 48px', position: 'relative', overflow: 'hidden' }}>
              {/* Ambient glow */}
              <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,163,127,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

              <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                {/* Check */}
                <div className="scale-in" style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(16,163,127,0.1)', border: '1px solid rgba(16,163,127,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>

                <div className="reveal">
                  <h1 style={{ fontSize: 30, color: '#F7F5F2', letterSpacing: -0.8, marginBottom: 8, lineHeight: 1.15 }}>Paiement confirmé</h1>
                  <p style={{ fontSize: 15, color: '#C4B5A3', fontFamily: 'system-ui', marginBottom: 28 }}>
                    {isPro ? 'Votre audit complet est lancé' : 'Votre rapport est en cours de génération'}
                  </p>
                </div>

                {/* Animated divider line */}
                <div className="reveal reveal-d1" style={{ width: 40, height: 1, background: 'rgba(217,119,87,0.4)', margin: '0 auto 28px', borderRadius: 1 }} />

                {/* Status card */}
                <div className="reveal reveal-d1" style={{
                  background: 'rgba(247,245,242,0.04)', border: '1px solid rgba(247,245,242,0.08)',
                  borderRadius: 16, padding: '24px 24px 20px', backdropFilter: 'blur(8px)', textAlign: 'left',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div className="pulse-soft" style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97757', flexShrink: 0 }} />
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase' }}>Analyse en cours</div>
                  </div>

                  <div style={{ fontSize: 19, color: '#F7F5F2', marginBottom: 10, lineHeight: 1.3 }}>
                    {isPro ? 'Votre rapport sera prêt dans 15 à 20 minutes' : 'Votre rapport sera prêt dans 1 à 2 minutes'}
                  </div>

                  <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 0 }}>
                    {isPro
                      ? <>Notre IA analyse les 20 pages les plus importantes de votre site. Rapport envoyé à <strong style={{ color: 'rgba(247,245,242,0.8)' }}>{email}</strong>.</>
                      : <>Rapport envoyé à <strong style={{ color: 'rgba(247,245,242,0.8)' }}>{email}</strong> dès qu'il sera prêt.</>
                    }
                  </p>

                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(247,245,242,0.06)', fontSize: 12, color: 'rgba(247,245,242,0.25)', fontFamily: 'system-ui' }}>
                    Vous pouvez fermer cette page — l'analyse continue en arrière-plan.
                  </div>
                </div>

                {/* ── SPAM NOTICE inside dark hero — prominent ── */}
                <div className="reveal reveal-d2" style={{
                  marginTop: 16, background: 'rgba(217,119,87,0.08)', border: '1px solid rgba(217,119,87,0.15)',
                  borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div className="success-mail-icon" style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(217,119,87,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#F7F5F2', fontFamily: 'system-ui', fontWeight: 600, marginBottom: 2 }}>Pensez à vérifier vos spams</div>
                    <div style={{ fontSize: 11, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui' }}>
                      L'email peut atterrir dans les indésirables. Expéditeur : <span style={{ fontFamily: 'monospace', color: '#D97757' }}>hello@detekia.fr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CTA — above articles ── */}
            <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px 0' }}>
              <div className="reveal reveal-d3 success-cta-grid" style={{ display: 'grid', gridTemplateColumns: isPro ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 40, maxWidth: isPro ? 440 : undefined, margin: isPro ? '0 auto' : undefined }}>

                {/* CTA 1: Accompagnement */}
                <a href="mailto:hello@detekia.fr?subject=Accompagnement GEO — suite du rapport" className="card-interactive" style={{
                  background: '#1A1916', borderRadius: 14, padding: '28px 24px', textDecoration: 'none',
                  display: 'flex', flexDirection: 'column', border: '1px solid rgba(247,245,242,0.08)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                  <div className="success-icon-pop" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(217,119,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div style={{ fontSize: 15, color: '#F7F5F2', fontWeight: 600, fontFamily: 'system-ui', marginBottom: 6 }}>Accompagnement personnalisé</div>
                  <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>Beeleven implémente les recommandations pour vous.</div>
                  <div style={{ marginTop: 14, fontFamily: 'system-ui', fontSize: 13, color: '#D97757', fontWeight: 600 }}>Discutons-en →</div>
                </a>

                {/* CTA 2: Analyser tout le site — one-page only */}
                {!isPro && (
                <Link href="/pricing" className="card-interactive" style={{
                  background: '#fff', borderRadius: 14, padding: '28px 24px', textDecoration: 'none',
                  display: 'flex', flexDirection: 'column', border: '1px solid #EDE8E0',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,163,127,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
                  <div className="success-icon-pop" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,163,127,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  </div>
                  <div style={{ fontSize: 15, color: '#1A1916', fontWeight: 600, fontFamily: 'system-ui', marginBottom: 6 }}>Analyser tout mon site</div>
                  <div style={{ fontSize: 12, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>Audit complet sur 20 pages avec patterns et plan d'action.</div>
                  <div style={{ marginTop: 14, fontFamily: 'system-ui', fontSize: 13, color: '#10A37F', fontWeight: 600 }}>Découvrir l'audit Pro →</div>
                </Link>
                )}

              </div>
            </div>

            {/* ── ARTICLES ── */}
            <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 40px' }}>
              <div className="reveal reveal-d4">
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>En attendant votre rapport</div>
                <div className="success-articles" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {articles.map((a, i) => (
                    <Link key={i} href={`/blog/${a.slug}`} className="card-interactive" style={{
                      background: '#fff', border: '1px solid #EDE8E0', borderRadius: 14, padding: '22px 20px',
                      textDecoration: 'none', display: 'block',
                    }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{a.category} · {a.readTime}</div>
                      <div style={{ fontSize: 14, color: '#1A1916', lineHeight: 1.35, marginBottom: 8, fontFamily: 'system-ui', fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.5, fontFamily: 'system-ui' }}>{a.description?.substring(0, 80)}...</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── FOOTER ACTIONS ── */}
            <div className="reveal reveal-d5" style={{ maxWidth: 520, margin: '0 auto', padding: '8px 24px 80px', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="btn-interactive" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Retour à l'accueil</Link>
              <Link href="/blog" style={{ display: 'inline-block', background: '#EDE8E0', color: '#1A1916', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Voir nos guides</Link>
            </div>
          </>
        )}

      </main>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          * { box-sizing: border-box; margin: 0; padding: 0; }

          .success-spinner { animation: spin 0.8s linear infinite; }

          /* Icon pop-in with stagger */
          .success-icon-pop {
            opacity: 0;
            animation: scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) 0.35s forwards;
          }

          /* Mail icon subtle float */
          .success-mail-icon {
            animation: floatY 3s ease-in-out infinite;
          }
          @keyframes floatY {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }

          @media (max-width: 600px) {
            .success-articles { grid-template-columns: 1fr !important; }
            .success-cta-grid { grid-template-columns: 1fr !important; }
          }

          @media (prefers-reduced-motion: reduce) {
            .success-spinner { animation: none; }
            .success-icon-pop { animation: none; opacity: 1; }
            .success-mail-icon { animation: none; }
          }
        `}</style>
      </div>
    </>
  );
}
