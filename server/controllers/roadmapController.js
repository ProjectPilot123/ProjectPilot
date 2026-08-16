const { generateRoadmap } = require("../services/geminiService");
const ProjectRoadmap = require("../models/ProjectRoadmap");

const ALLOWED_SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const ALLOWED_PROGRESS_STATUSES = ["not_started", "in_progress", "completed"];

/**
 * Turns a project title into a stable, URL/DB-safe slug used as the
 * uniqueness key for a user's roadmap on that project, e.g.
 * "Personal Finance Tracker!" -> "personal-finance-tracker"
 */
function slugify(title) {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Flattens the AI-generated phases/steps into the typed progress.items[]
 * array the schema tracks completion against. Each item is addressed by a
 * stable itemId derived from its position (phase index + step index).
 */
function buildProgressItems(roadmap) {
  const phases = Array.isArray(roadmap?.phases) ? roadmap.phases : [];

  const items = [];
  phases.forEach((phase, phaseIndex) => {
    const steps = Array.isArray(phase?.steps) ? phase.steps : [];
    steps.forEach((step, stepIndex) => {
      items.push({
        itemId: `phase-${phaseIndex}-step-${stepIndex}`,
        section: phase?.name || `Phase ${phaseIndex + 1}`,
        title: step?.title || `Step ${stepIndex + 1}`,
        status: "not_started",
        completedAt: null,
      });
    });
  });

  return items;
}

function computePercentComplete(items) {
  if (!items || items.length === 0) return 0;
  const completed = items.filter((i) => i.status === "completed").length;
  return Math.round((completed / items.length) * 100);
}

/**
 * When regenerating, try to carry over completion state for steps that
 * still exist (matched by itemId), so the user doesn't lose progress just
 * because they asked for a fresh roadmap.
 */
function mergeProgressWithPrevious(newItems, previousItems) {
  const previousByItemId = new Map(
    (previousItems || []).map((item) => [item.itemId, item])
  );

  return newItems.map((item) => {
    const previous = previousByItemId.get(item.itemId);
    if (previous && previous.status === "completed") {
      return { ...item, status: "completed", completedAt: previous.completedAt || new Date() };
    }
    return item;
  });
}

function validateGenerateBody(body) {
  const { project, skills, experienceLevel } = body || {};

  if (!project || typeof project !== "object" || !project.title) {
    return "Please provide the selected project, including at least a title";
  }
  if (!Array.isArray(skills) || skills.length === 0) {
    return "'skills' must be a non-empty array";
  }
  if (!experienceLevel || !ALLOWED_SKILL_LEVELS.includes(experienceLevel)) {
    return `'experienceLevel' must be one of: ${ALLOWED_SKILL_LEVELS.join(", ")}`;
  }
  return null;
}

/**
 * POST /api/roadmap/generate
 * Generates (or returns an already-generated) roadmap for the given
 * project + the authenticated user's skills/skill level.
 */
async function generateRoadmapController(req, res) {
  try {
    const validationError = validateGenerateBody(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const { project, skills, experienceLevel } = req.body;
    const projectSignature = slugify(project.title);

    if (!projectSignature) {
      return res.status(400).json({
        success: false,
        message: "Could not derive a valid project identifier from the project title",
      });
    }

    const existingRoadmap = await ProjectRoadmap.findOne({
      user: req.user.id,
      projectSignature,
    });

    if (existingRoadmap) {
      return res.status(200).json({
        success: true,
        alreadyExisted: true,
        roadmap: existingRoadmap,
      });
    }

    let generated;
    try {
      generated = await generateRoadmap({
        userSkills: skills,
        skillLevel: experienceLevel,
        project,
      });
    } catch (err) {
      console.error("Roadmap generation failed:", err.message);

      if (err.isQuotaError) {
        return res.status(429).json({
          success: false,
          error: "Our AI generator has hit its daily usage limit. Please try again tomorrow, or contact support.",
        });
      }

      const isGeminiOutputError = err.message?.includes("JSON") ||
        err.message?.includes("missing fields") ||
        err.message?.includes("empty") ||
        err.message?.includes("non-empty array") ||
        err.message?.includes("is not a JSON object");

      return res.status(502).json({
        success: false,
        error: isGeminiOutputError
          ? "AI returned an unexpected response. Please try again."
          : "AI service is currently unavailable. Please try again shortly.",
      });
    }

    const progressItems = buildProgressItems(generated);

    const roadmapDoc = await ProjectRoadmap.create({
      user: req.user.id,
      projectSignature,
      projectTitle: project.title,
      projectDifficulty: project.difficulty,
      sourceProject: project,
      userContext: {
        skills,
        skillLevel: experienceLevel,
      },
      roadmap: generated,
      progress: {
        items: progressItems,
        percentComplete: computePercentComplete(progressItems),
      },
    });

    return res.status(201).json({
      success: true,
      alreadyExisted: false,
      roadmap: roadmapDoc,
    });
  } catch (error) {
    // A duplicate-key race (two simultaneous requests for the same
    // user+project) should behave the same as "already exists".
    if (error.code === 11000) {
      const existing = await ProjectRoadmap.findOne({
        user: req.user.id,
        projectSignature: slugify(req.body?.project?.title),
      });
      if (existing) {
        return res.status(200).json({ success: true, alreadyExisted: true, roadmap: existing });
      }
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    console.error("Generate roadmap error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
}

/**
 * GET /api/roadmap/:id
 */
async function getRoadmapById(req, res) {
  try {
    const roadmap = await ProjectRoadmap.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    return res.status(200).json({ success: true, roadmap });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid roadmap id" });
    }

    console.error("Get roadmap error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
}

/**
 * PATCH /api/roadmap/:id/progress
 * Body can be either:
 *   { itemId: string, status: "not_started"|"in_progress"|"completed" }
 * or:
 *   { items: [{ itemId, status }, ...] }
 */
async function updateRoadmapProgress(req, res) {
  try {
    const roadmap = await ProjectRoadmap.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    const updates = Array.isArray(req.body?.items)
      ? req.body.items
      : req.body?.itemId
        ? [{ itemId: req.body.itemId, status: req.body.status }]
        : [];

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide either { itemId, status } or { items: [{ itemId, status }] }",
      });
    }

    for (const update of updates) {
      if (!update.itemId || !ALLOWED_PROGRESS_STATUSES.includes(update.status)) {
        return res.status(400).json({
          success: false,
          message: `Each update needs a valid itemId and status (one of: ${ALLOWED_PROGRESS_STATUSES.join(", ")})`,
        });
      }
    }

    const updatesByItemId = new Map(updates.map((u) => [u.itemId, u.status]));
    let matchedAny = false;

    roadmap.progress.items = roadmap.progress.items.map((item) => {
      if (!updatesByItemId.has(item.itemId)) return item;
      matchedAny = true;
      const status = updatesByItemId.get(item.itemId);
      return {
        ...item.toObject(),
        status,
        completedAt: status === "completed" ? new Date() : null,
      };
    });

    if (!matchedAny) {
      return res.status(404).json({
        success: false,
        message: "None of the provided itemId(s) exist on this roadmap",
      });
    }

    roadmap.progress.percentComplete = computePercentComplete(roadmap.progress.items);
    await roadmap.save();

    return res.status(200).json({ success: true, roadmap });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid roadmap id" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    console.error("Update roadmap progress error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
}

/**
 * POST /api/roadmap/:id/regenerate
 * Generates a fresh roadmap for the same project and replaces the AI
 * content while preserving completion state for steps that still exist.
 */
async function regenerateRoadmap(req, res) {
  try {
    const existing = await ProjectRoadmap.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    let generated;
    try {
      generated = await generateRoadmap({
        userSkills: existing.userContext?.skills || [],
        skillLevel: existing.userContext?.skillLevel || "Intermediate",
        project: existing.sourceProject,
      });
    } catch (err) {
      console.error("Roadmap regeneration failed:", err.message);

      if (err.isQuotaError) {
        return res.status(429).json({
          success: false,
          error: "Our AI generator has hit its daily usage limit. Please try again tomorrow, or contact support.",
        });
      }

      const isGeminiOutputError = err.message?.includes("JSON") ||
        err.message?.includes("missing fields") ||
        err.message?.includes("empty") ||
        err.message?.includes("non-empty array") ||
        err.message?.includes("is not a JSON object");

      return res.status(502).json({
        success: false,
        error: isGeminiOutputError
          ? "AI returned an unexpected response. Please try again."
          : "AI service is currently unavailable. Please try again shortly.",
      });
    }

    const freshItems = buildProgressItems(generated);
    const mergedItems = mergeProgressWithPrevious(freshItems, existing.progress.items);

    existing.roadmap = generated;
    existing.progress.items = mergedItems;
    existing.progress.percentComplete = computePercentComplete(mergedItems);

    await existing.save();

    return res.status(200).json({ success: true, roadmap: existing });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid roadmap id" });
    }

    console.error("Regenerate roadmap error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
}

module.exports = {
  generateRoadmapController,
  getRoadmapById,
  updateRoadmapProgress,
  regenerateRoadmap,
  slugify,
};