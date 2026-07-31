import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';

const THEME_KEY = 'cv_creator_theme';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      type="button"
      (click)="toggle()"
      class="relative flex items-center w-16 h-9 rounded-full px-1
             bg-white/60 dark:bg-slate-800/60 backdrop-blur-md
             border border-sky-200/60 dark:border-sky-500/30
             shadow-sm transition-all duration-300 ease-in-out
             hover:scale-105 active:scale-95"
      [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <span
        class="absolute top-1 left-1 h-7 w-7 rounded-full
               bg-sky-600 dark:bg-sky-400 shadow-md
               flex items-center justify-center
               transition-transform duration-300 ease-in-out"
        [style.transform]="isDark() ? 'translateX(28px)' : 'translateX(0px)'"
      >
        <lucide-icon [img]="isDark() ? Moon : Sun" class="w-4 h-4 text-white" />
      </span>
    </button>
  `,
})
export class ThemeSwitcherComponent {
  readonly Sun = Sun;
  readonly Moon = Moon;

  isDark = signal<boolean>(this.readStoredTheme() === 'dark');

  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    });
  }

  toggle() {
    this.isDark.set(!this.isDark());
  }

  private readStoredTheme(): 'light' | 'dark' {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
