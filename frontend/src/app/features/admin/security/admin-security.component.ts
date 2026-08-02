import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Search, Trash2, Shield, Wifi, WifiOff } from 'lucide-angular';

interface ActivityLog {
  id: number;
  user_id: number;
  email: string;
  full_name: string;
  action: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  is_active: boolean;
}

interface OnlineUser {
  id: number;
  full_name: string;
  email: string;
  last_login_at: string;
  is_online: number;
}

@Component({
  selector: 'app-admin-security',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Security</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor user activity and login history</p>
      </div>
    </div>

    <!-- Online Users Section -->
    <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 mb-6 shadow-sm">
      <h2 class="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <lucide-icon [img]="Wifi" class="w-4 h-4 text-emerald-500" /> User Status
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        @for (u of onlineUsers(); track u.id) {
          <div class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div class="relative">
              <div class="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {{ u.full_name?.slice(0,1) }}
              </div>
              <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800"
                    [class.bg-emerald-500]="u.is_online" [class.bg-slate-300]="!u.is_online"></span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{{ u.full_name }}</p>
              <p class="text-[11px] flex items-center gap-1"
                 [class.text-emerald-500]="u.is_online" [class.text-slate-400]="!u.is_online">
                @if (u.is_online) {
                  <lucide-icon [img]="Wifi" class="w-3 h-3" /> Online
                } @else {
                  <lucide-icon [img]="WifiOff" class="w-3 h-3" /> Offline
                }
              </p>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Activity Log Section -->
    <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3">
        <h2 class="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <lucide-icon [img]="Shield" class="w-4 h-4 text-indigo-500" /> Activity Log
        </h2>
        <div class="flex-1"></div>
        <select [(ngModel)]="actionFilter" (ngModelChange)="loadLogs()"
                class="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
          <option value="">All actions</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="register">Register</option>
          <option value="login_failed">Failed Login</option>
        </select>
        <div class="relative">
          <lucide-icon [img]="Search" class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input [(ngModel)]="searchLog" (ngModelChange)="loadLogs()" placeholder="Search..."
                 class="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs w-40
                        focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
            <tr>
              <th class="text-left px-5 py-3 font-medium text-xs">User</th>
              <th class="text-left px-5 py-3 font-medium text-xs">Action</th>
              <th class="text-left px-5 py-3 font-medium text-xs">IP Address</th>
              <th class="text-left px-5 py-3 font-medium text-xs">Date & Time</th>
              <th class="text-right px-5 py-3 font-medium text-xs"></th>
            </tr>
          </thead>
          <tbody>
            @for (log of logs(); track log.id) {
              <tr class="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                <td class="px-5 py-3">
                  <div>
                    <p class="text-slate-700 dark:text-slate-200 text-xs font-medium">{{ log.full_name || 'Unknown' }}</p>
                    <p class="text-[11px] text-slate-400">{{ log.email }}</p>
                  </div>
                </td>
                <td class="px-5 py-3">
                  <span class="px-2 py-0.5 rounded text-[11px] font-medium"
                        [ngClass]="{
                          'bg-emerald-50 text-emerald-600': log.action === 'login',
                          'bg-slate-100 text-slate-500': log.action === 'logout',
                          'bg-blue-50 text-blue-600': log.action === 'register',
                          'bg-red-50 text-red-500': log.action === 'login_failed'
                        }">
                    {{ log.action === 'login_failed' ? 'Failed' : log.action }}
                  </span>
                </td>
                <td class="px-5 py-3 text-xs text-slate-400 font-mono">{{ log.ip_address || '—' }}</td>
                <td class="px-5 py-3 text-xs text-slate-400">{{ log.created_at }}</td>
                <td class="px-5 py-3 text-right">
                  <button type="button" (click)="deleteLog(log.id)"
                          class="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors">
                    <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            }
            @if (logs().length === 0) {
              <tr>
                <td colspan="5" class="px-5 py-8 text-center text-sm text-slate-400">No activity logs found</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminSecurityComponent implements OnInit {
  readonly Search = Search;
  readonly Trash2 = Trash2;
  readonly Shield = Shield;
  readonly Wifi = Wifi;
  readonly WifiOff = WifiOff;

  logs = signal<ActivityLog[]>([]);
  onlineUsers = signal<OnlineUser[]>([]);
  searchLog = '';
  actionFilter = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLogs();
    this.loadOnlineUsers();
  }

  loadLogs() {
    this.http.get<{ logs: ActivityLog[] }>('/api/v1/admin/security/logs', {
      params: { search: this.searchLog, action: this.actionFilter },
    }).subscribe(({ logs }) => this.logs.set(logs));
  }

  loadOnlineUsers() {
    this.http.get<{ users: OnlineUser[] }>('/api/v1/admin/security/online-users')
      .subscribe(({ users }) => this.onlineUsers.set(users));
  }

  deleteLog(id: number) {
    this.http.delete(`/api/v1/admin/security/logs/${id}`).subscribe(() => this.loadLogs());
  }
}
