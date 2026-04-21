import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

export default function RedditGeoSourceIa() {
  return (
    <>
      <p>When ChatGPT or Perplexity look for a credible source to answer a question, they cite Reddit more than any other platform. This is not a coincidence: Reddit concentrates authentic discussions, real user reviews, and expert answers in specialized communities.</p>

      <p>For your GEO strategy, this is an underexploited lever. Being present and active on Reddit can boost your visibility in AI responses faster than any other channel — including your own blog.</p>

      <h2>Why AI engines love Reddit</h2>

      <h3>Content authenticity</h3>

      <p>LLMs are trained to detect promotional content and deprioritize it. Reddit is the opposite of marketing content: real people sharing real experiences, without corporate filters.</p>

      <p>When a user asks ChatGPT "which CRM should I pick for a startup," the AI values a Reddit thread where 15 people share their actual experience over a sponsored blog post that recommends the advertiser's CRM.</p>

      <h3>The native Q&A format</h3>

      <p>Reddit naturally operates as questions and answers. A user asks a question, the community responds, and the best answers rise through upvotes. This format is exactly what AI engines look for: natural questions with structured, community-validated answers.</p>

      <h3>Specialization by subreddit</h3>

      <p>Each subreddit is a community of experts on a specific topic. r/SEO brings together search professionals. r/startups gathers founders. r/ecommerce houses online retailers. This specialization gives Reddit content a topical authority that AI engines recognize.</p>

      <h3>Training data</h3>

      <p>Language models are partly trained on Reddit data (via agreements with Reddit Inc.). Reddit discussion patterns are therefore deeply embedded in how AI engines structure their responses. When an AI answers a question, it often reproduces a format that resembles a well-upvoted Reddit answer.</p>

      <h2>How Reddit impacts your GEO score</h2>

      <p>Reddit presence influences several criteria of the Detekia GEO score:</p>

      <ul>
        <li><strong>External presence (5 points)</strong> — active mentions on relevant subreddits directly strengthen this criterion. This is the most obvious one.</li>
        <li><strong>E-E-A-T authority (15 points)</strong> — when your brand is mentioned positively in Reddit discussions, AI engines perceive it as an entity recognized by peers. It is the GEO equivalent of word-of-mouth.</li>
        <li><strong>Verifiability (20 points)</strong> — Reddit discussions containing user feedback on your product/service create verifiable data that AI engines can cross-reference with your own site.</li>
      </ul>

      <p>In total, Reddit can influence up to 40 points out of 100 on your GEO score, directly or indirectly.</p>

      <h2>Reddit strategy for GEO — the hands-on guide</h2>

      <h3>Step 1 — Identify your target subreddits</h3>

      <p>Find the subreddits where your potential customers ask questions. Use Reddit search or Google with <code>site:reddit.com [your industry]</code>.</p>

      <p>For a B2B SaaS:</p>
      <ul>
        <li>r/SaaS, r/startups, r/Entrepreneur, r/smallbusiness</li>
        <li>Niche-specific subreddits (r/CRM, r/projectmanagement, r/marketing...)</li>
      </ul>

      <p>For e-commerce:</p>
      <ul>
        <li>r/ecommerce, r/shopify, r/FulfillmentByAmazon</li>
        <li>Niche subreddits related to your products</li>
      </ul>

      <p>For SEO/GEO:</p>
      <ul>
        <li>r/SEO, r/bigseo, r/digital_marketing, r/webdev</li>
        <li>r/marketing for broader digital strategy discussions</li>
      </ul>

      <p>For an agency or consultant:</p>
      <ul>
        <li>r/freelance, r/agency, r/marketing</li>
        <li>Industry subreddits where your clients hang out</li>
      </ul>

      <p>Aim for 5 to 10 active subreddits. Subscribe and observe the discussions for a week before you participate.</p>

      <h3>Step 2 — Build a credible profile</h3>

      <p>Your Reddit profile should not be a marketing account. It is a personal profile that showcases your expertise.</p>

      <p>What you need:</p>
      <ul>
        <li>A recognizable username (your first name or a professional handle, not "BrandSaaS_Official")</li>
        <li>A history of authentic participation (comment first, post later)</li>
        <li>Helpful answers across different subreddits</li>
        <li>Positive karma (proof that the community trusts you)</li>
      </ul>

      <p>What to avoid:</p>
      <ul>
        <li>An account created solely to promote your product</li>
        <li>A post history that consists entirely of links to your site</li>
        <li>Overtly promotional posts (Reddit detects and penalizes them)</li>
      </ul>

      <h3>Step 3 — Respond with expertise</h3>

      <p>This is the core of the strategy. Identify questions where you can provide an expert answer and reply in detail.</p>

      <p>Example of a strong response (for a GEO expert):</p>

      <pre><code>{`Question: "My site ranks well on Google but is invisible to ChatGPT. What should I do?"

Answer: "I've analyzed quite a few sites with this problem. In about 80% of cases,
it's a combination of 3 factors:
1) robots.txt is blocking GPTBot without the owner knowing — check
your robots.txt right now.
2) No Schema.org structured data — AI engines need to understand
who you are (Organization) and what you're talking about (Article, FAQPage).
3) The content isn't extractable — if your page starts with 'Welcome
to...' instead of answering a question, the AI moves on to the next source.
Start with points 1 and 2 — they're fixable in a day."`}</code></pre>

      <p>This response is useful, factual, non-promotional — and it will be picked up by AI engines when someone asks a similar question.</p>

      <h3>Step 4 — Mention your brand naturally (when relevant)</h3>

      <p>You can mention your product/service when it is directly relevant to the question AND you first provide a complete answer without any link.</p>

      <p><strong>Acceptable:</strong> "...the 3 factors I mentioned. For the diagnostic, you can use a GEO audit tool like Detekia (disclosure: it's my tool) or do the test manually by checking your robots.txt."</p>

      <p><strong>Not acceptable:</strong> "Use Detekia to analyze your site → link"</p>

      <p>The Reddit rule: provide value first, mention your product last, and be transparent about it (disclosure). The community respects honesty.</p>

      <h3>Step 5 — Create original content (posts)</h3>

      <p>Beyond answering questions, publish original posts that bring value to the community:</p>

      <p>Formats that work well on Reddit:</p>
      <ul>
        <li>Anonymized case studies: "I audited 50 e-commerce sites. Here are the 5 most common GEO mistakes."</li>
        <li>How-to guides: "How I got my site from zero to cited by ChatGPT in 6 weeks [step by step]"</li>
        <li>Original data: "Average GEO score by industry: e-commerce (34/100), SaaS (41/100), blogs (58/100)"</li>
        <li>AMA (Ask Me Anything): "I'm a GEO expert, AMA about AI visibility for websites"</li>
      </ul>

      <p>These posts generate discussions, upvotes, and become sources that AI engines will cite.</p>

      <h3>Step 6 — Maintain a regular presence</h3>

      <p>The key is consistency, not volume. A realistic pace:</p>
      <ul>
        <li>3-5 helpful comments per week in your target subreddits</li>
        <li>1 original post per month (case study, guide, data)</li>
        <li>Reply to comments on your posts within 24 hours</li>
      </ul>

      <p>This pace represents about 30-45 minutes per week. That is a modest investment for such a powerful lever.</p>

      <h2>Mistakes that kill your Reddit strategy</h2>

      <p><strong>Mistake 1 — Blatant self-promotion.</strong> Reddit has a deeply anti-marketing culture. A post that looks like an ad will be downvoted, removed, and your account potentially banned. The official rule: no more than 10% of your contributions should be self-promotional.</p>

      <p><strong>Mistake 2 — Posting without history.</strong> If your first post on a subreddit is a promotion for your product, it will be flagged immediately. Build a history of helpful contributions first (at least 2-3 weeks) before mentioning your product.</p>

      <p><strong>Mistake 3 — Ignoring subreddit rules.</strong> Every subreddit has its own rules. Read them before posting. Some ban links, others require a specific format, others have dedicated self-promotion days.</p>

      <p><strong>Mistake 4 — Being generic.</strong> Vague answers ("It's complicated, it depends on a lot of factors") add nothing and will not be picked up by AI engines. Be specific, give numbers, concrete steps, examples.</p>

      <p><strong>Mistake 5 — Giving up too soon.</strong> Results on Reddit take time. Your first posts might get only 3 upvotes. That is normal. Credibility is built over months, not days. AI engines cite Reddit discussions that have accumulated engagement over time.</p>

      <h2>Key US subreddits by industry</h2>

      <p>Here are the most impactful English-language subreddits by vertical, where AI engines actively pull source material:</p>
      <ul>
        <li><strong>r/Entrepreneur</strong> — general entrepreneurship, business strategy, growth tactics (2M+ members)</li>
        <li><strong>r/smallbusiness</strong> — small business operations, hiring, local marketing</li>
        <li><strong>r/marketing</strong> — digital marketing, SEO, paid media, brand strategy</li>
        <li><strong>r/personalfinance</strong> — personal finance, budgeting, investing advice</li>
        <li><strong>r/webdev</strong> — web development, frontend/backend, hosting, performance</li>
        <li><strong>r/SEO</strong> — search engine optimization, technical SEO, content strategy</li>
        <li><strong>r/startups</strong> — early-stage companies, fundraising, product-market fit</li>
        <li><strong>r/ecommerce</strong> — online retail, Shopify, Amazon FBA, logistics</li>
        <li><strong>r/SaaS</strong> — software-as-a-service products, pricing, churn, growth</li>
        <li><strong>r/digital_marketing</strong> — broader digital strategy, analytics, conversion optimization</li>
      </ul>

      <p>The English-language Reddit ecosystem is by far the largest source of training data for LLMs. Being active on these subreddits with high-quality GEO content can establish you as a recognized authority on the topic quickly. Because AI models are predominantly trained on English-language data, engagement in these communities has disproportionate impact on AI citations compared to smaller or non-English communities.</p>

      <h2>Measuring the impact of Reddit on your GEO</h2>

      <h3>Direct tracking</h3>
      <ul>
        <li>Search for your brand on Google with <code>site:reddit.com "your brand"</code>. Is the number of mentions growing?</li>
        <li>Are your posts receiving upvotes and comments? Karma is a proxy for engagement.</li>
        <li>Are AI engines citing you more often when you ask them questions about your sector? (Redo the citation test monthly.)</li>
      </ul>

      <h3>Indirect tracking</h3>
      <ul>
        <li>Is your Detekia GEO score on the "External presence" criterion improving?</li>
        <li>Are you getting traffic from Reddit in your analytics? (Even though it is not the primary goal, it is a signal.)</li>
        <li>Are users mentioning they discovered you through Reddit?</li>
      </ul>

      <h3>Timeline for results</h3>

      <p>The impact of Reddit on AI citations takes 8 to 12 weeks to materialize. AI engines recrawl Reddit regularly but integrate new data into their responses with a delay. Be patient and consistent.</p>

      <h2>Frequently asked questions</h2>

      <h3>Should I use a personal account or a company account?</h3>

      <p>A personal account with your real first name is more credible. Reddit values authenticity. An "OfficialBrand" account will be perceived as marketing. You can mention your role in your Reddit bio.</p>

      <h3>My industry does not have a dedicated subreddit. What should I do?</h3>

      <p>Look for adjacent subreddits. If you sell HR software, participate on r/humanresources, r/startups, r/smallbusiness. Questions about your domain exist — they are just spread across multiple communities.</p>

      <h3>Do older Reddit discussions still count?</h3>

      <p>Yes. AI engines index older Reddit threads and cite them regularly. A quality post from 6 months ago can be cited by ChatGPT today. It is a durable investment.</p>

      <h3>How much time per week should I dedicate?</h3>

      <p>30-45 minutes per week is enough for an effective presence: 3-5 helpful comments + 1 monthly post. Quality over quantity.</p>

      <ArrowLink href="/">Measure your current AI visibility before getting started — free GEO audit in 30 seconds →</ArrowLink>
    </>
  );
}
