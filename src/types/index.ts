// Comprehensive Type Definitions based on Swagger Specification

// Authentication DTOs
export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

// User Profile DTOs
export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  profilePhoto?: string;
}

export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

// User Details DTOs
export interface NotificationPreferencesDTO {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  weeklyRecommendations?: boolean;
}

export interface UpdateUserDetailDTO {
  bio?: string;
  location?: string;
  profilePhoto?: string;
  profilePhotos?: string[];
  interests?: string[];
  notificationPreferences?: NotificationPreferencesDTO;
}

export interface UserDetailResponseDTO {
  id: number;
  userId: number;
  bio?: string;
  location?: string;
  profilePhoto?: string;
  profilePhotos?: string[];
  interests?: string[];
  notificationPreferences?: NotificationPreferencesDTO;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication Responses
export interface LoginResponseDTO {
  token: string;
  user: UserResponseDTO;
}

// Generic API Responses
export interface ApiResponse {
  status: string;
  message: string;
}

export interface ApiResponseUserDTO extends ApiResponse {
  data: UserResponseDTO;
}

export interface ApiResponseUserDetailDTO extends ApiResponse {
  data: UserDetailResponseDTO;
}

export interface ApiResponseProfilePhotos extends ApiResponse {
  data: {
    profilePhoto: string;
  };
}

// Error Response
export interface ErrorResponse {
  status: 'error';
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Pagination Types
export interface PaginatedUsersResponse {
  users: UserResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Endpoint Types
export type AuthRegisterEndpoint = {
  requestBody: CreateUserDTO;
  response: ApiResponseUserDTO;
};

export type AuthLoginEndpoint = {
  requestBody: LoginRequestDTO;
  response: LoginResponseDTO;
};

export type ProfileGetEndpoint = {
  response: ApiResponseUserDTO;
};

export type ProfileUpdateEndpoint = {
  requestBody: UpdateUserDTO;
  response: ApiResponseUserDTO;
};

export type ProfileDetailsGetEndpoint = {
  response: ApiResponseUserDetailDTO;
};

export type ProfileDetailsUpdateEndpoint = {
  requestBody: UpdateUserDetailDTO;
  response: ApiResponseUserDetailDTO;
};

export type ProfilePhotosUploadEndpoint = {
  requestBody: FormData;
  response: ApiResponseProfilePhotos;
};

export type AuthChangePasswordEndpoint = {
  requestBody: ChangePasswordDTO;
  response: ApiResponse;
};

export type UsersListEndpoint = {
  queryParams: {
    page?: number;
    limit?: number;
    search?: string;
  };
  response: {
    status: string;
    message: string;
    data: PaginatedUsersResponse;
  };
};

export type InternalUserByIdEndpoint = {
  pathParams: {
    id: number;
  };
  response: ApiResponseUserDTO;
};

export type InternalUserByUsernameEndpoint = {
  pathParams: {
    username: string;
  };
  response: ApiResponseUserDTO;
};

// Centralized Type Exports
export * from './dtos/auth.dto';
export * from './dtos/user.dto';
export * from './dtos/profile.dto';
export * from './dtos/category.dto';
export * from './dtos/event.dto';
export * from './responses/api-responses.dto';
export * from './endpoints/auth-endpoints.type';
export * from './endpoints/profile-endpoints.type';
export * from './endpoints/internal-endpoints.type'; 