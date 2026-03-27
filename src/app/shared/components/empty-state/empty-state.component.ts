import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <i [class]="icon()" class="empty-state__icon"></i>
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
      padding: 3rem 1.5rem;
      text-align: center;

      &__icon {
        font-size: 3rem;
        color: var(--p-text-muted-color);
        margin-bottom: 1rem;
      }

      &__title {
        margin: 0 0 0.5rem;
        color: var(--p-text-color);
      }

      &__message {
        margin: 0;
        color: var(--p-text-muted-color);
        max-width: 24rem;
      }
    }
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly message = input<string>();
  readonly icon = input('pi pi-inbox');
}
