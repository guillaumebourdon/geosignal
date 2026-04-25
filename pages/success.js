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

        // Fire-and-forget: one-page analysis in background
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

        <div style={{ maxWidth: 620, margin: '0 auto', padding: '56px 24px 100px' }}>

          {/* ═══ VERIFYING ═══ */}
          {status === 'verifying' && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #E5E2DC', borderTopColor: '#D97757', animation: 'spin 0.9s linear infinite', margin: '0 auto 24px' }} />
              <div style={{ fontSize: 17, color: '#1A1916', marginBottom: 6 }}>Vérification du paiement</div>
              <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui' }}>Un instant...</div>
            </div>
          )}

          {/* ═══ ERROR ═══ */}
          {status === 'error' && (
            <div className="reveal" style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(217,119,87,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              </div>
              <h1 style={{ fontSize: 22, color: '#1A1916', marginBottom: 10 }}>Paiement non vérifié</h1>
              <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 28 }}>
                Nous n'avons pas pu vérifier votre paiement. Si vous avez bien été débité, contactez-nous à <a href="mailto:hello@detekia.fr" style={{ color: '#D97757' }}>hello@detekia.fr</a>
              </p>
              <Link href="/" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Retour à l'accueil</Link>
            </div>
          )}

          {/* ═══ CONFIRMED ═══ */}
          {status === 'confirmed' && (
            <>
              {/* BLOC 1 — Confirmation */}
              <div className="reveal" style={{ textAlign: 'center', marginBottom: 32 }}>
                <div className="scale-in" style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,163,127,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h1 style={{ fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 8, lineHeight: 1.2 }}>Paiement confirmé</h1>
                <p style={{ fontSize: 15, color: '#8A8680', fontFamily: 'system-ui' }}>
                  {isPro ? 'Votre audit complet est lancé' : 'Votre rapport est en cours de génération'}
                </p>
              </div>

              {/* BLOC 2 — Statut */}
              <div className="reveal reveal-d1" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '24px 28px', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div className="pulse-soft" style={{ width: 8, height: 8, borderRadius: '50%', background: '#10A37F', flexShrink: 0 }} />
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#10A37F', letterSpacing: 1.5, textTransform: 'uppercase' }}>Analyse en cours</div>
                </div>
                <div style={{ fontSize: 18, color: '#1A1916', marginBottom: 10, lineHeight: 1.3 }}>
                  {isPro ? 'Votre rapport sera prêt dans 15 à 20 minutes' : 'Votre rapport sera prêt dans 1 à 2 minutes'}
                </div>
                <p style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.65, marginBottom: 0 }}>
                  {isPro
                    ? `Notre IA analyse les 20 pages les plus importantes de votre site. Vous recevrez votre rapport complet par email à ${email} dès qu'il sera prêt.`
                    : `Vous recevrez votre rapport par email à ${email} dès qu'il sera prêt.`
                  }
                </p>
                <div style={{ fontSize: 12, color: '#B0ABA5', fontFamily: 'system-ui', marginTop: 12 }}>
                  Vous pouvez fermer cette page — l'analyse continue en arrière-plan.
                </div>
              </div>

              {/* BLOC 4 — Tips (PRO only) */}
              {isPro && (
                <div className="reveal reveal-d2" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '24px 28px', marginBottom: 24 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Pendant l'attente</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      'Notez les pages les plus stratégiques pour votre business',
                      'Préparez la liste des contenus que vous voulez actualiser',
                      'Identifiez les KPIs de visibilité IA que vous souhaitez suivre',
                    ].map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F7F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 10, color: '#8A8680', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                        <div style={{ fontSize: 13, color: '#3A3835', fontFamily: 'system-ui', lineHeight: 1.5 }}>{tip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BLOC 3 — Articles */}
              <div className={`reveal ${isPro ? 'reveal-d3' : 'reveal-d2'}`} style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>En attendant votre rapport</div>
                <div className="success-articles" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {articles.map((a, i) => (
                    <Link key={i} href={`/blog/${a.slug}`} className="card-interactive" style={{
                      background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '18px 16px',
                      textDecoration: 'none', display: 'block',
                    }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{a.category} · {a.readTime}</div>
                      <div style={{ fontSize: 14, color: '#1A1916', lineHeight: 1.35, marginBottom: 6, fontFamily: 'system-ui', fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.5, fontFamily: 'system-ui' }}>{a.description?.substring(0, 80)}...</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* BLOC 5 — Pas reçu */}
              <div className={`reveal ${isPro ? 'reveal-d4' : 'reveal-d3'}`} style={{ textAlign: 'center', marginBottom: 24 }}>
                <p style={{ fontSize: 12, color: '#B0ABA5', fontFamily: 'system-ui', lineHeight: 1.6 }}>
                  {isPro ? 'Pas reçu après 20 minutes' : 'Pas reçu après 5 minutes'} ? Vérifiez vos spams (expéditeur : <span style={{ fontFamily: 'monospace', fontSize: 11 }}>hello@detekia.fr</span>). Sinon, <a href="mailto:hello@detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>contactez-nous</a>.
                </p>
              </div>

              {/* BLOC 6 — CTA Beeleven */}
              <div className={`reveal ${isPro ? 'reveal-d5' : 'reveal-d4'}`} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '28px 24px', textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: 16, color: '#1A1916', marginBottom: 8 }}>Besoin d'aide pour appliquer les recommandations ?</div>
                <p style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 16, maxWidth: 400, margin: '0 auto 16px' }}>Beeleven, l'agence qui a créé Detekia, peut implémenter les recommandations pour vous.</p>
                <a href="mailto:hello@detekia.fr?subject=Audit GEO — suite du rapport" className="btn-interactive" style={{ display: 'inline-block', background: 'transparent', color: '#D97757', padding: '10px 28px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid #D97757', fontFamily: 'system-ui' }}>
                  Discutons-en →
                </a>
              </div>

              {/* BLOC 7 — Footer actions */}
              <div className={`reveal ${isPro ? 'reveal-d6' : 'reveal-d5'}`} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/" className="btn-interactive" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Retour à l'accueil</Link>
                <Link href="/blog" style={{ display: 'inline-block', background: '#F0EDE8', color: '#1A1916', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Tous nos guides GEO</Link>
              </div>
            </>
          )}
        </div>

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
