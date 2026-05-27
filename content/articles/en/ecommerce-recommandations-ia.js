import Link from 'next/link';

function ArrowLink({ href, children }) {
  return (
    <p style={{ margin: '20px 0', padding: '14px 18px', background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 8, fontFamily: 'system-ui', fontSize: 14 }}>
      <span style={{ color: '#D97757', marginRight: 8 }}>→</span>
      <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

export default function EcommerceRecommandationsIa() {
  return (
    <>
      <p>"What's the best mattress for back pain?", "Which organic sunscreen is safest for kids?", "What accounting software works best for a sole proprietorship?" — millions of consumers now ask these questions to ChatGPT, Gemini, and Perplexity instead of Google.</p>

      <p>And the answers are direct product recommendations: 3 to 5 items cited by name, with specific reasons for each. If your online store doesn't appear in those answers, you're losing sales to buyers who will never visit a search engine results page.</p>

      <p>Here's the kicker: a visitor referred by an AI converts <strong>4.4 times better</strong> than a standard organic visitor. They've already made up their mind during the conversation. They're not comparison shopping anymore — they're buying. Every AI recommendation you miss is a sale handed to a competitor.</p>

      <p>This guide shows you how to optimize your e-commerce site so that AI engines recommend your products.</p>

      <h2>Why e-commerce is particularly impacted</h2>

      <p>Online retail is the sector where GEO has the most immediate impact, for three reasons.</p>

      <p><strong>Purchase queries are migrating to AI.</strong> Over 60% of US consumers say AI is more effective than traditional search engines for preparing a purchase, comparing products, or getting personalized recommendations (Pew Research, 2026). Product research is the #1 consumer use case for AI tools.</p>

      <p><strong>AI gives transactional answers.</strong> When a user asks "what's the best robot vacuum in 2026," ChatGPT doesn't respond with a list of links. It recommends 3-4 specific models, with the pros of each, price ranges, and sometimes a direct link. That's an act of prescription, not just information.</p>

      <p><strong>GEO competition in e-commerce is still low.</strong> Most online stores are optimized for SEO but not GEO. Their product pages are built for Google Shopping, not for LLMs. This is a window of opportunity: the first to optimize will capture the citations.</p>

      <h2>What AI looks for in a product page</h2>

      <p>AI engines don't read your product pages the way a human does. They look for specific information they can extract and reformulate in their answers. Here's what matters.</p>

      <h3>Factual, precise specifications</h3>

      <p>AI loves verifiable facts. The more objective data your product pages contain, the more likely they are to be cited.</p>

      <pre><code>{`❌ "A powerful and high-performance robot vacuum"

✅ "Robot vacuum with 5,000 Pa suction, 180-minute battery life,
LiDAR mapping, compatible with Alexa and Google Home.
400 ml dustbin. Noise level: 65 dB."`}</code></pre>

      <p>Every measurable spec is a hook for the AI. When a user asks "quiet robot vacuum," the AI will look for pages that mention a specific dB level.</p>

      <h3>Honest comparisons</h3>

      <p>AI engines favor content that compares objectively. If your product page mentions alternatives and explains why your product is suited for a specific use case — without bashing competitors — it will be perceived as more credible.</p>

      <pre><code>{`❌ "The best vacuum on the market, bar none"

✅ "Designed for large homes (up to 2,200 sq ft).
For smaller apartments, a more compact model may be sufficient."`}</code></pre>

      <p>This honest positioning reinforces editorial neutrality — one of the 8 GEO criteria.</p>

      <h3>Answers to purchase questions</h3>

      <p>Consumers ask highly specific questions to AI. Your product page needs to answer them directly:</p>

      <ul>
        <li>"Does [product] work for [specific use case]?"</li>
        <li>"What's the difference between [model A] and [model B]?"</li>
        <li>"Is [product] compatible with [device/situation]?"</li>
        <li>"Is [product] worth the price?"</li>
      </ul>

      <p>Embed these questions and their answers directly in your pages, ideally in a FAQ section marked up with <code>Schema FAQPage</code>.</p>

      <h2>Optimize your product pages for AI</h2>

      <h3>Step 1 — Rewrite descriptions with facts</h3>

      <p>Take your top 20 best-selling products. For each one, make sure the description includes:</p>

      <ul>
        <li><strong>An extractable opening paragraph</strong> — a sentence summarizing the product, its primary use, and its standout feature, within the first 100 words</li>
        <li><strong>Precise specifications</strong> — dimensions, weight, materials, capacities, compatibility, certifications</li>
        <li><strong>Clear positioning</strong> — who is this product ideal for? In what context?</li>
        <li><strong>Performance data</strong> — test results, lifespan, warranty</li>
      </ul>

      <p>Example of a GEO-optimized opening paragraph:</p>

      <blockquote>
        "The CeraVe Hyaluronic Acid Serum is a facial serum with 2% hyaluronic acid concentration, formulated for dehydrated and sensitive skin. Fragrance-free, dermatologist-tested, cruelty-free. 1 oz bottle, average use duration: 2 months. Made in the USA."
      </blockquote>

      <p>Every piece of information in that sentence can be individually extracted by an AI to answer a specific question.</p>

      <h3>Step 2 — Add product FAQs</h3>

      <p>Each product page should contain 3 to 5 questions and answers specific to that product. These are the questions real buyers ask — not generic filler.</p>

      <p><strong>For a mattress:</strong></p>
      <ul>
        <li>"Is this mattress good for side sleepers?" → factual answer with density and foam type</li>
        <li>"What's the difference between the Comfort and Premium models?" → criteria-based comparison</li>
        <li>"Does the mattress contain any harmful substances?" → certifications, standards (CertiPUR-US, GREENGUARD)</li>
      </ul>

      <p><strong>For a SaaS product:</strong></p>
      <ul>
        <li>"Can I import data from Excel?" → yes/no + supported formats</li>
        <li>"How many users are included in the Pro plan?" → exact number</li>
        <li>"Is there a minimum commitment?" → clear terms</li>
      </ul>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Mark up these FAQs with Schema FAQPage — see our Schema.org guide.</ArrowLink>

      <h3>Step 3 — Implement Product structured data</h3>

      <p>The <code>Product</code> schema is the most important for e-commerce. It allows AI engines to instantly understand what you're selling.</p>

      <pre><code>{`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "CeraVe Hyaluronic Acid Serum 1oz",
  "description": "Facial serum with 2% hyaluronic acid concentration, for dehydrated and sensitive skin. Fragrance-free, dermatologist-tested.",
  "brand": {
    "@type": "Brand",
    "name": "Your Brand"
  },
  "sku": "SER-AH-30",
  "offers": {
    "@type": "Offer",
    "price": "19.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://www.your-website.com/hyaluronic-acid-serum"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "312"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Sarah M." },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "Noticeably more hydrated skin after 2 weeks. Lightweight texture, absorbs quickly."
    }
  ]
}`}</code></pre>

      <p><strong>Key points:</strong></p>

      <ul>
        <li><code>aggregateRating</code> with a high <code>reviewCount</code> is a major trust signal for AI engines</li>
        <li><code>price</code> and <code>availability</code> allow AI to cite exact prices in their recommendations</li>
        <li><code>review</code> entries with concrete details (duration of use, results) are extracted more often than vague reviews</li>
      </ul>

      <h3>Step 4 — Create content-rich category pages</h3>

      <p>Product pages aren't enough. AI engines also look for buyer's guide content to structure their recommendations.</p>

      <p>Create a category page that includes:</p>

      <ul>
        <li><strong>A buyer's guide introduction</strong> — "How to choose the right [product type]: the 5 essential criteria"</li>
        <li><strong>An objective comparison table</strong> of your products by key criteria</li>
        <li><strong>Profile-based recommendations</strong> — "If you're looking for [X], go with [product A]. If your priority is [Y], [product B] is a better fit."</li>
      </ul>

      <p>This content is exactly what AI engines look for when a user asks "which [product] should I buy."</p>

      <h3>Step 5 — Enrich with structured customer reviews</h3>

      <p>Customer reviews are a credibility signal for AI. But not all reviews carry the same weight.</p>

      <p><strong>Reviews useful for GEO (often extracted by AI):</strong></p>
      <ul>
        <li>"I've been using this product for 3 months for [use case]. Result: [specific outcome]."</li>
        <li>"Compared to [competitor], this product is [factual difference]."</li>
        <li>"Strength: [X]. Weakness: [Y]. Bottom line: [conclusion]."</li>
      </ul>

      <p><strong>Reviews with low GEO value:</strong></p>
      <ul>
        <li>"Great product!!!"</li>
        <li>"5 stars, highly recommend"</li>
        <li>"Very good"</li>
      </ul>

      <p>If you collect reviews, guide your prompts to get detailed feedback: "How long have you been using this product?", "What do you use it for?", "What results have you noticed?"</p>

      <h2>Complementary pages to create</h2>

      <p>Beyond product pages, certain content pages significantly boost your GEO visibility in e-commerce.</p>

      <h3>Thematic buyer's guides</h3>

      <p>"How to choose the right [product category] in 2026: complete guide" — these articles target pre-purchase informational queries, exactly the ones users ask AI engines. Recommended structure:</p>

      <ol>
        <li>Introduction with the essential selection criteria</li>
        <li>Explanation of each criterion with concrete thresholds</li>
        <li>Comparison table of your products on those criteria</li>
        <li>Recommendations by buyer profile</li>
        <li>FAQ with the most common purchase questions</li>
      </ol>

      <h3>"Alternative to [competitor]" pages</h3>

      <p>When a user asks ChatGPT "alternative to [well-known brand]," the AI looks for pages that explicitly position themselves as alternatives. Create pages that objectively compare your offering to well-known competitors.</p>

      <p><strong>Important:</strong> stay factual. AI ignores biased comparisons. Mention your competitors' strengths too — then explain in which cases your product is the better choice.</p>

      <h3>Use case pages</h3>

      <p>"[Your product] for [specific use]" — these pages target queries like "[product] for [need]" that are extremely common in AI conversations.</p>

      <p>Examples: "Our backpacks for airplane travel (carry-on size)," "Our running shoes for overpronators," "Our CRM for real estate agencies."</p>

      <h2>Common e-commerce mistakes</h2>

      <h3>Mistake 1: Product pages that are 100% visual</h3>

      <p>Beautiful photos aren't enough for GEO. AI engines can't "see" your images — they read your text. A page with 10 photos and 2 lines of description is invisible to LLMs.</p>

      <p><strong>Fix:</strong> every product page should contain at least 200 words of factual text description, in addition to visuals.</p>

      <h3>Mistake 2: Mass-generated descriptions with no added value</h3>

      <p>Generic product descriptions ("This cotton t-shirt is comfortable and stylish") don't provide any distinctive information. AI engines ignore them because they contain nothing extractable or verifiable.</p>

      <p><strong>Fix:</strong> every description should include unique information that AI won't find elsewhere — your own tests, your comparisons, your usage recommendations.</p>

      <h3>Mistake 3: Blocking AI bots on product pages</h3>

      <p>Some e-commerce sites block all non-Google bots out of fear of price scraping. Result: ChatGPT and Perplexity can't access your pages and recommend your competitors instead.</p>

      <p><strong>Fix:</strong> allow GPTBot, ClaudeBot, and PerplexityBot in your <code>robots.txt</code>. The scraping risk is low compared to the cost of invisibility.</p>

      <ArrowLink href="/blog/llms-txt-robots-crawlabilite-ia">How to configure llms.txt, robots.txt, and AI Accessibility.</ArrowLink>

      <h3>Mistake 4: No customer reviews or unstructured reviews</h3>

      <p>Without reviews marked up with Schema <code>Review</code>/<code>AggregateRating</code>, AI engines have no social proof to evaluate your product. A competitor with 312 reviews at 4.7/5 will be cited before you, even if your product is better.</p>

      <p><strong>Fix:</strong> actively collect reviews, mark them up with structured data, and guide your customers toward detailed feedback.</p>

      <h3>Mistake 5: Ignoring comparative queries</h3>

      <p>"[Product A] vs [Product B]," "best [category] for the money," "alternative to [brand]" — these queries make up a significant share of AI conversations related to purchasing. If you don't have content that addresses them, you won't appear in those answers.</p>

      <p><strong>Fix:</strong> create honest comparisons and criteria-based buyer's guides.</p>

      <h2>2-week e-commerce action plan</h2>

      <h3>Week 1 — The fundamentals</h3>

      <ol>
        <li><strong>Day 1-2:</strong> rewrite descriptions for your top 10 best-selling products (extractable opening paragraphs, precise specs)</li>
        <li><strong>Day 3:</strong> add <code>Product</code> + <code>AggregateRating</code> Schema to those 10 pages</li>
        <li><strong>Day 4:</strong> add 3-5 FAQs per product page, marked up with <code>FAQPage</code></li>
        <li><strong>Day 5:</strong> check your <code>robots.txt</code> (unblock AI bots) + run a Detekia audit</li>
      </ol>

      <h3>Week 2 — The content</h3>

      <ol>
        <li><strong>Day 6-7:</strong> create 2 thematic buyer's guides for your main categories</li>
        <li><strong>Day 8-9:</strong> create 1 comparison page (your product vs a well-known alternative)</li>
        <li><strong>Day 10:</strong> run the Detekia audit again and measure progress</li>
      </ol>

      <h2>Frequently asked questions</h2>

      <h3>Do AI engines recommend products from small online stores?</h3>

      <p>Yes. AI engines don't favor Amazon or big-box retailers by default. They cite the most relevant and best-structured sources. A specialized store with expert product pages and proper markup can be cited ahead of an e-commerce giant with generic descriptions.</p>

      <h3>Do prices from structured data show up in AI answers?</h3>

      <p>Often, yes. When an AI recommends a product, it frequently mentions the price if it's available in structured data. That's one more reason to implement the <code>Offer</code> schema with an exact price.</p>

      <h3>Should I optimize every product page or just the best sellers?</h3>

      <p>Start with your top 20-30 best-selling or most-searched products. The effort is too significant to optimize hundreds of pages at once. Expand gradually. Each optimized page also improves your site's overall signal.</p>

      <h3>Are marketplaces (Amazon, Newegg) cited more than standalone sites?</h3>

      <p>Not necessarily. AI engines cite the most informative sources. Amazon listings are often standardized and lack detail. A specialized site with buyer's guides, comparisons, and detailed reviews has an editorial advantage that marketplaces simply don't.</p>

      <h2>Measure your e-commerce visibility</h2>

      <p>Is your online store being cited when a customer asks ChatGPT for a recommendation in your space? Find out now.</p>

      <p>Analyze your site on Detekia — score out of 100, 8 GEO criteria, prioritized recommendations. In under 60 seconds, no sign-up required.</p>
    </>
  );
}
