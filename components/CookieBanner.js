import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '../lib/useTranslation';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const consent = localStorage.getItem('detekia-cookies');
      if (!consent) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, []);

  function accept() {
    try { localStorage.setItem('detekia-cookies', 'accepted'); } catch (e) {}
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    setVisible(false);
  }

  function refuse() {
    try { localStorage.setItem('detekia-cookies', 'refused'); } catch (e) {}
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    setVisible(false);
  }

  function saveCustom() {
    const value = analyticsEnabled ? 'accepted' : 'refused';
    try { localStorage.setItem('detekia-cookies', value); } catch (e) {}
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: analyticsEnabled ? 'granted' : 'denied' });
    }
    setVisible(false);
    setShowCustomize(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: 24, zIndex: 9999,
      width: 360, background: '#1A1916',
      borderRadius: 16, padding: '20px 24px',
      boxShadow: '0 8px 40px rgba(26,25,22,0.25), 0 2px 8px rgba(26,25,22,0.15)',
      animation: 'slideUp 0.4s cubic-bezier(0.4,0,0.2,1)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: 14, height: 14, flexShrink: 0 }}>
          {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
            <div key={i} style={{ background: c, borderRadius: '50%' }} />
          ))}
        </div>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#F7F5F2', fontWeight: 400 }}>Detekia</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.3)', letterSpacing: 1, textTransform: 'uppercase' }}>Cookies</span>
      </div>

      <p style={{ fontSize: 12, color: 'rgba(247,245,242,0.55)', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 16 }}>
        {t('cookieBanner.message')}{' '}
        <Link href="/confidentialite" style={{ color: '#D97757', textDecoration: 'none' }}>{t('cookieBanner.learnMore')}</Link>
      </p>

      {/* Customize panel */}
      {showCustomize && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
          {/* Essential cookies — always on */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: '#F7F5F2', fontFamily: 'system-ui', fontWeight: 600 }}>{t('cookieBanner.essential')}</div>
              <div style={{ fontSize: 10, color: 'rgba(247,245,242,0.4)', fontFamily: 'system-ui', marginTop: 2 }}>{t('cookieBanner.essentialDesc')}</div>
            </div>
            <div style={{ background: '#10A37F', borderRadius: 10, padding: '2px 10px', fontSize: 10, color: '#fff', fontFamily: 'system-ui', fontWeight: 600, flexShrink: 0 }}>
              {t('cookieBanner.alwaysOn')}
            </div>
          </div>
          {/* Analytics cookies — toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, color: '#F7F5F2', fontFamily: 'system-ui', fontWeight: 600 }}>{t('cookieBanner.analytics')}</div>
              <div style={{ fontSize: 10, color: 'rgba(247,245,242,0.4)', fontFamily: 'system-ui', marginTop: 2 }}>{t('cookieBanner.analyticsDesc')}</div>
            </div>
            <button onClick={() => setAnalyticsEnabled(!analyticsEnabled)} style={{
              width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', flexShrink: 0,
              background: analyticsEnabled ? '#D97757' : 'rgba(255,255,255,0.15)',
              position: 'relative', transition: 'background 0.2s',
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3,
                left: analyticsEnabled ? 21 : 3,
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        {showCustomize ? (
          <>
            <button onClick={refuse}
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(247,245,242,0.5)', padding: '9px 0', borderRadius: 8, fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer' }}>
              {t('cookieBanner.declineAll')}
            </button>
            <button onClick={saveCustom}
              style={{ flex: 2, background: '#F7F5F2', border: 'none', color: '#1A1916', padding: '9px 0', borderRadius: 8, fontSize: 12, fontFamily: 'system-ui', fontWeight: 600, cursor: 'pointer' }}>
              {t('cookieBanner.saveChoices')}
            </button>
          </>
        ) : (
          <>
            <button onClick={refuse}
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(247,245,242,0.5)', padding: '9px 0', borderRadius: 8, fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer' }}>
              {t('cookieBanner.decline')}
            </button>
            <button onClick={() => setShowCustomize(true)}
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(247,245,242,0.7)', padding: '9px 0', borderRadius: 8, fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer' }}>
              {t('cookieBanner.customize')}
            </button>
            <button onClick={accept}
              style={{ flex: 2, background: '#F7F5F2', border: 'none', color: '#1A1916', padding: '9px 0', borderRadius: 8, fontSize: 12, fontFamily: 'system-ui', fontWeight: 600, cursor: 'pointer' }}>
              {t('cookieBanner.accept')}
            </button>
          </>
        )}
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
