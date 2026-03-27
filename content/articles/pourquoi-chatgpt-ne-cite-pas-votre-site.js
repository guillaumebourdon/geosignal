import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

export default function PourquoiChatGPTNeCitePasVotreSite() {
  return (
    <>
      <p>Vous avez tapé le nom de votre entreprise dans ChatGPT. Ou pire : vous avez demandé une recommandation dans votre secteur. Et votre site n'apparaît nulle part. Vos concurrents, si.</p>

      <p>Ce n'est pas un bug. Ce n'est pas non plus une question de budget publicitaire. Si ChatGPT, Gemini ou Perplexity ne citent pas votre site, c'est parce que votre contenu ne remplit pas les critères que ces moteurs utilisent pour sélectionner leurs sources.</p>

      <p>La bonne nouvelle : c'est corrigible. Et souvent plus rapidement qu'on ne le pense. Voici les 6 raisons les plus fréquentes — et comment les résoudre.</p>

      <h2>Le test que vous devriez faire maintenant</h2>

      <p>Avant d'aller plus loin, faites ce diagnostic en 5 minutes. Ouvrez ChatGPT, Gemini et Perplexity, puis posez-leur ces trois questions :</p>

      <ul>
        <li><strong>La question de recommandation</strong> : "Quel est le meilleur [votre service/produit] à [votre ville/en France] ?"</li>
        <li><strong>La question d'expertise</strong> : "Comment choisir un [votre service/produit] ?"</li>
        <li><strong>La question directe</strong> : "Que fait [nom de votre entreprise] ?"</li>
      </ul>

      <p>Si votre site n'apparaît dans aucune des réponses, vous avez un problème de visibilité IA. Si vos concurrents apparaissent et pas vous, le problème est urgent.</p>

      <p>Notez les noms qui reviennent dans les réponses. Ce sont vos concurrents GEO — et ils ne sont pas forcément les mêmes que vos concurrents SEO.</p>

      <h2>Raison n°1 : votre contenu n'est pas extractible</h2>

      <p>C'est la cause la plus fréquente. Les IA cherchent des réponses prêtes à citer : une phrase claire, une définition nette, un paragraphe autonome qu'elles peuvent intégrer directement dans leur réponse.</p>

      <p>Si votre site commence par "Bienvenue chez [entreprise], leader de l'innovation depuis 2005…", l'IA n'a rien à extraire. Elle passe à la source suivante.</p>

      <p><strong>Le problème typique :</strong></p>

      <ul>
        <li>Pages d'accueil 100 % commerciales sans contenu informatif</li>
        <li>Introductions longues avant d'arriver au sujet</li>
        <li>Texte vague, sans définitions ni informations concrètes</li>
        <li>Contenu centré sur "nous" au lieu de répondre aux questions des clients</li>
      </ul>

      <p><strong>Comment corriger :</strong></p>

      <p>Reprenez vos 5 pages les plus importantes. Pour chacune, assurez-vous que les 100 premiers mots contiennent une réponse directe à la question que se pose votre visiteur.</p>

      <p>Exemple pour un cabinet comptable :</p>

      <pre><code>{`❌ "Notre cabinet vous accompagne avec passion depuis 20 ans dans tous vos projets financiers."

✅ "Un expert-comptable à Paris accompagne les TPE et PME dans leur comptabilité, leurs déclarations fiscales et leur pilotage financier. Voici les critères pour bien choisir."`}</code></pre>

      <p>La deuxième version est celle que l'IA citera.</p>

      <h2>Raison n°2 : vous bloquez les robots IA sans le savoir</h2>

      <p>C'est le problème le plus simple à diagnostiquer — et le plus absurde quand on le découvre. Beaucoup de sites bloquent les crawlers IA dans leur fichier <code>robots.txt</code> sans même le savoir.</p>

      <p><strong>Vérifiez maintenant :</strong> allez sur <code>votresite.fr/robots.txt</code> et cherchez ces lignes :</p>

      <pre><code>{`User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: PerplexityBot
Disallow: /`}</code></pre>

      <p>Si ces lignes sont présentes, vous interdisez explicitement à ChatGPT, Claude et Perplexity d'accéder à votre contenu. Ils ne peuvent tout simplement pas vous lire.</p>

      <p><strong>Comment corriger :</strong></p>

      <p>Supprimez ces restrictions dans votre <code>robots.txt</code>. Si vous utilisez WordPress, vérifiez que votre plugin SEO (Yoast, Rank Math) n'a pas ajouté ces blocages automatiquement.</p>

      <p>Allez plus loin en créant un fichier <code>llms.txt</code> à la racine de votre site. Ce fichier, spécifiquement conçu pour les crawlers IA, leur indique quelles pages sont les plus importantes et comment votre site est structuré.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Guide technique complet dans llms.txt, robots.txt et crawlabilité IA.</ArrowLink>

      <h2>Raison n°3 : aucune donnée structurée</h2>

      <p>Les données structurées (Schema.org en JSON-LD) sont le langage que les moteurs comprennent sans ambiguïté. Sans elles, l'IA doit deviner ce que contient votre page : êtes-vous une entreprise ou un blog ? Un article ou une page produit ? Un restaurant ou un logiciel ?</p>

      <p>Les IA préfèrent les sites qui leur facilitent le travail. Un site avec des données structurées correctement implémentées a un avantage significatif sur un site sans balisage.</p>

      <p><strong>Vérifiez maintenant :</strong> allez sur le Rich Results Test de Google et entrez votre URL. Si le résultat affiche "Aucun résultat enrichi détecté", vous n'avez pas de données structurées.</p>

      <p><strong>Comment corriger :</strong></p>

      <p>Implémentez ces trois schemas en priorité :</p>

      <ul>
        <li><code>Organization</code> sur votre homepage — indique qui vous êtes, votre logo, vos coordonnées, vos réseaux sociaux.</li>
        <li><code>FAQPage</code> sur vos pages qui contiennent des questions-réponses — c'est le format le plus naturel pour les IA.</li>
        <li><code>Article</code> sur vos contenus éditoriaux — précise l'auteur, la date, le sujet.</li>
      </ul>

      <p>Le format JSON-LD s'ajoute dans le code source de vos pages sans modifier le contenu visible.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Implémentation pas à pas dans Schema.org et IA : le guide pratique pour être compris par les LLM.</ArrowLink>

      <h2>Raison n°4 : aucune preuve vérifiable</h2>

      <p>Les IA sont conçues pour éviter de propager des informations non vérifiées. Si votre site affirme des choses sans les prouver, il sera jugé moins fiable qu'un concurrent qui source ses affirmations.</p>

      <p><strong>Le problème typique :</strong></p>

      <ul>
        <li>"Nous avons des centaines de clients satisfaits" → combien exactement ?</li>
        <li>"Notre solution améliore la productivité" → de combien, mesuré comment ?</li>
        <li>"Les experts recommandent notre approche" → quels experts, dans quelle publication ?</li>
      </ul>

      <p><strong>Comment corriger :</strong></p>

      <p>Passez en revue vos pages clés et remplacez chaque affirmation vague par une preuve concrète :</p>

      <ul>
        <li><strong>Des chiffres précis</strong> : "312 entreprises accompagnées depuis 2019" plutôt que "des centaines de clients"</li>
        <li><strong>Des sources nommées</strong> : "selon une étude McKinsey de 2025" plutôt que "selon les experts"</li>
        <li><strong>Des résultats mesurables</strong> : "+34 % de trafic organique en 4 mois pour [client]" plutôt que "des résultats significatifs"</li>
        <li><strong>Des dates</strong> : "mis à jour en mars 2026" plutôt que "régulièrement mis à jour"</li>
      </ul>

      <p>Chaque donnée vérifiable est un signal de confiance pour les IA.</p>

      <h2>Raison n°5 : votre site n'existe pas en dehors de lui-même</h2>

      <p>Les IA croisent les sources. Quand elles évaluent la crédibilité d'un site, elles cherchent des confirmations externes : votre marque est-elle mentionnée ailleurs sur le web ? D'autres sites vous citent-ils comme référence ?</p>

      <p>Si votre entreprise n'existe que sur son propre site — pas de mentions presse, pas de profils forums, pas de citations dans des articles tiers — l'IA n'a aucun moyen de confirmer votre expertise.</p>

      <p><strong>Comment corriger :</strong></p>

      <p>Développez votre présence externe de manière méthodique :</p>

      <ul>
        <li><strong>Reddit</strong> — c'est la première plateforme citée par les LLM en 2026. Identifiez 5-10 subreddits pertinents pour votre secteur. Répondez à des questions avec expertise et authenticité, sans promotion directe. Un seul commentaire utile et bien sourcé peut être repris par une IA.</li>
        <li><strong>Articles invités et presse sectorielle</strong> — proposez des tribunes à des médias spécialisés dans votre domaine. Chaque article publié sur un site tiers qui mentionne votre marque renforce votre autorité aux yeux des IA.</li>
        <li><strong>Annuaires professionnels</strong> — inscrivez-vous sur les annuaires reconnus de votre secteur. Ces mentions structurées sont facilement identifiables par les crawlers IA.</li>
        <li><strong>Google Business Profile</strong> — même si vous n'avez pas de boutique physique, un profil vérifié avec des avis renforce votre crédibilité en ligne.</li>
      </ul>

      <p>L'objectif n'est pas d'être partout, mais d'avoir des mentions crédibles et cohérentes sur des sources que les IA reconnaissent.</p>

      <h2>Raison n°6 : votre contenu est périmé</h2>

      <p>Les IA favorisent les contenus récents. Si votre dernier article de blog date de 2023, si vos pages mentionnent des "tendances 2024" et si aucune date de mise à jour n'est visible, l'IA considérera que vos informations ne sont plus fiables.</p>

      <p>C'est un problème particulièrement courant chez les entreprises qui ont investi dans du contenu il y a quelques années et qui n'ont jamais mis à jour.</p>

      <p><strong>Comment corriger :</strong></p>

      <ul>
        <li><strong>Identifiez vos pages à fort potentiel</strong> — quelles pages génèrent du trafic ou couvrent des sujets importants pour votre activité ?</li>
        <li><strong>Mettez-les à jour</strong> — actualisez les chiffres, les dates, les exemples. Supprimez les références obsolètes.</li>
        <li><strong>Affichez la date de mise à jour</strong> — ajoutez visiblement "Dernière mise à jour : [date]" sur chaque page actualisée.</li>
        <li><strong>Instaurez un calendrier</strong> — mettez à jour vos pages piliers tous les trimestres, vos articles importants tous les mois.</li>
      </ul>

      <p>Un article de 2023 mis à jour en mars 2026 avec des données fraîches sera traité comme un contenu récent par les IA.</p>

      <h2>La différence avec "demander à ChatGPT si mon site est bien optimisé"</h2>

      <p>Vous pourriez vous dire : "Pourquoi ne pas simplement demander à ChatGPT si mon site est bien optimisé ?"</p>

      <p>La réponse est simple : ChatGPT ne voit pas votre site de la même manière qu'un audit technique. Quand vous lui posez la question, il vous donne un avis générique basé sur ce qu'il sait (ou croit savoir) de votre URL. Il ne scanne pas le DOM réel, ne vérifie pas votre <code>robots.txt</code>, ne compte pas vos balises Schema.org, ne mesure pas l'extractibilité de vos contenus.</p>

      <p>Un audit GEO automatisé fait l'inverse : il analyse le code source réel de votre page, mesure objectivement chaque critère de citabilité, et vous donne un score quantifié avec des recommandations priorisées par impact.</p>

      <p>C'est la différence entre demander à un ami "tu trouves mon CV bien ?" et le faire relire par un recruteur avec une grille d'évaluation.</p>

      <h2>Plan d'action en 7 jours</h2>

      <p>Si vous voulez des résultats rapidement, voici un plan jour par jour :</p>

      <ol>
        <li><strong>Jour 1 — Diagnostic.</strong> Faites le test des 3 questions (recommandation, expertise, nom direct) sur ChatGPT, Gemini et Perplexity. Lancez un audit GEO sur Detekia. Notez votre score de référence.</li>
        <li><strong>Jour 2 — Crawlabilité.</strong> Vérifiez votre <code>robots.txt</code>. Supprimez les blocages des bots IA. Créez votre fichier <code>llms.txt</code>.</li>
        <li><strong>Jour 3 — Extractibilité.</strong> Réécrivez les 100 premiers mots de vos 5 pages les plus importantes. Ajoutez une réponse directe en tête de chaque page.</li>
        <li><strong>Jour 4 — Données structurées.</strong> Implémentez <code>Organization</code> sur la homepage, <code>FAQPage</code> sur votre page FAQ, <code>Article</code> sur vos contenus éditoriaux.</li>
        <li><strong>Jour 5 — Preuves.</strong> Passez en revue vos pages clés. Remplacez chaque affirmation vague par un chiffre, une source ou un exemple concret.</li>
        <li><strong>Jour 6 — Fraîcheur.</strong> Mettez à jour vos 3 contenus les plus importants. Ajoutez des dates de mise à jour visibles.</li>
        <li><strong>Jour 7 — Présence externe.</strong> Créez un compte Reddit et répondez à 3 questions pertinentes dans votre secteur. Vérifiez votre Google Business Profile.</li>
      </ol>

      <p>Après 7 jours, relancez l'audit. Vous devriez constater une amélioration mesurable de votre score. Les effets sur les citations IA se manifesteront dans les semaines suivantes.</p>

      <h2>Questions fréquentes</h2>

      <h3>Est-ce que payer de la pub sur Google aide à être cité par les IA ?</h3>

      <p>Non. Les citations IA sont indépendantes de la publicité. Les IA sélectionnent leurs sources sur des critères de qualité du contenu, pas de budget publicitaire. C'est d'ailleurs une opportunité : un petit site avec un contenu excellent peut être cité autant qu'une grande entreprise.</p>

      <h3>Mon site est premier sur Google mais absent de ChatGPT. Pourquoi ?</h3>

      <p>Être bien classé en SEO est une fondation nécessaire, mais pas suffisante. Les IA ajoutent des critères supplémentaires : extractibilité du contenu, données structurées, crawlabilité par les bots IA, neutralité du ton. Votre site peut être optimisé pour Google sans l'être pour les moteurs génératifs.</p>

      <h3>Combien de temps avant que les IA me citent ?</h3>

      <p>Les corrections techniques (<code>robots.txt</code>, Schema.org) prennent effet en 2 à 4 semaines. Les améliorations de contenu (extractibilité, preuves) se reflètent en 4 à 8 semaines. La construction d'autorité externe (mentions, Reddit) prend 2 à 3 mois. Le plus tôt vous commencez, le plus tôt vous serez visible.</p>

      <h3>Est-ce que ça marche pour tous les secteurs ?</h3>

      <p>Oui. Que vous soyez consultant, e-commerçant, SaaS, artisan ou profession libérale, les critères de citabilité sont les mêmes. Ce qui change, c'est la compétitivité : dans un secteur où peu de concurrents sont optimisés GEO, les gains sont rapides et importants.</p>

      <h2>Commencez par mesurer</h2>

      <p>Vous ne pouvez pas corriger ce que vous ne mesurez pas. La première étape est de savoir où vous en êtes : quel est votre score GEO, quels critères sont défaillants, et par quoi commencer.</p>

      <p>Analysez votre site gratuitement sur Detekia — score sur 100, 8 critères, recommandations priorisées, en 30 secondes. Sans inscription.</p>
    </>
  );
}
