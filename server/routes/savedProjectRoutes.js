const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  saveProject,
  getSavedProjects,
  deleteSavedProject,
} = require("../controllers/savedProjectController");

router.post("/", protect, saveProject);
router.get("/", protect, getSavedProjects);
router.delete("/:id", protect, deleteSavedProject);

module.exports = router;