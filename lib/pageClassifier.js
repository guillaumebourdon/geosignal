/**
 * Page type classifier for GEO Pro audits.
 *
 * Classifies pages into 3 tiers for weighted scoring:
 * - content: blog, guide, FAQ, pillar, knowledge base (full GEO rubric)
 * - product: pricing, features, product, comparison, landing (adapted rubric)
 * - utility: contact, legal, login, sitemap, about, careers (minimal rubric)
 *
 * Uses URL patterns + content heuristics for robust classification.
 */

function classifyPage(url, textContent = '', headings = []) {
  const path = (() => { try { return new URL(url).pathname.toLowerCase(); } catch { return url.toLowerCase(); } })();
  const text = textContent.toLowerCase();
  const wordCount = textContent.split(/\s+/).filter(w => w.length > 1).length;
  const h1Text = headings.filter(h => h.level === 'h1').map(h => h.text.toLowerCase()).join(' ');

  // ── UTILITY (tier C) — check first, these are the most predictable ──────

  const utilityPaths = /\/(contact|nous-contacter|contactez|mentions?[-_]?legales?|legal|privacy|politique[-_]?de[-_]?confidentialite|cgu|cgv|terms|conditions|imprint|login|signin|sign[-_]?in|connexion|register|inscription|signup|sign[-_]?up|careers|emploi|jobs|recrutement|sitemap|plan[-_]?du[-_]?site|404|500|error|cookie|preference|unsubscribe|desinscription)(\/|$|\?|\.)/i;
  if (utilityPaths.test(path)) return 'utility';

  // About pages are utility — they provide trust signals but aren't cited directly
  if (/\/(a-propos|about|about-us|qui-sommes-nous|notre-equipe|notre-histoire|our-team|our-story|team|equipe)(\/|$|\?)/i.test(path)) return 'utility';

  // FAQ standalone (before product check — /faq is content, not commercial)
  if (/\/faq\/?$/i.test(path)) return 'content';

  // ── PRODUCT (tier B) — commercial/transactional pages ───────────────────

  const productPaths = /\/(pricing|tarifs?|prix|plans?|offres?|features?|fonctionnalites?|product|produit|solutions?|services?|demo|essai|trial|compare|comparatif|comparaison|vs|alternative|checkout|panier|cart|shop|boutique|catalogue|store)(\/|$|\?)/i;
  if (productPaths.test(path)) return 'product';

  // Landing pages (short path, marketing-heavy)
  if (path.split('/').filter(s => s.length > 0).length <= 1 && wordCount < 500) return 'product';

  // ── CONTENT (tier A) — editorial/informational pages ────────────────────

  const contentPaths = /\/(blog|article|guide|learn|academy|ressources?|resources?|docs?|documentation|help|support|faq|knowledge|wiki|tutori|how[-_]?to|conseil|astuce|tips|news|actualit|magazine|journal|editorial|library|glossary|glossaire|lexique|informations?|fiches?[-_]?pratiques?)(\/|$|\?)/i;
  if (contentPaths.test(path)) return 'content';

  // FAQ in content or headings
  if (/faq|questions?\s+fr[eé]quentes|frequently\s+asked/i.test(text.slice(0, 500)) ||
      headings.some(h => /faq|questions?\s+fr[eé]quentes|frequently/i.test(h.text))) return 'content';

  // ── HEURISTIC FALLBACK — classify by content characteristics ────────────

  // Long-form content with many headings = content page
  const h2Count = headings.filter(h => h.level === 'h2').length;
  if (wordCount >= 1500 && h2Count >= 4) return 'content';

  // Short content with pricing/product signals = product page
  if (/tarif|pricing|\bprix\b|€|\$|\/mois|\/month|gratuit|free plan|essai|trial/i.test(text.slice(0, 1000))) return 'product';

  // Homepage (root path)
  if (path === '/' || path === '') return 'product'; // homepages are commercial pages

  // Medium-length content = content by default (benefit of the doubt)
  if (wordCount >= 800 && h2Count >= 2) return 'content';

  // Default: product (safer — doesn't inflate scores)
  return 'product';
}

