import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/auth';
import { AuthService } from '../../services/auth.service';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthenticatedNavbarProps {
  user: User | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
}

export function AuthenticatedNavbar({ user, searchQuery, onSearchChange, onLogout }: AuthenticatedNavbarProps) {
  const { isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (user) {
      setIsProfileDropdownOpen(false);
      setIsMenuOpen(false);
      navigate('/profile');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-lg'
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4 lg:space-x-8">
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
            {/* Search Bar */}
            <div className="hidden md:block relative w-72">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Etkinlik ara..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-orange-400/50 focus:shadow-lg focus:shadow-orange-500/20 dark:focus:shadow-orange-400/20 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 group">
              <span className="relative inline-flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Etkinliklerim
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 dark:bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
            <button
              className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 group"
              onClick={() => navigate('/create-event')}
            >
              <span className="relative inline-flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Etkinlik Oluştur
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 dark:bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 focus:outline-none group"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <div className="relative">
                  <img
                    src={user.profilePhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-orange-500 dark:group-hover:border-orange-400 transition-all duration-200"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 dark:bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">{`${user.firstName} ${user.lastName}`}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800/95 rounded-xl shadow-lg dark:shadow-2xl shadow-gray-200/20 dark:shadow-black/20 py-2 animate-in fade-in duration-200 origin-top border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Giriş yapıldı</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 flex items-center space-x-3 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profilim</span>
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 flex items-center space-x-3 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      <span>Biletlerim</span>
                    </button>
                  </div>
                  <div className="py-2 border-t border-gray-100 dark:border-gray-700/50">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center space-x-3 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="py-4 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Etkinlik ara..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/95 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 placeholder-gray-500 dark:placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-3 px-2">
              <img
                src={user.profilePhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full border-2 border-transparent"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {`${user.firstName} ${user.lastName}`}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full px-2 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors duration-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Etkinliklerim
              </button>
              <button
                className="w-full px-2 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors duration-200 flex items-center"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/create-event');
                }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Etkinlik Oluştur
              </button>
              <button
                className="w-full px-2 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors duration-200 flex items-center"
                onClick={handleProfileClick}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profilim
              </button>
              <button className="w-full px-2 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors duration-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Biletlerim
              </button>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700/50">
              <button
                className="w-full px-2 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors duration-200 flex items-center"
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout();
                }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 