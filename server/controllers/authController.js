const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, phone_number, password } = req.body;

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Get customer role_id
    const roleResult = await pool.query(
      'SELECT role_id FROM "Role" WHERE role_name = $1',
      ['customer']
    );

    // Insert user
    const result = await pool.query(
      'INSERT INTO "User" (role_id, name, email, phone_number, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, email',
      [roleResult.rows[0].role_id, name, email, phone_number, password_hash]
    );

    // Generate token
    const token = jwt.sign(
      { user_id: result.rows[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT user_id, name, email, password_hash FROM "User" WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};