import { Router, Request, Response } from 'express';
import { SpotifyService, SearchQuerySchema, TrackIdSchema } from '../spotify';
import { requireAuth, checkTokenExpiry } from '../middleware';

const router: Router = Router();
const spotifyService = new SpotifyService();

// Apply authentication middleware to all API routes
router.use(requireAuth);
router.use(checkTokenExpiry);

// Set access token for all requests
router.use((req: Request, res: Response, next) => {
  spotifyService.setAccessToken(req.session.accessToken!);
  next();
});

// GET /api/me - Get current user profile
router.get('/me', async (req: Request, res: Response) => {
  try {
    const user = await spotifyService.getCurrentUser();
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// GET /api/search - Search for tracks, albums, and artists
router.get('/search', async (req: Request, res: Response) => {
  try {
    const validatedQuery = SearchQuerySchema.parse(req.query);
    const { q, type, limit = 20, offset = 0 } = validatedQuery;

    const types = type ? type.split(',') : ['track', 'album', 'artist'];
    const searchResults = await spotifyService.search(q, types, limit, offset);

    res.json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(400).json({ error: 'Invalid search parameters' });
  }
});

// GET /api/tracks/:id - Get track details
router.get('/tracks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = TrackIdSchema.parse(req.params);
    const track = await spotifyService.getTrack(id);
    res.json(track);
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(400).json({ error: 'Invalid track ID' });
  }
});

// GET /api/albums/:id - Get album details
router.get('/albums/:id', async (req: Request, res: Response) => {
  try {
    const { id } = TrackIdSchema.parse(req.params);
    const album = await spotifyService.getAlbum(id);
    res.json(album);
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(400).json({ error: 'Invalid album ID' });
  }
});

// GET /api/artists/:id - Get artist details
router.get('/artists/:id', async (req: Request, res: Response) => {
  try {
    const { id } = TrackIdSchema.parse(req.params);
    const artist = await spotifyService.getArtist(id);
    res.json(artist);
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(400).json({ error: 'Invalid artist ID' });
  }
});

// GET /api/recently-played - Get recently played tracks
router.get('/recently-played', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const recentlyPlayed = await spotifyService.getRecentlyPlayed(limit);
    res.json(recentlyPlayed);
  } catch (error) {
    console.error('Error fetching recently played:', error);
    res.status(500).json({ error: 'Failed to fetch recently played tracks' });
  }
});

// GET /api/top-tracks - Get user's top tracks
router.get('/top-tracks', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const topTracks = await spotifyService.getTopTracks(limit);
    res.json(topTracks);
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

// GET /api/recommendations - Get track recommendations
router.get('/recommendations', async (req: Request, res: Response) => {
  try {
    const { seed_tracks, limit = 20 } = req.query;
    
    if (!seed_tracks || typeof seed_tracks !== 'string') {
      return res.status(400).json({ error: 'seed_tracks parameter is required' });
    }

    const seedTracks = seed_tracks.split(',');
    const recommendations = await spotifyService.getRecommendations(seedTracks, parseInt(limit as string));
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// GET /api/tracks/:id/saved - Check if track is saved
router.get('/tracks/:id/saved', async (req: Request, res: Response) => {
  try {
    const { id } = TrackIdSchema.parse(req.params);
    const saved = await spotifyService.checkSavedTrack(id);
    res.json({ saved: saved[0] });
  } catch (error) {
    console.error('Error checking saved track:', error);
    res.status(400).json({ error: 'Invalid track ID' });
  }
});

// PUT /api/tracks/:id/save - Save track to library
router.put('/tracks/:id/save', async (req: Request, res: Response) => {
  try {
    const { id } = TrackIdSchema.parse(req.params);
    await spotifyService.saveTrack(id);
    res.json({ message: 'Track saved successfully' });
  } catch (error) {
    console.error('Error saving track:', error);
    res.status(400).json({ error: 'Invalid track ID' });
  }
});

// DELETE /api/tracks/:id/save - Remove track from library
router.delete('/tracks/:id/save', async (req: Request, res: Response) => {
  try {
    const { id } = TrackIdSchema.parse(req.params);
    await spotifyService.removeTrack(id);
    res.json({ message: 'Track removed successfully' });
  } catch (error) {
    console.error('Error removing track:', error);
    res.status(400).json({ error: 'Invalid track ID' });
  }
});

export default router;