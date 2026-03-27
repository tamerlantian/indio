import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';
import { ToastService } from '../services/toast.service';
import { TokenRefreshService } from '../services/token-refresh.service';
import {
  handleConnectionError,
  handleForbidden,
  handleServerError,
  handleTooManyRequests,
  handleUnauthorized,
} from './error-handlers';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toast = inject(ToastService);
  const tokenRefresh = inject(TokenRefreshService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) return handleConnectionError(toast, error);
      if (error.status === HttpStatusCode.Unauthorized)
        return handleUnauthorized(req, next, authService, tokenRefresh, error);
      if (error.status === HttpStatusCode.Forbidden) return handleForbidden(toast, error);
      if (error.status === HttpStatusCode.TooManyRequests)
        return handleTooManyRequests(toast, error);
      if (error.status >= 500) return handleServerError(toast, error);

      console.error(`[HTTP ${error.status}] ${error.url}`, error.error);
      return throwError(() => error);
    }),
  );
};
