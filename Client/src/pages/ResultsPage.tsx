import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultProjectCard from '../components/ResultProjectCard';
import EmptyResultsState from '../components/EmptyResultsState';
import type { RecommendedProject } from '../utils/types';
import './ResultsPage.css';

interface LocationState {
  projects?: any[];
}

interface DisplayProject extends RecommendedProject {
  estimatedDays?: string;
  roadmap?: string[];
  resumeValue?: string;
  uniqueSellingPoint?: string;
}

function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const rawProjects = (location.state as LocationState)?.projects ?? [];

  const recommendedProjects: DisplayProject[] = useMemo(() => {
    return rawProjects.map((p, index) => ({
      id: p.id ?? `project-${index}`,
      title: p.title ?? 'Untitled Project',
      description: p.description ?? p.pitch ?? '',
      skills: p.techStack ?? p.skills ?? [],
      domain: p.domain ?? '',
      difficulty: p.difficulty ?? 'Intermediate',
      projectUrl: p.projectUrl,
      matchScore: 100,
      estimatedDays: p.estimatedDays,
      roadmap: p.roadmap,
      resumeValue: p.resumeValue,
      uniqueSellingPoint: p.uniqueSellingPoint,
    }));
  }, [rawProjects]);

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

  const handleSaveProject = async (project: DisplayProject) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/saved-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          techStack: project.skills,
          estimatedDays: project.estimatedDays,
          roadmap: project.roadmap,
          resumeValue: project.resumeValue,
          uniqueSellingPoint: project.uniqueSellingPoint,
        })
      });

      const data = await res.json();

      if (data.success) {
        handleToggleSave(project.id);
        alert("Project saved successfully!");
      } else {
        alert(data.message || "Could not save project.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving.");
    }
  };

  const handleEditSelections = () => {
    navigate('/dashboard');
  };

  return (
    <div className="results-page">
      <div className="results-container">
        <header className="results-header">
          <h1 className="results-title">Your Generated Projects</h1>
          <p className="results-subtitle">
            AI-generated project ideas based on your selections
          </p>
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
                  onSave={handleSaveProject}
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