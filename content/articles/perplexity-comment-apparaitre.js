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

export default function PerplexityCommentApparaitre() {
  return (
    <>
      <p>Perplexity est le moteur de recherche IA qui monte. Avec plusieurs centaines de millions de requêtes par mois en 2026 et une croissance à trois chiffres sur l'année écoulée, il s'impose comme une alternative sérieuse à Google pour les utilisateurs qui cherchent des réponses synthétiques, sourcées et actualisées. Ne pas y apparaître, c'est perdre un flux de trafic hautement qualifié. Et qui, lui, clique.</p>

      <p>Contrairement à ChatGPT, qui s'appuie sur Bing, Perplexity a construit son propre index web. Ses critères de sélection, ses sources privilégiées et ses mécanismes de citation sont spécifiques. Ce guide explique comment Perplexity fonctionne réellement et détaille cinq actions concrètes pour s'y rendre visible.</p>

      <h2>Comment Perplexity fonctionne</h2>

      <p>Perplexity repose sur une architecture <strong>RAG</strong> (Retrieval-Augmented Generation), mais avec une particularité : le moteur <strong>crawle le web en temps réel</strong> via son propre index, complété par des partenariats de données. Quand vous posez une question, Perplexity exécute une recherche immédiate, lit les pages les plus pertinentes, puis synthétise une réponse en citant chaque source avec un lien cliquable.</p>

      <p>Le processus se décompose en quatre étapes :</p>

      <ol>
        <li><strong>Interprétation de la requête</strong> : Perplexity reformule la question de l'utilisateur en plusieurs requêtes de recherche intermédiaires pour couvrir toutes les facettes du sujet.</li>
        <li><strong>Recherche dans l'index</strong> : le moteur interroge son propre index web, crawlé en continu par le bot <code>PerplexityBot</code> (et <code>Perplexity-User</code> pour la navigation en temps réel).</li>
        <li><strong>Extraction et ranking</strong> : les pages retournées sont classées selon des signaux de pertinence, d'autorité et de fraîcheur.</li>
        <li><strong>Synthèse avec citations</strong> : le modèle génère une réponse en injectant des numéros de citation <code>[1][2][3]</code> renvoyant vers les sources utilisées.</li>
      </ol>

      <p>Différence majeure avec ChatGPT : <strong>chaque affirmation est liée à une source vérifiable</strong>. Perplexity affiche systématiquement les URLs utilisées, ce qui rend ses réponses plus transparentes mais aussi plus exigeantes sur la qualité des sources citées.</p>

      <h2>Ce que Perplexity valorise dans un site</h2>

      <p>L'analyse des citations Perplexity par Profound (2025) et Growth Memo (2026) permet d'identifier les critères réellement discriminants. Les patterns sont clairs et diffèrent sensiblement de ceux de ChatGPT ou de Google.</p>

      <p><strong>Le contenu factuel et sourcé</strong> arrive en tête. Perplexity privilégie les pages qui citent leurs propres sources (études, statistiques, références académiques). Un article qui affirme "les ventes ont progressé" sans chiffre sera moins bien classé qu'un article qui précise "les ventes ont progressé de 23 % selon l'étude X publiée en mars 2026".</p>

      <p><strong>Les données chiffrées</strong> sont un signal fort. Les pages contenant des pourcentages, des dates, des volumes et des comparatifs sont citées significativement plus souvent. Perplexity extrait ces chiffres pour les intégrer directement dans ses réponses synthétiques.</p>

      <p><strong>La structure claire</strong>, H2/H3 hiérarchisés, paragraphes courts, listes à puces, facilite l'extraction. Le moteur doit pouvoir isoler des passages courts et autonomes qui répondent à une sous-question. Un mur de texte de 3 000 mots sans structure est un cauchemar pour le parser.</p>

      <p><strong>L'autorité de domaine</strong> reste un signal de ranking fort, comme sur tous les moteurs. Mais Perplexity compense partiellement ce biais en valorisant la pertinence du contenu sur la requête spécifique.</p>

      <p><strong>La fraîcheur</strong> est particulièrement importante sur Perplexity. Le moteur privilégie explicitement les contenus récents, surtout pour les requêtes liées à l'actualité, aux tendances ou aux données chiffrées. Un article mis à jour il y a un mois est favorisé face à un contenu équivalent de 2022.</p>

      <p>Point remarquable : selon Profound (2025), <strong>Reddit est la source n°1 citée par Perplexity</strong>, avec environ <strong>6,6 % de toutes les citations</strong>. Wikipédia arrive en deuxième position, suivi par des sites médias et des blogs sectoriels à forte autorité. Les discussions Reddit servent de validation sociale que Perplexity interprète comme un signal de qualité.</p>

      <ArrowLink href="/blog/reddit-geo-source-ia">Reddit est la source n°1 des IA : comment construire une présence qui ramène des citations</ArrowLink>

      <h2>Les différences entre Perplexity et ChatGPT</h2>

      <p>Beaucoup d'entreprises traitent ChatGPT et Perplexity comme un seul et même canal. C'est une erreur. Les deux moteurs ont des comportements, des sources et des critères différents. Optimiser pour l'un ne garantit pas la visibilité sur l'autre.</p>

      <p><strong>Les citations.</strong> Perplexity cite systématiquement ses sources avec des liens cliquables. ChatGPT affiche parfois des sources (en mode Search activé), parfois pas du tout (en mode réponse libre basée sur ses données d'entraînement). Cette différence a un impact direct sur le trafic : un utilisateur Perplexity est beaucoup plus enclin à cliquer sur une source qu'un utilisateur ChatGPT.</p>

      <p><strong>Le moteur sous-jacent.</strong> ChatGPT s'appuie sur Bing pour ses recherches web en temps réel. Perplexity utilise son propre index, construit par ses propres crawlers. Un site mal indexé sur Bing mais bien crawlé par Perplexity peut être invisible sur ChatGPT tout en étant bien référencé sur Perplexity.</p>

      <p><strong>La fraîcheur.</strong> Perplexity valorise davantage les sources récentes. ChatGPT, dont une partie des réponses s'appuie sur son corpus d'entraînement (parfois daté de 12 à 24 mois), est moins sensible à la fraîcheur pure.</p>

      <p><strong>Les sources privilégiées.</strong> Selon Profound (2025), <strong>seulement 11 % des domaines sont cités à la fois par ChatGPT ET par Perplexity</strong> sur les mêmes requêtes. Autrement dit, 89 % des sources diffèrent d'un moteur à l'autre. Chaque IA a ses propres préférences éditoriales, et être visible sur l'un n'implique absolument pas d'être visible sur l'autre.</p>

      <p>Implication stratégique : il faut <strong>diagnostiquer les deux moteurs séparément</strong>. Un score GEO global est utile, mais le détail par moteur est indispensable pour prioriser les actions.</p>

      <InlineCTA href="/">Vérifiez votre visibilité sur ChatGPT et Perplexity en moins de 60 secondes avec Detekia.</InlineCTA>

      <h2>5 actions concrètes pour apparaître dans Perplexity</h2>

      <p>Voici les moyens qui ont le plus d'impact mesurable, classés par priorité.</p>

      <h3>1. Structurer le contenu en réponses directes</h3>

      <p>Perplexity extrait des passages courts et citables. La structure idéale :</p>

      <ul>
        <li>Une question ou une requête formulée clairement dans un H2 ou H3</li>
        <li>Une réponse directe en une ou deux phrases dans le premier paragraphe qui suit</li>
        <li>Le développement détaillé dans les paragraphes suivants</li>
      </ul>

      <p>Ce format, souvent appelé "pyramide inversée", permet au moteur d'isoler immédiatement la réponse à injecter dans sa synthèse. Évitez les introductions longues qui enterrent l'information clé. Un conseil simple : la première phrase de chaque section doit pouvoir être citée telle quelle.</p>

      <h3>2. Ajouter des données chiffrées avec sources</h3>

      <p>Les pages sourcées sont citées environ <strong>2,8 fois plus souvent</strong> que les pages sans référence externe (source : Ahrefs 2025). Chaque affirmation forte devrait être accompagnée :</p>

      <ul>
        <li>D'un chiffre précis (pourcentage, volume, montant)</li>
        <li>D'une date (année ou période)</li>
        <li>D'une source identifiée (étude, rapport, organisme)</li>
      </ul>

      <p>Exemple faible : "Le marché du SaaS a beaucoup grandi ces dernières années."</p>
      <p>Exemple fort : "Le marché du SaaS a atteint 232 milliards de dollars en 2024, en croissance de 17,6 % sur un an (source : Gartner, février 2025)."</p>

      <p>La seconde version contient les ingrédients que Perplexity cherche : chiffres, date, source vérifiable.</p>

      <h3>3. Être actif sur Reddit</h3>

      <p>Reddit étant la source n°1 de Perplexity, y être mentionné de manière organique a un impact direct sur votre visibilité. Les actions efficaces :</p>

      <ul>
        <li>Identifier les subreddits actifs dans votre secteur</li>
        <li>Participer aux discussions en apportant de la valeur (pas de promotion directe)</li>
        <li>Répondre aux questions techniques avec des réponses détaillées et sourcées</li>
        <li>Laisser émerger naturellement les mentions de votre marque par d'autres utilisateurs</li>
      </ul>

      <p>Attention : le spam est puni sévèrement par les modérateurs et par l'algorithme de Reddit. L'approche doit être qualitative et long terme. L'objectif n'est pas de poster votre lien partout, mais de devenir une voix crédible dans votre niche.</p>

      <h3>4. Publier du contenu frais régulièrement</h3>

      <p>Perplexity privilégie les contenus récents. Un site qui publie régulièrement (au moins un article par semaine sur les sujets clés) envoie un signal de fraîcheur qui améliore sa probabilité d'être cité sur les requêtes actualité.</p>

      <p>La mise à jour des anciens articles est presque aussi efficace que la création de nouveaux contenus. Actualiser la date, rafraîchir les statistiques, ajouter des sections sur les évolutions récentes : ces actions repositionnent vos pages existantes dans l'index avec une date récente.</p>

      <p>Signal pratique : indiquez explicitement dans l'article "Dernière mise à jour : [date]" et reflétez cette date dans le schema <code>Article</code> (<code>dateModified</code>).</p>

      <h3>5. Implémenter les schemas JSON-LD</h3>

      <p>Les données structurées facilitent le parsing par Perplexity. Les schemas prioritaires pour le GEO :</p>

      <ul>
        <li><code>Article</code> : pour les contenus éditoriaux, avec <code>author</code>, <code>datePublished</code>, <code>dateModified</code></li>
        <li><code>FAQPage</code> : pour les pages questions/réponses, directement extractibles par Perplexity</li>
        <li><code>HowTo</code> : pour les tutoriels étape par étape</li>
        <li><code>Organization</code> : pour établir l'identité et l'autorité de votre entreprise</li>
        <li><code>AggregateRating</code> : pour remonter vos notes et avis</li>
      </ul>

      <p>Ces schemas ne sont pas un facteur de ranking direct, mais ils augmentent significativement la probabilité que vos informations soient correctement interprétées et citées.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">Le guide complet du GEO en 2026 : stratégie, critères et plan d'action</ArrowLink>

      <h2>Comment vérifier si Perplexity cite votre site</h2>

      <p>Avant d'agir, il faut mesurer. Deux méthodes complémentaires, l'une manuelle et gratuite, l'autre automatisée.</p>

      <h3>Le test manuel</h3>

      <p>Rendez-vous sur <code>perplexity.ai</code> (pas besoin de compte pour les requêtes de base) et posez les questions que poseraient vos clients :</p>

      <ul>
        <li>"Quel est le meilleur [votre catégorie] en 2026 ?"</li>
        <li>"Comparatif [votre secteur]"</li>
        <li>"[Votre marque] avis"</li>
        <li>Une question technique pointue dans votre domaine</li>
      </ul>

      <p>Pour chaque requête, vérifiez la liste des sources citées en haut de la réponse. Votre site apparaît-il ? Vos concurrents sont-ils cités à votre place ? Les informations retenues sur votre marque sont-elles exactes ?</p>

      <p>Répétez le test sur 10 à 20 requêtes stratégiques pour avoir un aperçu représentatif. Notez les résultats dans un tableau : c'est votre baseline pour mesurer les progrès après optimisation.</p>

      <h3>Le diagnostic automatisé avec Detekia</h3>

      <p>Le test manuel est utile mais limité : il est subjectif, non reproductible et ne couvre qu'un échantillon. <InternalLink href="/">Detekia</InternalLink> automatise l'analyse en évaluant votre site sur les 7 critères GEO : citabilité, vérifiabilité, autorité E-E-A-T, accessibilité IA, données structurées, neutralité éditoriale, présence externe et fraîcheur.</p>

      <p>Le rapport inclut un diagnostic spécifique Perplexity : les bots bloqués, les schemas manquants, les pages mal structurées pour l'extraction, et les opportunités d'amélioration priorisées par impact.</p>

      <ArrowLink href="/blog/pourquoi-chatgpt-ne-cite-pas-votre-site">Pourquoi ChatGPT ne cite pas votre site (et comment y remédier)</ArrowLink>

      <h2>Ce qu'il faut retenir</h2>

      <p>Perplexity n'est pas un "ChatGPT bis". C'est un moteur à part entière, avec son propre index, ses propres critères et ses propres sources préférées. Il valorise le contenu factuel, structuré, sourcé, frais, et particulièrement présent sur Reddit. Seulement 11 % des domaines sont cités sur les deux moteurs : optimiser pour Perplexity est un effort distinct, pas une simple redite de votre stratégie ChatGPT.</p>

      <p>Les trois actions les plus rentables si vous démarrez :</p>

      <ol>
        <li><strong>Vérifiez que <code>PerplexityBot</code> et <code>Perplexity-User</code> ne sont pas bloqués</strong> dans votre <code>robots.txt</code> : c'est le prérequis absolu</li>
        <li><strong>Restructurez vos pages phares en pyramide inversée</strong> avec chiffres, dates et sources dès le premier paragraphe</li>
        <li><strong>Lancez une présence organique sur Reddit</strong> dans vos subreddits cibles, avec une approche qualitative et long terme</li>
      </ol>

      <p>Perplexity est encore en phase de croissance. Les sites qui se positionnent maintenant capturent des parts de citation qui seront beaucoup plus difficiles à déloger dans 18 mois, une fois les positions consolidées. L'avantage est au premier entrant, à condition d'optimiser sur les critères réellement discriminants du moteur.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et JSON-LD : le guide complet pour la visibilité IA</ArrowLink>
    </>
  );
}
