import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Search, ShieldCheck, ShieldX } from 'lucide-angular';
import { ToastService } from '../../../shared/components/toast/toast.service';

interface UserPermission {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  avatar_url: string | null;
}

@Component({
  selector: 'app-admin-permission',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Permissions</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Control which users can use CV templates</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <p class="text-2xl font-bold text-slate-800 dark:text-white">{{ users().length }}</p>
        <p class="text-xs text-slate-400 mt-1">Total Users</p>
      </div>
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <p class="text-2xl font-bold text-emerald-600">{{ approvedCount() }}</p>
        <p class="text-xs text-slate-400 mt-1">Approved</p>
      </div>
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <p class="text-2xl font-bold text-orange-500">{{ pendingCount() }}</p>
        <p class="text-xs text-slate-400 mt-1">Pending</p>
      </div>
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <p class="text-2xl font-bold text-indigo-600">{{ adminCount() }}</p>
        <p class="text-xs text-slate-400 mt-1">Admins (auto-approved)</p>
      </div>
    </div>

    <!-- Search -->
    <div class="relative mb-5 max-w-md">
      <lucide-icon [img]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Search users..."
             class="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200
                    dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>

    <!-- User list -->
    <div class="rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="text-left px-5 py-3 font-medium">User</th>
              <th class="text-left px-5 py-3 font-medium">Role</th>
              <th class="text-left px-5 py-3 font-medium">Joined</th>
              <th class="text-left px-5 py-3 font-medium">Permission</th>
              <th class="text-right px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (u of users(); track u.id) {
              <tr class="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold overflow-hidden">
                      @if (u.avatar_url) {
                        <img [src]="u.avatar_url" alt="" class="w-full h-full object-cover" />
                      } @else {
                        {{ u.full_name.slice(0,1) }}
                      }
                    </div>
                    <div>
                      <p class="font-medium text-slate-800 dark:text-white">{{ u.full_name }}</p>
                      <p class="text-xs text-slate-400">{{ u.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3">
                  <span class="px-2 py-0.5 rounded text-xs font-medium"
                        [ngClass]="{ 'bg-purple-100 text-purple-700': u.role === 'admin', 'bg-slate-100 text-slate-600': u.role !== 'admin' }">
                    {{ u.role }}
                  </span>
                </td>
                <td class="px-5 py-3 text-xs text-slate-400">{{ u.created_at | date:'mediumDate' }}</td>
                <td class="px-5 py-3">
                  @if (u.role === 'admin') {
                    <span class="inline-flex items-center gap-1 text-xs font-medium text-purple-600">
                      <lucide-icon [img]="ShieldCheck" class="w-3.5 h-3.5" /> Auto-approved
                    </span>
                  } @else if (u.is_approved) {
                    <span class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <lucide-icon [img]="ShieldCheck" class="w-3.5 h-3.5" /> Approved
                    </span>
                  } @else {
                    <span class="inline-flex items-center gap-1 text-xs font-medium text-orange-500">
                      <lucide-icon [img]="ShieldX" class="w-3.5 h-3.5" /> Pending
                    </span>
                  }
                </td>
                <td class="px-5 py-3 text-right">
                  @if (u.role !== 'admin') {
                    <button type="button" (click)="toggleApproval(u)"
                            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                            [ngClass]="{
                              'bg-orange-50 text-orange-600 hover:bg-orange-100': u.is_approved,
                              'bg-emerald-50 text-emerald-600 hover:bg-emerald-100': !u.is_approved
                            }">
                      {{ u.is_approved ? 'Revoke' : 'Approve' }}
                    </button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminPermissionComponent implements OnInit {
  readonly Search = Search;
  readonly ShieldCheck = ShieldCheck;
  readonly ShieldX = ShieldX;

  users = signal<UserPermission[]>([]);
  search = '';

  approvedCount = signal(0);
  pendingCount = signal(0);
  adminCount = signal(0);

  constructor(private http: HttpClient, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  load() {
    this.http.get<{ users: UserPermission[] }>('/api/v1/admin/customers', { params: { search: this.search, pageSize: '100' } })
      .subscribe(({ users }) => {
        this.users.set(users);
        this.approvedCount.set(users.filter(u => u.is_approved && u.role !== 'admin').length);
        this.pendingCount.set(users.filter(u => !u.is_approved && u.role !== 'admin').length);
        this.adminCount.set(users.filter(u => u.role === 'admin').length);
      });
  }

  toggleApproval(u: UserPermission) {
    this.http.patch(`/api/v1/admin/customers/${u.id}`, { isApproved: !u.is_approved }).subscribe({
      next: () => {
        this.toast.success(u.is_approved ? `${u.full_name} access revoked` : `${u.full_name} approved!`);
        this.load();
      },
      error: () => this.toast.error('Failed to update permission'),
    });
  }
}
