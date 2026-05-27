import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

function OffreCard({ titre, prix, description, inclus }) {
  return (
    <div style={{ border: '1px solid #E5E2DC', borderRadius: 10, padding: '20px 24px', marginBottom: 16, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <strong style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1A1916' }}>{titre}</strong>
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#D97757', fontWeight: 700 }}>{prix}</span>
      </div>
      <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#6B6762', marginBottom: 12 }}>{description}</p>
      <ul style={{ fontFamily: 'system-ui', fontSize: 13, color: '#3A3733', paddingLeft: 16 }}>
        {inclus.map((item, i) => <li key={i} style={{ marginBottom: 4 }}>{item}</li>)}
      </ul>
    </div>
  );
}

export default function GeoAgencesSeoAuditIa() {
  return (
    <>
      <p>GEO (Generative Engine Optimization) is becoming what SEO was in 2008: a new discipline that your clients are starting to hear about, without knowing exactly what it is — and they're looking for someone to guide them.</p>

      <p>For SEO agencies, this is a rare opportunity: establishing a presence in a market before it gets crowded. Agencies that integrate GEO auditing into their services now will gain a 2-3 year head start over competitors who wait for it to go "mainstream."</p>

      <p>This guide explains how to build a concrete GEO offering, integrate it into your existing SEO practice, and sell it to both current and prospective clients.</p>

      <ArrowLink href="/blog/seo-vs-geo-differences-2026">Understand the differences between SEO and GEO before reading this guide →</ArrowLink>

      <h2>Why SEO agencies are best positioned</h2>

      <p>The GEO audit isn't a radically new discipline — it's a natural extension of SEO. About 70% of GEO criteria are already within the scope of a good SEO agency:</p>

      <ul>
        <li>Technical work (crawlability, speed, SSR) is already in your scope</li>
        <li>Content (structure, E-E-A-T, fresh data) is already in your scope</li>
        <li>Structured data (Schema.org) is already in your scope</li>
        <li>External presence (link building, mentions) is already in your scope</li>
      </ul>

      <p>What changes with GEO is the angle: instead of optimizing for Google, you're optimizing for LLMs. The techniques overlap significantly, but the evaluation and reporting are new.</p>

      <p><strong>Competitive advantage:</strong> Your existing clients already trust you with their online visibility. Offering a GEO audit means extending that trust to a new channel — without starting from scratch on the business relationship.</p>

      <h2>How to structure the GEO audit</h2>

      <p>The GEO audit runs in 4 phases. Each phase has a specific deliverable and concrete action items.</p>

      <h3>Phase 1: Diagnosis (1-2 hours)</h3>

      <p>Evaluate the site's current state across the 8 GEO criteria:</p>

      <ul>
        <li>AI Accessibility: robots.txt, llms.txt, server-side rendering</li>
        <li>Citability: heading structure, fact density, lists</li>
        <li>Structured Data: JSON-LD schemas present and valid</li>
        <li>Editorial Neutrality: tone, superlatives, honest acknowledgment of limitations</li>
        <li>Verifiability: cited sources, dates, identified authors</li>
        <li>E-E-A-T: About page, author bios, certifications</li>
        <li>External Presence: backlinks, media mentions, third-party reviews</li>
        <li>Freshness: publication dates, update frequency</li>
      </ul>

      <p>Use an automated audit tool (like Detekia) to get a baseline score, then manually deep-dive into the weak spots.</p>

      <h3>Phase 2: Citability testing (1 hour)</h3>

      <p>Test directly whether the client is being cited in the major AI platforms:</p>

      <pre><code>{`Tests to run in ChatGPT, Perplexity, Gemini:

1. "[Brand name] reviews" → is it mentioned?
2. "[Service/product] best/recommended" → does it appear?
3. "[Key industry question]" → is their content cited?
4. "[City] + [profession]" (for local businesses) → are they in the results?`}</code></pre>

      <p>Document the results with screenshots. This is often the best sales argument: showing the client they don't appear while their competitors do.</p>

      <h3>Phase 3: Prioritized action plan (2-3 hours)</h3>

      <p>Turn the diagnosis into concrete actions, ranked by impact and effort:</p>

      <ul>
        <li><strong>Quick wins</strong> (1-2 weeks): robots.txt fixes, adding missing schemas, heading restructuring</li>
        <li><strong>Medium gains</strong> (1-3 months): rewriting key content, creating llms.txt, strengthening E-E-A-T</li>
        <li><strong>Long-term gains</strong> (3-12 months): external presence strategy, targeted content production, GEO-oriented link building</li>
      </ul>

      <h3>Phase 4: Monitoring and reporting (monthly)</h3>

      <p>GEO reporting combines:</p>

      <ul>
        <li>GEO score evolution (baseline → target)</li>
        <li>Monthly citability tests across major AI platforms</li>
        <li>AI traffic tracking (identifiable via UTM or user-agent analysis)</li>
        <li>Comparison with direct competitors</li>
      </ul>

      <h2>Offers to propose to your clients</h2>

      <OffreCard
        titre="One-time GEO Audit"
        prix="$1,000 – $2,000"
        description="For clients who want to understand their current situation before committing further."
        inclus={[
          "GEO score across 7 criteria with industry benchmark",
          "Citability tests in ChatGPT, Perplexity, Gemini",
          "Detailed PDF report with recommendations and code examples",
          "Prioritized action plan (quick wins + medium term)",
          "1-hour video walkthrough",
        ]}
      />

      <OffreCard
        titre="Monthly GEO Retainer"
        prix="$600 – $1,500/month"
        description="For clients who want to actively improve their AI citability over time."
        inclus={[
          "Monthly implementation of priority actions",
          "Production or optimization of 2-4 GEO-focused content pieces",
          "GEO score tracking and citability testing",
          "Monthly report + check-in call",
          "Monitoring of AI algorithm changes",
        ]}
      />

      <OffreCard
        titre="GEO Add-on to Existing SEO Audit"
        prix="+30-50% on SEO audit price"
        description="For existing clients — a natural extension of your standard engagement."
        inclus={[
          "GEO section in the SEO audit report",
          "Evaluation across 8 GEO criteria",
          "GEO recommendations in the action plan",
          "Basic citability tests",
        ]}
      />

      <h2>Commercial arguments that work</h2>

      <p>Not all of your clients realize they have a GEO problem. Here are the arguments that start the conversation:</p>

      <h3>The lost visibility argument</h3>

      <p>"Nearly 40% of online searches in the US now start with an AI tool rather than Google for your industry. If your site isn't optimized for AI, you're invisible to over a third of your potential prospects."</p>

      <h3>The competitor argument</h3>

      <p>Run a live test: type the client's industry into ChatGPT or Perplexity. If a competitor is cited and the client isn't, that's the most powerful sales argument you can make. Nothing beats a concrete demonstration.</p>

      <h3>The conversion rate argument</h3>

      <p>"A visitor who lands on your site after an AI recommendation has already decided to check you out — they convert 4x better than a standard SEO visitor. This is pre-qualified traffic."</p>

      <h3>The window of opportunity argument</h3>

      <p>"GEO in 2026 is SEO in 2012. Your competitors aren't optimized yet — this is the moment to build a 2-year head start before everyone catches on."</p>

      <h2>How to train your team</h2>

      <p>You don't need to master everything before offering GEO audits. Start by training 1-2 people in depth, and build a repeatable process.</p>

      <h3>Key skills to develop</h3>

      <ul>
        <li><strong>LLM comprehension</strong>: how ChatGPT, Perplexity, and Gemini work, their sources</li>
        <li><strong>Citability evaluation</strong>: reading content and identifying what's extractable vs. not</li>
        <li><strong>Advanced Schema.org</strong>: FAQPage, Article, Organization, Product — implementation and validation</li>
        <li><strong>robots.txt analysis</strong>: identifying AI bot blocks</li>
        <li><strong>GEO writing</strong>: restructuring content to make it more citable</li>
      </ul>

      <h3>Resources for training</h3>

      <ul>
        <li>Our blog articles — especially the complete GEO guide and the 8-criteria methodology</li>
        <li>The original academic paper: "Generative Engine Optimization" (Aggarwal et al., 2023)</li>
        <li>Google's E-E-A-T guidelines (Search Quality Evaluator Guidelines)</li>
        <li>Official bot documentation: openai.com/gptbot, anthropic.com/robots</li>
        <li>Industry sources: Search Engine Land, Moz Blog, Search Engine Journal</li>
      </ul>

      <ArrowLink href="/blog/geo-guide-complet-2026">The complete GEO guide: 7 criteria, 7 concrete actions →</ArrowLink>

      <h2>Integrate GEO into your existing workflow</h2>

      <p>Here's how to integrate GEO without rebuilding everything from scratch:</p>

      <h3>In your technical SEO audit</h3>

      <p>Add an "AI Accessibility" section to your technical audit checklist:</p>

      <ul>
        <li>robots.txt check for GPTBot, ClaudeBot, PerplexityBot, Google-Extended</li>
        <li>XML sitemap presence and quality</li>
        <li>Presence of an llms.txt file</li>
        <li>SSR/SSG rendering test vs. client-side JavaScript</li>
      </ul>

      <h3>In your content audit</h3>

      <p>For each page analyzed, add a GEO evaluation:</p>

      <ul>
        <li>Citability score: clear structure, numerical data, lists</li>
        <li>Verifiability score: cited sources, identified author, visible date</li>
        <li>Neutrality score: superlatives, honest comparisons, mentioned limitations</li>
      </ul>

      <h3>In your content recommendations</h3>

      <p>When you recommend content creation or rewrites, systematically include:</p>

      <ul>
        <li>GEO-optimal structure (headings, lists, summary boxes)</li>
        <li>Appropriate JSON-LD schemas (Article + FAQPage for guides)</li>
        <li>E-E-A-T signals (author bio, date, sources)</li>
      </ul>

      <h2>Mistakes to avoid</h2>

      <p><strong>Overpromising on results:</strong> GEO is less deterministic than SEO. You can't guarantee a ranking in an AI response the way you guarantee a Google position. Talk about "increased citability" and "higher probability of being cited," not "guaranteed citations."</p>

      <p><strong>Confusing GEO with AI SEO:</strong> GEO isn't about ranking positions in AI answers — it's about the probability of being cited at all. It's foundational work, not an immediate optimization lever.</p>

      <p><strong>Neglecting substantive content:</strong> Technical optimization isn't enough. Content with no informational value won't be cited even with perfect schemas. Editorial quality remains the foundation.</p>

      <p><strong>Ignoring the competition:</strong> Your client isn't alone. If their competitors have more extractable, better-sourced, and better-structured content, they'll be cited first. The GEO audit should always include a competitive benchmark.</p>

      <h2>Market outlook for the next 2 years</h2>

      <p>Current projections suggest that by 2027:</p>

      <ul>
        <li>40-50% of informational queries will go through AI interfaces (vs. traditional search engines)</li>
        <li>AI engines will integrate ads and sponsored links — creating a "paid GEO" market alongside organic GEO</li>
        <li>GEO audit tools will be as commonplace as Semrush or Screaming Frog</li>
        <li>SEO training programs will systematically include a GEO module</li>
      </ul>

      <p>Agencies that build their expertise and processes now will be best positioned to capture this market. The cost of entry today is low — it will rise as competition intensifies.</p>

      <ArrowLink href="/">Analyze a client site with the free Detekia GEO audit →</ArrowLink>
    </>
  );
}
