import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { spacing, borderRadius, typography } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDESHOW_HEIGHT = 400;

export interface SlideshowItem {
  id: string;
  title: string;
  description?: string;
  image?: string | ImageSourcePropType;
  onPress?: () => void;
}

interface SlideshowProps {
  data: SlideshowItem[];
  onTrailerPress?: (item: SlideshowItem) => void;
  onInfoPress?: (item: SlideshowItem) => void;
}

export const Slideshow: React.FC<SlideshowProps> = ({
  data,
  onTrailerPress,
  onInfoPress,
}) => {
  const { colors } = useTheme();
  const carouselRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) {
    return null;
  }

  const renderItem = ({ item, index }: { item: SlideshowItem; index: number }) => {
    const renderImage = () => {
      if (item.image) {
        if (typeof item.image === 'string') {
          return <Image source={{ uri: item.image }} style={styles.image} />;
        }
        return <Image source={item.image} style={styles.image} />;
      }

      return (
        <View style={[styles.placeholder, { backgroundColor: colors.card }]}>
          <Text style={styles.placeholderText}>🎬</Text>
        </View>
      );
    };

    return (
      <View style={styles.slide}>
        {renderImage()}
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {item.title}
          </Text>
          {item.description && (
            <Text
              style={[styles.description, { color: colors.mutedForeground }]}
              numberOfLines={3}>
              {item.description}
            </Text>
          )}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => onTrailerPress?.(item)}
              activeOpacity={0.8}>
              <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
                ▶ Ver Trailer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonOutline, { borderColor: colors.border }]}
              onPress={() => onInfoPress?.(item)}
              activeOpacity={0.8}>
              <Text style={[styles.buttonText, { color: colors.foreground }]}>
                ℹ️ Informações
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        width={SCREEN_WIDTH}
        height={SLIDESHOW_HEIGHT}
        data={data}
        renderItem={renderItem}
        onSnapToItem={setCurrentIndex}
        autoPlay
        autoPlayInterval={5000}
        loop
      />
      {/* Indicadores */}
      <View style={styles.indicators}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor:
                  index === currentIndex ? colors.primary : colors.muted,
                opacity: index === currentIndex ? 1 : 0.5,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SLIDESHOW_HEIGHT,
    position: 'relative',
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
    fontSize: 80,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
    fontWeight: '700',
  },
  description: {
    ...typography.body,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    ...typography.body,
    fontWeight: '600',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

