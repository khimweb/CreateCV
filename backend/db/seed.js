const { query } = require('./pool');

const DEFAULT_TEMPLATES = [
  {
    name: 'Professional Timeline',
    description: 'A polished two-column CV with an experience timeline and skills sidebar.',
    category: 'Professional',
    layout: 'professional',
    colors: ['#667B97', '#163E63', '#0284C7', '#334155'],
  },
  {
    name: 'Classic Blue',
    description: 'Full-bleed A4 sheet: navy profile sidebar with skill meters and an icon timeline.',
    category: 'Classic',
    layout: 'classic-blue',
    colors: ['#01334C', '#123A5E', '#22577A', '#0F4C5C'],
  },
  {
    name: 'Executive Navy',
    description: 'Navy page with a white content panel, profile rail and icon-led timeline sections.',
    category: 'Modern',
    layout: 'executive-navy',
    colors: ['#03374F', '#0B4A6F', '#123A5E', '#1B5E7E'],
  },
];

/** Older databases predate the `layout` column — add it before seeding. */
async function ensureLayoutColumn() {
  const { rows } = await query('PRAGMA table_info(cv_templates)');
  if (rows.some((c) => c.name === 'layout')) return;
  await query("ALTER TABLE cv_templates ADD COLUMN layout TEXT NOT NULL DEFAULT 'professional'");
}

async function seedDefaultTemplates() {
  await ensureLayoutColumn();

  for (const t of DEFAULT_TEMPLATES) {
    const { rows } = await query('SELECT id FROM cv_templates WHERE name = ?', [t.name]);
    if (rows.length) continue;
    await query(
      `INSERT INTO cv_templates (name, description, category, layout, preview_html, default_colors, price_cents)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [t.name, t.description, t.category, t.layout, '', JSON.stringify(t.colors), 300]
    );
    console.log(`Seeded ${t.name} template.`);
  }
}

module.exports = { seedDefaultTemplates };
