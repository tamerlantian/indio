import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiKey, CreateApiKeyRequest, CreateApiKeyResponse } from '../models/api-key.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints.constants';

@Injectable({ providedIn: 'root' })
export class ApiKeyService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly _apiKeys = signal<ApiKey[]>([]);
  readonly apiKeys = this._apiKeys.asReadonly();

  clearCache(): void {
    this._apiKeys.set([]);
  }

  getApiKeys(): Observable<ApiKey[]> {
    const tenantId = this.authService.currentUser()?.tenant_id;
    return this.http
      .get<ApiKey[]>(`${environment.apiUrl}${API_ENDPOINTS.apiKey.list}`, {
        params: { tenant_id: tenantId! },
      })
      .pipe(tap((keys) => this._apiKeys.set(keys)));
  }

  createApiKey(req: CreateApiKeyRequest): Observable<CreateApiKeyResponse> {
    return this.http.post<CreateApiKeyResponse>(
      `${environment.apiUrl}${API_ENDPOINTS.apiKey.create}`,
      req,
    );
  }

  toggleApiKey(id: number, active: boolean): Observable<ApiKey> {
    return this.http
      .patch<ApiKey>(`${environment.apiUrl}${API_ENDPOINTS.apiKey.byId(id)}`, { active })
      .pipe(
        tap((updated) =>
          this._apiKeys.update((keys) => keys.map((k) => (k.id === id ? updated : k))),
        ),
      );
  }

  deleteApiKey(id: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}${API_ENDPOINTS.apiKey.byId(id)}`)
      .pipe(tap(() => this._apiKeys.update((keys) => keys.filter((k) => k.id !== id))));
  }
}
