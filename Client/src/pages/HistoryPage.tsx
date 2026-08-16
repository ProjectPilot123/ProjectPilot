import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import "./ResultsPage.css";

interface HistoryEntry {
    _id: string;
    input: {
        skills: string[];
        experienceLevel: string;
        interests: string[];
        techStack: string[];
        projectDuration: string;
        targetPlatform: string[];
    };
    generatedProjects: {
        title: string;
        description: string;
        difficulty: string;
        techStack: string[];
    }[];
    createdAt: string;
}

function HistoryPage() {
    const navigate = useNavigate();
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
            return;
        }

        const token = localStorage.getItem("token");

        fetch(`${import.meta.env.VITE_API_URL}/api/history`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setHistory(data.history);
                } else {
                    setError(data.message || "Could not load history.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Something went wrong while loading history.");
                setLoading(false);
            });
    }, [navigate]);

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                setHistory((prev) => prev.filter((h) => h._id !== id));
            } else {
                alert(data.message || "Could not delete history entry.");
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
                    <h1 className="results-title">Your Generation History</h1>
                    <p className="results-subtitle">
                        Past project ideas you've generated
                    </p>
                </header>

                <section className="results-projects-section">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p style={{ color: "#ff4d4f" }}>{error}</p>
                    ) : history.length === 0 ? (
                        <p>No generation history yet.</p>
                    ) : (
                        <div className="results-projects-grid">
                            {history.map((entry) => (
                                <div key={entry._id} className="results-project-card">
                                    <span className="results-difficulty-badge">
                                        {new Date(entry.createdAt).toLocaleDateString()}
                                    </span>

                                    <h3 className="results-project-title">
                                        {entry.generatedProjects.length} project(s) generated
                                    </h3>

                                    <p className="results-project-description">
                                        Experience: {entry.input.experienceLevel} | Duration: {entry.input.projectDuration}
                                    </p>

                                    <div className="results-project-tags">
                                        {entry.generatedProjects.map((p, i) => (
                                            <span key={i} className="results-project-tag">
                                                {p.title}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        className="results-btn results-btn-primary results-project-view-btn"
                                        onClick={() => handleDelete(entry._id)}
                                    >
                                        Delete
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

export default HistoryPage;
