import React, { useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { SpotifyTrack } from '../types';
import { usePlayer } from '../contexts/PlayerContext';
import { tracksAPI } from '../utils/api';
import { formatDuration, getImageUrl } from '../utils/api';
import { cn } from '../utils/cn';

interface TrackCardProps {
  track: SpotifyTrack;
  showAlbum?: boolean;
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({ 
  track, 
  showAlbum = true, 
  className 
}) => {
  const { playerState, playTrack, pause, isCurrentTrack } = usePlayer();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isCurrentlyPlaying = isCurrentTrack(track.id) && playerState.isPlaying;

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      pause();
    } else {
      playTrack(track);
    }
  };

  const handleSaveTrack = async () => {
    setIsLoading(true);
    try {
      if (isSaved) {
        await tracksAPI.removeTrack(track.id);
        setIsSaved(false);
      } else {
        await tracksAPI.saveTrack(track.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to save/unsave track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-4 p-3 rounded-lg hover:bg-spotify-medium-gray transition-colors duration-200',
        isCurrentlyPlaying && 'bg-spotify-medium-gray',
        className
      )}
    >
      {/* Album Art */}
      <div className="relative flex-shrink-0">
        <img
          src={getImageUrl(track.album.images, 'small')}
          alt={track.album.name}
          className="w-12 h-12 rounded object-cover"
        />
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white truncate">
          {track.name}
        </h3>
        <p className="text-sm text-spotify-text-secondary truncate">
          {track.artists.map(artist => artist.name).join(', ')}
        </p>
        {showAlbum && (
          <p className="text-xs text-spotify-text-tertiary truncate">
            {track.album.name}
          </p>
        )}
      </div>

      {/* Duration */}
      <div className="text-sm text-spotify-text-secondary flex-shrink-0">
        {formatDuration(track.duration_ms)}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleSaveTrack}
          disabled={isLoading}
          className={cn(
            'p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200',
            isSaved && 'text-spotify-green'
          )}
        >
          <Heart className={cn('w-4 h-4', isSaved ? 'fill-current' : '')} />
        </button>
        <button className="p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};