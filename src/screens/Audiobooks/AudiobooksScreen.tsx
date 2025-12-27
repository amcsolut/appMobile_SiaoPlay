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

const mapToContentCard = (audiobook: any): ContentCardProps => ({
  id: audiobook.id,
  title: audiobook.title || '',
  subtitle: audiobook.authors?.[0]?.name || audiobook.narrator || '',
  image: getImageUrl(audiobook.poster || audiobook.banner),
  type: 'audiobook',
});

const mapToSlideshowItem = (item: any): SlideshowItem => ({
  id: item.audiobook.id,
  title: item.audiobook.title || '',
  description: item.audiobook.description || '',
  image: getImageUrl(item.audiobook.banner || item.audiobook.poster),
});

export const AudiobooksScreen = () => {
  return (
    <ContentListScreen
      title="Audiobooks"
      loadData={homeService.getPublishedAudiobooks}
      mapToContentCard={mapToContentCard}
      type="audiobook"
      loadSlideshowData={homeService.getAudiobooksSlideshow}
      mapToSlideshowItem={mapToSlideshowItem}
    />
  );
};

