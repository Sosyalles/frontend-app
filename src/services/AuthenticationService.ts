import { api } from '../lib/axios';
import { LoginRequestDTO } from '../types/dtos/auth.dto';
import { LoginResponseDTO } from '../types/responses/api-responses.dto';
import { CreateUserDTO } from '../types/dtos/auth.dto';
import { TokenManager } from './TokenManager';
import { logger } from '../utils/logger';
import { AxiosError } from 'axios';
import { UserDetailResponseDTO } from '../types/dtos/profile.dto';

export class AuthenticationService {
  constructor(
    private tokenManager: TokenManager
  ) {}

  async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const response = await api.post<LoginResponseDTO>('/auth/login', credentials);
      
      console.log('Login Response:', response.data);
      
      if (response.data?.status === 'success' && 
          response.data?.data?.token && 
          response.data?.data?.user) {
        this.tokenManager.setToken(response.data.data.token);
        this.tokenManager.setUser(response.data.data.user);
        return response.data;
      }
      throw new Error('Geçersiz yanıt formatı');
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Giriş başarısız', { 
          error: error.message,
          responseData: error instanceof AxiosError ? error.response?.data : undefined,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      } else {
        logger.error('Giriş başarısız', { error: 'Bilinmeyen hata' });
      }
      throw error;
    }
  }

  async register(credentials: CreateUserDTO): Promise<UserDetailResponseDTO & { 
    username: string; 
    email: string; 
    firstName: string; 
    lastName: string; 
    isActive: boolean;
  }> {
    try {
      logger.debug('Kayıt denemesi', { 
        email: credentials.email,
        userAgent: navigator.userAgent
      });
      
      const response = await api.post<{ 
        status: string; 
        message: string; 
        data: UserDetailResponseDTO 
      }>('/auth/register', credentials);

      if (response.data?.status === 'success' && response.data?.data) {
        return {
          ...response.data.data,
          username: credentials.username,
          email: credentials.email,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          isActive: true
        };
      }
      
      throw new Error('Geçersiz kayıt yanıt formatı');
    } catch (error) {
      const finalError = error instanceof Error 
        ? error 
        : new Error('Beklenmeyen bir hata oluştu');
        
      logger.logAPIError('POST', '/auth/register', finalError);
      throw finalError;
    }
  }

  logout(): void {
    const userId = this.tokenManager.getUserId();
    this.tokenManager.clearToken();
    
    logger.logAuthAction('logout', userId, true, {
      message: 'Session ended',
      sessionEnd: new Date().toISOString()
    } as Error & { sessionEnd: string });
  }
} 