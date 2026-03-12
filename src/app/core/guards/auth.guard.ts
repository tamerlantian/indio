import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { ROUTE_PATHS } from '../constants/route-paths.constants';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  const returnUrl = route.url.map((s) => s.path).join('/');
  return router.createUrlTree([ROUTE_PATHS.auth.login], { queryParams: { returnUrl } });
};
