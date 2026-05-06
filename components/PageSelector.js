/**
 * PageSelector — lets Pro audit customers review and customize the 10 auto-detected pages
 * before proceeding to Stripe checkout.
 */
import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';

const MIN_PAGES = 5;
const MAX_PAGES = 10;

const TYPE_LABELS = {
  homepage: 'Homepage',
  strategic: 'Strategic',
  category: 'Category',
  product: 'Product',
  content: 'Content',
  other: 'Other',
};

function truncatePath(url, maxLen = 50) {
  try {
    const { pathname } = new URL(url);
    const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    return path.length > maxLen ? path.slice(0, maxLen - 1) + '\u2026' : path;
  } catch {
    return url.length > maxLen ? url.slice(0, maxLen - 1) + '\u2026' : url;
  }
}

export default function PageSelector({ pages, hostname, onConfirm, onBack }) {
  const { t } = useTranslation();

  // Each item: { url, type, checked }
  const [items, setItems] = useState(() =>
    pages.map(p => ({ url: p.url, type: p.type || 'other', checked: true }))
  );
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');

  const selectedCount = items.filter(i => i.checked).length;
  const canAdd = selectedCount < MAX_PAGES && items.length < MAX_PAGES;

  function togglePage(index) {
    setError('');
    setItems(prev => {
      const next = [...prev];
      const item = next[index];
      // Prevent unchecking below minimum
      if (item.checked) {
        const currentSelected = next.filter(i => i.checked).length;
        if (currentSelected <= MIN_PAGES) {
          setError(t('pageSelector.errorMin'));
          return prev;
        }
      }
      next[index] = { ...item, checked: !item.checked };
      return next;
    });
  }

  function removePage(index) {
    setError('');
    const item = items[index];
    if (item.checked) {
      const currentSelected = items.filter(i => i.checked).length;
      if (currentSelected <= MIN_PAGES) {
        setError(t('pageSelector.errorMin'));
        return;
      }
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  function addPage() {
    setError('');
    let url = newUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    // Validate URL format
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      setError(t('pageSelector.errorInvalidUrl'));
      return;
    }

    // Validate same hostname
    const inputHost = parsed.hostname.replace(/^www\./, '');
    const siteHost = hostname.replace(/^www\./, '');
    if (inputHost !== siteHost) {
      setError(t('pageSelector.errorHostname').replace('{hostname}', hostname));
      return;
    }

    // Check duplicate
    const normalized = parsed.origin + parsed.pathname.replace(/\/+$/, '');
    const alreadyExists = items.some(item => {
      try {
        const p = new URL(item.url);
        return (p.origin + p.pathname.replace(/\/+$/, '')) === normalized;
      } catch { return false; }
    });
    if (alreadyExists) {
      setError(t('pageSelector.errorDuplicate'));
      return;
    }

    // Check max
    if (items.length >= MAX_PAGES) {
      setError(t('pageSelector.errorMax'));
      return;
    }

    setItems(prev => [...prev, { url, type: 'custom', checked: true }]);
    setNewUrl('');
  }

  function handleConfirm() {
    const selected = items.filter(i => i.checked);
    if (selected.length < MIN_PAGES) {
      setError(t('pageSelector.errorMin'));
      return;
    }
    onConfirm(selected.map(i => ({ url: i.url, type: i.type })));
  }

  return (
    <div style={{ maxWidth: 520, width: '100%' }}>
      {/* Header */}
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', marginBottom: 6, lineHeight: 1.2 }}>
        {t('pageSelector.title')}
      </h2>
      <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', lineHeight: 1.65, marginBottom: 20 }}>
        {t('pageSelector.subtitle')}
      </p>

      {/* Page count indicator */}
      <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#6B6762', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{t('pageSelector.selectedCount').replace('{count}', selectedCount).replace('{max}', MAX_PAGES)}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', letterSpacing: 1 }}>{hostname}</span>
      </div>

      {/* Page list */}
      <div style={{ border: '1px solid #E5E2DC', borderRadius: 12, background: '#fff', marginBottom: 16, maxHeight: 340, overflowY: 'auto' }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderBottom: i < items.length - 1 ? '1px solid #F0EDE8' : 'none',
              opacity: item.checked ? 1 : 0.45,
              transition: 'opacity 0.15s',
            }}
          >
            {/* Checkbox */}
            <button
              onClick={() => togglePage(i)}
              aria-label={item.checked ? t('pageSelector.uncheck') : t('pageSelector.check')}
              style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                border: item.checked ? '2px solid #D97757' : '2px solid #D0CBC5',
                background: item.checked ? '#D97757' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 12, fontWeight: 700, lineHeight: 1,
              }}
            >
              {item.checked ? '\u2713' : ''}
            </button>

            {/* URL path */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#1A1916', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                title={item.url}>
                {truncatePath(item.url)}
              </div>
            </div>

            {/* Type badge */}
            <span style={{
              fontFamily: 'monospace', fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase',
              background: item.type === 'custom' ? 'rgba(16,163,127,0.08)' : '#F0EDE8',
              color: item.type === 'custom' ? '#10A37F' : '#6B6762',
              padding: '3px 7px', borderRadius: 5, flexShrink: 0,
            }}>
              {item.type === 'custom' ? t('pageSelector.typeCustom') : (TYPE_LABELS[item.type] || item.type)}
            </span>

            {/* Remove button (only for custom pages) */}
            {item.type === 'custom' && (
              <button
                onClick={() => removePage(i)}
                aria-label={t('pageSelector.remove')}
                style={{
                  width: 20, height: 20, borderRadius: '50%', border: 'none',
                  background: '#F0EDE8', color: '#6B6762', cursor: 'pointer',
                  fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add page input */}
      {canAdd && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="url"
            value={newUrl}
            onChange={e => { setNewUrl(e.target.value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') addPage(); }}
            placeholder={t('pageSelector.addPlaceholder')}
            style={{
              flex: 1, background: '#F7F5F2', border: '1px solid #E5E2DC', borderRadius: 10,
              padding: '10px 14px', fontSize: 13, fontFamily: 'system-ui', color: '#1A1916', outline: 'none',
            }}
          />
          <button
            onClick={addPage}
            disabled={!newUrl.trim()}
            style={{
              background: '#1A1916', color: '#F7F5F2', border: 'none', borderRadius: 10,
              padding: '10px 16px', fontFamily: 'system-ui', fontSize: 13, fontWeight: 600,
              cursor: newUrl.trim() ? 'pointer' : 'not-allowed',
              opacity: newUrl.trim() ? 1 : 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            {t('pageSelector.addButton')}
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{
          fontFamily: 'system-ui', fontSize: 12, color: '#D97757', marginBottom: 14,
          background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)',
          borderRadius: 8, padding: '10px 14px', lineHeight: 1.6,
        }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <button
        onClick={handleConfirm}
        disabled={selectedCount < MIN_PAGES}
        style={{
          display: 'block', width: '100%', background: '#D97757', color: '#fff',
          padding: '14px 0', borderRadius: 10, fontWeight: 700, fontSize: 14,
          border: 'none', cursor: selectedCount >= MIN_PAGES ? 'pointer' : 'not-allowed',
          fontFamily: 'system-ui', opacity: selectedCount >= MIN_PAGES ? 1 : 0.6,
          transition: 'opacity 0.2s', marginBottom: 12,
        }}
      >
        {t('pageSelector.confirmButton')}
      </button>
      <button
        onClick={onBack}
        style={{
          display: 'block', width: '100%', background: 'transparent', color: '#6B6762',
          padding: '10px 0', border: 'none', cursor: 'pointer', fontFamily: 'system-ui', fontSize: 13,
        }}
      >
        {t('pageSelector.backButton')}
      </button>
    </div>
  );
}
