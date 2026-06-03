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
        <div style={{ color: '#F7F5F2', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Vos images et videos sont-elles optimisees pour les IA ?</div>
        <div style={{ color: 'rgba(247,245,242,0.6)', fontSize: 13 }}>Testez gratuitement votre score de citabilite IA.</div>
      </div>
      <Link href="/" style={{ background: '#D97757', color: '#fff', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Analyser mon site</Link>
    </div>
  );
}

export default function MultimodalGeoImagesVideosIA() {
  return (
    <>
      <p>Les moteurs IA ne se contentent plus de citer du texte. Google AI Mode genere desormais des reponses avec des images, des videos et des cartes interactives. ChatGPT affiche des visuels dans ses reponses depuis janvier 2026. Perplexity integre des videos YouTube directement dans ses syntheses. <strong>Le GEO multimodal, c'est l'optimisation de vos contenus visuels pour qu'ils soient selectionnes et affiches dans les reponses IA</strong>, pas seulement vos textes.</p>

      <h2>Pourquoi le multimodal change la donne en 2026</h2>

      <p>Trois evolutions majeures ont accelere la tendance :</p>

      <ul>
        <li><strong>Google I/O mai 2026</strong> : Google Search est "completement reimagine avec l'IA". Les utilisateurs peuvent attacher des images, documents et videos a leurs recherches. Les requetes AI Mode sont en moyenne <strong>3x plus longues</strong> que les recherches traditionnelles, et incluent de plus en plus de contexte visuel.</li>
        <li><strong>YouTube est devenu la source n°1 des AI Overviews</strong> : selon BrightEdge (mai 2026), YouTube represente <strong>29,5 % des citations dans les AI Overviews de Google</strong>, depassant Reddit. Les videos ne sont plus un complement, elles sont la source principale.</li>
        <li><strong>ChatGPT genere et affiche des visuels</strong> : depuis GPT-4o et les mises a jour de 2026, ChatGPT peut generer des images dans ses reponses et integrer des visuels provenant du web quand ils sont pertinents.</li>
      </ul>

      <p>Consequence directe : un site qui n'a que du texte se prive d'une surface de visibilite IA en pleine croissance.</p>

      <h2>Comment les IA selectionnent les contenus visuels</h2>

      <p>Les moteurs IA ne "voient" pas vos images comme un humain. Ils s'appuient sur des metadonnees et des signaux textuels pour comprendre et selectionner les visuels :</p>

      <h3>1. L'attribut alt des images</h3>

      <p>L'alt est aussi important pour le GEO que les <InternalLink href="/blog/meta-descriptions-seo-geo-2026">meta descriptions</InternalLink> le sont pour le SEO classique : c'est le texte que les IA lisent pour comprendre votre visuel.</p>

      <p>C'est le signal n°1. Un <code>alt=""</code> vide ou un <code>alt="IMG_4523"</code> rend votre image invisible pour les IA. Un <code>alt="Tableau comparatif des tarifs d'assurance habitation en France 2026"</code> rend votre image citable. L'alt doit decrire <strong>ce que l'image montre</strong> et <strong>pourquoi elle est pertinente</strong> dans le contexte de la page.</p>

      <h3>2. Le contexte textuel autour de l'image</h3>

      <p>Les systemes RAG extraient le texte qui entoure une image pour comprendre sa pertinence. Une image placee apres un H2 descriptif avec un paragraphe explicatif sera mieux comprise qu'une image isolee sans contexte. Le pattern ideal :</p>

      <ul>
        <li>H2 descriptif (ex : "Comparatif des prix par region")</li>
        <li>Paragraphe de contexte (30-50 mots)</li>
        <li>Image avec alt descriptif</li>
        <li>Legende ou <code>&lt;figcaption&gt;</code> qui ajoute une information supplementaire</li>
      </ul>

      <h3>3. Les schemas ImageObject et VideoObject</h3>

      <p>Le schema <code>ImageObject</code> en JSON-LD permet de structurer les metadonnees d'une image (auteur, date, description, licence). Le schema <code>VideoObject</code> fait la meme chose pour les videos et est directement utilise par Google AI Mode pour selectionner les videos a afficher dans les reponses IA. Pour en savoir plus sur l'implementation des schemas, consultez notre <InternalLink href="/blog/schema-org-ia-guide-pratique">guide Schema.org pour la visibilite IA</InternalLink>.</p>

      <h3>4. Le format et la performance technique</h3>

      <p>Les images trop lourdes ralentissent la page, ce qui degrade les Core Web Vitals. Les IA privilegient les pages rapides. Utilisez des formats modernes (WebP, AVIF), du lazy loading, et des dimensions explicites (<code>width</code> et <code>height</code>) pour eviter le Cumulative Layout Shift (CLS).</p>

      <InlineCTA />

      <h2>YouTube : le levier multimodal le plus puissant</h2>

      <p>YouTube est desormais la premiere source de citations dans les AI Overviews de Google (<strong>29,5 %</strong>, BrightEdge mai 2026). C'est aussi une source majeure pour Perplexity, qui integre des videos directement dans ses reponses.</p>

      <h3>Pourquoi les IA citent autant YouTube</h3>

      <ul>
        <li><strong>Transcriptions automatiques</strong> : chaque video YouTube genere une transcription textuelle que les IA peuvent indexer et extraire. Votre video de 10 minutes devient un document texte de 2 000 mots, riche en informations citables. C'est le meme principe que le <InternalLink href="/blog/contenu-long-vs-court-ia">contenu long qui performe mieux</InternalLink> en citabilite IA.</li>
        <li><strong>Signaux de confiance</strong> : nombre de vues, likes, commentaires, anciennete de la chaine. Ces signaux aident les IA a evaluer la credibilite du contenu.</li>
        <li><strong>Schema VideoObject integre</strong> : YouTube genere automatiquement les metadonnees structurees que les IA utilisent pour comprendre le contenu de la video.</li>
        <li><strong>Timestamps et chapitres</strong> : les chapitres YouTube permettent aux IA de citer un moment precis de la video, pas juste la video entiere.</li>
      </ul>

      <h3>Optimiser vos videos pour le GEO</h3>

      <ol>
        <li><strong>Titres en format question</strong> : "Comment choisir son assurance habitation en 2026 ?" plutot que "Notre offre assurance"</li>
        <li><strong>Description riche</strong> : les 200 premiers caracteres de la description YouTube sont les plus importants. Mettez-y un answer capsule de 30-50 mots qui repond a la question du titre.</li>
        <li><strong>Chapitres avec timestamps</strong> : decoupez votre video en sections logiques. Chaque chapitre = une opportunite de citation separee.</li>
        <li><strong>Transcription verifiee</strong> : la transcription automatique YouTube est souvent approximative. Corrigez-la manuellement pour que les termes techniques soient exacts.</li>
        <li><strong>Embeddez sur votre site</strong> : une video YouTube embeddee sur votre page ajoute un signal multimodal que les IA detectent (iframe YouTube).</li>
      </ol>

      <h2>Images et infographies : les bonnes pratiques GEO</h2>

      <h3>Les types d'images que les IA citent le plus</h3>

      <ul>
        <li><strong>Tableaux comparatifs</strong> : les IA adorent les comparaisons structurees. Un tableau HTML avec des donnees chiffrees sera extrait tel quel.</li>
        <li><strong>Infographies avec donnees sourcees</strong> : une infographie qui resume des statistiques cles avec leurs sources est hautement citable. Mais l'infographie seule ne suffit pas, il faut le texte equivalent sur la page (les IA ne "lisent" pas les images).</li>
        <li><strong>Screenshots et captures d'ecran</strong> : pour les tutoriels et guides techniques, les screenshots avec des annotations textuelles (alt descriptifs + legendes) sont tres utiles.</li>
        <li><strong>Graphiques avec donnees</strong> : un graphique qui montre une tendance est citable si le texte autour explique les donnees. Le graphique seul est invisible pour les IA.</li>
      </ul>

      <h3>Le piege du "tout image"</h3>

      <p>Certains sites, notamment en <InternalLink href="/blog/ecommerce-recommandations-ia">e-commerce</InternalLink> et en restauration, mettent l'essentiel de leur contenu dans des images (menus en image, fiches produits en image, tarifs en image). <strong>Les IA ne peuvent pas lire le texte dans une image.</strong> Si votre menu, vos prix ou vos specifications sont uniquement dans des visuels, ils n'existent pas pour ChatGPT, Perplexity ou Gemini.</p>

      <p>La regle : chaque information importante doit exister en texte sur la page. Les images illustrent et enrichissent, elles ne remplacent pas le texte.</p>

      <h2>Podcasts et contenus audio</h2>

      <p>Les podcasts sont un format en croissance pour la visibilite IA, principalement grace aux transcriptions :</p>

      <ul>
        <li><strong>Publiez la transcription complete</strong> de chaque episode sur votre site. C'est du contenu long, riche, avec des <InternalLink href="/blog/pourquoi-ia-adorent-chiffres-contenu-factuel">citations d'experts et des donnees chiffrees</InternalLink>, exactement ce que les IA valorisent.</li>
        <li><strong>Structurez la transcription</strong> avec des H2 par sujet aborde, des timestamps, et des liens vers les sources mentionnees.</li>
        <li><strong>Ajoutez un schema PodcastEpisode</strong> en JSON-LD pour structurer les metadonnees (invites, sujet, duree, date).</li>
      </ul>

      <h2>Comment Detekia evalue le multimodal</h2>

      <p>L'<InternalLink href="/blog/geo-guide-complet-2026">audit GEO Detekia</InternalLink> detecte plusieurs signaux multimodaux dans son analyse :</p>

      <ul>
        <li><strong>Critere Citabilite (25 pts)</strong> : la profondeur de contenu textuel est mesuree. Un site "tout image" sans texte aura un score bas, ce qui signale un probleme de citabilite IA.</li>
        <li><strong>Critere Autorite (15 pts)</strong> : les schemas ImageObject et VideoObject sont detectes comme signaux de confiance.</li>
        <li><strong>Detection des embeds</strong> : l'audit detecte les iframes YouTube, Vimeo, Instagram, TikTok et les signale comme des signaux de presence multimodale.</li>
        <li><strong>Critere Presence externe (10 pts)</strong> : les liens vers YouTube, Instagram et TikTok sont detectes comme signaux de presence multi-plateforme.</li>
      </ul>

      <InlineCTA />

      <h2>Plan d'action multimodal en 4 semaines</h2>

      <h3>Semaine 1 : audit de vos images existantes</h3>
      <p>Passez en revue toutes les images de vos pages principales. Verifiez que chaque image a un alt descriptif (pas juste le nom du fichier), que le contexte textuel autour est suffisant, et que les images ne contiennent pas d'informations textuelles essentielles sans equivalent HTML.</p>

      <h3>Semaine 2 : optimiser vos videos YouTube</h3>
      <p>Ajoutez des chapitres a vos videos existantes, corrigez les transcriptions automatiques, reformulez les titres en format question, et enrichissez les descriptions avec des answer capsules.</p>

      <h3>Semaine 3 : creer du contenu multimodal cible</h3>
      <p>Creez un tableau comparatif HTML (pas une image) sur votre page principale, embeddez votre meilleure video YouTube, et ajoutez un schema VideoObject si vous avez des videos sur votre site.</p>

      <h3>Semaine 4 : mesurer et iterer</h3>
      <p>Relancez un <InternalLink href="/pricing">audit GEO Detekia</InternalLink> pour mesurer l'impact de vos optimisations multimodales sur votre score de citabilite. Comparez avec votre score initial et identifiez les prochaines actions.</p>

      <h2>Ce qu'il faut retenir</h2>

      <p>Le GEO multimodal n'est pas un "nice to have". Avec YouTube a 29,5 % des citations AI Overviews et les moteurs IA qui affichent de plus en plus de visuels dans leurs reponses, ignorer le multimodal c'est se priver d'un tiers de la surface de visibilite IA. Les trois actions les plus impactantes : des alt descriptifs sur toutes vos images, une presence YouTube avec des videos optimisees (titres en question, chapitres, transcriptions), et du contenu textuel qui accompagne chaque visuel. Les IA ne voient pas vos images, elles lisent ce que vous ecrivez autour.</p>
    </>
  );
}
