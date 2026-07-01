/**
 * Evidence-based recommendations — personalized using scan data, 0 API cost.
 * Each reco cites the exact numbers found on the page.
 */

function plural(n, singular, pluralForm) {
  return n <= 1 ? `${n} ${singular}` : `${n} ${pluralForm || singular + 's'}`;
}

function buildCitabilityReco(c, ev, locale) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const en = locale === 'en';
  const h2Count = ev?.headings?.filter(h => h.level === 'h2').length || 0;
  const h3Count = ev?.headings?.filter(h => h.level === 'h3').length || 0;
  const wordCount = ev?.wordCount || 0;
  const hasIntro = (ev?.intro || '').length > 50;

  if (pct < 50) {
    const problems = [];
    if (en) {
      if (h2Count === 0) problems.push('no H2 headings detected');
      else if (h2Count < 3) problems.push(`only ${plural(h2Count, 'H2 heading')}`);
      if (wordCount < 300) problems.push(`very short content (${plural(wordCount, 'word')})`);
      if (!hasIntro) problems.push('no direct introduction');
    } else {
      if (h2Count === 0) problems.push('aucun titre H2 détecté');
      else if (h2Count < 3) problems.push(`seulement ${plural(h2Count, 'titre H2', 'titres H2')}`);
      if (wordCount < 300) problems.push(`contenu très court (${plural(wordCount, 'mot')})`);
      if (!hasIntro) problems.push('pas d\'introduction directe');
    }

    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: en ? 'Restructure your content for AI answers' : 'Restructurer votre contenu pour les réponses IA',
      diagnostic: en
        ? `Your page has ${plural(h2Count, 'H2 heading')} and ${plural(wordCount, 'word')}${problems.length ? '. Issues: ' + problems.join(', ') : ''}. AIs extract 15-70 word capsules after each H2/H3 — without structure, they have nothing to cite.`
        : `Votre page a ${plural(h2Count, 'titre H2', 'titres H2')} et ${plural(wordCount, 'mot')}${problems.length ? '. Problèmes : ' + problems.join(', ') : ''}. Les IA extraient des capsules de 15-70 mots après chaque H2/H3 — sans structure, elles n'ont rien à citer.`,
      action: en
        ? (h2Count === 0
          ? 'Add at least 4-5 H2 subheadings that answer your visitors\' key questions. After each H2, write a 2-3 sentence paragraph that summarizes the answer.'
          : `Your ${h2Count} H2 headings exist but lack answer capsules. After each H2, add 2-3 sentences that directly answer the heading\'s question.`)
        : (h2Count === 0
          ? 'Ajoutez au moins 4-5 sous-titres H2 qui répondent aux questions clés de vos visiteurs. Après chaque H2, écrivez un paragraphe de 2-3 phrases qui résume la réponse.'
          : `Vos ${h2Count} titres H2 existent mais manquent de capsules de réponse. Après chaque H2, ajoutez 2-3 phrases qui répondent directement à la question du titre.`),
      impact: en
        ? 'Pages with well-structured direct answers are cited 2-3x more by ChatGPT.'
        : 'Les pages avec des réponses directes bien structurées sont citées 2-3× plus par ChatGPT.',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: en ? 'Optimize your content citability' : 'Optimiser la citabilité de vos contenus',
    diagnostic: en
      ? `Your page has ${plural(h2Count, 'H2 heading')}, ${plural(h3Count, 'H3')} and ${plural(wordCount, 'word')} — a decent base. But AIs look for front-loaded answers (conclusion first, details after).`
      : `Votre page a ${plural(h2Count, 'titre H2', 'titres H2')}, ${plural(h3Count, 'H3')} et ${plural(wordCount, 'mot')} — une base correcte. Mais les IA cherchent des réponses frontloadées (conclusion en premier, détails après).`,
    action: en
      ? 'Rewrite the opening of each section by leading with the main fact. Add bullet lists for key points and tables for comparisons.'
      : 'Réécrivez l\'ouverture de chaque section en commençant par le fait principal. Ajoutez des listes à puces pour les points clés et des tableaux pour les comparaisons.',
    impact: en
      ? 'Front-loading increases AI citation probability by 30-40% (Princeton, 2024).'
      : 'Le front-loading augmente la probabilité de citation IA de 30-40% (Princeton, 2024).',
  };
}

