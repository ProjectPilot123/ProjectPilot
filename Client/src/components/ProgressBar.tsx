import "./ProgressBar.css";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {

  const progress =
    (currentStep / totalSteps) * 100;

  return (
    <div className="progress-wrapper">

      <div className="progress-info">

        <span>
          Step {currentStep} of {totalSteps}
        </span>

        <span>
          {Math.round(progress)}%
        </span>

      </div>


      <div className="progress-track">

        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}

export default ProgressBar;