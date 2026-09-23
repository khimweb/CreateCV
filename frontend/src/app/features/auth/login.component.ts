import { Component, signal, computed, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { GoogleSignInComponent } from '../../shared/components/auth/google-sign-in.component';

const THEME_KEY = 'cv_creator_theme';

const T = {
  en: {
    eyebrow: 'SIGN IN',
    title: 'Sign in to your account',
    subtitle: 'Enter your details to continue.',
    email: 'Email address',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    submit: 'Sign in',
    submitting: 'Signing in...',
    orContinue: 'or continue with',
    noAccount: "Don't have an account?",
    signUpFree: 'Sign up free',
    backHome: 'Home',
    headline1: 'Welcome',
    headline2: 'back',
    panelSub: 'Pick up where you left off — build a CV that opens every door you knock on.',
    feat1: '20+ professional templates',
    feat2: 'AI-powered suggestions',
    feat3: 'Export to PDF instantly',
    newHere: 'New here?',
    createAccount: 'Create account →',
    errorMsg: 'Incorrect email or password. Please try again.',
  },
  kh: {
    eyebrow: 'ចូលគណនី',
    title: 'ចូលទៅក្នុងគណនីរបស់អ្នក',
    subtitle: 'បញ្ចូលព័ត៌មានរបស់អ្នក ដើម្បីបន្ត។',
    email: 'អ៊ីមែល',
    emailPlaceholder: 'you@example.com',
    password: 'លេខសម្ងាត់',
    passwordPlaceholder: '••••••••',
    remember: 'ចងចាំខ្ញុំ',
    forgot: 'ភ្លេចលេខសម្ងាត់?',
    submit: 'ចូល',
    submitting: 'កំពុងចូល...',
    orContinue: 'ឬ បន្តជាមួយ',
    noAccount: 'មិនទាន់មានគណនី?',
    signUpFree: 'ចុះឈ្មោះដោយឥតគិតថ្លៃ',
    backHome: 'ទំព័រដើម',
    headline1: 'សូម',
    headline2: 'ស្វាគមន៍',
    panelSub: 'បន្តកន្លែងដែលអ្នកបានឈប់ — បង្កើត CV ដែលបើកឱកាសរាល់ទ្វារ។',
    feat1: 'គំរូ 20+ ជំនាញ',
    feat2: 'AI ជួយស្នើអត្ថបទ',
    feat3: 'នាំចេញ PDF ភ្លាមៗ',
    newHere: 'ថ្មីមកនេះ?',
    createAccount: 'បង្កើតគណនី →',
    errorMsg: 'អ៊ីមែល ឬ លេខសម្ងាត់មិនត្រូវ។ សូមព្យាយាម​ម្តងទៀត។',
  }
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, GoogleSignInComponent],
  template: `
    <section class="auth-root" [class.ready]="ready()" [class.light]="isLight()">
      <!-- ── Animated background system ── -->
      <div class="bg-mesh"     aria-hidden="true"></div>
      <div class="aurora aurora-1" aria-hidden="true"></div>
      <div class="aurora aurora-2" aria-hidden="true"></div>
      <div class="aurora aurora-3" aria-hidden="true"></div>
      <div class="orb orb-1"  aria-hidden="true"></div>
      <div class="orb orb-2"  aria-hidden="true"></div>
      <div class="orb orb-3"  aria-hidden="true"></div>
      <div class="orb orb-4"  aria-hidden="true"></div>
      <div class="orb orb-5"  aria-hidden="true"></div>
      <div class="particles"  aria-hidden="true">
        <span class="p p1"></span><span class="p p2"></span><span class="p p3"></span>
        <span class="p p4"></span><span class="p p5"></span><span class="p p6"></span>
        <span class="p p7"></span><span class="p p8"></span>
      </div>
      <div class="noise"       aria-hidden="true"></div>

      <!-- Top-right controls: Dark/Light + Language -->
      <div class="top-controls">
        <!-- Language switcher -->
        <div class="lang-switcher">
          <button class="lang-btn" [class.active]="lang() === 'kh'" (click)="setLang('kh')">KH</button>
          <span class="lang-sep">|</span>
          <button class="lang-btn" [class.active]="lang() === 'en'" (click)="setLang('en')">EN</button>
        </div>

        <!-- Theme toggle -->
        <button class="theme-btn" (click)="toggleTheme()" [attr.aria-label]="isLight() ? 'Switch to dark mode' : 'Switch to light mode'">
          @if (isLight()) {
            <!-- Moon icon -->
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
            </svg>
          } @else {
            <!-- Sun icon -->
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          }
        </button>
      </div>

      <div class="auth-wrapper">
        <!-- LEFT PANEL -->
        <aside class="panel-left">
          <div class="panel-inner">
            <div class="brand-badge">
              <span class="brand-dot"></span>
              <span>CQ-Professional</span>
            </div>
            <h1 class="panel-headline">
              {{ t().headline1 }}<br/>{{ t().headline2 }}<span class="accent">.</span>
            </h1>
            <p class="panel-sub">{{ t().panelSub }}</p>

            <div class="feature-list">
              <div class="feature-item">
                <span class="feature-icon">✦</span>
                <span>{{ t().feat1 }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✦</span>
                <span>{{ t().feat2 }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✦</span>
                <span>{{ t().feat3 }}</span>
              </div>
            </div>

            <a routerLink="/register" class="panel-switch">
              {{ t().newHere }} <strong>{{ t().createAccount }}</strong>
            </a>
          </div>

          <div class="shape shape-ring"></div>
          <div class="shape shape-blob"></div>
          <div class="shape shape-dot-grid"></div>
        </aside>

        <!-- RIGHT PANEL — FORM -->
        <main class="panel-right">
          <a routerLink="/" class="back-home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            {{ t().backHome }}
          </a>

          <div class="form-card">
            <div class="form-header">
              <p class="eyebrow">{{ t().eyebrow }}</p>
              <h2>{{ t().title }}</h2>
              <p class="sub-heading">{{ t().subtitle }}</p>
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <!-- Email -->
              <div class="field-group" [class.focused]="emailFocused()" [class.filled]="form.get('email')?.value">
                <label for="email">{{ t().email }}</label>
                <div class="input-wrap">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>
                  <input id="email" formControlName="email" type="email" [placeholder]="t().emailPlaceholder"
                    (focus)="emailFocused.set(true)" (blur)="emailFocused.set(false)" autocomplete="email" />
                  <div class="focus-ring"></div>
                </div>
              </div>

              <!-- Password -->
              <div class="field-group" [class.focused]="pwFocused()" [class.filled]="form.get('password')?.value">
                <label for="password">{{ t().password }}</label>
                <div class="input-wrap">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input id="password" formControlName="password" [type]="showPw() ? 'text' : 'password'" [placeholder]="t().passwordPlaceholder"
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
                  <span>{{ t().remember }}</span>
                </label>
                <a routerLink="/forgot-password" class="forgot-link">{{ t().forgot }}</a>
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
                    <span class="gl-dot"></span><span class="gl-dot"></span><span class="gl-dot"></span>
                    <span class="gl-dot"></span><span class="gl-dot"></span>
                  </span>
                  <span>{{ t().submitting }}</span>
                } @else {
                  <span>{{ t().submit }}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                }
                <span class="btn-shimmer"></span>
              </button>
            </form>

            <div class="divider"><span>{{ t().orContinue }}</span></div>

            <div class="social-row">
              <app-google-sign-in (credential)="signInWithGoogle($event)" />
            </div>

            <p class="switch-text">{{ t().noAccount }} <a routerLink="/register">{{ t().signUpFree }}</a></p>
          </div>
        </main>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    /* ═══════════════════════════════════════════════════
       ROOT
    ═══════════════════════════════════════════════════ */
    .auth-root {
      min-height: 100vh;
      display: flex;
      align-items: stretch;
      font-family: 'Inter', system-ui, sans-serif;
      position: relative;
      overflow: hidden;
      opacity: 0;
      /* Animated gradient background base */
      background: linear-gradient(135deg, #050a18 0%, #0a0d2e 35%, #080c22 70%, #060b1a 100%);
      background-size: 400% 400%;
      animation: gradientShift 14s ease infinite;
      transition: opacity 0.5s ease;
    }
    .auth-root.ready { opacity: 1; }

    @keyframes gradientShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* ── LIGHT MODE base ─────────────────────────────── */
    .auth-root.light {
      background: linear-gradient(135deg, #eef2ff 0%, #f0f4ff 35%, #ede9fe 70%, #e0e7ff 100%);
      background-size: 400% 400%;
      animation: gradientShiftLight 14s ease infinite;
    }
    @keyframes gradientShiftLight {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* ═══════════════════════════════════════════════════
       GRADIENT MESH LAYER
    ═══════════════════════════════════════════════════ */
    .bg-mesh {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 20%, rgba(99,102,241,0.18) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(6,182,212,0.15) 0%, transparent 60%),
        radial-gradient(ellipse 50% 70% at 50% 50%, rgba(168,85,247,0.10) 0%, transparent 60%);
      animation: meshPulse 10s ease-in-out infinite alternate;
      transition: opacity 0.8s ease;
    }
    .auth-root.light .bg-mesh {
      background:
        radial-gradient(ellipse 80% 60% at 20% 20%, rgba(99,102,241,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(79,70,229,0.10) 0%, transparent 60%),
        radial-gradient(ellipse 50% 70% at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 60%);
    }
    @keyframes meshPulse {
      0%   { opacity: 0.7; transform: scale(1) rotate(0deg); }
      50%  { opacity: 1;   transform: scale(1.05) rotate(1deg); }
      100% { opacity: 0.8; transform: scale(0.98) rotate(-1deg); }
    }

    /* ═══════════════════════════════════════════════════
       AURORA WAVES
    ═══════════════════════════════════════════════════ */
    .aurora {
      position: absolute;
      pointer-events: none;
      z-index: 0;
      border-radius: 50%;
      mix-blend-mode: screen;
      filter: blur(60px);
    }
    .auth-root.light .aurora { mix-blend-mode: multiply; }

    .aurora-1 {
      width: 70vw; height: 40vh;
      top: -10%;  left: -10%;
      background: linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.3), transparent);
      animation: auroraMove1 18s ease-in-out infinite alternate;
    }
    .aurora-2 {
      width: 60vw; height: 50vh;
      bottom: -15%; right: -10%;
      background: linear-gradient(225deg, rgba(6,182,212,0.45), rgba(79,70,229,0.3), transparent);
      animation: auroraMove2 22s ease-in-out infinite alternate;
    }
    .aurora-3 {
      width: 50vw; height: 45vh;
      top: 30%;  left: 30%;
      background: linear-gradient(45deg, rgba(168,85,247,0.3), rgba(14,165,233,0.25), transparent);
      animation: auroraMove3 26s ease-in-out infinite alternate;
    }
    .auth-root.light .aurora-1 { background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.15), transparent); }
    .auth-root.light .aurora-2 { background: linear-gradient(225deg, rgba(6,182,212,0.2), rgba(79,70,229,0.15), transparent); }
    .auth-root.light .aurora-3 { background: linear-gradient(45deg, rgba(168,85,247,0.15), rgba(14,165,233,0.12), transparent); }

    @keyframes auroraMove1 {
      0%   { transform: translate(0, 0)   scale(1)    rotate(0deg); opacity: 0.6; }
      33%  { transform: translate(8%, 5%) scale(1.1)  rotate(3deg); opacity: 0.9; }
      66%  { transform: translate(-5%, 8%) scale(0.95) rotate(-2deg); opacity: 0.7; }
      100% { transform: translate(5%, -5%) scale(1.05) rotate(2deg); opacity: 0.85; }
    }
    @keyframes auroraMove2 {
      0%   { transform: translate(0, 0)   scale(1)    rotate(0deg);  opacity: 0.5; }
      33%  { transform: translate(-6%, 4%) scale(1.08) rotate(-3deg); opacity: 0.8; }
      66%  { transform: translate(4%, -6%) scale(1.02) rotate(2deg);  opacity: 0.6; }
      100% { transform: translate(-4%, 6%) scale(0.97) rotate(-1deg); opacity: 0.75; }
    }
    @keyframes auroraMove3 {
      0%   { transform: translate(0, 0)    scale(1)    rotate(0deg);  opacity: 0.4; }
      50%  { transform: translate(-8%, -6%) scale(1.12) rotate(4deg);  opacity: 0.75; }
      100% { transform: translate(6%, 8%)  scale(0.93) rotate(-3deg); opacity: 0.55; }
    }

    /* ═══════════════════════════════════════════════════
       FLOATING ORBS
    ═══════════════════════════════════════════════════ */
    .orb {
      position: absolute; border-radius: 50%;
      filter: blur(80px); pointer-events: none; z-index: 0;
      transition: background 0.8s ease, opacity 0.8s ease;
    }
    .orb-1 { width:650px;height:650px;top:-220px;left:-180px;  background:radial-gradient(circle,rgba(79,70,229,.5)0%,rgba(99,102,241,.2)40%,transparent 70%); animation:orb1Float 16s ease-in-out infinite alternate; }
    .orb-2 { width:550px;height:550px;bottom:-180px;right:-160px; background:radial-gradient(circle,rgba(6,182,212,.45)0%,rgba(14,165,233,.2)40%,transparent 70%); animation:orb2Float 20s ease-in-out infinite alternate; }
    .orb-3 { width:420px;height:420px;top:35%;left:30%;      background:radial-gradient(circle,rgba(168,85,247,.35)0%,rgba(139,92,246,.15)40%,transparent 70%); animation:orb3Float 24s ease-in-out infinite alternate; }
    .orb-4 { width:320px;height:320px;top:8%;right:25%;      background:radial-gradient(circle,rgba(6,182,212,.3)0%,transparent 70%);  animation:orb4Float 18s ease-in-out infinite alternate; }
    .orb-5 { width:280px;height:280px;bottom:15%;left:15%;   background:radial-gradient(circle,rgba(236,72,153,.25)0%,transparent 70%); animation:orb5Float 22s ease-in-out infinite alternate; }

    /* Light-mode orb colours */
    .auth-root.light .orb-1 { background:radial-gradient(circle,rgba(99,102,241,.22)0%,rgba(129,140,248,.1)40%,transparent 70%); }
    .auth-root.light .orb-2 { background:radial-gradient(circle,rgba(6,182,212,.18)0%,rgba(14,165,233,.08)40%,transparent 70%); }
    .auth-root.light .orb-3 { background:radial-gradient(circle,rgba(168,85,247,.15)0%,transparent 70%); }
    .auth-root.light .orb-4 { background:radial-gradient(circle,rgba(99,102,241,.12)0%,transparent 70%); }
    .auth-root.light .orb-5 { background:radial-gradient(circle,rgba(236,72,153,.10)0%,transparent 70%); }

    @keyframes orb1Float {
      0%   { transform: translate(0,0)     scale(1);    opacity:.9; }
      33%  { transform: translate(40px,-30px) scale(1.1); opacity:.7; }
      66%  { transform: translate(-20px,50px) scale(.95); opacity:.85; }
      100% { transform: translate(30px,20px)  scale(1.05);opacity:.75; }
    }
    @keyframes orb2Float {
      0%   { transform: translate(0,0)      scale(1);    opacity:.8; }
      33%  { transform: translate(-50px,35px) scale(1.08);opacity:.6; }
      66%  { transform: translate(30px,-45px) scale(.97); opacity:.75; }
      100% { transform: translate(-25px,20px) scale(1.03);opacity:.65; }
    }
    @keyframes orb3Float {
      0%   { transform: translate(0,0)      scale(1);    opacity:.7; }
      50%  { transform: translate(35px,-45px) scale(1.12);opacity:.9; }
      100% { transform: translate(-40px,35px) scale(.92); opacity:.6; }
    }
    @keyframes orb4Float {
      0%   { transform: translate(0,0)      scale(1);    opacity:.65; }
      50%  { transform: translate(-30px,40px) scale(1.08);opacity:.85; }
      100% { transform: translate(45px,-25px) scale(.95); opacity:.5; }
    }
    @keyframes orb5Float {
      0%   { transform: translate(0,0)     scale(1);    opacity:.55; }
      33%  { transform: translate(40px,35px)  scale(1.1); opacity:.75; }
      66%  { transform: translate(-35px,-30px) scale(.9); opacity:.45; }
      100% { transform: translate(20px,-40px)  scale(1.05);opacity:.65; }
    }

    /* ═══════════════════════════════════════════════════
       FLOATING PARTICLES
    ═══════════════════════════════════════════════════ */
    .particles { position:absolute;inset:0;pointer-events:none;z-index:0; }
    .p {
      position: absolute;
      border-radius: 50%;
      animation: particleFloat linear infinite;
      opacity: 0;
      transition: background 0.8s ease;
    }
    .p1  { width:4px; height:4px; left:10%; top:80%; background:rgba(129,140,248,.8); animation-duration:12s; animation-delay:0s; }
    .p2  { width:3px; height:3px; left:25%; top:70%; background:rgba(6,182,212,.7);   animation-duration:15s; animation-delay:-3s; }
    .p3  { width:5px; height:5px; left:40%; top:90%; background:rgba(168,85,247,.7);  animation-duration:11s; animation-delay:-6s; }
    .p4  { width:3px; height:3px; left:55%; top:85%; background:rgba(99,102,241,.8);  animation-duration:17s; animation-delay:-2s; }
    .p5  { width:4px; height:4px; left:70%; top:75%; background:rgba(14,165,233,.7);  animation-duration:13s; animation-delay:-8s; }
    .p6  { width:3px; height:3px; left:82%; top:88%; background:rgba(236,72,153,.6);  animation-duration:19s; animation-delay:-4s; }
    .p7  { width:5px; height:5px; left:15%; top:60%; background:rgba(52,211,153,.6);  animation-duration:14s; animation-delay:-10s; }
    .p8  { width:3px; height:3px; left:90%; top:65%; background:rgba(129,140,248,.7); animation-duration:16s; animation-delay:-1s; }

    .auth-root.light .p { background: rgba(99,102,241,0.4); }
    .auth-root.light .p2 { background: rgba(6,182,212,0.4); }
    .auth-root.light .p3 { background: rgba(168,85,247,0.35); }

    @keyframes particleFloat {
      0%   { transform: translateY(0)    scale(0); opacity: 0; }
      10%  { opacity: 0.8; }
      50%  { transform: translateY(-45vh) scale(1.4); opacity: 0.5; }
      90%  { opacity: 0.2; }
      100% { transform: translateY(-90vh) scale(0.2); opacity: 0; }
    }

    /* ── GRAIN ──────────────────────────────────────── */
    .noise {
      position:absolute;inset:0;
      opacity:.03;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      pointer-events:none;z-index:0;
    }
    .auth-root.light .noise { opacity:.015; }

    /* ── TOP CONTROLS ──────────────────────────────── */
    .top-controls { position:fixed;top:18px;right:22px;z-index:100;display:flex;align-items:center;gap:10px; }

    .lang-switcher { display:flex;align-items:center;gap:2px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:9999px;padding:4px 10px;backdrop-filter:blur(14px);transition:background .4s,border .4s; }
    .auth-root.light .lang-switcher { background:rgba(99,102,241,.08);border-color:rgba(99,102,241,.2); }

    .lang-btn { background:none;border:none;cursor:pointer;font-size:.72rem;font-weight:700;letter-spacing:.08em;padding:3px 6px;border-radius:9999px;color:rgba(255,255,255,.45);transition:color .2s,background .2s; }
    .auth-root.light .lang-btn { color:rgba(30,27,75,.45); }
    .lang-btn.active { color:#fff;background:rgba(99,102,241,.55); }
    .auth-root.light .lang-btn.active { color:#fff;background:#4f46e5; }
    .lang-sep { color:rgba(255,255,255,.2);font-size:.7rem;user-select:none; }
    .auth-root.light .lang-sep { color:rgba(30,27,75,.2); }

    .theme-btn { width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,.7);transition:background .3s,border .3s,color .3s,transform .3s; }
    .theme-btn:hover { background:rgba(255,255,255,.18);transform:rotate(22deg) scale(1.1); }
    .auth-root.light .theme-btn { border-color:rgba(99,102,241,.25);background:rgba(99,102,241,.08);color:#4338ca; }
    .auth-root.light .theme-btn:hover { background:rgba(99,102,241,.18); }

    /* ═══════════════════════════════════════════════════
       LIGHT MODE — panel / form overrides
    ═══════════════════════════════════════════════════ */
    .auth-root.light .panel-left {
      background: linear-gradient(145deg, rgba(99,102,241,0.1) 0%, rgba(200,210,255,0.25) 100%);
      border-right: 1px solid rgba(99,102,241,0.12);
    }
    .auth-root.light .panel-headline { color:#1e1b4b; }
    .auth-root.light .brand-badge { background:rgba(99,102,241,.12);border-color:rgba(99,102,241,.3);color:#4338ca; }
    .auth-root.light .panel-sub { color:rgba(30,27,75,.6); }
    .auth-root.light .feature-item { color:rgba(30,27,75,.75); }
    .auth-root.light .panel-switch { color:rgba(30,27,75,.5); }
    .auth-root.light .panel-switch strong { color:#4f46e5; }
    .auth-root.light .form-card { background:rgba(255,255,255,.82);border:1px solid rgba(99,102,241,.15);box-shadow:0 20px 60px rgba(99,102,241,.12),inset 0 1px 0 rgba(255,255,255,.9); }
    .auth-root.light .form-header h2 { color:#1e1b4b; }
    .auth-root.light .sub-heading { color:rgba(30,27,75,.5); }
    .auth-root.light .field-group label { color:rgba(30,27,75,.6); }
    .auth-root.light .field-group.focused label { color:#4f46e5; }
    .auth-root.light .input-wrap input { background:rgba(99,102,241,.05);border:1px solid rgba(99,102,241,.2);color:#1e1b4b; }
    .auth-root.light .input-wrap input::placeholder { color:rgba(30,27,75,.35); }
    .auth-root.light .input-wrap input:focus { background:#fff;border-color:rgba(99,102,241,.5); }
    .auth-root.light .field-icon { color:rgba(30,27,75,.3); }
    .auth-root.light .field-group.focused .field-icon { color:#6366f1; }
    .auth-root.light .eye-btn { color:rgba(30,27,75,.35); }
    .auth-root.light .eye-btn:hover { color:rgba(30,27,75,.7); }
    .auth-root.light .remember { color:rgba(30,27,75,.6); }
    .auth-root.light .custom-check { border-color:rgba(30,27,75,.25); }
    .auth-root.light .back-home { color:rgba(30,27,75,.45); }
    .auth-root.light .back-home:hover { color:rgba(30,27,75,.85); }
    .auth-root.light .divider::before,.auth-root.light .divider::after { background:rgba(30,27,75,.12); }
    .auth-root.light .divider span { color:rgba(30,27,75,.4); }
    .auth-root.light .switch-text { color:rgba(30,27,75,.45); }
    .auth-root.light .switch-text a { color:#4f46e5; }
    .auth-root.light .forgot-link { color:#4f46e5; }
    .auth-root.light .eyebrow { color:#4f46e5; }

    /* ═══════════════════════════════════════════════════
       LAYOUT
    ═══════════════════════════════════════════════════ */
    .auth-wrapper { position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;width:100%;min-height:100vh; }

    .panel-left {
      position:relative;display:flex;align-items:center;justify-content:center;
      padding:60px 56px;
      background:linear-gradient(145deg,rgba(79,70,229,.15)0%,rgba(30,27,75,.25)100%);
      border-right:1px solid rgba(255,255,255,.06);
      overflow:hidden;animation:slideInLeft .7s cubic-bezier(.16,1,.3,1) both;
      transition:background 0.6s ease, border-color 0.6s ease;
    }
    @keyframes slideInLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
    .panel-inner { position:relative;z-index:2;max-width:400px; }

    .brand-badge { display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:9999px;background:rgba(79,70,229,.2);border:1px solid rgba(99,102,241,.4);color:#a5b4fc;font-size:.75rem;font-weight:700;letter-spacing:.05em;margin-bottom:32px;transition:background .5s,border-color .5s,color .5s; }
    .brand-dot { width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.3);animation:pulse 2s ease infinite; }
    @keyframes pulse { 0%,100%{box-shadow:0 0 0 3px rgba(16,185,129,.3)} 50%{box-shadow:0 0 0 6px rgba(16,185,129,.1)} }

    .panel-headline { font-size:clamp(2.8rem,5vw,4.5rem);font-weight:900;color:#fff;line-height:1.05;letter-spacing:-.04em;margin:0 0 20px;transition:color .5s; }
    .accent { color:#818cf8; }
    .panel-sub { color:rgba(255,255,255,.55);font-size:1rem;line-height:1.7;margin:0 0 36px;max-width:320px;transition:color .5s; }

    .feature-list { display:flex;flex-direction:column;gap:12px;margin-bottom:48px; }
    .feature-item { display:flex;align-items:center;gap:12px;color:rgba(255,255,255,.7);font-size:.88rem;font-weight:500;transition:color .5s; }
    .feature-icon { color:#818cf8;font-size:.75rem; }

    .panel-switch { display:inline-flex;align-items:center;gap:4px;color:rgba(255,255,255,.5);text-decoration:none;font-size:.88rem;transition:color .2s; }
    .panel-switch:hover { color:#a5b4fc; }
    .panel-switch strong { color:#818cf8;transition:color .5s; }

    .shape { position:absolute;pointer-events:none; }
    .shape-ring { width:400px;height:400px;border-radius:50%;border:1.5px solid rgba(99,102,241,.15);top:-100px;right:-150px;animation:spin 40s linear infinite; }
    .shape-ring::after { content:'';position:absolute;width:280px;height:280px;border-radius:50%;border:1px solid rgba(99,102,241,.1);top:60px;left:60px; }
    @keyframes spin { to{transform:rotate(360deg)} }
    .shape-blob { width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,.12),transparent 70%);bottom:-80px;left:-60px; }

    .panel-right { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 60px;animation:slideInRight .7s cubic-bezier(.16,1,.3,1) .1s both; }
    @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }

    .back-home { display:inline-flex;align-items:center;gap:6px;color:rgba(255,255,255,.4);text-decoration:none;font-size:.8rem;font-weight:600;align-self:flex-start;margin-bottom:32px;transition:color .2s; }
    .back-home:hover { color:rgba(255,255,255,.8); }

    .form-card { width:100%;max-width:440px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:40px;backdrop-filter:blur(24px);box-shadow:0 32px 80px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.07);transition:background .5s,border-color .5s,box-shadow .5s; }

    .form-header { margin-bottom:28px; }
    .eyebrow { font-size:.68rem;font-weight:800;letter-spacing:.15em;color:#818cf8;margin:0 0 10px;transition:color .5s; }
    .form-header h2 { font-size:1.8rem;font-weight:800;color:#fff;margin:0 0 8px;letter-spacing:-.03em;transition:color .5s; }
    .sub-heading { font-size:.85rem;color:rgba(255,255,255,.45);margin:0;transition:color .5s; }

    .field-group { margin-bottom:18px; }
    .field-group label { display:block;font-size:.75rem;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:8px;letter-spacing:.02em;transition:color .2s; }
    .field-group.focused label { color:#a5b4fc; }

    .input-wrap { position:relative; }
    .field-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.25);pointer-events:none;transition:color .2s; }
    .field-group.focused .field-icon { color:#818cf8; }

    .input-wrap input { width:100%;box-sizing:border-box;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:13px 44px 13px 42px;font:inherit;font-size:.9rem;color:#fff;outline:none;transition:border-color .25s,background .25s,box-shadow .25s,color .4s; }
    .input-wrap input::placeholder { color:rgba(255,255,255,.2); }
    .input-wrap input:focus { background:rgba(255,255,255,.08);border-color:rgba(129,140,248,.6); }

    .focus-ring { position:absolute;inset:-2px;border-radius:14px;border:2px solid transparent;background:linear-gradient(135deg,#6366f1,#06b6d4) border-box;-webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);-webkit-mask-composite:destination-out;mask-composite:exclude;opacity:0;transition:opacity .25s;pointer-events:none; }
    .field-group.focused .focus-ring { opacity:1; }

    .eye-btn { position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,.3);padding:4px;display:flex;transition:color .2s; }
    .eye-btn:hover { color:rgba(255,255,255,.7); }

    .row-opts { display:flex;justify-content:space-between;align-items:center;margin:4px 0 22px; }
    .remember { display:flex;align-items:center;gap:8px;cursor:pointer;font-size:.78rem;color:rgba(255,255,255,.5);transition:color .4s; }
    .remember input[type=checkbox] { display:none; }
    .custom-check { width:16px;height:16px;border:1.5px solid rgba(255,255,255,.2);border-radius:4px;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0; }
    .remember input:checked ~ .custom-check { background:#6366f1;border-color:#6366f1; }
    .remember input:checked ~ .custom-check::after { content:'';width:4px;height:7px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg) translateY(-1px); }
    .forgot-link { font-size:.78rem;font-weight:700;color:#818cf8;text-decoration:none;transition:color .2s; }
    .forgot-link:hover { color:#a5b4fc; }

    .error-msg { display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.25);color:#fca5a5;font-size:.8rem;margin-bottom:16px;animation:shake .4s cubic-bezier(.36,.07,.19,.97) both; }
    @keyframes shake { 10%,90%{transform:translateX(-2px)} 20%,80%{transform:translateX(4px)} 30%,50%,70%{transform:translateX(-4px)} 40%,60%{transform:translateX(4px)} }

    .btn-submit { position:relative;width:100%;border:none;border-radius:12px;padding:14px 24px;background:linear-gradient(135deg,#6366f1 0%,#4f46e5 50%,#7c3aed 100%);color:#fff;font-family:inherit;font-size:.93rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;overflow:hidden;transition:transform .2s,box-shadow .2s,opacity .2s;box-shadow:0 8px 24px rgba(99,102,241,.35); }
    .btn-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 14px 32px rgba(99,102,241,.5); }
    .btn-submit:active:not(:disabled) { transform:translateY(0); }
    .btn-submit:disabled { opacity:.55;cursor:not-allowed;transform:none; }
    .btn-shimmer { position:absolute;top:0;left:-120%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent); }
    .btn-submit:not(:disabled):hover .btn-shimmer { animation:shimmer .65s ease forwards; }
    @keyframes shimmer { to{left:120%} }

    .glow-loader { display:flex;align-items:center;gap:5px; }
    .gl-dot { width:8px;height:8px;border-radius:50%;background:#fff;animation:glowPulse 1.4s ease-in-out infinite; }
    .gl-dot:nth-child(1){animation-delay:0s}.gl-dot:nth-child(2){animation-delay:.15s}.gl-dot:nth-child(3){animation-delay:.3s}.gl-dot:nth-child(4){animation-delay:.45s}.gl-dot:nth-child(5){animation-delay:.6s}
    @keyframes glowPulse { 0%,100%{transform:scale(.5);opacity:.3;box-shadow:0 0 4px rgba(255,255,255,.2)} 50%{transform:scale(1.3);opacity:1;box-shadow:0 0 12px rgba(255,255,255,.9),0 0 24px rgba(129,140,248,.8)} }

    .divider { display:flex;align-items:center;gap:12px;margin:24px 0 18px; }
    .divider::before,.divider::after { content:'';flex:1;height:1px;background:rgba(255,255,255,.08);transition:background .5s; }
    .divider span { font-size:.72rem;color:rgba(255,255,255,.3);white-space:nowrap;transition:color .5s; }
    .social-row { display:flex;justify-content:center;margin-bottom:4px; }
    .switch-text { text-align:center;font-size:.82rem;color:rgba(255,255,255,.35);margin:18px 0 0;transition:color .5s; }
    .switch-text a { color:#818cf8;font-weight:700;text-decoration:none;transition:color .2s; }
    .switch-text a:hover { color:#a5b4fc; }

    @media (max-width:900px) {
      .auth-wrapper { grid-template-columns:1fr; }
      .panel-left { display:none; }
      .panel-right { padding:40px 24px; }
      .form-card { padding:32px 24px; }
    }
    @media (max-width:480px) {
      .form-card { padding:28px 20px;border-radius:20px; }
      .form-header h2 { font-size:1.55rem; }
      .top-controls { top:12px;right:12px; }
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

  // Synced with persistent THEME_KEY
  isLight = signal<boolean>(this.readInitialTheme() === 'light');

  // Synced with TranslationService
  lang = computed<'en' | 'kh'>(() => this.translationService.currentLang());

  t() { return T[this.lang()]; }

  toggleTheme() {
    const nextLight = !this.isLight();
    this.isLight.set(nextLight);
    try {
      localStorage.setItem(THEME_KEY, nextLight ? 'light' : 'dark');
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', !nextLight);
      }
    } catch {}
  }

  setLang(l: 'en' | 'kh') {
    this.translationService.setLanguage(l);
  }

  private readInitialTheme(): 'light' | 'dark' {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router,
    private translationService: TranslationService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.returnUrl.set(this.route.snapshot.queryParamMap.get('returnUrl') || '/');

    // Ensure dark class is aligned with isLight
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', !this.isLight());
    }

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
        this.toast.success(this.lang() === 'kh' ? 'សូមស្វាគមន៍ការវិលត្រឡប់!' : 'Welcome back!');
        const user = this.auth.currentUser();
        if (user?.role === 'admin' && safeUrl === '/') {
          this.router.navigate(['/admin']);
        } else if (user?.role === 'accountant' && safeUrl === '/') {
          this.router.navigate(['/accountant']);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set(this.t().errorMsg);
      },
    });
  }

  signInWithGoogle(credential: string) {
    this.loading.set(true);
    this.error.set(null);
    this.auth.loginWithGoogle(credential).subscribe({
      next: () => { 
        this.loading.set(false); 
        this.toast.success(this.lang() === 'kh' ? 'បានចូលគណនីតាម Google ដោយជោគជ័យ' : 'Signed in with Google.'); 
        const user = this.auth.currentUser();
        if (user?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user?.role === 'accountant') {
          this.router.navigate(['/accountant']);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(error.error?.message || (this.lang() === 'kh' ? 'មិនអាចចូលតាម Google បានទេ' : 'Google sign-in could not be completed.'));
      },
    });
  }
}
