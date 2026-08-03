import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoaderComponent],
  template: `
    <section class="auth-page">
      <!-- Desktop layout -->
      <div class="auth-desktop">
        <div class="auth-layout">
          <aside class="auth-showcase" aria-hidden="true">
            <div class="showcase-shape showcase-shape--one"></div><div class="showcase-shape showcase-shape--two"></div>
            <div class="showcase-ball showcase-ball--one"></div><div class="showcase-ball showcase-ball--two"></div><div class="showcase-ball showcase-ball--three"></div>
            <div class="showcase-copy"><span class="eyebrow">CV CREATOR</span><h1>Welcome back!</h1><p>Pick up where you left off and build a CV that opens doors.</p></div>
            <a routerLink="/register" class="showcase-switch">New here? <strong>Sign up</strong></a>
          </aside>
          <main class="auth-card">
            <a routerLink="/" class="back-link"><span>‹</span> Back to home</a>
            <div class="auth-heading"><p class="eyebrow">WELCOME BACK</p><h2>Sign in to your account</h2><p>Enter your details to continue creating.</p></div>
            <form [formGroup]="form" (ngSubmit)="submit()">
              <label>Email address<input formControlName="email" type="email" placeholder="you@example.com" autocomplete="email" /></label>
              <label>Password
                <div class="password-wrap">
                  <input formControlName="password" [type]="showPw() ? 'text' : 'password'" placeholder="••••••••" autocomplete="current-password" />
                  <button type="button" class="eye-btn" (click)="showPw.set(!showPw())">
                    @if (showPw()) { <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    } @else { <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </label>
              <div class="form-options"><label class="check-label"><input type="checkbox" /> <span>Remember me</span></label><a href="mailto:support@cvcreator.com">Forgot password?</a></div>
              @if (error()) { <p class="form-error">{{ error() }}</p> }
              <button type="submit" [disabled]="form.invalid || loading()">Sign in <span>→</span></button>
              <app-loader [show]="loading()" [inline]="true" text="Signing in..." />
            </form>
            <div class="divider"><span>or continue with</span></div>
            <div class="socials"><button type="button">G</button><button type="button">f</button><button type="button">●</button></div>
            <p class="account-link">Don't have an account? <a routerLink="/register">Sign up</a></p>
          </main>
        </div>
      </div>

      <!-- Mobile layout -->
      <div class="auth-mobile">
        <div class="mobile-hero">
          <div class="m-ball m-ball--1"></div><div class="m-ball m-ball--2"></div><div class="m-ball m-ball--3"></div>
          <a routerLink="/" class="m-back">‹ Back</a>
          <div class="m-hero-text">
            <h1>Welcome back</h1>
          </div>
        </div>
        <div class="mobile-card">
          <!-- Tab switcher -->
          <div class="m-tabs">
            <a routerLink="/login" class="m-tab active">Sign in</a>
            <a routerLink="/register" class="m-tab">Sign up</a>
          </div>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <label>Email<input formControlName="email" type="email" placeholder="you@example.com" autocomplete="email" /></label>
            <label>Password
              <div class="password-wrap">
                <input formControlName="password" [type]="showPw() ? 'text' : 'password'" placeholder="••••••••" autocomplete="current-password" />
                <button type="button" class="eye-btn" (click)="showPw.set(!showPw())">
                  @if (showPw()) { <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  } @else { <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </label>
            <div class="form-options"><label class="check-label"><input type="checkbox" /> <span>Remember me</span></label><a href="#">Forgot password?</a></div>
            @if (error()) { <p class="form-error">{{ error() }}</p> }
            <button type="submit" class="m-submit" [disabled]="form.invalid || loading()">Sign in</button>
            <app-loader [show]="loading()" [inline]="true" text="Signing in..." />
          </form>
          <div class="divider"><span>Sign in with</span></div>
          <div class="m-socials">
            <button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button>
            <button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#1DA1F2" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></button>
            <button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067C3.151 21.39 7.241 24 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/><path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"/><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/></svg></button>
            <button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#000" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg></button>
          </div>
          <p class="m-switch">Don't have an account? <a routerLink="/register">Sign up</a></p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-page{min-height:100vh;font-family:Inter,system-ui,sans-serif;color:#162344}
    .auth-desktop{display:block}.auth-mobile{display:none}
    @media(max-width:760px){.auth-desktop{display:none}.auth-mobile{display:flex;flex-direction:column;min-height:100vh;background:#eef3ff}}

    /* === DESKTOP STYLES (unchanged) === */
    .auth-desktop .auth-layout{width:min(1120px,100%);min-height:650px;display:grid;grid-template-columns:1.08fr .92fr;position:relative;z-index:1;border-radius:28px;overflow:hidden;box-shadow:0 30px 80px rgba(50,70,130,.25);margin:auto}
    .auth-desktop{min-height:100vh;display:grid;place-items:center;padding:32px;background:linear-gradient(120deg,#eaf0ff,#cbd7f5 55%,#edf2ff)}
    .auth-showcase{position:relative;overflow:hidden;padding:56px;background:linear-gradient(145deg,#5378d7,#2d4c9f 80%);color:#fff}.auth-showcase:before{content:"";position:absolute;width:620px;height:620px;border-radius:43% 57% 58% 42%;background:linear-gradient(135deg,#9db4fb 0%,#6f8ee6 60%,transparent 61%);right:-200px;top:-230px;opacity:.85}.auth-showcase:after{content:"";position:absolute;width:650px;height:350px;border-radius:54% 46% 0 0;background:linear-gradient(140deg,#152e72,#3858ad);left:-160px;bottom:-220px}
    .showcase-shape,.showcase-ball{position:absolute;border-radius:50%;z-index:1}.showcase-shape--one{width:270px;height:270px;right:-25px;top:-72px;border:44px solid rgba(255,255,255,.62);border-left-color:transparent;transform:rotate(-32deg)}.showcase-shape--two{width:300px;height:220px;left:-80px;top:120px;border-radius:48%;background:rgba(36,66,157,.36);transform:rotate(28deg)}.showcase-ball--one{width:96px;height:96px;top:36px;left:-35px;background:radial-gradient(circle at 30% 25%,#5277db,#102257 72%);box-shadow:15px 20px 30px #15317177}.showcase-ball--two{width:82px;height:82px;right:95px;top:162px;background:radial-gradient(circle at 32% 22%,#e1edff,#6e99e8 62%,#3154ad);box-shadow:8px 12px 22px #26418b88}.showcase-ball--three{width:118px;height:118px;left:82px;bottom:55px;background:radial-gradient(circle at 30% 25%,#537be0,#152b69 70%);box-shadow:15px 18px 25px #172a6288}
    .showcase-copy{position:absolute;z-index:2;left:56px;bottom:146px;max-width:320px}.eyebrow{font-size:.69rem;letter-spacing:.14em;font-weight:800;margin:0 0 13px;color:#5679dd}.showcase-copy .eyebrow{color:#d8e4ff}.showcase-copy h1{font-size:2.5rem;line-height:1.1;margin:0 0 15px}.showcase-copy p{margin:0;line-height:1.6;color:#e2eaff;font-size:.98rem}.showcase-switch{position:absolute;z-index:2;left:56px;bottom:54px;color:#fff;text-decoration:none;font-size:.9rem}.showcase-switch strong{margin-left:7px;border-bottom:1px solid #fff;padding-bottom:2px}
    .auth-card{background:#fff;padding:52px 58px;display:flex;flex-direction:column;justify-content:center}.back-link{position:absolute;top:26px;color:#63718e;text-decoration:none;font-size:.8rem;font-weight:600}.back-link span{font-size:1.35rem;vertical-align:-2px;margin-right:5px}.auth-heading h2{font-size:2rem;line-height:1.15;margin:0 0 9px;color:#1a2e66}.auth-heading>p:last-child{font-size:.9rem;color:#7b869d;margin:0 0 27px}
    form label:not(.check-label){display:block;font-size:.76rem;font-weight:700;color:#45516a;margin:0 0 15px}input:not([type=checkbox]){box-sizing:border-box;display:block;width:100%;padding:12px 13px;margin-top:7px;border:1px solid #dfe4ef;border-radius:9px;color:#1d2b4d;font:inherit;font-size:.87rem;outline:none;transition:.2s}input:not([type=checkbox]):focus{border-color:#4c70d5;box-shadow:0 0 0 3px #dce6ff}
    .form-options{display:flex;justify-content:space-between;align-items:center;margin:2px 0 22px;font-size:.73rem}.check-label{display:flex;gap:7px;align-items:center;color:#788397}.check-label input{accent-color:#4268ca}.form-options a{color:#4167cc;text-decoration:none;font-weight:700}.form-error{font-size:.8rem;color:#c1354d;margin:-8px 0 15px}
    form>button:not(.eye-btn){width:100%;border:0;border-radius:9px;padding:13px;background:#4167ca;color:#fff;font-weight:700;box-shadow:0 8px 16px #4167ca42;cursor:pointer;transition:.2s}form>button:not(.eye-btn):hover:not(:disabled){background:#3158bb;transform:translateY(-1px)}form>button:not(.eye-btn):disabled{opacity:.5;cursor:not-allowed}form>button:not(.eye-btn) span{margin-left:7px;font-size:1.1rem}
    .divider{display:flex;align-items:center;gap:12px;color:#a2aabc;font-size:.72rem;margin:25px 0 17px}.divider:before,.divider:after{content:"";height:1px;background:#edf0f5;flex:1}
    .socials{display:flex;justify-content:center;gap:13px}.socials button{width:36px;height:36px;border:1px solid #e2e7f0;background:#fff;border-radius:50%;cursor:pointer;font-weight:800;color:#4167ca;font-size:1rem}.socials button:first-child{color:#dd4b39}.socials button:last-child{color:#1f2937;font-size:.72rem}
    .account-link{text-align:center;color:#7b869d;font-size:.8rem;margin:20px 0 0}.account-link a{color:#4167ca;font-weight:800;text-decoration:none}
    .password-wrap{position:relative;display:block}.password-wrap input{padding-right:42px!important}.eye-btn{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#7b869d;padding:4px;display:flex;align-items:center;justify-content:center}.eye-btn:hover{color:#4167ca}

    /* === MOBILE STYLES === */
    .mobile-hero{position:relative;min-height:200px;background:linear-gradient(145deg,#4a6fd8,#2d4c9f 70%);overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:24px 24px 40px;border-radius:0 0 32px 32px}
    .m-ball{position:absolute;border-radius:50%}.m-ball--1{width:140px;height:140px;top:-40px;right:-20px;background:radial-gradient(circle at 30% 25%,#7b9ef0,#2850a8 70%);opacity:.7}.m-ball--2{width:80px;height:80px;top:20px;left:-20px;background:radial-gradient(circle at 30% 25%,#e1edff,#6e99e8 62%);opacity:.6}.m-ball--3{width:60px;height:60px;bottom:60px;right:40px;background:radial-gradient(circle at 30% 25%,#537be0,#152b69 70%);opacity:.5}
    .m-back{position:absolute;top:16px;left:16px;color:#fff;text-decoration:none;font-size:.85rem;font-weight:600;z-index:2;padding:8px 12px;background:rgba(255,255,255,.15);border-radius:8px;backdrop-filter:blur(4px)}
    .m-hero-text{position:relative;z-index:2}.m-hero-text h1{color:#fff;font-size:1.8rem;font-weight:800;margin:0}
    .mobile-card{flex:1;background:#fff;margin:-20px 16px 16px;border-radius:20px;padding:28px 24px;box-shadow:0 10px 40px rgba(30,60,120,.12);position:relative;z-index:3}
    .m-tabs{display:flex;background:#f1f5ff;border-radius:10px;padding:4px;margin-bottom:24px}.m-tab{flex:1;text-align:center;padding:10px;border-radius:8px;font-size:.82rem;font-weight:700;color:#7b869d;text-decoration:none;transition:.2s}.m-tab.active{background:#4167ca;color:#fff;box-shadow:0 4px 12px #4167ca40}
    .mobile-card form label:not(.check-label){display:block;font-size:.75rem;font-weight:700;color:#45516a;margin:0 0 14px}
    .mobile-card input:not([type=checkbox]){box-sizing:border-box;display:block;width:100%;padding:13px 14px;margin-top:6px;border:1px solid #e2e8f0;border-radius:10px;background:#f9fbff;color:#1d2b4d;font:inherit;font-size:.85rem;outline:none;transition:.2s}
    .mobile-card input:not([type=checkbox]):focus{border-color:#4167ca;box-shadow:0 0 0 3px #e3eaff}
    .m-submit{width:100%;border:0;border-radius:10px;padding:14px;background:#4167ca;color:#fff;font-weight:700;font-size:.9rem;box-shadow:0 8px 20px #4167ca35;cursor:pointer;transition:.2s;margin-top:4px}.m-submit:hover:not(:disabled){background:#3158bb}.m-submit:disabled{opacity:.5}
    .m-socials{display:flex;justify-content:center;gap:14px}.m-socials button{width:42px;height:42px;border:1px solid #e5eaf3;background:#fff;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.15s}.m-socials button:hover{transform:scale(1.08);border-color:#4167ca}
    .m-switch{text-align:center;color:#7b869d;font-size:.8rem;margin:18px 0 0}.m-switch a{color:#4167ca;font-weight:800;text-decoration:none}
  `],
})
export class LoginComponent {
  form: FormGroup; error = signal<string | null>(null); returnUrl = signal<string>('/'); showPw = signal(false); loading = signal(false);
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private auth: AuthService, private toast: ToastService, private router: Router) { this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] }); this.returnUrl.set(this.route.snapshot.queryParamMap.get('returnUrl') || '/'); }
  submit() { if (this.form.invalid) return; this.loading.set(true); this.error.set(null); const { email, password } = this.form.getRawValue(); const returnUrl = this.returnUrl(); const safeUrl = returnUrl.startsWith('/login') || returnUrl.startsWith('/register') ? '/' : returnUrl; this.auth.login(email!, password!, safeUrl).subscribe({ next: () => { this.loading.set(false); this.toast.success('Welcome back!'); const user = this.auth.currentUser(); if (user?.role === 'admin' && safeUrl === '/') { this.router.navigate(['/admin']); } }, error: () => { this.loading.set(false); this.error.set('Incorrect email or password.'); } }); }
}
