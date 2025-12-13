const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ⚠️ exact casing matters

const router = express.Router();

/**
 * ======================
 * AUTH MIDDLEWARE
 * ======================
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // check token presence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * ======================
 * PROTECTED ROUTE
 * ======================
 * GET /api/profile
 */
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed successfully ✅",
    user: req.user,
  });
});

module.exports = router;
