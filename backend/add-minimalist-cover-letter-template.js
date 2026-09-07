const { db, query } = require('./db/pool');

(async () => {
  try {
    const name = 'Minimalist Two-Column Cover Letter';
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
          'An elegant, minimalist cover letter featuring a clean header, warm accent-colored recipient and sender names in the To/From column, and structured narrative letter with bullet points on a pure white background.',
          'Cover Letter',
          '',
          '',
          JSON.stringify(['#C59B58', '#1E3A8A', '#047857', '#991B1B', '#334155', '#7C3AED']),
          300,
        ],
      );
      console.log(`${name} template added.`);
    }
  } catch (error) {
    console.error('Unable to register Minimalist Two-Column Cover Letter:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
