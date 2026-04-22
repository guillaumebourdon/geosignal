import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../lib/useTranslation';

const Logo = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
    {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c, i) => (
      <div key={i} style={{ background: c, borderRadius: '50%' }} />
    ))}
  </div>
);

const NAV_LINKS = [
  { href: '/blog', labelKey: 'nav.blog' },
  { href: '/pricing', labelKey: 'nav.pricing' },
  { href: '/methodologie', labelKey: 'nav.methodology' },
  { href: '/a-propos', labelKey: 'nav.about' },
  { href: '/contact', labelKey: 'nav.contact' },
];

export default function Header({ variant = 'default', ctaLabel, showLanguageSwitcher = true }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef(null);
  const firstLinkRef = useRef(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Body scroll lock + Escape key
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      // Focus first link after render
      requestAnimationFrame(() => {
        firstLinkRef.current?.focus();
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    router.events.on('routeChangeStart', closeMenu);
    return () => router.events.off('routeChangeStart', closeMenu);
  }, [router.events, closeMenu]);

  const pathname = router.pathname;
  const resolvedCtaLabel = ctaLabel || t('nav.cta');

  // Minimal variant: logo only (success page)
  if (variant === 'minimal') {
    return (
      <nav className="detekia-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 58, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <Logo />{t('common.siteName')}
        </Link>
      </nav>
    );
  }

  return (
    <>
      <nav className="detekia-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 58, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <Logo />{t('common.siteName')}
        </Link>

        <div className="nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {NAV_LINKS.map(({ href, labelKey }) => {
            const isActive = pathname === href || (href === '/blog' && pathname.startsWith('/blog'));
            return (
              <Link key={href} href={href} className="nav-link-secondary" style={{ fontSize: 13, color: isActive ? '#1A1916' : '#8A8680', fontWeight: isActive ? 600 : 400, textDecoration: 'none', fontFamily: 'system-ui' }}>
                {t(labelKey)}
              </Link>
            );
          })}
          {showLanguageSwitcher && <LanguageSwitcher />}
          <Link href="/" className="nav-cta" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontFamily: 'system-ui' }}>
            {resolvedCtaLabel}
          </Link>
        </div>

        {/* Burger button — mobile only */}
        <button
          ref={burgerRef}
          className="nav-burger"
          onClick={() => setMenuOpen(true)}
          aria-label={t('nav.openMenu')}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, marginRight: -8 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1916" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true">
          {/* Close button */}
          <button
            className="mobile-menu-close"
            onClick={() => { setMenuOpen(false); burgerRef.current?.focus(); }}
            aria-label={t('nav.closeMenu')}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F7F5F2" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Nav links */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {NAV_LINKS.map(({ href, labelKey }, i) => {
              const isActive = pathname === href || (href === '/blog' && pathname.startsWith('/blog'));
              return (
                <Link
                  key={href}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={href}
                  className="mobile-menu-link"
                  onClick={() => { setMenuOpen(false); burgerRef.current?.focus(); }}
                  style={isActive ? { color: '#D97757' } : undefined}
                >
                  {t(labelKey)}
                </Link>
              );
            })}
          </div>

          {/* Language switcher at bottom */}
          <div className="mobile-menu-lang">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </>
  );
}
