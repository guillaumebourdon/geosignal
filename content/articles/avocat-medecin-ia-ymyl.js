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

export default function AvocatMedecinIaYmyl() {
  return (
    <>
      <p>Un patient tape "douleur thoracique gauche" dans ChatGPT. Un justiciable demande à Perplexity "comment contester un licenciement abusif". Un contribuable interroge Gemini sur "l'optimisation fiscale d'une SCI". Dans ces trois cas, la qualité de la réponse peut avoir des conséquences directes sur la santé, la liberté ou le patrimoine de la personne.</p>

      <p>Google appelle ces sujets <strong>YMYL : Your Money Your Life</strong>. Des contenus dont l'inexactitude peut causer un préjudice réel. Et ce cadre, concu pour les résultats de recherche traditionnels, est devenu encore plus critique avec les moteurs IA.</p>

      <p>Car les IA ne se contentent pas de lister des liens. Elles synthétisent, reformulent, et parfois hallucinent. Dans un domaine YMYL, une hallucination n'est pas un désagrément : c'est un danger. Et c'est précisément pour cette raison que les moteurs IA appliquent des filtres de crédibilité renforcés sur ces sujets.</p>

      <p><strong>Bonne nouvelle pour les professions réglementées :</strong> avocats, médecins, comptables, architectes, notaires disposent d'un avantage naturel considérable. Leurs diplomes, leurs inscriptions ordinales et leur cadre déontologique sont exactement les signaux que les IA recherchent pour valider une source YMYL.</p>

      <h2>YMYL : pourquoi c'est le terrain le plus exigeant pour les IA</h2>

      <h3>Qu'est-ce que le YMYL exactement ?</h3>

      <p>YMYL (Your Money Your Life) est une classification définie par Google dans ses Search Quality Rater Guidelines. Elle désigne les sujets dont le contenu peut affecter significativement :</p>

      <ul>
        <li><strong>La santé</strong> : symptomes, diagnostics, traitements, médicaments, santé mentale</li>
        <li><strong>La sécurité financière</strong> : investissements, impots, assurances, crédits, retraite</li>
        <li><strong>La sécurité juridique</strong> : droits, procédures, contrats, litiges, droit pénal</li>
        <li><strong>La sécurité physique</strong> : conseils de sécurité, situations d'urgence</li>
        <li><strong>Le bien-être social</strong> : informations civiques, élections, services publics</li>
      </ul>

      <p>Pour ces sujets, Google exige un niveau de preuve supérieur. Les Quality Raters ont pour instruction de vérifier systématiquement les credentials de l'auteur, la fiabilité de la source, et la conformité avec le consensus professionnel.</p>

      <h3>Pourquoi les IA sont encore plus strictes sur le YMYL</h3>

      <p>Les moteurs IA ont un problème supplémentaire par rapport à Google : ils ne se contentent pas de recommander des liens, ils génèrent des réponses. Quand ChatGPT synthétise des informations médicales, juridiques ou financières, il engage implicitement sa crédibilité. Une erreur n'est pas un mauvais classement dans une liste de résultats. C'est une fausse information présentée comme un fait.</p>

      <p>C'est pour cette raison que les systèmes RAG (Retrieval-Augmented Generation) appliquent des filtres renforcés sur les requêtes YMYL :</p>

      <ul>
        <li><strong>Sélection de sources plus restrictive.</strong> Les IA privilégient les sources institutionnelles, les sites de professionnels identifiés et les publications de référence. Un blog anonyme sur le droit du travail sera ignoré au profit du site d'un cabinet d'avocats avec auteur nommé et inscription au barreau.</li>
        <li><strong>Vérification croisée renforcée.</strong> Sur une requête médicale, les IA triangulent davantage : elles cherchent la convergence entre plusieurs sources fiables avant de formuler une réponse. Une information isolée, meme correcte, est moins susceptible d'etre citée.</li>
        <li><strong>Avertissements systématiques.</strong> ChatGPT, Gemini et Perplexity ajoutent des disclaimers sur les sujets YMYL ("consultez un professionnel de santé", "ceci ne constitue pas un avis juridique"). Mais ils citent quand meme des sources, et ces sources sont celles qui passent le filtre de crédibilité.</li>
      </ul>

      <ArrowLink href="/blog/eeat-ia-experience-expertise">E-E-A-T et IA : Google et ChatGPT veulent les memes preuves</ArrowLink>

      <h2>L'avantage naturel des professions réglementées</h2>

      <p>Les professions réglementées (avocats, médecins, experts-comptables, architectes, notaires, pharmaciens, sages-femmes, kinésithérapeutes) possèdent un atout que la plupart des créateurs de contenu n'ont pas : <strong>des preuves d'expertise vérifiables par défaut</strong>.</p>

      <h3>Les signaux E-E-A-T intégrés aux professions réglementées</h3>

      <p>Chaque professionnel réglementé dispose naturellement de :</p>

      <ul>
        <li><strong>Un diplome reconnu par l'État.</strong> Doctorat en médecine, CAPA pour les avocats, DEC pour les experts-comptables. Ce sont des credentials vérifiables que les IA peuvent valider.</li>
        <li><strong>Une inscription ordinale.</strong> Ordre des médecins, barreau, ordre des experts-comptables. Ces inscriptions sont des bases de données publiques que les systèmes de retrieval peuvent croiser.</li>
        <li><strong>Un cadre déontologique.</strong> L'obligation de compétence, de formation continue et de responsabilité professionnelle constitue un signal de Trustworthiness que les IA valorisent.</li>
        <li><strong>Une expérience terrain documentable.</strong> Années de pratique, spécialisations, cas traités. Ce sont les preuves d'Experience que le cadre E-E-A-T exige.</li>
      </ul>

      <p>Le problème est que la plupart des professionnels ne rendent pas ces signaux visibles en ligne. Un avocat avec 20 ans de barreau et une spécialisation en droit des affaires peut avoir un site web qui n'affiche aucune de ces informations de manière structurée. Pour les IA, c'est comme si ces credentials n'existaient pas.</p>

      <h3>Le paradoxe YMYL : les plus légitimes sont souvent les moins visibles</h3>

      <p>Les professionnels les plus qualifiés pour parler de sujets YMYL sont souvent les moins présents en ligne. Plusieurs raisons expliquent ce paradoxe :</p>

      <ul>
        <li>Les contraintes déontologiques limitent la communication (publicité encadrée pour les avocats et médecins)</li>
        <li>Le bouche-à-oreille reste le canal d'acquisition dominant pour beaucoup de cabinets et praticiens</li>
        <li>Le manque de temps et de compétences numériques freine l'investissement web</li>
        <li>La méfiance envers le "marketing digital" dans des professions fondées sur la relation de confiance</li>
      </ul>

      <p>Résultat : les IA citent des sources moins qualifiées (sites d'information généraliste, forums, blogs) parce qu'elles n'ont pas accès aux signaux de crédibilité des vrais experts. C'est une perte pour les utilisateurs et une opportunité manquée pour les professionnels.</p>

      <InlineCTA href="/">
        Vous etes avocat, médecin ou expert-comptable ? Testez la visibilité IA de votre cabinet en 30 secondes.
      </InlineCTA>

      <h2>Comment les IA évaluent la crédibilité des contenus YMYL</h2>

      <p>Comprendre le mécanisme de sélection des IA sur les sujets YMYL permet d'identifier précisément les leviers d'action. Voici comment fonctionne la chaine de confiance.</p>

      <h3>Étape 1 : le filtrage par le moteur de recherche sous-jacent</h3>

      <p>ChatGPT s'appuie sur Bing, Gemini sur Google, Perplexity sur un index hybride. Ces moteurs appliquent déjà un filtre YMYL : pour une requête "symptomes AVC", Bing ne remontera pas un article de blog sans auteur identifié. Il privilégiera les sources médicales reconnues (HAS, Vidal, sites hospitaliers, sites de praticiens).</p>

      <p>Si votre site ne passe pas ce premier filtre, il n'atteindra jamais le LLM. C'est pourquoi les fondamentaux SEO restent essentiels en GEO.</p>

      <h3>Étape 2 : la sélection par le LLM</h3>

      <p>Une fois les résultats remontés par le moteur de recherche, le LLM applique sa propre couche de sélection. Sur les sujets YMYL, cette sélection est plus stricte :</p>

      <ul>
        <li><strong>Identification de l'auteur.</strong> Le LLM cherche un auteur nommé avec des credentials vérifiables. "Dr. Martin Dupont, cardiologue, CHU de Lyon" est un signal fort. "L'équipe" ou l'absence d'auteur est un signal faible.</li>
        <li><strong>Cohérence avec le consensus.</strong> Le LLM vérifie si l'information est cohérente avec ce qu'il connait du consensus médical, juridique ou financier. Un contenu qui contredit le consensus sans justification sera écarté.</li>
        <li><strong>Structure et citabilité.</strong> Les contenus avec des schemas JSON-LD (Person, MedicalEntity, LegalService), des FAQ structurées et des paragraphes courts sont plus faciles à extraire et à citer.</li>
      </ul>

      <h3>Étape 3 : la formulation avec disclaimers</h3>

      <p>Meme quand une IA cite votre contenu YMYL, elle ajoute des avertissements. Mais la citation est là. Et l'utilisateur qui lit "selon Me Dupont, avocat au barreau de Paris, les délais de contestation d'un licenciement sont de 12 mois (source : cabinet-dupont.fr)" a accès à une information sourcée et vérifiable.</p>

      <p>C'est précisément cette citation qui génère du trafic qualifié vers votre site. Et c'est le trafic le plus précieux : des personnes en situation de besoin réel, qui cherchent un professionnel compétent.</p>

      <h2>Les risques spécifiques : hallucinations et recommandations erronées</h2>

      <p>Les domaines YMYL sont ceux où les hallucinations des IA ont les conséquences les plus graves. Comprendre ces risques renforce la valeur de votre présence en tant que source fiable.</p>

      <h3>Hallucinations médicales</h3>

      <p>Les IA peuvent inventer des interactions médicamenteuses, suggérer des dosages incorrects, ou minimiser des symptomes graves. Une étude publiée dans le JAMA en 2024 a montré que les LLM fournissent des informations médicales partiellement incorrectes dans 20 à 30 % des cas sur des questions complexes. Quand un praticien publie du contenu structuré et sourcé, il contribue à réduire ce taux en fournissant aux IA des données fiables à citer.</p>

      <h3>Hallucinations juridiques</h3>

      <p>Les IA confondent régulièrement des juridictions, citent des articles de loi abrogés, ou inventent des jurisprudences. Le cas très médiatisé de l'avocat new-yorkais Steven Schwartz (2023), dont le mémoire contenait des citations de jurisprudence inventées par ChatGPT, illustre les risques. Les contenus juridiques publiés par des avocats avec références précises (articles de loi, jurisprudences datées, sources officielles) sont la meilleure protection contre ces erreurs.</p>

      <h3>Hallucinations financières</h3>

      <p>Taux d'intérêt obsolètes, plafonds fiscaux incorrects, mécanismes d'investissement mal expliqués. Les contenus financiers sont particulièrement sensibles car les réglementations changent fréquemment. Un expert-comptable qui maintient ses contenus à jour avec des dates de modification visibles fournit un signal de fraicheur que les IA valorisent fortement.</p>

      <p><strong>Pour chaque type de professionnel, la présence en ligne n'est pas un luxe. C'est un service rendu aux utilisateurs</strong> qui, sans vos contenus fiables, recoivent des réponses IA potentiellement inexactes.</p>

      <h2>5 actions concrètes pour un professionnel YMYL</h2>

      <p>Voici les 5 actions à plus fort impact pour un avocat, médecin, comptable ou tout professionnel réglementé qui souhaite etre cité par les IA sur ses sujets d'expertise.</p>

      <h3>1. Créer une page auteur complète avec diplomes et spécialisations</h3>

      <p>La page auteur est le socle de votre crédibilité IA. Elle doit contenir :</p>

      <ul>
        <li><strong>Identité complète :</strong> nom, prénom, titre professionnel (Me, Dr., etc.)</li>
        <li><strong>Diplomes et formations :</strong> université, année, spécialisations, DU, DIU, certifications</li>
        <li><strong>Inscription ordinale :</strong> numéro d'inscription, barreau ou ordre de rattachement</li>
        <li><strong>Expérience :</strong> années de pratique, domaines de spécialisation, parcours professionnel</li>
        <li><strong>Publications :</strong> articles dans des revues spécialisées, interventions, conférences</li>
        <li><strong>Photo professionnelle :</strong> un visage identifiable renforce la confiance</li>
      </ul>

      <p>Chaque contenu publié sur votre site doit renvoyer vers cette page auteur. C'est le lien qui permet aux IA de vérifier les credentials de l'auteur.</p>

      <h3>2. Implémenter le Schema Person avec credentials médicales ou juridiques</h3>

      <p>Le Schema JSON-LD <code>Person</code> est le format structuré que les IA parsent pour valider l'identité et les qualifications d'un auteur. Pour un professionnel YMYL, il faut aller au-delà du schema basique.</p>

      <p>Exemple pour un médecin :</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Dr. Sophie Martin",
  "jobTitle": "Cardiologue",
  "medicalSpecialty": "Cardiology",
  "qualifications": "Doctorat en médecine, DU Cardiologie interventionnelle",
  "worksFor": {
    "@type": "MedicalOrganization",
    "name": "Cabinet de Cardiologie Martin",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lyon",
      "addressRegion": "Rhône-Alpes",
      "addressCountry": "FR"
    }
  },
  "memberOf": {
    "@type": "Organization",
    "name": "Ordre National des Médecins"
  },
  "sameAs": [
    "https://www.linkedin.com/in/dr-sophie-martin",
    "https://annuaire.conseil-national.medecin.fr/..."
  ]
}`}</code></pre>

      <p>Pour un avocat, utilisez <code>LegalService</code> en complément du schema <code>Person</code>, avec le barreau de rattachement et les domaines de compétence.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA : guide pratique pour les LLM</ArrowLink>

      <h3>3. Publier des FAQ médicales, juridiques ou financières structurées</h3>

      <p>Les FAQ sont le format le plus directement citable par les IA. Une question précise avec une réponse concise et sourcée est exactement ce que le RAG cherche à extraire.</p>

      <p>Règles pour des FAQ YMYL efficaces :</p>

      <ul>
        <li><strong>Formulez les questions comme vos patients ou clients les posent.</strong> Pas "Quelles sont les modalités de la procédure de licenciement pour motif personnel ?", mais "Mon employeur peut-il me licencier sans motif ?"</li>
        <li><strong>Répondez en 2-3 phrases factuelles</strong> avant de développer. La première phrase doit etre autonome et citable.</li>
        <li><strong>Citez vos sources.</strong> Article de loi, recommandation HAS, jurisprudence. Les IA citent les contenus qui citent eux-memes des sources.</li>
        <li><strong>Ajoutez le schema FAQPage.</strong> Le balisage structuré permet aux IA de parser directement les paires question/réponse.</li>
        <li><strong>Datez chaque FAQ.</strong> "Mis à jour le 15 mai 2026" est un signal de fraicheur décisif pour les IA sur les sujets réglementaires.</li>
      </ul>

      <p>Un cabinet d'avocats qui publie 20 FAQ structurées sur le droit du travail, avec schema FAQPage et références au Code du travail, devient une source de choix pour les IA sur ces requêtes.</p>

      <h3>4. Etre présent dans les annuaires professionnels et bases de référence</h3>

      <p>Les annuaires professionnels jouent un role clé dans la triangulation des IA. Quand un moteur IA vérifie la crédibilité d'un auteur, il cherche des mentions cohérentes dans plusieurs sources indépendantes.</p>

      <p>Les annuaires prioritaires par profession :</p>

      <ul>
        <li><strong>Médecins :</strong> Annuaire du Conseil National de l'Ordre des Médecins, Doctolib, Pages Jaunes Santé, annuaires hospitaliers</li>
        <li><strong>Avocats :</strong> Annuaire du CNB (avocats.fr), annuaires des barreaux locaux, Legal 500, Chambers</li>
        <li><strong>Experts-comptables :</strong> Annuaire de l'Ordre des Experts-Comptables, annuaires CCI</li>
        <li><strong>Architectes :</strong> Annuaire de l'Ordre des Architectes, Architectes-pour-tous.fr</li>
      </ul>

      <p>Assurez-vous que votre nom, votre spécialisation et l'URL de votre site sont cohérents sur tous ces annuaires. Les incohérences (nom différent, adresse différente, spécialisation différente) affaiblissent le signal de confiance.</p>

      <h3>5. Publier et etre cité dans la presse spécialisée</h3>

      <p>Les publications dans des revues professionnelles et les citations dans la presse spécialisée sont les signaux d'Authoritativeness les plus puissants pour les IA.</p>

      <p>Actions concrètes :</p>

      <ul>
        <li><strong>Publiez dans les revues de votre profession.</strong> Gazette du Palais, Dalloz, Revue Fiduciaire, Presse Médicale. Meme un commentaire d'arret ou une note de jurisprudence compte.</li>
        <li><strong>Répondez aux journalistes.</strong> Les plateformes comme HARO ou Babbar Press permettent de se positionner comme expert source. Chaque citation dans un article de presse renforce votre autorité aux yeux des IA.</li>
        <li><strong>Participez à des conférences et webinaires.</strong> Les replays et comptes rendus publiés en ligne sont des signaux d'expertise que les IA captent.</li>
        <li><strong>Écrivez des tribunes sur des médias en ligne.</strong> Les Echos, Le Figaro, Le Monde publient régulièrement des tribunes d'experts. Une seule publication dans un média de référence peut transformer votre autorité perçue par les IA.</li>
      </ul>

      <p>L'objectif est de créer un réseau de mentions qui confirment votre expertise. Les IA utilisent la triangulation : quand votre nom apparait comme expert sur votre site, dans un annuaire professionnel, dans une revue spécialisée et dans un article de presse, le signal est sans ambiguité.</p>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">Score GEO : comment mesurer la visibilité IA de votre site</ArrowLink>

      <h2>Cas concret : un cabinet d'avocats avant et après optimisation</h2>

      <h3>Situation initiale</h3>

      <p>Un cabinet d'avocats spécialisé en droit du travail à Bordeaux. 3 associés, 15 ans d'expérience moyenne. Site web avec 5 pages (accueil, domaines, équipe, contact, mentions légales). Aucun contenu éditorial, aucun schema JSON-LD, page "équipe" avec prénoms et photos mais sans diplomes ni barreau.</p>

      <p>Résultat IA : quand un utilisateur demande "avocat droit du travail Bordeaux" à ChatGPT ou Perplexity, le cabinet n'apparait jamais. Les IA citent des annuaires (avocats.fr, Justifit) et des sites d'information généraliste (service-public.fr, Village de la Justice).</p>

      <h3>Actions mises en place</h3>

      <ol>
        <li><strong>Pages auteur individuelles</strong> pour chaque associé, avec diplomes, barreau, spécialisations, publications et schema Person enrichi</li>
        <li><strong>30 FAQ structurées</strong> sur le droit du travail, avec schema FAQPage, références au Code du travail et dates de mise à jour</li>
        <li><strong>Schema LegalService</strong> sur la homepage avec adresse, barreau, domaines de compétence, horaires</li>
        <li><strong>Harmonisation des annuaires</strong> : profils mis à jour sur avocats.fr, barreau de Bordeaux, LinkedIn, Google Business Profile</li>
        <li><strong>2 tribunes publiées</strong> dans des médias spécialisés (Dalloz Actualité, Village de la Justice) avec bio complète et lien vers le site</li>
      </ol>

      <h3>Résultat après 8 semaines</h3>

      <p>Le cabinet commence à apparaitre dans les réponses de Perplexity pour des requêtes comme "délai contestation licenciement" et "indemnités prud'hommes 2026". ChatGPT le mentionne parmi les sources quand un utilisateur demande des informations sur le droit du travail à Bordeaux. Le trafic organique augmente de 40 % grace aux FAQ qui se positionnent également sur Google.</p>

      <p>L'investissement total : environ 3 jours de travail répartis sur 2 mois. Le retour : un flux continu de prospects qualifiés via un canal que les concurrents n'exploitent pas encore.</p>

      <InlineCTA href="/">
        Mesurez la visibilité IA de votre cabinet ou de votre pratique. Audit GEO gratuit en 30 secondes.
      </InlineCTA>

      <h2>Comment Detekia aide les professionnels YMYL</h2>

      <p>Les cabinets d'avocats, les praticiens de santé et les experts-comptables n'ont pas le temps de devenir des spécialistes du GEO. C'est précisément le role de Detekia.</p>

      <p>Notre <InternalLink href="/">audit GEO gratuit</InternalLink> analyse votre site sur les 7 critères de citabilité IA et identifie les lacunes spécifiques aux sites YMYL :</p>

      <ul>
        <li><strong>Détection des schemas manquants :</strong> Person, Physician, LegalService, FAQPage</li>
        <li><strong>Analyse de la page auteur :</strong> credentials visibles, diplomes, affiliations ordinales</li>
        <li><strong>Vérification de l'accessibilité IA :</strong> GPTBot, ClaudeBot, PerplexityBot ont-ils accès à vos contenus ?</li>
        <li><strong>Évaluation de la fraicheur :</strong> dates de publication et modification, signaux d'actualisation</li>
        <li><strong>Score de citabilité par thématique :</strong> sur quelles requêtes votre site a-t-il une chance d'etre cité ?</li>
      </ul>

      <p>En 30 secondes, vous obtenez un diagnostic clair avec des recommandations priorisées. Les professionnels YMYL partent souvent d'un score bas (faute de contenus et de données structurées) mais progressent rapidement : leurs credentials sont déjà là, il suffit de les rendre visibles pour les IA.</p>

      <h2>Conclusion : la crédibilité est votre meilleur levier GEO</h2>

      <p>Les professions réglementées ont un avantage structurel dans la course à la visibilité IA. Diplomes, inscriptions ordinales, publications, expérience terrain : tout ce qui fait votre légitimité professionnelle est exactement ce que les IA recherchent pour citer une source YMYL.</p>

      <p>Le défi n'est pas de créer de la crédibilité. Elle existe déjà. Le défi est de la rendre lisible par les machines : pages auteur structurées, schemas JSON-LD enrichis, FAQ sourcées, présence cohérente dans les annuaires professionnels.</p>

      <p><strong>Les 3 actions à lancer cette semaine :</strong></p>

      <ol>
        <li>Créez ou enrichissez votre page auteur avec diplomes, barreau ou ordre, et spécialisations. Ajoutez le schema Person correspondant.</li>
        <li>Publiez 5 FAQ structurées sur vos questions clients les plus fréquentes, avec sources et schema FAQPage.</li>
        <li>Vérifiez la cohérence de vos informations sur les 3 annuaires principaux de votre profession.</li>
      </ol>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour etre cité par les IA en 2026</ArrowLink>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA : guide pratique pour les LLM</ArrowLink>
    </>
  );
}
