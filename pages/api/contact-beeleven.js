import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const maxDuration = 30;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { firstName, lastName, email, website, message, pageUrl } = req.body || {};

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

  try {
    await resend.emails.send({
      from: 'Detekia <hello@detekia.fr>',
      to: 'guillaume@beeleven.fr',
      replyTo: email,
      subject: `[Detekia → Beeleven] Nouveau lead : ${firstName} ${lastName} — ${website || 'N/A'}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
          <div style="font-size:11px;color:#8A8680;letter-spacing:2px;text-transform:uppercase;margin-bottom:20px;">Nouveau lead Beeleven via Detekia</div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;color:#8A8680;font-size:13px;width:120px;">Nom</td><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;font-size:14px;font-weight:600;color:#1A1916;">${firstName} ${lastName}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;color:#8A8680;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;font-size:14px;color:#1A1916;"><a href="mailto:${email}" style="color:#D97757;">${email}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;color:#8A8680;font-size:13px;">Site web</td><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;font-size:14px;color:#1A1916;">${website || 'Non renseign\u00e9'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;color:#8A8680;font-size:13px;">Page source</td><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;font-size:13px;color:#8A8680;">${pageUrl || 'N/A'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;color:#8A8680;font-size:13px;">Date</td><td style="padding:10px 0;border-bottom:1px solid #F0EDE8;font-size:13px;color:#8A8680;">${date}</td></tr>
          </table>
          ${message ? `<div style="background:#F7F5F2;border-radius:10px;padding:16px 20px;margin-bottom:24px;"><div style="font-size:11px;color:#8A8680;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Message</div><div style="font-size:14px;color:#1A1916;line-height:1.65;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div></div>` : ''}
          <div style="font-size:11px;color:#B0ABA5;margin-top:32px;">Email envoy\u00e9 automatiquement par Detekia</div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Beeleven contact email error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
