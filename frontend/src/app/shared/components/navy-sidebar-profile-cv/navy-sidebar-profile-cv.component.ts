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
  selector: 'app-navy-sidebar-profile-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv-paper" [style.--accent]="accent" [style.--fs.px]="fontSize" [style.--fw]="fontWeight" [style.--lh]="lineHeight" [style.--font]="fontFamily">
      <aside class="sidebar">
        <div class="photo-frame"><div class="photo" [style.background-image]="photoUrl ? 'url(' + photoUrl + ')' : null"><span *ngIf="!photoUrl">{{ initials }}</span></div></div>

        <section class="side-block" *ngIf="hasContact">
          <h2>Contact</h2>
          <ul class="contact-list">
            <li *ngIf="phone"><i>☎</i><span>{{ phone }}</span></li>
            <li *ngIf="email"><i>✉</i><span>{{ email }}</span></li>
            <li *ngIf="location"><i>⌖</i><span>{{ location }}</span></li>
            <li *ngIf="linkedin"><i>⌁</i><span>{{ linkedin }}</span></li>
          </ul>
        </section>

        <section class="side-block" *ngIf="education.length">
          <h2>Education</h2>
          <div class="edu" *ngFor="let item of education">
            <div class="edu-year">{{ educationDates(item) }}</div>
            <div class="edu-school">{{ item.institution }}</div>
            <ul class="bullets"><li *ngFor="let line of educationLines(item)">{{ line }}</li></ul>
          </div>
        </section>

        <section class="side-block" *ngIf="skills.length"><h2>Skills</h2><ul class="bullets"><li *ngFor="let skill of skills">{{ skill.name }}</li></ul></section>
        <section class="side-block" *ngIf="languages.length"><h2>Languages</h2><ul class="bullets"><li *ngFor="let language of languages">{{ language.name }}<ng-container *ngIf="language.proficiency"> ({{ language.proficiency }})</ng-container></li></ul></section>
        <section class="side-block" *ngIf="hobbyNames.length"><h2>Interests</h2><ul class="bullets"><li *ngFor="let hobby of hobbyNames">{{ hobby }}</li></ul></section>
      </aside>

      <main class="content">
        <header class="main-head"><h1><b>{{ firstName }}</b><ng-container *ngIf="lastName"> <span>{{ lastName }}</span></ng-container></h1><p class="job-title">{{ jobTitle || 'Professional title' }}</p></header>

        <section class="block" *ngIf="summary"><h2>Profile</h2><p class="profile-text">{{ summary }}</p></section>

        <section class="block" *ngIf="experience.length">
          <h2>Work Experience</h2>
          <div class="timeline">
            <div class="tl-item" *ngFor="let item of experience">
              <i class="tl-node" aria-hidden="true"></i>
              <div class="exp-head"><span class="company">{{ item.company || item.position }}</span><span class="exp-date">{{ experienceDates(item) }}</span></div>
              <div class="role" *ngIf="item.position">{{ item.position }}</div>
              <ul class="exp-bullets"><li *ngFor="let responsibility of item.responsibilities">{{ responsibility }}</li></ul>
            </div>
          </div>
        </section>

        <section class="block" *ngIf="certifications.length"><h2>Certifications</h2><ul class="exp-bullets plain-list"><li *ngFor="let cert of certifications"><b>{{ cert.name }}</b><ng-container *ngIf="cert.issuer"> — {{ cert.issuer }}</ng-container><ng-container *ngIf="cert.date"> · {{ cert.date }}</ng-container></li></ul></section>
        <section class="block" *ngIf="projects.length"><h2>Projects</h2><ul class="exp-bullets plain-list"><li *ngFor="let project of projects"><b>{{ project.name }}</b><ng-container *ngIf="project.description"> — {{ project.description }}</ng-container></li></ul></section>

        <section class="block" *ngIf="references.length">
          <h2>Reference</h2>
          <div class="ref-grid">
            <div class="ref" *ngFor="let reference of references">
              <h3>{{ reference.name }}</h3>
              <div class="ref-title">{{ reference.company }}<ng-container *ngIf="reference.company && reference.position"> / </ng-container>{{ reference.position }}</div>
              <p *ngIf="reference.phone">Phone: {{ reference.phone }}</p>
              <p *ngIf="reference.email">Email: {{ reference.email }}</p>
            </div>
          </div>
        </section>
      </main>
    </article>
  `,
  styles: [`

    :host { display: block; }
    .cv-paper { --accent: #1E3A52; --fs: 10px; --fw: 400; --lh: 1.55; --font: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; box-sizing: border-box; display: grid; grid-template-columns: 34% 66%; width: 210mm; min-height: 297mm; overflow: hidden; background: #fff; color: #4A5568; font-family: var(--font); font-size: var(--fs); font-weight: var(--fw); line-height: var(--lh); }

    .sidebar { box-sizing: border-box; min-height: 297mm; padding: 10.5mm 6.5mm; background: var(--accent); color: #fff; }
    .photo-frame { width: 39mm; height: 39mm; margin: 0 auto 9mm; border: 1mm solid #fff; border-radius: 50%; overflow: hidden; }
    .photo { display: grid; width: 100%; height: 100%; place-items: center; background: rgba(255,255,255,.08) center / cover no-repeat; color: #fff; font-size: calc(var(--fs) * 1.8); font-weight: 700; letter-spacing: .05em; }
    .side-block { margin-bottom: 8mm; break-inside: avoid; page-break-inside: avoid; }
    .side-block:last-child { margin-bottom: 0; }
    .sidebar h2 { margin: 0 0 4mm; padding-bottom: 1.6mm; font-size: calc(var(--fs) * 1.4); font-weight: 700; letter-spacing: .2em; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,.3); }
    .contact-list { margin: 0; padding: 0; list-style: none; }
    .contact-list li { display: flex; align-items: center; gap: 2.6mm; margin-bottom: 3.2mm; color: #E2E8F0; font-size: calc(var(--fs) * 1.02); }
    .contact-list i { flex: 0 0 auto; width: 4.2mm; font-style: normal; text-align: center; }
    .contact-list span { min-width: 0; overflow-wrap: anywhere; }
    .edu { margin-bottom: 4mm; }
    .edu-year { color: #CBD5E0; font-size: calc(var(--fs) * 1); font-weight: 600; }
    .edu-school { margin-bottom: 1mm; font-size: calc(var(--fs) * 1.08); font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
    .bullets { margin: 0; padding-left: 4mm; color: #E2E8F0; font-size: calc(var(--fs) * 1.02); }
    .bullets li { margin-bottom: 1.6mm; line-height: 1.45; }

    .content { box-sizing: border-box; min-width: 0; padding: 10.5mm 9mm; }
    .main-head { margin-bottom: 7mm; }
    h1 { margin: 0; color: #2C3E50; font-size: calc(var(--fs) * 3); font-weight: 400; line-height: 1.12; letter-spacing: .07em; text-transform: uppercase; }
    h1 b { font-weight: 700; }
    h1 span { font-weight: 400; }
    .job-title { margin: 1.8mm 0 0; color: #718096; font-size: calc(var(--fs) * 1.4); letter-spacing: .19em; text-transform: uppercase; }
    .block { margin-bottom: 6.5mm; break-inside: avoid; page-break-inside: avoid; }
    .block:last-child { margin-bottom: 0; }
    .content h2 { margin: 0 0 4mm; padding-bottom: 1.6mm; color: #2C3E50; font-size: calc(var(--fs) * 1.5); font-weight: 700; letter-spacing: .15em; text-transform: uppercase; border-bottom: 1px solid #CBD5E0; }
    .profile-text { margin: 0; color: #4A5568; font-size: calc(var(--fs) * 1.02); line-height: calc(var(--lh) * 1.03); }

    .timeline { position: relative; padding-left: 4mm; border-left: 1px solid #CBD5E0; }
    .tl-item { position: relative; margin-bottom: 5.5mm; break-inside: avoid; page-break-inside: avoid; }
    .tl-item:last-child { margin-bottom: 0; }
    .tl-node { position: absolute; top: 1.3mm; left: calc(-4mm - .95mm); width: 1.9mm; height: 1.9mm; border-radius: 50%; background: var(--accent); }
    .exp-head { display: flex; align-items: baseline; justify-content: space-between; gap: 5mm; margin-bottom: .5mm; }
    .company { color: #2C3E50; font-size: calc(var(--fs) * 1.28); font-weight: 700; }
    .exp-date { flex: 0 0 auto; color: #718096; font-size: calc(var(--fs) * 1); font-weight: 600; white-space: nowrap; }
    .role { margin-bottom: 2mm; color: #718096; font-size: calc(var(--fs) * 1.14); }
    .exp-bullets { margin: 0; padding-left: 4mm; font-size: calc(var(--fs) * 1.02); line-height: calc(var(--lh) * 1.02); }
    .exp-bullets li { margin-bottom: 1.2mm; }
    .plain-list b { color: #2C3E50; }
    .ref-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5mm; font-size: calc(var(--fs) * 1.02); }
    .ref h3 { margin: 0 0 .5mm; color: #2C3E50; font-size: calc(var(--fs) * 1.16); font-weight: 700; }
    .ref-title { margin-bottom: 1mm; color: #718096; }
    .ref p { margin: 0; color: #4A5568; line-height: 1.45; overflow-wrap: anywhere; }

    @media screen and (max-width: 700px) { :host { display: block; overflow-x: auto; } .cv-paper { transform-origin: top left; } }
    @media print {
      :host { display: block; height: auto !important; overflow: visible !important; }
      .cv-paper { width: 100% !important; min-height: 0 !important; overflow: visible !important; box-shadow: none !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
      .sidebar { min-height: 0 !important; }
      .side-block, .block, .tl-item { break-inside: avoid; page-break-inside: avoid; }
      @page { size: A4 portrait; margin: 0; }
    }
  `],
})
export class NavySidebarProfileCvComponent {
  @Input() accent = '#1E3A52';
  @Input() name = ''; @Input() jobTitle = ''; @Input() email = ''; @Input() phone = ''; @Input() location = ''; @Input() linkedin = ''; @Input() summary = ''; @Input() photoUrl: string | null = null;
  @Input() education: CvEducation[] = []; @Input() experience: CvExperience[] = []; @Input() skills: CvSkill[] = []; @Input() languages: CvLanguage[] = []; @Input() certifications: CvCertification[] = []; @Input() projects: CvProject[] = []; @Input() references: CvReference[] = []; @Input() hobbies: CvHobby[] = [];
  @Input() fontSize = 10; @Input() fontWeight = 400; @Input() lineHeight = 1.55; @Input() fontFamily = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
  private get nameParts() { return (this.name || 'Your Name').split(/\s+/).filter(Boolean); }
  get firstName() { return this.nameParts[0] || 'Your'; }
  get lastName() { return this.nameParts.slice(1).join(' '); }
  get initials() { return this.nameParts.slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'CV'; }
  get hasContact() { return !!(this.email || this.phone || this.location || this.linkedin); }
  get hobbyNames() { return this.hobbies.map(hobby => typeof hobby === 'string' ? hobby : hobby?.name).filter(Boolean) as string[]; }
  educationDates(item: CvEducation) { return [item.startYear, item.current ? 'Present' : item.endYear].filter(Boolean).join(' - '); }
  educationLines(item: CvEducation) {
    const lines = [item.degree, item.field && item.field !== item.degree ? item.field : '', item.gpa ? `GPA: ${item.gpa}` : '', item.description];
    return lines.filter(Boolean) as string[];
  }
  experienceDates(item: CvExperience) { return [item.startDate, item.current ? 'Present' : item.endDate].filter(Boolean).join(' - '); }
}
