import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Lock, UserCog, Trash2, LogOut } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">Settings</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">

      <!-- Edit Information -->
      <section class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <lucide-icon [img]="UserCog" class="w-5 h-5 text-indigo-500" />
          <h2 class="font-semibold text-slate-800 dark:text-white">Edit Information</h2>
        </div>
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
            <input formControlName="fullName"
                   class="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700
                          text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
            <input [value]="profileForm.get('email')?.value" [attr.disabled]="true"
                   class="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700
                          text-sm text-slate-400 cursor-not-allowed" />
          </div>
          <button type="submit"
                  class="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium
                         hover:bg-indigo-700 active:scale-95 transition-all shadow-sm">
            Save Changes
          </button>
        </form>
      </section>

      <!-- Change Password -->
      <section class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <lucide-icon [img]="Lock" class="w-5 h-5 text-indigo-500" />
          <h2 class="font-semibold text-slate-800 dark:text-white">Change Password</h2>
        </div>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">New Password</label>
            <input formControlName="newPassword" type="password" placeholder="Min 8 characters"
                   class="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700
                          text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <button type="submit"
                  class="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium
                         hover:bg-indigo-700 active:scale-95 transition-all shadow-sm">
            Update Password
          </button>
        </form>
      </section>

      <!-- Logout -->
      <section class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <lucide-icon [img]="LogOut" class="w-5 h-5 text-orange-500" />
          <h2 class="font-semibold text-slate-800 dark:text-white">Session</h2>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Log out of your admin session on this device.</p>
        <button type="button" (click)="logout()"
                class="px-4 py-2.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400
                       text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-500/20 active:scale-95 transition-all">
          Log Out
        </button>
      </section>

      <!-- Delete Account (Danger Zone) -->
      <section class="rounded-xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/30 p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <lucide-icon [img]="Trash2" class="w-5 h-5 text-red-500" />
          <h2 class="font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Permanently delete your admin account. This action cannot be undone.</p>
        <button type="button" (click)="confirmDelete.set(true)"
                class="px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400
                       text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20 active:scale-95 transition-all">
          Delete My Account
        </button>
      </section>
    </div>

    @if (message()) {
      <p class="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{{ message() }}</p>
    }

    <!-- iOS-style Delete Confirmation -->
    @if (confirmDelete()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
           (click)="confirmDelete.set(false)">
        <div class="w-full max-w-xs rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden animate-[slideUp_0.25s_ease-out]"
             (click)="$event.stopPropagation()">
          <div class="px-6 pt-6 pb-4 text-center">
            <p class="font-semibold text-slate-800 dark:text-white text-base">Delete Account</p>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
              This will permanently delete your account and all associated data. Are you sure?
            </p>
          </div>
          <div class="border-t border-slate-200 dark:border-slate-700">
            <button type="button" (click)="deleteAccount()"
                    class="w-full py-3 text-red-500 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              Delete Forever
            </button>
          </div>
          <div class="border-t border-slate-200 dark:border-slate-700">
            <button type="button" (click)="confirmDelete.set(false)"
                    class="w-full py-3 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
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
export class AdminSettingsComponent implements OnInit {
  readonly Lock = Lock;
  readonly UserCog = UserCog;
  readonly Trash2 = Trash2;
  readonly LogOut = LogOut;

  message = signal<string | null>(null);
  confirmDelete = signal(false);

  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private auth: AuthService, private router: Router) {
    this.profileForm = this.fb.group({ fullName: [''], email: [{ value: '', disabled: true }] });
    this.passwordForm = this.fb.group({ newPassword: ['', [Validators.required, Validators.minLength(8)]] });
  }

  ngOnInit() {
    this.http.get<{ user: any }>('/api/v1/admin/settings/profile').subscribe(({ user }) => {
      this.profileForm.patchValue({ fullName: user.fullName, email: user.email });
    });
  }

  saveProfile() {
    this.http.put('/api/v1/admin/settings/profile', { fullName: this.profileForm.get('fullName')?.value })
      .subscribe(() => {
        this.message.set('Information updated!');
        this.auth.updateUser({ fullName: this.profileForm.get('fullName')?.value });
        setTimeout(() => this.message.set(null), 3000);
      });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    this.http.put('/api/v1/admin/settings/password', this.passwordForm.getRawValue())
      .subscribe(() => { this.message.set('Password updated!'); this.passwordForm.reset(); setTimeout(() => this.message.set(null), 3000); });
  }

  logout() {
    this.auth.logout();
  }

  deleteAccount() {
    this.http.delete('/api/v1/admin/settings/account').subscribe(() => {
      this.confirmDelete.set(false);
      this.auth.logout();
    });
  }
}
