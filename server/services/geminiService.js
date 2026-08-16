const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

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
  try {
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
  } catch (err) {
    // Surface quota/rate-limit errors distinctly so we don't waste a retry on them
    const message = err?.message || "";
    if (message.includes("RESOURCE_EXHAUSTED") || message.includes("429") || message.includes("quota")) {
      const quotaError = new Error("QUOTA_EXCEEDED");
      quotaError.isQuotaError = true;
      throw quotaError;
    }
    throw err;
  }
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
      // Don't burn a second attempt on a quota error — it won't succeed today
      if (err.isQuotaError) break;
    }
  }
  throw lastError;
}

const REQUIRED_ROADMAP_FIELDS = [
  "projectOverview",
  "prerequisites",
  "skillMapping",
  "architecture",
  "features",
  "database",
  "api",
  "folderStructure",
  "phases",
  "technologyChoices",
  "learningGaps",
  "testing",
  "security",
  "deployment",
  "finalChecklist",
];

function buildRoadmapPrompt(input) {
  const { userSkills, skillLevel, project } = input;
  const {
    title,
    description,
    difficulty,
    techStack = [],
    estimatedDays,
  } = project;

  return `You are a senior software architect and mentor who writes complete, personalized, step-by-step build roadmaps for student software projects.

Generate a complete build roadmap for the following project, personalized to this specific student.

Project:
Title: ${title}
Description: ${description}
Difficulty: ${difficulty || "Intermediate"}
Suggested Tech Stack: ${techStack.join(", ")}
Estimated Time: ${estimatedDays || "unspecified"}

Student:
Known Skills: ${userSkills.join(", ")}
Skill Level: ${skillLevel}

Rules:
- Return ONLY valid JSON. No markdown, no code fences, no explanation.
- Do not use generic filler like "learn React and build the frontend". Every instruction must be specific and actionable, naming exact files, components, endpoints, or fields where relevant.
- Personalize using the student's known skills: technologies they already know should be treated as existing skills, not re-taught from scratch. Technologies relevant to the project that are missing from their skills should be called out as learning gaps.
- Adapt depth and explanation to the student's skill level (${skillLevel}): more explanation and smaller steps for Beginner, more architecture/design decisions for Intermediate, more scalability/security/testing/CI-CD depth for Advanced.
- Only include "technologyChoices" alternatives where a real, meaningful decision exists (e.g. database choice, auth strategy, state management). Do not pad with unnecessary alternatives.
- The JSON must match exactly this shape (use empty arrays/objects if a section genuinely does not apply, but every key must be present):

{
  "projectOverview": {
    "name": "string",
    "difficulty": "Beginner | Intermediate | Advanced",
    "estimatedTime": "string",
    "recommendedSkillLevel": "string",
    "description": "string",
    "mainTechnologies": ["string"],
    "optionalTechnologies": ["string"],
    "youWillLearn": ["string"],
    "outcome": "string"
  },
  "prerequisites": {
    "required": [{ "skill": "string", "why": "string" }],
    "recommended": [{ "skill": "string", "why": "string" }]
  },
  "skillMapping": [
    { "technology": "string", "usedFor": ["string"] }
  ],
  "architecture": {
    "layers": [{ "name": "string", "responsibility": "string", "technology": "string" }],
    "dataFlow": "string",
    "authFlow": "string"
  },
  "features": [
    {
      "name": "string",
      "description": "string",
      "subFeatures": ["string"],
      "frontendWork": "string",
      "backendWork": "string",
      "databaseWork": "string",
      "skillsUsed": ["string"]
    }
  ],
  "database": {
    "type": "MongoDB | PostgreSQL | other",
    "reasoning": "string",
    "collections": [
      {
        "name": "string",
        "fields": [{ "name": "string", "type": "string", "required": true, "notes": "string" }],
        "relationships": "string",
        "indexes": ["string"]
      }
    ]
  },
  "api": [
    {
      "method": "string",
      "path": "string",
      "purpose": "string",
      "authRequired": true,
      "requestBody": "string or JSON example",
      "response": "string or JSON example",
      "errors": ["string"]
    }
  ],
  "folderStructure": {
    "tree": "string (ascii folder tree)",
    "explanation": [{ "path": "string", "purpose": "string" }]
  },
  "phases": [
    {
      "name": "string",
      "goal": "string",
      "steps": [
        {
          "title": "string",
          "goal": "string",
          "skillsUsed": ["string"],
          "filesInvolved": ["string"],
          "implementation": "string (specific, actionable)",
          "why": "string",
          "expectedResult": "string"
        }
      ]
    }
  ],
  "technologyChoices": [
    {
      "decision": "string, e.g. 'Authentication strategy'",
      "options": [
        { "name": "string", "bestWhen": "string" }
      ],
      "recommended": "string",
      "reasoning": "string"
    }
  ],
  "learningGaps": [
    {
      "skill": "string",
      "why": "string",
      "usedWhere": "string",
      "difficulty": "Beginner | Intermediate | Advanced",
      "learningOrder": ["string"],
      "canLearnWhileBuilding": true
    }
  ],
  "testing": {
    "unit": ["string"],
    "api": ["string"],
    "integration": ["string"],
    "ui": ["string"],
    "edgeCases": ["string"]
  },
  "security": ["string"],
  "deployment": {
    "frontend": ["string"],
    "backend": ["string"],
    "database": ["string"],
    "environmentVariables": ["string"],
    "productionChecklist": ["string"]
  },
  "finalChecklist": ["string"]
}

- Respond with the JSON object and nothing else.`;
}

