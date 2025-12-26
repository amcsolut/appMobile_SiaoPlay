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
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { homeService } from '../../services/api/endpoints';
import { SERVER_BASE_URL } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';
import { RootStackParamList } from '../../types';
import { VideoPlayerModal } from '../../components/ui/VideoPlayerModal';

type SeriesDetailRouteProp = RouteProp<RootStackParamList, 'SeriesDetail'>;

interface Series {
  id: string;
  title: string;
  description: string;
  poster?: string;
  banner?: string;
  trailer?: string;
  rating: number;
  age_rating: string;
  status: string;
  views: number;
  genres?: Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
  }>;
}

interface Season {
  id: string;
  serie_id: string;
  season_number: number;
  title: string;
  description: string;
  poster?: string;
  is_published: boolean;
}

interface Episode {
  id: string;
  season_id: string;
  episode_number: number;
  title: string;
  description: string;
  thumbnail?: string;
  video_url?: string;
  duration: number;
  views: number;
  is_published: boolean;
}

const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${SERVER_BASE_URL}/${cleanPath}`;
};

const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    ongoing: 'Em andamento',
    completed: 'Concluída',
    cancelled: 'Cancelada',
    upcoming: 'Em breve',
  };
  return statusMap[status] || status;
};

// Função auxiliar para extrair ID do vídeo do YouTube
const extractYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
};

export const SeriesDetailScreen: React.FC = () => {
  const route = useRoute<SeriesDetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<Series | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    loadSeries();
  }, [id]);

  useEffect(() => {
    if (series) {
      loadSeasons();
    }
  }, [series]);

  useEffect(() => {
    if (selectedSeason) {
      loadEpisodes(selectedSeason.id);
    }
  }, [selectedSeason]);

  const loadSeries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await homeService.getSeriesById(id);
      setSeries(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar série');
      console.error('Erro ao carregar série:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSeasons = async () => {
    if (!series) return;
    try {
      const data = await homeService.getSeriesSeasons(series.id);
      setSeasons(data);
      // Selecionar primeira temporada automaticamente
      if (data.length > 0) {
        setSelectedSeason(data[0]);
      }
    } catch (err: any) {
      console.error('Erro ao carregar temporadas:', err);
    }
  };

  const loadEpisodes = async (seasonId: string) => {
    setLoadingEpisodes(true);
    try {
      const data = await homeService.getSeasonEpisodes(seasonId);
      setEpisodes(data);
    } catch (err: any) {
      console.error('Erro ao carregar episódios:', err);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  const handlePlayTrailer = async () => {
    if (series?.trailer) {
      const url = series.trailer.startsWith('http')
        ? series.trailer
        : `https://${series.trailer}`;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    }
  };

  const handlePlayEpisode = (episode: Episode) => {
    if (!episode.video_url) {
      console.warn('Episódio não possui video_url');
      return;
    }

    let url = episode.video_url.trim();
    
    // Garantir que a URL começa com http ou https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    setSelectedVideoUrl(url);
    setVideoModalVisible(true);
  };

  const renderEpisode = ({ item }: { item: Episode }) => (
    <TouchableOpacity
      style={styles.episodeCard}
      onPress={() => handlePlayEpisode(item)}
      activeOpacity={0.7}>
      {item.thumbnail ? (
        <TouchableOpacity
          onPress={() => handlePlayEpisode(item)}
          activeOpacity={0.8}
          style={styles.thumbnailContainer}>
          <Image
            source={{ uri: getImageUrl(item.thumbnail) }}
            style={styles.episodeThumbnail}
          />
          <View style={styles.thumbnailOverlay}>
            <Icon name="play-circle-filled" size={48} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => handlePlayEpisode(item)}
          activeOpacity={0.8}
          style={styles.thumbnailPlaceholder}>
          <Icon name="play-circle-filled" size={48} color={colors.primary} />
        </TouchableOpacity>
      )}
      <View style={styles.episodeInfo}>
        <View style={styles.episodeHeader}>
          <Text style={styles.episodeNumber}>Ep. {item.episode_number}</Text>
          <Text style={styles.episodeDuration}>
            {formatDuration(item.duration)}
          </Text>
        </View>
        <Text style={styles.episodeTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.description && (
          <Text style={styles.episodeDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.episodeMeta}>
          <Icon name="visibility" size={14} color={colors.mutedForeground} />
          <Text style={styles.episodeViews}>{item.views} visualizações</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        statusBadge: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.md,
          marginRight: spacing.md,
        },
        statusText: {
          ...typography.caption,
          color: colors.foreground,
          fontWeight: '600',
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
        trailerButton: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: colors.primary,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: borderRadius.md,
          marginBottom: spacing.md,
        },
        trailerButtonText: {
          ...typography.caption,
          color: colors.primaryForeground,
          fontWeight: '600',
          marginLeft: spacing.xs,
        },
        seasonsSection: {
          marginTop: spacing.lg,
          paddingHorizontal: spacing.lg,
        },
        seasonsTitle: {
          ...typography.h3,
          color: colors.foreground,
          fontWeight: '700',
          marginBottom: spacing.md,
        },
        selectButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.card,
          padding: spacing.md,
          borderRadius: borderRadius.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        selectButtonText: {
          ...typography.body,
          color: colors.foreground,
          fontWeight: '500',
        },
        episodesContainer: {
          marginTop: spacing.lg,
        },
        episodesList: {
          paddingHorizontal: spacing.lg,
        },
        episodeCard: {
          flexDirection: 'row',
          backgroundColor: colors.card,
          borderRadius: borderRadius.md,
          marginBottom: spacing.md,
          padding: spacing.md,
          alignItems: 'center',
        },
        thumbnailContainer: {
          position: 'relative',
          marginRight: spacing.md,
        },
        episodeThumbnail: {
          width: 120,
          height: 80,
          borderRadius: borderRadius.sm,
          resizeMode: 'cover',
        },
        thumbnailOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: borderRadius.sm,
          justifyContent: 'center',
          alignItems: 'center',
        },
        thumbnailPlaceholder: {
          width: 120,
          height: 80,
          borderRadius: borderRadius.sm,
          backgroundColor: colors.card,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.md,
        },
        episodeInfo: {
          flex: 1,
        },
        episodeHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.xs,
        },
        episodeNumber: {
          ...typography.caption,
          color: colors.primary,
          fontWeight: '600',
          marginRight: spacing.sm,
        },
        episodeDuration: {
          ...typography.caption,
          color: colors.mutedForeground,
        },
        episodeTitle: {
          ...typography.body,
          color: colors.foreground,
          fontWeight: '600',
          marginBottom: spacing.xs,
        },
        episodeDescription: {
          ...typography.caption,
          color: colors.mutedForeground,
          marginBottom: spacing.xs,
        },
        episodeMeta: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        episodeViews: {
          ...typography.caption,
          color: colors.mutedForeground,
          marginLeft: spacing.xs,
        },
        modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        },
        modalContent: {
          backgroundColor: colors.background,
          borderTopLeftRadius: borderRadius.lg,
          borderTopRightRadius: borderRadius.lg,
          padding: spacing.lg,
          maxHeight: '80%',
        },
        modalTitle: {
          ...typography.h3,
          color: colors.foreground,
          fontWeight: '700',
          marginBottom: spacing.md,
        },
        seasonItem: {
          padding: spacing.md,
          borderRadius: borderRadius.md,
          marginBottom: spacing.sm,
          backgroundColor: colors.card,
        },
        seasonItemSelected: {
          backgroundColor: colors.primary,
        },
        seasonItemText: {
          ...typography.body,
          color: colors.foreground,
          fontWeight: '500',
        },
        seasonItemTextSelected: {
          color: colors.primaryForeground,
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
        emptyEpisodes: {
          padding: spacing.xl,
          alignItems: 'center',
        },
        emptyEpisodesText: {
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

  if (error || !series) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color={colors.mutedForeground} />
          <Text style={styles.errorText}>
            {error || 'Série não encontrada'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      ongoing: colors.primary,
      completed: '#4CAF50',
      cancelled: colors.destructive,
      upcoming: colors.mutedForeground,
    };
    return colorMap[status] || colors.card;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          {series.banner && (
            <Image
              source={{ uri: getImageUrl(series.banner) }}
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
          <Text style={styles.title}>{series.title}</Text>

          {/* Action Button - Trailer */}
          {series.trailer && (
            <TouchableOpacity
              style={styles.trailerButton}
              onPress={handlePlayTrailer}>
              <Icon name="movie" size={18} color={colors.primaryForeground} />
              <Text style={styles.trailerButtonText}>Assistir Trailer</Text>
            </TouchableOpacity>
          )}

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{series.rating}/10</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(series.status) },
              ]}>
              <Text style={styles.statusText}>
                {getStatusLabel(series.status)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="visibility" size={16} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{series.views} visualizações</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="category" size={16} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{series.age_rating} anos</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{series.description}</Text>

          {/* Genres */}
          {series.genres && series.genres.length > 0 && (
            <View style={styles.genresContainer}>
              {series.genres.map((genre) => (
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
        </View>

        {/* Seasons Section */}
        {seasons.length > 0 && (
          <View style={styles.seasonsSection}>
            <Text style={styles.seasonsTitle}>Temporadas</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setSelectModalVisible(true)}>
              <Text style={styles.selectButtonText}>
                {selectedSeason
                  ? selectedSeason.title
                  : 'Selecione uma temporada'}
              </Text>
              <Icon name="arrow-drop-down" size={24} color={colors.foreground} />
            </TouchableOpacity>

            {/* Episodes List */}
            {selectedSeason && (
              <View style={styles.episodesContainer}>
                {loadingEpisodes ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : episodes.length > 0 ? (
                  <View style={styles.episodesList}>
                    {episodes.map((episode) => (
                      <View key={episode.id}>
                        {renderEpisode({ item: episode })}
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyEpisodes}>
                    <Text style={styles.emptyEpisodesText}>
                      Nenhum episódio disponível
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Season Select Modal */}
      <Modal
        visible={selectModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione uma temporada</Text>
            <FlatList
              data={seasons}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.seasonItem,
                    selectedSeason?.id === item.id && styles.seasonItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedSeason(item);
                    setSelectModalVisible(false);
                  }}>
                  <Text
                    style={[
                      styles.seasonItemText,
                      selectedSeason?.id === item.id &&
                        styles.seasonItemTextSelected,
                    ]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Video Player Modal */}
      <VideoPlayerModal
        visible={videoModalVisible}
        videoUrl={selectedVideoUrl || ''}
        onClose={() => {
          setVideoModalVisible(false);
          setSelectedVideoUrl(null);
        }}
      />
    </SafeAreaView>
  );
};
