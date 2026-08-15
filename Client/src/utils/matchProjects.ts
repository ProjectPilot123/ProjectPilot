import { projectCatalog } from './projectCatalog';
import type { RecommendedProject, UserSelections } from './types';

const DOMAIN_MATCH_WEIGHT = 2;
const SKILL_MATCH_WEIGHT = 1;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Scores every project in the catalog against the user's selected skills and
 * domain, then returns only the projects with a positive score, sorted best
 * match first. A domain match counts for more than a single skill overlap,
 * since it's a stronger signal of relevance.
 */
export function getRecommendedProjects(
  selections: UserSelections,
): RecommendedProject[] {
  const selectedSkills = new Set(selections.skills.map(normalize));
  const selectedDomain = normalize(selections.domain);

  const scored: RecommendedProject[] = projectCatalog.map((project) => {
    const skillMatches = project.skills.filter((skill) =>
      selectedSkills.has(normalize(skill)),
    ).length;
    const domainMatches =
      selectedDomain && normalize(project.domain) === selectedDomain ? 1 : 0;

    const matchScore =
      skillMatches * SKILL_MATCH_WEIGHT + domainMatches * DOMAIN_MATCH_WEIGHT;

    return { ...project, matchScore };
  });

  return scored
    .filter((project) => project.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
