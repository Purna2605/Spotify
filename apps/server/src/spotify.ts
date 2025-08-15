import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';
import {
  SpotifyTokens,
  SpotifyUser,
  SpotifyTrack,
  SpotifySearchResponse,
  SpotifyRecentlyPlayedResponse,
  SpotifyRecommendationsResponse,
  SpotifyAlbum,
  SpotifyArtist,
} from './types';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE = 'https://accounts.spotify.com';

export class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private apiClient: AxiosInstance;

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID!;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    this.redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

    this.apiClient = axios.create({
      baseURL: SPOTIFY_API_BASE,
      timeout: 10000,
    });
  }

  // Generate Spotify OAuth URL
  generateAuthUrl(): string {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-read-recently-played',
      'user-top-read',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read',
      'user-follow-read',
    ];

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: scopes.join(' '),
      show_dialog: 'true',
    });

    return `${SPOTIFY_ACCOUNTS_BASE}/authorize?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
    const response = await axios.post(
      `${SPOTIFY_ACCOUNTS_BASE}/api/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString('base64')}`,
        },
      }
    );

    return response.data;
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
    const response = await axios.post(
      `${SPOTIFY_ACCOUNTS_BASE}/api/token`,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString('base64')}`,
        },
      }
    );

    return response.data;
  }

  // Set access token for API requests
  setAccessToken(accessToken: string): void {
    this.apiClient.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${accessToken}`;
  }

  // Get current user profile
  async getCurrentUser(): Promise<SpotifyUser> {
    const response = await this.apiClient.get('/me');
    return response.data;
  }

  // Search for tracks, albums, and artists
  async search(
    query: string,
    types: string[] = ['track', 'album', 'artist'],
    limit: number = 20,
    offset: number = 0
  ): Promise<SpotifySearchResponse> {
    const response = await this.apiClient.get('/search', {
      params: {
        q: query,
        type: types.join(','),
        limit,
        offset,
      },
    });
    return response.data;
  }

  // Get track details
  async getTrack(trackId: string): Promise<SpotifyTrack> {
    const response = await this.apiClient.get(`/tracks/${trackId}`);
    return response.data;
  }

  // Get album details
  async getAlbum(albumId: string): Promise<SpotifyAlbum> {
    const response = await this.apiClient.get(`/albums/${albumId}`);
    return response.data;
  }

  // Get artist details
  async getArtist(artistId: string): Promise<SpotifyArtist> {
    const response = await this.apiClient.get(`/artists/${artistId}`);
    return response.data;
  }

  // Get recently played tracks
  async getRecentlyPlayed(limit: number = 20): Promise<SpotifyRecentlyPlayedResponse> {
    const response = await this.apiClient.get('/me/player/recently-played', {
      params: { limit },
    });
    return response.data;
  }

  // Get user's top tracks
  async getTopTracks(limit: number = 20): Promise<{ items: SpotifyTrack[] }> {
    const response = await this.apiClient.get('/me/top/tracks', {
      params: { limit },
    });
    return response.data;
  }

  // Get recommendations based on seed tracks
  async getRecommendations(
    seedTracks: string[],
    limit: number = 20
  ): Promise<SpotifyRecommendationsResponse> {
    const response = await this.apiClient.get('/recommendations', {
      params: {
        seed_tracks: seedTracks.join(','),
        limit,
      },
    });
    return response.data;
  }

  // Check if user has saved a track
  async checkSavedTrack(trackId: string): Promise<boolean[]> {
    const response = await this.apiClient.get('/me/tracks/contains', {
      params: { ids: trackId },
    });
    return response.data;
  }

  // Save a track to user's library
  async saveTrack(trackId: string): Promise<void> {
    await this.apiClient.put('/me/tracks', null, {
      params: { ids: trackId },
    });
  }

  // Remove a track from user's library
  async removeTrack(trackId: string): Promise<void> {
    await this.apiClient.delete('/me/tracks', {
      params: { ids: trackId },
    });
  }
}

// Validation schemas
export const SearchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  type: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
  offset: z.coerce.number().min(0).optional(),
});

export const TrackIdSchema = z.object({
  id: z.string().min(1, 'Track ID is required'),
});

export const AlbumIdSchema = z.object({
  id: z.string().min(1, 'Album ID is required'),
});

export const ArtistIdSchema = z.object({
  id: z.string().min(1, 'Artist ID is required'),
});