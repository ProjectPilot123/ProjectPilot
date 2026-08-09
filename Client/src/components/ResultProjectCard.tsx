import type { RecommendedProject } from '../utils/types';

interface ResultProjectCardProps {
  project: RecommendedProject;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSave: (project: any) => void;
}

function ResultProjectCard({
  project,
  isSaved,
  onToggleSave,
  onSave,
}: ResultProjectCardProps) {
  return (
    <div className="results-project-card">
      <button
        type="button"
        className={`results-bookmark-btn${isSaved ? ' results-bookmark-btn-active' : ''}`}
        aria-label={
          isSaved
            ? `Remove ${project.title} from saved projects`
            : `Save ${project.title} to your profile`
        }
        onClick={() => onToggleSave(project.id)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 3a2 2 0 0 0-2 2v16l8-5 8 5V5a2 2 0 0 0-2-2H6Z"
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span className="results-difficulty-badge">{project.difficulty}</span>

      <h3 className="results-project-title">{project.title}</h3>
      <p className="results-project-description">{project.description}</p>

      <div className="results-project-tags">
        {project.skills.map((skill) => (
          <span key={skill} className="results-project-tag">
            {skill}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="results-btn results-btn-primary results-project-view-btn"
        onClick={() => onSave(project)}
      >
        {isSaved ? 'Saved ✓' : 'Save Project'}
      </button>
    </div>
  );
}

export default ResultProjectCard;