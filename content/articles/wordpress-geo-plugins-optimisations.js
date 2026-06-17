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
        Analyser mon site gratuitement →
      </a>
    </div>
  );
}

export default function WordpressGeoPluginsOptimisations() {
  return (
    <>
      <p>WordPress alimente plus de 40 % du web mondial. Si vous utilisez WordPress, vous avez un avantage : un ecosysteme de plugins qui permet d'implementer la plupart des optimisations GEO sans toucher une ligne de code. Mais encore faut-il savoir quels plugins utiliser et comment les configurer pour la visibilite IA.</p>

      <p>Car les plugins SEO classiques (Yoast, Rank Math) ne suffisent plus. Ils optimisent pour Google Search, pas pour ChatGPT, Perplexity ou Gemini. L'enjeu en 2026 est d'aller au-dela du SEO traditionnel pour rendre votre contenu WordPress <InternalLink href="/blog/comment-chatgpt-choisit-ses-sources">citable par les moteurs IA</InternalLink>.</p>

      <h2>Pourquoi WordPress a un avantage naturel en GEO</h2>

      <p>WordPress n'est pas seulement populaire. Il a des caracteristiques structurelles qui facilitent la visibilite IA :</p>

      <ul>
        <li><strong>HTML propre et semantique.</strong> Le contenu WordPress est du HTML standard, directement lisible par les crawlers IA. Contrairement aux SPA (React, Angular), le contenu n'est pas cache derriere du JavaScript.</li>
        <li><strong>Structure de titres native.</strong> L'editeur Gutenberg genere des balises H1-H6 propres. Les IA s'appuient fortement sur la hierarchie des titres pour comprendre la structure du contenu.</li>
        <li><strong>Sitemap automatique.</strong> Depuis WordPress 5.5, un sitemap XML est genere nativement. Les crawlers IA l'utilisent pour decouvrir vos pages.</li>
        <li><strong>Ecosysteme de plugins.</strong> Des milliers de plugins permettent d'ajouter des donnees structurees, d'optimiser le robots.txt, de gerer les FAQ et bien plus — sans coder.</li>
      </ul>

      <p>Mais ces avantages ne se concretisent que si vous les exploitez correctement. Un WordPress par defaut, sans configuration, n'est pas optimise pour les IA.</p>

      <h2>Les plugins essentiels pour le GEO sur WordPress</h2>

      <h3>1. Yoast SEO ou Rank Math : la base (mais pas suffisant)</h3>

      <p>Ces deux plugins gerent les fondamentaux : meta titles, meta descriptions, sitemap XML, robots.txt. Ils ajoutent aussi du schema basique (Article, Organization). C'est necessaire mais loin d'etre suffisant pour le GEO.</p>

      <p>Ce qu'il faut configurer specifiquement pour les IA :</p>

      <ul>
        <li><strong>Schema Organization complet.</strong> Dans Yoast (SEO → Search Appearance → Organization) ou Rank Math (Schema Markup), remplissez tous les champs : nom, logo, adresse, reseaux sociaux, date de creation. Chaque champ rempli est un signal de confiance pour les IA.</li>
        <li><strong>Schema Author/Person.</strong> Activez les archives auteur et configurez les profils auteur avec bio, photo, liens sociaux. Rank Math permet d'ajouter le schema Person directement sur les pages auteur.</li>
        <li><strong>Meta description soignee.</strong> Les IA extraient souvent la meta description comme resume de la page. Redigez-la comme une reponse autonome, pas comme un teaser publicitaire.</li>
      </ul>

      <h3>2. Schema Pro ou WP Schema : les donnees structurees avancees</h3>

      <p>Les plugins SEO de base ajoutent Article et Organization, mais les <InternalLink href="/blog/structured-data-avance-schemas-oublies">schemas avances</InternalLink> qui font la difference pour les IA (HowTo, FAQPage, Person, Review, SpeakableSpecification) necessitent un plugin dedie.</p>

      <p>Plugins recommandes :</p>

      <ul>
        <li><strong>Schema Pro</strong> (premium, ~79$/an) : interface visuelle pour ajouter n'importe quel type de schema. Supporte HowTo, FAQ, Review, LocalBusiness, Person et bien d'autres.</li>
        <li><strong>Rank Math Pro</strong> : inclut un generateur de schema avance dans sa version premium. Supporte 20+ types de schema directement dans l'editeur.</li>
        <li><strong>Schema & Structured Data for WP</strong> (gratuit) : bon compromis pour les schemas basiques et FAQ. Moins complet que les options premium mais suffisant pour demarrer.</li>
      </ul>

      <p>L'essentiel est d'implementer au minimum : <code>FAQPage</code> sur vos pages FAQ, <code>HowTo</code> sur vos tutoriels, <code>Person</code> sur vos pages auteur, et <code>Review</code>/<code>AggregateRating</code> si vous avez des avis clients.</p>

      <h3>3. Gestion du robots.txt et de l'acces aux bots IA</h3>

      <p>Par defaut, WordPress autorise tous les crawlers. Mais certains themes ou plugins de securite (Wordfence, Sucuri) peuvent bloquer les bots IA sans que vous le sachiez. Verifiez votre <InternalLink href="/blog/sitemap-robots-txt-bots-ia-2026">robots.txt</InternalLink> pour vous assurer que GPTBot, ClaudeBot, PerplexityBot et Google-Extended ne sont pas bloques.</p>

      <p>Avec Yoast ou Rank Math, vous pouvez editer le robots.txt directement depuis le tableau de bord WordPress (SEO → Outils → Editeur de fichiers). Ajoutez explicitement :</p>

      <ul>
        <li><code>User-agent: GPTBot</code> suivi de <code>Allow: /</code></li>
        <li><code>User-agent: ClaudeBot</code> suivi de <code>Allow: /</code></li>
        <li><code>User-agent: PerplexityBot</code> suivi de <code>Allow: /</code></li>
      </ul>

      <h3>4. FAQ et contenu citable : les plugins de blocs FAQ</h3>

      <p>Les FAQ sont le format le plus directement citable par les IA. Sur WordPress, plusieurs plugins permettent de creer des blocs FAQ avec schema FAQPage automatique :</p>

      <ul>
        <li><strong>Yoast FAQ Block</strong> (inclus dans Yoast gratuit) : ajoute un bloc FAQ dans Gutenberg avec schema FAQPage genere automatiquement</li>
        <li><strong>Rank Math FAQ Block</strong> : meme principe, inclus dans Rank Math gratuit</li>
        <li><strong>Ultimate FAQ</strong> : plugin dedie avec categories, recherche et schema integre</li>
      </ul>

      <p>L'important n'est pas le plugin mais le contenu : redigez des reponses de 2-3 phrases claires et autonomes. La premiere phrase doit pouvoir etre extraite et citee directement par une IA.</p>

      <h3>5. Performance et accessibilite : WP Rocket, Autoptimize</h3>

      <p>Les IA ne classent pas directement les sites par vitesse, mais un site lent a deux problemes : les crawlers IA peuvent echouer a charger le contenu (timeout), et un site lent est souvent un site mal structure techniquement.</p>

      <ul>
        <li><strong>WP Rocket</strong> (premium) : cache, minification, lazy loading. Le plus complet et le plus simple.</li>
        <li><strong>Autoptimize</strong> (gratuit) : optimisation CSS/JS, bonne alternative gratuite</li>
        <li><strong>ShortPixel ou Imagify</strong> : compression d'images. Les IA multimodales analysent vos images — elles doivent se charger correctement.</li>
      </ul>

      <InlineCTA href="/pricing">Testez la visibilite IA de votre site WordPress</InlineCTA>

      <h2>Les optimisations WordPress specifiques au GEO</h2>

      <h3>Structurer le contenu pour la citabilite</h3>

      <p>Au-dela des plugins, la facon dont vous redigez et structurez vos articles WordPress a un impact direct sur la <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">citabilite IA</InternalLink>.</p>

      <ul>
        <li><strong>Un H2 par question, la reponse en premier paragraphe.</strong> Les IA extraient le contenu juste apres les titres H2/H3. Si la premiere phrase apres votre titre est une reponse directe, elle sera citee.</li>
        <li><strong>Paragraphes courts (3-5 phrases).</strong> Les IA preferent les blocs de texte modulaires qu'elles peuvent extraire individuellement.</li>
        <li><strong>Donnees chiffrees avec sources.</strong> "Le marche du e-commerce en France a atteint 159,9 milliards d'euros en 2023 (Fevad)" est bien plus citable que "Le e-commerce est en forte croissance".</li>
        <li><strong>Listes a puces pour les comparaisons et etapes.</strong> Les IA adorent les listes structurees — elles les extraient souvent telles quelles dans leurs reponses.</li>
      </ul>

      <h3>Pages auteur enrichies</h3>

      <p>WordPress genere des pages auteur par defaut (/author/votre-nom/), mais elles sont souvent vides ou desactivees. Pour l'<InternalLink href="/blog/eeat-ia-experience-expertise">autorite E-E-A-T</InternalLink>, ces pages doivent etre completes :</p>

      <ul>
        <li>Bio de 150-300 mots avec parcours, expertises et credentials</li>
        <li>Photo professionnelle</li>
        <li>Liens vers LinkedIn, Twitter et autres profils</li>
        <li>Schema Person avec <code>knowsAbout</code>, <code>jobTitle</code>, <code>worksFor</code></li>
        <li>Liste des articles publies (WordPress le fait nativement)</li>
      </ul>

      <h3>Dates de mise a jour visibles</h3>

      <p>La fraicheur est un critere cle pour les IA. Par defaut, WordPress affiche la date de publication mais pas la date de modification. Ajoutez la date de derniere modification visible sur vos articles. Plusieurs methodes :</p>

      <ul>
        <li><strong>Rank Math</strong> inclut une option pour afficher "Mis a jour le..." automatiquement</li>
        <li><strong>WP Last Modified Info</strong> (plugin gratuit) : ajoute la date de modification sur tous vos posts</li>
        <li>Le schema Article avec <code>dateModified</code> est gere automatiquement par Yoast et Rank Math</li>
      </ul>

      <h2>Les erreurs WordPress courantes qui nuisent au GEO</h2>

      <ul>
        <li><strong>Trop de plugins.</strong> 30+ plugins actifs ralentissent le site et peuvent generer des conflits de schema (deux plugins qui injectent chacun un schema Organization different). Gardez uniquement les plugins necessaires.</li>
        <li><strong>Themes bloques par JavaScript.</strong> Certains themes premium (Elementor, Divi) generent du HTML encapsule dans du JavaScript. Les crawlers IA peuvent avoir du mal a lire le contenu. Testez votre site avec un navigateur sans JavaScript pour verifier.</li>
        <li><strong>Bloqueur de bots trop agressif.</strong> Wordfence et les plugins de securite peuvent bloquer les bots IA. Verifiez vos regles de pare-feu et ajoutez des exceptions pour GPTBot, ClaudeBot et PerplexityBot.</li>
        <li><strong>Contenu duplique entre categories et tags.</strong> WordPress genere des pages d'archive pour chaque categorie et tag. Si mal configurees, elles creent du contenu duplique. Configurez Yoast/Rank Math pour mettre en noindex les archives de tags.</li>
        <li><strong>Pages auteur desactivees.</strong> Beaucoup de guides SEO recommandent de desactiver les pages auteur. Pour le GEO, c'est une erreur : les IA utilisent ces pages pour verifier les credentials des auteurs.</li>
      </ul>

      <h2>Checklist GEO pour WordPress</h2>

      <ol>
        <li>Installer et configurer Yoast ou Rank Math (schema Organization complet, profils auteur)</li>
        <li>Verifier le robots.txt (GPTBot, ClaudeBot, PerplexityBot autorises)</li>
        <li>Ajouter le schema FAQPage sur les pages avec des questions/reponses</li>
        <li>Implementer les schemas avances (HowTo, Person, Review) via Schema Pro ou Rank Math Pro</li>
        <li>Enrichir les pages auteur (bio, photo, liens, schema Person)</li>
        <li>Afficher les dates de modification sur tous les articles</li>
        <li>Optimiser la performance (cache, compression images, minification)</li>
        <li>Structurer les articles : H2 = question, premier paragraphe = reponse directe</li>
        <li>Verifier qu'aucun plugin de securite ne bloque les bots IA</li>
        <li>Auditer les schemas avec Google Rich Results Test pour detecter les conflits</li>
      </ol>

      <h2>Conclusion</h2>

      <p>WordPress est une excellente base pour le GEO. Son HTML propre, son ecosysteme de plugins et sa structure de contenu native le rendent naturellement compatible avec les attentes des moteurs IA. Mais le potentiel ne se realise que si vous allez au-dela de la configuration par defaut : schemas avances, acces aux bots IA, contenu structure pour la citabilite, et pages auteur completes.</p>

      <p>Les plugins simplifient le travail, mais c'est la qualite et la structure de votre contenu qui font la difference. Un article bien redige avec un FAQ bien structure sur un WordPress correctement configure a toutes les chances d'etre cite par ChatGPT, Gemini et Perplexity.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA : le guide pratique complet</ArrowLink>

      <ArrowLink href="/blog/geo-guide-complet-2026">Le guide complet du GEO en 2026</ArrowLink>
    </>
  );
}
