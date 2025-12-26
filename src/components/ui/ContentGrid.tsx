import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { ContentCard, ContentCardProps } from './ContentCard';
import { spacing } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 3) / 2; // 2 colunas com padding

interface ContentGridProps {
  data: ContentCardProps[];
  onItemPress?: (item: ContentCardProps) => void;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  data,
  onItemPress,
}) => {
  const renderItem = ({ item }: { item: ContentCardProps }) => (
    <ContentCard
      {...item}
      onPress={() => onItemPress?.(item)}
      style={styles.card}
    />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 0,
  },
});

