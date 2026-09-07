const bcrypt = require('bcrypt');
const { query } = require('./pool');

const SALT_ROUNDS = 4;

async function findByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findByPhone(phone) {
  const clean = String(phone || '').replace(/[^0-9]/g, '');
  const { rows } = await query(
    'SELECT * FROM users WHERE phone = ? OR phone LIKE ? LIMIT 1',
    [phone, `%${clean.slice(-8)}`]
  );
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

async function updateProfile(id, { fullName, avatarUrl, coverUrl, bio, themePreference, phone, jobTitle, location, timezone }) {
  await query(
    `UPDATE users SET
       full_name = COALESCE(?, full_name),
       avatar_url = COALESCE(?, avatar_url),
       cover_url = COALESCE(?, cover_url),
       bio = COALESCE(?, bio),
       theme_preference = COALESCE(?, theme_preference),
       phone = COALESCE(?, phone),
       job_title = COALESCE(?, job_title),
       location = COALESCE(?, location),
       timezone = COALESCE(?, timezone),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [fullName, avatarUrl, coverUrl, bio, themePreference, phone, jobTitle, location, timezone, id]
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
    `SELECT u.id, u.full_name, u.email, u.avatar_url, u.role, u.is_active, u.is_approved, u.last_login_at, u.created_at,
            (SELECT COUNT(*) FROM user_cvs WHERE user_id = u.id) AS cv_count
     FROM users u
     WHERE u.full_name LIKE ? OR u.email LIKE ?
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [searchTerm, searchTerm, pageSize, offset]
  );
  const { rows: countRows } = await query(
    'SELECT COUNT(*) AS total FROM users WHERE full_name LIKE ? OR email LIKE ?',
    [searchTerm, searchTerm]
  );
  return { users: rows, total: countRows[0].total };
}

async function getOnlineUsers(minutesThreshold = 15) {
  const { rows } = await query(
    `SELECT id, full_name, email, role, is_active, is_approved, last_login_at,
            CASE WHEN last_login_at > datetime('now', ?) THEN 1 ELSE 0 END AS is_online
     FROM users
     ORDER BY is_online DESC, last_login_at DESC`,
    [`-${minutesThreshold} minutes`]
  );
  return rows;
}

async function setActive(id, isActive) {
  await query(
    'UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [isActive, id]
  );
  return findById(id);
}

async function setApproved(id, isApproved) {
  await query(
    'UPDATE users SET is_approved = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [isApproved ? 1 : 0, id]
  );
  return findById(id);
}

async function setRole(id, role) {
  await query(
    'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [role, id]
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
  findByPhone,
  findById,
  create,
  verifyPassword,
  touchLastLogin,
  updateProfile,
  updatePassword,
  list,
  getOnlineUsers,
  setActive,
  setApproved,
  setRole,
  remove,
  count,
};
