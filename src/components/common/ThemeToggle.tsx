import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 shadow-lg dark:shadow-2xl shadow-gray-200/20 dark:shadow-black/20 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 transform hover:scale-105 z-50 group backdrop-blur-sm"
      aria-label={`${theme === 'light' ? 'Karanlık' : 'Aydınlık'} temaya geç`}
    >
      {theme === 'light' ? (
        <div className="relative">
          <svg className="w-6 h-6 transform transition-transform duration-500 rotate-0 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
        </div>
      ) : (
        <div className="relative">
          <svg className="w-6 h-6 transform transition-transform duration-500 rotate-0 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
        </div>
      )}
    </button>
  );
} 