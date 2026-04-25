import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/Header';

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;
  const [status, setStatus] = useState('verifying'); // verifying → confirmed → error
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('rapport');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!session_id) return;

    fetch(`/api/verify-payment?session_id=${session_id}`)
      .then(r => r.json())
      .then(data => {
        if (!data.success || !data.email) {
          setStatus('error');
          return;
        }
        setEmail(data.email);
        setPlan(data.plan || 'rapport');
        setUrl(data.url || '');
        setStatus('confirmed');

        // Fire-and-forget: trigger one-page analysis in background
        // Pro is already triggered by the Stripe webhook → pro-enqueue
        if (data.plan !== 'pro' && data.url) {
          fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: data.url, locale: data.locale || 'fr' }),
          }).then(r => r.json()).then(report => {
            if (!report.error) {
              fetch('/api/finalize-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: data.email, url: data.url, reportData: report,
                  locale: data.locale || 'fr', isFreeViaPromo: data.isFreeViaPromo || false,
                }),
              });
            }
          }).catch(() => {});
        }
      })
      .catch(() => setStatus('error'));
  }, [session_id]);

  const isPro = plan === 'pro';

  return (
    <>
      <Head>
        <title>{isPro ? 'Audit lancé' : 'Paiement confirmé'} | Detekia</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
        <Header variant="minimal" />

        <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 24px 100px' }}>

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
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(217,119,87,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              </div>
              <h1 style={{ fontSize: 22, color: '#1A1916', marginBottom: 10 }}>Paiement non vérifié</h1>
              <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 28 }}>
                Nous n'avons pas pu vérifier votre paiement. Si vous avez bien été débité,
                contactez-nous et nous résoudrons le problème sous 24h.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="mailto:hello@detekia.fr?subject=Problème paiement Detekia" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Contacter le support</a>
                <Link href="/" style={{ display: 'inline-block', background: '#F0EDE8', color: '#1A1916', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Retour à l'accueil</Link>
              </div>
            </div>
          )}

          {/* ═══ CONFIRMED — ONE-PAGE ═══ */}
          {status === 'confirmed' && !isPro && (
            <div style={{ textAlign: 'center' }}>
              {/* Checkmark */}
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,163,127,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>

              <h1 style={{ fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 10, lineHeight: 1.2 }}>
                Paiement confirmé
              </h1>
              <p style={{ fontSize: 15, color: '#3A3835', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 8 }}>
                Votre rapport GEO pour <strong style={{ color: '#1A1916' }}>{url}</strong> est en cours de génération.
              </p>
              <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 32 }}>
                Vous le recevrez dans 1 à 2 minutes à l'adresse <strong style={{ color: '#1A1916' }}>{email}</strong>.
              </p>

              {/* Info cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32, textAlign: 'left' }}>
                <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Livraison</div>
                  <div style={{ fontSize: 13, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.5 }}>
                    Un email avec le lien vers votre rapport complet. Accessible pour toujours, PDF téléchargeable.
                  </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Pas reçu ?</div>
                  <div style={{ fontSize: 13, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.5 }}>
                    Vérifiez vos spams. L'email vient de <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#D97757' }}>hello@detekia.fr</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#B0ABA5', fontFamily: 'system-ui', marginBottom: 32 }}>
                Vous pouvez fermer cette page. Votre rapport arrivera par email.
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/blog" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Lire nos guides GEO</Link>
                <Link href="/" style={{ display: 'inline-block', background: '#F0EDE8', color: '#1A1916', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Retour à l'accueil</Link>
              </div>
            </div>
          )}

          {/* ═══ CONFIRMED — PRO ═══ */}
          {status === 'confirmed' && isPro && (
            <div style={{ textAlign: 'center' }}>
              {/* Checkmark */}
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,163,127,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>

              <h1 style={{ fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 10, lineHeight: 1.2 }}>
                Audit lancé
              </h1>
              <p style={{ fontSize: 15, color: '#3A3835', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 8 }}>
                L'analyse complète de <strong style={{ color: '#1A1916' }}>{url}</strong> vient de démarrer.
              </p>
              <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 32 }}>
                20 pages de votre site sont en cours d'analyse. Votre rapport sera prêt dans environ 10 à 15 minutes et envoyé à <strong style={{ color: '#1A1916' }}>{email}</strong>.
              </p>

              {/* What's happening */}
              <div style={{ background: '#1A1916', borderRadius: 14, padding: '24px 28px', marginBottom: 24, textAlign: 'left' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>En ce moment</div>
                {[
                  { step: '1', label: 'Identification des 20 pages prioritaires', detail: 'Analyse du sitemap et de l\'architecture' },
                  { step: '2', label: 'Analyse page par page', detail: 'Scoring des 8 critères GEO sur chaque URL' },
                  { step: '3', label: 'Consolidation et patterns', detail: 'Détection des tendances transverses' },
                  { step: '4', label: 'Génération du rapport', detail: 'Plan d\'action priorisé et envoi par email' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 3 ? 14 : 0 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(247,245,242,0.06)', border: '1px solid rgba(247,245,242,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.4)', flexShrink: 0 }}>{s.step}</div>
                    <div>
                      <div style={{ fontSize: 13, color: '#F7F5F2', fontFamily: 'system-ui', marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: 'rgba(247,245,242,0.4)', fontFamily: 'system-ui' }}>{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32, textAlign: 'left' }}>
                <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Livraison</div>
                  <div style={{ fontSize: 13, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.5 }}>
                    Un email avec le lien vers votre rapport complet. 20 pages analysées, patterns détectés, plan d'action priorisé.
                  </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Pas reçu après 20 min ?</div>
                  <div style={{ fontSize: 13, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.5 }}>
                    Vérifiez vos spams. Sinon, écrivez à <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#D97757' }}>hello@detekia.fr</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#B0ABA5', fontFamily: 'system-ui', marginBottom: 32 }}>
                Vous pouvez fermer cette page. L'analyse continue en arrière-plan et votre rapport sera envoyé par email dès qu'il sera prêt.
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/blog" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Lire nos guides GEO</Link>
                <Link href="/" style={{ display: 'inline-block', background: '#F0EDE8', color: '#1A1916', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Retour à l'accueil</Link>
              </div>
            </div>
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
    </>
  );
}
