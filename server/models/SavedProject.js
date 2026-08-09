const mongoose = require("mongoose");

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const nonEmptyArray = {
  validator: (arr) => Array.isArray(arr) && arr.length > 0,
  message: "{PATH} must be a non-empty array",
};

const savedProjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      required: true,
      enum: DIFFICULTY_LEVELS,
    },

    techStack: {
      type: [String],
      required: true,
      validate: nonEmptyArray,
    },

    estimatedDays: {
      type: String,
      required: true,
      trim: true,
    },

    roadmap: {
      type: [String],
      required: true,
      validate: nonEmptyArray,
    },

    resumeValue: {
      type: String,
      required: true,
      trim: true,
    },

    uniqueSellingPoint: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const SavedProject = mongoose.model("SavedProject", savedProjectSchema);

module.exports = SavedProject;