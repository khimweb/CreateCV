import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (show) {
      <div class="loader-overlay" [class.loader-overlay--inline]="inline">
        <div class="loader-spinner">
          <div class="spinner-ring"></div>
        </div>
        @if (text) { <p class="loader-text">{{ text }}</p> }
      </div>
    }
  `,
  styles: [`
    .loader-overlay {
      position: fixed; inset: 0; z-index: 9998;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
      background: rgba(255,255,255,0.7); backdrop-filter: blur(8px);
    }
    .loader-overlay--inline {
      position: relative; inset: auto; min-height: 120px;
      background: transparent; backdrop-filter: none;
    }
    .loader-spinner { width: 40px; height: 40px; position: relative; }
    .spinner-ring {
      width: 100%; height: 100%; border-radius: 50%;
      border: 3px solid #e2e8f0; border-top-color: #6366f1;
      animation: spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }
    .loader-text { font-size: 13px; font-weight: 500; color: #64748b; font-family: Inter, system-ui, sans-serif; }
    @keyframes spin { to { transform: rotate(360deg); } }
    :host-context(.dark) .loader-overlay { background: rgba(15,23,42,0.7); }
    :host-context(.dark) .spinner-ring { border-color: #334155; border-top-color: #818cf8; }
    :host-context(.dark) .loader-text { color: #94a3b8; }
  `]
})
export class LoaderComponent {
  @Input() show = false;
  @Input() text = '';
  @Input() inline = false;
}
