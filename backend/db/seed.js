const { query } = require('./pool');

async function seedDefaultTemplates() {
  const { rows } = await query('SELECT id FROM cv_templates WHERE name = ?', ['Professional Timeline']);
  if (rows.length) return;
  await query(
    `INSERT INTO cv_templates (name, description, category, preview_html, default_colors, price_cents)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['Professional Timeline', 'A polished two-column CV with an experience timeline and skills sidebar.', 'Professional', '', JSON.stringify(['#667B97', '#163E63', '#0284C7', '#334155']), 300]
  );
  console.log('Seeded Professional Timeline template.');
}

module.exports = { seedDefaultTemplates };
