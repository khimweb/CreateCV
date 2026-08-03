import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { GoogleSignInComponent } from '../../shared/components/auth/google-sign-in.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoaderComponent, GoogleSignInComponent],
  template: `
    <section class="auth-page">
      <!-- Desktop -->
      <div class="desktop-only">
        <div class="auth-layout">
          <aside class="auth-showcase">
            <div class="s-shape s-shape--1"></div><div class="s-shape s-shape--2"></div>
            <div class="s-ball s-ball--1"></div><div class="s-ball s-ball--2"></div><div class="s-ball s-ball--3"></div>
            <div class="s-copy"><span class="s-eyebrow">CV CREATOR</span><h1>Your next chapter starts here.</h1><p>Create a polished CV in minutes, then make every application count.</p></div>
            <a routerLink="/login" class="s-switch">Already a member? <strong>Sign in</strong></a>
          </aside>
          <main class="auth-card">
            <a routerLink="/" class="back-link"><span>‹</span> Back to home</a>
            <div class="heading"><p class="s-eyebrow">GET STARTED</p><h2>Create your account</h2><p class="sub">Start building your professional CV today.</p></div>
            <form [formGroup]="form" (ngSubmit)="submit()">
              <label>Full name<input formControlName="fullName" type="text" placeholder="Your full name" /></label>
              <label>Email address<input formControlName="email" type="email" placeholder="you@example.com" /></label>
              <label>Password<div class="pw-wrap"><input formControlName="password" [type]="showPw()?'text':'password'" placeholder="At least 8 characters" /><button type="button" class="eye" (click)="showPw.set(!showPw())">@if(showPw()){<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}@else{<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}</button></div></label>
              <label class="chk terms"><input type="checkbox" /><span>I agree to the <a href="#">Terms of Service</a></span></label>
              @if(error()){<p class="err">{{error()}}</p>}
              <button type="submit" class="btn-primary" [disabled]="form.invalid||loading()">Create account <span>→</span></button>
              <app-loader [show]="loading()" [inline]="true" text="Creating account..." />
            </form>
            <div class="divider"><span>or continue with</span></div>
            <div class="socials"><app-google-sign-in (credential)="signInWithGoogle($event)" /></div>
            <p class="switch-link">Already have an account? <a routerLink="/login">Sign in</a></p>
          </main>
        </div>
      </div>

      <!-- Mobile -->
      <div class="mobile-only">
        <div class="m-form-page">
          <div class="m-header">
            <div class="m-ball m-ball--1"></div><div class="m-ball m-ball--2"></div>
            <a routerLink="/login" class="m-back">‹ Back</a>
          </div>
          <div class="m-card">
            <h2>Get Started</h2>
            <form [formGroup]="form" (ngSubmit)="submit()">
              <label>Full Name<input formControlName="fullName" type="text" placeholder="Enter Full Name" /></label>
              <label>Email<input formControlName="email" type="email" placeholder="Enter Email" /></label>
              <label>Password<div class="pw-wrap"><input formControlName="password" [type]="showPw()?'text':'password'" placeholder="Enter Password" /><button type="button" class="eye" (click)="showPw.set(!showPw())">@if(showPw()){<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}@else{<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}</button></div></label>
              <label class="chk terms"><input type="checkbox" /><span>I agree to the processing of <a href="#">Personal data</a></span></label>
              @if(error()){<p class="err">{{error()}}</p>}
              <button type="submit" class="m-submit" [disabled]="form.invalid||loading()">Sign up</button>
              <app-loader [show]="loading()" [inline]="true" text="Creating account..." />
            </form>
            <div class="divider"><span>Sign up with</span></div>
            <app-google-sign-in (credential)="signInWithGoogle($event)" />
            <div class="m-socials"><button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button><button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#1DA1F2" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></button><button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067C3.151 21.39 7.241 24 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/><path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"/><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/></svg></button><button type="button"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#000" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg></button></div>
            <p class="m-switch">Already have an account? <a routerLink="/login">Sign in</a></p>
          </div>
        </div>
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
    .s-copy{position:absolute;z-index:2;left:56px;bottom:146px;max-width:340px}.s-eyebrow{font-size:.69rem;letter-spacing:.14em;font-weight:800;color:#5679dd}.s-copy .s-eyebrow{color:#d8e4ff}.s-copy h1{font-size:2.5rem;line-height:1.1;margin:0 0 15px}.s-copy p{margin:0;line-height:1.6;color:#e2eaff}.s-switch{position:absolute;z-index:2;left:56px;bottom:54px;color:#fff;text-decoration:none;font-size:.9rem}.s-switch strong{margin-left:7px;border-bottom:1px solid #fff}
    .auth-card{background:#fff;padding:52px 58px;display:flex;flex-direction:column;justify-content:center}.back-link{color:#63718e;text-decoration:none;font-size:.8rem;font-weight:600;margin-bottom:20px}.back-link span{font-size:1.3rem;margin-right:5px}.heading h2{font-size:2rem;margin:0 0 9px;color:#1a2e66}.heading .sub{font-size:.9rem;color:#7b869d;margin:0 0 27px}
    form label:not(.chk){display:block;font-size:.76rem;font-weight:700;color:#45516a;margin:0 0 14px}input:not([type=checkbox]){box-sizing:border-box;display:block;width:100%;padding:12px 13px;margin-top:7px;border:1px solid #dfe4ef;border-radius:9px;font:inherit;font-size:.87rem;outline:none;transition:.2s;color:#1d2b4d}input:not([type=checkbox]):focus{border-color:#4c70d5;box-shadow:0 0 0 3px #dce6ff}
    .pw-wrap{position:relative}.pw-wrap input{padding-right:42px!important}.eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#7b869d;padding:4px;display:flex}.eye:hover{color:#4167ca}
    .chk{display:flex;gap:7px;align-items:center;color:#788397;font-size:.73rem}.chk input{accent-color:#4268ca}.terms{margin:2px 0 20px}.terms a{color:#4167ca;font-weight:700;text-decoration:none}.err{font-size:.8rem;color:#c1354d;margin:-8px 0 15px}
    .btn-primary{width:100%;border:0;border-radius:9px;padding:13px;background:#4167ca;color:#fff;font-weight:700;box-shadow:0 8px 16px #4167ca42;cursor:pointer;transition:.2s}.btn-primary:hover:not(:disabled){background:#3158bb;transform:translateY(-1px)}.btn-primary:disabled{opacity:.5}.btn-primary span{margin-left:7px;font-size:1.1rem}
    .divider{display:flex;align-items:center;gap:12px;color:#a2aabc;font-size:.72rem;margin:25px 0 17px}.divider:before,.divider:after{content:"";height:1px;background:#edf0f5;flex:1}
    .socials{display:flex;justify-content:center;gap:13px}.socials button{width:36px;height:36px;border:1px solid #e2e7f0;background:#fff;border-radius:50%;cursor:pointer;font-weight:800;color:#4167ca;font-size:1rem}.socials button:first-child{color:#dd4b39}.socials button:last-child{color:#1f2937;font-size:.72rem}
    .switch-link{text-align:center;color:#7b869d;font-size:.8rem;margin:20px 0 0}.switch-link a{color:#4167ca;font-weight:800;text-decoration:none}

    /* MOBILE */
    .m-form-page{min-height:100vh;display:flex;flex-direction:column;background:#eef3ff}
    .m-header{position:relative;height:160px;background:linear-gradient(135deg,#6b8ceb,#4a6fd8 50%,#3b5cc4);border-radius:0 0 28px 28px;overflow:hidden}
    .m-ball{position:absolute;border-radius:50%;z-index:1}.m-ball--1{width:120px;height:120px;top:-30px;right:-20px;background:radial-gradient(circle at 30% 25%,#7b9ef0,#4a6fd8 70%);opacity:.5}.m-ball--2{width:70px;height:70px;top:20px;left:-15px;background:radial-gradient(circle at 30% 25%,#e1edff,#6e99e8 62%);opacity:.5}
    .m-back{position:absolute;top:16px;left:16px;color:#fff;text-decoration:none;font-size:.85rem;font-weight:600;z-index:2;padding:8px 14px;background:rgba(0,0,0,.15);border-radius:10px;border:none}
    .m-card{flex:1;background:#fff;margin:-30px 16px 16px;border-radius:24px;padding:32px 24px;box-shadow:0 10px 40px rgba(30,60,120,.1);position:relative;z-index:3;animation:slideUp .3s cubic-bezier(.32,.72,0,1)}
    .m-card h2{text-align:center;font-size:1.5rem;color:#3b5cc4;margin:0 0 24px;font-weight:800}
    .m-card form label:not(.chk){display:block;font-size:.75rem;font-weight:700;color:#45516a;margin:0 0 16px}
    .m-card input:not([type=checkbox]){box-sizing:border-box;display:block;width:100%;padding:14px 16px;margin-top:6px;border:1.5px solid #e2e8f0;border-radius:12px;background:#fafcff;font:inherit;font-size:.85rem;outline:none;transition:.2s;color:#1d2b4d}
    .m-card input:not([type=checkbox]):focus{border-color:#4167ca;box-shadow:0 0 0 3px #e3eaff;background:#fff}
    .m-submit{width:100%;border:0;border-radius:12px;padding:15px;background:#3b5cc4;color:#fff;font-weight:700;font-size:.9rem;box-shadow:0 8px 24px #3b5cc435;cursor:pointer;transition:.2s;margin-top:8px}.m-submit:hover:not(:disabled){background:#2d4c9f}.m-submit:disabled{opacity:.5}
    .m-socials{display:none}.m-socials button{width:44px;height:44px;border:1px solid #e5eaf3;background:#fff;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.15s}.m-socials button:active{transform:scale(.92)}
    .m-switch{text-align:center;color:#7b869d;font-size:.82rem;margin:20px 0 0}.m-switch a{color:#3b5cc4;font-weight:800;text-decoration:none}
    @keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
  `]
})
export class RegisterComponent {
  form: FormGroup; error = signal<string | null>(null); showPw = signal(false); loading = signal(false);

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: ToastService) {
    this.form = this.fb.group({ fullName: ['', Validators.required], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(8)]] });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true); this.error.set(null);
    const { fullName, email, password } = this.form.getRawValue();
    this.auth.register(fullName!, email!, password!).subscribe({
      next: () => { this.loading.set(false); this.toast.success('Account created!'); this.router.navigate(['/my-cv']); },
      error: err => { this.loading.set(false); this.error.set(err.error?.message || 'Registration failed.'); },
    });
  }

  signInWithGoogle(credential: string) {
    this.loading.set(true); this.error.set(null);
    this.auth.loginWithGoogle(credential).subscribe({
      next: () => { this.loading.set(false); this.toast.success('Signed in with Google.'); },
      error: (error) => {
        this.loading.set(false);
        this.error.set(error.error?.message || 'Google sign-in could not be completed.');
      },
    });
  }
}
