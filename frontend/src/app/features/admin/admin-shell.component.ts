import { Component, ElementRef, HostListener, ViewChild, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  LayoutDashboard,
  Users,
  LayoutTemplate,
  Settings,
  LogOut,
  Shield,
  UserCircle,
  Menu,
  X,
  ShieldCheck,
  FileText,
  TrendingUp,
  FileSpreadsheet,
  DollarSign,
  ExternalLink,
  Bell,
  Command,
  ChevronDown,
  Sparkles,
  ChevronRight,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

interface SearchOption {
  path: string;
  label: string;
  icon: any;
  category: string;
  hint: string;
}

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet, LucideAngularModule],
  styles: [`
    @keyframes searchSpin {
      0% {
        transform: rotate(0deg) scale(1);
      }
      50% {
        transform: rotate(180deg) scale(1.25);
      }
      100% {
        transform: rotate(360deg) scale(1);
      }
    }

    .rotate-spin-once {
      animation: searchSpin 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes pulseGlow {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.1); }
    }

    .status-pulse {
      animation: pulseGlow 2s ease-in-out infinite;
    }

    .sidebar-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .sidebar-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .sidebar-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.2);
      border-radius: 9999px;
    }
    .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(99, 102, 241, 0.4);
    }
  `],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex text-slate-800 dark:text-slate-100">

      <!-- Mobile overlay -->
      @if (mobileOpen()) {
        <div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden" (click)="mobileOpen.set(false)"></div>
      }

      <!-- Left sidebar -->
      <aside class="fixed md:sticky top-0 left-0 z-50 md:z-auto h-screen shrink-0 flex flex-col justify-between
                    bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-800/80
                    shadow-[1px_0_20px_rgba(0,0,0,0.03)] transition-[width,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
             [class.-translate-x-full]="!mobileOpen()"
             [class.translate-x-0]="mobileOpen()"
             [class.md:translate-x-0]="true"
             [ngClass]="sidebarCollapsed() ? 'w-[264px] md:w-[78px]' : 'w-[264px]'">

        <!-- TOP: Brand Header & Navigation -->
        <div class="flex-1 flex flex-col min-h-0">

          <!-- BRAND HEADER -->
          @if (!sidebarCollapsed()) {
            <div class="flex items-center justify-between px-4 py-4 border-b border-slate-100/90 dark:border-slate-800/80">
              <a routerLink="/admin/dashboard" (click)="mobileOpen.set(false)" class="flex items-center gap-3 min-w-0 group cursor-pointer">
                <div class="relative shrink-0">
                  <div class="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/20 group-hover:scale-105 transition-transform duration-200">
                    CV
                  </div>
                  <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 status-pulse"></span>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <p class="font-bold text-slate-900 dark:text-white text-sm tracking-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">CQ Professional</p>
                    <span class="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/30">PRO</span>
                  </div>
                  <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Administration</p>
                </div>
              </a>

              <!-- Desktop Collapse Toggle Button -->
              <button
                type="button"
                (click)="sidebarCollapsed.set(true)"
                title="Collapse sidebar (⌘B)"
                class="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all duration-200">
                <lucide-icon [img]="PanelLeftClose" class="w-4 h-4" />
              </button>

              <!-- Mobile Close Button -->
              <button
                type="button"
                (click)="mobileOpen.set(false)"
                title="Close menu"
                class="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                <lucide-icon [img]="X" class="w-4 h-4" />
              </button>
            </div>
          } @else {
            <div class="flex flex-col items-center py-4 border-b border-slate-100/90 dark:border-slate-800/80 gap-3">
              <a routerLink="/admin/dashboard" title="CQ Professional Dashboard" class="relative group cursor-pointer">
                <div class="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/20 group-hover:scale-105 transition-transform duration-200">
                  CV
                </div>
                <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 status-pulse"></span>
              </a>
              <button
                type="button"
                (click)="sidebarCollapsed.set(false)"
                title="Expand sidebar (⌘B)"
                class="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all duration-200">
                <lucide-icon [img]="PanelLeftOpen" class="w-4 h-4" />
              </button>
            </div>
          }

          <!-- NAVIGATION ITEMS SCROLLABLE CONTAINER -->
          <nav class="flex-1 overflow-y-auto p-3 space-y-4 select-none sidebar-scrollbar">
            
            <!-- MAIN SECTION -->
            <div>
              @if (!sidebarCollapsed()) {
                <div class="flex items-center justify-between px-3 mb-2">
                  <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Main Menu</p>
                </div>
              } @else {
                <div class="h-px bg-slate-200/70 dark:bg-slate-800 my-2 mx-2"></div>
              }

              <div class="space-y-1">
                @for (item of mainNav; track item.path) {
                  @if (!sidebarCollapsed()) {
                    <!-- Expanded item -->
                    <a [routerLink]="item.path"
                       routerLinkActive
                       #rla="routerLinkActive"
                       (click)="mobileOpen.set(false)"
                       class="group relative flex items-center justify-between px-3 py-2.5 rounded-2xl text-[13px] font-medium transition-all duration-200 ease-out"
                       [ngClass]="rla.isActive ? 
                         'bg-gradient-to-r from-indigo-500/12 via-indigo-500/6 to-transparent dark:from-indigo-500/20 dark:via-indigo-500/10 dark:to-transparent text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs' : 
                         'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 hover:translate-x-1'">
                      
                      <!-- Left active indicator bar with glow -->
                      @if (rla.isActive) {
                        <span class="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-indigo-500 via-indigo-600 to-purple-600 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.6)]"></span>
                      }

                      <div class="flex items-center gap-3 min-w-0">
                        <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                             [ngClass]="rla.isActive ? 
                               'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 scale-105' : 
                               'bg-slate-100/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110'">
                          <lucide-icon [img]="item.icon" class="w-4 h-4 transition-transform duration-200" />
                        </div>
                        <span class="truncate transition-colors">{{ item.label }}</span>
                      </div>

                      @if (item.badge) {
                        <span class="px-2 py-0.5 text-[10px] font-bold rounded-full transition-all"
                              [ngClass]="rla.isActive ? 
                                'bg-indigo-600 text-white shadow-xs' : 
                                'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'">
                          {{ item.badge }}
                        </span>
                      } @else if (rla.isActive) {
                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_6px_#6366f1] animate-pulse"></span>
                      } @else {
                        <lucide-icon [img]="ChevronRight" class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                      }
                    </a>
                  } @else {
                    <!-- Collapsed item -->
                    <a [routerLink]="item.path"
                       routerLinkActive
                       #rla="routerLinkActive"
                       [title]="item.label"
                       (click)="mobileOpen.set(false)"
                       class="group relative flex items-center justify-center w-11 h-11 mx-auto rounded-2xl transition-all duration-200 ease-out"
                       [ngClass]="rla.isActive ? 
                         'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 scale-105' : 
                         'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-105'">
                      <lucide-icon [img]="item.icon" class="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                      @if (rla.isActive) {
                        <span class="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                      }
                      @if (item.badge) {
                        <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                      }
                    </a>
                  }
                }
              </div>
            </div>

            <!-- ACCOUNT SECTION -->
            <div>
              @if (!sidebarCollapsed()) {
                <div class="flex items-center justify-between px-3 mb-2">
                  <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Account & Settings</p>
                </div>
              } @else {
                <div class="h-px bg-slate-200/70 dark:bg-slate-800 my-2 mx-2"></div>
              }

              <div class="space-y-1">
                @for (item of accountNav; track item.path) {
                  @if (!sidebarCollapsed()) {
                    <!-- Expanded item -->
                    <a [routerLink]="item.path"
                       routerLinkActive
                       #rla="routerLinkActive"
                       (click)="mobileOpen.set(false)"
                       class="group relative flex items-center justify-between px-3 py-2.5 rounded-2xl text-[13px] font-medium transition-all duration-200 ease-out"
                       [ngClass]="rla.isActive ? 
                         'bg-gradient-to-r from-indigo-500/12 via-indigo-500/6 to-transparent dark:from-indigo-500/20 dark:via-indigo-500/10 dark:to-transparent text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs' : 
                         'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 hover:translate-x-1'">
                      
                      @if (rla.isActive) {
                        <span class="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-indigo-500 via-indigo-600 to-purple-600 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.6)]"></span>
                      }

                      <div class="flex items-center gap-3 min-w-0">
                        <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                             [ngClass]="rla.isActive ? 
                               'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 scale-105' : 
                               'bg-slate-100/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110'">
                          <lucide-icon [img]="item.icon" class="w-4 h-4 transition-transform duration-200" />
                        </div>
                        <span class="truncate transition-colors">{{ item.label }}</span>
                      </div>

                      @if (rla.isActive) {
                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_6px_#6366f1] animate-pulse"></span>
                      } @else {
                        <lucide-icon [img]="ChevronRight" class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                      }
                    </a>
                  } @else {
                    <!-- Collapsed item -->
                    <a [routerLink]="item.path"
                       routerLinkActive
                       #rla="routerLinkActive"
                       [title]="item.label"
                       (click)="mobileOpen.set(false)"
                       class="group relative flex items-center justify-center w-11 h-11 mx-auto rounded-2xl transition-all duration-200 ease-out"
                       [ngClass]="rla.isActive ? 
                         'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 scale-105' : 
                         'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-105'">
                      <lucide-icon [img]="item.icon" class="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                      @if (rla.isActive) {
                        <span class="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                      }
                    </a>
                  }
                }
              </div>
            </div>

          </nav>
        </div>

        <!-- BOTTOM: System Status & User Card / Logout -->
        @if (!sidebarCollapsed()) {
          <div class="p-3 border-t border-slate-100/90 dark:border-slate-800/80 space-y-2.5">
            <!-- Systems Online Pill -->
            <div class="px-3 py-1.5 rounded-xl bg-emerald-500/8 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 status-pulse"></span>
                <span>System Operational</span>
              </div>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">v2.4</span>
            </div>

            <!-- Admin Profile Mini-Card -->
            <div class="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-800">
              <a routerLink="/admin/profile" class="flex items-center gap-2.5 min-w-0 flex-1 group" (click)="mobileOpen.set(false)">
                <div class="relative shrink-0">
                  <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                    {{ (auth.currentUser()?.fullName || 'A')[0].toUpperCase() }}
                  </div>
                  <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                </div>
                <div class="min-w-0 flex-1 text-left">
                  <p class="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {{ auth.currentUser()?.fullName || 'Administrator' }}
                  </p>
                  <p class="text-[10px] text-slate-400 dark:text-slate-500 truncate font-medium">
                    {{ auth.currentUser()?.role || 'Admin' }}
                  </p>
                </div>
              </a>

              <!-- Quick Logout Button -->
              <button
                type="button"
                (click)="auth.logout()"
                title="Sign Out"
                class="p-2 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95 transition-all duration-200 shrink-0">
                <lucide-icon [img]="LogOut" class="w-4 h-4" />
              </button>
            </div>
          </div>
        } @else {
          <!-- Collapsed Footer -->
          <div class="p-2 border-t border-slate-100/90 dark:border-slate-800/80 flex flex-col items-center gap-2">
            <a routerLink="/admin/profile" [title]="auth.currentUser()?.fullName || 'Profile'" class="relative group cursor-pointer" (click)="mobileOpen.set(false)">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md hover:scale-105 transition-transform">
                {{ (auth.currentUser()?.fullName || 'A')[0].toUpperCase() }}
              </div>
              <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
            </a>
            <button
              type="button"
              (click)="auth.logout()"
              title="Sign Out"
              class="p-2.5 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95 transition-all duration-200">
              <lucide-icon [img]="LogOut" class="w-4 h-4" />
            </button>
          </div>
        }

      </aside>

      <!-- Main content column -->
      <div class="flex-1 flex flex-col min-w-0">

        <!-- MODERN ANIMATED HEADER -->
        <header class="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-7 py-3
                       bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl
                       border-b border-slate-200/80 dark:border-slate-800 shadow-xs
                       transition-all duration-300">
          
          <!-- Left side: Mobile menu & Desktop toggle & Breadcrumb / Status badge -->
          <div class="flex items-center gap-2.5">
            <!-- Mobile Hamburger -->
            <button
              type="button"
              (click)="mobileOpen.set(!mobileOpen())"
              title="Toggle mobile menu"
              class="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200">
              <lucide-icon [img]="mobileOpen() ? X : Menu" class="w-5 h-5" />
            </button>

            <!-- Desktop Sidebar Toggle Button -->
            <button
              type="button"
              (click)="sidebarCollapsed.set(!sidebarCollapsed())"
              [title]="sidebarCollapsed() ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'"
              class="hidden md:flex p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200">
              <lucide-icon [img]="sidebarCollapsed() ? PanelLeftOpen : PanelLeftClose" class="w-4 h-4" />
            </button>

            <!-- Subtle Workspace Badge (hidden on extra small screens) -->
            <div class="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span class="w-2 h-2 rounded-full bg-emerald-500 status-pulse"></span>
              <span class="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Admin Control</span>
            </div>
          </div>

          <!-- Middle: ULTRA-MODERN ANIMATED SEARCH BAR -->
          <div class="flex-1 max-w-md mx-2 relative" #searchContainer>
            <div
              class="relative flex items-center rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 transition-all duration-300 ease-out"
              [ngClass]="searchFocused() ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-4 ring-indigo-500/15 shadow-lg shadow-indigo-500/10 scale-[1.02]' : ''">
              
              <!-- ROTATING SEARCH BUTTON / ICON -->
              <button
                type="button"
                (click)="triggerSearchRotate()"
                title="Search (⌘K)"
                class="pl-3.5 pr-2 py-2.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none flex items-center justify-center transition-colors">
                <lucide-icon
                  [img]="Search"
                  class="w-4 h-4 transition-all duration-500 ease-out"
                  [ngClass]="searchFocused() ? 'text-indigo-600 dark:text-indigo-400 scale-110' : ''"
                  [class.rotate-spin-once]="isSearchSpinning()" />
              </button>

              <!-- INPUT FIELD -->
              <input
                #searchInput
                type="text"
                [ngModel]="searchQuery()"
                (ngModelChange)="searchQuery.set($event)"
                (focus)="onSearchFocus()"
                (blur)="onSearchBlur()"
                (keydown)="onSearchKeydown($event)"
                placeholder="Search menus, drafts, reports, users..."
                class="w-full py-2 text-xs md:text-sm bg-transparent border-0 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-medium" />

              <!-- Clear Query (X) Button -->
              @if (searchQuery().length > 0) {
                <button
                  type="button"
                  (mousedown)="$event.preventDefault()"
                  (click)="searchQuery.set(''); searchInput.focus()"
                  title="Clear search"
                  class="p-1.5 mr-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors">
                  <lucide-icon [img]="X" class="w-3.5 h-3.5" />
                </button>
              }

              <!-- Shortcut Hint Badge ⌘K -->
              <div class="pr-3 hidden sm:flex items-center pointer-events-none">
                <kbd class="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-md shadow-2xs font-mono">
                  ⌘K
                </kbd>
              </div>
            </div>

            <!-- SEARCH QUICK JUMP POPUP / COMMAND PALETTE -->
            @if (searchFocused()) {
              <div
                class="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn"
                (mousedown)="$event.preventDefault()">
                
                <div class="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span class="flex items-center gap-1.5">
                    <lucide-icon [img]="Sparkles" class="w-3.5 h-3.5 text-indigo-500" />
                    <span>Quick Navigation &amp; Features</span>
                  </span>
                  <span class="text-[10px] font-mono text-slate-400">esc to close</span>
                </div>

                <div class="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
                  @for (item of filteredSearchOptions(); track item.path) {
                    <a
                      [routerLink]="item.path"
                      (click)="closeSearch()"
                      class="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors group">
                      <div class="flex items-center gap-2.5">
                        <div class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 text-slate-500 dark:text-slate-400 transition-colors">
                          <lucide-icon [img]="item.icon" class="w-4 h-4" />
                        </div>
                        <div>
                          <p class="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                            {{ item.label }}
                          </p>
                          <p class="text-[10px] text-slate-400 dark:text-slate-500">
                            {{ item.hint }}
                          </p>
                        </div>
                      </div>
                      <lucide-icon [img]="ChevronRight" class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                    </a>
                  } @empty {
                    <div class="p-4 text-center text-xs text-slate-400">
                      No matching admin menu found for "{{ searchQuery() }}"
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Right side: Quick Action Buttons & Profile Avatar -->
          <div class="flex items-center gap-2 sm:gap-3">
            
            <!-- Live Website Link -->
            <a
              routerLink="/"
              target="_blank"
              title="Open public website in new tab"
              class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all duration-200 hover:scale-102 active:scale-98 shadow-2xs">
              <lucide-icon [img]="ExternalLink" class="w-3.5 h-3.5 text-slate-400" />
              <span>Live Site</span>
            </a>

            <!-- Notification Bell Icon Button -->
            <button
              type="button"
              routerLink="/admin/security"
              title="System audit & security logs"
              class="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200">
              <lucide-icon [img]="Bell" class="w-4 h-4" />
              <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900"></span>
            </button>

            <!-- Subtle vertical divider -->
            <div class="h-6 w-px bg-slate-200 dark:border-slate-800"></div>

            <!-- ADMIN AVATAR & DROPDOWN PILL -->
            <div class="relative">
              <button
                type="button"
                (click)="profileMenuOpen.set(!profileMenuOpen())"
                class="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all duration-200 group">
                
                <div class="text-right hidden sm:block pl-1">
                  <p class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {{ auth.currentUser()?.fullName || 'Admin' }}
                  </p>
                  <p class="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 leading-tight">
                    Administrator
                  </p>
                </div>

                <!-- Avatar circle with animated gradient ring -->
                <div class="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition-all group-hover:scale-105">
                  {{ auth.currentUser()?.fullName?.slice(0,1) || 'A' }}
                </div>

                <lucide-icon
                  [img]="ChevronDown"
                  class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 hidden sm:block"
                  [class.rotate-180]="profileMenuOpen()" />
              </button>

              <!-- Profile Dropdown Menu -->
              @if (profileMenuOpen()) {
                <div
                  class="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-fadeIn"
                  (mousedown)="$event.preventDefault()">
                  
                  <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p class="text-xs font-bold text-slate-800 dark:text-white truncate">
                      {{ auth.currentUser()?.fullName || 'Administrator' }}
                    </p>
                    <p class="text-[11px] text-slate-400 truncate">
                      {{ auth.currentUser()?.email || 'admin@cvcreator.com' }}
                    </p>
                  </div>

                  <div class="py-1 space-y-0.5">
                    <a
                      routerLink="/admin/profile"
                      (click)="profileMenuOpen.set(false)"
                      class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <lucide-icon [img]="UserCircle" class="w-4 h-4 text-slate-400" />
                      <span>Admin Profile</span>
                    </a>
                    
                    <a
                      routerLink="/admin/settings"
                      (click)="profileMenuOpen.set(false)"
                      class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <lucide-icon [img]="Settings" class="w-4 h-4 text-slate-400" />
                      <span>Settings &amp; System</span>
                    </a>
                  </div>

                  <div class="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      (click)="profileMenuOpen.set(false); auth.logout()"
                      class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <lucide-icon [img]="LogOut" class="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              }
            </div>

          </div>

        </header>

        <!-- Main Workspace -->
        <main class="flex-1 p-4 md:p-6 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminShellComponent {
  private router = inject(Router);

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('searchContainer') searchContainerRef?: ElementRef<HTMLElement>;

  // Lucide Icons
  readonly Search = Search;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;
  readonly FileText = FileText;
  readonly ExternalLink = ExternalLink;
  readonly Bell = Bell;
  readonly Command = Command;
  readonly ChevronDown = ChevronDown;
  readonly Sparkles = Sparkles;
  readonly ChevronRight = ChevronRight;
  readonly UserCircle = UserCircle;
  readonly Settings = Settings;
  readonly PanelLeftClose = PanelLeftClose;
  readonly PanelLeftOpen = PanelLeftOpen;
  readonly ChevronLeft = ChevronLeft;

  sidebarCollapsed = signal(false);
  mobileOpen = signal(false);
  profileMenuOpen = signal(false);

  // Search animation signals
  searchQuery = signal('');
  searchFocused = signal(false);
  isSearchSpinning = signal(false);

  readonly mainNav = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: '' },
    { path: '/admin/analytics', label: 'Analytics', icon: TrendingUp, badge: 'Live' },
    { path: '/admin/reports', label: 'Reports', icon: FileSpreadsheet, badge: 'Export' },
    { path: '/admin/customers', label: 'Users', icon: Users, badge: '' },
    { path: '/admin/drafts', label: 'Saved Drafts', icon: FileText, badge: '' },
    { path: '/admin/templates', label: 'Templates', icon: LayoutTemplate, badge: '' },
    { path: '/admin/pricing', label: 'Pricing', icon: DollarSign, badge: '' },
    { path: '/admin/permission', label: 'Permission', icon: ShieldCheck, badge: '' },
    { path: '/admin/security', label: 'Security', icon: Shield, badge: '' },
  ];

  readonly accountNav = [
    { path: '/admin/profile', label: 'Profile', icon: UserCircle, badge: '' },
    { path: '/admin/settings', label: 'Settings', icon: Settings, badge: '' },
  ];

  // All searchable options across the admin platform
  readonly searchOptions: SearchOption[] = [
    { path: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, category: 'Pages', hint: 'Platform metrics, KPIs & quick stats' },
    { path: '/admin/analytics', label: 'Live Financial Analytics', icon: TrendingUp, category: 'Analytics', hint: 'Real-time iOS charts, morning/evening money' },
    { path: '/admin/reports', label: 'Financial Reports & Exports', icon: FileSpreadsheet, category: 'Reports', hint: 'Export all PDF, PowerPoint PPTX & Excel' },
    { path: '/admin/pricing', label: 'Homepage Pricing Control', icon: DollarSign, category: 'Settings', hint: 'Edit Cover Letter ($1), CV ($4), Bundle ($8)' },
    { path: '/admin/customers', label: 'Registered Users', icon: Users, category: 'Users', hint: 'Customer management, approval & accounts' },
    { path: '/admin/drafts', label: 'User Saved Drafts', icon: FileText, category: 'Drafts', hint: 'Inspect drafts, preview, download single/ZIP' },
    { path: '/admin/templates', label: 'CV Templates Gallery', icon: LayoutTemplate, category: 'Templates', hint: 'Manage 15+ templates, categories & ratings' },
    { path: '/admin/permission', label: 'Roles & Permissions', icon: ShieldCheck, category: 'Access', hint: 'Staff approval & privilege management' },
    { path: '/admin/security', label: 'Security Audit & Logs', icon: Shield, category: 'Security', hint: 'Activity log, IP tracking & access records' },
    { path: '/admin/profile', label: 'Administrator Profile', icon: UserCircle, category: 'Account', hint: 'Edit personal avatar, bio and credentials' },
    { path: '/admin/settings', label: 'System Configuration', icon: Settings, category: 'Settings', hint: 'Maintenance mode, currency & system keys' },
  ];

  filteredSearchOptions = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.searchOptions.slice(0, 7);
    return this.searchOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.hint.toLowerCase().includes(q) ||
        opt.category.toLowerCase().includes(q) ||
        opt.path.toLowerCase().includes(q)
    );
  });

  constructor(public auth: AuthService) {}

  // Trigger search icon 360-degree rotation animation
  triggerSearchRotate() {
    this.isSearchSpinning.set(true);
    setTimeout(() => {
      this.isSearchSpinning.set(false);
    }, 650);

    if (this.searchInputRef) {
      this.searchInputRef.nativeElement.focus();
    }
  }

  onSearchFocus() {
    this.searchFocused.set(true);
    this.triggerSearchRotate();
  }

  onSearchBlur() {
    // Delay closing so clicks on popup register
    setTimeout(() => {
      this.searchFocused.set(false);
    }, 200);
  }

  closeSearch() {
    this.searchFocused.set(false);
    this.searchQuery.set('');
  }

  onSearchKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.closeSearch();
      this.searchInputRef?.nativeElement.blur();
    } else if (e.key === 'Enter') {
      const results = this.filteredSearchOptions();
      if (results.length > 0) {
        this.router.navigateByUrl(results[0].path);
        this.closeSearch();
        this.searchInputRef?.nativeElement.blur();
      }
    }
  }

  // Keyboard shortcut listener (⌘K for search, ⌘B for sidebar toggle)
  @HostListener('window:keydown', ['$event'])
  handleGlobalShortcut(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.triggerSearchRotate();
      this.searchFocused.set(true);
      this.searchInputRef?.nativeElement.focus();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      this.sidebarCollapsed.set(!this.sidebarCollapsed());
    }
  }

  // Close dropdowns on outside click
  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.profileMenuOpen.set(false);
    }
  }
}
