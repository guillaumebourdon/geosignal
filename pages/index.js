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
  const criteria = [
    { name: 'Extractibilité', score: 12, max: 25, color: '#D97757' },
    { name: 'Crawlabilité IA', score: 11, max: 15, color: '#C9861A' },
    { name: 'Données structurées', score: 8, max: 10, color: '#10A37F' },
  ];
  return (
    <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 32px 80px rgba(26,25,22,0.18), 0 4px 16px rgba(26,25,22,0.06)', overflow: 'hidden', maxWidth: 390, width: '100%', border: '1px solid rgba(26,25,22,0.06)' }}>

      {/* macOS-style mini header */}
      <div style={{ background: '#F0EDE8', borderBottom: '1px solid #E5E2DC', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#F87171','#FBBF24','#34D399'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 0.5, marginLeft: 6 }}>Rapport GEO · exemple.fr · 27 mars 2026</div>
      </div>

      {/* Score block */}
      <div style={{ background: '#1A1916', padding: '36px 32px 28px', position: 'relative', overflow: 'hidden' }}>
        {/* Halo derrière le score */}
        <div style={{ position: 'absolute', top: '40%', left: 24, transform: 'translateY(-50%)', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,134,26,0.16) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: '#C9861A', opacity: 0.04 }} />

        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.3)', letterSpacing: 2, marginBottom: 18, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9861A' }} /> GEO Score
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, position: 'relative' }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 96, color: '#F7F5F2', lineHeight: 1, letterSpacing: -4 }}>67</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.25)', letterSpacing: 1 }}>/100</div>
          </div>
          <div style={{ paddingBottom: 16 }}>
            <div style={{ display: 'inline-block', background: 'rgba(201,134,26,0.18)', border: '1px solid rgba(201,134,26,0.32)', borderRadius: 20, padding: '4px 13px', fontFamily: 'monospace', fontSize: 9, color: '#C9861A', letterSpacing: 2, marginBottom: 10 }}>MOYEN</div>
            <div style={{ fontSize: 11, color: 'rgba(247,245,242,0.35)', fontFamily: 'system-ui', lineHeight: 1.6 }}>Citabilité IA<br />à améliorer</div>
          </div>
        </div>
      </div>

      {/* Criteria */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid #EDEBE6' }}>
        <Label>Analyse par critère</Label>
        {criteria.map((c, i) => {
          const pct = Math.round((c.score / c.max) * 100);
          return (
            <div key={i} style={{ marginBottom: i < criteria.length - 1 ? 16 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 9, color: '#8A8680', fontFamily: 'monospace', letterSpacing: 0.5, textTransform: 'uppercase' }}>{c.name}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 600, color: c.color }}>{c.score}/{c.max}</span>
              </div>
              <div style={{ height: 4, background: '#F0EDE8', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: c.color, borderRadius: 99, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan d'action */}
      <div style={{ padding: '8px 26px', background: '#FAFAF9', borderBottom: '1px solid #EDEBE6', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 1, background: '#E5E2DC' }} />
        <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#C2BDB8', letterSpacing: 2, textTransform: 'uppercase' }}>Plan d'action</div>
        <div style={{ flex: 1, height: 1, background: '#E5E2DC' }} />
      </div>

      {/* Recommendations */}
      <div style={{ padding: '18px 32px 20px' }}>
        <Label>Recommandations</Label>
        {/* Visible reco */}
        <div style={{ background: '#FAFAF9', borderRadius: 10, padding: '12px 14px', border: '1px solid #E5E2DC', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: 1, padding: '2px 8px', borderRadius: 4, background: 'rgba(217,119,87,0.12)', color: '#D97757' }}>CRITIQUE</span>
            <span style={{ fontSize: 10, color: '#B0ABA5', fontFamily: 'monospace' }}>Extractibilité</span>
          </div>
          <div style={{ fontSize: 11, color: '#3A3835', fontFamily: 'system-ui', lineHeight: 1.65 }}>
            Votre introduction ne répond pas directement à la question principale…
          </div>
          <div style={{ height: 16, background: 'linear-gradient(to bottom, transparent, #FAFAF9)', marginTop: -4 }} />
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '13px 32px 15px', background: 'rgba(217,119,87,0.05)', borderTop: '1px solid #EDEBE6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 1 }}>+5 recommandations verrouillées</div>
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

            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {[['#10A37F','ChatGPT'],['#D97757','Claude'],['#4285F4','Gemini'],['#1C7DC4','Perplexity']].map(([c,name]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'monospace', padding: '5px 12px', borderRadius: 20, border: '1px solid #E5E2DC', background: '#fff', color: '#8A8680' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />{name}
                </div>
              ))}
            </div>

            <h1 style={{ fontSize: 'clamp(38px, 5vw, 62px)', lineHeight: 1.05, letterSpacing: -2, marginBottom: 10, color: '#1A1916', maxWidth: 540 }}>
              Vos concurrents apparaissent dans<br className="mobile-break" /> <span id="ai-engine-name">ChatGPT.</span><span id="ai-cursor" style={{ color: '#D97757' }}>|</span><br /><span style={{ color: '#D97757' }}>Pas vous.</span>
            </h1>

            <p style={{ fontSize: 18, color: '#6B6762', maxWidth: 480, lineHeight: 1.55, fontFamily: 'system-ui', marginBottom: 16 }}>
              Découvrez en 30 secondes comment être cité par les IA.
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

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Comment ça marche</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 56, lineHeight: 1.1 }}>
            Un audit GEO complet en <em style={{ color: '#D97757' }}>30 secondes</em>
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

      {/* ── POUR QUI ─────────────────────────────────────────── */}
      <section style={{ background: '#F7F5F2', padding: '80px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Public cible</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
            Pour qui est Detekia ?
          </h2>
          <p style={{ fontSize: 15, color: '#8A8680', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 48px' }}>
            Que vous soyez fondateur, marketeur ou consultant, votre visibilité IA est un enjeu business.
          </p>
          <div className="target-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
            {[
              { emoji: '🚀', title: 'Fondateurs SaaS & startups', desc: "Vos concurrents lèvent des millions en visibilité. Assurez-vous que les IA recommandent votre produit quand un prospect pose la question." },
              { emoji: '🛒', title: 'E-commerçants', desc: "Les IA recommandent des produits à des millions d'utilisateurs chaque jour. Si votre catalogue n'est pas citable, vous perdez des ventes." },
              { emoji: '🔍', title: 'Consultants & agences SEO', desc: "Ajoutez le GEO à votre offre. Utilisez Detekia pour auditer vos clients et leur proposer un plan d'optimisation IA concret." },
              { emoji: '🏢', title: 'Sites vitrines & services', desc: "Quand quelqu'un demande à ChatGPT 'quel prestataire pour X', votre site doit apparaître. Detekia vous montre comment." },
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

      {/* ── STATS DASHBOARD — MOD 5 ──────────────────────────── */}
      <section style={{ background: '#1A1916', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(30px,4vw,40px)', color: '#F7F5F2', textAlign: 'center', letterSpacing: -1, marginBottom: 10, lineHeight: 1.1 }}>
            Le GEO en chiffres
          </h2>
          <p style={{ fontFamily: 'system-ui', fontSize: 14, color: 'rgba(247,245,242,0.4)', textAlign: 'center', marginBottom: 48 }}>
            Pourquoi votre visibilité IA est devenue critique en 2026
          </p>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { stat: '+527%', label: 'DE TRAFIC IA EN 2025', desc: 'Le trafic référé par les moteurs IA a explosé entre janvier et mai 2025.', source: 'Previsible, 2025', color: '#D97757' },
              { stat: '4.4x', label: 'MEILLEUR TAUX DE CONVERSION', desc: 'Les visiteurs référés par les IA convertissent 4,4 fois mieux que les visiteurs organiques.', source: 'Semrush, 2025', color: '#10A37F' },
              { stat: '80%', label: 'HORS TOP 100 GOOGLE', desc: '80% des URLs citées par ChatGPT ne sont pas dans le top 100 de Google. Le SEO seul ne suffit plus.', source: 'Ahrefs, 2025', color: '#4285F4' },
              { stat: '73%', label: 'DE SITES NON CRAWLABLES', desc: '73% des sites ne sont pas accessibles aux bots IA à cause de robots.txt ou JavaScript.', source: 'Otterly.AI, 2026', color: '#C9861A' },
            ].map(({ stat, label, desc, source, color }, i) => (
              <div key={stat} style={{ padding: '32px 28px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,5vw,52px)', color, letterSpacing: -1.5, lineHeight: 1, marginBottom: 10 }}>{stat}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, color: 'rgba(247,245,242,0.5)', textTransform: 'uppercase', marginBottom: 12 }}>{label}</div>
                <div style={{ fontFamily: 'system-ui', fontSize: 13, color: 'rgba(247,245,242,0.45)', lineHeight: 1.6, marginBottom: 8 }}>{desc}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.2)' }}>{source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── POURQUOI PAS UN SIMPLE PROMPT ────────────────────── */}
      <section style={{ background: '#F7F5F2', padding: '80px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(30px,4vw,40px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 48, lineHeight: 1.1 }}>
            Pourquoi Detekia n&apos;est pas un simple prompt ChatGPT
          </h2>
          <div className="diff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { title: 'Un prompt ChatGPT', bg: 'rgba(217,119,87,0.06)', border: 'rgba(217,119,87,0.15)', icon: '✗', items: ["Analyse subjective et non reproductible", "Pas d'accès au DOM réel de votre site", "Pas de scoring chiffré ni de benchmark", "Recommandations génériques sans preuves"] },
              { title: 'Un audit SEO classique', bg: 'rgba(66,133,244,0.06)', border: 'rgba(66,133,244,0.15)', icon: '✗', items: ["Optimisé pour Google, pas pour les IA", "Ne mesure pas la citabilité IA", "Ignore les critères GEO spécifiques", "Pas de test de citation réel"] },
              { title: 'Detekia', bg: 'rgba(16,163,127,0.06)', border: 'rgba(16,163,127,0.15)', icon: '✓', items: ["Scoring reproductible sur 8 critères mesurés", "Analyse du DOM réel via scraping Jina AI", "Test de citation IA sur 5 requêtes réelles", "Recommandations sourcées avec cas réels documentés"] },
            ].map(({ title, bg, border, icon, items }) => (
              <div key={title} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: 28 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 20 }}>{title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ fontSize: 13, color: icon === '✓' ? '#10A37F' : '#8A8680', fontFamily: 'system-ui', lineHeight: 1.5 }}>
                      <span style={{ marginRight: 8, fontWeight: 700 }}>{icon}</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── TÉMOIGNAGES ──────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Témoignages</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48, lineHeight: 1.1 }}>
            Ils ont audité leur site
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="testimonials-grid">
            {[
              { name: 'Claire D.', quote: 'Les audits sont vraiment très bien construits et donnent une base de travail claire pour savoir quoi améliorer en priorité. On repart avec une vision beaucoup plus concrète de ce qu\'il faut faire.' },
              { name: 'Nicolas R.', quote: 'La qualité du scoring est excellente, et les recommandations du rapport payant valent vraiment le coup. C\'est là qu\'on obtient des pistes précises et actionnables pour aller plus loin.' },
              { name: 'Sophie M.', quote: 'Pour le prix, le rapport qualité-prix est franchement très bon. Le niveau de détail, la clarté et les conseils proposés donnent vraiment l\'impression d\'en avoir pour son argent.' },
            ].map(({ name, quote }) => (
              <div key={name} style={{ background: '#FFFFFF', border: '1px solid #E5E2DC', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 48, color: '#E5E2DC', lineHeight: 1, marginBottom: 8, marginTop: -8 }}>"</div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#1A1916', lineHeight: 1.65, fontStyle: 'italic', flex: 1, margin: '0 0 20px' }}>{quote}</p>
                <div style={{ fontFamily: 'system-ui', fontSize: 14, fontWeight: 600, color: '#1A1916' }}>{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── CAS CONCRET AVANT/APRÈS ──────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Étude de cas</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(30px,4vw,40px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 10, lineHeight: 1.1 }}>
            Un cas concret
          </h2>
          <p style={{ fontSize: 14, color: '#8A8680', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 40px' }}>
            Comment un site SaaS est passé de 0 à 3 citations IA en 4 semaines
          </p>
          <div className="case-study-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.15)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#D97757', marginBottom: 4 }}>Avant l'audit</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#D97757', marginBottom: 16 }}>Score GEO : 28/100</div>
              <div style={{ fontFamily: 'system-ui', fontSize: 12, fontWeight: 700, color: '#1A1916', marginBottom: 10 }}>Problèmes détectés :</div>
              {[
                "→ Page d'accueil commençant par 'Bienvenue chez...' — impossible à extraire par une IA",
                "→ Aucun Schema.org détecté — les IA ne comprennent pas la structure du site",
                "→ robots.txt bloquant GPTBot et ClaudeBot — les moteurs IA ne peuvent pas accéder au contenu",
                "→ 0 lien externe sourcé — aucune preuve vérifiable pour les IA",
              ].map((item, i) => (
                <div key={i} style={{ fontFamily: 'system-ui', fontSize: 12, color: '#6B6762', lineHeight: 1.65, marginBottom: 8 }}>{item}</div>
              ))}
            </div>
            <div style={{ background: 'rgba(16,163,127,0.06)', border: '1px solid rgba(16,163,127,0.15)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#10A37F', marginBottom: 4 }}>Après les corrections</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#10A37F', marginBottom: 16 }}>Score GEO : 71/100</div>
              <div style={{ fontFamily: 'system-ui', fontSize: 12, fontWeight: 700, color: '#1A1916', marginBottom: 10 }}>Corrections appliquées :</div>
              {[
                "✓ Titre reformulé : 'Acme automatise la gestion des congés pour les PME de 10 à 200 salariés'",
                "✓ Schema.org Organization + FAQPage ajoutés — structure lisible par les IA",
                "✓ robots.txt mis à jour — GPTBot, ClaudeBot et PerplexityBot autorisés",
                "✓ 8 liens externes vers des sources reconnues (INSEE, Legifrance, BPI)",
              ].map((item, i) => (
                <div key={i} style={{ fontFamily: 'system-ui', fontSize: 12, color: '#6B6762', lineHeight: 1.65, marginBottom: 8 }}>{item}</div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 14, color: '#1A1916', fontWeight: 600, fontFamily: 'system-ui', textAlign: 'center', marginTop: 24 }}>
            Résultat : le site est passé de 0 à 3 citations dans les réponses de ChatGPT et Perplexity en 4 semaines.
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 8 CRITÈRES — MOD 4 ──────────────────────────────── */}
      <section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Ce qu'on analyse</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 56, lineHeight: 1.1 }}>
            8 critères <em style={{ color: '#D97757' }}>validés par la recherche</em>
          </h2>
          <div className="criteria-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {features.map(f => <CriteriaCard key={f.name} {...f} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <a href="/methodologie" style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', textDecoration: 'none', borderBottom: '1px solid #E5E2DC', paddingBottom: 2 }}>
              Voir le détail complet → Méthodologie
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

      {/* ── POURQUOI FAIRE CONFIANCE ─────────────────────────── */}
      <section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Transparence & confiance</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 56, lineHeight: 1.1 }}>
            Pourquoi faire confiance <em style={{ color: '#D97757' }}>à Detekia ?</em>
          </h2>
          <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { icon: '🔬', accent: '#4285F4', title: 'Méthode transparente', desc: 'Méthodologie entièrement documentée. Vous savez comment chaque point de votre score est calculé.', link: '/methodologie' },
              { icon: '⚡', accent: '#10A37F', title: 'Résultats en 30 secondes', desc: 'Aucun devis, aucun rendez-vous. Votre rapport disponible immédiatement, à toute heure.', link: null },
              { icon: '🔓', accent: '#D97757', title: 'Zéro inscription requise', desc: "Pas d'email, pas de mot de passe pour l'analyse gratuite. Essayez sans aucun engagement.", link: null },
              { icon: '🔒', accent: '#1C7DC4', title: 'Paiement sécurisé Stripe', desc: 'Paiements traités par Stripe. Aucune donnée bancaire ne transite par nos serveurs.', link: null },
              { icon: '↩️', accent: '#C9861A', title: 'Remboursement sous 24h', desc: "Rapport inaccessible suite à un problème technique ? Remboursement intégral garanti sous 24h.", link: null },
              { icon: '🛡️', accent: '#10A37F', title: 'Données non conservées', desc: 'Votre URL analysée en temps réel. Aucune donnée de votre site stockée au-delà de 24h.', link: null },
            ].map(({ icon, accent, title, desc, link }) => (
              <div key={title} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '24px', borderLeft: `4px solid ${accent}`, boxShadow: '0 2px 12px rgba(26,25,22,0.06)' }}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'Georgia, serif' }}>{title}</div>
                <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui' }}>{desc}</div>
                {link && <a href={link} style={{ display: 'inline-block', marginTop: 10, fontSize: 12, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none', borderBottom: '1px solid rgba(217,119,87,0.3)', paddingBottom: 1 }}>Voir la méthodologie →</a>}
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
