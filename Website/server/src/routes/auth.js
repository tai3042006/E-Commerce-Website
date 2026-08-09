import { Router } from 'express';
import { randomUUID, randomBytes, createHash } from 'node:crypto';
import { getPool } from '../db.js';
import bcrypt from 'bcrypt';

const router = Router();

// Simple hash function (same as before) - for verifying legacy hashes only
function simpleHash(plain) {
  let h = 0x811c9dc5;
  for (let i = 0; i < plain.length; i++) {
    h ^= plain.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0') + plain.length.toString(16);
}

// Verify password against stored hash (supports both simpleHash and bcrypt)
async function verifyPassword(plain, stored) {
  if (stored.startsWith('$2b$') || stored.startsWith('$2a$') || stored.startsWith('$2y$')) {
    return await bcrypt.compare(plain, stored);
  }
  // Assume it's a legacy simpleHash
  return simpleHash(plain) === stored;
}

// ── DB-backed sessions (survive server restarts) ───────────────────────────────

async function ensureSessionsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token      VARCHAR(50)  NOT NULL,
      user_id    VARCHAR(50)  NOT NULL,
      role       VARCHAR(20)  NOT NULL DEFAULT 'customer',
      created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (token),
      KEY idx_sess_user (user_id)
    ) ENGINE=InnoDB
  `);
}

async function createSession(userId, role) {
  const token = randomUUID();
  const pool = await getPool();
  await ensureSessionsTable(pool);
  await pool.query(
    'INSERT INTO sessions (token, user_id, role) VALUES (?, ?, ?)',
    [token, userId, role]
  );
  return token;
}

async function getSession(token) {
  if (!token) return null;
  try {
    const pool = await getPool();
    await ensureSessionsTable(pool);
    const [[row]] = await pool.query(
      'SELECT user_id, role FROM sessions WHERE token = ?', [token]
    );
    return row ? { userId: row.user_id, role: row.role } : null;
  } catch {
    return null;
  }
}

async function deleteSession(token) {
  if (!token) return;
  try {
    const pool = await getPool();
    await pool.query('DELETE FROM sessions WHERE token = ?', [token]);
  } catch {}
}

// ── Password reset tokens ───────────────────────────────────────────────────
// The token itself is only ever shown to the requester once (link / dev log);
// only its SHA-256 hash is stored, so a DB leak alone can't be used to reset
// an account's password.

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

async function ensurePasswordResetsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      token_hash CHAR(64)     NOT NULL,
      user_id    VARCHAR(50)  NOT NULL,
      expires_at DATETIME     NOT NULL,
      used       TINYINT(1)   NOT NULL DEFAULT 0,
      created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (token_hash),
      KEY idx_reset_user (user_id)
    ) ENGINE=InnoDB
  `);
}

const hashResetToken = (token) => createHash('sha256').update(token).digest('hex');

export async function requireAuth(req, res, next) {
  const token = req.headers['x-auth-token'];
  const session = await getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  req.userId = session.userId;
  req.userRole = session.role;
  next();
}

export async function requireAdmin(req, res, next) {
  const token = req.headers['x-auth-token'];
  const session = await getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  if (session.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' });
  }
  req.userId = session.userId;
  req.userRole = session.role;
  next();
}

/**
 * Safe notification insert — silently skips if notifications table
 * has a bad schema (e.g. old `type` column not yet migrated).
 * Registration should never fail because of a notification side-effect.
 */
async function createNotification(pool, { audience, userId = null, event, message, link = null }) {
  try {
    const id = randomUUID();
    await pool.query(
      `INSERT INTO notifications (id, audience, user_id, event, message, link)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, audience, userId, event, message, link]
    );
    return id;
  } catch (err) {
    // Log but do NOT propagate — a bad notifications schema must not
    // break register / login for the user.
    console.warn('[auth] createNotification skipped:', err.message);
    return null;
  }
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    const pool = await getPool();

    const [[existing]] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ error: 'email_taken' });
    }

    const id = randomUUID();
    const hashed = await bcrypt.hash(password, 10);
    const role = 'customer';

    await pool.query(
      'INSERT INTO users (id, name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email, phone ?? null, hashed, role]
    );

    // Sync to customers table (admin panel) — ignore if already exists
    const [[custExist]] = await pool.query('SELECT id FROM customers WHERE email = ?', [email]);
    if (!custExist) {
      try {
        await pool.query(
          `INSERT INTO customers (id, name, email, joined_at, orders_count, spent, location)
           VALUES (?, ?, ?, NOW(), 0, 0.00, NULL)`,
          [id, name, email]
        );
      } catch (custErr) {
        console.warn('[auth] customers insert skipped:', custErr.message);
      }
    }

    // Non-critical: notify admins
    await createNotification(pool, {
      audience: 'admin',
      event: 'userRegistered',
      message: `New user registered: ${name} (${email})`,
      link: '/admin/customers',
    });

    const token = await createSession(id, role);
    res.status(201).json({ token, user: { id, name, email, role } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const pool = await getPool();
    const [[user]] = await pool.query(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [email]
    );
    if (!user) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }
    // If the stored password is not bcrypt, upgrade it to bcrypt
    if (!(user.password.startsWith('$2b$') || user.password.startsWith('$2a$') || user.password.startsWith('$2y$'))) {
      const newHash = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [newHash, user.id]
      );
      console.log('[auth] Upgraded password to bcrypt for user:', user.email);
    }
    const token = await createSession(user.id, user.role);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }
    const pool = await getPool();
    await ensurePasswordResetsTable(pool);

    const [[user]] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

    // Always respond the same way whether or not the email exists, so this
    // endpoint can't be used to enumerate which emails are registered.
    if (user) {
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await pool.query(
        'INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)',
        [hashResetToken(token), user.id, expiresAt]
      );
      // No email service is configured for this project — log the reset link
      // so it can be used during development/testing instead of being lost.
      console.log(`[auth] Password reset link for ${email}: /reset-password?token=${token}`);
    }

    res.json({ ok: true, message: 'If the email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'token and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }

    const pool = await getPool();
    await ensurePasswordResetsTable(pool);

    const tokenHash = hashResetToken(token);
    const [[reset]] = await pool.query(
      'SELECT user_id, expires_at, used FROM password_resets WHERE token_hash = ?',
      [tokenHash]
    );

    if (!reset || reset.used || new Date(reset.expires_at) < new Date()) {
      return res.status(400).json({ error: 'invalid_or_expired_token' });
    }

    const newHash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [newHash, reset.user_id]);
    await pool.query('UPDATE password_resets SET used = 1 WHERE token_hash = ?', [tokenHash]);

    // Invalidate existing sessions so a stolen-but-now-reset account is logged out.
    await ensureSessionsTable(pool);
    await pool.query('DELETE FROM sessions WHERE user_id = ?', [reset.user_id]);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const [[user]] = await pool.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.userId]
    );
    if (!user) return res.status(404).json({ error: 'not_found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (token) await deleteSession(token);
  res.json({ ok: true });
});

export default router;