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
    description: 'Les vraies raisons pour lesquelles les LLM ignorent votre site — et les actions concrètes à mettre en place pour changer ça.',
    category: 'GUIDE',
    readTime: '8 min',
    date: '2026-01-22',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'seo-vs-geo-differences-2026',
    title: 'SEO vs GEO : quelles différences et comment les combiner en 2026',
    description: 'SEO et GEO ne s\'opposent pas — ils se complètent. Découvrez les différences fondamentales et comment construire une stratégie qui optimise pour Google ET pour les IA.',
    category: 'STRATÉGIE',
    readTime: '10 min',
    date: '2026-01-29',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'score-geo-mesurer-visibilite-ia',
    title: 'Score GEO : comment mesurer la visibilité IA de votre site',
    description: 'Comment quantifier votre citabilité IA ? Découvrez les métriques qui comptent, la méthode de scoring de Detekia, et comment interpréter votre score /100.',
    category: 'STRATÉGIE',
    readTime: '10 min',
    date: '2026-02-05',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'schema-org-ia-guide-pratique',
    title: 'Schema.org et IA : le guide pratique pour être compris par les LLM',
    description: 'Schema.org est le langage natif des IA. Apprenez à implémenter Organization, Article, FAQPage et Product pour maximiser votre visibilité dans les réponses génératives.',
    category: 'TECHNIQUE',
    readTime: '12 min',
    date: '2026-02-12',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'ecommerce-recommandations-ia',
    title: 'E-commerce : comment apparaître dans les recommandations produits des IA',
    description: 'Les IA deviennent des conseillers d\'achat. Voici comment optimiser vos fiches produits, vos avis clients et votre structure de données pour être recommandé.',
    category: 'GUIDE',
    readTime: '10 min',
    date: '2026-02-19',
    author: 'Guillaume Bourdon',
  },
  {
    slug: '8-criteres-geo-methodologie-detekia',
    title: 'Les 8 critères GEO qui déterminent si une IA vous cite',
    description: 'Extractibilité, vérifiabilité, autorité E-E-A-T, crawlabilité IA, données structurées, neutralité éditoriale, présence externe, fraîcheur — la méthode complète derrière le score Detekia.',
    category: 'TECHNIQUE',
    readTime: '12 min',
    date: '2026-02-26',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'llms-txt-robots-crawlabilite-ia',
    title: 'llms.txt, robots.txt et crawlabilité IA : le guide technique',
    description: 'GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot — comment s\'assurer que votre site est accessible aux robots des IA, et ce que le nouveau standard llms.txt change.',
    category: 'TECHNIQUE',
    readTime: '10 min',
    date: '2026-03-05',
    author: 'Guillaume Bourdon',
  },
  {
    slug: 'geo-agences-seo-audit-ia',
    title: 'GEO pour les agences : intégrer l\'audit IA dans vos prestations SEO',
    description: 'Comment proposer l\'audit GEO à vos clients, l\'intégrer dans votre offre SEO existante, et en faire un avantage concurrentiel dès maintenant.',
    category: 'STRATÉGIE',
    readTime: '8 min',
    date: '2026-03-12',
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
