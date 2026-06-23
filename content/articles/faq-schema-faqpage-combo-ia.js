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
        Analyser mon site gratuitement →
      </a>
    </div>
  );
}

export default function FaqSchemaFaqpageComboIa() {
  return (
    <>
      <p>Sur les sites que nous analysons, deux critères reviennent systématiquement comme les plus faciles à améliorer : la citabilité du contenu (25 points sur 100) et l'autorité E-E-A-T (15 points), dont les schemas JSON-LD sont une composante directe. Ensemble, ces deux critères représentent 40 % du score GEO. Et le moyen le plus rapide pour les booster est souvent le même : une bonne page FAQ couplée à un Schema FAQPage.</p>

      <p>Le problème : la plupart des FAQ de sites web sont des cimetières de questions corporate que personne ne pose. "Pourquoi nous choisir ?" n'est pas une question que les gens tapent dans ChatGPT. Et un Schema FAQPage mal implémenté, avec des réponses de 8 mots ou du contenu invisible, n'apporte rien.</p>

      <p>Ce guide vous montre comment construire des FAQ que les IA extraient et citent, et comment le Schema FAQPage transforme ce contenu en signal technique lisible par tous les moteurs IA.</p>

      <h2>Pourquoi le combo FAQ + Schema FAQPage est si puissant pour le GEO</h2>

      <p>Les moteurs IA fonctionnent par extraction de réponses. Quand un utilisateur pose une question à ChatGPT ou Perplexity, l'IA cherche dans ses sources un passage qui répond directement, le plus factuellement possible, dans un format autonome. C'est exactement ce qu'une FAQ bien écrite fournit : une question claire suivie d'une réponse autonome.</p>

      <p>Le format question-réponse est <strong>nativement extractible</strong>. L'IA n'a pas besoin de deviner où commence la réponse ni où elle finit. Chaque paire Q/R est un bloc indépendant, citable tel quel. C'est le format le plus facile à consommer pour un LLM.</p>

      <p>Côté <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">score GEO Detekia</InternalLink>, le combo impacte deux critères directement :</p>

      <ul>
        <li><strong>Citabilité et réponse directe (25 points)</strong> : la FAQ fournit des passages autonomes, structurés, avec des phrases sujet-verbe-complément. C'est le format idéal pour la citation IA.</li>
        <li><strong>Autorité & E-E-A-T (15 points)</strong> : les signaux de données structurées, dont le Schema FAQPage, sont désormais évalués dans ce critère. Le balisage dit explicitement à l'IA "ceci est une question et voici sa réponse".</li>
      </ul>

      <p>40 points potentiels sur 100. C'est souvent la différence entre un score de 25 et un score de 55.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Pour une vue complète des schemas JSON-LD à implémenter : Schema.org et IA, le guide pratique</ArrowLink>

      <h2>Ce qu'est une FAQ optimisée pour les IA (pas celle qu'on trouve partout)</h2>

      <p>Faisons un test rapide. Ouvrez la page FAQ de n'importe quel site corporate. Vous y trouverez probablement :</p>

      <ul>
        <li>"Pourquoi nous choisir ?" → réponse marketing de 3 lignes sans un seul chiffre</li>
        <li>"Comment ça marche ?" → réponse vague qui renvoie vers une autre page</li>
        <li>"Quels sont vos avantages ?" → liste de superlatifs ("le meilleur", "le plus fiable")</li>
      </ul>

      <p>Ces FAQ ne sont pas des FAQ. Ce sont des brochures marketing déguisées en questions. Les IA les ignorent parce qu'elles ne contiennent rien de citable : pas de fait vérifiable, pas de chiffre, pas de réponse autonome.</p>

      <h3>Les 5 caractéristiques d'une bonne question pour les IA</h3>

      <ol>
        <li><strong>Langage naturel utilisateur</strong> : formulée comme un vrai humain la poserait à ChatGPT. Pas "Notre politique de retour" mais "Quel est le délai de retour et est-ce gratuit ?"</li>
        <li><strong>Structure sujet + action</strong> : la question contient un sujet clair et une action précise. "Comment", "Combien", "Quel est", "Est-ce que".</li>
        <li><strong>Spécifique</strong> : "Quel est le prix d'un cours de yoga à Paris en 2026 ?" plutôt que "Quels sont vos tarifs ?"</li>
        <li><strong>Contextualisée</strong> : si pertinent, inclure la géographie ("à Paris", "en France") ou la temporalité ("en 2026").</li>
        <li><strong>Interrogative directe</strong> : une question, une réponse. Pas de questions doubles ("Comment et pourquoi...").</li>
      </ol>

      <h3>Les 5 caractéristiques d'une bonne réponse pour les IA</h3>

      <ol>
        <li><strong>Autonome</strong> : compréhensible sans lire le reste de la page. Si on copiait la réponse dans un message, elle aurait du sens seule.</li>
        <li><strong>50 à 150 mots</strong> : assez pour être complète, assez courte pour être citée en entier. Les réponses de 8 mots sont inutiles ; celles de 400 mots ne seront jamais extraites en bloc.</li>
        <li><strong>L'important en premier</strong> : la première phrase donne la réponse. Les détails viennent après.</li>
        <li><strong>Factuelle</strong> : au moins un chiffre, une durée, un prix, ou un fait vérifiable. "Nos cours durent 60 minutes et accueillent 15 participants maximum" plutôt que "Nos cours sont adaptés à tous les niveaux".</li>
        <li><strong>Pas de blabla marketing</strong> : bannir "nous sommes les meilleurs", "notre expertise reconnue", "faites confiance à notre équipe passionnée".</li>
      </ol>

      <h2>Comment trouver les bonnes questions</h2>

      <p>La première erreur est d'inventer les questions soi-même dans une salle de réunion. Les vraies questions viennent de vos utilisateurs, pas de votre équipe marketing. Voici 5 sources concrètes :</p>

      <ol>
        <li><strong>Google Search Console</strong> : onglet "Performances" → filtre par requêtes contenant "comment", "quel", "est-ce que", "combien". Ce sont les questions réelles que les gens posent déjà quand ils trouvent votre site.</li>
        <li><strong>People Also Ask (PAA)</strong> : tapez votre mot-clé principal dans Google et regardez les questions "Autres questions posées". Google les affiche parce que les gens les posent. Les IA les posent aussi.</li>
        <li><strong>AnswerThePublic</strong> : entrez votre sujet et récupérez les questions les plus fréquentes, organisées par type (comment, pourquoi, quand, combien).</li>
        <li><strong>Questions réelles de vos clients</strong> : emails du support, messages sur le chat en ligne, questions posées en appel commercial. Ce sont les questions les plus authentiques : et souvent les plus spécifiques.</li>
        <li><strong>Demandez directement à ChatGPT</strong> : "Quelles sont les 10 questions les plus fréquentes sur [votre sujet] ?" Le résultat vous donne une vision de ce que l'IA considère comme les questions clés de votre domaine.</li>
      </ol>

      <p><strong>Attention aux pièges</strong> : évitez les questions trop vagues ("Comment améliorer mon business ?"), les questions auxquelles vous ne pouvez pas vraiment répondre factuellement, et les questions purement promotionnelles ("Pourquoi sommes-nous les meilleurs ?"). Si la réponse ne contient pas au moins un fait vérifiable, la question ne vaut pas la peine d'être incluse.</p>

      <h2>Le Schema FAQPage : implémentation technique</h2>

      <p>Le Schema FAQPage est un balisage <InternalLink href="/blog/schema-org-ia-guide-pratique">JSON-LD</InternalLink> qui dit explicitement aux IA : "cette page contient des questions-réponses structurées." Sans ce balisage, l'IA doit deviner la structure à partir du HTML. Avec le balisage, elle sait immédiatement quoi extraire.</p>

      <h3>Code JSON-LD complet</h3>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quel est le délai de livraison en France ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La livraison standard en France métropolitaine prend 3 à 5 jours ouvrés. La livraison express est disponible en 24h pour 9,90 EUR. Les commandes passées avant 14h sont expédiées le jour même. Livraison gratuite dès 60 EUR d'achat."
      }
    },
    {
      "@type": "Question",
      "name": "Comment fonctionne la politique de retour ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vous disposez de 30 jours après réception pour retourner un article. Le retour est gratuit via Colissimo. Le remboursement est effectué sous 5 jours ouvrés après réception du colis retour. Les articles doivent être dans leur état d'origine, non portés et avec les étiquettes."
      }
    },
    {
      "@type": "Question",
      "name": "Quels moyens de paiement acceptez-vous ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nous acceptons Visa, Mastercard, American Express, PayPal et Apple Pay. Le paiement en 3x sans frais est disponible via Alma pour les commandes supérieures à 50 EUR. Toutes les transactions sont sécurisées par le protocole 3D Secure."
      }
    }
  ]
}
</script>`}</code></pre>

      <h3>Où placer le balisage</h3>

      <p>Le JSON-LD se place dans le <code>&lt;head&gt;</code> de la page ou juste avant <code>&lt;/body&gt;</code>. Les deux fonctionnent. L'important est que le contenu du Schema corresponde exactement au contenu visible sur la page. Les IA détectent les incohérences et pénalisent le contenu invisible.</p>

      <h3>Les pièges techniques à éviter</h3>

      <ul>
        <li><strong>Contenu invisible</strong> : ne mettez JAMAIS dans le Schema des réponses qui ne sont pas visibles sur la page. Google peut vous pénaliser, et les IA ne font pas confiance au contenu caché.</li>
        <li><strong>Réponses trop courtes</strong> : une réponse de 5 mots dans le Schema est inutile. Visez 50 à 150 mots par réponse.</li>
        <li><strong>Trop de questions</strong> : limitez-vous à 10 questions par page. Au-delà, le signal se dilue et la page devient difficile à parser.</li>
        <li><strong>HTML dans les réponses</strong> : le champ "text" de l'Answer supporte le HTML simple (gras, liens), mais évitez les structures complexes. Gardez le texte lisible.</li>
      </ul>

      <h3>Validation</h3>

      <p>Après implémentation, testez votre page avec le <strong>Rich Results Test</strong> de Google (search.google.com/test/rich-results). Il vérifie que le balisage est valide et que les réponses sont correctement parsées. Corrigez les erreurs avant de publier.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Pour implémenter Organization, Article, HowTo et les autres schemas : guide complet Schema.org pour les IA</ArrowLink>

      <h2>3 exemples avant/après concrets</h2>

      <h3>E-commerce mode : "Quels sont vos délais de livraison ?"</h3>

      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 14 }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#D97757', width: 80 }}>Avant</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>"Nous proposons plusieurs options de livraison adaptées à vos besoins. Contactez-nous pour en savoir plus !"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC', background: '#F7F5F2' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#6B6762' }}>Problème</td>
              <td style={{ padding: '14px 16px', color: '#6B6762', lineHeight: 1.6 }}>Aucun chiffre, aucun fait. Renvoie vers un contact au lieu de répondre. Inutilisable par une IA.</td>
            </tr>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#10A37F' }}>Après</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>"La livraison standard en France métropolitaine prend 3 à 5 jours ouvrés (Colissimo). La livraison express 24h est disponible à 9,90 EUR. Livraison gratuite dès 60 EUR d'achat. Les commandes passées avant 14h sont expédiées le jour même."</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>SaaS B2B : "Comment fonctionne votre logiciel ?"</h3>

      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 14 }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#D97757', width: 80 }}>Avant</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>"Notre solution innovante vous accompagne au quotidien. Demandez une démo pour découvrir toutes ses fonctionnalités !"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC', background: '#F7F5F2' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#6B6762' }}>Problème</td>
              <td style={{ padding: '14px 16px', color: '#6B6762', lineHeight: 1.6 }}>Aucune information sur le fonctionnement réel. "Solution innovante" ne veut rien dire. Renvoie vers une démo au lieu de répondre.</td>
            </tr>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#10A37F' }}>Après</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>"TaskFlow centralise la gestion de projets, le suivi du temps et la facturation en une seule interface. L'outil se connecte à Slack, Gmail et Notion en 2 clics. Chaque projet se découpe en tâches avec assignation, deadline et suivi d'avancement en temps réel. Essai gratuit 14 jours, sans carte bancaire. Utilisé par 4 500 entreprises."</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Service local : "Pourquoi choisir notre entreprise ?"</h3>

      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 14 }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#D97757', width: 80 }}>Avant</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>"Notre équipe passionnée met son expertise à votre service depuis plus de 20 ans. Faites-nous confiance !"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC', background: '#F7F5F2' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#6B6762' }}>Problème</td>
              <td style={{ padding: '14px 16px', color: '#6B6762', lineHeight: 1.6 }}>Question promotionnelle. Réponse sans chiffres vérifiables. "Passionnée" et "faites-nous confiance" sont des signaux promotionnels que les IA déprioritisent.</td>
            </tr>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#10A37F' }}>Après</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>Meilleure question : "Quel plombier intervient en urgence dans le 15e à Paris ?" Réponse : "Plomberie Martin intervient en moins de 2 heures dans le 15e arrondissement de Paris, 7j/7. Devis gratuit sur place. 890 interventions réalisées en 2025, note Google 4.9/5. Tarif déplacement : 49 EUR HT. Garantie décennale et assurance RC Pro."</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Le pattern est le même dans les trois cas : remplacer les formulations vagues et promotionnelles par des faits concrets, des chiffres et des détails spécifiques. Les IA citent des informations, pas des slogans.</p>

      <InlineCTA href="/">Mesurez l'impact de votre FAQ sur votre score GEO, citabilité et données structurées analysées en moins de 60 secondes.</InlineCTA>

      <h2>Checklist d'implémentation en 7 étapes</h2>

      <ol>
        <li><strong>Identifiez 5 à 10 vraies questions</strong> de votre audience via Search Console, PAA, support client et ChatGPT. Éliminez les questions corporate que personne ne pose.</li>
        <li><strong>Rédigez les réponses</strong> selon les 5 critères : autonomes, 50-150 mots, important en premier, factuelles, sans marketing.</li>
        <li><strong>Créez ou améliorez votre page FAQ visible</strong>. Le contenu doit être affiché clairement pour les humains, pas caché dans un accordéon JavaScript inaccessible.</li>
        <li><strong>Ajoutez le Schema FAQPage</strong> en JSON-LD dans le head de la page. Vérifiez que le texte du Schema correspond mot pour mot au contenu visible.</li>
        <li><strong>Testez via Rich Results Test</strong> (search.google.com/test/rich-results). Corrigez les erreurs de balisage. Vérifiez que toutes les questions sont détectées.</li>
        <li><strong>Lancez un audit Detekia</strong> pour mesurer l'impact sur les critères citabilité (25 points) et autorité E-E-A-T (15 points). Comparez votre score avant et après.</li>
        <li><strong>Mettez à jour trimestriellement</strong>. Les questions de vos utilisateurs évoluent. Les prix, délais et chiffres aussi. Une FAQ périmée perd en crédibilité auprès des IA.</li>
      </ol>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Comprendre les 7 critères GEO et leur pondération dans le score Detekia</ArrowLink>

      <h2>Questions fréquentes</h2>

      <h3>Combien de questions mettre dans une FAQ ?</h3>

      <p>Entre 5 et 10 questions par page. En dessous de 5, le signal est trop faible pour impacter votre score GEO. Au-dessus de 10, le contenu se dilue et la page devient difficile à parser pour les IA. Si vous avez plus de 10 questions pertinentes, répartissez-les sur plusieurs pages thématiques.</p>

      <h3>Puis-je mettre la FAQ uniquement en Schema sans l'afficher sur la page ?</h3>

      <p>Non. Google a explicitement indiqué que le contenu du Schema FAQPage doit être visible sur la page. Un Schema avec du contenu invisible peut entraîner une pénalité manuelle. De plus, les IA vérifient la cohérence entre le balisage et le contenu visible. Si elles détectent une incohérence, elles réduisent la confiance dans la source.</p>

      <h3>Les FAQ impactent-elles encore les rich snippets Google en 2026 ?</h3>

      <p>Google a restreint l'affichage des rich snippets FAQ aux sites gouvernementaux et de santé depuis 2023. Mais le Schema FAQPage reste indexé et utilisé par Google pour comprendre le contenu de la page. Et surtout, les IA génératives (ChatGPT, Gemini, Perplexity) utilisent activement ce balisage pour identifier et extraire les réponses. L'impact GEO est plus important que l'impact SEO en 2026.</p>

      <h3>Page FAQ dédiée ou FAQ intégrée dans chaque page produit/service ?</h3>

      <p>Les deux. Une page FAQ centrale regroupe les questions transversales (livraison, paiement, politique de retour). Des FAQ spécifiques sur les pages produits ou services répondent aux questions liées à cette offre précise, comme dans le cas du <InternalLink href="/blog/ecommerce-recommandations-ia">e-commerce</InternalLink>. Chaque page a son propre Schema FAQPage. Les IA traitent chaque page indépendamment, plus vos FAQ sont contextualisées, plus elles ont de chances d'être citées pour la bonne requête.</p>

      <ArrowLink href="/blog/audit-geo-visibilite-ia">Audit GEO : comment analyser la visibilité IA de votre site étape par étape</ArrowLink>

      <h2>Ce qu'il faut retenir</h2>

      <p>Le combo FAQ + Schema FAQPage est le moyen GEO le plus accessible et le plus rapide à implémenter. Il impacte directement 40 points sur 100 du score Detekia (citabilité + autorité E-E-A-T). Mais la clé n'est pas technique. Elle est éditoriale. Des questions réelles, des réponses factuelles et autonomes, et un balisage propre. Le Schema est le contenant ; la qualité des réponses est le contenu.</p>

      <p>Commencez par vos 5 questions les plus fréquentes. Réécrivez-les selon les critères de cet article. Ajoutez le Schema. Mesurez l'impact. Vous verrez la différence en quelques jours.</p>
    </>
  );
}
