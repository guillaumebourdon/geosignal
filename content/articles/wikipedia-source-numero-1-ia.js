import Link from 'next/link';

function InternalLink({ href, children }) {
  return (
    <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}
      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
    >{children}</Link>
  );
}

function InlineCTA() {
  return (
    <div style={{ background: '#1A1916', borderRadius: 12, padding: '24px 28px', margin: '32px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
      <div>
        <div style={{ color: '#F7F5F2', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Votre site est-il structure comme Wikipedia ?</div>
        <div style={{ color: 'rgba(247,245,242,0.6)', fontSize: 13 }}>Testez gratuitement votre score de citabilite IA.</div>
      </div>
      <Link href="/" style={{ background: '#D97757', color: '#fff', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Analyser mon site</Link>
    </div>
  );
}

export default function WikipediaSourceIA() {
  return (
    <>
      <p>Wikipedia represente <strong>7,8 % de toutes les citations de ChatGPT</strong> et apparait dans <strong>47,9 % des reponses</strong> quand une source est citee (Yext, 17,2 millions de citations analysees, janvier 2026). Aucun autre domaine ne s'en approche. Pour Perplexity, c'est Reddit qui domine (46,7 %), mais Wikipedia reste dans le top 5 de chaque moteur IA. Ce n'est pas un hasard. Wikipedia est le modele parfait de contenu que les IA veulent citer. Et comprendre pourquoi permet de s'en inspirer pour votre propre site.</p>

      <h2>Les chiffres : Wikipedia domine tous les moteurs IA</h2>

      <p>L'etude Yext de janvier 2026, portant sur 17,2 millions de citations IA, donne une image claire :</p>

      <ul>
        <li><strong>ChatGPT</strong> : Wikipedia represente 47,9 % des sources citees, loin devant tout autre domaine</li>
        <li><strong>Perplexity</strong> : Wikipedia est dans le top 5, derriere Reddit (46,7 %) mais devant la plupart des sites d'autorite</li>
        <li><strong>Gemini</strong> : privilegia les sites officiels (52,15 % de sources "brand-owned") mais cite Wikipedia pour les requetes factuelles</li>
        <li><strong>Claude</strong> : favorise les contenus verifiables et transparents, ou Wikipedia excelle</li>
      </ul>

      <p>Autre donnee revelateur : l'etude ALM Corp (1,2 million de reponses ChatGPT, 18 012 citations verifiees) confirme que les pages structurees comme Wikipedia, avec des "answer capsules" auto-suffisantes, ont un <strong>taux de citation de 72,4 %</strong>.</p>

      <h2>Pourquoi les IA adorent Wikipedia : 6 facteurs structurels</h2>

      <p>Wikipedia n'est pas cite parce qu'il est celebre. Il est cite parce que sa structure correspond exactement a ce que les systemes RAG (Retrieval-Augmented Generation) recherchent pour generer des reponses fiables.</p>

      <h3>1. Des answer capsules parfaits</h3>

      <p>Chaque article Wikipedia commence par un paragraphe d'introduction de 30 a 60 mots qui repond directement a la question "qu'est-ce que X ?". C'est exactement ce que les IA extraient en priorite. L'etude ALM Corp montre que <strong>44,2 % des citations proviennent des 30 premiers % du texte</strong> d'une page. Wikipedia met l'essentiel en premier, systematiquement.</p>

      <h3>2. Un ton parfaitement neutre</h3>

      <p>Wikipedia interdit le langage promotionnel, les superlatifs et les affirmations non sourcees. C'est exactement ce que les IA valorisent : l'etude Semrush montre une <strong>correlation negative de -26 % entre le ton promotionnel et les citations IA</strong>. Quand votre page dit "le meilleur outil du marche", les IA se detournent. Quand elle dit "un outil utilise par 5 000 entreprises depuis 2019", elles citent.</p>

      <h3>3. Des sources verifiables partout</h3>

      <p>Chaque affirmation sur Wikipedia est accompagnee d'une reference numerotee. L'etude Princeton/Georgia Tech (KDD 2024) demontre que <strong>l'ajout de citations de sources externes augmente la visibilite IA de 115 %</strong> pour les sites de rang moyen. Wikipedia applique ce principe de maniere systematique, avec parfois plus de 100 references par article.</p>

      <h3>4. Une structure de headings logique</h3>

      <p>Wikipedia utilise une hierarchie H2/H3 rigoureuse et descriptive. Pas de titres vagues comme "Nos solutions" ou "En savoir plus". Les titres sont informatifs : "Histoire", "Fonctionnement", "Critiques", "Voir aussi". L'etude ConvertMate (2026) montre que <strong>68,7 % des pages citees par les IA suivent une hierarchie de titres claire</strong>.</p>

      <h3>5. Un contenu profond et complet</h3>

      <p>Les articles Wikipedia font regulierement 3 000 a 20 000 mots. L'etude ConvertMate confirme qu'un contenu de plus de 20 000 caracteres a un <strong>multiplicateur de citation de 4,3x</strong> par rapport a un contenu court. Les IA privilegient les sources qui couvrent un sujet en profondeur plutot que superficiellement.</p>

      <h3>6. Une fraicheur constante</h3>

      <p>Wikipedia est mis a jour en continu par des milliers de contributeurs. Les IA favorisent le contenu recent : selon la regle des 13 semaines, <strong>les pages non mises a jour depuis plus de 13 semaines perdent significativement en probabilite de citation</strong>. Wikipedia ne souffre jamais de ce probleme.</p>

      <InlineCTA />

      <h2>Ce que votre site peut copier de Wikipedia (et ce qu'il ne peut pas)</h2>

      <h3>Ce que vous pouvez reproduire</h3>

      <ul>
        <li><strong>L'introduction directe</strong> : commencez chaque page par 30-50 mots qui repondent a la question principale. Pas de formule de bienvenue, pas de slogan. La reponse d'abord.</li>
        <li><strong>Les sources dans le texte</strong> : chaque chiffre, chaque affirmation factuelle devrait avoir un lien vers sa source. "Notre taux de satisfaction est de 98 % (enquete client Q1 2026, 1 200 repondants)" est citable. "Nos clients nous adorent" ne l'est pas.</li>
        <li><strong>Les titres descriptifs</strong> : remplacez "Nos avantages" par "Comment [votre produit] reduit le temps de [tache] de 40 %". Mieux encore, formulez-les en question : "Combien coute [votre service] en 2026 ?"</li>
        <li><strong>Le ton factuel</strong> : supprimez les superlatifs non prouves. Remplacez "leader du marche" par "utilise par X entreprises dans Y pays". Les IA citent les faits, pas les pretentions.</li>
        <li><strong>La profondeur</strong> : un guide de 2 000+ mots qui couvre un sujet en entier sera cite. Une page de 300 mots qui survole le sujet ne le sera pas.</li>
      </ul>

      <h3>Ce que vous ne pouvez pas reproduire (et ce n'est pas grave)</h3>

      <ul>
        <li><strong>L'autorite de domaine</strong> : Wikipedia a 25 ans d'historique et des millions de backlinks. Vous ne rattraperez pas ca. Mais l'autorite de domaine n'est que le 4e facteur de citation IA, derriere la structure du contenu, les sources, et la fraicheur.</li>
        <li><strong>La neutralite totale</strong> : votre site vend quelque chose, et c'est normal. L'objectif n'est pas d'etre Wikipedia, mais d'etre <em>aussi citable que Wikipedia</em> sur votre domaine d'expertise.</li>
        <li><strong>Le volume de contributeurs</strong> : mais vous pouvez compenser par un <InternalLink href="/blog/contenu-long-vs-court-ia">calendrier de mise a jour regulier</InternalLink> (trimestriel minimum).</li>
      </ul>

      <h2>Le test : votre page vs un article Wikipedia</h2>

      <p>Prenez la page principale de votre site et comparez-la a l'article Wikipedia de votre secteur. Posez-vous ces questions :</p>

      <ol>
        <li><strong>Introduction</strong> : votre premiere phrase repond-elle directement a "qu'est-ce que [votre activite] ?" En 30-50 mots ?</li>
        <li><strong>Sources</strong> : combien de liens vers des sources externes avez-vous ? Wikipedia en a des dizaines. Visez au moins 5 par page.</li>
        <li><strong>Donnees chiffrees</strong> : combien de chiffres avec unites et sources apparaissent dans votre contenu ? Visez 5 a 10 par page.</li>
        <li><strong>Titres</strong> : vos H2 sont-ils descriptifs et specifiques, ou vagues et generiques ?</li>
        <li><strong>Ton</strong> : combien de superlatifs non prouves ("le meilleur", "unique", "revolutionnaire") votre page contient-elle ?</li>
        <li><strong>Profondeur</strong> : votre page fait-elle plus de 1 500 mots sur le sujet ?</li>
      </ol>

      <p>Si vous repondez "non" a plus de 3 de ces questions, votre page est structurellement moins citable qu'un article Wikipedia. Les IA choisiront Wikipedia a votre place.</p>

      <h2>Comment Detekia mesure ces signaux</h2>

      <p>Les 7 criteres de l'<InternalLink href="/blog/geo-guide-complet-2026">audit GEO Detekia</InternalLink> sont directement inspires de ce qui fait le succes de Wikipedia dans les reponses IA :</p>

      <ul>
        <li><strong>Citabilite (25 pts)</strong> : detecte les answer capsules, le front-loading et les paragraphes modulaires, exactement comme les introductions Wikipedia</li>
        <li><strong>Verifiabilite (20 pts)</strong> : compte les donnees chiffrees sourcees, les liens externes et les citations d'experts, comme les references Wikipedia</li>
        <li><strong>Autorite (15 pts)</strong> : verifie l'identification de l'auteur et le langage definitif, les signaux de confiance que Wikipedia fournit via sa communaute</li>
        <li><strong>Neutralite (10 pts)</strong> : mesure le ton factuel vs promotionnel, le principe fondateur de Wikipedia</li>
        <li><strong>Fraicheur (10 pts)</strong> : verifie les dates de mise a jour, le signal que Wikipedia envoie en continu</li>
      </ul>

      <InlineCTA />

      <h2>Le paradoxe : Wikipedia n'est pas optimise pour le GEO</h2>

      <p>Wikipedia n'a jamais fait de GEO. Personne chez Wikipedia ne se demande "comment etre cite par ChatGPT ?". Et pourtant, c'est la source n°1. Pourquoi ? Parce que les criteres que les IA utilisent pour selectionner leurs sources sont les memes que les principes editoriaux de Wikipedia : neutralite, verificabilite, exhaustivite, structure claire.</p>

      <p>Le GEO n'est pas une discipline artificielle inventee pour vendre des outils. C'est la formalisation de ce que Wikipedia fait naturellement depuis 25 ans. Les moteurs IA ont ete entraines sur Wikipedia, et ils cherchent des contenus qui ressemblent a Wikipedia. Comprendre ca, c'est comprendre l'essence du GEO.</p>

      <p>La bonne nouvelle : vous n'avez pas besoin d'etre Wikipedia. Vous avez juste besoin d'ecrire sur votre domaine d'expertise avec la meme rigueur que Wikipedia applique a ses articles. Faits sources, structure claire, ton neutre, contenu profond. Les IA feront le reste.</p>
    </>
  );
}
