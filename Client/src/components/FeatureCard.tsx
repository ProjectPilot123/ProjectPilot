import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode; // For simplicity, passing ReactNode for icon
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="p-6 rounded-lg border border-gray-700 bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="text-indigo-400 mb-4 text-3xl">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-base">{description}</p>
    </div>
  );
};

export default FeatureCard;
