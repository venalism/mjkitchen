// server/middleware/auth.js
const { createClient } = require("@supabase/supabase-js");
const pool = require("../config/db");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "").trim();

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token provided" });
    }

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    const user = data?.user;

    console.log("🪪 Token received:", token.slice(0, 25) + "...");
    console.log("📡 Supabase getUser result:", { user, error });

    if (error || !user) {
      console.error("Supabase auth error:", error?.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Fetch internal profile from your PostgreSQL
    const profileQuery = `
      SELECT u.*, r.role_name 
      FROM "User" u
      LEFT JOIN "Role" r ON u.role_id = r.role_id
      WHERE u.email = $1
    `;
    const { rows } = await pool.query(profileQuery, [user.email]);

    if (!rows.length) {
      return res
        .status(404)
        .json({ message: "User profile not found in internal database" });
    }

    // Attach user context to the request
    req.user = user;      // Supabase user (id, email, metadata)
    req.profile = rows[0]; // Local DB info (role, preferences, etc.)

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = auth;