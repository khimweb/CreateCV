const { db, query } = require('./db/pool');

(async () => {
  try {
    const name = 'Classic Border Cover Letter';
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
          'An elegant serif cover letter framed with a bold colored border, centered uppercase header, two-column contact bar, recipient details, and balanced typography.',
          'Cover Letter',
          '',
          '',
          JSON.stringify(['#1a2b5a', '#1b4d3e', '#4a1525', '#2c3e50', '#0f766e']),
          300,
        ],
      );
      console.log(`${name} template added.`);
    }

    // Also ensure the existing Cover Letter template category is updated if needed so Cover Letter category shows both
    await query(`UPDATE cv_templates SET category = 'Cover Letter' WHERE name = 'Cover Letter'`);
  } catch (error) {
    console.error('Unable to register Classic Border Cover Letter:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
