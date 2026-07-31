import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CvEducation {
  institution?: string;
  degree?: string;
  field?: string;
  startYear?: string;
  endYear?: string;
  current?: boolean;
  gpa?: string;
  description?: string;
}

export interface CvExperience {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  responsibilities?: string[];
}

export interface CvSkill {
  name?: string;
  level?: string;
}

export interface CvLanguage {
  name?: string;
  proficiency?: string;
}

export interface CvCertification {
  name?: string;
  issuer?: string;
  date?: string;
}

export interface CvProject {
  name?: string;
  description?: string;
  link?: string;
}

export interface CvTypography {
  /** Base font size in px (body text). Default 10 */
  fontSize?: number;
  /** Body font weight: 400 | 500 | 600 | 700 */
  fontWeight?: number;
  /** Line height multiplier. Default 1.4 */
  lineHeight?: number;
  /** Show decorative section underlines */
  sectionLines?: boolean;
}

/** Print-friendly two-column CV (Professional Timeline layout). */
@Component({
  selector: 'app-professional-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="cv-paper"
      [class.no-lines]="!sectionLines"
      [style.--accent]="accent"
      [style.--fs.px]="fontSize"
      [style.--fw]="fontWeight"
      [style.--lh]="lineHeight"
    >
      <header class="cv-header">
        <div class="avatar">
          @if (photoUrl) {
            <img [src]="photoUrl" alt="Profile photo" />
          } @else {
            {{ initials }}
          }
        </div>
        <div class="intro">
          <h1>{{ name || 'Your Name' }}</h1>
          @if (jobTitle) {
            <p class="title">{{ jobTitle }}</p>
          }
          <p>{{ summary || 'Your professional summary will appear here.' }}</p>
        </div>
        <div class="contact">
          @if (email) {
            {{ email }}<br />
          }
          @if (phone) {
            {{ phone }}<br />
          }
          @if (location) {
            {{ location }}<br />
          }
          @if (linkedin) {
            {{ linkedin }}
          }
        </div>
      </header>
      <main class="cv-body">
        <section class="timeline">
          @if (experience.length) {
            <h2>Work Experience</h2>
            @for (job of experience; track $index) {
              <div class="job">
                <i></i>
                <h3>
                  {{ job.position || 'Position' }}
                  <small>{{ formatRange(job.startDate, job.endDate, job.current) }}</small>
                </h3>
                <em>{{ job.company }}</em>
                @if (job.responsibilities?.length) {
                  <ul>
                    @for (r of job.responsibilities; track $index) {
                      @if (r) {
                        <li>{{ r }}</li>
                      }
                    }
                  </ul>
                }
              </div>
            }
          }

          @if (education.length) {
            <h2>Education</h2>
            @for (ed of education; track $index) {
              <div class="job">
                <i></i>
                <h3>
                  {{ degreeLine(ed) }}
                  <small>{{ formatRange(ed.startYear, ed.endYear, ed.current) }}</small>
                </h3>
                <em>{{ ed.institution }}</em>
                @if (ed.gpa) {
                  <p>GPA: {{ ed.gpa }}</p>
                }
                @if (ed.description) {
                  <p>{{ ed.description }}</p>
                }
              </div>
            }
          }

          @if (projects.length) {
            <h2>Projects</h2>
            @for (p of projects; track $index) {
              <div class="job">
                <i></i>
                <h3>{{ p.name }}</h3>
                @if (p.description) {
                  <p>{{ p.description }}</p>
                }
                @if (p.link) {
                  <a [href]="p.link" target="_blank" rel="noopener">{{ p.link }}</a>
                }
              </div>
            }
          }
        </section>
        <aside>
          @if (skills.length) {
            <h2>Skills</h2>
            <div class="skills">
              @for (s of skills; track $index) {
                @if (s.name) {
                  <span>{{ s.name }}</span>
                  <b [class.short]="levelShort(s.level)" [style.--lvl]="levelPct(s.level)"></b>
                }
              }
            </div>
          }
          @if (languages.length) {
            <h2>Languages</h2>
            <div class="labels">
              @for (l of languages; track $index) {
                @if (l.name) {
                  <span>{{ l.name }} <b>{{ l.proficiency || '—' }}</b></span>
                }
              }
            </div>
          }
          @if (certifications.length) {
            <h2>Certifications</h2>
            @for (c of certifications; track $index) {
              @if (c.name) {
                <h3>{{ c.name }}</h3>
                @if (c.issuer) {
                  <em>{{ c.issuer }}</em>
                }
                @if (c.date) {
                  <p>{{ c.date }}</p>
                }
              }
            }
          }
        </aside>
      </main>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .cv-paper {
        --accent: #667b97;
        --fs: 10px;
        --fw: 400;
        --lh: 1.4;
        background: #fff;
        color: #17253b;
        font-family: Arial, Helvetica, sans-serif;
        font-size: var(--fs);
        font-weight: var(--fw);
        line-height: var(--lh);
        box-shadow: 0 4px 20px #0f172a33;
        width: 210mm;
        min-height: 297mm;
        box-sizing: border-box;
      }
      .cv-header {
        min-height: 112px;
        background: var(--accent);
        color: #fff;
        padding: 20px;
        display: grid;
        grid-template-columns: 112px 1fr 165px;
        gap: 16px;
        align-items: center;
      }
      .avatar {
        height: 102px;
        width: 102px;
        border-radius: 50%;
        background: linear-gradient(135deg, #d9e4ee, #fff);
        color: var(--accent);
        display: grid;
        place-items: center;
        font-size: calc(var(--fs) * 3);
        font-weight: 700;
        border: 3px solid #dbe8ef;
        overflow: hidden;
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .intro h1 {
        font-size: calc(var(--fs) * 2.5);
        font-weight: 700;
        margin: 0 0 4px;
        line-height: 1.15;
      }
      .intro .title {
        font-size: calc(var(--fs) * 1.2);
        font-weight: 600;
        opacity: 0.95;
        margin: 0 0 6px;
      }
      .intro p {
        font-size: calc(var(--fs) * 1.1);
        line-height: var(--lh);
        margin: 0;
        font-weight: var(--fw);
      }
      .contact {
        text-align: right;
        line-height: calc(var(--lh) + 0.2);
        font-size: calc(var(--fs) * 0.9);
        word-break: break-word;
        font-weight: var(--fw);
      }
      .cv-body {
        display: grid;
        grid-template-columns: 1.65fr 0.88fr;
        min-height: calc(297mm - 112px);
        align-items: start;
      }
      .timeline {
        padding: 28px 20px 25px 28px;
        border-right: 1px solid #edf0f3;
      }
      aside {
        padding: 20px 17px;
      }
      h2 {
        text-transform: uppercase;
        letter-spacing: 1.2px;
        color: var(--accent);
        font-size: calc(var(--fs) * 1);
        font-weight: 700;
        border-bottom: 2px solid var(--accent);
        padding-bottom: 5px;
        margin: 12px 0 14px;
      }
      .no-lines h2 {
        border-bottom: none;
        padding-bottom: 2px;
      }
      h2:first-child {
        margin-top: 0;
      }
      .job {
        border-left: 2px solid #e4e8ec;
        margin: 0 0 12px;
        padding: 0 0 0 14px;
        position: relative;
      }
      .no-lines .job {
        border-left-color: transparent;
      }
      .job i {
        position: absolute;
        width: 7px;
        height: 7px;
        background: var(--accent);
        border: 2px solid #dbe1e7;
        border-radius: 50%;
        left: -6px;
        top: 2px;
      }
      .no-lines .job i {
        display: none;
      }
      .cv-paper h3 {
        font-size: calc(var(--fs) * 1.1);
        font-weight: 700;
        margin: 0 0 3px;
        color: #07172d;
        line-height: var(--lh);
      }
      .job small {
        float: right;
        background: #e7ebef;
        color: #39526f;
        border-radius: 10px;
        padding: 3px 8px;
        font-size: calc(var(--fs) * 0.8);
        font-weight: 500;
      }
      .cv-paper em {
        color: var(--accent);
        font-size: calc(var(--fs) * 0.9);
        font-style: italic;
        font-weight: var(--fw);
      }
      .cv-paper p {
        margin: 2px 0;
        line-height: var(--lh);
        font-weight: var(--fw);
      }
      .cv-paper ul {
        padding-left: 14px;
        margin: 5px 0 0;
        line-height: var(--lh);
        font-weight: var(--fw);
      }
      .skills {
        display: grid;
        gap: 5px;
      }
      .skills span {
        font-weight: var(--fw);
        font-size: calc(var(--fs) * 0.95);
      }
      .skills b {
        height: 4px;
        border-radius: 2px;
        background: linear-gradient(to right, var(--accent) var(--lvl, 70%), #e5e8eb 0);
      }
      .skills b.short {
        --lvl: 55%;
      }
      .labels {
        display: grid;
        gap: 7px;
      }
      .labels span {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        font-size: calc(var(--fs) * 0.95);
      }
      .labels b {
        background: var(--accent);
        color: white;
        border-radius: 7px;
        padding: 2px 6px;
        font-size: calc(var(--fs) * 0.8);
        font-weight: 600;
      }
      .cv-paper a {
        color: var(--accent);
        text-decoration: underline;
        display: block;
        margin: 4px 0 10px;
        word-break: break-all;
        font-size: calc(var(--fs) * 0.9);
      }
      @media print {
        :host {
          display: block;
          height: auto !important;
          overflow: visible !important;
        }
        .cv-paper {
          width: 100% !important;
          min-height: 0 !important;
          height: auto !important;
          box-shadow: none !important;
          overflow: visible !important;
        }
        .cv-body {
          min-height: 0 !important;
          height: auto !important;
          overflow: visible !important;
        }
        .job,
        h2 {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
    `,
  ],
})
export class ProfessionalCvComponent {
  @Input() accent = '#667b97';
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
  @Input() projects: CvProject[] = [];

  /** Typography controls (live + print) */
  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.4;
  @Input() sectionLines = true;

  get initials(): string {
    const parts = (this.name || 'CV').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'CV';
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || '')
      .join('');
  }

  degreeLine(ed: CvEducation): string {
    const bits = [ed.degree, ed.field].filter(Boolean);
    return bits.join(' in ') || 'Degree';
  }

  formatRange(start?: string, end?: string, current?: boolean): string {
    const s = start || '';
    const e = current ? 'Present' : end || '';
    if (s && e) return `${s} – ${e}`;
    return s || e || '';
  }

  levelPct(level?: string): string {
    const map: Record<string, string> = {
      Beginner: '35%',
      Basic: '50%',
      Intermediate: '70%',
      Advanced: '85%',
      Expert: '100%',
    };
    return map[level || ''] || '70%';
  }

  levelShort(level?: string): boolean {
    return level === 'Beginner' || level === 'Basic';
  }
}
