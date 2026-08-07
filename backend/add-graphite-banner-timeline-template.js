const { db, query } = require('./db/pool');

(async () => {
  try {
    const name = 'Graphite Banner Timeline';
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
          'A graphite banner CV with an overlapping circular portrait, light grey sidebar for contact, skills, languages and references, plus icon-badged timeline sections.',
          'Professional',
          '',
          '',
          JSON.stringify(['#323E4D', '#2C3E50', '#1F2A37', '#44536B']),
          299,
        ],
      );
      console.log(`${name} template added.`);
    }
  } catch (error) {
    console.error('Unable to register Graphite Banner Timeline:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
