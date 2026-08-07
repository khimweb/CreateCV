import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CvEducation { institution?: string; degree?: string; field?: string; startYear?: string; endYear?: string; current?: boolean; gpa?: string; description?: string; }
export interface CvExperience { company?: string; position?: string; startDate?: string; endDate?: string; current?: boolean; responsibilities?: string[]; }
export interface CvSkill { name?: string; level?: string; }
export interface CvLanguage { name?: string; proficiency?: string; }
export interface CvReference { name?: string; position?: string; company?: string; phone?: string; email?: string; }
export interface CvCertification { name?: string; issuer?: string; date?: string; }
export interface CvHobby { name?: string; }

@Component({
  selector: 'app-elegant-frame-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv-paper" [style.--accent]="accent" [style.--fs.px]="fontSize" [style.--fw]="fontWeight" [style.--lh]="lineHeight" [style.--font]="fontFamily">
      <!-- Dark frame border -->
      <div class="frame">
        <div class="frame-inner">

          <!-- Photo with geometric shape -->
          <div class="photo-geo">
            <div class="geo-shape"></div>
            <div class="photo-circle">
              @if (photoUrl) {
                <img [src]="photoUrl" alt="Profile photo" />
              } @else {
                <span class="photo-initials">{{ initials }}</span>
              }
            </div>
          </div>

          <!-- Two columns -->
          <div class="cv-columns">

            <!-- LEFT COLUMN -->
            <aside class="left-col">

              <!-- CONTACT -->
              <div class="sec">
                <h3 class="sec-title">C O N T A C T</h3>
                <div class="contact-list">
                  @if (phone) {
                    <div class="c-row">
                      <svg class="c-icon" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                      <span>{{ phone }}</span>
                    </div>
                  }
                  @if (email) {
                    <div class="c-row">
                      <svg class="c-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <span>{{ email }}</span>
                    </div>
                  }
                  @if (linkedin) {
                    <div class="c-row">
                      <svg class="c-icon" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      <span>{{ linkedin }}</span>
                    </div>
                  }
                  @if (location) {
                    <div class="c-row">
                      <svg class="c-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{{ location }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- EDUCATION -->
              @if (education.length) {
                <div class="sec">
                  <h3 class="sec-title">E D U C A T I O N</h3>
                  @for (ed of education; track $index) {
                    <div class="edu-block">
                      <div class="edu-degree">{{ degreeLine(ed) }}</div>
                      @if (ed.institution) { <div class="edu-inst">{{ ed.institution }}</div> }
                      <div class="edu-date">{{ formatRange(ed.startYear, ed.endYear, ed.current) }}</div>
                      @if (ed.description) { <div class="edu-desc">{{ ed.description }}</div> }
                    </div>
                  }
                </div>
              }

              <!-- SKILLS -->
              @if (skills.length) {
                <div class="sec">
                  <h3 class="sec-title">S K I L L S</h3>
                  <div class="skills-list">
                    @for (s of skills; track $index) {
                      @if (s.name) { <div class="skill-item">{{ s.name }}</div> }
                    }
                  </div>
                </div>
              }

              <!-- LANGUAGE -->
              @if (languages.length) {
                <div class="sec">
                  <h3 class="sec-title">L A N G U A G E</h3>
                  <div class="lang-list">
                    @for (l of languages; track $index) {
                      @if (l.name) { <div class="lang-item">{{ l.name }}</div> }
                    }
                  </div>
                </div>
              }

              <!-- HOBBIES -->
              @if (hobbies.length) {
                <div class="sec">
                  <h3 class="sec-title">H O B B I E S</h3>
                  <div class="hobby-list">
                    @for (hobby of hobbies; track $index) {
                      @if (hobby.name) { <span class="hobby-chip">{{ hobby.name }}</span> }
                    }
                  </div>
                </div>
              }
            </aside>

            <!-- RIGHT COLUMN -->
            <main class="right-col">

              <!-- Name header -->
              <header class="name-header">
                <h1 class="cv-name">{{ firstName }}<br/>{{ lastName }}</h1>
                @if (jobTitle) { <p class="cv-job">{{ jobTitle }}</p> }
              </header>

              <!-- ABOUT ME -->
              @if (summary) {
                <div class="sec">
                  <h2 class="sec-title-r">A B O U T &nbsp; M E</h2>
                  <p class="about-text">{{ summary }}</p>
                </div>
              }

              <!-- EXPERIENCE -->
              @if (experience.length) {
                <div class="sec">
                  <h2 class="sec-title-r">E X P E R I E N C E</h2>
                  <div class="exp-list">
                    @for (job of experience; track $index) {
                      <div class="exp-row">
                        <div class="exp-date">{{ formatExpDate(job) }}</div>
                        <div class="exp-divider"></div>
                        <div class="exp-body">
                          <div class="exp-position">{{ job.position || 'Position' }}</div>
                          @if (job.company) { <div class="exp-company">{{ job.company }}</div> }
                          @if (job.responsibilities?.length) {
                            @for (r of job.responsibilities; track $index) {
                              @if (r) { <p class="exp-desc">{{ r }}</p> }
                            }
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- CERTIFICATIONS -->
              @if (certifications.length) {
                <div class="sec">
                  <h2 class="sec-title-r">C E R T I F I C A T I O N S</h2>
                  <div class="cert-list">
                    @for (certification of certifications; track $index) {
                      @if (certification.name) {
                        <div class="cert-item">
                          <div class="cert-name">{{ certification.name }}</div>
                          @if (certification.issuer || certification.date) {
                            <div class="cert-meta">{{ certification.issuer }}{{ certification.issuer && certification.date ? ' · ' : '' }}{{ certification.date }}</div>
                          }
                        </div>
                      }
                    }
                  </div>
                </div>
              }

              <!-- REFERENCE -->
              @if (references.length) {
                <div class="sec">
                  <h2 class="sec-title-r">R E F E R E N C E</h2>
                  <div class="ref-grid">
                    @for (ref of references; track $index) {
                      @if (ref.name) {
                        <div class="ref-item">
                          <div class="ref-name">{{ ref.name }} | {{ ref.position || 'Position' }}</div>
                          @if (ref.company) { <div class="ref-company">{{ ref.company }}</div> }
                          @if (ref.phone) { <div class="ref-phone">{{ ref.phone }}</div> }
                        </div>
                      }
                    }
                  </div>
                </div>
              }
            </main>
          </div>
        </div>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }
    .cv-paper {
      --accent: #2c3e50;
      --fs: 10px;
      --fw: 400;
      --lh: 1.5;
      --font: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      font-family: var(--font);
      font-size: var(--fs);
      font-weight: var(--fw);
      line-height: var(--lh);
      background: #c8ced6;
      color: #222;
      padding: 10px;
    }

    /* ── Dark frame ── */
    .frame {
      width: 100%;
      min-height: calc(297mm - 20px);
      background: var(--accent);
      border-radius: 4px;
      padding: 0;
      position: relative;
    }
    .frame-inner {
      width: 100%;
      min-height: calc(297mm - 20px);
      position: relative;
    }

    /* ── Photo with geometric shape ── */
    .photo-geo {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 2;
    }
    .geo-shape {
      position: absolute;
      top: -10px;
      left: -10px;
      width: 130px;
      height: 130px;
      background: var(--accent);
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      opacity: 0.7;
    }
    .photo-circle {
      position: relative;
      width: 110px;
      height: 110px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid rgba(255,255,255,0.3);
      background: #3a4a5c;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    .photo-circle img { width: 100%; height: 100%; object-fit: cover; }
    .photo-initials {
      font-size: calc(var(--fs) * 3);
      font-weight: 700;
      color: rgba(255,255,255,0.8);
    }

    /* ── Columns ── */
    .cv-columns {
      display: grid;
      grid-template-columns: 200px 1fr;
      min-height: calc(297mm - 20px);
    }

    /* ── LEFT COLUMN ── */
    .left-col {
      background: rgba(255,255,255,0.07);
      padding: 150px 18px 24px 18px;
      color: #e8ecf0;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .sec { }
    .sec-title {
      font-size: calc(var(--fs) * 1.05);
      font-weight: 700;
      letter-spacing: 3px;
      margin: 0 0 12px;
      padding-bottom: 6px;
      border-bottom: 1.5px solid rgba(255,255,255,0.3);
      color: #fff;
    }

    /* Contact */
    .contact-list { display: flex; flex-direction: column; gap: 9px; }
    .c-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: calc(var(--fs) * 0.95);
      word-break: break-word;
    }
    .c-icon {
      width: 13px; height: 13px;
      flex-shrink: 0;
      margin-top: 1px;
      stroke: rgba(255,255,255,0.75);
      fill: none;
      stroke-width: 2;
    }

    /* Education */
    .edu-block { margin-bottom: 14px; }
    .edu-degree { font-weight: 700; font-size: calc(var(--fs) * 1); margin-bottom: 2px; }
    .edu-inst { font-size: calc(var(--fs) * 0.9); opacity: 0.85; margin-bottom: 1px; }
    .edu-date { font-size: calc(var(--fs) * 0.85); opacity: 0.7; }
    .edu-desc { font-size: calc(var(--fs) * 0.85); opacity: 0.75; margin-top: 3px; }

    /* Skills */
    .skills-list { display: flex; flex-direction: column; gap: 5px; }
    .skill-item { font-size: calc(var(--fs) * 0.95); font-weight: 500; }

    /* Language */
    .lang-list { display: flex; flex-direction: column; gap: 5px; }
    .lang-item { font-size: calc(var(--fs) * 0.95); font-weight: 500; }

    /* Hobbies */
    .hobby-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .hobby-chip {
      display: inline-flex;
      align-items: center;
      padding: 4px 7px;
      border: 1px solid rgba(255,255,255,0.35);
      border-radius: 999px;
      font-size: calc(var(--fs) * 0.8);
      font-weight: 600;
      letter-spacing: 0.2px;
      color: rgba(255,255,255,0.92);
    }

    /* ── RIGHT COLUMN ── */
    .right-col {
      background: #fff;
      padding: 28px 28px 24px 28px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    /* Name */
    .name-header { margin-bottom: 4px; }
    .cv-name {
      font-size: calc(var(--fs) * 3.5);
      font-weight: 900;
      color: #1a1a2e;
      line-height: 1.05;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .cv-job {
      font-size: calc(var(--fs) * 1.2);
      font-weight: 400;
      color: #555;
      margin: 8px 0 0;
      text-transform: uppercase;
      letter-spacing: 3px;
    }

    /* Section title right */
    .sec-title-r {
      font-size: calc(var(--fs) * 1.1);
      font-weight: 700;
      letter-spacing: 3px;
      color: #1a1a2e;
      margin: 0 0 10px;
      padding-bottom: 6px;
      border-bottom: 1.5px solid #d0d6dd;
    }

    /* About */
    .about-text {
      font-size: calc(var(--fs) * 1);
      line-height: var(--lh);
      color: #444;
      margin: 0;
      text-align: justify;
    }

    /* Experience */
    .exp-list { display: flex; flex-direction: column; gap: 16px; }
    .exp-row {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .exp-date {
      width: 55px;
      flex-shrink: 0;
      font-size: calc(var(--fs) * 0.9);
      font-weight: 600;
      color: #555;
      text-align: center;
      line-height: 1.4;
    }
    .exp-divider {
      width: 1.5px;
      align-self: stretch;
      background: #d0d6dd;
      flex-shrink: 0;
    }
    .exp-body { flex: 1; }
    .exp-position {
      font-size: calc(var(--fs) * 1.1);
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 2px;
    }
    .exp-company {
      font-size: calc(var(--fs) * 0.95);
      font-style: italic;
      color: #555;
      margin-bottom: 5px;
    }
    .exp-desc {
      font-size: calc(var(--fs) * 0.95);
      line-height: var(--lh);
      color: #555;
      margin: 3px 0 0;
      text-align: justify;
    }

    /* Certifications */
    .cert-list { display: grid; gap: 9px; }
    .cert-item {
      position: relative;
      padding-left: 12px;
      break-inside: avoid;
    }
    .cert-item::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 0;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--accent);
    }
    .cert-name {
      font-size: calc(var(--fs) * 1.02);
      font-weight: 700;
      color: #1a1a2e;
    }
    .cert-meta {
      margin-top: 1px;
      font-size: calc(var(--fs) * 0.88);
      color: #64748b;
    }

    /* Reference */
    .ref-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .ref-item { font-size: calc(var(--fs) * 0.9); }
    .ref-name { font-weight: 700; color: #1a1a2e; margin-bottom: 2px; }
    .ref-company { color: #555; margin-bottom: 1px; }
    .ref-phone { color: #777; }

    /* ── PRINT ── */
    @media print {
      :host { display: block; height: auto !important; overflow: visible !important; }
      .cv-paper {
        width: 100% !important; min-height: 0 !important;
        box-shadow: none !important; overflow: visible !important;
        -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact;
        padding: 0;
      }
      .frame { min-height: 0 !important; }
      .frame-inner { min-height: 0 !important; }
      .cv-columns { min-height: 0 !important; }
      .sec, .exp-row { break-inside: avoid; page-break-inside: avoid; }
      @page { size: A4 portrait; margin: 0; }
    }
  `],
})
export class ElegantFrameCvComponent {
  @Input() accent = '#2c3e50';
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
  @Input() certifications: CvCertification[] = [];
  @Input() hobbies: CvHobby[] = [];
  @Input() references: CvReference[] = [];
  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.5;
  @Input() fontFamily = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

  get firstName(): string {
    const p = (this.name || 'ISABEL SCHUMACHER').trim().split(/\s+/);
    return p.length > 1 ? p.slice(0, -1).join(' ') : p[0];
  }
  get lastName(): string {
    const p = (this.name || 'ISABEL SCHUMACHER').trim().split(/\s+/);
    return p.length > 1 ? p[p.length - 1] : '';
  }
  get initials(): string {
    return (this.name || 'IS').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
  }

  degreeLine(ed: CvEducation): string {
    return [ed.degree, ed.field].filter(Boolean).join(' in ') || 'Degree';
  }

  formatRange(start?: string, end?: string, current?: boolean): string {
    const s = start || '', e = current ? 'Present' : (end || '');
    if (s && e) return `${s} - ${e}`;
    return s || e || '';
  }

  formatExpDate(job: CvExperience): string {
    const s = job.startDate || '';
    const e = job.current ? 'Present' : (job.endDate || '');
    if (s && e) return `${s}\n–\n${e}`;
    return s || e || '';
  }
}
