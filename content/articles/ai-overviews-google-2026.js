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

export default function AiOverviewsGoogle2026() {
  return (
    <>
      <p>Quand vous tapez une question sur Google, une réponse rédigée par l'IA apparaît désormais au-dessus des résultats classiques. C'est l'AI Overview — et il capte une part massive des clics. Sur les requêtes qui déclenchent un AI Overview, le taux de clic organique a chuté de 61 %. Si votre site n'est pas la source citée dans cette réponse, vous perdez du trafic même en étant bien positionné.</p>

      <p>La bonne nouvelle : les AI Overviews ne sortent pas de nulle part. Google les génère à partir de pages web existantes — et 99 % des sources citées proviennent du top 10 des résultats organiques. Autrement dit, si vous êtes déjà bien référencé, vous avez un avantage. Mais le SEO seul ne suffit pas : Google AI sélectionne les sources selon des critères spécifiques que cet article détaille.</p>

      <h2>Qu'est-ce qu'un AI Overview exactement</h2>

      <p>L'AI Overview (anciennement appelé SGE — Search Generative Experience) est un bloc de texte généré par l'IA de Google qui apparaît en haut de certaines pages de résultats. Il synthétise les informations de plusieurs sources pour répondre directement à la question de l'utilisateur.</p>

      <p>Contrairement aux featured snippets qui extraient un passage d'une seule page, l'AI Overview combine et reformule les informations de 3 à 5 sources. Il cite ces sources avec des liens, mais l'utilisateur obtient sa réponse sans cliquer — c'est ce qui explique la chute du CTR organique.</p>

      <p>Les AI Overviews apparaissent principalement sur les requêtes informationnelles et comparatives : "comment choisir un CRM", "différence entre SAS et SARL", "meilleur hébergeur web 2026". Ils n'apparaissent pas (ou rarement) sur les requêtes transactionnelles directes ("acheter iPhone 16") ou de navigation ("Facebook login").</p>

      <h2>Pourquoi c'est différent d'apparaître dans ChatGPT ou Perplexity</h2>

      <p>Les AI Overviews de Google ont une particularité majeure : ils s'appuient quasi exclusivement sur les pages déjà indexées et bien classées dans Google. ChatGPT et Perplexity utilisent leurs propres crawlers (GPTBot, PerplexityBot) et peuvent citer des sources que Google ne classe pas en première page. Pour en savoir plus sur l'IA de Google, consultez notre article sur <InternalLink href="/blog/gemini-visibilite-site-france">Gemini et la visibilité des sites en France</InternalLink>.</p>

      <p>Concrètement, cela signifie que pour les AI Overviews, le SEO classique est la condition préalable. Vous devez d'abord être dans le top 10 Google pour une requête avant d'espérer être cité dans l'AI Overview de cette requête.</p>

      <p>C'est la couche <InternalLink href="/blog/geo-guide-complet-2026">GEO</InternalLink> qui fait ensuite la différence : parmi les 10 résultats organiques, lequel sera sélectionné comme source de l'AI Overview ? C'est là que l'extractibilité, la structure et la vérifiabilité de votre contenu entrent en jeu.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : quelles différences en 2026 →</ArrowLink>

      <h2>Les 6 critères de sélection des AI Overviews</h2>

      <p>Google n'a pas publié de documentation officielle sur les critères exacts de sélection des AI Overviews. Mais l'analyse de milliers de résultats et les travaux de recherche permettent d'identifier les signaux dominants.</p>

      <h3>1. Position dans le top 10 organique</h3>

      <p>C'est le prérequis. Les AI Overviews piochent dans les résultats que Google a déjà jugés pertinents et de qualité. Si votre page n'est pas dans le top 10 pour la requête cible, elle ne sera pas considérée pour l'AI Overview.</p>

      <p>Cela ne signifie pas que la position 1 est toujours choisie. Google AI peut sélectionner la position 3 ou 7 si elle juge que cette page répond mieux à la question spécifique. Mais être hors du top 10 est éliminatoire.</p>

      <h3>2. Réponse directe et extractible</h3>

      <p>Les AI Overviews favorisent les pages qui contiennent une réponse claire et directe à la question posée, idéalement dans les premiers paragraphes.</p>

      <p>Si l'utilisateur cherche "comment améliorer son score GEO", Google AI cherchera une page qui commence par répondre à cette question — pas une page qui parle longuement de l'historique du GEO avant d'arriver à la réponse.</p>

      <p>Le format idéal : une phrase de réponse directe, suivie d'une explication structurée avec des étapes ou des points clés.</p>

      <h3>3. Structure en sous-titres descriptifs</h3>

      <p>Les pages avec des H2/H3 qui posent des questions ou décrivent clairement le contenu de chaque section sont plus facilement parsées par l'IA de Google.</p>

      <p>Exemple efficace :</p>
      <ul>
        <li>H2 : "Comment apparaître dans les AI Overviews"</li>
        <li>H2 : "Quels types de contenu sont sélectionnés"</li>
        <li>H2 : "En combien de temps peut-on apparaître"</li>
      </ul>

      <p>Exemple peu efficace :</p>
      <ul>
        <li>H2 : "Notre approche"</li>
        <li>H2 : "Nos services"</li>
        <li>H2 : "En savoir plus"</li>
      </ul>

      <h3>4. Données structurées Schema.org</h3>

      <p>Les pages avec un balisage <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org</InternalLink> complet (Article, FAQPage, HowTo) ont un avantage significatif. Le balisage aide Google AI à comprendre le type de contenu, l'auteur, la date et la structure.</p>

      <p>Le schema FAQPage est particulièrement efficace pour les AI Overviews : les questions-réponses structurées correspondent exactement au format que l'IA cherche à générer.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA : le guide pratique →</ArrowLink>

      <h3>5. Autorité E-E-A-T du domaine</h3>

      <p>Google utilise ses signaux E-E-A-T habituels (Experience, Expertise, Authoritativeness, Trustworthiness) pour évaluer la fiabilité des sources potentielles de l'AI Overview. Un site avec une forte autorité de domaine, des auteurs identifiés et des backlinks de qualité sera préféré.</p>

      <p>C'est ici que les sites établis ont un avantage sur les sites récents. Mais un contenu exceptionnellement bien structuré et exhaustif sur un site plus modeste peut quand même être sélectionné — surtout sur des requêtes de niche.</p>

      <h3>6. Fraîcheur du contenu</h3>

      <p>Pour les requêtes où l'actualité compte ("meilleur CRM 2026", "nouvelles règles RGPD"), Google AI favorise les contenus récents. La date de publication et de dernière modification sont des signaux directs.</p>

      <p>Un article daté de 2024 sur un sujet qui évolue sera ignoré au profit d'un article mis à jour en 2026, même si le premier a plus de backlinks.</p>

      <h2>7 actions concrètes pour être sélectionné</h2>

      <h3>Action 1 — Viser les featured snippets d'abord</h3>

      <p>Les featured snippets et les AI Overviews ciblent souvent les mêmes requêtes. Si vous obtenez déjà un featured snippet, vous avez une forte probabilité d'être cité dans l'AI Overview correspondant.</p>

      <p>Optimisez vos pages pour les featured snippets : réponse concise en 40-60 mots directement sous le H2, suivie d'une explication détaillée.</p>

      <h3>Action 2 — Structurer en format "question → réponse"</h3>

      <p>Chaque section importante de votre page devrait suivre ce format :</p>
      <ul>
        <li>Un H2 ou H3 formulé comme une question naturelle</li>
        <li>Un paragraphe de réponse directe (2-3 phrases)</li>
        <li>Un développement détaillé avec des exemples ou des données</li>
      </ul>

      <p>Ce format est exactement ce que l'IA de Google cherche pour construire ses synthèses.</p>

      <h3>Action 3 — Ajouter des listes et des étapes numérotées</h3>

      <p>Les AI Overviews affichent souvent des listes. Si votre contenu contient des listes ordonnées ("5 étapes pour...", "les 3 critères de..."), il a plus de chances d'être sélectionné et affiché dans le format que l'utilisateur attend.</p>

      <h3>Action 4 — Couvrir le sujet de manière exhaustive</h3>

      <p>Les AI Overviews combinent des informations de plusieurs sources. Si votre page couvre le sujet de manière exhaustive — toutes les facettes, toutes les questions courantes — Google AI peut la citer comme source principale plutôt que de devoir combiner 4-5 sources partielles.</p>

      <p>Visez des articles de 2000+ mots qui traitent le sujet en profondeur, avec des sous-sections pour chaque aspect.</p>

      <h3>Action 5 — Ajouter des données chiffrées uniques</h3>

      <p>Les AI Overviews citent fréquemment des statistiques et des chiffres. Si votre page contient des données originales (vos propres études, benchmarks, résultats mesurés), elle a un avantage sur les pages qui ne font que compiler des données d'autres sources.</p>

      <p>Exemples : "Sur 500 sites analysés, 94 % obtiennent un score inférieur à 60/100", "Le temps moyen pour voir un impact est de 8 semaines".</p>

      <h3>Action 6 — Implémenter le schema HowTo et FAQPage</h3>

      <p>Au-delà du schema Article, deux schemas sont particulièrement efficaces pour les AI Overviews :</p>
      <ul>
        <li><strong>HowTo</strong> — pour les contenus tutoriels étape par étape. Google AI peut extraire directement les étapes et les afficher de manière structurée.</li>
        <li><strong>FAQPage</strong> — pour les sections de questions-réponses. Le format Q&A correspond naturellement à ce que les AI Overviews cherchent à produire.</li>
      </ul>

      <h3>Action 7 — Mettre à jour régulièrement</h3>

      <p>Les AI Overviews changent fréquemment — Google recalcule régulièrement quelles sources citer. Un contenu mis à jour avec des données fraîches a plus de chances d'être sélectionné qu'un contenu statique.</p>

      <p>Mettez à jour vos articles piliers au moins une fois par trimestre. Ajoutez des données récentes, supprimez les informations obsolètes, et mettez à jour la date de modification dans votre schema Article.</p>

      <h2>Les requêtes les plus propices aux AI Overviews</h2>

      <p>Tous les types de requêtes ne déclenchent pas d'AI Overview. Concentrez vos efforts sur celles qui en génèrent le plus souvent.</p>

      <h3>Requêtes "comment" et "pourquoi"</h3>

      <p>"Comment choisir un...", "Pourquoi mon site...", "Comment fonctionne..." — ces requêtes génèrent un AI Overview dans la majorité des cas. Elles appellent une réponse explicative que l'IA peut synthétiser.</p>

      <h3>Requêtes comparatives</h3>

      <p>"X vs Y", "Différence entre A et B", "Meilleur X pour Y" — les comparaisons sont un terrain privilégié pour les AI Overviews car elles nécessitent une synthèse de plusieurs critères.</p>

      <h3>Requêtes de définition</h3>

      <p>"Qu'est-ce que le GEO", "Définition de [concept]" — l'IA de Google excelle à synthétiser des définitions à partir de plusieurs sources.</p>

      <h3>Requêtes peu propices</h3>

      <p>Les requêtes de navigation ("site officiel de X"), les requêtes transactionnelles directes ("acheter X"), et les requêtes très locales ("restaurant italien à côté") déclenchent rarement des AI Overviews.</p>

      <h2>Comment mesurer votre présence dans les AI Overviews</h2>

      <p>Google Search Console ne fournit pas encore de données spécifiques sur les AI Overviews. Mais plusieurs approches permettent de suivre votre visibilité.</p>

      <p><strong>Test manuel régulier</strong> — identifiez vos 10-15 requêtes cibles. Vérifiez mensuellement si un AI Overview apparaît et si votre site y est cité. Utilisez une fenêtre de navigation privée pour éviter la personnalisation des résultats.</p>

      <p><strong>Suivi du CTR dans Search Console</strong> — si vous constatez une baisse soudaine du CTR sur une requête où vous êtes bien positionné, c'est probablement qu'un AI Overview est apparu et capte les clics. Si vous êtes cité dans l'Overview, le CTR peut remonter partiellement.</p>

      <p><strong>Outils tiers</strong> — des outils comme Semrush et Ahrefs commencent à tracker la présence des AI Overviews dans leurs rapports de mots-clés. Vérifiez si vos outils SEO actuels offrent cette fonctionnalité.</p>

      <p><strong>Audit GEO</strong> — les critères de sélection des AI Overviews recoupent largement les 8 critères du score GEO Detekia, notamment l'extractibilité, les données structurées et la vérifiabilité.</p>

      <h2>Questions fréquentes</h2>

      <h3>Les AI Overviews apparaissent-ils sur toutes les recherches Google ?</h3>

      <p>Non. En 2026, ils apparaissent sur environ 30 % des pages de résultats, principalement pour les requêtes informationnelles et comparatives. Google continue d'élargir leur déploiement.</p>

      <h3>Puis-je empêcher mon contenu d'apparaître dans les AI Overviews ?</h3>

      <p>Oui, en bloquant le user-agent Google-Extended dans votre robots.txt. Mais c'est contre-productif : vous perdez une source de visibilité sans bénéfice. Bloquer Google-Extended n'affecte pas votre classement SEO classique.</p>

      <h3>Les AI Overviews vont-ils tuer le trafic organique ?</h3>

      <p>Pas complètement. Ils redistribuent le trafic : les sites cités dans l'Overview captent une part du trafic, les autres perdent. L'objectif est d'être dans les sources citées, pas de subir le changement.</p>

      <h3>Mon site est premier sur Google mais pas cité dans l'AI Overview. Pourquoi ?</h3>

      <p>Être premier en SEO ne garantit pas d'être la source de l'AI Overview. Google AI évalue des critères supplémentaires : extractibilité du contenu, structure, exhaustivité, données structurées. Un concurrent en position 4 avec un contenu mieux structuré peut être préféré.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour être cité par les IA en 2026</ArrowLink>
      <ArrowLink href="/">Analysez votre site — score GEO sur 100, 8 critères, en moins de 60 secondes →</ArrowLink>
      <InlineCTA href="/">Votre site est-il visible pour les IA ? Testez gratuitement.</InlineCTA>
    </>
  );
}
