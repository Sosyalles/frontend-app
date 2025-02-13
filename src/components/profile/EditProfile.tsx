import { useState } from 'react';
import { User } from '../../types/auth';
import { AuthService } from '../../services/auth.service';
import { AuthenticatedNavbar } from '../layout/AuthenticatedNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface EditProfileProps {
  user: User;
}

interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
}

interface EditProfileForm {
  fullName: string;
  email: string;
  location: string;
  bio: string;
  interests: string[];
  socialLinks: SocialLinks;
  notificationPreferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyRecommendations: boolean;
  };
}

export function EditProfile({ user }: EditProfileProps) {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EditProfileForm>({
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    location: '',
    bio: '',
    interests: ['Sports', 'Music', 'Technology'],
    socialLinks: {
      instagram: '',
      twitter: '',
      linkedin: '',
      facebook: ''
    },
    notificationPreferences: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyRecommendations: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
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

  const handleAddInterest = () => {
    const input = document.querySelector<HTMLInputElement>('.interest-input');
    if (input && input.value) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, input.value]
      }));
      input.value = '';
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Split full name into first and last name
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
      
      // Redirect to profile page after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavbar
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogout={logout}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {showSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Profile Updated Successfully!
                </h3>
                <div className="mt-1 text-sm text-green-700">
                  You will be redirected to your profile page shortly...
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="relative h-32 bg-gradient-to-r from-blue-400 to-orange-500 rounded-t-lg">
            <button className="absolute top-4 right-4 px-4 py-2 bg-white bg-opacity-80 rounded-md text-sm font-medium hover:bg-opacity-100 transition-all">
              Change Cover
            </button>
          </div>

          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-8">
              <img
                src={user.profilePhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-2 shadow-lg hover:bg-orange-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="New York, USA"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Event enthusiast and networking professional. Love connecting people and creating memorable experiences."
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Interests</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            interests: prev.interests.filter((_, i) => i !== index)
                          }));
                        }}
                        className="ml-2 inline-flex items-center p-0.5 rounded-full text-orange-800 hover:bg-orange-200 focus:outline-none"
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <div className="flex-1">
                    <input
                      type="text"
                      className="interest-input w-32 border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Add more..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddInterest();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Instagram username</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.socialLinks.instagram}
                      onChange={handleSocialLinkChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter username</label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.socialLinks.twitter}
                      onChange={handleSocialLinkChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn profile</label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={handleSocialLinkChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facebook profile</label>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.socialLinks.facebook}
                      onChange={handleSocialLinkChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        checked={formData.notificationPreferences.emailNotifications}
                        onChange={handleNotificationChange}
                        className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                        Email notifications for new event invites
                      </label>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="pushNotifications"
                        name="pushNotifications"
                        type="checkbox"
                        checked={formData.notificationPreferences.pushNotifications}
                        onChange={handleNotificationChange}
                        className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="pushNotifications" className="text-sm text-gray-700">
                        Push notifications for messages
                      </label>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="weeklyRecommendations"
                        name="weeklyRecommendations"
                        type="checkbox"
                        checked={formData.notificationPreferences.weeklyRecommendations}
                        onChange={handleNotificationChange}
                        className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="weeklyRecommendations" className="text-sm text-gray-700">
                        Weekly event recommendations
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 