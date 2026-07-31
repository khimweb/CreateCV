const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '..', '..', 'database', 'cv-creator.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.run('PRAGMA foreign_keys = ON');

/**
 * query(text, params) — wrapper for sqlite3 run/all.
 */
async function query(text, params = []) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    // Use `all` for SELECT queries and `run` for INSERT/UPDATE/DELETE
    const isSelect = text.trim().toUpperCase().startsWith('SELECT');
    const method = isSelect ? 'all' : 'run';

    db[method](text, params, function (err, rows) {
      if (err) {
        console.error('SQL Error:', err.message);
        return reject(err);
      }
      if (process.env.NODE_ENV !== 'production') {
        const result = isSelect ? { rowCount: rows.length } : { changes: this.changes, lastID: this.lastID };
        console.log('SQL', { text, ms: Date.now() - start, ...result });
      }
      // The `all` method returns the rows, `run` does not, but we can resolve with the result object.
      resolve({
        rows: rows || [],
        rowCount: rows ? rows.length : this.changes,
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });
}

module.exports = { db, query };
