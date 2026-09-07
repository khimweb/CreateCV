const crypto = require('crypto');
const https = require('https');

const BAKONG_ACCOUNT_ID = process.env.BAKONG_ACCOUNT_ID || 'phorn_sokkhim@bkrt';
const BAKONG_MERCHANT_NAME = process.env.BAKONG_MERCHANT_NAME || 'Phorn Sokkhim';
const BAKONG_CITY = 'Phnom Penh';
const BAKONG_TOKEN =
  process.env.BAKONG_TOKEN ||
  process.env.BAKONG_API_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYzY4NGNhNTUwNTJmNDRjYiJ9LCJpYXQiOjE3ODg2MDgzNzcsImV4cCI6MTc5NjM4NDM3N30.005xyAtLjtWAl-C77c79t9J59nQ2i2-XZ7_LPGzwhsY';

/**
 * CRC16 CCITT (0x1021, init 0xFFFF) for EMVCo / KHQR Tag 63
 */
function crc16(data) {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function emvTag(id, val) {
  const str = String(val);
  const len = String(Buffer.byteLength(str, 'utf8')).padStart(2, '0');
  return `${id}${len}${str}`;
}

/**
 * Generate official NBC KHQR string (EMVCo standard)
 */
function generateKHQRString({ accountId = BAKONG_ACCOUNT_ID, merchantName = BAKONG_MERCHANT_NAME, amount = 3.00, currency = 'USD', billNumber = '' }) {
  const isUsd = currency.toUpperCase() === 'USD';
  const currCode = isUsd ? '840' : '116';
  const formattedAmount = isUsd ? Number(amount).toFixed(2) : String(Math.round(amount));

  // Tag 29: Merchant Account Info (Individual / Merchant)
  const tag29_00 = emvTag('00', accountId);
  const tag29 = emvTag('29', tag29_00);

  // Tag 62: Additional Data Field (Bill Number / Reference)
  let tag62 = '';
  if (billNumber) {
    const tag62_01 = emvTag('01', String(billNumber).slice(0, 25));
    tag62 = emvTag('62', tag62_01);
  }

  // Tag 99: Timestamp Template (Creation and Expiration timestamps in Unix ms)
  // Required by ABA Mobile, Bakong, and KHQR to avoid "KHQR is expired" error
  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours in future
  const tag99_00 = emvTag('00', String(now));
  const tag99_01 = emvTag('01', String(expiresAt));
  const tag99 = emvTag('99', tag99_00 + tag99_01);

  let raw = '';
  raw += emvTag('00', '01'); // Format indicator: 01
  raw += emvTag('01', '12'); // Point of Initiation: 12 = Dynamic (required when Amount is specified)
  raw += tag29;
  raw += emvTag('52', '5999'); // Merchant category code (5999 default for KHQR)
  raw += emvTag('53', currCode); // Currency
  raw += emvTag('54', formattedAmount); // Amount
  raw += emvTag('58', 'KH'); // Country
  raw += emvTag('59', merchantName.slice(0, 25)); // Merchant Name
  raw += emvTag('60', BAKONG_CITY); // City
  if (tag62) raw += tag62;
  raw += tag99;

  // Tag 63: Checksum
  const toChecksum = raw + '6304';
  const checksum = crc16(toChecksum);
  return toChecksum + checksum;
}

/**
 * MD5 hash of the KHQR string (used by Bakong API)
 */
function calculateMD5(qrString) {
  return crypto.createHash('md5').update(qrString).digest('hex');
}

/**
 * Verify payment with Bakong Open API via MD5
 */
async function checkBakongPayment(md5) {
  if (!BAKONG_TOKEN) {
    console.warn('[Bakong] Warning: No BAKONG_TOKEN configured in environment.');
    return { paid: false, message: 'NO_BAKONG_TOKEN' };
  }
  const cleanMd5 = String(md5 || '').trim().toLowerCase();
  if (!cleanMd5) {
    return { paid: false, message: 'INVALID_MD5' };
  }

  return new Promise((resolve) => {
    try {
      const payload = JSON.stringify({ md5: cleanMd5 });
      const options = {
        hostname: 'api-bakong.nbc.gov.kh',
        port: 443,
        path: '/v1/check_transaction_by_md5',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BAKONG_TOKEN}`,
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 8000,
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            if (res.statusCode === 401) {
              console.error('[Bakong] 401 Unauthorized: BAKONG_TOKEN is invalid or expired.');
              return resolve({ paid: false, code: 401, message: 'UNAUTHORIZED_TOKEN' });
            }

            const data = JSON.parse(body);
            // NBC Bakong Open API specification: responseCode === 0 denotes success
            const isSuccess =
              (data.responseCode === 0 || data.responseCode === '0' || data.code === 0) &&
              Boolean(data.data);

            if (isSuccess) {
              console.log(`[Bakong] ✓ Confirmed transaction for MD5: ${cleanMd5} (Hash: ${data.data?.hash || 'N/A'})`);
              resolve({
                paid: true,
                raw: data.data,
                hash: data.data?.hash,
                amount: data.data?.amount,
                currency: data.data?.currency,
              });
            } else {
              resolve({
                paid: false,
                code: data.responseCode,
                message: data.responseMessage || 'PENDING',
              });
            }
          } catch (parseErr) {
            console.warn('[Bakong] JSON parse error from Bakong API:', body.slice(0, 150));
            resolve({ paid: false, message: 'INVALID_RESPONSE' });
          }
        });
      });

      req.on('error', (err) => {
        console.warn('[Bakong] Check request error:', err.message);
        resolve({ paid: false, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        console.warn('[Bakong] Check request timed out after 8s');
        resolve({ paid: false, error: 'TIMEOUT' });
      });

      req.write(payload);
      req.end();
    } catch (e) {
      console.warn('[Bakong] Unexpected exception:', e.message);
      resolve({ paid: false, error: e.message });
    }
  });
}

function hasBakongToken() {
  return Boolean(BAKONG_TOKEN && String(BAKONG_TOKEN).trim().length > 10);
}

module.exports = {
  BAKONG_ACCOUNT_ID,
  BAKONG_MERCHANT_NAME,
  generateKHQRString,
  calculateMD5,
  checkBakongPayment,
  hasBakongToken,
};
