import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

function InlineCTA({ href, children }) {
  return (
    <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 10, padding: '20px 24px', margin: '32px 0', textAlign: 'center' }}>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#8A8680', marginBottom: 12 }}>{children}</p>
      <a href={href} style={{ display: 'inline-block', background: '#D97757', color: '#fff', borderRadius: 8, padding: '11px 28px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
        Analyze my website for free →
      </a>
    </div>
  );
}

export default function FaqSchemaFaqpageComboAi() {
  return (
    <>
      <p>Across the websites we analyze, two criteria consistently show up as the easiest to improve: content extractability (25 out of 100 points) and structured data (10 points). Combined, they account for 35% of the GEO score. And the fastest way to boost both is often the same: a well-crafted FAQ page paired with FAQPage Schema markup.</p>

      <p>The problem: most website FAQs are graveyards of corporate questions nobody actually asks. "Why choose us?" is not something people type into ChatGPT. And a poorly implemented FAQPage Schema with 8-word answers or invisible content adds zero value.</p>

      <p>This guide shows you how to build FAQs that AI engines actually extract and cite, and how FAQPage Schema turns that content into a technical signal every AI crawler can read.</p>

      <h2>Why the FAQ + FAQPage Schema combo is so powerful for GEO</h2>

      <p>AI engines work by extracting answers. When someone asks ChatGPT or Perplexity a question, the AI searches its sources for a passage that answers directly, as factually as possible, in a self-contained format. That is exactly what a well-written FAQ provides: a clear question followed by a standalone answer.</p>

      <p>The question-answer format is <strong>natively extractable</strong>. The AI does not need to guess where the answer starts or ends. Each Q&amp;A pair is an independent block that can be cited as-is. It is the easiest format for an LLM to consume.</p>

      <p>In terms of the Detekia GEO score, the combo directly impacts two criteria:</p>

      <ul>
        <li><strong>Extractability and direct answer (25 points)</strong>: the FAQ provides standalone, structured passages with clear subject-verb-object sentences. This is the ideal format for AI citation.</li>
        <li><strong>Structured data (10 points)</strong>: FAQPage Schema explicitly tells the AI "this is a question and here is its answer." No more guessing the structure.</li>
      </ul>

      <p>That is 35 potential points out of 100 — often the difference between a score of 25 and a score of 55.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">For a full overview of JSON-LD schemas to implement: Schema.org and AI — the practical guide</ArrowLink>

      <h2>What an AI-optimized FAQ actually looks like (not the ones you see everywhere)</h2>

      <p>Quick test. Open the FAQ page of any corporate website. You will probably find:</p>

      <ul>
        <li>"Why choose us?" → a 3-line marketing answer with zero data</li>
        <li>"How does it work?" → a vague answer that links to another page</li>
        <li>"What are your advantages?" → a list of superlatives ("the best", "the most reliable")</li>
      </ul>

      <p>These are not FAQs. They are marketing brochures disguised as questions. AI engines ignore them because they contain nothing citable: no verifiable fact, no number, no standalone answer.</p>

      <h3>5 characteristics of a good AI question</h3>

      <ol>
        <li><strong>Natural user language</strong>: phrased the way a real person would ask ChatGPT. Not "Our return policy" but "What is the return deadline and is it free?"</li>
        <li><strong>Subject + action structure</strong>: the question contains a clear subject and a specific action. "How," "How much," "What is," "Does."</li>
        <li><strong>Specific</strong>: "How much does a yoga class cost in New York in 2026?" rather than "What are your prices?"</li>
        <li><strong>Contextualized</strong>: include geography ("in New York," "in the US") or time ("in 2026") when relevant.</li>
        <li><strong>Single and direct</strong>: one question, one answer. Avoid double questions ("How and why...").</li>
      </ol>

      <h3>5 characteristics of a good AI answer</h3>

      <ol>
        <li><strong>Standalone</strong>: understandable without reading the rest of the page. If you pasted the answer into a message, it would make sense on its own.</li>
        <li><strong>50 to 150 words</strong>: long enough to be complete, short enough to be cited in full. 8-word answers are useless; 400-word answers will never be extracted as a block.</li>
        <li><strong>Lead with the essential</strong>: the first sentence gives the answer. Details come after.</li>
        <li><strong>Factual</strong>: at least one number, duration, price, or verifiable fact. "Our classes last 60 minutes with a maximum of 15 participants" rather than "Our classes are adapted to all levels."</li>
        <li><strong>No marketing fluff</strong>: ban "we are the best," "our recognized expertise," "trust our passionate team."</li>
      </ol>

      <h2>How to find the right questions (and avoid the wrong ones)</h2>

      <p>The first mistake is making up questions in a conference room. Real questions come from your users, not your marketing team. Here are 5 concrete sources:</p>

      <ol>
        <li><strong>Google Search Console</strong>: Performance tab → filter queries containing "how," "what," "does," "how much." These are the real questions people already ask when they find your site.</li>
        <li><strong>People Also Ask (PAA)</strong>: type your main keyword in Google and look at the "People also ask" questions. Google shows them because people ask them. AI engines ask them too.</li>
        <li><strong>AnswerThePublic</strong>: enter your topic and get the most common questions, organized by type (how, why, when, how much).</li>
        <li><strong>Actual customer questions</strong>: support emails, live chat messages, sales call questions. These are the most authentic questions — and often the most specific.</li>
        <li><strong>Ask ChatGPT directly</strong>: "What are the 10 most common questions about [your topic]?" The result shows you what the AI considers the key questions in your domain.</li>
      </ol>

      <p><strong>Watch out for traps</strong>: avoid questions that are too vague ("How do I grow my business?"), questions you cannot actually answer factually, and purely promotional questions ("Why are we the best?"). If the answer does not contain at least one verifiable fact, the question is not worth including.</p>

      <h2>FAQPage Schema: technical implementation</h2>

      <p>FAQPage Schema is a JSON-LD markup that explicitly tells AI engines: "this page contains structured question-answer pairs." Without it, the AI has to guess the structure from the HTML. With it, it knows exactly what to extract.</p>

      <h3>Complete JSON-LD code</h3>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the shipping time in the US?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard shipping within the continental US takes 3 to 5 business days via USPS. Express shipping (1-2 days) is available for $12.99. Orders placed before 2 PM EST ship the same day. Free shipping on orders over $75."
      }
    },
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You have 30 days from delivery to return any item. Returns are free via prepaid USPS label. Refunds are processed within 5 business days of receiving the return. Items must be in original condition, unworn, with tags attached."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept Visa, Mastercard, American Express, PayPal and Apple Pay. Buy now, pay later is available via Klarna for orders over $50. All transactions are secured with 3D Secure protocol."
      }
    }
  ]
}
</script>`}</code></pre>

      <h3>Where to place the markup</h3>

      <p>The JSON-LD goes in the <code>&lt;head&gt;</code> of the page or just before <code>&lt;/body&gt;</code>. Both work. What matters is that the Schema content exactly matches the visible content on the page. AI engines detect inconsistencies and penalize invisible content.</p>

      <h3>Technical pitfalls to avoid</h3>

      <ul>
        <li><strong>Invisible content</strong>: NEVER put answers in the Schema that are not visible on the page. Google may penalize you, and AI engines do not trust hidden content.</li>
        <li><strong>Answers too short</strong>: a 5-word Schema answer is useless. Aim for 50 to 150 words per answer.</li>
        <li><strong>Too many questions</strong>: limit yourself to 10 questions per page. Beyond that, the signal gets diluted and the page becomes hard to parse.</li>
        <li><strong>HTML in answers</strong>: the Answer "text" field supports basic HTML (bold, links), but avoid complex structures. Keep the text readable.</li>
      </ul>

      <h3>Validation</h3>

      <p>After implementation, test your page with the <strong>Rich Results Test</strong> from Google (search.google.com/test/rich-results). It checks that the markup is valid and that answers are correctly parsed. Fix any errors before publishing.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">For implementing Organization, Article, HowTo and other schemas: complete Schema.org guide for AI</ArrowLink>

      <h2>3 concrete before/after examples</h2>

      <h3>Fashion e-commerce: "What are your shipping times?"</h3>

      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 14 }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#D97757', width: 80 }}>Before</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>"We offer several shipping options to fit your needs. Contact us to learn more!"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC', background: '#F7F5F2' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#8A8680' }}>Problem</td>
              <td style={{ padding: '14px 16px', color: '#8A8680', lineHeight: 1.6 }}>Zero numbers, zero facts. Redirects to a contact form instead of answering. Useless for AI.</td>
            </tr>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#10A37F' }}>After</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>"Standard US shipping takes 3 to 5 business days via USPS. Express 1-2 day shipping available for $12.99. Orders placed before 2 PM EST ship the same day. Free shipping on orders over $75."</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>B2B SaaS: "How does your software work?"</h3>

      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 14 }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#D97757', width: 80 }}>Before</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>"Our innovative solution supports your business every day. Request a demo to discover all its features!"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC', background: '#F7F5F2' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#8A8680' }}>Problem</td>
              <td style={{ padding: '14px 16px', color: '#8A8680', lineHeight: 1.6 }}>No information about how it actually works. "Innovative solution" means nothing. Points to a demo instead of answering.</td>
            </tr>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#10A37F' }}>After</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>"TaskFlow centralizes project management, time tracking and invoicing in one interface. Connects to Slack, Gmail and Notion in 2 clicks. Each project breaks into tasks with assignees, deadlines and real-time progress tracking. Free 14-day trial, no credit card. Used by 4,500 companies."</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Local service: "Why choose our company?"</h3>

      <div style={{ overflowX: 'auto', margin: '20px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 14 }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E5E2DC' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#D97757', width: 80 }}>Before</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>"Our passionate team puts its expertise at your service for over 20 years. Trust us!"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E2DC', background: '#F7F5F2' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#8A8680' }}>Problem</td>
              <td style={{ padding: '14px 16px', color: '#8A8680', lineHeight: 1.6 }}>Promotional question. Answer without verifiable numbers. "Passionate" and "trust us" are promotional signals that AI deprioritizes.</td>
            </tr>
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#10A37F' }}>After</td>
              <td style={{ padding: '14px 16px', color: '#3A3835', lineHeight: 1.6 }}>Better question: "Which plumber offers emergency service in downtown Chicago?" Answer: "Martin Plumbing responds within 2 hours in downtown Chicago, 7 days a week. Free on-site estimates. 890 jobs completed in 2025, Google rating 4.9/5. Service call fee: $59. Licensed, bonded and insured."</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>The pattern is the same in all three cases: replace vague, promotional phrasing with concrete facts, numbers and specific details. AI engines cite information, not slogans.</p>

      <InlineCTA href="/">Measure the impact of your FAQ on your GEO score — extractability and structured data analyzed in under 60 seconds.</InlineCTA>

      <h2>Implementation checklist in 7 steps</h2>

      <ol>
        <li><strong>Identify 5 to 10 real questions</strong> from your audience via Search Console, PAA, customer support and ChatGPT. Eliminate corporate questions nobody asks.</li>
        <li><strong>Write the answers</strong> following the 5 criteria: standalone, 50-150 words, essential first, factual, no marketing.</li>
        <li><strong>Create or improve your visible FAQ page</strong>. Content must be clearly displayed for humans, not hidden in a JavaScript accordion that crawlers cannot access.</li>
        <li><strong>Add FAQPage Schema</strong> as JSON-LD in the page head. Verify that the Schema text matches the visible content word for word.</li>
        <li><strong>Test via Rich Results Test</strong> (search.google.com/test/rich-results). Fix any markup errors. Verify all questions are detected.</li>
        <li><strong>Run a Detekia audit</strong> to measure the impact on extractability (25 points) and structured data (10 points). Compare your score before and after.</li>
        <li><strong>Update quarterly</strong>. Your users' questions evolve. Prices, timelines and numbers change too. An outdated FAQ loses credibility with AI engines.</li>
      </ol>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">Understanding the 8 GEO criteria and their weighting in the Detekia score</ArrowLink>

      <h2>Frequently asked questions</h2>

      <h3>How many questions should a FAQ have?</h3>

      <p>Between 5 and 10 questions per page. Below 5, the signal is too weak to impact your GEO score. Above 10, the content gets diluted and the page becomes harder for AI to parse. If you have more than 10 relevant questions, spread them across multiple themed pages.</p>

      <h3>Can I put the FAQ only in Schema without displaying it on the page?</h3>

      <p>No. Google has explicitly stated that FAQPage Schema content must be visible on the page. A Schema with invisible content can trigger a manual penalty. Additionally, AI engines verify consistency between markup and visible content. If they detect a mismatch, they reduce trust in the source.</p>

      <h3>Do FAQs still impact Google rich snippets in 2026?</h3>

      <p>Google restricted FAQ rich snippet display to government and health sites in 2023. But FAQPage Schema is still indexed and used by Google to understand page content. More importantly, generative AI engines (ChatGPT, Gemini, Perplexity) actively use this markup to identify and extract answers. The GEO impact is more significant than the SEO impact in 2026.</p>

      <h3>Dedicated FAQ page or FAQ integrated into each product/service page?</h3>

      <p>Both. A central FAQ page groups cross-cutting questions (shipping, payment, returns). Specific FAQs on product or service pages answer questions related to that particular offering. Each page gets its own FAQPage Schema. AI engines process each page independently — the more contextualized your FAQs are, the more likely they are to be cited for the right query.</p>

      <ArrowLink href="/blog/audit-geo-visibilite-ia">GEO Audit: how to analyze your AI visibility step by step</ArrowLink>

      <h2>Key takeaways</h2>

      <p>The FAQ + FAQPage Schema combo is the most accessible and fastest GEO lever to implement. It directly impacts 35 out of 100 points on the Detekia score (extractability + structured data). But the key is not technical — it is editorial. Real questions, factual standalone answers, and clean markup. The Schema is the container; the quality of your answers is the content.</p>

      <p>Start with your 5 most common questions. Rewrite them following the criteria in this article. Add the Schema. Measure the impact. You will see the difference within days.</p>
    </>
  );
}
