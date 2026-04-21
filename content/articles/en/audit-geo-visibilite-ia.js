import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

export default function AuditGeoVisibiliteIa() {
  return (
    <>
      <p>You want to know whether ChatGPT, Gemini, or Perplexity cite your website — and if not, why. A GEO audit answers both questions. It evaluates your site against the criteria AI engines use to select their sources, identifies blockers, and gives you a prioritized action plan.</p>

      <p>This article walks you through a complete GEO audit, step by step, that you can run yourself or accelerate with an automated tool.</p>

      <h2>What a GEO audit evaluates (and what it does not)</h2>

      <p>A GEO audit is not an SEO audit. The two complement each other but measure different things.</p>

      <p>What a GEO audit measures:</p>
      <ul>
        <li>Can your content be extracted and cited by an AI? (extractability)</li>
        <li>Can AI bots access your website? (crawlability)</li>
        <li>Is your site understood by machines? (structured data)</li>
        <li>Is your content perceived as trustworthy? (verifiability, authority, neutrality)</li>
        <li>Do you exist outside your own website? (external presence)</li>
        <li>Is your content up to date? (freshness)</li>
      </ul>

      <p>What a GEO audit does not measure:</p>
      <ul>
        <li>Your Google rankings (that is SEO)</li>
        <li>Your page speed (that is technical SEO)</li>
        <li>Your backlink profile in detail (that is off-page SEO)</li>
        <li>The exact number of times AI engines cite you (no tool can measure this with certainty)</li>
      </ul>

      <p>A GEO audit measures your citation potential — the technical and editorial conditions that maximize your chances of being selected as a source by AI engines.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">The 8 GEO criteria that determine whether AI cites you →</ArrowLink>

      <h2>Step 1 — The citation test (15 minutes)</h2>

      <p>Before diving into the technical side, start with the most concrete test: ask AI engines directly whether they know your website.</p>

      <h3>How to do it</h3>

      <p>Open ChatGPT, Gemini, and Perplexity. For each, ask 5 questions:</p>

      <p>Recommendation questions (your market):</p>
      <ol>
        <li>"What's the best [your service/product] in [your city]?"</li>
        <li>"Recommend a [your service/product] for [specific need your clients have]"</li>
      </ol>

      <p>Expertise questions (your domain):</p>
      <ol>
        <li>"How do I choose a good [your industry]?"</li>
        <li>"What's the difference between [A] and [B] in [your sector]?"</li>
      </ol>

      <p>Brand question (your name):</p>
      <ol>
        <li>"What does [your company name] do?"</li>
      </ol>

      <h3>How to analyze the results</h3>

      <p>For each response, record in a spreadsheet:</p>
      <ul>
        <li><strong>Cited?</strong> — your site or brand appears in the response (yes/no)</li>
        <li><strong>Competitors cited</strong> — which names appear instead of yours</li>
        <li><strong>Type of source cited</strong> — official website, blog post, forum, directory?</li>
      </ul>

      <p>Calculate your presence rate: number of citations / (5 questions x 3 engines) = X%.</p>

      <p>Below 20%, you have a significant AI visibility problem. Above 50%, you are in a good position. Above 80%, you can shift to fine-tuning mode.</p>

      <h3>What the results tell you</h3>

      <p>If you appear nowhere but your competitors are cited, the problem is likely technical (crawlability, structured data) or editorial (extractability, content quality).</p>

      <p>If nobody appears in your sector, that is an opportunity: the first to optimize will capture the citations.</p>

      <p>If you appear on some queries but not others, compare the corresponding pages: the one that gets cited probably has something the others lack (better structure, more data, FAQ...).</p>

      <h2>Step 2 — The crawlability audit (10 minutes)</h2>

      <p>This is the binary criterion: if AI bots cannot access your site, nothing else matters.</p>

      <h3>Check robots.txt</h3>

      <p>Go to <code>your-website.com/robots.txt</code> and look for directives targeting these user-agents:</p>
      <ul>
        <li><code>GPTBot</code> — ChatGPT</li>
        <li><code>ClaudeBot</code> — Claude</li>
        <li><code>PerplexityBot</code> — Perplexity</li>
        <li><code>Google-Extended</code> — Gemini / AI Overviews</li>
      </ul>

      <p>If you see <code>Disallow: /</code> for any of these bots, you are actively blocking them.</p>

      <p><strong>Expected result:</strong> no AI bot should be blocked (unless it is a documented strategic decision).</p>

      <h3>Check the llms.txt file</h3>

      <p>Go to <code>your-website.com/llms.txt</code>. This file, if it exists, guides AI crawlers to your most important content.</p>

      <p><strong>Expected result:</strong> the file exists and lists your main pages.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">llms.txt, robots.txt, and AI crawlability: the technical guide →</ArrowLink>

      <h3>Check JavaScript accessibility</h3>

      <p>Disable JavaScript in your browser (Chrome DevTools → Ctrl+Shift+P → "Disable JavaScript") and navigate your site. If the main content disappears, AI crawlers probably cannot read it either.</p>

      <p><strong>Expected result:</strong> main content is visible without JavaScript.</p>

      <h3>Check the sitemap</h3>

      <p>Go to <code>your-website.com/sitemap.xml</code>. Verify that it is accessible, lists all your important pages, and that <code>&lt;lastmod&gt;</code> dates are up to date.</p>

      <p><strong>Expected result:</strong> sitemap accessible and up to date.</p>

      <h2>Step 3 — The extractability audit (30 minutes)</h2>

      <p>This is the heaviest criterion in the GEO score (25 points out of 100) and the one that fails most often.</p>

      <h3>Analyze your 5 main pages</h3>

      <p>Take your 5 most important pages (homepage, main service/product page, key blog post, FAQ, About page). For each page, evaluate:</p>

      <p><strong>The first 100 words</strong> — do they contain a direct answer to the question the visitor is asking? Or do they start with vague marketing copy ("Welcome to...", "Leading innovation...")?</p>

      <p>Test with this method: copy the first 100 words of your page and paste them into ChatGPT, asking "Based on this text, what does this company do and what does it offer?" If ChatGPT cannot answer clearly, your intro is not extractable.</p>

      <p><strong>H2/H3 subheadings</strong> — are they descriptive or vague? "How our service works" is good. "Learn more" is bad. "Our advantages" is mediocre.</p>

      <p><strong>Paragraph autonomy</strong> — pick a random paragraph from the page. Is it understandable out of context? AI engines often extract a single paragraph to answer a question. If that paragraph requires the previous paragraph for context, it loses its value.</p>

      <p><strong>Structure</strong> — are there lists, tables, numbered steps? Structured information is more easily extractable than continuous text.</p>

      <h3>Quick scoring</h3>

      <p>For each page, assign a subjective score:</p>
      <ul>
        <li><strong>Good (4-5/5)</strong>: factual intro, descriptive subheadings, autonomous paragraphs, lists/tables</li>
        <li><strong>Average (2-3/5)</strong>: mix of informative and commercial content, partial structure</li>
        <li><strong>Weak (0-1/5)</strong>: commercial intro, no structure, vague continuous text</li>
      </ul>

      <h2>Step 4 — The structured data audit (15 minutes)</h2>

      <h3>Test with the Rich Results Test</h3>

      <p>Go to Google's Rich Results Test and enter your homepage URL. Note:</p>
      <ul>
        <li>How many rich result types are detected?</li>
        <li>Are there any errors or warnings?</li>
      </ul>

      <p>Repeat for your FAQ page and your main blog post.</p>

      <h3>Essential schema checklist</h3>

      <p>Check for these schemas:</p>
      <ul>
        <li><code>Organization</code> on the homepage — name, logo, URL, address, contact, sameAs (links to LinkedIn, etc.)</li>
        <li><code>Article</code> on editorial content — title, author (with name and LinkedIn URL), dates, description</li>
        <li><code>FAQPage</code> on pages containing Q&As</li>
        <li><code>BreadcrumbList</code> on internal pages</li>
        <li><code>WebSite</code> with SearchAction on the homepage</li>
      </ul>

      <p><strong>Expected result:</strong> at minimum Organization + Article. Ideally all 5 schemas above.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org and AI: ready-to-copy code examples →</ArrowLink>

      <h2>Step 5 — The verifiability audit (20 minutes)</h2>

      <h3>Scan content for evidence</h3>

      <p>Go through your 5 main pages and count, for each page:</p>
      <ul>
        <li><strong>Quantified data</strong> — statistics, percentages, dollar amounts, time frames (target: 1 data point per 200 words)</li>
        <li><strong>Named sources</strong> — "according to Gartner", "per a McKinsey study" (not "according to experts" or "studies show")</li>
        <li><strong>Reference dates</strong> — "in 2026", "since March 2025" (not "recently" or "for some time now")</li>
        <li><strong>Concrete examples</strong> — client case studies, usage scenarios, measured results</li>
      </ul>

      <h3>Identify unsourced claims</h3>

      <p>Look through your pages for claims that are not backed by evidence:</p>
      <ul>
        <li>"We are leaders in..." — leaders by what metric?</li>
        <li>"Exceptional results" — which results exactly?</li>
        <li>"Many satisfied customers" — how many exactly?</li>
      </ul>

      <p>Every unsourced claim is a negative signal for AI engines.</p>

      <h2>Step 6 — The E-E-A-T authority audit (10 minutes)</h2>

      <h3>About page</h3>

      <p>Does your About page contain:</p>
      <ul>
        <li>The full name of the founder/CEO?</li>
        <li>A biography with background and expertise?</li>
        <li>A photo?</li>
        <li>Complete contact information (address, email, phone)?</li>
        <li>Trust signals (client logos, certifications, press mentions)?</li>
      </ul>

      <h3>Identified authors</h3>

      <p>Are your blog posts signed by a named author with:</p>
      <ul>
        <li>A link to a professional profile (LinkedIn)?</li>
        <li>A short bio at the bottom of the article?</li>
      </ul>

      <h3>Legal disclosures</h3>

      <p>Are your legal disclosures complete: company name, EIN or state registration number, address, responsible officer?</p>

      <p><strong>Expected result:</strong> complete About page, identified authors, thorough legal disclosures.</p>

      <h2>Step 7 — The neutrality audit (10 minutes)</h2>

      <h3>Analyze the tone</h3>

      <p>Reread your key pages with a critical eye. Look for:</p>
      <ul>
        <li>Unsourced superlatives: "the best", "the most innovative", "unmatched", "revolutionary"</li>
        <li>Vague promises: "exceptional results", "a transformative solution"</li>
        <li>Manipulation: artificial urgency ("limited offer!"), social pressure ("everyone uses..."), fear ("you're losing money")</li>
      </ul>

      <p>Every occurrence reduces your credibility with AI engines.</p>

      <h3>The tone test</h3>

      <p>Take the most commercial paragraph on your website and ask yourself: "Would a Wikipedia article say this?" If not, it is too promotional for AI engines.</p>

      <p>The goal is not to eliminate all commercial language, but to ground it in facts: "Trusted by 312 companies since 2019" rather than "Market-leading solution".</p>

      <h2>Step 8 — The external presence audit (15 minutes)</h2>

      <h3>Check your web footprint</h3>

      <p>Search for your brand on Google (in quotes): "your company". How many results come from third-party sites (not your own)?</p>

      <p>Also search for:</p>
      <ul>
        <li>Your name on Reddit (via Google: <code>site:reddit.com "your company"</code>)</li>
        <li>Your company LinkedIn profile — is it active?</li>
        <li>Your Google Business Profile — does it exist and is it verified?</li>
        <li>Press mentions — articles that talk about you?</li>
      </ul>

      <h3>Evaluate diversity</h3>

      <p>Ideally, you should be mentioned on several types of sources:</p>
      <ul>
        <li>Industry press/media</li>
        <li>Forums/Reddit</li>
        <li>Professional directories</li>
        <li>Google Business Profile</li>
        <li>LinkedIn (active company page)</li>
      </ul>

      <p><strong>Expected result:</strong> at least 3 different types of external sources.</p>

      <h2>Step 9 — The freshness audit (5 minutes)</h2>

      <p>Check the dates:</p>
      <ul>
        <li>When was your last blog post published?</li>
        <li>Do your main pages display a visible last-updated date?</li>
        <li>Are there outdated dates in your content ("2024 trends", "2023 new releases")?</li>
        <li>Are the <code>dateModified</code> fields in your Article schemas up to date?</li>
      </ul>

      <p><strong>Expected result:</strong> content updated within the last 3 months, no outdated dates.</p>

      <h2>Synthesize the results</h2>

      <h3>How to prioritize</h3>

      <p>Prioritize <strong>blocking</strong> criteria first — crawlability and extractability. If bots cannot access your site or if your content is not extractable, nothing else matters.</p>

      <p>Next, focus on <strong>high-impact</strong> criteria — verifiability and structured data. These are the levers that take a site from "invisible" to "citable".</p>

      <p>Finally, address <strong>reinforcement</strong> criteria — authority, neutrality, external presence, freshness. They improve a site that is already citable.</p>

      <h2>Automate your audit</h2>

      <p>The manual audit we just described takes about 2 hours. It is an excellent exercise for understanding the stakes, but it is not sustainable for regular monitoring.</p>

      <p>Detekia automates all 8 criteria in 30 seconds: it scrapes the actual DOM of your page, analyzes each criterion, and gives you a score out of 100 with recommendations prioritized by impact.</p>

      <p>The automated audit is especially useful for:</p>
      <ul>
        <li>Initial diagnosis — where do you stand exactly?</li>
        <li>Post-optimization tracking — did your fixes improve the score?</li>
        <li>Competitive benchmarking — how do you compare to your competitors?</li>
      </ul>

      <ArrowLink href="/">Run your automated GEO audit — in 30 seconds, no signup required →</ArrowLink>
    </>
  );
}
