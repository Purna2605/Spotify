import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDuration, getImageUrl } from '../utils/api';
import { cn } from '../utils/cn';

export const PlayerBar: React.FC = () => {
  const { playerState, pause, resume, next, previous, seek, setVolume } = usePlayer();
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  if (!isAuthenticated || !playerState.currentTrack) {
    return null;
  }

  const handlePlayPause = () => {
    if (playerState.isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setVolume(volume);
  };

  const progress = playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-spotify-dark-gray border-t border-spotify-medium-gray z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Track Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={getImageUrl(playerState.currentTrack.album.images, 'small')}
            alt={playerState.currentTrack.album.name}
            className="w-14 h-14 rounded object-cover"
          />
          <div className="min-w-0">
            <h4 className="font-medium text-white truncate">
              {playerState.currentTrack.name}
            </h4>
            <p className="text-sm text-spotify-text-secondary truncate">
              {playerState.currentTrack.artists.map(artist => artist.name).join(', ')}
            </p>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              'p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200',
              isLiked && 'text-spotify-green'
            )}
          >
            <Heart className={cn('w-4 h-4', isLiked ? 'fill-current' : '')} />
          </button>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={previous}
              className="p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              {playerState.isPlaying ? (
                <Pause className="w-5 h-5 text-black" />
              ) : (
                <Play className="w-5 h-5 text-black ml-0.5" />
              )}
            </button>
            
            <button
              onClick={next}
              className="p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-spotify-text-secondary w-10 text-right">
              {formatDuration(playerState.currentTime * 1000)}
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max={playerState.duration || 0}
                value={playerState.currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-spotify-medium-gray rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${progress}%, #404040 ${progress}%, #404040 100%)`
                }}
              />
            </div>
            <span className="text-xs text-spotify-text-secondary w-10">
              {formatDuration(playerState.duration * 1000)}
            </span>
          </div>
        </div>

        {/* Right: Volume Control */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button className="p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2">
            {playerState.volume === 0 ? (
              <VolumeX className="w-4 h-4 text-spotify-text-secondary" />
            ) : (
              <Volume2 className="w-4 h-4 text-spotify-text-secondary" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={playerState.volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-spotify-medium-gray rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${playerState.volume * 100}%, #404040 ${playerState.volume * 100}%, #404040 100%)`
              }}
            />
          </div>
        </div>
      </div>


    </div>
  );
};