// Seed the database from the JS mirror of the mock data.
// Runs only when the `products` table is empty, so it is safe to call on every
// startup. Use `npm run seed` to re-seed manually after wiping the tables.

import { getPool } from './db.js';
import { categories, products, customers, orders } from './seedData.js';

async function seed() {
  const pool = await getPool();

  const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM products');
  if (count > 0) {
    console.log(`[seed] products table already has ${count} rows — skipping.`);
    return;
  }

  console.log('[seed] empty database detected, populating from seedData.js…');
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Categories
    for (const c of categories) {
      await conn.query(
        'INSERT INTO categories (id, label) VALUES (?, ?)',
        [c.id, c.label]
      );
    }

    // 2. Products + colors + sizes + gallery images
    for (const p of products) {
      await conn.query(
        `INSERT INTO products
           (id, name, tagline, description, price, old_price,
            image, hover_image, category_id, gender, rating, reviews,
            badge, in_stock)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id,
          p.name,
          p.tagline ?? null,
          p.description ?? null,
          p.price,
          p.oldPrice ?? null,
          p.image ?? null,
          p.hoverImage ?? null,
          p.category,
          p.gender,
          p.rating ?? 0,
          p.reviews ?? 0,
          p.badge ?? null,
          p.inStock === false ? 0 : 1,
        ]
      );

      const gallery = p.gallery ?? (p.image ? [p.image] : []);
      for (let i = 0; i < gallery.length; i++) {
        await conn.query(
          'INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)',
          [p.id, gallery[i], i]
        );
      }

      for (const hex of p.colors ?? []) {
        await conn.query(
          'INSERT INTO product_colors (product_id, hex) VALUES (?, ?)',
          [p.id, hex]
        );
      }

      for (const size of p.sizes ?? []) {
        await conn.query(
          'INSERT INTO product_sizes (product_id, size) VALUES (?, ?)',
          [p.id, size]
        );
      }
    }

    // 3. Customers
    for (const u of customers) {
      await conn.query(
        `INSERT INTO customers
           (id, name, email, joined_at, orders_count, spent, location)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.name, u.email, u.joined, u.orders, u.spent, u.location]
      );
    }

    // 4. Orders (resolve customer via email)
    const [rows] = await conn.query('SELECT id, email FROM customers');
    const emailToId = new Map(rows.map((r) => [r.email, r.id]));

    for (const o of orders) {
      const customerId = emailToId.get(o.customerEmail);
      if (!customerId) {
        console.warn(`[seed] order ${o.id}: unknown customer ${o.customerEmail}, skipping`);
        continue;
      }
      await conn.query(
        `INSERT INTO orders
           (id, customer_id, order_date, total, status, product_summary)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [o.id, customerId, o.date, o.total, o.status, o.product]
      );
    }

    await conn.commit();
    console.log(
      `[seed] inserted ${products.length} products, ${customers.length} customers, ${orders.length} orders.`
    );
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

seed().then(
  () => process.exit(0),
  (err) => {
    console.error('[seed] failed:', err);
    process.exit(1);
  }
);
