import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CvEducation { institution?: string; degree?: string; field?: string; startYear?: string; endYear?: string; current?: boolean; gpa?: string; description?: string; }
export interface CvExperience { company?: string; position?: string; startDate?: string; endDate?: string; current?: boolean; responsibilities?: string[]; }
export interface CvSkill { name?: string; level?: string; }
export interface CvLanguage { name?: string; proficiency?: string; }
export interface CvReference { name?: string; position?: string; company?: string; phone?: string; email?: string; }
export interface CvProject { name?: string; description?: string; link?: string; }

@Component({
  selector: 'app-formal-classic-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv" [style.--fs.px]="fontSize" [style.--fw]="fontWeight" [style.--lh]="lineHeight" [style.--font]="fontFamily">
      <!-- HEADER -->
      <header class="hdr">
        <div class="hdr-info">
          <h1 class="hdr-name">{{ name || 'YOUR NAME' }}</h1>
          @if (jobTitle) { <h2 class="hdr-title">{{ jobTitle }}</h2> }
          <div class="contact-grid">
            <div class="contact-col">
              @if (phone) { <div class="ct"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6.57-6.57A19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.58a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span>{{ phone }}</span></div> }
              @if (email) { <div class="ct"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span>{{ email }}</span></div> }
            </div>
            <div class="contact-col">
              @if (location) { <div class="ct"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>{{ location }}</span></div> }
              @if (linkedin) { <div class="ct"><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg><span>{{ linkedin }}</span></div> }
            </div>
          </div>
        </div>
        <div class="photo-frame">
          @if (photoUrl) { <img [src]="photoUrl" alt="" /> }
          @else { <span class="ph-i">{{ initials }}</span> }
        </div>
      </header>

      <hr class="divider" />

      <!-- OBJECTIVE / SUMMARY -->
      @if (summary) {
        <section><h3 class="sec-title">OBJECTIVE</h3><p class="body-text">{{ summary }}</p></section>
        <hr class="divider" />
      }

      <!-- EDUCATION -->
      @if (education.length) {
        <section>
          <h3 class="sec-title">EDUCATION</h3>
          @for (ed of education; track $index) {
            <div class="sub-title">{{ degreeLine(ed) }}</div>
            <ul>
              @if (ed.institution) { <li>{{ ed.institution }} ({{ formatRange(ed.startYear, ed.endYear, ed.current) }})</li> }
              @if (ed.gpa) { <li>GPA: {{ ed.gpa }}</li> }
              @if (ed.description) { <li>{{ ed.description }}</li> }
            </ul>
          }
        </section>
        <hr class="divider" />
      }

      <!-- WORK EXPERIENCE -->
      @if (experience.length) {
        <section>
          <h3 class="sec-title">WORK EXPERIENCE</h3>
          @for (job of experience; track $index) {
            <div class="job-title">{{ job.position || 'Position' }}{{ job.company ? ' | ' + job.company : '' }} ({{ formatExpRange(job) }})</div>
            @if (job.responsibilities?.length) {
              <ul>@for (r of job.responsibilities; track $index) { @if (r) { <li>{{ r }}</li> } }</ul>
            }
          }
        </section>
        <hr class="divider" />
      }

      <!-- PROJECTS -->
      @if (projects.length) {
        <section>
          <h3 class="sec-title">PROJECTS &amp; ACHIEVEMENTS</h3>
          <ul>@for (p of projects; track $index) { @if (p.name) { <li><strong>{{ p.name }}</strong>{{ p.description ? ' – ' + p.description : '' }}</li> } }</ul>
        </section>
        <hr class="divider" />
      }

      <!-- SKILLS -->
      @if (skills.length) {
        <section>
          <h3 class="sec-title">TECHNICAL SKILLS</h3>
          <ul>@for (sk of skills; track $index) { @if (sk.name) { <li><strong>{{ sk.name }}</strong>{{ sk.level ? ' (' + sk.level + ')' : '' }}</li> } }</ul>
        </section>
        <hr class="divider" />
      }

      <!-- LANGUAGES -->
      @if (languages.length) {
        <section>
          <h3 class="sec-title">LANGUAGES</h3>
          <ul>@for (l of languages; track $index) { @if (l.name) { <li>{{ l.name }}{{ l.proficiency ? ' (' + l.proficiency + ')' : '' }}</li> } }</ul>
        </section>
        <hr class="divider" />
      }

      <!-- REFERENCES -->
      @if (references.length) {
        <section>
          <h3 class="sec-title">REFERENCES</h3>
          <ul>@for (ref of references; track $index) { @if (ref.name) { <li><strong>{{ ref.name }}</strong>{{ ref.position ? ' | ' + ref.position : '' }}{{ ref.company ? ', ' + ref.company : '' }}{{ ref.phone ? ' | ' + ref.phone : '' }}</li> } }</ul>
        </section>
      }
    </article>
  `,
  styles: [`
    :host { display: block; }
    .cv {
      --fs: 10px; --fw: 400; --lh: 1.4; --font: 'Times New Roman', Times, Georgia, serif;
      width: 210mm; min-height: 297mm; box-sizing: border-box;
      font-family: var(--font); font-size: var(--fs); font-weight: var(--fw); line-height: var(--lh);
      background: #fff; color: #111; padding: 42px 50px;
      box-shadow: 0 0 15px rgba(0,0,0,0.12);
    }

    /* ═══ HEADER ═══ */
    .hdr { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    .hdr-info { flex: 1; padding-right: 20px; }
    .hdr-name {
      font-family: Arial, Helvetica, sans-serif;
      font-size: calc(var(--fs) * 2.8); font-weight: 800;
      letter-spacing: 0.5px; text-transform: uppercase; color: #1a1a1a; margin-bottom: 3px;
    }
    .hdr-title {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: calc(var(--fs) * 1.7); font-style: italic; font-weight: 400;
      color: #222; margin-bottom: 14px;
    }

    /* Contact */
    .contact-grid { display: grid; grid-template-columns: auto 1fr; column-gap: 24px; row-gap: 0; }
    .contact-col { display: flex; flex-direction: column; gap: 5px; }
    .ct { display: flex; align-items: center; gap: 8px; font-size: calc(var(--fs) * 1.15); color: #333; }
    .ct svg { width: 12px; height: 12px; stroke: #222; fill: none; stroke-width: 2; flex-shrink: 0; }

    /* Photo */
    .photo-frame {
      width: 110px; height: 138px; border: 1px solid #ccc; overflow: hidden; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; background: #f3f4f6;
    }
    .photo-frame img { width: 100%; height: 100%; object-fit: cover; }
    .ph-i { font-size: calc(var(--fs) * 2.5); font-weight: 700; color: #666; }

    /* Divider */
    .divider { border: none; border-top: 1px solid #333; margin: 8px 0 10px; }

    /* Sections */
    section { margin-bottom: 2px; }
    .sec-title {
      font-family: 'Times New Roman', Times, serif;
      font-size: calc(var(--fs) * 1.45); font-weight: 700;
      letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 5px;
    }
    .sub-title, .job-title {
      font-size: calc(var(--fs) * 1.2); font-weight: 700; color: #000;
      margin: 4px 0 2px;
    }
    .body-text {
      font-size: calc(var(--fs) * 1.15); color: #222; text-align: justify; margin: 0;
    }
    ul { list-style-type: disc; padding-left: 16px; margin-bottom: 4px; }
    li { font-size: calc(var(--fs) * 1.15); color: #222; margin-bottom: 2px; text-align: justify; }
    strong { font-weight: 700; }

    /* ═══ PRINT ═══ */
    @media print {
      :host { display: block; }
      .cv { width: 100% !important; min-height: 0 !important; box-shadow: none !important; padding: 30px 40px; }
      section, li { break-inside: avoid; page-break-inside: avoid; }
      @page { size: A4 portrait; margin: 0; }
    }
  `],
})
export class FormalClassicCvComponent {
  @Input() accent = '#000000';
  @Input() name = '';
  @Input() jobTitle = '';
  @Input() email = '';
  @Input() phone = '';
  @Input() location = '';
  @Input() linkedin = '';
  @Input() summary = '';
  @Input() photoUrl: string | null = null;
  @Input() education: CvEducation[] = [];
  @Input() experience: CvExperience[] = [];
  @Input() skills: CvSkill[] = [];
  @Input() languages: CvLanguage[] = [];
  @Input() references: CvReference[] = [];
  @Input() projects: CvProject[] = [];
  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.4;
  @Input() fontFamily = "'Times New Roman', Times, Georgia, serif";

  get initials(): string { return (this.name || 'CV').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join(''); }
  degreeLine(ed: CvEducation): string { return [ed.degree, ed.field].filter(Boolean).join(' in ') || 'Degree'; }
  formatRange(start?: string, end?: string, current?: boolean): string { const s = start || '', e = current ? 'Present' : (end || ''); if (s && e) return `${s} – ${e}`; return s || e || ''; }
  formatExpRange(job: CvExperience): string { const s = job.startDate || '', e = job.current ? 'Present' : (job.endDate || ''); if (s && e) return `${s} – ${e}`; return s || e || ''; }
}
