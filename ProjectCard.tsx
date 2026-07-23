import type { Project } from './types';

interface ProjectCardProps {
  project: Project;
  onRemove: (id: string) => void;
}

function ProjectCard({ project, onRemove }: ProjectCardProps) {
  return (
    <div className="profile-project-card">
      <button
        type="button"
        className="profile-bookmark-btn"
        aria-label={`Remove ${project.title} from saved projects`}
        onClick={() => onRemove(project.id)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6 3a2 2 0 0 0-2 2v16l8-5 8 5V5a2 2 0 0 0-2-2H6Z" />
        </svg>
      </button>

      <h3 className="profile-project-title">{project.title}</h3>
      <p className="profile-project-description">{project.description}</p>

      <div className="profile-project-tags">
        {project.tags.map((tag) => (
          <span key={tag} className="profile-project-tag">
            {tag}
          </span>
        ))}
      </div>

      <a
        className="profile-btn profile-btn-primary profile-project-view-btn"
        href={project.projectUrl ?? '#'}
      >
        View Project
      </a>
    </div>
  );
}

export default ProjectCard;
