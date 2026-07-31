const bcrypt = require('bcrypt');
const { query } = require('./pool');

const SALT_ROUNDS = 12;

async function findByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ fullName, email, password }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES (?, ?, ?)`,
    [fullName, email, passwordHash]
  );
  const { lastID } = result;
  return findById(lastID);
}

async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password_hash);
}

async function touchLastLogin(id) {
  await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
}

async function updateProfile(id, { fullName, avatarUrl, themePreference }) {
  await query(
    `UPDATE users SET
       full_name = COALESCE(?, full_name),
       avatar_url = COALESCE(?, avatar_url),
       theme_preference = COALESCE(?, theme_preference),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [fullName, avatarUrl, themePreference, id]
  );
  return findById(id);
}

async function updatePassword(id, newPassword) {
  const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await query('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [hash, id]);
}

async function list({ page = 1, pageSize = 20, search = '' } = {}) {
  const offset = (page - 1) * pageSize;
  const searchTerm = `%${search}%`;
  const { rows } = await query(
    `SELECT id, full_name, email, role, is_active, last_login_at, created_at
     FROM users
     WHERE full_name LIKE ? OR email LIKE ?
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [searchTerm, searchTerm, pageSize, offset]
  );
  const { rows: countRows } = await query('SELECT COUNT(*) AS total FROM users');
  return { users: rows, total: countRows[0].total };
}

async function setActive(id, isActive) {
  await query(
    'UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [isActive, id]
  );
  return findById(id);
}

async function remove(id) {
  await query('DELETE FROM users WHERE id = ?', [id]);
}

async function count() {
  const { rows } = await query('SELECT COUNT(*) AS total FROM users');
  return rows[0].total;
}

module.exports = {
  findByEmail,
  findById,
  create,
  verifyPassword,
  touchLastLogin,
  updateProfile,
  updatePassword,
  list,
  setActive,
  remove,
  count,
};
