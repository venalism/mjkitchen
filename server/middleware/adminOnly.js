// server/middleware/adminOnly.js

const adminOnly = (req, res, next) => {
  // This middleware assumes the `auth` middleware has already run
  // and attached req.profile
  
  if (req.profile?.role_name === 'admin') {
    // User is an admin, proceed
    return next();
  }

  // User is not an admin
  res.status(403).json({ message: 'Forbidden: Admin access required' });
};

module.exports = adminOnly;