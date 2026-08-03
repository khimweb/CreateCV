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
    :host { position: fixed; z-index: 9999; pointer-events: none; }
    .toast-container {
      position: fixed;
      top: max(16px, env(safe-area-inset-top));
      right: max(16px, env(safe-area-inset-right));
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: min(344px, calc(100vw - 32px));
      pointer-events: none;
    }
    .toast {
      --toast-accent: #2bb673;
      --toast-tint: #eaf9f0;
      position: relative;
      overflow: hidden;
      pointer-events: auto;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 11px;
      min-height: 54px;
      padding: 11px 14px 12px 11px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.82);
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18), 0 3px 10px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(24px) saturate(185%);
      -webkit-backdrop-filter: blur(24px) saturate(185%);
      animation: iosAlertIn .42s cubic-bezier(.16, 1, .3, 1) both;
      transition: transform .2s ease, box-shadow .2s ease;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, sans-serif;
    }
    .toast::after {
      content: "";
      position: absolute;
      right: 12px;
      bottom: 5px;
      left: 12px;
      height: 2px;
      border-radius: 999px;
      background: var(--toast-accent);
      opacity: .58;
      transform-origin: left;
      animation: toastLifetime 4s linear both;
    }
    .toast:hover { transform: translateX(-3px); box-shadow: 0 20px 44px rgba(15, 23, 42, 0.23), 0 3px 10px rgba(15, 23, 42, 0.08); }
    .toast:active { transform: scale(.985); }
    .toast-icon {
      width: 32px;
      height: 32px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: var(--toast-tint);
      color: var(--toast-accent);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.75);
    }
    .toast--success { --toast-accent: #179b62; --toast-tint: #dcf8e8; }
    .toast--error { --toast-accent: #d94c62; --toast-tint: #ffe8ec; }
    .toast--info { --toast-accent: #397ce8; --toast-tint: #e2edff; }
    .toast-msg { padding-right: 5px; font-size: 13px; font-weight: 650; color: #182238; line-height: 1.35; letter-spacing: -.01em; }
    @keyframes iosAlertIn {
      from { opacity: 0; transform: translateX(28px) translateY(-8px) scale(.96); filter: blur(3px); }
      to { opacity: 1; transform: translateX(0) translateY(0) scale(1); filter: blur(0); }
    }
    @keyframes toastLifetime { from { transform: scaleX(1); } to { transform: scaleX(0); } }
    :host-context(.dark) .toast {
      background: rgba(20, 31, 51, 0.76);
      border-color: rgba(148, 163, 184, 0.18);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    :host-context(.dark) .toast-msg { color: #f1f5fb; }
    :host-context(.dark) .toast--success { --toast-tint: #173d30; }
    :host-context(.dark) .toast--error { --toast-tint: #45232c; }
    :host-context(.dark) .toast--info { --toast-tint: #1c355d; }
    @media (max-width: 480px) {
      .toast-container { top: max(12px, env(safe-area-inset-top)); right: 12px; width: calc(100vw - 24px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast, .toast::after { animation: none; transition: none; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
