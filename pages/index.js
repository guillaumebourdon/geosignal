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
        <div style={{ fontSize: 14, fontWeight: 500, color: open ? '#1A1916' : '#3A3835', fontFamily: 'system-ui', transition: 'color 0.3s' }}>{question}</div>
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

/* ─── Criteria card — simplified (MOD 4) ────────────────── */
function CriteriaCard({ icon, color, name, desc, checks, tag, tagColor }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', border: `1px solid ${hov ? color : '#E5E2DC'}`, borderRadius: 14, padding: '24px', transition: 'border-color 0.22s, box-shadow 0.22s, transform 0.18s', boxShadow: hov ? `0 8px 28px ${color}18` : '0 2px 12px rgba(26,25,22,0.06)', transform: hov ? 'translateY(-2px)' : 'none', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 14, right: 14, fontFamily: 'monospace', fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: tagColor, background: tagColor + '14', border: `1px solid ${tagColor}28`, padding: '3px 8px', borderRadius: 20 }}>{tag}</div>
      <div style={{ width: 46, height: 46, borderRadius: '50%', background: color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14, flexShrink: 0 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1916', marginBottom: 6, fontFamily: 'Georgia, serif' }}>{name}</div>
      <div style={{ fontSize: 12, color: '#6B6762', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 12, flex: 1 }}>{desc}</div>
      <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: 12 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 7, fontStyle: 'italic' }}>Signaux mesurés</div>
        {checks.slice(0, 2).map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />
            <span style={{ fontSize: 11, color: '#6B6762', fontFamily: 'system-ui' }}>{c}</span>
          </div>
        ))}
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

  const features = [
    { icon: '🎯', color: '#10A37F', tag: 'Contenu', tagColor: '#4285F4', name: 'Extractibilité', desc: "Votre contenu répond-il clairement dès les premières lignes ? Les IA cherchent des réponses prêtes à citer.", checks: ['Intro directe en 1-2 phrases', 'Listes et tableaux structurés'] },
    { icon: '🔬', color: '#10A37F', tag: 'Contenu', tagColor: '#4285F4', name: 'Vérifiabilité', desc: "Chiffres sourcés, dates, liens vers preuves — les IA citent ce qu'elles peuvent vérifier.", checks: ['Données chiffrées avec source', 'Liens vers études ou références'] },
    { icon: '🏆', color: '#D97757', tag: 'Autorité', tagColor: '#C9861A', name: 'Autorité E-E-A-T', desc: "Expérience, Expertise, Autorité, Confiance — les 4 piliers que les IA évaluent en priorité.", checks: ['Auteur identifié avec biographie', 'Schema Organization JSON-LD'] },
    { icon: '🤖', color: '#10A37F', tag: 'Technique', tagColor: '#10A37F', name: 'Crawlabilité IA', desc: "GPTBot, ClaudeBot, OAI-SearchBot — votre site leur est-il accessible sans friction ?", checks: ['Pas de noindex bloquant', 'Balise lang définie'] },
    { icon: '🧩', color: '#1C7DC4', tag: 'Technique', tagColor: '#10A37F', name: 'Données structurées', desc: "Schema.org FAQPage, Organization, Article — le langage natif des IA pour comprendre votre contenu.", checks: ['Schema FAQPage ou Article', 'JSON-LD bien formé'] },
    { icon: '⚖️', color: '#10A37F', tag: 'Contenu', tagColor: '#4285F4', name: 'Neutralité éditoriale', desc: "Un contenu factuel et nuancé est 3× plus cité qu'un contenu promotionnel ou superlatif.", checks: ['Ton informatif et factuel', 'Absence de superlatifs non prouvés'] },
    { icon: '🌐', color: '#8B5CF6', tag: 'Autorité', tagColor: '#C9861A', name: 'Présence externe', desc: "Mentions presse, réseaux sociaux, citations tierces — les signaux d'autorité croisés.", checks: ['Mentions presse avec liens', 'Réseaux sociaux actifs'] },
    { icon: '📅', color: '#C9861A', tag: 'Contenu', tagColor: '#4285F4', name: 'Fraîcheur', desc: "Les IA privilégient les contenus récents et maintenus pour les sujets qui évoluent.", checks: ['dateModified en JSON-LD', 'Copyright de l\'année en cours'] },
  ];

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
    sameAs: [],
  };

  /* ─── Style arrays for translated sections ─── */
  const compStyles = [
    { bg: 'rgba(217,119,87,0.08)', border: 'rgba(217,119,87,0.2)', titleColor: '#F7F5F2', subtitleColor: 'rgba(247,245,242,0.4)', mark: '✗', markColor: '#D97757', itemColor: 'rgba(247,245,242,0.7)' },
    { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', titleColor: '#F7F5F2', subtitleColor: 'rgba(247,245,242,0.4)', mark: '→', markColor: '#D97757', itemColor: 'rgba(247,245,242,0.75)' },
    { bg: 'rgba(16,163,127,0.06)', border: 'rgba(16,163,127,0.22)', titleColor: '#F7F5F2', subtitleColor: '#10A37F', mark: '✓', markColor: '#10A37F', itemColor: 'rgba(247,245,242,0.78)' },
  ];
  const stepColors = ['#10A37F', '#D97757', '#4285F4'];
  const reportStyles = [
    { bg: '#FAFAF9', border: '#E5E2DC', iconBg: 'rgba(217,119,87,0.1)', titleColor: '#1A1916', descColor: '#6A6660', dotColor: '#D97757', checkText: '#3A3835' },
    { bg: '#1A1916', border: '#1A1916', iconBg: 'rgba(217,119,87,0.15)', titleColor: '#F7F5F2', descColor: 'rgba(247,245,242,0.6)', dotColor: '#D97757', checkText: 'rgba(247,245,242,0.75)' },
    { bg: '#FAFAF9', border: '#E5E2DC', iconBg: 'rgba(16,163,127,0.1)', titleColor: '#1A1916', descColor: '#6A6660', dotColor: '#10A37F', checkText: '#3A3835' },
  ];
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
      <section className="hero-section" style={{ background: '#F7F5F2', padding: '20px 48px 32px' }}>
        <div className="hero-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '60% 40%', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,163,127,0.12)', border: '1.5px solid rgba(16,163,127,0.35)', borderRadius: 20, padding: '8px 18px', marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10A37F' }} />
              <span style={{ fontSize: 13, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 600 }}>{t('homepage.hero.badge')}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(38px, 5vw, 62px)', lineHeight: 1.05, letterSpacing: -2, marginBottom: 10, color: '#1A1916', maxWidth: 540 }}>
              {t('homepage.hero.titleLine1')}<br className="mobile-break" /> <span id="ai-engine-name">ChatGPT.</span><span id="ai-cursor" style={{ color: '#D97757' }}>|</span><br /><span style={{ color: '#D97757' }}>{t('homepage.hero.titleLine2')}</span>
            </h1>

            <p style={{ fontSize: 18, color: '#6B6762', maxWidth: 480, lineHeight: 1.55, fontFamily: 'system-ui', marginBottom: 16 }}>
              {t('homepage.hero.subtitle')}
            </p>

            {/* ── URL input principal ──────────────────────────── */}
            <div style={{ maxWidth: 600, width: '100%' }}>
              <div className="hero-input-wrap" style={{ display: 'flex', background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && analyze()}
                  aria-label="URL du site à analyser"
                  placeholder={t('homepage.hero.inputPlaceholder')}
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '13px 20px', fontSize: 16, fontFamily: 'system-ui', color: '#1A1916', background: 'transparent', minWidth: 0 }}
                />
                <button
                  onClick={analyze}
                  className="btn-interactive"
                  style={{ background: '#D97757', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: '0 10px 10px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {t('homepage.hero.cta')}
                </button>
              </div>
              {easterEgg && (
                <div style={{ marginTop: 14, padding: '14px 20px', background: '#FFF8F0', border: '1px solid #F0D9B5', borderRadius: 10, fontSize: 14, fontFamily: 'system-ui', color: '#1A1916', lineHeight: 1.6 }}>
                  {t('homepage.hero.easterEgg')}
                </div>
              )}
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', letterSpacing: 1, marginTop: 8 }}>
                {t('homepage.hero.trustBadge')}
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
                    { value: auditCount ? `${auditCount.toLocaleString('fr-FR')}+` : '...', label: locale === 'en' ? 'audits performed' : 'audits réalisés' },
                    { value: '8', label: locale === 'en' ? 'citability criteria' : 'critères de citabilité' },
                    { value: '4', label: locale === 'en' ? 'LLMs tested' : 'LLMs testés' },
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

      {/* ══ DIAGNOSTIQUER → SURVEILLER → OPTIMISER ══ */}
      <section style={{ background: '#1A1916', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.35)', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
              {locale === 'en' ? 'THE PLATFORM' : 'LA PLATEFORME'}
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,42px)', color: '#F7F5F2', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
              {locale === 'en' ? <>Diagnose. Monitor. <em style={{ color: '#D97757' }}>Optimize.</em></> : <>Diagnostiquer. Surveiller. <em style={{ color: '#D97757' }}>Optimiser.</em></>}
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(247,245,242,0.45)', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 640, margin: '0 auto 56px' }}>
              {locale === 'en'
                ? 'A complete platform for your AI visibility — from the first diagnostic to ongoing monitoring and hands-on optimization.'
                : 'Une plateforme complète pour votre visibilité IA — du premier diagnostic au monitoring continu et à l\'optimisation terrain.'}
            </p>
          </RevealSection>

          <div className="hp-journey-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {/* ── COL 1 : DIAGNOSTIQUER ── */}
            <RevealSection delay={0.1}>
              <div style={{ background: 'rgba(247,245,242,0.04)', border: '1px solid rgba(247,245,242,0.08)', borderRadius: 16, padding: '28px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, marginBottom: 10 }}>
                  {locale === 'en' ? 'STEP 1' : 'ÉTAPE 1'}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F7F5F2', lineHeight: 1.15, marginBottom: 6 }}>
                  {locale === 'en' ? 'Diagnose' : 'Diagnostiquer'}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 16 }}>
                  {locale === 'en' ? 'Understand where you stand. Score /100 on 8 citability criteria, recommendations, and a real ChatGPT citation test.' : 'Comprenez où vous en êtes. Score /100 sur 8 critères de citabilité, recommandations et test de citation ChatGPT réel.'}
                </p>

                {/* Mini-visuel : score + barres */}
                <div style={{ background: '#1A1916', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#F7F5F2', letterSpacing: -2 }}>73<span style={{ fontSize: 11, color: 'rgba(247,245,242,0.2)' }}>/100</span></div>
                    <div style={{ background: 'rgba(201,134,26,0.18)', border: '1px solid rgba(201,134,26,0.3)', borderRadius: 12, padding: '2px 8px', fontFamily: 'monospace', fontSize: 7, color: '#C9861A', fontWeight: 700 }}>{locale === 'en' ? 'AVG' : 'MOYEN'}</div>
                  </div>
                  {[72, 80, 87, 30].map((pct, i) => (
                    <div key={i} style={{ height: 3, background: 'rgba(247,245,242,0.06)', borderRadius: 2, marginBottom: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757', borderRadius: 2 }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                  {(locale === 'en'
                    ? ['Free score in 30 seconds', 'One-Page audit — 29 €', 'Pro audit with AI reco — 99 €']
                    : ['Score gratuit en 30 secondes', 'Audit One-Page — 29 €', 'Audit Pro avec reco IA — 99 €']
                  ).map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: i === 0 ? '#10A37F' : '#D97757' }}>{i === 0 ? '✓' : '→'}</span>
                      <span style={{ fontSize: 11, color: 'rgba(247,245,242,0.6)', fontFamily: 'system-ui' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Link href="/pricing" className="btn-interactive" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '10px 20px', borderRadius: 9, fontWeight: 700, fontSize: 12, textDecoration: 'none', fontFamily: 'system-ui' }}>
                    {locale === 'en' ? 'Get my score →' : 'Obtenir mon score →'}
                  </Link>
                </div>
              </div>
            </RevealSection>

            {/* ── COL 2 : SURVEILLER (Présence IA) ── */}
            <RevealSection delay={0.2}>
              <div style={{ background: 'rgba(247,245,242,0.04)', border: '1px solid rgba(247,245,242,0.08)', borderRadius: 16, padding: '28px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 2, marginBottom: 10 }}>
                  {locale === 'en' ? 'STEP 2' : 'ÉTAPE 2'}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F7F5F2', lineHeight: 1.15, marginBottom: 6 }}>
                  {locale === 'en' ? 'Monitor' : 'Surveiller'}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 16 }}>
                  {locale === 'en' ? 'Track what ChatGPT, Claude, Gemini and Perplexity say about your brand on 75+ strategic queries.' : 'Suivez ce que ChatGPT, Claude, Gemini et Perplexity disent de votre marque sur 75+ requêtes stratégiques.'}
                </p>

                {/* Mini-visuel : dashboard Présence IA (inspiré du vrai rapport) */}
                <div style={{ background: '#0f1119', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                  {/* KPIs row */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    {[
                      { val: '44%', label: locale === 'en' ? 'Mentioned' : 'Mention', color: '#22d3ee' },
                      { val: '2.1', label: 'Position', color: '#10b981' },
                      { val: '12%', label: locale === 'en' ? 'Negative' : 'Négatif', color: '#f472b6' },
                    ].map((kpi, i) => (
                      <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: kpi.color, lineHeight: 1 }}>{kpi.val}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: 6, color: 'rgba(247,245,242,0.25)', marginTop: 2, letterSpacing: 0.5 }}>{kpi.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Mini query grid */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                    {[
                      { q: locale === 'en' ? 'best bank for...' : 'meilleure banque...', results: [1, 1, 0, 1] },
                      { q: locale === 'en' ? 'savings account...' : 'livret épargne...', results: [0, 0, 0, 1] },
                      { q: locale === 'en' ? 'investment app...' : 'app investir...', results: [1, 0, 1, 0] },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <div style={{ fontFamily: 'system-ui', fontSize: 8, color: 'rgba(247,245,242,0.35)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.q}</div>
                        <div style={{ display: 'flex', gap: 3 }}>
                          {['GPT', 'Cld', 'Gem', 'Ppl'].map((llm, j) => (
                            <div key={j} style={{ width: 12, height: 12, borderRadius: 3, background: row.results[j] ? 'rgba(16,163,127,0.2)' : 'rgba(247,245,242,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontSize: 7, color: row.results[j] ? '#10A37F' : 'rgba(247,245,242,0.15)' }}>{row.results[j] ? '✓' : '✗'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                  {(locale === 'en'
                    ? ['4 LLMs queried in real conditions', 'Mention rate, position, sentiment', 'Competitor benchmarking', 'Interactive dashboard']
                    : ['4 LLMs interrogés en conditions réelles', 'Taux de mention, position, sentiment', 'Benchmark concurrentiel', 'Dashboard interactif']
                  ).map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: '#10A37F' }}>✓</span>
                      <span style={{ fontSize: 11, color: 'rgba(247,245,242,0.6)', fontFamily: 'system-ui' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Link href="/presence-ia" className="btn-interactive" style={{ display: 'inline-block', background: '#10A37F', color: '#fff', padding: '10px 20px', borderRadius: 9, fontWeight: 700, fontSize: 12, textDecoration: 'none', fontFamily: 'system-ui' }}>
                    {locale === 'en' ? 'Request a demo →' : 'Demander une démo →'}
                  </Link>
                </div>
              </div>
            </RevealSection>

            {/* ── COL 3 : OPTIMISER (Accompagnement) ── */}
            <RevealSection delay={0.3}>
              <div style={{ background: 'rgba(247,245,242,0.04)', border: '1px solid rgba(247,245,242,0.08)', borderRadius: 16, padding: '28px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#4285F4', letterSpacing: 2, marginBottom: 10 }}>
                  {locale === 'en' ? 'STEP 3' : 'ÉTAPE 3'}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F7F5F2', lineHeight: 1.15, marginBottom: 6 }}>
                  {locale === 'en' ? 'Optimize' : 'Optimiser'}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 16 }}>
                  {locale === 'en' ? 'We implement the fixes for you. Content strategy, technical optimization, ongoing GEO support.' : 'On implémente les corrections pour vous. Stratégie de contenu, optimisation technique, accompagnement GEO continu.'}
                </p>

                {/* Mini-visuel : progression score */}
                <div style={{ background: '#1A1916', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(247,245,242,0.2)', letterSpacing: 1, marginBottom: 8 }}>
                    {locale === 'en' ? 'SCORE PROGRESSION' : 'PROGRESSION DU SCORE'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
                    {[34, 42, 55, 63, 71, 78, 85, 91].map((v, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <div style={{ width: '100%', height: `${v * 0.5}px`, background: i < 2 ? '#D97757' : i < 5 ? '#C9861A' : '#10A37F', borderRadius: 2, transition: 'height 0.8s cubic-bezier(0.22,1,0.36,1)' }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 7, color: '#D97757' }}>M1</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 7, color: '#10A37F' }}>M8</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                  {(locale === 'en'
                    ? ['Audit recommendations implemented', 'Content optimized for AI citation', 'Monthly re-audit & tracking', 'Dedicated GEO expert']
                    : ['Recommandations d\'audit implémentées', 'Contenu optimisé pour la citation IA', 'Ré-audit et suivi mensuel', 'Expert GEO dédié']
                  ).map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: '#4285F4' }}>✓</span>
                      <span style={{ fontSize: 11, color: 'rgba(247,245,242,0.6)', fontFamily: 'system-ui' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Link href="/contact" className="btn-interactive" style={{ display: 'inline-block', background: 'transparent', color: '#F7F5F2', padding: '9px 20px', borderRadius: 9, fontWeight: 700, fontSize: 12, textDecoration: 'none', fontFamily: 'system-ui', border: '1.5px solid rgba(247,245,242,0.2)' }}>
                    {locale === 'en' ? 'Book a call →' : 'Prendre rendez-vous →'}
                  </Link>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ══ POURQUOI C'EST IMPORTANT (3 stats) ══ */}
      <section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <RevealSection>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,40px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
              {locale === 'en' ? 'AI is the new front door' : 'Les IA sont la nouvelle porte d\'entrée'}
            </h2>
            <p style={{ fontSize: 15, color: '#6B6762', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 40px' }}>
              {locale === 'en'
                ? 'When a prospect asks ChatGPT "best CRM for SMBs" and your competitor is cited but not you — that\'s a lost lead.'
                : 'Quand un prospect demande à ChatGPT "meilleur CRM pour PME" et que votre concurrent est cité mais pas vous — c\'est un lead perdu.'}
            </p>
          </RevealSection>
          <div className="hp-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { num: '28,1M', desc: locale === 'en' ? 'French people use AI monthly' : 'de Français utilisent les IA chaque mois', src: 'Médiamétrie, 2025', color: '#D97757' },
              { num: '57%', desc: locale === 'en' ? 'compare products via AI before buying' : 'comparent des produits via l\'IA avant d\'acheter', src: 'SEMrush, 2025', color: '#D97757' },
              { num: '4,4x', desc: locale === 'en' ? 'higher conversion from AI traffic' : 'de conversion en plus via le trafic IA', src: 'SEMrush, 2025', color: '#1A1916' },
            ].map((s, i) => (
              <RevealSection key={i} delay={i * 0.12} direction="scale">
                <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '32px 24px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 42, fontWeight: 900, color: s.color, letterSpacing: -2, lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: 14, color: '#6B6762', fontFamily: 'system-ui', marginTop: 10, lineHeight: 1.5 }}>{s.desc}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', marginTop: 8 }}>{s.src}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMMENT ÇA MARCHE (4 étapes) ══ */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <RevealSection>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,40px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 48, lineHeight: 1.1 }}>
              {locale === 'en' ? 'How it works' : 'Comment ça marche'}
            </h2>
          </RevealSection>
          <div className="hp-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { num: '01', title: locale === 'en' ? 'Paste your URL' : 'Collez votre URL', desc: locale === 'en' ? 'No signup. No credit card. You paste, we analyze.' : 'Aucune inscription. Aucune carte bancaire. Vous collez, on analyse.' },
              { num: '02', title: locale === 'en' ? 'We inspect your source code' : 'On inspecte votre code source', desc: locale === 'en' ? '8 criteria analyzed: crawlability, structured data, authority, extractability... Plus a real ChatGPT citation test.' : '8 critères passés au crible : crawlabilité, données structurées, autorité, extractabilité… Plus un test de citation ChatGPT réel.' },
              { num: '03', title: locale === 'en' ? 'You get your diagnosis' : 'Vous recevez votre diagnostic', desc: locale === 'en' ? 'Score /100, critical blockers identified, prioritized recommendations with code examples.' : 'Score /100, blocages critiques identifiés, recommandations priorisées avec exemples de code.' },
              { num: '04', title: locale === 'en' ? 'Track your AI presence' : 'Suivez votre présence IA', desc: locale === 'en' ? 'Implement fixes, re-audit, and monitor what AI engines say about your brand over time.' : 'Implémentez les corrections, ré-auditez, et suivez ce que les IA disent de votre marque dans le temps.' },
            ].map((step, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 12, padding: 22 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 28, color: '#D97757', marginBottom: 12, letterSpacing: -1, fontWeight: 700 }}>{step.num}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1916', marginBottom: 6, fontFamily: 'system-ui' }}>{step.title}</div>
                  <div style={{ fontSize: 12, color: '#6B6762', lineHeight: 1.6, fontFamily: 'system-ui' }}>{step.desc}</div>
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection delay={0.5}>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link href="/methodologie" style={{ fontSize: 13, color: '#6B6762', fontFamily: 'system-ui', textDecoration: 'none', borderBottom: '1px solid #E5E2DC', paddingBottom: 2 }}>
                {locale === 'en' ? 'How we calculate your score (open methodology) →' : 'Comment on calcule votre score (méthodologie ouverte) →'}
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      <SectionDivider />

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
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>{t('homepage.faq.label')}</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 52, lineHeight: 1.1 }}>
            {t('homepage.faq.titleStart')}<em style={{ color: '#D97757' }}>{t('homepage.faq.titleEm')}</em>
          </h2>
          <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
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

          <Link href="/" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '16px 40px', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', fontFamily: 'system-ui', boxShadow: '0 8px 24px rgba(217,119,87,0.4)', letterSpacing: -0.2 }}>
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
        @keyframes heroCardFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes heroFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .stats-marquee-wrap { mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%); }
        .stats-marquee { display: flex; animation: marqueeScroll 40s linear infinite; padding: 13px 0; }
        .stats-marquee:hover { animation-play-state: paused; }
        .stats-marquee-inner { display: flex; align-items: center; flex-shrink: 0; }
        @media (prefers-reduced-motion: reduce) { .stats-marquee { animation: none !important; flex-wrap: wrap; justify-content: center; gap: 8px; } }

        .hero-grid { grid-template-columns: 55% 45%; }
        .hero-card { animation: heroFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-visual { padding: 16px 0; }

        @media (max-width: 640px) { .stats-marquee { animation-duration: 30s; } }

        .hp-journey-grid { grid-template-columns: repeat(3, 1fr); }
        .hp-dimensions-grid { grid-template-columns: 1fr 1fr; }
        .hp-stats-grid { grid-template-columns: repeat(3, 1fr); }
        .testimonials-grid { grid-template-columns: repeat(3, 1fr); }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-visual { max-width: 340px; margin: 0 auto; }
          .hero-floating-badge { right: 0 !important; bottom: -20px !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .hp-journey-grid { grid-template-columns: 1fr !important; }
          .hp-dimensions-grid { grid-template-columns: 1fr !important; }
          .hp-stats-grid { grid-template-columns: 1fr !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; padding-top: 64px !important; padding-bottom: 64px !important; }
          .hero-section { padding: 16px 20px 40px !important; }
          .hero-card { max-width: 300px !important; }
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
