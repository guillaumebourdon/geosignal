import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

function ChecklistSection({ title, items }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: 'system-ui', fontSize: 14, color: '#3A3835', lineHeight: 1.5 }}>
            <span style={{ color: '#10A37F', flexShrink: 0, marginTop: 1 }}>☐</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SchemaOrgIaGuidePratique() {
  return (
    <>
      <p>Les données structurées Schema.org ne servent plus uniquement à obtenir des rich snippets sur Google. En 2026, elles sont devenues un levier direct de visibilité auprès des IA génératives. Quand ChatGPT, Gemini ou Perplexity analysent votre site, le balisage JSON-LD leur permet de comprendre sans ambiguïté qui vous êtes, ce que vous proposez, et pourquoi votre contenu est fiable.</p>

      <p>Un site sans données structurées oblige l'IA à deviner. Un site avec un balisage complet lui donne des certitudes. Et les IA citent en priorité les sources qu'elles comprennent.</p>

      <p>Ce guide vous montre exactement quels schemas implémenter, dans quel ordre, avec des exemples de code prêts à copier.</p>

      <h2>Pourquoi Schema.org compte pour le GEO</h2>

      <p>Les moteurs IA fonctionnent différemment de Google. Quand Googlebot crawle votre page, il interprète le HTML, les balises meta et les signaux de popularité pour classer votre page dans ses résultats. Quand un crawler IA (GPTBot, ClaudeBot, PerplexityBot) analyse votre page, il cherche à comprendre les <strong>entités</strong> : qui parle, de quoi, avec quelle autorité, et à quelle date.</p>

      <p>Les données structurées répondent exactement à ces questions, dans un format que les machines lisent sans interprétation.</p>

      <p>Concrètement, Schema.org impacte 3 des 8 critères du score GEO Detekia :</p>

      <ul>
        <li><strong>Données structurées (10 points)</strong> — impact direct et mesurable</li>
        <li><strong>Autorité & E-E-A-T (15 points)</strong> — le schema <code>Organization</code> et les informations d'auteur renforcent les signaux de crédibilité</li>
        <li><strong>Extractibilité (25 points)</strong> — le schema <code>FAQPage</code> structure vos contenus dans un format nativement extractible par les IA</li>
      </ul>

      <p>Soit un impact potentiel sur <strong>50 points sur 100</strong> de votre score GEO.</p>

      <h2>Les 5 schemas prioritaires pour le GEO</h2>

      <p>Vous n'avez pas besoin d'implémenter les 806 types de Schema.org. Pour le GEO, 5 schemas couvrent 90 % de l'impact. Voici lesquels, dans l'ordre de priorité.</p>

      <h3>1. Organization — votre identité</h3>

      <p>C'est le schema le plus fondamental. Il dit aux IA : "Voici qui nous sommes." Sans lui, les moteurs IA n'ont aucune certitude sur votre identité d'entreprise.</p>

      <p><strong>Où l'implémenter :</strong> sur votre page d'accueil, dans le <code>&lt;head&gt;</code> ou avant la fermeture du <code>&lt;/body&gt;</code>.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Votre Entreprise",
  "url": "https://www.votre-site.fr",
  "logo": "https://www.votre-site.fr/logo.png",
  "description": "Description concise de votre activité en 1-2 phrases.",
  "foundingDate": "2020",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "12 rue de l'Exemple",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact@votre-site.fr",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://www.linkedin.com/company/votre-entreprise",
    "https://twitter.com/votre-entreprise"
  ]
}`}</code></pre>

      <p><strong>Points clés pour le GEO :</strong></p>

      <ul>
        <li>La propriété <code>sameAs</code> est cruciale : elle permet aux IA de relier votre site à vos profils LinkedIn, Twitter, Wikipedia, Crunchbase. Plus ces liens sont cohérents, plus votre identité d'entité est forte.</li>
        <li>La <code>description</code> doit être factuelle et concise — c'est souvent ce que l'IA extraira en premier pour vous présenter.</li>
        <li>Le <code>logo</code> en URL absolue permet aux IA de vérifier visuellement votre identité.</li>
      </ul>

      <h3>2. FAQPage — vos questions-réponses</h3>

      <p>C'est le schema le plus impactant pour le GEO. Les moteurs IA fonctionnent par questions-réponses : un utilisateur pose une question, l'IA cherche la meilleure réponse. Le schema <code>FAQPage</code> structure votre contenu exactement dans ce format.</p>

      <p><strong>Où l'implémenter :</strong> sur toute page contenant des questions-réponses — page FAQ dédiée, bas de page produit, sections d'aide.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Comment améliorer la visibilité de mon site dans ChatGPT ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pour être cité par ChatGPT, optimisez l'extractibilité de votre contenu (réponses directes dans les 100 premiers mots), ajoutez des données structurées Schema.org, vérifiez que votre robots.txt n'exclut pas GPTBot, et sourcez vos affirmations avec des données vérifiables."
      }
    },
    {
      "@type": "Question",
      "name": "Combien de temps faut-il pour apparaître dans les réponses IA ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Les optimisations techniques (robots.txt, Schema.org) prennent effet en 2 à 4 semaines. Les améliorations de contenu se reflètent en 4 à 8 semaines. La construction d'autorité externe prend 2 à 3 mois."
      }
    }
  ]
}`}</code></pre>

      <p><strong>Points clés pour le GEO :</strong></p>

      <ul>
        <li>Chaque réponse doit être <strong>autonome</strong> : compréhensible sans contexte supplémentaire. Les IA extraient souvent la réponse seule, sans la question.</li>
        <li>Les questions doivent être formulées en langage naturel, comme un utilisateur les poserait à ChatGPT. Pas de jargon, pas de formulation corporate.</li>
        <li>Limitez-vous à 5-10 questions par page. Au-delà, la densité informationnelle diminue et Google peut ignorer le balisage.</li>
        <li>Chaque réponse doit contenir des faits vérifiables (chiffres, durées, étapes) — pas de réponses vagues.</li>
      </ul>

      <h3>3. Article / BlogPosting — vos contenus éditoriaux</h3>

      <p>Ce schema identifie vos articles comme des contenus éditoriaux structurés, avec un auteur, une date, et un contexte éditorial. Pour les IA, c'est un signal fort de crédibilité — surtout quand l'auteur est identifiable et expert.</p>

      <p><strong>Où l'implémenter :</strong> sur chaque article de blog, guide, étude de cas ou page de contenu éditorial.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "GEO : le guide complet pour être cité par les IA en 2026",
  "description": "Définition du GEO, 8 critères de citabilité, 7 actions concrètes pour optimiser votre site.",
  "author": {
    "@type": "Person",
    "name": "Guillaume Bourdon",
    "url": "https://www.linkedin.com/in/guillaumebourdon",
    "jobTitle": "Fondateur",
    "worksFor": {
      "@type": "Organization",
      "name": "Beeleven"
    }
  },
  "publisher": {
    "@type": "Organization",
    "name": "Detekia",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.detekia.fr/logo.png"
    }
  },
  "datePublished": "2026-03-27",
  "dateModified": "2026-03-27",
  "image": "https://www.detekia.fr/images/geo-guide-og.jpg",
  "mainEntityOfPage": "https://www.detekia.fr/blog/geo-guide-complet-2026"
}`}</code></pre>

      <p><strong>Points clés pour le GEO :</strong></p>

      <ul>
        <li>L'objet <code>author</code> avec un <code>url</code> vers LinkedIn ou une page bio est essentiel. Les IA croisent les informations d'auteur pour évaluer l'expertise (E-E-A-T).</li>
        <li><code>dateModified</code> est aussi important que <code>datePublished</code>. Les IA vérifient la fraîcheur du contenu — une date de modification récente est un signal positif.</li>
        <li>La <code>description</code> doit résumer le contenu de manière factuelle et extractible.</li>
      </ul>

      <h3>4. WebSite + SearchAction — votre site comme entité</h3>

      <p>Ce schema aide les IA à comprendre votre site dans son ensemble, pas juste page par page. Il est aussi utilisé par Google pour afficher la boîte de recherche sitelinks.</p>

      <p><strong>Où l'implémenter :</strong> sur la page d'accueil uniquement.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Detekia",
  "url": "https://www.detekia.fr",
  "description": "Audit GEO pour mesurer la visibilité de votre site dans les réponses IA.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.detekia.fr/results?url={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`}</code></pre>

      <h3>5. BreadcrumbList — votre architecture</h3>

      <p>Le fil d'Ariane balisé aide les IA à comprendre la hiérarchie de votre site : quelle page est parente de quelle autre, comment le contenu s'organise. C'est un signal de structure qui renforce la crawlabilité.</p>

      <p><strong>Où l'implémenter :</strong> sur toutes les pages internes.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://www.detekia.fr"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://www.detekia.fr/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "GEO : le guide complet 2026",
      "item": "https://www.detekia.fr/blog/geo-guide-complet-2026"
    }
  ]
}`}</code></pre>

      <h2>Schemas secondaires selon votre activité</h2>

      <p>Au-delà des 5 schemas prioritaires, certains balisages spécifiques renforcent votre visibilité selon votre type d'activité.</p>

      <h3>E-commerce</h3>

      <ul>
        <li><code>Product</code> — nom, prix, disponibilité, avis. Les IA les utilisent pour les comparaisons produits.</li>
        <li><code>AggregateRating</code> — note moyenne et nombre d'avis. Signal de confiance fort.</li>
        <li><code>Offer</code> — prix, devise, conditions. Permet aux IA de citer des prix précis.</li>
      </ul>

      <ArrowLink href="/blog/ecommerce-recommandations-ia">Pour une approche complète, consultez E-commerce : comment apparaître dans les recommandations produits des IA.</ArrowLink>

      <h3>Services et professions libérales</h3>

      <ul>
        <li><code>LocalBusiness</code> — adresse, horaires, zone géographique. Essentiel pour les requêtes locales ("meilleur [profession] à [ville]").</li>
        <li><code>Service</code> — description de vos prestations avec prix et zone de couverture.</li>
      </ul>

      <h3>SaaS et tech</h3>

      <ul>
        <li><code>SoftwareApplication</code> — nom, système d'exploitation, catégorie, prix. Les IA citent ces infos dans les comparatifs logiciels.</li>
        <li><code>HowTo</code> — étapes d'utilisation de votre outil. Format très extractible par les IA.</li>
      </ul>

      <h2>Implémentation technique</h2>

      <h3>Le format : JSON-LD uniquement</h3>

      <p>Il existe trois formats pour les données structurées : JSON-LD, Microdata et RDFa. En 2026, le choix est clair : utilisez <strong>JSON-LD dans 100 % des cas</strong>.</p>

      <p>Pourquoi :</p>

      <ul>
        <li>Google le recommande officiellement</li>
        <li>Il s'ajoute comme un bloc <code>&lt;script&gt;</code> sans toucher au HTML visible</li>
        <li>Il est plus facile à maintenir et à débugger</li>
        <li>Les crawlers IA le parsent nativement</li>
      </ul>

      <h3>Où placer le code</h3>

      <p>Le bloc JSON-LD se place dans le <code>&lt;head&gt;</code> de votre page ou juste avant <code>&lt;/body&gt;</code>. Les deux fonctionnent. La convention la plus courante est dans le <code>&lt;head&gt;</code>.</p>

      <pre><code>{`<head>
  <!-- ... vos meta tags ... -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Votre Entreprise"
  }
  </script>
