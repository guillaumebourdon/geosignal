const CRITERIA = [
  {
    icon: '🎯',
    name: 'Extractibilité & réponse directe',
    weight: '25 pts',
    color: '#4285F4',
    what: 'Les IA cherchent des réponses "prêtes à citer" dans votre contenu. Un bon site répond à la question dès les premières lignes, avec des listes, des tableaux, des titres clairs.',
    good: 'Intro qui répond directement en 1-2 phrases, listes à puces, tableaux de données, structure H2/H3 logique, paragraphes courts (50-300 caractères).',
    bad: 'Introduction généraliste sans réponse directe, blocs de texte denses, absence de listes ou tableaux, structure plate sans hiérarchie.',
  },
  {
    icon: '🔬',
    name: 'Vérifiabilité & preuves',
    weight: '20 pts',
    color: '#10A37F',
    what: 'Les IA citent en priorité les contenus qui prouvent ce qu\'ils avancent : chiffres sourcés, dates précises, liens vers des sources primaires, citations.',
    good: 'Chiffres avec sources, dates explicites, liens externes vers études ou organismes de référence, tableaux comparatifs, citations d\'experts.',
    bad: 'Affirmations sans sources ("il est prouvé que..."), absence de chiffres ou chiffres sans source, aucun lien externe, pas de date de publication.',
  },
  {
    icon: '🏆',
    name: 'Autorité E-E-A-T',
    weight: '15 pts',
    color: '#D97757',
    what: 'E-E-A-T (Expérience, Expertise, Autorité, Confiance) est le cadre que les IA utilisent pour évaluer la crédibilité d\'un site et de ses auteurs.',
    good: 'Page auteur avec biographie et photo, schéma "author" en JSON-LD, page À propos détaillée, page Contact, mentions légales complètes, schema Organization.',
    bad: 'Contenu anonyme sans auteur identifié, absence de page À propos ou Contact, pas de mentions légales, aucun schema.org sur les entités.',
  },
  {
    icon: '🤖',
    name: 'Crawlabilité IA',
    weight: '15 pts',
    color: '#4285F4',
    what: 'Les robots des IA (GPTBot, ClaudeBot, OAI-SearchBot) doivent pouvoir lire votre site. Un site bloqué ou peu accessible ne peut pas être indexé.',
    good: 'Balise lang définie, canonical correct, contenu non bloqué par JavaScript, mention des bots IA dans robots.txt ou headers, sitemap.xml.',
    bad: 'Meta robots noindex, contenu chargé uniquement en JS sans SSR, balise lang absente, redirection infinie, pas de canonical.',
  },
  {
    icon: '🧩',
    name: 'Données structurées',
    weight: '10 pts',
    color: '#4285F4',
    what: 'Le Schema.org est le langage que les IA lisent en priorité pour comprendre ce qu\'est votre site, qui l\'a écrit, et de quoi il parle.',
    good: 'Schema FAQPage, Article, HowTo, Organization, Person en JSON-LD. Les schemas prioritaires (FAQPage, HowTo) sont particulièrement valorisés.',
    bad: 'Aucun schema.org, schemas incorrects ou incomplets, absence de schema sur les entités clés (Organisation, Auteur).',
  },
  {
    icon: '⚖️',
    name: 'Neutralité éditoriale',
    weight: '10 pts',
    color: '#10A37F',
    what: 'Les IA évitent de citer des contenus trop promotionnels ou biaisés. Un texte factuel et nuancé sera beaucoup plus souvent repris comme source.',
    good: 'Ton informatif et factuel, nuances présentes, claims sourcés, vocabulaire précis sans superlatifs excessifs.',
    bad: 'Superlatifs non sourcés ("le meilleur", "révolutionnaire"), claims sans preuve, ton exclusivement publicitaire, absence de nuance.',
  },
  {
    icon: '🌐',
    name: 'Présence externe',
    weight: '5 pts',
    color: '#10A37F',
    what: 'Les IA croisent plusieurs sources pour évaluer votre crédibilité. Être mentionné dans la presse ou cité sur d\'autres sites renforce votre autorité perçue.',
    good: 'Mentions presse avec liens, présence active sur LinkedIn/Twitter, témoignages et avis référencés, citations dans des articles tiers.',
    bad: 'Aucun lien entrant identifiable, absence de réseaux sociaux, aucune mention presse ou tierce.',
  },
  {
    icon: '📅',
    name: 'Fraîcheur & maintenance',
    weight: '5 pts',
    color: '#C9861A',
    what: 'Pour les sujets qui évoluent, les IA préfèrent les contenus récents. Une date de mise à jour visible et un copyright récent signalent que le site est actif.',
    good: 'dateModified en JSON-LD, date de mise à jour visible, copyright de l\'année en cours, contenu récent dans les balises meta.',
    bad: 'Aucune date visible, copyright daté d\'il y a 3+ ans, schéma dateModified absent, articles sans date de publication.',
  },
];

