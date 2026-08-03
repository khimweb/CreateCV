import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideAngularModule, Search, LayoutDashboard, Users, LayoutTemplate,
  Settings, LogOut, Shield, UserCircle, Menu, X, ShieldCheck,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex">

      <!-- Mobile overlay -->
      @if (mobileOpen()) {
        <div class="fixed inset-0 z-40 bg-black/40 md:hidden" (click)="mobileOpen.set(false)"></div>
      }

      <!-- Left sidebar -->
      <aside class="fixed md:sticky top-0 left-0 z-50 md:z-auto w-[260px] h-screen shrink-0 flex flex-col justify-between
                    bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700
                    transform transition-transform duration-300 ease-in-out
                    md:translate-x-0"
             [class.-translate-x-full]="!mobileOpen()"
             [class.translate-x-0]="mobileOpen()">

        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800">
            <span class="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">CV</span>
            <div>
              <p class="font-bold text-slate-800 dark:text-white text-sm">CV Creator</p>
              <p class="text-[11px] text-slate-400 dark:text-slate-500">Admin Panel</p>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="mt-4 px-3 space-y-1">
            <p class="px-3 mb-2 text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">Main</p>
            @for (item of mainNav; track item.path) {
              <a [routerLink]="item.path" routerLinkActive="!bg-indigo-50 !dark:bg-indigo-500/10 !text-indigo-600 !dark:text-indigo-400"
                 (click)="mobileOpen.set(false)"
                 class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
                        text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
                        transition-all duration-200">
                <lucide-icon [img]="item.icon" class="w-[18px] h-[18px]" /> {{ item.label }}
              </a>
            }

            <p class="px-3 mt-5 mb-2 text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">Account</p>
            @for (item of accountNav; track item.path) {
              <a [routerLink]="item.path" routerLinkActive="!bg-indigo-50 !dark:bg-indigo-500/10 !text-indigo-600 !dark:text-indigo-400"
                 (click)="mobileOpen.set(false)"
                 class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
                        text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
                        transition-all duration-200">
                <lucide-icon [img]="item.icon" class="w-[18px] h-[18px]" /> {{ item.label }}
              </a>
            }
          </nav>
        </div>

        <!-- Logout -->
        <div class="px-3 pb-5">
          <button type="button" (click)="auth.logout()"
                  class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium
                         text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10
                         transition-all duration-200">
            <lucide-icon [img]="LogOut" class="w-[18px] h-[18px]" /> Logout
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Top bar -->
        <header class="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 py-3
                       bg-white/80 dark:bg-slate-900/80 backdrop-blur-md
                       border-b border-slate-200 dark:border-slate-700">
          <!-- Mobile menu button -->
          <button type="button" (click)="mobileOpen.set(!mobileOpen())" class="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <lucide-icon [img]="mobileOpen() ? X : Menu" class="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>

          <!-- Search -->
          <div class="flex-1 flex items-center gap-2 max-w-md">
            <div class="relative w-full">
              <lucide-icon [img]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input placeholder="Search..."
                     class="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800
                            border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900
                            text-sm focus:outline-none transition-all duration-200" />
            </div>
          </div>

          <!-- Admin avatar -->
          <div class="flex items-center gap-3 ml-auto">
            <div class="text-right hidden sm:block">
              <p class="text-xs font-medium text-slate-700 dark:text-slate-200">{{ auth.currentUser()?.fullName }}</p>
              <p class="text-[10px] text-slate-400">Administrator</p>
            </div>
            <div class="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow">
              {{ auth.currentUser()?.fullName?.slice(0,1) || 'A' }}
            </div>
          </div>
        </header>

        <main class="flex-1 p-4 md:p-6 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminShellComponent {
  readonly Search = Search;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;

  mobileOpen = signal(false);

  readonly mainNav = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/customers', label: 'Users', icon: Users },
    { path: '/admin/templates', label: 'Templates', icon: LayoutTemplate },
    { path: '/admin/permission', label: 'Permission', icon: ShieldCheck },
    { path: '/admin/security', label: 'Security', icon: Shield },
  ];

  readonly accountNav = [
    { path: '/admin/profile', label: 'Profile', icon: UserCircle },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  constructor(public auth: AuthService) {}
}
