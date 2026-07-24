const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const REQUIRED_PROJECT_FIELDS = [
  "title", "description", "difficulty", "techStack",
  "estimatedDays", "roadmap", "resumeValue", "uniqueSellingPoint",
];

function buildPrompt(input) {
  const { skills, experienceLevel, interests, techStack, projectDuration, targetPlatform } = input;

  return `You are a software architect who designs personalized software project ideas for students.

Generate exactly 3 unique, realistic software project ideas tailored to this student:

Skills: ${skills.join(", ")}
Experience Level: ${experienceLevel}
Areas of Interest: ${interests.join(", ")}
Preferred Tech Stack(s): ${techStack.join(", ")}
Project Duration: ${projectDuration}
Target Platform(s): ${targetPlatform.join(", ")}

Rules:
- Return ONLY valid JSON. No markdown, no code fences, no explanation.
- The JSON must match exactly this shape:

{
  "projects": [
    {
      "title": "string",
      "description": "string (2-3 sentences)",
      "difficulty": "Beginner | Intermediate | Advanced",
      "techStack": ["string", "string"],
      "estimatedDays": "string, e.g. '10-14 days'",
      "roadmap": ["step 1", "step 2", "step 3"],
      "resumeValue": "string",
      "uniqueSellingPoint": "string"
    }
  ]
}

- If the student listed multiple preferred tech stacks, choose the single best-fitting one per project rather than combining all of them.
- If "No Preference" is among the tech stack options, choose an appropriate stack based on skills and experience level instead.
- Respect the target platform(s) when suggesting features and structure.
- Keep each project achievable within the given project duration.
- Do not repeat the same project idea twice.
- Respond with the JSON object and nothing else.`;
}

function stripCodeFences(text) {
  return text.trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function validateProjectsShape(parsed) {
  if (!parsed || !Array.isArray(parsed.projects)) {
    throw new Error("Response JSON missing 'projects' array");
  }
  if (parsed.projects.length === 0) {
    throw new Error("'projects' array is empty");
  }
  parsed.projects.forEach((project, index) => {
    const missingFields = REQUIRED_PROJECT_FIELDS.filter((f) => !(f in project));
    if (missingFields.length > 0) {
      throw new Error(`Project at index ${index} is missing fields: ${missingFields.join(", ")}`);
    }
  });
  return parsed;
}

async function callGeminiOnce(prompt) {
  const result = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });
  const rawText = result.text;
  const cleanText = stripCodeFences(rawText);

  let parsed;
  try {
    parsed = JSON.parse(cleanText);
  } catch (err) {
    throw new Error(`Gemini did not return valid JSON: ${err.message}`);
  }
  return validateProjectsShape(parsed);
}

async function generateProjects(input, { maxAttempts = 2 } = {}) {
  const prompt = buildPrompt(input);
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await callGeminiOnce(prompt);
    } catch (err) {
      lastError = err;
      console.warn(`Gemini attempt ${attempt} failed: ${err.message}`);
    }
  }
  throw lastError;
}

module.exports = { generateProjects, buildPrompt };