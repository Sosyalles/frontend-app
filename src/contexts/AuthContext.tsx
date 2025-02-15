import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ProfileUpdateData } from '../types/auth';
import { AuthService } from '../services/auth.service';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<User>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  uploadProfilePhotos: (photos: File[]) => Promise<string[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage events (for multi-tab support)
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        if (!e.newValue) {
          setUser(null);
        } else {
          const currentUser = await AuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const updateProfile = async (data: ProfileUpdateData): Promise<User> => {
    const updatedUser = await AuthService.updateProfile(data);
    setUser(updatedUser);
    return updatedUser;
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    await AuthService.changePassword(oldPassword, newPassword);
  };

  const uploadProfilePhotos = async (photos: File[]): Promise<string[]> => {
    return await AuthService.uploadProfilePhotos(photos);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser: user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout,
        updateProfile,
        changePassword,
        uploadProfilePhotos
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 