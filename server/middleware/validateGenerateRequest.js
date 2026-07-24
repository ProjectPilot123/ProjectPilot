const ALLOWED_EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

function validateGenerateRequest(req, res, next) {
  const { skills, experienceLevel, interests, techStack, projectDuration, targetPlatform } = req.body || {};

  const missing = [];
  if (!skills) missing.push("skills");
  if (!experienceLevel) missing.push("experienceLevel");
  if (!interests) missing.push("interests");
  if (!techStack) missing.push("techStack");
  if (!projectDuration) missing.push("projectDuration");
  if (!targetPlatform) missing.push("targetPlatform");

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      fields: missing,
    });
  }

  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: "'skills' must be a non-empty array" });
  }
  if (!Array.isArray(interests) || interests.length === 0) {
    return res.status(400).json({ error: "'interests' must be a non-empty array" });
  }
  if (!Array.isArray(techStack) || techStack.length === 0) {
    return res.status(400).json({ error: "'techStack' must be a non-empty array" });
  }
  if (!Array.isArray(targetPlatform) || targetPlatform.length === 0) {
    return res.status(400).json({ error: "'targetPlatform' must be a non-empty array" });
  }

  if (!ALLOWED_EXPERIENCE_LEVELS.includes(experienceLevel)) {
    return res.status(400).json({
      error: `'experienceLevel' must be one of: ${ALLOWED_EXPERIENCE_LEVELS.join(", ")}`,
    });
  }
  if (typeof projectDuration !== "string" || projectDuration.length > 50) {
    return res.status(400).json({ error: "'projectDuration' is invalid" });
  }

  req.validatedInput = {
    skills: skills.map((s) => String(s).trim()).filter(Boolean),
    experienceLevel,
    interests: interests.map((i) => String(i).trim()).filter(Boolean),
    techStack: techStack.map((t) => String(t).trim()).filter(Boolean),
    projectDuration: projectDuration.trim(),
    targetPlatform: targetPlatform.map((p) => String(p).trim()).filter(Boolean),
  };

  next();
}

module.exports = validateGenerateRequest;