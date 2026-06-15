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

export default function RechercheLocaleIaGoogleMapsLLM() {
  return (
    <>
      <p>"Meilleur restaurant italien pres de moi." "Plombier disponible a Lyon." "Dentiste urgence Bordeaux." Ces requetes representent une part croissante des questions posees aux moteurs IA. Et la reponse ne vient plus seulement de Google Maps. ChatGPT, Perplexity et Gemini integrent desormais des donnees locales dans leurs reponses.</p>

      <p>Pour les commerces, artisans, professions liberales et entreprises a ancrage geographique, la visibilite IA locale est devenue un enjeu direct. Les clients ne cherchent plus dans un annuaire. Ils demandent a une IA, et l'IA choisit pour eux.</p>

      <h2>Comment les IA traitent les requetes locales</h2>

      <h3>Google Gemini et les donnees Google Maps</h3>

      <p>Gemini a un avantage structurel sur les requetes locales : il accede directement a la base Google Maps et Google Business Profile. Quand un utilisateur demande "coiffeur bio a Nantes", Gemini peut puiser dans les fiches etablissements, les avis, les horaires et les photos pour formuler une reponse.</p>

      <p>Les signaux qui comptent pour Gemini local :</p>

      <ul>
        <li><strong>Google Business Profile complet</strong> : nom, adresse, telephone, horaires, categories, attributs, photos</li>
        <li><strong>Avis Google</strong> : quantite, note moyenne, recence et reponses du proprietaire</li>
        <li><strong>Coherence NAP</strong> (Name, Address, Phone) entre le site web et la fiche Google</li>
        <li><strong>Proximite geographique</strong> par rapport a la localisation de l'utilisateur</li>
      </ul>

      <h3>ChatGPT et Bing Maps</h3>

      <p>ChatGPT s'appuie sur Bing pour ses donnees locales. Bing utilise ses propres fiches entreprises (Bing Places) et des sources tierces comme Yelp, TripAdvisor et les Pages Jaunes. Quand un utilisateur demande un commerce local a ChatGPT, la reponse combine des donnees de Bing Maps avec le contenu des sites web identifies comme pertinents.</p>

      <p>Le site web joue un role central pour ChatGPT : contrairement a Gemini qui peut se contenter de la fiche Google, ChatGPT extrait beaucoup d'informations directement depuis votre site. C'est la que le <InternalLink href="/blog/schema-org-ia-guide-pratique">balisage Schema.org</InternalLink> fait la difference.</p>

      <h3>Perplexity et Apple Plans</h3>

      <p>Perplexity ne dispose pas de sa propre base cartographique. Il agrege des resultats de recherche web et cite les sources. Pour les requetes locales, il tend a citer des annuaires (PagesJaunes, Yelp), des sites d'avis et les sites des entreprises elles-memes. Apple Plans, de son cote, alimente Siri et s'appuie sur ses propres donnees cartographiques enrichies par Yelp et TripAdvisor.</p>

      <p>Le point commun entre tous ces moteurs : <strong>ils cherchent des donnees structurees, coherentes et verifiables</strong>. Un commerce qui n'a pas de fiche a jour, pas de site web structure et pas d'avis recents est invisible pour tous les moteurs IA, sans exception.</p>

      <h2>Les 3 piliers de la visibilite IA locale</h2>

      <h3>1. Google Business Profile : la base indispensable</h3>

      <p>Meme si votre objectif est d'etre visible sur ChatGPT ou Perplexity, Google Business Profile reste le socle. Les donnees de votre fiche Google sont reprises par de nombreuses sources tierces qui alimentent les autres moteurs IA.</p>

      <p>Les elements a optimiser en priorite :</p>

      <ul>
        <li><strong>Categories</strong> : choisissez la categorie principale la plus precise possible, et ajoutez 2-3 categories secondaires pertinentes</li>
        <li><strong>Description</strong> : redigez une description de 750 caracteres qui inclut vos services, votre zone geographique et vos specialites. C'est un texte que les IA peuvent extraire directement.</li>
        <li><strong>Attributs</strong> : accessibilite, modes de paiement, services specifiques. Chaque attribut est une donnee structuree supplementaire.</li>
        <li><strong>Photos recentes</strong> : les IA multimodales (Gemini, GPT-4o) analysent les images. Des photos de qualite de votre etablissement, vos produits et votre equipe renforcent la confiance.</li>
        <li><strong>Posts Google</strong> : publiez regulierement (1-2 fois par mois) pour signaler que l'entreprise est active</li>
      </ul>

      <h3>2. Schema LocalBusiness : le signal que les IA lisent en priorite</h3>

      <p>Le schema <code>LocalBusiness</code> (ou ses sous-types : <code>Restaurant</code>, <code>LegalService</code>, <code>MedicalBusiness</code>, <code>Store</code>) est le format que les IA parsent pour extraire vos informations locales. C'est bien plus fiable qu'un texte en langage naturel.</p>

      <p>Les champs essentiels :</p>

      <ul>
        <li><code>name</code>, <code>address</code>, <code>telephone</code> : les bases (doivent correspondre exactement a votre fiche Google)</li>
        <li><code>openingHoursSpecification</code> : horaires structures par jour, lisibles par les IA</li>
        <li><code>geo</code> : coordonnees latitude/longitude pour le positionnement geographique</li>
        <li><code>areaServed</code> : zone de chalandise (ville, departement, region)</li>
        <li><code>priceRange</code> : indicateur de gamme de prix</li>
        <li><code>aggregateRating</code> : note moyenne et nombre d'avis (doit correspondre a une realite verifiable)</li>
        <li><code>hasMap</code> : lien vers votre fiche Google Maps</li>
      </ul>

      <p>Pour aller plus loin sur les schemas avances, consultez notre guide sur les <InternalLink href="/blog/structured-data-avance-schemas-oublies">schemas que 95% des sites oublient</InternalLink>.</p>

      <h3>3. Coherence multi-sources : le signal de confiance decisif</h3>

      <p>Les IA recoupent les informations entre plusieurs sources. Si votre adresse est differente sur votre site, sur Google et sur les Pages Jaunes, c'est un signal negatif. La coherence NAP (Name, Address, Phone) doit etre parfaite sur :</p>

      <ul>
        <li>Votre site web (dans le footer, la page contact et le schema JSON-LD)</li>
        <li>Google Business Profile</li>
        <li>Bing Places</li>
        <li>Apple Plans (via Apple Business Connect)</li>
        <li>Pages Jaunes / Yelp / TripAdvisor (selon votre secteur)</li>
        <li>Annuaires professionnels de votre secteur</li>
        <li>Reseaux sociaux (LinkedIn, Facebook, Instagram)</li>
      </ul>

      <p>Une seule incoherence (un ancien numero de telephone, une adresse sans le complement) peut suffire a faire douter les IA de la fiabilite de vos informations.</p>

      <InlineCTA href="/pricing">Votre commerce est-il visible pour les IA ? Testez votre visibilite locale.</InlineCTA>

      <h2>Les avis clients : le facteur de citation n1 en local</h2>

      <p>Les <InternalLink href="/blog/avis-clients-temoignages-visibilite-ia">avis clients</InternalLink> sont le signal le plus puissant en recherche locale IA. Quand un utilisateur demande "meilleur electricien a Toulouse", les IA comparent les avis entre les candidats potentiels. Quantite, note moyenne, recence et contenu des avis sont tous pris en compte.</p>

      <p>Les actions prioritaires :</p>

      <ul>
        <li><strong>Sollicitez des avis systematiquement</strong> apres chaque prestation. Un SMS ou email automatise avec un lien direct vers votre fiche Google est le plus efficace.</li>
        <li><strong>Repondez a tous les avis</strong>, positifs comme negatifs. Les reponses montrent aux IA que l'entreprise est active et professionnelle.</li>
        <li><strong>Diversifiez les plateformes</strong> : Google, mais aussi Trustpilot, Pages Jaunes ou les annuaires specifiques a votre secteur. Les IA triangulent entre les sources.</li>
        <li><strong>Integrez les avis sur votre site</strong> avec le schema <code>Review</code> et <code>AggregateRating</code>. C'est une preuve sociale que les IA peuvent extraire directement.</li>
      </ul>

      <h2>Contenu local : ce que les IA veulent lire sur votre site</h2>

      <p>Au-dela des donnees structurees, le contenu editorial de votre site joue un role important pour la <InternalLink href="/blog/sources-contenus-citations-ia">citabilite IA</InternalLink> locale. Les IA ne se contentent pas de lire votre adresse ; elles evaluent la pertinence et la profondeur de votre contenu local.</p>

      <ul>
        <li><strong>Pages de service geographiques</strong> : si vous intervenez dans plusieurs villes, creez une page par zone avec du contenu specifique (pas du contenu duplique avec juste le nom de ville change)</li>
        <li><strong>FAQ locales</strong> : "Combien coute un plombier a Lyon ?", "Quel est le meilleur moment pour tailler une haie a Bordeaux ?" — ces questions localisees sont exactement ce que les utilisateurs demandent aux IA</li>
        <li><strong>Actualites locales</strong> : participation a des evenements locaux, partenariats avec d'autres entreprises du quartier, engagements associatifs. Ces contenus renforcent votre ancrage geographique.</li>
        <li><strong>Etudes de cas localisees</strong> : "Renovation complete d'un appartement haussmannien dans le 6e arrondissement de Lyon" est bien plus citable que "Nos services de renovation"</li>
      </ul>

      <h2>Checklist : 10 actions pour la visibilite IA locale</h2>

      <ol>
        <li>Creer ou completer votre Google Business Profile (100% des champs remplis)</li>
        <li>Revendiquer votre fiche sur Bing Places et Apple Business Connect</li>
        <li>Implementer le schema <code>LocalBusiness</code> sur votre site avec tous les champs essentiels</li>
        <li>Verifier la coherence NAP sur toutes vos presences en ligne</li>
        <li>Mettre en place un systeme de collecte d'avis automatise</li>
        <li>Repondre a tous les avis existants (positifs et negatifs)</li>
        <li>Creer des pages de service geographiques si vous couvrez plusieurs zones</li>
        <li>Publier 5-10 FAQ localisees avec schema FAQPage</li>
        <li>Ajouter des photos recentes et de qualite sur Google et votre site</li>
        <li>Verifier que vos horaires sont a jour partout (y compris jours feries)</li>
      </ol>

      <h2>L'erreur a ne pas commettre : negliger son site web</h2>

      <p>Beaucoup de commerces pensent que Google Business Profile suffit. C'est une erreur. Google Maps alimente Gemini, mais ChatGPT et Perplexity s'appuient principalement sur le contenu de votre site web. Sans site structure avec schema LocalBusiness, FAQ et contenu local, vous etes visible sur un seul moteur IA au lieu de quatre.</p>

      <p>Votre site web est le seul actif que vous controlez a 100%. Les fiches Google, Bing ou Apple peuvent changer de regles demain. Votre site reste votre point d'ancrage permanent pour la visibilite IA.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Voir comment le scoring GEO mesure la visibilite locale</ArrowLink>

      <h2>Conclusion</h2>

      <p>La recherche locale est en train de basculer vers les IA conversationnelles. Google Maps reste central, mais ChatGPT, Perplexity et Siri sont devenus des canaux de decouverte de commerces et services locaux a part entiere. Les entreprises qui optimisent leur presence pour tous ces moteurs — avec des donnees structurees coherentes, des avis recents et un contenu local de qualite — captent une part croissante de clients que leurs concurrents ne voient meme pas arriver.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">Le guide complet du GEO en 2026</ArrowLink>
    </>
  );
}