export default function Methodologie() {
  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
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
          <a href="/methodologie" style={{ fontSize: 13, color: '#1A1916', fontWeight: 600, textDecoration: 'none', fontFamily: 'system-ui' }}>Méthodologie</a>
          <a href="/contact" style={{ fontSize: 13, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Contact</a>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontFamily: 'system-ui' }}>Analyser mon site</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.3)', padding: '5px 14px', borderRadius: 20, marginBottom: 24, background: 'rgba(217,119,87,0.06)' }}>
          Transparence totale
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 16, color: '#1A1916' }}>
          Comment Detekia<br /><em style={{ color: '#D97757' }}>calcule votre score</em>
        </h1>
        <p style={{ fontSize: 15, color: '#8A8680', lineHeight: 1.7, fontFamily: 'system-ui', marginBottom: 64, maxWidth: 560, margin: '0 auto 64px' }}>
          Notre score GEO est calculé à partir de 8 critères mesurables et vérifiables, basés sur les recherches académiques en Generative Engine Optimization et les guidelines publiques des principaux modèles d'IA.
        </p>
      </div>

      {/* COMMENT ÇA MARCHE */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Le processus</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
          3 étapes d'analyse automatisée
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            ['01', '#10A37F', 'Scraping du contenu', 'Detekia récupère le HTML complet de votre page via Jina Reader — un service de scraping optimisé pour les IA. Le HTML brut, le texte et les métadonnées sont extraits.'],
            ['02', '#D97757', 'Analyse heuristique', 'Notre moteur d\'analyse calcule 7 scores heuristiques en inspectant le DOM : balises, attributs, ratios, comptages. Ces scores sont reproductibles et déterministes.'],
            ['03', '#4285F4', 'Analyse IA (Claude)', 'Claude Haiku analyse le contenu textuel pour évaluer la neutralité éditoriale et générer des recommandations contextualisées. Le score final intègre ce résultat.'],
          ].map(([num, color, title, desc]) => (
            <div key={num} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color, marginBottom: 16, letterSpacing: -1 }}>{num}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', marginBottom: 8, fontFamily: 'system-ui' }}>{title}</div>
              <div style={{ fontSize: 13, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SCORE */}
      <div style={{ background: '#1A1916', padding: '60px 24px', marginBottom: 80 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Calcul du score</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#F7F5F2', letterSpacing: -1, marginBottom: 16 }}>
            Score sur 100 = 7 heuristiques + neutralité IA
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.7, marginBottom: 40, maxWidth: 540, margin: '0 auto 40px' }}>
            Les 7 premiers critères sont calculés par des règles déterministes sur le HTML. Le 8e critère (neutralité éditoriale) est noté par Claude sur 10, puis converti en bonus/malus ±5 points ajouté au total.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, textAlign: 'center' }}>
            {[['25', 'Extractibilité'],['20', 'Vérifiabilité'],['15', 'Autorité E-E-A-T'],['15', 'Crawlabilité'],['10', 'Données structurées'],['10', 'Neutralité éditoriale'],['5', 'Présence externe'],['5', 'Fraîcheur']].map(([pts, name]) => (
              <div key={name} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 8px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#D97757', letterSpacing: -1 }}>{pts}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(247,245,242,0.35)', marginBottom: 2 }}>pts</div>
                <div style={{ fontSize: 11, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.4 }}>{name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8 CRITÈRES DÉTAILLÉS */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Détail des critères</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#1A1916', textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
          Les 8 critères <em style={{ color: '#D97757' }}>expliqués</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CRITERIA.map((c, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui' }}>{c.name}</div>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: c.color, background: c.color + '14', border: `1px solid ${c.color}30`, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>
                  {c.weight}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Ce qu'on mesure</div>
                  <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.65, fontFamily: 'system-ui' }}>{c.what}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>✓ Bon signal</div>
                  <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.65, fontFamily: 'system-ui' }}>{c.good}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>✗ Mauvais signal</div>
                  <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.65, fontFamily: 'system-ui' }}>{c.bad}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIMITES */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 16, padding: '32px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Limites de l'analyse</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['Analyse de surface', 'Detekia analyse la page d\'accueil ou la page soumise, pas l\'intégralité du site. Un site peut avoir du contenu excellent sur d\'autres pages non analysées.'],
              ['Facteurs non mesurables', 'La qualité intrinsèque du contenu, la réputation hors-ligne, les backlinks entrants, et l\'historique de citation par les IA ne sont pas mesurables par notre analyse technique.'],
              ['Évolution des algorithmes', 'Les critères de citation des IA évoluent régulièrement. Notre méthodologie est mise à jour mais peut présenter un décalage avec les dernières pratiques des modèles.'],
              ['Sites dynamiques', 'Les sites qui chargent leur contenu entièrement en JavaScript côté client (SPA sans SSR) peuvent obtenir des scores sous-évalués car le contenu n\'est pas accessible au scraper.'],
            ].map(([title, desc]) => (
              <div key={title}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SOURCES */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Sources & références</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Aggarwal et al. (2023) — "GEO: Generative Engine Optimization" — arXiv:2311.09735',
            'Google Search Essentials — E-E-A-T guidelines (2024)',
            'OpenAI — GPTBot documentation & robots.txt guidelines',
            'Anthropic — ClaudeBot crawling policies',
            'Schema.org — Documentation officielle FAQPage, Article, Organization',
          ].map((source, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', marginTop: 2, flexShrink: 0 }}>→</span>
              <span style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.6 }}>{source}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#1A1916', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#F7F5F2', letterSpacing: -1, marginBottom: 12, lineHeight: 1.1 }}>
            Testez votre site<br /><em style={{ color: '#D97757' }}>gratuitement</em>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', marginBottom: 28, lineHeight: 1.6 }}>
            Analyse complète en 20 secondes. Aucune inscription requise.
          </p>
          <a href="/" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: 'system-ui' }}>
            Analyser mon site →
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #E5E2DC', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 'bold', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
            {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
              <div key={i} style={{ background: c, borderRadius: '50%' }} />
            ))}
          </div>
          Detekia
          <span style={{ fontSize: 11, fontWeight: 400, color: '#C2BDB8', fontFamily: 'system-ui', marginLeft: 8 }}>par Beeleven SASU</span>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[['Tarifs','/pricing'],['Méthodologie','/methodologie'],['Mentions légales','/legal'],['Contact','/contact']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>{label}</a>
          ))}
        </div>
      </footer>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}
