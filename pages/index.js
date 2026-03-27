import { useState } from 'react';
import { useRouter } from 'next/router';

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ borderBottom: '1px solid #E5E2DC', overflow: 'hidden' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default' }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: open ? '#1A1916' : '#3A3835', fontFamily: 'system-ui', transition: 'color 0.3s' }}>{question}</div>
        <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid ${open ? '#1A1916' : '#E5E2DC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 16, transition: 'all 0.3s', background: open ? '#1A1916' : 'transparent' }}>
          <span style={{ fontSize: 14, color: open ? '#F7F5F2' : '#8A8680', lineHeight: 1, transition: 'all 0.3s', transform: open ? 'rotate(45deg)' : 'none', display: 'block' }}>+</span>
        </div>
      </div>
      <div style={{ maxHeight: open ? '300px' : '0', opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease' }}>
        <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.75, fontFamily: 'system-ui', paddingBottom: 20 }}>{answer}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState('');
  const router = useRouter();

  async function analyze() {
    if (!url) return;
    const cleanUrl = url.replace(/^https?:\/\//, '');
    router.push(`/results?url=${encodeURIComponent(cleanUrl)}`);
  }

  const faqs = [
    {
      question: "C'est quoi le GEO et en quoi c'est différent du SEO ?",
      answer: "Le GEO (Generative Engine Optimization) est l'art d'optimiser votre site pour apparaître dans les réponses des intelligences artificielles — ChatGPT, Claude, Gemini, Perplexity. Contrairement au SEO qui vise à ranker sur Google, le GEO vise à être cité et recommandé directement dans les réponses des IA. Les critères sont différents : les IA valorisent la clarté, la citabilité, la crédibilité et les données structurées.",
    },
    {
      question: "Comment fonctionne l'analyse Detekia ?",
      answer: "Entrez l'URL de votre site, Detekia scrape votre contenu et l'analyse selon 8 critères GEO : extractibilité, vérifiabilité, autorité E-E-A-T, crawlabilité IA, données structurées, neutralité éditoriale, présence externe et fraîcheur. Notre IA génère ensuite des recommandations expertes personnalisées pour votre site. La méthodologie complète est disponible sur la page Méthodologie.",
    },
    {
      question: "Pourquoi l'analyse est-elle vraiment gratuite ?",
      answer: "L'analyse de base — score sur 100, 8 critères détaillés, une recommandation experte en aperçu — est totalement gratuite et sans inscription. Aucune carte bancaire requise. Nous croyons que tout le monde devrait pouvoir savoir si son site est visible par les IA. Le rapport complet avec toutes les recommandations détaillées et les plans d'action est disponible à 19,99€ (offre de lancement jusqu'au 15 avril, au lieu de 59,99€).",
    },
    {
      question: "Qu'est-ce qu'un bon score GEO ?",
      answer: "Sur Detekia, un score supérieur à 70/100 est considéré comme bon. Entre 45 et 70, votre site a des bases solides mais nécessite des optimisations ciblées. En dessous de 45, des actions prioritaires s'imposent. La majorité des sites analysés obtiennent un score entre 15 et 45 — même les grandes marques obtiennent souvent des scores faibles car leurs sites sont optimisés pour vendre, pas pour être cités par les IA.",
    },
    {
      question: "Les données de mon site sont-elles conservées ?",
      answer: "Non. Detekia analyse votre site en temps réel et ne conserve aucune donnée de votre site au-delà de 24h. Les résultats d'analyse sont mis en cache 24h pour accélérer les analyses successives du même site, mais aucune donnée personnelle n'est stockée.",
    },
    {
      question: "Detekia fonctionne-t-il pour tous les types de sites ?",
      answer: "Oui — e-commerce, blogs, SaaS, sites vitrine, portfolios, sites institutionnels. Les critères GEO sont universels. Certains types de sites ont toutefois un avantage naturel : les blogs avec du contenu éditorial riche, les sites avec une forte présence presse, et les plateformes qui publient des données originales. Mais tous les sites peuvent progresser significativement avec les bonnes optimisations.",
    },
  ];

  const features = [
    ['🎯', 'Extractibilité', "Votre contenu répond-il clairement dès les premières lignes ? Les IA cherchent des réponses 'prêtes à citer'."],
    ['🔬', 'Vérifiabilité', "Chiffres sourcés, dates, liens vers preuves — les IA citent ce qu'elles peuvent vérifier."],
    ['🏆', 'Autorité E-E-A-T', "Expérience, Expertise, Autorité, Confiance — les 4 piliers que les IA évaluent en priorité."],
    ['🤖', 'Crawlabilité IA', "GPTBot, ClaudeBot, OAI-SearchBot — votre site leur est-il accessible ?"],
    ['🧩', 'Données structurées', "Schema.org FAQPage, Organization, Article — le langage natif des IA."],
    ['⚖️', 'Neutralité éditoriale', "Un contenu factuel et nuancé est 3x plus cité qu'un contenu promotionnel."],
    ['🌐', 'Présence externe', "Mentions presse, réseaux sociaux, citations tierces — les signaux d'autorité croisés."],
    ['📅', 'Fraîcheur', "Les IA privilégient les contenus récents et maintenus pour les sujets qui évoluent."],
  ];

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
            {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
              <div key={i} style={{ background: c, borderRadius: '50%' }} />
            ))}
          </div>
          Detekia
        </a>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="/pricing" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Tarifs</a>
          <a href="/methodologie" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Méthodologie</a>
          <a href="/contact" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Contact</a>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontFamily: 'system-ui' }}>Analyser gratuitement</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '88px 24px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,163,127,0.08)', border: '1px solid rgba(16,163,127,0.2)', borderRadius: 20, padding: '6px 14px', marginBottom: 32 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10A37F' }} />
          <span style={{ fontSize: 12, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 500 }}>Analyse 100% gratuite — aucune inscription requise</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {[['#10A37F','ChatGPT'],['#D97757','Claude'],['#4285F4','Gemini'],['#1C7DC4','Perplexity']].map(([c,name]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'monospace', padding: '5px 12px', borderRadius: 20, border: '1px solid #E5E2DC', background: '#fff', color: '#8A8680' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
              {name}
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 7vw, 68px)', lineHeight: 1.0, letterSpacing: -1.5, marginBottom: 20, color: '#1A1916' }}>
          Pourquoi les IA ne citent<br />
          <em style={{ color: '#D97757', fontStyle: 'italic' }}>pas votre site ?</em>
        </h1>

        <p style={{ fontSize: 16, color: '#8A8680', maxWidth: 520, margin: '0 auto 12px', lineHeight: 1.65, fontFamily: 'system-ui' }}>
          Découvrez ce qui empêche ChatGPT, Claude et Perplexity de vous recommander — et obtenez un plan d'action concret pour y remédier.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 36, flexWrap: 'wrap' }}>
          {['✓ Gratuit & sans inscription', '✓ Score sur 100', '✓ Résultats en ~20 secondes'].map(b => (
            <span key={b} style={{ fontSize: 12, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 500 }}>{b}</span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #E5E2DC', borderRadius: 14, padding: '6px 6px 6px 20px', maxWidth: 580, margin: '0 auto', gap: 10, boxShadow: '0 4px 20px rgba(26,25,22,0.08)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#8A8680', whiteSpace: 'nowrap' }}>https://</span>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
            placeholder="votresite.fr"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#1A1916', padding: '10px 0', fontFamily: 'system-ui' }}
          />
          <button onClick={analyze} style={{ background: '#1A1916', color: '#F7F5F2', border: 'none', padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap' }}>
            Analyser gratuitement →
          </button>
        </div>

        <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C2BDB8', marginTop: 12, marginBottom: 80 }}>
          Aucune carte bancaire · Aucun compte · Résultats immédiats
        </p>
      </div>

      {/* COMMENT ÇA MARCHE */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 16px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Comment ça marche</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
          Un audit GEO complet en <em style={{ color: '#D97757' }}>20 secondes</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            ['01', '#10A37F', 'Entrez votre URL', 'Collez l\'adresse de votre site. Zéro inscription, zéro configuration, zéro carte bancaire.'],
            ['02', '#D97757', 'On analyse tout', 'Detekia scrape votre site et l\'évalue selon 8 critères GEO validés par la recherche.'],
            ['03', '#4285F4', 'Recevez votre score', 'Score sur 100, analyse par critère, tooltips explicatifs et recommandations expertes.'],
          ].map(([num, color, title, desc]) => (
            <div key={num} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color, marginBottom: 16, letterSpacing: -1 }}>{num}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui' }}>{title}</div>
              <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui' }}>{desc}</div>
            </div>
          ))}
        </div>
        {/* Lien méthodologie */}
        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 64 }}>
          <a href="/methodologie" style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', textDecoration: 'none', borderBottom: '1px solid #E5E2DC', paddingBottom: 2 }}>
            Voir la méthodologie complète →
          </a>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: '#1A1916', padding: '60px 24px', marginBottom: 80 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, textAlign: 'center' }}>
          {[
            ['94%', 'des sites ont un score GEO inférieur à 60/100'],
            ['8', 'critères GEO analysés en profondeur par notre IA'],
            ['20s', 'en moyenne pour obtenir un rapport complet'],
            ['4', 'moteurs IA couverts : ChatGPT, Claude, Gemini, Perplexity'],
          ].map(([stat, desc]) => (
            <div key={stat}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#D97757', letterSpacing: -1, marginBottom: 8 }}>{stat}</div>
              <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 8 CRITÈRES */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Ce qu'on analyse</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
          8 critères <em style={{ color: '#D97757' }}>validés par la recherche</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {features.map(([icon, name, desc]) => (
            <div key={name} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', marginBottom: 6, fontFamily: 'system-ui' }}>{name}</div>
              <div style={{ fontSize: 11, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* POURQUOI FAIRE CONFIANCE */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Transparence & confiance</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
          Pourquoi faire confiance <em style={{ color: '#D97757' }}>à Detekia ?</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            ['🔬', 'Méthode transparente', 'Notre méthodologie est entièrement documentée et publique. Vous savez exactement comment chaque point de votre score est calculé.', '/methodologie'],
            ['⚡', 'Analyse immédiate', 'Aucune attente de devis, aucun rendez-vous. Votre rapport est disponible en 20 secondes, à toute heure.', null],
            ['🔓', 'Aucun compte requis', 'Pas d\'inscription, pas de mot de passe, pas d\'email demandé pour l\'analyse gratuite. Essayez sans engagement.', null],
            ['🔒', 'Paiement sécurisé Stripe', 'Les paiements sont traités par Stripe, leader mondial du paiement en ligne. Aucune donnée bancaire ne transite par nos serveurs.', null],
            ['↩️', 'Remboursement sous 24h', 'Si votre rapport n\'est pas accessible suite à un problème technique, nous vous remboursons intégralement sous 24 heures.', null],
            ['🛡️', 'Données non conservées', 'Votre URL est analysée en temps réel. Aucune donnée de votre site n\'est stockée au-delà de 24h de cache technique.', null],
          ].map(([icon, title, desc, link]) => (
            <div key={title} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '20px 20px 16px' }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', marginBottom: 6, fontFamily: 'system-ui' }}>{title}</div>
              <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.65, fontFamily: 'system-ui' }}>{desc}</div>
              {link && (
                <a href={link} style={{ display: 'inline-block', marginTop: 10, fontSize: 11, color: '#D97757', fontFamily: 'system-ui', textDecoration: 'none', borderBottom: '1px solid rgba(217,119,87,0.3)', paddingBottom: 1 }}>
                  Voir la méthodologie →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>FAQ</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 40 }}>
          Questions <em style={{ color: '#D97757' }}>fréquentes</em>
        </h2>
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      {/* CTA FINAL */}
      <div style={{ background: '#1A1916', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,163,127,0.15)', border: '1px solid rgba(16,163,127,0.3)', borderRadius: 20, padding: '6px 14px', marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10A37F' }} />
            <span style={{ fontSize: 12, color: '#10A37F', fontFamily: 'system-ui', fontWeight: 500 }}>Gratuit · Sans inscription · Sans carte bancaire</span>
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#F7F5F2', letterSpacing: -1, marginBottom: 12, lineHeight: 1.1 }}>
            Votre site mérite d'être cité<br /><em style={{ color: '#D97757' }}>par les IA.</em>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', marginBottom: 32, lineHeight: 1.6 }}>
            Découvrez votre score GEO en 20 secondes — et les premières actions concrètes à mettre en place.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(247,245,242,0.08)', border: '1px solid rgba(247,245,242,0.15)', borderRadius: 14, padding: '6px 6px 6px 20px', maxWidth: 500, margin: '0 auto 16px', gap: 10 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(247,245,242,0.4)', whiteSpace: 'nowrap' }}>https://</span>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyze()}
              placeholder="votresite.fr"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#F7F5F2', padding: '10px 0', fontFamily: 'system-ui' }}
            />
            <button onClick={analyze} style={{ background: '#D97757', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap' }}>
              Analyser →
            </button>
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.25)', letterSpacing: 1 }}>
            Analyse gratuite · Rapport complet à 19,99€ · Offre de lancement jusqu'au 15 avril
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #E5E2DC', padding: '32px 48px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, maxWidth: 1200, margin: '0 auto' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif', marginBottom: 4 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
                {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
                  <div key={i} style={{ background: c, borderRadius: '50%' }} />
                ))}
              </div>
              Detekia
            </div>
            <div style={{ fontSize: 11, color: '#C2BDB8', fontFamily: 'system-ui' }}>par Beeleven SASU · Paris</div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              ['Tarifs', '/pricing'],
              ['Méthodologie', '/methodologie'],
              ['Contact', '/contact'],
              ['Mentions légales', '/legal'],
              ['Confidentialité', '/legal'],
              ['CGU', '/legal'],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{label}</a>
            ))}
            <a href="https://linkedin.com/company/detekia" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>LinkedIn</a>
          </div>
        </div>
      </footer>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}
