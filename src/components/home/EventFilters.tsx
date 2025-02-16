import { useState } from 'react';

interface EventFiltersProps {
  onFilterChange: (filters: {
    date: string;
    location: string;
    attendees: string;
    sortBy: string;
  }) => void;
}

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    date: 'all',
    location: 'all',
    attendees: 'all',
    sortBy: 'date'
  });

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    const resetFilters = {
      date: 'all',
      location: 'all',
      attendees: 'all',
      sortBy: 'date'
    };
    console.log('EventFilters - Clearing all filters:', resetFilters);
    setFilters(resetFilters);
    onFilterChange(resetFilters);

    // Tüm select elementlerini varsayılan değerlerine sıfırla
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      if (select.name === 'sortBy') {
        select.value = 'date';
      } else {
        select.value = 'all';
      }
    });
  };

  const handleSingleFilterClear = (key: string) => {
    const newFilters = {
      ...filters,
      [key]: key === 'sortBy' ? 'date' : 'all'
    };
    console.log('EventFilters - Clearing single filter:', key, newFilters);
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white shadow-sm border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full md:w-auto"
        >
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="text-gray-700 font-medium">Filtreler</span>
            {Object.values(filters).some(value => value !== 'all') && (
              <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
                Aktif
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Filter Options */}
        <div className={`mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 ${isOpen ? 'block' : 'hidden'}`}>
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
            <select
              name="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            >
              <option value="all">Tüm Tarihler</option>
              <option value="today">Bugün</option>
              <option value="tomorrow">Yarın</option>
              <option value="thisWeek">Bu Hafta</option>
              <option value="thisMonth">Bu Ay</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konum</label>
            <select
              name="location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            >
              <option value="all">Tüm Konumlar</option>
              <option value="istanbul">İstanbul</option>
              <option value="ankara">Ankara</option>
              <option value="izmir">İzmir</option>
              <option value="antalya">Antalya</option>
              <option value="bursa">Bursa</option>
            </select>
          </div>

          {/* Attendees Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Katılımcı Sayısı</label>
            <select
              name="attendees"
              value={filters.attendees}
              onChange={(e) => handleFilterChange('attendees', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            >
              <option value="all">Tüm Boyutlar</option>
              <option value="small">Küçük (&lt; 50)</option>
              <option value="medium">Orta (50-200)</option>
              <option value="large">Büyük (&gt; 200)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            >
              <option value="date">Tarih</option>
              <option value="attendees">Katılımcı Sayısı</option>
              <option value="popularity">Popülerlik</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {isOpen && Object.entries(filters).some(([_, value]) => value !== 'all') && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value === 'all') return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700"
                >
                  {key === 'date' && 'Tarih'}
                  {key === 'location' && 'Konum'}
                  {key === 'attendees' && 'Katılımcı'}
                  {key === 'sortBy' && 'Sıralama'}
                  : {value}
                  <button
                    onClick={() => handleSingleFilterClear(key)}
                    className="ml-2 inline-flex items-center"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              );
            })}
            <button
              onClick={handleClearAll}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Tümünü Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 