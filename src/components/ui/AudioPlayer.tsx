import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';
import { useAudioPlayer, AudioTrack } from '../../hooks/useAudioPlayer';

interface AudioPlayerProps {
  tracks: AudioTrack[];
  autoPlay?: boolean;
  showArtwork?: boolean;
  showTrackList?: boolean;
  onTrackEnd?: () => void;
  onPlaybackStateChanged?: (isPlaying: boolean) => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  tracks,
  autoPlay = false,
  showArtwork = true,
  showTrackList = false,
  onTrackEnd,
  onPlaybackStateChanged,
}) => {
  const { colors } = useTheme();

  const {
    isInitialized,
    isPlaying,
    isLoading,
    currentTrackIndex,
    currentTrack,
    progress,
    play,
    pause,
    stop,
    seekTo,
    skipToNext,
    skipToPrevious,
    skipToIndex,
    videoRef,
    getFullUrl,
    videoHandlers,
  } = useAudioPlayer({
    tracks,
    autoPlay,
    onTrackEnd,
    onPlaybackStateChanged,
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.card,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.md,
        },
        artworkContainer: {
          width: 80,
          height: 80,
          borderRadius: borderRadius.md,
          backgroundColor: colors.background,
          marginRight: spacing.md,
          overflow: 'hidden',
        },
        artwork: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        },
        artworkPlaceholder: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        },
        trackInfo: {
          flex: 1,
        },
        trackTitle: {
          ...typography.body,
          color: colors.foreground,
          fontWeight: '600',
          marginBottom: spacing.xs,
        },
        trackArtist: {
          ...typography.caption,
          color: colors.mutedForeground,
        },
        progressContainer: {
          marginBottom: spacing.md,
        },
        progressBar: {
          width: '100%',
          height: 4,
          backgroundColor: colors.border,
          borderRadius: 2,
          overflow: 'hidden',
        },
        progressBarFilled: {
          height: '100%',
          backgroundColor: colors.primary,
          borderRadius: 2,
        },
        timeContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: spacing.xs,
        },
        timeText: {
          ...typography.caption,
          color: colors.mutedForeground,
        },
        controlsContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.md,
        },
        controlButton: {
          width: 48,
          height: 48,
          borderRadius: borderRadius.round,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.border,
        },
        primaryControlButton: {
          width: 64,
          height: 64,
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        controlButtonDisabled: {
          opacity: 0.5,
        },
        trackList: {
          marginTop: spacing.md,
          paddingTop: spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        trackListItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: borderRadius.md,
          marginBottom: spacing.xs,
        },
        trackListItemActive: {
          backgroundColor: colors.primary + '20',
        },
        trackListItemText: {
          ...typography.body,
          color: colors.foreground,
          flex: 1,
        },
        trackListItemTextActive: {
          color: colors.primary,
          fontWeight: '600',
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing.lg,
        },
        loadingText: {
          ...typography.body,
          color: colors.mutedForeground,
          marginTop: spacing.md,
        },
        hiddenVideo: {
          position: 'absolute',
          width: 1,
          height: 1,
          opacity: 0,
        },
      }),
    [colors]
  );

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Inicializando player...</Text>
      </View>
    );
  }

  if (tracks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.trackTitle, { textAlign: 'center' }]}>
          Nenhuma faixa disponível
        </Text>
      </View>
    );
  }

  const canGoPrevious = currentTrackIndex > 0;
  const canGoNext = currentTrackIndex < tracks.length - 1;
  const currentUrl = currentTrack ? getFullUrl(currentTrack.url) : '';

  return (
    <View style={styles.container}>
      {/* Video Player oculto para reprodução de áudio */}
      {currentUrl && (
        <Video
          ref={videoRef}
          source={{ uri: currentUrl }}
          audioOnly={true}
          paused={!isPlaying}
          style={styles.hiddenVideo}
          ignoreSilentSwitch="ignore"
          playInBackground={true}
          playWhenInactive={true}
          resizeMode="contain"
          onLoad={videoHandlers.onLoad}
          onProgress={videoHandlers.onProgress}
          onEnd={videoHandlers.onEnd}
          onError={videoHandlers.onError}
        />
      )}

      {/* Header com artwork e info */}
      <View style={styles.header}>
        {showArtwork && (
          <View style={styles.artworkContainer}>
            {currentTrack?.artwork ? (
              <Image
                source={{ uri: currentTrack.artwork.startsWith('http') ? currentTrack.artwork : getFullUrl(currentTrack.artwork) }}
                style={styles.artwork}
              />
            ) : (
              <View style={styles.artworkPlaceholder}>
                <Icon name="music-note" size={32} color={colors.mutedForeground} />
              </View>
            )}
          </View>
        )}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack?.title || 'Sem título'}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {currentTrack?.artist || 'Artista desconhecido'}
          </Text>
        </View>
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressContainer}>
        <TouchableOpacity
          style={styles.progressBar}
          activeOpacity={1}
          onPress={(e) => {
            if (!isLoading && progress.duration > 0) {
              const { locationX } = e.nativeEvent;
              const screenWidth = Dimensions.get('window').width;
              const containerPadding = spacing.md * 4;
              const containerWidth = screenWidth - containerPadding;
              const percentage = Math.max(0, Math.min(1, locationX / containerWidth));
              const newPosition = percentage * progress.duration;
              seekTo(newPosition);
            }
          }}>
          <View
            style={[
              styles.progressBarFilled,
              {
                width: `${
                  progress.duration > 0
                    ? (progress.position / progress.duration) * 100
                    : 0
                }%`,
              },
            ]}
          />
        </TouchableOpacity>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
          <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
        </View>
      </View>

      {/* Controles */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            !canGoPrevious && styles.controlButtonDisabled,
          ]}
          onPress={skipToPrevious}
          disabled={!canGoPrevious || isLoading}>
          <Icon
            name="skip-previous"
            size={24}
            color={canGoPrevious ? colors.foreground : colors.mutedForeground}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.primaryControlButton]}
          onPress={isPlaying ? pause : play}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primaryForeground} />
          ) : (
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={32}
              color={colors.primaryForeground}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            !canGoNext && styles.controlButtonDisabled,
          ]}
          onPress={skipToNext}
          disabled={!canGoNext || isLoading}>
          <Icon
            name="skip-next"
            size={24}
            color={canGoNext ? colors.foreground : colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>

      {/* Lista de tracks (opcional) */}
      {showTrackList && tracks.length > 1 && (
        <View style={styles.trackList}>
          <Text
            style={[
              styles.trackTitle,
              { marginBottom: spacing.sm, fontSize: 14 },
            ]}>
            Faixas ({tracks.length})
          </Text>
          {tracks.map((track, index) => (
            <TouchableOpacity
              key={track.id}
              style={[
                styles.trackListItem,
                index === currentTrackIndex && styles.trackListItemActive,
              ]}
              onPress={() => skipToIndex(index)}>
              <Icon
                name={index === currentTrackIndex ? 'play-circle-filled' : 'music-note'}
                size={20}
                color={
                  index === currentTrackIndex
                    ? colors.primary
                    : colors.mutedForeground
                }
                style={{ marginRight: spacing.sm }}
              />
              <Text
                style={[
                  styles.trackListItemText,
                  index === currentTrackIndex && styles.trackListItemTextActive,
                ]}
                numberOfLines={1}>
                {index + 1}. {track.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
