import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_CONFIG, STORAGE_KEYS } from '../../utils/constants';
import { ApiError } from '../../types';
import { storageService } from '../storage';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Adiciona token automaticamente
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Adicionar token de autenticação se existir
        try {
          const token = await storageService.getItem<string>(STORAGE_KEYS.USER_TOKEN);
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn('Erro ao buscar token:', error);
        }

        // Log da requisição em desenvolvimento
        if (__DEV__) {
          console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
            baseURL: config.baseURL,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Tratamento de erros
    this.client.interceptors.response.use(
      (response) => {
        // Log da resposta em desenvolvimento
        if (__DEV__) {
          console.log(`[API] Response ${response.config.url}:`, response.data);
        }
        return response;
      },
      (error: AxiosError) => {
        // Log do erro em desenvolvimento
        if (__DEV__) {
          console.error(`[API] Error ${error.config?.url}:`, {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
        }

        const apiError: ApiError = {
          message:
            (error.response?.data as any)?.message ||
            error.message ||
            'Erro desconhecido',
          code: error.code,
          status: error.response?.status,
        };

        // Tratamento de erros específicos
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          // Limpar token e redirecionar para login
          storageService.removeItem(STORAGE_KEYS.USER_TOKEN);
          storageService.removeItem(STORAGE_KEYS.USER_DATA);
          // TODO: Redirecionar para tela de login
        }

        if (error.response?.status === 403) {
          apiError.message = 'Acesso negado. Você não tem permissão para esta ação.';
        }

        if (error.response?.status === 404) {
          apiError.message = 'Recurso não encontrado.';
        }

        if (error.response?.status === 500) {
          apiError.message = 'Erro interno do servidor. Tente novamente mais tarde.';
        }

        if (!error.response) {
          apiError.message = 'Erro de conexão. Verifique sua internet.';
        }

        return Promise.reject(apiError);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().instance;

