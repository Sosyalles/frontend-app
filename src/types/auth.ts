export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  location?: string;
  profilePhoto?: string;
  profilePhotos?: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  interests?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export interface UserDetail {
  id: number;
  userId: number;
  bio: string | undefined;
  location: string | undefined;
  profilePhotos: string[];
  profilePhoto: string | undefined;
  lastLoginAt: string;
  instagramUrl: string | undefined;
  twitterUrl: string | undefined;
  linkedinUrl: string | undefined;
  facebookUrl: string | undefined;
  interests: string[];
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserWithDetails extends User {
  userDetail: {
    id: number;
    userId: number;
    bio: string | undefined;
    location: string | undefined;
    profilePhotos: string[];
    profilePhoto: string | undefined;
    lastLoginAt: string;
    instagramUrl: string | undefined;
    twitterUrl: string | undefined;
    linkedinUrl: string | undefined;
    facebookUrl: string | undefined;
    interests: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
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
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
} 