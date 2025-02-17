import { AuthenticationService } from './AuthenticationService';
import { UserProfileService } from './UserProfileService';
import { ProfilePhotoService } from './ProfilePhotoService';
import { TokenManager } from './TokenManager';

// Dependency instances
const tokenManager = new TokenManager();

// Service exports
export const authService = new AuthenticationService(tokenManager);
export const userProfileService = new UserProfileService(tokenManager);
export const photoService = new ProfilePhotoService(); 