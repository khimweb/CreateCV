require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { db } = require('./db/pool');
const { seedDefaultTemplates } = require('./db/seed');

const dbPath = path.resolve(__dirname, '..', 'database', 'cv-creator.db');
const schemaPath = path.resolve(__dirname, '..', 'database', 'schema.sql');

function initializeDatabase() {
  return new Promise((resolve, reject) => db.get(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'",
    (err, table) => {
      if (err) return reject(err);
      if (table) return resolve();

      console.log('Database schema not found. Initializing SQLite database...');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schema, (schemaError) => {
        if (schemaError) {
          reject(schemaError);
        } else {
          console.log('Database initialized successfully.');
          resolve();
        }
      });
    }
  ));
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

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200', credentials: true }));

// Payment webhook needs the raw body for signature verification, so it
// must be mounted BEFORE express.json().
app.use('/api/v1/orders/:id/webhook', express.raw({ type: 'application/json' }));
// Allow base64 profile photos inside CV content JSON (up to ~5MB payload)
app.use(express.json({ limit: '5mb' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/templates', templatesRoutes);
app.use('/api/v1/cvs', cvsRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/contact', contactLimiter, contactRoutes);
app.use('/api/v1/admin', adminRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: 'INTERNAL_ERROR', message: err.message });
});

const PORT = process.env.PORT || 4000;
initializeDatabase()
  .then(seedDefaultTemplates)
  .then(() => app.listen(PORT, () => console.log(`CV Creator API listening on :${PORT}`)))
  .catch((error) => { console.error('Database startup failed:', error.message); process.exit(1); });

module.exports = app;
