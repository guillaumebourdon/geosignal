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

export default function PerplexityCommentApparaitre() {
  return (
    <>
      <p>Perplexity is the fastest-growing AI search engine. With hundreds of millions of monthly queries in 2026 and triple-digit growth year over year, it's establishing itself as a serious alternative to Google for users seeking synthesized, sourced, and up-to-date answers. Not showing up there means missing out on highly qualified traffic — and unlike ChatGPT, Perplexity users actually click through to sources.</p>

      <p>Unlike ChatGPT, which relies on Bing, Perplexity has built its own web index. Its selection criteria, preferred sources, and citation mechanisms are specific. This guide explains how Perplexity actually works and details five concrete actions to get your site visible.</p>

      <h2>How Perplexity works</h2>

      <p>Perplexity is built on a <strong>RAG</strong> (Retrieval-Augmented Generation) architecture, but with a key difference: the engine <strong>crawls the web in real time</strong> via its own index, supplemented by data partnerships. When you ask a question, Perplexity runs an immediate search, reads the most relevant pages, then synthesizes a response citing each source with a clickable link.</p>

      <p>The process breaks down into four steps:</p>

      <ol>
        <li><strong>Query interpretation</strong> — Perplexity reformulates the user's question into multiple intermediate search queries to cover all facets of the topic.</li>
        <li><strong>Index search</strong> — the engine queries its own web index, continuously crawled by <code>PerplexityBot</code> (and <code>Perplexity-User</code> for real-time browsing).</li>
        <li><strong>Extraction and ranking</strong> — returned pages are ranked by relevance, authority, and freshness signals.</li>
        <li><strong>Synthesis with citations</strong> — the model generates a response injecting citation numbers <code>[1][2][3]</code> linking back to the sources used.</li>
      </ol>

      <p>Major difference from ChatGPT: <strong>every claim is linked to a verifiable source</strong>. Perplexity systematically displays the URLs used, making its responses more transparent but also more demanding on the quality of cited sources.</p>

      <h2>What Perplexity values in a website</h2>

      <p>Analysis of Perplexity citations by Profound (2025) and Growth Memo (2026) identifies the criteria that actually matter. The patterns are clear and differ noticeably from ChatGPT or Google.</p>

      <p><strong>Factual, sourced content</strong> leads the pack. Perplexity favors pages that cite their own sources (studies, statistics, academic references). An article claiming "sales grew" without a number will rank lower than one specifying "sales grew 23% according to study X published in March 2026."</p>

      <p><strong>Hard data</strong> is a strong signal. Pages containing percentages, dates, volumes, and comparisons are cited significantly more often. Perplexity extracts these figures to embed them directly in its synthetic responses.</p>

      <p><strong>Clear structure</strong> — hierarchical H2/H3 headings, short paragraphs, bullet lists — makes extraction easier. The engine needs to isolate short, self-contained passages that answer a sub-question. A 3,000-word wall of text with no structure is a parsing nightmare.</p>

      <p><strong>Domain authority</strong> remains a strong ranking signal, as with all search engines. But Perplexity partially compensates for this bias by rewarding content relevance on the specific query.</p>

      <p><strong>Freshness</strong> matters particularly on Perplexity. The engine explicitly prioritizes recent content, especially for queries related to news, trends, or data. An article updated a month ago is favored over equivalent content from 2022.</p>

      <p>Striking finding: according to Profound (2025), <strong>Reddit is the #1 source cited by Perplexity</strong>, accounting for roughly <strong>6.6% of all citations</strong>. Wikipedia comes second, followed by media sites and high-authority industry blogs. Reddit discussions serve as social validation that Perplexity interprets as a quality signal.</p>

      <ArrowLink href="/blog/reddit-geo-source-ia">Reddit is AI's #1 source: how to build a presence that drives citations</ArrowLink>

      <h2>Key differences between Perplexity and ChatGPT</h2>

      <p>Many businesses treat ChatGPT and Perplexity as a single channel. That's a mistake. The two engines have different behaviors, sources, and criteria. Optimizing for one doesn't guarantee visibility on the other.</p>

      <p><strong>Citations.</strong> Perplexity systematically cites its sources with clickable links. ChatGPT sometimes shows sources (in Search mode), sometimes doesn't at all (in free response mode based on training data). This difference directly impacts traffic: a Perplexity user is far more likely to click a source than a ChatGPT user.</p>

      <p><strong>The underlying engine.</strong> ChatGPT relies on Bing for real-time web searches. Perplexity uses its own index, built by its own crawlers. A site poorly indexed on Bing but well-crawled by Perplexity can be invisible on ChatGPT while being well-referenced on Perplexity.</p>

      <p><strong>Freshness.</strong> Perplexity values recent sources more heavily. ChatGPT, whose responses partly rely on its training corpus (sometimes 12 to 24 months old), is less sensitive to pure freshness.</p>

      <p><strong>Preferred sources.</strong> According to Profound (2025), <strong>only 11% of domains are cited by both ChatGPT AND Perplexity</strong> on the same queries. In other words, 89% of sources differ between the two engines. Each AI has its own editorial preferences, and visibility on one absolutely doesn't guarantee visibility on the other.</p>

      <p>Strategic implication: you need to <strong>diagnose each engine separately</strong>. An overall GEO score is useful, but per-engine detail is essential for prioritizing actions.</p>

      <InlineCTA href="/">Check your visibility on ChatGPT and Perplexity in under 60 seconds with Detekia.</InlineCTA>

      <h2>5 concrete actions to show up in Perplexity</h2>

      <p>Here are the levers with the most measurable impact, ranked by priority.</p>

      <h3>1. Structure content as direct answers</h3>

      <p>Perplexity extracts short, citable passages. The ideal structure:</p>

      <ul>
        <li>A clearly formulated question or query in an H2 or H3</li>
        <li>A direct answer in one or two sentences in the first paragraph that follows</li>
        <li>Detailed development in subsequent paragraphs</li>
      </ul>

      <p>This format, often called the "inverted pyramid," lets the engine immediately isolate the answer to inject into its synthesis. Avoid long introductions that bury the key information. A simple rule: the first sentence of each section should be citable as-is.</p>

      <h3>2. Add hard data with sources</h3>

      <p>Sourced pages are cited roughly <strong>2.8x more often</strong> than pages without external references (source: Ahrefs 2025). Every strong claim should be accompanied by:</p>

      <ul>
        <li>A precise figure (percentage, volume, dollar amount)</li>
        <li>A date (year or period)</li>
        <li>An identified source (study, report, organization)</li>
      </ul>

      <p>Weak example: "The SaaS market has grown a lot in recent years."</p>
      <p>Strong example: "The SaaS market reached $232 billion in 2024, growing 17.6% year over year (source: Gartner, February 2025)."</p>

      <p>The second version contains the ingredients Perplexity looks for: figures, date, verifiable source.</p>

      <h3>3. Be active on Reddit</h3>

      <p>Since Reddit is Perplexity's #1 source, being mentioned there organically has a direct impact on your visibility. Effective actions:</p>

      <ul>
        <li>Identify active subreddits in your industry</li>
        <li>Participate in discussions by adding value (no direct promotion)</li>
        <li>Answer technical questions with detailed, sourced responses</li>
        <li>Let brand mentions emerge naturally from other users</li>
      </ul>

      <p>Warning: spam is severely punished by moderators and Reddit's algorithm. The approach must be qualitative and long-term. The goal isn't to post your link everywhere, but to become a credible voice in your niche.</p>

      <h3>4. Publish fresh content regularly</h3>

      <p>Perplexity favors recent content. A site that publishes regularly (at least one article per week on key topics) sends a freshness signal that improves its citation probability on trending queries.</p>

      <p>Updating old articles is almost as effective as creating new content. Updating the date, refreshing statistics, adding sections on recent developments: these actions reposition your existing pages in the index with a recent date.</p>

      <p>Practical signal: explicitly indicate in the article "Last updated: [date]" and reflect this date in the <code>Article</code> schema (<code>dateModified</code>).</p>

      <h3>5. Implement JSON-LD schemas</h3>

      <p>Structured data makes Perplexity's parsing easier. Priority schemas for GEO:</p>

      <ul>
        <li><code>Article</code> — for editorial content, with <code>author</code>, <code>datePublished</code>, <code>dateModified</code></li>
        <li><code>FAQPage</code> — for Q&A pages, directly extractable by Perplexity</li>
        <li><code>HowTo</code> — for step-by-step tutorials</li>
        <li><code>Organization</code> — to establish your company's identity and authority</li>
        <li><code>AggregateRating</code> — to surface your ratings and reviews</li>
      </ul>

      <p>These schemas aren't a direct ranking factor, but they significantly increase the likelihood that your information is correctly interpreted and cited.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">The complete GEO guide for 2026: strategy, criteria and action plan</ArrowLink>

      <h2>How to check if Perplexity cites your site</h2>

      <p>Before optimizing, you need to measure. Two complementary methods, one manual and free, the other automated.</p>

      <h3>Manual testing</h3>

      <p>Go to <code>perplexity.ai</code> (no account needed for basic queries) and ask the questions your customers would ask:</p>

      <ul>
        <li>"What's the best [your category] in 2026?"</li>
        <li>"[Your industry] comparison"</li>
        <li>"[Your brand] reviews"</li>
        <li>A deep technical question in your field</li>
      </ul>

      <p>For each query, check the list of cited sources at the top of the response. Does your site appear? Are competitors cited instead? Is the information about your brand accurate?</p>

      <p>Repeat across 10 to 20 strategic queries for a representative snapshot. Log the results in a spreadsheet: that's your baseline for measuring progress after optimization.</p>

      <h3>Automated diagnostic with Detekia</h3>

      <p>Manual testing is useful but limited: it's subjective, not reproducible, and only covers a sample. <InternalLink href="/">Detekia</InternalLink> automates the analysis by evaluating your site across 8 GEO criteria: citability, verifiability, E-E-A-T authority, crawlability, structured data, editorial neutrality, external presence, and freshness.</p>

      <p>The report includes a Perplexity-specific diagnostic: blocked bots, missing schemas, pages poorly structured for extraction, and improvement opportunities prioritized by impact.</p>

      <ArrowLink href="/blog/pourquoi-chatgpt-ne-cite-pas-votre-site">Why ChatGPT doesn't cite your website (and how to fix it)</ArrowLink>

      <h2>Key takeaways</h2>

      <p>Perplexity isn't "ChatGPT lite." It's a full-fledged engine with its own index, its own criteria, and its own preferred sources. It values factual, structured, sourced, fresh content — and content that's particularly visible on Reddit. Only 11% of domains are cited on both engines: optimizing for Perplexity is a distinct effort, not a repeat of your ChatGPT strategy.</p>

      <p>The three highest-ROI actions if you're starting out:</p>

      <ol>
        <li><strong>Make sure <code>PerplexityBot</code> and <code>Perplexity-User</code> aren't blocked</strong> in your <code>robots.txt</code> — that's the absolute prerequisite</li>
        <li><strong>Restructure your key pages as inverted pyramids</strong> with figures, dates, and sources right in the first paragraph</li>
        <li><strong>Launch an organic Reddit presence</strong> in your target subreddits, with a qualitative, long-term approach</li>
      </ol>

      <p>Perplexity is still in its growth phase. Sites that position themselves now are capturing citation share that will be much harder to dislodge in 18 months, once positions are consolidated. The advantage goes to the first mover — as long as you optimize on the criteria that actually matter.</p>
    </>
  );
}
