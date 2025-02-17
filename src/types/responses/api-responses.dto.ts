// API Response Types
import { UserResponseDTO } from '../dtos/user.dto';
import { UserDetailResponseDTO } from '../dtos/profile.dto';

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

export interface ErrorResponse {
  status: 'error';
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface LoginResponseDTO {
  status: string;
  message: string;
  data: {
    token: string;
    user: UserResponseDTO;
  };
} 