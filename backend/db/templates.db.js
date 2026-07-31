const { query } = require('./pool');

async function findMany({ category, search, activeOnly = true } = {}) {
    const conditions = [];
    const params = [];
  
    if (activeOnly) {
        conditions.push('is_active = 1');
    }
    if (category) {
      params.push(category);
      conditions.push(`category = ?`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`name LIKE ?`);
    }
  
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await query(
      `SELECT id, name, description, category, thumbnail_url, default_colors,
              price_cents, is_active, sold_count, avg_rating
       FROM cv_templates ${where}
       ORDER BY created_at DESC`,
      params
    );
    return rows;
  }
  
  async function findById(id) {
    const { rows } = await query('SELECT * FROM cv_templates WHERE id = ?', [id]);
    return rows[0] || null;
  }
  
  async function create(data) {
    const result = await query(
      `INSERT INTO cv_templates (name, description, category, thumbnail_url, preview_html, default_colors, price_cents)
       VALUES (?,?,?,?,?,?,?)`,
      [data.name, data.description, data.category, data.thumbnailUrl, data.previewHtml,
       JSON.stringify(data.defaultColors || []), data.priceCents ?? 300]
    );
    const { lastID } = result;
    return findById(lastID);
  }
  
  async function update(id, data) {
    await query(
      `UPDATE cv_templates SET
         name = COALESCE(?, name),
         description = COALESCE(?, description),
         category = COALESCE(?, category),
         thumbnail_url = COALESCE(?, thumbnail_url),
         preview_html = COALESCE(?, preview_html),
         default_colors = COALESCE(?, default_colors),
         price_cents = COALESCE(?, price_cents),
         is_active = COALESCE(?, is_active),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [data.name, data.description, data.category, data.thumbnailUrl, data.previewHtml,
       data.defaultColors ? JSON.stringify(data.defaultColors) : null, data.priceCents, data.isActive, id]
    );
    return findById(id);
  }
  
  async function toggleActive(id) {
    await query(
      'UPDATE cv_templates SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    return findById(id);
  }
  
  async function remove(id) {
    await query('DELETE FROM cv_templates WHERE id = ?', [id]);
  }
  
  async function count() {
    const { rows } = await query('SELECT COUNT(*) AS total FROM cv_templates');
    return rows[0].total;
  }
  
  async function topSelling(limit = 5) {
    const { rows } = await query(
      'SELECT id, name, thumbnail_url, sold_count, avg_rating FROM cv_templates ORDER BY sold_count DESC LIMIT ?',
      [limit]
    );
    return rows;
  }
  
  module.exports = { findMany, findById, create, update, toggleActive, remove, count, topSelling };
  
