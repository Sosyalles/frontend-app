import { useState } from 'react';
import { User } from '../../types/auth';
import { AuthenticatedNavbar } from '../layout/AuthenticatedNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavbar
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogout={logout}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="bg-white rounded-lg shadow">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-lg"></div>
            <div className="absolute -bottom-16 left-8">
              <img
                src={user.profilePhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => navigate('/edit-profile')}
                className="px-4 py-2 bg-white text-orange-500 rounded-md text-sm font-medium hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-8 pt-20 pb-8">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {`${user.firstName} ${user.lastName}`}
              </h1>
              <p className="text-sm text-gray-600">@{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* About Me */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">About Me</h2>
              <p className="mt-2 text-gray-600">
                {user.bio || 'No bio added yet.'}
              </p>
            </div>

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Interests</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Social Media</h2>
                <div className="mt-2 flex space-x-4">
                  {user.socialLinks.instagram && (
                    <a 
                      href={`https://instagram.com/${user.socialLinks.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-pink-600"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {user.socialLinks.twitter && (
                    <a 
                      href={`https://twitter.com/${user.socialLinks.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-blue-400"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 