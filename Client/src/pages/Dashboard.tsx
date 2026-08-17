import { useEffect, useState } from "react";

import ProgressBar from "../components/ProgressBar";
import StepCard from "../components/StepCard";
import MultiSelect from "../components/MultiSelect";
import ThemeSelect from "../components/ThemeSelect";

import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getProfile } from "../utils/auth";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    getProfile().catch(() => {
      localStorage.removeItem("token");
      navigate("/login");
    });
  }, [navigate]);

  const totalSteps = 6;

  const [currentStep, setCurrentStep] = useState(1);

  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState("Beginner");

  const [interests, setInterests] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);

  const [duration, setDuration] = useState("1 Week");

  const [platform, setPlatform] = useState<string[]>([]);

  const [errorMessage, setErrorMessage] = useState("");

  // NEW: tracks whether we're waiting on the AI to generate projects
  const [isGenerating, setIsGenerating] = useState(false);

  const nextStep = async () => {
    if (currentStep === 1 && skills.length === 0) {
      setErrorMessage("Please select at least one skill to continue.");
      return;
    }

    if (currentStep === 2 && experience === "") {
      setErrorMessage("Please select your experience level to continue.");
      return;
    }

    if (currentStep === 3 && interests.length === 0) {
      setErrorMessage("Please select at least one area of interest to continue.");
      return;
    }

    if (currentStep === 4 && techStack.length === 0) {
      setErrorMessage("Please select at least one tech stack to continue.");
      return;
    }

    if (currentStep === 5 && duration === "") {
      setErrorMessage("Please select a project duration to continue.");
      return;
    }

    if (currentStep === 6 && platform.length === 0) {
      setErrorMessage("Please select at least one target platform to continue.");
      return;
    }

    setErrorMessage("");

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }

    else {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("You are not logged in. Please log in again.");
        navigate("/login");
        return;
      }

      setIsGenerating(true); // start loading state

      try {
        console.log("🚀 Starting project generation...");

        const requestBody = {
          skills,
          experienceLevel: experience,
          interests,
          techStack,
          projectDuration: duration,
          targetPlatform: platform,
        };

        console.log("📤 Sending:", requestBody);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/generate-projects`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          }
        );

        console.log("📥 Response status:", response.status);

        const data = await response.json();

        console.log("📦 Backend response:", data);

        if (!response.ok) {
          setErrorMessage(
            data.error ||
            data.message ||
            "Failed to generate projects."
          );
          return;
        }

        if (!data.success) {
          setErrorMessage(
            data.error ||
            data.message ||
            "Project generation failed."
          );
          return;
        }

        if (!Array.isArray(data.projects)) {
          console.error("❌ Invalid projects:", data.projects);
          setErrorMessage("No projects were returned by the AI.");
          return;
        }

        console.log("✅ Projects generated:", data.projects);

        navigate("/results", {
          state: {
            projects: data.projects,
            skills,
            experienceLevel: experience,
          },
        });

      } catch (error) {
        console.error("❌ Generation request failed:", error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while generating projects."
        );
      } finally {
        setIsGenerating(false); // stop loading state, success or fail
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrorMessage("");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Tell us about your project</h1>
          <p>Answer a few questions and let AI suggest projects for you.</p>
        </div>

        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        <StepCard>
          {currentStep === 1 && (
            <MultiSelect
              title="Select Your Skills"
              options={[
                "C",
                "C++",
                "Java",
                "Python",
                "JavaScript",
                "TypeScript",
                "React",
                "Node.js",
                "Express",
                "MongoDB",
                "SQL",
                "Flutter",
                "Django",
                "Spring Boot",
              ]}
              selected={skills}
              onChange={setSkills}
            />
          )}

          {currentStep === 2 && (
            <ThemeSelect
              title="Experience Level"
              options={["Beginner", "Intermediate", "Advanced"]}
              value={experience}
              onChange={setExperience}
            />
          )}

          {currentStep === 3 && (
            <MultiSelect
              title="Areas of Interest"
              options={[
                "AI / ML",
                "Web Development",
                "Mobile Development",
                "Cyber Security",
                "Cloud Computing",
                "DevOps",
                "Blockchain",
                "Data Science",
                "IoT",
                "Productivity",
              ]}
              selected={interests}
              onChange={setInterests}
            />
          )}

          {currentStep === 4 && (
            <MultiSelect
              title="Preferred Tech Stack"
              options={[
                "MERN",
                "MEAN",
                "Flutter",
                "React Native",
                "Django",
                "Spring Boot",
                ".NET",
                "Next.js",
              ]}
              selected={techStack}
              onChange={setTechStack}
            />
          )}

          {currentStep === 5 && (
            <ThemeSelect
              title="Project Duration"
              options={[
                "1 Week",
                "2 Weeks",
                "1 Month",
                "2 Months",
                "3+ Months",
              ]}
              value={duration}
              onChange={setDuration}
            />
          )}

          {currentStep === 6 && (
            <MultiSelect
              title="Target Platform"
              options={[
                "Web",
                "Mobile",
                "Desktop",
                "AI Model",
                "API",
                "CLI",
              ]}
              selected={platform}
              onChange={setPlatform}
            />
          )}
        </StepCard>

        {errorMessage && (
          <p
            style={{
              color: "#ff4d4f",
              marginTop: "10px",
              fontSize: "14px",
            }}
          >
            {errorMessage}
          </p>
        )}

        {/* NEW: loading message shown only while generating */}
        {isGenerating && (
          <p
            style={{
              color: "#6ee7d8",
              marginTop: "10px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span className="dashboard-spinner" />
            Generating your projects... this can take a few seconds.
          </p>
        )}

        <div className="dashboard-buttons">
          <button
            className="dashboard-btn secondary"
            onClick={previousStep}
            disabled={currentStep === 1 || isGenerating}
          >
            Previous
          </button>

          <button
            className="dashboard-btn primary"
            onClick={nextStep}
            disabled={isGenerating}
          >
            {isGenerating
              ? "Generating..."
              : currentStep === totalSteps
              ? "Generate Projects"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;