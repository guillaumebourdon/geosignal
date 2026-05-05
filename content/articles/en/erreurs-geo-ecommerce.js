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
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6B6762', marginBottom: 12 }}>{children}</p>
      <a href={href} style={{ display: 'inline-block', background: '#D97757', color: '#fff', borderRadius: 8, padding: '11px 28px', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
        Test my site for free →
      </a>
    </div>
  );
}

function InternalLink({ href, children }) {
  return (
    <Link href={href} style={{ color: '#D97757', textDecoration: 'none' }}
      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
    >{children}</Link>
  );
}

export default function ErreursGeoEcommerceEN() {
  return (
    <>
      <p>When a shopper asks ChatGPT "recommend a premium leather backpack for travel," the AI names 3 to 5 brands. If your store isn't on that list, you're losing a sale to a buyer who will never visit a search engine.</p>

      <p>The problem: most e-commerce sites make the same technical mistakes that make them invisible to AI engines. These mistakes are different from classic SEO errors — a site perfectly optimized for Google can be completely absent from ChatGPT, Gemini, and Perplexity responses.</p>

      <p>Here are the 5 most common mistakes, each with a clear diagnosis, measurable consequence, and technical fix.</p>

      <h2>Mistake #1 — Product pages without Schema.org Product</h2>

      <p>This is the most widespread and highest-impact error. <strong>Over 60% of e-commerce sites have no Schema.org markup on their product pages</strong> (source: <a href="https://www.schemaapp.com/schema-markup/schema-markup-statistics/" target="_blank" rel="noopener noreferrer">Schema App, 2025</a>). Without this markup, AI engines don't understand they're looking at a product with a price, availability, and brand.</p>

      <h3>The diagnosis</h3>

      <p>View source on your product page and search for <code>&lt;script type="application/ld+json"&gt;</code>. If you find nothing, or if the JSON-LD doesn't contain <code>"@type": "Product"</code>, your page is invisible to AI engines in "product recommendation" mode.</p>

      <h3>The consequence</h3>

      <p>When a user asks "what 25L leather backpack for commuting," the AI looks for pages that explicitly declare: type = product, material = leather, capacity = 25L, use = commuting. Without Schema Product, your page is an undifferentiated block of text among millions of others.</p>

      <h3>The fix</h3>

      <p>Add a complete Schema Product to every product page. Copy-paste template:</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Heritage Backpack 25L",
  "brand": { "@type": "Brand", "name": "YourBrand" },
  "description": "Full-grain leather backpack, 25 liters, 16-inch laptop compartment, 10-year warranty.",
  "material": "Full-grain leather",
  "category": "Backpacks",
  "offers": {
    "@type": "Offer",
    "price": "189.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://yourbrand.com/heritage-backpack-25l"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "142"
  }
}
</script>`}</code></pre>

      <p>Critical fields: <code>brand</code>, <code>offers</code> (with price and availability), <code>material</code>, and <code>aggregateRating</code> if you have reviews. Every filled field is one more criterion the AI can use to match your product to a query.</p>

      <ArrowLink href="/blog/schema-org-ia-guide-pratique">Complete Schema.org guide for AI visibility →</ArrowLink>

      <h2>Mistake #2 — Product descriptions that sell, not inform</h2>

      <p><strong>AI engines systematically ignore promotional content.</strong> The Princeton/KDD 2024 study on Generative Engine Optimization shows that factual, neutral content is cited 30–40% more often than marketing-heavy content.</p>

      <h3>The diagnosis</h3>

      <p>Re-read your top 5 product pages. If they contain "the best," "game-changing," "revolutionary," "unlike anything else" — you have an editorial neutrality problem.</p>

      <h3>The consequence</h3>

      <p>ChatGPT actively filters content it perceives as advertising. When recommending a product, it favors pages with <strong>verifiable facts</strong>: dimensions, materials, certifications, objective comparisons. A site that says "the best backpack on the market" will be passed over for one that says "25L full-grain leather backpack, 1.2 kg, 16-inch laptop compartment."</p>

      <h3>The fix</h3>

      <p>Rewrite descriptions using this structure:</p>

      <pre><code>{`❌ BEFORE (marketing):
"Discover our incredible premium backpack, the perfect companion
for all your travels. Exceptional quality guaranteed."

✅ AFTER (factual):
"25L full-grain vegetable-tanned leather backpack. Weight: 2.6 lbs.
Laptop compartment up to 16 inches. Quick-access exterior pocket
with magnetic closure. Adjustable ergonomic straps.
Made in France (Lyon workshop). 10-year warranty on parts
and labor. 142 customer reviews, average rating 4.7/5."`}</code></pre>

      <p>Every factual data point is a "hook" for the AI. When a user asks "lightweight leather laptop backpack made in France," the AI can match each criterion against your listing.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">The 8 GEO criteria that determine your AI visibility →</ArrowLink>

      <h2>Mistake #3 — No product FAQ or FAQPage schema</h2>

      <p><strong>FAQ-structured content is cited 30–40% more often by AI engines</strong> than continuous paragraphs (source: <a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noopener noreferrer">Aggarwal et al., Princeton/Georgia Tech, KDD 2024</a>). It's the most extractable format for an LLM: a clear question, a direct answer.</p>

      <h3>The diagnosis</h3>

      <p>Do your product pages have a FAQ section with real questions customers ask? And is that FAQ marked up with <code>Schema FAQPage</code>? If both answers are no, you're missing one of the simplest GEO optimizations.</p>

      <h3>The consequence</h3>

      <p>When a prospect asks "does this type of bag fit as airplane carry-on" or "what size for a MacBook 16 inch," the AI looks for pages that answer these sub-queries directly. Without a FAQ, your page is never the direct answer — at best it's a secondary source.</p>

      <h3>The fix</h3>

      <p>Add 3–5 FAQ questions per product page, based on real customer questions (support tickets, reviews, internal search). Mark them up with Schema FAQPage:</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does this bag meet airline carry-on requirements?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Dimensions: 17.7 × 11.8 × 7.1 inches, compliant with IATA standards for most airlines (check low-cost restrictions)."
      }
    },
    {
      "@type": "Question",
      "name": "What laptop size fits in the compartment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The compartment is 15 × 10.6 inches and fits all laptops up to 16 inches (MacBook Pro 16, Dell XPS 15, ThinkPad X1)."
      }
    },
    {
      "@type": "Question",
      "name": "Is the leather water-resistant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The full-grain leather receives a water-repellent treatment at the factory. Light rain is no problem. For prolonged exposure, we recommend our protective spray (included with purchase)."
      }
    }
  ]
}
</script>`}</code></pre>

      <p>Sources for finding good questions: your site's internal search, support tickets, review questions, Google's "People Also Ask," ChatGPT suggestions.</p>

      <ArrowLink href="/blog/faq-schema-faqpage-combo-ia">FAQ + Schema FAQPage: the combo AI cites the most →</ArrowLink>

      <InlineCTA href="/">Is your e-commerce site visible to AI engines? Find out in 30 seconds.</InlineCTA>

      <h2>Mistake #4 — Category pages with zero editorial content</h2>

      <p><strong>A category page that's just a product grid is invisible to AI engines.</strong> LLMs can't extract meaning from a list of images and prices. They need contextual text to understand what the category represents and why the products in it are relevant.</p>

      <h3>The diagnosis</h3>

      <p>Open your main category page (e.g., /backpacks). If you only see product thumbnails with no text paragraphs above or below, AI engines have nothing to extract.</p>

      <h3>The consequence</h3>

      <p>AI queries like "best backpacks for travel in 2026" or "what backpack brand should I buy" target pages that explain, compare, and guide. A grid of 48 products without context will never be cited for these queries — AI engines prefer buying guides and editorial pages.</p>

      <h3>The fix</h3>

      <p>Add 200–500 words of editorial content to each strategic category page. Recommended structure:</p>

      <ul>
        <li><strong>Introduction (2–3 sentences):</strong> what this category is, who it's for, what the selection criteria are</li>
        <li><strong>Buying guide (3–5 criteria):</strong> what to look for (material, capacity, use case, budget)</li>
        <li><strong>Buyer profiles (2–3):</strong> "If you're looking for X, check out Y" — helps the AI match the right product to the right profile</li>
        <li><strong>Category FAQ (2–3 questions):</strong> questions that apply across all products in the category</li>
      </ul>

      <p>This editorial content transforms your category page from a simple list into a citable resource. AI engines will be able to say "according to [YourBrand], the main criteria for choosing a backpack are..."</p>

      <h2>Mistake #5 — Zero authority signals (no E-E-A-T)</h2>

      <p><strong>AI engines preferentially recommend brands whose expertise and legitimacy they can verify.</strong> This is the E-E-A-T principle (Experience, Expertise, Authoritativeness, Trustworthiness) applied by Google and adopted by LLMs. Without these signals, your brand is an unverifiable unknown — and AI engines don't recommend unknowns.</p>

      <h3>The diagnosis</h3>

      <p>Check these 5 points on your site:</p>

      <ul>
        <li>About page with brand story, founders (names + backgrounds), and key metrics</li>
        <li>Complete Organization schema (founders, founding date, employee count, address)</li>
        <li>Press mentions displayed on site (logos, links to articles)</li>
        <li>Certifications and labels shown (B Corp, GOTS, Made in USA/France, etc.)</li>
        <li>Structured customer reviews visible (not just stars — real testimonials)</li>
      </ul>

      <p>If you check fewer than 3 out of 5, your authority is insufficient for AI engines.</p>

      <h3>The consequence</h3>

      <p>When ChatGPT has to choose between recommending a brand with a detailed About page, press mentions, and a complete Organization schema — and a brand it knows nothing about — it always picks the first one. 90% of AI citations come from verifiable "earned" and "owned" content (source: <a href="https://www.edelman.com/" target="_blank" rel="noopener noreferrer">Edelman, 2026</a>).</p>

      <h3>The fix</h3>

      <p>Implement a complete Organization schema and enrich your About page:</p>

      <pre><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "YourBrand",
  "url": "https://yourbrand.com",
  "logo": "https://yourbrand.com/logo.png",
  "foundingDate": "2018",
  "founder": {
    "@type": "Person",
    "name": "Jane Smith",
    "jobTitle": "Founder & Creative Director"
  },
  "description": "Premium leather goods handmade in Lyon, France. 15,000 customers, 4.7/5 on Trustpilot.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lyon",
    "addressCountry": "FR"
  },
  "sameAs": [
    "https://www.instagram.com/yourbrand",
    "https://www.linkedin.com/company/yourbrand"
  ]
}
</script>`}</code></pre>

      <p>Your About page should contain: the story (when, why, who), values (sourcing, manufacturing, commitments), numbers (customers, reviews, years in business), and proof (certifications, press, partnerships).</p>

      <ArrowLink href="/blog/audit-geo-visibilite-ia">How to audit your current AI visibility →</ArrowLink>

      <h2>The cost of inaction</h2>

      <p>Every day these 5 mistakes go unfixed, competitors who've already corrected them capture AI recommendations in your place. AI-referred traffic is growing <strong>527% year over year</strong> (source: <a href="https://previsible.io/blog/ai-referral-traffic" target="_blank" rel="noopener noreferrer">Previsible, 2025</a>) and a visitor referred by AI converts <strong>4.4x better</strong> than a standard organic visitor (source: <a href="https://www.semrush.com/" target="_blank" rel="noopener noreferrer">Semrush, 2025</a>).</p>

      <p>The good news: all 5 mistakes are fixable in under 2 weeks. Product and FAQPage schemas deploy in hours. Factual description rewrites take time but the impact is immediate once AI engines re-index your content.</p>

      <ArrowLink href="/blog/ecommerce-recommandations-ia">Complete guide: optimize your e-commerce for AI recommendations →</ArrowLink>

      <h2>FAQ</h2>

      <h3>Do these mistakes also apply to small Shopify stores?</h3>
      <p>Yes, and it's even more critical. Large marketplaces (Amazon, Walmart) already have Product schemas and thousands of reviews. Smaller brands must compensate with better factual content, specific FAQs, and niche authority. A DTC brand that explains its product better than Amazon will be cited on niche queries.</p>

      <h3>How long before I see results after fixing these?</h3>
      <p>First effects are visible in 2–4 weeks. ChatGPT with web browsing and Perplexity index content in near real-time. Model training data updates more slowly (3–6 months), but web search features compensate for this lag.</p>

      <h3>Should I fix all 5 at once or prioritize?</h3>
      <p>Prioritize: (1) Product Schema on your top 10–20 products, (2) factual rewrite of those same listings, (3) FAQ + FAQPage Schema. These 3 actions cover 80% of the impact. E-E-A-T and category pages come next.</p>

      <h3>Does my CMS automatically handle Product schemas?</h3>
      <p>Shopify, WooCommerce, and BigCommerce have plugins/apps that generate basic schemas. But "basic" isn't enough — verify that <code>material</code>, <code>brand</code>, <code>aggregateRating</code>, and <code>offers</code> are properly filled. Most plugins only populate <code>name</code> and <code>price</code>.</p>

      <h3>Won't factual descriptions bore my customers?</h3>
      <p>No. The factual approach doesn't exclude storytelling — it complements it. Keep your brand universe in the visuals and top-of-page editing. Add factual data in a structured "Specifications" or "Product Details" section. AI engines read both but only cite the factual parts.</p>
    </>
  );
}
