import Link from 'next/link';

function InternalLink({ href, children }) {
  return (
    <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}
      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
    >{children}</Link>
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

export default function EeatIaExperienceExpertise() {
  return (
    <>
      <p>Il y a encore un an, E-E-A-T semblait n'intéresser que les experts SEO. Experience, Expertise, Authoritativeness, Trustworthiness — quatre piliers définis par Google dans ses Search Quality Rater Guidelines pour évaluer la crédibilité d'un contenu. Un cadre conçu pour les humains qui notent manuellement les résultats de recherche.</p>

      <p>Puis les moteurs IA sont devenus des canaux d'acquisition à part entière. Et une convergence inattendue est apparue : <strong>les preuves que Google exige via E-E-A-T sont exactement celles que ChatGPT, Perplexity et Gemini utilisent pour décider quelles sources citer.</strong></p>

      <p>Ce n'est pas un hasard. C'est une conséquence mécanique de la manière dont les IA retrieval-augmented sélectionnent leurs sources. Et c'est une opportunité considérable pour les sites qui le comprennent.</p>

      <h2>E-E-A-T : un cadre Google, mais pas seulement</h2>

      <p>Le framework E-E-A-T a été formalisé par Google en décembre 2022, quand le premier "E" (Experience) a été ajouté à l'ancien E-A-T. Les Search Quality Rater Guidelines, un document de 176 pages mis à jour régulièrement, décrivent comment les évaluateurs humains doivent juger la qualité d'une page.</p>

      <p>Ce que beaucoup ignorent, c'est que ces mêmes signaux sont devenus des critères de facto pour les moteurs IA. L'étude de référence de Princeton sur le GEO (Aggarwal et al., KDD 2024) a démontré que l'ajout de <strong>marqueurs d'autorité</strong> — citations, credentials, sources vérifiables — augmente les citations IA de 30 à 40 %. Ces marqueurs sont exactement ceux que le cadre E-E-A-T prescrit.</p>

      <p>La raison est simple. Les systèmes RAG (Retrieval-Augmented Generation) de ChatGPT, Perplexity et Gemini s'appuient sur des moteurs de recherche sous-jacents (Bing, Google, index propriétaires). Ces moteurs utilisent déjà les signaux E-E-A-T pour classer les résultats. Les IA héritent donc mécaniquement de ces préférences quand elles sélectionnent les sources à citer.</p>

      <h2>Les 4 piliers E-E-A-T décortiqués pour les IA</h2>

      <h3>Experience — "Avez-vous réellement fait ce dont vous parlez ?"</h3>

      <p>Google définit l'Experience comme la preuve que l'auteur a une expérience directe du sujet. Un avis produit écrit par quelqu'un qui a utilisé le produit. Un guide médical rédigé par un praticien. Un tutoriel technique écrit par quelqu'un qui a implémenté la solution.</p>

      <p>Pour les IA, ce signal se traduit par la présence de <strong>données propriétaires, cas concrets et résultats chiffrés</strong>. Un article qui écrit "les sites avec schema FAQPage obtiennent plus de citations" est moins citable qu'un article qui écrit "sur les 200 sites que nous avons audités, ceux avec schema FAQPage obtiennent 2,4x plus de citations IA (source : AirOps, 2026)". Le second est extractible et vérifiable — exactement ce que le RAG recherche.</p>

      <h3>Expertise — "Êtes-vous qualifié pour en parler ?"</h3>

      <p>L'Expertise se prouve par les credentials de l'auteur. Google cherche des pages auteur avec biographie, certifications, publications. Les Quality Raters vérifient si l'auteur a une expertise documentée dans le domaine.</p>

      <p>Les IA utilisent ce signal de deux manières. D'abord, les schemas JSON-LD <code>Person</code> et <code>Organization</code> fournissent aux systèmes de retrieval une structure vérifiable — nom, rôle, affiliation. Ensuite, les mentions de l'auteur ou de l'organisation dans d'autres sources (presse, publications académiques, forums spécialisés) renforcent la confiance du modèle. Pour un guide d'implémentation technique, consultez notre article sur <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org pour les IA</InternalLink>.</p>

      <h3>Authoritativeness — "Êtes-vous reconnu par les pairs ?"</h3>

      <p>L'Authoritativeness est le pilier le plus directement corrélé avec la citabilité IA. Google mesure l'autorité par les backlinks, les mentions dans des sources tierces, la présence dans des bases de référence (Wikidata, Knowledge Graph).</p>

      <p>Pour les IA, l'autorité se manifeste par la <strong>triangulation</strong> : quand plusieurs sources indépendantes mentionnent votre site comme référence sur un sujet, les modèles RAG identifient un signal fort. Otterly.AI a documenté en 2026 que 78 % des sources citées par ChatGPT et Perplexity ont un Domain Rating supérieur à 60. L'autorité de domaine n'est pas un critère direct des LLM, mais elle filtre mécaniquement via les moteurs de recherche dont ils dépendent. Pour aller plus loin : <InternalLink href="/blog/backlinks-geo-autorite-domaine-ia">Backlinks et GEO : l'autorité de domaine pour les IA</InternalLink>.</p>

      <h3>Trustworthiness — "Puis-je vous faire confiance ?"</h3>

      <p>La Trustworthiness est le pilier chapeau — celui que Google place au centre de sa pyramide E-E-A-T. Il englobe la transparence (mentions légales, politique de confidentialité, informations de contact), la sécurité technique (HTTPS, absence de contenu trompeur), et la fiabilité factuelle (sources citées, données datées, corrections publiées).</p>

      <p>Pour les IA, la Trustworthiness se traduit par des signaux vérifiables programmatiquement : certificat SSL, pages légales accessibles, dates de publication et de modification dans les métadonnées, sources externes citées dans le contenu. Un site sans date de publication, sans auteur identifié et sans source externe est un signal faible pour le RAG — il sera écarté au profit d'une source plus transparente.</p>

      <h2>Pourquoi Google et les LLM convergent sur les mêmes preuves</h2>

      <p>Cette convergence n'est pas philosophique. Elle est technique.</p>

      <p>Les moteurs IA qui citent des sources (ChatGPT avec Browse, Perplexity, Gemini dans les AI Overviews) fonctionnent tous sur un modèle RAG. Le processus est identique : une requête utilisateur est transformée en sous-requêtes de recherche, un moteur de recherche retourne des résultats classés, le LLM synthétise et cite les sources les plus pertinentes.</p>

      <p>Or, les moteurs de recherche sous-jacents — Bing pour ChatGPT, Google pour Gemini, un index hybride pour Perplexity — utilisent tous des signaux de qualité qui recoupent le cadre E-E-A-T. Les résultats qui remontent au LLM sont donc déjà pré-filtrés par ces critères. Le LLM ajoute ensuite sa propre couche de sélection, qui favorise les contenus extractibles, sourcés et structurés — autrement dit, les contenus qui montrent des preuves E-E-A-T.</p>

      <p>Le résultat : un site qui travaille son E-E-A-T pour Google améliore mécaniquement sa citabilité IA. Et inversement. C'est le même investissement pour deux canaux de visibilité. Pour comprendre comment ce score est calculé, consultez le <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">guide complet du score GEO</InternalLink>.</p>

      <InlineCTA href="/">
        Votre site envoie-t-il les bons signaux E-E-A-T aux IA ? Testez votre score GEO en 30 secondes.
      </InlineCTA>

      <h2>Checklist : 10 preuves E-E-A-T à ajouter sur votre site</h2>

      <p>Voici les actions concrètes, classées par impact sur la citabilité IA. Chacune renforce simultanément votre SEO Google et votre visibilité IA.</p>

      <ol>
        <li><strong>Auteur nommé sur chaque contenu.</strong> Nom complet, pas de "admin" ou "équipe". Lien vers une page auteur dédiée avec bio, photo, credentials et liens professionnels vérifiables (LinkedIn, publications).</li>
        <li><strong>Schema JSON-LD Person sur les pages auteur.</strong> Incluez <code>name</code>, <code>jobTitle</code>, <code>worksFor</code>, <code>sameAs</code> (liens LinkedIn, Twitter). Les IA parsent ces données structurées pour valider l'expertise.</li>
        <li><strong>Schema JSON-LD Organization sur la homepage.</strong> <code>name</code>, <code>url</code>, <code>logo</code>, <code>foundingDate</code>, <code>founder</code>. C'est le socle d'identité que les IA vérifient en premier.</li>
        <li><strong>Date de publication ET de modification visibles.</strong> Dans le HTML et dans les métadonnées (<code>datePublished</code>, <code>dateModified</code> en JSON-LD). Les IA favorisent les contenus datés et récents.</li>
        <li><strong>Sources externes citées dans le corps du texte.</strong> Liens vers des études, rapports, publications de référence. Un contenu sans source externe est un signal faible pour les IA — il ne peut pas être triangulé.</li>
        <li><strong>Mentions presse et logos partenaires.</strong> Section "Ils parlent de nous" ou "Nos partenaires" avec liens vérifiables. Les IA détectent ces signaux d'autorité dans le HTML.</li>
        <li><strong>Pages de confiance complètes.</strong> Mentions légales, politique de confidentialité, conditions d'utilisation, page contact avec adresse physique. Chaque page manquante est un point de Trustworthiness perdu.</li>
        <li><strong>HTTPS strict + en-têtes de sécurité.</strong> Certificat SSL valide, HSTS, X-Content-Type-Options. Socle technique non négociable — Google et les IA pénalisent les sites non sécurisés.</li>
        <li><strong>Avis et témoignages clients avec schema Review.</strong> Des preuves d'expérience terrain, pas des citations génériques. Le markup <code>Review</code> permet aux IA d'extraire ces témoignages.</li>
        <li><strong>Contenu actualisé régulièrement.</strong> Mettez à jour les articles anciens avec des données fraîches et des <code>dateModified</code> à jour. Les IA dévalorisent les contenus obsolètes — un article de 2023 non mis à jour est invisible en 2026.</li>
      </ol>

      <h2>Cas pratique : avant/après sur une page service</h2>

      <h3>Avant (score E-E-A-T faible)</h3>

      <p>Prenons une page service typique d'une agence web :</p>

      <ul>
        <li>Auteur : "L'équipe" (pas de nom)</li>
        <li>Pas de date de publication</li>
        <li>Aucune source externe citée</li>
        <li>Pas de schema JSON-LD</li>
        <li>Pas de page auteur</li>
        <li>Mentions légales minimales sans adresse</li>
      </ul>

      <p>Résultat : Google classe la page en bas de page 2. Les IA ne la citent jamais — aucun signal vérifiable pour le RAG.</p>

      <h3>Après (signaux E-E-A-T ajoutés)</h3>

      <ul>
        <li>Auteur : "Marie Dupont, Directrice technique — 12 ans d'expérience en développement web" avec lien vers sa page auteur</li>
        <li>Page auteur avec schema Person, bio détaillée, certifications listées, lien LinkedIn</li>
        <li>Date de publication : 15 mars 2026 — Mis à jour : 2 mai 2026</li>
        <li>3 sources externes citées (études, rapports sectoriels)</li>
        <li>Schema Organization sur la homepage avec fondateur, date de création, logo</li>
        <li>Section "Ils parlent de nous" avec 3 mentions presse liées</li>
        <li>Pages légales complètes avec adresse physique et numéro SIRET</li>
      </ul>

      <p>Résultat : la page remonte en page 1 Google. Perplexity commence à la citer dans les réponses liées à son secteur. ChatGPT la mentionne quand on demande des prestataires dans son domaine.</p>

      <p>L'investissement : environ 2 heures de travail. L'impact : durable sur les deux canaux.</p>

      <h2>Conclusion : un investissement, deux canaux</h2>

      <p>E-E-A-T n'est plus seulement un concept SEO. C'est devenu le langage commun de la crédibilité en ligne — celui que Google utilise pour classer, et celui que les IA utilisent pour citer.</p>

      <p>Les 10 preuves listées ci-dessus ne sont pas des optimisations théoriques. Ce sont des signaux concrets, mesurables, que les systèmes RAG vérifient programmatiquement avant de décider si votre site mérite d'être cité.</p>

      <p>La bonne nouvelle : chaque amélioration E-E-A-T profite simultanément à votre positionnement Google et à votre visibilité IA. C'est le rare cas où un seul investissement produit un retour sur deux fronts.</p>

      <p><strong>Les 3 actions à lancer cette semaine :</strong></p>

      <ol>
        <li>Ajoutez un auteur nommé avec page dédiée et schema Person sur vos 5 contenus les plus visités</li>
        <li>Implémentez le schema Organization sur votre homepage</li>
        <li>Mesurez votre point de départ avec un <InternalLink href="/">scoring GEO gratuit</InternalLink> — vous saurez exactement quels signaux E-E-A-T manquent</li>
      </ol>
    </>
  );
}
