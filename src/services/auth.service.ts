import { AuthResponse, LoginCredentials, RegisterCredentials, User, UserDetail, ApiResponse } from '../types/auth';
import { logger } from '../utils/logger';
import { api } from '../lib/axios';

const API_URL = 'http://localhost:3000/api';
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const BASE_URL = 'http://localhost:3000';


export const AuthService = {
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });

      if (response.data && response.data.data) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Login failed:', { error: error.message });
      } else {
        logger.error('Login failed:', { error: 'Unknown error' });
      }
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<any> => {
    const startTime = Date.now();
    try {
      logger.debug('Attempting registration', { email: credentials.email });

      const response = await api.post('/users/register', credentials);

      if (!response.data) {
        throw new Error('Registration failed');
      }

      logger.debug('Registration response:', response.data);
      logger.info('User registered successfully');

      return response.data;
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error('An unexpected error occurred');
      logger.logAPIError('POST', '/users/register', finalError);
      throw finalError;
    }
  },

  logout: () => {
    const storedUser = localStorage.getItem(USER_KEY);
    const userId = storedUser ? Number(JSON.parse(storedUser).id) : 0;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    logger.logAuthAction('logout', userId, true);
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        logger.debug('No auth token found');
        return null;
      }

      const response = await api.get<ApiResponse<User>>('/users/profile');

      if (response.data && response.data.data) {
        const userData = response.data.data;

        // Profil fotoğrafı URL'lerini tam URL'ye çevir
        if (userData.profilePhoto) {
          userData.profilePhoto = `${BASE_URL}${userData.profilePhoto}`;
        }
        if (userData.profilePhotos) {
          userData.profilePhotos = userData.profilePhotos.map(photo => `${BASE_URL}${photo}`);
        }

        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        logger.debug('Current user retrieved successfully', { userId: userData.id });
        return userData;
      }

      return null;
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error('An unexpected error occurred');
      logger.logAPIError('GET', '/users/profile', finalError);
      return null;
    }
  },

  async updateProfileDetails(profileData: Partial<UserDetail>): Promise<ApiResponse<UserDetail>> {
    try {
      const response = await api.patch<ApiResponse<UserDetail>>('/api/v1/profile/detail', profileData);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error updating profile details', { error: error.message });
      }
      throw error;
    }
  },

  async getDetailedProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<ApiResponse<User>>('/users/profile/detail');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error fetching detailed profile', { error: error.message });
      }
      throw error;
    }
  },

  async getUserProfile(username: string): Promise<ApiResponse<User>> {
    try {
      const cleanUsername = username.replace('@', '');
      const response = await api.get<ApiResponse<User>>(`/users/profile/details/${cleanUsername}`);

      if (!response.data || !response.data.data) {
        throw new Error('User not found');
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error fetching user profile', { error: error.message });
      }
      throw error;
    }
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    try {
      logger.debug('Attempting to update profile', { updates });

      // Profil bilgilerini güncelle
      const response = await api.patch<ApiResponse<User>>('/users/profile', updates);

      if (response.data && response.data.data) {
        const userData = response.data.data;
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        logger.info('Profile updated successfully', { userId: userData.id });
        return userData;
      }

      throw new Error('Failed to update profile');
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error('An unexpected error occurred');
      logger.logAPIError('PATCH', '/users/profile', finalError);
      throw finalError;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    const startTime = Date.now();
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        const error = new Error('Not authenticated');
        logger.error('Password change attempted without auth token', error);
        throw error;
      }

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      logger.logAPIRequest('POST', '/auth/change-password', response.status, Date.now() - startTime);

      if (!response.ok) {
        if (response.status === 401) {
          const error = new Error('Current password is incorrect');
          logger.logAuthAction('change_password', 0, false, error);
          throw error;
        } else if (response.status === 429) {
          const error = new Error('Too many requests. Please try again later.');
          logger.logAuthAction('change_password', 0, false, error);
          throw error;
        }
        const error = new Error('Failed to change password');
        logger.logAuthAction('change_password', 0, false, error);
        throw error;
      }

      logger.info('Password changed successfully');
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error('An unexpected error occurred');
      logger.logAPIError('POST', '/auth/change-password', finalError);
      throw finalError;
    }
  },

  uploadProfilePhotos: async (photos: File[]): Promise<string[]> => {
    try {
      // Dosya kontrolü
      if (!photos || photos.length === 0) {
        throw new Error('Lütfen en az bir fotoğraf seçin');
      }

      // Dosya boyutu ve format kontrolü
      for (const photo of photos) {
        if (photo.size > 5 * 1024 * 1024) { // 5MB
          throw new Error('Fotoğraf boyutu 5MB\'dan küçük olmalıdır');
        }
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(photo.type)) {
          throw new Error('Sadece JPG, PNG ve WEBP formatları desteklenmektedir');
        }
      }

      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const formData = new FormData();
      // Sadece ilk fotoğrafı yükle
      const photo = photos[0];
      formData.append('photos', photo);

      logger.debug('Profil fotoğrafı yükleniyor', {
        size: photo.size,
        type: photo.type,
        name: photo.name
      });

      try {
        // Profil fotoğrafını yükle
        const uploadResponse = await api.post<ApiResponse<{ profilePhoto: string }>>('/users/profile/photos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          timeout: 60000, // 60 saniye timeout
          maxBodyLength: Infinity,
          maxContentLength: Infinity
        });

        if (uploadResponse.data.status !== 'success') {
          logger.error('Fotoğraf yükleme başarısız:', uploadResponse.data);
          throw new Error('Fotoğraf yükleme başarısız');
        }

        // Güncel kullanıcı bilgilerini al
        const userResponse = await api.get<ApiResponse<User>>('/users/profile');

        if (userResponse.data?.data) {
          const userData = userResponse.data.data;
          // Profil fotoğrafı URL'lerini tam URL'ye çevir
          if (userData.profilePhoto) {
            userData.profilePhoto = `${BASE_URL}${userData.profilePhoto}`;
          }
          if (userData.profilePhotos) {
            userData.profilePhotos = userData.profilePhotos.map(photo => `${BASE_URL}${photo}`);
          }
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
          const photoUrl = userData.profilePhoto;
          if (!photoUrl) {
            throw new Error('Profil fotoğrafı güncellenemedi');
          }
          return [photoUrl];
        }

        throw new Error('Kullanıcı bilgileri alınamadı');
      } catch (error) {
        if (error instanceof Error) {
          logger.error('Profil fotoğrafı yükleme hatası:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
          throw new Error(`Fotoğraf yükleme başarısız: ${error.message}`);
        }
        throw new Error('Fotoğraf yüklenirken beklenmeyen bir hata oluştu');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      logger.error('Profil fotoğrafı yükleme hatası:', {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error(`Fotoğraf yükleme başarısız: ${errorMessage}`);
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getUserDetails: async (userId: number) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user || !user.username) {
        throw new Error('User data not found');
      }

      const response = await fetch(`${API_URL}/users/profile/details/${user.username}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      logger.error('Error fetching user details:', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  },

  fetchDetailedProfile: async (): Promise<UserDetail> => {
    try {
      // Önce temel profil bilgilerini al
      const profileResponse = await api.get<ApiResponse<User>>('/users/profile');

      // Sonra detaylı profil bilgilerini al
      const detailResponse = await api.get<ApiResponse<UserDetail>>('/users/profile/details');

      if (profileResponse.data?.data && detailResponse.data?.data) {
        const userData = {
          ...profileResponse.data.data,
          userDetail: detailResponse.data.data
        };

        // Profil fotoğrafı URL'lerini tam URL'ye çevir
        if (userData.profilePhoto) {
          userData.profilePhoto = `${BASE_URL}${userData.profilePhoto}`;
        }
        if (userData.profilePhotos) {
          userData.profilePhotos = userData.profilePhotos.map(photo => `${BASE_URL}${photo}`);
        }
        if (userData.userDetail.profilePhoto) {
          userData.userDetail.profilePhoto = `${BASE_URL}${userData.userDetail.profilePhoto}`;
        }
        if (userData.userDetail.profilePhotos) {
          userData.userDetail.profilePhotos = userData.userDetail.profilePhotos.map(photo => `${BASE_URL}${photo}`);
        }

        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        return userData.userDetail;
      }
      throw new Error('Profil detayları alınamadı');
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Profil detayları alınırken hata oluştu', { error: error.message });
      }
      throw error;
    }
  },

  fetchUserProfile: async (username: string): Promise<UserDetail> => {
    try {
      const cleanUsername = username.replace('@', '');
      const response = await api.get<ApiResponse<UserDetail>>(`/users/profile/details/${cleanUsername}`);

      if (!response.data || !response.data.data) {
        throw new Error('User not found');
      }

      const userData = response.data.data;

      // Profil fotoğrafı URL'lerini tam URL'ye çevir
      if (userData.profilePhoto) {
        userData.profilePhoto = `${BASE_URL}${userData.profilePhoto}`;
      }
      if (userData.profilePhotos) {
        userData.profilePhotos = userData.profilePhotos.map(photo => `${BASE_URL}${photo}`);
      }

      return userData;
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error fetching user profile', { error: error.message });
      }
      throw error;
    }
  }
}; 