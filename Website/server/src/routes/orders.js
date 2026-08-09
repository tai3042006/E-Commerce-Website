import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { getPool } from '../db.js';
import { requireAuth, requireAdmin } from './auth.js';

const router = Router();

// ── Export: revenue report as CSV ─────────────────────────────────────────────

router.get('/orders/export', requireAdmin, async (req, res, next) => {
  try {
    const { from, to, status } = req.query;
    const pool = await getPool();

    const where = [];
    const args  = [];

    if (from)   { where.push('o.order_date >= ?'); args.push(from); }
    if (to)     { where.push('o.order_date <= ?'); args.push(to + ' 23:59:59'); }
    if (status && status !== 'all') { where.push('o.status = ?'); args.push(status); }

    const [rows] = await pool.query(
      `SELECT o.id, c.name AS customer_name, c.email AS customer_email,
              o.order_date, o.total, o.status, o.product_summary, o.items_count,
              o.address, o.city, o.zip, o.country
         FROM orders o
         JOIN customers c ON c.id = o.customer_id
         ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
        ORDER BY o.order_date DESC`,
      args
    );

    const totalRevenue = rows.reduce((s, r) => s + Number(r.total), 0);

    // Build CSV
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines  = [
      ['Order ID', 'Customer', 'Email', 'Address', 'City', 'ZIP', 'Country', 'Date', 'Items', 'Total (USD)', 'Status', 'Product'].map(escape).join(','),
      ...rows.map(r => [
        r.id,
        r.customer_name,
        r.customer_email,
        r.address ?? '',
        r.city ?? '',
        r.zip ?? '',
        r.country ?? '',
        r.order_date ? new Date(r.order_date).toISOString().slice(0, 10) : '',
        r.items_count,
        Number(r.total).toFixed(2),
        r.status,
        r.product_summary ?? '',
      ].map(escape).join(',')),
      '',
      `"Total Revenue","${totalRevenue.toFixed(2)}"`,
      `"Orders Count","${rows.length}"`,
    ];

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="clofit-revenue-${new Date().toISOString().slice(0,10)}.csv"`);
    res.send('\uFEFF' + lines.join('\r\n')); // BOM for Excel UTF-8
  } catch (err) {
    next(err);
  }
});

router.get('/orders', requireAdmin, async (_req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT o.id, o.customer_id, c.name AS customer_name, c.email AS customer_email,
              o.order_date, o.total, o.status, o.product_summary, o.items_count,
              o.address, o.city, o.zip, o.country
         FROM orders o
         JOIN customers c ON c.id = o.customer_id
        ORDER BY o.order_date DESC`
    );
    res.json(rows.map((r) => ({
      id: r.id,
      customerId: r.customer_id,
      customer: r.customer_name,
      customerEmail: r.customer_email,
      date: r.order_date,
      total: Number(r.total),
      status: r.status,
      product: r.product_summary,
      items: r.items_count,
      address: r.address,
      city: r.city,
      zip: r.zip,
      country: r.country,
    })));
  } catch (err) {
    next(err);
  }
});

router.get('/orders/my', requireAuth, async (req, res, next) => {
  try {
    const pool = await getPool();
    const [[user]] = await pool.query('SELECT email FROM users WHERE id = ?', [req.userId]);
    if (!user) return res.json([]);

    const [rows] = await pool.query(
      `SELECT o.id, o.order_date, o.total, o.status, o.product_summary, o.items_count
         FROM orders o
         JOIN customers c ON c.id = o.customer_id
        WHERE c.email = ?
        ORDER BY o.order_date DESC`,
      [user.email]
    );
    res.json(rows.map((r) => ({
      id: r.id,
      date: r.order_date,
      total: Number(r.total),
      status: r.status,
      product: r.product_summary,
      items: r.items_count,
    })));
  } catch (err) {
    next(err);
  }
});

