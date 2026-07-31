const nodemailer = require('nodemailer');

const CONTACT_INBOX = 'sokkhim519@gmail.com';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendContactEmail({ name, email, subject, message }) {
  await transporter.sendMail({
    from: `"CV Creator Contact Form" <${process.env.SMTP_USER}>`,
    to: CONTACT_INBOX,
    replyTo: email,
    subject: subject ? `[CV Creator] ${subject}` : `[CV Creator] New inquiry from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
  });
}

function escapeHtml(str = '') {
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

module.exports = { sendContactEmail };
