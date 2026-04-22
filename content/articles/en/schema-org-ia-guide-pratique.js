import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

function ChecklistSection({ title, items }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: 'system-ui', fontSize: 14, color: '#3A3835', lineHeight: 1.5 }}>
            <span style={{ color: '#10A37F', flexShrink: 0, marginTop: 1 }}>☐</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SchemaOrgIaGuidePratique() {
  return (
    <>
      <p>Schema.org structured data is no longer just about earning rich snippets on Google. In 2026, it has become a direct lever for visibility with generative AI engines. When ChatGPT, Gemini, or Perplexity analyze your site, JSON-LD markup lets them understand without ambiguity who you are, what you offer, and why your content is trustworthy.</p>

      <p>A site without structured data forces the AI to guess. A site with complete markup gives it certainty. And AI engines cite the sources they understand first.</p>

      <p>This guide shows you exactly which schemas to implement, in what order, with ready-to-copy code examples.</p>

      <h2>Why Schema.org matters for GEO</h2>

      <p>AI engines work differently from Google. When Googlebot crawls your page, it interprets HTML, meta tags, and popularity signals to rank your page. When an AI crawler (GPTBot, ClaudeBot, PerplexityBot) analyzes your page, it looks to understand <strong>entities</strong>: who is speaking, about what, with what authority, and when.</p>

      <p>Structured data answers exactly these questions, in a format machines read without interpretation.</p>

      <p>Specifically, Schema.org impacts 3 of the 8 Detekia GEO Score criteria:</p>

      <ul>
        <li><strong>Structured data (10 points)</strong> — direct, measurable impact</li>
        <li><strong>Authority & E-E-A-T (15 points)</strong> — the <code>Organization</code> schema and author information strengthen credibility signals</li>
        <li><strong>Extractability (25 points)</strong> — the <code>FAQPage</code> schema structures your content in a format natively extractable by AI engines</li>
      </ul>

      <p>That is a potential impact on <strong>50 out of 100 points</strong> of your GEO Score.</p>

      <h2>The 5 priority schemas for GEO</h2>

      <p>You do not need to implement all 806 Schema.org types. For GEO, 5 schemas cover 90% of the impact. Here they are, in priority order.</p>

      <h3>1. Organization — your identity</h3>

      <p>This is the most fundamental schema. It tells AI engines: "This is who we are." Without it, generative engines have no certainty about your business identity.</p>

      <p><strong>Where to implement:</strong> on your homepage, in the <code>&lt;head&gt;</code> or before the closing <code>&lt;/body&gt;</code>.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://www.your-website.com",
  "logo": "https://www.your-website.com/logo.png",
  "description": "Concise description of your business in 1-2 sentences.",
  "foundingDate": "2020",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "postalCode": "10001",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact@your-website.com",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://www.linkedin.com/company/your-company",
    "https://twitter.com/your-company"
  ]
}`}</code></pre>

      <p><strong>Key points for GEO:</strong></p>

      <ul>
        <li>The <code>sameAs</code> property is crucial: it lets AI engines connect your site to your LinkedIn, Twitter, Wikipedia, and Crunchbase profiles. The more consistent these links are, the stronger your entity identity.</li>
        <li>The <code>description</code> should be factual and concise — it is often what AI will extract first to introduce you.</li>
        <li>The <code>logo</code> as an absolute URL lets AI engines visually verify your identity.</li>
      </ul>

      <h3>2. FAQPage — your questions and answers</h3>

      <p>This is the most impactful schema for GEO. AI engines operate on a question-and-answer basis: a user asks a question, the AI looks for the best answer. The <code>FAQPage</code> schema structures your content in exactly that format.</p>

      <p><strong>Where to implement:</strong> on any page containing Q&A — dedicated FAQ page, bottom of product pages, help sections.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How can I improve my site's visibility in ChatGPT?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To be cited by ChatGPT, optimize your content's extractability (direct answers in the first 100 words), add Schema.org structured data, verify your robots.txt does not block GPTBot, and source your claims with verifiable data."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to appear in AI answers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Technical optimizations (robots.txt, Schema.org) take effect in 2 to 4 weeks. Content improvements are reflected in 4 to 8 weeks. Building external authority takes 2 to 3 months."
      }
    }
  ]
}`}</code></pre>

      <p><strong>Key points for GEO:</strong></p>

      <ul>
        <li>Each answer must be <strong>self-contained</strong>: understandable without additional context. AI engines often extract the answer alone, without the question.</li>
        <li>Questions should be phrased in natural language, the way a user would ask ChatGPT. No jargon, no corporate phrasing.</li>
        <li>Limit yourself to 5-10 questions per page. Beyond that, informational density drops and Google may ignore the markup.</li>
        <li>Each answer should contain verifiable facts (numbers, timeframes, steps) — not vague responses.</li>
      </ul>

      <h3>3. Article / BlogPosting — your editorial content</h3>

      <p>This schema identifies your articles as structured editorial content, with an author, a date, and editorial context. For AI engines, this is a strong credibility signal — especially when the author is identifiable and expert.</p>

      <p><strong>Where to implement:</strong> on every blog post, guide, case study, or editorial content page.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "GEO: the complete guide to getting cited by AI in 2026",
  "description": "GEO definition, 8 citation-worthiness criteria, 7 concrete actions to optimize your site.",
  "author": {
    "@type": "Person",
    "name": "John Smith",
    "url": "https://www.linkedin.com/in/johnsmith",
    "jobTitle": "Founder",
    "worksFor": {
      "@type": "Organization",
      "name": "Your Company"
    }
  },
  "publisher": {
    "@type": "Organization",
    "name": "Detekia",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.detekia.com/logo.png"
    }
  },
  "datePublished": "2026-03-27",
  "dateModified": "2026-03-27",
  "image": "https://www.detekia.com/images/geo-guide-og.jpg",
  "mainEntityOfPage": "https://www.detekia.com/blog/geo-guide-complet-2026"
}`}</code></pre>

      <p><strong>Key points for GEO:</strong></p>

      <ul>
        <li>The <code>author</code> object with a <code>url</code> pointing to LinkedIn or a bio page is essential. AI engines cross-reference author information to evaluate expertise (E-E-A-T).</li>
        <li><code>dateModified</code> is as important as <code>datePublished</code>. AI engines check content freshness — a recent modification date is a positive signal.</li>
        <li>The <code>description</code> should summarize the content in a factual, extractable way.</li>
      </ul>

      <h3>4. WebSite + SearchAction — your site as an entity</h3>

      <p>This schema helps AI engines understand your site as a whole, not just page by page. It is also used by Google to display the sitelinks search box.</p>

      <p><strong>Where to implement:</strong> on the homepage only.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Detekia",
  "url": "https://www.detekia.com",
  "description": "GEO audit to measure your site's visibility in AI answers.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.detekia.com/results?url={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`}</code></pre>

      <h3>5. BreadcrumbList — your architecture</h3>

      <p>Breadcrumb markup helps AI engines understand your site's hierarchy: which page is the parent of which, how content is organized. It is a structural signal that reinforces crawlability.</p>

      <p><strong>Where to implement:</strong> on all internal pages.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.detekia.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://www.detekia.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "GEO: the complete 2026 guide",
      "item": "https://www.detekia.com/blog/geo-guide-complet-2026"
    }
  ]
}`}</code></pre>

      <h2>Secondary schemas by activity type</h2>

      <p>Beyond the 5 priority schemas, certain specific markups strengthen your visibility depending on your business type.</p>

      <h3>E-commerce</h3>

      <ul>
        <li><code>Product</code> — name, price, availability, reviews. AI engines use these for product comparisons.</li>
        <li><code>AggregateRating</code> — average rating and number of reviews. Strong trust signal.</li>
        <li><code>Offer</code> — price, currency, conditions. Lets AI engines cite precise pricing.</li>
      </ul>

      <ArrowLink href="/blog/ecommerce-recommandations-ia">For a complete approach, read E-commerce: how to appear in AI product recommendations.</ArrowLink>

      <h3>Services and professional firms</h3>

      <ul>
        <li><code>LocalBusiness</code> — address, hours, geographic area. Essential for local queries ("best [profession] in [city]").</li>
        <li><code>Service</code> — description of your offerings with pricing and coverage area.</li>
      </ul>

      <h3>SaaS and tech</h3>

      <ul>
        <li><code>SoftwareApplication</code> — name, operating system, category, price. AI engines cite this info in software comparisons.</li>
        <li><code>HowTo</code> — steps for using your tool. A format that is highly extractable by AI engines.</li>
      </ul>

      <h2>Technical implementation</h2>

      <h3>The format: JSON-LD only</h3>

      <p>There are three formats for structured data: JSON-LD, Microdata, and RDFa. In 2026, the choice is clear: use <strong>JSON-LD in 100% of cases</strong>.</p>

      <p>Why:</p>

      <ul>
        <li>Google officially recommends it</li>
        <li>It is added as a <code>&lt;script&gt;</code> block without touching the visible HTML</li>
        <li>It is easier to maintain and debug</li>
        <li>AI crawlers parse it natively</li>
      </ul>

      <h3>Where to place the code</h3>

      <p>The JSON-LD block goes in the <code>&lt;head&gt;</code> of your page or just before <code>&lt;/body&gt;</code>. Both work. The most common convention is in the <code>&lt;head&gt;</code>.</p>

      <pre><code>{`<head>
  <!-- ... your meta tags ... -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Your Company"
  }
  </script>
