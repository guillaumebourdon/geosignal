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

export default function RefonteSiteGeoVisibiliteIAEN() {
  return (
    <>
      <p>You're planning a website redesign. New design, new site architecture, maybe a CMS change. On the SEO side, you've planned your 301 redirects. But have you thought about your AI visibility?</p>

      <p>A poorly prepared redesign can make your site disappear from ChatGPT, Perplexity, and Gemini responses for weeks, even months. And unlike traditional SEO where rankings recover gradually, AI visibility can collapse abruptly if the trust signals AI engines had built up on your old site disappear.</p>

      <h2>Why a redesign is risky for AI visibility</h2>

      <h3>AI engines don't work like Google</h3>

      <p>Google recrawls your site regularly and updates its index. If you redesign with proper redirects, Google follows them and transfers SEO equity within weeks.</p>

      <p>AI engines work differently:</p>

      <ul>
        <li><strong>LLMs have a frozen memory.</strong> Base models (GPT-4, Claude, Gemini) were trained on data at a specific date. If your old site was in the training data, your new site isn't there yet.</li>
        <li><strong>RAG recrawls, but more slowly.</strong> RAG systems (Retrieval-Augmented Generation) use a search engine (Bing for ChatGPT, Google for Gemini) to enrich responses with fresh data. If your URLs change, RAG must rediscover your content.</li>
        <li><strong>JSON-LD schemas are trust anchors.</strong> If your old site had Organization, Person, FAQPage schemas, and the new site doesn't (or has them differently), AI engines lose the trust signals they had accumulated.</li>
      </ul>

      <h3>What can break during a redesign</h3>

      <ul>
        <li><strong>URLs change</strong> — existing citations in AI responses point to 404s</li>
        <li><strong>JSON-LD schemas disappear</strong> — loss of E-E-A-T signals and data structure</li>
        <li><strong>Content is reorganized</strong> — FAQs, guides, and articles that AI engines cited are moved or merged</li>
        <li><strong>robots.txt changes</strong> — AI bots may get blocked without your knowledge</li>
        <li><strong>Author pages disappear</strong> — loss of <InternalLink href="/blog/eeat-ia-experience-expertise">E-E-A-T authority</InternalLink> tied to authors</li>
        <li><strong>Sitemap isn't updated</strong> — AI crawlers don't discover the new URLs</li>
      </ul>

      <h2>Before the redesign: the baseline audit</h2>

      <h3>Step 1: run a GEO audit on the old site</h3>

      <p>Before touching anything, measure your current AI visibility. This is your baseline — the reference score you'll compare the new site against after migration.</p>

      <p>Metrics to capture:</p>

      <ul>
        <li><strong>Overall GEO score</strong> and score per criterion (7 criteria)</li>
        <li><strong>AI citation test</strong>: on which queries is your site cited by ChatGPT, Perplexity, Gemini?</li>
        <li><strong>JSON-LD schema inventory</strong>: which schema types are present and on which pages?</li>
        <li><strong>Most-cited pages list</strong>: identify your pages that appear in AI responses (often FAQs, guides, detailed product pages)</li>
        <li><strong>robots.txt configuration</strong>: which AI bots currently have access?</li>
      </ul>

      <InlineCTA href="/pricing">Run your GEO audit before the redesign — your baseline score</InlineCTA>

      <h3>Step 2: map critical AI assets</h3>

      <p>Identify the pages and elements that contribute most to your AI visibility. These are the elements you must absolutely preserve or reproduce in the new site:</p>

      <ul>
        <li><strong>FAQ pages with FAQPage schema</strong>: often the most-cited pages by AI engines</li>
        <li><strong>Author pages with Person schema</strong>: carry E-E-A-T authority</li>
        <li><strong>Blog articles with structured data</strong>: guides, tutorials, comparisons</li>
        <li><strong>Organization schema</strong>: company information, founding date, social networks</li>
        <li><strong>Pages with answer capsules</strong>: short paragraphs that directly answer questions</li>
      </ul>

      <h2>During the redesign: non-negotiable rules</h2>

      <h3>1. Exhaustive 301 redirects</h3>

      <p>This is rule number 1 in SEO, and it's even more important in GEO. Every old URL that existed must redirect to the corresponding new URL. AI engines may have indexed your old URLs in their retrieval system — a 404 means a lost citation.</p>

      <p>Key points:</p>

      <ul>
        <li>Don't redirect everything to the homepage. Each page should redirect to its closest equivalent.</li>
        <li>Test redirects with a crawler (Screaming Frog) before launch</li>
        <li>Keep redirects active for at least 12 months</li>
      </ul>

      <h3>2. Reproduce all JSON-LD schemas</h3>

      <p>Before migrating, export the complete list of your <InternalLink href="/blog/schema-org-ia-guide-pratique">JSON-LD schemas</InternalLink>. After migration, verify that each schema is present on the equivalent page of the new site.</p>

      <p>Priority schemas to verify:</p>

      <ul>
        <li><code>Organization</code>: name, logo, address, social networks, founding date</li>
        <li><code>Person</code>: authors, experts, executives</li>
        <li><code>FAQPage</code>: all pages with questions/answers</li>
        <li><code>Article</code>: with <code>datePublished</code>, <code>dateModified</code>, <code>author</code></li>
        <li><code>LocalBusiness</code>: if you have a local presence</li>
        <li><code>HowTo</code>, <code>Review</code>, <code>ItemList</code>: depending on your content</li>
      </ul>

      <h3>3. Preserve robots.txt and sitemap</h3>

      <p>Verify that your new <InternalLink href="/blog/sitemap-robots-txt-bots-ia-2026">robots.txt</InternalLink> allows the same AI bots as the old one. This is a frequent oversight: the new CMS generates a default robots.txt that may block GPTBot, ClaudeBot, or PerplexityBot.</p>

      <p>The sitemap should be submitted to Google Search Console and Bing Webmaster Tools on launch day. AI crawlers use these sitemaps to discover your new URLs.</p>

      <h3>4. Preserve citable content</h3>

      <p>Don't delete pages that AI engines cite, even if they don't fit your new site architecture. If a 20-question FAQ was cited by ChatGPT, don't delete it — move it with a redirect and preserve the content.</p>

      <p>If you must merge pages, make sure the citable content (direct answers, data points, lists) is preserved in the merged page.</p>

      <h3>5. Maintain author pages</h3>

      <p>Author pages are often sacrificed in redesigns. This is a major mistake for GEO. If your authors had pages with Person schema, bio, credentials, and article lists, recreate them identically on the new site.</p>

      <h2>After the redesign: verification and monitoring</h2>

      <h3>Launch day checklist</h3>

      <ol>
        <li>Test all 301 redirects (zero 404s on old URLs)</li>
        <li>Verify robots.txt (AI bots allowed)</li>
        <li>Submit new sitemap to Google Search Console and Bing</li>
        <li>Validate all JSON-LD schemas with Google Rich Results Test</li>
        <li>Verify author pages are live and indexable</li>
        <li>Test site accessibility with JavaScript disabled (for basic crawlers)</li>
      </ol>

      <h3>Week 1: first check</h3>

      <ul>
        <li>Run a <InternalLink href="/blog/audit-geo-visibilite-ia">GEO audit</InternalLink> on the new site and compare with the baseline score</li>
        <li>Check Google Search Console to verify new pages are indexed</li>
        <li>Manually test 5-10 queries on ChatGPT and Perplexity to see if your site is still cited</li>
      </ul>

      <h3>Months 1-3: recovery monitoring</h3>

      <p>AI visibility can take 2-8 weeks to fully recover after a redesign, even with perfect redirects. This is normal: RAG systems need to recrawl your content and rebuild trust signals.</p>

      <p>Run a GEO audit every 2 weeks for the first 3 months to track recovery. If the score doesn't bounce back after 4 weeks, check:</p>

      <ul>
        <li>Are all schemas in place?</li>
        <li>Is robots.txt blocking any AI bot?</li>
        <li>Are all redirects working?</li>
        <li>Is the citable content still present and accessible?</li>
      </ul>

      <h2>Special case: CMS migration</h2>

      <p>A CMS change (WordPress to Webflow, Shopify to custom, etc.) is the riskiest scenario for AI visibility. The new CMS generates a different HTML structure, different URLs, and often different schemas.</p>

      <p>Additional rules for a CMS change:</p>

      <ul>
        <li><strong>Export raw content</strong> (text, images, meta) before migration. Don't rely on the new CMS's automatic import.</li>
        <li><strong>Check the HTML structure.</strong> Some CMS platforms (Wix, Squarespace) generate HTML wrapped in JavaScript. AI crawlers may not be able to read it.</li>
        <li><strong>Test schemas on the new CMS.</strong> Each CMS handles schemas differently. What worked on WordPress (via Yoast) won't be automatically reproduced on Webflow.</li>
        <li><strong>Beware of SPAs.</strong> If the new site is a Single Page Application (React, Vue, Angular), content may be invisible to AI crawlers. Use Server-Side Rendering (SSR) or Static Site Generation (SSG).</li>
      </ul>

      <h2>GEO redesign checklist</h2>

      <p><strong>Before:</strong></p>

      <ol>
        <li>Baseline GEO audit (score, citations, schemas)</li>
        <li>Inventory of pages cited by AI engines</li>
        <li>Export of all JSON-LD schemas</li>
        <li>Page-by-page 301 redirect plan</li>
      </ol>

      <p><strong>During:</strong></p>

      <ol>
        <li>Exhaustive 301 redirects</li>
        <li>All JSON-LD schemas reproduced</li>
        <li>robots.txt with AI bots allowed</li>
        <li>Updated sitemap submitted to search engines</li>
        <li>Author pages preserved</li>
        <li>Citable content preserved</li>
      </ol>

      <p><strong>After:</strong></p>

      <ol>
        <li>GEO audit of the new site (comparison with baseline)</li>
        <li>Manual citation test on ChatGPT/Perplexity</li>
        <li>Bi-weekly monitoring for 3 months</li>
      </ol>

      <h2>Conclusion</h2>

      <p>A website redesign is an opportunity to improve your AI visibility — as long as you don't lose what you already have. JSON-LD schemas, author pages, structured FAQs, and redirects are the four pillars you must absolutely preserve. Run a GEO audit before the redesign, reproduce trust signals identically, and monitor recovery for 3 months. That's the difference between a redesign that advances your AI visibility and one that makes it disappear.</p>

      <ArrowLink href="/blog/structured-data-avance-schemas-oublies">The advanced schemas that 95% of sites forget</ArrowLink>

      <ArrowLink href="/blog/geo-guide-complet-2026">The complete GEO guide for 2026</ArrowLink>
    </>
  );
}
