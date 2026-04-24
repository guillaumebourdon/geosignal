import { Redis } from '@upstash/redis';
import Head from 'next/head';
import { useState, useEffect, useRef, useCallback } from 'react';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function getServerSideProps({ params }) {
  const { uuid } = params;
  if (!uuid || uuid.length < 10) return { notFound: true };

  try {
    const raw = await redis.get(`detekia:report:${uuid}`);
    if (!raw) return { notFound: true };
    const record = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!record.reportData) return { notFound: true };

    return {
      props: {
        uuid,
        reportData: record.reportData,
        url: record.url || '',
        locale: record.locale || 'fr',
        createdAt: record.createdAt || null,
        loyaltyCode: record.loyaltyCode || null,
      },
    };
  } catch (e) {
    console.error('[report page] Redis error:', e.message);
    return { notFound: true };
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function gradeInfo(score) {
  if (score >= 70) return { label: 'BON', color: '#10A37F', bg: 'rgba(16,163,127,0.10)' };
  if (score >= 45) return { label: 'MOYEN', color: '#C9861A', bg: 'rgba(201,134,26,0.10)' };
  return { label: 'FAIBLE', color: '#D97757', bg: 'rgba(217,119,87,0.10)' };
}

function priorityInfo(p) {
  const s = String(p || '').toLowerCase();
  if (s === 'high') return { label: 'CRITIQUE', color: '#D97757', bg: 'rgba(217,119,87,0.08)' };
  if (s === 'medium') return { label: 'IMPORTANT', color: '#C9861A', bg: 'rgba(201,134,26,0.08)' };
  return { label: 'BONUS', color: '#10A37F', bg: 'rgba(16,163,127,0.08)' };
}

function effortInfo(e) {
  const s = String(e || '').toLowerCase();
  if (s === 'low') return { label: 'Faible', color: '#10A37F' };
  if (s === 'high') return { label: 'Lourd', color: '#D97757' };
  return { label: 'Moyen', color: '#C9861A' };
}

const CRITERIA_ORDER = [
  'Extractibilite & reponse directe', 'Verifiabilite & preuves', 'Autorite & E-E-A-T',
  'Crawlabilite IA', 'Donnees structurees', 'Neutralite editoriale',
  'Presence externe', 'Fraicheur & maintenance',
];

const CTX_CARDS = [
  { label: 'Croissance du trafic IA', value: '+527%', text: 'Le trafic référé par les IA a augmenté de 527% entre janvier et mai 2025.', source: 'Previsible, 2025', color: '#D97757' },
  { label: 'Usage ChatGPT', value: '2,5 Mds', text: 'Requêtes traitées par jour.', source: 'Search Engine Land, 2026', color: '#D97757' },
  { label: 'Taux de conversion IA', value: '4,4x', text: 'Les visiteurs référés par les IA convertissent 4,4x mieux.', source: 'Semrush, 2025', color: '#10A37F' },
  { label: 'SEO vs GEO', value: '80%', text: 'Des URLs citées par ChatGPT ne sont PAS dans le top 100 Google.', source: 'Ahrefs, 2025', color: '#D97757' },
  { label: 'Position du texte', value: '44,2%', text: 'Des citations IA proviennent des 30 premiers % du texte.', source: 'Growth Memo, 2026', color: '#C9861A' },
  { label: 'Marché GEO', value: '33,7 Mds$', text: 'Valeur projetée du marché GEO en 2034.', source: 'eMarketer', color: '#10A37F' },
];

// ── Main Component ──────────────────────────────────────────────────────────

export default function ReportPage({ uuid, reportData, url, locale, createdAt, loyaltyCode }) {
  const [downloading, setDownloading] = useState(false);
  const trackedScrolls = useRef(new Set());
  const startTime = useRef(Date.now());

  const track = useCallback((event) => {
    fetch(`/api/track?id=${uuid}&event=${encodeURIComponent(event)}`).catch(() => {});
  }, [uuid]);

  // Track open
  useEffect(() => {
    track('open');
  }, [track]);

  // Track scroll milestones
  useEffect(() => {
    const handler = () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      [25, 50, 75, 100].forEach(m => {
        if (pct >= m && !trackedScrolls.current.has(m)) {
          trackedScrolls.current.add(m);
          track(`scroll-${m}`);
        }
      });
    };
    let timer;
    const debounced = () => { clearTimeout(timer); timer = setTimeout(handler, 2000); };
    window.addEventListener('scroll', debounced, { passive: true });
    return () => window.removeEventListener('scroll', debounced);
  }, [track]);

  // Track session end
  useEffect(() => {
    const handler = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      navigator.sendBeacon(`/api/track?id=${uuid}&event=${encodeURIComponent(`session-end:${duration}s`)}`);
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [uuid]);

  const handleDownload = async () => {
    setDownloading(true);
    track('click-download-pdf');
    try {
      const res = await fetch(`/api/report-pdf?id=${uuid}`);
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `rapport-geo-${url.replace(/[^a-z0-9]/gi, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      alert('Erreur lors de la génération du PDF. Réessayez dans quelques instants.');
    }
    setDownloading(false);
  };

  const g = gradeInfo(reportData.score);
  const criteria = reportData.criteria || [];
  const recos = reportData.recommendations || [];
  const citation = reportData.citationTest || {};
  const citationTests = citation.tests || [];
  const citedCount = citationTests.filter(t => t.cited).length;
  const projected = Math.min(100, reportData.score + Math.round(reportData.score * 0.35));
  const date = createdAt ? new Date(createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <Head>
        <title>Rapport GEO — {url} — {reportData.score}/100 | Detekia</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'system-ui,-apple-system,BlinkMacSystemFont,sans-serif' }}>

        {/* ═══ STICKY HEADER ═══ */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#1A1916', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: '#F7F5F2', fontWeight: 'bold' }}>Detekia</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#F7F5F2', fontWeight: 'bold', flexShrink: 0 }}>{reportData.score}<span style={{ fontSize: 12, color: 'rgba(247,245,242,0.4)' }}>/100</span></span>
            <span style={{ padding: '2px 10px', borderRadius: 20, fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, background: `${g.color}22`, color: g.color, border: `1px solid ${g.color}44`, flexShrink: 0 }}>{g.label}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{ background: '#D97757', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'system-ui', opacity: downloading ? 0.6 : 1, flexShrink: 0 }}
          >
            {downloading ? 'Génération...' : '↓ PDF'}
          </button>
        </header>

        <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 80px' }}>

          {/* ═══ SECTION 1: SYNTHÈSE ═══ */}
          <section id="synthese" style={{ marginBottom: 48 }}>
            <div style={{ background: '#1A1916', borderRadius: 20, padding: '36px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: g.color, opacity: 0.06, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 72, color: '#F7F5F2', lineHeight: 1, letterSpacing: -3 }}>{reportData.score}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(247,245,242,0.3)' }}>/100</div>
                  <div style={{ marginTop: 10, display: 'inline-block', background: `${g.color}22`, border: `1px solid ${g.color}44`, padding: '3px 14px', borderRadius: 20, fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, color: g.color }}>{g.label}</div>
                </div>
                <div style={{ paddingBottom: 4, flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', marginBottom: 6 }}>{url}</div>
                  <div style={{ fontSize: 14, color: 'rgba(247,245,242,0.6)', lineHeight: 1.65 }}>{reportData.verdict}</div>
                </div>
              </div>
            </div>

            {/* Criteria table */}
            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Les 8 critères GEO</div>
              {criteria.map((c, i) => {
                const pct = Math.round((c.score / c.max) * 100);
                const col = pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757';
                return (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <a href={`#critere-${i + 1}`} onClick={() => track(`nav-critere-${i + 1}`)} style={{ fontSize: 13, color: '#1A1916', textDecoration: 'none' }}>{c.name}</a>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 7px', borderRadius: 4, background: col + '18', color: col }}>{pct >= 75 ? 'BON' : pct >= 45 ? 'MOYEN' : 'FAIBLE'}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: col }}>{c.score}/{c.max}</span>
                      </div>
                    </div>
                    <div style={{ height: 4, background: '#F0EDE8', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top 3 actions + strengths */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Priorité absolue</div>
                <div style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.65 }}>{reportData.topPriority}</div>
              </div>
              <div style={{ background: 'rgba(16,163,127,0.06)', border: '1px solid rgba(16,163,127,0.2)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Points forts</div>
                {(reportData.strengths || []).map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#1A1916', lineHeight: 1.6, marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid rgba(16,163,127,0.3)' }}>{s}</div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ SECTION 2: CONTEXTE 2026 ═══ */}
          <section id="contexte" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Contexte 2026</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 20, lineHeight: 1.2 }}>Pourquoi la visibilité IA est critique en 2026</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {CTX_CARDS.map((card, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{card.label}</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: card.color, lineHeight: 1, marginBottom: 6 }}>{card.value}</div>
                  <p style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.6, margin: 0 }}>{card.text} <span style={{ color: '#B0ABA5' }}>({card.source})</span></p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ SECTION 3: TEST IA ═══ */}
          {citationTests.length > 0 && (
            <section id="test-ia" style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Test IA</div>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 20, lineHeight: 1.2 }}>Test de visibilité IA</h2>

              <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ background: '#1A1916', borderRadius: 14, padding: '20px 28px', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 36, color: '#F7F5F2' }}>{citedCount}/{citationTests.length}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.35)' }}>requêtes citent votre site</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
                  {citation.summary?.best_opportunity && (
                    <div style={{ background: '#E8F7F3', borderRadius: 10, padding: '12px 16px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', marginBottom: 4 }}>Meilleure opportunité</div>
                      <div style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.5 }}>{citation.summary.best_opportunity}</div>
                    </div>
                  )}
                  {citation.summary?.main_blocker && (
                    <div style={{ background: 'rgba(217,119,87,0.06)', borderRadius: 10, padding: '12px 16px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', marginBottom: 4 }}>Blocage principal</div>
                      <div style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.5 }}>{citation.summary.main_blocker}</div>
                    </div>
                  )}
                </div>
              </div>

              {citationTests.map((q, i) => (
                <CitationCard key={i} q={q} />
              ))}
            </section>
          )}

          {/* ═══ SECTION 4: 8 CRITÈRES ═══ */}
          <section id="criteres" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Analyse détaillée</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 24, lineHeight: 1.2 }}>Les 8 critères GEO</h2>

            {/* Criteria nav */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
              {criteria.map((c, i) => {
                const pct = Math.round((c.score / c.max) * 100);
                const col = pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757';
                return (
                  <a key={i} href={`#critere-${i + 1}`} onClick={() => track(`nav-critere-${i + 1}`)}
                    style={{ padding: '6px 12px', borderRadius: 8, background: '#fff', border: `1px solid ${col}33`, fontSize: 11, color: col, textDecoration: 'none', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    {c.score}/{c.max}
                  </a>
                );
              })}
            </div>

            {criteria.map((c, i) => {
              const pct = Math.round((c.score / c.max) * 100);
              const col = pct >= 75 ? '#10A37F' : pct >= 45 ? '#C9861A' : '#D97757';
              const criterionRecos = recos.filter(r => r.criterion === c.name || CRITERIA_ORDER.indexOf(r.criterion) === i);

              return (
                <div key={i} id={`critere-${i + 1}`} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '24px', marginBottom: 16, scrollMarginTop: 70 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680', letterSpacing: 2, marginBottom: 4 }}>Critère {i + 1}/8</div>
                      <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#1A1916', margin: 0, lineHeight: 1.2 }}>{c.name}</h3>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'Georgia,serif', fontSize: 32, color: col, lineHeight: 1 }}>{c.score}<span style={{ fontSize: 14, color: '#C0BBB5' }}>/{c.max}</span></div>
                    </div>
                  </div>
                  <div style={{ height: 6, background: '#E5E2DC', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 3 }} />
                  </div>

                  {criterionRecos.length > 0 ? criterionRecos.map((r, ri) => (
                    <RecoCard key={ri} r={r} index={ri} />
                  )) : (
                    <div style={{ background: '#E8F7F3', borderRadius: 10, padding: '16px 20px', fontSize: 13, color: '#10A37F' }}>
                      Ce critère est bien optimisé. ✓
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* ═══ SECTION 5: PLAN D'ACTION ═══ */}
          <section id="plan-action" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Plan d'action</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 20, lineHeight: 1.2 }}>Récapitulatif des actions</h2>
            <p style={{ fontSize: 13, color: '#8A8680', marginBottom: 20 }}>{recos.length} recommandations classées par priorité d'impact.</p>

            {recos.map((r, i) => {
              const pi = priorityInfo(r.priority);
              return (
                <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '16px 20px', marginBottom: 8, borderLeft: `4px solid ${pi.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: pi.color, minWidth: 24 }}>{i + 1}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 4, background: pi.bg, color: pi.color }}>{pi.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', flex: 1 }}>{r.title || r.criterion}</span>
                    {r.timeframe && <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#8A8680' }}>{r.timeframe}</span>}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ═══ SECTION 6: SCORE PROJETÉ ═══ */}
          <section id="projection" style={{ marginBottom: 48 }}>
            <div style={{ background: '#1A1916', borderRadius: 16, padding: '28px 32px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 48, color: '#10A37F', lineHeight: 1 }}>{projected}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.35)' }}>/100 projeté</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1.5, marginBottom: 6 }}>SCORE PROJETÉ APRÈS OPTIMISATION</div>
                  <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.7)', lineHeight: 1.6 }}>En appliquant les recommandations de ce rapport, votre score GEO pourrait passer de {reportData.score} à {projected}/100.</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(217,119,87,0.06)', borderLeft: '3px solid #D97757', borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 24 }}>
              <p style={{ fontSize: 11, color: '#3A3835', lineHeight: 1.6, margin: 0 }}>Ce score projeté est une estimation basée sur l'impact moyen observé des optimisations GEO. Les résultats réels dépendent de nombreux facteurs. Cette projection ne constitue pas une garantie.</p>
            </div>
          </section>

          {/* ═══ SECTION 7: CTA BEELEVEN ═══ */}
          <section id="beeleven" style={{ marginBottom: 48 }}>
            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 2, marginBottom: 8 }}>ALLER PLUS LOIN</div>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#1A1916', marginBottom: 10 }}>Besoin d'aide pour implémenter ces recommandations ?</div>
              <p style={{ fontSize: 14, color: '#6B6762', lineHeight: 1.7, marginBottom: 20, maxWidth: 480, margin: '0 auto 20px' }}>Beeleven, l'agence qui a créé Detekia, peut implémenter les recommandations pour vous : audit approfondi, optimisations techniques, suivi mensuel.</p>
              <a
                href="mailto:hello@detekia.fr?subject=Audit GEO — suite du rapport"
                onClick={() => track('click-beeleven')}
                style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '14px 36px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
              >
                Discutons-en →
              </a>
            </div>
          </section>

          {/* ═══ SECTION 8: MÉTHODOLOGIE ═══ */}
          <section id="methodologie" style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Transparence</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1A1916', letterSpacing: -0.5, marginBottom: 20, lineHeight: 1.2 }}>Méthodologie</h2>
            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '24px' }}>
              <p style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.75, marginBottom: 16 }}>Chaque page est analysée via un service de scraping spécialisé puis évaluée sur 8 critères pondérés. Le critère Neutralité éditoriale est évalué par intelligence artificielle (modèle Claude). Les scores sont calculés par des heuristiques déterministes.</p>
              <div style={{ background: '#F7F5F2', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#10A37F', letterSpacing: 1, marginBottom: 6 }}>SOURCE ACADÉMIQUE</div>
                <p style={{ fontSize: 12, color: '#1A1916', lineHeight: 1.5, margin: 0 }}>"Generative Engine Optimization" — Aggarwal et al., Princeton / Georgia Tech, KDD 2024.</p>
              </div>
              <div style={{ background: 'rgba(217,119,87,0.06)', borderLeft: '3px solid #D97757', borderRadius: '0 8px 8px 0', padding: '12px 16px' }}>
                <p style={{ fontSize: 11, color: '#3A3835', lineHeight: 1.5, margin: 0 }}>Les moteurs IA évoluent rapidement. Les résultats reflètent l'état des algorithmes à la date de génération. Le test de visibilité IA est une simulation.</p>
              </div>
            </div>
          </section>

          {/* ═══ FOOTER ═══ */}
          <footer style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid #E5E2DC' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#B0ABA5', marginBottom: 4 }}>Rapport généré le {date}</div>
            <div style={{ fontSize: 11, color: '#B0ABA5' }}>Beeleven SASU · hello@detekia.fr · <a href="https://detekia.fr" style={{ color: '#D97757', textDecoration: 'none' }}>detekia.fr</a></div>
          </footer>
        </main>
      </div>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function CitationCard({ q }) {
  const [open, setOpen] = useState(false);
  const citedStyle = q.cited
    ? { bg: 'rgba(16,163,127,0.12)', color: '#10A37F', label: 'Cité' }
    : { bg: 'rgba(217,119,87,0.12)', color: '#D97757', label: 'Non cité' };
  const typeLabel = q.difficulty === 'generic' ? 'GÉNÉRIQUE' : q.difficulty === 'niche' ? 'NICHE' : 'LONGUE TRAÎNE';

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 10, padding: '14px 18px', marginBottom: 8, cursor: 'pointer', transition: 'border-color 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: open ? 8 : 0 }}>
        <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, background: citedStyle.bg, color: citedStyle.color }}>{citedStyle.label}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#B0ABA5' }}>{typeLabel}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', flex: 1 }}>{q.query}</span>
        <span style={{ fontSize: 11, color: '#B0ABA5', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </div>
      {open && (
        <div style={{ paddingTop: 8, borderTop: '1px solid #F0EDE8' }}>
          {q.competitors_cited?.length > 0 && (
            <div style={{ fontSize: 11, color: '#8A8680', marginBottom: 4 }}>Cités à votre place : {q.competitors_cited.join(', ')}</div>
          )}
          {q.recommendation && (
            <div style={{ fontSize: 12, color: '#3A3835', lineHeight: 1.5 }}>{q.recommendation}</div>
          )}
        </div>
      )}
    </div>
  );
}

function RecoCard({ r, index }) {
  const pi = priorityInfo(r.priority);
  const ei = effortInfo(r.effort);

  return (
    <div style={{ border: `1px solid ${pi.color}28`, borderLeft: `4px solid ${pi.color}`, borderRadius: '0 14px 14px 0', overflow: 'hidden', marginBottom: 12 }}>
      <div style={{ padding: '12px 18px 10px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 6, background: pi.bg, color: pi.color }}>{pi.label}</span>
        {r.title && <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1916' }}>{r.title}</span>}
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8' }}>#{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div style={{ padding: '12px 18px' }}>
        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
          {r.impact && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, background: pi.bg, color: pi.color }}>Impact {r.impact === 'high' ? 'Élevé' : r.impact === 'medium' ? 'Moyen' : 'Faible'}</span>}
          {r.effort && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, background: `${ei.color}18`, color: ei.color }}>Effort {ei.label}</span>}
          {r.timeframe && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, fontFamily: 'monospace', fontSize: 9, background: '#F7F5F2', color: '#8A8680', border: '1px solid #E5E2DC' }}>{r.timeframe}</span>}
        </div>

        {/* Problem / Solution */}
        {r.problem && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#D97757', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Le problème</div>
            <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.55 }}>{r.problem}</div>
          </div>
        )}
        {r.solution && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#10A37F', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>La solution</div>
            <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.55 }}>{r.solution}</div>
          </div>
        )}

        {/* Technical implementation */}
        {r.technicalImplementation && (
          <div style={{ background: '#F7F5F2', borderRadius: 8, padding: '12px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1A1916', marginBottom: 6 }}>🛠️ Mise en œuvre technique</div>
            {Array.isArray(r.technicalImplementation) ? (
              <ol style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.5, margin: 0, paddingLeft: 20 }}>
                {r.technicalImplementation.map((step, si) => <li key={si} style={{ marginBottom: 4 }}>{step}</li>)}
              </ol>
            ) : (
              <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.5 }}>{r.technicalImplementation}</div>
            )}
          </div>
        )}

        {/* Code example */}
        {r.codeExample && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1A1916', marginBottom: 5 }}>&lt;/&gt; Exemple de code</div>
            <pre style={{ background: '#1A1916', color: '#F7F5F2', borderRadius: 8, padding: 14, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflow: 'auto', maxHeight: 300 }}>{r.codeExample}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
