import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-watermark',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="watermark-overlay" 
      [style.backgroundImage]="getWatermarkSvg()"
      aria-hidden="true">
    </div>
  `,
  styles: [`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 30;
      overflow: hidden;
      display: block;
    }
    .watermark-overlay {
      width: 100%;
      height: 100%;
      background-repeat: repeat;
      opacity: 0.9;
    }
  `]
})
export class WatermarkComponent {
  @Input() text: string = 'CQ Professional';
  @Input() opacity: number = 0.22;

  getWatermarkSvg(): string {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='140' viewBox='0 0 240 140'>
      <text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' 
            fill='rgba(67, 56, 202, ${this.opacity})' 
            font-family='system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' 
            font-size='17' 
            font-weight='700' 
            letter-spacing='1px'
            transform='rotate(-30 120 70)'>${this.text}</text>
    </svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }
}
