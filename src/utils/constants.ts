export const APP_NAME = 'SiaoPlay';
export const APP_VERSION = '0.0.1';

// ============================================
// CONFIGURAÇÃO DA API
// ============================================
// Altere a URL abaixo para a URL da sua API
// Para desenvolvimento local Android: use 'http://10.0.2.2:3000/api'
// Para desenvolvimento local iOS: use 'http://localhost:3000/api'
// Para produção: use a URL completa da sua API
export const API_BASE_URL = __DEV__
  ? 'http://localhost:8080/api/v1' // ⚠️ ALTERE AQUI COM A URL DA SUA API
  : 'http://localhost:8080/api/v1'; // ⚠️ ALTERE AQUI COM A URL DA SUA API EM PRODUÇÃO

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

