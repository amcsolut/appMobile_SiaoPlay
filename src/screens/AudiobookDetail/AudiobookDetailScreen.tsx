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

type AudiobookDetailRouteProp = RouteProp<RootStackParamList, 'AudiobookDetail'>;

interface Audiobook {
  id: string;
  title: string;
  description: string;
  poster?: string;
  banner?: string;
  narrator?: string;
  authors?: Array<{
    id: string;
    name: string;
  }>;
  duration: number;
  rating: number;
  views: number;
  genres?: Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
  }>;
}

interface Chapter {
  id: string;
  audiobook_id: string;
  chapter_type: string;
  chapter_number: number;
  title: string;
  description: string;
  audio_file: string;
  duration: number;
  is_published: boolean;
  order: number;
}

const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${SERVER_BASE_URL}/${cleanPath}`;
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
};

export const AudiobookDetailScreen: React.FC = () => {
  const route = useRoute<AudiobookDetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [audiobook, setAudiobook] = useState<Audiobook | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAudiobook();
  }, [id]);

  useEffect(() => {
    if (audiobook) {
      loadChapters();
    }
  }, [audiobook]);

  const loadAudiobook = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await homeService.getAudiobookById(id);
      setAudiobook(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar audiobook');
      console.error('Erro ao carregar audiobook:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadChapters = async () => {
    if (!audiobook) return;
    try {
      const chaptersData = await homeService.getAudiobookChapters(audiobook.id);
      setChapters(chaptersData);

      // Converter capítulos para formato de tracks
      const tracks: AudioTrack[] = chaptersData
        .filter((chapter: Chapter) => chapter.is_published && chapter.audio_file)
        .sort((a: Chapter, b: Chapter) => a.order - b.order)
        .map((chapter: Chapter) => ({
          id: chapter.id,
          url: chapter.audio_file,
          title: chapter.title,
          artist:
            audiobook.authors?.[0]?.name ||
            audiobook.narrator ||
            'Desconhecido',
          artwork: audiobook.poster || audiobook.banner,
          duration: chapter.duration || 0,
        }));

      setAudioTracks(tracks);
    } catch (err: any) {
      console.error('Erro ao carregar capítulos:', err);
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
        ratingContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.md,
          marginRight: spacing.md,
        },
        ratingText: {
          ...typography.body,
          color: colors.foreground,
          fontWeight: '600',
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

  if (error || !audiobook) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color={colors.mutedForeground} />
          <Text style={styles.errorText}>
            {error || 'Audiobook não encontrado'}
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
          {audiobook.banner && (
            <Image
              source={{ uri: getImageUrl(audiobook.banner) }}
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
          <Text style={styles.title}>{audiobook.title}</Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{audiobook.rating}/10</Text>
            </View>
            {audiobook.duration > 0 && (
              <View style={styles.metaItem}>
                <Icon name="schedule" size={16} color={colors.mutedForeground} />
                <Text style={styles.metaText}>
                  {formatDuration(audiobook.duration)}
                </Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Icon name="visibility" size={16} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{audiobook.views} visualizações</Text>
            </View>
            {audiobook.narrator && (
              <View style={styles.metaItem}>
                <Icon name="mic" size={16} color={colors.mutedForeground} />
                <Text style={styles.metaText}>{audiobook.narrator}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={styles.description}>{audiobook.description}</Text>

          {/* Genres */}
          {audiobook.genres && audiobook.genres.length > 0 && (
            <View style={styles.genresContainer}>
              {audiobook.genres.map((genre) => (
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
                  console.log('Todos os capítulos foram reproduzidos');
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

