import Link from 'next/link';

function InternalLink({ href, children }) {
  return (
    <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}
      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
    >{children}</Link>
  );
}

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <InternalLink href={href}>{children}</InternalLink>
    </p>
  );
}

function InlineCTA({ href, children }) {
  return (
    <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 10, padding: '20px 24px', margin: '32px 0', textAlign: 'center' }}>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#8A8680', marginBottom: 12 }}>{children}</p>
      <a href={href} style={{ display: 'inline-block', background: '#D97757', color: '#fff', borderRadius: 8, padding: '11px 28px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
        Tester mon site gratuitement →
      </a>
    </div>
  );
}

export default function GeoGuideComplet2026() {
  return (
    <>
      <p>Les sessions de recherche référées par l'IA ont bondi de <strong>527 %</strong> au premier semestre 2025. Gartner prévoit une baisse de <strong>25 % du volume de recherche traditionnelle</strong> d'ici fin 2026. Et pendant ce temps, quand un prospect demande à ChatGPT, Gemini ou Perplexity quel prestataire choisir dans votre secteur, votre site n'apparaît nulle part.</p>

      <p>Le problème n'est pas votre SEO — il est peut-être excellent. Le problème, c'est que les moteurs de recherche ne fonctionnent plus comme avant. Une part croissante des recherches ne génère plus de liste de liens : elle génère une réponse. Et si votre site n'est pas conçu pour être cité dans cette réponse, vous devenez invisible pour une audience qui ne cliquera jamais sur Google.</p>

      <p>C'est exactement ce que le GEO — Generative Engine Optimization — permet de corriger. Ce guide vous explique ce que c'est, pourquoi c'est urgent, et surtout comment agir concrètement pour que les IA parlent de vous.</p>

      <h2>Qu'est-ce que le GEO (Generative Engine Optimization) ?</h2>

      <p>Le GEO désigne l'ensemble des techniques qui permettent d'optimiser un site web pour qu'il soit cité, repris et recommandé par les moteurs de recherche alimentés par l'intelligence artificielle : ChatGPT, Google Gemini, Perplexity, Claude, et les AI Overviews de Google.</p>

      <p>La différence fondamentale avec le SEO est simple :</p>

      <ul>
        <li>Le <strong>SEO</strong> cherche à positionner votre page dans une liste de liens. L'utilisateur doit cliquer pour accéder à votre contenu.</li>
        <li>Le <strong>GEO</strong> cherche à intégrer votre contenu directement dans la réponse synthétique générée par l'IA. L'utilisateur lit votre information sans même visiter votre site — mais il voit votre nom, votre marque, votre expertise.</li>
      </ul>

      <p>Vous avez peut-être croisé d'autres termes : AEO (Answer Engine Optimization), LLMO (Large Language Model Optimization), AIO (AI Optimization), GSO (Generative Search Optimization). Ils décrivent tous la même réalité. Le terme GEO, issu de travaux de recherche menés par Princeton et Georgia Tech, est celui qui s'impose en 2026.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">Pour une comparaison détaillée entre les deux disciplines, consultez notre article SEO vs GEO : quelles différences et comment les combiner en 2026.</ArrowLink>

      <h2>Pourquoi le GEO est devenu urgent en 2026</h2>

      <p>Les chiffres ne laissent plus de place au doute.</p>

      <p><strong>L'usage explose.</strong> En France, 44 % des actifs utilisent déjà l'IA générative au quotidien. ChatGPT est devenu le 5e site le plus visité au monde. Les recherches référées par l'IA ont augmenté de 527 % en un an. Ce n'est plus un phénomène de niche : c'est un canal d'acquisition à part entière.</p>

      <p><strong>Le trafic organique classique recule.</strong> Sur les requêtes qui déclenchent un AI Overview dans Google, le taux de clic organique a chuté de 61 %, passant de 1,76 % à 0,61 %. Les internautes obtiennent leur réponse sans cliquer. Si votre site n'est pas la source de cette réponse, vous perdez à la fois le clic et la visibilité.</p>

      <p><strong>Les visiteurs IA convertissent mieux.</strong> Un visiteur provenant d'une recommandation IA est <strong>4,4 fois plus enclin à convertir</strong> sur votre site. Pourquoi ? Parce qu'il a déjà fait son choix en conversant avec l'IA avant d'arriver chez vous. Il ne compare plus : il achète.</p>

      <p><strong>Le coût de l'inaction augmente chaque mois.</strong> Chaque mois sans stratégie GEO, ce sont vos concurrents qui sont cités à votre place. Et contrairement au SEO où les positions évoluent lentement, les citations IA se renouvellent en continu. Ne pas agir aujourd'hui, c'est laisser une place vide que d'autres occuperont.</p>

      <h2>Comment fonctionnent les moteurs IA</h2>

      <p>Pour optimiser votre site, il faut comprendre comment ces moteurs sélectionnent leurs sources. En simplifié, voici ce qui se passe quand un utilisateur pose une question à ChatGPT ou Perplexity :</p>

      <ol>
        <li><strong>Recherche.</strong> Le moteur IA interroge le web en temps réel (ou s'appuie sur ses données d'entraînement) pour trouver des contenus pertinents. C'est ce qu'on appelle le RAG — Retrieval-Augmented Generation.</li>
        <li><strong>Sélection.</strong> Parmi les dizaines de pages trouvées, l'IA sélectionne les sources les plus fiables, les plus claires et les plus pertinentes. Elle privilégie quatre signaux principaux :
          <ul>
            <li><strong>L'autorité</strong> : le site est-il reconnu comme expert sur le sujet ? Y a-t-il des mentions tierces, des backlinks, une présence médiatique ?</li>
            <li><strong>La structure</strong> : le contenu est-il organisé de manière lisible, avec des réponses directes, des sous-titres clairs, des données structurées (Schema.org) ?</li>
            <li><strong>La fraîcheur</strong> : le contenu est-il récent ou régulièrement mis à jour ?</li>
            <li><strong>L'extractibilité</strong> : l'IA peut-elle facilement extraire une phrase, un paragraphe, un chiffre pour l'intégrer dans sa réponse ?</li>
          </ul>
        </li>
        <li><strong>Synthèse.</strong> L'IA reformule et combine les informations des sources sélectionnées pour générer une réponse cohérente, en citant parfois les sources.</li>
      </ol>

      <p>La conséquence directe : si votre contenu est vague, mal structuré, non sourcé ou difficile à crawler, l'IA l'ignorera — même si votre site est premier sur Google.</p>

      <h2>Les 8 critères qui déterminent si une IA vous cite</h2>

      <p>Chez Detekia, nous avons formalisé ces signaux en 8 critères mesurables, pondérés selon leur impact réel sur la citabilité IA. C'est ce framework qui alimente notre score GEO sur 100.</p>

      <h3>1. Extractibilité & réponse directe — 25 points</h3>

      <p>C'est le critère le plus lourd, et pour cause : les IA cherchent des réponses prêtes à citer. Si votre page commence par du jargon ou une introduction floue, l'IA passera à la source suivante.</p>

      <p><strong>Ce que ça implique :</strong> chaque page doit contenir une réponse claire et directe dans les 100 premiers mots. Pensez "définition Wikipédia" : sujet + verbe + information essentielle.</p>

      <h3>2. Vérifiabilité & preuves — 20 points</h3>

      <p>Les IA favorisent les contenus qui avancent des preuves : chiffres sourcés, études citées, exemples concrets, dates précises. Un contenu qui affirme sans prouver sera moins souvent cité qu'un contenu qui donne des données vérifiables.</p>

      <p><strong>Ce que ça implique :</strong> intégrez des statistiques, des sources nommées, des cas concrets dans chaque page importante de votre site.</p>

      <h3>3. Autorité & E-E-A-T — 15 points</h3>

      <p>Google a formalisé le concept E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) pour évaluer la qualité d'un contenu. Les moteurs IA reprennent cette logique. Un site avec des auteurs identifiés, une page À propos complète, des mentions presse et des backlinks de qualité sera davantage cité.</p>

      <p><strong>Ce que ça implique :</strong> signez vos contenus, affichez votre expertise, créez votre page À propos, obtenez des mentions sur des sites tiers.</p>

      <h3>4. Crawlabilité IA — 15 points</h3>

      <p>Les bots IA (GPTBot, PerplexityBot, ClaudeBot, Google-Extended) doivent pouvoir accéder à votre site. Si votre <code>robots.txt</code> les bloque — ce qui est souvent le cas par défaut — ils ne peuvent tout simplement pas lire votre contenu.</p>

      <p><strong>Ce que ça implique :</strong> vérifiez votre <code>robots.txt</code>, configurez un fichier <code>llms.txt</code>, et assurez-vous que votre contenu est accessible sans JavaScript obligatoire.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Détails techniques dans notre article llms.txt, robots.txt et crawlabilité IA.</ArrowLink>

      <h3>5. Données structurées — 10 points</h3>

      <p>Le balisage Schema.org (JSON-LD) aide les IA à comprendre sans ambiguïté ce que contient votre page : qui est l'auteur, quel type d'organisation vous êtes, quelles questions vous répondez. Sans données structurées, l'IA doit deviner — et elle préfère les sites qui lui facilitent le travail.</p>

      <p><strong>Ce que ça implique :</strong> implémentez au minimum <code>Organization</code>, <code>Article</code> et <code>FAQPage</code> sur votre site.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Guide complet dans Schema.org et IA : le guide pratique pour être compris par les LLM.</ArrowLink>

      <h3>6. Neutralité éditoriale — 10 points</h3>

      <p>Les IA évitent de citer des contenus perçus comme trop promotionnels, exagérés ou biaisés. Un ton factuel, des comparaisons équilibrées et l'absence de superlatifs vides renforcent votre crédibilité auprès des LLM.</p>

      <p><strong>Ce que ça implique :</strong> adoptez un ton expert et factuel. Remplacez "nous sommes les meilleurs" par des preuves concrètes de votre expertise.</p>

      <h3>7. Présence externe — 5 points</h3>

      <p>Les IA croisent les sources. Si votre marque est mentionnée sur des sites tiers (presse, forums, Reddit, annuaires professionnels), elle gagne en crédibilité. C'est l'équivalent GEO du netlinking SEO.</p>

      <p><strong>Ce que ça implique :</strong> développez votre présence sur Reddit, les forums spécialisés, la presse sectorielle. Chaque mention renforce votre "LLM Share of Voice".</p>

      <h3>8. Fraîcheur & maintenance — 5 points</h3>

      <p>Un contenu mis à jour régulièrement signale aux IA qu'il est fiable et actuel. Les pages avec des dates obsolètes ou des informations périmées sont moins souvent citées.</p>

      <p><strong>Ce que ça implique :</strong> mettez à jour vos contenus clés au moins une fois par trimestre. Affichez clairement la date de dernière modification.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Pour comprendre en détail comment chaque critère est mesuré et pondéré, consultez Les 8 critères GEO qui déterminent si une IA vous cite.</ArrowLink>

      <InlineCTA href="/">Vous voulez connaître votre score sur ces 8 critères ?</InlineCTA>

      <h2>7 actions concrètes pour optimiser votre site</h2>

      <p>Passons à la pratique. Voici les 7 actions les plus impactantes, classées par ordre de priorité.</p>

      <h3>Action 1 — Répondre directement dans les 100 premiers mots</h3>

      <p>Chaque page stratégique de votre site doit commencer par une réponse claire à la question qu'elle traite. Pas d'introduction longue, pas de contexte superflu en premier.</p>

      <p>Exemple :</p>

      <pre><code>{`❌ "Dans le monde du marketing digital, il est aujourd'hui essentiel de comprendre les nouvelles tendances..."

✅ "Le GEO (Generative Engine Optimization) est l'ensemble des techniques qui permettent à un site web d'être cité par les IA comme ChatGPT, Gemini et Perplexity."`}</code></pre>

      <p>Le premier paragraphe est celui que l'IA extraira le plus souvent. Rendez-le irréprochable.</p>

      <h3>Action 2 — Ajouter des données chiffrées et des sources</h3>

      <p>Les IA privilégient les contenus vérifiables. Pour chaque affirmation importante, ajoutez :</p>

      <ul>
        <li>Un chiffre précis (<em>"527 %"</em> plutôt que <em>"forte hausse"</em>)</li>
        <li>Une source identifiable (<em>"selon Gartner"</em> plutôt que <em>"selon les experts"</em>)</li>
        <li>Une date (<em>"en 2026"</em> plutôt que <em>"récemment"</em>)</li>
      </ul>

      <p>Ces signaux de vérifiabilité augmentent significativement vos chances d'être cité.</p>

      <h3>Action 3 — Implémenter Schema.org</h3>

      <p>Le minimum indispensable pour commencer :</p>

      <ul>
        <li><code>Organization</code> sur votre homepage : nom, logo, URL, coordonnées</li>
        <li><code>Article</code> sur chaque contenu éditorial : titre, auteur, date, description</li>
        <li><code>FAQPage</code> sur les pages contenant des questions-réponses</li>
      </ul>

      <p>Le format JSON-LD est recommandé : il s'ajoute dans le <code>&lt;head&gt;</code> de vos pages sans toucher au HTML visible.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Suivez notre guide pas à pas pour implémenter Schema.org.</ArrowLink>

      <h3>Action 4 — Ouvrir l'accès aux bots IA</h3>

      <p>Vérifiez immédiatement votre fichier <code>robots.txt</code>. Si vous voyez des lignes comme :</p>

      <pre><code>{`User-agent: GPTBot
Disallow: /`}</code></pre>

      <p>…vous bloquez activement ChatGPT. Supprimez ces restrictions (sauf raison stratégique documentée) et créez un fichier <code>llms.txt</code> à la racine de votre site pour guider les crawlers IA.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Configuration complète dans llms.txt, robots.txt et crawlabilité IA.</ArrowLink>

      <h3>Action 5 — Créer du contenu FAQ avec des questions naturelles</h3>

      <p>Les IA sont entraînées sur des conversations en langage naturel. Structurez vos FAQ avec les vraies questions que posent vos clients :</p>

      <ul>
        <li>"Comment choisir un [votre produit/service] ?"</li>
        <li>"Quelle est la différence entre [A] et [B] ?"</li>
        <li>"Combien coûte [votre prestation] ?"</li>
      </ul>

      <p>Chaque réponse doit être autonome (compréhensible sans contexte), factuelle et concise (2-4 phrases). Balisez le tout en <code>FAQPage</code> Schema.org.</p>

      <h3>Action 6 — Développer votre présence externe</h3>

      <p>Les IA croisent les sources. Plus votre marque est mentionnée sur des sites tiers crédibles, plus elle est jugée fiable. Actions prioritaires :</p>

      <ul>
        <li><strong>Reddit</strong> : identifiez 5-10 subreddits liés à votre secteur. Répondez à des questions avec expertise, sans promotion directe.</li>
        <li><strong>Presse sectorielle</strong> : proposez des tribunes, des interviews, des données exclusives.</li>
        <li><strong>Forums et communautés</strong> : participez activement avec des conseils actionnables.</li>
      </ul>

      <p>Reddit est la première plateforme citée par les LLM en 2026. Votre marque doit y être présente.</p>

      <h3>Action 7 — Mettre à jour régulièrement</h3>

      <p>Les IA favorisent les contenus frais. Mettez en place un calendrier de mise à jour :</p>

      <ul>
        <li><strong>Trimestriel</strong> pour vos pages piliers (guides, pages services)</li>
        <li><strong>Mensuel</strong> pour vos articles de blog à fort trafic</li>
        <li><strong>Immédiat</strong> quand des données clés changent (prix, stats, réglementation)</li>
      </ul>

      <p>Affichez toujours la date de dernière mise à jour de manière visible.</p>

      <h2>SEO et GEO : complémentaires, pas concurrents</h2>

      <p>Si vous faites déjà du SEO, vous avez une longueur d'avance. Le GEO ne remplace pas le SEO — il s'empile dessus.</p>

      <p>Un chiffre le confirme : <strong>99 % des sources citées dans les AI Overviews de Google proviennent du top 10 des résultats organiques</strong>. Autrement dit, un bon SEO reste la condition nécessaire pour être cité par les IA.</p>

      <p>La stratégie optimale en 2026 combine trois couches :</p>

      <ol>
        <li><strong>SEO (fondation)</strong> : architecture technique solide, backlinks, expérience utilisateur, vitesse de chargement. C'est le socle.</li>
        <li><strong>AEO (pont)</strong> : structuration pour les featured snippets, les blocs "People Also Ask", les recherches vocales. C'est la transition.</li>
        <li><strong>GEO (évolution)</strong> : contenus extractibles, structure lisible par les IA, densité informationnelle, autorité d'entité. C'est la couche qui fait la différence en 2026.</li>
      </ol>

      <p>Les deux disciplines partagent les mêmes fondamentaux de qualité. Si vous produisez déjà du contenu expert, bien structuré et régulièrement mis à jour, vous êtes à mi-chemin. Le GEO ajoute une couche d'optimisation spécifique pour les moteurs génératifs.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">Comparaison détaillée dans SEO vs GEO : quelles différences et comment les combiner en 2026.</ArrowLink>

      <h2>Comment mesurer sa visibilité IA</h2>

      <p>Le principal obstacle au GEO, c'est la mesure. Il n'existe pas de "Google Search Console" pour les IA. Vous ne pouvez pas savoir directement combien de fois ChatGPT vous a cité.</p>

      <p>Trois approches complémentaires :</p>

      <ol>
        <li><strong>Le test manuel.</strong> Posez à ChatGPT, Gemini et Perplexity les questions que vos clients se posent. Votre site apparaît-il dans les réponses ? Vos concurrents sont-ils cités à votre place ? C'est le diagnostic de base.</li>
        <li><strong>L'audit technique.</strong> Analysez votre site sur les critères qui déterminent la citabilité : structure HTML, données structurées, crawlabilité, contenu extractible. C'est ce que fait Detekia automatiquement.</li>
        <li><strong>Le suivi dans le temps.</strong> Mesurez l'évolution de votre score après chaque optimisation. Un contenu amélioré peut se retrouver dans les réponses IA en quelques semaines pour les aspects techniques, et en 8 à 12 semaines pour les citations à proprement parler.</li>
      </ol>

      <p>Detekia analyse votre site en 30 secondes sur les 8 critères GEO, vous attribue un score sur 100 et vous donne des recommandations priorisées par impact. Le diagnostic est gratuit, sans inscription.</p>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">Pour comprendre comment interpréter votre score et prioriser vos actions, consultez Score GEO : comment mesurer la visibilité IA de votre site.</ArrowLink>

      <h2>Questions fréquentes</h2>

      <h3>Le GEO remplace-t-il le SEO ?</h3>

      <p>Non. Le GEO est une évolution du SEO, pas un remplacement. Les moteurs IA s'appuient encore largement sur les signaux SEO traditionnels (autorité de domaine, qualité du contenu, backlinks) pour sélectionner leurs sources. Un bon SEO reste la fondation indispensable. Le GEO ajoute une couche d'optimisation spécifique pour maximiser vos chances d'être cité dans les réponses générées.</p>

      <h3>Combien de temps avant de voir des résultats ?</h3>

      <p>Les optimisations techniques (robots.txt, Schema.org, structure HTML) produisent des effets en 2 à 4 semaines. Les résultats en termes de citations IA apparaissent généralement en 8 à 12 semaines, selon le volume de contenu optimisé et la compétitivité de votre secteur. Le GEO est un investissement qui se renforce dans le temps grâce à l'accumulation d'autorité.</p>

      <h3>Faut-il optimiser pour chaque IA séparément ?</h3>

      <p>Non. ChatGPT, Gemini, Perplexity et Claude utilisent des architectures différentes, mais ils cherchent tous les mêmes signaux de qualité : contenu structuré, sources vérifiables, autorité thématique, fraîcheur. En optimisant sur ces critères universels, vous améliorez votre visibilité sur l'ensemble des moteurs génératifs.</p>

      <h3>Mon site WordPress peut-il être optimisé pour le GEO ?</h3>

      <p>Absolument. Les actions GEO sont indépendantes de la technologie : elles portent sur le contenu, la structure et les métadonnées. Que votre site soit sur WordPress, Shopify, Next.js ou un CMS propriétaire, les mêmes principes s'appliquent. Des plugins comme Yoast ou Rank Math facilitent l'ajout de données structurées sur WordPress.</p>

      <h2>Ce qu'il faut retenir</h2>

      <p>Le GEO n'est pas une tendance passagère — c'est la nouvelle réalité du référencement. Les moteurs IA captent une part croissante des recherches, et les sites qui ne sont pas optimisés pour être cités deviennent progressivement invisibles.</p>

      <p>La bonne nouvelle : les actions à mener sont concrètes, mesurables et accessibles. Structurez votre contenu pour qu'il soit extractible, ajoutez des preuves vérifiables, ouvrez l'accès aux bots IA, et suivez votre score dans le temps.</p>

      <p>Commencez par mesurer votre situation actuelle. Analysez votre site gratuitement sur Detekia — score sur 100, 8 critères, recommandations priorisées, en 30 secondes.</p>
    </>
  );
}
