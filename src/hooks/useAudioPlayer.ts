import { useEffect, useState, useCallback, useRef } from 'react';
import Video from 'react-native-video';
import { SERVER_BASE_URL } from '../utils/constants';

export interface AudioTrack {
  id: string;
  url: string;
  title: string;
  artist?: string;
  artwork?: string;
  duration?: number;
}

interface UseAudioPlayerOptions {
  tracks: AudioTrack[];
  autoPlay?: boolean;
  onTrackEnd?: () => void;
  onPlaybackStateChanged?: (isPlaying: boolean) => void;
}

export const useAudioPlayer = (options: UseAudioPlayerOptions) => {
  const { tracks, autoPlay = false, onTrackEnd, onPlaybackStateChanged } = options;
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState({ position: 0, duration: 0 });
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const videoRef = useRef<Video>(null);
  const tracksRef = useRef<AudioTrack[]>([]);

  // Atualizar referência dos tracks
  useEffect(() => {
    tracksRef.current = tracks;
    if (tracks.length > 0 && currentTrackIndex < tracks.length) {
      setCurrentTrack(tracks[currentTrackIndex]);
    }
  }, [tracks, currentTrackIndex]);

  // Converter URL relativa para absoluta
  const getFullUrl = useCallback((url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    return `${SERVER_BASE_URL}/${cleanPath}`;
  }, []);

  // Carregar track atual
  useEffect(() => {
    if (tracks.length > 0 && currentTrackIndex >= 0 && currentTrackIndex < tracks.length) {
      const track = tracks[currentTrackIndex];
      setCurrentTrack(track);
      setIsLoading(true);
      
      if (autoPlay && currentTrackIndex === 0) {
        setIsPlaying(true);
      }
    }
  }, [tracks, currentTrackIndex, autoPlay]);

  // Handlers do Video - serão chamados via props no componente
  const handleLoad = useCallback((data: any) => {
    setIsLoading(false);
    setProgress(prev => ({ ...prev, duration: data.duration || prev.duration }));
    if (autoPlay && currentTrackIndex === 0) {
      setIsPlaying(true);
    }
  }, [autoPlay, currentTrackIndex]);

  const handleProgress = useCallback((data: any) => {
    setProgress(prev => ({
      position: data.currentTime,
      duration: prev.duration || data.seekableDuration || 0,
    }));
  }, []);

  const handleEnd = useCallback(() => {
    setIsPlaying(false);
    
    // Próximo track
    if (currentTrackIndex < tracksRef.current.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex);
      // Pequeno delay para garantir que o próximo track carregue
      setTimeout(() => {
        setIsPlaying(true);
      }, 100);
    } else {
      // Todos os tracks terminaram
      if (onTrackEnd) {
        onTrackEnd();
      }
    }
  }, [currentTrackIndex, onTrackEnd]);

  const handleError = useCallback((error: any) => {
    console.error('Erro ao reproduzir áudio:', error);
    setIsLoading(false);
    setIsPlaying(false);
  }, []);

  // Expor handlers para o componente
  const videoHandlers = {
    onLoad: handleLoad,
    onProgress: handleProgress,
    onEnd: handleEnd,
    onError: handleError,
  };

  // Controles do player
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setProgress({ position: 0, duration: 0 });
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  }, []);

  const seekTo = useCallback((position: number) => {
    if (videoRef.current) {
      videoRef.current.seek(position);
      setProgress(prev => ({ ...prev, position }));
    }
  }, []);

  const skipToNext = useCallback(() => {
    if (currentTrackIndex < tracksRef.current.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex]);

  const skipToPrevious = useCallback(() => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
      setIsPlaying(true);
    } else {
      // Voltar para o início do track atual
      seekTo(0);
    }
  }, [currentTrackIndex, seekTo]);

  const skipToIndex = useCallback((index: number) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  }, [tracks.length]);

  // Notificar mudanças de estado
  useEffect(() => {
    if (onPlaybackStateChanged) {
      onPlaybackStateChanged(isPlaying);
    }
  }, [isPlaying, onPlaybackStateChanged]);

  return {
    // Estado
    isInitialized: true, // Sempre inicializado com react-native-video
    isPlaying,
    isLoading,
    currentTrackIndex,
    currentTrack,
    progress,
    playbackState: isPlaying ? 'playing' : 'paused',
    // Controles
    play,
    pause,
    stop,
    seekTo,
    skipToNext,
    skipToPrevious,
    skipToIndex,
    // Referências e utilitários
    videoRef,
    getFullUrl,
    videoHandlers, // Handlers para passar ao componente Video
  };
};
