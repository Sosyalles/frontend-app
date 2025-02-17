import { useState, useEffect } from 'react';
import { UserResponseDTO, UserDetailResponseDTO } from '../../types/dtos/user.dto';
import { useNavigate, useParams } from 'react-router-dom';
import { userProfileService } from '../../services';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { getErrorMessage } from '../../lib/errorHandler';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';
import { useAuth } from '../../contexts/AuthContext';

interface UserDetail {
  id: number;
  userId: number;
  bio: string | undefined;
  location: string | undefined;
  profilePhotos: string[];
  profilePhoto: string | undefined;
  lastLoginAt: string;
  interests: string[];
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

interface UserWithDetails extends UserResponseDTO {
  userDetail?: UserDetailResponseDTO;
}

const INTEREST_CATEGORIES = [
  { id: 'music', name: 'Müzik', icon: '🎵' },
  { id: 'sports', name: 'Spor', icon: '⚽' },
  { id: 'technology', name: 'Teknoloji', icon: '💻' },
  { id: 'art', name: 'Sanat', icon: '🎨' },
  { id: 'food', name: 'Yemek', icon: '🍳' },
  { id: 'travel', name: 'Seyahat', icon: '✈️' },
  { id: 'books', name: 'Kitap', icon: '📚' },
  { id: 'movies', name: 'Film', icon: '🎬' },
  { id: 'photography', name: 'Fotoğrafçılık', icon: '📷' },
  { id: 'dance', name: 'Dans', icon: '💃' },
  { id: 'gaming', name: 'Oyun', icon: '🎮' },
  { id: 'fitness', name: 'Fitness', icon: '💪' }
];

export function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('past');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let profileData;
        if (username) {
          profileData = await userProfileService.fetchUserProfile(username);
        }

        if (profileData) {
          const userWithDetails: UserWithDetails = {
            ...profileData,
            userDetail: {
              id: profileData.id,
              username: profileData.username,
              email: profileData.email,
              firstName: profileData.firstName,
              lastName: profileData.lastName,
              isActive: profileData.isActive ?? true,
              bio: profileData.userDetail?.bio || '',
              location: profileData.userDetail?.location || '',
              profilePhotos: profileData.userDetail?.profilePhotos || [],
              lastLoginAt: profileData.lastLoginAt || '',
              createdAt: profileData.createdAt || '',
              updatedAt: profileData.updatedAt || '',
              interests: profileData.userDetail?.interests || []
            }
          };
          setUser(userWithDetails);
          
          setIsOwnProfile(Boolean(
            (!username) || 
            (username === profileData.username) || 
            (currentUser && currentUser.username === profileData.username)
          ));
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [username, currentUser]);


