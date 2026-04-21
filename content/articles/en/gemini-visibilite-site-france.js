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
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#8A8680', marginBottom: 12 }}>{children}</p>
      <a href={href} style={{ display: 'inline-block', background: '#D97757', color: '#fff', borderRadius: 8, padding: '11px 28px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
        Test my website for free →
      </a>
    </div>
  );
}

export default function GeminiVisibiliteSiteFrance() {
  return (
    <>
      <p>Gemini is no longer an experimental chatbot. It's the AI engine powering AI Overviews in Google Search, summaries in Gmail, suggestions in Chrome and Android. With Google holding <strong>88% search market share in the US</strong> (StatCounter, March 2026), it's the entry point for the vast majority of web traffic. When Google changes, everyone is affected.</p>

      <p>The impact is already measurable: AI Overviews now appear on roughly <strong>30% of informational queries</strong> in the US (BrightEdge, 2026). AI Mode — an even more aggressive version that completely replaces traditional results with a conversational response — is already available in several countries and rolling out across all markets. The question isn't "if" but "when" your organic traffic will be affected.</p>

      <h2>What exactly is Gemini?</h2>

      <p>Gemini is Google's central AI model, launched in late 2023 under the name Bard, then rebranded in February 2024. It's a multimodal model capable of processing text, images, video, and code. But its most strategic role for businesses is its direct integration into Google Search via AI Overviews.</p>

      <p>In practice, when a user runs an informational search on Google, Gemini generates a summary at the top of the results page. This summary cites sources — and that's where your visibility is at stake. If you're not in that summary, you get pushed below the fold, or become invisible entirely.</p>

      <p><strong>The fundamental difference from ChatGPT and Perplexity</strong>: Gemini draws directly from the Google index. It doesn't rely on Bing (like ChatGPT) or a proprietary index (like Perplexity). It uses the same corpus as the traditional search engine, but filters and synthesizes it via AI. This means your existing SEO work isn't wasted — it forms the foundation Gemini builds on.</p>

      <InternalLink href="/blog/comment-chatgpt-choisit-ses-sources">How ChatGPT chooses its sources: the process explained</InternalLink>

      <h2>Why Gemini changes the SEO game</h2>

      <p>AI Overviews transform the Google results page from 10 blue links into a single AI-generated answer with a few cited sources. Either you're cited in that answer, or you lose the click. US data shows that <strong>sites not cited in AI Overviews lose up to 60% of their organic clicks</strong> on affected queries (Authoritas, 2025).</p>

      <p>AI Mode goes even further: it eliminates the traditional results page entirely. The user gets a conversational response with embedded links, without ever seeing the classic results list. Google has confirmed that AI Mode will be rolled out progressively across all markets in 2026.</p>

      <p>The risk of massive zero-click is real. But so is the opportunity: <strong>the 3 sources cited in an AI Overview capture more traffic than a classic position 4 or 5</strong>. Being THE source Gemini chooses to cite is the new SEO objective.</p>

      <p>For US businesses, the timeline is now. AI Overviews are already visible on millions of queries. The sites that optimize now will have a decisive positioning advantage as rollout expands.</p>

      <h2>6 concrete actions to optimize your site for Gemini</h2>

      <p>Gemini draws from the existing Google index but applies its own selection criteria for choosing which sources to cite. Here are the six most effective levers, ranked by impact.</p>

      <h3>1. Structure content as direct answers</h3>

      <p>Gemini extracts the first 100 to 150 words of each section to build its summaries. The ideal structure: each H2 starts with a direct answer to the question posed, followed by the detailed explanation. A vague introductory paragraph before the actual answer loses the citation.</p>

      <p>Recommended format: question in the H2, assertive answer in one to two sentences in the first paragraph, then argumentation and data in the rest. It's the inverted pyramid — the format all AI models prefer for extraction.</p>

      <h3>2. Strengthen E-E-A-T</h3>

      <p>Google evaluates Experience, Expertise, Authoritativeness, and Trustworthiness of each page before citing it in an AI Overview. Concrete actions:</p>

      <ul>
        <li><strong>Author pages</strong> — every article should be signed by an author with a bio page detailing their qualifications</li>
        <li><strong>Demonstrated expertise</strong> — include original analysis, not just reformulations of existing content</li>
        <li><strong>Cited sources</strong> — every factual claim should link to a verifiable source (study, report, official data)</li>
        <li><strong>Trust signals</strong> — press mentions, partnerships, certifications visible on the site</li>
      </ul>

      <h3>3. Implement structured data</h3>

      <p>JSON-LD schemas help Gemini understand the nature and structure of your content. Priority schemas for AI Overviews:</p>

      <ul>
        <li><code>Article</code> with <code>author</code>, <code>datePublished</code>, <code>dateModified</code></li>
        <li><code>FAQPage</code> for Q&A pages — directly extractable by Gemini</li>
        <li><code>HowTo</code> for step-by-step tutorials</li>
        <li><code>Organization</code> to establish your business identity</li>
      </ul>

      <p>According to a Merkle analysis (2025), pages with a correctly implemented <code>FAQPage</code> schema have <strong>43% higher chances</strong> of being cited in an AI Overview compared to pages without structured data.</p>

      <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org for AI: the practical guide to being understood by LLMs</InternalLink>

      <h3>4. Organize content in topical clusters</h3>

      <p>Gemini evaluates a site's topical authority, not just the relevance of an isolated page. A site that covers a topic in depth — with a pillar page and satellite articles linked together — is favored over a site that publishes a single standalone article on the same subject.</p>

      <p>The recommended structure: a main page covering the broad topic (e.g., "GEO: the complete guide"), specific articles on each sub-theme (e.g., "Schema.org for AI," "Structured data and visibility"), and internal links between all these pages. This internal linking signals to Gemini that your site has authority on the entire topic.</p>

      <h3>5. Optimize the technical foundation</h3>

      <p>Technical prerequisites are non-negotiable. If Gemini can't crawl and understand your site, no content optimization will help:</p>

      <ul>
        <li><strong>Page speed</strong> — Core Web Vitals remain a quality signal for Google, including for AI Overviews</li>
        <li><strong>Crawlability</strong> — make sure <code>Googlebot</code> isn't blocked in your <code>robots.txt</code> (Gemini uses the same crawler)</li>
        <li><strong>No AI bot blocking</strong> — some sites block <code>Google-Extended</code> (the user-agent dedicated to Google's AI) without knowing it</li>
        <li><strong>JavaScript rendering</strong> — if your content is client-side rendered, make sure it's accessible to crawlers</li>
      </ul>

      <h3>6. Add hard data and verifiable sources</h3>

      <p>Gemini, like all AI models, favors content containing verifiable data. An article with percentages, dates, volumes, and identified sources gets cited more often than a generic article without data. Every key section of your content should include at least one sourced figure.</p>

      <InlineCTA href="/">Test your AI visibility for free — Score out of 100 in 30 seconds</InlineCTA>

      <h2>Gemini vs ChatGPT vs Perplexity: what's different for your visibility?</h2>

      <p>The three dominant AI engines don't use the same sources, don't cite the same way, and don't reach the same audience. Optimizing for one doesn't guarantee visibility on the others. Here's a structured comparison:</p>

      <div style={{ overflowX: 'auto', margin: '24px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E2DC' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#1A1915' }}>Criterion</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#1A1915' }}>Gemini (Google)</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#1A1915' }}>ChatGPT (OpenAI)</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#1A1915' }}>Perplexity</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '10px 16px', fontWeight: 600 }}>Data source</td>
              <td style={{ padding: '10px 16px' }}>Google index (direct)</td>
              <td style={{ padding: '10px 16px' }}>Bing + training corpus</td>
              <td style={{ padding: '10px 16px' }}>Proprietary index + real-time crawl</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '10px 16px', fontWeight: 600 }}>Citation type</td>
              <td style={{ padding: '10px 16px' }}>Links in AI Overviews</td>
              <td style={{ padding: '10px 16px' }}>Links in Search mode, none in free mode</td>
              <td style={{ padding: '10px 16px' }}>Systematic numbered citations</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '10px 16px', fontWeight: 600 }}>Traffic impact</td>
              <td style={{ padding: '10px 16px' }}>Highest (88% of US search)</td>
              <td style={{ padding: '10px 16px' }}>Moderate (400M+ active users)</td>
              <td style={{ padding: '10px 16px' }}>Low volume, high click-through rate</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '10px 16px', fontWeight: 600 }}>Primary audience</td>
              <td style={{ padding: '10px 16px' }}>All Google users</td>
              <td style={{ padding: '10px 16px' }}>Early adopters, tech professionals</td>
              <td style={{ padding: '10px 16px' }}>Researchers, analysts, power users</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 16px', fontWeight: 600 }}>Key lever</td>
              <td style={{ padding: '10px 16px' }}>SEO + E-E-A-T + structured data</td>
              <td style={{ padding: '10px 16px' }}>Bing indexation + domain authority</td>
              <td style={{ padding: '10px 16px' }}>Fresh, sourced content + Reddit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Key point: Gemini represents the largest volume because it reaches <strong>all existing Google users</strong>, not just early adopters who've chosen an AI tool. It's the engine that will impact the most websites in 2026.</p>

      <InternalLink href="/blog/perplexity-comment-apparaitre">Perplexity: how to get your website into its responses</InternalLink>

      <h2>How to check if Gemini cites your site</h2>

      <p>Before optimizing, you need to know where you stand. Three complementary methods, from fastest to most thorough.</p>

      <h3>Direct test on Gemini</h3>

      <p>Go to <code>gemini.google.com</code> and run queries your customers would use. For example: "best [your category] in [your city]," "[your industry] comparison 2026," or a deep technical question in your domain. Check if your site appears in the cited sources, and whether the information is accurate.</p>

      <h3>Check AI Overviews</h3>

      <p>Run Google searches on your strategic queries. If AI Overviews appear (summary at the top with the AI icon), check the cited sources. Look for your site and your competitors. Note which content formats get cited — that's your template for optimization.</p>

      <h3>Automated audit with Detekia</h3>

      <p>Manual testing is useful but not reproducible. <InternalLink href="/">Detekia</InternalLink> analyzes your site across 8 GEO criteria (extractability, structured data, E-E-A-T, crawlability, etc.) and identifies priority optimizations for each AI engine, including Gemini via AI Overviews.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO: key differences and how to combine them in 2026</ArrowLink>

      <ArrowLink href="/blog/visibilite-ia-guide-debutant">AI Visibility: the beginner's guide for businesses starting from zero</ArrowLink>

      <h2>Key takeaways</h2>

      <p>Gemini isn't just another AI engine. It's Google itself changing paradigms. With 88% of the US search market, the impact on organic traffic will be massive — far greater than ChatGPT or Perplexity combined.</p>

      <p>The three priority actions if you're getting started:</p>

      <ol>
        <li><strong>Make sure <code>Google-Extended</code> isn't blocked</strong> in your <code>robots.txt</code> — that's the absolute prerequisite for being cited by Gemini</li>
        <li><strong>Restructure your key pages as inverted pyramids</strong> — direct answer in the first 100 words, hard data, cited sources</li>
        <li><strong>Implement <code>Article</code> and <code>FAQPage</code> schemas</strong> with author, dates, and organization — Gemini uses these to validate E-E-A-T</li>
      </ol>

      <p>Sites that position themselves now on Gemini's criteria are building a durable advantage. Once AI Overviews are fully deployed, positions will be harder to win than to defend. The time to act is before the full rollout — not after.</p>
    </>
  );
}
