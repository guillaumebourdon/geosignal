import { Redis } from '@upstash/redis';
import Head from 'next/head';
import { useState, useEffect, useRef, useCallback } from 'react';
import BeelevenContactModal from '../../components/BeelevenContactModal';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function getServerSideProps({ params }) {
  const { uuid } = params;
  if (!uuid || uuid.length < 10) return { notFound: true };
  try {
    const raw = await redis.get(`detekia:report:${uuid}`);
    if (!raw) return { notFound: true };
    const record = typeof raw === 'string' ? JSON.parse(raw) : raw;

    // Pro report
    if (record.reportType === 'pro') {
      if (!record.consolidatedReport) return { notFound: true };
      return {
        props: {
          uuid,
          reportType: 'pro',
          proReport: record.consolidatedReport,
          url: record.url || '',
          locale: record.locale || 'fr',
          createdAt: record.createdAt || null,
        },
      };
    }

    // One-page report
    if (!record.reportData) return { notFound: true };
    return {
      props: {
        uuid,
        reportType: 'onepage',
        reportData: record.reportData,
        url: record.url || '',
        locale: record.locale || 'fr',
        createdAt: record.createdAt || null,
        loyaltyCode: record.loyaltyCode || null,
      },
    };
  } catch (e) {
    console.error('[report page] Redis error:', e.message);
    return { notFound: true };
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function gradeInfo(score, locale = 'fr') {
  const en = locale === 'en';
  if (score >= 70) return { label: en ? 'GOOD' : 'BON', color: '#10A37F', bg: 'rgba(16,163,127,0.10)' };
  if (score >= 45) return { label: en ? 'AVERAGE' : 'MOYEN', color: '#C9861A', bg: 'rgba(201,134,26,0.10)' };
  return { label: en ? 'POOR' : 'FAIBLE', color: '#D97757', bg: 'rgba(217,119,87,0.10)' };
}
function priorityInfo(p, locale = 'fr') {
  const s = String(p || '').toLowerCase();
  const en = locale === 'en';
  if (s === 'high') return { label: en ? 'CRITICAL' : 'CRITIQUE', color: '#D97757', bg: 'rgba(217,119,87,0.08)' };
  if (s === 'medium') return { label: en ? 'IMPORTANT' : 'IMPORTANT', color: '#C9861A', bg: 'rgba(201,134,26,0.08)' };
  return { label: 'BONUS', color: '#10A37F', bg: 'rgba(16,163,127,0.08)' };
}
function effortInfo(e, locale = 'fr') {
  const s = String(e || '').toLowerCase();
  if (s === 'low') return { label: locale === 'en' ? 'Low' : 'Faible', color: '#10A37F' };
  if (s === 'high') return { label: locale === 'en' ? 'Heavy' : 'Lourd', color: '#D97757' };
  return { label: locale === 'en' ? 'Medium' : 'Moyen', color: '#C9861A' };
}
function criterionGroup(name, locale) {
  if (/extractibilit|donn.*structur|crawlabilit/i.test(name)) return locale === 'en' ? 'AI Readability' : 'Lisibilité IA';
  if (/v.*rifiabilit|autorit|neutralit/i.test(name)) return locale === 'en' ? 'Credibility' : 'Crédibilité';
  if (/pr.*sence|fra.*cheur/i.test(name)) return locale === 'en' ? 'Freshness' : 'Fraîcheur';
  return locale === 'en' ? 'Optimization' : 'Optimisation';
}

const CRITERIA_ORDER = [
  'Citabilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T',
  'Accessibilite IA', 'Neutralite editoriale',
  'Presence externe', 'Fraicheur & signaux temporels',
  // Legacy fallbacks for old cached reports
  'Extractibilite & reponse directe', 'Crawlabilite IA', 'Donnees structurees', 'Fraicheur & maintenance',
];

const WHY_FR = {
  extractibilite: "44,2% des citations IA proviennent des 30 premiers % du texte d'une page (Growth Memo, 2026). L'étude Princeton/KDD 2024 démontre que l'ajout de statistiques et de citations dans le contenu augmente la visibilité IA de 30 à 40%. Votre introduction est votre atout n°1.",
  verifiabilite: "Les IA favorisent les contenus factuels et sourcés. Les pages avec des données chiffrées sont citées 2,8x plus souvent que les pages sans données vérifiables. (AirOps, 2026)",
  autorite: "L'autorité de domaine est le prédicteur n°1 des citations IA avec un score SHAP de 0,63 (SE Ranking, 2025). Les pages avec des auteurs identifiés et des biographies sont significativement plus citées par les LLM.",
  crawlabilite: "73% des sites ne sont pas crawlables par les bots IA à cause de robots.txt, CDN ou JavaScript (Otterly.AI, 2026). Débloquer les crawlers IA est le quick win n°1 — impact visible en 2 à 4 semaines.",
  'donnees structurees': "Les pages avec Schema FAQPage, Article et Organization sont plus facilement parsées par les IA. Le contenu structuré en chunks est cité 3 à 5x plus souvent que le contenu brut. (Otterly.AI, 2026)",
  neutralite: "Les IA déprioritisent le contenu ouvertement promotionnel. L'étude Princeton montre que la 'Fluency Optimization' améliore la visibilité IA, mais le ton doit rester factuel et informatif pour être cité.",
  presence: "90% des citations IA proviennent de médias earned et owned, pas de placements payants (Edelman, 2026). Reddit est la source n°1 pour Perplexity (6,6% des citations) et n°2 pour ChatGPT.",
  fraicheur: "65% des visites de bots IA ciblent du contenu publié dans les 12 derniers mois (Seer Interactive, 2025). Un contenu non mis à jour depuis plus de 6 mois perd progressivement sa citabilité IA.",
};

const WHY_EN = {
  extractibilite: "44.2% of AI citations come from the first 30% of a page's text (Growth Memo, 2026). The Princeton/KDD 2024 study shows that adding statistics and citations to content increases AI visibility by 30–40%. Your introduction is your #1 asset.",
  verifiabilite: "AI engines favor factual, sourced content. Pages with hard data are cited 2.8x more often than pages without verifiable data. (AirOps, 2026)",
  autorite: "Domain authority is the #1 predictor of AI citations with a SHAP score of 0.63 (SE Ranking, 2025). Pages with identified authors and bios are significantly more cited by LLMs.",
  crawlabilite: "73% of sites are not crawlable by AI bots due to robots.txt, CDN or JavaScript (Otterly.AI, 2026). Unblocking AI crawlers is the #1 quick win — visible impact within 2–4 weeks.",
  'donnees structurees': "Pages with FAQPage, Article and Organization schemas are more easily parsed by AI engines. Structured, chunked content is cited 3–5x more often than raw content. (Otterly.AI, 2026)",
  neutralite: "AI engines deprioritize overtly promotional content. The Princeton study shows 'Fluency Optimization' improves AI visibility, but the tone must remain factual and informative to be cited.",
  presence: "90% of AI citations come from earned and owned media, not paid placements (Edelman, 2026). Reddit is the #1 source for Perplexity (6.6% of citations) and #2 for ChatGPT.",
  fraicheur: "65% of AI bot visits target content published in the last 12 months (Seer Interactive, 2025). Content not updated for 6+ months gradually loses its AI citability.",
};

function getWhy(locale) { return locale === 'en' ? WHY_EN : WHY_FR; }

const GUIDES_FR = {
  extractibilite: "Restructurez votre page d'accueil pour répondre directement à la question principale de votre audience dès les 2 premières phrases. Utilisez des listes à puces, des sous-titres H2/H3 descriptifs contenant vos mots-clés cibles. Évitez les introductions vagues.",
  verifiabilite: "Pour chaque donnée chiffrée, ajoutez un lien externe vers la source originale. Visez 5 à 10 liens externes par page principale. Ajoutez des dates explicites (datePublished, dateModified en JSON-LD).",
  autorite: "Créez une page 'À propos' détaillée avec qualifications, certifications, années d'expérience. Ajoutez un schema Organization en JSON-LD. Créez des pages auteur avec bio, photo et liens LinkedIn.",
  crawlabilite: "Vérifiez votre robots.txt : GPTBot, ClaudeBot, PerplexityBot doivent être autorisés. Ajoutez un fichier llms.txt à la racine. Assurez-vous que le contenu principal n'est pas rendu en JavaScript côté client.",
  'donnees structurees': "Implémentez au minimum : Organization (nom, logo, contact), FAQPage, Article ou BlogPosting. Validez avec le Rich Results Test de Google.",
  neutralite: "Remplacez les superlatifs par des données factuelles. Ajoutez une section 'Limites' ou 'Pour qui ce n'est PAS fait'. Comparez honnêtement votre offre avec les alternatives.",
  presence: "Créez un profil Reddit actif. Participez aux discussions de votre industrie. Obtenez des mentions dans des articles de presse, podcasts, interviews.",
  fraicheur: "Ajoutez datePublished et dateModified en schema.org. Mettez à jour vos articles existants avec des données récentes. Affichez la date de dernière mise à jour visiblement.",
};

const GUIDES_EN = {
  extractibilite: "Restructure your homepage to directly answer your audience's main question in the first 2 sentences. Use bullet lists, descriptive H2/H3 subheadings containing your target keywords. Avoid vague introductions.",
  verifiabilite: "For each data point, add an external link to the original source. Aim for 5–10 external links per main page. Add explicit dates (datePublished, dateModified in JSON-LD).",
  autorite: "Create a detailed About page with qualifications, certifications, years of experience. Add an Organization schema in JSON-LD. Create author pages with bio, photo and LinkedIn links.",
  crawlabilite: "Check your robots.txt: GPTBot, ClaudeBot, PerplexityBot must be allowed. Add an llms.txt file at the root. Make sure main content is not rendered via client-side JavaScript.",
  'donnees structurees': "Implement at minimum: Organization (name, logo, contact), FAQPage, Article or BlogPosting. Validate with Google's Rich Results Test.",
  neutralite: "Replace superlatives with factual data. Add a 'Limitations' or 'Who this is NOT for' section. Honestly compare your offering with alternatives.",
  presence: "Create an active Reddit profile. Participate in your industry discussions. Get mentions in press articles, podcasts, interviews.",
  fraicheur: "Add datePublished and dateModified in schema.org. Update your existing articles with recent data. Display the last update date visibly.",
};

function getGuides(locale) { return locale === 'en' ? GUIDES_EN : GUIDES_FR; }

const CASES_FR = {
  extractibilite: "SEO Vendor a obtenu 549 sessions ChatGPT en 7 mois grâce à des tactiques d'extractibilité (sections citables, format question-réponse directe). (SEO Vendor, 2026)",
  verifiabilite: "Ahrefs génère 12,1% de ses inscriptions via le trafic IA grâce à des contenus riches en données vérifiables. (Ahrefs/Semrush, 2025)",
  autorite: "Les marques dans le top 25% des mentions web obtiennent 10x plus de visibilité IA. Le top 50 capture 28,9% de toutes les mentions dans les AI Overviews. (Ahrefs, 2025)",
  crawlabilite: "Triangle IP a créé un fichier llms.txt : 5x plus de trafic IA et présence sur ChatGPT, Gemini, Perplexity et Copilot. (Concurate/SE Ranking, 2025)",
  'donnees structurees': "Un site a augmenté sa visibilité IA de 340% en 6 mois via restructuration du contenu et implémentation de schemas. (Stackmatix, 2026)",
  neutralite: "La 'Fluency Optimization' améliore significativement la visibilité IA. Le contenu éducatif est systématiquement cité devant le contenu promotionnel.",
  presence: "Reddit est cité dans 46,7% des réponses Perplexity et 1,8% des citations ChatGPT. (Profound, 2025)",
  fraicheur: "79% des pages visitées par les bots IA ont été publiées dans les 2 dernières années. (Seer Interactive, 2025)",
};

const CASES_EN = {
  extractibilite: "SEO Vendor got 549 ChatGPT sessions in 7 months through extractability tactics (citable sections, direct Q&A format). (SEO Vendor, 2026)",
  verifiabilite: "Ahrefs generates 12.1% of its signups via AI traffic thanks to content rich in verifiable data. (Ahrefs/Semrush, 2025)",
  autorite: "Brands in the top 25% of web mentions get 10x more AI visibility. The top 50 captures 28.9% of all mentions in AI Overviews. (Ahrefs, 2025)",
  crawlabilite: "Triangle IP created an llms.txt file: 5x more AI traffic and presence on ChatGPT, Gemini, Perplexity and Copilot. (Concurate/SE Ranking, 2025)",
  'donnees structurees': "A site increased its AI visibility by 340% in 6 months through content restructuring and schema implementation. (Stackmatix, 2026)",
  neutralite: "'Fluency Optimization' significantly improves AI visibility. Educational content is systematically cited over promotional content.",
  presence: "Reddit is cited in 46.7% of Perplexity responses and 1.8% of ChatGPT citations. (Profound, 2025)",
  fraicheur: "79% of pages visited by AI bots were published in the last 2 years. (Seer Interactive, 2025)",
};

function getCases(locale) { return locale === 'en' ? CASES_EN : CASES_FR; }

function lookupMap(map, name) {
  const n = String(name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [k, v] of Object.entries(map)) if (n.includes(k)) return v;
  return '';
}

const CTX_CARDS_FR = [
  { label: 'Croissance du trafic IA', value: '+527%', text: 'Le trafic référé par les IA a augmenté de 527% entre janvier et mai 2025.', source: 'Previsible, 2025', color: '#D97757' },
  { label: 'Usage ChatGPT', value: '2,5 Mds', text: 'Requêtes traitées par jour. 810 millions de personnes l\'utilisent quotidiennement.', source: 'Search Engine Land, 2026', color: '#D97757' },
  { label: 'Taux de conversion IA', value: '4,4x', text: 'Les visiteurs référés par les IA convertissent 4,4x mieux que les visiteurs organiques classiques.', source: 'Semrush, 2025', color: '#10A37F' },
  { label: 'SEO vs GEO', value: '80%', text: 'Des URLs citées par ChatGPT ne sont PAS dans le top 100 Google. Le SEO seul ne suffit plus.', source: 'Ahrefs, 2025', color: '#D97757' },
  { label: 'Position du texte', value: '44,2%', text: 'Des citations IA proviennent des 30 premiers % du texte. Votre introduction est votre atout n°1.', source: 'Growth Memo, 2026', color: '#C9861A' },
  { label: 'Marché GEO', value: '33,7 Mds$', text: 'Valeur projetée du marché GEO en 2034, contre 848M$ en 2025.', source: 'eMarketer', color: '#10A37F' },
];
const CTX_CARDS_EN = [
  { label: 'AI traffic growth', value: '+527%', text: 'AI-referred traffic increased by 527% between January and May 2025.', source: 'Previsible, 2025', color: '#D97757' },
  { label: 'ChatGPT usage', value: '2.5B', text: 'Queries processed per day. 810 million people use it daily.', source: 'Search Engine Land, 2026', color: '#D97757' },
  { label: 'AI conversion rate', value: '4.4x', text: 'AI-referred visitors convert 4.4x better than traditional organic visitors.', source: 'Semrush, 2025', color: '#10A37F' },
  { label: 'SEO vs GEO', value: '80%', text: 'Of URLs cited by ChatGPT are NOT in the Google top 100. SEO alone is no longer enough.', source: 'Ahrefs, 2025', color: '#D97757' },
  { label: 'Text position', value: '44.2%', text: 'Of AI citations come from the first 30% of the text. Your introduction is your #1 asset.', source: 'Growth Memo, 2026', color: '#C9861A' },
  { label: 'GEO market', value: '$33.7B', text: 'Projected GEO market value in 2034, up from $848M in 2025.', source: 'eMarketer', color: '#10A37F' },
];
function getCtxCards(locale) { return locale === 'en' ? CTX_CARDS_EN : CTX_CARDS_FR; }

// ── Criteria name translations (FR keys → localized display) ─────────────────
const CRITERIA_EN = {
  // V2 criteria names
  'Citabilité & réponse directe': 'Citability & Direct Answer',
  'Vérifiabilité & preuves': 'Verifiability & Evidence',
  'Autorité & E-E-A-T': 'Authority & E-E-A-T',
  'Accessibilité IA': 'AI Accessibility',
  'Neutralité éditoriale': 'Editorial Neutrality',
  'Présence externe': 'External Presence',
  'Fraîcheur & signaux temporels': 'Freshness & Timeliness',
  // Unaccented V2
  'Citabilite & reponse directe': 'Citability & Direct Answer',
  'Verifiabilite & preuves': 'Verifiability & Evidence',
  'Autorite & E-E-A-T': 'Authority & E-E-A-T',
  'Accessibilite IA': 'AI Accessibility',
  'Neutralite editoriale': 'Editorial Neutrality',
  'Presence externe': 'External Presence',
  'Fraicheur & signaux temporels': 'Freshness & Timeliness',
  // Legacy V1 names (for old cached reports)
  'Extractibilité & réponse directe': 'Extractability & Direct Answer',
  'Crawlabilité IA': 'AI Crawlability',
  'Données structurées': 'Structured Data',
  'Fraîcheur & maintenance': 'Freshness & Maintenance',
  'Extractibilite & reponse directe': 'Extractability & Direct Answer',
  'Crawlabilite IA': 'AI Crawlability',
  'Donnees structurees': 'Structured Data',
  'Fraicheur & maintenance': 'Freshness & Maintenance',
  // Short versions
  'Citabilité': 'Citability',
  'Extractibilité': 'Extractability',
  'Vérifiabilité': 'Verifiability',
  'Autorité E-E-A-T': 'Authority & E-E-A-T',
  'Données structurées': 'Structured Data',
  'Neutralité': 'Neutrality',
  'Fraîcheur': 'Freshness',
};

function tc(name, locale) {
  if (locale !== 'en' || !name) return name || '';
  return CRITERIA_EN[name] || CRITERIA_EN[name.trim()] || name;
}

const METHODOLOGY_TABLE_FR = [
  { name: 'Citabilité & réponse directe', weight: '25 pts', measured: 'Answer capsules, front-loading, profondeur de contenu, titres en question, paragraphes modulaires' },
  { name: 'Vérifiabilité & preuves', weight: '20 pts', measured: 'Données chiffrées sourcées, liens externes, dates, tableaux comparatifs, citations d\'experts' },
  { name: 'Autorité & E-E-A-T', weight: '15 pts', measured: 'Auteur identifié, pages Contact/Legal/À propos, schema Organization, langage définitif' },
  { name: 'Accessibilité IA', weight: '10 pts', measured: 'Bots IA de recherche autorisés, indexabilité, contenu suffisant, lang, canonical, sitemap' },
  { name: 'Neutralité éditoriale', weight: '10 pts', measured: 'Évalué par IA — ton factuel, absence de superlatifs, langage éducatif' },
  { name: 'Présence externe', weight: '10 pts', measured: 'Réseaux sociaux, mentions presse, témoignages, liens sortants, multi-plateforme' },
  { name: 'Fraîcheur & signaux temporels', weight: '10 pts', measured: 'Dates de publication, dateModified, copyright à jour, contenu récent' },
];

const METHODOLOGY_TABLE_EN = [
  { name: 'Citability & Direct Answer', weight: '25 pts', measured: 'Answer capsules, front-loading, content depth, question headings, modular paragraphs' },
  { name: 'Verifiability & Evidence', weight: '20 pts', measured: 'Sourced data points, external links, dates, comparison tables, expert quotations' },
  { name: 'Authority & E-E-A-T', weight: '15 pts', measured: 'Identified author, Contact/Legal/About pages, Organization schema, definitive language' },
  { name: 'AI Accessibility', weight: '10 pts', measured: 'AI search bots allowed, indexability, sufficient content, lang, canonical, sitemap' },
  { name: 'Editorial Neutrality', weight: '10 pts', measured: 'Evaluated by AI — factual tone, no superlatives, educational language' },
  { name: 'External Presence', weight: '10 pts', measured: 'Social media, press mentions, testimonials, outbound links, multi-platform' },
  { name: 'Freshness & Timeliness', weight: '10 pts', measured: 'Publication dates, dateModified, current copyright, recent content' },
];

function getMethodologyTable(locale) {
  return locale === 'en' ? METHODOLOGY_TABLE_EN : METHODOLOGY_TABLE_FR;
}

// ── Report UI strings by locale ──────────────────────────────────────────────
const REPORT_STRINGS = {
  fr: {
    scoreLabel: 'SCORE DE VISIBILITÉ IA',
    scoreMax: '/100',
    verdictLabel: 'VERDICT',
    criteriaLabel: 'ANALYSE PAR CRITÈRE',
    evidenceLabel: 'PREUVES TECHNIQUES',
    recoLabel: 'RECOMMANDATIONS',
    recoCount: 'recommandations personnalisées',
    priority: { high: 'Critique', medium: 'Important', low: 'Bonus' },
    impact: 'Impact', effort: 'Effort', timeframe: 'Délai',
    impactValues: { high: 'Élevé', medium: 'Moyen', low: 'Faible' },
    effortValues: { high: 'Élevé', medium: 'Moyen', low: 'Faible' },
    problem: 'Diagnostic', solution: 'Solution', steps: 'Étapes techniques', code: 'Exemple de code',
    citationLabel: 'TEST DE VISIBILITÉ IA', citationIntro: 'Requêtes testées sur ChatGPT',
    cited: 'Votre site apparaît', notCited: 'Votre site n\'apparaît pas',
    competitorsLabel: 'Cités à votre place :',
    methodology: 'MÉTHODOLOGIE', methodologyTitle: 'Comment ce score est calculé',
    methodologyDesc: 'Score basé sur 7 critères pondérés, analysés par des règles déterministes + IA.',
    criterion: 'Critère', weight: 'Poids', measured: 'Ce qu\'on mesure',
    downloadPdf: 'Télécharger le rapport PDF',
    poweredBy: 'Rapport généré par',
    beelevenTitle: 'Besoin d\'aide pour implémenter ?',
    beelevenDesc: 'Beeleven, l\'agence qui a créé Detekia, peut implémenter les recommandations pour vous.',
    beelevenCta: 'Discutons-en →',
    goFurther: 'ALLER PLUS LOIN',
    evidenceIntro: 'Extrait analysé — 300 premiers caractères du site',
    evidenceHeadings: 'Structure des titres (H1 / H2 / H3)',
    evidenceMeta: 'Meta title & description',
    evidenceSchemas: 'Schémas JSON-LD détectés',
    evidenceSocial: 'Liens sociaux',
    evidenceImages: 'Images',
    evidenceExtLinks: 'Liens externes',
    evidenceDates: 'Dates détectées',
    evidenceRobots: 'robots.txt',
    evidenceLlms: 'llms.txt',
    evidenceTrustLinks: 'Liens de confiance internes',
    noData: 'Non disponible',
    execSummary: 'Synthèse exécutive', analysisResults: "Résultats de l'analyse",
    the8Criteria: 'Les 7 critères GEO', context2026: 'Contexte 2026',
    whyAiMatters: 'Pourquoi la visibilité IA est critique en 2026',
    whyAiDesc: "Les moteurs de recherche IA changent radicalement la façon dont les internautes trouvent l'information. Voici les données clés qui expliquent pourquoi votre visibilité IA est devenue un enjeu business direct.",
    whyAiDescShort: "Les moteurs de recherche IA changent radicalement la façon dont les internautes trouvent l'information.",
    only11: "Seulement 11% des domaines sont cités à la fois par ChatGPT ET Perplexity. Chaque plateforme IA a ses propres préférences — une raison supplémentaire de travailler votre citabilité de façon transversale. (Profound, 2025)",
    only11Short: "Seulement 11% des domaines sont cités à la fois par ChatGPT ET Perplexity.",
    academicSource: 'Source académique de référence', academicSourceShort: 'Source académique',
    academicRef: '"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024. Certaines optimisations augmentent la visibilité IA jusqu\'à 40%.',
    academicRefShort: '"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024.',
    citationTestTitle: 'Test de visibilité IA',
    citationTestDesc10: "Nous avons simulé 10 requêtes utilisateur pour vérifier si votre site est cité par les moteurs IA.",
    citationTestDesc30: "Nous avons simulé 30 requêtes utilisateur pour vérifier si votre site est cité par les moteurs IA.",
    bestOpportunity: 'Meilleure opportunité', mainBlocker: 'Blocage principal',
    citationDisclaimer: "Ce test simule des requêtes utilisateur via l'IA. Les résultats varient selon le moteur, la formulation et le moment.",
    citationDisclaimerShort: "Ce test simule des requêtes via l'IA. Les résultats varient selon le moteur, la formulation et le moment.",
    whatWeFound: 'Ce que nous avons trouvé',
    recommendation_s: 'Recommandation', recommendations_s: 'Recommandations',
    criterionWellOptimized: 'Ce critère est bien optimisé. Continuez à maintenir ce niveau.',
    criterionWellOptimizedSite: "Ce critère est bien optimisé sur l'ensemble du site.",
    criterionNeedsWork: "Ce critère nécessite des améliorations",
    criterionNeedsWorkSuffix: "Les recommandations spécifiques sont intégrées dans le plan d'action ci-dessous.",
    techGuide: 'Guide technique', documentedCase: 'Cas réel documenté',
    actionSummary: 'Récapitulatif des actions',
    actionSummaryDesc: "recommandations classées par priorité d'impact.",
    theCriterion: 'Critère',
    transparency: 'Transparence', methodologyH2: 'Méthodologie',
    analysisLimits: "LIMITES DE L'ANALYSE",
    analysisLimitsDesc: "Ce rapport est généré par analyse automatisée du contenu accessible via scraping. Certains éléments rendus en JavaScript côté client, protégés par authentification, ou chargés dynamiquement peuvent ne pas être détectés.",
    methodologyP1: "Ce rapport est généré par analyse automatisée du DOM de votre page via un service de scraping spécialisé pour les IA et évaluation sur <strong>7 critères pondérés</strong>. Le critère Neutralité éditoriale est évalué par intelligence artificielle. Les 7 autres critères sont évalués par analyse technique du HTML.",
    methodologyP1Pro: "Analyse réalisée sur {n} pages du site prioritisées par leur importance éditoriale (méthodologie de priorisation par sitemap + fraîcheur + profondeur). Chaque page est évaluée sur 7 critères pondérés. Le test IA Pro porte sur 30 requêtes simulées (vs 10 pour le rapport one-page).",
    methodologyP2: "Le test de visibilité IA est réalisé par simulation de 10 requêtes via l'IA. Les résultats varient selon le moteur IA, la requête et le moment du test.",
    methodologyScoreCalc: "Le score global est calculé à partir des 7 critères techniques (sur 95 points) auxquels s'ajoute un bonus de neutralité éditoriale allant de -3 à +3 points, évalué par IA. Le score affiché n'est donc pas la somme directe des 8 sous-scores.",
    the8CriteriaWeights: 'Les 7 critères et leur pondération',
    academicSourceLabel: 'SOURCE ACADÉMIQUE',
    reportLimits: 'LIMITES DU RAPPORT',
    reportLimitsDesc: "Les moteurs IA évoluent rapidement. Les résultats reflètent l'état des algorithmes à la date de génération. Le test de visibilité IA est une simulation et non une interrogation directe des moteurs.",
    reportGenerated: 'Rapport généré le',
    currentScore: 'Score actuel', projectedScore: 'Score projeté',
    projectionText: 'En appliquant les recommandations, votre score GEO pourrait passer de',
    projectionTo: 'à',
    projectionDisclaimer: "Cette projection est indicative. Elle suppose une implémentation propre des recommandations et ne prend pas en compte l'évolution rapide des moteurs IA.",
    projectionDisclaimerShort: 'Cette projection est indicative. Elle ne constitue pas une garantie.',
    fullAudit: 'AUDIT COMPLET',
    upsellTitle: 'Ce rapport analyse 1 page.',
    upsellTitle2: 'Votre site en a probablement 20, 50, 100.',
    upsellDesc: "L'audit complet Detekia analyse les 10 pages clés de votre site, détecte les patterns transverses et produit un plan d'action priorisé pour l'ensemble du site.",
    upsellCta: 'Auditer mon site complet — 99€ →',
    queriesCite: 'requêtes\ncitent votre site',
    citedLabel: 'Cité', notCitedLabel: 'Non cité',
    genericLabel: 'GÉNÉRIQUE', longTailLabel: 'LONGUE TRAÎNE',
    difficultyLabel: 'Difficulté',
    citedWithYou: 'Cités avec vous', citedInstead: 'Cités à votre place',
    recommendationLabel: 'Recommandation',
    theProblem: 'Le problème', theSolution: 'La solution',
    techImplementation: 'Mise en œuvre technique',
    pagesAffected: 'pages concernées', pageLabel: 'Page',
    detailedAnalysis: 'Analyse détaillée',
    patternsDetected: 'Patterns détectés',
    consolidatedActions: 'Actions prioritaires consolidées',
    actionsClassified: 'actions classées par priorité.',
    belowThreshold: 'sous seuil', pagesBelowThreshold: 'pages sous le seuil 75%',
    appendix: 'Annexe', pageByPageReview: 'Bilan par page analysée',
    priorityActions: 'Actions prioritaires',
    pagesNotAnalyzable: 'page(s) non analysable(s)',
    siteAvgScore: 'score moyen du site', pagesAnalyzed: 'pages analysées',
    scope: 'Périmètre', aggregatedScore: 'Score agrégé : moyenne arithmétique des scores individuels.',
    testIaConsolidated: 'Test IA consolidé', testIa30: 'Test de visibilité IA — 30 requêtes',
    priorityAction_s: 'action prioritaire', priorityActions_s: 'actions prioritaires',
    criterion_s: 'Critère', pdfError: 'Erreur lors de la génération du PDF. Réessayez.',
    average: 'moyenne site',
  },
  en: {
    scoreLabel: 'AI VISIBILITY SCORE',
    scoreMax: '/100',
    verdictLabel: 'VERDICT',
    criteriaLabel: 'ANALYSIS BY CRITERION',
    evidenceLabel: 'TECHNICAL EVIDENCE',
    recoLabel: 'RECOMMENDATIONS',
    recoCount: 'personalized recommendations',
    priority: { high: 'Critical', medium: 'Important', low: 'Bonus' },
    impact: 'Impact', effort: 'Effort', timeframe: 'Timeline',
    impactValues: { high: 'High', medium: 'Medium', low: 'Low' },
    effortValues: { high: 'High', medium: 'Medium', low: 'Low' },
    problem: 'Diagnosis', solution: 'Solution', steps: 'Technical steps', code: 'Code example',
    citationLabel: 'AI VISIBILITY TEST', citationIntro: 'Queries tested on ChatGPT',
    cited: 'Your site appears', notCited: 'Your site does not appear',
    competitorsLabel: 'Cited instead of you:',
    methodology: 'METHODOLOGY', methodologyTitle: 'How this score is calculated',
    methodologyDesc: 'Score based on 8 weighted criteria, analyzed by deterministic rules + AI.',
    criterion: 'Criterion', weight: 'Weight', measured: 'What we measure',
    downloadPdf: 'Download PDF report',
    poweredBy: 'Report generated by',
    beelevenTitle: 'Need help implementing?',
    beelevenDesc: 'Beeleven, the agency behind Detekia, can implement the recommendations for you.',
    beelevenCta: 'Let\'s talk →',
    goFurther: 'GO FURTHER',
    evidenceIntro: 'Analyzed excerpt — first 300 characters',
    evidenceHeadings: 'Heading structure (H1 / H2 / H3)',
    evidenceMeta: 'Meta title & description',
    evidenceSchemas: 'JSON-LD schemas detected',
    evidenceSocial: 'Social links',
    evidenceImages: 'Images',
    evidenceExtLinks: 'External links',
    evidenceDates: 'Dates detected',
    evidenceRobots: 'robots.txt',
    evidenceLlms: 'llms.txt',
    evidenceTrustLinks: 'Internal trust links',
    noData: 'Not available',
    execSummary: 'Executive summary', analysisResults: 'Analysis results',
    the8Criteria: 'The 8 GEO criteria', context2026: '2026 Context',
    whyAiMatters: 'Why AI visibility is critical in 2026',
    whyAiDesc: 'AI search engines are radically changing how people find information. Here are the key data points explaining why your AI visibility has become a direct business issue.',
    whyAiDescShort: 'AI search engines are radically changing how people find information.',
    only11: 'Only 11% of domains are cited by both ChatGPT AND Perplexity. Each AI platform has its own preferences — another reason to work on your citability across the board. (Profound, 2025)',
    only11Short: 'Only 11% of domains are cited by both ChatGPT AND Perplexity.',
    academicSource: 'Academic reference source', academicSourceShort: 'Academic source',
    academicRef: '"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024. Some optimizations increase AI visibility by up to 40%.',
    academicRefShort: '"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024.',
    citationTestTitle: 'AI visibility test',
    citationTestDesc10: 'We tested 10 user queries to check if your site is cited by AI engines.',
    citationTestDesc30: 'We tested 30 user queries to check if your site is cited by AI engines.',
    bestOpportunity: 'Best opportunity', mainBlocker: 'Main blocker',
    citationDisclaimer: 'This test simulates user queries via AI. Results vary depending on the engine, wording and timing.',
    citationDisclaimerShort: 'This test simulates queries via AI. Results vary depending on the engine, wording and timing.',
    whatWeFound: 'What we found',
    recommendation_s: 'Recommendation', recommendations_s: 'Recommendations',
    criterionWellOptimized: 'This criterion is well optimized. Keep maintaining this level.',
    criterionWellOptimizedSite: 'This criterion is well optimized across the entire site.',
    criterionNeedsWork: 'This criterion needs improvement',
    criterionNeedsWorkSuffix: 'Specific recommendations are included in the action plan below.',
    techGuide: 'Technical guide', documentedCase: 'Documented real case',
    actionSummary: 'Action summary',
    actionSummaryDesc: 'recommendations ranked by impact priority.',
    theCriterion: 'Criterion',
    transparency: 'Transparency', methodologyH2: 'Methodology',
    analysisLimits: 'ANALYSIS LIMITATIONS',
    analysisLimitsDesc: 'This report is generated by automated analysis of content accessible via scraping. Some elements rendered via client-side JavaScript, protected by authentication, or loaded dynamically may not be detected.',
    methodologyP1: 'This report is generated by automated analysis of your page\'s DOM via a specialized AI scraping service and evaluation on <strong>8 weighted criteria</strong>. The Editorial Neutrality criterion is evaluated by artificial intelligence. The other 7 criteria are evaluated by technical HTML analysis.',
    methodologyP1Pro: 'Analysis performed on {n} pages prioritized by editorial importance (prioritization by sitemap + freshness + depth). Each page is evaluated on 8 weighted criteria. The Pro AI test covers 30 simulated queries (vs 10 for the one-page report).',
    methodologyP2: 'The AI visibility test is performed by simulating 10 queries via AI. Results vary depending on the AI engine, query and timing.',
    methodologyScoreCalc: 'The overall score is calculated from 7 technical criteria (out of 95 points) plus an editorial neutrality bonus ranging from -3 to +3 points, evaluated by AI. The displayed score is therefore not a direct sum of the 8 sub-scores.',
    the8CriteriaWeights: 'The 7 criteria and their weights',
    academicSourceLabel: 'ACADEMIC SOURCE',
    reportLimits: 'REPORT LIMITATIONS',
    reportLimitsDesc: 'AI engines evolve rapidly. Results reflect the state of algorithms at the generation date. The AI visibility test is a simulation, not a direct query to AI engines.',
    reportGenerated: 'Report generated on',
    currentScore: 'Current score', projectedScore: 'Projected score',
    projectionText: 'By implementing the recommendations, your GEO score could go from',
    projectionTo: 'to',
    projectionDisclaimer: 'This projection is indicative. It assumes a proper implementation of recommendations and does not account for the rapid evolution of AI engines.',
    projectionDisclaimerShort: 'This projection is indicative. It does not constitute a guarantee.',
    fullAudit: 'FULL AUDIT',
    upsellTitle: 'This report analyzes 1 page.',
    upsellTitle2: 'Your site likely has 20, 50, 100.',
    upsellDesc: "Detekia's full audit analyzes the 10 key pages of your site, detects cross-page patterns and produces a prioritized action plan for the entire site.",
    upsellCta: 'Audit my full site — €99 →',
    queriesCite: 'queries\ncite your site',
    citedLabel: 'Cited', notCitedLabel: 'Not cited',
    genericLabel: 'GENERIC', longTailLabel: 'LONG TAIL',
    difficultyLabel: 'Difficulty',
    citedWithYou: 'Cited with you', citedInstead: 'Cited instead of you',
    recommendationLabel: 'Recommendation',
    theProblem: 'The problem', theSolution: 'The solution',
    techImplementation: 'Technical implementation',
    pagesAffected: 'pages affected', pageLabel: 'Page',
    detailedAnalysis: 'Detailed analysis',
    patternsDetected: 'Patterns detected',
    consolidatedActions: 'Consolidated priority actions',
    actionsClassified: 'actions ranked by priority.',
    belowThreshold: 'below threshold', pagesBelowThreshold: 'pages below 75% threshold',
    appendix: 'Appendix', pageByPageReview: 'Page-by-page review',
    priorityActions: 'Priority actions',
    pagesNotAnalyzable: 'page(s) could not be analyzed',
    siteAvgScore: 'site average score', pagesAnalyzed: 'pages analyzed',
    scope: 'Scope', aggregatedScore: 'Aggregated score: arithmetic average of individual scores.',
    testIaConsolidated: 'Consolidated AI test', testIa30: 'AI visibility test — 30 queries',
    priorityAction_s: 'priority action', priorityActions_s: 'priority actions',
    criterion_s: 'Criterion', pdfError: 'Error generating PDF. Please try again.',
    average: 'site average',
  },
};

function rs(locale) { return REPORT_STRINGS[locale] || REPORT_STRINGS.fr; }

// ── Evidence Blocks (per-criterion) ─────────────────────────────────────────

function EvidenceBlock({ criterionName, evidence, locale: loc }) {
  if (!evidence) return null;
  const name = criterionName.toLowerCase();
  const s = rs(loc);
  const en = loc === 'en';
  const Box = ({ label, children }) => (
    <div style={{ background: '#F7F5F2', borderLeft: '3px solid #E5E2DC', padding: '14px 18px', borderRadius: '0 6px 6px 0', margin: '10px 0' }}>
      {label && <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>}
      {children}
    </div>
  );

  if (/extractibilit/i.test(name)) {
    return (<>
      {evidence.intro && <Box label={s.evidenceIntro}><div style={{ fontFamily: 'monospace', fontSize: 12, color: '#1A1916', lineHeight: 1.6 }}>{evidence.intro}</div></Box>}
      {evidence.headings?.length > 0 && (<>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>{en ? 'Detected H1/H2/H3 structure' : 'Structure H1/H2/H3 détectée'}</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E2DC', borderRadius: 6, overflow: 'hidden', fontSize: 12 }}>
          <thead><tr style={{ background: '#F7F5F2' }}><th style={{ padding: '7px 10px', textAlign: 'left', fontFamily: 'monospace', fontSize: 9, color: '#6B6762', fontWeight: 400 }}>{en ? 'Level' : 'Niveau'}</th><th style={{ padding: '7px 10px', textAlign: 'left', fontFamily: 'monospace', fontSize: 9, color: '#6B6762', fontWeight: 400 }}>{en ? 'Text' : 'Texte'}</th></tr></thead>
          <tbody>{evidence.headings.slice(0, 20).map((h, i) => (<tr key={i}><td style={{ padding: '5px 10px', fontFamily: 'monospace', fontSize: 10, color: '#D97757', textTransform: 'uppercase', whiteSpace: 'nowrap', borderBottom: '1px solid #F0EDE8' }}>{h.level}</td><td style={{ padding: '5px 10px', fontSize: 11, color: '#1A1916', borderBottom: '1px solid #F0EDE8' }}>{h.text}</td></tr>))}</tbody>
        </table>
      </>)}
      {evidence.wordCount != null && <div style={{ fontSize: 12, color: '#6B6762', marginTop: 10 }}>{en ? 'Word count: ' : 'Nombre de mots : '}<strong style={{ color: '#1A1916' }}>{evidence.wordCount}</strong></div>}
    </>);
  }

  if (/v.*rifiabilit/i.test(name)) {
    return (<>
      {evidence.externalLinks != null && <Box label={en ? 'Outgoing links to external sources' : 'Liens sortants vers sources externes'}><div style={{ fontFamily: 'monospace', fontSize: 12, color: '#1A1916' }}>{evidence.externalLinks} {en ? 'external link(s) detected' : 'lien(s) externe(s) détecté(s)'}</div></Box>}
      <Box label={en ? 'Dates detected in content' : 'Dates détectées dans le contenu'}>
        {evidence.dates && Object.keys(evidence.dates).length > 0
          ? Object.entries(evidence.dates).map(([k, v]) => <div key={k} style={{ fontSize: 12, marginBottom: 4 }}><span style={{ color: '#6B6762' }}>{k}:</span> <strong style={{ color: '#1A1916' }}>{String(v)}</strong></div>)
          : <div style={{ fontSize: 12, color: '#D97757' }}>{en ? 'No date detected' : 'Aucune date détectée'}</div>}
      </Box>
    </>);
  }

  if (/autorit/i.test(name)) {
    return (<>
      <Box label={en ? '<title> tag' : 'Balise <title>'}><div style={{ fontFamily: 'monospace', fontSize: 12, color: '#1A1916' }}>{evidence.metaTitle || <span style={{ color: '#D97757' }}>{en ? 'Not defined' : 'Non définie'}</span>}</div></Box>
      <Box label="Meta description"><div style={{ fontFamily: 'monospace', fontSize: 12, color: '#1A1916' }}>{evidence.metaDescription || <span style={{ color: '#D97757' }}>{en ? 'Not defined' : 'Non définie'}</span>}</div></Box>
      <Box label={en ? 'Social media links detected' : 'Réseaux sociaux détectés'}>
        {evidence.socialLinks?.length > 0
          ? evidence.socialLinks.map((l, i) => <div key={i} style={{ fontSize: 11, fontFamily: 'monospace', color: '#4285F4', marginBottom: 4, wordBreak: 'break-all' }}>{l}</div>)
          : <div style={{ fontSize: 12, color: '#D97757' }}>{en ? 'No social media link found' : 'Aucun lien vers réseaux sociaux'}</div>}
      </Box>
    </>);
  }

  if (/crawlabilit/i.test(name)) {
    return (<>
      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{en ? 'robots.txt content' : 'Contenu de robots.txt'}</div>
      {evidence.robotsTxt && evidence.robotsTxt !== 'Non accessible'
        ? <pre style={{ background: '#1A1916', color: '#F7F5F2', borderRadius: 8, padding: 16, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: '10px 0' }}>{evidence.robotsTxt}</pre>
        : <Box><div style={{ fontSize: 12, color: '#D97757' }}>{en ? 'Not accessible' : 'Non accessible'}</div></Box>}
      <Box label={en ? 'llms.txt file' : 'Fichier llms.txt'}>
        <div style={{ fontSize: 13, fontWeight: 600, color: evidence.hasLlmsTxt ? '#10A37F' : '#D97757' }}>{evidence.hasLlmsTxt ? (en ? '✓ Present' : '✓ Présent') : (en ? '✗ Absent' : '✗ Absent')}</div>
      </Box>
    </>);
  }

  if (/donn.*structur/i.test(name)) {
    if (!evidence.schemas?.length) {
      return <Box label={s.evidenceSchemas}><div style={{ fontSize: 13, fontWeight: 600, color: '#D97757' }}>{en ? 'No JSON-LD schema detected' : 'Aucun schéma JSON-LD détecté'}</div></Box>;
    }
    return (<>
      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{s.evidenceSchemas}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E2DC', borderRadius: 6, overflow: 'hidden' }}>
        <thead><tr style={{ background: '#F7F5F2' }}><th style={{ padding: '7px 10px', textAlign: 'left', fontFamily: 'monospace', fontSize: 9, color: '#6B6762', fontWeight: 400 }}>Type</th><th style={{ padding: '7px 10px', textAlign: 'left', fontFamily: 'monospace', fontSize: 9, color: '#6B6762', fontWeight: 400 }}>{en ? 'Properties' : 'Propriétés'}</th></tr></thead>
        <tbody>{evidence.schemas.map((s2, i) => <tr key={i}><td style={{ padding: '8px 10px', fontFamily: 'monospace', fontSize: 11, color: '#1A1916', borderBottom: '1px solid #F0EDE8' }}>{s2.type}</td><td style={{ padding: '8px 10px', fontSize: 11, color: '#6B6762', borderBottom: '1px solid #F0EDE8' }}>{(s2.properties || []).join(', ')}</td></tr>)}</tbody>
      </table>
    </>);
  }

  if (/neutralit/i.test(name)) {
    return null;
  }

  if (/pr.*sence/i.test(name)) {
    return <Box label={en ? 'Social media links detected' : 'Réseaux sociaux détectés'}>
      {evidence.socialLinks?.length > 0
        ? evidence.socialLinks.map((l, i) => <div key={i} style={{ fontSize: 11, fontFamily: 'monospace', color: '#4285F4', marginBottom: 4, wordBreak: 'break-all' }}>{l}</div>)
        : <div style={{ fontSize: 12, color: '#D97757' }}>{en ? 'No social media link detected' : 'Aucun lien vers réseaux sociaux détecté'}</div>}
    </Box>;
  }

  if (/fra.*cheur/i.test(name)) {
    return <Box label={en ? 'Dates detected in content' : 'Dates détectées dans le contenu'}>
      {evidence.dates && Object.keys(evidence.dates).length > 0
        ? Object.entries(evidence.dates).map(([k, v]) => <div key={k} style={{ fontSize: 12, marginBottom: 4 }}><span style={{ color: '#6B6762' }}>{k}:</span> <strong style={{ color: '#1A1916' }}>{String(v)}</strong></div>)
        : <div style={{ fontSize: 12, color: '#D97757' }}>{en ? 'No date detected' : 'Aucune date détectée'}</div>}
    </Box>;
  }

  return null;
}

// ── Criteria detail label from score ────────────────────────────────────────

function criteriaDetailLabel(c, evidence, locale) {
  const name = c.name.toLowerCase();
  const en = locale === 'en';
  const parts = [];
  if (/extractibilit/i.test(name)) {
    parts.push(en ? 'Content present ✓' : 'Contenu présent ✓');
    if (evidence?.intro) parts.push(en ? 'Good intro' : 'Intro correcte');
    if (evidence?.headings?.length) parts.push(`${evidence.headings.length} ${en ? 'structural elements' : 'éléments de structure'}`);
  } else if (/v.*rifiabilit/i.test(name)) {
    parts.push(en ? 'Verifiable content' : 'Contenu vérifiable');
    const nums = c.detail?.match(/(\d+) donn/)?.[1];
    if (nums) parts.push(`${nums} ${en ? 'data points' : 'données chiffrées'} ✓`);
    if (evidence?.externalLinks === 0) parts.push(en ? 'No external link found ✗' : 'Aucun lien externe identifié ✗');
    else if (evidence?.externalLinks > 0) parts.push(`${evidence.externalLinks} ${en ? 'external links' : 'liens externes'} ✓`);
  } else if (/autorit/i.test(name)) {
    if (evidence?.internalTrustLinks) {
      const tl = evidence.internalTrustLinks;
      if (tl.hasContact) parts.push('Contact ✓');
      if (tl.hasLegal) parts.push(en ? 'Legal notices ✓' : 'Mentions légales ✓');
      if (tl.hasAbout) parts.push(en ? 'About page ✓' : 'Page À propos ✓');
    }
  } else if (/crawlabilit/i.test(name)) {
    // chars count comes from c.detail, not evidence.wordCount
  } else if (/donn.*structur/i.test(name)) {
    if (!evidence?.schemas?.length) parts.push(en ? 'No JSON-LD schema found ✗' : 'Aucun schéma JSON-LD identifié ✗');
    else parts.push(`${evidence.schemas.length} ${en ? 'schema(s) detected' : 'schéma(s) détecté(s)'} ✓`);
  } else if (/neutralit/i.test(name)) {
    // detail comes from Haiku
  } else if (/pr.*sence/i.test(name)) {
    if (evidence?.externalLinks > 0) parts.push(en ? 'External links present ✓' : 'Liens externes présents ✓');
    if (evidence?.internalTrustLinks?.hasPress) parts.push(en ? 'Press mentions ✓' : 'Mentions presse ✓');
  } else if (/fra.*cheur/i.test(name)) {
    if (evidence?.dates?.yearFound) parts.push(`${en ? 'Year present · Recent content' : 'Année présente · Contenu récent'} (${evidence.dates.yearFound}) ✓`);
    if (evidence?.dates?.copyright) parts.push(en ? 'Copyright up to date ✓' : 'Copyright à jour ✓');
  }
  return parts;
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function ReportRouter(props) {
  if (props.reportType === 'pro') return <ProReportPage {...props} />;
  return <OnePageReportPage {...props} />;
}

function OnePageReportPage({ uuid, reportData, url, locale, createdAt, loyaltyCode }) {
  const [downloading, setDownloading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const trackedScrolls = useRef(new Set());
  const startTime = useRef(Date.now());

  const track = useCallback((event) => {
    fetch(`/api/track?id=${uuid}&event=${encodeURIComponent(event)}`).catch(() => {});
  }, [uuid]);

  useEffect(() => { track('open'); }, [track]);

  useEffect(() => {
    const handler = () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      [25, 50, 75, 100].forEach(m => {
        if (pct >= m && !trackedScrolls.current.has(m)) { trackedScrolls.current.add(m); track(`scroll-${m}`); }
      });
    };
    let timer;
    const debounced = () => { clearTimeout(timer); timer = setTimeout(handler, 2000); };
    window.addEventListener('scroll', debounced, { passive: true });
    return () => window.removeEventListener('scroll', debounced);
  }, [track]);

  useEffect(() => {
    const handler = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      navigator.sendBeacon(`/api/track?id=${uuid}&event=${encodeURIComponent(`session-end:${duration}s`)}`);
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [uuid]);

  const handleDownload = async () => {
    setDownloading(true);
    track('click-download-pdf');
    try {
      const res = await fetch(`/api/report-pdf?id=${uuid}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${locale === 'en' ? 'geo-report' : 'rapport-geo'}-${url.replace(/[^a-z0-9]/gi, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch { alert(rs(locale).pdfError); }
    setDownloading(false);
  };

  const score = reportData.score || 0;
  const g = gradeInfo(score, locale);
  const criteria = reportData.criteria || [];
  const recos = reportData.recommendations || [];
  const evidence = reportData.evidence || {};
  const citation = reportData.citationTest || {};
  const citationTests = citation.tests || [];
  const citedCount = citationTests.filter(t => t.cited).length;
  // Projected score: same formula as PDF (oneReportTemplate.js projectedScore)
  let projGain = 0;
  criteria.forEach(c => { if (c.score / c.max < 0.75) projGain += Math.round(c.max * 0.8 - c.score); });
  const projected = Math.min(100, score + Math.round(projGain * 0.7));
  const date = createdAt ? new Date(createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  // Compute 3 weakest criteria for case study display
  const criteriaSorted = criteria.map(c => ({ name: c.name, pct: c.max > 0 ? c.score / c.max : 1 })).sort((a, b) => a.pct - b.pct);
  const weakest3 = new Set(criteriaSorted.slice(0, 3).map(c => c.name));

  // Match recos to criteria
  function matchRecos(criterionName) {
    const name = criterionName.toLowerCase();
    const primary = recos.filter(r => r.criterion && name.includes(r.criterion.toLowerCase()));
    if (primary.length) return primary;
    return recos.filter(r => r.criterion && r.criterion.toLowerCase().split(/[\s&]/)[0].trim().length > 3 && name.includes(r.criterion.toLowerCase().split(/[\s&]/)[0].trim()));
  }

  return (
    <>
      <Head>
        <title>{locale === 'en' ? 'GEO Report' : 'Rapport GEO'} — {url} — {score}/100 | Detekia</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          @media print {
            body { font-size: 11pt !important; line-height: 1.5 !important; }
            header, footer, nav, button,
            [role="banner"], [role="navigation"],
            [class*="cookie"], [class*="modal"], [class*="cta"],
            [id*="cookie"], [id*="modal"] { display: none !important; }
            * { background-color: transparent !important; background-image: none !important; box-shadow: none !important; text-shadow: none !important; }
            body, html { margin: 0 !important; padding: 0 !important; }
            main, [role="main"] { max-width: 100% !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
            section, [class*="card"], [class*="Card"], article, details { page-break-inside: avoid; break-inside: avoid; }
            a { color: #000 !important; text-decoration: underline !important; }
            div[style*="minHeight: 100vh"] { min-height: auto !important; }
          }
        `}</style>
      </Head>

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'system-ui,-apple-system,BlinkMacSystemFont,sans-serif' }}>

        {/* ═══ STICKY HEADER ═══ */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#1A1916', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <a href="https://detekia.fr" style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: '#F7F5F2', fontWeight: 'bold', flexShrink: 0, textDecoration: 'none' }}>Detekia</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#F7F5F2', fontWeight: 'bold', flexShrink: 0 }}>{score}<span style={{ fontSize: 12, color: 'rgba(247,245,242,0.4)' }}>/100</span></span>
            <span style={{ padding: '2px 10px', borderRadius: 20, fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, background: `${g.color}22`, color: g.color, border: `1px solid ${g.color}44`, flexShrink: 0 }}>{g.label}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
          </div>
          <button onClick={handleDownload} disabled={downloading} style={{ background: '#D97757', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'system-ui', opacity: downloading ? 0.6 : 1, flexShrink: 0 }}>
            {downloading ? locale === 'en' ? 'Generating...' : 'Génération...' : locale === 'en' ? '↓ Download PDF' : '↓ Télécharger PDF'}
          </button>
        </header>

        <main role="main" aria-label={locale === 'en' ? 'GEO Report' : 'Rapport GEO'} style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 80px' }}>

          {/* ═══ SECTION 1: SYNTHÈSE EXÉCUTIVE ═══ */}
          <section id="synthese" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{rs(locale).execSummary}</div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 30, color: '#1A1916', letterSpacing: -1, marginBottom: 20, lineHeight: 1.1 }}>{rs(locale).analysisResults}</h1>

            {/* Score hero */}
            <div style={{ background: '#1A1916', borderRadius: 20, padding: '36px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: g.color, opacity: 0.06, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 72, color: '#F7F5F2', lineHeight: 1, letterSpacing: -3 }}>{score}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.3)' }}>/100</div>
                  <div style={{ marginTop: 10, display: 'inline-block', background: `${g.color}22`, border: `1px solid ${g.color}44`, padding: '3px 14px', borderRadius: 20, fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, color: g.color }}>{g.label}</div>
                </div>
                <div style={{ paddingBottom: 4, flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', marginBottom: 6 }}>{url}</div>
                  <div style={{ fontSize: 14, color: 'rgba(247,245,242,0.6)', lineHeight: 1.65 }}>{reportData.verdict}</div>
                </div>
              </div>
            </div>

            {/* 7 criteria table */}
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#1A1916', marginBottom: 14 }}>{rs(locale).the8Criteria}</h2>
            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
              {criteria.map((c, i) => {
                const pct = Math.round((c.score / c.max) * 100);
                const col = pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757';
                const gradeLabel = pct >= 75 ? (locale === 'en' ? 'GOOD' : 'BON') : pct >= 45 ? 'IMPORTANT' : (locale === 'en' ? 'CRITICAL' : 'CRITIQUE');
                return (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <a href={`#critere-${i + 1}`} onClick={() => track(`nav-critere-${i + 1}`)} style={{ fontSize: 13, color: '#1A1916', textDecoration: 'none' }}>{tc(c.name, locale)}</a>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 7px', borderRadius: 4, background: col + '18', color: col }}>{gradeLabel}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: col }}>{c.score}/{c.max}</span>
                      </div>
                    </div>
                    <div style={{ height: 4, background: '#F0EDE8', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top actions */}
            {(() => { const topActions = recos.filter(r => r.priority === 'high').slice(0, 3); return topActions.length > 0 && (<>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#1A1916', marginBottom: 14 }}>{topActions.length} {topActions.length > 1 ? rs(locale).priorityActions_s : rs(locale).priorityAction_s}</h2>
            {topActions.map((a, i) => {
              const pi = priorityInfo(a.impact, locale);
              return (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '14px 16px', background: pi.bg, borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: pi.color, lineHeight: 1, flexShrink: 0, minWidth: 24 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: '#1A1916', marginBottom: 3 }}>{a.title || a.solution?.substring(0, 80)}</div><div style={{ fontSize: 11, color: '#6B6762', lineHeight: 1.5 }}>{tc(a.criterion || '', locale)}</div></div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: pi.color, background: pi.bg, padding: '3px 9px', borderRadius: 12, whiteSpace: 'nowrap', flexShrink: 0, border: `1px solid ${pi.color}33` }}>{pi.label}</div>
                </div>
              );
            })}</>); })()}

            {/* Strengths */}
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#1A1916', marginTop: 20, marginBottom: 14 }}>{locale === 'en' ? 'Identified strengths' : 'Points forts identifiés'}</h2>
            <div style={{ background: '#E8F7F3', border: '1px solid rgba(16,163,127,0.2)', borderRadius: 10, padding: '20px 24px' }}>
              {(reportData.strengths || []).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: '#10A37F', fontSize: 14, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ SECTION 2: CONTEXTE 2026 ═══ */}
          <section id="contexte" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{rs(locale).context2026}</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 12, lineHeight: 1.2 }}>{rs(locale).whyAiMatters}</h2>
            <p style={{ fontSize: 13, color: '#6B6762', lineHeight: 1.7, marginBottom: 20 }}>{rs(locale).whyAiDesc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 20 }}>
              {getCtxCards(locale).map((card, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{card.label}</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: card.color, lineHeight: 1, marginBottom: 6 }}>{card.value}</div>
                  <p style={{ fontSize: 12, color: '#6B6762', lineHeight: 1.6, margin: 0 }}>{card.text} <span style={{ color: '#B0ABA5' }}>({card.source})</span></p>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '18px 20px', marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.7, margin: 0 }} dangerouslySetInnerHTML={{ __html: `<strong>${locale === 'en' ? 'Only 11%' : 'Seulement 11%'}</strong> ${rs(locale).only11.replace(/^[^%]+% /, '')}` }} />
            </div>
            <div style={{ background: '#F7F5F2', borderRadius: 10, padding: '18px 22px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>{rs(locale).academicSource}</div>
              <p style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.65, margin: 0 }}>{rs(locale).academicRef}</p>
            </div>
          </section>

          {/* ═══ SECTION 3: TEST IA ═══ */}
          {citationTests.length > 0 && (
            <section id="test-ia" style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{locale === 'en' ? 'AI Test' : 'Test IA'}</div>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 12, lineHeight: 1.2 }}>{rs(locale).citationTestTitle}</h2>
              <p style={{ fontSize: 13, color: '#6B6762', marginBottom: 20 }}>{rs(locale).citationTestDesc10}</p>

              <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ background: '#1A1916', borderRadius: 14, padding: '20px 28px', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 36, color: '#F7F5F2' }}>{citedCount}/{citationTests.length}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.35)', whiteSpace: 'pre-line' }}>{rs(locale).queriesCite}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
                  {citation.summary?.best_opportunity && <div style={{ background: '#E8F7F3', borderRadius: 10, padding: '12px 16px' }}><div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', marginBottom: 4 }}>{rs(locale).bestOpportunity}</div><div style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.5 }}>{citation.summary.best_opportunity}</div></div>}
                  {citation.summary?.main_blocker && <div style={{ background: 'rgba(217,119,87,0.06)', borderRadius: 10, padding: '12px 16px' }}><div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', marginBottom: 4 }}>{rs(locale).mainBlocker}</div><div style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.5 }}>{citation.summary.main_blocker}</div></div>}
                </div>
              </div>

              {citationTests.map((q, i) => <CitationCard key={i} q={q} locale={locale} />)}

              <div style={{ background: 'rgba(217,119,87,0.06)', borderLeft: '3px solid #D97757', borderRadius: '0 8px 8px 0', padding: '14px 18px', marginTop: 16 }}>
                <p style={{ fontSize: 12, color: '#3A3835', lineHeight: 1.7, margin: 0 }}>{rs(locale).citationDisclaimer}</p>
              </div>
            </section>
          )}

          {/* ═══ SECTION 4: 8 CRITÈRES DÉTAILLÉS ═══ */}
          <section id="criteres" style={{ marginBottom: 48 }}>
            {criteria.map((c, i) => {
              const pct = Math.round((c.score / c.max) * 100);
              const col = pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757';
              const group = criterionGroup(c.name, locale);
              const criterionRecos = matchRecos(c.name);
              const why = lookupMap(getWhy(locale), c.name);
              const guide = lookupMap(getGuides(locale), c.name);
              const caseStudy = lookupMap(getCases(locale), c.name);
              const detailParts = criteriaDetailLabel(c, evidence, locale);
              const isMax = c.score === c.max;

              return (
                <div key={i} id={`critere-${i + 1}`} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24, marginBottom: 20, scrollMarginTop: 70 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase' }}>{group} · {rs(locale).criterion_s} {i + 1} / 8</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#1A1916', margin: 0, lineHeight: 1.2 }}>{tc(c.name, locale)}</h3>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'Georgia,serif', fontSize: 32, color: col, lineHeight: 1 }}>{c.score}<span style={{ fontSize: 14, color: '#C0BBB5' }}>/{c.max}</span></div>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5' }}>{pct}%</div>
                    </div>
                  </div>
                  <div style={{ height: 6, background: '#E5E2DC', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 3 }} />
                  </div>

                  {/* CE QUE NOUS AVONS TROUVÉ */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{rs(locale).whatWeFound}</div>
                    {detailParts.length > 0
                      ? <div style={{ fontSize: 12, color: '#1A1916', marginBottom: 10 }}>{detailParts.join(' · ')}</div>
                      : c.detail && <div style={{ fontSize: 12, color: '#6B6762', marginBottom: 10, lineHeight: 1.5 }}>{c.detail}</div>
                    }
                    <EvidenceBlock criterionName={c.name} evidence={evidence} locale={locale} />
                  </div>

                  {/* POURQUOI C'EST IMPORTANT */}
                  {why && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{locale === 'en' ? 'What it is and why it matters' : "C'est quoi et pourquoi c'est important"}</div>
                      <p style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.75, margin: 0 }}>{why}</p>
                    </div>
                  )}

                  {/* RECOMMENDATIONS */}
                  {isMax || pct >= 75 ? (
                    criterionRecos.length > 0 ? (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{criterionRecos.length > 1 ? rs(locale).recommendations_s : rs(locale).recommendation_s}</div>
                        {criterionRecos.map((r, ri) => <RecoCard key={ri} r={r} index={ri} locale={locale} />)}
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(16,163,127,0.06)', border: '1px solid rgba(16,163,127,0.2)', borderRadius: 8, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <span style={{ fontSize: 18 }}>✓</span>
                        <span style={{ fontSize: 13, color: '#10A37F', fontWeight: 500 }}>{rs(locale).criterionWellOptimized}</span>
                      </div>
                    )
                  ) : criterionRecos.length > 0 ? (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{criterionRecos.length > 1 ? rs(locale).recommendations_s : rs(locale).recommendation_s}</div>
                      {criterionRecos.map((r, ri) => <RecoCard key={ri} r={r} index={ri} locale={locale} />)}
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(201,134,26,0.06)', border: '1px solid rgba(201,134,26,0.2)', borderRadius: 8, padding: '16px 20px', fontSize: 13, color: '#C9861A', lineHeight: 1.6, marginBottom: 16 }}>
                      {rs(locale).criterionNeedsWork} ({pct}%).
                    </div>
                  )}

                  {/* GUIDE TECHNIQUE */}
                  {guide && (
                    <div style={{ background: 'rgba(217,119,87,0.04)', borderLeft: '3px solid #D97757', borderRadius: '0 10px 10px 0', padding: '18px 22px', marginBottom: 16 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>{rs(locale).techGuide}</div>
                      <p style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.8, margin: 0 }}>{guide}</p>
                    </div>
                  )}

                  {/* CAS RÉEL — only on 3 weakest */}
                  {weakest3.has(c.name) && caseStudy && (
                    <div style={{ background: '#E8F7F3', border: '1px solid rgba(16,163,127,0.2)', borderRadius: 10, padding: '18px 22px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>{rs(locale).documentedCase}</div>
                      <p style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.7, margin: 0 }}>{caseStudy}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* ═══ SECTION 5: PLAN D'ACTION COMPLET ═══ */}
          <section id="plan-action" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{locale === 'en' ? 'Action plan' : "Plan d'action"}</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 12, lineHeight: 1.2 }}>{rs(locale).actionSummary}</h2>
            <p style={{ fontSize: 13, color: '#6B6762', marginBottom: 20 }}>{recos.length} {rs(locale).actionSummaryDesc}</p>

            {/* Full action table */}
            <div style={{ overflowX: 'auto', marginBottom: 28 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E2DC', borderRadius: 10, overflow: 'hidden', fontSize: 12 }}>
                <thead><tr style={{ background: '#F7F5F2' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>{locale === 'en' ? 'Priority' : 'Priorité'}</th>
                  <th style={{ ...thStyle, textAlign: 'left' }}>Action</th>
                  <th style={thStyle}>{rs(locale).theCriterion}</th>
                  <th style={thStyle}>Impact</th>
                  <th style={thStyle}>{locale === 'en' ? 'Timeline' : 'Délai'}</th>
                </tr></thead>
                <tbody>{recos.map((r, i) => {
                  const pi = priorityInfo(r.priority, locale);
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #F0EDE8' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'Georgia,serif', fontSize: 14, color: pi.color, textAlign: 'center' }}>{i + 1}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}><span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 4, background: pi.bg, color: pi.color }}>{pi.label}</span></td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#1A1916', lineHeight: 1.5, maxWidth: 400 }}><strong>{r.title}</strong>{r.solution ? ` — ${r.solution.substring(0, 100)}` : ''}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 10, color: '#6B6762', whiteSpace: 'nowrap' }}>{tc(r.criterion || ''  , locale)}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 10, color: pi.color, textAlign: 'center' }}>{r.impact === 'high' ? (locale === 'en' ? 'High' : 'Élevé') : r.impact === 'medium' ? (locale === 'en' ? 'Medium' : 'Moyen') : (locale === 'en' ? 'Low' : 'Faible')}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 10, color: '#6B6762', whiteSpace: 'nowrap', textAlign: 'center' }}>{r.timeframe || ''}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>

            {/* Projected score */}
            <div style={{ background: '#1A1916', borderRadius: 16, padding: '28px 32px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.35)', marginBottom: 4 }}>{rs(locale).currentScore}</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 42, color: '#F7F5F2', lineHeight: 1 }}>{score}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.25)' }}>/100</div>
                </div>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: 'rgba(247,245,242,0.3)' }}>→</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', marginBottom: 4 }}>{rs(locale).projectedScore}</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 42, color: '#10A37F', lineHeight: 1 }}>{projected}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.25)' }}>/100</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.7)', lineHeight: 1.6 }}>{locale === 'en' ? `If all recommendations are implemented, your score should go from ${score}/100 to approximately ${projected}/100.` : `Si toutes les recommandations sont implémentées, votre score devrait passer de ${score}/100 à environ ${projected}/100.`}</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(217,119,87,0.06)', borderLeft: '3px solid #D97757', borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 24 }}>
              <p style={{ fontSize: 11, color: '#3A3835', lineHeight: 1.6, margin: 0 }}>{rs(locale).projectionDisclaimer}</p>
            </div>
          </section>

          {/* ═══ CTA PRO UPSELL ═══ */}
          <section id="upsell-pro" style={{ marginBottom: 28 }}>
            <div style={{ background: '#1A1916', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, marginBottom: 12 }}>{rs(locale).fullAudit}</div>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#F7F5F2', marginBottom: 12, lineHeight: 1.3 }}>{rs(locale).upsellTitle}<br />{rs(locale).upsellTitle2}</h2>
              <p style={{ fontSize: 13, color: 'rgba(247,245,242,0.65)', lineHeight: 1.7, maxWidth: 460, margin: '0 auto 20px' }}>{rs(locale).upsellDesc}</p>
              <a href="https://detekia.fr/pricing" onClick={() => track('click-upsell-pro')}
                style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '14px 36px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                {rs(locale).upsellCta}
              </a>
            </div>
          </section>

          {/* ═══ CTA BEELEVEN ═══ */}
          <section id="beeleven" style={{ marginBottom: 48 }}>
            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, marginBottom: 8 }}>{rs(locale).goFurther}</div>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#1A1916', marginBottom: 10 }}>{rs(locale).beelevenTitle}</h2>
              <p style={{ fontSize: 14, color: '#6B6762', lineHeight: 1.7, marginBottom: 20, maxWidth: 480, margin: '0 auto 20px' }}>{rs(locale).beelevenDesc}</p>
              <button onClick={() => { track('click-beeleven'); setShowContact(true); }}
                style={{ display: 'inline-block', background: 'transparent', color: '#D97757', padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 600, border: '1px solid #D97757', cursor: 'pointer', fontFamily: 'system-ui' }}>
                Discutons-en →
              </button>
            </div>
          </section>

          {/* ═══ MÉTHODOLOGIE COMPLÈTE ═══ */}
          <section id="methodologie" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{rs(locale).transparency}</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 20, lineHeight: 1.2 }}>{rs(locale).methodologyH2}</h2>

            <div style={{ background: 'rgba(217,119,87,0.06)', borderLeft: '3px solid #D97757', borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#D97757', marginBottom: 4 }}>{rs(locale).analysisLimits}</div>
              <p style={{ fontSize: 11, color: '#3A3835', lineHeight: 1.5, margin: 0 }}>{rs(locale).analysisLimitsDesc}</p>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24 }}>
              <p style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.75, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: rs(locale).methodologyP1 }} />
              <p style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.75, marginBottom: 16 }}>{rs(locale).methodologyP2}</p>
              <p style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.75, marginBottom: 16 }}>{rs(locale).methodologyScoreCalc}</p>

              {/* 7 criteria table */}
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>{rs(locale).the8CriteriaWeights}</div>
              <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E2DC', borderRadius: 6, overflow: 'hidden', fontSize: 11 }}>
                  <thead><tr style={{ background: '#F7F5F2' }}>
                    <th style={{ padding: '7px 10px', textAlign: 'left', fontFamily: 'monospace', fontSize: 9, color: '#6B6762', fontWeight: 400 }}>{rs(locale).theCriterion}</th>
                    <th style={{ padding: '7px 10px', textAlign: 'center', fontFamily: 'monospace', fontSize: 9, color: '#6B6762', fontWeight: 400 }}>{rs(locale).weight}</th>
                    <th style={{ padding: '7px 10px', textAlign: 'left', fontFamily: 'monospace', fontSize: 9, color: '#6B6762', fontWeight: 400 }}>{rs(locale).measured}</th>
                  </tr></thead>
                  <tbody>{getMethodologyTable(locale).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F0EDE8' }}>
                      <td style={{ padding: '6px 10px', color: '#1A1916' }}>{row.name}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'center', fontFamily: 'monospace', color: '#D97757' }}>{row.weight}</td>
                      <td style={{ padding: '6px 10px', color: '#6B6762' }}>{row.measured}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>

              <div style={{ background: '#F7F5F2', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 1, marginBottom: 6 }}>{rs(locale).academicSourceLabel}</div>
                <p style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.5, margin: 0 }}>{rs(locale).academicRef}</p>
              </div>

              <div style={{ background: 'rgba(217,119,87,0.06)', borderLeft: '3px solid #D97757', borderRadius: '0 8px 8px 0', padding: '12px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#D97757', marginBottom: 4 }}>{rs(locale).reportLimits}</div>
                <p style={{ fontSize: 11, color: '#3A3835', lineHeight: 1.5, margin: 0 }}>{rs(locale).reportLimitsDesc}</p>
              </div>
            </div>
          </section>

          {/* ═══ REPORT A PROBLEM ═══ */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <a
              href={`mailto:hello@detekia.fr?subject=${encodeURIComponent((locale === 'en' ? 'Problem with report' : 'Problème avec le rapport') + ` — ${url} — Score ${score}/100 — https://detekia.fr/r/${uuid}`)}`}
              style={{ fontSize: 11, color: '#B0ABA5', textDecoration: 'underline', fontFamily: 'system-ui, sans-serif' }}
            >
              {locale === 'en' ? 'Report a problem with this report' : 'Signaler un problème avec ce rapport'}
            </a>
          </div>

          {/* ═══ FOOTER ═══ */}
          <footer style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid #E5E2DC' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', marginBottom: 4 }}>{rs(locale).reportGenerated} {date}</div>
            <div style={{ fontSize: 11, color: '#B0ABA5' }}>Beeleven SASU · hello@detekia.fr · <a href="https://detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>detekia.fr</a></div>
          </footer>
        </main>
      </div>
      <BeelevenContactModal open={showContact} onClose={() => setShowContact(false)} prefillUrl={url || ''} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRO REPORT TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════

function ProReportPage({ uuid, proReport, url, locale, createdAt }) {
  const [downloading, setDownloading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const trackedScrolls = useRef(new Set());
  const startTime = useRef(Date.now());

  const track = useCallback((event) => {
    fetch(`/api/track?id=${uuid}&event=${encodeURIComponent(event)}`).catch(() => {});
  }, [uuid]);

  useEffect(() => { track('open'); }, [track]);
  useEffect(() => {
    const handler = () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      [25, 50, 75, 100].forEach(m => {
        if (pct >= m && !trackedScrolls.current.has(m)) { trackedScrolls.current.add(m); track(`scroll-${m}`); }
      });
    };
    let timer;
    const debounced = () => { clearTimeout(timer); timer = setTimeout(handler, 2000); };
    window.addEventListener('scroll', debounced, { passive: true });
    return () => window.removeEventListener('scroll', debounced);
  }, [track]);
  useEffect(() => {
    const handler = () => {
      const dur = Math.round((Date.now() - startTime.current) / 1000);
      navigator.sendBeacon(`/api/track?id=${uuid}&event=${encodeURIComponent(`session-end:${dur}s`)}`);
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [uuid]);

  const handleDownload = async () => {
    setDownloading(true);
    track('click-download-pdf');
    try {
      const res = await fetch(`/api/report-pdf?id=${uuid}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${locale === 'en' ? 'geo-report-full' : 'rapport-geo-complet'}-${url.replace(/[^a-z0-9]/gi, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch { alert(rs(locale).pdfError); }
    setDownloading(false);
  };

  const r = proReport;
  const g = gradeInfo(r.scoreAverage, locale);
  const totalPages = r.pagesValid + (r.pagesWithError || 0);
  const date = createdAt ? new Date(createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const criteriaAverages = r.criteriaAverages || {};
  const pages = r.pages || [];
  const validPages = pages.filter(p => !p.error);
  const errorPages = pages.filter(p => p.error);
  const patterns = r.patterns || [];
  const actionPlan = r.actionPlan || [];
  const ct = r.citationTestConsolidated || {};
  const queries = ct.queries || [];
  const citedCount = queries.filter(q => q.cited).length;

  // Collect all recos from all pages, group by criterion, apply Sonnet merge titles
  const recosByCriterion = {};
  validPages.forEach(p => {
    (p.recommendations || []).forEach(rec => {
      const crit = rec.criterion || 'Autre';
      if (!recosByCriterion[crit]) recosByCriterion[crit] = [];
      // If Sonnet merged this title, use the canonical title for dedup
      const effectiveTitle = rec._mergedTitle || rec.title;
      recosByCriterion[crit].push({ ...rec, title: effectiveTitle, _pageUrl: p.url });
    });
  });

  const CRITERIA_NAMES = [
    'Citabilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T',
    'Accessibilite IA', 'Neutralite editoriale',
    'Presence externe', 'Fraicheur & signaux temporels',
    // Legacy fallbacks
    'Extractibilite & reponse directe', 'Crawlabilite IA', 'Donnees structurees', 'Fraicheur & maintenance',
  ];

  // 3 weakest criteria
  const critSorted = CRITERIA_NAMES.map(name => {
    const d = criteriaAverages[name] || { avgScore: 0, max: 1 };
    return { name, pct: d.max > 0 ? d.avgScore / d.max : 1 };
  }).sort((a, b) => a.pct - b.pct);
  const weakest3 = new Set(critSorted.slice(0, 3).map(c => c.name));

  // Map arbitrary Claude criterion names to standard 7 criteria
  const CRITERION_KEYWORDS = {
    'Citabilite & reponse directe': ['citabilit', 'extractib', 'reponse directe', 'contenu detaille', 'contenu complet', 'contenu et clarte', 'profondeur', 'contenu technique', 'answer capsule', 'front-loading'],
    'Verifiabilite & preuves': ['verifiab', 'preuves', 'sources', 'citations', 'donnees chiffrees'],
    'Autorite & E-E-A-T': ['autorit', 'e-e-a-t', 'eeat', 'expertise', 'credibilit'],
    'Accessibilite IA': ['accessibilit', 'crawlab', 'indexab', 'robots', 'seo technique', 'performance technique', 'meta description', 'canonique', 'optimisation technique'],
    'Neutralite editoriale': ['neutralit', 'editorial', 'equilibre', 'marketing', 'promotionnel', 'engagement'],
    'Presence externe': ['presence ext', 'backlink', 'mention', 'externe'],
    'Fraicheur & signaux temporels': ['fraicheur', 'fraich', 'maintenance', 'mise a jour', 'temporel', 'date'],
  };

  function matchCriterionName(recoCriterion) {
    const norm = recoCriterion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const [standard, keywords] of Object.entries(CRITERION_KEYWORDS)) {
      for (const kw of keywords) {
        if (norm.includes(kw)) return standard;
      }
    }
    return null;
  }

  // Aggressive normalization: strip articles, accents, punctuation, action verbs, short words
  const STOP_WORDS = 'le|la|les|de|du|des|et|en|un|une|pour|sur|dans|par|a|au|aux|l|d|s|ce|son|sa|ses|se|ne|pas|plus|avec|qui|que|est|sont|ou|nos|vos|leur|leurs|cette|ces|tout|tous|toute|toutes|aussi|bien|tres|trop|peu|encore|deja|ici|mais|donc';
  const ACTION_VERBS = 'ajouter|implementer|mettre|creer|developper|optimiser|ameliorer|renforcer|enrichir|structurer|etablir|configurer|integrer|rendre|affiner|amplifier|adapter|reduire|gerer|planifier|reecrire|sourcer|presenter';

  function dedupKey(text) {
    return (text || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(new RegExp(`\\b(${STOP_WORDS})\\b`, 'g'), '')
      .replace(new RegExp(`\\b(${ACTION_VERBS})\\b`, 'g'), '')
      .replace(/\s+/g, ' ').trim()
      .split(' ').filter(w => w.length > 2).sort().join(' ');
  }

  function dedupRecos(criterionName) {
    const matched = [];
    for (const [crit, recs] of Object.entries(recosByCriterion)) {
      const mappedCrit = matchCriterionName(crit);
      if (mappedCrit === criterionName) matched.push(...recs);
    }
    // Layer 1: Group by patternId (if present from Haiku prompt)
    // Layer 2: Fuzzy title matching as fallback
    const deduped = [];
    const patternMap = {}; // patternId → index in deduped
    const keyMap = {};     // dedupKey → index in deduped
    for (const rec of matched) {
      const pid = rec.patternId && rec.patternId !== 'other' ? rec.patternId : null;

      // Try patternId match first
      let matchedIdx = pid ? patternMap[pid] : undefined;

      // Fallback: fuzzy title match
      if (matchedIdx === undefined) {
        const key = dedupKey(rec.title || '');
        matchedIdx = keyMap[key];
        if (matchedIdx === undefined) {
          const keyWords = new Set(key.split(' ').filter(w => w.length > 2));
          if (keyWords.size > 0) {
            for (const [existingKey, idx] of Object.entries(keyMap)) {
              const existingWords = new Set(existingKey.split(' ').filter(w => w.length > 2));
              const overlap = [...keyWords].filter(w => existingWords.has(w)).length;
              const maxSize = Math.max(keyWords.size, existingWords.size);
              if (maxSize > 0 && overlap / maxSize >= 0.5) { matchedIdx = idx; break; }
            }
          }
        }
      }
      if (matchedIdx !== undefined) {
        const existing = deduped[matchedIdx];
        if (!existing._pages.includes(rec._pageUrl)) existing._pages.push(rec._pageUrl);
        if ((rec.problem || '').length > (existing.problem || '').length) {
          Object.assign(existing, { ...rec, _pages: existing._pages });
        }
        continue;
      }
      const newIdx = deduped.length;
      const key = dedupKey(rec.title || '');
      keyMap[key] = newIdx;
      if (pid) patternMap[pid] = newIdx;
      deduped.push({ ...rec, _pages: [rec._pageUrl] });
    }
    deduped.sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] ?? 1) - ({ high: 0, medium: 1, low: 2 }[b.priority] ?? 1));
    return deduped;
  }

  // Projected score
  let projGain = 0;
  CRITERIA_NAMES.forEach(name => {
    const d = criteriaAverages[name];
    if (d && d.avgScore / d.max < 0.75) projGain += Math.round(d.max * 0.8 - d.avgScore);
  });
  const projected = Math.min(100, r.scoreAverage + Math.round(projGain * 0.7));

  return (
    <>
      <Head>
        <title>{locale === 'en' ? 'Full GEO Report' : 'Rapport GEO Complet'} — {url} — {r.scoreAverage}/100 | Detekia</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          @media print {
            body { font-size: 11pt !important; line-height: 1.5 !important; }
            header, footer, nav, button,
            [role="banner"], [role="navigation"],
            [class*="cookie"], [class*="modal"], [class*="cta"],
            [id*="cookie"], [id*="modal"] { display: none !important; }
            * { background-color: transparent !important; background-image: none !important; box-shadow: none !important; text-shadow: none !important; }
            body, html { margin: 0 !important; padding: 0 !important; }
            main, [role="main"] { max-width: 100% !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
            section, [class*="card"], [class*="Card"], article, details { page-break-inside: avoid; break-inside: avoid; }
            a { color: #000 !important; text-decoration: underline !important; }
            div[style*="minHeight: 100vh"] { min-height: auto !important; }
          }
        `}</style>
      </Head>

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'system-ui,-apple-system,BlinkMacSystemFont,sans-serif' }}>

        {/* STICKY HEADER */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#1A1916', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <a href="https://detekia.fr" style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: '#F7F5F2', fontWeight: 'bold', flexShrink: 0, textDecoration: 'none' }}>Detekia</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#F7F5F2', fontWeight: 'bold', flexShrink: 0 }}>{r.scoreAverage}<span style={{ fontSize: 12, color: 'rgba(247,245,242,0.4)' }}>/100</span></span>
            <span style={{ padding: '2px 10px', borderRadius: 20, fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, background: `${g.color}22`, color: g.color, border: `1px solid ${g.color}44`, flexShrink: 0 }}>{g.label}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url} · {totalPages} pages</span>
          </div>
          <button onClick={handleDownload} disabled={downloading} style={{ background: '#D97757', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'system-ui', opacity: downloading ? 0.6 : 1, flexShrink: 0 }}>
            {downloading ? locale === 'en' ? 'Generating...' : 'Génération...' : locale === 'en' ? '↓ Download PDF' : '↓ Télécharger PDF'}
          </button>
        </header>

        <main role="main" aria-label={locale === 'en' ? 'GEO Report' : 'Rapport GEO'} style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 80px' }}>

          {/* ═══ PARTIE 1: VUE D'ENSEMBLE ═══ */}
          <section id="synthese" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{rs(locale).execSummary}</div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 30, color: '#1A1916', letterSpacing: -1, marginBottom: 20, lineHeight: 1.1 }}>{rs(locale).analysisResults}</h1>

            {/* Score hero */}
            <div style={{ background: '#1A1916', borderRadius: 20, padding: '36px 32px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: g.color, opacity: 0.06, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 72, color: '#F7F5F2', lineHeight: 1, letterSpacing: -3 }}>{r.scoreAverage}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.25)' }}>/100 — {rs(locale).siteAvgScore}</div>
                  <div style={{ marginTop: 10, display: 'inline-block', background: `${g.color}22`, border: `1px solid ${g.color}44`, padding: '3px 14px', borderRadius: 20, fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, color: g.color }}>{g.label}</div>
                </div>
                <div style={{ paddingBottom: 4, flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', marginBottom: 6 }}>{url} — {totalPages} {rs(locale).pagesAnalyzed}</div>
                </div>
              </div>
            </div>

            {/* Executive summary */}
            {r.executiveSummary && (
              <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.75, marginBottom: 24 }}>
                {r.executiveSummary.split('\n').filter(Boolean).map((p, i) => <p key={i} style={{ marginBottom: 10 }}>{p}</p>)}
              </div>
            )}

            {/* 7 criteria table */}
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#1A1916', marginBottom: 14 }}>{rs(locale).the8Criteria}</h2>
            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
              {CRITERIA_NAMES.map((name, i) => {
                const d = criteriaAverages[name] || { avgScore: 0, max: 1 };
                const pct = Math.round((d.avgScore / d.max) * 100);
                const col = pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757';
                const below = validPages.filter(p => { const c = (p.criteria || []).find(c => c.name === name); return c && (c.score / c.max) < 0.75; }).length;
                return (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <a href={`#critere-${i + 1}`} onClick={() => track(`nav-critere-${i + 1}`)} style={{ fontSize: 13, color: '#1A1916', textDecoration: 'none' }}>{tc(name, locale)}</a>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {below > 0 && <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757' }}>{below}/{validPages.length} {rs(locale).belowThreshold}</span>}
                        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: col }}>{d.avgScore}/{d.max}</span>
                      </div>
                    </div>
                    <div style={{ height: 4, background: '#F0EDE8', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top actions + strengths/weaknesses */}
            {(() => { const topActs = actionPlan.slice(0, 3); return topActs.length > 0 && (<>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#1A1916', marginBottom: 14 }}>{topActs.length} {topActs.length > 1 ? rs(locale).priorityActions_s : rs(locale).priorityAction_s}</h2>
            {topActs.map((a, i) => {
              const pi = priorityInfo(a.impact === 'eleve' ? 'high' : a.impact === 'moyen' ? 'medium' : a.impact === 'faible' ? 'low' : a.impact, locale);
              return (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '14px 16px', background: pi.bg, borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: pi.color, lineHeight: 1, flexShrink: 0, minWidth: 24 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: '#1A1916', marginBottom: 3 }}>{a.action}</div><div style={{ fontSize: 11, color: '#6B6762' }}>{tc(a.criterion || '', locale)}</div></div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: pi.color, padding: '3px 9px', borderRadius: 12, border: `1px solid ${pi.color}33`, background: pi.bg, flexShrink: 0 }}>{pi.label}</div>
                </div>
              );
            })}</>); })()}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 20 }}>
              <div style={{ background: '#E8F7F3', border: '1px solid rgba(16,163,127,0.2)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{locale === 'en' ? 'Strengths' : 'Points forts'}</div>
                {(r.topStrengths || []).map((s, i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: '#10A37F', flexShrink: 0 }}>✓</span><span style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.5 }}>{s}</span></div>)}
              </div>
              <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{locale === 'en' ? 'Weaknesses' : 'Points faibles'}</div>
                {(r.topWeaknesses || []).map((s, i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: '#D97757', flexShrink: 0 }}>✗</span><span style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.5 }}>{s}</span></div>)}
              </div>
            </div>
          </section>

          {/* ═══ CONTEXTE 2026 (same as one-page) ═══ */}
          <section id="contexte" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{rs(locale).context2026}</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 12, lineHeight: 1.2 }}>{rs(locale).whyAiMatters}</h2>
            <p style={{ fontSize: 13, color: '#6B6762', lineHeight: 1.7, marginBottom: 20 }}>{rs(locale).whyAiDescShort}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 20 }}>
              {getCtxCards(locale).map((card, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{card.label}</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: card.color, lineHeight: 1, marginBottom: 6 }}>{card.value}</div>
                  <p style={{ fontSize: 12, color: '#6B6762', lineHeight: 1.6, margin: 0 }}>{card.text} <span style={{ color: '#B0ABA5' }}>({card.source})</span></p>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '18px 20px', marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.7, margin: 0 }} dangerouslySetInnerHTML={{ __html: `<strong>${locale === 'en' ? 'Only 11%' : 'Seulement 11%'}</strong> ${rs(locale).only11Short.replace(/^[^%]+% /, '')}` }} />
            </div>
            <div style={{ background: '#F7F5F2', borderRadius: 10, padding: '18px 22px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>{rs(locale).academicSourceShort}</div>
              <p style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.65, margin: 0 }}>"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024.</p>
            </div>
          </section>

          {/* ═══ PARTIE 2: TEST IA CONSOLIDÉ 30 REQUÊTES ═══ */}
          {queries.length > 0 && (
            <section id="test-ia" style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{rs(locale).testIaConsolidated}</div>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 12, lineHeight: 1.2 }}>{rs(locale).testIa30}</h2>
              <p style={{ fontSize: 13, color: '#6B6762', marginBottom: 20 }}>{rs(locale).citationTestDesc30}</p>

              <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ background: '#1A1916', borderRadius: 14, padding: '20px 28px', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 36, color: '#F7F5F2' }}>{citedCount}/{queries.length}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.35)', whiteSpace: 'pre-line' }}>{rs(locale).queriesCite}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
                  {ct.bestOpportunity && <div style={{ background: '#E8F7F3', borderRadius: 10, padding: '12px 16px' }}><div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', marginBottom: 4 }}>{rs(locale).bestOpportunity}</div><div style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.5 }}>{ct.bestOpportunity}</div></div>}
                  {ct.mainBlocker && <div style={{ background: 'rgba(217,119,87,0.06)', borderRadius: 10, padding: '12px 16px' }}><div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', marginBottom: 4 }}>{rs(locale).mainBlocker}</div><div style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.5 }}>{ct.mainBlocker}</div></div>}
                </div>
              </div>

              {queries.map((q, i) => <CitationCard key={i} q={q} locale={locale} />)}

              <div style={{ background: 'rgba(217,119,87,0.06)', borderLeft: '3px solid #D97757', borderRadius: '0 8px 8px 0', padding: '14px 18px', marginTop: 16 }}>
                <p style={{ fontSize: 12, color: '#3A3835', lineHeight: 1.7, margin: 0 }}>{rs(locale).citationDisclaimerShort}</p>
              </div>
            </section>
          )}

          {/* ═══ PARTIE 3: 8 CRITÈRES ═══ */}
          <section id="criteres" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{rs(locale).detailedAnalysis}</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 24, lineHeight: 1.2 }}>{rs(locale).the8Criteria}</h2>

            {CRITERIA_NAMES.map((criterionName, idx) => {
              const avgData = criteriaAverages[criterionName] || { avgScore: 0, max: 1 };
              const pct = Math.round((avgData.avgScore / avgData.max) * 100);
              const col = pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757';
              const why = lookupMap(getWhy(locale), criterionName);
              const guide = lookupMap(getGuides(locale), criterionName);
              const caseStudy = lookupMap(getCases(locale), criterionName);
              const deduped = dedupRecos(criterionName);
              const below = validPages.filter(p => { const c = (p.criteria || []).find(c => c.name === criterionName); return c && (c.score / c.max) < 0.75; }).length;
              const cc = (r.criteriaConsolidated || []).find(c => c.criterion === criterionName) || {};

              return (
                <div key={idx} id={`critere-${idx + 1}`} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24, marginBottom: 20, scrollMarginTop: 70 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 2, textTransform: 'uppercase' }}>{rs(locale).criterion_s} {idx + 1} / 8</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#1A1916', margin: 0, lineHeight: 1.2 }}>{tc(criterionName, locale)}</h3>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'Georgia,serif', fontSize: 32, color: col, lineHeight: 1 }}>{avgData.avgScore}<span style={{ fontSize: 14, color: '#C0BBB5' }}>/{avgData.max}</span></div>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5' }}>{pct}% — {rs(locale).average}</div>
                    </div>
                  </div>
                  <div style={{ height: 6, background: '#E5E2DC', borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 3 }} />
                  </div>

                  {below > 0 && <div style={{ fontSize: 12, color: '#6B6762', marginBottom: 16 }}>{below}/{validPages.length} {rs(locale).pagesBelowThreshold}</div>}

                  {/* Consolidated synthesis */}
                  {cc.synthesis && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{rs(locale).whatWeFound}</div>
                      <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.65 }}>{cc.synthesis}</div>
                    </div>
                  )}

                  {why && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{locale === 'en' ? 'What it is and why it matters' : "C'est quoi et pourquoi c'est important"}</div>
                      <p style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.75, margin: 0 }}>{why}</p>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{rs(locale).recommendations_s} ({deduped.length})</div>
                    {deduped.length > 0 ? deduped.map((rec, ri) => (
                      <ProRecoCard key={ri} r={rec} index={ri} rootUrl={url} locale={locale} />
                    )) : pct >= 75 ? (
                      <div style={{ background: 'rgba(16,163,127,0.06)', border: '1px solid rgba(16,163,127,0.2)', borderRadius: 8, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 18 }}>✓</span>
                        <span style={{ fontSize: 13, color: '#10A37F', fontWeight: 500 }}>{rs(locale).criterionWellOptimizedSite}</span>
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(201,134,26,0.06)', border: '1px solid rgba(201,134,26,0.2)', borderRadius: 8, padding: '16px 20px', fontSize: 13, color: '#C9861A', lineHeight: 1.6 }}>
                        {rs(locale).criterionNeedsWork} ({pct}%). {rs(locale).criterionNeedsWorkSuffix}
                      </div>
                    )}
                  </div>

                  {guide && (
                    <div style={{ background: 'rgba(217,119,87,0.04)', borderLeft: '3px solid #D97757', borderRadius: '0 10px 10px 0', padding: '18px 22px', marginBottom: 16 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>{rs(locale).techGuide}</div>
                      <p style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.8, margin: 0 }}>{guide}</p>
                    </div>
                  )}

                  {weakest3.has(criterionName) && caseStudy && (
                    <div style={{ background: '#E8F7F3', border: '1px solid rgba(16,163,127,0.2)', borderRadius: 10, padding: '18px 22px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>{rs(locale).documentedCase}</div>
                      <p style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.7, margin: 0 }}>{caseStudy}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* ═══ PARTIE 4: PATTERNS INTER-PAGES ═══ */}
          {patterns.length > 0 && (
            <section id="patterns" style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{rs(locale).patternsDetected}</div>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 20, lineHeight: 1.2 }}>{locale === 'en' ? 'Cross-page patterns' : 'Patterns transverses'}</h2>
              {patterns.map((p, i) => {
                const sevStyle = String(p.severity || '').toLowerCase().includes('critique') ? { bg: 'rgba(217,119,87,0.12)', color: '#D97757', label: locale === 'en' ? 'CRITICAL' : 'CRITIQUE' }
                  : String(p.severity || '').toLowerCase().includes('important') ? { bg: 'rgba(201,134,26,0.12)', color: '#C9861A', label: 'IMPORTANT' }
                  : { bg: 'rgba(16,163,127,0.12)', color: '#10A37F', label: locale === 'en' ? 'MINOR' : 'MINEUR' };
                return (
                  <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '16px 20px', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, letterSpacing: 1, background: sevStyle.bg, color: sevStyle.color }}>{sevStyle.label}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762' }}>{tc(p.criterion || '', locale)}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.6, marginBottom: 6 }}>{p.pattern}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762' }}>{(p.pagesAffected || []).length} {rs(locale).pagesAffected}</div>
                  </div>
                );
              })}
            </section>
          )}

          {/* ═══ PARTIE 5: PLAN D'ACTION ═══ */}
          <section id="plan-action" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{locale === 'en' ? 'Site action plan' : "Plan d'action site"}</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 12, lineHeight: 1.2 }}>{rs(locale).consolidatedActions}</h2>
            <p style={{ fontSize: 13, color: '#6B6762', marginBottom: 20 }}>{actionPlan.length} {rs(locale).actionsClassified}</p>

            {actionPlan.map((a, i) => {
              const pi = priorityInfo(a.impact === 'eleve' ? 'high' : a.impact === 'moyen' ? 'medium' : a.impact === 'faible' ? 'low' : a.impact, locale);
              const ei = effortInfo(a.effort === 'eleve' ? 'high' : a.effort === 'moyen' ? 'medium' : a.effort === 'faible' ? 'low' : a.effort, locale);
              return (
                <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '16px 20px', marginBottom: 8, borderLeft: `4px solid ${pi.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: pi.color, minWidth: 24 }}>{i + 1}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 4, background: pi.bg, color: pi.color }}>{pi.label}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762' }}>{tc(a.criterion || '', locale)}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, marginLeft: 'auto', color: ei.color }}>{ locale === 'en' ? 'Effort: ' : 'Effort : '}{ei.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.6 }}>{a.action}</div>
                </div>
              );
            })}

            {/* Projected score */}
            <div style={{ background: '#1A1916', borderRadius: 16, padding: '28px 32px', marginTop: 28, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.35)', marginBottom: 4 }}>{rs(locale).currentScore}</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 42, color: '#F7F5F2', lineHeight: 1 }}>{r.scoreAverage}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.25)' }}>/100</div>
                </div>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: 'rgba(247,245,242,0.3)' }}>→</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', marginBottom: 4 }}>{rs(locale).projectedScore}</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 42, color: '#10A37F', lineHeight: 1 }}>{projected}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.25)' }}>/100</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.7)', lineHeight: 1.6 }}>{rs(locale).projectionText} {r.scoreAverage} {rs(locale).projectionTo} {projected}/100.</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(217,119,87,0.06)', borderLeft: '3px solid #D97757', borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 24 }}>
              <p style={{ fontSize: 11, color: '#3A3835', lineHeight: 1.6, margin: 0 }}>{rs(locale).projectionDisclaimerShort}</p>
            </div>

            {/* CTA Beeleven */}
            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, marginBottom: 8 }}>{rs(locale).goFurther}</div>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#1A1916', marginBottom: 10 }}>{rs(locale).beelevenTitle}</h3>
              <p style={{ fontSize: 14, color: '#6B6762', lineHeight: 1.7, marginBottom: 20, maxWidth: 480, margin: '0 auto 20px' }}>{rs(locale).beelevenDesc}</p>
              <button onClick={() => { track('click-beeleven'); setShowContact(true); }} style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '14px 36px', borderRadius: 10, fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'system-ui' }}>{rs(locale).beelevenCta}</button>
            </div>
          </section>

          {/* ═══ PARTIE 6: ANNEXE BILAN PAR PAGE (enrichie) ═══ */}
          <section id="annexe" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{rs(locale).appendix}</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 20, lineHeight: 1.2 }}>{rs(locale).pageByPageReview}</h2>

            {validPages.map((p, i) => {
              const sc = gradeInfo(p.score || 0, locale);
              const sortedCriteria = [...(p.criteria || [])].sort((a, b) => (a.score / a.max) - (b.score / b.max));
              const top3Weak = sortedCriteria.filter(c => c.score < c.max).slice(0, 3);
              const top3Recos = (p.recommendations || []).filter(rec => rec.priority === 'high').slice(0, 3);
              if (top3Recos.length < 3) top3Recos.push(...(p.recommendations || []).filter(rec => rec.priority === 'medium').slice(0, 3 - top3Recos.length));

              return (
                <div key={i} id={`page-${i}`} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24, marginBottom: 16 }}>
                  {/* Page header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'monospace', fontSize: 12, color: '#D97757', textDecoration: 'none', wordBreak: 'break-all' }}>{(p.url || '').replace(url, '') || '/'}</a>
                    <span style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 'bold', color: sc.color, marginLeft: 'auto', flexShrink: 0 }}>{p.score}<span style={{ fontSize: 12, color: '#C0BBB5' }}>/100</span></span>
                    <span style={{ padding: '3px 10px', borderRadius: 12, fontFamily: 'monospace', fontSize: 9, letterSpacing: 1, background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </div>

                  {/* 7 criteria scores */}
                  <div style={{ marginBottom: 16 }}>
                    {(p.criteria || []).map((c, ci) => {
                      const cpct = c.max > 0 ? Math.round((c.score / c.max) * 100) : 0;
                      const ccol = cpct >= 75 ? '#10A37F' : cpct >= 45 ? '#C9861A' : '#D97757';
                      return (
                        <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: '#1A1916', minWidth: 200 }}>{tc(c.name, locale)}</span>
                          <div style={{ flex: 1, height: 4, background: '#F0EDE8', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${cpct}%`, background: ccol, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: ccol, minWidth: 40, textAlign: 'right' }}>{c.score}/{c.max}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Top 3 points faibles */}
                  {top3Weak.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{locale === 'en' ? 'Weaknesses' : 'Points faibles'}</div>
                      {top3Weak.map((c, ci) => {
                        const cpct = Math.round((c.score / c.max) * 100);
                        return <div key={ci} style={{ fontSize: 11, color: '#3A3835', marginBottom: 3 }}>• {tc(c.name, locale)} — {c.score}/{c.max} ({cpct}%)</div>;
                      })}
                    </div>
                  )}

                  {/* Top 3 actions pour cette page */}
                  {top3Recos.length > 0 && (
                    <div>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{rs(locale).priorityActions}</div>
                      {top3Recos.map((rec, ri) => (
                        <div key={ri} style={{ fontSize: 11, color: '#1A1916', lineHeight: 1.4, marginBottom: 4, paddingLeft: 10, borderLeft: '2px solid #E5E2DC' }}>
                          {rec.title || rec.problem?.substring(0, 80) || rec.solution?.substring(0, 80)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {errorPages.length > 0 && (
              <div style={{ marginTop: 12, fontSize: 12, color: '#D97757' }}>
                {errorPages.length} {rs(locale).pagesNotAnalyzable}: {errorPages.map(p => p.url).join(', ')}
              </div>
            )}
          </section>

          {/* ═══ PARTIE 7: MÉTHODOLOGIE ═══ */}
          <section id="methodologie" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{rs(locale).transparency}</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 20, lineHeight: 1.2 }}>{rs(locale).methodologyH2}</h2>

            <div style={{ background: 'rgba(217,119,87,0.06)', borderLeft: '3px solid #D97757', borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#D97757', marginBottom: 4 }}>{rs(locale).analysisLimits}</div>
              <p style={{ fontSize: 11, color: '#3A3835', lineHeight: 1.5, margin: 0 }}>{rs(locale).analysisLimitsDesc}</p>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: 24 }}>
              <p style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.75, marginBottom: 16 }}>{rs(locale).methodologyP1Pro.replace('{n}', String(totalPages))}</p>

              <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E2DC', borderRadius: 6, overflow: 'hidden', fontSize: 11 }}>
                  <thead><tr style={{ background: '#F7F5F2' }}>
                    <th style={{ padding: '7px 10px', textAlign: 'left', fontFamily: 'monospace', fontSize: 9, color: '#6B6762', fontWeight: 400 }}>{rs(locale).theCriterion}</th>
                    <th style={{ padding: '7px 10px', textAlign: 'center', fontFamily: 'monospace', fontSize: 9, color: '#6B6762', fontWeight: 400 }}>{rs(locale).weight}</th>
                    <th style={{ padding: '7px 10px', textAlign: 'left', fontFamily: 'monospace', fontSize: 9, color: '#6B6762', fontWeight: 400 }}>{rs(locale).measured}</th>
                  </tr></thead>
                  <tbody>{getMethodologyTable(locale).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F0EDE8' }}>
                      <td style={{ padding: '6px 10px', color: '#1A1916' }}>{row.name}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'center', fontFamily: 'monospace', color: '#D97757' }}>{row.weight}</td>
                      <td style={{ padding: '6px 10px', color: '#6B6762' }}>{row.measured}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>

              <div style={{ background: '#F7F5F2', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 1, marginBottom: 6 }}>{rs(locale).academicSourceLabel}</div>
                <p style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.5, margin: 0 }}>"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024.</p>
              </div>

              <div style={{ fontSize: 10, color: '#B0ABA5' }}>{rs(locale).scope}: {totalPages} {rs(locale).pagesAnalyzed} {locale === 'en' ? 'on' : 'sur'} {url}. {rs(locale).aggregatedScore}</div>
            </div>
          </section>

          {/* Report a problem */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <a
              href={`mailto:hello@detekia.fr?subject=${encodeURIComponent((locale === 'en' ? 'Problem with report' : 'Problème avec le rapport') + ` — ${url} — Score ${r.scoreAverage}/100 — https://detekia.fr/r/${uuid}`)}`}
              style={{ fontSize: 11, color: '#B0ABA5', textDecoration: 'underline', fontFamily: 'system-ui, sans-serif' }}
            >
              {locale === 'en' ? 'Report a problem with this report' : 'Signaler un problème avec ce rapport'}
            </a>
          </div>

          {/* Footer */}
          <footer style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid #E5E2DC' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', marginBottom: 4 }}>{rs(locale).reportGenerated} {date}</div>
            <div style={{ fontSize: 11, color: '#B0ABA5' }}>Beeleven SASU · hello@detekia.fr · <a href="https://detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>detekia.fr</a></div>
          </footer>
        </main>
      </div>
      <BeelevenContactModal open={showContact} onClose={() => setShowContact(false)} prefillUrl={url || ''} />
    </>
  );
}

