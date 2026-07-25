const History = require("../models/History");

const getHistory = async (req, res) => {
  try {
    const history = await History.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.log("Get history error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

const deleteHistory = async (req, res) => {
  try {
    const history = await History.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "History deleted successfully",
    });
  } catch (error) {
    console.log("Delete history error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

const clearHistory = async (req, res) => {
  try {
    await History.deleteMany({
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "History cleared successfully",
    });
  } catch (error) {
    console.log("Clear history error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

module.exports = {
  getHistory,
  deleteHistory,
  clearHistory,
};