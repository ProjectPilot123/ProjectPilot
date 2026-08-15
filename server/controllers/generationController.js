const { generateProjects } = require("../services/geminiService");
const History = require("../models/History");

async function generateProjectsController(req, res) {
  try {
    const result = await generateProjects(req.validatedInput);

    try {
      await History.create({
        user: req.user.id,
        input: req.validatedInput,
        generatedProjects: result.projects,
      });
    } catch (historyErr) {
      console.error("Failed to save generation history:", historyErr.message);
    }

    return res.status(200).json({ success: true, projects: result.projects });
  } catch (err) {
    console.error("Generation failed:", err.message);

    if (err.isQuotaError) {
      return res.status(429).json({
        success: false,
        error: "Our AI generator has hit its daily usage limit. Please try again tomorrow, or contact support.",
      });
    }

    const isGeminiOutputError = err.message?.includes("JSON") ||
      err.message?.includes("missing fields") ||
      err.message?.includes("empty");

    return res.status(502).json({
      success: false,
      error: isGeminiOutputError
        ? "AI returned an unexpected response. Please try again."
        : "AI service is currently unavailable. Please try again shortly.",
    });
  }
}

module.exports = { generateProjectsController };