import { api } from '../lib/axios';
import { logger } from '../utils/logger';

export class ProfilePhotoService {
  async uploadPhotos(photos: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      photos.forEach(photo => formData.append('photos', photo));

      const response = await api.post<{ profilePhoto: string }>(
        '/usersprofile/photos',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      return this.processUploadResponse(response.data);
    } catch (error) {
      logger.error('Photo upload error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  private processUploadResponse(response: any): string[] {
    if (response.status !== 'success') {
      throw new Error('Photo upload failed');
    }
    return response.data.profilePhotos || [];
  }
} 