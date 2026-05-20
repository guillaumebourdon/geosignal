import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

function InternalLink({ href, children }) {
  return (
    <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}
      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
    >{children}</Link>
  );
}


function InlineCTA({ href, children }) {
  return (
    <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 10, padding: '20px 24px', margin: '32px 0', textAlign: 'center' }}>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6B6762', marginBottom: 12 }}>{children}</p>
      <a href={href} style={{ display: 'inline-block', background: '#D97757', color: '#fff', borderRadius: 8, padding: '11px 28px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
        Tester mon site gratuitement →
      </a>
    </div>
  );
}

export default function AuditGeoVisibiliteIa() {
  return (
    <>
      <p>Vous voulez savoir si ChatGPT, Gemini ou Perplexity citent votre site — et si non, pourquoi. Un audit GEO répond à ces deux questions. Il évalue votre site sur les <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">critères que les moteurs IA utilisent</InternalLink> pour sélectionner leurs sources, identifie les blocages, et vous donne un plan d'action priorisé.</p>

      <p>Cet article vous guide à travers un audit GEO complet, étape par étape, que vous pouvez réaliser vous-même ou accélérer avec un outil automatisé.</p>

      <h2>Ce qu'un audit GEO évalue (et ce qu'il n'évalue pas)</h2>

      <p>Un audit GEO n'est pas un audit SEO. Les deux se complètent mais ne mesurent pas les mêmes choses.</p>

      <p>Ce qu'un audit GEO mesure :</p>
      <ul>
        <li>Votre contenu peut-il être extrait et cité par une IA ? (extractibilité)</li>
        <li>Les bots IA peuvent-ils accéder à votre site ? (crawlabilité)</li>
        <li>Votre site est-il compris par les machines ? (données structurées)</li>
        <li>Votre contenu est-il perçu comme fiable ? (vérifiabilité, autorité, neutralité)</li>
        <li>Existez-vous en dehors de votre propre site ? (présence externe)</li>
        <li>Votre contenu est-il à jour ? (fraîcheur)</li>
      </ul>

      <p>Ce qu'un audit GEO ne mesure pas :</p>
      <ul>
        <li>Vos positions sur Google (c'est du SEO)</li>
        <li>Votre vitesse de chargement (c'est du SEO technique)</li>
        <li>Vos backlinks en détail (c'est du SEO off-page)</li>
        <li>Le nombre exact de fois où les IA vous citent (aucun outil ne peut le mesurer avec certitude)</li>
      </ul>

      <p>L'audit GEO mesure votre potentiel de citation — les conditions techniques et éditoriales qui maximisent vos chances d'être sélectionné comme source par les IA.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Les 8 critères GEO qui déterminent si une IA vous cite →</ArrowLink>

      <h2>Étape 1 — Le test de citation (15 minutes)</h2>

      <p>Avant de plonger dans la technique, commencez par le test le plus concret : demandez directement aux IA si elles connaissent votre site.</p>

      <h3>Comment procéder</h3>

      <p>Ouvrez ChatGPT, Gemini et Perplexity. Pour chacun, posez 5 questions :</p>

      <p>Questions de recommandation (votre marché) :</p>
      <ol>
        <li>"Quel est le meilleur [votre service/produit] en France ?"</li>
        <li>"Recommande-moi un [votre service/produit] pour [besoin spécifique de vos clients]"</li>
      </ol>

      <p>Questions d'expertise (votre domaine) :</p>
      <ol>
        <li>"Comment choisir un bon [votre domaine] ?"</li>
        <li>"Quelle est la différence entre [A] et [B] dans [votre secteur] ?"</li>
      </ol>

      <p>Question de marque (votre nom) :</p>
      <ol>
        <li>"Que fait [nom de votre entreprise] ?"</li>
      </ol>

      <h3>Comment analyser les résultats</h3>

      <p>Pour chaque réponse, notez dans un tableau :</p>
      <ul>
        <li><strong>Cité ?</strong> — votre site ou votre marque apparaît dans la réponse (oui/non)</li>
        <li><strong>Concurrents cités</strong> — quels noms apparaissent à votre place</li>
        <li><strong>Type de source citée</strong> — site officiel, article de blog, forum, annuaire ?</li>
      </ul>

      <p>Calculez votre taux de présence : nombre de citations / (5 questions × 3 moteurs) = X %.</p>

      <p>En dessous de 20 %, vous avez un problème significatif de visibilité IA. Au-dessus de 50 %, vous êtes dans une bonne position. Au-dessus de 80 %, vous pouvez passer en mode optimisation fine.</p>

      <h3>Ce que les résultats vous disent</h3>

      <p>Si vous n'apparaissez nulle part mais que vos concurrents sont cités, le problème est probablement technique (crawlabilité, données structurées) ou éditorial (extractibilité, contenu).</p>

      <p>Si personne n'apparaît dans votre secteur, c'est une opportunité : le premier à s'optimiser raflera les citations.</p>

      <p>Si vous apparaissez sur certaines requêtes mais pas d'autres, comparez les pages correspondantes : celle qui est citée a probablement quelque chose que les autres n'ont pas (meilleure structure, plus de données, FAQ...).</p>

      <h2>Étape 2 — L'audit de crawlabilité (10 minutes)</h2>

      <p>C'est le critère binaire : si les bots IA ne peuvent pas accéder à votre site, rien d'autre ne compte.</p>

      <h3>Vérifier robots.txt</h3>

      <p>Allez sur <code>votresite.fr/robots.txt</code> et cherchez les directives pour ces user-agents :</p>
      <ul>
        <li><code>GPTBot</code> — ChatGPT</li>
        <li><code>ClaudeBot</code> — Claude</li>
        <li><code>PerplexityBot</code> — Perplexity</li>
        <li><code>Google-Extended</code> — Gemini / AI Overviews</li>
      </ul>

      <p>Si vous voyez <code>Disallow: /</code> pour l'un de ces bots, vous le bloquez activement.</p>

      <p><strong>Résultat attendu :</strong> aucun bot IA ne doit être bloqué (sauf décision stratégique documentée).</p>

      <h3>Vérifier le fichier llms.txt</h3>

      <p>Allez sur <code>votresite.fr/llms.txt</code>. Ce fichier, s'il existe, guide les crawlers IA vers vos contenus les plus importants.</p>

      <p><strong>Résultat attendu :</strong> le fichier existe et liste vos pages principales.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">llms.txt, robots.txt et crawlabilité IA : le guide technique →</ArrowLink>

      <h3>Vérifier l'accessibilité sans JavaScript</h3>

      <p>Désactivez JavaScript dans votre navigateur (Chrome DevTools → Ctrl+Shift+P → "Disable JavaScript") et naviguez sur votre site. Si le contenu principal disparaît, les crawlers IA ne peuvent probablement pas le lire.</p>

      <p><strong>Résultat attendu :</strong> le contenu principal est visible sans JavaScript.</p>

      <h3>Vérifier le sitemap</h3>

      <p>Allez sur <code>votresite.fr/sitemap.xml</code>. Vérifiez qu'il est accessible, qu'il liste toutes vos pages importantes, et que les dates <code>&lt;lastmod&gt;</code> sont à jour.</p>

      <p><strong>Résultat attendu :</strong> sitemap accessible et à jour.</p>

      <h2>Étape 3 — L'audit d'extractibilité (30 minutes)</h2>

      <p>C'est le critère le plus lourd du <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">score GEO</InternalLink> (25 points sur 100) et le plus souvent défaillant.</p>

      <h3>Analyser les 5 pages principales</h3>

      <p>Prenez vos 5 pages les plus importantes (homepage, page service/produit principale, article de blog clé, FAQ, page À propos). Pour chaque page, évaluez :</p>

      <p><strong>Les 100 premiers mots</strong> — contiennent-ils une réponse directe à la question que se pose le visiteur ? Ou commencent-ils par du texte commercial vague ("Bienvenue chez...", "Leader de l'innovation...") ?</p>

      <p>Testez avec cette méthode : copiez les 100 premiers mots de votre page et collez-les dans ChatGPT en demandant "Sur la base de ce texte, que fait cette entreprise et que propose-t-elle ?". Si ChatGPT ne peut pas répondre clairement, votre intro n'est pas extractible.</p>

      <p><strong>Les sous-titres H2/H3</strong> — sont-ils descriptifs ou vagues ? "Comment fonctionne notre service" est bon. "En savoir plus" est mauvais. "Nos avantages" est médiocre.</p>

      <p><strong>L'autonomie des paragraphes</strong> — prenez un paragraphe au hasard dans la page. Est-il compréhensible hors contexte ? Les IA extraient souvent un seul paragraphe pour répondre à une question. Si ce paragraphe nécessite le contexte du paragraphe précédent, il perd sa valeur.</p>

      <p><strong>La structure</strong> — y a-t-il des listes, des tableaux, des étapes numérotées ? L'information structurée est plus facilement extractible que le texte continu.</p>

      <h3>Notation rapide</h3>

      <p>Pour chaque page, attribuez un score subjectif :</p>
      <ul>
        <li><strong>Bon (4-5/5)</strong> : intro factuelle, sous-titres descriptifs, paragraphes autonomes, listes/tableaux</li>
        <li><strong>Moyen (2-3/5)</strong> : mix contenu informatif et commercial, structure partielle</li>
        <li><strong>Faible (0-1/5)</strong> : intro commerciale, pas de structure, texte continu vague</li>
      </ul>

      <h2>Étape 4 — L'audit des données structurées (15 minutes)</h2>

      <h3>Tester avec le Rich Results Test</h3>

      <p>Allez sur le Rich Results Test de Google et entrez l'URL de votre homepage. Notez :</p>
      <ul>
        <li>Combien de types de résultats enrichis sont détectés ?</li>
        <li>Y a-t-il des erreurs ou des avertissements ?</li>
      </ul>

      <p>Répétez pour votre page FAQ et votre article de blog principal.</p>

      <h3>Checklist des schemas essentiels</h3>

      <p>Vérifiez la présence de ces schemas :</p>
      <ul>
        <li><code>Organization</code> sur la homepage — nom, logo, URL, adresse, contact, sameAs (liens vers LinkedIn, etc.)</li>
        <li><code>Article</code> sur les contenus éditoriaux — titre, auteur (avec nom et URL LinkedIn), dates, description</li>
        <li><code>FAQPage</code> sur les pages contenant des Q&R</li>
        <li><code>BreadcrumbList</code> sur les pages internes</li>
        <li><code>WebSite</code> avec SearchAction sur la homepage</li>
      </ul>

      <p><strong>Résultat attendu :</strong> au minimum Organization + Article. Idéalement les 5 schemas ci-dessus.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA : exemples de code prêts à copier →</ArrowLink>

      <h2>Étape 5 — L'audit de vérifiabilité (20 minutes)</h2>

      <h3>Scanner le contenu pour les preuves</h3>

      <p>Parcourez vos 5 pages principales et comptez, pour chaque page :</p>
      <ul>
        <li><strong>Données chiffrées</strong> — statistiques, pourcentages, montants, durées (objectif : 1 donnée pour 200 mots)</li>
        <li><strong>Sources nommées</strong> — "selon Gartner", "d'après une étude McKinsey" (pas "selon les experts" ni "des études montrent")</li>
        <li><strong>Dates de référence</strong> — "en 2026", "depuis mars 2025" (pas "récemment" ni "depuis quelque temps")</li>
        <li><strong>Exemples concrets</strong> — cas clients, scénarios d'usage, résultats mesurés</li>
      </ul>

      <h3>Identifier les affirmations non sourcées</h3>

      <p>Cherchez dans vos pages les affirmations qui ne sont pas accompagnées de preuves :</p>
      <ul>
        <li>"Nous sommes leaders de..." → leaders selon quelle métrique ?</li>
        <li>"Des résultats exceptionnels" → quel résultat précisément ?</li>
        <li>"De nombreux clients satisfaits" → combien exactement ?</li>
      </ul>

      <p>Chaque affirmation non sourcée est un signal négatif pour les IA.</p>

      <h2>Étape 6 — L'audit d'autorité E-E-A-T (10 minutes)</h2>

      <h3>Page À propos</h3>

      <p>Votre page À propos contient-elle :</p>
      <ul>
        <li>Le nom complet du fondateur/dirigeant ?</li>
        <li>Une biographie avec parcours et expertise ?</li>
        <li>Une photo ?</li>
        <li>Les coordonnées complètes (adresse, email, téléphone) ?</li>
        <li>Des signaux de confiance (logos clients, certifications, mentions presse) ?</li>
      </ul>

      <h3>Auteurs identifiés</h3>

      <p>Vos articles de blog sont-ils signés par un auteur nommé avec :</p>
      <ul>
        <li>Un lien vers un profil professionnel (LinkedIn) ?</li>
        <li>Une bio courte en bas de l'article ?</li>
      </ul>

      <h3>Mentions légales</h3>

      <p>Vos mentions légales sont-elles complètes : raison sociale, SIRET/RCS, adresse, directeur de publication ?</p>

      <p><strong>Résultat attendu :</strong> page À propos complète, auteurs identifiés, mentions légales exhaustives.</p>

      <h2>Étape 7 — L'audit de neutralité (10 minutes)</h2>

      <h3>Analyser le ton</h3>

      <p>Relisez vos pages clés avec un œil critique. Cherchez :</p>
      <ul>
        <li>Superlatifs non sourcés : "le meilleur", "le plus innovant", "inégalé", "révolutionnaire"</li>
        <li>Promesses vagues : "des résultats exceptionnels", "une solution transformative"</li>
        <li>Manipulation : urgence artificielle ("offre limitée !"), pression sociale ("tout le monde utilise..."), peur ("vous perdez de l'argent")</li>
      </ul>

      <p>Chaque occurrence réduit votre crédibilité auprès des IA.</p>

      <h3>Le test du ton</h3>

      <p>Prenez le paragraphe le plus commercial de votre site et posez-vous la question : "Est-ce qu'un article Wikipédia dirait ça ?" Si non, c'est trop promotionnel pour les IA.</p>

      <p>L'objectif n'est pas de supprimer toute dimension commerciale, mais de la baser sur des faits : "Solution reconnue par 312 entreprises depuis 2019" plutôt que "Solution leader du marché".</p>

      <h2>Étape 8 — L'audit de présence externe (15 minutes)</h2>

      <h3>Vérifier votre empreinte web</h3>

      <p>Cherchez votre marque sur Google (entre guillemets) : "votre entreprise". Combien de résultats proviennent de sites tiers (pas votre propre site) ?</p>

      <p>Cherchez aussi :</p>
      <ul>
        <li>Votre nom sur Reddit (via Google : <code>site:reddit.com "votre entreprise"</code>)</li>
        <li>Votre profil LinkedIn entreprise — est-il actif ?</li>
        <li>Votre Google Business Profile — existe-t-il et est-il vérifié ?</li>
        <li>Des mentions presse — des articles qui parlent de vous ?</li>
      </ul>

      <h3>Évaluer la diversité</h3>

      <p>L'idéal est d'être mentionné sur plusieurs types de sources :</p>
      <ul>
        <li>Presse/médias sectoriels</li>
        <li>Forums/Reddit</li>
        <li>Annuaires professionnels</li>
        <li>Google Business Profile</li>
        <li>LinkedIn (profil entreprise actif)</li>
      </ul>

      <p><strong>Résultat attendu :</strong> au moins 3 types de sources externes différents.</p>

      <h2>Étape 9 — L'audit de fraîcheur (5 minutes)</h2>

      <p>Vérifier les dates :</p>
      <ul>
        <li>Votre dernier article de blog date de quand ?</li>
        <li>Vos pages principales affichent-elles une date de mise à jour visible ?</li>
        <li>Y a-t-il des dates périmées dans votre contenu ("tendances 2024", "nouveautés 2023") ?</li>
        <li>Les <code>dateModified</code> dans vos schemas Article sont-ils à jour ?</li>
      </ul>

      <p><strong>Résultat attendu :</strong> contenu mis à jour dans les 3 derniers mois, aucune date obsolète.</p>

      <h2>Synthétiser les résultats</h2>

      <h3>Comment prioriser</h3>

      <p>Prioriser d'abord les critères <strong>bloquants</strong> — crawlabilité et extractibilité. Si les bots ne peuvent pas accéder à votre site ou si votre contenu n'est pas extractible, rien d'autre ne sert.</p>

      <p>Ensuite les critères à <strong>fort impact</strong> — vérifiabilité et données structurées. Ce sont les leviers qui font passer un site de "invisible" à "citable".</p>

      <p>Enfin les critères de <strong>renforcement</strong> — autorité, neutralité, présence externe, fraîcheur. Ils améliorent un site déjà citable.</p>

      <h2>Automatiser votre audit</h2>

      <p>L'audit manuel que nous venons de décrire prend environ 2 heures. C'est un excellent exercice pour comprendre les enjeux, mais ce n'est pas tenable pour un suivi régulier.</p>

      <p>Detekia automatise les 8 critères en moins de 60 secondes, avec les <InternalLink href="/blog/mesurer-visibilite-ia-outils-methodes-2026">outils et méthodes de mesure</InternalLink> les plus récents : il scrape le DOM réel de votre page, analyse chaque critère, et vous donne un score sur 100 avec des recommandations priorisées par impact.</p>

      <p>L'audit automatisé est particulièrement utile pour :</p>
      <ul>
        <li>Le diagnostic initial — où en êtes-vous exactement ?</li>
        <li>Le suivi après optimisation — vos corrections ont-elles amélioré le score ?</li>
        <li>Le benchmark concurrentiel — comment vous situez-vous par rapport à vos concurrents ?</li>
      </ul>

      <ArrowLink href="/">Lancez votre audit GEO automatisé — en moins de 60 secondes, sans inscription →</ArrowLink>
      <InlineCTA href="/">Votre site est-il visible pour les IA ? Testez gratuitement.</InlineCTA>
    </>
  );
}
