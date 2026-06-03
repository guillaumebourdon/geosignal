import Link from 'next/link';

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
        Tester mon site gratuitement →
      </a>
    </div>
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

export default function ErreursGeoEcommerce() {
  return (
    <>
      <p>Quand un consommateur demande à ChatGPT "recommande-moi un sac à dos premium pour voyager", l'IA cite 3 à 5 marques par leur nom. Si votre boutique n'apparaît pas dans cette liste, vous perdez une vente auprès d'un acheteur qui ne visitera jamais Google.</p>

      <p>Le problème : la majorité des e-commerçants commettent les mêmes erreurs techniques qui les rendent invisibles pour les moteurs IA. Ces erreurs sont différentes des erreurs SEO classiques, un site parfaitement optimisé pour Google peut être totalement absent des réponses de ChatGPT, Gemini et Perplexity.</p>

      <p>Voici les 5 erreurs les plus courantes, avec pour chacune le diagnostic, la conséquence mesurable, et la solution technique à implémenter.</p>

      <h2>Erreur n°1 — Pages produit sans Schema.org Product</h2>

      <p>C'est l'erreur la plus répandue et la plus impactante. <strong>Plus de 60 % des sites e-commerce n'implémentent aucun Schema.org sur leurs pages produit</strong> (source : <a href="https://www.schemaapp.com/schema-markup/schema-markup-statistics/" target="_blank" rel="noopener noreferrer">Schema App, 2025</a>). Sans ce balisage, les IA ne comprennent pas qu'elles regardent un produit avec un prix, une disponibilité et une marque.</p>

      <h3>Le diagnostic</h3>

      <p>Ouvrez le code source de votre page produit et cherchez <code>&lt;script type="application/ld+json"&gt;</code>. Si vous ne trouvez rien, ou si le JSON-LD ne contient pas <code>"@type": "Product"</code>, votre page est invisible pour les IA en mode "recommandation produit".</p>

      <h3>La conséquence</h3>

      <p>Quand un utilisateur demande "quel sac à dos de 25L en cuir pour le bureau", l'IA cherche des pages qui déclarent explicitement : type = produit, matière = cuir, contenance = 25L, usage = bureau. Sans Schema Product, votre page est un bloc de texte indifférencié parmi des millions d'autres.</p>

      <h3>La solution</h3>

      <p>Ajoutez un Schema Product complet sur chaque page produit. Voici un template prêt à copier :</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Sac à dos Heritage 25L",
  "brand": { "@type": "Brand", "name": "VotreMarque" },
  "description": "Sac à dos en cuir pleine fleur, 25 litres, compartiment laptop 16 pouces, garantie 10 ans.",
  "material": "Cuir pleine fleur",
  "category": "Sacs à dos",
  "offers": {
    "@type": "Offer",
    "price": "189.00",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://votremarque.com/sac-heritage-25l"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "142"
  }
}
</script>`}</code></pre>

      <p>Les champs critiques : <code>brand</code>, <code>offers</code> (avec prix et disponibilité), <code>material</code>, et <code>aggregateRating</code> si vous avez des avis. Chaque champ rempli est un critère de plus que l'IA peut utiliser pour matcher votre produit à une requête.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Guide complet Schema.org pour la visibilité IA →</ArrowLink>

      <h2>Erreur n°2 — Descriptions produit en mode superlatif, pas factuel</h2>

      <p><strong>Les IA ignorent systématiquement le contenu promotionnel.</strong> L'étude Princeton/KDD 2024 sur la Generative Engine Optimization démontre que les contenus factuels et neutres sont cités 30 à 40 % plus souvent que les contenus à tonalité marketing.</p>

      <h3>Le diagnostic</h3>

      <p>Relisez vos 5 fiches produit les plus visitées. Si elles contiennent "le meilleur", "majeur", "révolutionnaire", "unique en son genre". Vous avez un problème de neutralité éditoriale.</p>

      <h3>La conséquence</h3>

      <p>ChatGPT filtre activement le contenu qu'il perçoit comme publicitaire. Quand il doit recommander un produit, il privilégie les pages qui présentent des <strong>faits vérifiables</strong> : dimensions, matières, certifications, comparaisons objectives. Un site qui dit "le meilleur sac à dos du marché" sera systématiquement écarté au profit d'un site qui dit "sac à dos 25L en cuir pleine fleur, 1.2 kg, compartiment laptop 16 pouces".</p>

      <h3>La solution</h3>

      <p>Réécrivez vos descriptions en suivant cette structure :</p>

      <pre><code>{`❌ AVANT (marketing) :
"Découvrez notre incroyable sac à dos premium, le compagnon parfait
pour tous vos déplacements. Qualité exceptionnelle garantie."

✅ APRÈS (factuel) :
"Sac à dos 25L en cuir pleine fleur tanné végétal. Poids : 1,2 kg.
Compartiment laptop jusqu'à 16 pouces. Poche extérieure rapide
avec fermeture magnétique. Bretelles ergonomiques réglables.
Fabriqué en France (atelier Lyon). Garantie 10 ans pièces et
main d'œuvre. 142 avis clients, note moyenne 4.7/5."`}</code></pre>

      <p>Chaque donnée factuelle est un "hook" pour l'IA. Quand un utilisateur demande "sac à dos cuir léger pour laptop 16 pouces fabriqué en France", l'IA peut matcher chaque critère avec votre fiche.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Les 7 critères GEO qui déterminent votre visibilité IA →</ArrowLink>

      <h2>Erreur n°3 — Pas de FAQ produit ni Schema FAQPage</h2>

      <p><strong>Les contenus structurés en FAQ sont cités 30 à 40 % plus souvent par les IA</strong> que les contenus en paragraphes continus (source : <a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noopener noreferrer">Aggarwal et al., Princeton/Georgia Tech, KDD 2024</a>). C'est le format le plus extractible pour un LLM : une question claire, une réponse directe.</p>

      <h3>Le diagnostic</h3>

      <p>Vos pages produit ont-elles une section FAQ avec des questions réelles que les clients se posent ? Et cette FAQ est-elle balisée en <code>Schema FAQPage</code> ? Si la réponse est non aux deux, vous ratez une des optimisations GEO les plus simples à implémenter.</p>

      <h3>La conséquence</h3>

      <p>Quand un prospect demande "est-ce que ce type de sac passe en bagage cabine" ou "quelle taille choisir pour un MacBook 16 pouces", l'IA cherche des pages qui répondent directement à ces sous-questions. Sans FAQ, votre page n'est jamais la réponse directe. Elle est au mieux une source secondaire.</p>

      <h3>La solution</h3>

      <p>Ajoutez 3 à 5 questions FAQ par page produit, basées sur les vraies questions de vos clients (SAV, avis, recherche interne). Balisez-les en Schema FAQPage :</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Ce sac passe-t-il en bagage cabine avion ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui. Dimensions : 45 × 30 × 18 cm, conforme aux normes IATA pour la majorité des compagnies (vérifier les restrictions low-cost)."
      }
    },
    {
      "@type": "Question",
      "name": "Quelle taille de laptop rentre dans le compartiment ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Le compartiment mesure 38 × 27 cm et accueille tous les laptops jusqu'à 16 pouces (MacBook Pro 16, Dell XPS 15, ThinkPad X1)."
      }
    },
    {
      "@type": "Question",
      "name": "Le cuir est-il traité pour résister à la pluie ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Le cuir pleine fleur reçoit un traitement hydrofuge en usine. Pour une pluie légère, aucun souci. Pour une exposition prolongée, nous recommandons notre spray protecteur (inclus à l'achat)."
      }
    }
  ]
}
</script>`}</code></pre>

      <p>Sources pour trouver les bonnes questions : recherche interne de votre site, tickets SAV, questions dans les avis clients, "People Also Ask" de Google, suggestions ChatGPT.</p>

      <ArrowLink href="/blog/faq-schema-faqpage-combo-ia">FAQ + Schema FAQPage : le combo le plus cité par les IA →</ArrowLink>

      <InlineCTA href="/">Votre site e-commerce est-il visible pour les IA ? Vérifiez en 30 secondes.</InlineCTA>

      <h2>Erreur n°4 — Pages catégorie sans contenu éditorial</h2>

      <p><strong>Une page catégorie qui n'est qu'une grille de produits est invisible pour les IA.</strong> Les LLM ne peuvent pas extraire de sens d'une liste d'images et de prix. Ils ont besoin de texte contextuel pour comprendre ce que la catégorie représente et pourquoi les produits qui s'y trouvent sont pertinents.</p>

      <h3>Le diagnostic</h3>

      <p>Ouvrez votre page catégorie principale (ex : /sacs-a-dos). Si vous ne voyez que des vignettes produit sans aucun paragraphe de texte au-dessus ou en dessous, les IA n'ont rien à extraire.</p>

      <h3>La conséquence</h3>

      <p>Les requêtes IA de type "meilleurs sacs à dos pour voyager en 2026" ou "quelle marque de sac à dos recommander" ciblent des pages qui expliquent, comparent et guident. Une grille de 48 produits sans contexte ne sera jamais citée pour ce type de requête, les IA préfèrent les guides d'achat et les pages éditoriales.</p>

      <h3>La solution</h3>

      <p>Ajoutez 200 à 500 mots de contenu éditorial sur chaque page catégorie stratégique. Structure recommandée :</p>

      <ul>
        <li><strong>Introduction (2-3 phrases) :</strong> qu'est-ce que cette catégorie, pour qui, quels sont les critères de choix</li>
        <li><strong>Guide de choix (3-5 critères) :</strong> quels paramètres regarder (matière, contenance, usage, budget)</li>
        <li><strong>Profils d'acheteur (2-3) :</strong> "Si vous cherchez X, regardez Y" : aide l'IA à matcher le bon produit au bon profil</li>
        <li><strong>FAQ catégorie (2-3 questions) :</strong> questions transversales à tous les produits de la catégorie</li>
      </ul>

      <p>Ce contenu éditorial transforme votre page catégorie d'une simple liste en une ressource citable. Les IA pourront dire "selon [VotreMarque], les critères principaux pour choisir un sac à dos sont..."</p>

      <h2>Erreur n°5 — Zéro signal d'autorité (E-E-A-T absent)</h2>

      <p><strong>Les IA recommandent en priorité les marques dont elles peuvent vérifier l'expertise et la légitimité.</strong> C'est le principe <InternalLink href="/blog/eeat-ia-experience-expertise">E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)</InternalLink> appliqué par Google et repris par les LLM. Sans ces signaux, votre marque est un inconnu non vérifiable. Et les IA ne recommandent pas les inconnus.</p>

      <h3>Le diagnostic</h3>

      <p>Vérifiez ces 5 points sur votre site :</p>

      <ul>
        <li>Page "À propos" avec l'histoire de la marque, les fondateurs (noms + parcours), et les chiffres clés</li>
        <li>Schema Organization complet (fondateurs, date de création, nombre d'employés, adresse)</li>
        <li>Mentions presse référencées sur le site (logos, liens vers articles)</li>
        <li>Certifications et labels affichés (B Corp, Oeko-Tex, Made in France, etc.)</li>
        <li><InternalLink href="/blog/avis-clients-temoignages-visibilite-ia">Avis clients structurés et visibles</InternalLink> (pas juste des étoiles, des vrais témoignages)</li>
      </ul>

      <p>Si vous cochez moins de 3 sur 5, votre autorité est insuffisante pour les IA.</p>

      <h3>La conséquence</h3>

      <p>Quand ChatGPT doit choisir entre recommander une marque avec une page About détaillée, des mentions dans la presse, et un Schema Organization complet. Et une marque dont il ne sait rien. Il choisit toujours la première. 90 % des citations IA proviennent de contenus "earned" et "owned" vérifiables (source : <a href="https://www.edelman.com/" target="_blank" rel="noopener noreferrer">Edelman, 2026</a>).</p>

      <h3>La solution</h3>

      <p>Implémentez un Schema Organization complet et enrichissez votre page À propos :</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VotreMarque",
  "url": "https://votremarque.com",
  "logo": "https://votremarque.com/logo.png",
  "foundingDate": "2018",
  "founder": {
    "@type": "Person",
    "name": "Marie Dupont",
    "jobTitle": "Fondatrice & Directrice Artistique"
  },
  "description": "Maroquinerie française en cuir pleine fleur, fabriquée à Lyon. 15 000 clients, 4.7/5 sur Trustpilot.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lyon",
    "addressCountry": "FR"
  },
  "sameAs": [
    "https://www.instagram.com/votremarque",
    "https://www.linkedin.com/company/votremarque"
  ]
}
</script>`}</code></pre>

      <p>Votre page À propos doit contenir : l'histoire (quand, pourquoi, par qui), les valeurs (sourcing, fabrication, engagement), les chiffres (clients, avis, années d'existence), et les preuves (certifications, presse, partenariats).</p>

      <ArrowLink href="/blog/audit-geo-visibilite-ia">Comment auditer votre visibilité IA actuelle →</ArrowLink>

      <h2>Le coût de l'inaction</h2>

      <p>Chaque jour où ces 5 erreurs ne sont pas corrigées, vos concurrents qui les ont déjà corrigées captent les recommandations IA à votre place. Le trafic IA croît de <strong>527 % par an</strong> (source : <a href="https://previsible.io/blog/ai-referral-traffic" target="_blank" rel="noopener noreferrer">Previsible, 2025</a>) et un visiteur référé par une IA convertit <strong>4,4 fois mieux</strong> qu'un visiteur organique classique (source : <a href="https://www.semrush.com/" target="_blank" rel="noopener noreferrer">Semrush, 2025</a>).</p>

      <p>Ces 5 erreurs sont toutes corrigeables en moins de 2 semaines. Les schemas Product et FAQPage se déploient en quelques heures. La réécriture factuelle des fiches produit demande du temps mais l'impact est immédiat dès que les IA ré-indexent votre contenu.</p>

      <ArrowLink href="/blog/ecommerce-recommandations-ia">Guide complet : optimiser votre e-commerce pour les recommandations IA →</ArrowLink>

      <h2>Questions fréquentes</h2>

      <h3>Ces erreurs concernent-elles aussi les petites boutiques Shopify ?</h3>
      <p>Oui, et c'est même plus critique. Les grandes marketplaces (Amazon, Fnac) ont déjà des schemas Product et des milliers d'avis. Les petites marques doivent compenser par la qualité de leur contenu factuel, leurs FAQ spécifiques, et leur autorité de niche. Une DNVB qui explique mieux son produit qu'Amazon sera citée sur les requêtes de niche.</p>

      <h3>Combien de temps faut-il pour voir les résultats après correction ?</h3>
      <p>Les premiers effets sont visibles en 2 à 4 semaines. ChatGPT avec navigation web et Perplexity indexent du contenu en quasi-temps réel. Les données d'entraînement des modèles sont mises à jour plus lentement (3-6 mois), mais les fonctionnalités de recherche web compensent ce délai.</p>

      <h3>Faut-il corriger les 5 erreurs en même temps ou peut-on prioriser ?</h3>
      <p>Priorisez : (1) Schema Product sur vos 10-20 produits phares, (2) réécriture factuelle de ces mêmes fiches, (3) FAQ + Schema FAQPage. Ces 3 actions couvrent 80 % de l'impact. L'autorité E-E-A-T et les pages catégorie viennent ensuite.</p>

      <h3>Mon CMS gère-t-il automatiquement les schemas Product ?</h3>
      <p>Shopify, WooCommerce et PrestaShop ont des plugins/apps qui génèrent des schemas basiques. Mais "basique" ne suffit pas, vérifiez que <code>material</code>, <code>brand</code>, <code>aggregateRating</code> et <code>offers</code> sont bien renseignés. La plupart des plugins ne remplissent que <code>name</code> et <code>price</code>.</p>

      <h3>Les descriptions factuelles ne vont-elles pas ennuyer mes clients ?</h3>
      <p>Non. L'approche factuelle n'exclut pas le storytelling. Elle le complète. Gardez votre univers de marque dans le visuel et l'édition haut de page. Ajoutez les données factuelles dans une section "Caractéristiques" ou "Détails produit" structurée. Les IA lisent les deux, mais ne citent que le factuel.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour être cité par les IA en 2026</ArrowLink>
      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : quelles différences et comment les combiner en 2026</ArrowLink>
    </>
  );
}
