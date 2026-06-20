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

export default function KpisGeoMesurerVisibiliteIAEN() {
  return (
    <>
      <p>GEO is a new discipline. And like any new discipline, the question "how do you measure results?" comes up fast. In SEO, you look at rankings, organic traffic, click-through rates. In GEO, these metrics don't work: there's no "position 1" in a ChatGPT response, and AI referral traffic is still hard to isolate in Google Analytics.</p>

      <p>Yet measuring is essential. Without KPIs, there's no way to know if your optimizations are working, justify the investment, or prioritize next actions. Here are the metrics that truly matter in GEO, how to measure them, and how often.</p>

      <h2>The 3 categories of GEO KPIs</h2>

      <p>GEO KPIs fall into three levels, from most actionable to most strategic:</p>

      <ol>
        <li><strong>Technical KPIs</strong> — what you directly control (site structure, schemas, content)</li>
        <li><strong>Citation KPIs</strong> — what AI engines do with your content (citations, mentions, presence rate)</li>
        <li><strong>Business KPIs</strong> — the impact on your activity (AI traffic, leads, conversions)</li>
      </ol>

      <p>The classic mistake is only looking at level 3 (traffic). But without levels 1 and 2, you have no action levers. A site can have AI traffic by chance; technical and citation KPIs tell you if it's sustainable.</p>

      <h2>Level 1: technical KPIs (what you control)</h2>

      <h3>Overall GEO score</h3>

      <p>The <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">GEO score</InternalLink> is the synthetic metric that summarizes your site's "citability." At Detekia, it's calculated out of 100 points from <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">7 deterministic criteria</InternalLink>:</p>

      <ul>
        <li>Citability and direct answer (25 pts)</li>
        <li>Verifiability and evidence (20 pts)</li>
        <li>Authority and E-E-A-T (15 pts)</li>
        <li>AI accessibility (10 pts)</li>
        <li>Editorial neutrality (10 pts)</li>
        <li>External presence (10 pts)</li>
        <li>Freshness and temporal signals (10 pts)</li>
      </ul>

      <p><strong>How to measure:</strong> automated GEO audit (Detekia, or manually by evaluating each criterion). <strong>Frequency:</strong> with every significant site change, and at least once per month.</p>

      <h3>Score per criterion</h3>

      <p>The overall score is useful for tracking, but it's the per-criterion scores that guide action. A site at 65/100 might have an excellent accessibility score (9/10) but a terrible freshness score (2/10). Without the criterion breakdown, you're optimizing blind.</p>

      <p><strong>How to measure:</strong> same GEO audit, with the 7 sub-score breakdown. <strong>Frequency:</strong> with every audit.</p>

      <h3>JSON-LD schema coverage</h3>

      <p>How many types of <InternalLink href="/blog/structured-data-avance-schemas-oublies">advanced schemas</InternalLink> does your site implement? Organization, Person, FAQPage, HowTo, Review, LocalBusiness, SpeakableSpecification — each added schema is an additional trust signal for AI engines.</p>

      <p><strong>How to measure:</strong> Google Rich Results Test page by page, or a crawler that detects schemas across the entire site. <strong>Target:</strong> at minimum Organization + Person + Article with dateModified. Ideal: 5+ schema types implemented.</p>

      <h3>AI bot access</h3>

      <p>GPTBot, ClaudeBot, PerplexityBot, Google-Extended — how many of these bots have access to your content? A single blocked bot can make you invisible on an entire AI engine.</p>

      <p><strong>How to measure:</strong> check your <InternalLink href="/blog/sitemap-robots-txt-bots-ia-2026">robots.txt</InternalLink> and server logs. <strong>Target:</strong> 4/4 bots allowed. <strong>Frequency:</strong> with every robots.txt change or security plugin installation.</p>

      <h2>Level 2: citation KPIs (what AI engines do with your content)</h2>

      <h3>AI citation rate</h3>

      <p>This is the central GEO KPI: across a set of queries relevant to your business, in what percentage of cases is your site cited in the AI response?</p>

      <p><strong>How to measure:</strong> test 20-30 queries representing your domain on ChatGPT, Perplexity, and Gemini. Count the number of times your site (or brand) is mentioned. Rate = mentions / total queries.</p>

      <p><strong>Frequency:</strong> once per month. AI responses vary day to day, so run the test over several days to smooth results.</p>

      <p><strong>Target:</strong> there's no universal benchmark. A 10-20% rate on generic queries is already good. On niche queries where your expertise is strong, aim for 30-50%.</p>

      <h3>AI share of voice vs competitors</h3>

      <p>Like in traditional SEO, share of voice measures your relative presence compared to your <InternalLink href="/blog/concurrents-chatgpt-visibilite">competitors</InternalLink>. On the same 20-30 queries, who gets cited most often?</p>

      <p><strong>How to measure:</strong> for each tested query, note the sites/brands cited in the AI response. Count mentions per competitor. Your share of voice = your mentions / total mentions.</p>

      <p><strong>Frequency:</strong> once per month, at the same time as the citation rate.</p>

      <h3>Citation quality</h3>

      <p>Not all citations are equal. Being mentioned in passing ("among the market players, we find...") doesn't have the same value as being cited as a primary source ("according to [your site], the recommended method is...").</p>

      <p>Classify your citations into 3 levels:</p>

      <ul>
        <li><strong>Source citation</strong>: your site is cited as a reference with a link or direct attribution</li>
        <li><strong>Brand mention</strong>: your brand/name is mentioned in the response</li>
        <li><strong>Indirect citation</strong>: your content is used without explicit attribution</li>
      </ul>

      <InlineCTA href="/pricing">Measure your AI citation rate across 30 queries</InlineCTA>

      <h2>Level 3: business KPIs (the real impact)</h2>

      <h3>AI referral traffic</h3>

      <p>Traffic from AI engines is measurable in Google Analytics, but you need to know where to find it. Typical referrers:</p>

      <ul>
        <li><code>chat.openai.com</code> or <code>chatgpt.com</code> — ChatGPT traffic</li>
        <li><code>perplexity.ai</code> — Perplexity traffic</li>
        <li><code>gemini.google.com</code> — Gemini traffic</li>
        <li><code>claude.ai</code> — Claude traffic</li>
        <li><code>copilot.microsoft.com</code> — Copilot/Bing traffic</li>
      </ul>

      <p><strong>How to measure:</strong> in Google Analytics 4, go to Reports → Acquisition → Traffic → Source/Medium. Filter by the domains above. You can also create a custom "AI Traffic" segment grouping all these referrers.</p>

      <p><strong>Warning:</strong> a large portion of AI traffic arrives without a referrer (users copy the URL given by the AI and paste it in their browser). Measurable AI traffic therefore underestimates actual traffic, sometimes by 50% or more.</p>

      <h3>AI traffic conversion rate</h3>

      <p>Does AI traffic convert better or worse than traditional organic traffic? This is a key question for justifying GEO investment. Generally, AI traffic converts better because users arrive with a more precise intent (they asked a specific question to the AI).</p>

      <p><strong>How to measure:</strong> in GA4, compare conversion rates of the "AI Traffic" segment vs "Google Organic Traffic."</p>

      <h3>Impact on leads and revenue</h3>

      <p>The ultimate KPI: how many leads or sales come directly or indirectly from AI visibility? This is hard to measure precisely because attribution is complex (a prospect might discover your site via ChatGPT, then return via Google, then convert via email).</p>

      <p>Approximation methods:</p>

      <ul>
        <li><strong>Post-conversion survey</strong>: "How did you hear about us?" with "AI response (ChatGPT, Perplexity...)" as an option</li>
        <li><strong>UTMs on cited links</strong>: if you can influence the links AI engines cite (via your sitemap or schemas), add UTMs</li>
        <li><strong>Temporal correlation</strong>: compare lead evolution with AI citation rate evolution</li>
      </ul>

      <h2>The ideal GEO dashboard</h2>

      <p>Here are the metrics to track monthly, grouped in a simple dashboard:</p>

      <table>
        <thead>
          <tr><th>KPI</th><th>Source</th><th>Frequency</th><th>Target</th></tr>
        </thead>
        <tbody>
          <tr><td>Overall GEO score</td><td>Detekia audit</td><td>Monthly</td><td>&gt;70/100</td></tr>
          <tr><td>Per-criterion scores (7)</td><td>Detekia audit</td><td>Monthly</td><td>None &lt;50%</td></tr>
          <tr><td>Schemas implemented</td><td>Rich Results Test</td><td>Quarterly</td><td>5+ types</td></tr>
          <tr><td>AI bots allowed</td><td>robots.txt</td><td>On change</td><td>4/4</td></tr>
          <tr><td>AI citation rate</td><td>30-query test</td><td>Monthly</td><td>&gt;15%</td></tr>
          <tr><td>Share of voice vs competitors</td><td>Comparative test</td><td>Monthly</td><td>Top 3</td></tr>
          <tr><td>AI referral traffic</td><td>GA4</td><td>Monthly</td><td>MoM growth</td></tr>
          <tr><td>AI traffic conversion</td><td>GA4</td><td>Monthly</td><td>&gt;organic traffic</td></tr>
        </tbody>
      </table>

      <h2>Pitfalls to avoid</h2>

      <ul>
        <li><strong>Don't confuse SEO ranking with AI citation.</strong> Being first on Google doesn't guarantee being cited by ChatGPT. The signals are different.</li>
        <li><strong>Don't measure just once.</strong> AI responses change daily. A one-time test is worthless — it's the trend over 3+ months that matters.</li>
        <li><strong>Don't ignore niche queries.</strong> Generic queries ("best CRM") are ultra-competitive. Your best opportunities are on niche queries where your expertise is unique.</li>
        <li><strong>Don't expect immediate results.</strong> GEO is a medium-term investment. First signals appear 4-8 weeks after optimizations.</li>
        <li><strong>Don't forget qualitative metrics.</strong> The raw citation rate doesn't tell the whole story. Being cited as "market leader" vs "one player among others" makes an enormous difference in perception.</li>
      </ul>

      <h2>How Detekia measures these KPIs</h2>

      <p>The <InternalLink href="/blog/audit-geo-visibilite-ia">Detekia GEO audit</InternalLink> covers levels 1 and 2 automatically:</p>

      <ul>
        <li><strong>GEO score across 7 criteria</strong>: deterministic, reproducible, comparable over time</li>
        <li><strong>AI citation test on 30 queries</strong>: citation rate, competitors cited, best opportunities</li>
        <li><strong>Schema detection</strong>: automatic inventory of JSON-LD schemas present</li>
        <li><strong>AI bot verification</strong>: accessibility test for GPTBot, ClaudeBot, PerplexityBot</li>
      </ul>

      <p>The Pro report (10 pages) adds a multi-page dimension: score per page, cross-page patterns, and a prioritized action plan to improve the weakest KPIs.</p>

      <h2>Conclusion</h2>

      <p>Measuring GEO isn't as simple as measuring SEO, but it's far from impossible. The GEO score provides an actionable baseline, the AI citation rate measures real impact, and referral traffic confirms business ROI. The key is to track these metrics over time — it's the trend that matters, not a snapshot.</p>

      <p>Start with a GEO audit to establish your baseline, then re-measure monthly. In 3 months, you'll have a clear picture of what's working and what still needs optimization.</p>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">GEO Score: how to measure your site's AI visibility</ArrowLink>

      <ArrowLink href="/blog/geo-guide-complet-2026">The complete GEO guide for 2026</ArrowLink>
    </>
  );
}
