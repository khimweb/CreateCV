const { db, query } = require('./db/pool');

(async () => {
  try {
    const name = 'Navy Sidebar Profile';
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
          'A corporate navy CV with a circular portrait sidebar for contact, education, skills, and languages, plus a bulleted work-experience timeline and reference grid.',
          'Professional',
          '',
          '',
          JSON.stringify(['#1E3A52', '#2C4D69', '#12293C', '#334E68']),
          299,
        ],
      );
      console.log(`${name} template added.`);
    }
  } catch (error) {
    console.error('Unable to register Navy Sidebar Profile:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
