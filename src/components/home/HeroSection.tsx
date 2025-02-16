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
    <div className="hero-section">
      {/* Background Slides */}
      <div className={`hero-slide ${currentSlide === 0 ? 'active' : ''}`} />
      <div className={`hero-slide ${currentSlide === 1 ? 'active' : ''}`} />
      <div className={`hero-slide ${currentSlide === 2 ? 'active' : ''}`} />

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content max-w-7xl mx-auto h-full flex items-center justify-center px-4">
        <div className="animate-fade-in-up text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to <span className="text-orange-400">Social</span>
            <span className="text-orange-200">Hub</span>
          </h2>
          <p className="text-white text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
            İnsanlarla bağlantı kur, heyecan verici etkinliklere katıl ve unutulmaz anılar biriktir.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <button className="bg-orange-500 text-white px-10 py-4 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg">
              Etkinlikleri Keşfet
            </button>
            <button
              onClick={handleCreateEventClick}
              className="bg-white text-orange-500 px-10 py-4 rounded-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg"
            >
              Etkinlik Oluştur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 