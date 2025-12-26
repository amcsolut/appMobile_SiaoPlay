import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ContentCardProps } from '../../components/ui/ContentCard';
import { SlideshowItem } from '../../components/ui/Slideshow';
import { homeService } from '../../services/api/endpoints';
import { SERVER_BASE_URL } from '../../utils/constants';
import { ApiError, RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Função helper para construir URL completa da imagem
const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  
  // Se já for uma URL completa, retornar como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Construir URL completa usando a base do servidor
  // Remove barra inicial se existir para evitar dupla barra
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${SERVER_BASE_URL}/${cleanPath}`;
};

export const useHomeController = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [slideshowData, setSlideshowData] = useState<SlideshowItem[]>([]);
  const [videos, setVideos] = useState<ContentCardProps[]>([]);
  const [series, setSeries] = useState<ContentCardProps[]>([]);
  const [audiobooks, setAudiobooks] = useState<ContentCardProps[]>([]);
  const [albums, setAlbums] = useState<ContentCardProps[]>([]);
  const [ebooks, setEbooks] = useState<ContentCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Carregar todos os dados ao montar o componente
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Carregar todos os dados em paralelo
      await Promise.all([
        loadShowcaseData(),
        loadVideos(),
        loadSeries(),
        loadAudiobooks(),
        loadAlbums(),
        loadEbooks(),
      ]);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Erro ao carregar dados');
      console.error('Erro ao carregar dados:', apiError);
    } finally {
      setLoading(false);
    }
  };

  const loadShowcaseData = async () => {
    try {
      const response = await homeService.getUnifiedShowcase();
      
      if (response.data?.items && Array.isArray(response.data.items)) {
        const mappedItems: SlideshowItem[] = response.data.items
          .filter(item => item.is_active && item.content)
          .sort((a, b) => a.order - b.order)
          .map(item => ({
            id: item.id,
            title: item.content.title || '',
            description: item.content.description || '',
            image: getImageUrl(item.content.banner || item.content.poster),
          }));
        
        setSlideshowData(mappedItems);
      }
    } catch (err: any) {
      console.error('Erro ao carregar showcase:', err);
      setSlideshowData([]);
    }
  };

  const loadVideos = async () => {
    try {
      const response = await homeService.getPublishedMovies();
      const movies = response.data || [];
      
      const mappedVideos: ContentCardProps[] = movies.map((movie: any) => ({
        id: movie.id,
        title: movie.title || '',
        subtitle: movie.genres?.[0]?.name || '',
        image: getImageUrl(movie.poster || movie.banner),
        type: 'video',
      }));
      
      setVideos(mappedVideos);
    } catch (err: any) {
      console.error('Erro ao carregar vídeos:', err);
      setVideos([]);
    }
  };

  const loadSeries = async () => {
    try {
      const response = await homeService.getPublishedSeries();
      const seriesData = response.data || [];
      
      const mappedSeries: ContentCardProps[] = seriesData.map((serie: any) => ({
        id: serie.id,
        title: serie.title || '',
        subtitle: serie.status || serie.genres?.[0]?.name || '',
        image: getImageUrl(serie.poster || serie.banner),
        type: 'series',
      }));
      
      setSeries(mappedSeries);
    } catch (err: any) {
      console.error('Erro ao carregar séries:', err);
      setSeries([]);
    }
  };

  const loadAudiobooks = async () => {
    try {
      const audiobooksData = await homeService.getPublishedAudiobooks();
      
      const mappedAudiobooks: ContentCardProps[] = audiobooksData.map((audiobook: any) => ({
        id: audiobook.id,
        title: audiobook.title || '',
        subtitle: audiobook.authors?.[0]?.name || audiobook.narrator || '',
        image: getImageUrl(audiobook.poster || audiobook.banner),
        type: 'audiobook',
      }));
      
      setAudiobooks(mappedAudiobooks);
    } catch (err: any) {
      console.error('Erro ao carregar audiobooks:', err);
      setAudiobooks([]);
    }
  };

  const loadAlbums = async () => {
    try {
      const response = await homeService.getPublishedAlbums();
      const albumsData = response.data || [];
      
      const mappedAlbums: ContentCardProps[] = albumsData.map((album: any) => ({
        id: album.id,
        title: album.title || '',
        subtitle: album.artist?.name || '',
        image: getImageUrl(album.poster || album.banner),
        type: 'album',
      }));
      
      setAlbums(mappedAlbums);
    } catch (err: any) {
      console.error('Erro ao carregar álbuns:', err);
      setAlbums([]);
    }
  };

  const loadEbooks = async () => {
    try {
      const ebooksData = await homeService.getPublishedEbooks();
      
      const mappedEbooks: ContentCardProps[] = ebooksData.map((ebook: any) => ({
        id: ebook.id,
        title: ebook.title || '',
        subtitle: ebook.authors?.[0]?.name || ebook.publisher || '',
        image: getImageUrl(ebook.poster || ebook.banner),
        type: 'ebook',
      }));
      
      setEbooks(mappedEbooks);
    } catch (err: any) {
      console.error('Erro ao carregar ebooks:', err);
      setEbooks([]);
    }
  };

  const handleItemPress = (item: ContentCardProps) => {
    // Navegar para tela de detalhes baseado no tipo
    if (item.type === 'video') {
      navigation.navigate('MovieDetail', { id: item.id });
    } else if (item.type === 'series') {
      navigation.navigate('SeriesDetail', { id: item.id });
    } else {
      // TODO: Implementar navegação para outros tipos
      console.log('Item pressed:', item);
    }
  };

  const handleTrailerPress = (item: SlideshowItem) => {
    // TODO: Abrir player de vídeo
    console.log('Trailer pressed:', item);
  };

  const handleInfoPress = (item: SlideshowItem) => {
    // Navegar para tela de detalhes baseado no tipo
    if (item.contentType === 'movie' || item.type === 'video') {
      navigation.navigate('MovieDetail', { id: item.id });
    } else if (item.contentType === 'series' || item.type === 'series') {
      navigation.navigate('SeriesDetail', { id: item.id });
    } else {
      // TODO: Implementar navegação para outros tipos
      console.log('Info pressed:', item);
    }
  };

  return {
    loading,
    slideshowData,
    videos,
    series,
    audiobooks,
    albums,
    ebooks,
    error,
    handleItemPress,
    handleTrailerPress,
    handleInfoPress,
    refreshShowcase: loadShowcaseData,
    refreshAll: loadAllData,
  };
};
