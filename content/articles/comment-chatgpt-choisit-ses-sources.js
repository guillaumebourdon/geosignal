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

export default function CommentChatgptChoisitSesSources() {
  return (
    <>
      <p>Quand vous posez une question à ChatGPT, il ne tape pas votre requête dans Google. Il ne parcourt pas non plus un index de pages web en temps réel. Il utilise un processus appelé <strong>RAG</strong> (Retrieval-Augmented Generation) : un mécanisme qui sélectionne des sources pertinentes, les injecte dans son contexte, puis génère une réponse synthétique basée sur ces sources.</p>

      <p>Comprendre ce mécanisme est la clé pour être cité. Si vous ne savez pas comment ChatGPT sélectionne ses sources, vous optimisez à l'aveugle. Cet article décortique le fonctionnement complet : les bots, le moteur de recherche utilisé, les critères de sélection, ce qui est ignoré, et les moyens concrets pour apparaître dans ses réponses.</p>

      <h2>Le fonctionnement de ChatGPT Search : trois bots, trois rôles</h2>

      <p>OpenAI utilise trois bots distincts pour alimenter ChatGPT en données web. Chacun a un rôle précis, et les confondre est une erreur courante.</p>

      <p><strong>GPTBot</strong> (user-agent : <code>GPTBot</code>) est le crawler d'entraînement. Il parcourt le web pour collecter des données destinées à l'entraînement des modèles. Si vous le bloquez dans votre <code>robots.txt</code>, vos contenus ne seront pas intégrés dans les futures versions de GPT. Mais cela n'affecte pas les réponses en temps réel.</p>

      <p><strong>ChatGPT-User</strong> (user-agent : <code>ChatGPT-User</code>) est le bot de navigation en temps réel. Quand un utilisateur pose une question et que ChatGPT décide de chercher sur le web, c'est ChatGPT-User qui effectue les requêtes. Bloquer ce bot signifie que ChatGPT ne pourra jamais citer votre site dans ses réponses avec sources web.</p>

      <p><strong>OAI-SearchBot</strong> (user-agent : <code>OAI-SearchBot</code>) est le plus récent. Introduit fin 2024, il est dédié spécifiquement à ChatGPT Search et fonctionne de manière similaire à ChatGPT-User mais avec des patterns de crawl optimisés pour l'extraction de contenu.</p>

      <p>Le piège : selon une étude SE Ranking (2025), <strong>73 % des sites bloquent au moins un de ces bots sans le savoir</strong>, souvent via des règles <code>robots.txt</code> trop restrictives héritées d'anciennes configurations. Un simple <code>Disallow: /</code> appliqué à tous les bots suffit à vous rendre invisible.</p>

      <ArrowLink href="/blog/sites-bloquent-bots-ia">73 % des sites bloquent les bots IA sans le savoir : vérifiez le vôtre</ArrowLink>

      <h2>Le rôle de Bing : le moteur que personne n'optimise</h2>

      <p>Voici l'information que la plupart des guides GEO passent sous silence : <strong>ChatGPT utilise Bing comme moteur de recherche, pas Google</strong>.</p>

      <p>Quand ChatGPT Search active une recherche web, la requête est envoyée à l'API Bing. Les résultats sont ensuite filtrés, réordonnés et synthétisés par le modèle. Concrètement, cela signifie que votre positionnement sur Google n'a <strong>aucun impact direct</strong> sur votre visibilité dans ChatGPT.</p>

      <p>Les implications sont significatives :</p>

      <ul>
        <li><strong>Bing Webmaster Tools</strong> devient un outil stratégique. Si votre site n'est pas correctement indexé sur Bing, ChatGPT ne le verra pas.</li>
        <li><strong>IndexNow</strong>, le protocole de soumission instantanée supporté par Bing (mais pas par Google), permet de signaler vos nouvelles pages en temps réel.</li>
        <li>Les <strong>critères de classement de Bing</strong> diffèrent de ceux de Google : Bing accorde plus de poids aux signaux sociaux, aux données structurées et à la fraîcheur du contenu (source : Ahrefs 2025).</li>
      </ul>

      <p>En pratique, un site très bien positionné sur Google mais absent de Bing sera invisible pour ChatGPT. Et inversement : un site moyen sur Google mais bien indexé sur Bing peut très bien être cité régulièrement.</p>

      <InlineCTA href="/">Votre site est-il visible par ChatGPT ? Vérifiez votre score GEO en moins de 60 secondes.</InlineCTA>

      <h2>Les critères de sélection des sources : ce que la recherche nous dit</h2>

      <p>Plusieurs études académiques et analyses SEO ont mesuré les facteurs qui influencent la citation par ChatGPT. Voici les résultats les plus significatifs.</p>

      <h3>L'autorité de domaine : le facteur dominant</h3>

      <p>Selon l'étude SE Ranking (2025) portant sur 10 000 requêtes ChatGPT avec sources, l'autorité de domaine est le prédicteur le plus fort de citation, avec un <strong>score SHAP de 0.63</strong> (sur une échelle où 1.0 = corrélation parfaite). Aucun autre facteur ne s'en approche. Les domaines avec une autorité élevée (DA &gt; 70) sont cités 3.8 fois plus souvent que les domaines faibles (DA &lt; 30).</p>

      <p>Cela ne signifie pas que les petits sites n'ont aucune chance. Mais cela signifie que pour compenser un déficit d'autorité, il faut exceller sur tous les autres critères.</p>

      <h3>La longueur du contenu : un signal clair</h3>

      <p>Les données montrent une corrélation directe entre longueur et citation. Les pages de <strong>plus de 2 900 mots obtiennent en moyenne 5.1 citations</strong> dans les réponses ChatGPT, contre <strong>3.2 pour les pages de moins de 800 mots</strong> (source : SE Ranking 2025). L'explication est logique : un contenu long offre plus de passages extractibles et couvre davantage de sous-questions que le modèle pourrait poser.</p>

      <p>Attention : il ne s'agit pas de gonfler artificiellement vos textes. ChatGPT valorise la <strong>densité informationnelle</strong>. Un article de 3 000 mots rempli de généralités sera moins cité qu'un article de 1 500 mots contenant des données originales et des analyses vérifiables.</p>

      <h3>La fraîcheur du contenu</h3>

      <p>ChatGPT privilégie les contenus récents, particulièrement pour les requêtes liées à l'actualité ou aux tendances. Un article mis à jour dans les 30 derniers jours a significativement plus de chances d'être cité qu'un contenu datant de plus de 6 mois. Bing, le moteur sous-jacent, utilise la date de dernière modification comme signal de classement (source : Growth Memo 2026).</p>

      <h3>Les sources vérifiables</h3>

      <p>Les contenus qui citent leurs propres sources (études, données chiffrées, références académiques) sont favorisés. L'étude de Princeton et Georgia Tech (KDD 2024) sur les moteurs génératifs a montré que l'ajout de <strong>citations et de statistiques augmente la visibilité de 30 à 40 %</strong> dans les réponses IA. ChatGPT peut vérifier la cohérence des affirmations en croisant les sources, un contenu auto-référencé sans preuve externe sera moins bien classé.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">Le guide complet du GEO en 2026 : stratégie, critères et plan d'action</ArrowLink>

      <h2>Ce que ChatGPT ignore (et ce qui ne sert à rien)</h2>

      <p>Aussi important que de savoir ce qui fonctionne : comprendre ce qui ne fonctionne pas. Plusieurs pratiques couramment recommandées n'ont aucun impact mesurable sur la citation par ChatGPT.</p>

      <h3>Le keyword stuffing</h3>

      <p>Contrairement aux moteurs de recherche traditionnels, ChatGPT ne classe pas les pages par densité de mots-clés. Il comprend le <strong>sens sémantique</strong> du contenu. Répéter 47 fois "meilleur outil GEO" dans votre page ne vous fera pas citer davantage. Et pourrait même être interprété comme un signal de faible qualité éditoriale.</p>

      <h3>Le contenu promotionnel</h3>

      <p>Les pages produit purement commerciales ("Notre solution est la meilleure du marché") sont rarement citées. ChatGPT privilégie les contenus informatifs et éducatifs. Une page qui explique <strong>comment résoudre un problème</strong> sera toujours citée avant une page qui explique pourquoi acheter votre produit.</p>

      <h3>Le fichier llms.txt</h3>

      <p>Contrairement à une idée reçue qui circule depuis fin 2024, le fichier <code>llms.txt</code> (un fichier placé à la racine du site pour "guider" les LLM) <strong>n'a pas d'impact prouvé</strong> sur la citation par ChatGPT. L'étude SE Ranking (2025) n'a trouvé aucune corrélation significative entre la présence d'un <code>llms.txt</code> et la fréquence de citation. ChatGPT ne le lit pas de manière systématique et ne l'utilise pas comme signal de classement.</p>

      <p>Cela ne signifie pas qu'il faut le supprimer si vous l'avez déjà. Il peut servir pour d'autres IA. Mais investir du temps à l'optimiser au détriment d'autres critères est une erreur de priorité.</p>

      <h2>Les plateformes qui boostent votre visibilité</h2>

      <p>L'un des résultats les plus frappants des études récentes concerne le rôle des <strong>plateformes tierces</strong> dans la citation par ChatGPT. Votre site n'est pas évalué isolément, ChatGPT croise votre présence sur l'ensemble du web.</p>

      <h3>Reddit et Quora : des sources privilégiées</h3>

      <p>Reddit est la plateforme externe la plus citée par ChatGPT, toutes catégories confondues. Quand un utilisateur demande "quel outil utiliser pour X", ChatGPT cite fréquemment des threads Reddit où cet outil est mentionné et recommandé par des utilisateurs. Les discussions organiques sur Reddit servent de <strong>signal de validation sociale</strong> que ChatGPT interprète comme un indicateur de fiabilité.</p>

      <p>Quora joue un rôle similaire, particulièrement pour les requêtes en format question-réponse.</p>

      <ArrowLink href="/blog/reddit-geo-source-ia">Reddit est devenu la première source des IA : comment en profiter</ArrowLink>

      <h3>Les sites d'avis : un multiplicateur de citations</h3>

      <p>Les données sont claires : les domaines présents sur <strong>plusieurs plateformes d'avis</strong> (G2, Trustpilot, Capterra, Google Reviews) obtiennent en moyenne <strong>4.6 à 6.3 citations</strong> dans les réponses ChatGPT, contre seulement <strong>1.8 pour les domaines absents</strong> de ces plateformes (source : SE Ranking 2025).</p>

      <p>L'explication est double. D'abord, les avis constituent des contenus tiers vérifiables, exactement ce que ChatGPT recherche pour étayer ses recommandations. Ensuite, la présence sur ces plateformes renforce l'autorité perçue du domaine dans l'index Bing.</p>

      <p>Les actions concrètes :</p>

      <ul>
        <li>Créez et maintenez des profils sur <strong>G2, Trustpilot et Capterra</strong> (pour le B2B) ou <strong>Google Reviews et TripAdvisor</strong> (pour le B2C)</li>
        <li>Sollicitez activement des avis clients : un minimum de <strong>10 avis récents</strong> semble nécessaire pour avoir un impact</li>
        <li>Répondez aux avis (positifs et négatifs) : l'activité du profil est un signal supplémentaire</li>
        <li>Intégrez les avis sur votre site avec le schema <code>AggregateRating</code> pour que ChatGPT puisse les lire directement</li>
      </ul>

      <InlineCTA href="/">Detekia mesure votre présence externe et vos données structurées, testez votre site gratuitement.</InlineCTA>

      <h2>Comment vérifier si ChatGPT vous connaît</h2>

      <p>Avant d'optimiser, il faut mesurer. Voici deux méthodes complémentaires pour évaluer votre visibilité actuelle.</p>

      <h3>Le test manuel</h3>

      <p>Ouvrez ChatGPT (modèle GPT-4o avec navigation web activée) et posez des requêtes que vos clients poseraient. Par exemple :</p>

      <ul>
        <li>"Quel est le meilleur [votre catégorie] en France ?"</li>
        <li>"[Votre marque] avis" : ChatGPT vous connaît-il ?</li>
        <li>"Comparatif [votre secteur] 2026"</li>
        <li>Une question technique pointue dans votre domaine d'expertise</li>
      </ul>

      <p>Notez si votre site est cité, si vos concurrents le sont, et si les informations sont correctes. Répétez le test sur Perplexity et Gemini pour avoir une vue complète.</p>

      <h3>L'analyse automatisée avec Detekia</h3>

      <p>Le test manuel donne une indication qualitative, mais il n'est pas reproductible et ne couvre qu'un échantillon de requêtes. <InternalLink href="/">Detekia</InternalLink> automatise le diagnostic en analysant les 7 critères GEO de votre site : citabilité du contenu, vérifiabilité des informations, autorité E-E-A-T, accessibilité IA par les bots IA, données structurées, neutralité éditoriale, présence externe et fraîcheur.</p>

      <p>Le score sur 100 vous donne une mesure objective et comparable dans le temps. Les recommandations priorisées vous indiquent exactement quoi corriger en premier pour maximiser votre impact.</p>

      <ArrowLink href="/blog/pourquoi-chatgpt-ne-cite-pas-votre-site">Pourquoi ChatGPT ne cite pas votre site (et comment corriger)</ArrowLink>

      <h2>Ce qu'il faut retenir</h2>

      <p>ChatGPT ne fonctionne pas comme Google. Son processus de sélection des sources repose sur Bing, sur l'autorité de domaine, sur la qualité et la longueur du contenu, sur la présence de données vérifiables, et sur votre empreinte sur les plateformes tierces. Le keyword stuffing, le contenu promotionnel et le fichier <code>llms.txt</code> n'ont pas d'impact significatif.</p>

      <p>Les trois actions les plus efficaces, par ordre de priorité :</p>

      <ol>
        <li><strong>Vérifiez que vos bots IA ne sont pas bloqués</strong> : c'est le prérequis absolu</li>
        <li><strong>Produisez du contenu long, factuel et sourcé</strong> : visez plus de 2 000 mots avec des données vérifiables</li>
        <li><strong>Développez votre présence externe</strong> : Reddit, plateformes d'avis, mentions presse</li>
      </ol>

      <p>Le GEO n'est pas une mode. C'est un changement structurel dans la manière dont les utilisateurs accèdent à l'information. Les sites qui s'adaptent maintenant auront un avantage considérable sur ceux qui attendront que le phénomène devienne impossible à ignorer.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et JSON-LD : le guide complet pour la visibilité IA</ArrowLink>
    </>
  );
}
