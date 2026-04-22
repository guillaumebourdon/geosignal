import { useState } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';


export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { t } = useTranslation();

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  const reasons = t('contact.reasons.items');

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO
        title={t('contact.seo.title')}
        description={t('contact.seo.description')}
      />

      <Header ctaLabel={t('nav.ctaAnalyze')} />

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '72px 24px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.3)', padding: '5px 14px', borderRadius: 20, marginBottom: 20, background: 'rgba(217,119,87,0.06)' }}>
            {t('contact.hero.badge')}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 14, color: '#1A1916' }}>
            {t('contact.hero.title')}
          </h1>
          <p style={{ fontSize: 15, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif' }}>
            {t('contact.hero.subtitle')}
          </p>
        </div>

        {sent ? (
          <div style={{ background: 'rgba(16,163,127,0.08)', border: '1px solid rgba(16,163,127,0.3)', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✅</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1916', marginBottom: 8 }}>{t('contact.success.title')}</div>
            <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
              {t('contact.success.subtitle')}
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(26,25,22,0.07)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{t('contact.form.nameLabel')}</label>
                <input
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder={t('contact.form.namePlaceholder')}
                  style={{ width: '100%', background: '#F7F5F2', border: '1px solid #E5E2DC', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#1A1916', fontFamily: 'system-ui, sans-serif', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{t('contact.form.emailLabel')}</label>
                <input
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder={t('contact.form.emailPlaceholder')}
                  type="email"
                  style={{ width: '100%', background: '#F7F5F2', border: '1px solid #E5E2DC', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#1A1916', fontFamily: 'system-ui, sans-serif', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{t('contact.form.messageLabel')}</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder={t('contact.form.messagePlaceholder')}
                  rows={5}
                  style={{ width: '100%', background: '#F7F5F2', border: '1px solid #E5E2DC', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#1A1916', fontFamily: 'system-ui, sans-serif', outline: 'none', resize: 'vertical' }}
                />
              </div>
              <button
                onClick={handleSubmit}
                style={{ background: '#1A1916', color: '#F7F5F2', border: 'none', padding: '14px 0', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui, sans-serif' }}>
                {t('contact.form.submit')}
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui, sans-serif' }}>
            {t('contact.emailDirect')}{' '}
            <a href="mailto:hello@detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>hello@detekia.fr</a>
          </div>
        </div>

        {/* Motifs de contact */}
        <div style={{ marginTop: 40, background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '28px 28px 20px', boxShadow: '0 2px 12px rgba(26,25,22,0.06)' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 }}>{t('contact.reasons.label')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            {reasons.map((r) => (
              <div key={r.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', borderBottom: '1px solid #F0EDE8', paddingBottom: 14 }}>
                <div style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{r.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', marginBottom: 3, fontFamily: 'system-ui' }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.5 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', letterSpacing: 0.5 }}>
            {t('contact.reasons.responseTime')}{' '}
            <a href="mailto:hello@detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>hello@detekia.fr</a>
          </div>
        </div>
      </div>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}
