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
  bio: string | null;
  location: string | null;
  profilePhotos: string[];
  profilePhoto: string | null;
  lastLoginAt: string;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedInUrl: string | null;
  facebookUrl: string | null;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserWithDetails extends User {
  userDetail: UserDetail;
}

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

  if (!username && currentUser) {
    return <Navigate to={`/profile/@${currentUser.username}`} replace />;
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const cleanUsername = username?.replace('@', '');
        const isOwnProfileCheck = currentUser?.username === cleanUsername;
        setIsOwnProfile(isOwnProfileCheck);
        
        const profileData = isOwnProfileCheck
          ? await AuthService.getDetailedProfile()
          : await AuthService.getUserProfile(cleanUsername || '');
        
        if (profileData) {
          setUser(profileData as UserWithDetails);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username, currentUser]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    navigate(`/messages/${user.username}`);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Info */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden p-6">
              {/* Profile Photos */}
              {user.userDetail.profilePhotos && user.userDetail.profilePhotos.length > 0 ? (
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
                
                {user.userDetail.location && (
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
                  {isOwnProfile ? (
                    <button
                      onClick={handleEditProfile}
                      className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleFollow}
                        className={`w-full px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                          ${isFollowing 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                          }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {isFollowing ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          )}
                        </svg>
                        <span>{isFollowing ? 'Following' : 'Follow'}</span>
                      </button>
                      <button
                        onClick={handleMessage}
                        className="w-full px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200 dark:border-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Message</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* About & Interests Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">About</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                {user.userDetail.bio || 'No bio available'}
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interests</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.userDetail.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-4 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors duration-200 cursor-pointer"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 flex space-x-4">
                {user.userDetail.instagramUrl && (
                  <a
                    href={user.userDetail.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-br from-pink-500 to-orange-500 text-white rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}

                {user.userDetail.twitterUrl && (
                  <a
                    href={user.userDetail.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#1DA1F2] text-white rounded-xl hover:bg-[#1a8cd8] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                  </a>
                )}

                {user.userDetail.linkedInUrl && (
                  <a
                    href={user.userDetail.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}

                {user.userDetail.facebookUrl && (
                  <a
                    href={user.userDetail.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#1877F2] text-white rounded-xl hover:bg-[#0C63D4] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Events */}
          <div className="w-full lg:w-2/3">
            {/* Events Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
                      ${activeTab === 'past'
                        ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                  >
                    Past Events
                  </button>
                  <button
                    onClick={() => setActiveTab('created')}
                    className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
                      ${activeTab === 'created'
                        ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                  >
                    Created Events
                  </button>
                </nav>
              </div>

              {/* Events Grid */}
              <div className="p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  No events to display
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 