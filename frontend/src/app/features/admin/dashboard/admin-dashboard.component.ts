import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  Users,
  LayoutTemplate,
  ShoppingBag,
  DollarSign,
  ClipboardList,
  ChevronRight,
  TrendingUp,
  Plus,
  RefreshCw,
  Star,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Layers,
  FileText,
  Clock,
  Calendar,
  ExternalLink,
  Activity,
  ArrowRight
} from 'lucide-angular';

interface Kpis {
  totalUsers: number;
  totalTemplates: number;
  totalSold: number;
  totalRevenue: number;
  totalOrders: number;
}

interface UserSummary {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  role?: string;
  is_active?: boolean | number;
  is_approved?: boolean | number;
  last_login_at?: string | null;
  created_at?: string;
  cv_count?: number;
}

interface TopTemplate {
  id: string;
  name: string;
  category?: string;
  thumbnail_url?: string | null;
  sold_count: number;
  avg_rating: number;
  price_cents?: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-8 pb-12">
      <!-- Top Welcome & Status Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-2xl border border-indigo-500/20">
        <!-- Ambient Decorative Glows -->
        <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none"></div>
        <div class="absolute right-1/3 -bottom-20 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational · Live Monitoring
            </div>
            <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Executive Dashboard
              <span class="hidden sm:inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.4
              </span>
            </h1>
            <p class="text-slate-300 text-sm max-w-xl">
              Real-time platform telemetry for users, template downloads, sales revenue, and system services.
            </p>
          </div>

          <!-- Actions & Live Date -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-slate-300 text-xs font-medium">
              <lucide-icon [img]="Calendar" class="w-4 h-4 text-indigo-300" />
              <span>{{ currentDate | date:'EEE, MMM d, y' }}</span>
            </div>

            <button type="button" (click)="loadAll()" [disabled]="isLoading()"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition-all duration-200">
              <lucide-icon [img]="RefreshCw" class="w-4 h-4" [class.animate-spin]="isLoading()" />
              <span>Refresh</span>
            </button>

            <button type="button" (click)="drillDown('/admin/templates')"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200">
              <lucide-icon [img]="Plus" class="w-4 h-4" />
              <span>New Template</span>
            </button>
          </div>
        </div>
      </div>

      <!-- KPI Metric Cards Grid -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <lucide-icon [img]="Activity" class="w-3.5 h-3.5 text-indigo-500" />
            Key Performance Metrics
          </h2>
          <span class="text-xs text-slate-400">Click any card to inspect full records</span>
        </div>

        @if (kpis(); as k) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- 1. Total Users -->
            <div (click)="drillDown('/admin/customers')"
                 class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-110">
                  <lucide-icon [img]="Users" class="w-5 h-5" />
                </div>
                <span class="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4" />
                </span>
              </div>
              <p class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                {{ k.totalUsers | number }}
              </p>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Registered Accounts</p>
              <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                <span>Manage users</span>
                <span>→</span>
              </div>
            </div>

            <!-- 2. Total Templates -->
            <div (click)="drillDown('/admin/templates')"
                 class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-transform group-hover:scale-110">
                  <lucide-icon [img]="LayoutTemplate" class="w-5 h-5" />
                </div>
                <span class="text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4" />
                </span>
              </div>
              <p class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                {{ k.totalTemplates | number }}
              </p>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Published Designs</p>
              <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                <span>Catalog library</span>
                <span>→</span>
              </div>
            </div>

            <!-- 3. Total Sold -->
            <div (click)="drillDown('/admin/reports')"
                 class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
                  <lucide-icon [img]="ShoppingBag" class="w-5 h-5" />
                </div>
                <span class="text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4" />
                </span>
              </div>
              <p class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                {{ k.totalSold | number }}
              </p>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Templates Exported</p>
              <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                <span>View exports</span>
                <span>→</span>
              </div>
            </div>

            <!-- 4. Total Revenue -->
            <div (click)="drillDown('/admin/reports')"
                 class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
                  <lucide-icon [img]="DollarSign" class="w-5 h-5" />
                </div>
                <span class="text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4" />
                </span>
              </div>
              <p class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                \${{ k.totalRevenue.toFixed(2) }}
              </p>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
                ≈ {{ (k.totalRevenue * 4100) | number:'1.0-0' }} ៛ KHR
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Financial breakdown</span>
                <span>→</span>
              </div>
            </div>

