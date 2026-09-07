import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Camera,
  Save,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Key,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Image,
  Palette,
  Calendar,
  Layers,
  Activity,
  Smartphone,
  Laptop,
  Monitor,
  CircleAlert,
  CircleCheck,
  ChevronRight,
  X,
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

export interface AdminProfileModel {
  id?: number;
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  phone: string;
  jobTitle: string;
  location: string;
  timezone: string;
  themePreference: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalDrafts: number;
  totalLogins: number;
}

export interface AdminActivity {
  id: number;
  action: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent implements OnInit {
  // Lucide icon handles
  readonly Camera = Camera;
  readonly Save = Save;
  readonly Shield = Shield;
  readonly ShieldCheck = ShieldCheck;
  readonly ShieldAlert = ShieldAlert;
  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly Globe = Globe;
  readonly Clock = Clock;
  readonly Check = Check;
  readonly Copy = Copy;
  readonly ExternalLink = ExternalLink;
  readonly RefreshCw = RefreshCw;
  readonly Key = Key;
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Sparkles = Sparkles;
  readonly Image = Image;
  readonly Palette = Palette;
  readonly Calendar = Calendar;
  readonly Layers = Layers;
  readonly Activity = Activity;
  readonly Smartphone = Smartphone;
  readonly Laptop = Laptop;
  readonly Monitor = Monitor;
  readonly CircleAlert = CircleAlert;
  readonly CircleCheck = CircleCheck;
  readonly ChevronRight = ChevronRight;
  readonly X = X;

  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  // Active Tab
  activeTab = signal<'personal' | 'branding' | 'security' | 'activity'>('personal');

  // Profile data
  profile = signal<AdminProfileModel>({
    fullName: '',
    email: '',
    role: 'admin',
    avatarUrl: '',
    coverUrl: '',
    bio: '',
    phone: '',
    jobTitle: 'Super Administrator',
    location: 'Phnom Penh, Cambodia',
    timezone: 'Asia/Phnom_Penh (UTC+7)',
    themePreference: 'light',
  });

  originalProfile = signal<AdminProfileModel | null>(null);

  stats = signal<AdminStats>({
    totalUsers: 0,
    totalDrafts: 0,
    totalLogins: 0,
  });

  recentActivity = signal<AdminActivity[]>([]);

  // UI state
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  showCoverPresets = signal<boolean>(false);
  copiedField = signal<string | null>(null);

  // Password Change
  newPassword = '';
  confirmPassword = '';
  showNewPassword = false;
  passwordError = signal<string | null>(null);
  passwordSuccess = signal<string | null>(null);
  updatingPassword = signal<boolean>(false);

  // Cover Presets
  readonly coverPresets = [
    { name: 'Aurora Glow', class: 'cover-gradient-1', gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)' },
    { name: 'Deep Space', class: 'cover-gradient-2', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' },
    { name: 'Emerald Cyber', class: 'cover-gradient-3', gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%)' },
    { name: 'Sunset Horizon', class: 'cover-gradient-4', gradient: 'linear-gradient(135deg, #ea580c 0%, #e11d48 50%, #9333ea 100%)' },
    { name: 'Electric Violet', class: 'cover-gradient-5', gradient: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #4f46e5 100%)' },
  ];

  // Computed
  isDirty = computed(() => {
    const orig = this.originalProfile();
    if (!orig) return false;
    const cur = this.profile();
    return (
      cur.fullName !== orig.fullName ||
      cur.bio !== orig.bio ||
      cur.phone !== orig.phone ||
      cur.jobTitle !== orig.jobTitle ||
      cur.location !== orig.location ||
      cur.timezone !== orig.timezone ||
      cur.themePreference !== orig.themePreference ||
      cur.avatarUrl !== orig.avatarUrl ||
      cur.coverUrl !== orig.coverUrl
    );
  });

  adminInitials = computed(() => {
    const name = this.profile().fullName || this.profile().email || 'Admin';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.http.get<{ user: any; recentActivity?: AdminActivity[]; stats?: AdminStats }>('/api/v1/admin/settings/profile')
      .subscribe({
        next: (res) => {
          const u = res.user || {};
          const mapped: AdminProfileModel = {
            id: u.id,
            fullName: u.fullName || u.full_name || '',
            email: u.email || '',
            role: u.role || 'admin',
            avatarUrl: u.avatarUrl || u.avatar_url || '',
            coverUrl: u.coverUrl || u.cover_url || '',
            bio: u.bio || '',
            phone: u.phone || '',
            jobTitle: u.jobTitle || u.job_title || 'Super Administrator',
            location: u.location || 'Phnom Penh, Cambodia',
            timezone: u.timezone || 'Asia/Phnom_Penh (UTC+7)',
            themePreference: u.themePreference || u.theme_preference || 'light',
            createdAt: u.createdAt || u.created_at,
            lastLoginAt: u.lastLoginAt || u.last_login_at,
          };

          this.profile.set({ ...mapped });
          this.originalProfile.set({ ...mapped });

          if (res.stats) {
            this.stats.set(res.stats);
          }
          if (res.recentActivity) {
            this.recentActivity.set(res.recentActivity);
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load profile:', err);
          this.loading.set(false);
        }
      });
  }

  saveProfile() {
    this.saving.set(true);
    const p = this.profile();

    this.http.put<{ user: any }>('/api/v1/admin/settings/profile', {
      fullName: p.fullName,
      avatarUrl: p.avatarUrl,
      coverUrl: p.coverUrl,
      bio: p.bio,
      themePreference: p.themePreference,
      phone: p.phone,
      jobTitle: p.jobTitle,
      location: p.location,
      timezone: p.timezone,
    }).subscribe({
      next: (res) => {
        this.saving.set(false);
        this.originalProfile.set({ ...p });
        this.toast.success('Admin profile saved successfully!');
        this.auth.updateUser({ fullName: p.fullName, avatarUrl: p.avatarUrl });
      },
      error: (err) => {
        console.error('Failed to save profile:', err);
        this.saving.set(false);
        this.toast.error('Failed to save profile');
      }
    });
  }

  onAvatarChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.profile.update((p) => ({ ...p, avatarUrl: reader.result as string }));
      this.toast.info('New avatar selected. Remember to save changes.');
    };
    reader.readAsDataURL(file);
  }

  removeAvatar() {
    this.profile.update((p) => ({ ...p, avatarUrl: '' }));
    this.toast.info('Avatar removed. Click save to persist.');
  }

  onCoverChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.profile.update((p) => ({ ...p, coverUrl: reader.result as string }));
      this.showCoverPresets.set(false);
      this.toast.info('Cover updated. Remember to save changes.');
    };
    reader.readAsDataURL(file);
  }

  selectCoverPreset(gradientString: string) {
    this.profile.update((p) => ({ ...p, coverUrl: gradientString }));
    this.showCoverPresets.set(false);
    this.toast.info('Preset cover applied. Click save to persist.');
  }

  changePassword() {
    this.passwordError.set(null);
    this.passwordSuccess.set(null);

    if (!this.newPassword || this.newPassword.length < 8) {
      this.passwordError.set('Password must be at least 8 characters long.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError.set('Passwords do not match.');
      return;
    }

    this.updatingPassword.set(true);
    this.http.put('/api/v1/admin/settings/password', { newPassword: this.newPassword }).subscribe({
      next: () => {
        this.updatingPassword.set(false);
        this.passwordSuccess.set('Password updated successfully!');
        this.newPassword = '';
        this.confirmPassword = '';
        this.toast.success('Password updated successfully!');
        setTimeout(() => this.passwordSuccess.set(null), 4000);
      },
      error: (err) => {
        console.error('Password update failed:', err);
        this.updatingPassword.set(false);
        this.passwordError.set('Failed to update password. Please try again.');
      }
    });
  }

  copyToClipboard(text: string, label: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copiedField.set(label);
      this.toast.success(`${label} copied to clipboard!`);
      setTimeout(() => {
        if (this.copiedField() === label) this.copiedField.set(null);
      }, 2000);
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

  parseUserAgent(ua?: string): string {
    if (!ua) return 'Web Browser';
    let browser = 'Browser';
    if (ua.includes('Edg/')) browser = 'Microsoft Edge';
    else if (ua.includes('Chrome/')) browser = 'Google Chrome';
    else if (ua.includes('Safari/')) browser = 'Apple Safari';
    else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';

    let os = '';
    if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('Linux')) os = 'Linux';

    return os ? `${browser} on ${os}` : browser;
  }
}
