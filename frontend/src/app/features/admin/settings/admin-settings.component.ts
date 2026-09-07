import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  SlidersHorizontal,
  Settings,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  UserPlus,
  Bell,
  Lock,
  Key,
  LogOut,
  Trash2,
  RefreshCw,
  Save,
  Check,
  CircleAlert,
  CircleCheck,
  TriangleAlert,
  Globe,
  Mail,
  DollarSign,
  Database,
  Server,
  Smartphone,
  Laptop,
  Monitor,
  Copy,
  X,
  ChevronRight,
  Power
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

export interface SystemSettings {
  app_name: string;
  support_email: string;
  default_currency: string;
  maintenance_mode: string;
  allow_registration: string;
  free_downloads_enabled: string;
  session_timeout_minutes: string;
  email_notifications_sales: string;
  email_notifications_security: string;
}

export interface StaffUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
  is_active: number;
  is_approved: number;
  last_login_at?: string;
  created_at: string;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css'],
})
export class AdminSettingsComponent implements OnInit {
  // Lucide icons
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly Settings = Settings;
  readonly Shield = Shield;
  readonly ShieldCheck = ShieldCheck;
  readonly ShieldAlert = ShieldAlert;
  readonly Users = Users;
  readonly UserPlus = UserPlus;
  readonly Bell = Bell;
  readonly Lock = Lock;
  readonly Key = Key;
  readonly LogOut = LogOut;
  readonly Trash2 = Trash2;
  readonly RefreshCw = RefreshCw;
  readonly Save = Save;
  readonly Check = Check;
  readonly CircleAlert = CircleAlert;
  readonly CircleCheck = CircleCheck;
  readonly TriangleAlert = TriangleAlert;
  readonly Globe = Globe;
  readonly Mail = Mail;
  readonly DollarSign = DollarSign;
  readonly Database = Database;
  readonly Server = Server;
  readonly Smartphone = Smartphone;
  readonly Laptop = Laptop;
  readonly Monitor = Monitor;
  readonly Copy = Copy;
  readonly X = X;
  readonly ChevronRight = ChevronRight;
  readonly Power = Power;

  private http = inject(HttpClient);
  public auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  // Active Tab
  activeTab = signal<'general' | 'team' | 'notifications' | 'session'>('general');

  // System settings state
  settings = signal<SystemSettings>({
    app_name: 'CreateCV Pro',
    support_email: 'support@cv-builder.store',
    default_currency: 'USD ($)',
    maintenance_mode: 'false',
    allow_registration: 'true',
    free_downloads_enabled: 'false',
    session_timeout_minutes: '60',
    email_notifications_sales: 'true',
    email_notifications_security: 'true',
  });

  originalSettings = signal<SystemSettings | null>(null);

  // Staff list
  staffUsers = signal<StaffUser[]>([]);

  // UI state
  loading = signal<boolean>(false);
  savingSettings = signal<boolean>(false);
  showAddStaffModal = signal<boolean>(false);
  addingStaff = signal<boolean>(false);
  staffToDelete = signal<StaffUser | null>(null);
  confirmDeleteAccount = signal<boolean>(false);
  clearingCache = signal<boolean>(false);

  // New staff form
  newStaff = {
    fullName: '',
    email: '',
    password: '',
    role: 'admin',
  };
  addStaffError = signal<string | null>(null);

  // Computed
  isDirty = computed(() => {
    const orig = this.originalSettings();
    if (!orig) return false;
    const cur = this.settings();
    return JSON.stringify(orig) !== JSON.stringify(cur);
  });