</head>`}</code></pre>

      <h3>Plusieurs schemas sur une même page</h3>

      <p>Vous pouvez (et devez souvent) avoir plusieurs blocs JSON-LD sur une même page. Par exemple, votre homepage peut contenir un schema <code>Organization</code>, un schema <code>WebSite</code>, et un schema <code>FAQPage</code>. Chaque schema a son propre bloc <code>&lt;script type="application/ld+json"&gt;</code>.</p>

      <h3>Implémentation Next.js</h3>

      <p>Si votre site est en Next.js, utilisez le composant <code>Head</code> :</p>

      <pre><code>{`import Head from 'next/head';

export default function HomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Votre Entreprise",
    "url": "https://www.votre-site.fr"
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      {/* ... votre contenu ... */}
    </>
  );
}`}</code></pre>

      <h3>Implémentation WordPress</h3>

      <p>Deux options :</p>

      <ul>
        <li><strong>Plugin</strong> — Yoast SEO et Rank Math ajoutent automatiquement certains schemas (Organization, Article, BreadcrumbList). Vérifiez les réglages et complétez manuellement si nécessaire (<code>FAQPage</code> n'est pas toujours automatique).</li>
        <li><strong>Manuel</strong> — collez le bloc JSON-LD dans l'éditeur HTML de votre page, ou utilisez un plugin comme "Insert Headers and Footers" pour l'ajouter globalement.</li>
      </ul>

      <h2>Tester et valider</h2>

      <p>Avant de publier, testez systématiquement votre balisage.</p>

      <h3>Outils de test</h3>

      <ul>
        <li><strong>Rich Results Test de Google</strong> (<code>search.google.com/test/rich-results</code>) — vérifie si votre balisage est valide et éligible aux résultats enrichis. C'est l'outil de référence.</li>
        <li><strong>Schema Markup Validator</strong> (<code>validator.schema.org</code>) — valide la syntaxe de votre balisage contre le vocabulaire Schema.org complet. Plus strict que le test Google.</li>
        <li><strong>Votre score Detekia</strong> — lancez un audit avant et après l'implémentation pour mesurer l'impact sur votre score de données structurées.</li>
      </ul>

      <h3>Erreurs fréquentes à éviter</h3>

      <ul>
        <li><strong>Balisage invisible</strong> — le contenu décrit dans le schema doit être visible sur la page. Un schema <code>FAQPage</code> dont les questions ne sont pas affichées visuellement viole les directives de Google et peut être ignoré.</li>
        <li><strong>Informations incohérentes</strong> — le nom d'entreprise dans le schema <code>Organization</code> doit correspondre exactement à celui affiché sur votre site, votre Google Business Profile et vos réseaux sociaux. Toute incohérence affaiblit la confiance des IA.</li>
        <li><strong>Dates manquantes ou fausses</strong> — <code>datePublished</code> et <code>dateModified</code> doivent refléter la réalité. Ne mettez pas la date du jour comme <code>dateModified</code> si vous n'avez pas réellement modifié le contenu.</li>
        <li><strong>Schema trop minimal</strong> — un schema <code>Organization</code> avec uniquement le nom ne sert presque à rien. Remplissez toutes les propriétés pertinentes : logo, adresse, contact, <code>sameAs</code>.</li>
        <li><strong>Oublier de tester après déploiement</strong> — un changement de template, une mise à jour de plugin ou une migration peut casser votre balisage silencieusement.</li>
      </ul>

      <h2>Checklist d'implémentation</h2>

      <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '28px 28px 20px', margin: '24px 0' }}>
        <ChecklistSection
          title="Phase 1 — Les fondamentaux (jour 1)"
          items={[
            'Schema Organization sur la homepage avec nom, URL, logo, description, adresse, contact, sameAs',
            'Schema WebSite sur la homepage avec SearchAction',
            'Tester avec le Rich Results Test',
          ]}
        />
        <ChecklistSection
          title="Phase 2 — Le contenu (jour 2-3)"
          items={[
            'Schema Article ou BlogPosting sur chaque contenu éditorial avec auteur complet, dates, description',
            'Schema BreadcrumbList sur toutes les pages internes',
            'Schema FAQPage sur les pages contenant des questions-réponses',
            'Tester chaque page modifiée',
          ]}
        />
        <ChecklistSection
          title="Phase 3 — Les spécifiques (semaine 2)"
          items={[
            'Schemas spécifiques à votre activité (Product, LocalBusiness, SoftwareApplication, etc.)',
            'Vérification de cohérence : les informations dans les schemas correspondent-elles à ce qui est affiché ?',
            'Audit Detekia pour mesurer l\'impact sur le score',
          ]}
        />
        <ChecklistSection
          title="Phase continue"
          items={[
            'Vérifier le balisage après chaque mise à jour de site',
            'Ajouter FAQPage sur chaque nouvelle page contenant des Q&R',
            'Mettre à jour dateModified à chaque modification réelle de contenu',
          ]}
        />
      </div>

      <h2>Questions fréquentes</h2>

      <h3>Les données structurées suffisent-elles pour être cité par les IA ?</h3>

      <p>Non. Elles représentent un des 8 critères du score GEO (10 points directs + impact indirect sur l'autorité et l'extractibilité). Mais sans contenu de qualité, sans crawlabilité et sans présence externe, le balisage seul ne suffit pas. C'est un accélérateur, pas un substitut.</p>

      <h3>Combien de temps avant de voir l'impact ?</h3>

      <p>Les effets sur les rich snippets Google apparaissent en quelques jours à 2 semaines. L'impact sur les citations IA prend 2 à 4 semaines, le temps que les crawlers IA re-analysent votre site.</p>

      <h3>Puis-je utiliser un générateur automatique de schema ?</h3>

      <p>Oui, pour démarrer. Des outils comme le Structured Data Markup Helper de Google ou les fonctionnalités intégrées de Yoast/Rank Math fonctionnent bien pour les schemas basiques. Mais pour un balisage GEO optimisé (<code>sameAs</code> complet, auteur détaillé, <code>FAQPage</code> bien structuré), une personnalisation manuelle est souvent nécessaire.</p>

      <h3>Trop de schemas peut-il nuire ?</h3>

      <p>Non, tant que chaque schema est valide et décrit du contenu réellement présent sur la page. Google et les IA n'ont pas de limite sur le nombre de schemas par page. La seule règle : ne balisez que ce qui est visible et véridique.</p>

      <h2>Mesurez l'impact</h2>

      <p>Vous avez implémenté vos schemas ? Mesurez l'impact immédiatement.</p>

      <p>Lancez un audit GEO sur Detekia — votre score de données structurées passera de 0-3 à 7-10 si l'implémentation est correcte. En 30 secondes, sans inscription.</p>
    </>
  );
}
