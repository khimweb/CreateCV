require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { db } = require('./db/pool');
const { seedDefaultTemplates } = require('./db/seed');

const dbPath = path.resolve(__dirname, '..', 'database', 'cv-creator.db');
const schemaPath = path.resolve(__dirname, '..', 'database', 'schema.sql');

function run(sql) {
  return new Promise((resolve, reject) => db.run(sql, (error) => (error ? reject(error) : resolve())));
}

function get(sql) {
  return new Promise((resolve, reject) => db.get(sql, (error, row) => (error ? reject(error) : resolve(row))));
}

function execute(sql) {
  return new Promise((resolve, reject) => db.exec(sql, (error) => (error ? reject(error) : resolve())));
}

async function addColumnIfMissing(sql) {
  try {
    await run(sql);
  } catch (error) {
    if (!/duplicate column name/i.test(error.message)) throw error;
  }
}

async function ensureRuntimeSchema() {
  await run(`CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY, user_id INTEGER, email TEXT NOT NULL,
    action TEXT NOT NULL, ip_address TEXT, user_agent TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await addColumnIfMissing('ALTER TABLE users ADD COLUMN bio TEXT NOT NULL DEFAULT ""');
  await addColumnIfMissing('ALTER TABLE users ADD COLUMN cover_url TEXT');
  await addColumnIfMissing('ALTER TABLE users ADD COLUMN phone TEXT');
  await addColumnIfMissing('ALTER TABLE users ADD COLUMN job_title TEXT');
  await addColumnIfMissing('ALTER TABLE users ADD COLUMN location TEXT');
  await addColumnIfMissing('ALTER TABLE users ADD COLUMN timezone TEXT');
  await addColumnIfMissing('ALTER TABLE users ADD COLUMN is_approved INTEGER NOT NULL DEFAULT 0');
  await run("UPDATE users SET is_approved = 1 WHERE role = 'admin'");
  await run(`CREATE TABLE IF NOT EXISTS user_identities (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google')),
    provider_subject TEXT NOT NULL,
    provider_email TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME,
    UNIQUE (provider, provider_subject),
    UNIQUE (user_id, provider)
  )`);
  await run('CREATE INDEX IF NOT EXISTS idx_user_identities_subject ON user_identities(provider, provider_subject)');
  await run(`CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function initializeDatabase() {
  const usersTable = await get("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'");
  if (!usersTable) {
    console.log('Database schema not found. Initializing SQLite database...');
    await execute(fs.readFileSync(schemaPath, 'utf8'));
    console.log('Database initialized successfully.');
  }
  await ensureRuntimeSchema();
}


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const templatesRoutes = require('./routes/templates.routes');
const cvsRoutes = require('./routes/cvs.routes');
const ordersRoutes = require('./routes/orders.routes');
const contactRoutes = require('./routes/contact.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, reverse proxy / same-origin)
      if (!origin) return callback(null, true);
      // Wildcard or exact origin match
      if (corsOrigins.includes('*') || corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Allow local development on any port
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

// Payment webhook needs the raw body for signature verification, so it
// must be mounted BEFORE express.json().
app.use('/api/v1/orders/:id/webhook', express.raw({ type: 'application/json' }));
// Allow base64 profile photos inside CV content JSON (up to ~20MB payload)
app.use(express.json({ limit: '20mb' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });


app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/templates', templatesRoutes);
app.use('/api/v1/cvs', cvsRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/contact', contactLimiter, contactRoutes);
app.use('/api/v1/admin', adminRoutes);

// Public pricing route for homepage and app
app.get('/api/v1/pricing', async (req, res) => {
  try {
    const { DEFAULT_HOMEPAGE_PRICING } = require('./config/pricing.default');
    const { query } = require('./db/pool');
    const { rows } = await query("SELECT value FROM system_settings WHERE key = 'homepage_pricing'");
    if (rows && rows.length > 0 && rows[0].value) {
      try {
        const parsed = JSON.parse(rows[0].value);
        return res.json({ pricing: parsed });
      } catch (e) {}
    }
    res.json({ pricing: DEFAULT_HOMEPAGE_PRICING });
  } catch (err) {
    res.json({ pricing: require('./config/pricing.default').DEFAULT_HOMEPAGE_PRICING });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: 'INTERNAL_ERROR', message: err.message });
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  initializeDatabase()
    .then(seedDefaultTemplates)
    .then(() => app.listen(PORT, () => console.log(`CV Creator API listening on :${PORT}`)))
    .catch((error) => { console.error('Database startup failed:', error.message); process.exit(1); });
}

module.exports = app;
