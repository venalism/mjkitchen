// server/controllers/menuController.js
const pool = require('../config/db');

// Categories
exports.getCategories = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT category_id, category_name, description, image_url FROM "category" ORDER BY category_name ASC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memuat kategori' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { category_name, description, image_url } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO "category"(category_name, description, image_url) VALUES ($1, $2, $3) RETURNING *',
      [category_name, description || null, image_url || null]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal membuat kategori' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, description, image_url } = req.body;
    const { rows } = await pool.query(
      'UPDATE "category" SET category_name=$1, description=$2, image_url=$3 WHERE category_id=$4 RETURNING *',
      [category_name, description || null, image_url || null, id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memperbarui kategori' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM "category" WHERE category_id=$1', [id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Gagal menghapus kategori' });
  }
};

// Menu Items
exports.getMenu = async (req, res) => {
  try {
    const { category_id } = req.query;
    const params = [];
    let where = '';
    if (category_id) {
      params.push(category_id);
      where = 'WHERE m.category_id = $1';
    }
    const { rows } = await pool.query(
      `SELECT m.menu_id, m.menu_name, m.description, m.price, m.is_available, m.category_id,
              c.category_name,
              (SELECT COALESCE(json_agg(g ORDER BY g.gallery_id) FILTER (WHERE g.gallery_id IS NOT NULL), '[]'::json)
               FROM "gallery" g WHERE g.menu_id = m.menu_id) AS images
         FROM "menu" m
         JOIN "category" c ON c.category_id = m.category_id
         ${where}
         ORDER BY m.menu_id DESC`,
      params
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memuat menu' });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT m.menu_id, m.menu_name, m.description, m.price, m.is_available, m.category_id,
              (SELECT COALESCE(json_agg(g ORDER BY g.gallery_id) FILTER (WHERE g.gallery_id IS NOT NULL), '[]'::json)
               FROM "gallery" g WHERE g.menu_id = m.menu_id) AS images
         FROM "menu" m WHERE m.menu_id=$1`,
      [id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Menu tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memuat detail menu' });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { category_id, menu_name, description, price, is_available, images } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO "menu"(category_id, menu_name, description, price, is_available) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [category_id, menu_name, description || null, price, is_available ?? true]
    );
    const menu = rows[0];
    if (Array.isArray(images) && images.length > 0) {
      const values = images.map((_, idx) => `($1, $${idx + 2})`).join(',');
      await pool.query(
        `INSERT INTO "gallery"(menu_id, image_url) VALUES ${values}`,
        [menu.menu_id, ...images]
      );
    }
    res.status(201).json(menu);
  } catch (e) {
    res.status(500).json({ message: 'Gagal membuat item menu' });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, menu_name, description, price, is_available } = req.body;
    const { rows } = await pool.query(
      'UPDATE "menu" SET category_id=$1, menu_name=$2, description=$3, price=$4, is_available=$5 WHERE menu_id=$6 RETURNING *',
      [category_id, menu_name, description || null, price, is_available, id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Menu tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memperbarui item menu' });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM "gallery" WHERE menu_id=$1', [id]);
    await pool.query('DELETE FROM "menu" WHERE menu_id=$1', [id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Gagal menghapus item menu' });
  }
};