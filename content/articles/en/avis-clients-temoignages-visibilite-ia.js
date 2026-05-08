import Link from 'next/link';

function InternalLink({ href, children }) {
  return (
    <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}
      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
    >{children}</Link>
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

export default function AvisClientsTemoignagesVisibiliteIa() {
  return (
    <>
      <p>When a user asks ChatGPT "what's the best CRM for small businesses?" or Perplexity "which SEO agency to recommend in London?", AI engines don't just analyze product pages. They look for social proof: customer reviews, testimonials, verifiable ratings. A site displaying 47 reviews with an average rating of 4.7/5 sends a trust signal that AI can quantify. A site with no reviews is a weak signal — nothing to verify, nothing to cite.</p>

      <p>This behavior is measurable. BrightLocal 2025 data shows that <strong>87% of consumers read online reviews before a purchase</strong>, and AI engines replicate exactly this reflex. Otterly.AI 2026 data confirms that sites with Schema.org structured reviews get <strong>35% more AI citations</strong> compared to sites without reviews. The reason is mechanical: the RAG (Retrieval-Augmented Generation) system powering ChatGPT, Gemini and Perplexity treats reviews as cross-checkable reliability signals.</p>

      <p>In 2026, customer reviews are no longer just a conversion lever. They are a full-fledged AI visibility criterion.</p>

      <h2>Why AI engines rely on customer reviews</h2>

      <p>The RAG systems powering ChatGPT, Perplexity and Gemini responses work in three stages: search, selection, generation. At the selection stage, the model evaluates the reliability of each retrieved fragment. Customer reviews play a role at this stage in two distinct ways.</p>

      <p><strong>Quantifiable social proof signal.</strong> A customer review with a name, date and rating provides the model with a verifiable data point. When ChatGPT needs to recommend a tool, it can't test the product itself. It relies on reviews as a quality proxy. Spiegel Research Center data shows that displaying reviews increases conversion rates by 270% — AI applies similar logic for citability.</p>

      <p><strong>Convergence with E-E-A-T.</strong> Google's E-E-A-T framework places Experience as the first criterion. Customer reviews are the most direct proof that a product or service has been used by real people. Google and AI engines evaluate this signal the same way: a site with detailed, dated and attributed testimonials gets a higher reliability score. To learn more about this framework, check our article on <InternalLink href="/blog/eeat-ia-experience-expertise">E-E-A-T and AI</InternalLink>.</p>

      <p><strong>Volume as an authority signal.</strong> PowerReviews 2024 data shows that 43% of consumers filter by a minimum 4-star rating. AI replicates this behavior: a product with 200 reviews and a 4.6/5 rating will be cited before a product with 3 reviews and a 5/5 rating. Volume validates the statistical representativeness of the rating.</p>

      <h2>The 4 review types that maximize AI citability</h2>

      <h3>1. Structured reviews with Schema Review markup</h3>

      <p>The <code>Schema.org/Review</code> and <code>AggregateRating</code> markup allows AI to read your reviews programmatically before even parsing the text content. A site with proper JSON-LD schema sends an exploitable signal from the retrieval phase:</p>

      <ul>
        <li><code>reviewCount</code>: total number of reviews</li>
        <li><code>ratingValue</code>: average rating</li>
        <li><code>bestRating</code> / <code>worstRating</code>: rating scale</li>
        <li><code>author</code>: customer name (type <code>Person</code>)</li>
        <li><code>datePublished</code>: review date</li>
      </ul>

      <p>Otterly.AI 2026 data shows that pages with correctly implemented <code>AggregateRating</code> schema get 35% more AI citations. Without this markup, AI has to guess the rating from HTML — a less reliable process that reduces your chances of being cited. For technical implementation, check our guide on <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org for AI</InternalLink>.</p>

      <h3>2. Detailed testimonials with measurable results</h3>

      <p>A generic testimonial ("Great product, highly recommend!") provides no exploitable signal for AI. A testimonial with concrete results is a directly citable fragment:</p>

      <ul>
        <li><strong>Weak:</strong> "Very satisfied with the service, responsive team"</li>
        <li><strong>Strong:</strong> "Since implementing [Tool], our conversion rate went from 2.1% to 3.8% in 4 months — Marie Dupont, Marketing Director, SaaS Corp"</li>
      </ul>

      <p>The second format provides a verifiable number, a full name, a title and a company. RAG can extract this fragment and cite it directly in a response. Seer Interactive data shows that pages containing testimonials with specific metrics appear 2.8 times more often in AI responses.</p>

      <h3>3. Reviews on third-party platforms</h3>

      <p>Google Business Profile, Trustpilot, G2, Capterra — these platforms have high domain authority that AI recognizes. A G2 profile with 150 reviews and a 4.5/5 rating is a signal ChatGPT can cross-check independently from your own site. G2 data shows that 92% of B2B buyers check reviews before purchasing — AI replicates this journey.</p>

      <p>The optimal strategy combines on-site reviews (with schema) and third-party platform reviews. One reinforces the other: on-site reviews feed the RAG when it crawls your site, third-party reviews provide an independent cross-check point.</p>

      <h3>4. Structured customer case studies</h3>

      <p>A case study is an in-depth testimonial with context, method and results. It's the most citable format for AI because it provides a complete and verifiable narrative. Optimal structure:</p>

      <ol>
        <li><strong>Context:</strong> industry, company size, initial problem</li>
        <li><strong>Solution:</strong> what was implemented</li>
        <li><strong>Results:</strong> before/after metrics with timelines</li>
        <li><strong>Client quote:</strong> attributed verbatim with name and title</li>
      </ol>

      <p>Content Marketing Institute 2025 data shows that case studies are the most effective B2B format for conversion — and AI treats them as the strongest proof of Experience in the E-E-A-T sense.</p>

      <InlineCTA href="/">
        Are your customer reviews visible to AI? Test your GEO score in 30 seconds.
      </InlineCTA>

      <h2>How to optimize your reviews for AI visibility: 6 concrete actions</h2>

      <h3>1. Implement AggregateRating and Review schema</h3>

      <p>Every product or service page should include <code>AggregateRating</code> JSON-LD markup with review count, average rating and scale. Each individual review should be marked up with <code>Review</code> including author, date and rating. AI parses this structured data before text content — it's your first entry point.</p>

      <h3>2. Display reviews on product pages, not on a dedicated page</h3>

      <p>AI analyzes pages individually. If your reviews are on a separate "/testimonials" page, they're not associated with the relevant product or service. Integrate reviews directly on each product or service page — RAG connects the page content with the displayed social proof.</p>

      <h3>3. Request testimonials with measurable results</h3>

      <p>When asking a client for a testimonial, guide them with specific questions: "What concrete result did you achieve?", "In how much time?", "What was your starting point?". A testimonial with numbers is 2.8 times more cited by AI than a qualitative one (Seer Interactive, 2025).</p>

      <h3>4. Date and attribute every review</h3>

      <p>A review without a date is worthless to AI. RAG models favor recent content. A 2026 review with full name and company is infinitely more citable than an anonymous undated review. Systematically add: first name, last name, title, company, date.</p>

      <h3>5. Maintain an active presence on third-party platforms</h3>

      <p>Google Business Profile is the priority for local. G2 and Capterra for B2B SaaS. Trustpilot for e-commerce. Reply to every review — AI detects active vs abandoned profiles. BrightLocal 2025 data shows that 88% of consumers trust businesses that respond to reviews more.</p>

      <h3>6. Integrate client quotes into editorial content</h3>

      <p>Don't limit testimonials to product pages. Include client quotes in your blog posts, guides and reference pages. An article that writes "Our clients have seen an average 40% improvement in AI citation rate after optimization — Pierre Martin, CTO, TechCorp" is more citable than an article without client proof. This approach aligns with the sourcing best practices detailed in our article on <InternalLink href="/blog/sources-contenus-citations-ia">adding sources to your content</InternalLink>.</p>

      <h2>Mistakes that cancel the impact of reviews</h2>

      <h3>Fake reviews and generic reviews</h3>

      <p>AI is trained to detect fake review patterns: overly generic language, suspicious volume spikes, exclusively 5/5 ratings. Google removed over 115 million fake reviews in 2023 (Google Transparency Report). AI applies similar filters — a too-perfect review profile is a negative signal.</p>

      <h3>Reviews without schema markup</h3>

      <p>Displaying reviews in plain HTML without Schema.org markup is like having quality content without H2 tags — AI can't parse it efficiently. Without <code>AggregateRating</code>, your 4.8/5 rating based on 300 reviews is invisible to RAG at the retrieval phase.</p>

      <h3>Ignoring negative reviews</h3>

      <p>A profile with only 5-star reviews is suspicious. Northwestern University data shows that the optimal conversion rating falls between 4.2 and 4.5 — not 5.0. AI applies the same logic: a few negative reviews with constructive responses actually strengthen credibility rather than diminish it.</p>

      <h3>Centralizing all reviews on a single page</h3>

      <p>A "/reviews" or "/testimonials" page that concentrates all client feedback is a GEO mistake. AI evaluates each page independently. A review about your CRM should be on the CRM page, not on a generic page. Distribute relevant reviews across each product or service page.</p>

      <h2>Customer reviews and local search: the double lever</h2>

      <p>For local businesses, Google Business Profile reviews are a particularly powerful AI visibility lever. When a user asks ChatGPT "best Italian restaurant in Manchester" or Gemini "trusted plumber in Bristol", AI heavily relies on Google Business listings.</p>

      <p>BrightLocal 2025 data shows that Google reviews are the #1 ranking factor in the local pack. AI replicates this hierarchy: <strong>review count, average rating, review freshness and owner responses</strong> are the four signals models evaluate for local queries.</p>

      <p><strong>Action item:</strong> aim for a minimum of 50 Google reviews with a rating above 4.2. Reply to every review within 48 hours. Encourage detailed reviews rather than simple ratings — longer testimonials provide fragments that AI can extract and cite.</p>

      <h2>Measuring the impact of reviews on AI visibility</h2>

      <p>The impact of reviews on AI citability can be measured at three levels:</p>

      <ol>
        <li><strong>GEO Score:</strong> a <InternalLink href="/">Detekia GEO audit</InternalLink> measures the presence of Review/AggregateRating schema and the quality of your social proof signals</li>
        <li><strong>Citation test:</strong> query ChatGPT and Perplexity about your industry and geographical area. Note whether your business is cited and what information is used (rating, review count, specific testimonials)</li>
        <li><strong>Before/after citation rate:</strong> measure your AI visibility before optimizing your reviews, then 4 to 6 weeks after. AirOps data shows an average delay of 3 to 5 weeks before review optimizations impact AI citations</li>
      </ol>

      <h2>Conclusion: your clients speak, AI listens</h2>

      <p>In 2026, every customer review is a citability signal. AI can't test your products — it relies on feedback from those who have. A site with structured, dated, attributed reviews distributed across the right pages sends exactly the signals that ChatGPT, Perplexity and Gemini look for when formulating a recommendation.</p>

      <p>The SEO-GEO convergence makes this investment doubly profitable. Google values reviews through E-E-A-T and rich snippets. AI uses them as reliability proof in RAG. A single effort — structuring and optimizing your reviews — improves your visibility on both channels.</p>

      <p><strong>3 actions to launch this week:</strong></p>

      <ol>
        <li>Implement <code>AggregateRating</code> and <code>Review</code> schema on your top 5 product/service pages</li>
        <li>Contact 10 satisfied clients and ask them for a testimonial with measurable results — integrate them directly on the relevant pages</li>
        <li>Measure your starting point with a <InternalLink href="/">free GEO scoring</InternalLink> — you'll immediately see if your social proof signals are detected by AI</li>
      </ol>
    </>
  );
}
