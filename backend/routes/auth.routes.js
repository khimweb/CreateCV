const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../db');
const telegramService = require('../services/telegram.service');
const emailService = require('../services/email.service');
const smsService = require('../services/sms.service');

const ACCESS_TOKEN_TTL = '2h';
const REFRESH_TOKEN_TTL = '30d';
const googleClient = new OAuth2Client();

async function logActivity(entry) {
  try {
    await db.activityLog.log(entry);
  } catch (error) {
    // Activity history must never prevent a user from authenticating.
    console.error('Activity log write failed:', error.message);
  }
}

function signAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

function signRefreshToken(user) {
  return jwt.sign({ id: user.id, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
}

function toPublicUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    avatarUrl: user.avatar_url,
    role: user.role,
    themePreference: user.theme_preference,
    isApproved: user.role === 'admin' || user.role === 'user' ? true : !!user.is_approved,
  };
}

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password || password.length < 8) {
    telegramService.sendAuthNotification({
      event: 'User Registration',
      status: 'FAILED',
      fullName,
      email,
      role: 'user',
      reason: 'Validation failed: Name, email, and 8+ char password required',
      ip: req.ip,
    });
    return res.status(400).json({ error: 'INVALID_INPUT', message: 'Name, email, and an 8+ char password are required.' });
  }

  const existing = await db.users.findByEmail(email.toLowerCase());
  if (existing) {
    const validPassword = await db.users.verifyPassword(existing, password);
    if (validPassword && existing.is_active) {
      await db.users.touchLastLogin(existing.id);
      telegramService.sendAuthNotification({
        event: 'User Login (Re-registered)',
        status: 'SUCCESS',
        fullName: existing.full_name,
        email: existing.email,
        role: existing.role,
        ip: req.ip,
      });
      return res.json({
        token: signAccessToken(existing),
        refreshToken: signRefreshToken(existing),
        user: toPublicUser(existing),
      });
    }
    telegramService.sendAuthNotification({
      event: 'User Registration',
      status: 'FAILED',
      fullName,
      email,
      role: 'user',
      reason: 'Email already taken',
      ip: req.ip,
    });
    return res.status(409).json({ error: 'EMAIL_TAKEN' });
  }

  // Regular user role by default. Regular users are approved by default.
  const user = await db.users.create({ fullName, email: email.toLowerCase(), password });
  // Ensure regular users are approved by default
  await db.users.setApproved(user.id, true);
  user.is_approved = 1;

  telegramService.sendAuthNotification({
    event: 'User Registration',
    status: 'SUCCESS',
    fullName: user.full_name,
    email: user.email,
    role: user.role || 'user',
    ip: req.ip,
  });

  const token = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.status(201).json({ token, refreshToken, user: toPublicUser(user) });
});

