import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CvEducation { institution?: string; degree?: string; field?: string; startYear?: string; endYear?: string; current?: boolean; gpa?: string; description?: string; }
export interface CvExperience { company?: string; position?: string; startDate?: string; endDate?: string; current?: boolean; responsibilities?: string[]; }
export interface CvSkill { name?: string; level?: string; }
export interface CvLanguage { name?: string; proficiency?: string; }
export interface CvReference { name?: string; position?: string; company?: string; phone?: string; email?: string; }

/**
 * Clean Sidebar CV — matches the Rufus Stewart reference:
 * White background, circular photo top-left, bold name top-right,
 * grey left sidebar (Contact, Education, Language bars, Reference),
 * white right content (About Me, Experience with bullets, Skill dots)
 */
@Component({
  selector: 'app-clean-sidebar-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv-paper"
      [style.--accent]="accent"
      [style.--fs.px]="fontSize"
      [style.--fw]="fontWeight"
      [style.--lh]="lineHeight"
      [style.--font]="fontFamily"
    >
      <!-- ── TOP HEADER ── -->
      <header class="top-header">
        <div class="photo-wrap">
          @if (photoUrl) {
            <img [src]="photoUrl" alt="Profile photo" />
          } @else {
            <span class="initials">{{ initials }}</span>
          }
        </div>
        <div class="name-block">
          <h1 class="cv-name">{{ firstName }}<br><span class="cv-lastname">{{ lastName }}</span></h1>
          @if (jobTitle) { <p class="cv-title">{{ jobTitle }}</p> }
        </div>
      </header>

      <!-- ── BODY ── -->
      <div class="cv-body">

        <!-- LEFT SIDEBAR -->
        <aside class="sidebar">

          <!-- CONTACT -->
          <div class="sb-block">
            <div class="sb-heading">CONTACT</div>
            <div class="sb-content">
              @if (phone) {
                <div class="contact-row">
                  <svg class="c-icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.58a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>{{ phone }}</span>
                </div>
              }
              @if (email) {
                <div class="contact-row">
                  <svg class="c-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>{{ email }}</span>
                </div>
              }
              @if (location) {
                <div class="contact-row">
                  <svg class="c-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{{ location }}</span>
                </div>
              }
            </div>
          </div>

          <!-- EDUCATION -->
          @if (education.length) {
            <div class="sb-block">
              <div class="sb-heading">EDUCATION</div>
              <div class="sb-content">
                @for (ed of education; track $index) {
                  <div class="edu-item">
                    <div class="edu-degree">{{ degreeLine(ed) }}</div>
                    @if (ed.institution) { <div class="edu-inst">{{ ed.institution }}</div> }
                    <div class="edu-date">{{ formatRange(ed.startYear, ed.endYear, ed.current) }}{{ ed.gpa ? ' | GPA: ' + ed.gpa : '' }}</div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- LANGUAGE -->
          @if (languages.length) {
            <div class="sb-block">
              <div class="sb-heading">LANGUAGE</div>
              <div class="sb-content">
                @for (lang of languages; track $index) {
                  @if (lang.name) {
                    <div class="lang-row">
                      <span class="lang-name">{{ lang.name }}</span>
                      <div class="lang-bar-track">
                        <div class="lang-bar-fill" [style.width]="langPct(lang.proficiency)"></div>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          }

          <!-- REFERENCE -->
          @if (references.length) {
            <div class="sb-block">
              <div class="sb-heading">REFERENCE</div>
              <div class="sb-content">
                @for (ref of references; track $index) {
                  @if (ref.name) {
                    <div class="ref-item">
                      <div class="ref-name">{{ ref.name }}</div>
                      @if (ref.position || ref.company) {
                        <div class="ref-role">{{ refRole(ref) }}</div>
                      }
                      @if (ref.phone) { <div class="ref-contact">{{ ref.phone }}</div> }
                    </div>
                  }
                }
              </div>
            </div>
          }

        </aside>

        <!-- RIGHT CONTENT -->
        <main class="content">

          <!-- ABOUT ME -->
          @if (summary) {
            <section class="cv-section">
              <div class="sec-pill">ABOUT ME</div>
              <p class="about-text">{{ summary }}</p>
            </section>
          }

          <!-- EXPERIENCE -->
          @if (experience.length) {
            <section class="cv-section">
              <div class="sec-pill">EXPERIENCE</div>
              <div class="exp-list">
                @for (job of experience; track $index) {
                  <div class="exp-item">
                    <div class="exp-dot"></div>
                    <div class="exp-body">
                      <div class="exp-date-line">{{ formatRange(job.startDate, job.endDate, job.current) }}</div>
                      @if (job.company) { <div class="exp-company">{{ job.company }}</div> }
                      <div class="exp-title">{{ job.position || 'Position' }}</div>
                      @if (job.responsibilities?.length) {
                        <ul class="exp-bullets">
                          @for (r of job.responsibilities; track $index) {
                            @if (r) { <li>{{ r }}</li> }
                          }
                        </ul>
                      }
                    </div>
                  </div>
                }
              </div>
            </section>
          }

          <!-- SKILL -->
          @if (skills.length) {
            <section class="cv-section">
              <div class="sec-pill">SKILL</div>
              <div class="skill-list">
                @for (skill of skills; track $index) {
                  @if (skill.name) {
                    <div class="skill-row">
                      <span class="skill-name">{{ skill.name }}</span>
                      <div class="skill-dots">
                        @for (d of [1,2,3,4,5]; track d) {
                          <span class="dot" [class.filled]="d <= skillDots(skill.level)"></span>
                        }
                      </div>
                    </div>
                  }
                }
              </div>
            </section>
          }

        </main>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }

    .cv-paper {
      --accent: #5a6a7a;
      --fs: 10px;
      --fw: 400;
      --lh: 1.5;
      --font: Arial, Helvetica, sans-serif;
      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      background: #fff;
      color: #222;
      font-family: var(--font);
      font-size: var(--fs);
      font-weight: var(--fw);
      line-height: var(--lh);
    }

    /* ── TOP HEADER ── */
    .top-header {
      display: flex;
      align-items: center;
      gap: 22px;
      padding: 28px 28px 22px 28px;
      background: #fff;
    }
    .photo-wrap {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      border: 3px solid #d0d6dd;
      background: #e8edf2;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .photo-wrap img { width: 100%; height: 100%; object-fit: cover; }
    .initials {
      font-size: calc(var(--fs) * 3.2);
      font-weight: 700;
      color: var(--accent);
    }
    .name-block { flex: 1; }
    .cv-name {
      font-size: calc(var(--fs) * 3.5);
      font-weight: 900;
      color: #1a1a1a;
      margin: 0;
      line-height: 1.05;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .cv-lastname { color: var(--accent); }
    .cv-title {
      font-size: calc(var(--fs) * 1.2);
      font-weight: 400;
      color: #666;
      margin: 8px 0 0;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    /* ── BODY ── */
    .cv-body {
      display: grid;
      grid-template-columns: 200px 1fr;
      min-height: calc(297mm - 160px);
    }

    /* ── LEFT SIDEBAR ── */
    .sidebar {
      background: var(--accent);
      color: #fff;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .sb-block { padding: 0 0 18px 0; }
    .sb-heading {
      background: rgba(255,255,255,0.18);
      font-size: calc(var(--fs) * 1.05);
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 7px 16px;
      margin-bottom: 12px;
      border-radius: 0 20px 20px 0;
      margin-right: 14px;
      text-align: center;
    }
    .sb-content { padding: 0 14px; }

    /* Contact */
    .contact-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 8px;
      font-size: calc(var(--fs) * 0.95);
      word-break: break-word;
    }
    .c-icon {
      width: 13px; height: 13px;
      flex-shrink: 0; margin-top: 1px;
      stroke: rgba(255,255,255,0.9); fill: none; stroke-width: 2;
    }

    /* Education */
    .edu-item { margin-bottom: 12px; font-size: calc(var(--fs) * 0.95); }
    .edu-degree { font-weight: 600; margin-bottom: 2px; }
    .edu-inst { font-style: italic; opacity: 0.9; margin-bottom: 2px; }
    .edu-date { font-size: calc(var(--fs) * 0.85); opacity: 0.8; }

    /* Language bars */
    .lang-row {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-bottom: 9px;
    }
    .lang-name { font-size: calc(var(--fs) * 0.95); font-weight: 500; }
    .lang-bar-track {
      height: 5px;
      background: rgba(255,255,255,0.25);
      border-radius: 3px;
      overflow: hidden;
    }
    .lang-bar-fill {
      height: 100%;
      background: rgba(255,255,255,0.85);
      border-radius: 3px;
      transition: width 0.3s;
    }

    /* Reference */
    .ref-item { margin-bottom: 12px; font-size: calc(var(--fs) * 0.95); }
    .ref-name { font-weight: 700; margin-bottom: 2px; }
    .ref-role { font-style: italic; opacity: 0.9; margin-bottom: 2px; }
    .ref-contact { font-size: calc(var(--fs) * 0.88); opacity: 0.85; }

    /* ── RIGHT CONTENT ── */
    .content {
      background: #fff;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .cv-section { }

    /* Pill heading */
    .sec-pill {
      display: inline-flex;
      align-items: center;
      background: var(--accent);
      color: #fff;
      font-size: calc(var(--fs) * 1.05);
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 6px 18px;
      border-radius: 20px;
      margin-bottom: 12px;
    }

    /* About Me */
    .about-text {
      font-size: calc(var(--fs) * 1);
      line-height: var(--lh);
      color: #444;
      margin: 0;
      text-align: justify;
    }

    /* Experience */
    .exp-list { display: flex; flex-direction: column; gap: 14px; }
    .exp-item { display: flex; gap: 10px; }
    .exp-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: var(--accent);
      flex-shrink: 0;
      margin-top: 4px;
    }
    .exp-body { flex: 1; }
    .exp-date-line { font-size: calc(var(--fs) * 0.88); color: #777; margin-bottom: 2px; }
    .exp-company { font-size: calc(var(--fs) * 0.95); color: #555; margin-bottom: 2px; }
    .exp-title { font-size: calc(var(--fs) * 1.05); font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
    .exp-bullets {
      margin: 0; padding-left: 14px;
      list-style-type: disc;
    }
    .exp-bullets li {
      font-size: calc(var(--fs) * 0.95);
      line-height: var(--lh);
      color: #555;
      margin-bottom: 3px;
      text-align: justify;
    }

    /* Skill dots */
    .skill-list { display: flex; flex-direction: column; gap: 8px; }
    .skill-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .skill-name {
      min-width: 130px;
      font-size: calc(var(--fs) * 1);
      color: #333;
    }
    .skill-dots { display: flex; gap: 5px; }
    .dot {
      width: 11px; height: 11px;
      border-radius: 50%;
      background: #d0d6dd;
    }
    .dot.filled { background: var(--accent); }

    /* ── PRINT ── */
    @media print {
      :host { display: block; height: auto !important; overflow: visible !important; }
      .cv-paper {
        width: 100% !important; min-height: 0 !important;
        box-shadow: none !important; overflow: visible !important;
        -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact;
      }
      .cv-body { min-height: 0 !important; }
      .cv-section, .exp-item { break-inside: avoid; page-break-inside: avoid; }
      @page { size: A4 portrait; margin: 0; }
    }
  `],
})
export class CleanSidebarCvComponent {
  @Input() accent = '#5a6a7a';
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
  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.5;
  @Input() fontFamily = 'Arial, Helvetica, sans-serif';

  get firstName(): string {
    const p = (this.name || 'RUFUS STEWART').trim().split(/\s+/);
    return p.length > 1 ? p.slice(0, -1).join(' ') : p[0];
  }
  get lastName(): string {
    const p = (this.name || 'RUFUS STEWART').trim().split(/\s+/);
    return p.length > 1 ? p[p.length - 1] : '';
  }
  get initials(): string {
    return (this.name || 'RS').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('');
  }
  degreeLine(ed: CvEducation): string {
    return [ed.degree, ed.field].filter(Boolean).join(' in ') || 'Degree';
  }
  refRole(ref: CvReference): string {
    return [ref.company, ref.position].filter(v => !!v).join(' / ');
  }
  formatRange(start?: string, end?: string, current?: boolean): string {
    const s = start || '', e = current ? 'Present' : (end || '');
    if (s && e) return `${s} – ${e}`;
    return s || e || '';
  }
  langPct(p?: string): string {
    const m: Record<string, string> = { Beginner: '20%', Basic: '35%', Elementary: '35%', Intermediate: '55%', Conversational: '45%', Advanced: '75%', Fluent: '85%', Native: '100%' };
    return m[p || ''] ?? '50%';
  }
  skillDots(level?: string): number {
    const m: Record<string, number> = { Beginner: 1, Basic: 2, Intermediate: 3, Advanced: 4, Expert: 5 };
    return m[level || ''] ?? 3;
  }
}
