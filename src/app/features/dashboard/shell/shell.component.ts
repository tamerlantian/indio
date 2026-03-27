import { Component, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { AuthService } from '../../auth/services/auth.service';
import { ApiKeyService } from '../../../features/seguridad/services/api-key.service';

interface NavChild {
  label: string;
  icon: string;
  route: string;
}

interface NavGroup {
  label: string;
  icon: string;
  children: NavChild[];
}

type NavItem = NavChild | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'children' in item;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [NgTemplateOutlet, RouterOutlet, RouterLink, RouterLinkActive, DrawerModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly authService = inject(AuthService);
  private readonly apiKeyService = inject(ApiKeyService);

  readonly currentUser = this.authService.currentUser;
  readonly drawerVisible = signal(false);

  /** Conjuntos de labels de grupos actualmente expandidos */
  readonly expandedGroups = signal<Set<string>>(new Set(['Seguridad', 'Configuración']));

  readonly navItems: NavItem[] = [
    {
      label: 'Seguridad',
      icon: 'pi pi-shield',
      children: [{ label: 'API Keys', icon: 'pi pi-key', route: '/dashboard/seguridad/api-keys' }],
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      children: [{ label: 'Formatos', icon: 'pi pi-file', route: '/dashboard/formato/lista' }],
    },
  ];

  readonly isNavGroup = isNavGroup;

  isExpanded(label: string): boolean {
    return this.expandedGroups().has(label);
  }

  toggleGroup(label: string): void {
    this.expandedGroups.update((set) => {
      const next = new Set(set);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  toggleDrawer(): void {
    this.drawerVisible.update((v) => !v);
  }

  logout(): void {
    this.apiKeyService.clearCache();
    this.authService.logout();
  }
}
