const { query } = require('./pool');

async function findByTemplate(templateId) {
  const { rows } = await query(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.full_name, u.avatar_url
     FROM reviews r JOIN users u ON u.id = r.user_id
     WHERE r.template_id = ? ORDER BY r.created_at DESC`,
    [templateId]
  );
  return rows;
}

async function upsert({ userId, templateId, rating, comment }) {
    await query(
    `INSERT INTO reviews (user_id, template_id, rating, comment)
     VALUES (?, ?, ?, ?)
     ON CONFLICT (user_id, template_id)
     DO UPDATE SET rating = excluded.rating, comment = excluded.comment`,
    [userId, templateId, rating, comment || null]
  );
  const { rows } = await query('SELECT * FROM reviews WHERE user_id = ? AND template_id = ?', [userId, templateId]);
    return rows[0];
}

module.exports = { findByTemplate, upsert };
