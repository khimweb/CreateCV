const { query } = require('./db/pool');

(async () => {
  try {
    // Remove duplicate Modern Split (keep lowest id)
    const dups = await query(
      "SELECT id, name FROM cv_templates WHERE name = 'Modern Split' ORDER BY id"
    );
    if (dups.rows.length > 1) {
      for (const r of dups.rows.slice(1)) {
        await query('DELETE FROM cv_templates WHERE id = ?', [r.id]);
        console.log('Deleted duplicate Modern Split id', r.id);
      }
      console.log('Kept Modern Split id', dups.rows[0].id);
    }

    const existing = await query(
      "SELECT id FROM cv_templates WHERE name LIKE '%Geometric%'"
    );
    if (existing.rows.length) {
      console.log('Geometric already exists', existing.rows);
    } else {
      const colors = JSON.stringify([
        '#2c3e50',
        '#1b3a5c',
        '#334155',
        '#0f4c81',
        '#1e293b',
      ]);
      await query(
        `INSERT INTO cv_templates
          (name, description, category, thumbnail_url, preview_html, default_colors, price_cents)
         VALUES (?,?,?,?,?,?,?)`,
        [
          'Geometric Sidebar',
          'A sleek dark navy sidebar with geometric diagonal cut, circular photo, contact/education/skills on the left and about/experience/references on the right.',
          'Creative',
          '',
          '',
          colors,
          299,
        ]
      );
      console.log('Geometric Sidebar template added');
    }

    const all = await query(
      'SELECT id, name, category, price_cents FROM cv_templates ORDER BY id'
    );
    console.log(JSON.stringify(all.rows, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
