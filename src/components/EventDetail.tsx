import { useState, useEffect } from 'react';
import { Event } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from './layout/Navbar';
import { AuthenticatedNavbar } from './layout/AuthenticatedNavbar';

interface EventDetailProps {
  event: Event;
}

const getCategoryImage = (category: string): string => {
  const categoryImages = {
    sports: '/sporresim/basketball-default.jpg',
    music: '/sporresim/music-default.jpg',
    tech: '/sporresim/tech-default.jpg',
    business: '/sporresim/business-default.jpg',
    art: '/sporresim/art-default.jpg',
    social: '/sporresim/social-default.jpg',
  };

  return categoryImages[category as keyof typeof categoryImages] || '/sporresim/default-event.jpg';
};

export function EventDetail({ event }: EventDetailProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, isAuthenticated, logout } = useAuth();
  const eventImage = event.image || getCategoryImage(event.category);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        {isAuthenticated && currentUser ? (
          <AuthenticatedNavbar
            user={currentUser}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLogout={logout}
          />
        ) : (
          <Navbar
            onSignIn={() => { }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
      </div>

      {/* Hero Banner */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
        <img
          src={event.bannerImage || '/images/categories/default-banner.jpg'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end pb-26">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6 text-white">{event.title}</h1>
              <div className="flex items-center gap-6 text-base text-white/90">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{event.attendees} Katılımcı</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">About Event</h2>
              <p className="text-gray-600">
                {event.description}
              </p>
              {event.schedule && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Event Schedule</h3>
                  <div className="space-y-6">
                    {event.schedule.map((day) => (
                      <div key={day.day} className="border-l-4 border-orange-500 pl-4">
                        <h4 className="text-lg font-medium mb-2">{day.day}</h4>
                        <div className="space-y-3">
                          {day.events.map((item, index) => (
                            <div key={index} className="flex">
                              <span className="text-gray-500 w-32 flex-shrink-0">{item.time}</span>
                              <div>
                                <p className="font-medium">{item.title}</p>
                                {item.speaker && (
                                  <p className="text-sm text-gray-600">Speaker: {item.speaker}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Event Info */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <button className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors mb-4">
                Join Event
              </button>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Date & Time</h3>
                  <p className="text-sm text-gray-600">{event.date}</p>
                  <p className="text-sm text-gray-600">{event.startTime} - {event.endTime}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Location</h3>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <div className="mt-2 h-40 bg-gray-200 rounded-lg">
                    {/* Map will be added here */}
                  </div>
                  <button className="mt-2 text-sm text-orange-500 hover:text-orange-600">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            {event.organizer && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-medium mb-4">Organizer</h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{event.organizer.name}</p>
                    <p className="text-sm text-gray-500">{event.organizer.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 