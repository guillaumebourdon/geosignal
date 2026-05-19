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
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  {[
                    ...(auditCount ? [{ value: `${auditCount.toLocaleString('fr-FR')}+`, label: locale === 'en' ? 'audits performed' : 'audits réalisés' }] : []),
                    { value: '8', label: locale === 'en' ? 'criteria analyzed' : 'critères analysés' },
                    { value: '4', label: locale === 'en' ? 'AI engines tested' : 'IA testées' },
                    { value: '30s', label: locale === 'en' ? 'average analysis' : 'analyse moyenne' },
                    { value: '28,1M', label: locale === 'en' ? 'French AI users/month' : 'utilisateurs IA/mois en France' },
                    { value: '4,4x', label: locale === 'en' ? 'conversion from AI traffic' : 'de conversion via trafic IA' },
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
                ? 'Detekia analyzes what prevents your site from being cited — and tells you exactly how to fix it.'
                : 'Detekia analyse ce qui empêche votre site d\'être cité — et vous dit exactement comment y remédier.'}
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
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
              {locale === 'en' ? 'WHY DETEKIA' : 'POURQUOI DETEKIA'}
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,42px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
              {locale === 'en' ? <>Optimize your AI visibility <em style={{ color: '#D97757' }}>with real data</em></> : <>Optimisez votre visibilité IA <em style={{ color: '#D97757' }}>avec de vraies données</em></>}
            </h2>
            <p style={{ fontSize: 15, color: '#6B6762', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 600, margin: '0 auto 48px' }}>
              {locale === 'en'
                ? 'Asking ChatGPT "is my site well optimized?" gives you a guess. Detekia reads your actual source code and measures 8 criteria objectively.'
                : 'Demander à ChatGPT « mon site est-il bien optimisé ? » donne un avis vague. Detekia lit votre vrai code source et mesure 8 critères objectivement.'}
            </p>
          </RevealSection>
          <div className="hp-compare-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {/* Carte 1 — Le problème */}
            <RevealSection delay={0.1}>
              <div style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 16, padding: '32px 24px', height: '100%' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>💬</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
                  {locale === 'en' ? 'ASKING CHATGPT' : 'DEMANDER À CHATGPT'}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#1A1916', marginBottom: 14, lineHeight: 1.25 }}>
                  {locale === 'en' ? 'A vague opinion' : 'Un avis approximatif'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(locale === 'en'
                    ? ['Generic answer, different every time', 'No access to your source code', 'No score or measurable criteria', 'Vague suggestions']
                    : ['Réponse générique, différente à chaque fois', 'Aucun accès à votre code source', 'Pas de score ni de critère mesurable', 'Suggestions vagues']
                  ).map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: '#B0ABA5', fontSize: 11, flexShrink: 0, marginTop: 2 }}>✗</span>
                      <span style={{ fontSize: 13, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Carte 2 — Detekia (mise en avant) */}
            <RevealSection delay={0.2}>
              <div style={{ background: '#fff', border: '2px solid #D97757', borderRadius: 16, padding: '32px 24px', height: '100%', boxShadow: '0 4px 24px rgba(217,119,87,0.1)' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>⚡</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
                  {locale === 'en' ? 'DETEKIA ANALYSIS' : 'ANALYSE DETEKIA'}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#1A1916', marginBottom: 14, lineHeight: 1.25 }}>
                  {locale === 'en' ? 'A technical diagnosis' : 'Un diagnostic technique'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(locale === 'en'
                    ? ['Your actual HTML analyzed page by page', '8 weighted criteria, peer-reviewed methodology', 'Reproducible score out of 100', 'Recommendations ranked by impact with code']
                    : ['Votre HTML réel analysé page par page', '8 critères pondérés, méthodologie académique', 'Score sur 100 reproductible et daté', 'Recommandations classées par impact avec code']
                  ).map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: '#D97757', fontSize: 11, flexShrink: 0, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 13, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Carte 3 — Résultat */}
            <RevealSection delay={0.3}>
              <div style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 16, padding: '32px 24px', height: '100%' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>📊</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
                  {locale === 'en' ? 'THE RESULT' : 'LE RÉSULTAT'}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#1A1916', marginBottom: 14, lineHeight: 1.25 }}>
                  {locale === 'en' ? 'A clear action plan' : 'Un plan d\'action clair'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(locale === 'en'
                    ? ['Your exact AI visibility score', 'The blockers keeping you invisible', 'What to fix first — with priorities', 'Estimated impact of each correction']
                    : ['Votre score exact de visibilité IA', 'Les blocages qui vous rendent invisible', 'Ce qu\'il faut corriger en priorité', 'L\'impact estimé de chaque correction']
                  ).map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: '#10A37F', fontSize: 11, flexShrink: 0, marginTop: 2 }}>→</span>
                      <span style={{ fontSize: 13, color: '#1A1916', fontFamily: 'system-ui', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
          <RevealSection delay={0.4}>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link href="/methodologie" style={{ fontSize: 13, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid rgba(217,119,87,0.3)', paddingBottom: 2 }}>
                {locale === 'en' ? 'See our open methodology →' : 'Voir notre méthodologie ouverte →'}
              </Link>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', marginTop: 8 }}>
                {locale === 'en' ? 'Based on academic research (Princeton, 2024) · Made in France' : 'Basée sur la recherche académique (Princeton, 2024) · Made in France'}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══ SECTION 5 — NOS OFFRES (3 cartes indépendantes) ══ */}
      <section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
              {locale === 'en' ? 'OUR AUDITS' : 'NOS AUDITS'}
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,42px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
              {locale === 'en' ? <>Choose the level of depth <em style={{ color: '#D97757' }}>that suits you</em></> : <>Choisissez le niveau de profondeur <em style={{ color: '#D97757' }}>qui vous convient</em></>}
            </h2>
            <p style={{ fontSize: 15, color: '#6B6762', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 600, margin: '0 auto 48px' }}>
              {locale === 'en'
                ? 'Every day counts. Each audit is independent — start with the free score or go straight to the full report.'
                : 'Chaque jour compte. Chaque audit est indépendant — commencez par le score gratuit ou passez directement au rapport complet.'}
            </p>
          </RevealSection>

          <div className="hp-offers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              {
                price: locale === 'en' ? 'Free' : 'Gratuit', priceColor: '#10A37F',
                title: locale === 'en' ? 'Free scoring' : 'Scoring gratuit',
                desc: locale === 'en' ? 'Your AI visibility score in 60 seconds — no signup, no commitment.' : 'Votre score de visibilité IA en 60 secondes — sans inscription, sans engagement.',
                bullets: locale === 'en'
                  ? ['Score out of 100 on 8 criteria', 'Strengths and weaknesses identified', 'One recommendation preview', 'Instant result']
                  : ['Score sur 100 sur 8 critères', 'Forces et faiblesses identifiées', 'Aperçu d\'une recommandation', 'Résultat instantané'],
                ideal: locale === 'en' ? 'You want to know where you stand' : 'Vous voulez savoir où vous en êtes',
                cta: locale === 'en' ? 'Get my free score →' : 'Obtenir mon score gratuit →',
                href: '/#analyser',
              },
              {
                price: '29 €', priceColor: '#D97757',
                title: locale === 'en' ? '1-page audit' : 'Audit 1 page',
                desc: locale === 'en' ? 'Complete diagnosis of one page — every blocker explained, every fix documented with code.' : 'Diagnostic complet d\'une page — chaque blocage expliqué, chaque correction documentée avec le code.',
                bullets: locale === 'en'
                  ? ['Detailed recommendations with code examples', 'Real ChatGPT citation test (10 queries)', 'Comparison with 3 competitors', 'Web report + PDF · One-time payment']
                  : ['Recommandations détaillées avec exemples de code', 'Test de citation ChatGPT réel (10 requêtes)', 'Comparaison avec 3 concurrents', 'Rapport web + PDF · Paiement unique'],
                ideal: locale === 'en' ? 'You want to optimize a homepage, a product page, or a landing page' : 'Vous voulez optimiser une homepage, une fiche produit, ou une landing page',
                cta: locale === 'en' ? 'Get the 1-page audit — €29 →' : 'Obtenir l\'audit 1 page — 29 € →',
                href: '/pricing',
              },
              {
                price: '99 €', priceColor: '#D97757',
                title: locale === 'en' ? 'Full audit' : 'Audit complet',
                desc: locale === 'en' ? 'Your 10 key pages analyzed together — cross-page patterns detected, site-wide action plan.' : 'Vos 10 pages clés analysées ensemble — patterns transverses détectés, plan d\'action global.',
                bullets: locale === 'en'
                  ? ['10 pages analyzed in depth', '30 real ChatGPT queries tested', 'AI-powered recommendations', 'Projected score after fixes · PDF']
                  : ['10 pages analysées en profondeur', '30 requêtes ChatGPT réelles testées', 'Recommandations enrichies par IA', 'Score projeté après corrections · PDF'],
                ideal: locale === 'en' ? 'You want a GEO strategy for your entire site' : 'Vous voulez une stratégie GEO pour l\'ensemble de votre site',
                cta: locale === 'en' ? 'Get the full audit — €99 →' : 'Obtenir l\'audit complet — 99 € →',
                href: '/pricing',
              },
            ].map((offer, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '32px 28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Idéal pour — en haut, visible */}
                  <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#D97757', fontWeight: 600, marginBottom: 14, padding: '6px 12px', background: 'rgba(217,119,87,0.06)', borderRadius: 8, alignSelf: 'flex-start' }}>
                    {offer.ideal}
                  </div>
                  {/* Price */}
                  <div style={{ fontFamily: 'monospace', fontSize: 28, color: offer.priceColor, fontWeight: 700, marginBottom: 4, letterSpacing: -1 }}>{offer.price}</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1916', marginBottom: 8, lineHeight: 1.2 }}>{offer.title}</div>
                  <p style={{ fontSize: 13, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 16 }}>{offer.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                    {offer.bullets.map((b, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10, color: offer.priceColor }}>✓</span>
                        <span style={{ fontSize: 12, color: '#3A3835', fontFamily: 'system-ui' }}>{b}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <Link href={offer.href} className="btn-interactive" style={{ display: 'inline-block', background: '#1A1916', color: '#fff', padding: '11px 24px', borderRadius: 9, fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: 'system-ui' }}>
                      {offer.cta}
                    </Link>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection delay={0.4}>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <a href={locale === 'en' ? '/example-report.html' : '/exemple-rapport.html'} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid rgba(217,119,87,0.3)', paddingBottom: 2 }}>
                {locale === 'en' ? 'See a sample report →' : 'Voir un exemple de rapport →'}
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── RÉSULTATS / TÉMOIGNAGES (temporairement activé pour screenshot) ── */}
      {<section style={{ background: '#1A1916', padding: '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '60%', left: '80%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,163,127,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.35)', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>{t('homepage.testimonials.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,4vw,42px)', color: '#F7F5F2', textAlign: 'center', letterSpacing: -1.5, marginBottom: 14, lineHeight: 1.1 }}>
            {t('homepage.testimonials.title')}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(247,245,242,0.45)', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 48px' }}>
            {t('homepage.testimonials.subtitle')}
          </p>

          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {t('homepage.testimonials.items').map((ti, idx) => (
              <div key={idx} className="testimonial-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.2s ease' }}>
                <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  {ti.photo
                    ? <img src={ti.photo} alt={ti.name} width={44} height={44} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    : <div style={{ width: 44, height: 44, borderRadius: '50%', background: testimonialGradients[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{ti.initials}</div>
                  }
                  <div>
                    <div style={{ fontFamily: 'system-ui', fontSize: 15, fontWeight: 700, color: '#F7F5F2' }}>{ti.name}</div>
                    <div style={{ fontFamily: 'system-ui', fontSize: 12, color: 'rgba(247,245,242,0.4)', marginTop: 2 }}>{ti.role}</div>
                  </div>
                </div>

                <p className="testimonial-quote" style={{ fontFamily: 'system-ui', fontSize: 14, color: 'rgba(247,245,242,0.7)', lineHeight: 1.75, padding: '20px 24px 24px', margin: 0, flex: 1 }} dangerouslySetInnerHTML={{ __html: ti.quote }} />

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                      <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#10A37F', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>{ti.badge}</span>
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

      <SectionDivider />

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>{t('homepage.faq.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 52, lineHeight: 1.1 }}>
            {t('homepage.faq.titleStart')}<em style={{ color: '#D97757' }}>{t('homepage.faq.titleEm')}</em>
          </h2>
          <div>
            {faqItems.map((faq, i) => <FAQItem key={i} question={faq.q} answer={faq.a} />)}
          </div>
        </div>
      </section>

      <SectionDivider />

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

          <Link href="/#analyser" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '16px 40px', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', fontFamily: 'system-ui', boxShadow: '0 8px 24px rgba(217,119,87,0.4)', letterSpacing: -0.2 }}>
            {t('homepage.finalCta.cta')}
          </Link>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.3)', letterSpacing: 1, marginTop: 16 }}>
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

          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.18)', letterSpacing: 1, marginTop: 24 }}>
            {t('homepage.finalCta.priceNote')}
          </p>
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
        @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
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
          .hp-compare-grid { grid-template-columns: 1fr !important; }
          .hp-offers-grid { grid-template-columns: 1fr !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; padding-top: 64px !important; padding-bottom: 64px !important; }
          .hero-section { padding: 24px 20px 40px !important; }
        }

        #ai-cursor { animation: ai-blink 1.06s step-end infinite; font-weight: 300; }
        .testimonial-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.35); transform: translateY(-3px); border-color: rgba(255,255,255,0.14); }
        .testimonial-quote strong { color: #F7F5F2; font-weight: 700; }
        .card-interactive:hover { border-color: rgba(217,119,87,0.3); transform: translateY(-2px); }
      `}</style>
    </div>
    <BeelevenContactModal open={showBeeleven} onClose={() => setShowBeeleven(false)} />
    </>
  );
}
