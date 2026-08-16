import { useLocation, useNavigate } from "react-router-dom";
import ResultProjectCard from "../components/ResultProjectCard";
import "./ResultsPage.css";

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("🔥 RESULTS PAGE LOADED");
  console.log("🔥 LOCATION STATE:", location.state);

  const state = location.state as {
    projects?: any[];
    skills?: string[];
    experienceLevel?: string;
  } | null;

  const projects = state?.projects ?? [];
  const skills = state?.skills ?? [];
  const experienceLevel = state?.experienceLevel ?? "Beginner";

  console.log("🔥 PROJECTS:", projects);

  const handleSave = async (project: any) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/saved-projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });

    if (!res.ok) {
      throw new Error(`Save failed with status ${res.status}`);
    }

    const data = await res.json();
    console.log("Project saved:", data);
    alert("Project saved successfully!");
  } catch (err) {
    console.error("Error saving project:", err);
    alert("Failed to save project. Please try again.");
  }
};

  return (
    <div className="results-page">
      <div className="results-container">

        <header className="results-header">
          <h1 className="results-title">
            Your Generated Projects
          </h1>

          <p className="results-subtitle">
            AI-generated project ideas based on your selections
          </p>
        </header>

        {projects.length === 0 ? (
          <div className="results-empty-state">
            <h2 className="results-empty-title">
              No projects found
            </h2>

            <p className="results-empty-subtext">
              The AI didn't return any projects.
            </p>

            <button
              className="results-btn results-btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="results-projects-grid">
            {projects.map((project, index) => (
              <ResultProjectCard
                key={project._id || project.id || `project-${index}`}
                project={project}
                skills={skills}
                experienceLevel={experienceLevel}
                onSave={handleSave}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default ResultsPage;