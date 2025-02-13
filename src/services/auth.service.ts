import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { logger } from '../utils/logger';

const API_URL = 'http://localhost:3000/api';
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

// Mock user data
const mockUsers: User[] = [
  {
    id: 1,
    email: 'john@example.com',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'jane@example.com',
    username: 'janesmith',
    firstName: 'Jane',
    lastName: 'Smith',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock credentials
const mockCredentials: { [key: string]: string } = {
  'john@example.com': 'password123',
  'jane@example.com': 'password123'
};

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const startTime = Date.now();
    try {
      logger.debug('Attempting login', { email: credentials.email });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      logger.logAPIRequest('POST', '/auth/login', response.status, Date.now() - startTime);

      if (!response.ok) {
        if (response.status === 401) {
          const error = new Error('Invalid credentials');
          logger.logAuthAttempt(credentials.email, false, error);
          throw error;
        } else if (response.status === 429) {
          const error = new Error('Too many login attempts. Please try again later.');
          logger.logAuthAttempt(credentials.email, false, error);
          throw error;
        }
        const error = new Error('Login failed');
        logger.logAuthAttempt(credentials.email, false, error);
        throw error;
      }

      const responseData = await response.json();
      logger.debug('Login response:', responseData);

      // Handle different response formats
      const authData = responseData.data || responseData;
      const token = authData.accessToken || authData.token;
      const user = authData.user || authData;

      if (!token || !user) {
        logger.error('Response format:', responseData);
        throw new Error('Invalid response format from server');
      }

      // Store auth data
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      logger.logAuthAttempt(credentials.email, true);
      logger.info('User logged in successfully', { userId: user.id });

      return {
        token,
        user
      };
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error('An unexpected error occurred');
      logger.logAPIError('POST', '/auth/login', finalError);
      throw finalError;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<any> => {
    const startTime = Date.now();
    try {
      logger.debug('Attempting registration', { email: credentials.email });

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      logger.logAPIRequest('POST', '/auth/register', response.status, Date.now() - startTime);

      if (!response.ok) {
        if (response.status === 409) {
          const error = new Error('Email or username already exists');
          logger.logAuthAction('register', 0, false, error);
          throw error;
        } else if (response.status === 400) {
          const error = new Error('Invalid input or validation error');
          logger.logAuthAction('register', 0, false, error);
          throw error;
        } else if (response.status === 429) {
          const error = new Error('Too many requests. Please try again later.');
          logger.logAuthAction('register', 0, false, error);
          throw error;
        }
        const error = new Error('Registration failed');
        logger.logAuthAction('register', 0, false, error);
        throw error;
      }

      const responseData = await response.json();
      logger.debug('Registration response:', responseData);
      logger.info('User registered successfully');

      return responseData;
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error('An unexpected error occurred');
      logger.logAPIError('POST', '/auth/register', finalError);
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
    const startTime = Date.now();
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        logger.debug('No auth token found');
        return null;
      }

      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      logger.logAPIRequest('GET', '/users/profile', response.status, Date.now() - startTime);

      if (!response.ok) {
        if (response.status === 401) {
          logger.warn('Session expired or invalid');
          AuthService.logout();
          return null;
        }
        throw new Error('Failed to get user profile');
      }

      const responseData = await response.json();
      logger.debug('Profile response:', responseData);

      const userData = responseData.data || responseData;
      
      if (!userData) {
        throw new Error('Invalid profile response format');
      }

      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      logger.debug('Current user retrieved successfully', { userId: userData.id });
      return userData;
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error('An unexpected error occurred');
      logger.logAPIError('GET', '/users/profile', finalError);
      return null;
    }
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const startTime = Date.now();
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        throw new Error('No authentication token found');
      }

      logger.debug('Attempting to update profile', { updates });

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      logger.logAPIRequest('PATCH', '/users/profile', response.status, Date.now() - startTime);

      if (!response.ok) {
        if (response.status === 401) {
          logger.warn('Session expired or invalid');
          AuthService.logout();
          throw new Error('Session expired');
        }
        throw new Error('Failed to update profile');
      }

      const responseData = await response.json();
      logger.debug('Profile update response:', responseData);

      const userData = responseData.data || responseData;
      
      if (!userData) {
        throw new Error('Invalid response format');
      }

      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      logger.info('Profile updated successfully', { userId: userData.id });
      
      return userData;
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
    const startTime = Date.now();
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        const error = new Error('Not authenticated');
        logger.error('Photo upload attempted without auth token', error);
        throw error;
      }

      const formData = new FormData();
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      logger.debug('Uploading profile photos', { count: photos.length });

      const response = await fetch(`${API_URL}/users/profile/photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      logger.logAPIRequest('POST', '/users/profile/photos', response.status, Date.now() - startTime);

      if (!response.ok) {
        if (response.status === 401) {
          AuthService.logout();
          const error = new Error('Not authenticated');
          logger.logAuthAction('upload_photos', 0, false, error);
          throw error;
        } else if (response.status === 400) {
          const error = new Error('Invalid file format or size');
          logger.logAuthAction('upload_photos', 0, false, error);
          throw error;
        }
        const error = new Error('Failed to upload photos');
        logger.logAuthAction('upload_photos', 0, false, error);
        throw error;
      }

      const data = await response.json();
      logger.info('Profile photos uploaded successfully', { count: photos.length });
      return data.urls;
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error('An unexpected error occurred');
      logger.logAPIError('POST', '/users/profile/photos', finalError);
      throw finalError;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  }
}; 