// Pro reco card with _pages list
function ProRecoCard({ r, index, rootUrl, locale }) {
  const pi = priorityInfo(r.priority, locale);
  const ei = effortInfo(r.effort, locale);
  const pagesList = r._pages || [];
  const pagesNoteJsx = pagesList.length > 1
    ? <div style={{ marginTop: 8 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B6762', marginBottom: 4 }}>{pagesList.length} {rs(locale).pagesAffected}:</div>
        {pagesList.map((u, i) => <div key={i}><a href={u} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', textDecoration: 'none' }}>{u.replace(rootUrl, '') || '/'}</a></div>)}
      </div>
    : pagesList[0]
      ? <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 10, color: '#6B6762' }}>{rs(locale).pageLabel}: <a href={pagesList[0]} target="_blank" rel="noopener noreferrer" style={{ color: '#D97757', textDecoration: 'none' }}>{pagesList[0]}</a></div>
      : null;

  return (
    <div style={{ border: `1px solid ${pi.color}28`, borderLeft: `4px solid ${pi.color}`, borderRadius: '0 14px 14px 0', overflow: 'hidden', marginBottom: 12 }}>
      <div style={{ padding: '12px 18px 10px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 6, background: pi.bg, color: pi.color }}>{pi.label}</span>
        {r.title && <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1916' }}>{r.title}</span>}
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8' }}>#{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div style={{ padding: '12px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
          {r.impact && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, background: pi.bg, color: pi.color }}>Impact {r.impact === 'high' ? (locale === 'en' ? 'High' : 'Élevé') : r.impact === 'medium' ? (locale === 'en' ? 'Medium' : 'Moyen') : (locale === 'en' ? 'Low' : 'Faible')}</span>}
          {r.effort && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, background: `${ei.color}18`, color: ei.color }}>Effort {ei.label}</span>}
          {r.timeframe && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, background: '#F7F5F2', color: '#6B6762', border: '1px solid #E5E2DC' }}>{r.timeframe}</span>}
        </div>
        {r.problem && <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, fontWeight: 700, color: '#D97757', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{rs(locale).theProblem}</div><div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.55 }}>{r.problem}</div></div>}
        {r.solution && <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, fontWeight: 700, color: '#10A37F', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{rs(locale).theSolution}</div><div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.55 }}>{r.solution}</div></div>}
        {r.technicalImplementation && (
          <div style={{ background: '#F7F5F2', borderRadius: 8, padding: '12px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1A1916', marginBottom: 6 }}>{rs(locale).techImplementation}</div>
            {Array.isArray(r.technicalImplementation)
              ? <ol style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.5, margin: 0, paddingLeft: 20 }}>{r.technicalImplementation.map((s, si) => <li key={si} style={{ marginBottom: 4 }}>{String(s).replace(/^\d+\.\s*/, '')}</li>)}</ol>
              : <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.5 }}>{r.technicalImplementation}</div>}
          </div>
        )}
        {r.codeExample && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1A1916', marginBottom: 5 }}>&lt;/&gt; {locale === 'en' ? 'Code example' : 'Exemple de code'}</div>
            <pre style={{ background: '#1A1916', color: '#F7F5F2', borderRadius: 8, padding: 14, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflow: 'auto', maxHeight: 300 }}>{r.codeExample}</pre>
          </div>
        )}
        {pagesNoteJsx}
      </div>
    </div>
  );
}

