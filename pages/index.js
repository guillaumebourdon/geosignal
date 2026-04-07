import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

/* ─── Helpers ───────────────────────────────────────────── */
const Logo = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
    {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => <div key={i} style={{ background: c, borderRadius: '50%' }} />)}
  </div>
);

const SectionDivider = () => (
  <div style={{ height: 1, background: 'rgba(26,25,22,0.07)' }} />
);

const Label = ({ children, color = '#8A8680' }) => (
  <div style={{ fontFamily: 'monospace', fontSize: 9, color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{children}</div>
);

/* ─── FAQ accordion ─────────────────────────────────────── */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #E5E2DC', overflow: 'hidden' }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div style={{ padding: '22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default' }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: open ? '#1A1916' : '#3A3835', fontFamily: 'system-ui', transition: 'color 0.3s' }}>{question}</div>
        <div style={{ width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${open ? '#1A1916' : '#E5E2DC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 20, transition: 'all 0.3s', background: open ? '#1A1916' : 'transparent' }}>
          <span style={{ fontSize: 15, color: open ? '#F7F5F2' : '#8A8680', lineHeight: 1, transition: 'all 0.3s', transform: open ? 'rotate(45deg)' : 'none', display: 'block' }}>+</span>
        </div>
      </div>
      <div style={{ maxHeight: open ? '300px' : '0', opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease' }}>
        <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.8, fontFamily: 'system-ui', paddingBottom: 22 }}>{answer}</div>
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
      <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 12, flex: 1 }}>{desc}</div>
      <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: 12 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 7, fontStyle: 'italic' }}>Signaux mesurés</div>
        {checks.slice(0, 2).map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />
            <span style={{ fontSize: 11, color: '#8A8680', fontFamily: 'system-ui' }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Hero product mockup — MOD 2 ───────────────────────── */
function ProductMockup() {
  return (
    <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 32px 80px rgba(26,25,22,0.18), 0 4px 16px rgba(26,25,22,0.06)', overflow: 'hidden', maxWidth: 390, width: '100%', border: '1px solid rgba(26,25,22,0.06)' }}>

      {/* macOS-style mini header */}
      <div style={{ background: '#F0EDE8', borderBottom: '1px solid #E5E2DC', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#F87171','#FBBF24','#34D399'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 0.5, marginLeft: 6 }}>Audit de visibilité IA · exemple.fr</div>
      </div>

      {/* Score block */}
      <div style={{ background: '#1A1916', padding: '36px 32px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '40%', left: 24, transform: 'translateY(-50%)', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: '#D97757', opacity: 0.05 }} />

        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.3)', letterSpacing: 2, marginBottom: 18, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D97757' }} /> Score de visibilité IA
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, position: 'relative' }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 96, color: '#F7F5F2', lineHeight: 1, letterSpacing: -4 }}>38</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.25)', letterSpacing: 1 }}>/100</div>
          </div>
          <div style={{ paddingBottom: 16 }}>
            <div style={{ display: 'inline-block', background: '#D97757', borderRadius: 20, padding: '4px 13px', fontFamily: 'monospace', fontSize: 9, color: '#fff', letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>FAIBLE</div>
            <div style={{ fontSize: 11, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.6 }}>4 blocages critiques<br />détectés sur votre site</div>
          </div>
        </div>
      </div>

      {/* Critique */}
      <div style={{ padding: '20px 26px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: 1, padding: '3px 9px', borderRadius: 4, background: 'rgba(217,119,87,0.12)', color: '#D97757', fontWeight: 700 }}>CRITIQUE — CRAWLABILITÉ</span>
        </div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1A1916', lineHeight: 1.3, marginBottom: 8 }}>
          ChatGPT ne peut pas accéder à votre site.
        </div>
        <div style={{ fontSize: 12, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.6 }}>
          Votre fichier robots.txt bloque les bots IA — 73 % des sites ont ce problème sans le savoir. Résultat : aucune IA ne peut lire ni citer votre contenu.
        </div>
      </div>

      {/* Action verte */}
      <div style={{ margin: '14px 26px 0', padding: '12px 14px', background: 'rgba(16,163,127,0.08)', border: '1px solid rgba(16,163,127,0.25)', borderRadius: 10 }}>
        <div style={{ fontSize: 11, color: '#0E8A6B', fontFamily: 'system-ui', lineHeight: 1.55 }}>
          <strong>À corriger :</strong> Autorisez GPTBot, ClaudeBot et PerplexityBot dans votre robots.txt. 2 lignes à modifier.
        </div>
      </div>

      {/* Impact doré */}
      <div style={{ margin: '10px 26px 18px', padding: '10px 14px', background: 'rgba(201,134,26,0.10)', border: '1px solid rgba(201,134,26,0.28)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>↑</span>
        <span style={{ fontSize: 11, color: '#A06A14', fontFamily: 'system-ui', fontWeight: 600 }}>+12 points de visibilité estimés</span>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '13px 26px 15px', background: 'rgba(217,119,87,0.05)', borderTop: '1px solid #EDEBE6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#1A1916', fontFamily: 'system-ui' }}>+14 recommandations verrouillées</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#D97757', fontFamily: 'system-ui', background: 'rgba(217,119,87,0.12)', padding: '6px 14px', borderRadius: 20 }}>Débloquer →</div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function Home() {
  const [url, setUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const engines = ['ChatGPT', 'Gemini', 'Claude', 'Perplexity'];
    let engineIndex = 0;
    let charIndex = engines[0].length; // ChatGPT already fully typed
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
        // Word complete — show dot
        nameEl.textContent = engines[engineIndex] + '.';
        isDeleting = true;
        timeoutId = setTimeout(() => {
          // Remove dot before deleting
          nameEl.textContent = engines[engineIndex];
          tick();
        }, 1500);
      }
    }

    // Show dot on initial ChatGPT
    const nameEl = document.getElementById('ai-engine-name');
    if (nameEl) nameEl.textContent = 'ChatGPT.';

    timeoutId = setTimeout(tick, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  async function analyze() {
    if (!url) return;
    const cleanUrl = url.replace(/^https?:\/\//, '');
    router.push(`/results?url=${encodeURIComponent(cleanUrl)}`);
  }

  const faqs = [
    { question: "Est-ce différent de demander directement à ChatGPT ?", answer: "Oui, fondamentalement. Demander à ChatGPT 'mon site est-il bien optimisé ?' donne un avis générique basé sur ce qu'il sait de votre URL — souvent approximatif et non reproductible. Detekia analyse le DOM réel de votre page : structure HTML, schema.org, méta-données, liens, contenu. Le résultat est un score quantifié sur 100, 8 critères mesurés objectivement, et des recommandations priorisées par impact. C'est la différence entre une opinion et un diagnostic." },
    { question: "C'est quoi le GEO et en quoi c'est différent du SEO ?", answer: "Le GEO (Generative Engine Optimization) est l'art d'optimiser votre site pour apparaître dans les réponses des intelligences artificielles — ChatGPT, Claude, Gemini, Perplexity. Contrairement au SEO qui vise à ranker sur Google, le GEO vise à être cité et recommandé directement dans les réponses des IA. Les critères sont différents : les IA valorisent la clarté, la citabilité, la crédibilité et les données structurées." },
    { question: "Comment fonctionne l'analyse Detekia ?", answer: "Entrez l'URL de votre site, Detekia scrape votre contenu et l'analyse selon 8 critères GEO : extractibilité, vérifiabilité, autorité E-E-A-T, crawlabilité IA, données structurées, neutralité éditoriale, présence externe et fraîcheur. Notre IA génère ensuite des recommandations expertes personnalisées pour votre site. La méthodologie complète est disponible sur la page Méthodologie." },
    { question: "Pourquoi l'analyse est-elle vraiment gratuite ?", answer: "L'analyse de base — score sur 100, 8 critères détaillés, une recommandation experte en aperçu — est totalement gratuite et sans inscription. Aucune carte bancaire requise. Nous croyons que tout le monde devrait pouvoir savoir si son site est visible par les IA. Le rapport complet avec toutes les recommandations détaillées et les plans d'action est disponible à 29 €, paiement unique." },
    { question: "Qu'est-ce qu'un bon score GEO ?", answer: "Sur Detekia, un score supérieur à 70/100 est considéré comme bon. Entre 45 et 70, votre site a des bases solides mais nécessite des optimisations ciblées. En dessous de 45, des actions prioritaires s'imposent. La majorité des sites analysés obtiennent un score entre 15 et 45 — même les grandes marques obtiennent souvent des scores faibles car leurs sites sont optimisés pour vendre, pas pour être cités par les IA." },
    { question: "Les données de mon site sont-elles conservées ?", answer: "Non. Detekia analyse votre site en temps réel et ne conserve aucune donnée de votre site au-delà de 24h. Les résultats d'analyse sont mis en cache 24h pour accélérer les analyses successives du même site, mais aucune donnée personnelle n'est stockée." },
    { question: "Detekia fonctionne-t-il pour tous les types de sites ?", answer: "Oui — e-commerce, blogs, SaaS, sites vitrine, portfolios, sites institutionnels. Les critères GEO sont universels. Certains types de sites ont toutefois un avantage naturel : les blogs avec du contenu éditorial riche, les sites avec une forte présence presse, et les plateformes qui publient des données originales. Mais tous les sites peuvent progresser significativement avec les bonnes optimisations." },
    { question: "Que se passe-t-il si mon score ne s'améliore pas ?", answer: "Les recommandations du rapport sont concrètes et priorisées par impact. Si vous les appliquez et que votre score n'évolue pas, contactez-nous à hello@detekia.fr — on analyse le cas avec vous gratuitement." },
    { question: "Qui est derrière Detekia ?", answer: "Detekia est développé par Beeleven, une agence spécialisée en stratégie digitale et IA basée à Paris. L'outil est conçu par des experts en SEO, GEO et intelligence artificielle qui travaillent quotidiennement avec les moteurs génératifs." },
    { question: "Satisfait ou remboursé ?", answer: "Oui. Si le rapport ne vous apporte aucune piste d'amélioration actionnable, envoyez-nous un email dans les 7 jours suivant l'achat à hello@detekia.fr et nous vous remboursons intégralement, sans condition." },
  ];

  const features = [
    { icon: '🎯', color: '#4285F4', tag: 'Contenu', tagColor: '#4285F4', name: 'Extractibilité', desc: "Votre contenu répond-il clairement dès les premières lignes ? Les IA cherchent des réponses prêtes à citer.", checks: ['Intro directe en 1-2 phrases', 'Listes et tableaux structurés'] },
    { icon: '🔬', color: '#10A37F', tag: 'Contenu', tagColor: '#4285F4', name: 'Vérifiabilité', desc: "Chiffres sourcés, dates, liens vers preuves — les IA citent ce qu'elles peuvent vérifier.", checks: ['Données chiffrées avec source', 'Liens vers études ou références'] },
    { icon: '🏆', color: '#D97757', tag: 'Autorité', tagColor: '#C9861A', name: 'Autorité E-E-A-T', desc: "Expérience, Expertise, Autorité, Confiance — les 4 piliers que les IA évaluent en priorité.", checks: ['Auteur identifié avec biographie', 'Schema Organization JSON-LD'] },
    { icon: '🤖', color: '#4285F4', tag: 'Technique', tagColor: '#10A37F', name: 'Crawlabilité IA', desc: "GPTBot, ClaudeBot, OAI-SearchBot — votre site leur est-il accessible sans friction ?", checks: ['Pas de noindex bloquant', 'Balise lang définie'] },
    { icon: '🧩', color: '#1C7DC4', tag: 'Technique', tagColor: '#10A37F', name: 'Données structurées', desc: "Schema.org FAQPage, Organization, Article — le langage natif des IA pour comprendre votre contenu.", checks: ['Schema FAQPage ou Article', 'JSON-LD bien formé'] },
    { icon: '⚖️', color: '#10A37F', tag: 'Contenu', tagColor: '#4285F4', name: 'Neutralité éditoriale', desc: "Un contenu factuel et nuancé est 3× plus cité qu'un contenu promotionnel ou superlatif.", checks: ['Ton informatif et factuel', 'Absence de superlatifs non prouvés'] },
    { icon: '🌐', color: '#8B5CF6', tag: 'Autorité', tagColor: '#C9861A', name: 'Présence externe', desc: "Mentions presse, réseaux sociaux, citations tierces — les signaux d'autorité croisés.", checks: ['Mentions presse avec liens', 'Réseaux sociaux actifs'] },
    { icon: '📅', color: '#C9861A', tag: 'Contenu', tagColor: '#4285F4', name: 'Fraîcheur', desc: "Les IA privilégient les contenus récents et maintenus pour les sujets qui évoluent.", checks: ['dateModified en JSON-LD', 'Copyright de l\'année en cours'] },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Detekia',
    url: 'https://detekia.fr',
    description: "Outil d'audit GEO — Mesurez et améliorez la visibilité de votre site dans les réponses IA (ChatGPT, Gemini, Claude, Perplexity).",
    founder: { '@type': 'Person', name: 'Guillaume Bourdon' },
    parentOrganization: { '@type': 'Organization', name: 'Beeleven SASU' },
    email: 'hello@detekia.fr',
    sameAs: [],
  };

  return (
    <>
    <Head>
      <link rel="canonical" href="https://detekia.fr" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
    </Head>
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="detekia-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 58, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <Logo />Detekia
        </a>
        <div className="nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <a href="/blog" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Blog</a>
          <a href="/pricing" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Tarifs</a>
          <a href="/methodologie" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Méthodologie</a>
          <a href="/a-propos" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>À propos</a>
          <a href="/contact" className="nav-link-secondary" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Contact</a>
          <a href="/" className="nav-cta" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontFamily: 'system-ui' }}>Analyser gratuitement</a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero-section" style={{ background: '#F7F5F2', padding: '20px 48px 32px' }}>
        <div className="hero-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '60% 40%', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,163,127,0.12)', border: '1.5px solid rgba(16,163,127,0.35)', borderRadius: 20, padding: '8px 18px', marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10A37F' }} />
              <span style={{ fontSize: 13, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 600 }}>Analyse 100% gratuite — aucune inscription</span>
            </div>

            <h1 style={{ fontSize: 'clamp(38px, 5vw, 62px)', lineHeight: 1.05, letterSpacing: -2, marginBottom: 10, color: '#1A1916', maxWidth: 540 }}>
              Vos concurrents apparaissent dans<br className="mobile-break" /> <span id="ai-engine-name">ChatGPT.</span><span id="ai-cursor" style={{ color: '#D97757' }}>|</span><br /><span style={{ color: '#D97757' }}>Pas vous.</span>
            </h1>

            <p style={{ fontSize: 18, color: '#6B6762', maxWidth: 480, lineHeight: 1.55, fontFamily: 'system-ui', marginBottom: 16 }}>
              Detekia audite votre site en 30 secondes et vous montre quoi corriger pour être cité par les IA.
            </p>

            {/* ── URL input principal ──────────────────────────── */}
            <div style={{ maxWidth: 600, width: '100%' }}>
              <div className="hero-input-wrap" style={{ display: 'flex', background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && analyze()}
                  placeholder="https://www.votre-site.fr"
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '13px 20px', fontSize: 16, fontFamily: 'system-ui', color: '#1A1916', background: 'transparent', minWidth: 0 }}
                />
                <button
                  onClick={analyze}
                  style={{ background: '#1A1916', color: '#F7F5F2', border: 'none', padding: '13px 32px', borderRadius: '0 10px 10px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Analyser mon site →
                </button>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 1, marginTop: 8 }}>
                Gratuit · Sans inscription · Résultat en 30 secondes
              </div>
            </div>
          </div>

          <div className="hero-mockup" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ProductMockup />
          </div>
        </div>
      </section>

      {/* ── MICRO BANDEAU PREUVE D'USAGE — MOD 9 ────────────── */}
      <div style={{ background: '#fff', borderTop: '1px solid rgba(26,25,22,0.07)', borderBottom: '1px solid rgba(26,25,22,0.07)', padding: '12px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 48, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            ['1 247', 'analyses réalisées'],
            ['38/100', 'score moyen observé'],
            ['Extractibilité', 'critère le plus bloquant'],
          ].map(([val, lbl]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: '#1A1916', letterSpacing: -0.5 }}>{val}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 2, textTransform: 'uppercase' }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      <SectionDivider />

      {/* ── PLUS QU'UN AVIS IA ───────────────────────────────── */}
      <section style={{ background: '#F7F5F2', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Pourquoi Detekia</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(30px,4vw,42px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 14, lineHeight: 1.1 }}>
            Plus qu&apos;un avis IA : un diagnostic reproductible
          </h2>
          <p style={{ fontSize: 15, color: '#8A8680', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 620, margin: '0 auto 48px' }}>
            Demander à ChatGPT &laquo;&nbsp;mon site est-il bien optimisé&nbsp;?&raquo; donne un avis vague. Detekia analyse le code réel de votre site.
          </p>

          <div className="diff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              {
                bg: '#FAFAF9',
                border: '#E5E2DC',
                icon: '💬',
                title: 'Demander à ChatGPT',
                titleColor: '#1A1916',
                subtitle: 'Avis subjectif',
                subtitleColor: '#8A8680',
                mark: '✗',
                markColor: '#D97757',
                itemColor: '#6B6762',
                items: [
                  'Réponse générique et non reproductible',
                  'Aucun accès au code de votre site',
                  'Pas de scoring chiffré',
                  'Recommandations vagues',
                ],
              },
              {
                bg: '#1A1916',
                border: 'rgba(255,255,255,0.08)',
                icon: '⚡',
                title: 'Analyser avec Detekia',
                titleColor: '#F7F5F2',
                subtitle: 'Diagnostic technique',
                subtitleColor: 'rgba(247,245,242,0.4)',
                mark: '→',
                markColor: '#D97757',
                itemColor: 'rgba(247,245,242,0.75)',
                items: [
                  'Analyse du HTML réel de votre site',
                  '8 critères mesurés objectivement',
                  'Score sur 100, reproductible',
                  'Recommandations classées par impact',
                ],
              },
              {
                bg: 'rgba(16,163,127,0.03)',
                border: 'rgba(16,163,127,0.18)',
                icon: '📊',
                title: 'Ce que vous obtenez',
                titleColor: '#1A1916',
                subtitle: 'Actionnable',
                subtitleColor: '#10A37F',
                mark: '✓',
                markColor: '#10A37F',
                itemColor: '#3A3835',
                items: [
                  'Votre score de visibilité IA exact',
                  'Les blocages qui vous rendent invisible',
                  'Quoi corriger en premier',
                  "L'impact estimé de chaque correction",
                ],
              },
            ].map(({ bg, border, icon, title, titleColor, subtitle, subtitleColor, mark, markColor, itemColor, items }) => (
              <div key={title} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: 28 }}>
                <div style={{ fontSize: 26, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: titleColor, fontFamily: 'Georgia, serif', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 11, color: subtitleColor, fontFamily: 'monospace', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 18 }}>{subtitle}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ fontSize: 13, color: itemColor, fontFamily: 'system-ui', lineHeight: 1.55, display: 'flex', gap: 8 }}>
                      <span style={{ color: markColor, fontWeight: 700, flexShrink: 0 }}>{mark}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <SectionDivider />

      {/* ── POUR QUI ─────────────────────────────────────────── */}
      <section style={{ background: '#F7F5F2', padding: '80px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Public cible</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
            Pour qui est Detekia ?
          </h2>
          <p style={{ fontSize: 15, color: '#8A8680', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 48px' }}>
            Que vous soyez fondateur, marketeur ou créateur de contenu, votre visibilité IA est un enjeu business.
          </p>
          <div className="target-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
            {[
              { emoji: '🚀', title: 'Fondateurs SaaS / B2B', desc: "Vos concurrents sont cités par les IA, pas vous. Découvrez pourquoi — et comment reprendre votre place dans les réponses de ChatGPT et Perplexity." },
              { emoji: '🛒', title: 'E-commerçants', desc: "Les IA recommandent des produits à des millions d'utilisateurs chaque jour. Assurez-vous que les vôtres apparaissent dans ces recommandations." },
              { emoji: '✍️', title: 'Blogueurs & créateurs de contenu', desc: "Vous produisez du contenu de qualité. Mais les IA le citent-elles ? Identifiez ce qui manque pour que votre expertise soit reprise et recommandée." },
              { emoji: '📈', title: 'Agences & freelances marketing', desc: "Ajoutez l'audit de visibilité IA à votre offre client. Detekia vous donne un diagnostic structuré à présenter en quelques clics." },
            ].map(({ emoji, title, desc }) => (
              <div key={title} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 28 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#6B6762', lineHeight: 1.65, fontFamily: 'system-ui' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Comment ça marche</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 56, lineHeight: 1.1 }}>
            L&apos;analyse de visibilité IA complète en <em style={{ color: '#D97757' }}>30 secondes</em>
          </h2>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              ['01','#10A37F','Entrez votre URL','Collez l\'adresse de votre site. Zéro inscription, zéro configuration, zéro carte bancaire.'],
              ['02','#D97757','On analyse tout','Detekia scrape votre site et l\'évalue selon 8 critères GEO validés par la recherche.'],
              ['03','#4285F4','Recevez votre score','Score sur 100, analyse par critère et recommandations expertes en moins de 30 secondes.'],
            ].map(([num,color,title,desc]) => (
              <div key={num} style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 14, padding: '24px', boxShadow: '0 2px 12px rgba(26,25,22,0.06)' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 38, color, marginBottom: 16, letterSpacing: -1 }}>{num}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'Georgia, serif' }}>{title}</div>
                <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui' }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <a href="/methodologie" style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', textDecoration: 'none', borderBottom: '1px solid #E5E2DC', paddingBottom: 2 }}>
              Voir la méthodologie complète →
            </a>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── UN RAPPORT QUI VAUT LE DÉTOUR ─────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Rapport complet</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 16, lineHeight: 1.1 }}>
            Un rapport qui <em style={{ color: '#D97757' }}>vaut le détour</em>
          </h2>
          <p style={{ fontSize: 15, color: '#8A8680', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 56px' }}>
            14 pages d'analyse approfondie avec des données exclusives que vous ne trouverez nulle part ailleurs.
          </p>

          {/* 3 cards */}
          <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 48 }}>

            {/* Card 1 — Test de visibilité IA */}
            <div style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(217,119,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔭</div>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: '#1A1916', marginBottom: 8, lineHeight: 1.2 }}>Test de visibilité IA</div>
                <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6A6660', lineHeight: 1.7 }}>Vos concurrents directs sont-ils cités par ChatGPT et Gemini sur vos requêtes clés ? Le rapport révèle votre position réelle dans les réponses IA par rapport à votre marché.</div>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {['Requêtes testées sur 4 moteurs IA', 'Comparatif avec 3 concurrents', 'Extraits de réponses réelles'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D97757', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'system-ui', fontSize: 12, color: '#3A3835' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2 — Preuves techniques */}
            <div style={{ background: '#1A1916', border: '1px solid #1A1916', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(217,119,87,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚙️</div>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: '#F7F5F2', marginBottom: 8, lineHeight: 1.2 }}>Preuves techniques</div>
                <div style={{ fontFamily: 'system-ui', fontSize: 13, color: 'rgba(247,245,242,0.6)', lineHeight: 1.7 }}>Chaque point faible est documenté avec la source exacte dans votre HTML. Vous savez précisément quoi modifier, à quelle ligne, et pourquoi ça bloque votre citabilité.</div>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {['Extraits de code annotés', 'Avant / après pour chaque fix', 'Priorité Critique / Important / Bonus'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D97757', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'system-ui', fontSize: 12, color: 'rgba(247,245,242,0.75)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3 — Cas réels documentés */}
            <div style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,163,127,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📚</div>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: '#1A1916', marginBottom: 8, lineHeight: 1.2 }}>Cas réels documentés</div>
                <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6A6660', lineHeight: 1.7 }}>Chaque recommandation est illustrée par un cas concret issu de sites ayant amélioré leur citabilité IA. Pas de théorie — des preuves que ça fonctionne, avec les résultats mesurés.</div>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {['Études de cas avec résultats chiffrés', 'Sources académiques (KDD 2024)', 'Impact estimé sur votre score'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10A37F', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'system-ui', fontSize: 12, color: '#3A3835' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <a href="/pricing" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '16px 40px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: 'system-ui', boxShadow: '0 8px 24px rgba(217,119,87,0.35)' }}>
              Débloquer mon rapport — 29 € →
            </a>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8', marginTop: 12, letterSpacing: 1 }}>
              Paiement unique · Accès immédiat · Satisfait ou remboursé 7 jours
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <a href="/api/preview-report?url=qonto.com" target="_blank" style={{ fontSize: 13, color: '#D97757', textDecoration: 'underline', fontFamily: 'system-ui' }}>
              📄 Voir un exemple de rapport complet (HTML)
            </a>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── RÉSULTATS / TÉMOIGNAGES ──────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Résultats</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,4vw,42px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 14, lineHeight: 1.1 }}>
            Ils ont analysé leur site
          </h2>
          <p style={{ fontSize: 15, color: '#8A8680', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 48px' }}>
            Des résultats concrets, mesurables, en quelques jours.
          </p>

          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              {
                initials: 'TL',
                gradient: 'linear-gradient(135deg, #4285F4, #1C7DC4)',
                name: 'Thomas L.',
                role: 'Fondateur · Kairos SaaS',
                quote: <>On pensait être bien référencés, mais Detekia a révélé que <strong>ChatGPT ne pouvait même pas accéder à notre site</strong>. Deux lignes modifiées dans le robots.txt et notre score est passé de 29 à 58 en une semaine.</>,
                footerType: 'score',
                footerBg: 'rgba(217,119,87,0.04)',
                before: 29, after: 58, delta: '+29 pts',
              },
              {
                initials: 'MG',
                gradient: 'linear-gradient(135deg, #10A37F, #0d8a6a)',
                name: 'Marine G.',
                role: 'Consultante SEO freelance',
                quote: <>J'utilise Detekia pour chaque nouveau client. En 30 secondes j'ai <strong>un diagnostic clair à présenter</strong>, et ça me permet de vendre une prestation d'optimisation IA derrière. Le ROI est immédiat.</>,
                footerType: 'badge',
                footerBg: 'rgba(16,163,127,0.03)',
                badge: 'UTILISÉ POUR CHAQUE CLIENT',
              },
              {
                initials: 'JB',
                gradient: 'linear-gradient(135deg, #D97757, #c4684a)',
                name: 'Julien B.',
                role: 'Resp. e-commerce · Maison Verdure',
                quote: <>Nos fiches produits étaient invisibles pour les IA. Le rapport a identifié <strong>3 blocages critiques</strong>. Après correction, Perplexity a commencé à recommander nos produits en 3 semaines.</>,
                footerType: 'score',
                footerBg: 'rgba(217,119,87,0.04)',
                before: 34, after: 71, delta: '+37 pts',
              },
            ].map((t, i) => (
              <div key={i} className="testimonial-card" style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.2s ease' }}>
                <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontFamily: 'system-ui', fontSize: 15, fontWeight: 700, color: '#1A1916' }}>{t.name}</div>
                    <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#8A8680', marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>

                <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#3A3835', lineHeight: 1.75, padding: '20px 24px 24px', margin: 0, flex: 1 }}>{t.quote}</p>

                <div style={{ background: t.footerBg, borderTop: '1px solid #E5E2DC', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {t.footerType === 'score' ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#D97757', opacity: 0.5, textDecoration: 'line-through', fontWeight: 600 }}>Score {t.before}</span>
                        <span style={{ color: '#8A8680', fontSize: 12 }}>→</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#10A37F', fontWeight: 700 }}>{t.after}</span>
                      </div>
                      <span style={{ background: '#10A37F', color: '#fff', fontFamily: 'system-ui', fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 8, boxShadow: '0 2px 6px rgba(16,163,127,0.3)' }}>{t.delta}</span>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>⚡</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#10A37F', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>{t.badge}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>FAQ</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 52, lineHeight: 1.1 }}>
            Questions <em style={{ color: '#D97757' }}>fréquentes</em>
          </h2>
          <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {faqs.map((faq, i) => <FAQItem key={i} question={faq.question} answer={faq.answer} />)}
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
            <span style={{ fontSize: 12, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 500 }}>Gratuit · Sans inscription · Sans carte bancaire</span>
          </div>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,5vw,56px)', color: '#F7F5F2', letterSpacing: -1.5, marginBottom: 18, lineHeight: 1.05 }}>
            Votre site mérite d'être cité<br /><em style={{ color: '#D97757' }}>par les IA</em>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 36px' }}>
            Rejoignez les professionnels qui ont déjà optimisé leur visibilité IA — gratuitement, en 30 secondes.
          </p>

          <a href="/" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '16px 40px', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', fontFamily: 'system-ui', boxShadow: '0 8px 24px rgba(217,119,87,0.4)', letterSpacing: -0.2 }}>
            Analyser mon site gratuitement →
          </a>

          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.3)', letterSpacing: 1, marginTop: 16 }}>
            Gratuit · Sans inscription · Résultat en 30 secondes
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
            Rapport complet 29 € · Paiement unique
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #E5E2DC', padding: '36px 48px', background: '#fff' }}>
        <div className="footer-inner" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 5 }}>
              <Logo />Detekia
            </div>
            <div style={{ fontSize: 11, color: '#C2BDB8', fontFamily: 'system-ui' }}>© 2026 Detekia — Beeleven SASU</div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            {[['Blog','/blog'],['Tarifs','/pricing'],['Méthodologie','/methodologie'],['Contact','/contact'],['FAQ','/#faq'],['Mentions légales','/mentions-legales'],['Confidentialité','/confidentialite'],['CGU','/cgu']].map(([label,href]) => (
              <a key={label} href={href} style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{label}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #8A8680; }
        @keyframes ai-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        #ai-cursor { animation: ai-blink 1.06s step-end infinite; font-weight: 300; }
        .testimonial-card:hover { box-shadow: 0 12px 32px rgba(26,25,22,0.10); transform: translateY(-3px); }
        @media (max-width: 640px) {
          .hero-input-wrap { flex-direction: column !important; border-radius: 10px !important; }
          .hero-input-wrap input { border-radius: 10px 10px 0 0 !important; }
          .hero-input-wrap button { border-radius: 0 0 10px 10px !important; width: 100% !important; justify-content: center; }
        }
      `}</style>
    </div>
    </>
  );
}
