import { useEffect,useState } from "react";

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
  const [experience, setExperience] = useState("");

  const [interests, setInterests] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);

  const [duration, setDuration] = useState("");

  const [platform, setPlatform] = useState<string[]>([]);



  const nextStep = () => {

    if(currentStep < totalSteps){

      setCurrentStep(currentStep + 1);

    }
    else{

      console.log({
        skills,
        experience,
        interests,
        techStack,
        duration,
        platform
      });

      // later navigate to results page

    }

  };



  const previousStep = () => {

    if(currentStep > 1){

      setCurrentStep(currentStep - 1);

    }

  };



  return (

    <div className="dashboard">

      <div className="dashboard-container">


        <div className="dashboard-header">

          <h1>
            Tell us about your project
          </h1>


          <p>
            Answer a few questions and let AI suggest projects for you.
          </p>

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
                "Spring Boot"
              ]}

              selected={skills}

              onChange={setSkills}

            />

          )}



          {currentStep === 2 && (

            <ThemeSelect

              title="Experience Level"

              options={[
                "Beginner",
                "Intermediate",
                "Advanced"
              ]}

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
                "Productivity"
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
                "Next.js"
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
                "3+ Months"
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
                "CLI"
              ]}

              selected={platform}

              onChange={setPlatform}

            />

          )}



        </StepCard>




        <div className="dashboard-buttons">


          <button

            className="dashboard-btn secondary"

            onClick={previousStep}

            disabled={currentStep === 1}

          >

            Previous

          </button>




          <button

            className="dashboard-btn primary"

            onClick={nextStep}

          >

            {
              currentStep === totalSteps
              ? "Generate Projects"
              : "Next"
            }


          </button>


        </div>


      </div>


    </div>

  );

}


export default Dashboard;