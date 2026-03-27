export const articles = [
  {
    slug: 'geo-guide-complet-2026',
    title: 'GEO : le guide complet pour être cité par les IA en 2026',
    description: 'Définition, 8 critères, 7 actions concrètes et méthode pour optimiser votre site et apparaître dans les réponses de ChatGPT, Gemini et Perplexity.',
    category: 'GUIDE',
    readTime: '15 min',
    date: '2026-03-27',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'pourquoi-chatgpt-ne-cite-pas-votre-site',
    title: 'Pourquoi ChatGPT ne cite pas votre site (et comment y remédier)',
    description: 'Les 6 raisons pour lesquelles les IA ignorent votre site, et un plan d\'action en 7 jours pour y remédier.',
    category: 'GUIDE',
    readTime: '8 min',
    date: '2026-03-27',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'seo-vs-geo-differences-2026',
    title: 'SEO vs GEO : quelles différences et comment les combiner en 2026',
    description: 'Comparatif complet SEO vs GEO : ce qui change, ce qui reste, et la stratégie en 3 couches pour être visible partout en 2026.',
    category: 'STRATÉGIE',
    readTime: '10 min',
    date: '2026-03-27',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'score-geo-mesurer-visibilite-ia',
    title: 'Score GEO : comment mesurer la visibilité IA de votre site',
    description: 'Comment fonctionne le score GEO Detekia : 8 critères décryptés, seuils d\'interprétation, et plan de priorisation pour améliorer votre citabilité IA.',
    category: 'STRATÉGIE',
    readTime: '10 min',
    date: '2026-03-27',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'schema-org-ia-guide-pratique',
    title: 'Schema.org et IA : le guide pratique pour être compris par les LLM',
    description: 'Les 5 schemas JSON-LD prioritaires pour le GEO, avec exemples de code prêts à copier et checklist d\'implémentation.',
    category: 'TECHNIQUE',
    readTime: '12 min',
    date: '2026-03-27',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'ecommerce-recommandations-ia',
    title: 'E-commerce : comment apparaître dans les recommandations produits des IA',
    description: 'Fiches produits, Schema Product, guides d\'achat, avis clients : comment optimiser votre boutique en ligne pour que les IA recommandent vos produits.',
    category: 'GUIDE',
    readTime: '10 min',
    date: '2026-03-27',
    author: 'Guillaume Bourdon',
  },
  {
    slug: '8-criteres-geo-methodologie-detekia',
    title: 'Les 8 critères GEO qui déterminent si une IA vous cite',
    description: 'Méthodologie complète : comment chaque critère du score GEO Detekia est mesuré, pondéré, et comment l\'améliorer concrètement.',
    category: 'TECHNIQUE',
    readTime: '12 min',
    date: '2026-03-27',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'llms-txt-robots-crawlabilite-ia',
    title: 'llms.txt, robots.txt et crawlabilité IA : le guide technique',
    description: 'Configuration robots.txt pour les bots IA, fichier llms.txt, vérifications de crawlabilité : le guide technique complet.',
    category: 'TECHNIQUE',
    readTime: '10 min',
    date: '2026-03-27',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'geo-agences-seo-audit-ia',
    title: 'GEO pour les agences : intégrer l\'audit IA dans vos prestations SEO',
    description: 'Comment intégrer l\'audit GEO dans vos prestations SEO : méthodologie, tarification, arguments commerciaux et formation d\'équipe.',
    category: 'STRATÉGIE',
    readTime: '8 min',
    date: '2026-03-27',
    author: 'Guillaume Bourdon',
  },
];

export function getArticleBySlug(slug) {
  return articles.find(a => a.slug === slug) || null;
}

export function getRelatedArticles(slug, count = 3) {
  const current = getArticleBySlug(slug);
  if (!current) return articles.slice(0, count);
  return articles
    .filter(a => a.slug !== slug)
    .sort((a, b) => (a.category === current.category ? -1 : 1))
    .slice(0, count);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
