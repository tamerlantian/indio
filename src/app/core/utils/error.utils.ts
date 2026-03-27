import { HttpErrorResponse } from '@angular/common/http';

export interface ApiError {
  code: string;
  message: string;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  request_id: string;
}

/**
 * Extrae el objeto `ApiError` del body de un `HttpErrorResponse`
 * si cumple con el formato estándar del backend.
 */
export function parseApiError(err: HttpErrorResponse): ApiError | null {
  const body = err.error;
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    body.success === false &&
    body.error
  ) {
    return body.error as ApiError;
  }
  return null;
}

/**
 * Extrae el mensaje de error de una respuesta HTTP.
 * Prioriza el formato estándar del backend, con fallback al formato legacy.
 */
export function extractErrorMessage(err: unknown, fallback: string): string {
  const httpErr = err as HttpErrorResponse | undefined;
  if (httpErr?.error) {
    // Formato estándar: { success: false, error: { code, message } }
    const apiError = (httpErr.error as ApiErrorResponse)?.error;
    if (apiError?.message) return apiError.message;

    // Compatibilidad con formato anterior
    const legacy = httpErr.error as Record<string, unknown>;
    if (typeof legacy['detail'] === 'string') return legacy['detail'];
    if (typeof legacy['message'] === 'string') return legacy['message'];
  }
  return fallback;
}
