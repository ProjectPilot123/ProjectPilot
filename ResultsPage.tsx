import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ResultProjectCard from './ResultProjectCard';
import EmptyResultsState from './EmptyResultsState';
import { getRecommendedProjects } from './matchProjects';
import type { UserSelections } from './types';
import './ResultsPage.css';

// TODO: point this at whichever route actually collects skills/domain input
// (e.g. a "/select-skills" form page). navigate(-1) is used as a safe
// default so "Edit Selections" just returns to wherever the user came from.

interface LocationState {
  skills?: string[];
  domain?: string;
}

function useUserSelections(): UserSelections {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const state = (location.state ?? {}) as LocationState;

    if (state.skills?.length && state.domain) {
      return { skills: state.skills, domain: state.domain };
    }

    const skillsParam = searchParams.get('skills');
    const domainParam = searchParams.get('domain');

    if (skillsParam && domainParam) {
      return {
        skills: skillsParam.split(',').map((s) => s.trim()).filter(Boolean),
        domain: domainParam,
      };
    }

    // Fallback example selections so the page is never blank if visited
    // directly during development.
    return { skills: ['React', 'JavaScript'], domain: 'Web Development' };
  }, [location.state, searchParams]);
}

function ResultsPage() {
  const navigate = useNavigate();
  const selections = useUserSelections();
  const recommendedProjects = useMemo(
    () => getRecommendedProjects(selections),
    [selections],
  );

  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleEditSelections = () => {
    navigate(-1);
  };

  return (
    <div className="results-page">
      <div className="results-container">
        <header className="results-header">
          <h1 className="results-title">Recommended Projects for You</h1>
          <p className="results-subtitle">
            Based on your selected skills and domain of interest
          </p>

          <div className="results-selection-summary">
            <div className="results-selection-group">
              <span className="results-selection-label">Domain</span>
              <span className="results-domain-chip">{selections.domain}</span>
            </div>
            <div className="results-selection-group">
              <span className="results-selection-label">Skills</span>
              <div className="results-skill-chips">
                {selections.skills.map((skill) => (
                  <span key={skill} className="results-skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="results-btn results-btn-secondary"
              onClick={handleEditSelections}
            >
              Edit Selections
            </button>
          </div>
        </header>

        <section className="results-projects-section">
          {recommendedProjects.length === 0 ? (
            <EmptyResultsState onEditSelections={handleEditSelections} />
          ) : (
            <div className="results-projects-grid">
              {recommendedProjects.map((project) => (
                <ResultProjectCard
                  key={project.id}
                  project={project}
                  isSaved={savedIds.has(project.id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ResultsPage;
