// Profile Data Transfer Objects
import { NotificationPreferencesDTO } from './user.dto';

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