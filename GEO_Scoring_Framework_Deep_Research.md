# Deep Research: Building the Ideal GEO Scoring Framework

## How to Score & Audit a Website's AI Visibility

---

## 1. EXISTING GEO AUDIT TOOLS AND THEIR METHODOLOGIES

### Otterly.AI — The Most Detailed Public Methodology

Otterly.AI (named a 2025 Gartner Cool Vendor) offers the most transparent GEO audit methodology publicly available. Their GEO Audit 2.0 (July 2025) scores pages across **25+ AI-visibility factors** organized into three core metrics:

- **Static Content Score** — evaluates the raw content on the page
- **AI Readiness Score** — measures whether content is clear, coherent, modular, and aligned with how AI systems consume information (sentence structure, length, flow, scannability)
- **Structured Data Score** — evaluates schema markup implementation

The audit is divided into two sections: a **Crawlability Checker** (can AI bots find and access your content?) and a **Content Checker** (is the content machine-readable and citable?). Factors include fluency, authority, and technical structure.

**Audit types:** Domain Audit (top 20 pages from sitemap) and URL Audit (specific URLs).

Sources:
- [Otterly.AI GEO Audit Launch](https://otterly.ai/blog/generative-engine-optimization-audit/)
- [Otterly.AI GEO Audit 2.0 Rebuild](https://otterly.ai/blog/geo-audit-crawlability-content-checker/)
- [Otterly.AI Help: What the GEO Audit Does](https://help.otterly.ai/what-does-the-geo-audit-do)
- [Otterly.AI Help: Readiness Analysis](https://help.otterly.ai/ai-readiness)

### Semrush — AI Visibility Index

Semrush launched **Semrush One** (Q4 2025) unifying traditional SEO with GEO capabilities:

- **AI Visibility Score**: 0-100 score reflecting brand presence in AI-generated answers, measuring mention frequency compared to the median for competitors in your industry
- **Share of Voice (SoV)**: Updated October 2025 to reflect prompt volume (how often a prompt is searched)
- **Methodology**: Built on what Semrush claims is the world's largest database of LLM prompts, via direct API integration with AI platforms, user behavior analysis, synthetic prompt generation, and continuous daily monitoring

Source: [Semrush AI Visibility Index](https://ai-visibility-index.semrush.com/)

### Ahrefs — Brand Radar

- **Brand Radar**: Monitors **150M+ prompts** across 6 AI platforms (ChatGPT, Perplexity, Gemini, Copilot, AI Overviews, AI Mode)
- Specializes in backlink-correlated AI visibility tracking
- Weekly updates with emphasis on citation source analysis

Source: [Ahrefs vs Semrush comparison](https://genesysgrowth.com/blog/ahrefs-ai-vs-semrush-vs-frase)

### Profound

- Purpose-built **Answer Engine Optimization (AEO)** platform
- Captures actual user interactions with AI engines (ChatGPT, Gemini, Bing AI) in real-time
- Measures **"reference rates"** for brand appearances in AI responses
- Provides: AI visibility scores, share-of-voice metrics, source/citation breakdowns, prompt-level insights with historical trends
- **Weakness noted**: Visibility and prominence scores lack clear weighting, making interpretation less intuitive

Sources:
- [Profound vs AirOps](https://www.tryprofound.com/blog/profound-vs-airops)
- [Profound Blog: Best GEO Tools](https://www.tryprofound.com/blog/best-generative-engine-optimization-tools)

### AirOps

- More focused on **actionable workflows and content execution** than pure measurement
- Combines AI visibility tracking with content automation
- Positioned as more practical for growth-focused teams vs. Profound's analytics-heavy approach

Source: [AirOps AI Visibility Tools](https://www.airops.com/blog/ai-brand-visibility-tracking-tools)

### Geoptie — Free GEO Audit Tool

Evaluates **six critical factors** with clear score thresholds:

1. **Citation Readiness** — how likely AI engines are to cite your content
2. **Answer Alignment** — how well content answers common queries
3. **Knowledge Graph Optimization** — structured data implementation
4. **Content Authority** — trust signals and expertise indicators
5. **Technical Optimization** — speed, mobile-friendliness, accessibility
6. **Competitive Positioning** — ranking against competitors in AI search

**Score ranges:**
- 85-100: AI-Optimized (primed for AI citation)
- 70-84: AI-Ready (minor optimizations needed)
- 55-69: Needs Optimization (significant improvements required)
- Below 55: Not AI-Optimized (major overhaul necessary)

Source: [Geoptie Free GEO Audit](https://geoptie.com/free-geo-audit)

---

## 2. THE AI CITATION PIPELINE — How LLMs Select What to Cite

### The RAG (Retrieval-Augmented Generation) Pipeline

All major AI platforms use some variant of RAG, but the implementations differ significantly:

**Phase 1: Retrieval**
- User query is converted into a vector embedding
- System searches a vector database for semantically similar documents/passages
- Returns a ranked list of candidate documents
- Reranking algorithms further refine the results

**Phase 2: Generation**
- Top-ranked retrieved documents are formatted into the context window
- Passed to the LLM alongside the original query
- LLM synthesizes an answer, deciding which sources to cite

Sources:
- [Visiblie: How AI Platforms Choose What to Cite](https://www.visiblie.com/blog/how-ai-platforms-choose-sources)
- [Am I Cited: RAG Pipeline](https://www.amicited.com/glossary/rag-pipeline/)

### Platform-Specific Architectures

**Perplexity AI:**
- Runs **live web searches at query time** (real-time RAG)
- Every query triggers a fresh web search
- Uses **inline numbered citations**, averaging **6.6 citations per response**
- Strongly favors recent content — content updated within the last 30 days gets **3.2x more citations**
- Highest citation density of any platform

**ChatGPT:**
- Relies on training data with **optional web browsing** (SearchGPT)
- Base model references knowledge learned during training (knowledge cutoff)
- Averages only **2.6 citations per response** (lowest among major platforms)
- Captures **87.4% of AI referral traffic** but has a citation rate of only **0.7%**
- Cites from **3-5 deeply-read sources per response**
- Wikipedia dominates at **7.8% of all citations**

**Google AI Mode / AI Overviews:**
- Uses **"query fan-out"** — generates dozens or hundreds of related/implied queries
- Each synthetic query retrieves documents from Google's index
- Documents scored by how well vector embeddings align with both explicit and hidden queries
- Extracts chunks from relevant documents, builds structured representations, synthesizes answers
- Citation rate: **9.5%** (much higher than ChatGPT)

**Claude:**
- Prioritizes **transparent, verifiable sources** aligned with Constitutional AI principles
- Emphasizes accuracy and source quality

Sources:
- [ZipTie.dev: How Perplexity Answers Work](https://ziptie.dev/blog/how-perplexity-ai-answers-work/)
- [MeetCogni: How ChatGPT Decides What to Cite](https://www.meetcogni.com/blog/how-chatgpt-decides-what-to-cite)
- [Discovered Labs: AI Citation Patterns](https://discoveredlabs.com/blog/ai-citation-patterns-how-chatgpt-claude-and-perplexity-choose-sources)
- [iPullRank: How AI Mode Works](https://ipullrank.com/how-ai-mode-works)

### Mike King's "Relevance Engineering" Framework (iPullRank)

Mike King (Search Marketer of the Year 2025) introduced the concept of **Relevance Engineering**, which explains the technical mechanics:

- **LLMs retrieve passages, not pages** — snippet selection is heavily influenced by extractability and clarity
- If the system can't pull a self-contained, high-quality passage, the page is less likely to be cited
- Content that maps cleanly to **entity attributes and comparisons** is more likely to be selected
- Write **semantically complete chunks** starting with the canonical entity name and checkable facts
- LLMs use structured data (JSON-LD, Schema) as part of the RAG pipeline
- The underlying system uses **vector embeddings, cosine similarity, topic segmentation, and semantic scoring**

Sources:
- [iPullRank: AI Search Entity Recognition](https://ipullrank.com/ai-search-entity-recognition)
- [iPullRank: AI Search Manual](https://ipullrank.com/ai-search-manual)
- [Advanced Web Ranking: Relevance Engineering](https://www.advancedwebranking.com/blog/optimizing-new-search-how-relevance-engineering-is-reshaping-seo)

### The Four Core Selection Signals

AI platforms select sources based on 4 evaluation signals:
1. **Authority** — domain/author credibility, E-E-A-T signals
2. **Relevance** — semantic match between query and content
3. **Recency** — freshness of content (85% of AI Overview citations from content published in the last 2 years)
4. **Structural clarity** — machine-parsability of content blocks

Source: [Visiblie: How AI Platforms Choose Sources](https://www.visiblie.com/blog/how-ai-platforms-choose-sources)

---

## 3. WHAT MAKES CONTENT "CITABLE" — Specific Patterns That Get Extracted

### Answer Capsules — The #1 Citation Predictor

An **answer capsule** is a concise, self-contained block of text (20-50 words) placed immediately after a title or question-based H2 that directly answers the question.

Key findings:
- **72.4% of cited posts** had an identifiable answer capsule
- Answer capsules were **the single most consistent predictor** of ChatGPT citation
- More than **9 in 10 capsules contained no links** — link-free capsules are easier to extract
- The strongest configuration was an answer capsule + proprietary insight = **34.3% citation rate**
- Capsules should be **self-contained, low-ambiguity, high semantic clarity**

Sources:
- [Search Engine Land: Content Traits LLMs Quote Most](https://searchengineland.com/how-to-get-cited-by-chatgpt-the-content-traits-llms-quote-most-464868)
- [AOK Marketing: Answer Capsules](https://aokmarketing.com/answer-capsules-the-25-word-pattern-that-gets-you-cited)
- [WebTrek: Answer Capsules LLMs Love](https://webtrek.io/blog/answer-capsules-llm)

### Quantified Impact of Content Elements

From the original GEO academic paper (Princeton/Georgia Tech/Allen Institute, 2024):
- Adding **statistics** increases AI visibility by **22%**
- Including **direct quotations** boosts visibility by **37%**
- Adding **citations/sources** improves visibility by **up to 40%**

Source: [arXiv: GEO Paper](https://arxiv.org/abs/2311.09735)

### Content Structure Patterns That Get Cited

1. **Answer-first formatting** — Models extract **44% of citations from the first 30% of a page**
2. **Block-structured formatting** — discrete, parsable chunks of information
3. **Subject-Verb-Object sentences** — clear entity definitions
4. **Verifiable claims** backed by data and citations
5. **40-60 word modular paragraphs** — improve semantic granularity for extraction
6. **Comparison tables** — content that maps to entity attributes and comparisons
7. **FAQ format** — question-based H2s with immediate answer capsules
8. **Numbered/bulleted lists** — structured, scannable data
9. **Original/proprietary data** — ranked as the **second-strongest differentiator** for cited pages

Sources:
- [Onely: LLM-Friendly Content](https://www.onely.com/blog/llm-friendly-content/)
- [Discovered Labs: Content Clarity and Verifiability](https://discoveredlabs.com/blog/content-clarity-and-verifiability-the-technical-patterns-that-drive-llm-citations)
- [SurferSEO: LLM Citations Tips](https://surferseo.com/blog/llm-citations/)
- [Kime AI: Structure Content for LLM Extraction](https://kime.ai/blog/how-to-structure-content-for-llm-extraction-geo-guide-2026)

### The Anti-Pattern: What Kills Citability

- Dense paragraphs without clear semantic boundaries
- Content buried in JavaScript-rendered elements AI bots can't see
- Heavy internal/external linking within answer blocks
- Vague, opinion-based statements without verifiable claims
- Content that requires multi-page navigation to get a complete answer

---

## 4. CONTENT-LEVEL vs. SITE-LEVEL vs. OFF-PAGE SIGNALS

### Lumar's 4-Pillar GEO Framework (The Best Public Taxonomy)

**Pillar 1: Technical GEO (Site-Level)**
- AI bot crawlability and access
- Content freshness signals (last-modified headers, sitemaps)
- Citation eligibility (canonical tags, indexability)
- AI renderability (JavaScript rendering, clean HTML)
- Core Web Vitals, mobile optimization
- Structured data implementation (JSON-LD)

**Pillar 2: Content GEO (Page-Level)**
- Factual accuracy and verifiability
- Semantic structure (headings, answer capsules)
- Comprehensiveness and depth
- Modular, extractable content blocks
- Answer alignment with query intent
- Original data and statistics

**Pillar 3: Entity GEO (Site + Off-Page)**
- Consistent brand descriptions across platforms
- Structured data (Organization, Product, Person schema)
- Inclusion in trusted third-party databases and knowledge graphs
- Content that connects brand to target topics
- **Must come before Brand Authority GEO** — without entity recognition, authority has nothing to attach to

**Pillar 4: Brand Authority GEO (Off-Page)**
- Credibility, trust, and preference signals
- Whether AI trusts the content you produce
- Whether your brand is selected over competitors
- How prominently your brand appears in AI answers
- Sentiment of mentions
- Brand search volume (**strongest predictor of LLM citations**, 0.334 correlation — outweighs backlinks)

Sources:
- [Lumar: 4-Pillar GEO Strategy Framework](https://www.lumar.io/blog/best-practice/4-pillar-geo-strategy-framework-for-ai-search-visibility/)
- [Lumar: Brand Authority for GEO](https://www.lumar.io/blog/best-practice/brand-authority-geo-aeo-ai-search-tips/)
- [Lumar: Entity Building for AI](https://www.lumar.io/blog/best-practice/entity-building-for-ai-brand-visibility-geo-aeo-explainer/)
- [Lumar: Technical GEO Essentials](https://www.lumar.io/blog/best-practice/technical-geo-aeo-guide-for-ai-search-optimization/)

### Implications for Audit Scope

| Signal Type | Page-Level Audit | Full Site Audit | Off-Page Audit |
|---|---|---|---|
| Answer capsules | Yes | | |
| Content structure | Yes | | |
| Statistics/data density | Yes | | |
| Schema markup | Yes | Yes | |
| Crawlability | | Yes | |
| Site architecture | | Yes | |
| Core Web Vitals | | Yes | |
| Brand entity consistency | | | Yes |
| Brand search volume | | | Yes |
| Third-party mentions | | | Yes |
| Knowledge graph presence | | | Yes |
| Author E-E-A-T signals | Yes | | Yes |

---

## 5. GOOGLE AI OVERVIEWS vs. LLM CITATIONS — Same Game or Different?

### They Are Fundamentally Different Games

**Key data point:** Only **11% of domains** are cited by both ChatGPT and Perplexity. Only **13.7% of citations overlap** between Google AI Overviews and Google AI Mode. Overall, citation sources share roughly **25-40% overlap** between platforms.

### Google AI Overviews

- Draws from Google's existing search index (deeply integrated with traditional SEO)
- Only **4.5% of AI Overview URLs** directly matched a Page 1 organic URL — Google draws from deeper pages on authoritative domains
- Rewards brands that combine classic SEO with distributed visibility across community, video, and Q&A platforms
- Content under 3 months old is **3x more likely to be cited**
- Now appears for **25.11% of Google searches** (as of mid-2025), with Healthcare at 48.7%

### ChatGPT / Perplexity / Claude

- ChatGPT prioritizes **encyclopedic authority**, supplemented by high-traffic publishers surfaced through Bing
- Perplexity runs live web searches (real-time RAG), heavily favoring recency
- Claude prioritizes **transparent, verifiable sources**
- Microsoft Copilot emphasizes rapid Bing indexation through IndexNow

### Audit Implications

A GEO audit **should score differently for each platform** because:
1. Different retrieval architectures (index-based vs. real-time search vs. training data)
2. Different citation density norms (Perplexity 6.6 vs. ChatGPT 2.6 per response)
3. Different authority signals (Google trusts its own ranking signals; ChatGPT relies on Bing + training data)
4. Different recency weighting (Perplexity favors 30-day content; Google AI Overviews favors 3-month content)

Sources:
- [The Digital Bloom: 2025 AI Visibility Report](https://thedigitalbloom.com/learn/2025-ai-citation-llm-visibility-report/)
- [Wellows: Google Rankings and LLM Citations Gap](https://wellows.com/blog/google-rankings-and-llm-citations-gap/)
- [Averi AI: AI Overviews 2026 Citation Playbook](https://www.averi.ai/blog/google-ai-overviews-optimization-how-to-get-featured-in-2026)
- [PrimeAICenter: Google AI Optimization Guide](https://primeaicenter.com/google-ai-optimization-guide/)

---

## 6. QUANTITATIVE BENCHMARKS — What Separates "Gets Cited" from "Doesn't"

### The Conductor 2026 AEO/GEO Benchmarks Report (The Gold Standard Dataset)

**Scale:** 13,770 domains, 3.5 million unique prompts, 17 million AI-generated responses, 100+ million citations, 3.3 billion sessions.

**Key benchmarks:**
- AI referrals make up only **~1% of total traffic** on average (but this is redefining where discovery begins)
- **Citation rate by platform:** ChatGPT 0.7%, Perplexity 13.8%, Google AI Mode 9.5%
- AI Overviews triggered on **25.11% of Google searches**
- Highest AI traffic industry: Semiconductors at **4.09%**
- Cross-engine citations outperform single-engine citations on quality measures by **71%**

Sources:
- [Conductor: 2026 AEO/GEO Benchmarks Report](https://www.conductor.com/academy/aeo-geo-benchmarks-report/)
- [BusinessWire: Conductor Report Launch](https://www.businesswire.com/news/home/20251113364791/en/Conductor-Unveils-2026-AEO-GEO-Benchmarks-Report-How-AI-Shapes-Brand-Visibility-in-a-Zero-Click-World)
- [RanketAI: What 1.08% Means](https://www.ranketai.com/en/blog/deep-dive-conductor-aeo-geo-benchmark-2026-04-08)

### Content-Level Thresholds

- **Opening answers:** 30-50 words max for the answer capsule
- **Answer capsule presence:** 72.4% of cited posts had one; strongest config = capsule + proprietary data = 34.3% citation rate
- **Statistics density:** 5-10 specific, attributed statistics per major content piece
- **Content freshness:** 85% of AI Overview citations from content published in last 2 years; 44% from current year alone
- **Modular paragraphs:** 40-60 words for optimal extraction
- **Content from top 30%:** Models extract 44% of citations from the first 30% of a page
- **Verifiable data:** Content with verifiable data earns **30-40% more visibility** than purely qualitative content

### Visibility Score Formulas (Multiple Approaches)

**Formula 1 (Standard):**
```
AI Visibility Score = (Average Brand Mention Frequency x Sentiment Weight) / Total Category Queries
```

**Formula 2 (Composite, 0-100 scale):**
```
AI Visibility Score =
  (Mention Frequency x 0.25) +
  (Citation Rate x 0.25) +
  (Ranking Position x 0.20) +
  (Sentiment x 0.15) +
  (AI-Referred Traffic x 0.15)
```

**Formula 3 (2026 Research):**
```
AI Visibility Score =
  (ERR x 0.25) +
  (Mention Rate x 0.20) +
  (Citation Rate x 0.20) +
  (Authority Mix x 0.20) +
  (Consistency x 0.15)
```

**Important caveat:** There is no universal standard for calculating AI visibility yet. Different tools define it differently, weight different AI engines differently, and use different prompt sets.

Sources:
- [AnyMorph: AI Visibility Score Formula](https://anymorph.ai/guide/ai-visibility-score-formula-for-executive-dashboards)
- [eSEOspace: GEO Content Score](https://eseospace.com/blog/geo-content-score-how-to-measure-ai-visibility/)
- [Indexly: AI Visibility Score](https://indexly.ai/glossary/ai-visibility-score)
- [AuthorityTech: AI Visibility Score Definition](https://authoritytech.io/blog/ai-visibility-score-definition-2026)

---

## 7. WHAT TOP GEO CONSULTANTS ACTUALLY RECOMMEND

### Lily Ray — "GEO is mostly good SEO"

Lily Ray argues that most GEO tactics are **"verbatim recommendations that SEO teams have been making for years"** — schema, clear headings, authoritative content. The same E-E-A-T signals that matter to Google show up disproportionately in the URLs LLMs cite. GEO amplifies pages that already earned the right to rank.

**Implication for scoring:** E-E-A-T audit factors should carry heavy weight. If you're already doing excellent SEO, you're partially GEO-ready.

Source: [YouTube: Future of Search Panel](https://www.youtube.com/watch?v=c-VtgjXWsK4)

### Kevin Indig — New KPIs Beyond Traffic

Kevin Indig's research on the **"decoupling of clicks from impact"** has changed how marketers evaluate GEO. He advocates for:
- Tracking **"AI citation share"** — your percentage of citations in a given topic
- Measuring **"post-answer click rate"** — what happens after the AI mentions you
- Moving beyond old traffic metrics entirely

Source: [First Page Sage: Top GEO Experts](https://firstpagesage.com/seo-blog/the-top-generative-engine-optimization-geo-ai-search-experts/)

### Ross Simmonds — Distribution is Everything

Ross Simmonds' **"Create Once, Distribute Forever"** philosophy applied to GEO:
- Content distribution is critical for GEO success (off-page signals feed entity recognition)
- Check if a question has a conversational tone or solution-oriented intent
- Use schema for AI indexing context (articles, products, FAQs)
- Embed **5-10 specific, attributed statistics** per major content piece

Sources:
- [Ross Simmonds: ROI of GEO](https://rosssimmonds.com/blog/roi-generative-engine-optimization/)
- [Foundation Inc: GEO Guide](https://foundationinc.co/lab/generative-engine-optimization)

### Mike King (iPullRank) — Relevance Engineering

Mike King's framework is the most technically rigorous:
- SEO should be repositioned as **Relevance Engineering** — built on language modeling, query understanding, and information gain
- LLMs retrieve **passages, not pages** — optimize at the passage level
- Write **semantically complete chunks** starting with canonical entity names
- Structured data (JSON-LD) is directly used in RAG pipelines
- Measure via vector embeddings, cosine similarity, topic segmentation

Source: [iPullRank: AI Search Manual](https://ipullrank.com/ai-search-manual)

### Jason Barnard — Entity-First GEO

Jason Barnard is the leading voice on entity-based GEO. His approach:
- Build a consistent, accurate brand identity across the web
- Focus on **Knowledge Panel optimization** as the foundation
- Entity recognition must precede all other GEO efforts

Source: [3 Steps Digital: GEO Experts](https://3stepsdigital.com/podcast/the-worlds-leading-generative-engine-optimization-ai-search-experts-shaping-the-future-of-search-jason-barnard-ross-simmonds-lily-ray-more/)

### Academic Research vs. Practitioner Advice

The academic paper (Princeton/Georgia Tech, 2024) found **statistics (+22%), quotations (+37%), and citations (+40%)** boost visibility. Practitioners largely agree but add critical nuances:
- **Lily Ray:** The academic findings confirm existing E-E-A-T best practices
- **Mike King:** The mechanism matters more than the tactic — understand vector retrieval, not just "add stats"
- **Kevin Indig:** Measurement is the real gap — the academic paper measures visibility in a controlled environment, but real-world AI search is far noisier

Source: [arXiv: GEO Paper](https://arxiv.org/abs/2311.09735)

---

## 8. COUNTER-ARGUMENTS — Is GEO Even Real?

### The SparkToro/Gumshoe Bombshell

Rand Fishkin and Patrick O'Donnell (Gumshoe.ai) ran **2,961 prompts** across ChatGPT, Claude, and Google AI Overviews with hundreds of volunteers (Nov-Dec 2025). The findings challenge the entire GEO premise:

- AI models produce different brand recommendation lists **more than 99% of the time** when asked the same question
- The probability of receiving identical lists in the same order: **below 0.1%**
- Nearly every response was unique in: the list of brands, the order of recommendations, and the number of items returned

**However, the nuance matters:** While rankings collapsed, **visibility percentage held up**. Some brands appeared in **60-90% of responses** for a given intent. The top brands in each category appeared in **55-77% of responses** regardless of phrasing.

Sources:
- [SparkToro: AI Brand Recommendation Inconsistency](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)
- [Search Engine Journal: AI Recommendations Change Every Query](https://www.searchenginejournal.com/ai-recommendations-change-with-nearly-every-query-sparktoro/566242/)
- [Search Engine Land: AI Recommendation Lists Rarely Repeat](https://searchengineland.com/ai-recommendation-lists-rarely-repeat-study-468076)

### Google's John Mueller — "It Signals Spam"

John Mueller (August 2025) issued a stark warning: **"The higher the urgency, and the stronger the push of new acronyms, the more likely they're just making spam and scamming."** He specifically addressed GEO, AIO, and AEO as potentially indicative of spam tactics.

Source: [PPC Land: Mueller Warning](https://ppc.land/googles-john-mueller-warns-ai-seo-acronyms-signal-spam-tactics/)

### SparkToro/Rand Fishkin — "It's Still SEO"

Rand Fishkin argues against replacing SEO with GEO, AIO, LLMEO, etc. His position: use Ashley Liddell's **"Search Everywhere Optimization"** terminology. The core practices haven't changed enough to warrant new disciplines.

Source: [SparkToro: It's Still SEO](https://sparktoro.com/blog/its-still-seo-search-everywhere-optimization/)

### The "GEO Snake Oil" Argument

Webbiquity published a direct critique arguing that GEO is being sold as something new when it's largely repackaged SEO best practices with a premium price tag.

Source: [Webbiquity: GEO Snake Oil](https://webbiquity.com/ai-in-marketing/beware-the-generative-engine-optimization-snake-oil/)

### The Strongest Counter-Counter-Argument

Despite the criticism, several facts hold:
1. **Citation sources differ across platforms** (25-40% overlap) — this means platform-specific optimization IS real
2. **Visibility percentage is measurable and consistent** — brands do appear at predictable rates
3. **Content structure demonstrably affects citation** (72.4% of cited posts have answer capsules)
4. **The retrieval architecture IS different from traditional search** — RAG, vector embeddings, and passage-level retrieval are genuinely different from PageRank

The honest synthesis: **GEO is real as a practice but oversold as a revolution.** The tactics work. The measurement is imperfect. The acronym is marketing.

Source: [FancyAI: Honest Skeptic's Case Against GEO](https://www.getfancy.ai/article-honest-skeptics-case-against-geo)

---

## 9. THE "CONSIDERATION SET" CONCEPT

### What SparkToro's Research Actually Shows

The key insight from the SparkToro/Gumshoe research is the **consideration set** model:

- **The consideration set is relatively stable** — top brands in each category appeared in 55-77% of responses regardless of prompt phrasing
- **The rank within the set is effectively random** — the AI doesn't maintain a hierarchy; it draws from the consideration set each time
- Example: Sony, Bose, and Apple showed up across nearly every headphone recommendation run, but their order was random

### What This Means for a GEO Audit

If you accept the consideration set model, a GEO audit should measure:

1. **Are you IN the consideration set?** (Binary: yes/no for each topic/intent)
2. **What is your visibility percentage?** (What % of responses mention you?)
3. **Share of Voice probability** — not rank, but frequency of appearance
4. **Brand co-occurrence** — which competitors appear alongside you?
5. **Sentiment when mentioned** — is the context positive, neutral, or negative?

**What becomes meaningless:**
- "Ranking" position in AI responses (it's random)
- Single-query testing (you need dozens of runs)
- Assuming consistency across sessions

Sources:
- [AuthorityTech: Consideration Set](https://authoritytech.io/curated/ai-rank-is-noise-consideration-set-is-real-2026)
- [GetPassionFruit: Why AI Recommendations Change](https://www.getpassionfruit.com/blog/why-ai-brand-recommendations-change-with-every-query-research-analysis-and-strategic-implications)
- [GEOly: Is AI Visibility a Myth?](https://www.geoly.ai/blog/ai-visibility-myth-geo-strategy)

---

## 10. REAL GEO AUDIT REPORT EXAMPLES AND FRAMEWORKS

### Publicly Available Frameworks

**Wellows Agency GEO Audit Checklist:**
A productized framework from baseline testing to prioritized fixes covering:
- Technical access (crawl/index/snippet eligibility)
- Structured data (schema that matches visible content)
- Entity + trust (E-E-A-T + consistent brand signals)
- Prompt-based monitoring (citations/mentions across a fixed "money prompt" set)
- Concludes with "Top 10 GEO Fixes" grouped by impact and effort: fast wins, roadmap items, backlog items

Source: [Wellows: GEO Audit Checklist for Agencies](https://wellows.com/blog/audit-checklist-for-agencies/)

**Superlines 4-Stage GEO Maturity Framework:**
Evaluates where a brand sits on the GEO maturity curve, from beginner to advanced, with specific action items at each stage.

Source: [Superlines: GEO Maturity Framework](https://www.superlines.io/articles/geo-maturity-framework-ai-search-visibility/)

**Genrank GEO Audit Checklist (Priority-Based):**
Organizes GEO fixes from low to high priority with clear categorization.

Source: [Genrank: GEO Audit Checklist](https://genrank.io/blog/geo-audit-checklist-and-priorities/)

**GEOReport.ai:**
Offers instant audit dashboard with real-time scoring, issues classified as Critical/Medium/Minor, and reports covering page score, benchmarks, and AI model comparisons.

Source: [GEOReport.ai](https://georeport.ai/)

**AuthorityAI Comprehensive GEO Audit Guide:**
Full walkthrough of how to audit a website for AI visibility, including AEO health check methodology.

Source: [AuthorityAI: How to Audit for AI Visibility](https://authorityai.ai/how-to-audit-your-website-for-ai-visibility/)

**Free Tools for Testing:**
- [Geoptie Free GEO Audit](https://geoptie.com/free-geo-audit) — no signup, paste URL
- [Semrush AI Search Visibility Checker](https://www.semrush.com/free-tools/ai-search-visibility-checker/) — free brand check
- [AI Rank Lab](https://www.airanklab.com/seo-aeo-geo-audit-tool) — 100+ ranking factors across Google, ChatGPT, Claude, Gemini, Perplexity
- [Seomator GEO Audit](https://seomator.com/geo-audit-tool) — free, no signup
- [GrowthGPT GEO Audit](https://thegrowthgpt.com/tools/geo-audit) — free online tool

### Lumar's GEO Content Evaluation Tool
Lumar released a dedicated GEO Content Evaluation tool for AI search, allowing page-by-page analysis against their 4-pillar framework.

Source: [Lumar: GEO Content Evaluation](https://www.lumar.io/geo-content-evaluation-for-ai-search/)

---

## SYNTHESIS: BUILDING THE IDEAL GEO SCORING FRAMEWORK

Based on all the above research, here is what a comprehensive GEO scoring framework should include:

### Layer 1: Page-Level Content Score (40% of total)

| Factor | Weight | What to Measure |
|---|---|---|
| Answer Capsule Presence | 15% | Does each major section start with a 20-50 word self-contained answer? |
| Statistical Density | 10% | Number of verifiable, attributed data points per 1000 words |
| Content Structure | 10% | Modular paragraphs (40-60 words), clear H2/H3 hierarchy, lists, tables |
| Original Data/Insight | 5% | Presence of proprietary research, unique data, first-party findings |

### Layer 2: Technical GEO Score (20% of total)

| Factor | Weight | What to Measure |
|---|---|---|
| AI Bot Crawlability | 5% | Can AI crawlers access the content? (robots.txt, rendering) |
| Structured Data | 5% | JSON-LD implementation quality (Article, FAQ, Product, Organization) |
| Page Speed / CWV | 5% | Core Web Vitals scores |
| Content Freshness | 5% | Last-modified dates, publication dates, update frequency |

### Layer 3: Entity & Authority Score (25% of total)

| Factor | Weight | What to Measure |
|---|---|---|
| Brand Entity Recognition | 10% | Is the brand recognized as an entity? Knowledge panel presence? |
| Author E-E-A-T | 5% | Author bios, credentials, bylines, expertise signals |
| Brand Search Volume | 5% | Monthly branded search volume (strongest LLM citation predictor) |
| Third-Party Mentions | 5% | Consistent brand mentions across trusted databases, directories, platforms |

### Layer 4: AI Visibility Performance (15% of total)

| Factor | Weight | What to Measure |
|---|---|---|
| Consideration Set Membership | 5% | Is the brand in the AI consideration set for target queries? (binary + %) |
| Citation Rate | 5% | How often is the URL cited across AI platforms? |
| Sentiment Score | 5% | Positive/neutral/negative context when mentioned |

### Score Interpretation

- **85-100:** AI-Optimized — high citation probability across platforms
- **70-84:** AI-Ready — minor fixes needed, strong foundation
- **55-69:** Needs Optimization — significant gaps in content structure or authority
- **Below 55:** Not AI-Optimized — fundamental rework required

### Critical Caveats for Any GEO Score

1. **No universal standard exists** — every tool calculates differently
2. **AI rankings are random** — only measure visibility % across many runs, never position
3. **Platform-specific scores matter** — a single "GEO score" hides important platform differences
4. **The field is 18 months old** — frameworks will change rapidly
5. **Brand strength may matter more than any on-page factor** — brand search volume has the highest correlation with LLM citations (0.334)
6. **Measurement requires volume** — single-query testing is meaningless per SparkToro research

---

*Research compiled May 2026. The GEO field is evolving rapidly; benchmarks and methodologies are subject to change.*
