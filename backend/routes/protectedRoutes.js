const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getUserProfile } = require("../controllers/userController");

const router = express.Router();

/**
 * ======================
 * AUTH MIDDLEWARE
 * ======================
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
 * PROTECTED ROUTES
 * ======================
 */

/**
 * GET /api/profile
 * Returns authenticated user
 */
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed successfully ✅",
    user: req.user,
  });
});

/**
 * GET /api/user
 * Uses controller (same user data)
 */
router.get("/user", authMiddleware, getUserProfile);

module.exports = router;
