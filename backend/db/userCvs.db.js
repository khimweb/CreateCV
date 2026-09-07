const { query } = require('./pool');

async function findById(id, userId, isAdmin = false) {
    const sql = isAdmin
      ? `SELECT uc.*, t.name AS template_name, t.default_colors
         FROM user_cvs uc JOIN cv_templates t ON t.id = uc.template_id
         WHERE uc.id = ?`
      : `SELECT uc.*, t.name AS template_name, t.default_colors
         FROM user_cvs uc JOIN cv_templates t ON t.id = uc.template_id
         WHERE uc.id = ? AND uc.user_id = ?`;
    const params = isAdmin ? [id] : [id, userId];
    const { rows } = await query(sql, params);
    return rows[0] || null;
  }
  

async function createDraft({ userId, templateId, selectedColor }) {
    const result = await query(
      `INSERT INTO user_cvs (user_id, template_id, title, content, selected_color)
       VALUES (?, ?, 'Untitled CV', '{}', COALESCE(?, '#0284C7'))`,
      [userId, templateId, selectedColor || null]
    );
    const { lastID } = result;
    return findById(lastID, userId);
  }
  
  async function findByUser(userId) {
    const { rows } = await query(
      `SELECT uc.*, t.name AS template_name, t.thumbnail_url
       FROM user_cvs uc JOIN cv_templates t ON t.id = uc.template_id
       WHERE uc.user_id = ? ORDER BY uc.updated_at DESC`,
      [userId]
    );
    return rows;
  }
  
  async function updateContent(id, userId, content, title, isAdmin = false) {
    const accent = typeof content?.accent === 'string' && /^#[0-9a-f]{6}$/i.test(content.accent)
      ? content.accent.toUpperCase()
      : null;
    const sql = isAdmin
      ? `UPDATE user_cvs
         SET content = ?, title = COALESCE(?, title), selected_color = COALESCE(?, selected_color), updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      : `UPDATE user_cvs
         SET content = ?, title = COALESCE(?, title), selected_color = COALESCE(?, selected_color), updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND user_id = ?`;
    const params = isAdmin
      ? [JSON.stringify(content), title || null, accent, id]
      : [JSON.stringify(content), title || null, accent, id, userId];
    await query(sql, params);
    return findById(id, userId, isAdmin);
  }
  
  async function updateColor(id, userId, color, isAdmin = false) {
    const sql = isAdmin
      ? `UPDATE user_cvs SET selected_color = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      : `UPDATE user_cvs SET selected_color = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`;
    const params = isAdmin ? [color, id] : [color, id, userId];
    await query(sql, params);
    return findById(id, userId, isAdmin);
  }
  
  async function setPdfUrl(id, userId, pdfUrl, isAdmin = false) {
    const sql = isAdmin
      ? `UPDATE user_cvs SET pdf_url = ?, is_finalized = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      : `UPDATE user_cvs SET pdf_url = ?, is_finalized = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`;
    const params = isAdmin ? [pdfUrl, id] : [pdfUrl, id, userId];
    await query(sql, params);
    return findById(id, userId, isAdmin);
  }
  
  async function setPaid(id, isPaid = true) {
    await query(
      `UPDATE user_cvs SET is_paid = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [isPaid ? 1 : 0, id]
    );
  }

  async function remove(id, userId, isAdmin = false) {
    if (isAdmin) {
      await query('DELETE FROM user_cvs WHERE id = ?', [id]);
    } else {
      await query('DELETE FROM user_cvs WHERE id = ? AND user_id = ?', [id, userId]);
    }
  }
  
  module.exports = { createDraft, findByUser, findById, updateContent, updateColor, setPdfUrl, setPaid, remove };
  
