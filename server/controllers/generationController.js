const { generateProjects } = require("../services/geminiService");

async function generateProjectsController(req, res) {
  try {
    const result = await generateProjects(req.validatedInput);
    return res.status(200).json({ success: true, projects: result.projects });
  } catch (err) {
    console.error("Generation failed:", err.message);
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