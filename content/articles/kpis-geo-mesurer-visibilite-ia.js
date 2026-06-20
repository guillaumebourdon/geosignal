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
        Analyser mon site gratuitement →
      </a>
    </div>
  );
}

export default function KpisGeoMesurerVisibiliteIA() {
  return (
    <>
      <p>Le GEO est une discipline nouvelle. Et comme toute discipline nouvelle, la question "comment mesurer les resultats ?" arrive vite. En SEO, on regarde les positions, le trafic organique, le taux de clics. En GEO, ces metriques ne fonctionnent pas : il n'y a pas de "position 1" dans une reponse ChatGPT, et le trafic referent des IA est encore difficile a isoler dans Google Analytics.</p>

      <p>Pourtant, mesurer est indispensable. Sans KPIs, impossible de savoir si vos optimisations fonctionnent, de justifier l'investissement, ou de prioriser les prochaines actions. Voici les metriques qui comptent vraiment en GEO, comment les mesurer, et a quelle frequence.</p>

      <h2>Les 3 categories de KPIs GEO</h2>

      <p>Les KPIs du GEO se repartissent en trois niveaux, du plus actionnable au plus strategique :</p>

      <ol>
        <li><strong>KPIs techniques</strong> — ce que vous controlez directement (structure du site, schemas, contenu)</li>
        <li><strong>KPIs de citation</strong> — ce que les IA font de votre contenu (citations, mentions, taux de presence)</li>
        <li><strong>KPIs business</strong> — l'impact sur votre activite (trafic IA, leads, conversions)</li>
      </ol>

      <p>L'erreur classique est de ne regarder que le niveau 3 (le trafic). Mais sans les niveaux 1 et 2, vous n'avez aucun levier d'action. Un site peut avoir du trafic IA par chance ; les KPIs techniques et de citation vous disent si c'est durable.</p>

      <h2>Niveau 1 : les KPIs techniques (ce que vous controlez)</h2>

      <h3>Le score GEO global</h3>

      <p>Le <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">score GEO</InternalLink> est la metrique synthetique qui resume la "citabilite" de votre site. Chez Detekia, il est calcule sur 100 points a partir de <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">7 criteres deterministes</InternalLink> :</p>

      <ul>
        <li>Citabilite et reponse directe (25 pts)</li>
        <li>Verifiabilite et preuves (20 pts)</li>
        <li>Autorite et E-E-A-T (15 pts)</li>
        <li>Accessibilite IA (10 pts)</li>
        <li>Neutralite editoriale (10 pts)</li>
        <li>Presence externe (10 pts)</li>
        <li>Fraicheur et signaux temporels (10 pts)</li>
      </ul>

      <p><strong>Comment le mesurer :</strong> audit GEO automatise (Detekia, ou manuellement en evaluant chaque critere). <strong>Frequence :</strong> a chaque modification significative du site, et au minimum 1 fois par mois.</p>

      <h3>Score par critere</h3>

      <p>Le score global est utile pour le suivi, mais ce sont les scores par critere qui orientent l'action. Un site a 65/100 peut avoir un excellent score en accessibilite (9/10) mais un score de fraicheur catastrophique (2/10). Sans le detail par critere, vous optimisez a l'aveugle.</p>

      <p><strong>Comment le mesurer :</strong> meme audit GEO, avec le detail des 7 sous-scores. <strong>Frequence :</strong> a chaque audit.</p>

      <h3>Couverture des schemas JSON-LD</h3>

      <p>Combien de types de <InternalLink href="/blog/structured-data-avance-schemas-oublies">schemas avances</InternalLink> votre site implemente-t-il ? Organization, Person, FAQPage, HowTo, Review, LocalBusiness, SpeakableSpecification — chaque schema ajoute est un signal de confiance supplementaire pour les IA.</p>

      <p><strong>Comment le mesurer :</strong> Google Rich Results Test page par page, ou un crawler qui detecte les schemas sur l'ensemble du site. <strong>Cible :</strong> au minimum Organization + Person + Article avec dateModified. Ideal : 5+ types de schemas implementes.</p>

      <h3>Acces des bots IA</h3>

      <p>GPTBot, ClaudeBot, PerplexityBot, Google-Extended — combien de ces bots ont acces a votre contenu ? Un seul bot bloque peut vous rendre invisible sur un moteur IA entier.</p>

      <p><strong>Comment le mesurer :</strong> verifiez votre <InternalLink href="/blog/sitemap-robots-txt-bots-ia-2026">robots.txt</InternalLink> et les logs serveur. <strong>Cible :</strong> 4/4 bots autorises. <strong>Frequence :</strong> a chaque modification du robots.txt ou installation d'un plugin de securite.</p>

      <h2>Niveau 2 : les KPIs de citation (ce que les IA font de votre contenu)</h2>

      <h3>Taux de citation IA</h3>

      <p>C'est le KPI central du GEO : sur un ensemble de requetes pertinentes pour votre activite, dans quel pourcentage de cas votre site est-il cite dans la reponse IA ?</p>

      <p><strong>Comment le mesurer :</strong> testez 20-30 requetes representant votre domaine sur ChatGPT, Perplexity et Gemini. Comptez le nombre de fois ou votre site (ou votre marque) est mentionne. Le taux = mentions / requetes totales.</p>

      <p><strong>Frequence :</strong> 1 fois par mois. Les reponses IA varient d'un jour a l'autre, donc faites le test sur plusieurs jours pour lisser les resultats.</p>

      <p><strong>Cible :</strong> il n'y a pas de benchmark universel. Un taux de 10-20% sur des requetes generiques est deja bon. Sur des requetes de niche ou votre expertise est forte, visez 30-50%.</p>

      <h3>Part de voix IA vs concurrents</h3>

      <p>Comme en SEO traditionnel, la part de voix mesure votre presence relative par rapport a vos <InternalLink href="/blog/concurrents-chatgpt-visibilite">concurrents</InternalLink>. Sur les memes 20-30 requetes, qui est cite le plus souvent ?</p>

      <p><strong>Comment le mesurer :</strong> pour chaque requete testee, notez les sites/marques cites dans la reponse IA. Comptez les mentions par concurrent. Votre part de voix = vos mentions / total des mentions.</p>

      <p><strong>Frequence :</strong> 1 fois par mois, en meme temps que le taux de citation.</p>

      <h3>Qualite des citations</h3>

      <p>Toutes les citations ne se valent pas. Etre mentionne en passant ("parmi les acteurs du marche, on trouve...") n'a pas la meme valeur qu'etre cite comme source principale ("selon [votre site], la methode recommandee est...").</p>

      <p>Classifiez vos citations en 3 niveaux :</p>

      <ul>
        <li><strong>Citation source</strong> : votre site est cite comme reference avec un lien ou une attribution directe</li>
        <li><strong>Mention de marque</strong> : votre marque/nom est mentionne dans la reponse</li>
        <li><strong>Citation indirecte</strong> : votre contenu est repris sans attribution explicite</li>
      </ul>

      <InlineCTA href="/pricing">Mesurez votre taux de citation IA sur 30 requetes</InlineCTA>

      <h2>Niveau 3 : les KPIs business (l'impact reel)</h2>

      <h3>Trafic referent IA</h3>

      <p>Le trafic provenant des moteurs IA est mesurable dans Google Analytics, mais il faut savoir ou le trouver. Les referrers typiques :</p>

      <ul>
        <li><code>chat.openai.com</code> ou <code>chatgpt.com</code> — trafic ChatGPT</li>
        <li><code>perplexity.ai</code> — trafic Perplexity</li>
        <li><code>gemini.google.com</code> — trafic Gemini</li>
        <li><code>claude.ai</code> — trafic Claude</li>
        <li><code>copilot.microsoft.com</code> — trafic Copilot/Bing</li>
      </ul>

      <p><strong>Comment le mesurer :</strong> dans Google Analytics 4, allez dans Rapports → Acquisition → Trafic → Source/Support. Filtrez par les domaines ci-dessus. Vous pouvez aussi creer un segment personnalise "Trafic IA" qui regroupe tous ces referrers.</p>

      <p><strong>Attention :</strong> une grande partie du trafic IA arrive sans referrer (l'utilisateur copie l'URL donnee par l'IA et la colle dans son navigateur). Le trafic IA mesurable sous-estime donc le trafic reel, parfois de 50% ou plus.</p>

      <h3>Taux de conversion du trafic IA</h3>

      <p>Le trafic IA convertit-il mieux ou moins bien que le trafic organique classique ? C'est une question cle pour justifier l'investissement GEO. En general, le trafic IA convertit mieux car les utilisateurs arrivent avec une intention plus precise (ils ont pose une question specifique a l'IA).</p>

      <p><strong>Comment le mesurer :</strong> dans GA4, comparez les taux de conversion du segment "Trafic IA" vs "Trafic organique Google".</p>

      <h3>Impact sur les leads et le chiffre d'affaires</h3>

      <p>Le KPI ultime : combien de leads ou de ventes proviennent directement ou indirectement de la visibilite IA ? C'est difficile a mesurer avec precision car l'attribution est complexe (un prospect peut decouvrir votre site via ChatGPT, puis revenir via Google, puis convertir via un email).</p>

      <p>Methodes d'approximation :</p>

      <ul>
        <li><strong>Sondage post-conversion</strong> : "Comment avez-vous entendu parler de nous ?" avec "Reponse IA (ChatGPT, Perplexity...)" comme option</li>
        <li><strong>UTM sur les liens cites</strong> : si vous pouvez influencer les liens que les IA citent (via votre sitemap ou vos schemas), ajoutez des UTMs</li>
        <li><strong>Correlation temporelle</strong> : comparez l'evolution de vos leads avec l'evolution de votre taux de citation IA</li>
      </ul>

      <h2>Le tableau de bord GEO ideal</h2>

      <p>Voici les metriques a suivre chaque mois, regroupees dans un tableau de bord simple :</p>

      <table>
        <thead>
          <tr><th>KPI</th><th>Source</th><th>Frequence</th><th>Cible</th></tr>
        </thead>
        <tbody>
          <tr><td>Score GEO global</td><td>Audit Detekia</td><td>Mensuel</td><td>&gt;70/100</td></tr>
          <tr><td>Scores par critere (7)</td><td>Audit Detekia</td><td>Mensuel</td><td>Aucun &lt;50%</td></tr>
          <tr><td>Schemas implementes</td><td>Rich Results Test</td><td>Trimestriel</td><td>5+ types</td></tr>
          <tr><td>Bots IA autorises</td><td>robots.txt</td><td>A chaque modif</td><td>4/4</td></tr>
          <tr><td>Taux de citation IA</td><td>Test 30 requetes</td><td>Mensuel</td><td>&gt;15%</td></tr>
          <tr><td>Part de voix vs concurrents</td><td>Test comparatif</td><td>Mensuel</td><td>Top 3</td></tr>
          <tr><td>Trafic referent IA</td><td>GA4</td><td>Mensuel</td><td>Croissance MoM</td></tr>
          <tr><td>Conversion trafic IA</td><td>GA4</td><td>Mensuel</td><td>&gt;trafic organique</td></tr>
        </tbody>
      </table>

      <h2>Les pieges a eviter</h2>

      <ul>
        <li><strong>Ne pas confondre position SEO et citation IA.</strong> Etre premier sur Google ne garantit pas d'etre cite par ChatGPT. Les signaux sont differents.</li>
        <li><strong>Ne pas mesurer une seule fois.</strong> Les reponses IA changent quotidiennement. Un test ponctuel ne vaut rien — c'est la tendance sur 3+ mois qui compte.</li>
        <li><strong>Ne pas ignorer les requetes de niche.</strong> Les requetes generiques ("meilleur CRM") sont ultra-competitives. Vos meilleures opportunites sont sur les requetes de niche ou votre expertise est unique.</li>
        <li><strong>Ne pas attendre des resultats immediats.</strong> Le GEO est un investissement a moyen terme. Les premiers signaux apparaissent en 4-8 semaines apres les optimisations.</li>
        <li><strong>Ne pas oublier les metriques qualitatives.</strong> Le taux de citation brut ne dit pas tout. Etre cite comme "leader du marche" vs "un acteur parmi d'autres" fait une difference enorme en perception.</li>
      </ul>

      <h2>Comment Detekia mesure ces KPIs</h2>

      <p>L'<InternalLink href="/blog/audit-geo-visibilite-ia">audit GEO Detekia</InternalLink> couvre les niveaux 1 et 2 automatiquement :</p>

      <ul>
        <li><strong>Score GEO sur 7 criteres</strong> : mesure deterministe, reproductible, comparable dans le temps</li>
        <li><strong>Test de citation IA sur 30 requetes</strong> : taux de citation, concurrents cites, meilleures opportunites</li>
        <li><strong>Detection des schemas</strong> : inventaire automatique des schemas JSON-LD presents</li>
        <li><strong>Verification bots IA</strong> : test d'accessibilite pour GPTBot, ClaudeBot, PerplexityBot</li>
      </ul>

      <p>Le rapport Pro (10 pages) ajoute une dimension multi-pages : score par page, patterns transverses, et un plan d'action priorise pour ameliorer les KPIs les plus faibles.</p>

      <h2>Conclusion</h2>

      <p>Mesurer le GEO n'est pas aussi simple que mesurer le SEO, mais c'est loin d'etre impossible. Le score GEO donne une baseline actionnable, le taux de citation IA mesure l'impact reel, et le trafic referent confirme le ROI business. L'essentiel est de suivre ces metriques dans le temps — c'est la tendance qui compte, pas un instantane.</p>

      <p>Commencez par un audit GEO pour etablir votre baseline, puis re-mesurez chaque mois. En 3 mois, vous aurez une vision claire de ce qui fonctionne et de ce qui reste a optimiser.</p>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">Score GEO : comment mesurer la visibilite IA de votre site</ArrowLink>

      <ArrowLink href="/blog/geo-guide-complet-2026">Le guide complet du GEO en 2026</ArrowLink>
    </>
  );
}
