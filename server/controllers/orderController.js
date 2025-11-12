const pool = require('../config/db');

exports.placeOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { user_id, address_id, items, payment_method_id } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Item order kosong' });
    }

    await client.query('BEGIN');

    // Calculate total
    let total = 0;
    for (const item of items) {
      const { rows } = await client.query('SELECT price FROM "Menu" WHERE menu_id=$1', [item.menu_id]);
      if (!rows[0]) throw new Error('Menu tidak ditemukan');
      total += Number(rows[0].price) * Number(item.quantity);
    }

    const orderRes = await client.query(
      'INSERT INTO "Order"(user_id, address_id, order_date, status, total_amount) VALUES ($1,$2,NOW(),$3,$4) RETURNING order_id',
      [user_id, address_id, 'Pending', total]
    );

    const orderId = orderRes.rows[0].order_id;

    for (const item of items) {
      const { rows } = await client.query('SELECT price FROM "Menu" WHERE menu_id=$1', [item.menu_id]);
      const priceEach = Number(rows[0].price);
      const subtotal = priceEach * Number(item.quantity);
      await client.query(
        'INSERT INTO "Order_Item"(order_id, menu_id, quantity, price_each, subtotal) VALUES ($1,$2,$3,$4,$5)',
        [orderId, item.menu_id, item.quantity, priceEach, subtotal]
      );
    }

    // Create payment record (unpaid)
    await client.query(
      'INSERT INTO "Payment"(order_id, payment_method_id, payment_date, amount_paid, payment_status) VALUES ($1,$2,NULL,$3,$4)',
      [orderId, payment_method_id || null, total, 'Unpaid']
    );

    await client.query('COMMIT');
    res.status(201).json({ order_id: orderId, total_amount: total, status: 'Pending' });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Gagal membuat order', detail: e.message });
  } finally {
    client.release();
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await pool.query(
      `SELECT o.*, 
              (SELECT json_agg(oi) FROM "Order_Item" oi WHERE oi.order_id=o.order_id) AS items
         FROM "Order" o
        WHERE o.user_id=$1
        ORDER BY o.order_date DESC`,
      [userId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memuat order' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT o.*, u.name AS user_name 
         FROM "Order" o 
         JOIN "User" u ON u.user_id = o.user_id
        ORDER BY o.order_date DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memuat semua order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { rows } = await pool.query(
      'UPDATE "Order" SET status=$1 WHERE order_id=$2 RETURNING *',
      [status, id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Order tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memperbarui status order' });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const { id } = req.params; // order_id
    const { payment_status } = req.body; // e.g., Paid, Failed
    const { rows } = await pool.query(
      'UPDATE "Payment" SET payment_status=$1, payment_date=CASE WHEN $1=$2 THEN NOW() ELSE payment_date END WHERE order_id=$3 RETURNING *',
      [payment_status, 'Paid', id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Payment tidak ditemukan' });
    // If paid, move order status to Confirmed
    if (payment_status === 'Paid') {
      await pool.query('UPDATE "Order" SET status=$1 WHERE order_id=$2', ['Confirmed', id]);
    }
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memproses pembayaran' });
  }
};


