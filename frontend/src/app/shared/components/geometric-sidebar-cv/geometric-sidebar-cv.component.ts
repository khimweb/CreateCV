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

export interface CvReference {
  name?: string;
  position?: string;
  company?: string;
  phone?: string;
  email?: string;
}

/**
 * Geometric Sidebar CV — Isabel Schumacher style:
 * Dark navy left column with diagonal white cut + circular photo,
 * CONTACT / EDUCATION / SKILLS / LANGUAGE in sidebar,
 * name header + ABOUT ME / EXPERIENCE (year rail) / REFERENCE on the right.
 */
@Component({
  selector: 'app-geometric-sidebar-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="cv-paper"
      [style.--accent]="accent"
      [style.--fs.px]="fontSize"
      [style.--fw]="fontWeight"
      [style.--lh]="lineHeight"
      [style.font-family]="fontFamily"
    >
      <div class="cv-layout">
        <!-- ═══════════════ LEFT SIDEBAR ═══════════════ -->
        <aside class="sidebar">
          <!-- Diagonal geometric header + photo -->
          <div class="geo-header">
            <div class="geo-cut" aria-hidden="true"></div>
            <div class="photo-ring">
              @if (photoUrl) {
                <img [src]="photoUrl" alt="Profile photo" />
              } @else {
                <span class="initials">{{ initials }}</span>
              }
            </div>
          </div>

          <div class="sidebar-body">
            <!-- CONTACT -->
            <section class="sb-section">
              <h2 class="sb-heading">CONTACT</h2>
              <div class="sb-rule"></div>
              <div class="sb-content">
                @if (phone) {
                  <div class="contact-row">
                    <svg class="c-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                    <span>{{ phone }}</span>
                  </div>
                }
                @if (email) {
                  <div class="contact-row">
                    <svg class="c-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>{{ email }}</span>
                  </div>
                }
                @if (linkedin) {
                  <div class="contact-row">
                    <svg class="c-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span>{{ linkedin }}</span>
                  </div>
                }
                @if (location) {
                  <div class="contact-row">
                    <svg class="c-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{{ location }}</span>
                  </div>
                }
              </div>
            </section>

            <!-- EDUCATION -->
            @if (education.length) {
              <section class="sb-section">
                <h2 class="sb-heading">EDUCATION</h2>
                <div class="sb-rule"></div>
                <div class="sb-content">
                  @for (ed of education; track $index) {
                    <div class="edu-item">
                      <div class="edu-degree">{{ degreeLine(ed) }}</div>
                      @if (ed.institution) {
                        <div class="edu-inst">{{ ed.institution }}</div>
                      }
                      <div class="edu-meta">{{ formatRange(ed.startYear, ed.endYear, ed.current) }}</div>
                      @if (ed.description) {
                        <div class="edu-meta">{{ ed.description }}</div>
                      }
                    </div>
                  }
                </div>
              </section>
            }

            <!-- SKILLS -->
            @if (skills.length) {
              <section class="sb-section">
                <h2 class="sb-heading">SKILLS</h2>
                <div class="sb-rule"></div>
                <div class="sb-content">
                  <ul class="skill-list">
                    @for (skill of skills; track $index) {
                      @if (skill.name) {
                        <li>{{ skill.name }}</li>
                      }
                    }
                  </ul>
                </div>
              </section>
            }

            <!-- LANGUAGE -->
            @if (languages.length) {
              <section class="sb-section">
                <h2 class="sb-heading">LANGUAGE</h2>
                <div class="sb-rule"></div>
                <div class="sb-content">
                  <ul class="lang-list">
                    @for (lang of languages; track $index) {
                      @if (lang.name) {
                        <li>{{ lang.name }}</li>
                      }
                    }
                  </ul>
                </div>
              </section>
            }
          </div>
        </aside>

        <!-- ═══════════════ RIGHT CONTENT ═══════════════ -->
        <main class="content">
          <header class="name-header">
            <h1 class="cv-name">
              <span class="cv-firstname">{{ firstName }}</span>
              @if (lastName) {
                <span class="cv-lastname">{{ lastName }}</span>
              }
            </h1>
            @if (jobTitle) {
              <p class="cv-title">{{ jobTitle }}</p>
            }
          </header>

          <!-- ABOUT ME -->
          @if (summary) {
            <section class="cv-section">
              <h2 class="sec-heading">ABOUT ME</h2>
              <div class="sec-rule"></div>
              <p class="about-text">{{ summary }}</p>
            </section>
          }

          <!-- EXPERIENCE -->
          @if (experience.length) {
            <section class="cv-section">
              <h2 class="sec-heading">EXPERIENCE</h2>
              <div class="sec-rule"></div>
              <div class="exp-list">
                @for (job of experience; track $index) {
                  <div class="exp-item">
                    <div class="exp-years">
                      @for (line of yearLines(job); track $index) {
                        <span>{{ line }}</span>
                      }
                    </div>
                    <div class="exp-rail" aria-hidden="true"></div>
                    <div class="exp-body">
                      <div class="exp-position">{{ job.position || 'Position' }}</div>
                      @if (job.company) {
                        <div class="exp-company">{{ job.company }}</div>
                      }
                      @if (job.responsibilities?.length) {
                        @for (r of job.responsibilities; track $index) {
                          @if (r) {
                            <p class="exp-desc">{{ r }}</p>
                          }
                        }
                      }
                    </div>
                  </div>
                }
              </div>
            </section>
          }

          <!-- REFERENCE -->
          @if (references.length) {
            <section class="cv-section">
              <h2 class="sec-heading">REFERENCE</h2>
              <div class="sec-rule"></div>
              <div class="ref-grid">
                @for (ref of references; track $index) {
                  @if (ref.name) {
                    <div class="ref-card">
                      <div class="ref-name">
                        {{ ref.name }}@if (ref.position) {<span> | {{ ref.position }}</span>}
                      </div>
                      @if (ref.company) {
                        <div class="ref-company">{{ ref.company }}</div>
                      }
                      @if (ref.phone) {
                        <div class="ref-phone">{{ ref.phone }}</div>
                      }
                      @if (ref.email) {
                        <div class="ref-email">{{ ref.email }}</div>
                      }
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
  styles: [
    `
      :host {
        display: block;
      }

      .cv-paper {
        --accent: #2c3e50;
        --fs: 10px;
        --fw: 400;
        --lh: 1.45;
        width: 210mm;
        min-height: 297mm;
        box-sizing: border-box;
        background: #fff;
        color: #2c3e50;
        font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
        font-size: var(--fs);
        font-weight: var(--fw);
        line-height: var(--lh);
      }

      .cv-layout {
        display: grid;
        grid-template-columns: 230px 1fr;
        min-height: 297mm;
      }

      /* ── LEFT SIDEBAR ── */
      .sidebar {
        background: var(--accent);
        color: #fff;
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 297mm;
      }

      .geo-header {
        position: relative;
        height: 168px;
        flex-shrink: 0;
      }

      /* White triangle cut from top-right of sidebar */
      .geo-cut {
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 0 150px 150px;
        border-color: transparent transparent transparent #fff;
        transform: scaleX(-1);
        z-index: 1;
      }

      /* Alternative cleaner diagonal using clip — keep triangle look */
      .geo-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 150px;
        background: linear-gradient(135deg, transparent 48%, #fff 48.5%);
        z-index: 1;
        pointer-events: none;
      }

      .geo-cut {
        display: none;
      }

      .photo-ring {
        position: absolute;
        top: 28px;
        left: 50%;
        transform: translateX(-50%);
        width: 118px;
        height: 118px;
        border-radius: 50%;
        border: 5px solid #c5ced8;
        background: #dbe2ea;
        overflow: hidden;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
      }

      .photo-ring img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .initials {
        font-size: calc(var(--fs) * 2.8);
        font-weight: 700;
        color: var(--accent);
        letter-spacing: 1px;
      }

      .sidebar-body {
        padding: 8px 20px 28px;
        display: flex;
        flex-direction: column;
        gap: 22px;
        flex: 1;
      }

      .sb-section {
        display: flex;
        flex-direction: column;
      }

      .sb-heading {
        margin: 0;
        font-size: calc(var(--fs) * 1.15);
        font-weight: 700;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: #fff;
      }

      .sb-rule {
        width: 36px;
        height: 2px;
        background: rgba(255, 255, 255, 0.85);
        margin: 7px 0 12px;
      }

      .sb-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .contact-row {
        display: flex;
        align-items: flex-start;
        gap: 9px;
        font-size: calc(var(--fs) * 0.92);
        line-height: 1.35;
        word-break: break-word;
        opacity: 0.95;
      }

      .c-icon {
        width: 13px;
        height: 13px;
        flex-shrink: 0;
        margin-top: 1px;
        opacity: 0.9;
      }

      .edu-item {
        margin-bottom: 12px;
        font-size: calc(var(--fs) * 0.95);
      }

      .edu-item:last-child {
        margin-bottom: 0;
      }

      .edu-degree {
        font-weight: 700;
        margin-bottom: 2px;
      }

      .edu-inst,
      .edu-meta {
        opacity: 0.88;
        font-size: calc(var(--fs) * 0.9);
        line-height: 1.35;
      }

      .skill-list,
      .lang-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-size: calc(var(--fs) * 0.95);
        opacity: 0.95;
      }

      /* ── RIGHT CONTENT ── */
      .content {
        background: #fff;
        padding: 36px 32px 28px 28px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        min-height: 297mm;
        box-sizing: border-box;
      }

      .name-header {
        margin-bottom: 4px;
      }

      .cv-name {
        margin: 0;
        display: flex;
        flex-direction: column;
        line-height: 1.05;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .cv-firstname,
      .cv-lastname {
        font-size: calc(var(--fs) * 3.2);
        font-weight: 800;
      }

      .cv-title {
        margin: 10px 0 0;
        font-size: calc(var(--fs) * 1.15);
        font-weight: 500;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: #6b7280;
      }

      .cv-section {
        display: flex;
        flex-direction: column;
      }

      .sec-heading {
        margin: 0;
        font-size: calc(var(--fs) * 1.2);
        font-weight: 700;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: var(--accent);
      }

      .sec-rule {
        width: 100%;
        height: 1.5px;
        background: var(--accent);
        opacity: 0.85;
        margin: 6px 0 12px;
      }

      .about-text {
        margin: 0;
        font-size: calc(var(--fs) * 0.98);
        color: #4b5563;
        text-align: justify;
        line-height: var(--lh);
      }

      /* Experience with year rail */
      .exp-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .exp-item {
        display: grid;
        grid-template-columns: 42px 10px 1fr;
        gap: 0;
        align-items: stretch;
      }

      .exp-years {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-start;
        padding-top: 2px;
        font-size: calc(var(--fs) * 0.88);
        color: #6b7280;
        line-height: 1.25;
        text-align: right;
      }

      .exp-rail {
        width: 1.5px;
        background: var(--accent);
        opacity: 0.55;
        margin: 2px 0 2px 8px;
        justify-self: start;
      }

      .exp-body {
        padding-left: 12px;
      }

      .exp-position {
        font-size: calc(var(--fs) * 1.1);
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 1px;
      }

      .exp-company {
        font-size: calc(var(--fs) * 0.95);
        color: #6b7280;
        margin-bottom: 5px;
      }

      .exp-desc {
        margin: 0 0 4px;
        font-size: calc(var(--fs) * 0.92);
        color: #4b5563;
        line-height: var(--lh);
        text-align: justify;
      }

      /* References two-column */
      .ref-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px 18px;
      }

      .ref-card {
        font-size: calc(var(--fs) * 0.92);
        color: #4b5563;
        line-height: 1.4;
      }

      .ref-name {
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 2px;
      }

      .ref-company,
      .ref-phone,
      .ref-email {
        color: #6b7280;
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
          box-shadow: none !important;
          overflow: visible !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color-adjust: exact;
        }
        .cv-layout,
        .sidebar,
        .content {
          min-height: 0 !important;
        }
        .cv-section,
        .exp-item {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        @page {
          size: A4 portrait;
          margin: 0;
        }
      }
    `,
  ],
})
export class GeometricSidebarCvComponent {
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
  @Input() references: CvReference[] = [];
  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.45;
  @Input() fontFamily = "'Segoe UI', Arial, Helvetica, sans-serif";

  get firstName(): string {
    const p = (this.name || 'ISABEL SCHUMACHER').trim().split(/\s+/);
    return p.length > 1 ? p.slice(0, -1).join(' ') : p[0];
  }

  get lastName(): string {
    const p = (this.name || 'ISABEL SCHUMACHER').trim().split(/\s+/);
    return p.length > 1 ? p[p.length - 1] : '';
  }

  get initials(): string {
    return (this.name || 'IS')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || '')
      .join('');
  }

  degreeLine(ed: CvEducation): string {
    return [ed.degree, ed.field].filter(Boolean).join(' in ') || 'Degree';
  }

  formatRange(start?: string, end?: string, current?: boolean): string {
    const s = start || '';
    const e = current ? 'Present' : end || '';
    if (s && e) return `${s}–${e}`;
    return s || e || '';
  }

  /** Split date range into stacked year lines like the reference (2021 / - / 2022). */
  yearLines(job: CvExperience): string[] {
    const start = this.extractYear(job.startDate);
    const end = job.current ? 'Present' : this.extractYear(job.endDate);
    if (start && end) return [start, '–', end];
    if (start) return [start];
    if (end) return [end];
    return ['—'];
  }

  private extractYear(value?: string): string {
    if (!value) return '';
    const m = value.match(/(19|20)\d{2}/);
    return m ? m[0] : value;
  }
}
