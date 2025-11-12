// server/middleware/adminOnly.js
const adminOnly = (req, res, next) => {
  // Requires auth middleware first
  const role = req.profile?.role_name;

  if (role && role.toLowerCase() === 'admin') {
    return next();
  }

  res.status(403).json({ message: 'Forbidden: Admin access required' });
};

module.exports = adminOnly;