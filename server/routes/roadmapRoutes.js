const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  generateRoadmapController,
  getRoadmapById,
  updateRoadmapProgress,
  regenerateRoadmap,
} = require("../controllers/roadmapController");

router.post("/generate", protect, generateRoadmapController);
router.get("/:id", protect, getRoadmapById);
router.patch("/:id/progress", protect, updateRoadmapProgress);
router.post("/:id/regenerate", protect, regenerateRoadmap);

module.exports = router;