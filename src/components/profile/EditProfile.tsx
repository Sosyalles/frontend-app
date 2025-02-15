import { useState, useEffect } from 'react';
import { User } from '../../types/auth';
import { AuthService } from '../../services/auth.service';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

// Import modular components
import { ProfilePhotosSection } from './edit-profile/ProfilePhotosSection';
import { PersonalInfoSection } from './edit-profile/PersonalInfoSection';
import { InterestsSection } from './edit-profile/InterestsSection';
import { SocialMediaSection } from './edit-profile/SocialMediaSection';
import { NotificationPreferencesSection } from './edit-profile/NotificationPreferencesSection';

interface EditProfileProps {
  user: User;
}


interface EditProfileFormData {
  fullName: string;
  email: string;
  bio: string;
  location: string;
  interests: string[];
  socialLinks: {
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    facebook: string | null;
  };
  notificationPreferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyRecommendations: boolean;
  };
}

export function EditProfile({ user }: EditProfileProps) {
  const { logout, currentUser } = useAuth();
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
    fullName: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`,
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    interests: currentUser?.interests || [],
    socialLinks: {
      instagram: currentUser?.socialLinks?.instagram || null,
      twitter: currentUser?.socialLinks?.twitter || null,
      linkedin: currentUser?.socialLinks?.linkedin || null,
      facebook: currentUser?.socialLinks?.facebook || null
    },
    notificationPreferences: {
      emailNotifications: currentUser?.notificationPreferences?.emailNotifications ?? true,
      pushNotifications: currentUser?.notificationPreferences?.pushNotifications ?? true,
      weeklyRecommendations: currentUser?.notificationPreferences?.weeklyRecommendations ?? false
    }
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const userDetails = await AuthService.getUserDetails(user.id);
        setFormData(prev => ({
          ...prev,
          fullName: `${userDetails.firstName} ${userDetails.lastName}`,
          email: userDetails.email,
          location: userDetails.userDetail?.location || '',
          bio: userDetails.userDetail?.bio || '',
          interests: userDetails.userDetail?.interests || [],
          socialLinks: {
            instagram: userDetails.userDetail?.instagram || null,
            twitter: userDetails.userDetail?.twitter || null,
            linkedin: userDetails.userDetail?.linkedin || null,
            facebook: userDetails.userDetail?.facebook || null
          },
          notificationPreferences: {
            emailNotifications: true,
            pushNotifications: true,
            weeklyRecommendations: false
          }
        }));
      } catch (error) {
        setShowError('Kullanıcı detayları yüklenirken bir hata oluştu.');
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [user.id]);

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
    setIsDirty(true);
  };

  const handleSocialLinkChange = (name: string, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
    setIsDirty(true);
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
    setIsDirty(true);
  };

  const handleAddInterest = (interest: string) => {
    if (interest.trim() && !formData.interests.includes(interest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
      setNewInterest('');
      setIsDirty(true);
    }
  };

  const handleRemoveInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const handleSaveChanges = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setShowError(errors.join(', '));
      return;
    }

    setIsLoading(true);
    try {
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const updateData = {
        firstName,
        lastName,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        interests: formData.interests,
        socialLinks: formData.socialLinks,
        notificationPreferences: formData.notificationPreferences
      };

      await AuthService.updateProfile(updateData);
      setShowSuccess(true);
      setIsDirty(false);
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setShowError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-200">
          <ProfilePhotosSection
            profileImages={profileImages}
            onImagesChange={setProfileImages}
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

          <SocialMediaSection
            socialLinks={formData.socialLinks}
            onChange={handleSocialLinkChange}
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
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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