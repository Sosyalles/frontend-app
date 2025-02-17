import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, userProfileService, photoService } from '../services';
import { UserResponseDTO, UpdateUserDTO, CreateUserDTO, ApiResponse, UserDetailResponseDTO, LoginResponseDTO, RegisterResponseDTO } from '../types/dtos/user.dto';

interface AuthContextType {
  currentUser: UserResponseDTO | null;
  profilePhoto?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: UserResponseDTO) => void;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<UserResponseDTO>;
  signUp: (userData: CreateUserDTO) => Promise<void>;
  updateProfile: (data: UpdateUserDTO) => Promise<UserResponseDTO>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  uploadProfilePhotos: (photos: File[]) => Promise<string[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  navigate?: (path: string) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, navigate }) => {
  const [user, setUser] = useState<UserResponseDTO | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await userProfileService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setProfilePhoto(currentUser.profilePhoto);
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
          setProfilePhoto(undefined);
        } else {
          const currentUser = await userProfileService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setProfilePhoto(currentUser.profilePhoto);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (newUser: UserResponseDTO) => {
    setUser(newUser);
    setProfilePhoto(newUser.profilePhoto);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setProfilePhoto(undefined);
  };

  const updateProfile = async (data: UpdateUserDTO): Promise<UserResponseDTO> => {
    const updatedUser = await userProfileService.updateProfile(data);
    
    const userFromResponse: UserResponseDTO = {
      id: updatedUser.data.id,
      username: updatedUser.data.username,
      email: updatedUser.data.email,
      firstName: updatedUser.data.firstName,
      lastName: updatedUser.data.lastName,
      isActive: updatedUser.data.isActive,
      profilePhoto: updatedUser.data.profilePhotos?.[0],
      profilePhotos: updatedUser.data.profilePhotos || [],
      bio: updatedUser.data.bio || '',
      lastLoginAt: updatedUser.data.lastLoginAt || new Date().toISOString(),
      createdAt: updatedUser.data.createdAt,
      updatedAt: updatedUser.data.updatedAt,
      userDetail: updatedUser.data
    };

    setUser(userFromResponse);
    setProfilePhoto(userFromResponse.profilePhoto);
    return userFromResponse;
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    await userProfileService.changePassword(oldPassword, newPassword);
  };

  const uploadProfilePhotos = async (photos: File[]): Promise<string[]> => {
    return await photoService.uploadPhotos(photos);
  };

  const isUserDetailResponseDTO = (response: any): response is UserDetailResponseDTO => {
    return response && 
      typeof response.id === 'number' &&
      typeof response.username === 'string' &&
      typeof response.email === 'string' &&
      typeof response.firstName === 'string' &&
      typeof response.lastName === 'string' &&
      typeof response.isActive === 'boolean';
  };

  const signIn = async (email: string, password: string): Promise<UserResponseDTO> => {
    const loginData = { email, password };
    try {
      const response = await authService.login(loginData);
      
      // Use the new response structure
      const loginResponse = response.data;
      if (loginResponse && loginResponse.user) {
        const userFromResponse: UserResponseDTO = {
          id: loginResponse.user.id,
          username: loginResponse.user.username,
          email: loginResponse.user.email,
          firstName: loginResponse.user.firstName,
          lastName: loginResponse.user.lastName,
          isActive: loginResponse.user.isActive,
          profilePhoto: loginResponse.user.profilePhotos?.[0],
          profilePhotos: loginResponse.user.profilePhotos || [],
          bio: loginResponse.user.bio || '',
          lastLoginAt: loginResponse.user.lastLoginAt || new Date().toISOString(),
          createdAt: loginResponse.user.createdAt,
          updatedAt: loginResponse.user.updatedAt,
          userDetail: loginResponse.user
        };

        setUser(userFromResponse);
        setProfilePhoto(userFromResponse.profilePhoto);
        
        return userFromResponse;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signUp = async (userData: CreateUserDTO): Promise<void> => {
    try {
      const response = await authService.register(userData);
      
      // Directly create UserResponseDTO from registration response
      const userFromResponse: UserResponseDTO = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        isActive: response.isActive,
        profilePhoto: response.profilePhotos?.[0],
        profilePhotos: response.profilePhotos || [],
        bio: response.bio || '',
        lastLoginAt: response.lastLoginAt || new Date().toISOString(),
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        userDetail: response
      };

      if (navigate) navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser: user, 
        profilePhoto,
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout,
        signIn,
        signUp,
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