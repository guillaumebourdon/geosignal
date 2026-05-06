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

export default function EeatIaExperienceExpertise() {
  return (
    <>
      <p>A year ago, E-E-A-T felt like an insider acronym that only SEO specialists cared about. Experience, Expertise, Authoritativeness, Trustworthiness — four pillars defined by Google in its Search Quality Rater Guidelines to evaluate content credibility. A framework designed for human evaluators who manually rate search results.</p>

      <p>Then AI engines became real acquisition channels. And an unexpected convergence emerged: <strong>the exact proof signals that Google demands through E-E-A-T are the same ones that ChatGPT, Perplexity, and Gemini use to decide which sources to cite.</strong></p>

      <p>This is not a coincidence. It is a mechanical consequence of how retrieval-augmented AI selects its sources. And it represents a significant opportunity for websites that understand it.</p>

      <h2>E-E-A-T: a Google framework that AI adopted</h2>

      <p>Google formalized the E-E-A-T framework in December 2022, when the first "E" (Experience) was added to the former E-A-T. The Search Quality Rater Guidelines — a 176-page document updated regularly — describe how human evaluators should judge page quality.</p>

      <p>What many overlook is that these same signals have become de facto criteria for AI engines. The landmark Princeton GEO study (Aggarwal et al., KDD 2024) demonstrated that adding <strong>authority markers</strong> — citations, credentials, verifiable sources — increases AI citations by 30 to 40%. These markers are exactly what the E-E-A-T framework prescribes.</p>

      <p>The reason is straightforward. RAG (Retrieval-Augmented Generation) systems powering ChatGPT, Perplexity, and Gemini rely on underlying search engines (Bing, Google, proprietary indexes). These search engines already use E-E-A-T signals to rank results. AI mechanically inherits these preferences when selecting sources to cite.</p>

      <h2>The 4 E-E-A-T pillars through an AI lens</h2>

      <h3>Experience — "Have you actually done what you are writing about?"</h3>

      <p>Google defines Experience as evidence that the author has first-hand experience with the topic. A product review written by someone who used the product. A medical guide authored by a practitioner. A technical tutorial written by someone who implemented the solution.</p>

      <p>For AI, this signal translates to the presence of <strong>proprietary data, concrete case studies, and quantified results</strong>. An article stating "sites with FAQPage schema get more citations" is less citable than one stating "across the 200 sites we audited, those with FAQPage schema earned 2.4x more AI citations (source: AirOps, 2026)". The latter is extractable and verifiable — exactly what RAG systems look for.</p>

      <h3>Expertise — "Are you qualified to write about this?"</h3>

      <p>Expertise is demonstrated through author credentials. Google looks for author pages with biographies, certifications, and publications. Quality Raters check whether the author has documented expertise in the field.</p>

      <p>AI uses this signal in two ways. First, <code>Person</code> and <code>Organization</code> JSON-LD schemas provide retrieval systems with a verifiable structure — name, role, affiliation. Second, mentions of the author or organization in other sources (press coverage, academic publications, specialized forums) reinforce the model's confidence. For a technical implementation guide, see our article on <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org for AI</InternalLink>.</p>

      <h3>Authoritativeness — "Are you recognized by peers?"</h3>

      <p>Authoritativeness is the pillar most directly correlated with AI citability. Google measures authority through backlinks, mentions in third-party sources, and presence in reference databases (Wikidata, Knowledge Graph).</p>

      <p>For AI, authority manifests through <strong>triangulation</strong>: when multiple independent sources mention your site as a reference on a topic, RAG models identify a strong signal. Otterly.AI documented in 2026 that 78% of sources cited by ChatGPT and Perplexity have a Domain Rating above 60. Domain authority is not a direct LLM criterion, but it filters mechanically through the search engines they depend on. To go deeper: <InternalLink href="/blog/backlinks-geo-autorite-domaine-ia">Backlinks and GEO: why domain authority matters for AI too</InternalLink>.</p>

      <h3>Trustworthiness — "Can I trust you?"</h3>

      <p>Trustworthiness is the umbrella pillar — the one Google places at the center of its E-E-A-T pyramid. It encompasses transparency (legal notices, privacy policy, contact information), technical security (HTTPS, absence of deceptive content), and factual reliability (cited sources, dated data, published corrections).</p>

      <p>For AI, Trustworthiness translates to programmatically verifiable signals: SSL certificate, accessible legal pages, publication and modification dates in metadata, external sources cited in the content. A site with no publication date, no identified author, and no external source is a weak signal for RAG — it will be bypassed in favor of a more transparent source.</p>

      <h2>Why Google and LLMs converge on the same proof signals</h2>

      <p>This convergence is not philosophical. It is technical.</p>

      <p>AI engines that cite sources (ChatGPT with Browse, Perplexity, Gemini in AI Overviews) all operate on a RAG model. The process is identical: a user query gets broken into sub-queries, a search engine returns ranked results, the LLM synthesizes and cites the most relevant sources.</p>

      <p>The underlying search engines — Bing for ChatGPT, Google for Gemini, a hybrid index for Perplexity — all use quality signals that overlap with the E-E-A-T framework. The results surfaced to the LLM are therefore already pre-filtered by these criteria. The LLM then adds its own selection layer, favoring extractable, sourced, and structured content — in other words, content that demonstrates E-E-A-T proof signals.</p>

      <p>The result: a site that works on its E-E-A-T for Google mechanically improves its AI citability. And vice versa. It is the same investment for two visibility channels. To understand how this score is calculated, see the <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">complete GEO Score guide</InternalLink>.</p>

      <InlineCTA href="/">
        Is your site sending the right E-E-A-T signals to AI? Test your GEO score in 30 seconds.
      </InlineCTA>

      <h2>Checklist: 10 E-E-A-T proof signals to add to your site</h2>

      <p>Here are the concrete actions, ranked by impact on AI citability. Each one simultaneously strengthens your Google SEO and your AI visibility.</p>

      <ol>
        <li><strong>Named author on every piece of content.</strong> Full name, not "admin" or "team". Link to a dedicated author page with bio, photo, credentials, and verifiable professional links (LinkedIn, publications).</li>
        <li><strong>Person JSON-LD schema on author pages.</strong> Include <code>name</code>, <code>jobTitle</code>, <code>worksFor</code>, <code>sameAs</code> (LinkedIn, Twitter links). AI parses this structured data to validate expertise.</li>
        <li><strong>Organization JSON-LD schema on the homepage.</strong> <code>name</code>, <code>url</code>, <code>logo</code>, <code>foundingDate</code>, <code>founder</code>. This is the identity foundation that AI verifies first.</li>
        <li><strong>Visible publication AND modification dates.</strong> In the HTML and in metadata (<code>datePublished</code>, <code>dateModified</code> in JSON-LD). AI favors dated, recent content.</li>
        <li><strong>External sources cited in the body text.</strong> Links to studies, reports, reference publications. Content without external sources is a weak signal for AI — it cannot be triangulated.</li>
        <li><strong>Press mentions and partner logos.</strong> An "As seen in" or "Our partners" section with verifiable links. AI detects these authority signals in the HTML.</li>
        <li><strong>Complete trust pages.</strong> Legal notices, privacy policy, terms of service, contact page with physical address. Each missing page is a Trustworthiness point lost.</li>
        <li><strong>Strict HTTPS + security headers.</strong> Valid SSL certificate, HSTS, X-Content-Type-Options. Non-negotiable technical foundation — both Google and AI penalize insecure sites.</li>
        <li><strong>Customer reviews and testimonials with Review schema.</strong> Evidence of real-world experience, not generic quotes. <code>Review</code> markup allows AI to extract these testimonials.</li>
        <li><strong>Regularly updated content.</strong> Update older articles with fresh data and current <code>dateModified</code> values. AI devalues stale content — a 2023 article that has not been updated is invisible in 2026.</li>
      </ol>

      <h2>Case study: before and after on a service page</h2>

      <h3>Before (weak E-E-A-T signals)</h3>

      <p>Consider a typical service page from a web agency:</p>

      <ul>
        <li>Author: "The team" (no individual name)</li>
        <li>No publication date</li>
        <li>No external sources cited</li>
        <li>No JSON-LD schema</li>
        <li>No author page</li>
        <li>Minimal legal pages with no physical address</li>
      </ul>

      <p>Result: Google ranks the page on page 2. AI never cites it — no verifiable signal for RAG to latch onto.</p>

      <h3>After (E-E-A-T signals added)</h3>

      <ul>
        <li>Author: "Sarah Chen, CTO — 12 years of web development experience" with link to her author page</li>
        <li>Author page with Person schema, detailed bio, listed certifications, LinkedIn link</li>
        <li>Publication date: March 15, 2026 — Updated: May 2, 2026</li>
        <li>3 external sources cited (industry studies, sector reports)</li>
        <li>Organization schema on the homepage with founder, founding date, logo</li>
        <li>"As seen in" section with 3 linked press mentions</li>
        <li>Complete legal pages with physical address and company registration number</li>
      </ul>

      <p>Result: the page climbs to page 1 on Google. Perplexity starts citing it for queries related to its sector. ChatGPT mentions it when users ask for providers in its domain.</p>

      <p>The investment: roughly 2 hours of work. The impact: lasting across both channels.</p>

      <h2>Conclusion: one investment, two channels</h2>

      <p>E-E-A-T is no longer just an SEO concept. It has become the shared language of online credibility — the one Google uses to rank, and the one AI uses to cite.</p>

      <p>The 10 proof signals listed above are not theoretical optimizations. They are concrete, measurable signals that RAG systems programmatically verify before deciding whether your site deserves to be cited.</p>

      <p>The good news: every E-E-A-T improvement benefits both your Google rankings and your AI visibility simultaneously. It is the rare case where a single investment delivers returns on two fronts.</p>

      <p><strong>Three actions to start this week:</strong></p>

      <ol>
        <li>Add a named author with a dedicated page and Person schema to your 5 most-visited pieces of content</li>
        <li>Implement Organization schema on your homepage</li>
        <li>Measure your starting point with a <InternalLink href="/">free GEO score</InternalLink> — you will know exactly which E-E-A-T signals are missing</li>
      </ol>
    </>
  );
}
