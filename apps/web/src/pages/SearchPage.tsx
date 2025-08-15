import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Filter } from 'lucide-react';
import { TrackCard } from '../components/TrackCard';
import { AlbumCard } from '../components/AlbumCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { searchAPI } from '../utils/api';
import { SpotifyTrack, SpotifyAlbum, SpotifyArtist, SearchFilters } from '../types';
import { cn } from '../utils/cn';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({
    type: (searchParams.get('type') as any) || 'all',
    limit: 20
  });
  
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters, searchOffset: number = 0, append: boolean = false) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const types = searchFilters.type === 'all' ? 'track,album,artist' : searchFilters.type;
      const response = await searchAPI.search(
        searchQuery,
        types,
        searchFilters.limit,
        searchOffset
      );

      if (append) {
        setTracks(prev => [...prev, ...response.tracks.items]);
        setAlbums(prev => [...prev, ...response.albums.items]);
        setArtists(prev => [...prev, ...response.artists.items]);
      } else {
        setTracks(response.tracks.items);
        setAlbums(response.albums.items);
        setArtists(response.artists.items);
      }

      setHasMore(
        response.tracks.items.length === searchFilters.limit ||
        response.albums.items.length === searchFilters.limit ||
        response.artists.items.length === searchFilters.limit
      );
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        setOffset(0);
        performSearch(query, filters, 0, false);
        setSearchParams({ q: query, type: filters.type });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, filters, performSearch, setSearchParams]);

  // Load more results
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && query.trim()) {
      const newOffset = offset + filters.limit;
      setOffset(newOffset);
      performSearch(query, filters, newOffset, true);
    }
  }, [isLoading, hasMore, query, filters, offset, performSearch]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const handleFilterChange = (newType: SearchFilters['type']) => {
    setFilters(prev => ({ ...prev, type: newType }));
    setOffset(0);
  };

  const renderResults = () => {
    if (filters.type === 'all' || filters.type === 'track') {
      return (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Tracks</h2>
          <div className="space-y-2">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </section>
      );
    }

    if (filters.type === 'album') {
      return (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      );
    }

    if (filters.type === 'artist') {
      return (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-spotify-dark-gray p-4 rounded-lg hover:bg-spotify-medium-gray transition-colors duration-200 text-center">
                <img
                  src={artist.images?.[0]?.url || '/placeholder-artist.png'}
                  alt={artist.name}
                  className="w-full aspect-square rounded-full object-cover mb-4"
                />
                <h3 className="font-semibold text-white truncate">{artist.name}</h3>
                <p className="text-sm text-spotify-text-secondary">
                  {artist.followers.total.toLocaleString()} followers
                </p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-spotify-black">
      {/* Header */}
      <header className="bg-spotify-dark-gray border-b border-spotify-medium-gray px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-spotify-text-secondary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for tracks, albums, or artists..."
              className="w-full bg-spotify-medium-gray text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-4">
          <Filter className="w-4 h-4 text-spotify-text-secondary" />
          <span className="text-sm text-spotify-text-secondary">Filter by:</span>
          <div className="flex gap-2">
            {(['all', 'track', 'album', 'artist'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200',
                  filters.type === type
                    ? 'bg-spotify-green text-black'
                    : 'bg-spotify-medium-gray text-white hover:bg-spotify-light-gray'
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="px-6 py-8">
        {query.trim() ? (
          <>
            {renderResults()}
            
            {isLoading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            )}
            
            {!isLoading && !hasMore && (tracks.length > 0 || albums.length > 0 || artists.length > 0) && (
              <p className="text-center text-spotify-text-secondary py-8">
                No more results
              </p>
            )}
            
            {!isLoading && tracks.length === 0 && albums.length === 0 && artists.length === 0 && (
              <div className="text-center py-16">
                <p className="text-spotify-text-secondary text-lg mb-2">No results found</p>
                <p className="text-spotify-text-tertiary">Try adjusting your search terms or filters</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-spotify-text-tertiary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Search for Music</h2>
            <p className="text-spotify-text-secondary">
              Find your favorite tracks, albums, and artists
            </p>
          </div>
        )}
      </main>
    </div>
  );
};