import { useState } from 'react';
import { User, ErrorResponse } from '../types/auth';
import { AuthService } from '../services/auth.service';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
  onSuccess: (user: User) => void;
}

export function SignInModal({ isOpen, onClose, onForgotPassword, onSignUp, onSuccess }: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await AuthService.login({ email, password });
      onSuccess(response.user);
    } catch (err) {
      const error = err as Error | ErrorResponse;
      if ('code' in error) {
        // API error response
        setError(error.message);
      } else {
        setError(error.message || 'An error occurred during sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Welcome Back!</h2>
        <p className="text-gray-600 mb-8">Please login to your account</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="form-input pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 transition-colors duration-150"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-5 h-5 border-2 border-gray-300 rounded transition-colors 
                              bg-white peer-checked:bg-orange-500 peer-checked:border-orange-500
                              group-hover:border-orange-500">
                </div>
                <div className="absolute top-[3px] left-[3px] text-white transform opacity-0 
                              peer-checked:opacity-100 transition-opacity">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 6L9 17L4 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800">Remember me</span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="relative px-3 py-1 text-sm text-orange-500 overflow-hidden group
                       transition-all duration-300 ease-in-out
                       hover:text-orange-600 rounded-md"
            >
              <span className="relative z-10">Forgot Password?</span>
              <div className="absolute inset-0 bg-orange-50 transform scale-x-0 group-hover:scale-x-100 
                           transition-transform duration-300 origin-left"></div>
            </button>
          </div>
          
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button className="btn-social w-1/3">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <span className="text-sm text-gray-600">Don't have an account?</span>
          <button
            type="button"
            onClick={onSignUp}
            className="relative ml-2 px-4 py-1.5 text-sm font-medium text-orange-500 
                     rounded-md overflow-hidden group"
          >
            <span className="relative z-10">Sign up now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100 
                         transform scale-x-0 group-hover:scale-x-100 
                         transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>
    </div>
  );
} 