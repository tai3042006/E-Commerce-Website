// Seeding logic — called from index.js when products table is empty.
// Uses INSERT IGNORE everywhere so it is safe to run multiple times.

import { categories, products, customers, orders } from './seedData.js';

export default async function seedDb(pool) {
  console.log('[seed] populating database from seedData.js…');
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Categories
    for (const c of categories) {
      await conn.query(
        'INSERT IGNORE INTO categories (id, label) VALUES (?, ?)',
        [c.id, c.label]
      );
    }

    // 2. Products + related tables
    for (const p of products) {
      await conn.query(
        `INSERT IGNORE INTO products
           (id, name, tagline, description, price, old_price,
            image, hover_image, category_id, gender, rating, reviews,
            badge, in_stock)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id, p.name, p.tagline ?? null, p.description ?? null,
          p.price, p.oldPrice ?? null, p.image ?? null, p.hoverImage ?? null,
          p.category, p.gender ?? 'unisex',
          p.rating ?? 0, p.reviews ?? 0, p.badge ?? null,
          p.inStock === false ? 0 : 1,
        ]
      );

      // Only insert images/colors/sizes if this product was just inserted
      // (i.e. it didn't already exist — avoids duplicates on re-run)
      const [[{ cnt }]] = await conn.query(
        'SELECT COUNT(*) AS cnt FROM product_images WHERE product_id = ?',
        [p.id]
      );
      if (Number(cnt) === 0) {
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
    }

    // 3. Customers
    for (const u of customers) {
      await conn.query(
        `INSERT IGNORE INTO customers
           (id, name, email, joined_at, orders_count, spent, location)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.name, u.email, u.joined, u.orders, u.spent, u.location]
      );
    }

    // 4. Orders
    for (const o of orders) {
      await conn.query(
        `INSERT IGNORE INTO orders
           (id, customer_id, order_date, total, status, product_summary, items_count)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [o.id, o.customerId ?? o.customer_id, o.date, o.total, o.status, o.product, o.items ?? 1]
      );
    }

    await conn.commit();
    console.log(`[seed] inserted ${products.length} products, ${customers.length} customers, ${orders.length} orders.`);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
