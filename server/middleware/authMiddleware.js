// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// Middleware to protect private routes
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Access denied",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.log("Auth middleware error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again",
    });
  }
};

module.exports = protect;