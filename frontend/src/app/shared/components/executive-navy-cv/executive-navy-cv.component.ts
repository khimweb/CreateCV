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

interface Meter {
  label: string;
  value: number;
}

interface TimelineItem {
  title: string;
  meta: string;
  detail: string;
  note?: string;
}

/**
 * Executive Navy — full-bleed A4 sheet: navy page with a white content panel,
 * profile rail on the left and icon-led sections with timelines on the right.
 * Sized in millimetres so the preview and the printed page are identical.
 */
@Component({
  selector: 'app-executive-navy-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv-sheet exec" [style.--accent]="accent">
      <aside class="rail">
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

        @if (contactRows.length) {
          <section class="rail-block">
            <h2 class="rail-title">Contact</h2>
            <ul class="contact">
              @for (row of contactRows; track $index) {
                <li>
                  <span class="dot-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      @switch (row.icon) {
                        @case ('phone') {
                          <path
                            d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                          />
                        }
                        @case ('address') {
                          <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
                          />
                        }
                        @case ('website') {
                          <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                          />
                        }
                        @default {
                          <path
                            d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                          />
                        }
                      }
                    </svg>
                  </span>
                  <span class="contact__text">{{ row.text }}</span>
                </li>
              }
            </ul>
          </section>
        }

        @if (languageMeters.length) {
          <section class="rail-block">
            <h2 class="rail-title">Language</h2>
            <ul class="meters">
              @for (m of languageMeters; track $index) {
                <li>
                  <span class="meters__label">{{ m.label }}</span>
                  <span class="meters__track"><i [style.width.%]="m.value"></i></span>
                </li>
              }
            </ul>
          </section>
        }

        @if (projectItems.length) {
          <section class="rail-block">
            <h2 class="rail-title">Projects</h2>
            @for (p of projectItems; track $index) {
              <div class="rail-entry">
                <strong>{{ p.title }}</strong>
                @if (p.meta) {
                  <em>{{ p.meta }}</em>
                }
                @if (p.detail) {
                  <p>{{ p.detail }}</p>
                }
              </div>
            }
          </section>
        }

        @if (certificationItems.length) {
          <section class="rail-block">
            <h2 class="rail-title">Certificates</h2>
            @for (c of certificationItems; track $index) {
              <div class="rail-entry">
                <strong>{{ c.title }}</strong>
                @if (c.meta) {
                  <em>{{ c.meta }}</em>
                }
              </div>
            }
          </section>
        }
      </aside>

      <section class="panel">
        <header class="identity">
          <h1><b>{{ firstName }}</b>{{ lastName ? ' ' + lastName : '' }}</h1>
          <p>{{ jobTitle || 'Professional Title' }}</p>
        </header>

        @if (summary) {
          <section class="sec">
            <div class="sec-head">
              <svg class="sec-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
              <span class="sec-head__line"><h2>Profile</h2></span>
            </div>
            <p class="profile-text">{{ summary }}</p>
          </section>
        }

        @if (educationItems.length) {
          <section class="sec">
            <div class="sec-head">
              <svg class="sec-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
              <span class="sec-head__line"><h2>Education</h2></span>
            </div>
            <div class="timeline">
              @for (e of educationItems; track $index) {
                <div class="tl-item">
                  <h3>{{ e.title }}</h3>
                  @if (e.meta) {
                    <p>{{ e.meta }}</p>
                  }
                  @if (e.detail) {
                    <p class="tl-item__muted">{{ e.detail }}</p>
                  }
                </div>
              }
            </div>
          </section>
        }

        @if (experienceItems.length) {
          <section class="sec">
            <div class="sec-head">
              <svg class="sec-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4.2a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8zm0 13.6a7.2 7.2 0 0 1-5.2-2.2c.5-1.9 3-2.9 5.2-2.9s4.7 1 5.2 2.9A7.2 7.2 0 0 1 12 19.8z"
                />
              </svg>
              <span class="sec-head__line"><h2>Experience</h2></span>
            </div>
            <div class="timeline">
              @for (x of experienceItems; track $index) {
                <div class="tl-item">
                  <h3>{{ x.title }}</h3>
                  @if (x.meta) {
                    <p>{{ x.meta }}</p>
                  }
                  @if (x.detail) {
                    <p class="tl-item__muted">{{ x.detail }}</p>
                  }
                  @if (x.note) {
                    <p class="tl-item__note">{{ x.note }}</p>
                  }
                </div>
              }
            </div>
          </section>
        }

        @if (skillNames.length) {
          <section class="sec">
            <div class="sec-head">
              <svg class="sec-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M19.4 13a7.8 7.8 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.4h-4l-.3 2.6c-.6.2-1.2.6-1.7 1l-2.4-1-2 3.4L6.6 11a7.8 7.8 0 0 0 0 2l-2 1.6 2 3.4 2.4-1c.5.4 1.1.8 1.7 1l.3 2.6h4l.3-2.6c.6-.2 1.2-.6 1.7-1l2.4 1 2-3.4-2-1.6zM13 15.4A3.4 3.4 0 1 1 13 8.6a3.4 3.4 0 0 1 0 6.8z"
                />
              </svg>
              <span class="sec-head__line"><h2>Skills</h2></span>
            </div>
            <ul class="skills">
              @for (s of skillNames; track $index) {
                <li>{{ s }}</li>
              }
            </ul>
          </section>
        }
      </section>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .cv-sheet {
        --accent: #03374f;
        --ink: #1f2d36;
        --muted: #6b7b86;
        --rule: #cbd6dd;
        position: relative;
        box-sizing: border-box;
        width: 210mm;
        height: 297mm;
        overflow: hidden;
        background: var(--accent);
        color: var(--ink);
        font-family: 'Open Sans', 'Segoe UI', 'Liberation Sans', Arial, sans-serif;
        font-size: 8pt;
        line-height: 1.5;
      }

      /* --------------------------------------------------------------- rail */

      .rail {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 81mm;
        padding: 14mm 9mm 12mm 13mm;
        color: #fff;
      }

      .avatar {
        display: grid;
        place-items: center;
        width: 44mm;
        height: 44mm;
        margin: 0 auto 12mm;
        overflow: hidden;
        border: 1mm solid #fff;
        border-radius: 50%;
        background: #e9eef2;
        box-shadow:
          0 0 0 1.6mm var(--accent),
          0 0 0 2.6mm #fff;
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .avatar svg {
        width: 24mm;
        height: 24mm;
        fill: #b8c6cf;
      }

      .rail-block + .rail-block {
        margin-top: 9mm;
      }

      .rail-title {
        position: relative;
        margin: 0 0 3.5mm;
        padding-bottom: 2mm;
        border-bottom: 0.3mm solid rgba(255, 255, 255, 0.55);
        font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
        font-size: 13pt;
        font-weight: 700;
        letter-spacing: 0.2mm;
        text-transform: uppercase;
      }
      /* the little arrow tab that runs into the heading */
      .rail-title::before {
        content: '';
        position: absolute;
        top: 2.4mm;
        left: -10mm;
        width: 8.5mm;
        height: 3.4mm;
        background: #fff;
        clip-path: polygon(0 32%, 58% 32%, 58% 0, 100% 50%, 58% 100%, 58% 68%, 0 68%);
      }

      .contact,
      .meters {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .contact li {
        display: flex;
        align-items: center;
        gap: 2.6mm;
        margin-bottom: 2.4mm;
      }
      .dot-icon {
        display: grid;
        flex: 0 0 4.6mm;
        place-items: center;
        width: 4.6mm;
        height: 4.6mm;
        border: 0.25mm solid rgba(255, 255, 255, 0.85);
        border-radius: 50%;
      }
      .dot-icon svg {
        width: 2.6mm;
        height: 2.6mm;
        fill: #fff;
      }
      .contact__text {
        font-size: 7.5pt;
        letter-spacing: 0.05mm;
        color: #eaf1f5;
        overflow-wrap: anywhere;
      }

      .meters li {
        display: flex;
        align-items: center;
        gap: 3mm;
        margin-bottom: 1.8mm;
      }
      .meters__label {
        flex: 0 0 20mm;
        overflow: hidden;
        font-size: 7.5pt;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #eaf1f5;
      }
      .meters__track {
        position: relative;
        flex: 1 1 auto;
        height: 1.7mm;
        background: rgba(255, 255, 255, 0.22);
      }
      .meters__track i {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        display: block;
        background: #fff;
      }

      .rail-entry + .rail-entry {
        margin-top: 3.5mm;
      }
      .rail-entry strong {
        display: block;
        font-size: 8pt;
        font-weight: 700;
      }
      .rail-entry em {
        display: block;
        font-size: 7pt;
        font-style: italic;
        color: #c8d5dd;
      }
      .rail-entry p {
        margin: 1mm 0 0;
        font-size: 6.8pt;
        line-height: 1.5;
        color: #c8d5dd;
      }

      /* -------------------------------------------------------------- panel */

      .panel {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        right: 0;
        left: 81mm;
        height: 262mm;
        padding: 16mm 13mm 10mm 12mm;
        overflow: hidden;
        background: #fff;
      }

      .identity h1 {
        margin: 0;
        font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
        font-size: 25pt;
        font-weight: 300;
        letter-spacing: 0.4mm;
        line-height: 1.05;
        text-transform: uppercase;
        color: #9db0bc;
      }
      .identity h1 b {
        font-weight: 700;
        color: var(--accent);
      }
      .identity p {
        margin: 2mm 0 0;
        font-size: 9pt;
        letter-spacing: 1.1mm;
        text-transform: uppercase;
        color: #7b8f9c;
      }

      .sec {
        margin-top: 8mm;
      }

      .sec-head {
        display: flex;
        align-items: flex-end;
        gap: 2.5mm;
      }
      .sec-icon {
        flex: 0 0 8.5mm;
        width: 8.5mm;
        height: 8.5mm;
        fill: var(--accent);
      }
      .sec-head__line {
        flex: 1 1 auto;
        padding-bottom: 1.6mm;
        border-bottom: 0.3mm solid var(--rule);
      }
      .sec-head h2 {
        margin: 0;
        font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
        font-size: 14pt;
        font-weight: 700;
        letter-spacing: 0.2mm;
        text-transform: uppercase;
        color: var(--accent);
      }

      .profile-text {
        margin: 3.5mm 0 0;
        font-size: 7.6pt;
        line-height: 1.65;
        text-align: justify;
        color: var(--muted);
      }

      .timeline {
        position: relative;
        margin: 4.5mm 0 0 4mm;
        padding-left: 7mm;
      }
      .timeline::before {
        content: '';
        position: absolute;
        top: 1.5mm;
        bottom: 3mm;
        left: 0;
        width: 0.5mm;
        background: var(--accent);
      }

      .tl-item {
        position: relative;
      }
      .tl-item + .tl-item {
        margin-top: 5mm;
      }
      .tl-item::before {
        content: '';
        position: absolute;
        top: 1mm;
        left: -8.4mm;
        width: 2.8mm;
        height: 2.8mm;
        border-radius: 50%;
        background: var(--accent);
      }
      .tl-item h3 {
        margin: 0;
        font-size: 8.5pt;
        font-weight: 700;
        letter-spacing: 0.1mm;
        text-transform: uppercase;
        color: var(--accent);
      }
      .tl-item p {
        margin: 0.6mm 0 0;
        font-size: 7.6pt;
        line-height: 1.45;
        color: #43555f;
      }
      .tl-item__muted {
        color: var(--muted);
      }
      .tl-item__note {
        font-size: 7pt;
        line-height: 1.55;
        color: var(--muted);
      }

      .skills {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.8mm 8mm;
        margin: 4.5mm 0 0 4mm;
        padding: 0;
        list-style: none;
      }
      .skills li {
        position: relative;
        padding-left: 6mm;
        font-size: 7pt;
        letter-spacing: 0.15mm;
        text-transform: uppercase;
        color: #56666f;
      }
      .skills li::before {
        content: '';
        position: absolute;
        top: 0.7mm;
        left: 0;
        width: 3.4mm;
        height: 2.4mm;
        background: var(--accent);
        clip-path: polygon(0 0, 72% 0, 100% 50%, 72% 100%, 0 100%);
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
export class ExecutiveNavyCvComponent {
  @Input() accent = '#03374f';
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

  get firstName(): string {
    return (this.name || 'Your Name').trim().split(/\s+/)[0];
  }

  get lastName(): string {
    return (this.name || 'Your Name').trim().split(/\s+/).slice(1).join(' ');
  }

  get contactRows(): { icon: 'email' | 'phone' | 'address' | 'website'; text: string }[] {
    const rows: { icon: 'email' | 'phone' | 'address' | 'website'; text: string }[] = [];
    if (this.email) rows.push({ icon: 'email', text: this.email });
    if (this.phone) rows.push({ icon: 'phone', text: this.phone });
    if (this.location) rows.push({ icon: 'address', text: this.location });
    if (this.linkedin) rows.push({ icon: 'website', text: this.linkedin });
    return rows;
  }

  get languageMeters(): Meter[] {
    return this.languages
      .filter((l) => l.name)
      .slice(0, 7)
      .map((l) => ({ label: l.name!, value: this.pct(l.proficiency) }));
  }

  get skillNames(): string[] {
    return this.skills
      .map((s) => s.name)
      .filter((n): n is string => !!n)
      .slice(0, 12);
  }

  get educationItems(): TimelineItem[] {
    return this.education.slice(0, 3).map((e) => ({
      title: e.institution || 'Institution name',
      meta: [e.degree, e.field].filter(Boolean).join(' in '),
      detail: this.range(e.startYear, e.endYear, e.current),
    }));
  }

  get experienceItems(): TimelineItem[] {
    return this.experience.slice(0, 3).map((x) => ({
      title: x.company || x.position || 'Company name',
      meta: this.range(x.startDate, x.endDate, x.current),
      detail: x.position || '',
      note: (x.responsibilities || []).filter(Boolean).join(' '),
    }));
  }

  get projectItems(): TimelineItem[] {
    return this.projects
      .filter((p) => p.name)
      .slice(0, 2)
      .map((p) => ({ title: p.name!, meta: p.link || '', detail: p.description || '' }));
  }

  get certificationItems(): TimelineItem[] {
    return this.certifications
      .filter((c) => c.name)
      .slice(0, 3)
      .map((c) => ({ title: c.name!, meta: [c.issuer, c.date].filter(Boolean).join(' · '), detail: '' }));
  }

  private pct(level?: string): number {
    return ExecutiveNavyCvComponent.LEVELS[level || ''] ?? 70;
  }

  private range(start?: string, end?: string, current?: boolean): string {
    const s = start || '';
    const e = current ? 'Present' : end || '';
    if (s && e) return `${s} – ${e}`;
    return s || e || '';
  }
}
