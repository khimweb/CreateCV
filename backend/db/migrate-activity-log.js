/**
 * Migration: Add activity_log table and bio/cover_url columns to users table.
 * Run once on the server: node db/migrate-activity-log.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const { db } = require('./pool');

const migrations = [
  `CREATE TABLE IF NOT EXISTS activity_log (
    id          INTEGER PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    email       TEXT NOT NULL,
    action      TEXT NOT NULL CHECK (action IN ('login', 'logout', 'register', 'login_failed')),
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at)`,
];

// Add bio and cover_url columns to users if they don't exist
const alterUsers = [
  { col: 'bio', sql: `ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''` },
  { col: 'cover_url', sql: `ALTER TABLE users ADD COLUMN cover_url TEXT` },
];

db.serialize(() => {
  for (const sql of migrations) {
    db.run(sql, (err) => {
      if (err) console.error('Migration error:', err.message);
      else console.log('✓', sql.slice(0, 60) + '...');
    });
  }

  for (const { col, sql } of alterUsers) {
    db.run(sql, (err) => {
      if (err && err.message.includes('duplicate column')) {
        console.log(`✓ Column '${col}' already exists, skipping.`);
      } else if (err) {
        console.error('Alter error:', err.message);
      } else {
        console.log(`✓ Added column '${col}' to users table.`);
      }
    });
  }

  console.log('\nMigration complete.');
  process.exit(0);
});
