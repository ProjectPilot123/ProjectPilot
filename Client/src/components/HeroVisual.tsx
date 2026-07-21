import React from 'react';

const HeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto mt-12 md:mt-0 md:ml-12 lg:max-w-xl animate-fade-in-up">
      {/* Main card - simulating a project dashboard preview */}
      <div className="relative bg-gray-800/70 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-gray-700 transform rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <span className="text-sm text-gray-400">Project Dashboard</span>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <h4 className="text-lg font-semibold text-white mb-2">AI Chatbot for Customer Support</h4>
          <p className="text-gray-400 text-sm">Build a smart chatbot using natural language processing to handle customer inquiries efficiently.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-1 bg-indigo-600/30 text-indigo-300 text-xs rounded-md">React</span>
            <span className="px-2 py-1 bg-green-600/30 text-green-300 text-xs rounded-md">Node.js</span>
            <span className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-md">NLP</span>
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-white mb-2">Personalized Learning Platform</h4>
          <p className="text-gray-400 text-sm">Develop an adaptive e-learning system that tailors content based on user progress and preferences.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-md">Python</span>
            <span className="px-2 py-1 bg-yellow-600/30 text-yellow-300 text-xs rounded-md">Machine Learning</span>
          </div>
        </div>
      </div>

      {/* Floating smaller card 1 */}
      <div className="absolute -top-8 -left-8 w-48 bg-indigo-700/50 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-indigo-600 transform -rotate-6 hover:rotate-0 transition-transform duration-500 ease-in-out animate-float-1">
        <p className="text-white text-sm font-medium">"Generate ideas in seconds!"</p>
      </div>

      {/* Floating smaller card 2 */}
      <div className="absolute -bottom-8 -right-8 w-48 bg-green-700/50 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-green-600 transform rotate-6 hover:rotate-0 transition-transform duration-500 ease-in-out animate-float-2">
        <p className="text-white text-sm font-medium">"Tailored to your skills."</p>
      </div>
    </div>
  );
};

export default HeroVisual;
