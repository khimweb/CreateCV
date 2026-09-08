import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface CvEducation { institution?: string; degree?: string; field?: string; startYear?: string; endYear?: string; current?: boolean; gpa?: string; description?: string; }
interface CvExperience { company?: string; position?: string; startDate?: string; endDate?: string; current?: boolean; responsibilities?: string[]; }
interface CvSkill { name?: string; level?: string; }
interface CvLanguage { name?: string; proficiency?: string; }
interface CvCertification { name?: string; issuer?: string; date?: string; }
interface CvProject { name?: string; description?: string; link?: string; }
interface CvReference { name?: string; position?: string; company?: string; phone?: string; email?: string; }
interface CvHobby { name?: string; }

@Component({
  selector: 'app-graphite-banner-timeline-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv-paper" [style.--accent]="accent" [style.--fs.px]="fontSize" [style.--fw]="fontWeight" [style.--lh]="lineHeight" [style.--font]="fontFamily">
      <header class="banner">
        <div class="banner-text"><h1>{{ name || 'Your Name' }}</h1><p class="subtitle">{{ jobTitle || 'Professional Title' }}</p></div>
      </header>

      <div class="body">
        <aside class="sidebar">
          <div class="photo-frame"><div class="photo" [style.background-image]="photoUrl ? 'url(' + photoUrl + ')' : null"><span *ngIf="!photoUrl">{{ initials }}</span></div></div>

          <section class="side-block" *ngIf="hasContact">
            <h2>{{ lbl('Personal Information', 'Contact') }}</h2>
            <ul class="contact-list">
              <li *ngIf="phone">
                <svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6.57-6.57A19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.58a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>{{ phone }}</span>
              </li>
              <li *ngIf="email">
                <svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>{{ email }}</span>
              </li>
              <li *ngIf="location">
                <svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ location }}</span>
              </li>
              <li *ngIf="linkedin">
                <svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                <span>{{ linkedin }}</span>
              </li>
            </ul>
          </section>

          <section class="side-block" *ngIf="skills.length"><h2>{{ lbl('Skills', 'Skills') }}</h2><ul class="bullets"><li *ngFor="let skill of skills">{{ skill.name }}</li></ul></section>
          <section class="side-block" *ngIf="languages.length"><h2>{{ lbl('Languages', 'Languages') }}</h2><ul class="bullets"><li *ngFor="let language of languages">{{ language.name }}<ng-container *ngIf="language.proficiency"> ({{ language.proficiency }})</ng-container></li></ul></section>
          <section class="side-block" *ngIf="hobbyNames.length"><h2>{{ lbl('Hobbies', 'Interests') }}</h2><ul class="bullets"><li *ngFor="let hobby of hobbyNames">{{ hobby }}</li></ul></section>
          <section class="side-block" *ngIf="references.length">
            <h2>{{ lbl('References', 'Reference') }}</h2>
            <div class="ref" *ngFor="let reference of references">
              <h3>{{ reference.name }}</h3>
              <div class="ref-role">{{ reference.company }}<ng-container *ngIf="reference.company && reference.position"> / </ng-container>{{ reference.position }}</div>
              <p *ngIf="reference.phone"><b>Phone:</b> {{ reference.phone }}</p>
              <p *ngIf="reference.email"><b>Email:</b> {{ reference.email }}</p>
            </div>
          </section>
        </aside>

        <main class="content">
          <section class="main-section" *ngIf="summary">
            <div class="sec-head"><span class="sec-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2"/></svg></span><h2>{{ lbl('Personal Information', 'Profile') }}</h2></div>
            <div class="timeline"><div class="tl-item"><i class="tl-node" aria-hidden="true"></i><p class="para">{{ summary }}</p></div></div>
          </section>

          <section class="main-section" *ngIf="experience.length">
            <div class="sec-head"><span class="sec-icon"><svg viewBox="0 0 24 24"><rect x="3" y="7.5" width="18" height="12" rx="1.6"/><path d="M9 7.5V5.6c0-.7.5-1.1 1.2-1.1h3.6c.7 0 1.2.4 1.2 1.1v1.9"/><path d="M3 12.5h18"/></svg></span><h2>{{ lbl('Work Experience', 'Work Experience') }}</h2></div>
            <div class="timeline">
              <div class="tl-item" *ngFor="let item of experience">
                <i class="tl-node" aria-hidden="true"></i>
                <div class="item-head"><span class="primary">{{ item.company || item.position }}</span><span class="date">{{ experienceDates(item) }}</span></div>
                <div class="secondary" *ngIf="item.position">{{ item.position }}</div>
                <ul class="item-bullets"><li *ngFor="let responsibility of item.responsibilities">{{ responsibility }}</li></ul>
              </div>
            </div>
          </section>

          <section class="main-section" *ngIf="education.length">
            <div class="sec-head"><span class="sec-icon"><svg viewBox="0 0 24 24"><path d="M12 4.5 2.8 9 12 13.5 21.2 9 12 4.5Z"/><path d="M6.2 11v4.6c0 1.6 2.6 2.9 5.8 2.9s5.8-1.3 5.8-2.9V11"/></svg></span><h2>{{ lbl('Education', 'Education') }}</h2></div>
            <div class="timeline">
              <div class="tl-item" *ngFor="let item of education">
                <i class="tl-node" aria-hidden="true"></i>
                <div class="item-head"><span class="primary">{{ item.degree || item.field || 'Education' }}</span><span class="date">{{ educationDates(item) }}</span></div>
                <div class="secondary">{{ educationSubtitle(item) }}</div>
                <p class="para" *ngIf="item.gpa"><b>GPA: {{ item.gpa }}</b></p>
                <p class="para" *ngIf="item.description">{{ item.description }}</p>
              </div>
            </div>
          </section>

          <section class="main-section" *ngIf="certifications.length">
            <div class="sec-head"><span class="sec-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="9.5" r="5"/><path d="M8.8 14 7.5 20l4.5-2.4L16.5 20l-1.3-6"/></svg></span><h2>{{ lbl('Certifications', 'Certifications') }}</h2></div>
            <div class="timeline">
              <div class="tl-item" *ngFor="let cert of certifications">
                <i class="tl-node" aria-hidden="true"></i>
                <div class="item-head"><span class="primary">{{ cert.name }}</span><span class="date">{{ cert.date }}</span></div>
                <div class="secondary" *ngIf="cert.issuer">{{ cert.issuer }}</div>
              </div>
            </div>
          </section>

          <section class="main-section" *ngIf="projects.length">
            <div class="sec-head"><span class="sec-icon"><svg viewBox="0 0 24 24"><path d="M4 6.5h6l1.6 2H20v9.5H4Z"/></svg></span><h2>{{ lbl('Projects', 'Projects') }}</h2></div>
            <div class="timeline">
              <div class="tl-item" *ngFor="let project of projects">
                <i class="tl-node" aria-hidden="true"></i>
                <div class="item-head"><span class="primary">{{ project.name }}</span></div>
                <p class="para">{{ project.description || project.link }}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </article>
  `,
  styles: [`

    :host { display: block; }
    .cv-paper { --accent: #323E4D; --fs: 10px; --fw: 400; --lh: 1.55; --font: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; box-sizing: border-box; width: 210mm; min-height: 297mm; overflow: hidden; background: #fff; color: #4A5568; font-family: var(--font); font-size: var(--fs); font-weight: var(--fw); line-height: var(--lh); }

    .banner { box-sizing: border-box; display: flex; align-items: center; height: 31.5mm; padding: 0 8mm 0 81mm; background: var(--accent); color: #fff; }
    .banner-text { min-width: 0; }
    h1 { margin: 0; font-size: calc(var(--fs) * 2.85); font-weight: 700; line-height: 1.1; letter-spacing: .07em; text-transform: uppercase; }
    .subtitle { margin: 1.4mm 0 0; color: #CBD5E0; font-size: calc(var(--fs) * 1.4); font-weight: 400; letter-spacing: .22em; text-transform: uppercase; }

    .body { display: grid; grid-template-columns: 73.5mm minmax(0, 1fr); align-items: start; }
    .sidebar { box-sizing: border-box; min-height: 265.5mm; padding: 0 6.6mm 8mm; background: #E3E5E8; color: #2C3E50; }
    .photo-frame { width: 42mm; height: 42mm; margin: -21mm auto 6.5mm; border: 1.3mm solid #fff; border-radius: 50%; overflow: hidden; background: #ccc; box-shadow: 0 4px 10px rgba(0,0,0,.1); }
    .photo { display: grid; width: 100%; height: 100%; place-items: center; background: #c9ccd2 center / cover no-repeat; color: #5b6675; font-size: calc(var(--fs) * 1.9); font-weight: 700; letter-spacing: .05em; }
    .side-block { margin-bottom: 6.6mm; break-inside: avoid; page-break-inside: avoid; }
    .side-block:last-child { margin-bottom: 0; }
    .sidebar h2 { margin: 0 0 3.2mm; padding-bottom: 1.1mm; color: #2C3E50; font-size: calc(var(--fs) * 1.4); font-weight: 700; letter-spacing: .15em; text-transform: uppercase; border-bottom: .4mm solid #A0AEC0; }
    .contact-list { margin: 0; padding: 0; list-style: none; }
    .contact-list li { display: flex; align-items: center; gap: 2.6mm; margin-bottom: 2.6mm; color: #2C3E50; font-size: calc(var(--fs) * 1.02); font-weight: 500; }
    .contact-list i { flex: 0 0 auto; width: 4.2mm; font-style: normal; text-align: center; }
    .contact-list .contact-svg { width: 3.5mm; height: 3.5mm; flex: 0 0 auto; stroke: #2C3E50; }
    .contact-list span { min-width: 0; overflow-wrap: anywhere; }
    .bullets { margin: 0; padding-left: 4mm; color: #2C3E50; font-size: calc(var(--fs) * 1.02); }
    .bullets li { margin-bottom: 1.6mm; line-height: 1.4; }
    .ref { margin-bottom: 3.5mm; }
    .ref:last-child { margin-bottom: 0; }
    .ref h3 { margin: 0; color: #2C3E50; font-size: calc(var(--fs) * 1.14); font-weight: 700; }
    .ref-role { margin-bottom: 1.6mm; color: #718096; font-size: calc(var(--fs) * 1.02); }
    .ref p { margin: 0; color: #2C3E50; font-size: calc(var(--fs) * 1.02); line-height: 1.45; overflow-wrap: anywhere; }

    .content { box-sizing: border-box; min-width: 0; padding: 8mm 8mm 8mm 6.6mm; }
    .main-section { margin-bottom: 6.6mm; break-inside: avoid; page-break-inside: avoid; }
    .main-section:last-child { margin-bottom: 0; }
    .sec-head { display: flex; align-items: center; gap: 3.2mm; margin-bottom: 4mm; }
    .sec-icon { display: grid; flex: 0 0 auto; place-items: center; width: 6.9mm; height: 6.9mm; border-radius: 50%; background: var(--accent); }
    .sec-icon svg { width: 3.9mm; height: 3.9mm; fill: none; stroke: #fff; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
    .sec-head h2 { flex: 1; margin: 0; padding-bottom: 1.1mm; color: #2C3E50; font-size: calc(var(--fs) * 1.5); font-weight: 700; letter-spacing: .15em; text-transform: uppercase; border-bottom: .4mm solid #CBD5E0; }
    .timeline { position: relative; padding-left: 3.4mm; }
    .timeline::before { position: absolute; top: 0; bottom: 0; left: 3.4mm; width: 1px; content: ''; background: #CBD5E0; }
    .tl-item { position: relative; margin-bottom: 5.3mm; padding-left: 5.3mm; break-inside: avoid; page-break-inside: avoid; }
    .tl-item:last-child { margin-bottom: 0; }
    .tl-node { position: absolute; top: 1.3mm; left: -.95mm; width: 1.85mm; height: 1.85mm; border: .3mm solid var(--accent); border-radius: 50%; background: #fff; }
    .para { margin: 0; color: #4A5568; font-size: calc(var(--fs) * 1.02); line-height: calc(var(--lh) * 1.03); }
    .item-head { display: flex; align-items: baseline; justify-content: space-between; gap: 5mm; margin-bottom: .5mm; }
    .primary { color: #2C3E50; font-size: calc(var(--fs) * 1.2); font-weight: 700; }
    .date { flex: 0 0 auto; color: #718096; font-size: calc(var(--fs) * .98); font-weight: 600; white-space: nowrap; }
    .secondary { margin-bottom: 1.6mm; color: #718096; font-size: calc(var(--fs) * 1.06); }
    .item-bullets { margin: 0; padding-left: 4mm; font-size: calc(var(--fs) * 1.02); line-height: calc(var(--lh) * 1.02); }
    .item-bullets li { margin-bottom: 1.1mm; }

    @media screen and (max-width: 700px) { :host { display: block; overflow-x: auto; } .cv-paper { transform-origin: top left; } }
    @media print {
      :host { display: block; }
      .cv-paper { width: 210mm !important; max-width: 210mm !important; min-width: 210mm !important; min-height: 297mm !important; box-sizing: border-box !important; margin: 0 auto !important; box-shadow: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .body { display: grid !important; grid-template-columns: 73.5mm minmax(0, 1fr) !important; }
      .sidebar, main { min-width: 0 !important; }
      .sidebar { min-height: 265.5mm !important; }
      .side-block, .main-section, .tl-item { break-inside: avoid; page-break-inside: avoid; }
      @page { size: A4 portrait; margin: 0; }
    }
  `],
})
export class GraphiteBannerTimelineCvComponent {
  @Input() accent = '#323E4D';
  @Input() name = ''; @Input() jobTitle = ''; @Input() email = ''; @Input() phone = ''; @Input() location = ''; @Input() linkedin = ''; @Input() summary = ''; @Input() photoUrl: string | null = null;
  @Input() education: CvEducation[] = []; @Input() experience: CvExperience[] = []; @Input() skills: CvSkill[] = []; @Input() languages: CvLanguage[] = []; @Input() certifications: CvCertification[] = []; @Input() projects: CvProject[] = []; @Input() references: CvReference[] = []; @Input() hobbies: CvHobby[] = [];
  @Input() fontSize = 10; @Input() fontWeight = 400; @Input() lineHeight = 1.55; @Input() fontFamily = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
  @Input() sectionLabels: Record<string, string> = {};
  @Input() sectionOrder: string[] = [];

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

  get initials() { return (this.name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'CV'; }
  get hasContact() { return !!(this.email || this.phone || this.location || this.linkedin); }
  get hobbyNames() { return this.hobbies.map(hobby => typeof hobby === 'string' ? hobby : hobby?.name).filter(Boolean) as string[]; }
  educationDates(item: CvEducation) { return [item.startYear, item.current ? 'Present' : item.endYear].filter(Boolean).join(' - '); }
  educationSubtitle(item: CvEducation) {
    const field = item.field && item.field !== item.degree ? item.field : '';
    return [field, item.institution].filter(Boolean).join(' | ');
  }
  experienceDates(item: CvExperience) { return [item.startDate, item.current ? 'Present' : item.endDate].filter(Boolean).join(' - '); }
}
