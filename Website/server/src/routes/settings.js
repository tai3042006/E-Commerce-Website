// PATCH   /api/settings/profile   — update name, email, phone
// PATCH   /api/settings/password  — change password (requires old password)

import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { getPool } from '../db.js';
import { requireAuth } from './auth.js';
import bcrypt from 'bcrypt';

const router = Router();

function getUserId(req) {
  return req.userId;
}

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

// Update profile
router.patch('/profile', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const { name, email, phone } = req.body;
    // At least one field must be provided
    if (name === undefined && email === undefined && phone === undefined) {
      return res.status(400).json({ error: 'At least one of name, email, phone must be provided' });
    }
    // Build update dynamically
    const updates = [];
    const values = [];
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      // Check email uniqueness (excluding current user)
      const [[{ count }]] = await pool.query(
        'SELECT COUNT(*) AS count FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      if (count > 0) {
        return res.status(409).json({ error: 'email_taken' });
      }
      updates.push('email = ?');
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone ?? null);
    }
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    values.push(userId);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await pool.query(query, values);
    // Fetch updated user (excluding password)
    const [[user]] = await pool.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [userId]
    );
    if (!user) {
      return res.status(404).json({ error: 'not_found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Change password
router.patch('/password', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const userId = getUserId(req);
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
      return res.status(400).json({ error: 'old_password and new_password are required' });
    }
    // Fetch current user with password hash
    const [[user]] = await pool.query(
      'SELECT id, password FROM users WHERE id = ?',
      [userId]
    );
    if (!user) {
      return res.status(404).json({ error: 'not_found' });
    }
    // Verify old password
    const valid = await verifyPassword(old_password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'invalid_old_password' });
    }
    // Validate new password (basic)
    if (new_password.length < 6) {
      return res.status(400).json({ error: 'new_password must be at least 6 characters' });
    }
    // Hash new password
    const newHash = await bcrypt.hash(new_password, 10);
    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [newHash, userId]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;