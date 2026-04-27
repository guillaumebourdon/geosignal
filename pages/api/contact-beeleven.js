import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { randomUUID } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const { checkRateLimit } = require('../../lib/rateLimit');
  if (!(await checkRateLimit('contactBeeleven', req, res))) return;

  const { firstName, lastName, email, company, website, message, pageUrl, locale } = req.body || {};

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (firstName.length > 200 || lastName.length > 200 || (company && company.length > 200) || message.length > 2000) {
    return res.status(400).json({ error: 'Input too long' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  const isFr = locale !== 'en';
  const safeMsg = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeFirst = firstName.replace(/</g, '&lt;');

  // 1. Store lead in Redis
  try {
    const id = randomUUID();
    await redis.set(`contact:request:${id}`, {
      firstName, lastName, email, company: company || null, website: website || null,
      message, pageUrl: pageUrl || null, locale: locale || 'fr',
      createdAt: new Date().toISOString(),
    }, { ex: 90 * 24 * 60 * 60 }); // 90 days
  } catch (e) {
    console.error('[contact-beeleven] Redis store error:', e.message);
    // Continue — don't block on Redis failure
  }

  // 2. Send email to Guillaume
  try {
    await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: 'guillaume@beeleven.fr',
      replyTo: email,
      subject: `🔔 Nouvelle demande d'accompagnement — ${firstName} ${lastName}${company ? ` (${company})` : ''}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
          <div style="font-size:11px;color:#6B6762;letter-spacing:2px;text-transform:uppercase;margin-bottom:20px;">Demande d'accompagnement</div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;color:#6B6762;font-size:13px;width:120px;">Nom</td><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;font-size:14px;font-weight:600;color:#1A1916;">${safeFirst} ${lastName.replace(/</g, '&lt;')}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;color:#6B6762;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;font-size:14px;color:#1A1916;"><a href="mailto:${email}" style="color:#D97757;">${email}</a></td></tr>
            ${company ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;color:#6B6762;font-size:13px;">Entreprise</td><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;font-size:14px;color:#1A1916;">${company.replace(/</g, '&lt;')}</td></tr>` : ''}
            ${website ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;color:#6B6762;font-size:13px;">Site web</td><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;font-size:14px;color:#1A1916;">${website}</td></tr>` : ''}
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;color:#6B6762;font-size:13px;">Source</td><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;font-size:13px;color:#6B6762;">${pageUrl || 'N/A'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;color:#6B6762;font-size:13px;">Date</td><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;font-size:13px;color:#6B6762;">${date}</td></tr>
          </table>
          <div style="background:#F7F5F2;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
            <div style="font-size:11px;color:#6B6762;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Message</div>
            <div style="font-size:14px;color:#1A1916;line-height:1.65;white-space:pre-wrap;">${safeMsg}</div>
          </div>
          <div style="font-size:11px;color:#B0ABA5;">Répondre directement à cet email pour contacter ${safeFirst}.</div>
        </div>
      `,
    });
  } catch (e) {
    console.error('[contact-beeleven] Guillaume email error:', e.message);
  }

  // 3. Send auto-reply to visitor
  try {
    await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: email,
      subject: isFr ? 'Votre demande d\'accompagnement — Detekia' : 'Your support request — Detekia',
      html: isFr
        ? `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;">
            <div style="font-family:Georgia,serif;font-size:22px;color:#1A1916;margin-bottom:16px;">Detekia</div>
            <p style="font-size:15px;color:#1A1916;line-height:1.7;">Bonjour ${safeFirst},</p>
            <p style="font-size:15px;color:#1A1916;line-height:1.7;">Merci pour votre demande d'accompagnement. Nous l'avons bien reçue et nous revenons vers vous <strong>sous 24 heures ouvrées</strong>.</p>
            <div style="background:#F7F5F2;border-radius:10px;padding:16px 20px;margin:20px 0;">
              <div style="font-size:11px;color:#6B6762;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Votre message</div>
              <div style="font-size:13px;color:#3A3835;line-height:1.6;white-space:pre-wrap;">${safeMsg}</div>
            </div>
            <p style="font-size:13px;color:#6B6762;line-height:1.6;">À très bientôt,</p>
            <p style="font-size:13px;color:#1A1916;font-weight:600;">Guillaume Bourdon</p>
            <p style="font-size:12px;color:#6B6762;">Fondateur, Detekia · hello@detekia.fr</p>
          </div>`
        : `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;">
            <div style="font-family:Georgia,serif;font-size:22px;color:#1A1916;margin-bottom:16px;">Detekia</div>
            <p style="font-size:15px;color:#1A1916;line-height:1.7;">Hi ${safeFirst},</p>
            <p style="font-size:15px;color:#1A1916;line-height:1.7;">Thank you for your support request. We've received it and will get back to you <strong>within 24 business hours</strong>.</p>
            <div style="background:#F7F5F2;border-radius:10px;padding:16px 20px;margin:20px 0;">
              <div style="font-size:11px;color:#6B6762;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Your message</div>
              <div style="font-size:13px;color:#3A3835;line-height:1.6;white-space:pre-wrap;">${safeMsg}</div>
            </div>
            <p style="font-size:13px;color:#6B6762;line-height:1.6;">Talk soon,</p>
            <p style="font-size:13px;color:#1A1916;font-weight:600;">Guillaume Bourdon</p>
            <p style="font-size:12px;color:#6B6762;">Founder, Detekia · hello@detekia.fr</p>
          </div>`,
    });
  } catch (e) {
    console.error('[contact-beeleven] Auto-reply error:', e.message);
  }

  return res.status(200).json({ success: true });
}
