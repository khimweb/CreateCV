const { query } = require('./pool');

async function findById(id, userId) {
    const { rows } = await query(
      `SELECT uc.*, t.name AS template_name, t.default_colors, t.layout AS template_layout
       FROM user_cvs uc JOIN cv_templates t ON t.id = uc.template_id
       WHERE uc.id = ? AND uc.user_id = ?`,
      [id, userId]
    );
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
      `SELECT uc.*, t.name AS template_name, t.thumbnail_url, t.layout AS template_layout
       FROM user_cvs uc JOIN cv_templates t ON t.id = uc.template_id
       WHERE uc.user_id = ? ORDER BY uc.updated_at DESC`,
      [userId]
    );
    return rows;
  }
  
  async function updateContent(id, userId, content, title) {
    await query(
      `UPDATE user_cvs SET content = ?, title = COALESCE(?, title), updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [JSON.stringify(content), title || null, id, userId]
    );
    return findById(id, userId);
  }
  
  async function updateColor(id, userId, color) {
    await query(
      `UPDATE user_cvs SET selected_color = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [color, id, userId]
    );
    return findById(id, userId);
  }
  
  async function setPdfUrl(id, userId, pdfUrl) {
    await query(
      `UPDATE user_cvs SET pdf_url = ?, is_finalized = 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [pdfUrl, id, userId]
    );
    return findById(id, userId);
  }
  
  async function remove(id, userId) {
    await query('DELETE FROM user_cvs WHERE id = ? AND user_id = ?', [id, userId]);
  }
  
  module.exports = { createDraft, findByUser, findById, updateContent, updateColor, setPdfUrl, remove };
  
