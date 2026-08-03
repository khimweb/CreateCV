const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { query } = require('./pool');

const PASSWORD_SALT_ROUNDS = 12;

async function findUserBySubject(subject) {
  const { rows } = await query(
    `SELECT u.* FROM user_identities i
     JOIN users u ON u.id = i.user_id
     WHERE i.provider = 'google' AND i.provider_subject = ?`,
    [subject]
  );
  return rows[0] || null;
}

async function linkGoogleAccount({ userId, subject, email }) {
  await query(
    `INSERT INTO user_identities (user_id, provider, provider_subject, provider_email)
     VALUES (?, 'google', ?, ?)`,
    [userId, subject, email]
  );
}

async function createGoogleUser({ fullName, email, avatarUrl, subject }) {
  const generatedPassword = crypto.randomBytes(48).toString('base64url');
  const passwordHash = await bcrypt.hash(generatedPassword, PASSWORD_SALT_ROUNDS);
  const result = await query(
    `INSERT INTO users (full_name, email, password_hash, avatar_url)
     VALUES (?, ?, ?, ?)`,
    [fullName, email, passwordHash, avatarUrl || null]
  );

  try {
    await linkGoogleAccount({ userId: result.lastID, subject, email });
  } catch (error) {
    await query('DELETE FROM users WHERE id = ?', [result.lastID]);
    throw error;
  }
  return findUserBySubject(subject);
}

module.exports = { findUserBySubject, linkGoogleAccount, createGoogleUser };
