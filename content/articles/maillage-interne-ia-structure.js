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
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

function InlineCTA({ href, children }) {
  return (
    <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 10, padding: '20px 24px', margin: '32px 0', textAlign: 'center' }}>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6B6762', marginBottom: 12 }}>{children}</p>
      <a href={href} style={{ display: 'inline-block', background: '#D97757', color: '#fff', borderRadius: 8, padding: '11px 28px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
        Analyser mon site gratuitement →
      </a>
    </div>
  );
}

export default function MaillageInterneIaStructure() {
  return (
    <>
      <p>En SEO, le maillage interne est un fondamental. Tout le monde sait qu'il aide Google a comprendre la structure d'un site et a distribuer le "jus de lien". Mais avec l'essor des moteurs IA, une question nouvelle se pose : <strong>comment les crawlers de ChatGPT, Claude et Perplexity explorent-ils vos liens internes, et en quoi cela influence-t-il vos chances d'etre cite ?</strong></p>

      <p>La reponse est claire : le maillage interne n'est plus seulement un levier SEO. C'est un facteur direct de visibilite IA. Et la plupart des sites ne l'exploitent pas correctement.</p>

      <h2>Pourquoi le maillage interne est crucial pour la visibilite IA</h2>

      <p>Les moteurs IA comme ChatGPT (via GPTBot), Claude (via ClaudeBot) et Perplexity (via PerplexityBot) utilisent des crawlers pour explorer le web. Ces crawlers suivent les liens internes de votre site exactement comme Googlebot le fait. Mais il y a des differences fondamentales dans la facon dont ces informations sont ensuite utilisees.</p>

      <p>Quand un LLM explore votre site, il ne cherche pas seulement a indexer des pages individuelles. Il cherche a <strong>comprendre la structure de votre expertise</strong>. Un site ou les pages sont bien connectees entre elles envoie un signal fort : ce site couvre un sujet en profondeur, avec des contenus qui se completent et se renforcent mutuellement.</p>

      <p>Trois raisons principales expliquent pourquoi le maillage interne impacte directement la citabilite IA :</p>

      <ul>
        <li><strong>La decouverte de contenu.</strong> Un crawler IA qui arrive sur votre page d'accueil doit pouvoir atteindre n'importe quelle page importante en 3 clics maximum. Si vos contenus strategiques sont enfouis derriere 5 niveaux de navigation, les bots IA ne les trouveront tout simplement pas.</li>
        <li><strong>La comprehension thematique.</strong> Les liens internes avec des ancres descriptives aident les IA a comprendre les relations entre vos contenus. Un lien avec l'ancre "guide pratique Schema.org pour les IA" communique bien plus qu'un lien "cliquez ici".</li>
        <li><strong>Le renforcement d'autorite topique.</strong> Quand plusieurs pages de votre site pointent vers une page pilier sur un sujet donne, les IA comprennent que cette page est votre reference principale sur ce theme. Cela augmente ses chances d'etre citee.</li>
      </ul>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour etre cite par les IA en 2026</ArrowLink>

      <h2>Comment les crawlers IA explorent vos liens internes</h2>

      <p>Les bots IA (GPTBot, ClaudeBot, PerplexityBot) partagent des comportements communs avec Googlebot, mais ils ont aussi des specificites importantes a connaitre.</p>

      <p><strong>Un budget de crawl plus limite.</strong> Les crawlers IA explorent generalement moins de pages que Googlebot lors d'une session de crawl. Cela signifie que la hierarchie de vos liens internes est encore plus determinante : les pages accessibles en un ou deux clics depuis la page d'accueil seront crawlees en priorite. Les pages profondes risquent d'etre ignorees.</p>

      <p><strong>Une sensibilite aux ancres textuelles.</strong> Les LLM traitent le texte d'ancre comme un signal semantique fort. Quand votre lien interne dit "les 7 criteres GEO de la methodologie Detekia", le crawler comprend immediatement le sujet de la page cible. En revanche, un lien "en savoir plus" ne fournit aucune information utile.</p>

      <p><strong>Une exploration contextuelle.</strong> Les crawlers IA ne se contentent pas de suivre les liens. Ils analysent le contexte dans lequel le lien apparait. Un lien place au coeur d'un paragraphe pertinent, entoure de contenu thematiquement lie, a plus de poids qu'un lien isole dans un footer ou une sidebar.</p>

      <p><strong>Le respect du robots.txt et du fichier llms.txt.</strong> Avant meme de suivre vos liens internes, les bots IA consultent votre robots.txt et, de plus en plus, votre fichier llms.txt. Si certaines sections sont bloquees, le maillage interne vers ces sections sera inutile.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">llms.txt, robots.txt et accessibilité IA : le guide technique</ArrowLink>

      <h2>Les bonnes pratiques du maillage interne pour les IA</h2>

      <p>Optimiser son maillage interne pour les IA ne demande pas de revolution technique. C'est avant tout une question de methode et de rigueur. Voici les pratiques qui ont le plus d'impact.</p>

      <h3>1. Utilisez des ancres descriptives et specifiques</h3>

      <p>C'est la regle numero un. Chaque lien interne doit porter un texte d'ancre qui decrit clairement le contenu de la page cible. Les ancres generiques ("cliquez ici", "en savoir plus", "lire la suite") sont a proscrire.</p>

      <ul>
        <li><strong>Mauvais :</strong> "Pour en savoir plus, <em>cliquez ici</em>."</li>
        <li><strong>Bon :</strong> "Consultez notre <em>guide pratique Schema.org pour les IA</em>."</li>
        <li><strong>Mauvais :</strong> "Lisez <em>cet article</em> sur le sujet."</li>
        <li><strong>Bon :</strong> "Les <em>7 criteres GEO qui determinent si une IA vous cite</em> detaillent cette methodologie."</li>
      </ul>

      <p>Les ancres descriptives aident les crawlers IA a construire une carte semantique de votre site. Plus cette carte est riche et precise, mieux les IA comprennent votre expertise.</p>

      <h3>2. Placez vos liens dans le contenu, pas dans les menus</h3>

      <p>Un lien contextuel, insere naturellement dans le corps d'un article, a beaucoup plus de valeur qu'un lien de navigation ou de sidebar. Pourquoi ? Parce que le contexte environnant donne au lien une signification supplementaire.</p>

      <p>Quand un paragraphe parle de donnees structurees et contient un lien vers votre article sur Schema.org, le crawler IA comprend la relation thematique. Un lien identique dans un menu "Articles recents" ne porte aucune information contextuelle.</p>

      <h3>3. Limitez la profondeur de navigation a 3 niveaux</h3>

      <p>Toute page importante de votre site doit etre accessible en 3 clics maximum depuis la page d'accueil. C'est une regle classique du SEO qui prend encore plus d'importance avec les crawlers IA, dont le budget de crawl est souvent plus restreint.</p>

      <p>En pratique, cela signifie :</p>

      <ul>
        <li>Page d'accueil (niveau 0) pointe vers les pages piliers (niveau 1)</li>
        <li>Les pages piliers pointent vers les articles satellites (niveau 2)</li>
        <li>Les articles satellites pointent entre eux et vers les pages piliers (boucle)</li>
      </ul>

      <h3>4. Creez des liens bidirectionnels</h3>

      <p>Si l'article A fait un lien vers l'article B, l'article B devrait aussi contenir un lien vers l'article A (quand c'est pertinent). Les liens bidirectionnels renforcent la comprehension des relations thematiques par les IA et facilitent la navigation des crawlers.</p>

      <InlineCTA href="/">
        Votre maillage interne est-il optimise pour les IA ? Testez votre score GEO gratuitement.
      </InlineCTA>

      <h2>La structure pilier/satellite : le modele optimal pour les IA</h2>

      <p>La strategie de contenu la plus efficace pour le maillage interne GEO est le modele pilier/satellite (aussi appele "topic cluster"). Le principe est simple.</p>

      <p><strong>Une page pilier</strong> couvre un sujet large en profondeur (par exemple : "GEO : le guide complet pour etre cite par les IA en 2026"). C'est votre page de reference sur le sujet. Elle est longue, complete et repond aux questions principales.</p>

      <p><strong>Des pages satellites</strong> traitent chacune un aspect specifique du sujet pilier (par exemple : "Schema.org pour les IA", "llms.txt et accessibilité IA", "les 7 criteres GEO"). Chaque satellite approfondit un angle precis.</p>

      <p><strong>Le maillage entre les deux</strong> est la cle. Chaque page satellite fait un lien vers la page pilier, et la page pilier fait un lien vers chaque satellite. Les satellites se lient aussi entre eux quand c'est pertinent.</p>

      <p>Cette structure fonctionne particulierement bien pour les IA pour plusieurs raisons :</p>

      <ul>
        <li>Elle cree une <strong>carte thematique claire</strong> que les crawlers peuvent facilement explorer</li>
        <li>Elle concentre l'autorite topique sur la page pilier, qui devient la page la plus susceptible d'etre citee</li>
        <li>Elle permet aux IA de comprendre la <strong>profondeur de votre expertise</strong> sur un sujet donne</li>
        <li>Elle facilite la decouverte de contenu en limitant la profondeur de navigation</li>
      </ul>

      <p>Concretement, un site qui traite du GEO avec une page pilier liee a 8 articles satellites sur chaque critere sera percu par les IA comme une source beaucoup plus complete qu'un site avec 8 articles isoles et non relies entre eux.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA : guide pratique pour les LLM</ArrowLink>

      <h2>5 erreurs courantes qui nuisent a votre maillage interne</h2>

      <p>Meme les sites bien structures commettent des erreurs de maillage interne qui reduisent leur visibilite IA. Voici les plus frequentes.</p>

      <h3>1. Les pages orphelines</h3>

      <p>Une page orpheline est une page qui n'est liee par aucune autre page de votre site. Elle existe, elle est indexable, mais aucun lien interne ne pointe vers elle. Pour les crawlers IA, cette page est invisible (sauf si elle apparait dans le sitemap). C'est l'erreur la plus grave : vous avez cree du contenu de qualite que personne ne decouvre.</p>

      <h3>2. Les liens casses</h3>

      <p>Un lien interne qui mene vers une page 404 est un signal negatif pour les crawlers IA. Il gaspille du budget de crawl et interrompt l'exploration. Plus vous avez de liens casses, moins les bots IA exploreront votre site en profondeur. Verifiez regulierement l'integrite de vos liens internes.</p>

      <h3>3. Les ancres generiques</h3>

      <p>Comme explique plus haut, les ancres "cliquez ici", "en savoir plus" ou "voir l'article" n'apportent aucune information semantique aux crawlers IA. Chaque ancre generique est une occasion manquee de communiquer la pertinence thematique de la page cible.</p>

      <h3>4. La suroptimisation du maillage</h3>

      <p>A l'inverse, bourrer chaque paragraphe de liens internes est contre-productif. Quand tout est lie, rien n'est prioritaire. Les IA ne savent plus quelles pages sont reellement importantes. Visez 2 a 5 liens internes par article de 1 500 mots, places la ou ils apportent une reelle valeur au lecteur.</p>

      <h3>5. L'absence de liens vers les pages strategiques</h3>

      <p>Beaucoup de sites ont une page de service ou une page produit strategique vers laquelle aucun article de blog ne pointe. Vos contenus editoriaux sont un levier puissant pour renforcer l'autorite de vos pages commerciales. Chaque article pertinent devrait contenir au moins un lien vers la page strategique associee.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Les 7 criteres GEO qui determinent si une IA vous cite</ArrowLink>

      <h2>Comment auditer son maillage interne avec Detekia</h2>

      <p>L'audit GEO de Detekia inclut une analyse de la structure de liens internes de votre site. Voici ce que l'outil verifie automatiquement.</p>

      <p><strong>Profondeur de navigation.</strong> L'audit mesure le nombre de clics necessaires pour atteindre chaque page depuis la page d'accueil. Les pages a plus de 3 niveaux de profondeur sont signalees comme a risque pour l'accessibilité IA.</p>

      <p><strong>Pages orphelines.</strong> Detekia identifie les pages qui ne recoivent aucun lien interne. Ces pages sont les premieres a corriger, car elles sont pratiquement invisibles pour les crawlers IA.</p>

      <p><strong>Qualite des ancres.</strong> L'outil analyse les textes d'ancre de vos liens internes et signale les ancres generiques qui n'apportent aucune valeur semantique. Il suggere des ancres descriptives basees sur le contenu de la page cible.</p>

      <p><strong>Structure de clusters.</strong> L'audit detecte si vos contenus suivent un modele pilier/satellite ou s'ils sont organises de facon desordonnee. Il identifie les opportunites de regroupement thematique et les liens manquants entre contenus complementaires.</p>

      <p><strong>Liens casses.</strong> Chaque lien interne est verifie. Les 404 et les redirections en chaine sont signalees avec leur impact sur l'accessibilité IA.</p>

      <p>Ces verifications s'integrent dans le <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">score GEO global a 7 criteres</InternalLink> de Detekia. Le maillage interne influence directement les criteres d'accessibilité IA et de structure technique.</p>

      <InlineCTA href="/">
        Auditez gratuitement le maillage interne de votre site avec Detekia.
      </InlineCTA>

      <h2>Checklist du maillage interne optimise pour les IA</h2>

      <p>Avant de publier un nouvel article ou de refondre votre site, passez en revue cette checklist :</p>

      <ul>
        <li>Chaque page importante est accessible en 3 clics maximum depuis la page d'accueil</li>
        <li>Tous les liens internes utilisent des ancres descriptives (zero "cliquez ici")</li>
        <li>Les liens sont places dans le corps du contenu, pas uniquement dans les menus</li>
        <li>Aucune page strategique n'est orpheline</li>
        <li>Les contenus sont organises en clusters pilier/satellite</li>
        <li>La page pilier lie vers chaque satellite, et chaque satellite lie vers la page pilier</li>
        <li>Les satellites pertinents sont lies entre eux</li>
        <li>Aucun lien interne ne mene vers une page 404</li>
        <li>Le robots.txt et le fichier llms.txt autorisent l'acces aux pages liees</li>
        <li>2 a 5 liens internes par article de 1 500 mots</li>
      </ul>

      <h2>Conclusion : le maillage interne, levier sous-estime du GEO</h2>

      <p>Le maillage interne est l'un des leviers les plus sous-estimes de la visibilite IA. Alors que beaucoup de sites investissent dans les backlinks, le schema.org et la creation de contenu, ils negligent la facon dont leurs pages sont connectees entre elles.</p>

      <p>Pourtant, la logique est simple. Les crawlers IA explorent votre site en suivant vos liens internes. Si ces liens sont rares, mal places ou portent des ancres generiques, les IA ne decouvriront qu'une fraction de votre contenu et ne comprendront pas la profondeur de votre expertise.</p>

      <p><strong>Les 4 actions prioritaires :</strong></p>

      <ol>
        <li>Auditer vos pages orphelines et les relier a votre structure existante</li>
        <li>Remplacer toutes les ancres generiques par des ancres descriptives</li>
        <li>Organiser vos contenus en clusters pilier/satellite</li>
        <li>Verifier la profondeur de navigation et corriger les pages a plus de 3 niveaux</li>
      </ol>

      <p>Un maillage interne bien pense ne profite pas seulement au SEO. Il facilite le travail des crawlers IA, renforce votre autorite topique, et augmente concretement vos chances d'etre cite dans les reponses de ChatGPT, Gemini et Perplexity.</p>
    </>
  );
}
