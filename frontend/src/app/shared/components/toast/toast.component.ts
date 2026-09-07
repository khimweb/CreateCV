import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { ToastItemComponent } from './toast-item.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, ToastItemComponent],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      @for (toast of toastService.toasts(); track toast.id) {
        <app-toast-item
          [toast]="toast"
          (dismissed)="toastService.dismiss($event)"
        />
      }
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: 99999;
      pointer-events: none;
    }

    .toast-container {
      position: fixed;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    /* Tablet & Desktop: positioned comfortably below the floating navbar (top: 14px + 64px = 78px) */
    @media (min-width: 641px) {
      .toast-container {
        top: 88px;
        right: 20px;
        width: min(390px, calc(100vw - 36px));
      }
    }

    /* Mobile: centered horizontally below the mobile navbar (top: ~66px) */
    @media (max-width: 640px) {
      .toast-container {
        top: max(74px, calc(env(safe-area-inset-top, 0px) + 64px));
        left: 12px;
        right: 12px;
        width: auto;
        max-width: 440px;
        margin: 0 auto;
        gap: 8px;
      }
    }
  `],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}

