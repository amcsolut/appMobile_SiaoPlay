import { Platform } from 'react-native';

export const APP_NAME = 'SiaoPlay';
export const APP_VERSION = '0.0.1';

// ============================================
// CONFIGURAÇÃO DA API
// ============================================
// A URL é detectada automaticamente baseada na plataforma
// Android Emulator: usa 10.0.2.2 (alias para localhost do host)
// Android Físico: use o IP local da sua máquina (ex: 192.168.1.8)
// iOS: usa localhost
// Para produção: altere a URL abaixo

// IP local da máquina - ALTERE AQUI se necessário
// Para descobrir seu IP: hostname -I (Linux) ou ipconfig (Windows/Mac)
const LOCAL_IP = '192.168.1.8'; // ⚠️ ALTERE COM O IP DA SUA MÁQUINA NA REDE LOCAL
const API_PORT = '8080';
const API_PATH = '/api/v1';

// Função para obter a URL base da API
const getApiBaseUrl = (): string => {
  // Usar sempre a URL de produção (mesmo em desenvolvimento)
  return 'https://api.siaoplay.com.br/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

// URL base do servidor (sem /api/v1) - útil para construir URLs de imagens
export const SERVER_BASE_URL = API_BASE_URL.replace('/api/v1', '');

// Configurações adicionais da API
export const API_CONFIG = {
  timeout: 30000, // 30 segundos
  retryAttempts: 1,
  retryDelay: 1000,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@siaoplay:user_token',
  USER_DATA: '@siaoplay:user_data',
  THEME: '@siaoplay:theme',
} as const;

// Timeouts (mantido para compatibilidade)
export const API_TIMEOUT = API_CONFIG.timeout;

