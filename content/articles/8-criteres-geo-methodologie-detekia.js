import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

function CritereCard({ numero, nom, poids, couleur, children }) {
  return (
    <div style={{ border: `1px solid ${couleur}30`, borderLeft: `4px solid ${couleur}`, borderRadius: 10, padding: '20px 24px', marginBottom: 20, background: `${couleur}08` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, background: couleur, color: '#fff', borderRadius: 20, padding: '2px 10px' }}>#{numero}</span>
        <strong style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#1A1916' }}>{nom}</strong>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: couleur, marginLeft: 'auto' }}>{poids}</span>
      </div>
      <div style={{ fontFamily: 'system-ui', fontSize: 14, color: '#3A3733', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export default function HuitCriteresGeoMethodologieDetekia() {
  return (
    <>
      <p>Le score GEO Detekia n'est pas une boîte noire. Derrière chaque note de 0 à 100 se cachent 8 critères précis, mesurés automatiquement à partir de l'analyse de votre site. Comprendre comment chaque critère est évalué, pourquoi il compte, et comment l'améliorer — c'est l'objet de cet article.</p>

      <p>Cette méthodologie est le fruit de plusieurs mois de recherche sur ce qui détermine réellement la citabilité d'un site par les LLM. Elle s'appuie sur les travaux académiques en GEO (notamment Aggarwal et al., 2023), les guidelines de Google pour l'E-E-A-T, et les observations empiriques faites sur des centaines d'audits.</p>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">Comment interpréter votre score GEO global →</ArrowLink>

      <h2>Vue d'ensemble des 8 critères</h2>

      <p>Les 8 critères sont regroupés en trois couches :</p>

      <ul>
        <li><strong>Couche technique</strong> (ce que les IA peuvent lire) : Extractibilité, Crawlabilité IA</li>
        <li><strong>Couche sémantique</strong> (ce que les IA comprennent) : Données structurées, Fraîcheur</li>
        <li><strong>Couche de confiance</strong> (ce que les IA valorisent) : Vérifiabilité, Autorité E-E-A-T, Neutralité éditoriale, Présence externe</li>
      </ul>

      <p>Chaque critère est noté de 0 à 100. Le score global est une moyenne pondérée. Les pondérations reflètent l'impact empirique de chaque critère sur la probabilité d'être cité.</p>

      <h2>Les 8 critères en détail</h2>

      <CritereCard numero={1} nom="Extractibilité" poids="Pondération : 20%" couleur="#10A37F">
        <p><strong>Ce que c'est :</strong> La capacité des IA à extraire facilement des informations factuelles de votre contenu.</p>
        <p><strong>Comment c'est mesuré :</strong> Analyse de la structure du contenu — présence de titres clairs (H1, H2, H3), de listes à puces, de données chiffrées, de définitions explicites. On mesure la densité informationnelle et la clarté de l'organisation.</p>
        <p><strong>Pourquoi ça compte :</strong> Les LLM fonctionnent par extraction de patterns. Un texte dense et mal structuré sera paraphrasé de façon approximative ou ignoré. Un contenu avec des faits clairement présentés sera cité littéralement.</p>
        <p><strong>Comment améliorer :</strong></p>
        <ul>
          <li>Structurer le contenu avec des titres hiérarchiques (H2 pour les sections, H3 pour les sous-points)</li>
          <li>Transformer les paragraphes denses en listes à puces quand c'est possible</li>
          <li>Inclure des données chiffrées précises (pas "beaucoup" mais "72%")</li>
          <li>Utiliser des encadrés récapitulatifs à la fin de chaque section</li>
        </ul>
      </CritereCard>

      <CritereCard numero={2} nom="Vérifiabilité" poids="Pondération : 15%" couleur="#4285F4">
        <p><strong>Ce que c'est :</strong> La mesure dans laquelle vos affirmations peuvent être vérifiées par l'IA ou ses utilisateurs.</p>
        <p><strong>Comment c'est mesuré :</strong> Présence de sources citées (liens externes vers des études, données officielles), de dates sur les informations, d'auteurs identifiés, de méthodologies expliquées. On vérifie aussi que les liens sortants pointent vers des sources reconnues.</p>
        <p><strong>Pourquoi ça compte :</strong> Les LLM sont entraînés à valoriser les informations vérifiables. Une affirmation sans source est perçue comme moins fiable qu'une affirmation sourçable. Citer des études, c'est augmenter la probabilité que l'IA reprenne votre formulation.</p>
        <p><strong>Comment améliorer :</strong></p>
        <ul>
          <li>Citer les études et rapports que vous mentionnez (lien + auteur + année)</li>
          <li>Dater clairement vos contenus ("dernière mise à jour : mars 2026")</li>
          <li>Mentionner les sources primaires pour les statistiques</li>
          <li>Éviter les affirmations non sourcées ("les experts s'accordent à dire que...")</li>
        </ul>
      </CritereCard>

      <CritereCard numero={3} nom="Autorité E-E-A-T" poids="Pondération : 20%" couleur="#D97757">
        <p><strong>Ce que c'est :</strong> L'Expérience, l'Expertise, l'Autorité et la Fiabilité (Trust) du site et de ses auteurs — le cadre de Google repris par les LLM.</p>
        <p><strong>Comment c'est mesuré :</strong> Présence d'une page "À propos" détaillée, biographies d'auteurs avec credentials, mentions de partenaires/clients/certifications, page de contact accessible, politique de confidentialité, liens entrants de qualité.</p>
        <p><strong>Pourquoi ça compte :</strong> Les IA citent des sources fiables. Un site sans auteur identifié, sans page "À propos", sans signaux de légitimité sera systématiquement sous-pondéré face à un concurrent qui en a.</p>
        <p><strong>Comment améliorer :</strong></p>
        <ul>
          <li>Créer une page "À propos" avec l'histoire de l'entreprise et les credentials</li>
          <li>Ajouter des biographies d'auteurs sur chaque article (nom, poste, expertise)</li>
          <li>Mentionner les partenaires, certifications ou clients reconnus</li>
          <li>S'assurer que la page de contact et les CGU sont facilement accessibles</li>
        </ul>
      </CritereCard>

      <CritereCard numero={4} nom="Crawlabilité IA" poids="Pondération : 15%" couleur="#1C7DC4">
        <p><strong>Ce que c'est :</strong> La capacité des robots des IA à accéder et lire votre site.</p>
        <p><strong>Comment c'est mesuré :</strong> Analyse du robots.txt pour les user-agents IA (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Googlebot-Extended), présence éventuelle d'un llms.txt, vitesse de chargement, accessibilité des pages importantes.</p>
        <p><strong>Pourquoi ça compte :</strong> Un site qui bloque les bots IA dans son robots.txt sera simplement ignoré. Un site lent ou avec du contenu en JavaScript non rendu sera partiellement lu. C'est un prérequis absolu.</p>
        <p><strong>Comment améliorer :</strong></p>
        <ul>
          <li>Vérifier que GPTBot, ClaudeBot et PerplexityBot ne sont pas bloqués dans robots.txt</li>
          <li>Créer un fichier llms.txt avec un résumé du site et les pages clés</li>
          <li>S'assurer que le contenu important est dans le HTML rendu (pas uniquement en JS client-side)</li>
          <li>Maintenir un sitemap XML à jour</li>
        </ul>
      </CritereCard>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Guide technique complet : robots.txt et llms.txt pour les bots IA →</ArrowLink>

      <CritereCard numero={5} nom="Données structurées" poids="Pondération : 15%" couleur="#9B59B6">
        <p><strong>Ce que c'est :</strong> La présence et la qualité du balisage Schema.org en JSON-LD sur les pages clés.</p>
        <p><strong>Comment c'est mesuré :</strong> Détection et validation des schemas JSON-LD (Organization, WebSite, Article, FAQPage, Product, BreadcrumbList, LocalBusiness). On vérifie la présence, la complétude et la cohérence avec le contenu de la page.</p>
        <p><strong>Pourquoi ça compte :</strong> Les schemas JSON-LD sont conçus exactement pour que les machines comprennent le contenu sans ambiguïté. Un schema FAQPage bien rempli sera extrait directement par les LLM pour répondre aux questions des utilisateurs.</p>
        <p><strong>Comment améliorer :</strong></p>
        <ul>
          <li>Ajouter Organization sur la homepage</li>
          <li>Ajouter Article sur chaque article de blog</li>
          <li>Ajouter FAQPage sur les pages qui contiennent des questions/réponses</li>
          <li>Valider avec l'outil de test de Google Rich Results</li>
        </ul>
      </CritereCard>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA : les 5 schemas prioritaires pour le GEO →</ArrowLink>

      <CritereCard numero={6} nom="Neutralité éditoriale" poids="Pondération : 10%" couleur="#E67E22">
        <p><strong>Ce que c'est :</strong> La capacité de votre contenu à informer objectivement, sans sur-promotion commerciale.</p>
        <p><strong>Comment c'est mesuré :</strong> Analyse du langage — densité de superlatifs ("meilleur", "révolutionnaire", "incroyable"), présence d'arguments pour/contre, mentions honnêtes des limites du produit/service, ton informatif vs persuasif.</p>
        <p><strong>Pourquoi ça compte :</strong> Les IA évitent de citer du contenu perçu comme du marketing. Elles privilégient les sources qui ressemblent à des encyclopédies ou des guides experts. Un article qui présente des nuances et reconnaît des limites est plus crédible qu'un article uniquement positif.</p>
        <p><strong>Comment améliorer :</strong></p>
        <ul>
          <li>Remplacer les superlatifs par des faits mesurables</li>
          <li>Inclure des sections "limites" ou "à qui ce produit/service ne convient pas"</li>
          <li>Présenter les alternatives existantes quand c'est pertinent</li>
          <li>Éviter les formulations comme "la meilleure solution du marché"</li>
        </ul>
      </CritereCard>

      <CritereCard numero={7} nom="Présence externe" poids="Pondération : 10%" couleur="#27AE60">
        <p><strong>Ce que c'est :</strong> Les mentions et citations de votre marque/site sur d'autres plateformes.</p>
        <p><strong>Comment c'est mesuré :</strong> Détection de backlinks de qualité, mentions sur des plateformes tierces (LinkedIn, forums spécialisés, publications sectorielles), présence sur Wikipedia ou des annuaires reconnus, citations dans d'autres articles.</p>
        <p><strong>Pourquoi ça compte :</strong> Les LLM ont été entraînés sur un corpus Web large. Si votre marque est mentionnée dans de nombreuses sources indépendantes, l'IA la connaît et lui fait confiance. La présence externe est un proxy de la notoriété perçue.</p>
        <p><strong>Comment améliorer :</strong></p>
        <ul>
          <li>Publier des études ou données originales qui seront citées par d'autres</li>
          <li>Contribuer à des publications sectorielles (articles invités, interviews)</li>
          <li>Être présent sur les annuaires pertinents de votre secteur</li>
          <li>Encourager les témoignages et avis sur des plateformes tierces</li>
        </ul>
      </CritereCard>

      <CritereCard numero={8} nom="Fraîcheur" poids="Pondération : 5%" couleur="#6B6762">
        <p><strong>Ce que c'est :</strong> La récence et la régularité de mise à jour du contenu.</p>
        <p><strong>Comment c'est mesuré :</strong> Date de publication et de modification des pages, fréquence de publication de nouveaux contenus, présence de la date dans le balisage Schema.org et dans le HTML visible.</p>
        <p><strong>Pourquoi ça compte :</strong> Les IA préfèrent les informations récentes pour les sujets évolutifs. Un article de 2021 sur les IA sera moins cité qu'un article de 2026, même si le contenu est similaire. La fraîcheur a moins d'importance pour les sujets stables (mathématiques, histoire) que pour les sujets technologiques.</p>
        <p><strong>Comment améliorer :</strong></p>
        <ul>
          <li>Mettre à jour les articles existants régulièrement (et l'indiquer avec une date de mise à jour)</li>
          <li>Publier de nouveaux contenus au moins une fois par mois</li>
          <li>Inclure la date dans le schema Article (datePublished + dateModified)</li>
          <li>Mentionner l'année dans les titres pour les sujets actualisables</li>
        </ul>
      </CritereCard>

      <h2>Comment les critères s'additionnent</h2>

      <p>Le score global est une moyenne pondérée. Mais il y a une subtilité importante : les critères techniques (Extractibilité, Crawlabilité) agissent comme des <strong>prérequis</strong>. Un site bloquant les bots IA dans son robots.txt aura un score Crawlabilité de 0, ce qui plafonne mécaniquement son score global — peu importe la qualité de son contenu.</p>

      <p>L'ordre d'optimisation recommandé :</p>

      <ol>
        <li><strong>Débloquer les bots IA</strong> (Crawlabilité) — prérequis absolu</li>
        <li><strong>Structurer le contenu</strong> (Extractibilité) — impact immédiat le plus fort</li>
        <li><strong>Ajouter les schemas prioritaires</strong> (Données structurées) — quick win technique</li>
        <li><strong>Renforcer l'autorité</strong> (E-E-A-T) — investissement moyen terme</li>
        <li><strong>Sourcer les affirmations</strong> (Vérifiabilité) — amélioration continue</li>
        <li><strong>Ajuster le ton</strong> (Neutralité) — relecture et reformulation</li>
        <li><strong>Développer la présence externe</strong> — travail de fond</li>
        <li><strong>Maintenir la fraîcheur</strong> — discipline éditoriale</li>
      </ol>

      <h2>Ce que le score ne mesure pas</h2>

      <p>Le score GEO Detekia mesure la citabilité potentielle. Il ne mesure pas :</p>

      <ul>
        <li><strong>Si vous êtes déjà cité</strong> — pour ça, il faut tester directement dans ChatGPT, Perplexity, etc.</li>
        <li><strong>La qualité du fond</strong> — un article factuellement faux mais bien structuré peut avoir un bon score technique</li>
        <li><strong>Le volume des sujets couverts</strong> — un site avec un seul article excellent vs un site avec 50 articles moyens</li>
        <li><strong>La popularité de la requête</strong> — être citable sur un sujet que personne ne recherche n'apporte pas de trafic</li>
      </ul>

      <p>C'est pourquoi le score GEO s'interprète comme un <strong>potentiel de citabilité</strong>, pas comme une garantie. La stratégie complète combine l'optimisation technique (score GEO) avec la stratégie éditoriale (sujets à couvrir) et la distribution (présence externe).</p>

      <ArrowLink href="/">Analysez votre score GEO gratuitement →</ArrowLink>

      <h2>Questions fréquentes sur la méthodologie</h2>

      <h3>Le score GEO est-il valable pour tous les types de sites ?</h3>

      <p>La méthodologie a été conçue pour les sites B2B et B2C avec du contenu éditorial (blogs, guides, fiches produits). Elle est moins pertinente pour les applications web pures (SaaS sans contenu public) ou les sites très techniques sans audience grand public.</p>

      <h3>À quelle fréquence faut-il réévaluer son score ?</h3>

      <p>Après chaque optimisation significative (refonte technique, nouveaux articles, mise à jour de schemas), et au minimum une fois par trimestre. Les algorithmes des LLM évoluent, et ce qui est optimal aujourd'hui peut changer.</p>

      <h3>Le score GEO remplace-t-il le score SEO ?</h3>

      <p>Non — les deux scores mesurent des choses complémentaires. Un bon score SEO (autorité de domaine, backlinks, positions sur Google) contribue au score GEO (présence externe, vérifiabilité). Mais des pages très bien positionnées sur Google peuvent avoir un mauvais score GEO si le contenu n'est pas extractible par les IA.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : les différences clés et comment les combiner →</ArrowLink>
    </>
  );
}
