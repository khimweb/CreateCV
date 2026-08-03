import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Camera, Save } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">Profile</h1>

    <div class="max-w-2xl">
      <!-- Cover Image -->
      <div class="relative rounded-xl overflow-hidden h-40 bg-gradient-to-r from-indigo-500 to-purple-600 mb-16">
        @if (profile.coverUrl) {
          <img [src]="profile.coverUrl" alt="Cover" class="w-full h-full object-cover" />
        }
        <label class="absolute bottom-3 right-3 p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 cursor-pointer
                      hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
          <lucide-icon [img]="Camera" class="w-4 h-4 text-slate-600 dark:text-slate-300" />
          <input type="file" accept="image/*" class="hidden" (change)="onCoverChange($event)" />
        </label>

        <!-- Avatar -->
        <div class="absolute -bottom-12 left-6">
          <div class="relative">
            <div class="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-indigo-100 dark:bg-indigo-500/20 shadow-lg">
              @if (profile.avatarUrl) {
                <img [src]="profile.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
              } @else {
                <div class="w-full h-full flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {{ profile.fullName?.slice(0,1) || 'A' }}
                </div>
              }
            </div>
            <label class="absolute bottom-0 right-0 p-1.5 rounded-full bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 transition-colors shadow">
              <lucide-icon [img]="Camera" class="w-3.5 h-3.5" />
              <input type="file" accept="image/*" class="hidden" (change)="onAvatarChange($event)" />
            </label>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-5">
        <div>
          <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
          <input [(ngModel)]="profile.fullName"
                 class="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700
                        text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Email</label>
          <input [value]="profile.email" disabled
                 class="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700
                        text-sm text-slate-400 cursor-not-allowed" />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Bio</label>
          <textarea [(ngModel)]="profile.bio" rows="4" placeholder="Tell something about yourself..."
                    class="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700
                           text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"></textarea>
        </div>

        <button type="button" (click)="saveProfile()"
                class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium
                       hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-sm">
          <lucide-icon [img]="Save" class="w-4 h-4" /> Save Profile
        </button>

        @if (message()) {
          <p class="text-sm text-emerald-600 dark:text-emerald-400 mt-2">{{ message() }}</p>
        }
      </div>
    </div>
  `,
})
export class AdminProfileComponent implements OnInit {
  readonly Camera = Camera;
  readonly Save = Save;

  profile = { fullName: '', email: '', avatarUrl: '', coverUrl: '', bio: '' };
  message = signal<string | null>(null);

  constructor(private http: HttpClient, private auth: AuthService, private toast: ToastService) {}

  ngOnInit() {
    this.http.get<{ user: any }>('/api/v1/admin/settings/profile').subscribe(({ user }) => {
      this.profile = {
        fullName: user.fullName || '',
        email: user.email || '',
        avatarUrl: user.avatarUrl || '',
        coverUrl: user.coverUrl || '',
        bio: user.bio || '',
      };
    });
  }

  onAvatarChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.profile.avatarUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onCoverChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.profile.coverUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveProfile() {
    this.http.put('/api/v1/admin/settings/profile', {
      fullName: this.profile.fullName,
      avatarUrl: this.profile.avatarUrl,
      coverUrl: this.profile.coverUrl,
      bio: this.profile.bio,
    }).subscribe(() => {
      this.toast.success('Profile saved successfully!');
      this.auth.updateUser({ fullName: this.profile.fullName, avatarUrl: this.profile.avatarUrl });
    });
  }
}
