/**
 * Exemplo de uso do componente AudioPlayer
 * 
 * Este arquivo mostra como usar o AudioPlayer para:
 * - Audiobooks (com capítulos)
 * - Álbuns de música (com faixas)
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AudioPlayer } from './AudioPlayer';
import { AudioTrack } from '../../hooks/useAudioPlayer';
import { homeService } from '../../services/api/endpoints';
import { SERVER_BASE_URL } from '../../utils/constants';

// Exemplo 1: Player para Audiobook
export const AudiobookPlayerExample = ({ audiobookId }: { audiobookId: string }) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChapters();
  }, [audiobookId]);

  const loadChapters = async () => {
    try {
      setLoading(true);
      const chapters = await homeService.getAudiobookChapters(audiobookId);
      const audiobook = await homeService.getAudiobookById(audiobookId);

      // Converter capítulos para formato de tracks
      const audioTracks: AudioTrack[] = chapters
        .filter((chapter: any) => chapter.is_published && chapter.audio_file)
        .sort((a: any, b: any) => a.order - b.order)
        .map((chapter: any) => ({
          id: chapter.id,
          url: chapter.audio_file,
          title: chapter.title,
          artist: audiobook.authors?.[0]?.name || audiobook.narrator || 'Desconhecido',
          artwork: audiobook.poster || audiobook.banner,
          duration: chapter.duration || 0,
        }));

      setTracks(audioTracks);
    } catch (error) {
      console.error('Erro ao carregar capítulos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <AudioPlayer
      tracks={tracks}
      autoPlay={false}
      showArtwork={true}
      showTrackList={true}
      onTrackEnd={() => {
        console.log('Todos os capítulos foram reproduzidos');
      }}
    />
  );
};

// Exemplo 2: Player para Álbum de Música
export const AlbumPlayerExample = ({ albumId }: { albumId: string }) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracks();
  }, [albumId]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const albumTracks = await homeService.getAlbumTracks(albumId);
      const album = await homeService.getAlbumById(albumId);

      // Converter faixas para formato de tracks
      const audioTracks: AudioTrack[] = albumTracks
        .filter((track: any) => track.is_published && track.audio_file)
        .sort((a: any, b: any) => a.track_number - b.track_number)
        .map((track: any) => ({
          id: track.id,
          url: track.audio_file,
          title: track.title,
          artist: album.artist?.name || track.artist?.name || 'Desconhecido',
          artwork: album.poster || album.banner,
          duration: track.duration || 0,
        }));

      setTracks(audioTracks);
    } catch (error) {
      console.error('Erro ao carregar faixas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <AudioPlayer
      tracks={tracks}
      autoPlay={false}
      showArtwork={true}
      showTrackList={true}
      onTrackEnd={() => {
        console.log('Todas as faixas foram reproduzidas');
      }}
    />
  );
};

