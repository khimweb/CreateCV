const { db, query } = require('./db/pool');

(async () => {
  try {
    const name = 'Slate Rounded Panels';
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
          'A modern slate-blue resume with a rounded photo card, pill-shaped contact bar, and a curved sidebar for education, certifications, skills, and languages.',
          'Modern',
          '',
          '',
          JSON.stringify(['#364152', '#2A3441', '#4B5768', '#1F2937']),
          299,
        ],
      );
      console.log(`${name} template added.`);
    }
  } catch (error) {
    console.error('Unable to register Slate Rounded Panels:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
