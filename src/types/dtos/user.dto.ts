// User Data Transfer Objects
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  bio?: string;
  location?: string;
  interests?: string[];
  profilePhoto?: string;
  profilePhotos?: string[];
  notificationPreferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    weeklyRecommendations?: boolean;
  };
}

export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  profilePhoto?: string;
  profilePhotos?: string[];
  bio?: string;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  userDetail?: UserDetailResponseDTO;
}

export interface UserDetailResponseDTO {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  profilePhotos?: string[];
  bio?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  location?: string;
  interests?: string[];
  notificationPreferences?: NotificationPreferencesDTO;
}

export interface NotificationPreferencesDTO {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  weeklyRecommendations?: boolean;
}

export interface PaginatedUsersResponse {
  users: UserResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  userDetail?: UserDetailResponseDTO;
  profilePhotos?: string[];
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  bio?: string;
  location?: string;
  interests?: string[];
  fullName?: string;
  notificationPreferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    weeklyRecommendations?: boolean;
  };
}

export interface LoginResponseDTO {
  data: {
    user: UserResponseDTO;
    token: string;
  };
}

export interface RegisterResponseDTO {
  data: UserDetailResponseDTO;
} 