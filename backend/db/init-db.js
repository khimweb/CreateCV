const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '..', '..', 'database', 'cv-creator.db');
const schemaPath = path.resolve(__dirname, '..', '..', 'database', 'schema.sql');

// Ensure the database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Delete the old database file if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed old database file.');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error('Error creating database', err.message);
  }
  console.log('Connected to the SQLite database for initialization.');

  fs.readFile(schemaPath, 'utf8', (err, sql) => {
    if (err) {
      return console.error('Error reading schema.sql:', err.message);
    }

    db.exec(sql, (err) => {
      if (err) {
        return console.error('Error executing schema:', err.message);
      }
      console.log('Database schema created successfully.');
      db.close(() => {
        console.log('Database connection closed.');
      });
    });
  });
});
