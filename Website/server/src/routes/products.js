// GET    /api/products          — list (filterable: ?gender=&category=&badge=)
// GET    /api/products/:id      — single product
// GET    /api/categories        — category list
// POST   /api/admin/products    — admin: add product  [requireAdmin]
// DELETE /api/admin/products/:id — admin: delete product [requireAdmin]

import { Router }     from 'express';
import { randomUUID } from 'node:crypto';
import { getPool }    from '../db.js';
import { requireAdmin } from './auth.js';

const router = Router();

// ── Hydrate rows with images / colors / sizes ─────────────────────────────────
async function hydrate(conn, rows) {
  if (!rows.length) return [];
  const ids = rows.map(r => r.id);

  const [images] = await conn.query(
    'SELECT product_id, url FROM product_images WHERE product_id IN (?) ORDER BY product_id, sort_order',
    [ids]
  );
  const [colors] = await conn.query(
    'SELECT product_id, hex FROM product_colors WHERE product_id IN (?)', [ids]
  );
  const [sizes] = await conn.query(
    'SELECT product_id, size FROM product_sizes WHERE product_id IN (?)', [ids]
  );

  const imgMap   = {};
  const colorMap = {};
  const sizeMap  = {};
  for (const i of images)  (imgMap[i.product_id]   ??= []).push(i.url);
  for (const c of colors)  (colorMap[c.product_id] ??= []).push(c.hex);
  for (const s of sizes)   (sizeMap[s.product_id]  ??= []).push(s.size);

  return rows.map(r => ({
    id:          r.id,
    name:        r.name,
    tagline:     r.tagline     ?? undefined,
    description: r.description ?? undefined,
    price:       Number(r.price),
    oldPrice:    r.old_price != null ? Number(r.old_price) : undefined,
    image:       r.image       ?? undefined,
    hoverImage:  r.hover_image ?? undefined,
    gallery:     imgMap[r.id]   ?? [],
    category:    r.category_id,
    gender:      r.gender,
    rating:      Number(r.rating),
    reviews:     r.reviews,
    badge:       r.badge       ?? undefined,
    inStock:     r.in_stock === 1,
    colors:      colorMap[r.id] ?? [],
    sizes:       sizeMap[r.id]  ?? [],
  }));
}

// ── Public ────────────────────────────────────────────────────────────────────

router.get('/products', async (req, res, next) => {
  try {
    const { gender, category, badge } = req.query;
    const where = [];
    const args  = [];
    if (gender)   { where.push('gender = ?');      args.push(gender); }
    if (category) { where.push('category_id = ?'); args.push(category); }
    if (badge)    { where.push('badge = ?');       args.push(badge); }

    const pool = await getPool();
    const [rows] = await pool.query(
      'SELECT * FROM products' + (where.length ? ' WHERE ' + where.join(' AND ') : '') + ' ORDER BY created_at ASC',
      args
    );
    res.json(await hydrate(pool, rows));
  } catch (err) { next(err); }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'not_found' });
    res.json((await hydrate(pool, rows))[0]);
  } catch (err) { next(err); }
});

