import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-state__icon-wrap">
        <i [class]="icon()" class="empty-state__icon"></i>
      </div>
      <h3 class="empty-state__title">{{ title() }}</h3>
      @if (message()) {
        <p class="empty-state__message">{{ message() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 4rem 2rem;
      text-align: center;

      &__icon-wrap {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        background: color-mix(in srgb, var(--p-primary-color) 10%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.25rem;
      }

      &__icon {
        font-size: 1.75rem;
        color: var(--p-primary-color);
      }

      &__title {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0;
        color: var(--p-text-color);
      }

      &__message {
        margin: 0;
        color: var(--p-text-muted-color);
        max-width: 24rem;
        font-size: 0.875rem;
        line-height: 1.5;
      }
    }
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly message = input<string>();
  readonly icon = input('pi pi-inbox');
}
