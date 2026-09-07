import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Wifi,
  WifiOff,
  Search,
  Trash2,
  RefreshCw,
  Filter,
  Clock,
  Monitor,
  Laptop,
  Smartphone,
  Globe,
  User,
  Users,
  CircleCheck,
  CircleAlert,
  TriangleAlert,
  Key,
  LogIn,
  LogOut,
  UserPlus,
  Download,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Sparkles,
  X,
  Eye,
  FileText,
  Activity,
  ArrowUpDown,
  CheckCheck
} from 'lucide-angular';
import { ToastService } from '../../../shared/components/toast/toast.service';

export interface ActivityLog {
  id: number;
  user_id: number;
  email: string;
  full_name?: string;
  role?: string;
  is_active?: boolean | number;
  action: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface OnlineUser {
  id: number;
  full_name: string;
  email: string;
  role?: string;
  is_active?: boolean | number;
  last_login_at: string;
  is_online: number;
}

export interface SecurityStats {
  total: number;
  logins: number;
  failed: number;
  registers: number;
  logouts: number;
  online: number;
}

export interface ParsedClient {
  browser: string;
  os: string;
  device: 'desktop' | 'mobile' | 'tablet' | 'bot';
}

@Component({
  selector: 'app-admin-security',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-security.component.html',
  styleUrls: ['./admin-security.component.css'],
})
export class AdminSecurityComponent implements OnInit, OnDestroy {
  // Lucide icon handles
  readonly Shield = Shield;
  readonly ShieldCheck = ShieldCheck;
  readonly ShieldAlert = ShieldAlert;
  readonly Wifi = Wifi;
  readonly WifiOff = WifiOff;
  readonly Search = Search;
  readonly Trash2 = Trash2;
  readonly RefreshCw = RefreshCw;
  readonly Filter = Filter;
  readonly Clock = Clock;
  readonly Monitor = Monitor;
  readonly Laptop = Laptop;
  readonly Smartphone = Smartphone;
  readonly Globe = Globe;
  readonly User = User;
  readonly Users = Users;
  readonly CircleCheck = CircleCheck;
  readonly CircleAlert = CircleAlert;
  readonly TriangleAlert = TriangleAlert;
  readonly Key = Key;
  readonly LogIn = LogIn;
  readonly LogOut = LogOut;
  readonly UserPlus = UserPlus;
  readonly Download = Download;
  readonly ExternalLink = ExternalLink;
  readonly Copy = Copy;
  readonly Check = Check;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly LayoutGrid = LayoutGrid;
  readonly List = List;
  readonly Sparkles = Sparkles;
  readonly X = X;
  readonly Eye = Eye;
  readonly FileText = FileText;
  readonly Activity = Activity;
  readonly ArrowUpDown = ArrowUpDown;
  readonly CheckCheck = CheckCheck;
  readonly Math = Math;

  private http = inject(HttpClient);
  private autoRefreshTimer: any = null;

  // State Signals
  logs = signal<ActivityLog[]>([]);
  totalLogs = signal<number>(0);
  onlineUsers = signal<OnlineUser[]>([]);
  stats = signal<SecurityStats>({
    total: 0,
    logins: 0,
    failed: 0,
    registers: 0,
    logouts: 0,
    online: 0,
  });

  loading = signal<boolean>(false);
  autoRefresh = signal<boolean>(true);

  // Filters & Pagination
  searchLog = signal<string>('');
  actionFilter = signal<string>(''); // '', 'login', 'login_failed', 'register', 'logout'
  selectedUser = signal<OnlineUser | null>(null);
  userStatusFilter = signal<'all' | 'online' | 'admin'>('all');
  viewMode = signal<'table' | 'cards'>('table');
  page = signal<number>(1);
  pageSize = signal<number>(25);

  // Interactivity state
  inspectingLog = signal<ActivityLog | null>(null);
  showClearConfirm = signal<boolean>(false);
  copiedIp = signal<string | null>(null);
  copiedUa = signal<boolean>(false);
  successToast = signal<string | null>(null);
  private toast = inject(ToastService);

