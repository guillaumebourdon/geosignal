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

function CodeBlock({ title, children }) {
  return (
    <div style={{ margin: '24px 0' }}>
      {title && <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#6B6762', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>{title}</div>}
      <pre style={{ background: '#1A1916', color: '#F7F5F2', borderRadius: 10, padding: '20px 24px', overflow: 'auto', fontSize: 13, lineHeight: 1.6 }}><code>{children}</code></pre>
    </div>
  );
}

function BotTable() {
  const bots = [
    { name: 'GPTBot', owner: 'OpenAI', type: 'Entraînement + recherche', usage: 'Crawle pour améliorer les modèles GPT. Séparé de OAI-SearchBot (citations en temps réel).', respect: 'Oui' },
    { name: 'OAI-SearchBot', owner: 'OpenAI', type: 'Citation temps réel', usage: 'Alimente les réponses avec sources de ChatGPT Search. Bloquer = disparaître des citations.', respect: 'Oui' },
    { name: 'ClaudeBot', owner: 'Anthropic', type: 'Entraînement', usage: 'Crawle pour le corpus d\'entraînement de Claude.', respect: 'Oui' },
    { name: 'PerplexityBot', owner: 'Perplexity', type: 'Citation temps réel', usage: 'Index propriétaire. Alimente les réponses sourcées de Perplexity.', respect: 'Oui' },
    { name: 'Google-Extended', owner: 'Google', type: 'Entraînement Gemini', usage: 'Séparé de Googlebot (SEO). Bloquer Google-Extended n\'affecte pas le SEO.', respect: 'Oui' },
    { name: 'Bytespider', owner: 'ByteDance', type: 'Entraînement', usage: 'Crawle pour les modèles IA de TikTok/ByteDance. Agressif en volume.', respect: 'Partiel' },
    { name: 'CCBot', owner: 'Common Crawl', type: 'Corpus ouvert', usage: 'Alimente Common Crawl, utilisé par la majorité des LLM en entraînement.', respect: 'Oui' },
  ];
  return (
    <div style={{ overflowX: 'auto', margin: '24px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #E5E2DC' }}>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>Bot</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>Propriétaire</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>Type</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>Respecte robots.txt</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((b, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #F0EDE8' }}>
              <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1A1916' }}><code>{b.name}</code></td>
              <td style={{ padding: '10px 12px', color: '#3A3835' }}>{b.owner}</td>
              <td style={{ padding: '10px 12px', color: '#6B6762' }}>{b.type}</td>
              <td style={{ padding: '10px 12px', color: b.respect === 'Oui' ? '#10A37F' : '#D97757', fontWeight: 600 }}>{b.respect}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SitemapRobotsTxtBotsIa2026() {
  return (
    <>
      <p>Votre robots.txt bloque probablement des bots IA sans que vous le sachiez. Selon une étude Originality.ai de 2025, <strong>73 % des sites bloquent au moins un crawler IA</strong> — souvent par défaut, via une règle <code>Disallow</code> trop large héritée d'une migration ou d'un template WordPress.</p>

      <p>En 2026, le paysage a changé. Sept bots IA majeurs crawlent le web en permanence, et la distinction entre ceux qui entraînent des modèles et ceux qui alimentent les citations en temps réel est devenue stratégique. Si vous bloquez le mauvais bot, vous disparaissez des réponses IA. Si vous les autorisez tous sans réfléchir, vous offrez vos données d'entraînement sans contrepartie.</p>

      <p>Cet article vous donne la configuration de référence — robots.txt, sitemap.xml et llms.txt — pour 2026.</p>

      <h2>Les bots IA en 2026 : qui crawle quoi</h2>

      <p>La première erreur est de traiter tous les bots IA de la même façon. Il y a deux catégories fondamentalement différentes :</p>

      <ul>
        <li><strong>Les crawlers d'entraînement</strong> (GPTBot, ClaudeBot, CCBot, Google-Extended, Bytespider) : ils collectent des données pour améliorer les modèles. Les bloquer n'a pas d'impact immédiat sur votre visibilité dans les réponses IA.</li>
        <li><strong>Les crawlers de citation</strong> (OAI-SearchBot, PerplexityBot, Googlebot pour AI Overviews) : ils alimentent les réponses en temps réel. Les bloquer signifie disparaître des citations IA.</li>
      </ul>

      <BotTable />

      <p>La recommandation stratégique : <strong>autorisez systématiquement les crawlers de citation</strong> (OAI-SearchBot, PerplexityBot). Pour les crawlers d'entraînement, la décision dépend de votre stratégie — certains sites choisissent de bloquer l'entraînement tout en restant citables. Pour approfondir ce sujet, consultez notre <InternalLink href="/blog/llms-txt-robots-crawlabilite-ia">guide technique sur l'accessibilité IA</InternalLink>.</p>

      <h2>robots.txt : configuration stratégique pour les bots IA</h2>

      <p>Le robots.txt est votre premier levier de contrôle. Voici trois configurations selon votre stratégie.</p>

      <h3>Configuration "tout autoriser" (recommandée pour le GEO)</h3>

      <p>Si votre objectif est de maximiser votre visibilité IA — citations, recommandations, apparition dans les réponses — autorisez tous les bots :</p>

      <CodeBlock title="robots.txt — Visibilité maximale">{`User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://votre-site.fr/sitemap.xml`}</CodeBlock>

      <p>Pourquoi lister chaque bot individuellement alors que <code>User-agent: *</code> les couvre déjà ? Parce que certains bots vérifient d'abord leur propre directive avant de regarder <code>*</code>. En listant explicitement chaque bot avec <code>Allow: /</code>, vous éliminez toute ambiguïté.</p>

      <h3>Configuration "citation oui, entraînement non"</h3>

      <p>Si vous voulez être cité par les IA sans que vos données servent à entraîner les modèles :</p>

      <CodeBlock title="robots.txt — Citations uniquement">{`User-agent: *
Allow: /

# Crawlers de citation — AUTORISER
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Crawlers d'entraînement — BLOQUER
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

Sitemap: https://votre-site.fr/sitemap.xml`}</CodeBlock>

      <p><strong>Attention</strong> : cette configuration a une limite. Les modèles IA sont entraînés sur des snapshots passés. Si vous bloquez GPTBot aujourd'hui, les versions futures de GPT connaîtront moins bien votre site, ce qui peut indirectement réduire vos citations à long terme. C'est un compromis à évaluer.</p>

      <h3>Piège classique : la règle <code>Disallow: /</code> globale</h3>

      <p>Le piège le plus fréquent : un <code>User-agent: * / Disallow: /</code> sans exceptions. Ça bloque <strong>tous</strong> les bots IA d'un coup. On voit souvent ça sur des sites migrés depuis WordPress avec un plugin SEO mal configuré, ou sur des sites en staging dont le robots.txt a été oublié en prod.</p>

      <InlineCTA href="/">
        Votre robots.txt bloque-t-il des bots IA ? L'audit GEO Detekia vérifie l'accessibilité IA de votre site.
      </InlineCTA>

      <h2>Sitemap.xml : les signaux qui aident les IA</h2>

      <p>Le sitemap n'est pas seulement pour Google. Les bots IA comme PerplexityBot et OAI-SearchBot le lisent aussi pour découvrir vos pages. Trois signaux sont particulièrement importants.</p>

      <h3><code>&lt;lastmod&gt;</code> — Le signal de fraîcheur</h3>

      <p>Les IA valorisent le contenu frais. La balise <code>&lt;lastmod&gt;</code> leur dit quand une page a été mise à jour pour la dernière fois. Selon les observations de Growth Memo (2026), les pages avec un <code>&lt;lastmod&gt;</code> récent sont crawlées plus fréquemment par les bots IA.</p>

      <p><strong>Règle</strong> : mettez à jour <code>&lt;lastmod&gt;</code> uniquement quand le contenu change réellement. Pas à chaque build, pas en automatique. Les bots IA (et Google) détectent les <code>&lt;lastmod&gt;</code> artificiels et les ignorent.</p>

      <h3><code>&lt;priority&gt;</code> et structure</h3>

      <p>La balise <code>&lt;priority&gt;</code> est ignorée par la plupart des moteurs, mais la <strong>structure</strong> du sitemap compte. Séparez vos sitemaps si vous avez plus de 100 URLs : un <code>sitemap-pages.xml</code> pour les pages marketing et un <code>sitemap-blog.xml</code> pour les articles. Ça aide les bots à prioriser.</p>

      <h3>hreflang dans le sitemap</h3>

      <p>Si votre site est multilingue, les balises <code>xhtml:link</code> avec <code>hreflang</code> dans le sitemap aident les IA à associer les bonnes versions linguistiques. C'est particulièrement important pour Perplexity qui adapte ses réponses à la langue de l'utilisateur.</p>

      <CodeBlock title="Extrait sitemap avec hreflang">{`<url>
  <loc>https://votre-site.fr/guide-geo</loc>
  <lastmod>2026-04-15</lastmod>
  <xhtml:link rel="alternate" hreflang="fr"
    href="https://votre-site.fr/guide-geo" />
  <xhtml:link rel="alternate" hreflang="en"
    href="https://votre-site.fr/en/guide-geo" />
  <xhtml:link rel="alternate" hreflang="x-default"
    href="https://votre-site.fr/guide-geo" />
</url>`}</CodeBlock>

      <h2>llms.txt : le standard émergent pour les IA</h2>

      <p>Le fichier <code>llms.txt</code> est une initiative lancée fin 2024 pour donner aux LLM un résumé structuré de votre site. Contrairement au robots.txt (qui dit ce que les bots peuvent crawler), le llms.txt dit ce que votre site <em>est</em> et quelles pages sont les plus importantes.</p>

      <p>En avril 2026, le llms.txt n'est pas encore un standard officiel, mais il est lu par certains crawlers et peut influencer la façon dont les IA comprennent votre site. C'est un signal optionnel mais de plus en plus recommandé.</p>

      <CodeBlock title="Exemple llms.txt">{`# Detekia
> Detekia est un outil d'audit GEO qui analyse la visibilité
> des sites web sur les moteurs IA (ChatGPT, Gemini, Perplexity).

## Pages principales
- [Accueil](https://detekia.fr): Audit GEO gratuit
- [Méthodologie](https://detekia.fr/methodologie): 7 critères GEO
- [Tarifs](https://detekia.fr/pricing): Audit 1 page et complet
- [Blog](https://detekia.fr/blog): Guides GEO et SEO

## Expertise
- Audit de visibilité IA
- Scoring GEO sur 100
- Recommandations techniques avec code
- Méthodologie basée sur Princeton/KDD 2024`}</CodeBlock>

      <p><strong>Bonnes pratiques</strong> : restez concis (moins de 500 mots), structurez en sections Markdown, et mettez à jour quand votre offre évolue. Le fichier se place à la racine : <code>votre-site.fr/llms.txt</code>.</p>

      <p>Pour un guide complet sur le llms.txt et l'accessibilité IA, consultez notre article dédié : <InternalLink href="/blog/llms-txt-robots-crawlabilite-ia">llms.txt, robots.txt et accessibilité IA</InternalLink>.</p>

      <h2>5 pièges à éviter</h2>

      <ol>
        <li><strong>Bloquer GPTBot en pensant bloquer uniquement l'entraînement.</strong> Depuis début 2026, OpenAI utilise <code>OAI-SearchBot</code> pour les citations en temps réel, séparé de <code>GPTBot</code>. Si vous ne bloquez que GPTBot, vos citations ChatGPT sont préservées. Mais si votre règle bloque les deux, vous disparaissez.</li>
        <li><strong>Oublier la directive <code>Sitemap:</code> dans le robots.txt.</strong> C'est le moyen le plus simple pour les bots de découvrir votre sitemap. Sans cette ligne, certains crawlers IA ne le trouvent pas automatiquement.</li>
        <li><strong>Le <code>lastmod</code> automatique à chaque déploiement.</strong> Si toutes vos pages ont la date d'aujourd'hui en <code>lastmod</code>, les bots finissent par ignorer ce signal. Ne mettez à jour que les pages dont le contenu a réellement changé.</li>
        <li><strong>Le <code>Crawl-delay</code> trop agressif.</strong> Certains sites ajoutent <code>Crawl-delay: 10</code> pour limiter la charge serveur. Les bots IA comme PerplexityBot respectent cette directive — un délai de 10 secondes entre chaque page signifie que crawler 100 pages prend 17 minutes. Sur un site de contenu, c'est un frein à l'indexation IA.</li>
        <li><strong>Ne pas tester après une migration.</strong> Les migrations de CMS, les changements de CDN et les mises à jour de reverse proxy peuvent écraser silencieusement votre robots.txt. Testez systématiquement après chaque changement d'infrastructure avec un <code>curl https://votre-site.fr/robots.txt</code>.</li>
      </ol>

      <h2>Configuration de référence 2026</h2>

      <p>Voici la configuration complète à copier-coller et adapter. Elle autorise tous les bots de citation, tous les bots d'entraînement, et inclut le sitemap et le llms.txt.</p>

      <CodeBlock title="robots.txt — Configuration de référence 2026">{`# robots.txt — Configuration GEO optimale 2026
# Documentation : detekia.fr/blog/sitemap-robots-txt-bots-ia-2026

User-agent: *
Allow: /

# Bots IA — Citation temps réel
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Bots IA — Entraînement (autoriser pour visibilité max)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

# Sitemap
Sitemap: https://votre-site.fr/sitemap.xml`}</CodeBlock>

      <p>Pour la configuration "citation uniquement" (bloquer l'entraînement), remplacez <code>Allow: /</code> par <code>Disallow: /</code> sur GPTBot, ClaudeBot, Google-Extended, CCBot et Bytespider.</p>

      <InlineCTA href="/">
        Vérifiez que votre configuration est correcte : l'audit GEO Detekia analyse l'accessibilité IA de votre site par les bots IA.
      </InlineCTA>

      <h2>Checklist finale</h2>

      <ul>
        <li>✓ Le robots.txt autorise explicitement les bots de citation (OAI-SearchBot, PerplexityBot)</li>
        <li>✓ La directive <code>Sitemap:</code> pointe vers votre sitemap.xml</li>
        <li>✓ Le sitemap contient des <code>&lt;lastmod&gt;</code> mis à jour uniquement quand le contenu change</li>
        <li>✓ Les balises hreflang sont présentes dans le sitemap pour les sites multilingues</li>
        <li>✓ Un fichier llms.txt est présent à la racine avec un résumé structuré du site</li>
        <li>✓ Pas de <code>Crawl-delay</code> excessif (ou absent)</li>
        <li>✓ Le robots.txt est testé après chaque migration ou changement d'infrastructure</li>
        <li>✓ Les <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">7 critères GEO</InternalLink> sont vérifiés, dont l'accessibilité IA</li>
      </ul>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org et JSON-LD : le guide complet pour la visibilité IA</ArrowLink>
    </>
  );
}
