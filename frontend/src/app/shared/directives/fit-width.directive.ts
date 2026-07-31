import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';

/**
 * Publishes `--fit-scale` on the host: how much a fixed-width sheet has to
 * shrink to fit the host's current width. Children scale with
 * `transform: scale(var(--fit-scale))`.
 */
@Directive({
  selector: '[appFitWidth]',
  standalone: true,
})
export class FitWidthDirective implements AfterViewInit, OnDestroy {
  /** Width of the scaled content, in CSS px. A4 (210mm) ≈ 793.7px. */
  @Input() fitContentWidth = 793.7;

  private observer?: ResizeObserver;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const el = this.host.nativeElement;
    this.observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width > 0) el.style.setProperty('--fit-scale', String(width / this.fitContentWidth));
    });
    this.observer.observe(el);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