router.post('/orders', async (req, res, next) => {
  try {
    const { customer, items } = req.body;
    if (!customer?.email || !items?.length) {
      return res.status(400).json({ error: 'customer.email and items[] are required' });
    }

    const pool = await getPool();

    // Recompute prices from the database — never trust client-supplied prices/totals.
    const productIds = items.map((i) => i?.id);
    if (!productIds.every((id) => typeof id === 'string' && id)) {
      return res.status(400).json({ error: 'each item must have a valid product id' });
    }
    const [productRows] = await pool.query(
      'SELECT id, name, price, in_stock FROM products WHERE id IN (?)',
      [productIds]
    );
    const productById = Object.fromEntries(productRows.map((p) => [p.id, p]));

    const resolvedItems = [];
    for (const item of items) {
      const product = productById[item.id];
      const qty = Number(item.qty);
      if (!product) {
        return res.status(400).json({ error: `unknown product: ${item.id}` });
      }
      if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ error: `invalid quantity for product: ${item.id}` });
      }
      if (!product.in_stock) {
        return res.status(400).json({ error: `product out of stock: ${item.id}` });
      }
      resolvedItems.push({ id: product.id, name: product.name, price: Number(product.price), qty });
    }

    let [[cust]] = await pool.query(
      'SELECT id FROM customers WHERE email = ?',
      [customer.email]
    );
    let customerId;
    const total = resolvedItems.reduce((s, i) => s + i.price * i.qty, 0);
    if (cust) {
      customerId = cust.id;
      await pool.query(
        'UPDATE customers SET orders_count = orders_count + 1, spent = spent + ? WHERE id = ?',
        [total, customerId]
      );
    } else {
      customerId = randomUUID();
      await pool.query(
        `INSERT INTO customers (id, name, email, joined_at, orders_count, spent, location)
         VALUES (?, ?, ?, NOW(), 1, ?, ?)`,
        [customerId, customer.name || customer.email, customer.email, total, null]
      );
    }

    const orderId = 'CF-' + Date.now().toString().slice(-5);
    const summary = resolvedItems[0]?.name ?? '';
    const count   = resolvedItems.reduce((s, i) => s + i.qty, 0);

    await pool.query(
      `INSERT INTO orders (id, customer_id, order_date, total, status, product_summary, items_count, address, city, zip, country)
       VALUES (?, ?, NOW(), ?, 'pending', ?, ?, ?, ?, ?, ?)`,
      [orderId, customerId, total, summary, count,
       customer.address ?? null, customer.city ?? null,
       customer.zip ?? null, customer.country ?? null]
    );

    await pool.query(
      `INSERT INTO notifications (id, audience, user_id, event, message, link)
       VALUES (?, 'admin', NULL, 'orderCreated', ?, ?)`,
      [randomUUID(), `New order ${orderId} from ${customer.name || customer.email} — $${total.toFixed(2)}`, '/admin/orders']
    );

    const [[userRow]] = await pool.query('SELECT id FROM users WHERE email = ?', [customer.email]);
    if (userRow) {
      await pool.query(
        `INSERT INTO notifications (id, audience, user_id, event, message, link)
         VALUES (?, 'user', ?, 'orderConfirmed', ?, ?)`,
        [randomUUID(), userRow.id, `Your order ${orderId} has been placed and is pending processing.`, '/account']
      );
    }

    res.status(201).json({ orderId, total, status: 'pending' });
  } catch (err) {
    next(err);
  }
});

router.patch('/orders/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'invalid status' });
    }
    const pool = await getPool();
    const [[order]] = await pool.query(
      `SELECT o.id, o.customer_id, c.email AS customer_email
         FROM orders o JOIN customers c ON c.id = o.customer_id
        WHERE o.id = ?`,
      [req.params.id]
    );
    if (!order) return res.status(404).json({ error: 'not_found' });

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

    const [[userRow]] = await pool.query('SELECT id FROM users WHERE email = ?', [order.customer_email]);
    if (userRow) {
      const statusMessages = {
        processing: `Your order ${req.params.id} is now being processed.`,
        shipped: `Your order ${req.params.id} has been shipped and is on its way!`,
        delivered: `Your order ${req.params.id} has been delivered. Enjoy!`,
        cancelled: `Your order ${req.params.id} has been cancelled.`,
      };
      const msg = statusMessages[status];
      if (msg) {
        await pool.query(
          `INSERT INTO notifications (id, audience, user_id, event, message, link)
           VALUES (?, 'user', ?, 'orderStatusUpdated', ?, ?)`,
          [randomUUID(), userRow.id, msg, '/account']
        );
      }
    }

    res.json({ ok: true, status });
  } catch (err) {
    next(err);
  }
});

export default router;
