// server/middleware/auth.js
const { createClient } = require("@supabase/supabase-js");
const pool = require("../config/db");
require("dotenv").config();

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No authentication token provided" 
      });
    }

    // Verify token with Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);
    const user = data?.user;

    if (error || !user) {
      console.error("❌ Supabase auth error:", error?.message || "No user found");
      return res.status(401).json({ 
        success: false,
        message: "Invalid or expired token" 
      });
    }

    console.log("✅ User authenticated:", user.email);

    // Fetch user profile from your PostgreSQL database
    // Your schema uses lowercase table names with quotes
    const profileQuery = `
      SELECT 
        p.id,
        p.role,
        p.name,
        p.phone_number,
        p.created_at,
        p.updated_at
      FROM "profile" p
      WHERE p.id = $1
    `;

    const { rows } = await pool.query(profileQuery, [user.id]);

    if (!rows.length) {
      // User exists in Supabase Auth but profile not created yet
      // Your trigger should handle this, but let's add a fallback
      console.log("⚠️ Profile not found for user:", user.email);
      console.log("⚠️ Attempting to create profile...");
      
      try {
        const createProfileQuery = `
          INSERT INTO profile (id, name, role, phone_number)
          VALUES ($1, $2, 'customer', $3)
          RETURNING *
        `;
        
        const newProfile = await pool.query(createProfileQuery, [
          user.id,
          user.user_metadata?.name || user.email.split('@')[0],
          user.user_metadata?.phone_number || null
        ]);
        
        req.user = user;
        req.profile = newProfile.rows[0];
        
        console.log("✅ Profile created for:", user.email);
        return next();
        
      } catch (createError) {
        console.error("❌ Could not create profile:", createError.message);
        
        // Fallback: use Supabase auth data only
        req.user = user;
        req.profile = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          role: 'customer',
          phone_number: user.user_metadata?.phone_number || null
        };
        
        return next();
      }
    }

    // Attach user context to the request
    req.user = user;       // Supabase Auth user (full auth object)
    req.profile = {
      ...rows[0],
      email: user.email    // Add email from auth for convenience
    };

    console.log("✅ Profile loaded:", user.email, "| Role:", req.profile.role);
    next();

  } catch (err) {
    console.error("💥 Auth middleware error:", err.message);
    console.error(err.stack);
    res.status(401).json({ 
      success: false,
      message: "Authentication failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = auth;