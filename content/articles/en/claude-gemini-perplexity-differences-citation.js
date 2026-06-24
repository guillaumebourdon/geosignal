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

export default function ClaudeGeminiPerplexityDifferencesCitationEN() {
  return (
    <>
      <p>ChatGPT, Claude, Gemini, Perplexity: these four AI engines answer the same questions, but they don't cite the same sources. A site can be systematically cited by Perplexity and completely ignored by ChatGPT. Understanding these differences is essential for guiding your GEO strategy.</p>

      <p>Optimizing "for AI" in general isn't enough. Each engine has its own retrieval pipeline, its own selection biases, and its own trust criteria. Here's what concretely sets them apart.</p>

      <h2>Retrieval architectures: why answers differ</h2>

      <h3>ChatGPT (OpenAI): Bing + model memory</h3>

      <p>ChatGPT uses Bing as its underlying search engine for real-time responses (Browse mode). When you ask a factual question, ChatGPT sends a query to Bing, retrieves results, then synthesizes an answer.</p>

      <p>Implications for citation:</p>

      <ul>
        <li><strong>Sites ranking well on Bing are favored.</strong> If your site is invisible on Bing, ChatGPT won't find it.</li>
        <li><strong>Model memory plays a role.</strong> For generic questions, ChatGPT also draws from pre-trained knowledge. Brands and sites heavily present in the training corpus (Wikipedia, major media, high-authority sites) get cited even without real-time search.</li>
        <li><strong>Bing Places matters for local.</strong> If you're a local business, your Bing Places listing directly impacts your chances of being cited by ChatGPT.</li>
      </ul>

      <h3>Claude (Anthropic): selective web search</h3>

      <p>Claude has web access but uses it more selectively than ChatGPT. Claude tends to prioritize source quality and reliability over volume. Its training data gives significant weight to academic, technical, and well-structured content.</p>

      <p>Implications for citation:</p>

      <ul>
        <li><strong>Expert and technical content is favored.</strong> Claude cites more sites with an educational tone, referenced sources, and identified authors.</li>
        <li><strong><InternalLink href="/blog/eeat-ia-experience-expertise">E-E-A-T authority</InternalLink> weighs more heavily.</strong> Claude is particularly sensitive to credibility signals: detailed author pages, credentials, publications.</li>
        <li><strong>Promotional content is penalized.</strong> Claude filters commercial-toned content more aggressively than other engines.</li>
      </ul>

      <h3>Gemini (Google): the complete Google ecosystem</h3>

      <p>Gemini has a massive advantage: it accesses the entire Google ecosystem. Google Search, Google Maps, Google Scholar, YouTube, Google Shopping — everything is available to build a response.</p>

      <p>Implications for citation:</p>

      <ul>
        <li><strong>Traditional Google SEO counts directly.</strong> Sites ranking well on Google Search have a natural advantage on Gemini. It's the only AI engine where classic SEO transfers so directly.</li>
        <li><strong>Google Business Profile is decisive for local.</strong> For local queries, Gemini pulls directly from Google Maps. <InternalLink href="/blog/recherche-locale-ia-google-maps-llm">Local optimization</InternalLink> is therefore critical.</li>
        <li><strong>YouTube is a major source.</strong> Gemini frequently cites YouTube videos. If your content strategy includes video, it's a Gemini-specific lever.</li>
        <li><strong><InternalLink href="/blog/structured-data-avance-schemas-oublies">Structured data</InternalLink> is better exploited.</strong> Google is the most advanced at parsing JSON-LD schemas. Complete markup has more impact on Gemini than on other engines.</li>
      </ul>

      <h3>Perplexity: hybrid index with systematic citations</h3>

      <p>Perplexity stands out with a unique approach: it systematically cites sources with numbered links in every response. Its index combines multiple search engines and its own crawlers.</p>

      <p>Implications for citation:</p>

      <ul>
        <li><strong>Sources are always visible.</strong> Unlike other engines that sometimes cite without links, Perplexity always displays URLs. It's the engine where a citation generates the most direct traffic.</li>
        <li><strong>Freshness is highly valued.</strong> Perplexity recrawls frequently and favors recent content. An article updated this week has better chances than one from 6 months ago.</li>
        <li><strong>Forums and community content are well represented.</strong> <InternalLink href="/blog/reddit-geo-source-ia">Reddit</InternalLink>, Quora, Stack Overflow appear often in Perplexity sources, more than with other engines.</li>
        <li><strong>Long, detailed content is favored.</strong> Perplexity tends to cite in-depth articles over short pages.</li>
      </ul>

      <h2>Comparative citation criteria table</h2>

      <p>Here's how each AI engine weighs the main <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">GEO citability</InternalLink> criteria:</p>

      <table>
        <thead>
          <tr><th>Criterion</th><th>ChatGPT</th><th>Claude</th><th>Gemini</th><th>Perplexity</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Search engine</strong></td><td>Bing</td><td>Own web search</td><td>Google</td><td>Hybrid index</td></tr>
          <tr><td><strong>Traditional SEO</strong></td><td>Medium (Bing)</td><td>Low</td><td>Strong (Google)</td><td>Medium</td></tr>
          <tr><td><strong>E-E-A-T authority</strong></td><td>Important</td><td>Very important</td><td>Important</td><td>Medium</td></tr>
          <tr><td><strong>Structured data</strong></td><td>Medium</td><td>Medium</td><td>Very important</td><td>Low</td></tr>
          <tr><td><strong>Content freshness</strong></td><td>Medium</td><td>Medium</td><td>Important</td><td>Very important</td></tr>
          <tr><td><strong>Citations/sources</strong></td><td>Important</td><td>Very important</td><td>Important</td><td>Important</td></tr>
          <tr><td><strong>Long/detailed content</strong></td><td>Medium</td><td>Important</td><td>Medium</td><td>Very important</td></tr>
          <tr><td><strong>Local presence</strong></td><td>Bing Places</td><td>Low</td><td>Google Maps</td><td>Third-party directories</td></tr>
          <tr><td><strong>Link in response</strong></td><td>Sometimes</td><td>Sometimes</td><td>Sometimes</td><td>Always</td></tr>
        </tbody>
      </table>

      <InlineCTA href="/pricing">Test your visibility across all 4 AI engines</InlineCTA>

      <h2>Engine-specific strategies</h2>

      <h3>To get cited by ChatGPT</h3>

      <ul>
        <li><strong>Optimize for Bing.</strong> Claim your site on Bing Webmaster Tools, submit your sitemap, and verify your pages are indexed on Bing (not just Google).</li>
        <li><strong>Build brand awareness.</strong> ChatGPT draws on pre-trained memory. Well-known brands frequently mentioned across the web get cited naturally.</li>
        <li><strong>Polish your meta descriptions.</strong> Bing uses them more than Google in its snippets, and ChatGPT often picks them up.</li>
      </ul>

      <h3>To get cited by Claude</h3>

      <ul>
        <li><strong>Invest in expert content.</strong> In-depth articles, identified authors with credentials, cited academic sources.</li>
        <li><strong>Adopt a neutral, educational tone.</strong> Claude penalizes promotional content more than other engines. Write like an expert teaching, not a salesperson.</li>
        <li><strong>Create detailed author pages.</strong> Claude gives significant weight to author identification.</li>
      </ul>

      <h3>To get cited by Gemini</h3>

      <ul>
        <li><strong>Maintain strong Google SEO.</strong> It's the only AI engine where Google rankings transfer directly.</li>
        <li><strong>Implement complete JSON-LD schemas.</strong> Organization, Person, FAQPage, Article with dateModified — Gemini exploits them better than others.</li>
        <li><strong>Complete your Google Business Profile</strong> if you have a local presence.</li>
        <li><strong>Publish on YouTube.</strong> Videos are a major source for Gemini.</li>
      </ul>

      <h3>To get cited by Perplexity</h3>

      <ul>
        <li><strong>Update your content regularly.</strong> Perplexity values freshness more than any other engine.</li>
        <li><strong>Publish long, detailed content.</strong> Articles of 1,500+ words with data points are favored.</li>
        <li><strong>Be present on forums and communities.</strong> Reddit, Quora, specialized forums — Perplexity cites them frequently.</li>
        <li><strong>Include sourced data points.</strong> Perplexity loves content with precise statistics and verifiable sources.</li>
      </ul>

      <ArrowLink href="/blog/comment-chatgpt-choisit-ses-sources">How ChatGPT chooses its sources in detail</ArrowLink>

      <h2>The single-engine optimization trap</h2>

      <p>The temptation is to optimize for just one AI engine — often ChatGPT since it's the most used. This is a strategic mistake for three reasons:</p>

      <ul>
        <li><strong>Market shares shift quickly.</strong> Perplexity grows 40% per quarter. Gemini is integrated into Android and Chrome. Claude is gaining popularity in B2B. Betting everything on one engine is risky.</li>
        <li><strong>Core signals are shared.</strong> Well-structured content with sources, an identified author, and structured data will be well-cited everywhere. The 7 criteria of the <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">GEO score</InternalLink> cover the fundamentals common to all engines.</li>
        <li><strong>Diversification protects against algorithm changes.</strong> If ChatGPT changes its retrieval pipeline tomorrow (which happens regularly), diversified sites are less impacted.</li>
      </ul>

      <h2>The optimal strategy: common foundation + adjustments</h2>

      <p>The recommended approach:</p>

      <ol>
        <li><strong>Build the common foundation</strong>: structured content, cited sources, identified author, JSON-LD schemas, AI bots allowed. This is what the <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">Detekia GEO score</InternalLink> measures.</li>
        <li><strong>Add engine-specific optimizations</strong> based on your priorities: Bing Webmaster Tools for ChatGPT, Google Business Profile for Gemini, frequent updates for Perplexity, expert content for Claude.</li>
        <li><strong>Measure per engine</strong>: test the same queries across all 4 engines to identify where you're cited and where you're not. The Detekia Pro audit simulates 30 queries and measures your overall citation rate.</li>
      </ol>

      <h2>Conclusion</h2>

      <p>ChatGPT, Claude, Gemini, and Perplexity are not interchangeable. They have different architectures, different sources, and different biases. But the fundamentals of citability are the same: quality content, well-structured, with verifiable evidence and a credible author. Optimize for these fundamentals first, then fine-tune per engine based on your audience.</p>

      <ArrowLink href="/blog/perplexity-comment-apparaitre">Perplexity: how to appear in its responses</ArrowLink>

      <ArrowLink href="/blog/geo-guide-complet-2026">The complete GEO guide for 2026</ArrowLink>
    </>
  );
}
