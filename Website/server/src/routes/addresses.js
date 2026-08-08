// GET    /api/addresses          — list for logged-in user
// GET    /api/addresses/:id      — single address
// POST   /api/addresses          — create new address
// PUT    /api/addresses/:id      -- update address
// DELETE /api/addresses/:id      -- delete address
// PATCH  /api/addresses/:id/default — set as default

import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { getPool } from '../db.js';
import { requireAuth } from './auth.js';

const router = Router();

// Helper to get user ID from request (set by requireAuth)
function getUserId(req) {
  return req.userId;
}

// List addresses for the user
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const [rows] = await pool.query(
      'SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Get single address
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const [rows] = await pool.query(
      'SELECT * FROM addresses WHERE id = ? AND customer_id = ?',
      [req.params.id, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'not_found' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Create address
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const { full_name, phone, address_line, city, is_default = false } = req.body;
    if (!full_name || !phone || !address_line || !city) {
      return res.status(400).json({ error: 'full_name, phone, address_line, city are required' });
    }
    const id = randomUUID();
    // If setting as default, first unset any existing default for this user
    if (is_default) {
      await pool.query(
        'UPDATE addresses SET is_default = 0 WHERE customer_id = ?',
        [userId]
      );
    }
    await pool.query(
      'INSERT INTO addresses (id, customer_id, full_name, phone, address_line, city, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, userId, full_name, phone, address_line, city, is_default ? 1 : 0]
    );
    const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Update address
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const { full_name, phone, address_line, city, is_default } = req.body;
    if (!full_name || !phone || !address_line || !city) {
      return res.status(400).json({ error: 'full_name, phone, address_line, city are required' });
    }
    // Ensure address belongs to user
    const [[existing]] = await pool.query(
      'SELECT id FROM addresses WHERE id = ? AND customer_id = ?',
      [req.params.id, userId]
    );
    if (!existing) {
      return res.status(404).json({ error: 'not_found' });
    }
    // If setting as default, unset other defaults
    if (is_default) {
      await pool.query(
        'UPDATE addresses SET is_default = 0 WHERE customer_id = ?',
        [userId]
      );
    }
    await pool.query(
      'UPDATE addresses SET full_name = ?, phone = ?, address_line = ?, city = ?, is_default = ? WHERE id = ? AND customer_id = ?',
      [full_name, phone, address_line, city, is_default ? 1 : 0, req.params.id, userId]
    );
    const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Delete address
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const [[result]] = await pool.query(
      'DELETE FROM addresses WHERE id = ? AND customer_id = ?',
      [req.params.id, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'not_found' });
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Set address as default
router.patch('/:id/default', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    // Ensure address belongs to user
    const [[existing]] = await pool.query(
      'SELECT id FROM addresses WHERE id = ? AND customer_id = ?',
      [req.params.id, userId]
    );
    if (!existing) {
      return res.status(404).json({ error: 'not_found' });
    }
    // Unset all defaults for user
    await pool.query(
      'UPDATE addresses SET is_default = 0 WHERE customer_id = ?',
      [userId]
    );
    // Set this address as default
    await pool.query(
      'UPDATE addresses SET is_default = 1 WHERE id = ? AND customer_id = ?',
      [req.params.id, userId]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
