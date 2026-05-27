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

export default function PourquoiTraficGoogleBaisse2026() {
  return (
    <>
      <p>Your organic Google traffic has been declining for months and you cannot figure out why. Your SEO has not changed, your rankings are stable, and yet clicks are dropping. The reason is structural: in 2026, Google no longer sends as many visitors as it used to, because it answers your visitors' questions itself — directly in the search results, using AI.</p>

      <p>This phenomenon affects every industry. And it is accelerating. Here is what is happening, why it concerns you, and most importantly how to respond.</p>

      <h2>What changed: Google answers instead of your website</h2>

      <p>Since the massive rollout of <strong>AI Overviews</strong> (formerly SGE), Google displays an AI-generated summary at the top of its results for a growing number of queries. The user gets their answer without clicking a single link.</p>

      <p>The numbers speak for themselves:</p>

      <ul>
        <li><strong>58.5% of Google searches</strong> in the US now end without a single click (SparkToro/Datos, 2024). That rate climbs to <strong>83%</strong> on queries that trigger an AI Overview.</li>
        <li>On those same queries, the <strong>organic click-through rate has dropped 61%</strong>, falling from 1.76% to 0.61% (Seer Interactive, 2025).</li>
        <li><strong>Google AI Overviews reach 2 billion monthly users</strong> across more than 100 countries (Sundar Pichai, Alphabet Q3 2025).</li>
      </ul>

      <p>Bottom line: even if you rank #1 on Google for your target query, a growing share of your potential visitors no longer click. They read the AI summary and move on.</p>

      <h2>It is not just Google: ChatGPT, Perplexity, and others are capturing your visitors</h2>

      <p>The problem is not limited to AI Overviews. In parallel, a portion of your audience has simply <strong>switched search engines</strong>.</p>

      <ul>
        <li><strong>ChatGPT</strong> processes 2.5 billion queries per day and 810 million people use it daily (Search Engine Land, 2026).</li>
        <li><strong>AI-referred traffic</strong> surged by <strong>527%</strong> in the first half of 2025 (Previsible, 2025).</li>
        <li><strong>Gartner forecasts a 25% decline</strong> in traditional search volume by the end of 2026.</li>
        <li>Over <strong>100 million Americans</strong> use AI tools weekly for search-related tasks (Pew Research, 2026).</li>
      </ul>

      <p>Your prospects are no longer typing "best [your product] 2026" into Google. They are asking ChatGPT. And if your site is not optimized to be cited in that response, you do not exist for them.</p>

      <ArrowLink href="/blog/pourquoi-chatgpt-ne-cite-pas-votre-site">Why ChatGPT does not cite your website (and how to fix it)</ArrowLink>

      <h2>5 signs AI is already impacting your traffic</h2>

      <p>How do you know if AI is actually causing your traffic decline, rather than a standard SEO issue? Here are the signals to watch:</p>

      <h3>1. Your rankings are stable but your clicks are dropping</h3>

      <p>Open Google Search Console. If your impressions remain steady (or increase) but your clicks are declining, that is the sign that Google is answering in your place. The user sees your result, but no longer clicks because they already have their answer from the AI Overview.</p>

      <h3>2. Your informational queries are hit hardest</h3>

      <p>Queries like "how to do X", "what is Y", "difference between A and B" are the first to be cannibalized by AI. If your traffic is dropping primarily on these types of queries, it is consistent with AI impact.</p>

      <h3>3. You see AI Overviews on your target queries</h3>

      <p>Type your 10 main queries into Google (in incognito mode). If an AI summary appears at the top of results on the majority of them, your content is being directly competed against by Google itself.</p>

      <h3>4. Your competitors are cited by AI and you are not</h3>

      <p>Ask ChatGPT and Perplexity the questions your clients typically ask you. If your competitors appear in the answers and you do not, you have an AI visibility problem — not an SEO problem.</p>

      <h3>5. Your "direct" traffic is slightly increasing</h3>

      <p>Paradoxically, some sites see their direct traffic increase while organic declines. Explanation: users discover your brand through an AI citation, then type your name directly into their browser. That is a positive signal, but it masks the reality of the organic decline.</p>

      <InlineCTA href="/">Is your website visible to AI? Free diagnostic in under 60 seconds.</InlineCTA>

      <h2>Why SEO alone is no longer enough</h2>

      <p>If you have strong SEO, you have a head start. But SEO alone no longer guarantees visibility in 2026. Here is why:</p>

      <p><strong>SEO optimizes for links. GEO optimizes for citations.</strong> Ranking #1 in a list of 10 blue links no longer has the same value when the user reads an AI summary before seeing that list — or never sees it at all.</p>

      <p><strong>80% of URLs cited by ChatGPT are not in Google's top 100</strong> (Ahrefs, 2025). This figure shows that AI selection criteria are different from Google's. A site can be invisible on Google and very well cited by AI engines — and vice versa.</p>

      <p>The good news: <strong>99% of sources cited in Google AI Overviews</strong> still come from the organic top 10. SEO remains the foundation. But you need to add a specific optimization layer so your content is not only found but also <strong>cited</strong>.</p>

      <p>That layer is GEO — Generative Engine Optimization.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO: the differences and how to combine them in 2026</ArrowLink>

      <h2>How to respond: 6 immediate actions</h2>

      <h3>Action 1 — Diagnose your AI visibility</h3>

      <p>Before you act, measure. Analyze your site across the 7 criteria that determine whether AI cites you: content citability, data verifiability, authority, AI bot crawlability, structured data, editorial neutrality, external presence, and freshness.</p>

      <p>Detekia automatically analyzes these 7 criteria and gives you a score out of 100 in under 60 seconds. It is free and requires no signup.</p>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">GEO score: how to measure your website's AI visibility</ArrowLink>

      <h3>Action 2 — Open access to AI bots</h3>

      <p>Check your <code>robots.txt</code> file. By default, many CMS platforms block AI bots (GPTBot, ClaudeBot, PerplexityBot). If these bots cannot read your content, it is impossible to be cited.</p>

      <p>Also create an <code>llms.txt</code> file at your site's root. It is the equivalent of <code>robots.txt</code> for AI engines: it tells them which pages are most important and how to interpret your content.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Complete guide: llms.txt, robots.txt, and AI Accessibility</ArrowLink>

      <h3>Action 3 — Restructure your content for extraction</h3>

      <p>AI engines look for ready-to-cite answers. Revisit your 5 most important pages and make sure that:</p>

      <ul>
        <li>The <strong>first 100 words</strong> contain a clear, direct answer to the main question.</li>
        <li>Each H2 section is <strong>self-contained</strong>: understandable and citable without reading the rest of the page.</li>
        <li>Hard data is <strong>sourced</strong> with the study name and year.</li>
        <li>Bullet points and tables are used for comparisons and steps.</li>
      </ul>

      <h3>Action 4 — Add Schema.org structured data</h3>

      <p>Structured data helps AI engines understand what your page contains. The minimum: <code>Organization</code> on your homepage, <code>Article</code> on your editorial content, <code>FAQPage</code> on your Q&A pages.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org and AI: the practical guide to being understood by LLMs</ArrowLink>

      <h3>Action 5 — Be present on sources that AI engines cite</h3>

      <p>AI engines cross-reference sources. Reddit is the platform most cited by LLMs in 2026. If your brand is mentioned on Reddit, in the trade press, or on relevant forums, your credibility increases with AI engines.</p>

      <p>Identify 5 subreddits related to your industry and start answering questions with expertise. No direct promotion — pure value.</p>

      <ArrowLink href="/blog/reddit-geo-source-ia">Reddit and GEO: why Reddit is the #1 source cited by AI engines</ArrowLink>

      <h3>Action 6 — Monitor your competitors in AI</h3>

      <p>Ask ChatGPT, Gemini, and Perplexity the 10 questions your clients ask most often. Note who is cited, in what context, and what arguments are highlighted. That is your starting benchmark.</p>

      <p>If your competitors are cited and you are not, that is actually good news: the gap is identified, and it is closable.</p>

      <ArrowLink href="/blog/concurrents-chatgpt-visibilite">ChatGPT cites your competitors? Here is how to reclaim your spot</ArrowLink>

      <h2>The e-commerce double impact</h2>

      <p>If you run an online store, the impact is even more direct. AI engines do not just answer questions — they recommend products. When someone asks ChatGPT "best robot vacuum 2026," the AI offers a curated selection. If your product pages are not optimized (Product schema, customer reviews, structured data), you will not appear in that selection.</p>

      <ArrowLink href="/blog/ecommerce-recommandations-ia">E-commerce: how to appear in AI product recommendations</ArrowLink>

      <h2>Key takeaways</h2>

      <p>The decline in Google traffic in 2026 is not a bug — it is a structural shift in how search works. AI Overviews, ChatGPT, Perplexity, and others are capturing a growing share of searches and answering users directly.</p>

      <p>Websites that adapt now by optimizing their content to be cited by AI (not just ranked by Google) will gain a decisive advantage. Those that wait will see their traffic continue to decline, month after month.</p>

      <p>The first step is simple: measure where you stand. Analyze your site for free on Detekia — GEO score out of 100, 7 criteria analyzed, actionable recommendations, in under 60 seconds.</p>

      <InlineCTA href="/">Traffic dropping? Find out if AI is the cause.</InlineCTA>
    </>
  );
}
