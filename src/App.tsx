import { useState, useMemo, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom'
import eventsData from './data/events.json'
import categoriesData from './data/categories.json'
import { Event } from './types'
import { SignInModal } from './components/SignInModal'
import { SignUpModal } from './components/SignUpModal'
import { ForgotPasswordModal } from './components/ForgotPasswordModal'
import { EventDetail } from './components/EventDetail'
import { Navbar } from './components/layout/Navbar'
import { AuthenticatedNavbar } from './components/layout/AuthenticatedNavbar'
import { HeroSection } from './components/home/HeroSection'
import { CategoriesSection } from './components/home/CategoriesSection'
import { EventsGrid } from './components/home/EventsGrid'
import { EventFilters } from './components/home/EventFilters'
import { UserProfile } from './components/profile/UserProfile'
import { CreateEvent } from './components/events/CreateEvent'
import { useAuth } from './contexts/AuthContext'
import { EditProfile } from './components/profile/EditProfile'
import { ProtectedRoute } from './components/routing/ProtectedRoute'
import './App.css'

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

// Home Page Component
function HomePage({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  currentSlide,
  navigate,
  setCurrentModal
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  currentSlide: number;
  navigate: (path: string) => void;
  setCurrentModal: (modal: 'signIn' | 'signUp' | 'forgotPassword' | null) => void;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeFilters, setActiveFilters] = useState({
    date: 'all',
    location: 'all',
    attendees: 'all',
    sortBy: 'date'
  });

  const filteredEvents = useMemo(() => {
    let filtered = eventsData.events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || event.category === selectedCategory;

      // Apply additional filters
      let matchesFilters = true;

      // Date filter
      if (activeFilters.date !== 'all') {
        const eventDate = new Date(event.date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        switch (activeFilters.date) {
          case 'today':
            matchesFilters = eventDate.toDateString() === today.toDateString();
            break;
          case 'tomorrow':
            matchesFilters = eventDate.toDateString() === tomorrow.toDateString();
            break;
          case 'thisWeek':
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            matchesFilters = eventDate >= today && eventDate <= nextWeek;
            break;
          case 'thisMonth':
            matchesFilters = eventDate.getMonth() === today.getMonth() &&
                           eventDate.getFullYear() === today.getFullYear();
            break;
        }
      }

      // Location filter
      if (activeFilters.location !== 'all') {
        const eventLocation = event.location.toLowerCase();
        switch (activeFilters.location) {
          case 'sanFrancisco':
            matchesFilters = matchesFilters && eventLocation.includes('san francisco');
            break;
          case 'newYork':
            matchesFilters = matchesFilters && eventLocation.includes('new york');
            break;
          case 'losAngeles':
            matchesFilters = matchesFilters && eventLocation.includes('los angeles');
            break;
          case 'chicago':
            matchesFilters = matchesFilters && eventLocation.includes('chicago');
            break;
          case 'miami':
            matchesFilters = matchesFilters && eventLocation.includes('miami');
            break;
        }
      }

      // Attendees filter
      if (activeFilters.attendees !== 'all') {
        const attendees = event.attendees;
        switch (activeFilters.attendees) {
          case 'small':
            matchesFilters = matchesFilters && attendees < 50;
            break;
          case 'medium':
            matchesFilters = matchesFilters && attendees >= 50 && attendees <= 200;
            break;
          case 'large':
            matchesFilters = matchesFilters && attendees > 200;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesFilters;
    });

    // Apply sorting
    switch (activeFilters.sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'attendees':
        filtered.sort((a, b) => b.attendees - a.attendees);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.attendees - a.attendees); // Using attendees as popularity metric
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, activeFilters]);

  return (
    <>
      {isAuthenticated && user ? (
        <AuthenticatedNavbar
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLogout={logout}
        />
      ) : (
        <Navbar
          onSignIn={() => setCurrentModal('signIn')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
      <HeroSection currentSlide={currentSlide} setCurrentModal={setCurrentModal} />
      <CategoriesSection
        categories={categoriesData.categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <EventFilters onFilterChange={setActiveFilters} />
      <EventsGrid
        events={filteredEvents}
        onEventSelect={(event) => navigate(`/event/${event.id}`)}
      />
    </>
  );
}

// Home Page Wrapper Component
function HomePageWrapper({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  currentSlide,
  setCurrentModal
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  currentSlide: number;
  setCurrentModal: (modal: 'signIn' | 'signUp' | 'forgotPassword' | null) => void;
}) {
  const navigate = useNavigate();

  return (
    <HomePage
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      currentSlide={currentSlide}
      navigate={navigate}
      setCurrentModal={setCurrentModal}
    />
  );
}

// Event Detail Page Wrapper
function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, login, logout } = useAuth();
  const [currentModal, setCurrentModal] = useState<'signIn' | 'signUp' | 'forgotPassword' | null>(null);
  const event = eventsData.events.find(e => e.id.toString() === id);

  if (!event) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {isAuthenticated && user ? (
        <AuthenticatedNavbar
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLogout={logout}
        />
      ) : (
        <Navbar
          onSignIn={() => setCurrentModal('signIn')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
      <EventDetail
        event={event}
        onBack={() => navigate('/')}
      />
      {/* Modals */}
      <SignInModal
        isOpen={currentModal === 'signIn'}
        onClose={() => setCurrentModal(null)}
        onForgotPassword={() => setCurrentModal('forgotPassword')}
        onSignUp={() => setCurrentModal('signUp')}
        onSuccess={(user) => {
          login(user);
          setCurrentModal(null);
        }}
      />
      <SignUpModal
        isOpen={currentModal === 'signUp'}
        onClose={() => setCurrentModal(null)}
        onBackToSignIn={() => setCurrentModal('signIn')}
        onSuccess={(user) => {
          login(user);
          setCurrentModal(null);
        }}
      />
      <ForgotPasswordModal
        isOpen={currentModal === 'forgotPassword'}
        onClose={() => setCurrentModal(null)}
        onBackToSignIn={() => setCurrentModal('signIn')}
      />
    </>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentModal, setCurrentModal] = useState<'signIn' | 'signUp' | 'forgotPassword' | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { user, isAuthenticated, login, logout } = useAuth();

  // Background slider animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePageWrapper
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            currentSlide={currentSlide}
            setCurrentModal={setCurrentModal}
          />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile user={user!} />} />
            <Route path="/edit-profile" element={<EditProfile user={user!} />} />
            <Route path="/create-event" element={<CreateEvent />} />
          </Route>
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Modals */}
        <SignInModal
          isOpen={currentModal === 'signIn'}
          onClose={() => setCurrentModal(null)}
          onForgotPassword={() => setCurrentModal('forgotPassword')}
          onSignUp={() => setCurrentModal('signUp')}
          onSuccess={(user) => {
            login(user);
            setCurrentModal(null);
          }}
        />
        <SignUpModal
          isOpen={currentModal === 'signUp'}
          onClose={() => setCurrentModal(null)}
          onBackToSignIn={() => setCurrentModal('signIn')}
          onSuccess={(user) => {
            login(user);
            setCurrentModal(null);
          }}
        />
        <ForgotPasswordModal
          isOpen={currentModal === 'forgotPassword'}
          onClose={() => setCurrentModal(null)}
          onBackToSignIn={() => setCurrentModal('signIn')}
        />
      </div>
    </Router>
  )
}

export default App
