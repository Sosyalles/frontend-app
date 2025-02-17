import { api } from '../lib/axios';
import { UserResponseDTO, UpdateUserDTO, ApiResponse, UserDetailResponseDTO } from '../types/dtos/user.dto';
import { logger } from '../utils/logger';
import { TokenManager } from './TokenManager';

export class UserProfileService {
  constructor(
    private tokenManager: TokenManager
  ) {}

  async getCurrentUser(): Promise<UserResponseDTO | null> {
    try {
      if (!this.tokenManager.getToken()) {
        logger.debug('No auth token found');
        return null;
      }

      const response = await api.get<ApiResponse<UserResponseDTO>>('/users/profile');
      return this.processUserData(response.data.data);
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error('Unknown error');
      logger.logAPIError('GET', '/users/profile', finalError);
      return null;
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async updateProfile(profileData: UpdateUserDTO): Promise<ApiResponse<UserDetailResponseDTO>> {
    try {
      // Validate and clean profile photo
      const cleanProfilePhoto = profileData.profilePhoto && this.isValidUrl(profileData.profilePhoto) 
        ? profileData.profilePhoto 
        : undefined;

      const response = await api.patch<ApiResponse<UserDetailResponseDTO>>('/users/profile/detail', {
        ...profileData,
        profilePhoto: cleanProfilePhoto,
        // Ensure all fields are correctly mapped
        notificationPreferences: {
          emailNotifications: profileData.notificationPreferences?.emailNotifications ?? true,
          pushNotifications: profileData.notificationPreferences?.pushNotifications ?? true,
          weeklyRecommendations: profileData.notificationPreferences?.weeklyRecommendations ?? false
        }
      });
      return response.data;
    } catch (error) {
      logger.error('Error updating profile details', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  private processUserData(userData: UserResponseDTO): UserResponseDTO {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const mediaUrl = import.meta.env.VITE_API_MEDIA_URL || baseUrl;
    
    // Process profile photo
    const processedProfilePhoto = userData.profilePhoto 
      ? (userData.profilePhoto.startsWith('http') 
          ? userData.profilePhoto 
          : `${mediaUrl}${userData.profilePhoto.startsWith('/') ? userData.profilePhoto : `/${userData.profilePhoto}`}`)
      : '';

    // Process profile photos
    const processedPhotos = userData.userDetail?.profilePhotos?.map(photo => {
      // If photo is a relative path, prepend media URL
      return photo.startsWith('http') 
        ? photo 
        : `${mediaUrl}${photo.startsWith('/') ? photo : `/${photo}`}`;
    }) || [];

    return {
      ...userData,
      profilePhoto: processedProfilePhoto,
      userDetail: {
        id: userData.userDetail?.id ?? 0,
        username: userData.userDetail?.username ?? userData.username,
        email: userData.userDetail?.email ?? userData.email,
        firstName: userData.userDetail?.firstName ?? userData.firstName,
        lastName: userData.userDetail?.lastName ?? userData.lastName,
        isActive: userData.userDetail?.isActive ?? userData.isActive,
        profilePhotos: processedPhotos,
        bio: userData.userDetail?.bio ?? userData.bio ?? '',
        lastLoginAt: userData.userDetail?.lastLoginAt ?? userData.lastLoginAt ?? '',
        createdAt: userData.userDetail?.createdAt ?? userData.createdAt ?? '',
        updatedAt: userData.userDetail?.updatedAt ?? userData.updatedAt ?? '',
        location: userData.userDetail?.location,
        interests: userData.userDetail?.interests,
        notificationPreferences: userData.userDetail?.notificationPreferences
      }
    };
  }

  async getUserDetails(username: string): Promise<ApiResponse<UserResponseDTO>> {
    try {
      const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
      const response = await api.get<ApiResponse<UserResponseDTO>>(`/users/profile/details/${cleanUsername}`);
      return {
        ...response.data,
        data: this.processUserData(response.data.data)
      };
    } catch (error) {
      throw new Error('Kullanıcı detayları alınamadı');
    }
  }

  async fetchUserProfile(username: string): Promise<UserResponseDTO> {
    try {
      const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
      const response = await api.get<ApiResponse<UserResponseDTO>>(`/users/profile/details/${cleanUsername}`);
      return response.data.data;
    } catch (error) {
      throw new Error('Profil bilgileri alınamadı');
    }
  }

  async fetchDetailedProfile(): Promise<UserResponseDTO> {
    try {
      const response = await api.get<ApiResponse<UserResponseDTO>>('/users/profile/detailed');
      return response.data.data;
    } catch (error) {
      throw new Error('Detaylı profil bilgileri alınamadı');
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post('/users/change-password', { oldPassword, newPassword });
    } catch (error) {
      throw new Error('Şifre değiştirilirken hata oluştu');
    }
  }

  async uploadProfilePhotos(photos: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      photos.forEach(photo => formData.append('photos', photo));
      
      console.log('Uploading photos:', photos.map(p => p.name));

      const response = await api.post<ApiResponse<{ profilePhotos: string[] }>>('/users/profile/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Photo upload response:', response.data);
      
      // Ensure we return an array of photo URLs
      const uploadedPhotos = response.data.data?.profilePhotos || [];
      console.log('Uploaded Photos:', uploadedPhotos);

      return uploadedPhotos;
    } catch (error: any) {
      console.error('Full photo upload error:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

      logger.error('Error uploading profile photos', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        photoCount: photos.length,
        photoNames: photos.map(p => p.name)
      });

      throw new Error('Fotoğraf yüklenirken bir hata oluştu');
    }
  }

  async deleteProfilePhotos(photoUrls: string[]): Promise<ApiResponse<{ deletedPhotos: string[] }>> {
    try {
      const response = await api.delete<ApiResponse<{ deletedPhotos: string[] }>>('/users/profile/photos', {
        data: { photoUrls }
      });
      return response.data;
    } catch (error) {
      logger.error('Error deleting profile photos', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw new Error('Fotoğraflar silinirken bir hata oluştu');
    }
  }
} 