const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getHistory, deleteHistory, clearHistory } = require("../controllers/historyController");

router.get("/", protect, getHistory);
router.delete("/:id", protect, deleteHistory);
router.delete("/", protect, clearHistory);

module.exports = router;