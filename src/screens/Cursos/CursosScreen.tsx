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

const mapToContentCard = (course: any): ContentCardProps => ({
  id: course.id,
  title: course.title || '',
  subtitle: course.teacher?.name || course.category?.category || '',
  image: getImageUrl(course.poster || course.banner),
  type: 'course',
});

const mapToSlideshowItem = (item: any): SlideshowItem => ({
  id: item.course.id,
  title: item.course.title || '',
  description: item.course.description || '',
  image: getImageUrl(item.course.banner || item.course.poster),
});

export const CursosScreen = () => {
  return (
    <ContentListScreen
      title="Cursos"
      loadData={homeService.getCourses}
      mapToContentCard={mapToContentCard}
      type="course"
      loadSlideshowData={homeService.getCoursesSlideshow}
      mapToSlideshowItem={mapToSlideshowItem}
      horizontalCard={true}
    />
  );
};

