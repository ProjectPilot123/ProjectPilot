interface EmptyStateProps {
  onExplore: () => void;
}

function EmptyState({ onExplore }: EmptyStateProps) {
  return (
    <div className="profile-empty-state">
      <div className="profile-empty-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 3a2 2 0 0 0-2 2v16l8-5 8 5V5a2 2 0 0 0-2-2H6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="profile-empty-title">No saved projects yet</h3>
      <p className="profile-empty-subtext">
        Explore projects and save the ones you&apos;d like to work on.
      </p>
      <button
        type="button"
        className="profile-btn profile-btn-primary"
        onClick={onExplore}
      >
        Explore Projects
      </button>
    </div>
  );
}

export default EmptyState;
