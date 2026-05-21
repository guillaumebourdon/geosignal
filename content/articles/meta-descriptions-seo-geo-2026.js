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
        Tester mon site gratuitement →
      </a>
    </div>
  );
}

export default function MetaDescriptionsSeoGeo2026() {
  return (
    <>
      <p>En 2026, votre meta description ne sert plus seulement à convaincre un internaute de cliquer dans Google. Elle sert aussi à convaincre une IA de vous citer. ChatGPT, Perplexity et Gemini utilisent la meta description comme résumé prioritaire quand ils analysent votre page. Si elle est vague, promotionnelle ou absente, l'IA passe à la source suivante.</p>

      <p>Le problème : la plupart des meta descriptions sont encore écrites pour le SEO de 2020. Elles poussent au clic avec des formules marketing, mais ne contiennent aucune information citable. Résultat : elles performent de moins en moins dans Google (à cause des AI Overviews qui absorbent les clics) et sont ignorées par les moteurs IA.</p>

      <p>Ce guide vous montre comment écrire des meta descriptions qui gagnent sur les deux fronts : CTR dans Google ET citabilité dans les réponses IA.</p>

      <h2>Pourquoi les meta descriptions comptent 2x plus en 2026</h2>

      <h3>Le double rôle : CTR Google + citation IA</h3>

      <p>Historiquement, la meta description avait un seul objectif : augmenter le taux de clic (CTR) dans les résultats de recherche Google. En 2026, elle a un second rôle tout aussi important : servir d'extrait citable pour les moteurs de réponse IA.</p>

      <p>Quand ChatGPT Search, Perplexity ou Google Gemini analysent votre page, ils lisent en priorité trois éléments : le titre, la meta description, et les 300 premiers caractères du contenu visible. La meta description est souvent le premier passage qu'ils extraient pour résumer votre page dans leur réponse.</p>

      <p>Les chiffres le confirment : <strong>44,2 % des citations IA proviennent des 30 premiers % du texte d'une page</strong> (Growth Memo, 2026). La meta description, positionnée tout en haut du DOM, fait partie de cette zone critique.</p>

      <h3>Le contexte qui change tout</h3>

      <p>Sur les requêtes qui déclenchent un AI Overview dans Google, le <strong>taux de clic organique a chuté de 61 %</strong> (Seer Interactive, 2025). Les internautes lisent le résumé IA et passent à autre chose. Si votre meta description n'est pas assez informative pour être intégrée dans ce résumé, vous perdez à la fois le clic et la visibilité.</p>

      <p>En parallèle, <strong>80 % des URLs citées par ChatGPT ne sont pas dans le top 100 Google</strong> (Ahrefs, 2025). Cela signifie que même un site modeste en SEO classique peut être cité par les IA — à condition que son contenu (et sa meta description) soit structuré pour être extrait.</p>

      <ArrowLink href="/blog/pourquoi-trafic-google-baisse-2026">Pourquoi votre trafic Google baisse en 2026 (et ce que les IA ont à voir là-dedans)</ArrowLink>

      <h2>Les règles SEO qui restent vraies</h2>

      <p>Avant d'ajouter la couche GEO, rappelons les fondamentaux SEO de la meta description. Ils ne sont pas obsolètes — ils sont nécessaires mais plus suffisants.</p>

      <h3>Longueur optimale</h3>

      <p>Google affiche environ <strong>155-160 caractères</strong> sur desktop et <strong>120 caractères</strong> sur mobile. Au-delà, le texte est tronqué. En dessous de 70 caractères, vous gaspillez de l'espace précieux. Visez 130-155 caractères pour couvrir les deux formats.</p>

      <h3>Mot-clé principal en début</h3>

      <p>Google met en gras les termes qui correspondent à la requête de l'utilisateur. Placer votre mot-clé principal dans les 60 premiers caractères maximise la visibilité du "gras" et le signal de pertinence.</p>

      <h3>Promesse claire + incitation à l'action</h3>

      <p>La meta description est un pitch de vente en 155 caractères. Elle doit répondre à la question implicite de l'utilisateur : "Pourquoi devrais-je cliquer sur CE résultat ?"</p>

      <h3>Unicité page par page</h3>

      <p>Chaque page doit avoir une meta description unique. Les duplications sont ignorées par Google (il génère son propre extrait à la place) et créent de la confusion pour les IA qui crawlent votre site.</p>

      <h3>Ce qu'il faut éviter</h3>

      <ul>
        <li>Les listes de mots-clés sans phrase ("SEO, GEO, visibilité, IA, optimisation")</li>
        <li>Les meta vides (Google génère un extrait automatique souvent médiocre)</li>
        <li>Les emojis excessifs (1 emoji passe, 5 emojis font spam)</li>
        <li>Les guillemets doubles (ils tronquent la meta dans le HTML)</li>
      </ul>

      <h2>Les nouvelles règles GEO</h2>

      <p>C'est ici que 2026 change la donne. Les moteurs IA n'évaluent pas une meta description comme Google. Ils cherchent des informations extractibles, vérifiables et autonomes. Voici les 5 critères GEO d'une meta description optimale.</p>

      <h3>1. Extractibilité : structure sujet-verbe-complément claire</h3>

      <p>Les IA extraient des passages complets. Une meta description bien structurée grammaticalement sera reprise telle quelle. Une succession de fragments ne le sera pas.</p>

      <pre><code>{`❌ "Votre partenaire digital. Solutions innovantes. Depuis 2005."

✅ "Detekia analyse votre site sur 8 critères GEO et génère un score de citabilité IA sur 100 en moins de 60 secondes."`}</code></pre>

      <p>La deuxième version est une phrase complète que l'IA peut intégrer directement dans sa réponse.</p>

      <h3>2. Factualité : données chiffrées, pas de superlatifs vagues</h3>

      <p>Les IA favorisent les contenus vérifiables. Une meta description qui contient des chiffres concrets a <strong>2,8x plus de chances d'être citée</strong> qu'une meta sans donnée vérifiable (AirOps, 2026).</p>

      <pre><code>{`❌ "Le meilleur outil du marché pour votre visibilité en ligne."

✅ "Analysez votre site sur 8 critères GEO validés par Princeton/KDD 2024. Score sur 100 en moins de 60 secondes, gratuit."`}</code></pre>

      <h3>3. Entity-richness : nommer les entités</h3>

      <p>Les IA comprennent mieux votre page quand la meta description nomme explicitement les entités clés : nom de marque, lieu, produit, technologie, chiffre clé.</p>

      <pre><code>{`❌ "Découvrez nos solutions pour améliorer votre présence en ligne."

✅ "Detekia mesure la visibilité de votre site dans ChatGPT, Gemini et Perplexity via 8 critères GEO (Princeton/KDD 2024)."`}</code></pre>

      <h3>4. Citation-worthiness : peut-elle servir de réponse autonome ?</h3>

      <p>Le test ultime : si quelqu'un copiait votre meta description et la collait comme réponse à une question, est-ce que ça aurait du sens ? Si oui, elle est citable. Si non, elle est juste un teaser marketing.</p>

      <h3>5. Indépendance contextuelle : compréhensible hors de la page</h3>

      <p>Les IA extraient votre meta description sans voir le reste de la page. Elle doit être autonome : pas de "Découvrez ici...", pas de "En savoir plus sur...", pas de référence à un élément visuel.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour être cité par les IA en 2026</ArrowLink>

      <h2>La formule FACTS : le framework hybride gagnant</h2>

      <p>Pour combiner SEO et GEO en une seule meta description, utilisez la formule <strong>FACTS</strong> :</p>

      <ul>
        <li><strong>F</strong>actuel : au moins 1 donnée chiffrée ou fait vérifiable</li>
        <li><strong>A</strong>ctionnable : l'utilisateur sait ce qu'il va obtenir (guide, outil, comparatif...)</li>
        <li><strong>C</strong>itable : la phrase peut être extraite et utilisée comme réponse autonome</li>
        <li><strong>T</strong>arget : le mot-clé principal est dans les 60 premiers caractères</li>
        <li><strong>S</strong>pécifique : noms d'entités, chiffres, dates — pas de généralités</li>
      </ul>

      <p><strong>Exemple appliqué — boutique de café en ligne :</strong></p>

      <pre><code>{`Avant (SEO only) : "Découvrez notre sélection de cafés de spécialité. Livraison rapide, prix imbattables. Commandez maintenant !"

Après (FACTS) : "Café de spécialité : 12 origines mono-plantation notées 85+ SCA, torréfiés à Bordeaux. Livraison 48h, 4.8/5 sur 1 200 avis Trustpilot."`}</code></pre>

      <p><strong>Exemple appliqué — SaaS B2B :</strong></p>

      <pre><code>{`Avant : "La solution CRM la plus complète pour votre entreprise. Essai gratuit."

Après : "CRM pour PME : gestion contacts, pipeline et factures en 1 outil. 4 500 entreprises, intégration Stripe et Gmail. Essai 14 jours gratuit."`}</code></pre>

      <p><strong>Exemple appliqué — agence immobilière :</strong></p>

      <pre><code>{`Avant : "Votre projet immobilier commence ici. Experts passionnés à votre service."

Après : "Agence immobilière Paris 11e : 320 biens vendus en 2025, délai moyen 45 jours. Estimation gratuite en ligne, 4.9/5 Google."`}</code></pre>

      <h2>5 exemples avant/après par secteur</h2>

      <div style={{ overflowX: 'auto', margin: '24px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#1A1916' }}>
              {['Secteur', 'Avant (SEO only)', 'Après (SEO + GEO)'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#F7F5F2', fontWeight: 600, fontFamily: 'monospace', fontSize: 11, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['E-commerce', 'Les meilleurs produits au meilleur prix. Livraison offerte dès 50 EUR.', 'Café de spécialité : 12 origines mono-plantation notées 85+ SCA, torréfiés à Bordeaux. 4.8/5 sur 1 200 avis.'],
              ['SaaS B2B', 'La solution tout-en-un pour votre entreprise. Essai gratuit !', 'CRM pour PME : contacts, pipeline, factures. 4 500 entreprises, intégration Stripe/Gmail. Essai 14j gratuit.'],
              ['Media / Blog', 'Toute l\'actualité tech et marketing. Restez informé.', 'Guide SEO vs GEO 2026 : comparatif en 12 critères, stratégie 3 couches, et plan d\'action en 5 étapes (Princeton/KDD).'],
              ['Service local', 'Votre expert de confiance depuis 20 ans. Contactez-nous !', 'Plombier Paris 15e : intervention en 2h, devis gratuit, 4.9/5 Google (890 avis). Urgences 24h/24.'],
              ['Marketplace', 'Des milliers de vendeurs vous attendent. Inscrivez-vous !', 'Marketplace freelances tech : 8 000 profils vérifiés, délai moyen 48h, satisfaction 94%. Publiez un projet gratuitement.'],
            ].map(([sector, before, after], i) => (
              <tr key={sector} style={{ background: i % 2 === 0 ? '#fff' : '#F7F5F2', borderBottom: '1px solid #E5E2DC' }}>
                <td style={{ padding: '11px 16px', fontWeight: 600, color: '#1A1916' }}>{sector}</td>
                <td style={{ padding: '11px 16px', color: '#D97757' }}>{before}</td>
                <td style={{ padding: '11px 16px', color: '#10A37F' }}>{after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>Remarquez le pattern : chaque version "après" contient au moins 2 chiffres, 1 nom d'entité, et forme une phrase autonome citable.</p>

      <InlineCTA href="/">Votre meta description est-elle citable par les IA ? Vérifiez votre score GEO en moins de 60 secondes.</InlineCTA>

      <h2>Checklist opérationnelle : 12 points à vérifier</h2>

      <p>Avant de publier ou mettre à jour une meta description en 2026, passez-la au crible de cette checklist :</p>

      <ol>
        <li><strong>Longueur entre 130 et 155 caractères</strong> — couvre desktop et mobile</li>
        <li><strong>Mot-clé principal dans les 60 premiers caractères</strong> — signal SEO fort</li>
        <li><strong>Au moins 1 donnée chiffrée</strong> (pourcentage, volume, note, date) — critère de vérifiabilité GEO</li>
        <li><strong>Au moins 1 entité nommée</strong> (marque, lieu, produit, technologie) — entity-richness</li>
        <li><strong>Phrase complète sujet-verbe-complément</strong> — extractibilité IA</li>
        <li><strong>Compréhensible sans contexte</strong> — indépendance contextuelle</li>
        <li><strong>Pas de superlatifs non prouvés</strong> ("le meilleur", "leader") — neutralité éditoriale</li>
        <li><strong>Unique pour cette page</strong> — pas de duplication</li>
        <li><strong>Pas de guillemets doubles</strong> — ils tronquent dans le HTML</li>
        <li><strong>Cohérente avec le contenu réel de la page</strong> — sinon Google la remplace</li>
        <li><strong>Contient une promesse ou un bénéfice clair</strong> — CTR SEO</li>
        <li><strong>Passe le "test de citation"</strong> : collée comme réponse à une question, elle a du sens</li>
      </ol>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">Score GEO : comment mesurer la visibilité IA de votre site</ArrowLink>

      <h2>Comment mesurer l'impact de vos meta descriptions</h2>

      <h3>Côté SEO : Google Search Console</h3>

      <p>Suivez le CTR par page dans Google Search Console. Après avoir réécrit vos meta descriptions, comparez le CTR sur 4 semaines glissantes. Un gain de 1 à 3 points de CTR est typique sur les pages où la meta était générique.</p>

      <h3>Côté GEO : test de citation + audit Detekia</h3>

      <p>Pour mesurer la citabilité de vos meta descriptions par les IA :</p>

      <ul>
        <li><strong>Test manuel</strong> : posez à ChatGPT ou Perplexity une question liée à votre page. Votre site est-il cité ? L'extrait utilisé provient-il de votre meta description ?</li>
        <li><strong>Audit automatisé</strong> : Detekia mesure l'extractibilité de votre contenu sur 8 critères GEO. Le score d'extractibilité (25 points sur 100) inclut l'évaluation de vos méta-données.</li>
      </ul>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Les 8 critères GEO qui déterminent si une IA vous cite</ArrowLink>

      <h2>Questions fréquentes</h2>

      <h3>Google réécrit-il toujours les meta descriptions ?</h3>

      <p>Google réécrit la meta description dans environ 60 à 70 % des cas en 2026, souvent pour mieux correspondre à la requête. Mais une meta bien écrite, pertinente et de la bonne longueur a beaucoup plus de chances d'être conservée. Et même quand Google la réécrit, les IA qui crawlent votre site lisent la meta originale dans le HTML.</p>

      <h3>Faut-il écrire des meta descriptions différentes pour le SEO et le GEO ?</h3>

      <p>Non. L'objectif est d'écrire UNE meta description qui performe sur les deux fronts. La formule FACTS combine les critères SEO (CTR, mot-clé, longueur) et GEO (extractibilité, factualité, entity-richness) dans un seul texte de 130-155 caractères.</p>

      <h3>Les meta descriptions impactent-elles directement le classement Google ?</h3>

      <p>Non directement — la meta description n'est pas un facteur de classement pour Google. Mais un CTR élevé est un signal indirect de qualité. Et côté GEO, une meta description bien structurée impacte directement la probabilité d'être cité dans les réponses IA.</p>

      <h2>Ce qu'il faut retenir</h2>

      <p>En 2026, la meta description est la première phrase que les IA citent de vous. Elle ne sert plus seulement à attirer un clic — elle sert à être sélectionnée comme source par ChatGPT, Perplexity et Gemini. Appliquez la formule FACTS (Factuel, Actionnable, Citable, Target, Spécifique) à chacune de vos pages, et vous optimiserez simultanément votre CTR Google et votre visibilité IA.</p>

      <p>Commencez par vos 10 pages les plus visitées. Réécrivez leurs meta descriptions avec la checklist ci-dessus. Mesurez l'impact après 4 semaines. Les résultats vous surprendront.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA : les 5 schémas JSON-LD prioritaires pour le GEO</ArrowLink>
      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : quelles différences et comment les combiner en 2026</ArrowLink>
    </>
  );
}
