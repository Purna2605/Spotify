import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { SessionData } from './types';

// Extend Express Request interface to include session
declare global {
  namespace Express {
    interface Request {
      session: SessionData;
    }
  }
}

// Authentication middleware
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Check if token is expired
export const checkTokenExpiry = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.tokenExpiry && Date.now() > req.session.tokenExpiry) {
    return res.status(401).json({ error: 'Token expired' });
  }
  next();
};

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors,
    });
  }

  if (err.message.includes('401')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err.message.includes('403')) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (err.message.includes('404')) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(500).json({ error: 'Internal server error' });
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
};

// CORS configuration
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};