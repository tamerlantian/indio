export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/seguridad/login',
  AUTH_ME: '/auth/seguridad/me',
  AUTH_LOGOUT: '/auth/seguridad/logout',
  AUTH_REFRESH: '/auth/seguridad/refresh',
  API_KEY_LIST: '/auth/api-key/lista',
  API_KEY_CREATE: '/auth/api-key/nuevo',
  API_KEY_BY_ID: (id: number) => `/security/api-keys/${id}`,
} as const;
