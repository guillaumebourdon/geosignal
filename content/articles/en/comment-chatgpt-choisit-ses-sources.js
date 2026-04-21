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

export default function CommentChatgptChoisitSesSources() {
  return (
    <>
      <p>When you ask ChatGPT a question, it doesn't type your query into Google. It doesn't browse a live web index in real time either. It uses a process called <strong>RAG</strong> (Retrieval-Augmented Generation): a mechanism that selects relevant sources, injects them into its context, then generates a synthetic response based on those sources.</p>

      <p>Understanding this mechanism is the key to getting cited. If you don't know how ChatGPT selects its sources, you're optimizing blind. This article breaks down the complete process: the bots, the search engine used, the selection criteria, what gets ignored, and the concrete levers to show up in its responses.</p>

      <h2>How ChatGPT Search works: three bots, three roles</h2>

      <p>OpenAI uses three distinct bots to feed ChatGPT with web data. Each has a specific role, and confusing them is a common mistake.</p>

      <p><strong>GPTBot</strong> (user-agent: <code>GPTBot</code>) is the training crawler. It browses the web to collect data for model training. If you block it in your <code>robots.txt</code>, your content won't be integrated into future GPT versions. But this doesn't affect real-time responses.</p>

      <p><strong>ChatGPT-User</strong> (user-agent: <code>ChatGPT-User</code>) is the real-time browsing bot. When a user asks a question and ChatGPT decides to search the web, ChatGPT-User performs the queries. Blocking this bot means ChatGPT can never cite your site in web-sourced responses.</p>

      <p><strong>OAI-SearchBot</strong> (user-agent: <code>OAI-SearchBot</code>) is the most recent. Introduced in late 2024, it's dedicated specifically to ChatGPT Search and works similarly to ChatGPT-User but with crawl patterns optimized for content extraction.</p>

      <p>The trap: according to an SE Ranking study (2025), <strong>73% of websites block at least one of these bots without knowing it</strong>, often through overly restrictive <code>robots.txt</code> rules inherited from old configurations. A simple <code>Disallow: /</code> applied to all bots is enough to make you invisible.</p>

      <ArrowLink href="/blog/sites-bloquent-bots-ia">73% of websites block AI bots without knowing it: check yours</ArrowLink>

      <h2>The role of Bing: the search engine nobody optimizes for</h2>

      <p>Here's the information most GEO guides overlook: <strong>ChatGPT uses Bing as its search engine, not Google</strong>.</p>

      <p>When ChatGPT Search activates a web search, the query is sent to the Bing API. Results are then filtered, reordered, and synthesized by the model. In practice, this means your Google ranking has <strong>zero direct impact</strong> on your ChatGPT visibility.</p>

      <p>The implications are significant:</p>

      <ul>
        <li><strong>Bing Webmaster Tools</strong> becomes a strategic tool. If your site isn't properly indexed on Bing, ChatGPT won't see it.</li>
        <li><strong>IndexNow</strong>, the instant submission protocol supported by Bing (but not Google), lets you signal new pages in real time.</li>
        <li><strong>Bing's ranking criteria</strong> differ from Google's: Bing gives more weight to social signals, structured data, and content freshness (source: Ahrefs 2025).</li>
      </ul>

      <p>In practice, a site ranking very well on Google but absent from Bing will be invisible to ChatGPT. And conversely: a mediocre Google site that's well-indexed on Bing can be cited regularly.</p>

      <InlineCTA href="/">Is your website visible to ChatGPT? Check your GEO score in 30 seconds.</InlineCTA>

      <h2>Source selection criteria: what the research tells us</h2>

      <p>Several academic studies and SEO analyses have measured the factors that influence ChatGPT citation. Here are the most significant findings.</p>

      <h3>Domain authority: the dominant factor</h3>

      <p>According to the SE Ranking study (2025) covering 10,000 ChatGPT queries with sources, domain authority is the strongest predictor of citation, with a <strong>SHAP score of 0.63</strong> (on a scale where 1.0 = perfect correlation). No other factor comes close. Domains with high authority (DA &gt; 70) are cited 3.8x more often than weak domains (DA &lt; 30).</p>

      <p>This doesn't mean small sites have no chance. But it does mean that to compensate for an authority deficit, you need to excel on every other criterion.</p>

      <h3>Content length: a clear signal</h3>

      <p>The data shows a direct correlation between length and citation. Pages with <strong>more than 2,900 words average 5.1 citations</strong> in ChatGPT responses, versus <strong>3.2 for pages under 800 words</strong> (source: SE Ranking 2025). The logic is straightforward: longer content offers more extractable passages and covers more sub-questions the model might ask.</p>

      <p>Caveat: this isn't about artificially inflating your word count. ChatGPT values <strong>information density</strong>. A 3,000-word article filled with generalities will be cited less than a 1,500-word article containing original data and verifiable analysis.</p>

      <h3>Content freshness</h3>

      <p>ChatGPT favors recent content, particularly for queries related to news or trends. An article updated in the last 30 days has significantly more chances of being cited than content older than 6 months. Bing, the underlying engine, uses last-modified date as a ranking signal (source: Growth Memo 2026).</p>

      <h3>Verifiable sources</h3>

      <p>Content that cites its own sources (studies, hard data, academic references) is favored. The Princeton and Georgia Tech study (KDD 2024) on generative engines showed that adding <strong>citations and statistics increases visibility by 30 to 40%</strong> in AI responses. ChatGPT can verify the consistency of claims by cross-referencing sources — self-referential content without external proof will rank lower.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">The complete GEO guide for 2026: strategy, criteria and action plan</ArrowLink>

      <h2>What ChatGPT ignores (and what doesn't work)</h2>

      <p>Just as important as knowing what works: understanding what doesn't. Several commonly recommended practices have zero measurable impact on ChatGPT citation.</p>

      <h3>Keyword stuffing</h3>

      <p>Unlike traditional search engines, ChatGPT doesn't rank pages by keyword density. It understands <strong>semantic meaning</strong>. Repeating "best GEO tool" 47 times on your page won't get you cited more — and could actually be interpreted as a low editorial quality signal.</p>

      <h3>Promotional content</h3>

      <p>Purely commercial product pages ("Our solution is the best on the market") are rarely cited. ChatGPT favors informative and educational content. A page that explains <strong>how to solve a problem</strong> will always be cited before a page that explains why to buy your product.</p>

      <h3>The llms.txt file</h3>

      <p>Contrary to a popular belief circulating since late 2024, the <code>llms.txt</code> file (placed at the site root to "guide" LLMs) <strong>has no proven impact</strong> on ChatGPT citation. The SE Ranking study (2025) found no significant correlation between the presence of an <code>llms.txt</code> and citation frequency. ChatGPT doesn't read it systematically and doesn't use it as a ranking signal.</p>

      <p>This doesn't mean you should delete it if you already have one — it may help with other AI models. But investing time optimizing it at the expense of other criteria is a prioritization error.</p>

      <h2>Platforms that boost your visibility</h2>

      <p>One of the most striking findings from recent studies concerns the role of <strong>third-party platforms</strong> in ChatGPT citation. Your site isn't evaluated in isolation — ChatGPT cross-references your presence across the entire web.</p>

      <h3>Reddit and Quora: preferred sources</h3>

      <p>Reddit is the most-cited external platform by ChatGPT, across all categories. When a user asks "which tool should I use for X," ChatGPT frequently cites Reddit threads where that tool is mentioned and recommended by users. Organic Reddit discussions serve as a <strong>social validation signal</strong> that ChatGPT interprets as a reliability indicator.</p>

      <p>Quora plays a similar role, particularly for queries in question-and-answer format.</p>

      <ArrowLink href="/blog/reddit-geo-source-ia">Reddit has become AI's #1 source: how to leverage it</ArrowLink>

      <h3>Review platforms: a citation multiplier</h3>

      <p>The data is clear: domains present on <strong>multiple review platforms</strong> (G2, Trustpilot, Capterra, Google Reviews) average <strong>4.6 to 6.3 citations</strong> in ChatGPT responses, compared to only <strong>1.8 for domains absent</strong> from these platforms (source: SE Ranking 2025).</p>

      <p>The explanation is twofold. First, reviews constitute third-party verifiable content — exactly what ChatGPT looks for to support its recommendations. Second, presence on these platforms strengthens perceived domain authority in the Bing index.</p>

      <p>Concrete actions:</p>

      <ul>
        <li>Create and maintain profiles on <strong>G2, Trustpilot, and Capterra</strong> (for B2B) or <strong>Google Reviews and Yelp</strong> (for B2C)</li>
        <li>Actively solicit customer reviews — a minimum of <strong>10 recent reviews</strong> seems necessary for impact</li>
        <li>Respond to reviews (positive and negative) — profile activity is an additional signal</li>
        <li>Integrate reviews on your site with the <code>AggregateRating</code> schema so ChatGPT can read them directly</li>
      </ul>

      <InlineCTA href="/">Detekia measures your external presence and structured data — test your site for free.</InlineCTA>

      <h2>How to check if ChatGPT knows you</h2>

      <p>Before optimizing, you need to measure. Here are two complementary methods to assess your current visibility.</p>

      <h3>Manual testing</h3>

      <p>Open ChatGPT (GPT-4 model with web browsing enabled) and run queries your customers would ask. For example:</p>

      <ul>
        <li>"What's the best [your category] in [your city/the US]?"</li>
        <li>"[Your brand] reviews" — does ChatGPT know you?</li>
        <li>"[Your industry] comparison 2026"</li>
        <li>A technical deep-dive question in your area of expertise</li>
      </ul>

      <p>Note whether your site is cited, whether competitors are, and whether the information is accurate. Repeat on Perplexity and Gemini for a complete picture.</p>

      <h3>Automated analysis with Detekia</h3>

      <p>Manual testing provides qualitative insight, but it's not reproducible and only covers a sample of queries. <InternalLink href="/">Detekia</InternalLink> automates the diagnosis by analyzing your site across the 8 GEO criteria: content extractability, information verifiability, E-E-A-T authority, AI crawlability, structured data, editorial neutrality, external presence, and freshness.</p>

      <p>The score out of 100 gives you an objective, time-comparable measure. Prioritized recommendations tell you exactly what to fix first to maximize your impact.</p>

      <ArrowLink href="/blog/pourquoi-chatgpt-ne-cite-pas-votre-site">Why ChatGPT doesn't cite your website (and how to fix it)</ArrowLink>

      <h2>Key takeaways</h2>

      <p>ChatGPT doesn't work like Google. Its source selection process relies on Bing, domain authority, content quality and length, verifiable data, and your footprint on third-party platforms. Keyword stuffing, promotional content, and the <code>llms.txt</code> file have no significant impact.</p>

      <p>The three most effective actions, in priority order:</p>

      <ol>
        <li><strong>Make sure your AI bots aren't blocked</strong> — this is the absolute prerequisite</li>
        <li><strong>Produce long, factual, sourced content</strong> — aim for 2,000+ words with verifiable data</li>
        <li><strong>Build your external presence</strong> — Reddit, review platforms, press mentions</li>
      </ol>

      <p>GEO isn't a trend. It's a structural shift in how users access information. Websites that adapt now will have a considerable advantage over those that wait until the phenomenon becomes impossible to ignore.</p>
    </>
  );
}
