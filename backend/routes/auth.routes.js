const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../db');

const ACCESS_TOKEN_TTL = '2h';
const REFRESH_TOKEN_TTL = '30d';

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

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = email ? await db.users.findByEmail(email.toLowerCase()) : null;

  if (!user || !user.is_active) {
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }

  const valid = await db.users.verifyPassword(user, password || '');
  if (!valid) {
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }

  await db.users.touchLastLogin(user.id);
  const token = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.json({ token, refreshToken, user: toPublicUser(user) });
});

// POST /api/v1/auth/logout — stateless JWT: client just discards the token.
// Kept as a real endpoint so refresh-token revocation can be added later.
router.post('/logout', requireAuth, async (req, res) => {
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
