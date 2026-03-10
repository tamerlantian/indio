import { Component, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { AuthService } from '../../auth/services/auth.service';

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

  readonly currentUser = this.authService.currentUser;
  readonly drawerVisible = signal(false);

  /** Conjuntos de labels de grupos actualmente expandidos */
  readonly expandedGroups = signal<Set<string>>(new Set(['Seguridad']));

  readonly navItems: NavItem[] = [
    {
      label: 'Seguridad',
      icon: 'pi pi-shield',
      children: [
        { label: 'API Keys', icon: 'pi pi-key', route: '/seguridad/api-keys' },
      ],
    },
  ];

  readonly isNavGroup = isNavGroup;

  isExpanded(label: string): boolean {
    return this.expandedGroups().has(label);
  }

  toggleGroup(label: string): void {
    this.expandedGroups.update(set => {
      const next = new Set(set);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  toggleDrawer(): void {
    this.drawerVisible.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}
