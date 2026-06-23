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
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6B6762', marginBottom: 12 }}>{children}</p>
      <a href={href} style={{ display: 'inline-block', background: '#D97757', color: '#fff', borderRadius: 8, padding: '11px 28px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
        Tester mon site gratuitement →
      </a>
    </div>
  );
}

export default function PourquoiTraficGoogleBaisse2026() {
  return (
    <>
      <p>Votre trafic organique Google baisse depuis plusieurs mois et vous ne comprenez pas pourquoi. Votre SEO n'a pas changé, vos positions sont stables, et pourtant les clics diminuent. La raison est structurelle : en 2026, Google n'envoie plus autant de visiteurs qu'avant, parce qu'il répond lui-même aux questions de vos visiteurs, directement dans les résultats, grâce à l'IA.</p>

      <p>Ce phénomène touche tous les secteurs. Et il va s'accélérer. Voici ce qui se passe, pourquoi ça vous concerne, et surtout comment réagir.</p>

      <h2>Ce qui a changé : Google répond à la place de votre site</h2>

      <p>Depuis le déploiement massif des <strong>AI Overviews</strong> (anciennement SGE), Google affiche un résumé généré par IA en haut de ses résultats pour un nombre croissant de requêtes. L'utilisateur obtient sa réponse sans cliquer sur aucun lien.</p>

      <p>Les chiffres sont sans appel :</p>

      <ul>
        <li><strong>58,5 % des recherches Google</strong> aux États-Unis se terminent désormais sans aucun clic (SparkToro/Datos, 2024). Ce taux monte à <strong>83 %</strong> sur les requêtes qui déclenchent un AI Overview.</li>
        <li>Sur ces mêmes requêtes, le <strong>taux de clic organique a chuté de 61 %</strong>, passant de 1,76 % à 0,61 % (Seer Interactive, 2025).</li>
        <li>Les <strong>AI Overviews de Google touchent 2 milliards d'utilisateurs mensuels</strong> dans plus de 100 pays (Sundar Pichai, Alphabet Q3 2025).</li>
      </ul>

      <p>Concrètement : même si vous êtes premier sur Google pour votre requête cible, une part croissante de vos visiteurs potentiels ne clique plus. Ils lisent le résumé IA et passent à autre chose.</p>

      <h2>Ce n'est pas que Google : ChatGPT, Perplexity et les autres captent vos visiteurs</h2>

      <p>Le problème ne se limite pas aux AI Overviews. En parallèle, une partie de votre audience a tout simplement <strong>changé de moteur de recherche</strong>.</p>

      <ul>
        <li><strong>ChatGPT</strong> traite 2,5 milliards de requêtes par jour et 810 millions de personnes l'utilisent quotidiennement (Search Engine Land, 2026).</li>
        <li>Le <strong>trafic référé par les IA</strong> a augmenté de <strong>527 %</strong> au premier semestre 2025 (Previsible, 2025).</li>
        <li><strong>Gartner prévoit une baisse de 25 %</strong> du volume de recherche traditionnelle d'ici fin 2026.</li>
        <li>En France, <strong>44 % des actifs</strong> utilisent déjà l'IA générative au quotidien.</li>
      </ul>

      <p>Vos prospects ne tapent plus "meilleur [votre produit] 2026" dans Google. Ils le demandent à ChatGPT. Et si votre site n'est pas optimisé pour être cité dans cette réponse, vous n'existez pas pour eux.</p>

      <ArrowLink href="/blog/pourquoi-chatgpt-ne-cite-pas-votre-site">Pourquoi ChatGPT ne cite pas votre site (et comment y remédier)</ArrowLink>

      <h2>5 signes que l'IA impacte déjà votre trafic</h2>

      <p>Comment savoir si c'est bien l'IA qui cause votre baisse de trafic et pas un problème SEO classique ? Voici les signaux à surveiller :</p>

      <h3>1. Vos positions sont stables mais vos clics baissent</h3>

      <p>Ouvrez Google Search Console. Si vos impressions restent constantes (ou augmentent) mais que vos clics diminuent, c'est le signe que Google répond à la place de votre site. L'utilisateur voit votre résultat, mais ne clique plus parce qu'il a déjà sa réponse via l'AI Overview.</p>

      <h3>2. Vos requêtes informationnelles sont les plus touchées</h3>

      <p>Les requêtes du type "comment faire X", "qu'est-ce que Y", "différence entre A et B" sont les premières à être cannibalisées par les IA. Si votre trafic baisse surtout sur ce type de requêtes, c'est cohérent avec l'impact IA.</p>

      <h3>3. Vous voyez des AI Overviews sur vos requêtes cibles</h3>

      <p>Tapez vos 10 requêtes principales dans Google (en navigation privée). Si un résumé IA apparaît en haut des résultats sur la majorité d'entre elles, vos contenus sont directement concurrencés par la réponse de Google lui-même.</p>

      <h3>4. Vos concurrents sont cités par les IA et pas vous</h3>

      <p>Posez à ChatGPT et Perplexity les questions que vos clients vous posent habituellement. Si vos concurrents apparaissent dans les réponses et pas vous, vous avez un problème de visibilité IA, pas un problème SEO.</p>

      <h3>5. Votre trafic "direct" augmente légèrement</h3>

      <p>Paradoxalement, certains sites voient leur trafic direct augmenter alors que l'organique baisse. Explication : des utilisateurs découvrent votre marque via une citation IA, puis tapent directement votre nom dans leur navigateur. C'est un signal positif, mais il masque la réalité de la baisse organique.</p>

      <InlineCTA href="/">Votre site est-il visible par les IA ? Diagnostic gratuit en moins de 60 secondes.</InlineCTA>

      <h2>Pourquoi le SEO seul ne suffit plus</h2>

      <p>Si vous avez un bon SEO, vous avez une longueur d'avance. Mais le SEO seul ne garantit plus la visibilité en 2026. Voici pourquoi :</p>

      <p><strong>Le SEO optimise pour les liens. Le GEO optimise pour les citations.</strong> Être premier dans une liste de 10 liens bleus n'a plus la même valeur quand l'utilisateur lit un résumé IA avant de voir cette liste, ou ne la voit jamais.</p>

      <p><strong>80 % des URLs citées par ChatGPT ne sont pas dans le top 100 de Google</strong> (Ahrefs, 2025). Ce chiffre montre que les critères de sélection des IA sont différents de ceux de Google. Un site peut être invisible sur Google et très bien cité par les IA. Et inversement.</p>

      <p><strong>99 % des sources citées dans les AI Overviews de Google</strong> proviennent quand même du top 10 des résultats organiques. Le SEO reste la fondation. Mais il faut ajouter une couche d'optimisation spécifique pour que votre contenu soit non seulement trouvé, mais aussi <strong>cité</strong>.</p>

      <p>Cette couche, c'est le GEO, Generative Engine Optimization.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : quelles différences et comment les combiner en 2026</ArrowLink>

      <h2>Comment réagir : 6 actions immédiates</h2>

      <h3>Action 1 — Diagnostiquer votre visibilité IA</h3>

      <p>Avant d'agir, mesurez. Analysez votre site sur les 7 critères qui déterminent si une IA vous cite : citabilité du contenu, vérifiabilité des données, autorité E-E-A-T, accessibilité IA, neutralité éditoriale, présence externe et fraîcheur.</p>

      <p>Detekia analyse automatiquement ces 7 critères et vous donne un score sur 100 en moins de 60 secondes. C'est gratuit et sans inscription.</p>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">Score GEO : comment mesurer la visibilité IA de votre site</ArrowLink>

      <h3>Action 2 — Ouvrir l'accès aux bots IA</h3>

      <p>Vérifiez votre fichier <code>robots.txt</code>. Par défaut, beaucoup de CMS bloquent les bots IA (GPTBot, ClaudeBot, PerplexityBot). Si ces bots ne peuvent pas lire votre contenu, impossible d'être cité.</p>

      <p>Créez également un fichier <code>llms.txt</code> à la racine de votre site. C'est l'équivalent du <code>robots.txt</code> pour les IA : il leur indique quelles pages sont les plus importantes et comment interpréter votre contenu.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Guide complet : llms.txt, robots.txt et accessibilité IA</ArrowLink>

      <h3>Action 3 — Restructurer vos contenus pour l'extraction</h3>

      <p>Les IA cherchent des réponses prêtes à citer. Reprenez vos 5 pages les plus importantes et assurez-vous que :</p>

      <ul>
        <li>Les <strong>100 premiers mots</strong> contiennent une réponse claire et directe à la question principale.</li>
        <li>Chaque section H2 est <strong>autonome</strong> : compréhensible et citable sans avoir lu le reste de la page.</li>
        <li>Les données chiffrées sont <strong>sourcées</strong> avec le nom de l'étude et l'année.</li>
        <li>Les listes à puces et tableaux sont utilisés pour les comparaisons et les étapes.</li>
      </ul>

      <h3>Action 4 — Ajouter des données structurées Schema.org</h3>

      <p>Les données structurées aident les IA à comprendre ce que contient votre page. Le minimum : <code>Organization</code> sur votre homepage, <code>Article</code> sur vos contenus éditoriaux, <code>FAQPage</code> sur vos pages de questions-réponses.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA : le guide pratique pour être compris par les LLM</ArrowLink>

      <h3>Action 5 — Être présent sur les sources que les IA citent</h3>

      <p>Les IA croisent les sources. Reddit est la plateforme la plus citée par les LLM en 2026. Si votre marque est mentionnée sur Reddit, dans la presse spécialisée, ou sur des forums pertinents, votre crédibilité augmente auprès des IA.</p>

      <p>Identifiez 5 subreddits liés à votre secteur et commencez à y répondre avec expertise. Pas de promotion directe, de la valeur pure.</p>

      <ArrowLink href="/blog/reddit-geo-source-ia">Reddit et GEO : pourquoi Reddit est la source n°1 citée par les IA</ArrowLink>

      <h3>Action 6 — Surveiller vos concurrents dans les IA</h3>

      <p>Posez à ChatGPT, Gemini et Perplexity les 10 questions que vos clients posent le plus souvent. Notez qui est cité, dans quel contexte, et quels arguments sont mis en avant. C'est votre benchmark de départ.</p>

      <p>Si vos concurrents sont cités et pas vous, le gap est identifié et il est comblable.</p>

      <ArrowLink href="/blog/concurrents-chatgpt-visibilite">ChatGPT cite vos concurrents ? Voici comment reprendre votre place</ArrowLink>

      <h2>Le cas des e-commerçants : un impact double</h2>

      <p>Si vous gérez une boutique en ligne, l'impact est encore plus direct. Les IA ne font pas que répondre à des questions. Elles recommandent des produits. Quand quelqu'un demande à ChatGPT "meilleur aspirateur robot 2026", l'IA propose une sélection. Si vos fiches produits ne sont pas optimisées (Schema Product, avis clients, données structurées), vous n'apparaissez pas dans cette sélection.</p>

      <ArrowLink href="/blog/ecommerce-recommandations-ia">E-commerce : comment apparaître dans les recommandations produits des IA</ArrowLink>

      <h2>Ce qu'il faut retenir</h2>

      <p>La baisse de trafic Google en 2026 n'est pas un bug. C'est un changement structurel du fonctionnement de la recherche. Les AI Overviews, ChatGPT, Perplexity et les autres captent une part croissante des recherches et répondent directement aux utilisateurs.</p>

      <p>Les sites qui s'adaptent maintenant en optimisant leur contenu pour être cité par les IA (et pas seulement pour être classé par Google) prendront une avance décisive. Ceux qui attendent verront leur trafic continuer à baisser, mois après mois.</p>

      <p>Le premier pas est simple : mesurez où vous en êtes. Analysez votre site gratuitement sur Detekia, score GEO sur 100, 7 critères analysés, recommandations concrètes, en moins de 60 secondes.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour être cité par les IA en 2026</ArrowLink>
      <InlineCTA href="/">Votre trafic baisse ? Découvrez si les IA en sont la cause.</InlineCTA>
    </>
  );
}
