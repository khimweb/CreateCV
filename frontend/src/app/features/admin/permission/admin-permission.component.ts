import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  Search,
  ShieldCheck,
  ShieldX,
  Shield,
  Users,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Grid,
  List,
  Check,
  X,
  Sparkles,
} from 'lucide-angular';
import { ToastService } from '../../../shared/components/toast/toast.service';

export interface UserPermission {
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
  templateUrl: './admin-permission.component.html',
  styleUrls: ['./admin-permission.component.css'],
})
export class AdminPermissionComponent implements OnInit {
  // Lucide Icons
  readonly Search = Search;
  readonly ShieldCheck = ShieldCheck;
  readonly ShieldX = ShieldX;
  readonly Shield = Shield;
  readonly Users = Users;
  readonly Clock = Clock;
  readonly CheckCircle2 = CheckCircle2;
  readonly Lock = Lock;
  readonly Unlock = Unlock;
  readonly RefreshCw = RefreshCw;
  readonly Grid = Grid;
  readonly List = List;
  readonly Check = Check;
  readonly X = X;
  readonly Sparkles = Sparkles;

  // State
  users = signal<UserPermission[]>([]);
  search = '';
  activeFilter = signal<'all' | 'approved' | 'pending' | 'admin'>('all');
  displayMode = signal<'table' | 'grid'>('table');
  loading = signal<boolean>(false);

  // Counts
  approvedCount = signal<number>(0);
  pendingCount = signal<number>(0);
  adminCount = signal<number>(0);

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.http
      .get<{ users: UserPermission[] }>('/api/v1/admin/customers', {
        params: { search: this.search.trim(), pageSize: '100' },
      })
      .subscribe({
        next: ({ users }) => {
          this.users.set(users || []);
          this.approvedCount.set((users || []).filter(u => u.is_approved && u.role !== 'admin').length);
          this.pendingCount.set((users || []).filter(u => !u.is_approved && u.role !== 'admin').length);
          this.adminCount.set((users || []).filter(u => u.role === 'admin').length);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.toast.error('Failed to load user permissions: ' + (err?.error?.message || 'Server error'));
        },
      });
  }

  // Filtered users computed based on active status filter
  filteredUsers = computed(() => {
    const list = this.users();
    const filter = this.activeFilter();

    switch (filter) {
      case 'approved':
        return list.filter(u => u.is_approved && u.role !== 'admin');
      case 'pending':
        return list.filter(u => !u.is_approved && u.role !== 'admin');
      case 'admin':
        return list.filter(u => u.role === 'admin');
      case 'all':
      default:
        return list;
    }
  });

  onSearchChange() {
    this.load();
  }

  clearSearch() {
    this.search = '';
    this.load();
  }

  setFilter(filter: 'all' | 'approved' | 'pending' | 'admin') {
    this.activeFilter.set(filter);
  }

  toggleApproval(u: UserPermission) {
    const targetApproved = !u.is_approved;
    this.http.patch(`/api/v1/admin/customers/${u.id}`, { isApproved: targetApproved }).subscribe({
      next: () => {
        this.toast.success(
          targetApproved
            ? `Granted template access to ${u.full_name || u.email}!`
            : `Revoked template access from ${u.full_name || u.email}.`
        );
        this.load();
      },
      error: () => this.toast.error('Failed to update permission.'),
    });
  }

  toggleActive(u: UserPermission) {
    const targetActive = !u.is_active;
    this.http.patch(`/api/v1/admin/customers/${u.id}`, { isActive: targetActive }).subscribe({
      next: () => {
        this.toast.success(
          targetActive
            ? `Activated account for ${u.full_name || u.email}`
            : `Suspended account for ${u.full_name || u.email}`
        );
        this.load();
      },
      error: () => this.toast.error('Failed to update account status.'),
    });
  }

  approveAllPending() {
    const pendingList = this.users().filter(u => !u.is_approved && u.role !== 'admin');
    if (pendingList.length === 0) return;

    if (!confirm(`Are you sure you want to approve all ${pendingList.length} pending users at once?`)) {
      return;
    }

    this.loading.set(true);
    const requests = pendingList.map(u =>
      this.http.patch(`/api/v1/admin/customers/${u.id}`, { isApproved: true }).toPromise()
    );

    Promise.all(requests)
      .then(() => {
        this.toast.success(`Successfully approved all ${pendingList.length} pending accounts!`);
        this.load();
      })
      .catch((err) => {
        this.toast.error('Some accounts could not be approved: ' + (err?.message || 'Error'));
        this.load();
      });
  }
}
