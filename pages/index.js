import { useState } from 'react';
import { useRouter } from 'next/router';

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

/* ─── Criteria card with hover + tag ────────────────────── */
function CriteriaCard({ icon, color, name, desc, checks, tag, tagColor }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', border: `1.5px solid ${hov ? color : '#E5E2DC'}`, borderRadius: 18, padding: '28px 22px', transition: 'border-color 0.25s, box-shadow 0.25s', boxShadow: hov ? `0 10px 32px ${color}1A` : '0 2px 8px rgba(26,25,22,0.04)', display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
      {/* Tag top-right */}
      <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'monospace', fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: tagColor, background: tagColor + '14', border: `1px solid ${tagColor}30`, padding: '3px 9px', borderRadius: 20 }}>{tag}</div>
      {/* Icon */}
      <div style={{ width: 48, height: 48, borderRadius: 13, background: hov ? color + '14' : '#F7F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16, transition: 'background 0.25s', flexShrink: 0 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui', letterSpacing: -0.1 }}>{name}</div>
      <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 16, flex: 1 }}>{desc}</div>
      <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: 14 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: color, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Ce qu'on vérifie</div>
        {checks.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 5 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />
            <span style={{ fontSize: 11, color: '#8A8680', fontFamily: 'system-ui', fontStyle: i === checks.length - 1 ? 'italic' : 'normal' }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Hero product mockup ────────────────────────────────── */
function ProductMockup() {
  const criteria = [
    { name: 'Extractibilité', score: 12, max: 25, color: '#D97757' },
    { name: 'Crawlabilité IA', score: 11, max: 15, color: '#C9861A' },
    { name: 'Données structurées', score: 8, max: 10, color: '#10A37F' },
  ];
  return (
    <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 28px 72px rgba(26,25,22,0.16), 0 4px 16px rgba(26,25,22,0.06)', overflow: 'hidden', maxWidth: 380, width: '100%', border: '1px solid #E8E5E0' }}>
      {/* Card header */}
      <div style={{ background: '#1A1916', padding: '22px 24px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -48, right: -48, width: 140, height: 140, borderRadius: '50%', background: '#C9861A', opacity: 0.07 }} />
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.4)', letterSpacing: 2, marginBottom: 14, textTransform: 'uppercase' }}>Rapport GEO — exemple.fr</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 56, color: '#F7F5F2', lineHeight: 1, letterSpacing: -2 }}>67</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.3)' }}>/100</div>
          </div>
          <div style={{ paddingBottom: 8 }}>
            <div style={{ display: 'inline-block', background: 'rgba(201,134,26,0.2)', border: '1px solid rgba(201,134,26,0.4)', borderRadius: 20, padding: '4px 13px', fontFamily: 'monospace', fontSize: 9, color: '#C9861A', letterSpacing: 2, marginBottom: 8 }}>MOYEN</div>
            <div style={{ fontSize: 11, color: 'rgba(247,245,242,0.4)', fontFamily: 'system-ui', lineHeight: 1.5 }}>Citabilité IA<br />à améliorer</div>
          </div>
        </div>
      </div>

      {/* Criteria bars */}
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0EDE8' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Analyse par critère</div>
        {criteria.map((c, i) => {
          const pct = Math.round((c.score / c.max) * 100);
          return (
            <div key={i} style={{ marginBottom: i < criteria.length - 1 ? 12 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#3A3835', fontFamily: 'system-ui' }}>{c.name}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: c.color }}>{c.score}/{c.max}</span>
              </div>
              <div style={{ height: 5, background: '#F0EDE8', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: c.color, borderRadius: 3 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #F0EDE8' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Recommandations</div>

        {/* Visible reco */}
        <div style={{ background: '#FAFAF9', borderRadius: 10, padding: '11px 13px', border: '1px solid #E5E2DC', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: 1, padding: '2px 8px', borderRadius: 4, background: 'rgba(217,119,87,0.12)', color: '#D97757' }}>CRITIQUE</span>
            <span style={{ fontSize: 10, color: '#8A8680', fontFamily: 'monospace' }}>Extractibilité</span>
          </div>
          <div style={{ fontSize: 11, color: '#3A3835', fontFamily: 'system-ui', lineHeight: 1.6 }}>Votre introduction ne répond pas directement à la question principale…</div>
          <div style={{ height: 20, background: 'linear-gradient(to bottom, transparent, #FAFAF9)', marginTop: -8, position: 'relative' }} />
        </div>

        {/* Blurred locked recos */}
        {[1, 2].map(i => (
          <div key={i} style={{ background: '#FAFAF9', borderRadius: 10, padding: '11px 13px', border: '1px solid #E5E2DC', marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(4px)', userSelect: 'none' }}>
              <div style={{ height: 7, background: '#E5E2DC', borderRadius: 3, marginBottom: 7, width: '55%' }} />
              <div style={{ height: 7, background: '#E5E2DC', borderRadius: 3, marginBottom: 7, width: '80%' }} />
              <div style={{ height: 7, background: '#E5E2DC', borderRadius: 3, width: '40%' }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14, color: '#C2BDB8' }}>🔒</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '13px 24px', background: 'rgba(217,119,87,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, color: '#8A8680', fontFamily: 'system-ui' }}>+5 recommandations verrouillées</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#D97757', fontFamily: 'system-ui', background: 'rgba(217,119,87,0.12)', padding: '5px 13px', borderRadius: 20 }}>Débloquer →</div>
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
    { question: "C'est quoi le GEO et en quoi c'est différent du SEO ?", answer: "Le GEO (Generative Engine Optimization) est l'art d'optimiser votre site pour apparaître dans les réponses des intelligences artificielles — ChatGPT, Claude, Gemini, Perplexity. Contrairement au SEO qui vise à ranker sur Google, le GEO vise à être cité et recommandé directement dans les réponses des IA. Les critères sont différents : les IA valorisent la clarté, la citabilité, la crédibilité et les données structurées." },
    { question: "Comment fonctionne l'analyse Detekia ?", answer: "Entrez l'URL de votre site, Detekia scrape votre contenu et l'analyse selon 8 critères GEO : extractibilité, vérifiabilité, autorité E-E-A-T, crawlabilité IA, données structurées, neutralité éditoriale, présence externe et fraîcheur. Notre IA génère ensuite des recommandations expertes personnalisées pour votre site. La méthodologie complète est disponible sur la page Méthodologie." },
    { question: "Pourquoi l'analyse est-elle vraiment gratuite ?", answer: "L'analyse de base — score sur 100, 8 critères détaillés, une recommandation experte en aperçu — est totalement gratuite et sans inscription. Aucune carte bancaire requise. Nous croyons que tout le monde devrait pouvoir savoir si son site est visible par les IA. Le rapport complet avec toutes les recommandations détaillées et les plans d'action est disponible à 19,99€ (offre de lancement jusqu'au 15 avril, au lieu de 59,99€)." },
    { question: "Qu'est-ce qu'un bon score GEO ?", answer: "Sur Detekia, un score supérieur à 70/100 est considéré comme bon. Entre 45 et 70, votre site a des bases solides mais nécessite des optimisations ciblées. En dessous de 45, des actions prioritaires s'imposent. La majorité des sites analysés obtiennent un score entre 15 et 45 — même les grandes marques obtiennent souvent des scores faibles car leurs sites sont optimisés pour vendre, pas pour être cités par les IA." },
    { question: "Les données de mon site sont-elles conservées ?", answer: "Non. Detekia analyse votre site en temps réel et ne conserve aucune donnée de votre site au-delà de 24h. Les résultats d'analyse sont mis en cache 24h pour accélérer les analyses successives du même site, mais aucune donnée personnelle n'est stockée." },
    { question: "Detekia fonctionne-t-il pour tous les types de sites ?", answer: "Oui — e-commerce, blogs, SaaS, sites vitrine, portfolios, sites institutionnels. Les critères GEO sont universels. Certains types de sites ont toutefois un avantage naturel : les blogs avec du contenu éditorial riche, les sites avec une forte présence presse, et les plateformes qui publient des données originales. Mais tous les sites peuvent progresser significativement avec les bonnes optimisations." },
  ];

  const features = [
    { icon: '🎯', color: '#4285F4', tag: 'Contenu', tagColor: '#4285F4', name: 'Extractibilité', desc: "Votre contenu répond-il clairement dès les premières lignes ? Les IA cherchent des réponses prêtes à citer.", checks: ['Intro directe en 1-2 phrases', 'Listes et tableaux présents', 'ex. : "X est… car…" dès le H1'] },
    { icon: '🔬', color: '#10A37F', tag: 'Contenu', tagColor: '#4285F4', name: 'Vérifiabilité', desc: "Chiffres sourcés, dates, liens vers preuves — les IA citent ce qu'elles peuvent vérifier.", checks: ['Données chiffrées avec source', 'Liens vers sources externes', 'ex. : "Étude Nielsen 2024…"'] },
    { icon: '🏆', color: '#D97757', tag: 'Autorité', tagColor: '#C9861A', name: 'Autorité E-E-A-T', desc: "Expérience, Expertise, Autorité, Confiance — les 4 piliers que les IA évaluent en priorité.", checks: ['Auteur identifié avec biographie', 'Page À propos + Contact', 'ex. : Schema Organization JSON-LD'] },
    { icon: '🤖', color: '#4285F4', tag: 'Technique', tagColor: '#10A37F', name: 'Crawlabilité IA', desc: "GPTBot, ClaudeBot, OAI-SearchBot — votre site leur est-il accessible sans friction ?", checks: ['Pas de noindex bloquant', 'Balise lang définie', 'ex. : robots.txt permissif pour bots IA'] },
    { icon: '🧩', color: '#1C7DC4', tag: 'Technique', tagColor: '#10A37F', name: 'Données structurées', desc: "Schema.org FAQPage, Organization, Article — le langage natif des IA pour comprendre votre contenu.", checks: ['Schema FAQPage ou HowTo', 'Schema Article ou BlogPosting', 'ex. : <script type="application/ld+json">'] },
    { icon: '⚖️', color: '#10A37F', tag: 'Contenu', tagColor: '#4285F4', name: 'Neutralité éditoriale', desc: "Un contenu factuel et nuancé est 3× plus cité qu'un contenu promotionnel ou superlatif.", checks: ['Ton informatif et factuel', 'Claims sourcés', 'ex. : éviter "le meilleur du marché"'] },
    { icon: '🌐', color: '#8B5CF6', tag: 'Autorité', tagColor: '#C9861A', name: 'Présence externe', desc: "Mentions presse, réseaux sociaux, citations tierces — les signaux d'autorité croisés.", checks: ['Mentions presse avec liens', 'Réseaux sociaux actifs', 'ex. : badge "Vu dans Les Echos"'] },
    { icon: '📅', color: '#C9861A', tag: 'Contenu', tagColor: '#4285F4', name: 'Fraîcheur', desc: "Les IA privilégient les contenus récents et maintenus pour les sujets qui évoluent.", checks: ['dateModified en JSON-LD', 'Copyright de l\'année en cours', 'ex. : "Mis à jour : mars 2026"'] },
  ];

  const Logo = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
      {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => <div key={i} style={{ background: c, borderRadius: '50%' }} />)}
    </div>
  );

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
      <section style={{ background: '#F7F5F2', padding: '96px 48px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '60% 40%', gap: 64, alignItems: 'center' }}>

          {/* Left — copy */}
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
              Pourquoi les IA ne citent <em style={{ color: '#D97757' }}>pas votre site ?</em>
            </h1>

            <p style={{ fontSize: 16, color: '#6B6762', maxWidth: 480, lineHeight: 1.7, fontFamily: 'system-ui', marginBottom: 12 }}>
              Découvrez ce qui empêche ChatGPT, Claude et Perplexity de vous recommander — et obtenez un plan d'action concret pour y remédier.
            </p>

            <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
              {['✓ Gratuit & sans inscription','✓ Score sur 100','✓ Résultats en ~20 secondes'].map(b => (
                <span key={b} style={{ fontSize: 12, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 500 }}>{b}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #E5E2DC', borderRadius: 14, padding: '6px 6px 6px 20px', maxWidth: 520, gap: 8, boxShadow: '0 4px 24px rgba(26,25,22,0.07)' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#A8A49F', whiteSpace: 'nowrap' }}>https://</span>
              <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyze()} placeholder="votresite.fr"
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#1A1916', padding: '11px 0', fontFamily: 'system-ui' }} />
              <button onClick={analyze} style={{ background: '#1A1916', color: '#F7F5F2', border: 'none', padding: '13px 26px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap' }}>
                Analyser gratuitement →
              </button>
            </div>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C2BDB8', marginTop: 12 }}>
              Aucune carte bancaire · Aucun compte · Résultats immédiats
            </p>
          </div>

          {/* Right — product mockup */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ProductMockup />
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Comment ça marche</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,40px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.2, marginBottom: 56, lineHeight: 1.1 }}>
            Un audit GEO complet en <em style={{ color: '#D97757' }}>20 secondes</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              ['01','#10A37F','Entrez votre URL','Collez l\'adresse de votre site. Zéro inscription, zéro configuration, zéro carte bancaire.'],
              ['02','#D97757','On analyse tout','Detekia scrape votre site et l\'évalue selon 8 critères GEO validés par la recherche.'],
              ['03','#4285F4','Recevez votre score','Score sur 100, analyse par critère, tooltips explicatifs et recommandations expertes.'],
            ].map(([num,color,title,desc]) => (
              <div key={num} style={{ background: '#FAFAF9', border: '1px solid #E5E2DC', borderRadius: 16, padding: '32px 26px', boxShadow: '0 2px 12px rgba(26,25,22,0.04)' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, color, marginBottom: 18, letterSpacing: -1 }}>{num}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1916', marginBottom: 10, fontFamily: 'system-ui' }}>{title}</div>
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

      {/* ── STATS DASHBOARD ──────────────────────────────────── */}
      <section style={{ background: '#1A1916', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[
            ['📊','94%','des sites analysés','obtiennent un score sous 60/100'],
            ['🔍','8','critères mesurés','extractibilité, autorité, structure…'],
            ['⚡','20s','d\'analyse','pour un rapport complet et actionnable'],
            ['🤖','4','moteurs IA couverts','ChatGPT, Claude, Gemini, Perplexity'],
          ].map(([emoji,stat,label,sub]) => (
            <div key={stat+label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '32px 22px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 12 }}>{emoji}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 64, color: '#D97757', letterSpacing: -2, lineHeight: 1, marginBottom: 10 }}>{stat}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(247,245,242,0.75)', fontFamily: 'system-ui', marginBottom: 5, letterSpacing: -0.2 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'rgba(247,245,242,0.32)', fontFamily: 'system-ui', lineHeight: 1.5 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8 CRITÈRES ──────────────────────────────────────── */}
      <section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Ce qu'on analyse</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,40px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.2, marginBottom: 56, lineHeight: 1.1 }}>
            8 critères <em style={{ color: '#D97757' }}>validés par la recherche</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {features.map(f => <CriteriaCard key={f.name} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── POURQUOI FAIRE CONFIANCE ─────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Transparence & confiance</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,40px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.2, marginBottom: 56, lineHeight: 1.1 }}>
            Pourquoi faire confiance <em style={{ color: '#D97757' }}>à Detekia ?</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { icon: '🔬', accent: '#4285F4', title: 'Méthode transparente', desc: 'Méthodologie entièrement documentée et publique. Vous savez comment chaque point est calculé.', link: '/methodologie' },
              { icon: '⚡', accent: '#10A37F', title: 'Résultats en 20 secondes', desc: 'Aucun devis, aucun rendez-vous. Votre rapport est disponible immédiatement, à toute heure.', link: null },
              { icon: '🔓', accent: '#D97757', title: 'Zéro inscription requise', desc: "Pas d'inscription, pas de mot de passe, pas d'email pour l'analyse gratuite.", link: null },
              { icon: '🔒', accent: '#1C7DC4', title: 'Paiement sécurisé Stripe', desc: 'Paiements traités par Stripe. Aucune donnée bancaire ne transite par nos serveurs.', link: null },
              { icon: '↩️', accent: '#C9861A', title: 'Remboursement sous 24h', desc: "Si votre rapport est inaccessible suite à un problème technique, remboursement intégral garanti.", link: null },
              { icon: '🛡️', accent: '#10A37F', title: 'Données non conservées', desc: 'Votre URL est analysée en temps réel. Aucune donnée de votre site stockée au-delà de 24h.', link: null },
            ].map(({ icon, accent, title, desc, link }) => (
              <div key={title} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '28px 24px', borderLeft: `4px solid ${accent}`, boxShadow: '0 2px 12px rgba(26,25,22,0.04)' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'Georgia, serif' }}>{title}</div>
                <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui' }}>{desc}</div>
                {link && <a href={link} style={{ display: 'inline-block', marginTop: 12, fontSize: 12, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none', borderBottom: '1px solid rgba(217,119,87,0.3)', paddingBottom: 1 }}>Voir la méthodologie →</a>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ILS FONT CONFIANCE ───────────────────────────────── */}
      <section style={{ background: '#F0EDE8', padding: '72px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Utilisateurs</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,3.5vw,34px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 44, lineHeight: 1.15 }}>
            Ils font confiance à <em style={{ color: '#D97757' }}>Detekia</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
            {[
              ['🏪','E-commerce'],
              ['🏢','Agences web'],
              ['🚀','SaaS & startups'],
              ['💼','Consultants'],
              ['📰','Médias & blogs'],
              ['🎓','Experts & formateurs'],
            ].map(([icon, label]) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '24px 12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(26,25,22,0.04)' }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#3A3835', fontFamily: 'system-ui', lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section style={{ background: '#F7F5F2', padding: '96px 48px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,40px)', color: '#1A1916', textAlign: 'center', letterSpacing: -1.2, marginBottom: 48, lineHeight: 1.1 }}>
            Questions <em style={{ color: '#D97757' }}>fréquentes</em>
          </h2>
          {faqs.map((faq, i) => <FAQItem key={i} question={faq.question} answer={faq.answer} />)}
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section style={{ background: '#1A1916', padding: '100px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Radial gradients */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(217,119,87,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(16,163,127,0.08) 0%, transparent 50%)', pointerEvents: 'none' }} />
        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(247,245,242,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,163,127,0.15)', border: '1px solid rgba(16,163,127,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10A37F' }} />
            <span style={{ fontSize: 12, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 500 }}>Gratuit · Sans inscription · Sans carte bancaire</span>
          </div>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,5vw,54px)', color: '#F7F5F2', letterSpacing: -1.5, marginBottom: 16, lineHeight: 1.05 }}>
            Votre site mérite d'être cité<br /><em style={{ color: '#D97757' }}>par les IA</em>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', marginBottom: 40, lineHeight: 1.65, maxWidth: 460, margin: '0 auto 32px' }}>
            Découvrez votre score GEO en 20 secondes et obtenez un plan d'action concret pour être recommandé par ChatGPT, Claude, Gemini et Perplexity.
          </p>

          {/* AI chips */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
            {[['#10A37F','ChatGPT'],['#D97757','Claude'],['#4285F4','Gemini'],['#1C7DC4','Perplexity']].map(([c,name]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'monospace', padding: '5px 13px', borderRadius: 20, border: `1px solid ${c}40`, background: c + '14', color: c, letterSpacing: 0.5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />{name}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(247,245,242,0.07)', border: '1px solid rgba(247,245,242,0.14)', borderRadius: 14, padding: '6px 6px 6px 22px', maxWidth: 520, margin: '0 auto 16px', gap: 10, backdropFilter: 'blur(8px)' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(247,245,242,0.35)', whiteSpace: 'nowrap' }}>https://</span>
            <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyze()} placeholder="votresite.fr"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#F7F5F2', padding: '12px 0', fontFamily: 'system-ui' }} />
            <button onClick={analyze} style={{ background: '#D97757', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap', boxShadow: '0 6px 20px rgba(217,119,87,0.45)' }}>
              Analyser →
            </button>
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.22)', letterSpacing: 1 }}>
            Analyse gratuite · Rapport complet à 19,99€ · Offre de lancement jusqu'au 15 avril
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
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '60% 40%'"] { grid-template-columns: 1fr !important; }
          div[style*="gridTemplateColumns: 'repeat(4,1fr)'"] { grid-template-columns: repeat(2,1fr) !important; }
          div[style*="gridTemplateColumns: 'repeat(3,1fr)'"] { grid-template-columns: 1fr !important; }
          div[style*="gridTemplateColumns: 'repeat(6,1fr)'"] { grid-template-columns: repeat(3,1fr) !important; }
          section { padding-left: 24px !important; padding-right: 24px !important; }
          nav { padding: 0 20px !important; }
          footer { padding: 28px 20px !important; }
        }
      `}</style>
    </div>
  );
}
