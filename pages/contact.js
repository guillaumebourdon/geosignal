import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

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
          <a href="/contact" style={{ fontSize: 13, color: '#1A1916', fontWeight: 600, textDecoration: 'none' }}>Contact</a>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '8px 18px', borderRadius: 8, textDecoration: 'none' }}>Analyser mon site</a>
        </div>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '72px 24px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.3)', padding: '5px 14px', borderRadius: 20, marginBottom: 20, background: 'rgba(217,119,87,0.06)' }}>
            On vous répond sous 24h
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 14, color: '#1A1916' }}>
            Une question ?
          </h1>
          <p style={{ fontSize: 15, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif' }}>
            Une suggestion, un bug, une demande de partenariat — on lit tous les messages.
          </p>
        </div>

        {sent ? (
          <div style={{ background: 'rgba(16,163,127,0.08)', border: '1px solid rgba(16,163,127,0.3)', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✅</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1916', marginBottom: 8 }}>Message envoyé !</div>
            <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
              Merci pour votre message. Nous vous répondrons dans les 24 heures.
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(26,25,22,0.07)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div>
                <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Nom</label>
                <input
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Jean Dupont"
                  style={{ width: '100%', background: '#F7F5F2', border: '1px solid #E5E2DC', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#1A1916', fontFamily: 'system-ui, sans-serif', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Email</label>
                <input
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="jean@exemple.fr"
                  type="email"
                  style={{ width: '100%', background: '#F7F5F2', border: '1px solid #E5E2DC', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#1A1916', fontFamily: 'system-ui, sans-serif', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Bonjour, je voudrais..."
                  rows={5}
                  style={{ width: '100%', background: '#F7F5F2', border: '1px solid #E5E2DC', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#1A1916', fontFamily: 'system-ui, sans-serif', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button
                onClick={handleSubmit}
                style={{ background: '#1A1916', color: '#F7F5F2', border: 'none', padding: '14px 0', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui, sans-serif' }}>
                Envoyer le message →
              </button>

            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui, sans-serif' }}>
            Ou directement par email :{' '}
            <a href="mailto:hello@geosignal.fr" style={{ color: '#D97757', textDecoration: 'none' }}>hello@geosignal.fr</a>
          </div>
        </div>
      </div>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}