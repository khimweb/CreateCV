import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="min-h-screen flex items-center justify-center px-4
                     bg-sky-50 dark:bg-[#0F172A] transition-all duration-300 ease-in-out">
      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        class="w-full max-w-md p-8 rounded-2xl
               bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
               border border-white/40 dark:border-sky-500/20
               shadow-[0_8px_32px_rgba(2,132,199,0.15)]"
      >
        <h1 class="text-2xl font-semibold text-slate-800 dark:text-sky-100 mb-1">Welcome back</h1>
        <p class="text-sm text-slate-500 dark:text-sky-300 mb-6">
          Log in to select a template and start building your CV.
        </p>

        @if (returnUrl() !== '/') {
          <p class="text-xs mb-4 px-3 py-2 rounded-xl bg-sky-100/70 dark:bg-sky-500/10 text-sky-700 dark:text-sky-200">
            You'll be taken back to your selected template after logging in.
          </p>
        }

        <label class="block text-sm text-slate-600 dark:text-sky-200 mb-1">Email</label>
        <input formControlName="email" type="email"
               class="w-full mb-4 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/70
                      border border-sky-200 dark:border-sky-500/30
                      focus:outline-none focus:ring-2 focus:ring-sky-500
                      transition-all duration-300 ease-in-out" />

        <label class="block text-sm text-slate-600 dark:text-sky-200 mb-1">Password</label>
        <input formControlName="password" type="password"
               class="w-full mb-6 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/70
                      border border-sky-200 dark:border-sky-500/30
                      focus:outline-none focus:ring-2 focus:ring-sky-500
                      transition-all duration-300 ease-in-out" />

        @if (error()) {
          <p class="text-sm text-red-500 mb-4">{{ error() }}</p>
        }

        <button type="submit" [disabled]="form.invalid"
                class="w-full py-2.5 rounded-xl bg-sky-700 dark:bg-sky-600 text-white font-medium
                       shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100
                       transition-all duration-300 ease-in-out">
          Log in
        </button>

        <p class="text-center text-sm text-slate-600 dark:text-sky-300 mt-6">
          Don't have an account?
          <a routerLink="/register" class="font-medium text-sky-600 hover:underline">Sign up</a>
        </p>

      </form>
    </section>
  `,
})
export class LoginComponent {
  form: FormGroup;
  error = signal<string | null>(null);
  returnUrl = signal<string>('/');

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.returnUrl.set(this.route.snapshot.queryParamMap.get('returnUrl') || '/');
  }

  submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();

    this.auth.login(email!, password!, this.returnUrl()).subscribe({
      error: () => this.error.set('Incorrect email or password.'),
    });
  }
}
