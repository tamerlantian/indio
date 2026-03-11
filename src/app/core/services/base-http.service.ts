import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined;
}

/**
 * Servicio base para operaciones CRUD contra la API.
 *
 * Uso: crear un servicio concreto que extienda esta clase e indique
 * el endpoint y los tipos de entidad.
 *
 * @example
 * ```ts
 * @Injectable({ providedIn: 'root' })
 * export class PagosService extends BaseHttpService<Pago> {
 *   protected readonly endpoint = '/pagos';
 * }
 * ```
 */
export abstract class BaseHttpService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = environment.apiUrl;

  /** Endpoint relativo de la entidad, e.g. '/pagos' */
  protected abstract readonly endpoint: string;

  /** URL completa del recurso */
  protected get resourceUrl(): string {
    return `${this.baseUrl}${this.endpoint}`;
  }

  /** Obtiene una lista paginada de entidades */
  getAll(params?: QueryParams): Observable<PaginatedResponse<T>> {
    return this.http.get<PaginatedResponse<T>>(this.resourceUrl, {
      params: this.buildParams(params),
    });
  }

  /** Obtiene una entidad por ID */
  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.resourceUrl}/${id}`);
  }

  /** Crea una nueva entidad */
  create(body: TCreate): Observable<T> {
    return this.http.post<T>(this.resourceUrl, body);
  }

  /** Actualiza una entidad existente */
  update(id: number | string, body: TUpdate): Observable<T> {
    return this.http.patch<T>(`${this.resourceUrl}/${id}`, body);
  }

  /** Elimina una entidad por ID */
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }

  /** Construye HttpParams filtrando valores undefined */
  protected buildParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }
}
