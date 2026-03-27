import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'seguridad',
        loadChildren: () => import('../seguridad/seguridad.routes').then((m) => m.SEGURIDAD_ROUTES),
      },
      {
        path: 'formato',
        loadChildren: () => import('../formato/formato.routes').then((m) => m.FORMATO_ROUTES),
      },
      { path: '', redirectTo: 'seguridad', pathMatch: 'full' },
    ],
  },
];
