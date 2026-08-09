const mongoose = require("mongoose");

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const nonEmptyArray = {
  validator: (arr) => Array.isArray(arr) && arr.length > 0,
  message: "{PATH} must be a non-empty array",
};

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    input: {
      skills: {
        type: [String],
        required: true,
        validate: nonEmptyArray,
      },

      experienceLevel: {
        type: String,
        required: true,
        enum: DIFFICULTY_LEVELS,
      },

      interests: {
        type: [String],
        required: true,
        validate: nonEmptyArray,
      },

      techStack: {
        type: [String],
        required: true,
        validate: nonEmptyArray,
      },

      projectDuration: {
        type: String,
        required: true,
        trim: true,
      },

      targetPlatform: {
        type: [String],
        required: true,
        validate: nonEmptyArray,
      },
    },

    generatedProjects: {
      type: [
        {
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
      ],
      required: true,
      validate: nonEmptyArray,
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model("History", historySchema);

module.exports = History;