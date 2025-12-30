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

const mapToContentCard = (movie: any): ContentCardProps => ({
  id: movie.id,
  title: movie.title || '',
  subtitle: movie.genres?.[0]?.name || '',
  image: getImageUrl(movie.poster || movie.banner),
  type: 'video',
});

const mapToSlideshowItem = (item: any): SlideshowItem => ({
  id: item.movie.id,
  title: item.movie.title || '',
  description: item.movie.description || '',
  image: getImageUrl(item.movie.banner || item.movie.poster),
  trailer: item.movie.trailer || item.movie.video_url,
});

export const VideotecaScreen = () => {
  return (
    <ContentListScreen
      title="Videoteca"
      loadData={async () => {
        const response = await homeService.getPublishedMovies();
        return response.data || [];
      }}
      mapToContentCard={mapToContentCard}
      type="video"
      loadSlideshowData={homeService.getMoviesSlideshow}
      mapToSlideshowItem={mapToSlideshowItem}
      horizontalCard={true}
    />
  );
};

