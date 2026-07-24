require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const generationRoutes = require("./routes/generationRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api",generationRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});