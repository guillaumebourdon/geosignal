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

export default function BacklinksGeoAutoritéDomaineIa() {
  return (
    <>
      <p>Every SEO professional knows the importance of backlinks. For twenty years, inbound links have been Google's #1 authority signal. But a new question is emerging with the rise of AI engines: <strong>do ChatGPT, Perplexity, and Gemini also factor in domain authority when deciding which sites to cite?</strong></p>

      <p>The answer is yes — but not in exactly the same way as Google. And it's precisely this nuance that creates an opportunity for websites that understand it.</p>

      <h2>AI doesn't read PageRank, but it reads credibility</h2>

      <p>Unlike Google, LLMs like ChatGPT or Gemini don't have access to the link graph in real time. They don't compute PageRank. Yet recent studies show that high-authority sites are systematically overrepresented in AI responses.</p>

      <p>An Otterly.AI analysis published in early 2026, covering over 50,000 responses from ChatGPT and Perplexity, reveals that <strong>78% of cited sources have a Domain Rating (DR) above 60</strong>. Sites below DR 30 account for less than 5% of citations. This is not coincidental.</p>

      <p>The explanation is twofold. First, LLM training data overrepresents popular, heavily-linked sites — they appear more frequently in Common Crawl corpora and data partnerships. Second, the RAG (Retrieval-Augmented Generation) systems used by ChatGPT via Bing and Perplexity via its own index mechanically inherit the authority signals from the underlying search engines.</p>

      <p>In other words: even though AI doesn't "see" your backlinks directly, it's influenced by them through its information sources.</p>

      <h2>What matters to AI: authority signals in the broad sense</h2>

      <p>GEO (Generative Engine Optimization) goes beyond backlinks. AI evaluates a source's credibility through a richer set of signals than just inbound link count. Seer Interactive, in their 2025 report on Google's AI Overviews, identifies five key dimensions.</p>

      <p><strong>1. Cross-citations between trusted sources.</strong> When your site is mentioned by recognized publications (press, institutions, research papers), AI captures this signal in its corpora. It's not an <code>href</code> link that matters here, but the <em>mention</em> itself — even without a clickable link. Edelman, in its 2026 Trust Barometer, confirms that AI uses textual mentions to assess a source's notoriety.</p>

      <p><strong>2. Presence in reference databases.</strong> Wikipedia, Wikidata, Google Knowledge Graph, Crunchbase. AI relies on these structured databases to validate that an entity exists and is notable. A site associated with a well-maintained Wikidata entry benefits from a measurable advantage in AI responses.</p>

      <p><strong>3. Technical E-E-A-T signals.</strong> Author pages with bios and credentials, schema.org Organization and Person markup, press mentions, links to verifiable professional profiles. AirOps studies (2026) show that sites implementing these technical signals earn <strong>2.4x more AI citations</strong> than those that don't, at equivalent content quality.</p>

      <p><strong>4. Citation frequency in forums and communities.</strong> Reddit, Quora, Stack Overflow, Hacker News. Growth Memo documented in 2026 that Perplexity gives significant weight to sources frequently recommended in community discussions. A site regularly mentioned as a reference in relevant subreddits has a real advantage.</p>

      <p><strong>5. Classic backlinks — still relevant.</strong> Quality inbound links remain a strong signal, not because AI counts them directly, but because they feed the authority scores of search engines that AI depends on for retrieval (Bing for ChatGPT, Google for Gemini, proprietary index for Perplexity).</p>

      <InlineCTA href="/">
        Does your site have the authority signals AI looks for? Test your GEO score.
      </InlineCTA>

      <h2>GEO backlinks vs SEO backlinks: what's different</h2>

      <p>In traditional SEO, a backlink is an <code>href</code> link with anchor text, a follow/nofollow attribute, and a source page whose PageRank transfers. The mechanism is algorithmic and quantifiable.</p>

      <p>In GEO, the notion of authority is broader and fuzzier. Here are the key differences:</p>

      <ul>
        <li><strong>Unlinked mentions count.</strong> If a press article mentions your brand without linking, Google ignores it for SEO. But the LLM that ingested that article in its training corpus registered the association. That's a GEO authority signal that SEO doesn't capture.</li>
        <li><strong>Source diversity matters more than volume.</strong> 50 backlinks from a single site weigh more in SEO than 5 mentions in 5 different publications. In GEO, it's the opposite: AI values triangulation — being mentioned by varied, independent sources.</li>
        <li><strong>Semantic context matters more.</strong> A backlink from an off-topic page still had residual SEO value. For AI, a link from content thematically close to your area of expertise weighs significantly more than a generic link.</li>
        <li><strong>Community platforms are strong signals.</strong> A link from Reddit or Quora has little direct SEO value (nofollow). But for AI, these platforms are primary sources for evaluating a resource's perceived credibility.</li>
      </ul>

      <p>For more on Reddit's impact on AI citability, see our article on <InternalLink href="/blog/reddit-geo-source-ia">Reddit and GEO: why Reddit is the #1 source cited by AI</InternalLink>.</p>

      <h2>The role of E-E-A-T in GEO authority</h2>

      <p>Google's E-E-A-T framework (Experience, Expertise, Authoritativeness, Trustworthiness) directly influences AI citability. This isn't coincidental: AI relies on the same signals to judge whether a source deserves to be cited.</p>

      <p>The landmark Princeton GEO study (Aggarwal et al., KDD 2024) showed that adding <strong>authority markers</strong> to content — academic citations, data points, author credentials — increases AI citations by 30 to 40%. This signal remains one of the most powerful in the <InternalLink href="/blog/8-criteres-geo-methodologie-detekia">8-criteria GEO methodology</InternalLink>.</p>

      <p>Concretely, AI is trying to answer this implicit question: "is this source legitimate to answer this query?" The signals it uses map closely to E-E-A-T components:</p>

      <ul>
        <li><strong>Experience</strong>: testimonials, case studies, proprietary data cited by others</li>
        <li><strong>Expertise</strong>: identified author with credentials, schema.org Person, listed publications</li>
        <li><strong>Authoritativeness</strong>: mentions by trusted third parties, contextual backlinks, Wikidata presence</li>
        <li><strong>Trustworthiness</strong>: HTTPS, privacy policy, no misleading content, verified reviews</li>
      </ul>

      <p>To understand how Detekia measures these signals, see the <InternalLink href="/blog/score-geo-mesurer-visibilite-ia">complete GEO score guide</InternalLink>.</p>

      <h2>5 concrete actions to strengthen your GEO authority</h2>

      <p>GEO authority is built over time, but some actions have rapid impact. Here's an action plan prioritized by effect.</p>

      <h3>1. Structure your technical authority signals</h3>

      <p>Implement <code>Organization</code>, <code>Person</code> (author), and <code>WebSite</code> JSON-LD schemas. Add author pages with bios, credentials, and verifiable links (LinkedIn, publications). This is the technical foundation AI checks first. For a detailed implementation guide, see our article on <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org for AI</InternalLink>.</p>

      <h3>2. Establish a presence in reference databases</h3>

      <p>If your company doesn't have a Wikidata entry, create one with essential properties (entity type, official website, founder, creation date). Update your Google Business and Crunchbase profiles if applicable. These entries serve as verification checkpoints for AI.</p>

      <h3>3. Target mentions, not just links</h3>

      <p>Publish original studies, proprietary data, or analyses that others will want to cite. A report with original data points generates press mentions even without an active link building strategy. In GEO, a mention in a major publication is worth as much as a link.</p>

      <h3>4. Invest in your niche's communities</h3>

      <p>Participate in Reddit, Quora, or Stack Overflow discussions in your industry with useful, well-sourced answers. Don't self-promote — add value. AI learns that your site is a reference in your field through these organic recommendations.</p>

      <h3>5. Build contextual quality backlinks</h3>

      <p>Classic backlinks remain valuable, but target thematic relevance over volume. A link from a specialized blog in your niche with descriptive anchor text is worth more than a generic link from a DR 90 directory. That's the link AI retrieval algorithms will encounter and weight.</p>

      <InlineCTA href="/">
        Test your site's authority signals for free with the Detekia GEO audit.
      </InlineCTA>

      <h2>Conclusion: authority is now a two-front game</h2>

      <p>The era when backlinks alone could establish a site's authority is over. In 2026, authority is built on two simultaneous fronts: the classic SEO front (links, PageRank, Google indexing) and the GEO front (mentions, cross-citations, E-E-A-T signals, community presence).</p>

      <p>Sites that understand this duality have a significant competitive advantage. Those that only work on SEO are gradually losing share of voice to sites that are also cited by AI.</p>

      <p><strong>5 key takeaways:</strong></p>

      <ol>
        <li>Structure your technical authority signals (schema.org, author pages)</li>
        <li>Exist in reference databases (Wikidata, Knowledge Graph)</li>
        <li>Generate mentions from trusted publications</li>
        <li>Get recommended in your niche's communities</li>
        <li>Continue targeted, contextual link building</li>
      </ol>

      <p>GEO authority isn't a replacement for SEO. It's an additional layer that, when done right, amplifies both channels.</p>
    </>
  );
}
