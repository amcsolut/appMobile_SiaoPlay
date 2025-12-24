import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { spacing, borderRadius, typography } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

export interface ContentCardProps {
  id: string;
  title: string;
  subtitle?: string;
  image?: string | ImageSourcePropType;
  onPress?: () => void;
  type?: 'video' | 'series' | 'audiobook' | 'album' | 'ebook';
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  image,
  onPress,
  type = 'video',
}) => {
  const { colors } = useTheme();

  // Placeholder para imagem quando não houver
  const renderImage = () => {
    if (image) {
      if (typeof image === 'string') {
        return <Image source={{ uri: image }} style={styles.image} />;
      }
      return <Image source={image} style={styles.image} />;
    }

    // Placeholder baseado no tipo
    const placeholderEmoji = {
      video: '🎬',
      series: '📺',
      audiobook: '🎧',
      album: '🎵',
      ebook: '📚',
    };

    return (
      <View style={[styles.placeholder, { backgroundColor: colors.card }]}>
        <Text style={styles.placeholderText}>{placeholderEmoji[type]}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>{renderImage()}</View>
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: colors.foreground }]}
          numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: colors.mutedForeground }]}
            numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  content: {
    padding: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  subtitle: {
    ...typography.caption,
  },
});

