import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

function OffreCard({ titre, prix, description, inclus }) {
  return (
    <div style={{ border: '1px solid #E5E2DC', borderRadius: 10, padding: '20px 24px', marginBottom: 16, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <strong style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1A1916' }}>{titre}</strong>
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#D97757', fontWeight: 700 }}>{prix}</span>
      </div>
      <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', marginBottom: 12 }}>{description}</p>
      <ul style={{ fontFamily: 'system-ui', fontSize: 13, color: '#3A3733', paddingLeft: 16 }}>
        {inclus.map((item, i) => <li key={i} style={{ marginBottom: 4 }}>{item}</li>)}
      </ul>
    </div>
  );
}

export default function GeoAgencesSeoAuditIa() {
  return (
    <>
      <p>Le GEO (Generative Engine Optimization) est en train de devenir ce que le SEO était en 2008 : une nouvelle discipline que vos clients commencent à entendre parler, sans savoir exactement ce que c'est — et qui cherchent quelqu'un pour les guider.</p>

      <p>Pour les agences SEO, c'est une opportunité rare : être présent sur un marché avant qu'il soit saturé. Les agences qui intègrent l'audit GEO dans leurs prestations dès maintenant prendront 2 à 3 ans d'avance sur les concurrents qui attendront que ça devienne "mainstream".</p>

      <p>Ce guide vous explique comment construire une offre GEO concrète, l'intégrer à votre pratique SEO existante, et la vendre à vos clients actuels et futurs.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">Comprendre les différences entre SEO et GEO avant de lire ce guide →</ArrowLink>

      <h2>Pourquoi les agences SEO sont les mieux placées</h2>

      <p>L'audit GEO n'est pas une discipline radicalement nouvelle — c'est une extension naturelle du SEO. 70 % des critères GEO sont déjà dans le périmètre d'une bonne agence SEO :</p>

      <ul>
        <li>La technique (crawlabilité, vitesse, SSR) est déjà dans votre scope</li>
        <li>Le contenu (structure, E-E-A-T, données fraîches) est déjà dans votre scope</li>
        <li>Les données structurées (Schema.org) sont déjà dans votre scope</li>
        <li>La présence externe (netlinking, mentions) est déjà dans votre scope</li>
      </ul>

      <p>Ce qui change avec le GEO, c'est l'angle : au lieu d'optimiser pour Google, vous optimisez pour les LLM. Les techniques se recoupent largement, mais l'évaluation et le reporting sont nouveaux.</p>

      <p><strong>Avantage concurrentiel :</strong> Vos clients existants vous font déjà confiance pour leur visibilité en ligne. Proposer l'audit GEO, c'est étendre cette confiance à un nouveau canal — sans devoir repartir de zéro sur la relation commerciale.</p>

      <h2>Comment structurer l'audit GEO</h2>

      <p>L'audit GEO se déroule en 4 phases. Chaque phase a un livrable précis et des actions concrètes.</p>

      <h3>Phase 1 : Diagnostic (1-2 heures)</h3>

      <p>Évaluez l'état actuel du site sur les 8 critères GEO :</p>

      <ul>
        <li>Crawlabilité IA : robots.txt, llms.txt, rendu côté serveur</li>
        <li>Extractibilité : structure des titres, densité des faits, listes</li>
        <li>Données structurées : schemas JSON-LD présents et valides</li>
        <li>Neutralité éditoriale : ton, superlatifs, honnêteté sur les limites</li>
        <li>Vérifiabilité : sources citées, dates, auteurs identifiés</li>
        <li>E-E-A-T : page À propos, biographies, certifications</li>
        <li>Présence externe : backlinks, mentions médias, avis tiers</li>
        <li>Fraîcheur : dates de publication, fréquence de mise à jour</li>
      </ul>

      <p>Utilisez un outil d'audit automatisé (comme Detekia) pour avoir un score de base, puis approfondissez les points faibles manuellement.</p>

      <h3>Phase 2 : Tests de citabilité (1 heure)</h3>

      <p>Testez directement si le client est cité dans les principales IA :</p>

      <pre><code>{`Tests à effectuer dans ChatGPT, Perplexity, Gemini :

1. "[Nom de marque] avis" → est-il mentionné ?
2. "[Service/produit] meilleur/recommandé" → apparaît-il ?
3. "[Question clé du secteur]" → ses contenus sont-ils cités ?
4. "[Ville] + [Profession]" (pour les locaux) → est-il dans les résultats ?`}</code></pre>

      <p>Documentez les résultats avec des captures d'écran. C'est souvent le meilleur argument de vente : montrer au client qu'il n'apparaît pas quand ses concurrents, si.</p>

      <h3>Phase 3 : Plan d'action priorisé (2-3 heures)</h3>

      <p>Transformez le diagnostic en actions concrètes, classées par impact et effort :</p>

      <ul>
        <li><strong>Gains rapides</strong> (1-2 semaines) : corrections robots.txt, ajout schemas manquants, restructuration des titres</li>
        <li><strong>Gains moyens</strong> (1-3 mois) : refonte de contenus clés, création de llms.txt, renforcement E-E-A-T</li>
        <li><strong>Gains long terme</strong> (3-12 mois) : stratégie de présence externe, production de contenus cibles, netlinking GEO-orienté</li>
      </ul>

      <h3>Phase 4 : Suivi et reporting (mensuel)</h3>

      <p>Le reporting GEO combine :</p>

      <ul>
        <li>Évolution du score GEO (baseline → objectif)</li>
        <li>Tests mensuels de citabilité dans les IA majeures</li>
        <li>Tracking du trafic IA (identifiable via UTM ou analyse des user-agents)</li>
        <li>Comparaison avec les concurrents directs</li>
      </ul>

      <h2>Les offres à proposer à vos clients</h2>

      <OffreCard
        titre="Audit GEO one-shot"
        prix="800 – 1 500 €"
        description="Pour les clients qui veulent comprendre leur situation actuelle avant de s'engager davantage."
        inclus={[
          "Score GEO sur les 8 critères avec benchmark sectoriel",
          "Tests de citabilité dans ChatGPT, Perplexity, Gemini",
          "Rapport PDF détaillé avec recommandations et exemples de code",
          "Plan d'action priorisé (quick wins + moyen terme)",
          "1 heure de restitution en visio",
        ]}
      />

      <OffreCard
        titre="Accompagnement GEO mensuel"
        prix="500 – 1 200 €/mois"
        description="Pour les clients qui veulent améliorer activement leur citabilité IA dans la durée."
        inclus={[
          "Implémentation mensuelle des actions prioritaires",
          "Production ou optimisation de 2-4 contenus GEO",
          "Suivi du score GEO et des tests de citabilité",
          "Rapport mensuel + appel de suivi",
          "Veille sur les évolutions des algorithmes IA",
        ]}
      />

      <OffreCard
        titre="Intégration GEO dans l'audit SEO existant"
        prix="+30-50% sur le tarif audit SEO"
        description="Pour les clients existants — extension naturelle de votre prestation habituelle."
        inclus={[
          "Section GEO dans le rapport d'audit SEO",
          "Évaluation des 8 critères GEO",
          "Recommandations GEO dans le plan d'action",
          "Tests de citabilité de base",
        ]}
      />

      <h2>Les arguments commerciaux qui fonctionnent</h2>

      <p>Vos clients n'ont pas tous conscience qu'ils ont un problème GEO. Voici les arguments qui déclenchent la conversation :</p>

      <h3>L'argument de la visibilité perdue</h3>

      <p>"En France, 34 % des recherches en ligne commencent maintenant sur une IA plutôt que sur Google pour votre secteur. Si votre site n'est pas optimisé pour les IA, vous êtes invisible pour un tiers de vos prospects potentiels."</p>

      <h3>L'argument du concurrent</h3>

      <p>Faites un test en direct : tapez le nom du secteur du client dans ChatGPT ou Perplexity. Si un concurrent est cité et pas lui, c'est le meilleur argument de vente possible. Rien ne vaut une démonstration concrète.</p>

      <h3>L'argument du taux de conversion</h3>

      <p>"Un visiteur qui arrive sur votre site après une recommandation IA a déjà décidé de s'intéresser à vous — il convertit 4 fois mieux qu'un visiteur SEO classique. C'est du trafic pré-qualifié."</p>

      <h3>L'argument de la fenêtre d'opportunité</h3>

      <p>"Le GEO en 2026, c'est le SEO en 2012. Vos concurrents ne sont pas encore optimisés — c'est le moment d'avoir 2 ans d'avance avant que tout le monde s'y mette."</p>

      <h2>Comment former votre équipe</h2>

      <p>Vous n'avez pas besoin de tout maîtriser avant de proposer l'audit GEO. Commencez par former 1-2 personnes en profondeur, et structurez un process reproductible.</p>

      <h3>Les compétences clés à développer</h3>

      <ul>
        <li><strong>Compréhension des LLM</strong> : comment fonctionnent ChatGPT, Perplexity, Gemini, leurs sources</li>
        <li><strong>Évaluation de l'extractibilité</strong> : lire un contenu et identifier ce qui est extractible ou non</li>
        <li><strong>Schema.org avancé</strong> : FAQPage, Article, Organization, Product — implémentation et validation</li>
        <li><strong>Analyse robots.txt</strong> : identifier les blocages de bots IA</li>
        <li><strong>Rédaction GEO</strong> : restructurer un contenu pour le rendre plus citable</li>
      </ul>

      <h3>Les ressources pour se former</h3>

      <ul>
        <li>Les articles de notre blog — notamment le guide complet GEO et la méthodologie des 8 critères</li>
        <li>L'étude académique originale : "Generative Engine Optimization" (Aggarwal et al., 2023)</li>
        <li>Les guidelines Google pour l'E-E-A-T (Search Quality Evaluator Guidelines)</li>
        <li>La documentation officielle des bots : openai.com/gptbot, anthropic.com/robots</li>
      </ul>

      <ArrowLink href="/blog/geo-guide-complet-2026">Le guide complet GEO : les 8 critères, 7 actions concrètes →</ArrowLink>

      <h2>Intégrer le GEO dans votre workflow existant</h2>

      <p>Voici comment intégrer le GEO sans tout refaire de zéro :</p>

      <h3>Dans l'audit technique SEO</h3>

      <p>Ajoutez une section "Crawlabilité IA" à votre checklist d'audit technique :</p>

      <ul>
        <li>Vérification robots.txt pour GPTBot, ClaudeBot, PerplexityBot, Google-Extended</li>
        <li>Présence et qualité du sitemap XML</li>
        <li>Présence d'un llms.txt</li>
        <li>Test de rendu SSR/SSG vs JavaScript client-side</li>
      </ul>

      <h3>Dans l'audit de contenu</h3>

      <p>Pour chaque page analysée, ajoutez une évaluation GEO :</p>

      <ul>
        <li>Score d'extractibilité : structure claire, données chiffrées, listes</li>
        <li>Score de vérifiabilité : sources citées, auteur identifié, date visible</li>
        <li>Score de neutralité : superlatifs, comparaisons honnêtes, limites mentionnées</li>
      </ul>

      <h3>Dans les recommandations de contenu</h3>

      <p>Quand vous recommandez la création ou la réécriture de contenus, intégrez systématiquement :</p>

      <ul>
        <li>La structure GEO-optimale (titres, listes, encadrés récapitulatifs)</li>
        <li>Les schemas JSON-LD adaptés (Article + FAQPage pour les guides)</li>
        <li>Les signaux E-E-A-T (biographie auteur, date, sources)</li>
      </ul>

      <h2>Les erreurs à éviter</h2>

      <p><strong>Sur-promettre sur les résultats :</strong> Le GEO est moins déterministe que le SEO. On ne peut pas garantir un classement dans une IA comme on garantit une position sur Google. Parlez de "citabilité accrue" et de "probabilité plus élevée d'être cité", pas de "garantie de citation".</p>

      <p><strong>Confondre GEO et SEO d'IA :</strong> Le GEO ne concerne pas les positions dans les réponses d'IA — il concerne la probabilité d'être cité du tout. C'est un travail de fond, pas un levier d'optimisation immédiate.</p>

      <p><strong>Négliger le contenu de fond :</strong> L'optimisation technique ne suffit pas. Un contenu sans valeur informative ne sera pas cité même avec des schemas parfaits. La qualité éditoriale reste le fondement.</p>

      <p><strong>Ignorer la compétition :</strong> Votre client n'est pas seul. Si ses concurrents ont des contenus plus extractibles, mieux sourcés et plus structurés, ils seront cités en premier. L'audit GEO doit toujours inclure un benchmark concurrentiel.</p>

      <h2>Le marché dans les 2 ans qui viennent</h2>

      <p>Les projections actuelles suggèrent que d'ici 2027 :</p>

      <ul>
        <li>40-50 % des requêtes d'information passeront par des interfaces IA (vs moteurs classiques)</li>
        <li>Les IA intégreront des publicités et des liens sponsorisés — créant un marché "GEO payant" en parallèle du GEO organique</li>
        <li>Les outils d'audit GEO seront aussi banals que Semrush ou Screaming Frog</li>
        <li>Les formations SEO intègreront systématiquement une section GEO</li>
      </ul>

      <p>Les agences qui construisent leur expertise et leurs process dès maintenant seront les mieux positionnées pour capter ce marché. Le coût d'entrée aujourd'hui est faible — il montera à mesure que la compétition s'intensifie.</p>

      <ArrowLink href="/">Analysez un site client avec l'audit GEO gratuit Detekia →</ArrowLink>
    </>
  );
}
