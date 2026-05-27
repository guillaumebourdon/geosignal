import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

function CritereCard({ numero, nom, poids, couleur, children }) {
  return (
    <div style={{ border: `1px solid ${couleur}30`, borderLeft: `4px solid ${couleur}`, borderRadius: 10, padding: '20px 24px', marginBottom: 20, background: `${couleur}08` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, background: couleur, color: '#fff', borderRadius: 20, padding: '2px 10px' }}>#{numero}</span>
        <strong style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#1A1916' }}>{nom}</strong>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: couleur, marginLeft: 'auto' }}>{poids}</span>
      </div>
      <div style={{ fontFamily: 'system-ui', fontSize: 14, color: '#3A3733', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export default function HuitCriteresGeoMethodologieDetekia() {
  return (
    <>
      <p>The Detekia GEO score is not a black box. Behind every rating from 0 to 100, there are 8 specific criteria measured automatically from your site analysis. Understanding how each criterion is evaluated, why it matters, and how to improve it — that's what this article is about.</p>

      <p>This methodology is the result of months of research into what actually determines whether a site gets cited by LLMs. It draws on academic work in GEO (notably Aggarwal et al., 2023, presented at KDD 2024), Google's E-E-A-T guidelines, and empirical observations from hundreds of audits.</p>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">How to interpret your overall GEO score →</ArrowLink>

      <h2>Overview of the 7 criteria</h2>

      <p>The 7 criteria are organized into three layers:</p>

      <ul>
        <li><strong>Technical layer</strong> (what AI can read): Citability, AI Accessibility</li>
        <li><strong>Semantic layer</strong> (what AI understands): Structured Data, Freshness</li>
        <li><strong>Trust layer</strong> (what AI values): Verifiability, E-E-A-T Authority, Editorial Neutrality, External Presence</li>
      </ul>

      <p>Each criterion is scored from 0 to 100. The overall score is a weighted average. The weights reflect the empirical impact of each criterion on the probability of being cited.</p>

      <h2>The 7 criteria in detail</h2>

      <CritereCard numero={1} nom="Citability" poids="Weight: 20%" couleur="#10A37F">
        <p><strong>What it is:</strong> The ability of AI engines to easily extract factual information from your content.</p>
        <p><strong>How it's measured:</strong> Analysis of content structure — presence of clear headings (H1, H2, H3), bullet lists, numerical data, and explicit definitions. We measure information density and organizational clarity.</p>
        <p><strong>Why it matters:</strong> LLMs work by pattern extraction. Dense, poorly structured text will be paraphrased loosely or ignored entirely. Content with clearly presented facts will be cited verbatim.</p>
        <p><strong>How to improve:</strong></p>
        <ul>
          <li>Structure content with hierarchical headings (H2 for sections, H3 for sub-points)</li>
          <li>Transform dense paragraphs into bullet lists where possible</li>
          <li>Include precise numerical data (not "a lot" but "72%")</li>
          <li>Use summary boxes at the end of each section</li>
        </ul>
      </CritereCard>

      <CritereCard numero={2} nom="Verifiability" poids="Weight: 15%" couleur="#4285F4">
        <p><strong>What it is:</strong> The extent to which your claims can be verified by the AI or its users.</p>
        <p><strong>How it's measured:</strong> Presence of cited sources (external links to studies, official data), dates on information, identified authors, explained methodologies. We also check that outbound links point to recognized sources.</p>
        <p><strong>Why it matters:</strong> LLMs are trained to favor verifiable information. An unsourced claim is perceived as less reliable than a sourceable one. Citing studies increases the probability that AI will reuse your exact phrasing.</p>
        <p><strong>How to improve:</strong></p>
        <ul>
          <li>Cite the studies and reports you reference (link + author + year)</li>
          <li>Clearly date your content ("last updated: March 2026")</li>
          <li>Mention primary sources for statistics</li>
          <li>Avoid unsourced assertions ("experts agree that...")</li>
        </ul>
      </CritereCard>

      <CritereCard numero={3} nom="E-E-A-T Authority" poids="Weight: 20%" couleur="#D97757">
        <p><strong>What it is:</strong> The Experience, Expertise, Authoritativeness, and Trustworthiness of the site and its authors — Google's framework adopted by LLMs.</p>
        <p><strong>How it's measured:</strong> Presence of a detailed "About" page, author bios with credentials, mentions of partners/clients/certifications, accessible contact page, privacy policy, quality inbound links.</p>
        <p><strong>Why it matters:</strong> AI engines cite trustworthy sources. A site with no identified author, no "About" page, and no legitimacy signals will be systematically deprioritized against a competitor that has them.</p>
        <p><strong>How to improve:</strong></p>
        <ul>
          <li>Create an "About" page with the company story and credentials</li>
          <li>Add author bios to every article (name, role, expertise)</li>
          <li>Mention recognized partners, certifications, or clients</li>
          <li>Make sure the contact page and terms of service are easily accessible</li>
        </ul>
      </CritereCard>

      <CritereCard numero={4} nom="AI Accessibility" poids="Weight: 15%" couleur="#1C7DC4">
        <p><strong>What it is:</strong> The ability of AI bots to access and read your site.</p>
        <p><strong>How it's measured:</strong> Analysis of robots.txt for AI user-agents (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended), presence of an llms.txt file, page load speed, accessibility of key pages.</p>
        <p><strong>Why it matters:</strong> A site that blocks AI bots in its robots.txt will simply be ignored. A slow site or one with JavaScript-only content will be partially read. This is an absolute prerequisite.</p>
        <p><strong>How to improve:</strong></p>
        <ul>
          <li>Verify that GPTBot, ClaudeBot, and PerplexityBot are not blocked in robots.txt</li>
          <li>Create an llms.txt file with a site summary and key pages</li>
          <li>Ensure important content is in rendered HTML (not only in client-side JS)</li>
          <li>Maintain an up-to-date XML sitemap</li>
        </ul>
      </CritereCard>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">Full technical guide: robots.txt and llms.txt for AI bots →</ArrowLink>

      <CritereCard numero={5} nom="Structured Data" poids="Weight: 15%" couleur="#9B59B6">
        <p><strong>What it is:</strong> The presence and quality of Schema.org markup in JSON-LD on key pages.</p>
        <p><strong>How it's measured:</strong> Detection and validation of JSON-LD schemas (Organization, WebSite, Article, FAQPage, Product, BreadcrumbList, LocalBusiness). We check for presence, completeness, and consistency with the page content.</p>
        <p><strong>Why it matters:</strong> JSON-LD schemas are designed specifically so machines can understand content without ambiguity. A well-populated FAQPage schema will be extracted directly by LLMs to answer user questions.</p>
        <p><strong>How to improve:</strong></p>
        <ul>
          <li>Add Organization on the homepage</li>
          <li>Add Article on every blog post</li>
          <li>Add FAQPage on pages that contain Q&A content</li>
          <li>Validate with Google's Rich Results Test tool</li>
        </ul>
      </CritereCard>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org and AI: the 5 priority schemas for GEO →</ArrowLink>

      <CritereCard numero={6} nom="Editorial Neutrality" poids="Weight: 10%" couleur="#E67E22">
        <p><strong>What it is:</strong> Your content's ability to inform objectively, without excessive commercial promotion.</p>
        <p><strong>How it's measured:</strong> Language analysis — density of superlatives ("best," "revolutionary," "incredible"), presence of pros/cons arguments, honest mentions of product/service limitations, informative vs. persuasive tone.</p>
        <p><strong>Why it matters:</strong> AI engines avoid citing content perceived as marketing. They favor sources that resemble encyclopedias or expert guides. An article that presents nuance and acknowledges limitations is more credible than one that's exclusively positive.</p>
        <p><strong>How to improve:</strong></p>
        <ul>
          <li>Replace superlatives with measurable facts</li>
          <li>Include "limitations" sections or "who this product/service is NOT for"</li>
          <li>Present existing alternatives when relevant</li>
          <li>Avoid phrasing like "the best solution on the market"</li>
        </ul>
      </CritereCard>

      <CritereCard numero={7} nom="External Presence" poids="Weight: 10%" couleur="#27AE60">
        <p><strong>What it is:</strong> Mentions and citations of your brand/site on other platforms.</p>
        <p><strong>How it's measured:</strong> Detection of quality backlinks, mentions on third-party platforms (LinkedIn, specialized forums, industry publications), presence on Wikipedia or recognized directories, citations in other articles.</p>
        <p><strong>Why it matters:</strong> LLMs were trained on a large web corpus. If your brand is mentioned in many independent sources, the AI knows it and trusts it. External presence is a proxy for perceived authority.</p>
        <p><strong>How to improve:</strong></p>
        <ul>
          <li>Publish original studies or data that others will cite</li>
          <li>Contribute to industry publications (guest posts, interviews)</li>
          <li>Be listed in relevant directories for your industry</li>
          <li>Encourage testimonials and reviews on third-party platforms</li>
        </ul>
      </CritereCard>

      <CritereCard numero={8} nom="Freshness" poids="Weight: 5%" couleur="#6B6762">
        <p><strong>What it is:</strong> How recent and regularly updated your content is.</p>
        <p><strong>How it's measured:</strong> Publication and modification dates of pages, frequency of new content publication, presence of dates in Schema.org markup and visible HTML.</p>
        <p><strong>Why it matters:</strong> AI engines prefer recent information for evolving topics. A 2021 article about AI will be cited less than a 2026 article, even if the content is similar. Freshness matters less for stable subjects (mathematics, history) than for technology topics.</p>
        <p><strong>How to improve:</strong></p>
        <ul>
          <li>Update existing articles regularly (and indicate it with an update date)</li>
          <li>Publish new content at least once a month</li>
          <li>Include dates in the Article schema (datePublished + dateModified)</li>
          <li>Mention the year in titles for time-sensitive topics</li>
        </ul>
      </CritereCard>

      <h2>How the criteria add up</h2>

      <p>The overall score is a weighted average. But there's an important subtlety: the technical criteria (Citability, Crawlability) act as <strong>prerequisites</strong>. A site blocking AI bots in its robots.txt will get a Crawlability score of 0, which mechanically caps its overall score — no matter how good the content is.</p>

      <p>Recommended optimization order:</p>

      <ol>
        <li><strong>Unblock AI bots</strong> (Crawlability) — absolute prerequisite</li>
        <li><strong>Structure your content</strong> (Citability) — highest immediate impact</li>
        <li><strong>Add priority schemas</strong> (Structured Data) — technical quick win</li>
        <li><strong>Strengthen authority</strong> (E-E-A-T) — medium-term investment</li>
        <li><strong>Source your claims</strong> (Verifiability) — continuous improvement</li>
        <li><strong>Adjust the tone</strong> (Neutrality) — review and rewrite</li>
        <li><strong>Build external presence</strong> — long-term work</li>
        <li><strong>Maintain freshness</strong> — editorial discipline</li>
      </ol>

      <h2>What the score doesn't measure</h2>

      <p>The Detekia GEO score measures potential citability. It does not measure:</p>

      <ul>
        <li><strong>Whether you're already being cited</strong> — for that, you need to test directly in ChatGPT, Perplexity, etc.</li>
        <li><strong>Content quality</strong> — a factually incorrect but well-structured article can score well technically</li>
        <li><strong>Topic coverage volume</strong> — one excellent article vs. a site with 50 mediocre ones</li>
        <li><strong>Query popularity</strong> — being citable on a topic nobody searches for won't drive traffic</li>
      </ul>

      <p>That's why the GEO score should be interpreted as a <strong>citability potential</strong>, not a guarantee. A complete strategy combines technical optimization (GEO score) with editorial strategy (topics to cover) and distribution (external presence).</p>

      <ArrowLink href="/">Analyze your GEO score for free →</ArrowLink>

      <h2>Frequently asked questions about the methodology</h2>

      <h3>Is the GEO score valid for all types of websites?</h3>

      <p>The methodology was designed for B2B and B2C sites with editorial content (blogs, guides, product pages). It's less relevant for pure web applications (SaaS with no public content) or highly technical sites without a general audience.</p>

      <h3>How often should I re-evaluate my score?</h3>

      <p>After every significant optimization (technical overhaul, new articles, schema updates), and at minimum once per quarter. LLM algorithms evolve, and what's optimal today can change.</p>

      <h3>Does the GEO score replace the SEO score?</h3>

      <p>No — the two scores measure complementary things. A strong SEO score (domain authority, backlinks, Google rankings) contributes to the GEO score (external presence, verifiability). But pages that rank well on Google can still have a poor GEO score if the content isn't extractable by AI engines.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">SEO vs GEO: key differences and how to combine them →</ArrowLink>
    </>
  );
}
