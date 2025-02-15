import { ReactNode, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthenticatedNavbar } from './AuthenticatedNavbar';
import { Navbar } from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
  onModalChange?: (modal: 'signIn' | 'signUp' | 'forgotPassword' | null) => void;
}

export function MainLayout({ children, onModalChange }: MainLayoutProps) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="fixed top-0 left-0 right-0 z-50">
        {isAuthenticated && currentUser ? (
          <AuthenticatedNavbar
            user={currentUser}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLogout={logout}
          />
        ) : (
          <Navbar
            onSignIn={() => onModalChange?.('signIn')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
      </header>
      <main className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
} 