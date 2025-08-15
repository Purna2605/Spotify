import React from 'react';
import { Play, MoreHorizontal } from 'lucide-react';
import { SpotifyAlbum } from '../types';

import { getImageUrl } from '../utils/api';
import { cn } from '../utils/cn';

interface AlbumCardProps {
  album: SpotifyAlbum;
  className?: string;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, className }) => {
  const handlePlay = () => {
    // For albums, we'd typically play the first track
    // This is a simplified version - in a real app you'd fetch album tracks
    console.log('Play album:', album.name);
  };

  return (
    <div
      className={cn(
        'group bg-spotify-dark-gray hover:bg-spotify-medium-gray p-4 rounded-lg transition-all duration-200 cursor-pointer',
        className
      )}
    >
      {/* Album Art */}
      <div className="relative mb-4">
        <img
          src={getImageUrl(album.images, 'medium')}
          alt={album.name}
          className="w-full aspect-square rounded object-cover shadow-lg"
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-12 h-12 bg-spotify-green hover:bg-spotify-green-hover rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-105"
        >
          <Play className="w-5 h-5 text-black ml-0.5" />
        </button>
      </div>

      {/* Album Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate group-hover:text-spotify-green transition-colors duration-200">
          {album.name}
        </h3>
        <p className="text-sm text-spotify-text-secondary truncate">
          {album.artists.map(artist => artist.name).join(', ')}
        </p>
        <p className="text-xs text-spotify-text-tertiary">
          {new Date(album.release_date).getFullYear()} • {album.total_tracks} tracks
        </p>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button className="p-2 rounded-full hover:bg-spotify-light-gray transition-colors duration-200">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};