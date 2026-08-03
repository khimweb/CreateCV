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
      <!-- Desktop -->
      <div class="desktop-only">
        <div class="auth-layout">
          <aside class="auth-showcase">
            <div class="s-shape s-shape--1"></div><div class="s-shape s-shape--2"></div>
            <div class="s-ball s-ball--1"></div><div class="s-ball s-ball--2"></div><div class="s-ball s-ball--3"></div>
            <div class="s-copy"><span class="s-eyebrow">CV CREATOR</span><h1>Welcome back!</h1><p>Pick up where you left off and build a CV that opens doors.</p></div>
            <a routerLink="/register" class="s-switch">New here? <strong>Sign up</strong></a>
          </aside>
          <main class="auth-card">
            <a routerLink="/" class="back-link"><span>‹</span> Back to home</a>
            <div class="heading"><p class="s-eyebrow">WELCOME BACK</p><h2>Sign in to your account</h2><p class="sub">Enter your details to continue creating.</p></div>
            <form [formGroup]="form" (ngSubmit)="submit()">
              <label>Email address<input formControlName="email" type="email" placeholder="you@example.com" /></label>
              <label>Password<div class="pw-wrap"><input formControlName="password" [type]="showPw()?'text':'password'" placeholder="••••••••" /><button type="button" class="eye" (click)="showPw.set(!showPw())">@if(showPw()){<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}@else{<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}</button></div></label>
              <div class="opts"><label class="chk"><input type="checkbox" /><span>Remember me</span></label><a href="#">Forgot password?</a></div>
              @if(error()){<p class="err">{{error()}}</p>}
              <button type="submit" class="btn-primary" [disabled]="form.invalid||loading()">Sign in <span>→</span></button>
              <app-loader [show]="loading()" [inline]="true" text="Signing in..." />
            </form>
            <div class="divider"><span>or continue with</span></div>
            <div class="socials"><button type="button">G</button><button type="button">f</button><button type="button">●</button></div>
            <p class="switch-link">Don't have an account? <a routerLink="/register">Sign up</a></p>
          </main>
        </div>
      </div>

      <!-- Mobile -->
      <div class="mobile-only">
        @if (mobileView() === 'welcome') {
          <div class="m-welcome">
            <div class="m-bg">
              <div class="m-blob m-blob--1"></div><div class="m-blob m-blob--2"></div><div class="m-blob m-blob--3"></div>
              <div class="m-ball m-ball--1"></div><div class="m-ball m-ball--2"></div><div class="m-ball m-ball--3"></div>
            </div>
            <div class="m-welcome-content">
              <h1>Welcome Back!</h1>
              <p>Enter personal details to your employee account</p>
            </div>
            <div class="m-welcome-btns">
              <button type="button" class="m-btn-text" (click)="mobileView.set('login')">Sign in</button>
              <button type="button" class="m-btn-pill" routerLink="/register">Sign up</button>
            </div>
          </div>
        } @else {
          <div class="m-form-page">
            <div class="m-header">
              <div class="m-ball m-ball--1"></div><div class="m-ball m-ball--2"></div>
              <button type="button" class="m-back" (click)="mobileView.set('welcome')">‹ Back</button>
            </div>
            <div class="m-card">
              <h2>Welcome back</h2>
              <form [formGroup]="form" (ngSubmit)="submit()">
                <label>Email<input formControlName="email" type="email" placeholder="kristin.watson@example.com" /></label>
                <label>Password<div class="pw-wrap"><input formControlName="password" [type]="showPw()?'text':'password'" placeholder="••••••••" /><button type="button" class="eye" (click)="showPw.set(!showPw())">@if(showPw()){<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}@else{<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}</button></div></label>
                <div class="opts"><label class="chk"><input type="checkbox" /><span>Remember me</span></label><a href="#">Forgot password?</a></div>
                @if(error()){<p class="err">{{error()}}</p>}
                <button type="submit" class="m-submit" [disabled]="form.invalid||loading()">Sign in</button>
                <app-loader [show]="loading()" [inline]="true" text="Signing in..." />
              </form>
              <div class="divider"><span>Sign in with</span></div>
              <div class="m-socials"><button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button><button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#1DA1F2" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></button><button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067C3.151 21.39 7.241 24 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/><path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"/><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/></svg></button><button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#000" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg></button></div>
              <p class="m-switch">Don't have an account? <a routerLink="/register">Sign up</a></p>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .auth-page{min-height:100vh;font-family:Inter,system-ui,sans-serif;color:#162344}
    .desktop-only{display:block}.mobile-only{display:none}
    @media(max-width:760px){.desktop-only{display:none!important}.mobile-only{display:block}}

    /* DESKTOP */
    .desktop-only{min-height:100vh;display:grid;place-items:center;padding:32px;background:linear-gradient(120deg,#eaf0ff,#cbd7f5 55%,#edf2ff)}
    .auth-layout{width:min(1120px,100%);min-height:650px;display:grid;grid-template-columns:1.08fr .92fr;border-radius:28px;overflow:hidden;box-shadow:0 30px 80px rgba(50,70,130,.25)}
    .auth-showcase{position:relative;overflow:hidden;padding:56px;background:linear-gradient(145deg,#5378d7,#2d4c9f 80%);color:#fff}
    .auth-showcase:before{content:"";position:absolute;width:620px;height:620px;border-radius:43% 57% 58% 42%;background:linear-gradient(135deg,#9db4fb,#6f8ee6 60%,transparent 61%);right:-200px;top:-230px;opacity:.85}
    .s-shape,.s-ball{position:absolute;border-radius:50%;z-index:1}.s-shape--1{width:270px;height:270px;right:-25px;top:-72px;border:44px solid rgba(255,255,255,.62);border-left-color:transparent;transform:rotate(-32deg)}.s-shape--2{width:300px;height:220px;left:-80px;top:120px;border-radius:48%;background:rgba(36,66,157,.36);transform:rotate(28deg)}.s-ball--1{width:96px;height:96px;top:36px;left:-35px;background:radial-gradient(circle at 30% 25%,#5277db,#102257 72%);box-shadow:15px 20px 30px #15317177}.s-ball--2{width:82px;height:82px;right:95px;top:162px;background:radial-gradient(circle at 32% 22%,#e1edff,#6e99e8 62%);box-shadow:8px 12px 22px #26418b88}.s-ball--3{width:118px;height:118px;left:82px;bottom:55px;background:radial-gradient(circle at 30% 25%,#537be0,#152b69 70%);box-shadow:15px 18px 25px #172a6288}
    .s-copy{position:absolute;z-index:2;left:56px;bottom:146px;max-width:320px}.s-eyebrow{font-size:.69rem;letter-spacing:.14em;font-weight:800;color:#5679dd}.s-copy .s-eyebrow{color:#d8e4ff}.s-copy h1{font-size:2.5rem;line-height:1.1;margin:0 0 15px}.s-copy p{margin:0;line-height:1.6;color:#e2eaff}.s-switch{position:absolute;z-index:2;left:56px;bottom:54px;color:#fff;text-decoration:none;font-size:.9rem}.s-switch strong{margin-left:7px;border-bottom:1px solid #fff}
    .auth-card{background:#fff;padding:52px 58px;display:flex;flex-direction:column;justify-content:center}.back-link{color:#63718e;text-decoration:none;font-size:.8rem;font-weight:600;margin-bottom:20px}.back-link span{font-size:1.3rem;margin-right:5px}.heading h2{font-size:2rem;margin:0 0 9px;color:#1a2e66}.heading .sub{font-size:.9rem;color:#7b869d;margin:0 0 27px}
    form label:not(.chk){display:block;font-size:.76rem;font-weight:700;color:#45516a;margin:0 0 15px}input:not([type=checkbox]){box-sizing:border-box;display:block;width:100%;padding:12px 13px;margin-top:7px;border:1px solid #dfe4ef;border-radius:9px;font:inherit;font-size:.87rem;outline:none;transition:.2s;color:#1d2b4d}input:not([type=checkbox]):focus{border-color:#4c70d5;box-shadow:0 0 0 3px #dce6ff}
    .pw-wrap{position:relative}.pw-wrap input{padding-right:42px!important}.eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#7b869d;padding:4px;display:flex}.eye:hover{color:#4167ca}
    .opts{display:flex;justify-content:space-between;align-items:center;margin:2px 0 22px;font-size:.73rem}.chk{display:flex;gap:7px;align-items:center;color:#788397}.chk input{accent-color:#4268ca}.opts a{color:#4167cc;text-decoration:none;font-weight:700}.err{font-size:.8rem;color:#c1354d;margin:-8px 0 15px}
    .btn-primary{width:100%;border:0;border-radius:9px;padding:13px;background:#4167ca;color:#fff;font-weight:700;box-shadow:0 8px 16px #4167ca42;cursor:pointer;transition:.2s}.btn-primary:hover:not(:disabled){background:#3158bb;transform:translateY(-1px)}.btn-primary:disabled{opacity:.5}.btn-primary span{margin-left:7px;font-size:1.1rem}
    .divider{display:flex;align-items:center;gap:12px;color:#a2aabc;font-size:.72rem;margin:25px 0 17px}.divider:before,.divider:after{content:"";height:1px;background:#edf0f5;flex:1}
    .socials{display:flex;justify-content:center;gap:13px}.socials button{width:36px;height:36px;border:1px solid #e2e7f0;background:#fff;border-radius:50%;cursor:pointer;font-weight:800;color:#4167ca;font-size:1rem}.socials button:first-child{color:#dd4b39}.socials button:last-child{color:#1f2937;font-size:.72rem}
    .switch-link{text-align:center;color:#7b869d;font-size:.8rem;margin:20px 0 0}.switch-link a{color:#4167ca;font-weight:800;text-decoration:none}

    /* MOBILE WELCOME */
    .m-welcome{min-height:100vh;display:flex;flex-direction:column;position:relative;overflow:hidden}
    .m-bg{position:absolute;inset:0;background:linear-gradient(160deg,#5b7de3 0%,#3b5cc4 30%,#1e3a8a 70%,#2c4a94 100%);z-index:0}
    .m-blob{position:absolute;border-radius:50%}.m-blob--1{width:300px;height:300px;top:-80px;right:-60px;background:radial-gradient(circle,#7b9ef0 0%,#4a6fd8 50%,transparent 70%);opacity:.6}.m-blob--2{width:400px;height:250px;bottom:-50px;left:-100px;background:radial-gradient(ellipse,#1e3a7a,#2850a8 60%,transparent 80%);opacity:.8;border-radius:40% 60% 50% 50%}.m-blob--3{width:200px;height:300px;top:30%;left:50%;background:radial-gradient(ellipse,#3858ad 0%,transparent 70%);opacity:.5;border-radius:30% 70% 60% 40%}
    .m-ball{position:absolute;border-radius:50%;z-index:1}.m-ball--1{width:100px;height:100px;top:40px;left:-20px;background:radial-gradient(circle at 30% 25%,#4a6fd8,#152b69 70%);box-shadow:10px 15px 25px rgba(20,40,80,.4)}.m-ball--2{width:70px;height:70px;top:80px;right:40px;background:radial-gradient(circle at 30% 25%,#e1edff,#6e99e8 62%,#3154ad);box-shadow:8px 10px 20px rgba(30,60,120,.3)}.m-ball--3{width:90px;height:90px;bottom:140px;left:30px;background:radial-gradient(circle at 30% 25%,#537be0,#152b69 70%);box-shadow:12px 15px 20px rgba(20,40,80,.4)}
    .m-welcome-content{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:60px 32px;position:relative;z-index:2}
    .m-welcome-content h1{color:#fff;font-size:2.2rem;font-weight:800;margin:0 0 12px}.m-welcome-content p{color:rgba(255,255,255,.75);font-size:.95rem;max-width:260px;line-height:1.5}
    .m-welcome-btns{display:flex;position:relative;z-index:2;border-top:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);backdrop-filter:blur(10px)}
    .m-btn-text,.m-btn-pill{flex:1;padding:18px;border:none;font-size:.9rem;font-weight:700;cursor:pointer;transition:.2s}
    .m-btn-text{background:transparent;color:rgba(255,255,255,.8)}.m-btn-text:hover{color:#fff}
    .m-btn-pill{background:#fff;color:#3b5cc4;border-radius:14px;margin:8px;box-shadow:0 4px 15px rgba(0,0,0,.15)}.m-btn-pill:hover{transform:scale(1.02)}

    /* MOBILE FORM */
    .m-form-page{min-height:100vh;display:flex;flex-direction:column;background:#eef3ff}
    .m-header{position:relative;height:160px;background:linear-gradient(135deg,#6b8ceb,#4a6fd8 50%,#3b5cc4);border-radius:0 0 28px 28px;overflow:hidden}
    .m-header .m-ball--1{width:120px;height:120px;top:-30px;right:-20px;background:radial-gradient(circle at 30% 25%,#7b9ef0,#4a6fd8 70%);opacity:.5}
    .m-header .m-ball--2{width:70px;height:70px;top:20px;left:-15px;background:radial-gradient(circle at 30% 25%,#e1edff,#6e99e8 62%);opacity:.5}
    .m-back{position:absolute;top:16px;left:16px;color:#fff;text-decoration:none;font-size:.85rem;font-weight:600;z-index:2;padding:8px 14px;background:rgba(0,0,0,.15);border-radius:10px;border:none;cursor:pointer}
    .m-card{flex:1;background:#fff;margin:-30px 16px 16px;border-radius:24px;padding:32px 24px;box-shadow:0 10px 40px rgba(30,60,120,.1);position:relative;z-index:3;animation:slideUp .3s cubic-bezier(.32,.72,0,1)}
    .m-card h2{text-align:center;font-size:1.5rem;color:#3b5cc4;margin:0 0 24px;font-weight:800}
    .m-card form label:not(.chk){display:block;font-size:.75rem;font-weight:700;color:#45516a;margin:0 0 16px}
    .m-card input:not([type=checkbox]){box-sizing:border-box;display:block;width:100%;padding:14px 16px;margin-top:6px;border:1.5px solid #e2e8f0;border-radius:12px;background:#fafcff;font:inherit;font-size:.85rem;outline:none;transition:.2s;color:#1d2b4d}
    .m-card input:not([type=checkbox]):focus{border-color:#4167ca;box-shadow:0 0 0 3px #e3eaff;background:#fff}
    .m-submit{width:100%;border:0;border-radius:12px;padding:15px;background:#3b5cc4;color:#fff;font-weight:700;font-size:.9rem;box-shadow:0 8px 24px #3b5cc435;cursor:pointer;transition:.2s;margin-top:8px}.m-submit:hover:not(:disabled){background:#2d4c9f}.m-submit:disabled{opacity:.5}
    .m-socials{display:flex;justify-content:center;gap:16px}.m-socials button{width:44px;height:44px;border:1px solid #e5eaf3;background:#fff;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.15s}.m-socials button:active{transform:scale(.92)}
    .m-switch{text-align:center;color:#7b869d;font-size:.82rem;margin:20px 0 0}.m-switch a{color:#3b5cc4;font-weight:800;text-decoration:none}
    @keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
  `],
})
export class LoginComponent {
  form: FormGroup; error = signal<string | null>(null); returnUrl = signal('/'); showPw = signal(false); loading = signal(false);
  mobileView = signal<'welcome' | 'login'>('welcome');
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private auth: AuthService, private toast: ToastService, private router: Router) { this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] }); this.returnUrl.set(this.route.snapshot.queryParamMap.get('returnUrl') || '/'); }
  submit() { if (this.form.invalid) return; this.loading.set(true); this.error.set(null); const { email, password } = this.form.getRawValue(); const returnUrl = this.returnUrl(); const safeUrl = returnUrl.startsWith('/login') || returnUrl.startsWith('/register') ? '/' : returnUrl; this.auth.login(email!, password!, safeUrl).subscribe({ next: () => { this.loading.set(false); this.toast.success('Welcome back!'); const user = this.auth.currentUser(); if (user?.role === 'admin' && safeUrl === '/') { this.router.navigate(['/admin']); } }, error: () => { this.loading.set(false); this.error.set('Incorrect email or password.'); } }); }
}
