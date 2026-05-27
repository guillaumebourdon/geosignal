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

export default function VisibiliteIaGuideDebutant() {
  return (
    <>
      <p>
        En 2026, <strong>90 % des sites web sont invisibles pour les IA</strong> comme ChatGPT, Gemini ou Perplexity. Pourtant, ces moteurs de réponse influencent chaque jour des millions de décisions d'achat, de recommandations et de recherches d'information. Si votre entreprise n'apparaît pas dans leurs réponses, vous laissez le terrain libre à vos concurrents.
      </p>
      <p>
        Ce guide s'adresse aux entreprises qui découvrent le sujet. Pas de jargon inutile, pas de prérequis technique : vous repartirez avec une compréhension claire de ce qu'est la visibilité IA et un plan d'action concret pour démarrer.
      </p>

      <h2>Qu'est-ce que la visibilité IA ?</h2>
      <p>
        La visibilité IA, c'est la capacité de votre site à être <strong>cité, mentionné ou recommandé</strong> dans les réponses générées par les intelligences artificielles. Quand un utilisateur pose une question à ChatGPT — par exemple « quelle agence marketing choisir à Paris ? » ou « quel est le meilleur logiciel de comptabilité ? » — l'IA synthétise les informations du web et cite 2 à 3 sources dans sa réponse.
      </p>
      <p>
        Si votre site fait partie de ces sources, vous gagnez en crédibilité, en notoriété et en trafic qualifié. Si vous n'y êtes pas, vos concurrents captent cette audience à votre place.
      </p>
      <p>
        Cette discipline porte un nom : le <strong>GEO</strong> (Generative Engine Optimization). C'est le pendant du SEO, mais pour les moteurs de réponse IA au lieu de Google.
      </p>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO : le guide complet pour être cité par les IA en 2026</ArrowLink>

      <h2>Pourquoi c'est devenu un enjeu business</h2>
      <p>
        Les chiffres parlent d'eux-mêmes. Le trafic référé par les IA a augmenté de <strong>527 % entre janvier et mai 2025</strong> (Previsible, 2025). ChatGPT traite 2,5 milliards de requêtes par jour, avec 810 millions d'utilisateurs quotidiens (Search Engine Land, 2026). Et les visiteurs qui arrivent via les IA convertissent <strong>4,4 fois mieux</strong> que les visiteurs organiques classiques (Semrush, 2025).
      </p>
      <p>
        Autrement dit : même si le volume est encore inférieur à celui de Google, la qualité du trafic IA est nettement supérieure. Les utilisateurs qui passent par ChatGPT ou Perplexity ont déjà une intention claire — ils cherchent une solution, pas juste une information.
      </p>
      <p>
        Le plus frappant : <strong>80 % des URLs citées par ChatGPT ne sont pas dans le top 100 Google</strong> (Ahrefs, 2025). Être bien référencé sur Google ne garantit plus d'être visible dans les IA. Et inversement, un site modeste sur Google peut très bien être cité par ChatGPT s'il répond aux bons critères.
      </p>

      <h2>Les 5 piliers de la visibilité IA</h2>
      <p>
        Comprendre la visibilité IA, c'est comprendre ce que les IA recherchent dans un site. Voici les 5 piliers fondamentaux :
      </p>

      <h3>1. Un contenu clair et extractible</h3>
      <p>
        Les IA ne lisent pas votre site comme un humain. Elles extraient des morceaux de texte — des « chunks » — pour construire leurs réponses. Un contenu bien structuré avec des titres H2/H3, des listes à puces, des paragraphes courts et des réponses directes dès l'introduction sera beaucoup plus facilement repris.
      </p>
      <p>
        <strong>La règle d'or :</strong> 44,2 % des citations IA proviennent des 30 premiers % du texte (Growth Memo, 2026). Votre introduction est votre atout n°1. Répondez à la question principale dès les deux premières phrases.
      </p>

      <h3>2. Des preuves et des sources</h3>
      <p>
        Les IA privilégient les contenus qui avancent des preuves : chiffres sourcés, études citées, liens vers des sources externes reconnues. Un site qui dit « nous sommes les meilleurs » sera ignoré. Un site qui dit « notre méthode a permis d'augmenter le trafic de 40 % en 3 mois (source : étude interne, 2025) » sera cité.
      </p>
      <p>
        Visez 5 à 10 liens externes par page principale vers des sources reconnues : études universitaires, rapports d'analystes, articles de presse.
      </p>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">Comment fonctionne le score GEO Detekia : les 7 critères décryptés</ArrowLink>

      <h3>3. Une identité claire (E-E-A-T)</h3>
      <p>
        E-E-A-T signifie Expérience, Expertise, Autorité et Confiance. Les IA — comme Google — veulent savoir <strong>qui</strong> est derrière le contenu. Une page À propos détaillée, une page Contact, des mentions légales, un auteur identifié avec sa biographie et des liens vers ses réseaux sociaux : tout cela renforce votre crédibilité aux yeux des IA.
      </p>
      <p>
        Les marques dans le top 25 % des mentions web obtiennent 10 fois plus de visibilité IA que les autres (Ahrefs, 2025).
      </p>

      <h3>4. Un site accessible aux bots IA</h3>
      <p>
        73 % des sites bloquent les bots IA sans le savoir (Otterly.AI, 2026). Votre fichier robots.txt doit autoriser GPTBot (OpenAI), ClaudeBot (Anthropic), PerplexityBot et Google-Extended. Si ces bots ne peuvent pas accéder à votre site, impossible d'être cité.
      </p>
      <p>
        Vérifiez aussi que votre contenu n'est pas rendu uniquement en JavaScript côté client — les bots IA ne l'exécutent pas.
      </p>

      <ArrowLink href="/blog/sites-bloquent-bots-ia">Pourquoi 73 % des sites bloquent les bots IA sans le savoir</ArrowLink>

      <h3>5. Des données structurées (Schema.org)</h3>
      <p>
        Le Schema.org est le langage que les IA lisent en priorité pour comprendre votre site. Un schema Organization indique qui vous êtes. Un schema FAQPage structure vos questions fréquentes. Un schema Article identifie vos contenus éditoriaux. Les pages avec des schemas structurés sont citées <strong>3 à 5 fois plus souvent</strong> par les IA (Otterly.AI, 2026).
      </p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et IA : le guide pratique avec exemples de code</ArrowLink>

      <InlineCTA href="/">Découvrez votre score de visibilité IA en moins de 60 secondes</InlineCTA>

      <h2>Par où commencer : votre plan d'action en 7 jours</h2>
      <p>
        Pas besoin de tout révolutionner. Voici un plan d'action réaliste pour poser les bases de votre visibilité IA en une semaine :
      </p>

      <h3>Jour 1 : Auditez votre situation actuelle</h3>
      <p>
        Posez à ChatGPT, Gemini et Perplexity les questions que vos clients se posent. Votre site apparaît-il dans les réponses ? Qui est cité à votre place ? C'est la première étape pour comprendre où vous en êtes. Vous pouvez aussi utiliser Detekia pour obtenir un score objectif sur 100.
      </p>

      <h3>Jour 2 : Vérifiez votre robots.txt</h3>
      <p>
        Tapez <code>votresite.com/robots.txt</code> dans votre navigateur. Si vous voyez des lignes qui bloquent GPTBot, ClaudeBot ou PerplexityBot, supprimez-les. C'est le quick win le plus rapide — impact visible en 2 à 4 semaines.
      </p>

      <h3>Jour 3 : Réécrivez votre introduction</h3>
      <p>
        Prenez votre page d'accueil. Les deux premières phrases répondent-elles clairement à la question « que fait votre entreprise et pour qui ? ». Si la réponse est non, réécrivez-les. Soyez factuel, direct, sans jargon marketing.
      </p>

      <h3>Jour 4 : Ajoutez un schema Organization</h3>
      <p>
        C'est un bloc de code JSON-LD à insérer dans le &lt;head&gt; de votre site. Il indique aux IA votre nom, votre logo, votre adresse et vos réseaux sociaux. C'est la base de votre identité numérique pour les IA.
      </p>

      <h3>Jour 5 : Complétez votre page À propos</h3>
      <p>
        Ajoutez-y votre parcours, vos compétences, vos certifications et une photo. Les IA vérifient qui est derrière le contenu — un auteur identifié avec une biographie détaillée est un signal fort de crédibilité.
      </p>

      <h3>Jour 6 : Ajoutez des sources à vos contenus</h3>
      <p>
        Reprenez vos pages principales et ajoutez des liens vers des sources externes pour chaque affirmation chiffrée. Les IA favorisent les contenus vérifiables.
      </p>

      <h3>Jour 7 : Planifiez votre calendrier de contenu</h3>
      <p>
        65 % des visites de bots IA ciblent du contenu publié dans les 12 derniers mois (Seer Interactive, 2025). Un site qui ne publie pas régulièrement perd progressivement sa visibilité IA. Planifiez au minimum 2 à 4 contenus par mois.
      </p>

      <h2>Les erreurs à éviter quand on débute</h2>
      <p>
        <strong>Erreur n°1 : Croire que le SEO suffit.</strong> 80 % des URLs citées par ChatGPT ne sont pas dans le top 100 Google. Le SEO est une base nécessaire, mais pas suffisante pour la visibilité IA.
      </p>
      <p>
        <strong>Erreur n°2 : Produire du contenu promotionnel.</strong> Les IA déprioritisent le contenu ouvertement commercial. Privilégiez un ton informatif, factuel et éducatif. Les superlatifs comme « le meilleur » ou « le leader » sans preuve vous desservent.
      </p>
      <p>
        <strong>Erreur n°3 : Ignorer les données structurées.</strong> Beaucoup d'entreprises pensent que le Schema.org est réservé aux développeurs. En réalité, un schema Organization basique prend 10 minutes à implémenter et a un impact mesurable.
      </p>
      <p>
        <strong>Erreur n°4 : Attendre d'avoir un site parfait.</strong> La visibilité IA se construit progressivement. Commencez par les quick wins (robots.txt, introduction, schema) et améliorez itérativement.
      </p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : quelles différences et comment les combiner en 2026</ArrowLink>

      <h2>Comment mesurer vos progrès</h2>
      <p>
        Contrairement au SEO où vous pouvez suivre vos positions sur Google, la visibilité IA est plus difficile à mesurer. Voici trois méthodes :
      </p>
      <p>
        <strong>1. Le test manuel :</strong> Posez régulièrement à ChatGPT, Gemini et Perplexity les requêtes stratégiques de votre secteur. Notez si votre site est cité, et suivez l'évolution mois après mois.
      </p>
      <p>
        <strong>2. Le score Detekia :</strong> Analysez votre site avec Detekia pour obtenir un score objectif sur 100, basé sur 7 critères mesurables. Refaites l'analyse après chaque série d'optimisations pour suivre vos progrès.
      </p>
      <p>
        <strong>3. Le trafic référé :</strong> Dans Google Analytics, surveillez le trafic provenant de sources IA (chatgpt.com, perplexity.ai, etc.). C'est encore faible pour la plupart des sites, mais c'est un indicateur en forte croissance.
      </p>

      <InlineCTA href="/">Analysez votre visibilité IA gratuitement — score en moins de 60 secondes</InlineCTA>

      <h2>Ce qu'il faut retenir</h2>
      <p>
        La visibilité IA n'est pas un concept futuriste — c'est un enjeu concret en 2026. Les entreprises qui s'y prennent maintenant auront un avantage décisif sur celles qui attendent. Les bonnes nouvelles : les actions de base sont simples, la concurrence est encore faible sur la plupart des secteurs en France, et les résultats sont mesurables.
      </p>
      <p>
        Commencez par auditer votre situation, corrigez les quick wins (robots.txt, introduction, schema), puis construisez progressivement avec du contenu régulier, sourcé et structuré. En 3 à 6 mois, vous verrez la différence.
      </p>

      <ArrowLink href="/blog/pourquoi-chatgpt-ne-cite-pas-votre-site">Pourquoi ChatGPT ne cite pas votre site (et comment y remédier)</ArrowLink>
    </>
  );
}
