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
        Analyze my site for free →
      </a>
    </div>
  );
}

export default function WordpressGeoPluginsOptimisationsEN() {
  return (
    <>
      <p>WordPress powers over 40% of the web. If you use WordPress, you have an advantage: a plugin ecosystem that lets you implement most GEO optimizations without writing a single line of code. But you need to know which plugins to use and how to configure them for AI visibility.</p>

      <p>Traditional SEO plugins (Yoast, Rank Math) are no longer enough. They optimize for Google Search, not for ChatGPT, Perplexity, or Gemini. The challenge in 2026 is to go beyond traditional SEO and make your WordPress content <InternalLink href="/blog/comment-chatgpt-choisit-ses-sources">citable by AI engines</InternalLink>.</p>

      <h2>Why WordPress has a natural GEO advantage</h2>

      <p>WordPress isn't just popular. It has structural characteristics that facilitate AI visibility:</p>

      <ul>
        <li><strong>Clean, semantic HTML.</strong> WordPress content is standard HTML, directly readable by AI crawlers. Unlike SPAs (React, Angular), content isn't hidden behind JavaScript.</li>
        <li><strong>Native heading structure.</strong> The Gutenberg editor generates clean H1-H6 tags. AI engines rely heavily on heading hierarchy to understand content structure.</li>
        <li><strong>Automatic sitemap.</strong> Since WordPress 5.5, an XML sitemap is generated natively. AI crawlers use it to discover your pages.</li>
        <li><strong>Plugin ecosystem.</strong> Thousands of plugins allow you to add structured data, optimize robots.txt, manage FAQs, and more — without coding.</li>
      </ul>

      <p>But these advantages only materialize if you exploit them correctly. A default WordPress installation, without configuration, is not optimized for AI.</p>

      <h2>Essential plugins for GEO on WordPress</h2>

      <h3>1. Yoast SEO or Rank Math: the foundation (but not enough)</h3>

      <p>Both plugins handle the fundamentals: meta titles, meta descriptions, XML sitemap, robots.txt. They also add basic schema (Article, Organization). Necessary but far from sufficient for GEO.</p>

      <p>What to configure specifically for AI:</p>

      <ul>
        <li><strong>Complete Organization schema.</strong> In Yoast (SEO → Search Appearance → Organization) or Rank Math (Schema Markup), fill in all fields: name, logo, address, social networks, founding date. Every filled field is a trust signal for AI engines.</li>
        <li><strong>Author/Person schema.</strong> Enable author archives and configure author profiles with bio, photo, social links. Rank Math allows adding the Person schema directly on author pages.</li>
        <li><strong>Polished meta description.</strong> AI engines often extract the meta description as a page summary. Write it as a standalone answer, not a marketing teaser.</li>
      </ul>

      <h3>2. Schema Pro or WP Schema: advanced structured data</h3>

      <p>Basic SEO plugins add Article and Organization, but the <InternalLink href="/blog/structured-data-avance-schemas-oublies">advanced schemas</InternalLink> that make the difference for AI (HowTo, FAQPage, Person, Review, SpeakableSpecification) require a dedicated plugin.</p>

      <p>Recommended plugins:</p>

      <ul>
        <li><strong>Schema Pro</strong> (premium, ~$79/year): visual interface for adding any schema type. Supports HowTo, FAQ, Review, LocalBusiness, Person, and more.</li>
        <li><strong>Rank Math Pro</strong>: includes an advanced schema generator in its premium version. Supports 20+ schema types directly in the editor.</li>
        <li><strong>Schema & Structured Data for WP</strong> (free): good compromise for basic schemas and FAQ. Less comprehensive than premium options but sufficient to get started.</li>
      </ul>

      <p>At minimum, implement: <code>FAQPage</code> on your FAQ pages, <code>HowTo</code> on your tutorials, <code>Person</code> on your author pages, and <code>Review</code>/<code>AggregateRating</code> if you have customer reviews.</p>

      <h3>3. Managing robots.txt and AI bot access</h3>

      <p>By default, WordPress allows all crawlers. But some themes or security plugins (Wordfence, Sucuri) can block AI bots without your knowledge. Check your <InternalLink href="/blog/sitemap-robots-txt-bots-ia-2026">robots.txt</InternalLink> to ensure GPTBot, ClaudeBot, PerplexityBot, and Google-Extended are not blocked.</p>

      <p>With Yoast or Rank Math, you can edit robots.txt directly from the WordPress dashboard (SEO → Tools → File Editor). Explicitly add:</p>

      <ul>
        <li><code>User-agent: GPTBot</code> followed by <code>Allow: /</code></li>
        <li><code>User-agent: ClaudeBot</code> followed by <code>Allow: /</code></li>
        <li><code>User-agent: PerplexityBot</code> followed by <code>Allow: /</code></li>
      </ul>

      <h3>4. FAQ and citable content: FAQ block plugins</h3>

      <p>FAQs are the most directly citable format for AI engines. On WordPress, several plugins create FAQ blocks with automatic FAQPage schema:</p>

      <ul>
        <li><strong>Yoast FAQ Block</strong> (included in free Yoast): adds an FAQ block in Gutenberg with automatically generated FAQPage schema</li>
        <li><strong>Rank Math FAQ Block</strong>: same principle, included in free Rank Math</li>
        <li><strong>Ultimate FAQ</strong>: dedicated plugin with categories, search, and built-in schema</li>
      </ul>

      <p>What matters is not the plugin but the content: write clear, standalone 2-3 sentence answers. The first sentence should be extractable and directly citable by an AI.</p>

      <h3>5. Performance and accessibility: WP Rocket, Autoptimize</h3>

      <p>AI engines don't directly rank sites by speed, but a slow site has two problems: AI crawlers may fail to load content (timeout), and a slow site often means poor technical structure.</p>

      <ul>
        <li><strong>WP Rocket</strong> (premium): caching, minification, lazy loading. The most comprehensive and simplest option.</li>
        <li><strong>Autoptimize</strong> (free): CSS/JS optimization, good free alternative</li>
        <li><strong>ShortPixel or Imagify</strong>: image compression. Multimodal AI engines analyze your images — they need to load correctly.</li>
      </ul>

      <InlineCTA href="/pricing">Test the AI visibility of your WordPress site</InlineCTA>

      <h2>WordPress-specific GEO optimizations</h2>

      <h3>Structuring content for citability</h3>

      <p>Beyond plugins, how you write and structure your WordPress articles has a direct impact on <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">AI citability</InternalLink>.</p>

      <ul>
        <li><strong>One H2 per question, answer in the first paragraph.</strong> AI engines extract content right after H2/H3 headings. If the first sentence after your heading is a direct answer, it will be cited.</li>
        <li><strong>Short paragraphs (3-5 sentences).</strong> AI engines prefer modular text blocks they can extract individually.</li>
        <li><strong>Sourced data points.</strong> "The French e-commerce market reached 159.9 billion euros in 2023 (Fevad)" is far more citable than "E-commerce is growing fast."</li>
        <li><strong>Bullet lists for comparisons and steps.</strong> AI engines love structured lists — they often extract them as-is in their responses.</li>
      </ul>

      <h3>Enriched author pages</h3>

      <p>WordPress generates author pages by default (/author/your-name/), but they're often empty or disabled. For <InternalLink href="/blog/eeat-ia-experience-expertise">E-E-A-T authority</InternalLink>, these pages need to be complete:</p>

      <ul>
        <li>150-300 word bio with background, expertise, and credentials</li>
        <li>Professional photo</li>
        <li>Links to LinkedIn, Twitter, and other profiles</li>
        <li>Person schema with <code>knowsAbout</code>, <code>jobTitle</code>, <code>worksFor</code></li>
        <li>List of published articles (WordPress does this natively)</li>
      </ul>

      <h3>Visible update dates</h3>

      <p>Freshness is a key criterion for AI engines. By default, WordPress displays the publication date but not the modification date. Add the last modified date visibly on your articles:</p>

      <ul>
        <li><strong>Rank Math</strong> includes an option to display "Updated on..." automatically</li>
        <li><strong>WP Last Modified Info</strong> (free plugin): adds the modification date on all posts</li>
        <li>The Article schema with <code>dateModified</code> is handled automatically by Yoast and Rank Math</li>
      </ul>

      <h2>Common WordPress mistakes that hurt GEO</h2>

      <ul>
        <li><strong>Too many plugins.</strong> 30+ active plugins slow the site and can generate schema conflicts (two plugins each injecting a different Organization schema). Keep only necessary plugins.</li>
        <li><strong>JavaScript-heavy themes.</strong> Some premium themes (Elementor, Divi) generate HTML wrapped in JavaScript. AI crawlers may struggle to read the content. Test your site with JavaScript disabled to verify.</li>
        <li><strong>Overly aggressive bot blockers.</strong> Wordfence and security plugins can block AI bots. Check your firewall rules and add exceptions for GPTBot, ClaudeBot, and PerplexityBot.</li>
        <li><strong>Duplicate content from categories and tags.</strong> WordPress generates archive pages for every category and tag. If poorly configured, they create duplicate content. Configure Yoast/Rank Math to noindex tag archives.</li>
        <li><strong>Disabled author pages.</strong> Many SEO guides recommend disabling author pages. For GEO, this is a mistake: AI engines use these pages to verify author credentials.</li>
      </ul>

      <h2>GEO checklist for WordPress</h2>

      <ol>
        <li>Install and configure Yoast or Rank Math (complete Organization schema, author profiles)</li>
        <li>Check robots.txt (GPTBot, ClaudeBot, PerplexityBot allowed)</li>
        <li>Add FAQPage schema on pages with questions/answers</li>
        <li>Implement advanced schemas (HowTo, Person, Review) via Schema Pro or Rank Math Pro</li>
        <li>Enrich author pages (bio, photo, links, Person schema)</li>
        <li>Display modification dates on all articles</li>
        <li>Optimize performance (caching, image compression, minification)</li>
        <li>Structure articles: H2 = question, first paragraph = direct answer</li>
        <li>Verify no security plugin blocks AI bots</li>
        <li>Audit schemas with Google Rich Results Test to detect conflicts</li>
      </ol>

      <h2>Conclusion</h2>

      <p>WordPress is an excellent foundation for GEO. Its clean HTML, plugin ecosystem, and native content structure make it naturally compatible with AI engine expectations. But the potential only materializes if you go beyond the default configuration: advanced schemas, AI bot access, content structured for citability, and complete author pages.</p>

      <p>Plugins simplify the work, but it's the quality and structure of your content that make the difference. A well-written article with a well-structured FAQ on a properly configured WordPress has every chance of being cited by ChatGPT, Gemini, and Perplexity.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org and AI: the complete practical guide</ArrowLink>

      <ArrowLink href="/blog/geo-guide-complet-2026">The complete GEO guide for 2026</ArrowLink>
    </>
  );
}
