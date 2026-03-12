import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';

let isRefreshing = false;
const refreshSubject$ = new BehaviorSubject<boolean | null>(null);

const AUTH_ENDPOINTS = [
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.logout,
  API_ENDPOINTS.auth.refresh,
  API_ENDPOINTS.auth.me,
];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const authService = inject(AuthService);

  const isLoginEndpoint = req.url.includes(API_ENDPOINTS.auth.login);
  const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  return next(req).pipe(
    catchError((error) => {
      const status = error.status;

      if (status === 0) {
        toast.error(
          'Sin conexión',
          'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        );
      } else if (status === HttpStatusCode.Unauthorized) {
        if (isAuthEndpoint) {
          return throwError(() => error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject$.next(null);

          return authService.refresh().pipe(
            switchMap(() => {
              isRefreshing = false;
              refreshSubject$.next(true);
              return next(req);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              refreshSubject$.next(false);
              authService.forceLogout();
              return throwError(() => refreshError);
            }),
          );
        }

        return refreshSubject$.pipe(
          filter((result) => result !== null),
          take(1),
          switchMap((success) => {
            if (success) {
              return next(req);
            }
            return throwError(() => error);
          }),
        );
      } else if (status === HttpStatusCode.Forbidden) {
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
