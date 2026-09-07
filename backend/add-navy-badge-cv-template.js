const { db, query } = require('./db/pool');

(async () => {
  try {
    const name = 'Navy Badge Executive CV';
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
          'A commanding two-column executive CV with a dark navy banner and sidebar, white pill section badges, language proficiency progress bars, diamond-bullet personal stats, and structured two-column qualifications.',
          'Professional',
          '',
          '',
          JSON.stringify(['#1B2838', '#0F3D64', '#1E3A8A', '#047857', '#991B1B']),
          300,
        ],
      );
      console.log(`${name} template added.`);
    }
  } catch (error) {
    console.error('Unable to register Navy Badge Executive CV:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
