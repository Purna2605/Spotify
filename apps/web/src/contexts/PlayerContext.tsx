import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { SpotifyTrack, PlayerState } from '../types';

interface PlayerContextType {
  playerState: PlayerState;
  playTrack: (track: SpotifyTrack) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  addToQueue: (track: SpotifyTrack) => void;
  clearQueue: () => void;
  isCurrentTrack: (trackId: string) => boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    queue: [],
    currentIndex: -1,
  });

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = playerState.volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: audio.duration,
      }));
    };

    const handleEnded = () => {
      setPlayerState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
      // Auto-play next track if available
      if (playerState.queue.length > playerState.currentIndex + 1) {
        next();
      }
    };

    const handlePlay = () => {
      setPlayerState(prev => ({
        ...prev,
        isPlaying: true,
      }));
    };

    const handlePause = () => {
      setPlayerState(prev => ({
        ...prev,
        isPlaying: false,
      }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerState.volume;
    }
  }, [playerState.volume]);

  const playTrack = (track: SpotifyTrack) => {
    if (!audioRef.current) return;

    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      currentTime: 0,
      duration: 0,
    }));

    if (track.preview_url) {
      audioRef.current.src = track.preview_url;
      audioRef.current.play().catch(error => {
        console.error('Failed to play track:', error);
      });
    } else {
      console.warn('No preview URL available for this track');
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Failed to resume track:', error);
      });
    }
  };

  const next = () => {
    if (playerState.queue.length > playerState.currentIndex + 1) {
      const nextIndex = playerState.currentIndex + 1;
      const nextTrack = playerState.queue[nextIndex];
      setPlayerState(prev => ({
        ...prev,
        currentIndex: nextIndex,
      }));
      playTrack(nextTrack);
    }
  };

  const previous = () => {
    if (playerState.currentIndex > 0) {
      const prevIndex = playerState.currentIndex - 1;
      const prevTrack = playerState.queue[prevIndex];
      setPlayerState(prev => ({
        ...prev,
        currentIndex: prevIndex,
      }));
      playTrack(prevTrack);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (volume: number) => {
    setPlayerState(prev => ({
      ...prev,
      volume: Math.max(0, Math.min(1, volume)),
    }));
  };

  const addToQueue = (track: SpotifyTrack) => {
    setPlayerState(prev => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  };

  const clearQueue = () => {
    setPlayerState(prev => ({
      ...prev,
      queue: [],
      currentIndex: -1,
    }));
  };

  const isCurrentTrack = (trackId: string) => {
    return playerState.currentTrack?.id === trackId;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (playerState.isPlaying) {
            pause();
          } else {
            resume();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          previous();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [playerState.isPlaying]);

  const value: PlayerContextType = {
    playerState,
    playTrack,
    pause,
    resume,
    next,
    previous,
    seek,
    setVolume,
    addToQueue,
    clearQueue,
    isCurrentTrack,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};