import React from 'react';
import Button from './Button';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed w-full z-40 top-0 bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold text-white">
          AI Project Generator
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
            Home
          </a>
          <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
            Features
          </a>
          <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
            About
          </a>
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button variant="primary" size="sm">
            Signup
          </Button>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          {/* This would typically be a hamburger icon that toggles a mobile menu */}
          <button className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-md hover:bg-gray-700/50 transition-colors duration-200">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
