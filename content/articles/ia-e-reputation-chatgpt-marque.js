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

export default function IaEReputationChatgptMarque() {
  return (
    <>
      <p>Quand un client potentiel demande a ChatGPT "que pensez-vous de [votre marque] ?", la reponse qu'il obtient devient votre nouvelle carte de visite. Pas votre site web. Pas votre page Google. Une reponse generee par une IA, construite a partir de fragments de contenu eparpilles sur le web. Et vous n'avez aucun controle direct sur ce qu'elle dit.</p>

      <p>C'est la realite de l'e-reputation en 2026. Les moteurs IA ne se contentent plus de lister des liens : ils synthetisent, comparent et jugent. Si les sources qu'ils trouvent sur votre marque sont negatives, obsoletes ou inexistantes, la reponse generee le refletera. Et contrairement a un resultat Google que l'internaute peut ignorer, une reponse IA est percue comme un verdict objectif.</p>

      <p>Selon l'Edelman Trust Barometer 2026, 64 % des consommateurs font davantage confiance a une reponse IA qu'a une publicite de marque. Le probleme : vous ne pouvez pas acheter d'espace publicitaire dans ChatGPT. Votre seul levier est le contenu que les IA trouvent et choisissent de citer.</p>

      <h2>Comment ChatGPT construit une reponse sur votre marque</h2>

      <p>Pour comprendre comment gerer votre e-reputation IA, il faut d'abord comprendre le mecanisme. Les systemes comme ChatGPT, Perplexity et Gemini utilisent le RAG (Retrieval-Augmented Generation) : ils recherchent du contenu web, selectionnent les fragments les plus fiables, puis generent une reponse synthetique.</p>

      <p>Quand un utilisateur pose une question sur votre marque, le modele cherche dans plusieurs categories de sources :</p>

      <ul>
        <li><strong>Votre propre site web</strong> — pages a propos, produits, FAQ, blog</li>
        <li><strong>Les sites d'avis</strong> — Trustpilot, Google Reviews, G2, Capterra</li>
        <li><strong>Les articles de presse</strong> — mentions dans des medias en ligne</li>
        <li><strong>Les reseaux sociaux</strong> — LinkedIn, Twitter, Reddit</li>
        <li><strong>Les forums et communautes</strong> — discussions sur Reddit, Quora, forums specialises</li>
        <li><strong>Wikipedia et bases de connaissances</strong> — si votre marque y figure</li>
      </ul>

      <p>Le modele ne prend pas tout. Il triangule : si trois sources independantes confirment la meme information, elle est citee. Si une source contredit les autres, elle est ignoree ou mentionnee comme divergente. C'est pourquoi <InternalLink href="/blog/sources-contenus-citations-ia">sourcer vos contenus</InternalLink> est devenu critique.</p>

      <ArrowLink href="/blog/comment-chatgpt-choisit-ses-sources">Comment ChatGPT choisit ses sources : le mecanisme complet →</ArrowLink>

      <h2>Les 4 scenarios d'e-reputation IA</h2>

      <h3>Scenario 1 : Votre marque n'est pas citee du tout</h3>

      <p>C'est le cas le plus frequent pour les PME et les marques emergentes. L'utilisateur demande "quel est le meilleur [votre categorie] ?" et votre nom n'apparait pas. Vous etes invisible. Ce n'est pas un probleme de reputation — c'est un probleme d'existence aux yeux de l'IA.</p>

      <p>La cause principale : votre contenu n'est pas structure pour etre cite. Les IA privilegient les contenus avec des <InternalLink href="/blog/pourquoi-ia-adorent-chiffres-contenu-factuel">donnees chiffrees</InternalLink>, des sources verifiables et une structure claire. Si votre site ne repond pas directement aux questions que les utilisateurs posent, le modele n'a rien a extraire.</p>

      <h3>Scenario 2 : Votre marque est citee positivement</h3>

      <p>Le meilleur cas. ChatGPT recommande votre produit, cite vos avantages, mentionne vos points forts. Cela arrive quand :</p>

      <ul>
        <li>Votre site a un contenu riche et structure (FAQ, guides, comparatifs)</li>
        <li>Des sources externes fiables parlent bien de vous (presse, avis, temoignages)</li>
        <li>Votre <InternalLink href="/blog/eeat-ia-experience-expertise">autorite E-E-A-T</InternalLink> est etablie (expertise demontree, auteurs identifies)</li>
      </ul>

      <h3>Scenario 3 : Votre marque est citee negativement</h3>

      <p>L'utilisateur demande un avis sur votre marque et ChatGPT mentionne des problemes, des plaintes clients, des limites. Cela arrive quand les sources negatives (avis 1 etoile, articles critiques, threads Reddit) sont plus nombreuses ou plus recentes que les sources positives.</p>

      <p>Le reflexe naturel serait de vouloir "supprimer" ces sources. Mais les IA ne fonctionnent pas comme Google : vous ne pouvez pas demander un dereferencement. La seule strategie qui fonctionne est de <strong>noyer le negatif sous du positif verifiable</strong>.</p>

      <h3>Scenario 4 : L'IA dit des choses fausses sur votre marque</h3>

      <p>Les hallucinations existent. ChatGPT peut attribuer a votre marque un produit que vous ne vendez pas, un prix incorrect, ou une caracteristique inventee. Cela arrive quand le modele n'a pas assez de donnees fiables sur vous et "comble les trous" avec des inferences.</p>

      <p>La solution : fournir des informations factuelles, structurees et verifiables sur votre site. Plus le modele a de donnees fiables a votre sujet, moins il a besoin d'inventer. Le <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org</InternalLink> est votre meilleur allie ici.</p>

      <h2>Les 7 leviers pour gerer votre e-reputation IA</h2>

      <h3>1. Creez une page "A propos" complete et factuelle</h3>

      <p>C'est la source primaire que les IA consultent sur votre marque. Elle doit contenir : date de creation, fondateurs (avec biographies), nombre de clients, chiffres cles, certifications, partenaires. Pas de langage marketing — des faits. Les IA ignorent les superlatifs non sources mais citent volontiers les donnees verifiables.</p>

      <p>Ajoutez un Schema Organization en JSON-LD avec les champs <code>foundingDate</code>, <code>founder</code>, <code>numberOfEmployees</code>, <code>sameAs</code> (liens vers vos profils sociaux). C'est le signal structurel le plus fort pour les modeles RAG.</p>

      <h3>2. Publiez des contenus qui repondent aux questions de vos clients</h3>

      <p>Les utilisateurs ne demandent pas "parlez-moi de [marque]". Ils posent des questions concretes : "est-ce que [marque] est fiable ?", "quelles sont les alternatives a [marque] ?", "[marque] vs [concurrent] — lequel choisir ?". Si votre site repond a ces questions de maniere factuelle, les IA vous citeront.</p>

      <p>Creez une FAQ exhaustive, un comparatif honnete avec vos concurrents (oui, mentionnez-les), et des guides d'utilisation. La <InternalLink href="/blog/faq-schema-faqpage-combo-ia">combinaison FAQ + Schema FAQPage</InternalLink> est un des leviers les plus efficaces.</p>

      <h3>3. Sollicitez des avis clients sur les bonnes plateformes</h3>

      <p>Les IA lisent Trustpilot, G2, Capterra, Google Reviews. La quantite compte, mais la recence compte encore plus. Un avis de 2024 pese moins qu'un avis de 2026. Mettez en place un processus systematique de collecte d'avis apres chaque vente ou interaction client.</p>

      <p>Les <InternalLink href="/blog/avis-clients-temoignages-visibilite-ia">temoignages clients structures</InternalLink> sur votre propre site comptent aussi — surtout s'ils incluent le nom, le role et l'entreprise du temoin.</p>

      <h3>4. Investissez dans la presse et les mentions externes</h3>

      <p>Les IA triangulent. Si seul votre site parle de vous, c'est un signal faible. Si des medias independants, des blogs d'experts ou des etudes de cas vous mentionnent, votre credibilite augmente considerablement. L'etude de Princeton (KDD 2024) montre que les contenus cites par des sources externes obtiennent <strong>2,4x plus de citations IA</strong>.</p>

      <p>Les <InternalLink href="/blog/backlinks-geo-autorite-domaine-ia">backlinks et l'autorite de domaine</InternalLink> jouent un role direct dans la visibilite IA, pas seulement en SEO.</p>

      <h3>5. Maitrisez votre presence sur LinkedIn et les reseaux sociaux</h3>

      <p>ChatGPT et Perplexity indexent LinkedIn. Un profil d'entreprise complet avec des publications regulieres, des articles de fond et des interactions est une source que les IA consultent. C'est particulierement vrai pour le B2B. Notre guide sur <InternalLink href="/blog/linkedin-geo-profil-visibilite-ia">LinkedIn et la visibilite IA</InternalLink> detaille les bonnes pratiques.</p>

      <h3>6. Surveillez ce que les IA disent de vous</h3>

      <p>Avant de corriger, il faut mesurer. Posez regulierement a ChatGPT, Perplexity, Gemini et Copilot des questions sur votre marque et notez les reponses. Les outils de <InternalLink href="/blog/mesurer-visibilite-ia-outils-methodes-2026">mesure de visibilite IA</InternalLink> permettent d'automatiser ce suivi.</p>

      <InlineCTA href="/pricing">Decouvrez comment les IA percoivent votre marque</InlineCTA>

      <h3>7. Mettez a jour vos contenus regulierement</h3>

      <p>Les IA privilegient les contenus recents. Un article de blog mis a jour avec une date <code>dateModified</code> en 2026 sera prefere a un contenu de 2023. La <InternalLink href="/blog/sitemap-robots-txt-bots-ia-2026">fraicheur des signaux temporels</InternalLink> est un des 7 criteres GEO. C'est aussi un critere de credibilite pour l'e-reputation : des informations obsoletes sur votre marque donnent une impression d'abandon.</p>

      <h2>Le cas particulier des hallucinations de marque</h2>

      <p>Quand ChatGPT invente des informations sur votre marque, la reaction naturelle est l'indignation. Mais le probleme est structurel : le modele n'a pas trouve assez de donnees fiables et a comble le vide. La solution n'est pas de contacter OpenAI (ils ne corrigent pas les reponses individuelles), mais de fournir des donnees tellement claires que le modele ne peut plus se tromper.</p>

      <p>Concretement :</p>

      <ul>
        <li><strong>Structurez vos donnees en JSON-LD</strong> — Schema Organization, Product, Service avec tous les champs remplis</li>
        <li><strong>Publiez vos chiffres officiels</strong> — revenus, nombre de clients, date de creation, sur votre site et sur des sources tierces</li>
        <li><strong>Creez une page de presse</strong> — avec vos communiques, vos logos et vos chiffres cles, facilement accessible et indexable</li>
        <li><strong>Autorisez le crawl IA</strong> — verifiez que votre <InternalLink href="/blog/llms-txt-robots-crawlabilite-ia">robots.txt n'interdit pas les bots IA</InternalLink></li>
      </ul>

      <h2>E-reputation IA vs e-reputation Google : les differences</h2>

      <p>L'e-reputation traditionnelle (Google) se gere en controlant les 10 premiers resultats de recherche pour votre marque. Vous pouvez pousser du contenu positif en haut de page et noyer le negatif.</p>

      <p>L'e-reputation IA est fondamentalement differente :</p>

      <ul>
        <li><strong>Pas de "page 1"</strong> — l'IA synthetise une seule reponse, pas une liste de liens</li>
        <li><strong>Pas de SEO direct</strong> — vous ne pouvez pas optimiser votre position dans une reponse IA</li>
        <li><strong>Les sources sont invisibles</strong> — l'utilisateur voit la reponse, pas les sources qui l'ont construite</li>
        <li><strong>Les avis comptent enormement</strong> — les IA donnent un poids disproportionne aux avis clients par rapport a Google</li>
        <li><strong>La fraicheur est critique</strong> — une crise de reputation recenteen sera mentionnee immediatement, meme si votre page Google est propre</li>
      </ul>

      <p>Pour comprendre en detail comment les moteurs IA different du SEO classique, consultez notre <InternalLink href="/blog/seo-vs-geo-differences-2026">comparatif SEO vs GEO</InternalLink>.</p>

      <h2>Comment mesurer votre e-reputation IA</h2>

      <p>Trois indicateurs a suivre :</p>

      <ol>
        <li><strong>Taux de mention</strong> — sur 10 questions liees a votre secteur, combien de fois votre marque est-elle citee ?</li>
        <li><strong>Sentiment</strong> — quand vous etes cite, est-ce positif, neutre ou negatif ?</li>
        <li><strong>Concurrents cites a votre place</strong> — quand vous n'etes pas cite, qui l'est ?</li>
      </ol>

      <p>L'<InternalLink href="/blog/audit-geo-visibilite-ia">audit GEO</InternalLink> mesure exactement ces trois indicateurs. Le test de citation IA envoie 10 a 30 requetes reelles a ChatGPT et analyse les reponses pour determiner votre visibilite et celle de vos concurrents.</p>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">Comprendre le score GEO et ce qu'il mesure →</ArrowLink>

      <h2>Plan d'action : reprendre le controle en 30 jours</h2>

      <p><strong>Semaine 1 :</strong> Auditez votre situation actuelle. Posez 10 questions sur votre marque a ChatGPT, Perplexity et Gemini. Notez les reponses. Identifiez les informations fausses, obsoletes ou manquantes.</p>

      <p><strong>Semaine 2 :</strong> Corrigez votre site. Mettez a jour votre page A propos avec des donnees factuelles. Ajoutez un Schema Organization complet. Creez ou enrichissez votre FAQ avec les vraies questions de vos clients.</p>

      <p><strong>Semaine 3 :</strong> Renforcez les sources externes. Lancez une campagne de collecte d'avis clients. Publiez un article de blog cite par des donnees verifiables. Contactez 3 medias de votre secteur pour une mention ou un interview.</p>

      <p><strong>Semaine 4 :</strong> Mesurez l'impact. Reposez les memes questions aux IA. Comparez les reponses avec celles de la semaine 1. Le changement ne sera pas immediat (les IA mettent du temps a reindexer), mais les bases seront posees.</p>

      <InlineCTA href="/pricing">Faites votre audit GEO pour mesurer votre e-reputation IA</InlineCTA>

      <h2>Conclusion</h2>

      <p>L'e-reputation IA n'est pas une mode passagere. En 2026, une part croissante des decisions d'achat commence par une question a un assistant IA. Si la reponse que l'IA donne sur votre marque est inexistante, incorrecte ou negative, vous perdez des clients sans meme le savoir.</p>

      <p>La bonne nouvelle : les leviers sont connus et mesurables. Un contenu factuel, des sources verifiables, des avis recents, une presence multi-canal. Ce sont les memes fondamentaux qu'en SEO, mais appliques avec une logique de citabilite IA. Et contrairement au SEO ou la competition est feroce sur les mots-cles, le GEO est encore un terrain ou les premiers a investir prennent une avance durable.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">Le guide complet du GEO en 2026 →</ArrowLink>
    </>
  );
}