function buildVerifiabilityReco(c, ev, locale) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const en = locale === 'en';
  const extLinks = ev?.externalLinks || 0;
  const hasDates = !!(ev?.dates?.datePublished || ev?.dates?.dateModified);

  if (pct < 50) {
    const missing = [];
    if (en) {
      if (extLinks === 0) missing.push('no sourced external links');
      else if (extLinks < 3) missing.push(`only ${plural(extLinks, 'external link')}`);
      if (!hasDates) missing.push('no visible publication date');
    } else {
      if (extLinks === 0) missing.push('aucun lien externe sourcé');
      else if (extLinks < 3) missing.push(`seulement ${plural(extLinks, 'lien externe', 'liens externes')}`);
      if (!hasDates) missing.push('aucune date de publication visible');
    }

    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: en ? 'Add verifiable evidence to your page' : 'Ajouter des preuves vérifiables à votre page',
      diagnostic: en
        ? `Your page lacks verifiable data: ${missing.join(', ')}. AIs favor content they can cross-reference with other sources.`
        : `Votre page manque de données vérifiables : ${missing.join(', ')}. Les IA privilégient les contenus qu'elles peuvent recouper avec d'autres sources.`,
      action: en
        ? 'Add at minimum: 3 data points with their sources (studies, reports), precise dates, and links to authoritative external references.'
        : 'Ajoutez au minimum : 3 données chiffrées avec leurs sources (études, rapports), des dates précises, et des liens vers des références externes autoritaires.',
      impact: en
        ? 'Pages with quantified data are cited 2.8x more by AIs (AirOps, 2026).'
        : 'Les pages avec données chiffrées sont citées 2,8× plus par les IA (AirOps, 2026).',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: en ? 'Enrich your evidence and sources' : 'Enrichir vos preuves et sources',
    diagnostic: en
      ? `Your page has ${plural(extLinks, 'external link')} — a start, but AIs value evidence density. The more you source, the more you get cited.`
      : `Votre page a ${plural(extLinks, 'lien externe', 'liens externes')} — un début, mais les IA valorisent la densité de preuves. Plus vous sourcez, plus vous êtes cité.`,
    action: en
      ? 'Add comparative data tables, named expert quotes with their titles, and links to recent studies.'
      : 'Ajoutez des tableaux de données comparatives, des citations d\'experts nommés avec leur titre, et des liens vers des études récentes.',
    impact: en
      ? 'Each additional verifiable source strengthens AI confidence in your content.'
      : 'Chaque source vérifiable supplémentaire renforce la confiance des IA dans votre contenu.',
  };
}

