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

export default function SitesBloquentBotsIA() {
  return (
    <>
      <p><strong>73 % des sites web bloquent les bots IA</strong> — GPTBot, ClaudeBot, PerplexityBot — sans que leurs propriétaires le sachent (Otterly.AI, 2026). Concrètement, cela signifie que ChatGPT, Claude et Perplexity ne peuvent tout simplement pas lire le contenu de ces sites. Et un contenu illisible est un contenu qui ne sera jamais cité.</p>

      <p>Le plus souvent, le blocage n'est pas intentionnel. Il vient d'un fichier <code>robots.txt</code> mal configuré, d'un CMS qui bloque les bots par défaut, ou d'un site entièrement rendu en JavaScript côté client. Le résultat est le même : vous êtes invisible pour les moteurs IA, même si votre contenu est excellent.</p>

      <p>Voici comment vérifier si vous êtes concerné, pourquoi c'est un problème critique en 2026, et comment le corriger en moins de 10 minutes.</p>

      <h2>Pourquoi les bots IA sont bloqués par défaut</h2>

      <p>Historiquement, le fichier <code>robots.txt</code> servait à contrôler l'accès des crawlers de Google et Bing. Quand les bots IA sont apparus (GPTBot en août 2023, ClaudeBot, PerplexityBot), de nombreux sites et CMS ont réagi par précaution en les bloquant.</p>

      <p>Le problème : cette décision a souvent été prise au niveau du CMS ou de l'hébergeur, pas par le propriétaire du site. Si vous utilisez WordPress avec certains plugins de sécurité, Wix, Squarespace ou un CDN comme Cloudflare avec des règles anti-bot agressives, il y a de fortes chances que les bots IA soient déjà bloqués sur votre site.</p>

      <p>Les trois causes principales :</p>

      <ul>
        <li><strong>robots.txt explicite</strong> : des lignes comme <code>User-agent: GPTBot / Disallow: /</code> interdisent l'accès à l'intégralité de votre site. C'est le cas le plus courant et le plus simple à corriger.</li>
        <li><strong>Plugins de sécurité</strong> : certains plugins WordPress (Wordfence, Sucuri, iThemes Security) ou des règles Cloudflare bloquent les user-agents non reconnus, y compris les bots IA.</li>
        <li><strong>Rendu JavaScript côté client</strong> : si votre site est une Single Page Application (React, Angular, Vue) sans rendu serveur (SSR), les bots IA ne voient qu'une page blanche. Techniquement, le bot n'est pas bloqué, mais il ne peut rien lire.</li>
      </ul>

      <h2>Comment vérifier si votre site bloque les bots IA</h2>

      <p>C'est rapide à vérifier. Voici les 3 étapes :</p>

      <h3>Étape 1 : Vérifiez votre robots.txt</h3>

      <p>Tapez <code>votre-site.fr/robots.txt</code> dans votre navigateur. Cherchez les mentions de ces user-agents :</p>

      <ul>
        <li><code>GPTBot</code> — le crawler de ChatGPT/OpenAI</li>
        <li><code>OAI-SearchBot</code> — le crawler de recherche d'OpenAI</li>
        <li><code>ClaudeBot</code> — le crawler d'Anthropic (Claude)</li>
        <li><code>PerplexityBot</code> — le crawler de Perplexity</li>
        <li><code>Google-Extended</code> — le crawler IA de Google (distinct de Googlebot)</li>
        <li><code>Bytespider</code> — le crawler de ByteDance (utilisé par des modèles chinois)</li>
      </ul>

      <p>Si vous voyez <code>Disallow: /</code> en face de l'un de ces agents, votre site leur est inaccessible.</p>

      <h3>Étape 2 : Testez le rendu de votre site</h3>

      <p>Ouvrez votre site dans Chrome, faites clic droit → "Afficher le code source de la page" (pas l'inspecteur, le code source brut). Si vous voyez du contenu lisible (texte, paragraphes, titres), c'est bon. Si vous voyez principalement du JavaScript et des balises <code>&lt;div id="root"&gt;&lt;/div&gt;</code> vides, votre contenu n'est pas accessible aux bots.</p>

      <h3>Étape 3 : Faites un audit automatisé</h3>

      <p>Detekia vérifie automatiquement la crawlabilité de votre site par les bots IA. Le critère "Crawlabilité IA" de notre score GEO détecte les blocages <code>robots.txt</code>, l'absence de fichier <code>llms.txt</code>, les problèmes d'indexation et la présence ou non des bots IA dans votre configuration.</p>

      <InlineCTA href="/">Vérifiez si les bots IA peuvent accéder à votre site — gratuit, moins de 60 secondes.</InlineCTA>

      <h2>Les 6 bots IA que vous devez connaître</h2>

      <p>Tous les moteurs IA n'utilisent pas le même crawler. Voici les principaux et leur impact :</p>

      <ul>
        <li><strong>GPTBot (OpenAI)</strong> — alimente ChatGPT et ses réponses avec recherche web. C'est le plus important : ChatGPT traite 2,5 milliards de requêtes par jour. Le bloquer vous rend invisible pour 810 millions d'utilisateurs quotidiens.</li>
        <li><strong>OAI-SearchBot (OpenAI)</strong> — le crawler spécifique à la fonctionnalité de recherche web de ChatGPT. Distinct de GPTBot, il est parfois bloqué séparément.</li>
        <li><strong>ClaudeBot (Anthropic)</strong> — le crawler de Claude. Claude est utilisé par des millions de professionnels et son API alimente de nombreuses applications B2B.</li>
        <li><strong>PerplexityBot</strong> — le crawler de Perplexity, le moteur de recherche IA qui cite systématiquement ses sources avec des liens. Être indexé par Perplexity génère du trafic direct.</li>
        <li><strong>Google-Extended</strong> — contrôle l'utilisation de votre contenu par Gemini et les AI Overviews de Google. Attention : bloquer Google-Extended ne bloque PAS Googlebot (votre référencement classique reste intact).</li>
        <li><strong>Applebot-Extended</strong> — utilisé par Apple Intelligence et Siri. Pertinent si votre audience est sur l'écosystème Apple.</li>
      </ul>

      <h2>Ce que vous perdez en bloquant les bots IA</h2>

      <p>Bloquer les bots IA n'est pas une décision neutre. Voici ce que ça vous coûte concrètement :</p>

      <p><strong>Zéro citation dans les réponses IA.</strong> Quand un prospect demande à ChatGPT "quel est le meilleur outil pour [votre domaine]", votre site ne peut pas être cité si GPTBot ne peut pas le lire. Vos concurrents qui autorisent l'accès seront recommandés à votre place.</p>

      <p><strong>Absence des AI Overviews de Google.</strong> Google utilise Google-Extended pour alimenter ses résumés IA. Si vous le bloquez, vous pouvez toujours apparaître dans les résultats classiques, mais jamais dans le résumé IA en haut de page — celui que <strong>83 % des utilisateurs lisent avant de cliquer</strong>.</p>

      <p><strong>Perte de trafic référé par les IA.</strong> Le trafic référé par les moteurs IA a augmenté de <strong>527 %</strong> en 2025 (Previsible). Les visiteurs provenant d'une recommandation IA convertissent <strong>4,4 fois mieux</strong> que les visiteurs organiques classiques (Semrush, 2025). C'est du trafic qualifié que vous laissez à vos concurrents.</p>

      <p><strong>Invisibilité croissante.</strong> Gartner prévoit une baisse de <strong>25 % du volume de recherche traditionnelle</strong> d'ici fin 2026. La part de trafic qui migre vers les IA ne fera qu'augmenter. Plus vous attendez pour débloquer l'accès, plus le retard se creuse.</p>

      <ArrowLink href="/blog/pourquoi-trafic-google-baisse-2026">Pourquoi votre trafic Google baisse en 2026 (et ce que les IA ont à voir là-dedans)</ArrowLink>

      <h2>Comment débloquer l'accès en 10 minutes</h2>

      <h3>1. Modifier votre robots.txt</h3>

      <p>Si votre <code>robots.txt</code> contient des lignes de blocage, remplacez-les. Voici un exemple de configuration qui autorise tous les bots IA :</p>

      <pre><code>{`# Autoriser les bots IA
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /`}</code></pre>

      <p>Si vous voulez bloquer certaines pages sensibles (espace client, pages admin) tout en autorisant le reste :</p>

      <pre><code>{`User-agent: GPTBot
Allow: /
Disallow: /admin/
Disallow: /compte/
Disallow: /api/`}</code></pre>

      <h3>2. Créer un fichier llms.txt</h3>

      <p>Le fichier <code>llms.txt</code> est un standard émergent qui indique aux IA comment interpréter votre site. Placez-le à la racine (<code>votre-site.fr/llms.txt</code>) :</p>

      <pre><code>{`# Mon Entreprise
> Description courte de ce que fait votre entreprise.

## Pages principales
- [Accueil](https://votre-site.fr/)
- [Produit](https://votre-site.fr/produit)
- [Blog](https://votre-site.fr/blog)
- [À propos](https://votre-site.fr/a-propos)
- [Contact](https://votre-site.fr/contact)

## Ce que nous faisons
Description claire et factuelle de votre activité,
vos services, votre proposition de valeur.`}</code></pre>

      <p>Ce fichier aide les IA à comprendre la structure de votre site et à identifier les pages les plus importantes. C'est l'équivalent du plan de site pour les moteurs IA.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Guide complet : llms.txt, robots.txt et crawlabilité IA</ArrowLink>

      <h3>3. Vérifier les plugins et règles de sécurité</h3>

      <p>Si vous utilisez WordPress :</p>

      <ul>
        <li><strong>Wordfence</strong> : allez dans Firewall → Rate Limiting. Vérifiez que les user-agents IA ne sont pas dans la liste de blocage.</li>
        <li><strong>Sucuri</strong> : dans le tableau de bord, vérifiez les règles de blocage des bots.</li>
        <li><strong>Rank Math / Yoast</strong> : ces plugins ne bloquent pas les bots IA par défaut, mais vérifiez votre robots.txt généré automatiquement.</li>
      </ul>

      <p>Si vous utilisez Cloudflare :</p>

      <ul>
        <li>Allez dans Security → WAF → Custom Rules.</li>
        <li>Vérifiez qu'aucune règle ne bloque les user-agents GPTBot, ClaudeBot, PerplexityBot.</li>
        <li>Dans Security → Bots, assurez-vous que le "Bot Fight Mode" n'est pas trop agressif — il peut bloquer les crawlers IA légitimes.</li>
      </ul>

      <h3>4. Résoudre les problèmes de rendu JavaScript</h3>

      <p>Si votre site est une SPA (Single Page Application) :</p>

      <ul>
        <li><strong>Solution idéale</strong> : passez au Server-Side Rendering (SSR) avec Next.js, Nuxt.js ou similaire. Le contenu est rendu côté serveur et immédiatement lisible par les bots.</li>
        <li><strong>Solution intermédiaire</strong> : utilisez un service de pré-rendu (Prerender.io, Rendertron) qui sert une version HTML statique aux bots.</li>
        <li><strong>Vérification</strong> : testez votre site avec <code>curl -s votre-site.fr | head -50</code>. Si vous voyez du contenu texte, c'est bon. Si c'est du JavaScript pur, les bots ne voient rien.</li>
      </ul>

      <h2>Le cas particulier : faut-il autoriser TOUS les bots ?</h2>

      <p>C'est une question légitime. Certains sites choisissent de bloquer des bots spécifiques pour des raisons stratégiques (protection de contenu exclusif, données sensibles, etc.).</p>

      <p>Notre recommandation :</p>

      <ul>
        <li><strong>Autorisez GPTBot, ClaudeBot, PerplexityBot et Google-Extended</strong> sauf raison documentée de ne pas le faire. Ces 4 bots couvrent 95 % du trafic IA.</li>
        <li><strong>Bloquez sélectivement</strong> les pages sensibles (admin, espace client, API) plutôt que l'ensemble du site.</li>
        <li><strong>Révisez votre décision trimestriellement.</strong> L'écosystème IA évolue vite. De nouveaux bots apparaissent, d'autres deviennent dominants.</li>
      </ul>

      <p>Le blocage total ne protège plus votre contenu — les IA peuvent trouver vos informations via d'autres sources (caches, agrégateurs, mentions tierces). En revanche, il vous garantit de ne jamais être cité comme source, ce qui est la pire situation.</p>

      <h2>Vérifiez votre crawlabilité maintenant</h2>

      <p>La crawlabilité IA est l'un des 8 critères du score GEO Detekia. C'est aussi le critère le plus simple à corriger : une modification de 2 lignes dans votre <code>robots.txt</code> peut suffire à débloquer votre visibilité IA.</p>

      <p>Detekia analyse automatiquement votre fichier <code>robots.txt</code>, détecte la présence ou l'absence d'un <code>llms.txt</code>, et vérifie si votre contenu est accessible aux crawlers IA. Le diagnostic est gratuit et prend moins de 60 secondes.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Les 8 critères GEO qui déterminent si une IA vous cite — méthodologie Detekia</ArrowLink>

      <h2>Questions fréquentes</h2>

      <h3>Débloquer les bots IA pose-t-il un risque de sécurité ?</h3>

      <p>Non. Les bots IA lisent le contenu public de votre site, exactement comme Googlebot le fait depuis 20 ans. Ils n'accèdent pas à vos bases de données, à votre espace admin ou à des données protégées — à condition que votre <code>robots.txt</code> interdise l'accès aux répertoires sensibles (<code>/admin/</code>, <code>/api/</code>, etc.).</p>

      <h3>Mon contenu sera-t-il utilisé pour entraîner les IA ?</h3>

      <p>C'est une question distincte. GPTBot est utilisé à la fois pour la recherche web en temps réel (RAG) et potentiellement pour l'entraînement. Si vous voulez autoriser la recherche web mais pas l'entraînement, vous pouvez autoriser <code>OAI-SearchBot</code> tout en bloquant <code>GPTBot</code>. Pour Google, <code>Google-Extended</code> contrôle uniquement l'utilisation IA — le bloquer n'affecte pas votre SEO classique.</p>

      <h3>Combien de temps avant que les IA commencent à me citer ?</h3>

      <p>Après avoir débloqué l'accès, les bots IA recrawlent votre site en quelques jours à quelques semaines. Les premiers résultats en termes de citations apparaissent généralement en 4 à 8 semaines, selon la qualité de votre contenu et la compétitivité de votre secteur. La crawlabilité est une condition nécessaire, pas suffisante — il faut aussi que votre contenu soit extractible, sourcé et structuré.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour être cité par les IA en 2026</ArrowLink>

      <h2>Ce qu'il faut retenir</h2>

      <p>73 % des sites bloquent les bots IA sans le savoir. Si c'est votre cas, aucune autre optimisation GEO ne fonctionnera tant que ce blocage n'est pas levé. C'est la première chose à vérifier, et souvent la plus simple à corriger.</p>

      <p>Vérifiez votre <code>robots.txt</code>, créez un fichier <code>llms.txt</code>, désactivez les règles de sécurité trop agressives, et assurez-vous que votre contenu est rendu côté serveur. En 10 minutes, vous passez d'invisible à indexable par toutes les IA.</p>

      <InlineCTA href="/">Votre site bloque-t-il les bots IA ? Vérifiez gratuitement en moins de 60 secondes.</InlineCTA>
    </>
  );
}
