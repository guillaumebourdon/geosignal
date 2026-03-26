import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { session_id, url } = router.query;
  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!session_id) return;
    fetch(`/api/verify-payment?session_id=${session_id}`)
      .then(r => r.json())
      .then(data => {
        if (data.email) {
          setEmail(data.email);
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [session_id]);

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.95)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 18, height: 18 }}>
            {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
              <div key={i} style={{ background: c, borderRadius: '50%' }} />
            ))}
          </div>
          Detekia
        </a>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>

        {status === 'loading' && (
          <div>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E5E2DC', borderTopColor: '#D97757', animation: 'spin 0.9s linear infinite', margin: '0 auto 24px' }} />
            <p style={{ color: '#8A8680', fontFamily: 'system-ui', fontSize: 14 }}>Vérification du paiement...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{ fontSize: 48, marginBottom: 24 }}>🎉</div>
            <h1 style={{ fontSize: 32, color: '#1A1916', letterSpacing: -1, marginBottom: 12 }}>Paiement confirmé !</h1>
            <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.65, marginBottom: 32 }}>
              Merci pour votre achat. Rapport débloqué pour <strong>{email}</strong>.
            </p>
            {url && (
              <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: 24, marginBottom: 32 }}>
                <p style={{ fontSize: 12, color: '#8A8680', fontFamily: 'monospace', marginBottom: 16 }}>Accéder à votre rapport complet :</p>
                <a href={`/?url=${encodeURIComponent(url)}&email=${encodeURIComponent(email)}`} style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', fontFamily: 'system-ui' }}>
                  Voir mon rapport complet →
                </a>
              </div>
            )}
            <p style={{ fontSize: 12, color: '#8A8680', fontFamily: 'system-ui' }}>
              Email de confirmation envoyé à <strong>{email}</strong>
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ fontSize: 48, marginBottom: 24 }}>⚠️</div>
            <h1 style={{ fontSize: 28, color: '#1A1916', letterSpacing: -1, marginBottom: 12 }}>Une erreur est survenue</h1>
            <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', marginBottom: 32 }}>
              Votre paiement a peut-être bien été effectué. Contactez-nous à hello@detekia.fr
            </p>
            <a href="/" style={{ color: '#D97757', fontFamily: 'system-ui', fontSize: 14 }}>Retour à l'accueil →</a>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}