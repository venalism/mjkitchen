// server/middleware/auth.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create a Supabase Admin client
// It uses the SERVICE_ROLE_KEY to verify tokens
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

    // Token is valid! Attach user info to the request
    req.user = user; 
    // You can now access req.user.id, req.user.email etc. in your protected routes
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;