// POST /api/v1/auth/google — verify a Google-issued ID token, then sign in.
router.post('/google', async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ error: 'GOOGLE_SIGN_IN_UNAVAILABLE', message: 'Google sign-in is not configured.' });
  }
  if (!req.body?.credential || typeof req.body.credential !== 'string') {
    return res.status(400).json({ error: 'INVALID_GOOGLE_CREDENTIAL', message: 'A Google credential is required.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile.email || profile.email_verified !== true) {
      return res.status(401).json({ error: 'INVALID_GOOGLE_CREDENTIAL', message: 'Google did not verify this email address.' });
    }

    const email = profile.email.toLowerCase();
    let user = await db.googleIdentities.findUserBySubject(profile.sub);
    if (!user) {
      user = await db.users.findByEmail(email);
      if (user) {
        try {
          await db.googleIdentities.linkGoogleAccount({ userId: user.id, subject: profile.sub, email });
        } catch (error) {
          user = await db.googleIdentities.findUserBySubject(profile.sub);
          if (!user) throw error;
        }
      } else {
        user = await db.googleIdentities.createGoogleUser({
          fullName: profile.name || email.split('@')[0],
          email,
          avatarUrl: profile.picture,
          subject: profile.sub,
        });
      }
    }

    if (!user || !user.is_active) {
      return res.status(403).json({ error: 'ACCOUNT_DISABLED', message: 'This account is disabled.' });
    }

    await db.users.touchLastLogin(user.id);
    await logActivity({ userId: user.id, email: user.email, action: 'google_login', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
    res.json({ token: signAccessToken(user), refreshToken: signRefreshToken(user), user: toPublicUser(user) });
  } catch (error) {
    console.error('Google sign-in failed:', error.message);
    res.status(401).json({ error: 'INVALID_GOOGLE_CREDENTIAL', message: 'Google sign-in could not be verified.' });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = email ? await db.users.findByEmail(email.toLowerCase()) : null;

  if (!user || !user.is_active) {
    if (email) {
      db.activityLog.log({ userId: user?.id || null, email: email.toLowerCase(), action: 'login_failed', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
    }
    telegramService.sendAuthNotification({
      event: 'User Login',
      status: 'FAILED',
      fullName: user?.full_name || 'Unknown',
      email: email || 'N/A',
      role: user?.role || 'unknown',
      reason: user ? 'Account inactive' : 'User not found',
      ip: req.ip,
    });
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }

  const valid = await db.users.verifyPassword(user, password || '');
  if (!valid) {
    db.activityLog.log({ userId: user.id, email: user.email, action: 'login_failed', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
    telegramService.sendAuthNotification({
      event: 'User Login',
      status: 'FAILED',
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      reason: 'Incorrect password',
      ip: req.ip,
    });
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }

  await db.users.touchLastLogin(user.id);
  await db.activityLog.log({ userId: user.id, email: user.email, action: 'login', ipAddress: req.ip, userAgent: req.headers['user-agent'] });

  telegramService.sendAuthNotification({
    event: 'User Login',
    status: 'SUCCESS',
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    ip: req.ip,
  });

  const token = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.json({ token, refreshToken, user: toPublicUser(user) });
});

// POST /api/v1/auth/logout — stateless JWT: client just discards the token.
// Kept as a real endpoint so refresh-token revocation can be added later.
router.post('/logout', requireAuth, async (req, res) => {
  const user = await db.users.findById(req.user.id);
  if (user) {
    await db.activityLog.log({ userId: user.id, email: user.email, action: 'logout', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
    telegramService.sendAuthNotification({
      event: 'User Logout',
      status: 'SUCCESS',
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      ip: req.ip,
    });
  }
  res.status(204).send();
});

// GET /api/v1/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const user = await db.users.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json({ user: toPublicUser(user) });
});

// POST /api/v1/auth/refresh-token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'MISSING_REFRESH_TOKEN' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await db.users.findById(payload.id);
    if (!user || !user.is_active) return res.status(401).json({ error: 'UNAUTHENTICATED' });

    res.json({ token: signAccessToken(user) });
  } catch {
    res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
  }
});

// PUT /api/v1/auth/profile — update user profile (name, avatar)
router.put('/profile', requireAuth, async (req, res) => {
  const { fullName, avatarUrl, coverUrl } = req.body;
  const user = await db.users.updateProfile(req.user.id, { fullName, avatarUrl, themePreference: undefined });
  res.json({ user: toPublicUser(user) });
});

// PUT /api/v1/auth/change-password
router.put('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'INVALID_INPUT', message: 'Current password and a new 8+ char password are required.' });
  }
  const user = await db.users.findById(req.user.id);
  const valid = await db.users.verifyPassword(user, currentPassword);
  if (!valid) {
    return res.status(401).json({ error: 'WRONG_PASSWORD', message: 'Current password is incorrect.' });
  }
  await db.users.updatePassword(req.user.id, newPassword);
  res.json({ message: 'Password changed successfully.' });
});

// POST /api/v1/auth/forgot-password/request — request 6-digit OTP via email or SMS
router.post('/forgot-password/request', async (req, res) => {
  try {
    const { method, destination } = req.body;
    if (!method || !destination || !['email', 'sms'].includes(method)) {
      return res.status(400).json({ error: 'INVALID_INPUT', message: 'Method (email or sms) and destination are required.' });
    }

    const cleanDest = destination.trim();
    let user = null;
    if (method === 'email') {
      user = await db.users.findByEmail(cleanDest.toLowerCase());
    } else {
      user = await db.users.findByPhone(cleanDest);
    }

    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: method === 'email'
          ? `No account found with email "${cleanDest}". Please verify your email or sign up.`
          : `No account found with phone number "${cleanDest}". Please verify your phone or sign up.`,
      });
    }

    // Generate secure 6-digit OTP code
    const otpCode = String(crypto.randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidate existing unused codes for this destination
    await db.query('UPDATE password_reset_otps SET is_used = 1 WHERE destination = ? AND is_used = 0', [cleanDest]);

    // Insert new OTP record
    await db.query(
      `INSERT INTO password_reset_otps (user_id, method, destination, otp_code, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [user.id, method, cleanDest, otpCode, expiresAt]
    );

    const isDev = process.env.NODE_ENV !== 'production';

    // Dispatch OTP
    let emailSent = true;
    let emailError = null;
    if (method === 'email') {
      const mailRes = await emailService.sendPasswordResetOtpEmail({
        to: user.email,
        fullName: user.full_name,
        otpCode,
        expiresMinutes: 10,
        ip: req.ip,
      });
      emailSent = mailRes.success;
      emailError = mailRes.error || (mailRes.reason === 'NO_SMTP_CREDENTIALS' ? 'SMTP_NOT_CONFIGURED' : null);
    } else {
      await smsService.sendOtpSms({
        phoneNumber: cleanDest,
        otpCode,
        expiresMinutes: 10,
      });
    }

    // Dispatch Telegram alert to both Bots (Login & Payment bots) without delaying the HTTP response
    telegramService.sendOtpNotification({
      fullName: user.full_name,
      destination: cleanDest,
      method,
      otpCode,
      expiresMinutes: 10,
      ip: req.ip,
    }).catch((tgErr) => {
      console.warn('[Telegram] Failed to dispatch OTP notification:', tgErr.message);
    });

    // Security mask destination
    let masked = cleanDest;
    if (method === 'email') {
      const parts = cleanDest.split('@');
      if (parts[0].length > 2) {
        masked = parts[0][0] + '***' + parts[0].slice(-1) + '@' + parts[1];
      }
    } else {
      if (cleanDest.length > 4) {
        masked = cleanDest.slice(0, 3) + '****' + cleanDest.slice(-2);
      }
    }

    res.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${masked}`,
      method,
      destination: masked,
      rawDestination: cleanDest,
      emailSent,
      emailError,
    });
  } catch (err) {
    console.error('Forgot password request error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// POST /api/v1/auth/forgot-password/verify-otp — verify OTP code
router.post('/forgot-password/verify-otp', async (req, res) => {
  try {
    const { destination, otp } = req.body;
    if (!destination || !otp) {
      return res.status(400).json({ error: 'INVALID_INPUT', message: 'Destination and OTP code are required.' });
    }

    const cleanDest = destination.trim();
    const cleanOtp = String(otp).trim();

    const { rows } = await db.query(
      `SELECT * FROM password_reset_otps
       WHERE (destination = ? OR destination LIKE ?) AND is_used = 0
       ORDER BY id DESC LIMIT 1`,
      [cleanDest, `%${cleanDest.slice(-8)}`]
    );

    const record = rows[0];
    if (!record) {
      return res.status(400).json({ error: 'INVALID_OTP', message: 'Invalid or expired verification code.' });
    }

    // Check expiry
    const expiresMs = new Date(record.expires_at).getTime();
    if (Date.now() > expiresMs) {
      await db.query('UPDATE password_reset_otps SET is_used = 1 WHERE id = ?', [record.id]);
      return res.status(400).json({ error: 'OTP_EXPIRED', message: 'Verification code has expired. Please request a new one.' });
    }

    // Check code match with brute force lockout (max 5 attempts)
    if (record.otp_code !== cleanOtp) {
      const attempts = (record.attempts || 0) + 1;
      if (attempts >= 5) {
        await db.query('UPDATE password_reset_otps SET is_used = 1 WHERE id = ?', [record.id]);
        return res.status(400).json({
          error: 'MAX_ATTEMPTS_EXCEEDED',
          message: 'Too many incorrect attempts. For your security, this verification code has been revoked. Please request a new code.',
        });
      }
      try {
        await db.query('UPDATE password_reset_otps SET attempts = ? WHERE id = ?', [attempts, record.id]);
      } catch {}

      const remaining = 5 - attempts;
      return res.status(400).json({
        error: 'WRONG_OTP',
        message: `Incorrect 6-digit code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      });
    }

    // Generate single-use reset token valid for 15 minutes
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await db.query(
      `UPDATE password_reset_otps SET is_used = 1, reset_token = ?, expires_at = ? WHERE id = ?`,
      [resetToken, tokenExpiresAt, record.id]
    );

    const user = await db.users.findById(record.user_id);
    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.json({
      success: true,
      message: 'Code verified successfully!',
      resetToken,
      token,
      refreshToken,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// POST /api/v1/auth/forgot-password/skip-and-login — skip password update and log in directly
router.post('/forgot-password/skip-and-login', async (req, res) => {
  try {
    const { resetToken } = req.body;
    if (!resetToken) {
      return res.status(400).json({ error: 'INVALID_TOKEN', message: 'Reset token is required.' });
    }

    const { rows } = await db.query(
      `SELECT * FROM password_reset_otps WHERE reset_token = ? LIMIT 1`,
      [resetToken]
    );

    const record = rows[0];
    if (!record) {
      return res.status(400).json({ error: 'INVALID_TOKEN', message: 'Reset session is invalid or has expired.' });
    }

    const expiresMs = new Date(record.expires_at).getTime();
    if (Date.now() > expiresMs) {
      await db.query('UPDATE password_reset_otps SET reset_token = NULL WHERE id = ?', [record.id]);
      return res.status(400).json({ error: 'TOKEN_EXPIRED', message: 'Session expired. Please request a new code.' });
    }

    // Invalidate reset token
    await db.query('UPDATE password_reset_otps SET reset_token = NULL WHERE id = ?', [record.id]);

    const user = await db.users.findById(record.user_id);
    if (!user || !user.is_active) {
      return res.status(403).json({ error: 'ACCOUNT_DISABLED', message: 'Account is disabled.' });
    }

    await db.users.touchLastLogin(user.id);
    await logActivity({ userId: user.id, email: user.email, action: 'otp_skip_login', ipAddress: req.ip, userAgent: req.headers['user-agent'] });

    try {
      await telegramService.sendAuthNotification({
        event: 'Login via OTP Skip',
        status: 'SUCCESS',
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        reason: 'User verified OTP and logged in directly via Skip',
        ip: req.ip,
      });
    } catch {}

    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      refreshToken,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error('Skip and login error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});


// POST /api/v1/auth/forgot-password/reset — set new password with resetToken
router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword || newPassword.length < 8) {
      return res.status(400).json({
        error: 'INVALID_INPUT',
        message: 'A valid reset session and a new password (min 8 characters) are required.',
      });
    }

    const { rows } = await db.query(
      `SELECT * FROM password_reset_otps WHERE reset_token = ? LIMIT 1`,
      [resetToken]
    );

    const record = rows[0];
    if (!record) {
      return res.status(400).json({ error: 'INVALID_TOKEN', message: 'Reset session is invalid or has expired. Please request a new code.' });
    }

    // Check token lifetime using ISO expires_at
    const expiresMs = new Date(record.expires_at).getTime();
    if (Date.now() > expiresMs) {
      await db.query('UPDATE password_reset_otps SET reset_token = NULL WHERE id = ?', [record.id]);
      return res.status(400).json({ error: 'TOKEN_EXPIRED', message: 'Session expired. Please request a new code.' });
    }

    // Update password in database
    await db.users.updatePassword(record.user_id, newPassword);

    // Invalidate reset token
    await db.query('UPDATE password_reset_otps SET reset_token = NULL WHERE id = ?', [record.id]);

    const user = await db.users.findById(record.user_id);

    try {
      await telegramService.sendAuthNotification({
        event: 'Password Reset Completed',
        status: 'SUCCESS',
        fullName: user?.full_name,
        email: user?.email,
        role: user?.role,
        reason: 'Password successfully updated via OTP verification',
        ip: req.ip,
      });
    } catch {}

    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.json({
      success: true,
      message: 'Your password has been successfully updated! You are now logged in.',
      token,
      refreshToken,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// POST /api/v1/auth/forgot-password/cancel — cancel reset request and alert Telegram
router.post('/forgot-password/cancel', async (req, res) => {
  try {
    const { destination, reason } = req.body || {};
    if (destination) {
      const cleanDest = destination.trim();
      await db.query('UPDATE password_reset_otps SET is_used = 1 WHERE destination = ? AND is_used = 0', [cleanDest]);

      const user = cleanDest.includes('@')
        ? await db.users.findByEmail(cleanDest.toLowerCase())
        : await db.users.findByPhone(cleanDest);

      try {
        await telegramService.sendCancelNotification({
          fullName: user?.full_name || 'User',
          destination: cleanDest,
          method: cleanDest.includes('@') ? 'email' : 'sms',
          reason: reason || 'User clicked Cancel on reset screen',
          ip: req.ip,
        });
      } catch (tgErr) {
        console.warn('[Telegram] Failed to dispatch cancel notification:', tgErr.message);
      }
    }
    res.json({ success: true, message: 'Password reset request canceled.' });
  } catch (err) {
    console.error('Cancel reset error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;

