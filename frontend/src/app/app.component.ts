import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { MobileBottomNavComponent } from './shared/components/mobile-bottom-nav/mobile-bottom-nav.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterOutlet, NavbarComponent, MobileBottomNavComponent, ToastComponent],
  template: `
    <div class="min-h-screen bg-sky-50 dark:bg-[#0F172A] text-slate-800 dark:text-sky-100 transition-colors duration-300 ease-in-out">
      @if (!isHiddenNavRoute()) {<app-navbar /><app-mobile-bottom-nav />}
      <main class="page-content"><router-outlet /></main>
    </div>
    <app-toast />
  `,
  styles: [`.page-content{animation:pageIn .3s cubic-bezier(.32,.72,0,1)}@media(max-width:720px){.page-content{padding-bottom:100px}}@keyframes pageIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`],
})
export class AppComponent {
  constructor(private router: Router) {}
  isHiddenNavRoute(){const url=this.router.url.split('?')[0];return url==='/login'||url==='/register'||url.startsWith('/admin');}
}
