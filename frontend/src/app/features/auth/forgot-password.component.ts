import { Component, ElementRef, ViewChild, ViewChildren, QueryList, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { gsap } from 'gsap';
import { ToastService } from '../../shared/components/toast/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { AuthService, AuthUser } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <!-- Glow background spheres -->
      <div class="glow glow-one" aria-hidden="true"></div>
      <div class="glow glow-two" aria-hidden="true"></div>
      <div class="glow glow-three" aria-hidden="true"></div>

      <div class="auth-container">
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

              <a routerLink="/" class="submit-btn" style="text-decoration:none; justify-content:center;">
                <span>{{ i18n.currentLang() === 'kh' ? 'ទៅកាន់ទំព័រដើមឥឡូវនេះ' : 'Go to Home Page' }}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          }

        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      background: linear-gradient(150deg, #f8faff 0%, #eef3ff 45%, #f4f8ff 100%);
      position: relative;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif;
    }
    :host-context(.dark) .auth-page {
      background: linear-gradient(145deg, #0d1527 0%, #111b32 50%, #111a2c 100%);
    }

    .glow {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      z-index: 0;
    }
    .glow-one {
      width: 500px;
      height: 500px;
      right: -100px;
      top: -100px;
      background: rgba(99, 102, 241, 0.18);
    }
    .glow-two {
      width: 450px;
      height: 450px;
      left: -120px;
      bottom: -100px;
      background: rgba(14, 165, 233, 0.16);
    }
    .glow-three {
      width: 400px;
      height: 400px;
      right: 20%;
      bottom: -50px;
      background: rgba(168, 85, 247, 0.12);
    }

    .auth-container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 500px;
    }

    .auth-card-wrapper {
      background: #ffffff;
      border-radius: 28px;
      padding: 36px 32px;
      box-shadow: 0 25px 60px -15px rgba(30, 58, 138, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.8);
      position: relative;
      transition: all 0.3s ease;
    }
    :host-context(.dark) .auth-card-wrapper {
      background: #15203b;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(51, 65, 85, 0.6);
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
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .back-btn:hover {
      color: #2563eb;
    }
    :host-context(.dark) .back-btn {
      color: #94a3b8;
    }
    :host-context(.dark) .back-btn:hover {
      color: #60a5fa;
    }

    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f1f5f9;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 800;
      color: #334155;
    }
    :host-context(.dark) .brand-pill {
      background: #1e293b;
      color: #cbd5e1;
    }
    .brand-badge {
      background: #2563eb;
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
      background: #f1f5f9;
      color: #94a3b8;
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
    }
    :host-context(.dark) .step-circle {
      background: #1e293b;
      color: #64748b;
      border-color: #334155;
    }
    .step-label {
      font-size: 0.68rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .step-item.active .step-circle {
      background: #2563eb;
      color: #fff;
      border-color: #2563eb;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
    }
    .step-item.active .step-label {
      color: #2563eb;
    }
    .step-item.done .step-circle {
      background: #10b981;
      color: #fff;
      border-color: #10b981;
    }
    .step-line {
      flex: 1;
      height: 2px;
      background: #e2e8f0;
      margin: 0 8px -18px;
      position: relative;
      z-index: 1;
      transition: background 0.3s ease;
    }
    :host-context(.dark) .step-line {
      background: #334155;
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
      color: #0f172a;
      margin: 0 0 8px;
    }
    :host-context(.dark) .heading h2 {
      color: #f8fafc;
    }
    .heading .sub {
      font-size: 0.85rem;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
    :host-context(.dark) .heading .sub {
      color: #94a3b8;
    }

    /* Method Toggle */
    .method-toggle {
      display: flex;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 14px;
      gap: 4px;
      margin-bottom: 22px;
    }
    :host-context(.dark) .method-toggle {
      background: #1e293b;
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
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    :host-context(.dark) .toggle-tab {
      color: #94a3b8;
    }
    .toggle-tab.active {
      background: #ffffff;
      color: #2563eb;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    :host-context(.dark) .toggle-tab.active {
      background: #27375c;
      color: #60a5fa;
    }

    /* Form Fields */
    .form-group {
      margin-bottom: 18px;
    }
    .form-group label {
      display: block;
      font-size: 0.78rem;
      font-weight: 700;
      color: #334155;
      margin-bottom: 6px;
    }
    :host-context(.dark) .form-group label {
      color: #cbd5e1;
    }
    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 14px;
      color: #94a3b8;
      pointer-events: none;
    }
    .input-wrap input {
      width: 100%;
      padding: 13px 14px 13px 44px;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.9rem;
      color: #0f172a;
      background: #f8fafc;
      outline: none;
      transition: all 0.2s ease;
    }
    :host-context(.dark) .input-wrap input {
      background: #1e293b;
      border-color: #334155;
      color: #f8fafc;
    }
    .input-wrap input:focus {
      border-color: #2563eb;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }
    :host-context(.dark) .input-wrap input:focus {
      background: #15203b;
      border-color: #3b82f6;
    }
    .eye-btn {
      position: absolute;
      right: 12px;
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
    }
    .eye-btn:hover {
      color: #2563eb;
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
      color: #1e3a8a;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      outline: none;
      transition: all 0.2s ease;
    }
    :host-context(.dark) .otp-digit {
      background: #1e293b;
      border-color: #334155;
      color: #60a5fa;
    }
    .otp-digit:focus {
      border-color: #2563eb;
      background: #fff;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
      transform: translateY(-2px);
    }
    :host-context(.dark) .otp-digit:focus {
      background: #15203b;
      border-color: #3b82f6;
    }

    /* SMTP Notice Box */
    .smtp-notice-box {
      background: #fffbeb;
      border: 1.5px solid #fde68a;
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 20px;
      text-align: left;
    }
    :host-context(.dark) .smtp-notice-box {
      background: rgba(245, 158, 11, 0.1);
      border-color: rgba(245, 158, 11, 0.3);
    }
    .notice-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      font-weight: 800;
      color: #b45309;
      margin-bottom: 4px;
    }
    :host-context(.dark) .notice-title {
      color: #fcd34d;
    }
    .notice-text {
      font-size: 0.72rem;
      color: #92400e;
      margin: 0;
      line-height: 1.45;
    }
    :host-context(.dark) .notice-text {
      color: #fde68a;
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
      background: #eff6ff;
      color: #2563eb;
    }
    :host-context(.dark) .otp-badge-icon {
      background: rgba(37, 99, 235, 0.2);
      color: #60a5fa;
    }
    .key-badge-icon {
      background: #f5f3ff;
      color: #7c3aed;
    }
    :host-context(.dark) .key-badge-icon {
      background: rgba(124, 58, 237, 0.2);
      color: #a78bfa;
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
      background: #e2e8f0;
      border-radius: 999px;
      overflow: hidden;
    }
    :host-context(.dark) .strength-bar {
      background: #334155;
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
      background: #2563eb;
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
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
      transition: all 0.2s ease;
    }
    .submit-btn:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
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
      color: #64748b;
      border: 1.5px solid #e2e8f0;
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
    :host-context(.dark) .skip-btn {
      border-color: #334155;
      color: #94a3b8;
    }
    .skip-btn:hover {
      background: #f8fafc;
      color: #1e293b;
      border-color: #cbd5e1;
    }
    :host-context(.dark) .skip-btn:hover {
      background: #1e293b;
      color: #f8fafc;
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
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 10px 14px;
      margin-bottom: 16px;
      gap: 8px;
    }
    :host-context(.dark) .dispatch-channels-card {
      background: #1e293b;
      border-color: #334155;
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
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .channel-status {
      font-size: 0.74rem;
      font-weight: 700;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host-context(.dark) .channel-status {
      color: #f1f5f9;
    }
    .channel-status.active {
      color: #2563eb;
    }
    :host-context(.dark) .channel-status.active {
      color: #60a5fa;
    }
    .channel-divider {
      width: 1px;
      height: 26px;
      background: #e2e8f0;
    }
    :host-context(.dark) .channel-divider {
      background: #334155;
    }

    /* 10-Minute Expiry Countdown Card */
    .ten-minute-timer-card {
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 10px 14px;
      margin-bottom: 18px;
      transition: all 0.3s ease;
    }
    :host-context(.dark) .ten-minute-timer-card {
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      border-color: #334155;
    }
    .ten-minute-timer-card.urgent {
      background: #fef2f2;
      border-color: #fecaca;
      box-shadow: 0 0 14px rgba(239, 68, 68, 0.18);
    }
    :host-context(.dark) .ten-minute-timer-card.urgent {
      background: rgba(185, 28, 28, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
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
      color: #64748b;
    }
    :host-context(.dark) .timer-label {
      color: #94a3b8;
    }
    .timer-digital-clock {
      display: flex;
      align-items: center;
      gap: 5px;
      font-family: 'SF Pro Text', Consolas, Monaco, monospace;
      font-size: 0.88rem;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: 0.5px;
    }
    :host-context(.dark) .timer-digital-clock {
      color: #93c5fd;
    }
    .timer-digital-clock.danger {
      color: #dc2626;
      animation: pulseClock 1s infinite alternate;
    }
    @keyframes pulseClock {
      from { transform: scale(1); }
      to { transform: scale(1.06); }
    }
    .timer-progress-track {
      width: 100%;
      height: 5px;
      background: #e2e8f0;
      border-radius: 999px;
      overflow: hidden;
    }
    :host-context(.dark) .timer-progress-track {
      background: #334155;
    }
    .timer-progress-fill {
      height: 100%;
      background: #2563eb;
      border-radius: 999px;
      transition: width 1s linear, background-color 0.4s ease;
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
      color: #64748b;
      border: 1.5px solid #e2e8f0;
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
    :host-context(.dark) .cancel-btn {
      border-color: #334155;
      color: #94a3b8;
    }
    .cancel-btn:hover:not(:disabled) {
      background: #fef2f2;
      border-color: #fca5a5;
      color: #dc2626;
      transform: translateY(-1px);
    }
    :host-context(.dark) .cancel-btn:hover:not(:disabled) {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.4);
      color: #f87171;
    }
    .cancel-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .cancel-link-btn {
      background: none;
      border: none;
      color: #ef4444;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      padding: 6px 0 0;
      text-align: center;
      text-decoration: underline;
    }
    .cancel-link-btn:hover {
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
      color: #64748b;
    }
    .resend-btn {
      background: none;
      border: none;
      color: #2563eb;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
      font-size: 0.78rem;
    }
    .resend-btn:hover {
      text-decoration: underline;
    }
    .change-method-btn {
      background: none;
      border: none;
      color: #64748b;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      font-size: 0.78rem;
    }
    .change-method-btn:hover {
      color: #2563eb;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #b91c1c;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 0.8rem;
      margin-bottom: 16px;
    }
    :host-context(.dark) .error-banner {
      background: rgba(185, 28, 28, 0.15);
      border-color: rgba(185, 28, 28, 0.3);
      color: #f87171;
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
      background: #dcfce7;
      color: #16a34a;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 10px 25px rgba(22, 163, 74, 0.2);
    }
    :host-context(.dark) .success-icon-wrap {
      background: rgba(22, 163, 74, 0.2);
      color: #4ade80;
    }
  `]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
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

