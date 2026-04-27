import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../lib/useTranslation';

export default function BeelevenContactModal({ open, onClose, prefillUrl = '' }) {
  const { t } = useTranslation();
  const b = t('beelevenContact');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', website: prefillUrl, message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);
  const closeRef = useRef(null);

  // Sync prefillUrl when it changes
  useEffect(() => {
    if (prefillUrl) setForm(f => ({ ...f, website: prefillUrl }));
  }, [prefillUrl]);

  // Focus trap + Escape
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => firstInputRef.current?.focus());

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  // Auto-close after success
  useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => { onClose(); setStatus('idle'); }, 3000);
    return () => clearTimeout(timer);
  }, [status, onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact-beeleven', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pageUrl: window.location.href }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ firstName: '', lastName: '', email: '', website: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (!open) return null;

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #E5E2DC', borderRadius: 8, fontSize: 14, fontFamily: 'system-ui', color: '#1A1916', background: '#fff', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#3A3835', fontFamily: 'system-ui', marginBottom: 5 };

  return (
    <div ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#F7F5F2', borderRadius: 18, padding: '36px 32px', maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 64px rgba(26,25,22,0.25)' }}>

        {/* Close button */}
        <button ref={closeRef} onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B6762" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>&#10003;</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1A1916', marginBottom: 8 }}>{b.submitSuccess}</div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 8, letterSpacing: -0.5, paddingRight: 28 }}>{b.modalTitle}</div>
            <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', lineHeight: 1.65, marginBottom: 24 }}>{b.modalSubtitle}</div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>{b.firstName} *</label>
                  <input ref={firstInputRef} required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{b.lastName} *</label>
                  <input required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>{b.email} *</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{b.website}</label>
                <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://…" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{b.message}</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder={b.messagePlaceholder} rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} />
              </div>

              {status === 'error' && (
                <div style={{ fontSize: 12, color: '#D97757', fontFamily: 'system-ui' }}>{b.submitError}</div>
              )}

              <button type="submit" disabled={status === 'loading'} style={{ background: '#D97757', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 24px', fontSize: 15, fontWeight: 700, fontFamily: 'system-ui', cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, marginTop: 4 }}>
                {status === 'loading' ? b.submitLoading : b.submitButton}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
