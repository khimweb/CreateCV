/**
 * Creates a default admin user.
 * Run once on the server: node create-admin.js
 */
require('dotenv').config();
const db = require('./db');

async function createAdmin() {
  const email = 'admin@cv-builder.store';
  const existing = await db.users.findByEmail(email);
  
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  const user = await db.users.create({
    fullName: 'Admin',
    email,
    password: 'Admin@2024!',
  });

  // Set role to admin
  const { query } = require('./db/pool');
  await query('UPDATE users SET role = ? WHERE id = ?', ['admin', user.id]);

  console.log('✓ Admin user created!');
  console.log('  Email:    admin@cv-builder.store');
  console.log('  Password: Admin@2024!');
  console.log('');
  console.log('Login at: http://149.28.139.250/login');
  console.log('Then go to: http://149.28.139.250/admin');
  process.exit(0);
}

createAdmin().catch(err => { console.error(err); process.exit(1); });
