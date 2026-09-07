import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Mail, Phone, Send, MessageCircle, BadgeCheck, ArrowUpRight } from 'lucide-angular';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <main class="contact-page">
      <div class="glow glow-one" aria-hidden="true"></div>
      <div class="glow glow-two" aria-hidden="true"></div>
      <div class="glow glow-three" aria-hidden="true"></div>

      <!-- Hero Section -->
      <section class="contact-hero">
        <p class="eyebrow">{{ i18n.t('contactEyebrow') }}</p>
        <h1>{{ i18n.t('contactHeroTitle1') }} <span>{{ i18n.t('contactHeroTitleHighlight') }}</span> {{ i18n.t('contactHeroTitle2') }}</h1>
        <p>{{ i18n.t('contactHeroDesc') }}</p>
        <div class="trust">
          <span><lucide-icon [img]="BadgeCheck"/> {{ i18n.t('contactTrustFriendly') }}</span>
          <span><lucide-icon [img]="Send"/> {{ i18n.t('contactTrustDirect') }}</span>
          <span><lucide-icon [img]="MessageCircle"/> {{ i18n.t('contactTrustReal') }}</span>
        </div>
      </section>

      <!-- Contact Grid -->
      <section class="contact-grid">
        <!-- Form Card -->
        <section class="form-card">
          <div class="card-heading">
            <p class="eyebrow">{{ i18n.t('contactFormEyebrow') }}</p>
            <h2>{{ i18n.t('contactFormTitle') }}</h2>
            <p>{{ i18n.t('contactFormSubtitle') }}</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field-row">
              <label>
                {{ i18n.t('contactFieldName') }}
                <input formControlName="name" [placeholder]="i18n.t('contactPlaceholderName')" autocomplete="name" />
              </label>
              <label>
                {{ i18n.t('contactFieldEmail') }}
                <input formControlName="email" type="email" [placeholder]="i18n.t('contactPlaceholderEmail')" autocomplete="email" />
              </label>
            </div>

            <label>
              {{ i18n.t('contactFieldSubject') }}
              <select formControlName="subject">
                <option value="">{{ i18n.t('contactTopicSelect') }}</option>
                <option value="CV creation">{{ i18n.t('contactTopicCv') }}</option>
                <option value="Templates">{{ i18n.t('contactTopicTemplates') }}</option>
                <option value="Account support">{{ i18n.t('contactTopicAccount') }}</option>
                <option value="Feedback">{{ i18n.t('contactTopicFeedback') }}</option>
              </select>
            </label>

            <label>
              {{ i18n.t('contactFieldMessage') }}
              <textarea formControlName="message" rows="6" [placeholder]="i18n.t('contactPlaceholderMessage')"></textarea>
            </label>

            @if (status() === 'sent') {
              <p class="message success">
                <lucide-icon [img]="BadgeCheck"/> {{ i18n.t('contactMsgSuccess') }}
              </p>
            }
            @if (status() === 'error') {
              <p class="message error">
                {{ i18n.t('contactMsgError') }}
              </p>
            }

            <button type="submit" [disabled]="form.invalid || status() === 'sending'">
              {{ status() === 'sending' ? i18n.t('contactBtnSending') : i18n.t('contactBtnSend') }}
              <lucide-icon [img]="Send"/>
            </button>
          </form>
        </section>

        <!-- Aside (Reach Us Directly) -->
        <aside class="contact-side">
          <div class="side-copy">
            <p class="eyebrow">{{ i18n.t('contactSideEyebrow') }}</p>
            <h2>{{ i18n.t('contactSideTitle') }}</h2>
            <p>{{ i18n.t('contactSideSubtitle') }}</p>
          </div>

          <div class="direct-grid">
            <a class="direct-card" href="mailto:sokkhim519@gmail.com">
              <span class="icon-shell"><lucide-icon [img]="Mail"/></span>
              <div>
                <small>{{ i18n.t('contactLabelEmail') }}</small>
                <strong>sokkhim519&#64;gmail.com</strong>
              </div>
              <lucide-icon class="arrow" [img]="ArrowUpRight"/>
            </a>
            <a class="direct-card" href="tel:+855964910220">
              <span class="icon-shell"><lucide-icon [img]="Phone"/></span>
              <div>
                <small>{{ i18n.t('contactLabelPhone') }}</small>
                <strong>096 491 0220</strong>
              </div>
              <lucide-icon class="arrow" [img]="ArrowUpRight"/>
            </a>
          </div>

          <div class="social-title">
            <span></span>
            <b>{{ i18n.t('contactSocialTitle') }}</b>
            <span></span>
          </div>

          <div class="social-list">
            <a class="social facebook" href="https://www.facebook.com/share/1DKNpoGtsu/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Open CQ Professional on Facebook">
              <i>f</i>
              <div>
                <b>Facebook</b>
                <small>{{ i18n.t('contactFbDesc') }}</small>
              </div>
              <lucide-icon [img]="ArrowUpRight"/>
            </a>
            <a class="social tiktok" href="https://www.tiktok.com/@cqprofessional1111" target="_blank" rel="noopener noreferrer" aria-label="Open CQ Professional on TikTok">
              <i>♪</i>
              <div>
                <b>TikTok</b>
                <small>{{ i18n.t('contactTiktokDesc') }}</small>
              </div>
              <lucide-icon [img]="ArrowUpRight"/>
            </a>
            <a class="social telegram" href="https://t.me/cvresumecqprofessional" target="_blank" rel="noopener noreferrer" aria-label="Open CQ Professional on Telegram">
              <i><lucide-icon [img]="Send"/></i>
              <div>
                <b>Telegram</b>
                <small>{{ i18n.t('contactTelegramDesc') }}</small>
              </div>
              <lucide-icon [img]="ArrowUpRight"/>
            </a>
          </div>

          <div class="safe-note">
            <lucide-icon [img]="BadgeCheck"/>
            <p>
              <b>{{ i18n.t('contactSafeTitle') }}</b><br>
              {{ i18n.t('contactSafeDesc') }}
            </p>
          </div>
        </aside>
      </section>
    </main>
  `,
  styles: [`.contact-page{min-height:100vh;box-sizing:border-box;overflow:hidden;position:relative;padding:118px 24px 78px;background:linear-gradient(150deg,#f8faff 0%,#eef3ff 45%,#f4f8ff 100%);color:#202a43;font-family:Manrope,Inter,system-ui,sans-serif}:host-context(.dark) .contact-page{background:linear-gradient(145deg,#0d1527 0%,#111b32 50%,#111a2c 100%);color:#eaf0fa}.glow{position:absolute;border-radius:50%;pointer-events:none;filter:blur(80px);z-index:0}.glow-one{width:550px;height:550px;right:-150px;top:50px;background:rgba(99,102,241,0.18)}.glow-two{width:480px;height:480px;left:-180px;top:600px;background:rgba(14,165,233,0.16)}.glow-three{width:600px;height:600px;right:-200px;top:1000px;background:rgba(168,85,247,0.14)}:host-context(.dark) .glow-one{background:#4d3f9866}:host-context(.dark) .glow-two{background:#1d5b8d55}:host-context(.dark) .glow-three{background:#5d388f44}.contact-hero,.contact-grid{position:relative;z-index:1;max-width:1120px;margin:auto}.contact-hero{max-width:720px;text-align:center;padding:12px 0 48px}.eyebrow{margin:0 0 13px;color:#624bd0;font-size:.68rem;font-weight:800;letter-spacing:.14em}.contact-hero h1{margin:0;font-size:clamp(2.4rem,5vw,4.25rem);line-height:1.05;letter-spacing:-.065em}.contact-hero h1 span{color:#624bd0}.contact-hero>p:not(.eyebrow){max-width:610px;margin:18px auto 25px;color:#6d778d;font-size:.96rem;line-height:1.72}.trust{display:flex;justify-content:center;flex-wrap:wrap;gap:9px}.trust span{display:inline-flex;align-items:center;gap:6px;padding:8px 11px;border:1px solid #e1e2f1;border-radius:999px;background:#ffffffa8;color:#5d5f78;font-size:.7rem;font-weight:700}.trust lucide-icon{width:14px;height:14px;color:#5f48cb}.contact-grid{display:grid;grid-template-columns:1.05fr .95fr;overflow:hidden;border:1px solid #e1e3ef;border-radius:27px;background:#fff;box-shadow:0 24px 62px #24385d1c}.form-card{padding:52px 54px;background:#fff}.card-heading h2,.side-copy h2{margin:0 0 8px;font-size:2rem;line-height:1.12;letter-spacing:-.045em}.card-heading>p:last-child,.side-copy>p:last-child{margin:0 0 28px;color:#778197;font-size:.88rem;line-height:1.65}.field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}form label{display:block;margin:0 0 16px;color:#4c566c;font-size:.74rem;font-weight:800}input,select,textarea{box-sizing:border-box;display:block;width:100%;margin-top:7px;padding:13px;border:1px solid #e0e4ee;border-radius:11px;background:#fbfcff;color:#27334d;font:inherit;font-size:16px;outline:none;transition:border-color .2s,box-shadow .2s,background .2s}textarea{min-height:132px;resize:vertical}select{color:#667188}input:focus,select:focus,textarea:focus{border-color:#735ee0;background:#fff;box-shadow:0 0 0 4px #e9e5ff}form button{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:12px;padding:14px;background:#5d46d4;color:#fff;font:800 .84rem Manrope,Inter,sans-serif;box-shadow:0 10px 20px #5d46d43d;cursor:pointer;transition:transform .2s,box-shadow .2s,background .2s}form button:hover:not(:disabled){background:#4f3bc2;transform:translateY(-2px);box-shadow:0 14px 25px #5d46d450}form button:active:not(:disabled){transform:scale(.98)}form button:disabled{opacity:.6;cursor:not-allowed}form button lucide-icon{width:17px;height:17px}.message{display:flex;align-items:center;gap:7px;margin:-2px 0 15px;padding:11px 12px;border-radius:10px;font-size:.76rem;line-height:1.5}.message lucide-icon{width:17px;height:17px;flex:none}.success{background:#e9f8ef;color:#207f52}.error{background:#fff0f3;color:#b63851}.contact-side{padding:52px 46px;background:linear-gradient(145deg,#f4f2ff,#eff5ff)}.side-copy>p:last-child{max-width:400px}.direct-grid{display:grid;gap:10px}.direct-card,.social{position:relative;display:flex;align-items:center;gap:11px;border:1px solid #e2e4f1;border-radius:14px;background:#ffffffd9;color:#29354f;text-decoration:none;transition:transform .2s cubic-bezier(.32,.72,0,1),box-shadow .2s,border-color .2s}.direct-card{padding:12px}.direct-card:hover,.social:hover{transform:translateY(-2px);border-color:#c9c0fa;box-shadow:0 10px 20px #2a386b12}.direct-card:active,.social:active{transform:scale(.98)}.icon-shell,.social i{display:grid;place-items:center;flex:none;width:36px;height:36px;border-radius:11px;background:#e8e4ff;color:#5b46c6}.icon-shell lucide-icon{width:18px;height:18px}.direct-card small,.social small{display:block;margin-bottom:3px;color:#8991a2;font-size:.57rem;font-weight:800;letter-spacing:.09em}.direct-card strong,.social b{display:block;font-size:.72rem}.arrow{margin-left:auto;width:16px;height:16px;color:#8b85b3}.social-title{display:flex;align-items:center;gap:10px;margin:26px 0 11px;color:#636a80;font-size:.7rem}.social-title span{height:1px;flex:1;background:#dddff0}.social-list{display:grid;gap:9px}.social{padding:10px 12px}.social i{font-style:normal;font-size:1.35rem;font-weight:900}.social.facebook i{background:#e6efff;color:#1877f2}.social.tiktok i{background:#1e1e25;color:#fff}.social.telegram i{background:#e1f2ff;color:#229ed9}.social i lucide-icon{width:18px;height:18px}.safe-note{display:flex;gap:9px;margin-top:25px;padding:13px;border:1px solid #dedaf8;border-radius:13px;background:#ffffff9c;color:#717b92;font-size:.7rem;line-height:1.55}.safe-note lucide-icon{flex:none;width:19px;height:19px;color:#4dba78}.safe-note p{margin:0}.safe-note b{color:#4b566e}@media(max-width:900px){.contact-page{padding-top:96px}.contact-grid{grid-template-columns:1fr}.contact-side{padding:46px 54px}.side-copy>p:last-child{max-width:560px}}@media(max-width:620px){.contact-page{padding:84px 14px 38px}.contact-hero{padding:9px 9px 34px}.contact-hero h1{font-size:2.55rem}.contact-hero>p:not(.eyebrow){font-size:.89rem}.trust{gap:6px}.trust span{font-size:.64rem;padding:7px 9px}.contact-grid{border-radius:20px}.form-card,.contact-side{padding:33px 21px}.card-heading h2,.side-copy h2{font-size:1.72rem}.field-row{grid-template-columns:1fr;gap:0}.contact-side{padding-top:36px}.glow-one{right:-300px}}@media(prefers-reduced-motion:reduce){.direct-card,.social,form button,input,select,textarea{transition:none!important}}`],
})
export class ContactComponent {
  readonly i18n = inject(TranslationService);
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Send = Send;
  readonly MessageCircle = MessageCircle;
  readonly BadgeCheck = BadgeCheck;
  readonly ArrowUpRight = ArrowUpRight;

  status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.status.set('sending');
    this.http.post('/api/v1/contact', this.form.getRawValue()).subscribe({
      next: () => {
        this.status.set('sent');
        this.form.reset();
      },
      error: () => this.status.set('error'),
    });
  }
}

