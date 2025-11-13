// server/controllers/userController.js
const pool = require('../config/db');

// --- EXISTING USER-FACING FUNCTIONS ---

exports.getMe = async (req, res) => {
  try {
    res.json(req.profile);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memuat profil' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const email = req.profile?.email; // from auth middleware
    const { name, phone_number } = req.body;
    
    const { rows } = await pool.query(
      'UPDATE "profile" SET name=$1, phone_number=$2 WHERE email=$3 RETURNING *',
      [name, phone_number || null, email]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memperbarui profil' });
  }
};

// ... (keep existing address functions: listAddresses, createAddress, etc.) ...
// --- Addresses CRUD ---
exports.listAddresses = async (req, res) => {
  try {
    const { user_id } = req.params; // This will be the profile.id from the client
    const { rows } = await pool.query('SELECT * FROM "user_address" WHERE user_id=$1 ORDER BY is_default DESC, address_id DESC', [user_id]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memuat alamat' });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const { user_id } = req.params; // This will be the profile.id
    const { label, street, postal_code, is_default, city } = req.body; // Added city from your SQL
    if (is_default) {
      await pool.query('UPDATE "user_address" SET is_default=false WHERE user_id=$1', [user_id]);
    }
    const { rows } = await pool.query(
      'INSERT INTO "user_address"(user_id, label, street, postal_code, is_default, city) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [user_id, label, street, postal_code, !!is_default, city]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal menambah alamat', detail: e.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { user_id, address_id } = req.params;
    const { label, street, postal_code, is_default, city } = req.body; // Added city
    if (is_default) {
      await pool.query('UPDATE "user_address" SET is_default=false WHERE user_id=$1', [user_id]);
    }
    const { rows } = await pool.query(
      'UPDATE "user_address" SET label=$1, street=$2, postal_code=$3, is_default=$4, city=$5 WHERE address_id=$6 AND user_id=$7 RETURNING *',
      [label, street, postal_code, !!is_default, city, address_id, user_id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Alamat tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memperbarui alamat', detail: e.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { user_id, address_id } = req.params;
    await pool.query('DELETE FROM "user_address" WHERE address_id=$1 AND user_id=$2', [address_id, user_id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Gagal menghapus alamat' });
  }
};


// --- ✨ NEW ADMIN-ONLY FUNCTIONS ---

exports.getAllProfiles = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, role, name, phone_number, created_at FROM "profile" ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memuat daftar profil' });
  }
};

exports.updateProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone_number, role } = req.body;

    // Validate role
    if (!['admin', 'customer'].includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid.' });
    }

    const { rows } = await pool.query(
      'UPDATE "profile" SET name=$1, phone_number=$2, role=$3, updated_at=NOW() WHERE id=$4 RETURNING id, role, name, phone_number',
      [name, phone_number || null, role, id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Profil tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Gagal memperbarui profil' });
  }
};

exports.deleteProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    // We only delete from 'profile'. The ON DELETE CASCADE will handle auth.users.
    const result = await pool.query('DELETE FROM "profile" WHERE id=$1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Profil tidak ditemukan' });
    }
    res.json({ success: true, message: 'Profil berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ message: 'Gagal menghapus profil', detail: e.message });
  }
};