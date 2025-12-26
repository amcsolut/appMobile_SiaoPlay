import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ContentGrid } from '../../components/ui/ContentGrid';
import { ContentCardProps } from '../../components/ui/ContentCard';
import { SERVER_BASE_URL } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../theme';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ContentListScreenProps {
  title: string;
  loadData: () => Promise<any[]>;
  mapToContentCard: (item: any) => ContentCardProps;
  type: ContentCardProps['type'];
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
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ContentCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
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
    if (type === 'video') {
      navigation.navigate('MovieDetail', { id: item.id });
    } else if (type === 'series') {
      navigation.navigate('SeriesDetail', { id: item.id });
    } else {
      // TODO: Implementar navegação para outros tipos (audiobook, etc.)
      console.log('Item pressed:', item);
    }
  };

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
      }),
    [colors]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ContentGrid data={data} onItemPress={handleItemPress} />
      )}
    </SafeAreaView>
  );
};

