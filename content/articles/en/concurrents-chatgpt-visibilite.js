import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

export default function ConcurrentsChattgptVisibilite() {
  return (
    <>
      <p>You asked ChatGPT for a recommendation in your industry. Your competitor's name came up. Yours did not. That is frustrating — and more importantly, it is a business alarm signal.</p>

      <p>When an AI recommends a competitor to a prospect searching for your type of service, that prospect will likely never visit your site. They trust the AI, click the competitor's link, and buy. An AI-referred visitor converts 4.4x better than a standard organic visitor. Every recommendation you miss is a lost sale.</p>

      <p>But this situation is not permanent. Your competitors are not cited because they are "better" — they are cited because their content is better structured for AI engines. And that is something you can fix.</p>

      <h2>Why AI cites your competitor and not you</h2>

      <p>AI engines do not cite the brands they "prefer." They cite the sources whose content best meets their selection criteria. Understanding why your competitor is cited is the first step toward dethroning them.</p>

      <h3>They answer questions directly</h3>

      <p>Your competitor probably has a website that starts by answering the questions customers ask, instead of talking about itself.</p>

      <p>Compare the opening lines of your respective sites. If theirs says "A CRM is a customer relationship management tool that helps you..." and yours says "Welcome to [company], we've been helping businesses for 15 years...", the AI has only one choice.</p>

      <h3>They have structured content</h3>

      <p>FAQs, buying guides, comparison pages, blog posts with descriptive subheadings — your competitor may have invested in informational content that AI engines can easily parse and extract.</p>

      <h3>They have not blocked AI bots</h3>

      <p>Your competitor may simply have a robots.txt that allows GPTBot, ClaudeBot, and PerplexityBot. If yours blocks them (often unknowingly), you are invisible by design.</p>

      <h3>They are mentioned elsewhere on the web</h3>

      <p>If your competitor is active on Reddit, cited in press articles, listed on industry directories — AI engines cross-reference those mentions and reinforce their credibility. Your site may be excellent, but if it only exists on its own domain, the AI has no external confirmation of its reliability.</p>

      <h3>They have structured data</h3>

      <p>A complete Organization schema, Article schemas with identified authors, marked-up FAQPage — these signals help AI engines understand who they are and what they offer. Without them, the AI has to guess.</p>

      <h2>Competitive GEO analysis — 4-step method</h2>

      <h3>Step 1 — Identify your GEO competitors</h3>

      <p>Your GEO competitors are not necessarily your usual business competitors. Ask ChatGPT, Gemini, and Perplexity these questions:</p>
      <ul>
        <li>"What's the best [your service] in [your area]?"</li>
        <li>"Recommend a [your product type] for [your clients' need]"</li>
        <li>"How do I choose a [your industry]?"</li>
      </ul>

      <p>Write down every name that is cited. These are your GEO competitors — the ones capturing AI recommendations instead of you.</p>

      <p>You might be surprised: some GEO competitors are niche blogs, comparison sites, or forums — not direct business competitors in the traditional sense.</p>

      <h3>Step 2 — Audit their sites</h3>

      <p>For each GEO competitor identified, run an audit on Detekia. Compare their overall score and per-criterion scores with yours.</p>

      <p>Look for significant gaps:</p>
      <ul>
        <li>Their citability is at 20/25 and yours is at 8/25? That is probably the deciding factor.</li>
        <li>Their structured data score is at 9/10 and yours is at 0/10? You have an obvious quick win.</li>
        <li>Their neutrality is at 9/10 and yours is at 3/10? Your tone is too commercial.</li>
      </ul>

      <h3>Step 3 — Manually analyze their content</h3>

      <p>Beyond the automated score, visit their sites and analyze:</p>
      <ul>
        <li><strong>Their homepage</strong> — does it start with a direct answer to what they do? Or with a marketing catchphrase?</li>
        <li><strong>Their blog</strong> — do they have in-depth articles on questions your clients ask? Are they well-structured (descriptive H2s, lists, hard data)?</li>
        <li><strong>Their FAQ</strong> — do they have a rich FAQ section marked up with FAQPage schema?</li>
        <li><strong>Their robots.txt</strong> — go to <code>competitor.com/robots.txt</code>. Is GPTBot allowed?</li>
        <li><strong>Their structured data</strong> — test their URL on Google's Rich Results Test. Which schemas have they implemented?</li>
      </ul>

      <h3>Step 4 — Identify your quick wins</h3>

      <p>Cross-reference your audit with the competitive analysis. The criteria where your competitor significantly outperforms you AND that are fast to fix are your quick wins.</p>

      <p>Typically, the most common quick wins:</p>
      <ul>
        <li>Unblock AI crawlers — if your robots.txt blocks them, it is 15 minutes of work for a major impact</li>
        <li>Add structured data — Organization + FAQPage in a few hours</li>
        <li>Rewrite your introductions — make the first 100 words extractable</li>
      </ul>

      <ArrowLink href="/blog/audit-geo-visibilite-ia">GEO audit: analyze your AI visibility step by step →</ArrowLink>

      <h2>The 30-day reconquest plan</h2>

      <h3>Week 1 — Technical fixes (impact: 2-4 weeks)</h3>

      <p><strong>Days 1-2: Crawlability</strong><br />
      Check and fix your robots.txt. Create an llms.txt file. Verify your sitemap. These fixes are the fastest and have the most immediate impact.</p>

      <p><strong>Days 3-4: Structured data</strong><br />
      Implement Organization (homepage), Article (blog), FAQPage (FAQ). Test with the Rich Results Test. If your competitor has these schemas and you do not, this is probably one of the main factors behind the gap.</p>

      <p><strong>Day 5: Baseline audit</strong><br />
      Run a Detekia audit on your site and on your competitor's. Document the scores. This is your baseline for measuring progress.</p>

      <h3>Week 2 — Citability (impact: 4-8 weeks)</h3>

      <p><strong>Days 6-8: Rewrite introductions</strong><br />
      Take your 10 most important pages. For each one, rewrite the first 100 words so they contain a direct answer to the page's implicit question.</p>

      <p>Method: for each page, ask yourself "What question would a user ask ChatGPT to land on this page?" Then answer that question in the first paragraph.</p>

      <p><strong>Days 9-10: Add FAQs</strong><br />
      On your key pages (product, service, homepage), add a FAQ section with 5-7 questions your clients actually ask. Mark it up with FAQPage schema.</p>

      <p>FAQs are the most naturally extractable format for AI engines. If your competitor has them and you do not, that is a major handicap.</p>

      <h3>Week 3 — Credibility (impact: 4-12 weeks)</h3>

      <p><strong>Days 11-13: Source your claims</strong><br />
      Go through your key pages. Every important claim needs to be backed by evidence: a number, a source, an example, a date. Replace vague with specific.</p>

      <p><strong>Days 14-15: About page</strong><br />
      Create or complete your About page: founder photo, background, expertise, contact details. If your competitor has a credible About page and you have a generic "Our passionate team" blurb, the authority gap is obvious.</p>

      <h3>Week 4 — External presence (impact: 8-12 weeks)</h3>

      <p><strong>Days 16-20: Reddit</strong><br />
      Create a Reddit profile. Identify 5 relevant subreddits. Start answering questions with expertise. 3-5 helpful responses per week.</p>

      <p><strong>Days 21-25: Other sources</strong><br />
      Complete your Google Business Profile. Pitch a guest article to an industry publication. Register on professional directories in your sector.</p>

      <p><strong>Days 26-30: Measurement</strong><br />
      Rerun the Detekia audit. Redo the citation test on ChatGPT, Gemini, Perplexity. Compare with your baseline.</p>

      <ArrowLink href="/blog/reddit-geo-source-ia">Reddit and GEO: why Reddit is the #1 source cited by AI engines →</ArrowLink>

      <h2>Traps to avoid</h2>

      <p><strong>Trap 1 — Copying the competitor's content.</strong> If your competitor is cited because they have an excellent buying guide, do not copy their guide. Create content that covers the same topic but with your angle, your data, your expertise. AI engines detect duplicate content and deprioritize it.</p>

      <p><strong>Trap 2 — Ignoring SEO in favor of GEO.</strong> Google AI Overviews cite sources from the organic top 10. If you do not rank well in SEO, you will not be considered for AI Overviews — even with a perfectly GEO-optimized site. SEO remains the foundation.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO: what are the differences in 2026 →</ArrowLink>

      <p><strong>Trap 3 — Trying to do everything at once.</strong> The 30-day plan is sequenced for a reason: technical fixes (week 1) take effect in 2-4 weeks, citability (week 2) in 4-8 weeks, credibility and external presence (weeks 3-4) in 8-12 weeks. Follow this sequence to see measurable progress at each stage.</p>

      <p><strong>Trap 4 — Measuring too early.</strong> Do not redo the citation test after 3 days expecting changes. Technical fixes take 2-4 weeks to be picked up by AI crawlers. Content improvements take 4-8 weeks. Measure at day 30, not before.</p>

      <p><strong>Trap 5 — Prioritizing quantity over quality.</strong> Publishing 20 mediocre articles will not help. A single exhaustive, well-structured, sourced, and regularly updated article carries more GEO weight than 20 short, shallow articles. AI engines favor depth over volume.</p>

      <h2>Frequently asked questions</h2>

      <h3>My competitor is a large company with far more budget. Do I stand a chance?</h3>

      <p>Yes. AI engines do not cite the biggest budgets — they cite the best-structured content. A 10-page site perfectly optimized for GEO can be cited over a 500-page corporate site with poor structure. The advantage of small organizations: speed of execution. You can fix your robots.txt, add Schema.org, and rewrite your intros in a week. A large company will take 3 months.</p>

      <h3>Will AI engines always cite the same competitors?</h3>

      <p>No. Unlike Google rankings, which are relatively stable, AI citations change regularly. AI engines recrawl and re-evaluate sources continuously. A site that improves can take a competitor's place within a few weeks. That is also the risk: if you are cited today but stop maintaining your site, an optimized competitor can replace you.</p>

      <h3>Should I analyze all my competitors or only the most cited ones?</h3>

      <p>Focus on the 3-5 competitors most frequently cited by AI engines. These are your "direct GEO competitors." Analyze in depth what differentiates them from you rather than superficially reviewing 15 competitors.</p>

      <h3>My competitor has an active blog and I do not. Is that the only reason?</h3>

      <p>It is often an important factor, but rarely the only one. An active blog provides extractable and fresh content — two major GEO criteria. But technical fixes (robots.txt, Schema.org) and rewriting existing pages can have a comparable impact without creating a blog. Start by optimizing what you already have before creating new content.</p>

      <ArrowLink href="/">Measure the gap with your competitors — free GEO audit on Detekia →</ArrowLink>
    </>
  );
}
