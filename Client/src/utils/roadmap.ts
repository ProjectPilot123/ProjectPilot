import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/roadmap`;

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
export type ProgressStatus = "not_started" | "in_progress" | "completed";

export interface RoadmapSourceProject {
  title: string;
  description?: string;
  difficulty?: DifficultyLevel;
  techStack?: string[];
  estimatedDays?: string;
  resumeValue?: string;
  uniqueSellingPoint?: string;
  [key: string]: unknown;
}

export interface RoadmapProjectOverview {
  name: string;
  difficulty?: string;
  estimatedTime?: string;
  recommendedSkillLevel?: string;
  description?: string;
  mainTechnologies?: string[];
  optionalTechnologies?: string[];
  youWillLearn?: string[];
  outcome?: string;
}

export interface RoadmapPrerequisiteEntry {
  skill: string;
  why?: string;
}

export interface RoadmapSkillMappingEntry {
  technology: string;
  usedFor: string[];
}

export interface RoadmapArchitectureLayer {
  name: string;
  responsibility?: string;
  technology?: string;
}

export interface RoadmapFeature {
  name: string;
  description?: string;
  subFeatures?: string[];
  frontendWork?: string;
  backendWork?: string;
  databaseWork?: string;
  skillsUsed?: string[];
}

export interface RoadmapDatabaseField {
  name: string;
  type?: string;
  required?: boolean;
  notes?: string;
}

export interface RoadmapDatabaseCollection {
  name: string;
  fields?: RoadmapDatabaseField[];
  relationships?: string;
  indexes?: string[];
}

export interface RoadmapApiEndpoint {
  method: string;
  path: string;
  purpose?: string;
  authRequired?: boolean;
  requestBody?: string | Record<string, unknown>;
  response?: string | Record<string, unknown>;
  errors?: string[];
}

export interface RoadmapFolderStructure {
  tree?: string;
  explanation?: { path: string; purpose?: string }[];
}

export interface RoadmapStep {
  title: string;
  goal?: string;
  skillsUsed?: string[];
  filesInvolved?: string[];
  implementation?: string;
  why?: string;
  expectedResult?: string;
}

export interface RoadmapPhase {
  name: string;
  goal?: string;
  steps: RoadmapStep[];
}

export interface RoadmapTechnologyOption {
  name: string;
  bestWhen?: string;
}

export interface RoadmapTechnologyChoice {
  decision: string;
  options?: RoadmapTechnologyOption[];
  recommended?: string;
  reasoning?: string;
}

export interface RoadmapLearningGap {
  skill: string;
  why?: string;
  usedWhere?: string;
  difficulty?: string;
  learningOrder?: string[];
  canLearnWhileBuilding?: boolean;
}

export interface RoadmapTesting {
  unit?: string[];
  api?: string[];
  integration?: string[];
  ui?: string[];
  edgeCases?: string[];
}

export interface RoadmapDeployment {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  environmentVariables?: string[];
  productionChecklist?: string[];
}

export interface RoadmapContent {
  projectOverview: RoadmapProjectOverview;
  prerequisites?: {
    required?: RoadmapPrerequisiteEntry[];
    recommended?: RoadmapPrerequisiteEntry[];
  };
  skillMapping?: RoadmapSkillMappingEntry[];
  architecture?: {
    layers?: RoadmapArchitectureLayer[];
    dataFlow?: string;
    authFlow?: string;
  };
  features?: RoadmapFeature[];
  database?: {
    type?: string;
    reasoning?: string;
    collections?: RoadmapDatabaseCollection[];
  };
  api?: RoadmapApiEndpoint[];
  folderStructure?: RoadmapFolderStructure;
  phases: RoadmapPhase[];
  technologyChoices?: RoadmapTechnologyChoice[];
  learningGaps?: RoadmapLearningGap[];
  testing?: RoadmapTesting;
  security?: string[];
  deployment?: RoadmapDeployment;
  finalChecklist: string[];
}

export interface RoadmapProgressItem {
  itemId: string;
  section?: string;
  title: string;
  status: ProgressStatus;
  completedAt?: string | null;
}

export interface RoadmapDocument {
  _id: string;
  user: string;
  projectSignature: string;
  projectTitle: string;
  projectDifficulty?: DifficultyLevel;
  sourceProject: RoadmapSourceProject;
  userContext: {
    skills: string[];
    skillLevel: DifficultyLevel;
  };
  roadmap: RoadmapContent;
  progress: {
    items: RoadmapProgressItem[];
    percentComplete: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface RoadmapApiResponse {
  success: boolean;
  roadmap: RoadmapDocument;
  alreadyExisted?: boolean;
  message?: string;
  error?: string;
}

function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export const generateRoadmap = async (
  project: RoadmapSourceProject,
  skills: string[],
  experienceLevel: DifficultyLevel
) => {
  const res = await axios.post<RoadmapApiResponse>(
    `${API}/generate`,
    { project, skills, experienceLevel },
    authHeaders()
  );

  return res.data;
};

export const getRoadmapById = async (id: string) => {
  const res = await axios.get<RoadmapApiResponse>(
    `${API}/${id}`,
    authHeaders()
  );

  return res.data;
};

export const updateRoadmapProgress = async (
  id: string,
  update:
    | { itemId: string; status: ProgressStatus }
    | { items: { itemId: string; status: ProgressStatus }[] }
) => {
  const res = await axios.patch<RoadmapApiResponse>(
    `${API}/${id}/progress`,
    update,
    authHeaders()
  );

  return res.data;
};

export const regenerateRoadmap = async (id: string) => {
  const res = await axios.post<RoadmapApiResponse>(
    `${API}/${id}/regenerate`,
    {},
    authHeaders()
  );

  return res.data;
};