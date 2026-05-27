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
        Test my website for free →
      </a>
    </div>
  );
}

export default function SitesBloquentBotsIA() {
  return (
    <>
      <p><strong>73% of websites block AI bots</strong> — GPTBot, ClaudeBot, PerplexityBot — without their owners knowing (Otterly.AI, 2026). In practice, this means ChatGPT, Claude, and Perplexity simply cannot read the content on these sites. And content that cannot be read will never be cited.</p>

      <p>Most of the time, the blocking is not intentional. It comes from a misconfigured <code>robots.txt</code> file, a CMS that blocks bots by default, or a site entirely rendered in client-side JavaScript. The result is the same: you are invisible to AI engines, even if your content is excellent.</p>

      <p>Here is how to check if you are affected, why this is a critical problem in 2026, and how to fix it in under 10 minutes.</p>

      <h2>Why AI bots are blocked by default</h2>

      <p>Historically, the <code>robots.txt</code> file was used to control access for Google and Bing crawlers. When AI bots appeared (GPTBot in August 2023, ClaudeBot, PerplexityBot), many websites and CMS platforms reacted by blocking them as a precaution.</p>

      <p>The problem: this decision was often made at the CMS or hosting level, not by the site owner. If you use WordPress with certain security plugins, Wix, Squarespace, or a CDN like Cloudflare with aggressive anti-bot rules, there is a strong chance AI bots are already blocked on your site.</p>

      <p>The three main causes:</p>

      <ul>
        <li><strong>Explicit robots.txt</strong>: lines like <code>User-agent: GPTBot / Disallow: /</code> deny access to your entire site. This is the most common case and the simplest to fix.</li>
        <li><strong>Security plugins</strong>: some WordPress plugins (Wordfence, Sucuri, iThemes Security) or Cloudflare rules block unrecognized user-agents, including AI bots.</li>
        <li><strong>Client-side JavaScript rendering</strong>: if your site is a Single Page Application (React, Angular, Vue) without Server-Side Rendering (SSR), AI bots see nothing but a blank page. Technically, the bot is not blocked, but it cannot read anything.</li>
      </ul>

      <h2>How to check if your site blocks AI bots</h2>

      <p>This is quick to verify. Here are the 3 steps:</p>

      <h3>Step 1: Check your robots.txt</h3>

      <p>Type <code>your-website.com/robots.txt</code> in your browser. Look for mentions of these user-agents:</p>

      <ul>
        <li><code>GPTBot</code> — the ChatGPT/OpenAI crawler</li>
        <li><code>OAI-SearchBot</code> — OpenAI's web search crawler</li>
        <li><code>ClaudeBot</code> — Anthropic's (Claude) crawler</li>
        <li><code>PerplexityBot</code> — Perplexity's crawler</li>
        <li><code>Google-Extended</code> — Google's AI crawler (distinct from Googlebot)</li>
        <li><code>Bytespider</code> — ByteDance's crawler (used by Chinese models)</li>
      </ul>

      <p>If you see <code>Disallow: /</code> next to any of these agents, your site is inaccessible to them.</p>

      <h3>Step 2: Test your site's rendering</h3>

      <p>Open your site in Chrome, right-click, and select "View Page Source" (not the inspector — the raw source code). If you see readable content (text, paragraphs, headings), you are good. If you see mostly JavaScript and empty <code>&lt;div id="root"&gt;&lt;/div&gt;</code> tags, your content is not accessible to bots.</p>

      <h3>Step 3: Run an automated audit</h3>

      <p>Detekia automatically checks your site's crawlability by AI bots. The "AI Accessibility" criterion in our GEO score detects <code>robots.txt</code> blocks, the absence of an <code>llms.txt</code> file, indexation issues, and whether AI bots are present in your configuration.</p>

      <InlineCTA href="/">Check if AI bots can access your website — free, under 60 seconds.</InlineCTA>

      <h2>The 6 AI bots you need to know</h2>

      <p>Not all AI engines use the same crawler. Here are the main ones and their impact:</p>

      <ul>
        <li><strong>GPTBot (OpenAI)</strong> — powers ChatGPT and its web-search-enabled responses. This is the most important one: ChatGPT processes 2.5 billion queries per day. Blocking it makes you invisible to 810 million daily users.</li>
        <li><strong>OAI-SearchBot (OpenAI)</strong> — the crawler specific to ChatGPT's web search feature. Distinct from GPTBot, it is sometimes blocked separately.</li>
        <li><strong>ClaudeBot (Anthropic)</strong> — the crawler for Claude. Claude is used by millions of professionals and its API powers numerous B2B applications.</li>
        <li><strong>PerplexityBot</strong> — Perplexity's crawler. Perplexity is the AI search engine that systematically cites its sources with links. Being indexed by Perplexity generates direct traffic.</li>
        <li><strong>Google-Extended</strong> — controls the use of your content by Gemini and Google AI Overviews. Important: blocking Google-Extended does NOT block Googlebot (your standard SEO remains unaffected).</li>
        <li><strong>Applebot-Extended</strong> — used by Apple Intelligence and Siri. Relevant if your audience is on the Apple ecosystem.</li>
      </ul>

      <h2>What you lose by blocking AI bots</h2>

      <p>Blocking AI bots is not a neutral decision. Here is what it costs you in concrete terms:</p>

      <p><strong>Zero citations in AI responses.</strong> When a prospect asks ChatGPT "what is the best tool for [your domain]," your site cannot be cited if GPTBot cannot read it. Your competitors who allow access will be recommended instead.</p>

      <p><strong>Absent from Google AI Overviews.</strong> Google uses Google-Extended to power its AI summaries. If you block it, you can still appear in classic results, but never in the AI summary at the top of the page — the one that <strong>83% of users read before clicking</strong>.</p>

      <p><strong>Lost AI-referred traffic.</strong> AI-referred traffic surged by <strong>527%</strong> in 2025 (Previsible). Visitors from an AI recommendation convert <strong>4.4x better</strong> than standard organic visitors (Semrush, 2025). That is qualified traffic you are handing to your competitors.</p>

      <p><strong>Growing invisibility.</strong> Gartner forecasts a <strong>25% decline in traditional search volume</strong> by the end of 2026. The share of traffic migrating to AI will only increase. The longer you wait to unblock access, the wider the gap becomes.</p>

      <ArrowLink href="/blog/pourquoi-trafic-google-baisse-2026">Why your Google traffic is dropping in 2026 (and what AI has to do with it)</ArrowLink>

      <h2>How to unblock access in 10 minutes</h2>

      <h3>1. Edit your robots.txt</h3>

      <p>If your <code>robots.txt</code> contains blocking directives, replace them. Here is an example configuration that allows all AI bots:</p>

      <pre><code>{`# Allow AI bots
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

User-agent: Applebot-Extended
Allow: /`}</code></pre>

      <p>If you want to block certain sensitive pages (client area, admin pages) while allowing the rest:</p>

      <pre><code>{`User-agent: GPTBot
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /api/`}</code></pre>

      <h3>2. Create an llms.txt file</h3>

      <p>The <code>llms.txt</code> file is an emerging standard that tells AI engines how to interpret your site. Place it at the root (<code>your-website.com/llms.txt</code>):</p>

      <pre><code>{`# My Company
> Short description of what your company does.

## Main pages
- [Home](https://your-website.com/)
- [Product](https://your-website.com/product)
- [Blog](https://your-website.com/blog)
- [About](https://your-website.com/about)
- [Contact](https://your-website.com/contact)

## What we do
Clear, factual description of your business,
your services, and your value proposition.`}</code></pre>

      <p>This file helps AI engines understand your site's structure and identify the most important pages. It is the equivalent of a sitemap for AI engines.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Complete guide: llms.txt, robots.txt, and AI Accessibility</ArrowLink>

      <h3>3. Check security plugins and rules</h3>

      <p>If you use WordPress:</p>

      <ul>
        <li><strong>Wordfence</strong>: go to Firewall → Rate Limiting. Verify that AI user-agents are not on the block list.</li>
        <li><strong>Sucuri</strong>: in the dashboard, check the bot blocking rules.</li>
        <li><strong>Rank Math / Yoast</strong>: these plugins do not block AI bots by default, but check the robots.txt they generate automatically.</li>
      </ul>

      <p>If you use Cloudflare:</p>

      <ul>
        <li>Go to Security → WAF → Custom Rules.</li>
        <li>Verify that no rule blocks the GPTBot, ClaudeBot, or PerplexityBot user-agents.</li>
        <li>In Security → Bots, make sure "Bot Fight Mode" is not too aggressive — it can block legitimate AI crawlers.</li>
      </ul>

      <h3>4. Fix JavaScript rendering issues</h3>

      <p>If your site is a SPA (Single Page Application):</p>

      <ul>
        <li><strong>Ideal solution</strong>: switch to Server-Side Rendering (SSR) with Next.js, Nuxt.js, or similar. Content is rendered server-side and immediately readable by bots.</li>
        <li><strong>Intermediate solution</strong>: use a pre-rendering service (Prerender.io, Rendertron) that serves a static HTML version to bots.</li>
        <li><strong>Verification</strong>: test your site with <code>curl -s your-website.com | head -50</code>. If you see text content, you are good. If it is pure JavaScript, bots see nothing.</li>
      </ul>

      <h2>Special case: should you allow ALL bots?</h2>

      <p>This is a fair question. Some sites choose to block specific bots for strategic reasons (protecting exclusive content, sensitive data, etc.).</p>

      <p>Our recommendation:</p>

      <ul>
        <li><strong>Allow GPTBot, ClaudeBot, PerplexityBot, and Google-Extended</strong> unless you have a documented reason not to. These 4 bots cover 95% of AI traffic.</li>
        <li><strong>Selectively block</strong> sensitive pages (admin, client area, API) rather than the entire site.</li>
        <li><strong>Review your decision quarterly.</strong> The AI ecosystem evolves fast. New bots appear, others become dominant.</li>
      </ul>

      <p>Blanket blocking no longer protects your content — AI engines can find your information through other sources (caches, aggregators, third-party mentions). What it does guarantee is that you will never be cited as a source, which is the worst-case scenario.</p>

      <h2>Check your crawlability now</h2>

      <p>AI Accessibility is one of the 7 criteria in the Detekia GEO score. It is also the simplest criterion to fix: a 2-line change in your <code>robots.txt</code> may be all it takes to unlock your AI visibility.</p>

      <p>Detekia automatically analyzes your <code>robots.txt</code> file, detects the presence or absence of an <code>llms.txt</code>, and verifies whether your content is accessible to AI crawlers. The diagnostic is free and takes under 60 seconds.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">The 8 GEO criteria that determine if AI cites you — Detekia methodology</ArrowLink>

      <h2>Frequently asked questions</h2>

      <h3>Does unblocking AI bots pose a security risk?</h3>

      <p>No. AI bots read the public content on your site, exactly as Googlebot has done for 20 years. They do not access your databases, your admin panel, or protected data — as long as your <code>robots.txt</code> denies access to sensitive directories (<code>/admin/</code>, <code>/api/</code>, etc.).</p>

      <h3>Will my content be used to train AI models?</h3>

      <p>This is a separate question. GPTBot is used for both real-time web search (RAG) and potentially for training. If you want to allow web search but not training, you can allow <code>OAI-SearchBot</code> while blocking <code>GPTBot</code>. For Google, <code>Google-Extended</code> controls only AI usage — blocking it does not affect your standard SEO.</p>

      <h3>How long before AI engines start citing me?</h3>

      <p>After unblocking access, AI bots recrawl your site within a few days to a few weeks. The first citation results typically appear in 4 to 8 weeks, depending on your content quality and sector competitiveness. Crawlability is a necessary condition, not a sufficient one — your content also needs to be extractable, sourced, and structured.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO: the complete guide to being cited by AI engines in 2026</ArrowLink>

      <h2>Key takeaways</h2>

      <p>73% of sites block AI bots without knowing it. If that includes you, no other GEO optimization will work until the block is lifted. It is the first thing to check, and often the simplest to fix.</p>

      <p>Check your <code>robots.txt</code>, create an <code>llms.txt</code> file, disable overly aggressive security rules, and make sure your content is server-side rendered. In 10 minutes, you go from invisible to indexable by every AI engine.</p>

      <InlineCTA href="/">Is your site blocking AI bots? Check for free in under 60 seconds.</InlineCTA>
    </>
  );
}
