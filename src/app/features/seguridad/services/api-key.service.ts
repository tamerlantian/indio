import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiKey, CreateApiKeyRequest, CreateApiKeyResponse } from '../models/api-key.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class ApiKeyService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly _apiKeys = signal<ApiKey[]>([]);
  readonly apiKeys = this._apiKeys.asReadonly();

  getApiKeys(): Observable<ApiKey[]> {
    const tenantId = this.authService.currentUser()?.tenant_id;
    return this.http
      .get<ApiKey[]>(`${environment.apiUrl}/auth/api-key/lista`, {
        params: { tenant_id: tenantId! },
      })
      .pipe(tap(keys => this._apiKeys.set(keys)));
  }

  createApiKey(req: CreateApiKeyRequest): Observable<CreateApiKeyResponse> {
    return this.http.post<CreateApiKeyResponse>(`${environment.apiUrl}/auth/api-key/nuevo`, req);
  }

  toggleApiKey(id: number, active: boolean): Observable<ApiKey> {
    return this.http
      .patch<ApiKey>(`${environment.apiUrl}/security/api-keys/${id}`, { active })
      .pipe(tap(updated => this._apiKeys.update(keys => keys.map(k => (k.id === id ? updated : k)))));
  }

  deleteApiKey(id: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/security/api-keys/${id}`)
      .pipe(tap(() => this._apiKeys.update(keys => keys.filter(k => k.id !== id))));
  }
}
