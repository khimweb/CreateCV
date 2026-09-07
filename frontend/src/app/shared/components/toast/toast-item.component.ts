import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { Toast } from './toast.service';

@Component({
  selector: 'app-toast-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #card
      class="toast-card toast--{{ toast.type }}"
      (click)="close($event)"
      role="alert"
      tabindex="0"
      (keydown.enter)="close($event)"
      (keydown.space)="close($event)"
      title="Click to close"
    >
      <div class="toast-icon-wrap">
        @if (toast.type === 'success') {
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        } @else if (toast.type === 'error') {
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        } @else if (toast.type === 'warning') {
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        } @else {
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        }
      </div>

      <div class="toast-body">
        <p class="toast-message">{{ toast.message }}</p>
      </div>

      <button
        type="button"
        class="toast-close-btn"
        (click)="close($event)"
        aria-label="Close notification"
        title="Close"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <!-- 4-second Countdown Progress Bar -->
      <div class="toast-progress-track">
        <div #progress class="toast-progress-bar"></div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      pointer-events: auto;
      width: 100%;
    }

    .toast-card {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 52px;
      padding: 11px 14px 13px 12px;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* Light Theme Styling */
    .toast-card {
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(226, 232, 240, 0.92);
      box-shadow:
        0 14px 34px -6px rgba(15, 23, 42, 0.12),
        0 4px 12px -2px rgba(15, 23, 42, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      color: #0f172a;
    }

    .toast-card:hover {
      transform: translateY(-2px) scale(1.008);
      box-shadow:
        0 18px 40px -6px rgba(15, 23, 42, 0.16),
        0 6px 16px -2px rgba(15, 23, 42, 0.08);
    }

    .toast-card:active {
      transform: scale(0.985);
    }

    /* Dark Theme Styling */
    :host-context(html.dark) .toast-card,
    :host-context(.dark) .toast-card {
      background: rgba(15, 23, 42, 0.92);
      border-color: rgba(51, 65, 85, 0.85);
      box-shadow:
        0 18px 40px -6px rgba(0, 0, 0, 0.48),
        0 4px 14px -2px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      color: #f8fafc;
    }

    :host-context(html.dark) .toast-card:hover,
    :host-context(.dark) .toast-card:hover {
      box-shadow:
        0 22px 48px -6px rgba(0, 0, 0, 0.6),
        0 6px 18px -2px rgba(0, 0, 0, 0.4);
    }

    /* Type Specific Styling */
    .toast-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .toast-icon {
      width: 17px;
      height: 17px;
    }

    .toast-card:hover .toast-icon-wrap {
      transform: scale(1.08);
    }

    /* Success */
    .toast--success .toast-icon-wrap {
      background: rgba(16, 185, 129, 0.14);
      color: #059669;
      border: 1px solid rgba(16, 185, 129, 0.22);
    }
    :host-context(html.dark) .toast--success .toast-icon-wrap,
    :host-context(.dark) .toast--success .toast-icon-wrap {
      background: rgba(16, 185, 129, 0.22);
      color: #34d399;
      border-color: rgba(16, 185, 129, 0.35);
    }
    .toast--success .toast-progress-bar {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    /* Error */
    .toast--error .toast-icon-wrap {
      background: rgba(244, 63, 94, 0.14);
      color: #e11d48;
      border: 1px solid rgba(244, 63, 94, 0.22);
    }
    :host-context(html.dark) .toast--error .toast-icon-wrap,
    :host-context(.dark) .toast--error .toast-icon-wrap {
      background: rgba(244, 63, 94, 0.22);
      color: #fb7185;
      border-color: rgba(244, 63, 94, 0.35);
    }
    .toast--error .toast-progress-bar {
      background: linear-gradient(90deg, #f43f5e, #e11d48);
    }

    /* Warning */
    .toast--warning .toast-icon-wrap {
      background: rgba(245, 158, 11, 0.14);
      color: #d97706;
      border: 1px solid rgba(245, 158, 11, 0.22);
    }
    :host-context(html.dark) .toast--warning .toast-icon-wrap,
    :host-context(.dark) .toast--warning .toast-icon-wrap {
      background: rgba(245, 158, 11, 0.22);
      color: #fbbf24;
      border-color: rgba(245, 158, 11, 0.35);
    }
    .toast--warning .toast-progress-bar {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }

    /* Info */
    .toast--info .toast-icon-wrap {
      background: rgba(14, 165, 233, 0.14);
      color: #0284c7;
      border: 1px solid rgba(14, 165, 233, 0.22);
    }
    :host-context(html.dark) .toast--info .toast-icon-wrap,
    :host-context(.dark) .toast--info .toast-icon-wrap {
      background: rgba(14, 165, 233, 0.22);
      color: #38bdf8;
      border-color: rgba(14, 165, 233, 0.35);
    }
    .toast--info .toast-progress-bar {
      background: linear-gradient(90deg, #0ea5e9, #2563eb);
    }

    /* Toast Body Message */
    .toast-body {
      flex: 1;
      min-width: 0;
    }

    .toast-message {
      margin: 0;
      font-size: 13px;
      line-height: 1.4;
      font-weight: 600;
      letter-spacing: -0.01em;
      word-break: break-word;
    }

    /* Close Button */
    .toast-close-btn {
      width: 26px;
      height: 26px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: none;
      background: transparent;
      color: #94a3b8;
      cursor: pointer;
      padding: 0;
      transition: all 0.15s ease;
    }

    .toast-close-btn svg {
      width: 14px;
      height: 14px;
    }

    .toast-close-btn:hover {
      background: rgba(0, 0, 0, 0.07);
      color: #334155;
      transform: scale(1.08);
    }

    :host-context(html.dark) .toast-close-btn:hover,
    :host-context(.dark) .toast-close-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #f1f5f9;
    }

    .toast-close-btn:active {
      transform: scale(0.9);
    }

    /* Countdown Progress Bar */
    .toast-progress-track {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2.5px;
      background: rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }

    :host-context(html.dark) .toast-progress-track,
    :host-context(.dark) .toast-progress-track {
      background: rgba(255, 255, 255, 0.06);
    }

    .toast-progress-bar {
      height: 100%;
      width: 100%;
      transform-origin: left;
    }

    @media (prefers-reduced-motion: reduce) {
      .toast-card {
        transition: none !important;
      }
      .toast-progress-track {
        display: none;
      }
    }
  `],
})
export class ToastItemComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) toast!: Toast;
  @Output() dismissed = new EventEmitter<number>();

  @ViewChild('card') private cardRef!: ElementRef<HTMLDivElement>;
  @ViewChild('progress') private progressRef!: ElementRef<HTMLDivElement>;

  private progressTween: gsap.core.Tween | null = null;
  private isClosing = false;

  constructor(private hostEl: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    if (!this.cardRef?.nativeElement) return;

    // Smooth GSAP Entrance: spring pop + blur fade
    gsap.fromTo(
      this.cardRef.nativeElement,
      {
        y: -22,
        opacity: 0,
        scale: 0.92,
        filter: 'blur(6px)',
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.44,
        ease: 'back.out(1.4)',
      }
    );

    // 4-second Countdown Progress Bar with GSAP
    if (this.progressRef?.nativeElement) {
      const durationSec = (this.toast.duration ?? 4000) / 1000;
      this.progressTween = gsap.to(this.progressRef.nativeElement, {
        width: '0%',
        duration: durationSec,
        ease: 'none',
        onComplete: () => this.close(),
      });
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.progressTween?.pause();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.isClosing) {
      this.progressTween?.resume();
    }
  }

  close(e?: Event) {
    if (e) {
      e.stopPropagation();
    }
    if (this.isClosing) return;
    this.isClosing = true;

    if (this.progressTween) {
      this.progressTween.kill();
      this.progressTween = null;
    }

    const card = this.cardRef?.nativeElement;
    const host = this.hostEl?.nativeElement;

    if (!card || !host) {
      this.dismissed.emit(this.toast.id);
      return;
    }

    // Smooth GSAP Exit + vertical height collapse
    gsap
      .timeline({
        onComplete: () => {
          this.dismissed.emit(this.toast.id);
        },
      })
      .to(card, {
        y: -14,
        opacity: 0,
        scale: 0.93,
        filter: 'blur(4px)',
        duration: 0.24,
        ease: 'power2.in',
      })
      .to(
        host,
        {
          height: 0,
          opacity: 0,
          duration: 0.18,
          ease: 'power2.inOut',
        },
        '-=0.08'
      );
  }

  ngOnDestroy() {
    if (this.progressTween) {
      this.progressTween.kill();
      this.progressTween = null;
    }
    if (this.cardRef?.nativeElement) {
      gsap.killTweensOf(this.cardRef.nativeElement);
    }
    if (this.hostEl?.nativeElement) {
      gsap.killTweensOf(this.hostEl.nativeElement);
    }
  }
}
