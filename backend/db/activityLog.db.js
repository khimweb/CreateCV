const { query } = require('./pool');

/**
 * Activity log tracks user login/logout/register events
 * for the admin Security panel.
 */

async function log({ userId, email, action, ipAddress, userAgent }) {
  await query(
    `INSERT INTO activity_log (user_id, email, action, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, email, action, ipAddress || null, userAgent || null]
  );
}

async function list({ page = 1, pageSize = 50, search = '', action = '' } = {}) {
  const offset = (page - 1) * pageSize;
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(al.email LIKE ? OR u.full_name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }
  if (action) {
    conditions.push(`al.action = ?`);
    params.push(action);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows } = await query(
    `SELECT al.id, al.user_id, al.email, al.action, al.ip_address, al.user_agent, al.created_at,
            u.full_name, u.is_active
     FROM activity_log al
     LEFT JOIN users u ON u.id = al.user_id
     ${where}
     ORDER BY al.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  const { rows: countRows } = await query(
    `SELECT COUNT(*) AS total FROM activity_log al LEFT JOIN users u ON u.id = al.user_id ${where}`,
    params
  );

  return { logs: rows, total: countRows[0].total };
}

async function deleteLog(id) {
  await query('DELETE FROM activity_log WHERE id = ?', [id]);
}

async function deleteAll() {
  await query('DELETE FROM activity_log');
}

module.exports = { log, list, deleteLog, deleteAll };
