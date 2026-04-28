import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
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

function InternalLink({ href, children }) {
  return (
    <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}
      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
    >{children}</Link>
  );
}

export default function SaasB2bChatgptRecommandations() {
  return (
    <>
      <p>Quand un directeur technique cherche un outil de monitoring, il ne tape plus "meilleur outil monitoring SaaS" dans Google. Il demande à ChatGPT : "Quel outil de monitoring me recommandes-tu pour une startup de 50 personnes avec une stack AWS ?"</p>

      <p>Et ChatGPT ne répond pas avec 10 liens bleus. Il recommande 3 à 5 produits par leur nom, avec les forces de chacun, les cas d'usage adaptés, et parfois une estimation de prix. C'est un acte de prescription directe, pas de la recherche documentaire.</p>

      <p>Le problème : <strong>90 % des SaaS B2B ne sont pas optimisés pour être cités dans ces réponses</strong>. Leur site est construit pour Google, pas pour les LLM. Résultat : ils sont invisibles dans le canal d'acquisition qui croît le plus vite — le trafic référé par les IA a augmenté de <strong>527 %</strong> entre janvier et mai 2025 (source : <a href="https://previsible.io/blog/ai-referral-traffic" target="_blank" rel="noopener noreferrer">Previsible, 2025</a>).</p>

      <p>Ce guide explique comment positionner votre SaaS B2B pour être recommandé par ChatGPT, Gemini et Perplexity à vos prospects.</p>

      <h2>Pourquoi les acheteurs B2B migrent vers ChatGPT</h2>

      <p>Le shift est mesurable. Selon <a href="https://www.gartner.com/en/articles/understand-and-exploit-gen-ai-s-impact-on-b2b-buying" target="_blank" rel="noopener noreferrer">Gartner (2025)</a>, 72 % des acheteurs B2B considèrent les outils d'IA générative comme une source fiable pour la recherche de solutions logicielles. Ce n'est pas un signal faible.</p>

      <p><strong>Le parcours d'achat B2B se raccourcit.</strong> Un acheteur qui demande à ChatGPT "quel CRM pour une équipe sales de 20 personnes, intégré à HubSpot et Slack" obtient une shortlist de 4 outils en 15 secondes. Pas besoin de lire 6 articles comparatifs, 3 reviews G2, et 2 threads Reddit. L'IA fait la synthèse.</p>

      <p><strong>La confiance est élevée.</strong> 60 % des utilisateurs de ChatGPT déclarent faire confiance aux recommandations de produits de l'IA (source : <a href="https://www.pewresearch.org/" target="_blank" rel="noopener noreferrer">Pew Research, 2026</a>). En B2B, où les décisions sont rationnelles et documentées, une recommandation structurée avec les forces et limites de chaque outil a plus de poids qu'un slogan marketing.</p>

      <p><strong>Les visiteurs IA convertissent mieux.</strong> Un visiteur référé par une IA convertit <strong>4,4 fois mieux</strong> qu'un visiteur organique classique (source : <a href="https://www.semrush.com/" target="_blank" rel="noopener noreferrer">Semrush, 2025</a>). Logique : il arrive sur votre site déjà convaincu que votre produit correspond à son besoin. Il ne compare plus — il évalue.</p>

      <h2>Comment ChatGPT choisit les SaaS B2B qu'il recommande</h2>

      <p>ChatGPT ne pioche pas au hasard. Il s'appuie sur un ensemble de signaux pour décider quels produits citer. Comprendre ces signaux, c'est comprendre comment être sélectionné.</p>

      <ArrowLink href="/blog/comment-chatgpt-choisit-ses-sources">Comment ChatGPT choisit ses sources : le guide complet →</ArrowLink>

      <h3>La présence sur les plateformes de reviews</h3>

      <p>G2, Capterra, Trustpilot, Product Hunt : ces plateformes sont massivement représentées dans les données d'entraînement des LLM. Un SaaS avec 200+ avis sur G2 et une note de 4,5/5 a un avantage structurel sur un concurrent sans profil. Les IA pondèrent fortement le volume et la diversité des avis tiers.</p>

      <h3>La documentation publique</h3>

      <p>Une documentation technique complète, indexable, et structurée est un signal d'autorité massif. Les IA y trouvent des réponses factuelles : quelles intégrations sont disponibles, quelles sont les limites du produit, comment fonctionne l'API. <strong>Un SaaS B2B sans docs publiques est presque invisible pour les LLM.</strong></p>

      <h3>Le pricing transparent</h3>

      <p>Le "Contactez-nous pour un devis" est un anti-pattern GEO. Quand un utilisateur demande "quel outil d'emailing pour 10 000 contacts à moins de 100 €/mois", l'IA ne peut pas recommander un SaaS dont le prix est caché. Afficher un pricing clair permet d'être cité dans les requêtes à filtre budgétaire — qui représentent une part croissante des requêtes B2B.</p>

      <h3>Les cas clients structurés</h3>

      <p>Un cas client n'est pas une page "Nos clients nous font confiance" avec des logos. C'est un contenu structuré qui dit : <em>Qui</em> (industrie, taille), <em>Quel problème</em>, <em>Quelle solution</em>, <em>Quels résultats chiffrés</em>. Ce format est directement citable par les IA quand un prospect pose une question contextuelle ("quel outil pour une fintech de 200 personnes").</p>

      <h3>Les mentions éditoriales</h3>

      <p>Articles de presse, podcasts, analyses d'experts, newsletters sectorielles : 90 % des citations IA proviennent de médias earned et owned, pas de placements payants (source : <a href="https://www.edelman.com/" target="_blank" rel="noopener noreferrer">Edelman, 2026</a>). Les IA priorisent les mentions dans des contextes éditoriaux indépendants.</p>

      <h2>Les biais des LLM en SaaS B2B</h2>

      <p>Avant de passer aux tactiques d'optimisation, il faut comprendre les biais systémiques des LLM qui affectent la visibilité des SaaS.</p>

      <h3>Le biais anglophone</h3>

      <p>Les données d'entraînement des LLM sont majoritairement en anglais. Un SaaS français avec un site uniquement en français part avec un handicap structurel : ChatGPT aura vu beaucoup plus de contenu sur ses concurrents anglophones. La solution minimale : une version anglaise du site, de la documentation, et des cas clients.</p>

      <h3>Le biais d'écosystème</h3>

      <p>Les LLM connaissent mieux les SaaS intégrés dans des écosystèmes établis (Salesforce, HubSpot, AWS, Shopify). Un outil standalone sans intégrations connues sera moins cité, car les IA ont moins de contexte croisé à son sujet. Documenter vos intégrations est un levier direct de visibilité.</p>

      <h3>Le biais de notoriété</h3>

      <p>Les LLM sur-représentent les leaders de marché. Si vous êtes un nouvel entrant ou un acteur de niche, vous devez compenser par la qualité du contenu éducatif et la spécificité de votre positionnement. "Le meilleur CRM" vous oppose à Salesforce. "Le CRM conçu pour les cabinets d'architecture" vous donne une niche que les IA peuvent citer.</p>

      <h2>7 leviers concrets pour être recommandé</h2>

      <p>Voici les actions concrètes pour augmenter la probabilité que votre SaaS soit cité par les IA dans les requêtes de vos prospects.</p>

      <h3>1. Créer une page de positionnement citable</h3>

      <p>Votre page d'accueil est probablement optimisée pour convertir, pas pour être citée. Créez une page dédiée (ou enrichissez votre page "About") qui répond factuellement aux questions que les IA se posent :</p>

      <ul>
        <li>Quelle catégorie de produit (CRM, monitoring, facturation, etc.)</li>
        <li>Pour quelle cible (taille d'entreprise, secteur, cas d'usage)</li>
        <li>Quels différenciants factuels (pas "leader innovant", mais "seul outil avec intégration native Notion + Linear")</li>
        <li>Quel pricing (fourchettes au minimum)</li>
        <li>Quelles alternatives existent et pourquoi vous êtes pertinent pour votre cible</li>
      </ul>

      <p>Ce contenu factuel est exactement ce que les LLM extraient pour formuler une recommandation.</p>

      <h3>2. Structurer vos cas clients pour les LLM</h3>

      <p>Transformez vos cas clients en contenus structurés que les IA peuvent parser :</p>

      <pre><code>{`{
  "@type": "Article",
  "headline": "Comment Qonto a réduit ses tickets support de 40%",
  "about": {
    "@type": "SoftwareApplication",
    "name": "VotreOutil",
    "applicationCategory": "BusinessApplication"
  },
  "description": "Fintech, 200 employés. Problème : surcharge support.
Solution : automatisation avec VotreOutil. Résultat : -40% tickets en 3 mois."
}`}</code></pre>

      <p>Chaque cas client doit contenir : secteur, taille, problème, solution, résultat chiffré. Sans ces éléments, le contenu n'est pas citable.</p>

      <h3>3. Publier des comparatifs honnêtes</h3>

      <p>Les pages "VotreOutil vs Concurrent" sont parmi les contenus les plus cités par les IA en B2B, à condition d'être honnêtes. Un comparatif crédible inclut :</p>

      <ul>
        <li>Les forces réelles du concurrent (pas un homme de paille)</li>
        <li>Les cas d'usage où le concurrent est meilleur</li>
        <li>Les critères objectifs : prix, fonctionnalités, intégrations, support</li>
        <li>Un verdict nuancé : "Si votre priorité est X, choisissez A. Si c'est Y, nous sommes mieux adaptés."</li>
      </ul>

      <p>Ce positionnement honnête renforce votre <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">neutralité éditoriale</InternalLink> — un des 8 critères GEO que les IA évaluent.</p>

      <h3>4. Rendre votre documentation indexable</h3>

      <p>Si votre documentation est derrière un login, dans un sous-domaine séparé non crawlable, ou rendue en JavaScript côté client, les IA ne la voient pas. Actions :</p>

      <ul>
        <li>Héberger les docs sur un sous-domaine indexable (docs.votreoutil.com)</li>
        <li>Autoriser GPTBot et ClaudeBot dans le <code>robots.txt</code></li>
        <li>Créer un fichier <code>llms.txt</code> à la racine qui résume votre documentation</li>
        <li>S'assurer du rendu HTML côté serveur (pas de SPA full-JS)</li>
      </ul>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Guide complet : robots.txt et llms.txt pour les bots IA →</ArrowLink>

      <h3>5. Produire du contenu éducatif dans votre niche</h3>

      <p>Le contenu marketing ("Pourquoi VotreOutil est le meilleur") n'est pas cité par les IA. Le contenu éducatif ("Comment automatiser le reporting financier en 2026") l'est. Pourquoi ? Parce que les IA cherchent des réponses à des questions, pas des publicités.</p>

      <p>Publiez des guides pratiques, des benchmarks, des méthodologies. Chaque article éducatif est un point d'entrée potentiel dans les réponses IA. Et si votre produit est mentionné naturellement comme solution dans ce contenu, il sera cité avec lui.</p>

      <InlineCTA href="/">Votre SaaS est-il visible pour les IA ? Vérifiez en 30 secondes.</InlineCTA>

      <h3>6. Investir les plateformes de discussion</h3>

      <p>Reddit est la source n°1 pour Perplexity (6,6 % des citations) et n°2 pour ChatGPT (source : <a href="https://www.profound.com/" target="_blank" rel="noopener noreferrer">Profound, 2025</a>). Les discussions authentiques sur r/SaaS, r/startups, Hacker News, IndieHackers alimentent directement les réponses IA.</p>

      <p>Ne faites pas de promotion déguisée — contribuez réellement. Répondez aux questions techniques, partagez des retours d'expérience, participez aux comparatifs communautaires. Les IA distinguent le contenu promotionnel du contenu contributif.</p>

      <ArrowLink href="/blog/reddit-geo-source-ia">Reddit et GEO : pourquoi Reddit est la source n°1 des IA →</ArrowLink>

      <h3>7. Implémenter le Schema.org adapté aux SaaS</h3>

      <p>Le balisage Schema.org aide les IA à comprendre ce que vous êtes et ce que vous faites. Pour un SaaS B2B, les schemas essentiels :</p>

      <ul>
        <li><code>SoftwareApplication</code> avec <code>applicationCategory</code>, <code>operatingSystem</code>, <code>offers</code></li>
        <li><code>Organization</code> avec <code>founder</code>, <code>foundingDate</code>, <code>numberOfEmployees</code></li>
        <li><code>FAQPage</code> sur les pages pricing et documentation</li>
        <li><code>Review</code> et <code>AggregateRating</code> si vous affichez des avis</li>
      </ul>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Guide complet Schema.org pour la visibilité IA →</ArrowLink>

      <h2>Les 5 erreurs qui rendent un SaaS invisible</h2>

      <p>La plupart des SaaS B2B commettent au moins 3 de ces erreurs. Chacune réduit significativement leur probabilité d'être cités.</p>

      <ol>
        <li><strong>Page About creuse.</strong> "Nous sommes une équipe passionnée qui révolutionne le secteur." Aucune information citable. Pas de noms, pas de parcours, pas de chiffres. Les IA ne peuvent pas évaluer l'E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).</li>
        <li><strong>Pricing caché.</strong> "Contactez-nous" = invisible pour les requêtes à filtre prix. Or, ces requêtes sont parmi les plus intentionnistes en B2B.</li>
        <li><strong>Zéro contenu éducatif.</strong> Blog vide ou rempli d'articles corporate ("Notre participation au salon X"). Aucun point d'entrée pour les requêtes de recherche que les prospects posent aux IA.</li>
        <li><strong>Documentation fermée.</strong> Docs derrière un login, en JavaScript client-side, ou dans un PDF non indexable. Les bots IA ne peuvent pas y accéder.</li>
        <li><strong>Pas de présence sur les plateformes de reviews.</strong> Aucun profil G2, Capterra ou Product Hunt. Aucune preuve sociale que les IA peuvent vérifier.</li>
      </ol>

      <h2>Comment auditer votre visibilité IA actuelle</h2>

      <p>Avant d'optimiser, il faut mesurer. Voici le diagnostic en 3 étapes pour évaluer où se situe votre SaaS.</p>

      <h3>Le test direct</h3>

      <p>Posez à ChatGPT les requêtes que vos prospects taperaient : "Quel outil de [votre catégorie] pour [votre cible] ?" Notez : apparaissez-vous ? Quels concurrents sont cités ? Quels sont les critères mentionnés par l'IA pour justifier ses choix ?</p>

      <h3>L'audit des 8 critères GEO</h3>

      <p>Chaque page de votre site peut être évaluée sur les <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">8 critères GEO</InternalLink> qui déterminent la citabilité IA : extractibilité, vérifiabilité, autorité, crawlabilité, données structurées, neutralité, présence externe, fraîcheur.</p>

      <ArrowLink href="/blog/audit-geo-visibilite-ia">Audit GEO : comment évaluer votre visibilité IA →</ArrowLink>

      <h3>Le benchmark concurrentiel</h3>

      <p>Identifiez vos 3-5 concurrents principaux. Auditez leur score GEO et comparez avec le vôtre. Les écarts vous indiquent où concentrer vos efforts : si un concurrent est cité parce qu'il a une documentation complète et pas vous, c'est votre priorité n°1.</p>

      <ArrowLink href="/blog/concurrents-chatgpt-visibilite">Comment surveiller vos concurrents dans les réponses IA →</ArrowLink>

      <h2>Questions fréquentes sur le GEO pour les SaaS B2B</h2>

      <h3>Combien de temps faut-il pour être recommandé par ChatGPT ?</h3>
      <p>Il n'y a pas de délai garanti. Les LLM mettent à jour leurs données d'entraînement de façon irrégulière, mais ChatGPT avec navigation web et Perplexity indexent du contenu en temps quasi-réel. Les premiers résultats visibles (apparition dans les réponses) se constatent généralement entre 2 et 8 semaines après l'optimisation.</p>

      <h3>Le SEO classique est-il encore utile si on fait du GEO ?</h3>
      <p>Oui. Le SEO et le GEO sont complémentaires. 80 % des URLs citées par ChatGPT ne sont pas dans le top 100 de Google (source : <a href="https://ahrefs.com/" target="_blank" rel="noopener noreferrer">Ahrefs, 2025</a>). Cela signifie que le GEO ouvre un canal distinct, mais le SEO reste pertinent pour le trafic organique classique. La bonne nouvelle : les optimisations GEO (contenu structuré, données vérifiables, fraîcheur) améliorent aussi le SEO.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : quelles différences en 2026 →</ArrowLink>

      <h3>Faut-il avoir un blog pour être cité par les IA ?</h3>
      <p>Ce n'est pas obligatoire, mais c'est un avantage majeur. Un blog avec du contenu éducatif dans votre niche crée des points d'entrée multiples dans les réponses IA. Chaque article bien structuré est une opportunité d'être cité sur une requête spécifique. Sans blog, vous dépendez uniquement de votre page produit et des mentions externes.</p>

      <h3>Mon SaaS est en français uniquement. Est-ce un problème ?</h3>
      <p>Oui, c'est un handicap significatif mais pas rédhibitoire. Les LLM sont entraînés majoritairement sur du contenu anglophone. En français, la compétition GEO est moindre mais le volume de requêtes aussi. Solution pragmatique : gardez votre site en français pour le marché local, mais créez une version anglaise de votre documentation et de vos cas clients pour couvrir les requêtes internationales.</p>

      <h3>Les IA préfèrent-elles les SaaS avec un essai gratuit ?</h3>
      <p>Pas directement, mais un free trial ou un freemium crée plus de contenu utilisateur (avis, discussions, guides) qui alimente les IA. Un SaaS avec 10 000 utilisateurs gratuits qui en parlent sur Reddit sera plus cité qu'un SaaS enterprise-only avec 50 clients silencieux.</p>
    </>
  );
}
