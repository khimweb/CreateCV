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

export interface CvHobby {
  name?: string;
}

/**
 * Modern Split CV — matches the reference design:
 * Dark navy left sidebar (photo, contact, language bars, reference, hobbies)
 * White right content area (name/title header, profile, education timeline, experience timeline, skills grid)
 */
@Component({
  selector: 'app-modern-split-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv-paper"
      [style.--accent]="accent"
      [style.--fs.px]="fontSize"
      [style.--fw]="fontWeight"
      [style.--lh]="lineHeight"
      [style.font-family]="fontFamily"
    >
      <div class="cv-layout">

        <!-- ═══════════════ LEFT SIDEBAR ═══════════════ -->
        <aside class="sidebar">

          <!-- Circular photo -->
          <div class="photo-wrap">
            <div class="photo-ring">
              @if (photoUrl) {
                <img [src]="photoUrl" alt="Profile photo" />
              } @else {
                <span class="initials">{{ initials }}</span>
              }
            </div>
          </div>

          <!-- CONTACT -->
          <div class="sb-section">
            <div class="sb-label">
              <span class="sb-arrow">&#9658;</span>
              <span>CONTACT</span>
            </div>
            <div class="sb-body">
              @if (email) {
                <div class="contact-row">
                  <svg class="ci" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>{{ email }}</span>
                </div>
              }
              @if (phone) {
                <div class="contact-row">
                  <svg class="ci" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.58a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>{{ phone }}</span>
                </div>
              }
              @if (location) {
                <div class="contact-row">
                  <svg class="ci" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{{ location }}</span>
                </div>
              }
            </div>
          </div>

          <!-- LANGUAGE -->
          @if (languages.length) {
            <div class="sb-section">
              <div class="sb-label">
                <span class="sb-arrow">&#9658;</span>
                <span>LANGUAGE</span>
              </div>
              <div class="sb-body">
                @for (lang of languages; track $index) {
                  @if (lang.name) {
                    <div class="lang-row">
                      <span class="lang-name">{{ lang.name }}</span>
                      <div class="lang-bars">
                        @for (bar of [1,2,3,4,5,6,7]; track bar) {
                          <span class="lang-bar" [class.filled]="bar <= langLevel(lang.proficiency)"></span>
                        }
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          }

          <!-- REFERENCE -->
          @if (references.length) {
            <div class="sb-section">
              <div class="sb-label">
                <span class="sb-arrow">&#9658;</span>
                <span>REFERENCE</span>
              </div>
              <div class="sb-body">
                @for (ref of references; track $index) {
                  @if (ref.name) {
                    <div class="ref-block">
                      <div class="ref-name">{{ ref.name }}</div>
                      @if (ref.position) { <div class="ref-pos">{{ ref.position }}</div> }
                      @if (ref.company) { <div class="ref-company">{{ ref.company }}</div> }
                      @if (ref.phone) {
                        <div class="ref-detail">
                          <strong>Phone:</strong> {{ ref.phone }}
                        </div>
                      }
                      @if (ref.email) {
                        <div class="ref-detail">
                          <strong>Mail:</strong> {{ ref.email }}
                        </div>
                      }
                    </div>
                  }
                }
              </div>
            </div>
          }

          <!-- HOBBIES -->
          @if (hobbies.length) {
            <div class="sb-section">
              <div class="sb-label">
                <span class="sb-arrow">&#9658;</span>
                <span>HOBBIES</span>
              </div>
              <div class="sb-body">
                <div class="hobbies-grid">
                  @for (h of hobbies; track $index) {
                    @if (h.name) {
                      <div class="hobby-icon-wrap">
                        <div class="hobby-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <polygon points="10 8 16 12 10 16 10 8"/>
                          </svg>
                        </div>
                        <span class="hobby-label">{{ h.name }}</span>
                      </div>
                    }
                  }
                </div>
              </div>
            </div>
          }

        </aside>
        <!-- ═══════════════ END LEFT SIDEBAR ═══════════════ -->


        <!-- ═══════════════ RIGHT CONTENT ═══════════════ -->
        <main class="content">

          <!-- Name / Title Header -->
          <header class="name-header">
            <h1 class="cv-name">{{ firstName }} <span class="cv-lastname">{{ lastName }}</span></h1>
            @if (jobTitle) {
              <p class="cv-title">{{ jobTitle }}</p>
            }
            <div class="header-rule"></div>
          </header>

          <!-- PROFILE -->
          @if (summary) {
            <section class="cv-section">
              <div class="sec-heading">
                <svg class="sec-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <h2>PROFILE</h2>
              </div>
              <div class="sec-rule"></div>
              <p class="profile-text">{{ summary }}</p>
            </section>
          }

          <!-- EDUCATION -->
          @if (education.length) {
            <section class="cv-section">
              <div class="sec-heading">
                <svg class="sec-icon" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <h2>EDUCATION</h2>
              </div>
              <div class="sec-rule"></div>
              <div class="timeline">
                @for (ed of education; track $index) {
                  <div class="tl-item">
                    <div class="tl-dot"></div>
                    <div class="tl-body">
                      <div class="tl-title">{{ degreeLine(ed) }}</div>
                      @if (ed.institution) { <div class="tl-sub">{{ ed.institution }}</div> }
                      <div class="tl-date">({{ formatRange(ed.startYear, ed.endYear, ed.current) }})</div>
                      @if (ed.description) { <p class="tl-desc">{{ ed.description }}</p> }
                    </div>
                  </div>
                }
              </div>
            </section>
          }

          <!-- EXPERIENCE -->
          @if (experience.length) {
            <section class="cv-section">
              <div class="sec-heading">
                <svg class="sec-icon" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <h2>EXPERIENCE</h2>
              </div>
              <div class="sec-rule"></div>
              <div class="timeline">
                @for (job of experience; track $index) {
                  <div class="tl-item">
                    <div class="tl-dot"></div>
                    <div class="tl-body">
                      <div class="tl-title">{{ job.position || 'Position' }}</div>
                      @if (job.company) { <div class="tl-sub">{{ job.company }}</div> }
                      <div class="tl-date">({{ formatRange(job.startDate, job.endDate, job.current) }})</div>
                      @if (job.responsibilities?.length) {
                        @for (r of job.responsibilities; track $index) {
                          @if (r) { <p class="tl-desc">{{ r }}</p> }
                        }
                      }
                    </div>
                  </div>
                }
              </div>
            </section>
          }

          <!-- SKILLS -->
          @if (skills.length) {
            <section class="cv-section">
              <div class="sec-heading">
                <svg class="sec-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <h2>SKILLS</h2>
              </div>
              <div class="sec-rule"></div>
              <div class="skills-grid">
                @for (skill of skills; track $index) {
                  @if (skill.name) {
                    <div class="skill-cell">
                      <span class="skill-bullet">&#9632;</span>
                      <span class="skill-name">{{ skill.name | uppercase }}</span>
                    </div>
                  }
                }
              </div>
            </section>
          }

        </main>
        <!-- ═══════════════ END RIGHT CONTENT ═══════════════ -->

      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }

    /* ── PAPER ── */
    .cv-paper {
      --accent: #1b3a5c;
      --fs: 10px;
      --fw: 400;
      --lh: 1.45;
      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      font-family: Arial, Helvetica, sans-serif;
      font-size: var(--fs);
      font-weight: var(--fw);
      line-height: var(--lh);
      background: #fff;
      color: #222;
    }

    /* ── TWO-COLUMN LAYOUT ── */
    .cv-layout {
      display: grid;
      grid-template-columns: 220px 1fr;
      min-height: 297mm;
    }

    /* ══════════════════════════════════════
       LEFT SIDEBAR
    ══════════════════════════════════════ */
    .sidebar {
      background: var(--accent);
      color: #fff;
      padding: 28px 0 28px 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* Circular photo */
    .photo-wrap {
      display: flex;
      justify-content: center;
      padding: 0 16px 24px;
    }
    .photo-ring {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 3px dashed rgba(255,255,255,0.55);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.08);
      flex-shrink: 0;
    }
    .photo-ring img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .initials {
      font-size: calc(var(--fs) * 3.5);
      font-weight: 700;
      color: rgba(255,255,255,0.85);
      letter-spacing: 2px;
    }

    /* Arrow-tab section label */
    .sb-section {
      padding: 0 0 18px 0;
    }
    .sb-label {
      display: flex;
      align-items: center;
      gap: 0;
      background: rgba(255,255,255,0.13);
      padding: 7px 14px 7px 10px;
      margin-bottom: 12px;
      position: relative;
      font-size: calc(var(--fs) * 1.15);
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .sb-arrow {
      font-size: calc(var(--fs) * 1.2);
      margin-right: 8px;
      color: rgba(255,255,255,0.75);
    }
    .sb-body {
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 9px;
    }

    /* Contact rows */
    .contact-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: calc(var(--fs) * 0.95);
      word-break: break-word;
    }
    .ci {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      margin-top: 1px;
      stroke: rgba(255,255,255,0.8);
      fill: none;
      stroke-width: 2;
    }

    /* Language bars */
    .lang-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    .lang-name {
      font-size: calc(var(--fs) * 1);
      font-weight: 500;
      min-width: 60px;
    }
    .lang-bars {
      display: flex;
      gap: 3px;
    }
    .lang-bar {
      width: 14px;
      height: 4px;
      border-radius: 2px;
      background: rgba(255,255,255,0.25);
    }
    .lang-bar.filled {
      background: rgba(255,255,255,0.88);
    }

    /* Reference block */
    .ref-block {
      font-size: calc(var(--fs) * 0.95);
      margin-bottom: 10px;
    }
    .ref-name {
      font-weight: 700;
      font-size: calc(var(--fs) * 1.05);
      margin-bottom: 2px;
    }
    .ref-pos {
      font-style: italic;
      opacity: 0.9;
      margin-bottom: 1px;
    }
    .ref-company {
      opacity: 0.85;
      margin-bottom: 4px;
      font-style: italic;
    }
    .ref-detail {
      font-size: calc(var(--fs) * 0.88);
      opacity: 0.85;
      margin-bottom: 1px;
    }

    /* Hobbies icons */
    .hobbies-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 14px 8px;
    }
    .hobby-icon-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      width: 44px;
    }
    .hobby-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hobby-icon svg {
      width: 18px;
      height: 18px;
      stroke: rgba(255,255,255,0.9);
    }
    .hobby-label {
      font-size: calc(var(--fs) * 0.8);
      text-align: center;
      opacity: 0.9;
      line-height: 1.2;
    }

    /* ══════════════════════════════════════
       RIGHT CONTENT
    ══════════════════════════════════════ */
    .content {
      background: #fff;
      padding: 30px 28px 28px 28px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    /* Name header */
    .name-header {
      margin-bottom: 4px;
    }
    .cv-name {
      font-size: calc(var(--fs) * 3.4);
      font-weight: 900;
      color: #1b2a3b;
      margin: 0;
      line-height: 1.05;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .cv-lastname {
      color: var(--accent);
    }
    .cv-title {
      font-size: calc(var(--fs) * 1.25);
      font-weight: 500;
      color: #555;
      margin: 6px 0 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .header-rule {
      height: 3px;
      background: var(--accent);
      width: 100%;
      border-radius: 2px;
    }

    /* Section block */
    .cv-section {
      margin-bottom: 2px;
    }

    /* Section heading: icon + title */
    .sec-heading {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }
    .sec-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      stroke: var(--accent);
      fill: none;
      stroke-width: 2;
    }
    .sec-heading h2 {
      font-size: calc(var(--fs) * 1.5);
      font-weight: 800;
      color: #1b2a3b;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .sec-rule {
      height: 2px;
      background: #d0d8e4;
      margin-bottom: 12px;
      border-radius: 1px;
    }

    /* Profile text */
    .profile-text {
      font-size: calc(var(--fs) * 1);
      line-height: var(--lh);
      color: #444;
      margin: 0;
    }

    /* Timeline (Education & Experience) */
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding-left: 6px;
    }
    .tl-item {
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .tl-dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--accent);
      border: 2px solid #b0bec8;
      flex-shrink: 0;
      margin-top: 3px;
    }
    .tl-body {
      flex: 1;
    }
    .tl-title {
      font-size: calc(var(--fs) * 1.15);
      font-weight: 700;
      color: #1b2a3b;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 2px;
    }
    .tl-sub {
      font-size: calc(var(--fs) * 1);
      font-style: italic;
      color: #555;
      margin-bottom: 2px;
    }
    .tl-date {
      font-size: calc(var(--fs) * 0.9);
      color: #777;
      margin-bottom: 4px;
    }
    .tl-desc {
      font-size: calc(var(--fs) * 0.95);
      color: #555;
      line-height: var(--lh);
      margin: 3px 0 0;
    }

    /* Skills grid — 2 columns with square bullet */
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 16px;
    }
    .skill-cell {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .skill-bullet {
      color: var(--accent);
      font-size: calc(var(--fs) * 0.8);
      flex-shrink: 0;
    }
    .skill-name {
      font-size: calc(var(--fs) * 0.95);
      font-weight: 600;
      color: #333;
      letter-spacing: 0.3px;
    }

    /* ── PRINT ── */
    @media print {
      :host { display: block; height: auto !important; overflow: visible !important; }
      .cv-paper {
        width: 100% !important;
        min-height: 0 !important;
        box-shadow: none !important;
        overflow: visible !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        color-adjust: exact;
      }
      .cv-layout { min-height: 0 !important; }
      .cv-section, .tl-item { break-inside: avoid; page-break-inside: avoid; }
      @page { size: A4 portrait; margin: 0; }
    }
  `],
})
export class ModernSplitCvComponent {
  @Input() accent = '#1b3a5c';
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
  @Input() hobbies: CvHobby[] = [];

  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.45;
  @Input() fontFamily = 'Arial, Helvetica, sans-serif';
  @Input() sectionLines = true;

  get firstName(): string {
    const parts = (this.name || 'JOHN SMITH').trim().split(/\s+/);
    return parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0];
  }
  get lastName(): string {
    const parts = (this.name || 'JOHN SMITH').trim().split(/\s+/);
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }
  get initials(): string {
    const parts = (this.name || 'JS').trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('');
  }

  degreeLine(ed: CvEducation): string {
    return [ed.degree, ed.field].filter(Boolean).join(' in ') || 'Degree';
  }

  formatRange(start?: string, end?: string, current?: boolean): string {
    const s = start || '';
    const e = current ? 'Present' : (end || '');
    if (s && e) return `${s} – ${e}`;
    return s || e || '';
  }

  /** Map proficiency string to 1-7 filled bars */
  langLevel(proficiency?: string): number {
    const map: Record<string, number> = {
      Beginner: 1, Basic: 2, Elementary: 2,
      Intermediate: 4, Conversational: 3,
      Fluent: 6, Advanced: 5, Native: 7,
    };
    return map[proficiency || ''] ?? 3;
  }
}
