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

export type HobbyIcon = 'music' | 'reading' | 'writing' | 'travel';

interface TimelineEntry {
  period: string;
  title: string;
  subtitle: string;
  description: string;
}

interface Meter {
  label: string;
  value: number;
}

interface ContactLine {
  icon: 'website' | 'address' | 'phone' | 'email';
  lines: string[];
}

/**
 * Classic Blue — full-bleed A4 sheet with a navy sidebar and a timeline column.
 * Every dimension is expressed in millimetres so the screen preview and the
 * printed page are identical.
 */
@Component({
  selector: 'app-classic-blue-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv-sheet" [style.--accent]="accent">
      <aside class="aside">
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

        <div class="identity">
          <h1>{{ name || 'Your Name' }}</h1>
          <p>{{ jobTitle || 'lorem ipsum' }}</p>
        </div>

        @if (summary) {
          <section class="aside-section">
            <h2 class="aside-title">About Me</h2>
            <p class="about-text">{{ summary }}</p>
          </section>
        }

        @if (contactLines.length) {
          <section class="aside-section">
            <h2 class="aside-title">Contact</h2>
            <ul class="contact-list">
              @for (row of contactLines; track $index) {
                <li class="contact-item">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    @switch (row.icon) {
                      @case ('website') {
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                        />
                      }
                      @case ('address') {
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
                        />
                      }
                      @case ('phone') {
                        <path
                          d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                        />
                      }
                      @default {
                        <path
                          d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                        />
                      }
                    }
                  </svg>
                  <span>
                    @for (line of row.lines; track $index) {
                      {{ line }}<br />
                    }
                  </span>
                </li>
              }
            </ul>
          </section>
        }

        @if (skillMeters.length) {
          <section class="aside-section">
            <h2 class="aside-title">Professional Skills</h2>
            <ul class="meter-list">
              @for (m of skillMeters; track $index) {
                <li class="meter">
                  <span class="meter__label">{{ m.label }}</span>
                  <span class="meter__track"><i class="meter__fill" [style.width.%]="m.value"></i></span>
                </li>
              }
            </ul>
          </section>
        }

        @if (languageMeters.length) {
          <section class="aside-section">
            <h2 class="aside-title">Language</h2>
            <ul class="meter-list">
              @for (m of languageMeters; track $index) {
                <li class="meter">
                  <span class="meter__label">{{ m.label }}</span>
                  <span class="meter__track"><i class="meter__fill" [style.width.%]="m.value"></i></span>
                </li>
              }
            </ul>
          </section>
        }
      </aside>

      <main class="main">
        <span class="timeline"></span>

        @if (educationEntries.length) {
          <section class="block">
            <header class="block-head">
              <span class="block-head__badge">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
              </span>
              <h2>Formal Eduction</h2>
            </header>

            @for (e of educationEntries; track $index) {
              <div class="entry">
                <span class="entry__dot"></span>
                <div class="entry__head">
                  <span class="entry__period">{{ e.period }}</span>
                  <h3 class="entry__title">{{ e.title }}<span>{{ e.subtitle }}</span></h3>
                </div>
                @if (e.description) {
                  <p class="entry__text">{{ e.description }}</p>
                }
              </div>
            }
          </section>
        }

        @if (experienceEntries.length) {
          <section class="block">
            <header class="block-head">
              <span class="block-head__badge">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"
                  />
                </svg>
              </span>
              <h2>Professional Experience</h2>
            </header>

            @for (e of experienceEntries; track $index) {
              <div class="entry">
                <span class="entry__dot"></span>
                <div class="entry__head">
                  <span class="entry__period">{{ e.period }}</span>
                  <h3 class="entry__title">{{ e.title }}<span>{{ e.subtitle }}</span></h3>
                </div>
                @if (e.description) {
                  <p class="entry__text">{{ e.description }}</p>
                }
              </div>
            }
          </section>
        }

        @if (hobbies.length) {
          <section class="block">
            <header class="block-head">
              <span class="block-head__badge">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"
                  />
                </svg>
              </span>
              <h2>Hobbies</h2>
            </header>

            <div class="hobbies">
              @for (h of hobbies; track $index) {
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  @switch (h) {
                    @case ('music') {
                      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
                    }
                    @case ('reading') {
                      <path
                        d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"
                      />
                    }
                    @case ('writing') {
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    }
                    @default {
                      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
                    }
                  }
                </svg>
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
        --accent: #01334c;
        --meter: #0f8fc4;
        --ink: #201e1f;
        --muted: #7a797c;
        position: relative;
        box-sizing: border-box;
        display: flex;
        width: 210mm;
        height: 297mm;
        overflow: hidden;
        background: #fff;
        color: var(--ink);
        font-family: 'Lato', 'Liberation Sans', Arial, Helvetica, sans-serif;
      }

      /* ----------------------------------------------------------- sidebar */

      .aside {
        box-sizing: border-box;
        flex: 0 0 74mm;
        width: 74mm;
        padding: 13mm 7mm 10mm;
        background: var(--accent);
        color: #fff;
        text-align: center;
      }

      .avatar {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 42mm;
        height: 42mm;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 50%;
        background: #fff;
      }
      .avatar svg {
        width: 27mm;
        height: 27mm;
        fill: var(--accent);
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .identity {
        margin-top: 6mm;
      }
      .identity h1 {
        margin: 0;
        font-family: 'Oswald', 'Liberation Sans Narrow', 'Arial Narrow', Arial, sans-serif;
        font-size: 17pt;
        font-weight: 500;
        letter-spacing: 0.9mm;
        line-height: 1.1;
        text-transform: uppercase;
      }
      .identity p {
        margin: 1mm 0 0;
        font-size: 8.5pt;
        font-weight: 300;
        color: #cfd9e0;
      }

      .aside-section {
        margin-top: 8mm;
      }
      .aside-section:first-of-type {
        margin-top: 9mm;
      }

      .aside-title {
        display: inline-block;
        margin: 0 0 3mm;
        padding-bottom: 0.8mm;
        border-bottom: 0.35mm solid #fff;
        font-family: 'Oswald', 'Liberation Sans Narrow', 'Arial Narrow', Arial, sans-serif;
        font-size: 10pt;
        font-weight: 500;
        letter-spacing: 0.35mm;
        text-transform: uppercase;
      }

      .about-text {
        margin: 0;
        font-size: 5.6pt;
        font-weight: 300;
        line-height: 1.55;
        text-align: justify;
        color: #f1f5f8;
      }

      .contact-list,
      .meter-list {
        margin: 0;
        padding: 0;
        list-style: none;
        text-align: left;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 3mm;
        margin-bottom: 3mm;
      }
      .contact-item svg {
        flex: 0 0 5mm;
        width: 5mm;
        height: 5mm;
        fill: #fff;
      }
      .contact-item span {
        font-size: 6.6pt;
        font-weight: 300;
        line-height: 1.45;
        color: #eef3f7;
        word-break: break-word;
      }

      .meter {
        display: flex;
        align-items: center;
        gap: 2mm;
        margin-bottom: 1.4mm;
      }
      .meter__label {
        flex: 0 0 16mm;
        overflow: hidden;
        font-size: 6pt;
        text-transform: uppercase;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .meter__track {
        position: relative;
        display: block;
        flex: 1 1 auto;
        height: 2.1mm;
        background: #fff;
      }
      .meter__fill {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        display: block;
        background: var(--meter);
      }

      /* -------------------------------------------------------- main panel */

      .main {
        position: relative;
        box-sizing: border-box;
        flex: 1 1 auto;
        padding: 12mm 9mm 10mm 0;
      }

      .timeline {
        position: absolute;
        top: 13mm;
        bottom: 12mm;
        left: 8.5mm;
        width: 0.4mm;
        background: #1a1a1a;
      }

      .block + .block {
        margin-top: 9mm;
      }

      .block-head {
        position: relative;
        display: flex;
        align-items: center;
        min-height: 8mm;
        margin: 0 0 5mm;
        padding-left: 18mm;
      }
      .block-head__badge {
        position: absolute;
        top: 50%;
        left: 8.5mm;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 7.4mm;
        height: 7.4mm;
        border-radius: 50%;
        background: var(--accent);
        transform: translate(-50%, -50%);
      }
      .block-head__badge svg {
        width: 4.2mm;
        height: 4.2mm;
        fill: #fff;
      }
      .block-head h2 {
        margin: 0;
        font-family: 'Oswald', 'Liberation Sans Narrow', 'Arial Narrow', Arial, sans-serif;
        font-size: 15.5pt;
        font-weight: 600;
        letter-spacing: 0.25mm;
        text-transform: uppercase;
        color: var(--accent);
      }

      .entry {
        position: relative;
        margin-bottom: 6.5mm;
        padding-left: 11mm;
      }
      .entry:last-child {
        margin-bottom: 0;
      }
      .entry__dot {
        position: absolute;
        top: 1.6mm;
        left: 8.5mm;
        width: 2.6mm;
        height: 2.6mm;
        margin-left: -1.3mm;
        border-radius: 50%;
        background: var(--ink);
      }
      .entry__head {
        display: flex;
        align-items: flex-start;
        gap: 3mm;
      }
      .entry__period {
        flex: 0 0 19mm;
        font-size: 8.5pt;
        color: #3d3b3c;
        white-space: nowrap;
      }
      .entry__title {
        margin: 0;
        font-size: 9pt;
        font-weight: 700;
        line-height: 1.35;
        letter-spacing: 0.12mm;
        text-transform: uppercase;
        color: var(--ink);
      }
      .entry__title span {
        display: block;
        font-weight: 400;
      }
      .entry__text {
        margin: 2mm 0 0 22mm;
        max-width: 62mm;
        font-size: 5.8pt;
        font-weight: 300;
        line-height: 1.6;
        color: var(--muted);
      }

      .hobbies {
        display: flex;
        align-items: center;
        gap: 12mm;
        margin: 6mm 0 0 24mm;
      }
      .hobbies svg {
        width: 8mm;
        height: 8mm;
        fill: var(--ink);
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
export class ClassicBlueCvComponent {
  @Input() accent = '#01334c';
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
  @Input() hobbies: HobbyIcon[] = ['music', 'reading', 'writing', 'travel'];

  /** Kept for API parity with the other templates — this layout is fixed-size. */
  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.4;
  @Input() sectionLines = true;

  private static readonly LEVELS: Record<string, number> = {
    Beginner: 35,
    Basic: 50,
    Intermediate: 70,
    Advanced: 85,
    Expert: 100,
    Native: 100,
    Fluent: 92,
    Conversational: 65,
  };

  get contactLines(): ContactLine[] {
    const rows: ContactLine[] = [];
    if (this.linkedin) rows.push({ icon: 'website', lines: [this.linkedin] });
    if (this.location) rows.push({ icon: 'address', lines: [this.location] });
    if (this.phone) rows.push({ icon: 'phone', lines: [this.phone] });
    if (this.email) rows.push({ icon: 'email', lines: [this.email] });
    return rows;
  }

  get skillMeters(): Meter[] {
    return this.skills
      .filter((s) => s.name)
      .slice(0, 8)
      .map((s) => ({ label: s.name!, value: this.pct(s.level) }));
  }

  get languageMeters(): Meter[] {
    return this.languages
      .filter((l) => l.name)
      .slice(0, 6)
      .map((l) => ({ label: l.name!, value: this.pct(l.proficiency) }));
  }

  get educationEntries(): TimelineEntry[] {
    return this.education.slice(0, 3).map((e) => ({
      period: this.range(e.startYear, e.endYear, e.current),
      title: [e.degree, e.field].filter(Boolean).join(' in ') || 'Degree name',
      subtitle: e.institution || '',
      description: e.description || '',
    }));
  }

  get experienceEntries(): TimelineEntry[] {
    return this.experience.slice(0, 3).map((x) => ({
      period: this.range(x.startDate, x.endDate, x.current),
      title: x.position || 'Job title',
      subtitle: x.company || '',
      description: (x.responsibilities || []).filter(Boolean).join(' '),
    }));
  }

  private pct(level?: string): number {
    return ClassicBlueCvComponent.LEVELS[level || ''] ?? 70;
  }

  private range(start?: string, end?: string, current?: boolean): string {
    const s = start || '';
    const e = current ? 'Present' : end || '';
    if (s && e) return `${s}-${e}`;
    return s || e || '';
  }
}
