import React, { useEffect, useState } from 'react';
import { Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrackCard } from '../components/TrackCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  recentlyPlayedAPI, 
  topTracksAPI, 
  recommendationsAPI
} from '../utils/api';
import { SpotifyTrack } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  
  const [recentlyPlayed, setRecentlyPlayed] = useState<SpotifyTrack[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentlyPlayedRes, topTracksRes] = await Promise.all([
          recentlyPlayedAPI.getRecentlyPlayed(10),
          topTracksAPI.getTopTracks(10)
        ]);

        setRecentlyPlayed(recentlyPlayedRes.items.map(item => item.track));
        setTopTracks(topTracksRes.items);

        // Get recommendations based on top tracks
        if (topTracksRes.items.length > 0) {
          const seedTracks = topTracksRes.items.slice(0, 3).map(track => track.id);
          const recommendationsRes = await recommendationsAPI.getRecommendations(seedTracks, 10);
          setRecommendations(recommendationsRes.tracks);
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotify-black">
      {/* Header */}
      <header className="bg-spotify-dark-gray border-b border-spotify-medium-gray px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Good evening</h1>
            {user && (
              <div className="flex items-center gap-2 text-spotify-text-secondary">
                <User className="w-4 h-4" />
                <span>{user.display_name}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/search')}
              className="p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
            
            {user?.images?.[0] && (
              <img
                src={user.images[0].url}
                alt={user.display_name}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 space-y-8">
        {/* Recently Played */}
        {recentlyPlayed.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Recently Played</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recentlyPlayed.slice(0, 8).map((track) => (
                <div key={track.id} className="bg-spotify-dark-gray p-4 rounded-lg hover:bg-spotify-medium-gray transition-colors duration-200">
                  <TrackCard track={track} showAlbum={false} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Your Top Tracks */}
        {topTracks.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Your Top Tracks</h2>
            <div className="space-y-2">
              {topTracks.slice(0, 5).map((track, index) => (
                <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-spotify-medium-gray transition-colors duration-200">
                  <span className="text-2xl font-bold text-spotify-text-tertiary w-8">
                    {index + 1}
                  </span>
                  <TrackCard track={track} showAlbum={false} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended for You */}
        {recommendations.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Recommended for You</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recommendations.map((track) => (
                <div key={track.id} className="bg-spotify-dark-gray p-4 rounded-lg hover:bg-spotify-medium-gray transition-colors duration-200">
                  <TrackCard track={track} showAlbum={false} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/search')}
              className="bg-spotify-dark-gray p-6 rounded-lg hover:bg-spotify-medium-gray transition-colors duration-200 text-left"
            >
              <Search className="w-8 h-8 text-spotify-green mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Search Music</h3>
              <p className="text-spotify-text-secondary">Find your favorite songs, artists, and albums</p>
            </button>
            
            <button
              onClick={() => navigate('/search?type=album')}
              className="bg-spotify-dark-gray p-6 rounded-lg hover:bg-spotify-medium-gray transition-colors duration-200 text-left"
            >
              <div className="w-8 h-8 bg-spotify-green rounded mb-3 flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Browse Albums</h3>
              <p className="text-spotify-text-secondary">Discover new albums and releases</p>
            </button>
            
            <button
              onClick={() => navigate('/search?type=artist')}
              className="bg-spotify-dark-gray p-6 rounded-lg hover:bg-spotify-medium-gray transition-colors duration-200 text-left"
            >
              <div className="w-8 h-8 bg-spotify-green rounded-full mb-3 flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Find Artists</h3>
              <p className="text-spotify-text-secondary">Explore artists and their music</p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};