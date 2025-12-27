/**
 * Tipos e interfaces globais
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
  MovieDetail: { id: string };
  SeriesDetail: { id: string };
  AudiobookDetail: { id: string };
  AlbumDetail: { id: string };
  CourseDetail: { id: string };
  EbookDetail: { id: string };
  // Adicione outras rotas aqui
};

