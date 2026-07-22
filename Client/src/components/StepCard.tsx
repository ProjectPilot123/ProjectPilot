import "./StepCard.css";

interface StepCardProps {
  children: React.ReactNode;
}

function StepCard({
  children,
}: StepCardProps) {

  return (
    <div className="step-card">

      {children}

    </div>
  );
}

export default StepCard;