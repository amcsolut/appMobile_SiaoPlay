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

const mapToContentCard = (serie: any): ContentCardProps => ({
  id: serie.id,
  title: serie.title || '',
  subtitle: serie.status || serie.genres?.[0]?.name || '',
  image: getImageUrl(serie.poster || serie.banner),
  type: 'series',
});

export const SeriesScreen = () => {
  return (
    <ContentListScreen
      title="Séries"
      loadData={async () => {
        const response = await homeService.getPublishedSeries();
        return response.data || [];
      }}
      mapToContentCard={mapToContentCard}
      type="series"
    />
  );
};

