/**
 * PageSelector — lets Pro audit customers review and customize the 10 auto-detected pages
 * before proceeding to Stripe checkout.
 *
 * Flow: all pages shown in a list. Client can remove any page and add replacements.
 * Always shows the add input when under 10 pages. Min 5, max 10.
 */
import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';

const MIN_PAGES = 5;
const MAX_PAGES = 10;

const TYPE_COLORS = {
  homepage: { bg: '#1A191610', color: '#1A1916' },
  strategic: { bg: 'rgba(66,133,244,0.08)', color: '#4285F4' },
  category: { bg: 'rgba(201,134,26,0.08)', color: '#C9861A' },
  product: { bg: 'rgba(217,119,87,0.08)', color: '#D97757' },
  content: { bg: 'rgba(16,163,127,0.08)', color: '#10A37F' },
  custom: { bg: 'rgba(16,163,127,0.08)', color: '#10A37F' },
  other: { bg: '#F0EDE8', color: '#6B6762' },
};

function truncatePath(url, maxLen = 55) {
  try {
    const { pathname } = new URL(url);
    const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    return path.length > maxLen ? path.slice(0, maxLen - 1) + '\u2026' : path;
  } catch {
    return url.length > maxLen ? url.slice(0, maxLen - 1) + '\u2026' : url;
  }
}

function normalizeInputUrl(input) {
  let url = input.trim();
  // Remove trailing punctuation users might paste
  url = url.replace(/[,;:!?\s]+$/, '');
  // Add protocol
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  // Add www if missing for bare domains
  try {
    const parsed = new URL(url);
    // Normalize: strip trailing slash, query, hash
    return parsed.origin + parsed.pathname.replace(/\/+$/, '');
  } catch {
    return null;
  }
}

export default function PageSelector({ pages, hostname, onConfirm, onBack }) {
  const { t } = useTranslation();

  const [items, setItems] = useState(() =>
    pages.map(p => ({ url: p.url, type: p.type || 'other' }))
  );
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');

  const siteHost = hostname.replace(/^www\./, '');

  function removePage(index) {
    setError('');
    if (items.length <= MIN_PAGES) {
      setError(t('pageSelector.errorMin'));
      return;
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  function addPage() {
    setError('');
    const raw = newUrl.trim();
    if (!raw) return;

    const normalized = normalizeInputUrl(raw);
    if (!normalized) {
      setError(t('pageSelector.errorInvalidUrl'));
      return;
    }

    // Validate same hostname (with www tolerance)
    try {
      const inputHost = new URL(normalized).hostname.replace(/^www\./, '');
      if (inputHost !== siteHost) {
        setError(t('pageSelector.errorHostname').replace('{hostname}', hostname));
        return;
      }
    } catch {
      setError(t('pageSelector.errorInvalidUrl'));
      return;
    }

    // Check duplicate
    const alreadyExists = items.some(item => {
      try {
        const existing = new URL(item.url);
        const existingNorm = existing.origin + existing.pathname.replace(/\/+$/, '');
        return existingNorm === normalized;
      } catch { return false; }
    });
    if (alreadyExists) {
      setError(t('pageSelector.errorDuplicate'));
      return;
    }

    if (items.length >= MAX_PAGES) {
      setError(t('pageSelector.errorMax'));
      return;
    }

    setItems(prev => [...prev, { url: normalized, type: 'custom' }]);
    setNewUrl('');
  }

  function handleConfirm() {
    if (items.length < MIN_PAGES) {
      setError(t('pageSelector.errorMin'));
      return;
    }
    onConfirm(items.map(i => ({ url: i.url, type: i.type })));
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

      {/* Page count */}
      <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#6B6762', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{t('pageSelector.selectedCount').replace('{count}', items.length).replace('{max}', MAX_PAGES)}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', letterSpacing: 1 }}>{hostname}</span>
      </div>

      {/* Page list */}
      <div style={{ border: '1px solid #E5E2DC', borderRadius: 12, background: '#fff', marginBottom: 16, maxHeight: 340, overflowY: 'auto' }}>
        {items.map((item, i) => {
          const typeStyle = TYPE_COLORS[item.type] || TYPE_COLORS.other;
          return (
            <div
              key={item.url}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderBottom: i < items.length - 1 ? '1px solid #F0EDE8' : 'none',
              }}
            >
              {/* URL path */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontFamily: 'system-ui', fontSize: 13, color: '#1A1916', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  title={item.url}
                >
                  {truncatePath(item.url)}
                </div>
              </div>

              {/* Type badge */}
              <span style={{
                fontFamily: 'monospace', fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase',
                background: typeStyle.bg, color: typeStyle.color,
                padding: '3px 7px', borderRadius: 5, flexShrink: 0,
              }}>
                {item.type === 'custom' ? t('pageSelector.typeCustom') : item.type}
              </span>

              {/* Remove button */}
              <button
                onClick={() => removePage(i)}
                aria-label={t('pageSelector.remove')}
                style={{
                  width: 22, height: 22, borderRadius: '50%', border: 'none',
                  background: '#F0EDE8', color: '#6B6762', cursor: 'pointer',
                  fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#E8E3DD'}
                onMouseLeave={e => e.currentTarget.style.background = '#F0EDE8'}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Add page input — always visible when under max */}
      {items.length < MAX_PAGES && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            value={newUrl}
            onChange={e => { setNewUrl(e.target.value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPage(); } }}
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
        disabled={items.length < MIN_PAGES}
        style={{
          display: 'block', width: '100%', background: '#D97757', color: '#fff',
          padding: '14px 0', borderRadius: 10, fontWeight: 700, fontSize: 14,
          border: 'none', cursor: items.length >= MIN_PAGES ? 'pointer' : 'not-allowed',
          fontFamily: 'system-ui', opacity: items.length >= MIN_PAGES ? 1 : 0.6,
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
