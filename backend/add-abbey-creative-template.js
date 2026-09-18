const { query } = require('./db/pool');

async function addAbbeyCreative() {
  const { rows } = await query('SELECT id FROM cv_templates WHERE name = ?', ['Abbey Creative CV']);
  if (rows.length) {
    console.log('Abbey Creative CV already exists, id:', rows[0].id);
    process.exit(0);
  }
  const result = await query(
    `INSERT INTO cv_templates (name, description, category, preview_html, default_colors, price_cents, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      'Abbey Creative CV',
      'Bold two-column layout with dark charcoal slate sidebar, warm orange accents, circular profile photo, and visual skill progress bars.',
      'Creative',
      '',
      JSON.stringify(['#E27B2B', '#EA580C', '#2563EB', '#15803D', '#7E22CE', '#374151']),
      399,
      1
    ]
  );
  console.log('Abbey Creative CV inserted successfully, id:', result.lastID);
  process.exit(0);
}

addAbbeyCreative().catch(err => {
  console.error(err);
  process.exit(1);
});
