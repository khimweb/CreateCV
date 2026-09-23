import { Component, signal, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { GoogleSignInComponent } from '../../shared/components/auth/google-sign-in.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, GoogleSignInComponent],
  template: `
    <section class="auth-root" [class.ready]="ready()">
      <!-- Animated background orbs -->
      <div class="orb orb-1" aria-hidden="true"></div>
      <div class="orb orb-2" aria-hidden="true"></div>
      <div class="orb orb-3" aria-hidden="true"></div>
      <div class="orb orb-4" aria-hidden="true"></div>

      <!-- Grid noise overlay -->
      <div class="noise" aria-hidden="true"></div>

      <div class="auth-wrapper">
        <!-- LEFT PANEL -->
        <aside class="panel-left">
          <div class="panel-inner">
            <div class="brand-badge">
              <span class="brand-dot"></span>
              <span>CQ-Professional</span>
            </div>
            <h1 class="panel-headline">
              Welcome<br/>back<span class="accent">.</span>
            </h1>
            <p class="panel-sub">Pick up where you left off — build a CV that opens every door you knock on.</p>

            <div class="feature-list">
              <div class="feature-item">
                <span class="feature-icon">✦</span>
                <span>20+ professional templates</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✦</span>
                <span>AI-powered content suggestions</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✦</span>
                <span>Export to PDF instantly</span>
              </div>
            </div>

            <a routerLink="/register" class="panel-switch">
              New here? <strong>Create account →</strong>
            </a>
          </div>

          <!-- Decorative floating shapes -->
          <div class="shape shape-ring"></div>
          <div class="shape shape-blob"></div>
          <div class="shape shape-dot-grid"></div>
        </aside>

        <!-- RIGHT PANEL — FORM -->
        <main class="panel-right">
          <a routerLink="/" class="back-home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Home
          </a>

          <div class="form-card">
            <div class="form-header">
              <p class="eyebrow">SIGN IN</p>
              <h2>Sign in to your account</h2>
              <p class="sub-heading">Enter your credentials to continue creating.</p>
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <!-- Email -->
              <div class="field-group" [class.focused]="emailFocused()" [class.filled]="form.get('email')?.value">
                <label for="email">Email address</label>
                <div class="input-wrap">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>
                  <input id="email" formControlName="email" type="email" placeholder="you@example.com"
                    (focus)="emailFocused.set(true)" (blur)="emailFocused.set(false)" autocomplete="email" />
                  <div class="focus-ring"></div>
                </div>
              </div>

              <!-- Password -->
              <div class="field-group" [class.focused]="pwFocused()" [class.filled]="form.get('password')?.value">
                <label for="password">Password</label>
                <div class="input-wrap">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input id="password" formControlName="password" [type]="showPw() ? 'text' : 'password'" placeholder="••••••••"
                    (focus)="pwFocused.set(true)" (blur)="pwFocused.set(false)" autocomplete="current-password" />
                  <button type="button" class="eye-btn" (click)="showPw.set(!showPw())" [attr.aria-label]="showPw() ? 'Hide password' : 'Show password'">
                    @if (showPw()) {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    } @else {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                  <div class="focus-ring"></div>
                </div>
              </div>

              <div class="row-opts">
                <label class="remember">
                  <input type="checkbox" />
                  <span class="custom-check"></span>
                  <span>Remember me</span>
                </label>
                <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
              </div>

              <!-- Error message -->
              @if (error()) {
                <div class="error-msg" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ error() }}
                </div>
              }

              <!-- Submit button -->
              <button type="submit" class="btn-submit" [class.loading]="loading()" [disabled]="form.invalid || loading()">
                @if (loading()) {
                  <span class="glow-loader">
                    <span class="gl-dot"></span>
                    <span class="gl-dot"></span>
                    <span class="gl-dot"></span>
                    <span class="gl-dot"></span>
                    <span class="gl-dot"></span>
                  </span>
                  <span>Signing in...</span>
                } @else {
                  <span>Sign in</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                }
                <span class="btn-shimmer"></span>
              </button>
            </form>

            <div class="divider"><span>or continue with</span></div>

            <div class="social-row">
              <app-google-sign-in (credential)="signInWithGoogle($event)" />
            </div>

            <p class="switch-text">Don't have an account? <a routerLink="/register">Sign up free</a></p>
          </div>
        </main>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    /* ── ROOT ──────────────────────────────────────── */
    .auth-root {
      min-height: 100vh;
      display: flex;
      align-items: stretch;
      font-family: 'Inter', system-ui, sans-serif;
      background: #060c1a;
      position: relative;
      overflow: hidden;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    .auth-root.ready { opacity: 1; }

    /* ── ANIMATED ORBS ─────────────────────────────── */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      pointer-events: none;
      animation: orbFloat 12s ease-in-out infinite alternate;
    }
    .orb-1 { width: 600px; height: 600px; top: -200px; left: -200px; background: radial-gradient(circle, rgba(79,70,229,0.45) 0%, transparent 70%); animation-delay: 0s; }
    .orb-2 { width: 500px; height: 500px; bottom: -150px; right: -150px; background: radial-gradient(circle, rgba(14,165,233,0.4) 0%, transparent 70%); animation-delay: -4s; }
    .orb-3 { width: 400px; height: 400px; top: 40%; left: 35%; background: radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%); animation-delay: -8s; }
    .orb-4 { width: 300px; height: 300px; top: 10%; right: 30%; background: radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%); animation-delay: -2s; }

    @keyframes orbFloat {
      0%   { transform: translate(0, 0) scale(1); }
      50%  { transform: translate(30px, -20px) scale(1.08); }
      100% { transform: translate(-20px, 30px) scale(0.95); }
    }

    /* ── NOISE OVERLAY ─────────────────────────────── */
    .noise {
      position: absolute;
      inset: 0;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      pointer-events: none;
    }

    /* ── WRAPPER ───────────────────────────────────── */
    .auth-wrapper {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      min-height: 100vh;
    }

    /* ── LEFT PANEL ────────────────────────────────── */
    .panel-left {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 56px;
      background: linear-gradient(145deg, rgba(79,70,229,0.15) 0%, rgba(30,27,75,0.3) 100%);
      border-right: 1px solid rgba(255,255,255,0.06);
      overflow: hidden;
      animation: slideInLeft 0.7s cubic-bezier(0.16,1,0.3,1) both;
    }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }

    .panel-inner { position: relative; z-index: 2; max-width: 400px; }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(79,70,229,0.2);
      border: 1px solid rgba(99,102,241,0.4);
      color: #a5b4fc;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-bottom: 32px;
    }
    .brand-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 3px rgba(16,185,129,0.3);
      animation: pulse 2s ease infinite;
    }
    @keyframes pulse { 0%,100% { box-shadow: 0 0 0 3px rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 0 6px rgba(16,185,129,0.1); } }

    .panel-headline {
      font-size: clamp(2.8rem, 5vw, 4.5rem);
      font-weight: 900;
      color: #fff;
      line-height: 1.05;
      letter-spacing: -0.04em;
      margin: 0 0 20px;
    }
    .accent { color: #818cf8; }

    .panel-sub {
      color: rgba(255,255,255,0.55);
      font-size: 1rem;
      line-height: 1.7;
      margin: 0 0 36px;
      max-width: 320px;
    }

    .feature-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 48px; }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(255,255,255,0.7);
      font-size: 0.88rem;
      font-weight: 500;
    }
    .feature-icon { color: #818cf8; font-size: 0.75rem; }

    .panel-switch {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: rgba(255,255,255,0.5);
      text-decoration: none;
      font-size: 0.88rem;
      transition: color 0.2s;
    }
    .panel-switch:hover { color: #a5b4fc; }
    .panel-switch strong { color: #818cf8; }

    /* Decorative shapes */
    .shape { position: absolute; pointer-events: none; }
    .shape-ring {
      width: 400px; height: 400px;
      border-radius: 50%;
      border: 1.5px solid rgba(99,102,241,0.15);
      top: -100px; right: -150px;
      animation: spin 40s linear infinite;
    }
    .shape-ring::after {
      content: '';
      position: absolute;
      width: 280px; height: 280px;
      border-radius: 50%;
      border: 1px solid rgba(99,102,241,0.1);
      top: 60px; left: 60px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .shape-blob {
      width: 260px; height: 260px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%);
      bottom: -80px; left: -60px;
    }

    /* ── RIGHT PANEL ───────────────────────────────── */
    .panel-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 60px;
      animation: slideInRight 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both;
    }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }

    .back-home {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: rgba(255,255,255,0.4);
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      align-self: flex-start;
      margin-bottom: 32px;
      transition: color 0.2s;
    }
    .back-home:hover { color: rgba(255,255,255,0.8); }

    .form-card {
      width: 100%;
      max-width: 440px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 40px;
      backdrop-filter: blur(20px);
      box-shadow: 0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
    }

    .form-header { margin-bottom: 28px; }
    .eyebrow {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #818cf8;
      margin: 0 0 10px;
    }
    .form-header h2 {
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
      margin: 0 0 8px;
      letter-spacing: -0.03em;
    }
    .sub-heading {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.45);
      margin: 0;
    }

    /* ── FIELDS ────────────────────────────────────── */
    .field-group { margin-bottom: 18px; }
    .field-group label {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      color: rgba(255,255,255,0.5);
      margin-bottom: 8px;
      letter-spacing: 0.02em;
      transition: color 0.2s;
    }
    .field-group.focused label { color: #a5b4fc; }

    .input-wrap { position: relative; }
    .field-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255,255,255,0.25);
      pointer-events: none;
      transition: color 0.2s;
    }
    .field-group.focused .field-icon { color: #818cf8; }

    .input-wrap input {
      width: 100%;
      box-sizing: border-box;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 13px 44px 13px 42px;
      font: inherit;
      font-size: 0.9rem;
      color: #fff;
      outline: none;
      transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    }
    .input-wrap input::placeholder { color: rgba(255,255,255,0.2); }
    .input-wrap input:focus {
      background: rgba(255,255,255,0.08);
      border-color: rgba(129,140,248,0.6);
    }

    .focus-ring {
      position: absolute;
      inset: -2px;
      border-radius: 14px;
      border: 2px solid transparent;
      background: linear-gradient(135deg, #6366f1, #06b6d4) border-box;
      -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.25s;
      pointer-events: none;
    }
    .field-group.focused .focus-ring { opacity: 1; }

    .eye-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.3);
      padding: 4px;
      display: flex;
      transition: color 0.2s;
    }
    .eye-btn:hover { color: rgba(255,255,255,0.7); }

    /* ── OPTS ROW ──────────────────────────────────── */
    .row-opts {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 4px 0 22px;
    }
    .remember {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.78rem;
      color: rgba(255,255,255,0.5);
    }
    .remember input[type=checkbox] { display: none; }
    .custom-check {
      width: 16px; height: 16px;
      border: 1.5px solid rgba(255,255,255,0.2);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .remember input:checked ~ .custom-check {
      background: #6366f1;
      border-color: #6366f1;
    }
    .remember input:checked ~ .custom-check::after {
      content: '';
      width: 4px; height: 7px;
      border: 2px solid #fff;
      border-top: none;
      border-left: none;
      transform: rotate(45deg) translateY(-1px);
    }
    .forgot-link {
      font-size: 0.78rem;
      font-weight: 700;
      color: #818cf8;
      text-decoration: none;
      transition: color 0.2s;
    }
    .forgot-link:hover { color: #a5b4fc; }

    /* ── ERROR ─────────────────────────────────────── */
    .error-msg {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 10px;
      background: rgba(239,68,68,0.12);
      border: 1px solid rgba(239,68,68,0.25);
      color: #fca5a5;
      font-size: 0.8rem;
      margin-bottom: 16px;
      animation: shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translateX(-2px); }
      20%, 80% { transform: translateX(4px); }
      30%, 50%, 70% { transform: translateX(-4px); }
      40%, 60% { transform: translateX(4px); }
    }

    /* ── SUBMIT BUTTON ─────────────────────────────── */
    .btn-submit {
      position: relative;
      width: 100%;
      border: none;
      border-radius: 12px;
      padding: 14px 24px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%);
      color: #fff;
      font-family: inherit;
      font-size: 0.93rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
      box-shadow: 0 8px 24px rgba(99,102,241,0.35);
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 14px 32px rgba(99,102,241,0.5);
    }
    .btn-submit:active:not(:disabled) { transform: translateY(0); }
    .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    /* Shimmer effect */
    .btn-shimmer {
      position: absolute;
      top: 0; left: -120%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      skewX: -15deg;
      transition: none;
    }
    .btn-submit:not(:disabled):hover .btn-shimmer {
      animation: shimmer 0.65s ease forwards;
    }
    @keyframes shimmer { to { left: 120%; } }

    /* ── GLOWING LOADER ────────────────────────────── */
    .glow-loader {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .gl-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #fff;
      animation: glowPulse 1.4s ease-in-out infinite;
    }
    .gl-dot:nth-child(1) { animation-delay: 0s; }
    .gl-dot:nth-child(2) { animation-delay: 0.15s; }
    .gl-dot:nth-child(3) { animation-delay: 0.3s; }
    .gl-dot:nth-child(4) { animation-delay: 0.45s; }
    .gl-dot:nth-child(5) { animation-delay: 0.6s; }

    @keyframes glowPulse {
      0%, 100% {
        transform: scale(0.5);
        opacity: 0.3;
        box-shadow: 0 0 4px rgba(255,255,255,0.2);
      }
      50% {
        transform: scale(1.3);
        opacity: 1;
        box-shadow: 0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(129,140,248,0.8);
      }
    }

    /* ── DIVIDER ───────────────────────────────────── */
    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 24px 0 18px;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255,255,255,0.08);
    }
    .divider span {
      font-size: 0.72rem;
      color: rgba(255,255,255,0.3);
      white-space: nowrap;
    }

    .social-row { display: flex; justify-content: center; margin-bottom: 4px; }

    .switch-text {
      text-align: center;
      font-size: 0.82rem;
      color: rgba(255,255,255,0.35);
      margin: 18px 0 0;
    }
    .switch-text a {
      color: #818cf8;
      font-weight: 700;
      text-decoration: none;
      transition: color 0.2s;
    }
    .switch-text a:hover { color: #a5b4fc; }

    /* ── RESPONSIVE ────────────────────────────────── */
    @media (max-width: 900px) {
      .auth-wrapper { grid-template-columns: 1fr; }
      .panel-left { display: none; }
      .panel-right {
        padding: 40px 24px;
        background: linear-gradient(160deg, #0a0f2e 0%, #0d1440 60%, #0c0e22 100%);
      }
      .form-card { padding: 32px 24px; }
    }
    @media (max-width: 480px) {
      .form-card { padding: 28px 20px; border-radius: 20px; }
      .form-header h2 { font-size: 1.55rem; }
    }
  `],
})
export class LoginComponent {
  form: FormGroup;
  error = signal<string | null>(null);
  returnUrl = signal('/');
  showPw = signal(false);
  loading = signal(false);
  emailFocused = signal(false);
  pwFocused = signal(false);
  ready = signal(false);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.returnUrl.set(this.route.snapshot.queryParamMap.get('returnUrl') || '/');
    setTimeout(() => this.ready.set(true), 50);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();
    const returnUrl = this.returnUrl();
    const safeUrl = returnUrl.startsWith('/login') || returnUrl.startsWith('/register') ? '/' : returnUrl;
    this.auth.login(email!, password!, safeUrl).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('Welcome back!');
        const user = this.auth.currentUser();
        if (user?.role === 'admin' && safeUrl === '/') this.router.navigate(['/admin']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Incorrect email or password. Please try again.');
      },
    });
  }

  signInWithGoogle(credential: string) {
    this.loading.set(true);
    this.error.set(null);
    this.auth.loginWithGoogle(credential).subscribe({
      next: () => { this.loading.set(false); this.toast.success('Signed in with Google.'); },
      error: (error) => {
        this.loading.set(false);
        this.error.set(error.error?.message || 'Google sign-in could not be completed.');
      },
    });
  }
}
