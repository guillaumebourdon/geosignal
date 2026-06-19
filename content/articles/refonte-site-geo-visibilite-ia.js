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

export default function RefonteSiteGeoVisibiliteIA() {
  return (
    <>
      <p>Vous planifiez une refonte de site. Nouveau design, nouvelle arborescence, peut-etre un changement de CMS. Cote SEO, vous avez prevu les redirections 301. Mais avez-vous pense a votre visibilite IA ?</p>

      <p>Une refonte mal preparee peut faire disparaitre votre site des reponses de ChatGPT, Perplexity et Gemini pendant des semaines, voire des mois. Et contrairement au SEO classique ou les positions se recuperent progressivement, la visibilite IA peut s'effondrer brutalement si les signaux de confiance que les IA avaient accumules sur votre ancien site disparaissent.</p>

      <h2>Pourquoi une refonte est risquee pour la visibilite IA</h2>

      <h3>Les IA ne fonctionnent pas comme Google</h3>

      <p>Google recrawle votre site regulierement et met a jour son index. Si vous faites une refonte avec des redirections propres, Google suit les redirections et transfère le jus SEO en quelques semaines.</p>

      <p>Les moteurs IA fonctionnent differemment :</p>

      <ul>
        <li><strong>Les LLM ont une memoire figee.</strong> Les modeles de base (GPT-4, Claude, Gemini) ont ete entraines sur des donnees a une date precise. Si votre ancien site etait dans les donnees d'entrainement, le nouveau site n'y est pas encore.</li>
        <li><strong>Le RAG recrawle, mais plus lentement.</strong> Les systemes RAG (Retrieval-Augmented Generation) utilisent un moteur de recherche (Bing pour ChatGPT, Google pour Gemini) pour enrichir les reponses avec des donnees fraiches. Si vos URLs changent, le RAG doit redecouvrir votre contenu.</li>
        <li><strong>Les schemas JSON-LD sont des ancres de confiance.</strong> Si votre ancien site avait des schemas Organization, Person, FAQPage, et que le nouveau site ne les a plus (ou les a differemment), les IA perdent les signaux de confiance qu'elles avaient accumules.</li>
      </ul>

      <h3>Ce qui peut casser pendant une refonte</h3>

      <ul>
        <li><strong>Les URLs changent</strong> → les citations existantes dans les reponses IA pointent vers des 404</li>
        <li><strong>Les schemas JSON-LD disparaissent</strong> → perte des signaux E-E-A-T et de la structure de donnees</li>
        <li><strong>Le contenu est reorganise</strong> → les FAQ, guides et articles que les IA citaient sont deplaces ou fusionnes</li>
        <li><strong>Le robots.txt change</strong> → les bots IA peuvent se retrouver bloques sans que vous le sachiez</li>
        <li><strong>Les pages auteur disparaissent</strong> → perte de l'<InternalLink href="/blog/eeat-ia-experience-expertise">autorite E-E-A-T</InternalLink> liee aux auteurs</li>
        <li><strong>Le sitemap n'est pas mis a jour</strong> → les crawlers IA ne decouvrent pas les nouvelles URLs</li>
      </ul>

      <h2>Avant la refonte : l'audit de reference</h2>

      <h3>Etape 1 : faire un audit GEO de l'ancien site</h3>

      <p>Avant de toucher quoi que ce soit, mesurez votre visibilite IA actuelle. C'est votre baseline — le score de reference auquel vous comparerez le nouveau site apres la migration.</p>

      <p>Les metriques a capturer :</p>

      <ul>
        <li><strong>Score GEO global</strong> et score par critere (7 criteres)</li>
        <li><strong>Test de citation IA</strong> : sur quelles requetes votre site est-il cite par ChatGPT, Perplexity, Gemini ?</li>
        <li><strong>Inventaire des schemas JSON-LD</strong> : quels types de schema sont presents et sur quelles pages ?</li>
        <li><strong>Liste des pages les plus citees</strong> : identifiez vos pages qui apparaissent dans les reponses IA (souvent les FAQ, les guides, les pages produit detaillees)</li>
        <li><strong>Configuration robots.txt</strong> : quels bots IA ont acces actuellement ?</li>
      </ul>

      <InlineCTA href="/pricing">Faites votre audit GEO avant la refonte — votre score de reference</InlineCTA>

      <h3>Etape 2 : cartographier les actifs IA critiques</h3>

      <p>Identifiez les pages et elements qui contribuent le plus a votre visibilite IA. Ce sont les elements que vous devez absolument preserver ou reproduire dans le nouveau site :</p>

      <ul>
        <li><strong>Pages FAQ avec schema FAQPage</strong> : souvent les pages les plus citees par les IA</li>
        <li><strong>Pages auteur avec schema Person</strong> : portent l'autorite E-E-A-T</li>
        <li><strong>Articles de blog avec donnees structurees</strong> : guides, tutoriels, comparatifs</li>
        <li><strong>Schema Organization</strong> : informations d'entreprise, date de creation, reseaux sociaux</li>
        <li><strong>Pages avec des capsules de reponse</strong> : paragraphes courts qui repondent directement a des questions</li>
      </ul>

      <h2>Pendant la refonte : les regles non negociables</h2>

      <h3>1. Redirections 301 exhaustives</h3>

      <p>C'est la regle numero 1 en SEO, et c'est encore plus important en GEO. Chaque ancienne URL qui existait doit rediriger vers la nouvelle URL correspondante. Les IA ont peut-etre indexe vos anciennes URLs dans leur systeme de retrieval — une 404 signifie une citation perdue.</p>

      <p>Points d'attention :</p>

      <ul>
        <li>Ne redirigez pas tout vers la homepage. Chaque page doit rediriger vers son equivalent le plus proche.</li>
        <li>Testez les redirections avec un crawler (Screaming Frog) avant le lancement</li>
        <li>Gardez les redirections actives pendant au moins 12 mois</li>
      </ul>

      <h3>2. Reproduire tous les schemas JSON-LD</h3>

      <p>Avant de migrer, exportez la liste complete de vos <InternalLink href="/blog/schema-org-ia-guide-pratique">schemas JSON-LD</InternalLink>. Apres la migration, verifiez que chaque schema est present sur la page equivalente du nouveau site.</p>

      <p>Les schemas a verifier en priorite :</p>

      <ul>
        <li><code>Organization</code> : nom, logo, adresse, reseaux sociaux, date de creation</li>
        <li><code>Person</code> : auteurs, experts, dirigeants</li>
        <li><code>FAQPage</code> : toutes les pages avec des questions/reponses</li>
        <li><code>Article</code> : avec <code>datePublished</code>, <code>dateModified</code>, <code>author</code></li>
        <li><code>LocalBusiness</code> : si vous avez une presence locale</li>
        <li><code>HowTo</code>, <code>Review</code>, <code>ItemList</code> : selon votre contenu</li>
      </ul>

      <h3>3. Conserver le robots.txt et le sitemap</h3>

      <p>Verifiez que votre nouveau <InternalLink href="/blog/sitemap-robots-txt-bots-ia-2026">robots.txt</InternalLink> autorise les memes bots IA que l'ancien. C'est un oubli frequent : le nouveau CMS genere un robots.txt par defaut qui peut bloquer GPTBot, ClaudeBot ou PerplexityBot.</p>

      <p>Le sitemap doit etre soumis a Google Search Console et Bing Webmaster Tools des le jour du lancement. Les crawlers IA utilisent ces sitemaps pour decouvrir vos nouvelles URLs.</p>

      <h3>4. Preserver le contenu citable</h3>

      <p>Ne supprimez pas les pages que les IA citent, meme si elles ne correspondent plus a votre nouvelle arborescence. Si une FAQ de 20 questions etait citee par ChatGPT, ne la supprimez pas — deplacez-la avec une redirection et conservez le contenu.</p>

      <p>Si vous devez fusionner des pages, assurez-vous que le contenu citable (les reponses directes, les donnees chiffrees, les listes) est preserve dans la page fusionnee.</p>

      <h3>5. Maintenir les pages auteur</h3>

      <p>Les pages auteur sont souvent sacrifiees dans les refontes. C'est une erreur majeure pour le GEO. Si vos auteurs avaient des pages avec schema Person, bio, credentials et liste d'articles, recréez-les a l'identique sur le nouveau site.</p>

      <h2>Apres la refonte : verification et suivi</h2>

      <h3>Jour J : la checklist de lancement</h3>

      <ol>
        <li>Tester toutes les redirections 301 (aucune 404 sur les anciennes URLs)</li>
        <li>Verifier le robots.txt (bots IA autorises)</li>
        <li>Soumettre le nouveau sitemap a Google Search Console et Bing</li>
        <li>Valider tous les schemas JSON-LD avec Google Rich Results Test</li>
        <li>Verifier que les pages auteur sont en ligne et indexables</li>
        <li>Tester l'accessibilite du site avec JavaScript desactive (pour les crawlers basiques)</li>
      </ol>

      <h3>Semaine 1 : premier controle</h3>

      <ul>
        <li>Lancer un <InternalLink href="/blog/audit-geo-visibilite-ia">audit GEO</InternalLink> sur le nouveau site et comparer avec le score de reference</li>
        <li>Verifier dans Google Search Console que les nouvelles pages sont indexees</li>
        <li>Tester manuellement 5-10 requetes sur ChatGPT et Perplexity pour voir si votre site est toujours cite</li>
      </ul>

      <h3>Mois 1-3 : suivi de recuperation</h3>

      <p>La visibilite IA peut mettre 2 a 8 semaines a se retablir completement apres une refonte, meme avec des redirections parfaites. C'est normal : les systemes RAG doivent recrawler votre contenu et reconstruire les signaux de confiance.</p>

      <p>Lancez un audit GEO toutes les 2 semaines pendant les 3 premiers mois pour suivre la recuperation. Si le score ne remonte pas apres 4 semaines, verifiez :</p>

      <ul>
        <li>Les schemas sont-ils tous en place ?</li>
        <li>Le robots.txt bloque-t-il un bot IA ?</li>
        <li>Les redirections fonctionnent-elles toutes ?</li>
        <li>Le contenu citable est-il toujours present et accessible ?</li>
      </ul>

      <h2>Cas particulier : changement de CMS</h2>

      <p>Un changement de CMS (WordPress vers Webflow, Shopify vers custom, etc.) est le scenario le plus risque pour la visibilite IA. Le nouveau CMS genere une structure HTML differente, des URLs differentes, et souvent des schemas differents.</p>

      <p>Regles supplementaires pour un changement de CMS :</p>

      <ul>
        <li><strong>Exportez le contenu brut</strong> (texte, images, meta) avant la migration. Ne comptez pas sur l'import automatique du nouveau CMS.</li>
        <li><strong>Verifiez la structure HTML.</strong> Certains CMS (Wix, Squarespace) generent du HTML encapsule dans du JavaScript. Les crawlers IA peuvent ne pas le lire.</li>
        <li><strong>Testez les schemas sur le nouveau CMS.</strong> Chaque CMS gere les schemas differemment. Ce qui fonctionnait sur WordPress (via Yoast) ne sera pas automatiquement reproduit sur Webflow.</li>
        <li><strong>Attention aux SPA.</strong> Si le nouveau site est une Single Page Application (React, Vue, Angular), le contenu peut etre invisible pour les crawlers IA. Utilisez le Server-Side Rendering (SSR) ou le Static Site Generation (SSG).</li>
      </ul>

      <h2>Checklist refonte GEO</h2>

      <p><strong>Avant :</strong></p>

      <ol>
        <li>Audit GEO de reference (score, citations, schemas)</li>
        <li>Inventaire des pages citees par les IA</li>
        <li>Export de tous les schemas JSON-LD</li>
        <li>Plan de redirections 301 page par page</li>
      </ol>

      <p><strong>Pendant :</strong></p>

      <ol>
        <li>Redirections 301 exhaustives</li>
        <li>Reproduction de tous les schemas JSON-LD</li>
        <li>robots.txt avec bots IA autorises</li>
        <li>Sitemap a jour soumis aux moteurs</li>
        <li>Pages auteur preservees</li>
        <li>Contenu citable conserve</li>
      </ol>

      <p><strong>Apres :</strong></p>

      <ol>
        <li>Audit GEO du nouveau site (comparaison avec la baseline)</li>
        <li>Test manuel de citation sur ChatGPT/Perplexity</li>
        <li>Suivi bi-hebdomadaire pendant 3 mois</li>
      </ol>

      <h2>Conclusion</h2>

      <p>Une refonte de site est une opportunite d'ameliorer votre visibilite IA — a condition de ne pas perdre ce que vous avez deja. Les schemas JSON-LD, les pages auteur, les FAQ structurees et les redirections sont les quatre piliers a preserver absolument. Faites un audit GEO avant la refonte, reproduisez les signaux de confiance a l'identique, et suivez la recuperation pendant 3 mois. C'est la difference entre une refonte qui fait progresser votre visibilite IA et une qui la fait disparaitre.</p>

      <ArrowLink href="/blog/structured-data-avance-schemas-oublies">Les schemas avances que 95% des sites oublient</ArrowLink>

      <ArrowLink href="/blog/geo-guide-complet-2026">Le guide complet du GEO en 2026</ArrowLink>
    </>
  );
}
