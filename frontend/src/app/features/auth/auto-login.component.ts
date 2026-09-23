import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule, ShieldCheck, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-auto-login',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950 font-sans selection:bg-cyan-500 selection:text-white">
      <!-- Ambient Dynamic iOS Background Orbs -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div class="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-500/15 rounded-full blur-[130px] pointer-events-none animate-pulse" style="animation-duration: 6s;"></div>

      <!-- Mirror Floating Glass Container -->
      <div class="relative w-full max-w-md mx-auto z-10 transition-all duration-500">
        <div class="relative rounded-3xl p-8 sm:p-10 backdrop-blur-2xl bg-white/[0.04] dark:bg-slate-900/60 border border-white/15 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] text-center text-white overflow-hidden">
          
          <!-- Subtle Top Specular Sheen -->
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>

          <!-- Loading State -->
          <div *ngIf="state === 'loading'" class="py-6 flex flex-col items-center">
            <div class="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-emerald-500/30 blur-xl animate-pulse"></div>
              <div class="relative w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <lucide-icon [img]="Loader2" [size]="32" class="text-cyan-400 animate-spin"></lucide-icon>
              </div>
            </div>

            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <lucide-icon [img]="Sparkles" [size]="13"></lucide-icon>
              <span>Instant Magic Authorization</span>
            </div>

            <h2 class="text-2xl font-bold tracking-tight text-white mb-2">Authenticating Portal...</h2>
            <p class="text-sm text-slate-400 max-w-xs leading-relaxed">
              Verifying your accountant digital key and establishing an encrypted session.
            </p>
          </div>

          <!-- Success State -->
          <div *ngIf="state === 'success'" class="py-6 flex flex-col items-center transition-all duration-300">
            <div class="relative w-20 h-20 mb-6 flex items-center justify-center animate-bounce" style="animation-duration: 1.5s;">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/40 to-teal-400/30 blur-xl"></div>
              <div class="relative w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-md flex items-center justify-center shadow-lg shadow-emerald-500/20 text-emerald-400">
                <lucide-icon [img]="ShieldCheck" [size]="36"></lucide-icon>
              </div>
            </div>

            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <span>Authorized Successfully</span>
            </div>

            <h2 class="text-2xl font-bold tracking-tight text-white mb-2">Welcome Back!</h2>
            <p class="text-base font-medium text-emerald-300 mb-1">{{ userName }}</p>
            <p class="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
              Authenticated as <span class="capitalize text-slate-200 font-semibold">{{ userRole }}</span>. Teleporting to your dashboard...
            </p>

            <div class="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/10">
              <div class="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full animate-[progress_1s_ease-in-out_infinite]" style="width: 100%;"></div>
            </div>
          </div>

          <!-- Error State -->
          <div *ngIf="state === 'error'" class="py-6 flex flex-col items-center">
            <div class="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div class="absolute inset-0 rounded-2xl bg-rose-500/20 blur-xl"></div>
              <div class="relative w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-400/30 backdrop-blur-md flex items-center justify-center shadow-inner text-rose-400">
                <lucide-icon [img]="AlertCircle" [size]="34"></lucide-icon>
              </div>
            </div>

            <h2 class="text-xl font-bold tracking-tight text-white mb-2">Login Link Expired or Invalid</h2>
            <p class="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
              {{ errorMessage || 'This one-time magic link has already been used or has expired. Please contact an administrator or sign in normally.' }}
            </p>

            <a routerLink="/login"
               class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <span>Go to Sign In</span>
              <lucide-icon [img]="ArrowRight" [size]="16"></lucide-icon>
            </a>
          </div>

        </div>

        <!-- Footnote Security Badge -->
        <div class="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <lucide-icon [img]="ShieldCheck" [size]="13" class="text-emerald-500"></lucide-icon>
          <span>End-to-End Cryptographic Token Handshake</span>
        </div>
      </div>
    </div>
  `
})
export class AutoLoginComponent implements OnInit {
  readonly Loader2 = Loader2;
  readonly ShieldCheck = ShieldCheck;
  readonly AlertCircle = AlertCircle;
  readonly Sparkles = Sparkles;
  readonly ArrowRight = ArrowRight;

  state: 'loading' | 'success' | 'error' = 'loading';
  errorMessage = '';
  userName = '';
  userRole = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.state = 'error';
      this.errorMessage = 'No authentication token provided in link. Please use a valid magic link.';
      return;
    }

    this.authService.autoLogin(token).subscribe({
      next: (res) => {
        this.state = 'success';
        this.userName = res.user?.fullName || 'Accountant';
        this.userRole = res.user?.role || 'accountant';

        // Fast, smooth redirect after momentary celebratory badge display
        setTimeout(() => {
          const destination = res.redirectTo || (res.user?.role === 'accountant' ? '/accountant' : '/');
          this.router.navigateByUrl(destination);
        }, 700);
      },
      error: (err) => {
        this.state = 'error';
        this.errorMessage = err?.error?.message || 'The magic auto-login link is invalid or has expired.';
      }
    });
  }
}