/**
 * Page importance weight within its tier.
 * Based on URL depth and content signals.
 */
function pageImportanceWeight(url, wordCount = 0) {
  const path = (() => { try { return new URL(url).pathname; } catch { return url; } })();
  const depth = path.split('/').filter(s => s.length > 0).length;

  // Depth penalty: pages closer to root are more important
  const depthFactor = 1 / (1 + 0.15 * depth);

  // Content volume bonus: more content = more likely to be cited
  const contentFactor = wordCount >= 2000 ? 1.0 : wordCount >= 1000 ? 0.8 : wordCount >= 500 ? 0.6 : 0.4;

  return Math.max(0.2, depthFactor * contentFactor);
}

/**
 * Tier weights for the Pro composite score.
 */
const TIER_WEIGHTS = {
  content: 0.60,
  product: 0.30,
  utility: 0.10,
};

/**
 * Calculate the Pro composite score from page results.
 * Formula: 0.85 × (weighted tier averages) + 0.15 × best page score
 */
function calculateProScore(pageResults) {
  if (!pageResults || pageResults.length === 0) return 0;

  // Group by tier
  const tiers = { content: [], product: [], utility: [] };
  for (const page of pageResults) {
    const tier = page.pageType || 'product';
    if (tiers[tier]) tiers[tier].push(page);
  }

  // Weighted average per tier
  function tierAverage(pages) {
    if (pages.length === 0) return null;
    let weightSum = 0, scoreSum = 0;
    for (const p of pages) {
      const w = p.importanceWeight || 1;
      scoreSum += w * p.score;
      weightSum += w;
    }
    return weightSum > 0 ? scoreSum / weightSum : 0;
  }

  const tierScores = {};
  let totalTierWeight = 0;
  for (const [tier, pages] of Object.entries(tiers)) {
    const avg = tierAverage(pages);
    if (avg !== null) {
      tierScores[tier] = avg;
      totalTierWeight += TIER_WEIGHTS[tier];
    }
  }

  // Normalize tier weights if some tiers are empty
  let siteScore = 0;
  for (const [tier, avg] of Object.entries(tierScores)) {
    siteScore += (TIER_WEIGHTS[tier] / totalTierWeight) * avg;
  }

  // Best page bonus
  const bestPageScore = Math.max(...pageResults.map(p => p.score));
  const finalScore = Math.round(0.85 * siteScore + 0.15 * bestPageScore);

  return Math.max(0, Math.min(100, finalScore));
}

/**
 * Score grade bands (recalibrated: 80 = realistic ceiling)
 */
function scoreGrade(score) {
  if (score >= 75) return { grade: 'A', label: 'Excellent', color: '#10A37F' };
  if (score >= 60) return { grade: 'B', label: 'Bon', color: '#10A37F' };
  if (score >= 45) return { grade: 'C', label: 'À améliorer', color: '#C9861A' };
  if (score >= 30) return { grade: 'D', label: 'Insuffisant', color: '#D97757' };
  return { grade: 'E', label: 'Critique', color: '#D97757' };
}

/**
 * Benchmark ranges by page type (average scores observed across audits)
 */
const PAGE_TYPE_BENCHMARKS = {
  content: { low: 40, avg: 55, high: 75, label: 'Page de contenu' },
  product: { low: 30, avg: 45, high: 65, label: 'Page commerciale' },
  utility: { low: 20, avg: 35, high: 55, label: 'Page utilitaire' },
};

module.exports = {
  classifyPage,
  pageImportanceWeight,
  calculateProScore,
  scoreGrade,
  TIER_WEIGHTS,
  PAGE_TYPE_BENCHMARKS,
};
