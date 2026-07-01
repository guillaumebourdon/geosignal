/**
 * Evidence-based recommendations — personalized using scan data, 0 API cost.
 * Each reco cites the exact numbers found on the page.
 */

function plural(n, singular, pluralForm) {
  return n <= 1 ? `${n} ${singular}` : `${n} ${pluralForm || singular + 's'}`;
}

function buildCitabilityReco(c, ev) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const h2Count = ev?.headings?.filter(h => h.level === 'h2').length || 0;
  const h3Count = ev?.headings?.filter(h => h.level === 'h3').length || 0;
  const wordCount = ev?.wordCount || 0;
  const hasIntro = (ev?.intro || '').length > 50;

  if (pct < 50) {
    const problems = [];
    if (h2Count === 0) problems.push('aucun titre H2 détecté');
    else if (h2Count < 3) problems.push(`seulement ${plural(h2Count, 'titre H2', 'titres H2')}`);
    if (wordCount < 300) problems.push(`contenu très court (${plural(wordCount, 'mot')})`);
    if (!hasIntro) problems.push('pas d\'introduction directe');

    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: 'Restructurer votre contenu pour les réponses IA',
      diagnostic: `Votre page a ${plural(h2Count, 'titre H2', 'titres H2')} et ${plural(wordCount, 'mot')}${problems.length ? '. Problèmes : ' + problems.join(', ') : ''}. Les IA extraient des capsules de 15-70 mots après chaque H2/H3 — sans structure, elles n'ont rien à citer.`,
      action: h2Count === 0
        ? 'Ajoutez au moins 4-5 sous-titres H2 qui répondent aux questions clés de vos visiteurs. Après chaque H2, écrivez un paragraphe de 2-3 phrases qui résume la réponse.'
        : `Vos ${h2Count} titres H2 existent mais manquent de capsules de réponse. Après chaque H2, ajoutez 2-3 phrases qui répondent directement à la question du titre.`,
      impact: 'Les pages avec des réponses directes bien structurées sont citées 2-3× plus par ChatGPT.',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: 'Optimiser la citabilité de vos contenus',
    diagnostic: `Votre page a ${plural(h2Count, 'titre H2', 'titres H2')}, ${plural(h3Count, 'H3')} et ${plural(wordCount, 'mot')} — une base correcte. Mais les IA cherchent des réponses frontloadées (conclusion en premier, détails après).`,
    action: 'Réécrivez l\'ouverture de chaque section en commençant par le fait principal. Ajoutez des listes à puces pour les points clés et des tableaux pour les comparaisons.',
    impact: 'Le front-loading augmente la probabilité de citation IA de 30-40% (Princeton, 2024).',
  };
}

function buildVerifiabilityReco(c, ev) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const extLinks = ev?.externalLinks || 0;
  const hasDates = !!(ev?.dates?.datePublished || ev?.dates?.dateModified);

  if (pct < 50) {
    const missing = [];
    if (extLinks === 0) missing.push('aucun lien externe sourcé');
    else if (extLinks < 3) missing.push(`seulement ${plural(extLinks, 'lien externe', 'liens externes')}`);
    if (!hasDates) missing.push('aucune date de publication visible');

    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: 'Ajouter des preuves vérifiables à votre page',
      diagnostic: `Votre page manque de données vérifiables : ${missing.join(', ')}. Les IA privilégient les contenus qu'elles peuvent recouper avec d'autres sources.`,
      action: 'Ajoutez au minimum : 3 données chiffrées avec leurs sources (études, rapports), des dates précises, et des liens vers des références externes autoritaires.',
      impact: 'Les pages avec données chiffrées sont citées 2,8× plus par les IA (AirOps, 2026).',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: 'Enrichir vos preuves et sources',
    diagnostic: `Votre page a ${plural(extLinks, 'lien externe', 'liens externes')} — un début, mais les IA valorisent la densité de preuves. Plus vous sourcez, plus vous êtes cité.`,
    action: 'Ajoutez des tableaux de données comparatives, des citations d\'experts nommés avec leur titre, et des liens vers des études récentes.',
    impact: 'Chaque source vérifiable supplémentaire renforce la confiance des IA dans votre contenu.',
  };
}

