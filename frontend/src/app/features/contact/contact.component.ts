import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="contact-page">
      <div class="contact-blob blob-one"></div><div class="contact-blob blob-two"></div>
      <section class="contact-shell">
        <aside class="contact-intro">
          <p class="kicker">WE ARE HERE TO HELP</p>
          <h1>Let’s make your next career move count.</h1>
          <p class="intro-text">Questions about creating your CV, choosing a template, or using CV Creator? Send us a message and we will be happy to help.</p>
          <div class="contact-details">
            <div class="detail"><span class="detail-icon">✉</span><div><small>EMAIL US</small><a href="mailto:support&#64;cvcreator.com">support&#64;cvcreator.com</a></div></div>
            <div class="detail"><span class="detail-icon">◷</span><div><small>SUPPORT HOURS</small><p>Monday – Friday, 9:00 – 18:00</p></div></div>
          </div>
          <div class="help-note"><span>✓</span><p><strong>Helpful, human support.</strong><br>We usually reply within one business day.</p></div>
        </aside>

        <section class="form-card">
          <div class="form-heading"><p class="kicker">SEND A MESSAGE</p><h2>How can we help?</h2><p>Tell us a little about what you need.</p></div>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field-row"><label>Your name<input formControlName="name" placeholder="Your full name" autocomplete="name" /></label><label>Email address<input formControlName="email" type="email" placeholder="you@example.com" autocomplete="email" /></label></div>
            <label>What can we help with?<select formControlName="subject"><option value="">Select a topic</option><option value="CV creation">Creating a CV</option><option value="Templates">Templates</option><option value="Account support">Account support</option><option value="Feedback">Feedback</option></select></label>
            <label>Your message<textarea formControlName="message" rows="5" placeholder="Tell us how we can help..."></textarea></label>
            @if (status() === 'sent') { <p class="success-message">✓ Thanks — your message has been sent. We will be in touch soon.</p> }
            @if (status() === 'error') { <p class="error-message">We could not send your message. Please try again.</p> }
            <button type="submit" [disabled]="form.invalid || status() === 'sending'">{{ status() === 'sending' ? 'Sending...' : 'Send message' }} <span>→</span></button>
          </form>
        </section>
      </section>
    </main>
  `,
  styles: [`
    .contact-page{min-height:100vh;box-sizing:border-box;padding:118px 28px 60px;overflow:hidden;position:relative;background:linear-gradient(135deg,#f3f6ff,#e3ecff 55%,#f8faff);font-family:Inter,system-ui,sans-serif;color:#1a2e66}.contact-shell{max-width:1090px;margin:auto;min-height:605px;display:grid;grid-template-columns:.91fr 1.09fr;border-radius:27px;overflow:hidden;position:relative;z-index:1;box-shadow:0 25px 65px rgba(42,67,133,.18)}.contact-intro{position:relative;padding:68px 58px;background:linear-gradient(145deg,#4f75d3,#28478f);color:#fff;overflow:hidden}.contact-intro:before{content:"";position:absolute;width:460px;height:460px;border-radius:48% 52% 50% 50%;right:-255px;top:-150px;border:55px solid #a9c1ff8c;transform:rotate(30deg)}.contact-intro:after{content:"";position:absolute;width:360px;height:250px;border-radius:50%;left:-165px;bottom:-155px;background:#173475;opacity:.8}.kicker{color:#4b70cb;font-size:.69rem;letter-spacing:.15em;font-weight:800;margin:0 0 15px}.contact-intro .kicker{color:#d9e5ff}.contact-intro h1{font-size:clamp(2.25rem,3.5vw,3.2rem);line-height:1.1;letter-spacing:-.045em;margin:0;position:relative;z-index:1}.intro-text{color:#e2ebff;line-height:1.7;font-size:.92rem;margin:22px 0 39px;position:relative;z-index:1}.contact-details{display:grid;gap:20px;position:relative;z-index:1}.detail{display:flex;align-items:center;gap:13px}.detail-icon{height:37px;width:37px;border-radius:10px;display:grid;place-items:center;background:#ffffff23;color:#fff;font-size:1rem}.detail small{color:#c8d8ff;font-size:.61rem;letter-spacing:.1em;font-weight:800;display:block;margin-bottom:4px}.detail a,.detail p{color:#fff;font-size:.8rem;margin:0;text-decoration:none;font-weight:600}.help-note{position:absolute;z-index:1;left:58px;right:40px;bottom:58px;display:flex;gap:10px;align-items:flex-start;color:#d9e5ff;font-size:.75rem;line-height:1.55}.help-note>span{height:23px;width:23px;flex:none;display:grid;place-items:center;border-radius:50%;background:#dff5e9;color:#269563;font-weight:800}.help-note p{margin:0}.help-note strong{color:#fff}.form-card{padding:62px 59px;background:#fff}.form-heading h2{font-size:2rem;letter-spacing:-.04em;margin:0 0 8px}.form-heading>p:last-child{color:#7c889f;font-size:.88rem;margin:0 0 27px}.field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}form label{display:block;color:#46536c;font-weight:700;font-size:.74rem;margin:0 0 15px}input,select,textarea{box-sizing:border-box;display:block;width:100%;margin-top:7px;padding:12px 13px;border:1px solid #dfe5f1;border-radius:9px;background:#fff;color:#243657;outline:none;font:inherit;font-size:.84rem;transition:.2s}textarea{resize:vertical;min-height:112px}select{appearance:auto;color:#77849a}input:focus,select:focus,textarea:focus{border-color:#4b70cf;box-shadow:0 0 0 3px #e2eaff}.success-message,.error-message{font-size:.79rem;margin:-2px 0 14px;padding:10px 12px;border-radius:8px}.success-message{color:#258a5b;background:#eaf8f0}.error-message{color:#bd3650;background:#fff0f3}button{width:100%;border:0;padding:13px;border-radius:9px;background:#4167ca;color:#fff;font-weight:800;box-shadow:0 8px 16px #4167ca3d;cursor:pointer;transition:.2s}button:hover:not(:disabled){background:#3158bb;transform:translateY(-1px)}button:disabled{opacity:.6;cursor:not-allowed}button span{margin-left:6px;font-size:1.1rem}.contact-blob{position:absolute;border-radius:50%;pointer-events:none}.blob-one{height:330px;width:330px;top:100px;left:-155px;background:#a7beef;opacity:.32}.blob-two{height:420px;width:420px;right:-220px;bottom:-150px;background:#c9d8fb;opacity:.55}@media(max-width:800px){.contact-page{padding:85px 16px 28px}.contact-shell{grid-template-columns:1fr;border-radius:20px}.contact-intro{padding:45px 32px 135px}.contact-intro h1{font-size:2.3rem}.help-note{left:32px;bottom:33px}.form-card{padding:43px 28px}.field-row{grid-template-columns:1fr}.contact-intro:before{right:-290px}.contact-intro:after{display:none}}
  `],
})
export class ContactComponent {
  status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
  form: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient) { this.form = this.fb.group({ name: ['', Validators.required], email: ['', [Validators.required, Validators.email]], subject: [''], message: ['', Validators.required] }); }
  submit() { if (this.form.invalid) return; this.status.set('sending'); this.http.post('/api/v1/contact', this.form.getRawValue()).subscribe({ next: () => { this.status.set('sent'); this.form.reset(); }, error: () => this.status.set('error') }); }
}
