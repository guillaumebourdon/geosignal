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
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#8A8680', marginBottom: 12 }}>{children}</p>
      <a href={href} style={{ display: 'inline-block', background: '#D97757', color: '#fff', borderRadius: 8, padding: '11px 28px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
        Tester mon site gratuitement →
      </a>
    </div>
  );
}

export default function MetaDescriptionsSeoGeo2026() {
  return (
    <>
      <p>En 2026, votre meta description ne sert plus seulement a convaincre un internaute de cliquer dans Google. Elle sert aussi a convaincre une IA de vous citer. ChatGPT, Perplexity et Gemini utilisent la meta description comme resume prioritaire quand ils analysent votre page. Si elle est vague, promotionnelle ou absente, l'IA passe a la source suivante.</p>

      <p>Le probleme : la plupart des meta descriptions sont encore ecrites pour le SEO de 2020. Elles poussent au clic avec des formules marketing, mais ne contiennent aucune information citable. Resultat : elles performent de moins en moins dans Google (a cause des AI Overviews qui absorbent les clics) et sont ignorees par les moteurs IA.</p>

      <p>Ce guide vous montre comment ecrire des meta descriptions qui gagnent sur les deux fronts : CTR dans Google ET citabilite dans les reponses IA.</p>

      <h2>Pourquoi les meta descriptions comptent 2x plus en 2026</h2>

      <h3>Le double role : CTR Google + citation IA</h3>

      <p>Historiquement, la meta description avait un seul objectif : augmenter le taux de clic (CTR) dans les resultats de recherche Google. En 2026, elle a un second role tout aussi important : servir d'extrait citable pour les moteurs de reponse IA.</p>

      <p>Quand ChatGPT Search, Perplexity ou Google Gemini analysent votre page, ils lisent en priorite trois elements : le titre, la meta description, et les 300 premiers caracteres du contenu visible. La meta description est souvent le premier passage qu'ils extraient pour resumer votre page dans leur reponse.</p>

      <p>Les chiffres le confirment : <strong>44,2 % des citations IA proviennent des 30 premiers % du texte d'une page</strong> (Growth Memo, 2026). La meta description, positionnee tout en haut du DOM, fait partie de cette zone critique.</p>

      <h3>Le contexte qui change tout</h3>

      <p>Sur les requetes qui declenchent un AI Overview dans Google, le <strong>taux de clic organique a chute de 61 %</strong> (Seer Interactive, 2025). Les internautes lisent le resume IA et passent a autre chose. Si votre meta description n'est pas assez informative pour etre integree dans ce resume, vous perdez a la fois le clic et la visibilite.</p>

      <p>En parallele, <strong>80 % des URLs citees par ChatGPT ne sont pas dans le top 100 Google</strong> (Ahrefs, 2025). Cela signifie que meme un site modeste en SEO classique peut etre cite par les IA — a condition que son contenu (et sa meta description) soit structure pour etre extrait.</p>

      <ArrowLink href="/blog/pourquoi-trafic-google-baisse-2026">Pourquoi votre trafic Google baisse en 2026 (et ce que les IA ont a voir la-dedans)</ArrowLink>

      <h2>Les regles SEO qui restent vraies</h2>

      <p>Avant d'ajouter la couche GEO, rappelons les fondamentaux SEO de la meta description. Ils ne sont pas obsoletes — ils sont necessaires mais plus suffisants.</p>

      <h3>Longueur optimale</h3>

      <p>Google affiche environ <strong>155-160 caracteres</strong> sur desktop et <strong>120 caracteres</strong> sur mobile. Au-dela, le texte est tronque. En dessous de 70 caracteres, vous gaspillez de l'espace precieux. Visez 130-155 caracteres pour couvrir les deux formats.</p>

      <h3>Mot-cle principal en debut</h3>

      <p>Google met en gras les termes qui correspondent a la requete de l'utilisateur. Placer votre mot-cle principal dans les 60 premiers caracteres maximise la visibilite du "gras" et le signal de pertinence.</p>

      <h3>Promesse claire + incitation a l'action</h3>

      <p>La meta description est un pitch de vente en 155 caracteres. Elle doit repondre a la question implicite de l'utilisateur : "Pourquoi devrais-je cliquer sur CE resultat ?"</p>

      <h3>Unicite page par page</h3>

      <p>Chaque page doit avoir une meta description unique. Les duplications sont ignorees par Google (il genere son propre extrait a la place) et creent de la confusion pour les IA qui crawlent votre site.</p>

      <h3>Ce qu'il faut eviter</h3>

      <ul>
        <li>Les listes de mots-cles sans phrase ("SEO, GEO, visibilite, IA, optimisation")</li>
        <li>Les meta vides (Google genere un extrait automatique souvent mediocre)</li>
        <li>Les emojis excessifs (1 emoji passe, 5 emojis font spam)</li>
        <li>Les guillemets doubles (ils tronquent la meta dans le HTML)</li>
      </ul>

      <h2>Les nouvelles regles GEO</h2>

      <p>C'est ici que 2026 change la donne. Les moteurs IA n'evaluent pas une meta description comme Google. Ils cherchent des informations extractibles, verifiables et autonomes. Voici les 5 criteres GEO d'une meta description optimale.</p>

      <h3>1. Extractibilite : structure sujet-verbe-complement claire</h3>

      <p>Les IA extraient des passages complets. Une meta description bien structuree grammaticalement sera reprise telle quelle. Une succession de fragments ne le sera pas.</p>

      <pre><code>{`❌ "Votre partenaire digital. Solutions innovantes. Depuis 2005."

✅ "Detekia analyse votre site sur 8 criteres GEO et genere un score de citabilite IA sur 100 en moins de 60 secondes."`}</code></pre>

      <p>La deuxieme version est une phrase complete que l'IA peut integrer directement dans sa reponse.</p>

      <h3>2. Factualite : donnees chiffrees, pas de superlatifs vagues</h3>

      <p>Les IA favorisent les contenus verifiables. Une meta description qui contient des chiffres concrets a <strong>2,8x plus de chances d'etre citee</strong> qu'une meta sans donnee verifiable (AirOps, 2026).</p>

      <pre><code>{`❌ "Le meilleur outil du marche pour votre visibilite en ligne."

✅ "Analysez votre site sur 8 criteres GEO valides par Princeton/KDD 2024. Score sur 100 en moins de 60 secondes, gratuit."`}</code></pre>

      <h3>3. Entity-richness : nommer les entites</h3>

      <p>Les IA comprennent mieux votre page quand la meta description nomme explicitement les entites cles : nom de marque, lieu, produit, technologie, chiffre cle.</p>

      <pre><code>{`❌ "Decouvrez nos solutions pour ameliorer votre presence en ligne."

✅ "Detekia mesure la visibilite de votre site dans ChatGPT, Gemini et Perplexity via 8 criteres GEO (Princeton/KDD 2024)."`}</code></pre>

      <h3>4. Citation-worthiness : peut-elle servir de reponse autonome ?</h3>

      <p>Le test ultime : si quelqu'un copiait votre meta description et la collait comme reponse a une question, est-ce que ca aurait du sens ? Si oui, elle est citable. Si non, elle est juste un teaser marketing.</p>

      <h3>5. Independance contextuelle : comprehensible hors de la page</h3>

      <p>Les IA extraient votre meta description sans voir le reste de la page. Elle doit etre autonome : pas de "Decouvrez ici...", pas de "En savoir plus sur...", pas de reference a un element visuel.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour etre cite par les IA en 2026</ArrowLink>

      <h2>La formule FACTS : le framework hybride gagnant</h2>

      <p>Pour combiner SEO et GEO en une seule meta description, utilisez la formule <strong>FACTS</strong> :</p>

      <ul>
        <li><strong>F</strong>actuel : au moins 1 donnee chiffree ou fait verifiable</li>
        <li><strong>A</strong>ctionnable : l'utilisateur sait ce qu'il va obtenir (guide, outil, comparatif...)</li>
        <li><strong>C</strong>itable : la phrase peut etre extraite et utilisee comme reponse autonome</li>
        <li><strong>T</strong>arget : le mot-cle principal est dans les 60 premiers caracteres</li>
        <li><strong>S</strong>pecifique : noms d'entites, chiffres, dates — pas de generalites</li>
      </ul>

      <p><strong>Exemple applique — boutique de cafe en ligne :</strong></p>

      <pre><code>{`Avant (SEO only) : "Decouvrez notre selection de cafes de specialite. Livraison rapide, prix imbattables. Commandez maintenant !"

Apres (FACTS) : "Cafe de specialite : 12 origines mono-plantation notees 85+ SCA, torrefies a Bordeaux. Livraison 48h, 4.8/5 sur 1 200 avis Trustpilot."`}</code></pre>

      <p><strong>Exemple applique — SaaS B2B :</strong></p>

      <pre><code>{`Avant : "La solution CRM la plus complete pour votre entreprise. Essai gratuit."

Apres : "CRM pour PME : gestion contacts, pipeline et factures en 1 outil. 4 500 entreprises, integration Stripe et Gmail. Essai 14 jours gratuit."`}</code></pre>

      <p><strong>Exemple applique — agence immobiliere :</strong></p>

      <pre><code>{`Avant : "Votre projet immobilier commence ici. Experts passionnes a votre service."

Apres : "Agence immobiliere Paris 11e : 320 biens vendus en 2025, delai moyen 45 jours. Estimation gratuite en ligne, 4.9/5 Google."`}</code></pre>

      <h2>5 exemples avant/apres par secteur</h2>

      <div style={{ overflowX: 'auto', margin: '24px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#1A1916' }}>
              {['Secteur', 'Avant (SEO only)', 'Apres (SEO + GEO)'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#F7F5F2', fontWeight: 600, fontFamily: 'monospace', fontSize: 11, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['E-commerce', 'Les meilleurs produits au meilleur prix. Livraison offerte des 50 EUR.', 'Cafe de specialite : 12 origines mono-plantation notees 85+ SCA, torrefies a Bordeaux. 4.8/5 sur 1 200 avis.'],
              ['SaaS B2B', 'La solution tout-en-un pour votre entreprise. Essai gratuit !', 'CRM pour PME : contacts, pipeline, factures. 4 500 entreprises, integration Stripe/Gmail. Essai 14j gratuit.'],
              ['Media / Blog', 'Toute l\'actualite tech et marketing. Restez informe.', 'Guide SEO vs GEO 2026 : comparatif en 12 criteres, strategie 3 couches, et plan d\'action en 5 etapes (Princeton/KDD).'],
              ['Service local', 'Votre expert de confiance depuis 20 ans. Contactez-nous !', 'Plombier Paris 15e : intervention en 2h, devis gratuit, 4.9/5 Google (890 avis). Urgences 24h/24.'],
              ['Marketplace', 'Des milliers de vendeurs vous attendent. Inscrivez-vous !', 'Marketplace freelances tech : 8 000 profils verifies, delai moyen 48h, satisfaction 94%. Publiez un projet gratuitement.'],
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

      <p>Remarquez le pattern : chaque version "apres" contient au moins 2 chiffres, 1 nom d'entite, et forme une phrase autonome citable.</p>

      <InlineCTA href="/">Votre meta description est-elle citable par les IA ? Verifiez votre score GEO en moins de 60 secondes.</InlineCTA>

      <h2>Checklist operationnelle : 12 points a verifier</h2>

      <p>Avant de publier ou mettre a jour une meta description en 2026, passez-la au crible de cette checklist :</p>

      <ol>
        <li><strong>Longueur entre 130 et 155 caracteres</strong> — couvre desktop et mobile</li>
        <li><strong>Mot-cle principal dans les 60 premiers caracteres</strong> — signal SEO fort</li>
        <li><strong>Au moins 1 donnee chiffree</strong> (pourcentage, volume, note, date) — critere de verifiabilite GEO</li>
        <li><strong>Au moins 1 entite nommee</strong> (marque, lieu, produit, technologie) — entity-richness</li>
        <li><strong>Phrase complete sujet-verbe-complement</strong> — extractibilite IA</li>
        <li><strong>Comprehensible sans contexte</strong> — independance contextuelle</li>
        <li><strong>Pas de superlatifs non prouves</strong> ("le meilleur", "leader") — neutralite editoriale</li>
        <li><strong>Unique pour cette page</strong> — pas de duplication</li>
        <li><strong>Pas de guillemets doubles</strong> — ils tronquent dans le HTML</li>
        <li><strong>Coherente avec le contenu reel de la page</strong> — sinon Google la remplace</li>
        <li><strong>Contient une promesse ou un benefice clair</strong> — CTR SEO</li>
        <li><strong>Passe le "test de citation"</strong> : collee comme reponse a une question, elle a du sens</li>
      </ol>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">Score GEO : comment mesurer la visibilite IA de votre site</ArrowLink>

      <h2>Comment mesurer l'impact de vos meta descriptions</h2>

      <h3>Cote SEO : Google Search Console</h3>

      <p>Suivez le CTR par page dans Google Search Console. Apres avoir reecrit vos meta descriptions, comparez le CTR sur 4 semaines glissantes. Un gain de 1 a 3 points de CTR est typique sur les pages ou la meta etait generique.</p>

      <h3>Cote GEO : test de citation + audit Detekia</h3>

      <p>Pour mesurer la citabilite de vos meta descriptions par les IA :</p>

      <ul>
        <li><strong>Test manuel</strong> : posez a ChatGPT ou Perplexity une question liee a votre page. Votre site est-il cite ? L'extrait utilise provient-il de votre meta description ?</li>
        <li><strong>Audit automatise</strong> : Detekia mesure l'extractibilite de votre contenu sur 8 criteres GEO. Le score d'extractibilite (25 points sur 100) inclut l'evaluation de vos meta-donnees.</li>
      </ul>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Les 8 criteres GEO qui determinent si une IA vous cite</ArrowLink>

      <h2>Questions frequentes</h2>

      <h3>Google reecrit-il toujours les meta descriptions ?</h3>

      <p>Google reecrit la meta description dans environ 60 a 70 % des cas en 2026, souvent pour mieux correspondre a la requete. Mais une meta bien ecrite, pertinente et de la bonne longueur a beaucoup plus de chances d'etre conservee. Et meme quand Google la reecrit, les IA qui crawlent votre site lisent la meta originale dans le HTML.</p>

      <h3>Faut-il ecrire des meta descriptions differentes pour le SEO et le GEO ?</h3>

      <p>Non. L'objectif est d'ecrire UNE meta description qui performe sur les deux fronts. La formule FACTS combine les criteres SEO (CTR, mot-cle, longueur) et GEO (extractibilite, factualite, entity-richness) dans un seul texte de 130-155 caracteres.</p>

      <h3>Les meta descriptions impactent-elles directement le classement Google ?</h3>

      <p>Non directement — la meta description n'est pas un facteur de classement pour Google. Mais un CTR eleve est un signal indirect de qualite. Et cote GEO, une meta description bien structuree impacte directement la probabilite d'etre cite dans les reponses IA.</p>

      <h2>Ce qu'il faut retenir</h2>

      <p>En 2026, la meta description est la premiere phrase que les IA citent de vous. Elle ne sert plus seulement a attirer un clic — elle sert a etre selectionnee comme source par ChatGPT, Perplexity et Gemini. Appliquez la formule FACTS (Factuel, Actionnable, Citable, Target, Specifique) a chacune de vos pages, et vous optimiserez simultanement votre CTR Google et votre visibilite IA.</p>

      <p>Commencez par vos 10 pages les plus visitees. Reecrivez leurs meta descriptions avec la checklist ci-dessus. Mesurez l'impact apres 4 semaines. Les resultats vous surprendront.</p>
    </>
  );
}