function buildAuthorityReco(c, ev) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const schemas = ev?.schemas?.map(s => Array.isArray(s.type) ? s.type[0] : s.type) || [];
  const hasOrg = schemas.some(t => t === 'Organization' || t === 'LocalBusiness');
  const hasPerson = schemas.some(t => t === 'Person');
  const trustLinks = ev?.internalTrustLinks || [];
  const hasAbout = trustLinks.some(l => /about|a-propos|qui-sommes/i.test(l.url));
  const hasContact = trustLinks.some(l => /contact/i.test(l.url));
  const hasLegal = trustLinks.some(l => /legal|mentions/i.test(l.url));

  if (pct < 50) {
    const missing = [];
    if (!hasOrg) missing.push('pas de schéma Organization JSON-LD');
    if (!hasPerson) missing.push('pas de schéma Person (auteur)');
    if (!hasAbout) missing.push('pas de page À propos liée');
    if (!hasContact && !hasLegal) missing.push('pas de page contact ou mentions légales liée');

    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: 'Établir votre autorité en ligne',
      diagnostic: `Votre site manque de signaux d'autorité : ${missing.join(', ')}. Les IA vérifient l'identité et la crédibilité de la source avant de citer.`,
      action: missing.includes('pas de schéma Organization JSON-LD')
        ? 'Priorité 1 : ajoutez un schéma JSON-LD Organization avec name, url, logo, contactPoint. Priorité 2 : créez ou liez une page À propos détaillée avec votre expertise.'
        : 'Enrichissez votre page À propos avec une biographie détaillée, vos certifications et votre expérience. Ajoutez un schéma Person avec sameAs vers vos profils sociaux.',
      impact: 'Les signaux E-E-A-T sont un facteur majeur de citation par les IA, surtout pour les contenus YMYL.',
    };
  }

  const existingSignals = [];
  if (hasOrg) existingSignals.push('Organization');
  if (hasPerson) existingSignals.push('Person');
  if (hasAbout) existingSignals.push('page À propos');

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: 'Renforcer vos signaux d\'expertise',
    diagnostic: `Votre site a des bases d'autorité (${existingSignals.join(', ') || 'quelques signaux détectés'}) mais peut aller plus loin.`,
    action: !hasPerson
      ? 'Ajoutez un schéma Person JSON-LD pour l\'auteur principal avec sameAs vers LinkedIn et les réseaux sociaux professionnels.'
      : 'Ajoutez des témoignages clients vérifiables et des logos partenaires/clients sur votre page d\'accueil.',
    impact: 'Un profil auteur complet augmente significativement la confiance des IA dans vos contenus.',
  };
}

