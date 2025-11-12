const jwt = require('jsonwebtoken');

// Validate Supabase JWT (or any HS256 JWT) using SUPABASE_JWT_SECRET
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Tidak ada token autentikasi' });
    }

    const secret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });

    // Normalize common Supabase claims
    req.user = {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role || decoded.user_role,
      user_id: decoded.user_id || decoded.sub, // fallback
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid', detail: error.message });
  }
};

module.exports = auth;