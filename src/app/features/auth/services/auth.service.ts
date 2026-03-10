import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, Usuario } from '../models/auth.model';
import { environment } from '../../../../environments/environment';

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
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials, {
        withCredentials: true, // permite que el navegador maneje las cookies
      })
      .pipe(
        tap(response => {
          this._currentUser.set(response.user);
        })
      );
  }

  logout(): void {
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({ complete: () => this._clearSession() });
  }

  private _clearSession(): void {
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }
}
