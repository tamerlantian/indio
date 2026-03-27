import { Component, input, output } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [MessageModule, ButtonModule],
  template: `
    <div class="error-alert">
      <p-message severity="error">{{ message() }}</p-message>
      @if (retryable()) {
        <p-button
          label="Reintentar"
          icon="pi pi-refresh"
          severity="secondary"
          size="small"
          (onClick)="retry.emit()"
        />
      }
    </div>
  `,
  styles: `
    .error-alert {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
    }
  `,
})
export class ErrorAlertComponent {
  readonly message = input('Ocurrió un error. Intenta de nuevo.');
  readonly retryable = input(false);
  readonly retry = output();
}
