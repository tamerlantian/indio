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
} as const;
