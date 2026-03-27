import { Component, input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `
    <div class="loading-container">
      <p-progressSpinner
        [strokeWidth]="strokeWidth()"
        [style]="{ width: size(), height: size() }"
      />
      @if (message()) {
        <p class="loading-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: `
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .loading-message {
      margin-top: 1rem;
      color: var(--p-text-muted-color);
    }
  `,
})
export class LoadingSpinnerComponent {
  readonly message = input<string>();
  readonly size = input('3rem');
  readonly strokeWidth = input('4');
}
