import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const CRITERIA_INFO = {
  'Extractibilité & réponse directe': {
    emoji: '🎯',
    title: 'Extractibilité & réponse directe',
    desc: 'Les IA cherchent des réponses "prêtes à citer" dans votre contenu. Si votre texte répond clairement dès les premières lignes, avec des listes et des tableaux, les IA peuvent l\'extraire et le réutiliser facilement.',
    impact: 'Critère n°1 — 25 points',
    color: '#4285F4',
  },
  'Vérifiabilité & preuves': {
    emoji: '🔬',
    title: 'Vérifiabilité & preuves',
    desc: 'Les IA citent en priorité les contenus qui prouvent ce qu\'ils avancent : chiffres sourcés, dates précises, liens vers des sources primaires.',
    impact: '20 points',
    color: '#10A37F',
  },
  'Autorité & E-E-A-T': {
    emoji: '🏆',
    title: 'Autorité & E-E-A-T',
    desc: 'E-E-A-T signifie Expérience, Expertise, Autorité, Confiance. Les IA favorisent les sites dont l\'auteur est identifié, avec une biographie et des pages About/Contact claires.',
    impact: '15 points',
    color: '#10A37F',
  },
  'Crawlabilité IA': {
    emoji: '🤖',
    title: 'Crawlabilité IA',
    desc: 'Les IA comme ChatGPT utilisent des robots (GPTBot, OAI-SearchBot) pour lire votre site. Si votre contenu est caché derrière du JavaScript ou bloqué dans robots.txt, ces robots ne peuvent pas l\'indexer.',
    impact: '15 points',
    color: '#4285F4',
  },
  'Données structurées': {
    emoji: '🧩',
    title: 'Données structurées (Schema.org)',
    desc: 'Le Schema.org est un langage que les IA lisent en priorité. Il leur dit explicitement ce qu\'est votre site, qui l\'a écrit, et de quoi il parle.',
    impact: '10 points',
    color: '#4285F4',
  },
  'Neutralité éditoriale': {
    emoji: '⚖️',
    title: 'Neutralité éditoriale',
    desc: 'Les IA évitent de citer des contenus trop promotionnels ou biaisés. Un texte factuel et nuancé sera beaucoup plus souvent repris comme source.',
    impact: '10 points',
    color: '#10A37F',
  },
  'Présence externe': {
    emoji: '🌐',
    title: 'Présence externe',
    desc: 'Les IA croisent plusieurs sources pour évaluer votre crédibilité. Être mentionné dans la presse ou sur les réseaux sociaux renforce votre autorité perçue.',
    impact: '5 points',
    color: '#10A37F',
  },
  'Fraîcheur & maintenance': {
    emoji: '📅',
    title: 'Fraîcheur & maintenance',
    desc: 'Pour les sujets qui évoluent, les IA préfèrent les contenus récents. Une date de mise à jour visible et un copyright récent signalent que votre site est actif.',
    impact: '5 points',
    color: '#C9861A',
  },
};

function Tooltip({ info }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  if (!info) return null;

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ top: rect.bottom + 8, left: rect.left });
        setVisible(true);
      }}
      onMouseLeave={() => setVisible(false)}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', background: 'rgba(138,134,128,0.12)', color: '#8A8680', fontSize: 10, fontFamily: 'system-ui', fontWeight: 600, cursor: 'help', marginLeft: 6, flexShrink: 0, border: '1px solid rgba(138,134,128,0.2)' }}>ⓘ</span>
      {visible && (
        <div style={{ position: 'fixed', top: pos.top, left: Math.min(pos.left, typeof window !== 'undefined' ? window.innerWidth - 320 : 0), width: 300, zIndex: 1000, background: '#1A1916', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px', boxShadow: '0 16px 48px rgba(0,0,0,0.24)', animation: 'tooltipIn 0.15s ease', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>{info.emoji}</span>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#F7F5F2' }}>{info.title}</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(247,245,242,0.6)', lineHeight: 1.65, fontFamily: 'system-ui', marginBottom: 12 }}>{info.desc}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: info.color }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: info.color, letterSpacing: 1 }}>{info.impact}</span>
          </div>
        </div>
      )}
    </span>
  );
}

