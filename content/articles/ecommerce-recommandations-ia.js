import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
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

export default function EcommerceRecommandationsIa() {
  return (
    <>
      <p>"Quel est le meilleur matelas pour le mal de dos ?", "Quelle crème solaire bio pour enfant ?", "Quel logiciel de comptabilité pour une micro-entreprise ?", ces questions, des millions de consommateurs les posent désormais à ChatGPT, Gemini et Perplexity au lieu de Google.</p>

      <p>Et les réponses sont des recommandations directes : 3 à 5 produits cités par nom, avec des arguments pour chacun. Si votre boutique en ligne n'apparaît pas dans ces réponses, vous perdez des ventes auprès d'acheteurs qui ne visiteront jamais Google.</p>

      <p>Le pire : un visiteur référé par une IA convertit <strong>4,4 fois mieux</strong> qu'un visiteur organique classique. Il a déjà fait son choix dans la conversation. Il ne compare plus. Il achète. Chaque recommandation IA que vous manquez est une vente perdue au profit d'un concurrent.</p>

      <p>Ce guide vous montre comment optimiser votre site e-commerce pour que les IA recommandent vos produits.</p>

      <h2>Pourquoi l'e-commerce est particulièrement impacté</h2>

      <p>Le commerce en ligne est le secteur où le GEO a le plus d'impact immédiat, pour trois raisons.</p>

      <p><strong>Les requêtes d'achat migrent vers l'IA.</strong> En France, 52 % des consommateurs estiment que l'IA est plus efficace que les moteurs classiques pour préparer un achat, comparer des produits ou obtenir des recommandations personnalisées. La recherche produit est le cas d'usage n°1 de l'IA grand public.</p>

      <p><strong>Les IA donnent des réponses transactionnelles.</strong> Quand un utilisateur demande "quel est le meilleur aspirateur robot en 2026", ChatGPT ne répond pas avec une liste de liens. Il recommande 3-4 modèles spécifiques, avec les avantages de chacun, les fourchettes de prix et parfois un lien direct. C'est un acte de prescription, pas juste d'information.</p>

      <p><strong>La concurrence GEO en e-commerce est encore faible.</strong> La plupart des boutiques en ligne sont optimisées SEO mais pas GEO. Leurs fiches produits sont conçues pour Google Shopping, pas pour les LLM. C'est une fenêtre d'opportunité : les premiers à s'optimiser raflent les citations.</p>

      <h2>Ce que les IA cherchent dans une fiche produit</h2>

      <p>Les IA ne lisent pas vos fiches produits comme un humain. Elles cherchent des informations spécifiques qu'elles pourront extraire et reformuler dans leurs réponses. Voici ce qui compte.</p>

      <h3>Des caractéristiques factuelles et précises</h3>

      <p>Les IA adorent les faits vérifiables. Plus vos fiches produits contiennent de données objectives, plus elles seront citées.</p>

      <pre><code>{`❌ "Un aspirateur robot puissant et performant"

✅ "Aspirateur robot avec aspiration de 5000 Pa, autonomie de 180 minutes,
cartographie LiDAR, compatible Alexa et Google Home.
Réservoir de 400 ml. Niveau sonore : 65 dB."`}</code></pre>

      <p>Chaque caractéristique mesurable est un point d'accroche pour l'IA. Quand un utilisateur demande "aspirateur robot silencieux", l'IA cherchera les fiches qui mentionnent un niveau de dB précis.</p>

      <h3>Des comparaisons honnêtes</h3>

      <p>Les IA valorisent les contenus qui comparent objectivement. Si votre fiche produit mentionne les alternatives et explique pourquoi votre produit est adapté à tel usage (sans dénigrer la concurrence), elle sera perçue comme plus crédible.</p>

      <pre><code>{`❌ "Le meilleur aspirateur du marché, sans aucun doute"

✅ "Conçu pour les grandes surfaces (jusqu'à 200 m²).
Pour les petits appartements, un modèle plus compact peut suffire."`}</code></pre>

      <p>Ce positionnement honnête renforce la neutralité éditoriale, un des 7 critères GEO.</p>

      <h3>Des réponses aux questions d'achat</h3>

      <p>Les consommateurs posent des questions très spécifiques aux IA. Votre fiche produit doit y répondre directement :</p>

      <ul>
        <li>"Est-ce que [produit] convient pour [usage spécifique] ?"</li>
        <li>"Quelle est la différence entre [modèle A] et [modèle B] ?"</li>
        <li>"Est-ce que [produit] est compatible avec [appareil/situation] ?"</li>
        <li>"[Produit] vaut-il son prix ?"</li>
      </ul>

      <p>Intégrez ces questions et leurs réponses directement dans vos fiches, idéalement dans une section <InternalLink href="/blog/faq-schema-faqpage-combo-ia">FAQ balisée en <code>Schema FAQPage</code></InternalLink>.</p>

      <h2>Optimiser vos fiches produits pour les IA</h2>

      <h3>Étape 1 — Réécrire les descriptions avec des faits</h3>

      <p>Reprenez vos 20 produits les plus vendus. Pour chacun, assurez-vous que la description contient :</p>

      <ul>
        <li><strong>Un paragraphe d'ouverture extractible</strong> : une phrase qui résume le produit, son usage principal et sa caractéristique distinctive, dans les 100 premiers mots</li>
        <li><strong>Des spécifications précises</strong> : dimensions, poids, matériaux, capacités, compatibilités, certifications</li>
        <li><strong>Un positionnement clair</strong> : pour qui ce produit est-il idéal ? Dans quel contexte ?</li>
        <li><strong>Des données de performance</strong> : résultats de tests, durée de vie, garantie</li>
      </ul>

      <p>Exemple de paragraphe d'ouverture optimisé GEO :</p>

      <blockquote>
        "Le [Nom du produit] est un sérum visage à l'acide hyaluronique concentré à 2 %, formulé pour les peaux déshydratées et sensibles. Sans parfum, testé dermatologiquement, certifié bio par Ecocert. Flacon 30 ml, durée d'utilisation moyenne : 2 mois. Fabriqué en France."
      </blockquote>

      <p>Chaque information de cette phrase peut être extraite individuellement par une IA pour répondre à une question spécifique.</p>

      <h3>Étape 2 — Ajouter des FAQ produit</h3>

      <p>Chaque fiche produit devrait contenir 3 à 5 questions-réponses spécifiques au produit. Ce sont les questions que les acheteurs posent réellement, pas des questions génériques.</p>

      <p><strong>Pour un matelas :</strong></p>
      <ul>
        <li>"Ce matelas convient-il aux personnes qui dorment sur le côté ?" → réponse factuelle avec densité et type de mousse</li>
        <li>"Quelle est la différence entre le modèle Confort et le modèle Premium ?" → comparaison par critères</li>
        <li>"Le matelas contient-il des substances nocives ?" → certifications, normes</li>
      </ul>

      <p><strong>Pour un logiciel SaaS :</strong></p>
      <ul>
        <li>"Peut-on importer des données depuis Excel ?" → oui/non + formats supportés</li>
        <li>"Combien d'utilisateurs sont inclus dans le plan Pro ?" → chiffre précis</li>
        <li>"Y a-t-il un engagement minimum ?" → conditions claires</li>
      </ul>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Balisez ces FAQ en Schema FAQPage, consultez notre guide Schema.org.</ArrowLink>

      <h3>Étape 3 — Implémenter les données structurées Product</h3>

      <p>Le schema <code>Product</code> est le plus important pour l'e-commerce. Il permet aux IA de comprendre instantanément ce que vous vendez. Pour un guide complet d'implémentation, consultez notre article sur <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA</InternalLink>.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Sérum Acide Hyaluronique Bio 30ml",
  "description": "Sérum visage à l'acide hyaluronique concentré à 2 %, pour peaux déshydratées et sensibles. Sans parfum, certifié Ecocert.",
  "brand": {
    "@type": "Brand",
    "name": "Votre Marque"
  },
  "sku": "SER-AH-30",
  "offers": {
    "@type": "Offer",
    "price": "24.90",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://www.votre-site.fr/serum-acide-hyaluronique"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "312"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Marie L." },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "Peau visiblement plus hydratée après 2 semaines. Texture légère, pénètre vite."
    }
  ]
}`}</code></pre>

      <p><strong>Points clés :</strong></p>

      <ul>
        <li><code>aggregateRating</code> avec un <code>reviewCount</code> élevé est un signal de confiance majeur pour les IA</li>
        <li>Le <code>price</code> et la <code>availability</code> permettent aux IA de citer des prix précis dans leurs recommandations</li>
        <li>Les <code>review</code> avec des détails concrets (durée d'utilisation, résultats) sont plus souvent extraites que les avis vagues</li>
      </ul>

      <h3>Étape 4 — Créer des pages de catégorie riches en contenu</h3>

      <p>Les fiches produits ne suffisent pas. Les IA cherchent aussi des contenus de type guide d'achat pour structurer leurs recommandations.</p>

      <p>Créez une page de catégorie qui contient :</p>

      <ul>
        <li><strong>Un guide d'achat en introduction</strong> : "Comment choisir son [type de produit] : les 5 critères importants"</li>
        <li><strong>Un comparatif de vos produits par critères objectifs</strong> (tableau)</li>
        <li><strong>Des recommandations par profil</strong> : "Si vous cherchez [X], optez pour [produit A]. Si votre priorité est [Y], [produit B] sera plus adapté."</li>
      </ul>

      <p>Ce contenu est exactement ce que les IA recherchent quand un utilisateur demande "quel [produit] choisir".</p>

      <h3>Étape 5 — Enrichir avec des avis clients structurés</h3>

      <p>Les <InternalLink href="/blog/avis-clients-temoignages-visibilite-ia">avis clients</InternalLink> sont un signal de crédibilité pour les IA. Mais tous les avis n'ont pas la même valeur.</p>

      <p><strong>Avis utiles pour le GEO (souvent extraits par les IA) :</strong></p>
      <ul>
        <li>"J'utilise ce produit depuis 3 mois pour [usage]. Résultat : [résultat concret]."</li>
        <li>"Comparé à [concurrent], ce produit est [différence factuelle]."</li>
        <li>"Point fort : [X]. Point faible : [Y]. Au final, [conclusion]."</li>
      </ul>

      <p><strong>Avis peu utiles pour le GEO :</strong></p>
      <ul>
        <li>"Super produit !!!"</li>
        <li>"5 étoiles, je recommande"</li>
        <li>"Très bien"</li>
      </ul>

      <p>Si vous collectez des avis, orientez vos questions pour obtenir des retours détaillés : "Depuis combien de temps utilisez-vous ce produit ?", "Pour quel usage ?", "Quel résultat avez-vous constaté ?"</p>

      <h2>Les pages complémentaires à créer</h2>

      <p>Au-delà des fiches produits, certaines pages de contenu boostent significativement votre visibilité GEO en e-commerce.</p>

      <h3>Guides d'achat thématiques</h3>

      <p>"Comment choisir son [catégorie de produit] en 2026 : guide complet", ces articles ciblent les requêtes informationnelles pré-achat, exactement celles que les utilisateurs posent aux IA. Structure recommandée :</p>

      <ol>
        <li>Introduction avec les critères de choix importants</li>
        <li>Explication de chaque critère avec des seuils concrets</li>
        <li>Tableau comparatif de vos produits sur ces critères</li>
        <li>Recommandation par profil d'acheteur</li>
        <li>FAQ avec les questions d'achat les plus fréquentes</li>
      </ol>

      <h3>Pages "Alternative à [concurrent]"</h3>

      <p>Quand un utilisateur demande à ChatGPT "alternative à [marque connue]", l'IA cherche des pages qui se positionnent explicitement comme alternatives. Créez des pages qui comparent objectivement votre offre à celle de vos concurrents connus.</p>

      <p><strong>Attention :</strong> restez factuel. Les IA ignorent les comparaisons biaisées. Mentionnez les points forts de vos concurrents aussi. Et expliquez dans quels cas votre produit est le meilleur choix.</p>

      <h3>Pages de cas d'usage</h3>

      <p>"[Votre produit] pour [usage spécifique]", ces pages ciblent les requêtes de type "[produit] pour [besoin]" qui sont très fréquentes dans les conversations IA.</p>

      <p>Exemples : "Nos sacs à dos pour le voyage en avion (bagage cabine)", "Nos chaussures de running pour pronateurs", "Notre CRM pour les agences immobilières".</p>

      <h2>Erreurs fréquentes en e-commerce</h2>

      <h3>Erreur 1 : des fiches produits 100 % visuelles</h3>

      <p>De belles photos ne suffisent pas pour le GEO. Les IA ne "voient" pas vos images. Elles lisent votre texte. Une fiche avec 10 photos et 2 lignes de description est invisible pour les LLM.</p>

      <p><strong>Solution :</strong> chaque fiche doit contenir au minimum 200 mots de description textuelle factuelle, en plus des visuels.</p>

      <h3>Erreur 2 : des descriptions générées en masse sans valeur ajoutée</h3>

      <p>Les descriptions produits génériques ("Ce t-shirt en coton est confortable et élégant") n'apportent aucune information distinctive. Les IA les ignorent car elles ne contiennent rien d'extractible ou de vérifiable.</p>

      <p><strong>Solution :</strong> chaque description doit contenir des informations uniques que l'IA ne trouvera pas ailleurs. Vos propres tests, vos comparaisons, vos recommandations d'usage.</p>

      <h3>Erreur 3 : bloquer les bots IA sur les pages produits</h3>

      <p>Certains sites e-commerce bloquent tous les bots non-Google par peur du scraping de prix. Résultat : ChatGPT et Perplexity ne peuvent pas accéder à vos fiches et recommandent vos concurrents.</p>

      <p><strong>Solution :</strong> autorisez GPTBot, ClaudeBot et PerplexityBot dans votre <code>robots.txt</code>. Le risque de scraping est faible comparé au coût de l'invisibilité.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Configuration dans llms.txt, robots.txt et accessibilité IA.</ArrowLink>

      <h3>Erreur 4 : pas d'avis clients ou des avis non structurés</h3>

      <p>Sans avis balisés en Schema <code>Review</code>/<code>AggregateRating</code>, les IA n'ont aucun signal social pour évaluer votre produit. Un concurrent avec 312 avis à 4.7/5 sera cité avant vous, même si votre produit est meilleur.</p>

      <p><strong>Solution :</strong> collectez activement des avis, balisez-les en données structurées, et orientez vos clients vers des retours détaillés.</p>

      <h3>Erreur 5 : ignorer les requêtes comparatives</h3>

      <p>"[Produit A] vs [Produit B]", "meilleur [catégorie] rapport qualité-prix", "alternative à [marque]", ces requêtes représentent une part importante des conversations IA liées à l'achat. Si vous n'avez pas de contenu qui y répond, vous n'apparaîtrez pas dans ces réponses.</p>

      <p><strong>Solution :</strong> créez des comparatifs honnêtes et des guides d'achat par critère.</p>

      <h2>Plan d'action e-commerce en 2 semaines</h2>

      <h3>Semaine 1 — Les fondamentaux</h3>

      <ol>
        <li><strong>Jour 1-2 :</strong> réécrire les descriptions de vos 20 produits les plus vendus (paragraphes d'ouverture extractibles, spécifications précises)</li>
        <li><strong>Jour 3 :</strong> ajouter Schema <code>Product</code> + <code>AggregateRating</code> sur ces 20 fiches</li>
        <li><strong>Jour 4 :</strong> ajouter 3-5 FAQ par fiche produit, balisées en <code>FAQPage</code></li>
        <li><strong>Jour 5 :</strong> vérifier <code>robots.txt</code> (débloquer les bots IA) + lancer un audit Detekia</li>
      </ol>

      <h3>Semaine 2 — Le contenu</h3>

      <ol>
        <li><strong>Jour 6-7 :</strong> créer 2 guides d'achat thématiques pour vos catégories principales</li>
        <li><strong>Jour 8-9 :</strong> créer 1 page comparative (votre produit vs alternative connue)</li>
        <li><strong>Jour 10 :</strong> relancer l'audit Detekia et mesurer la progression</li>
      </ol>

      <h2>Questions fréquentes</h2>

      <h3>Les IA recommandent-elles des produits de petites boutiques ?</h3>

      <p>Oui. Les IA ne favorisent pas Amazon ou les grandes enseignes par défaut. Elles citent les sources les plus pertinentes et les mieux structurées. Une boutique spécialisée avec des fiches produits expertes et bien balisées peut être citée devant un géant du e-commerce avec des descriptions génériques.</p>

      <h3>Les prix affichés dans les données structurées apparaissent-ils dans les réponses IA ?</h3>

      <p>Souvent, oui. Quand une IA recommande un produit, elle mentionne fréquemment le prix si celui-ci est disponible dans les données structurées. C'est un argument de plus pour implémenter le schema <code>Offer</code> avec un prix précis.</p>

      <h3>Faut-il optimiser chaque fiche produit ou seulement les best-sellers ?</h3>

      <p>Commencez par vos 20-30 produits les plus vendus ou les plus recherchés. L'effort est trop important pour optimiser des centaines de fiches d'un coup. Élargissez ensuite progressivement. Chaque fiche optimisée améliore aussi le signal global de votre site.</p>

      <h3>Les marketplaces (Amazon, Cdiscount) sont-elles mieux citées que les sites propres ?</h3>

      <p>Pas nécessairement. Les IA citent les sources les plus informatives. Les fiches Amazon sont souvent standardisées et peu détaillées. Un site spécialisé avec des guides d'achat, des comparatifs et des avis détaillés a un avantage éditorial que les marketplaces n'ont pas.</p>

      <h2>Mesurez votre visibilité e-commerce</h2>

      <p>Votre boutique en ligne est-elle citée quand un client demande à ChatGPT une recommandation dans votre secteur ? Faites le test.</p>

      <p>Analysez votre site sur Detekia, score sur 100, 7 critères GEO, recommandations priorisées. En moins de 60 secondes, sans inscription.</p>
      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour être cité par les IA en 2026</ArrowLink>
      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : quelles différences en 2026 ?</ArrowLink>
      <InlineCTA href="/">Votre site est-il visible pour les IA ? Testez gratuitement.</InlineCTA>
    </>
  );
}
