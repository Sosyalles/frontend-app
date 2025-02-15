export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  isActive: boolean;
  bio?: string;
  location?: string;
  interests: string[];
  socialLinks: {
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    facebook: string | null;
  };
  notificationPreferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyRecommendations: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ChangePasswordCredentials {
  oldPassword: string;
  newPassword: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface ErrorResponse {
  code: number;
  message: string;
  details?: any;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (credentials: RegisterCredentials) => Promise<void>;
  isAuthenticated: () => boolean;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
} 