function buildAuthorityReco(c, ev, locale) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const en = locale === 'en';
  const schemas = ev?.schemas?.map(s => Array.isArray(s.type) ? s.type[0] : s.type) || [];
  const hasOrg = schemas.some(t => t === 'Organization' || t === 'LocalBusiness');
  const hasPerson = schemas.some(t => t === 'Person');
  const trustLinks = ev?.internalTrustLinks || [];
  const hasAbout = trustLinks.some(l => /about|a-propos|qui-sommes/i.test(l.url));
  const hasContact = trustLinks.some(l => /contact/i.test(l.url));
  const hasLegal = trustLinks.some(l => /legal|mentions/i.test(l.url));

  if (pct < 50) {
    const missing = [];
    if (en) {
      if (!hasOrg) missing.push('no Organization JSON-LD schema');
      if (!hasPerson) missing.push('no Person (author) schema');
      if (!hasAbout) missing.push('no linked About page');
      if (!hasContact && !hasLegal) missing.push('no linked contact or legal page');
    } else {
      if (!hasOrg) missing.push('pas de schéma Organization JSON-LD');
      if (!hasPerson) missing.push('pas de schéma Person (auteur)');
      if (!hasAbout) missing.push('pas de page À propos liée');
      if (!hasContact && !hasLegal) missing.push('pas de page contact ou mentions légales liée');
    }

    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: en ? 'Establish your online authority' : 'Établir votre autorité en ligne',
      diagnostic: en
        ? `Your site lacks authority signals: ${missing.join(', ')}. AIs verify the identity and credibility of the source before citing.`
        : `Votre site manque de signaux d'autorité : ${missing.join(', ')}. Les IA vérifient l'identité et la crédibilité de la source avant de citer.`,
      action: en
        ? (missing.includes('no Organization JSON-LD schema')
          ? 'Priority 1: add a JSON-LD Organization schema with name, url, logo, contactPoint. Priority 2: create or link a detailed About page with your expertise.'
          : 'Enrich your About page with a detailed biography, your certifications and experience. Add a Person schema with sameAs linking to your social profiles.')
        : (missing.includes('pas de schéma Organization JSON-LD')
          ? 'Priorité 1 : ajoutez un schéma JSON-LD Organization avec name, url, logo, contactPoint. Priorité 2 : créez ou liez une page À propos détaillée avec votre expertise.'
          : 'Enrichissez votre page À propos avec une biographie détaillée, vos certifications et votre expérience. Ajoutez un schéma Person avec sameAs vers vos profils sociaux.'),
      impact: en
        ? 'E-E-A-T signals are a major factor in AI citation, especially for YMYL content.'
        : 'Les signaux E-E-A-T sont un facteur majeur de citation par les IA, surtout pour les contenus YMYL.',
    };
  }

  const existingSignals = [];
  if (hasOrg) existingSignals.push('Organization');
  if (hasPerson) existingSignals.push('Person');
  if (hasAbout) existingSignals.push(en ? 'About page' : 'page À propos');

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: en ? 'Strengthen your expertise signals' : 'Renforcer vos signaux d\'expertise',
    diagnostic: en
      ? `Your site has authority foundations (${existingSignals.join(', ') || 'some signals detected'}) but can go further.`
      : `Votre site a des bases d'autorité (${existingSignals.join(', ') || 'quelques signaux détectés'}) mais peut aller plus loin.`,
    action: en
      ? (!hasPerson
        ? 'Add a Person JSON-LD schema for the main author with sameAs linking to LinkedIn and professional social networks.'
        : 'Add verifiable client testimonials and partner/client logos on your homepage.')
      : (!hasPerson
        ? 'Ajoutez un schéma Person JSON-LD pour l\'auteur principal avec sameAs vers LinkedIn et les réseaux sociaux professionnels.'
        : 'Ajoutez des témoignages clients vérifiables et des logos partenaires/clients sur votre page d\'accueil.'),
    impact: en
      ? 'A complete author profile significantly increases AI confidence in your content.'
      : 'Un profil auteur complet augmente significativement la confiance des IA dans vos contenus.',
  };
}

