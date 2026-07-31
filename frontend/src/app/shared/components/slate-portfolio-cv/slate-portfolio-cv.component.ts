import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CvCertification,
  CvEducation,
  CvExperience,
  CvLanguage,
  CvProject,
  CvSkill,
} from '../professional-cv/professional-cv.component';

interface RailEducation {
  degree: string;
  institution: string;
  period: string;
  extra: string;
}

interface JobEntry {
  start: string;
  end: string;
  position: string;
  company: string;
  text: string;
}

interface RefEntry {
  name: string;
  role: string;
  org: string;
  contact: string;
}

/**
 * Slate Portfolio — white A4 sheet with a slate rail whose top edge is cut at
 * 45°, a ringed portrait, and a year-column experience list.
 * Sized in millimetres so preview and print are identical.
 */
@Component({
  selector: 'app-slate-portfolio-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv-sheet slate" [style.--accent]="accent">
      <div class="rail">
        <div class="rail-inner">
          @if (contactRows.length) {
            <section class="rail-block">
              <h2>Contact</h2>
              <ul class="contact">
                @for (row of contactRows; track $index) {
                  <li>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      @switch (row.icon) {
                        @case ('phone') {
                          <path
                            d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"
                          />
                        }
                        @case ('email') {
                          <path
                            d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                          />
                        }
                        @case ('website') {
                          <path d="M4 2.5 19.5 11l-6.6 1.8L9.9 19 4 2.5z" />
                        }
                        @default {
                          <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
                          />
                        }
                      }
                    </svg>
                    <span>{{ row.text }}</span>
                  </li>
                }
              </ul>
            </section>
          }

          @if (railEducation.length) {
            <section class="rail-block">
              <h2>Education</h2>
              @for (e of railEducation; track $index) {
                <div class="rail-entry">
                  <strong>{{ e.degree }}</strong>
                  @if (e.institution) {
                    <span>{{ e.institution }}</span>
                  }
                  @if (e.period) {
                    <span>{{ e.period }}</span>
                  }
                  @if (e.extra) {
                    <span>{{ e.extra }}</span>
                  }
                </div>
              }
            </section>
          }

          @if (skillNames.length) {
            <section class="rail-block">
              <h2>Skills</h2>
              <ul class="plain">
                @for (s of skillNames; track $index) {
                  <li>{{ s }}</li>
                }
              </ul>
            </section>
          }

          @if (languageNames.length) {
            <section class="rail-block">
              <h2>Language</h2>
              <ul class="plain">
                @for (l of languageNames; track $index) {
                  <li>{{ l }}</li>
                }
              </ul>
            </section>
          }
        </div>
      </div>

      <div class="avatar">
        @if (photoUrl) {
          <img [src]="photoUrl" alt="Profile photo" />
        } @else {
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        }
      </div>

      <main class="main">
        <header class="identity">
          <h1>{{ name || 'Your Name' }}</h1>
          <p>{{ jobTitle || 'Professional Title' }}</p>
        </header>

        @if (summary) {
          <section class="block">
            <h2>About Me</h2>
            <p class="about">{{ summary }}</p>
          </section>
        }

        @if (jobs.length) {
          <section class="block">
            <h2>Experience</h2>
            @for (j of jobs; track $index) {
              <div class="job">
                <div class="job__years">
                  <span>{{ j.start }}</span>
                  @if (j.end) {
                    <span class="dash">–</span>
                    <span>{{ j.end }}</span>
                  }
                </div>
                <div class="job__body">
                  <h3>{{ j.position }}</h3>
                  @if (j.company) {
                    <p class="job__company">{{ j.company }}</p>
                  }
                  @if (j.text) {
                    <p class="job__text">{{ j.text }}</p>
                  }
                </div>
              </div>
            }
          </section>
        }

        @if (references.length) {
          <section class="block">
            <h2>{{ referenceHeading }}</h2>
            <div class="refs">
              @for (r of references; track $index) {
                <div class="ref">
                  <p class="ref__name">{{ r.name }}@if (r.role) {<span> | {{ r.role }}</span>}</p>
                  @if (r.org) {
                    <p>{{ r.org }}</p>
                  }
                  @if (r.contact) {
                    <p>{{ r.contact }}</p>
                  }
                </div>
              }
            </div>
          </section>
        }
      </main>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .cv-sheet {
        --accent: #323a4d;
        --ink: #2b3242;
        --muted: #5c6675;
        position: relative;
        box-sizing: border-box;
        width: 210mm;
        height: 297mm;
        overflow: hidden;
        background: #fff;
        color: var(--ink);
        font-family: 'Poppins', 'Montserrat', 'Segoe UI', 'Liberation Sans', Arial, sans-serif;
        font-size: 8pt;
        line-height: 1.5;
      }

      /* ---------------------------------------------------------- slate rail */

      .rail {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 78mm;
        background: var(--accent);
        /* 45° cut across the top-left corner, exactly as in the reference */
        clip-path: polygon(0 0, 100% 78mm, 100% 100%, 0 100%);
      }
      .rail-inner {
        box-sizing: border-box;
        padding: 78mm 11mm 12mm 13mm;
        color: #e7eaf1;
      }

      .rail-block + .rail-block {
        margin-top: 9mm;
      }
      .rail-block h2 {
        margin: 0 0 4.5mm;
        font-size: 11pt;
        font-weight: 700;
        letter-spacing: 1.4mm;
        text-transform: uppercase;
        color: #fff;
      }
      .rail-block h2::after {
        content: '';
        display: block;
        width: 12mm;
        height: 0.45mm;
        margin-top: 2.4mm;
        background: #fff;
      }

      .contact,
      .plain {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .contact li {
        display: flex;
        align-items: center;
        gap: 4mm;
        margin-bottom: 3.6mm;
      }
      .contact svg {
        flex: 0 0 3.8mm;
        width: 3.8mm;
        height: 3.8mm;
        fill: #fff;
      }
      .contact span {
        font-size: 7.5pt;
        overflow-wrap: anywhere;
      }

      .rail-entry + .rail-entry {
        margin-top: 4.5mm;
      }
      .rail-entry strong {
        display: block;
        margin-bottom: 1.4mm;
        font-size: 8.5pt;
        font-weight: 700;
        color: #fff;
      }
      .rail-entry span {
        display: block;
        font-size: 7.5pt;
        line-height: 1.5;
      }

      .plain li {
        margin-bottom: 2.2mm;
        font-size: 7.5pt;
      }

      /* -------------------------------------------------------------- photo */

      .avatar {
        position: absolute;
        top: 13mm;
        left: 11mm;
        display: grid;
        place-items: center;
        width: 54mm;
        height: 54mm;
        overflow: hidden;
        border: 4mm solid #6c7a96;
        border-radius: 50%;
        background: #9aa3b4;
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .avatar svg {
        width: 26mm;
        height: 26mm;
        fill: #ced4e0;
      }

      /* --------------------------------------------------------- main column */

      .main {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 78mm;
        padding: 25mm 12mm 14mm 15mm;
      }

      .identity h1 {
        margin: 0;
        max-width: 95mm;
        font-size: 26pt;
        font-weight: 700;
        letter-spacing: 0.15mm;
        line-height: 1.12;
        text-transform: uppercase;
        color: var(--ink);
      }
      .identity p {
        margin: 2.5mm 0 0;
        font-size: 11pt;
        font-weight: 400;
        letter-spacing: 1.6mm;
        text-transform: uppercase;
        color: var(--ink);
      }

      .block {
        margin-top: 12mm;
      }
      .block h2 {
        margin: 0;
        padding-bottom: 3mm;
        border-bottom: 0.4mm solid var(--ink);
        font-size: 12.5pt;
        font-weight: 700;
        letter-spacing: 1.6mm;
        text-transform: uppercase;
        color: var(--ink);
      }

      .about {
        margin: 4mm 0 0;
        font-size: 8pt;
        line-height: 1.65;
        text-align: justify;
        color: var(--muted);
      }

      .job {
        display: grid;
        grid-template-columns: 14mm 1fr;
        gap: 0 6mm;
        margin-top: 6mm;
      }
      .job__years {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding-top: 0.6mm;
        font-size: 8.5pt;
        line-height: 1.45;
        color: var(--ink);
      }
      .job__years .dash {
        color: var(--muted);
      }
      .job__body {
        padding-left: 5mm;
        border-left: 0.35mm solid #b7bdc9;
      }
      .job__body h3 {
        margin: 0;
        font-size: 10.5pt;
        font-weight: 700;
        color: var(--ink);
      }
      .job__company {
        margin: 1.2mm 0 0;
        font-size: 8.5pt;
        color: var(--ink);
      }
      .job__text {
        margin: 2.2mm 0 0;
        font-size: 7.6pt;
        line-height: 1.6;
        text-align: justify;
        color: var(--muted);
      }

      .refs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5mm 8mm;
        margin-top: 5mm;
      }
      .ref p {
        margin: 0 0 2mm;
        font-size: 8pt;
        color: var(--ink);
      }
      .ref__name {
        font-weight: 600;
      }
      .ref__name span {
        font-weight: 400;
      }

      @media print {
        .cv-sheet {
          width: 210mm !important;
          height: 297mm !important;
          box-shadow: none !important;
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
    `,
  ],
})
export class SlatePortfolioCvComponent {
  @Input() accent = '#323a4d';
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

  /** Kept for API parity with the other templates — this layout is fixed-size. */
  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.4;
  @Input() sectionLines = true;

  get contactRows(): { icon: 'phone' | 'email' | 'website' | 'address'; text: string }[] {
    const rows: { icon: 'phone' | 'email' | 'website' | 'address'; text: string }[] = [];
    if (this.phone) rows.push({ icon: 'phone', text: this.phone });
    if (this.email) rows.push({ icon: 'email', text: this.email });
    if (this.linkedin) rows.push({ icon: 'website', text: this.linkedin });
    if (this.location) rows.push({ icon: 'address', text: this.location });
    return rows;
  }

  get railEducation(): RailEducation[] {
    return this.education.slice(0, 3).map((e) => ({
      degree: [e.degree, e.field].filter(Boolean).join(' in ') || 'Degree',
      institution: e.institution || '',
      period: this.range(e.startYear, e.endYear, e.current),
      extra: e.gpa ? `GPA ${e.gpa}` : '',
    }));
  }

  get skillNames(): string[] {
    return this.skills
      .map((s) => s.name)
      .filter((n): n is string => !!n)
      .slice(0, 8);
  }

  get languageNames(): string[] {
    return this.languages
      .map((l) => l.name)
      .filter((n): n is string => !!n)
      .slice(0, 5);
  }

  get jobs(): JobEntry[] {
    return this.experience.slice(0, 3).map((x) => ({
      start: x.startDate || '',
      end: x.current ? 'Present' : x.endDate || '',
      position: x.position || 'Job title',
      company: x.company || '',
      text: (x.responsibilities || []).filter(Boolean).join(' '),
    }));
  }

  get referenceHeading(): string {
    return this.certifications.some((c) => c.name) ? 'Certifications' : 'Projects';
  }

  get references(): RefEntry[] {
    const certs = this.certifications.filter((c) => c.name);
    if (certs.length) {
      return certs.slice(0, 4).map((c) => ({
        name: c.name!,
        role: c.issuer || '',
        org: c.date || '',
        contact: '',
      }));
    }
    return this.projects
      .filter((p) => p.name)
      .slice(0, 4)
      .map((p) => ({ name: p.name!, role: '', org: p.description || '', contact: p.link || '' }));
  }

  private range(start?: string, end?: string, current?: boolean): string {
    const s = start || '';
    const e = current ? 'Present' : end || '';
    if (s && e) return `${s}-${e}`;
    return s || e || '';
  }
}
