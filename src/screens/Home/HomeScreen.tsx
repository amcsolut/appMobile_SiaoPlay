import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHomeController } from './useHomeController';
import { Slideshow, Carousel } from '../../components/ui';
import { spacing } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

export const HomeScreen = () => {
  const { colors } = useTheme();
  const {
    slideshowData,
    videos,
    series,
    audiobooks,
    albums,
    ebooks,
    handleItemPress,
    handleTrailerPress,
    handleInfoPress,
  } = useHomeController();

  const styles = StyleSheet.create({
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
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Slideshow Principal */}
        <Slideshow
          data={slideshowData}
          onTrailerPress={handleTrailerPress}
          onInfoPress={handleInfoPress}
        />

        {/* Seção 1: Vídeos em Destaque */}
        <Carousel
          title="Vídeos em Destaque"
          data={videos}
          onItemPress={handleItemPress}
        />

        {/* Seção 2: Séries Populares */}
        <Carousel
          title="Séries Populares"
          data={series}
          onItemPress={handleItemPress}
        />

        {/* Seção 3: Audiobooks Mais Ouvidos */}
        <Carousel
          title="Audiobooks Mais Ouvidos"
          data={audiobooks}
          onItemPress={handleItemPress}
        />

        {/* Seção 4: Álbuns Mais Tocados */}
        <Carousel
          title="Álbuns Mais Tocados"
          data={albums}
          onItemPress={handleItemPress}
        />

        {/* Seção 5: Ebooks Mais Lidos */}
        <Carousel
          title="Ebooks Mais Lidos"
          data={ebooks}
          onItemPress={handleItemPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