function buildAccessibilityReco(c, ev, locale) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const en = locale === 'en';
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
      title: en ? 'Unblock AI access to your site' : 'Débloquer l\'accès de votre site aux IA',
      diagnostic: en
        ? (blockedBots.length > 0
          ? `Your robots.txt actively blocks ${blockedBots.join(', ')}. These bots cannot crawl your content, so AIs cannot cite you.`
          : `Your site has accessibility issues for AI crawlers (${wordCount < 200 ? 'content too short to be indexed' : 'restrictive technical configuration'}).`)
        : (blockedBots.length > 0
          ? `Votre robots.txt bloque activement ${blockedBots.join(', ')}. Ces bots ne peuvent pas crawler votre contenu, donc les IA ne peuvent pas vous citer.`
          : `Votre site a des problèmes d'accessibilité pour les crawlers IA (${wordCount < 200 ? 'contenu trop court pour être indexé' : 'configuration technique restrictive'}).`),
      action: en
        ? (blockedBots.length > 0
          ? `Edit your robots.txt to allow AI bots: remove the "Disallow" lines for ${blockedBots.join(', ')}. This is the most impactful fix you can make.`
          : 'Ensure your content is server-rendered HTML (not JavaScript-only), add a lang attribute on <html>, and submit a sitemap.xml.')
        : (blockedBots.length > 0
          ? `Modifiez votre robots.txt pour autoriser les bots IA : supprimez les lignes "Disallow" pour ${blockedBots.join(', ')}. C'est le fix le plus impactant que vous puissiez faire.`
          : 'Vérifiez que votre contenu est rendu en HTML serveur (pas uniquement en JavaScript client), ajoutez un attribut lang sur <html>, et soumettez un sitemap.xml.'),
      impact: en
        ? '73% of sites block AI bots unknowingly (Otterly.AI, 2026). Unblocking access is often the most impactful fix.'
        : '73% des sites bloquent les bots IA sans le savoir (Otterly.AI, 2026). Débloquer l\'accès est souvent le fix le plus impactant.',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: en ? 'Optimize technical accessibility for AIs' : 'Optimiser l\'accessibilité technique pour les IA',
    diagnostic: en
      ? `Your site is accessible to AI crawlers${hasLlmsTxt ? ' and has an llms.txt file' : ' but doesn\'t have an llms.txt file'}. ${wordCount > 0 ? `Content detected: ${plural(wordCount, 'word')}.` : ''}`
      : `Votre site est accessible aux crawlers IA${hasLlmsTxt ? ' et dispose d\'un fichier llms.txt' : ' mais n\'a pas de fichier llms.txt'}. ${wordCount > 0 ? `Contenu détecté : ${plural(wordCount, 'mot')}.` : ''}`,
    action: en
      ? (hasLlmsTxt
        ? 'Your configuration is good. Verify that your sitemap.xml is up to date and your main pages are properly indexed.'
        : 'Add an llms.txt file at the root of your site to guide AIs toward your most relevant content.')
      : (hasLlmsTxt
        ? 'Votre configuration est bonne. Vérifiez que votre sitemap.xml est à jour et que vos pages principales sont bien indexées.'
        : 'Ajoutez un fichier llms.txt à la racine de votre site pour guider les IA sur votre contenu le plus pertinent.'),
    impact: en
      ? 'Better technical accessibility facilitates indexing by language models.'
      : 'Une meilleure accessibilité technique facilite l\'indexation par les modèles de langage.',
  };
}

function buildNeutralityReco(c, ev, locale) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const en = locale === 'en';

  if (pct < 50) {
    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: en ? 'Reduce promotional language' : 'Réduire le langage promotionnel',
      diagnostic: en
        ? 'Your content uses an overly marketing tone with unsourced superlatives. AIs penalize pages that look like advertising rather than information.'
        : 'Votre contenu utilise un ton trop marketing avec des superlatifs non sourcés. Les IA pénalisent les pages qui ressemblent à de la publicité plutôt qu\'à de l\'information.',
      action: en
        ? 'Do a search-and-replace: replace every "the best", "#1", "leader", "revolutionary" with a verifiable fact ("used by X clients", "rated X/5 on Y reviews", "since XXXX").'
        : 'Faites un search-and-replace : remplacez chaque "le meilleur", "n°1", "leader", "révolutionnaire" par un fait vérifiable ("utilisé par X clients", "noté X/5 sur Y avis", "depuis XXXX").',
      impact: en
        ? 'A factual and neutral tone increases the probability that AIs cite you as a reliable source.'
        : 'Un ton factuel et neutre augmente la probabilité que les IA vous citent comme source fiable.',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: en ? 'Refine your content objectivity' : 'Affiner l\'objectivité de votre contenu',
    diagnostic: en
      ? 'Your content is generally factual but still contains some wording that could be perceived as promotional by AIs.'
      : 'Votre contenu est globalement factuel mais contient encore quelques formulations qui pourraient être perçues comme promotionnelles par les IA.',
    action: en
      ? 'Review your page looking for unsourced claims. For each one, add a data point, a source, or an external link that supports it.'
      : 'Relisez votre page en cherchant les affirmations non sourcées. Pour chacune, ajoutez une donnée chiffrée, une source ou un lien externe qui la soutient.',
    impact: en
      ? 'Each sourced claim strengthens the credibility of the entire page in the eyes of AIs.'
      : 'Chaque affirmation sourcée renforce la crédibilité de l\'ensemble de la page aux yeux des IA.',
  };
}

