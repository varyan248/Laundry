require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");

const protect = async (req, res, next) => {
  // Check both Authorization header and 'token' header (since your frontend used 'token')
  let token = req.headers.authorization?.split(" ")[1] || req.headers.token;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (error) {
    res.status(401).json({ message: "Session expired or invalid token" });
  }
};

// Renamed to adminOnly to match your route import
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// CRITICAL: You must export these!
module.exports = { protect, adminOnly };