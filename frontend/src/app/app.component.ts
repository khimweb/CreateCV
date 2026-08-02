import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-sky-50 dark:bg-[#0F172A] text-slate-800 dark:text-sky-100
                transition-colors duration-300 ease-in-out">
      @if (!isAuthRoute()) {
        <app-navbar />
      }
      <main>
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {
  constructor(private router: Router) {}

  isAuthRoute() {
    return this.router.url.split('?')[0] === '/login' || this.router.url.split('?')[0] === '/register';
  }
}
