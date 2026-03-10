import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [],
  },
];
