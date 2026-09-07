const https = require('https');
const telegramService = require('./telegram.service');

/**
 * Send 6-digit OTP via SMS with multi-gateway support & Telegram fallback
 */
async function sendOtpSms({ phoneNumber, otpCode, expiresMinutes = 10 }) {
  console.log(`[SMS] 📱 Preparing SMS dispatch to ${phoneNumber} (OTP: ${otpCode})`);

  let sent = false;

  // 1. Twilio Integration (if configured in .env)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      sent = await sendViaTwilio({
        to: phoneNumber,
        body: `[CQ-Professional] Your verification code is ${otpCode}. Valid for ${expiresMinutes} mins. Do not share.`,
      });
    } catch (e) {
      console.warn('[SMS] Twilio failed:', e.message);
    }
  }

  // 2. PlasGate Cambodia Integration (if configured in .env)
  if (!sent && process.env.PLASGATE_API_KEY) {
    try {
      sent = await sendViaPlasGate({
        to: phoneNumber,
        text: `[CQ-Professional] Your verification code is ${otpCode}. Valid for ${expiresMinutes} mins.`,
      });
    } catch (e) {
      console.warn('[SMS] PlasGate failed:', e.message);
    }
  }

  // 3. Telegram Bot Alert Fallback (Immediate delivery to Admin / Telegram)
  try {
    await telegramService.sendAuthNotification({
      event: 'Password Reset OTP (SMS)',
      status: 'DISPATCHED',
      fullName: 'Customer Verification',
      email: phoneNumber,
      role: 'user',
      reason: `🔑 6-Digit OTP: <b>${otpCode}</b> (Valid ${expiresMinutes} mins)`,
    });
  } catch (tgErr) {
    console.warn('[SMS] Telegram fallback error:', tgErr.message);
  }

  return {
    success: true,
    sentViaGateway: sent,
    otpCode,
  };
}

/**
 * Twilio SMS Gateway Sender
 */
function sendViaTwilio({ to, body }) {
  return new Promise((resolve) => {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;

    const payload = new URLSearchParams({
      To: to,
      From: from,
      Body: body,
    }).toString();

    const auth = Buffer.from(`${sid}:${token}`).toString('base64');
    const req = https.request({
      hostname: 'api.twilio.com',
      port: 443,
      path: `/2010-04-01/Accounts/${sid}/Messages.json`,
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: 8000,
    }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 300);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.write(payload);
    req.end();
  });
}

/**
 * PlasGate Cambodia Gateway Sender
 */
function sendViaPlasGate({ to, text }) {
  return new Promise((resolve) => {
    const apiKey = process.env.PLASGATE_API_KEY;
    const payload = JSON.stringify({
      recipient: to,
      message: text,
    });

    const req = https.request({
      hostname: 'gateway.plasgate.com',
      port: 443,
      path: '/send-sms',
      method: 'POST',
      headers: {
        'X-Secret': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: 8000,
    }, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.write(payload);
    req.end();
  });
}

module.exports = { sendOtpSms };
