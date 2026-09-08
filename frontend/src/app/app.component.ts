import { Component, ElementRef, inject } from '@angular/core';
import { NavigationEnd, NavigationCancel, NavigationError, Event as RouterEvent, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { MobileBottomNavComponent } from './shared/components/mobile-bottom-nav/mobile-bottom-nav.component';
import { SiteFooterComponent } from './shared/components/site-footer/site-footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';
import gsap from 'gsap';

@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterOutlet, NavbarComponent, MobileBottomNavComponent, SiteFooterComponent, ToastComponent],
  template: `
    <div class="min-h-screen app-shell-container text-slate-800 dark:text-sky-100 transition-colors duration-300 ease-in-out">
      @if (!isHiddenNavRoute()) {<app-navbar />}
      @if (!isBottomNavHidden()) {<app-mobile-bottom-nav />}
      <main class="page-content" [class.no-bottom-nav]="isBottomNavHidden()"><router-outlet (activate)="onRouteActivated($event)" /></main>
      @if (!isHiddenNavRoute()) {<app-site-footer />}
    </div>
    <app-toast />
  `,
  styles: [`
    .app-shell-container{background:linear-gradient(150deg,#f8faff 0%,#eef3ff 45%,#f4f8ff 100%);position:relative}
    :host-context(.dark) .app-shell-container{background:linear-gradient(145deg,#0d1527 0%,#111b32 50%,#111a2c 100%)}
    .page-content{overflow-x:hidden}
    @media(max-width:1024px){.page-content{padding-bottom:calc(96px + env(safe-area-inset-bottom, 0px))}}
    @media(max-width:1024px){.page-content.no-bottom-nav{padding-bottom:calc(76px + env(safe-area-inset-bottom, 0px))}}
  `],
})
export class AppComponent {
  private el = inject(ElementRef);
  private currentTl: gsap.core.Timeline | null = null;

  constructor(private router: Router, private auth: AuthService) {
    this.restoreTheme();

    if (this.auth.isLoggedIn()) {
      this.auth.refreshCurrentUser().subscribe({ error: () => {} });
    }

    // Ensure page-content is always 100% visible and un-dimmed across all route transitions
    this.router.events.pipe(
      filter((e: RouterEvent): e is NavigationEnd | NavigationCancel | NavigationError =>
        e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError
      )
    ).subscribe(() => {
      const main = this.el.nativeElement.querySelector('main.page-content');
      if (main) {
        gsap.killTweensOf(main);
        gsap.set(main, { opacity: 1, y: 0, clearProps: 'opacity,transform' });
      }
    });
  }

  onRouteActivated(component: any) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    requestAnimationFrame(() => {
      const main = this.el.nativeElement.querySelector('main.page-content');
      if (!main) return;

      if (this.currentTl) {
        this.currentTl.kill();
      }

      gsap.killTweensOf(main);
      gsap.set(main, { opacity: 1, y: 0, clearProps: 'opacity,transform' });

      // Skip complex marketing stagger animations on admin and auth views
      if (this.isHiddenNavRoute()) {
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });
      this.currentTl = tl;

      // 1. Overall base container smooth fade
      tl.fromTo(
        main,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, clearProps: 'opacity' },
        0
      );

      // Left-side elements (headings, badges, lead text, search bar, form cards)
      const allLeft = Array.from(main.querySelectorAll(
        '.badge-pill, h1, .hero-title, .library-head, .gallery-head, .section-title, .contact-side, .lead, .hero-lead, .search-box, .search-wrapper-animated, .auth-card'
      )) as HTMLElement[];
      const leftCandidates = allLeft.filter(el => !this.isDescendantOfAny(el, ['.badge-pill', 'h1', '.search-box']));

      // Right-side elements (previews, actions, direct cards, showcase, stats)
      const allRight = Array.from(main.querySelectorAll(
        '.hero-preview, .hero-actions, .preview-badge, .direct-card, .tiktok-card, .showcase-card, .floating-stat-card, .trust-pills, .form-card, [class*="preview"], [class*="thumb"]'
      )) as HTMLElement[];
      const rightCandidates = allRight.filter(el => !leftCandidates.includes(el));

      // Grid cards for staggered bottom-up entrance
      const allCards = Array.from(main.querySelectorAll(
        '.template-card, .cv-card, .pillar-card, .step-card, .benefit-card, .pricing-card, details, .location-card'
      )) as HTMLElement[];
      const cardCandidates = allCards.filter(el => !leftCandidates.includes(el) && !rightCandidates.includes(el));

      const leftItems = leftCandidates.slice(0, 5);
      const rightItems = rightCandidates.slice(0, 5);
      const cards = cardCandidates.slice(0, 8);

      // POPUP FROM LEFT at 0.1s
      if (leftItems.length > 0) {
        tl.fromTo(
          leftItems,
          { opacity: 0, x: -38, scale: 0.97 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.05,
            ease: 'back.out(1.3)',
            clearProps: 'transform,opacity',
          },
          0.10 // 0.1s delay
        );
      }

      // POPUP FROM RIGHT at 0.3s
      if (rightItems.length > 0) {
        tl.fromTo(
          rightItems,
          { opacity: 0, x: 38, scale: 0.97 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.48,
            stagger: 0.06,
            ease: 'back.out(1.3)',
            clearProps: 'transform,opacity',
          },
          0.30 // 0.3s delay
        );
      }

      // Bottom cards pop up with stagger at 0.2s
      if (cards.length > 0) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 26, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          },
          0.20
        );
      }

      // Fallback for simple pages
      if (leftItems.length === 0 && rightItems.length === 0 && cards.length === 0) {
        const topChildren = Array.from(main.querySelectorAll('section, form, div > div')).slice(0, 4);
        if (topChildren.length > 0) {
          tl.fromTo(
            topChildren,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.35,
              stagger: 0.06,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            },
            0.10
          );
        }
      }
    });
  }

  private isDescendantOfAny(el: HTMLElement, selectors: string[]): boolean {
    for (const sel of selectors) {
      if (el.parentElement?.closest(sel)) {
        return true;
      }
    }
    return false;
  }

  private restoreTheme(){
    try {
      document.documentElement.classList.toggle('dark', localStorage.getItem('cv_creator_theme') === 'dark');
    } catch {
      document.documentElement.classList.remove('dark');
    }
  }
  isHiddenNavRoute(){const url=this.router.url.split('?')[0];return url==='/login'||url==='/register'||url.startsWith('/admin');}
  isBottomNavHidden(){return this.isHiddenNavRoute();}
}

