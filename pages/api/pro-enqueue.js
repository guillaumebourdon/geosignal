import { Redis } from '@upstash/redis';
import { createSiteAuditJob } from '../../lib/proQueue';

export const config = { maxDuration: 60 };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const JOB_PREFIX = 'detekia:pro:v1:job';
const JOB_TTL = 24 * 60 * 60; // 24h — pages must survive until consolidation + finalize

export default async function handler(req, res) {
  const { checkRateLimit } = require('../../lib/rateLimit');
  if (!(await checkRateLimit('proEnqueue', req, res))) return;
  const rawUrl = req.query.url;
  const locale = req.query.locale === 'en' ? 'en' : 'fr';
  const customerEmail = req.query.email || 'guillaume@beeleven.fr';
  if (!rawUrl) return res.status(400).json({ error: 'Missing ?url= parameter' });

  let url;
  try {
    url = rawUrl.startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`;
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Accept optional pages parameter (JSON stringified array or query param)
  let customerPages;
  if (req.query.pages) {
    try { customerPages = JSON.parse(req.query.pages); } catch { customerPages = undefined; }
  }

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['host'] || 'localhost:3000';
  const baseUrl = `${proto}://${host}`;

  try {
    const result = await createSiteAuditJob(url, { baseUrl, locale, pages: customerPages });

    // Store job metadata in Redis
    try {
      await redis.set(`${JOB_PREFIX}:${result.siteJobId}:total`, result.queuedCount, { ex: JOB_TTL });
      await redis.set(`${JOB_PREFIX}:${result.siteJobId}:meta`, {
        rootUrl: url,
        locale,
        customerEmail,
        source: result.source,
        queuedAt: new Date().toISOString(),
        urls: result.urls,
      }, { ex: JOB_TTL });
    } catch (err) {
      console.error('[pro-enqueue] Redis metadata write error:', err.message);
    }

    // SAFEGUARD: alert if page count is critically low (< 5 pages for a Pro audit)
    if (result.queuedCount < 5) {
      console.warn(`[pro-enqueue] ⚠️ DEGRADED: only ${result.queuedCount} pages found for ${url}`);
      try {
        const { Resend } = require('resend');
        const alertResend = new Resend(process.env.RESEND_API_KEY);
        await alertResend.emails.send({
          from: 'Detekia <hello@detekia.fr>',
          to: 'guillaume@beeleven.fr',
          subject: `⚠️ ALERTE Pro audit dégradé — ${result.queuedCount} pages — ${url}`,
          html: `<div style="font-family:system-ui;padding:24px;">
            <h2 style="color:#D97757;">Audit Pro dégradé</h2>
            <p><strong>Site :</strong> ${url}</p>
            <p><strong>Pages trouvées :</strong> ${result.queuedCount} (attendu : ~10)</p>
            <p><strong>Email client :</strong> ${customerEmail}</p>
            <p><strong>Job ID :</strong> ${result.siteJobId}</p>
            <p style="color:#D97757;font-weight:bold;">Sitemap probablement inaccessible (anti-bot). Vérifier et re-lancer si nécessaire.</p>
          </div>`,
        });
      } catch (_) {}
    }

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('[pro-enqueue] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
