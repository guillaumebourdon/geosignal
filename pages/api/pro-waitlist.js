import { Resend } from 'resend';
import { checkRateLimit } from '../../lib/rateLimit';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const allowed = await checkRateLimit('proWaitlist', req, res);
  if (!allowed) return;

  const { email, locale } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const audienceId = process.env.RESEND_SEGMENT_PRO_WAITLIST;
  if (!audienceId) {
    console.error('[pro-waitlist] RESEND_SEGMENT_PRO_WAITLIST not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Add contact to Resend audience/segment (audience_id works for backwards compat)
    await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId,
    });
    console.log('[pro-waitlist] Contact added to segment');

    // Notification to Guillaume (non-blocking)
    try {
      const now = new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
      await resend.emails.send({
        from: 'Detekia <hello@detekia.fr>',
        to: 'guillaume@beeleven.fr',
        subject: '\u{1F3AF} Nouvelle inscription Detekia Pro waitlist',
        html: `<div style="font-family:system-ui;max-width:480px;margin:0 auto;padding:24px;">
          <div style="font-family:Georgia,serif;font-size:18px;color:#1A1916;margin-bottom:16px;">\u{1F3AF} Nouvelle inscription Pro waitlist</div>
          <div style="background:#F7F5F2;border-radius:8px;padding:16px 20px;">
            <div style="margin-bottom:6px;"><strong>Email :</strong> ${email}</div>
            <div style="margin-bottom:6px;"><strong>Locale :</strong> ${(locale || 'fr').toUpperCase()}</div>
            <div><strong>Date :</strong> ${now}</div>
          </div>
        </div>`,
      });
      console.log('[pro-waitlist] Notification sent to Guillaume');
    } catch (notifErr) {
      console.error('[pro-waitlist] Notification email failed:', notifErr.message);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    // Handle duplicate contact gracefully
    if (err.message && err.message.includes('already exists')) {
      console.log('[pro-waitlist] Contact already exists, treating as success');
      return res.status(200).json({ success: true });
    }
    console.error('[pro-waitlist] Error:', err.message);
    return res.status(500).json({ error: 'Failed to add to waitlist' });
  }
}
