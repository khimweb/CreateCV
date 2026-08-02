import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, UserPlus, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-angular';

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  cv_count: number;
}

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Users</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all registered users · {{ total() }} total</p>
      </div>
      <button type="button" (click)="showAddUser.set(true)"
              class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium
                     hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-sm">
        <lucide-icon [img]="UserPlus" class="w-4 h-4" /> Add User
      </button>
    </div>

    <!-- Search -->
    <div class="relative mb-5 max-w-md">
      <lucide-icon [img]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Search by name or email..."
             class="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200
                    dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                    transition-all duration-200" />
    </div>

    <!-- Table -->
    <div class="rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="text-left px-5 py-3 font-medium">User</th>
              <th class="text-left px-5 py-3 font-medium">Role</th>
              <th class="text-left px-5 py-3 font-medium">CVs</th>
              <th class="text-left px-5 py-3 font-medium">Status</th>
              <th class="text-left px-5 py-3 font-medium">Last Login</th>
              <th class="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (u of users(); track u.id) {
              <tr class="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                      {{ u.full_name?.slice(0,1) }}
                    </div>
                    <div>
                      <p class="font-medium text-slate-800 dark:text-white">{{ u.full_name }}</p>
                      <p class="text-xs text-slate-400">{{ u.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3">
                  <span class="px-2 py-0.5 rounded text-xs font-medium"
                        [ngClass]="{
                          'bg-purple-100 text-purple-700': u.role === 'admin',
                          'bg-slate-100 text-slate-600': u.role === 'user'
                        }">
                    {{ u.role }}
                  </span>
                </td>
                <td class="px-5 py-3">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                    {{ u.cv_count }} CVs
                  </span>
                </td>
                <td class="px-5 py-3">
                  <span class="inline-flex items-center gap-1.5 text-xs font-medium"
                        [class.text-emerald-600]="u.is_active" [class.text-red-500]="!u.is_active">
                    <span class="w-2 h-2 rounded-full" [class.bg-emerald-500]="u.is_active" [class.bg-red-400]="!u.is_active"></span>
                    {{ u.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-5 py-3 text-slate-400 dark:text-slate-500 text-xs">{{ u.last_login_at || 'Never' }}</td>
                <td class="px-5 py-3 text-right">
                  <div class="flex items-center gap-1 justify-end">
                    <button type="button" (click)="toggleActive(u)" [title]="u.is_active ? 'Deactivate' : 'Activate'"
                            class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <lucide-icon [img]="u.is_active ? ToggleRight : ToggleLeft"
                                   class="w-4 h-4" [class.text-emerald-500]="u.is_active" [class.text-slate-400]="!u.is_active" />
                    </button>
                    <button type="button" (click)="confirmRemove(u)"
                            class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-red-500">
                      <lucide-icon [img]="Trash2" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- iOS-style Alert: Remove User -->
    @if (alertUser(); as u) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
           (click)="alertUser.set(null)">
        <div class="w-full max-w-xs rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden animate-[slideUp_0.25s_ease-out]"
             (click)="$event.stopPropagation()">
          <div class="px-6 pt-6 pb-4 text-center">
            <p class="font-semibold text-slate-800 dark:text-white text-base">Remove User</p>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to remove <strong>{{ u.full_name }}</strong>? This action cannot be undone.
            </p>
          </div>
          <div class="border-t border-slate-200 dark:border-slate-700">
            <button type="button" (click)="removeUser(u)"
                    class="w-full py-3 text-red-500 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              Remove
            </button>
          </div>
          <div class="border-t border-slate-200 dark:border-slate-700">
            <button type="button" (click)="alertUser.set(null)"
                    class="w-full py-3 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    }

    <!-- iOS-style: Add User Modal -->
    @if (showAddUser()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
           (click)="showAddUser.set(false)">
        <div class="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden animate-[slideUp_0.25s_ease-out]"
             (click)="$event.stopPropagation()">
          <div class="px-6 pt-6 pb-2 text-center">
            <p class="font-semibold text-slate-800 dark:text-white text-base">Add New User</p>
          </div>
          <div class="px-6 py-4 space-y-3">
            <input [(ngModel)]="newUser.fullName" placeholder="Full Name"
                   class="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input [(ngModel)]="newUser.email" placeholder="Email"
                   class="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input [(ngModel)]="newUser.password" type="password" placeholder="Password (min 8 chars)"
                   class="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div class="border-t border-slate-200 dark:border-slate-700">
            <button type="button" (click)="createUser()"
                    class="w-full py-3 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
              Create
            </button>
          </div>
          <div class="border-t border-slate-200 dark:border-slate-700">
            <button type="button" (click)="showAddUser.set(false)"
                    class="w-full py-3 text-slate-500 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class AdminCustomersComponent implements OnInit {
  readonly UserPlus = UserPlus;
  readonly Trash2 = Trash2;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly Search = Search;

  users = signal<AdminUser[]>([]);
  total = signal(0);
  search = '';
  alertUser = signal<AdminUser | null>(null);
  showAddUser = signal(false);
  newUser = { fullName: '', email: '', password: '' };

  constructor(private http: HttpClient) {}

  ngOnInit() { this.load(); }

  load() {
    this.http.get<{ users: AdminUser[]; total: number }>('/api/v1/admin/customers', { params: { search: this.search } })
      .subscribe(({ users, total }) => { this.users.set(users); this.total.set(total); });
  }

  toggleActive(u: AdminUser) {
    this.http.patch(`/api/v1/admin/customers/${u.id}`, { isActive: !u.is_active }).subscribe(() => this.load());
  }

  confirmRemove(u: AdminUser) {
    this.alertUser.set(u);
  }

  removeUser(u: AdminUser) {
    this.http.delete(`/api/v1/admin/customers/${u.id}`).subscribe(() => {
      this.alertUser.set(null);
      this.load();
    });
  }

  createUser() {
    if (!this.newUser.fullName || !this.newUser.email || !this.newUser.password) return;
    this.http.post('/api/v1/admin/settings/users', this.newUser).subscribe(() => {
      this.showAddUser.set(false);
      this.newUser = { fullName: '', email: '', password: '' };
      this.load();
    });
  }
}