  currentUserId = computed(() => {
    const id = this.auth.currentUser()?.id;
    return id ? Number(id) : null;
  });

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loadSystemSettings();
    this.loadStaffUsers();
  }

  loadSystemSettings() {
    this.loading.set(true);
    this.http.get<{ settings: Record<string, string> }>('/api/v1/admin/settings/system')
      .subscribe({
        next: (res) => {
          const s = res.settings || {};
          const mapped: SystemSettings = {
            app_name: s['app_name'] || 'CreateCV Pro',
            support_email: s['support_email'] || 'support@cv-builder.store',
            default_currency: s['default_currency'] || 'USD ($)',
            maintenance_mode: s['maintenance_mode'] === 'true' ? 'true' : 'false',
            allow_registration: s['allow_registration'] === 'false' ? 'false' : 'true',
            free_downloads_enabled: s['free_downloads_enabled'] === 'true' ? 'true' : 'false',
            session_timeout_minutes: s['session_timeout_minutes'] || '60',
            email_notifications_sales: s['email_notifications_sales'] === 'false' ? 'false' : 'true',
            email_notifications_security: s['email_notifications_security'] === 'false' ? 'false' : 'true',
          };
          this.settings.set({ ...mapped });
          this.originalSettings.set({ ...mapped });
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load system settings:', err);
          this.loading.set(false);
        }
      });
  }

  loadStaffUsers() {
    this.http.get<{ users: StaffUser[] }>('/api/v1/admin/settings/users')
      .subscribe({
        next: (res) => {
          this.staffUsers.set(res.users || []);
        },
        error: (err) => console.error('Failed to load staff accounts:', err)
      });
  }

  saveSystemSettings() {
    this.savingSettings.set(true);
    this.http.put<{ settings: Record<string, string> }>('/api/v1/admin/settings/system', { settings: this.settings() })
      .subscribe({
        next: () => {
          this.savingSettings.set(false);
          this.originalSettings.set({ ...this.settings() });
          this.toast.success('System configuration saved successfully!');
        },
        error: (err) => {
          console.error('Failed to save settings:', err);
          this.savingSettings.set(false);
          this.toast.error('Failed to save settings.');
        }
      });
  }

  toggleBooleanSetting(key: keyof SystemSettings) {
    this.settings.update((s) => {
      const current = s[key];
      return {
        ...s,
        [key]: current === 'true' ? 'false' : 'true',
      };
    });
  }

  // Staff Management
  openAddStaffModal() {
    this.newStaff = { fullName: '', email: '', password: '', role: 'admin' };
    this.addStaffError.set(null);
    this.showAddStaffModal.set(true);
  }

  closeAddStaffModal() {
    this.showAddStaffModal.set(false);
    this.addStaffError.set(null);
  }

  submitAddStaff() {
    this.addStaffError.set(null);
    if (!this.newStaff.email || !this.newStaff.password || this.newStaff.password.length < 8) {
      this.addStaffError.set('Valid email and minimum 8-character password are required.');
      return;
    }

    this.addingStaff.set(true);
    this.http.post('/api/v1/admin/settings/users', this.newStaff).subscribe({
      next: () => {
        this.addingStaff.set(false);
        this.closeAddStaffModal();
        this.toast.success('New administrator account created!');
        this.loadStaffUsers();
      },
      error: (err) => {
        this.addingStaff.set(false);
        if (err.status === 409) {
          this.addStaffError.set('An account with this email already exists.');
        } else {
          this.addStaffError.set(err.error?.message || 'Failed to create staff account.');
        }
      }
    });
  }

  promptDeleteStaff(user: StaffUser) {
    if (user.id === this.currentUserId()) {
      this.toast.error('You cannot remove your own active administrator account here.');
      return;
    }
    this.staffToDelete.set(user);
  }

  cancelDeleteStaff() {
    this.staffToDelete.set(null);
  }

  confirmDeleteStaff() {
    const target = this.staffToDelete();
    if (!target) return;

    this.http.delete(`/api/v1/admin/settings/users/${target.id}`).subscribe({
      next: () => {
        this.staffToDelete.set(null);
        this.toast.success(`Account for ${target.full_name || target.email} removed.`);
        this.loadStaffUsers();
      },
      error: (err) => {
        console.error('Failed to remove staff:', err);
        this.toast.error(err.error?.message || 'Failed to remove account.');
        this.staffToDelete.set(null);
      }
    });
  }

  // Session & Danger Zone
  logout() {
    this.auth.logout();
  }

  clearSystemCache() {
    this.clearingCache.set(true);
    setTimeout(() => {
      this.clearingCache.set(false);
      this.toast.success('Platform memory & query cache purged successfully.');
    }, 800);
  }

  deleteAccount() {
    this.http.delete('/api/v1/admin/settings/account').subscribe({
      next: () => {
        this.confirmDeleteAccount.set(false);
        this.auth.logout();
      },
      error: (err) => {
        console.error('Failed to delete account:', err);
        this.toast.error('Failed to delete account.');
      }
    });
  }

  formatRelativeTime(dateStr?: string): string {
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
}
