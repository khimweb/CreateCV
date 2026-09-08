import { Injectable } from '@angular/core';
import PptxGenJS from 'pptxgenjs';

/** CSS pixels per inch — the browser's reference resolution. */
const PX_PER_IN = 96;
/** A4 portrait in inches (210mm × 297mm). */
const A4_W_IN = 210 / 25.4;
const A4_H_IN = 297 / 25.4;
const PAGE_H_PX = A4_H_IN * PX_PER_IN;

interface Box { x: number; y: number; w: number; h: number; }

/**
 * Exports a rendered A4 CV to an editable PowerPoint deck.
 *
 * Instead of hand-mapping every template, this measures the real DOM after the
 * browser has laid it out at exactly 210mm × 297mm, then emits one PowerPoint
 * shape per painted box and one text frame per text block at the same
 * coordinates. Every template — current or future — is supported automatically.
 */
@Injectable({ providedIn: 'root' })
export class PptxExportService {
  private images = new Map<string, string | null>();

  async export(source: HTMLElement, fileName: string): Promise<void> {
    const { root, dispose } = this.mountOffscreen(source);
    try {
      const pptx = new PptxGenJS();
      pptx.defineLayout({ name: 'A4_PORTRAIT', width: A4_W_IN, height: A4_H_IN });
      pptx.layout = 'A4_PORTRAIT';

      const origin = root.getBoundingClientRect();
      const height = Math.max(root.scrollHeight, root.getBoundingClientRect().height);
      const pages = Math.max(1, Math.round(height / PAGE_H_PX - 0.04) || 1);

      for (let page = 0; page < pages; page++) {
        const slide = pptx.addSlide();
        slide.background = { color: 'FFFFFF' };
        await this.walk(root, slide, origin, page * PAGE_H_PX);
      }

      await pptx.writeFile({ fileName });
    } finally {
      dispose();
    }
  }

  /**
   * Clones the CV into a hidden, untransformed container so measurements are
   * taken at true A4 size regardless of the preview's current zoom level.
   */
  private mountOffscreen(source: HTMLElement) {
    const holder = document.createElement('div');
    holder.setAttribute('aria-hidden', 'true');
    holder.style.cssText =
      'position:fixed;left:-10000px;top:0;width:210mm;min-height:297mm;background:#fff;pointer-events:none;z-index:-9999;visibility:visible;';

    const clone = source.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';
    clone.style.setProperty('zoom', '1');
    holder.appendChild(clone);
    document.body.appendChild(holder);

    return { root: clone, dispose: () => holder.remove() };
  }

  // ── DOM traversal ────────────────────────────────────────────────────────

  private async walk(el: Element, slide: PptxGenJS.Slide, origin: DOMRect, pageOffset: number): Promise<void> {
    const tag = el.tagName.toLowerCase();
    if (tag === 'app-watermark' || el.classList.contains('watermark') || el.classList.contains('no-print')) {
      return;
    }

    const cs = getComputedStyle(el as HTMLElement);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return;

    const rect = (el as HTMLElement).getBoundingClientRect();
    const box = this.toBox(rect, origin, pageOffset);
    const onPage = rect.bottom - origin.top > pageOffset && rect.top - origin.top < pageOffset + PAGE_H_PX;

    if (onPage && rect.width > 0 && rect.height > 0) {
      this.paintBackground(slide, el as HTMLElement, cs, box);
      this.paintBorders(slide, cs, box);
      await this.paintImage(slide, el as HTMLElement, cs, box);
    }

    // <svg> is rasterised as a whole; never walk into its primitives.
    if (tag === 'svg') return;

    if (onPage) this.paintText(slide, el as HTMLElement, cs, origin, pageOffset);

    for (const child of Array.from(el.children)) {
      await this.walk(child, slide, origin, pageOffset);
    }
  }

  private toBox(rect: DOMRect, origin: DOMRect, pageOffset: number): Box {
    return {
      x: (rect.left - origin.left) / PX_PER_IN,
      y: (rect.top - origin.top - pageOffset) / PX_PER_IN,
      w: rect.width / PX_PER_IN,
      h: rect.height / PX_PER_IN,
    };
  }

  // ── Painting ─────────────────────────────────────────────────────────────

  private paintBackground(slide: PptxGenJS.Slide, el: HTMLElement, cs: CSSStyleDeclaration, box: Box) {
    const fill = this.toHex(cs.backgroundColor);
    if (!fill) return;

    const alpha = this.alphaOf(cs.backgroundColor);
    const shape = this.shapeFor(cs, el);

    const bTopW = parseFloat(cs.borderTopWidth) || 0;
    const bBotW = parseFloat(cs.borderBottomWidth) || 0;
    const bLeftW = parseFloat(cs.borderLeftWidth) || 0;
    const bRightW = parseFloat(cs.borderRightWidth) || 0;
    const sameBorder = bTopW > 0 && bTopW === bBotW && bTopW === bLeftW && bTopW === bRightW;
    const borderColor = sameBorder ? this.toHex(cs.borderTopColor) : null;

    slide.addShape(shape.type, {
      ...box,
      fill: { color: fill, transparency: Math.round((1 - alpha) * 100) },
      line: sameBorder && borderColor ? { color: borderColor, width: (bTopW / PX_PER_IN) * 72 } : { type: 'none' },
      ...(shape.radius !== undefined ? { rectRadius: shape.radius } : {}),
    });
  }

