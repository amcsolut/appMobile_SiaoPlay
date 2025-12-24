import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { spacing, typography } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { ContentCard, ContentCardProps } from './ContentCard';

interface CarouselProps {
  title: string;
  data: ContentCardProps[];
  onItemPress?: (item: ContentCardProps) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  title,
  data,
  onItemPress,
}) => {
  const { colors } = useTheme();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {data.map((item) => (
          <ContentCard
            key={item.id}
            {...item}
            onPress={() => onItemPress?.(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
});

