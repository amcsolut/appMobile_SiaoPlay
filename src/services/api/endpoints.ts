import { apiClient } from './client';
import { ApiResponse } from '../../types';

/**
 * Serviços de API
 * Adicione aqui todos os endpoints da sua API
 */

// ============================================
// EXEMPLOS DE REQUISIÇÕES GET
// ============================================

export const homeService = {
  /**
   * GET - Buscar showcase unificado (slideshow)
   * @example
   * const data = await homeService.getUnifiedShowcase();
   */
  getUnifiedShowcase: async (): Promise<ApiResponse<{
    id: string;
    is_active: boolean;
    items: Array<{
      id: string;
      showcase_id: string;
      content_type: string;
      content_id: string;
      order: number;
      is_active: boolean;
      content: any;
    }>;
  }>> => {
    const response = await apiClient.get('/showcase/unified');
    return response.data;
  },

  /**
   * GET - Buscar filmes publicados
   */
  getPublishedMovies: async (): Promise<{
    data: any[];
    limit: number;
    offset: number;
    total: number;
  }> => {
    const response = await apiClient.get('/movies/published');
    return response.data;
  },

  /**
   * GET - Buscar filme por ID
   */
  getMovieById: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/movies/${id}`);
    return response.data;
  },

  /**
   * GET - Buscar séries publicadas
   */
  getPublishedSeries: async (): Promise<{
    data: any[];
    limit: number;
    offset: number;
    total: number;
  }> => {
    const response = await apiClient.get('/series/published');
    return response.data;
  },

  /**
   * GET - Buscar série por ID
   */
  getSeriesById: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/series/${id}`);
    return response.data;
  },

  /**
   * GET - Buscar temporadas de uma série
   */
  getSeriesSeasons: async (seriesId: string): Promise<any[]> => {
    const response = await apiClient.get(`/series/${seriesId}/seasons`);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * GET - Buscar episódios de uma temporada
   */
  getSeasonEpisodes: async (seasonId: string): Promise<any[]> => {
    const response = await apiClient.get(`/seasons/${seasonId}/episodes`);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * GET - Buscar audiobooks publicados
   */
  getPublishedAudiobooks: async (): Promise<any[]> => {
    const response = await apiClient.get('/audiobooks/published');
    // A API retorna array diretamente, não encapsulado
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * GET - Buscar audiobook por ID
   */
  getAudiobookById: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/audiobooks/${id}`);
    return response.data;
  },

  /**
   * GET - Buscar capítulos de um audiobook
   */
  getAudiobookChapters: async (audiobookId: string): Promise<any[]> => {
    const response = await apiClient.get(`/audiobooks/${audiobookId}/chapters`);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * GET - Buscar álbuns publicados
   */
  getPublishedAlbums: async (): Promise<{
    data: any[];
    limit: number;
    offset: number;
    total: number;
  }> => {
    const response = await apiClient.get('/albums/published');
    return response.data;
  },

  /**
   * GET - Buscar álbum por ID
   */
  getAlbumById: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/albums/${id}`);
    return response.data;
  },

  /**
   * GET - Buscar faixas de um álbum
   */
  getAlbumTracks: async (albumId: string): Promise<any[]> => {
    const response = await apiClient.get(`/albums/${albumId}/tracks`);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * GET - Buscar songs de um álbum (endpoint alternativo)
   */
  getAlbumSongs: async (albumId: string): Promise<any[]> => {
    const response = await apiClient.get(`/songs/album/${albumId}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * GET - Buscar ebooks publicados
   */
  getPublishedEbooks: async (): Promise<any[]> => {
    const response = await apiClient.get('/ebooks/published');
    // A API retorna array diretamente, não encapsulado
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * GET - Buscar ebook por ID
   */
  getEbookById: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/ebooks/${id}`);
    return response.data;
  },

  /**
   * GET - Buscar cursos
   */
  getCourses: async (): Promise<any[]> => {
    const response = await apiClient.get('/courses');
    // A API retorna array diretamente, não encapsulado
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * GET - Buscar detalhes do curso por ID (com módulos e aulas)
   */
  getCourseDetails: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/courses/${id}/details`);
    return response.data;
  },

  /**
   * GET - Buscar slideshow de filmes
   */
  getMoviesSlideshow: async (): Promise<any[]> => {
    const response = await apiClient.get('/slideshows/movies/active');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  },

  /**
   * GET - Buscar slideshow de séries
   */
  getSeriesSlideshow: async (): Promise<any[]> => {
    const response = await apiClient.get('/slideshows/series/active');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  },

  /**
   * GET - Buscar slideshow de cursos
   */
  getCoursesSlideshow: async (): Promise<any[]> => {
    const response = await apiClient.get('/slideshows/active');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  },

  /**
   * GET - Buscar slideshow de audiobooks
   */
  getAudiobooksSlideshow: async (): Promise<any[]> => {
    const response = await apiClient.get('/slideshows/audiobooks/active');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  },

  /**
   * GET - Buscar slideshow de ebooks
   */
  getEbooksSlideshow: async (): Promise<any[]> => {
    const response = await apiClient.get('/slideshows/ebooks/active');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  },

  /**
   * GET - Buscar slideshow de músicas/álbuns
   */
  getMusicSlideshow: async (): Promise<any[]> => {
    const response = await apiClient.get('/slideshows/music/active');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  },

  /**
   * GET - Buscar dados da home
   * @example
   * const data = await homeService.getData();
   */
  getData: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/home');
    return response.data;
  },

  /**
   * GET - Buscar item por ID
   * @param id - ID do item
   */
  getItemById: async (id: string | number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/home/${id}`);
    return response.data;
  },

  /**
   * GET - Buscar com query parameters
   * @param params - Parâmetros de query
   */
  getWithParams: async (params: Record<string, any>): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/home', { params });
    return response.data;
  },
};

