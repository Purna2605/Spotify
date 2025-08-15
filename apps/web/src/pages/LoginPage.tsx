import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotify-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-spotify-green rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to Spotify Clone
          </h1>
          <p className="text-spotify-text-secondary text-lg">
            Listen to your favorite music with a beautiful interface
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-spotify-text-secondary">
            <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
            <span>Stream millions of songs</span>
          </div>
          <div className="flex items-center gap-3 text-spotify-text-secondary">
            <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
            <span>Create and share playlists</span>
          </div>
          <div className="flex items-center gap-3 text-spotify-text-secondary">
            <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
            <span>Discover new music</span>
          </div>
          <div className="flex items-center gap-3 text-spotify-text-secondary">
            <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
            <span>Listen offline</span>
          </div>
        </div>

        {/* Login Button */}
        <div className="pt-6">
          <button
            onClick={login}
            className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg font-semibold"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Continue with Spotify
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-xs text-spotify-text-tertiary">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};