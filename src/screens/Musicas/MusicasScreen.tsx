import React from 'react';
import { ContentListScreen } from '../ContentList/ContentListScreen';
import { homeService } from '../../services/api/endpoints';
import { ContentCardProps } from '../../components/ui/ContentCard';
import { SERVER_BASE_URL } from '../../utils/constants';

const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${SERVER_BASE_URL}/${cleanPath}`;
};

const mapToContentCard = (album: any): ContentCardProps => ({
  id: album.id,
  title: album.title || '',
  subtitle: album.artist?.name || '',
  image: getImageUrl(album.poster || album.banner),
  type: 'album',
});

export const MusicasScreen = () => {
  return (
    <ContentListScreen
      title="Músicas"
      loadData={async () => {
        const response = await homeService.getPublishedAlbums();
        return response.data || [];
      }}
      mapToContentCard={mapToContentCard}
      type="album"
    />
  );
};

