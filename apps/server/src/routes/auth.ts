import { Router, Request, Response } from 'express';
import { SpotifyService } from '../spotify';

const router: Router = Router();
const spotifyService = new SpotifyService();

// GET /auth/login - Redirect to Spotify login
router.get('/login', (req: Request, res: Response) => {
  const authUrl = spotifyService.generateAuthUrl();
  res.redirect(authUrl);
});

// GET /auth/callback - Handle Spotify OAuth callback
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, error } = req.query;

    if (error) {
      return res.redirect('/login?error=access_denied');
    }

    if (!code || typeof code !== 'string') {
      return res.redirect('/login?error=invalid_code');
    }

    // Exchange code for tokens
    const tokens = await spotifyService.exchangeCodeForTokens(code);

    // Set tokens in session
    req.session.accessToken = tokens.access_token;
    req.session.refreshToken = tokens.refresh_token;
    req.session.tokenExpiry = Date.now() + tokens.expires_in * 1000;

    // Get user profile
    spotifyService.setAccessToken(tokens.access_token);
    const user = await spotifyService.getCurrentUser();
    req.session.userId = user.id;

    // Redirect to frontend
    res.redirect('/');
  } catch (error) {
    console.error('Auth callback error:', error);
    res.redirect('/login?error=auth_failed');
  }
});

// GET /auth/refresh - Refresh access token
router.get('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.session.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token available' });
    }

    // Refresh the access token
    const tokens = await spotifyService.refreshAccessToken(refreshToken);

    // Update session with new tokens
    req.session.accessToken = tokens.access_token;
    if (tokens.refresh_token) {
      req.session.refreshToken = tokens.refresh_token;
    }
    req.session.tokenExpiry = Date.now() + tokens.expires_in * 1000;

    res.json({
      access_token: tokens.access_token,
      expires_in: tokens.expires_in,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Failed to refresh token' });
  }
});

// GET /auth/logout - Logout user
router.get('/logout', (req: Request, res: Response) => {
  req.session = {} as any;
  res.json({ message: 'Logged out successfully' });
});

// GET /auth/status - Check authentication status
router.get('/status', (req: Request, res: Response) => {
  const isAuthenticated = !!(req.session.accessToken && req.session.userId);
  
  res.json({
    authenticated: isAuthenticated,
    userId: req.session.userId,
    tokenExpiry: req.session.tokenExpiry,
  });
});

export default router;