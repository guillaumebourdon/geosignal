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
        Analyze my website for free →
      </a>
    </div>
  );
}

export default function SourcesContenusCitationsIa() {
  return (
    <>
      <p>When ChatGPT, Perplexity, or Gemini generate a response, they do not guess. They retrieve fragments of web content, cross-reference them, and only cite the ones they can verify. The underlying mechanism — RAG (Retrieval-Augmented Generation) — works like a built-in fact-checking reflex: if a piece of content makes a claim without a source, the model cannot triangulate it. It moves on to content that cites its references.</p>

      <p>This behavior is measurable. The landmark Princeton GEO study (Aggarwal et al., KDD 2024) demonstrated that <strong>adding citations and statistics to content increases AI citability by 30 to 40%</strong>. AirOps 2026 data confirms that content with verifiable external sources earns 2.4x more AI citations than unsourced content.</p>

      <p>The implication for content creators is clear: in 2026, adding sources is no longer an academic exercise. It is a concrete visibility lever for both Google SEO and GEO.</p>

      <h2>Why sources matter more than ever in 2026</h2>

      <p>Two forces are converging to make sourcing a first-tier ranking factor.</p>

      <p><strong>On the Google side: E-E-A-T.</strong> Google's Search Quality Rater Guidelines emphasize Trustworthiness — the factual reliability of content. An article that cites its sources, attributes its data, and dates its statistics sends exactly the signals Google is looking for. The Edelman Trust Barometer 2026 shows that 64% of users say they trust content more when it cites its sources. Google follows this trend by rewarding pages that are transparent about where their information comes from. For a deeper dive into this framework, see our article on <InternalLink href="/blog/eeat-ia-experience-expertise">E-E-A-T and AI</InternalLink>.</p>

      <p><strong>On the AI side: RAG and verifiability.</strong> The RAG systems powering ChatGPT, Perplexity, and Gemini operate in three stages: retrieval, selection, generation. At the selection stage, the model evaluates the reliability of each retrieved fragment. Content that cites a study with author, date, and institution gives the model a verifiable anchor. Content that claims "experts say..." without specifying which experts is a weak signal — RAG cannot cross-reference it and skips it.</p>

      <p>The result: sources have become the convergence point between SEO and GEO. A single effort — properly sourcing your content — improves your positioning on both channels.</p>

      <h2>The 5 source types that maximize AI citability</h2>

      <p>Not all sources carry equal weight with AI. Here are the five categories that generate the most citations, ranked by impact.</p>

      <h3>1. Academic studies and research papers</h3>

      <p>Peer-reviewed publications are the strongest signal for RAG systems. The Princeton study (Aggarwal et al., KDD 2024) showed that content citing academic research earns the highest citability scores. The reason: these sources are indexed in structured databases (Google Scholar, Semantic Scholar) that AI can cross-reference independently.</p>

      <p><strong>Example:</strong> "Adding statistics and citations increases AI visibility by 40% (Aggarwal et al., KDD 2024)" is infinitely more citable than "studies show that citations improve visibility".</p>

      <h3>2. Quantified data and dated statistics</h3>

      <p>AI engines prioritize fragments containing precise, dated numbers. AirOps 2026 data shows that content with at least 3 sourced statistics earns 2.4 times more citations. Every figure must be attributed to an identifiable source and dated.</p>

      <p><strong>Example:</strong> "78% of sources cited by ChatGPT have a Domain Rating above 60 (Otterly.AI, 2026)" is a self-contained fragment that RAG can extract and cite directly.</p>

      <h3>3. Institutional sources and industry reports</h3>

      <p>Reports published by recognized institutions (Edelman, Gartner, McKinsey) or specialized platforms (Seer Interactive, Growth Memo) benefit from high domain authority. AI gives them disproportionate weight because the underlying search engines (Bing, Google) already rank them at the top. Growth Memo documented that the first 30% of a page's text provides 44.2% of AI citations — a finding that applies especially to content that leads with institutional sources.</p>

      <h3>4. Named experts with verifiable credentials</h3>

      <p>Citing an expert by full name, title, and affiliation gives AI a verifiable expertise signal. The <code>Person</code> JSON-LD schema allows retrieval systems to validate this information. Content that writes "according to experts" is invisible. Content that writes "according to Marie Haynes, SEO consultant and author of EAT and SEO" is verifiable and therefore citable.</p>

      <h3>5. Case studies and proprietary data</h3>

      <p>Concrete cases with quantified results constitute proof of Experience in the E-E-A-T sense. Content that states "our audit of 200 sites shows that those with FAQPage schema earn 2.4x more AI citations (AirOps, 2026)" combines proprietary data with an external source — the strongest possible signal for AI. Seer Interactive observed that pages containing case studies with specific metrics appear 3 times more often in Perplexity responses.</p>

      <h2>How to integrate sources: 8 best practices</h2>

      <h3>1. Cite inline, not in footnotes</h3>

      <p>AI extracts fragments of 40 to 60 words. If the source sits in a footnote, it gets separated from the fragment and loses its verification value. Embed the reference directly in the sentence: "according to the Princeton study (Aggarwal et al., KDD 2024)" rather than a footnote marker.</p>

      <h3>2. Date every source</h3>

      <p>A statistic without a date is useless to AI. RAG models favor recent data. "64% of users trust sourced content (Edelman, 2026)" is more citable than "64% of users trust sourced content" with no date attached.</p>

      <h3>3. Link to the primary source</h3>

      <p>An outbound link to the original publication allows RAG to verify the information. Otterly.AI 2026 data confirms that content with outbound links to reliable sources gets cited more than content that mentions a source without linking to it. This is also a positive SEO signal — Google rewards relevant outbound links.</p>

      <h3>4. Name the authors and institutions</h3>

      <p>Avoid vague formulations: "researchers have shown", "a study reveals". Use instead: "Aggarwal et al. (Princeton, KDD 2024) demonstrated". The name provides an anchor that AI can cross-reference in its index.</p>

      <h3>5. Use precise numbers</h3>

      <p>"Significant increase" means nothing to RAG. "40% increase" is an extractable fragment. AirOps 2026 data shows that content with precise figures gets cited 2.4 times more often than content with qualitative statements.</p>

      <h3>6. Add publication and modification dates</h3>

      <p>AI skips undated content. Add <code>datePublished</code> and <code>dateModified</code> to your JSON-LD metadata and make these dates visible in the HTML. Content updated in 2026 with a displayed date will be preferred over undated content, even if the latter is actually newer. For technical implementation, see our guide on <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org for AI</InternalLink>.</p>

      <h3>7. Structure for extraction</h3>

      <p>Every section should be citable on its own. Open each H2 with a 40-to-60-word "answer capsule" containing the key information and the source. The text that follows adds depth, but the extractable fragment lives in the opening sentences. To understand how AI selects these fragments, see <InternalLink href="/blog/comment-chatgpt-choisit-ses-sources">how ChatGPT chooses its sources</InternalLink>.</p>

      <h3>8. Implement Article schema with citations</h3>

      <p>The <code>Article</code> JSON-LD schema supports a <code>citation</code> property that lets you list references in a structured format. AI parses this structured data before it even reads the content. An article with <code>citation</code> schema sends a reliability signal at the retrieval stage itself.</p>

      <InlineCTA href="/">
        Does your content cite enough sources to be picked up by AI? Test your GEO score in 30 seconds.
      </InlineCTA>

      <h2>Before and after: a page without sources vs with sources</h2>

      <h3>Before (zero sources)</h3>

      <p>Consider a typical article on a B2B blog:</p>

      <ul>
        <li>"Companies need to optimize their website for AI"</li>
        <li>"Experts recommend adding structured data"</li>
        <li>"AI visibility is becoming increasingly important"</li>
        <li>No publication date</li>
        <li>No outbound links</li>
        <li>Author: "The marketing team"</li>
      </ul>

      <p>Result: Google ranks the page on page 2. ChatGPT and Perplexity never cite it — no verifiable fragment for RAG to work with.</p>

      <h3>After (sources integrated)</h3>

      <ul>
        <li>"Adding citations and statistics increases AI citability by 40% (Aggarwal et al., KDD 2024)"</li>
        <li>"78% of sources cited by ChatGPT have a Domain Rating above 60 (Otterly.AI, 2026)"</li>
        <li>"Content with verifiable sources earns 2.4x more citations (AirOps, 2026)"</li>
        <li>Publication date: May 7, 2026</li>
        <li>3 outbound links to original publications</li>
        <li>Author: "Guillaume Bourdon, Detekia founder" with link to author page</li>
      </ul>

      <p>Result: the page climbs to page 1. Perplexity starts citing it. ChatGPT uses it as a source when asked about the topic. The investment: 45 minutes of editorial work. The impact: measurable across both channels.</p>

      <h2>Conclusion: source it to score it</h2>

      <p>In 2026, sources are no longer an editorial afterthought. They are a visibility lever. Every attributed citation, every dated statistic, every link to a reference publication sends a signal that AI can verify — and therefore use to cite you.</p>

      <p>The SEO-GEO convergence makes this investment doubly profitable. Google rewards sourced content through E-E-A-T. AI cites it through RAG. One effort, two visibility channels.</p>

      <p><strong>Three actions to start this week:</strong></p>

      <ol>
        <li>Revisit your 5 most-visited articles and add at least 3 attributed, dated external sources to each</li>
        <li>Check that every H2 opens with an extractable 40-to-60-word fragment containing a source</li>
        <li>Measure your starting point with a <InternalLink href="/">free GEO score</InternalLink> — you will know exactly which sourcing signals are missing</li>
      </ol>
    </>
  );
}
