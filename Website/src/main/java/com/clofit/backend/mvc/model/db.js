// MySQL connection pool + schema bootstrap.
//
// On startup we:
//   1. Connect WITHOUT a database name and create the `clofit` database if missing
//   2. Reconnect with the database selected.
//   3. Run `schema.sql` — every statement uses IF NOT EXISTS so it's safe to repeat.

import 'dotenv/config';
import mysql from 'mysql2/promise';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cfg = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clofit',
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
};

/** Bootstrap database + schema. Returns a connected pool. */
export async function initDb() {
  // 1. Make sure the database itself exists. Connect without a default DB.
  if (process.env.AUTO_CREATE_DB !== 'false') {
    const root = await mysql.createConnection({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      multipleStatements: true,
    });
    await root.query(
      `CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await root.end();
  }

  // 2. Pool with the database selected.
  const pool = mysql.createPool(cfg);

  // 3. Apply schema.
  const sql = await readFile(join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);

  return pool;
}

/** Lazily-created shared pool. Initialised once on first request. */
let _pool = null;
let _initPromise = null;

export async function getPool() {
  if (_pool) return _pool;
  // Prevent concurrent initialisations
  if (!_initPromise) {
    _initPromise = initDb()
      .then((pool) => {
        _pool = pool;
        return pool;
      })
      .catch((err) => {
        _initPromise = null; // allow retry on next request
        throw err;
      });
  }
  return _initPromise;
}
