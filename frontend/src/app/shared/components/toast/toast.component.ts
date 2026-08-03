import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class.toast--success]="toast.type === 'success'"
             [class.toast--error]="toast.type === 'error'"
             [class.toast--info]="toast.type === 'info'"
             (click)="toastService.dismiss(toast.id)">
          <div class="toast-icon">
            @if (toast.type === 'success') { <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> }
            @if (toast.type === 'error') { <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
            @if (toast.type === 'info') { <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> }
          </div>
          <span class="toast-msg">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      display: flex; flex-direction: column; gap: 10px;
      pointer-events: none; max-width: 360px;
    }
    .toast {
      pointer-events: auto; cursor: pointer;
      display: flex; align-items: center; gap: 10px;
      padding: 14px 18px; border-radius: 14px;
      background: rgba(255,255,255,0.95); backdrop-filter: blur(20px) saturate(180%);
      box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
      border: 1px solid rgba(255,255,255,0.6);
      animation: slideIn 0.35s cubic-bezier(0.32, 0.72, 0, 1);
      transition: opacity 0.3s, transform 0.3s;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif;
    }
    .toast:hover { transform: scale(1.02); }
    .toast-icon {
      width: 28px; height: 28px; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
    }
    .toast--success .toast-icon { background: #dcfce7; color: #16a34a; }
    .toast--error .toast-icon { background: #fee2e2; color: #dc2626; }
    .toast--info .toast-icon { background: #dbeafe; color: #2563eb; }
    .toast-msg { font-size: 13px; font-weight: 500; color: #1e293b; line-height: 1.4; }
    @keyframes slideIn {
      from { transform: translateX(100%) translateY(-10px); opacity: 0; }
      to { transform: translateX(0) translateY(0); opacity: 1; }
    }
    :host-context(.dark) .toast {
      background: rgba(30,41,59,0.95); border-color: rgba(51,65,85,0.6);
    }
    :host-context(.dark) .toast-msg { color: #e2e8f0; }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
