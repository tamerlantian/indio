import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../features/auth/services/auth.service';
import { API_ENDPOINTS } from '../constants/api.constants';

let isRefreshing = false;
const refreshSubject$ = new BehaviorSubject<boolean | null>(null);

const AUTH_ENDPOINTS = [
  API_ENDPOINTS.AUTH_LOGIN,
  API_ENDPOINTS.AUTH_LOGOUT,
  API_ENDPOINTS.AUTH_REFRESH,
  API_ENDPOINTS.AUTH_ME,
];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const authService = inject(AuthService);

  const isLoginEndpoint = req.url.includes(API_ENDPOINTS.AUTH_LOGIN);
  const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  return next(req).pipe(
    catchError((error) => {
      const status = error.status;

      if (status === 0) {
        messageService.add({
          severity: 'error',
          summary: 'Sin conexión',
          detail: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        });
      } else if (status === 401) {
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
      } else if (status === 403) {
        messageService.add({
          severity: 'warn',
          summary: 'Acceso denegado',
          detail: 'No tienes permisos para realizar esta acción.',
        });
      } else if (status >= 400 && status < 500) {
        if (!isLoginEndpoint) {
          messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message ?? 'Ocurrió un error en la solicitud.',
          });
        }
      } else if (status >= 500) {
        messageService.add({
          severity: 'error',
          summary: 'Error del servidor',
          detail: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.',
        });
      }

      return throwError(() => error);
    }),
  );
};