  // Computed Values
  totalPages = computed(() => Math.max(1, Math.ceil(this.totalLogs() / this.pageSize())));

  filteredOnlineUsers = computed(() => {
    const list = this.onlineUsers();
    const filter = this.userStatusFilter();
    if (filter === 'online') {
      return list.filter((u) => u.is_online === 1);
    }
    if (filter === 'admin') {
      return list.filter((u) => u.role === 'admin');
    }
    return list;
  });

  onlineCount = computed(() => {
    return this.onlineUsers().filter((u) => u.is_online === 1).length;
  });

  loginSuccessRate = computed(() => {
    const total = this.stats().logins + this.stats().failed;
    if (!total) return 100;
    return Math.round((this.stats().logins / total) * 100);
  });

  ngOnInit() {
    this.loadAll();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  loadAll() {
    this.loadLogs();
    this.loadOnlineUsers();
  }

  loadLogs(isSilent = false) {
    if (!isSilent) this.loading.set(true);

    const params: any = {
      page: this.page(),
      pageSize: this.pageSize(),
      search: this.searchLog().trim(),
      action: this.actionFilter(),
    };

    if (this.selectedUser()) {
      params.userId = this.selectedUser()!.id;
    }

    this.http.get<{ logs: ActivityLog[]; total: number; stats?: SecurityStats }>('/api/v1/admin/security/logs', { params })
      .subscribe({
        next: (res) => {
          this.logs.set(res.logs || []);
          this.totalLogs.set(res.total || 0);
          if (res.stats) {
            this.stats.set(res.stats);
          }
          if (!isSilent) this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load security logs:', err);
          if (!isSilent) this.loading.set(false);
        }
      });
  }

  loadOnlineUsers() {
    this.http.get<{ users: OnlineUser[] }>('/api/v1/admin/security/online-users')
      .subscribe({
        next: (res) => {
          this.onlineUsers.set(res.users || []);
        },
        error: (err) => {
          console.error('Failed to load online users:', err);
        }
      });
  }

  startAutoRefresh() {
    this.stopAutoRefresh();
    if (this.autoRefresh()) {
      this.autoRefreshTimer = setInterval(() => {
        this.loadLogs(true);
        this.loadOnlineUsers();
      }, 15000);
    }
  }

  stopAutoRefresh() {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
    }
  }

  toggleAutoRefresh() {
    const next = !this.autoRefresh();
    this.autoRefresh.set(next);
    if (next) {
      this.startAutoRefresh();
      this.showToast('Auto-refresh enabled (15s)');
    } else {
      this.stopAutoRefresh();
      this.showToast('Auto-refresh paused');
    }
  }

  // Filter handlers
  setActionFilter(action: string) {
    this.actionFilter.set(action);
    this.page.set(1);
    this.loadLogs();
  }

  onSearchChange() {
    this.page.set(1);
    this.loadLogs();
  }

  clearSearch() {
    this.searchLog.set('');
    this.page.set(1);
    this.loadLogs();
  }

  filterByUser(u: OnlineUser) {
    if (this.selectedUser()?.id === u.id) {
      this.selectedUser.set(null);
    } else {
      this.selectedUser.set(u);
      this.showToast(`Filtering logs for ${u.full_name || u.email}`);
    }
    this.page.set(1);
    this.loadLogs();
  }

  clearUserFilter() {
    this.selectedUser.set(null);
    this.page.set(1);
    this.loadLogs();
  }

  setUserStatusFilter(tab: 'all' | 'online' | 'admin') {
    this.userStatusFilter.set(tab);
  }

  // Pagination
  goToPage(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadLogs();
  }

  setPageSize(size: number) {
    this.pageSize.set(size);
    this.page.set(1);
    this.loadLogs();
  }

  // Clipboard
  copyIp(ip: string, event?: Event) {
    if (event) event.stopPropagation();
    if (!ip) return;
    navigator.clipboard.writeText(ip).then(() => {
      this.copiedIp.set(ip);
      this.showToast(`IP copied: ${ip}`);
      setTimeout(() => {
        if (this.copiedIp() === ip) this.copiedIp.set(null);
      }, 2000);
    });
  }

