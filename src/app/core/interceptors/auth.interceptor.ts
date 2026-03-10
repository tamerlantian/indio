import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Añade `withCredentials: true` a todas las peticiones dirigidas al API
 * para que el navegador envíe las cookies HTTP-only automáticamente.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) return next(req);

  return next(req.clone({ withCredentials: true }));
};