function buildAccessibilityReco(c, ev) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const robotsTxt = ev?.robotsTxt || '';
  const hasLlmsTxt = ev?.hasLlmsTxt || false;
  const wordCount = ev?.wordCount || 0;

  const blockedBots = [];
  if (/disallow.*GPTBot/i.test(robotsTxt)) blockedBots.push('GPTBot (ChatGPT)');
  if (/disallow.*ClaudeBot/i.test(robotsTxt) || /disallow.*anthropic/i.test(robotsTxt)) blockedBots.push('ClaudeBot');
  if (/disallow.*Google-Extended/i.test(robotsTxt)) blockedBots.push('Google-Extended (Gemini)');

  if (pct < 50) {
    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: 'Débloquer l\'accès de votre site aux IA',
      diagnostic: blockedBots.length > 0
        ? `Votre robots.txt bloque activement ${blockedBots.join(', ')}. Ces bots ne peuvent pas crawler votre contenu, donc les IA ne peuvent pas vous citer.`
        : `Votre site a des problèmes d'accessibilité pour les crawlers IA (${wordCount < 200 ? 'contenu trop court pour être indexé' : 'configuration technique restrictive'}).`,
      action: blockedBots.length > 0
        ? `Modifiez votre robots.txt pour autoriser les bots IA : supprimez les lignes "Disallow" pour ${blockedBots.join(', ')}. C'est le fix le plus impactant que vous puissiez faire.`
        : 'Vérifiez que votre contenu est rendu en HTML serveur (pas uniquement en JavaScript client), ajoutez un attribut lang sur <html>, et soumettez un sitemap.xml.',
      impact: '73% des sites bloquent les bots IA sans le savoir (Otterly.AI, 2026). Débloquer l\'accès est souvent le fix le plus impactant.',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: 'Optimiser l\'accessibilité technique pour les IA',
    diagnostic: `Votre site est accessible aux crawlers IA${hasLlmsTxt ? ' et dispose d\'un fichier llms.txt' : ' mais n\'a pas de fichier llms.txt'}. ${wordCount > 0 ? `Contenu détecté : ${plural(wordCount, 'mot')}.` : ''}`,
    action: hasLlmsTxt
      ? 'Votre configuration est bonne. Vérifiez que votre sitemap.xml est à jour et que vos pages principales sont bien indexées.'
      : 'Ajoutez un fichier llms.txt à la racine de votre site pour guider les IA sur votre contenu le plus pertinent.',
    impact: 'Une meilleure accessibilité technique facilite l\'indexation par les modèles de langage.',
  };
}

function buildNeutralityReco(c, ev) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  if (pct < 50) {
    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: 'Réduire le langage promotionnel',
      diagnostic: 'Votre contenu utilise un ton trop marketing avec des superlatifs non sourcés. Les IA pénalisent les pages qui ressemblent à de la publicité plutôt qu\'à de l\'information.',
      action: 'Faites un search-and-replace : remplacez chaque "le meilleur", "n°1", "leader", "révolutionnaire" par un fait vérifiable ("utilisé par X clients", "noté X/5 sur Y avis", "depuis XXXX").',
      impact: 'Un ton factuel et neutre augmente la probabilité que les IA vous citent comme source fiable.',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: 'Affiner l\'objectivité de votre contenu',
    diagnostic: 'Votre contenu est globalement factuel mais contient encore quelques formulations qui pourraient être perçues comme promotionnelles par les IA.',
    action: 'Relisez votre page en cherchant les affirmations non sourcées. Pour chacune, ajoutez une donnée chiffrée, une source ou un lien externe qui la soutient.',
    impact: 'Chaque affirmation sourcée renforce la crédibilité de l\'ensemble de la page aux yeux des IA.',
  };
}

function buildExternalPresenceReco(c, ev) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const socialLinks = ev?.socialLinks || [];
  const extLinks = ev?.externalLinks || 0;
  const socialPlatforms = socialLinks.map(l => {
    if (l.includes('linkedin')) return 'LinkedIn';
    if (l.includes('twitter') || l.includes('x.com')) return 'X/Twitter';
    if (l.includes('facebook')) return 'Facebook';
    if (l.includes('instagram')) return 'Instagram';
    if (l.includes('youtube')) return 'YouTube';
    if (l.includes('tiktok')) return 'TikTok';
    return null;
  }).filter(Boolean);

  if (pct < 50) {
    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: 'Développer votre présence externe',
      diagnostic: `Votre page a ${plural(socialLinks.length, 'lien social', 'liens sociaux')} et ${plural(extLinks, 'lien externe', 'liens externes')}. C'est insuffisant — les IA valorisent les sites connectés à un écosystème web plus large.`,
      action: socialLinks.length === 0
        ? 'Ajoutez des liens vers vos profils sociaux actifs (LinkedIn, X, YouTube au minimum) dans le footer ou la page À propos.'
        : `Vous avez ${socialPlatforms.join(', ')} — complétez avec les plateformes manquantes et ajoutez des liens sortants vers des sources autoritaires dans votre contenu.`,
      impact: 'Les backlinks et mentions externes sont le facteur n°1 de visibilité IA selon plusieurs études.',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: 'Renforcer votre écosystème de liens',
    diagnostic: `Votre page est liée à ${socialPlatforms.length > 0 ? socialPlatforms.join(', ') : plural(socialLinks.length, 'réseau social', 'réseaux sociaux')} et a ${plural(extLinks, 'lien externe', 'liens externes')}.`,
    action: 'Ajoutez des témoignages clients avec liens vers leurs sites, des logos partenaires, et citez des sources externes autoritaires dans votre contenu.',
    impact: 'Chaque mention externe supplémentaire augmente votre autorité perçue par les IA.',
  };
}

