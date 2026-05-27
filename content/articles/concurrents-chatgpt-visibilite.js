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

export default function ConcurrentsChattgptVisibilite() {
  return (
    <>
      <p>Vous avez demandé à ChatGPT une recommandation dans votre secteur. Le nom de votre concurrent est apparu. Pas le vôtre. C'est frustrant — et c'est surtout un signal d'alarme business.</p>

      <p>Quand une IA recommande un concurrent à un prospect qui cherche votre type de service, ce prospect ne visitera probablement jamais votre site. Il fait confiance à l'IA, clique sur le lien du concurrent, et achète. Un visiteur référé par une IA convertit 4,4 fois mieux qu'un visiteur organique classique. Chaque recommandation que vous manquez est une vente perdue.</p>

      <p>Mais cette situation n'est pas une fatalité. Vos concurrents ne sont pas cités parce qu'ils sont "meilleurs" — ils sont cités parce que leur contenu est mieux structuré pour les IA. Et ça, ça se corrige.</p>

      <h2>Pourquoi l'IA cite votre concurrent et pas vous</h2>

      <p>Les IA ne citent pas les marques qu'elles "préfèrent". Elles citent les sources dont le contenu remplit le mieux leurs <InternalLink href="/blog/comment-chatgpt-choisit-ses-sources">critères de sélection</InternalLink>. Comprendre pourquoi votre concurrent est cité est la première étape pour le détrôner.</p>

      <h3>Il répond directement aux questions</h3>

      <p>Votre concurrent a probablement un site qui commence par répondre aux questions que les clients se posent, au lieu de parler de lui-même.</p>

      <p>Comparez les premières phrases de vos sites respectifs. Si le sien dit "Un CRM est un outil de gestion de la relation client qui permet de..." et que le vôtre dit "Bienvenue chez [entreprise], nous accompagnons les entreprises depuis 15 ans...", l'IA n'a qu'un seul choix.</p>

      <h3>Il a du contenu structuré</h3>

      <p>FAQ, guides d'achat, comparatifs, articles de blog avec des sous-titres descriptifs — votre concurrent a peut-être investi dans du contenu informatif que les IA peuvent facilement parser et extraire.</p>

      <h3>Il n'a pas bloqué les bots IA</h3>

      <p>Votre concurrent a peut-être simplement un robots.txt qui autorise GPTBot, ClaudeBot et PerplexityBot. Si le vôtre les bloque (souvent sans le savoir), vous êtes invisible par design.</p>

      <h3>Il est mentionné ailleurs sur le web</h3>

      <p>Si votre concurrent est actif sur Reddit, cité dans des articles de presse, présent sur des annuaires — les IA croisent ces mentions et renforcent sa crédibilité. Votre site peut être excellent, mais s'il n'existe que sur son propre domaine, l'IA n'a pas de confirmation externe de sa fiabilité.</p>

      <h3>Il a des données structurées</h3>

      <p>Un schema Organization complet, des schemas Article avec auteur identifié, un FAQPage balisé — ces signaux aident les IA à comprendre qui il est et ce qu'il propose. Sans eux, l'IA doit deviner.</p>

      <h2>L'analyse concurrentielle GEO — méthode en 4 étapes</h2>

      <h3>Étape 1 — Identifier vos concurrents GEO</h3>

      <p>Vos concurrents GEO ne sont pas forcément vos concurrents business habituels. Posez à ChatGPT, Gemini et Perplexity ces questions :</p>
      <ul>
        <li>"Quel est le meilleur [votre service] en France ?"</li>
        <li>"Recommande-moi un [votre type de produit] pour [besoin de vos clients]"</li>
        <li>"Comment choisir un [votre domaine] ?"</li>
      </ul>

      <p>Notez tous les noms cités. Ce sont vos concurrents GEO — ceux qui captent les recommandations IA à votre place.</p>

      <p>Vous pourriez être surpris : certains concurrents GEO sont des blogs spécialisés, des comparateurs ou des forums — pas des entreprises concurrentes au sens classique.</p>

      <h3>Étape 2 — Auditer leurs sites</h3>

      <p>Pour chaque concurrent GEO identifié, lancez un <InternalLink href="/blog/audit-geo-visibilite-ia">audit</InternalLink> sur Detekia. Comparez leur <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">score global</InternalLink> et leurs scores par critère avec les vôtres.</p>

      <p>Cherchez les écarts significatifs :</p>
      <ul>
        <li>Leur citabilité est à 20/25 et la vôtre à 8/25 ? C'est probablement le facteur déterminant.</li>
        <li>Leur score données structurées est à 9/10 et le vôtre à 0/10 ? Vous avez un quick win évident.</li>
        <li>Leur neutralité est à 9/10 et la vôtre à 3/10 ? Votre ton est trop commercial.</li>
      </ul>

      <h3>Étape 3 — Analyser leur contenu manuellement</h3>

      <p>Au-delà du score automatisé, visitez leurs sites et analysez :</p>
      <ul>
        <li><strong>Leur homepage</strong> — commence-t-elle par une réponse directe à ce qu'ils font ? Ou par une formule commerciale ?</li>
        <li><strong>Leur blog</strong> — ont-ils des articles de fond sur les questions que vos clients se posent ? Sont-ils bien structurés (H2 descriptifs, listes, données chiffrées) ?</li>
        <li><strong>Leurs FAQ</strong> — ont-ils une section FAQ riche et balisée en Schema FAQPage ?</li>
        <li><strong>Leur robots.txt</strong> — allez sur <code>concurrent.fr/robots.txt</code>. GPTBot est-il autorisé ?</li>
        <li><strong>Leurs données structurées</strong> — testez leur URL sur le Rich Results Test de Google. Quels schemas ont-ils implémentés ?</li>
      </ul>

      <h3>Étape 4 — Identifier vos quick wins</h3>

      <p>Croisez votre audit et l'analyse concurrentielle. Les critères où votre concurrent vous dépasse significativement ET qui sont rapides à corriger sont vos quick wins.</p>

      <p>Typiquement, les quick wins les plus courants :</p>
      <ul>
        <li>Débloquer les crawlers IA — si votre robots.txt les bloque, c'est 15 minutes de travail pour un impact majeur</li>
        <li>Ajouter des données structurées — Organization + FAQPage en quelques heures</li>
        <li>Réécrire vos introductions — rendre les 100 premiers mots extractibles</li>
      </ul>

      <ArrowLink href="/blog/audit-geo-visibilite-ia">Audit GEO : analyser votre visibilité IA étape par étape →</ArrowLink>

      <h2>Le plan de reconquête en 30 jours</h2>

      <h3>Semaine 1 — Les corrections techniques (impact : 2-4 semaines)</h3>

      <p><strong>Jour 1-2 : Accessibilité IA</strong><br />
      Vérifiez et corrigez votre robots.txt. Créez un fichier llms.txt. Vérifiez votre sitemap. Ces corrections sont les plus rapides et leur impact est le plus immédiat.</p>

      <p><strong>Jour 3-4 : Données structurées</strong><br />
      Implémentez Organization (homepage), Article (blog), FAQPage (FAQ). Testez avec le Rich Results Test. Si votre concurrent a ces schemas et pas vous, c'est probablement un des facteurs principaux de l'écart.</p>

      <p><strong>Jour 5 : Audit de référence</strong><br />
      Lancez un audit Detekia sur votre site et sur celui de votre concurrent. Documentez les scores. C'est votre baseline pour mesurer la progression.</p>

      <h3>Semaine 2 — L'citabilité (impact : 4-8 semaines)</h3>

      <p><strong>Jour 6-8 : Réécrire les introductions</strong><br />
      Prenez vos 10 pages les plus importantes. Pour chacune, réécrivez les 100 premiers mots pour qu'ils contiennent une réponse directe à la question implicite de la page.</p>

      <p>Méthode : pour chaque page, demandez-vous "Quelle question un utilisateur poserait à ChatGPT pour arriver sur cette page ?" Puis répondez à cette question dès le premier paragraphe.</p>

      <p><strong>Jour 9-10 : Ajouter des FAQ</strong><br />
      Sur vos pages clés (produit, service, homepage), ajoutez une section FAQ avec 5-7 questions que vos clients posent réellement. Balisez-la en Schema FAQPage.</p>

      <p>Les FAQ sont le format le plus naturellement extractible par les IA. Si votre concurrent en a et pas vous, c'est un handicap majeur.</p>

      <h3>Semaine 3 — La crédibilité (impact : 4-12 semaines)</h3>

      <p><strong>Jour 11-13 : Sourcer les affirmations</strong><br />
      Parcourez vos pages clés. Chaque affirmation importante doit être accompagnée d'une preuve : chiffre, source, exemple, date. Remplacez le vague par le précis.</p>

      <p><strong>Jour 14-15 : Page À propos</strong><br />
      Créez ou complétez votre page À propos : photo du fondateur, parcours, expertise, coordonnées. Si votre concurrent a une page À propos crédible et que vous avez un texte générique "Notre équipe passionnée", l'écart d'autorité est évident.</p>

      <h3>Semaine 4 — La présence externe (impact : 8-12 semaines)</h3>

      <p><strong>Jour 16-20 : Reddit</strong><br />
      Créez un profil Reddit. Identifiez 5 subreddits pertinents. Commencez à répondre à des questions avec expertise. 3-5 réponses utiles par semaine.</p>

      <p><strong>Jour 21-25 : Autres sources</strong><br />
      Complétez votre Google Business Profile. Proposez un article invité à un média sectoriel. Inscrivez-vous sur les annuaires professionnels de votre secteur.</p>

      <p><strong>Jour 26-30 : Mesure</strong><br />
      Relancez l'audit Detekia. Refaites le test de citation sur ChatGPT, Gemini, Perplexity. Comparez avec votre baseline.</p>

      <ArrowLink href="/blog/reddit-geo-source-ia">Reddit et GEO : pourquoi Reddit est la source n°1 citée par les IA →</ArrowLink>

      <h2>Les pièges à éviter</h2>

      <p><strong>Piège 1 — Copier le contenu du concurrent.</strong> Si votre concurrent est cité parce qu'il a un excellent guide d'achat, ne copiez pas son guide. Créez un contenu qui couvre le même sujet mais avec votre angle, vos données, votre expertise. Les IA détectent les contenus dupliqués et les déprioritisent.</p>

      <p><strong>Piège 2 — Ignorer le SEO au profit du GEO.</strong> Les AI Overviews de Google citent des sources du top 10 organique. Si vous n'êtes pas bien classé en SEO, vous ne serez pas considéré pour les AI Overviews — même avec un site parfaitement optimisé GEO. Le SEO reste la fondation.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : quelles différences en 2026 →</ArrowLink>

      <p><strong>Piège 3 — Vouloir tout faire en même temps.</strong> Le plan en 30 jours est séquencé pour une raison : les corrections techniques (semaine 1) prennent effet en 2-4 semaines, l'citabilité (semaine 2) en 4-8 semaines, la crédibilité et la présence externe (semaines 3-4) en 8-12 semaines. Respectez cette séquence pour voir des progrès mesurables à chaque étape.</p>

      <p><strong>Piège 4 — Mesurer trop tôt.</strong> Ne refaites pas le test de citation après 3 jours en espérant des changements. Les corrections techniques mettent 2-4 semaines à être prises en compte par les crawlers IA. Les améliorations de contenu, 4-8 semaines. Mesurez à J+30, pas avant.</p>

      <p><strong>Piège 5 — Négliger la qualité au profit de la quantité.</strong> Publier 20 articles médiocres ne vous aidera pas. Un seul article exhaustif, bien structuré, sourcé et régulièrement mis à jour a plus de poids GEO que 20 articles courts et superficiels. Les IA privilégient la profondeur sur le volume.</p>

      <h2>Questions fréquentes</h2>

      <h3>Mon concurrent est une grosse entreprise avec beaucoup plus de budget. Ai-je une chance ?</h3>

      <p>Oui. Les IA ne citent pas les plus gros budgets — elles citent les contenus les mieux structurés. Un site de 10 pages parfaitement optimisé GEO peut être cité devant un site corporate de 500 pages mal structuré. L'avantage des petites structures : la rapidité d'exécution. Vous pouvez corriger votre robots.txt, ajouter Schema.org et réécrire vos intros en une semaine. Une grande entreprise prendra 3 mois.</p>

      <h3>Les IA vont-elles toujours citer les mêmes concurrents ?</h3>

      <p>Non. Contrairement aux positions Google qui sont relativement stables, les citations IA changent régulièrement. Les IA recrawlent et réévaluent les sources en continu. Un site qui s'améliore peut prendre la place d'un concurrent en quelques semaines. C'est aussi le risque : si vous êtes cité aujourd'hui mais que vous ne maintenez pas votre site, un concurrent optimisé peut vous remplacer.</p>

      <h3>Dois-je analyser tous mes concurrents ou seulement les plus cités ?</h3>

      <p>Concentrez-vous sur les 3-5 concurrents les plus fréquemment cités par les IA. Ce sont vos "concurrents GEO directs". Analysez en profondeur ce qui les différencie de vous plutôt que de survoler 15 concurrents.</p>

      <h3>Mon concurrent a un blog actif et pas moi. Est-ce la seule raison ?</h3>

      <p>C'est souvent un facteur important, mais rarement le seul. Un blog actif fournit du contenu extractible et frais — deux critères GEO majeurs. Mais les corrections techniques (robots.txt, Schema.org) et la réécriture des pages existantes peuvent avoir un impact comparable sans créer un blog. Commencez par optimiser ce que vous avez avant de créer du nouveau contenu.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour être cité par les IA en 2026</ArrowLink>
      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et JSON-LD : le guide complet pour la visibilité IA</ArrowLink>
      <ArrowLink href="/">Mesurez l'écart avec vos concurrents — audit GEO gratuit sur Detekia →</ArrowLink>
      <InlineCTA href="/">Votre site est-il visible pour les IA ? Testez gratuitement.</InlineCTA>
    </>
  );
}