// Return only real categories (exclude 'all' which is a UI-only filter)
router.get('/categories', async (_req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      "SELECT id, label FROM categories WHERE id != 'all' ORDER BY label"
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// ── Admin: add product ────────────────────────────────────────────────────────

router.post('/admin/products', requireAdmin, async (req, res, next) => {
  try {
    const {
      name, price, category_id,
      gender = 'unisex', tagline = null, description = null,
      image = null, hover_image = null, badge = null,
      in_stock = 1, old_price = null,
      sizes = [], colors = [],
    } = req.body;

    if (!name || price == null || !category_id) {
      return res.status(400).json({ error: 'name, price and category_id are required' });
    }

    // Guard: 'all' is a UI-only filter, not a real category
    if (category_id === 'all') {
      return res.status(400).json({ error: 'Please select a specific category (not "All")' });
    }

    const pool = await getPool();

    // Validate category exists in DB
    const [[cat]] = await pool.query('SELECT id FROM categories WHERE id = ?', [category_id]);
    if (!cat) {
      return res.status(400).json({ error: `Category "${category_id}" not found` });
    }

    const id = randomUUID();

    await pool.query(
      `INSERT INTO products
         (id, name, tagline, description, price, old_price, image, hover_image,
          category_id, gender, badge, in_stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, tagline, description, Number(price), old_price,
       image, hover_image, category_id, gender, badge, in_stock ? 1 : 0]
    );

    for (const sz of sizes) {
      await pool.query(
        'INSERT INTO product_sizes (product_id, size) VALUES (?, ?)', [id, sz]
      );
    }
    for (const hex of colors) {
      await pool.query(
        'INSERT INTO product_colors (product_id, hex) VALUES (?, ?)', [id, hex]
      );
    }

    // Observer: notify customers — non-critical, never blocks product creation
    try {
      await pool.query(
        `INSERT INTO notifications (id, audience, user_id, event, message, link)
         VALUES (?, 'customer', NULL, 'productAdded', ?, ?)`,
        [randomUUID(), `New product available: ${name}`, `/product/${id}`]
      );
    } catch (notifErr) {
      console.warn('[products] notification skipped:', notifErr.message);
    }

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.status(201).json((await hydrate(pool, rows))[0]);
  } catch (err) { next(err); }
});

// ── Admin: update product ─────────────────────────────────────────────────────

router.put('/admin/products/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const [[existing]] = await pool.query('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'not_found' });

    const {
      name, price, category_id,
      gender = 'unisex', tagline = null, description = null,
      image = null, hover_image = null, badge = null,
      in_stock = 1, old_price = null,
      sizes = [], colors = [],
    } = req.body;

    if (!name || price == null || !category_id) {
      return res.status(400).json({ error: 'name, price and category_id are required' });
    }
    if (category_id === 'all') {
      return res.status(400).json({ error: 'Please select a specific category (not "All")' });
    }

    const [[cat]] = await pool.query('SELECT id FROM categories WHERE id = ?', [category_id]);
    if (!cat) {
      return res.status(400).json({ error: `Category "${category_id}" not found` });
    }

    await pool.query(
      `UPDATE products
          SET name = ?, tagline = ?, description = ?, price = ?, old_price = ?,
              image = ?, hover_image = ?, category_id = ?, gender = ?, badge = ?, in_stock = ?
        WHERE id = ?`,
      [name, tagline, description, Number(price), old_price,
       image, hover_image, category_id, gender, badge, in_stock ? 1 : 0, id]
    );

    // Replace sizes/colors wholesale — simplest way to keep them in sync with the form
    await pool.query('DELETE FROM product_sizes WHERE product_id = ?', [id]);
    await pool.query('DELETE FROM product_colors WHERE product_id = ?', [id]);
    for (const sz of sizes) {
      await pool.query('INSERT INTO product_sizes (product_id, size) VALUES (?, ?)', [id, sz]);
    }
    for (const hex of colors) {
      await pool.query('INSERT INTO product_colors (product_id, hex) VALUES (?, ?)', [id, hex]);
    }

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json((await hydrate(pool, rows))[0]);
  } catch (err) { next(err); }
});

// ── Admin: quick toggle in-stock status ───────────────────────────────────────

router.patch('/admin/products/:id/stock', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { in_stock } = req.body;
    if (in_stock !== 0 && in_stock !== 1 && typeof in_stock !== 'boolean') {
      return res.status(400).json({ error: 'in_stock must be true/false (or 1/0)' });
    }
    const pool = await getPool();
    const [[existing]] = await pool.query('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'not_found' });

    await pool.query('UPDATE products SET in_stock = ? WHERE id = ?', [in_stock ? 1 : 0, id]);

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json((await hydrate(pool, rows))[0]);
  } catch (err) { next(err); }
});

// ── Admin: delete product ─────────────────────────────────────────────────────

router.delete('/admin/products/:id', requireAdmin, async (req, res, next) => {
  try {
    const pool = await getPool();
    const [[row]] = await pool.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'not_found' });
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
