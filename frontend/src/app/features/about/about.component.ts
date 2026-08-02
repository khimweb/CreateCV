import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="about-page">
      <div class="ambient ambient-one"></div><div class="ambient ambient-two"></div>
      <section class="hero">
        <div class="hero-copy">
          <p class="kicker">ABOUT CV CREATOR</p>
          <h1>Great careers begin with a <span>great first impression.</span></h1>
          <p class="lead">CV Creator is a simple, professional service for building a CV that helps your skills get noticed.</p>
          <div class="hero-actions"><a routerLink="/templates" class="primary-action">Explore templates <span>→</span></a><a routerLink="/register" class="secondary-action">Create your CV</a></div>
          <div class="trust-row"><div><strong>Easy</strong><span>to use</span></div><i></i><div><strong>Professional</strong><span>by design</span></div><i></i><div><strong>Ready</strong><span>to download</span></div></div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="halo"></div><div class="float-ball ball-a"></div><div class="float-ball ball-b"></div>
          <article class="cv-preview"><div class="preview-top"><div class="avatar">A</div><div><b>Alex Morgan</b><small>Product Designer</small></div></div><div class="preview-line wide"></div><div class="preview-line"></div><div class="preview-line short"></div><div class="preview-title">Experience</div><div class="preview-line wide"></div><div class="preview-line"></div><div class="preview-title small-title">Education</div><div class="preview-line"></div></article>
          <div class="success-chip"><span>✓</span><div><b>Ready to apply</b><small>Your CV looks great</small></div></div>
        </div>
      </section>

      <section class="service-section">
        <div class="section-intro"><p class="kicker">MADE FOR YOUR JOB SEARCH</p><h2>A better way to create your CV</h2><p>Everything you need to turn your experience into a clear, compelling professional story.</p></div>
        <div class="feature-grid">
          @for (feature of features; track feature.title) {<article class="feature-card"><span class="feature-icon">{{ feature.icon }}</span><h3>{{ feature.title }}</h3><p>{{ feature.description }}</p></article>}
        </div>
      </section>

      <section class="templates-section">
        <div class="templates-heading"><div><p class="kicker">DESIGNED TO GET NOTICED</p><h2>Find a CV style that feels like you.</h2></div><a routerLink="/templates" class="text-action">View all templates <span>→</span></a></div>
        <div class="template-grid">
          @for (template of sampleTemplates; track template.name) {
            <article class="template-sample" [class.template-dark]="template.dark">
              <div class="sample-paper"><div class="sample-head"><div class="sample-avatar">{{ template.initial }}</div><div><b>{{ template.person }}</b><small>{{ template.role }}</small></div></div><div class="sample-rule"></div><p class="sample-label">PROFILE</p><div class="sample-bar full"></div><div class="sample-bar"></div><div class="sample-bar short"></div><p class="sample-label">EXPERIENCE</p><div class="sample-job"><b>{{ template.company }}</b><small>{{ template.period }}</small></div><div class="sample-bar full"></div><div class="sample-bar"></div></div>
              <div class="template-caption"><div><h3>{{ template.name }}</h3><p>{{ template.description }}</p></div><span>↗</span></div>
            </article>
          }
        </div>
        <div class="value-strip"><div><strong>Built for every career stage</strong><span>From first role to next big move</span></div><div><strong>Clear, recruiter-friendly layouts</strong><span>Put the right information first</span></div><div><strong>Your details stay in your control</strong><span>Edit and update your CV anytime</span></div></div>
      </section>

      <section class="process-section"><div class="process-copy"><p class="kicker">SIMPLE BY DESIGN</p><h2>From blank page to job-ready in minutes.</h2><p>No design experience needed. Our guided editor keeps your details organised while your CV updates live.</p><a routerLink="/make-cv" class="text-action">Start creating now <span>→</span></a></div><ol class="steps">@for (step of steps; track step.title) {<li><span>{{ step.number }}</span><div><h3>{{ step.title }}</h3><p>{{ step.description }}</p></div></li>}</ol></section>
    </main>
  `,
  styles: [`
    .about-page{min-height:100vh;overflow:hidden;padding-top:92px;background:linear-gradient(135deg,#f2f5ff 0%,#e5edff 48%,#f8faff 100%);color:#1a2e66;font-family:Inter,system-ui,sans-serif;position:relative}.ambient{position:absolute;border-radius:50%;pointer-events:none}.ambient-one{width:520px;height:520px;background:#c7d6ff;opacity:.4;right:-230px;top:100px}.ambient-two{width:380px;height:380px;background:#a9bfed;opacity:.25;left:-190px;top:560px}.hero,.service-section,.templates-section,.process-section{max-width:1120px;margin:auto;position:relative;z-index:1}.hero{min-height:590px;display:grid;grid-template-columns:1fr .88fr;gap:45px;align-items:center;padding:36px 32px 75px}.kicker{color:#486dcc;font-size:.7rem;letter-spacing:.15em;font-weight:800;margin:0 0 16px}.hero h1{font-size:clamp(2.6rem,5vw,4.35rem);line-height:1.06;letter-spacing:-.055em;margin:0;max-width:650px}.hero h1 span{color:#486dcc}.lead{max-width:530px;font-size:1.05rem;line-height:1.7;color:#65738d;margin:23px 0 30px}.hero-actions{display:flex;gap:13px;flex-wrap:wrap}.primary-action,.secondary-action{border-radius:10px;padding:13px 20px;text-decoration:none;font-size:.86rem;font-weight:800;transition:.2s}.primary-action{background:#4167ca;color:white;box-shadow:0 9px 18px #4167ca42}.primary-action:hover{background:#3158bb;transform:translateY(-2px)}.primary-action span,.text-action span{margin-left:6px;font-size:1.1rem}.secondary-action{border:1px solid #ccd8f3;color:#4167ca;background:#fff}.trust-row{display:flex;align-items:center;gap:18px;margin-top:44px;color:#8290a8}.trust-row div{display:grid;gap:2px}.trust-row strong{color:#3458b7;font-size:.84rem}.trust-row span{font-size:.72rem}.trust-row i{width:1px;height:28px;background:#c9d4ea}.hero-visual{height:430px;position:relative;display:grid;place-items:center}.halo{position:absolute;width:360px;height:360px;border-radius:44% 56% 52% 48%;background:linear-gradient(145deg,#a9c2ff,#6d8de2);transform:rotate(-20deg);opacity:.88}.cv-preview{width:245px;min-height:330px;background:#fff;border-radius:13px;padding:21px;box-shadow:0 25px 45px #24458a3d;position:relative;z-index:2;transform:rotate(5deg)}.preview-top{display:flex;align-items:center;gap:10px;padding-bottom:18px;border-bottom:1px solid #e9edf5}.avatar,.sample-avatar{width:37px;height:37px;display:grid;place-items:center;border-radius:50%;background:#4167ca;color:#fff;font-weight:700}.preview-top b{display:block;font-size:.77rem}.preview-top small,.success-chip small,.sample-head small,.sample-job small{display:block;font-size:.58rem;color:#8793ab;margin-top:3px}.preview-line,.sample-bar{height:6px;background:#e6ebf4;border-radius:8px;margin-top:10px;width:73%}.preview-line.wide,.sample-bar.full{width:100%;margin-top:18px}.preview-line.short,.sample-bar.short{width:45%}.preview-title,.sample-label{font-size:.62rem;color:#4167ca;font-weight:800;margin-top:25px}.small-title{margin-top:19px}.float-ball{position:absolute;border-radius:50%;z-index:3}.ball-a{height:73px;width:73px;right:13px;top:34px;background:radial-gradient(circle at 28% 25%,#e8f1ff,#79a0eb 58%,#385bad);box-shadow:10px 13px 20px #2746874d}.ball-b{height:46px;width:46px;left:37px;bottom:41px;background:radial-gradient(circle at 28% 25%,#85a7ff,#153174 76%)}.success-chip{z-index:4;position:absolute;display:flex;align-items:center;gap:9px;right:-6px;bottom:52px;padding:11px 14px;background:#fff;border-radius:11px;box-shadow:0 15px 30px #22427828}.success-chip>span{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#e6f5ee;color:#30a36b;font-weight:800}.success-chip b{font-size:.66rem}.service-section,.templates-section{padding:65px 32px 86px}.section-intro{text-align:center;max-width:570px;margin:0 auto 33px}.section-intro h2,.process-copy h2,.templates-heading h2{font-size:clamp(2rem,3.6vw,3rem);line-height:1.12;letter-spacing:-.04em;margin:0 0 14px}.section-intro>p:last-child,.process-copy>p{color:#6d7b94;line-height:1.65;font-size:.94rem;margin:0}.feature-grid,.template-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.feature-card{background:#fff;border:1px solid #e4eafd;border-radius:17px;padding:26px;box-shadow:0 12px 35px #4167ca0e}.feature-icon{height:40px;width:40px;display:grid;place-items:center;border-radius:10px;background:#ebf0ff;color:#4167ca;font-weight:800;font-size:1.2rem}.feature-card h3{font-size:1rem;margin:17px 0 8px}.feature-card p{font-size:.84rem;line-height:1.6;color:#758197;margin:0}.templates-section{padding-top:15px}.templates-heading{display:flex;align-items:end;justify-content:space-between;margin-bottom:28px}.templates-heading .text-action{margin:0 0 12px;white-space:nowrap}.template-sample{border-radius:17px;overflow:hidden;background:#fff;box-shadow:0 12px 35px #4167ca1c;transition:transform .2s}.template-sample:hover{transform:translateY(-5px)}.sample-paper{height:286px;box-sizing:border-box;padding:24px 25px;background:#fff}.sample-head{display:flex;align-items:center;gap:10px}.sample-head b{font-size:.8rem;display:block}.sample-rule{height:1px;background:#e4e8f0;margin:18px 0}.sample-label{margin-top:18px}.sample-job{margin-top:13px}.sample-job b{font-size:.68rem;display:block}.template-dark .sample-paper{background:#20355e;color:#fff}.template-dark .sample-rule,.template-dark .sample-bar{background:#526887}.template-dark .sample-head small,.template-dark .sample-job small{color:#b6c5df}.template-dark .sample-label{color:#a8c0ff}.template-caption{display:flex;justify-content:space-between;align-items:center;padding:16px 19px}.template-caption h3{font-size:.9rem;margin:0 0 4px}.template-caption p{font-size:.73rem;color:#7d899e;margin:0}.template-caption>span{color:#4167ca;font-size:1.25rem}.value-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;border-top:1px solid #d9e3fa;margin-top:34px;padding-top:27px}.value-strip div{display:grid;gap:6px}.value-strip strong{font-size:.82rem}.value-strip span{font-size:.72rem;color:#738098}.process-section{display:grid;grid-template-columns:.9fr 1.1fr;gap:85px;align-items:center;padding:66px 32px 90px;background:#e5edff;border-radius:30px 30px 0 0}.text-action{display:inline-block;margin-top:25px;color:#4167ca;font-size:.84rem;font-weight:800;text-decoration:none}.steps{list-style:none;margin:0;padding:0;display:grid;gap:21px}.steps li{display:flex;gap:17px;align-items:flex-start}.steps li>span{display:grid;place-items:center;flex:none;width:32px;height:32px;background:#4167ca;color:#fff;border-radius:50%;font-size:.75rem;font-weight:800}.steps h3{font-size:.95rem;margin:2px 0 5px}.steps p{margin:0;color:#718099;font-size:.83rem;line-height:1.55}@media(max-width:760px){.about-page{padding-top:75px}.hero{grid-template-columns:1fr;padding:42px 24px 62px}.hero-visual{height:320px;margin-top:5px}.cv-preview{transform:scale(.85) rotate(5deg)}.halo{transform:scale(.8) rotate(-20deg)}.success-chip{right:5px;bottom:24px}.feature-grid,.template-grid,.process-section,.value-strip{grid-template-columns:1fr}.service-section,.templates-section{padding:55px 24px}.templates-heading{align-items:start;gap:5px;flex-direction:column}.templates-heading .text-action{margin:0}.value-strip{gap:18px}.process-section{margin:0 16px;padding:50px 24px;gap:38px}.trust-row{gap:12px}.hero h1{font-size:2.75rem}}
  `]
})
export class AboutComponent {
  readonly features = [
    { icon: '✦', title: 'Professional templates', description: 'Choose a clean, carefully designed layout that puts your experience first.' },
    { icon: '↗', title: 'Live CV preview', description: 'See every change instantly, so your document always looks exactly right.' },
    { icon: '↓', title: 'Ready to share', description: 'Download a polished CV when you are ready to send your application.' },
  ];
  readonly sampleTemplates = [
    { name: 'Modern Professional', description: 'Clean and confident', initial: 'A', person: 'Alex Morgan', role: 'Product Designer', company: 'Design Studio', period: '2023 — Present', dark: false },
    { name: 'Elegant Frame', description: 'Warm and distinctive', initial: 'S', person: 'Sam Taylor', role: 'Marketing Manager', company: 'Northstar Co.', period: '2022 — Present', dark: false },
    { name: 'Classic Dark', description: 'Bold and focused', initial: 'J', person: 'Jamie Lee', role: 'Software Engineer', company: 'Cloud Labs', period: '2021 — Present', dark: true },
  ];
  readonly steps = [
    { number: '01', title: 'Choose a template', description: 'Find a style that fits your role and personality.' },
    { number: '02', title: 'Add your experience', description: 'Use our simple editor to add every important detail.' },
    { number: '03', title: 'Download and apply', description: 'Review your live preview and send your CV with confidence.' },
  ];
}
