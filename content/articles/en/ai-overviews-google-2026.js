import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

export default function AiOverviewsGoogle2026() {
  return (
    <>
      <p>When you type a question into Google, an AI-generated answer now appears above the traditional results. That's the AI Overview — and it captures a massive share of clicks. On queries that trigger an AI Overview, organic click-through rates have dropped by 61%. If your site isn't the source cited in that answer, you're losing traffic even when you're ranking well.</p>

      <p>The good news: AI Overviews don't come from thin air. Google generates them from existing web pages — and 99% of cited sources come from the top 10 organic results. In other words, if you're already ranking well, you have an advantage. But SEO alone isn't enough: Google's AI selects sources based on specific criteria that this article breaks down.</p>

      <h2>What is an AI Overview exactly</h2>

      <p>The AI Overview (formerly known as SGE — Search Generative Experience) is a block of AI-generated text that appears at the top of certain search results pages. It synthesizes information from multiple sources to directly answer the user's question.</p>

      <p>Unlike featured snippets that extract a passage from a single page, the AI Overview combines and rephrases information from 3 to 5 sources. It cites those sources with links, but the user gets their answer without clicking — which explains the drop in organic CTR.</p>

      <p>AI Overviews appear primarily on informational and comparative queries: "how to choose a CRM," "difference between LLC and S-Corp," "best web hosting 2026." They don't appear (or rarely) on direct transactional queries ("buy iPhone 16") or navigational queries ("Facebook login").</p>

      <h2>Why it's different from appearing in ChatGPT or Perplexity</h2>

      <p>Google's AI Overviews have one major distinction: they rely almost exclusively on pages already indexed and ranked well in Google. ChatGPT and Perplexity use their own crawlers (GPTBot, PerplexityBot) and can cite sources that Google doesn't rank on page one.</p>

      <p>In practice, this means that for AI Overviews, traditional SEO is the prerequisite. You need to be in Google's top 10 for a query before you can hope to be cited in that query's AI Overview.</p>

      <p>It's the GEO layer that then makes the difference: among the 10 organic results, which one gets selected as the AI Overview source? That's where your content's citability, structure, and verifiability come into play.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO: what's different in 2026 →</ArrowLink>

      <h2>The 6 selection criteria for AI Overviews</h2>

      <p>Google hasn't published official documentation on the exact selection criteria for AI Overviews. But analysis of thousands of results and research studies allow us to identify the dominant signals.</p>

      <h3>1. Top 10 organic position</h3>

      <p>This is the prerequisite. AI Overviews draw from results that Google has already judged relevant and high-quality. If your page isn't in the top 10 for the target query, it won't be considered for the AI Overview.</p>

      <p>This doesn't mean position 1 always gets picked. Google AI may select position 3 or 7 if it judges that page better answers the specific question. But being outside the top 10 is disqualifying.</p>

      <h3>2. Direct, extractable answer</h3>

      <p>AI Overviews favor pages that contain a clear, direct answer to the question asked, ideally in the first few paragraphs.</p>

      <p>If the user searches "how to improve your GEO score," Google AI will look for a page that starts by answering that question — not a page that talks at length about the history of GEO before getting to the answer.</p>

      <p>The ideal format: a direct answer sentence, followed by a structured explanation with steps or key points.</p>

      <h3>3. Descriptive subheadings</h3>

      <p>Pages with H2/H3 tags that ask questions or clearly describe the content of each section are more easily parsed by Google's AI.</p>

      <p>Effective example:</p>
      <ul>
        <li>H2: "How to appear in AI Overviews"</li>
        <li>H2: "What types of content get selected"</li>
        <li>H2: "How long until you appear"</li>
      </ul>

      <p>Ineffective example:</p>
      <ul>
        <li>H2: "Our approach"</li>
        <li>H2: "Our services"</li>
        <li>H2: "Learn more"</li>
      </ul>

      <h3>4. Schema.org structured data</h3>

      <p>Pages with comprehensive Schema.org markup (Article, FAQPage, HowTo) have a significant advantage. The markup helps Google AI understand the content type, author, date, and structure.</p>

      <p>The FAQPage schema is particularly effective for AI Overviews: structured Q&A pairs match exactly the format the AI is trying to generate.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org and AI: the practical guide →</ArrowLink>

      <h3>5. E-E-A-T domain authority</h3>

      <p>Google uses its standard E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness) to evaluate the reliability of potential AI Overview sources. A site with strong domain authority, identified authors, and quality backlinks will be preferred.</p>

      <p>This is where established sites have an advantage over newer ones. But an exceptionally well-structured and comprehensive piece of content on a smaller site can still get selected — especially on niche queries.</p>

      <h3>6. Content freshness</h3>

      <p>For queries where timeliness matters ("best CRM 2026," "new data privacy regulations"), Google AI favors recent content. Publication date and last-modified date are direct signals.</p>

      <p>A 2024 article on an evolving topic will be passed over in favor of a 2026 article, even if the former has more backlinks.</p>

      <h2>7 concrete actions to get selected</h2>

      <h3>Action 1 — Target featured snippets first</h3>

      <p>Featured snippets and AI Overviews often target the same queries. If you already have a featured snippet, you have a strong probability of being cited in the corresponding AI Overview.</p>

      <p>Optimize your pages for featured snippets: concise answer in 40-60 words directly under the H2, followed by a detailed explanation.</p>

      <h3>Action 2 — Structure in "question → answer" format</h3>

      <p>Every important section of your page should follow this format:</p>
      <ul>
        <li>An H2 or H3 phrased as a natural question</li>
        <li>A direct answer paragraph (2-3 sentences)</li>
        <li>A detailed expansion with examples or data</li>
      </ul>

      <p>This format is exactly what Google's AI looks for when building its summaries.</p>

      <h3>Action 3 — Add lists and numbered steps</h3>

      <p>AI Overviews frequently display lists. If your content contains ordered lists ("5 steps to...," "the 3 criteria for..."), it has a better chance of being selected and displayed in the format users expect.</p>

      <h3>Action 4 — Cover the topic comprehensively</h3>

      <p>AI Overviews combine information from multiple sources. If your page covers the topic comprehensively — every facet, every common question — Google AI can cite it as the primary source rather than having to combine 4-5 partial sources.</p>

      <p>Aim for 2,000+ word articles that address the topic in depth, with subsections for each aspect.</p>

      <h3>Action 5 — Add unique data points</h3>

      <p>AI Overviews frequently cite statistics and numbers. If your page contains original data (your own studies, benchmarks, measured results), it has an advantage over pages that merely compile data from other sources.</p>

      <p>Examples: "Across 500 sites analyzed, 94% scored below 60/100," "The average time to see impact is 8 weeks."</p>

      <h3>Action 6 — Implement HowTo and FAQPage schema</h3>

      <p>Beyond the Article schema, two schemas are particularly effective for AI Overviews:</p>
      <ul>
        <li><strong>HowTo</strong> — for step-by-step tutorial content. Google AI can directly extract the steps and display them in a structured format.</li>
        <li><strong>FAQPage</strong> — for Q&A sections. The Q&A format naturally corresponds to what AI Overviews are trying to produce.</li>
      </ul>

      <h3>Action 7 — Update regularly</h3>

      <p>AI Overviews change frequently — Google regularly recalculates which sources to cite. Content updated with fresh data has a better chance of being selected than static content.</p>

      <p>Update your pillar articles at least once per quarter. Add recent data, remove outdated information, and update the modification date in your Article schema.</p>

      <h2>Best query types for AI Overviews</h2>

      <p>Not all query types trigger AI Overviews. Focus your efforts on the ones that generate them most often.</p>

      <h3>"How" and "why" queries</h3>

      <p>"How to choose a...," "Why does my site...," "How does [X] work..." — these queries generate an AI Overview in the majority of cases. They call for an explanatory answer that AI can synthesize well.</p>

      <h3>Comparative queries</h3>

      <p>"X vs Y," "Difference between A and B," "Best X for Y" — comparisons are prime territory for AI Overviews because they require synthesizing multiple criteria.</p>

      <h3>Definition queries</h3>

      <p>"What is GEO," "Definition of [concept]" — Google's AI excels at synthesizing definitions from multiple sources.</p>

      <h3>Poor candidates</h3>

      <p>Navigational queries ("official site of X"), direct transactional queries ("buy X"), and hyper-local queries ("Italian restaurant nearby") rarely trigger AI Overviews.</p>

      <h2>How to measure your presence in AI Overviews</h2>

      <p>Google Search Console doesn't yet provide specific data on AI Overviews. But several approaches let you track your visibility.</p>

      <p><strong>Regular manual testing</strong> — identify your top 10-15 target queries. Check monthly whether an AI Overview appears and whether your site is cited in it. Use an incognito browser window to avoid result personalization.</p>

      <p><strong>CTR tracking in Search Console</strong> — if you see a sudden CTR drop on a query where you rank well, it's likely that an AI Overview appeared and is capturing clicks. If you're cited in the Overview, CTR may partially recover.</p>

      <p><strong>Third-party tools</strong> — tools like Semrush and Ahrefs are starting to track AI Overview presence in their keyword reports. Check whether your current SEO tools offer this feature.</p>

      <p><strong>GEO audit</strong> — the selection criteria for AI Overviews overlap significantly with the 7 criteria of the Detekia GEO score, particularly citability, structured data, and verifiability.</p>

      <h2>Frequently asked questions</h2>

      <h3>Do AI Overviews appear on every Google search?</h3>

      <p>No. As of 2026, they appear on roughly 30% of search results pages, primarily for informational and comparative queries. Google continues to expand their rollout.</p>

      <h3>Can I prevent my content from appearing in AI Overviews?</h3>

      <p>Yes, by blocking the Google-Extended user-agent in your robots.txt. But it's counterproductive: you lose a visibility channel with no real benefit. Blocking Google-Extended doesn't affect your traditional SEO rankings.</p>

      <h3>Will AI Overviews kill organic traffic?</h3>

      <p>Not entirely. They redistribute traffic: sites cited in the Overview capture a share of it, others lose out. The goal is to be among the cited sources, not to fight the change.</p>

      <h3>My site ranks #1 on Google but isn't cited in the AI Overview. Why?</h3>

      <p>Ranking first in SEO doesn't guarantee being the AI Overview source. Google AI evaluates additional criteria: content citability, structure, comprehensiveness, structured data. A competitor in position 4 with better-structured content can be preferred.</p>

      <ArrowLink href="/">Analyze your site — GEO score out of 100, 7 criteria, in under 60 seconds →</ArrowLink>
    </>
  );
}
