/**
 * Automatic Stripe refund + customer/admin email notifications.
 * Triggered when the system cannot deliver a paid audit report.
 */

const Stripe = require('stripe').default;
const { Resend } = require('resend');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Refund a Stripe payment and notify both customer and Guillaume.
 * @param {object} opts
 * @param {string} opts.paymentIntentId - Stripe payment intent ID
 * @param {string} opts.customerEmail - Customer email
 * @param {string} opts.url - URL being audited
 * @param {string} opts.plan - 'rapport' or 'pro'
 * @param {string} opts.reason - Technical reason for failure
 * @param {string} opts.locale - 'fr' or 'en'
 * @returns {{ refunded: boolean, refundId?: string, error?: string }}
 */
async function triggerAutoRefund({ paymentIntentId, customerEmail, url, plan, reason, locale = 'fr' }) {
  const amount = plan === 'pro' ? '99 €' : '29 €';
  const isFr = locale !== 'en';

  // 1. Stripe refund
  let refundId = null;
  try {
    if (paymentIntentId) {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        reason: 'requested_by_customer',
      });
      refundId = refund.id;
      console.log(`[autoRefund] Refund ${refundId} created for ${paymentIntentId}`);
    }
  } catch (e) {
    console.error('[autoRefund] Stripe refund failed:', e.message);
    // Continue to send alerts even if refund fails
  }

  // 2. Customer email
  try {
    const subject = isFr
      ? `Detekia — Votre audit n'a pas pu être réalisé`
      : `Detekia — Your audit could not be completed`;

    const body = isFr
      ? `<div style="font-family:system-ui;max-width:520px;margin:0 auto;padding:24px;">
          <div style="font-family:Georgia,serif;font-size:22px;color:#1A1916;margin-bottom:16px;">Detekia</div>
          <p style="font-size:15px;color:#1A1916;line-height:1.7;">Bonjour,</p>
          <p style="font-size:15px;color:#1A1916;line-height:1.7;">Nous n'avons pas pu réaliser votre audit GEO sur <strong>${url}</strong> dans les conditions promises.</p>
          <p style="font-size:15px;color:#1A1916;line-height:1.7;">${refundId ? `Vous avez été remboursé automatiquement (<strong>${amount}</strong> sur votre carte). Le remboursement apparaîtra sous 5 à 10 jours ouvrés.` : `Un remboursement est en cours de traitement.`}</p>
          <p style="font-size:15px;color:#1A1916;line-height:1.7;">Toute notre équipe vous présente ses excuses pour ce désagrément.</p>
          <p style="font-size:15px;color:#1A1916;line-height:1.7;">Si vous avez des questions, n'hésitez pas à nous contacter à <a href="mailto:hello@detekia.fr" style="color:#D97757;">hello@detekia.fr</a>.</p>
          <p style="font-size:13px;color:#8A8680;margin-top:24px;">L'équipe Detekia</p>
        </div>`
      : `<div style="font-family:system-ui;max-width:520px;margin:0 auto;padding:24px;">
          <div style="font-family:Georgia,serif;font-size:22px;color:#1A1916;margin-bottom:16px;">Detekia</div>
          <p style="font-size:15px;color:#1A1916;line-height:1.7;">Hello,</p>
          <p style="font-size:15px;color:#1A1916;line-height:1.7;">We were unable to complete your GEO audit on <strong>${url}</strong> as promised.</p>
          <p style="font-size:15px;color:#1A1916;line-height:1.7;">${refundId ? `You have been automatically refunded (<strong>${amount}</strong> to your card). The refund will appear within 5-10 business days.` : `A refund is being processed.`}</p>
          <p style="font-size:15px;color:#1A1916;line-height:1.7;">We sincerely apologize for the inconvenience.</p>
          <p style="font-size:15px;color:#1A1916;line-height:1.7;">If you have any questions, please contact us at <a href="mailto:hello@detekia.fr" style="color:#D97757;">hello@detekia.fr</a>.</p>
          <p style="font-size:13px;color:#8A8680;margin-top:24px;">The Detekia Team</p>
        </div>`;

    if (customerEmail) {
      await resend.emails.send({
        from: 'Detekia <hello@detekia.fr>',
        to: customerEmail,
        bcc: 'guillaume@beeleven.fr',
        subject,
        html: body,
      });
    }
  } catch (e) {
    console.error('[autoRefund] Customer email failed:', e.message);
  }

  // 3. Guillaume alert
  try {
    await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: 'guillaume@beeleven.fr',
      subject: `🚨 Remboursement automatique déclenché — ${url}`,
      html: `<div style="font-family:system-ui;max-width:520px;padding:24px;">
        <h2 style="color:#D97757;">Remboursement automatique</h2>
        <div style="background:#F7F5F2;border-radius:8px;padding:16px 20px;margin:16px 0;">
          <p><strong>Client :</strong> ${customerEmail || 'N/A'}</p>
          <p><strong>URL :</strong> ${url}</p>
          <p><strong>Plan :</strong> ${plan === 'pro' ? 'Audit complet (99€)' : 'Audit 1 page (29€)'}</p>
          <p><strong>Cause :</strong> ${reason}</p>
          <p><strong>Refund Stripe :</strong> ${refundId || 'ÉCHEC — à traiter manuellement'}</p>
          <p><strong>Heure :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
        <p style="color:#D97757;font-weight:bold;">Action recommandée : contactez le client pour faire un geste commercial.</p>
      </div>`,
    });
  } catch (e) {
    console.error('[autoRefund] Admin alert failed:', e.message);
  }

  return { refunded: !!refundId, refundId, error: refundId ? null : 'refund_failed' };
}

module.exports = { triggerAutoRefund };
