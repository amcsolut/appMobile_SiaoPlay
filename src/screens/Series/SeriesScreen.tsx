import React from 'react';
import { ContentListScreen } from '../ContentList/ContentListScreen';
import { homeService } from '../../services/api/endpoints';
import { ContentCardProps } from '../../components/ui/ContentCard';
import { SlideshowItem } from '../../components/ui/Slideshow';
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

const mapToSlideshowItem = (item: any): SlideshowItem => ({
  id: item.serie.id,
  title: item.serie.title || '',
  description: item.serie.description || '',
  image: getImageUrl(item.serie.banner || item.serie.poster),
  trailer: item.serie.trailer,
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
      loadSlideshowData={homeService.getSeriesSlideshow}
      mapToSlideshowItem={mapToSlideshowItem}
      horizontalCard={true}
    />
  );
};

