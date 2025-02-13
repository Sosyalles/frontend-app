import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/auth';
import { AuthService } from '../../services/auth.service';

interface AuthenticatedNavbarProps {
  user: User;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
}

export function AuthenticatedNavbar({ user, searchQuery, onSearchChange, onLogout }: AuthenticatedNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-600 hover:text-orange-500 transition-colors">
              My Events
            </button>
            <button 
              className="text-gray-600 hover:text-orange-500 transition-colors"
              onClick={() => navigate('/create-event')}
            >
              Create Event
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <img
                  src={user.profilePhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">{`${user.firstName} ${user.lastName}`}</span>
              </button>
              
              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <button 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      navigate('/profile');
                    }}
                  >
                    Profile Settings
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50">
                    My Tickets
                  </button>
                  <hr className="my-2" />
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="py-4 space-y-4">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="flex items-center space-x-3 px-2">
              <img
                src={user.profilePhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700">{`${user.firstName} ${user.lastName}`}</span>
            </div>
            <hr />
            <button className="w-full text-left px-2 py-2 text-gray-600 hover:text-orange-500">
              My Events
            </button>
            <button 
              className="w-full text-left px-2 py-2 text-gray-600 hover:text-orange-500"
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/create-event');
              }}
            >
              Create Event
            </button>
            <button className="w-full text-left px-2 py-2 text-gray-600 hover:text-orange-500">
              Profile Settings
            </button>
            <button className="w-full text-left px-2 py-2 text-gray-600 hover:text-orange-500">
              My Tickets
            </button>
            <hr />
            <button
              className="w-full text-left px-2 py-2 text-red-600 hover:text-red-700"
              onClick={onLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 