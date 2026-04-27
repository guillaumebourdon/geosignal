import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

function GroupCard({ color, label, points, criteria, description, priority }) {
  return (
    <div style={{ border: `1px solid ${color}30`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: '20px 24px', marginBottom: 16, background: `${color}06` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#B0ABA5' }}>{points} pts max</span>
      </div>
      <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', margin: '0 0 8px', lineHeight: 1.5 }}><strong style={{ color: '#3A3835' }}>Criteria:</strong> {criteria}</p>
      <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', margin: '0 0 8px', lineHeight: 1.5 }}>{description}</p>
      <p style={{ fontFamily: 'monospace', fontSize: 10, color, margin: 0, letterSpacing: 1 }}>PRIORITY: {priority}</p>
    </div>
  );
}

export default function ScoreGeoMesurerVisibiliteIa() {
  return (
    <>
      <p>You cannot improve what you do not measure. And in GEO, measurement is the main obstacle. There is no Google Search Console for ChatGPT. No rank report in Perplexity. No click data from Gemini.</p>

      <p>Yet AI visibility can be measured. Not with the same tools or metrics as SEO, but with a structured approach that gives you a clear diagnostic and actionable priorities.</p>

      <p>This article explains what a GEO Score is, how it is calculated, how to interpret your results, and most importantly where to start to improve your visibility in AI answers.</p>

      <h2>Why measuring AI visibility is hard</h2>

      <p>In SEO, the measurement ecosystem is mature. Google Search Console tells you which queries lead to your site, which pages are indexed, what your CTR is. Tools like Ahrefs, Semrush, or Moz track your rankings daily.</p>

      <p>In GEO, none of that exists — for three fundamental reasons.</p>

      <p><strong>AI answers are dynamic.</strong> Unlike Google SERPs that are relatively stable, ChatGPT or Perplexity answers change with every query. Asking the same question twice can produce different answers, citing different sources. There is no fixed "position 1."</p>

      <p><strong>AI engines do not share their data.</strong> OpenAI, Google, and Anthropic do not provide an analytics console for site publishers. You cannot know how many times ChatGPT cited your site, or for which queries.</p>

      <p><strong>Citations are contextual.</strong> An AI may cite your site for one query and not for another very similar one. The citation depends on the conversation context, the question wording, and sometimes even the user's profile.</p>

      <p>Despite these challenges, two complementary approaches let you measure your AI visibility.</p>

      <h2>Approach 1: manual testing</h2>

      <p>This is the most direct method. It consists of querying AI engines the way a potential customer would, and observing whether your site appears in the answers.</p>

      <h3>How to proceed</h3>

      <p><strong>Step 1 — Define your target queries</strong></p>

      <p>List 10 to 15 questions your customers actually ask. Think in three categories:</p>

      <ul>
        <li><strong>Recommendation queries</strong>: "What is the best [service] in [city]?", "What solution for [problem]?"</li>
        <li><strong>Expertise queries</strong>: "How do I [do X]?", "What's the difference between [A] and [B]?"</li>
        <li><strong>Brand queries</strong>: "What does [your company] do?", "Reviews of [your product]"</li>
      </ul>

      <p><strong>Step 2 — Query 3 AI engines</strong></p>

      <p>Ask each question on ChatGPT, Gemini, and Perplexity. For each answer, note:</p>

      <ul>
        <li>Is your site cited as a source? (yes/no)</li>
        <li>Is your brand mentioned? (yes/no)</li>
        <li>Which competitors are cited?</li>
        <li>Does the answer reference content from your site?</li>
      </ul>

      <p><strong>Step 3 — Analyze the results</strong></p>

      <p>Calculate your presence rate: across your 10-15 queries x 3 engines, in what percentage of answers do you appear? Below 20%, you have a significant AI visibility problem.</p>

      <h3>Limitations of manual testing</h3>

      <p>This approach gives you a snapshot at a single point in time, not ongoing tracking. It is also subjective: results vary based on wording and context. It is a good starting point, but it is not enough to drive a GEO strategy.</p>

      <h2>Approach 2: technical audit</h2>

      <p>The technical audit analyzes your site on objective criteria that determine AI citation-worthiness. Unlike manual testing, it measures citation <em>potential</em> — the technical and editorial conditions that maximize your chances of being selected as a source.</p>

      <p>This is the approach Detekia uses: an automated audit that evaluates your site on 8 weighted criteria and assigns a score out of 100.</p>

      <h2>The 8 criteria of the Detekia GEO Score</h2>

      <p>Each criterion is measured by analyzing the actual DOM of your page — not by estimation or approximation.</p>

      <h3>1. Extractability & direct answer (25 points)</h3>

      <p>This criterion measures whether your content contains answers ready to be extracted by an AI. The analysis checks:</p>

      <ul>
        <li>The presence of a substantial introduction in the first 100 words</li>
        <li>Informational density of paragraphs (facts, figures, definitions vs. vague text)</li>
        <li>Use of lists and tables that structure information</li>
        <li>Presence of direct answers to the page's implicit questions</li>
      </ul>

      <p><strong>Typical score observed:</strong> most sites score between 8 and 15 out of 25. Sites with vague commercial introductions or homepages without informational content fall below 8.</p>

      <h3>2. Verifiability & evidence (20 points)</h3>

      <p>This criterion measures the density of verifiable evidence in your content: precise statistics and figures, named sources (studies, reports, institutions), reference dates, concrete examples and use cases.</p>

      <p><strong>Typical score observed:</strong> B2B sites with expert content score between 12 and 18. Sites with purely commercial messaging fall to 4-8.</p>

      <h3>3. Authority & E-E-A-T (15 points)</h3>

      <p>This criterion evaluates expertise and credibility signals: a complete About page with verifiable information, identified authors on content, complete legal pages, trust signals (certifications, client references, partner logos).</p>

      <p><strong>Typical score observed:</strong> 6 to 10 out of 15 for SMBs. Freelancers without an About page fall to 2-4. Companies with identified authors and a complete institutional page reach 12-15.</p>

      <h3>4. AI crawlability (15 points)</h3>

      <p>This criterion verifies whether AI bots can access your content:</p>

      <ul>
        <li>Analysis of the <code>robots.txt</code> file for AI user-agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)</li>
        <li>Presence of an <code>llms.txt</code> file</li>
        <li>Content accessibility without mandatory JavaScript</li>
        <li>Accessible XML sitemap</li>
      </ul>

      <p><strong>Typical score observed:</strong> highly variable. Sites blocking AI bots (often unknowingly) score 0 to 3. Those not blocking but without an <code>llms.txt</code> score 8-10. Fully optimized sites reach 13-15.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">To fix crawlability issues, read llms.txt, robots.txt, and AI crawlability.</ArrowLink>

      <h3>5. Structured data (10 points)</h3>

      <p>This criterion analyzes the presence and quality of Schema.org markup: <code>Organization</code> on the homepage, <code>Article</code> or <code>BlogPosting</code> on editorial content, <code>FAQPage</code> on Q&A pages, markup validity (no errors).</p>

      <p><strong>Typical score observed:</strong> 0 to 3 for sites without structured data (roughly 23% of the web). 5-7 for those with basic markup. 8-10 for sites with complete, valid markup.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Implementation guide in Schema.org and AI: the practical guide.</ArrowLink>

      <h3>6. Editorial neutrality (10 points)</h3>

      <p>This criterion evaluates your content's tone — analyzed by AI: absence of unsourced superlatives ("the best," "the leader," "unmatched"), factual and informative tone rather than promotional, presence of balanced comparisons, absence of emotional manipulation.</p>

      <p><strong>Typical score observed:</strong> 4 to 7 for most sites. Sites with a very commercial tone fall to 2-3. Editorial and technical sites reach 8-10.</p>

      <h3>7. External presence (5 points)</h3>

      <p>This criterion evaluates your visibility outside your own site: mentions on third-party sites (press, forums, directories), active profiles on recognized platforms (LinkedIn, Reddit), citations in other publishers' content.</p>

      <p><strong>Typical score observed:</strong> 1 to 3 for SMBs and startups. Companies with an active PR strategy reach 4-5.</p>

      <h3>8. Freshness & maintenance (5 points)</h3>

      <p>This criterion checks how current your content is: visible last-modified date, update frequency, absence of obsolete content (expired dates, old stats).</p>

      <p><strong>Typical score observed:</strong> 2 to 3 for sites updated regularly. 0-1 for sites whose last content is over a year old.</p>

      <h2>How to interpret your score</h2>

      <h3>Thresholds</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '24px 0' }}>
        {[
          { range: '75 – 100', label: 'Excellent', color: '#10A37F', text: 'Your site is well-positioned to be cited by AI engines. Focus on criteria that are not yet maxed out and on tracking over time.' },
          { range: '45 – 74', label: 'Average', color: '#C9861A', text: 'You have foundations, but significant gaps prevent your site from being cited regularly. Identify the 2-3 weakest criteria and fix them first.' },
          { range: '0 – 44', label: 'Low', color: '#D97757', text: 'Your site has little chance of being cited by AI in its current state. Structural corrections are needed. The good news: the margin for improvement is large and early gains will be fast.' },
        ].map(({ range, label, color, text }) => (
          <div key={range} style={{ border: `1px solid ${color}30`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: '16px 20px', background: `${color}06` }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, color, fontWeight: 600 }}>{range}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color, letterSpacing: 2, textTransform: 'uppercase' }}>{label}</span>
            </div>
            <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', margin: 0, lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}
      </div>

      <h3>The average score observed</h3>

      <p>Across all sites analyzed by Detekia, the average score is around <strong>38/100</strong>. Most sites are not at all optimized for generative engines. That is bad news for them, but good news for you: by optimizing now, you gain a considerable head start over your competitors.</p>

      <h3>The most commonly failing criterion</h3>

      <p>Extractability is the criterion most frequently under-optimized. Most sites have content, but that content is not structured to be extracted and cited by an AI. It is also the heaviest criterion (25 points) — meaning it offers the biggest potential gains.</p>

      <h2>How to read the thematic groups</h2>

      <p>Detekia organizes the 8 criteria into 3 thematic groups that make reading and prioritization easier:</p>

      <GroupCard
        color="#4285F4"
        label="AI Readability"
        points={50}
        criteria="Extractability + Crawlability + Structured data"
        description="This group measures whether AI engines can access your content and understand it. This is the technical baseline. If this group is weak, AI cannot cite you — even if your content is excellent."
        priority="High — fixes are often quick (robots.txt, Schema.org, intro restructuring)"
      />

      <GroupCard
        color="#10A37F"
        label="Credibility"
        points={45}
        criteria="Verifiability + Authority + Neutrality + External presence"
        description="This group measures whether AI engines trust your content. Even if they can read it, they will not cite it if it is not perceived as credible."
        priority="Medium — requires more work (sourcing claims, building external presence, adjusting tone)"
      />

      <GroupCard
        color="#C9861A"
        label="Freshness"
        points={5}
        criteria="Freshness & maintenance"
        description="This group measures whether your content is current and maintained. It is a weak but constant signal: AI engines favor recent content."
        priority="Ongoing — not a one-time project but a regular discipline"
      />

      <h2>Prioritize your actions by impact</h2>

      <p>Not all criteria carry the same weight, and not all fixes have the same effort-to-impact ratio. Here is how to prioritize:</p>

      <h3>Immediate-impact actions (this week)</h3>

      <ul>
        <li><strong>Unblock AI crawlers</strong> — if your <code>robots.txt</code> blocks GPTBot or ClaudeBot, you go from 0 to potentially 12-15 points in crawlability just by removing a few lines. Effort: 15 minutes. Impact: up to +15 points.</li>
        <li><strong>Rewrite introductions on your key pages</strong> — add a direct answer in the first 100 words of your 5 main pages. Effort: 1-2 hours. Impact: up to +10 points in extractability.</li>
        <li><strong>Add Schema Organization</strong> — a single JSON-LD block on your homepage. Effort: 30 minutes. Impact: +2-3 points in structured data.</li>
      </ul>

      <h3>Medium-term impact actions (this month)</h3>

      <ul>
        <li><strong>Source your claims</strong> — review your key pages and replace every vague assertion with evidence. Effort: half a day. Impact: up to +8 points in verifiability.</li>
        <li><strong>Complete your structured data</strong> — add <code>Article</code> on your editorial content and <code>FAQPage</code> on your FAQ pages. Effort: 2-3 hours. Impact: +4-6 points in structured data.</li>
        <li><strong>Create or complete your About page</strong> — photo, bio, background, expertise, contact info. Effort: 2 hours. Impact: +3-5 points in authority.</li>
      </ul>

      <h3>Long-term impact actions (this quarter)</h3>

      <ul>
        <li><strong>Build your external presence</strong> — Reddit, industry press, guest posts. Effort: ongoing. Impact: +2-4 points in external presence, plus indirect effects on authority.</li>
        <li><strong>Adjust editorial tone</strong> — rewrite overly commercial content in a factual, expert tone. Effort: varies. Impact: +3-5 points in neutrality.</li>
      </ul>

      <h2>Track progress over time</h2>

      <p>A single score is useful for diagnostics. But tracking over time is what lets you steer a GEO strategy.</p>

      <h3>What to track</h3>

      <ul>
        <li>Overall score — is it increasing after each optimization wave?</li>
        <li>Per-criterion scores — which criterion is progressing, which is stalling?</li>
        <li>Score vs. competitors — analyze your competitors' sites on Detekia to benchmark yourself</li>
        <li>Manual test results — redo the 3-question test (recommendation, expertise, brand) every month</li>
      </ul>

      <h3>Recommended frequency</h3>

      <ul>
        <li><strong>Technical audit</strong>: after each optimization wave, then monthly</li>
        <li><strong>Manual test</strong>: monthly on your top 5 queries</li>
        <li><strong>Editorial review</strong>: quarterly for content updates</li>
      </ul>

      <h3>Correlations to observe</h3>

      <p>After a technical optimization (<code>robots.txt</code>, Schema.org), check the manual test 2-4 weeks later. You should see an improvement in your presence in AI answers.</p>

      <p>After a content optimization (extractability, verifiability), allow 4-8 weeks before seeing an impact on citations.</p>

      <p>After external presence work (Reddit, press), allow 8-12 weeks. This is the slowest lever but also the most durable.</p>

      <h2>What the score does not measure</h2>

      <p>The GEO Score is an indicator of potential, not a guarantee of citation. A few important nuances:</p>

      <p><strong>The score does not predict exact queries.</strong> A good score means your site meets the technical and editorial conditions for being cited. But AI engines decide case by case for each query. A score of 85/100 does not mean you will be cited in 85% of answers.</p>

      <p><strong>The score does not measure topical relevance.</strong> If your site is perfectly optimized technically but your content does not address the topic a user is asking about, the AI will not cite you. GEO optimizes the conditions for citation, not content relevance.</p>

      <p><strong>The score evolves with the market.</strong> A score of 60/100 can be excellent in an industry where the average is 25, and insufficient in an industry where your competitors are at 75. Always interpret your score in context.</p>

      <h2>Frequently asked questions</h2>

      <h3>Does a good GEO Score guarantee being cited by AI?</h3>

      <p>No. The score measures citation potential — the conditions your site meets for being selected as a source. AI engines remain unpredictable in their selection. But a site at 80/100 statistically has far better chances of being cited than a site at 30/100.</p>

      <h3>What score should I aim for?</h3>

      <p>Above 65/100, you are in a very strong position relative to the market (average score: 38/100). Above 80/100, your site is in the top 5% for AI citation-worthiness. The goal is not 100/100 but to be significantly above your competitors.</p>

      <h3>Does the score change if I do nothing?</h3>

      <p>It can decline, yes. If your competitors optimize and you do not, your relative position degrades. And if your content ages without updates, the freshness criterion will naturally decrease.</p>

      <h3>Can I compare my score to my competitors'?</h3>

      <p>Yes. Run a Detekia audit on the sites of your 3-5 main competitors. Compare overall scores and per-criterion scores. This tells you exactly where you lag behind — and where you have an edge.</p>

      <h3>How do I go from 30 to 60/100?</h3>

      <p>The three most impactful actions: 1) unblock AI crawlers in <code>robots.txt</code> (+10-15 potential pts), 2) rewrite introductions to make them extractable (+8-12 pts), 3) add <code>Organization</code> + <code>FAQPage</code> structured data (+5-8 pts). In one focused week of work, a gain of 25-30 points is realistic.</p>

      <h2>Run your audit</h2>

      <p>The first step is knowing your current score. No guessing, no gut feeling — an objective measurement across 8 GEO criteria.</p>

      <p>Analyze your site for free on Detekia — score out of 100, 8 detailed criteria, recommendations prioritized by impact. In under 60 seconds, no signup required.</p>
    </>
  );
}
