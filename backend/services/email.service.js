const nodemailer = require('nodemailer');

const CONTACT_INBOX = process.env.SMTP_USER || 'sokkhim519@gmail.com';

function getTransporter() {
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 7000,
  });
}

async function sendContactEmail({ name, email, subject, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject || 'General question');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  await getTransporter().sendMail({
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

async function sendPasswordResetOtpEmail({ to, fullName, otpCode, expiresMinutes = 10, ip = '' }) {
  const safeName = escapeHtml(fullName || 'Valued User');
  const safeOtp = escapeHtml(otpCode);
  const safeIp = escapeHtml(ip || 'Unknown');

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Email] Warning: SMTP credentials (SMTP_USER / SMTP_PASS) not set in .env. Email cannot be delivered to inbox.');
    return { success: false, reason: 'NO_SMTP_CREDENTIALS' };
  }

  try {
    const timestamp = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Phnom_Penh',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    await Promise.race([
      getTransporter().sendMail({
        from: `"CQ-Professional Security" <${process.env.SMTP_USER}>`,
        to,
        subject: `[CQ-Professional] ${otpCode} is your verification code`,
        text: `Hello ${fullName},\n\nYour 6-digit verification code to reset your CQ-Professional password is: ${otpCode}\n\nThis code will expire in ${expiresMinutes} minutes.\nRequested at: ${timestamp} (Cambodia)\nIP: ${safeIp}\n\nIf you did not request this, your account is safe and no action is required.\n\nBest regards,\nCQ-Professional Security Team`,
        html: `
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Verification Code</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#1e293b;-webkit-font-smoothing:antialiased;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:40px 12px;">
            <tr>
              <td align="center">
                <!-- Main Container -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 12px 35px -8px rgba(15,23,42,0.1),0 0 0 1px #e2e8f0;">
                  
                  <!-- CLEAN HEADER -->
                  <tr>
                    <td style="padding:32px 36px 28px;background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 65%,#2563eb 100%);color:#ffffff;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);text-align:center;vertical-align:middle;color:#ffffff;font-size:16px;font-weight:900;letter-spacing:-0.5px;">CQ</td>
                                <td style="padding-left:12px;">
                                  <div style="font-size:16px;font-weight:800;letter-spacing:-0.3px;">CQ-Professional</div>
                                  <div style="font-size:11px;color:rgba(255,255,255,0.75);font-weight:500;">Security & Identity Verification</div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- BODY CONTENT -->
                  <tr>
                    <td style="padding:36px 36px 28px;">
                      <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.4px;">
                        Password Reset Verification
                      </h1>
                      <p style="margin:0 0 24px;font-size:14px;line-height:1.65;color:#475569;">
                        Hello <strong>${safeName}</strong>,<br/>
                        We received a request to verify your identity and reset your account password. Enter the one-time verification code below on the screen to proceed:
                      </p>

                      <!-- HIGH-SECURITY OTP BADGE BOX -->
                      <div style="background:linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%);border:2px dashed #cbd5e1;border-radius:18px;padding:26px 20px;text-align:center;margin:24px 0 28px;">
                        <div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#64748b;margin-bottom:8px;">
                          One-Time Password (OTP)
                        </div>
                        <div style="font-family:'SF Pro Text',Consolas,Monaco,monospace;font-size:42px;font-weight:900;letter-spacing:10px;color:#1e3a8a;line-height:1.1;padding-left:10px;">
                          ${safeOtp}
                        </div>
                        <div style="margin-top:12px;display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#fee2e2;border-radius:999px;font-size:11px;font-weight:700;color:#b91c1c;">
                          ⏱ Expires in ${expiresMinutes} minutes • Single-use only
                        </div>
                      </div>

                      <!-- SECURITY DETAILS TABLE -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;margin-bottom:24px;">
                        <tr>
                          <td style="padding:14px 18px;font-size:12px;color:#64748b;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding:3px 0;"><strong>Destination:</strong> ${to}</td>
                                <td align="right" style="padding:3px 0;"><strong>Channel:</strong> Email OTP</td>
                              </tr>
                              <tr>
                                <td style="padding:3px 0;"><strong>Time:</strong> ${timestamp}</td>
                                <td align="right" style="padding:3px 0;"><strong>Location:</strong> Cambodia (UTC+7)</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- WARNING NOTE -->
                      <div style="padding:14px 16px;background:#fef2f2;border-left:4px solid #ef4444;border-radius:0 10px 10px 0;font-size:12px;line-height:1.6;color:#991b1b;">
                        <strong>Did not request this code?</strong> If you did not make this request, someone may have entered your email by mistake. Your account remains safe, and you can safely ignore this email.
                      </div>
                    </td>
                  </tr>

                  <!-- CLEAN PROFESSIONAL FOOTER -->
                  <tr>
                    <td style="padding:24px 36px 28px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
                      <div style="font-size:12px;font-weight:700;color:#334155;margin-bottom:6px;">
                        CQ-Professional Resume & CV Builder
                      </div>
                      <div style="font-size:11px;line-height:1.6;color:#94a3b8;margin-bottom:12px;">
                        Phnom Penh, Kingdom of Cambodia • Powered by Automated Identity Guard<br/>
                        Need support? Contact us on Telegram: <a href="https://t.me/cqprofessionalpayment_bot" style="color:#2563eb;text-decoration:none;font-weight:600;">@cqprofessionalpayment_bot</a>
                      </div>
                      <div style="font-size:10px;color:#cbd5e1;text-transform:uppercase;letter-spacing:0.5px;">
                        © ${new Date().getFullYear()} CQ-Professional. All rights reserved.
                      </div>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP timeout: network took longer than 6 seconds')), 6000))
    ]);
    console.log(`[Email] ✓ Reset OTP email successfully dispatched to ${to}`);
    return { success: true };
  } catch (err) {
    console.error('[Email] Failed to send password reset email:', err.message);
    return { success: false, error: err.message };
  }
}

function escapeHtml(str = '') {
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

module.exports = { sendContactEmail, sendPasswordResetOtpEmail };
