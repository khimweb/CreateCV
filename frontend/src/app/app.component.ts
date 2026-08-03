import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { MobileBottomNavComponent } from './shared/components/mobile-bottom-nav/mobile-bottom-nav.component';
import { SiteFooterComponent } from './shared/components/site-footer/site-footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterOutlet, NavbarComponent, MobileBottomNavComponent, SiteFooterComponent, ToastComponent],
  template: `
    <div class="min-h-screen bg-sky-50 dark:bg-[#0F172A] text-slate-800 dark:text-sky-100 transition-colors duration-300 ease-in-out">
      @if (!isHiddenNavRoute()) {<app-navbar /><app-mobile-bottom-nav />}
      <main class="page-content"><div class="route-view" [class.route-enter]="routeEntered()"><router-outlet (activate)="onRouteActivated()" /></div></main>
      @if (!isHiddenNavRoute()) {<app-site-footer />}
    </div>
    <app-toast />
  `,
  styles: [`.route-view.route-enter{animation:routeEnter .34s cubic-bezier(.16,1,.3,1)}@keyframes routeEnter{from{opacity:0;transform:translateY(10px) scale(.995)}to{opacity:1;transform:translateY(0) scale(1)}}@media(max-width:720px){.page-content{padding-bottom:100px}}@media(prefers-reduced-motion:reduce){.route-view.route-enter{animation:none}}`],
})
export class AppComponent {
  routeEntered = signal(false);
  constructor(private router: Router) {
    this.restoreTheme();
  }

  onRouteActivated(){this.routeEntered.set(false);requestAnimationFrame(()=>this.routeEntered.set(true));}

  private restoreTheme(){
    try {
      document.documentElement.classList.toggle('dark', localStorage.getItem('cv_creator_theme') === 'dark');
    } catch {
      document.documentElement.classList.remove('dark');
    }
  }
  isHiddenNavRoute(){const url=this.router.url.split('?')[0];return url==='/login'||url==='/register'||url.startsWith('/admin');}
}
