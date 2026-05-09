import Link from 'next/link';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { useTranslation } from '../lib/useTranslation';

export default function Monitor() {
  const { t, locale } = useTranslation();
  const isFr = locale !== 'en';

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <SEO
        title={isFr ? 'GEO Monitor — Surveillez votre visibilité dans les IA — Detekia' : 'GEO Monitor — Track Your AI Visibility — Detekia'}
        description={isFr
          ? 'Découvrez ce que ChatGPT, Gemini, Perplexity et Claude disent de votre marque. Taux de mention, position, sentiment, concurrents — un audit complet de votre présence IA.'
          : 'Discover what ChatGPT, Gemini, Perplexity and Claude say about your brand. Mention rate, position, sentiment, competitors — a complete audit of your AI presence.'}
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Detekia GEO Monitor",
          "description": "Monitoring de présence de marque dans les réponses des moteurs IA",
          "provider": { "@type": "Organization", "name": "Detekia", "url": "https://detekia.fr" },
          "serviceType": "AI Brand Monitoring",
        }}
      />

      <Header ctaLabel={t('nav.ctaAnalyze')} />
      <main>

      {/* ─── HERO ─── */}
      <div style={{ background: '#1A1916', padding: '80px 24px 88px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.1), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,163,127,0.06), transparent 70%)' }} />

        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(217,119,87,0.3)', padding: '5px 14px', borderRadius: 20, marginBottom: 24, background: 'rgba(217,119,87,0.06)' }}>
            GEO Monitor
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.08, letterSpacing: -1.5, marginBottom: 20, color: '#F7F5F2', fontWeight: 800 }}>
            {isFr ? <>Découvrez ce que les IA<br /><span style={{ color: '#D97757' }}>disent de votre marque</span></> : <>Discover what AI engines<br /><span style={{ color: '#D97757' }}>say about your brand</span></>}
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(247,245,242,0.6)', lineHeight: 1.65, fontFamily: 'system-ui', maxWidth: 560, margin: '0 auto 36px' }}>
            {isFr
              ? 'ChatGPT, Gemini, Perplexity, Claude — quand vos clients posent des questions, est-ce que les IA vous recommandent ? Ou vos concurrents ?'
              : 'ChatGPT, Gemini, Perplexity, Claude — when your customers ask questions, do AI engines recommend you? Or your competitors?'}
          </p>
          <Link href="/contact" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: 'system-ui' }}>
            {isFr ? 'Demander un audit de présence →' : 'Request a presence audit →'}
          </Link>
        </div>
      </div>

      {/* ─── KPIs ─── */}
      <div style={{ maxWidth: 960, margin: '-48px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { num: isFr ? 'Taux de mention' : 'Mention rate', desc: isFr ? 'Combien de fois votre marque apparaît dans les réponses IA sur vos requêtes stratégiques.' : 'How often your brand appears in AI responses on your strategic queries.', icon: '📊' },
            { num: isFr ? 'Position moyenne' : 'Average position', desc: isFr ? 'Quand vous êtes cité, apparaissez-vous en 1ère, 2ème ou dernière position ?' : 'When cited, do you appear in 1st, 2nd or last position?', icon: '🏆' },
            { num: isFr ? 'Sentiment' : 'Sentiment', desc: isFr ? 'Les IA parlent-elles de vous positivement, neutrement, ou négativement ?' : 'Do AI engines talk about you positively, neutrally, or negatively?', icon: '💬' },
            { num: isFr ? 'Concurrents' : 'Competitors', desc: isFr ? 'Qui est cité à votre place ? Sur quelles requêtes ? Avec quel sentiment ?' : 'Who is cited instead of you? On which queries? With what sentiment?', icon: '⚔️' },
          ].map((kpi, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 16, padding: '28px 24px', boxShadow: '0 8px 32px rgba(26,25,22,0.08)' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{kpi.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 6 }}>{kpi.num}</div>
              <div style={{ fontSize: 13, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.5 }}>{kpi.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── COMMENT CA MARCHE ─── */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            {isFr ? 'Comment ça marche' : 'How it works'}
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.15, letterSpacing: -1, color: '#1A1916', marginBottom: 12 }}>
            {isFr ? 'On interroge les IA comme vos clients le feraient' : 'We query AI engines like your customers would'}
          </h2>
          <p style={{ fontSize: 15, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 560, margin: '0 auto' }}>
            {isFr
              ? 'Nous sélectionnons ensemble les requêtes stratégiques de votre secteur, puis nous interrogeons les 4 principaux LLM pour mesurer votre visibilité réelle.'
              : 'We select your industry\'s strategic queries together, then interrogate the 4 main LLMs to measure your real visibility.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { n: '1', title: isFr ? 'Définition des requêtes stratégiques' : 'Strategic query definition', desc: isFr ? 'Nous identifions avec vous les 50 à 200 requêtes que vos prospects posent aux IA. Par thématique, par intention, par zone géographique.' : 'We identify with you the 50 to 200 queries your prospects ask AI engines. By theme, intent, and geography.' },
            { n: '2', title: isFr ? 'Interrogation des 4 LLM majeurs' : 'Querying the 4 major LLMs', desc: isFr ? 'Chaque requête est envoyée à ChatGPT, Gemini, Claude et Perplexity. Les réponses complètes sont collectées et analysées.' : 'Each query is sent to ChatGPT, Gemini, Claude and Perplexity. Full responses are collected and analyzed.' },
            { n: '3', title: isFr ? 'Analyse multi-dimensionnelle' : 'Multi-dimensional analysis', desc: isFr ? 'Taux de mention, position dans la réponse, sentiment (positif/neutre/négatif), concurrents cités, sources utilisées, verbatims exacts.' : 'Mention rate, response position, sentiment, competitors cited, sources used, exact verbatims.' },
            { n: '4', title: isFr ? 'Dashboard interactif + recommandations' : 'Interactive dashboard + recommendations', desc: isFr ? 'Un rapport web interactif avec filtres par thématique, par LLM, par concurrent. Incluant les actions prioritaires pour améliorer votre présence.' : 'An interactive web report with filters by theme, LLM, competitor. Including priority actions to improve your presence.' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, padding: '24px 0', borderBottom: '1px solid #E5E2DC' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#fff', background: '#D97757', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0 }}>{step.n}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CAS CONCRET ─── */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '80px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            {isFr ? 'Cas concret' : 'Case study'}
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.15, letterSpacing: -1, color: '#1A1916', marginBottom: 12 }}>
            {isFr ? 'Audit de présence IA — secteur bancaire' : 'AI presence audit — banking sector'}
          </h2>
          <p style={{ fontSize: 15, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.65, maxWidth: 560, margin: '0 auto' }}>
            {isFr
              ? '75 requêtes stratégiques × 4 LLM = 300 réponses analysées. Voici les résultats.'
              : '75 strategic queries × 4 LLMs = 300 responses analyzed. Here are the results.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          <div style={{ background: '#1A1916', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 42, fontWeight: 900, color: '#D97757', letterSpacing: -2 }}>45,9%</div>
            <div style={{ fontSize: 14, color: 'rgba(247,245,242,0.6)', fontFamily: 'system-ui', marginTop: 8 }}>{isFr ? 'Taux de mention' : 'Mention rate'}</div>
            <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.35)', fontFamily: 'system-ui', marginTop: 4 }}>{isFr ? 'La marque apparaît dans presque 1 réponse sur 2' : 'Brand appears in almost 1 in 2 responses'}</div>
          </div>
          <div style={{ background: '#1A1916', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 42, fontWeight: 900, color: '#10A37F', letterSpacing: -2 }}>2,08</div>
            <div style={{ fontSize: 14, color: 'rgba(247,245,242,0.6)', fontFamily: 'system-ui', marginTop: 8 }}>{isFr ? 'Position moyenne' : 'Average position'}</div>
            <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.35)', fontFamily: 'system-ui', marginTop: 4 }}>{isFr ? 'Citée en 2ème position en moyenne' : 'Cited in 2nd position on average'}</div>
          </div>
          <div style={{ background: '#1A1916', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 42, fontWeight: 900, color: '#C9861A', letterSpacing: -2 }}>102</div>
            <div style={{ fontSize: 14, color: 'rgba(247,245,242,0.6)', fontFamily: 'system-ui', marginTop: 8 }}>{isFr ? 'Mentions totales' : 'Total mentions'}</div>
            <div style={{ fontSize: 12, color: 'rgba(247,245,242,0.35)', fontFamily: 'system-ui', marginTop: 4 }}>{isFr ? 'Sur 300 réponses analysées' : 'Across 300 analyzed responses'}</div>
          </div>
        </div>

        <div style={{ background: '#1A1916', borderRadius: 16, padding: '28px 32px', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{isFr ? 'Insights révélés' : 'Key insights'}</div>
            <div style={{ fontSize: 14, color: 'rgba(247,245,242,0.7)', fontFamily: 'system-ui', lineHeight: 1.7 }}>
              {isFr ? (
                <>
                  <strong style={{ color: '#F7F5F2' }}>Leader sur le crédit et l'assurance</strong> — mais quasi absent sur l'épargne et la retraite, deux thématiques à fort volume de requêtes.<br /><br />
                  <strong style={{ color: '#F7F5F2' }}>22 mentions négatives détectées</strong> — principalement sur les frais et le financement d'énergies fossiles. Des verbatims exacts permettent d'identifier les contenus source.
                </>
              ) : (
                <>
                  <strong style={{ color: '#F7F5F2' }}>Leader on credit and insurance</strong> — but nearly absent on savings and retirement, two high-volume query topics.<br /><br />
                  <strong style={{ color: '#F7F5F2' }}>22 negative mentions detected</strong> — mainly about fees and fossil fuel financing. Exact verbatims identify the source content.
                </>
              )}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#10A37F', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{isFr ? 'Livrables' : 'Deliverables'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(isFr
                ? ['Dashboard interactif avec filtres', 'Analyse par thématique (5 axes)', 'Benchmark concurrentiel détaillé', 'Verbatims négatifs avec sources', 'Tableau des 75 requêtes × 4 LLM', 'Recommandations prioritaires']
                : ['Interactive dashboard with filters', 'Analysis by theme (5 axes)', 'Detailed competitive benchmark', 'Negative verbatims with sources', 'Table of 75 queries × 4 LLMs', 'Priority recommendations']
              ).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#10A37F', fontSize: 12 }}>✓</span>
                  <span style={{ fontSize: 13, color: 'rgba(247,245,242,0.65)', fontFamily: 'system-ui' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── POUR QUI ─── */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.15, letterSpacing: -1, color: '#1A1916' }}>
            {isFr ? 'Pour qui ?' : 'Who is it for?'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {(isFr ? [
            { title: 'Grandes entreprises & ETI', desc: 'Vous savez que vos clients utilisent ChatGPT. Vous ne savez pas ce qu\'il dit de vous. Le GEO Monitor vous donne la réponse — et les leviers pour l\'améliorer.' },
            { title: 'Marques grand public', desc: 'Quand un consommateur demande "meilleur [votre catégorie]" à une IA, êtes-vous dans la réponse ? Avec quel sentiment ? Le Monitor le mesure.' },
            { title: 'Agences & consultants', desc: 'Proposez le GEO Monitor comme prestation premium à vos clients. Un livrable différenciant que vos concurrents ne proposent pas encore.' },
            { title: 'Direction marketing & e-reputation', desc: 'Les IA sont le nouveau canal de réputation. 22 mentions négatives non détectées peuvent coûter cher. Le Monitor les identifie.' },
          ] : [
            { title: 'Large companies & mid-caps', desc: 'You know your customers use ChatGPT. You don\'t know what it says about you. GEO Monitor gives you the answer — and the levers to improve it.' },
            { title: 'Consumer brands', desc: 'When a consumer asks "best [your category]" to an AI, are you in the response? With what sentiment? Monitor measures it.' },
            { title: 'Agencies & consultants', desc: 'Offer GEO Monitor as a premium service to your clients. A differentiating deliverable your competitors don\'t offer yet.' },
            { title: 'Marketing & e-reputation teams', desc: 'AI is the new reputation channel. 22 undetected negative mentions can be costly. Monitor identifies them.' },
          ]).map((item, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, padding: '24px 22px', boxShadow: '0 2px 12px rgba(26,25,22,0.05)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: '#6B6762', fontFamily: 'system-ui', lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CTA FINAL ─── */}
      <div style={{ background: '#1A1916', padding: '72px 24px', marginTop: 80, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(217,119,87,0.08), transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.15, letterSpacing: -1, color: '#F7F5F2', marginBottom: 16 }}>
            {isFr ? 'Prêt à découvrir ce que les IA disent de vous ?' : 'Ready to discover what AI says about you?'}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(247,245,242,0.5)', fontFamily: 'system-ui', lineHeight: 1.65, marginBottom: 32 }}>
            {isFr
              ? 'Contactez-nous pour définir ensemble vos requêtes stratégiques et lancer votre premier audit de présence IA.'
              : 'Contact us to define your strategic queries together and launch your first AI presence audit.'}
          </p>
          <Link href="/contact" style={{ display: 'inline-block', background: '#D97757', color: '#fff', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', fontFamily: 'system-ui' }}>
            {isFr ? 'Nous contacter →' : 'Contact us →'}
          </Link>
          <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.3)', marginTop: 16, fontFamily: 'system-ui' }}>contact@detekia.fr</div>
        </div>
      </div>

      </main>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 700px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
