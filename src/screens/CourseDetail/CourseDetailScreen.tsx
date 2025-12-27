import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { homeService } from '../../services/api/endpoints';
import { SERVER_BASE_URL } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';
import { RootStackParamList } from '../../types';
import { VideoPlayerModal } from '../../components/ui/VideoPlayerModal';

type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;

interface Course {
  id: string;
  title: string;
  description: string;
  poster?: string;
  banner?: string;
  preview?: string;
  price: number;
  status: boolean;
  teacher?: {
    id: string;
    user_id: string;
    bio: string;
    is_active: boolean;
  };
  category?: {
    id: string;
    category: string;
    description: string;
    color: string;
    is_active: boolean;
  };
  modules?: Module[];
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  status: boolean;
  order: number;
  classrooms: Classroom[];
}

interface Classroom {
  id: string;
  module_id: string;
  title: string;
  video: string;
  order: number;
  duration: number;
  status: boolean;
}

const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${SERVER_BASE_URL}/${cleanPath}`;
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
};

export const CourseDetailScreen: React.FC = () => {
  const route = useRoute<CourseDetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await homeService.getCourseDetails(id);
      // Garantir que modules seja sempre um array válido
      if (!data.modules || !Array.isArray(data.modules)) {
        data.modules = [];
      }
      // Garantir que cada módulo tenha classrooms como array
      data.modules = data.modules.map((module: any) => ({
        ...module,
        classrooms: Array.isArray(module.classrooms) ? module.classrooms : [],
      }));
      setCourse(data);
      // Expandir o primeiro módulo por padrão
      if (data.modules && data.modules.length > 0) {
        setExpandedModules(new Set([data.modules[0].id]));
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar curso');
      console.error('Erro ao carregar curso:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleClassroomPress = (classroom: Classroom) => {
    if (classroom.video) {
      setSelectedVideo(classroom.video);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollView: {
          flex: 1,
        },
        content: {
          paddingBottom: spacing.xxl,
        },
        bannerContainer: {
          width: '100%',
          height: 300,
          position: 'relative',
        },
        banner: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        },
        bannerOverlay: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        backButton: {
          position: 'absolute',
          top: spacing.lg,
          left: spacing.lg,
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: borderRadius.round,
          padding: spacing.sm,
        },
        infoContainer: {
          padding: spacing.lg,
        },
        title: {
          ...typography.h1,
          color: colors.foreground,
          fontWeight: '700',
          marginBottom: spacing.sm,
        },
        metaRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.md,
          flexWrap: 'wrap',
        },
        metaItem: {
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: spacing.md,
          marginBottom: spacing.xs,
        },
        metaText: {
          ...typography.body,
          color: colors.mutedForeground,
          marginLeft: spacing.xs,
        },
        priceContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.md,
          marginRight: spacing.md,
        },
        priceText: {
          ...typography.body,
          color: colors.foreground,
          fontWeight: '600',
          marginLeft: spacing.xs,
        },
        description: {
          ...typography.body,
          color: colors.foreground,
          lineHeight: 24,
          marginBottom: spacing.lg,
        },
        categoryTag: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.md,
          marginRight: spacing.sm,
          marginBottom: spacing.sm,
        },
        categoryText: {
          ...typography.caption,
          color: colors.foreground,
          fontWeight: '600',
        },
        modulesContainer: {
          marginTop: spacing.lg,
        },
        modulesTitle: {
          ...typography.h2,
          color: colors.foreground,
          fontWeight: '700',
          marginBottom: spacing.md,
        },
        moduleCard: {
          backgroundColor: colors.card,
          borderRadius: borderRadius.lg,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
        },
        moduleHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: spacing.md,
        },
        moduleHeaderLeft: {
          flex: 1,
          marginRight: spacing.md,
        },
        moduleTitle: {
          ...typography.body,
          color: colors.foreground,
          fontWeight: '600',
          marginBottom: spacing.xs,
        },
        moduleMeta: {
          ...typography.caption,
          color: colors.mutedForeground,
        },
        moduleIcon: {
          marginLeft: spacing.sm,
        },
        classroomsContainer: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: spacing.sm,
        },
        classroomItem: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        classroomItemLast: {
          borderBottomWidth: 0,
        },
        classroomThumbnail: {
          width: 80,
          height: 60,
          borderRadius: borderRadius.md,
          backgroundColor: colors.background,
          marginRight: spacing.md,
          justifyContent: 'center',
          alignItems: 'center',
        },
        classroomInfo: {
          flex: 1,
        },
        classroomTitle: {
          ...typography.body,
          color: colors.foreground,
          fontWeight: '500',
          marginBottom: spacing.xs,
        },
        classroomDuration: {
          ...typography.caption,
          color: colors.mutedForeground,
        },
        playIcon: {
          marginLeft: spacing.sm,
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !course) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color={colors.mutedForeground} />
          <Text style={styles.errorText}>
            {error || 'Curso não encontrado'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const sortedModules = (course.modules || [])
    .filter(module => module && module.id)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          {course.banner && (
            <Image
              source={{ uri: getImageUrl(course.banner) }}
              style={styles.banner}
            />
          )}
          <View style={styles.bannerOverlay} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{course.title}</Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            {course.price !== undefined && (
              <View style={styles.priceContainer}>
                <Icon name="attach-money" size={16} color={colors.foreground} />
                <Text style={styles.priceText}>
                  {course.price === 0 ? 'Gratuito' : `R$ ${course.price.toFixed(2)}`}
                </Text>
              </View>
            )}
            {course.category && (
              <View style={styles.metaItem}>
                <Icon name="category" size={16} color={colors.mutedForeground} />
                <Text style={styles.metaText}>{course.category.category}</Text>
              </View>
            )}
            {course.teacher && (
              <View style={styles.metaItem}>
                <Icon name="person" size={16} color={colors.mutedForeground} />
                <Text style={styles.metaText}>Professor</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={styles.description}>{course.description}</Text>

          {/* Category */}
          {course.category && (
            <View style={[styles.categoryTag, { backgroundColor: course.category.color || colors.card }]}>
              <Text style={styles.categoryText}>{course.category.category}</Text>
            </View>
          )}

          {/* Modules */}
          <View style={styles.modulesContainer}>
            <Text style={styles.modulesTitle}>
              Módulos ({sortedModules.length})
            </Text>

            {sortedModules.map((module, moduleIndex) => {
              const isExpanded = expandedModules.has(module.id);
              const sortedClassrooms = (module.classrooms || [])
                .filter(c => c && c.status && c.id)
                .sort((a, b) => (a.order || 0) - (b.order || 0));

              return (
                <View key={module.id} style={styles.moduleCard}>
                  <TouchableOpacity
                    style={styles.moduleHeader}
                    onPress={() => toggleModule(module.id)}>
                    <View style={styles.moduleHeaderLeft}>
                      <Text style={styles.moduleTitle}>
                        {module.order}. {module.title}
                      </Text>
                      <Text style={styles.moduleMeta}>
                        {sortedClassrooms.length} aula{sortedClassrooms.length !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <Icon
                      name={isExpanded ? 'expand-less' : 'expand-more'}
                      size={24}
                      color={colors.foreground}
                      style={styles.moduleIcon}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.classroomsContainer}>
                      {sortedClassrooms.map((classroom, classroomIndex) => (
                        <TouchableOpacity
                          key={classroom.id}
                          style={[
                            styles.classroomItem,
                            classroomIndex === sortedClassrooms.length - 1 &&
                              styles.classroomItemLast,
                          ]}
                          onPress={() => handleClassroomPress(classroom)}>
                          <View style={styles.classroomThumbnail}>
                            <Icon
                              name="play-circle-filled"
                              size={32}
                              color={colors.primary}
                            />
                          </View>
                          <View style={styles.classroomInfo}>
                            <Text style={styles.classroomTitle}>
                              {classroom.order}. {classroom.title}
                            </Text>
                            <Text style={styles.classroomDuration}>
                              {formatDuration(classroom.duration)}
                            </Text>
                          </View>
                          <Icon
                            name="play-arrow"
                            size={24}
                            color={colors.primary}
                            style={styles.playIcon}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          visible={!!selectedVideo}
          videoUrl={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </SafeAreaView>
  );
};

