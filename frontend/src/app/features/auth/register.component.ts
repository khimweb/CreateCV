import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { GoogleSignInComponent } from '../../shared/components/auth/google-sign-in.component';

const THEME_KEY = 'cv_creator_theme';

const T = {
  en: {
    eyebrow: 'GET STARTED — FREE',
    title: 'Create your account',
    subtitle: 'Join thousands building better CVs today.',
    fullName: 'Full name',
    fullNamePlaceholder: 'Your full name',
    email: 'Email address',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: 'At least 8 characters',
    terms: 'I agree to the',
    termsLink: 'Terms of Service',
    and: 'and',
    privacyLink: 'Privacy Policy',
    submit: 'Create free account',
    submitting: 'Creating account...',
    orSignUp: 'or sign up with',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    backHome: 'Home',
    headline1: 'Start your',
    headline2: 'journey',
    panelSub: 'Create a polished CV in minutes, then make every application count with AI-powered suggestions.',
    statCVs: 'CVs created',
    statTemplates: 'Templates',
    statFree: 'Free',
    statFreeLabel: 'To get started',
    testimonialText: '"CQ-Professional helped me land my dream job. The templates are stunning!"',
    authorRole: 'Software Engineer',
    alreadyMember: 'Already a member?',
    signInArrow: 'Sign in →',
    weak: 'Weak',
    fair: 'Fair',
    strong: 'Strong',
    errorMsg: 'Registration failed. Please try again.',
  },
  kh: {
    eyebrow: 'ចាប់ផ្តើម — ដោយឥតគិតថ្លៃ',
    title: 'បង្កើតគណនីរបស់អ្នក',
    subtitle: 'ចូលរួមជាមួយអ្នកប្រើរាប់ពាន់ ដែលកំពុងបង្កើត CV ប្រសើរជាងមុន។',
    fullName: 'ឈ្មោះពេញ',
    fullNamePlaceholder: 'ឈ្មោះរបស់អ្នក',
    email: 'អ៊ីមែល',
    emailPlaceholder: 'you@example.com',
    password: 'លេខសម្ងាត់',
    passwordPlaceholder: 'យ៉ាងហោចណាស់ 8 តួអក្សរ',
    terms: 'ខ្ញុំយល់ព្រមនឹង',
    termsLink: 'លក្ខខណ្ឌប្រើប្រាស់',
    and: 'និង',
    privacyLink: 'គោលការណ៍ឯកជនភាព',
    submit: 'បង្កើតគណនីដោយឥតគិតថ្លៃ',
    submitting: 'កំពុងបង្កើតគណនី...',
    orSignUp: 'ឬ ចុះឈ្មោះជាមួយ',
    haveAccount: 'មានគណនីរួចហើយ?',
    signIn: 'ចូល',
    backHome: 'ទំព័រដើម',
    headline1: 'ចាប់ផ្តើម',
    headline2: 'ការធ្វើដំណើររបស់អ្នក',
    panelSub: 'បង្កើត CV ស្អាតៗក្នុងរយៈពេលប៉ុន្មាននាទី ជាមួយ AI ដ៏ឆ្លាតវៃ។',
    statCVs: 'CV ត្រូវបានបង្កើត',
    statTemplates: 'គំរូ',
    statFree: 'ឥតគិតថ្លៃ',
    statFreeLabel: 'ចាប់ផ្តើម',
    testimonialText: '"CQ-Professional ជួយខ្ញុំទទួលបានការងារក្តីស្រមៃ។ គំរូស្អាតណាស់!"',
    authorRole: 'វិស្វករซoftware',
    alreadyMember: 'មានគណនីរួចហើយ?',
    signInArrow: 'ចូល →',
    weak: 'ខ្សោយ',
    fair: 'មធ្យម',
    strong: 'រឹងមាំ',
    errorMsg: 'ចុះឈ្មោះបរាជ័យ។ សូមព្យាយាមម្តងទៀត។',
  }
};

