// GET    /api/payment-methods          — list for logged-in user (masked)
// GET    /api/payment-methods/:id      — single payment method
// POST   /api/payment-methods          — create new payment method (mock)
// PUT    /api/payment-methods/:id      -- update
// DELETE /api/payment-methods/:id      -- delete
// PATCH  /api/payment-methods/:id/default — set as default

import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { getPool } from '../db.js';
import { requireAuth } from './auth.js';

const router = Router();

function getUserId(req) {
  return req.userId;
}

// Helper to mask card number
function maskCard(brand, last4) {
  // Return masked format: "**** **** **** 1234"
  return `**** **** **** ${last4}`;
}

// List payment methods
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const [rows] = await pool.query(
      'SELECT * FROM payment_methods WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    // Mask the card number in response (we don't store full number anyway)
    const masked = rows.map(row => ({
      ...row,
      last4: row.last4, // already only last4
      // we can add a masked field for convenience
      masked: `**** **** **** ${row.last4}`
    }));
    res.json(masked);
  } catch (err) {
    next(err);
  }
});

// Get single payment method
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const [rows] = await pool.query(
      'SELECT * FROM payment_methods WHERE id = ? AND customer_id = ?',
      [req.params.id, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'not_found' });
    }
    const row = rows[0];
    res.json({
      ...row,
      masked: `**** **** **** ${row.last4}`
    });
  } catch (err) {
    next(err);
  }
});

// Create payment method (mock)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const { card_brand, last4, expiry_month, expiry_year, is_default = false } = req.body;
    // Basic validation
    if (!card_brand || !last4 || !expiry_month || !expiry_year) {
      return res.status(400).json({ error: 'card_brand, last4, expiry_month, expiry_year are required' });
    }
    if (last4.length !== 4 || !/^\d{4}$/.test(last4)) {
      return res.status(400).json({ error: 'last4 must be 4 digits' });
    }
    if (expiry_month < 1 || expiry_month > 12) {
      return res.status(400).json({ error: 'expiry_month must be 1-12' });
    }
    const year = new Date().getFullYear();
    if (expiry_year < year) {
      return res.status(400).json({ error: 'expiry_year must be in the future' });
    }
    const id = randomUUID();
    // If setting as default, unset existing default
    if (is_default) {
      await pool.query(
        'UPDATE payment_methods SET is_default = 0 WHERE customer_id = ?',
        [userId]
      );
    }
    await pool.query(
      'INSERT INTO payment_methods (id, customer_id, card_brand, last4, expiry_month, expiry_year, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, userId, card_brand, last4, expiry_month, expiry_year, is_default ? 1 : 0]
    );
    const [rows] = await pool.query('SELECT * FROM payment_methods WHERE id = ?', [id]);
    const row = rows[0];
    res.status(201).json({
      ...row,
      masked: `**** **** **** ${row.last4}`
    });
  } catch (err) {
    next(err);
  }
});

// Update payment method
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const { card_brand, last4, expiry_month, expiry_year, is_default } = req.body;
    if (!card_brand || !last4 || !expiry_month || !expiry_year) {
      return res.status(400).json({ error: 'card_brand, last4, expiry_month, expiry_year are required' });
    }
    // Validate
    if (last4.length !== 4 || !/^\d{4}$/.test(last4)) {
      return res.status(400).json({ error: 'last4 must be 4 digits' });
    }
    if (expiry_month < 1 || expiry_month > 12) {
      return res.status(400).json({ error: 'expiry_month must be 1-12' });
    }
    const year = new Date().getFullYear();
    if (expiry_year < year) {
      return res.status(400).json({ error: 'expiry_year must be in the future' });
    }
    // Ensure ownership
    const [[existing]] = await pool.query(
      'SELECT id FROM payment_methods WHERE id = ? AND customer_id = ?',
      [req.params.id, userId]
    );
    if (!existing) {
      return res.status(404).json({ error: 'not_found' });
    }
    // If setting as default, unset other defaults
    if (is_default) {
      await pool.query(
        'UPDATE payment_methods SET is_default = 0 WHERE customer_id = ?',
        [userId]
      );
    }
    await pool.query(
      'UPDATE payment_methods SET card_brand = ?, last4 = ?, expiry_month = ?, expiry_year = ?, is_default = ? WHERE id = ? AND customer_id = ?',
      [card_brand, last4, expiry_month, expiry_year, is_default ? 1 : 0, req.params.id, userId]
    );
    const [rows] = await pool.query('SELECT * FROM payment_methods WHERE id = ?', [req.params.id]);
    const row = rows[0];
    res.json({
      ...row,
      masked: `**** **** **** ${row.last4}`
    });
  } catch (err) {
    next(err);
  }
});

// Delete payment method
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const [[result]] = await pool.query(
      'DELETE FROM payment_methods WHERE id = ? AND customer_id = ?',
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

// Set as default
router.patch('/:id/default', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    // Ensure ownership
    const [[existing]] = await pool.query(
      'SELECT id FROM payment_methods WHERE id = ? AND customer_id = ?',
      [req.params.id, userId]
    );
    if (!existing) {
      return res.status(404).json({ error: 'not_found' });
    }
    // Unset all defaults for user
    await pool.query(
      'UPDATE payment_methods SET is_default = 0 WHERE customer_id = ?',
      [userId]
    );
    // Set this as default
    await pool.query(
      'UPDATE payment_methods SET is_default = 1 WHERE id = ? AND customer_id = ?',
      [req.params.id, userId]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