  /** Chooses ellipse / rounded rectangle / rectangle from border-radius. */
  private shapeFor(cs: CSSStyleDeclaration, el: HTMLElement) {
    const radii = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomLeftRadius, cs.borderBottomRightRadius];
    const isPill = radii.every((r) => r.includes('50%')) || radii.every((r) => parseFloat(r) >= el.clientWidth / 2 && el.clientWidth > 0);
    if (isPill) return { type: 'ellipse' as PptxGenJS.SHAPE_NAME };

    const px = Math.max(...radii.map((r) => parseFloat(r) || 0));
    if (px > 1) {
      const shortest = Math.min(el.getBoundingClientRect().width, el.getBoundingClientRect().height);
      const ratio = shortest > 0 ? Math.min(0.5, px / shortest) : 0;
      return { type: 'roundRect' as PptxGenJS.SHAPE_NAME, radius: ratio };
    }
    return { type: 'rect' as PptxGenJS.SHAPE_NAME };
  }

  /** Border sides become thin filled rectangles so hairlines stay exact. */
  private paintBorders(slide: PptxGenJS.Slide, cs: CSSStyleDeclaration, box: Box) {
    const bTopW = parseFloat(cs.borderTopWidth) || 0;
    const bBotW = parseFloat(cs.borderBottomWidth) || 0;
    const bLeftW = parseFloat(cs.borderLeftWidth) || 0;
    const bRightW = parseFloat(cs.borderRightWidth) || 0;

    // If all borders are uniform and were already drawn with the background shape, skip individual strips
    if (bTopW > 0 && bTopW === bBotW && bTopW === bLeftW && bTopW === bRightW && this.toHex(cs.backgroundColor)) {
      return;
    }

    const sides = [
      { w: bTopW, c: cs.borderTopColor, s: cs.borderTopStyle, x: box.x, y: box.y, bw: box.w, bh: 0 },
      { w: bBotW, c: cs.borderBottomColor, s: cs.borderBottomStyle, x: box.x, y: box.y + box.h, bw: box.w, bh: 0 },
      { w: bLeftW, c: cs.borderLeftColor, s: cs.borderLeftStyle, x: box.x, y: box.y, bw: 0, bh: box.h },
      { w: bRightW, c: cs.borderRightColor, s: cs.borderRightStyle, x: box.x + box.w, y: box.y, bw: 0, bh: box.h },
    ];

    sides.forEach((side, index) => {
      if (!side.w || side.s === 'none' || side.s === 'hidden') return;
      const color = this.toHex(side.c);
      if (!color) return;
      const thickness = side.w / PX_PER_IN;

      const geometry: Box =
        index === 0 ? { x: box.x, y: box.y, w: box.w, h: thickness }
        : index === 1 ? { x: box.x, y: box.y + box.h - thickness, w: box.w, h: thickness }
        : index === 2 ? { x: box.x, y: box.y, w: thickness, h: box.h }
        : { x: box.x + box.w - thickness, y: box.y, w: thickness, h: box.h };

      slide.addShape('rect', {
        ...geometry,
        fill: { color, transparency: Math.round((1 - this.alphaOf(side.c)) * 100) },
        line: { type: 'none' },
      });
    });
  }

  private async paintImage(slide: PptxGenJS.Slide, el: HTMLElement, cs: CSSStyleDeclaration, box: Box) {
    const tag = el.tagName.toLowerCase();
    let src: string | null = null;

    if (tag === 'img') src = (el as HTMLImageElement).src;
    else if (tag === 'svg') src = await this.svgToPng(el as unknown as SVGElement);
    else {
      const match = /url\((['"]?)(.*?)\1\)/.exec(cs.backgroundImage || '');
      if (match) src = match[2];
    }
    if (!src) return;

    const data = await this.toPngData(src);
    if (!data) return;

    const radii = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomLeftRadius, cs.borderBottomRightRadius];
    const circular = radii.every((r) => r.includes('50%'));

    slide.addImage({ data, ...box, ...(circular ? { rounding: true } : {}) });
  }

  /**
   * Emits one text frame per element that directly owns text, so the result
   * stays editable in PowerPoint instead of becoming per-line fragments.
   */
  private paintText(slide: PptxGenJS.Slide, el: HTMLElement, cs: CSSStyleDeclaration, origin: DOMRect, pageOffset: number) {
    const own = Array.from(el.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent || '')
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
    if (!own) return;

    const range = document.createRange();
    range.selectNodeContents(el);
    const rect = range.getBoundingClientRect();
    range.detach();
    if (!rect.width || !rect.height) return;

    const size = parseFloat(cs.fontSize) || 12;
    const text = this.applyTransform(own, cs.textTransform);
    const color = this.toHex(cs.color) || '2A2A2A';
    const listed = cs.display === 'list-item' && cs.listStyleType !== 'none';

    // Single-line elements (names, headers, dates, badges) should never wrap in PowerPoint
    const isSingleLine = rect.height <= size * 1.65;
    const padX = isSingleLine ? Math.max(size * 0.8, 8) : size * 0.4;
    const padY = isSingleLine ? 0 : size * 0.2;

    const box: Box = {
      x: (rect.left - origin.left - padX / 2) / PX_PER_IN,
      y: (rect.top - origin.top - pageOffset - padY / 2) / PX_PER_IN,
      w: (rect.width + padX) / PX_PER_IN,
      h: (rect.height + padY) / PX_PER_IN,
    };

    const rawLh = parseFloat(cs.lineHeight);
    const lineSpacingMultiple = (!isSingleLine && rawLh && size && !isNaN(rawLh) && rawLh > 0)
      ? Math.max(0.9, Math.min(1.8, rawLh / size))
      : undefined;

    const hasKhmer = /[\u1780-\u17FF]/.test(text);
    const fontFace = hasKhmer
      ? 'Khmer OS Battambang, Arial'
      : this.fontOf(cs.fontFamily);

    slide.addText(text, {
      ...box,
      fontFace,
      fontSize: size * 0.75, // convert px to pt
      bold: (parseInt(cs.fontWeight, 10) || 400) >= 600,
      italic: cs.fontStyle === 'italic',
      color,
      align: (['center', 'right', 'justify'].includes(cs.textAlign) ? cs.textAlign : 'left') as PptxGenJS.HAlign,
      valign: 'top',
      margin: [0, 0, 0, 0],
      charSpacing: !isNaN(parseFloat(cs.letterSpacing)) ? parseFloat(cs.letterSpacing) * 0.75 : 0,
      lineSpacingMultiple,
      bullet: listed ? { characterCode: '2022' } : false,
      wrap: !isSingleLine,
      fit: 'none',
      isTextBox: true,
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private applyTransform(text: string, transform: string) {
    if (transform === 'uppercase') return text.toUpperCase();
    if (transform === 'lowercase') return text.toLowerCase();
    if (transform === 'capitalize') return text.replace(/\b\w/g, (c) => c.toUpperCase());
    return text;
  }

  private fontOf(family: string) {
    return (family.split(',')[0] || 'Arial').replace(/["']/g, '').trim();
  }

  private alphaOf(color: string): number {
    if (!color || color === 'transparent') return 0;
    const parts = color.match(/[\d.]+/g)?.map(Number);
    if (!parts || parts.length < 4) return 1;
    return isNaN(parts[3]) ? 1 : parts[3];
  }

  /** Returns an RRGGBB hex string, or null when fully transparent. */
  private toHex(color: string): string | null {
    if (!color || color === 'transparent' || color === 'none') return null;
    if (color.startsWith('#')) {
      const hex = color.slice(1).trim();
      return hex.length === 3
        ? hex.split('').map((c) => c + c).join('').toUpperCase()
        : hex.slice(0, 6).toUpperCase();
    }
    const parts = color.match(/[\d.]+/g)?.map(Number);
    if (!parts || parts.length < 3) return null;
    const [r, g, b, a = 1] = parts;
    if (a === 0 || isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }

  /** Inlines computed paint so a stylesheet-styled SVG survives serialisation. */
  private async svgToPng(svg: SVGElement): Promise<string | null> {
    const clone = svg.cloneNode(true) as SVGElement;
    const sources = [svg, ...Array.from(svg.querySelectorAll('*'))];
    const targets = [clone, ...Array.from(clone.querySelectorAll('*'))];

    sources.forEach((node, i) => {
      const style = getComputedStyle(node as Element);
      const target = targets[i] as SVGElement;
      if (!target?.setAttribute) return;
      ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'].forEach((prop) => {
        const value = style.getPropertyValue(prop);
        if (value && value !== 'none') target.setAttribute(prop, value);
        else if (prop === 'fill' && value === 'none') target.setAttribute('fill', 'none');
      });
    });

    const rect = svg.getBoundingClientRect();
    clone.setAttribute('width', String(Math.max(1, rect.width)));
    clone.setAttribute('height', String(Math.max(1, rect.height)));
    if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const markup = new XMLSerializer().serializeToString(clone);
    return this.rasterise(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`, rect.width, rect.height);
  }

  /** PowerPoint cannot embed SVG, so everything becomes PNG data. */
  private async toPngData(src: string): Promise<string | null> {
    if (this.images.has(src)) return this.images.get(src) ?? null;

    let data: string | null = null;
    if (/^data:image\/(png|jpe?g|gif)/i.test(src)) data = src;
    else data = await this.rasterise(src);

    this.images.set(src, data);
    return data;
  }

  private rasterise(src: string, width = 0, height = 0): Promise<string | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const scale = 3; // keep edges crisp when the deck is zoomed
        const w = Math.max(1, Math.round((width || img.naturalWidth || 64) * scale));
        const h = Math.max(1, Math.round((height || img.naturalHeight || 64) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(canvas.toDataURL('image/png'));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }
}
