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

function GroupCard({ color, label, points, criteria, description, priority }) {
  return (
    <div style={{ border: `1px solid ${color}30`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: '20px 24px', marginBottom: 16, background: `${color}06` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#B0ABA5' }}>{points} pts max</span>
      </div>
      <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', margin: '0 0 8px', lineHeight: 1.5 }}><strong style={{ color: '#3A3835' }}>Critères :</strong> {criteria}</p>
      <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', margin: '0 0 8px', lineHeight: 1.5 }}>{description}</p>
      <p style={{ fontFamily: 'monospace', fontSize: 10, color, margin: 0, letterSpacing: 1 }}>PRIORITÉ : {priority}</p>
    </div>
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

export default function ScoreGeoMesurerVisibiliteIa() {
  return (
    <>
      <p>Vous ne pouvez pas améliorer ce que vous ne mesurez pas. Et en GEO, la mesure est le principal obstacle. Il n'existe pas de Google Search Console pour ChatGPT. Pas de rapport de positions dans Perplexity. Pas de données de clics depuis Gemini.</p>

      <p>Pourtant, la visibilité IA se mesure. Pas avec les mêmes outils ni les mêmes métriques qu'en SEO, mais avec une approche structurée qui vous donne un diagnostic clair et des priorités d'action.</p>

      <p>Cet article vous explique ce qu'est un score GEO, comment il se calcule — en complément du <InternalLink href="/blog/geo-guide-complet-2026">guide complet GEO 2026</InternalLink>, comment interpréter vos résultats, et surtout par quoi commencer pour améliorer votre visibilité dans les réponses des IA.</p>

      <h2>Pourquoi mesurer sa visibilité IA est difficile</h2>

      <p>En SEO, l'écosystème de mesure est mature. Google Search Console vous indique quelles requêtes mènent à votre site, quelles pages sont indexées, quel est votre CTR. Des outils comme Ahrefs, Semrush ou Sistrix suivent vos positions au quotidien.</p>

      <p>En GEO, rien de tout cela n'existe — pour trois raisons fondamentales.</p>

      <p><strong>Les réponses IA sont dynamiques.</strong> Contrairement aux SERP de Google qui sont relativement stables, les réponses de ChatGPT ou Perplexity changent à chaque requête. Poser la même question deux fois peut donner des réponses différentes, citant des sources différentes. Il n'y a pas de "position 1" fixe.</p>

      <p><strong>Les IA ne partagent pas leurs données.</strong> OpenAI, Google et Anthropic ne fournissent pas de console d'analyse pour les éditeurs de sites. Vous ne pouvez pas savoir combien de fois ChatGPT a cité votre site, ni pour quelles requêtes.</p>

      <p><strong>Les citations sont contextuelles.</strong> Une IA peut citer votre site pour une requête et pas pour une autre très similaire. La citation dépend du contexte de la conversation, de la formulation de la question, et parfois même du profil de l'utilisateur.</p>

      <p>Malgré ces difficultés, deux approches complémentaires permettent de mesurer votre visibilité IA.</p>

      <h2>Approche 1 : le test manuel</h2>

      <p>C'est la méthode la plus directe. Elle consiste à interroger les moteurs IA comme le ferait un client potentiel, et à observer si votre site apparaît dans les réponses.</p>

      <h3>Comment procéder</h3>

      <p><strong>Étape 1 — Définir vos requêtes cibles</strong></p>

      <p>Listez 10 à 15 questions que vos clients posent réellement. Pensez en trois catégories :</p>

      <ul>
        <li><strong>Requêtes de recommandation</strong> : "Quel est le meilleur [service] à [ville] ?", "Quelle solution pour [problème] ?"</li>
        <li><strong>Requêtes d'expertise</strong> : "Comment [faire X] ?", "Quelle différence entre [A] et [B] ?"</li>
        <li><strong>Requêtes de marque</strong> : "Que fait [votre entreprise] ?", "Avis sur [votre produit]"</li>
      </ul>

      <p><strong>Étape 2 — Interroger 3 moteurs IA</strong></p>

      <p>Posez chaque question sur ChatGPT, Gemini et Perplexity. Pour chaque réponse, notez :</p>

      <ul>
        <li>Votre site est-il cité comme source ? (oui/non)</li>
        <li>Votre marque est-elle mentionnée ? (oui/non)</li>
        <li>Quels concurrents sont cités ?</li>
        <li>La réponse reprend-elle du contenu de votre site ?</li>
      </ul>

      <p><strong>Étape 3 — Analyser les résultats</strong></p>

      <p>Comptez votre taux de présence : sur vos 10-15 requêtes × 3 moteurs, dans quel pourcentage des réponses apparaissez-vous ? En dessous de 20 %, vous avez un problème de visibilité IA significatif.</p>

      <h3>Limites du test manuel</h3>

      <p>Cette approche donne une photographie à un instant T, pas un suivi dans le temps. Elle est aussi subjective : les résultats varient selon la formulation et le contexte. C'est un bon point de départ, mais ça ne suffit pas pour piloter une stratégie GEO.</p>

      <h2>Approche 2 : l'audit technique</h2>

      <p>L'audit technique analyse votre site sur les critères objectifs qui déterminent la citabilité IA. Contrairement au test manuel, il mesure le <em>potentiel</em> de citation — les conditions techniques et éditoriales qui maximisent vos chances d'être sélectionné comme source.</p>

      <p>C'est cette approche que Detekia utilise : un audit automatisé qui évalue votre site sur 7 critères pondérés et vous attribue un score sur 100.</p>

      <h2>Les 7 critères du score GEO Detekia</h2>

      <p>Chaque critère est mesuré par analyse du DOM réel de votre page — pas par estimation ou approximation. Pour une explication détaillée de chaque critère, consultez <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">les 7 critères de la méthodologie Detekia</InternalLink>.</p>

      <h3>1. Citabilité & réponse directe (25 points)</h3>

      <p>Ce critère mesure si votre contenu contient des réponses prêtes à être extraites par une IA. L'analyse vérifie :</p>

      <ul>
        <li>La présence d'une introduction substantielle dans les 100 premiers mots</li>
        <li>La densité informationnelle des paragraphes (faits, chiffres, définitions vs. texte vague)</li>
        <li>L'utilisation de listes et tableaux qui structurent l'information</li>
        <li>La présence de réponses directes aux questions implicites de la page</li>
      </ul>

      <p><strong>Score typique observé :</strong> la majorité des sites obtiennent entre 8 et 15 sur 25. Les sites avec des introductions commerciales floues ou des pages d'accueil sans contenu informatif tombent en dessous de 8.</p>

      <h3>2. Vérifiabilité & preuves (20 points)</h3>

      <p>Ce critère mesure la densité de preuves vérifiables dans votre contenu : statistiques et chiffres précis, sources nommées (études, rapports, institutions), dates de référence, exemples concrets et cas d'usage.</p>

      <p><strong>Score typique observé :</strong> les sites B2B avec du contenu expert scorent entre 12 et 18. Les sites avec un discours purement commercial tombent à 4-8.</p>

      <h3>3. Autorité & E-E-A-T (15 points)</h3>

      <p>Ce critère évalue les signaux d'expertise et de crédibilité : page À propos complète avec informations vérifiables, auteurs identifiés sur les contenus, mentions légales complètes, signaux de confiance (certifications, références clients, logos partenaires). Il intègre également les signaux de données structurées (balisage Schema.org : <code>Organization</code>, <code>Article</code>, <code>FAQPage</code>), qui renforcent la compréhension de votre identité et de votre expertise par les IA.</p>

      <p><strong>Score typique observé :</strong> 6 à 10 sur 15 pour les PME. Les freelances sans page À propos tombent à 2-4. Les entreprises avec des auteurs identifiés et une page institutionnelle complète atteignent 12-15.</p>

      <h3>4. Accessibilité IA (10 points)</h3>

      <p>Ce critère vérifie si les bots IA peuvent accéder à votre contenu :</p>

      <ul>
        <li>Analyse du fichier <code>robots.txt</code> pour les user-agents IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)</li>
        <li>Présence d'un fichier <code>llms.txt</code></li>
        <li>Accessibilité du contenu sans JavaScript obligatoire</li>
        <li>Sitemap XML accessible</li>
      </ul>

      <p><strong>Score typique observé :</strong> très variable. Les sites qui bloquent les bots IA (souvent sans le savoir) obtiennent 0 à 3. Ceux qui ne les bloquent pas mais n'ont pas de <code>llms.txt</code> obtiennent 8-10. Les sites pleinement optimisés atteignent 13-15.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Pour corriger les problèmes d'accessibilité IA, consultez llms.txt, robots.txt et accessibilité IA.</ArrowLink>

      <h3>5. Neutralité éditoriale (10 points)</h3>

      <p>Ce critère évalue le ton de votre contenu — analysé par IA : absence de superlatifs non sourcés ("le meilleur", "le leader", "inégalé"), ton factuel et informatif plutôt que promotionnel, présence de comparaisons équilibrées, absence de manipulation émotionnelle.</p>

      <p><strong>Score typique observé :</strong> 4 à 7 pour la majorité des sites. Les sites avec un ton très commercial tombent à 2-3. Les sites éditoriaux et techniques atteignent 8-10.</p>

      <h3>6. Présence externe (10 points)</h3>

      <p>Ce critère évalue votre visibilité en dehors de votre propre site : mentions sur des sites tiers (presse, forums, annuaires), profils actifs sur des plateformes reconnues (LinkedIn, Reddit), citations dans des contenus d'autres éditeurs.</p>

      <p><strong>Score typique observé :</strong> 1 à 3 pour les PME et startups. Les entreprises avec une stratégie de relations presse active atteignent 4-5.</p>

      <h3>7. Fraîcheur & signaux temporels (10 points)</h3>

      <p>Ce critère vérifie l'actualité de votre contenu : date de dernière modification visible, fréquence de mise à jour, absence de contenus obsolètes (dates périmées, stats anciennes).</p>

      <p><strong>Score typique observé :</strong> 2 à 3 pour les sites mis à jour régulièrement. 0-1 pour les sites dont le dernier contenu date de plus d'un an.</p>

      <h2>Comment interpréter votre score</h2>

      <h3>Les seuils</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '24px 0' }}>
        {[
          { range: '75 – 100', label: 'Excellent', color: '#10A37F', text: 'Votre site est bien positionné pour être cité par les IA. Concentrez-vous sur les critères qui ne sont pas au maximum et sur le suivi dans le temps.' },
          { range: '45 – 74', label: 'Moyen', color: '#C9861A', text: 'Vous avez des fondations, mais des lacunes significatives empêchent votre site d\'être cité régulièrement. Identifiez les 2-3 critères les plus faibles et corrigez-les en priorité.' },
          { range: '0 – 44', label: 'Faible', color: '#D97757', text: 'Votre site a peu de chances d\'être cité par les IA dans son état actuel. Des corrections structurelles sont nécessaires. La bonne nouvelle : les marges de progression sont importantes et les premiers gains seront rapides.' },
        ].map(({ range, label, color, text }) => (
          <div key={range} style={{ border: `1px solid ${color}30`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: '16px 20px', background: `${color}06` }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, color, fontWeight: 600 }}>{range}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color, letterSpacing: 2, textTransform: 'uppercase' }}>{label}</span>
            </div>
            <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', margin: 0, lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}
      </div>

      <h3>Le score moyen observé</h3>

      <p>Sur l'ensemble des sites analysés par Detekia, le score moyen se situe autour de <strong>38/100</strong>. La majorité des sites ne sont pas du tout optimisés pour les moteurs génératifs. C'est une mauvaise nouvelle pour eux, mais une bonne nouvelle pour vous : en optimisant maintenant, vous prenez une longueur d'avance considérable sur vos concurrents.</p>

      <h3>Le critère le plus souvent défaillant</h3>

      <p>L'Citabilité est le critère le plus fréquemment sous-optimisé. La plupart des sites ont du contenu, mais ce contenu n'est pas structuré pour être extrait et cité par une IA. C'est aussi le critère qui pèse le plus lourd (25 points) — donc celui où les gains sont les plus importants.</p>

      <h2>Comment lire les groupes thématiques</h2>

      <p>Detekia organise les 7 critères en 3 groupes thématiques qui facilitent la lecture et la priorisation :</p>

      <GroupCard
        color="#4285F4"
        label="Lisibilité IA"
        points={50}
        criteria="Citabilité + Accessibilité IA + Données structurées"
        description="Ce groupe mesure si les IA peuvent accéder à votre contenu et le comprendre. C'est la base technique. Si ce groupe est faible, les IA ne peuvent pas vous citer — même si votre contenu est excellent."
        priority="Haute — corrections souvent rapides (robots.txt, Schema.org, restructuration des introductions)"
      />

      <GroupCard
        color="#10A37F"
        label="Crédibilité"
        points={45}
        criteria="Vérifiabilité + Autorité + Neutralité + Présence externe"
        description="Ce groupe mesure si les IA font confiance à votre contenu. Même si elles peuvent le lire, elles ne le citeront pas s'il n'est pas perçu comme crédible."
        priority="Moyenne — demande plus de travail (sourcer les affirmations, développer la présence externe, ajuster le ton)"
      />

      <GroupCard
        color="#C9861A"
        label="Fraîcheur"
        points={5}
        criteria="Fraîcheur & signaux temporels"
        description="Ce groupe mesure si votre contenu est actuel et maintenu. C'est un signal faible mais constant : les IA privilégient les contenus récents."
        priority="Continue — pas un chantier ponctuel mais une discipline régulière"
      />

      <h2>Prioriser vos actions par impact</h2>

      <p>Tous les critères n'ont pas le même poids, et toutes les corrections n'ont pas le même rapport effort/impact. Voici comment prioriser :</p>

      <h3>Actions à impact immédiat (cette semaine)</h3>

      <ul>
        <li><strong>Débloquer les crawlers IA</strong> — si votre <code>robots.txt</code> bloque GPTBot ou ClaudeBot, vous passez de 0 à potentiellement 12-15 points en accessibilité IA juste en supprimant quelques lignes. Effort : 15 minutes. Impact : jusqu'à +15 points.</li>
        <li><strong>Réécrire les introductions de vos pages clés</strong> — ajoutez une réponse directe dans les 100 premiers mots de vos 5 pages principales. Effort : 1-2 heures. Impact : jusqu'à +10 points en citabilité.</li>
        <li><strong>Ajouter Schema Organization</strong> — un seul bloc JSON-LD sur votre homepage. Effort : 30 minutes. Impact : +2-3 points en données structurées.</li>
      </ul>

      <h3>Actions à impact moyen terme (ce mois)</h3>

      <ul>
        <li><strong>Sourcer vos affirmations</strong> — passez en revue vos pages clés et remplacez chaque affirmation vague par une preuve. Effort : une demi-journée. Impact : jusqu'à +8 points en vérifiabilité.</li>
        <li><strong>Compléter vos données structurées</strong> — ajoutez <code>Article</code> sur vos contenus éditoriaux et <code>FAQPage</code> sur vos pages FAQ. Effort : 2-3 heures. Impact : +4-6 points en données structurées.</li>
        <li><strong>Créer ou compléter votre page À propos</strong> — photo, bio, parcours, expertise, coordonnées. Effort : 2 heures. Impact : +3-5 points en autorité.</li>
      </ul>

      <h3>Actions à impact long terme (ce trimestre)</h3>

      <ul>
        <li><strong>Développer votre présence externe</strong> — Reddit, presse sectorielle, articles invités. Effort : continu. Impact : +2-4 points en présence externe, plus des effets indirects sur l'autorité.</li>
        <li><strong>Ajuster le ton éditorial</strong> — réécrire les contenus trop commerciaux dans un ton factuel et expert. Effort : variable. Impact : +3-5 points en neutralité.</li>
      </ul>

      <h2>Suivre l'évolution dans le temps</h2>

      <p>Un score unique est utile pour diagnostiquer. Mais c'est le <InternalLink href="/blog/mesurer-visibilite-ia-outils-methodes-2026">suivi dans le temps</InternalLink> qui permet de piloter une stratégie GEO.</p>

      <h3>Ce qu'il faut suivre</h3>

      <ul>
        <li>Le score global — augmente-t-il après chaque vague d'optimisation ?</li>
        <li>Les scores par critère — quel critère progresse, lequel stagne ?</li>
        <li>Le score par rapport aux concurrents — analysez les sites de vos concurrents sur Detekia pour vous situer</li>
        <li>Les résultats du test manuel — refaites le test des 3 questions (recommandation, expertise, marque) chaque mois</li>
      </ul>

      <h3>Fréquence recommandée</h3>

      <ul>
        <li><strong>Audit technique</strong> : après chaque vague d'optimisation, puis mensuellement</li>
        <li><strong>Test manuel</strong> : mensuellement sur vos 5 requêtes principales</li>
        <li><strong>Revue éditoriale</strong> : trimestriellement pour la mise à jour des contenus</li>
      </ul>

      <h3>Les corrélations à observer</h3>

      <p>Après une optimisation technique (<code>robots.txt</code>, Schema.org), observez le test manuel 2-4 semaines plus tard. Vous devriez constater une amélioration de votre présence dans les réponses IA.</p>

      <p>Après une optimisation de contenu (citabilité, vérifiabilité), comptez 4-8 semaines avant de voir un impact sur les citations.</p>

      <p>Après un travail de présence externe (Reddit, presse), comptez 8-12 semaines. C'est le levier le plus lent mais aussi le plus durable.</p>

      <h2>Ce que le score ne mesure pas</h2>

      <p>Le score GEO est un indicateur de potentiel, pas une garantie de citation. Quelques nuances importantes :</p>

      <p><strong>Le score ne prédit pas les requêtes exactes.</strong> Avoir un bon score signifie que votre site remplit les conditions techniques et éditoriales pour être cité. Mais les IA décident au cas par cas pour chaque requête. Un score de 85/100 ne signifie pas que vous serez cité dans 85 % des réponses.</p>

      <p><strong>Le score ne mesure pas la pertinence thématique.</strong> Si votre site est parfaitement optimisé techniquement mais que votre contenu ne traite pas du sujet demandé par l'utilisateur, l'IA ne vous citera pas. Le GEO optimise les conditions de citation, pas la pertinence du contenu.</p>

      <p><strong>Le score évolue avec le marché.</strong> Un score de 60/100 peut être excellent dans un secteur où le score moyen est de 25, et insuffisant dans un secteur où vos concurrents sont à 75. Analysez toujours votre score en contexte.</p>

      <h2>Questions fréquentes</h2>

      <h3>Un bon score GEO garantit-il d'être cité par les IA ?</h3>

      <p>Non. Le score mesure le potentiel de citation — les conditions que votre site remplit pour être sélectionné comme source. Les IA restent imprévisibles dans leur sélection. Mais un site à 80/100 a statistiquement beaucoup plus de chances d'être cité qu'un site à 30/100.</p>

      <h3>Quel score faut-il viser ?</h3>

      <p>Au-dessus de 65/100, vous êtes dans une très bonne position par rapport au marché (score moyen : 38/100). Au-dessus de 80/100, votre site est dans le top 5 % en termes de citabilité IA. L'objectif n'est pas 100/100 mais d'être significativement au-dessus de vos concurrents.</p>

      <h3>Le score change-t-il si je ne fais rien ?</h3>

      <p>Il peut baisser, oui. Si vos concurrents s'optimisent et pas vous, votre position relative se dégrade. Et si votre contenu vieillit sans mise à jour, le critère de fraîcheur diminuera naturellement.</p>

      <h3>Puis-je comparer mon score à celui de mes concurrents ?</h3>

      <p>Oui. Lancez un audit Detekia sur les sites de vos 3-5 principaux concurrents. Comparez les scores globaux et les scores par critère. Cela vous indiquera exactement où vous avez un retard — et où vous avez une avance.</p>

      <h3>Comment passer de 30 à 60/100 ?</h3>

      <p>Les trois actions les plus impactantes : 1) débloquer les crawlers IA dans <code>robots.txt</code> (+10-15 pts potentiels), 2) réécrire les introductions pour les rendre extractibles (+8-12 pts), 3) ajouter des données structurées <code>Organization</code> + <code>FAQPage</code> (+5-8 pts). En une semaine de travail focalisé, un gain de 25-30 points est réaliste.</p>

      <h2>Lancez votre audit</h2>

      <p>La première étape est de connaître votre score actuel. Pas d'estimation, pas d'intuition — une mesure objective sur les 7 critères GEO.</p>

      <p>Analysez votre site gratuitement sur Detekia — score sur 100, 7 critères détaillés, recommandations priorisées par impact. En moins de 60 secondes, sans inscription.</p>
      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO : quelles différences en 2026 ?</ArrowLink>
      <InlineCTA href="/">Votre site est-il visible pour les IA ? Testez gratuitement.</InlineCTA>
    </>
  );
}
