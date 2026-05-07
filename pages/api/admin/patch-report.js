import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ADMIN_SECRET = process.env.PRO_ADMIN_SECRET;

// Fake competitor detection
const FAKE_PATTERN = /^(le |la |les |l'|un |une |des |du |de |en |au |the |a |an |for |with )/i;
const FAKE_WORDS = new Set(['conclusion', 'consultez', 'contactez', 'appelez', 'expliquez', 'demandez',
  'renseignez', 'comparez', 'utilisez', 'choisissez', 'optez', 'inscrivez', 'recherche',
  'certaines', 'plusieurs', 'notamment', 'activit', 'randonn', 'flexibilit', 'natation',
  'nouveau prestataire', 'ancien prestataire', 'parties prenantes', 'ressources humaines',
  'calcul automatique', 'titres restaurant', 'appels api', 'petit', 'habituellement',
  'pension', 'demi', 'destinations', 'stations', 'clubs', 'villages', 'cours',
  'planification', 'services', 'type', 'localisation', 'prix']);
const VERB_ENDING = /(?:ez|er|ir|re|ons|ées|ant|ent|ment|tion|ité)$/i;

function isRealCompetitor(name) {
  if (!name || name.length < 3) return false;
  const lower = name.toLowerCase().trim();
  if (FAKE_WORDS.has(lower)) return false;
  if (FAKE_PATTERN.test(name)) return false;
  // Single capitalized word ending like a verb/noun
  if (/^[A-Z][a-zéèêë]+$/.test(name) && VERB_ENDING.test(name)) return false;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const secret = req.headers.authorization?.replace('Bearer ', '');
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { uuid, action } = req.body;
  if (!uuid) return res.status(400).json({ error: 'Missing uuid' });

  const key = `detekia:report:${uuid}`;
  const raw = await redis.get(key);
  if (!raw) return res.status(404).json({ error: 'Report not found' });
  const report = typeof raw === 'string' ? JSON.parse(raw) : raw;

  if (action === 'debug-structure') {
    const keys = Object.keys(report);
    const crKeys = report.consolidatedReport ? Object.keys(report.consolidatedReport) : [];
    const ctKeys = report.consolidatedReport?.citationTestConsolidated ? Object.keys(report.consolidatedReport.citationTestConsolidated) : [];
    const q0 = report.consolidatedReport?.citationTestConsolidated?.queries?.[0];
    return res.json({ topKeys: keys, consolidatedKeys: crKeys, ctKeys, firstQuery: q0 ? Object.keys(q0) : [], firstQuerySample: q0 || null });
  }

  if (action === 'clean-competitors') {
    let cleaned = 0;
    const hostname = (report.url || '').replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    // Clean consolidated citation test
    const ct = report.consolidatedReport?.citationTestConsolidated;
    if (ct?.queries) {
      for (const q of ct.queries) {
        const field = q.competitorsCited || q.competitors_cited || [];
        const before = field.length;
        const after = field.filter(c => isRealCompetitor(c) && !c.toLowerCase().includes(hostname));
        if (q.competitorsCited) q.competitorsCited = after;
        if (q.competitors_cited) q.competitors_cited = after;
        cleaned += before - after.length;
      }
      // Clean mainBlocker
      if (ct.mainBlocker && !isRealCompetitor(ct.mainBlocker)) {
        ct.mainBlocker = '';
        cleaned++;
      }
    }

    // Clean per-page citation tests
    if (report.consolidatedReport?.pages) {
      for (const page of report.consolidatedReport.pages) {
        const tests = page.citationTest?.tests || [];
        for (const t of tests) {
          const field = t.competitors_cited || [];
          const before = field.length;
          t.competitors_cited = field.filter(c => isRealCompetitor(c) && !c.toLowerCase().includes(hostname));
          cleaned += before - t.competitors_cited.length;
        }
      }
    }

    // Save back
    await redis.set(key, report, { ex: 10 * 365 * 24 * 60 * 60 });
    return res.json({ success: true, cleaned, uuid });
  }

  return res.status(400).json({ error: 'Unknown action' });
}
