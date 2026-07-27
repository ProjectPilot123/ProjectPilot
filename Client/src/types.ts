export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ProjectSeed {
  id: string;
  title: string;
  description: string;
  skills: string[];
  domain: string;
  difficulty: DifficultyLevel;
  projectUrl?: string;
}

export interface RecommendedProject extends ProjectSeed {
  matchScore: number;
}

export interface UserSelections {
  skills: string[];
  domain: string;
}
