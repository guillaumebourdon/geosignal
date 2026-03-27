import { useState } from 'react';
import { useRouter } from 'next/router';

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
    <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 32px 80px rgba(26,25,22,0.20), 0 4px 16px rgba(26,25,22,0.06)', overflow: 'hidden', maxWidth: 390, width: '100%', border: '1px solid rgba(26,25,22,0.06)' }}>

      {/* macOS-style mini header */}
      <div style={{ background: '#F0EDE8', borderBottom: '1px solid #E5E2DC', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#F87171','#FBBF24','#34D399'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5', letterSpacing: 0.5, marginLeft: 6 }}>Rapport GEO · exemple.fr · 27 mars 2026</div>
      </div>

      {/* Score block */}
      <div style={{ background: '#1A1916', padding: '28px 26px 22px', position: 'relative', overflow: 'hidden' }}>
        {/* Halo derrière le score */}
        <div style={{ position: 'absolute', top: '40%', left: 24, transform: 'translateY(-50%)', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,134,26,0.16) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: '#C9861A', opacity: 0.04 }} />

        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.3)', letterSpacing: 2, marginBottom: 18, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9861A' }} /> GEO Score
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, position: 'relative' }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 80, color: '#F7F5F2', lineHeight: 1, letterSpacing: -3 }}>67</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.25)', letterSpacing: 1 }}>/100</div>
          </div>
          <div style={{ paddingBottom: 16 }}>
            <div style={{ display: 'inline-block', background: 'rgba(201,134,26,0.18)', border: '1px solid rgba(201,134,26,0.32)', borderRadius: 20, padding: '4px 13px', fontFamily: 'monospace', fontSize: 9, color: '#C9861A', letterSpacing: 2, marginBottom: 10 }}>MOYEN</div>
            <div style={{ fontSize: 11, color: 'rgba(247,245,242,0.35)', fontFamily: 'system-ui', lineHeight: 1.6 }}>Citabilité IA<br />à améliorer</div>
          </div>
        </div>
      </div>

      {/* Criteria */}
      <div style={{ padding: '20px 26px', borderBottom: '1px solid #EDEBE6' }}>
        <Label>Analyse par critère</Label>
        {criteria.map((c, i) => {
          const pct = Math.round((c.score / c.max) * 100);
          return (
            <div key={i} style={{ marginBottom: i < criteria.length - 1 ? 14 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#3A3835', fontFamily: 'system-ui' }}>{c.name}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: c.color }}>{c.score}/{c.max}</span>
              </div>
              <div style={{ height: 6, background: '#F0EDE8', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: c.color, borderRadius: 4, transition: 'width 0.6s ease' }} />
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
      <div style={{ padding: '14px 26px 16px' }}>
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
        {/* Blurred locked recos */}
        {[
          ['35%','72%','48%'],
          ['50%','60%','38%'],
        ].map(([w1,w2,w3], i) => (
          <div key={i} style={{ background: '#FAFAF9', borderRadius: 10, padding: '12px 14px', border: '1px solid #E5E2DC', marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(4px)', userSelect: 'none' }}>
              <div style={{ height: 7, background: '#E5E2DC', borderRadius: 3, marginBottom: 7, width: w1 }} />
              <div style={{ height: 6, background: '#EDEBE6', borderRadius: 3, marginBottom: 7, width: w2 }} />
              <div style={{ height: 7, background: '#E5E2DC', borderRadius: 3, width: w3 }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(26,25,22,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12 }}>🔒</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '11px 26px 13px', background: 'rgba(217,119,87,0.05)', borderTop: '1px solid #EDEBE6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 58, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <Logo />Detekia
        </a>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <a href="/pricing" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Tarifs</a>
          <a href="/methodologie" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Méthodologie</a>
          <a href="/contact" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Contact</a>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '9px 20px', borderRadius: 9, textDecoration: 'none', fontFamily: 'system-ui' }}>Analyser gratuitement</a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ background: '#F7F5F2', padding: '100px 48px 104px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '60% 40%', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,163,127,0.08)', border: '1px solid rgba(16,163,127,0.2)', borderRadius: 20, padding: '6px 14px', marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10A37F' }} />
              <span style={{ fontSize: 12, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 500 }}>Analyse 100% gratuite — aucune inscription</span>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
              {[['#10A37F','ChatGPT'],['#D97757','Claude'],['#4285F4','Gemini'],['#1C7DC4','Perplexity']].map(([c,name]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'monospace', padding: '5px 12px', borderRadius: 20, border: '1px solid #E5E2DC', background: '#fff', color: '#8A8680' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />{name}
                </div>
              ))}
            </div>

            <h1 style={{ fontSize: 'clamp(38px, 5vw, 62px)', lineHeight: 1.05, letterSpacing: -2, marginBottom: 20, color: '#1A1916', maxWidth: 540 }}>
              Vos concurrents apparaissent dans ChatGPT.<br /><span style={{ color: '#D97757' }}>Pas vous.</span>
            </h1>

            <p style={{ fontSize: 16, color: '#6B6762', maxWidth: 480, lineHeight: 1.7, fontFamily: 'system-ui', marginBottom: 28 }}>
              Analysez votre site en 30 secondes. Score sur 100, 8 critères, recommandations concrètes pour être cité par les IA.
            </p>

            {/* ── URL input principal ──────────────────────────── */}
            <div style={{ maxWidth: 600, width: '100%' }}>
              <div className="hero-input-wrap" style={{ display: 'flex', background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && analyze()}
                  placeholder="https://www.votre-site.fr"
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '16px 20px', fontSize: 16, fontFamily: 'system-ui', color: '#1A1916', background: 'transparent', minWidth: 0 }}
                />
                <button
                  onClick={analyze}
                  style={{ background: '#1A1916', color: '#F7F5F2', border: 'none', padding: '16px 32px', borderRadius: '0 10px 10px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Analyser →
                </button>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 1, marginTop: 10 }}>
                Gratuit · Sans inscription · Résultat en 30 secondes
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ProductMockup />
          </div>
        </div>
      </section>

      {/* ── MICRO BANDEAU PREUVE D'USAGE — MOD 9 ────────────── */}
      <div style={{ background: '#fff', borderTop: '1px solid rgba(26,25,22,0.07)', borderBottom: '1px solid rgba(26,25,22,0.07)', padding: '16px 48px' }}>
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
            Un audit GEO complet en <em style={{ color: '#D97757' }}>20 secondes</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              ['01','#10A37F','Entrez votre URL','Collez l\'adresse de votre site. Zéro inscription, zéro configuration, zéro carte bancaire.'],
              ['02','#D97757','On analyse tout','Detekia scrape votre site et l\'évalue selon 8 critères GEO validés par la recherche.'],
              ['03','#4285F4','Recevez votre score','Score sur 100, analyse par critère et recommandations expertes en moins de 20 secondes.'],
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

      {/* ── STATS DASHBOARD — MOD 5 ──────────────────────────── */}
      <section style={{ background: '#1A1916', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', overflow: 'hidden' }}>
            {[
              { emoji: '📊', stat: '94%', label: 'Sites sous 60/100', sub: 'Benchmark interne' },
              { emoji: '🔍', stat: '8',   label: 'Critères mesurés',  sub: 'Contenu, autorité, technique' },
              { emoji: '⚡', stat: '20s', label: "Temps d'analyse",   sub: 'Rapport immédiat' },
              { emoji: '🤖', stat: '4',   label: 'Moteurs couverts',  sub: 'ChatGPT, Claude, Gemini, Perplexity' },
            ].map(({ emoji, stat, label, sub }, i) => (
              <div key={stat} style={{ padding: '40px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                <div style={{ fontSize: 20, marginBottom: 12 }}>{emoji}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 64, color: '#D97757', letterSpacing: -2, lineHeight: 1, marginBottom: 12 }}>{stat}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, color: 'rgba(247,245,242,0.55)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 11, color: 'rgba(247,245,242,0.28)', fontFamily: 'system-ui', lineHeight: 1.5 }}>{sub}</div>
              </div>
            ))}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
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

      {/* ── EXEMPLES DE RAPPORTS — MOD 1 ─────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Exemples réels</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 56, lineHeight: 1.1 }}>
            Exemples de <em style={{ color: '#D97757' }}>rapports analysés</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              {
                type: 'Site e-commerce',
                score: 42,
                grade: 'FAIBLE',
                gradeColor: '#D97757',
                gradeBg: 'rgba(217,119,87,0.1)',
                problem: 'Intro trop promotionnelle, aucune réponse directe à la requête principale.',
                reco: 'Ajouter une réponse claire sous le H1, reformuler le contenu en factuel.',
              },
              {
                type: 'Blog expert',
                score: 71,
                grade: 'BON',
                gradeColor: '#10A37F',
                gradeBg: 'rgba(16,163,127,0.1)',
                problem: 'Manque de sources externes vérifiables pour les affirmations clés.',
                reco: 'Ajouter citations sourcées et liens vers études scientifiques ou sectorielles.',
              },
              {
                type: 'SaaS B2B',
                score: 55,
                grade: 'MOYEN',
                gradeColor: '#C9861A',
                gradeBg: 'rgba(201,134,26,0.1)',
                problem: 'Données structurées insuffisantes — pas de Schema.org détecté.',
                reco: 'Implémenter Article et FAQPage en JSON-LD sur les pages principales.',
              },
            ].map(({ type, score, grade, gradeColor, gradeBg, problem, reco }) => (
              <div key={type} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '24px', boxShadow: '0 2px 12px rgba(26,25,22,0.06)', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase' }}>{type}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: gradeColor, letterSpacing: -1, fontWeight: 400 }}>{score}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(26,25,22,0.3)' }}>/100</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: 1.5, color: gradeColor, background: gradeBg, padding: '3px 9px', borderRadius: 20, textTransform: 'uppercase' }}>{grade}</span>
                  </div>
                </div>
                {/* Score bar */}
                <div style={{ height: 5, background: '#F0EDE8', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}>
                  <div style={{ height: '100%', width: `${score}%`, background: gradeColor, borderRadius: 3 }} />
                </div>
                {/* Problem */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>🔍 Problème détecté</div>
                  <div style={{ fontSize: 12, color: '#3A3835', lineHeight: 1.65, fontFamily: 'system-ui' }}>{problem}</div>
                </div>
                {/* Reco */}
                <div style={{ flex: 1, marginBottom: 20 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>✅ Recommandation</div>
                  <div style={{ fontSize: 12, color: '#3A3835', lineHeight: 1.65, fontFamily: 'system-ui' }}>{reco}</div>
                </div>
                {/* CTA */}
                <a href="/" style={{ display: 'block', textAlign: 'center', background: '#1A1916', color: '#F7F5F2', padding: '11px 0', borderRadius: 9, fontWeight: 600, fontSize: 12, textDecoration: 'none', fontFamily: 'system-ui' }}>
                  Analyser mon site →
                </a>
              </div>
            ))}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { icon: '🔬', accent: '#4285F4', title: 'Méthode transparente', desc: 'Méthodologie entièrement documentée. Vous savez comment chaque point de votre score est calculé.', link: '/methodologie' },
              { icon: '⚡', accent: '#10A37F', title: 'Résultats en 20 secondes', desc: 'Aucun devis, aucun rendez-vous. Votre rapport disponible immédiatement, à toute heure.', link: null },
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

      {/* ── CE QUE VOUS RECEVEZ — MOD 3 ──────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Rapport complet</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,4vw,44px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.5, marginBottom: 16, lineHeight: 1.1 }}>
            Ce que vous recevez <em style={{ color: '#D97757' }}>dans le rapport complet</em>
          </h2>
          <p style={{ fontSize: 15, color: '#8A8680', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 48px' }}>
            Un plan d'action GEO détaillé, priorisé et personnalisé pour votre site — livré en moins de 20 secondes.
          </p>

          {/* 4 bullets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 40 }}>
            {[
              ['📋', 'Toutes les recommandations par critère', 'Chaque critère sous 80% de son score maximum génère une recommandation dédiée.'],
              ['🎯', 'Ordre de priorité actionnable', 'Les recommandations sont classées par impact : Critique, Important, Bonus.'],
              ['💡', 'Exemples concrets pour chaque action', 'Avant / après, extraits de code, formulations types — rien d\'abstrait.'],
              ['📈', 'Impact attendu estimé', 'Pour chaque recommandation : gain estimé sur votre score GEO et citabilité IA.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 14, padding: '20px' }}>
                <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', marginBottom: 5, fontFamily: 'Georgia, serif' }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Extrait d'une recommandation réelle */}
          <div style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
            {/* Header */}
            <div style={{ background: '#1A1916', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 4, background: 'rgba(217,119,87,0.2)', color: '#D97757', textTransform: 'uppercase' }}>CRITIQUE</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.45)', letterSpacing: 1 }}>Extractibilité</span>
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'rgba(247,245,242,0.6)' }}>Exemple de recommandation</span>
            </div>
            {/* Body */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '16px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>🔍 Diagnostic</div>
                  <div style={{ fontSize: 12, color: '#3A3835', fontFamily: 'system-ui', lineHeight: 1.65 }}>Votre page d'accueil commence par "Bienvenue chez…" — les IA ne peuvent pas extraire de réponse directe à une requête utilisateur.</div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '16px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>✅ Ce qu'il faut faire</div>
                  <div style={{ fontSize: 12, color: '#3A3835', fontFamily: 'system-ui', lineHeight: 1.65 }}>Remplacer le titre générique par une phrase qui répond directement à "Qu'est-ce que [votre service] ?"</div>
                </div>
              </div>
              {/* Avant/après */}
              <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '16px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#4285F4', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>💡 Exemple concret</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: 'rgba(217,119,87,0.06)', borderRadius: 8, padding: '12px', border: '1px solid rgba(217,119,87,0.15)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#D97757', letterSpacing: 1.5, marginBottom: 6 }}>AVANT</div>
                    <div style={{ fontSize: 11, color: '#8A8680', fontFamily: 'system-ui', fontStyle: 'italic' }}>"Bienvenue chez Acme, leader de la gestion RH."</div>
                  </div>
                  <div style={{ background: 'rgba(16,163,127,0.06)', borderRadius: 8, padding: '12px', border: '1px solid rgba(16,163,127,0.15)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#10A37F', letterSpacing: 1.5, marginBottom: 6 }}>APRÈS</div>
                    <div style={{ fontSize: 11, color: '#3A3835', fontFamily: 'system-ui', fontStyle: 'italic' }}>"Acme est un logiciel RH qui automatise la gestion des congés pour les PME de 10 à 200 salariés."</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <a href="/pricing" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '16px 40px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: 'system-ui', boxShadow: '0 8px 24px rgba(217,119,87,0.35)' }}>
              Débloquer mon rapport — 29 € →
            </a>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8', marginTop: 12, letterSpacing: 1 }}>
              Paiement unique · Accès immédiat
            </div>
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
          {faqs.map((faq, i) => <FAQItem key={i} question={faq.question} answer={faq.answer} />)}
        </div>
      </section>

      <SectionDivider />

      {/* TODO: remplacer par de vrais témoignages */}
      {/* ── TÉMOIGNAGES ──────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>Témoignages</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48, lineHeight: 1.1 }}>
            Ils ont audité leur site
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="testimonials-grid">
            {[
              { name: 'Thomas R.', context: 'Fondateur SaaS B2B', quote: 'On pensait être bien référencés. Score de 31/100. Les recos sur le schema.org nous ont fait gagner 25 points en une semaine.' },
              { name: 'Marie L.', context: 'Consultante SEO freelance', quote: 'J\'utilise Detekia pour mes audits clients. Le rapport à 29 € me fait gagner 2h de travail par site.' },
              { name: 'Alexandre D.', context: 'E-commerce santé naturelle', quote: 'Perplexity citait mes concurrents mais pas moi. Après les corrections, mon site est apparu en 3 semaines.' },
            ].map(({ name, context, quote }) => (
              <div key={name} style={{ background: '#FFFFFF', border: '1px solid #E5E2DC', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 48, color: '#E5E2DC', lineHeight: 1, marginBottom: 8, marginTop: -8 }}>"</div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#1A1916', lineHeight: 1.65, fontStyle: 'italic', flex: 1, margin: '0 0 20px' }}>{quote}</p>
                <div>
                  <div style={{ fontFamily: 'system-ui', fontSize: 14, fontWeight: 600, color: '#1A1916' }}>{name}</div>
                  <div style={{ fontFamily: 'system-ui', fontSize: 12, color: '#8A8680', marginTop: 2 }}>{context}</div>
                </div>
              </div>
            ))}
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
            Rejoignez les professionnels qui ont déjà optimisé leur visibilité IA — gratuitement, en 20 secondes.
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
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 5 }}>
              <Logo />Detekia
            </div>
            <div style={{ fontSize: 11, color: '#C2BDB8', fontFamily: 'system-ui' }}>© 2026 Detekia — Beeleven SASU</div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            {[['Tarifs','/pricing'],['Méthodologie','/methodologie'],['Contact','/contact'],['FAQ','/#faq'],['Mentions légales','/legal'],['Confidentialité','/legal'],['CGU','/legal']].map(([label,href]) => (
              <a key={label} href={href} style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{label}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #8A8680; }
        @media (max-width: 640px) {
          .hero-input-wrap { flex-direction: column !important; border-radius: 10px !important; }
          .hero-input-wrap input { border-radius: 10px 10px 0 0 !important; }
          .hero-input-wrap button { border-radius: 0 0 10px 10px !important; width: 100% !important; justify-content: center; }
        }
        @media (max-width: 700px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '60% 40%'"] { grid-template-columns: 1fr !important; }
          div[style*="gridTemplateColumns: 'repeat(4,1fr)'"] { grid-template-columns: repeat(2,1fr) !important; }
          div[style*="gridTemplateColumns: 'repeat(3,1fr)'"] { grid-template-columns: 1fr !important; }
          div[style*="gridTemplateColumns: 'repeat(2,1fr)'"] { grid-template-columns: 1fr !important; }
          section { padding-left: 24px !important; padding-right: 24px !important; }
          nav { padding: 0 20px !important; }
          footer { padding: 28px 20px !important; }
        }
      `}</style>
    </div>
  );
}