@Component({
  selector: 'app-register',
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

      <!-- Top-right controls: Language + Theme -->
      <div class="top-controls">
        <div class="lang-switcher">
          <button class="lang-btn" [class.active]="lang() === 'kh'" (click)="setLang('kh')">KH</button>
          <span class="lang-sep">|</span>
          <button class="lang-btn" [class.active]="lang() === 'en'" (click)="setLang('en')">EN</button>
        </div>
        <button class="theme-btn" (click)="toggleTheme()" [attr.aria-label]="isLight() ? 'Switch to dark mode' : 'Switch to light mode'">
          @if (isLight()) {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
            </svg>
          } @else {
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

            <div class="stats-row">
              <div class="stat">
                <span class="stat-num">10k+</span>
                <span class="stat-label">{{ t().statCVs }}</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-num">20+</span>
                <span class="stat-label">{{ t().statTemplates }}</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-num">{{ t().statFree }}</span>
                <span class="stat-label">{{ t().statFreeLabel }}</span>
              </div>
            </div>

            <div class="testimonial">
              <div class="testimonial-text">{{ t().testimonialText }}</div>
              <div class="testimonial-author">
                <div class="author-avatar">S</div>
                <div>
                  <div class="author-name">Sokhim P.</div>
                  <div class="author-role">{{ t().authorRole }}</div>
                </div>
              </div>
            </div>

            <a routerLink="/login" class="panel-switch">
              {{ t().alreadyMember }} <strong>{{ t().signInArrow }}</strong>
            </a>
          </div>

          <div class="shape shape-ring"></div>
          <div class="shape shape-blob"></div>
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

            <!-- Progress indicator -->
            <div class="progress-dots">
              <span class="pd active"></span>
              <span class="pd"></span>
              <span class="pd"></span>
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <!-- Full Name -->
              <div class="field-group" [class.focused]="nameFocused()" [class.filled]="form.get('fullName')?.value">
                <label for="fullName">{{ t().fullName }}</label>
                <div class="input-wrap">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input id="fullName" formControlName="fullName" type="text" [placeholder]="t().fullNamePlaceholder"
                    (focus)="nameFocused.set(true)" (blur)="nameFocused.set(false)" autocomplete="name" />
                  <div class="focus-ring"></div>
                  @if (form.get('fullName')?.value) {
                    <span class="field-check">✓</span>
                  }
                </div>
              </div>

              <!-- Email -->
              <div class="field-group" [class.focused]="emailFocused()" [class.filled]="form.get('email')?.value">
                <label for="email">{{ t().email }}</label>
                <div class="input-wrap">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>
                  <input id="email" formControlName="email" type="email" [placeholder]="t().emailPlaceholder"
                    (focus)="emailFocused.set(true)" (blur)="emailFocused.set(false)" autocomplete="email" />
                  <div class="focus-ring"></div>
                  @if (form.get('email')?.valid && form.get('email')?.value) {
                    <span class="field-check">✓</span>
                  }
                </div>
              </div>

              <!-- Password -->
              <div class="field-group" [class.focused]="pwFocused()" [class.filled]="form.get('password')?.value">
                <label for="password">
                  {{ t().password }}
                  @if (form.get('password')?.value) {
                    <span class="pw-strength" [class]="pwStrengthClass()">{{ pwStrengthLabel() }}</span>
                  }
                </label>
                <div class="input-wrap">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input id="password" formControlName="password" [type]="showPw() ? 'text' : 'password'" [placeholder]="t().passwordPlaceholder"
                    (focus)="pwFocused.set(true)" (blur)="pwFocused.set(false)" autocomplete="new-password" />
                  <button type="button" class="eye-btn" (click)="showPw.set(!showPw())" [attr.aria-label]="showPw() ? 'Hide password' : 'Show password'">
                    @if (showPw()) {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    } @else {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                  <div class="focus-ring"></div>
                </div>

                @if (form.get('password')?.value) {
                  <div class="strength-bar">
                    <div class="sb-fill" [class]="pwStrengthClass()" [style.width.%]="pwStrengthWidth()"></div>
                  </div>
                }
              </div>

              <!-- Terms -->
              <label class="terms-row">
                <input type="checkbox" formControlName="terms" />
                <span class="custom-check"></span>
                <span>{{ t().terms }} <a href="#" tabindex="-1">{{ t().termsLink }}</a> {{ t().and }} <a href="#" tabindex="-1">{{ t().privacyLink }}</a></span>
              </label>

              <!-- Error -->
              @if (error()) {
                <div class="error-msg" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ error() }}
                </div>
              }

              <!-- Submit -->
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

            <div class="divider"><span>{{ t().orSignUp }}</span></div>
            <div class="social-row">
              <app-google-sign-in (credential)="signInWithGoogle($event)" />
            </div>

            <p class="switch-text">{{ t().haveAccount }} <a routerLink="/login">{{ t().signIn }}</a></p>
          </div>
        </main>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    /* ═══════════════════════════════════════════════════
       ROOT & ANIMATED BACKGROUND
    ═══════════════════════════════════════════════════ */
    .auth-root {
      min-height: 100vh;
      display: flex;
      align-items: stretch;
      font-family: 'Inter', system-ui, sans-serif;
      position: relative;
      overflow: hidden;
      opacity: 0;
      background: linear-gradient(135deg, #041018 0%, #061c24 35%, #082424 70%, #04141d 100%);
      background-size: 400% 400%;
      animation: gradientShiftReg 16s ease infinite;
      transition: opacity 0.5s ease, background 0.8s ease;
    }
    .auth-root.ready { opacity: 1; }

    @keyframes gradientShiftReg {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* ── LIGHT MODE base ─────────────────────────────── */
    .auth-root.light {
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 35%, #f0fdfa 70%, #e6fffa 100%);
      background-size: 400% 400%;
      animation: gradientShiftLightReg 16s ease infinite;
    }
    @keyframes gradientShiftLightReg {
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
        radial-gradient(ellipse 80% 60% at 20% 20%, rgba(16,185,129,0.2) 0%, transparent 60%),
        radial-gradient(ellipse 65% 50% at 80% 80%, rgba(6,182,212,0.18) 0%, transparent 60%),
        radial-gradient(ellipse 50% 70% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 60%);
      animation: meshPulseReg 12s ease-in-out infinite alternate;
      transition: opacity 0.8s ease;
    }
    .auth-root.light .bg-mesh {
      background:
        radial-gradient(ellipse 80% 60% at 20% 20%, rgba(16,185,129,0.15) 0%, transparent 60%),
        radial-gradient(ellipse 65% 50% at 80% 80%, rgba(5,150,105,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 50% 70% at 50% 50%, rgba(6,182,212,0.10) 0%, transparent 60%);
    }
    @keyframes meshPulseReg {
      0%   { opacity: 0.7; transform: scale(1) rotate(0deg); }
      50%  { opacity: 1;   transform: scale(1.04) rotate(1.5deg); }
      100% { opacity: 0.8; transform: scale(0.97) rotate(-1deg); }
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
      filter: blur(65px);
    }
    .auth-root.light .aurora { mix-blend-mode: multiply; }

    .aurora-1 {
      width: 65vw; height: 45vh;
      top: -12%;  left: -8%;
      background: linear-gradient(135deg, rgba(16,185,129,0.45), rgba(52,211,153,0.25), transparent);
      animation: auroraMoveReg1 19s ease-in-out infinite alternate;
    }
    .aurora-2 {
      width: 60vw; height: 50vh;
      bottom: -15%; right: -10%;
      background: linear-gradient(225deg, rgba(6,182,212,0.4), rgba(16,185,129,0.25), transparent);
      animation: auroraMoveReg2 23s ease-in-out infinite alternate;
    }
    .aurora-3 {
      width: 50vw; height: 40vh;
      top: 30%;  left: 28%;
      background: linear-gradient(45deg, rgba(5,150,105,0.3), rgba(14,165,233,0.2), transparent);
      animation: auroraMoveReg3 25s ease-in-out infinite alternate;
    }
    .auth-root.light .aurora-1 { background: linear-gradient(135deg, rgba(16,185,129,0.22), rgba(52,211,153,0.12), transparent); }
    .auth-root.light .aurora-2 { background: linear-gradient(225deg, rgba(6,182,212,0.18), rgba(16,185,129,0.12), transparent); }
    .auth-root.light .aurora-3 { background: linear-gradient(45deg, rgba(5,150,105,0.14), rgba(14,165,233,0.10), transparent); }

    @keyframes auroraMoveReg1 {
      0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.6; }
      50%  { transform: translate(7%, 6%) scale(1.08) rotate(3deg); opacity: 0.85; }
      100% { transform: translate(-5%, -4%) scale(0.96) rotate(-2deg); opacity: 0.7; }
    }
    @keyframes auroraMoveReg2 {
      0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.55; }
      50%  { transform: translate(-6%, 5%) scale(1.06) rotate(-3deg); opacity: 0.8; }
      100% { transform: translate(5%, -5%) scale(0.98) rotate(2deg); opacity: 0.65; }
    }
    @keyframes auroraMoveReg3 {
      0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.45; }
      50%  { transform: translate(-8%, -5%) scale(1.1) rotate(4deg); opacity: 0.75; }
      100% { transform: translate(6%, 7%) scale(0.94) rotate(-3deg); opacity: 0.55; }
    }

    /* ═══════════════════════════════════════════════════
       FLOATING ORBS
    ═══════════════════════════════════════════════════ */
    .orb {
      position: absolute; border-radius: 50%;
      filter: blur(80px); pointer-events: none; z-index: 0;
      transition: background 0.8s ease, opacity 0.8s ease;
    }
    .orb-1 { width:650px;height:650px;top:-220px;right:-180px; background:radial-gradient(circle,rgba(16,185,129,.45)0%,rgba(52,211,153,.2)40%,transparent 70%); animation:orbFloat1 15s ease-in-out infinite alternate; }
    .orb-2 { width:520px;height:520px;bottom:-180px;left:-160px; background:radial-gradient(circle,rgba(99,102,241,.4)0%,rgba(129,140,248,.18)40%,transparent 70%); animation:orbFloat2 18s ease-in-out infinite alternate; }
    .orb-3 { width:420px;height:420px;top:28%;right:22%; background:radial-gradient(circle,rgba(6,182,212,.35)0%,transparent 70%); animation:orbFloat3 22s ease-in-out infinite alternate; }
    .orb-4 { width:340px;height:340px;bottom:20%;left:28%; background:radial-gradient(circle,rgba(168,85,247,.25)0%,transparent 70%); animation:orbFloat4 20s ease-in-out infinite alternate; }
    .orb-5 { width:260px;height:260px;top:15%;left:15%; background:radial-gradient(circle,rgba(52,211,153,.3)0%,transparent 70%); animation:orbFloat5 17s ease-in-out infinite alternate; }

    .auth-root.light .orb-1 { background:radial-gradient(circle,rgba(16,185,129,.22)0%,transparent 70%); }
    .auth-root.light .orb-2 { background:radial-gradient(circle,rgba(99,102,241,.18)0%,transparent 70%); }
    .auth-root.light .orb-3 { background:radial-gradient(circle,rgba(6,182,212,.15)0%,transparent 70%); }
    .auth-root.light .orb-4 { background:radial-gradient(circle,rgba(16,185,129,.12)0%,transparent 70%); }
    .auth-root.light .orb-5 { background:radial-gradient(circle,rgba(52,211,153,.15)0%,transparent 70%); }

    @keyframes orbFloat1 {
      0%   { transform: translate(0,0) scale(1); opacity:.85; }
      50%  { transform: translate(-35px,40px) scale(1.08); opacity:.7; }
      100% { transform: translate(25px,-30px) scale(.95); opacity:.8; }
    }
    @keyframes orbFloat2 {
      0%   { transform: translate(0,0) scale(1); opacity:.8; }
      50%  { transform: translate(45px,-35px) scale(1.06); opacity:.6; }
      100% { transform: translate(-20px,25px) scale(.98); opacity:.75; }
    }
    @keyframes orbFloat3 {
      0%   { transform: translate(0,0) scale(1); opacity:.7; }
      50%  { transform: translate(-30px,-40px) scale(1.1); opacity:.85; }
      100% { transform: translate(35px,30px) scale(.92); opacity:.6; }
    }
    @keyframes orbFloat4 {
      0%   { transform: translate(0,0) scale(1); opacity:.6; }
      50%  { transform: translate(30px,35px) scale(1.08); opacity:.8; }
      100% { transform: translate(-40px,-20px) scale(.94); opacity:.5; }
    }
    @keyframes orbFloat5 {
      0%   { transform: translate(0,0) scale(1); opacity:.55; }
      50%  { transform: translate(-25px,30px) scale(1.1); opacity:.75; }
      100% { transform: translate(30px,-25px) scale(.95); opacity:.5; }
    }

    /* ═══════════════════════════════════════════════════
       FLOATING PARTICLES
    ═══════════════════════════════════════════════════ */
    .particles { position:absolute;inset:0;pointer-events:none;z-index:0; }
    .p {
      position: absolute;
      border-radius: 50%;
      animation: particleFloatReg linear infinite;
      opacity: 0;
      transition: background 0.8s ease;
    }
    .p1  { width:4px; height:4px; left:12%; top:82%; background:rgba(52,211,153,.8); animation-duration:13s; animation-delay:0s; }
    .p2  { width:3px; height:3px; left:28%; top:72%; background:rgba(6,182,212,.7);   animation-duration:15s; animation-delay:-2s; }
    .p3  { width:5px; height:5px; left:42%; top:88%; background:rgba(16,185,129,.7);  animation-duration:12s; animation-delay:-5s; }
    .p4  { width:3px; height:3px; left:58%; top:84%; background:rgba(99,102,241,.8);  animation-duration:16s; animation-delay:-3s; }
    .p5  { width:4px; height:4px; left:72%; top:76%; background:rgba(52,211,153,.7);  animation-duration:14s; animation-delay:-7s; }
    .p6  { width:3px; height:3px; left:85%; top:86%; background:rgba(6,182,212,.6);   animation-duration:18s; animation-delay:-4s; }
    .p7  { width:5px; height:5px; left:18%; top:62%; background:rgba(16,185,129,.6);  animation-duration:14s; animation-delay:-9s; }
    .p8  { width:3px; height:3px; left:92%; top:68%; background:rgba(52,211,153,.7);  animation-duration:17s; animation-delay:-1s; }

    .auth-root.light .p { background: rgba(16,185,129,0.45); }
    .auth-root.light .p2 { background: rgba(6,182,212,0.4); }
    .auth-root.light .p4 { background: rgba(99,102,241,0.35); }

    @keyframes particleFloatReg {
      0%   { transform: translateY(0) scale(0); opacity: 0; }
      12%  { opacity: 0.8; }
      50%  { transform: translateY(-45vh) scale(1.4); opacity: 0.5; }
      90%  { opacity: 0.2; }
      100% { transform: translateY(-90vh) scale(0.2); opacity: 0; }
    }

    /* ── GRAIN ──────────────────────────────────────── */
    .noise {
      position:absolute;inset:0;
      opacity:.025;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      pointer-events:none;z-index:0;
    }
    .auth-root.light .noise { opacity:.012; }

    /* ── TOP CONTROLS ──────────────────────────────── */
    .top-controls { position:fixed;top:18px;right:22px;z-index:100;display:flex;align-items:center;gap:10px; }

    .lang-switcher { display:flex;align-items:center;gap:2px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:9999px;padding:4px 10px;backdrop-filter:blur(14px);transition:background .4s,border .4s; }
    .auth-root.light .lang-switcher { background:rgba(16,185,129,.08);border-color:rgba(16,185,129,.2); }

    .lang-btn { background:none;border:none;cursor:pointer;font-size:.72rem;font-weight:700;letter-spacing:.08em;padding:3px 6px;border-radius:9999px;color:rgba(255,255,255,.45);transition:color .2s,background .2s; }
    .auth-root.light .lang-btn { color:rgba(6,78,59,.5); }
    .lang-btn.active { color:#fff;background:rgba(16,185,129,.55); }
    .auth-root.light .lang-btn.active { color:#fff;background:#059669; }
    .lang-sep { color:rgba(255,255,255,.2);font-size:.7rem;user-select:none; }
    .auth-root.light .lang-sep { color:rgba(6,78,59,.2); }

    .theme-btn { width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,.7);transition:background .3s,border .3s,color .3s,transform .3s; }
    .theme-btn:hover { background:rgba(255,255,255,.18);transform:rotate(22deg) scale(1.1); }
    .auth-root.light .theme-btn { border-color:rgba(16,185,129,.25);background:rgba(16,185,129,.08);color:#065f46; }
    .auth-root.light .theme-btn:hover { background:rgba(16,185,129,.18); }

    /* ═══════════════════════════════════════════════════
       LIGHT MODE — panel / form overrides
    ═══════════════════════════════════════════════════ */
    .auth-root.light .panel-left {
      background: linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(200,255,235,0.3) 100%);
      border-right: 1px solid rgba(16,185,129,0.15);
    }
    .auth-root.light .panel-headline { color: #064e3b; }
    .auth-root.light .brand-badge { background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.3); color: #065f46; }
    .auth-root.light .panel-sub { color: rgba(6,78,59,0.65); }
    .auth-root.light .stats-row .stat-num { color: #064e3b; }
    .auth-root.light .stats-row .stat-label { color: rgba(6,78,59,0.5); }
    .auth-root.light .stats-row .stat-divider { background: rgba(16,185,129,0.2); }
    .auth-root.light .testimonial { background: rgba(16,185,129,0.07); border-color: rgba(16,185,129,0.15); }
    .auth-root.light .testimonial-text { color: rgba(6,78,59,0.75); }
    .auth-root.light .author-name { color: #064e3b; }
    .auth-root.light .author-role { color: rgba(6,78,59,0.5); }
    .auth-root.light .panel-switch { color: rgba(6,78,59,0.5); }
    .auth-root.light .panel-switch strong { color: #059669; }

    .auth-root.light .form-card {
      background: rgba(255,255,255,0.85);
      border: 1px solid rgba(16,185,129,0.18);
      box-shadow: 0 20px 60px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
    }
    .auth-root.light .eyebrow { color: #059669; }
    .auth-root.light .form-header h2 { color: #064e3b; }
    .auth-root.light .sub-heading { color: rgba(6,78,59,0.55); }
    .auth-root.light .field-group label { color: rgba(6,78,59,0.65); }
    .auth-root.light .field-group.focused label { color: #059669; }
    .auth-root.light .input-wrap input { background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.2); color: #064e3b; }
    .auth-root.light .input-wrap input::placeholder { color: rgba(6,78,59,0.35); }
    .auth-root.light .input-wrap input:focus { background: #fff; border-color: rgba(16,185,129,0.5); }
    .auth-root.light .field-icon { color: rgba(6,78,59,0.3); }
    .auth-root.light .field-group.focused .field-icon { color: #10b981; }
    .auth-root.light .eye-btn { color: rgba(6,78,59,0.4); }
    .auth-root.light .eye-btn:hover { color: rgba(6,78,59,0.75); }
    .auth-root.light .terms-row { color: rgba(6,78,59,0.6); }
    .auth-root.light .terms-row a { color: #059669; }
    .auth-root.light .custom-check { border-color: rgba(6,78,59,0.25); }
    .auth-root.light .back-home { color: rgba(6,78,59,0.45); }
    .auth-root.light .back-home:hover { color: rgba(6,78,59,0.85); }
    .auth-root.light .divider::before, .auth-root.light .divider::after { background: rgba(6,78,59,0.12); }
    .auth-root.light .divider span { color: rgba(6,78,59,0.4); }
    .auth-root.light .switch-text { color: rgba(6,78,59,0.45); }
    .auth-root.light .switch-text a { color: #059669; }
    .auth-root.light .pd { background: rgba(16,185,129,0.15); }
    .auth-root.light .pd.active { background: #10b981; }

    /* ═══════════════════════════════════════════════════
       LAYOUT & PANELS
    ═══════════════════════════════════════════════════ */
    .auth-wrapper { position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;width:100%;min-height:100vh; }

    .panel-left {
      position:relative;display:flex;align-items:center;justify-content:center;
      padding:60px 56px;
      background:linear-gradient(145deg,rgba(16,185,129,.1)0%,rgba(10,20,50,.3)100%);
      border-right:1px solid rgba(255,255,255,.06);
      overflow:hidden;animation:slideInLeft .7s cubic-bezier(.16,1,.3,1) both;
      transition:background 0.6s ease, border-color 0.6s ease;
    }
    @keyframes slideInLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
    .panel-inner { position:relative;z-index:2;max-width:400px; }

    .brand-badge { display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:9999px;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);color:#6ee7b7;font-size:.75rem;font-weight:700;letter-spacing:.05em;margin-bottom:32px;transition:background .5s,border-color .5s,color .5s; }
    .brand-dot { width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.3);animation:pulse 2s ease infinite; }
    @keyframes pulse { 0%,100%{box-shadow:0 0 0 3px rgba(16,185,129,.3)} 50%{box-shadow:0 0 0 6px rgba(16,185,129,.1)} }

    .panel-headline { font-size:clamp(2.2rem,4vw,4rem);font-weight:900;color:#fff;line-height:1.1;letter-spacing:-.04em;margin:0 0 20px;transition:color .5s; }
    .accent { color:#34d399; }
    .panel-sub { color:rgba(255,255,255,.55);font-size:1rem;line-height:1.7;margin:0 0 36px;max-width:320px;transition:color .5s; }

    .stats-row { display:flex;align-items:center;gap:20px;margin-bottom:36px; }
    .stat { text-align:center; }
    .stat-num { display:block;font-size:1.5rem;font-weight:900;color:#fff;transition:color .5s; }
    .stat-label { font-size:.72rem;color:rgba(255,255,255,.4);transition:color .5s; }
    .stat-divider { width:1px;height:36px;background:rgba(255,255,255,.1);transition:background .5s; }

    .testimonial { background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:20px;margin-bottom:36px;transition:background .5s,border-color .5s; }
    .testimonial-text { font-size:.88rem;color:rgba(255,255,255,.7);line-height:1.6;margin-bottom:14px;font-style:italic;transition:color .5s; }
    .testimonial-author { display:flex;align-items:center;gap:10px; }
    .author-avatar { width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.8rem;color:#fff; }
    .author-name { font-size:.82rem;font-weight:700;color:#fff;transition:color .5s; }
    .author-role { font-size:.72rem;color:rgba(255,255,255,.4);transition:color .5s; }

    .panel-switch { display:inline-flex;align-items:center;gap:4px;color:rgba(255,255,255,.5);text-decoration:none;font-size:.88rem;transition:color .2s; }
    .panel-switch:hover { color:#6ee7b7; }
    .panel-switch strong { color:#34d399;transition:color .5s; }

    .shape { position:absolute;pointer-events:none; }
    .shape-ring { width:400px;height:400px;border-radius:50%;border:1.5px solid rgba(16,185,129,.12);top:-100px;right:-150px;animation:spin 50s linear infinite; }
    @keyframes spin { to{transform:rotate(360deg)} }
    .shape-blob { width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,.1),transparent 70%);bottom:-80px;left:-60px; }

    /* RIGHT PANEL */
    .panel-right { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 60px;animation:slideInRight .7s cubic-bezier(.16,1,.3,1) .1s both; }
    @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }

    .back-home { display:inline-flex;align-items:center;gap:6px;color:rgba(255,255,255,.4);text-decoration:none;font-size:.8rem;font-weight:600;align-self:flex-start;margin-bottom:28px;transition:color .2s; }
    .back-home:hover { color:rgba(255,255,255,.8); }

    .form-card { width:100%;max-width:460px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:36px 40px;backdrop-filter:blur(24px);box-shadow:0 32px 80px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.07);transition:background .5s,border-color .5s,box-shadow .5s; }

    .form-header { margin-bottom:20px; }
    .eyebrow { font-size:.68rem;font-weight:800;letter-spacing:.12em;color:#34d399;margin:0 0 10px;transition:color .5s; }
    .form-header h2 { font-size:1.7rem;font-weight:800;color:#fff;margin:0 0 6px;letter-spacing:-.03em;transition:color .5s; }
    .sub-heading { font-size:.85rem;color:rgba(255,255,255,.4);margin:0;transition:color .5s; }

    .progress-dots { display:flex;gap:6px;margin-bottom:22px; }
    .pd { width:20px;height:4px;border-radius:2px;background:rgba(255,255,255,.1);transition:all .3s; }
    .pd.active { width:36px;background:#34d399; }

    /* FIELDS */
    .field-group { margin-bottom:16px; }
    .field-group label { display:flex;align-items:center;justify-content:space-between;font-size:.75rem;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:8px;letter-spacing:.02em;transition:color .2s; }
    .field-group.focused label { color:#a7f3d0; }

    .input-wrap { position:relative; }
    .field-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.25);pointer-events:none;transition:color .2s; }
    .field-group.focused .field-icon { color:#34d399; }

    .input-wrap input { width:100%;box-sizing:border-box;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:13px 44px 13px 42px;font:inherit;font-size:.9rem;color:#fff;outline:none;transition:border-color .25s,background .25s,color .4s; }
    .input-wrap input::placeholder { color:rgba(255,255,255,.2); }
    .input-wrap input:focus { background:rgba(255,255,255,.08);border-color:rgba(52,211,153,.5); }

    .focus-ring { position:absolute;inset:-2px;border-radius:14px;border:2px solid transparent;background:linear-gradient(135deg,#34d399,#06b6d4) border-box;-webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);-webkit-mask-composite:destination-out;mask-composite:exclude;opacity:0;transition:opacity .25s;pointer-events:none; }
    .field-group.focused .focus-ring { opacity:1; }

    .field-check { position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#34d399;font-size:.85rem;font-weight:800; }
    .eye-btn { position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,.3);padding:4px;display:flex;transition:color .2s; }
    .eye-btn:hover { color:rgba(255,255,255,.7); }

    .pw-strength { font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:9999px; }
    .pw-strength.weak { background:rgba(239,68,68,.2);color:#fca5a5; }
    .pw-strength.fair { background:rgba(245,158,11,.2);color:#fcd34d; }
    .pw-strength.strong { background:rgba(52,211,153,.2);color:#6ee7b7; }

    .strength-bar { height:3px;background:rgba(255,255,255,.08);border-radius:9999px;margin-top:8px;overflow:hidden; }
    .sb-fill { height:100%;border-radius:9999px;transition:width .4s ease,background .3s; }
    .sb-fill.weak { background:#ef4444; }
    .sb-fill.fair { background:#f59e0b; }
    .sb-fill.strong { background:#34d399; }

    .terms-row { display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:.78rem;color:rgba(255,255,255,.45);margin:6px 0 18px;line-height:1.5;transition:color .4s; }
    .terms-row input { display:none; }
    .custom-check { width:17px;height:17px;flex-shrink:0;border:1.5px solid rgba(255,255,255,.2);border-radius:5px;margin-top:1px;display:flex;align-items:center;justify-content:center;transition:all .2s; }
    .terms-row input:checked ~ .custom-check { background:#10b981;border-color:#10b981; }
    .terms-row input:checked ~ .custom-check::after { content:'';width:4px;height:7px;border:2px solid #fff;border-top:none;border-left:none;transform:rotate(45deg) translateY(-1px); }
    .terms-row a { color:#34d399;text-decoration:none;font-weight:700; }

    .error-msg { display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.25);color:#fca5a5;font-size:.8rem;margin-bottom:16px;animation:shake .4s both; }
    @keyframes shake { 10%,90%{transform:translateX(-2px)} 20%,80%{transform:translateX(4px)} 30%,50%,70%{transform:translateX(-4px)} 40%,60%{transform:translateX(4px)} }

    .btn-submit { position:relative;width:100%;border:none;border-radius:12px;padding:14px 24px;background:linear-gradient(135deg,#10b981 0%,#059669 50%,#0891b2 100%);color:#fff;font-family:inherit;font-size:.93rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;overflow:hidden;transition:transform .2s,box-shadow .2s,opacity .2s;box-shadow:0 8px 24px rgba(16,185,129,.35); }
    .btn-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 14px 32px rgba(16,185,129,.5); }
    .btn-submit:active:not(:disabled) { transform:translateY(0); }
    .btn-submit:disabled { opacity:.55;cursor:not-allowed; }
    .btn-shimmer { position:absolute;top:0;left:-120%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent); }
    .btn-submit:not(:disabled):hover .btn-shimmer { animation:shimmer .65s ease forwards; }
    @keyframes shimmer { to{left:120%} }

    .glow-loader { display:flex;align-items:center;gap:5px; }
    .gl-dot { width:8px;height:8px;border-radius:50%;background:#fff;animation:glowPulse 1.4s ease-in-out infinite; }
    .gl-dot:nth-child(1){animation-delay:0s}.gl-dot:nth-child(2){animation-delay:.15s}.gl-dot:nth-child(3){animation-delay:.3s}.gl-dot:nth-child(4){animation-delay:.45s}.gl-dot:nth-child(5){animation-delay:.6s}
    @keyframes glowPulse { 0%,100%{transform:scale(.5);opacity:.3;box-shadow:0 0 4px rgba(255,255,255,.2)} 50%{transform:scale(1.3);opacity:1;box-shadow:0 0 12px rgba(255,255,255,.9),0 0 24px rgba(52,211,153,.8)} }

    .divider { display:flex;align-items:center;gap:12px;margin:22px 0 16px; }
    .divider::before,.divider::after { content:'';flex:1;height:1px;background:rgba(255,255,255,.08);transition:background .5s; }
    .divider span { font-size:.72rem;color:rgba(255,255,255,.3);white-space:nowrap;transition:color .5s; }
    .social-row { display:flex;justify-content:center;margin-bottom:4px; }
    .switch-text { text-align:center;font-size:.82rem;color:rgba(255,255,255,.35);margin:16px 0 0;transition:color .5s; }
    .switch-text a { color:#34d399;font-weight:700;text-decoration:none;transition:color .2s; }
    .switch-text a:hover { color:#6ee7b7; }

    @media (max-width:900px) {
      .auth-wrapper { grid-template-columns:1fr; }
      .panel-left { display:none; }
      .panel-right { padding:40px 24px; }
      .form-card { padding:30px 22px; }
    }
    @media (max-width:480px) {
      .form-card { padding:26px 18px;border-radius:20px; }
      .form-header h2 { font-size:1.5rem; }
      .top-controls { top:12px;right:12px; }
    }
  `],
})
export class RegisterComponent {
  form: FormGroup;
  error = signal<string | null>(null);
  showPw = signal(false);
  loading = signal(false);
  nameFocused = signal(false);
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
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
    private translationService: TranslationService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      terms: [false, Validators.requiredTrue],
    });

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', !this.isLight());
    }

    setTimeout(() => this.ready.set(true), 50);
  }

  pwStrengthWidth(): number {
    const pw = this.form.get('password')?.value || '';
    if (pw.length < 6) return 25;
    if (pw.length < 10) return 55;
    return 100;
  }

  pwStrengthClass(): string {
    const pw = this.form.get('password')?.value || '';
    if (pw.length < 6) return 'weak';
    if (pw.length < 10) return 'fair';
    return 'strong';
  }

  pwStrengthLabel(): string {
    const pw = this.form.get('password')?.value || '';
    if (pw.length < 6) return this.t().weak;
    if (pw.length < 10) return this.t().fair;
    return this.t().strong;
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { fullName, email, password } = this.form.getRawValue();
    this.auth.register(fullName!, email!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success(this.lang() === 'kh' ? 'បង្កើតគណនីជោគជ័យ! សូមស្វាគមន៍ 🎉' : 'Account created! Welcome 🎉');
        this.router.navigate(['/my-cv']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || this.t().errorMsg);
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
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(error.error?.message || (this.lang() === 'kh' ? 'មិនអាចចូលតាម Google បានទេ' : 'Google sign-in could not be completed.'));
      },
    });
  }
}
