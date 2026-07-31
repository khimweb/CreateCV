import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ThemeSwitcherComponent } from '../../../shared/components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ThemeSwitcherComponent],
  template: `
    <h1 class="text-2xl font-semibold text-slate-800 dark:text-sky-100 mb-6">Settings</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Profile -->
      <section class="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                      border border-white/40 dark:border-sky-500/20 shadow-md">
        <h2 class="font-medium text-slate-800 dark:text-sky-100 mb-4">Profile</h2>
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4">
          <input formControlName="fullName" placeholder="Full name" [ngClass]="inputClass" class="w-full" />
          <button type="submit"
                  class="px-4 py-2 rounded-xl bg-sky-700 text-white text-sm hover:scale-105 active:scale-95
                         transition-all duration-300 ease-in-out">Save profile</button>
        </form>
      </section>

      <!-- Theme -->
      <section class="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                      border border-white/40 dark:border-sky-500/20 shadow-md flex items-center justify-between">
        <div>
          <h2 class="font-medium text-slate-800 dark:text-sky-100 mb-1">Appearance</h2>
          <p class="text-sm text-slate-500 dark:text-sky-300">Toggle light or dark mode.</p>
        </div>
        <app-theme-switcher />
      </section>

      <!-- Password -->
      <section class="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                      border border-white/40 dark:border-sky-500/20 shadow-md">
        <h2 class="font-medium text-slate-800 dark:text-sky-100 mb-4">Change password</h2>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-4">
          <input formControlName="newPassword" type="password" placeholder="New password (min 8 chars)"
                 [ngClass]="inputClass" class="w-full" />
          <button type="submit"
                  class="px-4 py-2 rounded-xl bg-sky-700 text-white text-sm hover:scale-105 active:scale-95
                         transition-all duration-300 ease-in-out">Update password</button>
        </form>
      </section>

      <!-- Create staff user -->
      <section class="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                      border border-white/40 dark:border-sky-500/20 shadow-md">
        <h2 class="font-medium text-slate-800 dark:text-sky-100 mb-4">Create user</h2>
        <form [formGroup]="newUserForm" (ngSubmit)="createUser()" class="space-y-4">
          <input formControlName="fullName" placeholder="Full name" [ngClass]="inputClass" class="w-full" />
          <input formControlName="email" placeholder="Email" [ngClass]="inputClass" class="w-full" />
          <input formControlName="password" type="password" placeholder="Temporary password" [ngClass]="inputClass" class="w-full" />
          <button type="submit"
                  class="px-4 py-2 rounded-xl bg-sky-700 text-white text-sm hover:scale-105 active:scale-95
                         transition-all duration-300 ease-in-out">Create user</button>
        </form>
      </section>
    </div>

    @if (message()) {
      <p class="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{{ message() }}</p>
    }
  `,
})
export class AdminSettingsComponent implements OnInit {
  readonly inputClass =
    'px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/70 border border-sky-200 ' +
    'dark:border-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500 ' +
    'transition-all duration-300 ease-in-out';

  message = signal<string | null>(null);

  profileForm: FormGroup;
  passwordForm: FormGroup;
  newUserForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.profileForm = this.fb.group({ fullName: [''] });
    this.passwordForm = this.fb.group({ newPassword: ['', [Validators.required, Validators.minLength(8)]] });
    this.newUserForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.http.get<{ user: any }>('/api/v1/admin/settings/profile').subscribe(({ user }) => {
      this.profileForm.patchValue({ fullName: user.fullName });
    });
  }

  saveProfile() {
    this.http.put('/api/v1/admin/settings/profile', this.profileForm.getRawValue())
      .subscribe(() => this.message.set('Profile updated.'));
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    this.http.put('/api/v1/admin/settings/password', this.passwordForm.getRawValue())
      .subscribe(() => { this.message.set('Password updated.'); this.passwordForm.reset(); });
  }

  createUser() {
    if (this.newUserForm.invalid) return;
    this.http.post('/api/v1/admin/settings/users', this.newUserForm.getRawValue())
      .subscribe(() => { this.message.set('User created.'); this.newUserForm.reset(); });
  }
}
