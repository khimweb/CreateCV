const nodemailer = require('nodemailer');

const CONTACT_INBOX = 'sokkhim519@gmail.com';
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendContactEmail({ name, email, subject, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject || 'General question');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  await transporter.sendMail({
    from: `"CQ-Professional Contact" <${process.env.SMTP_USER}>`,
    to: CONTACT_INBOX,
    replyTo: email,
    subject: subject ? `[CQ-Professional] ${subject}` : `[CQ-Professional] New inquiry from ${name}`,
    text: `CQ-Professional | Creative CV Builder\n\nFrom: ${name} <${email}>\nTopic: ${subject || 'General question'}\n\n${message}`,
    html: buildContactEmailHtml({ safeName, safeEmail, safeSubject, safeMessage }),
  });
}

function buildContactEmailHtml({ safeName, safeEmail, safeSubject, safeMessage }) {
  return `<!doctype html>
<html lang="en"><body style="margin:0;padding:0;background:#f4f5fb;font-family:Arial,Helvetica,sans-serif;color:#26324a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding:28px 12px;background:#f4f5fb;"><tr><td align="center">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border:1px solid #e1e5f0;border-radius:20px;overflow:hidden;">
      <tr><td style="padding:26px 30px;background:linear-gradient(135deg,#273f91,#684bd5);color:#ffffff;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="width:44px;height:44px;border-radius:13px;background:#ffffff;text-align:center;vertical-align:middle;color:#284a9d;font-size:17px;font-weight:800;letter-spacing:-1px;">CQ</td><td style="padding-left:12px;"><div style="font-size:17px;font-weight:800;line-height:1.2;">CQ-Professional</div><div style="padding-top:3px;color:#e2e8ff;font-size:11px;font-weight:600;">Creative CV Builder</div></td></tr></table>
      </td></tr>
      <tr><td style="padding:30px;"><p style="margin:0 0 7px;color:#6551c8;font-size:11px;font-weight:800;letter-spacing:1.4px;">NEW CONTACT MESSAGE</p><h1 style="margin:0 0 20px;color:#24304b;font-size:25px;line-height:1.25;">Someone needs your help.</h1>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:22px;background:#f8f8fd;border:1px solid #e7e8f3;border-radius:13px;"><tr><td style="padding:16px 18px;"><div style="padding-bottom:10px;"><span style="display:block;color:#818aa0;font-size:10px;font-weight:800;letter-spacing:1px;">FROM</span><a href="mailto:${safeEmail}" style="color:#4939ab;font-size:14px;font-weight:700;text-decoration:none;">${safeName} &lt;${safeEmail}&gt;</a></div><div><span style="display:block;color:#818aa0;font-size:10px;font-weight:800;letter-spacing:1px;">TOPIC</span><span style="color:#35405a;font-size:14px;font-weight:700;">${safeSubject}</span></div></td></tr></table>
        <p style="margin:0 0 8px;color:#818aa0;font-size:10px;font-weight:800;letter-spacing:1px;">MESSAGE</p><div style="padding:18px;border-left:4px solid #725ae0;background:#f9f8ff;border-radius:0 12px 12px 0;color:#3e4962;font-size:14px;line-height:1.7;">${safeMessage}</div>
        <p style="margin:25px 0 0;color:#7d869a;font-size:12px;line-height:1.6;">Reply directly to this email to respond to the sender.</p>
      </td></tr>
      <tr><td style="padding:18px 30px;background:#fafbff;border-top:1px solid #eceef5;color:#8a92a3;font-size:11px;line-height:1.55;">Sent from the CQ-Professional website contact form.<br><strong style="color:#59637a;">Helping people create CVs with confidence.</strong></td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function escapeHtml(str = '') {
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

module.exports = { sendContactEmail };
