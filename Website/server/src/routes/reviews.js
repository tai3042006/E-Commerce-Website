// GET    /api/products/:id/reviews        — list reviews for a product (public)
// POST   /api/products/:id/reviews        — create/update the caller's review [requireAuth]
// DELETE /api/products/:id/reviews/:rid   — delete a review (owner or admin) [requireAuth]

import { Router }      from 'express';
import { randomUUID }  from 'node:crypto';
import { getPool }     from '../db.js';
import { requireAuth } from './auth.js';

const router = Router();

// Recompute and persist the aggregate rating/reviews count on the product row.
async function recomputeProductRating(pool, productId) {
  const [[agg]] = await pool.query(
    `SELECT COALESCE(AVG(rating), 0) AS avgRating, COUNT(*) AS cnt
       FROM product_reviews WHERE product_id = ?`,
    [productId]
  );
  await pool.query(
    'UPDATE products SET rating = ?, reviews = ? WHERE id = ?',
    [Number(agg.avgRating).toFixed(1), agg.cnt, productId]
  );
  return { rating: Number(Number(agg.avgRating).toFixed(1)), reviews: Number(agg.cnt) };
}

function shapeReview(r, viewerId) {
  return {
    id:          r.id,
    productId:   r.product_id,
    rating:      r.rating,
    comment:     r.comment ?? '',
    anonymous:   r.is_anonymous === 1,
    authorName:  r.is_anonymous === 1 ? 'Anonymous' : r.user_name,
    createdAt:   r.created_at,
    updatedAt:   r.updated_at,
    isOwn:       viewerId ? r.user_id === viewerId : false,
  };
}

// ── Public: list reviews ──────────────────────────────────────────────────────

router.get('/products/:id/reviews', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT pr.*, u.name AS user_name
         FROM product_reviews pr
         JOIN users u ON u.id = pr.user_id
        WHERE pr.product_id = ?
        ORDER BY pr.created_at DESC`,
      [req.params.id]
    );

    // Optional viewer context (so the frontend can show "edit/delete" on their own review)
    let viewerId = null;
    const token = req.headers['x-auth-token'];
    if (token) {
      const [[session]] = await pool.query('SELECT user_id FROM sessions WHERE token = ?', [token]);
      if (session) viewerId = session.user_id;
    }

    res.json(rows.map(r => shapeReview(r, viewerId)));
  } catch (err) { next(err); }
});

// ── Auth: create or update own review (one review per user per product) ──────

router.post('/products/:id/reviews', requireAuth, async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { rating, comment = '', anonymous = false } = req.body;

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'rating must be an integer from 1 to 5' });
    }

    const pool = await getPool();

    const [[product]] = await pool.query('SELECT id FROM products WHERE id = ?', [productId]);
    if (!product) return res.status(404).json({ error: 'not_found' });

    const [[existing]] = await pool.query(
      'SELECT id FROM product_reviews WHERE product_id = ? AND user_id = ?',
      [productId, req.userId]
    );

    if (existing) {
      await pool.query(
        'UPDATE product_reviews SET rating = ?, comment = ?, is_anonymous = ? WHERE id = ?',
        [ratingNum, comment || null, anonymous ? 1 : 0, existing.id]
      );
    } else {
      await pool.query(
        `INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_anonymous)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [randomUUID(), productId, req.userId, ratingNum, comment || null, anonymous ? 1 : 0]
      );
    }

    const aggregate = await recomputeProductRating(pool, productId);

    const [[row]] = await pool.query(
      `SELECT pr.*, u.name AS user_name FROM product_reviews pr
         JOIN users u ON u.id = pr.user_id
        WHERE pr.product_id = ? AND pr.user_id = ?`,
      [productId, req.userId]
    );

    res.status(existing ? 200 : 201).json({
      review: shapeReview(row, req.userId),
      product: aggregate,
    });
  } catch (err) { next(err); }
});

// ── Auth: delete a review (owner or admin) ────────────────────────────────────

router.delete('/products/:id/reviews/:reviewId', requireAuth, async (req, res, next) => {
  try {
    const { id: productId, reviewId } = req.params;
    const pool = await getPool();

    const [[row]] = await pool.query(
      'SELECT id, user_id FROM product_reviews WHERE id = ? AND product_id = ?',
      [reviewId, productId]
    );
    if (!row) return res.status(404).json({ error: 'not_found' });

    if (row.user_id !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'forbidden' });
    }

    await pool.query('DELETE FROM product_reviews WHERE id = ?', [reviewId]);
    const aggregate = await recomputeProductRating(pool, productId);

    res.json({ ok: true, product: aggregate });
  } catch (err) { next(err); }
});

export default router;
