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

export default function AvocatMedecinIaYmylEN() {
  return (
    <>
      <p>A patient types "left chest pain" into ChatGPT. A defendant asks Perplexity "how to contest an unfair dismissal." A taxpayer asks Gemini about "tax optimization for a real estate LLC." In all three cases, the quality of the answer can have direct consequences on the person's health, freedom, or finances.</p>

      <p>Google calls these topics <strong>YMYL: Your Money Your Life</strong>. Content whose inaccuracy can cause real harm. And this framework, designed for traditional search results, has become even more critical with AI engines.</p>

      <p>AI engines don't just list links. They synthesize, rephrase, and sometimes hallucinate. In a YMYL domain, a hallucination isn't an inconvenience — it's a danger. That's precisely why AI engines apply reinforced credibility filters on these topics.</p>

      <p><strong>Good news for regulated professions:</strong> lawyers, doctors, accountants, architects, and notaries have a considerable natural advantage. Their degrees, professional registrations, and ethical frameworks are exactly the signals AI engines look for to validate a YMYL source.</p>

      <h2>YMYL: why it's the most demanding terrain for AI</h2>

      <h3>What exactly is YMYL?</h3>

      <p>YMYL (Your Money Your Life) is a classification defined by Google in its Search Quality Rater Guidelines. It designates topics whose content can significantly affect:</p>

      <ul>
        <li><strong>Health:</strong> symptoms, diagnoses, treatments, medications, mental health</li>
        <li><strong>Financial security:</strong> investments, taxes, insurance, loans, retirement</li>
        <li><strong>Legal security:</strong> rights, procedures, contracts, disputes, criminal law</li>
        <li><strong>Physical safety:</strong> safety advice, emergency situations</li>
        <li><strong>Social well-being:</strong> civic information, elections, public services</li>
      </ul>

      <p>For these topics, Google requires a higher level of evidence. Quality Raters are instructed to systematically verify the author's credentials, the source's reliability, and compliance with professional consensus.</p>

      <h3>Why AI engines are even stricter on YMYL</h3>

      <p>AI engines have an additional problem compared to Google: they don't just recommend links, they generate answers. When ChatGPT synthesizes medical, legal, or financial information, it implicitly stakes its credibility. An error isn't a bad ranking in a list of results. It's false information presented as fact.</p>

      <p>This is why RAG systems (Retrieval-Augmented Generation) apply reinforced filters on YMYL queries:</p>

      <ul>
        <li><strong>More restrictive source selection.</strong> AI engines favor institutional sources, identified professional sites, and reference publications. An anonymous blog about employment law will be ignored in favor of a law firm's website with a named author and bar registration.</li>
        <li><strong>Enhanced cross-verification.</strong> On a medical query, AI engines triangulate more: they look for convergence between multiple reliable sources before formulating an answer. Isolated information, even if correct, is less likely to be cited.</li>
        <li><strong>Systematic disclaimers.</strong> ChatGPT, Gemini, and Perplexity add disclaimers on YMYL topics ("consult a healthcare professional," "this does not constitute legal advice"). But they still cite sources, and those sources are the ones that pass the credibility filter.</li>
      </ul>

      <ArrowLink href="/blog/eeat-ia-experience-expertise">E-E-A-T and AI: Google and ChatGPT want the same proof</ArrowLink>

      <h2>The natural advantage of regulated professions</h2>

      <p>Regulated professions (lawyers, doctors, certified accountants, architects, notaries, pharmacists) possess an asset that most content creators lack: <strong>verifiable expertise proof by default</strong>.</p>

      <h3>E-E-A-T signals built into regulated professions</h3>

      <p>Every regulated professional naturally has:</p>

      <ul>
        <li><strong>A state-recognized degree.</strong> Medical doctorate, bar exam, CPA certification. These are verifiable credentials that AI engines can validate.</li>
        <li><strong>Professional registration.</strong> Medical board, bar association, accounting board. These registrations are public databases that retrieval systems can cross-reference.</li>
        <li><strong>An ethical framework.</strong> The obligation of competence, continuing education, and professional liability constitutes a Trustworthiness signal that AI engines value.</li>
        <li><strong>Documentable field experience.</strong> Years of practice, specializations, cases handled. These are the Experience proofs that the E-E-A-T framework requires.</li>
      </ul>

      <p>The problem is that most professionals don't make these signals visible online. A lawyer with 20 years at the bar and a specialization in business law may have a website that displays none of this information in a structured way. For AI engines, it's as if these credentials don't exist.</p>

      <h3>The YMYL paradox: the most qualified are often the least visible</h3>

      <p>The professionals most qualified to discuss YMYL topics are often the least present online. Several reasons explain this paradox:</p>

      <ul>
        <li>Ethical constraints limit communication (regulated advertising for lawyers and doctors)</li>
        <li>Word-of-mouth remains the dominant acquisition channel for many firms and practitioners</li>
        <li>Lack of time and digital skills slows web investment</li>
        <li>Distrust of "digital marketing" in professions built on trust relationships</li>
      </ul>

      <p>Result: AI engines cite less qualified sources (general information sites, forums, blogs) because they don't have access to the credibility signals of real experts. It's a loss for users and a missed opportunity for professionals.</p>

      <InlineCTA href="/">
        Are you a lawyer, doctor, or accountant? Test your practice's AI visibility in 30 seconds.
      </InlineCTA>

      <h2>How AI engines evaluate YMYL content credibility</h2>

      <p>Understanding the AI selection mechanism on YMYL topics allows you to identify precise action levers. Here's how the trust chain works.</p>

      <h3>Step 1: filtering by the underlying search engine</h3>

      <p>ChatGPT relies on Bing, Gemini on Google, Perplexity on a hybrid index. These engines already apply a YMYL filter: for a query like "stroke symptoms," Bing won't surface a blog post without an identified author. It will favor recognized medical sources (NHS, Mayo Clinic, hospital sites, practitioner sites).</p>

      <p>If your site doesn't pass this first filter, it will never reach the LLM. That's why SEO fundamentals remain important in GEO.</p>

      <h3>Step 2: selection by the LLM</h3>

      <p>Once results are retrieved by the search engine, the LLM applies its own selection layer. On YMYL topics, this selection is stricter:</p>

      <ul>
        <li><strong>Author identification.</strong> The LLM looks for a named author with verifiable credentials. "Dr. Sarah Johnson, cardiologist, Mayo Clinic" is a strong signal. "The team" or no author is a weak signal.</li>
        <li><strong>Consensus consistency.</strong> The LLM checks whether the information is consistent with the medical, legal, or financial consensus it knows. Content that contradicts consensus without justification will be discarded.</li>
        <li><strong>Structure and citability.</strong> Content with JSON-LD schemas (Person, MedicalEntity, LegalService), structured FAQs, and short paragraphs is easier to extract and cite.</li>
      </ul>

      <h3>Step 3: response formulation with disclaimers</h3>

      <p>Even when an AI cites your YMYL content, it adds disclaimers. But the citation is there. And the user who reads "according to Attorney Smith, a member of the New York Bar, the statute of limitations for wrongful termination claims is typically one year (source: smithlaw.com)" has access to sourced, verifiable information.</p>

      <p>This citation is precisely what drives qualified traffic to your site. And it's the most valuable traffic: people in real need, looking for a competent professional.</p>

      <h2>Specific risks: hallucinations and erroneous recommendations</h2>

      <p>YMYL domains are where AI hallucinations have the most serious consequences. Understanding these risks reinforces the value of your presence as a reliable source.</p>

      <h3>Medical hallucinations</h3>

      <p>AI can invent drug interactions, suggest incorrect dosages, or minimize serious symptoms. A study published in JAMA in 2024 showed that LLMs provide partially incorrect medical information in 20 to 30% of cases on complex questions. When a practitioner publishes structured, sourced content, they help reduce this rate by providing AI engines with reliable data to cite.</p>

      <h3>Legal hallucinations</h3>

      <p>AI engines regularly confuse jurisdictions, cite repealed statutes, or invent case law. The widely publicized case of New York attorney Steven Schwartz (2023), whose brief contained case citations fabricated by ChatGPT, illustrates the risks. Legal content published by lawyers with precise references (statutes, dated case law, official sources) is the best protection against these errors.</p>

      <h3>Financial hallucinations</h3>

      <p>Outdated interest rates, incorrect tax thresholds, poorly explained investment mechanisms. Financial content is particularly sensitive because regulations change frequently. An accountant who maintains up-to-date content with visible modification dates provides a freshness signal that AI engines strongly value.</p>

      <p><strong>For every type of professional, an online presence isn't a luxury. It's a service to users</strong> who, without your reliable content, receive potentially inaccurate AI answers.</p>

      <h2>5 concrete actions for YMYL professionals</h2>

      <p>Here are the 5 highest-impact actions for a lawyer, doctor, accountant, or any regulated professional who wants to be cited by AI engines on their areas of expertise.</p>

      <h3>1. Create a complete author page with degrees and specializations</h3>

      <p>The author page is the foundation of your AI credibility. It should contain:</p>

      <ul>
        <li><strong>Full identity:</strong> name, professional title (Esq., Dr., CPA, etc.)</li>
        <li><strong>Degrees and training:</strong> university, year, specializations, certifications</li>
        <li><strong>Professional registration:</strong> registration number, bar or board affiliation</li>
        <li><strong>Experience:</strong> years of practice, specialization areas, career path</li>
        <li><strong>Publications:</strong> articles in specialized journals, presentations, conferences</li>
        <li><strong>Professional photo:</strong> an identifiable face strengthens trust</li>
      </ul>

      <p>Every piece of content published on your site should link to this author page. It's the link that allows AI engines to verify the author's credentials.</p>

      <h3>2. Implement the Person Schema with medical or legal credentials</h3>

      <p>The JSON-LD <code>Person</code> Schema is the structured format that AI engines parse to validate an author's identity and qualifications. For a YMYL professional, you need to go beyond the basic schema. Use <code>Physician</code> for doctors with <code>medicalSpecialty</code>, <code>qualifications</code>, and <code>memberOf</code> linking to the medical board. For lawyers, use <code>LegalService</code> alongside the <code>Person</code> schema, with bar affiliation and practice areas.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org and AI: practical guide for LLMs</ArrowLink>

      <h3>3. Publish structured medical, legal, or financial FAQs</h3>

      <p>FAQs are the most directly citable format for AI engines. A precise question with a concise, sourced answer is exactly what RAG systems look to extract.</p>

      <p>Rules for effective YMYL FAQs:</p>

      <ul>
        <li><strong>Phrase questions as your patients or clients ask them.</strong> Not "What are the modalities of the termination procedure for personal reasons?" but "Can my employer fire me without cause?"</li>
        <li><strong>Answer in 2-3 factual sentences</strong> before expanding. The first sentence should be standalone and citable.</li>
        <li><strong>Cite your sources.</strong> Statutes, clinical guidelines, case law. AI engines cite content that itself cites sources.</li>
        <li><strong>Add the FAQPage schema.</strong> Structured markup allows AI engines to parse question/answer pairs directly.</li>
        <li><strong>Date each FAQ.</strong> "Updated May 15, 2026" is a decisive freshness signal for AI engines on regulatory topics.</li>
      </ul>

      <p>A law firm that publishes 20 structured FAQs on employment law, with FAQPage schema and statutory references, becomes a go-to source for AI engines on these queries.</p>

      <h3>4. Be present in professional directories and reference databases</h3>

      <p>Professional directories play a key role in AI triangulation. When an AI engine verifies an author's credibility, it looks for consistent mentions across multiple independent sources.</p>

      <p>Priority directories by profession:</p>

      <ul>
        <li><strong>Doctors:</strong> state medical board directories, Healthgrades, Zocdoc, hospital directories</li>
        <li><strong>Lawyers:</strong> state bar directories, Martindale-Hubbell, Avvo, Chambers, Legal 500</li>
        <li><strong>Accountants:</strong> AICPA directory, state CPA society directories</li>
        <li><strong>Architects:</strong> AIA directory, state licensing board directories</li>
      </ul>

      <p>Make sure your name, specialization, and website URL are consistent across all directories. Inconsistencies (different name, different address, different specialization) weaken the trust signal.</p>

      <h3>5. Publish and get cited in specialized press</h3>

      <p>Publications in professional journals and citations in specialized press are the most powerful Authoritativeness signals for AI engines.</p>

      <p>Concrete actions:</p>

      <ul>
        <li><strong>Publish in your profession's journals.</strong> Law reviews, medical journals, accounting publications. Even a case commentary counts.</li>
        <li><strong>Respond to journalists.</strong> Platforms like HARO allow you to position yourself as an expert source. Every citation in a press article strengthens your authority in the eyes of AI engines.</li>
        <li><strong>Participate in conferences and webinars.</strong> Replays and published summaries are expertise signals that AI engines capture.</li>
        <li><strong>Write op-eds in online media.</strong> Major publications regularly feature expert opinions. A single publication in a reference media outlet can transform your perceived authority by AI engines.</li>
      </ul>

      <p>The goal is to create a network of mentions confirming your expertise. AI engines use triangulation: when your name appears as an expert on your site, in a professional directory, in a specialized journal, and in a press article, the signal is unambiguous.</p>

      <ArrowLink href="/blog/score-geo-mesurer-visibilite-ia">GEO Score: how to measure your site's AI visibility</ArrowLink>

      <h2>Case study: a law firm before and after optimization</h2>

      <h3>Initial situation</h3>

      <p>A law firm specializing in employment law. 3 partners, 15 years average experience. Website with 5 pages (home, practice areas, team, contact, legal notice). No editorial content, no JSON-LD schema, team page with first names and photos but no degrees or bar registration.</p>

      <p>AI result: when a user asks "employment lawyer" to ChatGPT or Perplexity, the firm never appears. AI engines cite directories (Avvo, Martindale) and general information sites.</p>

      <h3>Actions implemented</h3>

      <ol>
        <li><strong>Individual author pages</strong> for each partner, with degrees, bar registration, specializations, publications, and enriched Person schema</li>
        <li><strong>30 structured FAQs</strong> on employment law, with FAQPage schema, statutory references, and update dates</li>
        <li><strong>LegalService schema</strong> on the homepage with address, bar affiliation, practice areas, hours</li>
        <li><strong>Directory harmonization:</strong> profiles updated on state bar, LinkedIn, Google Business Profile, Avvo</li>
        <li><strong>2 op-eds published</strong> in specialized media with full bio and link to the site</li>
      </ol>

      <h3>Results after 8 weeks</h3>

      <p>The firm begins appearing in Perplexity answers for queries like "wrongful termination statute of limitations" and "employment tribunal compensation 2026." ChatGPT mentions it among sources when a user asks about employment law. Organic traffic increases by 40% thanks to FAQs that also rank on Google.</p>

      <p>Total investment: about 3 days of work spread over 2 months. Return: a continuous flow of qualified prospects via a channel competitors aren't exploiting yet.</p>

      <InlineCTA href="/">
        Measure your practice's AI visibility. Free GEO audit in 30 seconds.
      </InlineCTA>

      <h2>How Detekia helps YMYL professionals</h2>

      <p>Law firms, healthcare practitioners, and accountants don't have time to become GEO specialists. That's precisely Detekia's role.</p>

      <p>Our <InternalLink href="/">free GEO audit</InternalLink> analyzes your site on the 7 AI citability criteria and identifies gaps specific to YMYL sites:</p>

      <ul>
        <li><strong>Missing schema detection:</strong> Person, Physician, LegalService, FAQPage</li>
        <li><strong>Author page analysis:</strong> visible credentials, degrees, professional affiliations</li>
        <li><strong>AI accessibility check:</strong> do GPTBot, ClaudeBot, PerplexityBot have access to your content?</li>
        <li><strong>Freshness evaluation:</strong> publication and modification dates, update signals</li>
        <li><strong>Citability score by topic:</strong> on which queries does your site have a chance of being cited?</li>
      </ul>

      <p>In 30 seconds, you get a clear diagnosis with prioritized recommendations. YMYL professionals often start with a low score (due to lack of content and structured data) but progress quickly: their credentials are already there, they just need to be made visible to AI engines.</p>

      <h2>Conclusion: credibility is your best GEO asset</h2>

      <p>Regulated professions have a structural advantage in the race for AI visibility. Degrees, professional registrations, publications, field experience: everything that constitutes your professional legitimacy is exactly what AI engines look for to cite a YMYL source.</p>

      <p>The challenge isn't creating credibility. It already exists. The challenge is making it machine-readable: structured author pages, enriched JSON-LD schemas, sourced FAQs, consistent presence in professional directories.</p>

      <p><strong>3 actions to start this week:</strong></p>

      <ol>
        <li>Create or enrich your author page with degrees, bar/board registration, and specializations. Add the corresponding Person schema.</li>
        <li>Publish 5 structured FAQs on your most frequent client questions, with sources and FAQPage schema.</li>
        <li>Verify the consistency of your information across the 3 main directories of your profession.</li>
      </ol>

      <ArrowLink href="/blog/geo-guide-complet-2026">GEO: the complete guide to getting cited by AI in 2026</ArrowLink>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Schema.org and AI: practical guide for LLMs</ArrowLink>
    </>
  );
}