function buildExternalPresenceReco(c, ev, locale) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const en = locale === 'en';
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
      title: en ? 'Develop your external presence' : 'Développer votre présence externe',
      diagnostic: en
        ? `Your page has ${plural(socialLinks.length, 'social link')} and ${plural(extLinks, 'external link')}. This is insufficient — AIs value sites connected to a broader web ecosystem.`
        : `Votre page a ${plural(socialLinks.length, 'lien social', 'liens sociaux')} et ${plural(extLinks, 'lien externe', 'liens externes')}. C'est insuffisant — les IA valorisent les sites connectés à un écosystème web plus large.`,
      action: en
        ? (socialLinks.length === 0
          ? 'Add links to your active social profiles (LinkedIn, X, YouTube at minimum) in the footer or About page.'
          : `You have ${socialPlatforms.join(', ')} — add the missing platforms and include outbound links to authoritative sources in your content.`)
        : (socialLinks.length === 0
          ? 'Ajoutez des liens vers vos profils sociaux actifs (LinkedIn, X, YouTube au minimum) dans le footer ou la page À propos.'
          : `Vous avez ${socialPlatforms.join(', ')} — complétez avec les plateformes manquantes et ajoutez des liens sortants vers des sources autoritaires dans votre contenu.`),
      impact: en
        ? 'Backlinks and external mentions are the #1 factor for AI visibility according to multiple studies.'
        : 'Les backlinks et mentions externes sont le facteur n°1 de visibilité IA selon plusieurs études.',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: en ? 'Strengthen your link ecosystem' : 'Renforcer votre écosystème de liens',
    diagnostic: en
      ? `Your page is linked to ${socialPlatforms.length > 0 ? socialPlatforms.join(', ') : plural(socialLinks.length, 'social network')} and has ${plural(extLinks, 'external link')}.`
      : `Votre page est liée à ${socialPlatforms.length > 0 ? socialPlatforms.join(', ') : plural(socialLinks.length, 'réseau social', 'réseaux sociaux')} et a ${plural(extLinks, 'lien externe', 'liens externes')}.`,
    action: en
      ? 'Add client testimonials with links to their sites, partner logos, and cite authoritative external sources in your content.'
      : 'Ajoutez des témoignages clients avec liens vers leurs sites, des logos partenaires, et citez des sources externes autoritaires dans votre contenu.',
    impact: en
      ? 'Each additional external mention increases your perceived authority by AIs.'
      : 'Chaque mention externe supplémentaire augmente votre autorité perçue par les IA.',
  };
}

