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
          <div style={{ maxWidth: 620, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #E5E2DC', borderTopColor: '#D97757', animation: 'spin 0.9s linear infinite', margin: '0 auto 24px' }} />
            <div style={{ fontSize: 17, color: '#1A1916', marginBottom: 6 }}>Vérification du paiement</div>
            <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui' }}>Un instant...</div>
          </div>
        )}

        {/* ═══ ERROR ═══ */}
        {status === 'error' && (
          <div className="reveal" style={{ maxWidth: 480, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(217,119,87,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
            </div>
            <h1 style={{ fontSize: 22, color: '#1A1916', marginBottom: 10 }}>Paiement non vérifié</h1>
            <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 28 }}>
              Nous n'avons pas pu vérifier votre paiement. Si vous avez bien été débité, contactez-nous à{' '}
              <a href="mailto:hello@detekia.fr" style={{ color: '#D97757' }}>hello@detekia.fr</a>
            </p>
            <Link href="/" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Retour à l'accueil</Link>
          </div>
        )}

        {/* ═══ CONFIRMED ═══ */}
        {status === 'confirmed' && (
          <>
            {/* BLOC 1 — Confirmation (fond ivoire) */}
            <div className="reveal" style={{ maxWidth: 620, margin: '0 auto', padding: '56px 24px 32px', textAlign: 'center' }}>
              <div className="scale-in" style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,163,127,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h1 style={{ fontSize: 28, color: '#1A1916', letterSpacing: -0.5, marginBottom: 8, lineHeight: 1.2 }}>Paiement confirmé</h1>
              <p style={{ fontSize: 15, color: '#8A8680', fontFamily: 'system-ui' }}>
                {isPro ? 'Votre audit complet est lancé' : 'Votre rapport est en cours de génération'}
              </p>
            </div>

            {/* BLOC 2 — Analyse en cours (FOND NOIR) */}
            <div className="reveal reveal-d1" style={{ background: '#1A1916', padding: '40px 24px', marginBottom: 0 }}>
              <div style={{ maxWidth: 560, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div className="pulse-soft" style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97757', flexShrink: 0 }} />
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase' }}>Analyse en cours</div>
                </div>
                <h2 style={{ fontSize: 22, color: '#F7F5F2', marginBottom: 14, lineHeight: 1.3 }}>
                  {isPro ? 'Votre rapport sera prêt dans 15 à 20 minutes' : 'Votre rapport sera prêt dans 1 à 2 minutes'}
                </h2>
                <p style={{ fontSize: 14, color: 'rgba(247,245,242,0.65)', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 16 }}>
                  {isPro
                    ? `Notre IA analyse actuellement les 20 pages les plus importantes de votre site. Vous recevrez votre rapport complet par email à ${email} dès qu'il sera prêt.`
                    : `Notre IA analyse votre page. Vous recevrez votre rapport par email à ${email} dès qu'il sera prêt.`
                  }
                </p>
                <p style={{ fontSize: 12, color: 'rgba(247,245,242,0.35)', fontFamily: 'system-ui' }}>
                  Vous pouvez fermer cette page — l'analyse continue en arrière-plan.
                </p>
              </div>
            </div>

            {/* BLOC 3 — Encart spam (fond pêche) */}
            <div className="reveal reveal-d2" style={{ background: '#FDF1EA', borderBottom: '1px solid rgba(217,119,87,0.15)', padding: '16px 24px' }}>
              <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <p style={{ fontSize: 12, color: '#8A6D20', fontFamily: 'system-ui', lineHeight: 1.5, margin: 0 }}>
                  Pensez à vérifier vos spams. L'email peut atterrir dans le dossier indésirable. Expéditeur : <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757' }}>hello@detekia.fr</span>
                </p>
              </div>
            </div>

            {/* BLOC 4 — Articles (fond ivoire) */}
            <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
              <div className="reveal reveal-d3">
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>En attendant votre rapport</div>
                <div className="success-articles" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
                  {articles.map((a, i) => (
                    <Link key={i} href={`/blog/${a.slug}`} className="card-interactive" style={{
                      background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '20px 18px',
                      textDecoration: 'none', display: 'block',
                    }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{a.category} · {a.readTime}</div>
                      <div style={{ fontSize: 14, color: '#1A1916', lineHeight: 1.35, marginBottom: 8, fontFamily: 'system-ui', fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.5, fontFamily: 'system-ui' }}>{a.description?.substring(0, 90)}...</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* BLOC 5 — Tips PRO only */}
              {isPro && (
                <div className="reveal reveal-d4" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '24px 28px', marginBottom: 32 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Pendant l'attente, préparez la suite</div>
                  {[
                    'Notez les pages les plus stratégiques pour votre business',
                    'Préparez la liste des contenus que vous voulez actualiser',
                    'Identifiez les KPIs de visibilité IA que vous souhaitez suivre',
                  ].map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < 2 ? 10 : 0 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F7F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 10, color: '#8A8680', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                      <div style={{ fontSize: 13, color: '#3A3835', fontFamily: 'system-ui', lineHeight: 1.5 }}>{tip}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BLOC 6 — CTA Beeleven (FOND NOIR) */}
            <div className={`reveal ${isPro ? 'reveal-d5' : 'reveal-d4'}`} style={{ background: '#1A1916', padding: '40px 24px' }}>
              <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Aller plus loin</div>
                <h3 style={{ fontSize: 18, color: '#F7F5F2', marginBottom: 10, lineHeight: 1.3 }}>Besoin d'aide pour appliquer les recommandations ?</h3>
                <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.55)', fontFamily: 'system-ui', lineHeight: 1.65, marginBottom: 20 }}>Beeleven, l'agence qui a créé Detekia, peut implémenter les recommandations pour vous.</p>
                <a href="mailto:hello@detekia.fr?subject=Audit GEO — suite du rapport" className="btn-interactive" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '13px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: 'system-ui' }}>
                  Discutons-en →
                </a>
              </div>
            </div>

            {/* BLOC 7 — Footer actions (fond ivoire) */}
            <div className={`reveal ${isPro ? 'reveal-d6' : 'reveal-d5'}`} style={{ maxWidth: 620, margin: '0 auto', padding: '32px 24px 80px', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="btn-interactive" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Retour à l'accueil</Link>
              <Link href="/blog" style={{ display: 'inline-block', background: '#F0EDE8', color: '#1A1916', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>Tous nos guides GEO</Link>
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
