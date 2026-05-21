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

export default function SourcesContenusCitationsIa() {
  return (
    <>
      <p>Quand ChatGPT, Perplexity ou Gemini formulent une reponse, ils ne devinent pas. Ils selectionnent des fragments de contenu web, les comparent entre eux et ne citent que ceux qu'ils peuvent verifier. Le mecanisme sous-jacent — le RAG (Retrieval-Augmented Generation) — fonctionne comme un reflexe de triangulation : si un contenu affirme quelque chose sans source, le modele ne peut pas le recouper. Il le delaisse au profit d'un contenu qui cite ses sources.</p>

      <p>Ce comportement est mesurable. L'etude de reference de Princeton (Aggarwal et al., KDD 2024) a demontre que l'ajout de <strong>citations et de statistiques dans un contenu augmente sa citabilite IA de 30 a 40 %</strong>. Les donnees AirOps 2026 confirment que les contenus avec sources externes verifiables obtiennent 2,4x plus de citations que les contenus sans reference.</p>

      <p>La consequence pour les editeurs de contenu est directe : en 2026, ajouter des sources n'est plus un exercice academique. C'est un levier de visibilite concret, tant pour le SEO Google que pour le GEO.</p>

      <h2>Pourquoi les sources comptent plus que jamais en 2026</h2>

      <p>Deux forces convergent pour faire des sources un critere de premier plan.</p>

      <p><strong>Cote Google : le cadre E-E-A-T.</strong> Les Search Quality Rater Guidelines de Google insistent sur la Trustworthiness — la fiabilite factuelle d'un contenu. Un article qui cite ses sources, qui attribue ses chiffres et qui date ses donnees envoie les signaux que Google cherche. L'Edelman Trust Barometer 2026 montre que 64 % des internautes declarent faire davantage confiance aux contenus qui citent leurs sources. Google suit cette tendance en valorisant les pages transparentes sur l'origine de leurs informations. Pour approfondir ce cadre, consultez notre article sur <InternalLink href="/blog/eeat-ia-experience-expertise">E-E-A-T et IA</InternalLink>.</p>

      <p><strong>Cote IA : le RAG et la verificabilite.</strong> Les systemes RAG de ChatGPT, Perplexity et Gemini fonctionnent en trois etapes : recherche, selection, generation. A l'etape de selection, le modele evalue la fiabilite de chaque fragment recupere. Un contenu qui cite une etude avec auteur, date et institution fournit au modele un ancrage verifiable. Un contenu qui affirme "les experts disent que..." sans preciser lesquels est un signal faible — le RAG ne peut pas le recouper et le delaisse.</p>

      <p>Le resultat : les sources sont devenues le point de convergence entre SEO et GEO. Un seul effort — sourcer correctement vos contenus — ameliore votre positionnement sur les deux canaux.</p>

      <h2>Les 5 types de sources qui maximisent la citabilite</h2>

      <p>Toutes les sources ne se valent pas pour les IA. Voici les cinq categories qui generent le plus de citations, classees par impact.</p>

      <h3>1. Etudes academiques et rapports de recherche</h3>

      <p>Les publications avec comite de lecture sont le signal le plus fort pour les systemes RAG. L'etude de Princeton (Aggarwal et al., KDD 2024) a montre que les contenus citant des etudes academiques obtiennent les scores de citabilite les plus eleves. La raison : ces sources sont indexees dans des bases de donnees structurees (Google Scholar, Semantic Scholar) que les IA peuvent recouper independamment.</p>

      <p><strong>Exemple :</strong> "L'ajout de statistiques et de citations augmente la visibilite IA de 40 % (Aggarwal et al., KDD 2024)" est infiniment plus citable que "des etudes montrent que les citations ameliorent la visibilite".</p>

      <h3>2. Donnees chiffrees et statistiques datees</h3>

      <p>Les IA extraient prioritairement les fragments qui contiennent des chiffres precis et dates. Les donnees AirOps 2026 montrent que les contenus contenant au moins 3 statistiques sourcees obtiennent 2,4 fois plus de citations. Chaque chiffre doit etre attribue a une source identifiable et date.</p>

      <p><strong>Exemple :</strong> "78 % des sources citees par ChatGPT ont un Domain Rating superieur a 60 (Otterly.AI, 2026)" est un fragment autonome que le RAG peut extraire et citer directement.</p>

      <h3>3. Sources institutionnelles et rapports sectoriels</h3>

      <p>Les rapports publies par des institutions reconnues (Edelman, Gartner, McKinsey) ou des plateformes specialisees (Seer Interactive, Growth Memo) beneficient d'une autorite de domaine elevee. Les IA leur accordent un poids disproportionne parce que les moteurs de recherche sous-jacents (Bing, Google) les classent deja en haut des resultats. Growth Memo a documente que les 30 premiers pourcents du texte d'une page fournissent 44,2 % des citations IA — un constat qui s'applique particulierement aux contenus qui ouvrent avec des sources institutionnelles.</p>

      <h3>4. Experts nommes et credentials verifiables</h3>

      <p>Citer un expert par son nom complet, son titre et son affiliation fournit aux IA un signal d'expertise verifiable. Le schema JSON-LD <code>Person</code> permet aux systemes de retrieval de valider cette information. Un contenu qui ecrit "selon les experts" est invisible. Un contenu qui ecrit "selon Marie Haynes, consultante SEO et auteure de EAT and SEO" est verifiable et donc citable.</p>

      <h3>5. Cas clients et donnees proprietaires</h3>

      <p>Les cas concrets avec resultats chiffres constituent une preuve d'Experience au sens E-E-A-T. Un contenu qui ecrit "notre audit de 200 sites montre que ceux avec schema FAQPage obtiennent 2,4x plus de citations IA (AirOps, 2026)" combine donnee proprietaire et source externe — le signal le plus fort pour les IA. Seer Interactive a observe que les pages contenant des cas d'etude avec metriques specifiques apparaissent 3 fois plus souvent dans les reponses de Perplexity.</p>

      <h2>Comment integrer les sources : 8 bonnes pratiques</h2>

      <h3>1. Citez dans le corps du texte, pas en bas de page</h3>

      <p>Les IA extraient des fragments de 40 a 60 mots. Si la source est en note de bas de page, elle est dissociee du fragment et perd sa valeur de verification. Integrez la reference directement dans la phrase : "selon l'etude de Princeton (Aggarwal et al., KDD 2024)" plutot qu'un appel de note.</p>

      <h3>2. Datez chaque source</h3>

      <p>Une statistique sans date est une statistique inutile pour les IA. Les modeles RAG favorisent les donnees recentes. "64 % des internautes font confiance aux contenus sources (Edelman, 2026)" est plus citable que "64 % des internautes font confiance aux contenus sources".</p>

      <h3>3. Liez vers la source primaire</h3>

      <p>Un lien externe vers la publication originale permet au RAG de verifier l'information. Les donnees Otterly.AI 2026 confirment que les contenus avec liens sortants vers des sources fiables sont mieux cites que ceux qui mentionnent une source sans y lier. C'est aussi un signal SEO positif — Google valorise les liens sortants pertinents.</p>

      <h3>4. Nommez les auteurs et les institutions</h3>

      <p>Evitez les formulations vagues : "des chercheurs ont montre", "une etude revele". Privilegiez : "Aggarwal et al. (Princeton, KDD 2024) ont demontre". Le nom fournit un ancrage que les IA peuvent recouper dans leur index.</p>

      <h3>5. Utilisez des chiffres precis</h3>

      <p>"Augmentation significative" ne vaut rien pour le RAG. "Augmentation de 40 %" est un fragment extractible. Les donnees AirOps 2026 montrent que les contenus avec chiffres precis sont cites 2,4 fois plus souvent que les contenus avec des formulations qualitatives.</p>

      <h3>6. Ajoutez des dates de publication et de modification</h3>

      <p>Les IA delaissent les contenus non dates. Ajoutez <code>datePublished</code> et <code>dateModified</code> dans vos metadonnees JSON-LD, et rendez ces dates visibles dans le HTML. Un contenu mis a jour en 2026 avec une date affichee sera prefere a un contenu sans date, meme si le second est plus recent. Pour la mise en oeuvre technique, consultez notre guide sur <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org pour les IA</InternalLink>.</p>

      <h3>7. Structurez pour l'extraction</h3>

      <p>Chaque section doit pouvoir etre citee de maniere autonome. Ouvrez chaque H2 par une "capsule de reponse" de 40 a 60 mots qui contient l'information cle et la source. Le developpement qui suit approfondit, mais le fragment extractible est dans les premieres phrases. Pour comprendre comment les IA selectionnent ces fragments, consultez <InternalLink href="/blog/comment-chatgpt-choisit-ses-sources">comment ChatGPT choisit ses sources</InternalLink>.</p>

      <h3>8. Implementez le schema Article avec citations</h3>

      <p>Le schema JSON-LD <code>Article</code> accepte la propriete <code>citation</code> qui permet de lister les references du contenu de maniere structuree. Les IA parsent ces donnees structurees avant meme de lire le contenu. Un article avec schema <code>citation</code> envoie un signal de fiabilite des la phase de retrieval.</p>

      <InlineCTA href="/">
        Vos contenus citent-ils assez de sources pour etre retenus par les IA ? Testez votre score GEO en 30 secondes.
      </InlineCTA>

      <h2>Avant/apres : une page sans sources vs avec sources</h2>

      <h3>Avant (zero source)</h3>

      <p>Prenons un article type sur un blog B2B :</p>

      <ul>
        <li>"Les entreprises doivent optimiser leur site pour les IA"</li>
        <li>"Les experts recommandent d'ajouter des donnees structurees"</li>
        <li>"La visibilite IA est de plus en plus importante"</li>
        <li>Pas de date de publication</li>
        <li>Pas de lien externe</li>
        <li>Auteur : "L'equipe marketing"</li>
      </ul>

      <p>Resultat : Google classe la page en bas de page 2. ChatGPT et Perplexity ne la citent jamais — aucun fragment verifiable pour le RAG.</p>

      <h3>Apres (sources integrees)</h3>

      <ul>
        <li>"L'ajout de citations et de statistiques augmente la citabilite IA de 40 % (Aggarwal et al., KDD 2024)"</li>
        <li>"78 % des sources citees par ChatGPT ont un Domain Rating superieur a 60 (Otterly.AI, 2026)"</li>
        <li>"Les contenus avec sources verifiables obtiennent 2,4x plus de citations (AirOps, 2026)"</li>
        <li>Date de publication : 7 mai 2026</li>
        <li>3 liens externes vers les publications originales</li>
        <li>Auteur : "Guillaume Bourdon, fondateur Detekia" avec lien vers la page auteur</li>
      </ul>

      <p>Resultat : la page remonte en page 1. Perplexity commence a la citer. ChatGPT l'utilise comme source quand on l'interroge sur le sujet. L'investissement : 45 minutes de travail editorial. L'impact : mesurable sur les deux canaux.</p>

      <h2>Conclusion : sourcer, c'est scorer</h2>

      <p>En 2026, les sources ne sont plus un detail redactionnel. Elles sont un levier de visibilite. Chaque citation attribuee, chaque chiffre date, chaque lien vers une publication de reference envoie un signal que les IA peuvent verifier — et donc utiliser pour vous citer.</p>

      <p>La convergence SEO-GEO rend cet investissement doublement rentable. Google valorise les contenus sources via E-E-A-T. Les IA les citent via le RAG. Un seul effort, deux canaux de visibilite.</p>

      <p><strong>Les 3 actions a lancer cette semaine :</strong></p>

      <ol>
        <li>Reprenez vos 5 articles les plus visites et ajoutez au moins 3 sources externes attribuees et datees dans chacun</li>
        <li>Verifiez que chaque H2 ouvre par un fragment extractible de 40 a 60 mots contenant une source</li>
        <li>Mesurez votre point de depart avec un <InternalLink href="/">scoring GEO gratuit</InternalLink> — vous saurez exactement quels signaux de sourcing manquent</li>
      </ol>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : quelles différences en 2026 ?</ArrowLink>
    </>
  );
}