</head>`}</code></pre>

      <h3>Multiple schemas on a single page</h3>

      <p>You can (and often should) have multiple JSON-LD blocks on a single page. For example, your homepage can contain an <code>Organization</code> schema, a <code>WebSite</code> schema, and an <code>FAQPage</code> schema. Each schema gets its own <code>&lt;script type="application/ld+json"&gt;</code> block.</p>

      <h3>Next.js implementation</h3>

      <p>If your site is built with Next.js, use the <code>Head</code> component:</p>

      <pre><code>{`import Head from 'next/head';

export default function HomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Your Company",
    "url": "https://www.your-website.com"
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      {/* ... your content ... */}
    </>
  );
}`}</code></pre>

      <h3>WordPress implementation</h3>

      <p>Two options:</p>

      <ul>
        <li><strong>Plugin</strong> — Yoast SEO and Rank Math automatically add certain schemas (Organization, Article, BreadcrumbList). Check the settings and complete manually if needed (<code>FAQPage</code> is not always automatic).</li>
        <li><strong>Manual</strong> — paste the JSON-LD block in your page's HTML editor, or use a plugin like "Insert Headers and Footers" to add it globally.</li>
      </ul>

      <h2>Testing and validation</h2>

      <p>Before publishing, always test your markup.</p>

      <h3>Testing tools</h3>

      <ul>
        <li><strong>Google Rich Results Test</strong> (<code>search.google.com/test/rich-results</code>) — verifies if your markup is valid and eligible for rich results. This is the reference tool.</li>
        <li><strong>Schema Markup Validator</strong> (<code>validator.schema.org</code>) — validates your markup syntax against the complete Schema.org vocabulary. Stricter than the Google test.</li>
        <li><strong>Your Detekia score</strong> — run an audit before and after implementation to measure the impact on your structured data score.</li>
      </ul>

      <h3>Common errors to avoid</h3>

      <ul>
        <li><strong>Invisible markup</strong> — the content described in the schema must be visible on the page. A <code>FAQPage</code> schema whose questions are not visually displayed violates Google guidelines and may be ignored.</li>
        <li><strong>Inconsistent information</strong> — the company name in the <code>Organization</code> schema must match exactly what is displayed on your site, your Google Business Profile, and your social media. Any inconsistency weakens AI trust.</li>
        <li><strong>Missing or false dates</strong> — <code>datePublished</code> and <code>dateModified</code> must reflect reality. Do not set today's date as <code>dateModified</code> if you have not actually modified the content.</li>
        <li><strong>Minimal schema</strong> — an <code>Organization</code> schema with only the name is nearly useless. Fill in all relevant properties: logo, address, contact, <code>sameAs</code>.</li>
        <li><strong>Forgetting to test after deployment</strong> — a template change, plugin update, or migration can silently break your markup.</li>
      </ul>

      <h2>Implementation checklist</h2>

      <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 12, padding: '28px 28px 20px', margin: '24px 0' }}>
        <ChecklistSection
          title="Phase 1 — The fundamentals (day 1)"
          items={[
            'Organization schema on homepage with name, URL, logo, description, address, contact, sameAs',
            'WebSite schema on homepage with SearchAction',
            'Test with Rich Results Test',
          ]}
        />
        <ChecklistSection
          title="Phase 2 — The content (day 2-3)"
          items={[
            'Article or BlogPosting schema on each editorial content piece with complete author, dates, description',
            'BreadcrumbList schema on all internal pages',
            'FAQPage schema on pages containing Q&A',
            'Test each modified page',
          ]}
        />
        <ChecklistSection
          title="Phase 3 — Activity-specific (week 2)"
          items={[
            'Activity-specific schemas (Product, LocalBusiness, SoftwareApplication, etc.)',
            'Consistency check: does the information in schemas match what is displayed?',
            'Detekia audit to measure impact on score',
          ]}
        />
        <ChecklistSection
          title="Ongoing phase"
          items={[
            'Verify markup after every site update',
            'Add FAQPage on every new page containing Q&A',
            'Update dateModified with every real content modification',
          ]}
        />
      </div>

      <h2>Frequently asked questions</h2>

      <h3>Is structured data enough to be cited by AI?</h3>

      <p>No. It represents one of the 8 GEO Score criteria (10 direct points + indirect impact on authority and extractability). But without quality content, without crawlability, and without external presence, markup alone is not enough. It is an accelerator, not a substitute.</p>

      <h3>How long before seeing the impact?</h3>

      <p>Effects on Google rich snippets appear within a few days to 2 weeks. Impact on AI citations takes 2 to 4 weeks, the time for AI crawlers to re-analyze your site.</p>

      <h3>Can I use an automatic schema generator?</h3>

      <p>Yes, to get started. Tools like Google's Structured Data Markup Helper or the built-in features of Yoast/Rank Math work well for basic schemas. But for GEO-optimized markup (complete <code>sameAs</code>, detailed author, well-structured <code>FAQPage</code>), manual customization is often necessary.</p>

      <h3>Can too many schemas hurt?</h3>

      <p>No, as long as each schema is valid and describes content that is actually present on the page. Google and AI engines have no limit on the number of schemas per page. The only rule: only mark up what is visible and truthful.</p>

      <h2>Measure the impact</h2>

      <p>You have implemented your schemas? Measure the impact right away.</p>

      <p>Run a GEO audit on Detekia — your structured data score will go from 0-3 to 7-10 if the implementation is correct. In under 60 seconds, no signup required.</p>
    </>
  );
}