function GroupAccordion({ group, getCriteriaForGroup, getLevelColor }) {
  const [hovered, setHovered] = useState(false);
  const criteria = getCriteriaForGroup(group);

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', background: hovered ? group.colorLight : '#fff', border: `1.5px solid ${hovered ? group.color : '#E5E2DC'}`, borderRadius: hovered && criteria.length > 0 ? '12px 12px 0 0' : 12, cursor: 'default', transition: 'all 0.4s ease' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: group.color, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{group.label}</span>
        <span style={{ fontSize: 12, color: '#8A8680', fontFamily: 'system-ui' }}>— {group.desc}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: group.color, fontFamily: 'system-ui' }}>{hovered ? '▲ Masquer' : '▼ Voir l\'analyse'}</span>
      </div>
      {hovered && (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ border: `1.5px solid ${group.color}`, borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden', animation: 'fadeIn 0.5s ease' }}>
          {criteria.map((c, i) => {
            const levelColor = getLevelColor(c.score, c.max);
            const pct = Math.round((c.score / c.max) * 100);
            const info = CRITERIA_INFO[c.name];
            return (
              <div key={i} style={{ background: '#fff', padding: '16px 20px', borderTop: i > 0 ? '1px solid #E5E2DC' : 'none', borderLeft: `3px solid ${levelColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1916', fontFamily: 'system-ui' }}>{c.name}</span>
                    <Tooltip info={info} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 4, background: levelColor + '18', color: levelColor }}>{pct >= 75 ? 'BON' : pct >= 45 ? 'MOYEN' : 'FAIBLE'}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 500, color: levelColor }}>{c.score}/{c.max}</span>
                  </div>
                </div>
                <div style={{ height: 3, background: '#E5E2DC', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: levelColor, borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 12, color: '#8A8680', lineHeight: 1.6, fontFamily: 'system-ui' }}>{c.detail}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecoCard({ r, index, isPaid, onCheckout }) {
  const tagColors = {
    high:   { bg: 'rgba(217,119,87,0.12)', color: '#D97757', border: 'rgba(217,119,87,0.3)' },
    medium: { bg: 'rgba(201,134,26,0.12)', color: '#C9861A', border: 'rgba(201,134,26,0.3)' },
    low:    { bg: 'rgba(16,163,127,0.12)', color: '#10A37F', border: 'rgba(16,163,127,0.3)' },
  };
  const tagLabels = { high: 'Critique', medium: 'Important', low: 'Bonus' };
  const tag = tagColors[r.priority] || tagColors.medium;

  if (!isPaid && index >= 1) {
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 14, overflow: 'hidden', borderLeft: `4px solid ${tag.color}`, opacity: 0.65 }}>
          <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 6, fontWeight: 500, background: tag.bg, color: tag.color }}>{tagLabels[r.priority]}</span>
            {r.criterion && <span style={{ fontSize: 11, color: '#8A8680', fontFamily: 'monospace' }}>{r.criterion}</span>}
            <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8' }}>#{String(index + 1).padStart(2, '0')}</span>
            <span style={{ fontSize: 13, color: '#C2BDB8' }}>🔒</span>
          </div>
          <div style={{ padding: '0 24px 16px', filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
            <div style={{ height: 10, background: '#E5E2DC', borderRadius: 4, marginBottom: 8, width: '90%' }} />
            <div style={{ height: 10, background: '#E5E2DC', borderRadius: 4, marginBottom: 8, width: '75%' }} />
            <div style={{ height: 10, background: '#E5E2DC', borderRadius: 4, width: '55%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!isPaid && index === 0) {
    const preview = (r.text || r.diagnostic || '').slice(0, 350);
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ background: '#fff', border: `1px solid ${tag.border}`, borderRadius: 14, overflow: 'hidden', borderLeft: `4px solid ${tag.color}` }}>
          <div style={{ padding: '16px 24px 14px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 6, fontWeight: 500, background: tag.bg, color: tag.color }}>{tagLabels[r.priority]}</span>
            {r.criterion && <span style={{ fontSize: 11, color: '#8A8680', fontFamily: 'monospace' }}>{r.criterion}</span>}
            <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8' }}>#01</span>
          </div>
          <div style={{ padding: '16px 24px 0', position: 'relative' }}>
            <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.8, fontFamily: 'system-ui' }}>{preview}...</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to bottom, transparent, #ffffff)', pointerEvents: 'none' }} />
          </div>
          <div style={{ margin: '12px 24px 20px', padding: '14px 18px', background: '#F7F5F2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 3 }}>🔒 Recommandation complète masquée</div>
              <div style={{ fontSize: 11, color: '#8A8680', fontFamily: 'system-ui' }}>Méthode, exemples et impact détaillé dans le rapport complet.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
              <button onClick={onCheckout} style={{ background: tag.color, color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 12, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'system-ui' }}>Débloquer →</button>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757' }}>
                19,99€{' '}<span style={{ textDecoration: 'line-through', color: '#C2BDB8' }}>59,99€</span>{' '}· lancement
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sections = [];
  if (r.diagnostic) sections.push({ icon: '🔍', title: 'Diagnostic', content: r.diagnostic });
  if (r.whyCritical) sections.push({ icon: '⚠️', title: 'Pourquoi c\'est critique', content: r.whyCritical });
  if (r.whatToDo) sections.push({ icon: '✅', title: 'Ce qu\'il faut faire', content: r.whatToDo });
  if (r.howToDoIt) sections.push({ icon: '🛠️', title: 'Comment le faire', content: r.howToDoIt });
  if (r.concreteExample) sections.push({ icon: '💡', title: 'Exemple concret', content: r.concreteExample });
  if (r.expectedImpact) sections.push({ icon: '📈', title: 'Impact attendu', content: r.expectedImpact });
  if (r.expertTip) sections.push({ icon: '🎯', title: 'Tip d\'expert', content: r.expertTip });
  if (sections.length === 0 && r.text) sections.push({ icon: '✅', title: 'Recommandation', content: r.text });

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ background: '#fff', border: `1px solid ${tag.border}`, borderRadius: 14, overflow: 'hidden', borderLeft: `4px solid ${tag.color}` }}>
        <div style={{ padding: '16px 24px 14px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 6, fontWeight: 500, background: tag.bg, color: tag.color }}>{tagLabels[r.priority]}</span>
          {r.criterion && <span style={{ fontSize: 11, color: '#8A8680', fontFamily: 'monospace' }}>{r.criterion}</span>}
          {r.title && <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: 'system-ui' }}>{r.title}</span>}
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#C2BDB8', marginLeft: r.title ? 8 : 'auto' }}>#{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sections.map((s, j) => (
            <div key={j} style={{ background: '#FAFAF9', borderRadius: 8, padding: '12px 16px', border: '1px solid #E5E2DC' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1916', marginBottom: 6, fontFamily: 'system-ui' }}>{s.icon} {s.title}</div>
              <div style={{ fontSize: 13, color: '#3A3835', lineHeight: 1.75, fontFamily: 'system-ui' }}>{s.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Results() {
  const router = useRouter();
  const { url } = router.query;
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingDots, setLoadingDots] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'rapport', url }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error('Checkout error:', e);
    } finally {
      setCheckoutLoading(false);
    }
  }

  const steps = [
    { icon: '🔍', text: 'Récupération du site', sub: 'Connexion et scraping du contenu...' },
    { icon: '🧩', text: 'Données structurées', sub: 'Analyse des schemas et balises...' },
    { icon: '💬', text: 'Citabilité & preuves', sub: 'Évaluation de la qualité du contenu...' },
    { icon: '🌐', text: 'Présence externe', sub: 'Vérification des signaux d\'autorité...' },
    { icon: '🤖', text: 'Analyse par IA', sub: 'Claude évalue et génère les recommandations...' },
  ];

  const groups = [
    { id: 'lisibility', label: 'Lisibilité IA', desc: 'Votre site peut-il être lu et compris par les IA ?', color: '#4285F4', colorLight: 'rgba(66,133,244,0.08)', criteria: ['Extractibilité & réponse directe', 'Crawlabilité IA', 'Données structurées'] },
    { id: 'credibility', label: 'Crédibilité', desc: 'Les IA peuvent-elles vous faire confiance ?', color: '#10A37F', colorLight: 'rgba(16,163,127,0.08)', criteria: ['Vérifiabilité & preuves', 'Autorité & E-E-A-T', 'Neutralité éditoriale', 'Présence externe'] },
    { id: 'freshness', label: 'Fraîcheur', desc: 'Votre contenu est-il récent et maintenu ?', color: '#C9861A', colorLight: 'rgba(201,134,26,0.08)', criteria: ['Fraîcheur & maintenance'] },
  ];

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setLoadingDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(dotsInterval);
  }, []);

  useEffect(() => {
    if (!url) return;
    let stepInterval = setInterval(() => {
      setStep(s => s < steps.length - 1 ? s + 1 : s);
    }, 1200);

    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
      .then(r => r.json())
      .then(data => {
        clearInterval(stepInterval);
        setStep(steps.length);
        if (data.error) setError(data.error);
        else setResult(data);
      })
      .catch(e => {
        clearInterval(stepInterval);
        setError(e.message);
      });

    return () => clearInterval(stepInterval);
  }, [url]);

  function getGrade(score) {
    if (score >= 70) return { label: 'BON', color: '#10A37F', bg: 'rgba(16,163,127,0.12)' };
    if (score >= 45) return { label: 'MOYEN', color: '#C9861A', bg: 'rgba(201,134,26,0.12)' };
    return { label: 'FAIBLE', color: '#D97757', bg: 'rgba(217,119,87,0.12)' };
  }

  function getCriteriaForGroup(group) {
    if (!result) return [];
    return result.criteria.filter(c => group.criteria.includes(c.name));
  }

  function getGroupScore(group) {
    const items = getCriteriaForGroup(group);
    return { score: items.reduce((s, c) => s + c.score, 0), max: items.reduce((s, c) => s + c.max, 0) };
  }

  function getLevelColor(score, max) {
    const pct = score / max;
    if (pct >= 0.75) return '#10A37F';
    if (pct >= 0.45) return '#C9861A';
    return '#D97757';
  }

  const isPaid = false;
  const grade = result ? getGrade(result.score) : null;
  const recommendations = result?.recommendations || [];

  return (
    <div style={{ background: '#F7F5F2', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: '1px solid #E5E2DC', background: 'rgba(247,245,242,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1A1916', fontFamily: 'Georgia, serif' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 16, height: 16 }}>
            {['#10A37F','#D97757','#4285F4','#1C7DC4'].map((c,i) => (
              <div key={i} style={{ background: c, borderRadius: '50%' }} />
            ))}
          </div>
          Detekia
        </a>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <a href="/pricing" style={{ fontSize: 12, color: '#8A8680', textDecoration: 'none', fontFamily: 'system-ui' }}>Tarifs</a>
          <a href="/" style={{ fontSize: 12, fontWeight: 600, background: '#1A1916', color: '#F7F5F2', padding: '7px 16px', borderRadius: 8, textDecoration: 'none', fontFamily: 'system-ui' }}>+ Nouvelle analyse</a>
        </div>
      </nav>

      {!result && !error && (
        <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <div style={{ width: '100%', maxWidth: 560 }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E5E2DC', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97757', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#8A8680' }}>{url}</span>
              </div>
              <h1 style={{ fontSize: 32, color: '#1A1916', letterSpacing: -1, marginBottom: 8, lineHeight: 1.1 }}>Audit GEO en cours{loadingDots}</h1>
              <p style={{ fontSize: 14, color: '#8A8680', fontFamily: 'system-ui' }}>Analyse complète de votre citabilité IA</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #E5E2DC', borderRadius: 20, padding: '32px 36px', boxShadow: '0 4px 32px rgba(26,25,22,0.06)' }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase' }}>Progression</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757' }}>{Math.round((step / steps.length) * 100)}%</span>
                </div>
                <div style={{ height: 4, background: '#F0EDE8', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(step / steps.length) * 100}%`, background: 'linear-gradient(90deg, #D97757, #C9861A)', borderRadius: 4, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
                </div>
              </div>
              {steps.map((s, i) => {
                const isDone = i < step;
                const isActive = i === step;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0', borderBottom: i < steps.length - 1 ? '1px solid #F7F5F2' : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? '#10A37F' : isActive ? '#1A1916' : '#F0EDE8', transition: 'all 0.4s ease' }}>
                      {isDone ? <span style={{ color: '#fff', fontSize: 14 }}>✓</span> : isActive ? <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(247,245,242,0.3)', borderTopColor: '#F7F5F2', animation: 'spin 0.8s linear infinite' }} /> : <span style={{ fontSize: 16 }}>{s.icon}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isDone ? '#10A37F' : isActive ? '#1A1916' : '#C2BDB8', fontFamily: 'system-ui' }}>{s.text}</div>
                      {isActive && <div style={{ fontSize: 11, color: '#8A8680', fontFamily: 'system-ui', marginTop: 2 }}>{s.sub}</div>}
                    </div>
                    {isDone && <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#10A37F' }}>OK</span>}
                  </div>
                );
              })}
            </div>
            <p style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 11, color: '#C2BDB8', marginTop: 20 }}>Analyse complète · ~20-30 secondes</p>
          </div>
        </div>
      )}

      {error && (
        <div style={{ maxWidth: 560, margin: '80px auto', padding: '0 24px' }}>
          <div style={{ background: 'rgba(217,119,87,0.06)', border: '1px solid rgba(217,119,87,0.2)', borderRadius: 16, padding: '28px 32px' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#1A1916', fontFamily: 'system-ui', marginBottom: 8 }}>Analyse impossible</div>
            <div style={{ fontSize: 13, color: '#8A8680', fontFamily: 'system-ui', lineHeight: 1.6, marginBottom: 20 }}>{error}</div>
            <a href="/" style={{ display: 'inline-block', background: '#1A1916', color: '#F7F5F2', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>← Réessayer</a>
          </div>
        </div>
      )}

      {result && grade && (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 100px' }}>

          <div style={{ background: '#1A1916', borderRadius: 24, overflow: 'hidden', marginBottom: 20, boxShadow: '0 12px 48px rgba(26,25,22,0.18)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: grade.color, opacity: 0.06, pointerEvents: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 20px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 68, lineHeight: 1, color: '#F7F5F2', letterSpacing: -3, marginBottom: 4 }}>{result.score}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(247,245,242,0.25)', letterSpacing: 1 }}>/100</div>
                <div style={{ marginTop: 14, fontFamily: 'monospace', fontSize: 9, letterSpacing: 2, padding: '4px 12px', borderRadius: 20, background: grade.bg, color: grade.color }}>{grade.label}</div>
              </div>
              <div style={{ padding: '32px 36px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#D97757', marginBottom: 8 }}>{url}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#F7F5F2', marginBottom: 12, lineHeight: 1.2 }}>
                  {grade.label === 'BON' ? 'Excellente citabilité IA' : grade.label === 'MOYEN' ? 'Citabilité IA à améliorer' : 'Citabilité IA insuffisante'}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.5)', lineHeight: 1.7, fontFamily: 'system-ui' }}>{result.verdict}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  {groups.map(g => {
                    const { score, max } = getGroupScore(g);
                    const pct = Math.round((score / max) * 100);
                    return (
                      <div key={g.id} style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 8, color: g.color, letterSpacing: 1, textTransform: 'uppercase' }}>{g.label}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(247,245,242,0.3)' }}>{score}/{max}</span>
                        </div>
                        <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: g.color, borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Analyse détaillée</div>
          {groups.map(group => (
            <GroupAccordion key={group.id} group={group} getCriteriaForGroup={getCriteriaForGroup} getLevelColor={getLevelColor} />
          ))}

          {recommendations.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A8680', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Plan d'action GEO</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1916', letterSpacing: -0.5 }}>{recommendations.length} recommandations expertes</div>
                </div>
                {!isPaid && (
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#D97757', background: 'rgba(217,119,87,0.08)', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(217,119,87,0.2)' }}>
                    1 aperçu · {recommendations.length - 1} verrouillées
                  </div>
                )}
              </div>

              {recommendations.map((r, i) => (
                <RecoCard key={i} r={r} index={i} isPaid={isPaid} onCheckout={handleCheckout} />
              ))}

              {!isPaid && (
                <div style={{ marginTop: 16, background: '#1A1916', borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, boxShadow: '0 8px 32px rgba(26,25,22,0.12)' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(217,119,87,0.15)', border: '1px solid rgba(217,119,87,0.25)', borderRadius: 6, padding: '3px 9px', marginBottom: 10 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#D97757', letterSpacing: 1 }}>🎉 Offre de lancement</span>
                    </div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F7F5F2', marginBottom: 6 }}>Rapport complet disponible</div>
                    <div style={{ fontSize: 13, color: 'rgba(247,245,242,0.45)', fontFamily: 'system-ui', lineHeight: 1.6 }}>{recommendations.length - 1} recommandations expertes avec méthodes, exemples et impact attendu.</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <button onClick={handleCheckout} disabled={checkoutLoading} style={{ background: '#D97757', color: '#fff', padding: '14px 32px', borderRadius: 10, fontWeight: 600, fontSize: 14, border: 'none', cursor: checkoutLoading ? 'wait' : 'pointer', whiteSpace: 'nowrap', fontFamily: 'system-ui', opacity: checkoutLoading ? 0.7 : 1 }}>{checkoutLoading ? 'Chargement...' : 'Débloquer — 19,99€ →'}</button>
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(247,245,242,0.35)' }}>
                      au lieu de <span style={{ textDecoration: 'line-through' }}>59,99€</span> · jusqu'au 15 avril
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes tooltipIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}