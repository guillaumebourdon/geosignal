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

function BotTable() {
  const bots = [
    { ia: 'ChatGPT / OpenAI', agent: 'GPTBot', agent2: 'OAI-SearchBot', doc: 'openai.com/gptbot' },
    { ia: 'Claude / Anthropic', agent: 'ClaudeBot', agent2: 'anthropic-ai', doc: 'anthropic.com/robots' },
    { ia: 'Perplexity', agent: 'PerplexityBot', agent2: '—', doc: 'perplexity.ai/bot' },
    { ia: 'Google Gemini', agent: 'Google-Extended', agent2: 'Googlebot', doc: 'developers.google.com' },
    { ia: 'Meta AI', agent: 'FacebookBot', agent2: '—', doc: 'facebook.com/bot' },
    { ia: 'Common Crawl', agent: 'CCBot', agent2: '—', doc: 'commoncrawl.org/faq' },
  ];
  return (
    <div style={{ overflowX: 'auto', margin: '24px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #E5E2DC' }}>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>IA</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>User-agent principal</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>User-agent secondaire</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((b, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #E5E2DC', background: i % 2 === 0 ? 'transparent' : 'rgba(229,226,220,0.2)' }}>
              <td style={{ padding: '10px 12px', color: '#1A1916', fontWeight: 500 }}>{b.ia}</td>
              <td style={{ padding: '10px 12px' }}><code style={{ background: 'rgba(229,226,220,0.5)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{b.agent}</code></td>
              <td style={{ padding: '10px 12px' }}><code style={{ background: 'rgba(229,226,220,0.5)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{b.agent2}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default function LlmsTxtRobotsCrawlabiliteIa() {
  return (
    <>
      <p>Avant de se demander si les IA comprennent votre contenu, il y a une question plus fondamentale : est-ce qu'elles peuvent y accéder ? Un nombre surprenant de <InternalLink href="/blog/sites-bloquent-bots-ia">sites bien optimisés pour Google bloquent involontairement les robots des IA</InternalLink> dans leur fichier robots.txt. D'autres laissent les bots accéder au site mais leur servent du JavaScript non rendu, illisible pour les crawlers.</p>

      <p>Ce guide technique couvre tout ce qu'il faut savoir sur la crawlabilité IA : les user-agents à connaître, la configuration robots.txt correcte, le nouveau standard llms.txt, et les vérifications à faire pour s'assurer que votre site est réellement indexable par les LLM.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">La crawlabilité IA est l'un des 8 critères du score GEO — voir la méthodologie complète →</ArrowLink>

      <h2>Les robots des IA : qui sont-ils ?</h2>

      <p>Chaque grande plateforme d'IA déploie ses propres robots pour crawler le Web. Comme Googlebot pour le SEO, ces bots s'identifient par un "user-agent" spécifique dans leur requête HTTP.</p>

      <BotTable />

      <p>Le point critique : si votre robots.txt contient une directive <code>Disallow: /</code> pour <code>User-agent: *</code> (tous les robots), elle bloque aussi tous les bots IA. C'est souvent une erreur de configuration héritée — faite pour bloquer les scrapers — qui s'applique involontairement aux LLM.</p>

      <h2>Configurer robots.txt correctement</h2>

      <p>Un robots.txt GEO-compatible doit explicitement autoriser les principaux bots IA. Voici la configuration recommandée :</p>

      <pre><code>{`# robots.txt — configuration GEO-compatible

# Moteurs de recherche classiques
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# OpenAI / ChatGPT
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

# Anthropic / Claude
User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

# Perplexity
User-agent: PerplexityBot
Allow: /

# Google Gemini / AI Overviews
User-agent: Google-Extended
Allow: /

# Common Crawl (données d'entraînement)
User-agent: CCBot
Allow: /

# Règle générale
User-agent: *
Allow: /

Sitemap: https://www.votresite.fr/sitemap.xml`}</code></pre>

      <p>Pour en savoir plus sur la configuration optimale du sitemap et du robots.txt, consultez notre guide sur le <InternalLink href="/blog/sitemap-robots-txt-bots-ia-2026">sitemap, robots.txt et bots IA en 2026</InternalLink>.</p>

      <p>Si vous souhaitez autoriser les IA tout en bloquant certains scrapers, vous pouvez combiner des directives spécifiques avec une règle générale restrictive :</p>

      <pre><code>{`# Autoriser les bots IA explicitement
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Bloquer les scrapers non identifiés
User-agent: *
Disallow: /`}</code></pre>

      <p><strong>Attention :</strong> Les directives spécifiques ont priorité sur les directives générales. Un bot listé explicitement avec <code>Allow: /</code> sera autorisé même si la règle <code>User-agent: *</code> l'interdit.</p>

      <h2>Vérifier votre configuration actuelle</h2>

      <p>Pour tester votre robots.txt actuel, accédez directement à <code>https://votresite.fr/robots.txt</code>. Cherchez les user-agents listés ci-dessus et vérifiez s'ils sont autorisés ou bloqués.</p>

      <p>Trois situations à identifier :</p>

      <ul>
        <li><strong>User-agent non mentionné</strong> → le bot hérite de la règle <code>User-agent: *</code>. Si cette règle est <code>Allow: /</code>, c'est OK. Si c'est <code>Disallow: /</code>, le bot est bloqué.</li>
        <li><strong>User-agent avec <code>Disallow: /</code></strong> → le bot est explicitement bloqué. À corriger immédiatement.</li>
        <li><strong>User-agent avec <code>Allow: /</code></strong> → correct, le bot peut crawler votre site.</li>
      </ul>

      <p>L'outil Google Search Console dispose d'un testeur de robots.txt. Pour les bots IA hors Google, vous pouvez utiliser l'extension Chrome "robots.txt viewer" ou un service comme sitechecker.pro.</p>

      <h2>Le fichier llms.txt : le nouveau standard</h2>

      <p>Le fichier <code>llms.txt</code> est une initiative proposée en 2024 (par Jeremy Howard, créateur de fast.ai) pour créer un standard permettant aux sites Web de communiquer directement avec les LLM. Il se place à la racine du site, comme robots.txt, et contient un résumé structuré du site et de ses contenus clés.</p>

      <h3>Qu'est-ce que llms.txt contient ?</h3>

      <p>Le format proposé est simple — du Markdown structuré avec des sections définies :</p>

      <pre><code>{`# Nom du site

> Une description concise de ce que fait votre site (2-3 phrases max).
> Idéalement : qui vous êtes, ce que vous proposez, à qui vous vous adressez.

## Contenu principal

- [Guide GEO complet](https://votresite.fr/blog/geo-guide-complet): Le guide de référence pour optimiser sa visibilité IA en 2026
- [Audit GEO gratuit](https://votresite.fr/): Outil d'analyse automatique du score GEO, 8 critères mesurés
- [Méthodologie](https://votresite.fr/methodologie): Explication détaillée de chaque critère du score GEO

## À propos

- Fondé en : 2025
- Expertise : GEO (Generative Engine Optimization), SEO, visibilité IA
- Contact : contact@votresite.fr

## Ce que nous ne faisons pas

- Nous ne faisons pas de référencement payant (SEA)
- Nous ne proposons pas de création de contenu

## Liens utiles

- [Blog](https://votresite.fr/blog): Articles techniques sur le GEO
- [Tarifs](https://votresite.fr/pricing): Nos offres
- [Contact](https://votresite.fr/contact): Formulaire de contact`}</code></pre>

      <h3>llms.txt vs llms-full.txt</h3>

      <p>Le standard propose deux variantes :</p>

      <ul>
        <li><strong>llms.txt</strong> — résumé court, index vers les pages importantes. Idéal pour les LLM qui scannent rapidement.</li>
        <li><strong>llms-full.txt</strong> — version complète avec le contenu intégral des pages clés. Destiné aux LLM qui veulent indexer le contenu en profondeur.</li>
      </ul>

      <p>Commencez par <code>llms.txt</code>. La version full est optionnelle et surtout utile pour les sites à contenu riche (documentation, bases de connaissances).</p>

      <h3>llms.txt est-il déjà adopté par les IA ?</h3>

      <p>En 2026, le standard est reconnu et utilisé par Perplexity et certains crawlers académiques. OpenAI et Anthropic suivent le standard robots.txt et ont indiqué qu'ils prendraient en compte llms.txt à terme. Google n'a pas commenté officiellement.</p>

      <p>La recommandation pragmatique : créer un llms.txt maintenant. Le coût est minimal (20 minutes), le bénéfice potentiel est réel à mesure que l'adoption progresse, et ça ne nuit pas à votre SEO.</p>

      <h2>Les autres obstacles à la crawlabilité IA</h2>

      <h3>Le JavaScript côté client</h3>

      <p>C'est le problème le plus sous-estimé. Si votre contenu est rendu en JavaScript côté client (React, Vue, Angular sans SSR), les bots IA basiques ne verront pas ce contenu — ils reçoivent le HTML initial, sans attendre l'exécution du JS. Pour maximiser la lisibilité, pensez aussi à implémenter vos <InternalLink href="/blog/schema-org-ia-guide-pratique">données structurées Schema.org</InternalLink>.</p>

      <pre><code>{`<!-- ❌ Contenu invisible pour les bots basiques -->
<div id="app"></div>
<script>
  // Le contenu est chargé après coup en JS
  document.getElementById('app').innerHTML = '<h1>Mon contenu</h1>';
</script>

<!-- ✅ Contenu visible immédiatement -->
<h1>Mon contenu</h1>`}</code></pre>

      <p><strong>Solution :</strong> Utiliser le Server-Side Rendering (SSR) ou la génération statique (SSG). Next.js, Nuxt.js, et Gatsby sont conçus pour ça. Si vous utilisez une SPA pure, mettez en place un pre-rendering.</p>

      <h3>Le contenu derrière authentification</h3>

      <p>Les pages nécessitant une connexion sont inaccessibles aux bots, par définition. Si votre contenu de valeur est derrière un login, envisagez d'en rendre une version publique (ou une preview) accessible sans authentification.</p>

      <h3>Les erreurs 4xx et 5xx</h3>

      <p>Les pages qui retournent des erreurs HTTP seront ignorées. Vérifiez régulièrement que vos pages importantes retournent bien un 200 avec Google Search Console ou un outil de crawl comme Screaming Frog.</p>

      <h3>Le canonical et les redirections</h3>

      <p>Si vos pages importantes font l'objet de redirections en chaîne ou de canonicals qui pointent vers une autre URL, les bots peuvent ne pas suivre jusqu'au contenu final. Simplifiez les structures d'URL et limitez les redirections à une seule étape.</p>

      <h2>Checklist de crawlabilité IA</h2>

      <ul>
        <li>✓ robots.txt testé — GPTBot, ClaudeBot, PerplexityBot et Google-Extended autorisés</li>
        <li>✓ Sitemap XML présent et référencé dans robots.txt</li>
        <li>✓ llms.txt créé à la racine du site</li>
        <li>✓ Contenu principal rendu côté serveur (SSR ou SSG)</li>
        <li>✓ Pas de contenu important uniquement derrière JavaScript client-side</li>
        <li>✓ Pages importantes retournent HTTP 200</li>
        <li>✓ Pas de redirections en chaîne vers les pages clés</li>
        <li>✓ Temps de réponse inférieur à 3 secondes</li>
      </ul>

      <ArrowLink href="/">Vérifiez la crawlabilité IA de votre site avec l'audit GEO →</ArrowLink>

      <h2>Questions fréquentes</h2>

      <h3>Bloquer les bots IA nuit-il à mon SEO classique ?</h3>

      <p>Non, à condition de ne bloquer que les bots IA et de laisser Googlebot accéder normalement. Les deux systèmes de crawl sont indépendants. <code>Google-Extended</code> est distinct de <code>Googlebot</code> — vous pouvez bloquer l'un sans affecter l'autre.</p>

      <h3>Dois-je autoriser Common Crawl ?</h3>

      <p>Common Crawl est la base de données sur laquelle sont entraînés de nombreux LLM open-source. L'autoriser augmente vos chances d'être dans les données d'entraînement de futurs modèles. Si vous n'avez pas de raison spécifique de le bloquer (contenu sensible, paywall), autorisez-le.</p>

      <h3>Que se passe-t-il si je bloque les bots IA après avoir été indexé ?</h3>

      <p>Les informations déjà dans les données d'entraînement des LLM restent — vous ne pouvez pas "effacer" du corpus d'entraînement. En revanche, pour les systèmes de recherche IA en temps réel (Perplexity, SearchGPT), bloquer le bot empêchera les futures citations.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Voir tous les critères GEO et leur impact sur votre score →</ArrowLink>
      <InlineCTA href="/">Votre site est-il visible pour les IA ? Testez gratuitement.</InlineCTA>
    </>
  );
}
