import { Event } from '../../types/dtos/event.dto';

interface EventsGridProps {
  events: Event[];
  onEventSelect: (event: Event) => void;
}

const getCategoryImage = (category: string): string => {
  const categoryImages = {
    sports: '/images/categories/sports.jpg',
    music: '/images/categories/music.jpg',
    tech: '/images/categories/tech.jpg',
    business: '/images/categories/business.jpg',
    art: '/images/categories/art.jpg',
    social: '/images/categories/social.jpg',
  };

  return categoryImages[category as keyof typeof categoryImages] || '/images/categories/default.jpg';
};

export function EventsGrid({ events, onEventSelect }: EventsGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          {events.length} {events.length === 1 ? 'Event' : 'Events'} Found
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => onEventSelect(event)}
          >
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              <img
                src={event.image || getCategoryImage(event.category)}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {event.featured && (
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                    Featured
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold mb-2">{event.title}</h4>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {event.date}
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {event.attendees} Attendees
              </div>
              <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 transform hover:scale-105">
                Join Event
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 