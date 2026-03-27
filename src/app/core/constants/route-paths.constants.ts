export const ROUTE_PATHS = {
  auth: {
    login: '/auth/login',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
  },
  dashboard: {
    root: '/dashboard',
  },
} as const;
