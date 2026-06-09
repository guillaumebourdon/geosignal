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

export default function VoiceSearchIAAssistantsVocaux() {
  return (
    <>
      <p>En 2026, plus de la moitie des recherches en ligne passent par la voix. Siri, Google Assistant, Alexa et desormais le mode vocal de ChatGPT ne sont plus des gadgets — ce sont des interfaces de recherche a part entiere. Et la maniere dont ils selectionnent leurs reponses est fondamentalement differente de Google.</p>

      <p>Pour les entreprises qui investissent dans leur visibilite en ligne, ignorer la recherche vocale revient a ignorer la moitie de leur audience potentielle. Pourtant, moins de 10 % des sites sont reellement optimises pour ces requetes conversationnelles. Voici comment combler cet ecart.</p>

      <h2>L'essor de la recherche vocale en chiffres</h2>

      <p>Les donnees sont sans appel. Selon Statista et Juniper Research, le nombre d'assistants vocaux actifs dans le monde a depasse les 8 milliards en 2026 — plus que la population mondiale. Comscore estimait deja en 2020 que 50 % des recherches seraient vocales d'ici quelques annees. Nous y sommes.</p>

      <p>Mais le changement le plus significatif vient de l'integration des LLM dans ces assistants. Le mode vocal de ChatGPT, lance fin 2024, a transforme la conversation avec une IA en experience naturelle. Google Assistant utilise desormais Gemini en arriere-plan. Siri integre Apple Intelligence. La frontiere entre "assistant vocal" et "moteur de recherche IA" a disparu.</p>

      <p>Pour les marques, cela signifie que l'optimisation pour les <InternalLink href="/blog/comment-chatgpt-choisit-ses-sources">sources selectionnees par ChatGPT</InternalLink> est desormais aussi une optimisation pour la recherche vocale. Les mecanismes sont les memes.</p>

      <h2>Ce qui change avec les requetes vocales</h2>

      <p>Une requete tapee et une requete vocale n'ont presque rien en commun. Comprendre ces differences est la premiere etape pour s'y adapter.</p>

      <p><strong>Les requetes sont plus longues.</strong> Une recherche tapee fait en moyenne 3-4 mots ("restaurant italien Paris"). Une requete vocale en fait 7-9 ("quel est le meilleur restaurant italien dans le 11e arrondissement de Paris ouvert le dimanche"). Les assistants vocaux traitent des phrases completes, pas des mots-cles.</p>

      <p><strong>Elles sont conversationnelles.</strong> L'utilisateur parle comme a un humain : "est-ce que...", "comment faire pour...", "pourquoi mon...". Le ton interrogatif domine. Les pages qui repondent en langage naturel ont un avantage mesurable.</p>

      <p><strong>Elles sont orientees question.</strong> Selon Backlinko, 41 % des requetes vocales commencent par qui, quoi, ou, quand, comment ou pourquoi. C'est 3 fois plus que les requetes textuelles. L'utilisateur attend une reponse directe, pas une liste de liens.</p>

      <p><strong>Elles ont une intention locale forte.</strong> "Pres de chez moi", "a proximite", "ouvert maintenant" — les requetes vocales sont 3 fois plus susceptibles d'avoir une intention locale que les recherches textuelles (BrightLocal, 2025).</p>

      <h2>Le schema SpeakableSpecification : un signal direct pour les assistants</h2>

      <p>Parmi les <InternalLink href="/blog/structured-data-avance-schemas-oublies">schemas JSON-LD avances</InternalLink>, SpeakableSpecification est le plus directement lie a la recherche vocale. Ce schema indique aux moteurs IA quelles sections de votre page sont adaptees a la lecture a voix haute.</p>

      <p>Concretement, vous designez via un selecteur CSS les passages que vous voulez voir cites oralement. Cela peut etre votre paragraphe d'introduction, une definition cle, ou une reponse synthetique a une question courante.</p>

      <p>Ce schema est encore tres peu utilise — moins de 1 % des sites selon une analyse de Schema App en 2025. C'est un avantage competitif direct pour ceux qui l'implementent. Les assistants vocaux qui cherchent un extrait a lire preferent un passage explicitement designe comme speakable plutot qu'un paragraphe choisi au hasard.</p>

      <p>Pour l'implementer efficacement, ciblez les passages qui contiennent des reponses directes en 2-3 phrases. Un assistant vocal ne lit pas un paragraphe de 10 lignes — il cherche une capsule de reponse concise. Pour aller plus loin sur l'implementation technique, consultez notre <InternalLink href="/blog/schema-org-ia-guide-pratique">guide pratique Schema.org</InternalLink>.</p>

      <h2>Structurer son contenu pour les reponses vocales</h2>

      <p>Les assistants vocaux ne lisent pas votre page en entier. Ils extraient un fragment — generalement 40 a 60 mots — et le lisent a l'utilisateur. Pour etre selectionne, votre contenu doit etre structure pour faciliter cette extraction.</p>

      <h3>Les capsules de reponse directe</h3>

      <p>Chaque page strategique devrait contenir au moins une "capsule de reponse" : un paragraphe de 2-3 phrases qui repond directement a la question principale de la page. Placez-la dans les 150 premiers mots du contenu. C'est le meme principe que la <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">citabilite GEO</InternalLink> — si votre reponse est extraite de son contexte, elle doit rester comprehensible et complete.</p>

      <h3>Le format FAQ</h3>

      <p>Le format question-reponse est le format natif de la recherche vocale. Chaque question posee a un assistant est une requete a laquelle votre FAQ peut repondre. Structurez vos FAQ avec des questions formulees en langage naturel (pas en jargon technique) et des reponses de 40-60 mots maximum pour la premiere phrase.</p>

      <h3>Les listes et etapes numerotees</h3>

      <p>Les assistants vocaux sont particulierement doues pour lire des listes. "Voici les 3 etapes pour..." est un format ideal. Structurez vos guides avec des etapes claires et numerotees, chacune resumable en une phrase.</p>

      <InlineCTA href="/pricing">Votre site est-il optimise pour les assistants vocaux ? Testez votre score GEO.</InlineCTA>

      <h2>Le lien entre optimisation vocale et GEO</h2>

      <p>L'optimisation pour la recherche vocale et le <InternalLink href="/blog/geo-guide-complet-2026">GEO (Generative Engine Optimization)</InternalLink> partagent les memes fondamentaux. Ce n'est pas une coincidence — les assistants vocaux modernes utilisent les memes modeles de langage que ChatGPT ou Perplexity pour generer leurs reponses.</p>

      <p><strong>Citabilite.</strong> Un contenu cite par un assistant vocal est un contenu qui a ete selectionne par un systeme RAG pour sa capacite a repondre directement a une question. C'est exactement le critere numero 1 du scoring GEO.</p>

      <p><strong>Reponse directe.</strong> Les assistants vocaux ne peuvent pas afficher une page web — ils doivent synthetiser une reponse orale. Un contenu qui fournit deja une reponse directe et synthetique est systematiquement favorise.</p>

      <p><strong>Autorite et verification.</strong> Les LLM qui alimentent les assistants recoupent les sources. Un site avec une forte <InternalLink href="/blog/eeat-ia-experience-expertise">autorite E-E-A-T</InternalLink> sera prefere pour les reponses vocales, exactement comme pour les citations textuelles.</p>

      <p>En resume : optimiser pour le GEO, c'est optimiser pour la voix. Les sites qui obtiennent un bon score GEO sont naturellement mieux positionnes pour etre cites par les assistants vocaux.</p>

      <h2>Checklist pratique : optimiser pour la recherche vocale</h2>

      <p>Voici les actions concretes a mettre en place, classees par impact decroissant :</p>

      <ol>
        <li><strong>Auditez votre citabilite actuelle.</strong> Lancez un audit GEO pour mesurer votre score de base. Les criteres de citabilite et de reponse directe sont les plus correles avec la performance vocale.</li>
        <li><strong>Ajoutez des capsules de reponse directe</strong> en haut de vos pages strategiques. 2-3 phrases, langage simple, reponse complete a la question implicite de la page.</li>
        <li><strong>Implementez SpeakableSpecification</strong> sur vos pages les plus importantes. Ciblez les capsules de reponse et les definitions cles.</li>
        <li><strong>Structurez vos FAQ en langage naturel.</strong> Reformulez vos questions comme un utilisateur les poserait a voix haute. "Comment fonctionne votre service ?" plutot que "Fonctionnement du service".</li>
        <li><strong>Optimisez pour les requetes locales.</strong> Si vous avez une activite locale, assurez-vous que votre nom, adresse, horaires et zone de service sont structures en schema LocalBusiness.</li>
        <li><strong>Visez la position zero.</strong> Les featured snippets de Google sont souvent la source des reponses Google Assistant. Un contenu qui capture le snippet capture aussi la reponse vocale.</li>
        <li><strong>Surveillez les questions de votre audience.</strong> Google Search Console, les suggestions de recherche et les "People Also Ask" sont des mines d'or pour identifier les requetes vocales reelles de vos prospects.</li>
        <li><strong>Testez avec les assistants.</strong> Posez les questions de votre audience a Siri, Google Assistant et ChatGPT voice. Observez qui est cite. Si ce n'est pas vous, analysez pourquoi le concurrent selectionne a ete prefere.</li>
      </ol>

      <h2>Conclusion</h2>

      <p>La recherche vocale n'est pas une tendance future — c'est le present. Les assistants vocaux dotes d'IA generative sont devenus le premier reflexe de millions d'utilisateurs pour obtenir des reponses. Les sites qui structurent leur contenu pour ces interfaces — capsules de reponse directe, schemas SpeakableSpecification, FAQ en langage naturel — captent une audience que leurs concurrents ignorent encore.</p>

      <p>Le meilleur indicateur de votre performance vocale reste votre <InternalLink href="/blog/sources-contenus-citations-ia">capacite a etre cite comme source</InternalLink> par les moteurs IA. Optimisez pour la citabilite, et la voix suivra.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Decouvrir les 8 criteres du scoring GEO</ArrowLink>

      <ArrowLink href="/blog/geo-guide-complet-2026">Le guide complet du GEO en 2026</ArrowLink>
    </>
  );
}
