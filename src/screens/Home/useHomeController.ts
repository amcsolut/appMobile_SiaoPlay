import { useState } from 'react';
import { ContentCardProps } from '../../components/ui/ContentCard';
import { SlideshowItem } from '../../components/ui/Slideshow';

// Dados mockados - substituir por chamadas à API
const mockSlideshowData: SlideshowItem[] = [
  {
    id: '1',
    title: 'Educação que transforma a sociedade',
    description:
      'Como preparar a próxima geração para viver seu propósito, com os Pastores Thomas Walker, Arnaldo Marion, Davi Lago',
  },
  {
    id: '2',
    title: 'Fé e Transformação',
    description: 'Uma jornada de descoberta espiritual e crescimento pessoal',
  },
  {
    id: '3',
    title: 'Liderança Inspiradora',
    description: 'Aprenda com os maiores líderes sobre como impactar vidas',
  },
];

const mockVideos: ContentCardProps[] = [
  {
    id: 'v1',
    title: 'THOMAS WALKER',
    subtitle: 'KEN 2024',
    type: 'video',
  },
  {
    id: 'v2',
    title: 'ARNALDO MARION',
    subtitle: 'KEN 2024',
    type: 'video',
  },
  {
    id: 'v3',
    title: 'DAVI LAGO',
    subtitle: 'KEN 2024',
    type: 'video',
  },
  {
    id: 'v4',
    title: 'Palestra Inspiradora',
    subtitle: '2024',
    type: 'video',
  },
];

const mockSeries: ContentCardProps[] = [
  {
    id: 's1',
    title: 'Série Transformação',
    subtitle: 'Temporada 1',
    type: 'series',
  },
  {
    id: 's2',
    title: 'Histórias de Fé',
    subtitle: 'Temporada 2',
    type: 'series',
  },
  {
    id: 's3',
    title: 'Liderança Prática',
    subtitle: 'Temporada 1',
    type: 'series',
  },
  {
    id: 's4',
    title: 'Vida Cristã',
    subtitle: 'Temporada 3',
    type: 'series',
  },
];

const mockAudiobooks: ContentCardProps[] = [
  {
    id: 'a1',
    title: 'Audiobook Inspirador',
    subtitle: 'Autor: Thomas Walker',
    type: 'audiobook',
  },
  {
    id: 'a2',
    title: 'Transformação Pessoal',
    subtitle: 'Autor: Arnaldo Marion',
    type: 'audiobook',
  },
  {
    id: 'a3',
    title: 'Fé e Propósito',
    subtitle: 'Autor: Davi Lago',
    type: 'audiobook',
  },
  {
    id: 'a4',
    title: 'Liderança Eficaz',
    subtitle: 'Autor: Vários',
    type: 'audiobook',
  },
];

const mockAlbums: ContentCardProps[] = [
  {
    id: 'm1',
    title: 'Álbum Inspiração',
    subtitle: 'Artista: Vários',
    type: 'album',
  },
  {
    id: 'm2',
    title: 'Louvores Modernos',
    subtitle: 'Artista: Banda X',
    type: 'album',
  },
  {
    id: 'm3',
    title: 'Adoração',
    subtitle: 'Artista: Coro Y',
    type: 'album',
  },
  {
    id: 'm4',
    title: 'Músicas de Fé',
    subtitle: 'Artista: Vários',
    type: 'album',
  },
];

const mockEbooks: ContentCardProps[] = [
  {
    id: 'e1',
    title: 'Ebook Transformação',
    subtitle: 'Autor: Thomas Walker',
    type: 'ebook',
  },
  {
    id: 'e2',
    title: 'Guia de Liderança',
    subtitle: 'Autor: Arnaldo Marion',
    type: 'ebook',
  },
  {
    id: 'e3',
    title: 'Fé Prática',
    subtitle: 'Autor: Davi Lago',
    type: 'ebook',
  },
  {
    id: 'e4',
    title: 'Vida com Propósito',
    subtitle: 'Autor: Vários',
    type: 'ebook',
  },
];

export const useHomeController = () => {
  const [loading, setLoading] = useState(false);

  // TODO: Substituir por chamadas reais à API
  const slideshowData = mockSlideshowData;
  const videos = mockVideos;
  const series = mockSeries;
  const audiobooks = mockAudiobooks;
  const albums = mockAlbums;
  const ebooks = mockEbooks;

  const handleItemPress = (item: ContentCardProps) => {
    // TODO: Navegar para tela de detalhes
    console.log('Item pressed:', item);
  };

  const handleTrailerPress = (item: SlideshowItem) => {
    // TODO: Abrir player de vídeo
    console.log('Trailer pressed:', item);
  };

  const handleInfoPress = (item: SlideshowItem) => {
    // TODO: Navegar para tela de detalhes
    console.log('Info pressed:', item);
  };

  return {
    loading,
    slideshowData,
    videos,
    series,
    audiobooks,
    albums,
    ebooks,
    handleItemPress,
    handleTrailerPress,
    handleInfoPress,
  };
};
