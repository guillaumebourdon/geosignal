import Link from 'next/link';

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
        Analyze my website for free →
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
    { name: 'GPTBot', owner: 'OpenAI', type: 'Training + search', usage: 'Crawls to improve GPT models. Separate from OAI-SearchBot (real-time citations).', respect: 'Yes' },
    { name: 'OAI-SearchBot', owner: 'OpenAI', type: 'Real-time citation', usage: 'Powers ChatGPT Search sourced responses. Blocking = disappearing from citations.', respect: 'Yes' },
    { name: 'ClaudeBot', owner: 'Anthropic', type: 'Training', usage: 'Crawls for Claude training corpus.', respect: 'Yes' },
    { name: 'PerplexityBot', owner: 'Perplexity', type: 'Real-time citation', usage: 'Proprietary index. Powers Perplexity sourced responses.', respect: 'Yes' },
    { name: 'Google-Extended', owner: 'Google', type: 'Gemini training', usage: 'Separate from Googlebot (SEO). Blocking Google-Extended doesn\'t affect SEO.', respect: 'Yes' },
    { name: 'Bytespider', owner: 'ByteDance', type: 'Training', usage: 'Crawls for TikTok/ByteDance AI models. Aggressive crawl volume.', respect: 'Partial' },
    { name: 'CCBot', owner: 'Common Crawl', type: 'Open corpus', usage: 'Feeds Common Crawl, used by most LLMs for training.', respect: 'Yes' },
  ];
  return (
    <div style={{ overflowX: 'auto', margin: '24px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #E5E2DC' }}>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>Bot</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>Owner</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>Type</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>Respects robots.txt</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((b, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #F0EDE8' }}>
              <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1A1916' }}><code>{b.name}</code></td>
              <td style={{ padding: '10px 12px', color: '#3A3835' }}>{b.owner}</td>
              <td style={{ padding: '10px 12px', color: '#6B6762' }}>{b.type}</td>
              <td style={{ padding: '10px 12px', color: b.respect === 'Yes' ? '#10A37F' : '#D97757', fontWeight: 600 }}>{b.respect}</td>
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
      <p>Your robots.txt is probably blocking AI bots without you knowing it. According to an Originality.ai study from 2025, <strong>73% of websites block at least one AI crawler</strong> — often by default, through an overly broad <code>Disallow</code> rule inherited from a migration or a WordPress template.</p>

      <p>In 2026, the landscape has changed. Seven major AI bots crawl the web constantly, and the distinction between those that train models and those that power real-time citations has become strategic. Block the wrong bot, and you disappear from AI responses. Allow them all without thinking, and you give away your training data for free.</p>

      <p>This article gives you the reference configuration — robots.txt, sitemap.xml and llms.txt — for 2026.</p>

      <h2>AI bots in 2026: who crawls what</h2>

      <p>The first mistake is treating all AI bots the same way. There are two fundamentally different categories:</p>

      <ul>
        <li><strong>Training crawlers</strong> (GPTBot, ClaudeBot, CCBot, Google-Extended, Bytespider): they collect data to improve models. Blocking them has no immediate impact on your visibility in AI responses.</li>
        <li><strong>Citation crawlers</strong> (OAI-SearchBot, PerplexityBot, Googlebot for AI Overviews): they power real-time responses. Blocking them means disappearing from AI citations.</li>
      </ul>

      <BotTable />

      <p>The strategic recommendation: <strong>always allow citation crawlers</strong> (OAI-SearchBot, PerplexityBot). For training crawlers, the decision depends on your strategy — some sites choose to block training while remaining citable. For a deeper dive, see our <InternalLink href="/blog/llms-txt-robots-crawlabilite-ia">technical guide on AI crawlability</InternalLink>.</p>

      <h2>robots.txt: strategic configuration for AI bots</h2>

      <p>The robots.txt is your first control lever. Here are three configurations based on your strategy.</p>

      <h3>"Allow all" configuration (recommended for GEO)</h3>

      <p>If your goal is to maximize AI visibility — citations, recommendations, appearing in responses — allow all bots:</p>

      <CodeBlock title="robots.txt — Maximum visibility">{`User-agent: *
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

Sitemap: https://your-site.com/sitemap.xml`}</CodeBlock>

      <p>Why list each bot individually when <code>User-agent: *</code> already covers them? Because some bots check their own directive first before looking at <code>*</code>. By explicitly listing each bot with <code>Allow: /</code>, you eliminate any ambiguity.</p>

      <h3>"Citation yes, training no" configuration</h3>

      <p>If you want to be cited by AI without your data being used to train models:</p>

      <CodeBlock title="robots.txt — Citations only">{`User-agent: *
Allow: /

# Citation crawlers — ALLOW
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Training crawlers — BLOCK
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

Sitemap: https://your-site.com/sitemap.xml`}</CodeBlock>

      <p><strong>Warning</strong>: this configuration has a limitation. AI models are trained on past snapshots. If you block GPTBot today, future GPT versions will know less about your site, which can indirectly reduce your citations long-term. It's a trade-off to evaluate.</p>

      <h3>Classic trap: the global <code>Disallow: /</code> rule</h3>

      <p>The most common trap: a <code>User-agent: * / Disallow: /</code> with no exceptions. That blocks <strong>all</strong> AI bots at once. You often see this on sites migrated from WordPress with a misconfigured SEO plugin, or on staging sites whose robots.txt was forgotten in production.</p>

      <InlineCTA href="/">
        Is your robots.txt blocking AI bots? The Detekia GEO audit checks your site's crawlability.
      </InlineCTA>

      <h2>Sitemap.xml: signals that help AI</h2>

      <p>The sitemap isn't just for Google. AI bots like PerplexityBot and OAI-SearchBot read it too to discover your pages. Three signals are particularly important.</p>

      <h3><code>&lt;lastmod&gt;</code> — The freshness signal</h3>

      <p>AI values fresh content. The <code>&lt;lastmod&gt;</code> tag tells them when a page was last updated. According to Growth Memo observations (2026), pages with a recent <code>&lt;lastmod&gt;</code> are crawled more frequently by AI bots.</p>

      <p><strong>Rule</strong>: only update <code>&lt;lastmod&gt;</code> when content actually changes. Not on every build, not automatically. AI bots (and Google) detect artificial <code>&lt;lastmod&gt;</code> values and ignore them.</p>

      <h3><code>&lt;priority&gt;</code> and structure</h3>

      <p>The <code>&lt;priority&gt;</code> tag is ignored by most engines, but sitemap <strong>structure</strong> matters. Split your sitemaps if you have more than 100 URLs: a <code>sitemap-pages.xml</code> for marketing pages and a <code>sitemap-blog.xml</code> for articles. This helps bots prioritize.</p>

      <h3>hreflang in the sitemap</h3>

      <p>For multilingual sites, <code>xhtml:link</code> tags with <code>hreflang</code> in the sitemap help AI associate the correct language versions. This is particularly important for Perplexity, which adapts responses to the user's language.</p>

      <CodeBlock title="Sitemap excerpt with hreflang">{`<url>
  <loc>https://your-site.com/geo-guide</loc>
  <lastmod>2026-04-15</lastmod>
  <xhtml:link rel="alternate" hreflang="fr"
    href="https://your-site.com/geo-guide" />
  <xhtml:link rel="alternate" hreflang="en"
    href="https://your-site.com/en/geo-guide" />
  <xhtml:link rel="alternate" hreflang="x-default"
    href="https://your-site.com/geo-guide" />
</url>`}</CodeBlock>

      <h2>llms.txt: the emerging standard for AI</h2>

      <p>The <code>llms.txt</code> file is an initiative launched in late 2024 to give LLMs a structured summary of your site. Unlike robots.txt (which tells bots what they can crawl), llms.txt tells them what your site <em>is</em> and which pages are most important.</p>

      <p>As of April 2026, llms.txt isn't yet an official standard, but it's read by some crawlers and can influence how AI understands your site. It's an optional but increasingly recommended signal.</p>

      <CodeBlock title="Example llms.txt">{`# Detekia
> Detekia is a GEO audit tool that analyzes website visibility
> on AI engines (ChatGPT, Gemini, Perplexity).

## Main pages
- [Home](https://detekia.fr): Free GEO audit
- [Methodology](https://detekia.fr/methodologie): 8 GEO criteria
- [Pricing](https://detekia.fr/pricing): 1-page and complete audit
- [Blog](https://detekia.fr/blog): GEO and SEO guides

## Expertise
- AI visibility auditing
- GEO scoring out of 100
- Technical recommendations with code
- Methodology based on Princeton/KDD 2024`}</CodeBlock>

      <p><strong>Best practices</strong>: keep it concise (under 500 words), structure in Markdown sections, and update when your offering evolves. The file goes at the root: <code>your-site.com/llms.txt</code>.</p>

      <p>For a complete guide on llms.txt and AI crawlability, see our dedicated article: <InternalLink href="/blog/llms-txt-robots-crawlabilite-ia">llms.txt, robots.txt and AI crawlability</InternalLink>.</p>

      <h2>5 traps to avoid</h2>

      <ol>
        <li><strong>Blocking GPTBot thinking you're only blocking training.</strong> Since early 2026, OpenAI uses <code>OAI-SearchBot</code> for real-time citations, separate from <code>GPTBot</code>. If you only block GPTBot, your ChatGPT citations are preserved. But if your rule blocks both, you disappear.</li>
        <li><strong>Forgetting the <code>Sitemap:</code> directive in robots.txt.</strong> It's the simplest way for bots to discover your sitemap. Without this line, some AI crawlers don't find it automatically.</li>
        <li><strong>Automatic <code>lastmod</code> on every deploy.</strong> If all your pages have today's date as <code>lastmod</code>, bots end up ignoring this signal. Only update pages whose content has actually changed.</li>
        <li><strong>Overly aggressive <code>Crawl-delay</code>.</strong> Some sites add <code>Crawl-delay: 10</code> to limit server load. AI bots like PerplexityBot respect this directive — a 10-second delay between pages means crawling 100 pages takes 17 minutes. For content sites, that's a bottleneck for AI indexing.</li>
        <li><strong>Not testing after migrations.</strong> CMS migrations, CDN changes and reverse proxy updates can silently overwrite your robots.txt. Always test after any infrastructure change with a simple <code>curl https://your-site.com/robots.txt</code>.</li>
      </ol>

      <h2>2026 reference configuration</h2>

      <p>Here's the complete configuration to copy-paste and adapt. It allows all citation bots, all training bots, and includes the sitemap and llms.txt references.</p>

      <CodeBlock title="robots.txt — 2026 reference configuration">{`# robots.txt — Optimal GEO configuration 2026
# Documentation: detekia.fr/blog/sitemap-robots-txt-bots-ia-2026

User-agent: *
Allow: /

# AI bots — Real-time citation
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# AI bots — Training (allow for maximum visibility)
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
Sitemap: https://your-site.com/sitemap.xml`}</CodeBlock>

      <p>For the "citation only" setup (block training), replace <code>Allow: /</code> with <code>Disallow: /</code> on GPTBot, ClaudeBot, Google-Extended, CCBot and Bytespider.</p>

      <InlineCTA href="/">
        Verify your configuration is correct: the Detekia GEO audit analyzes your site's AI bot crawlability.
      </InlineCTA>

      <h2>Final checklist</h2>

      <ul>
        <li>✓ robots.txt explicitly allows citation bots (OAI-SearchBot, PerplexityBot)</li>
        <li>✓ The <code>Sitemap:</code> directive points to your sitemap.xml</li>
        <li>✓ The sitemap contains <code>&lt;lastmod&gt;</code> values updated only when content actually changes</li>
        <li>✓ hreflang tags are present in the sitemap for multilingual sites</li>
        <li>✓ An llms.txt file is present at the root with a structured site summary</li>
        <li>✓ No excessive <code>Crawl-delay</code> (or absent)</li>
        <li>✓ robots.txt is tested after every migration or infrastructure change</li>
        <li>✓ The <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">8 GEO criteria</InternalLink> are verified, including AI crawlability</li>
      </ul>
    </>
  );
}
