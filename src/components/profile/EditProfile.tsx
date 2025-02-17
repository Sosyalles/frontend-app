import { useState, useEffect } from 'react';
import { UserResponseDTO, UpdateUserDTO } from '../../types/dtos/user.dto';
import { userProfileService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { getErrorMessage } from '../../lib/errorHandler';

// Import modular components
import { ProfilePhotosSection } from './edit-profile/ProfilePhotosSection';
import { PersonalInfoSection } from './edit-profile/PersonalInfoSection';
import { InterestsSection } from './edit-profile/InterestsSection';
import { NotificationPreferencesSection } from './edit-profile/NotificationPreferencesSection';

interface EditProfileProps {
  user: UserResponseDTO;
}


interface EditProfileFormData {
  fullName: string;
  email: string;
  bio: string;
  location: string;
  interests: string[];
  notificationPreferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyRecommendations: boolean;
  };
}

export function EditProfile({ user }: EditProfileProps) {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const { isDark } = useTheme();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [currentCropImage, setCurrentCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [profileImages, setProfileImages] = useState<File[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EditProfileFormData>({
    fullName: '',
    email: '',
    bio: '',
    location: '',
    interests: [],
    notificationPreferences: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyRecommendations: false
    }
  });

  // Add a new state for profile photo URLs
  const [profilePhotoUrls, setProfilePhotoUrls] = useState<string[]>([]);

  const [initialFormState, setInitialFormState] = useState<EditProfileFormData>({
    fullName: '',
    email: '',
    bio: '',
    location: '',
    interests: [],
    notificationPreferences: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyRecommendations: false
    }
  });

  const [initialProfilePhotos, setInitialProfilePhotos] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await userProfileService.getUserDetails(user.username);
        const userDetails = response.data;
        
        const fetchedFormData = {
          fullName: `${userDetails.firstName} ${userDetails.lastName}`.trim(),
          email: userDetails.email,
          bio: userDetails.userDetail?.bio || '',
          location: userDetails.userDetail?.location || '',
          interests: userDetails.userDetail?.interests || [],
          notificationPreferences: {
            emailNotifications: true,
            pushNotifications: true,
            weeklyRecommendations: false
          }
        };

        // Set both current form data and initial state
        setFormData(fetchedFormData);
        setInitialFormState(fetchedFormData);

        // Set profile photos
        const profilePhotos = userDetails.userDetail?.profilePhotos || [];
        setProfilePhotoUrls(profilePhotos);
        setInitialProfilePhotos(profilePhotos);

      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setShowError(errorMessage);
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.username) {
      fetchUserDetails();
    }
  }, [user.username]);

  // Form validation
  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.fullName.trim()) errors.push('Full name is required');
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('Invalid email format');
    }
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: checked
      }
    }));
  };

  const handleAddInterest = (interest: string) => {
    if (interest.trim() && !formData.interests.includes(interest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const handleSaveChanges = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setShowError(errors.join(', '));
      return;
    }

    setIsLoading(true);
    try {
      // Handle profile photos upload
      let photoUrls: string[] = profilePhotoUrls || [];
      
      // If new images are uploaded
      if (profileImages.length > 0) {
        try {
          // Upload new images
          const newPhotoUrls = await userProfileService.uploadProfilePhotos(profileImages);
          
          // Combine existing and new photos, maintaining order
          photoUrls = [
            ...photoUrls,  // Keep existing photos first
            ...newPhotoUrls  // Add new photos at the end
          ];
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          setShowError(errorMessage);
          return;
        }
      }

      // Limit to 5 photos
      photoUrls = photoUrls.slice(0, 5);

      // Prepare update data
      const updateData: UpdateUserDTO = {
        bio: formData.bio,
        location: formData.location,
        interests: formData.interests,
        profilePhoto: photoUrls.length > 0 ? photoUrls[0] : undefined,
        profilePhotos: photoUrls.length > 0 ? photoUrls : undefined,
        notificationPreferences: {
          emailNotifications: formData.notificationPreferences.emailNotifications ?? true,
          pushNotifications: formData.notificationPreferences.pushNotifications ?? true,
          weeklyRecommendations: formData.notificationPreferences.weeklyRecommendations ?? false
        }
      };

      // Update profile and get the response
      const response = await userProfileService.updateProfile(updateData);
      
      // Update profile photo URLs from the response
      if (response.data.profilePhotos) {
        setProfilePhotoUrls(response.data.profilePhotos);
      }

      setShowSuccess(true);
      setIsDirty(false);

      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setShowError(errorMessage);
      console.error('Profil güncelleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the ProfilePhotosSection props
  const handleImagesChange = ({ existingUrls, newFiles }: { 
    existingUrls: string[], 
    newFiles: File[] 
  }) => {
    setProfilePhotoUrls(existingUrls);
    setProfileImages(newFiles);
    setIsDirty(true);
  };

  const isFormChanged = () => {
    // Comprehensive and precise change detection
    return (
      formData.bio.trim() !== initialFormState.bio.trim() ||
      formData.location.trim() !== initialFormState.location.trim() ||
      JSON.stringify(formData.interests.sort()) !== JSON.stringify(initialFormState.interests.sort()) ||
      profileImages.length > 0 ||
      JSON.stringify(profilePhotoUrls.sort()) !== JSON.stringify(initialProfilePhotos.sort()) ||
      formData.notificationPreferences.emailNotifications !== initialFormState.notificationPreferences.emailNotifications ||
      formData.notificationPreferences.pushNotifications !== initialFormState.notificationPreferences.pushNotifications ||
      formData.notificationPreferences.weeklyRecommendations !== initialFormState.notificationPreferences.weeklyRecommendations
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-200">
          <ProfilePhotosSection
            profileImages={profileImages}
            existingPhotoUrls={profilePhotoUrls}
            onImagesChange={handleImagesChange}
            setShowError={setShowError}
          />

          <PersonalInfoSection
            fullName={formData.fullName}
            email={formData.email}
            location={formData.location}
            bio={formData.bio}
            onChange={handleInputChange}
          />

          <InterestsSection
            interests={formData.interests}
            newInterest={newInterest}
            onNewInterestChange={setNewInterest}
            onAddInterest={handleAddInterest}
            onRemoveInterest={handleRemoveInterest}
          />

          <NotificationPreferencesSection
            preferences={formData.notificationPreferences}
            onChange={handleNotificationChange}
          />

          {/* Eylem Butonları */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              İptal
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isLoading || !isFormChanged()}
              className={`px-6 py-2 rounded-lg transition-colors duration-200 
                ${isLoading || !isFormChanged() 
                  ? 'bg-gray-300 text-gray-500 cursor-default' 
                  : 'bg-orange-500 text-white hover:bg-orange-600'}`}
            >
              {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg">
              Profil başarıyla güncellendi!
            </div>
          )}

          {/* Error Message */}
          {showError && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
              {showError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 