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

export default function RechercheLocaleIaGoogleMapsLLMEN() {
  return (
    <>
      <p>"Best Italian restaurant near me." "Available plumber in Brooklyn." "Emergency dentist in Austin." These queries represent a growing share of questions asked to AI engines. And the answer no longer comes just from Google Maps. ChatGPT, Perplexity, and Gemini now integrate local data into their responses.</p>

      <p>For shops, tradespeople, freelancers, and geographically-anchored businesses, local AI visibility has become a direct business issue. Customers no longer search through directories. They ask an AI, and the AI chooses for them.</p>

      <h2>How AI engines handle local queries</h2>

      <h3>Google Gemini and Google Maps data</h3>

      <p>Gemini has a structural advantage on local queries: it directly accesses Google Maps and Google Business Profile data. When a user asks "organic hairdresser in Portland," Gemini can pull from business listings, reviews, hours, and photos to formulate an answer.</p>

      <p>Signals that matter for local Gemini:</p>

      <ul>
        <li><strong>Complete Google Business Profile</strong>: name, address, phone, hours, categories, attributes, photos</li>
        <li><strong>Google Reviews</strong>: quantity, average rating, recency, and owner responses</li>
        <li><strong>NAP consistency</strong> (Name, Address, Phone) between the website and the Google listing</li>
        <li><strong>Geographic proximity</strong> to the user's location</li>
      </ul>

      <h3>ChatGPT and Bing Maps</h3>

      <p>ChatGPT relies on Bing for its local data. Bing uses its own business listings (Bing Places) and third-party sources like Yelp, TripAdvisor, and Yellow Pages. When a user asks ChatGPT about a local business, the response combines Bing Maps data with content from websites identified as relevant.</p>

      <p>The website plays a central role for ChatGPT: unlike Gemini which can rely on the Google listing alone, ChatGPT extracts much of its information directly from your site. This is where <InternalLink href="/blog/schema-org-ia-guide-pratique">Schema.org markup</InternalLink> makes the difference.</p>

      <h3>Perplexity and Apple Maps</h3>

      <p>Perplexity doesn't have its own mapping database. It aggregates web search results and cites sources. For local queries, it tends to cite directories (Yelp, Yellow Pages), review sites, and business websites themselves. Apple Maps, meanwhile, powers Siri and relies on its own mapping data enriched by Yelp and TripAdvisor.</p>

      <p>The common thread across all these engines: <strong>they look for structured, consistent, and verifiable data</strong>. A business without an up-to-date listing, a structured website, and recent reviews is invisible to every AI engine, without exception.</p>

      <h2>The 3 pillars of local AI visibility</h2>

      <h3>1. Google Business Profile: the essential foundation</h3>

      <p>Even if your goal is visibility on ChatGPT or Perplexity, Google Business Profile remains the foundation. Your Google listing data is picked up by numerous third-party sources that feed other AI engines.</p>

      <p>Priority elements to optimize:</p>

      <ul>
        <li><strong>Categories</strong>: choose the most precise primary category possible, and add 2-3 relevant secondary categories</li>
        <li><strong>Description</strong>: write a 750-character description that includes your services, geographic area, and specialties. This is text that AI engines can extract directly.</li>
        <li><strong>Attributes</strong>: accessibility, payment methods, specific services. Each attribute is an additional piece of structured data.</li>
        <li><strong>Recent photos</strong>: multimodal AI engines (Gemini, GPT-4o) analyze images. Quality photos of your establishment, products, and team build trust.</li>
        <li><strong>Google Posts</strong>: publish regularly (1-2 times per month) to signal that the business is active</li>
      </ul>

      <h3>2. LocalBusiness Schema: the signal AI engines read first</h3>

      <p>The <code>LocalBusiness</code> schema (or its subtypes: <code>Restaurant</code>, <code>LegalService</code>, <code>MedicalBusiness</code>, <code>Store</code>) is the format AI engines parse to extract your local information. It's far more reliable than natural language text.</p>

      <p>Essential fields:</p>

      <ul>
        <li><code>name</code>, <code>address</code>, <code>telephone</code>: the basics (must match your Google listing exactly)</li>
        <li><code>openingHoursSpecification</code>: structured hours by day, readable by AI engines</li>
        <li><code>geo</code>: latitude/longitude coordinates for geographic positioning</li>
        <li><code>areaServed</code>: service area (city, county, state)</li>
        <li><code>priceRange</code>: price range indicator</li>
        <li><code>aggregateRating</code>: average rating and review count (must match verifiable reality)</li>
        <li><code>hasMap</code>: link to your Google Maps listing</li>
      </ul>

      <p>For more on advanced schemas, see our guide on the <InternalLink href="/blog/structured-data-avance-schemas-oublies">schemas that 95% of sites forget</InternalLink>.</p>

      <h3>3. Multi-source consistency: the decisive trust signal</h3>

      <p>AI engines cross-reference information across multiple sources. If your address differs between your website, Google, and Yelp, that's a negative signal. NAP (Name, Address, Phone) consistency must be perfect across:</p>

      <ul>
        <li>Your website (in the footer, contact page, and JSON-LD schema)</li>
        <li>Google Business Profile</li>
        <li>Bing Places</li>
        <li>Apple Maps (via Apple Business Connect)</li>
        <li>Yelp / TripAdvisor / Yellow Pages (depending on your industry)</li>
        <li>Professional directories in your sector</li>
        <li>Social media (LinkedIn, Facebook, Instagram)</li>
      </ul>

      <p>A single inconsistency (an old phone number, a missing suite number) can be enough to make AI engines doubt the reliability of your information.</p>

      <InlineCTA href="/pricing">Is your business visible to AI? Test your local visibility.</InlineCTA>

      <h2>Customer reviews: the #1 citation factor in local</h2>

      <p><InternalLink href="/blog/avis-clients-temoignages-visibilite-ia">Customer reviews</InternalLink> are the most powerful signal in local AI search. When a user asks "best electrician in Austin," AI engines compare reviews across potential candidates. Quantity, average rating, recency, and review content are all factored in.</p>

      <p>Priority actions:</p>

      <ul>
        <li><strong>Systematically request reviews</strong> after each service. An automated SMS or email with a direct link to your Google listing is the most effective approach.</li>
        <li><strong>Respond to all reviews</strong>, positive and negative. Responses show AI engines that the business is active and professional.</li>
        <li><strong>Diversify platforms</strong>: Google, but also Yelp, Trustpilot, or industry-specific directories. AI engines triangulate across sources.</li>
        <li><strong>Integrate reviews on your site</strong> with <code>Review</code> and <code>AggregateRating</code> schema. This is social proof that AI engines can extract directly.</li>
      </ul>

      <h2>Local content: what AI engines want to read on your site</h2>

      <p>Beyond structured data, your site's editorial content plays an important role in local <InternalLink href="/blog/sources-contenus-citations-ia">AI citability</InternalLink>. AI engines don't just read your address; they evaluate the relevance and depth of your local content.</p>

      <ul>
        <li><strong>Geographic service pages</strong>: if you serve multiple cities, create a page per area with specific content (not duplicated content with just the city name swapped)</li>
        <li><strong>Local FAQs</strong>: "How much does a plumber cost in Austin?", "When is the best time to prune hedges in Portland?" — these localized questions are exactly what users ask AI engines</li>
        <li><strong>Local news</strong>: participation in local events, partnerships with neighborhood businesses, community involvement. This content reinforces your geographic anchoring.</li>
        <li><strong>Localized case studies</strong>: "Complete renovation of a Victorian home in San Francisco's Mission District" is far more citable than "Our renovation services"</li>
      </ul>

      <h2>Checklist: 10 actions for local AI visibility</h2>

      <ol>
        <li>Create or complete your Google Business Profile (100% of fields filled)</li>
        <li>Claim your listing on Bing Places and Apple Business Connect</li>
        <li>Implement <code>LocalBusiness</code> schema on your site with all essential fields</li>
        <li>Verify NAP consistency across all your online presences</li>
        <li>Set up an automated review collection system</li>
        <li>Respond to all existing reviews (positive and negative)</li>
        <li>Create geographic service pages if you cover multiple areas</li>
        <li>Publish 5-10 localized FAQs with FAQPage schema</li>
        <li>Add recent, quality photos on Google and your site</li>
        <li>Verify your hours are up-to-date everywhere (including holidays)</li>
      </ol>

      <h2>The mistake to avoid: neglecting your website</h2>

      <p>Many businesses think Google Business Profile is enough. It's not. Google Maps feeds Gemini, but ChatGPT and Perplexity primarily rely on your website content. Without a structured site with LocalBusiness schema, FAQs, and local content, you're visible on one AI engine instead of four.</p>

      <p>Your website is the only asset you control 100%. Google, Bing, or Apple listings can change their rules tomorrow. Your site remains your permanent anchor point for AI visibility.</p>

      <ArrowLink href="/blog/8-criteres-geo-methodologie-detekia">See how GEO scoring measures local visibility</ArrowLink>

      <h2>Conclusion</h2>

      <p>Local search is shifting toward conversational AI. Google Maps remains central, but ChatGPT, Perplexity, and Siri have become full-fledged channels for discovering local businesses and services. Businesses that optimize their presence across all these engines — with consistent structured data, recent reviews, and quality local content — capture a growing share of customers that their competitors don't even see coming.</p>

      <ArrowLink href="/blog/geo-guide-complet-2026">The complete GEO guide for 2026</ArrowLink>
    </>
  );
}
