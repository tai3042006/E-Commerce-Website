// GET /api/products       — list with joined colors/sizes/images
// GET /api/products/:id   — single product
// GET /api/categories     — category list
//
// Optional query params for /api/products:
//   ?gender=men|women|unisex
//   ?category=hoodies|tees|shoes|pants|accessories
//   ?badge=new|sale|bestseller

import { Router } from 'express';
import { getPool } from '../db.js';

const router = Router();

/** Hydrate a product row with its colors/sizes/gallery arrays. */
async function hydrate(conn, rows) {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);

  const [images] = await conn.query(
    `SELECT product_id, url FROM product_images
     WHERE product_id IN (?)
     ORDER BY product_id, sort_order ASC`,
    [ids]
  );
  const [colors] = await conn.query(
    'SELECT product_id, hex FROM product_colors WHERE product_id IN (?)',
    [ids]
  );
  const [sizes] = await conn.query(
    'SELECT product_id, size FROM product_sizes WHERE product_id IN (?)',
    [ids]
  );

  const imgMap = new Map();
  for (const i of images) {
    if (!imgMap.has(i.product_id)) imgMap.set(i.product_id, []);
    imgMap.get(i.product_id).push(i.url);
  }
  const colorMap = new Map();
  for (const c of colors) {
    if (!colorMap.has(c.product_id)) colorMap.set(c.product_id, []);
    colorMap.get(c.product_id).push(c.hex);
  }
  const sizeMap = new Map();
  for (const s of sizes) {
    if (!sizeMap.has(s.product_id)) sizeMap.set(s.product_id, []);
    sizeMap.get(s.product_id).push(s.size);
  }

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    price: Number(r.price),
    oldPrice: r.old_price !== null ? Number(r.old_price) : undefined,
    image: r.image,
    hoverImage: r.hover_image,
    gallery: imgMap.get(r.id) ?? [],
    category: r.category_id,
    gender: r.gender,
    rating: Number(r.rating),
    reviews: r.reviews,
    badge: r.badge ?? undefined,
    inStock: r.in_stock === 1,
    colors: colorMap.get(r.id) ?? [],
    sizes: sizeMap.get(r.id) ?? [],
  }));
}

router.get('/products', async (req, res, next) => {
  try {
    const { gender, category, badge } = req.query;
    const where = [];
    const args = [];
    if (gender)   { where.push('gender = ?');      args.push(gender); }
    if (category) { where.push('category_id = ?'); args.push(category); }
    if (badge)    { where.push('badge = ?');       args.push(badge); }
    const sql =
      'SELECT * FROM products' +
      (where.length ? ' WHERE ' + where.join(' AND ') : '') +
      ' ORDER BY created_at ASC';
    const pool = await getPool();
    const [rows] = await pool.query(sql, args);
    const out = await hydrate(pool, rows);
    res.json(out);
  } catch (err) {
    next(err);
  }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'not_found' });
    const out = await hydrate(pool, rows);
    res.json(out[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/categories', async (_req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      'SELECT id, label FROM categories ORDER BY label'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
