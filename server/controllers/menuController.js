const pool = require('../config/db');

// Categories
exports.getCategories = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT category_id, category_name, description FROM "Category" ORDER BY category_name ASC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memuat kategori' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { category_name, description } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO "Category"(category_name, description) VALUES ($1, $2) RETURNING category_id, category_name, description',
      [category_name, description || null]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal membuat kategori' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, description } = req.body;
    const { rows } = await pool.query(
      'UPDATE "Category" SET category_name=$1, description=$2 WHERE category_id=$3 RETURNING category_id, category_name, description',
      [category_name, description || null, id]
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
    await pool.query('DELETE FROM "Category" WHERE category_id=$1', [id]);
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
               FROM "Gallery" g WHERE g.menu_id = m.menu_id) AS images
         FROM "Menu" m
         JOIN "Category" c ON c.category_id = m.category_id
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
               FROM "Gallery" g WHERE g.menu_id = m.menu_id) AS images
         FROM "Menu" m WHERE m.menu_id=$1`,
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
      'INSERT INTO "Menu"(category_id, menu_name, description, price, is_available) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [category_id, menu_name, description || null, price, is_available ?? true]
    );
    const menu = rows[0];
    if (Array.isArray(images) && images.length > 0) {
      const values = images.map((_, idx) => `($1, $${idx + 2})`).join(',');
      await pool.query(
        `INSERT INTO "Gallery"(menu_id, image_url) VALUES ${values}`,
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
      'UPDATE "Menu" SET category_id=$1, menu_name=$2, description=$3, price=$4, is_available=$5 WHERE menu_id=$6 RETURNING *',
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
    await pool.query('DELETE FROM "Gallery" WHERE menu_id=$1', [id]);
    await pool.query('DELETE FROM "Menu" WHERE menu_id=$1', [id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Gagal menghapus item menu' });
  }
};


