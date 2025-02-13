import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onSignIn: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navbar({ onSignIn, searchQuery, onSearchChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    setIsMenuOpen(false); // Close mobile menu if open
    onSignIn(); // Show sign in modal
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <button 
              onClick={() => navigate('/')} 
              className="group flex items-center space-x-2 focus:outline-none"
            >
              <div className="relative">
                <div className="text-2xl font-bold text-orange-500 transform transition-all duration-300 group-hover:scale-110">
                  Social
                  <span className="text-gray-700">Hub</span>
                </div>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></div>
              </div>
              <div className="hidden md:block">
                <svg 
                  className="w-6 h-6 text-orange-500 transform transition-transform duration-300 group-hover:rotate-180" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </button>
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search events..."
                className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="hidden md:block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
              onClick={handleSignIn}
            >
              Sign In
            </button>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="py-4 space-y-4">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <button
              className="w-full bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              onClick={handleSignIn}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 