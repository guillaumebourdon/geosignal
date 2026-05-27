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

export default function GeminiVisibiliteSiteFrance() {
  return (
    <>
      <p>Gemini n'est plus un chatbot expérimental. C'est le moteur IA qui alimente les AI Overviews dans Google Search, les résumés dans Gmail, les suggestions dans Chrome et Android. Avec <strong>91 % de parts de marché en France</strong> (StatCounter, mars 2026), Google est le point d'entrée de la quasi-totalité du trafic web français. Quand Google change, tout le monde est impacté.</p>

      <p>Le changement est déjà mesurable : aux États-Unis, les AI Overviews apparaissent sur environ <strong>30 % des requêtes informationnelles</strong> (BrightEdge, 2026). L'AI Mode — une version encore plus agressive qui remplace complètement les résultats classiques par une réponse conversationnelle — est déjà disponible dans plusieurs pays. La France arrive. La question n'est plus "si" mais "quand" votre trafic organique sera affecté.</p>

      <h2>Gemini, c'est quoi exactement ?</h2>

      <p>Gemini est le modèle d'IA central de Google, lancé fin 2023 sous le nom Bard puis renommé en février 2024. C'est un modèle multimodal capable de traiter du texte, des images, de la vidéo et du code. Mais son rôle le plus stratégique pour les entreprises, c'est son intégration directe dans Google Search via les AI Overviews.</p>

      <p>Concrètement, quand un utilisateur fait une recherche informationnelle sur Google, Gemini génère un résumé en haut de la page de résultats. Ce résumé cite des sources — et c'est là que se joue votre visibilité. Si vous n'êtes pas dans ce résumé, vous êtes repoussé sous le pli, voire invisible.</p>

      <p><strong>La différence fondamentale avec ChatGPT et Perplexity</strong> : Gemini puise directement dans l'index Google. Il ne s'appuie pas sur Bing (comme ChatGPT) ni sur un index propriétaire (comme Perplexity). Il utilise le même corpus que le moteur de recherche classique, mais le filtre et le synthétise via l'IA. Cela signifie que votre travail SEO existant n'est pas perdu — il constitue la base sur laquelle Gemini s'appuie.</p>

      <InternalLink href="/blog/comment-chatgpt-choisit-ses-sources">Comment ChatGPT choisit ses sources : le fonctionnement expliqué</InternalLink>

      <h2>Pourquoi Gemini change les règles du jeu pour le SEO français</h2>

      <p>Les AI Overviews transforment la page de résultats Google en une réponse unique avec quelques sources citées, au lieu de 10 liens bleus. Soit vous êtes cité dans cette réponse, soit vous perdez le clic. Les données américaines montrent que <strong>les sites non cités dans les AI Overviews perdent jusqu'à 60 % de leurs clics organiques</strong> sur les requêtes concernées (Authoritas, 2025).</p>

      <p>L'AI Mode va encore plus loin : il supprime complètement la page de résultats classique. L'utilisateur obtient une réponse conversationnelle avec des liens intégrés, sans jamais voir la liste traditionnelle de résultats. Google a confirmé que l'AI Mode sera déployé progressivement dans tous les marchés en 2026.</p>

      <p>Le risque de zéro-clic massif est réel. Mais l'opportunité aussi : <strong>les 3 sources citées dans un AI Overview captent plus de trafic qu'une position 4 ou 5 classique</strong>. Être LA source que Gemini choisit de citer devient le nouvel objectif du référencement.</p>

      <p>Pour les entreprises françaises, le calendrier est serré. Les AI Overviews sont déjà visibles en France sur certaines requêtes en anglais. Le déploiement complet en français est attendu courant 2026. Les sites qui se préparent maintenant auront un avantage de positionnement décisif.</p>

      <h2>6 actions concrètes pour optimiser votre site pour Gemini</h2>

      <p>Gemini s'appuie sur l'index Google existant mais applique ses propres critères de sélection pour choisir quelles sources citer. Voici les six leviers les plus efficaces, classés par impact.</p>

      <h3>1. Structurer le contenu en réponses directes</h3>

      <p>Gemini extrait les 100 à 150 premiers mots de chaque section pour construire ses résumés. La structure idéale : chaque H2 commence par une réponse directe à la question posée, suivie du développement. Un paragraphe d'introduction vague avant la réponse réelle fait perdre la citation.</p>

      <p>Format recommandé : question dans le H2, réponse en une à deux phrases assertives dans le premier paragraphe, puis argumentation et données dans la suite. C'est la pyramide inversée, le format que tous les modèles IA privilégient pour l'extraction.</p>

      <h3>2. Renforcer l'E-E-A-T</h3>

      <p>Google évalue l'Expérience, l'Expertise, l'Autorité et la Fiabilité de chaque page avant de la citer dans un AI Overview. Les actions concrètes :</p>

      <ul>
        <li><strong>Pages auteurs</strong> — chaque article doit être signé par un auteur avec une page bio détaillant ses qualifications</li>
        <li><strong>Expertise démontrée</strong> — inclure des analyses originales, pas seulement des reformulations de ce qui existe déjà</li>
        <li><strong>Sources citées</strong> — chaque affirmation factuelle doit renvoyer à une source vérifiable (étude, rapport, données officielles)</li>
        <li><strong>Signaux de confiance</strong> — mentions presse, partenariats, certifications visibles sur le site</li>
      </ul>

      <h3>3. Implémenter les données structurées</h3>

      <p>Les schemas JSON-LD aident Gemini à comprendre la nature et la structure de votre contenu. Les schemas prioritaires pour les AI Overviews :</p>

      <ul>
        <li><code>Article</code> avec <code>author</code>, <code>datePublished</code>, <code>dateModified</code></li>
        <li><code>FAQPage</code> pour les pages questions-réponses — directement extractibles par Gemini</li>
        <li><code>HowTo</code> pour les tutoriels étape par étape</li>
        <li><code>Organization</code> pour établir l'identité de votre entreprise</li>
      </ul>

      <p>Selon une analyse Merkle (2025), les pages avec un schema <code>FAQPage</code> correctement implémenté ont <strong>43 % de chances supplémentaires</strong> d'être citées dans un AI Overview par rapport aux pages sans données structurées.</p>

      <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA : le guide pratique pour être compris par les LLM</InternalLink>

      <h3>4. Organiser le contenu en clusters thématiques</h3>

      <p>Gemini évalue l'autorité thématique d'un site, pas seulement la pertinence d'une page isolée. Un site qui couvre un sujet en profondeur — avec une page pilier et des articles satellites liés entre eux — est favorisé face à un site qui publie un article isolé sur le même sujet.</p>

      <p>La structure recommandée : une page principale qui couvre le sujet large (ex : "GEO : le guide complet"), des articles spécifiques sur chaque sous-thème (ex : "Schema.org pour l'IA", "Données structurées et visibilité"), et des liens internes entre toutes ces pages. Ce maillage interne signale à Gemini que votre site fait autorité sur l'ensemble du sujet.</p>

      <InternalLink href="/blog/schema-org-ia-guide-pratique">Données structurées et visibilité IA : le guide complet</InternalLink>

      <h3>5. Optimiser la technique</h3>

      <p>Les prérequis techniques sont non négociables. Si Gemini ne peut pas crawler et comprendre votre site, aucune optimisation de contenu ne servira :</p>

      <ul>
        <li><strong>Vitesse de chargement</strong> — les Core Web Vitals restent un signal de qualité pour Google, y compris pour les AI Overviews</li>
        <li><strong>Accessibilité IA</strong> — vérifiez que <code>Googlebot</code> n'est pas bloqué dans votre <code>robots.txt</code> (Gemini utilise le même crawler)</li>
        <li><strong>Pas de blocage des bots IA</strong> — certains sites bloquent <code>Google-Extended</code> (le user-agent dédié à l'IA de Google) sans le savoir</li>
        <li><strong>Rendu JavaScript</strong> — si votre contenu est rendu côté client, assurez-vous qu'il est accessible au crawl</li>
      </ul>

      <h3>6. Ajouter des données chiffrées et des sources vérifiables</h3>

      <p>Gemini, comme tous les modèles IA, privilégie les contenus qui contiennent des données vérifiables. Un article avec des pourcentages, des dates, des volumes et des sources identifiées est cité plus souvent qu'un article générique sans données. Chaque section clé de votre contenu devrait inclure au moins un chiffre sourcé.</p>

      <InlineCTA href="/">Testez votre visibilité IA gratuitement — Score sur 100 en 2 minutes</InlineCTA>

      <h2>Gemini vs ChatGPT vs Perplexity : quelles différences pour votre visibilité ?</h2>

      <p>Les trois moteurs IA dominants n'utilisent pas les mêmes sources, ne citent pas de la même manière et ne touchent pas la même audience. Optimiser pour l'un ne garantit pas la visibilité sur les autres. Voici un comparatif structuré :</p>

      <div style={{ overflowX: 'auto', margin: '24px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E2DC' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#1A1915' }}>Critère</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#1A1915' }}>Gemini (Google)</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#1A1915' }}>ChatGPT (OpenAI)</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#1A1915' }}>Perplexity</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '10px 16px', fontWeight: 600 }}>Source de données</td>
              <td style={{ padding: '10px 16px' }}>Index Google (direct)</td>
              <td style={{ padding: '10px 16px' }}>Bing + corpus d'entraînement</td>
              <td style={{ padding: '10px 16px' }}>Index propriétaire + crawl temps réel</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '10px 16px', fontWeight: 600 }}>Type de citation</td>
              <td style={{ padding: '10px 16px' }}>Liens dans les AI Overviews</td>
              <td style={{ padding: '10px 16px' }}>Liens en mode Search, aucun en mode libre</td>
              <td style={{ padding: '10px 16px' }}>Citations numérotées systématiques</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '10px 16px', fontWeight: 600 }}>Impact trafic</td>
              <td style={{ padding: '10px 16px' }}>Le plus élevé (91 % du search en FR)</td>
              <td style={{ padding: '10px 16px' }}>Modéré (400M+ utilisateurs actifs)</td>
              <td style={{ padding: '10px 16px' }}>Faible en volume, fort en taux de clic</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '10px 16px', fontWeight: 600 }}>Audience principale</td>
              <td style={{ padding: '10px 16px' }}>Tous les utilisateurs Google</td>
              <td style={{ padding: '10px 16px' }}>Early adopters, professionnels tech</td>
              <td style={{ padding: '10px 16px' }}>Chercheurs, veilleurs, utilisateurs avancés</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 16px', fontWeight: 600 }}>Levier principal</td>
              <td style={{ padding: '10px 16px' }}>SEO + E-E-A-T + données structurées</td>
              <td style={{ padding: '10px 16px' }}>Indexation Bing + autorité de domaine</td>
              <td style={{ padding: '10px 16px' }}>Contenu frais, sourcé + Reddit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Point clé : Gemini représente le volume le plus important parce qu'il s'adresse à <strong>tous les utilisateurs Google existants</strong>, pas seulement aux early adopters qui ont choisi un outil IA. C'est le moteur qui impactera le plus de sites web français en 2026.</p>

      <InternalLink href="/blog/perplexity-comment-apparaitre">Perplexity : comment faire apparaître votre site dans ses réponses</InternalLink>

      <h2>Comment vérifier si Gemini cite votre site</h2>

      <p>Avant d'optimiser, vous devez savoir où vous en êtes. Trois méthodes complémentaires, de la plus rapide à la plus complète.</p>

      <h3>Test direct sur Gemini</h3>

      <p>Rendez-vous sur <code>gemini.google.com</code> et posez les requêtes que vos clients utiliseraient. Par exemple : "meilleur [votre catégorie] en France", "[votre secteur] comparatif 2026", ou une question technique pointue dans votre domaine. Vérifiez si votre site apparaît dans les sources citées, et si les informations retenues sont exactes.</p>

      <h3>Vérifier les AI Overviews</h3>

      <p>Faites des recherches Google sur vos requêtes stratégiques. Si des AI Overviews apparaissent (résumé en haut de page avec l'icône IA), vérifiez les sources citées. Si les AI Overviews ne sont pas encore visibles en France sur vos requêtes, utilisez un VPN américain pour tester la version US — c'est un aperçu de ce qui arrive.</p>

      <h3>Audit automatisé avec Detekia</h3>

      <p>Le test manuel est utile mais non reproductible. <InternalLink href="/">Detekia</InternalLink> analyse votre site sur les 7 critères GEO (citabilité, données structurées, E-E-A-T, accessibilité IA, etc.) et identifie les optimisations prioritaires pour chaque moteur IA, y compris Gemini via les AI Overviews.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : quelles différences et comment les combiner en 2026</ArrowLink>

      <ArrowLink href="/blog/visibilite-ia-guide-debutant">Visibilité IA : le guide pour les entreprises qui partent de zéro</ArrowLink>

      <h2>Ce qu'il faut retenir</h2>

      <p>Gemini n'est pas un moteur IA parmi d'autres. C'est Google lui-même qui change de paradigme. Avec 91 % du marché de la recherche en France, l'impact sur le trafic organique sera massif — bien plus que ChatGPT ou Perplexity réunis.</p>

      <p>Les trois actions prioritaires si vous démarrez :</p>

      <ol>
        <li><strong>Vérifiez que <code>Google-Extended</code> n'est pas bloqué</strong> dans votre <code>robots.txt</code> — c'est le prérequis absolu pour être cité par Gemini</li>
        <li><strong>Restructurez vos pages clés en pyramide inversée</strong> — réponse directe dans les 100 premiers mots, données chiffrées, sources citées</li>
        <li><strong>Implémentez les schemas <code>Article</code> et <code>FAQPage</code></strong> avec auteur, dates et organisation — Gemini les utilise pour valider l'E-E-A-T</li>
      </ol>

      <p>Les sites qui se positionnent maintenant sur les critères de Gemini captent un avantage durable. Une fois les AI Overviews déployés en France, les positions seront plus difficiles à conquérir qu'à défendre. Le moment d'agir, c'est avant le déploiement — pas après.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour être cité par les IA en 2026</ArrowLink>
    </>
  );
}
