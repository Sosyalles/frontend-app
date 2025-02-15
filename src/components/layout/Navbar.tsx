import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

interface NavbarProps {
  onSignIn: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navbar({ onSignIn, searchQuery, onSearchChange }: NavbarProps) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'Tüm Etkinlikler', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Konserler', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { name: 'Spor', icon: 'M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Tiyatro', icon: 'M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z' },
    { name: 'Teknoloji', icon: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-lg'
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="group flex items-center space-x-1 focus:outline-none"
          >
            {/* <div className="relative overflow-hidden rounded-lg p-1 transition-all duration-300 group-hover:bg-gray-50/50 dark:group-hover:bg-gray-800/50 group-hover:[transform:rotateY(360deg)] [transform-style:preserve-3d] [transition:transform_0.6s]">
              <div className="flex items-center text-xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 dark:from-orange-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent bg-size-200 animate-gradient transform transition-all duration-300 group-hover:scale-110">
                  Social
                </span>
                <span className="mx-1 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-200 dark:via-white dark:to-gray-200 bg-clip-text text-transparent bg-size-200 animate-gradient transform transition-all duration-300 group-hover:scale-110">
                  Hub
                </span>
                <div className="relative ml-1 group-hover:animate-[spin_1s_ease-in-out]">
                  <svg 
                    className="w-5 h-5 text-orange-500 dark:text-orange-400 transform transition-all duration-500 group-hover:rotate-[720deg] group-hover:scale-125" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      className="animate-[dash_2s_ease-in-out_infinite]"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse rounded-full" />
                </div>
              </div>
            </div> */}
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200"
              >
                <span>Kategoriler</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Categories Dropdown */}
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 p-2 transform opacity-100 scale-100 transition-all duration-200">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                      </svg>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200">
              Yakındaki Etkinlikler
            </button>

            <button className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200">
              Takvim
            </button>

            <button className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200">
              Blog
            </button>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative transition-all duration-300 w-64">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className={`w-5 h-5 transition-colors duration-200 ${isSearchFocused
                    ? 'text-orange-500 dark:text-orange-400'
                    : 'text-gray-400 dark:text-gray-500'
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Etkinlik ara..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 transition-all duration-200
                  ${isSearchFocused
                    ? 'border-orange-500 dark:border-orange-400 bg-white dark:bg-gray-800 shadow-lg shadow-orange-500/20 dark:shadow-orange-400/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'
                  }
                  text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-orange-400/50`}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${isSearchFocused && searchQuery ? 'opacity-100' : 'opacity-0'}`}>
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={onSignIn}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 