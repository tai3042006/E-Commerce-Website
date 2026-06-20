import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import { getPool } from './db.js';
import productsRouter      from './routes/products.js';
import customersRouter     from './routes/customers.js';
import ordersRouter        from './routes/orders.js';
import authRouter          from './routes/auth.js';
import notificationsRouter from './routes/notifications.js';

const app  = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api',               productsRouter);
app.use('/api',               customersRouter);
app.use('/api',               ordersRouter);
app.use('/api/auth',          authRouter);
app.use('/api/notifications', notificationsRouter);

app.use((err, _req, res, _next) => {
  console.error('[server] error:', err.message);
  res.status(500).json({ error: err.message ?? 'internal_error' });
});

function simpleHash(plain) {
  let h = 0x811c9dc5;
  for (let i = 0; i < plain.length; i++) {
    h ^= plain.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0') + plain.length.toString(16);
}

async function columnExists(pool, table, column) {
  const [[row]] = await pool.query(`
    SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?
  `, [table, column]);
  return Number(row.cnt) > 0;
}

async function ensureColumn(pool, table, column, definition) {
  if (!(await columnExists(pool, table, column))) {
    await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`[bootstrap] ✓ Added column ${table}.${column}`);
  }
}

async function bootstrap() {
  try {
    const pool = await getPool();

    // 1. users.role — add if missing, always enforce VARCHAR(20)
    if (!(await columnExists(pool, 'users', 'role'))) {
      await pool.query(
        "ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'customer' AFTER password"
      );
      console.log('[bootstrap] ✓ Added role column');
    } else {
      await pool.query(
        "ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL DEFAULT 'customer'"
      );
      console.log('[bootstrap] ✓ role column type enforced VARCHAR(20)');
    }

    // 2. notifications table — drop & recreate if it has wrong schema (e.g. old `type` column)
    const hasAudience = await columnExists(pool, 'notifications', 'audience');
    const hasType     = await columnExists(pool, 'notifications', 'type');

    if (hasType) {
      // Old schema from Java/Spring (has `type` column) — drop and recreate regardless of audience presence.
      // This fixes "Field 'type' doesn't have a default value" errors on INSERT because old code
      // still has NOT NULL without a DEFAULT on `type`. Always start clean when `type` exists.
      console.log('[bootstrap] Detected old notifications schema (has `type` column) — recreating…');
      await pool.query('DROP TABLE IF EXISTS notifications');
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id         VARCHAR(50)  NOT NULL,
        audience   VARCHAR(20)  NOT NULL,
        user_id    VARCHAR(50)  NULL,
        event      VARCHAR(50)  NOT NULL,
        message    VARCHAR(500) NOT NULL,
        link       VARCHAR(300) NULL,
        is_read    TINYINT(1)   NOT NULL DEFAULT 0,
        created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_notif_audience (audience),
        KEY idx_notif_user (user_id)
      ) ENGINE=InnoDB
    `);

    // Patch any remaining missing columns in case of partial old schema
    await ensureColumn(pool, 'notifications', 'audience',   "VARCHAR(20) NOT NULL DEFAULT 'customer' AFTER id");
    await ensureColumn(pool, 'notifications', 'user_id',    'VARCHAR(50) NULL AFTER audience');
    await ensureColumn(pool, 'notifications', 'event',      "VARCHAR(50) NOT NULL DEFAULT '' AFTER user_id");
    await ensureColumn(pool, 'notifications', 'message',    "VARCHAR(500) NOT NULL DEFAULT '' AFTER event");
    await ensureColumn(pool, 'notifications', 'link',       'VARCHAR(300) NULL AFTER message');
    await ensureColumn(pool, 'notifications', 'is_read',    'TINYINT(1) NOT NULL DEFAULT 0 AFTER link');
    await ensureColumn(pool, 'notifications', 'created_at', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER is_read');

    console.log('[bootstrap] ✓ notifications table ready');

    // 3. Admin user
    const adminHash = simpleHash('admin123');
    const [[adminRow]] = await pool.query(
      "SELECT id FROM users WHERE email = 'admin@clofit.com' LIMIT 1"
    );
    if (adminRow) {
      await pool.query(
        "UPDATE users SET password = ?, role = 'admin' WHERE email = 'admin@clofit.com'",
        [adminHash]
      );
      console.log('[bootstrap] ✓ Admin password synced (admin@clofit.com / admin123)');
    } else {
      await pool.query(
        "INSERT INTO users (id, name, email, phone, password, role) VALUES (?, 'Site Admin', 'admin@clofit.com', NULL, ?, 'admin')",
        [randomUUID(), adminHash]
      );
      console.log('[bootstrap] ✓ Admin user created (admin@clofit.com / admin123)');
    }

    // 4. Seed products if DB is empty
    const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM products');
    if (Number(count) === 0) {
      console.log('[bootstrap] Empty DB — seeding products…');
      const { default: seed } = await import('./seedRunner.js');
      await seed(pool);
    }

    console.log('[bootstrap] Ready.');
  } catch (err) {
    console.warn('[bootstrap] Error (non-fatal):', err.message);
  }
}

app.listen(PORT, () => {
  console.log(`[server] CloFit API → http://localhost:${PORT}`);
  bootstrap();
});
