import { useState } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';

function WaitlistForm({ t, onSuccess }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const { locale } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/pro-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      if (onSuccess) onSuccess();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ background: 'rgba(16,163,127,0.08)', border: '1px solid rgba(16,163,127,0.25)', borderRadius: 12, padding: '20px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 15, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 600 }}>{t('pro.waitlist.success')}</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto' }}>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={t('pro.waitlist.placeholder')}
        style={{ flex: 1, padding: '13px 18px', border: '1px solid #E5E2DC', borderRadius: 10, fontSize: 15, fontFamily: 'system-ui', color: '#1A1916', background: '#fff', outline: 'none', minWidth: 0 }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{ background: '#D97757', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 24px', fontSize: 14, fontWeight: 700, fontFamily: 'system-ui', cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, whiteSpace: 'nowrap', flexShrink: 0 }}
      >
        {t('pro.waitlist.cta')}
      </button>
      {status === 'error' && <div style={{ fontSize: 12, color: '#D97757', marginTop: 6, fontFamily: 'system-ui' }}>{t('pro.waitlist.error')}</div>}
    </form>
  );
}

export default function Pro() {
  const { t } = useTranslation();
  const cards = t('pro.audience.cards');
  const features = t('pro.features.items');

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO title={t('pro.seo.title')} description={t('pro.seo.description')} />
      <Header />

      {/* HERO */}
      <section style={{ padding: '80px 24px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.3)', padding: '5px 14px', borderRadius: 20, marginBottom: 24, background: 'rgba(217,119,87,0.06)' }}>
            Detekia Pro
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 16, color: '#1A1916' }}>
            {t('pro.hero.title')}
          </h1>
          <p style={{ fontSize: 16, color: '#6B6762', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
            {t('pro.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* WAITLIST TOP */}
      <section style={{ padding: '0 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', background: '#fff', border: '1px solid #E5E2DC', borderRadius: 18, padding: '36px 32px', boxShadow: '0 4px 24px rgba(26,25,22,0.06)' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1916', marginBottom: 8 }}>{t('pro.waitlist.title')}</div>
          <p style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 20 }}>{t('pro.waitlist.desc')}</p>
          <WaitlistForm t={t} />
          <div style={{ fontSize: 11, color: '#B0ABA5', fontFamily: 'system-ui', marginTop: 14 }}>{t('pro.waitlist.note')}</div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section style={{ padding: '64px 24px', background: '#fff', borderTop: '1px solid #E5E2DC', borderBottom: '1px solid #E5E2DC' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 36px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 40 }}>{t('pro.audience.title')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="target-grid">
            {cards.map((card) => (
              <div key={card.title} style={{ background: '#F7F5F2', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{card.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 10 }}>{card.title}</div>
                <div style={{ fontSize: 13, color: '#6B6762', lineHeight: 1.65, fontFamily: 'system-ui' }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 36px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 36 }}>{t('pro.features.title')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            {features.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: '#10A37F', fontSize: 14, flexShrink: 0, marginTop: 2 }}>✓</span>
                <span style={{ fontSize: 14, color: '#3A3835', fontFamily: 'system-ui', lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 12, padding: '18px 22px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Highlight</div>
            <p style={{ fontSize: 14, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.65, fontWeight: 600, margin: 0 }}>{t('pro.features.highlight')}</p>
          </div>
        </div>
      </section>

      {/* PRICING + TIMELINE */}
      <section style={{ padding: '64px 24px', background: '#1A1916', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 48px)', color: '#F7F5F2', letterSpacing: -1.5, marginBottom: 8 }}>{t('pro.pricing.price')}</div>
          <div style={{ fontSize: 14, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 20 }}>{t('pro.pricing.detail')}</div>
          <div style={{ display: 'inline-block', background: 'rgba(217,119,87,0.15)', border: '1px solid rgba(217,119,87,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: '#D97757', fontFamily: 'system-ui', fontWeight: 600 }}>{t('pro.pricing.timeline')}</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.4)', fontFamily: 'system-ui', lineHeight: 1.6 }}>{t('pro.pricing.waitlistNote')}</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 36px)', color: '#1A1916', letterSpacing: -1, marginBottom: 12 }}>{t('pro.finalCta.title')}</h2>
          <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 28 }}>{t('pro.finalCta.desc')}</p>
          <WaitlistForm t={t} />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #E5E2DC', padding: '24px', background: '#fff', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: '#C2BDB8', fontFamily: 'system-ui' }}>
          <Link href="/" style={{ color: '#8A8680', textDecoration: 'none', fontSize: 12 }}>← Detekia</Link>
        </div>
      </footer>
    </div>
  );
}