  const handleMessage = () => {
    navigate(`/messages/${user?.userDetail?.username}`);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseFullScreen = () => {
    setSelectedImageIndex(null);
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && user?.userDetail?.profilePhotos?.length) {
      setSelectedImageIndex((prevIndex) => {
        if (prevIndex === null) return 0;
        return (prevIndex + 1) % user.userDetail!.profilePhotos!.length;
      });
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && user?.userDetail?.profilePhotos?.length) {
      setSelectedImageIndex((prevIndex) => {
        if (prevIndex === null) return 0;
        return (prevIndex - 1 + user.userDetail!.profilePhotos!.length) % user.userDetail!.profilePhotos!.length;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg max-w-md w-full">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg 
                className="h-10 w-10 text-red-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                Bir Sorun Oluştu
              </h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          Kullanıcı bulunamadı
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Info */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden p-6">
              {/* Profile Photos */}
              {user?.userDetail?.profilePhotos && user.userDetail.profilePhotos.length > 0 ? (
                <div className="relative w-72 mx-auto">
                  <Swiper
                    effect="cards"
                    grabCursor={true}
                    modules={[EffectCards]}
                    className="w-full aspect-square rounded-2xl"
                  >
                    {user.userDetail.profilePhotos.map((photo, index) => (
                      <SwiperSlide 
                        key={index} 
                        className="rounded-2xl overflow-hidden cursor-pointer group"
                        onClick={() => handleImageClick(index)}
                      >
                        <div className="relative w-full h-full">
                          <img
                            src={photo}
                            alt={`Profile ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 origin-center"
                          />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <svg 
                              className="w-12 h-12 text-white/80" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zm-4 0a3 3 0 11-6 0 3 3 0 016 0z" 
                              />
                            </svg>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : user?.userDetail?.profilePhotos && user.userDetail.profilePhotos.length > 0 ? (
                <div className="w-72 h-72 mx-auto rounded-2xl overflow-hidden">
                  <img
                    src={user.userDetail.profilePhotos[0]}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-72 h-72 mx-auto bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}

              {/* Profile Info */}
              <div className="mt-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {`${user?.firstName} ${user?.lastName}`}
                </h1>
                <p className="text-orange-500 font-medium">@{user?.userDetail?.username}</p>

                {user?.userDetail?.location && (
                  <div className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.userDetail.location}
                  </div>
                )}

                {/* Profile Actions */}
                <div className="flex justify-center space-x-4 mt-6">
                  {!isOwnProfile && (
                    <button
                      onClick={handleMessage}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                        />
                      </svg>
                      <span>Mesaj Gönder</span>
                    </button>
                  )}
                  {isOwnProfile && (
                    <button
                      onClick={handleEditProfile}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                        />
                      </svg>
                      <span>Profili Düzenle</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* About & Interests Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hakkında</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                {user?.userDetail?.bio || 'Henüz bir biyografi eklenmemiş'}
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">İlgi Alanları</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {INTEREST_CATEGORIES.map((category) => {
                    const isSelected = user?.userDetail?.interests?.includes(category.id);
                    return (
                      <button
                        key={category.id}
                        disabled={!isOwnProfile}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1
                          ${isSelected
                            ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/30'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                          } ${!isOwnProfile && 'cursor-default'}`}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </button>
                    );
                  })}
                </div>
                {isOwnProfile && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    İlgi alanlarınızı düzenlemek için profil düzenleme sayfasını kullanın
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Right Column - Events */}
          <div className="w-full lg:w-2/3">
            {/* Events Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`group flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 relative outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 select-none focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:outline-none hover:border-none active:outline-none active:border-none
                      ${activeTab === 'past'
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
                      }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span className="select-none">Geçmiş Etkinlikler</span>
                    {activeTab === 'past' ? (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transform scale-x-100 transition-transform duration-200" />
                    ) : (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('created')}
                    className={`group flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 relative outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 select-none focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:outline-none hover:border-none active:outline-none active:border-none
                      ${activeTab === 'created'
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
                      }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span className="select-none">Oluşturulan Etkinlikler</span>
                    {activeTab === 'created' ? (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transform scale-x-100 transition-transform duration-200" />
                    ) : (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                    )}
                  </button>
                </nav>
              </div>

              {/* Events Grid */}
              <div className="p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Gösterilecek etkinlik yok
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery */}
      {selectedImageIndex !== null && user?.userDetail?.profilePhotos && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
            {/* Previous Image Button */}
            <button 
              onClick={handlePrevImage} 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 group"
            >
              <svg 
                className="w-6 h-6 transform group-hover:-translate-x-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>

            {/* Next Image Button */}
            <button 
              onClick={handleNextImage} 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 group"
            >
              <svg 
                className="w-6 h-6 transform group-hover:translate-x-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </button>

            {/* Close Button */}
            <button 
              onClick={handleCloseFullScreen} 
              className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 group"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative max-w-full max-h-full w-auto h-auto">
              <img 
                src={user.userDetail.profilePhotos[selectedImageIndex]} 
                alt={`Profil ${selectedImageIndex + 1}`} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
              {user.userDetail.profilePhotos.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => handleImageClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === selectedImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 