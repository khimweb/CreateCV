import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Users, LayoutTemplate, ShoppingBag, DollarSign, ClipboardList, ChevronDown } from 'lucide-angular';

interface Kpis {
  totalUsers: number;
  totalTemplates: number;
  totalSold: number;
  totalRevenue: number;
  totalOrders: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <h1 class="text-2xl font-semibold text-slate-800 dark:text-sky-100 mb-6">Dashboard</h1>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      @if (kpis(); as k) {
        @for (card of cards(k); track card.label) {
          <button type="button" (click)="drillDown(card.route)"
                  class="text-left p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                         border border-white/40 dark:border-sky-500/20 shadow-md
                         hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">
            <lucide-icon [img]="card.icon" class="w-5 h-5 text-sky-600 dark:text-sky-400 mb-2" />
            <p class="text-2xl font-semibold text-slate-800 dark:text-sky-100">{{ card.value }}</p>
            <p class="text-xs text-slate-500 dark:text-sky-300">{{ card.label }}</p>
          </button>
        }
      }
    </div>

    <!-- Collapsible: All Users -->
    <div class="mb-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                border border-white/40 dark:border-sky-500/20 shadow-md overflow-hidden">
      <button type="button" (click)="usersOpen.set(!usersOpen())"
              class="w-full flex items-center justify-between px-5 py-4">
        <span class="font-medium text-slate-800 dark:text-sky-100">All Users</span>
        <lucide-icon [img]="ChevronDown" class="w-4 h-4 transition-transform duration-300"
                     [class.rotate-180]="usersOpen()" />
      </button>
      @if (usersOpen()) {
        <div class="px-5 pb-4 space-y-2">
          @for (u of users(); track u.id) {
            <div class="flex items-center justify-between text-sm py-2 border-t border-sky-100 dark:border-sky-500/10">
              <span class="text-slate-700 dark:text-sky-100">{{ u.full_name }}</span>
              <span class="text-slate-400 dark:text-sky-400">{{ u.email }}</span>
            </div>
          }
        </div>
      }
    </div>

    <!-- Collapsible: Top Selling Templates -->
    <div class="rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                border border-white/40 dark:border-sky-500/20 shadow-md overflow-hidden">
      <button type="button" (click)="topOpen.set(!topOpen())"
              class="w-full flex items-center justify-between px-5 py-4">
        <span class="font-medium text-slate-800 dark:text-sky-100">Top Selling Templates</span>
        <lucide-icon [img]="ChevronDown" class="w-4 h-4 transition-transform duration-300"
                     [class.rotate-180]="topOpen()" />
      </button>
      @if (topOpen()) {
        <div class="px-5 pb-4 space-y-2">
          @for (t of topTemplates(); track t.id) {
            <div class="flex items-center justify-between text-sm py-2 border-t border-sky-100 dark:border-sky-500/10">
              <span class="text-slate-700 dark:text-sky-100">{{ t.name }}</span>
              <span class="text-slate-400 dark:text-sky-400">{{ t.sold_count }} sold · {{ t.avg_rating }}★</span>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  readonly ChevronDown = ChevronDown;

  kpis = signal<Kpis | null>(null);
  users = signal<any[]>([]);
  topTemplates = signal<any[]>([]);
  usersOpen = signal(true);
  topOpen = signal(true);

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<Kpis>('/api/v1/admin/dashboard/kpis').subscribe((k) => this.kpis.set(k));
    this.http.get<{ users: any[] }>('/api/v1/admin/dashboard/users').subscribe(({ users }) => this.users.set(users));
    this.http.get<{ templates: any[] }>('/api/v1/admin/dashboard/top-templates').subscribe(({ templates }) => this.topTemplates.set(templates));
  }

  cards(k: Kpis) {
    return [
      { label: 'Total Users', value: k.totalUsers, icon: Users, route: '/admin/customers' },
      { label: 'Total Templates', value: k.totalTemplates, icon: LayoutTemplate, route: '/admin/templates' },
      { label: 'Total Sold', value: k.totalSold, icon: ShoppingBag, route: '/admin/reports' },
      { label: 'Total Revenue', value: '$' + k.totalRevenue.toFixed(2), icon: DollarSign, route: '/admin/reports' },
      { label: 'Total Orders', value: k.totalOrders, icon: ClipboardList, route: '/admin/reports' },
    ];
  }

  drillDown(route: string) {
    this.router.navigateByUrl(route);
  }
}
