import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideAngularModule, Search, LayoutDashboard, Users, LayoutTemplate,
  BarChart3, Settings, Info, LogOut,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-sky-50 dark:bg-[#0F172A] flex">

      <!-- Left sidebar -->
      <aside class="w-64 shrink-0 hidden md:flex flex-col justify-between p-4
                    bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                    border-r border-white/40 dark:border-sky-500/20">
        <nav class="space-y-1">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="bg-sky-100/80 dark:bg-sky-500/20"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      text-slate-700 dark:text-sky-100 hover:scale-[1.02] active:scale-95
                      transition-all duration-300 ease-in-out">
              <lucide-icon [img]="item.icon" class="w-4 h-4" /> {{ item.label }}
            </a>
          }
        </nav>

        <button type="button" (click)="auth.logout()"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                       text-red-500 hover:scale-[1.02] active:scale-95
                       transition-all duration-300 ease-in-out">
          <lucide-icon [img]="LogOut" class="w-4 h-4" /> Logout
        </button>
      </aside>

      <div class="flex-1 flex flex-col min-w-0">
        <!-- Top nav -->
        <header class="sticky top-0 z-30 flex items-center gap-4 px-6 py-3
                       bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                       border-b border-white/40 dark:border-sky-500/20">
          <div class="flex items-center gap-2 font-semibold text-slate-800 dark:text-sky-100">
            <span class="h-8 w-8 rounded-xl bg-sky-600 dark:bg-sky-400 flex items-center justify-center text-white text-sm font-bold">CV</span>
            Admin
          </div>

          <div class="flex-1 flex items-center gap-2 max-w-xl">
            <input placeholder="Search users, templates, orders..."
                   class="w-full px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/70
                          border border-sky-200 dark:border-sky-500/30
                          focus:outline-none focus:ring-2 focus:ring-sky-500
                          transition-all duration-300 ease-in-out" />
            <button class="p-2 rounded-xl bg-sky-700 text-white hover:scale-105 active:scale-95
                           transition-all duration-300 ease-in-out">
              <lucide-icon [img]="Search" class="w-4 h-4" />
            </button>
          </div>

          <div class="relative group">
            <img [src]="auth.currentUser()?.avatarUrl || '/assets/default-avatar.png'" alt=""
                 class="h-9 w-9 rounded-full object-cover cursor-pointer" />
            <div class="absolute right-0 mt-2 w-40 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md
                        border border-white/40 dark:border-sky-500/20 shadow-lg opacity-0 invisible
                        group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
              <a routerLink="/admin/settings" class="block px-4 py-2 text-sm hover:bg-sky-50 dark:hover:bg-sky-500/10">Settings</a>
              <a routerLink="/admin/dashboard" class="block px-4 py-2 text-sm hover:bg-sky-50 dark:hover:bg-sky-500/10">Layout</a>
              <a routerLink="/admin/about" class="block px-4 py-2 text-sm hover:bg-sky-50 dark:hover:bg-sky-500/10">About</a>
            </div>
          </div>
        </header>

        <main class="flex-1 p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminShellComponent {
  readonly Search = Search;
  readonly LogOut = LogOut;

  readonly navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/templates', label: 'Templates', icon: LayoutTemplate },
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
    { path: '/admin/about', label: 'About', icon: Info },
  ];

  constructor(public auth: AuthService) {}
}
