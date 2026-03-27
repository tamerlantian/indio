import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Formato, FormatoListResponse } from '../models/formato.model';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints.constants';

@Injectable({ providedIn: 'root' })
export class FormatoService {
  private readonly http = inject(HttpClient);

  private readonly _formatos = signal<Formato[]>([]);
  private readonly _total = signal(0);

  readonly formatos = this._formatos.asReadonly();
  readonly total = this._total.asReadonly();

  getFormatos(page = 1, size = 50): Observable<FormatoListResponse> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http
      .get<FormatoListResponse>(`${environment.apiUrl}${API_ENDPOINTS.formato.list}`, { params })
      .pipe(
        tap((res) => {
          this._formatos.set(res.items);
          this._total.set(res.total);
        }),
      );
  }

  getFormatoById(id: number): Observable<Formato> {
    return this.http.get<Formato>(`${environment.apiUrl}${API_ENDPOINTS.formato.byId(id)}`);
  }

  updateContenido(id: number, contenido_externo: string | null): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}${API_ENDPOINTS.formato.updateContenido(id)}`,
      { contenido_externo },
    );
  }
}