// ============================================
// EXEMPLOS DE REQUISIÇÕES POST
// ============================================

export const userService = {
  /**
   * GET - Buscar perfil do usuário
   */
  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  /**
   * POST - Criar novo usuário
   * @param userData - Dados do usuário
   * @example
   * const newUser = await userService.createUser({
   *   name: 'João',
   *   email: 'joao@email.com'
   * });
   */
  createUser: async (userData: {
    name: string;
    email: string;
    password?: string;
  }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/user', userData);
    return response.data;
  },

  /**
   * POST - Login
   * @param credentials - Email e senha
   * Retorna: { access_token, refresh_token, token_type, user, permission_level }
   */
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: any;
    permission_level: number;
  }> => {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Log da resposta bruta em desenvolvimento
    if (__DEV__) {
      console.log('[API] Resposta bruta do login:', JSON.stringify(response.data, null, 2));
    }
    
    return response.data;
  },

  /**
   * POST - Atualizar perfil
   * @param userData - Dados para atualizar
   */
  updateProfile: async (userData: Partial<any>): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/user/profile', userData);
    return response.data;
  },
};

// ============================================
// EXEMPLOS DE REQUISIÇÕES PUT/PATCH
// ============================================

export const updateService = {
  /**
   * PUT - Atualizar recurso completo
   * @param id - ID do recurso
   * @param data - Dados completos
   */
  update: async (id: string | number, data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/resource/${id}`, data);
    return response.data;
  },

  /**
   * PATCH - Atualizar recurso parcial
   * @param id - ID do recurso
   * @param data - Dados parciais
   */
  patch: async (id: string | number, data: Partial<any>): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch(`/resource/${id}`, data);
    return response.data;
  },
};

// ============================================
// EXEMPLOS DE REQUISIÇÕES DELETE
// ============================================

export const deleteService = {
  /**
   * DELETE - Deletar recurso
   * @param id - ID do recurso
   */
  delete: async (id: string | number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/resource/${id}`);
    return response.data;
  },
};

