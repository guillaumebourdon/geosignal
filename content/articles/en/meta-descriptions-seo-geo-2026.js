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

export default function MetaDescriptionsSeoGeo2026() {
  return (
    <>
      <p>In 2026, your meta description doesn't just convince a searcher to click on Google. It also convinces AI to cite you. ChatGPT, Perplexity and Gemini use the meta description as their go-to summary when analyzing your page. If it's vague, promotional, or missing entirely, the AI moves to the next source.</p>

      <p>The problem: most meta descriptions are still written for 2020 SEO. They push for clicks with marketing formulas but contain zero citable information. Result: they perform worse in Google (because AI Overviews absorb clicks) and get ignored by answer engines.</p>

      <p>This guide shows you how to write meta descriptions that win on both fronts: CTR in Google AND citation-worthiness in AI responses.</p>

      <h2>Why meta descriptions matter 2x more in 2026</h2>

      <h3>The dual role: Google CTR + AI citation</h3>

      <p>Historically, the meta description had one job: boost click-through rate (CTR) in Google search results. In 2026, it has an equally important second job: serve as a citable excerpt for AI answer engines.</p>

      <p>When ChatGPT Search, Perplexity, or Google Gemini analyze your page, they prioritize three elements: the title, the meta description, and the first 300 characters of visible content. The meta description is often the first passage they extract to summarize your page in their response.</p>

      <p>The data backs this up: <strong>44.2% of AI citations come from the first 30% of a page's text</strong> (Growth Memo, 2026). The meta description, positioned at the top of the DOM, falls squarely in that critical zone.</p>

      <h3>The context that changes everything</h3>

      <p>On queries that trigger an AI Overview in Google, the <strong>organic click-through rate has dropped 61%</strong> (Seer Interactive, 2025). Users read the AI summary and move on. If your meta description isn't informative enough to be included in that summary, you lose both the click and the visibility.</p>

      <p>Meanwhile, <strong>80% of URLs cited by ChatGPT aren't in Google's top 100</strong> (Ahrefs, 2025). This means even a modest site in traditional SEO can get cited by AI — as long as its content (and meta description) is structured for extraction.</p>

      <ArrowLink href="/blog/pourquoi-trafic-google-baisse-2026">Why your Google traffic is dropping in 2026 (and what AI has to do with it)</ArrowLink>

      <h2>SEO rules that still apply</h2>

      <p>Before adding the GEO layer, let's review the SEO fundamentals of meta descriptions. They're not obsolete — they're necessary but no longer sufficient.</p>

      <h3>Optimal length</h3>

      <p>Google displays roughly <strong>155-160 characters</strong> on desktop and <strong>120 characters</strong> on mobile. Beyond that, text gets truncated. Below 70 characters, you're wasting precious space. Aim for 130-155 characters to cover both formats.</p>

      <h3>Primary keyword up front</h3>

      <p>Google bolds terms that match the user's query. Placing your primary keyword in the first 60 characters maximizes the visibility of that bold text and the relevance signal.</p>

      <h3>Clear promise + call to action</h3>

      <p>The meta description is a 155-character sales pitch. It must answer the user's implicit question: "Why should I click THIS result?"</p>

      <h3>Unique per page</h3>

      <p>Every page needs a unique meta description. Duplicates get ignored by Google (it generates its own snippet instead) and create confusion for AI crawling your site.</p>

      <h3>What to avoid</h3>

      <ul>
        <li>Keyword-stuffed lists without sentences ("SEO, GEO, visibility, AI, optimization")</li>
        <li>Empty meta tags (Google generates an often-mediocre automatic excerpt)</li>
        <li>Excessive emojis (1 emoji is fine, 5 emojis look like spam)</li>
        <li>Double quotes (they truncate the meta in HTML)</li>
      </ul>

      <h2>The new GEO rules</h2>

      <p>This is where 2026 changes the game. AI engines don't evaluate a meta description the way Google does. They look for extractable, verifiable, and self-contained information. Here are the 5 GEO criteria for an optimal meta description.</p>

      <h3>1. Extractability: clear subject-verb-object structure</h3>

      <p>AI extracts complete passages. A grammatically well-structured meta description will be quoted verbatim. A string of sentence fragments won't.</p>

      <pre><code>{`❌ "Your digital partner. Innovative solutions. Since 2005."

✅ "Detekia analyzes your website across 8 GEO criteria and generates an AI citation-worthiness score out of 100 in 30 seconds."`}</code></pre>

      <p>The second version is a complete sentence that AI can directly integrate into its response.</p>

      <h3>2. Factuality: hard data, not vague superlatives</h3>

      <p>AI favors verifiable content. A meta description containing concrete numbers is <strong>2.8x more likely to be cited</strong> than one without verifiable data (AirOps, 2026).</p>

      <pre><code>{`❌ "The best tool on the market for your online visibility."

✅ "Analyze your website across 8 GEO criteria validated by Princeton/KDD 2024. Score out of 100 in 30 seconds, free."`}</code></pre>

      <h3>3. Entity-richness: name the entities</h3>

      <p>AI understands your page better when the meta description explicitly names key entities: brand name, location, product, technology, key metrics.</p>

      <pre><code>{`❌ "Discover our solutions to improve your online presence."

✅ "Detekia measures your website's visibility on ChatGPT, Gemini and Perplexity via 8 GEO criteria (Princeton/KDD 2024)."`}</code></pre>

      <h3>4. Citation-worthiness: could it stand alone as an answer?</h3>

      <p>The ultimate test: if someone copied your meta description and pasted it as the answer to a question, would it make sense? If yes, it's citable. If no, it's just a marketing teaser.</p>

      <h3>5. Contextual independence: understandable without the page</h3>

      <p>AI extracts your meta description without seeing the rest of the page. It must be self-contained: no "Discover here...", no "Learn more about...", no references to visual elements.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO: The complete guide to getting cited by AI in 2026</ArrowLink>

      <h2>The FACTS formula: the winning hybrid framework</h2>

      <p>To combine SEO and GEO in a single meta description, use the <strong>FACTS</strong> formula:</p>

      <ul>
        <li><strong>F</strong>actual: at least 1 hard number or verifiable fact</li>
        <li><strong>A</strong>ctionable: the user knows what they'll get (guide, tool, comparison...)</li>
        <li><strong>C</strong>itable: the sentence can be extracted and used as a standalone answer</li>
        <li><strong>T</strong>arget: the primary keyword is in the first 60 characters</li>
        <li><strong>S</strong>pecific: entity names, numbers, dates — no generalities</li>
      </ul>

      <p><strong>Example — specialty coffee e-commerce:</strong></p>

      <pre><code>{`Before (SEO only): "Discover our selection of specialty coffee. Fast shipping, unbeatable prices. Order now!"

After (FACTS): "Specialty coffee: 12 single-origin beans rated 85+ SCA, roasted in Portland. Free shipping over $35, 4.8/5 on 1,200 Trustpilot reviews."`}</code></pre>

      <p><strong>Example — B2B SaaS:</strong></p>

      <pre><code>{`Before: "The most complete CRM solution for your business. Free trial."

After: "CRM for SMBs: contacts, pipeline and invoicing in 1 tool. 4,500 companies, Stripe and Gmail integration. 14-day free trial."`}</code></pre>

      <p><strong>Example — real estate agency:</strong></p>

      <pre><code>{`Before: "Your real estate journey starts here. Passionate experts at your service."

After: "Real estate agency in Brooklyn: 320 homes sold in 2025, average 45-day close. Free online estimate, 4.9/5 Google."`}</code></pre>

      <h2>5 before/after examples by industry</h2>

      <div style={{ overflowX: 'auto', margin: '24px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#1A1916' }}>
              {['Industry', 'Before (SEO only)', 'After (SEO + GEO)'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#F7F5F2', fontWeight: 600, fontFamily: 'monospace', fontSize: 11, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['E-commerce', 'The best products at the best prices. Free shipping over $50.', 'Specialty coffee: 12 single-origin beans rated 85+ SCA, roasted in Portland. 4.8/5 on 1,200 reviews.'],
              ['B2B SaaS', 'The all-in-one solution for your business. Free trial!', 'CRM for SMBs: contacts, pipeline, invoicing. 4,500 companies, Stripe/Gmail integration. 14-day free trial.'],
              ['Media / Blog', 'All the latest tech and marketing news. Stay informed.', 'SEO vs GEO guide 2026: 12-criteria comparison, 3-layer strategy, and 5-step action plan (Princeton/KDD).'],
              ['Local service', 'Your trusted expert for over 20 years. Contact us!', 'Plumber in Brooklyn: 2-hour response, free estimates, 4.9/5 Google (890 reviews). 24/7 emergencies.'],
              ['Marketplace', 'Thousands of sellers are waiting for you. Sign up!', 'Tech freelance marketplace: 8,000 verified profiles, 48h average match, 94% satisfaction. Post a project free.'],
            ].map(([sector, before, after], i) => (
              <tr key={sector} style={{ background: i % 2 === 0 ? '#fff' : '#F7F5F2', borderBottom: '1px solid #E5E2DC' }}>
                <td style={{ padding: '11px 16px', fontWeight: 600, color: '#1A1916' }}>{sector}</td>
                <td style={{ padding: '11px 16px', color: '#D97757' }}>{before}</td>
                <td style={{ padding: '11px 16px', color: '#10A37F' }}>{after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>Notice the pattern: every "after" version contains at least 2 numbers, 1 named entity, and forms a self-contained citable sentence.</p>

      <InlineCTA href="/">Is your meta description citable by AI? Check your GEO score in 30 seconds.</InlineCTA>

      <h2>Operational checklist: 12 points to verify</h2>

      <p>Before publishing or updating a meta description in 2026, run it through this checklist:</p>

      <ol>
        <li><strong>Length between 130 and 155 characters</strong> — covers desktop and mobile</li>
        <li><strong>Primary keyword in the first 60 characters</strong> — strong SEO signal</li>
        <li><strong>At least 1 hard number</strong> (percentage, volume, rating, date) — GEO verifiability criterion</li>
        <li><strong>At least 1 named entity</strong> (brand, location, product, technology) — entity-richness</li>
        <li><strong>Complete subject-verb-object sentence</strong> — AI extractability</li>
        <li><strong>Understandable without context</strong> — contextual independence</li>
        <li><strong>No unproven superlatives</strong> ("the best", "leader") — editorial neutrality</li>
        <li><strong>Unique to this page</strong> — no duplication</li>
        <li><strong>No double quotes</strong> — they truncate in HTML</li>
        <li><strong>Consistent with actual page content</strong> — otherwise Google replaces it</li>
        <li><strong>Contains a clear promise or benefit</strong> — SEO CTR</li>
        <li><strong>Passes the "citation test"</strong>: pasted as an answer to a question, it makes sense</li>
      </ol>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">GEO Score: how to measure your website's AI visibility</ArrowLink>

      <h2>How to measure the impact of your meta descriptions</h2>

      <h3>SEO side: Google Search Console</h3>

      <p>Track CTR per page in Google Search Console. After rewriting your meta descriptions, compare CTR over a rolling 4-week window. A gain of 1 to 3 CTR points is typical on pages where the meta was generic.</p>

      <h3>GEO side: citation testing + Detekia audit</h3>

      <p>To measure the citation-worthiness of your meta descriptions:</p>

      <ul>
        <li><strong>Manual test</strong>: ask ChatGPT or Perplexity a question related to your page. Is your site cited? Does the excerpt used come from your meta description?</li>
        <li><strong>Automated audit</strong>: Detekia measures your content's extractability across 8 GEO criteria. The extractability score (25 points out of 100) includes evaluation of your metadata.</li>
      </ul>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">The 8 GEO criteria that determine whether AI cites you</ArrowLink>

      <h2>FAQ</h2>

      <h3>Does Google always rewrite meta descriptions?</h3>

      <p>Google rewrites the meta description in roughly 60-70% of cases in 2026, often to better match the query. But a well-written, relevant meta of the right length is much more likely to be kept. And even when Google rewrites it, AI crawlers read the original meta from the HTML source.</p>

      <h3>Should I write different meta descriptions for SEO and GEO?</h3>

      <p>No. The goal is to write ONE meta description that performs on both fronts. The FACTS formula combines SEO criteria (CTR, keyword, length) and GEO criteria (extractability, factuality, entity-richness) in a single 130-155 character text.</p>

      <h3>Do meta descriptions directly impact Google rankings?</h3>

      <p>Not directly — the meta description is not a ranking factor for Google. But a high CTR is an indirect quality signal. And on the GEO side, a well-structured meta description directly impacts the probability of being cited in AI responses.</p>

      <h2>Key takeaways</h2>

      <p>In 2026, your meta description is the first sentence AI cites about you. It no longer just attracts a click — it gets selected as a source by ChatGPT, Perplexity and Gemini. Apply the FACTS formula (Factual, Actionable, Citable, Target, Specific) to each of your pages, and you'll simultaneously optimize your Google CTR and your AI visibility.</p>

      <p>Start with your 10 most-visited pages. Rewrite their meta descriptions using the checklist above. Measure the impact after 4 weeks. The results will surprise you.</p>
    </>
  );
}