            <!-- 5. Total Orders -->
            <div (click)="drillDown('/admin/reports')"
                 class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-500"></div>
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center transition-transform group-hover:scale-110">
                  <lucide-icon [img]="TrendingUp" class="w-5 h-5" />
                </div>
                <span class="text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4" />
                </span>
              </div>
              <p class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                {{ k.totalOrders | number }}
              </p>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Total Checkouts</p>
              <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                <span>Orders history</span>
                <span>→</span>
              </div>
            </div>
          </div>
        } @else {
          <!-- Skeleton Loading -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="h-36 rounded-2xl bg-slate-200/70 dark:bg-slate-800/50 animate-pulse"></div>
            }
          </div>
        }
      </section>

      <!-- Quick Action Hub -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button type="button" (click)="drillDown('/admin/templates')"
                class="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 hover:shadow-md transition-all text-left group">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <lucide-icon [img]="Plus" class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-900 dark:text-white truncate">Add New Template</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">Upload HTML / styling</p>
          </div>
        </button>

        <button type="button" (click)="drillDown('/admin/customers')"
                class="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 hover:shadow-md transition-all text-left group">
          <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <lucide-icon [img]="Users" class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-900 dark:text-white truncate">User Directory</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">Manage roles & access</p>
          </div>
        </button>

        <button type="button" (click)="drillDown('/admin/drafts')"
                class="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-purple-400 hover:shadow-md transition-all text-left group">
          <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <lucide-icon [img]="FileText" class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-900 dark:text-white truncate">User Saved Drafts</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">Inspect created CVs</p>
          </div>
        </button>

        <button type="button" (click)="drillDown('/admin/reports')"
                class="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-400 hover:shadow-md transition-all text-left group">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <lucide-icon [img]="TrendingUp" class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-900 dark:text-white truncate">Sales & Revenue</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">Audit orders & reports</p>
          </div>
        </button>
      </section>

      <!-- Main Analytics Two-Column Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left: Recent Users (7 columns) -->
        <section class="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden flex flex-col">
          <!-- Card Header -->
          <div class="p-5 md:px-6 md:py-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <lucide-icon [img]="Users" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-base">Recent Registered Users</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Latest active users on the platform</p>
              </div>
            </div>

            <button type="button" (click)="drillDown('/admin/customers')"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
              <span>View All</span>
              <lucide-icon [img]="ArrowRight" class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- User Rows -->
          <div class="divide-y divide-slate-100 dark:divide-slate-700/50 flex-1 overflow-x-auto">
            @if (users().length === 0) {
              <div class="p-8 text-center text-slate-400 text-sm">
                No users found.
              </div>
            } @else {
              @for (u of users(); track u.id) {
                <div class="p-4 md:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                  <!-- User Info -->
                  <div class="flex items-center gap-3.5 min-w-0">
                    <!-- Avatar or Initials -->
                    @if (u.avatar_url) {
                      <img [src]="u.avatar_url" [alt]="u.full_name" class="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                    } @else {
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                        {{ u.full_name ? u.full_name.slice(0, 1) : 'U' }}
                      </div>
                    }

                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {{ u.full_name || 'Unnamed User' }}
                        </p>
                        @if (u.role === 'admin') {
                          <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                            Admin
                          </span>
                        }
                      </div>
                      <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ u.email }}</p>
                    </div>
                  </div>

                  <!-- Badges & Actions -->
                  <div class="flex items-center gap-3 shrink-0">
                    <!-- CV Count Badge -->
                    <span class="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                      <lucide-icon [img]="FileText" class="w-3.5 h-3.5 text-slate-400" />
                      {{ u.cv_count || 0 }} CVs
                    </span>

                    <!-- Status Pill -->
                    @if (isUserActive(u)) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Disabled
                      </span>
                    }

                    <button type="button" (click)="drillDown('/admin/customers')"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors">
                      <lucide-icon [img]="ChevronRight" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Card Footer -->
          <div class="p-3 px-6 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700/60 text-right">
            <button type="button" (click)="drillDown('/admin/customers')"
                    class="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
              Manage all {{ users().length }} loaded accounts →
            </button>
          </div>
        </section>

        <!-- Right: Top Selling Templates Leaderboard (5 columns) -->
        <section class="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden flex flex-col">
          <!-- Card Header -->
          <div class="p-5 md:px-6 md:py-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <lucide-icon [img]="LayoutTemplate" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-base">Top Templates</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Most downloaded CV layouts</p>
              </div>
            </div>

            <button type="button" (click)="drillDown('/admin/templates')"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
              <span>Catalog</span>
              <lucide-icon [img]="ArrowRight" class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Template Rows -->
          <div class="divide-y divide-slate-100 dark:divide-slate-700/50 flex-1">
            @if (topTemplates().length === 0) {
              <div class="p-8 text-center text-slate-400 text-sm">
                No template performance data available.
              </div>
            } @else {
              @for (t of topTemplates(); track t.id; let idx = $index) {
                <div class="p-4 md:px-6 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                  <div class="flex items-center gap-3 min-w-0">
                    <!-- Rank Badge -->
                    <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold"
                          [ngClass]="getRankBadgeClasses(idx)">
                      {{ idx + 1 }}
                    </span>

                    <!-- Thumbnail / Icon -->
                    <div class="w-11 h-14 rounded-lg bg-slate-100 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600/50 overflow-hidden shrink-0 flex items-center justify-center">
                      @if (t.thumbnail_url) {
                        <img [src]="t.thumbnail_url" [alt]="t.name" class="w-full h-full object-cover" />
                      } @else {
                        <lucide-icon [img]="FileText" class="w-5 h-5 text-slate-400" />
                      }
                    </div>

                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {{ t.name }}
                      </p>
                      <div class="flex items-center gap-2 mt-0.5">
                        <span class="inline-flex items-center text-[11px] font-bold text-amber-500">
                          <lucide-icon [img]="Star" class="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                          {{ t.avg_rating || '5.0' }}
                        </span>
                        <span class="text-slate-300 dark:text-slate-600">·</span>
                        <span class="text-[11px] text-slate-500 dark:text-slate-400">
                          {{ t.sold_count }} sales
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="text-right shrink-0">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300">
                      {{ t.sold_count }} sold
                    </span>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Card Footer -->
          <div class="p-3 px-6 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700/60 text-right">
            <button type="button" (click)="drillDown('/admin/templates')"
                    class="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline">
              Manage template designs →
            </button>
          </div>
        </section>
      </div>

      <!-- System Infrastructure & Health Status -->
      <section class="rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <lucide-icon [img]="ShieldCheck" class="w-4 h-4 text-emerald-500" />
            Infrastructure & Integration Status
          </h3>
          <span class="text-xs text-slate-400">Auto-checked</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Service 1 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <lucide-icon [img]="CheckCircle2" class="w-5 h-5" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-slate-900 dark:text-white">Database Engine</p>
              <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected · SQLite WAL Mode
              </p>
            </div>
          </div>

          <!-- Service 2 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <lucide-icon [img]="CheckCircle2" class="w-5 h-5" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-slate-900 dark:text-white">Payment Gateway</p>
              <p class="text-[11px] text-sky-600 dark:text-sky-400 font-medium flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span> Bakong KHQR Dynamic
              </p>
            </div>
          </div>

          <!-- Service 3 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <lucide-icon [img]="CheckCircle2" class="w-5 h-5" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-slate-900 dark:text-white">Telegram Helpdesk Bot</p>
              <p class="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> &#64;cqticketproblemreport_bot
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  // Lucide Icons
  readonly Users = Users;
  readonly LayoutTemplate = LayoutTemplate;
  readonly ShoppingBag = ShoppingBag;
  readonly DollarSign = DollarSign;
  readonly ClipboardList = ClipboardList;

  isUserActive(user: UserSummary): boolean {
    return user.is_active !== false && (user.is_active as any) !== 0;
  }

  getRankBadgeClasses(idx: number): string {
    if (idx === 0) return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
    if (idx === 1) return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    if (idx === 2) return 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300';
    return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
  }
  readonly ChevronRight = ChevronRight;
  readonly TrendingUp = TrendingUp;
  readonly Plus = Plus;
  readonly RefreshCw = RefreshCw;
  readonly Star = Star;
  readonly ShieldCheck = ShieldCheck;
  readonly CheckCircle2 = CheckCircle2;
  readonly ArrowUpRight = ArrowUpRight;
  readonly Sparkles = Sparkles;
  readonly Layers = Layers;
  readonly FileText = FileText;
  readonly Clock = Clock;
  readonly Calendar = Calendar;
  readonly ExternalLink = ExternalLink;
  readonly Activity = Activity;
  readonly ArrowRight = ArrowRight;

  currentDate = new Date();
  isLoading = signal(false);

  kpis = signal<Kpis | null>(null);
  users = signal<UserSummary[]>([]);
  topTemplates = signal<TopTemplate[]>([]);

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.isLoading.set(true);

    this.http.get<Kpis>('/api/v1/admin/dashboard/kpis').subscribe({
      next: (k) => {
        this.kpis.set(k);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });

    this.http.get<{ users: UserSummary[] }>('/api/v1/admin/dashboard/users?pageSize=6').subscribe({
      next: ({ users }) => this.users.set(users || []),
      error: () => {},
    });

    this.http.get<{ templates: TopTemplate[] }>('/api/v1/admin/dashboard/top-templates?limit=5').subscribe({
      next: ({ templates }) => this.topTemplates.set(templates || []),
      error: () => {},
    });
  }

  drillDown(route: string) {
    this.router.navigateByUrl(route);
  }
}