const thStyle = { padding: '9px 12px', fontFamily: 'monospace', fontSize: 9, color: '#6B6762', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 400, textAlign: 'center', whiteSpace: 'nowrap' };

// ── Sub-components ──────────────────────────────────────────────────────────

function CitationCard({ q, locale }) {
  const [open, setOpen] = useState(false);
  const cited = q.cited
    ? { bg: 'rgba(16,163,127,0.12)', color: '#10A37F', label: rs(locale).citedLabel, icon: '✓' }
    : { bg: 'rgba(217,119,87,0.12)', color: '#D97757', label: rs(locale).notCitedLabel, icon: '✗' };
  const typeLabel = q.difficulty === 'generic' ? rs(locale).genericLabel : q.difficulty === 'niche' ? 'NICHE' : rs(locale).longTailLabel;
  const competitors = q.competitors_cited || q.competitorsCited || [];

  return (
    <div onClick={() => setOpen(!open)} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '14px 18px', marginBottom: 8, cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, background: cited.bg, color: cited.color }}>{cited.icon} {cited.label}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5' }}>{typeLabel}</span>
        {q.difficulty_to_rank && <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B6762', marginLeft: 'auto' }}>{rs(locale).difficultyLabel}: {q.difficulty_to_rank}</span>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', marginTop: 6 }}>{q.query}</div>
      {/* Competitors always visible when present */}
      {competitors.length > 0 && (
        <div style={{ fontSize: 11, color: '#6B6762', marginTop: 4 }}>{q.cited ? locale === 'en' ? 'Cited with you' : 'Cités avec vous' : locale === 'en' ? 'Cited instead of you' : 'Cités à votre place'} : {competitors.join(', ')}</div>
      )}
      {open && (
        <div style={{ paddingTop: 10, marginTop: 8, borderTop: '1px solid #F0EDE8' }}>
          {q.ai_response_excerpt && <div style={{ fontSize: 11, color: '#6B6762', fontStyle: 'italic', marginBottom: 6, background: '#FAFAF9', padding: '8px 12px', borderRadius: 6 }}>{q.ai_response_excerpt}</div>}
          {q.recommendation && <div style={{ fontSize: 12, color: '#3A3835', lineHeight: 1.5 }}><strong>{rs(locale).recommendationLabel}:</strong> {q.recommendation}</div>}
        </div>
      )}
    </div>
  );
}

