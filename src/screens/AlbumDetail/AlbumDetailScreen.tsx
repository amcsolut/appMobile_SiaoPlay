import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { homeService } from '../../services/api/endpoints';
import { SERVER_BASE_URL } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';
import { RootStackParamList } from '../../types';
import { AudioPlayer } from '../../components/ui/AudioPlayer';
import { AudioTrack } from '../../hooks/useAudioPlayer';

type AlbumDetailRouteProp = RouteProp<RootStackParamList, 'AlbumDetail'>;

interface Album {
  id: string;
  title: string;
  description?: string;
  poster?: string;
  banner?: string;
  artist?: {
    id: string;
    name: string;
  };
  release_date?: string;
  views: number;
  genres?: Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
  }>;
}

interface Song {
  id: string;
  title: string;
  album_id: string;
  track_number: number;
  audio_url: string;
  duration_seconds: number;
  lyrics?: string;
  is_published: boolean;
  plays_count: number;
  likes_count: number;
  artists?: Array<{
    id: string;
    name: string;
  }>;
}

const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${SERVER_BASE_URL}/${cleanPath}`;
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AlbumDetailScreen: React.FC = () => {
  const route = useRoute<AlbumDetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAlbum();
  }, [id]);

  useEffect(() => {
    if (album) {
      loadSongs();
    }
  }, [album]);

  const loadAlbum = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await homeService.getAlbumById(id);
      setAlbum(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar álbum');
      console.error('Erro ao carregar álbum:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSongs = async () => {
    if (!album) return;
    try {
      // Usar o endpoint correto conforme context.md: GET /songs/album/{id}
      const songsData = await homeService.getAlbumSongs(album.id);
      setSongs(songsData);

      // Converter songs para formato de tracks
      const tracks: AudioTrack[] = songsData
        .filter((song: Song) => song.is_published && song.audio_url)
        .sort((a: Song, b: Song) => a.track_number - b.track_number)
        .map((song: Song) => ({
          id: song.id,
          url: song.audio_url,
          title: song.title,
          artist:
            song.artists?.[0]?.name ||
            album.artist?.name ||
            'Desconhecido',
          artwork: album.poster || album.banner,
          duration: song.duration_seconds || 0,
        }));

      setAudioTracks(tracks);
    } catch (err: any) {
      console.error('Erro ao carregar músicas:', err);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollView: {
          flex: 1,
        },
        content: {
          paddingBottom: spacing.xxl,
        },
        bannerContainer: {
          width: '100%',
          height: 300,
          position: 'relative',
        },
        banner: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        },
        bannerOverlay: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        backButton: {
          position: 'absolute',
          top: spacing.lg,
          left: spacing.lg,
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: borderRadius.round,
          padding: spacing.sm,
        },
        infoContainer: {
          padding: spacing.lg,
        },
        title: {
          ...typography.h1,
          color: colors.foreground,
          fontWeight: '700',
          marginBottom: spacing.sm,
        },
        metaRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.md,
          flexWrap: 'wrap',
        },
        metaItem: {
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: spacing.md,
          marginBottom: spacing.xs,
        },
        metaText: {
          ...typography.body,
          color: colors.mutedForeground,
          marginLeft: spacing.xs,
        },
        description: {
          ...typography.body,
          color: colors.foreground,
          lineHeight: 24,
          marginBottom: spacing.lg,
        },
        genresContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: spacing.lg,
        },
        genreTag: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.md,
          marginRight: spacing.sm,
          marginBottom: spacing.sm,
        },
        genreText: {
          ...typography.caption,
          color: colors.foreground,
          fontWeight: '600',
        },
        playerContainer: {
          marginTop: spacing.lg,
          marginBottom: spacing.lg,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        errorContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing.lg,
        },
        errorText: {
          ...typography.body,
          color: colors.mutedForeground,
          textAlign: 'center',
        },
      }),
    [colors]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !album) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color={colors.mutedForeground} />
          <Text style={styles.errorText}>
            {error || 'Álbum não encontrado'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          {album.banner && (
            <Image
              source={{ uri: getImageUrl(album.banner) }}
              style={styles.banner}
            />
          )}
          <View style={styles.bannerOverlay} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{album.title}</Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            {album.artist && (
              <View style={styles.metaItem}>
                <Icon name="person" size={16} color={colors.mutedForeground} />
                <Text style={styles.metaText}>{album.artist.name}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Icon name="visibility" size={16} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{album.views} visualizações</Text>
            </View>
            {songs.length > 0 && (
              <View style={styles.metaItem}>
                <Icon name="music-note" size={16} color={colors.mutedForeground} />
                <Text style={styles.metaText}>{songs.length} faixas</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {album.description && (
            <Text style={styles.description}>{album.description}</Text>
          )}

          {/* Genres */}
          {album.genres && album.genres.length > 0 && (
            <View style={styles.genresContainer}>
              {album.genres.map((genre) => (
                <View
                  key={genre.id}
                  style={[
                    styles.genreTag,
                    { backgroundColor: genre.color || colors.card },
                  ]}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Audio Player */}
          {audioTracks.length > 0 && (
            <View style={styles.playerContainer}>
              <AudioPlayer
                tracks={audioTracks}
                autoPlay={false}
                showArtwork={true}
                showTrackList={true}
                onTrackEnd={() => {
                  console.log('Todas as músicas foram reproduzidas');
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

