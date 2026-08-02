const { query } = require('./db/pool');

(async () => {
  try {
    const defaultColors = JSON.stringify(['#1a5f5a', '#2d7a73', '#3d8f87', '#4a9e97']);
    await query(
      `INSERT INTO cv_templates (name, description, category, thumbnail_url, preview_html, default_colors, price_cents) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Modern Split', 'A modern two-column CV with dark teal left sidebar and light grey main content area, featuring icons for each section.', 'Modern', '', '', defaultColors, 300]
    );
    console.log('Template added successfully');
  } catch (error) {
    console.error('Error adding template:', error);
  }
})();
