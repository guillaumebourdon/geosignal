import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

function InlineCTA({ href, children }) {
  return (
    <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 10, padding: '20px 24px', margin: '32px 0', textAlign: 'center' }}>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6B6762', marginBottom: 12 }}>{children}</p>
      <a href={href} style={{ display: 'inline-block', background: '#D97757', color: '#fff', borderRadius: 8, padding: '11px 28px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
        Test my site for free →
      </a>
    </div>
  );
}

function InternalLink({ href, children }) {
  return (
    <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}
      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
    >{children}</Link>
  );
}

export default function SaasB2bChatgptRecommandationsEN() {
  return (
    <>
      <p>When a VP of Engineering looks for a monitoring tool, they no longer type "best SaaS monitoring tool" into Google. They ask ChatGPT: "What monitoring tool would you recommend for a 50-person startup running on AWS?"</p>

      <p>And ChatGPT doesn't return 10 blue links. It recommends 3 to 5 products by name, with the strengths of each, the best use case for each, and sometimes pricing estimates. It's a direct prescription, not a research exercise.</p>

      <p>The problem: <strong>most B2B SaaS companies are not optimized to appear in these responses</strong>. Their websites are built for Google, not for LLMs. The result: they're invisible in the fastest-growing acquisition channel — AI-referred traffic grew <strong>527%</strong> between January and May 2025 (source: <a href="https://previsible.io/blog/ai-referral-traffic" target="_blank" rel="noopener noreferrer">Previsible, 2025</a>).</p>

      <p>This guide explains how to position your B2B SaaS to be recommended by ChatGPT, Gemini, and Perplexity to your prospects.</p>

      <h2>Why B2B buyers are migrating to ChatGPT</h2>

      <p>The shift is measurable. According to <a href="https://www.gartner.com/en/articles/understand-and-exploit-gen-ai-s-impact-on-b2b-buying" target="_blank" rel="noopener noreferrer">Gartner (2025)</a>, 72% of B2B buyers consider generative AI tools a reliable source for software research. This isn't a weak signal.</p>

      <p><strong>The B2B buying journey is shrinking.</strong> A buyer who asks ChatGPT "what CRM for a 20-person sales team, integrated with HubSpot and Slack" gets a shortlist of 4 tools in 15 seconds. No need to read 6 comparison articles, 3 G2 reviews, and 2 Reddit threads. The AI does the synthesis.</p>

      <p><strong>Trust is high.</strong> 60% of ChatGPT users say they trust the AI's product recommendations (source: <a href="https://www.pewresearch.org/" target="_blank" rel="noopener noreferrer">Pew Research, 2026</a>). In B2B, where decisions are rational and documented, a structured recommendation with pros and cons of each tool carries more weight than a marketing tagline.</p>

      <p><strong>AI-referred visitors convert better.</strong> A visitor referred by an AI converts <strong>4.4x better</strong> than a standard organic visitor (source: <a href="https://www.semrush.com/" target="_blank" rel="noopener noreferrer">Semrush, 2025</a>). It makes sense: they arrive on your site already convinced that your product fits their needs. They're not comparing anymore — they're evaluating.</p>

      <h2>How ChatGPT selects which B2B SaaS to recommend</h2>

      <p>ChatGPT doesn't pick randomly. It relies on a set of signals to decide which products to cite. Understanding these signals is understanding how to get selected.</p>

      <ArrowLink href="/blog/comment-chatgpt-choisit-ses-sources">How ChatGPT selects its sources: the complete guide →</ArrowLink>

      <h3>Presence on review platforms</h3>

      <p>G2, Capterra, Trustpilot, Product Hunt: these platforms are heavily represented in LLM training data. A SaaS with 200+ reviews on G2 and a 4.5/5 rating has a structural advantage over a competitor with no profile. AI engines weigh the volume and diversity of third-party reviews heavily.</p>

      <h3>Public documentation</h3>

      <p>A complete, indexable, structured technical documentation is a massive authority signal. AI engines find factual answers there: which integrations are available, what the product's limitations are, how the API works. <strong>A B2B SaaS with no public docs is nearly invisible to LLMs.</strong></p>

      <h3>Transparent pricing</h3>

      <p>"Contact us for a quote" is a GEO anti-pattern. When a user asks "what email marketing tool for 10,000 contacts under $100/month," the AI can't recommend a SaaS with hidden pricing. Displaying clear pricing lets you be cited in budget-filtered queries — a growing share of B2B queries.</p>

      <h3>Structured case studies</h3>

      <p>A case study is not a "Trusted by" page with logos. It's structured content that says: <em>Who</em> (industry, size), <em>What problem</em>, <em>What solution</em>, <em>What measurable results</em>. This format is directly citable by AI when a prospect asks a contextual question ("what tool for a 200-person fintech").</p>

      <h3>Editorial mentions</h3>

      <p>Press articles, podcasts, expert analyses, industry newsletters: 90% of AI citations come from earned and owned media, not paid placements (source: <a href="https://www.edelman.com/" target="_blank" rel="noopener noreferrer">Edelman, 2026</a>). AI engines prioritize mentions in independent editorial contexts.</p>

      <h2>LLM biases in B2B SaaS</h2>

      <p>Before jumping into optimization tactics, you need to understand the systemic biases in LLMs that affect SaaS visibility.</p>

      <h3>The English-first bias</h3>

      <p>LLM training data is predominantly in English. A French SaaS with a French-only website starts with a structural disadvantage: ChatGPT has seen far more content about its English-speaking competitors. The minimum solution: an English version of your site, documentation, and case studies.</p>

      <h3>The ecosystem bias</h3>

      <p>LLMs know more about SaaS products integrated into established ecosystems (Salesforce, HubSpot, AWS, Shopify). A standalone tool with no known integrations will be cited less, because AI engines have less cross-referenced context about it. Documenting your integrations is a direct visibility lever.</p>

      <h3>The brand awareness bias</h3>

      <p>LLMs over-represent market leaders. If you're a new entrant or niche player, you need to compensate with educational content quality and positioning specificity. "The best CRM" pits you against Salesforce. "The CRM built for architecture firms" gives you a niche that AI engines can cite.</p>

      <h2>7 concrete levers to get recommended</h2>

      <p>Here are the specific actions to increase the likelihood that your SaaS gets cited by AI engines in your prospects' queries.</p>

      <h3>1. Create a citable positioning page</h3>

      <p>Your homepage is probably optimized to convert, not to be cited. Create a dedicated page (or enrich your About page) that factually answers the questions AI engines ask:</p>

      <ul>
        <li>What product category (CRM, monitoring, billing, etc.)</li>
        <li>For which target (company size, industry, use case)</li>
        <li>What factual differentiators (not "innovative leader" but "only tool with native Notion + Linear integration")</li>
        <li>What pricing (ranges at minimum)</li>
        <li>What alternatives exist and why you're relevant for your target</li>
      </ul>

      <p>This factual content is exactly what LLMs extract to formulate a recommendation.</p>

      <h3>2. Structure your case studies for LLMs</h3>

      <p>Transform your case studies into structured content that AI engines can parse:</p>

      <pre><code>{`{
  "@type": "Article",
  "headline": "How Qonto reduced support tickets by 40%",
  "about": {
    "@type": "SoftwareApplication",
    "name": "YourTool",
    "applicationCategory": "BusinessApplication"
  },
  "description": "Fintech, 200 employees. Problem: support overload.
Solution: automation with YourTool. Result: -40% tickets in 3 months."
}`}</code></pre>

      <p>Each case study should contain: industry, size, problem, solution, measurable result. Without these elements, the content is not citable.</p>

      <h3>3. Publish honest comparisons</h3>

      <p>"YourTool vs Competitor" pages are among the most cited content by AI in B2B, as long as they're honest. A credible comparison includes:</p>

      <ul>
        <li>The competitor's real strengths (not a straw man)</li>
        <li>Use cases where the competitor is better</li>
        <li>Objective criteria: pricing, features, integrations, support</li>
        <li>A nuanced verdict: "If your priority is X, choose A. If it's Y, we're the better fit."</li>
      </ul>

      <p>This honest positioning reinforces your <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">editorial neutrality</InternalLink> — one of the 8 GEO criteria that AI engines evaluate.</p>

      <h3>4. Make your documentation indexable</h3>

      <p>If your docs are behind a login, on a separate non-crawlable subdomain, or rendered with client-side JavaScript, AI engines can't see them. Action items:</p>

      <ul>
        <li>Host docs on an indexable subdomain (docs.yourtool.com)</li>
        <li>Allow GPTBot and ClaudeBot in your <code>robots.txt</code></li>
        <li>Create an <code>llms.txt</code> file at the root that summarizes your documentation</li>
        <li>Ensure server-side HTML rendering (no full-JS SPA)</li>
      </ul>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Complete guide: robots.txt and llms.txt for AI bots →</ArrowLink>

      <h3>5. Produce educational content in your niche</h3>

      <p>Marketing content ("Why YourTool is the best") doesn't get cited by AI. Educational content ("How to automate financial reporting in 2026") does. Why? Because AI engines look for answers to questions, not advertisements.</p>

      <p>Publish practical guides, benchmarks, methodologies. Every educational article is a potential entry point into AI responses. And if your product is naturally mentioned as a solution in that content, it gets cited alongside it.</p>

      <InlineCTA href="/">Is your SaaS visible to AI engines? Find out in 30 seconds.</InlineCTA>

      <h3>6. Invest in community platforms</h3>

      <p>Reddit is the #1 source for Perplexity (6.6% of citations) and #2 for ChatGPT (source: <a href="https://www.profound.com/" target="_blank" rel="noopener noreferrer">Profound, 2025</a>). Authentic discussions on r/SaaS, r/startups, Hacker News, and IndieHackers directly feed AI responses.</p>

      <p>Don't do disguised promotion — contribute genuinely. Answer technical questions, share real experiences, participate in community comparisons. AI engines distinguish promotional content from contributive content.</p>

      <ArrowLink href="/blog/reddit-geo-source-ia">Reddit and GEO: why Reddit is the #1 source for AI engines →</ArrowLink>

      <h3>7. Implement SaaS-specific Schema.org</h3>

      <p>Schema.org markup helps AI engines understand what you are and what you do. For a B2B SaaS, the essential schemas:</p>

      <ul>
        <li><code>SoftwareApplication</code> with <code>applicationCategory</code>, <code>operatingSystem</code>, <code>offers</code></li>
        <li><code>Organization</code> with <code>founder</code>, <code>foundingDate</code>, <code>numberOfEmployees</code></li>
        <li><code>FAQPage</code> on pricing and documentation pages</li>
        <li><code>Review</code> and <code>AggregateRating</code> if you display reviews</li>
      </ul>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Complete Schema.org guide for AI visibility →</ArrowLink>

      <h2>The 5 mistakes that make a SaaS invisible</h2>

      <p>Most B2B SaaS companies make at least 3 of these mistakes. Each one significantly reduces their chances of being cited.</p>

      <ol>
        <li><strong>Empty About page.</strong> "We're a passionate team revolutionizing the industry." Zero citable information. No names, no backgrounds, no numbers. AI engines can't evaluate E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).</li>
        <li><strong>Hidden pricing.</strong> "Contact us" = invisible for price-filtered queries. And these queries are among the highest-intent in B2B.</li>
        <li><strong>Zero educational content.</strong> Empty blog or filled with corporate updates ("Our booth at SaaStr"). No entry point for the research queries prospects ask AI engines.</li>
        <li><strong>Closed documentation.</strong> Docs behind a login, rendered client-side, or in a non-indexable PDF. AI bots can't access them.</li>
        <li><strong>No review platform presence.</strong> No G2, Capterra, or Product Hunt profile. No social proof that AI engines can verify.</li>
      </ol>

      <h2>How to audit your current AI visibility</h2>

      <p>Before optimizing, you need to measure. Here's the 3-step diagnostic to evaluate where your SaaS stands.</p>

      <h3>The direct test</h3>

      <p>Ask ChatGPT the queries your prospects would type: "What [your category] tool for [your target]?" Note: do you appear? Which competitors are cited? What criteria does the AI mention to justify its choices?</p>

      <h3>The 8-criteria GEO audit</h3>

      <p>Every page on your site can be evaluated against the <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">8 GEO criteria</InternalLink> that determine AI citability: citability, verifiability, authority, crawlability, structured data, neutrality, external presence, freshness.</p>

      <ArrowLink href="/blog/audit-geo-visibilite-ia">GEO audit: how to evaluate your AI visibility →</ArrowLink>

      <h3>The competitive benchmark</h3>

      <p>Identify your 3-5 main competitors. Audit their GEO score and compare with yours. The gaps tell you where to focus: if a competitor gets cited because they have comprehensive documentation and you don't, that's your #1 priority.</p>

      <ArrowLink href="/blog/concurrents-chatgpt-visibilite">How to track your competitors in AI responses →</ArrowLink>

      <h2>FAQ: GEO for B2B SaaS</h2>

      <h3>How long does it take to get recommended by ChatGPT?</h3>
      <p>There's no guaranteed timeline. LLMs update their training data irregularly, but ChatGPT with web browsing and Perplexity index content in near real-time. First visible results (appearing in responses) are typically seen between 2 and 8 weeks after optimization.</p>

      <h3>Is traditional SEO still useful if I'm doing GEO?</h3>
      <p>Yes. SEO and GEO are complementary. 80% of URLs cited by ChatGPT are not in Google's top 100 (source: <a href="https://ahrefs.com/" target="_blank" rel="noopener noreferrer">Ahrefs, 2025</a>). This means GEO opens a distinct channel, but SEO remains relevant for traditional organic traffic. The good news: GEO optimizations (structured content, verifiable data, freshness) also improve SEO.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO: what's different in 2026 →</ArrowLink>

      <h3>Do I need a blog to get cited by AI?</h3>
      <p>It's not mandatory, but it's a major advantage. A blog with educational content in your niche creates multiple entry points into AI responses. Every well-structured article is an opportunity to be cited on a specific query. Without a blog, you depend solely on your product page and external mentions.</p>

      <h3>My SaaS is available in one language only. Is that a problem?</h3>
      <p>If it's English-only, the impact is minimal since LLMs are predominantly trained on English content. If it's another language only, it's a significant handicap but not insurmountable. The GEO competition is lower in non-English markets, but so is the query volume. Pragmatic solution: keep your local-language site for the local market, but create English versions of your documentation and case studies to cover international queries.</p>

      <h3>Do AI engines prefer SaaS products with a free trial?</h3>
      <p>Not directly, but a free trial or freemium model creates more user-generated content (reviews, discussions, guides) that feeds AI engines. A SaaS with 10,000 free users talking about it on Reddit will be cited more than an enterprise-only SaaS with 50 silent customers.</p>
    </>
  );
}
