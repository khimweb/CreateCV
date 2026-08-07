import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

/** CSS pixel width of an A4 portrait page (210mm at 96dpi). */
const A4_WIDTH_PX = 793.7;

/**
 * Scales a fixed 210mm × 297mm CV renderer down so the **whole page** fits
 * inside its container.
 *
 * Applied to the container, it publishes a `--a4-scale` custom property that
 * the thumbnail uses via `transform: scale(var(--a4-scale))`.
 *
 * This replaces `scale(calc(100cqw / 793.7))`, which was invalid CSS: dividing
 * a length by a number produces a length, and `scale()` only accepts a unitless
 * number, so the transform was dropped and the page rendered cropped.
 */
@Directive({
  selector: '[appA4Fit]',
  standalone: true,
})
export class A4FitDirective implements OnInit, OnDestroy {
  private observer?: ResizeObserver;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.apply();
    if (typeof ResizeObserver === 'undefined') return;
    this.observer = new ResizeObserver(() => this.apply());
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private apply() {
    const el = this.host.nativeElement;
    const width = el.clientWidth;
    if (!width) return;
    el.style.setProperty('--a4-scale', String(width / A4_WIDTH_PX));
  }
}
