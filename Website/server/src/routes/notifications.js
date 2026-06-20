/**
 * Notifications API — the HTTP face of the Observer pattern notification inbox.
 *
 * GET  /api/notifications        — list notifications for the caller
 * GET  /api/notifications/count  — unread count (used for the bell badge)
 * PATCH /api/notifications/read  — mark all as read
 * PATCH /api/notifications/:id/read — mark one as read
 *
 * Admin sees notifications with audience='admin'.
 * Customers see notifications with audience='customer' OR audience='user' + user_id=me.
 */

import { Router } from 'express';
import { getPool } from '../db.js';
import { requireAuth } from './auth.js';

const router = Router();

// All notification routes require login
router.use(requireAuth);

function audienceClause(role, userId) {
  if (role === 'admin') {
    return {
      sql: "audience = 'admin'",
      args: [],
    };
  }
  // Customer sees broadcast customer notifications + personal ones
  return {
    sql: "(audience = 'customer' OR (audience = 'user' AND user_id = ?))",
    args: [userId],
  };
}

// GET /api/notifications?limit=20&offset=0
router.get('/', async (req, res, next) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit  ?? '20', 10), 100);
    const offset = parseInt(req.query.offset ?? '0',  10);

    const { sql, args } = audienceClause(req.userRole, req.userId);
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT id, audience, event, message, link, is_read, created_at
       FROM   notifications
       WHERE  ${sql}
       ORDER  BY created_at DESC
       LIMIT  ? OFFSET ?`,
      [...args, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM notifications WHERE ${sql}`,
      args
    );

    res.json({
      items: rows.map((r) => ({
        id:        r.id,
        event:     r.event,
        message:   r.message,
        link:      r.link,
        isRead:    r.is_read === 1,
        createdAt: r.created_at,
      })),
      total: Number(total),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/notifications/count  — unread count for the bell badge
router.get('/count', async (req, res, next) => {
  try {
    const { sql, args } = audienceClause(req.userRole, req.userId);
    const pool = await getPool();
    const [[{ unread }]] = await pool.query(
      `SELECT COUNT(*) AS unread
       FROM   notifications
       WHERE  ${sql} AND is_read = 0`,
      args
    );
    res.json({ unread: Number(unread) });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/notifications/read  — mark ALL unread as read for this user/role
router.patch('/read', async (req, res, next) => {
  try {
    const { sql, args } = audienceClause(req.userRole, req.userId);
    const pool = await getPool();
    await pool.query(
      `UPDATE notifications SET is_read = 1
       WHERE  ${sql} AND is_read = 0`,
      args
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/notifications/:id/read  — mark ONE as read
router.patch('/:id/read', async (req, res, next) => {
  try {
    const pool = await getPool();
    await pool.query(
      `UPDATE notifications SET is_read = 1 WHERE id = ?`,
      [req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
