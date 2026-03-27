import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <div class="page-header__text">
        <h1 class="page-header__title">
          @if (icon()) {
            <i [class]="icon()!" class="page-header__icon"></i>
          }
          {{ title() }}
        </h1>
        @if (subtitle()) {
          <p class="page-header__subtitle">{{ subtitle() }}</p>
        }
      </div>
      <div class="page-header__actions">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;

      &__title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--p-text-color);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      &__icon {
        font-size: 1.25rem;
        color: var(--p-primary-color);
      }

      &__subtitle {
        margin: 0.25rem 0 0;
        color: var(--p-text-muted-color);
        font-size: 0.875rem;
      }

      &__actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
    }
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly icon = input<string>();
}
