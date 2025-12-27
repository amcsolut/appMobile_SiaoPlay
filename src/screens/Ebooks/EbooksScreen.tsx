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

const mapToContentCard = (ebook: any): ContentCardProps => ({
  id: ebook.id,
  title: ebook.title || '',
  subtitle: ebook.authors?.[0]?.name || ebook.publisher || '',
  image: getImageUrl(ebook.poster || ebook.banner),
  type: 'ebook',
});

const mapToSlideshowItem = (item: any): SlideshowItem => ({
  id: item.ebook.id,
  title: item.ebook.title || '',
  description: item.ebook.description || '',
  image: getImageUrl(item.ebook.banner || item.ebook.poster),
});

export const EbooksScreen = () => {
  return (
    <ContentListScreen
      title="Ebooks"
      loadData={homeService.getPublishedEbooks}
      mapToContentCard={mapToContentCard}
      type="ebook"
      loadSlideshowData={homeService.getEbooksSlideshow}
      mapToSlideshowItem={mapToSlideshowItem}
    />
  );
};

