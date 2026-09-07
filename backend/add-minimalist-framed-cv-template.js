const { db, query } = require('./db/pool');

(async () => {
  try {
    const name = 'Minimalist Framed CV';
    const existing = await query('SELECT id FROM cv_templates WHERE name = ?', [name]);

    if (existing.rows.length) {
      console.log(`${name} already exists (id ${existing.rows[0].id}).`);
    } else {
      const result = await query(
        `INSERT INTO cv_templates
          (name, description, category, thumbnail_url, preview_html, default_colors, price_cents)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          'A clean, elegant framed CV with top contact header, full-width summary, two-column skills/education/languages sidebar, and timeline work experience.',
          'Professional',
          '',
          '',
          JSON.stringify(['#1F2937', '#2563EB', '#0D9488', '#4B5563', '#7C3AED']),
          299,
        ],
      );
      console.log(`${name} template added with ID ${result.insertId || 'new'}.`);
    }
  } catch (error) {
    console.error('Unable to register Minimalist Framed CV:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
