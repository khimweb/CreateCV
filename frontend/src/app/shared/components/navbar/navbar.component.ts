import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeSwitcherComponent],
  template: `
    <header class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(94vw,1100px)]">
      <nav
        class="flex items-center justify-between gap-4 px-5 py-3 rounded-2xl
               bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
               border border-white/40 dark:border-sky-500/20
               shadow-[0_8px_32px_rgba(2,132,199,0.12)]
               transition-all duration-300 ease-in-out"
      >
        <a routerLink="/" class="flex items-center gap-2 font-semibold text-slate-800 dark:text-sky-100">
          <span class="h-8 w-8 rounded-xl bg-sky-600 dark:bg-sky-400 flex items-center justify-center text-white text-sm font-bold">CV</span>
          CV Creator
        </a>

        <div class="hidden md:flex items-center gap-1">
          <a routerLink="/" routerLinkActive="bg-sky-100/80 dark:bg-sky-500/20" [routerLinkActiveOptions]="{exact: true}"
             class="px-3 py-1.5 rounded-xl text-sm font-medium text-slate-700 dark:text-sky-100 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">Home</a>
          <a routerLink="/templates" routerLinkActive="bg-sky-100/80 dark:bg-sky-500/20"
             class="px-3 py-1.5 rounded-xl text-sm font-medium text-slate-700 dark:text-sky-100
                    hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">Templates</a>
          <a routerLink="/my-cv" routerLinkActive="bg-sky-100/80 dark:bg-sky-500/20"
             class="px-3 py-1.5 rounded-xl text-sm font-medium text-slate-700 dark:text-sky-100
                    hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">My CV</a>
          <a routerLink="/about" routerLinkActive="bg-sky-100/80 dark:bg-sky-500/20"
             class="px-3 py-1.5 rounded-xl text-sm font-medium text-slate-700 dark:text-sky-100
                    hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">About</a>
          <a routerLink="/contact" routerLinkActive="bg-sky-100/80 dark:bg-sky-500/20"
             class="px-3 py-1.5 rounded-xl text-sm font-medium text-slate-700 dark:text-sky-100
                    hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">Contact</a>
        </div>

        <div class="flex items-center gap-3">
          <app-theme-switcher />

          @if (auth.currentUser(); as user) {
            <button class="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl
                           bg-sky-50/80 dark:bg-slate-800/70 hover:scale-105 active:scale-95
                           transition-all duration-300 ease-in-out">
              <img [src]="user.avatarUrl || '/assets/default-avatar.png'" alt=""
                   class="h-7 w-7 rounded-full object-cover" />
              <span class="text-sm text-slate-700 dark:text-sky-100">{{ user.fullName }}</span>
            </button>
          } @else {
            <a routerLink="/login"
               class="px-4 py-2 rounded-xl bg-sky-700 dark:bg-sky-600 text-white text-sm font-medium
                      shadow-md hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">
              Log in
            </a>
          }
        </div>
      </nav>
    </header>
  `,
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
