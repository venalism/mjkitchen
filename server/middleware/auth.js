// server/middleware/auth.js
const { createClient } = require('@supabase/supabase-js');
const pool = require('../config/db'); // ✨ Import the database pool
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token' });
    }

    // Ask Supabase to verify the token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Supabase auth error:', error?.message);
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Fetch our internal profile + role
    const profileRes = await pool.query(
      `SELECT u.*, r.role_name 
       FROM "User" u
       LEFT JOIN "Role" r ON u.role_id = r.role_id
       WHERE u.email = $1`,
      [user.email]
    );

    if (!profileRes.rows[0]) {
      // This can happen if a user exists in Supabase but not in our User table yet
      // The bootstrap endpoint will fix this, but for protected routes, we deny access.
      return res.status(401).json({ message: 'User profile not found' });
    }

    // Attach user info to the request
    req.user = user; // The Supabase user (e.g., req.user.id, req.user.email)
    req.profile = profileRes.rows[0]; // Our DB profile (e.g., req.profile.role_name)
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;