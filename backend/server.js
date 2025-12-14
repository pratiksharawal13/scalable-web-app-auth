const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

const app = express();

/**
 * ======================
 * MIDDLEWARE
 * ======================
 */
app.use(
  cors({
    origin: "*", // allow frontend (Netlify)
    credentials: true,
  })
);
app.use(express.json());

/**
 * ======================
 * ROUTES
 * ======================
 */
app.use("/api/auth", authRoutes);   // login, register
app.use("/api", protectedRoutes);   // /profile, protected APIs

/**
 * ======================
 * TEST ROUTE
 * ======================
 */
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/**
 * ======================
 * DATABASE CONNECTION
 * ======================
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully ✅"))
  .catch((err) => {
    console.error("MongoDB connection failed ❌");
    console.error(err.message);
    process.exit(1);
  });

/**
 * ======================
 * START SERVER
 * ======================
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
