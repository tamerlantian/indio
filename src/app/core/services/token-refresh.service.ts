import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, take } from 'rxjs';

/**
 * Encapsula el estado de refresh de tokens dentro del sistema de inyección.
 * Reemplaza las variables globales (`isRefreshing`, `refreshSubject$`)
 * para ser testeable y resetearse correctamente al cerrar sesión.
 */
@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
  private isRefreshing = false;
  private readonly refreshSubject$ = new BehaviorSubject<boolean | null>(null);

  get refreshing(): boolean {
    return this.isRefreshing;
  }

  startRefresh(): void {
    this.isRefreshing = true;
    this.refreshSubject$.next(null);
  }

  completeRefresh(): void {
    this.isRefreshing = false;
    this.refreshSubject$.next(true);
  }

  failRefresh(): void {
    this.isRefreshing = false;
    this.refreshSubject$.next(false);
  }

  waitForRefresh(): Observable<boolean> {
    return this.refreshSubject$.pipe(
      filter((result): result is boolean => result !== null),
      take(1),
    );
  }

  reset(): void {
    this.isRefreshing = false;
    this.refreshSubject$.next(null);
  }
}
