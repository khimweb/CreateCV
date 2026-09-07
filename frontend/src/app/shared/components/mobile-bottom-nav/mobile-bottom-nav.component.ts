import { Component, signal, HostListener, inject, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import gsap from 'gsap';
import {
  LucideAngularModule,
  Home,
  LayoutTemplate,
  FileText,
  MoreHorizontal,
  Info,
  Mail,
  Receipt,
  HelpCircle,
  X,
} from 'lucide-angular';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-mobile-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <nav class="mob-nav" aria-label="Mobile navigation">

      @if (moreOpen()) {
        <div class="sheet-backdrop" (click)="closeMore()" aria-hidden="true"></div>
      }

      @if (moreOpen()) {
        <div class="more-sheet" role="menu">
          <div class="sheet-handle"></div>
          <a routerLink="/help"     (click)="closeMore()" class="sheet-item" role="menuitem">
            <span class="sheet-icon help-icon"><lucide-icon [img]="HelpCircle"/></span>
            <span class="sheet-label">{{ i18n.t('navHelp') }}</span>
          </a>
          <a routerLink="/payments" (click)="closeMore()" class="sheet-item" role="menuitem">
            <span class="sheet-icon pay-icon"><lucide-icon [img]="Receipt"/></span>
            <span class="sheet-label">{{ i18n.t('navPayments') }}</span>
          </a>
          <a routerLink="/about"    (click)="closeMore()" class="sheet-item" role="menuitem">
            <span class="sheet-icon about-icon"><lucide-icon [img]="Info"/></span>
            <span class="sheet-label">{{ i18n.t('navAbout') }}</span>
          </a>
          <a routerLink="/contact"  (click)="closeMore()" class="sheet-item" role="menuitem">
            <span class="sheet-icon contact-icon"><lucide-icon [img]="Mail"/></span>
            <span class="sheet-label">{{ i18n.t('navContact') }}</span>
          </a>
          <button class="sheet-close" (click)="closeMore()" aria-label="Close menu">
            <lucide-icon [img]="X"/>
            <span>{{ i18n.currentLang() === 'kh' ? 'បិទ' : 'Close' }}</span>
          </button>
        </div>
      }

      <div class="tab-bar">
        <a routerLink="/" (click)="onTabClick($event)" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="tab" aria-label="Home">
          <span class="tab-icon"><lucide-icon [img]="Home"/></span>
          <span class="tab-label">{{ i18n.t('navHome') }}</span>
        </a>
        <a routerLink="/templates" (click)="onTabClick($event)" routerLinkActive="active" class="tab" aria-label="Templates">
          <span class="tab-icon"><lucide-icon [img]="LayoutTemplate"/></span>
          <span class="tab-label">{{ i18n.t('navTemplates') }}</span>
        </a>
        <a routerLink="/my-cv" (click)="onTabClick($event)" routerLinkActive="active" class="tab" aria-label="My CV">
          <span class="tab-icon"><lucide-icon [img]="FileText"/></span>
          <span class="tab-label">{{ i18n.t('navMyCv') }}</span>
        </a>
        <button type="button" class="tab" [class.active]="moreOpen()"
                (click)="toggleMore($event)"
                [attr.aria-expanded]="moreOpen()" aria-label="More">
          <span class="tab-icon"><lucide-icon [img]="MoreHorizontal"/></span>
          <span class="tab-label">{{ i18n.t('navMore') }}</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: none; }

    /* ─── Shown on mobile AND tablet (≤ 1024px) ─── */
    @media (max-width: 1024px) {
      :host { display: block; }

      .mob-nav {
        position: fixed;
        z-index: 55;
        left: 0; right: 0; bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
        font-family: 'Manrope', 'Inter', system-ui, sans-serif;
      }

      /* Backdrop */
      .sheet-backdrop {
        position: fixed;
        inset: 0;
        z-index: 54;
        background: rgba(0,0,0,0.35);
        backdrop-filter: blur(3px);
        pointer-events: auto;
      }

      /* More sheet */
      .more-sheet {
        position: fixed;
        bottom: calc(84px + env(safe-area-inset-bottom, 0px));
        left: 50%;
        transform: translateX(-50%);
        width: min(calc(100% - 32px), 360px);
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(28px) saturate(190%);
        -webkit-backdrop-filter: blur(28px) saturate(190%);
        border: 1px solid rgba(255,255,255,0.8);
        border-radius: 24px;
        padding: 8px;
        box-shadow: 0 24px 60px -8px rgba(15,23,42,0.22), 0 4px 16px -2px rgba(15,23,42,0.08);
        z-index: 56;
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .sheet-handle {
        width: 36px; height: 4px;
        border-radius: 2px;
        background: #e2e8f0;
        margin: 4px auto 10px;
      }

      .sheet-item {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 11px 16px;
        border-radius: 16px;
        text-decoration: none;
        color: #1e293b;
        font-size: 0.85rem;
        font-weight: 700;
        transition: all .22s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .sheet-item:hover {
        background: rgba(99,102,241,0.08);
        color: #4f46e5;
        transform: translateX(3px);
      }
      .sheet-item:active { transform: scale(0.97); }

      .sheet-icon {
        width: 40px; height: 40px;
        border-radius: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: transform .22s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .sheet-item:hover .sheet-icon {
        transform: scale(1.08);
      }
      .sheet-icon lucide-icon { width: 20px; height: 20px; }
      .help-icon    { background: #ede9fe; color: #7c3aed; }
      .pay-icon     { background: #d1fae5; color: #059669; }
      .about-icon   { background: #dbeafe; color: #2563eb; }
      .contact-icon { background: #fce7f3; color: #db2777; }
      .sheet-label  { flex: 1; }

      .sheet-close {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 100%;
        margin-top: 6px;
        padding: 12px;
        border: none;
        border-radius: 14px;
        background: #f1f5f9;
        color: #64748b;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        transition: all .2s ease;
      }
      .sheet-close lucide-icon { width: 15px; height: 15px; }
      .sheet-close:hover { background: #e2e8f0; color: #1e293b; transform: translateY(-1px); }
      .sheet-close:active { transform: scale(0.98); }

      /* ── Tab bar ── */
      .tab-bar {
        position: fixed;
        bottom: calc(14px + env(safe-area-inset-bottom, 0px));
        left: 50%;
        transform: translateX(-50%);
        width: min(calc(100% - 24px), 360px);
        height: 62px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        align-items: center;
        gap: 4px;
        padding: 5px;
        box-sizing: border-box;
        background: rgba(255,255,255,0.85);
        backdrop-filter: blur(28px) saturate(190%);
        -webkit-backdrop-filter: blur(28px) saturate(190%);
        border: 1px solid rgba(255,255,255,0.75);
        border-radius: 9999px;
        box-shadow:
          0 16px 40px -8px rgba(15,23,42,0.14),
          0 4px 14px -2px rgba(15,23,42,0.05),
          inset 0 1px 1px 0 rgba(255,255,255,0.95);
        pointer-events: auto;
        z-index: 55;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, background 0.3s ease;
      }
      .tab-bar:hover {
        transform: translateX(-50%) translateY(-2px);
        box-shadow:
          0 20px 48px -8px rgba(15,23,42,0.18),
          0 6px 18px -2px rgba(15,23,42,0.08),
          inset 0 1px 1px 0 #ffffff;
      }

      /* ── Individual tab ── */
      .tab {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        height: 50px;
        border-radius: 9999px;
        background: transparent;
        border: none;
        color: #64748b;
        text-decoration: none;
        cursor: pointer;
        transition: all .25s cubic-bezier(0.16, 1, 0.3, 1);
        -webkit-tap-highlight-color: transparent;
        outline: none;
        will-change: transform;
      }

      .tab:active {
        transform: scale(0.94);
        transition: transform .1s ease;
      }

      .tab:not(.active):hover {
        color: #4f46e5;
        background: rgba(99,102,241,0.08);
        transform: translateY(-1.5px);
      }
      .tab:not(.active):hover .tab-icon {
        transform: translateY(-2px) scale(1.06);
      }
      .tab:not(.active):hover .tab-label {
        opacity: 0.85;
        transform: translateY(0);
        color: #4f46e5;
      }

      .tab-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform .25s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: transform;
      }
      .tab-icon lucide-icon { width: 21px; height: 21px; stroke-width: 2; }

      .tab-label {
        font-size: 0.58rem;
        font-weight: 800;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity .22s ease, transform .22s cubic-bezier(0.16, 1, 0.3, 1), color .2s ease;
        white-space: nowrap;
        line-height: 1;
      }

      /* Active */
      .tab.active {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        color: #ffffff;
        box-shadow:
          0 8px 22px -3px rgba(79,70,229,0.48),
          0 2px 6px -1px rgba(79,70,229,0.25);
        transform: translateY(-1px);
      }
      .tab.active .tab-icon { transform: translateY(-3px); }
      .tab.active .tab-label { opacity: 1; transform: translateY(0); color: #ffffff; }
      .tab.active .tab-icon lucide-icon { stroke-width: 2.4; }
      .tab.active:hover {
        box-shadow:
          0 10px 26px -2px rgba(79,70,229,0.55),
          0 3px 8px -1px rgba(79,70,229,0.3);
        transform: translateY(-2px);
      }

      .tab:focus-visible { outline: 3px solid #a5b4fc; outline-offset: 2px; }

      /* ── iPad: wider pill, bigger touch targets ── */
      @media (min-width: 640px) {
        .tab-bar {
          width: min(calc(100% - 48px), 520px);
          height: 68px;
          padding: 6px;
          gap: 6px;
        }
        .tab { height: 54px; }
        .tab-icon lucide-icon { width: 23px; height: 23px; }
        .tab-label { font-size: 0.62rem; }
        .more-sheet { width: min(calc(100% - 64px), 420px); bottom: calc(88px + env(safe-area-inset-bottom, 0px)); }
        .sheet-item { padding: 13px 18px; font-size: 0.88rem; }
        .sheet-icon { width: 44px; height: 44px; }
      }

      /* ── Dark mode ── */
      :host-context(html.dark) .tab-bar {
        background: rgba(13,21,40,0.85);
        border-color: rgba(255,255,255,0.1);
        box-shadow:
          0 16px 45px -8px rgba(0,0,0,0.6),
          0 4px 14px -2px rgba(0,0,0,0.4),
          inset 0 1px 1px 0 rgba(255,255,255,0.08);
      }
      :host-context(html.dark) .tab-bar:hover {
        box-shadow:
          0 22px 55px -8px rgba(0,0,0,0.75),
          0 6px 18px -2px rgba(0,0,0,0.5),
          inset 0 1px 1px 0 rgba(255,255,255,0.12);
      }
      :host-context(html.dark) .tab { color: #94a3b8; }
      :host-context(html.dark) .tab:not(.active):hover {
        color: #a5b4fc;
        background: rgba(99,102,241,0.16);
      }
      :host-context(html.dark) .more-sheet {
        background: rgba(13,21,40,0.92);
        border-color: rgba(255,255,255,0.12);
        box-shadow: 0 24px 60px -8px rgba(0,0,0,0.7);
      }
      :host-context(html.dark) .sheet-handle { background: #334155; }
      :host-context(html.dark) .sheet-item { color: #e2e8f0; }
      :host-context(html.dark) .sheet-item:hover { background: #1e293b; color: #a5b4fc; }
      :host-context(html.dark) .help-icon    { background: rgba(124,58,237,.22); color: #a78bfa; }
      :host-context(html.dark) .pay-icon     { background: rgba(5,150,105,.22);  color: #34d399; }
      :host-context(html.dark) .about-icon   { background: rgba(37,99,235,.22);  color: #60a5fa; }
      :host-context(html.dark) .contact-icon { background: rgba(219,39,119,.22); color: #f472b6; }
      :host-context(html.dark) .sheet-close  { background: #1e293b; color: #94a3b8; }
      :host-context(html.dark) .sheet-close:hover { background: #273349; color: #e2e8f0; }
      :host-context(html.dark) .sheet-backdrop { background: rgba(0,0,0,0.6); }
    }

    @media (prefers-reduced-motion: reduce) {
      .tab, .tab-label, .tab-icon lucide-icon,
      .more-sheet, .sheet-backdrop, .sheet-item {
        animation: none !important;
        transition: none !important;
      }
    }
  `],
})
export class MobileBottomNavComponent {
  private el = inject(ElementRef);
  readonly i18n = inject(TranslationService);

  readonly Home = Home;
  readonly LayoutTemplate = LayoutTemplate;
  readonly FileText = FileText;
  readonly MoreHorizontal = MoreHorizontal;
  readonly Info = Info;
  readonly Mail = Mail;
  readonly Receipt = Receipt;
  readonly HelpCircle = HelpCircle;
  readonly X = X;

  moreOpen = signal(false);

  @HostListener('document:keydown.escape')
  onEscape() { this.closeMore(); }

  onTabClick(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const icon = target.querySelector('.tab-icon');

    gsap.killTweensOf(target);
    if (icon) gsap.killTweensOf(icon);

    gsap.to(target, {
      scale: 0.94,
      duration: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(target, {
          scale: 1,
          duration: 0.32,
          ease: 'back.out(2)'
        });
      }
    });

    if (icon) {
      gsap.to(icon, {
        scale: 1.12,
        duration: 0.16,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      });
    }
  }

  toggleMore(event: MouseEvent) {
    this.onTabClick(event);
    if (this.moreOpen()) {
      this.closeMore();
    } else {
      this.openMore();
    }
  }

  openMore() {
    this.moreOpen.set(true);
    requestAnimationFrame(() => {
      const sheet = this.el.nativeElement.querySelector('.more-sheet');
      const backdrop = this.el.nativeElement.querySelector('.sheet-backdrop');
      if (backdrop) {
        gsap.killTweensOf(backdrop);
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' });
      }
      if (sheet) {
        gsap.killTweensOf(sheet);
        gsap.fromTo(
          sheet,
          { opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom center' },
          { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'back.out(1.6)' }
        );
        const items = sheet.querySelectorAll('.sheet-item');
        if (items.length) {
          gsap.fromTo(
            items,
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.22, stagger: 0.03, ease: 'power2.out', delay: 0.05 }
          );
        }
      }
    });
  }

  closeMore() {
    const sheet = this.el.nativeElement.querySelector('.more-sheet');
    const backdrop = this.el.nativeElement.querySelector('.sheet-backdrop');
    if (sheet && backdrop) {
      gsap.to(sheet, { opacity: 0, y: 14, scale: 0.96, duration: 0.18, ease: 'power2.in' });
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => this.moreOpen.set(false)
      });
    } else {
      this.moreOpen.set(false);
    }
  }
}
