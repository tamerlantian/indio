const AUTH = '/auth/seguridad';

export const API_ENDPOINTS = {
  auth: {
    login: `${AUTH}/login`,
    logout: `${AUTH}/logout`,
    refresh: `${AUTH}/refresh`,
    me: `${AUTH}/me`,
  },
  apiKey: {
    list: '/auth/api-key/lista',
    create: '/auth/api-key/nuevo',
    byId: (id: number) => `/auth/api-key/eliminar/${id}`,
  },
} as const;
