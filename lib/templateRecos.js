/**
 * Template-based recommendations — deterministic, 0 API cost.
 * Generates recommendations based on criterion scores without any LLM call.
 */

const RECO_TEMPLATES = {
  'Citabilite & reponse directe': {
    max: 25,
    critical: {
      title: 'Structurer votre contenu pour les réponses IA',
      diagnostic: 'Votre page manque de capsules de réponse directe — ces blocs de 15 à 70 mots après un titre H2/H3 que les IA extraient pour répondre aux questions.',
      action: 'Ajoutez un paragraphe de réponse directe (2-3 phrases) immédiatement après chaque sous-titre. Commencez par le fait principal, pas par une introduction.',
      impact: 'Les pages avec des réponses directes bien structurées sont citées 2 à 3 fois plus souvent par ChatGPT.',
    },
    improvement: {
      title: 'Renforcer la citabilité de vos contenus',
      diagnostic: 'Votre contenu a une structure correcte mais pourrait être plus facilement extractible par les IA.',
      action: 'Vérifiez que chaque section commence par la conclusion (front-loading), et ajoutez des listes à puces pour les points clés.',
      impact: 'Le front-loading augmente la probabilité de citation IA de 30 à 40%.',
    },
  },
  'Verifiabilite & preuves': {
    max: 20,
    critical: {
      title: 'Ajouter des preuves vérifiables',
      diagnostic: 'Votre page contient peu de données chiffrées, de sources ou de preuves concrètes. Les IA privilégient les contenus qu\'elles peuvent vérifier.',
      action: 'Ajoutez au moins 3 données chiffrées avec leurs sources, des dates précises et des liens vers des études ou rapports externes.',
      impact: 'Les pages avec des données chiffrées sont citées 2,8 fois plus par les IA (AirOps, 2026).',
    },
    improvement: {
      title: 'Enrichir vos preuves et sources',
      diagnostic: 'Votre page contient quelques données mais pourrait être plus riche en preuves vérifiables.',
      action: 'Ajoutez des tableaux de données, des citations d\'experts avec leur titre, et des liens vers des sources autoritaires.',
      impact: 'Chaque source vérifiable supplémentaire renforce la confiance des IA dans votre contenu.',
    },
  },
  'Autorite & E-E-A-T': {
    max: 15,
    critical: {
      title: 'Établir votre autorité en ligne',
      diagnostic: 'Votre site manque de signaux d\'autorité : pas de page auteur identifiée, pas de page À propos détaillée, ou pas de schéma JSON-LD Organization.',
      action: 'Créez une page À propos avec votre expertise, ajoutez des mentions légales complètes, et implémentez les schémas JSON-LD (Organization, Person).',
      impact: 'Les signaux E-E-A-T sont un facteur majeur de citation par les IA, surtout pour les contenus YMYL.',
    },
    improvement: {
      title: 'Renforcer vos signaux d\'expertise',
      diagnostic: 'Votre site a les bases d\'autorité mais pourrait mieux mettre en avant votre expertise.',
      action: 'Enrichissez votre page auteur avec bio, certifications et liens sociaux. Ajoutez des témoignages vérifiables.',
      impact: 'Un profil auteur complet augmente significativement la confiance des IA dans vos contenus.',
    },
  },
  'Accessibilite IA': {
    max: 10,
    critical: {
      title: 'Rendre votre site accessible aux IA',
      diagnostic: 'Votre site bloque ou limite l\'accès aux bots IA (robots.txt restrictif, pas de sitemap, contenu bloqué par JavaScript).',
      action: 'Vérifiez votre robots.txt pour autoriser les bots IA (GPTBot, ClaudeBot, Google-Extended). Ajoutez un sitemap.xml et un attribut lang sur votre HTML.',
      impact: '73% des sites bloquent les bots IA sans le savoir (Otterly.AI, 2026). Débloquer l\'accès est souvent le fix le plus impactant.',
    },
    improvement: {
      title: 'Optimiser l\'accessibilité pour les crawlers IA',
      diagnostic: 'Votre site est partiellement accessible aux IA mais certains éléments pourraient être améliorés.',
      action: 'Ajoutez un fichier llms.txt, vérifiez que votre contenu principal n\'est pas rendu uniquement en JavaScript côté client.',
      impact: 'Une meilleure accessibilité technique facilite l\'indexation par les modèles de langage.',
    },
  },
  'Neutralite editoriale': {
    max: 10,
    critical: {
      title: 'Adopter un ton factuel et neutre',
      diagnostic: 'Votre contenu utilise un ton trop promotionnel avec des superlatifs non sourcés ("le meilleur", "n°1", "révolutionnaire"). Les IA pénalisent ce type de langage.',
      action: 'Remplacez les superlatifs par des faits vérifiables. Transformez "le meilleur outil du marché" en "utilisé par X entreprises" ou "noté X/5 sur Y avis".',
      impact: 'Un ton factuel et neutre augmente la probabilité que les IA citent votre contenu comme source fiable.',
    },
    improvement: {
      title: 'Affiner votre ton éditorial',
      diagnostic: 'Votre contenu est globalement factuel mais contient quelques formulations promotionnelles qui pourraient être améliorées.',
      action: 'Relisez votre contenu en cherchant les affirmations sans preuve et ajoutez une source ou un chiffre pour chacune.',
      impact: 'Chaque affirmation sourcée renforce la crédibilité de l\'ensemble de la page.',
    },
  },
  'Presence externe': {
    max: 10,
    critical: {
      title: 'Développer votre présence externe',
      diagnostic: 'Votre site a peu de signaux de présence externe : pas de liens sortants, pas de profils sociaux liés, peu de mentions tierces.',
      action: 'Ajoutez des liens vers vos profils sociaux actifs, citez des sources externes dans votre contenu, et travaillez à obtenir des mentions sur d\'autres sites.',
      impact: 'Les backlinks et mentions externes sont le facteur n°1 de visibilité IA selon plusieurs études.',
    },
    improvement: {
      title: 'Renforcer vos signaux externes',
      diagnostic: 'Votre présence externe existe mais pourrait être renforcée avec plus de liens sortants et de preuves sociales.',
      action: 'Ajoutez des témoignages vérifiables, des logos de clients/partenaires, et des liens vers des articles qui vous mentionnent.',
      impact: 'Chaque mention externe supplémentaire augmente votre autorité perçue par les IA.',
    },
  },
  'Fraicheur & signaux temporels': {
    max: 10,
    critical: {
      title: 'Ajouter des signaux de fraîcheur',
      diagnostic: 'Votre page ne contient aucun signal temporel récent : pas de date de mise à jour, pas d\'année courante, pas de schéma dateModified.',
      action: 'Ajoutez dateModified et datePublished dans vos schémas JSON-LD, mettez à jour votre copyright avec l\'année en cours, et mentionnez des données récentes.',
      impact: '65% des visites de bots IA ciblent du contenu publié dans les 12 derniers mois (Seer Interactive, 2025).',
    },
    improvement: {
      title: 'Renforcer les signaux de mise à jour',
      diagnostic: 'Votre page a quelques signaux temporels mais ils pourraient être plus explicites.',
      action: 'Ajoutez une date "Dernière mise à jour" visible, et mettez à jour vos données chiffrées avec les sources les plus récentes.',
      impact: 'Les IA favorisent le contenu récent et régulièrement mis à jour.',
    },
  },
};

/**
 * Generate template recommendations based on criteria scores.
 * @param {Array} criteria - Array of { name, score, max }
 * @returns {Array} - Array of recommendation objects
 */
export function generateTemplateRecos(criteria) {
  if (!Array.isArray(criteria)) return [];

  const recos = [];

  for (const c of criteria) {
    const template = RECO_TEMPLATES[c.name];
    if (!template) continue;

    const pct = (c.score / c.max) * 100;

    // Perfect score — no reco needed
    if (pct >= 95) continue;

    const level = pct < 50 ? 'critical' : 'improvement';
    const t = template[level];

    recos.push({
      criterion: c.name,
      priority: level === 'critical' ? 'high' : 'medium',
      title: t.title,
      diagnostic: t.diagnostic,
      action: t.action,
      impact: t.impact,
      scorePercent: Math.round(pct),
    });
  }

  // Sort: critical first, then by score ascending
  recos.sort((a, b) => {
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (a.priority !== 'high' && b.priority === 'high') return 1;
    return a.scorePercent - b.scorePercent;
  });

  return recos;
}
