import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import "./ResultsPage.css";

interface SavedProject {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  techStack: string[];
  estimatedDays: string;
  roadmap: string[];
  resumeValue: string;
  uniqueSellingPoint: string;
}

function SavedProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/saved-projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.projects);
        } else {
          setError(data.message || "Could not load saved projects.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong while loading saved projects.");
        setLoading(false);
      });
  }, [navigate]);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/saved-projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.message || "Could not delete project.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting.");
    }
  };

  return (
    <div className="results-page">
      <div className="results-container">
        <header className="results-header">
          <h1 className="results-title">Your Saved Projects</h1>
          <p className="results-subtitle">
            Projects you've saved for later
          </p>
        </header>

        <section className="results-projects-section">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "#ff4d4f" }}>{error}</p>
          ) : projects.length === 0 ? (
            <p>You haven't saved any projects yet.</p>
          ) : (
            <div className="results-projects-grid">
              {projects.map((project) => (
                <div key={project._id} className="results-project-card">
                  <span className="results-difficulty-badge">
                    {project.difficulty}
                  </span>

                  <h3 className="results-project-title">{project.title}</h3>
                  <p className="results-project-description">
                    {project.description}
                  </p>

                  <div className="results-project-tags">
                    {project.techStack.map((skill) => (
                      <span key={skill} className="results-project-tag">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="results-btn results-btn-primary results-project-view-btn"
                    onClick={() => handleDelete(project._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default SavedProjectsPage;