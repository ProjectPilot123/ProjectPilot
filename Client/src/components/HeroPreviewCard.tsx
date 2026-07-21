import React from 'react';
import Button from './button';

const HeroPreviewCard: React.FC = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 w-full max-w-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Your Skills:</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-indigo-600/30 text-indigo-300 text-sm rounded-full">React</span>
        <span className="px-3 py-1 bg-green-600/30 text-green-300 text-sm rounded-full">Python</span>
        <span className="px-3 py-1 bg-blue-600/30 text-blue-300 text-sm rounded-full">Machine Learning</span>
      </div>

      <Button variant="primary" className="w-full mb-6">
        Generate
      </Button>

      <h3 className="text-xl font-semibold text-white mb-4">AI Suggestions:</h3>
      <ul className="space-y-3">
        <li className="bg-gray-700 p-3 rounded-lg text-gray-200">1. Smart Attendance System</li>
        <li className="bg-gray-700 p-3 rounded-lg text-gray-200">2. AI Resume Analyzer</li>
        <li className="bg-gray-700 p-3 rounded-lg text-gray-200">3. Learning Platform</li>
      </ul>
    </div>
  );
};

export default HeroPreviewCard;
