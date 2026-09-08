import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface CvEducation { institution?: string; degree?: string; field?: string; startYear?: string; endYear?: string; current?: boolean; description?: string; }
interface CvExperience { company?: string; position?: string; startDate?: string; endDate?: string; current?: boolean; responsibilities?: string[]; }
interface CvSkill { name?: string; level?: string; }
interface CvLanguage { name?: string; proficiency?: string; }
interface CvCertification { name?: string; issuer?: string; date?: string; }
interface CvProject { name?: string; description?: string; link?: string; }
interface CvReference { name?: string; position?: string; company?: string; phone?: string; email?: string; }
interface CvHobby { name?: string; }

@Component({
  selector: 'app-warm-taupe-timeline-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv-paper" [style.--accent]="accent" [style.--fs.px]="fontSize" [style.--fw]="fontWeight" [style.--lh]="lineHeight" [style.--font]="fontFamily">
      <div class="photo" [class.has-photo]="photoUrl" [style.background-image]="photoUrl ? 'url(' + photoUrl + ')' : null"><span *ngIf="!photoUrl">{{ initials }}</span></div>
      <aside class="sidebar">
        <div class="sidebar-spacer"></div>
        <section *ngIf="summary" class="sidebar-section about" [style.order]="getSectionOrder('Personal Information')"><h2>{{ lbl('Personal Information', 'About me') }}</h2><p>{{ summary }}</p></section>
        <section *ngIf="education.length" class="sidebar-section" [style.order]="getSectionOrder('Education')"><h2>{{ lbl('Education', 'Education') }}</h2><div class="education" *ngFor="let item of education"><strong>{{ item.degree || item.field || 'Education' }}</strong><span>{{ item.institution }}</span><small>{{ educationDates(item) }}</small><p *ngIf="item.description">{{ item.description }}</p></div></section>
        <section *ngIf="skills.length" class="sidebar-section" [style.order]="getSectionOrder('Skills')"><h2>{{ lbl('Skills', 'Skills') }}</h2><div class="skill" *ngFor="let skill of skills"><div><span>{{ skill.name }}</span><em>{{ skill.level }}</em></div><i><b [style.width.%]="skillPercent(skill.level)"></b></i></div></section>
        <section *ngIf="languages.length" class="sidebar-section" [style.order]="getSectionOrder('Languages')"><h2>{{ lbl('Languages', 'Languages') }}</h2><div class="language" *ngFor="let language of languages"><span>{{ language.name }}</span><small>{{ language.proficiency || 'Working proficiency' }}</small></div></section>
        <section *ngIf="hobbyNames.length" class="sidebar-section hobbies" [style.order]="getSectionOrder('Hobbies')"><h2>{{ lbl('Hobbies', 'Interests') }}</h2><span *ngFor="let hobby of hobbyNames">{{ hobby }}</span></section>
      </aside>
      <main class="content">
        <header class="hero">
          <h1>{{ name || 'Your Name' }}</h1>
          <p class="role">{{ jobTitle || 'Professional title' }}</p>
        </header>
        <section class="contact" *ngIf="hasContact">
          <div class="contact-item" *ngIf="phone">
            <svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6.57-6.57A19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.58a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>{{ phone }}</span>
          </div>
          <div class="contact-item" *ngIf="linkedin">
            <svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            <span>{{ linkedin }}</span>
          </div>
          <div class="contact-item" *ngIf="email">
            <svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>{{ email }}</span>
          </div>
          <div class="contact-item" *ngIf="location">
            <svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>{{ location }}</span>
          </div>
        </section>
        <section *ngIf="experience.length" class="main-section" [style.order]="getSectionOrder('Work Experience')"><h2>{{ lbl('Work Experience', 'Experience') }}</h2><div class="timeline"><article *ngFor="let item of experience" class="timeline-item"><i class="timeline-node" aria-hidden="true"></i><div class="timeline-body"><div class="timeline-header"><h3>{{ item.position || 'Position' }}</h3><time>{{ experienceDates(item) }}</time></div><h4>{{ item.company }}</h4><p *ngFor="let responsibility of item.responsibilities">{{ responsibility }}</p></div></article></div></section>
        <section *ngIf="certifications.length" class="main-section compact" [style.order]="getSectionOrder('Certifications')"><h2>{{ lbl('Certifications', 'Certificates') }}</h2><div class="compact-grid"><article *ngFor="let cert of certifications"><strong>{{ cert.name }}</strong><span>{{ cert.issuer }}<ng-container *ngIf="cert.issuer && cert.date"> · </ng-container>{{ cert.date }}</span></article></div></section>
        <section *ngIf="projects.length" class="main-section compact" [style.order]="getSectionOrder('Projects')"><h2>{{ lbl('Projects', 'Selected projects') }}</h2><div class="compact-grid"><article *ngFor="let project of projects"><strong>{{ project.name }}</strong><span>{{ project.description || project.link }}</span></article></div></section>
        <section *ngIf="references.length" class="main-section references" [style.order]="getSectionOrder('References')"><h2>{{ lbl('References', 'References') }}</h2><div class="reference-grid"><article *ngFor="let reference of references"><strong>{{ reference.name }}</strong><span>{{ reference.position }}<ng-container *ngIf="reference.company"> · {{ reference.company }}</ng-container></span><small *ngIf="reference.phone || reference.email">{{ reference.phone }}<ng-container *ngIf="reference.phone && reference.email"> · </ng-container>{{ reference.email }}</small></article></div></section>
      </main>
    </article>
  `,
  styles: [`

    :host { display: block; }
    .cv-paper { --accent: #A87C64; --fs: 10px; --fw: 400; --lh: 1.42; --font: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; position: relative; display: grid; grid-template-columns: 32% 68%; width: 210mm; min-height: 297mm; overflow: hidden; background: #FAF8F5; color: #2C1E18; font-family: var(--font); font-size: var(--fs); font-weight: var(--fw); line-height: var(--lh); box-sizing: border-box; }
    .photo { position: absolute; z-index: 3; top: 8mm; left: 14mm; width: 39mm; height: 39mm; display: grid; place-items: center; border: 1.5mm solid #FAF8F5; border-radius: 50%; overflow: hidden; background: #6d4d3d center / cover no-repeat; color: #FAF8F5; font-family: Georgia, serif; font-size: 20px; font-weight: 700; letter-spacing: .06em; box-shadow: 0 4px 15px rgba(0,0,0,.28), 0 0 0 1px rgba(44,30,24,.25); }
    .sidebar { min-height: 297mm; padding: 0 6mm 11mm; box-sizing: border-box; background: #2C1E18; color: #F7EEE8; display: flex; flex-direction: column; }
    .sidebar-spacer { order: 0; }
    .sidebar-spacer { height: 55mm; }
    .content { min-width: 0; padding-bottom: 13mm; display: flex; flex-direction: column; }
    .hero { order: 0; }
    .contact { order: 1; }
    .hero { min-height: 42mm; box-sizing: border-box; margin-top: 10mm; padding: 9mm 13mm 9mm 8mm; background: var(--accent); color: #fffaf7; }
    .hero h1 { margin: 0 0 1.5mm; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: calc(var(--fs) * 2.6); font-weight: 700; line-height: 1.08; letter-spacing: .08em; text-transform: uppercase; }
    .role { margin: 0; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: calc(var(--fs) * 1.4); font-weight: 400; letter-spacing: .1em; line-height: 1.3; text-transform: none; }
    .contact { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3.5mm 7mm; margin-bottom: 6mm; padding: 8mm 8mm 0; color: #4e413a; font-size: calc(var(--fs) * 1); font-weight: 400; border: 0; box-shadow: none; }
    .contact-item { display: flex; align-items: center; min-width: 0; gap: 2.5mm; }
    .contact-item i { display: grid; width: 5.4mm; height: 5.4mm; flex: 0 0 auto; place-items: center; border-radius: 50%; background: #2C1E18; color: #fff; font-size: calc(var(--fs) * .72); font-style: normal; line-height: 1; }
    .contact-item svg.contact-svg { width: 5.4mm; height: 5.4mm; padding: 1.1mm; box-sizing: border-box; flex: 0 0 auto; border-radius: 50%; background: #2C1E18; color: #fff; stroke: #fff; }
    .contact-item span { min-width: 0; overflow-wrap: anywhere; }
    .sidebar-section { margin: 0 0 7mm; break-inside: avoid; page-break-inside: avoid; }
    .sidebar-section h2, .main-section h2 { margin: 0 0 4mm; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; }
    .sidebar-section h2 { padding-bottom: 2.5mm; color: #fff; font-size: calc(var(--fs) * 1.45); border-bottom: 1px solid rgba(255,255,255,.42); }
    .about p, .education p { margin: 0; font-size: calc(var(--fs) * 1); line-height: calc(var(--lh) * 1.02); color: #e2d3ca; }
    .education { margin-bottom: 4mm; }
    .education strong, .education span, .education small { display: block; }
    .education strong { color: #fff; font-size: calc(var(--fs) * 1.08); }
    .education span { color: #e6d7ce; font-size: calc(var(--fs) * .88); }
    .education small { color: #c9aa98; font-size: calc(var(--fs) * .82); margin: 1px 0; }
    .skill { margin: 0 0 3.4mm; }
    .skill div { display: flex; justify-content: space-between; gap: 5px; font-size: calc(var(--fs) * .88); }
    .skill em { color: #d6b6a4; font-size: calc(var(--fs) * .74); font-style: normal; white-space: nowrap; }
    .skill i { display: block; height: 3px; margin-top: 3px; background: rgba(255,255,255,.2); border-radius: 3px; overflow: hidden; }
    .skill b { display: block; height: 100%; background: var(--accent); border-radius: inherit; }
    .language { display: flex; justify-content: space-between; gap: 4px; padding: 1.5mm 0; border-bottom: 1px solid rgba(255,255,255,.1); font-size: calc(var(--fs) * .9); }
    .language small { color: #c9aa98; text-align: right; }
    .hobbies { display: flex; flex-wrap: wrap; gap: 5px; }
    .hobbies h2 { width: 100%; }
    .hobbies > span { padding: 2px 6px; border: 1px solid rgba(255,255,255,.34); border-radius: 99px; color: #eadbd2; font-size: calc(var(--fs) * .78); }

    .main-section { padding: 7mm 8mm 0; break-inside: avoid; page-break-inside: avoid; }
    .main-section h2 { display: flex; align-items: center; gap: 4mm; margin-bottom: 4mm; padding: 0; color: #2C1E18; font-size: calc(var(--fs) * 1.6); border: 0; }
    .main-section h2::after { height: 1px; flex: 1; content: ''; background: #dfd1c7; }
    .timeline { position: relative; margin-top: 4mm; padding-left: 6.5mm; border-left: 1px solid #dfd1c7; }
    .timeline::before { display: none; }
    .timeline-item { position: relative; padding-bottom: 5.5mm; break-inside: avoid; page-break-inside: avoid; }
    .timeline-item:last-child { padding-bottom: 0; }
    .timeline-node { position: absolute; top: 1.2mm; left: calc(-6.5mm - 1.15mm); width: 2.3mm; height: 2.3mm; border: .55mm solid var(--accent); border-radius: 50%; background: #FAF8F5; }
    .timeline-body { min-width: 0; }
    .timeline-header { display: flex; align-items: baseline; justify-content: space-between; gap: 6mm; }
    .timeline-body h3 { margin: 0; color: #222; font-size: calc(var(--fs) * 1.3); font-weight: 700; line-height: 1.25; }
    .timeline-body time { flex: 0 0 auto; color: #666; font-size: calc(var(--fs) * 1.04); font-style: italic; white-space: nowrap; }
    .timeline-body h4 { margin: 1px 0 4px; color: #666; font-size: calc(var(--fs) * 1.08); font-weight: 400; letter-spacing: 0; text-transform: none; }
    .timeline-body p { margin: 0; color: #222; font-size: calc(var(--fs) * 1.08); line-height: 1.5; }
    .compact-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4mm 6mm; }
    .compact-grid article, .reference-grid article { border-left: 2px solid var(--accent); padding-left: 3mm; font-size: calc(var(--fs) * .89); }
    .compact-grid strong, .compact-grid span, .reference-grid strong, .reference-grid span, .reference-grid small { display: block; }
    .compact-grid strong, .reference-grid strong { color: #34231c; font-size: calc(var(--fs) * .94); }
    .compact-grid span, .reference-grid span { color: #745a4b; }
    .reference-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5mm; }
    .reference-grid small { color: #8a7061; font-size: calc(var(--fs) * .78); overflow-wrap: anywhere; }
    @media screen and (max-width: 700px) { :host { overflow-x: auto; display: block; } .cv-paper { transform-origin: top left; } }
    @media print {
      :host { display: block; }
      .cv-paper { display: grid !important; grid-template-columns: 32% 68% !important; width: 210mm !important; max-width: 210mm !important; min-width: 210mm !important; min-height: 297mm !important; box-sizing: border-box !important; margin: 0 auto !important; box-shadow: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .sidebar, .content { min-width: 0 !important; }
      .sidebar { min-height: 297mm !important; }
      .sidebar-section, .main-section, .timeline-item { break-inside: avoid; page-break-inside: avoid; }
      @page { size: A4 portrait; margin: 0; }
    }
  `],
})
export class WarmTaupeTimelineCvComponent {
  @Input() accent = '#A87C64';
  @Input() name = ''; @Input() jobTitle = ''; @Input() email = ''; @Input() phone = ''; @Input() location = ''; @Input() linkedin = ''; @Input() summary = ''; @Input() photoUrl: string | null = null;
  @Input() education: CvEducation[] = []; @Input() experience: CvExperience[] = []; @Input() skills: CvSkill[] = []; @Input() languages: CvLanguage[] = []; @Input() certifications: CvCertification[] = []; @Input() projects: CvProject[] = []; @Input() references: CvReference[] = []; @Input() hobbies: CvHobby[] = [];
  @Input() fontSize = 10; @Input() fontWeight = 400; @Input() lineHeight = 1.42; @Input() fontFamily = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
  @Input() sectionLabels: Record<string, string> = {};
  @Input() sectionOrder: string[] = [];

  getSectionOrder(key: string): number {
    if (!this.sectionOrder || !this.sectionOrder.length) return 0;
    const k = key.toLowerCase().replace(/[^a-z]/g, '');
    for (let i = 0; i < this.sectionOrder.length; i++) {
      const sk = this.sectionOrder[i].toLowerCase().replace(/[^a-z]/g, '');
      if (sk === k || (k.includes('project') && sk.includes('project')) || (k.includes('ref') && sk.includes('ref')) || (k.includes('cert') && sk.includes('cert')) || (k.includes('work') && sk.includes('work')) || (k.includes('exp') && sk.includes('exp')) || (k.includes('edu') && sk.includes('edu')) || (k.includes('skill') && sk.includes('skill')) || (k.includes('lang') && sk.includes('lang')) || (k.includes('hobb') && sk.includes('hobb')) || ((k.includes('about') || k.includes('profile')) && (sk.includes('personal') || sk.includes('about') || sk.includes('profile')))) {
        return i + 1;
      }
    }
    return 0;
  }


  lbl(key: string, fallback?: string): string {
    if (!this.sectionLabels) return fallback ?? key;
    if (this.sectionLabels[key]) return this.sectionLabels[key];
    const k = key.toLowerCase().replace(/[^a-z]/g, '');
    for (const [sKey, val] of Object.entries(this.sectionLabels)) {
      const sk = sKey.toLowerCase().replace(/[^a-z]/g, '');
      if (sk === k) return val;
      if ((k.includes('about') || k.includes('profile') || k.includes('summary') || k.includes('objective')) &&
          (sk.includes('personal') || sk.includes('about') || sk.includes('profile') || sk.includes('summary'))) {
        return val;
      }
      if ((k.includes('work') || k.includes('experience')) &&
          (sk.includes('work') || sk.includes('experience'))) {
        return val;
      }
      if ((k.includes('project')) && (sk.includes('project'))) {
        return val;
      }
      if ((k.includes('skill')) && (sk.includes('skill'))) {
        return val;
      }
      if ((k.includes('certif')) && (sk.includes('certif'))) {
        return val;
      }
      if ((k.includes('lang')) && (sk.includes('lang'))) {
        return val;
      }
      if ((k.includes('ref')) && (sk.includes('ref'))) {
        return val;
      }
      if ((k.includes('hobb') || k.includes('interest') || k.includes('strength')) &&
          (sk.includes('hobb') || sk.includes('interest') || sk.includes('strength'))) {
        return val;
      }
    }
    return fallback ?? key;
  }

  get initials() { return this.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'CV'; }
  get hasContact() { return !!(this.email || this.phone || this.location || this.linkedin); }
  get hobbyNames() { return this.hobbies.map(hobby => typeof hobby === 'string' ? hobby : hobby?.name).filter(Boolean) as string[]; }
  educationDates(item: CvEducation) { return [item.startYear, item.current ? 'Present' : item.endYear].filter(Boolean).join(' – '); }
  experienceDates(item: CvExperience) { return [item.startDate, item.current ? 'Present' : item.endDate].filter(Boolean).join(' – '); }
  skillPercent(level?: string) { const value = (level || '').toLowerCase(); return value.includes('expert') ? 96 : value.includes('advanced') ? 84 : value.includes('intermediate') ? 66 : value.includes('basic') ? 45 : 72; }
}
