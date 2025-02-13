import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeroSectionProps {
  currentSlide: number;
  setCurrentModal: (modal: 'signIn' | 'signUp' | 'forgotPassword' | null) => void;
}

export function HeroSection({ currentSlide, setCurrentModal }: HeroSectionProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCreateEventClick = () => {
    if (isAuthenticated) {
      navigate('/create-event');
    } else {
      setCurrentModal('signIn');
    }
  };

  return (
    <div className="hero-section mt-16">
      {/* Background Slides */}
      <div className={`hero-slide ${currentSlide === 0 ? 'active' : ''}`} />
      <div className={`hero-slide ${currentSlide === 1 ? 'active' : ''}`} />
      <div className={`hero-slide ${currentSlide === 2 ? 'active' : ''}`} />
      
      {/* Overlay */}
      <div className="hero-overlay" />
      
      {/* Content */}
      <div className="hero-content max-w-7xl mx-auto">
        <div className="animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Welcome to <span className="text-orange-400">Social</span>
            <span className="text-orange-200">Hub</span>
          </h2>
          <p className="text-white text-lg md:text-xl mb-8 max-w-2xl opacity-90">
            Connect with people, join exciting events, and create unforgettable memories together.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Explore Events
            </button>
            <button 
              onClick={handleCreateEventClick}
              className="bg-white text-orange-500 px-8 py-3 rounded-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 