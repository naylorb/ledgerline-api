const Database = require('better-sqlite3');

const db = new Database(process.env.DB_PATH || 'ledgerline.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT DEFAULT 'member',
    org_id INTEGER
  );
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY,
    org_id INTEGER,
    customer TEXT,
    total_cents INTEGER,
    refunded_cents INTEGER DEFAULT 0,
    status TEXT
  );
`);

module.exports = db;
