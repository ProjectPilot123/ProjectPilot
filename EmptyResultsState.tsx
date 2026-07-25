interface EmptyResultsStateProps {
  onEditSelections: () => void;
}

function EmptyResultsState({ onEditSelections }: EmptyResultsStateProps) {
  return (
    <div className="results-empty-state">
      <div className="results-empty-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="m20 20-3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h3 className="results-empty-title">No matching projects found</h3>
      <p className="results-empty-subtext">
        Try adjusting your skills or domain of interest to see more project
        ideas.
      </p>
      <button
        type="button"
        className="results-btn results-btn-primary"
        onClick={onEditSelections}
      >
        Edit Selections
      </button>
    </div>
  );
}

export default EmptyResultsState;
