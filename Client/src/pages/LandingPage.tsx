import React from 'react';
import Navbar from '../components/NavBar';
import Button from '../components/Button';
import FeatureCard from '../components/FeatureCard';
import HeroPreviewCard from '../components/HeroPreviewCard';

// Icons for Feature Cards (using simple emojis for now, can be replaced with SVG/React Icons)
const icons = {
  personalized: '💡',
  aiRecommendations: '🤖',
  saveProjects: '🔖',
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans relative">
      {/* 1. Navbar Section */}
      <Navbar />

      {/* Main Content Wrapper */}
      <main className="relative z-10 pt-20">
        {/* 2. Hero Section */}
        <section className="max-w-7xl mx-auto px-8 lg:px-12 pt-20 pb-10 min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-16">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Generate Your Perfect Project Idea With <span className="text-indigo-500">AI</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
              Stop searching endlessly. Get tailored project ideas based on your skills and interests, designed to help you learn and succeed.
            </p>
            <Button variant="primary" size="lg">
              Generate Ideas
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <HeroPreviewCard />
          </div>
        </section>

        {/* 3. Features Section */}
        <section 
          id="features" 
          className="mt-24 py-20 bg-gray-800 border-t border-b border-gray-700">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center">
              <FeatureCard
                icon={icons.personalized}
                title="Personalized Ideas"
                description="Tell us your skills and interests, and our AI will craft unique project ideas just for you."
              />
              <FeatureCard
                icon={icons.aiRecommendations}
                title="AI Recommendations"
                description="Leverage intelligent suggestions to find projects that match your learning goals."
              />
              <FeatureCard
                icon={icons.saveProjects}
                title="Save Your Projects"
                description="Keep track of your favorite ideas and revisit them anytime to start building."
              />
            </div>
          </div>
        </section>

        {/* 4. About Section */}
        <section id="about" className="container mx-auto px-4 py-16 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-white mb-8">
            About the Platform
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            AI Project Generator is built for students and developers looking for their next coding challenge. Our platform simplifies the process of finding relevant project ideas, providing clear descriptions and potential learning outcomes. Focus on building, not brainstorming.
          </p>
        </section>
      </main>

      {/* 5. Footer Section */}
      <footer className="bg-gray-900 py-8 border-t border-gray-800 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} AI Project Generator. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors text-sm">
              About
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors text-sm">
              Contact
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors text-sm">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
