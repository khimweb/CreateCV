const https = require('https');

const PAYMENT_BOT_TOKEN = process.env.TELEGRAM_PAYMENT_BOT_TOKEN || '8680766494:AAGKczpTwetATH49c22tym3N5S_7ZOaOiFU';
const LOGIN_BOT_TOKEN = process.env.TELEGRAM_LOGIN_BOT_TOKEN || '8731061640:AAHMysl4y7F_lWAQ93Mh-n6c6pHPjqgU6lw';
const TICKET_BOT_TOKEN = process.env.TELEGRAM_TICKET_BOT_TOKEN || '8883203301:AAFkzpOBvNW6Cpk9yRp5BZiAJpmxpu_ju0Q';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '1294502034';


function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Send an HTML-formatted message via Telegram Bot API with automatic plain-text fallback
 */
function sendTelegramMessage(botToken, chatId, text, parseMode = 'HTML') {
  return new Promise((resolve) => {
    try {
      const payloadObj = {
        chat_id: chatId,
        text: text,
        disable_web_page_preview: true,
      };
      if (parseMode) {
        payloadObj.parse_mode = parseMode;
      }
      const payload = JSON.stringify(payloadObj);

      const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${botToken}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 8000,
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (!parsed.ok) {
              console.warn('[Telegram] API responded with non-ok:', parsed.description);
              // If HTML parsing failed, retry once without HTML parse_mode
              if (parseMode === 'HTML' && /can't parse entities|unsupported start tag/i.test(parsed.description || '')) {
                console.log('[Telegram] Retrying without HTML formatting...');
                const plainText = text.replace(/<[^>]+>/g, '');
                return resolve(sendTelegramMessage(botToken, chatId, plainText, null));
              }
            }
            resolve(parsed);
          } catch {
            resolve({ ok: res.statusCode === 200 });
          }
        });
      });

      req.on('error', (err) => {
        console.warn('[Telegram] Request error:', err.message);
        resolve({ ok: false, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, error: 'TIMEOUT' });
      });

      req.write(payload);
      req.end();
    } catch (e) {
      console.warn('[Telegram] Unexpected error:', e.message);
      resolve({ ok: false, error: e.message });
    }
  });
}

/**
 * Format local Cambodian / Phnom Penh timestamp (UTC+7)
 */
