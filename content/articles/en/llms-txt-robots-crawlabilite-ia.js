import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
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
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>AI Platform</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>Primary User-Agent</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6B6762', fontWeight: 600 }}>Secondary User-Agent</th>
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

export default function LlmsTxtRobotsCrawlabiliteIa() {
  return (
    <>
      <p>Before asking whether AI engines understand your content, there's a more fundamental question: can they even access it? A surprising number of well-optimized sites inadvertently block AI bots in their robots.txt file. Others let bots in but serve them unrendered JavaScript — gibberish to crawlers.</p>

      <p>This technical guide covers everything you need to know about AI Accessibility: the user-agents to know, the correct robots.txt configuration, the new llms.txt standard, and the checks to run to make sure your site is actually indexable by LLMs.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">AI Accessibility is one of the 8 GEO score criteria — see the full methodology →</ArrowLink>

      <h2>AI bots: who are they?</h2>

      <p>Every major AI platform deploys its own bots to crawl the web. Just like Googlebot for SEO, these bots identify themselves with a specific "user-agent" in their HTTP requests.</p>

      <BotTable />

      <p>The critical point: if your robots.txt contains a <code>Disallow: /</code> directive for <code>User-agent: *</code> (all bots), it blocks all AI bots too. This is often a legacy configuration error — originally meant to block scrapers — that unintentionally applies to LLMs.</p>

      <h2>Configure robots.txt correctly</h2>

      <p>A GEO-compatible robots.txt must explicitly allow the major AI bots. Here's the recommended configuration:</p>

      <pre><code>{`# robots.txt — GEO-compatible configuration

# Traditional search engines
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

# Common Crawl (training data)
User-agent: CCBot
Allow: /

# Default rule
User-agent: *
Allow: /

Sitemap: https://www.your-website.com/sitemap.xml`}</code></pre>

      <p>If you want to allow AI bots while blocking certain scrapers, you can combine specific directives with a restrictive default rule:</p>

      <pre><code>{`# Explicitly allow AI bots
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Block unidentified scrapers
User-agent: *
Disallow: /`}</code></pre>

      <p><strong>Important:</strong> Specific directives take priority over general ones. A bot listed explicitly with <code>Allow: /</code> will be allowed even if the <code>User-agent: *</code> rule blocks it.</p>

      <h2>Check your current configuration</h2>

      <p>To test your current robots.txt, go directly to <code>https://your-website.com/robots.txt</code>. Look for the user-agents listed above and check whether they're allowed or blocked.</p>

      <p>Three situations to identify:</p>

      <ul>
        <li><strong>User-agent not mentioned</strong> → the bot inherits the <code>User-agent: *</code> rule. If that rule is <code>Allow: /</code>, you're fine. If it's <code>Disallow: /</code>, the bot is blocked.</li>
        <li><strong>User-agent with <code>Disallow: /</code></strong> → the bot is explicitly blocked. Fix this immediately.</li>
        <li><strong>User-agent with <code>Allow: /</code></strong> → correct, the bot can crawl your site.</li>
      </ul>

      <p>Google Search Console includes a robots.txt tester. For non-Google AI bots, you can use the "robots.txt viewer" Chrome extension or a service like sitechecker.pro.</p>

      <h2>The llms.txt file: the new standard</h2>

      <p>The <code>llms.txt</code> file is an initiative proposed in 2024 (by Jeremy Howard, creator of fast.ai) to create a standard that allows websites to communicate directly with LLMs. It sits at the site root, like robots.txt, and contains a structured summary of the site and its key content.</p>

      <h3>What llms.txt contains</h3>

      <p>The proposed format is simple — structured Markdown with defined sections:</p>

      <pre><code>{`# Site Name

> A concise description of what your site does (2-3 sentences max).
> Ideally: who you are, what you offer, who you serve.

## Main Content

- [Complete GEO Guide](https://your-website.com/blog/geo-guide-complete): The definitive guide to optimizing AI visibility in 2026
- [Free GEO Audit](https://your-website.com/): Automated GEO score analysis tool, 7 criteria measured
- [Methodology](https://your-website.com/methodology): Detailed explanation of each GEO score criterion

## About

- Founded: 2025
- Expertise: GEO (Generative Engine Optimization), SEO, AI visibility
- Contact: contact@your-website.com

## What We Don't Do

- We don't do paid search advertising (PPC)
- We don't offer content creation services

## Useful Links

- [Blog](https://your-website.com/blog): Technical articles on GEO
- [Pricing](https://your-website.com/pricing): Our plans
- [Contact](https://your-website.com/contact): Contact form`}</code></pre>

      <h3>llms.txt vs llms-full.txt</h3>

      <p>The standard proposes two variants:</p>

      <ul>
        <li><strong>llms.txt</strong> — short summary, index of important pages. Ideal for LLMs doing quick scans.</li>
        <li><strong>llms-full.txt</strong> — complete version with the full content of key pages. Intended for LLMs that want to index content in depth.</li>
      </ul>

      <p>Start with <code>llms.txt</code>. The full version is optional and mainly useful for content-rich sites (documentation, knowledge bases).</p>

      <h3>Is llms.txt already adopted by AI engines?</h3>

      <p>As of 2026, the standard is recognized and used by Perplexity and some academic crawlers. OpenAI and Anthropic follow the robots.txt standard and have indicated they will take llms.txt into account going forward. Google has not officially commented.</p>

      <p>The pragmatic recommendation: create an llms.txt now. The cost is minimal (20 minutes), the potential benefit is real as adoption grows, and it won't hurt your SEO.</p>

      <h2>Other crawlability obstacles</h2>

      <h3>Client-side JavaScript</h3>

      <p>This is the most underestimated problem. If your content is rendered in client-side JavaScript (React, Vue, Angular without SSR), basic AI bots won't see that content — they receive the initial HTML without waiting for JS execution.</p>

      <pre><code>{`<!-- ❌ Content invisible to basic bots -->
<div id="app"></div>
<script>
  // Content is loaded after the fact via JS
  document.getElementById('app').innerHTML = '<h1>My content</h1>';
</script>

<!-- ✅ Content visible immediately -->
<h1>My content</h1>`}</code></pre>

      <p><strong>Fix:</strong> Use Server-Side Rendering (SSR) or Static Site Generation (SSG). Next.js, Nuxt.js, and Gatsby are built for this. If you're running a pure SPA, implement pre-rendering.</p>

      <h3>Content behind authentication</h3>

      <p>Pages that require a login are inaccessible to bots by definition. If your valuable content is behind a login wall, consider making a public version (or a preview) available without authentication.</p>

      <h3>4xx and 5xx errors</h3>

      <p>Pages that return HTTP errors will be ignored. Regularly check that your important pages return a 200 using Google Search Console or a crawl tool like Screaming Frog.</p>

      <h3>Canonicals and redirects</h3>

      <p>If your important pages have redirect chains or canonical tags pointing to a different URL, bots may not follow through to the final content. Simplify your URL structure and limit redirects to a single hop.</p>

      <h2>AI Accessibility checklist</h2>

      <ul>
        <li>✓ robots.txt tested — GPTBot, ClaudeBot, PerplexityBot, and Google-Extended allowed</li>
        <li>✓ XML sitemap present and referenced in robots.txt</li>
        <li>✓ llms.txt created at the site root</li>
        <li>✓ Main content rendered server-side (SSR or SSG)</li>
        <li>✓ No important content behind client-side JavaScript only</li>
        <li>✓ Key pages return HTTP 200</li>
        <li>✓ No redirect chains to key pages</li>
        <li>✓ Response time under 3 seconds</li>
      </ul>

      <ArrowLink href="/">Check your site's AI Accessibility with the GEO audit →</ArrowLink>

      <h2>Frequently asked questions</h2>

      <h3>Does blocking AI bots hurt my regular SEO?</h3>

      <p>No, as long as you only block AI bots and let Googlebot access your site normally. The two crawl systems are independent. <code>Google-Extended</code> is separate from <code>Googlebot</code> — you can block one without affecting the other.</p>

      <h3>Should I allow Common Crawl?</h3>

      <p>Common Crawl is the dataset on which many open-source LLMs are trained. Allowing it increases your chances of being in the training data of future models. If you don't have a specific reason to block it (sensitive content, paywall), allow it.</p>

      <h3>What happens if I block AI bots after being indexed?</h3>

      <p>Information already in LLM training data stays — you can't "erase" from the training corpus. However, for real-time AI search systems (Perplexity, SearchGPT), blocking the bot will prevent future citations.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">See all GEO criteria and their impact on your score →</ArrowLink>
    </>
  );
}
