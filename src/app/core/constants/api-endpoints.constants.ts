const AUTH = '/auth/seguridad';
const USER = '/auth/user';

export const API_ENDPOINTS = {
  auth: {
    login: `${AUTH}/login`,
    logout: `${AUTH}/logout`,
    refresh: `${AUTH}/refresh`,
    me: `${AUTH}/me`,
    verifyEmail: `${USER}/verificar`,
    resendVerification: `${USER}/reenviar-verificacion`,
    forgotPassword: `${USER}/recuperar-clave`,
    resetPassword: `${USER}/restablecer-clave`,
  },
  apiKey: {
    list: '/auth/api-key/lista',
    create: '/auth/api-key/nuevo',
    byId: (id: number) => `/auth/api-key/eliminar/${id}`,
  },
  formato: {
    list: '/gen/formato/lista',
    byId: (id: number) => `/gen/formato/${id}`,
    updateContenido: (id: number) => `/gen/formato/${id}/contenido`,
  },
} as const;
