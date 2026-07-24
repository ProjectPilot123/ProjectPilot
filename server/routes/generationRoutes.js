const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const validateGenerateRequest = require("../middleware/validateGenerateRequest");
const { generateProjectsController } = require("../controllers/generationController");

router.post("/generate-projects", protect, validateGenerateRequest, generateProjectsController);

module.exports = router;