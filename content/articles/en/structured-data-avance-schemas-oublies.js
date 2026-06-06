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

export default function StructuredDataAvanceSchemasEN() {
  return (
    <>
      <p>You've implemented Organization and FAQPage on your site. You think your structured data is in order. Yet AI engines ignore you in favor of competitors using schemas you may not even know about.</p>

      <p>The Princeton study (Aggarwal et al., KDD 2024) demonstrated that content with complete structured data gets 3-5x more AI citations. But the key isn't having "some schema" — it's having the right schemas with the right fields. And 95% of sites stop at Organization and FAQPage, ignoring a dozen types that make the difference for AI engines.</p>

      <h2>Why advanced schemas matter for AI</h2>

      <p>RAG systems (Retrieval-Augmented Generation) used by ChatGPT, Perplexity, and Gemini don't read your pages like a human. They look for data structures they can extract, compare, and cross-reference. A well-populated JSON-LD schema is a trust signal: the site provides verifiable data in a standardized format.</p>

      <p>The stakes aren't traditional SEO (Google's rich snippets). It's <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">AI citability</InternalLink> — the ability of your content to be selected and cited in a generated response. And for that, advanced schemas make a measurable difference.</p>

      <h2>The schemas almost nobody implements</h2>

      <h3>1. HowTo — step-by-step guides</h3>

      <p>If your site contains tutorials, practical guides, or multi-step processes, the HowTo schema lets AI engines extract them as structured lists. It's the ideal format for direct answers. Especially effective for "how to..." queries, which represent a growing share of AI questions.</p>

      <h3>2. Review and AggregateRating — structured social proof</h3>

      <p><InternalLink href="/blog/avis-clients-temoignages-visibilite-ia">Customer reviews</InternalLink> are one of the strongest signals for AI engines. But a free-text testimonial weighs less than a structured review with rating, author, and date. AI engines cross-reference ratings across sources (your site, Trustpilot, Google Reviews).</p>

      <h3>3. Person — author expertise</h3>

      <p><InternalLink href="/blog/eeat-ia-experience-expertise">E-E-A-T authority</InternalLink> relies on author identification. A Person schema with qualifications, social links, and affiliation is a direct signal for AI engines. The <code>knowsAbout</code> field is particularly underused.</p>

      <h3>4. SpeakableSpecification — content readable by voice assistants</h3>

      <p>This schema tells AI engines which passages of your page are best suited for reading aloud. It's a direct citability signal: you designate the sentences that make the best answers.</p>

      <h3>5. DefinedTerm — your domain vocabulary</h3>

      <p>If your site uses technical or specialized vocabulary, this schema lets AI engines understand that you define terms authoritatively. Particularly powerful for B2B, legal, medical, or financial sites.</p>

      <h3>6. ItemList — rankings and comparisons</h3>

      <p>"Best...", "top 10...", "comparison..." queries are among the most frequent on AI engines. The ItemList schema structures your lists so AI can extract them directly.</p>

      <h3>7. Service and Offer — your offerings with pricing</h3>

      <p>If you sell services, the Service schema with integrated Offer (price, availability, geographic area) lets AI engines compare your offering with competitors in a structured way. For deeper implementation guidance, see our <InternalLink href="/blog/schema-org-ia-guide-pratique">complete Schema.org guide</InternalLink>.</p>

      <h2>Forgotten fields in common schemas</h2>

      <p>Even if you already use Organization or Article, certain fields are almost always empty: <code>foundingDate</code>, <code>numberOfEmployees</code>, <code>award</code>, <code>knowsAbout</code>, <code>dateModified</code>, <code>wordCount</code>, <code>citation</code>. Each one is a trust signal for AI engines.</p>

      <h2>How to prioritize implementation</h2>

      <ol>
        <li><strong>Enrich existing schemas</strong> — add missing fields to Organization and Article (1-2 hours)</li>
        <li><strong>Add Person</strong> on author and team pages (E-E-A-T impact)</li>
        <li><strong>Add HowTo</strong> on guides and tutorials (citability for "how to" queries)</li>
        <li><strong>Add Review/AggregateRating</strong> if you have customer reviews (<InternalLink href="/blog/sources-contenus-citations-ia">verifiability</InternalLink> impact)</li>
        <li><strong>Add niche schemas</strong> (DefinedTerm, Service, ItemList) based on your industry</li>
      </ol>

      <InlineCTA href="/pricing">Discover which schemas are missing on your site</InlineCTA>

      <h2>Common mistakes to avoid</h2>

      <ul>
        <li><strong>Don't duplicate schemas</strong> — one Organization per site, not one per page</li>
        <li><strong>Always validate</strong> with Google's Rich Results Test and Schema Markup Validator</li>
        <li><strong>Don't fill with invented data</strong> — AI engines cross-reference information</li>
        <li><strong>Use JSON-LD, not microdata</strong> — AI engines parse JSON-LD more easily</li>
        <li><strong>Update <code>dateModified</code></strong> on each real content change, not automatically</li>
      </ul>

      <h2>Measuring the impact of advanced schemas</h2>

      <p>The impact of structured data on AI visibility is measured via the <InternalLink href="/blog/audit-geo-visibilite-ia">AI citation test</InternalLink>. Run an audit before adding schemas for a baseline score, then re-run 2-4 weeks after implementation to measure the gain. Sites going from 0 schemas to full implementation gain on average <strong>3-5x more AI citations</strong> (Otterly.AI, 2026).</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">See how GEO scoring measures structured data →</ArrowLink>

      <h2>Conclusion</h2>

      <p>Advanced structured data isn't a technical luxury reserved for large companies. They're direct signals you send to AI engines saying: "I'm a reliable source, here's my data in a format you can verify." In a world where AI sorts billions of pages to cite just a few, these signals make the difference between being cited and being ignored.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">The complete GEO guide for 2026 →</ArrowLink>
    </>
  );
}
