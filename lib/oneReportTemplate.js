/**
 * Detekia — One-page report HTML template (shared between generate-pdf.js and preview-report.js).
 * Single source of truth for the HTML/CSS/i18n of the GEO report.
 */

// ─── i18n strings ────────────────────────────────────────────────────────────

// Strip accents for key lookup matching
function stripAccents(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const CRITERIA_NAMES = {
  fr: {
    'Extractibilite & reponse directe': 'Extractibilite & reponse directe',
    'Verifiabilite & preuves': 'Verifiabilite & preuves',
    'Autorite & E-E-A-T': 'Autorite & E-E-A-T',
    'Crawlabilite IA': 'Crawlabilite IA',
    'Donnees structurees': 'Donnees structurees',
    'Neutralite editoriale': 'Neutralite editoriale',
    'Presence externe': 'Presence externe',
    'Fraicheur & maintenance': 'Fraicheur & maintenance',
  },
  en: {
    'Extractibilite & reponse directe': 'Extractability & direct answer',
    'Verifiabilite & preuves': 'Verifiability & evidence',
    'Autorite & E-E-A-T': 'Authority & E-E-A-T',
    'Crawlabilite IA': 'AI Crawlability',
    'Donnees structurees': 'Structured data',
    'Neutralite editoriale': 'Editorial neutrality',
    'Presence externe': 'External presence',
    'Fraicheur & maintenance': 'Freshness & maintenance',
  },
};

function translateCriterionName(name, locale) {
  const stripped = stripAccents(name);
  const map = CRITERIA_NAMES[locale] || CRITERIA_NAMES.fr;
  return map[stripped] || name;
}

const S = {
  fr: {
    grade: { good: 'BON', average: 'MOYEN', poor: 'FAIBLE' },
    criterionGrade: { good: 'BON', important: 'IMPORTANT', critical: 'CRITIQUE' },
    criterionGroup: { readability: 'Lisibilite IA', credibility: 'Credibilite', freshness: 'Fraicheur', other: 'Optimisation' },
    delay: { high: '1-2 sem.', medium: '1 mois', low: '2-3 mois' },
    impact: { high: 'Eleve', medium: 'Moyen', low: 'Faible' },
    priority: { high: 'CRITIQUE', medium: 'IMPORTANT', low: 'BONUS' },
    recoTitles: [
      { icon: '\u{1F50D}', title: 'Diagnostic', key: 'diagnostic' },
      { icon: '\u26A0\uFE0F', title: "Pourquoi c'est critique", key: 'whyCritical' },
      { icon: '\u2705', title: "Ce qu'il faut faire", key: 'whatToDo' },
      { icon: '\u{1F6E0}\uFE0F', title: 'Comment le faire', key: 'howToDoIt' },
      { icon: '\u{1F4A1}', title: 'Exemple concret', key: 'concreteExample' },
      { icon: '\u{1F4C8}', title: 'Impact attendu', key: 'expectedImpact' },
      { icon: '\u{1F3AF}', title: "Tip d'expert", key: 'expertTip' },
    ],
    wellOptimized: 'Ce critere est bien optimise. Continuez a maintenir ce niveau.',
    cover: { title: 'RAPPORT GEO COMPLET', confidential: 'Ce rapport est personnel et confidentiel', verdictGood: 'Excellente citabilite IA', verdictAvg: 'Citabilite IA a ameliorer', verdictPoor: 'Citabilite IA insuffisante' },
    synthesis: { label: 'Synthese executive', h1: "Resultats de l'analyse", avgNote: 'La majorite des sites analyses obtient un score inferieur a 50/100.', criteriaH2: 'Les 8 criteres GEO', top3H2: '3 actions prioritaires', strengthsH2: 'Points forts identifies', noEvidence: 'Donnees detaillees non disponibles pour ce scan. Relancez l\'analyse pour un rapport enrichi.', colCriterion: 'Critere', colScore: 'Score', colProgress: 'Progression', colStatus: 'Statut' },
    context: {
      label: 'Contexte 2026', h1: 'Pourquoi la visibilite IA est critique en 2026',
      intro: 'Les moteurs de recherche IA changent radicalement la facon dont les internautes trouvent l\'information. Voici les donnees cles qui expliquent pourquoi votre visibilite IA est devenue un enjeu business direct.',
      cards: [
        { label: 'Croissance du trafic IA', value: '+527%', text: 'Le trafic refere par les IA a augmente de 527% entre janvier et mai 2025.', source: 'Previsible, 2025 AI Traffic Report' },
        { label: 'Usage ChatGPT', value: '2,5 Mds', text: 'Requetes traitees par jour. 810 millions de personnes l\'utilisent quotidiennement.', source: 'Search Engine Land, 2026' },
        { label: 'Taux de conversion IA', value: '4,4x', text: 'Les visiteurs referes par les IA convertissent 4,4x mieux que les visiteurs organiques classiques.', source: 'Semrush, 2025' },
        { label: 'SEO vs GEO', value: '80%', text: 'Des URLs citees par ChatGPT ne sont PAS dans le top 100 Google. Le SEO seul ne suffit plus.', source: 'Ahrefs, 2025' },
        { label: 'Position du texte', value: '44,2%', text: 'Des citations IA proviennent des 30 premiers % du texte. Votre introduction est votre atout n1.', source: 'Growth Memo, 2026' },
        { label: 'Marche GEO', value: '33,7 Mds$', text: 'Valeur projetee du marche GEO en 2034, contre 848M$ en 2025.', source: 'eMarketer' },
      ],
      crossPlatform: 'Seulement 11% des domaines sont cites a la fois par ChatGPT ET Perplexity. Chaque plateforme IA a ses propres preferences — une raison supplementaire de travailler votre citabilite de facon transversale.',
      academicLabel: 'Source academique de reference',
      academicText: '"Generative Engine Optimization" — Aggarwal et al., Princeton University / Georgia Tech, KDD 2024. Cette etude demontre que l\'ajout de citations sourcees, de statistiques et de structure dans le contenu augmente la visibilite IA jusqu\'a 40%. C\'est le fondement methodologique de ce rapport.',
    },
    citationTest: {
      label: 'Test IA', h1: 'Test de visibilite IA',
      intro: 'Nous avons simule 10 requetes utilisateur pour verifier si votre site est cite par les moteurs IA.',
      queriesCite: 'requetes\ncitent votre site',
      cited: 'Cite', notCited: 'Non cite',
      competitorsLabel: 'Cites a votre place :',
      difficultyLabel: 'Difficulte pour etre cite :',
      recoLabel: 'Recommandation :',
      bestOpp: 'Meilleure opportunite :', mainBlocker: 'Blocage principal :',
      disclaimer: 'Ce test simule des requetes utilisateur via l\'IA. Il reflete la visibilite actuelle de votre marque dans les connaissances des IA. Les resultats peuvent varier selon le moteur IA, la formulation de la requete et le moment du test.',
    },
    criteriaPage: {
      criterionOf: 'Critere', of: '/',
      found: 'Ce que nous avons trouve',
      whyImportant: 'Pourquoi c\'est important',
      recommendation: 'Recommandation', recommendations: 'Recommandations',
      technicalGuide: 'Guide technique',
      realCase: 'Cas reel documente',
      relaunch: 'Relancez l\'analyse pour voir les donnees detaillees.',
      scopeNoteLabel: 'Note sur le perimetre de l\'analyse',
      scopeNoteWithLinks: 'Nous avons detecte sur votre page des liens vers : {links}. L\'analyse Detekia porte uniquement sur cette URL — assurez-vous que ces pages sont bien optimisees (bios, certifications, signaux d\'expertise), elles comptent pour votre visibilite IA globale.',
      scopeNoteWithoutLinks: 'Cette analyse porte uniquement sur la page fournie. Si vous avez une page equipe, a propos ou mentions professionnelles sur une autre URL de votre site, pensez a les analyser separement — elles comptent pour votre visibilite IA globale.',
    },
    evidence: {
      extractIntro: 'Extrait analyse — 300 premiers caracteres du site',
      headingsDetected: 'Structure H1/H2/H3 detectee',
      headingLevel: 'Niveau', headingText: 'Texte',
      noHeadings: 'Aucun titre H1/H2/H3 detecte',
      wordCount: 'Nombre de mots :',
      extLinks: 'Liens sortants vers sources externes',
      extLinksCount: 'lien(s) externe(s) detecte(s)',
      datesDetected: 'Dates detectees dans le contenu',
      noDate: 'Aucune date detectee',
      titleTag: 'Balise &lt;title&gt;',
      metaDesc: 'Meta description',
      notDefined: 'Non definie',
      socialDetected: 'Reseaux sociaux detectes',
      noSocial: 'Aucun lien vers reseaux sociaux',
      noSocialDetected: 'Aucun lien vers reseaux sociaux detecte',
      robotsContent: 'Contenu de robots.txt',
      notAccessible: 'Non accessible',
      llmsFile: 'Fichier llms.txt',
      llmsPresent: 'Present', llmsAbsent: 'Absent',
      schemasDetected: 'Schemas JSON-LD detectes',
      noSchema: 'Aucun schema JSON-LD detecte',
      schemaType: 'Type', schemaProps: 'Proprietes',
    },
    actionPlan: {
      label: "Plan d'action", h1: 'Recapitulatif des actions',
      intro: 'recommandations classees par priorite d\'impact.',
      colHash: '#', colPriority: 'Priorite', colAction: 'Action', colCriterion: 'Critere', colImpact: 'Impact', colDelay: 'Delai',
      currentScore: 'Score actuel', projectedScore: 'Score projete',
      projectionText: 'Si toutes les recommandations sont implementees, votre score devrait passer de',
      projectionTo: 'a environ',
    },
    beeleven: {
      label: 'Aller plus loin',
      h1: 'Aller plus loin avec Beeleven',
      text: 'Vous avez le diagnostic. Beeleven, l\'agence qui a cree Detekia, peut implementer les recommandations pour vous : audit approfondi, optimisations techniques, suivi mensuel des resultats.',
      cta: 'Discutons-en &rarr;',
    },
    methodology: {
      label: 'Transparence', h1: 'Methodologie',
      limitsWarning: "LIMITES DE L'ANALYSE : Ce rapport est genere par analyse automatisee du contenu accessible via scraping automatise. Certains elements rendus en JavaScript cote client, proteges par authentification, ou charges dynamiquement peuvent ne pas etre detectes. Les scores et recommandations refletent le contenu accessible au moment de l'analyse. En cas de doute sur un resultat specifique, une verification manuelle est recommandee.",
      howItWorks1: 'Ce rapport est genere par analyse automatisee du DOM de votre page via un <strong>service de scraping specialise pour les IA</strong> et evaluation sur <strong>8 criteres ponderes</strong>.',
      howItWorks2: 'Le critere <strong>Neutralite editoriale</strong> est evalue par intelligence artificielle. Les 7 autres criteres sont evalues par analyse technique du HTML.',
      howItWorks3: 'Le <strong>test de visibilite IA</strong> est realise par simulation de 10 requetes via l\'IA. Les resultats varient selon le moteur IA, la requete et le moment du test.',
      criteriaH2: 'Les 8 criteres et leur ponderation',
      colCriterion: 'Critere', colWeight: 'Poids', colMeasured: 'Ce qui est mesure',
      academicLabel: 'Source academique',
      academicText: '"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024. Certaines optimisations augmentent la visibilite IA jusqu\'a 40%.',
      limitsLabel: 'Limites de ce rapport',
      limitsText: 'Ce rapport mesure le <strong>potentiel de citation IA</strong>, pas le nombre reel de citations. Les resultats des moteurs IA varient selon la requete et le contexte.',
      scopeLabel: 'Perimetre de l\'analyse',
      scopeText: 'Les scores sont calcules sur la page analysee uniquement, pas le site entier. Pour une evaluation complete, analysez vos pages principales separement.',
      generatedOn: 'Rapport genere le',
      criteria: [
        { name: 'Extractibilite & reponse directe', weight: '25 pts', measured: 'Longueur intro, structure H2/H3, listes, tableaux, calibrage des paragraphes' },
        { name: 'Verifiabilite & preuves', weight: '20 pts', measured: 'Donnees chiffrees, liens externes sources, dates, tableaux, citations' },
        { name: 'Autorite & E-E-A-T', weight: '15 pts', measured: 'Page auteur, biographie, A propos, contact, mentions legales, schema Organization' },
        { name: 'Crawlabilite IA', weight: '15 pts', measured: 'Longueur contenu, lang, canonical, indexabilite, sitemap, bots IA autorises' },
        { name: 'Donnees structurees', weight: '10 pts', measured: 'HTML semantique, schemas JSON-LD (FAQPage, Article, HowTo, Organization...)' },
        { name: 'Neutralite editoriale', weight: '10 pts', measured: 'Evalue par IA — superlatifs, ton promotionnel, honnetete' },
        { name: 'Presence externe', weight: '5 pts', measured: 'Mentions presse, liens reseaux sociaux, temoignages tiers detectes' },
        { name: 'Fraicheur & maintenance', weight: '5 pts', measured: 'dateModified schema, annees recentes dans le contenu, copyright a jour' },
      ],
    },
    email: {
      subject: 'Votre rapport GEO complet',
      headerLabel: 'RAPPORT GEO COMPLET',
      topPriority: 'Priorite absolue',
      pdfNote: 'Votre rapport PDF complet avec toutes les recommandations detaillees est joint a cet email.',
      filename: 'rapport-geo',
    },
    why: {
      extractibilite: "44,2% des citations IA proviennent des 30 premiers % du texte d'une page (Growth Memo, 2026). L'etude Princeton/KDD 2024 demontre que l'ajout de statistiques et de citations dans le contenu augmente la visibilite IA de 30 a 40%. Votre introduction est votre atout n1.",
      verifiabilite: "Les IA favorisent les contenus factuels et sources. Les pages avec des donnees chiffrees sont citees 2,8x plus souvent que les pages sans donnees verifiables. (AirOps, 2026)",
      autorite: "L'autorite de domaine est le predicteur n1 des citations IA avec un score SHAP de 0,63 (SE Ranking, 2025). Les pages avec des auteurs identifies et des biographies sont significativement plus citees par les LLM.",
      crawlabilite: "73% des sites ne sont pas crawlables par les bots IA a cause de robots.txt, CDN ou JavaScript (Otterly.AI, 2026). Debloquer les crawlers IA est le quick win n1 — impact visible en 2 a 4 semaines.",
      'donnees structurees': "Les pages avec Schema FAQPage, Article et Organization sont plus facilement parsees par les IA. Le contenu structure en chunks est cite 3 a 5x plus souvent que le contenu brut. (Otterly.AI, 2026)",
      neutralite: "Les IA deprioritisent le contenu ouvertement promotionnel. L'etude Princeton montre que la 'Fluency Optimization' ameliore la visibilite IA, mais le ton doit rester factuel et informatif pour etre cite.",
      presence: "90% des citations IA proviennent de medias earned et owned, pas de placements payants (Edelman, 2026). Reddit est la source n1 pour Perplexity (6,6% des citations) et n2 pour ChatGPT.",
      fraicheur: "65% des visites de bots IA ciblent du contenu publie dans les 12 derniers mois (Seer Interactive, 2025). Un contenu non mis a jour depuis plus de 6 mois perd progressivement sa citabilite IA.",
    },
    cases: {
      extractibilite: "SEO Vendor a applique des tactiques d'extractibilite (sections citables, formatage reponse directe) et a obtenu 549 sessions ChatGPT en 7 mois, contre seulement 3 sessions organiques. (SEO Vendor, 2026)",
      verifiabilite: "Ahrefs genere 12,1% de ses inscriptions via le trafic IA (0,5% du trafic total) grace a des contenus riches en donnees verifiables. Les visiteurs IA consultent 50% plus de pages par session. (Ahrefs/Semrush, 2025)",
      autorite: "Les marques dans le top 25% des mentions web obtiennent 10x plus de visibilite IA. Les 50 premieres marques captent 28,9% de toutes les mentions dans les AI Overviews. (Ahrefs, 2025)",
      crawlabilite: "Triangle IP a cree un fichier llms.txt guidant les IA vers ses pages prioritaires. Resultat : 5x plus de trafic IA et une presence sur ChatGPT, Gemini, Perplexity et Copilot. (Concurate/SE Ranking, 2025)",
      'donnees structurees': "Un site a augmente sa visibilite IA de 340% en 6 mois grace a la restructuration de contenu et l'implementation de schema. Le trafic IA est passe de 127 a 2 340 sessions mensuelles. (Stackmatix, 2026)",
      neutralite: "L'etude Princeton montre que la 'Fluency Optimization' (reecriture factuelle du contenu) ameliore significativement la visibilite dans les reponses IA. Le contenu educatif est systematiquement cite devant le contenu promotionnel.",
      presence: "Reddit est cite dans 46,7% des reponses Perplexity (parmi le top 10 sources) et 1,8% des citations ChatGPT. Une presence active sur Reddit est le levier de presence externe le plus efficace. (Profound, 2025)",
      fraicheur: "79% des pages visitees par les bots IA ont ete publiees dans les 2 dernieres annees (Seer Interactive, 2025). Mettre a jour un article avec des donnees 2026 peut multiplier par 3 ses chances d'etre cite.",
    },
    guides: {
      extractibilite: "Pour ameliorer votre extractibilite, commencez par restructurer votre page d'accueil pour repondre directement a la question principale de votre audience des les 2 premieres phrases. Utilisez des listes a puces pour enumerer vos avantages, services ou fonctionnalites — les IA extraient les listes 3x plus facilement que le texte continu. Ajoutez des sous-titres H2/H3 descriptifs qui contiennent les mots-cles de vos requetes cibles. Evitez les introductions vagues type 'Bienvenue chez...' ou 'Leader de...' — preferez un format 'question-reponse' que les IA peuvent directement citer.",
      verifiabilite: "Les IA privilegient les contenus sources et verifiables. Pour chaque donnee chiffree de votre site, ajoutez un lien externe vers la source originale (etude, rapport, article de presse). Visez 5 a 10 liens externes par page principale vers des sources reconnues dans votre secteur. Ajoutez des dates explicites a vos contenus (datePublished, dateModified en JSON-LD). Les pages avec des citations sourcees sont citees 2,8x plus souvent par les IA (AirOps, 2026).",
      autorite: "Renforcez votre E-E-A-T en creant une page 'A propos' detaillee avec les qualifications de votre equipe, vos certifications, vos annees d'experience et vos publications. Ajoutez un schema Organization en JSON-LD. Creez des pages auteur pour chaque contributeur avec biographie, photo, et liens LinkedIn. Obtenez des mentions dans la presse ou sur des sites d'autorite de votre secteur.",
      crawlabilite: "Verifiez votre fichier robots.txt : les bots GPTBot (OpenAI), ClaudeBot (Anthropic), PerplexityBot et Google-Extended doivent etre autorises. Ajoutez un fichier llms.txt a la racine de votre site. Assurez-vous que votre contenu principal n'est pas rendu en JavaScript cote client (CSR). Utilisez le Server-Side Rendering (SSR) ou le Static Site Generation (SSG). Verifiez que votre sitemap.xml est a jour.",
      'donnees structurees': "Implementez au minimum ces schemas JSON-LD : Organization (nom, logo, contact, reseaux sociaux), FAQPage (vos questions frequentes), Article ou BlogPosting (pour chaque contenu editorial). Pour les e-commerces, ajoutez Product avec prix, disponibilite, avis agreges (AggregateRating). Validez avec le Google Rich Results Test. Les pages avec Schema structure sont citees 3 a 5x plus souvent par les IA (Otterly.AI, 2026).",
      neutralite: "Les IA deprioritisent le contenu ouvertement promotionnel. Remplacez les superlatifs ('le meilleur', 'n1', 'leader') par des donnees factuelles ('utilise par 5 000 entreprises', '98% de satisfaction client'). Ajoutez une section 'Limites' ou 'Pour qui ce n'est PAS fait'. Comparez honnetement votre offre avec les alternatives. L'etude Princeton/KDD 2024 montre que la reecriture factuelle ameliore la visibilite IA de 30 a 40%.",
      presence: "90% des citations IA proviennent de medias earned et owned (Edelman, 2026). Creez un profil actif sur Reddit — c'est la source n1 pour Perplexity. Participez aux discussions de votre secteur avec expertise. Obtenez des mentions dans des articles de presse, podcasts, interviews. Publiez des etudes originales ou des donnees proprietaires que d'autres sites voudront citer.",
      fraicheur: "Les bots IA privilegient le contenu recent : 65% des visites ciblent du contenu publie dans les 12 derniers mois (Seer Interactive, 2025). Ajoutez datePublished et dateModified en schema.org. Mettez a jour vos articles existants avec des donnees de l'annee en cours. Affichez la date de derniere mise a jour visiblement. Publiez regulierement (2-4 contenus/mois).",
    },
  },
  en: {
    grade: { good: 'GOOD', average: 'AVERAGE', poor: 'LOW' },
    criterionGrade: { good: 'GOOD', important: 'IMPORTANT', critical: 'CRITICAL' },
    criterionGroup: { readability: 'AI Readability', credibility: 'Credibility', freshness: 'Freshness', other: 'Optimization' },
    delay: { high: '1-2 weeks', medium: '1 month', low: '2-3 months' },
    impact: { high: 'High', medium: 'Medium', low: 'Low' },
    priority: { high: 'CRITICAL', medium: 'IMPORTANT', low: 'BONUS' },
    recoTitles: [
      { icon: '\u{1F50D}', title: 'Diagnosis', key: 'diagnostic' },
      { icon: '\u26A0\uFE0F', title: 'Why it\'s critical', key: 'whyCritical' },
      { icon: '\u2705', title: 'What to do', key: 'whatToDo' },
      { icon: '\u{1F6E0}\uFE0F', title: 'How to do it', key: 'howToDoIt' },
      { icon: '\u{1F4A1}', title: 'Concrete example', key: 'concreteExample' },
      { icon: '\u{1F4C8}', title: 'Expected impact', key: 'expectedImpact' },
      { icon: '\u{1F3AF}', title: 'Expert tip', key: 'expertTip' },
    ],
    wellOptimized: 'This criterion is well optimized. Keep maintaining this level.',
    cover: { title: 'FULL GEO REPORT', confidential: 'This report is personal and confidential', verdictGood: 'Excellent AI Visibility', verdictAvg: 'AI Visibility Needs Improvement', verdictPoor: 'Insufficient AI Visibility' },
    synthesis: { label: 'Executive Summary', h1: 'Analysis Results', avgNote: 'Most analyzed websites score below 50/100.', criteriaH2: 'The 8 GEO Criteria', top3H2: '3 Priority Actions', strengthsH2: 'Identified Strengths', noEvidence: 'Detailed data not available for this scan. Re-run the analysis for an enriched report.', colCriterion: 'Criterion', colScore: 'Score', colProgress: 'Progress', colStatus: 'Status' },
    context: {
      label: '2026 Context', h1: 'Why AI Visibility Is Critical in 2026',
      intro: 'AI search engines are radically changing how people find information. Here are the key data points that explain why your AI visibility has become a direct business concern.',
      cards: [
        { label: 'AI Traffic Growth', value: '+527%', text: 'AI-referred traffic surged 527% between January and May 2025.', source: 'Previsible, 2025 AI Traffic Report' },
        { label: 'ChatGPT Usage', value: '2.5B', text: 'Queries processed per day. 810 million people use it daily.', source: 'Search Engine Land, 2026' },
        { label: 'AI Conversion Rate', value: '4.4x', text: 'AI-referred visitors convert 4.4x better than traditional organic visitors.', source: 'Semrush, 2025' },
        { label: 'SEO vs GEO', value: '80%', text: 'Of URLs cited by ChatGPT are NOT in Google\'s top 100. SEO alone is no longer enough.', source: 'Ahrefs, 2025' },
        { label: 'Text Position', value: '44.2%', text: 'Of AI citations come from the first 30% of the text. Your introduction is your #1 asset.', source: 'Growth Memo, 2026' },
        { label: 'GEO Market', value: '$33.7B', text: 'Projected GEO market value by 2034, up from $848M in 2025.', source: 'eMarketer' },
      ],
      crossPlatform: 'Only 11% of domains are cited by both ChatGPT AND Perplexity. Each AI platform has its own preferences — another reason to work on your citation-worthiness across the board.',
      academicLabel: 'Academic reference source',
      academicText: '"Generative Engine Optimization" — Aggarwal et al., Princeton University / Georgia Tech, KDD 2024. This study demonstrates that adding sourced citations, statistics and structure to content increases AI visibility by up to 40%. This is the methodological foundation of this report.',
    },
    citationTest: {
      label: 'AI Test', h1: 'AI Visibility Test',
      intro: 'We simulated 10 user queries to check if your website is cited by AI engines.',
      queriesCite: 'queries\ncite your website',
      cited: 'Cited', notCited: 'Not cited',
      competitorsLabel: 'Cited instead of you:',
      difficultyLabel: 'Difficulty to get cited:',
      recoLabel: 'Recommendation:',
      bestOpp: 'Best opportunity:', mainBlocker: 'Main blocker:',
      disclaimer: 'This test simulates user queries via AI. It reflects the current visibility of your brand in AI knowledge. Results may vary depending on the AI engine, query phrasing and timing.',
    },
    criteriaPage: {
      criterionOf: 'Criterion', of: '/',
      found: 'What we found',
      whyImportant: 'Why it matters',
      recommendation: 'Recommendation', recommendations: 'Recommendations',
      technicalGuide: 'Technical guide',
      realCase: 'Documented real case',
      relaunch: 'Re-run the analysis to see detailed data.',
      scopeNoteLabel: 'Note on analysis scope',
      scopeNoteWithLinks: 'We detected links on your page pointing to: {links}. The Detekia analysis covers only this URL — make sure those pages are well optimized (bios, certifications, expertise signals), they contribute to your overall AI visibility.',
      scopeNoteWithoutLinks: 'This analysis covers only the provided URL. If you have a team, about or professional credentials page on another URL of your site, consider analyzing them separately — they contribute to your overall AI visibility.',
    },
    evidence: {
      extractIntro: 'Analyzed excerpt — first 300 characters of the site',
      headingsDetected: 'H1/H2/H3 structure detected',
      headingLevel: 'Level', headingText: 'Text',
      noHeadings: 'No H1/H2/H3 headings detected',
      wordCount: 'Word count:',
      extLinks: 'Outbound links to external sources',
      extLinksCount: 'external link(s) detected',
      datesDetected: 'Dates detected in content',
      noDate: 'No date detected',
      titleTag: '&lt;title&gt; tag',
      metaDesc: 'Meta description',
      notDefined: 'Not defined',
      socialDetected: 'Social media detected',
      noSocial: 'No social media links found',
      noSocialDetected: 'No social media links detected',
      robotsContent: 'robots.txt content',
      notAccessible: 'Not accessible',
      llmsFile: 'llms.txt file',
      llmsPresent: 'Present', llmsAbsent: 'Absent',
      schemasDetected: 'JSON-LD schemas detected',
      noSchema: 'No JSON-LD schema detected',
      schemaType: 'Type', schemaProps: 'Properties',
    },
    actionPlan: {
      label: 'Action Plan', h1: 'Action Summary',
      intro: 'recommendations ranked by impact priority.',
      colHash: '#', colPriority: 'Priority', colAction: 'Action', colCriterion: 'Criterion', colImpact: 'Impact', colDelay: 'Timeline',
      currentScore: 'Current Score', projectedScore: 'Projected Score',
      projectionText: 'If all recommendations are implemented, your score should go from',
      projectionTo: 'to approximately',
    },
    beeleven: {
      label: 'Going further',
      h1: 'Going further with Beeleven',
      text: 'You have the diagnosis. Beeleven, the agency that created Detekia, can implement the recommendations for you: in-depth audit, technical optimizations, monthly results monitoring.',
      cta: 'Let\'s talk &rarr;',
    },
    methodology: {
      label: 'Transparency', h1: 'Methodology',
      limitsWarning: 'ANALYSIS LIMITATIONS: This report is generated by automated analysis of content accessible via automated scraping. Some elements rendered via client-side JavaScript, protected by authentication, or dynamically loaded may not be detected. Scores and recommendations reflect the content accessible at the time of analysis. When in doubt about a specific result, manual verification is recommended.',
      howItWorks1: 'This report is generated by automated DOM analysis of your page via a <strong>specialized AI scraping service</strong> and evaluation across <strong>8 weighted criteria</strong>.',
      howItWorks2: 'The <strong>Editorial Neutrality</strong> criterion is evaluated by artificial intelligence. The other 7 criteria are evaluated through technical HTML analysis.',
      howItWorks3: 'The <strong>AI visibility test</strong> is performed by simulating 10 queries via AI. Results vary depending on the AI engine, query and timing.',
      criteriaH2: 'The 8 criteria and their weighting',
      colCriterion: 'Criterion', colWeight: 'Weight', colMeasured: 'What is measured',
      academicLabel: 'Academic source',
      academicText: '"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024. Certain optimizations increase AI visibility by up to 40%.',
      limitsLabel: 'Limitations of this report',
      limitsText: 'This report measures <strong>AI citation potential</strong>, not the actual number of citations. AI engine results vary depending on query and context.',
      scopeLabel: 'Analysis scope',
      scopeText: 'Scores are calculated on the analyzed page only, not the entire site. For a complete evaluation, analyze your main pages separately.',
      generatedOn: 'Report generated on',
      criteria: [
        { name: 'Extractability & direct answer', weight: '25 pts', measured: 'Intro length, H2/H3 structure, lists, tables, paragraph calibration' },
        { name: 'Verifiability & evidence', weight: '20 pts', measured: 'Hard data, sourced external links, dates, tables, citations' },
        { name: 'Authority & E-E-A-T', weight: '15 pts', measured: 'Author page, bio, About, contact, legal notices, Organization schema' },
        { name: 'AI Crawlability', weight: '15 pts', measured: 'Content length, lang, canonical, indexability, sitemap, AI bots allowed' },
        { name: 'Structured data', weight: '10 pts', measured: 'Semantic HTML, JSON-LD schemas (FAQPage, Article, HowTo, Organization...)' },
        { name: 'Editorial neutrality', weight: '10 pts', measured: 'Evaluated by AI — superlatives, promotional tone, honesty' },
        { name: 'External presence', weight: '5 pts', measured: 'Press mentions, social media links, third-party testimonials detected' },
        { name: 'Freshness & maintenance', weight: '5 pts', measured: 'dateModified schema, recent years in content, current copyright' },
      ],
    },
    email: {
      subject: 'Your full GEO report',
      headerLabel: 'FULL GEO REPORT',
      topPriority: 'Top Priority',
      pdfNote: 'Your full PDF report with all detailed recommendations is attached to this email.',
      filename: 'geo-report',
    },
    why: {
      extractibilite: "44.2% of AI citations come from the first 30% of a page's text (Growth Memo, 2026). The Princeton/KDD 2024 study demonstrates that adding statistics and citations to content increases AI visibility by 30-40%. Your introduction is your #1 asset.",
      verifiabilite: "AI favors factual, sourced content. Pages with hard data are cited 2.8x more often than pages without verifiable data. (AirOps, 2026)",
      autorite: "Domain authority is the #1 predictor of AI citations with a SHAP score of 0.63 (SE Ranking, 2025). Pages with identified authors and bios are significantly more cited by LLMs.",
      crawlabilite: "73% of websites are not crawlable by AI bots due to robots.txt, CDN or JavaScript issues (Otterly.AI, 2026). Unblocking AI crawlers is the #1 quick win — visible impact in 2-4 weeks.",
      'donnees structurees': "Pages with Schema FAQPage, Article and Organization are more easily parsed by AI. Structured content in chunks is cited 3-5x more often than raw content. (Otterly.AI, 2026)",
      neutralite: "AI deprioritizes overtly promotional content. The Princeton study shows that 'Fluency Optimization' improves AI visibility, but the tone must remain factual and informative to get cited.",
      presence: "90% of AI citations come from earned and owned media, not paid placements (Edelman, 2026). Reddit is the #1 source for Perplexity (6.6% of citations) and #2 for ChatGPT.",
      fraicheur: "65% of AI bot visits target content published in the last 12 months (Seer Interactive, 2025). Content not updated for 6+ months gradually loses its AI citation-worthiness.",
    },
    cases: {
      extractibilite: "SEO Vendor applied extractability tactics (citable sections, direct-answer formatting) and generated 549 ChatGPT sessions in 7 months, compared to only 3 organic sessions. (SEO Vendor, 2026)",
      verifiabilite: "Ahrefs generates 12.1% of its signups via AI traffic (0.5% of total traffic) thanks to data-rich verifiable content. AI visitors view 50% more pages per session. (Ahrefs/Semrush, 2025)",
      autorite: "Brands in the top 25% of web mentions get 10x more AI visibility. The top 50 brands capture 28.9% of all mentions in AI Overviews. (Ahrefs, 2025)",
      crawlabilite: "Triangle IP created an llms.txt file guiding AI to its priority pages. Result: 5x more AI traffic and presence on ChatGPT, Gemini, Perplexity and Copilot. (Concurate/SE Ranking, 2025)",
      'donnees structurees': "A website increased its AI visibility by 340% in 6 months through content restructuring and schema implementation. AI traffic went from 127 to 2,340 monthly sessions. (Stackmatix, 2026)",
      neutralite: "The Princeton study shows that 'Fluency Optimization' (factual content rewriting) significantly improves visibility in AI responses. Educational content is systematically cited over promotional content.",
      presence: "Reddit is cited in 46.7% of Perplexity responses (among top 10 sources) and 1.8% of ChatGPT citations. An active Reddit presence is the most effective external presence lever. (Profound, 2025)",
      fraicheur: "79% of pages visited by AI bots were published in the last 2 years (Seer Interactive, 2025). Updating an article with 2026 data can triple its chances of being cited.",
    },
    guides: {
      extractibilite: "To improve your extractability, start by restructuring your homepage to directly answer your audience's main question in the first 2 sentences. Use bullet lists to enumerate your advantages, services or features — AI extracts lists 3x more easily than continuous text. Add descriptive H2/H3 subheadings containing your target keywords. Avoid vague introductions like 'Welcome to...' or 'Leader in...' — prefer a 'question-answer' format that AI can directly cite.",
      verifiabilite: "AI prioritizes sourced, verifiable content. For every data point on your site, add an external link to the original source (study, report, press article). Aim for 5-10 external links per main page to recognized sources in your industry. Add explicit dates to your content (datePublished, dateModified in JSON-LD). Pages with sourced citations are cited 2.8x more often by AI (AirOps, 2026).",
      autorite: "Strengthen your E-E-A-T by creating a detailed 'About' page with your team's qualifications, certifications, years of experience and publications. Add an Organization schema in JSON-LD. Create author pages for each contributor with bio, photo and LinkedIn links. Get mentions in press or authority sites in your industry.",
      crawlabilite: "Check your robots.txt file: GPTBot (OpenAI), ClaudeBot (Anthropic), PerplexityBot and Google-Extended bots must be allowed. Add an llms.txt file at your site root. Make sure your main content is not rendered via client-side JavaScript (CSR). Use Server-Side Rendering (SSR) or Static Site Generation (SSG). Ensure your sitemap.xml is up to date.",
      'donnees structurees': "Implement at minimum these JSON-LD schemas: Organization (name, logo, contact, social links), FAQPage (your FAQs), Article or BlogPosting (for each editorial content). For e-commerce, add Product with price, availability, aggregate reviews (AggregateRating). Validate with the Google Rich Results Test. Pages with structured Schema are cited 3-5x more often by AI (Otterly.AI, 2026).",
      neutralite: "AI deprioritizes overtly promotional content. Replace superlatives ('the best', '#1', 'leader') with factual data ('used by 5,000 companies', '98% customer satisfaction'). Add a 'Limitations' section or 'Who this is NOT for'. Compare your offering honestly with alternatives. The Princeton/KDD 2024 study shows factual rewriting improves AI visibility by 30-40%.",
      presence: "90% of AI citations come from earned and owned media (Edelman, 2026). Create an active Reddit profile — it's the #1 source for Perplexity. Participate in your industry's discussions with expertise. Get mentions in press articles, podcasts, interviews. Publish original studies or proprietary data that other sites will want to cite.",
      fraicheur: "AI bots favor recent content: 65% of visits target content published in the last 12 months (Seer Interactive, 2025). Add datePublished and dateModified in schema.org. Update your existing articles with current-year data. Display the last update date visibly. Publish regularly (2-4 pieces/month).",
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function grade(score, t) {
  if (score >= 70) return { label: t.grade.good,    color: '#10A37F', bg: 'rgba(16,163,127,0.12)',  border: 'rgba(16,163,127,0.3)'  };
  if (score >= 45) return { label: t.grade.average,  color: '#C9861A', bg: 'rgba(201,134,26,0.12)',  border: 'rgba(201,134,26,0.3)'  };
  return              { label: t.grade.poor, color: '#D97757', bg: 'rgba(217,119,87,0.12)',  border: 'rgba(217,119,87,0.3)'  };
}

function criterionGrade(score, max, t) {
  const pct = score / max;
  if (pct >= 0.75) return { label: t.criterionGrade.good,       color: '#10A37F', bg: 'rgba(16,163,127,0.10)' };
  if (pct >= 0.45) return { label: t.criterionGrade.important, color: '#C9861A', bg: 'rgba(201,134,26,0.10)' };
  return              { label: t.criterionGrade.critical,  color: '#D97757', bg: 'rgba(217,119,87,0.10)' };
}

function criterionGroup(name, t) {
  if (/extractibilit|donn.*structur|crawlabilit/i.test(name)) return t.criterionGroup.readability;
  if (/v.*rifiabilit|autorit|neutralit/i.test(name))          return t.criterionGroup.credibility;
  if (/pr.*sence|fra.*cheur/i.test(name))                     return t.criterionGroup.freshness;
  return t.criterionGroup.other;
}

function matchRecos(recs, criterionName) {
  if (!recs?.length) return [];
  const name = criterionName.toLowerCase();
  const primary = recs.filter(r => r.criterion && name.includes(r.criterion.toLowerCase()));
  if (primary.length) return primary;
  return recs.filter(r => r.criterion && r.criterion.toLowerCase().split(/[\s&]/)[0].trim().length > 3 &&
                          name.includes(r.criterion.toLowerCase().split(/[\s&]/)[0].trim()));
}

function projectedScore(currentScore, criteria) {
  let gain = 0;
  criteria.forEach(c => {
    if (c.score / c.max < 0.75) gain += Math.round(c.max * 0.8 - c.score);
  });
  return Math.min(100, currentScore + Math.round(gain * 0.7));
}

// ─── Evidence blocks ─────────────────────────────────────────────────────────

function evidenceBlock(criterionName, evidence, t) {
  if (!evidence) return '';
  const name = criterionName.toLowerCase();
  const blockStyle = 'background:#F7F5F2;border-left:3px solid #E5E2DC;padding:14px 18px;border-radius:0 6px 6px 0;margin:10px 0;';
  const labelStyle = 'font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;';
  const codeStyle  = 'background:#1A1916;color:#F7F5F2;border-radius:8px;padding:16px;font-family:monospace;font-size:11px;line-height:1.6;white-space:pre-wrap;word-break:break-all;margin:10px 0;';
  const valStyle   = 'font-family:monospace;font-size:12px;color:#1A1916;line-height:1.6;';

  if (/extractibilit/i.test(name)) {
    const introBlock = evidence.intro
      ? `<div style="${blockStyle}"><div style="${labelStyle}">${t.evidence.extractIntro}</div><div style="${valStyle}">${esc(evidence.intro)}</div></div>` : '';
    const headingsRows = (evidence.headings || []).slice(0, 20).map(h =>
      `<tr><td style="padding:5px 10px;font-family:monospace;font-size:10px;color:#D97757;text-transform:uppercase;white-space:nowrap;border-bottom:1px solid #F0EDE8;">${esc(h.level)}</td><td style="padding:5px 10px;font-family:system-ui;font-size:11px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${esc(h.text)}</td></tr>`
    ).join('');
    const headingsBlock = headingsRows
      ? `<div style="${labelStyle};margin-top:14px;">${t.evidence.headingsDetected}</div><table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:6px;overflow:hidden;"><thead><tr style="background:#F7F5F2;"><th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">${t.evidence.headingLevel}</th><th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">${t.evidence.headingText}</th></tr></thead><tbody>${headingsRows}</tbody></table>`
      : `<div style="${blockStyle}"><div style="${valStyle}">${t.evidence.noHeadings}</div></div>`;
    const wcBlock = evidence.wordCount != null
      ? `<div style="font-family:system-ui;font-size:12px;color:#8A8680;margin-top:10px;">${t.evidence.wordCount} <strong style="color:#1A1916;">${evidence.wordCount}</strong></div>` : '';
    return introBlock + headingsBlock + wcBlock;
  }

  if (/v.*rifiabilit/i.test(name)) {
    const extBlock = evidence.externalLinks != null
      ? `<div style="${blockStyle}"><div style="${labelStyle}">${t.evidence.extLinks}</div><div style="${valStyle}">${evidence.externalLinks} ${t.evidence.extLinksCount}</div></div>` : '';
    const datesEntries = Object.entries(evidence.dates || {}).map(([k, v]) =>
      `<div style="font-size:12px;margin-bottom:4px;font-family:system-ui;"><span style="color:#8A8680;">${esc(k)}:</span> <strong style="color:#1A1916;">${esc(v)}</strong></div>`
    ).join('');
    const datesBlock = `<div style="${blockStyle}"><div style="${labelStyle}">${t.evidence.datesDetected}</div>${datesEntries || `<div style="font-family:system-ui;font-size:12px;color:#D97757;">${t.evidence.noDate}</div>`}</div>`;
    return extBlock + datesBlock;
  }

  if (/autorit/i.test(name)) {
    const titleBlock = `<div style="${blockStyle}"><div style="${labelStyle}">${t.evidence.titleTag}</div><div style="${valStyle}">${esc(evidence.metaTitle) || `<span style="color:#D97757;">${t.evidence.notDefined}</span>`}</div></div>`;
    const descBlock  = `<div style="${blockStyle}"><div style="${labelStyle}">${t.evidence.metaDesc}</div><div style="${valStyle}">${esc(evidence.metaDescription) || `<span style="color:#D97757;">${t.evidence.notDefined}</span>`}</div></div>`;
    const socialRows = (evidence.socialLinks || []).map(l => `<div style="font-size:11px;font-family:monospace;color:#4285F4;margin-bottom:4px;word-break:break-all;">${esc(l)}</div>`).join('');
    const socialBlock = `<div style="${blockStyle}"><div style="${labelStyle}">${t.evidence.socialDetected}</div>${socialRows || `<div style="font-family:system-ui;font-size:12px;color:#D97757;">${t.evidence.noSocial}</div>`}</div>`;
    return titleBlock + descBlock + socialBlock;
  }

  if (/crawlabilit/i.test(name)) {
    const robotsContent = evidence.robotsTxt && evidence.robotsTxt !== 'Non accessible'
      ? `<div style="${codeStyle}">${esc(evidence.robotsTxt)}</div>`
      : `<div style="${blockStyle}"><div style="${valStyle}">${t.evidence.notAccessible}</div></div>`;
    const robotsBlock = `<div style="${labelStyle}">${t.evidence.robotsContent}</div>${robotsContent}`;
    const llmsColor = evidence.hasLlmsTxt ? '#10A37F' : '#D97757';
    const llmsBlock = `<div style="${blockStyle}"><div style="${labelStyle}">${t.evidence.llmsFile}</div><div style="font-family:system-ui;font-size:13px;font-weight:600;color:${llmsColor};">${evidence.hasLlmsTxt ? `✓ ${t.evidence.llmsPresent}` : `✗ ${t.evidence.llmsAbsent}`}</div></div>`;
    return robotsBlock + llmsBlock;
  }

  if (/donn.*structur/i.test(name)) {
    if (!evidence.schemas?.length) {
      return `<div style="${blockStyle}"><div style="${labelStyle}">${t.evidence.schemasDetected}</div><div style="font-family:system-ui;font-size:13px;font-weight:600;color:#D97757;">${t.evidence.noSchema}</div></div>`;
    }
    const schemaRows = evidence.schemas.map(s =>
      `<tr><td style="padding:8px 10px;font-family:monospace;font-size:11px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${esc(s.type)}</td><td style="padding:8px 10px;font-family:system-ui;font-size:11px;color:#8A8680;border-bottom:1px solid #F0EDE8;">${(s.properties || []).join(', ')}</td></tr>`
    ).join('');
    return `<div style="${labelStyle}">${t.evidence.schemasDetected}</div><table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:6px;overflow:hidden;"><thead><tr style="background:#F7F5F2;"><th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">${t.evidence.schemaType}</th><th style="padding:7px 10px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1px;font-weight:400;">${t.evidence.schemaProps}</th></tr></thead><tbody>${schemaRows}</tbody></table>`;
  }

  if (/pr.*sence/i.test(name)) {
    const socialRows = (evidence.socialLinks || []).map(l => `<div style="font-size:11px;font-family:monospace;color:#4285F4;margin-bottom:4px;word-break:break-all;">${esc(l)}</div>`).join('');
    return `<div style="${blockStyle}"><div style="${labelStyle}">${t.evidence.socialDetected}</div>${socialRows || `<div style="font-family:system-ui;font-size:12px;color:#D97757;">${t.evidence.noSocialDetected}</div>`}</div>`;
  }

  if (/fra.*cheur/i.test(name)) {
    const datesEntries = Object.entries(evidence.dates || {}).map(([k, v]) =>
      `<div style="font-size:12px;margin-bottom:4px;font-family:system-ui;"><span style="color:#8A8680;">${esc(k)}:</span> <strong style="color:#1A1916;">${esc(v)}</strong></div>`
    ).join('');
    return `<div style="${blockStyle}"><div style="${labelStyle}">${t.evidence.datesDetected}</div>${datesEntries || `<div style="font-family:system-ui;font-size:12px;color:#D97757;">${t.evidence.noDate}</div>`}</div>`;
  }

  return '';
}

// ─── Recommendation sections ─────────────────────────────────────────────────

function recoSections(reco, t) {
  if (!reco) {
    return `<div style="background:rgba(16,163,127,0.06);border:1px solid rgba(16,163,127,0.2);border-radius:8px;padding:16px 20px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;">✓</span>
      <span style="font-family:system-ui;font-size:13px;color:#10A37F;font-weight:500;">${t.wellOptimized}</span>
    </div>`;
  }

  // ── New format (v12) — "problem" + "solution" + "technicalImplementation" + badges
  if (reco.problem) {
    const impactColors = { high: { color: '#D97757', bg: 'rgba(217,119,87,0.10)' }, medium: { color: '#C9861A', bg: 'rgba(201,134,26,0.10)' }, low: { color: '#10A37F', bg: 'rgba(16,163,127,0.10)' } };
    const effortColors = { low: { color: '#10A37F', label: 'Faible' }, medium: { color: '#C9861A', label: 'Moyen' }, high: { color: '#D97757', label: 'Lourd' } };
    const ic = impactColors[reco.impact] || impactColors.medium;
    const ec = effortColors[reco.effort] || effortColors.medium;

    const badgeStyle = 'display:inline-block;padding:3px 10px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:0.5px;margin-right:6px;margin-bottom:4px;';

    const badges = `<div style="margin-bottom:14px;display:flex;flex-wrap:wrap;gap:4px;">
      <span style="${badgeStyle}background:${ic.bg};color:${ic.color};">Impact ${t.impact[reco.impact] || reco.impact}</span>
      <span style="${badgeStyle}background:${ec.color}18;color:${ec.color};">Effort ${ec.label}</span>
      ${reco.timeframe ? `<span style="${badgeStyle}background:#F7F5F2;color:#8A8680;border:1px solid #E5E2DC;">${esc(reco.timeframe)}</span>` : ''}
    </div>`;

    const problemBlock = reco.problem ? `<div style="margin-bottom:10px;">
      <div style="font-family:system-ui;font-size:11px;font-weight:700;color:#D97757;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">Le probl\u00e8me</div>
      <div style="font-family:system-ui;font-size:13px;color:#3A3835;line-height:1.5;">${esc(reco.problem)}</div>
    </div>` : '';

    const solutionBlock = reco.solution ? `<div style="margin-bottom:10px;">
      <div style="font-family:system-ui;font-size:11px;font-weight:700;color:#10A37F;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">La solution</div>
      <div style="font-family:system-ui;font-size:13px;color:#3A3835;line-height:1.5;">${esc(reco.solution)}</div>
    </div>` : '';

    const techBlock = reco.technicalImplementation ? (() => {
      const steps = Array.isArray(reco.technicalImplementation)
        ? reco.technicalImplementation
        : String(reco.technicalImplementation).split(/(?:,\s*)?(?=\d+\.\s)/).filter(Boolean);
      const listItems = steps.map(s => `<li style="margin-bottom:4px;padding-left:4px;">${esc(String(s).replace(/^\d+\.\s*/, ''))}</li>`).join('');
      return `<div class="tech-block" style="background:#F7F5F2;border-radius:8px;padding:12px 16px;margin-bottom:10px;">
        <div style="font-family:system-ui;font-size:11px;font-weight:700;color:#1A1916;margin-bottom:6px;">\u{1F6E0}\uFE0F Mise en \u0153uvre technique</div>
        <ol style="font-family:system-ui;font-size:13px;color:#3A3835;line-height:1.45;margin:0;padding-left:20px;">${listItems}</ol>
      </div>`;
    })() : '';

    const codeBlock = reco.codeExample ? `<div class="code-block" style="margin-bottom:10px;">
      <div style="font-family:system-ui;font-size:11px;font-weight:700;color:#1A1916;margin-bottom:5px;">&lt;/&gt; Exemple de code</div>
      <div style="background:#1A1916;color:#F7F5F2;border-radius:8px;padding:14px;font-family:monospace;font-size:10px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;max-width:100%;box-sizing:border-box;">${esc(reco.codeExample)}</div>
    </div>` : '';

    return badges + problemBlock + solutionBlock + techBlock + codeBlock;
  }

  // ── Legacy format (v11) — 7 sub-sections fallback
  const KEYS = {
    high:   ['diagnostic', 'whyCritical', 'whatToDo', 'howToDoIt', 'concreteExample', 'expectedImpact', 'expertTip'],
    medium: ['diagnostic', 'whyCritical', 'whatToDo', 'howToDoIt', 'expectedImpact'],
    low:    ['diagnostic', 'whatToDo', 'expectedImpact'],
  };

  return t.recoTitles
    .filter(s => (KEYS[reco.priority] || KEYS.medium).includes(s.key) && reco[s.key])
    .map(s => `<div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:8px;padding:13px 16px;margin-bottom:8px;">
      <div style="font-family:system-ui;font-size:11px;font-weight:600;color:#1A1916;margin-bottom:5px;">${s.icon} ${s.title}</div>
      <div style="font-family:system-ui;font-size:13px;color:#3A3835;line-height:1.65;">${esc(reco[s.key])}</div>
    </div>`)
    .join('');
}

// ─── Main HTML generator ─────────────────────────────────────────────────────

function generateReportHTML(data, locale = 'fr') {
  const t = S[locale] || S.fr;
  const { url, score, verdict, strengths = [], topPriority, criteria = [], recommendations = [], evidence, citationTest } = data;
  const g         = grade(score, t);
  const date      = new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const projected = projectedScore(score, criteria);
  const noEvidence = !evidence;

  const sortedRecos = [...recommendations].sort((a, b) => {
    const p = { high: 0, medium: 1, low: 2 };
    return (p[a.priority] ?? 1) - (p[b.priority] ?? 1);
  });

  function delayLabel(p) { return t.delay[p] || t.delay.medium; }
  function impactLabel(p) { return t.impact[p] || t.impact.medium; }
  function priorityLabel(p) { return t.priority[p] || t.priority.medium; }

  // P: forced page break for major sections. Padding is now handled by @page margins.
  const P  = 'page-break-before:always;background:#fff;box-sizing:border-box;';
  const LS = 'font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;';
  const sLabel = (txt, color = '#D97757') =>
    `<div style="font-family:monospace;font-size:10px;color:${color};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">${txt}</div>`;
  const H1 = (txt) =>
    `<h1 style="font-family:Georgia,serif;font-size:34px;color:#1A1916;letter-spacing:-1px;margin-bottom:28px;line-height:1.1;">${txt}</h1>`;

  function lookup(map, criterionName) {
    const n = stripAccents(criterionName).toLowerCase();
    for (const [k, v] of Object.entries(map)) { if (n.includes(k)) return v; }
    return '';
  }

  // ── PAGE 1 : COVER
  const coverVerdict = g.label === t.grade.good ? t.cover.verdictGood : g.label === t.grade.average ? t.cover.verdictAvg : t.cover.verdictPoor;
  const cover = `
  <div style="background:#1A1916;min-height:100vh;padding:72px 64px;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
    <div style="position:absolute;top:-100px;right:-100px;width:400px;height:400px;border-radius:50%;background:${g.color};opacity:0.05;pointer-events:none;"></div>
    <div style="position:absolute;bottom:-80px;left:-60px;width:280px;height:280px;border-radius:50%;background:${g.color};opacity:0.04;pointer-events:none;"></div>
    <div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;width:20px;height:20px;">
          <div style="background:#10A37F;border-radius:50%;"></div><div style="background:#D97757;border-radius:50%;"></div>
          <div style="background:#4285F4;border-radius:50%;"></div><div style="background:#1C7DC4;border-radius:50%;"></div>
        </div>
        <span style="font-family:Georgia,serif;font-size:22px;color:#F7F5F2;">Detekia</span>
      </div>
      <div style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.3);letter-spacing:3px;text-transform:uppercase;">${t.cover.title} · ${date}</div>
    </div>
    <div>
      <div style="font-family:Georgia,serif;font-size:136px;line-height:1;color:#F7F5F2;letter-spacing:-6px;margin-bottom:4px;">${score}</div>
      <div style="font-family:monospace;font-size:16px;color:rgba(247,245,242,0.22);margin-bottom:24px;">/100</div>
      <div style="display:inline-block;background:${g.bg};border:1px solid ${g.border};padding:6px 18px;border-radius:24px;margin-bottom:18px;">
        <span style="font-family:monospace;font-size:11px;letter-spacing:2px;color:${g.color};text-transform:uppercase;">${g.label}</span>
      </div>
      <div style="font-family:Georgia,serif;font-size:34px;color:#F7F5F2;line-height:1.2;max-width:620px;margin-bottom:18px;">${coverVerdict}</div>
      <div style="font-family:monospace;font-size:13px;color:#D97757;">${esc(url)}</div>
    </div>
    <div style="border-top:1px solid rgba(247,245,242,0.08);padding-top:22px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;">
      <div style="font-family:system-ui;font-size:12px;color:rgba(247,245,242,0.28);">${t.cover.confidential}</div>
      <div style="font-family:system-ui;font-size:11px;color:rgba(247,245,242,0.2);">Beeleven SASU · hello@detekia.fr · detekia.fr</div>
    </div>
  </div>`;

  // ── PAGE 2 : EXECUTIVE SUMMARY
  const criteriaTableRows = criteria.map(c => {
    const pct = Math.round((c.score / c.max) * 100);
    const cg  = criterionGrade(c.score, c.max, t);
    return `<tr>
      <td style="padding:6px 10px;font-family:system-ui;font-size:11px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${esc(translateCriterionName(c.name, locale))}</td>
      <td style="padding:6px 10px;text-align:center;border-bottom:1px solid #F0EDE8;"><span style="font-family:monospace;font-size:11px;font-weight:600;color:${cg.color};">${c.score}/${c.max}</span></td>
      <td style="padding:6px 10px;border-bottom:1px solid #F0EDE8;width:100px;"><div style="height:5px;background:#E5E2DC;border-radius:3px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${cg.color};border-radius:3px;"></div></div></td>
      <td style="padding:6px 10px;border-bottom:1px solid #F0EDE8;"><span style="display:inline-block;padding:2px 8px;border-radius:10px;font-family:monospace;font-size:8px;letter-spacing:1px;background:${cg.bg};color:${cg.color};">${cg.label}</span></td>
    </tr>`;
  }).join('');

  const top3HTML = sortedRecos.slice(0, 3).map((r, i) => {
    const rc = r.priority === 'high' ? { color: '#D97757', bg: 'rgba(217,119,87,0.07)' } : r.priority === 'medium' ? { color: '#C9861A', bg: 'rgba(201,134,26,0.07)' } : { color: '#10A37F', bg: 'rgba(16,163,127,0.07)' };
    return `<div class="top3-reco-card" style="display:flex;gap:16px;align-items:flex-start;padding:14px 16px;background:${rc.bg};border-radius:8px;margin-bottom:8px;">
      <div style="font-family:Georgia,serif;font-size:22px;color:${rc.color};line-height:1;flex-shrink:0;min-width:24px;">${i + 1}</div>
      <div style="flex:1;"><div style="font-family:system-ui;font-size:12px;font-weight:600;color:#1A1916;margin-bottom:3px;">${esc(r.title || translateCriterionName(r.criterion || '', locale))}</div><div style="font-family:system-ui;font-size:11px;color:#8A8680;line-height:1.5;">${esc(r.whatToDo || r.diagnostic || '')}</div></div>
      <div style="font-family:monospace;font-size:9px;color:${rc.color};background:${rc.bg};padding:3px 9px;border-radius:12px;white-space:nowrap;flex-shrink:0;border:1px solid ${rc.color}33;">${impactLabel(r.priority)}</div>
    </div>`;
  }).join('');

  const strengthsHTML = (strengths || []).map(s =>
    `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;"><span style="color:#10A37F;font-size:14px;flex-shrink:0;margin-top:1px;">✓</span><span style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.5;">${esc(s)}</span></div>`
  ).join('') || `<div style="font-family:system-ui;font-size:13px;color:#8A8680;">—</div>`;

  const execSummary = `
  <div style="${P}">
    ${sLabel(t.synthesis.label)}
    ${H1(t.synthesis.h1)}
    <div style="background:#1A1916;border-radius:10px;padding:18px 24px;margin-bottom:18px;display:flex;align-items:center;gap:20px;">
      <div style="flex-shrink:0;"><div style="font-family:Georgia,serif;font-size:44px;color:#F7F5F2;line-height:1;letter-spacing:-2px;">${score}</div><div style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.28);">/100</div></div>
      <div style="width:1px;height:48px;background:rgba(247,245,242,0.1);flex-shrink:0;"></div>
      <div><div style="font-family:system-ui;font-size:12px;color:rgba(247,245,242,0.65);line-height:1.45;max-width:460px;">${esc(verdict)}</div></div>
    </div>
    <h2 style="font-family:Georgia,serif;font-size:16px;color:#1A1916;margin-bottom:8px;">${t.synthesis.criteriaH2}</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:8px;overflow:hidden;margin-bottom:16px;">
      <thead><tr style="background:#F7F5F2;">
        <th style="padding:6px 10px;text-align:left;font-family:monospace;font-size:8px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">${t.synthesis.colCriterion}</th>
        <th style="padding:6px 10px;text-align:center;font-family:monospace;font-size:8px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">${t.synthesis.colScore}</th>
        <th style="padding:6px 10px;font-family:monospace;font-size:8px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;width:100px;">${t.synthesis.colProgress}</th>
        <th style="padding:6px 10px;font-family:monospace;font-size:8px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">${t.synthesis.colStatus}</th>
      </tr></thead>
      <tbody>${criteriaTableRows}</tbody>
    </table>
    <h2 style="font-family:Georgia,serif;font-size:16px;color:#1A1916;margin-bottom:8px;">${t.synthesis.top3H2}</h2>
    ${top3HTML}
    <h2 style="font-family:Georgia,serif;font-size:16px;color:#1A1916;margin-top:14px;margin-bottom:8px;">${t.synthesis.strengthsH2}</h2>
    <div class="strengths-block" style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:8px;padding:14px 18px;">${strengthsHTML}</div>
    ${noEvidence ? `<div style="background:#FFF8ED;border:1px solid rgba(201,134,26,0.25);border-radius:8px;padding:10px 14px;margin-top:12px;font-family:system-ui;font-size:11px;color:#C9861A;line-height:1.4;">${t.synthesis.noEvidence}</div>` : ''}
  </div>`;

  // ── PAGE 3 : CONTEXT
  const contextCards = t.context.cards.map((card, i) => {
    const valueColor = i === 2 ? '#10A37F' : i === 4 ? '#C9861A' : i === 5 ? '#10A37F' : '#D97757';
    return `<div class="context-card" style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;">
      <div style="${LS}">${card.label}</div>
      <div style="font-family:Georgia,serif;font-size:28px;color:${valueColor};line-height:1;margin-bottom:6px;">${card.value}</div>
      <p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.6;">${card.text} <span style="color:#B0ABA5;">(${card.source})</span></p>
    </div>`;
  }).join('');

  const context = `
  <div style="${P}">
    ${sLabel(t.context.label)}
    ${H1(t.context.h1)}
    <p style="font-family:system-ui;font-size:13px;color:#8A8680;line-height:1.5;margin-bottom:28px;">${t.context.intro}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:28px;">${contextCards}</div>
    <div style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:10px;padding:18px 20px;margin-bottom:20px;">
      <p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.5;"><strong>${t.context.crossPlatform.split('.')[0]}.</strong>${t.context.crossPlatform.substring(t.context.crossPlatform.indexOf('.') + 1)} <span style="color:#8A8680;">(Profound, 2025)</span></p>
    </div>
    <div style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:20px 24px;">
      <div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">${t.context.academicLabel}</div>
      <p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.5;">${t.context.academicText}</p>
    </div>
  </div>`;

  // ── PAGE 4 : CITATION TEST
  const citationTestPage = (() => {
    if (!citationTest || !Array.isArray(citationTest.tests) || !citationTest.tests.length) return '';
    const ct = citationTest;
    const citedCount = ct.summary?.cited_count ?? ct.tests.filter(tt => tt.cited).length;
    const totalTests = ct.summary?.total_tests ?? ct.tests.length;
    const bc = citedCount >= 3 ? { color: '#10A37F', bg: 'rgba(16,163,127,0.12)', border: 'rgba(16,163,127,0.3)' }
             : citedCount >= 1 ? { color: '#C9861A', bg: 'rgba(201,134,26,0.12)', border: 'rgba(201,134,26,0.3)' }
             : { color: '#D97757', bg: 'rgba(217,119,87,0.12)', border: 'rgba(217,119,87,0.3)' };
    const diffColorMap = { 'generique': '#D97757', 'niche': '#C9861A', 'longue_traine': '#10A37F', 'generic': '#D97757', 'long_tail': '#10A37F' };
    const cards = ct.tests.map(tt => {
      const dc = diffColorMap[tt.difficulty] || '#8A8680';
      const dcBg = dc + '1A';
      const citedColor = tt.cited ? '#10A37F' : '#D97757';
      const citedBg = tt.cited ? 'rgba(16,163,127,0.10)' : 'rgba(217,119,87,0.10)';
      const diffLabel = (tt.difficulty || '').toUpperCase().replace(/_/g, ' ');
      const competitorsLine = !tt.cited && tt.competitors_cited?.length
        ? `<div style="font-family:system-ui;font-size:11px;color:#8A8680;margin-bottom:4px;">${t.citationTest.competitorsLabel} <strong style="color:#1A1916;">${tt.competitors_cited.map(esc).join(', ')}</strong></div>` : '';
      const excerptBlock = tt.ai_response_excerpt
        ? `<div style="background:#F7F5F2;border-left:3px solid #E5E2DC;padding:8px 12px;font-family:monospace;font-size:11px;color:#8A8680;line-height:1.5;margin-top:8px;">${esc(tt.ai_response_excerpt)}</div>` : '';
      return `<div class="citation-test-card" style="background:#FAFAF9;border:1px solid #E5E2DC;border-radius:8px;padding:16px;margin-bottom:12px;">
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
          <div style="flex:1;min-width:200px;font-family:system-ui;font-size:13px;font-weight:600;color:#1A1916;line-height:1.4;">${esc(tt.query)}</div>
          <span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;background:${dcBg};color:${dc};white-space:nowrap;">${diffLabel}</span>
          <span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;background:${citedBg};color:${citedColor};white-space:nowrap;">${tt.cited ? `✓ ${t.citationTest.cited}` : `✗ ${t.citationTest.notCited}`}</span>
        </div>
        ${competitorsLine}
        <div style="font-family:system-ui;font-size:11px;color:#8A8680;margin-bottom:4px;">${t.citationTest.difficultyLabel} <strong style="color:#1A1916;">${esc(tt.difficulty_to_rank || '')}</strong></div>
        <div style="font-family:system-ui;font-size:11px;color:#1A1916;margin-bottom:4px;line-height:1.5;"><em>${t.citationTest.recoLabel}</em> ${esc(tt.recommendation || '')}</div>
        ${excerptBlock}
      </div>`;
    }).join('');
    const summaryBlock = ct.summary
      ? `<div style="font-family:system-ui;font-size:13px;color:#1A1916;margin-top:12px;line-height:1.55;">
          <span style="color:#8A8680;">${t.citationTest.bestOpp}</span> ${esc(ct.summary.best_opportunity || '—')}<br>
          <span style="color:#8A8680;">${t.citationTest.mainBlocker}</span> ${esc(ct.summary.main_blocker || '—')}
        </div>` : '';
    return `
    <div style="${P}">
      ${sLabel(t.citationTest.label)}
      <h1 style="font-family:Georgia,serif;font-size:34px;color:#1A1916;letter-spacing:-1px;margin-bottom:8px;line-height:1.1;">${t.citationTest.h1}</h1>
      <p style="font-family:system-ui;font-size:13px;color:#8A8680;margin-bottom:28px;line-height:1.6;">${t.citationTest.intro}</p>
      <div style="display:inline-flex;align-items:center;gap:16px;background:${bc.bg};border:1px solid ${bc.border};border-radius:12px;padding:18px 28px;margin-bottom:4px;">
        <div style="font-family:Georgia,serif;font-size:44px;color:${bc.color};line-height:1;letter-spacing:-2px;">${citedCount}/${totalTests}</div>
        <div style="font-family:system-ui;font-size:13px;color:${bc.color};font-weight:600;line-height:1.4;white-space:pre-line;">${t.citationTest.queriesCite}</div>
      </div>
      ${summaryBlock}
      <div style="margin-top:28px;">${cards}</div>
      <div style="margin-top:24px;background:#F7F5F2;border-radius:8px;padding:16px 20px;">
        <p style="font-family:system-ui;font-size:11px;color:#8A8680;line-height:1.65;">${t.citationTest.disclaimer}</p>
      </div>
    </div>`;
  })();

  // ── Compute 3 weakest criteria (for "Cas réel documenté" display)
  const criteriaSorted = [...criteria].map(c => ({ name: c.name, pct: c.max > 0 ? c.score / c.max : 1 })).sort((a, b) => a.pct - b.pct);
  const weakest3Names = new Set(criteriaSorted.slice(0, 3).map(c => c.name));

  // ── PAGES 5-12 : CRITERIA
  const criteriaPages = criteria.map((c, idx) => {
   try {
    const cg    = criterionGrade(c.score, c.max, t);
    const group = criterionGroup(c.name, t);
    const pct   = Math.round((c.score / c.max) * 100);
    const recos = matchRecos(recommendations, c.name);
    const ev    = evidenceBlock(c.name, evidence, t);
    const why   = lookup(t.why, c.name) || '';
    const study = lookup(t.cases, c.name) || '';
    const guide = lookup(t.guides, c.name) || '';

    const evidenceSection = evidence
      ? (ev ? `<div class="evidence-block" style="margin-top:16px;">${ev}</div>` : '')
      : `<div style="background:#FFF8ED;border:1px solid rgba(201,134,26,0.2);border-radius:8px;padding:12px 16px;margin-top:12px;font-family:system-ui;font-size:12px;color:#C9861A;">${t.criteriaPage.relaunch}</div>`;

    const recosHTML = recos.length > 0
      ? recos.map((reco, ri) => {
          const rc = reco.priority === 'high' ? { color: '#D97757', bg: 'rgba(217,119,87,0.08)' } : reco.priority === 'medium' ? { color: '#C9861A', bg: 'rgba(201,134,26,0.08)' } : { color: '#10A37F', bg: 'rgba(16,163,127,0.08)' };
          const header = recos.length > 1
            ? `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;${ri > 0 ? 'margin-top:20px;' : ''}">
                 <span style="font-family:monospace;font-size:9px;letter-spacing:1.5px;color:${rc.color};text-transform:uppercase;">${t.criteriaPage.recommendation} ${ri + 1} / ${recos.length}</span>
                 <span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;background:${rc.bg};color:${rc.color};">${priorityLabel(reco.priority)}</span>
               </div>`
            : `<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
                 <span style="display:inline-block;padding:4px 12px;border-radius:20px;font-family:monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;background:${cg.bg};color:${cg.color};">${cg.label}</span>
               </div>`;
          // Criterion context label (visible on continuation pages)
          const contextLabel = `<div style="font-family:monospace;font-size:8px;color:#D5D2CE;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">${esc(group)} · ${esc(translateCriterionName(c.name, locale))}</div>`;
          return `<div class="reco-block">${ri > 0 ? contextLabel : ''}${header}${reco.title ? `<div style="font-family:Georgia,serif;font-size:16px;color:${rc.color};margin-bottom:12px;font-weight:bold;">${esc(reco.title)}</div>` : ''}${recoSections(reco, t)}</div>`;
        }).join('<div style="height:1px;background:#E5E2DC;margin:16px 0;"></div>')
      : recoSections(null, t);

    return `
    <div style="${P}">
      <div style="margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;">${esc(group)}</span>
          <span style="font-family:monospace;font-size:9px;color:#D5D2CE;">·</span>
          <span style="font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;">${t.criteriaPage.criterionOf} ${idx + 1} ${t.criteriaPage.of} 8</span>
        </div>
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:10px;gap:16px;">
          <h1 style="font-family:Georgia,serif;font-size:26px;color:#1A1916;letter-spacing:-0.5px;line-height:1.2;">${esc(translateCriterionName(c.name, locale))}</h1>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-family:Georgia,serif;font-size:38px;color:${cg.color};line-height:1;letter-spacing:-1px;">${c.score}<span style="font-size:16px;color:#C0BBB5;font-weight:400;">/${c.max}</span></div>
            <div style="font-family:monospace;font-size:9px;color:#B0ABA5;">${pct}%</div>
          </div>
        </div>
        <div style="height:8px;background:#E5E2DC;border-radius:4px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${cg.color};border-radius:4px;"></div></div>
      </div>
      <div style="margin-bottom:24px;">
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">${t.criteriaPage.found}</div>
        <div style="background:#F7F5F2;border-left:3px solid ${cg.color};padding:14px 18px;border-radius:0 6px 6px 0;font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.65;">${esc(c.detail)}</div>
        ${evidenceSection}
      </div>
      ${why ? `<div style="margin-bottom:24px;"><div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">${t.criteriaPage.whyImportant}</div><p style="font-family:system-ui;font-size:13px;color:#1A1916;line-height:1.5;">${esc(why)}</p></div>` : ''}
      <div style="margin-bottom:24px;">
        <div style="font-family:monospace;font-size:9px;color:#D97757;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">${recos.length > 1 ? t.criteriaPage.recommendations : t.criteriaPage.recommendation}</div>
        ${recosHTML}
      </div>
      ${study && weakest3Names.has(c.name) ? `<div class="case-study-block" style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:10px;padding:18px 22px;"><div style="font-family:monospace;font-size:9px;color:#10A37F;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">${t.criteriaPage.realCase}</div><p style="font-family:system-ui;font-size:12px;color:#1A1916;line-height:1.5;">${esc(study)}</p></div>` : ''}
    </div>`;
   } catch (err) {
    console.error(`[generate-pdf] Error rendering criterion ${idx} (${c?.name}):`, err.message);
    return `<div style="${P}"><p style="color:#D97757;font-family:system-ui;">Error rendering criterion: ${esc(c?.name || 'unknown')}</p></div>`;
   }
  }).join('');

  // ── PAGE 13 : ACTION PLAN
  const beelevenUrl = locale === 'en' ? 'https://detekia.fr/en/contact' : 'https://detekia.fr/contact';
  const actionRows = sortedRecos.map((r, i) => {
    const rc = r.priority === 'high' ? { color: '#D97757', bg: 'rgba(217,119,87,0.08)' } : r.priority === 'medium' ? { color: '#C9861A', bg: 'rgba(201,134,26,0.08)' } : { color: '#10A37F', bg: 'rgba(16,163,127,0.08)' };
    return `<tr>
      <td style="padding:9px 12px;font-family:monospace;font-size:11px;color:#B0ABA5;border-bottom:1px solid #F0EDE8;white-space:nowrap;">${i + 1}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #F0EDE8;white-space:nowrap;"><span style="display:inline-block;padding:2px 9px;border-radius:10px;font-family:monospace;font-size:9px;letter-spacing:1px;background:${rc.bg};color:${rc.color};">${priorityLabel(r.priority)}</span></td>
      <td style="padding:9px 12px;border-bottom:1px solid #F0EDE8;"><div style="font-family:system-ui;font-size:12px;font-weight:600;color:#1A1916;margin-bottom:2px;">${esc(r.title || '')}</div><div style="font-family:system-ui;font-size:11px;color:#8A8680;">${esc(r.whatToDo || r.solution || '').slice(0, 100)}</div></td>
      <td style="padding:9px 12px;font-family:system-ui;font-size:11px;color:#8A8680;border-bottom:1px solid #F0EDE8;">${esc(translateCriterionName(r.criterion || '', locale))}</td>
      <td style="padding:9px 12px;font-family:system-ui;font-size:11px;color:${rc.color};font-weight:600;border-bottom:1px solid #F0EDE8;white-space:nowrap;">${impactLabel(r.impact || r.priority)}</td>
      <td style="padding:9px 12px;font-family:monospace;font-size:11px;color:#8A8680;border-bottom:1px solid #F0EDE8;white-space:nowrap;">${r.timeframe || delayLabel(r.priority)}</td>
    </tr>`;
  }).join('');

  const actionPlan = `
  <div style="${P}">
    ${sLabel(t.actionPlan.label)}
    ${H1(t.actionPlan.h1)}
    <p style="font-family:system-ui;font-size:13px;color:#8A8680;margin-bottom:36px;line-height:1.6;">${recommendations.length} ${t.actionPlan.intro}</p>
    <table class="action-plan-table" style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:10px;overflow:hidden;margin-bottom:44px;">
      <thead><tr style="background:#F7F5F2;">
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">${t.actionPlan.colHash}</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">${t.actionPlan.colPriority}</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">${t.actionPlan.colAction}</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">${t.actionPlan.colCriterion}</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">${t.actionPlan.colImpact}</th>
        <th style="padding:9px 12px;text-align:left;font-family:monospace;font-size:9px;color:#8A8680;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">${t.actionPlan.colDelay}</th>
      </tr></thead>
      <tbody>${actionRows}</tbody>
    </table>
    <div class="score-projection-card" style="background:#1A1916;border-radius:14px;padding:24px 32px;display:flex;align-items:center;gap:28px;margin-bottom:16px;">
      <div style="text-align:center;flex-shrink:0;"><div style="font-family:monospace;font-size:9px;color:rgba(247,245,242,0.35);letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">${t.actionPlan.currentScore}</div><div style="font-family:Georgia,serif;font-size:44px;color:#F7F5F2;line-height:1;letter-spacing:-2px;">${score}</div><div style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.25);">/100</div></div>
      <div style="font-family:Georgia,serif;font-size:24px;color:rgba(247,245,242,0.18);flex-shrink:0;">&rarr;</div>
      <div style="text-align:center;flex-shrink:0;"><div style="font-family:monospace;font-size:9px;color:rgba(247,245,242,0.35);letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">${t.actionPlan.projectedScore}</div><div style="font-family:Georgia,serif;font-size:44px;color:#10A37F;line-height:1;letter-spacing:-2px;">${projected}</div><div style="font-family:monospace;font-size:10px;color:rgba(247,245,242,0.25);">/100</div></div>
      <div style="flex:1;padding-left:24px;border-left:1px solid rgba(247,245,242,0.1);"><div style="font-family:system-ui;font-size:12px;color:rgba(247,245,242,0.55);line-height:1.45;">${t.actionPlan.projectionText} <strong style="color:#F7F5F2;">${score}/100</strong> ${t.actionPlan.projectionTo} <strong style="color:#10A37F;">${projected}/100</strong>.</div></div>
    </div>
    <div style="font-family:system-ui;font-size:10px;color:#B0ABA5;line-height:1.5;font-style:italic;margin-bottom:24px;">Cette projection est indicative. Elle suppose une implementation propre des recommandations et ne prend pas en compte l'evolution rapide des moteurs IA.</div>
    <div style="background:#F7F5F2;border:1px solid #E5E2DC;border-radius:12px;padding:22px 28px;text-align:center;">
      <div style="font-family:Georgia,serif;font-size:16px;color:#1A1916;margin-bottom:6px;letter-spacing:-0.3px;">${t.beeleven.h1}</div>
      <p style="font-family:system-ui;font-size:12px;color:#8A8680;line-height:1.45;max-width:420px;margin:0 auto 12px;">${t.beeleven.text}</p>
      <a href="${beelevenUrl}" style="display:inline-block;background:#D97757;color:#fff;padding:10px 24px;border-radius:9px;font-family:system-ui;font-size:13px;font-weight:700;text-decoration:none;">${t.beeleven.cta}</a>
      <div style="font-family:monospace;font-size:9px;color:#B0ABA5;margin-top:8px;">beeleven.fr &middot; hello@detekia.fr</div>
    </div>
  </div>`;

  // ── PAGE 14 (or 15) : METHODOLOGY
  const methodoRows = t.methodology.criteria.map(c => `
    <tr>
      <td style="padding:5px 8px;font-family:system-ui;font-size:10px;color:#1A1916;border-bottom:1px solid #F0EDE8;">${c.name}</td>
      <td style="padding:5px 8px;text-align:center;font-family:monospace;font-size:10px;font-weight:600;color:#D97757;border-bottom:1px solid #F0EDE8;white-space:nowrap;">${c.weight}</td>
      <td style="padding:5px 8px;font-family:system-ui;font-size:9px;color:#8A8680;border-bottom:1px solid #F0EDE8;line-height:1.35;">${c.measured}</td>
    </tr>`).join('');

  const methodology = `
  <div style="${P}">
    ${sLabel(t.methodology.label)}
    <h1 style="font-family:Georgia,serif;font-size:28px;color:#1A1916;letter-spacing:-1px;margin-bottom:14px;line-height:1.1;">${t.methodology.h1}</h1>
    <div style="background:rgba(217,119,87,0.06);border-left:3px solid #D97757;border-radius:0 6px 6px 0;padding:10px 14px;margin-bottom:14px;">
      <p style="font-family:system-ui;font-size:10px;color:#3A3835;line-height:1.35;">${t.methodology.limitsWarning}</p>
    </div>
    <div style="background:#F7F5F2;border-radius:8px;padding:12px 16px;margin-bottom:14px;">
      <p style="font-family:system-ui;font-size:11px;color:#1A1916;line-height:1.4;margin-bottom:6px;">${t.methodology.howItWorks1}</p>
      <p style="font-family:system-ui;font-size:11px;color:#1A1916;line-height:1.4;margin-bottom:6px;">${t.methodology.howItWorks2}</p>
      <p style="font-family:system-ui;font-size:11px;color:#1A1916;line-height:1.4;">${t.methodology.howItWorks3}</p>
    </div>
    <h2 style="font-family:Georgia,serif;font-size:15px;color:#1A1916;margin-bottom:8px;">${t.methodology.criteriaH2}</h2>
    <table class="methodology-table" style="width:100%;border-collapse:collapse;border:1px solid #E5E2DC;border-radius:8px;overflow:hidden;margin-bottom:14px;">
      <thead><tr style="background:#F7F5F2;">
        <th style="padding:5px 8px;text-align:left;font-family:monospace;font-size:8px;color:#8A8680;letter-spacing:1px;text-transform:uppercase;font-weight:400;">${t.methodology.colCriterion}</th>
        <th style="padding:5px 8px;text-align:center;font-family:monospace;font-size:8px;color:#8A8680;letter-spacing:1px;text-transform:uppercase;font-weight:400;">${t.methodology.colWeight}</th>
        <th style="padding:5px 8px;text-align:left;font-family:monospace;font-size:8px;color:#8A8680;letter-spacing:1px;text-transform:uppercase;font-weight:400;">${t.methodology.colMeasured}</th>
      </tr></thead>
      <tbody>${methodoRows}</tbody>
    </table>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
      <div style="background:#E8F7F3;border:1px solid rgba(16,163,127,0.2);border-radius:8px;padding:12px 14px;">
        <div style="font-family:monospace;font-size:8px;color:#10A37F;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">${t.methodology.academicLabel}</div>
        <p style="font-family:system-ui;font-size:10px;color:#1A1916;line-height:1.4;">${t.methodology.academicText}</p>
      </div>
      <div style="background:#FBF0EB;border:1px solid rgba(217,119,87,0.2);border-radius:8px;padding:12px 14px;">
        <div style="font-family:monospace;font-size:8px;color:#D97757;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">${t.methodology.limitsLabel}</div>
        <p style="font-family:system-ui;font-size:10px;color:#1A1916;line-height:1.4;">${t.methodology.limitsText}</p>
      </div>
    </div>
    <div style="background:#F7F5F2;border-radius:8px;padding:10px 14px;margin-bottom:14px;">
      <div style="font-family:monospace;font-size:8px;color:#8A8680;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">${t.methodology.scopeLabel}</div>
      <p style="font-family:system-ui;font-size:10px;color:#8A8680;line-height:1.4;">${t.methodology.scopeText} (<strong style="color:#1A1916;">${esc(url)}</strong>)</p>
    </div>
    <div style="border-top:1px solid #E5E2DC;padding-top:10px;display:flex;justify-content:space-between;align-items:center;">
      <div style="font-family:Georgia,serif;font-size:13px;color:#1A1916;">Detekia</div>
      <div style="font-family:monospace;font-size:9px;color:#B0ABA5;">${t.methodology.generatedOn} ${date} · detekia.fr</div>
    </div>
  </div>`;

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8">
<title>${locale === 'en' ? 'GEO Report' : 'Rapport GEO'} — ${esc(url)}</title>
<style>
  /* ── 1. PAGE MARGINS — consistent on every page ──────────────── */
  @page { size: A4; margin: 20mm 15mm 25mm 15mm; }
  @page :first { margin: 0; } /* Cover page: full bleed */

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* ── 2. BLOCK INTEGRITY — never cut these blocks ─────────────── */
  .reco-block,
  .citation-test-card,
  .score-projection-card,
  .beeleven-cta-block,
  .strengths-block,
  .top3-reco-card,
  .context-card,
  .methodology-table,
  .evidence-block,
  .case-study-block,
  .tech-block,
  .code-block {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Headings: never orphaned at bottom of page */
  h1, h2, h3 { break-after: avoid; page-break-after: avoid; }

  /* Paragraphs: at least 3 lines on each side of a break */
  p { orphans: 3; widows: 3; }

  /* Table rows: never split */
  tr { break-inside: avoid; page-break-inside: avoid; }
</style>
</head>
<body>
${cover}
${execSummary}
${context}
${citationTestPage}
${criteriaPages}
${actionPlan}
${methodology}
</body>
</html>`;
}

module.exports = { generateReportHTML, S, esc, grade, criterionGrade, criterionGroup, matchRecos, evidenceBlock, recoSections, projectedScore, stripAccents, translateCriterionName, CRITERIA_NAMES };
