const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../db');

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
    isApproved: !!user.is_approved,
  };
}

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password || password.length < 8) {
    return res.status(400).json({ error: 'INVALID_INPUT', message: 'Name, email, and an 8+ char password are required.' });
  }

  const existing = await db.users.findByEmail(email.toLowerCase());
  if (existing) {
    // Registration may be retried after a network/server interruption. If it
    // is the account owner's password, finish the interrupted sign-up by
    // issuing a normal session instead of returning a duplicate-email error.
    const validPassword = await db.users.verifyPassword(existing, password);
    if (validPassword && existing.is_active) {
      await db.users.touchLastLogin(existing.id);
      return res.json({
        token: signAccessToken(existing),
        refreshToken: signRefreshToken(existing),
        user: toPublicUser(existing),
      });
    }
    return res.status(409).json({ error: 'EMAIL_TAKEN' });
  }

  const user = await db.users.create({ fullName, email: email.toLowerCase(), password });
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
    // Log failed login attempt
    if (email) {
      db.activityLog.log({ userId: user?.id || null, email: email.toLowerCase(), action: 'login_failed', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
    }
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }

  const valid = await db.users.verifyPassword(user, password || '');
  if (!valid) {
    db.activityLog.log({ userId: user.id, email: user.email, action: 'login_failed', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }

  await db.users.touchLastLogin(user.id);
  await db.activityLog.log({ userId: user.id, email: user.email, action: 'login', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
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

module.exports = router;
