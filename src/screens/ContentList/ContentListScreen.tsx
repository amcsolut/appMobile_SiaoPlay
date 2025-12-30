import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ContentCard, ContentCardProps } from '../../components/ui/ContentCard';
import { Slideshow, SlideshowItem } from '../../components/ui/Slideshow';
import { VideoPlayerModal } from '../../components/ui/VideoPlayerModal';
import { SERVER_BASE_URL } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../theme';
import { RootStackParamList } from '../../types';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 3) / 2;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ContentListScreenProps {
  title: string;
  loadData: () => Promise<any[]>;
  mapToContentCard: (item: any) => ContentCardProps;
  type: ContentCardProps['type'];
  loadSlideshowData?: () => Promise<any[]>;
  mapToSlideshowItem?: (item: any) => SlideshowItem;
  squareCard?: boolean; // Se true, usa formato quadrado (width = height)
  horizontalCard?: boolean; // Se true, usa formato retangular horizontal (mais largo que alto)
}

// Função helper para construir URL completa da imagem
const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${SERVER_BASE_URL}/${cleanPath}`;
};

export const ContentListScreen: React.FC<ContentListScreenProps> = ({
  title,
  loadData,
  mapToContentCard,
  type,
  loadSlideshowData,
  mapToSlideshowItem,
  squareCard = false,
  horizontalCard = false,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ContentCardProps[]>([]);
  const [slideshowData, setSlideshowData] = useState<SlideshowItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [trailerModalVisible, setTrailerModalVisible] = useState(false);
  const [selectedTrailerUrl, setSelectedTrailerUrl] = useState<string | null>(null);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Carregar slideshow se fornecido
      if (loadSlideshowData && mapToSlideshowItem) {
        try {
          const slideshowResponse = await loadSlideshowData();
          const mappedSlideshow = slideshowResponse
            .filter((item: any) => item.is_active)
            .sort((a: any, b: any) => a.order - b.order)
            .map(mapToSlideshowItem);
          setSlideshowData(mappedSlideshow);
        } catch (err) {
          console.error('Erro ao carregar slideshow:', err);
        }
      }

      // Carregar lista de conteúdo
      const response = await loadData();
      const mappedData = response.map(mapToContentCard);
      setData(mappedData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar conteúdo');
      console.error('Erro ao carregar conteúdo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item: ContentCardProps) => {
    // Navegar para tela de detalhes baseado no tipo
    if (type === 'video' || item.type === 'video') {
      navigation.navigate('MovieDetail', { id: item.id });
    } else if (type === 'series' || item.type === 'series') {
      navigation.navigate('SeriesDetail', { id: item.id });
    } else if (type === 'audiobook' || item.type === 'audiobook') {
      navigation.navigate('AudiobookDetail', { id: item.id });
    } else if (type === 'album' || item.type === 'album') {
      navigation.navigate('AlbumDetail', { id: item.id });
    } else if (type === 'course' || item.type === 'course') {
      navigation.navigate('CourseDetail', { id: item.id });
    } else if (type === 'ebook' || item.type === 'ebook') {
      navigation.navigate('EbookDetail', { id: item.id });
    } else {
      console.log('Item pressed:', item);
    }
  };

  const handleSlideshowInfoPress = (item: SlideshowItem) => {
    // Navegar para tela de detalhes baseado no tipo
    if (type === 'video') {
      navigation.navigate('MovieDetail', { id: item.id });
    } else if (type === 'series') {
      navigation.navigate('SeriesDetail', { id: item.id });
    } else if (type === 'audiobook') {
      navigation.navigate('AudiobookDetail', { id: item.id });
    } else if (type === 'album') {
      navigation.navigate('AlbumDetail', { id: item.id });
    } else if (type === 'course') {
      navigation.navigate('CourseDetail', { id: item.id });
    } else if (type === 'ebook') {
      navigation.navigate('EbookDetail', { id: item.id });
    }
  };

  const handleSlideshowTrailerPress = (item: SlideshowItem) => {
    if (item.trailer) {
      let url = item.trailer.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      setSelectedTrailerUrl(url);
      setTrailerModalVisible(true);
    }
  };

  // Determina se deve mostrar o botão de trailer baseado no tipo
  const shouldShowTrailerButton = type === 'video' || type === 'series';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          padding: spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        title: {
          ...typography.h2,
          color: colors.foreground,
          fontWeight: '700',
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
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.md,
        },
        card: {
          width: CARD_WIDTH,
        },
      }),
    [colors, squareCard, horizontalCard]
  );

  // Calcula altura para imagem horizontal (proporção aproximada 1.7:1, similar ao carrossel)
  const horizontalImageHeight = horizontalCard ? Math.round(CARD_WIDTH * 0.58) : undefined;

  const renderItem = ({ item }: { item: ContentCardProps }) => (
    <ContentCard
      {...item}
      onPress={() => handleItemPress(item)}
      style={styles.card}
      horizontalImage={horizontalCard}
      horizontalImageHeight={horizontalImageHeight}
      squareImage={squareCard}
      squareImageHeight={squareCard ? CARD_WIDTH : undefined}
    />
  );

  const renderHeader = () => (
    <>
      {/* Slideshow */}
      {slideshowData.length > 0 && (
        <Slideshow
          data={slideshowData}
          onTrailerPress={handleSlideshowTrailerPress}
          onInfoPress={handleSlideshowInfoPress}
          showTrailerButton={shouldShowTrailerButton}
        />
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </>
  );

  // Agrupa os itens em pares para renderizar em 2 colunas
  const groupedData: ContentCardProps[][] = [];
  for (let i = 0; i < data.length; i += 2) {
    groupedData.push(data.slice(i, i + 2));
  }

  const renderRow = ({ item: rowItems }: { item: ContentCardProps[] }) => (
    <View style={styles.row}>
      {rowItems.map((item) => (
        <ContentCard
          key={item.id}
          {...item}
          onPress={() => handleItemPress(item)}
          style={styles.card}
          horizontalImage={horizontalCard}
          horizontalImageHeight={horizontalImageHeight}
          squareImage={squareCard}
          squareImageHeight={squareCard ? CARD_WIDTH : undefined}
        />
      ))}
      {rowItems.length === 1 && <View style={styles.card} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={groupedData}
          renderItem={renderRow}
          keyExtractor={(item, index) => `row-${index}`}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Video Player Modal para trailers */}
      {shouldShowTrailerButton && (
        <VideoPlayerModal
          visible={trailerModalVisible}
          videoUrl={selectedTrailerUrl || ''}
          onClose={() => {
            setTrailerModalVisible(false);
            setSelectedTrailerUrl(null);
          }}
        />
      )}
    </SafeAreaView>
  );
};

