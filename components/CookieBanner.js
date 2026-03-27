import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('detekia-cookies');
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem('detekia-cookies', 'accepted');
    setVisible(false);
  }

  function refuse() {
    localStorage.setItem('detekia-cookies', 'refused');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: 24, zIndex: 9999,
      width: 340, background: '#1A1916',
      borderRadius: 16, padding: '20px 24px',
      boxShadow: '0 8px 40px rgba(26,25,22,0.25), 0 2px 8px rgba(26,25,22,0.15)',
      animation: 'slideUp 0.4s cubic-bezier(0.4,0,0.2,1)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: 14, height: 14, flexShrink: 0 }}>
          {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
            <div key={i} style={{ background: c, borderRadius: '50%' }} />
          ))}
        </div>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#F7F5F2', fontWeight: 400 }}>Detekia</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.3)', letterSpacing: 1, textTransform: 'uppercase' }}>Cookies</span>
      </div>

      {/* Texte */}
      <p style={{ fontSize: 12, color: 'rgba(247,245,242,0.55)', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 16 }}>
        On utilise des cookies pour analyser l'usage du site et améliorer votre expérience.{' '}
        <a href="/legal" style={{ color: '#D97757', textDecoration: 'none' }}>En savoir plus</a>
      </p>

      {/* Boutons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={refuse}
          style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(247,245,242,0.5)', padding: '9px 0', borderRadius: 8, fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.06)'}
        >
          Refuser
        </button>
        <button
          onClick={accept}
          style={{ flex: 2, background: '#F7F5F2', border: 'none', color: '#1A1916', padding: '9px 0', borderRadius: 8, fontSize: 12, fontFamily: 'system-ui', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => e.target.style.background = '#E5E2DC'}
          onMouseLeave={e => e.target.style.background = '#F7F5F2'}
        >
          Accepter ✓
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}