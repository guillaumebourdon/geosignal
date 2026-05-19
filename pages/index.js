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
      <div style={{ background: '#1A1916', overflow: 'hidden' }}>
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
                      <span style={{ fontFamily: 'system-ui', fontSize: 11, color: 'rgba(247,245,242,0.4)' }}>{stat.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* ══ SECTION 1 — POURQUOI DETEKIA ══ */}
      <section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
              {locale === 'en' ? 'WHY DETEKIA' : 'POURQUOI DETEKIA'}
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,42px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
              {locale === 'en' ? <>Why AI recommends some sites — <em style={{ color: '#D97757' }}>and skips yours</em></> : <>Pourquoi les IA citent certains sites — <em style={{ color: '#D97757' }}>et ignorent les autres</em></>}
            </h2>
            <p style={{ fontSize: 16, color: '#6B6762', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 640, margin: '0 auto 48px' }}>
              {locale === 'en'
                ? 'Asking ChatGPT "is my site well optimized?" gets you a guess. Detekia reads your actual code — 8 measurable criteria, a score out of 100, concrete actions.'
                : 'Quand vous demandez à ChatGPT « mon site est-il bien optimisé ? », il invente. Detekia analyse le vrai code de votre site — 8 critères mesurables, un score sur 100, des actions concrètes.'}
            </p>
          </RevealSection>
          <div className="hp-compare-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: '💬', label: locale === 'en' ? 'The problem' : 'Le problème', title: locale === 'en' ? 'What ChatGPT does when you ask' : 'Ce que fait ChatGPT quand vous lui demandez', mark: '✗', markColor: '#B0ABA5', textColor: '#6B6762', border: '1px solid #E5E2DC', bg: '#fff', shadow: 'none',
                items: locale === 'en' ? ['Generic, non-reproducible answer', 'No access to your source code', 'No quantified scoring', 'Vague recommendations'] : ['Réponse générique, non reproductible', 'Aucun accès à votre code source', 'Aucun score quantifié', 'Recommandations vagues'] },
              { icon: '⚡', label: locale === 'en' ? 'Our approach' : 'Notre approche', title: locale === 'en' ? 'What Detekia does' : 'Ce que fait Detekia', mark: '✓', markColor: '#D97757', textColor: '#1A1916', border: '2px solid #D97757', bg: 'rgba(217,119,87,0.03)', shadow: '0 4px 24px rgba(217,119,87,0.1)',
                items: locale === 'en' ? ['Analysis of your actual HTML, page by page', '8 objectively measured criteria (peer-reviewed research)', 'Reproducible, dated score out of 100', 'Recommendations ranked by impact'] : ['Analyse de votre HTML réel, page par page', '8 critères mesurés objectivement (recherche académique)', 'Score sur 100, reproductible et daté', 'Recommandations classées par impact'] },
              { icon: '📊', label: locale === 'en' ? 'What you get' : 'Ce que vous obtenez', title: locale === 'en' ? 'A diagnosis, not an opinion' : 'Un diagnostic, pas une opinion', mark: '→', markColor: '#1A1916', textColor: '#1A1916', border: '1px solid #E5E2DC', bg: '#fff', shadow: 'none',
                items: locale === 'en' ? ['Your exact AI visibility score', 'The issues making you invisible', 'What to fix first', 'Estimated impact of each fix'] : ['Votre score exact de visibilité IA', 'Les blocages qui vous rendent invisible', 'Ce qu\'il faut corriger en premier', 'L\'impact estimé de chaque action'] },
            ].map((card, ci) => (
              <RevealSection key={ci} delay={ci * 0.1}>
                <div style={{ background: card.bg, border: card.border, borderRadius: 16, padding: '28px 24px', height: '100%', boxShadow: card.shadow }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: card.markColor, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{card.label}</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#1A1916', marginBottom: 14, lineHeight: 1.2 }}>{card.title}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {card.items.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <span style={{ color: card.markColor, fontSize: 11, flexShrink: 0, marginTop: 2 }}>{card.mark}</span>
                        <span style={{ fontSize: 13, color: card.textColor, fontFamily: 'system-ui', lineHeight: 1.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection delay={0.4}>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link href="/methodologie" style={{ fontSize: 12, color: '#6B6762', fontFamily: 'system-ui', textDecoration: 'none', borderBottom: '1px solid #E5E2DC', paddingBottom: 2 }}>
                {locale === 'en' ? 'View the methodology →' : 'Voir la méthodologie →'}
              </Link>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', marginTop: 10, letterSpacing: 0.5 }}>
                {locale === 'en' ? 'Open methodology · Based on academic research (Princeton, 2024) · Made in France' : 'Méthodologie ouverte · Basée sur la recherche académique (Princeton, 2024) · Made in France'}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══ SECTION 2 — COMMENT ÇA MARCHE (3 étapes) ══ */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
              {locale === 'en' ? 'HOW IT WORKS' : 'COMMENT ÇA MARCHE'}
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,42px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
              {locale === 'en' ? <>Your AI visibility score in <em style={{ color: '#D97757' }}>under 60 seconds</em></> : <>Votre score de visibilité IA en <em style={{ color: '#D97757' }}>moins de 60 secondes</em></>}
            </h2>
            <p style={{ fontSize: 16, color: '#6B6762', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 48px' }}>
              {locale === 'en' ? 'No setup. No signup. Paste your URL and get your score.' : 'Aucune installation. Aucune inscription. Collez votre URL et obtenez votre score.'}
            </p>
          </RevealSection>
          <div className="hp-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { num: '01', title: locale === 'en' ? 'Enter your URL' : 'Entrez votre URL', desc: locale === 'en' ? 'Paste the address of the page to analyze. Zero signup, zero credit card.' : 'Collez l\'adresse de la page à analyser. Zéro inscription, zéro carte bancaire.' },
              { num: '02', title: locale === 'en' ? 'We analyze everything' : 'On analyse tout', desc: locale === 'en' ? 'Detekia reads your source code and evaluates 8 criteria — content clarity, credibility, structured data, AI bot access and more.' : 'Detekia lit votre code source et évalue 8 critères — clarté du contenu, crédibilité, données structurées, accès des robots IA et plus encore.' },
              { num: '03', title: locale === 'en' ? 'Get your score' : 'Obtenez votre score', desc: locale === 'en' ? 'Score out of 100, per-criteria analysis and expert recommendations. Instant for the free audit, full report in 1 minute.' : 'Score sur 100, analyse par critère et recommandations expertes. Résultat instantané pour l\'audit gratuit, rapport complet en 1 minute.' },
            ].map((step, i) => (
              <RevealSection key={i} delay={i * 0.12}>
                <div style={{ padding: '24px 0' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 48, color: '#F0EDE8', letterSpacing: -2, fontWeight: 700, marginBottom: 12 }}>{step.num}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui' }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: '#6B6762', lineHeight: 1.65, fontFamily: 'system-ui' }}>{step.desc}</div>
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection delay={0.5}>
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <Link href="/#analyser" className="btn-interactive" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: 'system-ui' }}>
                {locale === 'en' ? 'Get my free score →' : 'Obtenir mon score gratuit →'}
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══ SECTION 3 — PLATEFORME ══ */}
      <section style={{ background: '#1A1916', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.35)', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
              {locale === 'en' ? 'THE PLATFORM' : 'LA PLATEFORME'}
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,42px)', color: '#F7F5F2', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
              {locale === 'en' ? <>Measure. Fix. <em style={{ color: '#D97757' }}>Get cited by AI.</em></> : <>Mesurez. Corrigez. <em style={{ color: '#D97757' }}>Apparaissez dans les réponses IA.</em></>}
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(247,245,242,0.45)', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 640, margin: '0 auto 56px' }}>
              {locale === 'en'
                ? 'Know where you stand. Fix what\'s blocking you. Show up in the answers your customers read — on ChatGPT, Claude, Gemini, Perplexity.'
                : 'Savoir où vous en êtes. Corriger ce qui bloque. Apparaître dans les réponses que vos clients lisent — sur ChatGPT, Claude, Gemini, Perplexity.'}
            </p>
          </RevealSection>
          <div className="hp-journey-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {/* Diagnostiquer */}
            <RevealSection delay={0.1}>
              <div style={{ background: 'rgba(247,245,242,0.08)', border: '1px solid rgba(247,245,242,0.12)', borderRadius: 16, padding: '28px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 24 }}>🔍</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', fontWeight: 700 }}>
                    {locale === 'en' ? 'Free → €29 → €99' : 'Gratuit → 29 € → 99 €'}
                  </div>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, marginBottom: 8 }}>
                  {locale === 'en' ? 'DIAGNOSE' : 'DIAGNOSTIQUER'}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#F7F5F2', lineHeight: 1.2, marginBottom: 10 }}>
                  {locale === 'en' ? 'GEO Audit' : 'Audit GEO'}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 16 }}>
                  {locale === 'en' ? 'Score out of 100 on 8 criteria. The free score shows your problems. The full report (€29-€99) tells you exactly how to fix them, with code examples.' : 'Score sur 100 sur 8 critères. Le score gratuit montre vos problèmes. Le rapport complet (29-99 €) vous dit exactement comment les corriger, avec exemples de code.'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {(locale === 'en'
                    ? ['Free score: identify your weaknesses', '€29 audit: detailed fixes + code examples', '€99 audit: 10 pages + AI recommendations', 'One-time payment · PDF exportable']
                    : ['Score gratuit : identifiez vos faiblesses', 'Audit 29 € : corrections détaillées + code', 'Audit 99 € : 10 pages + recommandations IA', 'Paiement unique · PDF exportable']
                  ).map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: '#D97757' }}>·</span>
                      <span style={{ fontSize: 11, color: 'rgba(247,245,242,0.6)', fontFamily: 'system-ui' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <Link href="/pricing" style={{ fontSize: 13, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>
                    {locale === 'en' ? 'Choose my audit →' : 'Choisir mon audit →'}
                  </Link>
                </div>
              </div>
            </RevealSection>

            {/* Surveiller (highlighted) */}
            <RevealSection delay={0.2}>
              <div style={{ background: 'rgba(247,245,242,0.10)', border: '1px solid rgba(247,245,242,0.12)', borderTop: '4px solid #D97757', borderRadius: 16, padding: '28px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>📡</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 2, marginBottom: 8 }}>
                  {locale === 'en' ? 'MONITOR' : 'SURVEILLER'}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#F7F5F2', lineHeight: 1.2, marginBottom: 10 }}>
                  {locale === 'en' ? 'AI Presence' : 'Présence IA'}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 16 }}>
                  {locale === 'en' ? 'Measure how often your brand is cited by AI on your strategic queries. Track monthly evolution and identify which competitors appear in your place.' : 'Mesurez combien de fois votre marque est citée par les IA sur vos requêtes stratégiques. Suivez l\'évolution mensuelle et identifiez les concurrents qui apparaissent à votre place.'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {(locale === 'en'
                    ? ['4 AI engines: ChatGPT, Claude, Gemini, Perplexity', 'Mention rate · Position · Sentiment', 'Competitors cited instead of you', 'Monthly monitoring available']
                    : ['4 moteurs IA : ChatGPT, Claude, Gemini, Perplexity', 'Taux de mention · Position · Sentiment', 'Concurrents cités à votre place', 'Monitoring mensuel disponible']
                  ).map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: '#10A37F' }}>·</span>
                      <span style={{ fontSize: 11, color: 'rgba(247,245,242,0.6)', fontFamily: 'system-ui' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <Link href="/presence-ia" style={{ fontSize: 13, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>
                    {locale === 'en' ? 'See if AI mentions my brand →' : 'Voir si les IA citent ma marque →'}
                  </Link>
                </div>
              </div>
            </RevealSection>

            {/* Optimiser */}
            <RevealSection delay={0.3}>
              <div style={{ background: 'rgba(247,245,242,0.08)', border: '1px solid rgba(247,245,242,0.12)', borderRadius: 16, padding: '28px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>⚙️</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#C9861A', letterSpacing: 2, marginBottom: 8 }}>
                  {locale === 'en' ? 'OPTIMIZE' : 'OPTIMISER'}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#F7F5F2', lineHeight: 1.2, marginBottom: 10 }}>
                  {locale === 'en' ? 'Implementation' : 'Mise en œuvre'}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 16 }}>
                  {locale === 'en' ? 'Beeleven, the agency behind Detekia, can implement your report\'s recommendations: technical optimizations, editorial strategy, monthly results monitoring.' : 'Beeleven, l\'agence derrière Detekia, peut implémenter les recommandations de votre rapport : optimisations techniques, stratégie éditoriale, suivi mensuel des résultats.'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {(locale === 'en'
                    ? ['Custom in-depth audit', 'Technical and editorial optimizations', 'Monthly AI visibility monitoring', 'Made in France · Paris']
                    : ['Audit approfondi sur mesure', 'Optimisations techniques et éditoriales', 'Suivi mensuel de la visibilité IA', 'Made in France · Paris']
                  ).map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: '#C9861A' }}>·</span>
                      <span style={{ fontSize: 11, color: 'rgba(247,245,242,0.6)', fontFamily: 'system-ui' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <Link href="/contact" style={{ fontSize: 13, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>
                    {locale === 'en' ? 'Get the fixes implemented →' : 'Faire implémenter les corrections →'}
                  </Link>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — RAPPORT ══ */}
      <section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
              {locale === 'en' ? '1-PAGE AUDIT' : 'AUDIT ONE-PAGE'}
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,42px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
              {locale === 'en' ? <>What your site needs to <em style={{ color: '#D97757' }}>get cited by ChatGPT</em></> : <>Ce que votre site doit changer pour <em style={{ color: '#D97757' }}>être cité par ChatGPT</em></>}
            </h2>
            <p style={{ fontSize: 15, color: '#6B6762', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 600, margin: '0 auto 48px' }}>
              {locale === 'en'
                ? 'Not a generic summary — a page-by-page diagnosis, with the exact code to fix and the estimated impact per issue. From €29, one-time payment.'
                : 'Pas un résumé générique — un diagnostic page par page, avec le code exact à corriger et l\'impact estimé sur chaque point. À partir de 29 €, paiement unique.'}
            </p>
          </RevealSection>
          <div className="hp-report-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { icon: '🔭', title: locale === 'en' ? 'AI Visibility Test' : 'Test de visibilité IA',
                desc: locale === 'en' ? 'Are your direct competitors cited by ChatGPT and Gemini on your key queries? The report reveals your actual position in AI responses compared to your market.' : 'Vos concurrents directs sont-ils cités par ChatGPT et Gemini sur vos requêtes clés ? Le rapport révèle votre position réelle dans les réponses IA par rapport à votre marché.',
                checks: locale === 'en' ? ['Real citation test on ChatGPT (10 queries)', 'Comparison with 3 identified competitors', 'Actual AI response excerpts reproduced'] : ['Test de citation réel sur ChatGPT (10 requêtes)', 'Comparaison avec 3 concurrents identifiés', 'Extraits de réponses IA reproduits'],
                note: locale === 'en' ? 'Based on real queries, not simulations.' : 'Basé sur des requêtes réelles, pas des simulations.' },
              { icon: '⚙️', title: locale === 'en' ? 'Technical evidence & documented cases' : 'Preuves techniques & cas documentés',
                desc: locale === 'en' ? 'Every weakness is documented with the exact code excerpt. Recommendations are prioritized and illustrated by real-world examples from sites that improved their citability.' : 'Chaque faiblesse est documentée avec l\'extrait de code exact. Les recommandations sont priorisées et illustrées par des exemples concrets de sites ayant amélioré leur citabilité.',
                checks: locale === 'en' ? ['Annotated code excerpts + before/after', 'Priority: Critical / Important / Bonus', 'Peer-reviewed sources + estimated impact'] : ['Extraits de code annotés + avant/après', 'Priorité : Critique / Important / Bonus', 'Sources académiques + impact estimé'],
                note: locale === 'en' ? 'Open methodology, published at detekia.fr/methodologie.' : 'Méthodologie ouverte, publiée sur detekia.fr/methodologie.' },
            ].map((card, i) => (
              <RevealSection key={i} delay={i * 0.15}>
                <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '32px 28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 24, marginBottom: 12 }}>{card.icon}</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1A1916', marginBottom: 10, lineHeight: 1.2 }}>{card.title}</div>
                  <p style={{ fontSize: 13, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 16 }}>{card.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
                    {card.checks.map((c, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#D97757', fontSize: 11 }}>✓</span>
                        <span style={{ fontSize: 12, color: '#3A3835', fontFamily: 'system-ui' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto', borderTop: '1px solid #F0EDE8', paddingTop: 12 }}>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', fontStyle: 'italic', margin: 0 }}>{card.note}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection delay={0.4}>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <a href={locale === 'en' ? '/example-report.html' : '/exemple-rapport.html'} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid rgba(217,119,87,0.3)', paddingBottom: 2 }}>
                {locale === 'en' ? 'See a sample report →' : 'Voir un exemple de rapport →'}
              </a>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', marginTop: 6 }}>
                {locale === 'en' ? 'Anonymized report from a real client' : 'Rapport anonymisé d\'un client réel'}
              </div>
              <div style={{ marginTop: 20 }}>
                <Link href="/pricing" className="btn-interactive" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: 'system-ui' }}>
                  {locale === 'en' ? 'Get my full audit — from €29 →' : 'Obtenir mon audit complet — dès 29 € →'}
                </Link>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#B0ABA5', marginTop: 10 }}>
                {locale === 'en' ? 'Starting at €29 · One-time payment' : 'À partir de 29 € · Paiement unique'}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Blog link — SEO internal linking */}
      <div style={{ background: '#fff', padding: '48px 48px', textAlign: 'center', borderTop: '1px solid #E5E2DC' }}>
        <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6B6762', marginBottom: 10 }}>
          {locale === 'en' ? 'Want to learn more about GEO and AI visibility?' : 'Envie d\'en savoir plus sur le GEO et la visibilité IA ?'}
        </p>
        <Link href="/blog" style={{ fontSize: 14, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>
          {locale === 'en' ? 'Read our guides and articles →' : 'Lire nos guides et articles →'}
        </Link>
      </div>

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
          <div style={{ marginTop: 12 }}>
            <Link href="/contact" style={{ fontSize: 13, color: 'rgba(247,245,242,0.4)', fontFamily: 'system-ui', textDecoration: 'none', borderBottom: '1px solid rgba(247,245,242,0.15)', paddingBottom: 1 }}>
              {locale === 'en' ? 'Or talk to an expert →' : 'Ou parler à un expert →'}
            </Link>
          </div>

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

        .hp-compare-grid { grid-template-columns: repeat(3, 1fr); }
        .hp-report-grid { grid-template-columns: 1fr 1fr; }
        .hp-journey-grid { grid-template-columns: repeat(3, 1fr); }
        .testimonials-grid { grid-template-columns: repeat(3, 1fr); }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-visual { max-width: 340px; margin: 0 auto; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .hp-compare-grid { grid-template-columns: 1fr !important; }
          .hp-report-grid { grid-template-columns: 1fr !important; }
          .hp-journey-grid { grid-template-columns: 1fr !important; }
          .hp-steps { grid-template-columns: 1fr !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; padding-top: 64px !important; padding-bottom: 64px !important; }
          .hero-section { padding: 16px 20px 40px !important; }
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
