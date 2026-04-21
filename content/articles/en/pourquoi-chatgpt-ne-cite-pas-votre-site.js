import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

export default function PourquoiChatGPTNeCitePasVotreSite() {
  return (
    <>
      <p>You typed your company name into ChatGPT. Or worse: you asked for a recommendation in your industry. And your site appeared nowhere. Your competitors did.</p>

      <p>This is not a bug. It is not about ad spend either. If ChatGPT, Gemini, or Perplexity do not cite your site, it is because your content does not meet the criteria these engines use to select their sources.</p>

      <p>The good news: it is fixable. And often faster than you think. Here are the 6 most common reasons — and how to solve them.</p>

      <h2>The test you should do right now</h2>

      <p>Before going further, run this 5-minute diagnostic. Open ChatGPT, Gemini, and Perplexity, then ask them these three questions:</p>

      <ul>
        <li><strong>The recommendation question</strong>: "What is the best [your service/product] in [your city/the US]?"</li>
        <li><strong>The expertise question</strong>: "How do I choose a [your service/product]?"</li>
        <li><strong>The direct question</strong>: "What does [your company name] do?"</li>
      </ul>

      <p>If your site does not appear in any of the answers, you have an AI visibility problem. If your competitors appear and you do not, the problem is urgent.</p>

      <p>Note the names that come up in the answers. These are your GEO competitors — and they are not necessarily the same as your SEO competitors.</p>

      <h2>Reason #1: your content is not extractable</h2>

      <p>This is the most common cause. AI engines look for answers that are ready to cite: a clear sentence, a sharp definition, a self-contained paragraph they can embed directly in their response.</p>

      <p>If your site starts with "Welcome to [company], leaders in innovation since 2005...", the AI has nothing to extract. It moves on to the next source.</p>

      <p><strong>The typical problem:</strong></p>

      <ul>
        <li>Homepages that are 100% promotional with no informational content</li>
        <li>Long introductions before getting to the point</li>
        <li>Vague text with no definitions or concrete information</li>
        <li>Content focused on "we" instead of answering customer questions</li>
      </ul>

      <p><strong>How to fix it:</strong></p>

      <p>Take your 5 most important pages. For each one, make sure the first 100 words contain a direct answer to the question your visitor is asking.</p>

      <p>Example for an accounting firm:</p>

      <pre><code>{`❌ "Our firm has been passionately serving clients for over 20 years with all their financial needs."

✅ "A CPA in New York helps small and mid-size businesses with accounting, tax filings, and financial planning. Here's how to choose the right one."`}</code></pre>

      <p>The second version is the one AI will cite.</p>

      <h2>Reason #2: you are blocking AI bots without knowing it</h2>

      <p>This is the simplest problem to diagnose — and the most absurd when you discover it. Many sites block AI crawlers in their <code>robots.txt</code> file without even realizing it.</p>

      <p><strong>Check now:</strong> go to <code>your-website.com/robots.txt</code> and look for these lines:</p>

      <pre><code>{`User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: PerplexityBot
Disallow: /`}</code></pre>

      <p>If these lines are present, you are explicitly forbidding ChatGPT, Claude, and Perplexity from accessing your content. They simply cannot read you.</p>

      <p><strong>How to fix it:</strong></p>

      <p>Remove these restrictions from your <code>robots.txt</code>. If you use WordPress, check that your SEO plugin (Yoast, Rank Math) has not added these blocks automatically.</p>

      <p>Go further by creating an <code>llms.txt</code> file at the root of your site. This file, specifically designed for AI crawlers, tells them which pages are most important and how your site is structured.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Full technical guide in llms.txt, robots.txt, and AI crawlability.</ArrowLink>

      <h2>Reason #3: no structured data</h2>

      <p>Structured data (Schema.org in JSON-LD) is the language that engines understand without ambiguity. Without it, the AI must guess what your page contains: are you a company or a blog? An article or a product page? A restaurant or a software tool?</p>

      <p>AI engines prefer sites that make their job easier. A site with properly implemented structured data has a significant advantage over one without markup.</p>

      <p><strong>Check now:</strong> go to Google's Rich Results Test and enter your URL. If the result shows "No rich results detected," you have no structured data.</p>

      <p><strong>How to fix it:</strong></p>

      <p>Implement these three schemas as a priority:</p>

      <ul>
        <li><code>Organization</code> on your homepage — states who you are, your logo, contact info, social profiles.</li>
        <li><code>FAQPage</code> on pages that contain Q&A — this is the most natural format for AI engines.</li>
        <li><code>Article</code> on your editorial content — specifies the author, date, and topic.</li>
      </ul>

      <p>JSON-LD format is added in your page source code without modifying the visible content.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Step-by-step implementation in Schema.org and AI: the practical guide to being understood by LLMs.</ArrowLink>

      <h2>Reason #4: no verifiable evidence</h2>

      <p>AI engines are designed to avoid propagating unverified information. If your site makes claims without proving them, it will be judged less reliable than a competitor that sources its assertions.</p>

      <p><strong>The typical problem:</strong></p>

      <ul>
        <li>"We have hundreds of satisfied clients" — how many exactly?</li>
        <li>"Our solution improves productivity" — by how much, measured how?</li>
        <li>"Experts recommend our approach" — which experts, in what publication?</li>
      </ul>

      <p><strong>How to fix it:</strong></p>

      <p>Review your key pages and replace every vague claim with concrete evidence:</p>

      <ul>
        <li><strong>Precise numbers</strong>: "312 companies served since 2019" rather than "hundreds of clients"</li>
        <li><strong>Named sources</strong>: "according to a 2025 McKinsey study" rather than "according to experts"</li>
        <li><strong>Measurable results</strong>: "+34% organic traffic in 4 months for [client]" rather than "significant results"</li>
        <li><strong>Dates</strong>: "updated March 2026" rather than "regularly updated"</li>
      </ul>

      <p>Every verifiable data point is a trust signal for AI engines.</p>

      <h2>Reason #5: your site does not exist outside of itself</h2>

      <p>AI engines cross-reference sources. When they evaluate a site's credibility, they look for external confirmation: is your brand mentioned elsewhere on the web? Do other sites cite you as a reference?</p>

      <p>If your company only exists on its own website — no press mentions, no forum profiles, no citations in third-party articles — the AI has no way to confirm your expertise.</p>

      <p><strong>How to fix it:</strong></p>

      <p>Build your external presence methodically:</p>

      <ul>
        <li><strong>Reddit</strong> — it is the #1 platform cited by LLMs in 2026. Identify 5-10 relevant subreddits for your industry. Answer questions with expertise and authenticity, without direct promotion. A single useful, well-sourced comment can be picked up by an AI.</li>
        <li><strong>Guest posts and industry press</strong> — pitch expert articles to trade publications in your field. Every article published on a third-party site that mentions your brand strengthens your authority in the eyes of AI.</li>
        <li><strong>Professional directories</strong> — register on recognized directories in your industry. These structured mentions are easily identifiable by AI crawlers.</li>
        <li><strong>Google Business Profile</strong> — even if you do not have a physical storefront, a verified profile with reviews strengthens your online credibility.</li>
      </ul>

      <p>The goal is not to be everywhere, but to have credible, consistent mentions on sources that AI engines recognize.</p>

      <h2>Reason #6: your content is outdated</h2>

      <p>AI engines favor recent content. If your last blog post is from 2023, if your pages mention "2024 trends," and if no update date is visible, the AI will consider your information unreliable.</p>

      <p>This is an especially common problem for businesses that invested in content a few years ago and never updated it.</p>

      <p><strong>How to fix it:</strong></p>

      <ul>
        <li><strong>Identify your high-potential pages</strong> — which pages drive traffic or cover topics critical to your business?</li>
        <li><strong>Update them</strong> — refresh the numbers, dates, and examples. Remove outdated references.</li>
        <li><strong>Display the update date</strong> — add a visible "Last updated: [date]" on each refreshed page.</li>
        <li><strong>Set up a schedule</strong> — update pillar pages quarterly, important articles monthly.</li>
      </ul>

      <p>A 2023 article updated in March 2026 with fresh data will be treated as recent content by AI engines.</p>

      <h2>The difference vs. "asking ChatGPT if my site is well optimized"</h2>

      <p>You might think: "Why not just ask ChatGPT if my site is well optimized?"</p>

      <p>The answer is simple: ChatGPT does not see your site the way a technical audit does. When you ask it the question, it gives you a generic opinion based on what it knows (or thinks it knows) about your URL. It does not scan the actual DOM, does not check your <code>robots.txt</code>, does not count your Schema.org tags, and does not measure the extractability of your content.</p>

      <p>An automated GEO audit does the opposite: it analyzes your page's actual source code, objectively measures each citation-worthiness criterion, and gives you a quantified score with recommendations prioritized by impact.</p>

      <p>It is the difference between asking a friend "does my resume look good?" and having it reviewed by a recruiter with a scoring rubric.</p>

      <h2>7-day action plan</h2>

      <p>If you want results fast, here is a day-by-day plan:</p>

      <ol>
        <li><strong>Day 1 — Diagnostic.</strong> Run the 3-question test (recommendation, expertise, direct name) on ChatGPT, Gemini, and Perplexity. Run a GEO audit on Detekia. Record your baseline score.</li>
        <li><strong>Day 2 — Crawlability.</strong> Check your <code>robots.txt</code>. Remove AI bot blocks. Create your <code>llms.txt</code> file.</li>
        <li><strong>Day 3 — Extractability.</strong> Rewrite the first 100 words of your 5 most important pages. Add a direct answer at the top of each page.</li>
        <li><strong>Day 4 — Structured data.</strong> Implement <code>Organization</code> on the homepage, <code>FAQPage</code> on your FAQ page, <code>Article</code> on your editorial content.</li>
        <li><strong>Day 5 — Evidence.</strong> Review your key pages. Replace every vague claim with a number, a source, or a concrete example.</li>
        <li><strong>Day 6 — Freshness.</strong> Update your 3 most important pieces of content. Add visible update dates.</li>
        <li><strong>Day 7 — External presence.</strong> Create a Reddit account and answer 3 relevant questions in your industry. Verify your Google Business Profile.</li>
      </ol>

      <p>After 7 days, run the audit again. You should see a measurable improvement in your score. The effects on AI citations will manifest in the following weeks.</p>

      <h2>Frequently asked questions</h2>

      <h3>Does paying for Google Ads help get cited by AI?</h3>

      <p>No. AI citations are independent of advertising. AI engines select their sources based on content quality criteria, not ad budget. This is actually an opportunity: a small site with excellent content can be cited as much as a large corporation.</p>

      <h3>My site ranks #1 on Google but is absent from ChatGPT. Why?</h3>

      <p>Ranking well in SEO is a necessary foundation, but not sufficient. AI engines add extra criteria: content extractability, structured data, AI bot crawlability, neutral tone. Your site can be optimized for Google without being optimized for generative engines.</p>

      <h3>How long before AI cites me?</h3>

      <p>Technical fixes (<code>robots.txt</code>, Schema.org) take effect in 2 to 4 weeks. Content improvements (extractability, evidence) are reflected in 4 to 8 weeks. Building external authority (mentions, Reddit) takes 2 to 3 months. The sooner you start, the sooner you will be visible.</p>

      <h3>Does this work for all industries?</h3>

      <p>Yes. Whether you are a consultant, e-commerce business, SaaS, contractor, or professional services firm, the citation-worthiness criteria are the same. What changes is the competitiveness: in an industry where few competitors are GEO-optimized, the gains are fast and significant.</p>

      <h2>Start by measuring</h2>

      <p>You cannot fix what you do not measure. The first step is knowing where you stand: what your GEO Score is, which criteria are failing, and where to begin.</p>

      <p>Analyze your site for free on Detekia — score out of 100, 8 criteria, recommendations prioritized by impact, in 30 seconds. No signup required.</p>
    </>
  );
}
