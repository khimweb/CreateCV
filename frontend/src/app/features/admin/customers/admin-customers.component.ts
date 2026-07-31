import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
}

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-slate-800 dark:text-sky-100">Customers</h1>
      <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Search by name or email"
             class="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/70 border border-sky-200
                    dark:border-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500
                    transition-all duration-300 ease-in-out w-72" />
    </div>

    <div class="rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                border border-white/40 dark:border-sky-500/20 shadow-md">
      <table class="w-full text-sm">
        <thead class="bg-sky-50/60 dark:bg-sky-500/10 text-slate-500 dark:text-sky-300">
          <tr>
            <th class="text-left px-5 py-3 font-medium">Name</th>
            <th class="text-left px-5 py-3 font-medium">Email</th>
            <th class="text-left px-5 py-3 font-medium">Role</th>
            <th class="text-left px-5 py-3 font-medium">Status</th>
            <th class="text-left px-5 py-3 font-medium">Last login</th>
            <th class="text-right px-5 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (u of users(); track u.id) {
            <tr class="border-t border-sky-100 dark:border-sky-500/10">
              <td class="px-5 py-3 text-slate-700 dark:text-sky-100">{{ u.full_name }}</td>
              <td class="px-5 py-3 text-slate-500 dark:text-sky-300">{{ u.email }}</td>
              <td class="px-5 py-3 capitalize">{{ u.role }}</td>
              <td class="px-5 py-3">
                <span class="px-2 py-1 rounded-lg text-xs"
                      [class.bg-emerald-100]="u.is_active" [class.text-emerald-700]="u.is_active"
                      [class.bg-red-100]="!u.is_active" [class.text-red-700]="!u.is_active">
                  {{ u.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-5 py-3 text-slate-400 dark:text-sky-400">{{ u.last_login_at || '—' }}</td>
              <td class="px-5 py-3 text-right">
                <button type="button" (click)="toggleActive(u)"
                        class="px-3 py-1.5 rounded-xl text-xs font-medium bg-sky-100/80 dark:bg-sky-500/20
                               text-sky-700 dark:text-sky-100 hover:scale-105 active:scale-95
                               transition-all duration-300 ease-in-out">
                  {{ u.is_active ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class AdminCustomersComponent implements OnInit {
  users = signal<AdminUser[]>([]);
  search = '';

  constructor(private http: HttpClient) {}

  ngOnInit() { this.load(); }

  load() {
    this.http.get<{ users: AdminUser[] }>('/api/v1/admin/customers', { params: { search: this.search } })
      .subscribe(({ users }) => this.users.set(users));
  }

  toggleActive(u: AdminUser) {
    this.http.patch(`/api/v1/admin/customers/${u.id}`, { isActive: !u.is_active }).subscribe(() => this.load());
  }
}