function RecoCard({ r, index, locale }) {
  const pi = priorityInfo(r.priority, locale);
  const ei = effortInfo(r.effort, locale);

  return (
    <div style={{ border: `1px solid ${pi.color}28`, borderLeft: `4px solid ${pi.color}`, borderRadius: '0 14px 14px 0', overflow: 'hidden', marginBottom: 12 }}>
      <div style={{ padding: '12px 18px 10px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 6, background: pi.bg, color: pi.color }}>{pi.label}</span>
        {r.title && <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1916' }}>{r.title}</span>}
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8' }}>#{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div style={{ padding: '12px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
          {r.impact && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, background: pi.bg, color: pi.color }}>Impact {r.impact === 'high' ? (locale === 'en' ? 'High' : 'Élevé') : r.impact === 'medium' ? (locale === 'en' ? 'Medium' : 'Moyen') : (locale === 'en' ? 'Low' : 'Faible')}</span>}
          {r.effort && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, background: `${ei.color}18`, color: ei.color }}>Effort {ei.label}</span>}
          {r.timeframe && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, background: '#F7F5F2', color: '#6B6762', border: '1px solid #E5E2DC' }}>{r.timeframe}</span>}
        </div>
        {r.problem && <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, fontWeight: 700, color: '#D97757', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{rs(locale).theProblem}</div><div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.55 }}>{r.problem}</div></div>}
        {r.solution && <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, fontWeight: 700, color: '#10A37F', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{rs(locale).theSolution}</div><div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.55 }}>{r.solution}</div></div>}
        {r.technicalImplementation && (
          <div style={{ background: '#F7F5F2', borderRadius: 8, padding: '12px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1A1916', marginBottom: 6 }}>{rs(locale).techImplementation}</div>
            {Array.isArray(r.technicalImplementation)
              ? <ol style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.5, margin: 0, paddingLeft: 20 }}>{r.technicalImplementation.map((s, si) => <li key={si} style={{ marginBottom: 4 }}>{String(s).replace(/^\d+\.\s*/, '')}</li>)}</ol>
              : <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.5 }}>{r.technicalImplementation}</div>}
          </div>
        )}
        {r.codeExample && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1A1916', marginBottom: 5 }}>&lt;/&gt; {locale === 'en' ? 'Code example' : 'Exemple de code'}</div>
            <pre style={{ background: '#1A1916', color: '#F7F5F2', borderRadius: 8, padding: 14, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflow: 'auto', maxHeight: 300 }}>{r.codeExample}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
