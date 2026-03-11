import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';
import { AuthResponse, LoginRequest, Usuario } from '../models/auth.model';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { APP_ROUTES } from '../../../core/constants/routes.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<Usuario | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());

  /**
   * Realiza el login del usuario.
   * El backend devuelve las cookies HTTP-only automáticamente.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}${API_ENDPOINTS.AUTH_LOGIN}`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this._currentUser.set(response.user);
        }),
      );
  }

  /**
   * Obtiene el usuario autenticado usando la cookie HTTP-only vigente.
   * Retorna el usuario si la cookie es válida, o `null` si expiró.
   */
  me(): Observable<Usuario | null> {
    return this.http
      .get<Usuario>(`${environment.apiUrl}${API_ENDPOINTS.AUTH_ME}`, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this._currentUser.set(user);
        }),
        catchError(() => {
          this._currentUser.set(null);
          return of(null);
        }),
      );
  }

  /**
   * Renueva las cookies HTTP-only llamando al endpoint de refresh.
   */
  refresh(): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}${API_ENDPOINTS.AUTH_REFRESH}`,
      {},
      { withCredentials: true },
    );
  }

  logout(): void {
    this.http
      .post(`${environment.apiUrl}${API_ENDPOINTS.AUTH_LOGOUT}`, {}, { withCredentials: true })
      .subscribe({ complete: () => this._clearSession() });
  }

  /**
   * Limpia la sesión sin hacer HTTP call.
   * Usado por el interceptor de errores cuando la sesión ya expiró (401).
   */
  forceLogout(): void {
    this._clearSession();
  }

  private _clearSession(): void {
    this._currentUser.set(null);
    this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
  }
}
