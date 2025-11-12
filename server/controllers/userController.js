const pool = require('../config/db');

// Bootstrap profile after Supabase login using email
exports.bootstrapProfile = async (req, res) => {
  try {
    const { name, email, phone_number } = req.body;
    if (!email) return res.status(400).json({ message: 'Email wajib diisi' });

    // Ensure role exists (customer)
    const roleRes = await pool.query('SELECT role_id FROM "Role" WHERE role_name=$1', ['customer']);
    const roleId = roleRes.rows[0] ? roleRes.rows[0].role_id : null;

    const existing = await pool.query('SELECT * FROM "User" WHERE email=$1', [email]);
    if (existing.rows[0]) {
      return res.json(existing.rows[0]);
    }

    const { rows } = await pool.query(
      'INSERT INTO "User"(role_id, name, email, phone_number, password_hash) VALUES ($1,$2,$3,$4, NULL) RETURNING *',
      [roleId, name || email, email, phone_number || null]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal membuat profil', detail: e.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(400).json({ message: 'Email tidak tersedia pada token' });
    const { rows } = await pool.query('SELECT * FROM "User" WHERE email=$1', [email]);
    if (!rows[0]) return res.status(404).json({ message: 'Profil tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memuat profil' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const email = req.user?.email;
    const { name, phone_number } = req.body;
    const { rows } = await pool.query(
      'UPDATE "User" SET name=$1, phone_number=$2 WHERE email=$3 RETURNING *',
      [name, phone_number || null, email]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memperbarui profil' });
  }
};

// Addresses CRUD
exports.listAddresses = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { rows } = await pool.query('SELECT * FROM "User_Address" WHERE user_id=$1 ORDER BY is_default DESC, address_id DESC', [user_id]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memuat alamat' });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { label, street, postal_code, is_default } = req.body;
    if (is_default) {
      await pool.query('UPDATE "User_Address" SET is_default=false WHERE user_id=$1', [user_id]);
    }
    const { rows } = await pool.query(
      'INSERT INTO "User_Address"(user_id, label, street, postal_code, is_default) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [user_id, label, street, postal_code, !!is_default]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal menambah alamat' });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { user_id, address_id } = req.params;
    const { label, street, postal_code, is_default } = req.body;
    if (is_default) {
      await pool.query('UPDATE "User_Address" SET is_default=false WHERE user_id=$1', [user_id]);
    }
    const { rows } = await pool.query(
      'UPDATE "User_Address" SET label=$1, street=$2, postal_code=$3, is_default=$4 WHERE address_id=$5 AND user_id=$6 RETURNING *',
      [label, street, postal_code, !!is_default, address_id, user_id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Alamat tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memperbarui alamat' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { user_id, address_id } = req.params;
    await pool.query('DELETE FROM "User_Address" WHERE address_id=$1 AND user_id=$2', [address_id, user_id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Gagal menghapus alamat' });
  }
};


