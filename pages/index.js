import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import BeelevenContactModal from '../components/BeelevenContactModal';
import { useTranslation } from '../lib/useTranslation';

/* ─── Scroll reveal hook ────────────────────────────────── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function RevealSection({ children, className = '', style = {}, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1);
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ─── Helpers ───────────────────────────────────────────── */
const Logo = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
    {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => <div key={i} style={{ background: c, borderRadius: '50%' }} />)}
  </div>
);

const SectionDivider = () => (
  <div style={{ height: 1, background: 'rgba(26,25,22,0.07)' }} />
);

const Label = ({ children, color = '#6B6762' }) => (
  <div style={{ fontFamily: 'monospace', fontSize: 9, color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{children}</div>
);

/* ─── FAQ accordion ─────────────────────────────────────── */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #E5E2DC', overflow: 'hidden' }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div onClick={() => setOpen(o => !o)} role="button" tabIndex={0} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOpen(o => !o))} style={{ padding: '22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, color: open ? '#1A1916' : '#3A3835', fontFamily: 'system-ui', transition: 'color 0.3s', margin: 0 }}>{question}</h3>
        <div style={{ width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${open ? '#1A1916' : '#E5E2DC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 20, transition: 'all 0.3s', background: open ? '#1A1916' : 'transparent' }}>
          <span style={{ fontSize: 15, color: open ? '#F7F5F2' : '#6B6762', lineHeight: 1, transition: 'all 0.3s', transform: open ? 'rotate(45deg)' : 'none', display: 'block' }}>+</span>
        </div>
      </div>
      <div style={{ maxHeight: open ? '300px' : '0', opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease' }}>
        <div style={{ fontSize: 13, color: '#6B6762', lineHeight: 1.8, fontFamily: 'system-ui', paddingBottom: 22 }}>{answer}</div>
      </div>
    </div>
  );
}



/* ─── Hero product mockup ────────────────────────────────── */
function ProductMockup() {
  const { t } = useTranslation();
  return (
    <div className="audit-mockup" style={{ background: '#fff', borderRadius: 22, boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 32px 80px rgba(26,25,22,0.18), 0 4px 16px rgba(26,25,22,0.06)', overflow: 'hidden', maxWidth: 390, width: '100%', border: '1px solid rgba(26,25,22,0.06)' }}>

      {/* macOS-style mini header — hidden on mobile */}
      <div className="audit-mockup-chrome" style={{ background: '#F0EDE8', borderBottom: '1px solid #E5E2DC', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#F87171','#FBBF24','#34D399'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 0.5, marginLeft: 6 }}>{t('homepage.mockup.headerLabel')}</div>
      </div>

      {/* EXEMPLE badge — mobile only */}
      <div className="audit-mockup-label">{t('homepage.hero.mockupLabel')}</div>

      {/* Score block */}
      <div style={{ background: '#1A1916', padding: '36px 32px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '40%', left: 24, transform: 'translateY(-50%)', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: '#D97757', opacity: 0.05 }} />

        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.3)', letterSpacing: 2, marginBottom: 18, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D97757' }} /> {t('homepage.mockup.scoreBadge')}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, position: 'relative' }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 96, color: '#F7F5F2', lineHeight: 1, letterSpacing: -4 }}>{t('homepage.mockup.score')}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.25)', letterSpacing: 1 }}>{t('homepage.mockup.scoreMax')}</div>
          </div>
          <div style={{ paddingBottom: 16 }}>
            <div style={{ display: 'inline-block', background: '#D97757', borderRadius: 20, padding: '4px 13px', fontFamily: 'monospace', fontSize: 9, color: '#fff', letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>{t('homepage.mockup.level')}</div>
            <div style={{ fontSize: 11, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: t('homepage.mockup.levelDesc') }} />
          </div>
        </div>
      </div>

      {/* Critique */}
      <div style={{ padding: '20px 26px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: 1, padding: '3px 9px', borderRadius: 4, background: 'rgba(217,119,87,0.12)', color: '#D97757', fontWeight: 700 }}>{t('homepage.mockup.criticalTag')}</span>
        </div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1A1916', lineHeight: 1.3, marginBottom: 8 }}>
          {t('homepage.mockup.criticalTitle')}
        </div>
        <div style={{ fontSize: 12, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.6 }}>
          {t('homepage.mockup.criticalDesc')}
        </div>
      </div>

      {/* Action verte */}
      <div style={{ margin: '14px 26px 0', padding: '12px 14px', background: 'rgba(16,163,127,0.08)', border: '1px solid rgba(16,163,127,0.25)', borderRadius: 10 }}>
        <div style={{ fontSize: 11, color: '#0E8A6B', fontFamily: 'system-ui', lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: t('homepage.mockup.fixText') }} />
      </div>

      {/* Impact doré */}
      <div style={{ margin: '10px 26px 18px', padding: '10px 14px', background: 'rgba(201,134,26,0.10)', border: '1px solid rgba(201,134,26,0.28)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>↑</span>
        <span style={{ fontSize: 11, color: '#A06A14', fontFamily: 'system-ui', fontWeight: 600 }}>{t('homepage.mockup.impactPoints')}</span>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '13px 26px 15px', background: 'rgba(217,119,87,0.05)', borderTop: '1px solid #EDEBE6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#1A1916', fontFamily: 'system-ui' }}>{t('homepage.mockup.lockedCount')}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#D97757', fontFamily: 'system-ui', background: 'rgba(217,119,87,0.12)', padding: '6px 14px', borderRadius: 20 }}>{t('homepage.mockup.unlock')}</div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function Home() {
  const [url, setUrl] = useState('');
  const [easterEgg, setEasterEgg] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showBeeleven, setShowBeeleven] = useState(false);
  const [auditCount, setAuditCount] = useState(null);
  const router = useRouter();
  const { t, locale } = useTranslation();

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => setAuditCount(d.audits)).catch(() => {});
  }, []);


  useEffect(() => {
    const engines = ['ChatGPT', 'Gemini', 'Claude', 'Perplexity'];
    let engineIndex = 0;
    let charIndex = engines[0].length;
    let isDeleting = true;
    let timeoutId;

    function tick() {
      const nameEl = document.getElementById('ai-engine-name');
      if (!nameEl) return;
      const current = engines[engineIndex];

      if (isDeleting && charIndex > 0) {
        charIndex--;
        nameEl.textContent = current.slice(0, charIndex);
        timeoutId = setTimeout(tick, 40);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        engineIndex = (engineIndex + 1) % engines.length;
        timeoutId = setTimeout(tick, 300);
      } else if (!isDeleting && charIndex < engines[engineIndex].length) {
        charIndex++;
        nameEl.textContent = engines[engineIndex].slice(0, charIndex);
        timeoutId = setTimeout(tick, 80);
      } else {
        nameEl.textContent = engines[engineIndex] + '.';
        isDeleting = true;
        timeoutId = setTimeout(() => {
          nameEl.textContent = engines[engineIndex];
          tick();
        }, 1500);
      }
    }

    const nameEl = document.getElementById('ai-engine-name');
    if (nameEl) nameEl.textContent = 'ChatGPT.';

    timeoutId = setTimeout(tick, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  async function analyze() {
    if (!url) return;
    if (/detekia\.(fr|com)/i.test(url)) {
      setEasterEgg(true);
      return;
    }
    setEasterEgg(false);
    const cleanUrl = url.replace(/^https?:\/\//, '');
    router.push(`/results?url=${encodeURIComponent(cleanUrl)}`);
  }

  const faqItems = t('homepage.faq.items');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Detekia',
    url: 'https://detekia.fr',
    description: t('homepage.schema.orgDescription'),
    founder: { '@type': 'Person', name: 'Guillaume Bourdon' },
    parentOrganization: { '@type': 'Organization', name: 'Beeleven SASU' },
    email: 'hello@detekia.fr',
    sameAs: ['https://www.linkedin.com/company/beeleven'],
  };

  const testimonialGradients = [
    'linear-gradient(135deg, #4285F4, #1C7DC4)',
    'linear-gradient(135deg, #10A37F, #0d8a6a)',
    'linear-gradient(135deg, #D97757, #c4684a)',
  ];

  // Carousel: scroll to active testimonial on click
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;
    const card = grid.children[activeTestimonial];
    if (card) {
      grid.scrollTo({ left: card.offsetLeft - grid.offsetLeft, behavior: 'smooth' });
    }
  }, [activeTestimonial]);

  // Carousel: sync active dot on manual swipe
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;
    const handleScroll = () => {
      const cardWidth = grid.children[0]?.offsetWidth || 1;
      const newIndex = Math.round(grid.scrollLeft / (cardWidth + 16));
      setActiveTestimonial(Math.min(2, Math.max(0, newIndex)));
    };
    grid.addEventListener('scroll', handleScroll, { passive: true });
    return () => grid.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <SEO
      title={t('homepage.seo.title')}
      description={t('homepage.seo.description')}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Detekia",
        "description": t('homepage.schema.appDescription'),
        "url": "https://detekia.fr",
        "image": "https://detekia.fr/og-default.png",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": [
          { "@type": "Offer", "name": t('homepage.schema.freeOffer'), "price": "0", "priceCurrency": "EUR", "availability": "https://schema.org/OnlineOnly", "description": "Score GEO gratuit en 30 secondes" },
          { "@type": "Offer", "name": t('homepage.schema.paidOffer'), "price": "29", "priceCurrency": "EUR", "availability": "https://schema.org/OnlineOnly", "description": "Audit GEO détaillé avec recommandations" }
        ],
        "featureList": t('homepage.schema.featureList'),
        "inLanguage": locale,
        "publisher": {
          "@type": "Organization",
          "name": "Beeleven SASU",
          "legalName": "Beeleven SASU",
          "url": "https://detekia.fr",
          "address": { "@type": "PostalAddress", "streetAddress": "7 rue Curial", "postalCode": "75019", "addressLocality": "Paris", "addressCountry": "FR" },
          "contactPoint": { "@type": "ContactPoint", "email": "hello@detekia.fr", "contactType": "customer support" }
        }
      }}
    />
    <Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
    </Head>
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      <Header />
      <main>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="analyser" className="hero-section" style={{ background: '#F7F5F2', padding: '64px 48px 56px' }}>
        <div className="hero-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '60% 40%', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,163,127,0.12)', border: '1.5px solid rgba(16,163,127,0.35)', borderRadius: 20, padding: '8px 18px', marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10A37F' }} />
              <span style={{ fontSize: 13, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 600 }}>{t('homepage.hero.badge')}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(38px, 5vw, 62px)', lineHeight: 1.05, letterSpacing: -2, marginBottom: 10, color: '#1A1916', maxWidth: 540 }}>
              {t('homepage.hero.titleLine1')}<br className="mobile-break" /> <span id="ai-engine-name">ChatGPT.</span><span id="ai-cursor" style={{ color: '#D97757' }}>|</span><br /><span style={{ color: '#D97757' }}>{t('homepage.hero.titleLine2')}</span>
            </h1>

            <p style={{ fontSize: 18, color: '#6B6762', maxWidth: 480, lineHeight: 1.55, fontFamily: 'system-ui', marginBottom: 6 }}>
              {t('homepage.hero.subtitle')}
            </p>

            {/* GEO definition — for visitors who don't know what it is */}
            <p style={{ fontSize: 13, color: '#B0ABA5', fontFamily: 'system-ui', lineHeight: 1.5, maxWidth: 480, marginBottom: 18 }}>
              {locale === 'en'
                ? 'GEO = getting cited in AI answers, not just ranked on Google. Different rules, different optimization.'
                : 'GEO = être cité dans les réponses des IA, pas seulement référencé sur Google. Règles différentes, optimisation différente.'}
            </p>

            {/* ── URL input principal ──────────────────────────── */}
            <div style={{ maxWidth: 600, width: '100%' }}>
              <div className="hero-input-wrap" style={{ display: 'flex', background: '#fff', border: '1.5px solid #E5E2DC', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && analyze()}
                  aria-label="URL du site à analyser"
                  placeholder={t('homepage.hero.inputPlaceholder')}
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '15px 20px', fontSize: 16, fontFamily: 'system-ui', color: '#1A1916', background: 'transparent', minWidth: 0 }}
                />
                <button
                  onClick={analyze}
                  className="btn-interactive"
                  style={{ background: '#D97757', color: '#fff', border: 'none', padding: '15px 36px', borderRadius: '0 12px 12px 0', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {locale === 'en' ? 'Get my free score →' : 'Voir mon score gratuit →'}
                </button>
              </div>
              {easterEgg && (
                <div style={{ marginTop: 14, padding: '14px 20px', background: '#FFF8F0', border: '1px solid #F0D9B5', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', color: '#1A1916', lineHeight: 1.6 }}>
                  {t('homepage.hero.easterEgg')}
                </div>
              )}
              {/* Free vs paid differentiator */}
              <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#6B6762', marginTop: 10, lineHeight: 1.5 }}>
                {locale === 'en'
                  ? '✓ Free score in 60 seconds, no signup. Full report with fixes: from €29.'
                  : '✓ Score gratuit en 60 secondes, sans inscription. Rapport complet avec corrections : à partir de 29 €.'}
              </div>
            </div>
          </div>

          <div className="hero-mockup" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ProductMockup />
          </div>
        </div>
      </section>

      {/* ── BANDEAU STATS DÉFILANTES ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #E5E2DC', borderBottom: '1px solid #E5E2DC', overflow: 'hidden' }}>
        <div className="stats-marquee-wrap">
          <div className="stats-marquee">
            <div className="stats-marquee-inner">
              {[...Array(3)].map((_, setIdx) => (
                <div key={setIdx} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  {[
                    { value: '87%', label: locale === 'en' ? 'of sites are never cited by AI' : 'des sites ne sont jamais cités par les IA' },
                    ...(auditCount ? [{ value: `${auditCount.toLocaleString('fr-FR')}+`, label: locale === 'en' ? 'sites already analyzed' : 'sites déjà analysés' }] : []),
                    { value: locale === 'en' ? 'Real citation test' : 'Test de citation réel', label: locale === 'en' ? 'we actually query ChatGPT' : 'on interroge vraiment ChatGPT' },
                    { value: locale === 'en' ? 'Recommendations with code' : 'Recommandations avec code', label: locale === 'en' ? 'copy-paste' : 'copier-coller' },
                    { value: '< 60s', label: locale === 'en' ? 'no signup' : 'sans inscription' },
                    { value: locale === 'en' ? '8 weighted criteria' : '8 critères pondérés', label: locale === 'en' ? 'open methodology' : 'méthodologie ouverte' },
                    { value: locale === 'en' ? 'Permanent report' : 'Rapport permanent', label: locale === 'en' ? 'lifetime access' : 'accessible à vie' },
                    { value: locale === 'en' ? 'Projected score' : 'Score projeté', label: locale === 'en' ? 'after fixes' : 'après corrections' },
                    { value: locale === 'en' ? '3 competitors identified' : '3 concurrents identifiés', label: locale === 'en' ? 'cited instead of you' : 'cités à votre place' },
                  ].map((stat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 28px', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#D97757', fontWeight: 700 }}>{stat.value}</span>
                      <span style={{ fontFamily: 'system-ui', fontSize: 11, color: '#6B6762' }}>{stat.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* ══ SECTION 3 — POURQUOI OPTIMISER POUR LES IA ══ */}
      <section style={{ background: '#1A1916', padding: '80px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.35)', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
              {locale === 'en' ? 'WHY IT MATTERS' : 'POURQUOI C\'EST IMPORTANT'}
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,40px)', color: '#F7F5F2', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
              {locale === 'en'
                ? <>Your customers already use AI <em style={{ color: '#D97757' }}>to make decisions</em></>
                : <>Vos clients utilisent déjà l&apos;IA <em style={{ color: '#D97757' }}>pour prendre leurs décisions</em></>}
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(247,245,242,0.45)', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 40px' }}>
              {locale === 'en'
                ? 'Detekia analyzes what prevents your site from being cited, and tells you exactly how to fix it.'
                : 'Detekia analyse ce qui empêche votre site d\'être cité, et vous dit exactement comment y remédier.'}
            </p>
          </RevealSection>

          <RevealSection delay={0.1}>
            <div className="hp-stats-shock" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { num: '28,1M', label: locale === 'en' ? 'French users ask AI every month' : 'de Français interrogent les IA chaque mois', src: 'Médiamétrie, 2025', color: '#D97757' },
                { num: '57%', label: locale === 'en' ? 'compare products via AI before buying' : 'comparent via l\'IA avant d\'acheter', src: 'SEMrush, 2025', color: '#D97757' },
                { num: '4,4x', label: locale === 'en' ? 'higher conversion from AI traffic' : 'plus de conversion via trafic IA', src: 'SEMrush, 2025', color: '#10A37F' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(247,245,242,0.04)', border: '1px solid rgba(247,245,242,0.08)', borderRadius: 12, padding: '24px 20px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 42, color: s.color, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontFamily: 'system-ui', fontSize: 12, color: 'rgba(247,245,242,0.5)', marginTop: 8, lineHeight: 1.5 }}>{s.label}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.2)', marginTop: 6 }}>{s.src}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══ SECTION 4 — POURQUOI DETEKIA (3 colonnes) ══ */}
      <section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
              {locale === 'en' ? 'WHY DETEKIA' : 'POURQUOI DETEKIA'}
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,42px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
              {locale === 'en' ? <>Optimize your AI visibility <em style={{ color: '#D97757' }}>with real data</em></> : <>Optimisez votre visibilité IA <em style={{ color: '#D97757' }}>avec de vraies données</em></>}
            </h2>
            <p style={{ fontSize: 15, color: '#6B6762', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 600, margin: '0 auto 56px' }}>
              {locale === 'en'
                ? 'Asking ChatGPT "is my site well optimized?" gives you a guess. Detekia reads your actual source code and measures 8 criteria objectively.'
                : 'Demander à ChatGPT « mon site est-il bien optimisé ? » donne un avis vague. Detekia lit votre vrai code source et mesure 8 critères objectivement.'}
            </p>
          </RevealSection>

          {/* ── 3-column comparison ── */}
          <div className="hp-compare-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, alignItems: 'stretch' }}>

            {/* Column 1 — Le problème (recessed, muted) */}
            <RevealSection delay={0.1}>
              <div style={{ background: '#EDEBE6', borderRadius: '16px 0 0 16px', padding: '36px 28px', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                {/* Faint label number */}
                <div style={{ position: 'absolute', top: 20, right: 24, fontFamily: 'Georgia, serif', fontSize: 72, color: 'rgba(26,25,22,0.05)', lineHeight: 1, userSelect: 'none' }}>01</div>

                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
                  {locale === 'en' ? 'ASKING CHATGPT' : 'DEMANDER À CHATGPT'}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#3A3835', marginBottom: 8, lineHeight: 1.2, letterSpacing: -0.5 }}>
                  {locale === 'en' ? 'A vague opinion' : 'Un avis approximatif'}
                </div>
                <p style={{ fontFamily: 'system-ui', fontSize: 12, color: '#8A8580', lineHeight: 1.6, marginBottom: 24 }}>
                  {locale === 'en'
                    ? 'ChatGPT doesn\'t inspect your HTML like a technical audit tool. It improvises from what it knows about your domain.'
                    : 'ChatGPT ne consulte pas votre HTML comme un outil d\'audit technique. Il improvise à partir de ce qu\'il connaît de votre domaine.'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
                  {(locale === 'en'
                    ? ['Generic answer, different every time', 'No access to your source code', 'No score or measurable criteria', 'Vague suggestions']
                    : ['Réponse générique, différente à chaque fois', 'Aucun accès à votre code source', 'Pas de score ni de critère mesurable', 'Suggestions vagues']
                  ).map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #C2BDB8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 9, color: '#B0ABA5', lineHeight: 1 }}>✗</span>
                      </span>
                      <span style={{ fontSize: 13, color: '#8A8580', fontFamily: 'system-ui', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Column 2 — Detekia (dark, elevated, the star) */}
            <RevealSection delay={0.2}>
              <div style={{ background: '#1A1916', borderRadius: 16, padding: '36px 28px', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', zIndex: 1, boxShadow: '0 24px 64px rgba(26,25,22,0.28), 0 4px 16px rgba(26,25,22,0.12)', transform: 'scale(1.03)' }}>
                {/* Subtle terracotta glow */}
                <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,163,127,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* "Recommandé" badge */}
                <div style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(217,119,87,0.15)', border: '1px solid rgba(217,119,87,0.35)', borderRadius: 20, padding: '4px 12px', marginBottom: 20 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D97757' }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    {locale === 'en' ? 'DETEKIA ANALYSIS' : 'ANALYSE DETEKIA'}
                  </span>
                </div>

                <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F7F5F2', marginBottom: 8, lineHeight: 1.15, letterSpacing: -0.5, position: 'relative' }}>
                  {locale === 'en' ? 'A technical diagnosis' : 'Un diagnostic technique'}
                </div>
                <p style={{ fontFamily: 'system-ui', fontSize: 12, color: 'rgba(247,245,242,0.5)', lineHeight: 1.6, marginBottom: 28, position: 'relative' }}>
                  {locale === 'en'
                    ? 'Detekia fetches your actual HTML and runs 8 weighted, transparent criteria. Every time. Reproducibly.'
                    : 'Detekia télécharge votre HTML réel et applique 8 critères pondérés et transparents. À chaque fois. De façon reproductible.'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto', position: 'relative' }}>
                  {(locale === 'en'
                    ? ['Your actual HTML analyzed page by page', '8 weighted criteria, documented methodology', 'Reproducible score out of 100', 'Recommendations ranked by impact with code']
                    : ['Votre HTML réel analysé page par page', '8 critères pondérés, méthodologie documentée', 'Score sur 100 reproductible et daté', 'Recommandations classées par impact avec code']
                  ).map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(217,119,87,0.18)', border: '1px solid rgba(217,119,87,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 9, color: '#D97757', lineHeight: 1 }}>✓</span>
                      </span>
                      <span style={{ fontSize: 13, color: 'rgba(247,245,242,0.8)', fontFamily: 'system-ui', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Column 3 — Le résultat (clean, forward-looking) */}
            <RevealSection delay={0.3}>
              <div style={{ background: '#fff', borderRadius: '0 16px 16px 0', padding: '36px 28px', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', borderLeft: '1px solid #E5E2DC' }}>
                {/* Faint label number */}
                <div style={{ position: 'absolute', top: 20, right: 24, fontFamily: 'Georgia, serif', fontSize: 72, color: 'rgba(16,163,127,0.06)', lineHeight: 1, userSelect: 'none' }}>03</div>

                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
                  {locale === 'en' ? 'THE RESULT' : 'LE RÉSULTAT'}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1916', marginBottom: 8, lineHeight: 1.2, letterSpacing: -0.5 }}>
                  {locale === 'en' ? 'A clear action plan' : 'Un plan d\'action clair'}
                </div>
                <p style={{ fontFamily: 'system-ui', fontSize: 12, color: '#6B6762', lineHeight: 1.6, marginBottom: 24 }}>
                  {locale === 'en'
                    ? 'Every recommendation includes the estimated score gain so you know what to fix first.'
                    : 'Chaque recommandation inclut le gain de score estimé pour savoir quoi corriger en priorité.'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
                  {(locale === 'en'
                    ? ['Your exact AI visibility score', 'The blockers keeping you invisible', 'What to fix first, by priority', 'Estimated impact of each correction']
                    : ['Votre score exact de visibilité IA', 'Les blocages qui vous rendent invisible', 'Ce qu\'il faut corriger en priorité', 'L\'impact estimé de chaque correction']
                  ).map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(16,163,127,0.10)', border: '1px solid rgba(16,163,127,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 9, color: '#10A37F', lineHeight: 1 }}>→</span>
                      </span>
                      <span style={{ fontSize: 13, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>

          <RevealSection delay={0.4}>
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <Link href="/methodologie" style={{ fontSize: 13, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid rgba(217,119,87,0.3)', paddingBottom: 2 }}>
                {locale === 'en' ? 'See our open methodology →' : 'Voir notre méthodologie ouverte →'}
              </Link>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', marginTop: 8 }}>
                {locale === 'en' ? 'Aggarwal et al. (Princeton/Georgia Tech, 2024) · SEMrush GEO Study, 2026' : 'Aggarwal et al. (Princeton/Georgia Tech, 2024) · Étude SEMrush GEO, 2026'}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>


      {/* ══ SECTION 5 — NOS OFFRES (pricing table, fond dark) ══ */}
      <section style={{ background: '#1A1916', padding: '96px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.35)', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
              {locale === 'en' ? 'OUR AUDITS' : 'NOS AUDITS'}
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,42px)', color: '#F7F5F2', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
              {locale === 'en' ? <>Choose the depth <em style={{ color: '#D97757' }}>that suits you</em></> : <>Choisissez la profondeur <em style={{ color: '#D97757' }}>qui vous convient</em></>}
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(247,245,242,0.45)', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 48px' }}>
              {locale === 'en'
                ? 'Each audit is independent. Start with the free score or go straight to the full report.'
                : 'Chaque audit est indépendant. Commencez par le score gratuit ou passez directement au rapport complet.'}
            </p>
          </RevealSection>

          <RevealSection delay={0.1}>
            <div className="hp-pricing-table" style={{ background: 'rgba(247,245,242,0.03)', border: '1px solid rgba(247,245,242,0.06)', borderRadius: 16, overflow: 'hidden' }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr', borderBottom: '1px solid rgba(247,245,242,0.06)' }}>
                <div style={{ padding: '24px 20px' }} />
                {[
                  { name: locale === 'en' ? 'Free scoring' : 'Scoring gratuit', price: locale === 'en' ? 'Free' : 'Gratuit', color: '#10A37F', hl: false, sub: locale === 'en' ? 'Know where you stand' : 'Savoir où vous en êtes' },
                  { name: locale === 'en' ? '1-page audit' : 'Audit 1 page', price: '29 €', color: '#D97757', hl: true, sub: locale === 'en' ? 'Fixes for one key page' : 'Corrections pour une page clé' },
                  { name: locale === 'en' ? 'Full audit' : 'Audit complet', price: '99 €', color: '#D97757', hl: false, sub: locale === 'en' ? 'Strategy for your entire site' : 'Stratégie pour tout votre site' },
                ].map((p, i) => (
                  <div key={i} style={{ padding: '28px 20px', textAlign: 'center', background: p.hl ? 'rgba(217,119,87,0.06)' : 'transparent', borderTop: p.hl ? '3px solid #D97757' : '3px solid transparent' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 32, color: p.color, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}>{p.price}</div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#F7F5F2', marginTop: 8 }}>{p.name}</div>
                    <div style={{ fontFamily: 'system-ui', fontSize: 11, color: 'rgba(247,245,242,0.35)', marginTop: 4 }}>{p.sub}</div>
                  </div>
                ))}
              </div>
              {/* Feature rows */}
              {[
                { label: locale === 'en' ? 'Score out of 100' : 'Score sur 100', vals: ['✓', '✓', '✓'] },
                { label: locale === 'en' ? '8 criteria analyzed' : '8 critères analysés', vals: ['✓', '✓', '✓'] },
                { label: locale === 'en' ? 'Pages analyzed' : 'Pages analysées', vals: ['–', '✓ (1)', '✓ (10)'] },
                { label: locale === 'en' ? 'Detailed recommendations' : 'Recommandations détaillées', vals: ['–', '✓', '✓'] },
                { label: locale === 'en' ? 'ChatGPT queries tested' : 'Requêtes ChatGPT testées', vals: ['–', '✓ (10)', '✓ (30)'] },
                { label: locale === 'en' ? 'Competitor comparison' : 'Comparaison concurrents', vals: ['–', '✓', '✓'] },
                { label: locale === 'en' ? 'Cross-page patterns' : 'Patterns transverses', vals: ['–', '–', '✓'] },
                { label: locale === 'en' ? 'Per-page summary' : 'Bilan page par page', vals: ['–', '–', '✓'] },
              ].map((row, ri) => (
                <div key={ri} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr', borderBottom: '1px solid rgba(247,245,242,0.04)', background: ri % 2 === 1 ? 'rgba(247,245,242,0.02)' : 'transparent' }}>
                  <div style={{ padding: '13px 20px', fontFamily: 'system-ui', fontSize: 13, color: 'rgba(247,245,242,0.5)', whiteSpace: 'nowrap' }}>{row.label}</div>
                  {row.vals.map((v, vi) => (
                    <div key={vi} style={{ padding: '13px 20px', textAlign: 'center', fontFamily: 'system-ui', fontSize: 13, color: v.startsWith('✓') ? '#10A37F' : v === '–' ? 'rgba(247,245,242,0.15)' : 'rgba(247,245,242,0.7)', fontWeight: v.startsWith('✓') ? 700 : 400, background: vi === 1 ? 'rgba(217,119,87,0.04)' : 'transparent' }}>
                      {v}
                    </div>
                  ))}
                </div>
              ))}
              {/* CTA row */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr', padding: '20px 0', borderTop: '1px solid rgba(247,245,242,0.08)' }}>
                <div />
                <div style={{ textAlign: 'center', padding: '0 20px' }}>
                  <Link href="/#analyser" style={{ display: 'inline-block', border: '1px solid rgba(247,245,242,0.2)', color: '#F7F5F2', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>
                    {locale === 'en' ? 'Get my score →' : 'Mon score →'}
                  </Link>
                </div>
                <div style={{ textAlign: 'center', padding: '0 20px' }}>
                  <Link href="/pricing" className="btn-interactive" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 700 }}>
                    {locale === 'en' ? 'Audit 1 page · €29 →' : 'Audit 1 page · 29 € →'}
                  </Link>
                  <div style={{ marginTop: 10 }}>
                    <a href={locale === 'en' ? '/example-report.html' : '/exemple-rapport.html'} target="_blank" rel="noopener noreferrer" className="offer-example-link" style={{ fontSize: 11, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none' }}>
                      {locale === 'en' ? 'See a sample →' : 'Voir un exemple →'}
                    </a>
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '0 20px' }}>
                  <Link href="/pricing" style={{ display: 'inline-block', background: 'rgba(247,245,242,0.1)', border: '1px solid rgba(247,245,242,0.15)', color: '#F7F5F2', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>
                    {locale === 'en' ? 'Full audit · €99 →' : 'Audit complet · 99 € →'}
                  </Link>
                  <div style={{ marginTop: 10 }}>
                    <a href={locale === 'en' ? '/example-report.html' : '/exemple-rapport.html'} target="_blank" rel="noopener noreferrer" className="offer-example-link" style={{ fontSize: 11, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none' }}>
                      {locale === 'en' ? 'See a sample →' : 'Voir un exemple →'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>


      {/* ── RÉSULTATS / TÉMOIGNAGES (temporairement activé pour screenshot) ── */}
      {<section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>{t('homepage.testimonials.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,4vw,42px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 14, lineHeight: 1.1 }}>
            {t('homepage.testimonials.title')}
          </h2>
          <p style={{ fontSize: 15, color: '#6B6762', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 48px' }}>
            {t('homepage.testimonials.subtitle')}
          </p>

          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {t('homepage.testimonials.items').map((ti, idx) => (
              <div key={idx} className="testimonial-card" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.2s ease' }}>
                <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  {ti.photo
                    ? <img src={ti.photo} alt={ti.name} width={44} height={44} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    : <div style={{ width: 44, height: 44, borderRadius: '50%', background: testimonialGradients[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{ti.initials}</div>
                  }
                  <div>
                    <div style={{ fontFamily: 'system-ui', fontSize: 15, fontWeight: 700, color: '#1A1916' }}>{ti.name}</div>
                    <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#6B6762', marginTop: 2 }}>{ti.role}</div>
                  </div>
                </div>

                <p className="testimonial-quote" style={{ fontFamily: 'system-ui', fontSize: 14, color: '#3A3835', lineHeight: 1.75, padding: '20px 24px 24px', margin: 0, flex: 1 }} dangerouslySetInnerHTML={{ __html: ti.quote }} />

                <div style={{ borderTop: '1px solid #E5E2DC', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {ti.footerType === 'score' ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#D97757', opacity: 0.5, textDecoration: 'line-through', fontWeight: 600 }}>Score {ti.before}</span>
                        <span style={{ color: 'rgba(247,245,242,0.25)', fontSize: 12 }}>→</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#10A37F', fontWeight: 700 }}>{ti.after}</span>
                      </div>
                      <span style={{ background: '#10A37F', color: '#fff', fontFamily: 'system-ui', fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 8, boxShadow: '0 2px 6px rgba(16,163,127,0.3)' }}>{ti.delta}</span>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>⚡</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>{ti.badge}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Carousel controls — mobile only */}
          <div className="testimonials-carousel-controls">
            <button
              className="testimonials-arrow testimonials-arrow-prev"
              onClick={() => setActiveTestimonial(Math.max(0, activeTestimonial - 1))}
              aria-label={t('homepage.testimonials.prev')}
              disabled={activeTestimonial === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="testimonials-dots">
              {[0, 1, 2].map(i => (
                <button
                  key={i}
                  className={"testimonials-dot" + (i === activeTestimonial ? " active" : "")}
                  onClick={() => setActiveTestimonial(i)}
                  aria-label={locale === 'fr' ? "Témoignage " + (i + 1) : "Testimonial " + (i + 1)}
                />
              ))}
            </div>
            <button
              className="testimonials-arrow testimonials-arrow-next"
              onClick={() => setActiveTestimonial(Math.min(2, activeTestimonial + 1))}
              aria-label={t('homepage.testimonials.next')}
              disabled={activeTestimonial === 2}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </section>}

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>{t('homepage.faq.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 52, lineHeight: 1.1 }}>
            {t('homepage.faq.titleStart')}<em style={{ color: '#D97757' }}>{t('homepage.faq.titleEm')}</em>
          </h2>
          <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 32px' }}>
            {faqItems.map((faq, i) => <FAQItem key={i} question={faq.q} answer={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL — MOD 6 ────────────────────────────────── */}
      <section style={{ background: '#1A1916', padding: '108px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(217,119,87,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(16,163,127,0.08) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(247,245,242,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,163,127,0.15)', border: '1px solid rgba(16,163,127,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10A37F' }} />
            <span style={{ fontSize: 12, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 500 }}>{t('homepage.finalCta.badge')}</span>
          </div>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,5vw,56px)', color: '#F7F5F2', letterSpacing: -1.5, marginBottom: 18, lineHeight: 1.05 }}>
            {t('homepage.finalCta.titleLine1')}<br /><em style={{ color: '#D97757' }}>{t('homepage.finalCta.titleEm')}</em>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 36px' }}>
            {t('homepage.finalCta.subtitle')}
          </p>

          {/* URL input — same as hero */}
          <div style={{ maxWidth: 500, margin: '0 auto 24px' }}>
            <div style={{ display: 'flex', background: 'rgba(247,245,242,0.08)', border: '1px solid rgba(247,245,242,0.15)', borderRadius: 12, overflow: 'hidden' }}>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && analyze()}
                aria-label="URL"
                placeholder={t('homepage.hero.inputPlaceholder')}
                style={{ flex: 1, border: 'none', outline: 'none', padding: '15px 20px', fontSize: 15, fontFamily: 'system-ui', color: '#F7F5F2', background: 'transparent', minWidth: 0 }}
              />
              <button
                onClick={analyze}
                className="btn-interactive"
                style={{ background: '#D97757', color: '#fff', border: 'none', padding: '15px 32px', borderRadius: '0 12px 12px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {locale === 'en' ? 'Get my score →' : 'Mon score →'}
              </button>
            </div>
          </div>

          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.3)', letterSpacing: 1 }}>
            {t('homepage.finalCta.trustBadge')}
          </div>

          {/* 4 IA chips */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            {[['#10A37F','ChatGPT'],['#D97757','Claude'],['#4285F4','Gemini'],['#1C7DC4','Perplexity']].map(([c,name]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'monospace', padding: '5px 13px', borderRadius: 20, border: `1px solid ${c}35`, background: c + '12', color: c, letterSpacing: 0.5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />{name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      </main>
      <footer style={{ borderTop: '1px solid #E5E2DC', padding: '40px 48px 32px', background: '#fff' }}>
        <div className="footer-inner" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div style={{ minWidth: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 8 }}>
              <Logo />{t('common.siteName')}
            </div>
            <div style={{ fontSize: 11, color: '#C2BDB8', fontFamily: 'system-ui' }}>{t('homepage.footer.copyright')}</div>
            <div style={{ fontSize: 11, color: '#C2BDB8', fontFamily: 'system-ui', marginTop: 4 }}>
              {locale === 'en' ? 'A product by ' : 'Un produit de l\'agence '}
              <a href="https://beeleven.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#D97757', textDecoration: 'none' }}>Beeleven</a>
            </div>
          </div>
          {['products', 'resources', 'legal'].map((section) => (
            <div key={section}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>{t(`homepage.footer.${section}.label`)}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {t(`homepage.footer.${section}.links`).map((link) => (
                  <Link key={link.href} href={link.href} style={{ fontSize: 12, color: '#6B6762', textDecoration: 'none', fontFamily: 'system-ui' }}>{link.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #6B6762; }
        @keyframes ai-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        .stats-marquee-wrap { mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%); }
        .stats-marquee { display: flex; animation: marqueeScroll 40s linear infinite; padding: 13px 0; }
        .stats-marquee:hover { animation-play-state: paused; }
        .stats-marquee-inner { display: flex; align-items: center; flex-shrink: 0; }
        @media (prefers-reduced-motion: reduce) { .stats-marquee { animation: none !important; flex-wrap: wrap; justify-content: center; gap: 8px; } }

        .hero-grid { grid-template-columns: 55% 45%; }

        @media (max-width: 640px) { .stats-marquee { animation-duration: 30s; } }

        .hp-stats-shock { grid-template-columns: repeat(3, 1fr); }
        .hp-offers-grid { grid-template-columns: repeat(3, 1fr); }
        .hp-report-features { grid-template-columns: 1fr 1fr; }
        .testimonials-grid { grid-template-columns: repeat(3, 1fr); }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .hp-stats-shock { grid-template-columns: 1fr !important; }
          .hp-pricing-table { overflow-x: auto; }
          .faq-grid { grid-template-columns: 1fr !important; }
          .hp-compare-grid { grid-template-columns: 1fr !important; }
          .hp-offers-grid { grid-template-columns: 1fr !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; padding-top: 64px !important; padding-bottom: 64px !important; }
          .hero-section { padding: 24px 20px 40px !important; }
        }

        #ai-cursor { animation: ai-blink 1.06s step-end infinite; font-weight: 300; }
        .testimonial-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.08); transform: translateY(-3px); border-color: #D5D0CA; }
        .testimonial-quote strong { color: #1A1916; font-weight: 700; }
        .card-interactive:hover { border-color: rgba(217,119,87,0.3); transform: translateY(-2px); }
        .offer-example-link { text-decoration: none !important; }
        .offer-example-link:hover { text-decoration: underline !important; }
      `}</style>
    </div>
    <BeelevenContactModal open={showBeeleven} onClose={() => setShowBeeleven(false)} />
    </>
  );
}
