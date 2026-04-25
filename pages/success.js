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

        {/* ═══ VERIFYING ═══ */}
        {status === 'verifying' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #EDE8E0', borderTopColor: '#D97757', animation: 'spin 0.8s linear infinite', marginBottom: 24 }} />
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
            {/* ── HERO: dark block, full width ── */}
            <div className="gradient-bg" style={{ padding: '64px 24px 56px', position: 'relative', overflow: 'hidden' }}>
              {/* Radial glow behind check */}
              <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,163,127,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

              <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                {/* Check icon */}
                <div className="scale-in" style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,163,127,0.1)', border: '1px solid rgba(16,163,127,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>

                {/* Title */}
                <div className="reveal">
                  <h1 style={{ fontSize: 32, color: '#F7F5F2', letterSpacing: -1, marginBottom: 8, lineHeight: 1.15 }}>Paiement confirmé</h1>
                  <p style={{ fontSize: 15, color: '#C4B5A3', fontFamily: 'system-ui', marginBottom: 32 }}>
                    {isPro ? 'Votre audit complet est lancé' : 'Votre rapport est en cours de génération'}
                  </p>
                </div>

                {/* Status card — glass effect on dark */}
                <div className="reveal reveal-d1" style={{
                  background: 'rgba(247,245,242,0.04)',
                  border: '1px solid rgba(247,245,242,0.08)',
                  borderRadius: 16,
                  padding: '28px 28px 24px',
                  backdropFilter: 'blur(8px)',
                  textAlign: 'left',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div className="pulse-soft" style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97757', flexShrink: 0 }} />
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase' }}>Analyse en cours</div>
                  </div>

                  <div style={{ fontSize: 20, color: '#F7F5F2', marginBottom: 12, lineHeight: 1.3 }}>
                    {isPro ? 'Votre rapport sera prêt dans 15 à 20 minutes' : 'Votre rapport sera prêt dans 1 à 2 minutes'}
                  </div>

                  <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.55)', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 0 }}>
                    {isPro
                      ? <>Notre IA analyse les 20 pages les plus importantes de votre site. Vous recevrez votre rapport par email à <strong style={{ color: 'rgba(247,245,242,0.8)' }}>{email}</strong> dès qu'il sera prêt.</>
                      : <>Vous recevrez votre rapport par email à <strong style={{ color: 'rgba(247,245,242,0.8)' }}>{email}</strong> dès qu'il sera prêt.</>
                    }
                  </p>

                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(247,245,242,0.06)', fontSize: 12, color: 'rgba(247,245,242,0.3)', fontFamily: 'system-ui' }}>
                    Vous pouvez fermer cette page — l'analyse continue en arrière-plan.
                  </div>
                </div>
              </div>
            </div>

            {/* ── SPAM NOTICE: warm peach strip ── */}
            <div className="reveal reveal-d2" style={{ background: '#FDF1EA', padding: '14px 24px' }}>
              <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <p style={{ fontSize: 12, color: '#8A6D20', fontFamily: 'system-ui', lineHeight: 1.5, margin: 0 }}>
                  Pensez à vérifier vos spams — expéditeur : <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757' }}>hello@detekia.fr</span>
                </p>
              </div>
            </div>

            {/* ── ARTICLES: warm ivory section ── */}
            <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 40px' }}>
              <div className="reveal reveal-d3" style={{ marginBottom: 40 }}>
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

            {/* ── CTA BEELEVEN: dark block ── */}
            <div className="reveal reveal-d4 gradient-bg" style={{ padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
              {/* Orange glow */}
              <div style={{ position: 'absolute', bottom: -40, right: '20%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

              <div style={{ maxWidth: 440, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Aller plus loin</div>
                <h3 style={{ fontSize: 20, color: '#F7F5F2', marginBottom: 10, lineHeight: 1.3, letterSpacing: -0.3 }}>Besoin d'aide pour appliquer les recommandations ?</h3>
                <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.65, marginBottom: 24 }}>Beeleven, l'agence derrière Detekia, peut implémenter les optimisations pour vous.</p>
                <a href="mailto:hello@detekia.fr?subject=Audit GEO — suite du rapport" className="btn-interactive" style={{
                  display: 'inline-block', background: '#D97757', color: '#fff',
                  padding: '14px 36px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  textDecoration: 'none', fontFamily: 'system-ui',
                }}>
                  Discutons-en →
                </a>
              </div>
            </div>

            {/* ── FOOTER ACTIONS ── */}
            <div className="reveal reveal-d5" style={{ maxWidth: 520, margin: '0 auto', padding: '32px 24px 80px', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="btn-interactive" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Retour à l'accueil</Link>
              <Link href="/blog" style={{ display: 'inline-block', background: '#EDE8E0', color: '#1A1916', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Voir nos guides</Link>
            </div>
          </>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @media (max-width: 600px) {
            .success-articles { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </>
  );
}