  copyUserAgent(ua: string) {
    if (!ua) return;
    navigator.clipboard.writeText(ua).then(() => {
      this.copiedUa.set(true);
      this.showToast('User agent copied to clipboard');
      setTimeout(() => this.copiedUa.set(false), 2000);
    });
  }

  // Actions
  inspectLog(log: ActivityLog) {
    this.inspectingLog.set(log);
  }

  closeInspect() {
    this.inspectingLog.set(null);
    this.copiedUa.set(false);
  }

  deleteLog(id: number, event?: Event) {
    if (event) event.stopPropagation();
    if (!confirm('Are you sure you want to delete this security log entry?')) return;

    this.http.delete(`/api/v1/admin/security/logs/${id}`).subscribe({
      next: () => {
        this.showToast('Log entry deleted');
        if (this.inspectingLog()?.id === id) {
          this.closeInspect();
        }
        this.loadLogs();
      },
      error: (err) => console.error('Failed to delete log:', err)
    });
  }

  openClearConfirm() {
    this.showClearConfirm.set(true);
  }

  cancelClearConfirm() {
    this.showClearConfirm.set(false);
  }

  confirmClearAll() {
    this.http.delete('/api/v1/admin/security/logs').subscribe({
      next: () => {
        this.showClearConfirm.set(false);
        this.showToast('All activity logs cleared successfully');
        this.loadLogs();
      },
      error: (err) => {
        console.error('Failed to clear logs:', err);
        this.showClearConfirm.set(false);
      }
    });
  }

  // Export logs
  exportLogs(format: 'csv' | 'json') {
    const list = this.logs();
    if (!list.length) {
      this.toast.warning('No logs available to export.');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      const dataStr = JSON.stringify(list, null, 2);
      blob = new Blob([dataStr], { type: 'application/json' });
      filename = `security-audit-logs-${timestamp}.json`;
    } else {
      const headers = ['ID', 'User ID', 'User Name', 'Email', 'Role', 'Action', 'IP Address', 'User Agent', 'Date UTC'];
      const rows = list.map((l) => [
        l.id,
        l.user_id || '',
        `"${(l.full_name || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        l.role || '',
        l.action,
        `"${l.ip_address || ''}"`,
        `"${(l.user_agent || '').replace(/"/g, '""')}"`,
        `"${l.created_at || ''}"`,
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      filename = `security-audit-logs-${timestamp}.csv`;
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    this.showToast(`Exported ${list.length} records as ${format.toUpperCase()}`);
  }

  // Helpers
  parseUserAgent(ua: string): ParsedClient {
    if (!ua) return { browser: 'Unknown', os: 'Unknown OS', device: 'desktop' };

    let os = 'Unknown OS';
    if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    else if (ua.includes('Linux')) os = 'Linux';

    let browser = 'Unknown Browser';
    if (ua.includes('Edg/')) browser = 'Edge';
    else if (ua.includes('Chrome/') && !ua.includes('Edg/')) browser = 'Chrome';
    else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';
    else if (ua.includes('Firefox/')) browser = 'Firefox';
    else if (ua.includes('Postman')) browser = 'Postman';
    else if (ua.includes('curl/')) browser = 'cURL';

    let device: 'desktop' | 'mobile' | 'tablet' | 'bot' = 'desktop';
    if (ua.includes('Mobile') || ua.includes('iPhone') || ua.includes('Android')) device = 'mobile';
    else if (ua.includes('iPad') || ua.includes('Tablet')) device = 'tablet';
    else if (ua.includes('bot') || ua.includes('crawler')) device = 'bot';

    return { browser, os, device };
  }

  formatRelativeTime(dateStr: string): string {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr.replace(' ', 'T') + 'Z');
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0 || isNaN(diffMs)) return dateStr;

    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return 'Just now';
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  private showToast(msg: string) {
    this.toast.info(msg);
  }
}