function validateRoadmapShape(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Roadmap response is not a JSON object");
  }

  const missingFields = REQUIRED_ROADMAP_FIELDS.filter((f) => !(f in parsed));
  if (missingFields.length > 0) {
    throw new Error(`Roadmap JSON is missing fields: ${missingFields.join(", ")}`);
  }

  if (
    !parsed.projectOverview ||
    typeof parsed.projectOverview !== "object" ||
    !parsed.projectOverview.name
  ) {
    throw new Error("Roadmap 'projectOverview' is missing or invalid");
  }

  if (!Array.isArray(parsed.phases) || parsed.phases.length === 0) {
    throw new Error("Roadmap 'phases' must be a non-empty array");
  }
  parsed.phases.forEach((phase, index) => {
    if (!phase || !Array.isArray(phase.steps)) {
      throw new Error(`Roadmap phase at index ${index} is missing a valid 'steps' array`);
    }
  });

  if (!Array.isArray(parsed.skillMapping)) {
    throw new Error("Roadmap 'skillMapping' must be an array");
  }

  if (!Array.isArray(parsed.finalChecklist) || parsed.finalChecklist.length === 0) {
    throw new Error("Roadmap 'finalChecklist' must be a non-empty array");
  }

  return parsed;
}

async function callGeminiForRoadmap(prompt) {
  try {
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
    return validateRoadmapShape(parsed);
  } catch (err) {
    // Same quota/rate-limit detection used for project generation, so a
    // roadmap request never burns a wasted retry against a dead quota.
    const message = err?.message || "";
    if (message.includes("RESOURCE_EXHAUSTED") || message.includes("429") || message.includes("quota")) {
      const quotaError = new Error("QUOTA_EXCEEDED");
      quotaError.isQuotaError = true;
      throw quotaError;
    }
    throw err;
  }
}

async function generateRoadmap(input, { maxAttempts = 2 } = {}) {
  const prompt = buildRoadmapPrompt(input);
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await callGeminiForRoadmap(prompt);
    } catch (err) {
      lastError = err;
      console.warn(`Gemini roadmap attempt ${attempt} failed: ${err.message}`);
      if (err.isQuotaError) break;
    }
  }
  throw lastError;
}

module.exports = {
  generateProjects,
  buildPrompt,
  generateRoadmap,
  buildRoadmapPrompt,
  validateRoadmapShape,
};