function buildFreshnessReco(c, ev) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const dates = ev?.dates || {};
  const currentYear = new Date().getFullYear().toString();
  const hasDateModified = !!dates.dateModified;
  const hasDatePublished = !!dates.datePublished;
  const copyright = dates.copyright || '';
  const copyrightCurrent = copyright.includes(currentYear);

  if (pct < 50) {
    const problems = [];
    if (!hasDateModified) problems.push('pas de dateModified en JSON-LD');
    if (!hasDatePublished) problems.push('pas de datePublished');
    if (copyright && !copyrightCurrent) problems.push(`copyright de ${copyright} (pas ${currentYear})`);
    if (!copyright) problems.push('aucun copyright détecté');

    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: 'Ajouter des signaux de fraîcheur à votre page',
      diagnostic: `Votre page n'a aucun signal de mise à jour récente : ${problems.join(', ')}. Les IA favorisent fortement le contenu récent.`,
      action: hasDatePublished
        ? `Ajoutez "dateModified": "${new Date().toISOString().split('T')[0]}" dans votre schéma JSON-LD existant, et mettez le copyright à jour (${currentYear}).`
        : `Ajoutez un bloc JSON-LD avec datePublished et dateModified. Mettez votre copyright à ${currentYear}. Mentionnez des données de l'année en cours dans votre contenu.`,
      impact: '65% des visites de bots IA ciblent du contenu des 12 derniers mois (Seer Interactive, 2025).',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: 'Renforcer les signaux de mise à jour',
    diagnostic: `Votre page a ${hasDateModified ? 'un dateModified (' + dates.dateModified.slice(0, 10) + ')' : hasDatePublished ? 'un datePublished mais pas de dateModified' : 'quelques signaux temporels'}${copyrightCurrent ? '' : copyright ? ', copyright de ' + copyright : ''}.`,
    action: !hasDateModified
      ? 'Ajoutez dateModified dans votre JSON-LD — c\'est le signal le plus important pour indiquer aux IA que votre contenu est à jour.'
      : `Mettez à jour vos données chiffrées et vos sources avec les chiffres les plus récents disponibles. La date seule ne suffit pas — le contenu doit refléter la fraîcheur.`,
    impact: 'Les IA favorisent le contenu récent et régulièrement mis à jour.',
  };
}

/**
 * Generate evidence-based recommendations from criteria scores + evidence data.
 * @param {Array} criteria - Array of { name, score, max, detail }
 * @param {Object} evidence - Evidence object from collectEvidence()
 * @returns {Array} - Array of personalized recommendation objects
 */
export function generateTemplateRecos(criteria, evidence = {}) {
  if (!Array.isArray(criteria)) return [];

  const builders = {
    'Citabilite & reponse directe': buildCitabilityReco,
    'Verifiabilite & preuves': buildVerifiabilityReco,
    'Autorite & E-E-A-T': buildAuthorityReco,
    'Accessibilite IA': buildAccessibilityReco,
    'Neutralite editoriale': buildNeutralityReco,
    'Presence externe': buildExternalPresenceReco,
    'Fraicheur & signaux temporels': buildFreshnessReco,
  };

  const recos = [];
  for (const c of criteria) {
    const builder = builders[c.name];
    if (!builder) continue;
    const reco = builder(c, evidence);
    if (reco) recos.push(reco);
  }

  // Sort: critical first, then by score ascending
  recos.sort((a, b) => {
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (a.priority !== 'high' && b.priority === 'high') return 1;
    return a.scorePercent - b.scorePercent;
  });

  return recos;
}
