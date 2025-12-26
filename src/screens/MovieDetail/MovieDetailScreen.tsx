import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { homeService } from '../../services/api/endpoints';
import { SERVER_BASE_URL } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';
import { RootStackParamList } from '../../types';

type MovieDetailRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;

interface Movie {
  id: string;
  title: string;
  description: string;
  poster?: string;
  banner?: string;
  video_url?: string;
  trailer?: string;
  duration: number;
  rating: number;
  age_rating: string;
  views: number;
  genres: Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
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

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
};

export const MovieDetailScreen: React.FC = () => {
  const route = useRoute<MovieDetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await homeService.getMovieById(id);
      setMovie(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar filme');
      console.error('Erro ao carregar filme:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrailer = async () => {
    if (movie?.trailer) {
      const url = movie.trailer.startsWith('http')
        ? movie.trailer
        : `https://${movie.trailer}`;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    }
  };

  const handlePlayVideo = async () => {
    if (movie?.video_url) {
      const url = movie.video_url.startsWith('http')
        ? movie.video_url
        : `https://${movie.video_url}`;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
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
        actionsContainer: {
          flexDirection: 'row',
          gap: spacing.md,
          marginTop: spacing.lg,
        },
        actionButton: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing.md,
          borderRadius: borderRadius.md,
        },
        primaryButton: {
          backgroundColor: colors.primary,
        },
        secondaryButton: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        },
        buttonText: {
          ...typography.body,
          fontWeight: '600',
          marginLeft: spacing.sm,
        },
        primaryButtonText: {
          color: colors.primaryForeground,
        },
        secondaryButtonText: {
          color: colors.foreground,
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

  if (error || !movie) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color={colors.mutedForeground} />
          <Text style={styles.errorText}>
            {error || 'Filme não encontrado'}
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
          {movie.banner && (
            <Image
              source={{ uri: getImageUrl(movie.banner) }}
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
          <Text style={styles.title}>{movie.title}</Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{movie.rating}/10</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="schedule" size={16} color={colors.mutedForeground} />
              <Text style={styles.metaText}>
                {formatDuration(movie.duration)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="visibility" size={16} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{movie.views} visualizações</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="category" size={16} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{movie.age_rating} anos</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{movie.description}</Text>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.genresContainer}>
              {movie.genres.map((genre) => (
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

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {movie.video_url && (
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={handlePlayVideo}>
                <Icon name="play-arrow" size={24} color={colors.primaryForeground} />
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  Assistir
                </Text>
              </TouchableOpacity>
            )}
            {movie.trailer && (
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={handlePlayTrailer}>
                <Icon name="movie" size={24} color={colors.foreground} />
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Trailer
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

