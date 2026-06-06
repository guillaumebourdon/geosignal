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

export default function StructuredDataAvanceSchemas() {
  return (
    <>
      <p>Vous avez implemente Organization et FAQPage sur votre site. Vous pensez que vos donnees structurees sont en ordre. Pourtant, les IA vous ignorent au profit de concurrents qui utilisent des schemas que vous ne connaissez peut-etre meme pas.</p>

      <p>L'etude de Princeton (Aggarwal et al., KDD 2024) a demontre que les contenus avec des donnees structurees completes obtiennent 3 a 5x plus de citations IA. Mais la cle n'est pas d'avoir "du schema" — c'est d'avoir les bons schemas, avec les bons champs. Et 95 % des sites s'arretent a Organization et FAQPage, en ignorant une dizaine de types qui font la difference pour les moteurs IA.</p>

      <h2>Pourquoi les schemas avances comptent pour les IA</h2>

      <p>Les systemes RAG (Retrieval-Augmented Generation) de ChatGPT, Perplexity et Gemini ne lisent pas vos pages comme un humain. Ils cherchent des structures de donnees qu'ils peuvent extraire, comparer et recouper. Un schema JSON-LD bien rempli est un signal de confiance : le site fournit des donnees verifiables dans un format standardise.</p>

      <p>L'enjeu n'est pas le SEO classique (les rich snippets de Google). C'est la <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">citabilite IA</InternalLink> — la capacite de votre contenu a etre selectionne et cite dans une reponse generee. Et pour ca, les schemas avances font une difference mesurable.</p>

      <h2>Les schemas que presque personne n'implemente</h2>

      <h3>1. HowTo — les guides etape par etape</h3>

      <p>Si votre site contient des tutoriels, des guides pratiques ou des processus en plusieurs etapes, le schema HowTo permet aux IA de les extraire sous forme de liste structuree. C'est le format ideal pour les reponses directes.</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Comment [votre processus]",
  "step": [
    { "@type": "HowToStep", "name": "Etape 1", "text": "[description]" },
    { "@type": "HowToStep", "name": "Etape 2", "text": "[description]" },
    { "@type": "HowToStep", "name": "Etape 3", "text": "[description]" }
  ]
}
</script>`}</code></pre>

      <p><strong>Pourquoi ca marche :</strong> les IA adorent les listes numerotees. Un HowTo transforme votre contenu en reponse prete a citer. Particulierement efficace pour les requetes "comment faire..." qui representent une part croissante des questions posees aux IA.</p>

      <h3>2. Review et AggregateRating — la preuve sociale structuree</h3>

      <p>Les <InternalLink href="/blog/avis-clients-temoignages-visibilite-ia">avis clients</InternalLink> sont un des signaux les plus forts pour les IA. Mais un temoignage en texte libre pese moins qu'un avis structure avec note, auteur et date.</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[votre produit]",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[note moyenne]",
    "reviewCount": "[nombre d'avis]",
    "bestRating": "5"
  },
  "review": [{
    "@type": "Review",
    "author": { "@type": "Person", "name": "[nom du client]" },
    "datePublished": "[date]",
    "reviewBody": "[contenu de l'avis]",
    "reviewRating": { "@type": "Rating", "ratingValue": "[note]" }
  }]
}
</script>`}</code></pre>

      <p>Les IA recoupent les notes entre differentes sources (votre site, Trustpilot, Google Reviews). Un AggregateRating sur votre site renforce la coherence du signal.</p>

      <h3>3. Person — l'expertise des auteurs</h3>

      <p>L'<InternalLink href="/blog/eeat-ia-experience-expertise">autorite E-E-A-T</InternalLink> repose sur l'identification des auteurs. Un schema Person avec qualifications, liens sociaux et affiliation est un signal direct pour les IA.</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[nom de l'auteur]",
  "jobTitle": "[titre professionnel]",
  "worksFor": { "@type": "Organization", "name": "[entreprise]" },
  "sameAs": [
    "[URL LinkedIn]",
    "[URL Twitter]"
  ],
  "knowsAbout": ["[domaine d'expertise 1]", "[domaine d'expertise 2]"]
}
</script>`}</code></pre>

      <p>Le champ <code>knowsAbout</code> est particulierement sous-utilise. Il permet aux IA de savoir que l'auteur est competent sur un sujet precis — un signal direct pour la credibilite de ses affirmations.</p>

      <h3>4. SpeakableSpecification — le contenu lisible par les assistants vocaux</h3>

      <p>Ce schema indique aux IA quels passages de votre page sont les mieux adaptes pour etre lus a voix haute. C'est un signal de citabilite directe : vous designez vous-meme les phrases qui font les meilleures reponses.</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".answer-capsule", ".key-takeaway"]
  }
}
</script>`}</code></pre>

      <p>Peu de sites l'utilisent, mais les IA qui generent des reponses vocales (Siri, Google Assistant) s'en servent pour identifier les extraits citables.</p>

      <h3>5. DefinedTerm et DefinedTermSet — le vocabulaire de votre domaine</h3>

      <p>Si votre site utilise un vocabulaire technique ou specialise, ce schema permet aux IA de comprendre que vous definissez des termes de maniere autoritaire. C'est particulierement puissant pour les sites B2B, juridiques, medicaux ou financiers.</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "name": "Glossaire [votre domaine]",
  "hasDefinedTerm": [{
    "@type": "DefinedTerm",
    "name": "[terme technique]",
    "description": "[definition claire]"
  }]
}
</script>`}</code></pre>

      <p>Quand un utilisateur demande "qu'est-ce que [terme technique]" a ChatGPT, un DefinedTerm sur votre site augmente considerablement vos chances d'etre cite comme source.</p>

      <h3>6. ItemList — les classements et comparatifs</h3>

      <p>Les requetes "meilleur...", "top 10...", "comparatif..." sont parmi les plus frequentes sur les IA. Le schema ItemList structure vos listes de maniere a ce que les IA puissent les extraire directement.</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "[titre de votre classement]",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "[element 1]", "url": "[lien]" },
    { "@type": "ListItem", "position": 2, "name": "[element 2]", "url": "[lien]" }
  ]
}
</script>`}</code></pre>

      <h3>7. Service et Offer — vos prestations avec prix et conditions</h3>

      <p>Si vous vendez des services, le schema Service avec Offer integre (prix, disponibilite, zone geographique) permet aux IA de comparer votre offre avec celle de vos concurrents de maniere structuree.</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "[nom du service]",
  "provider": { "@type": "Organization", "name": "[votre entreprise]" },
  "areaServed": "[zone geographique]",
  "offers": {
    "@type": "Offer",
    "price": "[prix]",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
}
</script>`}</code></pre>

      <p>Les requetes de type "combien coute [service]" ou "quel [service] a [ville]" sont directement alimentees par ce schema. Pour approfondir l'implementation, consultez notre <InternalLink href="/blog/schema-org-ia-guide-pratique">guide complet Schema.org</InternalLink>.</p>

      <h2>Les champs oublies dans les schemas courants</h2>

      <p>Meme si vous utilisez deja Organization ou Article, certains champs sont presque toujours vides :</p>

      <h3>Organization : les champs qui manquent</h3>

      <ul>
        <li><code>foundingDate</code> — la date de creation de l'entreprise (signal d'anciennete)</li>
        <li><code>numberOfEmployees</code> — la taille de l'equipe (signal de credibilite)</li>
        <li><code>award</code> — les prix et distinctions recus</li>
        <li><code>sameAs</code> — les liens vers TOUS vos profils (LinkedIn, Twitter, Crunchbase, <InternalLink href="/blog/wikipedia-source-numero-1-ia">Wikipedia</InternalLink>)</li>
        <li><code>knowsAbout</code> — les domaines d'expertise de l'entreprise</li>
      </ul>

      <h3>Article : les champs qui manquent</h3>

      <ul>
        <li><code>dateModified</code> — la date de derniere mise a jour (signal de <InternalLink href="/blog/sitemap-robots-txt-bots-ia-2026">fraicheur</InternalLink>)</li>
        <li><code>wordCount</code> — le nombre de mots (signal de profondeur)</li>
        <li><code>citation</code> — les sources citees dans l'article</li>
        <li><code>about</code> — le sujet principal de l'article (aide les IA a categoriser)</li>
        <li><code>author</code> avec un schema Person complet (pas juste un nom en string)</li>
      </ul>

      <h2>Comment prioriser l'implementation</h2>

      <p>Ne tentez pas d'implementer tous ces schemas en meme temps. Voici l'ordre recommande en fonction de l'impact sur la citabilite IA :</p>

      <ol>
        <li><strong>Enrichissez vos schemas existants</strong> — ajoutez les champs manquants a Organization et Article. C'est le gain le plus rapide, en 1-2 heures.</li>
        <li><strong>Ajoutez Person</strong> sur vos pages auteur et votre equipe. Impact direct sur l'autorite E-E-A-T.</li>
        <li><strong>Ajoutez HowTo</strong> sur vos guides et tutoriels. Impact direct sur la citabilite des requetes "comment...".</li>
        <li><strong>Ajoutez Review/AggregateRating</strong> si vous avez des avis clients. Impact sur la <InternalLink href="/blog/sources-contenus-citations-ia">verifiabilite</InternalLink>.</li>
        <li><strong>Ajoutez les schemas de niche</strong> (DefinedTerm, Service, ItemList) selon votre secteur.</li>
      </ol>

      <InlineCTA href="/pricing">Decouvrez quels schemas manquent sur votre site</InlineCTA>

      <h2>Les erreurs courantes a eviter</h2>

      <ul>
        <li><strong>Ne dupliquez pas les schemas</strong> — un seul Organization par site, pas un par page.</li>
        <li><strong>Validez toujours</strong> avec le Rich Results Test de Google et le Schema Markup Validator.</li>
        <li><strong>Ne remplissez pas avec des donnees inventees</strong> — les IA recoupent les informations. Un <code>numberOfEmployees: 500</code> quand vous etes 5 sera detecte.</li>
        <li><strong>Utilisez JSON-LD, pas les microdata</strong> — les IA parsent plus facilement le JSON-LD.</li>
        <li><strong>Mettez a jour <code>dateModified</code></strong> a chaque modification reelle du contenu, pas automatiquement a chaque visite.</li>
      </ul>

      <h2>Mesurer l'impact des schemas avances</h2>

      <p>L'impact des donnees structurees sur la visibilite IA se mesure via le <InternalLink href="/blog/audit-geo-visibilite-ia">test de citation IA</InternalLink>. Avant d'ajouter vos schemas, lancez un audit pour avoir un score de reference. Puis relancez 2 a 4 semaines apres l'implementation pour mesurer le gain.</p>

      <p>Les donnees de Otterly.AI (2026) montrent que les sites qui passent de 0 schema a une implementation complete gagnent en moyenne <strong>3 a 5x plus de citations IA</strong>. Mais l'essentiel du gain vient des 3-4 premiers schemas bien remplis, pas de la quantite.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Voir comment le scoring GEO mesure les donnees structurees →</ArrowLink>

      <h2>Conclusion</h2>

      <p>Les donnees structurees avancees ne sont pas un luxe technique reserve aux grandes entreprises. Ce sont des signaux directs que vous envoyez aux moteurs IA pour leur dire : "je suis une source fiable, voici mes donnees sous un format que vous pouvez verifier". Dans un monde ou les IA trient des milliards de pages pour n'en citer que quelques-unes, ces signaux font la difference entre etre cite et etre ignore.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">Le guide complet du GEO en 2026 →</ArrowLink>
    </>
  );
}