function getTimestamp() {
  const d = new Date();
  return d.toLocaleString('en-GB', {
    timeZone: 'Asia/Phnom_Penh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Send notification for Auth events: Login, Register, Logout
 */
async function sendAuthNotification({ event, status, fullName, email, role, reason, ip }) {
  const isSuccess = status === 'SUCCESS';
  const icon = isSuccess ? '✅' : '❌';
  const eventName = event || 'User Auth';

  const text = `
<b>🔐 CQ-Professional Auth Alert</b>
━━━━━━━━━━━━━━━━━━━━━━
📌 <b>Event:</b> ${eventName}
${icon} <b>Status:</b> ${status}
👤 <b>Name:</b> ${fullName || 'Unknown'}
📧 <b>Email:</b> ${email || 'N/A'}
🏷️ <b>Role:</b> <code>${role || 'user'}</code>
${ip ? `🌐 <b>IP / Client:</b> <code>${ip}</code>\n` : ''}${reason ? `⚠️ <b>Reason:</b> ${reason}\n` : ''}🕒 <b>Time:</b> ${getTimestamp()} (Cambodia)
━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  return sendTelegramMessage(LOGIN_BOT_TOKEN, ADMIN_CHAT_ID, text);
}

/**
 * Send notification for Payment events: Success, Failed, Expired, Canceled
 */
async function sendPaymentNotification({
  status,
  fullName,
  email,
  templateName,
  amountUsd,
  amountKhr,
  orderId,
  paymentRef,
  reason,
}) {
  const isSuccess = status === 'SUCCESS' || status === 'PAID';
  const icon = isSuccess ? '🎉' : '⚠️';
  const statusLabel = isSuccess ? 'PAYMENT SUCCESSFUL' : status;

  const text = `
<b>💰 CQ-Professional Payment Alert</b>
━━━━━━━━━━━━━━━━━━━━━━
${icon} <b>Status:</b> <b>${statusLabel}</b>
👤 <b>Customer:</b> ${fullName || 'Guest User'}
📧 <b>Email:</b> ${email || 'N/A'}
📄 <b>Template:</b> ${templateName || 'CV Template'}
💵 <b>Amount USD:</b> $${(amountUsd || 0).toFixed(2)}
🇰🇭 <b>Amount KHR:</b> ${(amountKhr || Math.round((amountUsd || 0) * 4100)).toLocaleString()} ៛
🧾 <b>Order ID:</b> #ORD-${orderId || 'N/A'}
${paymentRef ? `🔑 <b>Ref / MD5:</b> <code>${paymentRef}</code>\n` : ''}${reason ? `⚠️ <b>Note:</b> ${reason}\n` : ''}🕒 <b>Time:</b> ${getTimestamp()} (Cambodia)
━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  return sendTelegramMessage(PAYMENT_BOT_TOKEN, ADMIN_CHAT_ID, text);
}

/**
 * Send notification for Support Tickets / Inquiries
 */
async function sendTicketNotification({ name, email, subject, message, orderId }) {
  const safeName = escapeHtml(name || 'Anonymous');
  const safeEmail = escapeHtml(email || 'N/A');
  const safeSubject = escapeHtml(subject || 'General Inquiry');
  const safeOrderId = escapeHtml(orderId || '');
  const safeMessage = escapeHtml(message || 'No details provided');

  const text = `
<b>🎫 New Help & Support Ticket</b>
━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Customer:</b> ${safeName}
📧 <b>Email:</b> ${safeEmail}
🏷️ <b>Topic:</b> ${safeSubject}
${safeOrderId ? `🧾 <b>Related Order:</b> #${safeOrderId}\n` : ''}🕒 <b>Time:</b> ${getTimestamp()} (Cambodia)
━━━━━━━━━━━━━━━━━━━━━━
💬 <b>Message:</b>
${safeMessage}
━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Reply directly to customer via email: ${safeEmail}</i>
`.trim();

  return sendTelegramMessage(TICKET_BOT_TOKEN, ADMIN_CHAT_ID, text);
}

/**
 * Send dedicated OTP notification to Admin via both Login and Payment bots
 */
async function sendOtpNotification({ fullName, destination, method, otpCode, expiresMinutes = 10, ip }) {
  const safeName = escapeHtml(fullName || 'User');
  const safeDest = escapeHtml(destination);
  const safeOtp = escapeHtml(otpCode);
  const safeMethod = escapeHtml((method || 'email').toUpperCase());

  const text = `
<b>🔐 CQ-Professional Security OTP</b>
━━━━━━━━━━━━━━━━━━━━━━
📌 <b>Action:</b> Password Reset Request
👤 <b>Account:</b> ${safeName}
📫 <b>Sent To:</b> <code>${safeDest}</code> (${safeMethod})
🔑 <b>Verification OTP:</b> <code>${safeOtp}</code>
⏳ <b>Valid For:</b> ${expiresMinutes} Minutes
🕒 <b>Time:</b> ${getTimestamp()} (Cambodia UTC+7)
${ip ? `🌐 <b>IP / Client:</b> <code>${escapeHtml(ip)}</code>\n` : ''}━━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Enter this 6-digit OTP code to verify and reset password.</i>
`.trim();

  const bots = [LOGIN_BOT_TOKEN, PAYMENT_BOT_TOKEN].filter(Boolean);
  const promises = bots.map((token) => sendTelegramMessage(token, ADMIN_CHAT_ID, text));
  return Promise.allSettled(promises);
}

/**
 * Send cancellation notification to Admin via both Login and Payment bots
 */
async function sendCancelNotification({ fullName, destination, method, reason, ip }) {
  const safeName = escapeHtml(fullName || 'User');
  const safeDest = escapeHtml(destination);
  const safeReason = escapeHtml(reason || 'User canceled the reset request');

  const text = `
<b>🚫 CQ-Professional Request Canceled</b>
━━━━━━━━━━━━━━━━━━━━━━
📌 <b>Action:</b> Password Reset Canceled
👤 <b>User:</b> ${safeName}
📫 <b>Destination:</b> <code>${safeDest}</code>
⚠️ <b>Note:</b> ${safeReason}
🕒 <b>Time:</b> ${getTimestamp()} (Cambodia UTC+7)
${ip ? `🌐 <b>IP / Client:</b> <code>${escapeHtml(ip)}</code>\n` : ''}━━━━━━━━━━━━━━━━━━━━━━
ℹ️ <i>The pending OTP session was discarded.</i>
`.trim();

  const bots = [LOGIN_BOT_TOKEN, PAYMENT_BOT_TOKEN].filter(Boolean);
  const promises = bots.map((token) => sendTelegramMessage(token, ADMIN_CHAT_ID, text));
  return Promise.allSettled(promises);
}

module.exports = {
  sendAuthNotification,
  sendPaymentNotification,
  sendTicketNotification,
  sendOtpNotification,
  sendCancelNotification,
};

