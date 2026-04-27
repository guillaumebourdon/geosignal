import { Resend } from 'resend';
import Stripe from 'stripe';
import { Redis } from '@upstash/redis';
import { randomUUID } from 'crypto';

export const config = { maxDuration: 30 };

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const REPORT_TTL = 10 * 365 * 24 * 60 * 60; // 10 years

// ── Loyalty promo code (same logic as generate-pdf.js) ──────────────────────

const LOYALTY_STRINGS = {
  fr: {
    mentionInBody: "Tu veux analyser une autre URL ? Un code -50% t'attend dans ton rapport.",
    eyebrow: 'Pour votre prochaine analyse',
    title: '50% de reduction',
    body: "Envie d'analyser une autre page ? Utilisez ce code au checkout sur detekia.fr/pricing.",
    footerNote: 'Valable 30 jours · Utilisable une seule fois',
  },
  en: {
    mentionInBody: "Want to analyze another URL? A -50% discount code is waiting in your report.",
    eyebrow: 'For your next analysis',
    title: '50% off',
    body: 'Want to analyze another page? Use this code at checkout on detekia.fr/pricing.',
    footerNote: 'Valid 30 days · Single use',
  },
};

async function generateLoyaltyCode(url, email, locale) {
  const COUPON_ID = process.env.STRIPE_LOYALTY_COUPON_ID;
  if (!COUPON_ID) return null;

  const expiresAt = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
  for (let attempt = 0; attempt < 3; attempt++) {
    const promoCode = `DETK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    try {
      await stripe.promotionCodes.create({
        coupon: COUPON_ID,
        code: promoCode,
        max_redemptions: 1,
        expires_at: expiresAt,
        metadata: { type: 'post_purchase_loyalty', original_url: url || 'unknown', locale: locale || 'fr' },
      });
      return promoCode;
    } catch (err) {
      if (err.code === 'resource_already_exists' && attempt < 2) continue;
      console.error('[finalize-report] Promo code error:', err.message);
      return null;
    }
  }
  return null;
}

// ── Email templates ─────────────────────────────────────────────────────────

function gradeLabel(score, locale) {
  if (locale === 'en') return score >= 70 ? 'GOOD' : score >= 45 ? 'AVERAGE' : 'POOR';
  return score >= 70 ? 'BON' : score >= 45 ? 'MOYEN' : 'FAIBLE';
}

function gradeColor(score) {
  if (score >= 70) return '#10A37F';
  if (score >= 45) return '#C9861A';
  return '#D97757';
}

function buildEmailHTML(reportUrl, url, score, verdict, locale) {
  const color = gradeColor(score);
  const grade = gradeLabel(score, locale);
  const isFr = locale !== 'en';

  const subject = isFr
    ? `Votre audit GEO est pret — ${url}`
    : `Your GEO audit is ready — ${url}`;

  const body = `
    <div style="background:#F7F5F2;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif">
      <div style="max-width:520px;margin:0 auto">
        <div style="text-align:center;margin-bottom:28px">
          <div style="font-family:Georgia,serif;font-size:22px;color:#1A1916;margin-bottom:4px">Detekia</div>
          <div style="font-family:monospace;font-size:10px;color:#6B6762;letter-spacing:2px">${isFr ? 'RAPPORT DE VISIBILITE IA' : 'AI VISIBILITY REPORT'}</div>
        </div>
        <div style="background:#1A1916;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px">
          <div style="font-family:Georgia,serif;font-size:64px;color:#F7F5F2;line-height:1;letter-spacing:-2px">${score}</div>
          <div style="font-family:monospace;font-size:12px;color:rgba(247,245,242,0.4);margin-top:4px">/100 — ${url}</div>
          <div style="display:inline-block;margin-top:12px;background:${color}22;border:1px solid ${color}44;padding:3px 14px;border-radius:20px;font-family:monospace;font-size:10px;letter-spacing:2px;color:${color}">${grade}</div>
        </div>
        <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #E5E2DC;margin-bottom:24px;text-align:center">
          <p style="font-size:15px;color:#1A1916;line-height:1.7;margin:0 0 8px">${isFr ? 'Votre rapport GEO est pret.' : 'Your GEO report is ready.'}</p>
          <p style="font-size:13px;color:#6B6762;line-height:1.6;margin:0 0 24px">${verdict || ''}</p>
          <a href="${reportUrl}" style="display:inline-block;background:#D97757;color:#fff;padding:14px 40px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;font-family:system-ui">${isFr ? 'Voir mon rapport' : 'View my report'} →</a>
          <p style="font-size:11px;color:#B0ABA5;margin-top:16px;line-height:1.5">${isFr ? 'Votre rapport reste accessible indefiniment a cette URL.' : 'Your report is accessible indefinitely at this URL.'}</p>
        </div>
        <div style="background:#F7F5F2;border-radius:10px;padding:20px 24px;margin-bottom:20px;text-align:center">
          <p style="font-size:13px;color:#1A1916;font-weight:600;margin:0 0 6px">${isFr ? 'Envie d\'une vision globale ?' : 'Want the full picture?'}</p>
          <p style="font-size:12px;color:#6B6762;line-height:1.6;margin:0 0 12px">${isFr ? 'L\'audit complet analyse 20 pages de votre site et detecte les patterns que cette analyse page par page ne peut pas voir.' : 'The complete audit analyzes 20 pages of your site and detects patterns that a single-page analysis cannot reveal.'}</p>
          <a href="https://detekia.fr/pricing" style="font-size:12px;color:#D97757;text-decoration:none;font-weight:600">${isFr ? 'En savoir plus →' : 'Learn more →'}</a>
        </div>
        <div style="text-align:center;font-size:12px;color:#6B6762;line-height:1.6;padding-top:8px">
          Beeleven SASU · hello@detekia.fr · detekia.fr
        </div>
      </div>
    </div>`;

  return { subject, body };
}

// ── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { checkRateLimit } = require('../../lib/rateLimit');
  if (!(await checkRateLimit('finalize', req, res))) return;

  const { email, url, reportData, locale: reqLocale, isFreeViaPromo } = req.body;
  const locale = reqLocale === 'en' ? 'en' : 'fr';
  if (!email || !reportData) return res.status(400).json({ error: 'Missing data' });

  const uuid = randomUUID();
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['host'] || 'detekia.fr';
  const reportUrl = `${proto}://${host}/r/${uuid}`;

  try {
    // 1. Store report in Redis (no TTL = permanent)
    const reportRecord = {
      reportType: 'onepage',
      reportData,
      email,
      url,
      locale,
      createdAt: new Date().toISOString(),
      isFreeViaPromo: isFreeViaPromo || false,
    };
    await redis.set(`detekia:report:${uuid}`, reportRecord, { ex: REPORT_TTL });
    console.log(`[finalize-report] Stored report ${uuid} for ${url}`);

    // Increment global audit counter
    try { await redis.incr('detekia:stats:audit-count'); } catch (_) {}

    // Validate report — alert Guillaume if errors detected
    try {
      const { validateReport } = require('../../lib/reportValidator');
      const validation = validateReport(reportData, 'onepage');
      if (!validation.passed || validation.warnings.length > 0) {
        await redis.set(`detekia:validation:${uuid}`, validation, { ex: REPORT_TTL });
        console.log(`[finalize-report] Validation: ${validation.summary}`);
      }
      if (!validation.passed) {
        const hasCriticalError = validation.errors.some(e =>
          e.rule === 'score-out-of-range' || e.rule === 'score-average-mismatch' || e.rule === 'page-count-mismatch'
        );
        if (hasCriticalError) {
          // Critical error → trigger auto-refund instead of delivering
          const { maskEmail: me } = require('../../lib/maskEmail');
          console.error(`[finalize-report] CRITICAL validation error — triggering refund for ${me(email)}`);
          const { triggerAutoRefund } = require('../../lib/autoRefund');
          await triggerAutoRefund({
            paymentIntentId: req.body.paymentIntentId || null,
            customerEmail: email,
            url,
            plan: 'rapport',
            reason: `Validation critique: ${validation.errors.map(e => e.rule).join(', ')}`,
            locale,
          });
          return res.status(200).json({ success: false, refunded: true, reason: 'validation_critical' });
        }
        // Non-critical errors: deliver but alert Guillaume
        reportRecord.validationErrors = validation.errors;
        await resend.emails.send({
          from: 'Detekia <hello@detekia.fr>',
          to: 'guillaume@beeleven.fr',
          subject: `⚠️ Rapport livré avec warnings — ${url} — ${validation.summary}`,
          html: `<div style="font-family:system-ui;padding:24px;">
            <h2 style="color:#D97757;">Rapport avec erreurs de validation (non critiques)</h2>
            <p><strong>URL :</strong> ${url}</p>
            <p><strong>Email client :</strong> ${email}</p>
            <p><strong>Score :</strong> ${reportData.score}/100</p>
            <p><strong>Rapport :</strong> <a href="${reportUrl}">${reportUrl}</a></p>
            <p><strong>Erreurs :</strong></p>
            <ul>${validation.errors.map(e => `<li><strong>${e.rule}</strong>: attendu ${e.expected}, obtenu ${e.actual}</li>`).join('')}</ul>
          </div>`,
        }).catch(() => {});
      }
    } catch (e) { console.error('[finalize-report] Validation error:', e.message); }

    // 2. Generate loyalty code (non-blocking) — disabled via LOYALTY_COUPON_ENABLED
    let loyaltyCode = null;
    if (process.env.LOYALTY_COUPON_ENABLED === 'true') {
      loyaltyCode = await generateLoyaltyCode(url, email, locale).catch(() => null);
      if (loyaltyCode) {
        reportRecord.loyaltyCode = loyaltyCode;
        await redis.set(`detekia:report:${uuid}`, reportRecord, { ex: REPORT_TTL });
      }
    }

    // 3. Send email with link
    const { subject, body } = buildEmailHTML(reportUrl, url, reportData.score, reportData.verdict, locale);

    const { error: emailError } = await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: email,
      subject,
      html: body,
    });

    if (emailError) {
      console.error('[finalize-report] Email error:', emailError);
    }

    // 4. Notify Guillaume
    try {
      const now = new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
      const notifSubject = isFreeViaPromo
        ? `🎁 Test code promo — ${url} — Score ${reportData.score}/100`
        : `✅ Nouvelle vente Detekia — ${url} — Score ${reportData.score}/100`;

      await resend.emails.send({
        from: 'Detekia <hello@detekia.fr>',
        to: 'guillaume@beeleven.fr',
        subject: notifSubject,
        html: `<div style="font-family:system-ui;max-width:480px;margin:0 auto;padding:24px;">
          <div style="font-family:Georgia,serif;font-size:18px;color:#1A1916;margin-bottom:16px;">${notifSubject}</div>
          <div style="background:#F7F5F2;border-radius:8px;padding:16px 20px;">
            <div style="margin-bottom:6px;"><strong>Site :</strong> ${url}</div>
            <div style="margin-bottom:6px;"><strong>Score :</strong> ${reportData.score}/100</div>
            <div style="margin-bottom:6px;"><strong>Email :</strong> ${email}</div>
            <div style="margin-bottom:6px;"><strong>Rapport :</strong> <a href="${reportUrl}">${reportUrl}</a></div>
            <div style="margin-bottom:6px;"><strong>Promo :</strong> ${loyaltyCode || 'N/A'}</div>
            <div><strong>Date :</strong> ${now}</div>
          </div>
        </div>`,
      });
    } catch (_) {}

    return res.status(200).json({ success: true, uuid, reportUrl });

  } catch (e) {
    console.error('[finalize-report] Error:', e.message);

    // Error notification
    try {
      await resend.emails.send({
        from: 'Detekia <hello@detekia.fr>',
        to: 'guillaume@beeleven.fr',
        subject: `⚠️ Erreur finalize-report — ${url || 'N/A'}`,
        html: `<p><strong>Email:</strong> ${email}</p><p><strong>URL:</strong> ${url}</p><p><strong>Erreur:</strong> ${e.message}</p>`,
      });
    } catch (_) {}

    return res.status(500).json({ error: e.message });
  }
}
