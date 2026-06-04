import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ADMIN_SECRET = process.env.PRO_ADMIN_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const secret = req.headers.authorization?.replace('Bearer ', '');
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { uuid } = req.query;
  if (!uuid) return res.status(400).json({ error: 'Missing uuid parameter' });

  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidV4Regex.test(uuid)) return res.status(400).json({ error: 'Invalid uuid format' });

  try {
    // Fetch report record and customer info in parallel
    const [report, customerRecord] = await Promise.all([
      redis.get(`detekia:report:${uuid}`),
      redis.get(`detekia:report:customer:${uuid}`),
    ]);

    if (!report) return res.status(404).json({ error: 'Report not found' });

    const r = typeof report === 'string' ? JSON.parse(report) : report;
    const c = customerRecord
      ? (typeof customerRecord === 'string' ? JSON.parse(customerRecord) : customerRecord)
      : r.customerInfo || null;

    // Determine report status
    let reportStatus = 'generated';
    if (r.reportType === 'pro' && r.siteJobId) {
      const jobStatus = await redis.get(`detekia:pro:v1:job:${r.siteJobId}:status`);
      reportStatus = jobStatus === 'delivered' ? 'generated' : 'in_progress';
    }

    // Check for validation errors
    const validation = await redis.get(`detekia:validation:${uuid}`);
    if (validation) reportStatus = 'generated_with_warnings';

    const { maskEmail } = require('../../../lib/maskEmail');
    const customerEmail = c?.customerEmail || r.email || null;

    // Log with masked email
    console.log(`[admin/report-info] Lookup for ${uuid} — email: ${maskEmail(customerEmail)}`);

    return res.status(200).json({
      uuid,
      siteUrl: r.url || c?.siteUrl || null,
      customerEmail,
      customerName: c?.customerName || null,
      customerCountry: c?.customerCountry || null,
      customerStripeId: c?.customerStripeId || null,
      purchaseDate: c?.purchaseDate || r.createdAt || null,
      plan: r.reportType === 'pro' ? 'pro' : 'onepage',
      amount: c?.amount || null,
      couponUsed: c?.couponUsed || null,
      locale: r.locale || c?.locale || 'fr',
      reportStatus,
      reportUrl: c?.reportUrl || null,
      createdAt: r.createdAt || null,
      stripeSessionId: c?.stripeSessionId || null,
      siteJobId: r.siteJobId || null,
      score: r.reportType === 'pro'
        ? r.consolidatedReport?.scoreAverage || null
        : r.reportData?.score || null,
    });
  } catch (e) {
    console.error('[admin/report-info] Error:', e.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
