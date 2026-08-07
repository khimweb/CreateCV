const { db, query } = require('./db/pool');

(async () => {
  try {
    const name = 'Warm Taupe Timeline';
    const existing = await query('SELECT id FROM cv_templates WHERE name = ?', [name]);

    if (existing.rows.length) {
      console.log(`${name} already exists (id ${existing.rows[0].id}).`);
    } else {
      await query(
        `INSERT INTO cv_templates
          (name, description, category, thumbnail_url, preview_html, default_colors, price_cents)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          'An inviting warm-taupe CV with a chocolate sidebar, circular profile portrait, skill progress bars, and a refined experience timeline.',
          'Creative',
          '',
          '',
          JSON.stringify(['#A87C64', '#2C1E18', '#FAF8F5', '#6D4D3D']),
          299,
        ],
      );
      console.log(`${name} template added.`);
    }
  } catch (error) {
    console.error('Unable to register Warm Taupe Timeline:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
