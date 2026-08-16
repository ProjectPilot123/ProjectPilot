import { useNavigate } from "react-router-dom";

interface Project {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  technologies?: unknown;
  techStack?: unknown;
  skills?: unknown;
  difficulty?: string;
  domain?: string;
  projectUrl?: string;
  estimatedDays?: string;
  roadmap?: string[];
  resumeValue?: string;
  uniqueSellingPoint?: string;
}

interface ResultProjectCardProps {
  project: Project;
  skills?: string[];
  experienceLevel?: string;
  onSave?: (project: Project) => void;
  isSaved?: boolean;
}

const ResultProjectCard = ({
  project,
  skills = [],
  experienceLevel = "",
  onSave,
  isSaved = false,
}: ResultProjectCardProps) => {
  const navigate = useNavigate();

  const title = project.title || project.name || "Untitled Project";

  // Safely handle whatever Gemini sends
  const rawTechnologies =
    project.technologies ??
    project.techStack ??
    project.skills ??
    [];

  const technologies: string[] = Array.isArray(rawTechnologies)
    ? rawTechnologies.map(String)
    : [];

  const handleViewRoadmap = () => {
    console.log("Opening roadmap for:", project);

    navigate("/roadmap", {
      state: {
        project,
        skills,
        experienceLevel,
      },
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(project);
    }
  };

  return (
    <div className="results-project-card">
      {project.difficulty && (
        <span className="results-difficulty-badge">
          {project.difficulty}
        </span>
      )}

      <h3 className="results-project-title">
        {title}
      </h3>

      {project.description && (
        <p className="results-project-description">
          {project.description}
        </p>
      )}

      {technologies.length > 0 && (
        <div className="results-project-tags">
          {technologies.map((technology, index) => (
            <span
              key={`${technology}-${index}`}
              className="results-project-tag"
            >
              {technology}
            </span>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "8px",
        }}
      >
        <button
          type="button"
          onClick={handleViewRoadmap}
          className="results-btn results-btn-primary results-project-view-btn"
        >
          View Roadmap
        </button>

        {onSave && (
          <button
            type="button"
            onClick={handleSave}
            className="results-btn results-btn-secondary"
          >
            {isSaved ? "Saved ✓" : "Save Project"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultProjectCard;