require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const generationRoutes = require("./routes/generationRoutes");
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const savedProjectRoutes = require("./routes/savedProjectRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", generationRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/saved-projects", savedProjectRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});