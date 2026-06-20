// GET /api/customers — list all customers (admin panel)

import { Router } from 'express';
import { getPool } from '../db.js';

const router = Router();

router.get('/customers', async (_req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      'SELECT id, name, email, joined_at, orders_count, spent, location FROM customers ORDER BY joined_at DESC'
    );
    res.json(rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      joined: r.joined_at,
      orders: r.orders_count,
      spent: Number(r.spent),
      location: r.location,
    })));
  } catch (err) {
    next(err);
  }
});

export default router;