function buildFreshnessReco(c, ev, locale) {
  const pct = (c.score / c.max) * 100;
  if (pct >= 95) return null;

  const en = locale === 'en';
  const dates = ev?.dates || {};
  const currentYear = new Date().getFullYear().toString();
  const hasDateModified = !!dates.dateModified;
  const hasDatePublished = !!dates.datePublished;
  const copyright = dates.copyright || '';
  const copyrightCurrent = copyright.includes(currentYear);

  if (pct < 50) {
    const problems = [];
    if (en) {
      if (!hasDateModified) problems.push('no dateModified in JSON-LD');
      if (!hasDatePublished) problems.push('no datePublished');
      if (copyright && !copyrightCurrent) problems.push(`copyright from ${copyright} (not ${currentYear})`);
      if (!copyright) problems.push('no copyright detected');
    } else {
      if (!hasDateModified) problems.push('pas de dateModified en JSON-LD');
      if (!hasDatePublished) problems.push('pas de datePublished');
      if (copyright && !copyrightCurrent) problems.push(`copyright de ${copyright} (pas ${currentYear})`);
      if (!copyright) problems.push('aucun copyright détecté');
    }

    return {
      criterion: c.name, priority: 'high', scorePercent: Math.round(pct),
      title: en ? 'Add freshness signals to your page' : 'Ajouter des signaux de fraîcheur à votre page',
      diagnostic: en
        ? `Your page has no recent update signals: ${problems.join(', ')}. AIs strongly favor recent content.`
        : `Votre page n'a aucun signal de mise à jour récente : ${problems.join(', ')}. Les IA favorisent fortement le contenu récent.`,
      action: en
        ? (hasDatePublished
          ? `Add "dateModified": "${new Date().toISOString().split('T')[0]}" to your existing JSON-LD schema, and update the copyright to ${currentYear}.`
          : `Add a JSON-LD block with datePublished and dateModified. Update your copyright to ${currentYear}. Mention current-year data in your content.`)
        : (hasDatePublished
          ? `Ajoutez "dateModified": "${new Date().toISOString().split('T')[0]}" dans votre schéma JSON-LD existant, et mettez le copyright à jour (${currentYear}).`
          : `Ajoutez un bloc JSON-LD avec datePublished et dateModified. Mettez votre copyright à ${currentYear}. Mentionnez des données de l'année en cours dans votre contenu.`),
      impact: en
        ? '65% of AI bot visits target content from the last 12 months (Seer Interactive, 2025).'
        : '65% des visites de bots IA ciblent du contenu des 12 derniers mois (Seer Interactive, 2025).',
    };
  }

  return {
    criterion: c.name, priority: 'medium', scorePercent: Math.round(pct),
    title: en ? 'Strengthen update signals' : 'Renforcer les signaux de mise à jour',
    diagnostic: en
      ? `Your page has ${hasDateModified ? 'a dateModified (' + dates.dateModified.slice(0, 10) + ')' : hasDatePublished ? 'a datePublished but no dateModified' : 'some temporal signals'}${copyrightCurrent ? '' : copyright ? ', copyright from ' + copyright : ''}.`
      : `Votre page a ${hasDateModified ? 'un dateModified (' + dates.dateModified.slice(0, 10) + ')' : hasDatePublished ? 'un datePublished mais pas de dateModified' : 'quelques signaux temporels'}${copyrightCurrent ? '' : copyright ? ', copyright de ' + copyright : ''}.`,
    action: en
      ? (!hasDateModified
        ? 'Add dateModified to your JSON-LD — it\'s the most important signal to tell AIs your content is up to date.'
        : 'Update your data points and sources with the most recent figures available. The date alone isn\'t enough — the content must reflect freshness.')
      : (!hasDateModified
        ? 'Ajoutez dateModified dans votre JSON-LD — c\'est le signal le plus important pour indiquer aux IA que votre contenu est à jour.'
        : `Mettez à jour vos données chiffrées et vos sources avec les chiffres les plus récents disponibles. La date seule ne suffit pas — le contenu doit refléter la fraîcheur.`),
    impact: en
      ? 'AIs favor recent and regularly updated content.'
      : 'Les IA favorisent le contenu récent et régulièrement mis à jour.',
  };
}

/**
 * Generate evidence-based recommendations from criteria scores + evidence data.
 * @param {Array} criteria - Array of { name, score, max, detail }
 * @param {Object} evidence - Evidence object from collectEvidence()
 * @returns {Array} - Array of personalized recommendation objects
 */
export function generateTemplateRecos(criteria, evidence = {}, locale = 'fr') {
  if (!Array.isArray(criteria)) return [];

  // Support both accented (from API response) and non-accented (from code) names
  const builders = {
    'Citabilite & reponse directe': buildCitabilityReco,
    'Citabilité & réponse directe': buildCitabilityReco,
    'Verifiabilite & preuves': buildVerifiabilityReco,
    'Vérifiabilité & preuves': buildVerifiabilityReco,
    'Autorite & E-E-A-T': buildAuthorityReco,
    'Autorité & E-E-A-T': buildAuthorityReco,
    'Accessibilite IA': buildAccessibilityReco,
    'Accessibilité IA': buildAccessibilityReco,
    'Neutralite editoriale': buildNeutralityReco,
    'Neutralité éditoriale': buildNeutralityReco,
    'Presence externe': buildExternalPresenceReco,
    'Présence externe': buildExternalPresenceReco,
    'Fraicheur & signaux temporels': buildFreshnessReco,
    'Fraîcheur & signaux temporels': buildFreshnessReco,
  };

  const recos = [];
  for (const c of criteria) {
    const builder = builders[c.name];
    if (!builder) continue;
    const reco = builder(c, evidence, locale);
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
