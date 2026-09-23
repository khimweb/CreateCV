import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { GoogleSignInComponent } from '../../shared/components/auth/google-sign-in.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, GoogleSignInComponent],
  template: `
    <section class="auth-root" [class.ready]="ready()">
      <!-- Animated orbs -->
      <div class="orb orb-1" aria-hidden="true"></div>
      <div class="orb orb-2" aria-hidden="true"></div>
      <div class="orb orb-3" aria-hidden="true"></div>
      <div class="orb orb-4" aria-hidden="true"></div>
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
              Start your<br/>journey<span class="accent">.</span>
            </h1>
            <p class="panel-sub">Create a polished CV in minutes, then make every application count with AI-powered suggestions.</p>

            <div class="stats-row">
              <div class="stat">
                <span class="stat-num">10k+</span>
                <span class="stat-label">CVs created</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-num">20+</span>
                <span class="stat-label">Templates</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-num">Free</span>
                <span class="stat-label">To get started</span>
              </div>
            </div>

            <div class="testimonial">
              <div class="testimonial-text">"CQ-Professional helped me land my dream job. The templates are stunning!"</div>
              <div class="testimonial-author">
                <div class="author-avatar">S</div>
                <div>
                  <div class="author-name">Sokhim P.</div>
                  <div class="author-role">Software Engineer</div>
                </div>
              </div>
            </div>

            <a routerLink="/login" class="panel-switch">
              Already a member? <strong>Sign in →</strong>
            </a>
          </div>

          <div class="shape shape-ring"></div>
          <div class="shape shape-blob"></div>
        </aside>

        <!-- RIGHT PANEL — FORM -->
        <main class="panel-right">
          <a routerLink="/" class="back-home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Home
          </a>

          <div class="form-card">
            <div class="form-header">
              <p class="eyebrow">GET STARTED — FREE</p>
              <h2>Create your account</h2>
              <p class="sub-heading">Join thousands building better CVs today.</p>
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
                <label for="fullName">Full name</label>
                <div class="input-wrap">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input id="fullName" formControlName="fullName" type="text" placeholder="Your full name"
                    (focus)="nameFocused.set(true)" (blur)="nameFocused.set(false)" autocomplete="name" />
                  <div class="focus-ring"></div>
                  @if (form.get('fullName')?.value) {
                    <span class="field-check">✓</span>
                  }
                </div>
              </div>

              <!-- Email -->
              <div class="field-group" [class.focused]="emailFocused()" [class.filled]="form.get('email')?.value">
                <label for="email">Email address</label>
                <div class="input-wrap">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>
                  <input id="email" formControlName="email" type="email" placeholder="you@example.com"
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
                  Password
                  @if (form.get('password')?.value) {
                    <span class="pw-strength" [class]="pwStrengthClass()">{{ pwStrengthLabel() }}</span>
                  }
                </label>
                <div class="input-wrap">
                  <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input id="password" formControlName="password" [type]="showPw() ? 'text' : 'password'" placeholder="At least 8 characters"
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

                <!-- Password strength bar -->
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
                <span>I agree to the <a href="#" tabindex="-1">Terms of Service</a> and <a href="#" tabindex="-1">Privacy Policy</a></span>
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
                    <span class="gl-dot"></span>
                    <span class="gl-dot"></span>
                    <span class="gl-dot"></span>
                    <span class="gl-dot"></span>
                    <span class="gl-dot"></span>
                  </span>
                  <span>Creating account...</span>
                } @else {
                  <span>Create free account</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                }
                <span class="btn-shimmer"></span>
              </button>
            </form>

            <div class="divider"><span>or sign up with</span></div>
            <div class="social-row">
              <app-google-sign-in (credential)="signInWithGoogle($event)" />
            </div>

            <p class="switch-text">Already have an account? <a routerLink="/login">Sign in</a></p>
          </div>
        </main>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

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

    .orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; animation: orbFloat 12s ease-in-out infinite alternate; }
    .orb-1 { width: 600px; height: 600px; top: -200px; right: -200px; background: radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%); animation-delay: 0s; }
    .orb-2 { width: 500px; height: 500px; bottom: -150px; left: -150px; background: radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%); animation-delay: -4s; }
    .orb-3 { width: 400px; height: 400px; top: 30%; right: 25%; background: radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%); animation-delay: -8s; }
    .orb-4 { width: 300px; height: 300px; bottom: 20%; left: 30%; background: radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%); animation-delay: -2s; }
    @keyframes orbFloat { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(25px,-15px) scale(1.06); } 100% { transform: translate(-15px,25px) scale(0.96); } }

    .noise { position: absolute; inset: 0; opacity: 0.025; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); pointer-events: none; }

    .auth-wrapper { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; width: 100%; min-height: 100vh; }

    /* LEFT PANEL */
    .panel-left {
      position: relative; display: flex; align-items: center; justify-content: center;
      padding: 60px 56px;
      background: linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(10,20,50,0.3) 100%);
      border-right: 1px solid rgba(255,255,255,0.06);
      overflow: hidden;
      animation: slideInLeft 0.7s cubic-bezier(0.16,1,0.3,1) both;
    }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
    .panel-inner { position: relative; z-index: 2; max-width: 400px; }

    .brand-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 9999px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #6ee7b7; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 32px; }
    .brand-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.3); animation: pulse 2s ease infinite; }
    @keyframes pulse { 0%,100% { box-shadow: 0 0 0 3px rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 0 6px rgba(16,185,129,0.1); } }

    .panel-headline { font-size: clamp(2.8rem, 5vw, 4.5rem); font-weight: 900; color: #fff; line-height: 1.05; letter-spacing: -0.04em; margin: 0 0 20px; }
    .accent { color: #34d399; }
    .panel-sub { color: rgba(255,255,255,0.55); font-size: 1rem; line-height: 1.7; margin: 0 0 36px; max-width: 320px; }

    /* Stats */
    .stats-row { display: flex; align-items: center; gap: 20px; margin-bottom: 36px; }
    .stat { text-align: center; }
    .stat-num { display: block; font-size: 1.5rem; font-weight: 900; color: #fff; }
    .stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.4); }
    .stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.1); }

    /* Testimonial */
    .testimonial { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; margin-bottom: 36px; }
    .testimonial-text { font-size: 0.88rem; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 14px; font-style: italic; }
    .testimonial-author { display: flex; align-items: center; gap: 10px; }
    .author-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; color: #fff; }
    .author-name { font-size: 0.82rem; font-weight: 700; color: #fff; }
    .author-role { font-size: 0.72rem; color: rgba(255,255,255,0.4); }

    .panel-switch { display: inline-flex; align-items: center; gap: 4px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.88rem; transition: color 0.2s; }
    .panel-switch:hover { color: #6ee7b7; }
    .panel-switch strong { color: #34d399; }

    .shape { position: absolute; pointer-events: none; }
    .shape-ring { width: 400px; height: 400px; border-radius: 50%; border: 1.5px solid rgba(16,185,129,0.12); top: -100px; right: -150px; animation: spin 50s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .shape-blob { width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,0.1), transparent 70%); bottom: -80px; left: -60px; }

    /* RIGHT PANEL */
    .panel-right {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 48px 60px;
      animation: slideInRight 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both;
    }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }

    .back-home { display: inline-flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.8rem; font-weight: 600; align-self: flex-start; margin-bottom: 28px; transition: color 0.2s; }
    .back-home:hover { color: rgba(255,255,255,0.8); }

    .form-card { width: 100%; max-width: 460px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 36px 40px; backdrop-filter: blur(20px); box-shadow: 0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06); }

    .form-header { margin-bottom: 20px; }
    .eyebrow { font-size: 0.68rem; font-weight: 800; letter-spacing: 0.15em; color: #34d399; margin: 0 0 10px; }
    .form-header h2 { font-size: 1.7rem; font-weight: 800; color: #fff; margin: 0 0 6px; letter-spacing: -0.03em; }
    .sub-heading { font-size: 0.85rem; color: rgba(255,255,255,0.4); margin: 0; }

    /* Progress dots */
    .progress-dots { display: flex; gap: 6px; margin-bottom: 22px; }
    .pd { width: 20px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.1); transition: all 0.3s; }
    .pd.active { width: 36px; background: #34d399; }

    /* FIELDS */
    .field-group { margin-bottom: 16px; }
    .field-group label { display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.5); margin-bottom: 8px; letter-spacing: 0.02em; transition: color 0.2s; }
    .field-group.focused label { color: #a7f3d0; }

    .input-wrap { position: relative; }
    .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.25); pointer-events: none; transition: color 0.2s; }
    .field-group.focused .field-icon { color: #34d399; }

    .input-wrap input { width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 44px 13px 42px; font: inherit; font-size: 0.9rem; color: #fff; outline: none; transition: border-color 0.25s, background 0.25s; }
    .input-wrap input::placeholder { color: rgba(255,255,255,0.2); }
    .input-wrap input:focus { background: rgba(255,255,255,0.08); border-color: rgba(52,211,153,0.5); }

    .focus-ring { position: absolute; inset: -2px; border-radius: 14px; border: 2px solid transparent; background: linear-gradient(135deg, #34d399, #06b6d4) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask-composite: exclude; opacity: 0; transition: opacity 0.25s; pointer-events: none; }
    .field-group.focused .focus-ring { opacity: 1; }

    .field-check { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #34d399; font-size: 0.85rem; font-weight: 800; }
    .eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.3); padding: 4px; display: flex; transition: color 0.2s; }
    .eye-btn:hover { color: rgba(255,255,255,0.7); }

    /* Password strength */
    .pw-strength { font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px; }
    .pw-strength.weak { background: rgba(239,68,68,0.2); color: #fca5a5; }
    .pw-strength.fair { background: rgba(245,158,11,0.2); color: #fcd34d; }
    .pw-strength.strong { background: rgba(52,211,153,0.2); color: #6ee7b7; }

    .strength-bar { height: 3px; background: rgba(255,255,255,0.08); border-radius: 9999px; margin-top: 8px; overflow: hidden; }
    .sb-fill { height: 100%; border-radius: 9999px; transition: width 0.4s ease, background 0.3s; }
    .sb-fill.weak { background: #ef4444; }
    .sb-fill.fair { background: #f59e0b; }
    .sb-fill.strong { background: #34d399; }

    /* Terms */
    .terms-row { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 0.78rem; color: rgba(255,255,255,0.45); margin: 6px 0 18px; line-height: 1.5; }
    .terms-row input { display: none; }
    .custom-check { width: 17px; height: 17px; flex-shrink: 0; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 5px; margin-top: 1px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .terms-row input:checked ~ .custom-check { background: #10b981; border-color: #10b981; }
    .terms-row input:checked ~ .custom-check::after { content: ''; width: 4px; height: 7px; border: 2px solid #fff; border-top: none; border-left: none; transform: rotate(45deg) translateY(-1px); }
    .terms-row a { color: #34d399; text-decoration: none; font-weight: 700; }

    /* Error */
    .error-msg { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5; font-size: 0.8rem; margin-bottom: 16px; animation: shake 0.4s both; }
    @keyframes shake { 10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}30%,50%,70%{transform:translateX(-4px)}40%,60%{transform:translateX(4px)} }

    /* Submit */
    .btn-submit { position: relative; width: 100%; border: none; border-radius: 12px; padding: 14px 24px; background: linear-gradient(135deg, #10b981 0%, #059669 50%, #0891b2 100%); color: #fff; font-family: inherit; font-size: 0.93rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; box-shadow: 0 8px 24px rgba(16,185,129,0.35); }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(16,185,129,0.5); }
    .btn-submit:active:not(:disabled) { transform: translateY(0); }
    .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn-shimmer { position: absolute; top: 0; left: -120%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent); }
    .btn-submit:not(:disabled):hover .btn-shimmer { animation: shimmer 0.65s ease forwards; }
    @keyframes shimmer { to { left: 120%; } }

    /* Glow loader */
    .glow-loader { display: flex; align-items: center; gap: 5px; }
    .gl-dot { width: 8px; height: 8px; border-radius: 50%; background: #fff; animation: glowPulse 1.4s ease-in-out infinite; }
    .gl-dot:nth-child(1){animation-delay:0s}.gl-dot:nth-child(2){animation-delay:.15s}.gl-dot:nth-child(3){animation-delay:.3s}.gl-dot:nth-child(4){animation-delay:.45s}.gl-dot:nth-child(5){animation-delay:.6s}
    @keyframes glowPulse {
      0%,100% { transform: scale(0.5); opacity: 0.3; box-shadow: 0 0 4px rgba(255,255,255,0.2); }
      50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(52,211,153,0.8); }
    }

    /* Divider */
    .divider { display: flex; align-items: center; gap: 12px; margin: 22px 0 16px; }
    .divider::before,.divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
    .divider span { font-size: 0.72rem; color: rgba(255,255,255,0.3); white-space: nowrap; }
    .social-row { display: flex; justify-content: center; margin-bottom: 4px; }
    .switch-text { text-align: center; font-size: 0.82rem; color: rgba(255,255,255,0.35); margin: 16px 0 0; }
    .switch-text a { color: #34d399; font-weight: 700; text-decoration: none; transition: color 0.2s; }
    .switch-text a:hover { color: #6ee7b7; }

    /* RESPONSIVE */
    @media (max-width: 900px) {
      .auth-wrapper { grid-template-columns: 1fr; }
      .panel-left { display: none; }
      .panel-right { padding: 40px 24px; background: linear-gradient(160deg, #040e20 0%, #0a1635 60%, #060c1a 100%); }
      .form-card { padding: 30px 22px; }
    }
    @media (max-width: 480px) {
      .form-card { padding: 26px 18px; border-radius: 20px; }
      .form-header h2 { font-size: 1.5rem; }
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

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      terms: [false, Validators.requiredTrue],
    });
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
    if (pw.length < 6) return 'Weak';
    if (pw.length < 10) return 'Fair';
    return 'Strong';
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { fullName, email, password } = this.form.getRawValue();
    this.auth.register(fullName!, email!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('Account created! Welcome 🎉');
        this.router.navigate(['/my-cv']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
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
