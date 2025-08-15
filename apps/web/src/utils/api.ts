import axios from 'axios';
import {
  SpotifyUser,
  SpotifyTrack,
  SpotifySearchResponse,
  SpotifyRecentlyPlayedResponse,
  SpotifyRecommendationsResponse,
  SpotifyAlbum,
  SpotifyArtist,
  AuthStatus,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Auth API
export const authAPI = {
  getStatus: async (): Promise<AuthStatus> => {
    const response = await axios.get('/auth/status', { withCredentials: true });
    return response.data;
  },

  login: () => {
    window.location.href = '/auth/login';
  },

  logout: async (): Promise<void> => {
    await axios.get('/auth/logout', { withCredentials: true });
  },

  refresh: async (): Promise<{ access_token: string; expires_in: number }> => {
    const response = await axios.get('/auth/refresh', { withCredentials: true });
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<SpotifyUser> => {
    const response = await api.get('/me');
    return response.data;
  },
};

// Search API
export const searchAPI = {
  search: async (
    query: string,
    type: string = 'track,album,artist',
    limit: number = 20,
    offset: number = 0
  ): Promise<SpotifySearchResponse> => {
    const response = await api.get('/search', {
      params: { q: query, type, limit, offset },
    });
    return response.data;
  },
};

// Tracks API
export const tracksAPI = {
  getTrack: async (id: string): Promise<SpotifyTrack> => {
    const response = await api.get(`/tracks/${id}`);
    return response.data;
  },

  checkSaved: async (id: string): Promise<{ saved: boolean }> => {
    const response = await api.get(`/tracks/${id}/saved`);
    return response.data;
  },

  saveTrack: async (id: string): Promise<void> => {
    await api.put(`/tracks/${id}/save`);
  },

  removeTrack: async (id: string): Promise<void> => {
    await api.delete(`/tracks/${id}/save`);
  },
};

// Albums API
export const albumsAPI = {
  getAlbum: async (id: string): Promise<SpotifyAlbum> => {
    const response = await api.get(`/albums/${id}`);
    return response.data;
  },
};

// Artists API
export const artistsAPI = {
  getArtist: async (id: string): Promise<SpotifyArtist> => {
    const response = await api.get(`/artists/${id}`);
    return response.data;
  },
};

// Recently Played API
export const recentlyPlayedAPI = {
  getRecentlyPlayed: async (limit: number = 20): Promise<SpotifyRecentlyPlayedResponse> => {
    const response = await api.get('/recently-played', {
      params: { limit },
    });
    return response.data;
  },
};

// Top Tracks API
export const topTracksAPI = {
  getTopTracks: async (limit: number = 20): Promise<{ items: SpotifyTrack[] }> => {
    const response = await api.get('/top-tracks', {
      params: { limit },
    });
    return response.data;
  },
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: async (
    seedTracks: string[],
    limit: number = 20
  ): Promise<SpotifyRecommendationsResponse> => {
    const response = await api.get('/recommendations', {
      params: { seed_tracks: seedTracks.join(','), limit },
    });
    return response.data;
  },
};

// Utility functions
export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const getImageUrl = (images: Array<{ url: string }>, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  if (!images || images.length === 0) {
    return '/placeholder-album.png';
  }

  const index = size === 'small' ? images.length - 1 : size === 'large' ? 0 : Math.floor(images.length / 2);
  return images[index]?.url || '/placeholder-album.png';
};