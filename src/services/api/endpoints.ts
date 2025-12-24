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
   */
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; user: any }>> => {
    const response = await apiClient.post('/auth/login', credentials);
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

