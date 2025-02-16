import { useState, useEffect } from 'react';
import { User } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { AuthService } from '../../services/auth.service';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

interface UserDetail {
  id: number;
  userId: number;
  bio: string | undefined;
  location: string | undefined;
  profilePhotos: string[];
  profilePhoto: string | undefined;
  lastLoginAt: string;
  instagramUrl: string | undefined;
  twitterUrl: string | undefined;
  linkedinUrl: string | undefined;
  facebookUrl: string | undefined;
  interests: string[];
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface UserWithDetails extends User {
  userDetail: {
    id: number;
    userId: number;
    bio: string | undefined;
    location: string | undefined;
    profilePhotos: string[];
    profilePhoto: string | undefined;
    lastLoginAt: string;
    instagramUrl: string | undefined;
    twitterUrl: string | undefined;
    linkedinUrl: string | undefined;
    facebookUrl: string | undefined;
    interests: string[];
    createdAt: string;
    updatedAt: string;
  };
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

const mockEvents = [
  {
    id: 1,
    title: 'Tech Conference 2024',
    date: '2024-06-15',
    location: 'New York',
    image: 'https://picsum.photos/400/200',
  },
  {
    id: 2,
    title: 'Music Festival',
    date: '2024-07-20',
    location: 'Los Angeles',
    image: 'https://picsum.photos/400/200',
  },
];

const mockStats = {
  followers: 1234,
  following: 567,
  eventsCreated: 12,
  eventsAttended: 45,
};

export function UserProfile() {
  const { currentUser } = useAuth();
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('past');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let profileData;
        if (username) {
          profileData = await AuthService.fetchUserProfile(username);
        } else {
          profileData = await AuthService.fetchDetailedProfile();
        }

        if (profileData) {
          const userWithDetails: UserWithDetails = {
            ...profileData,
            userDetail: profileData
          };
          setUser(userWithDetails);
          setIsOwnProfile(!username || username === profileData.username);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || 'Profil bilgileri yüklenirken bir hata oluştu.');
        } else {
          setError('Profil bilgileri yüklenirken beklenmeyen bir hata oluştu.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    navigate(`/messages/${user?.username}`);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
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
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Hata
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:text-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60"
                >
                  Yeniden Dene
                </button>
              </div>
            </div>
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
              {user.userDetail && user.userDetail.profilePhotos && user.userDetail.profilePhotos.length > 0 ? (
                <div className="relative w-72 mx-auto">
                  <Swiper
                    effect="cards"
                    grabCursor={true}
                    modules={[EffectCards]}
                    className="w-full aspect-square rounded-2xl"
                  >
                    {user.userDetail.profilePhotos.map((photo, index) => (
                      <SwiperSlide key={index} className="rounded-2xl overflow-hidden">
                        <img
                          src={photo}
                          alt={`Profile ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : user.profilePhoto ? (
                <div className="w-72 h-72 mx-auto rounded-2xl overflow-hidden">
                  <img
                    src={user.profilePhoto}
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
                  {`${user.firstName} ${user.lastName}`}
                </h1>
                <p className="text-orange-500 font-medium">@{user.username}</p>

                {user.userDetail && user.userDetail.location && (
                  <div className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.userDetail.location}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleEditProfile}
                    className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Profili Düzenle</span>
                  </button>
                  <button
                    onClick={handleMessage}
                    className="w-full px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200 dark:border-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Mesaj Gönder</span>
                  </button>
                </div>
              </div>
            </div>

            {/* About & Interests Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hakkında</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                {user.userDetail?.bio || 'Henüz bir biyografi eklenmemiş'}
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">İlgi Alanları</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {INTEREST_CATEGORIES.map((category) => {
                    const isSelected = user.userDetail?.interests?.includes(category.id);
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

              {/* Social Links */}
              <div className="mt-6 flex space-x-4">
                {user.userDetail && user.userDetail.instagramUrl && (
                  <a
                    href={user.userDetail.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-br from-pink-500 to-orange-500 text-white rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}

                {user.userDetail && user.userDetail.twitterUrl && (
                  <a
                    href={user.userDetail.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#1DA1F2] text-white rounded-xl hover:bg-[#1a8cd8] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                )}

                {user.userDetail && user.userDetail.linkedinUrl && (
                  <a
                    href={user.userDetail.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}

                {user.userDetail && user.userDetail.facebookUrl && (
                  <a
                    href={user.userDetail.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#1877F2] text-white rounded-xl hover:bg-[#0C63D4] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
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
    </div>
  );
} 