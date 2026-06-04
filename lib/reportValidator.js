/**
 * Report validator — detects logical inconsistencies in generated reports.
 * Used post-generation to log violations without blocking delivery.
 */

function validateReport(report, reportType = 'onepage') {
  const errors = [];
  const warnings = [];

  const isPro = reportType === 'pro';
  const data = isPro ? report : { criteriaAverages: {}, pages: [report], patterns: [], actionPlan: report.recommendations || [], ...report };

  // ── Rule 1: "bien optimisé" coherence ──────────────────────────────────────
  const criteria = isPro
    ? Object.entries(report.criteriaAverages || {}).map(([name, d]) => ({ name, score: d.avgScore, max: d.max }))
    : (report.criteria || []);

  criteria.forEach(c => {
    const pct = c.max > 0 ? Math.round((c.score / c.max) * 100) : 0;
    if (pct < 75 && c.score < c.max) {
      // Should have at least 1 reco — check if any reco matches this criterion
      const recos = isPro
        ? (report.pages || []).flatMap(p => (p.recommendations || []))
        : (report.recommendations || []);
      const hasReco = recos.some(r => {
        const rc = (r.criterion || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const cn = c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return rc.includes(cn.split(' ')[0]) || cn.includes(rc.split(' ')[0]);
      });
      if (!hasReco) {
        warnings.push({
          rule: 'coherence-bien-optimise',
          severity: 'warning',
          location: c.name,
          expected: 'At least 1 recommendation for criterion below 75%',
          actual: `${pct}% with 0 matching recommendations`,
        });
      }
    }
  });

  // ── Rule 2: Vocabulary coherence ───────────────────────────────────────────
  const textToCheck = JSON.stringify(isPro
    ? { exec: report.executiveSummary, strengths: report.topStrengths, weaknesses: report.topWeaknesses, synthesis: (report.criteriaConsolidated || []).map(c => c.synthesis) }
    : { verdict: report.verdict, strengths: report.strengths });

  const vocabChecks = [
    { word: /catastrophi/i, minPct: 30, msg: '"catastrophique" used for score above 30%' },
    { word: /\bfaible\b/i, minPct: 50, msg: '"faible" used for score above 50%' },
    { word: /\bgrave\b/i, minPct: 50, msg: '"grave" used for score above 50%' },
    { word: /\bdéfaillan/i, minPct: 50, msg: '"défaillant" used for score above 50%' },
  ];

  criteria.forEach(c => {
    const pct = c.max > 0 ? Math.round((c.score / c.max) * 100) : 0;
    const criterionText = isPro
      ? ((report.criteriaConsolidated || []).find(cc => cc.criterion === c.name)?.synthesis || '')
      : '';
    vocabChecks.forEach(v => {
      if (pct >= v.minPct && v.word.test(criterionText)) {
        warnings.push({
          rule: 'vocabulary-calibration',
          severity: 'warning',
          location: c.name,
          expected: `No "${v.word.source}" for ${pct}%`,
          actual: v.msg,
        });
      }
    });
  });

  // ── Rule 3: Page count coherence ───────────────────────────────────────────
  // pagesValid counts pages with scores; pages array may include error pages with error=null
  // Only flag as error if the difference is significant (not off-by-one from null coercion)
  if (isPro) {
    const pagesValid = report.pagesValid;
    const actualValid = (report.pages || []).filter(p => !p.error && typeof p.score === 'number').length;
    if (Math.abs(pagesValid - actualValid) > 2) {
      errors.push({
        rule: 'page-count-mismatch',
        severity: 'error',
        location: 'consolidatedReport',
        expected: `pagesValid=${pagesValid}`,
        actual: `actual valid pages=${actualValid}`,
      });
    }
  }

  // ── Rule 4: Score range validation ─────────────────────────────────────────
  const pages = isPro ? (report.pages || []) : [report];
  pages.forEach(p => {
    if (p.error) return;
    (p.criteria || []).forEach(c => {
      if (c.score < 0 || c.score > c.max) {
        errors.push({
          rule: 'score-out-of-range',
          severity: 'error',
          location: `${p.url || 'page'} → ${c.name}`,
          expected: `0-${c.max}`,
          actual: String(c.score),
        });
      }
    });
  });

  // ── Rule 5: Patterns must affect ≥2 pages ─────────────────────────────────
  if (isPro) {
    (report.patterns || []).forEach((p, i) => {
      const affected = (p.pagesAffected || []).length;
      if (affected < 2) {
        warnings.push({
          rule: 'pattern-single-page',
          severity: 'warning',
          location: `pattern[${i}]`,
          expected: '≥2 pages',
          actual: `${affected} page(s)`,
        });
      }
    });
  }

  // ── Rule 6: Score average consistency ──────────────────────────────────────
  // Note: scoreAverage uses weighted scoring (calculateProScore) which weights by page type.
  // Simple average will differ from weighted average — this is expected, not an error.
  // Only flag if the difference is extreme (>15 points), indicating a real bug.
  if (isPro) {
    const validPages = (report.pages || []).filter(p => !p.error && typeof p.score === 'number');
    if (validPages.length > 0) {
      const simpleAvg = Math.round(validPages.reduce((s, p) => s + p.score, 0) / validPages.length);
      if (Math.abs(simpleAvg - report.scoreAverage) > 15) {
        errors.push({
          rule: 'score-average-mismatch',
          severity: 'error',
          location: 'scoreAverage',
          expected: `simple avg=${simpleAvg}`,
          actual: `weighted avg=${report.scoreAverage}`,
        });
      }
    }
  }

  return {
    errors,
    warnings,
    passed: errors.length === 0,
    summary: `${errors.length} errors, ${warnings.length} warnings`,
  };
}

module.exports = { validateReport };
