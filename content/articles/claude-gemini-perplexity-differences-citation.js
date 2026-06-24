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

export default function ClaudeGeminiPerplexityDifferencesCitation() {
  return (
    <>
      <p>ChatGPT, Claude, Gemini, Perplexity : ces quatre moteurs IA repondent aux memes questions, mais ils ne citent pas les memes sources. Un site peut etre cite systematiquement par Perplexity et totalement ignore par ChatGPT. Comprendre ces differences est essentiel pour orienter votre strategie GEO.</p>

      <p>Car optimiser "pour les IA" en general ne suffit pas. Chaque moteur a son propre pipeline de retrieval, ses propres biais de selection, et ses propres criteres de confiance. Voici ce qui les differencie concretement.</p>

      <h2>Les architectures de retrieval : pourquoi les reponses different</h2>

      <h3>ChatGPT (OpenAI) : Bing + memoire du modele</h3>

      <p>ChatGPT utilise Bing comme moteur de recherche sous-jacent pour ses reponses en temps reel (mode "Browse"). Quand vous posez une question factuelle, ChatGPT envoie une requete a Bing, recupere les resultats, puis synthetise une reponse.</p>

      <p>Consequences pour la citation :</p>

      <ul>
        <li><strong>Les sites bien positionnes sur Bing sont avantages.</strong> Si votre site est invisible sur Bing (beaucoup de sites francais negligent Bing), ChatGPT ne le trouvera pas.</li>
        <li><strong>La memoire du modele joue un role.</strong> Pour les questions generiques, ChatGPT puise aussi dans ses connaissances pre-entrainees. Les marques et sites tres presents dans le corpus d'entrainement (Wikipedia, grands medias, sites a forte autorite) sont cites meme sans recherche en temps reel.</li>
        <li><strong>Bing Places compte pour le local.</strong> Si vous etes un commerce local, votre fiche Bing Places impacte directement vos chances d'etre cite par ChatGPT.</li>
      </ul>

      <h3>Claude (Anthropic) : recherche web selective</h3>

      <p>Claude dispose d'un acces web mais l'utilise de maniere plus selective que ChatGPT. Claude tend a privilegier la qualite et la fiabilite des sources plutot que le volume. Son training data accorde beaucoup de poids aux contenus academiques, techniques et bien structures.</p>

      <p>Consequences pour la citation :</p>

      <ul>
        <li><strong>Le contenu expert et technique est favorise.</strong> Claude cite davantage les sites avec un ton educatif, des sources referenciees et un auteur identifie.</li>
        <li><strong>L'<InternalLink href="/blog/eeat-ia-experience-expertise">autorite E-E-A-T</InternalLink> pese plus lourd.</strong> Claude est particulierement sensible aux signaux de credibilite : pages auteur detaillees, credentials, publications.</li>
        <li><strong>Le contenu promotionnel est penalise.</strong> Claude filtre davantage les contenus a ton commercial que les autres moteurs.</li>
      </ul>

      <h3>Gemini (Google) : l'ecosysteme Google complet</h3>

      <p>Gemini a un avantage massif : il accede a l'ensemble de l'ecosysteme Google. Google Search, Google Maps, Google Scholar, YouTube, Google Shopping — tout est disponible pour construire une reponse.</p>

      <p>Consequences pour la citation :</p>

      <ul>
        <li><strong>Le SEO Google traditionnel compte directement.</strong> Les sites bien positionnes sur Google Search ont un avantage naturel sur Gemini. C'est le seul moteur IA ou le SEO classique se transfere aussi directement.</li>
        <li><strong>Google Business Profile est determinant pour le local.</strong> Pour les requetes locales, Gemini puise directement dans Google Maps. <InternalLink href="/blog/recherche-locale-ia-google-maps-llm">L'optimisation locale</InternalLink> est donc critique.</li>
        <li><strong>YouTube est une source majeure.</strong> Gemini cite frequemment des videos YouTube. Si votre strategie de contenu inclut de la video, c'est un levier specifique a Gemini.</li>
        <li><strong>Les <InternalLink href="/blog/structured-data-avance-schemas-oublies">donnees structurees</InternalLink> sont mieux exploitees.</strong> Google est le plus avance dans le parsing des schemas JSON-LD. Un balisage complet a plus d'impact sur Gemini que sur les autres moteurs.</li>
      </ul>

      <h3>Perplexity : l'index hybride avec citations systematiques</h3>

      <p>Perplexity se distingue par une approche unique : il cite systematiquement ses sources avec des liens numerotes dans chaque reponse. Son index combine plusieurs moteurs de recherche et ses propres crawlers.</p>

      <p>Consequences pour la citation :</p>

      <ul>
        <li><strong>Les sources sont toujours visibles.</strong> Contrairement aux autres moteurs qui citent parfois sans lien, Perplexity affiche toujours les URLs. C'est le moteur ou une citation genere le plus de trafic direct.</li>
        <li><strong>La fraicheur est tres valorisee.</strong> Perplexity recrawle frequemment et favorise les contenus recents. Un article mis a jour cette semaine a plus de chances d'etre cite qu'un article de 6 mois.</li>
        <li><strong>Les forums et contenus communautaires sont bien representes.</strong> <InternalLink href="/blog/reddit-geo-source-ia">Reddit</InternalLink>, Quora, Stack Overflow apparaissent souvent dans les sources Perplexity, plus que chez les autres moteurs.</li>
        <li><strong>Le contenu long et detaille est favorise.</strong> Perplexity tend a citer des articles approfondis plutot que des pages courtes.</li>
      </ul>

      <h2>Tableau comparatif des criteres de citation</h2>

      <p>Voici comment chaque moteur IA pondere les principaux criteres de <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">citabilite GEO</InternalLink> :</p>

      <table>
        <thead>
          <tr><th>Critere</th><th>ChatGPT</th><th>Claude</th><th>Gemini</th><th>Perplexity</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Moteur de recherche</strong></td><td>Bing</td><td>Recherche web propre</td><td>Google</td><td>Index hybride</td></tr>
          <tr><td><strong>SEO traditionnel</strong></td><td>Moyen (Bing)</td><td>Faible</td><td>Fort (Google)</td><td>Moyen</td></tr>
          <tr><td><strong>Autorite E-E-A-T</strong></td><td>Important</td><td>Tres important</td><td>Important</td><td>Moyen</td></tr>
          <tr><td><strong>Donnees structurees</strong></td><td>Moyen</td><td>Moyen</td><td>Tres important</td><td>Faible</td></tr>
          <tr><td><strong>Fraicheur du contenu</strong></td><td>Moyen</td><td>Moyen</td><td>Important</td><td>Tres important</td></tr>
          <tr><td><strong>Citations/sources</strong></td><td>Important</td><td>Tres important</td><td>Important</td><td>Important</td></tr>
          <tr><td><strong>Contenu long/detaille</strong></td><td>Moyen</td><td>Important</td><td>Moyen</td><td>Tres important</td></tr>
          <tr><td><strong>Presence locale</strong></td><td>Bing Places</td><td>Faible</td><td>Google Maps</td><td>Annuaires tiers</td></tr>
          <tr><td><strong>Lien dans la reponse</strong></td><td>Parfois</td><td>Parfois</td><td>Parfois</td><td>Toujours</td></tr>
        </tbody>
      </table>

      <InlineCTA href="/pricing">Testez votre visibilite sur les 4 moteurs IA</InlineCTA>

      <h2>Strategies specifiques par moteur</h2>

      <h3>Pour etre cite par ChatGPT</h3>

      <ul>
        <li><strong>Optimisez pour Bing.</strong> Revendiquez votre site sur Bing Webmaster Tools, soumettez votre sitemap, et verifiez que vos pages sont indexees sur Bing (pas seulement Google).</li>
        <li><strong>Renforcez votre notoriete de marque.</strong> ChatGPT s'appuie sur sa memoire pre-entrainees. Les marques connues et frequemment mentionnees sur le web sont citees naturellement.</li>
        <li><strong>Soignez vos meta descriptions.</strong> Bing les utilise davantage que Google dans ses snippets, et ChatGPT les reprend souvent.</li>
      </ul>

      <h3>Pour etre cite par Claude</h3>

      <ul>
        <li><strong>Investissez dans le contenu expert.</strong> Articles approfondis, auteurs identifies avec credentials, sources academiques citees.</li>
        <li><strong>Adoptez un ton neutre et educatif.</strong> Claude penalise le contenu promotionnel plus que les autres moteurs. Ecrivez comme un expert qui enseigne, pas comme un vendeur.</li>
        <li><strong>Creez des pages auteur detaillees.</strong> Claude accorde beaucoup de poids a l'identification de l'auteur.</li>
      </ul>

      <h3>Pour etre cite par Gemini</h3>

      <ul>
        <li><strong>Maintenez un bon SEO Google.</strong> C'est le seul moteur IA ou les positions Google se transferent directement.</li>
        <li><strong>Implementez des schemas JSON-LD complets.</strong> Organization, Person, FAQPage, Article avec dateModified — Gemini les exploite mieux que les autres.</li>
        <li><strong>Completez votre Google Business Profile</strong> si vous avez une presence locale.</li>
        <li><strong>Publiez sur YouTube.</strong> Les videos sont une source majeure pour Gemini.</li>
      </ul>

      <h3>Pour etre cite par Perplexity</h3>

      <ul>
        <li><strong>Mettez a jour vos contenus regulierement.</strong> Perplexity valorise la fraicheur plus que tous les autres moteurs.</li>
        <li><strong>Publiez du contenu long et detaille.</strong> Les articles de 1500+ mots avec des donnees chiffrees sont favorises.</li>
        <li><strong>Soyez present sur les forums et communautes.</strong> Reddit, Quora, forums specialises — Perplexity les cite frequemment.</li>
        <li><strong>Incluez des donnees chiffrees sourcees.</strong> Perplexity adore les contenus avec des statistiques precises et des sources verifiables.</li>
      </ul>

      <ArrowLink href="/blog/comment-chatgpt-choisit-ses-sources">Comment ChatGPT choisit ses sources en detail</ArrowLink>

      <h2>Le piege de l'optimisation mono-moteur</h2>

      <p>La tentation est d'optimiser pour un seul moteur IA — souvent ChatGPT car c'est le plus utilise. C'est une erreur strategique pour trois raisons :</p>

      <ul>
        <li><strong>Les parts de marche evoluent vite.</strong> Perplexity croit de 40% par trimestre. Gemini est integre dans Android et Chrome. Claude gagne en popularite dans le B2B. Miser tout sur un seul moteur est risque.</li>
        <li><strong>Les signaux de base sont communs.</strong> Un contenu bien structure, avec des sources, un auteur identifie et des donnees structurees sera bien cite partout. Les 7 criteres du <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">score GEO</InternalLink> couvrent les fondamentaux communs a tous les moteurs.</li>
        <li><strong>La diversification protege contre les changements d'algorithme.</strong> Si ChatGPT change son pipeline de retrieval demain (ce qui arrive regulierement), les sites diversifies sont moins impactes.</li>
      </ul>

      <h2>La strategie optimale : socle commun + ajustements</h2>

      <p>L'approche recommandee :</p>

      <ol>
        <li><strong>Construisez le socle commun</strong> : contenu structure, sources citees, auteur identifie, schemas JSON-LD, bots IA autorises. C'est ce que mesure le <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">score GEO Detekia</InternalLink>.</li>
        <li><strong>Ajoutez les optimisations specifiques</strong> selon vos priorites : Bing Webmaster Tools pour ChatGPT, Google Business Profile pour Gemini, mise a jour frequente pour Perplexity, contenu expert pour Claude.</li>
        <li><strong>Mesurez par moteur</strong> : testez les memes requetes sur les 4 moteurs pour identifier ou vous etes cite et ou vous ne l'etes pas. L'audit Pro Detekia simule 30 requetes et mesure votre taux de citation global.</li>
      </ol>

      <h2>Conclusion</h2>

      <p>ChatGPT, Claude, Gemini et Perplexity ne sont pas interchangeables. Ils ont des architectures differentes, des sources differentes, et des biais differents. Mais les fondamentaux de la citabilite sont les memes : un contenu de qualite, bien structure, avec des preuves verifiables et un auteur credible. Optimisez d'abord pour ces fondamentaux, puis affinez par moteur selon votre audience.</p>

      <ArrowLink href="/blog/perplexity-comment-apparaitre">Perplexity : comment apparaitre dans ses reponses</ArrowLink>

      <ArrowLink href="/blog/geo-guide-complet-2026">Le guide complet du GEO en 2026</ArrowLink>
    </>
  );
}
