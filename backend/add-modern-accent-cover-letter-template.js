const { db, query } = require('./db/pool');

(async () => {
  try {
    const name = 'Modern Accent Cover Letter';
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
          'A clean modern cover letter with bold italic name header, horizontal accent rule, left narrative with bulleted accomplishments, and right contact info sidebar.',
          'Cover Letter',
          '',
          '',
          JSON.stringify(['#B91C1C', '#1E3A8A', '#047857', '#1F2937', '#6B21A8']),
          300,
        ],
      );
      console.log(`${name} template added.`);
    }
  } catch (error) {
    console.error('Unable to register Modern Accent Cover Letter:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
