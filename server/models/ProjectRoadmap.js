const mongoose = require("mongoose");

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const PROGRESS_STATUSES = ["not_started", "in_progress", "completed"];

/**
 * A single trackable unit inside the roadmap (a step / task / checklist item).
 * Kept intentionally lightweight — the deep, rich content for each item lives
 * inside the `roadmap` Mixed field. This subdocument only exists so the UI
 * can toggle and persist completion state without touching the AI payload.
 */
const roadmapProgressItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: [true, "itemId is required"],
      trim: true,
    },

    // Where this item lives inside the roadmap, e.g. "phases.1.steps.3"
    // or a phase name like "Phase 2 — Backend". Free-form on purpose since
    // the AI-generated structure can vary project to project.
    section: {
      type: String,
      trim: true,
      default: "",
    },

    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: PROGRESS_STATUSES,
      default: "not_started",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const projectRoadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Slugified project title, used together with `user` to uniquely
    // identify a roadmap and avoid regenerating/duplicating it.
    projectSignature: {
      type: String,
      required: [true, "projectSignature is required"],
      trim: true,
      lowercase: true,
      index: true,
    },

    projectTitle: {
      type: String,
      required: [true, "projectTitle is required"],
      trim: true,
    },

    projectDifficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
    },

    // Snapshot of the project idea the roadmap was generated for
    // (description, techStack, estimatedDays, resumeValue, etc.).
    // Stored as Mixed so it can accept whatever shape the generation
    // flow already produces without forcing a second schema to stay
    // in sync with History/SavedProject.
    sourceProject: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // The skills/skill-levels context the roadmap was personalized from.
    userContext: {
      skills: {
        type: [String],
        default: [],
      },
      skillLevel: {
        type: String,
        enum: DIFFICULTY_LEVELS,
      },
    },

    // The full, deep AI-generated roadmap body (projectOverview,
    // prerequisites, skillMapping, architecture, features, database,
    // api, folderStructure, phases, technologyChoices, learningGaps,
    // testing, security, deployment, finalChecklist, ...).
    roadmap: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "roadmap is required"],
    },

    progress: {
      items: {
        type: [roadmapProgressItemSchema],
        default: [],
      },

      percentComplete: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
  },
  {
    timestamps: true,
  }
);

// A user can only ever have one roadmap per project signature.
projectRoadmapSchema.index({ user: 1, projectSignature: 1 }, { unique: true });

const ProjectRoadmap = mongoose.model("ProjectRoadmap", projectRoadmapSchema);

module.exports = ProjectRoadmap;