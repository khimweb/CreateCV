import { Component, ElementRef, ViewChild, ViewChildren, QueryList, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { gsap } from 'gsap';
import { ToastService } from '../../shared/components/toast/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { AuthService, AuthUser } from '../../core/services/auth.service';

const THEME_KEY = 'cv_creator_theme';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-page" [class.light]="isLight()">
      <!-- ── Animated background system ── -->
      <div class="bg-mesh" aria-hidden="true"></div>
      <div class="aurora aurora-1" aria-hidden="true"></div>
      <div class="aurora aurora-2" aria-hidden="true"></div>
      <div class="aurora aurora-3" aria-hidden="true"></div>
      <div class="orb orb-1" aria-hidden="true"></div>
      <div class="orb orb-2" aria-hidden="true"></div>
      <div class="orb orb-3" aria-hidden="true"></div>
      <div class="orb orb-4" aria-hidden="true"></div>
      <div class="orb orb-5" aria-hidden="true"></div>
      <div class="particles" aria-hidden="true">
        <span class="p p1"></span><span class="p p2"></span><span class="p p3"></span>
        <span class="p p4"></span><span class="p p5"></span><span class="p p6"></span>
        <span class="p p7"></span><span class="p p8"></span>
      </div>
      <div class="noise" aria-hidden="true"></div>

      <!-- Top-right controls: Dark/Light + Language -->
      <div class="top-controls">
        <div class="lang-switcher">
          <button type="button" class="lang-btn" [class.active]="i18n.currentLang() === 'kh'" (click)="setLang('kh')">KH</button>
          <span class="lang-sep">|</span>
          <button type="button" class="lang-btn" [class.active]="i18n.currentLang() === 'en'" (click)="setLang('en')">EN</button>
        </div>

        <button type="button" class="theme-btn" (click)="toggleTheme()" [attr.aria-label]="isLight() ? 'Switch to dark mode' : 'Switch to light mode'">
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

      <div class="auth-container">
        <!-- Prominent Back to Login Button -->
        <a routerLink="/login" class="back-home-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span>{{ i18n.currentLang() === 'kh' ? 'ត្រឡប់ទៅចូលគណនី' : 'Back to Login' }}</span>
        </a>

        <div class="auth-card-wrapper step-card" #cardContainer>
          
          <!-- Top Brand Header -->
          <div class="card-header">
            <a routerLink="/login" class="back-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>{{ i18n.currentLang() === 'kh' ? 'ត្រឡប់ទៅចូលគណនី' : 'Back to Login' }}</span>
            </a>
            <div class="brand-pill">
              <span class="brand-badge">CQ</span>
              <span class="brand-title">Security Center</span>
            </div>
          </div>

          <!-- Progress Stepper Indicator -->
          <div class="stepper">
            <div class="step-item" [class.active]="step() === 'request'" [class.done]="step() === 'otp' || step() === 'new-password' || step() === 'success'">
              <div class="step-circle">1</div>
              <span class="step-label">{{ i18n.currentLang() === 'kh' ? 'ជ្រើសរើស' : 'Method' }}</span>
            </div>
            <div class="step-line" [class.filled]="step() === 'otp' || step() === 'new-password' || step() === 'success'"></div>
            <div class="step-item" [class.active]="step() === 'otp'" [class.done]="step() === 'new-password' || step() === 'success'">
              <div class="step-circle">2</div>
              <span class="step-label">OTP</span>
            </div>
            <div class="step-line" [class.filled]="step() === 'new-password' || step() === 'success'"></div>
            <div class="step-item" [class.active]="step() === 'new-password' || step() === 'success'" [class.done]="step() === 'success'">
              <div class="step-circle">3</div>
              <span class="step-label">{{ i18n.currentLang() === 'kh' ? 'ពាក្យសម្ងាត់' : 'Password' }}</span>
            </div>
          </div>

          <!-- STEP 1: CHOOSE METHOD & ENTER DESTINATION -->
          @if (step() === 'request') {
            <div class="step-content animate-step">
              <div class="heading">
                <h2>{{ i18n.currentLang() === 'kh' ? 'ភ្លេចពាក្យសម្ងាត់?' : 'Forgot Password?' }}</h2>
                <p class="sub">
                  {{ i18n.currentLang() === 'kh' 
                    ? 'ជ្រើសរើសមធ្យោបាយទទួលលេខកូដផ្ទៀងផ្ទាត់ OTP ដើម្បីកំណត់ពាក្យសម្ងាត់ថ្មី' 
                    : 'Select how you want to receive your 6-digit verification code' }}
                </p>
              </div>

              <!-- Pill Toggle: Email vs SMS -->
              <div class="method-toggle">
                <button type="button" 
                        class="toggle-tab" 
                        [class.active]="method() === 'email'"
                        (click)="switchMethod('email')">
                  <span class="tab-icon">✉️</span>
                  <span>{{ i18n.currentLang() === 'kh' ? 'តាម Email' : 'Via Email' }}</span>
                </button>
                <button type="button" 
                        class="toggle-tab" 
                        [class.active]="method() === 'sms'"
                        (click)="switchMethod('sms')">
                  <span class="tab-icon">📱</span>
                  <span>{{ i18n.currentLang() === 'kh' ? 'តាម SMS ទូរស័ព្ទ' : 'Via SMS' }}</span>
                </button>
              </div>

              <!-- Input form -->
              <form (ngSubmit)="onRequestOtp()" class="form-body">
                @if (method() === 'email') {
                  <div class="form-group">
                    <label>
                      {{ i18n.currentLang() === 'kh' ? 'អាសយដ្ឋាន Email' : 'Email Address' }}
                    </label>
                    <div class="input-wrap">
                      <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <input type="email" 
                             [(ngModel)]="destinationInput" 
                             name="emailDestination"
                             placeholder="you@example.com" 
                             required 
                             autocomplete="email" />
                    </div>
                  </div>
                } @else {
                  <div class="form-group">
                    <label>
                      {{ i18n.currentLang() === 'kh' ? 'លេខទូរស័ព្ទ (SMS)' : 'Mobile Phone Number (SMS)' }}
                    </label>
                    <div class="input-wrap">
                      <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <input type="tel" 
                             [(ngModel)]="destinationInput" 
                             name="phoneDestination"
                             placeholder="012 345 678 or +855 12 345 678" 
                             required 
                             autocomplete="tel" />
                    </div>
                  </div>
                }

                @if (error()) {
                  <div class="error-banner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>{{ error() }}</span>
                  </div>
                }

                <button type="submit" 
                        class="submit-btn" 
                        [disabled]="loading() || !destinationInput.trim()">
                  @if (loading()) {
                    <span class="spinner"></span>
                    <span>{{ i18n.currentLang() === 'kh' ? 'កំពុងផ្ញើកូដ...' : 'Sending Code...' }}</span>
                  } @else {
                    <span>{{ i18n.currentLang() === 'kh' ? 'ផ្ញើលេខកូដ OTP' : 'Send Verification Code' }}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  }
                </button>
              </form>

              <!-- Return to Login Row -->
              <div class="bottom-login-row">
                <span class="sub-text">{{ i18n.currentLang() === 'kh' ? 'ចាំលេខសម្ងាត់បានវិញ?' : 'Remember your password?' }}</span>
                <a routerLink="/login" class="login-highlight-btn">
                  {{ i18n.currentLang() === 'kh' ? 'ត្រឡប់ទៅចូលគណនី' : 'Back to Login' }} →
                </a>
              </div>
            </div>
          }

          <!-- STEP 2: 6-DIGIT OTP VERIFICATION -->
          @if (step() === 'otp') {
            <div class="step-content animate-step">
              <div class="heading">
                <div class="otp-badge-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h2>{{ i18n.currentLang() === 'kh' ? 'ផ្ទៀងផ្ទាត់លេខកូដ ៦ ខ្ទង់' : 'Enter 6-Digit OTP' }}</h2>
                <p class="sub">
                  {{ i18n.currentLang() === 'kh' 
                    ? 'លេខកូដត្រូវបានផ្ញើទៅកាន់ ' 
                    : 'We sent a verification code to ' }}
                  <strong class="text-indigo-600 dark:text-indigo-400">{{ maskedDestination() }}</strong>
                </p>
              </div>

              <!-- DISPATCHED CHANNELS STATUS -->
              <div class="dispatch-channels-card">
                <div class="channel-pill">
                  <span class="channel-icon">✉️</span>
                  <div class="channel-info">
                    <span class="channel-name">Email</span>
                    <span class="channel-status">{{ maskedDestination() }}</span>
                  </div>
                </div>
                <div class="channel-divider"></div>
                <div class="channel-pill">
                  <span class="channel-icon">🤖</span>
                  <div class="channel-info">
                    <span class="channel-name">Telegram Bot</span>
                    <span class="channel-status active">&#64;cqprofessionalpayment_bot</span>
                  </div>
                </div>
              </div>

              <!-- 10-MINUTE EXPIRY ANIMATED COUNTDOWN TIMER -->
              <div class="ten-minute-timer-card" [class.urgent]="otpExpiresIn() < 120">
                <div class="timer-top-row">
                  <div class="timer-badge">
                    <span class="live-dot"></span>
                    <span class="timer-label">
                      {{ i18n.currentLang() === 'kh' ? 'សុពលភាពលេខកូដ (១០ នាទី)' : '10-Min Expiry Window' }}
                    </span>
                  </div>
                  <div class="timer-digital-clock" [class.danger]="otpExpiresIn() < 60">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span class="digits">{{ formattedTimeLeft() }}</span>
                  </div>
                </div>
                <div class="timer-progress-track">
                  <div class="timer-progress-fill" 
                       [style.width.%]="(otpExpiresIn() / 600) * 100" 
                       [class.warning]="otpExpiresIn() < 180" 
                       [class.danger]="otpExpiresIn() < 60"></div>
                </div>
              </div>

              @if (!emailSent() && method() === 'email') {
                <div class="smtp-notice-box">
                  <div class="notice-title">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>{{ i18n.currentLang() === 'kh' ? 'ដំណឹងកំណត់ Email Server' : 'Email Delivery Notice' }}</span>
                  </div>
                  <p class="notice-text">
                    {{ i18n.currentLang() === 'kh' 
                      ? 'លេខកូដត្រូវបានបញ្ជូនទៅ Telegram Bot រួចរាល់! ដើម្បីទទួលក្នុង Email Inbox ផ្ទាល់ សូមកំណត់ SMTP_USER និង SMTP_PASS ក្នុង backend/.env។'
                      : 'OTP was dispatched to your Telegram Bot! To also deliver directly to your Gmail inbox, configure SMTP_USER and SMTP_PASS in backend/.env.' }}
                  </p>
                </div>
              }

              <!-- 6 Individual Digit Boxes with strict browser autofill prevention -->
              <div class="otp-group" #otpGroup (paste)="onOtpPaste($event)" autocomplete="off">
                @for (digit of otpDigits; track $index) {
                  <input type="text"
                         inputmode="numeric"
                         pattern="[0-9]*"
                         maxlength="1"
                         class="otp-digit"
                         [name]="'cq-auth-digit-' + $index"
                         [id]="'cq-auth-digit-' + $index"
                         autocomplete="one-time-code"
                         autocorrect="off"
                         autocapitalize="off"
                         spellcheck="false"
                         data-lpignore="true"
                         data-1p-ignore="true"
                         data-form-type="other"
                         data-bwignore="true"
                         [value]="digit"
                         (input)="onDigitInput($event, $index)"
                         (keydown)="onDigitKeyDown($event, $index)"
                         #otpInput />
                }
              </div>

              @if (error()) {
                <div class="error-banner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{{ error() }}</span>
                </div>
              }

              <!-- Action Buttons: Verify & Cancel -->
              <div class="action-buttons-row">
                <button type="button" 
                        class="submit-btn flex-1" 
                        [disabled]="loading() || isOtpIncomplete() || otpExpiresIn() <= 0"
                        (click)="onVerifyOtp()">
                  @if (loading()) {
                    <span class="spinner"></span>
                    <span>{{ i18n.currentLang() === 'kh' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Verifying...' }}</span>
                  } @else {
                    <span>{{ i18n.currentLang() === 'kh' ? 'ផ្ទៀងផ្ទាត់កូដ' : 'Verify Code' }}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  }
                </button>

                <!-- DEDICATED CANCEL BUTTON (Requested by user) -->
                <button type="button" 
                        class="cancel-btn" 
                        [disabled]="loading()"
                        (click)="onCancelReset()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span>{{ i18n.currentLang() === 'kh' ? 'បោះបង់' : 'Cancel' }}</span>
                </button>
              </div>

              <!-- Resend Timer & Change Method -->
              <div class="resend-row">
                @if (resendCountdown() > 0) {
                  <span class="countdown-text">
                    ⏱️ {{ i18n.currentLang() === 'kh' ? 'អាចផ្ញើម្ដងទៀតក្នុងរយៈពេល' : 'Resend code in' }} 
                    <strong>{{ resendCountdown() }}s</strong>
                  </span>
                } @else {
                  <button type="button" class="resend-btn" (click)="onRequestOtp(true)">
                    🔄 {{ i18n.currentLang() === 'kh' ? 'ផ្ញើកូដម្ដងទៀត' : 'Resend Code' }}
                  </button>
                }
                <button type="button" class="change-method-btn" (click)="goToStep('request')">
                  {{ i18n.currentLang() === 'kh' ? 'ប្ដូរវិធីទទួល' : 'Change method' }}
                </button>
              </div>
            </div>
          }

          <!-- STEP 3: NEW PASSWORD OR SKIP (USER REQUESTED FEATURE) -->
          @if (step() === 'new-password') {
            <div class="step-content animate-step">
              <div class="heading">
                <div class="key-badge-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-1.5 1.5L14 9l-3 3-2-2-4 4 2 2-4 4 3 3 4-4 2 2 4-4-2-2 3.5-3.5L22 4l-1-2z"/></svg>
                </div>
                <h2>{{ i18n.currentLang() === 'kh' ? 'បង្កើតពាក្យសម្ងាត់ថ្មី' : 'Set New Password' }}</h2>
                <p class="sub">
                  {{ i18n.currentLang() === 'kh'
                    ? 'អ្នកអាចបង្កើតពាក្យសម្ងាត់ថ្មីឥឡូវនេះ ឬរំលង (Skip) ប្រសិនបើមិនចង់ប្ដូរ' 
                    : 'Create a new secure password or skip this step to keep your current one.' }}
                </p>
              </div>

              <form (ngSubmit)="onResetPassword()" class="form-body">
                <!-- New Password Field -->
                <div class="form-group">
                  <label>{{ i18n.currentLang() === 'kh' ? 'ពាក្យសម្ងាត់ថ្មី' : 'New Password' }}</label>
                  <div class="input-wrap">
                    <input [type]="showNewPw() ? 'text' : 'password'"
                           [(ngModel)]="newPassword" 
                           name="newPassword"
                           placeholder="••••••••" 
                           required 
                           minlength="8"
                           (input)="calculateStrength()" />
                    <button type="button" class="eye-btn" (click)="showNewPw.set(!showNewPw())">
                      @if (showNewPw()) {
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      } @else {
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>

                  <!-- Password Strength Meter -->
                  <div class="strength-bar-wrap">
                    <div class="strength-bar">
                      <div class="strength-fill" [style.width.%]="pwStrengthScore() * 25" [style.backgroundColor]="pwStrengthColor()"></div>
                    </div>
                    <span class="strength-label" [style.color]="pwStrengthColor()">{{ pwStrengthLabel() }}</span>
                  </div>
                </div>

                <!-- Confirm Password Field -->
                <div class="form-group">
                  <label>{{ i18n.currentLang() === 'kh' ? 'ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ថ្មី' : 'Confirm Password' }}</label>
                  <div class="input-wrap">
                    <input [type]="showConfirmPw() ? 'text' : 'password'"
                           [(ngModel)]="confirmPassword" 
                           name="confirmPassword"
                           placeholder="••••••••" 
                           required 
                           minlength="8" />
                    <button type="button" class="eye-btn" (click)="showConfirmPw.set(!showConfirmPw())">
                      @if (showConfirmPw()) {
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      } @else {
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                @if (error()) {
                  <div class="error-banner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>{{ error() }}</span>
                  </div>
                }

                <!-- ACTION BUTTONS: RESET vs SKIP -->
                <div class="action-buttons">
                  <!-- Primary Action: Save Password -->
                  <button type="submit" 
                          class="submit-btn" 
                          [disabled]="loading() || newPassword.length < 8 || newPassword !== confirmPassword">
                    @if (loading()) {
                      <span class="spinner"></span>
                      <span>{{ i18n.currentLang() === 'kh' ? 'កំពុងរក្សាទុក...' : 'Updating...' }}</span>
                    } @else {
                      <span>{{ i18n.currentLang() === 'kh' ? 'ផ្លាស់ប្ដូរពាក្យសម្ងាត់' : 'Save New Password' }}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    }
                  </button>

                  <!-- Secondary Action: SKIP & LOGIN (User Request) -->
                  <button type="button" 
                          class="skip-btn" 
                          [disabled]="loading()"
                          (click)="onSkipPasswordReset()">
                    <span style="font-size: 1.05rem; margin-right: 2px;">🚀</span>
                    <span>{{ i18n.currentLang() === 'kh' ? 'រំលង & ចូលទៅទំព័រដើម' : 'Skip & Go to Home Page' }}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>

                  <!-- Cancel Button -->
                  <button type="button" 
                          class="cancel-link-btn" 
                          (click)="onCancelReset()">
                    {{ i18n.currentLang() === 'kh' ? 'បោះបង់ការកំណត់ពាក្យសម្ងាត់' : 'Cancel reset process' }}
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- STEP 4: SUCCESS CONFIRMATION -->
          @if (step() === 'success') {
            <div class="step-content success-card animate-step">
              <div class="success-icon-wrap">
                <svg class="success-checkmark" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2>{{ i18n.currentLang() === 'kh' ? 'ជោគជ័យ!' : 'Password Reset Complete!' }}</h2>
              <p class="sub">
                {{ i18n.currentLang() === 'kh'
                  ? 'ពាក្យសម្ងាត់របស់អ្នកត្រូវបានផ្លាស់ប្ដូរដោយជោគជ័យ។ ឥឡូវនេះអ្នកអាចចូលប្រើប្រាស់គណនីបាន។'
                  : 'Your account password has been safely updated. You can now use your account.' }}
              </p>

              <div class="success-actions">
                <a routerLink="/login" class="submit-btn" style="text-decoration:none; justify-content:center;">
                  <span>{{ i18n.currentLang() === 'kh' ? 'ត្រឡប់ទៅចូលគណនីឥឡូវនេះ' : 'Back to Login' }}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a routerLink="/" class="secondary-btn" style="text-decoration:none; justify-content:center;">
                  <span>{{ i18n.currentLang() === 'kh' ? 'ទៅកាន់ទំព័រដើម' : 'Go to Home Page' }}</span>
                </a>
              </div>
            </div>
          }

        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ═══════════════════════════════════════════════════
       ROOT & ANIMATED BACKGROUND
    ═══════════════════════════════════════════════════ */
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      position: relative;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif;
      /* Dark mode base animated gradient */
      background: linear-gradient(135deg, #050a18 0%, #0a0d2e 35%, #080c22 70%, #060b1a 100%);
      background-size: 400% 400%;
      animation: gradientShiftFp 14s ease infinite;
      transition: background 0.8s ease;
    }

    @keyframes gradientShiftFp {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* ── LIGHT MODE base ─────────────────────────────── */
    .auth-page.light {
      background: linear-gradient(135deg, #eef2ff 0%, #f0f4ff 35%, #ede9fe 70%, #e0e7ff 100%);
      background-size: 400% 400%;
      animation: gradientShiftLightFp 14s ease infinite;
    }
    @keyframes gradientShiftLightFp {
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
        radial-gradient(ellipse 80% 60% at 20% 20%, rgba(99,102,241,0.2) 0%, transparent 60%),
        radial-gradient(ellipse 65% 50% at 80% 80%, rgba(6,182,212,0.18) 0%, transparent 60%),
        radial-gradient(ellipse 50% 70% at 50% 50%, rgba(168,85,247,0.12) 0%, transparent 60%);
      animation: meshPulseFp 10s ease-in-out infinite alternate;
      transition: opacity 0.8s ease;
    }
    .auth-page.light .bg-mesh {
      background:
        radial-gradient(ellipse 80% 60% at 20% 20%, rgba(99,102,241,0.14) 0%, transparent 60%),
        radial-gradient(ellipse 65% 50% at 80% 80%, rgba(79,70,229,0.11) 0%, transparent 60%),
        radial-gradient(ellipse 50% 70% at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 60%);
    }
    @keyframes meshPulseFp {
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
      filter: blur(65px);
    }
    .auth-page.light .aurora { mix-blend-mode: multiply; }

    .aurora-1 {
      width: 70vw; height: 42vh;
      top: -10%; left: -10%;
      background: linear-gradient(135deg, rgba(99,102,241,0.48), rgba(168,85,247,0.3), transparent);
      animation: auroraMoveFp1 18s ease-in-out infinite alternate;
    }
    .aurora-2 {
      width: 60vw; height: 50vh;
      bottom: -15%; right: -10%;
      background: linear-gradient(225deg, rgba(6,182,212,0.42), rgba(79,70,229,0.28), transparent);
      animation: auroraMoveFp2 22s ease-in-out infinite alternate;
    }
    .aurora-3 {
      width: 50vw; height: 42vh;
      top: 30%; left: 30%;
      background: linear-gradient(45deg, rgba(168,85,247,0.32), rgba(14,165,233,0.22), transparent);
      animation: auroraMoveFp3 26s ease-in-out infinite alternate;
    }
    .auth-page.light .aurora-1 { background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.15), transparent); }
    .auth-page.light .aurora-2 { background: linear-gradient(225deg, rgba(6,182,212,0.2), rgba(79,70,229,0.15), transparent); }
    .auth-page.light .aurora-3 { background: linear-gradient(45deg, rgba(168,85,247,0.15), rgba(14,165,233,0.12), transparent); }

    @keyframes auroraMoveFp1 {
      0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.6; }
      50%  { transform: translate(7%, 5%) scale(1.08) rotate(3deg); opacity: 0.85; }
      100% { transform: translate(-5%, 6%) scale(0.96) rotate(-2deg); opacity: 0.7; }
    }
    @keyframes auroraMoveFp2 {
      0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.55; }
      50%  { transform: translate(-6%, 4%) scale(1.07) rotate(-3deg); opacity: 0.8; }
      100% { transform: translate(4%, -5%) scale(0.98) rotate(2deg); opacity: 0.65; }
    }
    @keyframes auroraMoveFp3 {
      0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.45; }
      50%  { transform: translate(-7%, -6%) scale(1.1) rotate(4deg); opacity: 0.75; }
      100% { transform: translate(5%, 7%) scale(0.94) rotate(-3deg); opacity: 0.55; }
    }

    /* ═══════════════════════════════════════════════════
       FLOATING ORBS
    ═══════════════════════════════════════════════════ */
    .orb {
      position: absolute; border-radius: 50%;
      filter: blur(80px); pointer-events: none; z-index: 0;
      transition: background 0.8s ease, opacity 0.8s ease;
    }
    .orb-1 { width:650px;height:650px;top:-220px;left:-180px; background:radial-gradient(circle,rgba(79,70,229,.48)0%,rgba(99,102,241,.2)40%,transparent 70%); animation:orb1FpFloat 16s ease-in-out infinite alternate; }
    .orb-2 { width:540px;height:540px;bottom:-180px;right:-160px; background:radial-gradient(circle,rgba(6,182,212,.42)0%,rgba(14,165,233,.18)40%,transparent 70%); animation:orb2FpFloat 20s ease-in-out infinite alternate; }
    .orb-3 { width:420px;height:420px;top:32%;left:32%; background:radial-gradient(circle,rgba(168,85,247,.32)0%,transparent 70%); animation:orb3FpFloat 24s ease-in-out infinite alternate; }
    .orb-4 { width:320px;height:320px;top:10%;right:22%; background:radial-gradient(circle,rgba(6,182,212,.28)0%,transparent 70%); animation:orb4FpFloat 18s ease-in-out infinite alternate; }
    .orb-5 { width:280px;height:280px;bottom:14%;left:16%; background:radial-gradient(circle,rgba(236,72,153,.22)0%,transparent 70%); animation:orb5FpFloat 22s ease-in-out infinite alternate; }

    .auth-page.light .orb-1 { background:radial-gradient(circle,rgba(99,102,241,.22)0%,transparent 70%); }
    .auth-page.light .orb-2 { background:radial-gradient(circle,rgba(6,182,212,.18)0%,transparent 70%); }
    .auth-page.light .orb-3 { background:radial-gradient(circle,rgba(168,85,247,.14)0%,transparent 70%); }
    .auth-page.light .orb-4 { background:radial-gradient(circle,rgba(99,102,241,.12)0%,transparent 70%); }
    .auth-page.light .orb-5 { background:radial-gradient(circle,rgba(236,72,153,.10)0%,transparent 70%); }

    @keyframes orb1FpFloat {
      0%   { transform: translate(0,0) scale(1); opacity:.9; }
      50%  { transform: translate(35px,-30px) scale(1.08); opacity:.7; }
      100% { transform: translate(-25px,35px) scale(.95); opacity:.85; }
    }
    @keyframes orb2FpFloat {
      0%   { transform: translate(0,0) scale(1); opacity:.8; }
      50%  { transform: translate(-45px,30px) scale(1.07); opacity:.6; }
      100% { transform: translate(30px,-35px) scale(.98); opacity:.75; }
    }
    @keyframes orb3FpFloat {
      0%   { transform: translate(0,0) scale(1); opacity:.7; }
      50%  { transform: translate(30px,-35px) scale(1.1); opacity:.85; }
      100% { transform: translate(-35px,30px) scale(.93); opacity:.6; }
    }
    @keyframes orb4FpFloat {
      0%   { transform: translate(0,0) scale(1); opacity:.6; }
      50%  { transform: translate(-30px,35px) scale(1.08); opacity:.8; }
      100% { transform: translate(35px,-25px) scale(.95); opacity:.5; }
    }
    @keyframes orb5FpFloat {
      0%   { transform: translate(0,0) scale(1); opacity:.55; }
      50%  { transform: translate(30px,25px) scale(1.1); opacity:.75; }
      100% { transform: translate(-25px,-30px) scale(.94); opacity:.5; }
    }

    /* ═══════════════════════════════════════════════════
       FLOATING PARTICLES
    ═══════════════════════════════════════════════════ */
    .particles { position:absolute;inset:0;pointer-events:none;z-index:0; }
    .p {
      position: absolute;
      border-radius: 50%;
      animation: particleFloatFp linear infinite;
      opacity: 0;
      transition: background 0.8s ease;
    }
    .p1  { width:4px; height:4px; left:10%; top:80%; background:rgba(129,140,248,.8); animation-duration:12s; animation-delay:0s; }
    .p2  { width:3px; height:3px; left:26%; top:70%; background:rgba(6,182,212,.7);   animation-duration:15s; animation-delay:-3s; }
    .p3  { width:5px; height:5px; left:42%; top:90%; background:rgba(168,85,247,.7);  animation-duration:11s; animation-delay:-6s; }
    .p4  { width:3px; height:3px; left:58%; top:84%; background:rgba(99,102,241,.8);  animation-duration:16s; animation-delay:-2s; }
    .p5  { width:4px; height:4px; left:72%; top:75%; background:rgba(14,165,233,.7);  animation-duration:13s; animation-delay:-8s; }
    .p6  { width:3px; height:3px; left:84%; top:88%; background:rgba(236,72,153,.6);  animation-duration:18s; animation-delay:-4s; }
    .p7  { width:5px; height:5px; left:16%; top:60%; background:rgba(52,211,153,.6);  animation-duration:14s; animation-delay:-10s; }
    .p8  { width:3px; height:3px; left:91%; top:65%; background:rgba(129,140,248,.7); animation-duration:16s; animation-delay:-1s; }

    .auth-page.light .p { background: rgba(99,102,241,0.4); }
    .auth-page.light .p2 { background: rgba(6,182,212,0.4); }
    .auth-page.light .p3 { background: rgba(168,85,247,0.35); }

    @keyframes particleFloatFp {
      0%   { transform: translateY(0) scale(0); opacity: 0; }
      12%  { opacity: 0.8; }
      50%  { transform: translateY(-45vh) scale(1.4); opacity: 0.5; }
      90%  { opacity: 0.2; }
      100% { transform: translateY(-90vh) scale(0.2); opacity: 0; }
    }

    /* ── GRAIN ──────────────────────────────────────── */
    .noise {
      position:absolute;inset:0;
      opacity:.028;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      pointer-events:none;z-index:0;
    }
    .auth-page.light .noise { opacity:.015; }

    /* ── TOP CONTROLS ──────────────────────────────── */
    .top-controls { position:fixed;top:18px;right:22px;z-index:100;display:flex;align-items:center;gap:10px; }

    .lang-switcher { display:flex;align-items:center;gap:2px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:9999px;padding:4px 10px;backdrop-filter:blur(14px);transition:background .4s,border .4s; }
    .auth-page.light .lang-switcher { background:rgba(99,102,241,.08);border-color:rgba(99,102,241,.2); }

    .lang-btn { background:none;border:none;cursor:pointer;font-size:.72rem;font-weight:700;letter-spacing:.08em;padding:3px 6px;border-radius:9999px;color:rgba(255,255,255,.45);transition:color .2s,background .2s; }
    .auth-page.light .lang-btn { color:rgba(30,27,75,.45); }
    .lang-btn.active { color:#fff;background:rgba(99,102,241,.55); }
    .auth-page.light .lang-btn.active { color:#fff;background:#4f46e5; }
    .lang-sep { color:rgba(255,255,255,.2);font-size:.7rem;user-select:none; }
    .auth-page.light .lang-sep { color:rgba(30,27,75,.2); }

    .theme-btn { width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,.7);transition:background .3s,border .3s,color .3s,transform .3s; }
    .theme-btn:hover { background:rgba(255,255,255,.18);transform:rotate(22deg) scale(1.1); }
    .auth-page.light .theme-btn { border-color:rgba(99,102,241,.25);background:rgba(99,102,241,.08);color:#4338ca; }
    .auth-page.light .theme-btn:hover { background:rgba(99,102,241,.18); }

    /* ═══════════════════════════════════════════════════
       CONTAINER & CARD
    ═══════════════════════════════════════════════════ */
    .auth-container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 500px;
    }

    .auth-card-wrapper {
      background: rgba(17, 24, 48, 0.72);
      border-radius: 28px;
      padding: 36px 32px;
      backdrop-filter: blur(28px);
      box-shadow: 0 32px 80px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
      transition: background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;
    }
    .auth-page.light .auth-card-wrapper {
      background: rgba(255, 255, 255, 0.88);
      border-color: rgba(99, 102, 241, 0.18);
      box-shadow: 0 25px 60px -15px rgba(30, 58, 138, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.95);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .back-btn:hover {
      color: #818cf8;
    }
    .auth-page.light .back-btn {
      color: #64748b;
    }
    .auth-page.light .back-btn:hover {
      color: #4f46e5;
    }

    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 800;
      color: #e2e8f0;
      transition: background 0.3s, color 0.3s;
    }
    .auth-page.light .brand-pill {
      background: rgba(99, 102, 241, 0.08);
      border-color: rgba(99, 102, 241, 0.2);
      color: #1e1b4b;
    }
    .brand-badge {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #fff;
      padding: 1px 5px;
      border-radius: 6px;
      font-size: 0.68rem;
    }

    /* Stepper */
    .stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
      padding: 0 12px;
    }
    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      position: relative;
      z-index: 2;
    }
    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 800;
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.45);
      border: 2px solid rgba(255, 255, 255, 0.12);
      transition: all 0.3s ease;
    }
    .auth-page.light .step-circle {
      background: #f1f5f9;
      color: #94a3b8;
      border-color: #e2e8f0;
    }
    .step-label {
      font-size: 0.68rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.45);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: color 0.3s;
    }
    .auth-page.light .step-label {
      color: #94a3b8;
    }
    .step-item.active .step-circle {
      background: #6366f1;
      color: #fff;
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25);
    }
    .auth-page.light .step-item.active .step-circle {
      background: #4f46e5;
      border-color: #4f46e5;
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);
    }
    .step-item.active .step-label {
      color: #818cf8;
    }
    .auth-page.light .step-item.active .step-label {
      color: #4f46e5;
    }
    .step-item.done .step-circle {
      background: #10b981;
      color: #fff;
      border-color: #10b981;
    }
    .step-line {
      flex: 1;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      margin: 0 8px -18px;
      position: relative;
      z-index: 1;
      transition: background 0.3s ease;
    }
    .auth-page.light .step-line {
      background: #e2e8f0;
    }
    .step-line.filled {
      background: #10b981;
    }

    /* Content Headings */
    .heading {
      text-align: center;
      margin-bottom: 24px;
    }
    .heading h2 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 8px;
      transition: color 0.3s;
    }
    .auth-page.light .heading h2 {
      color: #1e1b4b;
    }
    .heading .sub {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.55);
      margin: 0;
      line-height: 1.5;
      transition: color 0.3s;
    }
    .auth-page.light .heading .sub {
      color: #64748b;
    }

    /* Method Toggle */
    .method-toggle {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 4px;
      border-radius: 14px;
      gap: 4px;
      margin-bottom: 22px;
      transition: background 0.3s, border-color 0.3s;
    }
    .auth-page.light .method-toggle {
      background: #f1f5f9;
      border-color: #e2e8f0;
    }
    .toggle-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 14px;
      border: none;
      background: transparent;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .auth-page.light .toggle-tab {
      color: #64748b;
    }
    .toggle-tab.active {
      background: rgba(99, 102, 241, 0.35);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    .auth-page.light .toggle-tab.active {
      background: #ffffff;
      color: #4f46e5;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    /* Form Fields */
    .form-group {
      margin-bottom: 18px;
    }
    .form-group label {
      display: block;
      font-size: 0.78rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 6px;
      transition: color 0.3s;
    }
    .auth-page.light .form-group label {
      color: #334155;
    }
    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 14px;
      color: rgba(255, 255, 255, 0.3);
      pointer-events: none;
      transition: color 0.3s;
    }
    .auth-page.light .input-icon {
      color: #94a3b8;
    }
    .input-wrap input {
      width: 100%;
      padding: 13px 14px 13px 44px;
      border: 1.5px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 0.9rem;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
      outline: none;
      transition: all 0.25s ease;
    }
    .auth-page.light .input-wrap input {
      background: #f8fafc;
      border-color: #e2e8f0;
      color: #0f172a;
    }
    .input-wrap input:focus {
      border-color: #818cf8;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
    }
    .auth-page.light .input-wrap input:focus {
      border-color: #4f46e5;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }
    .eye-btn {
      position: absolute;
      right: 12px;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.35);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
    }
    .eye-btn:hover {
      color: #818cf8;
    }
    .auth-page.light .eye-btn {
      color: #94a3b8;
    }
    .auth-page.light .eye-btn:hover {
      color: #4f46e5;
    }

    /* 6-Digit OTP Group */
    .otp-group {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin: 24px 0 20px;
    }
    .otp-digit {
      width: 48px;
      height: 56px;
      text-align: center;
      font-size: 1.5rem;
      font-weight: 800;
      font-family: Consolas, Monaco, monospace;
      color: #818cf8;
      background: rgba(255, 255, 255, 0.06);
      border: 2px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      outline: none;
      transition: all 0.2s ease;
    }
    .auth-page.light .otp-digit {
      background: #f8fafc;
      border-color: #e2e8f0;
      color: #1e3a8a;
    }
    .otp-digit:focus {
      border-color: #818cf8;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25);
      transform: translateY(-2px);
    }
    .auth-page.light .otp-digit:focus {
      border-color: #4f46e5;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
    }

    /* SMTP Notice Box */
    .smtp-notice-box {
      background: rgba(245, 158, 11, 0.12);
      border: 1.5px solid rgba(245, 158, 11, 0.3);
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 20px;
      text-align: left;
    }
    .auth-page.light .smtp-notice-box {
      background: #fffbeb;
      border-color: #fde68a;
    }
    .notice-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      font-weight: 800;
      color: #fcd34d;
      margin-bottom: 4px;
    }
    .auth-page.light .notice-title {
      color: #b45309;
    }
    .notice-text {
      font-size: 0.72rem;
      color: #fde68a;
      margin: 0;
      line-height: 1.45;
    }
    .auth-page.light .notice-text {
      color: #92400e;
    }

    /* Icons */
    .otp-badge-icon, .key-badge-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 14px;
    }
    .otp-badge-icon {
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
    }
    .auth-page.light .otp-badge-icon {
      background: #eff6ff;
      color: #2563eb;
    }
    .key-badge-icon {
      background: rgba(168, 85, 247, 0.2);
      color: #c084fc;
    }
    .auth-page.light .key-badge-icon {
      background: #f5f3ff;
      color: #7c3aed;
    }

    /* Strength Bar */
    .strength-bar-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 8px;
    }
    .strength-bar {
      flex: 1;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      overflow: hidden;
    }
    .auth-page.light .strength-bar {
      background: #e2e8f0;
    }
    .strength-fill {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
    }
    .strength-label {
      font-size: 0.7rem;
      font-weight: 700;
    }

    /* Buttons */
    .submit-btn {
      width: 100%;
      padding: 13px 20px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%);
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-size: 0.88rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(99, 102, 241, 0.35);
      transition: all 0.2s ease;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.45);
    }
    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .skip-btn {
      width: 100%;
      padding: 12px 20px;
      background: transparent;
      color: rgba(255, 255, 255, 0.65);
      border: 1.5px solid rgba(255, 255, 255, 0.14);
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .auth-page.light .skip-btn {
      border-color: #e2e8f0;
      color: #64748b;
    }
    .skip-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.25);
    }
    .auth-page.light .skip-btn:hover {
      background: #f8fafc;
      color: #1e293b;
      border-color: #cbd5e1;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
    }

    /* Dispatched Channels Banner */
    .dispatch-channels-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 10px 14px;
      margin-bottom: 16px;
      gap: 8px;
    }
    .auth-page.light .dispatch-channels-card {
      background: #f8fafc;
      border-color: #e2e8f0;
    }
    .channel-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }
    .channel-icon {
      font-size: 1.15rem;
    }
    .channel-info {
      display: flex;
      flex-direction: column;
      text-align: left;
      min-width: 0;
    }
    .channel-name {
      font-size: 0.68rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.45);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .auth-page.light .channel-name {
      color: #64748b;
    }
    .channel-status {
      font-size: 0.74rem;
      font-weight: 700;
      color: #e2e8f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .auth-page.light .channel-status {
      color: #1e293b;
    }
    .channel-status.active {
      color: #818cf8;
    }
    .auth-page.light .channel-status.active {
      color: #4f46e5;
    }
    .channel-divider {
      width: 1px;
      height: 26px;
      background: rgba(255, 255, 255, 0.1);
    }
    .auth-page.light .channel-divider {
      background: #e2e8f0;
    }

    /* 10-Minute Expiry Countdown Card */
    .ten-minute-timer-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1.5px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 10px 14px;
      margin-bottom: 18px;
      transition: all 0.3s ease;
    }
    .auth-page.light .ten-minute-timer-card {
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
      border-color: #e2e8f0;
    }
    .ten-minute-timer-card.urgent {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      box-shadow: 0 0 14px rgba(239, 68, 68, 0.2);
    }
    .auth-page.light .ten-minute-timer-card.urgent {
      background: #fef2f2;
      border-color: #fecaca;
    }
    .timer-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .timer-badge {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulseDot 1.6s infinite;
    }
    @keyframes pulseDot {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .timer-label {
      font-size: 0.73rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
    }
    .auth-page.light .timer-label {
      color: #64748b;
    }
    .timer-digital-clock {
      display: flex;
      align-items: center;
      gap: 5px;
      font-family: 'SF Pro Text', Consolas, Monaco, monospace;
      font-size: 0.88rem;
      font-weight: 800;
      color: #818cf8;
      letter-spacing: 0.5px;
    }
    .auth-page.light .timer-digital-clock {
      color: #1e3a8a;
    }
    .timer-digital-clock.danger {
      color: #ef4444;
      animation: pulseClock 1s infinite alternate;
    }
    @keyframes pulseClock {
      from { transform: scale(1); }
      to { transform: scale(1.06); }
    }
    .timer-progress-track {
      width: 100%;
      height: 5px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      overflow: hidden;
    }
    .auth-page.light .timer-progress-track {
      background: #e2e8f0;
    }
    .timer-progress-fill {
      height: 100%;
      background: #6366f1;
      border-radius: 999px;
      transition: width 1s linear, background-color 0.4s ease;
    }
    .auth-page.light .timer-progress-fill {
      background: #2563eb;
    }
    .timer-progress-fill.warning {
      background: #f59e0b;
    }
    .timer-progress-fill.danger {
      background: #ef4444;
    }

    /* Action Buttons Row */
    .action-buttons-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 14px;
    }
    .flex-1 {
      flex: 1;
    }
    .cancel-btn {
      padding: 13px 18px;
      background: transparent;
      color: rgba(255, 255, 255, 0.55);
      border: 1.5px solid rgba(255, 255, 255, 0.14);
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .auth-page.light .cancel-btn {
      border-color: #e2e8f0;
      color: #64748b;
    }
    .cancel-btn:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.35);
      color: #fca5a5;
      transform: translateY(-1px);
    }
    .auth-page.light .cancel-btn:hover:not(:disabled) {
      background: #fef2f2;
      border-color: #fca5a5;
      color: #dc2626;
    }
    .cancel-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .cancel-link-btn {
      background: none;
      border: none;
      color: #f87171;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      padding: 6px 0 0;
      text-align: center;
      text-decoration: underline;
    }
    .auth-page.light .cancel-link-btn {
      color: #ef4444;
    }
    .cancel-link-btn:hover {
      color: #fca5a5;
    }
    .auth-page.light .cancel-link-btn:hover {
      color: #b91c1c;
    }

    .resend-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      font-size: 0.78rem;
    }
    .countdown-text {
      color: rgba(255, 255, 255, 0.5);
    }
    .auth-page.light .countdown-text {
      color: #64748b;
    }
    .resend-btn {
      background: none;
      border: none;
      color: #818cf8;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
      font-size: 0.78rem;
    }
    .auth-page.light .resend-btn {
      color: #2563eb;
    }
    .resend-btn:hover {
      text-decoration: underline;
    }
    .change-method-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.45);
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      font-size: 0.78rem;
    }
    .auth-page.light .change-method-btn {
      color: #64748b;
    }
    .change-method-btn:hover {
      color: #818cf8;
    }
    .auth-page.light .change-method-btn:hover {
      color: #2563eb;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 0.8rem;
      margin-bottom: 16px;
    }
    .auth-page.light .error-banner {
      background: #fef2f2;
      border-color: #fecaca;
      color: #b91c1c;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Success Card */
    .success-card {
      text-align: center;
      padding: 20px 0 10px;
    }
    .success-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.25);
    }
    .auth-page.light .success-icon-wrap {
      background: #dcfce7;
      color: #16a34a;
      box-shadow: 0 10px 25px rgba(22, 163, 74, 0.2);
    }

    
    /* Prominent Back to Login Button */
    .back-home-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px;
      margin-bottom: 20px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.14);
      backdrop-filter: blur(14px);
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 700;
      transition: all 0.25s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    }
    .back-home-btn:hover {
      background: rgba(255, 255, 255, 0.18);
      color: #ffffff;
      transform: translateX(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }
    .auth-page.light .back-home-btn {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(99, 102, 241, 0.25);
      color: #4338ca;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.1);
    }
    .auth-page.light .back-home-btn:hover {
      background: #ffffff;
      color: #312e81;
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.18);
    }

    /* Bottom Login Row */
    .bottom-login-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.85rem;
      text-align: center;
      flex-wrap: wrap;
    }
    .auth-page.light .bottom-login-row {
      border-top-color: rgba(99, 102, 241, 0.12);
    }
    .bottom-login-row .sub-text {
      color: rgba(255, 255, 255, 0.5);
    }
    .auth-page.light .bottom-login-row .sub-text {
      color: #64748b;
    }
    .login-highlight-btn {
      color: #818cf8;
      font-weight: 700;
      text-decoration: none;
      transition: color 0.2s;
    }
    .login-highlight-btn:hover {
      color: #a5b4fc;
      text-decoration: underline;
    }
    .auth-page.light .login-highlight-btn {
      color: #4f46e5;
    }
    .auth-page.light .login-highlight-btn:hover {
      color: #3730a3;
    }

    /* Secondary Action Button & Success Container */
    .secondary-btn {
      width: 100%;
      padding: 12px 20px;
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      border: 1.5px solid rgba(255, 255, 255, 0.14);
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .secondary-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
    .auth-page.light .secondary-btn {
      border-color: #e2e8f0;
      color: #64748b;
    }
    .auth-page.light .secondary-btn:hover {
      background: #f8fafc;
      color: #1e293b;
    }
    .success-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    @media (max-width: 480px) {
      .auth-card-wrapper {
        padding: 26px 18px;
        border-radius: 20px;
      }
      .top-controls {
        top: 12px;
        right: 12px;
      }
      .otp-digit {
        width: 40px;
        height: 50px;
        font-size: 1.3rem;
      }
    }
  `]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  // Theme & Language Controls
  isLight = signal<boolean>(this.readInitialTheme() === 'light');

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
    this.i18n.setLanguage(l);
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
  public i18n = inject(TranslationService);
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private router = inject(Router);
  private authService = inject(AuthService);

  @ViewChild('cardContainer') cardContainer?: ElementRef<HTMLDivElement>;
  @ViewChildren('otpInput') otpInputElements?: QueryList<ElementRef<HTMLInputElement>>;

  // Flow Signals
  step = signal<'request' | 'otp' | 'new-password' | 'success'>('request');
  method = signal<'email' | 'sms'>('email');
  destinationInput = '';
  maskedDestination = signal<string>('');
  rawDestination = signal<string>('');
  otpDigits = ['', '', '', '', '', ''];
  resetToken = signal<string>('');
  authenticatedUser = signal<AuthUser | null>(null);
  accessToken = signal<string>('');
  resendCountdown = signal<number>(60);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  emailSent = signal<boolean>(true);
  emailError = signal<string | null>(null);

  // New Password Signals
  newPassword = '';
  confirmPassword = '';
  showNewPw = signal<boolean>(false);
  showConfirmPw = signal<boolean>(false);
  pwStrengthScore = signal<number>(0);
  pwStrengthLabel = signal<string>('');
  pwStrengthColor = signal<string>('#94a3b8');

  private countdownInterval: any = null;
  otpExpiresIn = signal<number>(600); // 10 minutes (600 seconds)
  formattedTimeLeft = signal<string>('10:00');
  private tenMinuteInterval: any = null;

  ngOnInit() {
    // Initial GSAP Entrance
    setTimeout(() => {
      if (this.cardContainer?.nativeElement) {
        gsap.from(this.cardContainer.nativeElement, {
          opacity: 0,
          y: 30,
          scale: 0.96,
          duration: 0.6,
          ease: 'power3.out',
        });
      }
    }, 50);
  }

  ngOnDestroy() {
    this.stopCountdown();
    this.stopTenMinuteTimer();
  }

  switchMethod(newMethod: 'email' | 'sms') {
    if (this.method() === newMethod) return;
    this.method.set(newMethod);
    this.destinationInput = '';
    this.error.set(null);
  }

  // --- Step 1: Request OTP ---
  onRequestOtp(isResend = false) {
    const dest = isResend ? this.rawDestination() : this.destinationInput.trim();
    if (!dest) return;

    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>('/api/v1/auth/forgot-password/request', {
      method: this.method(),
      destination: dest,
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.rawDestination.set(res.rawDestination || dest);
        this.maskedDestination.set(res.destination || dest);
        this.emailSent.set(res.emailSent !== false);
        this.emailError.set(res.emailError || null);

        this.toast.success(res.message || 'OTP Code sent successfully!');
        this.startCountdown();
        this.startTenMinuteTimer();
        this.goToStep('otp');
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || 'Could not send verification code. Please try again.';
        this.error.set(msg);
        this.shakeCard();
      }
    });
  }

  // --- Step 2: Handle OTP Digits & Paste ---
  onDigitInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/[^0-9]/g, '');
    this.otpDigits[index] = val.slice(-1);
    input.value = this.otpDigits[index];

    if (this.otpDigits[index] && index < 5) {
      this.focusDigit(index + 1);
    }

    if (!this.isOtpIncomplete()) {
      this.onVerifyOtp();
    }
  }

  onDigitKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      this.focusDigit(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusDigit(index - 1);
    } else if (event.key === 'ArrowRight' && index < 5) {
      this.focusDigit(index + 1);
    } else if (event.key === 'Enter' && !this.isOtpIncomplete()) {
      this.onVerifyOtp();
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') || '';
    const digits = pasted.replace(/[^0-9]/g, '').slice(0, 6).split('');
    if (digits.length === 0) return;

    digits.forEach((d, i) => {
      if (i < 6) this.otpDigits[i] = d;
    });

    const inputs = this.otpInputElements?.toArray();
    if (inputs) {
      digits.forEach((d, i) => {
        if (inputs[i]) inputs[i].nativeElement.value = d;
      });
      const nextFocus = Math.min(digits.length, 5);
      inputs[nextFocus]?.nativeElement.focus();
    }

    if (digits.length === 6) {
      this.onVerifyOtp();
    }
  }

  isOtpIncomplete(): boolean {
    return this.otpDigits.some((d) => !d);
  }

  private focusDigit(index: number) {
    const inputs = this.otpInputElements?.toArray();
    inputs?.[index]?.nativeElement.focus();
  }

  onVerifyOtp() {
    const code = this.otpDigits.join('');
    if (code.length < 6) return;

    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>('/api/v1/auth/forgot-password/verify-otp', {
      destination: this.rawDestination(),
      otp: code,
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.resetToken.set(res.resetToken);
        if (res.token && res.user) {
          this.accessToken.set(res.token);
          this.authenticatedUser.set(res.user);
        }
        this.toast.success(res.message || 'Code verified successfully!');
        this.stopCountdown();
        this.stopTenMinuteTimer();
        this.goToStep('new-password');
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || 'Invalid or expired OTP code.';
        this.error.set(msg);
        this.shakeOtp();
      }
    });
  }

  // --- Step 3: Set New Password or Skip ---
  calculateStrength() {
    const pw = this.newPassword;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    this.pwStrengthScore.set(score);
    if (score <= 1) {
      this.pwStrengthLabel.set(this.i18n.currentLang() === 'kh' ? 'ខ្សោយ' : 'Weak');
      this.pwStrengthColor.set('#ef4444');
    } else if (score === 2 || score === 3) {
      this.pwStrengthLabel.set(this.i18n.currentLang() === 'kh' ? 'មធ្យម' : 'Medium');
      this.pwStrengthColor.set('#f59e0b');
    } else {
      this.pwStrengthLabel.set(this.i18n.currentLang() === 'kh' ? 'រឹងមាំ' : 'Strong');
      this.pwStrengthColor.set('#10b981');
    }
  }

  onResetPassword() {
    if (this.newPassword.length < 8) {
      this.error.set('Password must be at least 8 characters long.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>('/api/v1/auth/forgot-password/reset', {
      resetToken: this.resetToken(),
      newPassword: this.newPassword,
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.toast.success(res.message || 'Password reset successfully!');
        if (res.token && res.user) {
          this.authService.setSession(res.token, res.user);
        }
        this.goToStep('success');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Could not reset password. Please request a new code.');
        this.shakeCard();
      }
    });
  }

  /**
   * User chooses to SKIP setting a new password (as requested by user):
   * Automatically logs the user in and navigates directly to home page (/)
   */
  onSkipPasswordReset() {
    this.loading.set(true);
    const token = this.accessToken();
    const user = this.authenticatedUser();

    this.http.post<any>('/api/v1/auth/forgot-password/skip-and-login', {
      resetToken: this.resetToken(),
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        const finalToken = res.token || token;
        const finalUser = res.user || user;
        if (finalToken && finalUser) {
          this.authService.setSession(finalToken, finalUser, '/');
          this.toast.success(
            this.i18n.currentLang() === 'kh'
              ? `ចូលគណនីជោគជ័យ! សូមស្វាគមន៍ ${finalUser.fullName || ''}`
              : `Logged in successfully! Welcome back, ${finalUser.fullName || ''}`
          );
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.loading.set(false);
        if (token && user) {
          this.authService.setSession(token, user, '/');
          this.toast.success('Logged in successfully!');
        } else {
          this.router.navigate(['/']);
        }
      }
    });
  }

  // --- Smooth GSAP Transitions ---
  goToStep(targetStep: 'request' | 'otp' | 'new-password' | 'success') {
    this.error.set(null);
    if (this.cardContainer?.nativeElement) {
      gsap.to(this.cardContainer.nativeElement, {
        opacity: 0,
        y: -15,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          this.step.set(targetStep);
          if (targetStep === 'otp') {
            this.otpDigits = ['', '', '', '', '', ''];
            setTimeout(() => this.focusDigit(0), 100);
          }
          gsap.fromTo(
            this.cardContainer!.nativeElement,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
          );
        },
      });
    } else {
      this.step.set(targetStep);
    }
  }

  private shakeCard() {
    if (this.cardContainer?.nativeElement) {
      gsap.fromTo(
        this.cardContainer.nativeElement,
        { x: -8 },
        { x: 8, duration: 0.08, repeat: 4, yoyo: true, ease: 'power2.inOut', onComplete: () => {
          gsap.set(this.cardContainer!.nativeElement, { x: 0 });
        }}
      );
    }
  }

  private shakeOtp() {
    const el = document.querySelector('.otp-group');
    if (el) {
      gsap.fromTo(
        el,
        { x: -10 },
        { x: 10, duration: 0.07, repeat: 5, yoyo: true, ease: 'power2.inOut', onComplete: () => {
          gsap.set(el, { x: 0 });
        }}
      );
    }
  }

  private startCountdown() {
    this.stopCountdown();
    this.resendCountdown.set(60);
    this.countdownInterval = setInterval(() => {
      const cur = this.resendCountdown();
      if (cur <= 1) {
        this.resendCountdown.set(0);
        this.stopCountdown();
      } else {
        this.resendCountdown.set(cur - 1);
      }
    }, 1000);
  }

  private stopCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  startTenMinuteTimer() {
    this.stopTenMinuteTimer();
    this.otpExpiresIn.set(600); // 10 minutes
    this.updateFormattedTime();
    this.tenMinuteInterval = setInterval(() => {
      const remaining = this.otpExpiresIn() - 1;
      if (remaining <= 0) {
        this.otpExpiresIn.set(0);
        this.updateFormattedTime();
        this.stopTenMinuteTimer();
        this.error.set(
          this.i18n.currentLang() === 'kh'
            ? 'លេខកូដផ្ទៀងផ្ទាត់ OTP បានផុតកំណត់ ១០ នាទីហើយ។ សូមចុចផ្ញើកូដម្ដងទៀត។'
            : 'OTP verification code has expired (10-minute limit). Please click "Resend Code".'
        );
        this.shakeCard();
      } else {
        this.otpExpiresIn.set(remaining);
        this.updateFormattedTime();
      }
    }, 1000);
  }

  stopTenMinuteTimer() {
    if (this.tenMinuteInterval) {
      clearInterval(this.tenMinuteInterval);
      this.tenMinuteInterval = null;
    }
  }

  private updateFormattedTime() {
    const s = this.otpExpiresIn();
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    this.formattedTimeLeft.set(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
  }

  onCancelReset() {
    this.loading.set(true);
    const dest = this.rawDestination() || this.destinationInput;
    this.http.post<any>('/api/v1/auth/forgot-password/cancel', {
      destination: dest,
      reason: 'User canceled reset on verification screen',
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.stopCountdown();
        this.stopTenMinuteTimer();
        this.toast.info(
          this.i18n.currentLang() === 'kh'
            ? 'ការកំណត់ពាក្យសម្ងាត់ត្រូវបានបោះបង់'
            : 'Password reset request canceled.'
        );
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading.set(false);
        this.stopCountdown();
        this.stopTenMinuteTimer();
        this.router.navigate(['/login']);
      }
    });
  }
}

