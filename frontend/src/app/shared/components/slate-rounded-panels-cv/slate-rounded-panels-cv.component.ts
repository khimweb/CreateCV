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
  selector: 'app-slate-rounded-panels-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv-paper" [style.--accent]="accent" [style.--fs.px]="fontSize" [style.--fw]="fontWeight" [style.--lh]="lineHeight" [style.--font]="fontFamily">
      <header class="head">
        <div class="photo-card"><div class="photo" [style.background-image]="photoUrl ? 'url(' + photoUrl + ')' : null"><span *ngIf="!photoUrl">{{ initials }}</span></div></div>
        <div class="head-copy"><h1>{{ name || 'Your Name' }}</h1><p class="role">{{ jobTitle || 'Professional title' }}</p></div>
      </header>

      <div class="contact-bar" *ngIf="hasContact">
        <div class="contact-item" *ngIf="phone"><i>☎</i><span>{{ phone }}</span></div>
        <div class="contact-item" *ngIf="email"><i>✉</i><span>{{ email }}</span></div>
        <div class="contact-item" *ngIf="linkedin"><i>⌁</i><span>{{ linkedin }}</span></div>
        <div class="contact-item" *ngIf="location"><i>⌖</i><span>{{ location }}</span></div>
      </div>

      <div class="body">
        <aside class="sidebar">
          <section class="block" *ngIf="education.length"><h2>Education</h2><div class="edu" *ngFor="let item of education"><strong>{{ item.degree || item.field || 'Education' }}</strong><p>{{ item.institution }}</p><p>{{ educationDates(item) }}</p><p *ngIf="item.description">{{ item.description }}</p></div></section>
          <section class="block" *ngIf="certifications.length"><h2>Certifications</h2><ul class="bullets"><li *ngFor="let cert of certifications">{{ cert.name }}<ng-container *ngIf="cert.issuer"> — {{ cert.issuer }}</ng-container></li></ul></section>
          <section class="block" *ngIf="skills.length"><h2>Skills</h2><ul class="plain"><li *ngFor="let skill of skills">{{ skill.name }}</li></ul></section>
          <section class="block" *ngIf="languages.length"><h2>Language</h2><ul class="plain"><li *ngFor="let language of languages">{{ language.name }}</li></ul></section>
          <section class="block" *ngIf="hobbyNames.length"><h2>Interests</h2><ul class="plain"><li *ngFor="let hobby of hobbyNames">{{ hobby }}</li></ul></section>
        </aside>

        <main class="content">
          <section class="block" *ngIf="summary"><h2>About me</h2><p class="about">{{ summary }}</p></section>
          <section class="block" *ngIf="experience.length"><h2>Experience</h2><div class="exp" *ngFor="let item of experience"><div class="exp-head"><span class="exp-title">{{ item.position || 'Position' }}</span><span class="exp-date">{{ experienceDates(item) }}</span></div><div class="exp-company">{{ item.company }}</div><p class="exp-desc" *ngFor="let responsibility of item.responsibilities">{{ responsibility }}</p></div></section>
          <section class="block" *ngIf="projects.length"><h2>Projects</h2><div class="exp" *ngFor="let project of projects"><div class="exp-head"><span class="exp-title">{{ project.name }}</span></div><p class="exp-desc">{{ project.description || project.link }}</p></div></section>
          <section class="block" *ngIf="references.length"><h2>Reference</h2><div class="ref-grid"><div class="ref" *ngFor="let reference of references"><div class="ref-name">{{ reference.name }}<ng-container *ngIf="reference.position"> | {{ reference.position }}</ng-container></div><div class="ref-company">{{ reference.company }}</div><div *ngIf="reference.phone">{{ reference.phone }}</div><div *ngIf="reference.email">{{ reference.email }}</div></div></div></section>
        </main>
      </div>
    </article>
  `,
  styles: [`

    :host { display: block; }
    .cv-paper { --accent: #364152; --fs: 10px; --fw: 400; --lh: 1.5; --font: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; box-sizing: border-box; width: 210mm; min-height: 297mm; padding: 9mm; background: #fff; color: #2A2A2A; font-family: var(--font); font-size: var(--fs); font-weight: var(--fw); line-height: var(--lh); }

    .head { display: flex; align-items: center; gap: 9mm; margin-bottom: 5mm; }
    .photo-card { display: grid; flex: 0 0 auto; place-items: center; width: 66mm; height: 47mm; background: var(--accent); border-radius: 5mm 5mm 13mm 5mm; }
    .photo { display: grid; place-items: center; width: 33mm; height: 33mm; border: 1mm solid rgba(255,255,255,.3); border-radius: 50%; background: rgba(255,255,255,.08) center / cover no-repeat; color: #fff; font-size: calc(var(--fs) * 1.7); font-weight: 700; letter-spacing: .05em; }
    .head-copy { min-width: 0; }
    h1 { margin: 0; color: var(--accent); font-size: calc(var(--fs) * 3.1); font-weight: 700; line-height: 1.1; letter-spacing: .06em; text-transform: uppercase; }
    .role { margin: 2.5mm 0 0; color: #666; font-size: calc(var(--fs) * 1.35); font-weight: 500; letter-spacing: .22em; text-transform: uppercase; }

    .contact-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 2mm 5mm; margin-bottom: 7mm; padding: 3.2mm 6.5mm; background: var(--accent); border-radius: 99px; color: #fff; font-size: calc(var(--fs) * .98); }
    .contact-item { display: flex; min-width: 0; align-items: center; gap: 1.8mm; }
    .contact-item i { flex: 0 0 auto; font-style: normal; opacity: .9; }
    .contact-item span { overflow-wrap: anywhere; }

    .body { display: grid; grid-template-columns: 66mm minmax(0, 1fr); gap: 9mm; align-items: start; }
    .sidebar { box-sizing: border-box; padding: 8mm 5.5mm; background: var(--accent); border-radius: 5mm 13mm 5mm 5mm; color: #fff; }
    .block { margin-bottom: 7mm; break-inside: avoid; page-break-inside: avoid; }
    .block:last-child { margin-bottom: 0; }
    h2 { margin: 0 0 3.6mm; padding-bottom: 2mm; font-size: calc(var(--fs) * 1.55); font-weight: 700; letter-spacing: .1em; }
    .sidebar h2 { color: #fff; border-bottom: 1px solid rgba(255,255,255,.3); }
    .content h2 { color: var(--accent); border-bottom: 1px solid #ccc; }

    .edu { margin-bottom: 4mm; }
    .edu strong { display: block; margin-bottom: .8mm; font-size: calc(var(--fs) * 1.08); font-weight: 700; }
    .edu p { margin: 0; color: #D1D5DB; font-size: calc(var(--fs) * 1); line-height: 1.45; }
    .bullets { margin: 0; padding-left: 4mm; color: #D1D5DB; font-size: calc(var(--fs) * 1); }
    .bullets li { margin-bottom: 2mm; line-height: 1.4; }
    .plain { margin: 0; padding: 0; list-style: none; color: #D1D5DB; font-size: calc(var(--fs) * 1); }
    .plain li { margin-bottom: 2mm; }

    .about { margin: 0; font-size: calc(var(--fs) * 1.02); line-height: calc(var(--lh) * 1.05); }
    .exp { margin-bottom: 5mm; break-inside: avoid; page-break-inside: avoid; }
    .exp:last-child { margin-bottom: 0; }
    .exp-head { display: flex; align-items: baseline; justify-content: space-between; gap: 5mm; margin-bottom: .6mm; }
    .exp-title { color: var(--accent); font-size: calc(var(--fs) * 1.22); font-weight: 700; }
    .exp-date { flex: 0 0 auto; font-size: calc(var(--fs) * 1); font-weight: 500; white-space: nowrap; }
    .exp-company { margin-bottom: 1.6mm; color: #666; font-size: calc(var(--fs) * 1); }
    .exp-desc { margin: 0 0 1.4mm; font-size: calc(var(--fs) * 1); line-height: calc(var(--lh) * 1.02); }
    .ref-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5mm; font-size: calc(var(--fs) * 1); }
    .ref-name { color: var(--accent); font-weight: 700; }
    .ref-company { margin-bottom: 1.4mm; color: #666; }
    .ref div { overflow-wrap: anywhere; }

    @media screen and (max-width: 700px) { :host { display: block; overflow-x: auto; } .cv-paper { transform-origin: top left; } }
    @media print {
      :host { display: block; height: auto !important; overflow: visible !important; }
      .cv-paper { width: 100% !important; min-height: 0 !important; overflow: visible !important; box-shadow: none !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
      .block, .exp { break-inside: avoid; page-break-inside: avoid; }
      @page { size: A4 portrait; margin: 0; }
    }
  `],
})
export class SlateRoundedPanelsCvComponent {
  @Input() accent = '#364152';
  @Input() name = ''; @Input() jobTitle = ''; @Input() email = ''; @Input() phone = ''; @Input() location = ''; @Input() linkedin = ''; @Input() summary = ''; @Input() photoUrl: string | null = null;
  @Input() education: CvEducation[] = []; @Input() experience: CvExperience[] = []; @Input() skills: CvSkill[] = []; @Input() languages: CvLanguage[] = []; @Input() certifications: CvCertification[] = []; @Input() projects: CvProject[] = []; @Input() references: CvReference[] = []; @Input() hobbies: CvHobby[] = [];
  @Input() fontSize = 10; @Input() fontWeight = 400; @Input() lineHeight = 1.5; @Input() fontFamily = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
  get initials() { return this.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'CV'; }
  get hasContact() { return !!(this.email || this.phone || this.location || this.linkedin); }
  get hobbyNames() { return this.hobbies.map(hobby => typeof hobby === 'string' ? hobby : hobby?.name).filter(Boolean) as string[]; }
  educationDates(item: CvEducation) { return [item.startYear, item.current ? 'Present' : item.endYear].filter(Boolean).join(' - '); }
  experienceDates(item: CvExperience) { return [item.startDate, item.current ? 'Present' : item.endDate].filter(Boolean).join(' - '); }
}
