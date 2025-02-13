export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bio?: string;
  location?: string;
  interests?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  notificationPreferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyRecommendations: boolean;
  };
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