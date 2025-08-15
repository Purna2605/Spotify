# Spotify Web Player Clone (2024)

A complete Spotify Web Player Clone built with React 18, Node.js, and TypeScript in a pnpm monorepo. Features Spotify OAuth 2.0 authentication, real-time audio playback, search functionality, and a modern responsive UI.

## 🚀 Features

### Frontend (React + Vite + TypeScript)
- **Modern UI**: Dark theme with Spotify-like styling using Tailwind CSS
- **Authentication**: Spotify OAuth 2.0 with secure session management
- **Audio Player**: HTML5 audio player with play/pause, seek, volume control
- **Search**: Real-time search with infinite scroll for tracks, albums, and artists
- **Responsive Design**: Mobile-first responsive layout
- **Keyboard Shortcuts**: Space (play/pause), Arrow keys (next/prev)
- **PWA Support**: Progressive Web App with install capability

### Backend (Node.js + Express + TypeScript)
- **OAuth 2.0**: Complete Spotify authorization flow with refresh tokens
- **Secure Sessions**: HTTP-only cookies with session management
- **API Proxy**: All Spotify API calls proxied through backend for security
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Error Handling**: Comprehensive error handling and logging

## 🏗️ Project Structure

```
spotify-web-player-clone/
├── apps/
│   ├── server/                 # Backend API
│   │   ├── src/
│   │   │   ├── routes/         # API routes
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── types.ts        # TypeScript types
│   │   │   ├── spotify.ts      # Spotify API service
│   │   │   └── index.ts        # Server entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                    # Frontend React app
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── contexts/       # React contexts
│       │   ├── pages/          # Page components
│       │   ├── utils/          # Utility functions
│       │   ├── types.ts        # TypeScript types
│       │   ├── App.tsx         # Main app component
│       │   └── main.tsx        # React entry point
│       ├── package.json
│       └── vite.config.ts
├── package.json                # Root package.json
└── pnpm-workspace.yaml         # pnpm workspace config
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Cookie Session** - Session management
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 8+
- Spotify Developer Account

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd spotify-web-player-clone
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Spotify App Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:5173/callback`
4. Copy your Client ID and Client Secret

### 4. Environment Configuration

Create `.env` file in `apps/server/`:
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
SESSION_SECRET=your_session_secret
PORT=3001
```

### 5. Start Development Servers

```bash
# Start both frontend and backend
pnpm dev

# Or start individually
pnpm dev:web      # Frontend only (port 5173)
pnpm dev:server   # Backend only (port 3001)
```

## 🎯 Available Scripts

### Root Level
- `pnpm dev` - Start both frontend and backend in development mode
- `pnpm dev:web` - Start frontend only
- `pnpm dev:server` - Start backend only
- `pnpm build` - Build both apps for production
- `pnpm clean` - Clean build artifacts

### Frontend (apps/web)
- `pnpm dev` - Start Vite dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

### Backend (apps/server)
- `pnpm dev` - Start with tsx watch mode
- `pnpm build` - Build TypeScript
- `pnpm start` - Start production server

## 🔐 Authentication Flow

1. User clicks "Continue with Spotify" on login page
2. Redirected to Spotify OAuth authorization
3. User authorizes the app
4. Spotify redirects back with authorization code
5. Backend exchanges code for access/refresh tokens
6. Tokens stored in secure HTTP-only cookies
7. User redirected to home page

## 🎵 Features

### Audio Playback
- Play/pause tracks using preview URLs (30-second previews)
- Seek through track progress
- Volume control
- Next/previous track navigation
- Keyboard shortcuts

### Search & Discovery
- Real-time search with debouncing
- Filter by tracks, albums, or artists
- Infinite scroll for results
- Recently played tracks
- Top tracks based on listening history
- Personalized recommendations

### User Experience
- Responsive design for all screen sizes
- Smooth animations and transitions
- Loading states and skeleton loaders
- Error handling and user feedback
- PWA install support

## 🔒 Security Features

- OAuth 2.0 with PKCE
- Secure HTTP-only cookies
- CORS configuration
- Helmet security headers
- Input validation with Zod
- Rate limiting (can be added)
- Environment variable protection

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd apps/web
pnpm build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
cd apps/server
pnpm build
# Deploy with environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational purposes. Please respect Spotify's terms of service and API usage guidelines.

## 🙏 Acknowledgments

- Spotify Web API for providing the music data
- React and Vite teams for excellent developer experience
- Tailwind CSS for the utility-first styling approach
- Lucide for the beautiful icons

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.