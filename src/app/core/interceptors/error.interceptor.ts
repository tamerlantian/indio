import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { TokenRefreshService } from '../services/token-refresh.service';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';

const AUTH_ENDPOINTS = [
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.logout,
  API_ENDPOINTS.auth.refresh,
  API_ENDPOINTS.auth.me,
];

function isAuthUrl(url: string): boolean {
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const authService = inject(AuthService);
  const tokenRefresh = inject(TokenRefreshService);

  const isLoginEndpoint = req.url.includes(API_ENDPOINTS.auth.login);

  return next(req).pipe(
    catchError((error) => {
      const status = error.status;

      if (status === 0) {
        toast.error(
          'Sin conexión',
          'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        );
        return throwError(() => error);
      }

      if (status === HttpStatusCode.Unauthorized) {
        if (isAuthUrl(req.url)) {
          return throwError(() => error);
        }

        if (!tokenRefresh.refreshing) {
          tokenRefresh.startRefresh();

          return authService.refresh().pipe(
            switchMap(() => {
              tokenRefresh.completeRefresh();
              return next(req);
            }),
            catchError((refreshError) => {
              tokenRefresh.failRefresh();
              authService.forceLogout();
              return throwError(() => refreshError);
            }),
          );
        }

        return tokenRefresh.waitForRefresh().pipe(
          switchMap((success) => {
            if (success) {
              return next(req);
            }
            return throwError(() => error);
          }),
        );
      }

      if (status === HttpStatusCode.Forbidden) {
        toast.warn('Acceso denegado', 'No tienes permisos para realizar esta acción.');
      } else if (
        status >= HttpStatusCode.BadRequest &&
        status < HttpStatusCode.InternalServerError
      ) {
        if (!isLoginEndpoint) {
          toast.error('Error', error.error?.message ?? 'Ocurrió un error en la solicitud.');
        }
      } else if (status >= HttpStatusCode.InternalServerError) {
        toast.error(
          'Error del servidor',
          'Ocurrió un error inesperado. Intenta nuevamente más tarde.',
        );
      }

      return throwError(() => error);
    }),
  );
};
